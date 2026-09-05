"use client";

import { LocateFixed, Navigation, Power, ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Capacitor, registerPlugin, type PluginListenerHandle } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { Compass, type Heading } from "@capawesome/capacitor-compass";

type CompassStatus = "detecting" | "permission" | "active" | "unavailable" | "denied" | "disabled";
type LocationStatus = "idle" | "locating" | "ready" | "denied" | "unavailable";
type OrientationWithWebkit = DeviceOrientationEvent & { webkitCompassHeading?: number };
type OrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: (absolute?: boolean) => Promise<PermissionState>;
};
type TrueNorthPlugin = {
  getDeclination(options:{latitude:number;longitude:number;altitude?:number;timestamp?:number}):Promise<{declination:number}>;
};

const KAABA = { latitude: 21.422487, longitude: 39.826206 };
const OPEN_STATE_KEY = "smart-compass-open";
const QIBLA_STATE_KEY = "smart-compass-qibla";
const directions = ["الشمال", "شمال شرق", "الشرق", "جنوب شرق", "الجنوب", "جنوب غرب", "الغرب", "شمال غرب"];
const TrueNorth=registerPlugin<TrueNorthPlugin>("TrueNorth");

const normalizeDegrees = (value:number) => ((value % 360) + 360) % 360;
const toRadians = (value:number) => value * Math.PI / 180;
const toDegrees = (value:number) => value * 180 / Math.PI;

function bearingToKaaba(latitude:number, longitude:number) {
  const startLatitude = toRadians(latitude);
  const targetLatitude = toRadians(KAABA.latitude);
  const longitudeDelta = toRadians(KAABA.longitude - longitude);
  const y = Math.sin(longitudeDelta) * Math.cos(targetLatitude);
  const x = Math.cos(startLatitude) * Math.sin(targetLatitude)
    - Math.sin(startLatitude) * Math.cos(targetLatitude) * Math.cos(longitudeDelta);
  return normalizeDegrees(toDegrees(Math.atan2(y, x)));
}

