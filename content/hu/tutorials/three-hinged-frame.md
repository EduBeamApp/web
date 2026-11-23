---
description: "Oktatóanyag: háromcsuklós keret egyenletesen megoszló teherrel az EduBeamben – támaszerők, vízszintes támaszerő és igénybevételek kézi ellenőrzéssel, a csukló lehajlásáig."
source: site
---

# Oktatóanyag: háromcsuklós keret

Modellezz egy keretet a gerenda közepén lévő csuklóval, olvasd le a támaszerőit és az ábráit, majd ellenőrizz kézzel minden számot, egészen a csukló lehajlásáig.

- **Idő:** körülbelül 15 perc.
- **Amire szükséged lesz:** az EduBeam megnyitva egy másik lapon, egérrel és billentyűzettel ellátott számítógépen. Ha még nem használtad az EduBeamet, előbb végezd el a [Gyors kezdést](/hu/guide/quick-start) vagy a [ferde tartó](/hu/tutorials/inclined-beam) oktatóanyagot.
- **Előismeretek:** a keret egyensúlya és a leválasztott részek egyensúlya. A nem kötelező lehajlás-ellenőrzés az egységerő-módszert (a virtuális munka elvét) használja.
- **Mértékegységek:** SI. A nézet jobb alsó sarkában lévő mértékegységek gombján `m m² kN kNm MPa` legyen. Ha láb és kip szerepel rajta, kattints rá, és a **Mértékegységrendszer** értékét állítsd **SI (metrikus)** értékre.

**Amit megtanulsz**

- keretet rajzolni egérrel egyetlen töröttvonalként,
- csuklót tenni egy rúd belsejébe a **Rúdvégi csuklók** mezőkkel,
- meghatározni a vízszintes támaszerőt a csuklóban érvényes $M = 0$ feltételből, és leolvasni a $V$ előjelét a különböző irányban rajzolt rudakban.

