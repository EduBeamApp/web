---
title: Materiały i przekroje
description: "Parametry materiału i przekroju w @edubeam/fem: których wymagają dane obliczenia, co się dzieje, gdy któregoś brakuje, i jak wyłączyć odkształcenie postaciowe."
order: 4
source: site
---

# Materiały i przekroje {#materials-and-sections}

Pręty biorą sztywność z materiału i przekroju. Każdy z nich tworzysz raz i odwołujesz się do niego przez etykietę.

```ts
domain.createMaterial('steel', { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection('IPE200', {
  a: 28.5e-4, // m²
  iy: 1943e-8, // m⁴
  h: 0.2, // m
  k: 5 / 6,
})
```

## Materiał {#material}

| Parametr | Znaczenie | Jednostka | Kiedy potrzebny |
| --- | --- | --- | --- |
| `e` | Moduł Younga $E$ | Pa | zawsze |
| `g` | Moduł Kirchhoffa $G$ | Pa | zawsze, chyba że `k` jest ogromne (bez odkształcenia postaciowego) |
| `alpha` | Współczynnik rozszerzalności termicznej $\alpha$ | 1/K | przy obciążeniu termicznym |
| `d` | Gęstość $\rho$ | kg/m³ | nigdy w analizie statycznej |

Pominięty parametr ma wartość **1**, a nie jakąś typową wartość, i nic o tym nie ostrzega. Zapomnij o `g` w belce ze strony Pierwsze kroki, a jej ugięcie wyniesie 22 700 km.

## Przekrój {#cross-section}

| Parametr | Znaczenie | Jednostka | Kiedy potrzebny |
| --- | --- | --- | --- |
| `a` | Pole przekroju $A$ | m² | zawsze: sztywność osiowa i postaciowa |
| `iy` | Moment bezwładności $I_y$ | m⁴ | zawsze: sztywność na zginanie |
| `k` | Współczynnik ścinania $k$ | – | zawsze: sztywność postaciowa $kGA$ |
| `h` | Wysokość $h$ | m | przy różnicy temperatur |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, moment bezwładności przy skręcaniu | m⁴ | nigdy w modelu płaskim |

Przekrój nie ma wartości domyślnych. Pomiń `a`, `iy` lub `k`, a każdy wynik będzie `NaN`; pomiń `h`, a różnica temperatur da `NaN`. W żadnym z tych przypadków nie pojawia się błąd, więc wynik `NaN` prawie zawsze oznacza brakujący parametr.

## Odkształcenie postaciowe {#shear-deformation}

Pręt jest belką Timoszenki: odkształca się nie tylko przy zginaniu, ale też przy ścinaniu. O tym, w jakim stopniu, decyduje

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2},
$$

czyli wartość zwracana przez `beam.computeShearFactor()`. W smukłych prętach $\Phi$ jest znikome, a ugięcia rosną o ułamek procenta. W krótkich, wysokich prętach ma to znaczenie.

Aby uzyskać belkę Eulera–Bernoulliego z tablic podręcznikowych, nadaj sztywności postaciowej praktycznie nieskończoną wartość przez ogromny współczynnik ścinania, tak jak robią to przykłady w aplikacji EduBeam:

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

Tak postępują przykładowe programy na tych stronach, więc ich wyniki dokładnie zgadzają się ze wzorami. Jeśli chcesz uwzględnić rzeczywisty współczynnik ścinania, dla prostokąta przyjmij $k = 5/6$. Strona [Sprawdzanie wyników ręcznie](/pl/guide/verification#shear-deformation) pokazuje, jak duży jest ten efekt.

## Pręty nieodkształcalne osiowo {#rigid-in-axial-direction}

Duże pole przekroju sprawia, że pręty są praktycznie nierozciągliwe, jak zwykle zakłada się w obliczeniach ręcznych. Siły przekrojowe w ramie zależą od pola przekroju tylko nieznacznie; przemieszczenia kratownicy zależą od niego całkowicie. Siły przekrojowe w konstrukcji statycznie wyznaczalnej nie zależą od żadnej sztywności.

## Późniejsze zmiany {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Każdy pręt odczytuje materiał i przekrój w chwili, gdy solver agreguje macierz sztywności, więc wystarczy ponowne `solve()`. Różne pręty mogą mieć różne przekroje: nadaj każdemu przekrojowi własną etykietę.
