"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Compass, ImagePlus, Menu, Minus, Plus, RotateCcw, Save, UserRound, Volume2, VolumeX, X } from "lucide-react";

type Place = { id:string; fr:string; ar:string; path:string; x:number; y:number; w:number; h:number };
const places: Place[] = [
  {id:"university",fr:"Université",ar:"الجامعة",path:"/entrance/university",x:7.5,y:31,w:23,h:10},
  {id:"castle",fr:"Le Château",ar:"القلعة",path:"/entrance/castle",x:33,y:27,w:36,h:23},
  {id:"stadium",fr:"Le Stade",ar:"الملعب",path:"/entrance/stadium",x:70,y:31,w:25,h:12},
  {id:"cafe",fr:"Chez Luc le Café",ar:"المقهى",path:"/entrance/cafe",x:7,y:43,w:27,h:10},
  {id:"restaurant",fr:"Le Restaurant",ar:"المطعم",path:"/entrance/restaurant",x:74,y:43,w:24,h:10},
  {id:"market",fr:"Le Marché",ar:"السوق",path:"/entrance/market",x:6,y:54,w:28,h:9},
  {id:"court",fr:"Le Tribunal",ar:"المحكمة",path:"/court",x:38,y:53,w:29,h:11},
  {id:"hospital",fr:"L’Hôpital",ar:"المستشفى",path:"/hospital",x:66,y:51,w:27,h:11},
  {id:"zoo",fr:"Le Zoo",ar:"حديقة الحيوان",path:"/entrance/zoo",x:83,y:58,w:16,h:11},
  {id:"library",fr:"La Bibliothèque",ar:"المكتبة",path:"/entrance/library",x:7,y:63,w:27,h:11},
  {id:"police",fr:"Le Commissariat",ar:"مركز الشرطة",path:"/entrance/police",x:34,y:63,w:34,h:12},
  {id:"hotel",fr:"L’Hôtel",ar:"الفندق",path:"/entrance/hotel",x:66,y:62,w:25,h:11},
  {id:"airport",fr:"L’Aéroport",ar:"المطار",path:"/entrance/airport",x:5,y:74,w:35,h:15},
  {id:"station",fr:"La Gare",ar:"محطة القطار",path:"/entrance/station",x:65,y:73,w:33,h:16},
  {id:"profile",fr:"Profil",ar:"الملف الشخصي",path:"profile",x:4,y:88,w:24,h:7},
];

const avatars = ["🧑🏻‍🎓","🧑🏻‍🏫","🧑🏻‍💼","🧭","🧳","🛡️"];
const DEFAULT_VOLUME = 28;

