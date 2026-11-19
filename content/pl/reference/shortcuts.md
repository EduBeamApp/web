---
description: "Wszystkie skróty klawiszowe, czynności myszą i gesty dotykowe w EduBeamie: cofanie, zapis, otwieranie, eksport obrazu, kopiowanie i wklejanie, zoom i przesuwanie."
source: site
---

# Klawiatura, mysz i dotyk

EduBeam obsłużysz klawiaturą i myszą, gładzikiem albo palcem. Ta strona wymienia wszystkie skróty i gesty. Na Macu używaj <kbd>Cmd</kbd> wszędzie tam, gdzie podano <kbd>Ctrl</kbd>; menu aplikacji pokazują w tym miejscu ⌘.

## Klawiatura {#keyboard}

Skróty do rysowania (<kbd>F</kbd>, <kbd>C</kbd>, <kbd>G</kbd>, <kbd>S</kbd>, <kbd>Delete</kbd> oraz <kbd>Ctrl</kbd>+<kbd>A</kbd>, <kbd>C</kbd>, <kbd>V</kbd>) nie działają, gdy aktywne jest pole tekstowe, więc wpisanie `f` lub `s` w polu nigdy ich nie wywoła. Najpierw kliknij rysunek.

### Pliki i historia {#files-and-history}

| Skrót | Działanie |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> | Cofnij ostatnią zmianę modelu |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | Ponów |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Zapisz projekt (pobiera `project.json`) |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Otwórz projekt |
| <kbd>Ctrl</kbd>+<kbd>P</kbd> | Eksportuj obraz |

Cofanie odwraca też wyczyszczenie modelu, otwarcie pliku, linku lub przykładu oraz przywrócenie modelu z listy **Ostatnie modele**. Dopóki wpisujesz wartość w komórce tabeli, <kbd>Ctrl</kbd>+<kbd>Z</kbd> cofa wpisywanie; po zatwierdzeniu komórki cofa zmianę modelu. W polach okna dialogowego zawsze cofa wpisywanie.

### Rysunek {#drawing}

| Skrót | Działanie |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>A</kbd> | Zaznacz wszystko |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Kopiuj zaznaczone węzły, elementy i obciążenia |
| <kbd>Ctrl</kbd>+<kbd>V</kbd> | Wklej. Półprzezroczysta kopia podąża za kursorem: kliknij, aby ją umieścić, albo wpisz przesunięcie Δx, Δz na pasku u góry i naciśnij **Wklej** lub <kbd>Enter</kbd> |
| <kbd>Delete</kbd> | Usuń zaznaczenie (na MacBooku <kbd>Fn</kbd>+<kbd>Delete</kbd>) |
| <kbd>Esc</kbd> | Wyjdź z bieżącego trybu (dodawanie węzłów, elementów lub wymiarów, wklejanie, wybór obszaru do eksportu obrazu) i wyczyść zaznaczenie; zamyka też menu ☰ i kończy przewodnik po aplikacji |
| <kbd>F</kbd> | Dopasuj do ekranu |
| <kbd>C</kbd> | Wyśrodkuj widok |
| <kbd>G</kbd> | Włącz lub wyłącz siatkę |
| <kbd>S</kbd> | Włącz lub wyłącz przyciąganie do siatki |
| <kbd>Ctrl</kbd>+<kbd>+</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Powiększ / pomniejsz rysunek względem jego środka |

W EduBeamie <kbd>Ctrl</kbd>+<kbd>+</kbd> i <kbd>Ctrl</kbd>+<kbd>-</kbd> powiększają i pomniejszają rysunek, a nie – jak na innych stronach – cały interfejs. Działają przy każdym układzie klawiatury: to klawisze oznaczone + i −, gdziekolwiek są w Twoim układzie, na klawiaturze amerykańskiej dwa klawisze na lewo od <kbd>Backspace</kbd>, a także + i − na klawiaturze numerycznej.

### Tabele i okna dialogowe {#tables-and-dialogs}

| Skrót | Działanie |
| --- | --- |
| <kbd>Enter</kbd> | W komórce tabeli: zatwierdza wartość. W polu tekstowym okna dialogowego: zatwierdza okno, tak jak jego główny przycisk |
| <kbd>Esc</kbd> | W komórce tabeli: opuszcza ją i zachowuje wartość. W oknie dialogowym: zamyka je bez zapisywania |
| <kbd>Tab</kbd> | Przechodzi do następnego pola; komórka tabeli zachowuje to, co wpisałeś |

