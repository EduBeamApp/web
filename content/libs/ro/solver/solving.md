---
title: Calculul
description: "Ce face solve() în @edubeam/fem, când trebuie renumerotate ecuațiile după modificarea unui model, cum recunoști un mecanism și cât de mare poate fi modelul."
order: 9
group: Calcul și rezultate
source: site
---

# Calculul {#solving}

```ts
solver.solve()
```

`solve()` numerotează ecuațiile, asamblează matricea de rigiditate globală și vectorii încărcărilor tuturor cazurilor de încărcare și determină deplasările și reacțiunile. După aceea poate fi citit orice [rezultat](/ro/solver/results); înainte, citirea unuia aruncă un `TypeError`. Pașii sunt cei din [Cum calculează EduBeam modelul](/ro/elements/analysis), în manualul teoretic.

Soluția este exactă pentru modelul liniar: deformata și eforturile în lungul fiecărei bare provin din soluțiile analitice ale grinzii Timoshenko, așa că nu există o rețea de îndesit și nu e nevoie să împarți barele pentru a obține diagrame exacte.

Începând cu versiunea 0.3.1, `solve()` nu mai scrie nimic în consolă; versiunea 0.3.0 afișa la fiecare apel un rând precum `Solution took 9 [ms]`.

## Recalcularea după o modificare {#solving-again-after-a-change}

Dacă schimbi doar valori din model, ajunge un nou `solve()`. Dacă se schimbă ecuațiile însele, mai e nevoie înainte de un rând:

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // gradele de libertate s-au schimbat: renumerotează-le
solver.solve()
```

| Modificare | Apoi |
| --- | --- |
| Valorile încărcărilor, încărcări noi sau eliminate | `solve()` |
| Coordonatele nodurilor, materiale, secțiuni, articulații | `solve()` |
| Adăugarea de noduri sau bare | `codeNumberGenerated = false`, apoi `solve()` |
| Eliminarea de noduri sau bare: `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false`, apoi `solve()` |
| Schimbarea reazemelor unui nod, `node.bcs` | `codeNumberGenerated = false`, apoi `solve()` |

Dacă uiți acest rând după ce adaugi un nod, `solve()` aruncă un `TypeError`. Dacă uiți după ce schimbi un reazem, calculează **în tăcere** cu reazemele vechi. Când ai dubii, adaugă-l: renumerotarea nu costă aproape nimic. Eliminarea unei bare înseamnă și eliminarea încărcărilor ei din `lc.elementLoadList`, altfel `solve()` aruncă un `RangeError` din cauza barei lipsă.

Pentru multe variante ale aceluiași model, de exemplu într-un studiu parametric, un program de calcul nou pentru fiecare variantă este mai simplu și la fel de rapid: vezi [exemplul cu linia de influență](/ro/solver/scripts#an-influence-line-as-csv).

## Când calculul eșuează {#when-solving-fails}

O structură care se poate mișca fără să se deformeze, adică un mecanism, are o matrice de rigiditate singulară. Uneori `solve()` observă asta și aruncă o excepție:

```text
Error: Linear system cannot be solved since matrix is singular
```

Adesea însă nu: din cauza erorilor de rotunjire, matricea pare rezolvabilă și obții deplasări de ordinul $10^{12}$ m sau valori aparent rezonabile pentru o structură care poate aluneca liber. O grindă pe două reazeme simple, de exemplu, se calculează fără nicio obiecție atâta timp cât nimic nu o împinge lateral. Așa că verifică singur reazemele și tratează deplasările uriașe ca semn al unui mecanism.

Cauze tipice:

- prea puține reazeme, de exemplu o grindă pe două reazeme simple;
- reazeme care nu pot ține structura: toate paralele sau toate îndreptate spre același punct;
- o articulație în plus, de exemplu trei în linie;
- un moment aplicat unui nod în care toate capetele de bară sunt articulate.

Mesajul nu spune unde este problema. Aplicația EduBeam verifică dacă modelul este mecanism înainte de calcul și găsește și animă mișcarea; adesea cel mai repede vezi problema construind același model acolo. [Depanare](/ro/reference/troubleshooting) enumeră cauzele obișnuite.

Un nod, un material sau o secțiune lipsă aruncă un `RangeError` care îl numește. Parametrii de secțiune lipsă nu aruncă deloc o eroare: toate rezultatele sunt `NaN`. Vezi [Materiale și secțiuni](/ro/solver/materials-sections#cross-section).

## Dimensiunea modelului {#model-size}

Programul de calcul folosește matrice pline, gândite pentru modele de dimensiunea celor de la seminar. Pe un laptop, în Node, un șir de bare în linie dreaptă se calculează în aproximativ:

| Bare | Grade de libertate | Timp |
| --- | --- | --- |
| 50 | 150 | 0,1 s |
| 100 | 300 | 0,2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

Fiecare dublare a modelului înseamnă un timp de șase până la nouă ori mai mare.

Toate exercițiile, cadrele și grinzile cu zăbrele dintr-un curs de Statica construcțiilor încap fără probleme. Nu este gândit pentru modele cu mii de bare.

## Fără alte tipuri de calcul {#no-other-analyses}

Această versiune face doar calcul static liniar. Codul sursă conține un program de calcul pentru valori proprii, pentru frecvențele proprii de vibrație, dar acesta nu face parte din pachetul publicat: `EigenValueDynamicSolver` nu poate fi importat din `@edubeam/fem`.
