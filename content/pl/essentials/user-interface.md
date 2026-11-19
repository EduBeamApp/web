---
description: "Mapa interfejsu EduBeamu: pasek aplikacji i menu ☰, widok z przyciskami i opcjami wyświetlania, zaznaczanie i edycja, tabele dolnego paska i wpisywanie wartości."
source: site
---

# Interfejs użytkownika

[EduBeam]{.edubeam} składa się z trzech stref: u góry jest **pasek aplikacji**, pośrodku **widok**, w którym rysujesz, a na dole **dolny pasek** z tabelą dla każdego rodzaju obiektów. Wszystko, co zrobisz w widoku, możesz zrobić także w tabelach – i odwrotnie.

![Części interfejsu, ponumerowane jak na liście poniżej](/screenshots/pl/ui-overview.webp)

1. **Menu ☰**: otwieranie, zapisywanie, udostępnianie i eksport; przykłady i oprowadzanie po aplikacji.
2. **Wyczyść model** i **Udostępnij model**.
3. **Cofnij** i **Ponów**.
4. **Przyciski widoku**: wyśrodkowanie, dopasowanie do ekranu i opcje wyświetlania.
5. **Opcje wyświetlania**: które wyniki i części modelu są rysowane.
6. **Siatka, przyciąganie, celownik i jednostki.**
7. **Zakładki dolnego paska**: Węzły, Elementy, Obciążenia, Materiały, Przekroje, Wyniki.
8. **Tabela** otwartej zakładki, w której możesz edytować każdą wartość.

::callout{type="tip" title="Daj się oprowadzić"}
**☰ → Oprowadź mnie** pokazuje te części po kolei, bezpośrednio w aplikacji.
::

## Pasek aplikacji {#app-bar}