Pola liczbowe przyjmują działania arytmetyczne zapisane tak, jak liczysz: `6/2`, `3*1,5`, `2^3`, `(4+2)/3`, a także `1e3`; separatorem dziesiętnym może być przecinek lub kropka.

## Mysz {#mouse}

| Czynność | Wynik |
| --- | --- |
| Kliknięcie | Zaznacza węzeł, element, obciążenie lub linię wymiarową i otwiera panel obiektu |
| Przeciągnięcie po pustym płótnie | Rysuje prostokąt zaznaczenia |
| Przeciągnięcie węzła | Przesuwa węzeł; przy włączonym przyciąganiu węzeł przeskakuje do punktów siatki |
| Kliknięcie podczas dodawania | Wstawia węzeł albo zaczyna lub kontynuuje linię łamaną elementów |
| Dwukrotne kliknięcie obciążenia | Otwiera edycję obciążenia (także zadanego przemieszczenia) |
| Kliknięcie prawym przyciskiem | Otwiera menu płótna: Dodaj węzeł, Dodaj element, Dodaj wymiar, Wymiaruj element (nad elementem), Edytuj, Kopiuj, Wklej, Usuń |
| <kbd>Ctrl</kbd> + **Dodaj węzeł** lub **Dodaj element** w menu płótna | Wstawia obiekt myszą zamiast otwierać okno dialogowe |
| Przeciąganie środkowym lub prawym przyciskiem | Przesuwa widok. Przycisk wybierzesz w **Ustawienia → Sterowanie i skróty → Przesuwanie widoku przez** |
| Kółko myszy | Powiększa lub pomniejsza widok względem kursora |
| Wskazanie obiektu kursorem | Pokazuje podpowiedź z przemieszczeniami, właściwościami lub wartościami obciążenia |

Na gładziku powiększenie zmienisz zarówno gestem zsuwania i rozsuwania palców, jak i przewijaniem dwoma palcami. Aby przesunąć widok, kliknij i przeciągnij dwoma palcami, co odpowiada przeciąganiu prawym przyciskiem.

## Dotyk {#touch}

| Gest | Wynik |
| --- | --- |
| Stuknięcie | Zaznacza obiekt i pokazuje jego szczegóły oraz dostępne polecenia |
| Stuknięcie podczas dodawania | Wstawia węzeł lub kontynuuje element |
| Dotknięcie węzła i przeciągnięcie | Przesuwa węzeł |
| Przeciągnięcie jednym palcem w innym miejscu | Przesuwa widok |
| Rozsunięcie lub zsunięcie palców | Powiększa lub pomniejsza widok |
| Dotknięcie i przytrzymanie płótna | Otwiera menu płótna |
| Przycisk **Zaznaczanie prostokątem** (prawy górny róg), potem przeciągnięcie | Rysuje prostokąt zaznaczenia; menu płótna z poleceniami Kopiuj i Usuń otwiera się tam, gdzie podniesiesz palec |

Gdy dodajesz węzły, elementy lub wymiary, wklejasz albo wybierasz obszar obrazu, pasek u góry rysunku podaje nazwę trybu i ma przycisk **Anuluj**. Na ekranie dotykowym, bez klawisza <kbd>Esc</kbd>, właśnie w ten sposób wychodzisz z trybu.

## Panele obiektów {#object-panels}

Kliknięcie lub stuknięcie obiektu otwiera obok niego panel z jego szczegółami i tymi poleceniami:

| Obiekt | Polecenia |
| --- | --- |
| Węzeł | Dodaj obciążenie · Podpory węzła (symbol podpory, Dx, Dz, Ry) · Kąt lokalnego układu · Zadaj przemieszczenie (w podpartym węźle) · Usuń |
| Element | Edytuj element (węzły końcowe i przeguby, materiał, przekrój) · Dodaj obciążenie · Macierz sztywności · Usuń |
| Obciążenie węzłowe lub elementu | Edytuj obciążenie · Usuń |
| Linia wymiarowa | Edytuj · Odwróć wymiar · Usuń |

Strona [Interfejs użytkownika](/pl/essentials/user-interface) oprowadza po ekranie, a ustawienie [Sterowanie i skróty](/pl/essentials/units-settings#controls-shortcuts) pozwala wybrać przycisk do przesuwania widoku.
