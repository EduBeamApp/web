---
title: Batang dan sendi
description: "Hubungkan joint dengan batang Beam2D, lepas momen dengan sendi ujung, modelkan batang rangka, dan ambil matriks kekakuan serta transformasi dari @edubeam/fem."
order: 5
source: site
---

# Batang dan sendi {#members-and-hinges}

Setiap batang adalah `Beam2D`: balok Timoshenko lurus dengan dua joint di bidang x–z, yang memikul gaya normal, gaya geser, dan momen lentur. Sendi di ujungnya melepas momen di ujung tersebut. Potongan kode di halaman ini memakai `solver`, `domain`, dan `lc` dari program seperti di [Memulai](/id/solver/getting-started), beserta material `'steel'` dan penampang `'IPE200'`-nya.

## Membuat batang {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argumen | Tipe | Arti |
| --- | --- | --- |
| `label` | `string \| number` | Namanya, disimpan sebagai string |
| `nodes` | `[label, label]` | Joint pertama dan kedua. Sumbu x lokal berjalan dari yang pertama ke yang kedua: lihat [Arah batang](/id/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Label sebuah material dan sebuah penampang |
| `hinges` | `[boolean, boolean]` | Sendi di joint pertama dan di joint kedua. Opsional; bawaannya `[false, false]`, ujung kaku. |

Metode ini mengembalikan `Beam2D`: simpan objek itu untuk membaca hasil. `domain.getElement(label)` juga menemukannya kembali, tetapi dengan tipe umum `Element`, sehingga TypeScript meminta `as Beam2D` sebelum Anda membaca hasil darinya.

Batang-batang yang bertemu di sebuah joint tanpa sendi tersambung secara kaku: semuanya berotasi bersama. Joint, material, dan penampang dapat dibuat dalam urutan apa pun, asalkan semuanya sudah ada saat perhitungan; jika ada yang tidak ditemukan, `solve()` memunculkan `RangeError` yang menyebut namanya.

## Sendi ujung {#end-hinges}

Sendi melekat pada ujung batang, bukan pada joint. Di sini batang 2 diawali dengan sendi di C, sehingga C meneruskan gaya geser, tetapi tidak meneruskan momen dari bentang C–D ke kantilever A–C:

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // 0 di sendi
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 bentang 4 m
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: 20 kN dari C–D, sejauh 2 m
```

::model-figure{caption="Kantilever yang memikul bentang bersendi: tidak ada momen di C"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

Jika beberapa batang bertemu di sebuah joint bersendi, cukup beri sendi pada semua ujung batang kecuali satu. Sendi di setiap ujung juga dapat dipakai: tidak ada lagi yang memutar joint tersebut, dan solver melaporkan rotasinya sebagai 0. Namun, momen yang bekerja pada joint seperti itu tidak dipikul apa pun, dan [perhitungannya gagal](/id/solver/solving#when-solving-fails).

## Batang rangka {#truss-bars}

Beri sendi di kedua ujungnya, maka batang hanya memikul gaya normal, selama bebannya bekerja di joint: itulah batang rangka.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

[Contoh program rangka batang](/id/solver/trusses) menghitung seluruh rangka batang dengan cara ini. Contoh rangka batang di aplikasi EduBeam memakai joint kaku, dengan luas penampang yang begitu besar sehingga momen lenturnya dapat diabaikan dibandingkan gaya aksialnya. Kedua model sama-sama sah; bedanya hanya pada momen-momen kecil itu. Matriks kekakuan batang rangka sendiri diturunkan di halaman [Elemen rangka batang](/id/elements/truss) pada manual teori.

## Matriks elemen {#the-element-s-matrices}

Untuk mengajarkan cara kerja metodenya, `Beam2D` memberikan matriks-matriksnya sebagai matriks [mathjs](https://mathjs.org); `.toArray()` mengubahnya menjadi `number[][]`:

| Metode | Memberikan |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: panjang dan proyeksinya, m |
| `computeLocalStiffnessMtrx().answer` | Matriks kekakuan 6 × 6 dalam sumbu lokal, dengan sendi yang sudah dikondensasi |
| `computeT()` | Matriks transformasi 6 × 6 dari sumbu global ke sumbu lokal |
| `computeStiffness()` | Matriks kekakuan 6 × 6 dalam sumbu global, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N dan N·m
```

Urutan DOF-nya adalah $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. Halaman [Elemen balok](/id/elements/beam) pada manual teori menurunkan matriks-matriks ini, dan [Cara EduBeam menghitung model](/id/elements/analysis) menunjukkan cara merakitnya.