- **☰** otwiera menu główne, opisane niżej.
- **Wyczyść model** po potwierdzeniu usuwa wszystkie węzły, elementy i obciążenia; zaznacz **Usuń materiały** lub **Usuń przekroje**, aby usunąć także je. <kbd>Ctrl</kbd>+<kbd>Z</kbd> przywraca model, a ponadto model trafia na listę *Ostatnie modele*.
- **Udostępnij model** otwiera [okno udostępniania](/pl/essentials/import-export#share-a-link) z linkiem, który zawiera cały model.
- **Co nowego?** pokazuje informacje o wydaniu. Po aktualizacji otwierają się też same, jeden raz.
- **Dokumentacja** otwiera ten przewodnik, a ikona GitHuba – kod źródłowy.

Na telefonie mieszczą się tylko ☰ i **Dokumentacja**; **Wyczyść model** i **Udostępnij model** znajdziesz w menu.

### Menu ☰ {#the-☰-menu}

![Menu ☰](/screenshots/pl/ui-app-menu.webp){.shot-xs}

- **Otwórz projekt** i **Zapisz projekt** otwierają lub pobierają plik `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>).
- **Ostatnie modele** przechowują 10 modeli, które ostatnio wyczyściłeś lub zastąpiłeś, i pozwalają je przywrócić.
- **Eksportuj obraz** zapisuje rysunek jako PNG lub SVG albo kopiuje go do schowka (<kbd>Ctrl</kbd>+<kbd>P</kbd>).
- **Przykłady** to galeria gotowych modeli; **Narysuj pierwszą belkę** to zadanie z przewodnikiem w siedmiu krokach; **Oprowadź mnie** oprowadza po interfejsie.
- **Udostępnij model** i **Wyczyść model** działają tak samo jak przyciski na pasku aplikacji.

Na dole menu widać wersję aplikacji i datę jej wydania. Otwieranie, zapisywanie, udostępnianie i eksport opisuje strona [Pliki, linki i eksport](/pl/essentials/import-export).

## Widok {#viewer}

Płótno, na którym rysujesz i oglądasz model. Wyniki przeliczają się po każdej zmianie, więc nie szukaj przycisku *Oblicz* – nie ma go.

### Przyciski na płótnie {#buttons-on-the-canvas}

**Lewy górny róg: Cofnij i Ponów** cofają i ponawiają każdą zmianę modelu: dodanie, edycję, przeciągnięcie, usunięcie, wyczyszczenie (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>).

**Prawy górny róg:**

- **Zaznaczanie prostokątem**, na urządzeniu z ekranem dotykowym: następne przeciągnięcie palcem zaznacza prostokąt.
- **Wyśrodkuj widok** przesuwa model na środek bez zmiany powiększenia (<kbd>C</kbd>); **Dopasuj do ekranu** dobiera powiększenie tak, aby był widoczny cały model (<kbd>F</kbd>).
- **⚙** pokazuje lub ukrywa [opcje wyświetlania](#display-options).

**Prawy dolny róg:**

![Przyciski siatki, przyciągania, celownika i jednostek](/screenshots/pl/ui-grid-units.webp){.shot-sm}

- **G** pokazuje lub ukrywa siatkę i linijki (<kbd>G</kbd>); **S** włącza lub wyłącza przyciąganie do siatki (<kbd>S</kbd>).
- Przycisk **celownika** zaznacza położenie kursora na linijkach (tylko przy pracy myszą).
- **Plakietka jednostek** otwiera ustawienia w sekcji [Język i ustawienia regionalne](/pl/essentials/units-settings#language-locale).

### Opcje wyświetlania {#display-options}

Przycisk ⚙ otwiera dwa rzędy pól wyboru. Pierwszy określa, które wyniki są rysowane na modelu: *Kształt odkształcony*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)* i *Reakcje*; na początku włączone są postać odkształcona, moment zginający i reakcje. Drugi pokazuje lub ukrywa części modelu: *Podpory*, *Obciążenia*, *Etykiety węzłów* i *Etykiety elementów*; na początku wszystkie są włączone.

![Przyciski widoku i opcje wyświetlania](/screenshots/pl/ui-display-settings.webp){.shot-lg}

**Więcej ustawień** otwiera [ustawienia widoku](/pl/essentials/units-settings#viewer-settings): rozmiary, kolory i sposób rysowania wykresów. Co pokazuje każdy z wyników, wyjaśnia strona [Wyniki i wykresy](/pl/essentials/results#overlays-in-the-viewer).

### Nawigacja {#navigating}

| Czynność | Mysz i klawiatura | Dotyk |
| --- | --- | --- |
| Powiększanie | Kółko myszy, w stronę kursora; na gładziku rozsunięcie palców lub przewijanie dwoma palcami | Rozsunięcie lub zsunięcie palców |
| Przesuwanie | Przeciąganie prawym przyciskiem lub wciśniętym kółkiem; który z nich, wybierasz w sekcji [Sterowanie i skróty](/pl/essentials/units-settings#controls-shortcuts) | Przeciąganie jednym palcem |
| Dopasowanie, wyśrodkowanie | <kbd>F</kbd>, <kbd>C</kbd> lub przyciski w prawym górnym rogu | Przyciski w prawym górnym rogu |

<kbd>Ctrl</kbd>+<kbd>+</kbd> i <kbd>Ctrl</kbd>+<kbd>-</kbd> powiększają i pomniejszają rysunek względem jego środka, przy każdym układzie klawiatury. Nigdy nie skalują całego interfejsu, jak zrobiłoby to powiększenie przeglądarki.

### Zaznaczanie i edycja {#selecting-and-editing}

| Aby | Zrób tak |
| --- | --- |
| Zaznaczyć jeden obiekt | Kliknij węzeł, element, obciążenie lub linię wymiarową. Obok otworzy się panel z akcjami: dodanie obciążenia, ustawienie podpór, edycja, wyświetlenie macierzy sztywności, usunięcie. Dolny pasek przełączy się na odpowiednią zakładkę. |
| Zaznaczyć kilka obiektów | Przeciągnij prostokąt po pustym płótnie (na ekranie dotykowym najpierw naciśnij **Zaznaczanie prostokątem**). Zaznaczysz w ten sposób wszystkie węzły wewnątrz prostokąta i wszystkie elementy, których on dotyka, razem z ich obciążeniami i liniami wymiarowymi. <kbd>Ctrl</kbd>+<kbd>A</kbd> zaznacza wszystko. |
| Usunąć, skopiować, wkleić | <kbd>Delete</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>. Wklejona kopia podąża za kursorem, dopóki nie klikniesz; możesz też wpisać przesunięcie Δx, Δz w pasku, który się pojawi. |
| Przesunąć węzeł | Przeciągnij go. Przy włączonym przyciąganiu trafi w punkt siatki; połączone elementy i obciążenia podążają za nim. |
| Edytować obciążenie | Kliknij je dwukrotnie. |
| Zobaczyć szczegóły | Najedź kursorem na dowolny obiekt, a pojawi się podpowiedź: przy węźle przemieszczenia i obrót, przy elemencie materiał i przekrój, przy obciążeniu jego wartości. Na ekranie dotykowym stuknij obiekt: to samo pokaże panel. |
| Otworzyć menu płótna | Kliknij płótno prawym przyciskiem myszy albo dotknij go i przytrzymaj na ekranie dotykowym. |

::div{.shots}

![Panel węzła: dodaj obciążenie, ustaw podpory, zadaj przemieszczenie](/screenshots/pl/ui-node-menu.webp)

![Po najechaniu kursorem na węzeł widać jego przemieszczenia i obrót](/screenshots/pl/ui-hover.webp)

::

**Menu płótna** zawiera *Dodaj węzeł*, *Dodaj element*, *Dodaj wymiar* (a nad elementem także *Wymiaruj element*), a dalej *Edytuj*, *Kopiuj*, *Wklej* i *Usuń* dla bieżącego zaznaczenia. Jeśli przy wyborze *Dodaj węzeł* lub *Dodaj element* przytrzymasz <kbd>Ctrl</kbd>, umieścisz je myszą zamiast przez okno dialogowe.

![Menu płótna](/screenshots/pl/ui-canvas-menu.webp){.shot-sm}

Wszystkie skróty i gesty zebrano na stronie [Klawiatura, mysz i dotyk](/pl/reference/shortcuts).

### Gdy modelu nie da się rozwiązać {#when-the-model-cannot-be-solved}

Komunikaty pojawiają się w lewym górnym rogu widoku:

| Komunikat | Znaczenie |
| --- | --- |
| *Nie zdefiniowano materiałów.*, *Nie zdefiniowano przekrojów.* | Dodaj materiał lub przekrój przyciskiem **Dodaj nowy** obok komunikatu. |
| Niebieska plakietka **Brak podpór** | Model jest po prostu niedokończony: potrzebuje więcej podpór. |
| Czerwony komunikat z przyciskiem **Pokaż szczegóły** | Coś jest nie tak. Szczegóły wymieniają każdy problem razem ze wskazówką. |
| Żółty komunikat | Model został rozwiązany, ale coś wygląda podejrzanie, np. węzeł, do którego nie jest podłączony żaden element. |

Gdy konstrukcja wciąż może się poruszać, EduBeam animuje ten ruch przerywanym zarysem i zakreśla węzły lub przeguby, które go umożliwiają. Najedź kursorem na komunikat, aby jeszcze raz zobaczyć ruch; przycisk z okiem go ukrywa.

![Rama z przegubami w B i C jest mechanizmem: EduBeam pokazuje, jak się porusza](/screenshots/pl/ui-mechanism.webp)

Każdy komunikat i sposób usunięcia problemu objaśnia strona [Rozwiązywanie problemów](/pl/reference/troubleshooting#messages).

## Dolny pasek {#bottom-bar}

Sześć zakładek, każda z paskiem narzędzi i edytowalną tabelą. Etykieta zakładki pokazuje, ile obiektów zawiera. Przeciągnij pasek zakładek w górę lub w dół, aby zmienić wysokość paska, albo zwiń go przyciskiem po prawej. Przycisk **?** obok objaśnia otwartą zakładkę, podobnie jak **?** przy niektórych nagłówkach kolumn.

| Zakładka | Pasek narzędzi | Kolumny tabeli |
| --- | --- | --- |
| **Węzły** | Dodaj węzeł (okno dialogowe), Dodaj węzeł (mysz) | Węzeł, Współrzędne, **Podparte stopnie swobody** (symbol podpory, `Dx`, `Dz`, `Ry`, kąt α), Obciążenia, Akcje |
| **Elementy** | Dodaj element (okno dialogowe), Dodaj element (mysz) | Element, Typ, Węzły (z przyciskiem **Zamień kolejność węzłów**), Materiał, Przekrój, **Przeguby końcowe**, Obciążenia, Akcje |
| **Obciążenia** | Dodaj obciążenie węzłowe, Dodaj obciążenie elementu | Typ, Miejsce przyłożenia, Składowe, Akcje |
| **Materiały** | Dodaj materiał, Biblioteka materiałów | Materiał, E, G, α<sub>T</sub>, Akcje |
| **Przekroje** | Dodaj przekrój, Biblioteka przekrojów, Przekrój wielokątny | Kształt, Przekrój, Pole, I<sub>y</sub>, Wysokość, Współczynnik ścinania, Akcje |
| **Wyniki** | Wyniki węzłowe, Wyniki elementów, Eksportuj CSV, Kopiuj | Przemieszczenia węzłów albo siły przywęzłowe elementów; zob. [Wyniki i wykresy](/pl/essentials/results#results-tab) |

Poszczególne zakładki szczegółowo opisują strony [Węzły i podpory](/pl/essentials/nodes-supports), [Elementy, materiały i przekroje](/pl/essentials/elements), [Obciążenia](/pl/essentials/loads) oraz [Wyniki i wykresy](/pl/essentials/results#results-tab).

### Wpisywanie wartości {#typing-values}

Każde pole liczbowe, w tabelach i w oknach dialogowych, działa tak samo:

- Wartości są w [bieżących jednostkach](/pl/essentials/units-settings#units), podanych w nagłówku kolumny lub za polem.
- Działa zarówno kropka, jak i przecinek dziesiętny: `2.5` i `2,5` znaczą to samo.
- Możesz wpisywać działania z `+ - * / ^` i nawiasami: `6/2`, `3*1.5`, `2^3` czy `(4+2)/3` EduBeam obliczy sam. Zapis `1e-5` oznacza $10^{-5}$.
- W tabeli wartość zatwierdza <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Tab</kbd> lub kliknięcie w innym miejscu. <kbd>Ctrl</kbd>+<kbd>Z</kbd> cofa ją potem; dopóki jeszcze piszesz, cofa tylko wpisywany tekst.

## Zakładki nad widokiem {#tabs-above-the-viewer}

**Widok** pokazuje płótno. **Ustawienia** wyświetlają w jego miejscu [ustawienia](/pl/essentials/units-settings) na całej powierzchni, więc możesz zmienić kolory lub jednostki i przełączyć się z powrotem, aby zobaczyć efekt. Plakietka jednostek i *Więcej ustawień* otwierają te same ustawienia jako okno dialogowe nad modelem.

## Okna pływające {#floating-windows}

**Macierz sztywności** (z panelu elementu lub z tabeli *Elementy*) otwiera okno z macierzą sztywności elementu 6 × 6 w osiach globalnych. **Edytuj** w menu płótna otwiera tabelę bieżącego zaznaczenia. Okno przesuniesz, przeciągając jego pasek tytułu, a zamkniesz krzyżykiem ×.
