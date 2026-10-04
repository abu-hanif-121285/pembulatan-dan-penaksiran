import { motion } from "framer-motion";
import { Trophy, Star, Flame, BookOpen, Target, RotateCcw, ChevronRight, BarChart3 } from "lucide-react";
import { LEVELS } from "../lib/levels";
import { useApp } from "../lib/store";
import type { ReactNode } from "react";
import { Btn, Chip, ProgressBar, SectionTitle, CharacterBubble } from "../components/ui";
import type { PageKey } from "../components/Layout";

export default function Hasil({ setPage }: { setPage: (p: PageKey) => void }) {
  const { p, sfx } = useApp();
  const last = p.lastScore ?? 0;
  const category =
    last >= 90
      ? { label: "🏆 Sangat Baik", color: "#22c55e", note: "Kamu luar biasa! Terus pertahankan semangat belajarmu." }
      : last >= 80
        ? { label: "🌟 Baik", color: "#2563eb", note: "Bagus sekali! Sedikit lagi menjadi sempurna." }
        : last >= 70
          ? { label: "👍 Cukup", color: "#f59e0b", note: "Cukup baik. Perbanyak latihan untuk hasil lebih baik." }
          : { label: "💪 Ayo Berlatih Lagi", color: "#ff6b6b", note: "Jangan menyerah. Pelajari materinya lalu coba lagi." };

  const progress = Math.round((p.completedLessons.length / LEVELS.length) * 100);
  const doneLessons = LEVELS.filter((l) => p.completedLessons.includes(l.id));
  const notDone = LEVELS.filter((l) => !p.completedLessons.includes(l.id));

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="📊 Hasil Belajar"
        title="Rapor Petualanganmu"
        sub="Semua hasil latihan, kuis, dan permainan tersimpan otomatis di perangkat ini."
      />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="card overflow-hidden">
          <div className="bg-[linear-gradient(120deg,#1d4ed8,#3b82f6)] px-8 py-9 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="step-label text-white/80">Skor Kuis Terakhir</div>
                <div className="mt-1 font-display text-[54px] leading-none font-extrabold">
                  {p.quizScores.length ? `${last} / 100` : "Belum ada"}
                </div>
                <div className="mt-2 text-[15px] font-semibold text-white/90">
                  {p.quizScores.length ? category.note : "Ikuti kuis untuk mendapatkan skor pertamamu."}
                </div>
              </div>
              <div className="rounded-[22px] bg-white/16 px-6 py-4 text-center ring-1 ring-white/25">
                <div className="font-display text-[22px] font-extrabold">{p.quizScores.length ? category.label : "—"}</div>
                <div className="mt-1 text-[12px] font-bold text-white/80">Kategori hasil</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-white/85">
                <span>Progress ketepatan</span>
                <span>{last}%</span>
              </div>
              <div className="h-5 w-full overflow-hidden rounded-full bg-white/22">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${last}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-[linear-gradient(90deg,#8ef0b2,#22c55e)]"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-4">
            <Stat icon={<Trophy size={20} />} color="#2563eb" value={p.points} label="Total Poin" />
            <Stat icon={<Star size={20} />} color="#ffc02e" value={p.stars} label="Bintang" />
            <Stat icon={<Flame size={20} />} color="#ff6b6b" value={p.bestStreak} label="Streak Terbaik" />
            <Stat icon={<Target size={20} />} color="#22c55e" value={p.completedLessons.length} label="Level Selesai" />
          </div>

          <div className="px-6 pb-6">
            <ProgressBar value={progress} label={`Progress materi • ${p.completedLessons.length}/${LEVELS.length} level`} />
            <div className="mt-5 flex flex-wrap gap-2">
              <Btn className="px-6 py-3.5 text-[15px]" onClick={() => { sfx("click"); setPage("kuis"); }}>
                <RotateCcw size={18} /> Ikuti Kuis Lagi
              </Btn>
              <Btn variant="blue" className="px-6 py-3.5 text-[15px]" onClick={() => { sfx("click"); setPage("materi"); }}>
                <BookOpen size={18} /> Pelajari Materi
              </Btn>
              <Btn variant="ghost" className="px-6 py-3.5 text-[15px]" onClick={() => { sfx("click"); setPage("latihan"); }}>
                Latihan <ChevronRight size={18} />
              </Btn>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-soft text-brand">
                <BarChart3 size={20} />
              </div>
              <div className="font-display text-[18px] font-extrabold text-ink">Riwayat Kuis</div>
            </div>
            {p.quizScores.length === 0 ? (
              <div className="rounded-2xl bg-[#f7fbff] p-5 text-center">
                <div className="text-[38px]">🗒️</div>
                <div className="mt-2 text-[14px] font-semibold text-ink-soft">
                  Belum ada riwayat kuis. Mulai kuis pertamamu sekarang!
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {p.quizScores.map((r, i) => (
                  <div key={i} className="flex items-center justify-between rounded-2xl bg-[#f7fbff] px-4 py-3">
                    <div>
                      <div className="font-display text-[14px] font-extrabold text-ink">{r.kind}</div>
                      <div className="text-[11.5px] font-semibold text-ink-soft">
                        {r.date} • {r.correct}/{r.total} benar
                      </div>
                    </div>
                    <div className="font-display text-[20px] font-extrabold text-brand">{r.score}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="mb-3 font-display text-[18px] font-extrabold text-ink">Skor Latihan Terbaik</div>
            <div className="space-y-2">
              {(["mudah", "sedang", "menantang"] as const).map((d) => (
                <div key={d} className="flex items-center justify-between rounded-2xl bg-[#f7fbff] px-4 py-3">
                  <span className="text-[14px] font-bold capitalize text-ink-soft">{d}</span>
                  <span className="font-display text-[18px] font-extrabold text-ink">{p.exerciseScores[d] ?? 0}</span>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-2xl bg-[#f7fbff] px-4 py-3">
                <span className="text-[14px] font-bold text-ink-soft">Mini Game</span>
                <span className="font-display text-[18px] font-extrabold text-ink">
                  {p.games.tangkap} / {p.games.roket}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-display text-[18px] font-extrabold text-ink">Materi yang Sudah Dikuasai</div>
            <Chip tone="green">{doneLessons.length} selesai</Chip>
          </div>
          {doneLessons.length === 0 ? (
            <div className="rounded-2xl bg-[#f7fbff] p-5 text-center text-[14px] font-semibold text-ink-soft">
              Belum ada materi yang selesai. Mulai dari Level 1, ya! 💪
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {doneLessons.map((l) => (
                <span key={l.id} className="pill bg-[#dcfce7] text-[#136c3a]">
                  ⭐ {l.no}. {l.title}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-display text-[18px] font-extrabold text-ink">Rekomendasi Belajar</div>
            <Chip tone="sun">💡</Chip>
          </div>
          <div className="space-y-2">
            {notDone.slice(0, 4).map((l) => (
              <button
                key={l.id}
                onClick={() => { sfx("click"); setPage("materi"); }}
                className="flex w-full items-center justify-between rounded-2xl bg-[#f7fbff] px-4 py-3 text-left transition hover:bg-brand-soft"
              >
                <span>
                  <span className="block font-display text-[14.5px] font-extrabold text-ink">
                    {l.no}. {l.title}
                  </span>
                  <span className="block text-[11.5px] font-semibold text-ink-soft">{l.subtitle}</span>
                </span>
                <ChevronRight size={18} className="text-brand" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <CharacterBubble who="arsya">
        {p.quizScores.length
          ? "Terima kasih sudah belajar bersama kami. Terus berlatih sedikit setiap hari, ya. Kamu hebat!"
          : "Ayo mulai kuis pertamamu! Setelah itu, hasil belajarmu akan muncul di halaman ini."}
      </CharacterBubble>
    </div>
  );
}

function Stat({ icon, color, value, label }: { icon: ReactNode; color: string; value: number | string; label: string }) {
  return (
    <div className="card-soft p-4 text-center">
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl text-white" style={{ background: color }}>
        {icon}
      </div>
      <div className="mt-2 font-display text-[26px] leading-none font-extrabold text-ink">{value}</div>
      <div className="mt-1 text-[11.5px] font-bold text-ink-soft">{label}</div>
    </div>
  );
}