::div{.actions}
[Az EduBeam megnyitása ↗](https://run.edubeam.app/?lang=hu){target="_blank"} [Ugrás a kézi ellenőrzéshez](#_6-check-by-hand)
::

::model-figure{caption="A kész keret: 10 kN/m a gerendán, csuklós támaszok az 1-es és az 5-ös csomópontban, csukló a 3-as csomópontban"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## A feladat {#the-problem}

- Két 4 m-es oszlop, a lábuknál (1-es és 5-ös csomópont) csuklósan megtámasztva, egymástól 8 m-re.
- Felül vízszintes gerenda a 2-es csomóponttól a 4-esig, a támaszköz közepén, a 3-as csomópontban csuklóval.
- $q = 10$ kN/m egyenletesen megoszló teher a teljes gerendán.
- Acél, $E = 210$ GPa, és minden rúdnál $I_y = 8{,}356 \times 10^{-5}$ m⁴ (IPE 300).

| Csomópont | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | csuklós támasz |
| 2 | 0 | −4 | keretsarok |
| 3 | 4 | −4 | csukló a gerendában |
| 4 | 8 | −4 | keretsarok |
| 5 | 8 | 0 | csuklós támasz |

A z tengely **lefelé** mutat, ezért az oszlopok teteje $z = -4$ magasságban van.

**Statikailag határozott?** Két csuklós támasz négy támaszerőt ad. A három egyensúlyi egyenlet és a csuklóban érvényes $M_3 = 0$ együtt négy egyenlet: igen.

## A modell felépítése {#model-it}

::div{.steps}

### Anyag és keresztmetszet {#_1-material-and-section}

1. Kattints az alkalmazássávon a **Szerkezet törlése** gombra, jelöld be az **Anyagok törlése** és a **Keresztmetszetek törlése** mezőt, és kattints a **Megerősítés** gombra. A csomópontok és az elemek számozása ismét 1-től indul.
2. **Anyagok** fül → **Anyagkönyvtár** → **+** az **Acél (S235)** sorban, majd **Mégse** a könyvtár bezárásához.
3. **Keresztmetszetek** fül → **Keresztmetszet hozzáadása**. Az **Iy** mezőbe írd be, hogy `8,356e-5`, a **Terület**, a **Magasság** és a **Nyírási tényező** maradjon `1`, majd kattints a **Keresztmetszet hozzáadása** gombra.

Az 1 m²-es terület mellett a rudak gyakorlatilag nem rövidülnek meg és nem szenvednek nyírási alakváltozást, ahogy a lehajlás kézi számítása feltételezi. Egy statikailag határozott keret igénybevételei egyáltalán nem függenek az $E$, $A$ és $I_y$ értékétől.

### A keret megrajzolása {#_2-draw-the-frame}

1. **Elemek** fül → a második, kurzor ikonos **Elem hozzáadása** gomb.
2. Kattints a (0, 0), (0, −4), (4, −4), (8, −4) és (8, 0) pontokra. Minden kattintás felveszi a következő csomópontot, és összeköti az előzővel; a kattintások a rácshoz illeszkednek.
3. Nyomd meg az <kbd>Esc</kbd> billentyűt a rajzolás befejezéséhez, majd az <kbd>F</kbd>-et, hogy a nézetet a képernyőhöz igazítsd.

Most megvannak az 1–5. csomópontok és az 1–4. elemek, a rajzolás sorrendjében számozva, ahogy az ábrákon is. Vesd össze a **Csomópontok** táblázatot a fenti táblázattal, és javítsd ki az eltérő koordinátákat.

### Támaszok és a csukló {#_3-supports-and-the-hinge}

1. Kattints az 1-es csomópontra → **Csomóponti támasz** → a **Csuklós támasz** jele. Ugyanezt tedd az 5-ös csomóponttal.
2. Az **Elemek** táblázatban keresd meg a 2-es elemet (a 2-es csomóponttól a 3-asig), és jelöld be a **Rúdvégi csuklók** két mezője közül a másodikat: ez a végén, a 3-as csomópontnál lévő csukló.

![Az Elemek táblázat: a 2-es elemnél be van jelölve a 3-as csomópontnál lévő rúdvégi csukló](/screenshots/hu/p2t-frame-elements-table.webp)

Egy csukló elég. A 3-as elem ekkor az egyetlen rúd, amely mereven kapcsolódik a 3-as csomóponthoz, így ott nem adódhat át rá nyomaték. Ha a 3-as elem kezdőpontját is bejelölöd, semmi sem változik.

### Teher {#_4-load}

1. **Terhek** fül → **Rúdteher hozzáadása**.
2. **Teher típusa**: *Egyenletesen megoszló teher*, **Elem**: `2`, `fz = 10`. Kattints a **Rúdteher hozzáadása** gombra.
3. Ismételd meg a 3-as elemre.

Az `fz` lefelé pozitív. A gerenda vízszintes, így az **LCS** (lokális koordináta-rendszer) mezőnek itt nincs jelentősége.

::

## Eredmények {#_5-results}

A nézet jobb felső sarkában lévő megjelenítési beállításokban (a fogaskerék jeleníti meg és rejti el őket) a **Deformált alak**, az **M<sub>y</sub> (x)** és a **Támaszerők** alapértelmezésként be vannak kapcsolva. A többihez jelöld be az **N (x)** és a **V<sub>z</sub> (x)** mezőt, vagy kapcsolj ki néhányat, hogy egyszerre csak egy ábrát láss. Az EduBeam kN-ban és kNm-ben, két tizedesjeggyel feliratozza őket.

- Mindkét oszloplábnál `40,00` felfelé és `20,00` befelé.
- A hajlítónyomaték mindkét keretsarokban `-80,00`, a csuklóban pedig nincs felirata, mert ott nulla. Az EduBeam a húzott oldalra rajzolja, itt a kereten kívülre.
- A normálerő mindenhol negatív: az oszlopokban `-40,00`, a gerendában `-20,00`. Mind a négy rúd nyomott.
- **Eredmények** fül → **Csomóponti eredmények**: a csukló (3-as csomópont) lefelé mozdul: $D_z$ = `4,2554 · 10⁻² m`, vagyis 42,55 mm; ugyanez az érték látható a csuklónál a fenti ábra $w(x)$ nézetében.

## Kézi ellenőrzés {#_6-check-by-hand}

**Függőleges támaszerők.** A szimmetria miatt mindkét oszlopláb a 80 kN felét viseli:

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Vízszintes támaszerők.** Vágd el a keretet a csuklónál, és a bal félre írd fel a nyomatéki egyenletet a 3-as csomópontra, ahol a nyomaték nulla:

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

Mindkét támasz 20 kN-nal tolja befelé a keretet. E vízszintes támaszerő nélkül, amelyet az el nem csúszó csuklós támaszok adnak, a keret nem állna meg: az oszlopok szétnyílnának, a csukló pedig lesüllyedne.

| Mennyiség | Képlet | Kézi számítás | EduBeam |
| --- | --- | --- | --- |
| Függőleges támaszerők | $q \cdot 8/2$ | 40 kN | 40,00 |
| Vízszintes támaszerők | $M_3 = 0$-ból | 20 kN | 20,00 |
| Nyomaték a keretsarkokban (2-es és 4-es csomópont) | $H_1 \cdot 4$ | 80 kNm, kívül húzott | −80,00 |
| Nyomaték a csuklóban (3-as csomópont) | | 0 | nincs felirat |
| $N$ az oszlopokban | $-V_1$ | −40 kN | −40,00 |
| $N$ a gerendában | $-H_1$ | −20 kN | −20,00 |
| $V$ az oszlopokban | $\pm H_1$ | ±20 kN | −20,00; 20,00 |
| $V$ a gerendában a 2-es, 3-as, 4-es csomópontnál | $V_1 - q\,x$ | 40; 0; −40 kN | 40,00; nincs felirat; −40,00 |

A két oszlopban ugyanakkora, de ellentétes előjelű nyíróerő ébred, az 1-es elemben −20 kN, a 4-esben +20 kN, mert minden elem lokális tengelyei a rajzolás irányát követik: az 1-es elemé felfelé, a 4-esé lefelé. Cseréld fel az egyik oszlop csomópontjait, és az előjele megfordul. Hogy miért, azt az [előjelszabály](/hu/elements/conventions#internal-forces) magyarázza el.

A gerendában $M(x) = -80 + 40x - 5x^2$ kNm, ahol $x$-et a 2-es csomóponttól mérjük. A csuklóban nulla, és sehol sem pozitív: a teljes gerenda felül húzott. A $V(x) = 40 - 10x$ nyíróerő pontosan a csuklóban nulla, ezért ott van a nyomaték szélsőértéke.

::callout{type="details" title="A csukló lehajlása a virtuális munka elvével"}
Működtess a 3-as csomópontban lefelé mutató egységerőt. Ebből $\bar V = \bar H = 1/2$ támaszerők és egy $\bar m$ nyomaték adódik, amely az oszloplábnál 0-ról a keretsarokban 2-re nő, majd a csuklóig visszacsökken 0-ra, és a valódi $M$ nyomatékhoz hasonlóan kívül húzott. Integráld az $M \bar m$ szorzatot a négy rúdra:

$$
\text{oszlopok: } 2\int_0^4 (20\,y)(0{,}5\,y)\,dy = 426{,}7
$$

$$
\text{gerenda: } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0{,}5x)\,dx = 320
$$

$EI = 210 \times 10^6 \cdot 8{,}356 \times 10^{-5} = 17\,548$ kNm² mellett:

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746{,}7}{17\,548} = 0{,}04255\ \text{m}
$$

Ez az a 42,55 mm, amelyet az EduBeam `4,2554 · 10⁻²` m-ként ad meg. Az utolsó jegyben lévő 4 az a csekély rövidülés és nyírási alakváltozás, amelyet az 1 m²-es terület még megenged, és amelyet a kézi számítás elhanyagol. Az IPE 300 valódi területével, $A = 53{,}8$ cm², és a gerinccel mint nyírt területtel (0,40-es nyírási tényező) a rudak jobban rövidülnek és nyíródnak, a csukló pedig 43,7 mm-t, nagyjából 3 %-kal többet süllyed.
::

## Kísérletezés {#_7-experiment}

Egyszerre egy dolgot változtass meg, jósold meg az eredményt, és csak utána nézd meg. A <kbd>Ctrl</kbd>+<kbd>Z</kbd> minden változtatást visszavon.

**Vedd ki a csukló jelölését.** A keret egyszeresen határozatlanná válik. A vízszintes támaszerő a felére, 10 kN-ra csökken, a saroknyomatékok −40 kNm-re csökkennek, a gerenda közepén pedig 40 kNm pozitív nyomaték jelenik meg. A 3-as csomópont most csak 12,16 mm-t süllyed 42,55 mm helyett. Most már a keresztmetszetek is számítanak: adj a gerendának merevebb keresztmetszetet, mint az oszlopoknak, és a saroknyomatékok megnőnek.

::model-figure{caption="Csukló nélkül: kisebb vízszintes támaszerő, feleakkora saroknyomatékok és pozitív nyomaték a gerenda közepén"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], [2, 3], [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

**Fogd be az oszloplábakat.** Az 1-es és az 5-ös csomópontnál válaszd a **Befogás** jelét. A vízszintes támaszerő 30 kN-ra nő, az oszloplábaknál 40 kNm-es nyomatékok jelennek meg (az EduBeam `39,99`-et mutat, mert az oszlopok minimálisan megrövidülnek), a saroknyomatékok viszont 80 kNm-en maradnak. A szimmetria miatt a csuklóban nulla a nyíróerő, így a gerenda mindkét fele továbbra is a sarokból kinyúló 4 m-es konzolként dolgozik: $q \cdot 4^2/2 = 80$ kNm.

**Told meg oldalról.** Térj vissza a csuklós támaszokhoz, és adj a 2-es csomópontra `Fx = 10` kN csomóponti terhet. A támaszerők elveszítik a szimmetriájukat: 35 kN és 45 kN felfelé, 15 kN és 25 kN vízszintesen. Ellenőrizd őket ugyanazzal a három egyenlettel és az $M_3 = 0$ feltétellel; a 2-es csomópontban ható tehernek nincs erőkarja a 3-as csomópontra. A bal sarok nyomatéka −60 kNm-re csökken, a gerenda bal felében pedig kis pozitív nyomaték jelenik meg: 1,25 kNm a csuklótól 0,5 m-re.

::model-figure{caption="10 kN-os vízszintes teher a 2-es csomópontban: a jobb sarok most 100 kNm-t visel"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
  - { node: 2, fx: 10 }
results: [M, N]
show: [nodeLabels]
---
::

**Adj hozzá egy második csuklót.** Jelöld be a 2-es elem kezdőpontjánál, a 2-es csomópontban lévő csuklót is. Két csukló a két csuklós lábú oszlopon nyugvó gerendában mechanizmust alkot. Az EduBeam nem mutat eredményt, hanem ezt az üzenetet írja ki: *A csomópontok csuklói miatt a szerkezet elmozdulhat (csomópontok: 2, 3).* A mozgást animálva is megmutatja.

## Hogyan tovább {#next-steps}

::card-grid{cols="2"}
:::card{title="Gyakorolj: háromcsuklós keretek" icon="lucide:dices" to="/hu/practice?p=H2048"}
Ugyanez a keret új terhekkel, köztük vízszintes erővel, a válaszaid azonnali ellenőrzésével. Kezdd a H2048-as feladattal; a továbbiakhoz hagyd kiválasztva csak a **Háromcsuklós keret** típust, és nyomd meg az **Új feladat** gombot.
:::
:::card{title="Következő: síkbeli rácsos tartó" icon="lucide:git-fork" to="/hu/tutorials/truss"}
Kilenc csuklósan kapcsolt rúd: a csomóponti módszer, az átmetsző módszer, egy vakrúd és lehajlás a virtuális munka elvével.
:::
::
