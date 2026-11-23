---
description: "Oktatóanyag: ferde tartó (szarufa, lépcsőkar) az EduBeamben – vízszintes vetületre megadott teher, normál- és nyíróerő a lejtés mentén, és a görgős támasz iránya. 15 perc."
source: site
---

# Oktatóanyag: ferde tartó

Modellezz egy hóteherrel terhelt szarufát, olvasd le a normál- és a nyíróerőt a lejtése mentén, és ellenőrizd őket kézzel.

- **Idő:** körülbelül 15 perc. Ez a négy oktatóanyag közül az első és a legrövidebb.
- **Amire szükséged lesz:** az EduBeam megnyitva egy másik lapon, egérrel és billentyűzettel ellátott számítógépen. Ha még nem használtad az EduBeamet, előbb végezd el a [Gyors kezdést](/hu/guide/quick-start): bemutatja azokat a füleket és párbeszédablakokat, amelyeket ez az oktatóanyag használ.
- **Előismeretek:** a kéttámaszú tartó egyensúlya és egy erő felbontása két összetevőre.
- **Mértékegységek:** SI. A nézet jobb alsó sarkában lévő mértékegységek gombján `m m² kN kNm MPa` legyen. Ha láb és kip szerepel rajta, kattints rá, és a **Mértékegységrendszer** értékét állítsd **SI (metrikus)** értékre.

**Amit megtanulsz**

- átszámítani a vízszintes vetület méterére megadott terhet a rúd mentén ható teherre, amelyet az EduBeam vár,
- függőlegesre vagy a rúdra merőlegesre állítani egy vonalmenti terhet az **LCS** mezővel,
- elforgatni a görgős támaszt, és meglátni, hogy ez a normálerőt megváltoztatja, a hajlítónyomatékot viszont nem.

