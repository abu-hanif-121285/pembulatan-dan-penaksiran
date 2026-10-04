import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, ChevronRight, Flame, Star, Target } from "lucide-react";
import { PLACES, questionBank, type Question } from "../lib/math";
import { useApp } from "../lib/store";
import { Btn, Chip, ProgressBar, SectionTitle, StarRow, CharacterBubble, SpeakButton } from "../components/ui";
import { QuestionCard } from "../components/QuestionCard";
import type { PageKey } from "../components/Layout";

const TOTAL = 20;

export default function Kuis({ setPage }: { setPage: (p: PageKey) => void }) {
  const { p, update, sfx, toast } = useApp();
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [finished, setFinished] = useState(false);
  const [weak, setWeak] = useState<string[]>([]);
  const savedRef = useRef(false);

  const questions: Question[] = useMemo(() => {
    if (!started) return [];
    const easy = questionBank("mudah", 6);
    const mid = questionBank("sedang", 7);
    const hard = questionBank("menantang", 7);
    return [...easy, ...mid, ...hard];
  }, [started]);

  const score100 = Math.round((correct / TOTAL) * 100);
  const category =
    score100 >= 90
      ? { label: "🏆 Sangat Baik", color: "#22c55e", note: "Kamu luar biasa! Pertahankan ya." }
      : score100 >= 80
        ? { label: "🌟 Baik", color: "#2563eb", note: "Bagus! Sedikit lagi jadi sempurna." }
        : score100 >= 70
          ? { label: "👍 Cukup", color: "#f59e0b", note: "Terus berlatih, kamu pasti bisa!" }
          : { label: "💪 Ayo Berlatih Lagi", color: "#ff6b6b", note: "Jangan menyerah, pelajari lagi materinya." };

  const start = () => {
    sfx("level");
    setStarted(true);
    setIdx(0);
    setCorrect(0);
    setWrong(0);
    setStreak(0);
    setBest(0);
    setWeak([]);
    setFinished(false);
    savedRef.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveResult = (c: number, streakBest: number, weakTopics: string[]) => {
    if (savedRef.current) return;
    savedRef.current = true;
    const score = Math.round((c / TOTAL) * 100);
    update((prev) => ({
      ...prev,
      quizScores: [
        { date: new Date().toLocaleDateString("id-ID"), score, correct: c, total: TOTAL, kind: "Kuis Akhir" },
        ...prev.quizScores,
      ].slice(0, 12),
      lastScore: score,
      points: prev.points + c * 10,
      stars: prev.stars + (score >= 90 ? 5 : score >= 80 ? 4 : score >= 70 ? 3 : 1),
      streak: score >= 70 ? prev.streak + 1 : 0,
      bestStreak: Math.max(prev.bestStreak, streakBest),
      completedLessons: prev.completedLessons,
      exerciseScores: weakTopics.length ? prev.exerciseScores : prev.exerciseScores,
    }));
    sfx("finish");
  };

  /* ---------- HALAMAN AWAL ---------- */
  if (!started) {
    return (
      <div className="space-y-6">
        <SectionTitle
          kicker="🏆 Kuis Akhir"
          title="Uji Pemahamanmu"
          sub="20 soal dengan tingkat kesulitan yang meningkat. Kerjakan dengan tenang dan cermat!"
        />

        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div className="card p-7">
            <div className="flex flex-wrap gap-2">
              <Chip tone="blue">20 soal</Chip>
              <Chip tone="sun">+10 poin per jawaban benar</Chip>
              <Chip tone="coral">🔥 Combo 3 jawaban benar</Chip>
              <Chip tone="green">⭐ Bintang bonus</Chip>
            </div>

            <div className="mt-6 step-label">Materi yang Diujikan</div>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {[
                "Pembulatan ke satuan",
                "Pembulatan ke puluhan",
                "Pembulatan ke ratusan",
                "Pembulatan ke ribuan",
                "Pembulatan desimal ke satuan",
                "Pembulatan ke persepuluhan",
                "Pembulatan ke perseratusan",
                "Pembulatan ke perseribuan",
                "Menentukan angka penentu",
                "Menentukan tempat pembulatan",
                "Penaksiran penjumlahan",
                "Penaksiran pengurangan",
                "Penaksiran perkalian",
                "Penaksiran pembagian",
              ].map((m) => (
                <div key={m} className="flex items-center gap-2.5 rounded-2xl bg-[#f7fbff] px-4 py-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-soft text-brand-dark">
                    <Target size={13} />
                  </span>
                  <span className="text-[14px] font-bold text-ink">{m}</span>
                </div>
              ))}
            </div>

            <Btn className="mt-7 w-full px-7 py-5 text-[19px]" onClick={start}>
              <Trophy size={22} /> MULAI KUIS
            </Btn>
            {p.lastScore !== null && (
              <div className="mt-3 text-center text-[13px] font-bold text-ink-soft">
                Skor terakhirmu: <b className="text-ink">{p.lastScore}</b> / 100
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="card p-6">
              <div className="step-label mb-2">Aturan Kuis</div>
              <ul className="space-y-2.5">
                {[
                  "Setiap jawaban benar bernilai 10 poin.",
                  "Jawaban salah tidak mengurangi poin.",
                  "3 jawaban benar berturut-turut mendapat COMBO! 🔥",
                  "Tersedia tombol Petunjuk dan Proses Berpikir.",
                  "Hasil tersimpan di Hasil Belajar.",
                ].map((r) => (
                  <li key={r} className="flex items-start gap-2.5">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-sun" />
                    <span className="text-[14.5px] font-semibold text-ink-soft">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <CharacterBubble who="arsya">
              Baca soal dengan teliti. Ingat slogan kita: <b>“Satu angka di kanan menentukan!”</b>
            </CharacterBubble>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- HASIL ---------- */
  if (finished) {
    const recs = weak.length ? Array.from(new Set(weak)) : [];
    return (
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="card overflow-hidden">
          <div className="bg-[linear-gradient(120deg,#1d4ed8,#3b82f6)] px-8 py-10 text-center text-white">
            <div className="step-label text-white/80">Hasil Belajar</div>
            <h2 className="mt-2 font-display text-[40px] leading-none font-extrabold">
              {score100} / 100
            </h2>
            <div className="mt-3 flex justify-center">
              <StarRow count={score100 >= 90 ? 5 : score100 >= 80 ? 4 : score100 >= 70 ? 3 : 1} total={5} />
            </div>
            <div className="mt-4 inline-block rounded-full bg-white/18 px-5 py-2 font-display text-[19px] font-extrabold">
              {category.label}
            </div>
            <div className="mt-2 text-[15px] font-semibold text-white/90">{category.note}</div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="card-soft p-5 text-center">
              <div className="font-display text-[36px] leading-none font-extrabold text-grass">{correct}</div>
              <div className="mt-1 text-[12px] font-bold text-ink-soft">Jawaban benar</div>
            </div>
            <div className="card-soft p-5 text-center">
              <div className="font-display text-[36px] leading-none font-extrabold text-coral">{wrong}</div>
              <div className="mt-1 text-[12px] font-bold text-ink-soft">Jawaban salah</div>
            </div>
            <div className="card-soft p-5 text-center">
              <div className="font-display text-[36px] leading-none font-extrabold text-sun-dark">{best}</div>
              <div className="mt-1 text-[12px] font-bold text-ink-soft">🔥 Streak terbaik</div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <ProgressBar value={score100} label="Progress ketepatan" />
            <div className="mt-4 h-5 w-full overflow-hidden rounded-full bg-[#e2edf9]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-[linear-gradient(90deg,#4ade80,#22c55e)]"
              />
            </div>

            {recs.length > 0 && (
              <div className="mt-6 rounded-2xl border-2 border-[#ffd772] bg-[#fff9e8] p-5">
                <div className="font-display text-[16px] font-extrabold text-[#8a5a00]">
                  💡 Materi yang perlu dipelajari kembali
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {recs.map((r) => (
                    <span key={r} className="pill bg-white text-[#8a5a00] ring-1 ring-[#ffd772]">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <Btn className="px-6 py-3.5 text-[15px]" onClick={start}>
                <RotateCcw size={18} /> Ulangi Kuis
              </Btn>
              <Btn variant="blue" className="px-6 py-3.5 text-[15px]" onClick={() => setPage("hasil")}>
                Lihat Hasil Belajar <ChevronRight size={18} />
              </Btn>
              <Btn variant="ghost" className="px-6 py-3.5 text-[15px]" onClick={() => setPage("materi")}>
                Pelajari Materi Lagi
              </Btn>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <CharacterBubble who="hanif">
            {score100 >= 80
              ? "Hebat! Kamu sudah semakin jago membulatkan dan menaksirkan bilangan!"
              : "Usaha yang bagus! Ayo pelajari lagi bagian yang sulit, lalu coba kuisnya sekali lagi."}
          </CharacterBubble>
          <CharacterBubble who="arsya">
            Jangan takut salah. Kesalahan membantu kita belajar. Terus berlatih sedikit setiap hari, ya!
          </CharacterBubble>
        </div>
      </div>
    );
  }

  /* ---------- SOAL ---------- */
  const q = questions[idx];
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="step-label">Kuis Akhir</div>
            <div className="font-display text-[22px] font-extrabold text-ink">
              Soal {idx + 1} dari {TOTAL}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="sun">
              <Star size={13} className="fill-sun text-sun" /> {correct * 10} poin
            </Chip>
            <Chip tone="coral">
              <Flame size={13} /> Streak {streak}
            </Chip>
            <SpeakButton text={q ? q.prompt : ""} label="Bacakan" />
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={idx + 1} max={TOTAL} tone="sun" label="Progress kuis" />
        </div>
      </div>

      {streak >= 3 && (
        <div className="pop-in rounded-2xl bg-[linear-gradient(100deg,#ff9f43,#ffc02e)] px-5 py-3 text-center font-display text-[17px] font-extrabold text-[#6b3f00] shadow-pop">
          🔥 COMBO! {streak} jawaban benar berturut-turut!
        </div>
      )}

      {q && (
        <QuestionCard
          key={`${idx}-${q.id}`}
          q={q}
          cta={idx === TOTAL - 1 ? "Lihat Hasil" : "Soal Berikutnya"}
          hanifLine={idx === 0 ? "Ayo kerjakan kuisnya! Baca setiap soal dengan teliti, ya." : undefined}
          onAnswered={(ok) => {
            let nextCorrect = correct;
            let nextWrong = wrong;
            let nextStreak = streak;
            let nextBest = best;
            const nextWeak = [...weak];

            if (ok) {
              nextCorrect = correct + 1;
              nextStreak = streak + 1;
              nextBest = Math.max(best, nextStreak);
              setCorrect(nextCorrect);
              setStreak(nextStreak);
              setBest(nextBest);
              toast(nextStreak > 0 && nextStreak % 3 === 0 ? `🔥 COMBO! +10 poin` : "Benar! +10 poin 🎉", "good");
            } else {
              nextWrong = wrong + 1;
              nextStreak = 0;
              setWrong(nextWrong);
              setStreak(0);
              if (q.type === "penaksiran") nextWeak.push("Penaksiran");
              else if (q.place) nextWeak.push(`Pembulatan ke ${PLACES[q.place].label.toLowerCase()}`);
              else if (q.type === "penentu") nextWeak.push("Angka penentu pembulatan");
              setWeak(nextWeak);
            }

            if (idx + 1 >= TOTAL) {
              setFinished(true);
              saveResult(nextCorrect, nextBest, nextWeak);
              window.scrollTo({ top: 0, behavior: "smooth" });
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
