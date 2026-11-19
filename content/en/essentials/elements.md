---
description: "Draw beam elements in EduBeam, release their ends with hinges for pins and truss bars, and define materials and sections from the libraries or a polygon."
source: site
---

# Elements, materials & sections

Every element in [EduBeam]{.edubeam} is a beam between two nodes, with a material and a cross section. Draw elements between nodes, release their ends with hinges where the structure has pins, and pick materials and sections from the libraries or define your own.

## The beam element {#the-beam-element}

There is one element type: a **2D Timoshenko beam** in the x–z plane, with three degrees of freedom at each end (`Dx`, `Dz`, `Ry`). It carries normal force, shear force and bending moment, and includes [shear deformation](#shear-deformation). A truss bar is the same element with [both ends hinged](#end-hinges). The formulation is in the [theory manual](/elements/beam).

The results along an element are exact for the linear model, so **one element per member is enough**. Add a node inside a member only where you need a support, a hinge, a change of section, or a point to read displacements at. A point load does not need one: a [concentrated load](/essentials/loads#concentrated-load) can sit anywhere along an element.

## Adding elements {#adding-elements}

An element needs a material and a cross section, so add those first (see [Materials](#materials) and [Cross sections](#cross-sections)). Until there are some, the viewer says *No materials defined* or *No cross sections defined*, with an **Add new** button.

- **By choosing nodes.** *Elements* tab → **Add element** (the button with the **+** icon), or right-click the canvas → *Add element*. Choose the **Initial node** and **End node**, tick **Hinge** under either if needed, and pick the **Material** and **Cross section**. This needs at least two nodes.
- **By clicking.** *Elements* tab → **Add element** (the button with the cursor icon), or hold <kbd>Ctrl</kbd> while choosing *Add element* in the canvas menu. Click a node (or empty canvas, which creates one), then the next; keep clicking to draw a chain of elements, and press <kbd>Esc</kbd> or **Cancel** to finish. The banner at the top sets **Start hinge** and **End hinge** for every element you draw. The elements get the first material and cross section of the model.

![The Add element dialog](/screenshots/qs-element.webp){.shot-md}

## Element direction {#element-direction}

Each element has its own **local axes**. Local x runs from the **initial node** to the **end node**; local z is local x turned 90° clockwise on screen. On an element drawn left to right, the local axes are the global ones. The **dashed line** drawn along each element marks its local +z side, the "bottom fibres".

![A portal frame drawn A → B → C → D: the dashed lines of all three elements fall inside the frame](/screenshots/p2b-element-direction.webp){.shot-md}

In this frame, element 1 runs up from A to B, so its local z, and its dashed line, point right; element 3 runs down from C to D, so its dashed line is on the left. Drawn this way, the dashed lines of a portal frame all fall on the inside.

The direction matters for:

- loads given in local axes (**LCS** ticked), see [Element loads](/essentials/loads#element-loads);
- the **Load position from start node** of a concentrated load;
- the order of the [end forces](/elements/conventions#end-forces-element-results-table) in the results: `X12, Z12, M12` at the initial node, `X21, Z21, M21` at the end node;
- which side is the "dashed side" in the [diagram settings](/essentials/units-settings#viewer-settings).

To reverse an element, press **Swap nodes** (the arrows between the two nodes in the *Elements* table).

## End hinges {#end-hinges}

An end hinge releases the bending moment at one end of an element: the moment there is zero, and the end can turn independently of the node.

- **One hinge** puts a pin inside a beam or a frame.
- **Both hinges** make a **truss bar**, which carries normal force only.

Tick them in any of these places:

- the **End hinges** column of the *Elements* table, one checkbox for each end;
- the **Hinge** boxes in the **Add element** dialog, or in the element's panel → **Edit element**;
- **Start hinge** and **End hinge** in the banner while drawing with the mouse.

![The Elements table of a three-hinged frame: element 2 has a hinge at its end, node C](/screenshots/elements-table.webp)

### One hinge: a pin inside the structure

The same continuous beam, two spans of 5 m under 10 kN/m. On the right, element 1 has an end hinge at B: the moment over the support drops to zero, and each span carries its load like a simply supported beam.

::div{.shots}

:::model-figure{caption="Continuous: M = −31.25 kNm over B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Hinged at B: M = 0 over B, 31.25 kNm in each span"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [{ nodes: [A, B], hinges: [false, true] }, [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

::

By hand: continuous, $M_B = -qL^2/8 = -31.25\ \text{kNm}$ and at most $9qL^2/128 = 17.58\ \text{kNm}$ in each span; hinged, $M_B = 0$ and $M_{max} = qL^2/8 = 31.25\ \text{kNm}$ at each midspan. The hinge relieves the support but nearly doubles the span moments. For a beam with an internal hinge to solve by hand, with your answers checked as you type, try [practice problem G2048](/practice?p=G2048).

### Both hinges: a truss bar

A wall bracket of two bars, both hinged at both ends, carrying 20 kN at B. The bars carry normal force only, and the moment diagram is empty.

::model-figure{caption="Tie AB: N = +26.67 kN (tension); strut CB: N = −33.33 kN (compression)"}
---
nodes: { A: [0, 0], B: [4, 0], C: [0, 3] }
supports: { A: pin, C: pin }
members: [{ nodes: [A, B], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: B, fz: 20 }
results: [N, M]
show: [nodeLabels]
---
::

By hand: the strut is 5 m long and rises 3 m, so $N_{CB} = -20 \cdot 5/3 = -33.33\ \text{kN}$, and the tie balances its horizontal part, $N_{AB} = 33.33 \cdot 4/5 = 26.67\ \text{kN}$. The [truss tutorial](/tutorials/truss) builds a whole truss this way, and [Practice](/practice?p=T2048) has trusses to solve by hand.

### Hinge the element, not the node

A hinge belongs to one end of one element: it frees that end to turn on its own, while every other element at the node stays rigidly joined to it. So where two members meet, one hinge makes a pin joint; where several meet, hinge all of them but one. A truss joint, where every bar is a truss bar, has all of them hinged.

A node where every element is hinged has no rotational stiffness. EduBeam accepts it and reports its rotation as 0. If hinges turn the structure into a mechanism, EduBeam circles them and shows how it moves; see [Troubleshooting](/reference/troubleshooting#messages).

## Editing and deleting {#editing-and-deleting}

| To | Do this |
| --- | --- |
| Change nodes, hinges, material or section | Click the element → **Edit element**, or edit it in the *Elements* table. |
| Reverse it | **Swap nodes** in the *Elements* table. |
| Rename it | Type a new label in the *Element* column. |
| See its stiffness matrix | Click it → **Stiffness matrix**, or the matrix button in the *Actions* column. A window shows the element's 6 × 6 matrix in global axes, in SI units (N and m) whatever units you display, with end hinges already condensed out. Handy for checking a hand assembly. |
| Delete it | Click it → **Delete**, the × in the table, or select it and press <kbd>Delete</kbd>. Its loads go with it. |

![An element's panel](/screenshots/ui-element-menu.webp){.shot-xs}

## Materials {#materials}

*Materials* tab → **Add material**, or **Material library** for a ready-made one. Many elements can share one material; changing it updates them all.

| Field | Unit | What it does |
| --- | --- | --- |
| Young's modulus $E$ | MPa | Axial and bending stiffness, $EA$ and $EI_y$. Steel 210 000 MPa, concrete about 30 000 MPa, timber about 11 000 MPa. |
| Shear modulus $G$ | MPa | Shear stiffness $kGA$. Unless the section's $k$ is huge, it adds [shear deformation](#shear-deformation): larger deflections and, in a statically indeterminate structure, different internal forces. $G = E/(2(1+\nu))$: steel about 81 000 MPa. |
| Density $\rho$ | kg/m³ | Stored with the material, but not used: there is no self-weight load. |
| Thermal expansion $\alpha$ | 1/K | Used by [temperature loads](/essentials/loads#temperature-load). Steel $12 \times 10^{-6}$ 1/K. |

The units are the SI defaults; they follow your [settings](/essentials/units-settings#units), so in US units E and G are in ksi, density in lb/ft³ and α in 1/°F.

A new material starts at $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2.4$, that is $\nu = 0.2$), $\rho$ = 1000 kg/m³ and $\alpha = 12 \times 10^{-6}$ 1/K; in US units it starts as ASTM A992 steel. For steel, change $G$ to 81 000 MPa or pick a steel from the library.

![The Add material dialog](/screenshots/qs-material.webp){.shot-md}

The **Material library** (also *Or choose from library* in the Add material dialog) lists the metric (EN) materials first, or the US ones (ASTM steels, ACI concrete) first when your lengths are in feet or inches. The **+** in a row adds that material, named after it:

| Family | Materials |
| --- | --- |
| Metals | Steel S235, S275, S355; stainless steel 304, 316; cast iron; aluminium 6061-T6, 7075-T6, 5083; copper, brass, bronze; titanium Grade 2 and Ti-6Al-4V; US steels ASTM A992, A36, A572 Gr. 50 and HSS A500 Gr. C |
| Concrete | C25/30, C30/37, C40/50, lightweight; US $f'_c$ = 4 ksi and 5 ksi |
| Timber | C24, GL24h, GL32h |
| Other | Glass, GFRP, CFRP, HDPE, PVC, PMMA, polycarbonate |

A material that elements still use cannot be deleted: assign those elements another material first.

## Cross sections {#cross-sections}

*Cross sections* tab → **Add cross section**, **Section library**, or **Polygonal section** to draw your own shape. Like materials, sections can be shared by many elements.

| Field | Unit | What it does |
| --- | --- | --- |
| Area $A$ | m² | Axial stiffness $EA$, and shear area $kA$. |
| Second moment of area $I_y$ | m⁴ | Bending stiffness $EI_y$, about the axis perpendicular to the drawing. |
| Height $h$ | m | Only used by temperature loads: the curvature is $\alpha\,(\Delta T_b - \Delta T_t)/h$. |
| Shear coefficient $k$ | – | The effective shear area is $kA$, so the shear stiffness is $kGA$. About 0.83 for a rectangle, $A_{web}/A$ for an I-section. |

A new section starts at $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m and $k$ = 1 (in US units, a W12×26 with $k$ = 1). Replace them with your section's values, or pick one from the library.

::callout{type="tip" title="Matching a textbook that ignores shear deformation"}
Most hand calculations use Euler–Bernoulli beams, with no shear deformation. To match them, give $k$ a very large value such as `1e10`; the examples in the app and the figures on this site use `1e32`. A new section ($k = 1$), the library and the polygon editor all include shear deformation; [below](#shear-deformation) is how much it changes.
::

The **Section library** gives approximate values for:

| Family | Sections | $k$ |
| --- | --- | --- |
| Solid | Rectangles, squares, circles | 0.833 (rectangle), 0.9 (circle) |
| I-shapes | IPE 100, IPE 200, HEA 100, HEA 200; AISC W-shapes W8×31 to W36×150 | $h\,t_w/A$, the web |
| Rectangular tubes | RHS 100×50×3, 150×100×5; AISC HSS | $2ht/A$, both webs |
| Round tubes | CHS Ø60×3, Ø114×5; AISC round HSS | 0.5 |

Check library values against a section table before relying on them.

![The Section library](/screenshots/sections-library.webp){.shot-lg}

For a quick check by hand: a rectangle $b \times h$ has $A = bh$ and $I_y = bh^3/12$; a solid circle of diameter $d$ has $A = \pi d^2/4$ and $I_y = \pi d^4/64$.

### Shear deformation: when G and k matter {#shear-deformation}

The shear stiffness $kGA$ enters the element through the [shear parameter](/elements/beam#timoshenko-or-euler-bernoulli) $\Phi = 12EI_y/(kGAL^2)$. With a very large $k$, $\Phi = 0$ and the element is an Euler–Bernoulli beam, so $G$ has no effect. With a real $k$, shear deformation always adds to the deflections. In a statically determinate structure the internal forces stay the same; in an indeterminate one they change too, because the redundants depend on the stiffness.

How much depends on how stocky the member is. An IPE 200 from the library ($k = h\,t_w/A = 0.393$) in S235 steel ($G$ = 81 000 MPa), under 10 kN/m, compared with the same beam at $k$ = `1e32`:

| Beam | With shear deformation | Euler–Bernoulli |
| --- | --- | --- |
| Simply supported, $L$ = 2 m ($L/h$ = 10): midspan deflection | 0.566 mm | 0.511 mm |
| Fixed–roller, $L$ = 2 m: moment at the fixed end | −4.84 kNm | −5.00 kNm |
| Simply supported, $L$ = 6 m ($L/h$ = 30): midspan deflection | 41.85 mm | 41.36 mm |

By hand: the shear part of the midspan deflection is $qL^2/(8kGA)$, 0.055 mm for the short beam, 11 % on top of the bending part $5qL^4/(384EI_y)$. In the fixed–roller beam the fixed-end moment drops from $qL^2/8$ to $(qL^2/8)/(1 + \Phi/4)$. At $L/h$ = 30 both effects are about 1 % or less, which is why slender frames and textbook answers agree whatever $k$ is.

### Polygonal sections {#polygonal-sections}

*Cross sections* tab → **Polygonal section**, or *Or define a polygonal shape* in the Add cross section dialog, opens a shape editor that computes the section properties for you.

![The polygonal section editor with an I-section preset, its principal axes and ellipse of inertia](/screenshots/sections-polygon.webp)

::div{.steps}

### Start from a preset

Pick a **Preset** (rectangle, I-section, T-section, L-section, channel, rectangular hollow, circle, circular hollow), set its dimensions and press **Apply**.

### Adjust the shape

Drag vertices (they snap to the **Snap step**), click an edge midpoint to insert a vertex, or double-click a vertex to remove it. You can also type coordinates in the **Vertices** table. **Add hole** adds an inner contour, and **Center at centroid** moves the shape so its centroid is at the origin.

### Read the properties

The **Section properties** tab shows $A$, the centroid, $I_y$, $I_z$, $I_{yz}$ about the centroid, the principal moments $I_1$, $I_2$ with the **Principal axis angle** $\alpha$ (from $y$ to axis 1), and the radii of gyration. The drawing shows the principal axes and the ellipse of inertia.

### Add it

Check the **Label** and the **Shear coefficient** $k$: it starts at 0.833, right for a rectangle; an I-section needs about $A_{web}/A$. Then press **Add cross section** (**Save** when you edit an existing shape). $A$, $I_y$ and $h$ come from the shape and are read-only in the table; to change them, edit the shape again with the polygon button in the *Actions* column.

::

Section coordinates are local and right-handed: $x$ out of the screen, $y$ to the left, $z$ down.

If the shape is not symmetric about the plane of the frame (an L-angle, for example), the editor warns you: a 2D analysis is exact only if the member is held against sideways deflection and twisting along its whole length, by a slab for example. When $I_{yz}$ is significant, you choose the bending stiffness: **held sideways and against twisting along its length** ($I_y$), or **free to deflect sideways**, which is lower. Twisting is not included either way.
