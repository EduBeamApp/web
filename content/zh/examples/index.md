---
description: "六个已求解的梁、刚架和桁架模型，一键在 EduBeam 中打开，每个都附有练习、观察要点和答案，供你核对手算结果。"
source: site
---

# 示例

下面每张卡片都是一个已经求解、实时计算的模型。点击即可在 [EduBeam]{.edubeam} 中打开并直接编辑：拖动节点、修改荷载或勾选铰接，内力图随之变化。下文的练习把每个模型变成一道小课题，并附有答案，供你核对手算结果。

::feature-structures
::

应用中的 **☰ → 示例**里也有这些模型，[run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples&lang=cn){target="_blank"} 会直接打开这个示例库。

::callout{type="info" title="六个示例使用同一种杆件"}
六个示例都使用同一种钢杆件：$E = 210$ GPa，$I_y = 8356\ \text{cm}^4$（因此 $EI = 17\,548$ kNm²），面积为 $1\ \text{m}^2$，剪切刚度取得极大，因此轴向变形和剪切变形都可以忽略。因此，按细长梁的教材公式算出的结果与应用显示的每一位数字都吻合。截面高度取 $1$ m，它只影响温度荷载。
::

## 建议练习 {#suggested-exercises}

先手算出答案，再到应用中核对：从上面的卡片打开模型，或点击图形下方的**在 EduBeam 中打开**。打开示例会替换当前的模型；按 <kbd>Ctrl</kbd>+<kbd>Z</kbd> 可以恢复原来的模型，它也保存在 **☰ → 最近的结构**中。

### 超静定梁 {#exercise-indeterminate-beam}

一根 3 m 长的梁，A 端固定，B 端为滑动铰支座，承受 10 kN/m 的均布荷载。

