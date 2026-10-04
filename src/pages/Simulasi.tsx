import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Ruler, Calculator, Hash, Play, RefreshCw, Target } from "lucide-react";
import {
  DEC_PLACES,
  INT_PLACES,
  PLACES,
  detIndex,
  digitAt,
  digitTokens,
  estimate,
  fmtNum,
  parseNum,
  roundTo,
  toNumber,
  type Operator,
  type PlaceKey,
} from "../lib/math";
import { useApp } from "../lib/store";
import { Btn, Chip, DigitNumber, NumberLine, RoundingProcess, SectionTitle, CharacterBubble } from "../components/ui";

type TabKey = "bulat" | "desimal" | "garis" | "penaksiran";

const TABS: { key: TabKey; label: string; icon: typeof FlaskConical; desc: string }[] = [
  { key: "bulat", label: "Lab Pembulatan Bulat", icon: Hash, desc: "Satuan, puluhan, ratusan, ribuan" },
  { key: "desimal", label: "Lab Pembulatan Desimal", icon: FlaskConical, desc: "Satuan sampai perseribuan" },
  { key: "garis", label: "Garis Bilangan", icon: Ruler, desc: "Lihat mengapa naik atau tetap" },
  { key: "penaksiran", label: "Kalkulator Penaksiran", icon: Calculator, desc: "+, −, ×, ÷ dengan pembulatan" },
];

