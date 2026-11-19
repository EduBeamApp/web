---
description: "Darmowa analiza konstrukcji 2D w przeglądarce. Narysuj belkę, ramę lub kratownicę, dodaj obciążenia i od razu zobacz wykresy N, V, M, reakcje i ugięcia."
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "Darmowa analiza konstrukcji online"
  tagline: Narysuj belkę, ramę lub kratownicę, dodaj obciążenia i obserwuj, jak wykresy zmieniają się z każdą edycją. Pełne wyniki MES w przeglądarce – bez instalacji, bez konta i bez opłat.
  image:
    src: /screenshots/pl/hero.webp
    alt: Aplikacja EduBeam z rozwiązaną ramą
  actions:
    - theme: brand
      text: Uruchom aplikację
      link: https://run.edubeam.app/?lang=pl
    - theme: alt
      text: Przeczytaj przewodnik
      link: /pl/guide/introduction
    - theme: alt
      text: Zobacz przykłady
      link: /pl/examples/

features:
  - icon: ⚡
    title: Wyniki już podczas rysowania
    details: Nie ma przycisku „Oblicz”. Przeciągnij węzeł, zaznacz przegub albo zmień obciążenie, a N, V, M, reakcje i postać odkształcona od razu się przeliczą.
    link: /pl/essentials/results
    linkText: Odczytywanie wyników
  - icon: 🧑‍🏫
    title: Stworzony do nauczania
    details: Pierwsze kroki z przewodnikiem, wartości po najechaniu kursorem, solver, który wyjaśnia, dlaczego konstrukcja jest mechanizmem, i linki do modeli, które wstawisz do materiałów do wykładu.
    link: /pl/guide/teaching
    linkText: Nauczanie z EduBeamem
  - icon: 🌍
    title: Twój język, Twoje jednostki
    details: 18 języków interfejsu, jednostki SI lub amerykańskie a do wyboru oś z skierowana w dół albo – jak w podręcznikach – oś y w górę.
    link: /pl/essentials/units-settings
    linkText: Jednostki i ustawienia
  - icon: 🔗
    title: Udostępniaj, eksportuj, osadzaj
    details: Wyślij cały model jako link, zapisz go w pliku, wyeksportuj rysunek do PNG lub SVG, a tabele wyników do CSV.
    link: /pl/essentials/import-export
    linkText: Pliki i udostępnianie
---

## Zacznij tutaj {#start-here}

::div{.start-grid}

**Pierwszy raz w EduBeamie?** Przejdź przez [10-minutowy szybki start](/pl/guide/quick-start). Krok po kroku zamodelujesz belkę swobodnie podpartą i każdy wynik sprawdzisz ręcznie.

**Wiesz, co chcesz zbudować?** Przejdź od razu do [samouczka](/pl/tutorials/three-hinged-frame) albo otwórz gotowy [przykład](/pl/examples/) i go zmień.

**Prowadzisz zajęcia?** Zajrzyj na stronę [Nauczanie z EduBeamem](/pl/guide/teaching): linki do modeli w zadaniach, osadzany podgląd do slajdów i ćwiczenia.

::

::div{.shots}

![Kratownica: siły osiowe, rozciąganie dodatnie](/screenshots/pl/tut-truss.webp)

![Mechanizm pokazany wprost: EduBeam wyjaśnia, dlaczego nie da się go rozwiązać](/screenshots/pl/ui-mechanism.webp)

::

## Co można zamodelować {#what-you-can-model}

- **Belki, ramy i kratownice** w płaszczyźnie: belki ciągłe, ramy portalowe, łuki trójprzegubowe, kratownice o węzłach przegubowych.
- **Dowolne podpory**: przegubowe nieprzesuwne i przesuwne, utwierdzenia, utwierdzenia przesuwne, podpory ukośne i osiadanie podpór.
- **Obciążenia**: siły i momenty skupione, obciążenia liniowe równomierne i trapezowe, siły skupione w dowolnym miejscu pręta oraz temperatura.
- **Dowolne przekroje**: z biblioteki (IPE, HEA, AISC W, HSS, prostokąty, rury) albo narysowane jako wielokąt – charakterystyki przekroju EduBeam obliczy sam.

Więcej znajdziesz we [Wprowadzeniu](/pl/guide/introduction).

::elementarium-promo
::
