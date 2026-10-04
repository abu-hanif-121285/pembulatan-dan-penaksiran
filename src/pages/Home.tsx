import { useState } from "react";
import { motion } from "framer-motion";
import { Play, BookOpen, FlaskConical, Pencil, Gamepad2, Trophy, ChevronRight, Check } from "lucide-react";
import { useApp } from "../lib/store";
import { LEVELS } from "../lib/levels";
import { roundTo, digitTokens, toNumber, PLACES } from "../lib/math";
import { Btn, CharacterBubble, DigitNumber, NumberLine, ProgressBar, Chip, SectionTitle } from "../components/ui";
import type { PageKey } from "../components/Layout";

const FLOAT_NUMBERS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const CONCEPTS = [
  "Tentukan tempat pembulatan",
  "Lihat angka berikutnya (angka penentu)",
  "Jika 5–9, bulatkan ke atas",
  "Jika 0–4, angka tetap",
];

export default function Home({ setPage }: { setPage: (p: PageKey) => void }) {
  const { p, sfx } = useApp();
  const [imgOk, setImgOk] = useState(true);

  const demo = roundTo("7,386", "persepuluhan")!;
  const tokens = digitTokens("7,386", "persepuluhan");
  const done = p.completedLessons.length;
  const progress = Math.round((done / LEVELS.length) * 100);

  const go = (key: PageKey) => {
    sfx("click");
    setPage(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-7">
      {/* ============ PANGGUNG UTAMA ============ */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/80 shadow-pop">
        <div className="absolute inset-0">
          {imgOk ? (
            <img
              src="images/hero-characters.png"
              alt="Hanif dan Arsya belajar membulatkan bilangan"
              onError={() => setImgOk(false)}
              className="h-full w-full object-cover object-[22%_center]"
            />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(160deg,#8ecdf7_0%,#cdeafd_45%,#eaf6ff_100%)]" />
          )}
          <div className="absolute inset-0 bg-white/82 lg:bg-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/45 to-white/94" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/85 to-transparent" />
        </div>

        <div className="relative grid gap-6 p-6 sm:p-9 lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
          <div className="hidden lg:block" />
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Chip tone="sun">🎮 Game Edukasi Matematika SD</Chip>
              <h2 className="mt-3 font-display text-[42px] leading-[0.95] font-extrabold sm:text-[58px]">
                <span className="bg-gradient-to-r from-[#1d4ed8] to-[#0ea5e9] bg-clip-text text-transparent">
                  PETUALANGAN
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#f59e0b] to-[#ffc02e] bg-clip-text text-transparent">ANGKA</span>
              </h2>
              <div className="mt-2 inline-flex rounded-full bg-brand px-4 py-1.5 font-display text-[15px] font-bold text-white shadow-pop">
                Pembulatan &amp; Penaksiran
              </div>
              <p className="mt-4 max-w-[460px] font-display text-[19px] leading-snug font-bold text-ink sm:text-[22px]">
                “{p.teacherSettings.tagline}”
              </p>
            </motion.div>

            <div className="mt-5 card-soft max-w-[460px] p-4">
              <ProgressBar value={progress} label={`Progress Belajar${done > 0 ? ` • ${done} dari ${LEVELS.length} level` : ""}`} />
              <div className="mt-3 flex flex-wrap gap-2">
                <Btn
                  className="px-7 py-4 text-[17px]"
                  onClick={() => go("materi")}
                >
                  <Play size={20} /> {done > 0 ? "LANJUTKAN BELAJAR" : "MULAI BELAJAR"}
                </Btn>
                <Btn variant="ghost" className="px-5 py-4 text-[14px]" onClick={() => go("kuis")}>
                  <Trophy size={17} /> Kuis
                </Btn>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(
                [
                  ["materi", "Materi", BookOpen],
                  ["simulasi", "Simulasi", FlaskConical],
                  ["latihan", "Latihan", Pencil],
                  ["minigame", "Mini Game", Gamepad2],
                  ["kuis", "Kuis", Trophy],
                ] as [PageKey, string, typeof BookOpen][]
              ).map(([key, label, Icon]) => (
                <button
                  key={key}
                  onClick={() => go(key)}
                  className="btn btn-ghost px-4 py-2.5 text-[13px]"
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ ANGKA MELAYANG ============ */}
      <section className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/60 px-4 py-6 shadow-pop">
        <div className="mb-3 text-center">
          <div className="step-label">Angka Petualangan</div>
          <div className="font-display text-[18px] font-extrabold text-ink">
            Kenali bilangan puluhan dari 10 sampai 100
          </div>
        </div>
        <div className="flex flex-wrap items-end justify-center gap-2 sm:gap-3">
          {FLOAT_NUMBERS.map((n, i) => (
            <motion.div
              key={n}
              className="floaty"
              style={{ animationDelay: `${i * 0.35}s` }}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
            >
              <div
                className="grid h-14 w-14 place-items-center rounded-2xl font-display text-[21px] font-extrabold shadow-pop sm:h-16 sm:w-16 sm:text-[25px]"
                style={{
                  background: ["#fff3d1", "#eaf2ff", "#f1eaff", "#e8fbef"][i % 4],
                  color: ["#8a5a00", "#1d4ed8", "#6d3fd6", "#136c3a"][i % 4],
                  boxShadow: "0 12px 22px -12px rgba(18,58,107,0.5)",
                }}
              >
                {n}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ CONTOH HIDUP ============ */}
      <section className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <div className="card p-6 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-pop">
              <FlaskConical size={24} />
            </div>
            <div>
              <div className="step-label">Contoh Langsung</div>
              <h3 className="font-display text-[24px] leading-tight font-extrabold text-ink">Pembulatan Desimal</h3>
            </div>
          </div>

          <p className="text-[16px] font-semibold text-ink-soft">
            Bulatkan <b className="text-ink">7,386</b> ke satu angka di belakang koma (persepuluhan).
          </p>

          <div className="mt-5 flex flex-col items-center gap-4 rounded-[22px] bg-[#f7fbff] p-5 sm:flex-row sm:justify-center">
            <DigitNumber tokens={tokens} size="lg" />
            <div className="flex items-center gap-3">
              <ChevronRight size={30} className="text-brand" strokeWidth={3} />
              <div className="rounded-2xl bg-white px-6 py-3 font-display text-[38px] font-extrabold text-ink shadow-pop">
                {demo.result}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-[#c4a9ff] bg-grape-soft p-3">
              <div className="font-display text-[13px] font-extrabold text-[#6d3fd6]">Angka penentu</div>
              <div className="text-[12px] font-bold text-[#6d3fd6]/80">
                8 — satu angka di sebelah kanan tempat pembulatan
              </div>
            </div>
            <div className="rounded-2xl border-2 border-[#ffd772] bg-[#fff6db] p-3">
              <div className="font-display text-[13px] font-extrabold text-[#8a5a00]">Angka pembulatan</div>
              <div className="text-[12px] font-bold text-[#8a5a00]/80">3 — tempat persepuluhan yang dipertahankan</div>
            </div>
          </div>

          <div className="mt-4">
            <NumberLine result={demo} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-6">
            <div className="step-label mb-2">Konsep Penting</div>
            <ul className="space-y-2.5">
              {CONCEPTS.map((c) => (
                <li key={c} className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-grass text-white">
                    <Check size={14} strokeWidth={4} />
                  </span>
                  <span className="text-[14.5px] font-bold text-ink">{c}</span>
                </li>
              ))}
            </ul>
            <Btn className="mt-5 w-full px-6 py-4 text-[16px]" onClick={() => go("materi")}>
              <Play size={19} /> Mulai Belajar
            </Btn>
          </div>

          <div className="card overflow-hidden">
            <div className="relative h-[132px] bg-[linear-gradient(150deg,#8ecdf7,#d7f0ff)]">
              <div className="absolute -right-3 -bottom-6 font-display text-[86px] font-extrabold text-white/70 floaty">?</div>
              <div className="absolute top-4 left-4 rounded-full bg-white/85 px-3 py-1 font-display text-[12px] font-extrabold text-brand-dark">
                💡 Tahukah kamu?
              </div>
            </div>
            <div className="p-5">
              <p className="text-[15px] font-semibold leading-relaxed text-ink">
                Angka <b>5</b> selalu dibulatkan ke <b>atas</b>. Jadi <b>7,5 ≈ 8</b> dan <b>2,35 ≈ 2,4</b>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ KARAKTER ============ */}
      <section className="grid gap-5 lg:grid-cols-2">
        <CharacterBubble who="hanif">
          Halo, aku <b>Hanif</b>! Ayo kita belajar membulatkan bilangan. Gampang kok, kita lihat satu angka di sebelah
          kanan tempat pembulatan.
        </CharacterBubble>
        <CharacterBubble who="arsya">
          Aku <b>Arsya</b>. Jangan takut salah, ya. Kesalahan membantu kita belajar. Kalau bingung, tekan tombol
          <b> 💡 Petunjuk</b>.
        </CharacterBubble>
      </section>

      {/* ============ FITUR ============ */}
      <section>
        <SectionTitle kicker="Jelajahi Fitur Seru" title="Mau main sambil belajar?" />
        <div className="scroll-x -mx-3 flex gap-4 px-3 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
          {[
            {
              key: "simulasi" as PageKey,
              img: "images/feat-lab.png",
              title: "LAB PEMBULATAN",
              desc: "Eksperimen dengan bilangan bulat & desimal.",
              tone: "#2563eb",
            },
            {
              key: "minigame" as PageKey,
              img: "images/feat-tangkap.png",
              title: "TANGKAP ANGKA",
              desc: "Tepat, cepat, raih skor tertinggi!",
              tone: "#f59e0b",
            },
            {
              key: "minigame" as PageKey,
              img: "images/feat-roket.png",
              title: "ROKET PEMBULATAN",
              desc: "Meluncur ke angka yang tepat!",
              tone: "#8b5cf6",
            },
          ].map((f) => (
            <button
              key={f.title}
              onClick={() => go(f.key)}
              className="card group min-w-[248px] overflow-hidden text-left transition hover:-translate-y-1.5 sm:min-w-0"
            >
              <div className="relative h-[132px] overflow-hidden bg-[linear-gradient(150deg,#8ecdf7,#2563eb)]">
                <img
                  src={f.img}
                  alt={f.title}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
              </div>
              <div className="p-4">
                <div className="font-display text-[16px] font-extrabold" style={{ color: f.tone }}>
                  {f.title}
                </div>
                <div className="mt-1 text-[12.5px] font-semibold text-ink-soft">{f.desc}</div>
                <div
                  className="mt-3 grid h-8 w-8 place-items-center rounded-full text-white"
                  style={{ background: f.tone }}
                >
                  <ChevronRight size={18} strokeWidth={3} />
                </div>
              </div>
            </button>
          ))}

          <div className="card min-w-[248px] p-5 sm:min-w-0">
            <div className="step-label mb-2">Progress Belajar</div>
            <div className="mb-3 flex items-end gap-2">
              <div className="font-display text-[42px] leading-none font-extrabold text-ink">{progress}%</div>
              <div className="pb-1 text-[12px] font-bold text-ink-soft">dari keseluruhan materi</div>
            </div>
            <ProgressBar value={progress} />
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-[13px] font-bold text-ink-soft">
                <span>⭐ Bintang</span>
                <span className="text-ink">{p.stars}</span>
              </div>
              <div className="flex items-center justify-between text-[13px] font-bold text-ink-soft">
                <span>🏆 Poin</span>
                <span className="text-ink">{p.points}</span>
              </div>
              <div className="flex items-center justify-between text-[13px] font-bold text-ink-soft">
                <span>🔥 Streak terbaik</span>
                <span className="text-ink">{p.bestStreak}</span>
              </div>
            </div>
            <Btn variant="blue" className="mt-4 w-full px-5 py-3 text-[14px]" onClick={() => go("hasil")}>
              Lihat Hasil Belajar
            </Btn>
          </div>
        </div>
      </section>

      {/* ============ ANGKA PENENTU SLOGAN ============ */}
      <section className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(120deg,#1d4ed8,#3b82f6_55%,#38bdf8)] p-8 text-white shadow-pop sm:p-11">
        <div className="absolute -top-10 -right-6 font-display text-[190px] leading-none font-extrabold text-white/10">
          5
        </div>
        <div className="relative max-w-3xl">
          <div className="text-[12px] font-extrabold tracking-[0.22em] text-white/80 uppercase">
            Ingat baik-baik
          </div>
          <h3 className="mt-2 font-display text-[32px] leading-tight font-extrabold sm:text-[46px]">
            “Satu angka di kanan menentukan!”
          </h3>
          <p className="mt-3 max-w-2xl text-[16px] font-semibold text-white/90">
            Angka penentu pembulatan selalu berada tepat satu tempat di sebelah kanan tempat pembulatan. Jika angka
            itu <b>0–4</b>, angka tetap. Jika <b>5–9</b>, angka pada tempat pembulatan bertambah satu.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["12,3 → 12", "3,24 → 3,2", "6,238 → 6,24", "1.678 → 2.000", "19,96 → 20,0"].map((e) => (
              <span
                key={e}
                className="rounded-full bg-white/16 px-4 py-2 font-display text-[15px] font-bold text-white ring-1 ring-white/25"
              >
                {e}
              </span>
            ))}
          </div>
          <div className="mt-6">
            <Btn className="px-7 py-4 text-[16px]" onClick={() => go("simulasi")}>
              <FlaskConical size={19} /> Coba Lab Pembulatan
            </Btn>
          </div>
        </div>
      </section>

      <div className="rounded-[22px] border border-line bg-white/70 px-5 py-4 text-center text-[13px] font-semibold text-ink-soft">
        Angka penentu pada <b className="text-ink">{demo.input}</b> saat dibulatkan ke{" "}
        <b className="text-ink">{PLACES[demo.place].label.toLowerCase()}</b> adalah{" "}
        <b className="text-grape">{demo.detDigit}</b>, sehingga hasilnya{" "}
        <b className="text-ink">{demo.result}</b> — nilai sebenarnya {toNumber(demo.input).toString().replace(".", ",")}.
      </div>
    </div>
  );
}
