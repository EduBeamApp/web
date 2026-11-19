---
description: "Wyniki w EduBeamie: wykresy N, V i M, postać odkształcona i reakcje, ich znaki, podpowiedzi, tabele wyników, eksport CSV, macierz sztywności i format liczb."
source: site
---

# Wyniki i wykresy

[EduBeam]{.edubeam} rozwiązuje model po każdej zmianie, więc wykresy, reakcje i tabele na ekranie zawsze dotyczą modelu, który widzisz. Nie ma przycisku *Oblicz*. Jeśli nic nie jest rysowane, modelu nie da się jeszcze rozwiązać: komunikat w lewym górnym rogu widoku mówi dlaczego, a każdy komunikat objaśnia strona [Rozwiązywanie problemów](/pl/reference/troubleshooting).

## Wykresy w widoku {#overlays-in-the-viewer}

Wyniki są rysowane na modelu. Włączasz je i wyłączasz w **opcjach wyświetlania** w prawym górnym rogu widoku; przycisk ⚙ nad nimi pokazuje lub ukrywa panel.

::model-figure{caption="Rama trójprzegubowa, 10 kN/m: przełączaj między M, V, N i postacią odkształconą"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, V, N, w]
show: [nodeLabels]
height: 300
---
::

| Przełącznik | Rysuje | Kolor | Na początku włączony |
| --- | --- | --- | --- |
| **Kształt odkształcony** | przemieszczoną konstrukcję, w powiększeniu, aby była widoczna | szary | tak |
| **N (x)** | siłę normalną | niebieski | |
| **V<sub>z</sub> (x)** | siłę tnącą | zielony | |
| **M<sub>y</sub> (x)** | moment zginający | czerwony | tak |
| **Reakcje** | strzałkę i wartość dla każdego zablokowanego kierunku | fioletowy | tak |

