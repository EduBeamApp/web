---
title: トラス
description: "@edubeam/fem でピン接合のワーレントラスを解き、すべての部材力を切断法で確かめ、任意の格間数のトラスをループで生成します。"
order: 14
source: site
---

# トラス {#trusses}

トラスは、両端をヒンジで接合したトラス材からなり、荷重を節点だけで受ける構造物です。そのため、どのトラス材にも軸力しか生じません。このプログラム例では、2 つのリストからワーレントラスを作り、すべての部材力を手計算で確かめてから、任意の大きさのトラスをループで生成します。

::model-figure{caption="ワーレントラス：スパン 9 m、高さ 1.8 m、上弦材の各節点に 8 kN"}
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

// ワーレントラス：スパン 9 m、高さ 1.8 m、下弦材 A-B-C-D、上弦材 E-F-G
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

// 各ラベルは両端の節点名。両端ヒンジなので軸力だけを受ける
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 下向き 8 kN
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [出力]
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

トラス材の軸力は材軸に沿って一定なので、`x = 0` で読めば十分です（出力の tension は引張、compression は圧縮）。2 文字のラベルは、そのまま両端の節点名（`bar[0]` と `bar[1]`）も兼ねています。

## 手計算で確認する {#check-it-by-hand}

各支点は、合計 24 kN の半分の 12 kN を受けます。トラスを切断し、切断したトラス材の反対側にある節点まわりのモーメントをとります。[切断法](/ja/tutorials/truss)と同じ手順です。

| 部材 | 切断と計算 | 部材力 |
| --- | --- | --- |
| BC（下弦材） | F まわりのモーメント：$(12 \cdot 4.5 - 8 \cdot 3)/1.8$ | 16.67 kN 引張 |
| EF（上弦材） | B まわりのモーメント：$(12 \cdot 3 - 8 \cdot 1.5)/1.8$ | 13.33 kN 圧縮 |
| AE（端斜材） | 節点 A：$12 \cdot \sqrt{1.5^2 + 1.8^2}/1.8$ | 15.62 kN 圧縮 |
| EB（斜材） | 格間のせん断力 $12 - 8 = 4$ kN から：$4 \cdot 2.343/1.8$ | 5.21 kN 引張 |

静定トラスの部材力は、断面によって変わりません。断面で決まるのは、節点がどれだけ動くかだけです。上の図は別の断面（EduBeam アプリの断面）を使っていますが、部材力は同じです。

## 任意の格間数 {#any-number-of-panels}

演習問題やパラメータースタディのためにトラスを生成するには、節点とトラス材を格間（パネル）ごとにループで作ります。`panels = 3` とすると上のトラスと同じになり、同じ部材力が出力されます。`panels`、`w`、`h` を変えれば、別のトラスになります。

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // 下弦材の格間数
const w = 3 // 格間長（m）
const h = 1.8 // トラスの高さ（m）

// 下弦材の節点 b0, b1, …（両端はピン支点とローラー支点）。その間に上弦材の節点 t0, t1, …
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
  bar(`b${i}`, `b${i + 1}`) // 下弦材
  bar(`b${i}`, `t${i}`) // 上り斜材
  bar(`t${i}`, `b${i + 1}`) // 下り斜材
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // 上弦材
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

ソルバーの計算時間は、規模とともに急速に増えます。数十格間程度なら問題ありません。[モデルの規模](/ja/solver/solving#model-size)を参照してください。生成したトラスを解答付きまたは解答なしで描くには、@edubeam/plot の[演習問題と試験](/ja/plot/exercises)を参照してください。

## 注目する点 {#things-to-notice}

- **すべての部材端にヒンジ**：どの節点も自由に回転でき、ソルバーはその回転角を 0 と報告します。そうした節点にモーメントを作用させると、受け止めるものがないので[解析に失敗します](/ja/solver/solving#when-solving-fails)。
- **荷重は節点に**：トラス材の途中に荷重をかけると、そのトラス材は曲げられます。そうなるとトラス材ではなく梁であり、曲げモーメント図が現れます。

EduBeam アプリでトラスを作る手順は[チュートリアル：平面トラス](/ja/tutorials/truss)に、トラス材の剛性の導出は[トラス要素](/ja/elements/truss)のページにあります。
