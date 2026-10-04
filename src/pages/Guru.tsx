import { useRef, useState } from "react";
import {
  Lock,
  Upload,
  Trash2,
  Eye,
  BookOpen,
  Pencil,
  Trophy,
  BarChart3,
  Image as ImageIcon,
  Palette,
  Volume2,
  Settings as SettingsIcon,
  Check,
  X,
} from "lucide-react";
import { LEVELS } from "../lib/levels";
import { useApp, ttsSupported, defaultProgress } from "../lib/store";
import type { LogoSettings } from "../lib/store";
import { Btn, Chip, SectionTitle, WahLogo } from "../components/ui";
import type { PageKey } from "../components/Layout";

const PASSWORD = "Inovatif";
const MAX_SIZE = 2 * 1024 * 1024;
const OK_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];

type Tab =
  | "materi"
  | "latihan"
  | "kuis"
  | "hasil"
  | "logo"
  | "tampilan"
  | "suara"
  | "aplikasi";

const TABS: { key: Tab; label: string; icon: typeof BookOpen }[] = [
  { key: "materi", label: "Kelola Materi", icon: BookOpen },
  { key: "latihan", label: "Kelola Latihan", icon: Pencil },
  { key: "kuis", label: "Kelola Kuis", icon: Trophy },
  { key: "hasil", label: "Lihat Hasil Belajar", icon: BarChart3 },
  { key: "logo", label: "Logo WAH", icon: ImageIcon },
  { key: "tampilan", label: "Pengaturan Tampilan", icon: Palette },
  { key: "suara", label: "Pengaturan Suara", icon: Volume2 },
  { key: "aplikasi", label: "Pengaturan Aplikasi", icon: SettingsIcon },
];

