import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Volume2, Square, RotateCcw, Lightbulb, Star, ArrowDown } from "lucide-react";
import { useApp } from "../lib/store";
import { PLACES, toNumber, type DigitToken, type RoundResult } from "../lib/math";

/* ================= karakter (SVG buatan tangan) ================= */

export function Avatar({ who, size = 56 }: { who: "hanif" | "arsya"; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 100 100", "aria-hidden": true } as const;
  if (who === "hanif") {
    return (
      <svg {...common}>
        <defs>
          <linearGradient id="hanif-shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#60a5fa" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="49" fill="#eaf2ff" />
        <path d="M12 100c1-18 13-28 28-32l10 7 10-7c15 4 27 14 28 32z" fill="url(#hanif-shirt)" />
        <path d="M38 70c0-6 4-9 12-9s12 3 12 9v6H38z" fill="#e8b184" />
        <ellipse cx="50" cy="45" rx="21" ry="23" fill="#f6cba6" />
        <circle cx="29" cy="47" r="4.6" fill="#eebd94" />
        <circle cx="71" cy="47" r="4.6" fill="#eebd94" />
        <path
          d="M28 41c-2-19 11-28 22-28s24 9 22 28c-3-10-7-14-13-14-5 4-16 5-22 1-4 3-7 6-9 13z"
          fill="#3b2b23"
        />
        <ellipse cx="41.5" cy="45" rx="3.3" ry="4" fill="#2b2118" />
        <ellipse cx="58.5" cy="45" rx="3.3" ry="4" fill="#2b2118" />
        <circle cx="42.8" cy="43.4" r="1.2" fill="#fff" />
        <circle cx="59.8" cy="43.4" r="1.2" fill="#fff" />
        <path d="M36 37c2-2 6-2 8 0" stroke="#3b2b23" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M56 37c2-2 6-2 8 0" stroke="#3b2b23" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M41 57c4 5 14 5 18 0" stroke="#b4623f" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <circle cx="33" cy="53" r="4" fill="#f6a6a0" opacity="0.55" />
        <circle cx="67" cy="53" r="4" fill="#f6a6a0" opacity="0.55" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <defs>
        <linearGradient id="arsya-hijab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="49" fill="#f1eaff" />
      <path
        d="M50 11c-18 0-29 12-29 28 0 11 2 19 5 25-7 5-11 11-13 20h74c-2-9-6-15-13-20 3-6 5-14 5-25 0-16-11-28-29-28z"
        fill="url(#arsya-hijab)"
      />
      <ellipse cx="50" cy="45" rx="17.5" ry="19.5" fill="#f6cba6" />
      <path d="M27 42c0-15 10-25 23-25s23 10 23 25c-4-9-11-13-23-13s-19 4-23 13z" fill="#7c3aed" />
      <path d="M31 60c3 12 9 18 19 18s16-6 19-18c-5 5-12 7-19 7s-14-2-19-7z" fill="#8b5cf6" />
      <ellipse cx="42.5" cy="45" rx="3.2" ry="3.9" fill="#2b2118" />
      <ellipse cx="57.5" cy="45" rx="3.2" ry="3.9" fill="#2b2118" />
      <circle cx="43.8" cy="43.4" r="1.15" fill="#fff" />
      <circle cx="58.8" cy="43.4" r="1.15" fill="#fff" />
      <path d="M37.5 38c2-2 5.5-2 7.5 0" stroke="#3b2b23" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M55 38c2-2 5.5-2 7.5 0" stroke="#3b2b23" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M43 55c3 4 11 4 14 0" stroke="#b4623f" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="36" cy="51" r="3.6" fill="#f6a6a0" opacity="0.5" />
      <circle cx="64" cy="51" r="3.6" fill="#f6a6a0" opacity="0.5" />
    </svg>
  );
}

/* ================= tombol & kartu ================= */

export function Btn({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled,
  type = "button",
  title,
}: {
  children: ReactNode;
  variant?: "primary" | "blue" | "green" | "ghost";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
}) {
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
    >
      {children}
    </button>
  );
}

export function ProgressBar({ value, max = 100, tone = "green", label }: { value: number; max?: number; tone?: "green" | "sun" | "blue"; label?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-[12px] font-bold text-ink-soft">
          <span>{label}</span>
          <span className="tabular-nums">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="bar-track h-3.5">
        <div className={`bar-fill ${tone === "sun" ? "bar-fill-sun" : ""} h-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Chip({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "sun" | "green" | "grape" | "coral" }) {
  const map: Record<string, string> = {
    blue: "bg-brand-soft text-brand-dark",
    sun: "bg-[#fff3d1] text-[#8a5a00]",
    green: "bg-[#dcfce7] text-[#136c3a]",
    grape: "bg-grape-soft text-[#6d3fd6]",
    coral: "bg-[#ffe6e6] text-[#b23b3b]",
  };
  return <span className={`pill ${map[tone]}`}>{children}</span>;
}

export function SectionTitle({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <div className="mb-5">
      {kicker && <div className="step-label mb-1.5">{kicker}</div>}
      <h2 className="font-display text-[26px] leading-tight font-extrabold text-ink sm:text-[32px]">{title}</h2>
      {sub && <p className="mt-1.5 max-w-2xl text-[15px] font-semibold text-ink-soft">{sub}</p>}
    </div>
  );
}

/* ================= suara ================= */

export function SpeakButton({ text, label = "Dengarkan" }: { text: string; label?: string }) {
  const { speak, stopSpeak, speaking, sfx } = useApp();
  return (
    <button
      onClick={() => {
        sfx("click");
        if (speaking) stopSpeak();
        else speak(text);
      }}
      className="btn btn-ghost px-4 py-2.5 text-[13px]"
    >
      {speaking ? <Square size={16} /> : <Volume2 size={16} />}
      {speaking ? "Berhenti" : label}
    </button>
  );
}

export function ReplayButton({ text }: { text: string }) {
  const { speak, sfx } = useApp();
  return (
    <button
      onClick={() => {
        sfx("click");
        speak(text);
      }}
      className="btn btn-ghost px-4 py-2.5 text-[13px]"
    >
      <RotateCcw size={16} /> Ulangi
    </button>
  );
}

export function CharacterBubble({
  who,
  children,
  name,
}: {
  who: "hanif" | "arsya";
  children: ReactNode;
  name?: string;
}) {
  const label = name ?? (who === "hanif" ? "Hanif" : "Arsya");
  const text = typeof children === "string" ? children : "";
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 rounded-full border-4 border-white shadow-pop">
        <Avatar who={who} size={62} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="speech p-4">
          <div className="mb-1 flex items-center gap-2">
            <span className={`pill ${who === "hanif" ? "bg-brand-soft text-brand-dark" : "bg-grape-soft text-[#6d3fd6]"}`}>
              {label}
            </span>
            {text && <SpeakButton text={text} label="🔊" />}
          </div>
          <div className="text-[15px] font-semibold leading-relaxed text-ink">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ================= angka & digit ================= */

export function DigitNumber({
  tokens,
  onDigitClick,
  size = "lg",
  pulseDet = true,
}: {
  tokens: DigitToken[];
  onDigitClick?: (index: number) => void;
  size?: "sm" | "md" | "lg";
  pulseDet?: boolean;
}) {
  const fs = size === "lg" ? "text-[44px] sm:text-[58px]" : size === "md" ? "text-[32px]" : "text-[22px]";
  return (
    <div className={`flex flex-wrap items-center justify-center gap-1 font-display font-extrabold ${fs}`}>
      {tokens.map((t, i) =>
        t.role === "comma" ? (
          <span key={`c${i}`} className="px-0.5 text-ink">
            ,
          </span>
        ) : (
          <button
            key={i}
            type="button"
            disabled={!onDigitClick}
            onClick={() => onDigitClick?.(t.index)}
            className={[
              "digit-box",
              t.role === "kept" ? "digit-kept" : t.role === "det" ? `digit-det ${pulseDet ? "pulse" : ""}` : "digit-drop",
              onDigitClick ? "cursor-pointer hover:scale-110" : "cursor-default",
            ].join(" ")}
          >
            {t.ch}
          </button>
        ),
      )}
    </div>
  );
}

export function NumberLine({ result }: { result: RoundResult }) {
  const step = Math.pow(10, PLACES[result.place].exp);
  const val = toNumber(result.input);
  const low = Math.floor(val / step) * step;
  const high = low + step;
  const dec = Math.max(0, -PLACES[result.place].exp);
  const pos = Math.max(0, Math.min(1, (val - low) / step));
  const ticks = Array.from({ length: 11 }, (_, i) => i / 10);
  return (
    <div className="card-soft px-4 pt-4 pb-3">
      <div className="relative h-[86px]">
        <div className="absolute top-[34px] right-0 left-0 h-2 rounded-full bg-gradient-to-r from-[#bfd9f7] via-[#8fc2f5] to-[#bfd9f7]" />
        {ticks.map((t, i) => (
          <div key={i} className="absolute top-[22px]" style={{ left: `${t * 100}%` }}>
            <div
              className={`w-[3px] -translate-x-1/2 rounded-full ${i === 0 || i === 5 || i === 10 ? "h-8 bg-brand/45" : "h-5 bg-brand/25"}`}
            />
          </div>
        ))}
        <div
          className="absolute top-0 transition-all duration-700"
          style={{ left: `${pos * 100}%`, transform: "translateX(-50%)" }}
        >
          <div className="flex flex-col items-center">
            <div className={`rounded-full px-2.5 py-1 font-display text-[13px] font-extrabold text-white shadow-pop ${result.roundUp ? "bg-grape" : "bg-brand"}`}>
              {result.input}
            </div>
            <div className={`h-4 w-[3px] ${result.roundUp ? "bg-grape" : "bg-brand"}`} />
            <div className="-mt-[2px] h-0 w-0 border-x-[7px] border-t-[10px] border-x-transparent border-t-grape" />
          </div>
        </div>
        <div className="absolute top-[58px] left-0 font-display text-[15px] font-extrabold text-ink">
          {fmtPos(low, dec)}
        </div>
        <div className="absolute top-[58px] left-1/2 -translate-x-1/2 font-display text-[13px] font-bold text-ink-soft">
          {fmtPos(low + step / 2, dec)}
        </div>
        <div className="absolute top-[58px] right-0 font-display text-[15px] font-extrabold text-ink">
          {fmtPos(high, dec)}
        </div>
      </div>
    </div>
  );
}

function fmtPos(n: number, dec: number): string {
  const s = n.toFixed(dec);
  const parts = s.split(".");
  const ip = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts[1] ? `${ip},${parts[1]}` : ip;
}

/* ================= alur proses ================= */

export function ProcessRow({ label, children, tone = "blue" }: { label: string; children: ReactNode; tone?: "blue" | "grape" | "sun" | "green" }) {
  const map: Record<string, string> = {
    blue: "border-brand/25 bg-brand-soft text-brand-dark",
    grape: "border-grape/30 bg-grape-soft text-[#6d3fd6]",
    sun: "border-[#ffd772] bg-[#fff6db] text-[#8a5a00]",
    green: "border-[#a7e9c2] bg-[#e8fbef] text-[#136c3a]",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.2, 0.9, 0.25, 1] }}
      className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 ${map[tone]}`}
    >
      <div className="w-[132px] shrink-0 text-[11px] font-extrabold tracking-[0.12em] uppercase opacity-85">{label}</div>
      <div className="min-w-0 flex-1 font-display text-[19px] font-extrabold text-ink">{children}</div>
    </motion.div>
  );
}

export function FlowArrow() {
  return (
    <div className="flex justify-center py-1 text-brand/45">
      <ArrowDown size={20} strokeWidth={3} />
    </div>
  );
}

export function RoundingProcess({ result }: { result: RoundResult }) {
  return (
    <div className="w-full">
      <ProcessRow label="Bilangan awal">{result.input}</ProcessRow>
      <FlowArrow />
      <ProcessRow label="Tempat pembulatan">{result.placeLabel}</ProcessRow>
      <FlowArrow />
      <ProcessRow label="Angka dipertahankan" tone="sun">
        {result.placeDigit} <span className="ml-1 text-[13px] font-bold opacity-70">(tempat {result.placeLabel.toLowerCase()})</span>
      </ProcessRow>
      <FlowArrow />
      <ProcessRow label="Angka penentu" tone="grape">
        {result.detExists ? result.detDigit : "—"}{" "}
        <span className="ml-1 text-[13px] font-bold opacity-70">
          (tempat {result.detLabel.toLowerCase()})
        </span>
      </ProcessRow>
      <FlowArrow />
      <ProcessRow label="Aturan">{result.rule}</ProcessRow>
      <FlowArrow />
      <ProcessRow label="Hasil pembulatan" tone="green">
        {result.result}
      </ProcessRow>
    </div>
  );
}

/* ================= petunjuk & toast ================= */

export function HintPanel({ hints, level }: { hints: string[]; level: number }) {
  return (
    <div className="card-soft border-[#ffe08a] bg-[#fff9e8] p-4">
      <div className="mb-2 flex items-center gap-2 font-display text-[15px] font-extrabold text-[#8a5a00]">
        <Lightbulb size={18} /> Petunjuk
      </div>
      <ul className="space-y-1.5">
        {hints.slice(0, level).map((h, i) => (
          <li key={i} className="flex gap-2 text-[14px] font-semibold text-[#7a5200]">
            <span className="font-display text-[#c98f00]">💡</span>
            {h}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StarRow({ count, total = 3 }: { count: number; total?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <Star
          key={i}
          size={22}
          className={i < count ? "fill-sun text-sun" : "text-[#cfe0f2]"}
          strokeWidth={2.5}
        />
      ))}
    </div>
  );
}

/* ================= logo WAH ================= */

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="wah-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd772" />
          <stop offset="1" stopColor="#ffc02e" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="18" fill="#2563eb" />
      <rect x="8" y="8" width="48" height="48" rx="15" fill="url(#wah-g)" />
      <path d="M32 15l4.6 9.6 10.4 1.5-7.5 7.4 1.8 10.5L32 39.1l-9.3 4.9 1.8-10.5-7.5-7.4 10.4-1.5z" fill="#2563eb" />
    </svg>
  );
}

export function WahLogo({
  size = "md",
  showText = true,
  compact = false,
}: {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  compact?: boolean;
}) {
  const { p } = useApp();
  const [broken, setBroken] = useState(false);
  const px = size === "sm" ? 32 : size === "lg" ? 58 : 42;
  const textSize = size === "sm" ? "text-[13px]" : size === "lg" ? "text-[19px]" : "text-[15px]";
  const src = p.logoWAH.data;
  return (
    <div className="flex items-center gap-2.5">
      {src && !broken ? (
        <img
          src={src}
          alt="Logo WAH"
          onError={() => setBroken(true)}
          style={{ height: px, width: "auto" }}
          className="rounded-lg object-contain"
        />
      ) : src && broken ? (
        <div
          style={{ height: px, width: px }}
          className="grid place-items-center rounded-xl bg-[#fff3d1] font-display text-[11px] font-extrabold text-[#8a5a00]"
        >
          LOGO
        </div>
      ) : (
        <LogoMark size={px} />
      )}
      {showText && (
        <div className={compact ? "hidden sm:block" : ""}>
          <div className={`font-display ${textSize} leading-none font-extrabold text-ink`}>WAH Official</div>
          {!compact && <div className="text-[10px] font-bold tracking-[0.18em] text-ink-soft uppercase">Petualangan Angka</div>}
        </div>
      )}
    </div>
  );
}
