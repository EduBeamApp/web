---
description: "EduBeam 的两节点 Timoshenko 梁单元：精确的单元刚度矩阵、剪切变形、用静力凝聚处理端部铰接、固端力与坐标转换。"
source: site
---

# 梁单元

EduBeam 中的每根杆件，无论是梁、柱还是桁架杆，都是同一种单元：位于 x–z 平面内、截面不变的两节点直杆 **Timoshenko 梁**。本页按求解器实际的计算方式给出它的列式，你可以据此手算任何单元矩阵或荷载向量，并与应用中的结果核对。正负号遵循[坐标系与符号约定](/zh/elements/conventions)，代码在 [@edubeam/fem](/zh/solver) 的 `Beam2D.ts` 中；各单元如何组合起来求出整个结构的解，见 [EduBeam 如何求解模型](/zh/elements/analysis)。

## 自由度 {#degrees-of-freedom}

每个节点有三个自由度，因此单元共有六个自由度。在单元的[局部坐标系](/zh/elements/conventions#element-local-axes)中，每个杆端位移都对应一个[单元端力](/zh/elements/conventions#end-forces-element-results-table)，即*单元结果*表格中的一列：

::element-sketch{mode="dofs" caption="梁单元的六个自由度，均按正方向绘制；虚线表示下缘纤维（局部 +z 侧）"}
::

| 方向 | 起始节点（1） | 终止节点（2） |
| --- | --- | --- |
| 沿局部 x 轴 | $u_1$ 与 `X12` | $u_2$ 与 `X21` |
| 沿局部 z 轴（从左向右画的单元为向下） | $w_1$ 与 `Z12` | $w_2$ 与 `Z21` |
| 转角，逆时针 | $\varphi_1$ 与 `M12` | $\varphi_2$ 与 `M21` |

按这个顺序排列，得到单元的杆端位移向量和杆端力向量：

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

由于 z 轴向下、转角以逆时针为正，不计剪切变形时，梁轴线的转角为 $\varphi = -\,\mathrm{d}w/\mathrm{d}x$。

## 局部刚度矩阵 {#local-stiffness-matrix}

没有单元荷载时，单元端力为 $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$，其中

$$
\mathbf{K}_l =
\begin{bmatrix}
 k_N & 0 & 0 & -k_N & 0 & 0 \\
 0 & k_1 & -k_2 & 0 & -k_1 & -k_2 \\
 0 & -k_2 & k_3 & 0 & k_2 & k_4 \\
 -k_N & 0 & 0 & k_N & 0 & 0 \\
 0 & -k_1 & k_2 & 0 & k_1 & k_2 \\
 0 & -k_2 & k_4 & 0 & k_2 & k_3
\end{bmatrix}
$$

且

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ 和 $G$ 是材料的弹性模量和剪切模量，$A$ 是截面面积，$I_y$ 是截面对 y 轴的惯性矩，$k$ 是截面的**剪切系数**，$L$ 是单元长度。$\Phi$ 称为**剪切参数**，反映杆件剪切柔度与弯曲柔度之比：杆件越短、截面越高，$\Phi$ 越大。$\Phi = 0$ 时，各项就是 Euler–Bernoulli 梁熟悉的 $12EI/L^3$、$6EI/L^2$、$4EI/L$ 和 $2EI/L$。轴向与弯曲互不耦合：$u_1$ 和 $u_2$ 只与 $k_N$ 有关。

y 轴向上的教材，在本矩阵写 $-k_2$ 的位置写的是 $+6EI/L^2$。两者描述的是同一刚度，只是横向位移的正方向不同。

::callout{type="details" title="矩阵从何而来：精确形函数"}
对于不受荷载的等截面 Timoshenko 杆件，平衡方程有精确解：$u$ 是 $x$ 的线性函数，$w$ 是三次函数，$\varphi$ 是二次函数。用杆端位移表示，并令 $\xi = x/L$，挠度为

$$
w(\xi) = N_1\,w_1 + N_2\,\varphi_1 + N_3\,w_2 + N_4\,\varphi_2,
$$

$$
\begin{aligned}
N_1 &= \frac{(1-\xi)\,(1+\Phi+\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_2 &= -\frac{L\,\xi\,(1-\xi)\,(2+\Phi-2\xi)}{2\,(1+\Phi)}, \\[1ex]
N_3 &= \frac{\xi\,(\Phi+3\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_4 &= \frac{L\,\xi\,(1-\xi)\,(\Phi+2\xi)}{2\,(1+\Phi)}.
\end{aligned}
$$

$\Phi = 0$ 时，它们就是三次 Hermite 多项式，$N_1 = 1 - 3\xi^2 + 2\xi^3$，$N_2 = -L\,\xi(1-\xi)^2$，其中的负号来自 $\varphi = -w'$。刚度矩阵给出的正是产生这些精确位移形状所需的杆端力，所以它是杆件的精确刚度，而不是随单元加密才逐渐逼近的近似值。求解器绘制变形图时用的也是这些函数。
::

## 剪切变形：Timoshenko 梁还是 Euler–Bernoulli 梁？ {#timoshenko-or-euler-bernoulli}

单元是否发生剪切变形只取决于 $\Phi$，也就是取决于截面的剪切系数 $k$：$kA$ 是有效抗剪面积。各类截面的 $k$ 有各自的初始值：

| 截面 | 剪切系数 $k$ |
| --- | --- |
| 初始模型和内置示例 | $10^{32}$，使 $\Phi \approx 0$，即 Euler–Bernoulli 梁 |
| 截面库中的工字形、H 形和宽翼缘截面 | $h\,t_w / A$：剪力由腹板承担 |
| 截面库中的矩形空心截面 | $2\,h\,t / A$：两侧壁板承担剪力 |
| 截面库中的矩形和正方形截面 | 0.833 |
| 截面库中的圆形截面 | 0.9 |
| 截面库中的圆形空心截面 | 0.5 |
| 多边形截面 | 初始为 0.833 |
| **添加截面**对话框 | 初始为 1 |

对细长杆件，两者差别很小。简支梁受均布荷载时，剪切变形使跨中挠度在弯曲挠度的基础上增加 $0.8\,\Phi$ 倍。以钢制 IPE 200 为例，跨度 6 m 时只增加 1.2 %，跨度 2 m 时则增加 11 %。要关闭剪切变形，把 $k$ 设为很大的数，例如 `1e32`。除非另有说明，本网站的实时图形都使用不计剪切变形的示例截面，因此与按 Euler–Bernoulli 理论手算的结果一致。下图是个例外：

::model-figure{caption="IPE 200，跨度 2 m，k = h·tw/A = 0.393：跨中 w = 0.5657 mm，比 Euler–Bernoulli 理论的 0.5106 mm 大 11 %（Φ = 0.135）"}
---
nodes: { A: [0, 0], B: [2, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
material: { e: 210e9, g: 81e9 }
section: { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 }
results: [w, M]
---
::

## 端部铰接 {#end-hinges}

勾选[端部铰接](/zh/essentials/elements#end-hinges)后，单元该端的弯矩为零。这时该端转角与节点脱开，成为单元内部的自由量，求解器用**静力凝聚**把它消去。把六个自由度分为保留的自由度 $a$ 和被释放的杆端转角 $b$：

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

其中 $\mathbf{f}_\mathrm{fix}$ 是[单元荷载](#element-loads)的固端力。由第二行求得铰处的转角：

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

代回第一行，得到凝聚后的刚度矩阵和固端力：

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

求解器把 $\mathbf{K}^{*}$ 写回 6 × 6 矩阵，被释放转角对应的行和列全为零，因此带铰单元的集成与其他单元完全相同。求解之后，再按上式恢复 $\mathbf{d}_b$，变形图上就能看到铰处的折点。

终止节点有铰时，与 $(w_1, \varphi_1, w_2)$ 对应的弯曲部分变为

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

$\Phi = 0$ 时，它就是一端固定一端铰支杆件经典的 $3EI/L^3$ 刚度。**两端**都有铰时，弯曲项全部消失，只剩下 $EA/L$：单元成了[桁架杆](/zh/elements/truss)。

铰属于单元的端部，而不属于节点。如果交于某节点的所有单元在该节点处都设了铰，节点本身的转角就不与任何单元相连。求解器令这个转角为零，这对结果没有影响；但若在这样的节点上施加节点力偶，力偶无处可传，刚度方程就会奇异。

## 单元荷载 {#element-loads}

单元上的荷载以**等效节点荷载** $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ 的形式进入求解。**固端力** $\mathbf{f}_\mathrm{fix}$ 是把单元两端固定后，荷载作用下两端所需的杆端力。

下面的公式都在局部坐标系中给出。按整体坐标轴输入的荷载（未勾选 **LCS**）先用单元[倾角](#transformation-matrix)的 $c = \cos\theta$ 和 $s = \sin\theta$ 换算为局部分量：

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

其中带横线的是整体分量。线荷载按单元自身长度每米计。例如，从 $(0, 0)$ 到 $(3, -4)$ 的斜梁，$L = 5$ m，$c = 0.6$，$s = -0.8$（斜梁向上倾斜，$z$ 减小）。作用在它上面的重力荷载 $\bar q_z = 10$ kN/m 分解为沿斜面向下的 $q_x = -8$ kN/m 和垂直于斜梁的 $q_z = 6$ kN/m，斜梁共承受 $10 \times 5 = 50$ kN，而不是 $10 \times 3$。

表中：

- $q_z$、$q_x$：均布荷载；$q_1 \to q_2$：梯形分布荷载，$q_1$ 在起始节点，$q_2$ 在终止节点。
- $F_z$、$F_x$、$M_y$：距起始节点 $a$ 处的集中力或集中力偶，$b = L - a$。
- $\Delta T = \Delta T_b - \Delta T_t$：下缘纤维比上缘纤维温度高；$\Delta T_c$：轴线升温。$\alpha$ 是材料的线膨胀系数，$h$ 是截面的**高度**。

横向分量（z 分量），取 $\Phi = 0$，起始节点处：

$$
\begin{array}{l|cc}
\text{荷载} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

终止节点处：

$$
\begin{array}{l|cc}
\text{荷载} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

轴向分量（x 分量），对任意 $\Phi$ 均成立：

$$
\begin{array}{l|cc}
\text{荷载} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="考虑剪切变形的固端力"}
均布荷载和温度荷载的固端力与 $\Phi$ 无关。其余荷载的固端力如下，其中 $D = 1 + \Phi$，$\Delta q = q_2 - q_1$（z 分量）：

$$
\begin{aligned}
&\text{梯形分布荷载：} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{集中力 } F_z\text{：} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&\text{集中力偶 } M_y\text{：} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

它们是两端固定 Timoshenko 杆件的精确解；求解器为每种荷载在节点之间叠加的挠度也是精确解。
::

带铰单元的固端力按[端部铰接](#end-hinges)一节凝聚为 $\mathbf{f}^{*}_\mathrm{fix}$。例如，终止节点有铰的单元受均布荷载时（$\Phi = 0$），$Z_{12} = -5q_zL/8$，$M_{12} = q_zL^2/8$，$Z_{21} = -3q_zL/8$，$M_{21} = 0$，正是一端固定一端简支梁的固端力。

求解之后，单元上各截面的内力由单元端力和单元上荷载按静力平衡求得；挠度则由形函数加上荷载在两端固定时引起的挠度求得，见 [EduBeam 如何求解模型](/zh/elements/analysis#results-along-the-members)一页的“沿杆长的内力与挠度”一节。

## 坐标转换矩阵 {#transformation-matrix}

设单元的倾角为 $\theta$，从整体 x 轴转向整体 z 轴量取（在屏幕上为顺时针），则

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

局部坐标系中的杆端位移由整体坐标系中的杆端位移求得：$\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$，其中

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 & 0 & 0 \\
 -s & c & 0 & 0 & 0 & 0 \\
 0 & 0 & 1 & 0 & 0 & 0 \\
 0 & 0 & 0 & c & s & 0 \\
 0 & 0 & 0 & -s & c & 0 \\
 0 & 0 & 0 & 0 & 0 & 1
\end{bmatrix}.
$$

转角在两个坐标系中相同。如果节点设置了**节点局部坐标系角度** $\beta$（[斜支座](/zh/essentials/nodes-supports#inclined-skewed-supports)），该节点的未知量 $\mathbf{d}_n$ 就在节点自己的坐标轴中表示，这组坐标轴由整体坐标轴从 x 轴向 z 轴转过 $\beta$ 得到。对该节点的三个自由度，整体分量为

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

求解器在 $\mathbf{T}$ 的右边再乘以由两端节点的 $\mathbf{T}_n$ 组成的分块对角矩阵（没有自身坐标轴的节点取单位矩阵），这样单元就按各节点自己的坐标轴与节点相连。

## 整体刚度矩阵 {#global-stiffness-matrix}

在整体坐标系中，单元刚度矩阵和等效节点荷载为

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

单元有铰时，其中的 $\mathbf{K}_l$ 和 $\mathbf{f}_\mathrm{eq}$ 已经过凝聚。单元的**刚度矩阵**窗口显示的就是 $\mathbf{K}_g$（从*单元*表格或单元的右键菜单打开），单位为国际单位制：N/m、N 和 N·m。[EduBeam 如何求解模型](/zh/elements/analysis)一页把这些矩阵集成为整体刚度矩阵，并手算了一个小例子。
