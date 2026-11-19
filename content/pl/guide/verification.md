---
description: "EduBeam sprawdzony wzorami z podręcznika: belki, kratownica, temperatura, osiadanie podpory i to, czym belka Timoszenki różni się od belki Eulera–Bernoulliego."
source: site
---

# Sprawdzanie wyników ręcznie

Nie ufaj liczbie, której nie potrafisz choćby w przybliżeniu odtworzyć. Na tej stronie rozwiązujemy ręcznie klasyczne przypadki z podręczników i porównujemy je z wynikami aplikacji [EduBeam]{.edubeam}, które zgadzają się z nimi co do każdej pokazanej cyfry. Tabele podają pięć cyfr znaczących, tak jak zakładka *Wyniki* w aplikacji; etykiety na rysunkach są zaokrąglone do czterech. Każdy rysunek jest obliczany na żywo w Twojej przeglądarce; przycisk **Otwórz w EduBeamie** wczytuje ten sam model do aplikacji, gdzie odczytasz tabele, zmienisz wartość i zobaczysz, co się stanie.

::div{.chips}
- [Belka swobodnie podparta](#simply-supported-beam-uniform-load)
- [Wspornik](#cantilever-tip-load)
- [Belka obustronnie utwierdzona](#fixed–fixed-beam-uniform-load)
- [Belka jednostronnie utwierdzona](#propped-cantilever-uniform-load)
- [Kratownica z dwóch prętów](#two-bar-truss)
- [Temperatura](#temperature-gradient-on-a-simply-supported-beam)
- [Osiadanie podpory](#prescribed-displacement)
- [Odkształcenie postaciowe](#shear-deformation)
::

Całe konstrukcje, rozwiązane od początku do końca, znajdziesz w samouczkach [Rama trójprzegubowa](/pl/tutorials/three-hinged-frame) i [Kratownica płaska](/pl/tutorials/truss). Nowe zadania do rozwiązania ręcznie, z odpowiedziami sprawdzanymi na bieżąco, znajdziesz na stronie [Zadania ze statyki](/pl/practice).

## Przekrój użyty na tej stronie {#the-section-used-here}

O ile nie zaznaczono inaczej, we wszystkich przypadkach przyjęto stalową belkę z przykładów w aplikacji: $E = 210$ GPa i $I_y = 8356$ cm⁴ (IPE 300), zatem

$$
EI = 210 \times 10^9 \cdot 8{,}356 \times 10^{-5} = 17\,547{,}6\ \text{kNm}^2
$$

Pole przekroju ($A = 1$ m²) i współczynnik ścinania ($k = 10^{32}$) są tak duże, że odkształcenia osiowe i postaciowe znikają, więc wyniki dokładnie odpowiadają wzorom dla belki Eulera–Bernoulliego z Twojego podręcznika.

::callout{type="info" title="Belki w EduBeamie to belki Timoszenki"}
Przy rzeczywistym przekroju, np. z biblioteki przekrojów, pręty odkształcają się także od ścinania. Ugięcia wychodzą wtedy nieco większe, niż dają wzory dla belki Eulera–Bernoulliego, a w konstrukcji statycznie niewyznaczalnej nieco zmieniają się też siły przekrojowe. Sekcja [Odkształcenie postaciowe](#shear-deformation) na końcu tej strony pokazuje, o ile, i wyjaśnia, jak je wyłączyć.
::

W zakładce *Wyniki* przemieszczenia i kąty obrotu są podane w [osiach globalnych](/pl/elements/conventions#global-axes): dodatnie D<sub>z</sub> jest skierowane w dół, dodatnie R<sub>y</sub> przeciwnie do ruchu wskazówek zegara, a przemieszczenia są w metrach, chyba że zmienisz jednostkę w ustawieniach (zob. [Jednostki i ustawienia](/pl/essentials/units-settings)).

## Belka swobodnie podparta, obciążenie równomierne {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, podpora przegubowa nieprzesuwna w A i przesuwna w B. Węzeł C w środku rozpiętości pozwala odczytać tam ugięcie; podział pręta węzłem nie zmienia żadnego wyniku.

::model-figure{caption="Belka swobodnie podparta, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Wielkość | Wzór | Wartość |
| --- | --- | --- |
| Reakcje | $qL/2$ | 36 kN |
| Siła tnąca przy podporach | $\pm qL/2$ | +36 kN w A, −36 kN w B |
| Moment w środku rozpiętości | $qL^2/8$ | 54 kNm |
| Kąt obrotu w A | $qL^3/(24EI)$ | 0,0061547 rad, zgodnie z ruchem wskazówek zegara |
| Ugięcie w C | $5qL^4/(384EI)$ | 11,540 mm, w dół |

EduBeam pokazuje te same wartości. W zakładce *Wyniki* węzeł A ma R<sub>y</sub> = −0,0061547 rad (ujemny: zgodnie z ruchem wskazówek zegara), a węzeł C ma D<sub>z</sub> = 0,01154 m (dodatnie: w dół).

## Wspornik, siła na końcu {#cantilever-tip-load}

$L = 4$ m, utwierdzenie w A, siła $F = 18$ kN skierowana w dół na swobodnym końcu B.

::model-figure{caption="Wspornik, 18 kN na końcu"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Wielkość | Wzór | Wartość |
| --- | --- | --- |
| Reakcja pionowa | $F$ | 18 kN |
| Moment utwierdzenia | $FL$ | 72 kNm, ujemny: M = −72 kNm |
| Kąt obrotu końca | $FL^2/(2EI)$ | 0,0082063 rad, zgodnie z ruchem wskazówek zegara |
| Ugięcie końca | $FL^3/(3EI)$ | 21,883 mm, w dół |

W zakładce *Wyniki* węzeł B ma R<sub>y</sub> = −0,0082063 rad i D<sub>z</sub> = 0,021883 m.

## Belka obustronnie utwierdzona, obciążenie równomierne {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, oba końce utwierdzone. Ta belka jest statycznie niewyznaczalna, więc rozwiązanie zależy od sztywności; wzory wynikają z warunku zgodności przemieszczeń: kąty obrotu obu końców są równe zeru.

::model-figure{caption="Belka obustronnie utwierdzona, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Wielkość | Wzór | Wartość |
| --- | --- | --- |
| Reakcje | $qL/2$ | 36 kN |
| Momenty podporowe | $qL^2/12$ | 36 kNm, ujemne: M = −36 kNm |
| Moment w środku rozpiętości | $qL^2/24$ | 18 kNm, dodatni |
| Ugięcie w C | $qL^4/(384EI)$ | 2,3080 mm, w dół |

Utwierdzenie końców przesuwa cały wykres momentów o $qL^2/12$: różnica między podporą a środkiem rozpiętości nadal wynosi $qL^2/8 = 54$ kNm, tak jak w belce swobodnie podpartej. Aby to zobaczyć w aplikacji, zacznij od modelu belki swobodnie podpartej i zmień obie podpory na **Utwierdzenie**.

## Belka jednostronnie utwierdzona, obciążenie równomierne {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m, utwierdzenie w A i podpora przesuwna w B.

::model-figure{caption="Belka jednostronnie utwierdzona, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Wielkość | Wzór | Wartość |
| --- | --- | --- |
| Reakcja w utwierdzeniu | $5qL/8$ | 45 kN |
| Reakcja na podporze przesuwnej | $3qL/8$ | 27 kN |
| Moment utwierdzenia | $qL^2/8$ | 54 kNm, ujemny: M = −54 kNm |
| Największy moment dodatni | $9qL^2/128$ | 30,375 kNm |
| … w miejscu, gdzie $V = 0$ | $x = 5L/8$ | 3,75 m od A |
| Kąt obrotu w B | $qL^3/(48EI)$ | 0,0030773 rad, przeciwnie do ruchu wskazówek zegara |

EduBeam opisuje każde ekstremum wykresu, więc maksimum momentu dodatniego jest zaznaczone tam, gdzie występuje. Jego położenie wyznaczysz z miejsca zerowego siły tnącej: $V(x) = 45 - 12x = 0$ daje $x = 3{,}75$ m.

## Kratownica z dwóch prętów {#two-bar-truss}

Dwa pręty wychodzą z podpór przegubowych nieprzesuwnych w A $(0, 0)$ i B $(4, 0)$ i zbiegają się w wierzchołku C $(2, -2)$, 2 m wyżej. Oba końce obu prętów mają zaznaczone **przeguby końcowe**, więc pręty przenoszą tylko siłę osiową. W C działa pionowa siła $F = 20$ kN skierowana w dół.

::model-figure{caption="Kratownica z dwóch prętów, 20 kN w wierzchołku"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

Każdy pręt jest nachylony pod kątem 45°. Z symetrii oba pręty przenoszą tę samą siłę, więc równowaga sił pionowych w węźle C daje:

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14{,}142\ \text{kN}
\end{aligned}
$$

Oba pręty są **ściskane**. Każda podpora przejmuje 10 kN pionowo i 10 kN poziomo, skierowane do środka: pręty rozpychają podpory. Wykres **N (x)** i reakcje pokazują to samo.

## Różnica temperatur w belce swobodnie podpartej {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0{,}3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. Górna powierzchnia belki ogrzewa się o 5 K, a dolna ochładza o 5 K, więc $\Delta T_b - \Delta T_t = -10$ K, a temperatura osi się nie zmienia ($\Delta T_c = 0$). Belka swobodnie podparta może się bez przeszkód wyginać, więc **nie powstają siły przekrojowe**, tylko krzywizna:

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0{,}3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

Włókna górne się wydłużają, a dolne skracają, więc belka wygina się **w górę**:

::model-figure{caption="Górna powierzchnia o 10 K cieplejsza od dolnej: belka wygina się w górę o 3,2 mm, bez sił przekrojowych"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| Wielkość | Wzór | Wartość |
| --- | --- | --- |
| Ugięcie w C | $\kappa L^2/8$ | 3,2 mm, w górę: D<sub>z</sub> = −0,0032 m |
| Kąt obrotu w A | $\kappa L/2$ | 0,0016 rad, przeciwnie do ruchu wskazówek zegara |
| Moment zginający |  | 0 |

Równomierna zmiana temperatury $\Delta T_c$ tylko wydłużyłaby belkę, na co pozwala podpora przesuwna, więc również nie wywołałaby sił.

Teraz zablokuj obrót na obu końcach (**Utwierdzenie** w A i **Utwierdzenie przesuwne** w B, które nadal pozwala belce się wydłużać). Krzywizna nie może powstać, a w jej miejsce na całej rozpiętości pojawia się stały moment:

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547{,}6 \cdot (-4 \times 10^{-4}) = 7{,}019\ \text{kNm}
\end{aligned}
$$

Moment jest dodatni: zablokowane włókna górne chcą się wydłużyć, więc są ściskane.

::model-figure{caption="Ta sama belka z zablokowanymi obrotami na obu końcach: stały moment 7,019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

Obciążenia termiczne wprowadza się tak, jak opisano na stronie [Obciążenia](/pl/essentials/loads#temperature-load); wysokość $h$ podajesz w danych [przekroju](/pl/essentials/elements#cross-sections).

## Osiadanie podpory {#prescribed-displacement}

Weź [belkę jednostronnie utwierdzoną](#propped-cantilever-uniform-load) bez obciążenia i pozwól, by podpora przesuwna w B osiadła o $w = 10$ mm. W EduBeamie jest to **zadane przemieszczenie** D<sub>z</sub> = 0,01 m w B. Aby wymusić to przemieszczenie, podpora musi pociągnąć koniec belki w dół, a to ją zgina:

::model-figure{caption="Belka jednostronnie utwierdzona, B osiada o 10 mm: podpora ciągnie w dół siłą 2,437 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| Wielkość | Wzór | Wartość |
| --- | --- | --- |
| Reakcja podpory przesuwnej | $R = 3EIw/L^3$ | 2,4372 kN, ciągnie w dół |
| Moment utwierdzenia | $RL$ | 14,623 kNm, ujemny: M = −14,623 kNm |
| Kąt obrotu w B | $3w/(2L)$ | 0,0025 rad, zgodnie z ruchem wskazówek zegara |

W odróżnieniu od obciążenia osiadanie wywołuje siły tylko tam, gdzie konstrukcja mu się przeciwstawia: tutaj im sztywniejsza belka, tym większe $R$. Belka swobodnie podparta przy takim samym osiadaniu przemieściłaby się jak ciało sztywne, bez żadnych sił.

Dodaj z powrotem obciążenie 12 kN/m, a wyniki się zsumują (zasada superpozycji): utwierdzenie przejmuje teraz $45 + 2{,}4372 = 47{,}437$ kN i $54 + 14{,}623 = 68{,}623$ kNm, a podpora przesuwna $27 - 2{,}4372 = 24{,}563$ kN. Jak wprowadzić osiadanie, opisuje strona [Obciążenia](/pl/essentials/loads#prescribed-displacements-support-settlements).

## Odkształcenie postaciowe {#shear-deformation}

Elementy belkowe EduBeamu to belki **Timoszenki**: oprócz ugięcia od zginania uginają się także od ścinania, o wartość zależną od sztywności przekroju na ścinanie $kGA$. Co to zmienia, zależy od konstrukcji:

- **Statycznie wyznaczalna**: reakcje i siły przekrojowe wynikają z samych warunków równowagi, więc pozostają dokładnie takie same. Rosną tylko przemieszczenia. W belce swobodnie podpartej i we wsporniku kąty obrotu przekrojów również się nie zmieniają; gdzie indziej, np. na końcu wspornika belki ze wspornikiem, zmieniają się nieznacznie.
- **Statycznie niewyznaczalna**: siły zależą od sztywności, więc one również nieznacznie się zmieniają.

### Belka swobodnie podparta {#shear-simply-supported}

Ile to wynosi, pokazuje belka ze [Szybkiego startu](/pl/guide/quick-start#_8-check-by-hand). To powyższa belka swobodnie podparta z rzeczywistym przekrojem **IPE 200 (przybl.)** z biblioteki przekrojów: $I_y = 1943$ cm⁴, $A = 28{,}48$ cm² i współczynnik ścinania $k = 0{,}3933$ (udział środnika w polu przekroju), przy $G = 81$ GPa. Zatem $EI = 4080{,}3$ kNm² i $kGA = 90\,720$ kN.

| Wielkość | Wzór | Wartość |
| --- | --- | --- |
| Kąt obrotu na podporze | $qL^3/(24EI)$ | 0,026469 rad |
| Ugięcie w środku rozpiętości, od zginania | $5qL^4/(384EI)$ | 49,629 mm |
| Ugięcie w środku rozpiętości, od ścinania | $qL^2/(8kGA)$ | 0,59524 mm |
| Ugięcie w środku rozpiętości, łącznie | suma | 50,224 mm, tak jak w EduBeamie |

Część od ścinania to 1,2 % całości. Kąt obrotu na podporze ma wartość jak dla belki Eulera–Bernoulliego, tak samo jak reakcje i momenty.

### Wspornik: krótkie pręty {#shear-cantilever}

Swobodny koniec wspornika obciążonego siłą $F$ ugina się o $FL^3/(3EI)$ od zginania i o $FL/(kGA)$ od ścinania. Ich stosunek wynosi

$$
\frac{\text{ścinanie}}{\text{zginanie}} = \frac{3EI}{kGA\,L^2}
$$

Dla tego samego IPE 200 jest to 0,84 % przy wsporniku o długości 4 m, ale 13,5 % przy wsporniku o długości 1 m: odkształcenie postaciowe ma znaczenie w krótkich, wysokich prętach.

### Belka jednostronnie utwierdzona: siły się zmieniają {#shear-propped-cantilever}

[Belka jednostronnie utwierdzona](#propped-cantilever-uniform-load) z IPE 200 jest statycznie niewyznaczalna, a podpora przesuwna przejmuje teraz nieco więcej. Przy $\beta = 3EI/(kGA\,L^2) = 0{,}0037481$ dla $L = 6$ m warunek zgodności przemieszczeń na podporze przesuwnej daje

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27{,}034\ \text{kN}
$$

zamiast 27 kN, a moment utwierdzenia maleje z 54 do $qL^2/2 - R_B L = 53{,}798$ kNm. Tutaj to niewiele, ale różnica rośnie wraz z $\beta$, czyli w krótkich, wysokich prętach.

### Porównanie z belką Eulera–Bernoulliego {#shear-switch-off}

Aby porównać wyniki ze wzorami dla belki Eulera–Bernoulliego, ustaw **Współczynnik ścinania** przekroju na bardzo dużą wartość, np. `1e10`. Część od ścinania wtedy znika i wszystkie przypadki na tej stronie znowu się zgadzają. Sformułowanie elementu opisuje strona [Element belkowy](/pl/elements/beam) w podręczniku teoretycznym.

## Wskazówki do własnych sprawdzeń {#tips-for-your-own-checks}

- Miej na oku **plakietkę jednostek** w prawym dolnym rogu widoku; większość rozbieżności to pomyłki w jednostkach.
- Dokładne liczby odczytuj z zakładki **Wyniki** i z podpowiedzi po najechaniu kursorem, a nie z etykiet na wykresach. Przyciski **Eksportuj CSV** i **Kopiuj** dają też reakcje, gotowe do wklejenia w arkusz kalkulacyjny. Zobacz [Wyniki i wykresy](/pl/essentials/results#results-tab).
- Ustaw w Ustawieniach **Format liczb** na *Automatyczny*, aby odczytywać `40` zamiast `4 · 10¹`.
- Używaj okna **Macierz sztywności**, aby podczas nauki metody przemieszczeń porównać macierz pojedynczego elementu ze stroną [Element belkowy](/pl/elements/beam).
- Użyj **Udostępnij model**, aby przekazać sprawdzony model koledze lub prowadzącemu.
- Aby sprawdzić wiele przypadków naraz albo wygenerować zadania ze znanymi odpowiedziami, użyj tego samego solvera we własnym kodzie: [@edubeam/fem](/pl/solver) to biblioteka, która oblicza każdą liczbę w aplikacji.