export default function Guru({ setPage }: { setPage: (p: PageKey) => void }) {
  const [ok, setOk] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<Tab>("materi");
  const { p, update, reset, sfx, toast } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  /* ---------- GERBANG PASSWORD ---------- */
  if (!ok) {
    return (
      <div className="mx-auto max-w-lg">
        <SectionTitle
          kicker="⚙️ Mode Guru"
          title="Masuk Mode Guru"
          sub="Halaman ini hanya untuk guru. Masukkan password untuk melanjutkan."
        />
        <div className="card p-7">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-brand">
            <Lock size={28} />
          </div>
          <label className="mt-5 mb-1.5 block text-[13px] font-extrabold text-ink-soft">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Masukkan password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setErr("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (pw === PASSWORD) {
                  setOk(true);
                  sfx("level");
                  toast("Selamat datang di Mode Guru!", "good");
                } else {
                  setErr("Password salah. Silakan coba lagi.");
                  sfx("wrong");
                }
              }
            }}
          />
          {err && <div className="mt-2 rounded-xl bg-[#fff1f1] px-4 py-2.5 text-[13px] font-bold text-[#b23b3b]">{err}</div>}
          <Btn
            className="mt-5 w-full px-6 py-4 text-[16px]"
            onClick={() => {
              if (pw === PASSWORD) {
                setOk(true);
                sfx("level");
                toast("Selamat datang di Mode Guru!", "good");
              } else {
                setErr("Password salah. Silakan coba lagi.");
                sfx("wrong");
              }
            }}
          >
            <Lock size={18} /> MASUK
          </Btn>
          <button onClick={() => setPage("beranda")} className="btn btn-ghost mt-3 w-full px-6 py-3.5 text-[14px]">
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  /* ---------- UPLOAD LOGO ---------- */
  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!OK_TYPES.includes(file.type)) {
      toast("Format file belum didukung. Gunakan PNG, JPG, JPEG, WEBP, atau SVG.", "bad");
      sfx("wrong");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast("Ukuran logo terlalu besar. Maksimal 2 MB.", "bad");
      sfx("wrong");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      update((prev) => ({ ...prev, logoWAH: { ...prev.logoWAH, data: String(reader.result) } }));
      toast("Logo WAH berhasil diperbarui.", "good");
      sfx("star");
    };
    reader.onerror = () => toast("Logo gagal dibaca. Coba file lain.", "bad");
    reader.readAsDataURL(file);
  };

  const setLogo = (patch: Partial<LogoSettings>) =>
    update((prev) => ({ ...prev, logoWAH: { ...prev.logoWAH, ...patch } }));

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="⚙️ Dashboard Guru"
        title="Panel Pengelolaan"
        sub="Kelola materi, latihan, kuis, identitas aplikasi, suara, dan tampilan."
      />

      <div className="scroll-x -mx-3 flex gap-2 px-3 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                sfx("click");
                setTab(t.key);
              }}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 font-display text-[13px] font-bold transition ${
                active ? "bg-brand text-white shadow-pop" : "border-2 border-line bg-white text-ink hover:border-brand-light"
              }`}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ---------- LOGO ---------- */}
      {tab === "logo" && (
        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <div className="card p-7">
            <div className="step-label">🖼️ Identitas Aplikasi</div>
            <h3 className="mt-1 font-display text-[24px] font-extrabold text-ink">Logo WAH</h3>
            <p className="mt-2 text-[14px] font-semibold text-ink-soft">
              Unggah logo resmi lembaga Anda. Format: PNG, JPG, JPEG, WEBP, atau SVG. Ukuran maksimal 2 MB. Logo akan
              tampil di opening, beranda, header, semua halaman, dan footer.
            </p>

            <div className="mt-5 rounded-[22px] border-2 border-dashed border-[#b9d6f2] bg-[#f7fbff] p-6 text-center">
              {p.logoWAH.data ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={p.logoWAH.data}
                    alt="Preview logo WAH"
                    className="max-h-[128px] w-auto max-w-full rounded-xl object-contain"
                  />
                  <div className="text-[12px] font-bold text-ink-soft">Preview logo (rasio asli dipertahankan)</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Btn variant="blue" className="px-5 py-3 text-[13px]" onClick={() => fileRef.current?.click()}>
                      <Upload size={16} /> Ganti Logo
                    </Btn>
                    <Btn
                      variant="ghost"
                      className="px-5 py-3 text-[13px]"
                      onClick={() => {
                        setLogo({ data: null });
                        sfx("click");
                        toast("Logo dihapus. Tampilan kembali ke teks WAH Official.", "info");
                      }}
                    >
                      <Trash2 size={16} /> Hapus Logo
                    </Btn>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-brand shadow-pop">
                    <ImageIcon size={28} />
                  </div>
                  <div className="text-[13px] font-semibold text-ink-soft">
                    Belum ada logo yang diunggah. Tampilan memakai teks <b>WAH Official</b>.
                  </div>
                  <Btn className="px-6 py-3.5 text-[15px]" onClick={() => fileRef.current?.click()}>
                    <Upload size={18} /> + UPLOAD LOGO
                  </Btn>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  onFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <div className="mb-2 text-[13px] font-extrabold text-ink-soft">Posisi</div>
                <div className="flex flex-wrap gap-2">
                  {(["left", "center", "right"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setLogo({ position: v });
                        sfx("click");
                      }}
                      className={`rounded-full px-4 py-2 font-display text-[12px] font-bold ${
                        p.logoWAH.position === v ? "bg-brand text-white" : "border-2 border-line bg-white text-ink"
                      }`}
                    >
                      {v === "left" ? "Kiri atas" : v === "center" ? "Tengah atas" : "Kanan atas"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-[13px] font-extrabold text-ink-soft">Ukuran</div>
                <div className="flex flex-wrap gap-2">
                  {(["sm", "md", "lg"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setLogo({ size: v });
                        sfx("click");
                      }}
                      className={`rounded-full px-4 py-2 font-display text-[12px] font-bold ${
                        p.logoWAH.size === v ? "bg-brand text-white" : "border-2 border-line bg-white text-ink"
                      }`}
                    >
                      {v === "sm" ? "Kecil" : v === "md" ? "Sedang" : "Besar"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="mb-2 text-[13px] font-extrabold text-ink-soft">Tampilan</div>
                <div className="flex flex-wrap gap-2">
                  {([true, false] as const).map((v) => (
                    <button
                      key={String(v)}
                      onClick={() => {
                        setLogo({ showText: v });
                        sfx("click");
                      }}
                      className={`rounded-full px-4 py-2 font-display text-[12px] font-bold ${
                        p.logoWAH.showText === v ? "bg-brand text-white" : "border-2 border-line bg-white text-ink"
                      }`}
                    >
                      {v ? "Logo + WAH Official" : "Logo saja"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card p-6">
              <div className="mb-3 flex items-center gap-2">
                <Eye size={18} className="text-brand" />
                <div className="font-display text-[17px] font-extrabold text-ink">Preview Real-time</div>
              </div>
              <div className="rounded-[22px] border-2 border-line bg-[linear-gradient(160deg,#eaf6ff,#ffffff)] p-5">
                <div
                  className={`flex ${
                    p.logoWAH.position === "center"
                      ? "justify-center"
                      : p.logoWAH.position === "right"
                        ? "justify-end"
                        : "justify-start"
                  }`}
                >
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-pop">
                    <WahLogo size={p.logoWAH.size} showText={p.logoWAH.showText} />
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-white/80 p-3 text-center text-[12px] font-bold text-ink-soft">
                  Logo akan tampil di header, footer, beranda, materi, simulasi, latihan, mini game, kuis, dan hasil.
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="font-display text-[17px] font-extrabold text-ink">Catatan</div>
              <ul className="mt-3 space-y-2">
                {[
                  "Logo disimpan di localStorage browser ini.",
                  "Rasio asli logo selalu dipertahankan.",
                  "Jika belum ada logo, tampilan memakai teks WAH Official.",
                  "Identitas karakter Hanif dan Arsya tidak dapat diubah.",
                ].map((c) => (
                  <li key={c} className="flex items-start gap-2 text-[13.5px] font-semibold text-ink-soft">
                    <Check size={16} className="mt-0.5 shrink-0 text-grass" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ---------- TAMPILAN ---------- */}
      {tab === "tampilan" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-7">
            <div className="step-label">🎨 Pengaturan Tampilan</div>
            <label className="mt-4 mb-1.5 block text-[13px] font-extrabold text-ink-soft">Nama aplikasi</label>
            <input
              className="input"
              value={p.teacherSettings.appName}
              onChange={(e) =>
                update((prev) => ({ ...prev, teacherSettings: { ...prev.teacherSettings, appName: e.target.value } }))
              }
            />
            <label className="mt-4 mb-1.5 block text-[13px] font-extrabold text-ink-soft">Tagline</label>
            <input
              className="input"
              value={p.teacherSettings.tagline}
              onChange={(e) =>
                update((prev) => ({ ...prev, teacherSettings: { ...prev.teacherSettings, tagline: e.target.value } }))
              }
            />
            <label className="mt-4 mb-1.5 block text-[13px] font-extrabold text-ink-soft">Nama siswa</label>
            <input
              className="input"
              value={p.studentName}
              onChange={(e) => update((prev) => ({ ...prev, studentName: e.target.value }))}
            />
            <button
              onClick={() => {
                update((prev) => ({ ...prev, teacherSettings: { ...prev.teacherSettings, anim: !prev.teacherSettings.anim } }));
                sfx("click");
              }}
              className={`mt-5 flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 ${
                p.teacherSettings.anim ? "border-brand bg-brand-soft" : "border-line bg-white"
              }`}
            >
              <span className="font-display text-[15px] font-extrabold text-ink">Animasi pembelajaran</span>
              <span
                className={`relative h-7 w-12 rounded-full transition ${p.teacherSettings.anim ? "bg-brand" : "bg-[#c9dcef]"}`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                    p.teacherSettings.anim ? "left-6" : "left-1"
                  }`}
                />
              </span>
            </button>
          </div>

          <div className="card p-7">
            <div className="font-display text-[18px] font-extrabold text-ink">Identitas Karakter (Tetap)</div>
            <p className="mt-2 text-[14px] font-semibold text-ink-soft">
              Agar konsisten, identitas dasar karakter tidak dapat diubah dari Mode Guru.
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl bg-brand-soft p-4">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white font-display text-[15px] font-extrabold text-brand">
                  H
                </div>
                <div>
                  <div className="font-display text-[15px] font-extrabold text-ink">Hanif</div>
                  <div className="text-[12.5px] font-semibold text-ink-soft">
                    Kaos lengan pendek + celana panjang + sepatu.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-grape-soft p-4">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white font-display text-[15px] font-extrabold text-[#6d3fd6]">
                  A
                </div>
                <div>
                  <div className="font-display text-[15px] font-extrabold text-ink">Arsya</div>
                  <div className="text-[12.5px] font-semibold text-ink-soft">
                    Gamis ungu + kerudung panjang yang menutup dada dan bahu + sepatu.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- SUARA ---------- */}
      {tab === "suara" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-7">
            <div className="step-label">🔊 Pengaturan Suara</div>
            <ToggleRow
              label="Efek suara"
              desc="Suara jawaban benar, salah, dan level selesai"
              value={p.voiceSettings.sound}
              onChange={(v) => {
                update((prev) => ({ ...prev, voiceSettings: { ...prev.voiceSettings, sound: v } }));
                if (v) sfx("star");
              }}
            />
            <ToggleRow
              label="Narasi suara (Text-to-Speech)"
              desc={ttsSupported ? "Penjelasan dapat dibacakan dengan suara" : "Browser ini tidak mendukung Text-to-Speech"}
              value={p.voiceSettings.tts}
              onChange={(v) =>
                update((prev) => ({ ...prev, voiceSettings: { ...prev.voiceSettings, tts: v } }))
              }
            />
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-[13px] font-extrabold text-ink-soft">
                <span>Volume</span>
                <span>{Math.round(p.voiceSettings.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(p.voiceSettings.volume * 100)}
                onChange={(e) =>
                  update((prev) => ({
                    ...prev,
                    voiceSettings: { ...prev.voiceSettings, volume: Number(e.target.value) / 100 },
                  }))
                }
                className="w-full accent-[#2563eb]"
              />
            </div>
            <div className="mt-5">
              <div className="mb-2 text-[13px] font-extrabold text-ink-soft">Kecepatan suara</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Lambat", value: 0.75 },
                  { label: "Normal", value: 0.92 },
                  { label: "Cepat", value: 1.12 },
                ].map((r) => (
                  <button
                    key={r.label}
                    onClick={() => {
                      update((prev) => ({ ...prev, voiceSettings: { ...prev.voiceSettings, rate: r.value } }));
                      sfx("click");
                    }}
                    className={`rounded-full px-5 py-2.5 font-display text-[13px] font-bold ${
                      Math.abs(p.voiceSettings.rate - r.value) < 0.01
                        ? "bg-brand text-white"
                        : "border-2 border-line bg-white text-ink"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-7">
            <div className="font-display text-[18px] font-extrabold text-ink">Uji Suara</div>
            <p className="mt-2 text-[14px] font-semibold text-ink-soft">
              Dengarkan contoh narasi untuk memastikan suara terdengar jelas.
            </p>
            <div className="mt-4 rounded-2xl bg-[#f7fbff] p-5 text-[15px] font-semibold text-ink">
              “Yuk, kita belajar membulatkan bilangan. Perhatikan angka penentunya. Jika angka penentu nol sampai empat,
              angka tetap. Jika angka penentu lima sampai sembilan, angka pada tempat pembulatan bertambah satu.”
            </div>
            <Btn
              variant="blue"
              className="mt-4 px-6 py-3.5 text-[15px]"
              onClick={() => {
                sfx("click");
                window.speechSynthesis?.cancel();
                if (!ttsSupported) {
                  toast("Fitur suara tidak tersedia pada browser ini.", "bad");
                  return;
                }
                const u = new SpeechSynthesisUtterance(
                  "Yuk, kita belajar membulatkan bilangan. Perhatikan angka penentunya. Jika angka penentu nol sampai empat, angka tetap. Jika angka penentu lima sampai sembilan, angka pada tempat pembulatan bertambah satu.",
                );
                u.lang = "id-ID";
                u.rate = p.voiceSettings.rate;
                window.speechSynthesis.speak(u);
              }}
            >
              <Volume2 size={18} /> Putar Contoh Narasi
            </Btn>
          </div>
        </div>
      )}

      {/* ---------- MATERI ---------- */}
      {tab === "materi" && (
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="step-label">📚 Kelola Materi</div>
              <div className="font-display text-[20px] font-extrabold text-ink">{LEVELS.length} level pembelajaran</div>
            </div>
            <Btn
              variant="ghost"
              className="px-5 py-3 text-[13px]"
              onClick={() => {
                update((prev) => ({ ...prev, completedLessons: [], unlockedLevels: 1 }));
                sfx("click");
                toast("Progress materi siswa direset.", "info");
              }}
            >
              <RotateIcon /> Reset Progress Materi
            </Btn>
          </div>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {LEVELS.map((l) => {
              const done = p.completedLessons.includes(l.id);
              return (
                <div key={l.id} className="flex items-center gap-3 rounded-2xl bg-[#f7fbff] px-4 py-3">
                  <div
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display text-[14px] font-extrabold ${
                      done ? "bg-grass text-white" : "bg-white text-ink-soft"
                    }`}
                  >
                    {done ? <Check size={16} strokeWidth={4} /> : l.no}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-display text-[14px] font-extrabold text-ink">{l.title}</div>
                    <div className="truncate text-[11.5px] font-semibold text-ink-soft">{l.subtitle}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------- LATIHAN ---------- */}
      {tab === "latihan" && (
        <div className="card p-6">
          <div className="step-label">✏️ Kelola Latihan</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {(["mudah", "sedang", "menantang"] as const).map((d) => (
              <div key={d} className="rounded-2xl border-2 border-line p-5 text-center">
                <div className="text-[12px] font-extrabold tracking-[0.14em] text-ink-soft uppercase">{d}</div>
                <div className="mt-2 font-display text-[34px] leading-none font-extrabold text-ink">
                  {p.exerciseScores[d] ?? 0}
                </div>
                <div className="mt-1 text-[11.5px] font-bold text-ink-soft">skor terbaik dari 100</div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-[#f7fbff] p-5 text-[14px] font-semibold text-ink-soft">
            Setiap tingkat latihan berisi 10 soal acak dengan umpan balik langsung, petunjuk bertahap, dan proses
            berpikir yang ditampilkan setelah menjawab.
          </div>
          <Btn
            variant="ghost"
            className="mt-4 px-5 py-3 text-[13px]"
            onClick={() => {
              update((prev) => ({ ...prev, exerciseScores: {} }));
              sfx("click");
              toast("Skor latihan direset.", "info");
            }}
          >
            <RotateIcon /> Reset Skor Latihan
          </Btn>
        </div>
      )}

      {/* ---------- KUIS ---------- */}
      {tab === "kuis" && (
        <div className="card p-6">
          <div className="step-label">🏆 Kelola Kuis</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border-2 border-line p-5 text-center">
              <div className="text-[12px] font-extrabold tracking-[0.14em] text-ink-soft uppercase">Jumlah Kuis</div>
              <div className="mt-2 font-display text-[34px] leading-none font-extrabold text-ink">{p.quizScores.length}</div>
            </div>
            <div className="rounded-2xl border-2 border-line p-5 text-center">
              <div className="text-[12px] font-extrabold tracking-[0.14em] text-ink-soft uppercase">Skor Terakhir</div>
              <div className="mt-2 font-display text-[34px] leading-none font-extrabold text-ink">{p.lastScore ?? "-"}</div>
            </div>
            <div className="rounded-2xl border-2 border-line p-5 text-center">
              <div className="text-[12px] font-extrabold tracking-[0.14em] text-ink-soft uppercase">Rata-rata</div>
              <div className="mt-2 font-display text-[34px] leading-none font-extrabold text-ink">
                {p.quizScores.length
                  ? Math.round(p.quizScores.reduce((a, b) => a + b.score, 0) / p.quizScores.length)
                  : "-"}
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Btn variant="blue" className="px-5 py-3 text-[13px]" onClick={() => setPage("kuis")}>
              <Trophy size={16} /> Buka Halaman Kuis
            </Btn>
            <Btn
              variant="ghost"
              className="px-5 py-3 text-[13px]"
              onClick={() => {
                update((prev) => ({ ...prev, quizScores: [], lastScore: null }));
                sfx("click");
                toast("Riwayat kuis direset.", "info");
              }}
            >
              <RotateIcon /> Reset Riwayat Kuis
            </Btn>
          </div>
        </div>
      )}

      {/* ---------- HASIL ---------- */}
      {tab === "hasil" && (
        <div className="card p-6">
          <div className="step-label">📊 Lihat Hasil Belajar</div>
          <div className="mt-3 space-y-2">
            {p.quizScores.length === 0 ? (
              <div className="rounded-2xl bg-[#f7fbff] p-6 text-center text-[14px] font-semibold text-ink-soft">
                Belum ada hasil belajar yang tercatat.
              </div>
            ) : (
              p.quizScores.map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-2xl bg-[#f7fbff] px-4 py-3">
                  <div>
                    <div className="font-display text-[14px] font-extrabold text-ink">{r.kind}</div>
                    <div className="text-[11.5px] font-semibold text-ink-soft">
                      {r.date} • {r.correct}/{r.total} benar
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip tone={r.score >= 80 ? "green" : r.score >= 70 ? "sun" : "coral"}>{r.score}</Chip>
                  </div>
                </div>
              ))
            )}
          </div>
          <Btn variant="blue" className="mt-4 px-5 py-3 text-[13px]" onClick={() => setPage("hasil")}>
            <BarChart3 size={16} /> Buka Halaman Hasil Belajar
          </Btn>
        </div>
      )}

      {/* ---------- APLIKASI ---------- */}
      {tab === "aplikasi" && (
        <div className="card p-7">
          <div className="step-label">⚙️ Pengaturan Aplikasi</div>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl bg-[#f7fbff] p-5">
              <div className="font-display text-[16px] font-extrabold text-ink">Penyimpanan Data</div>
              <p className="mt-1 text-[13.5px] font-semibold text-ink-soft">
                Seluruh progress siswa, skor, pengaturan suara, dan logo disimpan pada localStorage browser ini.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip tone="blue">{p.completedLessons.length} materi selesai</Chip>
                <Chip tone="sun">{p.points} poin</Chip>
                <Chip tone="green">{p.stars} bintang</Chip>
                <Chip tone="grape">{p.logoWAH.data ? "Logo aktif" : "Tanpa logo"}</Chip>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-[#ffc9c9] bg-[#fff5f5] p-5">
              <div className="font-display text-[16px] font-extrabold text-[#b23b3b]">Zona Berbahaya</div>
              <p className="mt-1 text-[13.5px] font-semibold text-[#b23b3b]/85">
                Menghapus seluruh data akan mengembalikan aplikasi ke pengaturan awal, termasuk logo dan progress siswa.
              </p>
              <button
                onClick={() => {
                  reset();
                  sfx("click");
                  toast("Seluruh data aplikasi telah direset.", "info");
                }}
                className="btn mt-4 px-6 py-3.5 text-[14px]"
                style={{ background: "#ff6b6b", color: "#fff", boxShadow: "0 8px 0 -1px #d64545" }}
              >
                <Trash2 size={17} /> HAPUS SELURUH DATA
              </button>
            </div>

            <div className="rounded-2xl bg-[#f7fbff] p-5">
              <div className="font-display text-[16px] font-extrabold text-ink">Konfigurasi Bawaan</div>
              <pre className="mt-2 overflow-x-auto rounded-xl bg-white p-4 text-[12px] font-semibold text-ink-soft">
                {JSON.stringify(defaultProgress.teacherSettings, null, 2)}
              </pre>
            </div>

            <button onClick={() => setPage("beranda")} className="btn btn-ghost px-6 py-3.5 text-[14px]">
              <X size={17} /> Keluar dari Mode Guru
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`mt-4 flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-left ${
        value ? "border-brand bg-brand-soft" : "border-line bg-white"
      }`}
    >
      <span>
        <span className="block font-display text-[15px] font-extrabold text-ink">{label}</span>
        <span className="block text-[12px] font-semibold text-ink-soft">{desc}</span>
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${value ? "bg-brand" : "bg-[#c9dcef]"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${value ? "left-6" : "left-1"}`} />
      </span>
    </button>
  );
}

function RotateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}
