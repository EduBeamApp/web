---
title: 梁
description: "片持ち梁と 2 径間連続梁を解く @edubeam/fem の完全なプログラムとその出力。どちらも教科書の公式で確かめてあります。"
order: 12
group: プログラム例
source: site
---

# 梁 {#beams}

コピーして書き換えられる完全なプログラムを 2 つ紹介します。どちらもせん断変形を無視した断面（`k: 1e32`）を使うので、数値はオイラー・ベルヌーイ梁の公式と完全に一致します。[インストール](/ja/solver/getting-started#install)のとおりに準備したフォルダーで、`node cantilever.ts`（Node 22.18 以降）のように実行してください。

## 片持ち梁 {#a-cantilever}

長さ 4 m で、A を固定し、自由端に下向きに 18 kN をかけます。

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // 固定
const tip = domain.createNode('B', [4, 0, 0]) // 自由
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 先端に下向き 18 kN
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // 固定端の曲げモーメント（N·m）
console.log(tip.getUnknowns(lc, [DofID.Dz])) // 先端のたわみ（m）
```

```text [出力]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm（負の曲げモーメント、上側引張）、先端のたわみは $FL^3/3EI = 94.11$ mm です（$EI = 4.0803$ MNm²）。同じ片持ち梁は、EduBeam アプリの例題にもあります。

## 連続梁 {#a-continuous-beam}

3 つの支点に載ったスパン 5 m の 2 径間連続梁で、両スパンに 10 kN/m がかかります。反力、中間支点上の曲げモーメント、スパン内の最大曲げモーメントを求めます。

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

// getReactions は mathjs の Matrix または配列を返すので、配列にそろえる
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// スパン 1 の正の曲げモーメントの最大値（部材上の 501 点から求める）
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [出力]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

等スパンの 2 径間連続梁の教科書の値は、$R_A = R_C = 0.375\,qL$、$R_B = 1.25\,qL$、$M_B = -qL^2/8$ です。スパン内の最大曲げモーメントは $x = R_A/q = 1.875$ m の位置で $R_A^2/2q = 17.58$ kNm です。サンプリングでは評価点 1.87 m で最大となり、真の値との差は 0.0002 kNm 以内です。

::model-figure{caption="スパン 5 m の 2 径間連続梁、10 kN/m"}
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

図では IPE 200 ではなく、アプリの例題の断面を使っています。全体で同じ断面を使う連続梁の断面力は剛性に依存しないので、図の数値は同じになります。違うのはたわみだけです。

## 書き換えてみる {#change-it}

- **スパン長や荷重を変える**：C の座標や荷重のリストを変更します。片方のスパンだけに荷重をかけると、おなじみの交互載荷の状態になります。
- **3 径間にする**：節点 D と部材 `['C', 'D']` を追加します。
- **固定端にする**：A に `[DofID.Dx, DofID.Dz, DofID.Ry]` を与えます。
- **せん断変形を考慮する**：長方形断面なら `k: 5 / 6`、またはその断面のせん断補正係数を指定します。
- **図にする**：ソルバーを [@edubeam/plot](/ja/solver/drawing) に渡します。

同じような梁を EduBeam アプリで作る手順は[チュートリアル：連続梁と支点沈下](/ja/tutorials/continuous-beam)に、ほかの教科書の例題と公式は[手計算による結果の確認](/ja/guide/verification)のページにあります。
