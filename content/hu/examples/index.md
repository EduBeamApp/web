---
description: "Hat kiszámított tartó, keret és rácsos tartó, amelyek egy kattintással megnyílnak az EduBeamben, feladatokkal és megoldásokkal a kézi számítás ellenőrzéséhez."
source: site
---

# Példák

Az alábbi kártyák mindegyike élő, kiszámított modell. Kattints egyre, hogy megnyisd az [EduBeam]{.edubeam} alkalmazásban, szerkesztésre készen: húzz el egy csomópontot, változtass meg egy terhet vagy kapcsolj be egy csuklót, és figyeld, hogyan követik az ábrák. A lentebb található feladatok mindegyik modellhez rövid gyakorlatot adnak, megoldásokkal, amelyekkel összevetheted a kézi számításodat.

::feature-structures
::

Ugyanezek a modellek az alkalmazásban is megtalálhatók a **☰ → Példák** alatt, a [run.edubeam.app/?panel=examples&lang=hu](https://run.edubeam.app/?panel=examples&lang=hu){target="_blank"} link pedig közvetlenül ezt a példatárat nyitja meg.

::callout{type="info" title="Mind a hat példában ugyanaz a rúd"}
Minden példa ugyanazt az acélrudat használja: $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (így $EI = 17\,548$ kNm²), $1\ \text{m}^2$ keresztmetszeti terület és olyan nagy nyírási merevség, hogy a tengelyirányú és a nyírási alakváltozás elhanyagolható. A karcsú tartókra vonatkozó tankönyvi képletek ezért minden kiírt számjegyig egyeznek az alkalmazással. A keresztmetszet magassága $1$ m, ami csak a hőmérsékleti tehernél számít.
::

## Javasolt feladatok {#suggested-exercises}

Előbb számold ki kézzel az eredményt, aztán ellenőrizd az alkalmazásban: nyisd meg a modellt a fenti kártyájáról vagy az ábrája alatti **Megnyitás az EduBeamben** gombbal. Egy modell megnyitása lecseréli azt, amelyen dolgozol; a <kbd>Ctrl</kbd>+<kbd>Z</kbd> visszahozza a sajátodat, és a **☰ → Legutóbbi szerkezetek** között is megtalálod.

### Statikailag határozatlan tartó {#exercise-indeterminate-beam}

3 m-es tartó, az A pontban befogva, a B pontban görgős támaszon, 10 kN/m teherrel.

::model-figure{caption="Befogás az A, görgős támasz a B pontban, 10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Határozd meg kézzel a támaszerőket és a befogási nyomatékot erőmódszerrel vagy a befogási nyomatékok táblázatából.
2. Vedd ki az `Ry` jelölését az A pontban, hogy a tartó kéttámaszú legyen. Hogyan változik a legnagyobb nyomaték?
3. Jelöld be újra az `Ry`-t az A pontban, és a B pontban is, hogy mindkét vége befogott legyen.

**Figyeld meg**, hol vált előjelet a nyomatéki ábra, és hogyan veszi fel a befogás a teher nagyobb részét, mint a görgős támasz.

::callout{type="details" title="Megoldások"}
- Egyik végén befogott, másik végén görgős támaszú tartó: $R_A = 5qL/8 = 18{,}75$ kN, $R_B = 3qL/8 = 11{,}25$ kN, $M_A = qL^2/8 = 11{,}25$ kNm, negatív nyomaték. A legnagyobb pozitív nyomaték $9qL^2/128 = 6{,}33$ kNm, a B ponttól 1,125 m-re, ahol a nyíróerő nulla.
- Kéttámaszú tartó: $qL^2/8 = 11{,}25$ kNm a támaszköz közepén, ugyanaz az érték, amelyet korábban a befogás viselt.
- Mindkét végén befogott tartó: $qL^2/12 = 7{,}5$ kNm negatív nyomaték a végeken és $qL^2/24 = 3{,}75$ kNm pozitív nyomaték a támaszköz közepén.
::

### Konzol {#exercise-cantilever}

4 m-es konzol, az A pontban befogva, a B szabad végén 18 kN lefelé mutató erővel.

::model-figure{caption="Konzol, 18 kN a szabad végen"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Határozd meg a befogási nyomatékot, valamint a konzolvég lehajlását és elfordulását. Vesd össze őket a B csomópont értékeivel az **Eredmények → Csomóponti eredmények** alatt.
2. Felezd meg az $I_y$ értékét a **Keresztmetszetek** fülön. Mi változik, és mi nem?
3. Cseréld le a koncentrált erőt 4,5 kN/m egyenletesen megoszló teherre, ami összesen szintén 18 kN: töröld a csomóponti terhet a **Terhek** fülön, majd használd a **Rúdteher hozzáadása** gombot.

**Figyeld meg** a nyomatéki ábra alakját: koncentrált erőből egyenes, egyenletesen megoszló teherből parabola.

::callout{type="details" title="Megoldások"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21{,}88$ mm, $\varphi_B = FL^2/(2EI) = 8{,}21$ mrad.
- A feleakkora $I_y$ megduplázza a lehajlást 43,77 mm-re. A nyomaték 72 kNm marad: a konzol statikailag határozott, így igénybevételei nem függenek a merevségtől.
- Egyenletesen megoszló teher: $M_A = qL^2/2 = 36$ kNm és $w_B = qL^4/(8EI) = 8{,}21$ mm. Ugyanakkora összteher feleakkora nyomatékot és háromnyolcadnyi lehajlást ad.
::

### Warren-rendszerű rácsos tartó {#exercise-pratt-truss}

9 m-es, 1,8 m magas rácsos tartó, a három felső csomópontban (E, F és G) egyenként 8 kN teherrel. A rúderők megjelenítéséhez jelöld be az **N(x)** mezőt a megjelenítési beállításokban. (Váltakozó dőlésű ferde rácsrudakkal és oszlopok nélkül ez az a kialakítás, amelyet a legtöbb tankönyv Warren-rendszerű rácsos tartónak nevez.)

::model-figure{caption="A–G csomópontok, 8 kN az E, F és G pontban"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. Határozd meg a támaszerőket, majd csomóponti módszerrel az A–E szélső ferde rácsrúd és az A–B alsóöv-rúd rúderejét.
2. Átmetsző módszerrel határozd meg a középső mező felsőöv-rúdjának és a B–C alsóöv-rúdnak a rúderejét.
3. Ebben a modellben a csomópontok merevek. Jelöld be az **Elemek** fülön minden rúd mindkét rúdvégi csuklóját, hogy csuklós csomópontú rácsos tartót kapj, és vesd össze a rúderőket.
4. Töröld a B–F ferde rácsrudat, először merev csomópontokkal, aztán csuklókkal. Megáll még a rácsos tartó?

**Figyeld meg** az előjelek rendjét: a felső öv nyomott, az alsó öv húzott, a ferde rácsrudak pedig felváltva húzottak és nyomottak.

::callout{type="details" title="Megoldások"}
- Támaszerők: 12-12 kN az A és a D pontban.
- Szélső ferde rácsrudak: 15,62 kN nyomás. Az A–B és a C–D alsóöv-rúd: 10,00 kN húzás.
- Az E–F és az F–G felsőöv-rúd: 13,33 kN nyomás (nyomatéki egyenlet a B pontra: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$). A B–C alsóöv-rúd: 16,67 kN húzás (nyomatéki egyenlet az F pontra: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$). Belső ferde rácsrudak: 5,21 kN; az E és a G pontból lefelé, az alsó övhöz futók húzottak, az F pont felé felfelé futók nyomottak.
- Merev és csuklós csomópontokkal 0,1 %-on belül ugyanazok a rúderők. Háromszögekből álló rácsos tartóban a hajlítás elhanyagolható, ezért működik a csuklós csomópontú modell.
- A B–F rúd nélkül a merev csomópontú rácsos tartó keretszerű működéssel még megáll, nagyjából 3 kNm-es hajlítónyomatékokkal. Csuklókkal eggyel kevesebb rúdja van a szükségesnél: mechanizmussá válik, és az EduBeam megmutatja, hogyan mozdulhat el.
::

### Háromtámaszközű többtámaszú tartó {#exercise-three-span-continuous-beam}

16 m-es tartó 5 + 6 + 5 m-es támaszközökkel: 8 kN/m az első támaszközön, 20 kN a C pontban és 6 kN/m az utolsó támaszközön. Megnyitáskor csak az A és a D pontban van megtámasztva.

::model-figure{caption="Megnyitáskor: csak az A és a D pontban megtámasztva"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Megnyitáskor ez egyetlen 16 m-es kéttámaszú tartó. Határozd meg a támaszerőket, valamint a B és a C pontbeli nyomatékot.
2. Jelöld be a `Dz`-t a B és a C pontban, hogy négy támaszon nyugvó többtámaszú tartót kapj.
3. Határozd meg a B és a C támasz feletti nyomatékot a háromnyomatéki (Clapeyron-) egyenlettel, majd a támaszerőket.

**Figyeld meg** a belső támaszok felett megjelenő negatív nyomatékokat, hogy mennyivel kisebb lesz minden nyomaték, és mi történik a 20 kN-os teherrel, amint a C pontban támasz van.

::callout{type="details" title="Megoldások"}
- Kéttámaszú tartó: $R_A = 44{,}69$ kN, $R_D = 45{,}31$ kN, $M_B = 123{,}4$ kNm és $M_C = 151{,}6$ kNm, mindkettő pozitív.
- Többtámaszú tartó, $M_A = M_D = 0$ mellett:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  ebből $M_B = -9{,}766$ kNm és $M_C = -5{,}859$ kNm, mindkettő negatív. A C pontbeli 20 kN egyenesen a támaszba jut, és semmit sem hajlít.
- Támaszerők: A 18,05 kN, B 22,60 kN, C 35,52 kN (a 20 kN-nal együtt), D 13,83 kN. Összegük a 90 kN-os teher.

::model-figure{caption="A négy támaszon nyugvó többtámaszú tartó"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### Keret {#exercise-portal-frame}

8 m-es gerenda két 6 m-es oszlopon, az A pontban befogva, a D pontban görgős támaszon. A gerendán 10 kN/m teher van, a C felső sarokra 8 kN balra és 10 kN lefelé hat.

::model-figure{caption="Befogás az A, görgős támasz a D pontban: 10 kN/m a gerendán, 8 kN és 10 kN a C pontban"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Hányszorosan statikailag határozatlan a keret?
2. Vedd ki az `Ry` jelölését az A pontban, hogy ott csuklós támasz legyen. A keret most statikailag határozott: határozd meg kézzel a támaszerőket és a B és C sarokban fellépő nyomatékot.
3. Jelöld be újra az `Ry`-t az A pontban, majd jelöld be a `Dx`-et a D pontban, hogy ott is csuklós támasz legyen. Figyeld meg a gerenda oldalirányú elmozdulását a deformált alakon.

**Figyeld meg**, merre mozdul el a keret teteje. A megnyitott keretben jobbra, a 8 kN-os teherrel szemben. Miért?

::callout{type="details" title="Megoldások"}
- Négy támaszerő (három a befogásban, egy a görgős támaszban) és három egyensúlyi egyenlet: egyszeresen határozatlan. Ha a D pont is csuklós, kétszeresen.
- Csukló az A pontban: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN jobbra. A B sarokban a nyomaték $8 \cdot 6 = 48$ kNm. A C sarokban nulla: a D pontban nincs vízszintes támaszerő, így a jobb oldali oszlop csak 44 kN normálerőt visz.
- A megnyitott keret teteje 9,5 mm-t mozdul jobbra: a terhelt gerendából származó nyomaték jobban meghajlítja a befogott oszlopot, mint a 8 kN. Ha a D pont csuklós, 4,9 kN vízszintes erőt vesz fel, és a keret teteje 4,8 mm-t mozdul balra.
::

### Hőmérsékleti teher {#exercise-temperature-load}

8 m-es kéttámaszú tartó, amelynek tengelye $\Delta T_c = 20$ K-nel melegszik, alsó szála pedig 10 K-nel hidegebb a felsőnél ($\Delta T_b - \Delta T_t = -10$ K).

::model-figure{caption="8 m-es kéttámaszú tartó, 20 K-nel felmelegítve, alsó szála 10 K-nel hidegebb a felsőnél"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. Mielőtt megnéznéd: milyen igénybevételeket okoz a hőmérséklet-változás, és hogyan mozdul el a tartó?
2. Jelöld be a `Dx`-et a B pontban, hogy megakadályozd a tartó megnyúlását.
3. Jelöld be az `Ry`-t is mindkét végen.

**Figyeld meg** a deformált alakot és a számokat az **Eredmények → Csomóponti eredmények** alatt: a tartó igénybevételek nélkül mozdul el, amíg meg nem gátolod.

::callout{type="details" title="Megoldások"}
- A statikailag határozott tartó szabadon megnyúlhat és meghajolhat, így nem keletkeznek igénybevételek. A B pont $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1{,}92$ mm-t csúszik kifelé. A hidegebb alsó szál megrövidül, így a tartó felfelé görbül $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1{,}2 \cdot 10^{-4}$ 1/m görbülettel: a végek $\kappa L/2 = 0{,}48$ mrad-dal fordulnak el, a támaszköz közepe $\kappa L^2/8 = 0{,}96$ mm-t emelkedik.
- Ha mindkét vég x irányban rögzített: $N = -EA\alpha\Delta T_c = -50\,400$ kN, nyomás. A nagyság a helyettesítő 1 m²-es területből adódik; egy 28,48 cm² területű IPE 200-ban 143,5 kN lenne.
- Ha mindkét vég befogott: a teljes tartó mentén állandó $EI\alpha(\Delta T_b - \Delta T_t)/h = 2{,}11$ kNm nyomaték.
::

## Kidolgozott oktatóanyagok {#worked-tutorials}

Nagyobb modellek, lépésről lépésre felépítve és kézzel ellenőrizve:

::card-grid{cols="2"}
:::card{title="Ferde tartó" icon="lucide:move-diagonal" to="/hu/tutorials/inclined-beam"}
Hóteherrel terhelt szarufa: vízszintes vetületre vonatkozó teher, normál- és nyíróerő a lejtés mentén, és egy elforgatott görgős támasz.
:::
:::card{title="Háromcsuklós keret" icon="lucide:triangle" to="/hu/tutorials/three-hinged-frame"}
Közbenső csuklós keret támaszerői, valamint N, V és M ábrái.
:::
:::card{title="Síkbeli rácsos tartó" icon="lucide:git-fork" to="/hu/tutorials/truss"}
A csomóponti módszer, az átmetsző módszer, egy vakrúd és lehajlás a virtuális munka elvével.
:::
:::card{title="Többtámaszú tartó és támaszsüllyedés" icon="lucide:spline" to="/hu/tutorials/continuous-beam"}
Két támaszközön átfutó tartó erőmódszerrel megoldva, majd a középső támasz 10 mm-es süllyedésével.
:::
::

További zárt alakú ellenőrzéseket az [Eredmények ellenőrzése kézi számítással](/hu/guide/verification) oldalon találsz.

## További feladatok {#more-problems}

A [Gyakorlás](/hu/practice) oldal minden kérésre új tartót, keretet vagy rácsos tartót ad friss számokkal, és azonnal ellenőrzi a támaszerőidet és a legnagyobb nyomatékot vagy rúderőt. Egy csoport számára a [dolgozatkészítő](/hu/exam) minden hallgatónak más dolgozatot nyomtat megoldókulccsal, a [@edubeam/plot](/hu/guide/teaching#exercise-sheets-tests-and-slides-from-code) pedig kódból készít feladatlapokat.

## Saját példa beküldése {#contribute-an-example}

Van egy jól bevált oktatási modelled? Oszd meg a linkjét a [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) oldalon, és lehet, hogy felvesszük a példatárba.
