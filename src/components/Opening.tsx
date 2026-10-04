import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { WahLogo } from "./ui";

const NUMBERS = ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];

export function Opening({ onDone }: { onDone: () => void }) {
  const [imgOk, setImgOk] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(onDone, 3600);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] overflow-hidden"
    >
      <div className="absolute inset-0">
        {imgOk ? (
          <img
            src="images/hero-characters.png"
            alt=""
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover object-[28%_center]"
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(160deg,#2563eb,#7cc7f7_60%,#eaf6ff)]" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(13,42,92,0.86)_0%,rgba(24,74,152,0.68)_45%,rgba(37,99,235,0.42)_100%)]" />
      </div>

      {/* angka melayang */}
      <div className="pointer-events-none absolute inset-0">
        {NUMBERS.map((n, i) => (
          <span
            key={n}
            className="floaty absolute font-display text-[46px] font-extrabold text-white/25 sm:text-[72px]"
            style={{
              left: `${(i % 5) * 19 + 4}%`,
              top: `${Math.floor(i / 5) * 46 + 8}%`,
              animationDelay: `${i * 0.32}s`,
            }}
          >
            {n}
          </span>
        ))}
      </div>

      <div className="absolute inset-0 grid w-full place-items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.2, 0.9, 0.25, 1] }}
          className="text-center"
        >
          <div className="mx-auto inline-flex rounded-[22px] bg-white/12 p-3 ring-1 ring-white/25">
            <WahLogo size="md" showText />
          </div>

          <h1 className="mt-7 font-display text-[46px] leading-[0.92] font-extrabold text-white sm:text-[86px]">
            PETUALANGAN
            <br />
            <span className="bg-gradient-to-r from-[#ffd05a] to-[#ffc02e] bg-clip-text text-transparent">ANGKA</span>
          </h1>

          <div className="mt-4 inline-flex rounded-full bg-white/16 px-6 py-2 font-display text-[15px] font-bold text-white ring-1 ring-white/25 sm:text-[19px]">
            Pembulatan &amp; Penaksiran
          </div>

          <p className="mx-auto mt-5 max-w-[560px] text-[15px] leading-relaxed font-semibold text-white/90 sm:text-[19px]">
            Belajar Matematika Jadi Lebih Mudah, Seru, dan Menyenangkan!
          </p>

          <button type="button" onClick={onDone} className="btn btn-primary mt-8 px-9 py-5 text-[18px]">
            <Play size={22} /> KETUK UNTUK MULAI
          </button>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/15">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3.6, ease: "linear" }}
          className="h-full bg-sun"
        />
      </div>
    </motion.div>
  );
}
