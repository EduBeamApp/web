---
description: "Dlaczego EduBeam nie pokazuje wyników i jak to naprawić: wyjaśnienie każdego błędu i ostrzeżenia, wyniki, które wyglądają źle, oraz pliki i linki, które się nie otwierają."
source: site
---

# Rozwiązywanie problemów

Gdy modelu nie da się rozwiązać, [EduBeam]{.edubeam} podaje przyczynę w komunikacie w lewym górnym rogu widoku, a przycisk **Pokaż szczegóły** wymienia wszystkie problemy w pełnym brzmieniu. Wybierz poniżej tytuł okna, które zobaczyłeś: przy każdym komunikacie wyjaśniamy, co oznacza i jak usunąć problem.

::card-grid{cols="2"}
:::card{title="Model nie jest jeszcze gotowy do obliczeń" icon="lucide:circle-dashed" to="#still-needed"}
Niebieska plakietka **Brak podpór**. Wszystko w porządku: konstrukcja po prostu nie jest jeszcze podparta.
:::
:::card{title="Nie można rozwiązać modelu" icon="lucide:circle-x" to="#errors"}
Czerwony komunikat. Podpory, które nie utrzymują konstrukcji, przeguby, które tworzą mechanizm, element o zerowej długości.
:::
:::card{title="Ostrzeżenia modelu" icon="lucide:triangle-alert" to="#warnings"}
Żółty komunikat. Model jest rozwiązany, ale coś prawdopodobnie nie jest tak, jak zamierzałeś.
:::
:::card{title="Wyniki wyglądają źle" icon="lucide:scale" to="#results-look-wrong"}
Obciążenia działające w górę, ugięcia różniące się o rzędy wielkości, znak, który wydaje się odwrócony.
:::
::

## Komunikaty {#messages}

### Co oznaczają kolory {#read-the-message}

| Widzisz | Oznacza to |
| --- | --- |
| Niebieską plakietkę **Brak podpór** | Model jest niedokończony. Dodaj podpory. Wskaż plakietkę kursorem, a przerywany zarys pokaże, jak konstrukcja może się jeszcze poruszać. |
| **Czerwony** komunikat | Coś uniemożliwia obliczenia. Komunikat nazywa problem albo, gdy jest ich kilka, brzmi *Błędy w modelu: n*. EduBeam zakreśla na rysunku węzły, których to dotyczy. |
| **Żółty** komunikat | Ostrzeżenia. Model i tak został rozwiązany. Gdy jest ich kilka, komunikat brzmi *Ostrzeżenia w modelu: n*. |
| *Nie zdefiniowano materiałów.* / *Nie zdefiniowano przekrojów.* | Elementy potrzebują jednego i drugiego. Dodaj brakujący przyciskiem **Dodaj nowy** obok komunikatu. |

**Pokaż szczegóły** otwiera okno zatytułowane *Model nie jest jeszcze gotowy do obliczeń*, *Nie można rozwiązać modelu* lub *Ostrzeżenia modelu*. Jego przełącznik pokazuje lub ukrywa, jak konstrukcja może się poruszać, a link **Rozwiązywanie problemów** prowadzi tutaj.

![Okno Nie można rozwiązać modelu z przełącznikiem, który pokazuje, jak konstrukcja może się poruszać](/screenshots/pl/ui-diagnostics.webp){.shot-lg}

Na rysunku:

- **✕** na czerwonym komunikacie zwija go do małej plakietki *Nie można rozwiązać modelu*, aby zrobić miejsce na małym ekranie. Kliknij plakietkę, aby ją rozwinąć.
- Przycisk z **okiem** na czerwonym komunikacie pokazuje lub ukrywa przerywany zarys ruchu. **Ustawienia → Ustawienia widoku → Sprawdzanie modelu** wyłącza zarys i jego animację na stałe.
- **✕** na żółtym komunikacie ukrywa ostrzeżenia.

### Do uzupełnienia {#still-needed}

Model nie jest błędny, tylko niedokończony. Wskaż plakietkę kursorem, aby zobaczyć krótki tekst; pełny pokazuje okno.

| Komunikat | Znaczenie i rozwiązanie |
| --- | --- |
| *Konstrukcja potrzebuje podpór, aby można ją było obliczyć.* <br> *Aby model był stateczny w analizie 2D, potrzebuje co najmniej 3 podpartych stopni swobody.* | Łącznie mniej niż trzy zablokowane kierunki. Dodaj podpory. |
| *Część z węzłami … potrzebuje podpór.* <br> *Oddzielna część konstrukcji (węzły …) ma mniej niż 3 podparte stopnie swobody i może się swobodnie przemieszczać.* | Model składa się z kilku części, a jedna z nich „pływa”. Połącz ją z resztą albo ją podeprzyj. |
| *Części konstrukcji bez podpór: n.* | Kilka części „pływa”. Ich listę zobaczysz po kliknięciu **Pokaż szczegóły**. |

