---
title: Kasus beban
description: "Hitung beberapa kasus beban dari satu model @edubeam/fem sekaligus, lalu gabungkan hasilnya dengan superposisi menjadi kombinasi beban dan envelope."
order: 8
source: site
---

# Kasus beban {#load-cases}

Kasus beban adalah sekumpulan beban yang dihitung bersama. Solver baru sudah memiliki satu kasus beban; tambahkan kasus lain, maka satu panggilan `solve()` menyelesaikan semuanya dengan satu matriks kekakuan. Analisisnya linear, sehingga hasil dari kasus beban yang berbeda dapat dikalikan faktor dan dijumlahkan: kombinasi beban tidak lebih dari itu.

## Menambah kasus beban {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // kasus beban bawaan setiap solver
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // 20 kN di tengah bentang
solver.solve() // menyelesaikan semua kasus beban

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Keluaran]
45000
30000
```

Setiap metode hasil menerima kasus beban yang harus dibacanya. Kasus beban pertama berlabel `'DefaultLC'`; label hanyalah nama, dan solver membedakan kasus beban berdasarkan objeknya.

## Menggabungkan kasus beban {#combine-them}

Kalikan hasil setiap kasus beban dengan faktornya, lalu jumlahkan. Untuk keadaan batas ultimit menurut Eurocode, $1{,}35\,G + 1{,}5\,Q$, di tengah bentang:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

Hal yang sama berlaku untuk reaksi, perpindahan, dan semua hasil lainnya. Di sepanjang seluruh batang, gabungkan titik demi titik: array dari `computeBendingMoment(lc, n)` memakai `x` yang sama untuk setiap kasus beban.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, di x = 3
```

Envelope (selubung), yaitu nilai terbesar dan terkecil dari beberapa kombinasi, adalah `Math.max` dan `Math.min` atas array-array tersebut, titik demi titik. Untuk beban bergerak, hitung sekali untuk setiap posisi beban: [contoh program garis pengaruh](/id/solver/scripts#an-influence-line-as-csv) melakukannya.

## Di aplikasi EduBeam {#in-the-edubeam-app}

Aplikasi hanya menghitung satu kasus beban dalam satu waktu, jadi dalam hal kombinasi pustaka ini melangkah lebih jauh. Model dengan beberapa kasus beban tetap dapat [digambar](/id/solver/drawing) per kasus beban: `StructurePlot` dari @edubeam/plot menerima indeks `loadCase` ke dalam `solver.loadCases`.
