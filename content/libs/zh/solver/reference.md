---
title: API 参考
description: "@edubeam/fem 0.3 的所有类、方法和参数，附单位、默认值以及各自返回值的数据结构。"
order: 16
group: API 参考
source: site
---

# API 参考 {#api-reference}

`@edubeam/fem` 0.3 导出的内容，按用途分组。单位一律为 SI：m、N、N·m、N/m、Pa、K 和 rad。标签（`LabelType`）为 `string | number`，以字符串保存。此处未列出的方法都是内部方法：它们在 TypeScript 中是公开的，只是因为求解器自身的类要调用它们。

## 导出 {#exports}

| 导出 | 类别 | 章节 |
| --- | --- | --- |
| `LinearStaticSolver` | 类 | [分析](#analyses) |
| `Solver` | 抽象类 | [分析](#analyses) |
| `Domain` | 类 | [Domain](#domain) |
| `Node` | 类 | [Node](#node) |
| `Beam2D`、`Element` | 类 | [单元](#elements) |
| `Material`、`CrossSection` | 类 | [材料与截面](#materials-and-sections) |
| `LoadCase` | 类 | [荷载](#loads) |
| `NodalLoad`、`BeamConcentratedLoad`、`BeamElementUniformEdgeLoad`、`BeamElementTrapezoidalEdgeLoad`、`BeamTemperatureLoad`、`PrescribedDisplacement`、`Load`、`BeamElementLoad` | 类 | [荷载](#loads) |
| `DofID` | 枚举 | [DofID](#dofid) |
| `LabelType`、`EnumDictionary`、`MaterialParameters`、`CrossSectionParameters` | 类型 | |

## 分析 {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| 成员 | 类型 | 说明 |
| --- | --- | --- |
| `domain` | `Domain` | 模型 |
| `loadCases` | `LoadCase[]` | 初始包含一个工况 `'DefaultLC'`。用 `new LoadCase(label, solver.domain)` 创建更多工况，再追加到这个数组中，参见[荷载工况](/zh/solver/load-cases)。 |
| `solve()` | `void` | 必要时对方程编号，集成并求解每个荷载工况。遇到[机构](/zh/solver/solving#when-solving-fails)时可能抛出异常，但不一定。从 0.3.1 版起不输出任何内容；0.3.0 版会打印用时。 |
| `codeNumberGenerated` | `boolean` | 增删节点或杆件、修改支座之后，把它设为 `false`：[原因](/zh/solver/solving#solving-again-after-a-change) |
| `neq`、`pneq` | `number` | 求解后，未约束自由度和受约束自由度的个数 |
| `k` | mathjs `Matrix` | 求解后，集成好的整体刚度矩阵 |
| `getNodeDofIDs(label)` | `number[]` | 求解后，节点具有的自由度 |

`EigenValueDynamicSolver` 存在于源代码中，但没有导出。

## Domain {#domain}

`solver.domain` 用四个 `Map` 保存模型，键为字符串形式的标签：`nodes`、`elements`、`materials`、`crossSections`。没有删除方法：用 `domain.nodes.delete(label)` 和 `domain.elements.delete(label)` 删除节点或杆件，然后[重新编号](/zh/solver/solving#solving-again-after-a-change)。

| 方法 | 返回 | 说明 |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` 为 `[x, y, z]`，单位 m（默认 `[0, 0, 0]`）；`bcs` 为受约束的 `DofID`（默认无） |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` 为 `[first, second]`，`hinges` 为 `[atFirst, atSecond]`（默认 `[false, false]`） |
| `createMaterial(label, params?)` | `Material` | 参见[材料与截面](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | 参见[材料与截面](#materials-and-sections) |
| `getNode(label)`、`getElement(label)`、`getMaterial(label)`、`getCS(label)` | 对应的对象 | 标签不存在时抛出 `RangeError`。`getElement` 的类型为 `Element`：读取结果前要写 `as Beam2D`。 |

用已被占用的标签创建对象，会替换原有对象。

## Node {#node}

| 成员 | 类型 | 说明 |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`，单位 m。修改它即可移动节点。 |
| `bcs` | `Set<DofID>` | 受约束的自由度。替换它即可改变支座。 |
| `lcs` | `number[][] \| undefined` | 节点旋转后的坐标轴（如有） |
| `updateLcs({ locx, locy }?)` | `void` | 旋转节点坐标轴：`locx` 为其 x 轴在整体坐标系中的分量，`locy` 为 `[0, 1, 0]`。不带参数时复位。 |
| `hasLcs()` | `boolean` | 坐标轴是否已旋转 |
| `getUnknowns(lc, dofs)` | `Matrix`，单个自由度时为 `number` | 位移（m）和转角（rad），在节点坐标系中 |
| `getReactions(lc, global?)` | `{ dofs, values }` | 受约束自由度上的支反力，按 `bcs` 的顺序：N、N·m。有多个时 `values` 是 mathjs `Matrix`，只有一个时是单元素数组，自由节点为 `[]`。对旋转过坐标轴的节点，`global` 为 `true` 时：返回整体坐标下的全部三个自由度，`dofs` 为 `[0, 2, 4]`，`values` 是数组，未约束处为 0。[读取方法](/zh/solver/results#reactions)。 |

## 单元 {#elements}

### `Beam2D` {#beam2d}

x–z 平面内的两节点 Timoshenko 梁单元，每个节点三个自由度（`Dx`、`Dz`、`Ry`）。`x` 为距第一个节点的距离，单位 m；`n` 为分段数，给出 n + 1 个点。

| 成员 | 返回 | 说明 |
| --- | --- | --- |
| `label`、`nodes`、`mat`、`cs` | `string`、`string[]`、`string`、`string` | |
| `hinges` | `[boolean, boolean]` | 第一个和第二个节点处的弯矩释放 |
| `computeNormalForceAt(lc, x)` | `number` | N，受拉为正 |
| `computeShearForceAt(lc, x)` | `number` | V，M 沿局部 x 增大处为正 |
| `computeBendingMomentAt(lc, x)` | `number` | M，局部 +z 一侧受拉为正 |
| `computeNormalForce(lc, n)` | `{ x, N }` | n + 1 个点上的 N |
| `computeShearForce(lc, n)` | `{ x, V }` | n + 1 个点上的 V |
| `computeBendingMoment(lc, n)` | `{ x, M }` | n + 1 个点上的 M |
| `computeLocalDefl(lc, n)` | `{ u, w }` | 沿杆轴和垂直杆轴的位移，局部坐标，单位 m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | 同上，整体 x 和 z 方向 |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`，节点作用在杆件上的力，局部坐标 |
| `computeEndDisplacement(lc)` | `Matrix` | 局部坐标下的杆端位移，包括铰处的转角 |
| `computeGeo()` | `{ l, dx, dz }` | 杆长和投影，单位 m |
| `computeT()` | `Matrix` | 6 × 6 坐标转换矩阵，从整体到局部 |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`：6 × 6 局部刚度矩阵，已凝聚掉铰端的转角 |
| `computeStiffness()` | `Matrix` | 6 × 6 整体刚度矩阵 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`、`getCS()` | `Material`、`CrossSection` | |

在集中荷载处，`…At` 方法返回紧接其后的值。`Element` 是 `Beam2D` 的抽象基类，`domain.elements` 和 `getElement` 使用的就是这个类型。

## 材料与截面 {#materials-and-sections}

| `MaterialParameters` | 单位 | 默认值 | 用途 |
| --- | --- | --- | --- |
| `e` | Pa | 1 | 刚度 |
| `g` | Pa | 1 | 剪切刚度 |
| `alpha` | 1/K | 1 | 温度荷载 |
| `d` | kg/m³ | 1 | 静力分析中不使用 |

| `CrossSectionParameters` | 单位 | 默认值 | 用途 |
| --- | --- | --- | --- |
| `a` | m² | 无，必填 | 轴向刚度和剪切刚度 |
| `iy` | m⁴ | 无，必填 | 弯曲刚度 |
| `k` | – | 无，必填 | 剪切刚度 $kGA$；取 `1e32` 即不计剪切变形 |
| `h` | m | 无 | 温度梯度（缺少时为 `NaN`） |
| `iz`、`dyz`、`j` | m⁴ | 无 | `Beam2D` 不使用 |

缺少的材料参数取 1，而不是某个典型值；缺少 `a`、`iy` 或 `k` 会使所有结果为 `NaN`。两种情况都不会抛出异常。两个类都有 `change(params)` 方法，用来设置传入的参数，参数保存为同名属性。

## 荷载 {#loads}

### `LoadCase` {#loadcase}

| 方法 | 返回 | 数值 |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`；`lcs`（默认 `false`）为 `true` 时：在节点旋转后的坐标系中 |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m，布满整根杆件 |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | 第一个和第二个节点处的 N/m，其间线性变化 |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N、N、N·m，作用在距第一个节点 `a` m 处 |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K：形心、下缘纤维、上缘纤维 |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }`，作用在受约束的自由度上，节点坐标系；对未约束的自由度忽略 |

对杆件荷载，`lcs` 为 `true` 表示局部坐标（x 沿杆轴，z 垂直杆轴），`false` 表示整体坐标。线荷载按杆长每米计。示例见[荷载](/zh/solver/loads)。

| 成员 | 类型 | 说明 |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | 杆件荷载和温度荷载 |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | 成功求解后为 `true` |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | 某一根杆件上的荷载 |

荷载对象把数值保存在公开属性中，重新求解前可以修改：`NodalLoad`、`BeamElementUniformEdgeLoad`、`BeamConcentratedLoad` 和 `BeamTemperatureLoad` 上的 `values`（以及 `lcs`）；`BeamElementTrapezoidalEdgeLoad` 上的 `startValues` 和 `endValues`；`PrescribedDisplacement` 上的 `prescribedValues`。每个荷载对象都有一个 `target`，即它所作用对象的标签。

## DofID {#dofid}

| 名称 | 值 | `Beam2D` 是否使用 |
| --- | --- | --- |
| `Dx` | 0 | 是 |
| `Dy` | 1 | 否 |
| `Dz` | 2 | 是 |
| `Rx` | 3 | 否 |
| `Ry` | 4 | 是 |
| `Rz` | 5 | 否 |

## 结果 {#results}

结果在 `solve()` 之后，针对指定的 `LoadCase`，从 `Beam2D`（内力、挠度、杆端力）和 `Node`（位移、支反力）读取：参见上面两个表格；示例和符号约定见[读取结果](/zh/solver/results)。简言之：

| 要得到 | 调用 |
| --- | --- |
| 支反力，N 和 N·m | `node.getReactions(lc)` |
| 位移（m）和转角（rad） | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| 某一点的 N、V 或 M，N 和 N·m | `beam.computeNormalForceAt(lc, x)`、`computeShearForceAt`、`computeBendingMomentAt` |
| 沿杆件的 N、V 或 M | `beam.computeNormalForce(lc, n)`、`computeShearForce`、`computeBendingMoment` |
| 变形曲线，m | `beam.computeLocalDefl(lc, n)`、`computeGlobalDefl` |
| 杆端力，N 和 N·m | `beam.computeEndForces(lc)` |
| 把这一切画成图 | [@edubeam/plot](/zh/solver/drawing) 的 `StructurePlot` 或 `structureSvg` |
