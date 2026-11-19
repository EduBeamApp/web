---
description: "在 EduBeam 中放置和编辑节点、吸附到网格、拆分单元，并选择合适的支座：固定铰支座、滑动铰支座、固定端、滑动固定端，以及它们的竖向和倾斜形式。"
source: site
---

# 节点与支座

节点是模型中的点：单元把节点连接起来，支座和节点荷载都作用在节点上。节点可以输入坐标添加，也可以用鼠标点击放置；然后给有支承的节点设置与你的计算简图相符的支座。

## 坐标 {#coordinates}

每个节点都有 **X** 和 **Z** 两个坐标，单位为当前的[长度单位](/zh/essentials/units-settings#units)。X 向右，**Z 向下**，所以地面以上的点 Z 坐标为负：一根 4 m 高的柱从 `Z = 0` 延伸到 `Z = −4`。

::model-figure{caption="宽 6 m、高 4 m 的门式刚架：A 和 D 位于 Z = 0，B 和 C 位于 Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

如果你更习惯竖轴向上，可以在设置中切换到 [y 轴向上的坐标系](/zh/elements/conventions#y-up-axes)。改变的只是显示方式，模型和文件都保持不变。

## 添加节点 {#adding-nodes}

- **输入坐标**：*节点*选项卡 → **添加节点**（带 **+** 图标的按钮），或在画布上右键 → *添加节点*。输入 X 和 Z，还可以同时设置支座和支座角度。
- **鼠标点击**：*节点*选项卡 → **添加节点**（带光标图标的按钮），或在画布菜单中选择*添加节点*时按住 <kbd>Ctrl</kbd>。每点击一次放置一个节点；按 <kbd>Esc</kbd>、点**取消**或再点一次该按钮即结束。
- **绘制单元时**：[用鼠标绘制单元](/zh/essentials/elements#adding-elements)时，点击空白画布会在该处创建节点。
- **复制**：选中节点（以及单元），按 <kbd>Ctrl</kbd>+<kbd>C</kbd>、<kbd>Ctrl</kbd>+<kbd>V</kbd>，然后点击副本要放的位置；也可以在横幅中输入偏移量 Δx、Δz，再点**粘贴**。

::div{.shots}

![添加节点对话框](/screenshots/zh/qs-node.webp)

![鼠标模式下，顶部的横幅为每个放置的节点设置支座和角度](/screenshots/zh/nodes-add-banner.webp)

::

新节点按顺序取下一个空闲编号：`1`、`2`、`3`……。在表格的*节点*列中可以给任一节点改名，例如改为 `A`、`B`、`C`。

### 吸附 {#snapping}

开启**吸附到网格**（按 <kbd>S</kbd>，或点视图右下角的 **S** 标记）后，放置或拖动的节点都会落在网格上。步长默认为 0.1 m，美制单位下为 0.5 ft，可以在[设置 → 视图设置 → 网格](/zh/essentials/units-settings#viewer-settings)中修改。不在网格上的位置，请在表格中直接输入精确坐标。

### 在已有单元上放置节点 {#placing-a-node-on-an-existing-element}

用鼠标添加节点时，如果点在单元上（或非常靠近单元），EduBeam 会询问你的意图：

- **连接到结构**把单元拆成两段 `1a` 和 `1b`，在新节点处相连。要添加中间支座或加载点，这是最快的方法。原单元两端的铰保持原位。均布荷载和梯形分布荷载分配到两段上。集中荷载和温度荷载则全部归入前一段 `1a`：如果某个集中荷载原来位于新节点之后，请在*荷载*表格中把它移到 `1b`（它的位置改为从新节点算起），并给 `1b` 单独添加温度荷载。
- **放置独立节点**把节点放在单元上方，但不与单元相连。

无论选哪一项，放置节点都会就此结束；要继续放置，再点一次光标按钮。

## 编辑节点 {#editing-nodes}

| 目的 | 操作 |
| --- | --- |
| 移动节点 | 在视图中拖动它（触摸屏上按住并拖动），或在*节点*表格中输入 X 和 Z。相连的单元及其荷载和尺寸标注随之移动。 |
| 重命名 | 在*节点*列中输入新标签。 |
| 修改支座 | 点击节点 → **节点支座**，或使用*受约束自由度*列。见[支座](#supports)。 |
| 一次修改所有属性 | *操作*列中的铅笔图标打开**编辑节点**：坐标、支座和支座角度，并预览支座符号。 |
| 删除 | 表格中的 ×、节点面板中的**删除**，或选中后按 <kbd>Delete</kbd>。与它相连的单元、荷载和尺寸标注也一并删除。 |

每次修改都可以用 <kbd>Ctrl</kbd>+<kbd>Z</kbd> 撤销。

## 支座 {#supports}

每个节点有三种运动方式，即三个**自由度**（DOF）：沿 x 的 `Dx`、沿 z 的 `Dz`，以及在图形平面内转动的 `Ry`。支座**约束**其中的一部分。

八种支座就是这三个自由度的八种组合。表格按行看：中间一列可以自由转动，右边一列同时约束转动。

| 约束的线位移 | 可自由转动 | 同时约束转动 |
| --- | --- | --- |
| **两个方向**（`Dx` 和 `Dz`） | ![](/screenshots/zh/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **固定铰支座** | ![](/screenshots/zh/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **固定端** |
| **仅竖向**（`Dz`）：可水平滑动 | ![](/screenshots/zh/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **滑动铰支座** | ![](/screenshots/zh/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **滑动固定端** |
| **仅水平**（`Dx`）：可竖向滑动 | ![](/screenshots/zh/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **竖向滑动铰支座** | ![](/screenshots/zh/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **竖向滑动固定端** |
| **无**：两个方向都可滑动 | ![](/screenshots/zh/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **自由**（无支座） | ![](/screenshots/zh/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **仅约束转动** |

滑动铰支座即教材中常说的可动铰支座，滑动固定端即定向支座。EduBeam 为每个受约束的自由度计算一个**支反力**：`Dx` 对应水平力 $R_x$，`Dz` 对应竖向力 $R_z$，`Ry` 对应力矩 $M$。因此固定铰支座有 $R_x$ 和 $R_z$，滑动铰支座只有 $R_z$，滑动固定端有 $R_z$ 和 $M$，固定端三者都有。

### 设置支座 {#setting-a-support}

选择支座符号，或逐个勾选自由度，两者始终同步。它们出现在三个地方：

- 节点面板（点击节点）→ **节点支座**，同时还有**节点局部坐标系角度**，见下图；
- **添加节点**和**编辑节点**对话框；
- *节点*表格的*受约束自由度*列，其中支座符号是一个小菜单，`Dx`、`Dz`、`Ry` 是复选框。

![节点面板中的节点支座：支座符号、自由度复选框和支座角度](/screenshots/zh/nodes-support-picker.webp){.shot-lg}

指向符号即可看到它的名称。

### 滑动铰支座还是滑动固定端？ {#roller-or-slider}

两者都可以沿支承面滑动，区别在于转动：

- **滑动铰支座**是可以滑动的铰：杆端**可以自由转动**，所以该处弯矩为零；
- **滑动固定端**是可以滑动的固定端：杆端**不能转动**，所以支座承受弯矩。

下面是同一根 6 m 长、承受 10 kN/m 均布荷载的梁，只改变了右端支座。在变形图和弯矩图之间切换看看：

::div{.shots}

:::model-figure{caption="固定铰支座与滑动铰支座：右端自由转动，该处 M = 0，两个支座的支反力均为 30 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="固定铰支座与滑动固定端：右端保持水平，该处 M = −45 kNm，滑动固定端的支反力为 37.5 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

第一根是简支梁（跨中 $M_{max} = qL^2/8 = 45\ \text{kNm}$）。在竖向荷载作用下，滑动固定端的作用与固定端完全相同，所以第二根就是一端固定一端简支梁（$R_B = 5qL/8 = 37.5\ \text{kN}$，$M_B = -qL^2/8 = -45\ \text{kNm}$）。杆端保持水平还提高了梁的刚度：最大挠度从 9.617 mm 降到 4 mm。只有沿滑动方向有力作用时，滑动固定端才与固定端有所不同。

### 斜支座 {#inclined-skewed-supports}

斜面上的支座沿转过一定角度的坐标轴约束节点。在节点面板的*节点支座*下、添加节点和编辑节点对话框中，或*节点*表格的 **α** 输入框中设置**节点局部坐标系角度** α，单位为度，范围 −180 到 180。

节点坐标轴转过 α，勾选的自由度沿转动后的坐标轴作用。α 从 x 轴转向 z 轴，在屏幕上是**顺时针**方向（采用 y 轴向上的坐标系时，从 x 轴转向 y 轴，为逆时针方向）。因此，向右下倾斜 30° 的斜面上的滑动铰支座，就是 α = 30° 的滑动铰支座。支座符号随坐标轴一起转动，支反力也沿这组坐标轴给出。

::model-figure{caption="B 处的滑动铰支座转过 α = 30°：34.64 kN 的支反力垂直于斜面，梁承受 N = +17.32 kN 的轴力"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

还是上面那根 6 m 长、承受 10 kN/m 的梁，只是滑动铰支座现在放在 30° 的斜面上。B 处支反力的竖向分量仍为 $qL/2 = 30\ \text{kN}$，所以支反力本身为 $30/\cos 30° = 34.64\ \text{kN}$，其水平分量 $30 \tan 30° = 17.32\ \text{kN}$ 把 B 推向右方。A 处的固定铰支座阻止它移动，因此梁受拉。弯矩不变。

转动过的节点上的[节点荷载](/zh/essentials/loads#nodal-loads)可以按整体坐标轴或节点坐标轴输入；[位移约束](/zh/essentials/loads#prescribed-displacements-support-settlements)则始终沿支座自身的坐标轴作用。

### 稳定性 {#stability}

平面结构至少需要**三个受约束自由度**，而且它们的布置必须能真正把结构固定住。支座不够时，视图中显示蓝色的**需要支座**标记。如果支座数量够了，却固定不住结构（全部平行，或全部交于一点），或者铰使杆件之间可以相对转动，红色消息会指出问题所在，虚线轮廓则显示结构如何运动。每条消息的说明见[疑难解答](/zh/reference/troubleshooting#messages)。

## 节点荷载与沉降 {#nodal-loads-and-settlements}

点击节点 → **添加荷载**，可以施加力或力矩；点击节点 → **施加位移约束**，可以让支座产生给定位移（支座沉降）。两者都在[节点荷载](/zh/essentials/loads#nodal-loads)中说明。

## 尺寸标注 {#dimension-lines}

尺寸标注在图中标出长度。它们不影响计算，但会随项目保存、包含在分享链接中，并出现在[导出的图像](/zh/essentials/import-export#export-an-image)中。

| 目的 | 操作 |
| --- | --- |
| 添加标注 | 在画布上右键 → **添加标注**，然后点击两个端点。靠近节点的点会吸附到节点上。 |
| 标注单元 | 在单元上右键 → **标注单元**。 |
| 编辑或翻转 | 点击标注线 → **编辑**输入其坐标，或 → **翻转标注**把标注文字翻到另一侧。 |
| 移动 | 拖动标注线，或拖动某个端点。位于节点上的端点与节点绑定，随节点移动。 |
