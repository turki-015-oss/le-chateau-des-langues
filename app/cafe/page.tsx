"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Coffee,
  Coins,
  KeyRound,
  Medal,
  PackageOpen,
  ReceiptText,
  RotateCcw,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
  X,
  XCircle,
} from "lucide-react";
import { cafeCustomers, cafeMenu, cafeReward, cafeScenes } from "@/data/cafe";
import { loadWorldProgress, saveWorldProgress } from "@/data/game-engine";
import { speakFrench, playFeedbackTone } from "@/engine/audioEngine";
import { isOrderMatch } from "@/engine/npcEngine";
import { cafeMissionSteps } from "@/engine/missionEngine";
import { calculateCafeRewards, calculateStars } from "@/engine/rewardEngine";
import MissionTracker from "@/components/game/MissionTracker";
import ReputationBar from "@/components/game/ReputationBar";
import CustomerMissionCard from "@/components/game/CustomerMissionCard";
import CustomerQueue from "@/components/game/CustomerQueue";
import OrderTicket from "@/components/game/OrderTicket";
import ServiceResults from "@/components/game/ServiceResults";
import ConversationHistory, { type ConversationEntry } from "@/components/game/ConversationHistory";
import CafeProgression, { type CafeAchievement } from "@/components/game/CafeProgression";
import CafeUpgradeShop, { type CafeUpgrade } from "@/components/game/CafeUpgradeShop";
import CafeContractBoard, { type CafeContract } from "@/components/game/CafeContractBoard";
import CafeLearningJournal, { type LearningPhrase } from "@/components/game/CafeLearningJournal";
import CafeRushChallenge, { type RushPrompt } from "@/components/game/CafeRushChallenge";
import CafeSentenceBuilder, { type SentencePuzzle } from "@/components/game/CafeSentenceBuilder";
import {
  defaultInventory,
  loadInventory,
  saveInventory,
  type InventoryState
} from "@/data/inventory";

