---
title: Balok
description: "Program @edubeam/fem lengkap untuk kantilever dan balok menerus dua bentang, beserta keluarannya, masing-masing diperiksa terhadap rumus dari buku teks."
order: 12
group: Contoh program
source: site
---

# Balok {#beams}

Dua program lengkap untuk disalin dan diubah. Keduanya memakai penampang yang kaku geser (`k: 1e32`), sehingga angkanya tepat sama dengan rumus Euler–Bernoulli. Jalankan dengan `node cantilever.ts` (Node 22.18 atau yang lebih baru), di folder yang disiapkan seperti di [Instalasi](/id/solver/getting-started#install).

## Kantilever {#a-cantilever}

Panjang 4 m, dijepit di A, beban 18 kN ke bawah di ujung bebas:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // jepit
const tip = domain.createNode('B', [4, 0, 0]) // bebas
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN ke bawah di ujung bebas
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m di jepit
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, lendutan ujung
```

```text [Keluaran]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, momen negatif, dan lendutan ujungnya $FL^3/3EI = 94{,}11$ mm, dengan $EI = 4{,}0803$ MNm². Kantilever yang sama juga merupakan salah satu contoh di aplikasi EduBeam.

## Balok menerus {#a-continuous-beam}

Dua bentang 5 m di atas tiga tumpuan, dengan beban 10 kN/m pada keduanya. Yang dihitung: reaksi, momen di atas tumpuan tengah, dan momen lapangan terbesar:

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// getReactions memberikan Matrix mathjs atau array: jadikan array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// Momen positif terbesar di bentang 1, dari 501 titik di sepanjang bentang
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Keluaran]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Nilai dari buku teks untuk dua bentang yang sama panjang: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$, dan momen lapangan terbesar $R_A^2/2q = 17{,}58$ kNm, di $x = R_A/q = 1{,}875$ m. Pengambilan sampel menemukannya di titik grid 1,87 m, dengan selisih kurang dari 0,0002 kNm dari nilai sebenarnya.

::model-figure{caption="Dua bentang 5 m dengan beban 10 kN/m"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

Gambar ini memakai penampang contoh dari aplikasi, bukan IPE 200. Jika seluruh balok memakai satu penampang yang sama, gaya dalam balok menerus tidak bergantung pada kekakuannya, sehingga diagramnya menunjukkan angka yang sama; hanya lendutannya yang berbeda.

## Mengubah programnya {#change-it}

- **Bentang atau beban yang tidak sama:** ubah koordinat C atau daftar bebannya. Beban pada satu bentang saja memberikan pola pembebanan berselang yang sudah Anda kenal.
- **Tiga bentang:** tambahkan joint D dan batang `['C', 'D']`.
- **Ujung jepit:** beri A `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Deformasi geser yang sesungguhnya:** `k: 5 / 6` untuk penampang persegi panjang, atau koefisien geser penampang Anda.
- **Gambarnya:** serahkan solver ke [@edubeam/plot](/id/solver/drawing).

[Tutorial: balok menerus dan penurunan tumpuan](/id/tutorials/continuous-beam) membangun balok seperti ini di aplikasi EduBeam, dan halaman [Memeriksa hasil secara manual](/id/guide/verification) memuat lebih banyak kasus dari buku teks beserta rumusnya.
