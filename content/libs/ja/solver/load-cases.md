---
title: 荷重ケース
description: "1 つの @edubeam/fem モデルで複数の荷重ケースを一度に解き、その結果を重ね合わせて荷重の組み合わせと包絡線を求めます。"
order: 8
source: site
---

# 荷重ケース {#load-cases}

荷重ケースは、一緒に解く荷重のまとまりです。ソルバーには最初から 1 つあります。荷重ケースを追加すると、1 回の `solve()` で、同じ剛性マトリクスを使ってすべての荷重ケースを解きます。解析は線形なので、異なる荷重ケースの結果に係数を掛けて足し合わせることができます。荷重の組み合わせとは、要するにそれだけのことです。

## 荷重ケースの追加 {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // どのソルバーにも最初からある荷重ケース
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // スパン中央に 20 kN
solver.solve() // すべての荷重ケースを解く

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [出力]
45000
30000
```

結果を読み出すメソッドはすべて、読み出す荷重ケースを引数に取ります。最初の荷重ケースのラベルは `'DefaultLC'` です。ラベルは単なる名前で、ソルバーは荷重ケースをオブジェクトそのもので区別します。

## 組み合わせる {#combine-them}

各荷重ケースの結果に係数を掛けて足し合わせます。たとえばユーロコードの終局限界状態 $1.35\,G + 1.5\,Q$ のスパン中央の値は次のとおりです。

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

反力、変位、そのほかのすべての結果も同じように組み合わせられます。部材全体で組み合わせるには、点ごとに計算します。`computeBendingMoment(lc, n)` が返す配列は、どの荷重ケースでも同じ `x` を使います。

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m（x = 3）
```

包絡線（複数の組み合わせにわたる最大値と最小値）は、こうした配列に点ごとに `Math.max` と `Math.min` を適用すれば求まります。移動荷重の場合は、代わりに荷重位置ごとに 1 回ずつ解きます。[影響線のプログラム例](/ja/solver/scripts#an-influence-line-as-csv)がその方法です。

## EduBeam アプリでは {#in-the-edubeam-app}

アプリは一度に 1 つの荷重ケースしか解かないので、荷重の組み合わせはライブラリならではの機能です。複数の荷重ケースを持つモデルも、荷重ケースごとに[描画](/ja/solver/drawing)できます。@edubeam/plot の `StructurePlot` は、`solver.loadCases` のインデックスを `loadCase` で受け取ります。
