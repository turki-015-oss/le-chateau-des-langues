"use client";

import {useEffect} from "react";
import {cancelFrenchSpeech,prepareFrenchSpeech} from "@/lib/frenchSpeech";

export default function FrenchSpeechLoader(){
 useEffect(()=>{
  prepareFrenchSpeech();
  return()=>cancelFrenchSpeech();
 },[]);
 return null;
}
