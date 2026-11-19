---
title: DiagramStack
description: "Balok di atas diagram V(x), M(x) dan w(x) pada satu sumbu x dengan DiagramStack: kursor yang membaca semua baris dan beban terpusat yang dapat diseret."
order: 3
source: site
---

# DiagramStack

`DiagramStack` membuat gambar yang ada di setiap buku ajar statika: balok lurus dengan tumpuan, beban dan reaksinya, dan di bawahnya, pada sumbu x yang sama, gaya geser V(x), momen lentur M(x) dan lendutan w(x). Satu kursor membaca semua baris sekaligus, dan beban terpusat, jika dipasang, dapat diseret sepanjang balok.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: balok sederhana 6 m dengan beban 20 kN yang dapat diseret pembaca, di sini 4,3 m dari tumpuan kiri; reaksi 5,7 kN dan 14,3 kN, gaya geser yang melompat dari 5,7 kN ke −14,3 kN di bawah beban, momen lentur dengan puncak 24,4 kNm di titik itu, dan lendutan dengan nilai terbesar 17 mm](/screenshots/id/p2p-plot-diagram-stack.webp){.shot-lg}

Batang-batangnya harus membentuk satu garis horizontal yang digambar dari kiri ke kanan. Selain itu, misalnya garis miring atau patah, atau batang yang digambar dari kanan ke kiri, ditolak dengan pesan galat alih-alih digambar salah, karena sumbu x gambar adalah sumbu balok. Semua prop tercantum di [API komponen](/id/plot/components#diagramstack).

## Baris {#rows}

| Prop | Bawaan | Mengatur |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | diagram dari atas ke bawah; `'N'` juga tersedia |
| `loadRow` | `true` | balok dengan tumpuan, beban dan reaksinya di atas baris-baris diagram |
| `members` | all members | batang yang membentuk garis balok, jika model juga memiliki batang lain |
| `rowHeights` | N 100, V 116, M 128, w 76 px | tinggi baris; sedikit lebih kecil jika lebar kurang dari 560 px |
| `maxHeight` | none | baris menyusut, paling jauh sampai 60%, agar gambar muat; ukuran teks tetap |
| `ranges` | each row's own | rentang nilai tetap per baris, dalam satuan SI |

V dan N digambar positif ke atas, M dan w positif ke bawah, seperti di kebanyakan buku ajar: momen positif dan lendutan ke bawah berada di bawah sumbu. Setiap baris mencantumkan nilai ekstremnya.

## Kursor pembaca nilai {#the-reading-cursor}

`hover` aktif secara bawaan. Saat kursor bergerak di atas gambar, muncul garis vertikal yang melintasi semua baris, dengan nilai setiap baris dalam label kecil. Dalam jarak 8 px dari sebuah lompatan, di beban terpusat atau tumpuan, kursor menempel ke titik itu, dan V menampilkan kedua sisinya, seperti `5.7 → −14.3 kN` di bawah beban pada gambar di atas. Nilai-nilai itu juga dipancarkan sebagai event:

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

Hasil pembacaan berbentuk `{ x, values }`: `x` dalam meter di sepanjang balok, dan `{ left, right }` untuk setiap baris dalam satuan SI; `null` saat kursor keluar.

## Beban yang dapat diseret pembaca {#a-load-the-reader-can-drag}

Berikan posisi beban terpusat ke `v-model:load-at`, dan beban itu mendapat pegangan: pembaca menyeretnya dengan kursor, atau memfokuskannya lalu memakai tombol panah. Komponen hanya melaporkan posisi baru. Hitung ulang balok dengan beban di posisi itu dan berikan solver yang baru, seperti yang dilakukan `MovingLoad.vue`:

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** Balok dengan beban terpusat sejauh `at` meter dari A, sudah dihitung. */
const solveWithLoadAt = (at: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamConcentratedLoad(1, [0, P, 0, at], true)
  solver.solve()
  return solver
}

/** Rentang setiap baris untuk semua posisi beban, agar diagram membesar dan mengecil, bukan berganti skala. */
const rows: StackRow[] = ['V', 'M', 'w']
const envelope = (() => {
  const ranges: Partial<Record<StackRow, [number, number]>> = {}
  for (let at = 0.25; at < L; at += 0.25) {
    const model = modelFromSolver(solveWithLoadAt(at))
    const line = beamLine(model)
    for (const row of rows) {
      const [lo, hi] = rowRange(lineDiagram(model, line, row))
      const [min, max] = ranges[row] ?? [0, 0]
      ranges[row] = [Math.min(min, lo), Math.max(max, hi)]
    }
  }
  return ranges
})()

const at = ref(2)
const solver = computed(() => solveWithLoadAt(at.value))
</script>

<template>
  <DiagramStack v-model:load-at="at" :solver="solver" :rows="rows" :ranges="envelope" load-label="P = 20 kN" />
  <p>The load is {{ at.toFixed(2) }} m from A.</p>
</template>
```

Dengan beban di 4,3 m, gambar menunjukkan reaksi 5,7 kN dan 14,3 kN, lompatan gaya geser dari 5,7 ke −14,3 kN di bawah beban, dan $M = 5{,}67 \cdot 4{,}3 = 24{,}4$ kNm di titik itu. Tanpa `ranges`, setiap baris menyesuaikan skala dengan nilai ekstremnya sendiri saat beban bergerak, dan diagram akan tampak seolah tidak berubah sama sekali.

| Prop | Bawaan | Mengatur |
| --- | --- | --- |
| `loadAt` | none | posisi beban, dalam m dari awal garis; dengan `v-model:load-at` |
| `loadLabel` | `P = …` | teks di samping pegangan |
| `loadStep` | 0.05 | posisi seretan dibulatkan ke langkah ini, m; tombol panah menggeser sejauh langkah ini |

Pegangan adalah elemen `role="slider"` yang dapat difokuskan, lengkap dengan rentang dan posisinya untuk pembaca layar. Tombol panah menggesernya sejauh `loadStep`, Page Up dan Page Down sejauh 1 m, serta Home dan End ke ujung-ujung balok. Di layar sentuh, pegangan dapat diseret dengan jari, dan pengguliran vertikal tetap berfungsi di atas gambar.

Pegangan menggantikan gaya terpusat yang ada pada model terhitung di posisi `loadAt`: gaya itu digambar sebagai pegangan, dengan label besarnya kecuali Anda memberikan `loadLabel`. Masukkan beban ke model di posisi yang sama, seperti yang dilakukan `solveWithLoadAt`.

## Ukuran dan render di server {#size-and-server-rendering}

Gambar mengukur kotak wadahnya dan menata isinya selebar kotak itu, minimal 320 px. Sebelum dapat mengukur, gambar memakai `width`, secara bawaan 720 px. Teks berukuran 12,5 px (`fontSize`) dan tidak pernah mengecil bersama gambar.
