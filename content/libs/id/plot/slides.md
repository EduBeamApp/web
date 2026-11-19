---
title: Slide dan catatan kuliah
description: "Gambar kuliah @edubeam/plot yang tersusun klik demi klik di Slidev, Vue atau Beamer, dihitung saat kuliah, dan masuk ke catatan, PowerPoint dan Word sebagai SVG."
order: 6
source: site
---

# Slide dan catatan kuliah {#slides-and-lecture-notes}

Tampilkan struktur sesuai urutan Anda menjelaskannya: mula-mula geometrinya, lalu tumpuan dan beban, kemudian reaksi, dan terakhir momen lentur. Gambar yang dibuat dari model terhitung tersusun di tempatnya, satu lapisan setiap klik, dan selalu benar. Model yang sama kemudian menghasilkan gambar untuk catatan kuliah Anda.

![Slide Slidev pada klik ke-0, ke-2 dan ke-4: joint sebuah portal dengan dimensinya, lalu portal di atas tumpuannya dengan bebannya, lalu reaksi dan momen lentur](/screenshots/id/p2p-plot-slidev-steps.webp){.shot-md}

## Gambar yang tersusun bertahap {#a-figure-that-builds-up}

Cukup dua file. `frame.ts` menyusun dan menghitung strukturnya:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Portal 6 m × 4 m, kaki bertumpuan sendi, 10 kN/m pada balok dan gaya dorong 15 kN di B. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z mengarah ke bawah: 4 m ke atas
  domain.createNode('C', [6, 0, -4])
  domain.createNode('D', [6, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  domain.createBeam2D(3, ['C', 'D'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 15e3 })
  solver.solve()
  return solver
}
```

`BuildUp.vue` menggambarnya secara bertahap. Setiap tahap mendaftar lapisan yang ditampilkannya, dan `reserve` menata semuanya sejak klik pertama, sehingga setiap lapisan muncul perlahan di tempatnya dan tidak ada yang bergeser:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // geometri
  ['nodeLabels', 'members', 'supports'], // struktur
  ['nodeLabels', 'members', 'supports', 'loads'], // bebannya
  ['members', 'supports', 'loads', 'reactions'], // reaksi
  ['members', 'supports', 'reactions', 'M'], // dan momen lentur
]
const all = [...new Set(stages.flat())] // ditata sejak langkah pertama, agar tidak ada yang bergeser kemudian
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Lapisan juga dapat menghilang: tahap terakhir menghilangkan beban agar momen mendapat ruang. `:height="360"` menjaga gambar tetap muat di slide. Batang tergambar dari ujung ke ujung saat pertama kali muncul, dan lapisan muncul perlahan selama setengah detik; keduanya nonaktif jika `prefers-reduced-motion` aktif, dan `:animate="false"` menonaktifkannya untuk semua orang. Untuk memperlambatnya di ruang kuliah, lihat [Mengubah gaya animasi](/id/plot/theming#restyling-the-animation).

## Di Slidev {#in-slidev}

[Slidev](https://sli.dev) membuat slide dari Markdown dengan Vue, sehingga komponen ini langsung berfungsi di sana. Pasang kedua pustaka di proyek slide:

```bash
npm install @edubeam/plot @edubeam/fem
```

Letakkan `frame.ts` dan `BuildUp.vue` di folder `components/` proyek slide, lalu biarkan klik pada slide menggerakkan tahapnya di `slides.md`:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` memberi slide empat klik, dan `$clicks` menghitungnya mulai dari 0. Setiap tekanan tombol panah menampilkan tahap berikutnya; mundur menyembunyikannya kembali. `slidev export` membuat PDF dari slide, satu halaman per klik dengan `--with-clicks`.

## Di slide Vue lainnya {#in-any-vue-slides}

Di tempat lain, simpan sendiri tahapnya:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BuildUp from './BuildUp.vue'

const step = ref(0)
</script>

<template>
  <BuildUp :step="step" />
  <button type="button" @click="step = Math.max(0, step - 1)">Back</button>
  <button type="button" @click="step++">Next</button>
</template>
```

## Menghitung langsung saat kuliah {#solve-it-live}

Solver hanya membutuhkan beberapa milidetik untuk portal seperti ini, sehingga di tengah kuliah Anda dapat mengubah struktur dan menghitungnya saat itu juga. Hubungkan sebuah beban ke slider dan berikan model terhitung yang baru setiap kali, seperti di [Saat model berubah](/id/plot/getting-started#when-the-model-changes).

- **Beban berjalan.** [DiagramStack](/id/plot/diagram-stack#a-load-the-reader-can-drag) memungkinkan mahasiswa menyeret beban terpusat sepanjang balok dan melihat gaya geser dan momen lentur mengikutinya.
- **Kasus berdampingan.** Tetapkan [`diagramScale`](/id/plot/structure-plot#several-plots-at-one-scale), dan dua gambar akan menggambar momennya dengan skala yang sama, sehingga momen yang lebih besar memang tampak lebih besar.
- **Membaca nilai.** Dengan `hover`, mengarahkan kursor ke sebuah batang menandai nilai di ujung ordinat setiap diagram: lihat [Membaca nilai](/id/plot/structure-plot#reading-values).

## Gambar untuk Beamer, PowerPoint dan Word {#figures-for-beamer-powerpoint-and-word}

Slide yang dibuat dengan LaTeX Beamer atau PowerPoint, atau catatan kuliah yang ditulis di Word, menerima gambar sebagai file. `structureSvg` menulis gambar sebagai SVG mandiri dengan warna tetap, ditata persis seperti `StructurePlot` menatanya. Skrip Node `frame-svg.ts`, di samping `frame.ts`:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Portal sebagai file SVG mandiri yang dirender dengan CairoSVG: beban, reaksi 20 dan 40 ke atas serta 2,3 dan 12,7 ke samping, dan momen lentur dari −50,7 di C sampai 29,3 di balok](/screenshots/id/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint dan Word (2019 dan Microsoft 365) menyisipkan SVG apa adanya. LaTeX menerimanya sebagai PDF: konversikan dengan `cairosvg frame.svg -o frame.pdf` atau Inkscape, atau biarkan `\includesvg` dari paket `svg` yang melakukannya. Rinciannya ada di [Gambar untuk LaTeX dan Word](/id/plot/exercises#figures-for-latex-and-word), dan semua opsinya di [File SVG mandiri](/id/plot/functions#a-standalone-svg-file).

### Gambar bertahap di Beamer {#a-build-up-in-beamer}

File disesuaikan dengan lapisan yang digambarnya, sehingga file yang ditulis untuk setiap tahap secara terpisah tidak akan saling berimpit. Berikan `structureSvg` nilai `reserve` yang sama dengan `BuildUp.vue`, yaitu semua lapisan dari semua tahap, maka setiap file berukuran sama dan strukturnya berada di tempat yang sama. `frame-stages.ts` menulis satu file per tahap:

```ts [frame-stages.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
const frame = modelFromSolver(portalFrame())

stages.forEach((layers, i) => {
  writeFileSync(`frame-${i + 1}.svg`, structureSvg(frame, { layers, reserve: all }))
})
```

Konversikan file-file itu ke PDF:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

lalu berikan overlay tersendiri untuk masing-masing. Setiap file berisi satu tahap utuh, sehingga frame Beamer menampilkannya satu per satu, dan karena semuanya berimpit tepat, setiap klik tampak menambahkan satu lapisan:

```latex [lecture.tex]
\begin{frame}{From geometry to bending moment}
  \centering
  \includegraphics<1>[width=0.8\linewidth]{frame-1.pdf}%
  \includegraphics<2>[width=0.8\linewidth]{frame-2.pdf}%
  \includegraphics<3>[width=0.8\linewidth]{frame-3.pdf}%
  \includegraphics<4>[width=0.8\linewidth]{frame-4.pdf}%
  \includegraphics<5>[width=0.8\linewidth]{frame-5.pdf}
\end{frame}
```

Di PowerPoint, letakkan kelima file itu di lima slide berurutan tanpa transisi di antaranya: setiap langkah terlihat sama seperti satu klik saat kuliah.

## Catatan dan bahan ajar {#notes-and-handouts}

- **Catatan kuliah di web.** VitePress dan Nuxt merender gambar saat build, sehingga gambar sudah ada di HTML sebelum skrip apa pun berjalan: lihat [Menyematkan](/id/plot/embedding).
- **Catatan cetak.** Tulis gambar dengan `structureSvg` ke dalam halaman HTML lalu cetak, seperti yang dilakukan [pembangkit lembar soal ujian](/id/plot/exercises#print-a-test), atau sertakan file-filenya di LaTeX atau Word.
- **Satu model untuk semua gambar.** `frame.ts` yang sama dipakai untuk slide, catatan kuliah dan lembar soal, sehingga semuanya tidak pernah saling bertentangan.