export default function KingdomPage(){
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement|null>(null);
  const fadeTimer = useRef<number|null>(null);
  const [scale,setScale] = useState(1);
  const [selected,setSelected] = useState<Place|null>(null);
  const [menuOpen,setMenuOpen] = useState(false);
  const [profileOpen,setProfileOpen] = useState(false);
  const [avatar,setAvatar] = useState("🧑🏻‍🎓");
  const [customAvatar,setCustomAvatar] = useState("");
  const [soundEnabled,setSoundEnabled] = useState(true);
  const [volume,setVolume] = useState(DEFAULT_VOLUME);
  const [interacted,setInteracted] = useState(false);
  const [saved,setSaved] = useState(false);

  const clearFade = ()=>{ if(fadeTimer.current!==null){ window.clearInterval(fadeTimer.current); fadeTimer.current=null; } };
  const fadeTo = useCallback((target:number, duration=650, pauseAtEnd=false)=>{
    const audio=audioRef.current; if(!audio) return;
    clearFade();
    const start=audio.volume; const steps=20; let step=0;
    fadeTimer.current=window.setInterval(()=>{
      step++; audio.volume=Math.max(0,Math.min(1,start+(target-start)*(step/steps)));
      if(step>=steps){ clearFade(); if(pauseAtEnd && target===0) audio.pause(); }
    },Math.max(20,duration/steps));
  },[]);

  const startAmbience = useCallback(async()=>{
    const audio=audioRef.current; if(!audio || !soundEnabled || !interacted) return;
    try{ audio.volume=0; await audio.play(); fadeTo(volume/100,900); }catch{}
  },[soundEnabled,interacted,volume,fadeTo]);

  useEffect(()=>{
    const storedEnabled=localStorage.getItem("lcdl-map-sound-enabled");
    const storedVolume=Number(localStorage.getItem("lcdl-map-volume"));
    const storedAvatar=localStorage.getItem("lcdl-avatar");
    const storedCustom=localStorage.getItem("lcdl-custom-avatar");
    if(storedEnabled!==null) setSoundEnabled(storedEnabled==="true");
    if(Number.isFinite(storedVolume)&&storedVolume>=0&&storedVolume<=100) setVolume(storedVolume);
    if(storedAvatar) setAvatar(storedAvatar);
    if(storedCustom) setCustomAvatar(storedCustom);
    const audio=new Audio("/audio/map-ambience.wav"); audio.loop=true; audio.preload="auto"; audioRef.current=audio;
    const first=()=>setInteracted(true);
    window.addEventListener("pointerdown",first,{once:true});
    const duck=()=>{ const a=audioRef.current; if(a&&!a.paused) fadeTo(Math.min(.07,(volume/100)*.25),300); };
    const restore=()=>{ const a=audioRef.current; if(a&&!a.paused&&soundEnabled) fadeTo(volume/100,450); };
    window.addEventListener("lcdl:speech-start",duck);
    window.addEventListener("lcdl:speech-end",restore);
    return ()=>{window.removeEventListener("pointerdown",first);window.removeEventListener("lcdl:speech-start",duck);window.removeEventListener("lcdl:speech-end",restore);clearFade();audio.pause();audio.src="";audioRef.current=null;};
  },[fadeTo,soundEnabled,volume]);

  useEffect(()=>{ if(interacted && soundEnabled) startAmbience(); },[interacted,soundEnabled,startAmbience]);
  useEffect(()=>{ localStorage.setItem("lcdl-map-sound-enabled",String(soundEnabled)); const a=audioRef.current; if(!soundEnabled&&a&&!a.paused) fadeTo(0,600,true); else if(soundEnabled&&interacted) startAmbience(); },[soundEnabled,interacted,fadeTo,startAmbience]);
  useEffect(()=>{ localStorage.setItem("lcdl-map-volume",String(volume)); const a=audioRef.current; if(a&&!a.paused&&soundEnabled) fadeTo(volume/100,180); },[volume,soundEnabled,fadeTo]);

  const openPlace=(place:Place)=>{ if(place.id==="profile"){setProfileOpen(true);return;} setSelected(place); };
  const enter=()=>{ if(!selected)return; const path=selected.path; setSelected(null); fadeTo(0,520,true); window.setTimeout(()=>router.push(path),540); };
  const saveProfile=()=>{localStorage.setItem("lcdl-avatar",avatar);localStorage.setItem("lcdl-custom-avatar",customAvatar);setSaved(true);window.setTimeout(()=>setSaved(false),1600);};
  const upload=(file?:File)=>{if(!file)return;const reader=new FileReader();reader.onload=()=>{setCustomAvatar(String(reader.result||""));setAvatar("");};reader.readAsDataURL(file);};
  const reset=()=>setScale(1);
  const avatarView=customAvatar?<img src={customAvatar} alt="الأفاتار"/>:<span>{avatar}</span>;

  return <main className="premium-map-page" dir="rtl">
    <header className="premium-map-header">
      <button onClick={()=>setMenuOpen(true)} aria-label="فتح القائمة"><Menu/></button>
      <button onClick={()=>{localStorage.setItem("lcdl-map-last-save",new Date().toISOString());setSaved(true);setTimeout(()=>setSaved(false),1500)}} aria-label="حفظ"><Save/></button>
      <div className="premium-map-title"><strong>Le Château des Langues</strong><i>◆</i></div>
      <button className="premium-avatar" onClick={()=>setProfileOpen(true)} aria-label="فتح الملف الشخصي">{avatarView}</button>
    </header>

    <section className="premium-map-stage">
      <div className="map-tools">
        <button onClick={()=>setScale(s=>Math.min(1.45,+(s+.1).toFixed(2)))} aria-label="تكبير"><Plus/></button>
        <button onClick={()=>setScale(s=>Math.max(.72,+(s-.1).toFixed(2)))} aria-label="تصغير"><Minus/></button>
        <button onClick={reset} aria-label="إعادة الضبط"><RotateCcw/></button>
      </div>
      <div className="premium-compass" aria-label="البوصلة تشير إلى الشمال"><Compass/><span>الشمال</span></div>
      <div className="map-scroll-area">
        <div className="map-image-shell" style={{transform:`scale(${scale})`}}>
          <img src="/maps/le-chateau-v71-map.jpeg" alt="خريطة Le Château des Langues" draggable={false}/>
          {places.map(p=><button key={p.id} className="map-hotspot" style={{left:`${p.x}%`,top:`${p.y}%`,width:`${p.w}%`,height:`${p.h}%`}} onClick={()=>openPlace(p)} aria-label={`${p.fr} — ${p.ar}`}/>) }
        </div>
      </div>
    </section>

    {selected&&<div className="premium-overlay" onClick={()=>setSelected(null)}><section className="entry-card" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}><X/></button><small>DESTINATION</small><h2>{selected.fr}</h2><p>{selected.ar}</p><button className="enter" onClick={enter}>دخول</button></section></div>}

    {menuOpen&&<div className="premium-overlay" onClick={()=>setMenuOpen(false)}><aside className="settings-panel" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setMenuOpen(false)}><X/></button><h2>إعدادات الخريطة</h2><div className="sound-row"><button onClick={()=>setSoundEnabled(v=>!v)}>{soundEnabled?<Volume2/>:<VolumeX/>}<span>{soundEnabled?"الصوت يعمل":"الصوت متوقف"}</span></button><b>{volume}%</b></div><input aria-label="مستوى صوت الخريطة" type="range" min="0" max="100" value={volume} onChange={e=>setVolume(Number(e.target.value))}/><button className="reset-volume" onClick={()=>setVolume(DEFAULT_VOLUME)}>إعادة المستوى الافتراضي</button><p>المؤثر المحيطي مستقل وآمن، ويمكن استبداله لاحقًا من المسار <code>/public/audio/map-ambience.wav</code>.</p></aside></div>}

    {profileOpen&&<div className="premium-overlay" onClick={()=>setProfileOpen(false)}><section className="profile-panel" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setProfileOpen(false)}><X/></button><div className="profile-preview">{avatarView}</div><h2>Profil</h2><p>الملف الشخصي</p><div className="avatar-grid">{avatars.map(a=><button key={a} onClick={()=>{setAvatar(a);setCustomAvatar("")}} className={!customAvatar&&avatar===a?"active":""}>{a}</button>)}</div><label className="upload-avatar"><ImagePlus/> رفع صورة من الجهاز<input type="file" accept="image/*" onChange={e=>upload(e.target.files?.[0])}/></label><button className="save-profile" onClick={saveProfile}>{saved?<><Check/> تم الحفظ</>:<><Save/> حفظ الاختيار</>}</button></section></div>}
    {saved&&<div className="save-toast"><Check/> تم الحفظ</div>}
  </main>
}
