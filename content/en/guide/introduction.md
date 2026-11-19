---
description: "EduBeam is a free FEM solver for 2D beams, frames and trusses in your browser: what it can and cannot do, who it is for, and how this guide is organised."
source: site
---

# Introduction

[EduBeam]{.edubeam} is a free structural analysis app for **beams, frames and trusses**, running in your browser. Draw a structure, support it and load it: the finite element solver recomputes the diagrams, reactions and deflections with every change you make. There is no *Solve* button, nothing to install and no account to make.

::div{.actions}
[Launch EduBeam ↗](https://run.edubeam.app){target="_blank"} [Quick start, 10 minutes](/guide/quick-start)
::

![A three-hinged frame in EduBeam: loads in orange, reactions in purple, the bending moment in red and the deformed shape in grey](/screenshots/hero.webp)

:span{#your-first-visit}

## What it does

::card-grid{cols="2"}
:::card{title="Structures" icon="lucide:triangle" to="/essentials/elements"}
Beams, continuous beams, frames and trusses in the x–z plane, built from Timoshenko beam elements. An end hinge turns a member into a truss bar.
:::
:::card{title="Supports" icon="lucide:anchor" to="/essentials/nodes-supports#supports"}
Pin, roller, fixed, slider, or any mix of restrained `Dx`, `Dz` and `Ry`, picked by symbol. Supports at an angle, and settlements.
:::
:::card{title="Loads" icon="lucide:arrow-down-to-line" to="/essentials/loads"}
Forces and moments at nodes or anywhere along a member, uniform and trapezoidal line loads, temperature, and prescribed displacements.
:::
:::card{title="Sections" icon="lucide:shapes" to="/essentials/elements#cross-sections"}
European and US libraries, or any polygon you draw, with $A$, $I_y$, $I_z$, $I_{yz}$, principal axes and radii of gyration computed.
:::
:::card{title="Results" icon="lucide:chart-spline" to="/essentials/results"}
**N**, **V** and **M** diagrams, the deformed shape, reactions, nodal displacements, end forces and element stiffness matrices.
:::
:::card{title="Analysis" icon="lucide:calculator" to="/elements/analysis"}
Linear statics, exact for the linear model: there is no mesh to refine. A structure that can't stand is explained, and its motion animated.
:::
:::card{title="Files" icon="lucide:folder-open" to="/essentials/import-export"}
Projects as JSON, whole models as links, drawings as PNG or SVG, results as CSV. Replaced models are kept, and nothing leaves your device.
:::
:::card{title="Units" icon="lucide:ruler" to="/essentials/units-settings"}
SI or US customary in one click, or unit by unit. The z axis down, or the textbook's y up.
:::
::

## What it does not do (yet)

Knowing the limits up front saves time:

::div{.limits}
- **2D only.** No out-of-plane behaviour, no 3D frames.
- **Linear static only.** No second-order (P–Δ) effects, buckling, dynamics or plasticity.
- **One load case.** No combinations or envelopes: save each case as its own file or link.
- **No self-weight.** Apply it as a line load.
- **No design checks.** EduBeam gives internal forces and displacements; code checks are yours.
::

If a missing feature matters to you, [open an issue](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## Who is it for?

::card-grid{cols="2"}
:::card{title="Students" icon="lucide:graduation-cap" to="/practice"}
Instant feedback on hand calculations, and practice problems that check your answers as you go.
:::
:::card{title="Teachers" icon="lucide:presentation" to="/guide/teaching"}
Show how supports, hinges and loads change the forces, live on a projector, in 18 languages, and print a different test for every student.
:::
:::card{title="Engineers" icon="lucide:hard-hat" to="/elements/analysis"}
A quick sanity check before opening a heavier desktop package, with every step of the solution documented.
:::
:::card{title="Developers" icon="lucide:code-xml" to="#libraries"}
The solver and the drawings behind EduBeam, as open-source libraries for your own code.
:::
::

## Find your way around the guide {#how-this-guide-is-organised}

The sidebar groups the pages as below. The **?** buttons in the app open the matching page here, in your language.

::card-grid{cols="2"}
:::card{title="Start here" icon="lucide:flag" to="/guide/quick-start"}
This page, and the Quick start: a first beam in ten minutes.
:::
:::card{title="Build a model" icon="lucide:pencil-ruler" to="/essentials/user-interface"}
The interface, nodes and supports, elements, materials and sections, loads, units and settings.
:::
:::card{title="Read the results" icon="lucide:chart-spline" to="/essentials/results"}
The diagrams and result tables, and how to check them by hand.
:::
:::card{title="Share & teach" icon="lucide:share-2" to="/essentials/import-export"}
Project files, share links, image and CSV export, and teaching with EduBeam.
:::
:::card{title="Tutorials" icon="lucide:triangle" to="/tutorials/inclined-beam"}
An inclined beam, a three-hinged frame, a plane truss and a continuous beam with a settling support, each built step by step and checked by hand.
:::
:::card{title="Examples" icon="lucide:library" to="/examples/"}
Six ready-made models that open in one click, with exercises and answers.
:::
:::card{title="Theory manual" icon="lucide:sigma" to="/elements/conventions"}
Axes and sign conventions, the beam and truss elements, and how EduBeam solves a model.
:::
:::card{title="Help" icon="lucide:life-buoy" to="/reference/shortcuts"}
Keyboard, mouse and touch, troubleshooting, and the FAQ.
:::
::

## Build your own tools {#libraries}

EduBeam is built on two open-source libraries, documented on this site. Use them to solve structures in a script, generate a different exercise for every student, or draw figures for slides and notes.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/solver"}
The finite element solver behind EduBeam, in TypeScript: model, solve and read a beam in a dozen lines, in the browser or in Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/plot"}
Vue 3 components that draw a solved structure as SVG, with its loads, reactions and N, V and M diagrams.
:::
::

## Languages

EduBeam speaks 18 languages and starts in your browser's. Switch in **Settings → Language & Locale**, or pick one here:

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

A link can choose for the reader too: `run.edubeam.app/?lang=cs` opens in Czech.

## Authors & credits

[EduBeam]{.edubeam} is developed by [Jan Voříšek](https://github.com/janvorisek) as an independent project. It follows in the footsteps of the desktop EduBeam for Windows and Linux, created by [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) and [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) at the Department of Mechanics, [Faculty of Civil Engineering, CTU in Prague](https://www.fsv.cvut.cz/en), and still opens its session files. Its solver, [@edubeam/fem](/solver), grew from Bořek Patzák's first version. The app and the solver are both open source, under the GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Lead developer & product designer","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Developer: touch control, drawing performance, loads and supports","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"Original EduBeam and the first FEM solver","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Contribute

::card-grid{cols="3"}
:::card{title="Report a problem" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Something confusing, wrong or broken? An issue on GitHub reaches the team.
:::
:::card{title="Improve a translation" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
The app's texts live in one file per language; a pull request is welcome.
:::
:::card{title="Pass it on" icon="lucide:share-2"}
Share EduBeam with classmates and colleagues, or put a model link in your notes.
:::
::
