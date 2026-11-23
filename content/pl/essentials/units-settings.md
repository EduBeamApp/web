---
description: "Ustawienia EduBeamu: język, jednostki SI lub amerykańskie, format liczb, osie z w dół lub y w górę, siatka, styl i kolory wykresów oraz dane w przeglądarce."
source: site
---

# Jednostki i ustawienia

Wybierz język, jednostki i osie, w których pracujesz, oraz wygląd rysunku. Ustawienia zmieniają tylko sposób wyświetlania i wpisywania modelu: sam model jest zawsze przechowywany w jednostkach SI, z osią z skierowaną w dół, więc projekt lub link otwiera się tak samo przy dowolnych ustawieniach.

Do ustawień dostaniesz się na trzy sposoby:

- zakładka **Ustawienia** nad widokiem pokazuje je na całej powierzchni zamiast modelu, w sekcji *Język i ustawienia regionalne*; zakładka **Widok** prowadzi z powrotem;
- **plakietka jednostek** w prawym dolnym rogu widoku (`m m² kN kNm MPa`) otwiera je jako okno dialogowe w sekcji *Język i ustawienia regionalne*;
- **Więcej ustawień** pod [opcjami wyświetlania](/pl/essentials/user-interface#display-options) otwiera okno w sekcji *Ustawienia widoku*.

Ustawienia zapisują się w przeglądarce i przetrwają przeładowanie strony. Przycisk **Przywróć ustawienia** pod listą sekcji przywraca wartości domyślne: format liczb, osie, przycisk przesuwania widoku, jednostki Twojego regionu oraz wszystkie ustawienia widoku i opcje wyświetlania. Język pozostaje bez zmian. Przywrócenia ustawień nie można cofnąć.

## Język i ustawienia regionalne {#language-locale}

![Ustawienia → Język i ustawienia regionalne](/screenshots/pl/settings-language.webp)

**Język.** 22 języki; za pierwszym razem EduBeam przejmuje język przeglądarki. Separator dziesiętny zależy od języka. W linku możesz wybrać język dla odbiorcy: dodaj `?lang=` z jednym z kodów `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (chiński), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`.

**Format liczb.** Sposób zapisu wyników w tabelach i podpowiedziach: *Naukowy* (1,5 · 10⁴, domyślnie), *Inżynierski* (15 · 10³) lub *Automatyczny*. Zob. [Format liczb](/pl/essentials/results#number-format).

**Układ współrzędnych.** *x w prawo, z w dół* (domyślnie) lub *x w prawo, y w górę*. Przy *x w prawo, y w górę* oś pionowa nazywa się y i jest skierowana w górę, a momenty działają względem osi z. Pionowe współrzędne, siły, przemieszczenia, reakcje i kąty podpór zmieniają znak, a każde pole, tabela, podpowiedź i eksport używa nowych nazw. Model, rysunek i zapisane pliki pozostają dokładnie takie same. Zob. [Oś y w górę](/pl/elements/conventions#y-up-axes).

![Rama trójprzegubowa przy osi y skierowanej w górę: wskaźnik osi w rogu pokazuje oś y skierowaną w górę](/screenshots/pl/settings-y-up.webp){.shot-lg}

**Układ jednostek.** *SI (metryczny)* lub *Amerykański (imperialny)* ustawia jednym krokiem wszystkie jednostki. Przy pierwszej wizycie wybierasz go w oknie powitalnym. EduBeam proponuje jednostki amerykańskie tylko wtedy, gdy przeglądarka ma ustawienia regionalne USA *i* komputer jest w strefie czasowej USA; wszędzie indziej proponuje SI. Jeśli potem zmienisz którąkolwiek pojedynczą jednostkę, układ będzie wyświetlany jako *Własny*.

### Jednostki {#units}

Każda wielkość ma własną jednostkę. Używają jej pola (podają ją na końcu), tabele, podpowiedzi i etykiety wykresów, a zmiana jednostki przelicza to, co jest wyświetlane. W modelu nic się nie zmienia, więc przełączając jednostki tam i z powrotem, niczego nie tracisz.

| Wielkość | Do wyboru | SI | Amerykańskie |
| --- | --- | --- | --- |
| Długość (geometria, położenie obciążeń) | m, cm, mm, ft, in | m | ft |
| Wymiary przekroju | m, cm, mm, ft, in | m | in |
| Przemieszczenie (wyniki, zadane osiadania) | m, cm, mm, ft, in | m | in |
| Pole | m², cm², mm², ft², in² | m² | in² |
| Geometryczny moment bezwładności | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Masa | kg, lb | kg | lb |
| Siła | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Moment zginający | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Naprężenie (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Temperatura | °C, °F | °C | °F |

Kilka jednostek wynika z pozostałych:

- **Obciążenia liniowe** to siła na jednostkę długości: kN/m w SI, kip/ft w jednostkach amerykańskich.
- **Gęstość** to masa na jednostkę objętości: kg/m³ lub lb/ft³.
- **Rozszerzalność cieplna** zależy od jednostki temperatury: 1/K lub 1/°F. Obciążenia termiczne to *zmiany* temperatury, więc 10 °C to 18 °F.
- **Obroty** są zawsze w radianach, a kąty podpór w stopniach.

Tonf to metryczna tona-siła (1000 kgf), a nie amerykańska tona krótka. Jednostki amerykańskie mają swoje dokładne definicje: 1 ft = 0,3048 m, 1 kip = 4448,2216 N. Stopy wpisuj jako ułamki dziesiętne, np. `5,5`; linijki i celownik pokazują stopy i cale (5′-6″).

## Ustawienia widoku {#viewer-settings}

Wygląd rysunku. **Podgląd widoku** po prawej to mała pochyła belka, która od razu pokazuje każdą zmianę; przyciski pod nią wybierają wyświetlany wynik, a zmiana ustawienia wykresu lub koloru przełącza podgląd na odpowiedni wynik.

![Ustawienia → Ustawienia widoku, z podglądem na żywo i ustawieniami wykresów po prawej](/screenshots/pl/b-settings-viewer.webp)

Lewa kolumna, od góry:

- *Siatka*: **Pokaż siatkę** (<kbd>G</kbd>) rysuje siatkę i linijki; **Przyciągaj do siatki** (<kbd>S</kbd>) sprawia, że wstawiane i przeciągane węzły trafiają w punkty siatki; **Pokaż celownik** zaznacza położenie kursora na linijkach (przy pracy myszą). Na początku wszystkie trzy są włączone. **Krok przyciągania do siatki** wynosi 0,1 m, a w jednostkach amerykańskich 0,5 ft. Przy przełączaniu między jednostkami metrycznymi i amerykańskimi krok, który ma nadal wartość domyślną, zmienia się na wartość domyślną drugiego układu; krok ustawiony przez Ciebie zostaje zachowany.
- *Rozmiary*: **Skala wyników**, od 8 do 120 px (na początku 48 px), określa, jak wysoko jest rysowana największa rzędna wykresu albo największe ugięcie; to ustawienie czysto wizualne, bo każdy wykres jest skalowany do własnej największej wartości. **Rozmiar podpór** można zmieniać od 50 do 150 % (100 %), a **Rozmiar czcionki** od 10 do 20 px (14 px); większe wartości przydają się przy projektorze.
- *Orientacja etykiet wyników*: *Prostopadle do wykresu* (domyślnie), czyli wartości zapisane wzdłuż rzędnej, lub *Zawsze poziomo*.
- *Sprawdzanie modelu*: **Pokazuj, jak może się poruszać niestabilna konstrukcja** rysuje przerywany zarys mechanizmu, a **Animuj ruch** porusza nim tam i z powrotem. Na początku obie opcje są włączone.

### Wykresy sił wewnętrznych {#internal-force-diagrams}

Na różnych uczelniach wykresy rysuje się różnie, dlatego EduBeam pozwala wybrać. Te ustawienia zmieniają tylko rysunek, nigdy wartości. **Linia przerywana** wzdłuż każdego elementu oznacza jego włókna dolne, czyli stronę, w którą skierowana jest jego lokalna oś z (zob. [Kierunek elementu](/pl/essentials/elements#element-direction)).

| Ustawienie | Do wyboru | Domyślnie |
| --- | --- | --- |
| **Moment zginający** | rysowany *Po stronie rozciąganej* lub *Po stronie ściskanej* | *Po stronie rozciąganej* |
| **Dodatnia siła tnąca** | rysowana po stronie przeciwnej do linii przerywanej (*Strona przeciwna*) lub po stronie linii przerywanej (*Strona przerywana*) | *Strona przeciwna* |
| **Dodatnia siła normalna** | *Strona przeciwna* lub *Strona przerywana* | *Strona przeciwna* |
| **Wypełnienie** | *Pełne*, *Kreskowane* (kreski w poprzek pręta, jak przy rysowaniu ręcznym) lub *Brak* | *Pełne* |
| **Stopień wykresu w przedziałach** | zapisuje na każdym przedziale wykresu stopień wielomianu, od 0° do 3° | wyłączone |

Jak odczytywać znaki, wyjaśnia strona [Wyniki i wykresy](/pl/essentials/results#reading-the-sign).

### Kolory {#colors}

Osobne kolory węzłów, elementów, obciążeń, postaci odkształconej, siły normalnej, siły tnącej, momentu zginającego i reakcji. Kliknij próbkę, aby wybrać kolor. Domyślnie: obciążenia pomarańczowe, postać odkształcona szara, N niebieski, V zielony, M czerwony, reakcje fioletowe, węzły i elementy czarne.

## Sterowanie i skróty {#controls-shortcuts}

**Przesuwanie widoku przez** określa, który przycisk myszy przesuwa płótno: *Kółko myszy lub prawy przycisk* (domyślnie), *Kółko myszy* (wciśnij kółko i przeciągnij) lub *Prawy przycisk*. Wszystkie skróty zebrano na stronie [Klawiatura, mysz i dotyk](/pl/reference/shortcuts).

## Co jest przechowywane w przeglądarce {#what-is-stored-in-your-browser}

Oprócz ustawień EduBeam przechowuje w pamięci lokalnej przeglądarki:

- **bieżący model**, zapisywany po każdej zmianie, więc przeładowanie karty lub ponowne otwarcie aplikacji go przywraca;
- **Ostatnie modele**: 10 ostatnich modeli, które wyczyściłeś lub zastąpiłeś, gotowych do przywrócenia z menu ☰.

Oba należą do tej przeglądarki na tym urządzeniu, a wyczyszczenie danych witryny je usuwa. Aby zachować model lub przenieść go na inne urządzenie, użyj [Zapisz projekt lub Udostępnij model](/pl/essentials/import-export).