::model-figure{caption="A 端固定，B 端滑动铰支座，10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. 用力法或固端弯矩表，手算支反力和固定端弯矩。
2. 取消 A 处的 `Ry`，使梁变为简支梁。最大弯矩如何变化？
3. 重新勾选 A 处的 `Ry`，再勾选 B 处的 `Ry`，使两端都固定。

**注意观察**弯矩图在何处变号，以及固定端为什么比滑动铰支座分担更多的荷载。

::callout{type="details" title="答案"}
- 一端固定一端简支：$R_A = 5qL/8 = 18.75$ kN，$R_B = 3qL/8 = 11.25$ kN，$M_A = qL^2/8 = 11.25$ kNm（负弯矩）。最大正弯矩为 $9qL^2/128 = 6.33$ kNm，位于距 B 1.125 m 处，该处剪力为零。
- 简支：跨中弯矩 $qL^2/8 = 11.25$ kNm，与原来固定端弯矩的数值相同。
- 两端固定：两端负弯矩 $qL^2/12 = 7.5$ kNm，跨中正弯矩 $qL^2/24 = 3.75$ kNm。
::

### 悬臂梁 {#exercise-cantilever}

一根 4 m 长的悬臂梁，A 端固定，自由端 B 受向下 18 kN 的集中荷载。

::model-figure{caption="悬臂梁，自由端 18 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. 求固定端弯矩、自由端挠度和自由端转角，并与**结果 → 节点结果**中节点 B 的数值比较。
2. 在**截面**选项卡中把 $I_y$ 减半。哪些量变了，哪些没变？
3. 把集中荷载换成 4.5 kN/m 的均布荷载，总荷载同样是 18 kN：在**荷载**选项卡中删除节点荷载，然后点击**添加单元荷载**。

**注意观察**弯矩图的形状：集中荷载下是直线，均布荷载下是抛物线。

::callout{type="details" title="答案"}
- $M_A = FL = 72$ kNm，$w_B = FL^3/(3EI) = 21.88$ mm，$\varphi_B = FL^2/(2EI) = 8.21$ mrad。
- $I_y$ 减半，挠度加倍，为 43.77 mm。弯矩仍为 72 kNm：悬臂梁是静定的，内力与刚度无关。
- 均布荷载：$M_A = qL^2/2 = 36$ kNm，$w_B = qL^4/(8EI) = 8.21$ mm。总荷载相同，弯矩减半，挠度只有原来的八分之三。
::

### 华伦桁架 {#exercise-pratt-truss}

一榀跨度 9 m、高 1.8 m 的桁架，上弦三个节点 E、F、G 各受 8 kN 竖向荷载。在显示选项中勾选 **N (x)** 查看轴力。（斜杆交替布置、不设竖杆，多数教材把这种形式称为华伦桁架。）

::model-figure{caption="节点 A 至 G，E、F、G 处各 8 kN"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. 求支反力，再用节点法求端斜杆 A–E 和下弦杆 A–B 的轴力。
2. 用截面法求中间节间的上弦杆轴力和下弦杆 B–C 的轴力。
3. 本模型中的节点是刚接的。在**单元**选项卡中为每根杆件勾选两端的铰接，使它成为铰接桁架，再比较轴力。
4. 删除斜杆 B–F，先在刚接、再在铰接的情况下试一试。桁架还能承载吗？

**注意观察**正负号的规律：上弦杆受压，下弦杆受拉，斜杆拉压交替。

::callout{type="details" title="答案"}
- 支反力：A、D 处各 12 kN。
- 端斜杆：受压 15.62 kN。下弦杆 A–B 和 C–D：受拉 10.00 kN。
- 上弦杆 E–F 和 F–G：受压 13.33 kN（对 B 取矩：$(12 \cdot 3 - 8 \cdot 1.5)/1.8$）。下弦杆 B–C：受拉 16.67 kN（对 F 取矩：$(12 \cdot 4.5 - 8 \cdot 3)/1.8$）。中间斜杆：5.21 kN，其中从 E、G 向下连到下弦的两根受拉，向上连到 F 的两根受压。
- 刚接与铰接得到的轴力相差不到 0.1 %。由三角形组成的桁架中，弯曲可以忽略，这正是铰接模型适用的原因。
- 去掉 B–F 后，刚接桁架靠刚架作用仍能承载，弯矩约为 3 kNm。铰接时则少了一根杆：桁架成为机构，EduBeam 会显示它如何运动。
::

### 三跨连续梁 {#exercise-three-span-continuous-beam}

一根 16 m 长的梁，三跨分别为 5 + 6 + 5 m：第一跨 8 kN/m，C 处集中荷载 20 kN，最后一跨 6 kN/m。刚打开时只有 A 和 D 有支座。

::model-figure{caption="刚打开时：只有 A 和 D 有支座"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. 刚打开时，它是一根 16 m 的简支梁。求支反力以及 B、C 处的弯矩。
2. 在 B 和 C 处勾选 `Dz`，使它成为四个支座上的连续梁。
3. 用三弯矩方程求支座 B、C 处的弯矩，再求支反力。

**注意观察**中间支座处出现的负弯矩、各处弯矩减小了多少，以及 C 成为支座后 20 kN 荷载的去向。

::callout{type="details" title="答案"}
- 简支：$R_A = 44.69$ kN，$R_D = 45.31$ kN，$M_B = 123.4$ kNm，$M_C = 151.6$ kNm，均为正弯矩。
- 连续梁，$M_A = M_D = 0$：
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  解得 $M_B = -9.766$ kNm，$M_C = -5.859$ kNm，均为负弯矩。C 处的 20 kN 直接传入支座，不引起任何弯曲。
- 支反力：A 18.05 kN，B 22.60 kN，C 35.52 kN（含那 20 kN），D 13.83 kN，合计等于总荷载 90 kN。

::model-figure{caption="四个支座上的连续梁"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### 门式刚架 {#exercise-portal-frame}

8 m 长的横梁支承在两根 6 m 高的柱上，A 端固定，D 端为滑动铰支座。横梁承受 10 kN/m，柱顶角点 C 受向左 8 kN 和向下 10 kN 的力。

::model-figure{caption="A 端固定，D 端滑动铰支座：横梁上 10 kN/m，C 处 8 kN 和 10 kN"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. 这个刚架是几次超静定？
2. 取消 A 处的 `Ry`，使 A 成为固定铰支座。刚架变为静定：手算支反力以及角点 B、C 处的弯矩。
3. 重新勾选 A 处的 `Ry`，再勾选 D 处的 `Dx`，使 D 成为固定铰支座。在变形图中观察横梁的侧移。

**注意观察**刚架顶部向哪边移动。按打开时的模型，它向右移动，与 8 kN 荷载的方向相反。为什么？

::callout{type="details" title="答案"}
- 四个支反力（固定端三个，滑动铰支座一个），三个平衡方程：一次超静定。D 也改为固定铰支座后，为两次超静定。
- A 改为固定铰支座时：$V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN，$V_A = 46$ kN，$H_A = 8$ kN，向右。角点 B 的弯矩为 $8 \cdot 6 = 48$ kNm。C 处弯矩为零：D 处没有水平支反力，右柱只承受 44 kN 的轴力。
- 按打开时的模型，顶部向右移动 9.5 mm：受荷横梁传给左柱的弯矩使这根下端固定的柱弯曲，其影响大于 8 kN 水平力。D 改为固定铰支座后，D 承受 4.9 kN 的水平力，顶部向左移动 4.8 mm。
::

### 温度荷载 {#exercise-temperature-load}

一根 8 m 长的简支梁，轴线升温 $\Delta T_c = 20$ K，下缘比上缘低 10 K（$\Delta T_b - \Delta T_t = -10$ K）。

::model-figure{caption="8 m 简支梁，升温 20 K，下缘比上缘低 10 K"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. 先别看结果：温度会引起哪些内力？梁会怎样变形和移动？
2. 勾选 B 处的 `Dx`，阻止梁伸长。
3. 再勾选两端的 `Ry`。

**注意观察**变形图和**结果 → 节点结果**中的数值：加约束之前，梁只变形和移动，没有任何内力。

::callout{type="details" title="答案"}
- 静定梁可以自由伸长和弯曲，因此没有内力。B 向外滑动 $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1.92$ mm。较冷的下缘缩短，梁向上拱起，曲率 $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1.2 \cdot 10^{-4}$ 1/m：两端转动 $\kappa L/2 = 0.48$ mrad，跨中上升 $\kappa L^2/8 = 0.96$ mm。
- 两端都约束水平位移：$N = -EA\alpha\Delta T_c = -50\,400$ kN，受压。数值这么大，是因为面积取的是占位值 1 m²；换成面积 28.48 cm² 的 IPE 200，轴力为 143.5 kN。
- 两端都固定：全梁为常弯矩 $EI\alpha(\Delta T_b - \Delta T_t)/h = 2.11$ kNm。
::

## 详解教程 {#worked-tutorials}

规模更大的模型，逐步建立，并用手算核对：

::card-grid{cols="2"}
:::card{title="斜梁" icon="lucide:move-diagonal" to="/zh/tutorials/inclined-beam"}
雪荷载作用下的斜梁：按水平投影长度每米计的荷载、沿斜面的轴力和剪力，以及斜置的滑动铰支座。
:::
:::card{title="三铰刚架" icon="lucide:triangle" to="/zh/tutorials/three-hinged-frame"}
带中间铰的刚架：支反力以及 N、V、M。
:::
:::card{title="平面桁架" icon="lucide:git-fork" to="/zh/tutorials/truss"}
节点法、截面法、零杆，以及用虚功原理求位移。
:::
:::card{title="连续梁与支座沉降" icon="lucide:spline" to="/zh/tutorials/continuous-beam"}
两跨连续梁，先用力法求解，再让中间支座沉降 10 mm。
:::
::

更多可用闭合解核对的算例，见[手算校核结果](/zh/guide/verification)。

## 更多题目 {#more-problems}

[结构力学练习题](/zh/practice)随时为你生成新的梁、刚架或桁架题目，每次数值都不同，并当场核对你算出的支反力以及最大弯矩或杆件轴力。用于课堂时，[试卷生成器](/zh/exam)为每名学生打印一套不同的试卷，并附参考答案；[@edubeam/plot](/zh/guide/teaching#exercise-sheets-tests-and-slides-from-code) 则可以用代码生成习题单。

## 贡献示例 {#contribute-an-example}

有好的教学模型？请在 [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) 中分享它的链接，我们可能会把它加入示例库。
