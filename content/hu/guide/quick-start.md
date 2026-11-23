---
description: "Modellezz tíz perc alatt egy acél kéttámaszú tartót az EduBeamben (anyag, keresztmetszet, csomópontok, támaszok, teher), olvasd le az eredményeket, és ellenőrizd őket kézi számítással."
source: site
---

# Gyors kezdés

Körülbelül tíz perc alatt felépítesz egy acél kéttámaszú tartót, leolvasod a támaszerőit, a nyíróerőt, a hajlítónyomatékot és a lehajlást, és minden számot kézi számítással ellenőrzöl. Nyisd meg az EduBeamet egy másik lapon vagy ablakban az oldal mellett, és haladj vele együtt.

::div{.actions}
[Az EduBeam megnyitása ↗](https://run.edubeam.app/?lang=hu){target="_blank"} [Ugrás a kézi ellenőrzéshez](#_8-check-by-hand)
::

## A feladat {#the-problem}

Egy 6 m-es tartó az 1-es csomópontban csuklós, a 2-es csomópontban görgős támaszon nyugszik, és teljes hosszán 12 kN/m egyenletesen megoszló teher hat rá. A tartó acél IPE 200 szelvény: $E = 210$ GPa, $G = 81$ GPa, $A = 28{,}48\ \text{cm}^2$ és $I_y = 1943\ \text{cm}^4$. Mind a négy érték megtalálható az EduBeam könyvtáraiban, így semmit sem kell kikeresned.

::model-figure{caption="A tartó, amelyet felépítesz: 6 m-es támaszköz az 1-es csomóponttól a 2-esig, 12 kN/m teherrel"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: []
show: [nodeLabels, dimensions]
---
::

## A modell felépítése {#build-the-model}

::div{.steps}

### Kezdés üres modellel {#start-from-an-empty-model}

Az első látogatáskor egy üdvözlő ablak megkérdezi, hogyan szeretnéd kezdeni. A **Mértékegységrendszer** alatt válaszd az **SI (metrikus)** lehetőséget, a **Koordináta-rendszer** alatt hagyd meg az **x jobbra, z lefelé** beállítást, és nyomd meg a **Most kihagyom** gombot. Az alkalmazás ekkor egy kis példakeretet mutat.

1. Nyomd meg az alkalmazássávon a **Szerkezet törlése** gombot (telefonon a **☰** menüben találod).
2. Jelöld be az **Anyagok törlése** és a **Keresztmetszetek törlése** mezőt, majd nyomd meg a **Megerősítés** gombot.

A rajzfelület most üres, és két piros üzenet jelzi, hogy még nincs anyag és keresztmetszet. A következő lépések ezt pótolják. Semmi sem vész el: a <kbd>Ctrl</kbd>+<kbd>Z</kbd> visszahozza a keretet, és a **☰ → Legutóbbi szerkezetek** között is megmarad.

### A mértékegységek ellenőrzése {#_1-check-the-units}

A nézet jobb alsó sarkában lévő mértékegységek gombja mutatja, milyen mértékegységeket használ minden mező és eredmény. Ez az oldal SI mértékegységekkel dolgozik, ezeket a gomb `m m² kN kNm MPa` formában mutatja, és a z tengely lefelé mutat. Ha a gombon láb és kip szerepel, kattints rá, és állítsd a **Mértékegységrendszer** értékét **SI (metrikus)** értékre. Ugyanitt a **Koordináta-rendszer** legyen **x jobbra, z lefelé**: felfelé mutató y tengelynél a pozitív teher felfelé hat, és az előjelek nem egyeznének ezzel az oldallal.

![A rács (G) és az illesztés (S) kapcsolója, a szálkereszt és a mértékegységek gombja](/screenshots/hu/ui-grid-units.webp){.shot-sm}

### Az anyag és a keresztmetszet hozzáadása {#_2-add-the-material-and-cross-section}

Minden elemhez anyag és keresztmetszet kell, ezért először ezeket add hozzá a könyvtárakból.

1. Nyisd meg az alsó sávon az **Anyagok** fület, és kattints az **Anyagkönyvtár** gombra.
2. Nyomd meg a **+** gombot az **Acél (S235)** sorban ($E = 210\,000$ MPa, $G = 81\,000$ MPa). A könyvtár nyitva marad, hogy további tételeket is felvehess, ezért zárd be a **Mégse** gombbal.
3. Nyisd meg a **Keresztmetszetek** fület, és kattints a **Szelvénykönyvtár** gombra.
4. Görgess az **IPE 200 (kb.)** sorhoz, nyomd meg a **+** gombot, és zárd be a könyvtárat a **Mégse** gombbal.

Mindkét piros üzenet eltűnt, a **Keresztmetszetek** fülön pedig ott az IPE 200:

![Az IPE 200 a Keresztmetszetek fülön: terület, Iy, magasság és nyírási tényező](/screenshots/hu/a-qs-cross-sections.webp)

Ha inkább saját értékeket írnál be, használd az **Anyag hozzáadása** és a **Keresztmetszet hozzáadása** gombot. A nyírási tényező, itt 0,3933, a [kézi ellenőrzésnél](#_8-check-by-hand) még előkerül.

### A csomópontok hozzáadása {#_3-add-the-nodes}

1. Nyisd meg a **Csomópontok** fület. Két **Csomópont hozzáadása** gombot találsz rajta: a **+** párbeszédablakot nyit, a kurzor ikonos pedig egérrel helyezi el a csomópontokat. Kattints a **+ Csomópont hozzáadása** gombra.
2. Hagyd az **X koordináta** és a **Z koordináta** értékét `0`-n, és nyomd meg a **Csomópont hozzáadása** gombot. Az ablak bezárul, és megjelenik az `1`-es csomópont.
3. Kattints ismét a **+ Csomópont hozzáadása** gombra, írd be az **X koordináta** mezőbe, hogy `6`, és nyomd meg a **Csomópont hozzáadása** gombot. Ez a `2`-es csomópont.

![Az Új csomópont hozzáadása ablak. Itt rögtön a támaszokat is megadhatod.](/screenshots/hu/qs-node.webp){.shot-md}

### Összekötés elemmel {#_4-connect-them-with-an-element}

Nyisd meg az **Elemek** fület, és kattints a **+ Elem hozzáadása** gombra. Az ablak már felajánlja **Kezdő csomópont**nak az `1`-est, **Vég csomópont**nak a `2`-est, valamint az anyagodat és a keresztmetszetedet. Nyomd meg az **Elem hozzáadása** gombot.

![Új elem hozzáadása: a két végcsomópont, mindkét végen választható csukló, az anyag és a keresztmetszet](/screenshots/hu/a-qs-element.webp){.shot-md}

A csomópontok között megjelenik a tartó. Nyomd meg az <kbd>F</kbd> billentyűt, hogy a képernyőhöz igazítsd. A nézet bal felső sarkában egy kék **Támaszok hiányoznak** címke jelzi, miért nincsenek még eredmények.

### A támaszok hozzáadása {#_5-add-the-supports}

Térj vissza a **Csomópontok** fülre: minden sorban a **Megtámasztott szabadságfokok** oszlop elején támaszválasztó található.

- `1`-es csomópont: válaszd a **Csuklós támasz** lehetőséget. Ez bejelöli a `Dx`-et és a `Dz`-t.
- `2`-es csomópont: válaszd a **Görgős támasz** lehetőséget. Ez csak a `Dz`-t jelöli be.

![A támaszválasztó a Csomópontok táblázatban](/screenshots/hu/a-qs-support-picker.webp){.shot-lg}

A **Támaszok hiányoznak** címke eltűnik. A támaszt úgy is megadhatod, hogy a nézetben egy csomópontra kattintasz, és a **Csomóponti támasz** lehetőséget választod. Az összes támasztípust a [Csomópontok és támaszok](/hu/essentials/nodes-supports#supports) oldal sorolja fel.

### A teher hozzáadása {#_6-add-the-load}

1. Nyisd meg a **Terhek** fület, és kattints a **Rúdteher hozzáadása** gombra.
2. Hagyd meg a **Teher típusa** értékét (*Egyenletesen megoszló teher*) és az **Elem** értékét (`1`).
3. Írd be az **fz** mezőbe, hogy `12`, az **fx** maradjon `0`, és nyomd meg a **Rúdteher hozzáadása** gombot.

![A párbeszédablak előnézetben mutatja a terhet az elemen](/screenshots/hu/a-qs-load.webp){.shot-md}

A pozitív `fz` a +z irányba, vagyis **lefelé** mutat, így a pozitív érték gravitációs teher. A bejelölt **LCS** (lokális koordináta-rendszer) mező azt jelenti, hogy a teher az elem saját tengelyeit követi; balról jobbra rajzolt vízszintes tartónál ezek egybeesnek a globális tengelyekkel. Lásd az [előjelszabályt](/hu/elements/conventions#loads).

::

## Az eredmények leolvasása {#_7-read-the-results}

Az EduBeam abban a pillanatban kiszámítja a tartót, amint a teher a helyén van, és minden további módosítás után újra: nincs *Számítás* gomb. Az egyes rajzokat a nézet jobb felső sarkában lévő panelen kapcsolhatod be és ki. A **Deformált alak**, az **M<sub>y</sub>(x)** és a **Támaszerők** kezdettől be vannak kapcsolva. A nyíróerő megjelenítéséhez jelöld be a **V<sub>z</sub>(x)** mezőt.

![A megjelenítési beállítások bekapcsolt nyíróerővel](/screenshots/hu/a-qs-display.webp){.shot-md}

A képernyődnek most az alábbi ábrához kell hasonlítania. Válts a hajlítónyomaték és a nyíróerő között:

::model-figure{caption="A kész tartó: 36 kN-os támaszerők és 54 kNm a támaszköz közepén"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: [M, V]
show: [nodeLabels]
---
::

| Rajz | Mit keress rajta |
| --- | --- |
| **Támaszerők** | Két felfelé mutató, **36 kN**-os nyíl, támaszonként egy. |
| **V<sub>z</sub>(x)** | Egyenes az `1`-es csomópont **+36 kN** értékétől a `2`-es csomópont **−36 kN** értékéig, a támaszköz közepén nullán halad át. |
| **M<sub>y</sub>(x)** | Parabola, amelynek **54 kNm**-es csúcsa a támaszköz közepén van, a húzott oldalon, a tartó alatt rajzolva. |
| **Deformált alak** | Szimmetrikus lehajlás, nagyítva rajzolva. |

A számokat az **Eredmények** fülön találod. A **Csomóponti eredmények** minden csomópont `Dx`, `Dz` elmozdulását és `Ry` elfordulását mutatja, az **Elemek eredményei** pedig minden elem rúdvégi erőit a saját tengelyeiben. Az `1`-es csomópont $R_y = -2{,}6469 \cdot 10^{-2}$ rad-dal fordul el, a `2`-es ugyanennyivel az ellenkező irányba. Minden táblázatot és előjelet az [Eredmények és igénybevételi ábrák](/hu/essentials/results) oldal magyaráz el.

Ha az ábrák túl nagyok vagy túl kicsik, módosítsd az **Eredmények léptéke** beállítást (**Beállítások → Megjelenítés beállításai**).

## Kézi ellenőrzés {#_8-check-by-hand}

$q = 12$ kN/m és $L = 6$ m esetén a tankönyvi képletek a következőket adják:

| Mennyiség | Képlet | Kézi számítás | EduBeam |
| --- | --- | --- | --- |
| Támaszerők | $qL/2$ | 36 kN | 36 kN |
| Legnagyobb nyíróerő | $qL/2$ | 36 kN | 36 kN |
| Legnagyobb nyomaték | $qL^2/8$ | 54 kNm | 54 kNm |
| Elfordulás a tartóvégen | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Lehajlás a támaszköz közepén | $w_b + w_s$ | 49,63 + 0,60 = 50,22 mm | 50,22 mm |

A lehajlás két részből áll, és a legtöbb tankönyv csak az elsőt adja meg:

- **Hajlításból:** $w_b = 5qL^4/(384EI) = 49{,}63$ mm, ahol $EI = 4080$ kNm² az $E = 210$ GPa és az $I_y = 1943\ \text{cm}^4$ értékből adódik.
- **Nyírásból:** $w_s = qL^2/(8kGA) = 0{,}60$ mm, ahol $kGA \approx 90\,700$ kN a $k = 0{,}3933$, a $G = 81$ GPa és az $A = 28{,}48\ \text{cm}^2$ értékből adódik.

A támaszköz közepén még nincs csomópont, ezért vegyél fel egyet, hogy ott leolvashasd a lehajlást:

1. A **Csomópontok** fülön kattints a második, kurzor ikonos **Csomópont hozzáadása** gombra.
2. Kattints a tartóra az `x = 3` helyen; bekapcsolt illesztésnél a csomópont a rácspontra kerül. Az EduBeam megkérdezi, mi legyen a csomóponttal: nyomd meg a **Bekötés a szerkezetbe** gombot. Az elem `1a` és `1b` elemre válik szét a terhével együtt, a csomópontok elhelyezése pedig véget ér. Ha a `3`-as csomópont a **Csomópontok** fülön nem az X = `3` helyen van, írd be oda, hogy `3`.
3. Az **Eredmények → Csomóponti eredmények** táblázatban a `3`-as csomópontnál most $D_z = 5{,}0224 \cdot 10^{-2}$ m áll, vagyis 50,22 mm.

![Csomóponti eredmények a szétválasztás után: a 3-as csomópont 50,22 mm-t mozdul lefelé](/screenshots/hu/a-qs-nodal-results.webp){.shot-lg}

A tartó szétválasztása egyetlen eredményt sem változtat meg, mert az elem ezekre a terhekre pontos: nincs finomítandó háló.

::callout{type="details" title="Miért számít a nyírási tényező"}
Az EduBeam Timoshenko-gerendaelemeket használ, amelyek figyelembe veszik a nyírási alakváltozást. A $k$ nyírási tényező a nyírást viselő területet skálázza, így a nyírási merevség $kGA$. A könyvtár I-szelvényeinél $k$ a gerinc részaránya a területből, $h t_w / A$: az IPE 200-nál $0{,}2 \cdot 0{,}0056 / 0{,}002848 = 0{,}3933$. A lehajlás nyírásból származó része, $w_s = qL^2/(8kGA)$, a $V/(kGA)$ integrálja a támasztól a támaszköz közepéig.

Ennél a karcsú tartónál a nyírási rész 0,60 mm, az egész körülbelül 1 %-a. Rövid, magas tartónál jóval nagyobb. Állítsd a **Keresztmetszetek** fülön a nyírási tényezőt egy nagyon nagy számra (például `1e10`), és az EduBeam a csak hajlításból adódó 49,63 mm-t adja. Az elméletet a [gerendaelem oldala](/hu/elements/beam) tárgyalja.
::

További kézi ellenőrzési módszereket (konzol, befogott tartó, rácsos tartó, hőmérséklet, támaszsüllyedés) az [Eredmények ellenőrzése kézi számítással](/hu/guide/verification) oldalon találsz.

## Kísérletezés {#_9-experiment}

Változtasd meg a modellt, és figyeld, hogyan követik az ábrák. Minden változtatást külön próbálj ki, és a következő előtt vond vissza a <kbd>Ctrl</kbd>+<kbd>Z</kbd> billentyűkkel. A `3`-as csomópont az, amelyet az előbb vettél fel a támaszköz közepén.

- **Húzd jobbra a `2`-es csomópontot.** A nyomaték $L^2$-tel, a lehajlás $L^4$-nel arányosan nő.
- **Jelöld be az `Ry`-t az `1`-es csomópontnál**, hogy befogd azt a véget. A befogásnál negatív nyomaték jelenik meg: a tankönyvi képlettel $qL^2/8 = 54$ kNm, az EduBeamben 53,8 kNm. Statikailag határozatlan tartóban a nyírási merevség az igénybevételeket is megváltoztatja.
- **Jelöld be a `Dz`-t a `3`-as csomópontnál**, hogy közbenső támaszt adj hozzá, és kéttámaszközű többtámaszú tartót kapj. A középső támasz feletti nyomaték negatívvá válik: kézzel $q(L/2)^2/8 = 13{,}5$ kNm, az EduBeamben ugyanezért 13,3 kNm.
- **Jelöld be a `Dz`-t a `3`-as csomópontnál, és az `1a` elem *Rúdvégi csuklók* oszlopának második mezőjét** (a `3`-as csomópontnál lévő végét) az **Elemek** fülön. A tartóból két 3 m-es kéttámaszú tartó lesz. Most vedd ki a `Dz` jelölését a `3`-as csomópontnál: a tartó mechanizmussá válik, és az EduBeam megmutatja, hogyan mozdulhat el.

Ha modellezés nélkül szeretnéd kipróbálni a támaszköz és a teher hatását, mozgasd az alábbi csúszkákat, és válts az eredmények között: látni fogod, hogyan nő mindegyik a támaszközzel.

::example-structure
::

## Mentés vagy megosztás {#_10-save-or-share}

- **Küldd el valakinek.** Nyomd meg az alkalmazássávon a **Szerkezet megosztása** gombot, majd a **Másolás** gombot. A link a teljes modellt tartalmazza, és aki megnyitja, saját, szerkeszthető másolatot kap.
- **Őrizd meg fájlként.** A **☰ → Projekt mentése** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) letölt egy `project.json` fájlt. Újra megnyithatod a **☰ → Projekt megnyitása** (<kbd>Ctrl</kbd>+<kbd>O</kbd>) menüponttal, vagy úgy, hogy ráhúzod a fájlt az alkalmazásra.
- **Tedd a rajzot egy jelentésbe.** A **☰ → Kép exportálása** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) PNG vagy SVG formátumban menti.

A modellt a böngésződ is megőrzi, így az oldal újratöltésekor sem vész el. A részleteket a [Fájlok, linkek és exportálás](/hu/essentials/import-export) oldal írja le.

## Hogyan tovább {#where-next}

::card-grid{cols="2"}
:::card{title="Oktatóanyagok" icon="lucide:graduation-cap" to="/hu/tutorials/inclined-beam"}
Négy lépésről lépésre felépített és kézzel ellenőrzött modell, a ferde tartótól a süllyedő támaszú többtámaszú tartóig.
:::
:::card{title="Példák" icon="lucide:library" to="/hu/examples/"}
Kész tartók, keretek és rácsos tartók, amelyek egy kattintással megnyílnak, feladatokkal és megoldásokkal.
:::
:::card{title="Terhek" icon="lucide:arrow-down-to-line" to="/hu/essentials/loads"}
Trapéz alakú, koncentrált és hőmérsékleti terhek, csomóponti erők és támaszsüllyedések.
:::
:::card{title="Billentyűzet, egér és érintés" icon="lucide:keyboard" to="/hu/reference/shortcuts"}
Rajzolj csomópontokat és elemeket közvetlenül a rajzfelületen, és szerkessz gyorsabban.
:::
::
