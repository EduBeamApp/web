---
title: Portal
description: "Program @edubeam/fem lengkap untuk portal tiga sendi, dengan kolom, sudut portal yang kaku, dan sendi puncak, beserta hasilnya yang diperiksa secara manual."
order: 13
source: site
---

# Portal {#frames}

Portal terdiri atas balok dan kolom yang tersambung secara kaku di sudut-sudutnya. Contoh program ini membangun portal dari [Tutorial: portal tiga sendi](/id/tutorials/three-hinged-frame) dalam kode: dua kolom setinggi 4 m dengan tumpuan sendi di A dan E, balok 8 m dengan sendi di C, dan beban 10 kN/m pada balok. Tutorial itu menomori joint 1 sampai 5; di sini joint diberi nama A sampai E.

::model-figure{caption="Portal dari program di bawah: tumpuan sendi di A dan E, sendi di C, 10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// Sumbu z mengarah ke bawah: puncak kolom setinggi 4 m berada di z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // sendi puncak
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // dari bawah ke atas
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // sendi di C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions memberikan Matrix mathjs atau array: jadikan array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [Keluaran]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Memeriksa secara manual {#check-it-by-hand}

| Besaran | Perhitungan manual | Solver |
| --- | --- | --- |
| Reaksi vertikal | $q \cdot 8/2 = 40$ kN ke atas | $R_z = -40$ kN di A dan E |
| Reaksi horizontal | dari $M_C = 0$ pada separuh kiri: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, ke arah dalam | $R_x = +20$ kN di A, $-20$ kN di E |
| Momen sudut portal | $-20 \cdot 4 = -80$ kNm | $-80$ kNm di balok dan di kolom |
| Momen 2 m dari B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Momen di sendi | 0 | 0 |

## Yang perlu diperhatikan {#things-to-notice}

- **Kolom mengarah ke atas, jadi z bernilai negatif.** Puncak kolom berada di $z = -4$.
- **Sumbu lokal kolom.** Batang 1 berjalan dari A naik ke B, sehingga sumbu z lokalnya mengarah ke kanan, ke dalam portal. Momennya di puncak adalah −80 kNm, sama seperti momen balok di sudut portal: serat luar tertarik. Jika kolom didefinisikan dari B turun ke A, sumbu z lokalnya mengarah ke kiri: tanda momennya berubah, dan `x` dihitung dari puncak. Lihat [Arah batang](/id/solver/conventions#member-direction).
- **Satu sendi, satu ujung batang.** Sendi terletak di ujung batang 2 di C; batang 3 berawal secara kaku di C. Satu ujung yang dilepas sudah cukup untuk menjadikan C sebuah sendi.
- **Beban global pada balok.** `false` memberikan beban dalam sumbu global: vertikal, berapa pun kemiringan batangnya. Pada balok horizontal yang digambar dari kiri ke kanan, hasilnya sama dengan sumbu lokal.

## Portal statis tak tentu {#statically-indeterminate-frames}

Hapus sendinya, `[false, false]`, maka portal menjadi portal dua sendi dengan satu reaksi kelebihan (redundan). Gaya-gayanya kemudian bergantung pada kekakuan balok dibandingkan dengan kolom: beri batang-batangnya penampang yang berbeda untuk melihatnya. Bagian [Bereksperimen](/id/tutorials/three-hinged-frame#_7-experiment) dalam tutorial itu menjepit kaki kolom dan mendorong portal ke samping, lengkap dengan angka untuk pembanding. Halaman [Slide dan catatan kuliah](/id/plot/slides) dari @edubeam/plot menggambar portal seperti ini langkah demi langkah.
