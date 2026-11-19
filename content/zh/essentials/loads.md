---
description: "在 EduBeam 中施加力、力偶、支座沉降、均布荷载、梯形分布荷载、集中荷载和温度荷载，并说明各自的符号约定：z 向下为正，力矩逆时针为正。"
source: site
---

# 荷载

荷载作用在节点上或沿单元分布。所有荷载都属于**同一个荷载工况**，同时作用；要比较不同方案，请把每个方案分别保存为[项目文件或分享链接](/zh/essentials/import-export)。

| 荷载 | 作用对象 | 添加方法 |
| --- | --- | --- |
| [力或力偶](#nodal-loads) | 节点 | *荷载*选项卡 → **添加节点荷载**，或点击节点 → **添加荷载** |
| [给定位移](#prescribed-displacements-support-settlements)（支座沉降） | 有支座的节点 | 同一个对话框，或点击节点 → **施加位移约束** |
| [均布](#uniformly-distributed-load)、[梯形分布](#trapezoidal-load)、[集中](#concentrated-load)或[温度](#temperature-load)荷载 | 单元 | *荷载*选项卡 → **添加单元荷载**，或点击单元 → **添加荷载** |

## 符号约定 {#sign-convention-in-one-line}

x 轴**向右**，z 轴**向下**，力矩以**逆时针**为正。所以正的 `Fz` 或 `fz` 是向下的、与重力同向的荷载，向上的荷载为负。

::model-figure{caption="图中荷载均为正值：Fx = +10 kN 向右，Fz = +10 kN 向下，My = +10 kNm 逆时针"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| 正方向 | 默认坐标轴（z 向下） | [y 轴向上的坐标系](/zh/elements/conventions#y-up-axes) |
| --- | --- | --- |
| 水平力 `Fx`、`fx` | 向右 | 向右 |
| 竖向力 | `Fz`、`fz`：**向下** | `Fy`、`fy`：**向上** |
| 力矩 | `My`：逆时针 | `Mz`：逆时针 |
| 竖向沉降 | `Dz`：向下 | `Dy`：向上 |

按单元**局部坐标系**输入的荷载（勾选 LCS）则随单元而定：局部 x 轴从起始节点指向终止节点，局部 z 轴由局部 x 轴顺时针转 90° 得到，指向沿单元画出的虚线一侧。见[单元方向](/zh/essentials/elements#element-direction)。包括内力在内的完整约定见[坐标系与符号约定](/zh/elements/conventions#loads)。

## 节点荷载 {#nodal-loads}

*荷载*选项卡 → **添加节点荷载**，或点击节点 → **添加荷载**，保持选中**力/力矩**。按[上述](#sign-convention-in-one-line)符号输入力 `Fx`、`Fz`（kN）和力矩 `My`（kNm）；输入的同时，预览会画出荷载。

![添加节点荷载：输入时预览显示荷载方向](/screenshots/zh/loads-nodal.webp){.shot-md}

- 分量按**整体**坐标轴给出。在坐标轴转动过的节点上（[斜支座](/zh/essentials/nodes-supports#inclined-skewed-supports)），对话框会增加**整体坐标轴** / **节点坐标轴**切换。按节点坐标轴输入时，分量显示为 `Fx′` 和 `Fz′`，沿节点自身的坐标轴作用；以后节点角度改变，荷载也随之转动。切换时数值会自动换算，荷载本身保持不变。
- 一个节点上可以有多个节点荷载，它们相互叠加。

### 位移约束（支座沉降） {#prescribed-displacements-support-settlements}

要让支座产生给定的位移，在同一对话框中选择**位移约束**，或点击有支座的节点 → **施加位移约束**。输入位移 `Dx`、`Dz`（向右、向下为正，单位为[位移单位](/zh/essentials/units-settings#units)，默认 m）和转角 `Ry`（rad，逆时针为正）。

- 只有**受约束**的自由度才能给定位移：其他输入框呈灰色，没有支座的节点则根本不能设置沉降。
- 一个节点最多只能有一个位移约束。要修改，请直接编辑它，不要再添加一个。
- 在斜支座上，输入框显示为 `Dx′` 和 `Dz′`：沉降沿支座自身的坐标轴作用。

沉降是否引起内力，取决于结构。同样是支座 B 沉降 10 mm，没有其他荷载：

::div{.shots}

:::model-figure{caption="简支梁：梁只是倾斜，没有支反力，M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="在 B 处连续的两跨梁：梁发生弯曲，B 处 M = 21.06 kNm"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

静定结构会顺着支座移动，不受任何阻碍。连续梁则必须弯曲：支座 B 把梁向下拉了 $\delta = 10\ \text{mm}$，相当于在 10 m 简支梁的跨中作用一个集中力。取 $L = 5\ \text{m}$ 和示例钢梁的 $EI = 17\,548\ \text{kNm}^2$，这个力为 $P = 6EI\delta/L^3 = 8.423\ \text{kN}$，即 B 处的支反力，$M_B = PL/2 = 3EI\delta/L^2 = 21.06\ \text{kNm}$。[教程：连续梁与支座沉降](/zh/tutorials/continuous-beam)中，沉降与荷载同时作用。

## 单元荷载 {#element-loads}

*荷载*选项卡 → **添加单元荷载**，或点击单元 → **添加荷载**。选择**荷载类型**；输入的同时，预览会显示单元上的荷载。力以 kN 计，线荷载以 kN/m 计，或采用你选择的其他[单位](/zh/essentials/units-settings#units)。

![添加单元荷载：均布荷载](/screenshots/zh/loads-udl.webp){.shot-md}

### 均布荷载 {#uniformly-distributed-load}

沿单元全长大小不变的线荷载 `fx` 和 `fz`。勾选 **LCS**（默认）时沿单元的局部坐标轴作用；不勾选时沿整体坐标轴作用。对于从左向右画的水平单元，两者相同；对于倾斜杆件则不同：

| 需要的荷载 | 输入方式 |
| --- | --- |
| **垂直于**杆件的荷载（斜梁上的风荷载） | **勾选** LCS，输入 `fz` |
| 按杆件长度每米计的**竖向**荷载（自重） | **不勾选** LCS，输入 `fz` |
| 按水平投影长度每米计的**竖向**荷载（雪荷载） | 不能直接输入：乘以 $\cos\alpha$（$\alpha$ 为杆件倾角），再作为竖向荷载输入 |

同样是 10 kN/m，作用在水平跨度 4 m、高 3 m、长 5 m 的斜梁上：

::div{.shots}

:::model-figure{caption="不勾选 LCS：竖向荷载，合计 50 kN；M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="勾选 LCS：垂直于杆件；M = 31.25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

手算：垂直于杆件时，$M = qL^2/8 = 10 \cdot 5^2/8 = 31.25\ \text{kNm}$；竖向时，50 kN 分布在 4 m 的水平跨度上，相当于按水平投影计 12.5 kN/m，所以 $M = 12.5 \cdot 4^2/8 = 25\ \text{kNm}$。

### 梯形分布荷载 {#trapezoidal-load}

沿单元线性变化的荷载：**起始**节点处为 `f1x`、`f1z`，**终止**节点处为 `f2x`、`f2z`。一端取零即为三角形分布荷载。

::model-figure{caption="三角形分布荷载，0 到 10 kN/m：支反力 10 kN 和 20 kN，3.46 m 处最大 M = 23.09 kNm"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

手算：合力 $qL/2 = 30\ \text{kN}$ 作用在 $2L/3$ 处，所以 $R_A = 10\ \text{kN}$，$R_B = 20\ \text{kN}$；在 $x = L/\sqrt{3} = 3.46\ \text{m}$ 处剪力为零、弯矩最大，$M = qL^2/(9\sqrt{3}) = 23.09\ \text{kNm}$。

梯形分布荷载沿单元的**局部坐标轴**作用（LCS 复选框锁定）。对于从左向右画的水平单元，这与整体坐标轴相同；对于倾斜单元，`f1z` 和 `f2z` 垂直于杆件，`f1x`、`f2x` 沿杆件方向。

倾角为 $\alpha$ 的杆件上变化的**竖向**荷载仍然可以精确输入：在每一端输入它的两个局部分量，$f_z = q\cos\alpha$，$f_x = q\sin\alpha$ 指向下坡方向；如果单元从起始节点向上坡延伸，$f_x$ 为负。对于上面那根水平跨度 4 m、高 3 m、从下端开始绘制的斜梁，按杆长计从 0 增大到 10 kN/m 的竖向荷载就是 `f1x` = `f1z` = 0，`f2x` = −6，`f2z` = 8 kN/m。

::model-figure{caption="按杆长计 0 到 10 kN/m 的竖向荷载，以局部分量输入：支反力 8.333 kN 和 16.67 kN，最大 M = 12.83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

手算：25 kN 的合力作用在水平跨度的三分之二处，即 2.67 m，所以 $R_B = 25 \cdot 2.667/4 = 16.67\ \text{kN}$。在 4 m 的水平投影上，荷载是增大到 12.5 kN/m 的三角形，所以与上例相同，$M = 12.5 \cdot 4^2/(9\sqrt{3}) = 12.83\ \text{kNm}$。

### 集中荷载 {#concentrated-load}

作用在单元**上**任意位置的集中力 `Fx`、`Fz` 或集中力偶 `My`，无需额外节点。**距起始节点的荷载位置**是它到起始节点的距离 $a$，$0 \le a \le L$。初始值为单元长度的一半向下取整到整米，最大 5 m（美制单位下取整英尺，最大 15 ft），所以请把它改到荷载的实际位置。**LCS** 的作用与均布荷载相同。

::model-figure{caption="6 m 跨上距左端 2 m 处作用 20 kN：V 从 13.33 kN 突变为 −6.667 kN，荷载作用点处 M = 26.67 kNm"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

剪力图在荷载作用点突变 `Fz`，弯矩图在该处出现折点：$R_A = 20 \cdot 4/6 = 13.33\ \text{kN}$，$M = 13.33 \cdot 2 = 26.67\ \text{kNm}$。集中力偶 `My` 则使弯矩图发生突变。

### 温度荷载 {#temperature-load}

| 输入框 | 含义 | 效果 |
| --- | --- | --- |
| **ΔT<sub>c</sub>**，轴向温度变化 | 整个截面相同的温度变化 | 伸长 $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | 下缘纤维与上缘纤维的温度变化之差 | 曲率 $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

两者都是相对于无应力状态的温度*变化*，默认以 °C 计；变化 1 °C 即 1 K。温度荷载使用材料的 **α** 和截面的**高度 h**。**下缘**纤维在虚线一侧。正的 ΔT<sub>b</sub> − ΔT<sub>t</sub>（下缘温度更高）使下缘纤维伸长，所以单元会像承受重力荷载的梁一样向下弯曲。

在静定结构中，温度只引起位移。有了约束（固定端、连续性、多余杆件），温度才会产生内力。同一根 6 m 长、0.3 m 高的钢梁，下缘温度比上缘高 20 K：

::div{.shots}

:::model-figure{caption="简支梁：跨中下挠 3.6 mm，M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="两端固定梁：保持平直，全长 M = −14.04 kNm"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

手算：自由曲率 $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0.3 = 8 \times 10^{-4}\ \text{1/m}$。简支梁可以自由弯曲，跨中下挠 $\kappa L^2/8 = 3.6\ \text{mm}$。两端固定时，必须由一个常值弯矩把这一曲率抵消：$M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14.04\ \text{kNm}$。[手算校核结果](/zh/guide/verification#temperature-gradient-on-a-simply-supported-beam)中还算了另一个例子。

## 编辑与删除荷载 {#editing-and-removing-loads}

| 目的 | 操作 |
| --- | --- |
| 快速修改数值 | 在*荷载*选项卡中直接修改分量（以及 LCS 复选框）。 |
| 打开编辑对话框 | 在视图中双击荷载，或点击荷载 → **编辑荷载**。荷载也以标记的形式出现在*节点*和*单元*表格中，点击标记即可编辑。 |
| 删除 | 选中后按 <kbd>Delete</kbd>，点击荷载 → **删除**，或点*荷载*选项卡中的 ×。 |

荷载从属于所在的节点或单元：删除节点或单元，荷载随之删除；复制时如果同时选中了荷载，荷载也一起复制。

![荷载选项卡：每个荷载一行，分量可以直接修改](/screenshots/zh/loads-table.webp)

## 暂不支持的功能 {#what-is-not-available}

::div{.limits}
- **只有一个荷载工况**：没有荷载组合，请把每个工况分别保存为文件或链接。
- **没有自重**：可作为均布荷载输入（不勾选 LCS），$f_z = \rho\,g\,A$，例如 IPE 200 约为 $0.22\ \text{kN/m}$。
- **梯形分布荷载只能按局部坐标轴输入**：倾斜杆件上变化的竖向荷载，请输入它的[局部分量](#trapezoidal-load)。
- **没有局部分布的线荷载**：线荷载总是布满整个单元，请在荷载的起点和终点处添加节点。
::
