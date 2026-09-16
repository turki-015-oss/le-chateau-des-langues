"use client";

import {useEffect,useRef,useState} from "react";
import {ChevronLeft,ChevronRight,RotateCcw,Volume2} from "lucide-react";
import {cancelFrenchSpeech,speakFrenchSequence} from "@/lib/frenchSpeech";

const WELLBEING_SCENES=[
 {
  title:"Conversation formelle",ar:"محادثة رسمية",image:"/images/university/a1-greetings/dialogue-scenes/formal-station.webp",
  lines:[
   {fr:"Bonjour, monsieur. Comment allez-vous ?",ar:"مرحبًا يا سيدي، كيف حالك؟",speaker:"left"},
   {fr:"Je vais bien, merci. Et vous ?",ar:"أنا بخير، شكرًا. وأنت؟",speaker:"right"},
   {fr:"Très bien, merci.",ar:"بخير جدًا، شكرًا.",speaker:"left"}
  ]
 },
 {
  title:"Conversation informelle",ar:"محادثة غير رسمية",image:"/images/university/a1-greetings/dialogue-scenes/informal-station.webp",
  lines:[
   {fr:"Salut, Khalid ! Ça va ?",ar:"مرحبًا يا خالد! كيف حالك؟",speaker:"left"},
   {fr:"Oui, ça va bien, merci. Et toi ?",ar:"نعم، أنا بخير، شكرًا. وأنت؟",speaker:"right"},
   {fr:"Ça va, merci.",ar:"أنا بخير، شكرًا.",speaker:"left"}
  ]
 }
] as const;

const FAREWELL_SCENES=[
 {
  title:"Conversation formelle",ar:"محادثة رسمية",image:"/images/university/a1-greetings/dialogue-scenes/formal-airport.webp",
  lines:[
   {fr:"Au revoir, monsieur. Bon voyage !",ar:"إلى اللقاء يا سيدي. رحلة موفقة!",speaker:"left"},
   {fr:"Merci beaucoup. Au revoir !",ar:"شكرًا جزيلًا. إلى اللقاء!",speaker:"right"},
   {fr:"À bientôt !",ar:"إلى اللقاء قريبًا!",speaker:"left"}
  ]
 },
 {
  title:"Conversation informelle",ar:"محادثة غير رسمية",image:"/images/university/a1-greetings/dialogue-scenes/informal-airport.webp",
  lines:[
   {fr:"Bon voyage, Khalid !",ar:"رحلة موفقة يا خالد!",speaker:"left"},
   {fr:"Merci ! À bientôt !",ar:"شكرًا! أراك قريبًا!",speaker:"right"},
   {fr:"À bientôt !",ar:"أراك قريبًا!",speaker:"left"}
  ]
 }
] as const;

const INTRODUCTION_SCENES=[
 {
  title:"Présentation formelle",ar:"تعارف رسمي",image:"/images/university/a1-greetings/dialogue-scenes/formal-introduction.webp",
  lines:[
   {fr:"Bonjour, monsieur. Comment vous appelez-vous ?",ar:"مرحبًا يا سيدي. ما اسمك؟",speaker:"left"},
   {fr:"Je m’appelle Karim.",ar:"اسمي كريم.",speaker:"right"},
   {fr:"D’où venez-vous ?",ar:"من أين أنت؟",speaker:"left"},
   {fr:"Je viens du Maroc.",ar:"أنا من المغرب.",speaker:"right"},
   {fr:"Où habitez-vous ?",ar:"أين تسكن؟",speaker:"left"},
   {fr:"J’habite à Lyon.",ar:"أسكن في ليون.",speaker:"right"}
  ]
 },
 {
  title:"Présentation informelle",ar:"تعارف غير رسمي",image:"/images/university/a1-greetings/dialogue-scenes/informal-introduction.webp",
  lines:[
   {fr:"Salut ! Je suis Adam. Et toi ?",ar:"مرحبًا! أنا آدم. وأنت؟",speaker:"left"},
   {fr:"Je suis Omar.",ar:"أنا عمر.",speaker:"right"},
   {fr:"Tu habites où ?",ar:"أين تسكن؟",speaker:"left"},
   {fr:"J’habite à Marseille.",ar:"أسكن في مرسيليا.",speaker:"right"},
   {fr:"Tu parles français ?",ar:"هل تتحدث الفرنسية؟",speaker:"left"},
   {fr:"Oui, un peu.",ar:"نعم، قليلًا.",speaker:"right"}
  ]
 }
] as const;