Drugi rząd przełącza elementy samego rysunku: **Podpory**, **Obciążenia**, **Etykiety węzłów** i **Etykiety elementów**. **Więcej ustawień** pod panelem otwiera [ustawienia widoku](/pl/essentials/units-settings#viewer-settings), gdzie ustawisz wielkość wykresów (*Skala wyników*), kolory, orientację etykiet i styl wykresów.

Wartości są opisywane tam, gdzie mają znaczenie: na końcach każdego pręta, po obu stronach skoku pod siłą skupioną lub nad podporą oraz w każdym ekstremum wykresu, np. w wierzchołku paraboli, gdzie $V = 0$. Rysunek powyżej pokazuje [ramę trójprzegubową](/pl/tutorials/three-hinged-frame), którą możesz sprawdzić ręcznie: 40 kN ściskania w każdym słupie, 20 kN w ryglu i −80 kNm w obu narożach. Widok *w* pokazuje, że przegub w C obniża się o 42,55 mm.

### Odczytywanie znaku {#reading-the-sign}

Znak odczytuj z **wartości**, a nie z tego, po której stronie pręta narysowano wykres. Konwencje są takie jak w większości podręczników:

| Wynik | Wartość dodatnia oznacza |
| --- | --- |
| **N** | rozciąganie |
| **V<sub>z</sub>** | siłę, która obraca krótki odcinek pręta zgodnie z ruchem wskazówek zegara. Ponieważ $V = \mathrm{d}M/\mathrm{d}x$, w belce swobodnie podpartej pod obciążeniem grawitacyjnym jest dodatnia przy lewej podporze i ujemna przy prawej |
| **M<sub>y</sub>** | moment dodatni: rozciąga włókna dolne, po stronie **linii przerywanej** rysowanej wzdłuż każdego pręta |

Belka ze wspornikiem pokazuje oba znaki jednocześnie. Między podporami moment jest dodatni (+13,5 kNm), nad prawą podporą ujemny (−24 kNm), z rozciąganiem u góry. Siła tnąca skacze w B o wartość reakcji 54 kN, z −30 do +24 kN:

::model-figure{caption="Belka ze wspornikiem, 12 kN/m: moment dodatni między podporami, ujemny nad B"}
---
nodes: { A: [0, 0], B: [4, 0], C: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

Domyślnie moment zginający jest rysowany po **stronie rozciąganej**, a dodatnie siły normalne i tnące po stronie przeciwnej do linii przerywanej. Na różnych uczelniach robi się to różnie, dlatego każdą z tych stron można odwrócić w **Ustawienia → Ustawienia widoku → Wykresy sił wewnętrznych**, gdzie możesz też kreskować wykresy jak przy rysowaniu ręcznym i opisać każdy przedział stopniem wielomianu. Odwrócenie strony zmienia tylko rysunek, nigdy wartości. Pełne konwencje znaków, łącznie z osiami lokalnymi elementu, opisuje strona [Układ współrzędnych i konwencje znaków](/pl/elements/conventions#internal-forces) w podręczniku teoretycznym.

## Podpowiedzi po najechaniu {#hover-tooltips}

Najedź kursorem na obiekt, aby odczytać jego wartości:

- **Węzeł**: przemieszczenia $u_x$, $u_z$ (w jednostce przemieszczenia) i obrót $\varphi_y$ (w radianach).
- **Element**: etykieta, przekrój i materiał.
- **Obciążenie**: składowe.

Na ekranie dotykowym stuknij obiekt: te same szczegóły pokaże jego panel.

![Najechanie kursorem na węzeł 2 belki ze strony Szybki start](/screenshots/pl/ui-hover.webp){.shot-sm}

## Zakładka Wyniki {#results-tab}

Zakładka **Wyniki** na dolnym pasku zawiera dwie tabele, przełączane przyciskami **Wyniki węzłowe** i **Wyniki elementów**.

### Wyniki węzłowe {#nodal-results}

Jeden wiersz na węzeł, z jego przemieszczeniami **D<sub>x</sub>** i **D<sub>z</sub>** (w jednostce przemieszczenia) i obrotem **R<sub>y</sub>** (w radianach), w osiach globalnych: dodatnie D<sub>z</sub> to przemieszczenie w dół, a dodatnie R<sub>y</sub> to obrót przeciwnie do ruchu wskazówek zegara na ekranie. W podpartym kierunku tabela pokazuje 0 albo zadane osiadanie. Reakcji w tej tabeli nie ma: odczytaj je z rysunku albo z [eksportu CSV](#export-csv-and-copy).

![Wyniki węzłowe ramy trójprzegubowej z rysunku powyżej, z formatem liczb Automatyczny](/screenshots/pl/p2c-results-nodal.webp){.shot-lg}

### Wyniki elementów {#element-results}

Jeden wiersz na element, z jego **siłami przywęzłowymi w lokalnym układzie współrzędnych elementu**:

| Kolumna | Znaczenie |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | siła osiowa, siła tnąca i moment działające na element w jego węźle **początkowym** |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | to samo w węźle **końcowym** |

![Wyniki elementów ramy trójprzegubowej: siły przywęzłowe jej czterech prętów](/screenshots/pl/p2c-results-element.webp)

Siły przywęzłowe to siły, jakimi węzły działają na element. Ich znaki wynikają z osi lokalnych, a nie z konwencji N-V-M wykresów, więc są inne:

- **Belka swobodnie podparta** (6 m, 12 kN/m, ze strony [Szybki start](/pl/guide/quick-start)): Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. Obie podpory pchają belkę w górę, czyli w kierunku −z.
- **Wspornik** utwierdzony w węźle początkowym, z siłą 18 kN w dół na swobodnym końcu: Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **Słup 1 ramy** (A na dole, B na górze): X<sub>12</sub> = +40 kN pcha wzdłuż lokalnej osi x w głąb elementu, co oznacza ściskanie siłą 40 kN.

Więcej o tej tabeli mówi strona [Układ współrzędnych i konwencje znaków](/pl/elements/conventions#end-forces-element-results-table).

### Eksport CSV i kopiowanie {#export-csv-and-copy}

**Eksportuj CSV** pobiera plik `edubeam-results.csv` z obiema tabelami, w jednostkach wyświetlanych na ekranie, gotowy do otwarcia w arkuszu kalkulacyjnym. **Kopiuj** umieszcza te same tabele w schowku jako tekst rozdzielany tabulatorami, który wkleja się bezpośrednio do Excela, LibreOffice lub Arkuszy Google.

| Tabela | Kolumny |
| --- | --- |
| Węzły | Node, x, z, Dx, Dz, Ry oraz **reakcje** Rx, Rz, My |
| Elementy | Element, Node 1, Node 2 oraz siły przywęzłowe N1, V1, M1, N2, V2, M2 |

Każdy nagłówek zawiera jednostkę, np. `Dz [mm]`. Siły przywęzłowe elementów to te same wartości lokalne co X<sub>12</sub> … M<sub>21</sub> na ekranie.

### Macierz sztywności {#stiffness-matrix}

Polecenie **Macierz sztywności** w panelu elementu albo przycisk w jego wierszu tabeli *Elementy* otwiera macierz sztywności elementu 6 × 6 w **układzie globalnym** i jednostkach SI (N, m). Przydaje się do sprawdzania ręcznej agregacji na zajęciach z metody przemieszczeń; wzory znajdziesz na stronie [Element belkowy](/pl/elements/beam) w podręczniku teoretycznym.

## Format liczb {#number-format}

Tabele i podpowiedzi pokazują wyniki z pięcioma cyframi znaczącymi. **Ustawienia → Język i ustawienia regionalne → Format liczb** decyduje, jak są zapisywane:

| Format | 40 000 zapisane jako | Do czego |
| --- | --- | --- |
| **Naukowy** (domyślny) | 4 · 10⁴ | wartości obejmujące wiele rzędów wielkości |
| **Inżynierski** | 40 · 10³ | odczytywanie przedrostków kilo i mega |
| **Automatyczny** | 40 000 | zwykłe liczby na zajęciach |

Format *Automatyczny* zapisuje wartości od 0,001 do 100 000 jako zwykłe liczby. Poza tym zakresem zapisuje je tak jak *Inżynierski*, z potęgami dziesięciu o wykładniku podzielnym przez trzy, np. 380,95 · 10⁻⁹ w wynikach węzłowych powyżej. Separator dziesiętny zależy od języka.

Etykiety na rysunku (wartości na wykresach i reakcje) mają zawsze dwa miejsca po przecinku, niezależnie od formatu liczb: 6,6667 kN jest opisane jako 6,67. Gdy potrzebujesz więcej cyfr, odczytaj je z tabel lub podpowiedzi.

## Precyzja i dokładność {#precision-and-accuracy}

- Element belkowy jest dokładny dla liniowego modelu Timoszenki pod obciążeniami węzłowymi, równomiernymi, trapezowymi, skupionymi i termicznymi. Wyniki **nie** zależą od liczby elementów i nie ma siatki do zagęszczania.
- Obliczenia są prowadzone w podwójnej precyzji. Wartość mniejsza niż bilionowa część największej wartości tego samego rodzaju to błąd zaokrąglenia i tabele pokazują ją jako 0.
- Ugięcia uwzględniają **odkształcenie postaciowe**, a w konstrukcji statycznie niewyznaczalnej nieznacznie zmienia ono także siły. Dla prętów smukłych dodaje ułamek procenta do ugięcia według teorii Eulera–Bernoulliego; dla prętów krótkich i wysokich może sięgać dziesięciu procent i więcej. Strona [Sprawdzanie wyników ręcznie](/pl/guide/verification#shear-deformation) pokazuje, jak duży jest ten wpływ i jak go wyłączyć przy porównaniu ze wzorami podręcznikowymi.

## Wyniki w sprawozdaniu {#results-in-a-report}

- **☰ → Eksportuj obraz** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) zapisuje rysunek jako PNG lub SVG z wybranymi wykresami. Zob. [Eksport obrazu](/pl/essentials/import-export#export-an-image).
- **Eksportuj CSV** lub **Kopiuj** w zakładce Wyniki dają wartości liczbowe.
- **Udostępnij model** daje link, dzięki któremu czytelnik może otworzyć sam model.
- Do materiałów do wykładu i zestawów zadań biblioteka graficzna [@edubeam/plot](/pl/plot) rysuje te same wykresy z kodu.
