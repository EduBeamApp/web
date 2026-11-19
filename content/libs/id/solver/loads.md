---
title: Beban joint dan beban batang
description: "Berikan gaya dan momen di joint, serta beban merata, trapesium, dan terpusat pada batang, dalam sumbu global atau lokal dengan @edubeam/fem; lalu ubah atau hapus."
order: 6
group: Beban
source: site
---

# Beban joint dan beban batang {#nodal-and-member-loads}

Setiap beban termasuk dalam suatu kasus beban. Solver baru sudah memiliki satu kasus beban, `solver.loadCases[0]`, dan setiap metode `create…` padanya menambahkan sebuah beban lalu mengembalikannya. Untuk beberapa kasus beban dan kombinasinya, lihat [Kasus beban](/id/solver/load-cases).

Nilainya dalam N, N/m, dan N·m, dan mengikuti [sumbu](/id/solver/conventions#axes): +z ke bawah, momen positif berlawanan arah jarum jam.

## Balok dengan semua jenis beban {#a-beam-with-every-kind}

Balok sepanjang 8 m di atas tumpuan sendi dan tumpuan rol, dengan beban garis yang naik dari 4 ke 10 kN/m, beban terpusat 20 kN, momen kopel 10 kNm, dan gaya horizontal di tumpuan rol:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // sendi
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // rol
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// 4 kN/m di A, naik menjadi 10 kN/m di B, ke bawah
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN ke bawah, 2 m dari A
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// momen kopel 10 kNm berlawanan arah jarum jam, 6 m dari A
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// 5 kN ke kanan di B
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions memberikan Matrix mathjs atau array: jadikan array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Keluaran]
[ -5000, -40250 ]
[ -35750 ]
```

Secara manual: resultan beban garis adalah 56 kN yang bekerja 4,571 m dari A, sehingga keseimbangan momen terhadap A memberikan $8R_B = 56 \cdot 4{,}571 + 20 \cdot 2 - 10 = 286$, $R_B = 35{,}75$ kN ke atas, dan $R_A = 76 - 35{,}75 = 40{,}25$ kN ke atas. Tumpuan sendi juga menahan gaya 5 kN, sehingga seluruh balok mengalami tarik sebesar 5 kN.

::model-figure{caption="Beban yang sama. Gambar ini meletakkan momen kopel pada joint C di 6 m, yang memberikan hasil yang sama."}
---
nodes: { A: [0, 0], C: [6, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: [4, 8.5] }
  - { member: 2, qz: [8.5, 10] }
  - { member: 1, pz: 20, at: 2 }
  - { node: C, my: 10 }
  - { node: B, fx: 5 }
results: [M]
show: [nodeLabels]
labels: horizontal
---
::

## Beban joint {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Berikan hanya komponen yang Anda perlukan. Nilainya dalam sumbu global, atau, jika `lcs` diatur `true`, dalam sumbu joint itu sendiri, untuk joint yang diputar dengan [`updateLcs`](/id/solver/nodes-supports#inclined-supports). Gaya pada DOF yang ditahan tumpuan langsung masuk ke reaksi dan tidak melenturkan apa pun.

## Beban batang {#member-loads}

| Metode | Nilai | Beban |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | merata di sepanjang seluruh batang |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | linear, dari joint pertama ke joint kedua |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | gaya dan momen kopel, sejauh `a` meter dari joint pertama |

Beban garis selalu meliputi seluruh batang. Untuk beban pada sebagian bentang, bagi batang dengan sebuah joint di titik awal beban: joint tambahan tidak mengubah hasil apa pun. Beban terpusat atau momen kopel dapat diletakkan di mana saja pada batang.

### Sumbu global atau lokal {#global-or-local-axes}

Argumen terakhir, `lcs`, menentukan sumbu tempat komponen-komponennya dinyatakan:

- `false`: x dan z global. `fz` bekerja vertikal, berapa pun kemiringan batangnya.
- `true`: x lokal batang (sepanjang batang) dan z lokal (tegak lurus batang). `fz` bekerja tegak lurus batang.

Pada batang horizontal yang digambar dari kiri ke kanan, keduanya sama; jika digambar dari kanan ke kiri, `fz` lokal mengarah ke atas.

::callout{type="info" title="Beban garis dinyatakan per meter panjang batang"}
Kedua jenis beban garis bekerja per meter panjang batang itu sendiri. Pada kasau sepanjang 5 m dengan bentang horizontal 4 m, `[0, 10e3]` dalam sumbu global berjumlah 50 kN. Beban salju 10 kN/m yang diukur pada proyeksi horizontal setara dengan $10 \cdot 4/5 = 8$ kN/m sepanjang kasau: berikan `[0, 8e3]`.
::

## Mengubah atau menghapus beban {#change-or-remove-a-load}

Setiap metode `create…` mengembalikan bebannya. Ubah nilainya, lalu hitung lagi:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // beban dua kali lipat
solver.solve()
```

Beban disimpan dalam array biasa, `lc.nodalLoadList` dan `lc.elementLoadList` (beban batang dan beban suhu), sehingga `lc.elementLoadList.splice(index, 1)` menghapus salah satunya. Nama properti setiap beban tercantum di [referensi](/id/solver/reference#loads).

Perubahan suhu dan penurunan tumpuan juga merupakan beban: lihat [Suhu dan penurunan tumpuan](/id/solver/temperature-settlements).
