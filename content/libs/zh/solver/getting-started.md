---
title: 快速入门
description: "安装 EduBeam 背后的有限元求解器 @edubeam/fem，用十几行 TypeScript 求解一根简支梁，核对并读取结果。"
order: 1
group: 入门
source: site
---

# 快速入门 {#getting-started}

@edubeam/fem 是 [EduBeam]{.edubeam} 背后的有限元求解器：应用中显示的每一张内力图、每一个支反力和挠度都由它算出。在自己的代码里，无论在浏览器还是在 Node 中，都可以用它求解平面梁、刚架和桁架：生成带答案的练习题、批改作业、做参数分析，或者为网页接入一个求解器。

::div{.actions}
[求解第一根梁](#a-simply-supported-beam) [浏览示例程序](/zh/solver/beams)
::

它用 TypeScript 编写，自带类型声明，是以 GPL-3.0 许可证发布的自由软件。它由 Bořek Patzák 创建，现由他与 Jan Voříšek 及其他贡献者共同开发。

## 安装 {#install}

```bash
npm install @edubeam/fem
```

它同时支持 `import` 和 `require`，可在浏览器和 Node 18 及以上版本中运行，只有一个依赖：[mathjs](https://mathjs.org)。0.3.0 版之前，它以 `ts-fem` 的名称从 GitHub 安装；如果你用过它，把导入语句改为 `@edubeam/fem` 即可，其他都没有变。

要在一个空文件夹里试运行下面的示例，先把它设为使用 `import` 的项目，再安装：

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

`package.json` 中没有 `"type": "module"` 时示例也能运行，只是 Node 会先打印一条警告。

## 第一根梁 {#a-simply-supported-beam}

一根 6 m 长的钢梁，截面为 IPE 200，一端为固定铰支座，另一端为滑动铰支座，承受 12 kN/m 的均布荷载：

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// 全部使用 SI 单位：m、N、Pa。钢材，IPE 200 截面
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// 节点坐标 [x, y, z]（单位 m），以及支座约束的自由度
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // 固定铰支座
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // 滑动铰支座
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 沿杆件局部 z 轴 12 kN/m：对从左向右定义的梁，方向向下
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // 跨中弯矩，N·m
console.log(beam.computeShearForceAt(lc, 0)) // A 端剪力，N
console.log(beam.computeLocalDefl(lc, 2).w[1]) // 跨中挠度，m
```

保存为 `beam.ts`，运行 `node beam.ts`：Node 22.18 及以上版本可以直接运行 TypeScript。这个文件没有类型注解，所以在较旧的 Node 上把它保存为 `beam.mjs` 即可。输出为：

```text [输出]
54000
36000
0.04990940552616746
```

这正是教材上的值：$M = qL^2/8 = 54$ kNm，$V = qL/2 = 36$ kN。下面是同一根梁，由同一个求解器在你的浏览器中求解：

::model-figure{caption="上面的梁：6 m，IPE 200，12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

挠度为 49.91 mm，比 Euler–Bernoulli 梁的 $5qL^4/384EI = 49.63$ mm 大 0.28 mm。这不是误差：该杆件是 Timoshenko（铁木辛柯）梁，0.28 mm 正是 $qL^2/8kGA$，即这根梁的剪切变形。把 `k` 设得极大，例如 `1e32`，这部分就消失了，参见[剪切变形](/zh/solver/materials-sections#shear-deformation)。

## 代码做了什么 {#what-the-code-does}

::div{.steps}
### 创建求解器 {#make-a-solver}

`new LinearStaticSolver()` 自带一个空的 `domain`（用来保存模型）和一个荷载工况 `solver.loadCases[0]`。

### 描述模型 {#describe-the-model}

依次定义材料和截面、带支座的节点，以及连接节点的杆件。每个对象都有一个标签（字符串或数字），模型的其他部分用这个标签引用它。参见[节点与支座](/zh/solver/nodes-supports)、[材料与截面](/zh/solver/materials-sections)和[杆件与铰](/zh/solver/members-hinges)。

### 施加荷载 {#load-it}

荷载属于某个荷载工况：节点上的力、沿杆件的荷载、温度荷载和支座沉降。参见[荷载](/zh/solver/loads)。

### 求解 {#solve}

`solver.solve()` 对每个荷载工况集成并求解方程组。参见[求解](/zh/solver/solving)。

### 读取结果 {#read-the-results}

杆件上任意位置的内力、挠度、杆端力、节点位移和支反力。参见[读取结果](/zh/solver/results)；要画内力图，参见[绘制结果](/zh/solver/drawing)。
::

## 单位与符号速览 {#axes-and-signs}

输入用 SI 单位，输出也是 SI 单位。模型位于 x–z 平面内，**z 轴朝下**，所以正的 `fz` 向下作用，高 4 m 的柱，柱顶位于 $z = -4$。杆件上的位置用到其第一个节点的距离表示，单位为 m。下缘受拉的弯矩为正。完整列表见[单位与符号](/zh/solver/conventions)。

## 六个常见陷阱 {#pitfalls}

1. **z 轴朝下**。重力荷载为正，支座以上的点 z 坐标为负。参见[坐标轴](/zh/solver/conventions#axes)。
2. **杆件方向决定 M 和 w 的符号**。梁从左向右定义，柱从下向上定义，符号就与教材一致。参见[杆件方向](/zh/solver/conventions#member-direction)。
3. **缺少参数不会报错，只会得到 `NaN` 或无意义的结果**。截面需要 `a`、`iy` 和 `k`；材料需要 `e`，除非 `k` 取极大值，否则还需要 `g`。参见[材料与截面](/zh/solver/materials-sections)。
4. **添加节点或杆件、修改支座之后**，再次求解前要设置 `solver.codeNumberGenerated = false`。参见[修改后重新求解](/zh/solver/solving#solving-again-after-a-change)。
5. **支反力以 mathjs 矩阵或数组的形式返回**，顺序与定义支座时给出的自由度顺序一致。参见[支反力](/zh/solver/results#reactions)。
6. **机构不一定会抛出异常**。出现 $10^{12}$ m 这样的位移，说明结构可以自由运动。参见[求解失败时](/zh/solver/solving#when-solving-fails)。

## 下一步 {#next}

::card-grid{cols="2"}
:::card{title="示例程序" icon="lucide:book-open" to="/zh/solver/beams"}
完整且经过核对的程序：梁、刚架、桁架、附参考答案的习题单、一个小型 HTTP 服务器。
:::
:::card{title="绘制结果" icon="lucide:chart-spline" to="/zh/solver/drawing"}
把求解后的模型交给 @edubeam/plot，在 Vue 中或 Node 脚本里得到 SVG 格式的内力图。
:::
:::card{title="API 参考" icon="lucide:list-tree" to="/zh/solver/reference"}
所有类、方法和参数，附单位和返回值。
:::
:::card{title="理论" icon="lucide:sigma" to="/zh/elements/beam"}
EduBeam 理论手册中的梁单元、其刚度矩阵和坐标转换。
:::
::
