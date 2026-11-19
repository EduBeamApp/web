---
title: Membaca hasil
description: "Baca reaksi, perpindahan joint, gaya dalam di sepanjang batang, bentuk deformasi, dan gaya ujung dari model @edubeam/fem yang sudah dihitung, beserta bentuk nilainya."
order: 10
source: site
---

# Membaca hasil {#reading-results}

Setelah `solve()`, hasil dibaca dari joint dan batang, untuk kasus beban tertentu. Semua contoh di halaman ini membaca satu model: balok sederhana sepanjang 6 m, IPE 200 yang kaku geser, dengan beban 20 kN sejauh 2 m dari A:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // kaku geser

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="20 kN sejauh 2 m pada bentang 6 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## Hasil dan tempat membacanya {#what-to-read-where}

| Hasil | Panggilan | Mengembalikan |
| --- | --- | --- |
| Reaksi | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Perpindahan | `node.getUnknowns(lc, dofs)` | m, rad |
| N, V, atau M di satu titik | `beam.computeBendingMomentAt(lc, x)` | sebuah angka: N, N·m |
| N, V, atau M di sepanjang batang | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 titik |
| Bentuk deformasi | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 titik, m |
| Gaya ujung | `beam.computeEndForces(lc)` | matriks mathjs berisi 6 nilai |

Untuk N dan V, metodenya adalah `computeNormalForceAt` dan `computeShearForceAt`, `computeNormalForce` dan `computeShearForce`, yang mengembalikan `{ x, N }` dan `{ x, V }`. Tandanya dijelaskan di [Satuan dan tanda](/id/solver/conventions#signs-of-the-results).

## Reaksi {#reactions}

`getReactions` memberikan satu reaksi untuk setiap DOF yang ditahan tumpuan: `dofs` mencantumkan DOF-DOF tersebut, dalam urutan saat diberikan ke `createNode`, dan `values` berisi reaksinya dengan urutan yang sama. `values` berupa **matriks mathjs** jika jumlahnya lebih dari satu, dan array biasa jika hanya satu, jadi fungsi bantu kecil mengubahnya menjadi array dalam kedua kasus:

```ts
/** Ubah Matrix mathjs, array, atau angka menjadi array biasa. */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]: DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

Untuk mengambil satu reaksi tanpa bergantung pada urutan, cari DOF-nya: `list(values)[dofs.indexOf(DofID.Dz)]`, seperti di [contoh program balok menerus](/id/solver/beams#a-continuous-beam).

Reaksi adalah gaya yang diberikan tumpuan pada struktur: −13 333 N searah z berarti 13,3 kN yang mendorong ke atas, $P\,b/L = 20 \cdot 4/6$. Pada joint dengan [sumbu yang diputar](/id/solver/nodes-supports#inclined-supports), reaksi dinyatakan dalam sumbu tersebut; `getReactions(lc, true)` mengubahnya ke sumbu global dan mengembalikan ketiga DOF, dengan 0 di DOF yang tidak ditahan. Joint tanpa tumpuan memberikan `{ dofs: [], values: [] }`.

## Perpindahan {#displacements}

`getUnknowns` membaca DOF mana pun dari sebuah joint, baik yang ditahan maupun tidak:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A berotasi searah jarum jam sebesar 0,010892 rad, $P\,b\,(L^2 - b^2)/6EIL$. Jika diminta satu DOF, `getUnknowns` mengembalikan angka biasa, walaupun TypeScript mendeklarasikannya sebagai matriks: `list` juga menangani hal itu.

## Gaya dalam di sepanjang batang {#internal-forces-along-a-member}

Metode `…At` memberikan nilai di titik sejauh `x` meter dari joint pertama batang:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: tepat di titik beban berlaku nilai sesudahnya
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Di tempat beban terpusat menimbulkan loncatan, nilai tepat di titik beban adalah nilai di sisi seberangnya. Untuk membaca sisi sebelumnya, minta nilai sedikit sebelum beban, misalnya `x - 1e-9`.

Metode array mengambil sampel batang di n + 1 titik yang berjarak sama, termasuk kedua ujungnya:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, dengan galat pembulatan kecil
```

Galat pembulatan seperti `-3.6e-12` dapat muncul di tempat yang nilai eksaknya 0: bulatkan angka dengan `toFixed` sebelum mencetaknya. Nilai terbesar di sepanjang batang adalah nilai terbesar dari sampel yang rapat, misalnya `computeBendingMoment(lc, 500)`, seperti di [contoh program balok menerus](/id/solver/beams#a-continuous-beam). Di bawah beban terbagi, M adalah polinomial, sehingga nilai ekstrem eksaknya berada di titik V bernilai nol; [@edubeam/plot](/id/plot/model#reading-values-yourself) menemukannya secara eksak.

## Bentuk deformasi {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` memberikan perpindahan searah dan tegak lurus batang, `u` dan `w`, dalam sumbu lokalnya; `computeGlobalDefl` memberikan titik-titik yang sama dalam x dan z global. Lendutan di bawah beban, 17,43 mm, adalah $P\,a^2 b^2/3EIL$. Bentuk deformasi di antara joint bersifat eksak, bukan interpolasi dari nilai ujung. Untuk menggambarnya, lihat [Menggambar hasil](/id/solver/drawing).

## Gaya ujung {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

Gaya yang diberikan kedua joint pada batang, dalam sumbu lokalnya: angka-angka di tabel *Hasil elemen* aplikasi, yang dijelaskan di [Gaya ujung](/id/elements/conventions#end-forces-element-results-table).

## Hasil sebagai angka untuk diperiksa {#results-as-numbers-to-check}

Setiap nilai di atas sama dengan rumus tertutupnya. Halaman [Memeriksa hasil secara manual](/id/guide/verification) membahas jauh lebih banyak kasus dari buku teks, yang dihitung oleh solver yang sama ini di browser Anda.
