---
description: "Oktatóanyag: síkbeli rácsos tartó az EduBeamben – rúderők ellenőrzése csomóponti és átmetsző módszerrel, vakrúd és lehajlás a virtuális munka elvével."
source: site
---

# Oktatóanyag: síkbeli rácsos tartó

Építs fel csuklósan kapcsolt rudakból egy kis, statikailag határozott rácsos tartót, ellenőrizd a rúderőit a csomóponti és az átmetsző módszerrel, a lehajlását pedig a virtuális munka elvével.

- **Idő:** körülbelül 20 perc.
- **Amire szükséged lesz:** az EduBeam megnyitva egy másik lapon, egérrel és billentyűzettel ellátott számítógépen. Ha még nem használtad az EduBeamet, előbb végezd el a [Gyors kezdést](/hu/guide/quick-start) vagy valamelyik korábbi oktatóanyagot.
- **Előismeretek:** a csomóponti módszer és az átmetsző (Ritter-) módszer. A nem kötelező lehajlás-ellenőrzés az egységerő-módszert (a virtuális munka elvét) használja.
- **Mértékegységek:** SI. A nézet jobb alsó sarkában lévő mértékegységek gombján `m m² kN kNm MPa` legyen. Ha láb és kip szerepel rajta, kattints rá, és a **Mértékegységrendszer** értékét állítsd **SI (metrikus)** értékre.

**Amit megtanulsz**

- a rácsrudakat mindkét végükön csuklós gerendaelemként modellezni, egérrel rajzolva,
- ellenőrizni a rúderőket a csomóponti és az átmetsző módszerrel,
- felismerni a vakrudat, és megérteni, miért működik a csuklós csomópontú modell a rácsos tartónál.

