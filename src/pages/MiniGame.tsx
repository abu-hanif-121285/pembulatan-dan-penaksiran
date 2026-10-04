import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Gamepad2, RotateCcw, Rocket, Target, ChevronRight } from "lucide-react";
import { PLACES, makeQuestion, type Question } from "../lib/math";
import { useApp } from "../lib/store";
import { Btn, Chip, ProgressBar, SectionTitle, CharacterBubble } from "../components/ui";
import type { PageKey } from "../components/Layout";

type GameKey = "tangkap" | "roket";

export default function MiniGame({ setPage }: { setPage: (p: PageKey) => void }) {
  const [game, setGame] = useState<GameKey | null>(null);

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="🎮 Mini Game"
        title="Belajar Sambil Bermain"
        sub="Dua permainan seru untuk melatih kecepatan membulatkan bilangan."
      />

      {!game && (
        <div className="grid gap-5 lg:grid-cols-2">
          <GameCard
            img="images/feat-tangkap.png"
            title="TANGKAP ANGKA"
            desc="Sebuah bilangan muncul. Pilih hasil pembulatan yang benar sebelum waktunya habis!"
            color="#f59e0b"
            icon={<Target size={26} />}
            onPlay={() => setGame("tangkap")}
          />
          <GameCard
            img="images/feat-roket.png"
            title="ROKET PEMBULATAN"
            desc="Bantu Hanif dan Arsya meluncurkan roket dengan menjawab soal pembulatan dengan tepat."
            color="#8b5cf6"
            icon={<Rocket size={26} />}
            onPlay={() => setGame("roket")}
          />
          <div className="lg:col-span-2">
            <CharacterBubble who="hanif">
              Ayo bermain! Kalau jawabanmu benar, roket akan meluncur. Kalau belum tepat, tidak apa-apa — coba baca
              petunjuknya lagi.
            </CharacterBubble>
          </div>
        </div>
      )}

      {game === "tangkap" && <TangkapAngka onExit={() => setGame(null)} setPage={setPage} />}
      {game === "roket" && <RoketPembulatan onExit={() => setGame(null)} setPage={setPage} />}
    </div>
  );
}

function GameCard({
  img,
  title,
  desc,
  color,
  icon,
  onPlay,
}: {
  img: string;
  title: string;
  desc: string;
  color: string;
  icon: ReactNode;
  onPlay: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="relative h-[190px] bg-[linear-gradient(150deg,#8ecdf7,#2563eb)]">
        <img
          src={img}
          alt={title}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        <div
          className="absolute bottom-4 left-4 grid h-14 w-14 place-items-center rounded-2xl text-white shadow-pop"
          style={{ background: color }}
        >
          {icon}
        </div>
      </div>
      <div className="p-6">
        <div className="font-display text-[24px] font-extrabold" style={{ color }}>
          {title}
        </div>
        <p className="mt-2 text-[15px] font-semibold text-ink-soft">{desc}</p>
        <Btn className="mt-5 w-full px-6 py-4 text-[16px]" onClick={onPlay}>
          <Gamepad2 size={19} /> MULAI MAIN
        </Btn>
      </div>
    </div>
  );
}

/* =============== GAME 1: TANGKAP ANGKA =============== */

