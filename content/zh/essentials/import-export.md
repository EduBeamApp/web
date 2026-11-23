---
description: "保存和打开 EduBeam 项目，打开桌面版 EduBeam 的会话文件，用链接分享模型，嵌入实时查看器，使用 URL 参数，导出图像和结果表格。一切都在浏览器中完成。"
source: site
---

# 文件、链接与导出

:span{#导入、导出与分享}

可以把模型保存为文件、以链接发送、嵌入网页，或导出为图片和表格。[EduBeam]{.edubeam} 中的一切都在你的浏览器中完成，不会上传任何内容：分享链接本身就包含了整个模型。

::card-grid{cols="3"}
:::card{title="项目文件" icon="lucide:file-json" to="#save-a-project"}
`project.json`，用于保存、提交作业或以后再打开。
:::
:::card{title="分享链接" icon="lucide:link" to="#share-a-link"}
整个模型放在一个 URL 中，可用于讲义、幻灯片和消息。
:::
:::card{title="图像或表格" icon="lucide:image" to="#export-an-image"}
PNG 或 SVG 用于报告，CSV 用于电子表格。
:::
::

## 保存项目 {#save-a-project}

**☰ → 保存项目**或 <kbd>Ctrl</kbd>+<kbd>S</kbd>（在 Mac 上为 <kbd>⌘</kbd>+<kbd>S</kbd>，本页所有快捷键都是如此）下载 `project.json`。文件中包含节点、单元、材料、截面（含绘制的截面形状）、荷载、尺寸标注，以及写入该文件的应用版本。文件可以随意重命名。

## 打开项目 {#open-a-project}

**☰ → 打开项目**或 <kbd>Ctrl</kbd>+<kbd>O</kbd>，然后选择文件；也可以**把文件拖放到应用窗口的任意位置**。EduBeam 可以打开：

- EduBeam 各个版本保存的 `project.json` 文件；
- **桌面版 EduBeam** 2.x 至 3.5 保存的 `.xml` 会话文件。这些文件中的数值不带单位，所以按其使用手册采用的单位 kN、kPa 和 m 读取。EduBeam 一次只打开一个荷载工况：会话中有多个工况时，打开第一个，并列出未打开的工况名称。

打开文件会替换当前模型，包括其中的材料和截面。原来的模型不会丢失：按 <kbd>Ctrl</kbd>+<kbd>Z</kbd> 可以恢复，它也保留在[最近的结构](#recent-structures)中。EduBeam 无法读取的文件会被拒绝并显示消息，你的模型保持不变。

## 分享链接 {#share-a-link}

应用栏或 ☰ 菜单中的**分享模型**打开*通过 URL 分享模型*对话框：

![通过 URL 分享模型对话框](/screenshots/zh/c1-share.webp){.shot-lg}

- 点**复制**，或在输入框内任意位置点击，即可复制链接。
- **打开链接**在新标签页中打开链接，让你看到接收者将看到的内容。
- **通过系统分享对话框**把链接交给设备的系统分享面板（需浏览器支持）。
- **更短的链接**（默认开启）用大约一半的字符写入同一个模型。早于 1.3.2 版（2026 年 11 月）的 EduBeam 在更新之前无法读取这种链接，所以如果链接必须立即在任何地方都能打开，请把它关闭。
- **显示我看到的内容**（默认关闭）让链接打开时显示你当前开启的内力图、荷载和标签，而不是接收者自己的显示选项。

链接的形式为 `https://run.edubeam.app/?model=…`，其中编码了整个模型。打开链接的人得到一份自己的副本，可以随意编辑；修改**不会**同步回来，所以模型改动后请发送新的链接。很大的模型会生成很长的链接，这时请改为分享项目文件。

对方打开链接时，他自己原来的模型会移入*最近的结构*，并有消息告诉他到哪里去找。链接永不过期：去年讲义中的链接，今天打开仍是同一个模型。

## 嵌入查看器 {#embed-a-read-only-viewer}

在分享链接后加上 `&viewer=1`，模型就以**查看器模式**打开：应用栏、底部栏、撤销和重做、网格和单位标记以及十字准线都被隐藏，只保留图形、适配和居中按钮以及显示选项。欢迎对话框和版本更新说明也不会打开。把这个 URL 放进 `<iframe>`，就能在讲义、课程网页或幻灯片中嵌入一个可以缩放的实时模型：

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![查看器模式下的三铰刚架](/screenshots/zh/viewer-mode.webp){.shot-lg}

查看器模式用于查看，但并未锁定：访问者仍然可以拖动节点、切换内力图。单独打开时，查看器链接和普通链接一样会替换访问者自己的模型，原模型保存在*最近的结构*中。嵌入其他网站的页面时，目前大多数浏览器会给框架分配独立的存储，访问者的模型不受影响，但并非所有浏览器都如此。

如果图形根本不需要应用，例如网页、幻灯片或习题单中的静态内力图，可以用[绘图库 @edubeam/plot](/zh/plot) 通过代码绘制结构及其内力图。本网站上的实时图形就是用它画的。

## URL 参数 {#url-parameters}

| 参数 | 作用 |
| --- | --- |
| `model=<data>` | 加载编码的模型，并缩放到适配屏幕。由**分享模型**写入。 |
| `viewer=1` | [查看器模式](#embed-a-read-only-viewer)。 |
| `show=<letters>` | 打开时只开启这些图层，每层一个字母：`N` 轴力、`V` 剪力、`M` 弯矩、`U` 变形图、`R` 支反力、`L` 荷载、`S` 支座、`n` 节点标签、`e` 单元标签。`show=MRLS` 显示弯矩、支反力、荷载和支座。由**显示我看到的内容**写入。 |
| `lang=<code>` | 切换界面语言：`en`、`cs`、`sk`、`de`、`fr`、`es`、`pt`、`pl`、`hu`、`ro`、`el`、`cn`（中文）、`th`、`uk`、`ru`、`tr`、`hi`、`vi`、`it`、`id`、`ja`、`ko`。 |
| `panel=examples` | 直接打开示例库。 |

多个参数用 `&` 连接，例如 `?lang=cn&viewer=1&model=…`。EduBeam 读取参数后，会把它们从地址栏中移除。`lang` 和 `show` 会保存为访问者的设置，就像访问者在应用中自己选择的一样。

## 导出图像 {#export-an-image}

**☰ → 导出图像**或 <kbd>Ctrl</kbd>+<kbd>P</kbd> 打开图像导出。图形会按你选择的尺寸重新排版，所以线条和标注都保持实际粗细。

![导出图像：选择图层、取景范围和尺寸，然后下载或复制](/screenshots/zh/export-image.webp)

::div{.steps}

### 选择图层 {#choose-the-layers}

顶部的标记选择要绘制的内容：变形图、N、V、M 和支反力，然后是支座、荷载、节点标签和单元标签。初始状态与视图的显示选项相同，在这里修改不会影响视图。

### 确定取景范围 {#frame-the-drawing}

选择宽高比（16:9、4:3、3:2 或 1:1）、**全部适配**，或点**窗口…**，在图形上拖出一个矩形。也可以拖动预览的边缘。

### 设置尺寸 {#set-the-size}

输入以像素计的宽度和高度，或者输入 1 : 50 这样的**比例**，在纸上按比例出图（按 96 DPI 计）。**内力图高度**设置结果内力图的大小，**透明背景**去掉白色背景。如果内力图或标注放不下，对话框会提示，并提供缩小内力图或放大画布的选项。

### 保存 {#save-it}

**下载 PNG**、**下载 SVG**，或在浏览器允许时**复制到剪贴板**。文件按尺寸命名，例如 `edubeam-512x512.svg`。在高分辨率屏幕上，PNG 的像素数会按屏幕像素密度成比例地多于你设置的宽度和高度，以便与应用中一样清晰；实际像素尺寸显示在按钮旁边。

::

SVG 在任何尺寸下都清晰，可以用于 Word、Inkscape 以及 Overleaf 上的 LaTeX，是报告和毕业论文的最佳选择。同样的尺寸总是以同样的方式框定结构，所以先后导出的 N、V、M 图可以并排对齐。

要用代码生成这样的图，例如给习题单上的每道题各画一张，@edubeam/plot 可以写出[独立的 SVG 文件](/zh/plot/functions#a-standalone-svg-file)，在同样的程序中打开。

## 导出结果 {#export-the-results}

**结果**选项卡中的**导出 CSV** 下载包括支反力在内的两个结果表格，**复制**把它们放到剪贴板上，供电子表格使用。见[导出 CSV 与复制](/zh/essentials/results#export-csv-and-copy)。

## 最近的结构 {#recent-structures}

**☰ → 最近的结构**保留最近 10 个被清空，或被链接、文件、示例、“第一根梁”任务或另一次恢复所替换的结构。每一项都显示缩略图、替换它的来源，以及节点和单元的数量。**恢复**找回其中一个：你当时的模型随之进入列表，按 <kbd>Ctrl</kbd>+<kbd>Z</kbd> 可以撤销这次恢复。**移除**删除一项。

![最近的结构](/screenshots/zh/recent.webp){.shot-lg}

该列表只保存在当前浏览器中。

## 示例 {#examples}

**☰ → 示例**打开现成教学模型的示例库。打开其中一个会替换你的模型，按 <kbd>Ctrl</kbd>+<kbd>Z</kbd> 可以找回原来的模型。本指南的[示例](/zh/examples/)页面也有这些模型，并附有练习。

![示例库](/screenshots/zh/examples.webp){.shot-lg}

## 自动保存 {#automatic-persistence}

模型和设置在每次修改后都保存到浏览器的本地存储中，再次访问时自动恢复，即使关闭过浏览器也是如此。这只是为了方便，不能当作备份：它只属于某台设备上的一个浏览器配置文件，隐私窗口不会保留它，清除网站数据也会将其删除。重要的工作请保存为项目文件。保存的全部内容见[浏览器中保存的内容](/zh/essentials/units-settings#what-is-stored-in-your-browser)。

## 项目文件格式 {#project-file-format}

`project.json` 是可读的纯 JSON 文件。下面是[快速入门](/zh/guide/quick-start)中的梁，使用库中的钢材和 IPE 200：

```json [project.json]
{
  "edubeam": true,
  "version": "1.3.4",
  "domain": {
    "materials": [
      {
        "label": "Steel (S235)",
        "d": 7850,
        "e": 210000000000,
        "g": 81000000000,
        "alpha": 0.000012
      }
    ],
    "crossSections": [
      {
        "label": "IPE 200 (approx)",
        "a": 0.002848,
        "iy": 0.00001943,
        "h": 0.2,
        "k": 0.3932584269662922
      }
    ],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [
      {
        "label": "1",
        "nodes": ["1", "2"],
        "mat": "Steel (S235)",
        "cs": "IPE 200 (approx)",
        "hinges": [false, false]
      }
    ],
    "loadCases": [
      {
        "label": "DefaultLC",
        "nodalLoads": [],
        "elementLoads": [
          { "type": "udl", "target": "1", "lcs": true, "values": [0, 12000] }
        ],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

无论应用显示什么单位，文件中的所有数值都采用**国际单位制**（m、N、Pa、rad）。坐标为 `[x, y, z]`，其中 $y = 0$，$z$ 向下。支座和荷载分量使用自由度编号 `0 = Dx`、`2 = Dz`、`4 = Ry`。

| 单元荷载 `type` | 数值 |
| --- | --- |
| `udl` | `values: [fx, fz]`，单位 N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`、`endValues: [f2x, f2z]`，单位 N/m |
| `concentrated` | `values: [Fx, Fz, My, a]`，单位为 N、N·m，a 为距起始节点的距离（m） |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]`，单位 K；温差为 ΔTb − ΔTt |

`lcs: true` 或不写 `lcs`，单元荷载按单元局部坐标轴作用；`false` 则按整体坐标轴作用。其他条目：

- **节点荷载**：`{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`；荷载按转动过的支座坐标轴作用时，再加上 `"lcs": true`。
- **位移约束**：`{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`；省略的分量取 0。
- 应用写入的文件还带有 `date`、`commit`、转动支座的坐标轴（节点上的 `lcs`）以及绘制的截面形状 `shape`。

由于格式简单，你可以用脚本或电子表格生成模型，再用**打开项目**打开。要完全用代码建立和求解模型，请使用应用背后的求解器，即[求解器库 @edubeam/fem](/zh/solver)。
