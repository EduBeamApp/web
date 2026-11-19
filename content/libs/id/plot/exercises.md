---
title: Soal latihan dan ujian
description: "Soal analisis struktur yang berbeda untuk setiap mahasiswa dari sebuah seed, dengan kunci jawaban yang selalu benar: di web, dicetak, atau sebagai SVG."
order: 5
group: Penerapan
source: site
---

# Soal latihan dan ujian {#exercises-and-tests}

Tulis sebuah struktur satu kali sebagai fungsi dari seed (nilai awal pembangkit bilangan acak), dan Anda mendapatkan soal untuk setiap mahasiswa, setiap minggu, masing-masing dengan kunci jawaban yang selalu benar: @edubeam/fem menghitungnya, dan @edubeam/plot menggambar soal dan kuncinya dari model yang sama.

Klik **Soal baru** di bawah. Setiap klik memakai seed baru: soal dibangkitkan, dihitung dan digambar di browser Anda.

::exercise-generator
::

Demo ini menggambar soal-soal dari dua halaman di situs ini, yang keduanya dibangun dari bagian-bagian yang dijelaskan di sini. Di halaman [Latihan soal](/id/practice), mahasiswa memasukkan reaksi dan momen atau gaya batang terbesar, lalu jawabannya langsung diperiksa. [Pembuat soal ujian](/id/exam) mencetak paket soal yang berbeda untuk setiap mahasiswa beserta kunci jawabannya, dan menyimpan gambar sebagai file SVG dan jawaban sebagai CSV. Cobalah keduanya sebelum menulis versi Anda sendiri.

## Cara kerjanya {#how-it-works}

1. **Seed memilih angka-angkanya.** Pembangkit bilangan acak dengan seed menghasilkan soal yang sama untuk seed yang sama, sehingga dari seed yang tercetak di lembar soal, kuncinya selalu dapat ditemukan kembali.
2. **Solver menghitung kuncinya.** @edubeam/fem menghitung setiap struktur, sehingga reaksi dan momen berasal dari solver, bukan dari rumus yang mungkin keliru Anda tulis.
3. **Gambar menyajikan keduanya.** Lembar soal menampilkan struktur dengan label joint, dimensi, dan nama reaksi yang dicari; kunci jawaban memberikan nilai reaksi dan menambahkan diagramnya.

