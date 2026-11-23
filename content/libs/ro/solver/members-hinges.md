---
title: Bare și articulații
description: "Leagă nodurile cu bare Beam2D, eliberează momentele cu articulații la capete, modelează barele grinzilor cu zăbrele și citește matricele de rigiditate și de transformare în @edubeam/fem."
order: 5
source: site
---

# Bare și articulații {#members-and-hinges}

Fiecare bară este un `Beam2D`: o grindă Timoshenko dreaptă, cu două noduri, în planul x–z, care preia forță axială, forță tăietoare și moment încovoietor. Articulațiile de la capete eliberează momentul în acel loc. Fragmentele de cod folosesc `solver`, `domain` și `lc` dintr-un program ca cel din [Primii pași](/ro/solver/getting-started), cu materialul lui `'steel'` și secțiunea `'IPE200'`.

## Creează o bară {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argument | Tip | Semnificație |
| --- | --- | --- |
| `label` | `string \| number` | Numele barei, stocat ca șir de caractere |
| `nodes` | `[label, label]` | Primul și al doilea nod. Axa locală x merge de la primul la al doilea: vezi [Sensul barei](/ro/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Etichetele unui material și ale unei secțiuni transversale |
| `hinges` | `[boolean, boolean]` | O articulație la primul nod, la al doilea. Opțional; implicit `[false, false]`, capete rigide. |

Metoda întoarce `Beam2D`: păstrează-l ca să citești rezultatele. `domain.getElement(label)` îl găsește din nou, dar cu tipul general `Element`, așa că TypeScript cere `as Beam2D` înainte să citești rezultate din el.

Barele care se întâlnesc într-un nod fără articulații sunt legate rigid: se rotesc împreună. Nodurile, materialul și secțiunea pot fi create în orice ordine, cu condiția să existe toate când calculezi; dacă lipsește unul, `solve()` aruncă un `RangeError` care îl numește.

## Articulații la capete {#end-hinges}

O articulație aparține capătului unei bare, nu unui nod. Aici bara 2 începe cu o articulație în C, așa că C transmite de la deschiderea C–D la consola A–C forța tăietoare, dar nu și momentul:

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // 0 în articulație
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: qL²/8 al deschiderii de 4 m
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: cei 20 kN din C–D, cu brațul de 2 m
```

::model-figure{caption="O consolă care susține o deschidere articulată: niciun moment în C"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

Acolo unde mai multe bare se întâlnesc într-un nod articulat, este suficientă câte o articulație la capetele tuturor barelor, cu excepția uneia. Merg și articulații la toate capetele: atunci nimic nu rotește nodul, iar programul de calcul îi dă rotirea 0. Dar un moment aplicat unui astfel de nod nu are ce să-l preia, iar [calculul eșuează](/ro/solver/solving#when-solving-fails).

## Bare de grindă cu zăbrele {#truss-bars}

Articulează ambele capete și bara preia doar forță axială, atâta timp cât este încărcată în noduri: o bară de grindă cu zăbrele.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

[Exemplul de grindă cu zăbrele](/ro/solver/trusses) calculează astfel o întreagă grindă cu zăbrele. Exemplul de grindă cu zăbrele din aplicația EduBeam folosește în schimb noduri rigide, cu o arie atât de mare încât momentele încovoietoare sunt neglijabile față de forțele axiale. Ambele modele sunt corecte; diferă doar prin aceste momente mici. Matricea de rigiditate a barei este dedusă pe pagina [Elementul de bară articulată](/ro/elements/truss) din manualul teoretic.

## Matricele elementului {#the-element-s-matrices}

Pentru predarea metodei propriu-zise, un `Beam2D` își pune la dispoziție matricele ca matrice [mathjs](https://mathjs.org); `.toArray()` le transformă în `number[][]`:

| Metodă | Întoarce |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: lungimea și proiecțiile, m |
| `computeLocalStiffnessMtrx().answer` | matricea de rigiditate 6 × 6 în axe locale, cu articulațiile eliminate prin condensare |
| `computeT()` | matricea de transformare 6 × 6 din axe globale în axe locale |
| `computeStiffness()` | matricea de rigiditate 6 × 6 în axe globale, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][], N/m, N și N·m
```

Gradele de libertate sunt ordonate $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$. Pagina [Elementul de bară](/ro/elements/beam) din manualul teoretic deduce aceste matrice, iar [Cum calculează EduBeam modelul](/ro/elements/analysis) arată cum sunt asamblate.
