---
title: ラーメン
description: "柱、剛な隅角部、頂部ヒンジを持つ 3 ヒンジラーメンを解く @edubeam/fem の完全なプログラムと、手計算による検算。"
order: 13
source: site
---

# ラーメン {#frames}

ラーメンは、梁と柱を隅角部で剛に接合した構造物です。このプログラム例では、[チュートリアル：3 ヒンジラーメン](/ja/tutorials/three-hinged-frame)のラーメンをコードで作ります。A と E でピン支持された高さ 4 m の柱 2 本と、C にヒンジを持つスパン 8 m の梁からなり、梁に 10 kN/m がかかります。チュートリアルでは節点に 1〜5 の番号を付けていますが、ここでは A〜E とします。

::model-figure{caption="下のプログラムのラーメン：A と E にピン支点、C にヒンジ、10 kN/m"}
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

// z は下向き：高さ 4 m の柱の頂部は z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // 頂部ヒンジ
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // 下から上へ
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // C にヒンジ
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions は mathjs の Matrix または配列を返すので、配列にそろえる
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

```text [出力]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## 手計算で確認する {#check-it-by-hand}

| 量 | 手計算 | ソルバー |
| --- | --- | --- |
| 鉛直反力 | $q \cdot 8/2 = 40$ kN（上向き） | A と E で $R_z = -40$ kN |
| 水平反力 | 左半分で $M_C = 0$ から $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN（内向き） | A で $R_x = +20$ kN、E で $-20$ kN |
| 隅角部の曲げモーメント | $-20 \cdot 4 = -80$ kNm | 梁でも柱でも $-80$ kNm |
| B から 2 m の位置の曲げモーメント | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| ヒンジ位置の曲げモーメント | 0 | 0 |

## 注目する点 {#things-to-notice}

- **柱は上に伸びるので、z は負**になります。柱の頂部は $z = -4$ にあります。
- **柱のローカル座標軸**：部材 1 は A から B へ上向きに定義しているので、ローカル z は右、つまりラーメンの内側を向きます。柱頭の曲げモーメントは隅角部の梁と同じ −80 kNm で、外側が引張です。柱を B から A へ下向きに定義すると、ローカル z は左を向きます。すると曲げモーメントの符号が変わり、`x` は柱頭から測られます。[部材の向き](/ja/solver/conventions#member-direction)を参照してください。
- **ヒンジ 1 つに部材端 1 つ**：ヒンジは、C における部材 2 の端部にあります。部材 3 は C から剛に始まります。部材端を 1 つ解放すれば、C はヒンジになります。
- **梁の荷重はグローバル座標系で与える**：`false` を指定すると荷重はグローバル座標系で表され、部材の傾きに関係なく鉛直に作用します。左から右へ描いた水平な梁では、ローカル座標系で与えた場合と同じです。

## 不静定ラーメン {#statically-indeterminate-frames}

ヒンジを外して `[false, false]` にすると、1 次不静定の門形ラーメンになります。その断面力は、柱に対する梁の剛性の比によって変わります。部材ごとに違う断面を与えると、それを確かめられます。[チュートリアルの「いろいろ試す」](/ja/tutorials/three-hinged-frame#_7-experiment)では、柱脚を固定し、ラーメンを横から押してみます。確認用の数値も載っています。@edubeam/plot の[スライドと講義資料](/ja/plot/slides)のページでは、こうした門形ラーメンを順を追って描いています。
