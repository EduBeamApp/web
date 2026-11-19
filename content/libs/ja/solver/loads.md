---
title: 節点荷重と部材荷重
description: "@edubeam/fem で節点に力とモーメントを、部材に等分布・台形分布・集中荷重を、グローバルまたはローカル座標系で与え、変更・削除する方法。"
order: 6
group: 荷重
source: site
---

# 節点荷重と部材荷重 {#nodal-and-member-loads}

荷重は荷重ケースに属します。ソルバーには最初から荷重ケースが 1 つ（`solver.loadCases[0]`）あり、その `create…` メソッドを呼ぶたびに荷重が 1 つ追加され、その荷重が返されます。複数の荷重ケースとその組み合わせについては、[荷重ケース](/ja/solver/load-cases)を参照してください。

値の単位は N、N/m、N·m で、[座標軸](/ja/solver/conventions#axes)の向きに従います。+z は下向き、正のモーメントは反時計回りです。

## あらゆる種類の荷重を受ける梁 {#a-beam-with-every-kind}

ピン支点とローラー支点で支えたスパン 8 m の梁に、4 kN/m から 10 kN/m まで増える線荷重、20 kN の集中荷重、10 kNm の集中モーメント、ローラー支点での水平力をかけます。

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // ピン支点
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // ローラー支点
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// A で 4 kN/m、B で 10 kN/m まで増える下向きの荷重
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]：A から 2 m の位置に下向き 20 kN
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// A から 6 m の位置に反時計回りの集中モーメント 10 kNm
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// B に右向き 5 kN
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions は mathjs の Matrix または配列を返すので、配列にそろえる
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [出力]
[ -5000, -40250 ]
[ -35750 ]
```

手計算で確かめます。線荷重の合計は 56 kN で、A から 4.571 m の位置に作用します。A まわりのモーメントのつり合いから $8R_B = 56 \cdot 4.571 + 20 \cdot 2 - 10 = 286$、よって $R_B = 35.75$ kN（上向き）、$R_A = 76 - 35.75 = 40.25$ kN（上向き）です。ピン支点は 5 kN の水平力も受け止めるので、梁全体に 5 kN の引張が生じます。

::model-figure{caption="同じ荷重。図では 6 m の位置に節点 C を置いて集中モーメントをかけていますが、結果は同じです。"}
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

## 節点荷重 {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

必要な成分だけを指定します。値はグローバル座標系で与えます。[`updateLcs`](/ja/solver/nodes-supports#inclined-supports) で座標軸を回転させた節点では、`lcs` を `true` にすると、節点自身の座標軸で与えられます。支点が拘束している自由度に作用する力は、そのまま反力になり、部材を曲げません。

## 部材荷重 {#member-loads}

| メソッド | 値 | 荷重 |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | 部材全長にわたる等分布荷重 |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | 始端節点から終端節点まで直線的に変化する荷重 |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N、N·m、m | 始端節点から `a` m の位置に作用する力と集中モーメント |

線荷重は、常に部材の全長にわたって作用します。スパンの一部だけにかかる荷重は、荷重が始まる位置に節点を置いて部材を分割します。節点を追加しても結果は変わりません。集中荷重と集中モーメントは、部材上のどこにでも置けます。

### グローバル座標系とローカル座標系 {#global-or-local-axes}

最後の引数 `lcs` で、成分をどちらの座標系で表すかを指定します。

- `false`：グローバル座標系の x と z。`fz` は部材の傾きに関係なく鉛直に作用します。
- `true`：部材のローカル座標系の x（部材軸方向）と z（部材軸に直交する方向）。`fz` は部材に垂直に作用します。

左から右へ描いた水平な部材では、両者は一致します。右から左へ描いた場合は、ローカルの `fz` が上を向きます。

::callout{type="info" title="線荷重は部材長 1 m あたりの値"}
どちらの座標系でも、線荷重は部材自身の長さ 1 m あたりの値です。水平方向に 4 m 渡る長さ 5 m の垂木では、グローバル座標系で `[0, 10e3]` と与えた荷重の合計は 50 kN になります。水平投影長さに対して 10 kN/m の積雪荷重は、垂木に沿って $10 \cdot 4/5 = 8$ kN/m なので、`[0, 8e3]` と指定します。
::

## 荷重の変更と削除 {#change-or-remove-a-load}

`create…` メソッドは、どれも作成した荷重を返します。その値を変更して、もう一度解きます。

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // 荷重を 2 倍にする
solver.solve()
```

荷重は単純な配列 `lc.nodalLoadList` と `lc.elementLoadList`（部材荷重と温度荷重）に入っているので、`lc.elementLoadList.splice(index, 1)` で 1 つ削除できます。各荷重のプロパティ名は [API リファレンス](/ja/solver/reference#loads)にあります。

温度変化と支点沈下も荷重として扱います。[温度荷重と支点沈下](/ja/solver/temperature-settlements)を参照してください。
