export function speakFrench(text: string, enabled = true) {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = 0.82;
  window.speechSynthesis.speak(utterance);
}

export function playFeedbackTone(success: boolean, enabled = true) {
  if (!enabled || typeof window === "undefined") return;
  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;

  const context = new AudioContextCtor();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.type = success ? "sine" : "square";
  oscillator.frequency.setValueAtTime(success ? 620 : 210, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    success ? 930 : 145,
    context.currentTime + 0.22
  );
  gain.gain.setValueAtTime(0.1, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.38);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.38);
}