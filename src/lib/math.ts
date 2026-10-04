/* ============================================================
   MESIN PEMBULATAN & PENAKSIRAN
   Algoritma nyata berbasis BigInt + digit-shift.
   Aturan: angka penentu SELALU satu tempat di sebelah kanan
   tempat pembulatan. 0-4 -> tetap, 5-9 -> naik satu (5 naik).
   ============================================================ */

export type PlaceKey =
  | "satuan"
  | "puluhan"
  | "ratusan"
  | "ribuan"
  | "persepuluhan"
  | "perseratusan"
  | "perseribuan";

export interface PlaceInfo {
  key: PlaceKey;
  label: string;
  exp: number;
  detLabel: string;
  desc: string;
}

export const PLACES: Record<PlaceKey, PlaceInfo> = {
  satuan: {
    key: "satuan",
    label: "Satuan",
    exp: 0,
    detLabel: "Persepuluhan",
    desc: "angka satuan (bilangan bulat terakhir)",
  },
  puluhan: {
    key: "puluhan",
    label: "Puluhan",
    exp: 1,
    detLabel: "Satuan",
    desc: "satu tempat di kiri satuan",
  },
  ratusan: {
    key: "ratusan",
    label: "Ratusan",
    exp: 2,
    detLabel: "Puluhan",
    desc: "dua tempat di kiri satuan",
  },
  ribuan: {
    key: "ribuan",
    label: "Ribuan",
    exp: 3,
    detLabel: "Ratusan",
    desc: "tiga tempat di kiri satuan",
  },
  persepuluhan: {
    key: "persepuluhan",
    label: "Persepuluhan",
    exp: -1,
    detLabel: "Perseratusan",
    desc: "angka pertama setelah koma",
  },
  perseratusan: {
    key: "perseratusan",
    label: "Perseratusan",
    exp: -2,
    detLabel: "Perseribuan",
    desc: "angka kedua setelah koma",
  },
  perseribuan: {
    key: "perseribuan",
    label: "Perseribuan",
    exp: -3,
    detLabel: "Satu tempat berikutnya",
    desc: "angka ketiga setelah koma",
  },
};

export const INT_PLACES: PlaceKey[] = ["satuan", "puluhan", "ratusan", "ribuan"];
export const DEC_PLACES: PlaceKey[] = ["satuan", "persepuluhan", "perseratusan", "perseribuan"];

/* ---------------- parsing & format ---------------- */

export interface Parsed {
  int: string;
  frac: string;
}

export function parseNum(raw: string): Parsed | null {
  const s = (raw || "").trim().replace(/\s+/g, "");
  if (!s) return null;
  if (!/^[\d.,]+$/.test(s)) return null;
  let int = "";
  let frac = "";
  if (s.includes(",")) {
    const parts = s.split(",");
    if (parts.length !== 2) return null;
    int = parts[0].replace(/\./g, "");
    frac = parts[1];
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    int = s.replace(/\./g, "");
  } else if (s.includes(".")) {
    const parts = s.split(".");
    if (parts.length !== 2) return null;
    int = parts[0];
    frac = parts[1];
  } else {
    int = s;
  }
  if (!/^\d*$/.test(int) || !/^\d*$/.test(frac)) return null;
  if (int === "" && frac === "") return null;
  int = int.replace(/^0+(?=\d)/, "");
  return { int: int === "" ? "0" : int, frac };
}

