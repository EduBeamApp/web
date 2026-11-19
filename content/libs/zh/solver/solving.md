---
title: 求解
description: "@edubeam/fem 中 solve() 做了什么，修改模型后何时需要重新编号方程，如何识别机构，以及它能处理多大的模型。"
order: 9
group: 求解与结果
source: site
---

# 求解 {#solving}

```ts
solver.solve()
```

`solve()` 对方程编号，集成整体刚度矩阵和每个荷载工况的荷载向量，然后求出位移和支反力。之后就可以读取所有[结果](/zh/solver/results)；在此之前读取结果会抛出 `TypeError`。这些步骤与理论手册中 [EduBeam 如何求解模型](/zh/elements/analysis)一页所述相同。

对线性模型而言，解是精确的：每根杆件上的变形曲线和内力都来自 Timoshenko 梁的闭合解，所以无需加密网格，也不必为了得到准确的内力图而把杆件分段。

从 0.3.1 版起，`solve()` 不再向控制台输出任何内容；0.3.0 版每次调用都会打印一行，例如 `Solution took 9 [ms]`。

## 修改后重新求解 {#solving-again-after-a-change}

只修改模型中的数值，再调用一次 `solve()` 即可。如果方程本身变了，就要先多写一行：

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // 自由度变了：重新编号
solver.solve()
```

| 修改 | 之后 |
| --- | --- |
| 荷载数值，增加或删除荷载 | `solve()` |
| 节点坐标、材料、截面、铰 | `solve()` |
| 增加节点或杆件 | `codeNumberGenerated = false`，然后 `solve()` |
| 删除节点或杆件：`domain.nodes.delete(label)`、`domain.elements.delete(label)` | `codeNumberGenerated = false`，然后 `solve()` |
| 修改节点的支座 `node.bcs` | `codeNumberGenerated = false`，然后 `solve()` |

增加节点后忘了这一行，`solve()` 会抛出 `TypeError`。修改支座后忘了它，求解器会**悄无声息地**按旧的支座求解。拿不准时就重置它：重新编号几乎不花时间。删除杆件时，还要把它的荷载从 `lc.elementLoadList` 中删掉，否则 `solve()` 会因为找不到该杆件而抛出 `RangeError`。

对同一模型的许多变体，例如参数分析，为每个变体新建一个求解器更简单，速度也一样快，参见[影响线示例](/zh/solver/scripts#an-influence-line-as-csv)。

## 求解失败时 {#when-solving-fails}

不变形就能运动的结构，即机构，其刚度矩阵是奇异的。有时 `solve()` 能发现这一点并抛出异常：

```text
Error: Linear system cannot be solved since matrix is singular
```

但往往发现不了：舍入误差使矩阵看起来可解，于是得到 $10^{12}$ m 量级的位移，或者对一个可以自由滑动的结构给出看似合理的数字。例如支承在两个滑动铰支座上的梁，只要没有水平力推它，求解时就不会报任何错。所以要自己检查支座，并把巨大的位移视为机构的信号。

常见原因：

- 支座太少，例如梁支承在两个滑动铰支座上；
- 支座无法固定结构：各支座反力的作用线全部平行，或全部交于一点；
- 多了一个铰，例如三个铰共线；
- 在所有杆端都设铰的节点上施加了力偶。

错误信息不会指出问题在哪里。EduBeam 应用在求解前会检查机构，找出并动画演示其运动；在应用中建立同样的模型，往往是看清问题最快的办法。[疑难解答](/zh/reference/troubleshooting)列出了常见原因。

缺少节点、材料或截面时，会抛出 `RangeError`，并指出缺少的是哪一个。缺少截面参数则完全不会抛出异常：所有结果都是 `NaN`。参见[材料与截面](/zh/solver/materials-sections#cross-section)。

## 模型规模 {#model-size}

求解器使用稠密矩阵，面向教学规模的模型。在笔记本电脑上用 Node 运行，一串直线排列的杆件求解时间大约为：

| 杆件数 | 自由度数 | 用时 |
| --- | --- | --- |
| 50 | 150 | 0.1 s |
| 100 | 300 | 0.2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

模型规模每翻一倍，用时增至六到九倍。

结构力学课程中的习题、刚架和桁架，它都能轻松应对；但它不是为上千根杆件的模型设计的。

## 不支持其他分析 {#no-other-analyses}

此版本只做线性静力分析。源代码中包含一个求自振频率的特征值求解器，但它不属于发布的包：无法从 `@edubeam/fem` 导入 `EigenValueDynamicSolver`。
