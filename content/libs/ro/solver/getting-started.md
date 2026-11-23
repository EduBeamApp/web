---
title: Primii pași
description: "Instalează @edubeam/fem, programul de calcul cu elemente finite din spatele EduBeam, și calculează, verifică și citește o grindă simplu rezemată în doar câteva rânduri de TypeScript."
order: 1
group: Introducere
source: site
---

# Primii pași {#getting-started}

@edubeam/fem este programul de calcul cu elemente finite din spatele [EduBeam]{.edubeam}: fiecare diagramă, reacțiune și săgeată pe care o afișează aplicația provine din el. Îl poți folosi din propriul cod, în browser sau în Node, pentru a calcula grinzi, cadre și grinzi cu zăbrele plane: să generezi exerciții împreună cu răspunsurile, să verifici teme, să faci studii parametrice sau să pui un program de calcul în spatele unei pagini web.

::div{.actions}
[Calculează prima grindă](#a-simply-supported-beam) [Vezi exemplele de programe](/ro/solver/beams)
::

Biblioteca este scrisă în TypeScript, vine cu propriile definiții de tipuri și este software liber sub licența GPL-3.0. A fost creată de Bořek Patzák și este dezvoltată împreună cu Jan Voříšek și alți contributori.

## Instalare {#install}

```bash
npm install @edubeam/fem
```

Funcționează cu `import` și `require`, în browser și în Node 18 sau mai nou, și are o singură dependență, [mathjs](https://mathjs.org). Până la versiunea 0.3.0 se instala de pe GitHub sub numele `ts-fem`: dacă ai folosit-o așa, schimbă importurile în `@edubeam/fem`. Altceva nu s-a schimbat.

Ca să încerci exemplul de mai jos într-un folder gol, transformă-l într-un proiect care folosește `import`, apoi instalează biblioteca:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

Fără `"type": "module"` în `package.json` exemplul rulează în continuare, dar Node afișează mai întâi un avertisment.

## Prima grindă {#a-simply-supported-beam}

O grindă de oțel IPE 200 cu deschiderea de 6 m, articulată la un capăt și simplu rezemată la celălalt, încărcată cu 12 kN/m:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// Peste tot unități SI: m, N, Pa. Oțel și un IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Noduri în punctele [x, y, z], în metri, cu gradele de libertate blocate de reazem
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // articulație
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // reazem simplu
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m după axa locală z a barei: în jos la o grindă desenată de la stânga la dreapta
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m la mijlocul deschiderii
console.log(beam.computeShearForceAt(lc, 0)) // N în A
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m la mijlocul deschiderii
```

Salvează codul ca `beam.ts` și rulează `node beam.ts`: Node 22.18 și versiunile mai noi rulează TypeScript direct. Fișierul nu conține adnotări de tip, așa că pe un Node mai vechi salvează-l în schimb ca `beam.mjs`. Programul afișează:

```text [Rezultat]
54000
36000
0.04990940552616746
```

Acestea sunt valorile din manual, $M = qL^2/8 = 54$ kNm și $V = qL/2 = 36$ kN. Iată aceeași grindă, calculată în browserul tău de același program de calcul:

::model-figure{caption="Grinda de mai sus: 6 m, IPE 200, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

Săgeata, 49,91 mm, este cu 0,28 mm mai mare decât valoarea Euler–Bernoulli $5qL^4/384EI = 49{,}63$ mm. Nu este o eroare: bara este o grindă Timoshenko, iar 0,28 mm reprezintă $qL^2/8kGA$, deformația din forfecare a acestei grinzi. Dă-i lui `k` o valoare uriașă, de exemplu `1e32`, și diferența dispare: vezi [Deformația din forfecare](/ro/solver/materials-sections#shear-deformation).

## Ce face codul {#what-the-code-does}

::div{.steps}
### Creează programul de calcul {#make-a-solver}

`new LinearStaticSolver()` vine cu un `domain` gol, care conține modelul, și cu un caz de încărcare, `solver.loadCases[0]`.

### Descrie modelul {#describe-the-model}

Materiale și secțiuni transversale, noduri cu reazemele lor, apoi bare între noduri. Fiecare obiect are o etichetă, un șir de caractere sau un număr, prin care restul modelului se referă la el. Vezi [Noduri și reazeme](/ro/solver/nodes-supports), [Materiale și secțiuni](/ro/solver/materials-sections) și [Bare și articulații](/ro/solver/members-hinges).

### Încarcă-l {#load-it}

Încărcările aparțin unui caz de încărcare: forțe în noduri, încărcări în lungul barelor, variații de temperatură și cedări de reazem. Vezi [Încărcări în noduri și pe bare](/ro/solver/loads).

### Calculează {#solve}

`solver.solve()` asamblează și rezolvă toate cazurile de încărcare. Vezi [Calculul](/ro/solver/solving).

### Citește rezultatele {#read-the-results}

Eforturi în orice punct al unei bare, săgeți, forțele la capetele barelor, deplasări ale nodurilor și reacțiuni. Vezi [Citirea rezultatelor](/ro/solver/results) și, pentru diagrame, [Desenarea rezultatelor](/ro/solver/drawing).
::

## Unități și semne pe scurt {#axes-and-signs}

Unități SI la intrare, unități SI la ieșire. Modelul se află în planul x–z, cu **axa z orientată în jos**, deci un `fz` pozitiv împinge în jos, iar capătul de sus al unui stâlp de 4 m se află la $z = -4$. Pozițiile în lungul unei bare se dau în metri de la primul ei nod. Momentul care întinde fibra inferioară este pozitiv. Lista completă este în [Unități și convenții de semne](/ro/solver/conventions).

## Șase greșeli frecvente {#pitfalls}

1. **Axa z este orientată în jos.** Încărcările gravitaționale sunt pozitive, iar tot ce se află deasupra reazemelor are z negativ. Vezi [Axe](/ro/solver/conventions#axes).
2. **Sensul barei dă semnul lui M și w.** Definește grinzile de la stânga la dreapta și stâlpii de jos în sus, iar semnele se citesc ca în manual. Vezi [Sensul barei](/ro/solver/conventions#member-direction).
3. **Un parametru lipsă dă `NaN` sau un rezultat absurd, nu o eroare.** O secțiune are nevoie de `a`, `iy` și `k`; un material are nevoie de `e` și de `g`, cu excepția cazului în care `k` este uriaș. Vezi [Materiale și secțiuni](/ro/solver/materials-sections).
4. **După ce adaugi noduri sau bare ori modifici reazemele,** setează `solver.codeNumberGenerated = false` înainte de a calcula din nou. Vezi [Recalcularea după o modificare](/ro/solver/solving#solving-again-after-a-change).
5. **Reacțiunile se întorc ca matrice mathjs sau ca tablou,** în ordinea în care au fost date gradele de libertate ale reazemului. Vezi [Reacțiuni](/ro/solver/results#reactions).
6. **Un mecanism nu aruncă întotdeauna o excepție.** O deplasare de ordinul $10^{12}$ m înseamnă că structura se poate mișca liber. Vezi [Când calculul eșuează](/ro/solver/solving#when-solving-fails).

## Ce urmează {#next}

::card-grid{cols="2"}
:::card{title="Exemple de programe" icon="lucide:book-open" to="/ro/solver/beams"}
Programe complete și verificate: grinzi, cadre, grinzi cu zăbrele, o fișă de exerciții cu barem și un mic server HTTP.
:::
:::card{title="Desenează rezultatele" icon="lucide:chart-spline" to="/ro/solver/drawing"}
Dă un model calculat bibliotecii @edubeam/plot și obține diagramele lui ca SVG, în Vue sau dintr-un script Node.
:::
:::card{title="Referință API" icon="lucide:list-tree" to="/ro/solver/reference"}
Toate clasele, metodele și argumentele, cu unitățile lor și ce întoarce fiecare.
:::
:::card{title="Teoria" icon="lucide:sigma" to="/ro/elements/beam"}
Elementul de bară, matricea lui de rigiditate și transformarea, în manualul teoretic EduBeam.
:::
::
