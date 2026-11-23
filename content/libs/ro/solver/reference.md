---
title: Referință API
description: "Toate clasele, metodele și argumentele din @edubeam/fem 0.3, cu unități, valori implicite și forma a ceea ce întoarce fiecare."
order: 16
group: Referință API
source: site
---

# Referință API {#api-reference}

Ce exportă `@edubeam/fem` 0.3, grupat după utilizare. Unitățile sunt peste tot SI: m, N, N·m, N/m, Pa, K și rad. Etichetele (`LabelType`) sunt `string | number`, stocate ca șiruri de caractere. Metodele care nu apar aici sunt interne: sunt publice în TypeScript doar pentru că le apelează celelalte clase ale programului de calcul.

## Exporturi {#exports}

| Export | Tip | Secțiune |
| --- | --- | --- |
| `LinearStaticSolver` | clasă | [Tipuri de calcul](#analyses) |
| `Solver` | clasă abstractă | [Tipuri de calcul](#analyses) |
| `Domain` | clasă | [Domain](#domain) |
| `Node` | clasă | [Node](#node) |
| `Beam2D`, `Element` | clase | [Elemente](#elements) |
| `Material`, `CrossSection` | clase | [Materiale și secțiuni](#materials-and-sections) |
| `LoadCase` | clasă | [Încărcări](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | clase | [Încărcări](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | tipuri | |

## Tipuri de calcul {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Membru | Tip | Descriere |
| --- | --- | --- |
| `domain` | `Domain` | Modelul |
| `loadCases` | `LoadCase[]` | Pornește cu un caz, `'DefaultLC'`. Adaugă altele cu `new LoadCase(label, solver.domain)`: [Cazuri de încărcare](/ro/solver/load-cases). |
| `solve()` | `void` | Numerotează ecuațiile dacă e nevoie, asamblează și rezolvă toate cazurile de încărcare. Poate arunca o excepție la un [mecanism](/ro/solver/solving#when-solving-fails), dar nu întotdeauna. Nu afișează nimic începând cu 0.3.1; 0.3.0 afișa durata calculului. |
| `codeNumberGenerated` | `boolean` | Setează-l la `false` după ce adaugi sau elimini noduri ori bare sau schimbi reazemele: [de ce](/ro/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Numărul gradelor de libertate libere și al celor blocate, după calcul |
| `k` | mathjs `Matrix` | Matricea de rigiditate globală asamblată, după calcul |
| `getNodeDofIDs(label)` | `number[]` | Gradele de libertate ale unui nod, după calcul |

`EigenValueDynamicSolver` există în codul sursă, dar nu este exportat.

## Domain {#domain}

`solver.domain` păstrează modelul în patru obiecte `Map` având drept cheie eticheta ca șir de caractere: `nodes`, `elements`, `materials`, `crossSections`. Nu există metode de eliminare: `domain.nodes.delete(label)` și `domain.elements.delete(label)` elimină un nod sau o bară, urmate de [renumerotare](/ro/solver/solving#solving-again-after-a-change).

| Metodă | Întoarce | Descriere |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` `[x, y, z]` în m (implicit `[0, 0, 0]`), `bcs` gradele de libertate `DofID` blocate (implicit niciunul) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` `[first, second]`, `hinges` `[atFirst, atSecond]` (implicit `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Vezi [Materiale și secțiuni](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Vezi [Materiale și secțiuni](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | obiectul | Aruncă un `RangeError` pentru o etichetă necunoscută. `getElement` are tipul `Element`: scrie `as Beam2D` ca să citești rezultate. |

Crearea unui obiect cu o etichetă deja folosită îl înlocuiește pe cel vechi.

## Node {#node}

| Membru | Tip | Descriere |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Schimbă-l ca să muți nodul. |
| `bcs` | `Set<DofID>` | Gradele de libertate blocate. Înlocuiește-l ca să schimbi reazemul. |
| `lcs` | `number[][] \| undefined` | Axele rotite ale nodului, dacă există |
| `updateLcs({ locx, locy }?)` | `void` | Rotește axele nodului: `locx` axa lui x în componente globale, `locy` `[0, 1, 0]`. Fără argument le resetează. |
| `hasLcs()` | `boolean` | Dacă axele sunt rotite |
| `getUnknowns(lc, dofs)` | `Matrix` sau un `number` pentru un singur grad de libertate | Deplasări (m) și rotiri (rad), în axele nodului |
| `getReactions(lc, global?)` | `{ dofs, values }` | Reacțiunile pe gradele de libertate blocate, în ordinea din `bcs`: N, N·m. `values` este o `Matrix` mathjs pentru mai multe, un tablou cu un element pentru una, `[]` pentru un nod liber. Cu `global` `true` la un nod rotit: toate cele trei grade de libertate în axe globale, `dofs` `[0, 2, 4]`, `values` un tablou cu 0 acolo unde nu este nimic blocat. [Cum se citesc](/ro/solver/results#reactions). |

## Elemente {#elements}

### `Beam2D` {#beam2d}

O grindă Timoshenko cu două noduri în planul x–z, cu trei grade de libertate pe nod (`Dx`, `Dz`, `Ry`). `x` este în metri de la primul nod; `n` este un număr de segmente, care dă n + 1 puncte.

| Membru | Întoarce | Descriere |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Eliberările de moment la primul și la al doilea nod |
| `computeNormalForceAt(lc, x)` | `number` | N, pozitivă la întindere |
| `computeShearForceAt(lc, x)` | `number` | V, pozitivă acolo unde M crește în lungul axei locale x |
| `computeBendingMomentAt(lc, x)` | `number` | M, pozitiv cu întindere pe partea +z locală |
| `computeNormalForce(lc, n)` | `{ x, N }` | N în n + 1 puncte |
| `computeShearForce(lc, n)` | `{ x, V }` | V în n + 1 puncte |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M în n + 1 puncte |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Deplasări în lungul barei și transversal pe ea, axe locale, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | Același lucru în x și z globale |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, forțele cu care nodurile acționează asupra barei, axe locale |
| `computeEndDisplacement(lc)` | `Matrix` | Deplasările capetelor în axe locale, inclusiv rotirile din articulații |
| `computeGeo()` | `{ l, dx, dz }` | Lungimea și proiecțiile, m |
| `computeT()` | `Matrix` | Matricea de transformare 6 × 6, din global în local |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: matricea de rigiditate locală 6 × 6, cu articulațiile condensate |
| `computeStiffness()` | `Matrix` | Matricea de rigiditate globală 6 × 6 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

În dreptul unei forțe concentrate, metodele `…At` întorc valoarea de imediat după ea. `Element` este clasa de bază abstractă a lui `Beam2D`; este tipul folosit de `domain.elements` și `getElement`.

## Materiale și secțiuni {#materials-and-sections}

| `MaterialParameters` | Unitate | Implicit | Folosit pentru |
| --- | --- | --- | --- |
| `e` | Pa | 1 | rigiditate |
| `g` | Pa | 1 | rigiditatea la forfecare |
| `alpha` | 1/K | 1 | încărcări din variație de temperatură |
| `d` | kg/m³ | 1 | nimic în statică |

| `CrossSectionParameters` | Unitate | Implicit | Folosit pentru |
| --- | --- | --- | --- |
| `a` | m² | niciuna, obligatoriu | rigiditatea axială și la forfecare |
| `iy` | m⁴ | niciuna, obligatoriu | rigiditatea la încovoiere |
| `k` | – | niciuna, obligatoriu | rigiditatea la forfecare $kGA$; `1e32` pentru a o neglija |
| `h` | m | niciuna | diferențe de temperatură între fețe (`NaN` fără el) |
| `iz`, `dyz`, `j` | m⁴ | niciuna | nefolosite de `Beam2D` |

Un parametru de material lipsă are valoarea 1, nu o valoare tipică; lipsa lui `a`, `iy` sau `k` face ca toate rezultatele să fie `NaN`. Niciuna dintre situații nu aruncă o eroare. Ambele clase au o metodă `change(params)` care setează parametrii dați și îi păstrează ca proprietăți cu aceleași nume.

## Încărcări {#loads}

### `LoadCase` {#loadcase}

| Metodă | Întoarce | Valori |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (implicit `false`) `true`: în axele rotite ale nodului |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m pe toată bara |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m la primul și la al doilea nod, liniar între ele |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, la `a` m de primul nod |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: centrul de greutate, fibra inferioară, fibra superioară |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` pe grade de libertate blocate, în axele nodului; ignorate pe cele libere |

Pentru încărcările pe bare, `lcs` `true` înseamnă axe locale (x în lungul barei, z transversal), iar `false` axe globale. Încărcările liniare sunt pe metru din lungimea barei. Exemple găsești în [Încărcări în noduri și pe bare](/ro/solver/loads).

| Membru | Tip | Descriere |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Încărcări pe bare și din variații de temperatură |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` după un calcul reușit |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Încărcările de pe o bară |

Obiectele de încărcare își păstrează valorile în proprietăți publice, pe care le poți modifica înainte de a calcula din nou: `values` (și `lcs`) la `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` și `BeamTemperatureLoad`; `startValues` și `endValues` la `BeamElementTrapezoidalEdgeLoad`; `prescribedValues` la `PrescribedDisplacement`. Fiecare are un `target`, eticheta obiectului asupra căruia acționează.

## DofID {#dofid}

| Nume | Valoare | Folosit de `Beam2D` |
| --- | --- | --- |
| `Dx` | 0 | da |
| `Dy` | 1 | nu |
| `Dz` | 2 | da |
| `Rx` | 3 | nu |
| `Ry` | 4 | da |
| `Rz` | 5 | nu |

## Rezultate {#results}

Rezultatele se citesc dintr-un `Beam2D` (eforturi, săgeți, forțe la capete) și dintr-un `Node` (deplasări, reacțiuni), întotdeauna pentru un `LoadCase` dat, după `solve()`: vezi cele două tabele de mai sus, iar pentru exemple și semne, [Citirea rezultatelor](/ro/solver/results). Pe scurt:

| Ce obții | Apel |
| --- | --- |
| Reacțiuni, N și N·m | `node.getReactions(lc)` |
| Deplasări, m, și rotiri, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V sau M într-un punct, N și N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V sau M în lungul unei bare | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Deformata, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Forțe la capete, N și N·m | `beam.computeEndForces(lc)` |
| O figură cu toate | `StructurePlot` sau `structureSvg` din [@edubeam/plot](/ro/solver/drawing) |
