---
description: "Konwencje znaków w EduBeamie: x w prawo i z w dół, dodatnie obciążenia i przemieszczenia, osie lokalne, N, V i M, siły przywęzłowe, reakcje i opcja osi y w górę."
source: site
---

# Układ współrzędnych i konwencje znaków

Każda liczba, którą pokazuje EduBeam, ma znak. Na tej stronie zebraliśmy, co oznacza zwrot *dodatni* dla współrzędnych, obciążeń, przemieszczeń, sił przekrojowych, sił przywęzłowych i reakcji, dzięki czemu porównasz wyniki aplikacji z własnymi obliczeniami. Większość wyników, które wyglądają na błędne, okazuje się w końcu kwestią konwencji znaków.

| Wielkość | Dodatnia |
| --- | --- |
| `x`, `Dx`, `Fx` | w prawo |
| `z`, `Dz`, `Fz` | **w dół** |
| `Ry`, `My` | przeciwnie do ruchu wskazówek zegara na ekranie |
| $N$ | rozciąganie |
| $V$ | obraca krótki odcinek pręta zgodnie z ruchem wskazówek zegara |
| $M$ | rozciąga włókna dolne, po stronie linii przerywanej |
| Reakcje | siła, którą podpora działa na konstrukcję, ze znakiem jak obciążenie |

## Osie globalne {#global-axes}

Model leży w płaszczyźnie x–z:

- **x** jest pozioma, dodatnia **w prawo**.
- **z** jest pionowa, dodatnia **w dół**.
- **y** wychodzi z ekranu w Twoją stronę, dzięki czemu układ jest prawoskrętny. Obroty i momenty działają wokół osi y, więc **za dodatni przyjmuje się zwrot przeciwny do ruchu wskazówek zegara**.

Wskaźnik osi w rogu płótna pokazuje x na czerwono, a z na zielono. Ponieważ oś z jest skierowana w dół, węzeł na szczycie słupa o wysokości 3 m, którego podstawa leży w `Z = 0`, ma `Z = −3`. Kąty, np. kąt podpory ukośnej, mierzy się od x w stronę z, czyli na ekranie zgodnie z ruchem wskazówek zegara.

