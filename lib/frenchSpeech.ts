"use client";

export type FrenchSpeechOptions={
 rate?:number;
 pitch?:number;
 volume?:number;
 onBoundary?:(event:SpeechSynthesisEvent)=>void;
 onEnd?:(event:SpeechSynthesisEvent)=>void;
 onError?:(event:SpeechSynthesisErrorEvent)=>void;
};

let frenchVoices:SpeechSynthesisVoice[]=[];
let listenerInstalled=false;
let speechRequest=0;

function supported(){
 return typeof window!=="undefined"&&"speechSynthesis" in window&&"SpeechSynthesisUtterance" in window;
}

function updateFrenchVoices(synth:SpeechSynthesis){
 frenchVoices=synth.getVoices().filter(voice=>voice.lang.toLowerCase().startsWith("fr"));
 return frenchVoices;
}

export function prepareFrenchSpeech(){
 if(!supported())return false;
 const synth=window.speechSynthesis;
 updateFrenchVoices(synth);
 if(!listenerInstalled){
  synth.addEventListener("voiceschanged",()=>{updateFrenchVoices(synth)});
  listenerInstalled=true;
 }
 return true;
}

function preferredFrenchVoice(voices:SpeechSynthesisVoice[]){
 const qualityHints=["natural","online","google","microsoft","denise","hortense","audrey","thomas","amelie"];
 return [...voices].sort((a,b)=>{
  const score=(voice:SpeechSynthesisVoice)=>{
   const lang=voice.lang.toLowerCase().replace("_","-");
   const name=voice.name.toLowerCase();
   return (lang==="fr-fr"?100:lang.startsWith("fr-fr")?90:lang.startsWith("fr")?50:0)
    +(qualityHints.some(hint=>name.includes(hint))?20:0)
    +(voice.default?5:0);
  };
  return score(b)-score(a);
 })[0]||null;
}

function waitForFrenchVoices(synth:SpeechSynthesis){
 const available=updateFrenchVoices(synth);
 if(available.length)return Promise.resolve(available);
 return new Promise<SpeechSynthesisVoice[]>(resolve=>{
  let finished=false;
  const finish=()=>{
   if(finished)return;
   const voices=updateFrenchVoices(synth);
   if(!voices.length)return;
   finished=true;
   window.clearTimeout(timeout);
   synth.removeEventListener("voiceschanged",finish);
   resolve(voices);
  };
  const timeout=window.setTimeout(()=>{
   if(finished)return;
   finished=true;
   synth.removeEventListener("voiceschanged",finish);
   resolve(updateFrenchVoices(synth));
  },1500);
  synth.addEventListener("voiceschanged",finish);
 });
}

export function cancelFrenchSpeech(){
 speechRequest+=1;
 if(supported())window.speechSynthesis.cancel();
}

export async function speakFrench(text:string,options:FrenchSpeechOptions={}){
 if(!text.trim()||!prepareFrenchSpeech())return null;
 const synth=window.speechSynthesis;
 const request=++speechRequest;
 const voices=frenchVoices.length?frenchVoices:await waitForFrenchVoices(synth);
 if(request!==speechRequest)return null;

 const utterance=new SpeechSynthesisUtterance(text);
 utterance.lang="fr-FR";
 utterance.rate=options.rate??.82;
 utterance.pitch=options.pitch??1;
 utterance.volume=options.volume??1;
 utterance.voice=preferredFrenchVoice(voices);
 if(options.onBoundary)utterance.onboundary=options.onBoundary;
 if(options.onEnd)utterance.onend=options.onEnd;
 if(options.onError)utterance.onerror=options.onError;

 synth.cancel();
 await new Promise<void>(resolve=>window.setTimeout(resolve,50));
 if(request!==speechRequest)return null;
 synth.resume();
 synth.speak(utterance);
 return utterance;
}

export async function speakFrenchWithPause(
 first:string,
 second:string,
 pauseMs=700,
 options:FrenchSpeechOptions={}
){
 const sequenceRequest=speechRequest+1;
 return speakFrench(first,{
  ...options,
  onEnd:()=>{
   if(sequenceRequest!==speechRequest)return;
   window.setTimeout(()=>{
    if(sequenceRequest!==speechRequest)return;
    void speakFrench(second,options);
   },pauseMs);
  }
 });
}
