---
description: "用教材公式核对 EduBeam：梁、桁架、温度荷载、支座沉降，以及 Timoshenko 梁与 Euler–Bernoulli 梁的差别所在。"
source: site
---

# 手算校核结果

自己无法大致复现的数字，就不要轻信。本页用手算求解经典的教材算例，并与 [EduBeam]{.edubeam} 的结果比较：所列的每一位数字都一致。表中给出五位有效数字，与应用的*结果*选项卡相同；图中的标注四舍五入到四位有效数字。每张图都在你的浏览器中实时求解；点击**在 EduBeam 中打开**，即可把同一个模型载入应用，在那里查看表格、修改数值，观察结果如何变化。

::div{.chips}
- [简支梁](#simply-supported-beam-uniform-load)
- [悬臂梁](#cantilever-tip-load)
- [两端固定梁](#fixed–fixed-beam-uniform-load)
- [一端固定一端简支梁](#propped-cantilever-uniform-load)
- [两杆桁架](#two-bar-truss)
- [温度荷载](#temperature-gradient-on-a-simply-supported-beam)
- [支座沉降](#prescribed-displacement)
- [剪切变形](#shear-deformation)
::

从头到尾完整求解的结构，请看[三铰刚架](/zh/tutorials/three-hinged-frame)和[平面桁架](/zh/tutorials/truss)教程。想找新题手算、边输入边核对答案，请试试[结构力学练习题](/zh/practice)。

## 本页所用截面 {#the-section-used-here}

除非另有说明，各算例都采用应用示例中的钢梁：$E = 210$ GPa，$I_y = 8356$ cm⁴（IPE 300），因此

$$
EI = 210 \times 10^9 \cdot 8.356 \times 10^{-5} = 17\,547.6\ \text{kNm}^2
$$

它的面积（$A = 1$ m²）和剪切系数（$k = 10^{32}$）取得极大，轴向变形和剪切变形都可以忽略，因此结果与教材中的 Euler–Bernoulli 公式完全一致。

::callout{type="info" title="EduBeam 的梁是 Timoshenko 梁"}
采用实际截面（例如截面库中的截面）时，杆件还会发生剪切变形。这时挠度比 Euler–Bernoulli 公式的结果略大，在超静定结构中内力也会略有变化。本页末尾的[剪切变形](#shear-deformation)一节说明了差别有多大，以及如何不计剪切变形。
::

在*结果*选项卡中，位移和转角遵循[整体坐标轴](/zh/elements/conventions#global-axes)：D<sub>z</sub> 为正表示向下，R<sub>y</sub> 为正表示逆时针；位移以米为单位，除非你在设置中改了单位（见[单位与设置](/zh/essentials/units-settings)）。

## 简支梁，均布荷载 {#simply-supported-beam-uniform-load}

$L = 6$ m，$q = 12$ kN/m，A 端为固定铰支座，B 端为滑动铰支座。跨中节点 C 用来读取该处的挠度；在节点处拆分杆件不会改变任何结果。

::model-figure{caption="简支梁，12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| 物理量 | 公式 | 数值 |
| --- | --- | --- |
| 支反力 | $qL/2$ | 36 kN |
| 支座处剪力 | $\pm qL/2$ | A 处 +36 kN，B 处 −36 kN |
| 跨中弯矩 | $qL^2/8$ | 54 kNm |
| A 处转角 | $qL^3/(24EI)$ | 0.0061547 rad，顺时针 |
| C 处挠度 | $5qL^4/(384EI)$ | 11.540 mm，向下 |

EduBeam 给出相同的数值。在*结果*选项卡中，节点 A 的 R<sub>y</sub> = −0.0061547 rad（负值：顺时针），节点 C 的 D<sub>z</sub> = 0.01154 m（正值：向下）。

## 悬臂梁，自由端集中荷载 {#cantilever-tip-load}

$L = 4$ m，A 端固定，自由端 B 作用向下的 $F = 18$ kN。

::model-figure{caption="悬臂梁，自由端作用 18 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| 物理量 | 公式 | 数值 |
| --- | --- | --- |
| 竖向支反力 | $F$ | 18 kN |
| 固端弯矩 | $FL$ | 72 kNm，负弯矩（上缘受拉）：M = −72 kNm |
| 自由端转角 | $FL^2/(2EI)$ | 0.0082063 rad，顺时针 |
| 自由端挠度 | $FL^3/(3EI)$ | 21.883 mm，向下 |

在*结果*选项卡中，节点 B 的 R<sub>y</sub> = −0.0082063 rad，D<sub>z</sub> = 0.021883 m。

## 两端固定梁，均布荷载 {#fixed–fixed-beam-uniform-load}

$L = 6$ m，$q = 12$ kN/m，两端固定。这根梁是超静定的，解答取决于刚度；公式来自两端转角均为零的变形协调条件。

::model-figure{caption="两端固定梁，12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| 物理量 | 公式 | 数值 |
| --- | --- | --- |
| 支反力 | $qL/2$ | 36 kN |
| 支座弯矩 | $qL^2/12$ | 36 kNm，负弯矩：M = −36 kNm |
| 跨中弯矩 | $qL^2/24$ | 18 kNm，正弯矩（下缘受拉） |
| C 处挠度 | $qL^4/(384EI)$ | 2.3080 mm，向下 |

两端固定使整个弯矩图平移了 $qL^2/12$：从支座到跨中的总落差仍是 $qL^2/8 = 54$ kNm，与简支梁相同。在应用中，从简支梁模型出发，把两个支座都改为**固定端**，就能看到这一变化。

## 一端固定一端简支梁，均布荷载 {#propped-cantilever-uniform-load}

$L = 6$ m，$q = 12$ kN/m，A 端固定，B 端为滑动铰支座。

::model-figure{caption="一端固定一端简支梁，12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| 物理量 | 公式 | 数值 |
| --- | --- | --- |
| 固定端支反力 | $5qL/8$ | 45 kN |
| 滑动铰支座支反力 | $3qL/8$ | 27 kN |
| 固端弯矩 | $qL^2/8$ | 54 kNm，负弯矩：M = −54 kNm |
| 最大正弯矩 | $9qL^2/128$ | 30.375 kNm |
| ……位于 $V = 0$ 处 | $x = 5L/8$ | 距 A 3.75 m |
| B 处转角 | $qL^3/(48EI)$ | 0.0030773 rad，逆时针 |

EduBeam 会标注内力图的每个极值，所以正弯矩峰值就标在它出现的位置。要求它的位置，看剪力在哪里过零：由 $V(x) = 45 - 12x = 0$ 得 $x = 3.75$ m。

## 两杆桁架 {#two-bar-truss}

两根杆分别从 A $(0, 0)$ 和 B $(4, 0)$ 处的固定铰支座斜向上伸出，交于顶点 C $(2, -2)$，比支座高 2 m。两根杆的两端都设了**端部铰接**，因此只承受轴力。C 点作用竖直向下的荷载 $F = 20$ kN。

::model-figure{caption="两杆桁架，顶点作用 20 kN"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

每根杆的倾角都是 45°。由对称性，两杆轴力相同，取节点 C 的竖向平衡：

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14.142\ \text{kN}
\end{aligned}
$$

两根杆都**受压**。每个支座的支反力为竖向 10 kN、水平 10 kN，水平分力指向内侧：杆件把两个支座向外推。**N (x)** 图和支反力显示的结果相同。

## 简支梁，上下缘温差 {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m，$h = 0.3$ m，$\alpha = 12 \times 10^{-6}$ 1/K。上缘升温 5 K，下缘降温 5 K，因此 $\Delta T_b - \Delta T_t = -10$ K，轴线温度不变（$\Delta T_c = 0$）。简支梁可以自由弯曲，所以**没有内力**，只有曲率：

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0.3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

上缘伸长、下缘缩短，梁向**上**拱起：

::model-figure{caption="上缘温度比下缘高 10 K：梁向上拱起 3.2 mm，没有内力"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| 物理量 | 公式 | 数值 |
| --- | --- | --- |
| C 处挠度 | $\kappa L^2/8$ | 3.2 mm，向上：D<sub>z</sub> = −0.0032 m |
| A 处转角 | $\kappa L/2$ | 0.0016 rad，逆时针 |
| 弯矩 |  | 0 |

均匀温度变化 $\Delta T_c$ 只会使梁伸长，滑动铰支座允许这种伸长，因此同样不产生内力。

现在约束两端的转动（A 端改为**固定端**，B 端改为**滑动固定端**，梁仍可伸长）。梁不能自由弯曲，于是沿全跨产生大小不变的弯矩：

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547.6 \cdot (-4 \times 10^{-4}) = 7.019\ \text{kNm}
\end{aligned}
$$

这是正弯矩：受约束的上缘想伸长，结果受压。

::model-figure{caption="同一根梁，两端转动受约束：弯矩恒为 7.019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

温度荷载的输入方法见[荷载](/zh/essentials/loads#temperature-load)；截面高度 $h$ 属于[截面](/zh/essentials/elements#cross-sections)的参数。

## 支座沉降 {#prescribed-displacement}

取不带荷载的[一端固定一端简支梁](#propped-cantilever-uniform-load)，让 B 处的滑动铰支座沉降 $w = 10$ mm。在 EduBeam 中，这就是在 B 处施加**位移约束** D<sub>z</sub> = 0.01 m。为了跟随沉降，滑动铰支座必须把悬臂端向下拉，梁因此弯曲：

::model-figure{caption="一端固定一端简支梁，B 沉降 10 mm：滑动铰支座以 2.437 kN 向下拉"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| 物理量 | 公式 | 数值 |
| --- | --- | --- |
| 滑动铰支座处的力 | $R = 3EIw/L^3$ | 2.4372 kN，向下拉 |
| 固端弯矩 | $RL$ | 14.623 kNm，负弯矩：M = −14.623 kNm |
| B 处转角 | $3w/(2L)$ | 0.0025 rad，顺时针 |

与荷载不同，支座沉降只在结构抵抗它的地方产生内力：这里梁的刚度越大，$R$ 就越大。简支梁则会像刚体一样随沉降移动，完全不产生内力。

把 12 kN/m 的荷载加回去，结果可以叠加：固定端现在承受 $45 + 2.4372 = 47.437$ kN 和 $54 + 14.623 = 68.623$ kNm，滑动铰支座承受 $27 - 2.4372 = 24.563$ kN。支座沉降的输入方法见[荷载](/zh/essentials/loads#prescribed-displacements-support-settlements)。

## 剪切变形 {#shear-deformation}

EduBeam 的梁单元是 **Timoshenko** 梁：除弯曲挠度外还有剪切挠度，其大小由截面的抗剪刚度 $kGA$ 决定。它会改变哪些结果，取决于结构：

- **静定结构**：支反力和内力仅由平衡条件确定，因此完全不变，只有位移增大。在简支梁和悬臂梁中，截面转角也不变；在其他情况下，例如外伸段的端部，转角也会略有变化。
- **超静定结构**：内力取决于刚度，因此也会略有变化。

### 简支梁 {#shear-simply-supported}

[快速入门](/zh/guide/quick-start#_8-check-by-hand)中的梁说明了差别有多大。它就是上面的简支梁，但采用实际截面，即截面库中的 **IPE 200 (近似)**：$I_y = 1943$ cm⁴，$A = 28.48$ cm²，剪切系数 $k = 0.3933$（腹板面积所占比例），$G = 81$ GPa。因此 $EI = 4080.3$ kNm²，$kGA = 90\,720$ kN。

| 物理量 | 公式 | 数值 |
| --- | --- | --- |
| 端部转角 | $qL^3/(24EI)$ | 0.026469 rad |
| 跨中挠度（弯曲） | $5qL^4/(384EI)$ | 49.629 mm |
| 跨中挠度（剪切） | $qL^2/(8kGA)$ | 0.59524 mm |
| 跨中挠度（总计） | 两者之和 | 50.224 mm，与 EduBeam 显示的一致 |

剪切部分占总挠度的 1.2 %。端部转角就是 Euler–Bernoulli 值，支反力和弯矩也是如此。

### 悬臂梁：短杆件 {#shear-cantilever}

自由端作用集中荷载 $F$ 的悬臂梁，自由端的弯曲挠度为 $FL^3/(3EI)$，剪切挠度为 $FL/(kGA)$。两者之比为

$$
\frac{\text{剪切}}{\text{弯曲}} = \frac{3EI}{kGA\,L^2}
$$

同样是 IPE 200，4 m 长的悬臂梁这一比值为 0.84 %，1 m 长的则达到 13.5 %：剪切变形对短而高的杆件很重要。

### 一端固定一端简支梁：内力发生变化 {#shear-propped-cantilever}

用 IPE 200 做成的[一端固定一端简支梁](#propped-cantilever-uniform-load)是超静定的，此时滑动铰支座承受的力略大一些。取 $L = 6$ m，$\beta = 3EI/(kGA\,L^2) = 0.0037481$，由滑动铰支座处的变形协调条件得

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27.034\ \text{kN}
$$

而不是 27 kN；固端弯矩则从 54 kNm 降到 $qL^2/2 - R_B L = 53.798$ kNm。这里差别很小，但它随 $\beta$ 增大，也就是杆件越短越高，差别越大。

### 与 Euler–Bernoulli 梁比较 {#shear-switch-off}

要与 Euler–Bernoulli 公式比较，就把截面的**剪切系数**设为一个很大的值，例如 `1e10`。剪切部分随之消失，本页所有算例又都完全吻合。单元列式见理论手册中的[梁单元](/zh/elements/beam)。

## 自行校核的技巧 {#tips-for-your-own-checks}

- 随时留意视图右下角的**单位标记**：多数差异都出在单位上。
- 从**结果**选项卡和悬停提示中读取精确数值，不要从内力图的标注上读。**导出 CSV** 或**复制**还会给出支反力，可直接用于电子表格。见[结果与内力图](/zh/essentials/results#results-tab)。
- 在设置中把**数字格式**设为*自动*，就能看到 `40` 而不是 `4 · 10¹`。
- 学习矩阵位移法（直接刚度法）时，用**刚度矩阵**窗口把单个单元与理论手册中的[梁单元](/zh/elements/beam)对照。
- 用**分享模型**把核对过的模型交给同事或老师。
- 要一次核对大量算例，或生成已知答案的习题，可以在代码中运行同一个求解器：应用中的每个数字都出自 [@edubeam/fem](/zh/solver) 这个库。
