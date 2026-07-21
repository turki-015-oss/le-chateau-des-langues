"use client";
import { useRouter } from "next/navigation";

export default function GrammarPage(){
 const router=useRouter();
 const open=(level:string)=>router.push(`/grammar/${level.toLowerCase()}`);
 return <main className="v67-image-page v67-grammar-page" dir="rtl">
   <div className="v67-image-stage v67-grammar-stage">
     <img src="/images/castle-v67/grammar.jpg" alt="قاعة القواعد من A1 إلى C2" />
     <button className="v67-hotspot v67-grammar-back" onClick={()=>router.push('/castle#castle-halls')} aria-label="العودة إلى قاعات القلعة" />
     <button className="v67-hotspot v67-level-a1" onClick={()=>open('A1')} aria-label="فتح مستوى A1" />
     <button className="v67-hotspot v67-level-a2" onClick={()=>open('A2')} aria-label="فتح مستوى A2" />
     <button className="v67-hotspot v67-level-b1" onClick={()=>open('B1')} aria-label="فتح مستوى B1" />
     <button className="v67-hotspot v67-level-b2" onClick={()=>open('B2')} aria-label="فتح مستوى B2" />
     <button className="v67-hotspot v67-level-c1" onClick={()=>open('C1')} aria-label="فتح مستوى C1" />
     <button className="v67-hotspot v67-level-c2" onClick={()=>open('C2')} aria-label="فتح مستوى C2" />
   </div>
 </main>;
}
