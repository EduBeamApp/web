---
description: "EduBeam 中的桁架杆：两端铰接的梁单元，为什么它正好就是经典的桁架单元，以及它的刚度矩阵和坐标转换矩阵。"
source: site
---

# 桁架单元

桁架杆只承受轴力。EduBeam 没有单独的桁架单元：桁架杆就是两端都勾选了**端部铰接**的[梁单元](/zh/elements/beam)。本页说明为什么它正好就是经典的两节点桁架单元，给出它的刚度矩阵和坐标转换矩阵，并说明带铰的梁单元能做到哪些教材中桁架杆做不到的事。

::model-figure{caption="所有杆件两端铰接：两根斜杆的轴力 N = −7.071 kN，拉杆 +5 kN，没有杆件受弯"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
results: [N]
show: [nodeLabels]
---
::

在应用中建立桁架时，为每根杆件勾选**起点铰接**和**终点铰接**；也可以在用鼠标绘制杆件之前，先在横幅中勾选这两项（见[单元、材料与截面](/zh/essentials/elements#end-hinges)一页的“端部铰接”）。[教程：平面桁架](/zh/tutorials/truss)一步步建立了一个桁架。

## 自由度 {#degrees-of-freedom}

桁架杆只用到每端的两个平动位移，在其[局部坐标系](/zh/elements/conventions#element-local-axes)中表示：

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="桁架杆：两端铰接，每端两个平动位移"}
::

| 方向 | 起始节点（1） | 终止节点（2） |
| --- | --- | --- |
| 沿局部 x 轴 | $u_1$ 与 `X12` | $u_2$ 与 `X21` |
| 沿局部 z 轴 | $w_1$ 与 `Z12` | $w_2$ 与 `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

由于每根杆件都是梁单元，节点仍保留转角 `Ry`，但两端铰接的杆件既不受它影响，也不传递它：杆端弯矩 `M12` 和 `M21` 始终为零。如果交于某节点的杆件全都铰接，这个转角就不受任何约束。求解器令它为零；但若在这样的节点上施加节点力偶，力偶无处可传，求解会中止，并提示*结构为机构：刚度矩阵奇异。*

## 局部刚度矩阵 {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

其中 $E$ 为弹性模量，$A$ 为截面面积，$L$ 为杆长。只有杆件的伸长或缩短才需要做功（产生应变能），因此没有单元荷载时，杆件的轴力为常数：

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### 为什么两端铰接的梁就是桁架杆 {#why-a-beam-with-two-hinges-is-a-truss-bar}

像处理任何[端部铰接](/zh/elements/beam#end-hinges)一样，从[梁的刚度矩阵](/zh/elements/beam#local-stiffness-matrix)中凝聚掉两个杆端转角。轴向项与转角无关，保持不变。弯曲项则全部消失：两端转角都自由后，任意一对杆端位移 $w_1$、$w_2$ 都只是让杆件绕铰作刚体转动，不需要任何能量。求解器以数值方式完成这一凝聚，对任意剪切系数都适用，得到的矩阵与上式只差浮点舍入误差。

::callout{type="details" title="凝聚过程详解"}
对弯曲部分，把自由度分为保留的 $a = (w_1, w_2)$ 和释放的 $b = (\varphi_1, \varphi_2)$。由梁的刚度矩阵（$k_1$ 至 $k_4$ 和剪切参数 $\Phi$ 的定义见[梁单元](/zh/elements/beam#local-stiffness-matrix)一页）得

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

由于 $\mathbf{K}_{ab}$ 的两列相同，起作用的只有 $\mathbf{K}_{bb}^{-1}$ 全部元素之和，它等于 $2/(k_3 + k_4)$：

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

由 $k_3 + k_4 = 6EI_y / ((1+\Phi)L)$，系数为 $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$，所以上式恰好等于 $\mathbf{K}_{aa}$，凝聚后的弯曲刚度 $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ 为零。
::

## 坐标转换矩阵 {#transformation-matrix}

设杆件的倾角为 $\theta$（从整体 x 轴转向整体 z 轴量取），$c = \cos\theta = (x_2 - x_1)/L$，$s = \sin\theta = (z_2 - z_1)/L$，则局部位移为 $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$，其中

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

即[梁的坐标转换矩阵](/zh/elements/beam#transformation-matrix)中与平动对应的行和列。z 轴向下，要注意 $s$ 的符号：上面桁架中的斜杆 A → C 是向上的，所以 $z_2 - z_1 = -3$ m，$c = 0.7071$，$s = -0.7071$。

## 整体刚度矩阵 {#global-stiffness-matrix}

$\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$ 展开后为

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

两端铰接杆件的**刚度矩阵**窗口，在平动对应的行和列中显示的就是这些数值，转角对应的行和列为零。

## 带铰梁单元比桁架杆多出的能力 {#where-a-hinged-beam-does-more}

EduBeam 中的桁架杆仍是梁单元，因此能做到两件教材中桁架杆做不到的事：

- **承受沿杆长的荷载**。作用在杆上的线荷载（例如自重）使杆件在两节点之间像简支梁一样弯曲，并向两端节点各传递 $qL/2$。其余杆件在这些节点荷载作用下承受桁架的轴力。在受荷杆件本身，荷载沿杆轴的分量使 $N$ 沿杆长线性变化，桁架轴力等于杆长中点处的值。
- **与梁混合使用**。刚架中可以包含铰接的杆件，例如拉杆或支撑斜杆，无需特殊的单元类型。

在上面桁架的拉杆上加 5 kN/m：

::model-figure{caption="同一桁架，拉杆上加 5 kN/m：轴力不变，拉杆弯曲，M = qL²/8 = 22.5 kNm"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
  - { member: 3, qz: 5 }
results: [M, N]
show: [nodeLabels]
---
::

手算核对：取节点 C，由竖向平衡 $2\,N \sin 45^\circ + 10 = 0$ 得每根斜杆 $N = -7.071$ kN。取节点 A，斜杆轴力的水平分量 $7.071 \cos 45^\circ = 5$ kN 由拉杆平衡，拉杆受拉，$N = +5$ kN。拉杆上的荷载直接传给两端的支座：每个支反力增加 $qL/2 = 15$ kN，各杆轴力不变。

桁架作为铰接体系必须几何不变。例如，没有斜杆的正方形节间就是机构：EduBeam 会指出是哪些铰，并显示它如何运动（见[疑难解答](/zh/reference/troubleshooting#no-results-are-drawn)）。