export default function Simulasi() {
  const [tab, setTab] = useState<TabKey>("bulat");
  const { sfx } = useApp();

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="🎬 Simulasi Interaktif"
        title="Laboratorium Pembulatan"
        sub="Masukkan bilangan, pilih tempat pembulatan, lalu lihat prosesnya langkah demi langkah."
      />

      <div className="scroll-x -mx-3 flex gap-2.5 px-3 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
        {TABS.map((t) => {
          const active = tab === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => {
                sfx("click");
                setTab(t.key);
              }}
              className={`min-w-[228px] rounded-[22px] border-2 px-4 py-4 text-left transition sm:min-w-0 ${
                active
                  ? "border-brand bg-brand text-white shadow-pop"
                  : "border-line bg-white text-ink hover:-translate-y-0.5 hover:border-brand-light"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-2xl ${active ? "bg-white/20" : "bg-brand-soft"}`}
                >
                  <Icon size={20} className={active ? "text-white" : "text-brand"} />
                </div>
                <div>
                  <div className="font-display text-[15px] leading-tight font-extrabold">{t.label}</div>
                  <div className={`text-[11.5px] font-semibold ${active ? "text-white/85" : "text-ink-soft"}`}>{t.desc}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {tab === "bulat" && <LabPanel kind="bulat" />}
      {tab === "desimal" && <LabPanel kind="desimal" />}
      {tab === "garis" && <GarisPanel />}
      {tab === "penaksiran" && <PenaksiranPanel />}

      <AturanDanTabel />
    </div>
  );
}

/* ================= ATURAN & TABEL ================= */

function AturanDanTabel() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.25fr]">
      <div className="card overflow-hidden">
        <div className="p-6">
          <div className="step-label">Aturan Dasar Pembulatan</div>
          <h3 className="mt-1 font-display text-[22px] font-extrabold text-ink">0–4 atau 5–9?</h3>
        </div>
        <div className="grid grid-cols-2">
          <div className="bg-[#eaf2ff] p-6 text-center">
            <div className="font-display text-[42px] leading-none font-extrabold text-brand">0–4</div>
            <div className="mt-2 text-[26px]">⬇️</div>
            <div className="mt-1 font-display text-[16px] font-extrabold text-brand-dark">TETAP</div>
            <div className="mt-1 text-[12px] font-semibold text-ink-soft">
              Angka pada tempat pembulatan tidak berubah.
            </div>
          </div>
          <div className="bg-grape-soft p-6 text-center">
            <div className="font-display text-[42px] leading-none font-extrabold text-[#6d3fd6]">5–9</div>
            <div className="mt-2 text-[26px]">⬆️</div>
            <div className="mt-1 font-display text-[16px] font-extrabold text-[#6d3fd6]">NAIK 1</div>
            <div className="mt-1 text-[12px] font-semibold text-ink-soft">
              Angka pada tempat pembulatan bertambah satu.
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="rounded-2xl border-2 border-[#ffd772] bg-[#fff9e8] p-4 text-[14px] font-bold text-[#8a5a00]">
            Aturan khusus: angka <b>5</b> selalu dibulatkan ke <b>atas</b>. Contoh: 7,5 ≈ 8 dan 2,35 ≈ 2,4.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["34 → 30", "36 → 40", "143 → 100", "167 → 200", "1.234 → 1.000", "1.678 → 2.000"].map((e) => (
              <span key={e} className="pill bg-brand-soft text-brand-dark">
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="step-label">Tabel Angka Penentu</div>
        <h3 className="mt-1 font-display text-[22px] font-extrabold text-ink">Lihat Angka yang Mana?</h3>
        <p className="mt-2 text-[14px] font-semibold text-ink-soft">
          Angka penentu selalu tepat <b className="text-ink">satu tempat di sebelah kanan</b> tempat pembulatan.
        </p>

        <div className="mt-4 overflow-hidden rounded-2xl border-2 border-line">
          <div className="grid grid-cols-2 bg-brand px-4 py-3 text-[11.5px] font-extrabold tracking-[0.12em] text-white uppercase">
            <div>Dibulatkan ke</div>
            <div>Lihat angka (angka penentu)</div>
          </div>
          {[
            ["Puluhan", "Satuan"],
            ["Ratusan", "Puluhan"],
            ["Ribuan", "Ratusan"],
            ["Satuan", "Persepuluhan"],
            ["Persepuluhan", "Perseratusan"],
            ["Perseratusan", "Perseribuan"],
            ["Perseribuan", "Satu tempat berikutnya"],
          ].map(([a, b], i) => (
            <div
              key={a}
              className={`grid grid-cols-2 px-4 py-3 transition hover:bg-brand-soft ${
                i % 2 === 0 ? "bg-white" : "bg-[#f7fbff]"
              }`}
            >
              <div className="font-display text-[15px] font-extrabold text-ink">{a}</div>
              <div className="flex items-center gap-2 text-[14px] font-bold text-[#6d3fd6]">
                <span className="text-brand/50">→</span> {b}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-[#f7fbff] p-4 text-[13.5px] font-semibold text-ink-soft">
          Contoh: <b className="text-ink">12,347</b> dibulatkan ke satuan → angka penentu <b className="text-ink">3</b>.
          Dibulatkan ke persepuluhan → angka penentu <b className="text-ink">4</b>. Dibulatkan ke perseratusan → angka
          penentu <b className="text-ink">7</b>.
        </div>
      </div>
    </div>
  );
}

/* ================= LAB ================= */

function LabPanel({ kind }: { kind: "bulat" | "desimal" }) {
  const { sfx, toast } = useApp();
  const [raw, setRaw] = useState(kind === "bulat" ? "347" : "12,347");
  const [place, setPlace] = useState<PlaceKey>(kind === "bulat" ? "puluhan" : "persepuluhan");
  const [result, setResult] = useState(() => roundTo(kind === "bulat" ? "347" : "12,347", kind === "bulat" ? "puluhan" : "persepuluhan"));
  const [err, setErr] = useState("");

  const places = kind === "bulat" ? INT_PLACES : DEC_PLACES;

  const hitung = () => {
    if (!parseNum(raw)) {
      setErr("Masukkan bilangan yang benar terlebih dahulu.");
      toast("Masukkan bilangan yang benar terlebih dahulu.", "bad");
      sfx("wrong");
      return;
    }
    setErr("");
    const r = roundTo(raw, place);
    setResult(r);
      sfx("game");
    if (r) _speakProcess(r);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
      <div className="card p-6">
        <div className="step-label mb-3">Masukkan Bilangan</div>
        <input
          className="input text-[22px]"
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            setErr("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") hitung();
          }}
          placeholder={kind === "bulat" ? "347" : "12,347"}
          inputMode="decimal"
        />
        {err && (
          <div className="mt-2 rounded-xl bg-[#fff1f1] px-4 py-2.5 text-[13px] font-bold text-[#b23b3b]">{err}</div>
        )}
        <div className="mt-2 text-[12px] font-semibold text-ink-soft">
          Gunakan koma untuk bilangan desimal, contoh: <b>12,347</b>. Titik dipakai untuk pemisah ribuan.
        </div>

        <div className="mt-6 step-label">Tempat Pembulatan</div>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {places.map((pl) => (
            <button
              key={pl}
              onClick={() => {
                sfx("click");
                setPlace(pl);
              }}
              className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition ${
                place === pl ? "border-brand bg-brand-soft" : "border-line bg-white hover:border-brand-light"
              }`}
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                  place === pl ? "border-brand" : "border-[#c9dcef]"
                }`}
              >
                {place === pl && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
              </span>
              <span>
                <span className="block font-display text-[16px] font-extrabold text-ink">{PLACES[pl].label}</span>
                <span className="block text-[11.5px] font-semibold text-ink-soft">{PLACES[pl].desc}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Btn className="px-7 py-4 text-[16px]" onClick={hitung}>
            <Play size={19} /> HITUNG
          </Btn>
          <Btn
            variant="ghost"
            className="px-5 py-4 text-[14px]"
            onClick={() => {
              setRaw(kind === "bulat" ? "347" : "12,347");
              setErr("");
              sfx("click");
            }}
          >
            <RefreshCw size={17} /> Ulangi
          </Btn>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {(kind === "bulat" ? ["34", "36", "143", "167", "1234", "1678"] : ["12,3", "12,7", "7,386", "2,35", "9,8", "19,96"]).map(
            (c) => (
              <button
                key={c}
                onClick={() => {
                  setRaw(c);
                  sfx("click");
                }}
                className="rounded-full border-2 border-line bg-white px-3.5 py-1.5 font-display text-[13px] font-bold text-ink transition hover:border-brand-light hover:bg-brand-soft"
              >
                {c}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="card p-6">
        {result ? (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Chip tone="grape">Tempat pembulatan: {result.placeLabel}</Chip>
              <Chip tone="sun">Angka penentu: {result.detExists ? result.detDigit : "—"}</Chip>
              <Chip tone={result.roundUp ? "grape" : "blue"}>{result.roundUp ? "Naik 1" : "Tetap"}</Chip>
            </div>
            <DigitNumber tokens={digitTokens(result.input, result.place)} size="md" />
            <div className="mt-5">
              <RoundingProcess result={result} />
            </div>
            <motion.div
              key={result.input + result.place}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-5 rounded-[22px] bg-[linear-gradient(120deg,#1d4ed8,#3b82f6)] p-5 text-center text-white shadow-pop"
            >
              <div className="text-[12px] font-extrabold tracking-[0.2em] uppercase opacity-85">Hasil Pembulatan</div>
              <div className="mt-1 font-display text-[40px] leading-none font-extrabold">
                {result.input} ≈ {result.result}
              </div>
              {result.carry && (
                <div className="mt-2 inline-block rounded-full bg-white/20 px-4 py-1.5 text-[13px] font-bold">
                  🔥 Terjadi carry: angka pada tempat pembulatan menjadi 10, jadi naik ke tempat nilai berikutnya.
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid h-full min-h-[320px] place-items-center text-center">
      <div>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-soft text-[36px]">🔍</div>
        <div className="mt-3 font-display text-[19px] font-extrabold text-ink">Belum ada hasil</div>
        <div className="mt-1 text-[14px] font-semibold text-ink-soft">
          Masukkan bilangan lalu tekan tombol HITUNG untuk melihat prosesnya.
        </div>
      </div>
    </div>
  );
}

/* ================= GARIS BILANGAN ================= */

function GarisPanel() {
  const { sfx, toast } = useApp();
  const [raw, setRaw] = useState("47");
  const [place, setPlace] = useState<PlaceKey>("puluhan");
  const [pos, setPos] = useState(7);
  const [guess, setGuess] = useState<number | null>(null);

  const parsed = parseNum(raw);
  const base = parsed ? roundTo(raw, place) : null;

  const step = Math.pow(10, PLACES[place].exp);
  const low = base ? Math.floor(toNumber(base.input) / step) * step : 0;
  const high = low + step;
  const dec = Math.max(0, -PLACES[place].exp);
  const current = low + (pos / 10) * step;
  const currentStr = fmtNum(current, dec);
  const cur = roundTo(currentStr, place);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
      <div className="card p-6">
        <div className="step-label mb-3">Atur Garis Bilangan</div>
        <label className="mb-1.5 block text-[13px] font-extrabold text-ink-soft">Bilangan acuan</label>
        <input className="input" value={raw} onChange={(e) => setRaw(e.target.value)} inputMode="decimal" />
        <label className="mt-4 mb-1.5 block text-[13px] font-extrabold text-ink-soft">Tempat pembulatan</label>
        <div className="flex flex-wrap gap-2">
          {[...INT_PLACES, "persepuluhan" as PlaceKey, "perseratusan" as PlaceKey].map((pl) => (
            <button
              key={pl}
              onClick={() => {
                setPlace(pl);
                sfx("click");
              }}
              className={`rounded-full px-4 py-2 font-display text-[13px] font-bold transition ${
                place === pl ? "bg-brand text-white" : "border-2 border-line bg-white text-ink hover:border-brand-light"
              }`}
            >
              {PLACES[pl].label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-ink-soft">Geser angka pada garis</span>
            <span className="rounded-full bg-grape-soft px-3 py-1 font-display text-[15px] font-extrabold text-[#6d3fd6]">
              {currentStr}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={pos}
            onChange={(e) => {
              setPos(Number(e.target.value));
              setGuess(null);
            }}
            className="w-full accent-[#2563eb]"
            aria-label="Geser angka pada garis bilangan"
          />
          <div className="mt-1 flex justify-between font-display text-[12px] font-bold text-ink-soft">
            <span>{fmtNum(low, dec)}</span>
            <span>{fmtNum(low + step / 2, dec)}</span>
            <span>{fmtNum(high, dec)}</span>
          </div>
        </div>

        {cur && (
          <div className="mt-5 rounded-2xl border-2 border-line bg-[#f7fbff] p-4">
            <div className="text-[14px] font-semibold text-ink-soft">
              Angka <b className="text-ink">{cur.input}</b> berada di antara{" "}
              <b className="text-ink">{fmtNum(low, dec)}</b> dan <b className="text-ink">{fmtNum(high, dec)}</b>.
            </div>
            <div className="mt-2 text-[15px] font-bold text-ink">
              Angka penentu = <b className="text-grape">{cur.detExists ? cur.detDigit : "—"}</b> → {cur.rule} →{" "}
              <b className="text-brand-dark">{cur.result}</b>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div className="card p-6">
          <div className="step-label mb-3">Garis Bilangan Interaktif</div>
          {base && <NumberLine result={{ ...base, input: currentStr, result: cur ? cur.result : base.result, roundUp: cur ? cur.roundUp : base.roundUp }} />}
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 11 }, (_, i) => i).map((i) => (
              <button
                key={i}
                onClick={() => {
                  setPos(i);
                  sfx("click");
                }}
                className={`h-10 w-10 rounded-xl font-display text-[13px] font-extrabold transition ${
                  pos === i ? "bg-brand text-white shadow-pop" : "border-2 border-line bg-white text-ink hover:border-brand-light"
                }`}
              >
                {fmtNum(low + (i / 10) * step, dec)}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-grape text-white">
              <Target size={20} />
            </div>
            <div>
              <div className="step-label">Temukan Angka Penentu</div>
              <div className="font-display text-[17px] font-extrabold text-ink">Klik angka penentunya!</div>
            </div>
          </div>
          {cur && (
            <>
              <p className="mb-3 text-[15px] font-semibold text-ink-soft">
                Pada bilangan <b className="text-ink">{cur.input}</b> yang dibulatkan ke{" "}
                <b className="text-ink">{cur.placeLabel.toLowerCase()}</b>, angka penentu adalah ...
              </p>
              <DigitNumber
                tokens={digitTokens(cur.input, cur.place)}
                size="md"
                onDigitClick={(idx) => {
                  const ok = idx === detIndex(cur.input, cur.place);
                  setGuess(idx);
                  sfx(ok ? "correct" : "wrong");
                  if (ok) toast(`Benar! Angka penentunya ${digitAt(cur.input, idx)} 🎉`, "good");
                }}
              />
              {guess !== null && (
                <div
                  className={`mt-4 rounded-2xl px-4 py-3 font-display text-[15px] font-extrabold ${
                    guess === detIndex(cur.input, cur.place)
                      ? "bg-[#e8fbef] text-[#136c3a]"
                      : "bg-[#fff1f1] text-[#b23b3b]"
                  }`}
                >
                  {guess === detIndex(cur.input, cur.place)
                    ? `🎉 Tepat sekali! Angka penentu ${cur.detDigit} berada tepat di sebelah kanan tempat pembulatan.`
                    : "💡 Belum tepat. Ingat slogan kita: satu angka di kanan menentukan!"}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= PENAKSIRAN ================= */

const OPS: Operator[] = ["+", "-", "×", "÷"];

function PenaksiranPanel() {
  const { sfx, toast } = useApp();
  const [a, setA] = useState("347");
  const [b, setB] = useState("152");
  const [op, setOp] = useState<Operator>("+");
  const [place, setPlace] = useState<PlaceKey>("puluhan");
  const [res, setRes] = useState(() => estimate("347", "152", "+", "puluhan"));
  const [err, setErr] = useState("");

  const hitung = () => {
    if (!parseNum(a) || !parseNum(b)) {
      setErr("Masukkan bilangan yang benar terlebih dahulu.");
      toast("Masukkan bilangan yang benar terlebih dahulu.", "bad");
      sfx("wrong");
      return;
    }
    if (op === "÷" && toNumber(b) === 0) {
      setErr("Pembagi tidak boleh nol.");
      toast("Pembagi tidak boleh nol.", "bad");
      sfx("wrong");
      return;
    }
    setErr("");
    setRes(estimate(a, b, op, place));
    sfx("game");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
      <div className="card p-6">
        <div className="step-label mb-3">Kalkulator Penaksiran</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[13px] font-extrabold text-ink-soft">Bilangan 1</label>
            <input className="input" value={a} onChange={(e) => setA(e.target.value)} inputMode="decimal" />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-extrabold text-ink-soft">Bilangan 2</label>
            <input className="input" value={b} onChange={(e) => setB(e.target.value)} inputMode="decimal" />
          </div>
        </div>

        <label className="mt-4 mb-1.5 block text-[13px] font-extrabold text-ink-soft">Operator</label>
        <div className="flex gap-2">
          {OPS.map((o) => (
            <button
              key={o}
              onClick={() => {
                setOp(o);
                sfx("click");
              }}
              className={`h-12 flex-1 rounded-2xl font-display text-[22px] font-extrabold transition ${
                op === o ? "bg-brand text-white shadow-pop" : "border-2 border-line bg-white text-ink hover:border-brand-light"
              }`}
            >
              {o}
            </button>
          ))}
        </div>

        <label className="mt-4 mb-1.5 block text-[13px] font-extrabold text-ink-soft">Pembulatan setiap bilangan</label>
        <div className="flex flex-wrap gap-2">
          {INT_PLACES.map((pl) => (
            <button
              key={pl}
              onClick={() => {
                setPlace(pl);
                sfx("click");
              }}
              className={`rounded-full px-4 py-2 font-display text-[13px] font-bold transition ${
                place === pl ? "bg-brand text-white" : "border-2 border-line bg-white text-ink hover:border-brand-light"
              }`}
            >
              {PLACES[pl].label}
            </button>
          ))}
        </div>

        {err && <div className="mt-3 rounded-xl bg-[#fff1f1] px-4 py-2.5 text-[13px] font-bold text-[#b23b3b]">{err}</div>}

        <Btn className="mt-5 w-full px-7 py-4 text-[16px]" onClick={hitung}>
          <Play size={19} /> HITUNG TAKSIRAN
        </Btn>
      </div>

      <div className="card p-6">
        {res ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border-2 border-line bg-[#f7fbff] px-4 py-3">
              <div className="w-[126px] shrink-0 text-[11px] font-extrabold tracking-[0.12em] text-ink-soft uppercase">
                Bilangan asli
              </div>
              <div className="font-display text-[22px] font-extrabold text-ink">
                {fmtNum(toNumber(res.a), 0)} {res.op} {fmtNum(toNumber(res.b), 0)}
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-[#ffd772] bg-[#fff6db] px-4 py-3">
              <div className="w-[126px] shrink-0 text-[11px] font-extrabold tracking-[0.12em] text-[#8a5a00] uppercase">
                Setelah dibulatkan
              </div>
              <div className="font-display text-[22px] font-extrabold text-ink">
                {res.ra} {res.op} {res.rb}
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border-2 border-[#a7e9c2] bg-[#e8fbef] px-4 py-3">
              <div className="w-[126px] shrink-0 text-[11px] font-extrabold tracking-[0.12em] text-[#136c3a] uppercase">
                Hasil taksiran
              </div>
              <div className="font-display text-[34px] leading-none font-extrabold text-[#136c3a]">≈ {res.value}</div>
            </div>

            <motion.div
              key={res.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-[#f7fbff] p-4"
            >
              <div className="step-label mb-2">Proses Berpikir</div>
              <ol className="space-y-1.5">
                <li className="text-[15px] font-semibold text-ink">
                  1. {fmtNum(toNumber(res.a), 0)} dibulatkan ke {PLACES[place].label.toLowerCase()} menjadi {res.ra}.
                </li>
                <li className="text-[15px] font-semibold text-ink">
                  2. {fmtNum(toNumber(res.b), 0)} dibulatkan ke {PLACES[place].label.toLowerCase()} menjadi {res.rb}.
                </li>
                <li className="text-[15px] font-semibold text-ink">
                  3. Hitung {res.ra} {res.op} {res.rb} = {res.value}.
                </li>
                <li className="text-[15px] font-semibold text-ink">
                  4. Jadi hasil taksirannya ≈ {res.value}. Hasil sebenarnya {res.exact}.
                </li>
              </ol>
            </motion.div>

            <CharacterBubble who="hanif">
              Taksiran membantu kita mengira-ngira hasil dengan cepat. Hasilnya mendekati hasil yang sebenarnya, yaitu{" "}
              {res.exact}.
            </CharacterBubble>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

/* narasi ringkas proses (opsional, tidak memaksa) */
function _speakProcess(r: { input: string; placeLabel: string; detDigit: string; rule: string; result: string }) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const t = `Bilangan ${r.input}. Dibulatkan ke ${r.placeLabel}. Angka penentu ${r.detDigit}. ${r.rule}. Hasilnya ${r.result}.`;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "id-ID";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
    } catch {
    /* abaikan */
  }
}
