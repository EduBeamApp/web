---
title: Rangka batang
description: "Rangka batang Warren bersendi di @edubeam/fem, tiap gaya batang diperiksa dengan metode potongan, dan loop pembuat rangka batang dengan jumlah panel berapa pun."
order: 14
source: site
---

# Rangka batang {#trusses}

Rangka batang terdiri atas batang-batang yang bersendi di kedua ujungnya dan dibebani di joint, sehingga setiap batang hanya memikul gaya normal. Contoh program ini membangun rangka batang Warren dari dua daftar, memeriksa setiap gaya batang secara manual, lalu membuat rangka batang dengan ukuran berapa pun dalam sebuah loop.

::model-figure{caption="Rangka batang Warren: bentang 9 m, tinggi 1,8 m, 8 kN di setiap joint atas"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members:
  - { nodes: [A, B], hinges: [true, true] }
  - { nodes: [B, C], hinges: [true, true] }
  - { nodes: [C, D], hinges: [true, true] }
  - { nodes: [E, F], hinges: [true, true] }
  - { nodes: [F, G], hinges: [true, true] }
  - { nodes: [A, E], hinges: [true, true] }
  - { nodes: [E, B], hinges: [true, true] }
  - { nodes: [B, F], hinges: [true, true] }
  - { nodes: [F, C], hinges: [true, true] }
  - { nodes: [C, G], hinges: [true, true] }
  - { nodes: [G, D], hinges: [true, true] }
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: [N, w]
show: [nodeLabels]
---
::

```ts [truss.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })

// Rangka batang Warren: bentang 9 m, tinggi 1.8 m, batang bawah A-B-C-D, batang atas E-F-G
const nodes: [string, number, number, DofID[]][] = [
  ['A', 0, 0, [DofID.Dx, DofID.Dz]],
  ['B', 3, 0, []],
  ['C', 6, 0, []],
  ['D', 9, 0, [DofID.Dz]],
  ['E', 1.5, -1.8, []],
  ['F', 4.5, -1.8, []],
  ['G', 7.5, -1.8, []],
]
for (const [label, x, z, support] of nodes) {
  domain.createNode(label, [x, 0, z], support)
}

// Setiap label menyebut kedua joint-nya. Bersendi di kedua ujung: hanya gaya aksial.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN ke bawah
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Keluaran]
AB 10.00 tension
BC 16.67 tension
CD 10.00 tension
EF -13.33 compression
FG -13.33 compression
AE -15.62 compression
EB 5.21 tension
BF -5.21 compression
FC -5.21 compression
CG 5.21 tension
GD -15.62 compression
```

Gaya normal batang rangka konstan, jadi cukup membacanya di `x = 0`. Label dua huruf sekaligus menyatakan pasangan joint-nya: `bar[0]` dan `bar[1]`.

## Memeriksa secara manual {#check-it-by-hand}

Setiap tumpuan memikul separuh dari 24 kN, yaitu 12 kN. Potong rangka batang dan ambil keseimbangan momen terhadap joint di seberang batang yang terpotong, seperti pada [metode potongan](/id/tutorials/truss):

| Batang | Potongan | Gaya |
| --- | --- | --- |
| BC, batang bawah | momen terhadap F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | 16,67 kN tarik |
| EF, batang atas | momen terhadap B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | 13,33 kN tekan |
| AE, diagonal ujung | joint A: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | 15,62 kN tekan |
| EB, diagonal | gaya geser di panel, $12 - 8 = 4$ kN: $4 \cdot 2{,}343/1{,}8$ | 5,21 kN tarik |

Penampang tidak mengubah gaya batang pada rangka batang statis tertentu; penampang hanya menentukan seberapa jauh joint berpindah. Gambar di atas memakai penampang lain, yaitu penampang dari aplikasi EduBeam, dan memberikan gaya yang sama.

## Jumlah panel berapa pun {#any-number-of-panels}

Untuk membangkitkan rangka batang secara otomatis, misalnya untuk soal latihan atau studi parametrik, bangun joint dan batangnya dalam loop, panel demi panel. Dengan `panels = 3`, hasilnya adalah rangka batang di atas, dan gaya yang dicetak pun sama; ubah `panels`, `w`, dan `h` untuk rangka batang lain.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // jumlah panel batang bawah
const w = 3 // lebar panel, m
const h = 1.8 // tinggi, m

// Joint bawah b0, b1, … di atas tumpuan sendi dan rol; joint atas t0, t1, … di antaranya
for (let i = 0; i <= panels; i++) {
  const ends = i === 0 ? [DofID.Dx, DofID.Dz] : i === panels ? [DofID.Dz] : []
  domain.createNode(`b${i}`, [i * w, 0, 0], ends)
}
for (let i = 0; i < panels; i++) {
  domain.createNode(`t${i}`, [(i + 0.5) * w, 0, -h])
  lc.createNodalLoad(`t${i}`, { [DofID.Dz]: 8e3 })
}

const members: Beam2D[] = []
const bar = (a: string, b: string) =>
  members.push(domain.createBeam2D(`${a}-${b}`, [a, b], 1, 1, [true, true]))
for (let i = 0; i < panels; i++) {
  bar(`b${i}`, `b${i + 1}`) // batang bawah
  bar(`b${i}`, `t${i}`) // diagonal naik
  bar(`t${i}`, `b${i + 1}`) // diagonal turun
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // batang atas
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

Waktu hitung solver bertambah cepat seiring ukuran model: beberapa puluh panel masih lancar, lihat [Ukuran model](/id/solver/solving#model-size). Untuk menggambar setiap rangka batang yang dibuat, dengan atau tanpa jawabannya, lihat [Soal latihan dan ujian](/id/plot/exercises) dari @edubeam/plot.

## Yang perlu diperhatikan {#things-to-notice}

- **Sendi di setiap ujung batang.** Setiap joint kemudian bebas berotasi, dan solver melaporkan rotasinya sebagai 0. Momen yang bekerja pada joint seperti itu tidak dipikul apa pun, dan [perhitungannya gagal](/id/solver/solving#when-solving-fails).
- **Beban di joint.** Beban di sepanjang batang akan melenturkannya: batang itu menjadi balok, bukan lagi batang rangka, dan memiliki diagram momen.

[Tutorial: rangka batang bidang](/id/tutorials/truss) membangun rangka batang di aplikasi EduBeam, dan halaman [Elemen rangka batang](/id/elements/truss) menurunkan kekakuan batangnya.
