import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

/* ============================================================
   PENYIMPANAN + SUARA
   ============================================================ */

export interface VoiceSettings {
  sound: boolean;
  tts: boolean;
  volume: number;
  rate: number;
}

export interface LogoSettings {
  data: string | null;
  position: "left" | "center" | "right";
  size: "sm" | "md" | "lg";
  showText: boolean;
}

export interface TeacherSettings {
  appName: string;
  tagline: string;
  anim: boolean;
}

export interface QuizRecord {
  date: string;
  score: number;
  correct: number;
  total: number;
  kind: string;
}

export interface AppProgress {
  studentName: string;
  completedLessons: string[];
  unlockedLevels: number;
  exerciseScores: Record<string, number>;
  quizScores: QuizRecord[];
  stars: number;
  points: number;
  streak: number;
  bestStreak: number;
  lastScore: number | null;
  games: { tangkap: number; roket: number };
  voiceSettings: VoiceSettings;
  logoWAH: LogoSettings;
  teacherSettings: TeacherSettings;
}

export const defaultProgress: AppProgress = {
  studentName: "Teman",
  completedLessons: [],
  unlockedLevels: 1,
  exerciseScores: {},
  quizScores: [],
  stars: 0,
  points: 0,
  streak: 0,
  bestStreak: 0,
  lastScore: null,
  games: { tangkap: 0, roket: 0 },
  voiceSettings: { sound: true, tts: true, volume: 0.5, rate: 0.92 },
  logoWAH: { data: null, position: "left", size: "md", showText: true },
  teacherSettings: {
    appName: "Petualangan Angka",
    tagline: "Belajar Matematika Jadi Lebih Mudah, Seru, dan Menyenangkan!",
    anim: true,
  },
};

const KEY = "petualanganAngka.v1";

function loadProgress(): AppProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProgress;
    const p = JSON.parse(raw) as Partial<AppProgress>;
    return {
      ...defaultProgress,
      ...p,
      games: { ...defaultProgress.games, ...(p.games ?? {}) },
      voiceSettings: { ...defaultProgress.voiceSettings, ...(p.voiceSettings ?? {}) },
      logoWAH: { ...defaultProgress.logoWAH, ...(p.logoWAH ?? {}) },
      teacherSettings: { ...defaultProgress.teacherSettings, ...(p.teacherSettings ?? {}) },
    };
  } catch {
    return defaultProgress;
  }
}

/* ---------------- suara (WebAudio) ---------------- */

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

type SfxName = "click" | "correct" | "wrong" | "star" | "level" | "game" | "finish";

const MELODIES: Record<SfxName, { f: number; t: number; type: OscillatorType }[]> = {
  click: [{ f: 620, t: 0.05, type: "sine" }],
  correct: [
    { f: 660, t: 0.08, type: "triangle" },
    { f: 880, t: 0.09, type: "triangle" },
    { f: 1180, t: 0.14, type: "triangle" },
  ],
  wrong: [
    { f: 320, t: 0.11, type: "sawtooth" },
    { f: 220, t: 0.16, type: "sawtooth" },
  ],
  star: [
    { f: 920, t: 0.07, type: "triangle" },
    { f: 1240, t: 0.12, type: "triangle" },
  ],
  level: [
    { f: 523, t: 0.09, type: "square" },
    { f: 659, t: 0.09, type: "square" },
    { f: 784, t: 0.09, type: "square" },
    { f: 1046, t: 0.18, type: "square" },
  ],
  game: [
    { f: 440, t: 0.06, type: "triangle" },
    { f: 660, t: 0.06, type: "triangle" },
    { f: 880, t: 0.1, type: "triangle" },
  ],
  finish: [
    { f: 523, t: 0.1, type: "triangle" },
    { f: 784, t: 0.1, type: "triangle" },
    { f: 1046, t: 0.12, type: "triangle" },
    { f: 1318, t: 0.24, type: "triangle" },
  ],
};

/* ---------------- speech ---------------- */

export const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window;

export interface Ctx {
  p: AppProgress;
  update: (fn: (prev: AppProgress) => AppProgress) => void;
  patch: (v: Partial<AppProgress>) => void;
  reset: () => void;
  toast: (msg: string, type?: "info" | "good" | "bad") => void;
  toasts: { id: number; msg: string; type: "info" | "good" | "bad" }[];
  sfx: (n: SfxName) => void;
  speak: (text: string) => void;
  stopSpeak: () => void;
  speaking: boolean;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [p, setP] = useState<AppProgress>(() => loadProgress());
  const [toasts, setToasts] = useState<Ctx["toasts"]>([]);
  const [speaking, setSpeaking] = useState(false);
  const toastId = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {
      /* storage penuh — abaikan */
    }
  }, [p]);

  const update = useCallback((fn: (prev: AppProgress) => AppProgress) => setP((prev) => fn(prev)), []);
  const patch = useCallback((v: Partial<AppProgress>) => setP((prev) => ({ ...prev, ...v })), []);
  const reset = useCallback(() => setP(defaultProgress), []);

  const toast = useCallback((msg: string, type: "info" | "good" | "bad" = "info") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, msg, type }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const sfx = useCallback(
    (n: SfxName) => {
      if (!p.voiceSettings.sound) return;
      const ac = audio();
      if (!ac) return;
      const notes = MELODIES[n];
      let when = ac.currentTime;
      for (const note of notes) {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = note.type;
        osc.frequency.setValueAtTime(note.f, when);
        gain.gain.setValueAtTime(0.0001, when);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.02, p.voiceSettings.volume * 0.22), when + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, when + note.t);
        osc.connect(gain).connect(ac.destination);
        osc.start(when);
        osc.stop(when + note.t + 0.02);
        when += note.t * 0.86;
      }
    },
    [p.voiceSettings.sound, p.voiceSettings.volume],
  );

  const stopSpeak = useCallback(() => {
    if (!ttsSupported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!ttsSupported || !p.voiceSettings.tts || !text.trim()) {
        if (!ttsSupported) toast("Fitur suara tidak tersedia pada browser ini.", "bad");
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "id-ID";
      u.rate = p.voiceSettings.rate;
      u.pitch = 1.06;
      u.volume = Math.min(1, Math.max(0.2, p.voiceSettings.volume + 0.35));
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(u);
    },
    [p.voiceSettings.tts, p.voiceSettings.rate, p.voiceSettings.volume, toast],
  );

  useEffect(() => () => {
    if (ttsSupported) window.speechSynthesis.cancel();
  }, []);

  const value = useMemo<Ctx>(
    () => ({ p, update, patch, reset, toast, toasts, sfx, speak, stopSpeak, speaking }),
    [p, update, patch, reset, toast, toasts, sfx, speak, stopSpeak, speaking],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp harus dipakai di dalam AppProvider");
  return c;
}

/* ---------------- util progress ---------------- */

export function lessonPercent(p: AppProgress, total: number): number {
  return Math.round((p.completedLessons.length / Math.max(1, total)) * 100);
}
