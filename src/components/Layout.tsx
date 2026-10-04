import type { ReactNode } from "react";
import {
  Home,
  BookOpen,
  FlaskConical,
  Pencil,
  Gamepad2,
  Trophy,
  BarChart3,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useApp } from "../lib/store";
import { WahLogo, LogoMark } from "./ui";

export type PageKey =
  | "beranda"
  | "materi"
  | "simulasi"
  | "latihan"
  | "minigame"
  | "kuis"
  | "hasil"
  | "guru";

export const NAV: { key: PageKey; label: string; icon: typeof Home; accent: string }[] = [
  { key: "beranda", label: "BERANDA", icon: Home, accent: "#2563eb" },
  { key: "materi", label: "MATERI", icon: BookOpen, accent: "#0ea5e9" },
  { key: "simulasi", label: "SIMULASI", icon: FlaskConical, accent: "#8b5cf6" },
  { key: "latihan", label: "LATIHAN", icon: Pencil, accent: "#f59e0b" },
  { key: "minigame", label: "MINI GAME", icon: Gamepad2, accent: "#ec4899" },
  { key: "kuis", label: "KUIS", icon: Trophy, accent: "#f97316" },
  { key: "hasil", label: "HASIL BELAJAR", icon: BarChart3, accent: "#22c55e" },
  { key: "guru", label: "MODE GURU", icon: Settings, accent: "#64748b" },
];

function SkyDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="cloud top-[8%] left-[4%] h-16 w-44 opacity-70" />
      <div className="cloud top-[16%] right-[8%] h-12 w-32 opacity-60" style={{ animationDuration: "24s" }} />
      <div className="cloud top-[42%] left-[16%] h-10 w-28 opacity-40" style={{ animationDuration: "30s" }} />
      <div className="absolute top-[30%] right-[3%] font-display text-[110px] font-extrabold text-white/45 floaty">3</div>
      <div className="absolute top-[62%] left-[2%] font-display text-[92px] font-extrabold text-white/45 floaty" style={{ animationDelay: "1.2s" }}>
        8
      </div>
      <div className="absolute top-[74%] right-[12%] font-display text-[72px] font-extrabold text-white/40 floaty" style={{ animationDelay: "2.1s" }}>
        5
      </div>
    </div>
  );
}