### Błędy {#errors}

Coś uniemożliwia obliczenia. Czerwony komunikat pokazuje krótki tekst, okno – pełny.

| Komunikat | Znaczenie i rozwiązanie |
| --- | --- |
| *Podpory nie utrzymują konstrukcji: nadal może przesuwać się poziomo / przemieszczać się pionowo / swobodnie się obracać / przemieszczać się jak ciało sztywne.* <br> *Konstrukcja ma wystarczającą liczbę podpór, ale nie utrzymują jej one: nadal może …* | Więzów jest dość, ale wszystkie są równoległe albo ich kierunki działania przecinają się w jednym punkcie, jak przy trzech podporach przesuwnych pod belką poziomą. Przerywany zarys pokazuje ruch; obróć lub przesuń jedną z podpór. |
| *Część z węzłami … nie jest utrzymana: nadal może …* <br> *Oddzielna część konstrukcji (węzły …) ma wystarczającą liczbę podpór, ale nie utrzymują jej one: nadal może …* | To samo dla jednej części modelu, który składa się z kilku części. |
| *Przeguby w węźle … pozwalają konstrukcji się poruszać.* <br> *Podpory utrzymują konstrukcję, ale nadal jest ona mechanizmem: jej pręty mogą się obracać wokół przegubów w węźle …* | Przeguby pozwalają prętom obracać się względem siebie, jak w ramie na dwóch podporach przegubowych z przegubem na szczycie każdego słupa albo w kwadracie z prętów połączonych przegubowo bez krzyżulca. Usuń przegub albo dodaj pręt lub podporę. |
| *Konstrukcja jest niestabilna: porusza się niemal bez oporu.* <br> *Konstrukcja jest niestateczna – praktycznie bez oporu przemieszcza się: węzeł … poziomo (Dx) …* | Konstrukcja jest prawie mechanizmem albo ma sztywność bliską zeru. Pełny komunikat wymienia węzły i kierunki. Sprawdź podpory, przeguby oraz wartości `E`, `A` i `Iy`. |
| *Konstrukcja jest mechanizmem: może się poruszać bez oporu.* <br> *Konstrukcja jest mechanizmem: macierz sztywności jest osobliwa.* | Coś może się swobodnie poruszać, a powyższe sprawdzenia tego nie wychwyciły. Sprawdź, czy każda część jest utrzymywana przez co najmniej trzy więzy i czy przeguby końcowe nie pozostawiają pręta swobodnie obracającego się. |
| *Element … ma zerową długość: węzły … i … leżą w tym samym punkcie.* | Dwa węzły jednego elementu leżą jeden na drugim. Przesuń jeden z nich albo usuń element. |
| *Element … ma ten sam węzeł na obu końcach.* | Usuń element i narysuj go ponownie między dwoma różnymi węzłami. |
| *Element … odwołuje się do nieistniejącego węzła / materiału / przekroju …* | Obiekt, którego element używa, został usunięty, zwykle w ręcznie edytowanym pliku projektu. Przypisz elementowi istniejący obiekt w tabeli *Elementy*. |
| *Element … musi odwoływać się do dokładnie 2 węzłów.* | Uszkodzony element w zaimportowanym pliku. Usuń go i narysuj ponownie. |
| *Obciążenie węzłowe #n odwołuje się do nieistniejącego węzła …* <br> *Zadane przemieszczenie #n odwołuje się do nieistniejącego węzła …* | Usuń obciążenie albo przypisz mu istniejący węzeł. |
| *Obciążenie elementu #n odwołuje się do nieistniejącego elementu …* | Usuń obciążenie. |
| *Obliczenia nie powiodły się z powodu wewnętrznej niespójności modelu.* | Ogólny błąd. Cofnij ostatni krok albo zapisz projekt i [zgłoś problem](#reporting-a-bug). |

### Ostrzeżenia {#warnings}

Model i tak jest rozwiązany, ale sprawdź te pozycje:

| Komunikat | Znaczenie i rozwiązanie |
| --- | --- |
| *Węzeł … nie jest połączony z żadnym elementem i jest pomijany w obliczeniach.* | Luźny węzeł. Usuń go albo połącz z konstrukcją. |
| *Węzeł … jest podparty, ale nie łączy się z nim żaden element, więc podpora niczego nie przenosi.* | Podpora w luźnym węźle. |
| *Obciążenie węzłowe #n zawiera nieprawidłowe wartości.* <br> *Zadane przemieszczenie #n zawiera nieprawidłowe wartości.* | Składowa, która nie jest liczbą. Edytuj obciążenie. |

### Podczas edycji {#while-editing}

Te komunikaty otwierają się w oknie przeglądarki w trakcie pracy, a model pozostaje bez zmian:

| Komunikat | Znaczenie i rozwiązanie |
| --- | --- |
| *Najpierw dodaj materiał.* <br> *Najpierw dodaj przekrój.* | Element potrzebuje jednego i drugiego. Dodaj je w zakładce *Materiały* lub *Przekroje*, a potem narysuj element ponownie. |
| *Wybierz materiał i przekrój.* | W oknie **Dodaj element** jedno pole jest puste. Wybierz oba. |
| *Etykieta … jest już używana.* | Etykiety węzłów, elementów, materiałów i przekrojów nie mogą się powtarzać. Wybierz inną. |
| *Dla tego węzła istnieje już zadane przemieszczenie. Najpierw je usuń.* | Węzeł może mieć tylko jedno zadane przemieszczenie. Edytuj istniejące albo najpierw je usuń. |

## Nic się nie rysuje {#no-results-are-drawn}

Gdy nie pojawia się żaden wykres, sprawdź w tej kolejności:

::div{.steps}

### Sprawdź opcje wyświetlania {#check-the-display-options}

Jeśli nie ma żadnego komunikatu, model jest rozwiązany: wykres może być po prostu wyłączony. Zaznacz **M<sub>y</sub>(x)** albo inny wynik w opcjach wyświetlania w prawym górnym rogu widoku; przycisk ⚙ nad nimi pokazuje panel. Model bez żadnego obciążenia ma wszędzie zerowe wyniki, więc też nie ma czego rysować.

### Sprawdź podpory {#check-the-supports}

Solver potrzebuje co najmniej trzech zablokowanych kierunków, a podpory muszą razem uniemożliwić konstrukcji przesunięcie i obrót. Belka na dwóch podporach przesuwnych ma tylko dwa i może się przesunąć: zmień jedną z nich na **Przegub** (podporę przegubową nieprzesuwną). Trzy równoległe podpory przesuwne albo podpory, których kierunki działania przecinają się w jednym punkcie, również jej nie utrzymają. Zobacz [Węzły i podpory](/pl/essentials/nodes-supports#supports).

### Sprawdź, czy elementy są połączone {#check-the-connections}

Dwa węzły o tych samych współrzędnych to nadal dwa oddzielne węzły, a część, która styka się z resztą tylko w tym miejscu, „pływa”. Usuń zbędny węzeł i połącz elementy ponownie. Gdy wstawiasz węzeł na elemencie, wybierz **Połącz z konstrukcją**, aby podzielić element w tym miejscu.

### Policz przeguby {#count-the-hinges}

Rama na dwóch podporach przegubowych z przegubem na szczycie każdego słupa albo kwadrat z prętów połączonych przegubowo bez krzyżulca jest mechanizmem. EduBeam zakreśla przeguby i animuje ruch przerywanym zarysem. Zobacz [Przeguby końcowe](/pl/essentials/elements#end-hinges).

### Poszukaj zerowej sztywności {#look-for-zero-stiffness}

`E`, `A` lub `Iy` wpisane jako 0 albo w złej jednostce sprawiają, że część konstrukcji porusza się niemal bez oporu. EduBeam zgłasza wtedy, że konstrukcja jest *niestabilna*.

::

## Wyniki wyglądają źle {#results-look-wrong}

| Objaw | Prawdopodobna przyczyna |
| --- | --- |
| Obciążenia działają w górę | Globalna **oś z jest skierowana w dół**, więc dodatnie `Fz` lub `fz` działa w dół, a wartości ujemne w górę. Przy osi y w górę jest odwrotnie. Zobacz [Obciążenia](/pl/essentials/loads#sign-convention-in-one-line). |
| Ugięcie różni się o rzędy wielkości | Pomyłka w jednostkach: `E` wpisane w Pa, gdy pole oczekuje MPa, albo `Iy` w cm⁴, gdy pole oczekuje m⁴. Plakietka jednostek w prawym dolnym rogu widoku pokazuje jednostki każdego pola. |
| Ugięcie nieco większe niż ze wzoru z podręcznika | Odkształcenie postaciowe belki Timoszenki. Zobacz [Sprawdzanie wyników ręcznie](/pl/guide/verification#shear-deformation). |
| Znak wydaje się zły | Znak odczytuj z wartości, a nie ze strony, po której narysowany jest wykres: dodatni M rozciąga włókna dolne. Siły przywęzłowe w *Wynikach elementów* są podane w osiach lokalnych elementu, a nie według konwencji N-V-M. Zobacz [Odczytywanie znaku](/pl/essentials/results#reading-the-sign). |
| Wykres jest po „złej” stronie | Strona to ustawienie wyświetlania: moment zginający po stronie rozciąganej lub ściskanej, N i V po dowolnej stronie linii przerywanej. Zmienisz to w **Ustawienia → Ustawienia widoku → Wykresy sił wewnętrznych**. |
| Dwa jednakowe słupy mają przeciwne znaki siły tnącej | Znak V zależy od kierunku każdego elementu. Aby je porównać, zamień węzły jednego z nich. |
| Liczby typu `4 · 10¹` | Ustawiony jest format liczb *Naukowy*. Wybierz *Automatyczny* w **Ustawienia → Język i ustawienia regionalne → Format liczb**. |
| Wykresy są ogromne lub malutkie | Dotyczy to tylko rysunku. Dostosuj ustawienie **Skala wyników** w **Ustawienia → Ustawienia widoku**. |
| Obciążenie w osiach lokalnych działa w złą stronę | Lokalna oś x elementu biegnie od jego węzła *początkowego* do *końcowego*. Zamień węzły albo zmień znak. |
| Obciążenie pręta pochyłego działa w złym kierunku | **LCS** jest domyślnie zaznaczone, więc `fz` działa prostopadle do pręta. Odznacz je, aby uzyskać obciążenie pionowe. |
| Obciążenie termiczne nic nie zmienia | Konstrukcja statycznie wyznaczalna odkształca się pod wpływem temperatury swobodnie, bez sił przekrojowych. Jeśli nie widać też odkształcenia, sprawdź, czy α nie jest równe 0, a przy różnicy temperatur – czy ustawiono wysokość przekroju $h$. |

## Pliki i linki {#files-and-links}

| Objaw | Rozwiązanie |
| --- | --- |
| *Nie udało się zaimportować pliku. Sprawdź format pliku.* | Plik nie jest ani projektem EduBeamu, ani sesją desktopowego EduBeamu. Twój model pozostał bez zmian. |
| *Ta sesja programu EduBeam ma kilka przypadków obciążenia, ale otworzyć można tylko jeden.* | Sesja desktopowego EduBeamu z kilkoma przypadkami obciążenia: EduBeam otwiera pierwszy i wymienia te, których nie otworzył. |
| Link do modelu otwiera zamiast tego Twój stary model | Link został obcięty lub zmieniony, np. przez program pocztowy, który podzielił go na kilka wierszy. EduBeam ignoruje link, którego nie potrafi odczytać, i zachowuje Twój model. Skopiuj cały link ponownie. |
| Krótszy link nie otwiera się u kolegi | Jego kopia EduBeamu jest starsza niż wersja 1.3.2. Wystarczy, że odświeży aplikację; możesz też udostępnić model z wyłączoną opcją **Krótszy link**. Zobacz [Udostępnianie linku](/pl/essentials/import-export#share-a-link). |

## Problemy z interfejsem {#interface-issues}

| Objaw | Rozwiązanie |
| --- | --- |
| Skróty nie działają | Najpierw kliknij rysunek: pojedyncze klawisze są ignorowane, gdy aktywne jest pole tekstowe. Na Macu używaj <kbd>Cmd</kbd> zamiast <kbd>Ctrl</kbd>. Zobacz [Klawiatura, mysz i dotyk](/pl/reference/shortcuts). |
| <kbd>Delete</kbd> nic nie robi na Macu | Klawisz oznaczony *delete* na klawiaturze Maca to Backspace. Naciśnij <kbd>Fn</kbd>+<kbd>Delete</kbd>. |
| Nie da się przesunąć widoku | Widok przesuwa się środkowym lub prawym przyciskiem myszy; wybierzesz go w **Ustawienia → Sterowanie i skróty**. Na gładziku kliknij i przeciągnij dwoma palcami. Na ekranie dotykowym przeciągnij jednym palcem. |
| Mój model zniknął | Otwarcie linku, pliku lub przykładu oraz wyczyszczenie modelu zachowują stary model: **☰ → Ostatnie modele** albo <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Link informuje o tym na dole ekranu w chwili otwarcia: *Otwarto udostępniony model. Poprzedni znajdziesz w Ostatnich modelach.*, z przyciskiem **Pokaż**. |
| Zły język | **Ustawienia → Język i ustawienia regionalne** albo dodaj `?lang=pl` do adresu. |
| Zmiany ustawień się nie zapisują | Pamięć lokalna przeglądarki (local storage) jest zablokowana, np. w oknie prywatnym lub w ścisłym trybie prywatności. Potrzebują jej ustawienia, zapisany model i Ostatnie modele. |

## Zgłaszanie błędu {#reporting-a-bug}

Utwórz [zgłoszenie na GitHubie](https://github.com/janvorisek/edubeam/issues), podając przeglądarkę i system operacyjny, co zrobiłeś i czego się spodziewałeś. Najbardziej przydaje się **link do modelu** lub **plik projektu**, który pokazuje problem.
