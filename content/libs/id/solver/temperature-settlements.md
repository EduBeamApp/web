---
title: Suhu dan penurunan tumpuan
description: "Bebani batang @edubeam/fem dengan perubahan suhu dan selisih suhu, dan pindahkan tumpuan dengan perpindahan yang ditetapkan, lengkap dengan contoh yang sudah diperiksa."
order: 7
source: site
---

# Suhu dan penurunan tumpuan {#temperature-and-settlements}

Dua beban yang bukan gaya: batang yang cenderung mengubah panjang atau kelengkungannya, dan tumpuan yang bergerak. Keduanya menimbulkan gaya dalam hanya jika struktur menghalanginya, sehingga cocok sebagai bahan latihan untuk struktur statis tak tentu. Teori di balik keduanya ada di [Beban elemen](/id/elements/beam#element-loads) pada manual teori aplikasi.

## Suhu {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Nilai | Arti | Akibat pada batang bebas |
| --- | --- | --- |
| `dTc` | perubahan di titik berat, K | memanjang sebesar $\alpha\,\Delta T_c\,L$ |
| `dTb` | perubahan di serat bawah (sisi +z lokal), K | bersama `dTt`, melengkung dengan $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ |
| `dTt` | perubahan di serat atas, K | |

Hanya selisih `dTb - dTt` yang melenturkan batang, jadi `[30, 20, 0]` dan `[30, 10, -10]` adalah beban yang sama. Beban ini memerlukan `alpha` dari material dan `h` dari penampang; tanpa `h`, momennya bernilai `NaN`.

Balok yang dijepit di kedua ujungnya tidak dapat memanjang maupun melengkung, sehingga balok itu tertekan dan melentur: $N = -EA\,\alpha\,\Delta T_c$ dan $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// Titik berat 30 K lebih panas, serat bawah 20 K lebih panas daripada serat atas
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

Untuk IPE 200, $EA = 598{,}5$ MN dan $EI = 4{,}0803$ MNm². Serat bawah yang lebih panas membuat ujung-ujung balok bebas melengkung ke atas, sehingga kekangan melenturkannya ke arah sebaliknya: momen negatif, dengan serat atas tertarik.

::model-figure{caption="Balok jepit–jepit, 30 K lebih panas di titik beratnya dan serat bawahnya 20 K lebih panas daripada serat atas"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Pada balok sederhana, beban yang sama sama sekali tidak menimbulkan gaya dalam, hanya perpindahan: tumpuan rol bergeser keluar sebesar $\alpha\,\Delta T_c\,L = 2{,}16$ mm dan tengah bentang melendut $\kappa L^2/8 = 5{,}4$ mm.

## Perpindahan yang ditetapkan {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Memindahkan tumpuan sebesar nilai tertentu: meter untuk `Dx` dan `Dz`, radian untuk `Ry`, dalam sumbu joint itu sendiri. DOF-nya harus DOF yang ditahan tumpuan joint tersebut; pada DOF bebas, nilainya diabaikan tanpa peringatan.

Balok jepit–rol yang tumpuan rolnya turun 10 mm, dalam solver baru dengan material dan penampang dari contoh beban suhu:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // jepit
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // rol
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm ke bawah
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // -3400.2 N·m di A: 3EIw/L²
```

Tumpuan rol harus menarik balok ke bawah agar balok mengikutinya, sehingga reaksinya positif, searah +z: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="Tumpuan rol balok jepit–rol turun 10 mm: −3,4 kNm di ujung jepit"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Cara aplikasi menggambar kedua beban ini dijelaskan di [Beban](/id/essentials/loads).
