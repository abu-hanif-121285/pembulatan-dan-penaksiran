import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, RotateCcw, Home, ArrowRight, Sparkles } from "lucide-react";
import { questionBank, type Difficulty, type Question } from "../lib/math";
import { useApp } from "../lib/store";
import { Btn, Chip, ProgressBar, SectionTitle, StarRow, CharacterBubble } from "../components/ui";
import { QuestionCard } from "../components/QuestionCard";
import type { PageKey } from "../components/Layout";

const LEVELS: { key: Difficulty; title: string; desc: string; count: number; color: string }[] = [
  { key: "mudah", title: "LEVEL MUDAH", desc: "Pembulatan puluhan & ratusan", count: 10, color: "#22c55e" },
  { key: "sedang", title: "LEVEL SEDANG", desc: "Ribuan & pembulatan desimal", count: 10, color: "#f59e0b" },
  { key: "menantang", title: "LEVEL MENANTANG", desc: "Carry, angka 5, & penaksiran", count: 10, color: "#ff6b6b" },
];

export default function Latihan({ setPage }: { setPage: (p: PageKey) => void }) {
  const { p, update, sfx, toast } = useApp();
  const [active, setActive] = useState<Difficulty | null>(null);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions: Question[] = useMemo(() => {
    if (!active) return [];
    return questionBank(active, 10).map((q, i) =>
      i === 3 || i === 7
        ? { ...q, type: "isian" as const, options: [], prompt: `Isi jawabannya: ${q.prompt}` }
        : q,
    );
  }, [active]);

  const start = (d: Difficulty) => {
    sfx("level");
    setActive(d);
    setIdx(0);
    setCorrect(0);
    setWrong(0);
    setFinished(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finish = (c: number, w: number) => {
    const score = c * 10;
    update((prev) => ({
      ...prev,
      exerciseScores: { ...prev.exerciseScores, [active ?? "mudah"]: Math.max(score, prev.exerciseScores[active ?? "mudah"] ?? 0) },
      points: prev.points + score,
      stars: prev.stars + (c >= 8 ? 3 : c >= 6 ? 2 : c >= 4 ? 1 : 0),
      streak: c > w ? prev.streak + 1 : 0,
      bestStreak: Math.max(prev.bestStreak, c > w ? prev.streak + 1 : 0),
    }));
    sfx("finish");
    setFinished(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!active) {
    return (
      <div className="space-y-6">
        <SectionTitle
          kicker="✏️ Latihan"
          title="Pilih Tingkat Latihan"
          sub="Setiap latihan berisi 10 soal dengan umpan balik langsung dan petunjuk bertahap."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {LEVELS.map((l) => (
            <motion.button
              key={l.key}
              whileHover={{ y: -6 }}
              onClick={() => start(l.key)}
              className="card overflow-hidden p-6 text-left"
            >
              <div
                className="mb-4 grid h-14 w-14 place-items-center rounded-2xl text-white shadow-pop"
                style={{ background: l.color }}
              >
                <Pencil size={26} />
              </div>
              <div className="font-display text-[22px] font-extrabold text-ink">{l.title}</div>
              <div className="mt-1 text-[14px] font-semibold text-ink-soft">{l.desc}</div>
              <div className="mt-4 flex items-center gap-2">
                <Chip tone={l.key === "mudah" ? "green" : l.key === "sedang" ? "sun" : "coral"}>{l.count} soal</Chip>
                <Chip tone="blue">Skor terbaik: {p.exerciseScores[l.key] ?? 0}</Chip>
              </div>
              <div
                className="mt-5 flex items-center justify-center gap-2 rounded-2xl py-3 font-display text-[15px] font-extrabold text-white"
                style={{ background: l.color }}
              >
                Mulai Latihan <ArrowRight size={18} />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <CharacterBubble who="hanif">
            Kalau kamu masih belajar, mulai dari <b>Level Mudah</b> dulu, ya. Setiap soal punya tombol{" "}
            <b>💡 Petunjuk</b> yang bisa dibuka bertahap.
          </CharacterBubble>
          <CharacterBubble who="arsya">
            Jangan takut salah. Kesalahan membantu kita belajar. Setelah menjawab, coba baca{" "}
            <b>Proses Berpikir</b> agar kamu paham alasannya.
          </CharacterBubble>
        </div>
      </div>
    );
  }

  if (finished) {
    const stars = correct >= 8 ? 3 : correct >= 6 ? 2 : correct >= 4 ? 1 : 0;
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="card overflow-hidden">
          <div className="bg-[linear-gradient(120deg,#1d4ed8,#3b82f6)] px-8 py-10 text-center text-white">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/20 text-[38px]">🎉</div>
            <h2 className="mt-4 font-display text-[34px] leading-tight font-extrabold">Latihan Selesai!</h2>
            <div className="mt-2 text-[16px] font-semibold text-white/90">
              Tingkat {active.toUpperCase()} • {correct} benar • {wrong} salah
            </div>
            <div className="mt-4 flex justify-center">
              <StarRow count={stars} />
            </div>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="card-soft p-4 text-center">
              <div className="font-display text-[34px] leading-none font-extrabold text-brand">{correct * 10}</div>
              <div className="mt-1 text-[12px] font-bold text-ink-soft">Poin didapat</div>
            </div>
            <div className="card-soft p-4 text-center">
              <div className="font-display text-[34px] leading-none font-extrabold text-grass">{correct}</div>
              <div className="mt-1 text-[12px] font-bold text-ink-soft">Jawaban benar</div>
            </div>
            <div className="card-soft p-4 text-center">
              <div className="font-display text-[34px] leading-none font-extrabold text-coral">{wrong}</div>
              <div className="mt-1 text-[12px] font-bold text-ink-soft">Jawaban salah</div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <ProgressBar value={correct} max={10} label="Ketepatan jawaban" />
            <div className="mt-5 flex flex-wrap gap-2">
              <Btn className="px-6 py-3.5 text-[15px]" onClick={() => start(active)}>
                <RotateCcw size={18} /> Ulangi Latihan
              </Btn>
              <Btn variant="ghost" className="px-6 py-3.5 text-[15px]" onClick={() => setActive(null)}>
                Pilih Tingkat Lain
              </Btn>
              <Btn variant="ghost" className="px-6 py-3.5 text-[15px]" onClick={() => setPage("minigame")}>
                <Sparkles size={18} /> Main Mini Game
              </Btn>
            </div>
          </div>
        </div>

        <CharacterBubble who="arsya">
          {correct >= 8
            ? "Hebat! Kamu sudah semakin jago membulatkan bilangan!"
            : "Usaha yang bagus! Mari pelajari lagi bagian yang masih sulit, lalu coba sekali lagi."}
        </CharacterBubble>
      </div>
    );
  }

  const q = questions[idx];
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="step-label">Latihan • {active.toUpperCase()}</div>
            <div className="font-display text-[22px] font-extrabold text-ink">
              Soal {idx + 1} dari {questions.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip tone="green">✅ {correct} benar</Chip>
            <Chip tone="coral">❌ {wrong} salah</Chip>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={idx + 1} max={questions.length} tone="sun" label="Progress latihan" />
        </div>
        <button
          onClick={() => {
            sfx("click");
            setActive(null);
          }}
          className="btn btn-ghost mt-4 px-4 py-2.5 text-[13px]"
        >
          <Home size={16} /> Keluar Latihan
        </button>
      </div>

      {q && (
        <QuestionCard
          key={`${active}-${idx}-${q.id}`}
          q={q}
          cta={idx === questions.length - 1 ? "Lihat Hasil" : "Soal Berikutnya"}
          onAnswered={(ok) => {
            if (ok) {
              setCorrect((c) => c + 1);
              toast("Hebat! Jawabanmu benar! +10 poin 🎉", "good");
              update((prev) => ({ ...prev, points: prev.points + 10 }));
            } else {
              setWrong((w) => w + 1);
            }
            if (idx === questions.length - 1) {
              finish(ok ? correct + 1 : correct, ok ? wrong : wrong + 1);
            } else {
              setIdx((i) => i + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        />
      )}
    </div>
  );
}
