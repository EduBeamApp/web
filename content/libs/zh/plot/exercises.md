---
title: 习题与测验
description: "用 @edubeam/fem 和 @edubeam/plot 按随机种子为每名学生生成不同的结构力学习题，参考答案总是正确，可用于网页、打印的测验卷或 LaTeX 和 Word 中的 SVG 插图。"
order: 5
group: 应用场景
source: site
---

# 习题与测验

把一个结构写成以随机种子（seed）为参数的函数，只写一次，就能每周为每名学生各出一道题，每道题都附有总是正确的参考答案：@edubeam/fem 负责求解，@edubeam/plot 用同一个模型画出题目和参考答案。

点击下方的**换一道题**。每点一次就换一个随机种子，题目在你的浏览器中生成、求解并绘制出来。

::exercise-generator
::

这个演示所画的题目来自本站的两个页面，它们都是用本页介绍的方法做成的：在[结构力学练习题](/zh/practice)中，学生输入支反力和最大弯矩或最大杆件轴力，马上就能核对答案；[试卷生成器](/zh/exam)则为每名学生打印一套不同的试卷并附参考答案，还能把插图保存为 SVG 文件，把答案保存为 CSV。动手写自己的代码之前，先试试它们。

## 工作原理 {#how-it-works}

1. **随机种子决定数据**。带种子的随机数生成器对同一个种子总是给出同一道题，所以凭印在题目上的种子就能找回它的参考答案。
2. **求解器算出答案**。每个结构都由 @edubeam/fem 求解，支反力和弯矩来自求解器，而不是来自一个你可能写错的公式。
3. **绘图库画出两者**。题目图画出结构及其节点标签、尺寸标注和用名称表示的未知支反力；参考答案给出支反力的数值，并加上内力图。

