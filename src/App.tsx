import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { AppProvider, useApp } from "./lib/store";
import { Layout } from "./components/Layout";
import { Opening } from "./components/Opening";
import type { PageKey } from "./components/Layout";
import Home from "./pages/Home";
import Materi from "./pages/Materi";
import Simulasi from "./pages/Simulasi";
import Latihan from "./pages/Latihan";
import MiniGame from "./pages/MiniGame";
import Kuis from "./pages/Kuis";
import Hasil from "./pages/Hasil";
import Guru from "./pages/Guru";

function ToastStack() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed top-20 right-3 z-50 flex w-[min(340px,calc(100vw-24px))] flex-col gap-2 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-2.5 rounded-2xl px-4 py-3 shadow-pop ${
              t.type === "good"
                ? "border-2 border-[#a7e9c2] bg-[#e8fbef] text-[#136c3a]"
                : t.type === "bad"
                  ? "border-2 border-[#ffc9c9] bg-[#fff1f1] text-[#b23b3b]"
                  : "border-2 border-line bg-white text-ink"
            }`}
          >
            {t.type === "good" ? (
              <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            ) : t.type === "bad" ? (
              <XCircle size={19} className="mt-0.5 shrink-0" />
            ) : (
              <Info size={19} className="mt-0.5 shrink-0" />
            )}
            <span className="text-[13.5px] leading-snug font-bold">{t.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Shell() {
  const [page, setPage] = useState<PageKey>("beranda");
  const [opening, setOpening] = useState(true);

  return (
    <Layout page={page} setPage={setPage}>
      <AnimatePresence>{opening && <Opening onDone={() => setOpening(false)} />}</AnimatePresence>
      {page === "beranda" && <Home setPage={setPage} />}
      {page === "materi" && <Materi setPage={setPage} />}
      {page === "simulasi" && <Simulasi />}
      {page === "latihan" && <Latihan setPage={setPage} />}
      {page === "minigame" && <MiniGame setPage={setPage} />}
      {page === "kuis" && <Kuis setPage={setPage} />}
      {page === "hasil" && <Hasil setPage={setPage} />}
      {page === "guru" && <Guru setPage={setPage} />}
      <ToastStack />
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
