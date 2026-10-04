import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, CheckCircle2, XCircle, ChevronRight, Eye } from "lucide-react";
import type { Question } from "../lib/math";
import { checkAnswer } from "../lib/math";
import { useApp } from "../lib/store";
import { Btn, CharacterBubble, HintPanel } from "./ui";

export function QuestionCard({
  q,
  onAnswered,
  cta = "Lanjut",
  hanifLine,
  arsyaLine,
}: {
  q: Question;
  onAnswered: (correct: boolean) => void;
  cta?: string;
  hanifLine?: string;
  arsyaLine?: string;
}) {
  const { sfx, toast } = useApp();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");
  const [attempts, setAttempts] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  const submit = (ans: string) => {
    if (status === "correct") return;
    if (!ans.trim()) {
      toast("Pilih atau tulis jawabanmu dulu, ya.", "bad");
      return;
    }
    const ok = checkAnswer(ans, q.answer);
    if (ok) {
      sfx("correct");
      setStatus("correct");
      setShowSteps(true);
    } else {
      sfx("wrong");
      setStatus("wrong");
      const n = attempts + 1;
      setAttempts(n);
      if (n >= 3) setShowSteps(true);
    }
  };

  return (
    <div className="space-y-4">
      {hanifLine && (
        <CharacterBubble who="hanif">
          <span className="text-[15px]">{hanifLine}</span>
        </CharacterBubble>
      )}

      <div className="card p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="pill bg-brand-soft text-brand-dark">{q.type === "penaksiran" ? "Penaksiran" : "Pembulatan"}</span>
          {q.place && <span className="pill bg-grape-soft text-[#6d3fd6]">ke {q.place}</span>}
        </div>
        <p className="text-[18px] leading-relaxed font-bold text-ink">{q.prompt}</p>

        {q.options.length > 0 ? (
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {q.options.map((opt) => {
              const isCorrect = status === "correct" && checkAnswer(opt, q.answer);
              const isWrongPick = status === "wrong" && checkAnswer(opt, value);
              return (
                <button
                  key={opt}
                  onClick={() => {
                    setValue(opt);
                    setStatus("idle");
                    sfx("click");
                    submit(opt);
                  }}
                  disabled={status === "correct"}
                  className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left font-display text-[19px] font-extrabold transition ${
                    isCorrect
                      ? "border-grass bg-[#e8fbef] text-[#136c3a]"
                      : isWrongPick
                        ? "border-coral bg-[#ffecec] text-[#b23b3b]"
                        : "border-line bg-white text-ink hover:-translate-y-0.5 hover:border-brand-light hover:bg-brand-soft"
                  }`}
                >
                  {opt}
                  {isCorrect && <CheckCircle2 size={22} className="text-grass" />}
                  {isWrongPick && <XCircle size={22} className="text-coral" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 flex gap-2">
            <input
              className="input"
              placeholder="Tulis jawabanmu, contoh: 12,3"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setStatus("idle");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit(value);
              }}
            />
            <Btn className="px-6 py-4" onClick={() => submit(value)}>
              Periksa
            </Btn>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              sfx("click");
              setHintLevel((h) => Math.min(q.hints.length, h + 1));
            }}
            disabled={hintLevel >= q.hints.length}
            className="btn btn-ghost px-4 py-2.5 text-[13px]"
          >
            <Lightbulb size={16} /> 💡 Petunjuk {hintLevel > 0 ? `(${hintLevel}/${q.hints.length})` : ""}
          </button>
          <button
            onClick={() => {
              sfx("click");
              setShowSteps((s) => !s);
            }}
            className="btn btn-ghost px-4 py-2.5 text-[13px]"
          >
            <Eye size={16} /> {showSteps ? "Sembunyikan Proses" : "Lihat Proses"}
          </button>
        </div>

        {hintLevel > 0 && (
          <div className="mt-3">
            <HintPanel hints={q.hints} level={hintLevel} />
          </div>
        )}

        <AnimatePresence>
          {status === "wrong" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-start gap-3 rounded-2xl border-2 border-[#ffc9c9] bg-[#fff1f1] p-4"
            >
              <span className="text-[22px]">💡</span>
              <div>
                <div className="font-display text-[16px] font-extrabold text-[#b23b3b]">Coba lagi, ya!</div>
                <div className="text-[14px] font-semibold text-[#b23b3b]/85">
                  Perhatikan angka penentu pembulatan. Lihat satu angka tepat di sebelah kanan tempat pembulatan.
                </div>
              </div>
            </motion.div>
          )}
          {status === "correct" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 flex items-start gap-3 rounded-2xl border-2 border-[#a7e9c2] bg-[#e8fbef] p-4"
            >
              <span className="text-[22px]">🎉</span>
              <div>
                <div className="font-display text-[16px] font-extrabold text-[#136c3a]">Hebat! Jawabanmu benar!</div>
                <div className="text-[14px] font-semibold text-[#136c3a]/85">{q.explain}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showSteps && (
          <div className="mt-4 rounded-2xl border-2 border-line bg-[#f7fbff] p-4">
            <div className="step-label mb-2">Proses Berpikir</div>
            <ol className="space-y-1.5">
              {q.steps.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-[15px] font-semibold text-ink">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft font-display text-[12px] font-extrabold text-brand-dark">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {arsyaLine && (
        <CharacterBubble who="arsya">
          <span className="text-[15px]">{arsyaLine}</span>
        </CharacterBubble>
      )}

      <div className="flex justify-end">
        <Btn
          variant={status === "correct" ? "green" : "ghost"}
          disabled={status !== "correct"}
          onClick={() => onAnswered(status === "correct")}
          className="px-7 py-3.5 text-[15px]"
        >
          {cta} <ChevronRight size={18} />
        </Btn>
      </div>
    </div>
  );
}
