---
title: Pierwsze kroki
description: "Zainstaluj @edubeam/fem, solver MES, na którym działa EduBeam, i w kilkunastu linijkach TypeScriptu rozwiąż belkę swobodnie podpartą, sprawdź ją i odczytaj wyniki."
order: 1
group: Wprowadzenie
source: site
---

# Pierwsze kroki {#getting-started}

@edubeam/fem to solver metody elementów skończonych, na którym działa [EduBeam]{.edubeam}: każdy wykres, każda reakcja i każde ugięcie, które pokazuje aplikacja, pochodzą właśnie z niego. Możesz go używać we własnym kodzie, w przeglądarce albo w Node, do obliczania płaskich belek, ram i kratownic: generować zadania razem z odpowiedziami, sprawdzać prace domowe, prowadzić analizy parametryczne albo podłączyć solver do strony internetowej.

::div{.actions}
[Rozwiąż pierwszą belkę](#a-simply-supported-beam) [Przejrzyj przykładowe programy](/pl/solver/beams)
::

Biblioteka jest napisana w TypeScripcie, ma własne definicje typów i jest wolnym oprogramowaniem na licencji GPL-3.0. Jej autorem jest Bořek Patzák, który rozwija ją razem z Janem Voříškiem i innymi współautorami.

## Instalacja {#install}

```bash
npm install @edubeam/fem
```

Działa z `import` i `require`, w przeglądarce oraz w Node 18 i nowszym, a jej jedyną zależnością jest [mathjs](https://mathjs.org). Do wersji 0.3.0 instalowało się ją z GitHuba jako `ts-fem`: jeśli masz ją zainstalowaną w ten sposób, zmień importy na `@edubeam/fem`. Nic poza tym się nie zmieniło.

Aby wypróbować poniższy przykład w pustym folderze, zrób z niego projekt korzystający z `import`, a potem zainstaluj bibliotekę:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

Bez `"type": "module"` w `package.json` przykład też zadziała, ale Node najpierw wypisze ostrzeżenie.

## Pierwsza belka {#a-simply-supported-beam}

Stalowa belka IPE 200 o rozpiętości 6 m, oparta na podporze przegubowej nieprzesuwnej i przesuwnej, obciążona równomiernie 12 kN/m:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// Wszędzie jednostki SI: m, N, Pa. Stal i IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Węzły w punktach [x, y, z] w metrach, ze stopniami swobody blokowanymi przez podporę
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // podpora nieprzesuwna
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // podpora przesuwna
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m wzdłuż lokalnej osi z pręta: w belce rysowanej od lewej do prawej – w dół
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m w środku rozpiętości
console.log(beam.computeShearForceAt(lc, 0)) // N w A
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m w środku rozpiętości
```

Zapisz kod jako `beam.ts` i uruchom `node beam.ts`: Node 22.18 i nowsze uruchamiają TypeScript bezpośrednio. Plik nie zawiera adnotacji typów, więc w starszym Node wystarczy zapisać go jako `beam.mjs`. Program wypisze:

```text [Wynik]
54000
36000
0.04990940552616746
```

To wartości z podręcznika: $M = qL^2/8 = 54$ kNm i $V = qL/2 = 36$ kN. Oto ta sama belka, rozwiązana na bieżąco w przeglądarce przez ten sam solver:

::model-figure{caption="Belka z przykładu: 6 m, IPE 200, 12 kN/m"}
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

Ugięcie 49,91 mm jest o 0,28 mm większe niż wynik teorii Eulera–Bernoulliego, $5qL^4/384EI = 49{,}63$ mm. To nie błąd: pręt jest belką Timoszenki, a 0,28 mm to $qL^2/8kGA$, czyli udział odkształcenia postaciowego tej belki. Nadaj `k` ogromną wartość, np. `1e32`, a różnica zniknie: zob. [Odkształcenie postaciowe](/pl/solver/materials-sections#shear-deformation).

## Co robi ten kod {#what-the-code-does}

::div{.steps}
### Utwórz solver {#make-a-solver}

`new LinearStaticSolver()` zawiera pustą domenę `domain`, która przechowuje model, i jeden przypadek obciążenia, `solver.loadCases[0]`.

### Opisz model {#describe-the-model}

Materiały i przekroje, węzły z podporami, a potem pręty między węzłami. Każdy obiekt ma etykietę (tekst lub liczbę), przez którą odwołuje się do niego reszta modelu. Zob. [Węzły i podpory](/pl/solver/nodes-supports), [Materiały i przekroje](/pl/solver/materials-sections) oraz [Pręty i przeguby](/pl/solver/members-hinges).

### Przyłóż obciążenia {#load-it}

Obciążenia należą do przypadku obciążenia: siły w węzłach, obciążenia wzdłuż prętów, temperatura i osiadania podpór. Zob. [Obciążenia węzłów i prętów](/pl/solver/loads).

### Rozwiąż {#solve}

`solver.solve()` agreguje i rozwiązuje wszystkie przypadki obciążenia. Zob. [Obliczenia](/pl/solver/solving).

### Odczytaj wyniki {#read-the-results}

Siły przekrojowe w dowolnym punkcie pręta, ugięcia, siły przywęzłowe, przemieszczenia węzłów i reakcje. Zob. [Odczyt wyników](/pl/solver/results), a o wykresach – [Rysowanie wyników](/pl/solver/drawing).
::

## Jednostki i znaki w skrócie {#axes-and-signs}

Na wejściu jednostki SI, na wyjściu też SI. Model leży w płaszczyźnie x–z, a **oś z jest skierowana w dół**, więc dodatnie `fz` działa w dół, a górny koniec słupa o wysokości 4 m leży na $z = -4$. Położenia na pręcie podaje się w metrach od jego pierwszego węzła. Moment rozciągający włókna dolne jest dodatni. Pełne zestawienie jest na stronie [Jednostki i konwencja znaków](/pl/solver/conventions).

## Sześć częstych pułapek {#pitfalls}

1. **Oś z jest skierowana w dół.** Obciążenia grawitacyjne są dodatnie, a wszystko, co leży powyżej podpór, ma ujemną współrzędną z. Zob. [Osie](/pl/solver/conventions#axes).
2. **Kierunek pręta decyduje o znaku M i w.** Definiuj belki od lewej do prawej, a słupy od dołu do góry – wtedy znaki będą takie jak w podręczniku. Zob. [Kierunek pręta](/pl/solver/conventions#member-direction).
3. **Brakujący parametr daje `NaN` albo bezsensowny wynik, a nie błąd.** Przekrój potrzebuje `a`, `iy` i `k`; materiał potrzebuje `e`, a także `g`, chyba że `k` jest ogromne. Zob. [Materiały i przekroje](/pl/solver/materials-sections).
4. **Po dodaniu węzłów lub prętów albo zmianie podpór** ustaw `solver.codeNumberGenerated = false` przed ponownym rozwiązaniem. Zob. [Ponowne obliczenia po zmianie](/pl/solver/solving#solving-again-after-a-change).
5. **Reakcje są zwracane jako macierz mathjs albo jako tablica**, w kolejności, w jakiej podano stopnie swobody podpory. Zob. [Reakcje](/pl/solver/results#reactions).
6. **Mechanizm nie zawsze kończy się wyjątkiem.** Przemieszczenie rzędu $10^{12}$ m oznacza, że konstrukcja może się swobodnie poruszać. Zob. [Gdy obliczenia się nie udają](/pl/solver/solving#when-solving-fails).

## Co dalej {#next}

::card-grid{cols="2"}
:::card{title="Przykładowe programy" icon="lucide:book-open" to="/pl/solver/beams"}
Kompletne, sprawdzone programy: belki, ramy, kratownice, zestaw zadań z kluczem odpowiedzi i mały serwer HTTP.
:::
:::card{title="Narysuj wyniki" icon="lucide:chart-spline" to="/pl/solver/drawing"}
Przekaż rozwiązany model bibliotece @edubeam/plot i otrzymaj jego wykresy jako SVG, w komponencie Vue albo ze skryptu w Node.
:::
:::card{title="Dokumentacja API" icon="lucide:list-tree" to="/pl/solver/reference"}
Wszystkie klasy, metody i argumenty, z jednostkami i opisem tego, co zwracają.
:::
:::card{title="Teoria" icon="lucide:sigma" to="/pl/elements/beam"}
Element belkowy, jego macierz sztywności i transformacja w podręczniku teoretycznym EduBeamu.
:::
::