export function groupThousands(ip: string): string {
  return ip.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function fmtParsed(p: Parsed): string {
  return p.frac ? `${groupThousands(p.int)},${p.frac}` : groupThousands(p.int);
}

export function fmtNum(n: number, decimals = 0): string {
  const neg = n < 0;
  const a = Math.abs(n);
  const s = a.toFixed(decimals);
  const parts = s.split(".");
  const ip = groupThousands(parts[0]);
  return `${neg ? "-" : ""}${ip}${parts[1] ? "," + parts[1] : ""}`;
}

export function toNumber(display: string): number {
  return parseFloat(display.replace(/\./g, "").replace(",", "."));
}

export function normalizeAnswer(s: string): string {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
}

/* ---------------- inti pembulatan ---------------- */

const pow10 = (n: number): bigint => 10n ** BigInt(n);

export interface RoundResult {
  input: string;
  inputInt: string;
  inputFrac: string;
  place: PlaceKey;
  placeLabel: string;
  detLabel: string;
  placeDigit: string;
  detDigit: string;
  detExists: boolean;
  roundUp: boolean;
  carry: boolean;
  rule: string;
  result: string;
  decimals: number;
}

export function roundTo(raw: string, place: PlaceKey): RoundResult | null {
  const p = parseNum(raw);
  if (!p) return null;
  const info = PLACES[place];
  const k = info.exp;
  const f = p.frac.length;
  const all = p.int + p.frac;
  const N = BigInt(all === "" ? "0" : all);
  const shift = f + k;

  let placeDigit = "0";
  const rPlace = k + f;
  const idxPlace = all.length - 1 - rPlace;
  if (rPlace >= 0 && idxPlace >= 0) placeDigit = all[idxPlace];

  let M: bigint;
  let roundUp = false;
  let detExists = true;
  let detDigit = "0";
  let carry = false;

  if (shift <= 0) {
    M = N * pow10(-shift);
    detExists = false;
  } else {
    const d = pow10(shift);
    const q = N / d;
    const r = N % d;
    const dd = Number((r / pow10(shift - 1)) % 10n);
    detDigit = String(dd);
    roundUp = dd >= 5;
    M = roundUp ? q + 1n : q;
    placeDigit = String(Number(q % 10n));
    carry = roundUp && q % 10n === 9n;
  }

  const N2 = shift >= 0 ? M * pow10(shift) : N;

  let s = N2.toString();
  if (s.length < f + 1) s = "0".repeat(f + 1 - s.length) + s;
  const ip = f === 0 ? s : s.slice(0, s.length - f);
  let fp = f === 0 ? "" : s.slice(s.length - f);
  const dp = Math.max(0, -k);
  fp = fp.slice(0, dp).padEnd(dp, "0");

  const result = dp > 0 ? `${groupThousands(ip)},${fp}` : groupThousands(ip);
  const rule = detExists
    ? roundUp
      ? `${detDigit} termasuk 5–9 → naik 1`
      : `${detDigit} termasuk 0–4 → tetap`
    : `tidak ada angka di sebelah kanan → tetap`;

  return {
    input: fmtParsed(p),
    inputInt: p.int,
    inputFrac: p.frac,
    place,
    placeLabel: info.label,
    detLabel: info.detLabel,
    placeDigit,
    detDigit,
    detExists,
    roundUp,
    carry,
    rule,
    result,
    decimals: dp,
  };
}

export function roundValue(raw: string, place: PlaceKey): string {
  const r = roundTo(raw, place);
  return r ? r.result : "";
}

/* ---------------- peran digit ---------------- */

export type DigitRole = "kept" | "det" | "drop" | "comma";

export interface DigitToken {
  ch: string;
  role: DigitRole;
  index: number;
}

export function digitTokens(raw: string, place: PlaceKey): DigitToken[] {
  const p = parseNum(raw);
  if (!p) return [];
  const all = p.int + p.frac;
  const f = p.frac.length;
  const k = PLACES[place].exp;
  const keptIdx = all.length - 1 - (k + f);
  const detIdx = keptIdx + 1;
  const out: DigitToken[] = [];
  for (let i = 0; i < all.length; i++) {
    if (i === all.length - p.frac.length && p.frac.length > 0 && i > 0) {
      out.push({ ch: ",", role: "comma", index: -1 });
    }
    let role: DigitRole = "drop";
    if (keptIdx >= 0 && i <= keptIdx) role = "kept";
    if (i === detIdx) role = "det";
    if (keptIdx < 0) role = i === detIdx ? "det" : "drop";
    out.push({ ch: all[i], role, index: i });
  }
  return out;
}

export function keptIndex(raw: string, place: PlaceKey): number {
  const p = parseNum(raw);
  if (!p) return -1;
  const all = p.int + p.frac;
  return all.length - 1 - (PLACES[place].exp + p.frac.length);
}

export function detIndex(raw: string, place: PlaceKey): number {
  return keptIndex(raw, place) + 1;
}

export function digitAt(raw: string, idx: number): string | null {
  const p = parseNum(raw);
  if (!p) return null;
  const all = p.int + p.frac;
  return idx >= 0 && idx < all.length ? all[idx] : null;
}

/* ---------------- penaksiran ---------------- */

export type Operator = "+" | "-" | "×" | "÷";

export interface EstimateResult {
  a: string;
  b: string;
  op: Operator;
  ra: string;
  rb: string;
  value: string;
  exact: string;
}

export function estimate(a: string, b: string, op: Operator, place: PlaceKey): EstimateResult | null {
  const ra = roundValue(a, place);
  const rb = roundValue(b, place);
  if (!ra || !rb) return null;
  const x = toNumber(ra);
  const y = toNumber(rb);
  let v = 0;
  if (op === "+") v = x + y;
  else if (op === "-") v = x - y;
  else if (op === "×") v = x * y;
  else v = y === 0 ? 0 : x / y;

  const ex = toNumber(a);
  const ey = toNumber(b);
  let e = 0;
  if (op === "+") e = ex + ey;
  else if (op === "-") e = ex - ey;
  else if (op === "×") e = ex * ey;
  else e = ey === 0 ? 0 : ex / ey;

  const dv = Math.round(v * 100) / 100;
  const de = Math.round(e * 100) / 100;
  const decimals = op === "÷" ? (Number.isInteger(dv) ? 0 : 2) : 0;
  const decimalsExact = op === "÷" ? (Number.isInteger(de) ? 0 : 2) : 0;
  return {
    a,
    b,
    op,
    ra,
    rb,
    value: fmtNum(dv, decimals),
    exact: fmtNum(de, decimalsExact),
  };
}

/* ---------------- generator soal ---------------- */

export type Difficulty = "mudah" | "sedang" | "menantang";

export interface Question {
  id: string;
  type: "hasil" | "penentu" | "tempat" | "penaksiran" | "isian";
  prompt: string;
  number: string;
  place: PlaceKey | null;
  options: string[];
  answer: string;
  steps: string[];
  hints: string[];
  explain: string;
}

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function optionSet(correct: string, wrongs: string[]): string[] {
  const seen = new Set<string>([normalizeAnswer(correct)]);
  const out = [correct];
  for (const w of wrongs) {
    if (out.length >= 4) break;
    const n = normalizeAnswer(w);
    if (!seen.has(n) && w !== "") {
      seen.add(n);
      out.push(w);
    }
  }
  let pad = 0;
  while (out.length < 4) {
    pad += 1;
    const cand = fmtNum(toNumber(correct) + pad, correct.includes(",") ? 1 : 0);
    if (!seen.has(normalizeAnswer(cand))) {
      seen.add(normalizeAnswer(cand));
      out.push(cand);
    }
    if (pad > 40) break;
  }
  return shuffle(out);
}

function stepLines(r: RoundResult): string[] {
  return [
    `Bilangan awal: ${r.input}`,
    `Tempat pembulatan: ${r.placeLabel.toLowerCase()}`,
    `Angka yang dipertahankan: ${r.placeDigit} (tempat ${r.placeLabel.toLowerCase()})`,
    `Angka penentu: ${r.detExists ? r.detDigit : "tidak ada"} (tempat ${r.detLabel.toLowerCase()})`,
    `Aturan: ${r.rule}`,
    `Hasil pembulatan: ${r.result}`,
  ];
}

const HINTS = [
  "Perhatikan tempat pembulatannya.",
  "Lihat satu angka tepat di sebelah kanan tempat pembulatan.",
  "Apakah angka penentu termasuk 0–4 atau 5–9?",
  "Ingat, angka 5 sampai 9 dibulatkan ke atas, angka 0 sampai 4 tetap.",
];

export function makeHasilQuestion(numStr: string, place: PlaceKey): Question {
  const r = roundTo(numStr, place)!;
  const step = Math.pow(10, PLACES[place].exp);
  const dec = r.decimals;
  const val = toNumber(r.result);
  const wrongs = [
    fmtNum(val - step, dec),
    fmtNum(val + step, dec),
    fmtNum(val + (r.roundUp ? -step : step) * 2, dec),
  ];
  return {
    id: `h-${numStr}-${place}`,
    type: "hasil",
    prompt: `${r.input} dibulatkan ke ${r.placeLabel.toLowerCase()} terdekat menjadi ...`,
    number: r.input,
    place,
    options: optionSet(r.result, wrongs),
    answer: r.result,
    steps: stepLines(r),
    hints: HINTS,
    explain: `Angka penentunya ${r.detDigit}. Karena ${r.rule.toLowerCase()}, hasilnya ${r.result}.`,
  };
}

export function makePenentuQuestion(numStr: string, place: PlaceKey): Question {
  const r = roundTo(numStr, place)!;
  const wrongs = [r.placeDigit, r.detDigit === "7" ? "5" : "7", r.detDigit === "3" ? "6" : "3"];
  return {
    id: `p-${numStr}-${place}`,
    type: "penentu",
    prompt: `Perhatikan bilangan ${r.input}. Saat dibulatkan ke ${r.placeLabel.toLowerCase()}, angka penentu pembulatannya adalah ...`,
    number: r.input,
    place,
    options: optionSet(r.detDigit, wrongs),
    answer: r.detDigit,
    steps: [
      `Tempat pembulatan: ${r.placeLabel.toLowerCase()} = ${r.placeDigit}`,
      `Angka penentu selalu tepat satu tempat di sebelah kanan.`,
      `Jadi angka penentunya = ${r.detDigit} (tempat ${r.detLabel.toLowerCase()}).`,
    ],
    hints: HINTS,
    explain: `Angka penentu berada tepat di sebelah kanan tempat pembulatan, yaitu ${r.detDigit}.`,
  };
}

export function makeTempatQuestion(numStr: string, place: PlaceKey): Question {
  const r = roundTo(numStr, place)!;
  const wrongs = [r.detDigit, r.detDigit === "8" ? "4" : "8", r.placeDigit === "1" ? "2" : "1"];
  return {
    id: `t-${numStr}-${place}`,
    type: "tempat",
    prompt: `Pada bilangan ${r.input} yang dibulatkan ke ${r.placeLabel.toLowerCase()}, angka yang dipertahankan (tempat pembulatan) adalah ...`,
    number: r.input,
    place,
    options: optionSet(r.placeDigit, wrongs),
    answer: r.placeDigit,
    steps: [
      `Tempat pembulatan = tempat ${r.placeLabel.toLowerCase()}.`,
      `Angka pada tempat itu adalah ${r.placeDigit}.`,
      `Angka penentunya ${r.detDigit}.`,
    ],
    hints: HINTS,
    explain: `Angka yang dipertahankan berada pada tempat ${r.placeLabel.toLowerCase()}, yaitu ${r.placeDigit}.`,
  };
}

export function makePenaksiranQuestion(diff: Difficulty): Question {
  const ops: Operator[] = diff === "mudah" ? ["+", "-"] : diff === "sedang" ? ["+", "-", "×"] : ["+", "-", "×", "÷"];
  const op = pick(ops);
  const place: PlaceKey = diff === "mudah" ? "puluhan" : pick(["puluhan", "ratusan", "ribuan"] as PlaceKey[]);
  const a = String(rnd(diff === "mudah" ? 12 : 120, diff === "menantang" ? 4800 : 980));
  const b = String(rnd(diff === "mudah" ? 12 : 120, op === "×" ? 9 : diff === "menantang" ? 4800 : 980));
  const est = estimate(a, b, op, place)!;
  const val = toNumber(est.value);
  const step = Math.pow(10, PLACES[place].exp);
  const wrongs = [fmtNum(val - step, 0), fmtNum(val + step, 0), fmtNum(val + step * 2, 0)];
  return {
    id: `e-${a}-${b}-${op}`,
    type: "penaksiran",
    prompt: `Taksirkan hasil dari ${groupThousands(a)} ${op} ${groupThousands(b)}. Bulatkan setiap bilangan ke ${PLACES[place].label.toLowerCase()} terdekat.`,
    number: `${groupThousands(a)} ${op} ${groupThousands(b)}`,
    place,
    options: optionSet(est.value, wrongs),
    answer: est.value,
    steps: [
      `${groupThousands(a)} ≈ ${est.ra}`,
      `${groupThousands(b)} ≈ ${est.rb}`,
      `${est.ra} ${op} ${est.rb} = ${est.value}`,
      `Jadi hasil taksirannya ≈ ${est.value}`,
    ],
    hints: [
      "Bulatkan dulu setiap bilangan ke tempat yang diminta.",
      "Setelah dibulatkan, lakukan perhitungannya.",
      "Angka penentu 0–4 tetap, 5–9 naik satu.",
      "Periksa lagi pembulatan kedua bilangan sebelum menjumlah.",
    ],
    explain: `Setelah dibulatkan menjadi ${est.ra} ${op} ${est.rb}, hasilnya ≈ ${est.value}.`,
  };
}

export function makeQuestion(diff: Difficulty, forceKind?: Question["type"]): Question {
  const kind =
    forceKind ??
    (diff === "mudah"
      ? pick<Question["type"]>(["hasil", "hasil", "penentu", "tempat"])
      : diff === "sedang"
        ? pick<Question["type"]>(["hasil", "hasil", "penentu", "tempat", "penaksiran"])
        : pick<Question["type"]>(["hasil", "penentu", "tempat", "penaksiran", "penaksiran"]));

  if (kind === "penaksiran") return makePenaksiranQuestion(diff);

  let numStr = "";
  let place: PlaceKey = "puluhan";
  if (diff === "mudah") {
    if (Math.random() < 0.35) {
      numStr = `${rnd(2, 19)},${rnd(1, 9)}`;
      place = "satuan";
    } else {
      numStr = String(rnd(12, 99));
      place = Math.random() < 0.5 ? "puluhan" : "ratusan";
    }
  } else if (diff === "sedang") {
    const v = Math.random();
    if (v < 0.3) {
      numStr = String(rnd(120, 9999));
      place = pick(["ratusan", "ribuan"] as PlaceKey[]);
    } else if (v < 0.75) {
      numStr = `${rnd(1, 19)},${rnd(10, 99)}`;
      place = "persepuluhan";
    } else {
      numStr = `${rnd(1, 19)},${rnd(100, 999)}`;
      place = "perseratusan";
    }
  } else {
    const v = Math.random();
    if (v < 0.3) {
      numStr = `${rnd(2, 19)},${rnd(100, 9999)}`;
      place = pick(["perseratusan", "perseribuan"] as PlaceKey[]);
    } else if (v < 0.55) {
      numStr = `${rnd(2, 29)},${rnd(1, 9)}${rnd(5, 9)}`;
      place = pick(["satuan", "persepuluhan"] as PlaceKey[]);
    } else {
      numStr = String(rnd(1200, 98000));
      place = pick(["ratusan", "ribuan"] as PlaceKey[]);
    }
  }

  if (kind === "penentu") return makePenentuQuestion(numStr, place);
  if (kind === "tempat") return makeTempatQuestion(numStr, place);
  return makeHasilQuestion(numStr, place);
}

export function questionBank(diff: Difficulty, count: number): Question[] {
  const out: Question[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < count && guard < count * 40) {
    guard++;
    const q = makeQuestion(diff);
    const key = `${q.type}-${q.number}-${q.place}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ ...q, id: `${q.id}-${out.length}` });
  }
  while (out.length < count) {
    const q = makeQuestion(diff);
    out.push({ ...q, id: `${q.id}-${out.length}` });
  }
  return out;
}

export function checkAnswer(user: string, correct: string): boolean {
  return normalizeAnswer(user) === normalizeAnswer(correct);
}

/* ---------------- garis bilangan ---------------- */

export function numberLineBounds(raw: string, place: PlaceKey): { low: number; high: number; step: number; value: number } {
  const r = roundTo(raw, place)!;
  const step = Math.pow(10, PLACES[place].exp);
  const low = toNumber(r.result);
  return { low, high: low + step, step, value: toNumber(r.input) };
}
