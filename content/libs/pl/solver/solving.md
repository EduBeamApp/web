---
title: Obliczenia
description: "Co robi solve() w @edubeam/fem, kiedy po zmianie modelu trzeba ponownie ponumerować równania, jak rozpoznać mechanizm i jak duży model zmieści solver."
order: 9
group: Obliczenia i wyniki
source: site
---

# Obliczenia {#solving}

```ts
solver.solve()
```

`solve()` numeruje równania, agreguje globalną macierz sztywności i wektory obciążeń wszystkich przypadków obciążenia, a następnie wyznacza przemieszczenia i reakcje. Potem można odczytać każdy [wynik](/pl/solver/results); próba odczytu przed obliczeniami zgłasza `TypeError`. To te same kroki, które opisuje strona [Jak EduBeam rozwiązuje model](/pl/elements/analysis) w podręczniku teoretycznym.

Rozwiązanie modelu liniowego jest dokładne: linia ugięcia i siły przekrojowe wzdłuż każdego pręta wynikają z rozwiązań analitycznych belki Timoszenki, więc nie ma siatki, którą trzeba by zagęszczać, i nie trzeba dzielić prętów, żeby uzyskać dokładne wykresy.

Od wersji 0.3.1 `solve()` niczego nie wypisuje na konsolę; wersja 0.3.0 przy każdym wywołaniu wypisywała wiersz w rodzaju `Solution took 9 [ms]`.

## Ponowne obliczenia po zmianie {#solving-again-after-a-change}

Zmiana liczb w modelu wymaga tylko kolejnego `solve()`. Zmiana tego, jakie równania w ogóle istnieją, wymaga wcześniej jeszcze jednej linijki:

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // zmieniły się stopnie swobody: ponumeruj je od nowa
solver.solve()
```

| Zmiana | Co dalej |
| --- | --- |
| Wartości obciążeń, nowe lub usunięte obciążenia | `solve()` |
| Współrzędne węzłów, materiały, przekroje, przeguby | `solve()` |
| Dodanie węzłów lub prętów | `codeNumberGenerated = false`, potem `solve()` |
| Usunięcie węzłów lub prętów: `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false`, potem `solve()` |
| Zmiana podpór węzła, `node.bcs` | `codeNumberGenerated = false`, potem `solve()` |

Jeśli zapomnisz o tym po dodaniu węzła, `solve()` zgłosi `TypeError`. Jeśli zapomnisz po zmianie podpory, solver **po cichu** policzy model ze starymi podporami. W razie wątpliwości ustaw tę flagę: numerowanie praktycznie nic nie kosztuje. Usuwając pręt, usuń też jego obciążenia z `lc.elementLoadList`, inaczej `solve()` zgłosi `RangeError` z powodu brakującego pręta.

Przy wielu wariantach jednego modelu, np. w analizie parametrycznej, prościej i równie szybko jest utworzyć dla każdego wariantu nowy solver: zob. [przykład z linią wpływu](/pl/solver/scripts#an-influence-line-as-csv).

## Gdy obliczenia się nie udają {#when-solving-fails}

Konstrukcja, która może się przemieszczać bez odkształcania, czyli mechanizm, ma osobliwą macierz sztywności. Czasem `solve()` to wykrywa i zgłasza wyjątek:

```text
Error: Linear system cannot be solved since matrix is singular
```

Często jednak nie: przez błędy zaokrągleń macierz wygląda na nieosobliwą i dostajesz przemieszczenia rzędu $10^{12}$ m albo rozsądnie wyglądające liczby dla konstrukcji, która może się swobodnie przesuwać. Na przykład belka na dwóch podporach przesuwnych rozwiązuje się bez żadnych zastrzeżeń, dopóki nic nie pcha jej w bok. Dlatego sprawdzaj podpory samodzielnie, a ogromne przemieszczenia traktuj jako oznakę mechanizmu.

Typowe przyczyny:

- za mało podpór, np. belka na dwóch podporach przesuwnych;
- podpory, które nie mogą utrzymać konstrukcji: wszystkie równoległe albo wszystkie skierowane w jeden punkt;
- o jeden przegub za dużo, np. trzy przeguby na jednej prostej;
- moment przyłożony do węzła, w którym wszystkie końce prętów mają przeguby.

Komunikat nie mówi, gdzie leży problem. Aplikacja EduBeam przed obliczeniami sprawdza, czy model nie jest mechanizmem, a jeśli jest – znajduje i animuje jego ruch; zbudowanie w niej tego samego modelu to często najszybszy sposób, żeby go zobaczyć. Strona [Rozwiązywanie problemów](/pl/reference/troubleshooting) wymienia typowe przyczyny.

Brakujący węzeł, materiał lub przekrój powoduje `RangeError` z jego nazwą. Brakujące parametry przekroju w ogóle nie powodują błędu: każdy wynik to `NaN`. Zob. [Materiały i przekroje](/pl/solver/materials-sections#cross-section).

## Wielkość modelu {#model-size}

Solver korzysta z macierzy pełnych i jest przeznaczony dla modeli o wielkości typowej dla zajęć. Na laptopie, w Node, ciąg prętów ułożonych w jednej linii rozwiązuje się w czasie około:

| Pręty | Stopnie swobody | Czas |
| --- | --- | --- |
| 50 | 150 | 0,1 s |
| 100 | 300 | 0,2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

Każde podwojenie modelu wydłuża czas od sześciu do dziewięciu razy.

Wszystkie zadania, ramy i kratownice z kursu statyki budowli mieszczą się w tym z łatwością. Solver nie jest przeznaczony do modeli z tysiącami prętów.

## Brak innych analiz {#no-other-analyses}

Ta wersja rozwiązuje tylko zadania statyki liniowej. Kod źródłowy zawiera solver zagadnienia własnego do wyznaczania częstotliwości drgań własnych, ale nie jest on częścią opublikowanego pakietu: `EigenValueDynamicSolver` nie da się zaimportować z `@edubeam/fem`.