从这里到一份打印好的测验卷，只需要几个短文件：[生成器](#the-generator)、用于网页的[组件](#the-exercise-in-a-page)，以及打印测验卷或为 LaTeX 和 Word [输出插图](#figures-for-latex-and-word)的[脚本](#print-a-test)。把它们复制到[已安装这两个库](/zh/plot/getting-started#install)的项目中即可；脚本在 Node 22.18 及以上版本中用 `node` 运行，旧版本用 `npx tsx` 运行。

## 生成器 {#the-generator}

一个模块 `exercise.ts` 把随机种子变成一道题：一根由固定铰支座和滑动铰支座支承的梁，有一半的概率带外伸段，外伸段端部作用一个集中荷载。两种情况都是静定的，所以每个种子的题目既能用求解器解，也能手算。

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** 求解后的结构，纯数据：题目和参考答案都由它绘制 */
  readonly model: PlotModel
  /** 向上的支反力（N）和弯矩极值（N·m） */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32：一个很小的带种子随机数生成器，同一个种子永远对应同一道题 */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const makeExercise = (seed: number): Exercise => {
  const r = random(seed)
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

  // 由固定铰支座和滑动铰支座支承的一跨，一半概率带外伸段：静定，所以总能求解
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // 外伸段长度，m
  const q = int(4, 12) // 跨内均布荷载，kN/m
  const F = int(2, 6) * 5 // kN，作用在外伸端；无外伸段时作用在距 A 点 `a` 处
  const a = int(1, L - 1) // m

  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  if (c > 0) {
    domain.createNode('C', [L + c, 0, 0])
    domain.createBeam2D(2, ['B', 'C'], 1, 1)
    lc.createNodalLoad('C', { [DofID.Dz]: F * 1e3 })
  } else {
    lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  }
  solver.solve()

  const statement =
    c > 0
      ? `Span L = ${L} m with an overhang c = ${c} m. q = ${q} kN/m on the span, F = ${F} kN at the tip C.`
      : `Span L = ${L} m. q = ${q} kN/m over the span, F = ${F} kN at ${a} m from A.`

  // 由求解后的模型得到答案：支反力（z 轴向下，所以向上为负）和 M 的精确极值
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` 把求解后的结构读成一个[绘图模型](/zh/plot/model)：一份纯数据，包含支反力和每根杆件以精确多项式表示的结果，所以 `extremes` 不用采样就能求出最大弯矩。题目只保留这个模型，求解器就不再需要了。

种子 5 生成的题目是 *“Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.”*（跨度 L = 6 m，外伸段 c = 1.5 m，跨内均布荷载 q = 5 kN/m，外伸端 C 作用 F = 25 kN。）参考答案：$R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1.5)/6 = 8.75$ kN，$R_B = 5 \cdot 6 + 25 - 8.75 = 46.25$ kN，支座 B 处 $M_B = -25 \cdot 1.5 = -37.5$ kNm，跨内剪力为零处 $M = 8.75^2/(2 \cdot 5) = 7.66$ kNm。求解器的结果与之完全一致，连最后一位都相同。

## 在网页中 {#the-exercise-in-a-page}

组件 `ExerciseCard.vue` 绘制题目，设置 `answers` 时绘制参考答案：

```vue [ExerciseCard.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { formatQuantity, KN_UNITS, StructurePlot, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise'

const props = defineProps<{ seed: number; answers?: boolean }>()
const exercise = computed(() => makeExercise(props.seed))

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const twoDecimals = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const kN = (si: number) => formatQuantity(si, KN_UNITS.force, twoDecimals)
const kNm = (si: number) => formatQuantity(si, KN_UNITS.moment, twoDecimals)
</script>

<template>
  <article>
    <h3>Exercise {{ seed }}</h3>
    <p>{{ exercise.statement }} Find the reactions and draw the bending moment diagram.</p>
    <StructurePlot
      :model="exercise.model"
      :layers="answers ? key : sheet"
      :reserve="[...sheet, ...key]"
      :reaction-labels="answers ? 'values' : 'names'"
      :reserve-reaction-labels="['names', 'values']"
    />
    <p v-if="answers">
      R<sub>A</sub> = {{ kN(exercise.key.RA) }}, R<sub>B</sub> = {{ kN(exercise.key.RB) }},
      M from {{ kNm(exercise.key.mMin) }} to {{ kNm(exercise.key.mMax) }}
    </p>
  </article>
</template>
```

```vue
<ExerciseCard :seed="5" />
<ExerciseCard :seed="5" answers />
```

第二张卡片的最后一行是 *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*。`formatQuantity` 会写上单位和真正的负号，与图中的写法相同。

在题目图上，`reaction-labels="names"` 把支反力画成未知量：支座约束的每个方向画一个箭头，指向该支反力的正方向（向右、向上、逆时针），并标上名称 *A<sub>x</sub>*、*A<sub>z</sub>*、*M<sub>A</sub>*，而不是标出大小。这样每个答案的正负号都由图来规定：与箭头方向相反的支反力为负。参考答案则写出数值。

`reserve` 从一开始就为两种视图的所有图层安排好布局，所以打开 `answers` 时（例如学生自学时点击*显示答案*按钮），内力图会在它应在的位置淡入（见[逐步呈现的插图](/zh/plot/structure-plot#figures-that-build-up)）。`reserve-reaction-labels` 对支反力起同样的作用，梁保持不动，只是名称变成了数值：见[支反力作为未知量](/zh/plot/structure-plot#reactions-as-unknowns)。

## 打印测验卷 {#print-a-test}

笔试用的测验卷，可以用 Node 脚本 `print-test.ts` 生成：每名学生一页，参考答案附在后面。`structureSvg` 把每个模型转成 SVG 文本，所以这个脚本既不需要 Vue，也不需要浏览器：

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // 种子 1000、1001……

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const task = 'Find the reactions and draw the bending moment diagram.'

const pages = [
  ...exercises.map((e, i) => `<h2>${students[i]}, exercise ${e.seed}</h2>
    <p>${e.statement} ${task}</p>${structureSvg(e.model, { layers: sheet, reactionLabels: 'names' })}`),
  ...exercises.map((e) => `<h2>Key, exercise ${e.seed}</h2>
    ${structureSvg(e.model, { layers: key })}`),
]

const style = `body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 2rem auto }
  section { break-after: page }`
writeFileSync('test.html', `<!doctype html><meta charset="utf-8"><title>Test</title>
  <style>${style}</style>${pages.map((page) => `<section>${page}</section>`).join('\n')}`)
```

```bash
node print-test.ts
```

在浏览器中打开 `test.html` 并打印，或另存为 PDF：每名学生的题目和每份参考答案各占一页。下面是 Ada 的一页及其参考答案：

![第 1000 题：跨度 6 m、外伸段 2 m 的梁，跨内作用 10 kN/m，外伸端作用 30 kN，未知支反力标为 A_x、A_z 和 B_z，连续尺寸标注 6 m 和 2 m，总长 8 m；下方是参考答案，支反力为 20 和 70，弯矩从支座上方的 −60 变到跨内的 20](/screenshots/zh/p2p-plot-exercise-sheet.webp){.shot-lg}

`dimensions` 图层像习题单那样标出每一跨和总长，`reactionLabels: 'names'` 为未知量命名，每个箭头都指向其答案的正方向。参考答案中的支反力和内力图数值是以 kN 和 kNm 为单位的纯数字，与 EduBeam 应用相同；如果需要向学生说明，请在参考答案的标题中注明单位。若要用黑白复印机复印，可以传入所有色调都设为黑色的 `colors`：见[黑白打印](/zh/plot/theming#black-and-white)。

## LaTeX 和 Word 用的插图 {#figures-for-latex-and-word}

如果你的测验卷是用 LaTeX 或 Word 写的，可以改为把插图写成文件，继续使用你自己的模板。`figures.ts` 为 30 个种子分别写出题目图和参考答案图：

```ts [figures.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']

for (let seed = 1000; seed < 1030; seed++) {
  const { model } = makeExercise(seed)
  writeFileSync(`exercise-${seed}.svg`, structureSvg(model, { layers: sheet, reactionLabels: 'names' }))
  writeFileSync(`exercise-${seed}-key.svg`, structureSvg(model, { layers: key }))
}
```

用 `node figures.ts` 运行它：30 名学生共 60 个文件，每个都是颜色固定的普通 SVG，不含 CSS，也不含脚本。

- **Word**（2019 和 Microsoft 365）可以直接插入 SVG：*插入 › 图片*。
- **LaTeX** 插入的是 PDF 而不是 SVG。用 [CairoSVG](https://cairosvg.org)（`cairosvg exercise-1000.svg -o exercise-1000.pdf`）或 Inkscape 转换一次，然后用 `\includegraphics[width=\linewidth]{exercise-1000.pdf}`。如果装有 Inkscape，`svg` 宏包的 `\includesvg` 会替你完成转换。

一幅图宽 640 个单位，字号为 13 个单位，所以放在 A4 版心宽度（约 16 cm）时，标注为 9 pt。把 `fontFamily` 设为文档所用的字体：全部选项见[独立的 SVG 文件](/zh/plot/functions#a-standalone-svg-file)。

## 按需改造 {#make-it-your-own}

- **更多结构类型**。增加新的情况：悬臂梁、两跨连续梁、门式刚架、桁架。页首的在线演示从八类结构中选取，从简支梁到三铰刚架、华伦桁架和门式刚架。
- **超静定习题**。求解器同样能处理，只是手算过程长一些。
- **整齐的数字**。像上面那样从短列表中选取荷载和长度，参考答案就能得到你想要的整齐数值。可以遍历几百个种子，跳过答案小数位数过多的那些。
- **防止出现机构**。如果生成器可能把支座放得不合适，就在 `try` 中求解，跳过抛出异常的种子：见[求解失败时](/zh/solver/solving#when-solving-fails)。
- **多问几项**。画出剪力（`'V'`）、挠度（`'w'`，数值来自 [`getUnknowns`](/zh/solver/results#displacements)），或斜杆中的轴力。
