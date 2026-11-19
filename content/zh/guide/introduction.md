---
description: "EduBeam 是什么：一款免费的浏览器端有限元求解器，用于二维梁、刚架和桁架。它能做什么、不能做什么、适合谁、本指南如何编排，以及背后的开源库。"
source: site
---

# 简介

[EduBeam]{.edubeam} 是一款在浏览器中运行的免费结构分析应用，用来计算**梁、刚架和桁架**。画出结构，加上支座和荷载：每改动一处，有限元求解器就重新计算内力图、支反力和挠度。没有*求解*按钮，无需安装，也无需注册。

::div{.actions}
[打开 EduBeam ↗](https://run.edubeam.app/?lang=cn){target="_blank"} [快速入门（10 分钟）](/zh/guide/quick-start)
::

![EduBeam 中的三铰刚架：荷载为橙色，支反力为紫色，弯矩为红色，变形图为灰色](/screenshots/zh/hero.webp)

:span{#your-first-visit}

## 能做什么 {#what-it-does}

::card-grid{cols="2"}
:::card{title="结构" icon="lucide:triangle" to="/zh/essentials/elements"}
x–z 平面内的梁、连续梁、刚架和桁架，由 Timoshenko 梁单元组成。设置端部铰接，杆件就成为桁架杆。
:::
:::card{title="支座" icon="lucide:anchor" to="/zh/essentials/nodes-supports#supports"}
固定铰支座、滑动铰支座、固定端、滑动固定端，或 `Dx`、`Dz`、`Ry` 的任意约束组合，按符号选取。还有斜支座和支座沉降。
:::
:::card{title="荷载" icon="lucide:arrow-down-to-line" to="/zh/essentials/loads"}
作用在节点上或杆件任意位置的力和力偶，均布和梯形分布荷载，温度荷载，以及给定位移。
:::
:::card{title="截面" icon="lucide:shapes" to="/zh/essentials/elements#cross-sections"}
欧洲和美国截面库，或自己画的任意多边形，自动计算 $A$、$I_y$、$I_z$、$I_{yz}$、主轴和回转半径。
:::
:::card{title="结果" icon="lucide:chart-spline" to="/zh/essentials/results"}
**N**、**V**、**M** 图，变形图，支反力，节点位移，单元端力和单元刚度矩阵。
:::
:::card{title="分析" icon="lucide:calculator" to="/zh/elements/analysis"}
线性静力分析，对线性模型给出精确解，无需加密网格。结构几何可变时，EduBeam 会说明原因，并用动画显示它如何运动。
:::
:::card{title="文件" icon="lucide:folder-open" to="/zh/essentials/import-export"}
项目存为 JSON，整个模型存为链接，图形导出为 PNG 或 SVG，结果导出为 CSV。被替换的模型会保留下来，数据不会离开你的设备。
:::
:::card{title="单位" icon="lucide:ruler" to="/zh/essentials/units-settings"}
一键切换国际单位制或美制单位，也可逐个单位设置。z 轴向下，或采用教材中的 y 轴向上。
:::
::

## 暂时不能做什么 {#what-it-does-not-do-yet}

事先了解这些限制，可以少走弯路：

::div{.limits}
- **仅限二维**。不考虑平面外行为，不能分析三维刚架。
- **仅限线性静力分析**。不考虑二阶（P–Δ）效应、屈曲、动力和塑性。
- **只有一个荷载工况**。没有荷载组合和包络图：每个工况各存为一个文件或链接。
- **不计自重**。请把自重作为分布荷载施加。
- **不做设计验算**。EduBeam 给出内力和位移，规范验算由你自己完成。
::

如果你需要的功能还没有，请[提交 issue](https://github.com/janvorisek/edubeam/issues)。

::elementarium-promo{placement="introduction"}
::

## 适合谁用 {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="学生" icon="lucide:graduation-cap" to="/zh/practice"}
手算结果立即得到验证，练习题边做边核对答案。
:::
:::card{title="教师" icon="lucide:presentation" to="/zh/guide/teaching"}
在投影仪上现场演示支座、铰和荷载如何改变内力，支持 18 种语言，还能给每名学生打印一份不同的试卷。
:::
:::card{title="工程师" icon="lucide:hard-hat" to="/zh/elements/analysis"}
打开更大型的桌面软件之前，先快速做一次合理性校核，求解的每一步都有文档说明。
:::
:::card{title="开发者" icon="lucide:code-xml" to="#libraries"}
EduBeam 背后的求解器和绘图功能都是开源库，可以用在你自己的代码里。
:::
::

## 如何查阅本指南 {#how-this-guide-is-organised}

侧边栏把各页分为以下几组。应用中的 **?** 按钮会以你的语言打开本指南中对应的页面。

::card-grid{cols="2"}
:::card{title="入门" icon="lucide:flag" to="/zh/guide/quick-start"}
本页，以及快速入门：10 分钟建好第一根梁。
:::
:::card{title="建模" icon="lucide:pencil-ruler" to="/zh/essentials/user-interface"}
用户界面，节点与支座，单元、材料与截面，荷载，单位与设置。
:::
:::card{title="查看结果" icon="lucide:chart-spline" to="/zh/essentials/results"}
内力图和结果表格，以及如何手算核对。
:::
:::card{title="分享与教学" icon="lucide:share-2" to="/zh/essentials/import-export"}
项目文件、分享链接、图像和 CSV 导出，以及用 EduBeam 教学。
:::
:::card{title="教程" icon="lucide:triangle" to="/zh/tutorials/inclined-beam"}
斜梁、三铰刚架、平面桁架，以及有支座沉降的连续梁，每个都一步步建模并手算核对。
:::
:::card{title="示例" icon="lucide:library" to="/zh/examples/"}
六个一键打开的现成模型，附练习和答案。
:::
:::card{title="理论手册" icon="lucide:sigma" to="/zh/elements/conventions"}
坐标系与符号约定，梁单元，桁架单元，以及 EduBeam 如何求解模型。
:::
:::card{title="帮助" icon="lucide:life-buoy" to="/zh/reference/shortcuts"}
键盘、鼠标与触控，疑难解答，以及常见问题。
:::
::

## 打造自己的工具 {#libraries}

EduBeam 建立在两个开源库之上，本网站提供了它们的文档。可以用它们在脚本中求解结构，为每名学生生成不同的习题，或为幻灯片和讲义绘制插图。

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/zh/solver"}
EduBeam 背后的有限元求解器，用 TypeScript 编写：十几行代码就能建立、求解一根梁并读取结果，在浏览器和 Node 中均可运行。
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/zh/plot"}
Vue 3 组件，把已求解的结构连同荷载、支反力以及 N、V、M 图绘制成 SVG。
:::
::

## 语言 {#languages}

EduBeam 支持 18 种语言，默认使用浏览器的语言。可以在**设置 → 语言与区域**中切换，也可以在这里选择：

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

语言也可以由链接指定：`run.edubeam.app/?lang=cn` 会以中文打开。

## 作者与致谢 {#authors-credits}

[EduBeam]{.edubeam} 由 [Jan Voříšek](https://github.com/janvorisek) 作为独立项目开发。它的前身是 Windows 和 Linux 上的桌面版 EduBeam，由[布拉格捷克理工大学（CTU）土木工程学院](https://www.fsv.cvut.cz/en)力学系的 [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/)、[Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) 和 [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) 开发；桌面版的会话文件至今仍能在 EduBeam 中打开。求解器 [@edubeam/fem](/zh/solver) 由 Bořek Patzák 的第一版发展而来。应用和求解器都是开源的，采用 GPL-3.0 许可证。

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"首席开发者与产品设计师","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"开发者：触控操作、绘图性能、荷载与支座","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"最初的 EduBeam 与第一版有限元求解器","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## 参与贡献 {#contribute}

::card-grid{cols="3"}
:::card{title="报告问题" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
发现哪里看不懂、有错误或不能用？在 GitHub 上提交 issue，开发团队就能看到。
:::
:::card{title="改进翻译" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
应用的界面文字每种语言存为一个文件，欢迎提交 pull request。
:::
:::card{title="推荐给他人" icon="lucide:share-2"}
把 EduBeam 推荐给同学和同事，或把模型链接放进你的讲义。
:::
::