::div{.actions}
[Az EduBeam megnyitása ↗](https://run.edubeam.app/?lang=hu){target="_blank"} [Ugrás a kézi ellenőrzéshez](#check-by-hand)
::

::model-figure{caption="A kész szarufa: a vízszintes vetületre vonatkoztatva 3 kN/m hó, a rúd mentén 2,4 kN/m-ként megadva, csuklós támasszal az eresznél (1-es csomópont) és görgős támasszal a gerincnél (2-es csomópont)"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## A feladat {#the-problem}

- Egyenes szarufa az 1-es csomóponttól (0, 0) a 2-es csomópontig (4, −3): vízszintes vetülete 4 m, magassága 3 m, így hossza $L = 5$ m, $\cos\alpha = 4/5$ és $\sin\alpha = 3/5$.
- Csuklós támasz az 1-es csomópontban, az eresznél. A 2-es csomópontban, a gerincnél vízszintesen gördülő görgős támasz, így a támaszereje függőleges.
- Hóteher $s = 3$ kN/m, ahogy a szabványok megadják: **a vízszintes vetület egy méterére**.
- Acél, $E = 210$ GPa, és $I_y = 8{,}356 \times 10^{-5}$ m⁴, mint egy IPE 300-é.

**Statikailag határozott?** Három támaszerő és három egyensúlyi egyenlet: igen. Az erők pusztán az egyensúlyi egyenletekből adódnak; az $E$ és az $I_y$ csak a lehajlásnál számít.

## A modell felépítése {#model-it}

::div{.steps}

### Anyag és keresztmetszet {#material-and-section}

1. Kattints az alkalmazássávon a **Szerkezet törlése** gombra, jelöld be az **Anyagok törlése** és a **Keresztmetszetek törlése** mezőt, és kattints a **Megerősítés** gombra. A csomópontok és az elemek számozása ismét 1-től indul.
2. **Anyagok** fül → **Anyagkönyvtár** → **+** az **Acél (S235)** sorban, majd **Mégse** a könyvtár bezárásához.
3. **Keresztmetszetek** fül → **Keresztmetszet hozzáadása**. Az **Iy** mezőbe írd be, hogy `8,356e-5`, a **Terület**, a **Magasság** és a **Nyírási tényező** maradjon `1`, majd kattints a **Keresztmetszet hozzáadása** gombra.

Az 1 m²-es terület mellett a rúd gyakorlatilag nem rövidül meg és nem szenved nyírási alakváltozást, ahogy a kézi számítás feltételezi.

### A rúd megrajzolása {#draw-the-member}

1. **Elemek** fül → a második, kurzor ikonos **Elem hozzáadása** gomb.
2. Kattints a (0, 0), majd a (4, −3) pontra. A vonalzók és a szálkereszt mutatják, hol vagy, a kattintások pedig a rácshoz illeszkednek.
3. Nyomd meg az <kbd>Esc</kbd> billentyűt a rajzolás befejezéséhez, majd az <kbd>F</kbd>-et, hogy a nézetet a képernyőhöz igazítsd.

A z tengely lefelé mutat, ezért a 2-es csomópont, amely 3 m-rel az 1-es **felett** van, a $z = -3$ helyen található. Ellenőrizd mindkét csomópontot a **Csomópontok** táblázatban, és javítsd ki az eltérő koordinátákat.

### Támaszok {#supports}

Kattints az 1-es csomópontra → **Csomóponti támasz** → a **Csuklós támasz** jele. Ugyanígy válaszd a 2-es csomópontnál a **Görgős támasz** jelét.

### Teher {#load}

A szarufára összesen $3 \cdot 4 = 12$ kN hó jut. Az EduBeam az egyenletesen megoszló terhet a rúd **hossza** mentén osztja el, így ugyanez a 12 kN 5 m hosszon eloszolva

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0{,}8 = 2{,}4\ \text{kN/m}
$$

1. **Terhek** fül → **Rúdteher hozzáadása**.
2. **Teher típusa**: *Egyenletesen megoszló teher*, **Elem**: `1`, `fz = 2,4`.
3. Vedd ki az **LCS** (lokális koordináta-rendszer) jelölését, hogy az `fz` függőlegesen hasson, és kattints a **Rúdteher hozzáadása** gombra.

::callout{type="warning" title="Az LCS alapértelmezés szerint be van jelölve"}
Bejelölt **LCS** mellett az `fz` az elem lokális z tengelye mentén, vagyis a lejtésre merőlegesen hat: mint a szél a tetőn, nem mint a hó. Vízszintes tartónál a kettő egybeesik, ezért könnyű elsiklani felette. A teher nyilai mutatják, merre hat a teher; a részleteket a [Terhek](/hu/essentials/loads#uniformly-distributed-load) oldal írja le.
::

::

## Eredmények {#results}

A tartót az EduBeam kiszámítja, amint a teher a helyén van. A nézet jobb felső sarkában lévő megjelenítési beállításokban (a fogaskerék jeleníti meg és rejti el őket) a **Deformált alak**, az **M<sub>y</sub> (x)** és a **Támaszerők** alapértelmezésként be vannak kapcsolva; jelöld be az **N (x)** és a **V<sub>z</sub> (x)** mezőt is. Ugyanezeket az ábrákat mutatja a fenti ábra alatti kapcsoló.

Az EduBeam az ábrákat és a támaszerőket kN-ban és kNm-ben, két tizedesjeggyel feliratozza, így ezeket kell látnod:

- `6,00` mindkét támasznál, felfelé. A csuklós támasz vízszintes támaszereje `0,00`: nem hat vízszintes erő.
- `6,00` kNm, a hajlítónyomaték csúcsa, a támaszköz közepén.
- `4,80` kN nyíróerő az 1-es és `-4,80` a 2-es csomópontnál.
- `-3,60` kN normálerő az 1-es csomópontnál (nyomás) és `3,60` a 2-esnél (húzás), a támaszköz közepén nullán áthaladva.

## Kézi ellenőrzés {#check-by-hand}

**Támaszerők.** A 12 kN-os eredő vízszintes vetületben 2 m-re hat az 1-es csomóponttól, így bármelyik végre felírt nyomatéki egyenletből $V_1 = V_2 = 6$ kN. Vízszintes erő nem hat, ezért $H_1 = 0$.

**Hajlítónyomaték.** Függőleges erőknél csak a vízszintes erőkarok számítanak. Az 1-es csomóponttól vízszintes vetületben $x$ távolságra

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

pontosan úgy, mint egy $a = 4$ m-es támaszközű vízszintes tartónál, ugyanazzal a vízszintes vetületre vonatkozó teherrel.

**Nyíróerő és normálerő.** Az $x$ helyen lévő metszettől balra ható erők eredője egy $T(x) = V_1 - s\,x$ függőleges erő. Bontsd fel a rúdra merőleges és a rúd menti összetevőre:

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | 1-es csomópont, $T = +6$ kN | Támaszköz közepe, $T = 0$ | 2-es csomópont, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0{,}8 = 4{,}8$ kN | 0 | −4,8 kN |
| $N$ | $-6 \cdot 0{,}6 = -3{,}6$ kN | 0 | +3,6 kN |
| $M$ | 0 | 6 kNm | 0 |

Minden egyezik az EduBeammel. Az 1-es csomópont felfelé mutató támaszereje az alsó véget a lejtésen felfelé, a rúdba tolja: nyomás. A 2-es csomópont felfelé mutató támaszereje a felső véget tovább húzza felfelé a lejtésen, a rúdtól el: húzás. Az előjelek az elem irányát követik, az 1-es csomóponttól a 2-esig, ahogy az [előjelszabály](/hu/elements/conventions#internal-forces) elmagyarázza.

## Kísérletezés {#experiment}

Egyszerre egy dolgot változtass meg, jósold meg az eredményt, és csak utána nézd meg. A <kbd>Ctrl</kbd>+<kbd>Z</kbd> minden változtatást visszavon.

**Felejtsd el a koszinuszt.** Írd be, hogy `fz = 3` a 2,4 helyett. Ez a szarufa hosszára vonatkoztatva méterenként 3 kN, összesen 15 kN, és minden eredmény 25 %-kal nagyobb lesz a kelleténél: 7,5 kN-os támaszerők és 7,5 kNm. 30°-os hajlású tetőnél a hiba 15 %, 45°-osnál 41 % lenne.

**Hagyd bejelölve az LCS-t.** Jelöld be az **LCS** mezőt a 2,4 kN/m-es teherhez. A teher most a lejtésre merőlegesen nyom, mint a szél, és 7,2 kN-os vízszintes összetevője van, amelyet csak a csuklós támasz tud felvenni. A nyomaték $2{,}4 \cdot 5^2/8 = 7{,}5$ kNm-re nő, a normálerő pedig állandó, 4,5 kN-os húzás lesz.

::model-figure{caption="Ugyanaz a 2,4 kN/m bejelölt LCS-sel: merőleges a lejtésre, így a csuklós támasz 7,2 kN-t vesz fel vízszintesen"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Forgasd el a görgős támaszt.** Vedd ki újra az **LCS** jelölését, és csak azt az irányt változtasd meg, amelyben a 2-es csomópont görgős támasza gördül. Kattints a 2-es csomópontra → **Csomóponti támasz**, a **Csomóponti koordináta-rendszer szöge** mezőbe írd be, hogy `-36,87`, és nyomd meg az <kbd>Enter</kbd> billentyűt (vagy írd be az értéket a csomópont sorának **α** mezőjébe a **Csomópontok** táblázatban).

![A 2-es csomópont Csomóponti támasz menüje: a támaszjelek, a megtámasztott irányok és a Csomóponti koordináta-rendszer szöge](/screenshots/hu/p2t-node-supports-angle.webp){.shot-md}

A szög a csomópont saját tengelyeit forgatja el. Az alapértelmezett tengelyeknél (x jobbra, z lefelé) a negatív szög a képernyőn az óramutató járásával ellentétesen forgatja őket. Bővebben a [Ferde támaszok](/hu/essentials/nodes-supports#inclined-skewed-supports) szakaszban.

A görgős támasz most a lejtés mentén gördül, így a támaszereje merőleges a rúdra: az 1-es csomópontra felírt nyomatéki egyenletből $12 \cdot 2 / 5 = 4{,}8$ kN. A többit a csuklós támasz veszi fel, és vele a teljes normálerőt: −7,2 kN az 1-es csomópontnál, nulla a 2-esnél.

::model-figure{caption="A 2-es csomópont görgős támasza −36,87°-kal elforgatva, hogy a lejtés mentén gördüljön: a normálerő −7,2 kN-tól nulláig változik"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Legyen függőleges görgős támasz.** Állítsd vissza a szöget 0-ra, és válaszd a 2-es csomópontnál a **Függőleges görgős támasz** jelét. Ez függőlegesen gördül, így csak oldalirányban tud nyomni: az 1-es csomópontra felírt nyomatéki egyenletből, $H_2 \cdot 3 = 12 \cdot 2$, 8 kN adódik, és a csuklós támasz tartja meg a szarufát ezzel a vízszintes erővel szemben. A teljes rúd nyomott.

::model-figure{caption="Függőleges görgős támasz a 2-es csomópontban: 8 kN-os vízszintes támaszerő, és a teljes szarufa nyomott"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

A három görgős támasz egymás mellett:

| Görgős támasz a 2-es csomópontban | Támaszerő a 2-es csomópontban | Támaszerő az 1-es csomópontban | $N$ az 1-es csomóponttól a 2-esig |
| --- | --- | --- | --- |
| Vízszintes | 6 kN ↑ | 6 kN ↑ | −3,6-tól +3,6 kN-ig |
| A lejtés mentén | 4,8 kN ⊥ a rúdra | 2,88 kN →, 8,16 kN ↑ | −7,2-től 0 kN-ig |
| Függőleges | 8 kN ← | 8 kN →, 12 kN ↑ | −13,6-tól −6,4 kN-ig |

**A hajlítónyomaték sosem változik**, és a nyíróerő sem: mindhárom esetben 6 kNm és ±4,8 kN. Az 1-es csomópont, a 2-es csomópont és minden metszet egy egyenesen, a rúd tengelyén fekszik. A 2-es csomópont támaszerejének ezen egyenes mentén ható összetevője egyikükre sem ad nyomatékot, így csak normálerőt ad hozzá. A rúdra merőleges összetevőt az 1-es csomópontra felírt nyomatéki egyenlet 4,8 kN-ban rögzíti, bármerre néz is a görgős támasz. A görgős támasz iránya csak azt dönti el, hová kerül a vízszintes erő, ez pedig annak a falnak vagy lépcsőpihenőnek számít, amelynek fel kell vennie.

## Hogyan tovább {#next-steps}

::card-grid{cols="2"}
:::card{title="Gyakorolj: konzolos kéttámaszú tartók" icon="lucide:dices" to="/hu/practice?p=O2048"}
Megoszló teherrel terhelt tartó támaszerői és legnagyobb nyomatéka, a válaszaid azonnali ellenőrzésével. Kezdd az O2048-as feladattal; a továbbiakhoz hagyd kiválasztva csak a **Konzolos kéttámaszú tartó** típust, és nyomd meg az **Új feladat** gombot.
:::
:::card{title="Következő: háromcsuklós keret" icon="lucide:triangle" to="/hu/tutorials/three-hinged-frame"}
Négy rúd, egy közbenső csukló és egy vízszintes támaszerő: egy keret, amelyet még mindig pusztán a statikával megoldhatsz.
:::
::
