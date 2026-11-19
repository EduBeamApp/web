---
title: 描画モデル
description: "modelFromSolver が解析済みの @edubeam/fem モデルから作る、JSON にシリアライズできるプレーンな PlotModel。区分多項式で表した結果と、厳密な値や極値の読み取り方。"
order: 9
source: site
---

# 描画モデル

@edubeam/plot が描くものは、すべて `PlotModel` から作られます。これは、`modelFromSolver` が解析済みの @edubeam/fem モデルから読み出すプレーンなデータです。形状、支点、荷重、反力に加え、各部材の結果を厳密な多項式として保持します。JSON にシリアライズできるので、ビルド時に作ってソルバーの代わりに配信できます。また、解析済みの構造物から厳密な値や極値を読み出すいちばん簡単な方法でもあります。

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // または modelFromSolver(solver, { loadCase: 1 })
```

`results` は、荷重ケースが解かれているときだけ含まれます。`results` がなくても、コンポーネントはモデルそのものを描けます。さらに [`reactionLabels: 'names'`](/ja/plot/structure-plot#reactions-as-unknowns) を指定すれば未知の反力も描けるので、解いていないモデルをそのまま演習プリントにできます。

## データ形式 {#the-format}

値はすべて SI 単位（m、N、N·m、N/m、K、rad）で、ソルバーの座標軸に従います。x は右向き、z は下向き、回転は画面上で反時計回りが正です。

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // 解析済みの荷重ケースのみ
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // 拘束された自由度
  readonly angle: number // 回転させた支点の座標軸の回転角、rad、画面上で時計回り
}

interface PlotMember {
  readonly id: string
  readonly start: string // 節点の id
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // 部材の id ごと
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // 軸力、引張が正
  readonly V: Piecewise // せん断力
  readonly M: Piecewise // 曲げモーメント、ローカル +z 側が引張のとき正
  readonly u: Piecewise // ローカル x 方向の変位
  readonly w: Piecewise // ローカル z 方向の変位
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // 節点の座標軸方向に構造物へ作用する力、N（ry では N·m）
}
```

荷重は 7 種類あり、`kind` で区別します。

| `kind` | フィールド | 内容 |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | 節点に作用する力、グローバル成分、N |
| `'nodalMoment'` | `node`, `my` | 節点に作用するモーメント、N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | 直線的に変化する分布荷重。両端の `{ fx, fz }`、N/m。両端が等しければ等分布 |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | 部材の始端から `at` m の位置に作用する力 |
| `'pointMoment'` | `member`, `at`, `my` | 部材に作用する集中モーメント |
| `'temperature'` | `member`, `uniform`, `gradient` | K：図心の温度変化と、下面と上面の温度差（下面 − 上面） |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | 節点の座標軸方向の支点の強制変位、m と rad |

`local` は、成分がグローバル座標系ではなく部材のローカル x、z 方向のとき `true` です。

## 区分多項式 {#piecewise-polynomials}

部材の結果は `Piecewise`、つまり区間（piece）のリストです。各区間は、部材の一部分での多項式です。集中荷重や集中モーメントで結果が折れたり跳んだりする位置で、新しい区間が始まります。

```ts
interface Piece {
  readonly x0: number // 部材の始端からの距離、m
  readonly x1: number
  readonly c: readonly number[] // 値 = Σ c[k]·sᵏ、s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N、V、M は高々 3 次、たわみは高々 5 次なので、わずかな係数でソルバーの解を厳密に保持できます。6 m の梁の 2 m の位置に 20 kN が作用する場合、せん断力は定数の区間 2 つになります。

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## 自分で値を読む {#reading-values-yourself}

断面力図を描く関数は、図の値を読むのにも使えます。サンプリングせず、厳密に読めます。

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// 6 m の単純梁、A から 2 m の位置に 20 kN、せん断変形なしの IPE 200
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]：荷重の位置で区間がつながる
valueAt(V, 2, 'left') // 13333.3 N、荷重の直前
valueAt(V, 2, 'right') // -6666.7 N、荷重の直後
extremes(M) // 最大 26666.7 N·m（x = 2）
extremes(w) // 最大 0.018973 m（x = 2.734）
```

`extremes` は `{ max, min }` を返し、それぞれ `{ x, value, side }` です。空のリストには `null` を返します。最大たわみは荷重の真下ではなく、$x = L - \sqrt{(L^2 - a^2)/3} = 2.734$ m の位置に生じ、その値は $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18.97$ mm です。中央からずれた集中荷重の公式どおりです。

[問題ジェネレーター](/ja/plot/exercises#the-generator)は、この方法で解答用の最大・最小曲げモーメントを求めています。残りの関数（勾配、区間内の極値、次数、ベジェ曲線）は[関数](/ja/plot/functions#piecewise-polynomials)のページにあります。

## JSON で配信する {#ship-it-as-json}

`JSON.stringify(model)` だけで済みます。`JSON.parse` で戻したモデルは、ソルバーから描いたときとまったく同じに描けます。分布荷重と集中荷重を受ける門形ラーメンでも 2 kB 未満です。[埋め込み](/ja/plot/embedding#ship-the-drawing-not-the-solver)を参照してください。モデルは [`structureSvg`](/ja/plot/functions#a-standalone-svg-file) にも渡せ、SVG ファイルとして書き出せます。