export default function CafePage() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(30);
  const [showArabic, setShowArabic] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  const [showInventory, setShowInventory] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [inventory, setInventory] = useState<InventoryState>(defaultInventory);
  const [typedLength, setTypedLength] = useState(0);
  const [showMissionMap, setShowMissionMap] = useState(true);
  const [streak, setStreak] = useState(0);
  const [reputation, setReputation] = useState(0);
  const [entered, setEntered] = useState(false);
  const [ambientOn, setAmbientOn] = useState(false);
  const [customerIndex, setCustomerIndex] = useState(0);
  const [serviceMessage, setServiceMessage] = useState("");
  const [servedIds, setServedIds] = useState<string[]>([]);
  const [serviceScore, setServiceScore] = useState(0);
  const [shiftComplete, setShiftComplete] = useState(false);
  const [history, setHistory] = useState<ConversationEntry[]>([]);
  const [customerMood, setCustomerMood] = useState<"waiting" | "happy" | "thinking">("waiting");
  const [totalServed, setTotalServed] = useState(0);
  const [perfectOrders, setPerfectOrders] = useState(0);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [ownedUpgrades, setOwnedUpgrades] = useState<string[]>([]);
  const [shopMessage, setShopMessage] = useState("");
  const [claimedContracts, setClaimedContracts] = useState<string[]>([]);
  const [loyaltyStreak, setLoyaltyStreak] = useState(1);
  const [contractMessage, setContractMessage] = useState("");
  const [masteredPhrases, setMasteredPhrases] = useState<string[]>([]);
  const [difficultPhrases, setDifficultPhrases] = useState<string[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewAnswer, setReviewAnswer] = useState("");
  const [reviewResult, setReviewResult] = useState<"idle" | "correct" | "wrong">("idle");
  const [rushActive, setRushActive] = useState(false);
  const [rushTimeLeft, setRushTimeLeft] = useState(30);
  const [rushScore, setRushScore] = useState(0);
  const [rushCombo, setRushCombo] = useState(0);
  const [rushBest, setRushBest] = useState(0);
  const [rushIndex, setRushIndex] = useState(0);
  const [rushFeedback, setRushFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [sentenceResult, setSentenceResult] = useState<"idle" | "correct" | "wrong">("idle");
  const [sentenceSolved, setSentenceSolved] = useState(0);
  const [sentenceBest, setSentenceBest] = useState(0);

  const scene = cafeScenes[sceneIndex];
  const customer = cafeCustomers[customerIndex];

  useEffect(() => {
    setXp(Number(localStorage.getItem("chateau-cafe-xp") || "0"));
    setCoins(Number(localStorage.getItem("chateau-coins") || "30"));
    setCompleted(localStorage.getItem("chateau-cafe-completed") === "true");
    setInventory(loadInventory());
    setTotalServed(Number(localStorage.getItem("chateau-cafe-total-served") || "0"));
    setPerfectOrders(Number(localStorage.getItem("chateau-cafe-perfect-orders") || "0"));
    setDailyCompleted(localStorage.getItem("chateau-cafe-daily-completed") === new Date().toISOString().slice(0, 10));
    setReputation(Number(localStorage.getItem("chateau-cafe-reputation") || "0"));
    setRushBest(Number(localStorage.getItem("chateau-cafe-rush-best") || "0"));
    setSentenceBest(Number(localStorage.getItem("chateau-cafe-sentence-best") || "0"));
    try {
      const savedUpgrades = JSON.parse(localStorage.getItem("chateau-cafe-owned-upgrades") || "[]");
      setOwnedUpgrades(Array.isArray(savedUpgrades) ? savedUpgrades : []);
    } catch {}
    try {
      const claimed = JSON.parse(localStorage.getItem("chateau-cafe-claimed-contracts") || "[]");
      setClaimedContracts(Array.isArray(claimed) ? claimed : []);
    } catch {}
    try {
      const mastered = JSON.parse(localStorage.getItem("chateau-cafe-mastered-phrases") || "[]");
      setMasteredPhrases(Array.isArray(mastered) ? mastered : []);
      const difficult = JSON.parse(localStorage.getItem("chateau-cafe-difficult-phrases") || "[]");
      setDifficultPhrases(Array.isArray(difficult) ? difficult : []);
    } catch {}
    const today = new Date().toISOString().slice(0, 10);
    const previousVisit = localStorage.getItem("chateau-cafe-last-visit");
    const savedStreak = Number(localStorage.getItem("chateau-cafe-loyalty-streak") || "0");
    if (previousVisit !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const nextStreak = previousVisit === yesterday ? Math.max(1, savedStreak + 1) : 1;
      setLoyaltyStreak(nextStreak);
      localStorage.setItem("chateau-cafe-loyalty-streak", String(nextStreak));
      localStorage.setItem("chateau-cafe-last-visit", today);
    } else {
      setLoyaltyStreak(Math.max(1, savedStreak));
    }
    const saved = loadWorldProgress("cafe");
    if (saved.chapter > 0 && saved.chapter < cafeScenes.length && !saved.completed) {
      setSceneIndex(saved.chapter);
    }
    try {
      const shift = JSON.parse(localStorage.getItem("chateau-cafe-shift") || "null");
      if (shift) {
        setCustomerIndex(Math.min(shift.customerIndex || 0, cafeCustomers.length - 1));
        setServedIds(Array.isArray(shift.servedIds) ? shift.servedIds : []);
        setServiceScore(Number(shift.serviceScore || 0));
        setHistory(Array.isArray(shift.history) ? shift.history : []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    setTypedLength(0);
    const timer = window.setInterval(() => {
      setTypedLength((value) => {
        if (value >= scene.line.length) {
          window.clearInterval(timer);
          return value;
        }
        return value + 1;
      });
    }, 24);

    return () => window.clearInterval(timer);
  }, [sceneIndex, scene.line]);


  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("chateau-cafe-shift", JSON.stringify({
      customerIndex, servedIds, serviceScore, history
    }));
  }, [customerIndex, servedIds, serviceScore, history]);

  useEffect(() => {
    if (!entered || !customer) return;
    setCustomerMood("waiting");
    setHistory((current) => {
      const last = current[current.length - 1];
      if (last?.speaker === customer.name && last.text === customer.requestFr) return current;
      return [...current, { speaker: customer.name, text: customer.requestFr, ar: customer.requestAr }];
    });
  }, [entered, customer]);

  const progress = useMemo(
    () => Math.round(((sceneIndex + 1) / cafeScenes.length) * 100),
    [sceneIndex]
  );

  const orderItems = useMemo(
    () => cafeMenu.filter((item) => order.includes(item.id)),
    [order]
  );

  const orderTotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.price, 0),
    [orderItems]
  );

  const orderIsCorrect = useMemo(
    () => isOrderMatch(order, customer.order),
    [order, customer.order]
  );

  const stars = useMemo(
    () => calculateStars(score, cafeScenes.length),
    [score]
  );

  const cafeLevel = useMemo(() => Math.min(4, Math.max(1, 1 + Math.floor(totalServed / 6))), [totalServed]);
  const cafeUpgrades = useMemo<CafeUpgrade[]>(() => [
    { id: "tip-jar", title: "صندوق الإكراميات", description: "يزيد العملات التي تحصل عليها من كل طلب.", icon: "🪙", price: 35, requiredLevel: 1, effect: "+2 Coins لكل زبون" },
    { id: "grammar-board", title: "لوحة العبارات", description: "تساعدك على الحفاظ على السمعة عند الخطأ.", icon: "📝", price: 55, requiredLevel: 2, effect: "تقليل خسارة السمعة" },
    { id: "royal-machine", title: "آلة القهوة الملكية", description: "تسرّع التعلم وتزيد نقاط الخبرة.", icon: "☕", price: 85, requiredLevel: 3, effect: "+5 XP لكل طلب" },
    { id: "vip-service", title: "خدمة كبار الزوار", description: "مكافأة إضافية عند إنهاء الوردية كاملة.", icon: "👑", price: 130, requiredLevel: 4, effect: "+20 Coins عند نهاية الوردية" },
  ], []);

  const contracts = useMemo<CafeContract[]>(() => [
    { id: "serve-3", title: "خدمة الصباح", description: "اخدم 3 زبائن داخل المقهى.", progress: totalServed, target: 3, rewardCoins: 18, rewardXp: 25 },
    { id: "perfect-5", title: "دقة الباريستا", description: "نفّذ 5 طلبات صحيحة دون تغيير الهدف.", progress: perfectOrders, target: 5, rewardCoins: 28, rewardXp: 40 },
    { id: "royal-reputation", title: "سمعة المملكة", description: "ارفع سمعة المقهى إلى 80%.", progress: reputation, target: 80, rewardCoins: 40, rewardXp: 55 },
  ], [totalServed, perfectOrders, reputation]);

  const learningPhrases = useMemo<LearningPhrase[]>(() => [
    { id: "bonjour", fr: "Bonjour, je voudrais un café, s'il vous plaît.", ar: "مرحبًا، أريد قهوة من فضلك.", category: "الطلب" },
    { id: "price", fr: "Combien ça coûte ?", ar: "كم سعر هذا؟", category: "السعر" },
    { id: "addition", fr: "L'addition, s'il vous plaît.", ar: "الحساب من فضلك.", category: "الدفع" },
    { id: "modify", fr: "Sans sucre, s'il vous plaît.", ar: "من دون سكر، من فضلك.", category: "تعديل الطلب" },
    { id: "table", fr: "Cette table est-elle libre ?", ar: "هل هذه الطاولة شاغرة؟", category: "الجلوس" },
    { id: "thanks", fr: "Merci beaucoup, c'était délicieux.", ar: "شكرًا جزيلًا، كان لذيذًا.", category: "المجاملة" },
  ], []);


  const sentencePuzzles = useMemo<SentencePuzzle[]>(() => [
    { id: "order-coffee", promptAr: "أريد قهوة من فضلك.", answer: "Je voudrais un café, s'il vous plaît.", words: ["un", "s'il", "voudrais", "café,", "Je", "vous", "plaît."] },
    { id: "ask-price", promptAr: "كم سعر هذا؟", answer: "Combien ça coûte ?", words: ["coûte", "Combien", "?", "ça"] },
    { id: "no-sugar", promptAr: "من دون سكر، من فضلك.", answer: "Sans sucre, s'il vous plaît.", words: ["vous", "Sans", "plaît.", "sucre,", "s'il"] },
    { id: "free-table", promptAr: "هل هذه الطاولة شاغرة؟", answer: "Cette table est-elle libre ?", words: ["libre", "table", "?", "Cette", "est-elle"] },
    { id: "bill", promptAr: "الحساب من فضلك.", answer: "L'addition, s'il vous plaît.", words: ["plaît.", "L'addition,", "vous", "s'il"] },
    { id: "delicious", promptAr: "شكرًا جزيلًا، كان لذيذًا.", answer: "Merci beaucoup, c'était délicieux.", words: ["délicieux.", "Merci", "c'était", "beaucoup,"] },
  ], []);
  const sentencePuzzle = sentencePuzzles[sentenceIndex % sentencePuzzles.length];

  const rushPrompts = useMemo<RushPrompt[]>(() => cafeMenu.map((item) => ({
    id: item.id,
    fr: `Je voudrais ${item.fr.toLowerCase()}, s\'il vous plaît.`,
    ar: `أريد ${item.ar} من فضلك.`,
    emoji: item.emoji,
  })), []);

  const rushPrompt = rushPrompts[rushIndex % rushPrompts.length];
  const rushOptions = useMemo(() => {
    const others = rushPrompts.filter((item) => item.id !== rushPrompt.id);
    const rotated = [...others.slice(rushIndex % Math.max(1, others.length)), ...others.slice(0, rushIndex % Math.max(1, others.length))];
    return [rushPrompt, ...rotated.slice(0, 3)].sort((a, b) => (a.id + rushIndex).localeCompare(b.id));
  }, [rushIndex, rushPrompt, rushPrompts]);

  useEffect(() => {
    if (!rushActive) return;
    if (rushTimeLeft <= 0) {
      setRushActive(false);
      setRushBest((current) => {
        const next = Math.max(current, rushScore);
        localStorage.setItem("chateau-cafe-rush-best", String(next));
        return next;
      });
      setXp((value) => {
        const next = value + Math.floor(rushScore / 2);
        localStorage.setItem("chateau-cafe-xp", String(next));
        return next;
      });
      return;
    }
    const timer = window.setTimeout(() => setRushTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [rushActive, rushTimeLeft, rushScore]);

  const startRush = () => {
    setRushActive(true);
    setRushTimeLeft(30);
    setRushScore(0);
    setRushCombo(0);
    setRushIndex((value) => (value + 1) % rushPrompts.length);
    setRushFeedback("idle");
  };

  const pickRushOption = (id: string) => {
    if (!rushActive) return;
    const correct = id === rushPrompt.id;
    if (correct) {
      const nextCombo = rushCombo + 1;
      setRushCombo(nextCombo);
      setRushScore((value) => value + 10 + Math.min(15, nextCombo * 2));
      setRushTimeLeft((value) => Math.min(35, value + 2));
      setRushFeedback("correct");
      playTone(true);
    } else {
      setRushCombo(0);
      setRushTimeLeft((value) => Math.max(0, value - 3));
      setRushFeedback("wrong");
      playTone(false);
    }
    window.setTimeout(() => {
      setRushIndex((value) => (value + 1) % rushPrompts.length);
      setRushFeedback("idle");
    }, 280);
  };

  const serviceCoinBonus = ownedUpgrades.includes("tip-jar") ? 2 : 0;
  const serviceXpBonus = ownedUpgrades.includes("royal-machine") ? 5 : 0;
  const mistakePenalty = ownedUpgrades.includes("grammar-board") ? 1 : 3;

  const achievements = useMemo<CafeAchievement[]>(() => [
    { id: "first", title: "أول طلب", description: "خدمة أول زبون بنجاح", unlocked: totalServed >= 1 },
    { id: "perfect3", title: "خدمة مثالية", description: "تنفيذ 3 طلبات صحيحة", unlocked: perfectOrders >= 3 },
    { id: "shift", title: "وردية مكتملة", description: "خدمة جميع زبائن المقهى", unlocked: totalServed >= cafeCustomers.length },
    { id: "royal", title: "سمعة ملكية", description: "الوصول إلى سمعة 80%", unlocked: reputation >= 80 },
  ], [totalServed, perfectOrders, reputation]);

  const speak = (text: string) => speakFrench(text, soundOn);

  const playTone = (success: boolean) => playFeedbackTone(success, soundOn);

  const choose = (index: number) => {
    if (selected !== null) return;
    setSelected(index);

    if (scene.answers[index].correct) {
      setFeedback("correct");
      setScore((value) => value + 1);
      setStreak((value) => value + 1);
      setReputation((value) => Math.min(100, value + 8));
      setCustomerMood("happy");
      setHistory((current) => [...current, { speaker: "Vous", text: scene.answers[index].text, ar: scene.answers[index].ar, correct: true }]);
      playTone(true);
    } else {
      setFeedback("wrong");
      setStreak(0);
      setReputation((value) => Math.max(0, value - mistakePenalty));
      setCustomerMood("thinking");
      setHistory((current) => [...current, { speaker: "Vous", text: scene.answers[index].text, ar: scene.answers[index].ar, correct: false }]);
      playTone(false);
    }
  };

  const next = () => {
    if (selected === null) return;

    if (sceneIndex < cafeScenes.length - 1) {
      setSceneIndex((value) => value + 1);
      setSelected(null);
      setFeedback(null);
      saveWorldProgress({
        worldId: "cafe",
        chapter: sceneIndex + 1,
        score,
        attempts: sceneIndex + 1,
        completed: false,
        lastPlayedAt: new Date().toISOString()
      });
      return;
    }

    const earned = calculateCafeRewards(score, cafeScenes.length, reputation);
    const nextXp = xp + earned.xp;
    const nextCoins = coins + earned.coins;
    const vocabulary = Array.from(
      new Set([
        ...inventory.vocabulary,
        "un café",
        "un croissant",
        "s'il vous plaît",
        "l'addition",
        "une chaise libre"
      ])
    );

    const nextInventory: InventoryState = {
      medals: Array.from(
        new Set([...inventory.medals, cafeReward.medal])
      ),
      certificates: Array.from(
        new Set([...inventory.certificates, "Certificat du Café"])
      ),
      keys: Array.from(
        new Set([...inventory.keys, "Clé du Tribunal"])
      ),
      vocabulary,
      stars: Math.max(inventory.stars, stars)
    };

    setXp(nextXp);
    setCoins(nextCoins);
    setInventory(nextInventory);
    setCompleted(true);
    setShowReceipt(true);

    localStorage.setItem("chateau-cafe-xp", String(nextXp));
    localStorage.setItem("chateau-coins", String(nextCoins));
    localStorage.setItem("chateau-cafe-completed", "true");
    localStorage.setItem("chateau-court-unlocked", "true");
    localStorage.setItem("chateau-cafe-reputation", String(Math.min(100, reputation + earned.reputation)));
    saveInventory(nextInventory);
    saveWorldProgress({
      worldId: "cafe",
      chapter: cafeScenes.length - 1,
      score,
      attempts: cafeScenes.length,
      completed: true,
      lastPlayedAt: new Date().toISOString()
    });
  };

  const restart = () => {
    setSceneIndex(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setCompleted(false);
    setShowReceipt(false);
    setStreak(0);
    setShowMissionMap(true);
    setReputation(0);
    setEntered(false);
    setServedIds([]);
    setServiceScore(0);
    setShiftComplete(false);
    saveWorldProgress({
      worldId: "cafe",
      chapter: 0,
      score: 0,
      attempts: 0,
      completed: false,
      lastPlayedAt: new Date().toISOString()
    });
  };

  const toggleOrder = (id: string) => {
    setServiceMessage("");
    setOrder((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const validateOrder = () => {
    if (orderIsCorrect) {
      setServiceMessage("Commande parfaite ! الطلب مطابق تمامًا.");
      setCustomerMood("happy");
      setReputation((value) => Math.min(100, value + 10));
      playTone(true);
    } else {
      setServiceMessage(`Presque… ${customer.name} طلب: ${customer.requestAr}`);
      setCustomerMood("thinking");
      setReputation((value) => Math.max(0, value - 2));
      playTone(false);
    }
  };

  const serveCustomer = () => {
    if (!orderIsCorrect) return;
    const id = customer.id;
    const nextServed = Array.from(new Set([...servedIds, id]));
    setServedIds(nextServed);
    setServiceScore((value) => value + 1);
    setPerfectOrders((value) => {
      const next = value + 1;
      localStorage.setItem("chateau-cafe-perfect-orders", String(next));
      return next;
    });
    setTotalServed((value) => {
      const next = value + 1;
      localStorage.setItem("chateau-cafe-total-served", String(next));
      return next;
    });
    setOrder([]);
    setServiceMessage(`${customer.name}: Merci beaucoup !`);
    setHistory((current) => [...current, { speaker: "Vous", text: `Voici votre commande, ${customer.name}.`, ar: "تفضل طلبك.", correct: true }, { speaker: customer.name, text: "Merci beaucoup !", ar: "شكرًا جزيلًا!", correct: true }]);
    const earnedCoins = 4 + serviceCoinBonus;
    const earnedXp = 10 + serviceXpBonus;
    setCoins((value) => {
      const next = value + earnedCoins;
      localStorage.setItem("chateau-coins", String(next));
      return next;
    });
    setXp((value) => {
      const next = value + earnedXp;
      localStorage.setItem("chateau-cafe-xp", String(next));
      return next;
    });
    playTone(true);

    if (nextServed.length >= cafeCustomers.length) {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem("chateau-cafe-daily-completed", today);
      setDailyCompleted(true);
      if (ownedUpgrades.includes("vip-service")) {
        setCoins((value) => {
          const next = value + 20;
          localStorage.setItem("chateau-coins", String(next));
          return next;
        });
      }
      setShiftComplete(true);
      return;
    }

    window.setTimeout(() => {
      setCustomerIndex((value) => Math.min(value + 1, cafeCustomers.length - 1));
      setServiceMessage("");
    }, 650);
  };

  const buyUpgrade = (upgrade: CafeUpgrade) => {
    if (ownedUpgrades.includes(upgrade.id) || cafeLevel < upgrade.requiredLevel || coins < upgrade.price) return;
    const nextCoins = coins - upgrade.price;
    const nextOwned = [...ownedUpgrades, upgrade.id];
    setCoins(nextCoins);
    setOwnedUpgrades(nextOwned);
    setShopMessage(`تم شراء ${upgrade.title} بنجاح.`);
    localStorage.setItem("chateau-coins", String(nextCoins));
    localStorage.setItem("chateau-cafe-owned-upgrades", JSON.stringify(nextOwned));
    playTone(true);
    window.setTimeout(() => setShopMessage(""), 2600);
  };

  const claimContract = (contract: CafeContract) => {
    if (claimedContracts.includes(contract.id) || contract.progress < contract.target) return;
    const nextClaimed = [...claimedContracts, contract.id];
    const nextCoins = coins + contract.rewardCoins;
    const nextXp = xp + contract.rewardXp;
    setClaimedContracts(nextClaimed);
    setCoins(nextCoins);
    setXp(nextXp);
    setContractMessage(`اكتمل عقد ${contract.title} وحصلت على ${contract.rewardCoins} عملة و${contract.rewardXp} XP.`);
    localStorage.setItem("chateau-cafe-claimed-contracts", JSON.stringify(nextClaimed));
    localStorage.setItem("chateau-coins", String(nextCoins));
    localStorage.setItem("chateau-cafe-xp", String(nextXp));
    playTone(true);
    window.setTimeout(() => setContractMessage(""), 3000);
  };

  const togglePhraseMastery = (id: string) => {
    const next = masteredPhrases.includes(id)
      ? masteredPhrases.filter((item) => item !== id)
      : [...masteredPhrases, id];
    setMasteredPhrases(next);
    localStorage.setItem("chateau-cafe-mastered-phrases", JSON.stringify(next));
  };

  const checkReviewAnswer = () => {
    const target = learningPhrases[reviewIndex % learningPhrases.length];
    const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, "'").replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim();
    const correct = normalize(reviewAnswer) === normalize(target.fr);
    setReviewResult(correct ? "correct" : "wrong");
    if (correct) {
      const nextMastered = Array.from(new Set([...masteredPhrases, target.id]));
      const nextDifficult = difficultPhrases.filter((item) => item !== target.id);
      setMasteredPhrases(nextMastered);
      setDifficultPhrases(nextDifficult);
      localStorage.setItem("chateau-cafe-mastered-phrases", JSON.stringify(nextMastered));
      localStorage.setItem("chateau-cafe-difficult-phrases", JSON.stringify(nextDifficult));
      setXp((value) => { const next = value + 5; localStorage.setItem("chateau-cafe-xp", String(next)); return next; });
      playTone(true);
    } else {
      const nextDifficult = Array.from(new Set([...difficultPhrases, target.id]));
      setDifficultPhrases(nextDifficult);
      localStorage.setItem("chateau-cafe-difficult-phrases", JSON.stringify(nextDifficult));
      playTone(false);
    }
  };

  const nextReviewPhrase = () => {
    setReviewIndex((value) => (value + 1) % learningPhrases.length);
    setReviewAnswer("");
    setReviewResult("idle");
  };

  const pickSentenceWord = (word: string) => {
    if (sentenceResult === "correct") return;
    setSentenceWords((current) => [...current, word]);
    setSentenceResult("idle");
  };

  const removeSentenceWord = (index: number) => {
    if (sentenceResult === "correct") return;
    setSentenceWords((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setSentenceResult("idle");
  };

  const normalizeSentence = (value: string) => value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’]/g, "'")
    .replace(/\s+([?!.,])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  const checkSentence = () => {
    const candidate = sentenceWords.join(" ");
    const correct = normalizeSentence(candidate) === normalizeSentence(sentencePuzzle.answer);
    setSentenceResult(correct ? "correct" : "wrong");
    playTone(correct);
    if (!correct) return;
    const nextSolved = sentenceSolved + 1;
    setSentenceSolved(nextSolved);
    setSentenceBest((current) => {
      const next = Math.max(current, nextSolved);
      localStorage.setItem("chateau-cafe-sentence-best", String(next));
      return next;
    });
    setXp((value) => {
      const next = value + 8;
      localStorage.setItem("chateau-cafe-xp", String(next));
      return next;
    });
  };

  const resetSentence = () => {
    setSentenceWords([]);
    setSentenceResult("idle");
  };

  const nextSentence = () => {
    setSentenceIndex((value) => (value + 1) % sentencePuzzles.length);
    setSentenceWords([]);
    setSentenceResult("idle");
  };

  const restartShift = () => {
    setCustomerIndex(0);
    setServedIds([]);
    setServiceScore(0);
    setShiftComplete(false);
    setOrder([]);
    setServiceMessage("");
    setHistory([]);
    localStorage.removeItem("chateau-cafe-shift");
  };

  return (
    <main className="cafe-pro-world">
      {!entered && (
        <section className="cafe-entry-screen">
          <div className="cafe-entry-lights" />
          <div className="cafe-door-frame">
            <div className="cafe-door-sign">Chez Luc</div>
            <div className="cafe-door-window">☕</div>
            <button onClick={() => { setEntered(true); setAmbientOn(true); setCustomerIndex(0); }}>
              <span>ادخل المقهى</span>
              <small>Entrer dans le café</small>
            </button>
          </div>
          <div className="cafe-entry-copy">
            <span>MISSION ROYALE · 01</span>
            <h1>أول يوم لك في مقهى Luc</h1>
            <p>ادخل، تحدث بالفرنسية، كوّن طلبك، وارفع سمعتك داخل المملكة.</p>
            <div>
              <b>5</b><small>مواقف</small>
              <b>70</b><small>XP</small>
              <b>1</b><small>ميدالية</small>
            </div>
          </div>
        </section>
      )}
      <header className="cafe-pro-header">
        <Link href="/" className="back-link">
          <ArrowRight size={20} />
          المملكة
        </Link>

        <div className="cafe-pro-progress-wrap">
          <div>
            <span>تقدم الحوار</span>
            <b>{progress}%</b>
          </div>
          <div className="cafe-pro-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="cafe-pro-hud">
          <span><Star size={17} /> {xp} XP</span>
          <span><Coins size={17} /> {coins}</span>
          <span className="streak-pill">🔥 {streak}</span>
          <span className="reputation-pill">👑 {reputation}%</span>
          <span className="loyalty-pill">🔥 {loyaltyStreak} يوم</span>
          <button title="الصوت" onClick={() => setSoundOn((value) => !value)}>
            {soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
          </button>
          <button title="الحقيبة" onClick={() => setShowInventory(true)}>
            <PackageOpen size={19} />
          </button>
        </div>
      </header>

      <section className="cafe-pro-scene">
        <div className="cafe-pro-glow glow-one" />
        <div className="cafe-pro-glow glow-two" />

        <div className="cafe-pro-intro">
          <span><Sparkles size={17} /> A1 · Le Café</span>
          <div className={`ambient-status ${ambientOn ? "on" : ""}`}>
            <i /> {ambientOn ? "Ambiance active" : "Ambiance silencieuse"}
          </div>
          <h1>Chez Luc</h1>
          <p>مقهى فرنسي صغير داخل المملكة، حيث تتعلم الطلب والمجاملة والدفع من خلال الحوار.</p>
          <div className="cafe-pro-actions">
            <button onClick={() => setShowArabic((value) => !value)}>
              {showArabic ? "إخفاء الترجمة" : "إظهار الترجمة"}
            </button>
            <button onClick={() => setShowReceipt(true)}>
              <ReceiptText size={18} />
              الإيصال
            </button>
          </div>
        </div>

        <div className="luc-stage">
          <div className="luc-aura" />
          <div className="luc-character">
            <div className="luc-head">🧑‍🍳</div>
            <div className="luc-body">
              <span className="luc-arm left-arm" />
              <span className="luc-arm right-arm" />
              <span className="luc-apron">L</span>
            </div>
          </div>
          <div className="luc-nameplate">
            <strong>Luc</strong>
            <small>Le serveur du café</small>
          </div>
        </div>

        <div className="cafe-counter">
          <span>☕</span><span>🥐</span><span>🫖</span><span>🍊</span>
        </div>
      </section>

      <MissionTracker
        steps={cafeMissionSteps}
        activeIndex={sceneIndex}
        expanded={showMissionMap}
        onToggle={() => setShowMissionMap((value) => !value)}
        onSelect={(index) => {
          setSceneIndex(index);
          setSelected(null);
          setFeedback(null);
          setShowMissionMap(false);
        }}
      />

      <ReputationBar value={reputation} />

      <CafeProgression
        level={cafeLevel}
        served={servedIds.length}
        totalServed={totalServed}
        dailyTarget={cafeCustomers.length}
        achievements={achievements}
      />

      {dailyCompleted && <div className="daily-complete-banner">🎁 اكتمل التحدي اليومي — حصلت على مكافأة الولاء</div>}
      <CafeUpgradeShop
        level={cafeLevel}
        coins={coins}
        ownedIds={ownedUpgrades}
        upgrades={cafeUpgrades}
        onBuy={buyUpgrade}
      />

      {shopMessage && <div className="shop-success-banner">✨ {shopMessage}</div>}

      <CafeContractBoard
        contracts={contracts}
        claimedIds={claimedContracts}
        onClaim={claimContract}
      />
      {contractMessage && <div className="contract-success-banner">🏆 {contractMessage}</div>}

      <CafeLearningJournal
        phrases={learningPhrases}
        masteredIds={masteredPhrases}
        difficultIds={difficultPhrases}
        reviewIndex={reviewIndex}
        reviewAnswer={reviewAnswer}
        reviewResult={reviewResult}
        onSpeak={speak}
        onToggleMastery={togglePhraseMastery}
        onAnswerChange={(value) => { setReviewAnswer(value); setReviewResult("idle"); }}
        onCheck={checkReviewAnswer}
        onNext={nextReviewPhrase}
      />


      <CafeRushChallenge
        active={rushActive}
        timeLeft={rushTimeLeft}
        score={rushScore}
        combo={rushCombo}
        bestScore={rushBest}
        prompt={rushPrompt}
        options={rushOptions}
        feedback={rushFeedback}
        onStart={startRush}
        onPick={pickRushOption}
        onSpeak={speak}
      />

      <CafeSentenceBuilder
        puzzle={sentencePuzzle}
        selectedWords={sentenceWords}
        result={sentenceResult}
        solved={sentenceSolved}
        total={sentencePuzzles.length}
        best={sentenceBest}
        onPick={(word) => pickSentenceWord(word)}
        onRemove={removeSentenceWord}
        onCheck={checkSentence}
        onReset={resetSentence}
        onNext={nextSentence}
        onSpeak={speak}
      />

      <CustomerQueue
        customers={[...cafeCustomers]}
        activeIndex={customerIndex}
        servedIds={servedIds}
      />

      <div className={`customer-mood mood-${customerMood}`}>
        {customerMood === "happy" ? "😊 الزبون سعيد" : customerMood === "thinking" ? "🤔 الزبون ينتظر التصحيح" : "⏳ الزبون ينتظر الخدمة"}
      </div>

      <CustomerMissionCard
        customer={customer}
        showArabic={showArabic}
        onSpeak={speak}
      />

      <section className="cafe-service-layout">
        <OrderTicket
          customer={customer}
          selectedItems={order}
          correct={orderIsCorrect}
          onSpeak={speak}
        />
      </section>

      <ConversationHistory entries={history} onSpeak={speak} />

      <section className="cafe-pro-game">
        <aside className="cafe-pro-menu">
          <div className="panel-heading">
            <div>
              <span>La carte</span>
              <h2>قائمة المقهى</h2>
            </div>
            <b>{orderTotal} 🪙</b>
          </div>

          <div className="cafe-pro-menu-grid">
            {cafeMenu.map((item) => (
              <button
                key={item.id}
                className={order.includes(item.id) ? "selected" : ""}
                onClick={() => toggleOrder(item.id)}
              >
                <span>{item.emoji}</span>
                <div>
                  <strong>{item.fr}</strong>
                  {showArabic && <small>{item.ar}</small>}
                </div>
                <b>{item.price}</b>
              </button>
            ))}
          </div>

          <div className="order-summary">
            <strong>طلبك الحالي</strong>
            <p>
              {orderItems.length
                ? orderItems.map((item) => item.fr).join(" · ")
                : "لم تختر شيئًا بعد"}
            </p>
            <button className="validate-order" onClick={validateOrder} disabled={!orderItems.length}>
              <CheckCircle2 size={17}/> تحقق من الطلب
            </button>
            <button className="serve-order" onClick={serveCustomer} disabled={!orderIsCorrect}>
              ☕ قدّم الطلب إلى {customer.name}
            </button>
            {serviceMessage && <div className={`service-message ${orderIsCorrect ? "success" : "retry"}`}>{serviceMessage}</div>}
          </div>
        </aside>

        <section className="cafe-pro-dialogue">
          <div className="dialogue-stage">
            <div className="speaker-badge">
              <span>{scene.speaker === "Luc" ? "🧑‍🍳" : scene.speaker === "Emma" ? "👩" : "👨"}</span>
              <div>
                <strong>{scene.speaker}</strong>
                <small>Conversation {sceneIndex + 1}/{cafeScenes.length}</small>
              </div>
            </div>

            <button className="listen-line" onClick={() => speak(scene.line)}>
              <Volume2 size={19} />
              استمع
            </button>

            <div className="speech-bubble">
              <h2>{scene.line.slice(0, typedLength)}</h2>
              {showArabic && <p>{scene.ar}</p>}
            </div>
          </div>

          <div className="cafe-pro-answers">
            {scene.answers.map((answer, index) => {
              const state =
                selected === null
                  ? ""
                  : answer.correct
                    ? "correct"
                    : selected === index
                      ? "wrong"
                      : "muted";

              return (
                <article key={answer.text} className={`cafe-pro-answer ${state}`}>
                  <button
                    className="answer-choice"
                    onClick={() => choose(index)}
                    disabled={selected !== null}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    <div>
                      <strong>{answer.text}</strong>
                      {showArabic && <small>{answer.ar}</small>}
                    </div>
                  </button>

                  <button
                    className="answer-audio"
                    onClick={() => speak(answer.text)}
                  >
                    <Volume2 size={18} />
                  </button>
                </article>
              );
            })}
          </div>

          {feedback && (
            <div className={`cafe-pro-feedback ${feedback}`}>
              {feedback === "correct" ? <CheckCircle2 /> : <XCircle />}
              <div>
                <strong>{feedback === "correct" ? "Très bien !" : "Pas encore."}</strong>
                <span>
                  {feedback === "correct"
                    ? "اختيار ممتاز، استمر في المحادثة."
                    : "الاختيار غير مناسب للموقف. استمع إلى الجمل وقارن المعنى."}
                </span>
              </div>
            </div>
          )}

          <button
            className="cafe-pro-next"
            onClick={next}
            disabled={selected === null || (sceneIndex === cafeScenes.length - 1 && !orderIsCorrect)}
          >
            {sceneIndex === cafeScenes.length - 1
              ? (orderIsCorrect ? "ادفع الحساب وأنهِ العالم" : "نفّذ طلب الزبون الصحيح أولًا")
              : "تابع الحوار"}
          </button>
        </section>
      </section>

      {shiftComplete && (
        <div className="service-results-overlay">
          <ServiceResults
            served={servedIds.length}
            total={cafeCustomers.length}
            score={serviceScore}
            reputation={reputation}
            onRestart={restartShift}
          />
        </div>
      )}

      {showInventory && (
        <div className="inventory-overlay">
          <section className="inventory-panel">
            <button className="close-panel" onClick={() => setShowInventory(false)}>
              <X size={22} />
            </button>
            <PackageOpen size={43} />
            <h2>حقيبة الرحلة</h2>

            <div className="inventory-grid">
              <article>
                <Medal />
                <strong>الميداليات</strong>
                <span>{inventory.medals.length}</span>
              </article>
              <article>
                <Star />
                <strong>النجوم</strong>
                <span>{inventory.stars}</span>
              </article>
              <article>
                <KeyRound />
                <strong>المفاتيح</strong>
                <span>{inventory.keys.length}</span>
              </article>
              <article>
                <BookOpen />
                <strong>الكلمات</strong>
                <span>{inventory.vocabulary.length}</span>
              </article>
            </div>

            <div className="inventory-list">
              <strong>آخر الكلمات المحفوظة</strong>
              <p>{inventory.vocabulary.slice(-5).join(" · ") || "لا توجد كلمات محفوظة بعد"}</p>
            </div>
          </section>
        </div>
      )}

      {showReceipt && (
        <div className="receipt-overlay">
          <section className="receipt-card">
            <button className="close-panel" onClick={() => setShowReceipt(false)}>
              <X size={22} />
            </button>
            <ReceiptText size={45} />
            <h2>Reçu du Café</h2>
            <p>إيصال مقهى Luc</p>

            <div className="receipt-lines">
              {orderItems.length ? (
                orderItems.map((item) => (
                  <div key={item.id}>
                    <span>{item.fr}</span>
                    <b>{item.price} 🪙</b>
                  </div>
                ))
              ) : (
                <div><span>Aucune commande</span><b>0 🪙</b></div>
              )}
            </div>

            <div className="receipt-total">
              <span>Total</span>
              <b>{orderTotal} 🪙</b>
            </div>
          </section>
        </div>
      )}

      {completed && (
        <section className="cafe-pro-complete">
          <div className="celebration-sparkles">
            <span>✦</span><span>✧</span><span>✦</span><span>✧</span>
          </div>

          <div className="cafe-pro-medal">
            <Medal size={86} />
            <span>L</span>
          </div>

          <h2>{cafeReward.medal}</h2>
          <h3>{cafeReward.medalAr}</h3>
          <p>أصبحت زبونًا دائمًا في مقهى Luc.</p>

          <div className="completion-stars">
            {[1, 2, 3].map((value) => (
              <Star key={value} className={value <= stars ? "earned" : ""} />
            ))}
          </div>

          <div className="completion-rewards">
            <span>+{cafeReward.xp} XP</span>
            <span>+{cafeReward.coins} Coins</span>
            <span>🔑 Clé du Tribunal</span>
          </div>

          <div className="completion-actions">
            <button onClick={restart}>
              <RotateCcw size={18} />
              إعادة اللعب
            </button>
            <Link href="/">العودة إلى المملكة</Link>
          </div>
        </section>
      )}
    </main>
  );
}