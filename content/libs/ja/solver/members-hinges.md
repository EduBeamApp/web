---
title: 部材とヒンジ
description: "Beam2D 部材で節点をつなぎ、材端ヒンジで曲げモーメントを解放し、トラス材をモデル化します。@edubeam/fem から要素の剛性マトリクスと座標変換マトリクスも取り出せます。"
order: 5
source: site
---

# 部材とヒンジ {#members-and-hinges}

部材はすべて `Beam2D` です。x–z 平面内にある 2 節点の直線のティモシェンコ梁で、軸力、せん断力、曲げモーメントを伝えます。端部のヒンジは、その位置の曲げモーメントを解放します。コード片は、[クイックスタート](/ja/solver/getting-started)のようなプログラムの `solver`、`domain`、`lc` と、材料 `'steel'`、断面 `'IPE200'` を使います。

## 部材の作成 {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| 引数 | 型 | 意味 |
| --- | --- | --- |
| `label` | `string \| number` | 部材の名前。文字列として保存される |
| `nodes` | `[label, label]` | 始端節点と終端節点。ローカル x は始端から終端に向かう。[部材の向き](/ja/solver/conventions#member-direction)を参照 |
| `mat`, `cs` | `string \| number` | 材料と断面のラベル |
| `hinges` | `[boolean, boolean]` | 始端と終端のヒンジの有無。省略可能。既定値は `[false, false]`（両端とも剛接合） |

戻り値は `Beam2D` です。結果を読むときに使うので、変数に入れておきましょう。`domain.getElement(label)` でも取り出せますが、型は一般的な `Element` になるので、TypeScript では結果を読む前に `as Beam2D` が必要です。

ヒンジなしで 1 つの節点に集まる部材どうしは剛接合され、一緒に回転します。節点、材料、断面はどの順序で作成してもかまいません。解く時点ですべて揃っていれば十分です。どれかが欠けていると、`solve()` は欠けているものの名前を示す `RangeError` を投げます。

## 材端ヒンジ {#end-hinges}

ヒンジは節点ではなく、部材端に属します。次の例では、部材 2 の始端 C にヒンジがあります。そのため C は、スパン C–D から片持ち梁 A–C へ、せん断力は伝えますが曲げモーメントは伝えません。

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // ヒンジ位置で 0
cd.computeBendingMomentAt(lc, 2) // 20000 N·m：4 m スパンの qL²/8
ac.computeBendingMomentAt(lc, 0) // -40000 N·m：C–D から受ける 20 kN が 2 m 離れて作用
```

::model-figure{caption="ヒンジでつながれたスパンを支える片持ち梁：C で曲げモーメントは 0"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

複数の部材がヒンジ節点に集まる場合は、1 本を除くすべての部材端にヒンジを付ければ十分です。すべての部材端にヒンジを付けても解けます。その場合は節点を回転させるものがないので、ソルバーはその回転角を 0 と報告します。ただし、そうした節点にモーメントを作用させると、それを受け止める部材がないため、[解析に失敗します](/ja/solver/solving#when-solving-fails)。

## トラス材 {#truss-bars}

両端にヒンジを付けた部材は、節点だけで荷重を受ける限り、軸力しか伝えません。これがトラス材です。

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

[トラスのプログラム例](/ja/solver/trusses)では、この方法でトラス全体を解きます。一方、EduBeam アプリのトラスの例題は剛接合を使い、断面積を非常に大きくして、曲げモーメントが軸力に比べて無視できるようにしています。どちらも正しいモデルで、違いはそのわずかな曲げモーメントだけです。トラス材自身の剛性マトリクスは、理論マニュアルの[トラス要素](/ja/elements/truss)のページで導いています。

## 要素のマトリクス {#the-element-s-matrices}

解析手法そのものを教えられるように、`Beam2D` は自身のマトリクスを [mathjs](https://mathjs.org) の Matrix として返します。`.toArray()` で `number[][]` に変換できます。

| メソッド | 得られるもの |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`：部材長と射影長（m） |
| `computeLocalStiffnessMtrx().answer` | ローカル座標系の 6 × 6 剛性マトリクス（ヒンジは縮約済み） |
| `computeT()` | グローバル座標系からローカル座標系への 6 × 6 座標変換マトリクス |
| `computeStiffness()` | グローバル座標系の 6 × 6 剛性マトリクス、$T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][]、単位は N/m、N、N·m
```

自由度の順序は $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$ です。これらのマトリクスは理論マニュアルの[梁要素](/ja/elements/beam)のページで導き、その組み立て方は[EduBeam がモデルを解く仕組み](/ja/elements/analysis)で説明しています。