::div{.actions}
[Az EduBeam megnyitása ↗](https://run.edubeam.app/?lang=hu){target="_blank"} [Ugrás a kézi ellenőrzéshez](#_5-check-by-hand)
::

::model-figure{caption="A kész rácsos tartó: 30 kN a 2-es és a 3-as csomópontban, rúderők (a húzás pozitív)"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N, w]
show: [nodeLabels, dimensions]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## A feladat {#the-problem}

- 12 m-es támaszköz három 4 m-es mezőre osztva, 3 m magasság: az alsó öv csomópontjai 1–4, a felső övéi 5 és 6.
- Csuklós támasz az 1-es, görgős támasz a 4-es csomópontban.
- Két 30 kN-os teher az alsó öv 2-es és 3-as csomópontjában.
- Acél rudak, $E = 210$ GPa, $A = 20$ cm².

| Elemek | Rudak (csomópontok szerint) | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | alsó öv |
| 4, 5, 6 | 1–5, 5–6, 6–4 | szélső ferde rácsrúd, felső öv, szélső ferde rácsrúd |
| 7, 8, 9 | 2–5, 5–3, 3–6 | oszlop, középső ferde rácsrúd, oszlop |

**Statikailag határozott?** $m = 9$ rúd, $r = 3$ támaszerő és $j = 6$ csomópont esetén $m + r = 12 = 2j$. Minden csomópont két egyensúlyi egyenletet ad, így a rúderők pusztán az egyensúlyi egyenletekből adódnak.

## A modell felépítése {#model-it}

::div{.steps}

### Anyag és keresztmetszet {#_1-material-and-section}

1. Kattints az alkalmazássávon a **Szerkezet törlése** gombra, jelöld be az **Anyagok törlése** és a **Keresztmetszetek törlése** mezőt, és kattints a **Megerősítés** gombra. A csomópontok és az elemek számozása ismét 1-től indul.
2. **Anyagok** fül → **Anyagkönyvtár** → **+** az **Acél (S235)** sorban, majd **Mégse** a könyvtár bezárásához.
3. **Keresztmetszetek** fül → **Keresztmetszet hozzáadása**. A **Terület** mezőbe írd be, hogy `0,002`, az **Iy** mezőbe, hogy `1e-6`, a **Magasság** és a **Nyírási tényező** maradjon `1`, majd kattints a **Keresztmetszet hozzáadása** gombra.

Mindkét végükön csuklós rudaknál csak a terület számít; az $I_y$-nak csak pozitívnak kell lennie.

### A csuklós rudak megrajzolása {#_2-draw-the-bars-with-hinges}

Az EduBeamben a rácsrúd olyan gerendaelem, amelynek **mindkét rúdvégi csuklója** be van jelölve. A rajzolóeszköz be is jelöli őket helyetted, a rajzolás sorrendje pedig a fenti táblázat számozását adja.

1. **Elemek** fül → a második, kurzor ikonos **Elem hozzáadása** gomb.
2. A nézet tetején megjelenő sávban jelöld be a **Csukló a kezdőpontban** és a **Csukló a végpontban** mezőt. Mostantól minden megrajzolt rúd mindkettőt megkapja.
3. Alsó öv: kattints a (0, 0), (4, 0), (8, 0) és (12, 0) pontokra, majd nyomd meg az <kbd>Esc</kbd> billentyűt.
4. Felső rész: kattints ismét az **Elem hozzáadása** gombra, majd az 1-es csomópontra a (0, 0) pontban, a (4, −3) és a (8, −3) pontra, végül a 4-es csomópontra a (12, 0) pontban. Ha meglévő csomópontra kattintasz, a rúd ahhoz kapcsolódik, és nem jön létre új csomópont. Nyomd meg az <kbd>Esc</kbd> billentyűt.
5. Rácsozás: még egyszer kattints az **Elem hozzáadása** gombra, majd a 2-es csomópontra a (4, 0), az 5-ösre a (4, −3), a 3-asra a (8, 0) és a 6-osra a (8, −3) pontban. Nyomd meg az <kbd>Esc</kbd>, majd az <kbd>F</kbd> billentyűt, hogy a nézetet a képernyőhöz igazítsd.

Az **Elemek** táblázatban most a fenti táblázat kilenc eleme szerepel, mindegyiknél bejelölve mindkét **Rúdvégi csuklók** mező. Az <kbd>Esc</kbd> kilép a rajzolásból, de a sávban lévő csuklómezők a következő alkalomra bejelölve maradnak.

### Támaszok és terhek {#_3-supports-and-loads}

1. Kattints az 1-es csomópontra → **Csomóponti támasz** → a **Csuklós támasz** jele. A 4-es csomópontnál válaszd a **Görgős támasz** jelét.
2. Kattints a 2-es csomópontra → **Teher hozzáadása** → `Fz = 30` → **Csomóponti teher hozzáadása**. Ugyanezt tedd a 3-as csomópontnál.

A pozitív `Fz` lefelé mutat. Egy csomópontban minden rúd csuklósan kapcsolódik, így semmi sem gátolja a csomópont elfordulását; az EduBeam ezt elfogadja, és az ilyen csomópont elfordulását 0-nak adja meg.

::

## Eredmények {#_4-results}

A nézet jobb felső sarkában lévő megjelenítési beállításokban (a fogaskerék jeleníti meg és rejti el őket) kapcsold ki a **Deformált alak** és az **M<sub>y</sub> (x)** mezőt, mert rácsos tartóban nincs hajlítás, és jelöld be az **N (x)** mezőt. A húzás pozitív, az EduBeam pedig kN-ban, két tizedesjeggyel feliratozza az erőket.

- Mindkét támasznál `30,00` felfelé; a csuklós támasz vízszintes támaszereje `0,00`, mert vízszintes teher nem hat.
- Az alsó öv mindhárom rúdjában `40,00` (húzás), a felső övben `-40,00` (nyomás).
- A középső ferde rácsrúd (5–3) semmit sem visz, ezért nincs felirata, ahogy a fenti ábrán sem.
- **Eredmények** fül → **Csomóponti eredmények**: a 2-es csomópont lefelé mozdul: $D_z$ = `2,2937 · 10⁻³ m`, vagyis 2,294 mm.

## Kézi ellenőrzés {#_5-check-by-hand}

**Támaszerők.** A terhek szimmetrikusak, így $R_1 = R_4 = 30$ kN felfelé, vízszintes teher híján pedig a csuklós támasz vízszintes támaszereje nulla.

**Az 1-es csomópont** (csomóponti módszer). Az 1–5 szélső ferde rácsrúd 5 m hosszú, így $\sin\alpha = 3/5$ és $\cos\alpha = 4/5$:

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**A 2-es csomópont.** A 2–5 oszlop az egyetlen rúd, amely a 30 kN-os terhet felfelé továbbíthatja: $N_{25} = +30$ kN, és $N_{23} = N_{12} = 40$ kN.

**Átmetszés a középső mezőben** (átmetsző módszer). Vágd át az 5–6, 5–3 és 2–3 rudat, és vizsgáld a bal oldali részt:

- Nyomatéki egyenlet a 3-as csomópontra: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Függőleges vetületi egyenlet: a mezőben a nyíróerő $R_1 - 30 = 0$, így a középső **5–3 ferde rácsrúd semmit sem visz**: $N_{53} = 0$.

| Rudak | Kézi számítás | EduBeam |
| --- | --- | --- |
| Alsó öv 1–2, 2–3, 3–4 | +40 kN, húzás | 40,00 |
| Felső öv 5–6 | −40 kN, nyomás | −40,00 |
| Szélső ferde rácsrudak 1–5, 6–4 | −50 kN | −50,00 |
| Oszlopok 2–5, 3–6 | +30 kN | 30,00 |
| Középső ferde rácsrúd 5–3 | 0 | nincs felirat |

A vakrúd nem fölösleges rúd: *ennél* a tehernél nem visz erőt, de ha eltávolítod, a rácsos tartó összecsuklik, ahogy az alábbi kísérletek megmutatják.

::callout{type="details" title="A 2-es csomópont lehajlása a virtuális munka elvével"}
Működtess a 2-es csomópontban lefelé mutató egységerőt, és oldd meg újra kézzel a rácsos tartót: $R_1 = 2/3$, $R_4 = 1/3$, a rúderők $n$ értékeit pedig az alábbi táblázat tartalmazza. A lehajlás $\delta = \sum N\,n\,L / (EA)$:

| Rúd | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
| --- | --- | --- | --- | --- |
| 1–2 | 40 | 8/9 | 4 | 142,2 |
| 2–3 | 40 | 8/9 | 4 | 142,2 |
| 3–4 | 40 | 4/9 | 4 | 71,1 |
| 1–5 | −50 | −10/9 | 5 | 277,8 |
| 5–6 | −40 | −4/9 | 4 | 71,1 |
| 6–4 | −50 | −5/9 | 5 | 138,9 |
| 2–5 | 30 | 1 | 3 | 90,0 |
| 5–3 | 0 | −5/9 | 5 | 0 |
| 3–6 | 30 | 1/3 | 3 | 30,0 |
| | | | összeg | 963,3 |

$$
\delta_2 = \frac{963{,}3}{EA} = \frac{963{,}3}{210 \times 10^6 \cdot 0{,}002} = 0{,}002294\ \text{m}
$$

Ez 2,294 mm, ugyanannyi, mint a 2-es csomópont EduBeam által adott $D_z$ értéke, `2,2937 · 10⁻³` m.
::

## Kísérletezés {#_6-experiment}

Egyszerre egy dolgot változtass meg, jósold meg az eredményt, és csak utána nézd meg. A <kbd>Ctrl</kbd>+<kbd>Z</kbd> minden változtatást visszavon.

**Helyezd át az egyik terhet.** Tedd mindkét terhet a 2-es csomópontra: töröld a 3-as csomópont terhét, a másikat pedig változtasd `Fz = 60`-ra. Most $R_1 = 40$ kN, a középső mező nyíróereje $40 - 60 = -20$ kN, és ezt a középső ferde rácsrúdnak kell vinnie: $N_{53} = -20 \cdot 5/3 = -33{,}33$ kN, nyomás.

::model-figure{caption="60 kN a 2-es csomópontban: az 5–3 középső ferde rácsrúd most a mező nyíróerejét viszi"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 60 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

**Távolítsd el a középső ferde rácsrudat.** Töröld a 8-as elemet. A középső mező csuklós téglalappá válik, amely oldalirányban elnyíródhat. Az EduBeam nem mutat eredményt, hanem ezt az üzenetet írja ki: *A csomópontok csuklói miatt a szerkezet elmozdulhat (csomópontok: 2, 3, 5, 6).* Ez a mező négy sarka; a mozgást animálva is megmutatja.

**Vedd ki az összes csukló jelölését** az **Elemek** táblázatban. A rácsos tartóból merev csomópontú keret lesz. Jelöld be az **M<sub>y</sub> (x)** mezőt: a hajlítónyomatékok 0,1 kNm alatt maradnak, a normálerők pedig 0,1 %-nál kevesebbet változnak. Ezért működik a csuklós csomópontú idealizálás háromszögekből álló rácsos tartónál.

**Legyen mindkét támasz csuklós.** A negyedik támaszerő miatt a rácsos tartó egyszeresen határozatlanná válik, és az eredmény meglephet: az alsó öv most **semmit sem visz**, helyette mindkét támasz 40 kN-nal nyom befelé. Az 1-es és a 4-es csomópont nem távolodhat el egymástól, ezért az öv közöttük, egy egyenesben fekvő három rúdjának összes megnyúlásának nullának kell lennie. Mindegyikük ugyanazt az erőt viszi, így ez az erő nulla, a 40 kN pedig a támaszokra kerül. Ez a rudak keresztmetszeti területétől függetlenül így van.

::model-figure{caption="Mindkét támasz csuklós: a támaszok veszik át az alsó öv szerepét"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: pin }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Hogyan tovább {#next-steps}

A rácsrúdelem elméletét a [Rácsrúdelem](/hu/elements/truss) oldal tartalmazza.

::card-grid{cols="2"}
:::card{title="Gyakorolj: Warren-rendszerű rácsos tartók" icon="lucide:dices" to="/hu/practice?p=T2048"}
Egy nagyobb rácsos tartó támaszerői és egyik rúdjának rúdereje, a válaszaid azonnali ellenőrzésével. Kezdd a T2048-as feladattal; a továbbiakhoz hagyd kiválasztva csak a **Warren-rendszerű rácsos tartó** típust, és nyomd meg az **Új feladat** gombot.
:::
:::card{title="Következő: többtámaszú tartó és támaszsüllyedés" icon="lucide:spline" to="/hu/tutorials/continuous-beam"}
Statikailag határozatlan tartó: mit nyersz a folytonossággal, mit tesz vele egy süllyedő támasz, és hogyan ellenőrizd mindkettőt erőmódszerrel.
:::
::