export default function GreetingDialogueScene({variant="wellbeing"}:{variant?:"wellbeing"|"farewell"|"introduction"}){
 const [sceneIndex,setSceneIndex]=useState(0);
 const [activeLine,setActiveLine]=useState(-1);
 const [status,setStatus]=useState<"ready"|"playing"|"done">("ready");
 const runId=useRef(0);
 const ambience=useRef<HTMLAudioElement|null>(null);
 const footsteps=useRef<HTMLAudioElement|null>(null);
 const stepTimer=useRef<number|null>(null);
 const fadeTimer=useRef<number|null>(null);
 const safetyTimer=useRef<number|null>(null);
 const scenes=variant==="farewell"?FAREWELL_SCENES:variant==="introduction"?INTRODUCTION_SCENES:WELLBEING_SCENES;
 const scene=scenes[sceneIndex];

 function stopAudio(){
  if(stepTimer.current!==null)window.clearTimeout(stepTimer.current);
  if(fadeTimer.current!==null)window.clearInterval(fadeTimer.current);
  if(safetyTimer.current!==null)window.clearTimeout(safetyTimer.current);
  stepTimer.current=null;
  fadeTimer.current=null;
  safetyTimer.current=null;
  for(const sound of [ambience.current,footsteps.current]){
   if(sound){sound.pause();sound.currentTime=0;}
  }
  ambience.current=null;
  footsteps.current=null;
 }

 function stopConversation(){
  runId.current+=1;
  cancelFrenchSpeech();
  stopAudio();
 }

 useEffect(()=>()=>{
  runId.current+=1;
  cancelFrenchSpeech();
  if(stepTimer.current!==null)window.clearTimeout(stepTimer.current);
  if(fadeTimer.current!==null)window.clearInterval(fadeTimer.current);
  if(safetyTimer.current!==null)window.clearTimeout(safetyTimer.current);
  ambience.current?.pause();
  footsteps.current?.pause();
 },[]);

 function fadeAmbience(currentRun:number){
  footsteps.current?.pause();
  const sound=ambience.current;
  if(!sound)return;
  fadeTimer.current=window.setInterval(()=>{
   if(currentRun!==runId.current){window.clearInterval(fadeTimer.current!);fadeTimer.current=null;return;}
   sound.volume=Math.max(0,sound.volume-.018);
   if(sound.volume===0){sound.pause();window.clearInterval(fadeTimer.current!);fadeTimer.current=null;}
  },90);
 }

 function playConversation(){
  stopConversation();
  const currentRun=runId.current;
  setActiveLine(-1);
  setStatus("playing");

  if(variant!=="introduction"){
   const background=new Audio(variant==="farewell"?"/audio/a1-greetings/airport-ambience.mp3":"/audio/a1-greetings/station-ambience.mp3");
   background.volume=.085;
   background.loop=true;
   ambience.current=background;
   void background.play().catch(()=>{});

   const steps=new Audio("/audio/a1-greetings/footsteps-tunnel.mp3");
   steps.volume=.14;
   footsteps.current=steps;
   void steps.play().catch(()=>{});
   stepTimer.current=window.setTimeout(()=>{steps.pause();stepTimer.current=null},1750);
  }

  safetyTimer.current=window.setTimeout(()=>{
   if(currentRun!==runId.current)return;
   setStatus("done");
   fadeAmbience(currentRun);
  },variant==="introduction"?60000:28000);

  // Start speech from the same tap that starts the scene so iOS can authorize it.
  void speakFrenchSequence(scene.lines.map(line=>line.fr),680,{
   rate:.8,
   onEnd:()=>{
    if(currentRun!==runId.current)return;
    if(safetyTimer.current!==null)window.clearTimeout(safetyTimer.current);
    safetyTimer.current=null;
    setStatus("done");
    fadeAmbience(currentRun);
   },
   onError:()=>{
    if(currentRun!==runId.current)return;
    if(safetyTimer.current!==null)window.clearTimeout(safetyTimer.current);
    safetyTimer.current=null;
    setStatus("done");
    fadeAmbience(currentRun);
   }
  },lineIndex=>{
   if(currentRun===runId.current)setActiveLine(lineIndex);
  }).then(result=>{
   if(result||currentRun!==runId.current)return;
   if(safetyTimer.current!==null)window.clearTimeout(safetyTimer.current);
   safetyTimer.current=null;
   setStatus("done");
   fadeAmbience(currentRun);
  });
 }

 function changeScene(nextIndex:number){
  if(nextIndex<0||nextIndex>=scenes.length)return;
  stopConversation();
  setSceneIndex(nextIndex);
  setActiveLine(-1);
  setStatus("ready");
 }

 const line=activeLine>=0?scene.lines[activeLine]:null;
 return <div className="a1-dialogue-carousel">
  <div className="a1-dialogue-heading"><strong dir="ltr">{scene.title}</strong><span>{scene.ar}</span></div>
  <button type="button" className={`a1-dialogue-scene ${status==="playing"?"playing":""}`} onClick={playConversation} aria-label={status==="ready"?`تشغيل ${scene.ar}`:`إعادة ${scene.ar} من البداية`}>
   <img src={scene.image} alt="" loading="lazy"/>
   {line&&<div key={`${sceneIndex}-${activeLine}`} className={`a1-dialogue-bubble ${line.speaker}`} aria-live="polite"><strong dir="ltr">{line.fr}</strong><span>{line.ar}</span></div>}
   {status==="ready"&&<span className="a1-dialogue-prompt"><Volume2/> اضغط على الصورة لسماع المحادثة</span>}
   {status==="done"&&<span className="a1-dialogue-prompt"><RotateCcw/> اضغط لإعادة المحادثة</span>}
   {status==="playing"&&<span className="a1-dialogue-playing" aria-hidden="true"><span/><span/><span/></span>}
  </button>
  <nav className="a1-time-greeting-navigation" dir="ltr" aria-label="التنقل بين المحادثات">
   <button type="button" onClick={()=>changeScene(sceneIndex-1)} disabled={sceneIndex===0} aria-label="المحادثة السابقة"><ChevronLeft/></button>
   <span>{sceneIndex+1} / {scenes.length}</span>
   <button type="button" onClick={()=>changeScene(sceneIndex+1)} disabled={sceneIndex===scenes.length-1} aria-label="المحادثة التالية"><ChevronRight/></button>
  </nav>
 </div>;
}