export function Layout({
  page,
  setPage,
  children,
}: {
  page: PageKey;
  setPage: (p: PageKey) => void;
  children: ReactNode;
}) {
  const { p, sfx, toast } = useApp();
  const appName = p.teacherSettings.appName;
  const sizeClass = p.logoWAH.size === "sm" ? "scale-90" : p.logoWAH.size === "lg" ? "scale-110" : "";

  return (
    <div className={`relative min-h-screen ${p.teacherSettings.anim ? "" : "no-anim"}`}>
      <SkyDecor />

      <header className="relative z-20 pt-4">
        <div className="mx-auto max-w-[1280px] px-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div
              className={`glass rounded-2xl px-3.5 py-2 shadow-pop ${sizeClass} ${
                p.logoWAH.position === "center" ? "order-2" : p.logoWAH.position === "right" ? "order-3" : ""
              }`}
            >
              <WahLogo size={p.logoWAH.size} showText={p.logoWAH.showText} compact />
            </div>

            <div className="hidden min-w-0 flex-1 flex-col items-center lg:flex">
              <div className="flex items-center gap-2">
                <LogoMark size={26} />
                <h1 className="bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#0ea5e9] bg-clip-text font-display text-[30px] leading-none font-extrabold tracking-tight text-transparent">
                  {appName.toUpperCase()}
                </h1>
              </div>
              <div className="mt-1.5 rounded-full bg-gradient-to-r from-[#2563eb] to-[#38bdf8] px-4 py-1 font-display text-[13px] font-bold text-white shadow-pop">
                Pembulatan &amp; Penaksiran
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sfx("click");
                  toast(p.voiceSettings.sound ? "Suara dimatikan." : "Suara dinyalakan.");
                }}
                className="glass grid h-11 w-11 place-items-center rounded-2xl shadow-pop transition hover:scale-105"
                title={p.voiceSettings.sound ? "Matikan suara" : "Nyalakan suara"}
              >
                {p.voiceSettings.sound ? <Volume2 size={20} className="text-brand" /> : <VolumeX size={20} className="text-coral" />}
              </button>
              <div className="glass flex items-center gap-1.5 rounded-2xl px-3 py-2 shadow-pop">
                <span className="text-[18px]">⭐</span>
                <span className="font-display text-[17px] font-extrabold text-ink">{p.stars}</span>
              </div>
              <div className="glass hidden items-center gap-2.5 rounded-2xl px-3 py-2 shadow-pop sm:flex">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft">
                  <span className="font-display text-[15px] font-extrabold text-brand-dark">
                    {p.studentName.slice(0, 1).toUpperCase()}
                  </span>
                </div>
                <div className="leading-tight">
                  <div className="font-display text-[13px] font-extrabold text-ink">Halo, Teman!</div>
                  <div className="text-[10px] font-bold text-ink-soft">Terus semangat belajar!</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-col items-center lg:hidden">
            <div className="flex items-center gap-2">
              <LogoMark size={20} />
              <h1 className="font-display text-[21px] leading-none font-extrabold text-brand-dark">
                {appName.toUpperCase()}
              </h1>
            </div>
            <div className="mt-1.5 rounded-full bg-gradient-to-r from-[#2563eb] to-[#38bdf8] px-3.5 py-1 font-display text-[11px] font-bold text-white">
              Pembulatan &amp; Penaksiran
            </div>
          </div>

          <nav className="scroll-x mt-4 hidden gap-2 rounded-[22px] border border-white/80 bg-white/75 p-2 shadow-pop backdrop-blur lg:flex">
            {NAV.map((n) => {
              const active = page === n.key;
              const Icon = n.icon;
              return (
                <button
                  key={n.key}
                  onClick={() => {
                    sfx("click");
                    setPage(n.key);
                  }}
                  className={`btn flex-1 px-2.5 py-3 text-[11.5px] xl:px-4 xl:text-[13px] ${
                    active ? "btn-blue" : "bg-white text-ink hover:bg-brand-soft"
                  }`}
                  style={active ? undefined : { boxShadow: "0 4px 0 -1px #dcebfb" }}
                >
                  <Icon size={18} style={{ color: active ? "#fff" : n.accent }} />
                  {n.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="relative z-10 px-3 pt-5 pb-8 sm:px-6 lg:pb-12">
        <div className="mx-auto max-w-[1280px]">{children}</div>
      </main>

      <footer className="relative z-10 mb-[124px] lg:mb-4">
        <div className="mx-auto max-w-[1280px] px-3 sm:px-6">
          <div className="glass flex flex-col items-center gap-3 rounded-[26px] px-6 py-6 text-center shadow-pop sm:flex-row sm:justify-between sm:text-left">
            <WahLogo size="md" showText />
            <div>
              <div className="font-display text-[15px] font-extrabold text-ink">
                Petualangan Angka — Pembulatan &amp; Penaksiran
              </div>
              <div className="text-[12px] font-bold text-ink-soft">© 2026 WAH Official</div>
            </div>
            <button
              onClick={() => {
                sfx("click");
                setPage("beranda");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="btn btn-ghost px-5 py-2.5 text-[13px]"
            >
              <Home size={16} /> Beranda
            </button>
          </div>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/80 bg-white/92 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)] shadow-[0_-10px_30px_-18px_rgba(18,58,107,0.6)] backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {NAV.map((n) => {
            const active = page === n.key;
            const Icon = n.icon;
            return (
              <button
                key={n.key}
                onClick={() => {
                  sfx("click");
                  setPage(n.key);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex flex-col items-center gap-1 rounded-2xl py-2 transition ${
                  active ? "bg-brand text-white" : "text-ink-soft"
                }`}
              >
                <Icon size={19} style={{ color: active ? "#fff" : n.accent }} />
                <span className="font-display text-[9.5px] leading-none font-bold">{n.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
