---
description: "用 EduBeam 教学：投影仪上的实时模型、讲义中的分享链接、学生可自行核对的作业、自动生成的练习题，以及附参考答案、可打印的试卷。"
source: site
---

# 用 EduBeam 教学

[EduBeam]{.edubeam} 最初就是为课堂而做的，至今在课堂上也最能派上用场：投影仪上的模型随你的修改即时变化，同一个模型还能通过一个链接出现在每名学生的笔记本电脑上。本页汇总了教师最常用的功能，从第一次课一直到考试。

::card-grid{cols="2"}
:::card{title="课堂上" icon="lucide:presentation" to="#in-the-lecture"}
让最后一排也看得清模型，并现场修改。
:::
:::card{title="第一次上机课" icon="lucide:graduation-cap" to="#getting-students-started"}
10 分钟，从空白屏幕到一根手算核对过的梁。
:::
:::card{title="讲义和作业中" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
PDF 或幻灯片中的一个链接即可打开整个模型，多年有效。
:::
:::card{title="可自行核对的作业" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
先手算，再用模型核对。
:::
:::card{title="练习题与试卷" icon="lucide:file-check" to="#practice-and-test-papers"}
自动生成、即时核对的题目，以及附参考答案、可打印的试卷。
:::
:::card{title="用代码生成习题单和幻灯片" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
用 @edubeam/plot 编写自己的习题生成器和幻灯片插图。
:::
::

## 课堂上 {#in-the-lecture}

- **让最后一排也看得清**。在**设置 → 视图设置**中，把**字号**调到 18 或 20 px（20 px 为最大值），把**支座大小**调到 130–150 %。如果内力图仍显得太小，再调大**结果缩放**。
- **一次只展示一个量**。在视图右上角的显示选项中，只保留正在讲的那个量，其余全部取消勾选，然后再逐一加上。
- **现场修改模型**。拖动支座、勾选 `Ry`、添加铰。学生立刻看到因果关系，<kbd>Ctrl</kbd>+<kbd>Z</kbd> 可以随时退回。
- **让求解器解释机构**。多释放一个铰，EduBeam 就会画出结构可能的运动，用动画演示，并圈出造成问题的铰。这正是讲几何组成分析的好时机。这两项开关都在**设置 → 视图设置 → 模型检查**中。
- **使用学生的语言和坐标轴**。EduBeam 支持 18 种语言；单位可以在国际单位制与美制之间切换，坐标轴可以在 z 向下与 y 向上之间切换，与你的课程讲义保持一致（见[单位与设置](/zh/essentials/units-settings)）。

![把机构显示出来：B 和 C 处的铰使刚架可以侧移](/screenshots/zh/ui-mechanism.webp)

## 第一次上机课 {#getting-students-started}

学生第一次打开 EduBeam 时，应用会询问他们想如何开始，以及使用哪种单位和坐标轴。请事先告诉学生课程采用的单位和坐标轴。导览（**带我看看**）、引导任务**绘制第一根梁**和**示例**之后仍可在 **☰** 菜单中找到。

第一次上机课可以这样安排：先说“打开 run.edubeam.app，选择*绘制第一根梁*”，再做[快速入门](/zh/guide/quick-start)，大约 10 分钟，最后手算核对。

### 机房电脑与离线使用 {#offline-and-lab-computers}

EduBeam 是渐进式网页应用（PWA）：浏览器加载过一次之后，断网也能继续使用，浏览器还可能提示像桌面应用一样安装它。模型和设置按浏览器配置文件分别保存，因此在共用的机房电脑上，学生应把工作保存为文件或链接带走。详见[浏览器中保存的内容](/zh/essentials/units-settings#what-is-stored-in-your-browser)。

## 讲义和作业中 {#in-lecture-notes-and-assignments}

分享链接包含整个模型，所以凡是能放链接的地方都能用：PDF、幻灯片、教学平台页面、电子邮件。

::div{.steps}

### 建好模型 {#share-build}

按学生第一眼应当看到的样子设置好：荷载、标签，以及要打开的内力图。

### 复制链接 {#share-copy}

点击应用栏中的**分享模型**。如果希望链接打开时显示你的内力图、荷载和标签，就打开**显示我看到的内容**，然后点击**复制**。

### 粘贴到讲义中 {#share-paste}

打开链接的学生会得到一份自己的副本，可以随意探索。他们的任何修改都不会影响你或其他人。链接在 EduBeam 各个版本之间始终有效，讲义可以年复一年地使用。

::

为课程材料复制链接时，请让**更短的链接**保持关闭：还没有更新到支持这个选项的 EduBeam，在更新之前打不开短链接。

| 链接 | 打开的内容 |
| --- | --- |
| `run.edubeam.app/?model=…` | 模型，可直接编辑 |
| `run.edubeam.app/?viewer=1&model=…` | [查看器模式](/zh/essentials/import-export#embed-a-read-only-viewer)下的模型，用于 `<iframe>` |
| `run.edubeam.app/?panel=examples` | [示例](/zh/examples/)库 |
| `run.edubeam.app/?lang=cn` | 中文界面的应用，也可以换成任何[其他语言](/zh/essentials/import-export#url-parameters) |

::callout{type="warning" title="打开链接会替换学生自己的模型"}
打开链接（在某些浏览器中，打开嵌有查看器的网页也是如此）会把学生原来的模型移到 **☰ → 最近的结构**中，可以从那里恢复。尽管如此，还是请学生在打开课堂链接之前，先用 **☰ → 保存项目**保存重要的工作。
::

## 可自行核对的作业 {#assignments-students-can-check-themselves}

EduBeam 能对学生的手算结果给出即时反馈，又不会替他们完成解题过程。

- **先计算，再核对**。要求学生手算支反力、内力和一个位移，然后建模对比。公式见[手算校核结果](/zh/guide/verification)，[快速入门](/zh/guide/quick-start#_8-check-by-hand)演示了核对的完整流程。
- **追问结果为何不同**。剪切变形、漏掉的铰、荷载用了局部坐标而不是整体坐标：每一种都能解释或大或小的偏差，找出原因比结果吻合更有收获。
- **作业连同模型一起交**。要求学生在计算书旁附上分享链接或 `project.json`。你打开它就能准确看到他们建的是什么模型。
- **报告也能做得像样**。学生可以把图形导出为 **SVG**（在 Word 和 LaTeX 中保持清晰），把结果导出为 **CSV**。见[导出图像](/zh/essentials/import-export#export-an-image)。

## 现成的练习 {#ready-made-exercises}

- **[示例](/zh/examples/)**：六个一键打开的模型，每个都附有问题、观察要点和答案。
- **[练习题](/zh/practice)**：自动生成的梁、刚架和桁架题目，能核对学生的答案；[试卷生成器](/zh/exam)还能把它们打印成试卷。见[下文](#practice-and-test-papers)。
- **[教程](/zh/tutorials/inclined-beam)**：斜梁、三铰刚架、平面桁架和有支座沉降的连续梁，每个都一步步建模并手算核对，可用作 15–20 分钟的上机讲义。
- **[手算校核结果](/zh/guide/verification)**：从悬臂梁到支座沉降的闭合解算例，可布置为快速核对题。

## 练习题与试卷 {#practice-and-test-papers}

本网站有两个页面可以为你出结构力学题，无需安装，也无需编程：

- **[结构力学练习题](/zh/practice)**：学生每次要题，页面就出一道新题。学生在纸上算出支反力，以及最大弯矩或某根杆的轴力，填入答案，页面逐项与精确解核对：误差在 1 % 以内即算正确，数值对但方向错会被指出。提示告诉学生从哪里入手，做完后会显示内力图。每道题都有一个题目编号，例如 `H2048`，始终对应同一道题：把编号写进作业，所有人就按同一组数据核对。
- **[试卷生成器](/zh/exam)**：用来打印试卷。选择结构类型，每份试卷最多 6 道题，最多 40 套，每名学生拿到不同的一套。每套试卷的结构类型相同、顺序相同，因此难度相当。它会加上姓名栏、答题空白和参考答案，用**打印或另存为 PDF** 打印出来。**下载 .zip** 会把每张插图导出为 SVG 文件（供 LaTeX 和 Word 使用），并把答案导出为 CSV 表格，便于批改。

两者提供同样的八种结构：六种静定结构（简支梁、悬臂梁、外伸梁、多跨静定梁、三铰刚架和华伦桁架）和两种超静定结构（两跨连续梁和门式刚架）。

试卷生成器把所有设置（包括决定题目数据的**试卷编号**）都保存在页面地址里。把地址加入书签，明年就能得到同样的试卷和参考答案。试卷上默认不印题目编号：练习题页面会显示解答，所以题目编号适合放在作业里，供学生事后自行核对。

## 用代码生成习题单、试卷和幻灯片 {#exercise-sheets-tests-and-slides-from-code}

本网站上的图都由 [@edubeam/plot](/zh/plot) 绘制。这是一个 Vue 组件库，能绘制由 [@edubeam/fem](/zh/solver)（EduBeam 背后的求解器）求解的任何平面梁、刚架或桁架。只要会写一点 JavaScript，几行代码就能变成课程材料：

- **自己的题型**。如果试卷生成器里的结构不是你讲的那些，就自己写：随机种子（seed）决定结构及其数据，同一个种子总是生成同一道题，参考答案也由同一个种子生成。
- **逐步展开的幻灯片**。先显示结构，再显示支座和荷载，然后是支反力，最后是弯矩图，一步一步展示，各步之间图形不会移动。
- **讲义和课程网页的插图**。清晰的 SVG，跟随页面的浅色或深色主题；与嵌入的应用不同，它不会改动学生自己的模型。

试试看。每点击一次**换一道题**，就会生成一道新题及其参考答案：

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="习题与测验" icon="lucide:file-check" to="/zh/plot/exercises"}
由随机种子生成习题单及其参考答案。
:::
:::card{title="幻灯片与讲义" icon="lucide:presentation" to="/zh/plot/slides"}
逐层展开的插图，用于幻灯片和讲义。
:::
::