Beberapa file pendek membawa Anda dari sini sampai ke ujian tercetak: [pembangkit soal](#the-generator), [sebuah komponen](#the-exercise-in-a-page) untuk halaman web, dan [sebuah skrip](#print-a-test) yang mencetak lembar ujian atau [menulis gambar](#figures-for-latex-and-word) untuk LaTeX dan Word. Salin file-file itu ke proyek yang sudah [memasang kedua pustaka](/id/plot/getting-started#install); skripnya dijalankan dengan `node` mulai versi 22.18, atau dengan `npx tsx` pada versi yang lebih lama.

## Pembangkit soal {#the-generator}

Satu modul, `exercise.ts`, mengubah seed menjadi soal: balok di atas tumpuan sendi dan rol, separuh dari kasusnya dengan overstek yang memikul beban terpusat di ujungnya. Kedua variannya statis tertentu, sehingga setiap seed dapat diselesaikan secara manual maupun dengan solver.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** Struktur terhitung sebagai data biasa: menggambar soal sekaligus kuncinya */
  readonly model: PlotModel
  /** Reaksi tumpuan ke atas, N, dan momen lentur ekstrem, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: pembangkit kecil dengan seed, sehingga sebuah seed selamanya menunjuk soal yang sama */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const makeExercise = (seed: number): Exercise => {
  const r = random(seed)
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

  // Satu bentang di atas sendi dan rol, separuh kasusnya dengan overstek: statis tertentu, jadi selalu dapat dihitung
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m overstek
  const q = int(4, 12) // kN/m pada bentang
  const F = int(2, 6) * 5 // kN di ujung, atau sejauh `a` dari A jika tanpa overstek
  const a = int(1, L - 1) // m

  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  if (c > 0) {
    domain.createNode('C', [L + c, 0, 0])
    domain.createBeam2D(2, ['B', 'C'], 1, 1)
    lc.createNodalLoad('C', { [DofID.Dz]: F * 1e3 })
  } else {
    lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  }
  solver.solve()

  const statement =
    c > 0
      ? `Span L = ${L} m with an overhang c = ${c} m. q = ${q} kN/m on the span, F = ${F} kN at the tip C.`
      : `Span L = ${L} m. q = ${q} kN/m over the span, F = ${F} kN at ${a} m from A.`

  // Kunci dari model terhitung: reaksi (z mengarah ke bawah, jadi ke atas bertanda minus), ekstrem M yang eksak
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` membaca struktur yang sudah dihitung menjadi [model gambar](/id/plot/model): data biasa berisi reaksi dan hasil setiap batang dalam bentuk polinomial eksak, sehingga `extremes` menemukan momen terbesar tanpa pengambilan sampel. Soal hanya menyimpan model itu; solver tidak diperlukan lagi.

Seed 5 menghasilkan *“Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.”* Kuncinya: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm di atas tumpuan, dan $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm di bentang, di titik dengan gaya geser nol. Solver memberikan hasil yang sama sampai digit terakhir.

## Di halaman web {#the-exercise-in-a-page}

Sebuah komponen, `ExerciseCard.vue`, menggambar soalnya, atau dengan `answers` kuncinya:

```vue [ExerciseCard.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { formatQuantity, KN_UNITS, StructurePlot, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise'

const props = defineProps<{ seed: number; answers?: boolean }>()
const exercise = computed(() => makeExercise(props.seed))

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const twoDecimals = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const kN = (si: number) => formatQuantity(si, KN_UNITS.force, twoDecimals)
const kNm = (si: number) => formatQuantity(si, KN_UNITS.moment, twoDecimals)
</script>

<template>
  <article>
    <h3>Exercise {{ seed }}</h3>
    <p>{{ exercise.statement }} Find the reactions and draw the bending moment diagram.</p>
    <StructurePlot
      :model="exercise.model"
      :layers="answers ? key : sheet"
      :reserve="[...sheet, ...key]"
      :reaction-labels="answers ? 'values' : 'names'"
      :reserve-reaction-labels="['names', 'values']"
    />
    <p v-if="answers">
      R<sub>A</sub> = {{ kN(exercise.key.RA) }}, R<sub>B</sub> = {{ kN(exercise.key.RB) }},
      M from {{ kNm(exercise.key.mMin) }} to {{ kNm(exercise.key.mMax) }}
    </p>
  </article>
</template>
```

```vue
<ExerciseCard :seed="5" />
<ExerciseCard :seed="5" answers />
```

Kartu kedua diakhiri dengan *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. `formatQuantity` menuliskan satuan dan tanda minus sungguhan, sama seperti gambar.

Di lembar soal, `reaction-labels="names"` menggambar reaksi sebagai besaran yang dicari: panah untuk setiap arah yang ditahan tumpuan, menunjuk ke arah positifnya (ke kanan, ke atas, berlawanan arah jarum jam), diberi nama *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*, bukan nilai. Dengan begitu, tanda setiap jawaban sudah ditetapkan pada gambar: reaksi yang bekerja ke arah sebaliknya bernilai negatif. Kunci jawaban menuliskan nilainya.

`reserve` menata lapisan kedua tampilan sejak awal, sehingga saat `answers` diaktifkan, misalnya dengan tombol *Tampilkan penyelesaian* untuk belajar mandiri, diagram muncul perlahan di tempatnya ([Gambar yang tersusun bertahap](/id/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` melakukan hal yang sama untuk reaksi, sehingga balok tetap di tempatnya sementara nama-nama reaksi berganti menjadi nilai: lihat [Reaksi sebagai besaran yang dicari](/id/plot/structure-plot#reactions-as-unknowns).

## Ujian tercetak {#print-a-test}

Untuk ujian tertulis, skrip Node `print-test.ts` menulis satu halaman untuk setiap mahasiswa, disusul halaman-halaman kunci jawaban. `structureSvg` mengubah setiap model menjadi teks SVG, sehingga skrip ini tidak memerlukan Vue maupun browser:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // seed 1000, 1001, …

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const task = 'Find the reactions and draw the bending moment diagram.'

const pages = [
  ...exercises.map((e, i) => `<h2>${students[i]}, exercise ${e.seed}</h2>
    <p>${e.statement} ${task}</p>${structureSvg(e.model, { layers: sheet, reactionLabels: 'names' })}`),
  ...exercises.map((e) => `<h2>Key, exercise ${e.seed}</h2>
    ${structureSvg(e.model, { layers: key })}`),
]

const style = `body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 2rem auto }
  section { break-after: page }`
writeFileSync('test.html', `<!doctype html><meta charset="utf-8"><title>Test</title>
  <style>${style}</style>${pages.map((page) => `<section>${page}</section>`).join('\n')}`)
```

```bash
node print-test.ts
```

Buka `test.html` di browser lalu cetak, atau simpan sebagai PDF: soal setiap mahasiswa dan setiap kunci jawaban mendapat halamannya sendiri. Halaman milik Ada dan kuncinya:

![Soal 1000: bentang 6 m dengan overstek 2 m, 10 kN/m pada bentang dan 30 kN di ujung, reaksi yang dicari bernama A_x, A_z dan B_z, serta dimensi berantai 6 m dan 2 m dengan total 8 m; di bawahnya kunci jawaban, dengan reaksi 20 dan 70 dan momen lentur dari −60 di atas tumpuan sampai 20 di bentang](/screenshots/id/p2p-plot-exercise-sheet.webp){.shot-lg}

Lapisan `dimensions` mencantumkan setiap bentang dan panjang totalnya, seperti lazimnya lembar soal, dan `reactionLabels: 'names'` memberi nama besaran yang dicari, dengan setiap panah menunjuk ke arah positif jawabannya. Di kunci jawaban, nilai reaksi dan diagram ditulis sebagai angka tanpa satuan dalam kN dan kNm, seperti di aplikasi EduBeam: sebutkan hal ini di judul kunci jika mahasiswa Anda perlu diberi tahu. Untuk mesin fotokopi hitam-putih, berikan `colors` dengan semua rona diatur menjadi hitam: lihat [Hitam-putih](/id/plot/theming#black-and-white).

## Gambar untuk LaTeX dan Word {#figures-for-latex-and-word}

Jika soal ujian Anda ditulis di LaTeX atau Word, tulis gambarnya sebagai file dan tetap pakai template Anda sendiri. `figures.ts` menulis lembar soal dan kunci untuk 30 seed:

```ts [figures.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']

for (let seed = 1000; seed < 1030; seed++) {
  const { model } = makeExercise(seed)
  writeFileSync(`exercise-${seed}.svg`, structureSvg(model, { layers: sheet, reactionLabels: 'names' }))
  writeFileSync(`exercise-${seed}-key.svg`, structureSvg(model, { layers: key }))
}
```

Jalankan dengan `node figures.ts`: hasilnya 60 file untuk 30 mahasiswa, masing-masing SVG biasa dengan warna tetap, tanpa CSS dan tanpa skrip.

- **Word** (2019 dan Microsoft 365) menyisipkan SVG apa adanya: *Insert › Pictures* (di Word berbahasa Indonesia *Sisipkan › Gambar*).
- **LaTeX** menyertakan PDF, bukan SVG. Konversikan sekali dengan [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) atau Inkscape, lalu `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. `\includesvg` dari paket `svg` melakukan konversi itu untuk Anda jika Inkscape terpasang.

Lebar gambar 640 unit dengan teks 13 unit, sehingga pada lebar kolom teks A4, sekitar 16 cm, labelnya berukuran 9 pt. Atur `fontFamily` ke font yang dipakai dokumen Anda: semua opsi ada di [File SVG mandiri](/id/plot/functions#a-standalone-svg-file).

## Sesuaikan dengan kebutuhan Anda {#make-it-your-own}

- **Lebih banyak jenis struktur.** Tambahkan kasus: kantilever, balok menerus dua bentang, portal, rangka batang. Demo di bagian atas halaman memilih dari delapan jenis, mulai dari balok sederhana sampai portal tiga sendi, rangka batang Warren dan portal.
- **Soal statis tak tentu.** Solver menanganinya sama baiknya; hanya penyelesaian manualnya yang lebih panjang.
- **Angka bulat.** Ambil beban dan panjang dari daftar pendek, seperti di atas, agar kunci jawaban sebulat yang Anda inginkan. Ulangi untuk beberapa ratus seed dan lewati seed yang kuncinya memiliki terlalu banyak desimal.
- **Cegah mekanisme.** Pembangkit yang dapat menempatkan tumpuan secara keliru sebaiknya menghitung di dalam blok `try` dan melewati seed yang memunculkan galat: lihat [Saat perhitungan gagal](/id/solver/solving#when-solving-fails).
- **Lebih banyak pertanyaan.** Minta mahasiswa menggambar juga gaya geser (`'V'`), lendutan (`'w'`, dengan nilai dari [`getUnknowns`](/id/solver/results#displacements)), atau gaya normal pada batang miring.
