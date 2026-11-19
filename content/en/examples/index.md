---
description: "Six solved beams, frames and trusses that open in EduBeam with one click, each with exercises, what to look for and answers to check your hand calculation."
source: site
---

# Examples

Each tile below is a live, solved model. Click one to open it in [EduBeam]{.edubeam}, ready to edit: drag a node, change a load or tick a hinge and watch the diagrams follow. The exercises further down turn each model into a short study, with answers to check your hand calculation against.

::feature-structures
::

The same models are in the app under **☰ → Examples**, and [run.edubeam.app/?panel=examples](https://run.edubeam.app/?panel=examples){target="_blank"} opens that gallery directly.

::callout{type="info" title="One member type for all six"}
Every example uses the same steel member: $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (so $EI = 17\,548$ kNm²), an area of $1\ \text{m}^2$ and a shear stiffness so large that axial and shear deformation are negligible. The textbook formulas for slender beams therefore match the app to every digit shown. The section height is $1$ m, which matters only for the temperature load.
::

## Suggested exercises

Work out the answer by hand first, then check it in the app: open the model from its tile above or with **Open in EduBeam** under its figure. Opening a model replaces the one you have; <kbd>Ctrl</kbd>+<kbd>Z</kbd> brings yours back, and it is also kept in **☰ → Recent structures**.

### Indeterminate beam {#exercise-indeterminate-beam}

A 3 m beam, clamped at A and on a roller at B, under 10 kN/m.

::model-figure{caption="Clamped at A, roller at B, 10 kN/m"}
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

1. Find the reactions and the moment at the clamp by hand, with the force method or a table of fixed-end moments.
2. Untick `Ry` at A to make the beam simply supported. How does the largest moment change?
3. Tick `Ry` at A again, and at B too, to clamp both ends.

**Look for** where the moment diagram changes sign, and how the clamp takes more of the load than the roller.

::callout{type="details" title="Answers"}
- Clamped and propped: $R_A = 5qL/8 = 18.75$ kN, $R_B = 3qL/8 = 11.25$ kN, $M_A = qL^2/8 = 11.25$ kNm hogging. The largest sagging moment is $9qL^2/128 = 6.33$ kNm, 1.125 m from B, where the shear force is zero.
- Simply supported: $qL^2/8 = 11.25$ kNm at mid-span, the same number the clamp carried before.
- Clamped at both ends: $qL^2/12 = 7.5$ kNm hogging at the ends, $qL^2/24 = 3.75$ kNm sagging at mid-span.
::

### Cantilever {#exercise-cantilever}

A 4 m cantilever, clamped at A, with 18 kN down at the free end B.

::model-figure{caption="Cantilever, 18 kN at the free end"}
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

1. Find the moment at the clamp, the tip deflection and the tip rotation. Compare them with node B in **Results → Nodal results**.
2. Halve $I_y$ in the **Cross sections** tab. What changes, and what doesn't?
3. Replace the point load with a uniform load of 4.5 kN/m, the same 18 kN in total: delete the nodal load in the **Loads** tab, then **Add element load**.

**Look for** the shape of the moment diagram: a straight line under the point load, a parabola under the uniform load.

::callout{type="details" title="Answers"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21.88$ mm, $\varphi_B = FL^2/(2EI) = 8.21$ mrad.
- Half the $I_y$ doubles the deflection to 43.77 mm. The moment stays at 72 kNm: the cantilever is statically determinate, so its forces don't depend on stiffness.
- Uniform load: $M_A = qL^2/2 = 36$ kNm and $w_B = qL^4/(8EI) = 8.21$ mm. The same total load gives half the moment and three-eighths of the deflection.
::

### Warren truss {#exercise-pratt-truss}

A 9 m truss, 1.8 m deep, with 8 kN at each of the three top joints E, F and G. Tick **N(x)** in the display options to see the axial forces. (With alternating diagonals and no verticals, its layout is what most textbooks call a Warren truss.)

::model-figure{caption="Joints A to G, 8 kN at E, F and G"}
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

1. Find the reactions, then the forces in the end diagonal A–E and the bottom chord A–B by the method of joints.
2. Find the top chord force in the middle panel and the bottom chord force B–C by the method of sections.
3. The joints in this model are rigid. Tick both end hinges of every bar in the **Elements** tab to make it a pin-jointed truss, and compare the axial forces.
4. Delete the diagonal B–F, first with rigid joints, then with hinges. Does the truss still stand?

**Look for** the pattern of signs: the top chord in compression, the bottom chord in tension, and the diagonals alternating.

::callout{type="details" title="Answers"}
- Reactions: 12 kN at A and at D.
- End diagonals: 15.62 kN compression. Bottom chords A–B and C–D: 10.00 kN tension.
- Top chords E–F and F–G: 13.33 kN compression (moments about B: $(12 \cdot 3 - 8 \cdot 1.5)/1.8$). Bottom chord B–C: 16.67 kN tension (moments about F: $(12 \cdot 4.5 - 8 \cdot 3)/1.8$). Inner diagonals: 5.21 kN, in tension from E and G down to the bottom chord, in compression up to F.
- Rigid and pinned joints give the same axial forces to within 0.1 %. Bending in a triangulated truss is negligible, which is why the pin-jointed model works.
- Without B–F, the rigid-jointed truss still stands by frame action, with bending moments of about 3 kNm. With hinges it has one bar too few: it becomes a mechanism, and EduBeam shows how it can move.
::

### Three-span continuous beam {#exercise-three-span-continuous-beam}

A 16 m beam with 5 + 6 + 5 m spans: 8 kN/m on the first span, 20 kN at C, and 6 kN/m on the last span. As it opens, only A and D are supported.

::model-figure{caption="As it opens: supported at A and D only"}
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

1. As opened, it is one simply supported 16 m beam. Find the reactions and the moments at B and C.
2. Tick `Dz` at B and at C to make it a continuous beam over four supports.
3. Find the moments over B and C with the three-moment equation, then the reactions.

**Look for** the hogging moments that appear over the inner supports, how much smaller every moment becomes, and what happens to the 20 kN load once C is a support.

::callout{type="details" title="Answers"}
- Simply supported: $R_A = 44.69$ kN, $R_D = 45.31$ kN, $M_B = 123.4$ kNm and $M_C = 151.6$ kNm, both sagging.
- Continuous, with $M_A = M_D = 0$:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  give $M_B = -9.766$ kNm and $M_C = -5.859$ kNm, hogging. The 20 kN at C goes straight into the support and bends nothing.
- Reactions: A 18.05 kN, B 22.60 kN, C 35.52 kN (including the 20 kN), D 13.83 kN. They add up to the 90 kN of load.

::model-figure{caption="The continuous beam over four supports"}
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

### Portal frame {#exercise-portal-frame}

An 8 m beam on two 6 m columns, clamped at A and on a roller at D. The beam carries 10 kN/m, and the top corner C takes 8 kN to the left and 10 kN down.

::model-figure{caption="Clamped at A, roller at D: 10 kN/m on the beam, 8 kN and 10 kN at C"}
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

1. How many times is the frame statically indeterminate?
2. Untick `Ry` at A to make A a pin. The frame is now statically determinate: find the reactions and the moments at the corners B and C by hand.
3. Tick `Ry` at A again, then tick `Dx` at D to make it a pin. Watch the sway of the beam in the deformed shape.

**Look for** which way the top of the frame moves. In the frame as opened it moves to the right, against the 8 kN load. Why?

::callout{type="details" title="Answers"}
- Four reactions (three at the clamp, one at the roller) and three equations of equilibrium: once indeterminate. With D pinned too, twice.
- Pin at A: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN to the right. The corner moment at B is $8 \cdot 6 = 48$ kNm. At C it is zero: with no horizontal reaction at D, the right column carries only an axial force of 44 kN.
- As opened, the top moves 9.5 mm to the right: the moment from the loaded beam bends the clamped column more than the 8 kN does. With D pinned, D takes 4.9 kN horizontally, and the top moves 4.8 mm to the left.
::

### Temperature load {#exercise-temperature-load}

A simply supported 8 m beam, heated by $\Delta T_c = 20$ K along its axis, with its bottom 10 K cooler than its top ($\Delta T_b - \Delta T_t = -10$ K).

::model-figure{caption="Simply supported 8 m beam, heated by 20 K, its bottom 10 K cooler than its top"}
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

1. Before looking: which internal forces does the temperature cause, and how does the beam move?
2. Tick `Dx` at B to stop the beam from growing.
3. Tick `Ry` at both ends as well.

**Look for** the deformed shape and the numbers in **Results → Nodal results**: the beam moves without any internal force until you restrain it.

::callout{type="details" title="Answers"}
- A statically determinate beam is free to expand and bend, so there are no internal forces. B slides out by $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1.92$ mm. The cooler bottom shortens, so the beam arches upwards with curvature $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1.2 \cdot 10^{-4}$ 1/m: the ends turn by $\kappa L/2 = 0.48$ mrad and mid-span rises by $\kappa L^2/8 = 0.96$ mm.
- With both ends held in x: $N = -EA\alpha\Delta T_c = -50\,400$ kN, compression. The size comes from the placeholder area of 1 m²; an IPE 200 with 28.48 cm² would take 143.5 kN.
- With both ends clamped: a constant moment $EI\alpha(\Delta T_b - \Delta T_t)/h = 2.11$ kNm along the whole beam.
::

## Worked tutorials

Longer models, built step by step and checked by hand:

::card-grid{cols="2"}
:::card{title="Inclined beam" icon="lucide:move-diagonal" to="/tutorials/inclined-beam"}
A rafter under snow: loads per metre of plan, normal and shear forces along the slope, and a turned roller.
:::
:::card{title="Three-hinged frame" icon="lucide:triangle" to="/tutorials/three-hinged-frame"}
Reactions, N, V and M of a frame with an internal hinge.
:::
:::card{title="Plane truss" icon="lucide:git-fork" to="/tutorials/truss"}
The method of joints, the method of sections, a zero-force member and a deflection by virtual work.
:::
:::card{title="Continuous beam & settlement" icon="lucide:spline" to="/tutorials/continuous-beam"}
A beam over two spans, solved by the force method, then with its middle support settling by 10 mm.
:::
::

For more closed-form checks, see [Checking results by hand](/guide/verification).

## More problems {#more-problems}

[Practice](/practice) gives you a new beam, frame or truss with fresh numbers whenever you ask, and checks your reactions and the largest moment or bar force at once. For a class, the [exam builder](/exam) prints a different test for every student with an answer key, and [@edubeam/plot](/guide/teaching#exercise-sheets-tests-and-slides-from-code) makes exercise sheets from code.

## Contribute an example

Have a good teaching model? Share its link in [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) and we may add it to the gallery.
