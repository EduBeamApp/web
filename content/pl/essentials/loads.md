---
description: "Obciążenia w EduBeamie: siły, momenty, osiadania, równomierne, trapezowe, skupione i termiczne; oś z w dół, moment dodatni przeciwnie do ruchu wskazówek zegara."
source: site
---

# Obciążenia

Obciążenia działają w węzłach albo wzdłuż elementów. Wszystkie należą do **jednego przypadku obciążenia** i działają jednocześnie; aby porównać warianty, zapisz każdy z nich jako [plik projektu albo link](/pl/essentials/import-export).

| Obciążenie | Działa na | Gdzie je dodać |
| --- | --- | --- |
| [Siła lub moment](#nodal-loads) | węzeł | zakładka *Obciążenia* → **Dodaj obciążenie węzłowe** albo kliknij węzeł → **Dodaj obciążenie** |
| [Zadane przemieszczenie](#prescribed-displacements-support-settlements) (osiadanie) | podparty węzeł | to samo okno albo kliknij węzeł → **Zadaj przemieszczenie** |
| Obciążenie [równomiernie rozłożone](#uniformly-distributed-load), [trapezowe](#trapezoidal-load), [skupione](#concentrated-load) lub [termiczne](#temperature-load) | element | zakładka *Obciążenia* → **Dodaj obciążenie elementu** albo kliknij element → **Dodaj obciążenie** |

## Konwencja znaków {#sign-convention-in-one-line}

Oś x jest skierowana **w prawo**, oś z **w dół**, a momenty są dodatnie **przeciwnie do ruchu wskazówek zegara**. Dodatnie `Fz` lub `fz` to więc obciążenie skierowane w dół, jak grawitacja, a obciążenie działające w górę jest ujemne.

::model-figure{caption="Wszystkie obciążenia są tu dodatnie: Fx = +10 kN w prawo, Fz = +10 kN w dół, My = +10 kNm przeciwnie do ruchu wskazówek zegara"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| Dodatni kierunek | Osie domyślne (z w dół) | [Oś y w górę](/pl/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Siła pozioma `Fx`, `fx` | w prawo | w prawo |
| Siła pionowa | `Fz`, `fz`: **w dół** | `Fy`, `fy`: **w górę** |
| Moment | `My`: przeciwnie do ruchu wskazówek zegara | `Mz`: przeciwnie do ruchu wskazówek zegara |
| Osiadanie pionowe | `Dz`: w dół | `Dy`: w górę |

Obciążenia w **osiach lokalnych** elementu (zaznaczone pole LCS) podążają natomiast za elementem: lokalna oś x biegnie od jego węzła początkowego do węzła końcowego, a lokalna oś z to oś x obrócona o 90° zgodnie z ruchem wskazówek zegara, w stronę linii przerywanej rysowanej wzdłuż elementu. Zob. [Kierunek elementu](/pl/essentials/elements#element-direction). Pełną konwencję, łącznie z siłami przekrojowymi, opisuje strona [Układ współrzędnych i konwencje znaków](/pl/elements/conventions#loads).

## Obciążenia węzłowe {#nodal-loads}

Zakładka *Obciążenia* → **Dodaj obciążenie węzłowe** albo kliknij węzeł → **Dodaj obciążenie** i pozostaw wybrane **Siła/Moment**. Wpisz siły `Fx`, `Fz` (kN) i moment `My` (kNm) ze znakami opisanymi [wyżej](#sign-convention-in-one-line); podgląd rysuje obciążenie już podczas wpisywania.

![Dodaj obciążenie węzłowe: podgląd pokazuje kierunek już podczas wpisywania](/screenshots/pl/loads-nodal.webp){.shot-md}

- Składowe podaje się w osiach **globalnych**. W węźle z obróconymi osiami ([podpora ukośna](/pl/essentials/nodes-supports#inclined-skewed-supports)) okno ma dodatkowo przełącznik **Osie globalne** / **Osie węzła**. W osiach węzła składowe, oznaczone `Fx′` i `Fz′`, działają wzdłuż osi własnych węzła i obracają się razem z nimi, jeśli kąt się później zmieni. Przełączenie przelicza wartości, więc obciążenie pozostaje takie samo.
- W jednym węźle może działać kilka obciążeń węzłowych; sumują się.

### Zadane przemieszczenia (osiadania podpór) {#prescribed-displacements-support-settlements}

Aby przesunąć podporę o zadaną wartość, wybierz w tym samym oknie **Zadane przemieszczenie** albo kliknij podparty węzeł → **Zadaj przemieszczenie**. Wpisz przemieszczenia `Dx`, `Dz` (dodatnie w prawo i w dół, w [jednostce przemieszczenia](/pl/essentials/units-settings#units), domyślnie m) i obrót `Ry` (rad, dodatni przeciwnie do ruchu wskazówek zegara).

- Przemieszczenie można zadać tylko w **zablokowanych** stopniach swobody: pozostałe pola są wyszarzone, a węzeł bez podpory nie może mieć osiadania.
- Węzeł ma najwyżej jedno zadane przemieszczenie. Aby je zmienić, edytuj je zamiast dodawać drugie.
- Przy podporze ukośnej pola mają oznaczenia `Dx′` i `Dz′`: osiadanie działa w osiach własnych podpory.

Czy osiadanie wywoła siły przekrojowe, zależy od konstrukcji. To samo osiadanie podpory B o 10 mm, bez innych obciążeń:

::div{.shots}

:::model-figure{caption="Belka swobodnie podparta: tylko się przechyla; brak reakcji, M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Belka ciągła nad podporą B: zgina się, M = 21,06 kNm nad B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

Konstrukcja statycznie wyznaczalna podąża za podporą bez oporu. Belka ciągła musi się zgiąć: podpora B ściąga ją w dół o $\delta = 10\ \text{mm}$, tak jak siła skupiona w środku belki swobodnie podpartej o rozpiętości 10 m. Przy $L = 5\ \text{m}$ i sztywności stali z przykładu $EI = 17\,548\ \text{kNm}^2$ ta siła wynosi $P = 6EI\delta/L^3 = 8{,}423\ \text{kN}$ – to reakcja w B – a $M_B = PL/2 = 3EI\delta/L^2 = 21{,}06\ \text{kNm}$. Samouczek [Belka ciągła i osiadanie podpory](/pl/tutorials/continuous-beam) łączy osiadanie z obciążeniami.

## Obciążenia elementów {#element-loads}

Zakładka *Obciążenia* → **Dodaj obciążenie elementu** albo kliknij element → **Dodaj obciążenie**. Wybierz **Typ obciążenia**; podgląd już podczas wpisywania pokazuje obciążenie na elemencie. Siły podaje się w kN, a obciążenia liniowe w kN/m albo w innych wybranych [jednostkach](/pl/essentials/units-settings#units).

![Dodaj obciążenie elementu z obciążeniem równomiernie rozłożonym](/screenshots/pl/loads-udl.webp){.shot-md}

### Obciążenie równomiernie rozłożone {#uniformly-distributed-load}

Stałe obciążenie na jednostkę długości, `fx` i `fz`, na całym elemencie. Przy zaznaczonym **LCS** (domyślnie) działa wzdłuż osi lokalnych elementu, przy odznaczonym – wzdłuż osi globalnych. Na elemencie poziomym narysowanym od lewej do prawej to jedno i to samo; na pręcie nachylonym już nie:

| Chcesz uzyskać | Wpisz |
| --- | --- |
| obciążenie **prostopadłe** do pręta (wiatr na krokiew) | `fz` z **zaznaczonym** LCS |
| obciążenie **pionowe** na metr długości pręta (ciężar własny) | `fz` z **odznaczonym** LCS |
| obciążenie **pionowe** na metr rzutu poziomego (śnieg) | nie da się bezpośrednio: pomnóż je przez $\cos\alpha$, gdzie $\alpha$ to kąt nachylenia pręta, i wpisz jako obciążenie pionowe |

To samo obciążenie 10 kN/m na krokwi o rzucie poziomym 4 m i wysokości 3 m, czyli długości 5 m:

::div{.shots}

:::model-figure{caption="LCS odznaczone: obciążenie pionowe, łącznie 50 kN; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="LCS zaznaczone: obciążenie prostopadłe do pręta; M = 31,25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

Ręcznie: dla obciążenia prostopadłego $M = qL^2/8 = 10 \cdot 5^2/8 = 31{,}25\ \text{kNm}$; dla pionowego łączne 50 kN rozłożone na 4 m rozpiętości daje 12,5 kN/m rzutu, więc $M = 12{,}5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Obciążenie trapezowe {#trapezoidal-load}

Obciążenie zmieniające się liniowo wzdłuż elementu: `f1x`, `f1z` w węźle **początkowym**, `f2x`, `f2z` w węźle **końcowym**. Aby uzyskać obciążenie trójkątne, ustaw na jednym końcu zero.

::model-figure{caption="Obciążenie trójkątne od 0 do 10 kN/m: reakcje 10 i 20 kN, największy moment M = 23,09 kNm w odległości 3,46 m od A"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

Ręcznie: wypadkowa $qL/2 = 30\ \text{kN}$ działa w odległości $2L/3$, więc $R_A = 10\ \text{kN}$ i $R_B = 20\ \text{kN}$; siła tnąca jest zerowa, a moment największy w punkcie $x = L/\sqrt{3} = 3{,}46\ \text{m}$, gdzie $M = qL^2/(9\sqrt{3}) = 23{,}09\ \text{kNm}$.

Obciążenia trapezowe działają wzdłuż **osi lokalnych** elementu (pole LCS jest zablokowane). Na elemencie poziomym narysowanym od lewej do prawej osie lokalne pokrywają się z globalnymi; na nachylonym `f1z` i `f2z` są prostopadłe do pręta, a `f1x`, `f2x` działają wzdłuż niego.

Zmienne obciążenie **pionowe** na pręcie nachylonym pod kątem $\alpha$ też da się przyłożyć dokładnie: wpisz na każdym końcu jego dwie składowe lokalne, $f_z = q\cos\alpha$ oraz $f_x = q\sin\alpha$ skierowaną wzdłuż pręta w dół, która jest ujemna, gdy element wznosi się od swojego węzła początkowego. Dla krokwi z poprzedniego przykładu, o rzucie 4 m i wysokości 3 m, narysowanej od dołu, obciążenie pionowe rosnące od 0 do 10 kN/m długości pręta to `f1x` = `f1z` = 0, `f2x` = −6 i `f2z` = 8 kN/m.

::model-figure{caption="Obciążenie pionowe od 0 do 10 kN/m długości pręta, wpisane jako składowe lokalne: reakcje 8,333 i 16,67 kN, największy moment M = 12,83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

Ręcznie: wypadkowa 25 kN działa w dwóch trzecich rzutu, 2,67 m od A, więc $R_B = 25 \cdot 2{,}667/4 = 16{,}67\ \text{kN}$. Na rzucie o długości 4 m obciążenie jest trójkątem rosnącym do 12,5 kN/m, więc tak jak wyżej $M = 12{,}5 \cdot 4^2/(9\sqrt{3}) = 12{,}83\ \text{kNm}$.

### Obciążenie skupione {#concentrated-load}

Siła skupiona `Fx`, `Fz` lub moment `My` w dowolnym miejscu **wzdłuż** elementu, bez dodatkowego węzła. **Pozycja obciążenia od węzła początkowego** to jego odległość $a$ od węzła początkowego, $0 \le a \le L$. Na początku wynosi połowę długości zaokrągloną w dół do pełnych metrów, najwyżej 5 m (w jednostkach amerykańskich pełne stopy, najwyżej 15 ft), więc ustaw ją zgodnie z położeniem swojego obciążenia. **LCS** działa tak samo jak przy obciążeniach równomiernych.

::model-figure{caption="20 kN w odległości 2 m na przęśle 6 m: V skacze z 13,33 do −6,667 kN, M = 26,67 kNm pod obciążeniem"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

Wykres sił tnących ma w miejscu obciążenia skok o `Fz`, a wykres momentów – załamanie: $R_A = 20 \cdot 4/6 = 13{,}33\ \text{kN}$, $M = 13{,}33 \cdot 2 = 26{,}67\ \text{kNm}$. Skupiony moment `My` powoduje natomiast skok na wykresie momentów.

### Obciążenie termiczne {#temperature-load}

| Pole | Znaczenie | Skutek |
| --- | --- | --- |
| **ΔT<sub>c</sub>**, osiowa zmiana temperatury | ta sama zmiana w całym przekroju | wydłużenie $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | zmiana temperatury włókien dolnych minus górnych | krzywizna $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Obie wartości to *zmiany* temperatury względem stanu bez naprężeń, domyślnie w °C; zmiana o 1 °C to 1 K. Obciążenia termiczne korzystają ze współczynnika **α** materiału i **wysokości h** przekroju. Włókna **dolne** leżą po stronie linii przerywanej. Dodatnie ΔT<sub>b</sub> − ΔT<sub>t</sub> (cieplej na dole) wydłuża włókna dolne, więc element ugina się jak belka pod obciążeniem grawitacyjnym.

W konstrukcji statycznie wyznaczalnej temperatura wywołuje tylko przemieszczenia. Więzy (utwierdzone końce, ciągłość, pręty nadliczbowe) zamieniają ją w siły przekrojowe. Ta sama stalowa belka o rozpiętości 6 m i wysokości 0,3 m, na dole o 20 K cieplejsza niż na górze:

::div{.shots}

:::model-figure{caption="Belka swobodnie podparta: w środku rozpiętości ugina się o 3,6 mm, M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="Belka obustronnie utwierdzona: pozostaje prosta, M = −14,04 kNm na całej długości"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

Ręcznie: swobodna krzywizna wynosi $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0{,}3 = 8 \times 10^{-4}\ \text{1/m}$. Belka swobodnie podparta przyjmuje ją bez przeszkód i ugina się o $\kappa L^2/8 = 3{,}6\ \text{mm}$. Przy utwierdzonych końcach musi ją zniwelować stały moment: $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14{,}04\ \text{kNm}$. Inny przypadek rozwiązuje strona [Sprawdzanie wyników ręcznie](/pl/guide/verification#temperature-gradient-on-a-simply-supported-beam).

## Edycja i usuwanie obciążeń {#editing-and-removing-loads}

| Aby | Zrób tak |
| --- | --- |
| Szybko zmienić wartości | Edytuj składowe (i pole LCS) bezpośrednio w zakładce *Obciążenia*. |
| Otworzyć okno edycji | Kliknij dwukrotnie obciążenie w widoku albo kliknij je → **Edytuj obciążenie**. Obciążenia pojawiają się też jako plakietki w tabelach *Węzły* i *Elementy*; kliknij plakietkę, aby je edytować. |
| Usunąć je | Zaznacz je i naciśnij <kbd>Delete</kbd>, kliknij je → **Usuń** albo użyj × w zakładce *Obciążenia*. |

Obciążenia należą do swojego węzła lub elementu: usunięcie węzła lub elementu usuwa je, a gdy kopiujesz węzeł lub element razem z zaznaczonymi obciążeniami, kopiują się także one.

![Zakładka Obciążenia: jeden wiersz na obciążenie, ze składowymi edytowalnymi bezpośrednio w tabeli](/screenshots/pl/loads-table.webp)

## Czego nie ma {#what-is-not-available}

::div{.limits}
- **Jeden przypadek obciążenia.** Nie ma kombinacji: zapisz każdy przypadek jako osobny plik lub link.
- **Brak ciężaru własnego.** Dodaj go jako obciążenie równomierne z odznaczonym LCS: $f_z = \rho\,g\,A$, np. $\approx 0{,}22\ \text{kN/m}$ dla IPE 200.
- **Obciążenia trapezowe tylko w osiach lokalnych.** Zmienne obciążenie pionowe na pręcie nachylonym wpisz za pomocą jego [składowych lokalnych](#trapezoidal-load).
- **Brak obciążeń liniowych na części elementu.** Obciążenie liniowe obejmuje cały element: dodaj węzeł tam, gdzie się zaczyna lub kończy.
::
