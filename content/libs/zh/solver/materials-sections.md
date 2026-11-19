---
title: 材料与截面
description: "@edubeam/fem 使用的材料和截面参数，各种分析需要哪些参数，缺少参数时会怎样，以及如何关闭剪切变形。"
order: 4
source: site
---

# 材料与截面 {#materials-and-sections}

杆件的刚度来自材料和截面。两者各创建一次，之后通过标签引用。

```ts
domain.createMaterial('steel', { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection('IPE200', {
  a: 28.5e-4, // m²
  iy: 1943e-8, // m⁴
  h: 0.2, // m
  k: 5 / 6,
})
```

## 材料 {#material}

| 参数 | 含义 | 单位 | 何时需要 |
| --- | --- | --- | --- |
| `e` | 弹性模量 $E$ | Pa | 始终需要 |
| `g` | 剪切模量 $G$ | Pa | 始终需要，除非 `k` 极大（不计剪切变形） |
| `alpha` | 线膨胀系数 $\alpha$ | 1/K | 温度荷载 |
| `d` | 密度 $\rho$ | kg/m³ | 静力分析中不使用 |

省略的参数取值为 **1**，而不是某个典型值，而且没有任何警告。在快速入门的梁中漏掉 `g`，挠度就成了 22 700 km。

## 截面 {#cross-section}

| 参数 | 含义 | 单位 | 何时需要 |
| --- | --- | --- | --- |
| `a` | 面积 $A$ | m² | 始终需要：轴向刚度和剪切刚度 |
| `iy` | 惯性矩 $I_y$ | m⁴ | 始终需要：弯曲刚度 |
| `k` | 剪切系数 $k$ | – | 始终需要：剪切刚度 $kGA$ |
| `h` | 截面高度 $h$ | m | 温度梯度 |
| `iz`、`dyz`、`j` | $I_z$、$I_{yz}$、扭转常数 | m⁴ | 平面模型中不使用 |

截面没有默认值。省略 `a`、`iy` 或 `k`，所有结果都是 `NaN`；省略 `h`，温度梯度会得到 `NaN`。两种情况都不会抛出错误，所以结果是 `NaN` 时，几乎总是缺了某个参数。

## 剪切变形 {#shear-deformation}

杆件是 Timoshenko 梁：除弯曲变形外还有剪切变形。剪切变形的大小取决于

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2},
$$

可由 `beam.computeShearFactor()` 得到。对细长杆件，$\Phi$ 很小，挠度只增大不到 1 %。对短而高的杆件，剪切变形就不可忽略了。

要得到教材表格中的 Euler–Bernoulli 梁，可以像 EduBeam 应用的示例那样，取一个极大的剪切系数，使剪切刚度实际上为无穷大：

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

本文档的示例程序都这样做，所以数值与公式完全吻合。如果要用真实的剪切系数，矩形截面取 $k = 5/6$。[手算校核结果](/zh/guide/verification#shear-deformation)一页展示了这一影响有多大。

## 轴向刚性 {#rigid-in-axial-direction}

面积取得很大，杆件实际上就不可伸长，这正是手算通常采用的假定。面积对刚架内力的影响很小，桁架的位移却完全取决于面积。静定结构的内力与刚度完全无关。

## 修改参数 {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

每根杆件在求解器集成刚度矩阵时读取自己的材料和截面，所以只需再调用一次 `solve()`。不同杆件可以使用不同的截面：给每个截面一个自己的标签即可。
