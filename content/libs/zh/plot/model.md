---
title: 绘图模型
description: "modelFromSolver 由求解后的 @edubeam/fem 模型生成的纯数据 PlotModel：可序列化为 JSON，结果为分段多项式，可从中读取精确数值和极值。"
order: 9
source: site
---

# 绘图模型

@edubeam/plot 绘制的一切都来自 `PlotModel`：由 `modelFromSolver` 从求解后的 @edubeam/fem 模型中读出的纯数据。它包含几何形状、支座、荷载、支反力，以及每根杆件以精确多项式表示的结果。它可以序列化为 JSON，因此可以在构建时生成，代替求解器提供给页面；要读取已求解结构的精确数值和极值，这也是最简便的方法。

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // 或 modelFromSolver(solver, { loadCase: 1 })
```

只有荷载工况已求解时才有 `results`。没有它时，组件只绘制模型本身；设置 [`reactionLabels: 'names'`](/zh/plot/structure-plot#reactions-as-unknowns) 时仍会画出未知支反力，所以未求解的模型也可以作为习题单。

## 数据格式 {#the-format}

所有数值都采用国际单位制（m、N、N·m、N/m、K、rad），坐标轴与求解器一致：x 向右，z 向下，转角在屏幕上以逆时针为正。

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // 仅当荷载工况已求解
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // 受约束自由度
  readonly angle: number // 旋转支座坐标轴的转角，rad，在屏幕上以顺时针为正
}

interface PlotMember {
  readonly id: string
  readonly start: string // 节点 id
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // 按杆件 id
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // 轴力，受拉为正
  readonly V: Piecewise // 剪力
  readonly M: Piecewise // 弯矩，局部 +z 一侧受拉为正
  readonly u: Piecewise // 沿局部 x 轴的位移
  readonly w: Piecewise // 沿局部 z 轴的位移
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // 作用在结构上、沿节点坐标轴的力，N（ry 为 N·m）
}
```

荷载共有七种，用 `kind` 区分：

| `kind` | 字段 | 含义 |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | 节点上的集中力，整体坐标分量，N |
| `'nodalMoment'` | `node`, `my` | 节点上的集中力偶，N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | 线性变化的线荷载，两端各一个 `{ fx, fz }`，N/m；两端相等时为均布荷载 |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | 距杆件起点 `at` m 处的集中力 |
| `'pointMoment'` | `member`, `at`, `my` | 杆件上的集中力偶 |
| `'temperature'` | `member`, `uniform`, `gradient` | K：形心处的温度变化，以及下缘减上缘的温差 |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | 沿节点坐标轴的给定支座位移，m 和 rad |

`local` 为 `true` 时，分量沿杆件的局部 x 轴和 z 轴，而不是整体坐标轴。

## 分段多项式 {#piecewise-polynomials}

杆件的结果是一个 `Piecewise`：一组分段，每段是杆件一部分上的多项式。凡是集中力或集中力偶使结果出现突变或折点的地方，就开始新的一段。

```ts
interface Piece {
  readonly x0: number // 距杆件起点的距离，m
  readonly x1: number
  readonly c: readonly number[] // 值 = Σ c[k]·sᵏ，其中 s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N、V 和 M 最高为三次，挠度最高为五次，所以几个系数就能精确保存求解器的解。跨度 6 m、在 2 m 处作用 20 kN 的梁，其剪力是两个常数段：

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## 自己读取数值 {#reading-values-yourself}

绘制内力图的函数同样可以读取它们，精确求值，无需采样：

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// 跨度 6 m 的简支梁，距 A 点 2 m 处作用 20 kN，IPE 200，不计剪切变形
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]：两段在荷载处相接
valueAt(V, 2, 'left') // 13333.3 N，荷载左侧
valueAt(V, 2, 'right') // -6666.7 N，荷载右侧
extremes(M) // 最大值 26666.7 N·m，位于 x = 2
extremes(w) // 最大值 0.018973 m，位于 x = 2.734
```

`extremes` 返回 `{ max, min }`，每个都是 `{ x, value, side }`；列表为空时返回 `null`。最大挠度不在荷载下方，而在 $x = L - \sqrt{(L^2 - a^2)/3} = 2.734$ m 处，其值为 $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18.97$ mm，与集中荷载不在跨中时的挠度公式一致。

[习题生成器](/zh/plot/exercises#the-generator)就是这样为参考答案求出弯矩极值的。其余函数见[函数](/zh/plot/functions#piecewise-polynomials)页面：斜率、分段内的极值、次数和 Bézier 曲线。

## 以 JSON 形式提供 {#ship-it-as-json}

只需 `JSON.stringify(model)`，而 `JSON.parse` 得到的模型画出来与求解器完全相同。一个带线荷载和集中荷载的门式刚架不到 2 kB。见[嵌入](/zh/plot/embedding#ship-the-drawing-not-the-solver)。模型还可以交给 [`structureSvg`](/zh/plot/functions#a-standalone-svg-file)，写成 SVG 文件。