Jeśli wolisz oś y skierowaną w górę, przełącz [konwencję wyświetlania](#y-up-axes): model pozostaje taki sam, zmieniają się tylko liczby, które odczytujesz i wpisujesz.

## Stopnie swobody {#degrees-of-freedom}

Każdy węzeł ma trzy stopnie swobody:

| Stopień swobody | Znaczenie | Zwrot dodatni | Jednostka |
| --- | --- | --- | --- |
| `Dx` | przemieszczenie poziome | w prawo | m |
| `Dz` | przemieszczenie pionowe | w dół | m |
| `Ry` | obrót | przeciwnie do ruchu wskazówek zegara | rad |

Te same znaki obowiązują przy [zadanych przemieszczeniach](/pl/essentials/loads#prescribed-displacements-support-settlements), w tabeli *Wyniki węzłowe* i w wartościach, które widać po najechaniu kursorem na węzeł.

## Obciążenia {#loads}

Obciążenia są dodatnie, gdy działają zgodnie z dodatnimi zwrotami osi. **Fx**, **Fz** i **My** to składowe obciążenia węzłowego lub skupionego, **fx** i **fz** składowe obciążenia równomiernego, a **f₁x**, **f₂x**, **f₁z**, **f₂z** składowe obciążenia trapezowego na początku i na końcu elementu.

| Obciążenie | Zwrot dodatni |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, w prawo; przy zaznaczonym **LCS** wzdłuż lokalnej osi x elementu |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **w dół**; przy zaznaczonym **LCS** wzdłuż lokalnej osi z elementu |
| `My` | przeciwnie do ruchu wskazówek zegara |
| `ΔTc` | ogrzanie osi pręta, które go wydłuża |
| `ΔTb − ΔTt` | włókna dolne cieplejsze od górnych |

Obciążenie grawitacyjne to więc **dodatnie** `fz`, a wiatr pchający lewy słup w prawo to dodatnie `fx`. Obciążenie liniowe zawsze działa na metr własnej długości pręta, także wtedy, gdy na pręcie ukośnym zadano je w osiach globalnych. Jak zadać każdy typ obciążenia, pokazuje strona [Obciążenia](/pl/essentials/loads#element-loads).

::model-figure{caption="Wszystkie obciążenia są tu dodatnie: fz = 5 kN/m na A–B, Fz = 10 kN w B, My = 10 kNm w C i Fx = 10 kN w D"}
---
nodes: { A: [0, 0], B: [3, 0], C: [4.5, 0], D: [6, 0] }
supports: { A: fixed }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 5 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
  - { node: D, fx: 10 }
results: []
reactions: false
show: [nodeLabels]
---
::

## Osie lokalne elementu {#element-local-axes}

Każdy element ma własne osie:

- **lokalna oś x** biegnie od węzła początkowego elementu do jego węzła końcowego;
- **lokalna oś z** to lokalna oś x obrócona o 90° **zgodnie z ruchem wskazówek zegara na ekranie**, czyli tak samo, jak globalna oś x przechodzi w globalną oś z. Gdy idziesz od węzła początkowego do końcowego, lokalna oś z jest po Twojej prawej stronie.

| Element narysowany | Lokalna oś z skierowana |
| --- | --- |
| od lewej do prawej | w dół: osie lokalne i globalne się pokrywają |
| od prawej do lewej | w górę |
| od dołu do góry | w prawo |
| od góry do dołu | w lewo |

Kierunek elementu określa jego kąt $\theta$, mierzony od globalnej osi x w stronę globalnej osi z (na ekranie zgodnie z ruchem wskazówek zegara). [Macierz transformacji](/pl/elements/beam#transformation-matrix) przelicza przemieszczenia końców między oboma układami za pomocą $\cos\theta$ i $\sin\theta$.

W widoku linia przerywana wzdłuż każdego elementu oznacza stronę jego lokalnej osi +z, czyli **włókna dolne**. Osiami lokalnymi kierują się obciążenia elementu z zaznaczonym **LCS**, położenie obciążenia skupionego i siły przywęzłowe. Aby odwrócić element, użyj **Zamień kolejność węzłów** w tabeli *Elementy* (zob. [kierunek elementu](/pl/essentials/elements#element-direction)).

## Siły przekrojowe {#internal-forces}

Przetnij pręt w odległości $x$ od jego węzła początkowego. Na przekroju części **przed** cięciem, której normalna zewnętrzna jest skierowana wzdłuż lokalnej osi +x, siły przekrojowe są dodatnie, gdy działają wzdłuż lokalnej osi +x, wzdłuż lokalnej osi +z i przeciwnie do ruchu wskazówek zegara. Na drugim przekroju działają przeciwnie.

::element-sketch{mode="internal-forces" caption="Dodatnie N, V i M na krótkim odcinku pręta: rozciąganie, para sił tnących obracająca odcinek zgodnie z ruchem wskazówek zegara, moment dodatni (rozciągane włókna dolne przy linii przerywanej)"}
::

Słowami:

| Wielkość | Dodatnia oznacza |
| --- | --- |
| $N$ | rozciąganie |
| $V$ | obraca krótki odcinek pręta zgodnie z ruchem wskazówek zegara: dla pręta narysowanego od lewej do prawej działa w górę na lewym przekroju odcinka i w dół na prawym |
| $M$ | **rozciąganie włókien dolnych**, po stronie linii przerywanej |

Dla obciążenia liniowego $q_x$ i $q_z$ w osiach lokalnych zachodzą zależności

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

W miejscu obciążenia skupionego $F_x$, $F_z$ lub $M_y$ (w osiach lokalnych) siły przekrojowe zmieniają się skokowo o $\Delta N = -F_x$, $\Delta V = -F_z$ i $\Delta M = -M_y$: siła działająca wzdłuż lokalnej osi +z zmniejsza $V$, a moment przeciwny do ruchu wskazówek zegara zmniejsza $M$.

Belka swobodnie podparta pod obciążeniem grawitacyjnym ma więc dodatni moment, dodatnią siłę tnącą przy lewej podporze i ujemną przy prawej. Belkę poniżej dodatkowo ciągnie siła przyłożona przy podporze przesuwnej, więc jej siła normalna jest dodatnia.

::model-figure{caption="Belka swobodnie podparta, 10 kN/m i siła rozciągająca 20 kN: M = +45 kNm w środku rozpiętości, V = +30 kN przy lewej podporze i −30 kN przy prawej, N = +20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
  - { node: B, fx: 20 }
results: [M, V, N]
---
::

We wsporniku moment zmienia znak: rozciągane są włókna górne. Siła działająca wzdłuż osi w stronę utwierdzenia ściska pręt.

::model-figure{caption="Wspornik z siłą 10 kN na swobodnym końcu i siłą ściskającą 15 kN: M = −40 kNm w utwierdzeniu, V = +10 kN, N = −15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 10 }
  - { member: 1, px: -15, at: 4 }
results: [M, V, N]
---
::

W ramie dolną stroną każdego pręta jest jego lokalna strona +z, więc to, która strona słupa jest „dolna”, zależy od kolejności, w jakiej go narysujesz. Ta rama jest narysowana A → B → C → D, dlatego lokalna oś z każdego pręta jest skierowana do wnętrza: dodatni moment oznacza rozciąganie po wewnętrznej stronie ramy, a ujemne momenty w narożach rozciąganie po stronie zewnętrznej.

::model-figure{caption="Rama portalowa narysowana A → B → C → D: lokalna oś z wszystkich trzech prętów jest skierowana do wnętrza ramy"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

Wykresy są rysowane tak, jak na większości europejskich uczelni: $M$ po stronie rozciąganej, a dodatnie $N$ i $V$ po stronie przeciwnej do linii przerywanej. Opcje w **Ustawienia → Ustawienia widoku → Wykresy sił wewnętrznych** pozwalają rysować $M$ po stronie ściskanej, a $N$ lub $V$ po stronie linii przerywanej. Zmienia to tylko rysunek, nigdy wartości: znak odczytuj z etykiety, nie ze strony, po której leży wykres.

## Siły przywęzłowe (tabela Wyniki elementów) {#end-forces-element-results-table}

Tabela *Wyniki elementów* podaje dla każdego elementu sześć **sił przywęzłowych** (w aplikacji *Siły końcowe*) w jego osiach **lokalnych**:

::element-sketch{mode="end-forces" caption="Sześć sił przywęzłowych, każda narysowana jako dodatnia: wzdłuż lokalnych osi x i z oraz przeciwnie do ruchu wskazówek zegara"}
::

| Kolumna | Działa na element w | Zwrot dodatni |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | jego węźle początkowym | lokalna oś +x, lokalna oś +z, przeciwnie do ruchu wskazówek zegara |
| `X21`, `Z21`, `M21` | jego węźle końcowym | lokalna oś +x, lokalna oś +z, przeciwnie do ruchu wskazówek zegara |

Są to siły, którymi węzły działają na element: iloczyn jego macierzy sztywności i przemieszczeń jego końców plus siły, które utrzymywałyby obciążenia elementu, gdyby oba jego końce były utwierdzone,

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

gdzie $\mathbf{d}_l$ to przemieszczenia końców elementu w osiach lokalnych, a $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ zastępcze obciążenia węzłowe od jego [obciążeń elementu](/pl/elements/beam#element-loads).

Siły przywęzłowe kierują się osiami, a nie konwencją $N$–$V$–$M$, dlatego w węźle początkowym mają przeciwny znak:

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

Dla belki swobodnie podpartej powyżej: `X12 = −20 kN` i `X21 = +20 kN` (rozciąganie), `Z12 = Z21 = −30 kN` (obie podpory pchają w górę, czyli w kierunku −z) oraz `M12 = M21 = 0`.

W każdym węźle suma sił przywęzłowych zbiegających się w nim elementów, przeliczonych na osie globalne, jest równa obciążeniu węzłowemu powiększonemu o reakcję. Pozwala to szybko sprawdzić równowagę węzła.

## Reakcje {#reactions}

Reakcja to siła lub moment, którym podpora działa **na konstrukcję**, po jednej dla każdego zablokowanego stopnia swobody. Ma znak jak obciążenie: jest dodatnia wzdłuż +x, wzdłuż +z (w dół) i przeciwnie do ruchu wskazówek zegara. Podpora przenosząca obciążenie grawitacyjne ma więc **ujemną** reakcję `Rz`.

Reakcje są podawane w osiach globalnych albo w osiach węzła, jeśli węzeł ma ustawiony **Kąt lokalnego układu** ([podpora ukośna](/pl/essentials/nodes-supports#inclined-skewed-supports)). W widoku każda reakcja jest strzałką skierowaną tak, jak pcha podpora, opisaną wartością bez znaku. Wartości ze znakiem znajdziesz w eksporcie CSV jako `Rx`, `Rz` i `My`.

## Oś y w górę {#y-up-axes}

**Ustawienia → Język i ustawienia regionalne → Układ współrzędnych → x w prawo, y w górę** przełącza wszystko, co wpisujesz i odczytujesz, na układ podręcznikowy: **x** w prawo, **y** w górę i **z** w Twoją stronę. Model, zapisane pliki i rysunki pozostają dokładnie takie same; zmieniają się tylko liczby i litery:

| Wielkość | x w prawo, z w dół (domyślnie) | x w prawo, y w górę |
| --- | --- | --- |
| Współrzędna pionowa | `Z` | `Y`, przeciwny znak |
| Pionowe obciążenia, przemieszczenia, reakcje, siły przywęzłowe | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, przeciwny znak |
| Obroty i momenty | `Ry`, `My` | `Rz`, `Mz`, ten sam znak (dodatnie przeciwnie do ruchu wskazówek zegara) |
| Kąt podpory | mierzony zgodnie z ruchem wskazówek zegara | mierzony przeciwnie do ruchu wskazówek zegara, przeciwny znak |
| Siły przekrojowe | $N$, $V$, $M$ | te same, z tymi samymi znakami, rysowane tak samo |

Przy osi y w górę obciążenie grawitacyjne to więc **ujemne** `fy`, a szczyt słupa o wysokości 3 m ma `Y = 3`.

## Jednostki {#units}

Solver liczy wszędzie w jednostkach SI: m, N, Pa, rad, a zmiany temperatury w K. Jednostki wyświetlania ze strony [Jednostki i ustawienia](/pl/essentials/units-settings) zmieniają tylko to, co wpisujesz i odczytujesz, nigdy model.
