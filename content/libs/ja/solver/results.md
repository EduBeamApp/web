---
title: 結果の読み出し
description: "解いた @edubeam/fem モデルから、反力、節点変位、部材上の任意の点の断面力、変位図、材端力を読み出します。各メソッドの戻り値の形も示します。"
order: 10
source: site
---

# 結果の読み出し {#reading-results}

`solve()` の後、結果は節点と部材から、荷重ケースを指定して読み出します。このページの例はすべて同じモデルを使います。せん断変形を無視した IPE 200 によるスパン 6 m の単純梁で、A から 2 m の位置に 20 kN の集中荷重がかかっています。

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // せん断変形なし

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="スパン 6 m、2 m の位置に 20 kN"}
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

## 読み出し方の一覧 {#what-to-read-where}

| 結果 | 呼び出し | 戻り値 |
| --- | --- | --- |
| 反力 | `node.getReactions(lc)` | `{ dofs, values }`：N、N·m |
| 変位 | `node.getUnknowns(lc, dofs)` | m、rad |
| 1 点での N、V、M | `beam.computeBendingMomentAt(lc, x)` | 数値：N、N·m |
| 部材に沿った N、V、M | `beam.computeBendingMoment(lc, n)` | `{ x, M }`、n + 1 点 |
| 変位図 | `beam.computeLocalDefl(lc, n)` | `{ u, w }`、n + 1 点、m |
| 材端力 | `beam.computeEndForces(lc)` | 6 成分の mathjs の Matrix |

N と V には `computeNormalForceAt` と `computeShearForceAt`、`computeNormalForce` と `computeShearForce` を使い、配列版の戻り値は `{ x, N }` と `{ x, V }` です。符号については[単位と符号](/ja/solver/conventions#signs-of-the-results)を参照してください。

## 反力 {#reactions}

`getReactions` は、支点が拘束する自由度ごとに 1 つの反力を返します。`dofs` には `createNode` に渡した順に自由度が並び、`values` には同じ順で反力が入っています。`values` は、反力が複数あるときは **mathjs の Matrix**、1 つだけのときは普通の配列です。小さなヘルパー関数を用意すれば、どちらの場合も配列として扱えます。

```ts
/** mathjs の Matrix、配列、数値を普通の配列にする。 */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]：DofID.Dx、DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

並び順に関係なく特定の反力を取り出すには、`list(values)[dofs.indexOf(DofID.Dz)]` のように、その自由度の位置を探します。[連続梁のプログラム例](/ja/solver/beams#a-continuous-beam)でもこの方法を使っています。

反力は、支点が構造物に及ぼす力です。z 方向の −13,333 N は上向きに押す 13.3 kN で、$P\,b/L = 20 \cdot 4/6$ です。[座標軸を回転させた](/ja/solver/nodes-supports#inclined-supports)節点では、反力はその軸で表されます。`getReactions(lc, true)` はそれをグローバル座標系に変換し、3 つの自由度すべてについて返します。拘束していない自由度は 0 です。支点のない節点では `{ dofs: [], values: [] }` が返ります。

## 変位 {#displacements}

`getUnknowns` は、拘束の有無にかかわらず、節点の任意の自由度を読み出します。

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A は時計回りに 0.010892 rad 回転します。$P\,b\,(L^2 - b^2)/6EIL$ です。自由度を 1 つだけ指定すると、TypeScript の型宣言は Matrix ですが、実際には普通の数値が返ります。これも `list` で処理できます。

## 部材に沿った断面力 {#internal-forces-along-a-member}

`…At` メソッドは、部材の始端節点から `x` m の位置の値を返します。

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N：荷重位置では、荷重を過ぎた側の値
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m：R_A · 2
```

集中荷重によって値が不連続に変わる位置では、ちょうど荷重点での値は、荷重を過ぎた側（始端節点から遠い側）の値になります。手前側の値を読むには、`x - 1e-9` のように、ほんのわずか手前の位置を指定します。

配列を返すメソッドは、部材を両端を含む等間隔の n + 1 点で評価します。

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }（丸め誤差を除く）
```

厳密な値が 0 の箇所に、`-3.6e-12` のような丸め誤差が出ることがあります。表示する前に `toFixed` で数値を整形してください。部材に沿った最大値は、`computeBendingMoment(lc, 500)` のように細かく評価した値の最大値として求めます。[連続梁のプログラム例](/ja/solver/beams#a-continuous-beam)がその例です。分布荷重のもとでは M は多項式なので、厳密な極値は V が 0 になる位置にあります。[@edubeam/plot](/ja/plot/model#reading-values-yourself) はその位置を厳密に求めます。

## 変位図 {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl` は、部材のローカル座標系で、部材軸方向の変位 `u` と軸に直交する方向の変位 `w` を返します。`computeGlobalDefl` は、同じ点の変位をグローバル座標系の x と z で返します。荷重点のたわみ 17.43 mm は $P\,a^2 b^2/3EIL$ です。節点間の形状は端部の値からの補間ではなく、厳密な値です。描画については[結果の描画](/ja/solver/drawing)を参照してください。

## 材端力 {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]：X12、Z12、M12、X21、Z21、M21
```

2 つの節点が部材に及ぼす力を、部材のローカル座標系で表したものです。アプリの*要素結果*の表に出る数値と同じで、[材端力](/ja/elements/conventions#end-forces-element-results-table)で説明しています。

## 結果を検算する {#results-as-numbers-to-check}

ここまでの値は、すべてそれぞれの公式と一致します。[手計算による結果の確認](/ja/guide/verification)のページでは、教科書の例題をさらに多く取り上げ、同じソルバーでブラウザ上で解いて確かめています。
