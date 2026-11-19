---
description: "Czym jest EduBeam: darmowy program MES w przeglądarce do płaskich belek, ram i kratownic. Co potrafi, czego nie, dla kogo jest, jak czytać przewodnik i na jakich bibliotekach stoi."
source: site
---

# Wprowadzenie

[EduBeam]{.edubeam} to darmowa aplikacja do analizy statycznej **belek, ram i kratownic**, działająca w przeglądarce. Rysujesz konstrukcję, podpierasz ją i obciążasz, a solver metody elementów skończonych przelicza wykresy, reakcje i ugięcia po każdej zmianie. Nie ma przycisku *Oblicz*, niczego nie trzeba instalować ani zakładać konta.

::div{.actions}
[Uruchom EduBeam ↗](https://run.edubeam.app/?lang=pl){target="_blank"} [Szybki start w 10 minut](/pl/guide/quick-start)
::

![Rama trójprzegubowa w EduBeamie: obciążenia na pomarańczowo, reakcje na fioletowo, moment zginający na czerwono, a postać odkształcona na szaro](/screenshots/pl/hero.webp)

:span{#your-first-visit}

## Co potrafi {#what-it-does}

::card-grid{cols="2"}
:::card{title="Konstrukcje" icon="lucide:triangle" to="/pl/essentials/elements"}
Belki, belki ciągłe, ramy i kratownice w płaszczyźnie x–z, zbudowane z elementów belkowych Timoszenki. Przeguby końcowe zamieniają element w pręt kratownicy.
:::
:::card{title="Podpory" icon="lucide:anchor" to="/pl/essentials/nodes-supports#supports"}
Podporę wybierasz po symbolu: przegubowa nieprzesuwna lub przesuwna, utwierdzenie, utwierdzenie przesuwne albo dowolna kombinacja zablokowanych `Dx`, `Dz` i `Ry`. Do tego podpory ukośne i osiadanie podpór.
:::
:::card{title="Obciążenia" icon="lucide:arrow-down-to-line" to="/pl/essentials/loads"}
Siły i momenty w węzłach lub w dowolnym miejscu pręta, obciążenia liniowe równomierne i trapezowe, temperatura i zadane przemieszczenia.
:::
:::card{title="Przekroje" icon="lucide:shapes" to="/pl/essentials/elements#cross-sections"}
Biblioteki europejskie i amerykańskie albo dowolny wielokąt, który narysujesz. Aplikacja oblicza $A$, $I_y$, $I_z$, $I_{yz}$, osie główne i promienie bezwładności.
:::
:::card{title="Wyniki" icon="lucide:chart-spline" to="/pl/essentials/results"}
Wykresy **N**, **V** i **M**, postać odkształcona, reakcje, przemieszczenia węzłów, siły przywęzłowe i macierze sztywności elementów.
:::
:::card{title="Analiza" icon="lucide:calculator" to="/pl/elements/analysis"}
Statyka liniowa, dokładna dla modelu liniowego: nie ma siatki do zagęszczania. Gdy konstrukcja jest mechanizmem, EduBeam wyjaśnia dlaczego i animuje jej ruch.
:::
:::card{title="Pliki" icon="lucide:folder-open" to="/pl/essentials/import-export"}
Projekty jako JSON, całe modele jako linki, rysunki jako PNG lub SVG, wyniki jako CSV. Zastąpione modele nie przepadają, a nic nie opuszcza Twojego urządzenia.
:::
:::card{title="Jednostki" icon="lucide:ruler" to="/pl/essentials/units-settings"}
SI lub jednostki amerykańskie jednym kliknięciem albo osobno dla każdej wielkości. Oś z w dół albo – jak w podręcznikach – oś y w górę.
:::
::

## Czego (jeszcze) nie potrafi {#what-it-does-not-do-yet}

Lepiej znać ograniczenia od początku – oszczędzisz sobie czasu:

::div{.limits}
- **Tylko 2D.** Konstrukcja pracuje wyłącznie w swojej płaszczyźnie; ram przestrzennych nie zamodelujesz.
- **Tylko statyka liniowa.** Brak efektów drugiego rzędu (P–Δ), wyboczenia, dynamiki i plastyczności.
- **Jeden przypadek obciążenia.** Nie ma kombinacji ani obwiedni: każdy przypadek zapisz jako osobny plik lub link.
- **Brak ciężaru własnego.** Przyłóż go jako obciążenie liniowe.
- **Brak wymiarowania.** EduBeam podaje siły przekrojowe i przemieszczenia; sprawdzenie nośności według norm należy do Ciebie.
::

Jeśli brakuje Ci jakiejś funkcji, [utwórz zgłoszenie na GitHubie](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## Dla kogo jest EduBeam? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Studenci" icon="lucide:graduation-cap" to="/pl/practice"}
Szybka kontrola obliczeń ręcznych i zadania do ćwiczeń, które na bieżąco sprawdzają Twoje odpowiedzi.
:::
:::card{title="Prowadzący zajęcia" icon="lucide:presentation" to="/pl/guide/teaching"}
Pokazuj na żywo na projektorze, jak podpory, przeguby i obciążenia zmieniają siły przekrojowe – w 18 językach. Każdemu studentowi wydrukujesz inne kolokwium.
:::
:::card{title="Inżynierowie" icon="lucide:hard-hat" to="/pl/elements/analysis"}
Wstępne sprawdzenie, zanim otworzysz rozbudowany program desktopowy. Każdy krok rozwiązania jest opisany w dokumentacji.
:::
:::card{title="Programiści" icon="lucide:code-xml" to="#libraries"}
Solver i moduł rysujący, na których opiera się EduBeam, jako otwartoźródłowe biblioteki do Twojego kodu.
:::
::

## Jak poruszać się po przewodniku {#how-this-guide-is-organised}

Pasek boczny grupuje strony przewodnika tak jak poniżej. Przyciski **?** w aplikacji otwierają odpowiednią stronę tego przewodnika w Twoim języku.

::card-grid{cols="2"}
:::card{title="Pierwsze kroki" icon="lucide:flag" to="/pl/guide/quick-start"}
Ta strona i Szybki start: pierwsza belka w dziesięć minut.
:::
:::card{title="Modelowanie" icon="lucide:pencil-ruler" to="/pl/essentials/user-interface"}
Interfejs, węzły i podpory, elementy, materiały i przekroje, obciążenia, jednostki i ustawienia.
:::
:::card{title="Wyniki" icon="lucide:chart-spline" to="/pl/essentials/results"}
Wykresy i tabele wyników oraz to, jak sprawdzić je ręcznie.
:::
:::card{title="Udostępnianie i nauczanie" icon="lucide:share-2" to="/pl/essentials/import-export"}
Pliki projektów, linki do modeli, eksport obrazu i CSV oraz nauczanie z EduBeamem.
:::
:::card{title="Samouczki" icon="lucide:triangle" to="/pl/tutorials/inclined-beam"}
Belka pochyła, rama trójprzegubowa, kratownica płaska i belka ciągła z osiadającą podporą, każda zbudowana krok po kroku i sprawdzona ręcznie.
:::
:::card{title="Przykłady" icon="lucide:library" to="/pl/examples/"}
Sześć gotowych modeli otwieranych jednym kliknięciem, z ćwiczeniami i odpowiedziami.
:::
:::card{title="Podręcznik teoretyczny" icon="lucide:sigma" to="/pl/elements/conventions"}
Osie i konwencje znaków, element belkowy i element kratownicy oraz to, jak EduBeam rozwiązuje model.
:::
:::card{title="Pomoc" icon="lucide:life-buoy" to="/pl/reference/shortcuts"}
Klawiatura, mysz i dotyk, rozwiązywanie problemów i FAQ.
:::
::

## Zbuduj własne narzędzia {#libraries}

EduBeam opiera się na dwóch otwartoźródłowych bibliotekach, opisanych także w tym serwisie. Za ich pomocą rozwiążesz konstrukcje w skrypcie, wygenerujesz każdemu studentowi inne zadanie albo przygotujesz rysunki do slajdów i materiałów do wykładu.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/pl/solver"}
Solver metody elementów skończonych, na którym działa EduBeam, napisany w TypeScripcie: belkę zamodelujesz, rozwiążesz i odczytasz jej wyniki w kilkunastu linijkach kodu, w przeglądarce lub w Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/pl/plot"}
Komponenty Vue 3, które rysują rozwiązaną konstrukcję jako SVG, razem z obciążeniami, reakcjami i wykresami N, V i M.
:::
::

## Języki {#languages}

EduBeam mówi w 18 językach i uruchamia się w języku Twojej przeglądarki. Zmienisz go w **Ustawienia → Język i ustawienia regionalne** albo tutaj:

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

Język może też wybrać link za czytelnika: `run.edubeam.app/?lang=pl` otwiera aplikację po polsku.

## Autorzy i podziękowania {#authors-credits}

[EduBeam]{.edubeam} rozwija [Jan Voříšek](https://github.com/janvorisek) jako niezależny projekt. Aplikacja kontynuuje tradycję desktopowego EduBeamu dla systemów Windows i Linux, który stworzyli [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) i [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) w Katedrze Mechaniki [Wydziału Inżynierii Lądowej Czeskiego Uniwersytetu Technicznego w Pradze (ČVUT)](https://www.fsv.cvut.cz/en), i nadal otwiera zapisane w nim sesje. Solver aplikacji, [@edubeam/fem](/pl/solver), wyrósł z pierwszej wersji autorstwa Bořka Patzáka. Aplikacja i solver mają otwarty kod źródłowy (licencja GPL-3.0).

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Główny programista i projektant produktu","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Programista: obsługa dotykowa, wydajność rysowania, obciążenia i podpory","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"Pierwotny EduBeam i pierwszy solver MES","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Współtwórz {#contribute}

::card-grid{cols="3"}
:::card{title="Zgłoś problem" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Coś jest niejasne, błędne albo nie działa? Zgłoszenie na GitHubie trafia prosto do zespołu.
:::
:::card{title="Popraw tłumaczenie" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Teksty aplikacji są zapisane w osobnym pliku dla każdego języka; chętnie przyjmiemy pull request.
:::
:::card{title="Poleć dalej" icon="lucide:share-2"}
Pokaż EduBeam kolegom ze studiów i z pracy albo dodaj link do modelu w swoich notatkach.
:::
::
