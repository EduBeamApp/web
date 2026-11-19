---
description: "Projekty EduBeamu i sesje desktopowego EduBeamu, link do modelu, osadzony podgląd, parametry URL, eksport obrazów i tabel wyników – wszystko w przeglądarce."
source: site
---

# Pliki, linki i eksport

:span{#import-eksport-i-udostepnianie}

Model możesz zapisać jako plik, wysłać jako link, osadzić na stronie WWW albo wyeksportować jako obraz lub tabelę. Wszystko w aplikacji [EduBeam]{.edubeam} dzieje się w Twojej przeglądarce i nic nie jest wysyłane na serwer: link do modelu dosłownie zawiera model.

::card-grid{cols="3"}
:::card{title="Plik projektu" icon="lucide:file-json" to="#save-a-project"}
`project.json` do archiwizacji, oddania prowadzącemu albo ponownego otwarcia.
:::
:::card{title="Link do modelu" icon="lucide:link" to="#share-a-link"}
Cały model w jednym adresie URL, do materiałów, slajdów i wiadomości.
:::
:::card{title="Obraz lub tabela" icon="lucide:image" to="#export-an-image"}
PNG lub SVG do sprawozdań, CSV do arkuszy kalkulacyjnych.
:::
::

## Zapisywanie projektu {#save-a-project}

**☰ → Zapisz projekt** lub <kbd>Ctrl</kbd>+<kbd>S</kbd> (na Macu <kbd>⌘</kbd>+<kbd>S</kbd>, jak przy każdym skrócie na tej stronie) pobiera plik `project.json`. Zawiera on węzły, elementy, materiały, przekroje (wraz z narysowanymi kształtami), obciążenia, linie wymiarowe oraz wersję aplikacji, która go zapisała. Nazwę pliku możesz dowolnie zmienić.

## Otwieranie projektu {#open-a-project}

**☰ → Otwórz projekt** lub <kbd>Ctrl</kbd>+<kbd>O</kbd>, a potem wybierz plik, albo **upuść plik w dowolnym miejscu okna aplikacji**. EduBeam otwiera:

- pliki `project.json` zapisane przez każdą wersję EduBeamu;
- sesje `.xml` zapisane przez **desktopowy EduBeam** w wersjach od 2.x do 3.5. Ich wartości nie mają jednostek, więc są wczytywane jako kN, kPa i m – jednostki, których używał jego podręcznik. EduBeam otwiera jeden przypadek obciążenia naraz: z sesji z kilkoma przypadkami otwiera pierwszy i wymienia te, które pominął.

Otwarcie zastępuje bieżący model, łącznie z jego materiałami i przekrojami. Model, który miałeś, nie przepada: <kbd>Ctrl</kbd>+<kbd>Z</kbd> go przywraca, a ponadto trafia na listę [Ostatnie modele](#recent-structures). Plik, którego EduBeam nie potrafi odczytać, zostanie odrzucony z komunikatem, a Twój model pozostanie bez zmian.

## Udostępnianie linku {#share-a-link}

Przycisk **Udostępnij model** na pasku aplikacji lub w menu ☰ otwiera okno *Udostępnij model przez URL*:

![Okno Udostępnij model przez URL](/screenshots/pl/c1-share.webp){.shot-lg}

- **Kopiuj** albo kliknięcie w dowolnym miejscu pola kopiuje link.
- **Otwórz link** otwiera go w nowej karcie, dzięki czemu zobaczysz to, co zobaczy odbiorca.
- **Udostępnij przez systemowe okno dialogowe** przekazuje link do systemowego menu udostępniania urządzenia, jeśli przeglądarka to obsługuje.
- **Krótszy link** (domyślnie włączony) zapisuje ten sam model w mniej więcej połowie znaków. Kopie EduBeamu starsze niż wersja 1.3.2 (z listopada 2026) odczytają go dopiero po aktualizacji, więc wyłącz tę opcję, gdy link ma od razu działać wszędzie.
- **Pokaż to, co widzę** (domyślnie wyłączone) sprawia, że link otwiera się z wykresami, obciążeniami i etykietami, które masz włączone, zamiast z opcjami wyświetlania odbiorcy.

Link ma postać `https://run.edubeam.app/?model=…` i koduje cały model. Każdy, kto go otworzy, dostaje własną kopię do edycji; zmiany **nie** są synchronizowane z powrotem, więc gdy model się zmieni, wyślij nowy link. Bardzo duże modele dają bardzo długie linki; w takim przypadku udostępnij plik projektu.

Gdy ktoś otworzy link, jego dotychczasowy model trafia na listę Ostatnie modele, a komunikat informuje, gdzie go znaleźć. Linki nigdy nie wygasają: link w zeszłorocznych materiałach do wykładu otworzy dziś ten sam model.

## Osadzanie podglądu {#embed-a-read-only-viewer}

Dodaj `&viewer=1` do linku do modelu, aby otworzyć model w **trybie podglądu**: pasek aplikacji, dolny pasek, cofanie i ponawianie, plakietki siatki i jednostek oraz celownik są ukryte, zostaje rysunek, przyciski dopasowania i wyśrodkowania oraz opcje wyświetlania. Nie otwiera się też okno powitalne ani informacje o wydaniu. Umieść ten adres URL w `<iframe>`, aby osadzić interaktywny model z możliwością powiększania w materiałach do wykładu, na stronie przedmiotu albo na slajdzie:

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![Rama trójprzegubowa w trybie podglądu](/screenshots/pl/viewer-mode.webp){.shot-lg}

Tryb podglądu służy do oglądania, ale nie jest zablokowany: odwiedzający mogą nadal przeciągać węzły i przełączać wykresy. Link w trybie podglądu otwarty samodzielnie, poza ramką, zastępuje model odwiedzającego tak jak każdy link, a jego model czeka na liście Ostatnie modele. Gdy podgląd jest osadzony na stronie innej witryny, większość obecnych przeglądarek daje ramce osobną pamięć, więc model odwiedzającego pozostaje nienaruszony – ale nie każda przeglądarka tak robi.

Do rysunku, który w ogóle nie potrzebuje aplikacji, np. statycznego wykresu na stronie, slajdzie czy w zestawie zadań, biblioteka graficzna [@edubeam/plot](/pl/plot) rysuje konstrukcje i ich wykresy z kodu. Interaktywne rysunki na tej witrynie powstają właśnie dzięki niej.

## Parametry URL {#url-parameters}

| Parametr | Działanie |
| --- | --- |
| `model=<data>` | Wczytuje zakodowany model i dopasowuje go do ekranu. Zapisuje go **Udostępnij model**. |
| `viewer=1` | [Tryb podglądu](#embed-a-read-only-viewer). |
| `show=<letters>` | Otwiera model z włączonymi dokładnie tymi warstwami, po jednej literze na warstwę: `N` siła normalna, `V` siła tnąca, `M` moment zginający, `U` postać odkształcona, `R` reakcje, `L` obciążenia, `S` podpory, `n` etykiety węzłów, `e` etykiety elementów. `show=MRLS` pokazuje moment zginający, reakcje, obciążenia i podpory. Zapisuje go **Pokaż to, co widzę**. |
| `lang=<code>` | Przełącza język interfejsu: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn` (chiński), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Od razu otwiera galerię przykładów. |

Parametry łączy się znakiem `&`, np. `?lang=pl&viewer=1&model=…`. Po ich odczytaniu EduBeam usuwa je z paska adresu. `lang` i `show` zostają zapamiętane jako ustawienia odwiedzającego, tak jakby wybrał je w aplikacji.

## Eksport obrazu {#export-an-image}

**☰ → Eksportuj obraz** lub <kbd>Ctrl</kbd>+<kbd>P</kbd> otwiera eksport obrazu. Rysunek jest układany od nowa dla wybranego rozmiaru, więc linie i etykiety zachowują swoją rzeczywistą grubość.

![Eksportuj obraz: wybierz warstwy, kadr i rozmiar, a potem pobierz lub skopiuj](/screenshots/pl/export-image.webp)

::div{.steps}

### Wybierz warstwy {#choose-the-layers}

Plakietki u góry wybierają, co jest rysowane: postać odkształcona, N, V, M i reakcje, a dalej podpory, obciążenia, etykiety węzłów i etykiety elementów. Na początku odpowiadają opcjom wyświetlania w widoku, a ich zmiana tutaj nie zmienia widoku.

### Wykadruj rysunek {#frame-the-drawing}

Wybierz proporcje (16:9, 4:3, 3:2 lub 1:1), **Pokaż wszystko** albo **Okno…**, aby zaznaczyć prostokąt na rysunku. Możesz też przeciągać krawędzie podglądu.

### Ustaw rozmiar {#set-the-size}

Szerokość i wysokość w pikselach albo **Skala**, np. 1 : 50, dla rysunku w skali na papierze (przy 96 DPI). **Wysokość wykresów** ustala rozmiar wykresów wyników, a **Przezroczyste tło** pomija białe tło. Jeśli wykresy lub etykiety się nie mieszczą, okno o tym informuje i proponuje zmniejszenie wykresów albo powiększenie obszaru rysunku.

### Zapisz obraz {#save-it}

**Pobierz PNG**, **Pobierz SVG** lub, jeśli przeglądarka na to pozwala, **Kopiuj do schowka**. Nazwy plików pochodzą od ich rozmiaru, np. `edubeam-512x512.svg`. Na ekranie o wysokiej rozdzielczości plik PNG ma więcej pikseli, niż wynika z ustawionej szerokości i wysokości, proporcjonalnie do gęstości pikseli ekranu, aby był tak samo ostry jak aplikacja; jego rozmiar w pikselach widać obok przycisków.

::

SVG pozostaje ostre w każdym rozmiarze i działa w Wordzie, Inkscape i LaTeX-u na Overleaf, dlatego jest najlepszym wyborem do sprawozdań i prac dyplomowych. Ten sam rozmiar zawsze kadruje konstrukcję tak samo, więc wykresy N, V i M eksportowane jeden po drugim dają się równo ułożyć obok siebie.

Aby tworzyć takie rysunki z kodu, np. po jednym do każdego zadania w zestawie, biblioteka @edubeam/plot zapisuje [samodzielny plik SVG](/pl/plot/functions#a-standalone-svg-file), który otwiera się w tych samych programach.

## Eksport wyników {#export-the-results}

**Eksportuj CSV** w zakładce **Wyniki** pobiera obie tabele wyników, łącznie z reakcjami, a **Kopiuj** umieszcza je w schowku do wklejenia w arkuszu kalkulacyjnym. Zob. [Eksport CSV i kopiowanie](/pl/essentials/results#export-csv-and-copy).

## Ostatnie modele {#recent-structures}

**☰ → Ostatnie modele** przechowuje 10 ostatnich modeli, które zostały wyczyszczone albo zastąpione linkiem, plikiem, przykładem, zadaniem *Narysuj pierwszą belkę* lub innym przywróceniem. Przy każdym widać miniaturę, to, co go zastąpiło, oraz liczbę węzłów i elementów. **Przywróć** przywraca wybrany model: model, który miałeś do tej pory, sam trafia na listę, a <kbd>Ctrl</kbd>+<kbd>Z</kbd> cofa przywrócenie. **Usuń** usuwa pozycję z listy.

![Ostatnie modele](/screenshots/pl/recent.webp){.shot-lg}

Lista jest przechowywana tylko w tej przeglądarce.

## Przykłady {#examples}

**☰ → Przykłady** otwiera galerię gotowych modeli dydaktycznych. Otwarcie jednego z nich zastępuje Twój model, a <kbd>Ctrl</kbd>+<kbd>Z</kbd> go przywraca. Te same modele, wraz z ćwiczeniami, znajdziesz na stronie [Przykłady](/pl/examples/) tego przewodnika.

![Galeria przykładów](/screenshots/pl/examples.webp){.shot-lg}

## Automatyczne zapisywanie {#automatic-persistence}

Twój model i ustawienia są zapisywane w pamięci lokalnej przeglądarki po każdej zmianie i przywracane, gdy wrócisz, nawet po zamknięciu przeglądarki. To udogodnienie, a nie kopia zapasowa: zapis jest związany z jednym profilem przeglądarki na jednym urządzeniu, okno prywatne go nie zachowuje, a wyczyszczenie danych witryny go usuwa. Ważną pracę zapisuj jako plik projektu. Wszystko, co jest przechowywane, wymienia sekcja [Co jest przechowywane w przeglądarce](/pl/essentials/units-settings#what-is-stored-in-your-browser).

## Format pliku projektu {#project-file-format}

`project.json` to zwykły, czytelny JSON. Oto belka ze strony [Szybki start](/pl/guide/quick-start), ze stalą i dwuteownikiem IPE 200 z bibliotek:

```json [project.json]
{
  "edubeam": true,
  "version": "1.3.4",
  "domain": {
    "materials": [
      {
        "label": "Steel (S235)",
        "d": 7850,
        "e": 210000000000,
        "g": 81000000000,
        "alpha": 0.000012
      }
    ],
    "crossSections": [
      {
        "label": "IPE 200 (approx)",
        "a": 0.002848,
        "iy": 0.00001943,
        "h": 0.2,
        "k": 0.3932584269662922
      }
    ],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [
      {
        "label": "1",
        "nodes": ["1", "2"],
        "mat": "Steel (S235)",
        "cs": "IPE 200 (approx)",
        "hinges": [false, false]
      }
    ],
    "loadCases": [
      {
        "label": "DefaultLC",
        "nodalLoads": [],
        "elementLoads": [
          { "type": "udl", "target": "1", "lcs": true, "values": [0, 12000] }
        ],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Wszystkie wartości są w **jednostkach SI** (m, N, Pa, rad), niezależnie od jednostek wyświetlanych w aplikacji. Współrzędne mają postać `[x, y, z]`, gdzie $y = 0$, a oś $z$ jest skierowana w dół. Podpory i składowe obciążeń używają identyfikatorów stopni swobody `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` obciążenia elementu | Wartości |
| --- | --- |
| `udl` | `values: [fx, fz]` w N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` w N/m |
| `concentrated` | `values: [Fx, Fz, My, a]` w N, N·m oraz m od węzła początkowego |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` w K; różnica temperatur to ΔTb − ΔTt |

`lcs: true` albo brak `lcs` oznacza obciążenie elementu w jego osiach lokalnych, `false` – w osiach globalnych. Pozostałe wpisy:

- **Obciążenia węzłowe**: `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, a dla obciążenia w osiach obróconej podpory dodatkowo `"lcs": true`.
- **Zadane przemieszczenia**: `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; pominięta składowa wynosi 0.
- Pliki zapisane przez aplikację zawierają też `date`, `commit`, osie obróconych podpór (`lcs` w węźle) i narysowane kształty przekrojów `shape`.

Ponieważ format jest prosty, możesz tworzyć modele skryptem lub w arkuszu kalkulacyjnym i otwierać je przez **Otwórz projekt**. Aby budować i rozwiązywać modele wyłącznie w kodzie, użyj solvera, na którym działa aplikacja: biblioteki obliczeniowej [@edubeam/fem](/pl/solver).
