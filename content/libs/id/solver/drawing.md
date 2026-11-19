---
title: Menggambar hasil
description: "Ubah model @edubeam/fem yang sudah dihitung menjadi diagram dengan @edubeam/plot: di komponen Vue, sebagai file SVG dari skrip Node, atau sebagai JSON."
order: 11
source: site
---

# Menggambar hasil {#drawing-the-results}

[@edubeam/plot](/id/plot) menggambar model yang sudah dihitung seperti gambar-gambar di situs ini: batang, tumpuan, beban, reaksi, diagram N, V, dan M, serta bentuk deformasi, sebagai SVG. Serahkan solvernya; pustaka ini membaca semua yang diperlukannya.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## Di komponen Vue {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// Balok sederhana 6 m dengan beban 12 kN/m, dalam satuan SI: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // sendi
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // rol
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Hanya dibaca, tidak diawasi: markRaw mencegah Vue membuat solver menjadi reaktif
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Komponen ini menggambar reaksi 36 kN dan momen 54 kNm, seperti gambar interaktif berikut:

::model-figure{caption="Yang digambar BeamFigure.vue"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` menggambar kasus beban 0; prop `loadCase` memilih kasus lain dari `solver.loadCases`. Komponen ini tidak mengawasi solver: setelah Anda mengubah model dan menghitung lagi, ubah prop `revision` untuk menggambar ulang. Semua opsinya ada di [StructurePlot](/id/plot/structure-plot).

## Tanpa browser {#without-a-browser}

`structureSvg`, yang baru di @edubeam/plot 0.2, menulis gambar yang sama sebagai file SVG mandiri, dengan warna tetap yang dipahami Word, Inkscape, dan rangkaian alat LaTeX. Tanpa browser, tanpa komponen Vue, cukup skrip Node:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// Balok yang sama seperti di BeamFigure.vue
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

const svg = structureSvg(modelFromSolver(solver), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
  width: 640,
})
writeFileSync('beam.svg', svg)
```

File ini menampilkan hal yang sama dengan gambar interaktif di atas, dalam warna cetak. `width` menentukan ukurannya dalam piksel, karena tidak ada kotak yang dapat diukur. Untuk satu halaman penuh berisi gambar yang siap dicetak, masukkan beberapa file seperti ini ke satu halaman HTML, seperti yang dilakukan [pembangkit lembar soal ujian](/id/plot/exercises#print-a-test) dari @edubeam/plot, tanpa Vue maupun browser. Opsi `structureSvg` tercantum di [Fungsi](/id/plot/functions#a-standalone-svg-file).

## Kirim gambarnya, bukan solvernya {#ship-the-drawing-not-the-solver}

`modelFromSolver` mengubah model yang sudah dihitung menjadi data biasa yang dapat diserialisasi ke JSON: geometri, beban, reaksi, dan hasil setiap batang sebagai polinomial eksak. Hitung saat build, kirim JSON-nya, dan gambar dengan prop `model` sebagai ganti `solver`:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... balok yang sudah dihitung dari to-svg.ts
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Halaman yang menampilkan gambar tersebut tidak perlu menghitung apa pun: pekerjaannya dilakukan sekali saja, saat build. [Menyematkan](/id/plot/embedding#ship-the-drawing-not-the-solver) menunjukkan sisi komponennya, dan [Model gambar](/id/plot/model) menjelaskan formatnya.

Semua hal lainnya, mulai dari warna hingga pembacaan nilai saat kursor diarahkan dan beban yang dapat diseret, ada di [dokumentasi @edubeam/plot](/id/plot/getting-started).
