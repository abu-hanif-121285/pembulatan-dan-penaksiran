import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lock, Check, Star, Home, RotateCcw, Volume2 } from "lucide-react";
import { LEVELS } from "../lib/levels";
import type { Level } from "../lib/levels";
import { digitTokens, detIndex, roundTo, digitAt, estimate } from "../lib/math";
import { useApp } from "../lib/store";
import {
  Btn,
  Chip,
  DigitNumber,
  NumberLine,
  ProgressBar,
  RoundingProcess,
  SectionTitle,
  CharacterBubble,
} from "../components/ui";
import { QuestionCard } from "../components/QuestionCard";
import type { PageKey } from "../components/Layout";

const STEPS = ["Kenali", "Perhatikan", "Coba", "Periksa", "Pahami", "Tantang Diri"];

export default function Materi({ setPage }: { setPage: (p: PageKey) => void }) {
  const { p, update, sfx, toast } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);

  const level = useMemo(() => LEVELS.find((l) => l.id === openId) ?? null, [openId]);

  if (level) {
    return (
      <LessonView
        level={level}
        setPage={setPage}
        onBack={() => setOpenId(null)}
        onDone={() => {
          const next = level.no + 1;
          update((prev) => ({
            ...prev,
            completedLessons: Array.from(new Set([...prev.completedLessons, level.id])),
            unlockedLevels: Math.max(prev.unlockedLevels, Math.min(LEVELS.length, next)),
            stars: prev.stars + 2,
            points: prev.points + 20,
            streak: prev.streak + 1,
            bestStreak: Math.max(prev.bestStreak, prev.streak + 1),
          }));
          sfx("level");
          toast(`Level ${level.no} selesai! +20 poin, +2 bintang ⭐`, "good");
          if (next <= LEVELS.length) setOpenId(LEVELS[next - 1].id);
          else setPage("latihan");
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="Materi Bertahap"
        title="16 Level Petualangan"
        sub="Selesaikan level satu per satu. Level berikutnya terbuka setelah level sebelumnya selesai."
      />

      <div className="card p-5">
        <ProgressBar
          value={p.completedLessons.length}
          max={LEVELS.length}
          label={`Progress materi • ${p.completedLessons.length}/${LEVELS.length} level selesai`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEVELS.map((l) => {
          const done = p.completedLessons.includes(l.id);
          const locked = l.no > p.unlockedLevels;
          return (
            <motion.button
              key={l.id}
              whileHover={locked ? undefined : { y: -5 }}
              onClick={() => {
                if (locked) {
                  sfx("wrong");
                  toast("Selesaikan level sebelumnya dulu, ya. 💪", "bad");
                  return;
                }
                sfx("click");
                setOpenId(l.id);
              }}
              className={`card relative overflow-hidden p-5 text-left ${locked ? "opacity-70" : ""}`}
            >
              <div
                className="absolute top-0 right-0 h-24 w-24 rounded-bl-[70px]"
                style={{
                  background: done
                    ? "linear-gradient(135deg,#dcfce7,#a7e9c2)"
                    : locked
                      ? "linear-gradient(135deg,#eef3f9,#dfeaf6)"
                      : "linear-gradient(135deg,#eaf2ff,#c9defb)",
                }}
              />
              <div className="relative">
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`grid h-11 w-11 place-items-center rounded-2xl font-display text-[18px] font-extrabold ${
                      done ? "bg-grass text-white" : locked ? "bg-[#e2edf9] text-ink-soft" : "bg-brand text-white"
                    }`}
                  >
                    {done ? <Check size={20} strokeWidth={4} /> : locked ? <Lock size={18} /> : l.no}
                  </div>
                  {done && (
                    <span className="pill bg-[#dcfce7] text-[#136c3a]">
                      <Star size={13} className="fill-sun text-sun" /> Selesai
                    </span>
                  )}
                </div>
                <div className="font-display text-[18px] leading-tight font-extrabold text-ink">{l.title}</div>
                <div className="mt-1 text-[13px] font-semibold text-ink-soft">{l.subtitle}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Chip tone={l.kind === "desimal" ? "grape" : l.kind === "penaksiran" ? "sun" : "blue"}>
                    {l.kind === "desimal"
                      ? "Desimal"
                      : l.kind === "penaksiran"
                        ? "Penaksiran"
                        : l.kind === "aplikasi"
                          ? "Kehidupan"
                          : "Bilangan Bulat"}
                  </Chip>
                  {locked && <Chip tone="coral">Terkunci</Chip>}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================ */

function LessonView({
  level,
  onBack,
  onDone,
  setPage,
}: {
  level: Level;
  onBack: () => void;
  onDone: () => void;
  setPage: (p: PageKey) => void;
}) {
  const { p, sfx, speak, toast } = useApp();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [cobaOk, setCobaOk] = useState<boolean | null>(null);

  const example = level.perhatikan;
  const result = example.place ? roundTo(example.number, example.place) : null;
  const tokens = example.place ? digitTokens(example.number, example.place) : [];
  const est = example.est ? estimate(example.est.a, example.est.b, example.est.op, example.est.place) : null;

  const goto = (n: number) => {
    sfx("click");
    setStep(Math.max(0, Math.min(STEPS.length - 1, n)));
    setPicked(null);
    setCobaOk(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button onClick={onBack} className="btn btn-ghost px-4 py-2.5 text-[13px]">
            <ArrowLeft size={16} /> Kembali ke Materi
          </button>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => speak(level.narration)} className="btn btn-ghost px-4 py-2.5 text-[13px]">
              <Volume2 size={16} /> Dengarkan
            </button>
            <button onClick={() => speak(level.narration)} className="btn btn-ghost px-4 py-2.5 text-[13px]">
              <RotateCcw size={16} /> Ulangi
            </button>
            <button
              onClick={() => {
                sfx("click");
                setPage("beranda");
              }}
              className="btn btn-ghost px-4 py-2.5 text-[13px]"
            >
              <Home size={16} /> Beranda
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand font-display text-[24px] font-extrabold text-white shadow-pop">
            {level.no}
          </div>
          <div className="min-w-0">
            <div className="step-label">Level {level.no}</div>
            <h2 className="font-display text-[24px] leading-tight font-extrabold text-ink">{level.title}</h2>
            <div className="text-[13px] font-semibold text-ink-soft">{level.subtitle}</div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => goto(i)}
              className={`flex items-center gap-2 rounded-full px-3.5 py-2 font-display text-[12px] font-extrabold transition ${
                i === step
                  ? "bg-brand text-white shadow-pop"
                  : i < step
                    ? "bg-[#dcfce7] text-[#136c3a]"
                    : "bg-[#eef5fd] text-ink-soft"
              }`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${
                  i === step ? "bg-white/25" : i < step ? "bg-grass text-white" : "bg-white"
                }`}
              >
                {i < step ? <Check size={11} strokeWidth={4} /> : i + 1}
              </span>
              <span className="uppercase">{s}</span>
            </button>
          ))}
        </div>
        <div className="mt-3">
          <ProgressBar value={step + 1} max={STEPS.length} label={`Langkah ${step + 1} dari ${STEPS.length}`} />
        </div>
      </div>

      {/* ---------- LANGKAH 1 ---------- */}
      {step === 0 && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-6">
            <div className="step-label mb-2">Langkah 1 — Kenali</div>
            <p className="text-[19px] leading-relaxed font-bold text-ink">{level.kenali.lead}</p>
            <ul className="mt-4 space-y-2.5">
              {level.kenali.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand" />
                  <span className="text-[15px] font-semibold text-ink-soft">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <button onClick={() => speak(level.narration)} className="btn btn-blue px-5 py-3 text-[14px]">
                <Volume2 size={17} /> Dengarkan Penjelasan
              </button>
            </div>
          </div>
          <CharacterBubble who={level.kind === "penaksiran" ? "hanif" : "arsya"}>
            {level.narration}
          </CharacterBubble>
        </div>
      )}

      {/* ---------- LANGKAH 2 ---------- */}
      {step === 1 && (
        <div className="card p-6">
          <div className="step-label mb-2">Langkah 2 — Perhatikan</div>
          <p className="mb-5 text-[17px] leading-relaxed font-semibold text-ink">{example.caption}</p>

          {est ? (
            <div className="space-y-3">
              <Flow label="Bilangan awal">
                {est.a} {est.op} {est.b}
              </Flow>
              <Flow label="Setelah dibulatkan" tone="sun">
                {est.ra} {est.op} {est.rb}
              </Flow>
              <Flow label="Hasil taksiran" tone="green">
                ≈ {est.value}
              </Flow>
              <div className="rounded-2xl bg-[#f7fbff] p-4 text-[14px] font-semibold text-ink-soft">
                Hasil sebenarnya {est.exact}. Hasil taksiran {est.value} mendekati hasil sebenarnya.
              </div>
            </div>
          ) : (
            result && (
              <div className="space-y-5">
                <DigitNumber tokens={tokens} size="lg" />
                <div className="flex items-center justify-center gap-3">
                  <div className="rounded-2xl bg-[#fff6db] px-5 py-3 font-display text-[15px] font-extrabold text-[#8a5a00]">
                    angka penentu: {result.detDigit}
                  </div>
                  <div className="font-display text-[30px] font-extrabold text-brand">→</div>
                  <div className="rounded-2xl bg-[#e8fbef] px-6 py-3 font-display text-[30px] font-extrabold text-[#136c3a]">
                    {result.input} ≈ {result.result}
                  </div>
                </div>
                <NumberLine result={result} />
              </div>
            )
          )}
        </div>
      )}

      {/* ---------- LANGKAH 3 ---------- */}
      {step === 2 && (
        <div className="card p-6">
          <div className="step-label mb-2">Langkah 3 — Coba</div>
          <p className="text-[18px] leading-relaxed font-bold text-ink">{level.coba.text}</p>

          {level.coba.mode === "det" ? (
            <div className="mt-6">
              <DigitNumber
                tokens={tokens}
                size="lg"
                onDigitClick={(idx) => {
                  const correct = idx === detIndex(example.number, example.place!);
                  setPicked(idx);
                  setCobaOk(correct);
                  sfx(correct ? "correct" : "wrong");
                }}
              />
              <div className="mt-5 text-center">
                {cobaOk === true && (
                  <div className="pop-in inline-flex items-center gap-2 rounded-2xl bg-[#e8fbef] px-5 py-3 font-display text-[17px] font-extrabold text-[#136c3a]">
                    🎉 Benar! Angka penentunya {digitAt(example.number, detIndex(example.number, example.place!))}
                  </div>
                )}
                {cobaOk === false && (
                  <div className="pop-in inline-flex items-center gap-2 rounded-2xl bg-[#fff1f1] px-5 py-3 font-display text-[17px] font-extrabold text-[#b23b3b]">
                    💡 Belum tepat. Ingat: satu angka di sebelah kanan tempat pembulatan!
                  </div>
                )}
                {cobaOk === null && (
                  <div className="text-[14px] font-semibold text-ink-soft">Klik salah satu angka di atas.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {level.coba.options?.map((o) => {
                const ok = o === level.coba.answer;
                return (
                  <button
                    key={o}
                    onClick={() => {
                      setPicked(1);
                      setCobaOk(ok);
                      sfx(ok ? "correct" : "wrong");
                    }}
                    className={`rounded-2xl border-2 px-5 py-4 text-left font-display text-[18px] font-extrabold transition ${
                      picked !== null && ok
                        ? "border-grass bg-[#e8fbef] text-[#136c3a]"
                        : picked !== null
                          ? "border-line bg-white text-ink-soft"
                          : "border-line bg-white text-ink hover:-translate-y-0.5 hover:border-brand-light"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
              {cobaOk === true && (
                <div className="pop-in col-span-full rounded-2xl bg-[#e8fbef] px-5 py-3 font-display text-[17px] font-extrabold text-[#136c3a]">
                  🎉 Hebat! Jawabanmu benar!
                </div>
              )}
              {cobaOk === false && (
                <div className="pop-in col-span-full rounded-2xl bg-[#fff1f1] px-5 py-3 font-display text-[17px] font-extrabold text-[#b23b3b]">
                  💡 Coba lagi. Baca keterangan di langkah sebelumnya.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------- LANGKAH 4 ---------- */}
      {step === 3 && (
        <div className="card p-6">
          <div className="step-label mb-4">Langkah 4 — Periksa</div>
          {est ? (
            <div className="space-y-3">
              <Flow label="Bilangan awal">
                {est.a} {est.op} {est.b}
              </Flow>
              <Flow label="Dibulatkan">
                {est.ra} {est.op} {est.rb}
              </Flow>
              <Flow label="Perhitungan">
                {est.ra} {est.op} {est.rb} = {est.value}
              </Flow>
              <Flow label="Hasil taksiran" tone="green">
                ≈ {est.value}
              </Flow>
            </div>
          ) : (
            result && <RoundingProcess result={result} />
          )}
        </div>
      )}

      {/* ---------- LANGKAH 5 ---------- */}
      {step === 4 && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-6">
            <div className="step-label mb-2">Langkah 5 — Pahami</div>
            <ul className="space-y-3">
              {level.pahami.map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-2xl bg-[#f7fbff] p-3.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-grass text-white">
                    <Check size={15} strokeWidth={4} />
                  </span>
                  <span className="text-[16px] font-bold text-ink">{t}</span>
                </li>
              ))}
            </ul>
            {result && (
              <div className="mt-4 rounded-2xl border-2 border-[#c4a9ff] bg-grape-soft p-4">
                <div className="font-display text-[14px] font-extrabold text-[#6d3fd6]">Ingat!</div>
                <div className="text-[14px] font-semibold text-[#6d3fd6]">
                  Angka penentu selalu tepat satu tempat di sebelah kanan tempat pembulatan.
                  {result.detExists && ` Pada ${result.input}, angka penentunya ${result.detDigit}.`}
                </div>
              </div>
            )}
          </div>
          <CharacterBubble who="arsya">
            {result
              ? `Mudah, kan? Pada ${result.input}, tempat pembulatannya ${result.placeLabel.toLowerCase()}, angka penentunya ${result.detDigit}. Karena ${result.rule.toLowerCase()}, hasilnya ${result.result}.`
              : `Hebat! Kamu sudah paham. Sekarang coba kerjakan tantangan di langkah berikutnya, ya!`}
          </CharacterBubble>
        </div>
      )}

      {/* ---------- LANGKAH 6 ---------- */}
      {step === 5 && (
        <div>
          <div className="step-label mb-2">Langkah 6 — Tantang Diri</div>
          <QuestionCard
            q={level.tantangan}
            cta="Selesaikan Level"
            hanifLine={`${level.title}: kamu pasti bisa! Kerjakan dengan tenang, ya.`}
            arsyaLine="Kalau sudah benar, tekan tombol Selesaikan Level untuk membuka level berikutnya."
            onAnswered={(ok) => {
              if (ok) onDone();
              else toast("Ayo coba lagi, kamu pasti bisa!", "bad");
            }}
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <Btn variant="ghost" className="px-6 py-3.5 text-[15px]" disabled={step === 0} onClick={() => goto(step - 1)}>
          <ArrowLeft size={18} /> Kembali
        </Btn>
        <div className="flex items-center gap-2 text-[13px] font-bold text-ink-soft">
          <Star size={16} className="fill-sun text-sun" /> {p.stars} bintang terkumpul
        </div>
        <Btn className="px-6 py-3.5 text-[15px]" disabled={step === STEPS.length - 1} onClick={() => goto(step + 1)}>
          Lanjut <ArrowRight size={18} />
        </Btn>
      </div>
    </div>
  );
}

function Flow({ label, children, tone = "blue" }: { label: string; children: ReactNode; tone?: "blue" | "sun" | "green" }) {
  const map = {
    blue: "border-brand/25 bg-brand-soft text-brand-dark",
    sun: "border-[#ffd772] bg-[#fff6db] text-[#8a5a00]",
    green: "border-[#a7e9c2] bg-[#e8fbef] text-[#136c3a]",
  };
  return (
    <div className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 ${map[tone]}`}>
      <div className="w-[126px] shrink-0 text-[11px] font-extrabold tracking-[0.12em] uppercase opacity-85">{label}</div>
      <div className="font-display text-[19px] font-extrabold text-ink">{children}</div>
    </div>
  );
}