function TangkapAngka({ onExit, setPage }: { onExit: () => void; setPage: (p: PageKey) => void }) {
  const { sfx, update } = useApp();
  const rounds = 10;
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const questions: Question[] = useMemo(
    () => Array.from({ length: rounds }, () => makeQuestion("sedang", "hasil")),
    [],
  );
  const q = questions[idx];

  const finishGame = (finalScore: number) => {
    update((prev) => ({
      ...prev,
      games: { ...prev.games, tangkap: Math.max(prev.games.tangkap, finalScore) },
      points: prev.points + finalScore,
      stars: prev.stars + (finalScore >= 100 ? 3 : finalScore >= 60 ? 2 : 1),
    }));
  };

  const answer = (opt: string) => {
    if (!q || feedback) return;
    const ok = opt === q.answer;
    sfx(ok ? "correct" : "wrong");
    let nextScore = score;
    if (ok) {
      nextScore = score + 10 + streak * 2;
      setScore(nextScore);
      setStreak((s) => s + 1);
      setFeedback({ ok: true, msg: `🎉 Benar! ${q.number} ≈ ${q.answer}` });
    } else {
      setStreak(0);
      setFeedback({ ok: false, msg: "💡 Belum tepat. Lihat satu angka di sebelah kanan tempat pembulatan." });
    }
    window.setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= Math.min(rounds, questions.length)) {
        setDone(true);
        sfx("finish");
        finishGame(nextScore);
      } else setIdx((i) => i + 1);
    }, 1150);
  };

  if (done) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#fff3d1] text-[38px]">🏆</div>
        <h3 className="mt-4 font-display text-[32px] font-extrabold text-ink">Permainan Selesai!</h3>
        <div className="mt-2 text-[16px] font-semibold text-ink-soft">Skor akhirmu: {score} poin</div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Btn
            className="px-6 py-3.5 text-[15px]"
            onClick={() => {
              setIdx(0);
              setScore(0);
              setStreak(0);
              setDone(false);
              sfx("game");
            }}
          >
            <RotateCcw size={18} /> Main Lagi
          </Btn>
          <Btn variant="ghost" className="px-6 py-3.5 text-[15px]" onClick={onExit}>
            Pilih Game Lain
          </Btn>
          <Btn variant="ghost" className="px-6 py-3.5 text-[15px]" onClick={() => setPage("latihan")}>
            Latihan <ChevronRight size={18} />
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sun text-white">
              <Target size={24} />
            </div>
            <div>
              <div className="step-label">Tangkap Angka</div>
              <div className="font-display text-[20px] font-extrabold text-ink">
                Ronde {idx + 1} dari {rounds}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Chip tone="sun">⭐ Skor {score}</Chip>
            <Chip tone="coral">🔥 Streak {streak}</Chip>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={idx + 1} max={rounds} tone="sun" />
        </div>
        <button onClick={onExit} className="btn btn-ghost mt-4 px-4 py-2.5 text-[13px]">
          Keluar Game
        </button>
      </div>

      {q && (
        <div className="card overflow-hidden p-7 text-center">
          <div className="text-[15px] font-semibold text-ink-soft">
            Bulatkan bilangan ini ke {q.place ? PLACES[q.place].label.toLowerCase() : "tempat yang benar"}!
          </div>
          <motion.div
            key={q.id}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="my-5"
          >
            <div className="inline-block rounded-[26px] bg-[linear-gradient(150deg,#8ecdf7,#2563eb)] px-10 py-6 shadow-pop">
              <div className="font-display text-[52px] leading-none font-extrabold text-white">{q.number}</div>
            </div>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-3">
            {q.options.map((opt, i) => (
              <motion.button
                key={opt}
                initial={{ opacity: 0, y: 22 + i * 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 200, damping: 16 }}
                onClick={() => answer(opt)}
                className="rounded-2xl border-2 border-line bg-white px-5 py-5 font-display text-[28px] font-extrabold text-ink transition hover:-translate-y-1 hover:border-brand-light hover:bg-brand-soft"
              >
                {opt}
              </motion.button>
            ))}
          </div>

          {feedback && (
            <div
              className={`pop-in mt-5 rounded-2xl px-5 py-4 font-display text-[18px] font-extrabold ${
                feedback.ok ? "bg-[#e8fbef] text-[#136c3a]" : "bg-[#fff1f1] text-[#b23b3b]"
              }`}
            >
              {feedback.msg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =============== GAME 2: ROKET PEMBULATAN =============== */

function RoketPembulatan({ onExit, setPage }: { onExit: () => void; setPage: (p: PageKey) => void }) {
  const { sfx, update } = useApp();
  const total = 8;
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const questions: Question[] = useMemo(
    () => Array.from({ length: total }, () => makeQuestion("mudah", "hasil")),
    [],
  );
  const q = questions[idx];

  const answer = (opt: string) => {
    if (!q || feedback) return;
    const ok = opt === q.answer;
    sfx(ok ? "game" : "wrong");
    if (ok) {
      setProgress((v) => Math.min(100, v + 100 / total));
      setFeedback({ ok: true, msg: "🚀 Roket meluncur! Jawabanmu benar." });
    } else {
      setWrong((w) => w + 1);
      setFeedback({
        ok: false,
        msg: `💡 Roket berhenti dulu. Angka penentu pada ${q.number} menentukan hasil pembulatannya.`,
      });
    }
    window.setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= Math.min(total, questions.length)) {
        setDone(true);
        sfx("finish");
        update((prev) => ({
          ...prev,
          games: { ...prev.games, roket: Math.max(prev.games.roket, Math.round(progress)) },
          stars: prev.stars + (wrong === 0 ? 3 : 1),
          points: prev.points + (total - wrong) * 10,
        }));
      } else setIdx((i) => i + 1);
    }, 1250);
  };

  if (done) {
    return (
      <div className="card overflow-hidden">
        <div className="relative h-[220px] bg-[linear-gradient(160deg,#0f2f66,#2563eb_55%,#7cc7f7)]">
          <div className="absolute inset-0 opacity-70">
            {["10", "20", "30", "40", "50"].map((n, i) => (
              <span
                key={n}
                className="floaty absolute font-display text-[38px] font-extrabold text-white/45"
                style={{ left: `${12 + i * 17}%`, top: `${20 + (i % 3) * 22}%`, animationDelay: `${i * 0.4}s` }}
              >
                {n}
              </span>
            ))}
          </div>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center text-white">
              <div className="text-[52px]">🚀</div>
              <div className="mt-1 font-display text-[28px] font-extrabold">Roket Mendarat dengan Selamat!</div>
            </div>
          </div>
        </div>
        <div className="p-7 text-center">
          <div className="text-[16px] font-semibold text-ink-soft">
            Kamu menyelesaikan {total} soal dengan {wrong} kali salah.
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Btn
              className="px-6 py-3.5 text-[15px]"
              onClick={() => {
                setIdx(0);
                setProgress(0);
                setWrong(0);
                setDone(false);
                sfx("game");
              }}
            >
              <RotateCcw size={18} /> Main Lagi
            </Btn>
            <Btn variant="ghost" className="px-6 py-3.5 text-[15px]" onClick={onExit}>
              Pilih Game Lain
            </Btn>
            <Btn variant="blue" className="px-6 py-3.5 text-[15px]" onClick={() => setPage("kuis")}>
              Ikuti Kuis <ChevronRight size={18} />
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="card overflow-hidden">
        <div className="relative h-[190px] bg-[linear-gradient(160deg,#12296b,#2563eb_50%,#8ecdf7)]">
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[#1b3f2a] opacity-70" />
          <motion.div
            className="absolute bottom-8 text-[58px]"
            animate={{ left: `${8 + progress * 0.72}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            style={{ left: "8%" }}
          >
            🚀
          </motion.div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center text-white">
            <div className="step-label text-white/80">Roket Pembulatan</div>
            <div className="font-display text-[22px] font-extrabold">Menuju Planet Angka</div>
          </div>
          <div className="absolute right-5 bottom-5 h-3 w-[72%] rounded-full bg-white/25">
            <div className="h-full rounded-full bg-sun transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="p-6">
          <ProgressBar value={progress} label="Jarak tempuh roket" tone="sun" />
          <div className="mt-3 flex items-center justify-between">
            <div className="font-display text-[18px] font-extrabold text-ink">
              Soal {idx + 1} dari {total}
            </div>
            <button onClick={onExit} className="btn btn-ghost px-4 py-2.5 text-[13px]">
              Keluar Game
            </button>
          </div>
        </div>
      </div>

      {q && (
        <div className="card p-7">
          <p className="text-[19px] leading-relaxed font-bold text-ink">{q.prompt}</p>
          <div className="mt-4 rounded-2xl bg-[linear-gradient(150deg,#eaf2ff,#d3ecff)] px-6 py-4 text-center">
            <div className="font-display text-[38px] leading-none font-extrabold text-brand-dark">{q.number}</div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => answer(opt)}
                className="rounded-2xl border-2 border-line bg-white px-5 py-5 font-display text-[26px] font-extrabold text-ink transition hover:-translate-y-1 hover:border-brand-light hover:bg-brand-soft"
              >
                {opt}
              </button>
            ))}
          </div>
          {feedback && (
            <div
              className={`pop-in mt-5 rounded-2xl px-5 py-4 font-display text-[17px] font-extrabold ${
                feedback.ok ? "bg-[#e8fbef] text-[#136c3a]" : "bg-[#fff1f1] text-[#b23b3b]"
              }`}
            >
              {feedback.msg}
            </div>
          )}
        </div>
      )}

      <CharacterBubble who="arsya">
        Perhatikan angka penentunya, yaitu satu angka di sebelah kanan tempat pembulatan. Kamu pasti bisa!
      </CharacterBubble>
    </div>
  );
}
