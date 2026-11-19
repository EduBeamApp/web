---
description: "Krótkie odpowiedzi o EduBeamie: koszt, praca offline, prywatność, dokładność, sposób obliczania wyników, cytowanie, zadania do ćwiczeń, udostępnianie i kod."
source: site
---

# Najczęściej zadawane pytania

Krótkie odpowiedzi, każda z linkiem do strony, która omawia temat w całości. Nie ma tu Twojego pytania? Zajrzyj na stronę [Rozwiązywanie problemów](/pl/reference/troubleshooting) albo [zapytaj na GitHubie](https://github.com/janvorisek/edubeam/issues).

## Ogólne {#general}

### Czym jest EduBeam? {#what-is-edubeam}

To darmowa, otwartoźródłowa aplikacja do liniowej analizy statycznej płaskich belek, ram i kratownic, przeznaczona dla studentów, prowadzących zajęcia i inżynierów, którzy chcą od razu widzieć wyniki. Działa w przeglądarce. [Wprowadzenie](/pl/guide/introduction) opisuje, co potrafi, a czego nie.

### Czy naprawdę jest darmowy? Czy potrzebuję konta? {#is-it-really-free-do-i-need-an-account}

Tak, jest darmowy, i nie, konto nie jest potrzebne. Otwórz [run.edubeam.app](https://run.edubeam.app/?lang=pl){target="_blank"} i zacznij modelować: niczego nie trzeba instalować i nie ma limitów użycia. Kod źródłowy jest na [GitHubie](https://github.com/janvorisek/edubeam), na licencji GPL-3.0.

### W jakich przeglądarkach i na jakich urządzeniach działa? {#which-browsers-and-devices-work}

W każdej aktualnej wersji przeglądarki Chrome, Edge, Firefox i Safari, na komputerze, tablecie i telefonie. Na ekranie dotykowym stuknij, aby zaznaczyć, przeciągnij węzeł, aby go przesunąć, przeciągnij w innym miejscu, aby przesunąć widok, rozsuń lub zsuń palce, aby zmienić powiększenie, a dotknij i przytrzymaj, aby otworzyć menu płótna. Z myszą i klawiaturą modelowanie idzie jednak szybciej. Zobacz [Klawiatura, mysz i dotyk](/pl/reference/shortcuts#touch).

### Straciłem model. Czy mogę go odzyskać? {#i-lost-my-model-can-i-get-it-back}

Prawdopodobnie tak. Gdy model zostanie wyczyszczony albo zastąpiony linkiem, plikiem lub przykładem, EduBeam zachowuje go w **☰ → Ostatnie modele** (10 ostatnich), a <kbd>Ctrl</kbd>+<kbd>Z</kbd> cofa zastąpienie. Jedno i drugie działa tylko w tej przeglądarce, więc nie znajdziesz tam modelu z innego komputera ani innego profilu przeglądarki. Zobacz [Ostatnie modele](/pl/essentials/import-export#recent-structures).

### Czy mogę używać go offline? {#can-i-use-it-offline}

Tak. EduBeam jest progresywną aplikacją webową (PWA): gdy przeglądarka raz go wczyta, działa dalej bez połączenia, a przeglądarka może zaproponować jego instalację. Gdy pojawi się nowa wersja, przed aktualizacją okno zapyta Cię o zgodę.

### Gdzie są przechowywane moje dane? {#where-is-my-data-stored}

W Twojej przeglądarce. Nie ma kont ani przechowywania w chmurze: aplikacja trzyma model i ustawienia w tej przeglądarce, a link do modelu zawiera cały model w sobie. Zobacz [Co jest przechowywane w przeglądarce](/pl/essentials/units-settings#what-is-stored-in-your-browser).

Aplikacja na run.edubeam.app zbiera jednak statystyki użycia (Google Analytics) i raporty o błędach (Sentry). Raport o błędzie oraz nagranie, które Sentry wykonuje dla części sesji, mogą zawierać to, co było na ekranie, w tym Twój model.

### Gdzie mogę poćwiczyć zadania ze statyki? {#practice}

Na stronie [Zadania ze statyki](/pl/practice). Za każdym razem dostajesz belkę, ramę lub kratownicę z nowymi liczbami: wyznacz na papierze reakcje i największy moment zginający albo siłę w pręcie, wpisz je, a każda wartość zostanie od razu sprawdzona. Pytania z odpowiedziami mają też [Przykłady](/pl/examples/). Prowadzący mogą w [generatorze kolokwiów](/pl/exam) wydrukować każdemu studentowi inne kolokwium z kluczem odpowiedzi; zobacz [Zadania i kolokwia](/pl/guide/teaching#practice-and-test-papers).

### Jak cytować EduBeam? {#cite}

Jak oprogramowanie, z wersją i datą użycia. Wersję znajdziesz na dole menu **☰**. Na przykład:

> Voříšek, J. i współautorzy. *EduBeam*, wersja 1.3.4 \[oprogramowanie\]. https://edubeam.app (dostęp: 18 listopada 2026).

Aby odwołać się do konkretnego modelu, dodaj jego [link](/pl/essentials/import-export#share-a-link): każdemu czytelnikowi otworzy ten sam model.

## Modelowanie {#modelling}

### Jak zrobić utwierdzenie, podporę przegubową nieprzesuwną lub przesuwną? {#how-do-i-make-a-fixed-pinned-roller-support}

Kliknij węzeł, wybierz **Podpory węzła** i kliknij symbol podpory: podpora przegubowa nieprzesuwna, przesuwna, utwierdzenie, utwierdzenie przesuwne i inne. Możesz też zaznaczyć zablokowane stopnie swobody w zakładce **Węzły**: `Dx` + `Dz` + `Ry` to utwierdzenie, `Dx` + `Dz` to podpora przegubowa nieprzesuwna, samo `Dz` to podpora przesuwna. Wszystkie typy opisuje strona [Węzły i podpory](/pl/essentials/nodes-supports#supports).

### Jak zrobić kratownicę? {#how-do-i-make-a-truss}

Narysuj pręty jako zwykłe elementy i zwolnij oba końce każdego z nich: zaznacz oba **Przeguby końcowe** w zakładce **Elementy** albo zaznacz **Przegub na początku** i **Przegub na końcu** na pasku u góry, zanim narysujesz pręty myszą. Obciążenia przykładaj w węzłach. Samouczek [Kratownica płaska](/pl/tutorials/truss) buduje ją krok po kroku.

### Jak wstawić przegub do ramy? {#how-do-i-put-a-hinge-in-a-frame}

Zwolnij moment na końcu tego elementu, który ma się swobodnie obracać: zaznacz jego przegub końcowy w zakładce **Elementy**. Przegub należy do jednego końca elementu, więc w węźle, w którym spotyka się kilka elementów, zwolnienie jednego z nich nie zmienia sztywnego połączenia pozostałych. Zobacz [Przeguby końcowe](/pl/essentials/elements#end-hinges).

### Jak dodać podporę lub siłę skupioną w środku belki? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Aby dodać podporę, wstaw węzeł na belce myszą (przycisk **Dodaj węzeł** z ikoną kursora) i wybierz **Połącz z konstrukcją**: belka zostanie w tym węźle podzielona na dwie części i możesz ją tam podeprzeć. Siła skupiona nie wymaga węzła: dodaj do elementu **Obciążenie skupione** i ustaw jego położenie od węzła początkowego. Zobacz [Wstawianie węzła na istniejącym elemencie](/pl/essentials/nodes-supports#placing-a-node-on-an-existing-element) i [Obciążenie skupione](/pl/essentials/loads#concentrated-load).

### Czy można przyłożyć ciężar własny? {#can-i-apply-self-weight}

Nie automatycznie: EduBeam nie wykorzystuje gęstości materiału w analizie statycznej. Dodaj ciężar własny jako obciążenie równomiernie rozłożone $f_z = \rho g A$, np. dla IPE 200 $7850 \cdot 9{,}81 \cdot 28{,}48 \cdot 10^{-4} = 219$ N/m, czyli 0,22 kN/m.

### Czy można modelować podpory ukośne? {#can-i-model-inclined-supports}

Tak. Ustaw w węźle **Kąt lokalnego układu**, a jego podpory będą działać w obróconych osiach. Zobacz [Podpory ukośne](/pl/essentials/nodes-supports#inclined-skewed-supports).

### Czy mogę pracować w jednostkach amerykańskich? {#can-i-work-in-us-customary-units}

Tak. Kliknij plakietkę jednostek w prawym dolnym rogu widoku, która otwiera **Ustawienia → Język i ustawienia regionalne**, i ustaw **Układ jednostek** na **Amerykański (imperialny)**, aby pracować w stopach i kipach, albo wybierz każdą jednostkę osobno. Model jest przechowywany w SI, więc zmiana jednostek przelicza to, co widzisz, i nigdy nie zmienia modelu. Zobacz [Jednostki i ustawienia](/pl/essentials/units-settings).

### Czy są przypadki lub kombinacje obciążeń? {#are-there-load-cases-or-combinations}

Nie, model ma jeden przypadek obciążenia. Każdy przypadek zapisz jako osobny plik lub link, a kombinacje wyników utwórz samodzielnie. Sesja z desktopowego EduBeamu z kilkoma przypadkami obciążenia otwiera się z pierwszym z nich, a komunikat wymienia pominięte.

### Dlaczego moje obciążenia są skierowane w górę? {#why-do-my-loads-point-up}

Prawdopodobnie wpisałeś wartość ujemną. W EduBeamie globalna oś z jest skierowana **w dół**, więc dodatnie `fz` lub `Fz` to obciążenie grawitacyjne, skierowane w dół: 12 kN/m w dół to `fz = 12`. Zobacz [Układ współrzędnych i konwencje znaków](/pl/elements/conventions#loads). Jeśli na Twoich zajęciach oś pionowa jest skierowana w górę, przełącz na **x w prawo, y w górę** w **Ustawienia → Język i ustawienia regionalne → Układ współrzędnych**: dane wejściowe i wyniki będą wtedy zgodne z tą osią.

## Wyniki {#results}

### Dlaczego nie ma przycisku „Oblicz”? {#why-is-there-no-solve-button}

Bo EduBeam rozwiązuje model od nowa po każdej zmianie. Jeśli wyniki się nie pojawiają, modelu nie da się jeszcze rozwiązać, a komunikat na płótnie wyjaśnia dlaczego. Co sprawdzić, wymienia strona [Rozwiązywanie problemów](/pl/reference/troubleshooting#no-results-are-drawn).

### Dlaczego moje ugięcie nieco różni się od wzoru? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam używa elementów belkowych Timoszenki, więc ugięcie obejmuje odkształcenie postaciowe, które wzory z podręczników zwykle pomijają. W smukłej belce różnica wynosi około 1 %, a strona [Szybki start](/pl/guide/quick-start#_8-check-by-hand) oblicza ją ręcznie. W konstrukcji statycznie niewyznaczalnej sztywność na ścinanie nieznacznie zmienia też siły przekrojowe. Więcej na stronie [Sprawdzanie wyników ręcznie](/pl/guide/verification).

### Jak dokładne są wyniki? Czy potrzebuję więcej elementów? {#how-accurate-are-the-results-do-i-need-more-elements}

W statyce liniowej element belkowy jest dokładny dla każdego typu obciążenia dostępnego w EduBeamie, więc jeden element na pręt wystarczy i nie ma siatki do zagęszczania. Dodawaj węzły tylko tam, gdzie potrzebujesz podpory, przegubu, zmiany przekroju, obciążenia węzłowego albo przemieszczenia do odczytu. Zobacz [Precyzja i dokładność](/pl/essentials/results#precision-and-accuracy).

### Jak EduBeam oblicza wyniki? {#how-does-edubeam-compute-the-results}

Bezpośrednio w Twojej przeglądarce, metodą przemieszczeń w ujęciu metody elementów skończonych – tą samą, której uczy się na zajęciach z mechaniki budowli. Strona [Jak EduBeam rozwiązuje model](/pl/elements/analysis) przechodzi przez każdy krok na małym przykładzie, który możesz powtórzyć ręcznie, a sam solver jest dostępny jako otwartoźródłowa biblioteka [@edubeam/fem](/pl/solver).

### Czy mogę zobaczyć macierze sztywności? {#can-i-see-the-stiffness-matrices}

Tak. W zakładce **Elementy** przycisk macierzy w wierszu elementu otwiera jego macierz sztywności 6 × 6, w osiach globalnych i jednostkach SI (N, m). Polecenie **Macierz sztywności** znajdziesz też w panelu, który otwiera się po kliknięciu elementu w widoku. Jej wyprowadzenie podaje strona [Element belkowy](/pl/elements/beam#global-stiffness-matrix).

### Gdzie znajdę reakcje? {#where-are-the-reactions-listed}

W widoku, jako strzałki z wartościami (przełącznik **Reakcje** w opcjach wyświetlania jest domyślnie włączony). Znajdziesz je też w pliku zapisanym przez **Wyniki → Eksportuj CSV** i w danych, które **Kopiuj** umieszcza w schowku. Zakładka **Wyniki** podaje przemieszczenia węzłów i siły przywęzłowe elementów. Zobacz [Wyniki i wykresy](/pl/essentials/results).

## Pliki i udostępnianie {#files-sharing}

### Jak udostępnić model? {#how-do-i-share-a-model}

Naciśnij **Udostępnij model**, a potem **Kopiuj**. Link zawiera cały model, a każdy, kto go otworzy, dostaje własną kopię do edycji: nie ma wspólnej edycji na żywo. Włącz **Pokaż to, co widzę**, aby link otwierał się z Twoimi wykresami i etykietami. Zobacz [Udostępnianie linku](/pl/essentials/import-export#share-a-link), a na potrzeby zajęć [Nauczanie z EduBeamem](/pl/guide/teaching#in-lecture-notes-and-assignments).

### Czy mogę osadzić model na swojej stronie lub w prezentacji? {#can-i-embed-a-model-on-my-website-or-in-slides}

Tak. Dodaj `&viewer=1` do linku do modelu i umieść go w `<iframe>`: zobacz [Osadzanie podglądu](/pl/essentials/import-export#embed-a-read-only-viewer). Jeśli potrzebujesz statycznego rysunku na stronę, slajd lub do drukowanych materiałów, wyeksportuj SVG albo narysuj go z kodu za pomocą [@edubeam/plot](/pl/plot).

### Czy mogę eksportować obrazy lub tabele? {#can-i-export-images-or-tables}

Tak. **☰ → Eksportuj obraz** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) zapisuje rysunek jako PNG lub SVG w wybranym rozmiarze lub skali. **Wyniki → Eksportuj CSV** zapisuje obie tabele wyników, a **Kopiuj** umieszcza je w schowku, gotowe do wklejenia w arkusz kalkulacyjny. Zobacz [Eksport obrazu](/pl/essentials/import-export#export-an-image).

### Czy mogę otworzyć pliki z desktopowego EduBeamu? {#can-i-open-files-from-the-desktop-edubeam}

Tak. Sesje zapisane w desktopowym EduBeamie w wersjach od 2.x do 3.5 (`.xml`) otworzysz przez **☰ → Otwórz projekt** albo przeciągając je do okna aplikacji, tak samo jak `project.json`. EduBeam odczytuje ich wartości w kN, kPa i m. Zobacz [Otwieranie projektu](/pl/essentials/import-export#open-a-project).

### Czy mogę generować modele programowo? {#can-i-generate-models-programmatically}

Tak, na dwa sposoby:

- **Zapisz plik.** `project.json` to zwykły JSON w jednostkach SI, więc może go zapisać skrypt w dowolnym języku, a EduBeam otworzy go przez **Otwórz projekt** albo po przeciągnięciu i upuszczeniu. Zobacz [format pliku projektu](/pl/essentials/import-export#project-file-format).
- **Rozwiąż go w kodzie.** [@edubeam/fem](/pl/solver) to solver metody elementów skończonych, na którym działa EduBeam, w postaci biblioteki dla JavaScriptu i TypeScriptu. [@edubeam/plot](/pl/plot) rysuje następnie wynik, np. jako [wygenerowany zestaw zadań](/pl/plot/exercises).

Belka ze [Szybkiego startu](/pl/guide/quick-start) w jednostkach SI:

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // podpora przegubowa nieprzesuwna
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // podpora przesuwna
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, w dół

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 54000 N·m w środku rozpiętości
beam.computeLocalDefl(lc, 2).w[1] // 0.0502 m w środku rozpiętości
```

## Wsparcie {#support}

### Jak zgłosić błąd lub zaproponować funkcję? {#how-do-i-report-a-bug-or-request-a-feature}

Utwórz zgłoszenie na [GitHubie](https://github.com/janvorisek/edubeam/issues) i dołącz link do modelu lub plik projektu, który pokazuje problem. W sprawach prywatnych napisz na [support@edubeam.app](mailto:support@edubeam.app).
