---
title: 节点与支座
description: "创建 @edubeam/fem 模型的节点，通过固定自由度定义支座，旋转支座坐标轴得到斜向滑动铰支座，以及在求解后修改节点。"
order: 3
group: 建模
source: site
---

# 节点与支座 {#nodes-and-supports}

节点是杆件相互连接的点。支座不是单独的对象，而是节点所固定的自由度列表。本页的代码片段都是类似[快速入门](/zh/solver/getting-started)中那种程序的一部分，沿用其中的 `solver`、`domain` 和 `lc`。

## 创建节点 {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| 参数 | 类型 | 含义 |
| --- | --- | --- |
| `label` | `string \| number` | 节点名称，以字符串保存：`1` 和 `'1'` 是同一个节点 |
| `coords` | `number[]` | `[x, y, z]`，单位 m，`y = 0`。z 轴朝下。 |
| `bcs` | `DofID[]` | 支座约束的自由度。自由节点省略即可。 |

返回值是 `Node`；之后可以用 `domain.getNode(label)` 重新取得它。如果标签已被占用，新节点会替换旧节点。

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // 自由节点：4 m 高柱的柱顶
```

## 支座 {#supports}

EduBeam 应用中的每种支座都对应一组固定的自由度：

| 支座 | `bcs` | 约束 |
| --- | --- | --- |
| 固定端 | `[DofID.Dx, DofID.Dz, DofID.Ry]` | 全部约束 |
| 固定铰支座 | `[DofID.Dx, DofID.Dz]` | 两个方向的位移，可以转动 |
| 滑动铰支座 | `[DofID.Dz]` | 竖向位移，可沿 x 滑动 |
| 竖向滑动铰支座 | `[DofID.Dx]` | 水平位移，可沿 z 滑动 |
| 滑动固定端 | `[DofID.Dz, DofID.Ry]` | 竖向位移和转动，可沿 x 滑动 |
| 竖向滑动固定端 | `[DofID.Dx, DofID.Ry]` | 水平位移和转动，可沿 z 滑动 |
| 仅约束转动 | `[DofID.Ry]` | 转动 |

自由度的列出顺序，就是[支反力](/zh/solver/results#reactions)返回的顺序。结构至少需要三个固定的自由度，而且布置要使结构不能作为机构运动，参见[求解失败时](/zh/solver/solving#when-solving-fails)。

也可以让固定的自由度产生给定的位移，即支座沉降，参见[给定位移](/zh/solver/temperature-settlements#prescribed-displacements)。

## 斜支座 {#inclined-supports}

斜面上的滑动铰支座约束的是垂直于斜面的方向，而不是竖向。用 `updateLcs` 旋转节点的坐标轴，此后 `bcs` 指的就是旋转后的坐标轴方向。在快速入门的程序中，把 B 改为这样创建：

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // 约束节点自身的 z 方向
const a = (30 * Math.PI) / 180 // 30°，从 x 转向 z：在屏幕上为顺时针
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` 是节点自身的 x 轴在整体坐标系中的方向向量，`locy` 是它的 y 轴，保持 `[0, 1, 0]`。在 EduBeam 应用中，这个角度就是该节点的*节点局部坐标系角度*：30°。

`solve()` 之后，B 的反力垂直于斜面，水平分量由 A 处的固定铰支座承担：

```ts
b.getReactions(lc).values // [-41569]：沿 B 自身 z 方向，单位 N，即 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]：沿 x、沿 z、力矩
```

::model-figure{caption="旋转 30° 的滑动铰支座：反力垂直于斜面，梁受拉"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, N]
show: [nodeLabels]
---
::

竖向分量仍是 $qL/2 = 36$ kN；水平分量 $36 \tan 30° = 20.8$ kN 从两端拉着梁。弯矩不变。

在旋转过的节点上，位移和支反力都在节点自身的坐标系中给出，传入 `true` 才得到整体坐标下的值。作用在该节点上的节点荷载则默认按整体坐标给出，除非另行指定，参见[节点荷载](/zh/solver/loads#nodal-loads)。不带参数调用 `node.updateLcs()` 会把坐标轴转回原位。

## 修改节点 {#change-a-node}

节点是普通对象：修改 `node.coords` 可以移动它，替换 `node.bcs`（一个 `Set<DofID>`）可以改变它的支座。

```ts
domain.getNode('B').coords = [8, 0, 0] // 跨度变长：直接 solve() 即可
domain.getNode('A').bcs = new Set(fixed) // 新的支座：先重新编号
solver.codeNumberGenerated = false
solver.solve()
```

修改支座或增删节点都会改变方程组：不设置 `codeNumberGenerated = false`，求解器会**悄无声息地沿用旧的支座**。哪些修改需要这样做，见[修改后重新求解](/zh/solver/solving#solving-again-after-a-change)。
