---
description: "Nauczanie z EduBeamem: modele na żywo na projektorze, linki w materiałach, samodzielnie sprawdzane prace domowe, generowane zadania i kolokwia z kluczem odpowiedzi."
source: site
---

# Nauczanie z EduBeamem

[EduBeam]{.edubeam} narodził się w sali wykładowej i tam wciąż sprawdza się najlepiej: model na projektorze reaguje w chwili, gdy go zmieniasz, a dzięki linkowi ten sam model ma na laptopie każdy student. Ta strona zbiera to, z czego prowadzący korzystają najczęściej, od pierwszego wykładu po kolokwium.

::card-grid{cols="2"}
:::card{title="Na wykładzie" icon="lucide:presentation" to="#in-the-lecture"}
Model czytelny z ostatniego rzędu, zmieniany na żywo.
:::
:::card{title="Na pierwszych zajęciach" icon="lucide:graduation-cap" to="#getting-students-started"}
Dziesięć minut od pustego ekranu do belki sprawdzonej ręcznie.
:::
:::card{title="W materiałach i zadaniach" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
Link w pliku PDF lub na slajdzie otwiera cały model, także za kilka lat.
:::
:::card{title="Zadania do samodzielnego sprawdzenia" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
Najpierw obliczenia ręczne, potem model jako sprawdzenie.
:::
:::card{title="Zadania i kolokwia" icon="lucide:file-check" to="#practice-and-test-papers"}
Generowane zadania z natychmiastowym sprawdzeniem i kolokwia do wydruku z kluczem odpowiedzi.
:::
:::card{title="Zestawy zadań i slajdy z kodu" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
Własne generatory zadań i rysunki do slajdów, napisane z pomocą biblioteki @edubeam/plot.
:::
::

## Na wykładzie {#in-the-lecture}

- **Zadbaj o czytelność z ostatniego rzędu.** W **Ustawienia → Ustawienia widoku** ustaw **Rozmiar czcionki** na 18 lub 20 px (20 px to maksimum), a **Rozmiar podpór** na 130–150 %. Jeśli wykresy nadal wyglądają na małe, zwiększ ustawienie **Skala wyników**.
- **Pokazuj jedną rzecz naraz.** W opcjach wyświetlania w prawym górnym rogu widoku odznacz wszystko oprócz wielkości, o której mówisz, a potem dodawaj kolejne po jednej.
- **Zmieniaj model na żywo.** Przeciągnij podporę, zaznacz `Ry`, dodaj przegub. Studenci od razu widzą przyczynę i skutek, a <kbd>Ctrl</kbd>+<kbd>Z</kbd> przywraca poprzedni stan.
- **Pozwól solverowi wyjaśniać mechanizmy.** Wstaw o jeden przegub za dużo, a EduBeam narysuje, jak konstrukcja może się poruszać, pokaże ten ruch w animacji i zakreśli przeguby, które go umożliwiają. To dobry moment, by porozmawiać o stateczności. Oba przełączniki znajdziesz w **Ustawienia → Ustawienia widoku → Sprawdzanie modelu**.
- **Używaj języka i osi swoich studentów.** EduBeam mówi w 18 językach, a w ustawieniach przełączysz jednostki SI i amerykańskie oraz oś z w dół i oś y w górę, tak by pasowały do Twoich materiałów (zob. [Jednostki i ustawienia](/pl/essentials/units-settings)).

![Mechanizm pokazany wprost: przeguby w B i C pozwalają ramie się przechylić](/screenshots/pl/ui-mechanism.webp)

## Na pierwszych zajęciach {#getting-students-started}

Przy pierwszej wizycie EduBeam pyta studentów, jak chcą zacząć oraz jakich jednostek i osi używać. Powiedz im wcześniej, jakich jednostek i osi używa się na Twoich zajęciach. Przewodnik po aplikacji (**Oprowadź mnie**), zadanie krok po kroku **Narysuj pierwszą belkę** i **Przykłady** pozostają później dostępne w menu **☰**.

Dobre pierwsze zajęcia w pracowni komputerowej: „otwórzcie run.edubeam.app i wybierzcie *Narysuj pierwszą belkę*”, a potem [Szybki start](/pl/guide/quick-start) – około dziesięciu minut ze sprawdzeniem ręcznym na końcu.

### Komputery w pracowni i praca offline {#offline-and-lab-computers}

EduBeam jest progresywną aplikacją webową (PWA): gdy przeglądarka raz ją wczyta, działa dalej bez połączenia, a przeglądarka może zaproponować jej instalację jak zwykłego programu. Model i ustawienia są przechowywane osobno dla każdego profilu przeglądarki, dlatego na współdzielonych komputerach w pracowni studenci powinni zabierać swoją pracę jako plik lub link. Szczegóły podaje sekcja [Co jest przechowywane w przeglądarce](/pl/essentials/units-settings#what-is-stored-in-your-browser).

## W materiałach do wykładu i zadaniach {#in-lecture-notes-and-assignments}

Link do modelu zawiera cały model, więc działa wszędzie tam, gdzie działa link: w pliku PDF, na slajdzie, na stronie przedmiotu na platformie e-learningowej, w e-mailu.

::div{.steps}

### Zbuduj model {#share-build}

Przygotuj go tak, jak studenci mają go zobaczyć po raz pierwszy: z obciążeniami, etykietami i wykresami, które chcesz mieć włączone.

### Skopiuj link {#share-copy}

Naciśnij **Udostępnij model** na pasku aplikacji. Włącz **Pokaż to, co widzę**, jeśli link ma się otwierać z Twoimi wykresami, obciążeniami i etykietami, a potem naciśnij **Kopiuj**.

### Wklej go do materiałów {#share-paste}

Studenci, którzy go otworzą, dostają własną kopię do eksperymentów. Nic, co zmienią, nie trafi do Ciebie ani do nikogo innego. Linki działają także w kolejnych wersjach EduBeamu, więc materiały pozostają aktualne rok po roku.

::

W materiałach do zajęć pozostaw **Krótszy link** wyłączony: kopia EduBeamu, która nie zaktualizowała się od czasu, gdy pojawiła się ta opcja, nie otworzy krótszej postaci linku, dopóki się nie zaktualizuje.

| Link | Otwiera |
| --- | --- |
| `run.edubeam.app/?model=…` | model gotowy do edycji |
| `run.edubeam.app/?viewer=1&model=…` | model w [trybie podglądu](/pl/essentials/import-export#embed-a-read-only-viewer), do osadzenia w `<iframe>` |
| `run.edubeam.app/?panel=examples` | [galerię przykładów](/pl/examples/) |
| `run.edubeam.app/?lang=pl` | aplikację po polsku albo w dowolnym [innym języku](/pl/essentials/import-export#url-parameters) |

::callout{type="warning" title="Link zastępuje własny model studenta"}
Otwarcie linku, a w niektórych przeglądarkach także strony z osadzonym podglądem, przenosi model, który student miał otwarty, do **☰ → Ostatnie modele**, skąd można go przywrócić. Mimo to poproś studentów, by przed otwarciem linków z zajęć zapisali ważną pracę przez **☰ → Zapisz projekt**.
::

## Zadania, które studenci sprawdzą sami {#assignments-students-can-check-themselves}

EduBeam daje studentom natychmiastową informację zwrotną o obliczeniach ręcznych, ale nie rozwiązuje zadania za nich.

- **Najpierw oblicz, potem sprawdź.** Poproś o ręczne wyznaczenie reakcji, sił przekrojowych i jednego przemieszczenia, a potem o zbudowanie modelu i porównanie wyników. Wzory podaje strona [Sprawdzanie wyników ręcznie](/pl/guide/verification), a cały tok postępowania pokazuje [Szybki start](/pl/guide/quick-start#_8-check-by-hand).
- **Zapytaj, dlaczego wynik się różni.** Odkształcenie postaciowe, brakujący przegub, obciążenie w osiach lokalnych zamiast globalnych: każda z tych przyczyn tłumaczy małą lub dużą rozbieżność, a jej znalezienie uczy więcej niż sama zgodność.
- **Zbieraj model razem z obliczeniami.** Poproś, by do obliczeń dołączyć link do modelu lub plik `project.json`. Otworzysz go i zobaczysz dokładnie, co zostało zamodelowane.
- **Estetyczne sprawozdania.** Studenci mogą wyeksportować rysunek jako **SVG**, który pozostaje ostry w Wordzie i LaTeX-u, a wyniki jako **CSV**. Zobacz [Eksport obrazu](/pl/essentials/import-export#export-an-image).

## Gotowe ćwiczenia {#ready-made-exercises}

- **[Przykłady](/pl/examples/):** sześć modeli otwieranych jednym kliknięciem, każdy z pytaniami, wskazówkami, na co zwrócić uwagę, i odpowiedziami.
- **[Zadania ze statyki](/pl/practice):** generowane belki, ramy i kratownice, które sprawdzają odpowiedzi studentów, oraz [generator kolokwiów](/pl/exam), który drukuje je jako kolokwia. Zobacz [niżej](#practice-and-test-papers).
- **[Samouczki](/pl/tutorials/inclined-beam):** belka pochyła, rama trójprzegubowa, kratownica płaska i belka ciągła z osiadającą podporą, każda zamodelowana krok po kroku i sprawdzona ręcznie. Nadają się na instrukcje do zajęć na 15–20 minut.
- **[Sprawdzanie wyników ręcznie](/pl/guide/verification):** przypadki z rozwiązaniem analitycznym, od wspornika po osiadanie podpory, które możesz zadać jako szybkie sprawdziany.

## Zadania i kolokwia {#practice-and-test-papers}

Dwie strony tej witryny przygotują za Ciebie zadania ze statyki – bez instalowania i bez programowania:

- **Strona [Zadania ze statyki](/pl/practice)** daje studentom nowe zadanie, ilekroć o nie poproszą. Studenci rozwiązują je na papierze, wpisują reakcje i największy moment zginający albo siłę w pręcie, a strona porównuje każdą wartość z rozwiązaniem dokładnym: odchyłka do 1 % jest zaliczana, a poprawną wartość ze złym zwrotem strona oznacza osobno. Wskazówka podpowiada, jak zacząć, a wykresy pojawiają się po rozwiązaniu. Każde zadanie ma kod, np. `H2048`, który zawsze oznacza to samo zadanie: podaj go w treści pracy domowej, a wszyscy będą porównywać wyniki z tymi samymi liczbami.
- **[Generator kolokwiów](/pl/exam)** drukuje kolokwia: wybierz rodzaje konstrukcji, do 6 zadań na arkusz i do 40 wersji, a każdy student dostanie inną wersję. Każda wersja ma te same rodzaje konstrukcji w tej samej kolejności, więc arkusze są równie trudne. Generator dodaje pole na imię i nazwisko, miejsce na obliczenia i klucz odpowiedzi, a przycisk **Drukuj lub zapisz jako PDF** drukuje arkusze. Przycisk **Pobierz .zip** zapisuje wszystkie rysunki jako pliki SVG do LaTeX-a i Worda, a odpowiedzi jako tabelę CSV do sprawdzania prac.

Obie strony oferują tych samych osiem rodzajów konstrukcji: sześć statycznie wyznaczalnych (belka swobodnie podparta, wspornik, belka ze wspornikiem, belka Gerbera, rama trójprzegubowa i kratownica Warrena) i dwie statycznie niewyznaczalne (belka ciągła dwuprzęsłowa i rama dwuprzegubowa).

Generator kolokwiów zapisuje swoje ustawienia, w tym **Numer kolokwium**, który wybiera liczby, w adresie strony. Dodaj ten adres do zakładek, a za rok dostaniesz te same arkusze i ten sam klucz. Kody zadań są na kolokwiach domyślnie wyłączone: strona Zadania ze statyki pokazuje rozwiązanie, więc kody pasują do prac domowych, które studenci po rozwiązaniu sami sprawdzają.

## Zestawy zadań, kolokwia i slajdy z kodu {#exercise-sheets-tests-and-slides-from-code}

Rysunki w tym serwisie tworzy [@edubeam/plot](/pl/plot), biblioteka komponentów Vue, która rysuje dowolną płaską belkę, ramę lub kratownicę rozwiązaną przez [@edubeam/fem](/pl/solver), solver, na którym działa EduBeam. Jeśli znasz trochę JavaScriptu, kilka linijek kodu wystarczy, by przygotować materiały do zajęć:

- **Własne rodzaje zadań.** Jeśli w generatorze kolokwiów brakuje konstrukcji, które omawiasz na zajęciach, napisz własne zadania: ziarno generatora liczb losowych wybiera konstrukcję i jej wartości liczbowe, więc to samo ziarno zawsze daje to samo zadanie, a klucz odpowiedzi powstaje z tego samego ziarna.
- **Slajdy, które budują się krok po kroku.** Pokaż konstrukcję, potem podpory i obciążenia, potem reakcje, a na końcu wykres momentów, bez przesuwania się rysunku między krokami.
- **Rysunki do materiałów i na strony przedmiotu.** Ostre SVG, które dopasowuje się do jasnego lub ciemnego motywu strony i – w odróżnieniu od osadzonej aplikacji – nigdy nie zmienia własnego modelu studenta.

Wypróbuj to. Każde naciśnięcie przycisku **Nowe zadanie** losuje nowe zadanie wraz z kluczem odpowiedzi:

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="Zadania i kolokwia" icon="lucide:file-check" to="/pl/plot/exercises"}
Generuj zestawy zadań i klucze odpowiedzi z ziarna.
:::
:::card{title="Slajdy i materiały do wykładu" icon="lucide:presentation" to="/pl/plot/slides"}
Rysunki budowane warstwa po warstwie, do slajdów i materiałów.
:::
::
