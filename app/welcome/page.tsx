"use client";

import { useRouter } from "next/navigation";
import {speakFrench} from "@/lib/frenchSpeech";

function speakWelcome() {
  void speakFrench("Bienvenue au Château des Langues. Découvrez et apprenez la langue française.",{rate:.88});
}

export default function WelcomePage() {
  const router = useRouter();
  return (
    <main className="approved-screen approved-welcome" aria-label="صفحة الترحيب">
      <div className="approved-canvas" style={{ backgroundImage: "url('/castle-v68/welcome.png')" }}>
        <button className="approved-hotspot welcome-menu" onClick={() => router.push('/castle')} aria-label="فتح قاعات القلعة" />
        <button className="approved-hotspot welcome-bell" onClick={() => alert('لا توجد إشعارات جديدة.')} aria-label="الإشعارات" />
        <button className="approved-hotspot welcome-listen" onClick={speakWelcome} aria-label="استمع إلى الترحيب" />
        <button className="approved-hotspot welcome-enter" onClick={() => router.push('/castle')} aria-label="متابعة إلى قاعات القلعة" />
        <span className="sr-only">Bienvenue — مرحبًا بك — استكشف وتعلم اللغة الفرنسية</span>
      </div>
    </main>
  );
}
