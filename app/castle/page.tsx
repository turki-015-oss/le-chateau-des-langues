"use client";
import { useRouter } from "next/navigation";

function speak(){
  if(typeof window==='undefined'||!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance("Bienvenue. Explorez et apprenez la langue française.");
  u.lang='fr-FR'; u.rate=.86; window.speechSynthesis.speak(u);
}

export default function CastlePage(){
 const router=useRouter();
 const go=(path:string)=>router.push(path);
 return <main className="v67-image-page v67-castle-page" dir="rtl">
   <section className="v67-image-stage v67-welcome-stage">
     <img src="/images/castle-v67/welcome.jpg" alt="Bienvenue — مرحبًا بك في القلعة" />
     <button className="v67-hotspot v67-welcome-back" onClick={()=>go('/kingdom')} aria-label="العودة" />
     <button className="v67-hotspot v67-welcome-audio" onClick={speak} aria-label="استمع إلى الترحيب" />
   </section>
   <section className="v67-image-stage v67-halls-stage" id="castle-halls">
     <img src="/images/castle-v67/halls.jpg" alt="قاعات القلعة" />
     <button className="v67-hotspot v67-halls-back" onClick={()=>go('/kingdom')} aria-label="العودة" />
     <button className="v67-hotspot v67-hall-conjugation" onClick={()=>go('/conjugation')} aria-label="دخول قاعة تصريف الأفعال" />
     <button className="v67-hotspot v67-hall-grammar" onClick={()=>go('/grammar')} aria-label="دخول قاعة القواعد" />
     <button className="v67-hotspot v67-hall-achievements" onClick={()=>go('/castle#achievements')} aria-label="دخول قاعة الإنجازات" />
     <button className="v67-hotspot v67-hall-library" onClick={()=>go('/library')} aria-label="دخول المكتبة" />
     <button className="v67-hotspot v67-hall-tests" onClick={()=>go('/castle#tests')} aria-label="دخول قاعة الاختبارات" />
   </section>
 </main>;
}