function distanceToKaaba(latitude:number, longitude:number) {
  const earthRadius = 6371;
  const latitudeDelta = toRadians(KAABA.latitude - latitude);
  const longitudeDelta = toRadians(KAABA.longitude - longitude);
  const startLatitude = toRadians(latitude);
  const targetLatitude = toRadians(KAABA.latitude);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(startLatitude) * Math.cos(targetLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function screenAngle() {
  if (typeof window === "undefined") return 0;
  const modernAngle = window.screen.orientation?.angle;
  if (typeof modernAngle === "number") return modernAngle;
  const legacyAngle = (window as Window & { orientation?: number }).orientation;
  return typeof legacyAngle === "number" ? legacyAngle : 0;
}

export default function SmartCompass() {
  const [open,setOpen]=useState(false);
  const [enabled,setEnabled]=useState(true);
  const [authorized,setAuthorized]=useState(false);
  const [compassStatus,setCompassStatus]=useState<CompassStatus>("detecting");
  const [locationStatus,setLocationStatus]=useState<LocationStatus>("idle");
  const [heading,setHeading]=useState<number|null>(null);
  const [qiblaBearing,setQiblaBearing]=useState<number|null>(null);
  const [distance,setDistance]=useState<number|null>(null);
  const [accuracy,setAccuracy]=useState<number|null>(null);
  const latestHeading=useRef(0);
  const androidDeclination=useRef(0);
  const overlayRef=useRef<HTMLDivElement|null>(null);
  const panelRef=useRef<HTMLElement|null>(null);

  useEffect(()=>{
    try{
      if(sessionStorage.getItem(OPEN_STATE_KEY)==="1")setOpen(true);
      const cached=localStorage.getItem(QIBLA_STATE_KEY)??sessionStorage.getItem(QIBLA_STATE_KEY);
      if(cached){
        const value=JSON.parse(cached) as {bearing:number;distance:number;accuracy:number};
        if(Number.isFinite(value.bearing)&&Number.isFinite(value.distance)){
          setQiblaBearing(value.bearing);
          setDistance(value.distance);
          setAccuracy(value.accuracy);
          setLocationStatus("ready");
        }
      }
    }catch{}
  },[]);

  useEffect(()=>{
    if(!open)return;
    const previousOverflow=document.body.style.overflow;
    const resetCompassTop=()=>{
      overlayRef.current?.scrollTo({top:0,left:0});
      panelRef.current?.scrollTo({top:0,left:0});
    };
    document.body.style.overflow="hidden";
    const frame=window.requestAnimationFrame(resetCompassTop);
    window.addEventListener("orientationchange",resetCompassTop);
    window.visualViewport?.addEventListener("resize",resetCompassTop);
    return()=>{
      window.cancelAnimationFrame(frame);
      window.removeEventListener("orientationchange",resetCompassTop);
      window.visualViewport?.removeEventListener("resize",resetCompassTop);
      document.body.style.overflow=previousOverflow;
    };
  },[open]);

  useEffect(()=>{
    if(!enabled){
      setCompassStatus("disabled");
      setHeading(null);
      return;
    }
    if(Capacitor.isNativePlatform()){
      let disposed=false;
      let listener:PluginListenerHandle|null=null;
      const applyNativeHeading=(event:Heading)=>{
        if(disposed)return;
        const value=event.trueHeading??normalizeDegrees(event.magneticHeading+androidDeclination.current);
        if(!Number.isFinite(value))return;
        latestHeading.current=normalizeDegrees(value);
        setHeading(latestHeading.current);
        setCompassStatus("active");
      };
      void (async()=>{
        try{
          const {available}=await Compass.isAvailable();
          if(!available){setCompassStatus("unavailable");return}
          listener=await Compass.addListener("headingChange",applyNativeHeading);
          await Compass.startHeadingUpdates();
          applyNativeHeading(await Compass.getHeading());
        }catch{if(!disposed)setCompassStatus("unavailable")}
      })();
      return()=>{
        disposed=true;
        void listener?.remove();
        void Compass.stopHeadingUpdates();
      };
    }
    if (!("DeviceOrientationEvent" in window)) {
      setCompassStatus("unavailable");
      return;
    }
    const OrientationEvent=window.DeviceOrientationEvent as OrientationConstructor;
    if (typeof OrientationEvent.requestPermission === "function" && !authorized) {
      setCompassStatus("permission");
      return;
    }

    let received=false;
    let frame:number|null=null;
    const onOrientation=(rawEvent:Event)=>{
      const event=rawEvent as OrientationWithWebkit;
      let value:number|null=null;
      if (typeof event.webkitCompassHeading === "number" && Number.isFinite(event.webkitCompassHeading)) {
        value=event.webkitCompassHeading;
      } else if (typeof event.alpha === "number" && Number.isFinite(event.alpha)) {
        // Several Android browsers expose usable compass data through
        // `deviceorientation` while reporting `absolute: false`.
        value=360-event.alpha+screenAngle();
      }
      if (value === null) return;
      received=true;
      latestHeading.current=normalizeDegrees(value);
      if (frame === null) frame=window.requestAnimationFrame(()=>{
        frame=null;
        setHeading(latestHeading.current);
        setCompassStatus("active");
      });
    };

    window.addEventListener("deviceorientationabsolute",onOrientation,true);
    window.addEventListener("deviceorientation",onOrientation,true);
    setCompassStatus("detecting");
    const timer=window.setTimeout(()=>{if(!received)setCompassStatus("unavailable")},4500);
    return()=>{
      window.clearTimeout(timer);
      if(frame!==null)window.cancelAnimationFrame(frame);
      window.removeEventListener("deviceorientationabsolute",onOrientation,true);
      window.removeEventListener("deviceorientation",onOrientation,true);
    };
  },[authorized,enabled]);

  const applyPosition=(latitude:number,longitude:number,positionAccuracy:number)=>{
    const bearing=bearingToKaaba(latitude,longitude);
    const kaabaDistance=distanceToKaaba(latitude,longitude);
    setQiblaBearing(bearing);
    setDistance(kaabaDistance);
    setAccuracy(positionAccuracy);
    setLocationStatus("ready");
    try{
      const cachedPosition=JSON.stringify({bearing,distance:kaabaDistance,accuracy:positionAccuracy});
      localStorage.setItem(QIBLA_STATE_KEY,cachedPosition);
      sessionStorage.setItem(QIBLA_STATE_KEY,cachedPosition);
    }catch{}
  };

  const locateQibla=async()=>{
    if(Capacitor.isNativePlatform()){
      setLocationStatus("locating");
      try{
        let permission=await Geolocation.checkPermissions();
        if(permission.location!=="granted")permission=await Geolocation.requestPermissions({permissions:["location"]});
        if(permission.location!=="granted"){setLocationStatus("denied");return}
        const position=await Geolocation.getCurrentPosition({enableHighAccuracy:true,timeout:12000,maximumAge:300000});
        if(Capacitor.getPlatform()==="android"){
          try{
            const result=await TrueNorth.getDeclination({
              latitude:position.coords.latitude,
              longitude:position.coords.longitude,
              altitude:position.coords.altitude??0,
              timestamp:position.timestamp,
            });
            if(Number.isFinite(result.declination))androidDeclination.current=result.declination;
          }catch{}
        }
        applyPosition(position.coords.latitude,position.coords.longitude,position.coords.accuracy);
      }catch{setLocationStatus("unavailable")}
      return;
    }
    if (!("geolocation" in navigator)) {
      setLocationStatus("unavailable");
      return;
    }
    setLocationStatus("locating");
    navigator.geolocation.getCurrentPosition(position=>{
      const {latitude,longitude,accuracy:positionAccuracy}=position.coords;
      applyPosition(latitude,longitude,positionAccuracy);
    },error=>{
      setLocationStatus(error.code===error.PERMISSION_DENIED?"denied":"unavailable");
    },{enableHighAccuracy:true,timeout:12000,maximumAge:300000});
  };

  const requestSensorPermission=async()=>{
    if(Capacitor.isNativePlatform()){
      setAuthorized(true);
      return;
    }
    if ("DeviceOrientationEvent" in window) {
      const OrientationEvent=window.DeviceOrientationEvent as OrientationConstructor;
      if(typeof OrientationEvent.requestPermission==="function"&&!authorized){
        try{
          const permission=await OrientationEvent.requestPermission(true);
          if(permission==="granted"){
            setAuthorized(true);
            return;
          }
          setCompassStatus("denied");
        }catch{setCompassStatus("denied")}
      }else setAuthorized(true);
    }
  };

  const setCompassOpen=(next:boolean)=>{
    setOpen(next);
    try{sessionStorage.setItem(OPEN_STATE_KEY,next?"1":"0")}catch{}
  };

  const activate=async()=>{
    setCompassOpen(true);
    if(!enabled)setEnabled(true);
    await requestSensorPermission();
    if(locationStatus!=="ready"&&locationStatus!=="locating")await locateQibla();
  };

  const togglePower=async()=>{
    if(enabled){
      setEnabled(false);
      return;
    }
    setEnabled(true);
    await requestSensorPermission();
    if(locationStatus!=="ready"&&locationStatus!=="locating")await locateQibla();
  };

  const headingLabel=useMemo(()=>heading===null?"لم يُحدّد بعد":directions[Math.round(heading/45)%8],[heading]);
  const relativeQibla=qiblaBearing===null?null:normalizeDegrees(qiblaBearing-(heading??0));
  const aligned=enabled&&relativeQibla!==null&&(relativeQibla<=4||relativeQibla>=356);
  const northRotation=normalizeDegrees(-(heading??0));
  const qiblaRotation=relativeQibla??0;

  return <>
    <div className="smart-compass-control">
      <button type="button" className={`smart-compass-trigger ${aligned?"aligned":""} ${enabled?"":"disabled"}`} onClick={()=>void activate()} aria-label="فتح بوصلة الشمال والقبلة">
        <span className="smart-compass-mini" aria-hidden="true">
          <span className="smart-compass-rotor" style={{transform:`rotate(${northRotation}deg)`}}>
            <b>N</b>
            <i className="smart-north-needle"/>
          </span>
          <i className={`smart-qibla-mini ${qiblaBearing===null?"pending":""}`} style={{transform:`rotate(${qiblaRotation}deg)`}}/>
        </span>
        <span><strong>البوصلة والقبلة</strong><small>{!enabled?"متوقفة":qiblaBearing===null?"جارٍ تحديد القبلة":aligned?"أنت باتجاه القبلة":`${Math.round(qiblaBearing)}° QIBLA`}</small></span>
      </button>
      <button type="button" className={`smart-compass-side-power ${enabled?"active":""}`} onClick={togglePower} aria-label={enabled?"إيقاف البوصلة":"تشغيل البوصلة"} title={enabled?"إيقاف البوصلة":"تشغيل البوصلة"}><Power/><span>{enabled?"إيقاف":"تشغيل"}</span></button>
    </div>

    {open&&typeof document!=="undefined"&&createPortal(<div ref={overlayRef} className="smart-compass-overlay">
      <section ref={panelRef} className="smart-compass-panel" role="dialog" aria-modal="true" aria-labelledby="smart-compass-title">
        <header>
          <div><small>COMPASS · QIBLA</small><h2 id="smart-compass-title">البوصلة العالمية</h2></div>
          <button type="button" onClick={()=>setCompassOpen(false)} aria-label="إغلاق البوصلة"><X/></button>
        </header>

        <div className={`smart-compass-instrument ${aligned?"aligned":""}`}>
          <div className="smart-compass-dial">
            <span className="smart-compass-rotor" style={{transform:`rotate(${northRotation}deg)`}}>
              <span className="smart-cardinals"><b className="n">N</b><b className="e">E</b><b className="s">S</b><b className="w">W</b></span>
              <i className="smart-north-hand"><span/></i>
            </span>
            <i className={`smart-qibla-hand ${qiblaBearing===null?"pending":""}`} style={{transform:`rotate(${qiblaRotation}deg)`}}><span><b>◆</b><small>{qiblaBearing===null?"جارٍ تحديد القبلة":"القبلة"}</small></span></i>
            <span className="smart-heading-index" aria-hidden="true"/>
            <div className="smart-heading-value"><strong>{heading===null?"—":String(Math.round(heading)).padStart(3,"0")}°</strong><small>{headingLabel}</small></div>
          </div>
          <div className="smart-compass-legend" aria-label="دليل مؤشرات البوصلة"><span><i className="north"/>إبرة الشمال</span><span><i className="qibla"/>إبرة القبلة</span></div>
          <p className="smart-alignment-message">{!enabled?"البوصلة متوقفة — اضغط تشغيل للمتابعة":aligned?"أنت الآن باتجاه القبلة":"حرّك الهاتف حتى يصل مؤشر القبلة الذهبي إلى العلامة العليا"}</p>
        </div>

        <div className="smart-compass-readings">
          <article><Navigation/><span><small>الشمال</small><strong>{heading===null?"قيد التحديد":`${Math.round(heading)}° · ${headingLabel}`}</strong></span></article>
          <article><span className="smart-kaaba-icon">◆</span><span><small>اتجاه القبلة</small><strong>{qiblaBearing===null?"يحتاج إلى موقعك":`${Math.round(qiblaBearing)}° من الشمال`}</strong></span></article>
          <article><LocateFixed/><span><small>المسافة التقريبية إلى مكة</small><strong>{distance===null?"—":`${Math.round(distance).toLocaleString("ar-SA")} كم`}</strong></span></article>
        </div>

        {enabled&&(compassStatus!=="active"||locationStatus!=="ready")&&<div className="smart-compass-actions">
          <button type="button" onClick={requestSensorPermission}><Navigation/> {compassStatus==="permission"?"السماح بحساس الاتجاه":"إعادة تشغيل الاتجاه"}</button>
          <button type="button" onClick={locateQibla}><LocateFixed/> {locationStatus==="locating"?"جارٍ تحديد الموقع…":"تحديد القبلة من موقعي"}</button>
        </div>}

        <div className="smart-compass-status">
          <ShieldCheck/>
          <p>{compassStatus==="disabled"?"البوصلة متوقفة ولا تقرأ حساس الاتجاه الآن.":compassStatus==="denied"?"تم رفض إذن الحركة. فعّله من إعدادات المتصفح ثم أعد المحاولة.":compassStatus==="unavailable"?"لا يرسل هذا الجهاز بيانات بوصلة؛ يمكنك رؤية زاوية القبلة لكن التوجيه الحي يحتاج هاتفًا مزودًا بحساس اتجاه.":locationStatus==="denied"?"تم رفض إذن الموقع. اسمح بالموقع لحساب القبلة من مكانك.":Capacitor.isNativePlatform()?"تعمل البوصلة الآن بحساس النظام الأصلي، ويُستخدم موقعك داخل الجهاز فقط لحساب القبلة.":"يُستخدم موقعك داخل جهازك فقط لحساب القبلة، ولا يُرسل إلى أي جهة."}{accuracy!==null&&locationStatus==="ready"?<small> دقة الموقع الحالية نحو {Math.round(accuracy)} متر.</small>:null}</p>
        </div>
        <p className="smart-compass-calibration">يدور قرص الاتجاهات تلقائيًا حتى يتجه حرف N والإبرة الحمراء إلى الشمال، بينما تتحرك الإبرة الذهبية وحدها نحو القبلة. لا يلزم جعل القراءة 0°.</p>
      </section>
    </div>,document.body)}
  </>;
}
