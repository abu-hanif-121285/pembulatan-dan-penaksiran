import type { Operator, PlaceKey, Question } from "./math";
import { makeHasilQuestion, makePenaksiranQuestion } from "./math";

export interface Level {
  id: string;
  no: number;
  title: string;
  subtitle: string;
  kind: "konsep" | "bulat" | "desimal" | "penaksiran" | "aplikasi";
  kenali: { lead: string; bullets: string[] };
  perhatikan: {
    number: string;
    place: PlaceKey | null;
    caption: string;
    est?: { a: string; b: string; op: Operator; place: PlaceKey };
  };
  coba: { mode: "det" | "pilih"; text: string; options?: string[]; answer: string };
  pahami: string[];
  tantangan: Question;
  narration: string;
}

const H = (n: string, place: PlaceKey) => makeHasilQuestion(n, place);

export const LEVELS: Level[] = [
  {
    id: "l1",
    no: 1,
    title: "Apa Itu Pembulatan?",
    subtitle: "Mengenal bilangan yang lebih sederhana",
    kind: "konsep",
    kenali: {
      lead: "Pembulatan adalah mengubah bilangan menjadi bilangan yang lebih sederhana, tetapi tetap dekat dengan nilai sebenarnya.",
      bullets: [
        "Pembulatan dipakai agar angka mudah diingat dan dihitung.",
        "Hasil pembulatan disebut bilangan pendekatan.",
        "Tanda pendekatan ditulis dengan tanda ≈ (kira-kira).",
      ],
    },
    perhatikan: {
      number: "47",
      place: "puluhan",
      caption: "47 berada di antara 40 dan 50. Karena 47 lebih dekat ke 50, maka 47 ≈ 50.",
    },
    coba: {
      mode: "pilih",
      text: "Manakah tanda yang berarti 'kira-kira sama dengan'?",
      options: ["=", "≈", "≠", ">"],
      answer: "≈",
    },
    pahami: [
      "Pembulatan membuat bilangan menjadi lebih sederhana.",
      "Hasil pembulatan selalu mendekati nilai aslinya.",
      "Kita menulis hasil pembulatan dengan tanda ≈.",
    ],
    tantangan: H("47", "puluhan"),
    narration:
      "Yuk, kita belajar membulatkan bilangan. Pembulatan membuat bilangan menjadi lebih sederhana, tetapi tetap dekat dengan nilai aslinya. Tanda pendekatan ditulis dengan tanda kira-kira.",
  },
  {
    id: "l2",
    no: 2,
    title: "Pembulatan ke Satuan",
    subtitle: "Melihat angka persepuluhan sebagai penentu",
    kind: "desimal",
    kenali: {
      lead: "Membulatkan ke satuan berarti kita hanya mengambil bilangan bulatnya. Yang dilihat adalah angka di sebelah kanan satuan, yaitu angka persepuluhan.",
      bullets: [
        "Tempat pembulatan = satuan.",
        "Angka penentu = angka persepuluhan (satu tempat di sebelah kanan).",
        "0–4 → tetap, 5–9 → naik satu.",
      ],
    },
    perhatikan: {
      number: "12,7",
      place: "satuan",
      caption: "Angka satuan 12. Angka penentu 7. Karena 7 termasuk 5–9, satuan naik 1 sehingga 12,7 ≈ 13.",
    },
    coba: {
      mode: "det",
      text: "Klik angka penentu pada bilangan 12,7 saat dibulatkan ke satuan.",
      answer: "7",
    },
    pahami: ["8,4 ≈ 8", "8,5 ≈ 9", "15,2 ≈ 15", "15,8 ≈ 16"],
    tantangan: H("15,8", "satuan"),
    narration:
      "Membulatkan ke satuan berarti kita mengambil bilangan bulatnya. Lihat satu angka di sebelah kanan satuan, yaitu angka persepuluhan. Jika angka penentu nol sampai empat, angka tetap. Jika lima sampai sembilan, angka satuan bertambah satu.",
  },
  {
    id: "l3",
    no: 3,
    title: "Pembulatan ke Puluhan",
    subtitle: "Angka satuan menjadi angka penentu",
    kind: "bulat",
    kenali: {
      lead: "Saat membulatkan ke puluhan, angka puluhan yang dipertahankan. Angka penentunya adalah angka satuan.",
      bullets: [
        "Tempat pembulatan = puluhan.",
        "Angka penentu = satuan (tepat satu tempat di sebelah kanan).",
        "Semua angka di sebelah kanan berubah menjadi 0.",
      ],
    },
    perhatikan: {
      number: "47",
      place: "puluhan",
      caption: "Puluhan = 4, satuan = 7. Karena 7 termasuk 5–9, maka 47 ≈ 50.",
    },
    coba: { mode: "det", text: "Klik angka penentu pada 47 saat dibulatkan ke puluhan.", answer: "7" },
    pahami: ["42 ≈ 40", "47 ≈ 50", "53 ≈ 50", "58 ≈ 60"],
    tantangan: H("58", "puluhan"),
    narration:
      "Sekarang kita membulatkan ke puluhan. Angka puluhan yang dipertahankan. Angka satuan menjadi angka penentu. Lihat satu tempat di sebelah kanan.",
  },
  {
    id: "l4",
    no: 4,
    title: "Pembulatan ke Ratusan",
    subtitle: "Angka puluhan menjadi angka penentu",
    kind: "bulat",
    kenali: {
      lead: "Membulatkan ke ratusan berarti angka ratusan yang dipertahankan. Angka penentunya adalah angka puluhan.",
      bullets: [
        "Tempat pembulatan = ratusan.",
        "Angka penentu = puluhan.",
        "Satuan dan angka lain di sebelah kanan menjadi 0.",
      ],
    },
    perhatikan: {
      number: "276",
      place: "ratusan",
      caption: "Ratusan = 2, puluhan = 7. Karena 7 termasuk 5–9, maka 276 ≈ 300.",
    },
    coba: { mode: "det", text: "Klik angka penentu pada 276 saat dibulatkan ke ratusan.", answer: "7" },
    pahami: ["243 ≈ 200", "276 ≈ 300", "421 ≈ 400", "475 ≈ 500"],
    tantangan: H("475", "ratusan"),
    narration:
      "Membulatkan ke ratusan. Angka ratusan yang dipertahankan. Angka puluhan menjadi angka penentu. Jika puluhannya empat, hasilnya tetap. Jika lima ke atas, ratusan bertambah satu.",
  },
  {
    id: "l5",
    no: 5,
    title: "Pembulatan ke Ribuan",
    subtitle: "Angka ratusan menjadi angka penentu",
    kind: "bulat",
    kenali: {
      lead: "Membulatkan ke ribuan berarti angka ribuan yang dipertahankan. Angka penentunya adalah angka ratusan.",
      bullets: [
        "Tempat pembulatan = ribuan.",
        "Angka penentu = ratusan.",
        "Puluhan dan satuan berubah menjadi 0.",
      ],
    },
    perhatikan: {
      number: "1678",
      place: "ribuan",
      caption: "Ribuan = 1, ratusan = 6. Karena 6 termasuk 5–9, maka 1.678 ≈ 2.000.",
    },
    coba: { mode: "det", text: "Klik angka penentu pada 1.678 saat dibulatkan ke ribuan.", answer: "6" },
    pahami: ["1.234 ≈ 1.000", "1.678 ≈ 2.000", "3.421 ≈ 3.000", "3.789 ≈ 4.000"],
    tantangan: H("3789", "ribuan"),
    narration:
      "Membulatkan ke ribuan. Angka ribuan yang dipertahankan. Angka ratusan menjadi angka penentu. Perhatikan angka ratusannya dengan teliti.",
  },
  {
    id: "l6",
    no: 6,
    title: "Pembulatan Bilangan Desimal",
    subtitle: "Mengenal nilai tempat setelah koma",
    kind: "desimal",
    kenali: {
      lead: "Koma memisahkan bagian bilangan bulat dan bagian desimal. Setiap angka setelah koma punya nama tempat sendiri.",
      bullets: [
        "12,347 → 1 = puluhan, 2 = satuan.",
        "3 = persepuluhan, 4 = perseratusan, 7 = perseribuan.",
        "Semakin ke kanan, nilainya semakin kecil.",
      ],
    },
    perhatikan: {
      number: "12,347",
      place: "perseratusan",
      caption: "Perhatikan nama tempat setiap angka pada 12,347. Angka penentu selalu tepat satu tempat di sebelah kanan tempat pembulatan.",
    },
    coba: {
      mode: "pilih",
      text: "Pada bilangan 12,347, angka yang berada pada tempat persepuluhan adalah ...",
      options: ["1", "2", "3", "4"],
      answer: "3",
    },
    pahami: [
      "Angka pertama setelah koma = persepuluhan.",
      "Angka kedua setelah koma = perseratusan.",
      "Angka ketiga setelah koma = perseribuan.",
    ],
    tantangan: H("12,347", "perseratusan"),
    narration:
      "Sekarang kita mengenal bilangan desimal. Koma memisahkan bilangan bulat dan bilangan desimal. Angka pertama setelah koma disebut persepuluhan, angka kedua disebut perseratusan, dan angka ketiga disebut perseribuan.",
  },
  {
    id: "l7",
    no: 7,
    title: "Pembulatan Desimal ke Satuan",
    subtitle: "Tentukan, lihat, putuskan",
    kind: "desimal",
    kenali: {
      lead: "Tiga langkah pembulatan desimal: Tentukan tempat pembulatan, Lihat angka penentu, Putuskan hasilnya.",
      bullets: [
        "Langkah 1 — TENTUKAN tempat pembulatan.",
        "Langkah 2 — LIHAT satu angka di sebelah kanan.",
        "Langkah 3 — PUTUSKAN: 0–4 tetap, 5–9 naik satu.",
      ],
    },
    perhatikan: {
      number: "12,3",
      place: "satuan",
      caption: "Tempat pembulatan = satuan. Angka penentu = 3. Karena 3 termasuk 0–4, maka 12,3 ≈ 12.",
    },
    coba: { mode: "det", text: "Klik angka penentu pada 12,3 saat dibulatkan ke satuan.", answer: "3" },
    pahami: ["12,3 ≈ 12", "12,7 ≈ 13", "8,4 ≈ 8", "8,5 ≈ 9"],
    tantangan: H("9,8", "satuan"),
    narration:
      "Ingat tiga langkah pembulatan desimal. Tentukan, lihat, putuskan. Tentukan tempat pembulatan, lihat satu angka di sebelah kanan, lalu putuskan apakah tetap atau naik satu.",
  },
  {
    id: "l8",
    no: 8,
    title: "Pembulatan Desimal ke Persepuluhan",
    subtitle: "Angka perseratusan menjadi penentu",
    kind: "desimal",
    kenali: {
      lead: "Angka persepuluhan adalah angka pertama setelah koma. Angka penentunya adalah angka perseratusan.",
      bullets: [
        "Tempat pembulatan = persepuluhan (angka pertama setelah koma).",
        "Angka penentu = perseratusan.",
        "Jika angka penentu 5, hasil selalu dibulatkan ke atas.",
      ],
    },
    perhatikan: {
      number: "7,386",
      place: "persepuluhan",
      caption: "Persepuluhan = 3, angka penentu = 8. Karena 8 termasuk 5–9, maka 3 naik menjadi 4 sehingga 7,386 ≈ 7,4.",
    },
    coba: { mode: "det", text: "Klik angka penentu pada 7,386 saat dibulatkan ke persepuluhan.", answer: "8" },
    pahami: ["3,24 ≈ 3,2", "3,27 ≈ 3,3", "5,13 ≈ 5,1", "7,48 ≈ 7,5"],
    tantangan: H("7,386", "persepuluhan"),
    narration:
      "Angka persepuluhan adalah angka pertama setelah koma. Lihat satu tempat di sebelah kanannya, yaitu angka perseratusan. Angka itulah angka penentu pembulatan.",
  },
  {
    id: "l9",
    no: 9,
    title: "Pembulatan Desimal ke Perseratusan",
    subtitle: "Angka perseribuan menjadi penentu",
    kind: "desimal",
    kenali: {
      lead: "Angka perseratusan adalah angka kedua setelah koma. Angka penentunya adalah angka perseribuan, yaitu angka ketiga setelah koma.",
      bullets: [
        "Tempat pembulatan = perseratusan.",
        "Angka penentu = perseribuan.",
        "Hasil pembulatan ditulis sampai dua angka desimal.",
      ],
    },
    perhatikan: {
      number: "6,238",
      place: "perseratusan",
      caption: "Perseratusan = 3, angka penentu = 8. Karena 8 termasuk 5–9, maka 3 naik menjadi 4 sehingga 6,238 ≈ 6,24.",
    },
    coba: { mode: "det", text: "Klik angka penentu pada 6,238 saat dibulatkan ke perseratusan.", answer: "8" },
    pahami: ["6,234 ≈ 6,23", "12,341 ≈ 12,34", "12,347 ≈ 12,35", "8,721 ≈ 8,72"],
    tantangan: H("8,725", "perseratusan"),
    narration:
      "Angka perseratusan adalah angka kedua setelah koma. Angka penentunya ada di sebelah kanannya, yaitu angka perseribuan. Hasil pembulatannya ditulis sampai dua angka desimal.",
  },
  {
    id: "l10",
    no: 10,
    title: "Pembulatan Desimal ke Perseribuan",
    subtitle: "Menyisakan tiga angka desimal",
    kind: "desimal",
    kenali: {
      lead: "Angka perseribuan adalah angka ketiga setelah koma. Angka penentunya berada tepat satu tempat di sebelah kanannya.",
      bullets: [
        "Tempat pembulatan = perseribuan.",
        "Angka penentu = satu tempat berikutnya (angka keempat setelah koma).",
        "Hasil pembulatan ditulis sampai tiga angka desimal.",
      ],
    },
    perhatikan: {
      number: "4,1238",
      place: "perseribuan",
      caption: "Perseribuan = 3, angka penentu = 8. Karena 8 termasuk 5–9, maka 4,1238 ≈ 4,124.",
    },
    coba: { mode: "det", text: "Klik angka penentu pada 4,1238 saat dibulatkan ke perseribuan.", answer: "8" },
    pahami: ["4,1234 ≈ 4,123", "4,1238 ≈ 4,124", "Angka 5 selalu dibulatkan ke atas", "4,125 ≈ 4,13 bila dibulatkan ke perseratusan"],
    tantangan: H("4,125", "perseratusan"),
    narration:
      "Angka perseribuan adalah angka ketiga setelah koma. Angka penentunya berada tepat satu tempat di sebelah kanan angka perseribuan. Hasilnya ditulis sampai tiga angka desimal.",
  },
  {
    id: "l11",
    no: 11,
    title: "Apa Itu Penaksiran?",
    subtitle: "Memperkirakan hasil perhitungan",
    kind: "penaksiran",
    kenali: {
      lead: "Penaksiran adalah memperkirakan hasil suatu perhitungan dengan memakai bilangan yang telah dibulatkan.",
      bullets: [
        "Pembulatan membuat perhitungan menjadi mudah.",
        "Hasil taksiran bukan hasil tepat, melainkan perkiraan.",
        "Taksiran dipakai untuk memperkirakan uang, waktu, dan jarak.",
      ],
    },
    perhatikan: {
      number: "48.000 + 31.000",
      place: "ribuan",
      caption: "Hanif punya Rp48.000 dan Arsya punya Rp31.000. Dibulatkan ke ribuan: 48.000 ≈ 48.000 → 50.000 dan 31.000 ≈ 30.000. Jumlahnya ≈ Rp80.000.",
      est: { a: "48000", b: "31000", op: "+", place: "ribuan" },
    },
    coba: {
      mode: "pilih",
      text: "Manakah pernyataan yang benar tentang hasil taksiran?",
      options: [
        "Hasil taksiran sama dengan hasil tepat.",
        "Hasil taksiran adalah perkiraan yang mendekati hasil tepat.",
        "Hasil taksiran selalu lebih besar.",
        "Hasil taksiran tidak memakai pembulatan.",
      ],
      answer: "Hasil taksiran adalah perkiraan yang mendekati hasil tepat.",
    },
    pahami: [
      "Penaksiran memakai bilangan yang sudah dibulatkan.",
      "Hasil taksiran ditulis dengan tanda ≈.",
      "Taksiran membantu menghitung dengan cepat.",
    ],
    tantangan: makePenaksiranQuestion("mudah"),
    narration:
      "Penaksiran adalah memperkirakan hasil suatu perhitungan dengan memakai bilangan yang telah dibulatkan. Hasil taksiran mendekati hasil yang sebenarnya.",
  },
  {
    id: "l12",
    no: 12,
    title: "Penaksiran Penjumlahan",
    subtitle: "Bulatkan kedua bilangan, lalu jumlahkan",
    kind: "penaksiran",
    kenali: {
      lead: "Untuk menaksirkan hasil penjumlahan, bulatkan kedua bilangan lebih dahulu, kemudian jumlahkan hasil pembulatannya.",
      bullets: ["Bulatkan bilangan pertama.", "Bulatkan bilangan kedua.", "Jumlahkan kedua hasil pembulatan."],
    },
    perhatikan: {
      number: "47 + 32",
      place: "puluhan",
      caption: "47 ≈ 50 dan 32 ≈ 30. Kemudian 50 + 30 = 80. Jadi 47 + 32 ≈ 80.",
      est: { a: "47", b: "32", op: "+", place: "puluhan" },
    },
    coba: {
      mode: "pilih",
      text: "Berapa taksiran dari 47 + 32 setelah dibulatkan ke puluhan?",
      options: ["70", "80", "90", "100"],
      answer: "80",
    },
    pahami: ["47 ≈ 50", "32 ≈ 30", "50 + 30 = 80", "47 + 32 ≈ 80"],
    tantangan: makePenaksiranQuestion("mudah"),
    narration:
      "Untuk menaksirkan hasil penjumlahan, kita membulatkan kedua bilangan terlebih dahulu. Setelah itu hasil pembulatannya dijumlahkan.",
  },
  {
    id: "l13",
    no: 13,
    title: "Penaksiran Pengurangan",
    subtitle: "Bulatkan kedua bilangan, lalu kurangkan",
    kind: "penaksiran",
    kenali: {
      lead: "Untuk menaksirkan hasil pengurangan, bulatkan kedua bilangan lebih dahulu, kemudian kurangkan hasil pembulatannya.",
      bullets: ["Bulatkan bilangan yang dikurangi.", "Bulatkan bilangan pengurang.", "Kurangkan keduanya."],
    },
    perhatikan: {
      number: "78 − 31",
      place: "puluhan",
      caption: "78 ≈ 80 dan 31 ≈ 30. Kemudian 80 − 30 = 50. Jadi 78 − 31 ≈ 50.",
      est: { a: "78", b: "31", op: "-", place: "puluhan" },
    },
    coba: {
      mode: "pilih",
      text: "Berapa taksiran dari 78 − 31 setelah dibulatkan ke puluhan?",
      options: ["40", "50", "60", "70"],
      answer: "50",
    },
    pahami: ["78 ≈ 80", "31 ≈ 30", "80 − 30 = 50", "78 − 31 ≈ 50"],
    tantangan: makePenaksiranQuestion("mudah"),
    narration:
      "Untuk menaksirkan hasil pengurangan, bulatkan kedua bilangan terlebih dahulu. Setelah itu kurangkan kedua hasil pembulatan.",
  },
  {
    id: "l14",
    no: 14,
    title: "Penaksiran Perkalian",
    subtitle: "Perkiraan hasil kali yang cepat",
    kind: "penaksiran",
    kenali: {
      lead: "Pembulatan membantu kita mengira-ngira hasil perkalian dengan cepat, tanpa menghitung detail.",
      bullets: ["Bulatkan bilangan yang sulit lebih dahulu.", "Kalikan bilangan hasil pembulatan.", "Hasilnya adalah perkiraan."],
    },
    perhatikan: {
      number: "19 × 6",
      place: "puluhan",
      caption: "19 ≈ 20. Kemudian 20 × 6 = 120. Jadi 19 × 6 ≈ 120 (hasil tepatnya 114).",
      est: { a: "19", b: "6", op: "×", place: "puluhan" },
    },
    coba: {
      mode: "pilih",
      text: "Berapa taksiran dari 19 × 6 setelah 19 dibulatkan ke puluhan?",
      options: ["110", "114", "120", "130"],
      answer: "120",
    },
    pahami: ["19 ≈ 20", "20 × 6 = 120", "19 × 6 ≈ 120", "Taksiran mendekati hasil tepat, yaitu 114"],
    tantangan: makePenaksiranQuestion("sedang"),
    narration:
      "Penaksiran perkalian memakai bilangan yang sudah dibulatkan. Misalnya sembilan belas dibulatkan menjadi dua puluh, lalu dikalikan enam, hasilnya seratus dua puluh.",
  },
  {
    id: "l15",
    no: 15,
    title: "Penaksiran Pembagian",
    subtitle: "Perkiraan hasil bagi yang mudah",
    kind: "penaksiran",
    kenali: {
      lead: "Pilih bilangan pembulatan yang membuat pembagian menjadi mudah, misalnya 100 dibagi 20.",
      bullets: [
        "Bulatkan bilangan pembilang dan penyebut.",
        "Pilih pembulatan yang mudah dibagi.",
        "Hasil bagi adalah perkiraan.",
      ],
    },
    perhatikan: {
      number: "96 ÷ 21",
      place: "puluhan",
      caption: "96 ≈ 100 dan 21 ≈ 20. Kemudian 100 ÷ 20 = 5. Jadi 96 ÷ 21 ≈ 5.",
      est: { a: "96", b: "21", op: "÷", place: "puluhan" },
    },
    coba: {
      mode: "pilih",
      text: "Berapa taksiran dari 96 ÷ 21 setelah dibulatkan ke puluhan?",
      options: ["3", "4", "5", "6"],
      answer: "5",
    },
    pahami: ["96 ≈ 100", "21 ≈ 20", "100 ÷ 20 = 5", "96 ÷ 21 ≈ 5"],
    tantangan: makePenaksiranQuestion("menantang"),
    narration:
      "Penaksiran pembagian menjadi mudah jika kita membulatkan bilangan menjadi bilangan yang mudah dibagi. Misalnya seratus dibagi dua puluh hasilnya lima.",
  },
  {
    id: "l16",
    no: 16,
    title: "Penerapan dalam Kehidupan Sehari-hari",
    subtitle: "Pembulatan di sekitar kita",
    kind: "aplikasi",
    kenali: {
      lead: "Setiap hari kita memakai pembulatan dan penaksiran: memperkirakan belanja, jarak, waktu, dan jumlah orang.",
      bullets: [
        "Memperkirakan uang belanja di pasar.",
        "Memperkirakan jumlah siswa yang hadir.",
        "Memperkirakan jarak dan waktu perjalanan.",
      ],
    },
    perhatikan: {
      number: "Rp4.750 + Rp3.280",
      place: "ratusan",
      caption: "Harga buku Rp4.750 ≈ Rp5.000 dan pensil Rp3.280 ≈ Rp3.000. Perkiraan belanja ≈ Rp8.000.",
      est: { a: "4750", b: "3280", op: "+", place: "ratusan" },
    },
    coba: {
      mode: "pilih",
      text: "Ibu membeli beras Rp58.400 dan minyak Rp26.700. Perkiraan belanja Ibu adalah ...",
      options: ["Rp70.000", "Rp80.000", "Rp90.000", "Rp100.000"],
      answer: "Rp90.000",
    },
    pahami: [
      "Pembulatan membuat perkiraan menjadi cepat.",
      "Hasil taksiran berguna untuk menyiapkan uang.",
      "Selalu cek angka penentu sebelum membulatkan.",
    ],
    tantangan: makePenaksiranQuestion("menantang"),
    narration:
      "Pembulatan dan penaksiran dipakai setiap hari. Saat berbelanja, kita memperkirakan jumlah uang yang harus dibawa. Saat bepergian, kita memperkirakan jarak dan waktu.",
  },
];
