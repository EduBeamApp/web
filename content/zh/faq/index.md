---
description: "关于 EduBeam 的简短回答：费用、离线使用、隐私、精度、结果如何计算、如何引用、练习题、分享以及代码。"
source: site
---

# 常见问题

下面是简短的回答，每条都附有详细介绍该主题的页面链接。没找到你的问题？请看[疑难解答](/zh/reference/troubleshooting)，或[在 GitHub 上提问](https://github.com/janvorisek/edubeam/issues)。

## 一般问题 {#general}

### EduBeam 是什么？ {#what-is-edubeam}

一款免费、开源的应用，用于二维梁、刚架和桁架的线性静力分析，面向希望获得即时反馈的学生、教师和工程师。它在浏览器中运行。[简介](/zh/guide/introduction)列出了它能做什么、不能做什么。

### 真的免费吗？需要注册账号吗？ {#is-it-really-free-do-i-need-an-account}

是的，免费；不需要账号。打开 [run.edubeam.app](https://run.edubeam.app/?lang=cn){target="_blank"} 即可开始建模：无需安装，也没有使用限制。源代码在 [GitHub](https://github.com/janvorisek/edubeam) 上，采用 GPL-3.0 许可证。

### 支持哪些浏览器和设备？ {#which-browsers-and-devices-work}

任何较新版本的 Chrome、Edge、Firefox 或 Safari，电脑、平板和手机均可。在触摸屏上，轻点即可选中，拖动节点可移动它，在其他位置拖动可平移，双指捏合可缩放，长按可打开画布菜单。不过用鼠标和键盘建模仍然更快。见[键盘、鼠标与触控](/zh/reference/shortcuts#touch)。

### 我的模型丢了，还能找回来吗？ {#i-lost-my-model-can-i-get-it-back}

多半可以。模型被清空，或被链接、文件、示例替换时，EduBeam 会把它保留在 **☰ → 最近的结构**中（最近 10 个），<kbd>Ctrl</kbd>+<kbd>Z</kbd> 也能撤销这次替换。两者都只存在于当前浏览器中，所以在另一台电脑或另一个浏览器配置文件中建的模型不在这里。见[最近的结构](/zh/essentials/import-export#recent-structures)。

### 可以离线使用吗？ {#can-i-use-it-offline}

可以。EduBeam 是渐进式网页应用（PWA）：浏览器加载过一次之后，断网也能继续使用，浏览器还可能提示安装它。有新版本时，会弹出对话框询问是否更新。

### 我的数据存储在哪里？ {#where-is-my-data-stored}

在你的浏览器中。没有账号，也没有云存储：应用把模型和设置保存在当前浏览器中，分享链接则把模型本身装在链接里。见[浏览器中保存的内容](/zh/essentials/units-settings#what-is-stored-in-your-browser)。

不过，run.edubeam.app 上的应用会收集使用统计（Google Analytics）和错误报告（Sentry）。错误报告以及 Sentry 对部分会话的录制，可能包含当时屏幕上的内容，其中也包括你的模型。

### 在哪里可以练习结构力学题？ {#practice}

在[结构力学练习题](/zh/practice)页面。它每次给出一根梁、一个刚架或一个桁架，数据各不相同：在纸上算出支反力，以及最大弯矩或杆件轴力，填入答案，每个数值都会立即核对。[示例](/zh/examples/)也附有问题和答案。教师可以用[试卷生成器](/zh/exam)给每名学生打印一份不同的试卷，并附参考答案；见[练习题与试卷](/zh/guide/teaching#practice-and-test-papers)。

### 如何引用 EduBeam？ {#cite}

按软件引用，注明所用的版本和访问日期。版本号在 **☰** 菜单底部。按 GB/T 7714 著录，例如：

> VOŘÍŠEK J, et al. EduBeam: version 1.3.4\[CP/OL\]. \[2026-11-18\]. https://edubeam.app.

要指明某个具体模型，请附上它的[分享链接](/zh/essentials/import-export#share-a-link)：每位读者打开的都是同一个模型。

## 建模 {#modelling}

### 如何设置固定端、固定铰支座或滑动铰支座？ {#how-do-i-make-a-fixed-pinned-roller-support}

点击节点，选择**节点支座**，再选择符号：固定铰支座、滑动铰支座、固定端、滑动固定端等。也可以在**节点**选项卡中勾选受约束的自由度：`Dx` + `Dz` + `Ry` 为固定端，`Dx` + `Dz` 为固定铰支座，只勾 `Dz` 为滑动铰支座。[节点与支座](/zh/essentials/nodes-supports#supports)列出了所有类型。

### 如何建立桁架？ {#how-do-i-make-a-truss}

把各杆画成普通单元，并释放每根杆的两端：在**单元**选项卡中勾选两个**端部铰接**；或者在用鼠标画杆之前，在横幅中勾选**起点铰接**和**终点铰接**。荷载施加在节点上。[教程：平面桁架](/zh/tutorials/truss)一步步建立了一个桁架。

### 如何在刚架中设置铰？ {#how-do-i-put-a-hinge-in-a-frame}

释放应当自由转动的那个单元端部的弯矩：在**单元**选项卡中勾选它的端部铰接。铰属于某个单元的一端，因此在多个单元交汇的节点处，只释放其中一个单元时，其余单元之间仍是刚性连接。见[端部铰接](/zh/essentials/elements#end-hinges)。

### 如何在梁的中间加支座或集中荷载？ {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

加支座：用鼠标在梁上添加一个节点（带光标图标的**添加节点**按钮），并选择**连接到结构**。梁在该节点处被拆分为两段，然后就可以给这个节点设置支座。集中荷载则不需要节点：给单元添加一个**集中荷载**，并设置它距起始节点的位置。见[在已有单元上放置节点](/zh/essentials/nodes-supports#placing-a-node-on-an-existing-element)和[集中荷载](/zh/essentials/loads#concentrated-load)。

### 可以施加自重吗？ {#can-i-apply-self-weight}

不能自动施加：静力分析不使用材料的密度。请把自重作为均布荷载 $f_z = \rho g A$ 施加，例如 IPE 200 为 $7850 \cdot 9.81 \cdot 28.48 \cdot 10^{-4} = 219$ N/m，即 0.22 kN/m。

### 可以设置斜支座吗？ {#can-i-model-inclined-supports}

可以。给节点设置**节点局部坐标系角度**，它的支座就沿旋转后的坐标轴起作用。见[斜支座](/zh/essentials/nodes-supports#inclined-skewed-supports)。

### 可以使用美制单位吗？ {#can-i-work-in-us-customary-units}

可以。点击视图右下角的单位标记，会打开**设置 → 语言与区域**；把**单位制**设为**美制（英制）**，即可使用英尺和 kip，也可以逐个选择单位。模型始终以国际单位制存储，因此切换单位只改变显示，绝不会改变模型。见[单位与设置](/zh/essentials/units-settings)。

### 有荷载工况或荷载组合吗？ {#are-there-load-cases-or-combinations}

没有，一个模型只有一个荷载工况。请把每个工况分别保存为文件或链接，再自己组合结果。桌面版 EduBeam 中含多个荷载工况的会话，打开时只载入第一个，并用一条消息列出未载入的工况。

### 为什么我的荷载指向上方？ {#why-do-my-loads-point-up}

多半是因为输入了负值。在 EduBeam 中，整体 z 轴**向下**，因此正的 `fz` 或 `Fz` 是向下的重力荷载：向下 12 kN/m 就是 `fz = 12`。见[坐标系与符号约定](/zh/elements/conventions#loads)。如果你的课程采用竖直向上的坐标轴，请在**设置 → 语言与区域 → 坐标系**中切换为 **x 向右，y 向上**：输入和结果都会随之按该坐标轴处理。

## 结果 {#results}

### 为什么没有“求解”按钮？ {#why-is-there-no-solve-button}

因为每次修改后模型都会重新求解。如果没有显示结果，说明模型暂时还不能求解，画布上的消息会说明原因。[疑难解答](/zh/reference/troubleshooting#no-results-are-drawn)列出了需要检查的内容。

### 为什么我的挠度与公式略有差异？ {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam 使用 Timoshenko 梁单元，因此挠度包含了教材公式通常忽略的剪切变形。对细长梁，差异约为 1 %，[快速入门](/zh/guide/quick-start#_8-check-by-hand)中手算了这一部分。在超静定结构中，抗剪刚度还会使内力略有变化。详见[手算校核结果](/zh/guide/verification)。

### 结果有多精确？需要更多单元吗？ {#how-accurate-are-the-results-do-i-need-more-elements}

对线性静力分析，梁单元在 EduBeam 提供的每种荷载下都是精确的，因此每根杆件用一个单元就够了，没有需要加密的网格。只有在需要设置支座、铰、变截面、节点荷载，或要读取某处位移时，才需要加节点。见[精度与准确性](/zh/essentials/results#precision-and-accuracy)。

### EduBeam 如何计算结果？ {#how-does-edubeam-compute-the-results}

在你的浏览器中，用有限元法中的矩阵位移法（直接刚度法）计算，也就是结构力学课程讲授的方法。[EduBeam 如何求解模型](/zh/elements/analysis)用一个可以手算重复的小例子演示了每一步，求解器本身以 [@edubeam/fem](/zh/solver) 的形式开源。

### 能看到刚度矩阵吗？ {#can-i-see-the-stiffness-matrices}

能。在**单元**选项卡中，单元所在行的矩阵按钮会打开它的 6 × 6 刚度矩阵，采用整体坐标轴和国际单位（N、m）。在视图中点击单元，也可以选择**刚度矩阵**。[梁单元](/zh/elements/beam#global-stiffness-matrix)页面给出了它的推导。

### 支反力列在哪里？ {#where-are-the-reactions-listed}

在视图中，以带数值的箭头显示，即显示选项中的**支反力**，默认开启。**结果 → 导出 CSV** 导出的文件和**复制**到剪贴板的内容中也有支反力。**结果**选项卡列出节点位移和单元端力。见[结果与内力图](/zh/essentials/results)。

## 文件与分享 {#files-sharing}

### 如何分享模型？ {#how-do-i-share-a-model}

点击**分享模型**，再点击**复制**。链接包含整个模型，打开它的人会得到一份可以编辑的副本：不支持实时协作。打开**显示我看到的内容**，链接打开时就会显示你的内力图和标签。见[分享链接](/zh/essentials/import-export#share-a-link)；用于教学，请看[用 EduBeam 教学](/zh/guide/teaching#in-lecture-notes-and-assignments)。

### 可以把模型嵌入我的网站或幻灯片吗？ {#can-i-embed-a-model-on-my-website-or-in-slides}

可以。在分享链接后加上 `&viewer=1`，放进 `<iframe>` 即可：见[嵌入查看器](/zh/essentials/import-export#embed-a-read-only-viewer)。网页、幻灯片或印刷讲义如果只需要静态插图，可以导出 SVG，或用 [@edubeam/plot](/zh/plot) 在代码中绘制。

### 可以导出图像或表格吗？ {#can-i-export-images-or-tables}

可以。**☰ → 导出图像**（<kbd>Ctrl</kbd>+<kbd>P</kbd>）按你选择的尺寸或比例，把图形保存为 PNG 或 SVG。**结果 → 导出 CSV** 保存两个结果表格，**复制**则把它们放到剪贴板上，供电子表格使用。见[导出图像](/zh/essentials/import-export#export-an-image)。

### 能打开桌面版 EduBeam 的文件吗？ {#can-i-open-files-from-the-desktop-edubeam}

能。桌面版 EduBeam 2.x 至 3.5 保存的会话（`.xml`）可以用 **☰ → 打开项目**打开，也可以直接拖到应用上，与 `project.json` 一样。其中的数值按 kN、kPa 和 m 读取。见[打开项目](/zh/essentials/import-export#open-a-project)。

### 可以用程序生成模型吗？ {#can-i-generate-models-programmatically}

可以，有两种方式：

- **写文件**。`project.json` 是采用国际单位制的纯 JSON，任何语言的脚本都能生成，EduBeam 可以用**打开项目**或拖放打开它。见[项目文件格式](/zh/essentials/import-export#project-file-format)。
- **在代码中求解**。[@edubeam/fem](/zh/solver) 是 EduBeam 背后的有限元求解器，以 JavaScript 和 TypeScript 库的形式提供。[@edubeam/plot](/zh/plot) 再把结果绘制出来，例如[习题与测验](/zh/plot/exercises)中生成的习题单。

用国际单位制写出[快速入门](/zh/guide/quick-start)中的梁：

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // 固定铰支座
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // 滑动铰支座
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m，向下

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 跨中 54000 N·m
beam.computeLocalDefl(lc, 2).w[1] // 跨中 0.0502 m
```

## 技术支持 {#support}

### 如何报告 bug 或提出功能建议？ {#how-do-i-report-a-bug-or-request-a-feature}

在 [GitHub](https://github.com/janvorisek/edubeam/issues) 上提交 issue，并附上能够复现问题的分享链接或项目文件。不便公开的问题，请发邮件至 [support@edubeam.app](mailto:support@edubeam.app)。
