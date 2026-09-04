"use client";

import { LocateFixed, Navigation, Power, ShieldCheck, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type CompassStatus = "detecting" | "permission" | "active" | "unavailable" | "denied" | "disabled";
type LocationStatus = "idle" | "locating" | "ready" | "denied" | "unavailable";
type OrientationWithWebkit = DeviceOrientationEvent & { webkitCompassHeading?: number };
type OrientationConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: (absolute?: boolean) => Promise<PermissionState>;
};

const KAABA = { latitude: 21.422487, longitude: 39.826206 };
const directions = ["الشمال", "شمال شرق", "الشرق", "جنوب شرق", "الجنوب", "جنوب غرب", "الغرب", "شمال غرب"];

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

  useEffect(()=>{
    if(!enabled){
      setCompassStatus("disabled");
      setHeading(null);
      return;
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
      } else if (typeof event.alpha === "number" && (event.absolute || rawEvent.type === "deviceorientationabsolute")) {
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

  const locateQibla=()=>{
    if (!("geolocation" in navigator)) {
      setLocationStatus("unavailable");
      return;
    }
    setLocationStatus("locating");
    navigator.geolocation.getCurrentPosition(position=>{
      const {latitude,longitude,accuracy:positionAccuracy}=position.coords;
      setQiblaBearing(bearingToKaaba(latitude,longitude));
      setDistance(distanceToKaaba(latitude,longitude));
      setAccuracy(positionAccuracy);
      setLocationStatus("ready");
    },error=>{
      setLocationStatus(error.code===error.PERMISSION_DENIED?"denied":"unavailable");
    },{enableHighAccuracy:true,timeout:12000,maximumAge:300000});
  };

  const requestSensorPermission=async()=>{
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

  const activate=()=>{
    setOpen(true);
    if(!enabled)setEnabled(true);
    void requestSensorPermission();
    if(locationStatus!=="ready"&&locationStatus!=="locating")locateQibla();
  };

  const togglePower=async()=>{
    if(enabled){
      setEnabled(false);
      return;
    }
    setEnabled(true);
    void requestSensorPermission();
    if(locationStatus!=="ready"&&locationStatus!=="locating")locateQibla();
  };

  const headingLabel=useMemo(()=>heading===null?"لم يُحدّد بعد":directions[Math.round(heading/45)%8],[heading]);
  const relativeQibla=qiblaBearing===null?null:normalizeDegrees(qiblaBearing-(heading??0));
  const aligned=enabled&&relativeQibla!==null&&(relativeQibla<=4||relativeQibla>=356);
  const northRotation=normalizeDegrees(-(heading??0));
  const qiblaRotation=relativeQibla??0;

  return <>
    <div className="smart-compass-control">
      <button type="button" className={`smart-compass-trigger ${aligned?"aligned":""} ${enabled?"":"disabled"}`} onClick={activate} aria-label="فتح بوصلة الشمال والقبلة">
        <span className="smart-compass-mini" aria-hidden="true">
          <b>N</b>
          <i className="smart-north-needle" style={{transform:`rotate(${northRotation}deg)`}}/>
          {qiblaBearing!==null&&<i className="smart-qibla-mini" style={{transform:`rotate(${qiblaRotation}deg)`}}/>}
        </span>
        <span><strong>البوصلة والقبلة</strong><small>{!enabled?"متوقفة":qiblaBearing===null?"جارٍ تحديد القبلة":aligned?"أنت باتجاه القبلة":`${Math.round(qiblaBearing)}° QIBLA`}</small></span>
      </button>
      <button type="button" className={`smart-compass-side-power ${enabled?"active":""}`} onClick={togglePower} aria-label={enabled?"إيقاف البوصلة":"تشغيل البوصلة"} title={enabled?"إيقاف البوصلة":"تشغيل البوصلة"}><Power/><span>{enabled?"إيقاف":"تشغيل"}</span></button>
    </div>

    {open&&<div className="smart-compass-overlay" onClick={()=>setOpen(false)}>
      <section className="smart-compass-panel" role="dialog" aria-modal="true" aria-labelledby="smart-compass-title" onClick={event=>event.stopPropagation()}>
        <header>
          <div><small>COMPASS · QIBLA</small><h2 id="smart-compass-title">البوصلة العالمية</h2></div>
          <button type="button" onClick={()=>setOpen(false)} aria-label="إغلاق البوصلة"><X/></button>
        </header>

        <div className={`smart-compass-instrument ${aligned?"aligned":""}`}>
          <div className="smart-compass-dial">
            <span className="smart-cardinals"><b className="n">N</b><b className="e">E</b><b className="s">S</b><b className="w">W</b></span>
            <i className="smart-north-hand" style={{transform:`rotate(${northRotation}deg)`}}><span/></i>
            {qiblaBearing!==null&&<i className="smart-qibla-hand" style={{transform:`rotate(${qiblaRotation}deg)`}}><span><b>◆</b><small>القبلة</small></span></i>}
            <span className="smart-heading-index" aria-hidden="true"/>
            <div className="smart-heading-value"><strong>{heading===null?"—":String(Math.round(heading)).padStart(3,"0")}°</strong><small>{headingLabel}</small></div>
          </div>
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
          <p>{compassStatus==="disabled"?"البوصلة متوقفة ولا تقرأ حساس الاتجاه الآن.":compassStatus==="denied"?"تم رفض إذن الحركة. فعّله من إعدادات المتصفح ثم أعد المحاولة.":compassStatus==="unavailable"?"لا يرسل هذا الجهاز بيانات بوصلة؛ يمكنك رؤية زاوية القبلة لكن التوجيه الحي يحتاج هاتفًا مزودًا بحساس اتجاه.":locationStatus==="denied"?"تم رفض إذن الموقع. اسمح بالموقع لحساب القبلة من مكانك.":"يُستخدم موقعك داخل جهازك لحساب القبلة ولا يتم حفظه أو إرساله."}{accuracy!==null&&locationStatus==="ready"?<small> دقة الموقع الحالية نحو {Math.round(accuracy)} متر.</small>:null}</p>
        </div>
        <p className="smart-compass-calibration">اترك الهاتف بوضعه الطبيعي؛ ستتجه الإبرة الحمراء إلى الشمال تلقائيًا. أبعده فقط عن المعادن عند ضعف الدقة.</p>
      </section>
    </div>}
  </>;
}
