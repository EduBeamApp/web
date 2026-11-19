---
description: "Rysowanie elementów belkowych w EduBeamie, przeguby końcowe dla połączeń przegubowych i prętów kratownic oraz materiały i przekroje z bibliotek lub z własnego wielokąta."
source: site
---

# Elementy, materiały i przekroje

Każdy element w aplikacji [EduBeam]{.edubeam} to belka między dwoma węzłami, z materiałem i przekrojem. Rysujesz elementy między węzłami, zwalniasz ich końce przegubami tam, gdzie konstrukcja ma połączenia przegubowe, a materiały i przekroje wybierasz z bibliotek albo definiujesz sam.

## Element belkowy {#the-beam-element}

Jest jeden typ elementu: **płaska belka Timoszenki** w płaszczyźnie x–z, z trzema stopniami swobody na każdym końcu (`Dx`, `Dz`, `Ry`). Przenosi siłę normalną, siłę tnącą i moment zginający oraz uwzględnia [odkształcenie postaciowe](#shear-deformation). Pręt kratownicy to ten sam element z [przegubami na obu końcach](#end-hinges). Sformułowanie elementu opisuje strona [Element belkowy](/pl/elements/beam) w podręczniku teoretycznym.

Wyniki wzdłuż elementu są dla modelu liniowego dokładne, więc **jeden element na pręt wystarczy**. Węzeł wewnątrz pręta dodawaj tylko tam, gdzie potrzebujesz podpory, przegubu, zmiany przekroju albo punktu, w którym chcesz odczytać przemieszczenia. Do siły skupionej węzeł nie jest potrzebny: [obciążenie skupione](/pl/essentials/loads#concentrated-load) można przyłożyć w dowolnym miejscu elementu.

## Dodawanie elementów {#adding-elements}

Element potrzebuje materiału i przekroju, więc dodaj je najpierw (zob. [Materiały](#materials) i [Przekroje](#cross-sections)). Dopóki ich nie ma, widok pokazuje *Nie zdefiniowano materiałów.* lub *Nie zdefiniowano przekrojów.* z przyciskiem **Dodaj nowy**.

- **Wybierając węzły.** Zakładka *Elementy* → **Dodaj element** (przycisk z ikoną **+**) albo prawy przycisk myszy na płótnie → *Dodaj element*. Wybierz **Węzeł początkowy** i **Węzeł końcowy**, w razie potrzeby zaznacz **Przegub** pod jednym z nich, a potem wybierz **Materiał** i **Przekrój**. Potrzebne są co najmniej dwa węzły.
- **Klikając.** Zakładka *Elementy* → **Dodaj element** (przycisk z ikoną kursora) albo przytrzymaj <kbd>Ctrl</kbd> przy wyborze *Dodaj element* w menu płótna. Kliknij węzeł (albo puste płótno, co utworzy nowy węzeł), a potem następny; klikaj dalej, aby narysować ciąg elementów, i naciśnij <kbd>Esc</kbd> lub **Anuluj**, aby skończyć. Pasek u góry ustawia **Przegub na początku** i **Przegub na końcu** dla każdego rysowanego elementu. Elementy dostają pierwszy materiał i pierwszy przekrój modelu.

![Okno Dodaj element](/screenshots/pl/qs-element.webp){.shot-md}

## Kierunek elementu {#element-direction}

Każdy element ma własne **osie lokalne**. Lokalna oś x biegnie od **węzła początkowego** do **węzła końcowego**; lokalna oś z to oś x obrócona na ekranie o 90° zgodnie z ruchem wskazówek zegara. W elemencie narysowanym od lewej do prawej osie lokalne pokrywają się z globalnymi. **Linia przerywana** rysowana wzdłuż każdego elementu oznacza jego lokalną stronę +z, czyli „włókna dolne”.

![Rama portalowa narysowana A → B → C → D: linie przerywane wszystkich trzech elementów leżą po wewnętrznej stronie ramy](/screenshots/pl/p2b-element-direction.webp){.shot-md}

W tej ramie element 1 biegnie w górę od A do B, więc jego lokalna oś z, a z nią linia przerywana, jest skierowana w prawo; element 3 biegnie w dół od C do D, więc jego linia przerywana leży po lewej. Gdy narysujesz ramę portalową w tej kolejności, wszystkie linie przerywane znajdą się po wewnętrznej stronie.

Kierunek ma znaczenie dla:

- obciążeń podanych w osiach lokalnych (zaznaczone **LCS**), zob. [Obciążenia elementów](/pl/essentials/loads#element-loads);
- pola **Pozycja obciążenia od węzła początkowego** w obciążeniu skupionym;
- kolejności [sił przywęzłowych](/pl/elements/conventions#end-forces-element-results-table) w wynikach: `X12, Z12, M12` w węźle początkowym, `X21, Z21, M21` w węźle końcowym;
- tego, która strona jest „stroną przerywaną” w [ustawieniach wykresów](/pl/essentials/units-settings#viewer-settings).

Aby odwrócić element, naciśnij **Zamień kolejność węzłów** (strzałki między dwoma węzłami w tabeli *Elementy*).

## Przeguby końcowe {#end-hinges}

Przegub końcowy zwalnia moment zginający na jednym końcu elementu: moment jest tam zerowy, a koniec może się obracać niezależnie od węzła.

- **Jeden przegub** tworzy połączenie przegubowe (przegub wewnętrzny) w belce lub ramie.
- **Dwa przeguby** tworzą **pręt kratownicy**, który przenosi wyłącznie siłę normalną.

Przeguby zaznaczysz w jednym z tych miejsc:

- w kolumnie **Przeguby końcowe** tabeli *Elementy*, po jednym polu wyboru dla każdego końca;
- w polach **Przegub** w oknie **Dodaj element** albo w panelu elementu → **Edytuj element**;
- w polach **Przegub na początku** i **Przegub na końcu** na pasku u góry podczas rysowania myszą.

![Tabela Elementy ramy trójprzegubowej: element 2 ma przegub na końcu, w węźle C](/screenshots/pl/elements-table.webp)

### Jeden przegub: przegub wewnątrz konstrukcji {#one-hinge-a-pin-inside-the-structure}

Ta sama belka ciągła o dwóch przęsłach po 5 m, obciążona 10 kN/m. Po prawej element 1 ma przegub końcowy w B: moment nad podporą spada do zera, a każde przęsło przenosi swoje obciążenie jak belka swobodnie podparta.

::div{.shots}

:::model-figure{caption="Belka ciągła: M = −31,25 kNm nad B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Przegub w B: M = 0 nad B, 31,25 kNm w każdym przęśle"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [{ nodes: [A, B], hinges: [false, true] }, [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

::

Ręcznie: w belce ciągłej $M_B = -qL^2/8 = -31{,}25\ \text{kNm}$, a w każdym przęśle co najwyżej $9qL^2/128 = 17{,}58\ \text{kNm}$; z przegubem $M_B = 0$ i $M_{max} = qL^2/8 = 31{,}25\ \text{kNm}$ w środku każdego przęsła. Przegub odciąża podporę, ale prawie podwaja momenty przęsłowe. Belkę z przegubem wewnętrznym do rozwiązania ręcznie, ze sprawdzaniem odpowiedzi na bieżąco, znajdziesz w [zadaniu G2048](/pl/practice?p=G2048).

### Dwa przeguby: pręt kratownicy {#both-hinges-a-truss-bar}

Wspornik przyścienny złożony z dwóch prętów, każdy z przegubami na obu końcach, obciążony w węźle B siłą 20 kN. Pręty przenoszą wyłącznie siłę normalną, a wykres momentów jest pusty.

::model-figure{caption="Cięgno AB: N = +26,67 kN (rozciąganie); zastrzał CB: N = −33,33 kN (ściskanie)"}
---
nodes: { A: [0, 0], B: [4, 0], C: [0, 3] }
supports: { A: pin, C: pin }
members: [{ nodes: [A, B], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: B, fz: 20 }
results: [N, M]
show: [nodeLabels]
---
::

Ręcznie: zastrzał ma długość 5 m i wznosi się o 3 m, więc $N_{CB} = -20 \cdot 5/3 = -33{,}33\ \text{kN}$, a cięgno równoważy jego składową poziomą, $N_{AB} = 33{,}33 \cdot 4/5 = 26{,}67\ \text{kN}$. W ten sposób całą kratownicę buduje samouczek [Kratownica płaska](/pl/tutorials/truss), a kratownice do rozwiązania ręcznie znajdziesz na stronie [Zadania ze statyki](/pl/practice?p=T2048).

### Przegub zakładaj na element, nie na węzeł {#hinge-the-element-not-the-node}

Przegub należy do jednego końca jednego elementu: pozwala temu końcowi obracać się niezależnie, a wszystkie pozostałe elementy w węźle pozostają z nim połączone sztywno. Gdzie spotykają się dwa pręty, jeden przegub tworzy połączenie przegubowe; gdzie spotyka się ich więcej, załóż przeguby na wszystkie oprócz jednego. W węźle kratownicy, gdzie każdy pręt jest prętem kratownicy, przeguby mają wszystkie pręty.

Węzeł, w którym wszystkie elementy mają przeguby, nie ma sztywności obrotowej. EduBeam dopuszcza taki węzeł i podaje jego obrót równy 0. Jeśli przeguby zamieniają konstrukcję w mechanizm, EduBeam je zakreśla i pokazuje, jak konstrukcja się porusza; zob. [Rozwiązywanie problemów](/pl/reference/troubleshooting#messages).

## Edycja i usuwanie {#editing-and-deleting}

| Aby | Zrób tak |
| --- | --- |
| Zmienić węzły, przeguby, materiał lub przekrój | Kliknij element → **Edytuj element** albo zmień go w tabeli *Elementy*. |
| Odwrócić go | **Zamień kolejność węzłów** w tabeli *Elementy*. |
| Zmienić jego nazwę | Wpisz nową etykietę w kolumnie *Element*. |
| Zobaczyć jego macierz sztywności | Kliknij go → **Macierz sztywności** albo przycisk macierzy w kolumnie *Akcje*. Okno pokazuje macierz elementu 6 × 6 w osiach globalnych, w jednostkach SI (N i m) niezależnie od wyświetlanych jednostek, z przegubami końcowymi uwzględnionymi już przez kondensację. Przydaje się do sprawdzenia ręcznej agregacji. |
| Usunąć go | Kliknij go → **Usuń**, × w tabeli albo zaznacz go i naciśnij <kbd>Delete</kbd>. Razem z nim znikają jego obciążenia. |

![Panel elementu](/screenshots/pl/ui-element-menu.webp){.shot-xs}

## Materiały {#materials}

Zakładka *Materiały* → **Dodaj materiał** albo **Biblioteka materiałów**, aby wybrać gotowy. Wiele elementów może korzystać z jednego materiału; jego zmiana aktualizuje je wszystkie.

| Pole | Jednostka | Do czego służy |
| --- | --- | --- |
| Moduł Younga $E$ | MPa | Sztywność osiowa i giętna, $EA$ i $EI_y$. Stal 210 000 MPa, beton ok. 30 000 MPa, drewno ok. 11 000 MPa. |
| Moduł Kirchhoffa $G$ | MPa | Sztywność na ścinanie $kGA$. O ile współczynnik $k$ przekroju nie jest ogromny, wprowadza [odkształcenie postaciowe](#shear-deformation): większe ugięcia, a w konstrukcji statycznie niewyznaczalnej także inne siły przekrojowe. $G = E/(2(1+\nu))$: stal ok. 81 000 MPa. |
| Gęstość $\rho$ | kg/m³ | Zapisywana z materiałem, ale nieużywana: obciążenia ciężarem własnym nie ma. |
| Współczynnik rozszerzalności cieplnej $\alpha$ | 1/K | Używany przez [obciążenia termiczne](/pl/essentials/loads#temperature-load). Stal $12 \times 10^{-6}$ 1/K. |

Jednostki w tabeli to domyślne jednostki SI; zmieniają się zgodnie z [ustawieniami](/pl/essentials/units-settings#units), więc w jednostkach amerykańskich E i G są w ksi, gęstość w lb/ft³, a α w 1/°F.

Nowy materiał ma na początku $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2{,}4$, czyli $\nu = 0{,}2$), $\rho$ = 1000 kg/m³ i $\alpha = 12 \times 10^{-6}$ 1/K; w jednostkach amerykańskich jest to stal ASTM A992. Dla stali zmień $G$ na 81 000 MPa albo wybierz stal z biblioteki.

![Okno Dodaj materiał](/screenshots/pl/qs-material.webp){.shot-md}

**Biblioteka materiałów** (także *Lub wybierz z biblioteki* w oknie Dodaj materiał) pokazuje najpierw materiały metryczne (EN), a gdy długości masz w stopach lub calach – najpierw amerykańskie (stale ASTM, beton ACI). Przycisk **+** w wierszu dodaje dany materiał pod jego nazwą:

| Grupa | Materiały |
| --- | --- |
| Metale | Stal S235, S275, S355; stal nierdzewna 304, 316; żeliwo; aluminium 6061-T6, 7075-T6, 5083; miedź, mosiądz, brąz; tytan Grade 2 i Ti-6Al-4V; stale amerykańskie ASTM A992, A36, A572 Gr. 50 i HSS A500 Gr. C |
| Beton | C25/30, C30/37, C40/50, beton lekki; amerykański $f'_c$ = 4 ksi i 5 ksi |
| Drewno | C24, GL24h, GL32h |
| Inne | Szkło, GFRP, CFRP, HDPE, PVC, PMMA, poliwęglan |

Materiału, którego wciąż używają elementy, nie można usunąć: najpierw przypisz tym elementom inny materiał.

## Przekroje {#cross-sections}

Zakładka *Przekroje* → **Dodaj przekrój**, **Biblioteka przekrojów** albo **Przekrój wielokątny**, aby narysować własny kształt. Podobnie jak z materiału, z jednego przekroju może korzystać wiele elementów.

| Pole | Jednostka | Do czego służy |
| --- | --- | --- |
| Pole $A$ | m² | Sztywność osiowa $EA$ i pole ścinania $kA$. |
| Moment bezwładności $I_y$ | m⁴ | Sztywność giętna $EI_y$ względem osi prostopadłej do rysunku. |
| Wysokość $h$ | m | Używana tylko przez obciążenia termiczne: krzywizna wynosi $\alpha\,(\Delta T_b - \Delta T_t)/h$. |
| Współczynnik ścinania $k$ | – | Efektywne pole ścinania to $kA$, więc sztywność na ścinanie wynosi $kGA$. Dla prostokąta ok. 0,83, dla dwuteownika $A_{web}/A$. |

Nowy przekrój ma na początku $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m i $k$ = 1 (w jednostkach amerykańskich jest to W12×26 z $k$ = 1). Zastąp je wartościami swojego przekroju albo wybierz przekrój z biblioteki.

::callout{type="tip" title="Zgodność z podręcznikiem, który pomija odkształcenie postaciowe"}
Większość obliczeń ręcznych zakłada belkę Eulera–Bernoulliego, bez odkształcenia postaciowego. Aby uzyskać zgodne wyniki, nadaj $k$ bardzo dużą wartość, np. `1e10`; przykłady w aplikacji i rysunki na tej stronie używają `1e32`. Nowy przekrój ($k = 1$), biblioteka i edytor wielokątów uwzględniają odkształcenie postaciowe; ile to zmienia, pokazano [niżej](#shear-deformation).
::

**Biblioteka przekrojów** podaje przybliżone wartości dla:

| Grupa | Przekroje | $k$ |
| --- | --- | --- |
| Pełne | Prostokąty, kwadraty, koła | 0,833 (prostokąt), 0,9 (koło) |
| Dwuteowniki | IPE 100, IPE 200, HEA 100, HEA 200; kształtowniki AISC W od W8×31 do W36×150 | $h\,t_w/A$, środnik |
| Rury prostokątne | RHS 100×50×3, 150×100×5; AISC HSS | $2ht/A$, oba środniki |
| Rury okrągłe | CHS Ø60×3, Ø114×5; okrągłe AISC HSS | 0,5 |

Zanim zaczniesz polegać na wartościach z biblioteki, porównaj je z tablicami profili.

![Biblioteka przekrojów](/screenshots/pl/sections-library.webp){.shot-lg}

Do szybkiego sprawdzenia ręcznie: prostokąt $b \times h$ ma $A = bh$ i $I_y = bh^3/12$; pełne koło o średnicy $d$ ma $A = \pi d^2/4$ i $I_y = \pi d^4/64$.

### Odkształcenie postaciowe: kiedy G i k mają znaczenie {#shear-deformation}

Sztywność na ścinanie $kGA$ wchodzi do elementu przez [parametr podatności na ścinanie](/pl/elements/beam#timoshenko-or-euler-bernoulli) $\Phi = 12EI_y/(kGAL^2)$. Przy bardzo dużym $k$ mamy $\Phi = 0$ i element staje się belką Eulera–Bernoulliego, więc $G$ nie ma wpływu. Przy rzeczywistym $k$ odkształcenie postaciowe zawsze zwiększa ugięcia. W konstrukcji statycznie wyznaczalnej siły przekrojowe pozostają takie same; w niewyznaczalnej też się zmieniają, bo wielkości nadliczbowe zależą od sztywności.

Jak bardzo, zależy od smukłości pręta. Dwuteownik IPE 200 z biblioteki ($k = h\,t_w/A = 0{,}393$) ze stali S235 ($G$ = 81 000 MPa) pod obciążeniem 10 kN/m, w porównaniu z tą samą belką przy $k$ = `1e32`:

| Belka | Z odkształceniem postaciowym | Euler–Bernoulli |
| --- | --- | --- |
| Swobodnie podparta, $L$ = 2 m ($L/h$ = 10): ugięcie w środku rozpiętości | 0,566 mm | 0,511 mm |
| Jednostronnie utwierdzona, $L$ = 2 m: moment w utwierdzeniu | −4,84 kNm | −5,00 kNm |
| Swobodnie podparta, $L$ = 6 m ($L/h$ = 30): ugięcie w środku rozpiętości | 41,85 mm | 41,36 mm |

Ręcznie: udział ścinania w ugięciu w środku rozpiętości wynosi $qL^2/(8kGA)$, czyli dla krótkiej belki 0,055 mm – o 11 % więcej, niż daje samo zginanie, $5qL^4/(384EI_y)$. W belce jednostronnie utwierdzonej moment w utwierdzeniu spada z $qL^2/8$ do $(qL^2/8)/(1 + \Phi/4)$. Przy $L/h$ = 30 oba efekty wynoszą ok. 1 % lub mniej, dlatego dla smukłych ram wyniki zgadzają się z podręcznikowymi niezależnie od $k$.

### Przekroje wielokątne {#polygonal-sections}

Zakładka *Przekroje* → **Przekrój wielokątny** albo *Lub zdefiniuj kształt wielokątny* w oknie Dodaj przekrój otwiera edytor kształtu, który sam oblicza charakterystyki przekroju.

![Edytor przekroju wielokątnego z szablonem dwuteownika, jego osiami głównymi i elipsą bezwładności](/screenshots/pl/sections-polygon.webp)

::div{.steps}

### Zacznij od szablonu {#start-from-a-preset}

Wybierz **Szablon** (prostokąt, dwuteownik, teownik, kątownik, ceownik, rura prostokątna, koło, rura okrągła), ustaw jego wymiary i naciśnij **Zastosuj**.

### Dopasuj kształt {#adjust-the-shape}

Przeciągaj wierzchołki (przyciągają się z krokiem ustawionym w polu **Krok przyciągania**), kliknij środek krawędzi, aby wstawić wierzchołek, albo kliknij dwukrotnie wierzchołek, aby go usunąć. Współrzędne możesz też wpisać w tabeli **Wierzchołki**. **Dodaj otwór** dodaje kontur wewnętrzny, a **Wyśrodkuj w środku ciężkości** przesuwa kształt tak, aby jego środek ciężkości leżał w początku układu.

### Odczytaj charakterystyki {#read-the-properties}

Zakładka **Charakterystyki przekroju** pokazuje $A$, środek ciężkości, centralne momenty bezwładności $I_y$, $I_z$ i moment dewiacji $I_{yz}$, główne momenty bezwładności $I_1$, $I_2$ z **kątem osi głównych** $\alpha$ (od $y$ do osi 1) oraz promienie bezwładności. Rysunek pokazuje osie główne i elipsę bezwładności.

### Dodaj przekrój {#add-it}

Sprawdź pola **Etykieta** i **Współczynnik ścinania** $k$: współczynnik ma na początku wartość 0,833, właściwą dla prostokąta; dwuteownik potrzebuje ok. $A_{web}/A$. Następnie naciśnij **Dodaj przekrój** (**Zapisz**, gdy edytujesz istniejący kształt). $A$, $I_y$ i $h$ wynikają z kształtu i w tabeli są tylko do odczytu; aby je zmienić, ponownie edytuj kształt przyciskiem wielokąta w kolumnie *Akcje*.

::

Współrzędne przekroju są lokalne i prawoskrętne: $x$ wychodzi z ekranu, $y$ jest skierowana w lewo, a $z$ w dół.

Jeśli kształt nie jest symetryczny względem płaszczyzny ramy (np. kątownik), edytor ostrzega: analiza 2D jest dokładna tylko wtedy, gdy pręt jest na całej długości zabezpieczony przed przemieszczeniem bocznym i skręceniem, np. przez płytę. Gdy moment dewiacji $I_{yz}$ jest znaczący, sam wybierasz sztywność giętną: **Stężony bocznie i przeciw skręceniu na całej długości** ($I_y$) albo **Swobodny w kierunku bocznym**, która jest mniejsza. Skręcanie nie jest uwzględniane w żadnym z tych przypadków.
