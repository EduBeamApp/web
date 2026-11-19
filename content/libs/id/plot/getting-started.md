---
title: Memulai
description: "Pasang @edubeam/plot, gambar balok yang dihitung @edubeam/fem beserta beban, reaksi dan momen lentur di Vue 3, perbarui saat model berubah, simpan sebagai SVG."
order: 1
group: Pendahuluan
source: site
---

# Memulai {#getting-started}

@edubeam/plot menggambar balok, portal atau rangka batang bidang beserta hasilnya sebagai SVG: batang, tumpuan, beban, reaksi, diagram N, V dan M, serta bentuk deformasi, persis seperti gambar-gambar di situs ini. Anda memberikan model yang sudah dihitung oleh [@edubeam/fem](/id/solver), solver yang menjadi dasar [EduBeam]{.edubeam}; pustaka ini sendiri yang menentukan tata letak, skala dan posisi setiap angka.

Para dosen memakainya untuk [soal latihan dan ujian](/id/plot/exercises) yang dibangkitkan dari sebuah seed (nilai awal pembangkit bilangan acak), untuk [slide yang tersusun](/id/plot/slides) klik demi klik, dan untuk gambar catatan kuliah, baik di halaman web maupun sebagai file untuk LaTeX dan Word. Halaman [Latihan soal](/id/practice) dan [Pembuat soal ujian](/id/exam) di situs ini juga dibuat dengan pustaka ini.

::div{.actions}
[Buat gambar pertama Anda](#draw-a-solved-model) [Bangkitkan soal latihan](/id/plot/exercises)
::

## Instalasi {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 atau yang lebih baru dan solver adalah peer dependencies, sehingga aplikasi Anda hanya menyimpan satu salinan dari masing-masing. Paket ini hanya ESM, menyertakan tipenya sendiri dan tidak memerlukan stylesheet. Paket berjalan di Node 20.19 atau yang lebih baru; untuk menjalankan skrip TypeScript apa adanya dengan `node script.ts`, diperlukan Node 22.18 atau yang lebih baru.

## Menggambar model yang sudah dihitung {#draw-a-solved-model}

Cukup dua file. File pertama, `beams.ts`, menyusun dan menghitung sebuah balok dengan @edubeam/fem. Isinya fungsi biasa, sehingga model yang sama dapat dipakai untuk halaman web, slide dan skrip:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Balok sederhana sepanjang `span` m dengan beban `q` kN/m, sudah dihitung. Solver bekerja dalam satuan SI. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // baja, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, kaku terhadap geser
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // sendi
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // rol
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z ke bawah
  solver.solve()
  return solver
}
```

File kedua, `BeamFigure.vue`, menyerahkan solver itu ke `StructurePlot` dan menentukan apa yang digambar:

```vue [BeamFigure.vue]
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const beam = simpleBeam(6, 12)
</script>

<template>
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

Itulah seluruh gambarnya: balok di atas tumpuannya, beban 12 kN/m, kedua reaksi sebesar 36 kN, dan momen lentur, $qL^2/8 = 54$ kNm di tengah bentang, yang digambar di sisi tarik:

::model-figure{caption="Hasil BeamFigure.vue: bentang 6 m dengan beban 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
labels: horizontal
---
::

Gambar mengisi lebar wadahnya dan menentukan tingginya sendiri. Teks, simbol dan tebal garis tetap berukuran sama dalam piksel, berapa pun ukuran strukturnya, sehingga gambar tetap terbaca di ponsel. Jika `layers` tidak diisi, gambar memilih sendiri hasil yang ditampilkan: M untuk balok dan portal, N untuk rangka batang. Semua [lapisan](/id/plot/structure-plot#layers) tercantum di halaman `StructurePlot`; cara menyusun model dijelaskan di [dokumentasi solver](/id/solver/getting-started).

## Saat model berubah {#when-the-model-changes}

Gambar membaca solver yang diberikan kepadanya, tetapi tidak memantaunya. Jika ada yang berubah, hitung ulang dan berikan solver yang baru. `computed` melakukan persis hal itu:

```vue [LoadSlider.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const q = ref(12) // kN/m
const beam = computed(() => simpleBeam(6, q.value))
</script>

<template>
  <input v-model.number="q" type="range" min="1" max="30" />
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

Balok seperti ini dihitung dalam sekitar satu milidetik, sehingga gambar mengikuti slider selagi digeser. Jika Anda mengubah solver di tempat, naikkan nilai prop `revision`, dan gambar akan membacanya lagi.

::callout{type="tip" title="Jauhkan solver dari reaktivitas mendalam"}
`computed`, prop atau `const` biasa menyimpan solver apa adanya. Untuk menyimpannya di state komponen, gunakan `shallowRef` atau bungkus dengan `markRaw`: `ref` biasa akan membuat Vue menelusuri seluruh isi solver untuk menjadikannya reaktif, padahal itu sama sekali tidak perlu.
::

## Menyimpan sebagai file {#save-it-as-a-file}

Untuk gambar di LaTeX, Word atau Inkscape, `structureSvg` menulis gambar yang sama sebagai file SVG mandiri dengan warna tetap. Fungsi ini tidak memerlukan Vue maupun browser, cukup Node. Simpan skrip berikut sebagai `beam-svg.ts` di samping `beams.ts`:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Jalankan dengan `node beam-svg.ts` (Node 22.18 atau yang lebih baru; pada versi lama, `npx tsx beam-svg.ts`). Semua opsinya, serta cara memasukkan file ke LaTeX dan Word, ada di [File SVG mandiri](/id/plot/functions#a-standalone-svg-file).

## Gambar bertumpuk {#the-stacked-figure}

`DiagramStack` membuat gambar yang ada di setiap buku ajar statika: balok lurus dengan bebannya, dan di bawahnya V(x), M(x) dan w(x) pada satu sumbu x yang sama. Dengan `v-model:load-at`, pembaca dapat menyeret beban terpusat sepanjang balok dan melihat diagram mengikutinya:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

Contoh lengkapnya ada di halaman [DiagramStack](/id/plot/diagram-stack).

## Dipakai di seluruh aplikasi {#use-it-everywhere}

Untuk mendaftarkan kedua komponen secara global, alih-alih mengimpornya di setiap tempat pemakaian:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // <StructurePlot> dan <DiagramStack> tersedia di setiap template
```

Impor bernama membuat bundle lebih kecil: halaman yang hanya mengimpor `StructurePlot` tidak ikut membawa `DiagramStack` maupun plugin. Kedua komponen juga dapat dirender di server, di Nuxt atau VitePress: lihat [Menyematkan](/id/plot/embedding).

## Langkah selanjutnya {#next}

::card-grid{cols="2"}
:::card{title="Soal latihan dan ujian" icon="lucide:dices" to="/id/plot/exercises"}
Soal yang berbeda untuk setiap mahasiswa dari sebuah seed, lengkap dengan kunci jawabannya, dicetak atau disimpan untuk LaTeX.
:::
:::card{title="Slide dan catatan kuliah" icon="lucide:presentation" to="/id/plot/slides"}
Gambar yang tersusun klik demi klik di Slidev, Vue atau Beamer, dan gambar yang sama untuk catatan kuliah.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/id/plot/structure-plot"}
Lapisan, dimensi, gambar mini, ukuran, satuan, dan membaca nilai dengan kursor.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/id/plot/diagram-stack"}
Balok di atas diagram V, M dan w-nya, dengan beban yang dapat diseret pembaca.
:::
::
