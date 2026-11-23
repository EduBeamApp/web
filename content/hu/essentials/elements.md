---
description: "Gerendaelemek rajzolása az EduBeamben, rúdvégi csuklók a csuklós kapcsolatokhoz és a rácsrudakhoz, anyagok és keresztmetszetek a könyvtárakból vagy sokszögből."
source: site
---

# Elemek, anyagok és keresztmetszetek

Az [EduBeam]{.edubeam} minden eleme két csomópont közötti gerenda, saját anyaggal és keresztmetszettel. Az elemeket csomópontok közé rajzolod, a végüket csuklóval szabadítod fel ott, ahol a szerkezetben csuklós kapcsolat van, az anyagokat és a keresztmetszeteket pedig a könyvtárakból választod, vagy magad adod meg.

## A gerendaelem {#the-beam-element}

Egyetlen elemtípus van: az x–z síkban fekvő **síkbeli Timoshenko-gerenda**, mindkét végén három szabadságfokkal (`Dx`, `Dz`, `Ry`). Normálerőt, nyíróerőt és hajlítónyomatékot visel, és figyelembe veszi a [nyírási alakváltozást](#shear-deformation). A rácsrúd ugyanez az elem, [mindkét végén csuklóval](#end-hinges). Az elem leírását az elméleti rész [Gerendaelem](/hu/elements/beam) oldala tartalmazza.

Az elem menti eredmények a lineáris modellre pontosak, így **egy rúdhoz egy elem elég**. Rúdon belül csak ott vegyél fel csomópontot, ahol támasz, csukló vagy keresztmetszet-váltás van, vagy ahol elmozdulást akarsz leolvasni. Koncentrált erőhöz nem kell csomópont: a [koncentrált teher](/hu/essentials/loads#concentrated-load) az elem bármely pontjára elhelyezhető.

## Elemek hozzáadása {#adding-elements}

Az elemhez anyag és keresztmetszet kell, ezért ezeket add hozzá először (lásd [Anyagok](#materials) és [Keresztmetszetek](#cross-sections)). Amíg nincsenek, a nézetben a *Nincs megadva anyag.* vagy a *Nincs megadva keresztmetszet.* üzenet látható egy **Új hozzáadása** gombbal.

- **Csomópontok kiválasztásával.** *Elemek* fül → **Elem hozzáadása** (a **+** ikonos gomb), vagy jobb kattintás a rajzfelületen → *Elem hozzáadása*. Válaszd ki a **Kezdő csomópont** és a **Vég csomópont** értékét, szükség esetén jelöld be alattuk a **Csukló** mezőt, végül válaszd ki az **Anyag** és a **Keresztmetszet** értékét. Ehhez legalább két csomópont kell.
- **Kattintással.** *Elemek* fül → **Elem hozzáadása** (a kurzor ikonos gomb), vagy tartsd lenyomva a <kbd>Ctrl</kbd> billentyűt, miközben a rajzfelület menüjében az *Elem hozzáadása* pontot választod. Kattints egy csomópontra (vagy az üres rajzfelületre, ami új csomópontot hoz létre), majd a következőre; további kattintásokkal elemláncot rajzolhatsz, a befejezéshez pedig nyomd meg az <kbd>Esc</kbd> billentyűt vagy a **Mégse** gombot. A felső sávban megadott **Csukló a kezdőpontban** és **Csukló a végpontban** minden megrajzolt elemre érvényes. Az elemek a modell első anyagát és első keresztmetszetét kapják.

![Az Elem hozzáadása párbeszédablak](/screenshots/hu/qs-element.webp){.shot-md}

## Az elem iránya {#element-direction}

Minden elemnek saját **lokális tengelyei** vannak. A lokális x tengely a **kezdő csomóponttól** a **vég csomópont** felé mutat; a lokális z tengelyt pedig úgy kapod, hogy a lokális x tengelyt a képernyőn 90°-kal elforgatod az óramutató járásával megegyezően. A balról jobbra rajzolt elem lokális tengelyei egybeesnek a globálisakkal. Az elem mentén rajzolt **szaggatott vonal** a lokális +z oldalt, vagyis az „alsó szálat” jelöli.

![A → B → C → D sorrendben rajzolt keret: mindhárom elem szaggatott vonala a keret belső oldalára esik](/screenshots/hu/p2b-element-direction.webp){.shot-md}

Ebben a keretben az 1. elem A-tól B-ig felfelé halad, így a lokális z tengelye, és vele a szaggatott vonala is, jobbra mutat; a 3. elem C-től D-ig lefelé halad, így a szaggatott vonala a bal oldalán van. Ha egy keretet így rajzolsz meg, minden szaggatott vonal a belső oldalra kerül.

Az irány a következőknél számít:

- a lokális tengelyekben megadott terheknél (bejelölt **LCS**), lásd [Rúdterhek](/hu/essentials/loads#element-loads);
- a koncentrált teher **Távolság a kezdőponttól** értékénél;
- a [rúdvégi erők](/hu/elements/conventions#end-forces-element-results-table) sorrendjénél az eredményekben: `X12, Z12, M12` a kezdő, `X21, Z21, M21` a vég csomópontban;
- annál, hogy melyik a „szaggatott oldal” az [ábrák beállításaiban](/hu/essentials/units-settings#viewer-settings).

Az elem megfordításához nyomd meg a **Csomópontok felcserélése** gombot (a két csomópont közötti nyilak az *Elemek* táblázatban).

## Rúdvégi csuklók {#end-hinges}

A rúdvégi csukló az elem egyik végén felszabadítja a hajlítónyomatékot: ott a nyomaték nulla, és a rúdvég a csomóponttól függetlenül elfordulhat.

- **Egy csukló** csuklós kapcsolatot (közbenső csuklót) hoz létre a tartóban vagy a keretben.
- **Két csukló** **rácsrudat** hoz létre, amely csak normálerőt visel.

A csuklókat ezeken a helyeken jelölheted be:

- az *Elemek* táblázat **Rúdvégi csuklók** oszlopában, mindkét végnek külön jelölőnégyzettel;
- az **Elem hozzáadása** párbeszédablak **Csukló** mezőiben, vagy az elem paneljén → **Elem szerkesztése**;
- egérrel való rajzoláskor a felső sávban a **Csukló a kezdőpontban** és a **Csukló a végpontban** mezőben.

![Háromcsuklós keret Elemek táblázata: a 2. elem végén, a C csomópontban csukló van](/screenshots/hu/elements-table.webp)

### Egy csukló: csukló a szerkezeten belül {#one-hinge-a-pin-inside-the-structure}

Ugyanaz a többtámaszú tartó, két 5 m-es támaszközzel, 10 kN/m teherrel. A jobb oldali ábrán az 1. elemnek B-ben rúdvégi csuklója van: a támasz fölötti nyomaték nullára csökken, és mindkét támaszköz kéttámaszú tartóként viseli a terhét.

::div{.shots}

:::model-figure{caption="Többtámaszú tartó: M = −31,25 kNm B fölött"}
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

:::model-figure{caption="Csukló B-ben: M = 0 B fölött, mindkét támaszközben 31,25 kNm"}
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

Kézi számítással: a többtámaszú tartóban $M_B = -qL^2/8 = -31{,}25\ \text{kNm}$, és mindkét támaszközben legfeljebb $9qL^2/128 = 17{,}58\ \text{kNm}$; csuklóval $M_B = 0$ és $M_{max} = qL^2/8 = 31{,}25\ \text{kNm}$ mindkét támaszköz közepén. A csukló tehermentesíti a támaszt, de a mezőnyomatékokat majdnem megduplázza. Kézzel megoldandó, közbenső csuklós tartót a [G2048-as gyakorló feladatban](/hu/practice?p=G2048) találsz; a válaszaidat már beírás közben ellenőrzi.

### Két csukló: rácsrúd {#both-hinges-a-truss-bar}

Két rúdból álló fali konzol, mindkét rúd mindkét végén csuklóval, B-ben 20 kN teherrel. A rudak csak normálerőt viselnek, a nyomatéki ábra üres.

::model-figure{caption="AB húzott rúd: N = +26,67 kN (húzás); CB nyomott rúd: N = −33,33 kN (nyomás)"}
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

Kézi számítással: a nyomott rúd 5 m hosszú, és 3 m-t emelkedik, így $N_{CB} = -20 \cdot 5/3 = -33{,}33\ \text{kN}$, vízszintes összetevőjét pedig a húzott rúd egyensúlyozza: $N_{AB} = 33{,}33 \cdot 4/5 = 26{,}67\ \text{kN}$. A [Síkbeli rácsos tartó](/hu/tutorials/truss) oktatóanyag így épít fel egy teljes rácsos tartót, kézi megoldásra szánt rácsos tartókat pedig a [Statika gyakorló feladatok](/hu/practice?p=T2048) között találsz.

### A csukló az elemhez tartozik, nem a csomóponthoz {#hinge-the-element-not-the-node}

A csukló egy elem egyik végéhez tartozik: azt a végét engedi önállóan elfordulni, miközben a csomópont többi eleme mereven kapcsolódik hozzá. Ahol két rúd találkozik, egy csukló csuklós kapcsolatot hoz létre; ahol több, ott egy kivételével mindegyikre tegyél csuklót. A rácsos tartó csomópontjában, ahol minden rúd rácsrúd, mindegyiknek van csuklója.

Annak a csomópontnak, amelyben minden elem csuklós, nincs elfordulási merevsége. Az EduBeam ezt elfogadja, és az elfordulását 0-nak veszi. Ha a csuklók miatt a szerkezet mechanizmussá válik, az EduBeam bekarikázza őket, és megmutatja, hogyan mozdul el; lásd: [Hibaelhárítás](/hu/reference/troubleshooting#messages).

## Szerkesztés és törlés {#editing-and-deleting}

| Feladat | Teendő |
| --- | --- |
| Csomópontok, csuklók, anyag vagy keresztmetszet módosítása | Kattints az elemre → **Elem szerkesztése**, vagy módosítsd az *Elemek* táblázatban. |
| Megfordítás | **Csomópontok felcserélése** az *Elemek* táblázatban. |
| Átnevezés | Írj be új jelölést az *Elem* oszlopba. |
| A merevségi mátrix megtekintése | Kattints rá → **Merevségi mátrix**, vagy a mátrix gomb a *Műveletek* oszlopban. Egy ablak mutatja az elem 6 × 6-os mátrixát globális tengelyekben, a megjelenített mértékegységektől függetlenül SI-egységekben (N és m), a rúdvégi csuklókat már kondenzálva. Jól jön a kézi összeállítás ellenőrzéséhez. |
| Törlés | Kattints rá → **Törlés**, vagy a táblázatban a ×, vagy jelöld ki, és nyomd meg a <kbd>Delete</kbd> billentyűt. A terhei is törlődnek vele. |

![Az elem panelje](/screenshots/hu/ui-element-menu.webp){.shot-xs}

## Anyagok {#materials}

*Anyagok* fül → **Anyag hozzáadása**, vagy kész anyaghoz **Anyagkönyvtár**. Egy anyagot sok elem használhat; ha módosítod, mindegyik frissül.

| Mező | Mértékegység | Mire szolgál |
| --- | --- | --- |
| Rugalmassági modulus $E$ | MPa | Húzó-nyomó és hajlítási merevség, $EA$ és $EI_y$. Acél 210 000 MPa, beton kb. 30 000 MPa, fa kb. 11 000 MPa. |
| Nyírási rugalmassági modulus $G$ | MPa | Nyírási merevség, $kGA$. Hacsak a keresztmetszet $k$ értéke nem óriási, [nyírási alakváltozást](#shear-deformation) okoz: nagyobb lehajlást, statikailag határozatlan szerkezetben pedig más igénybevételeket is. $G = E/(2(1+\nu))$: acélnál kb. 81 000 MPa. |
| Sűrűség $\rho$ | kg/m³ | Az anyaggal együtt tárolódik, de a számítás nem használja: önsúlyteher nincs. |
| Hőtágulási együttható $\alpha$ | 1/K | A [hőmérsékleti terhek](/hu/essentials/loads#temperature-load) használják. Acél $12 \times 10^{-6}$ 1/K. |

A mértékegységek az alapértelmezett SI-egységek; a [beállításaidat](/hu/essentials/units-settings#units) követik, így amerikai mértékegységekben E és G ksi-ben, a sűrűség lb/ft³-ben, α pedig 1/°F-ben jelenik meg.

Az új anyag kezdőértékei: $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2{,}4$, vagyis $\nu = 0{,}2$), $\rho$ = 1000 kg/m³ és $\alpha = 12 \times 10^{-6}$ 1/K; amerikai mértékegységekben ASTM A992 acél. Acélnál írd át $G$-t 81 000 MPa-ra, vagy válassz acélt a könyvtárból.

![Az Anyag hozzáadása párbeszédablak](/screenshots/hu/qs-material.webp){.shot-md}

Az **Anyagkönyvtár** (az Anyag hozzáadása párbeszédablakban *Vagy válassz a könyvtárból*) elöl a metrikus (EN) anyagokat sorolja fel, ha pedig a hosszakat lábban vagy hüvelykben adod meg, az amerikaiakat (ASTM acélok, ACI beton). A sorban lévő **+** hozzáadja az anyagot a saját nevén:

| Csoport | Anyagok |
| --- | --- |
| Fémek | S235, S275, S355 acél; 304, 316 rozsdamentes acél; öntöttvas; 6061-T6, 7075-T6, 5083 alumínium; réz, sárgaréz, bronz; Grade 2 és Ti-6Al-4V titán; ASTM A992, A36, A572 Gr. 50 amerikai acélok és HSS A500 Gr. C |
| Beton | C25/30, C30/37, C40/50, könnyűbeton; amerikai $f'_c$ = 4 ksi és 5 ksi |
| Fa | C24, GL24h, GL32h |
| Egyéb | Üveg, GFRP, CFRP, HDPE, PVC, PMMA, polikarbonát |

Azt az anyagot, amelyet elemek még használnak, nem lehet törölni: előbb rendelj ezekhez az elemekhez másik anyagot.

## Keresztmetszetek {#cross-sections}

*Keresztmetszetek* fül → **Keresztmetszet hozzáadása**, **Szelvénykönyvtár**, vagy saját alak rajzolásához **Sokszög keresztmetszet**. Az anyagokhoz hasonlóan egy keresztmetszetet is sok elem használhat.

| Mező | Mértékegység | Mire szolgál |
| --- | --- | --- |
| Terület $A$ | m² | Húzó-nyomó merevség $EA$ és nyírt terület $kA$. |
| Inercianyomaték $I_y$ | m⁴ | Hajlítási merevség $EI_y$, a rajz síkjára merőleges tengelyre. |
| Magasság $h$ | m | Csak a hőmérsékleti terhek használják: a görbület $\alpha\,(\Delta T_b - \Delta T_t)/h$. |
| Nyírási tényező $k$ | – | A hatékony nyírt terület $kA$, így a nyírási merevség $kGA$. Téglalapnál kb. 0,83, I-szelvénynél $A_{web}/A$. |

Az új keresztmetszet kezdőértékei: $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m és $k$ = 1 (amerikai mértékegységekben egy W12×26-os szelvény $k$ = 1-gyel). Írd át őket a saját keresztmetszeted értékeire, vagy válassz egyet a könyvtárból.

::callout{type="tip" title="Egyezés a nyírási alakváltozást elhanyagoló tankönyvekkel"}
A legtöbb kézi számítás Euler–Bernoulli-gerendát feltételez, nyírási alakváltozás nélkül. Ahhoz, hogy az eredmények egyezzenek, adj $k$-nak nagyon nagy értéket, például `1e10`-et; az alkalmazás példái és az oldal ábrái `1e32`-t használnak. Az új keresztmetszet ($k = 1$), a könyvtár és a sokszögszerkesztő figyelembe veszi a nyírási alakváltozást; hogy ez mennyit változtat, azt [lent](#shear-deformation) láthatod.
::

A **Szelvénykönyvtár** közelítő értékeket ad a következőkhöz:

| Csoport | Keresztmetszetek | $k$ |
| --- | --- | --- |
| Tömör | Téglalapok, négyzetek, körök | 0,833 (téglalap), 0,9 (kör) |
| I-szelvények | IPE 100, IPE 200, HEA 100, HEA 200; AISC W-szelvények W8×31-től W36×150-ig | $h\,t_w/A$, a gerinc |
| Négyszög zártszelvények | RHS 100×50×3, 150×100×5; AISC HSS | $2ht/A$, mindkét gerinc |
| Kör zártszelvények (csövek) | CHS Ø60×3, Ø114×5; AISC kör HSS | 0,5 |

Mielőtt a könyvtári értékekre támaszkodnál, vesd össze őket egy szelvénytáblázattal.

![A Szelvénykönyvtár](/screenshots/hu/sections-library.webp){.shot-lg}

Gyors kézi ellenőrzéshez: egy $b \times h$ téglalapra $A = bh$ és $I_y = bh^3/12$; egy $d$ átmérőjű tömör körre $A = \pi d^2/4$ és $I_y = \pi d^4/64$.

### Nyírási alakváltozás: mikor számít G és k {#shear-deformation}

A $kGA$ nyírási merevség a [nyírási paraméteren](/hu/elements/beam#timoshenko-or-euler-bernoulli) keresztül kerül az elembe: $\Phi = 12EI_y/(kGAL^2)$. Nagyon nagy $k$ esetén $\Phi = 0$, és az elem Euler–Bernoulli-gerenda, így $G$-nek nincs hatása. Valós $k$ mellett a nyírási alakváltozás mindig növeli a lehajlásokat. Statikailag határozott szerkezetben az igénybevételek változatlanok maradnak; határozatlanban azok is megváltoznak, mert a fölös ismeretlenek a merevségtől függenek.

Hogy mennyire, az a rúd zömökségén múlik. Egy könyvtári IPE 200 ($k = h\,t_w/A = 0{,}393$) S235 acélból ($G$ = 81 000 MPa), 10 kN/m teherrel, összevetve ugyanazzal a tartóval $k$ = `1e32` mellett:

| Tartó | Nyírási alakváltozással | Euler–Bernoulli |
| --- | --- | --- |
| Kéttámaszú, $L$ = 2 m ($L/h$ = 10): lehajlás a támaszköz közepén | 0,566 mm | 0,511 mm |
| Befogott–görgős, $L$ = 2 m: nyomaték a befogásnál | −4,84 kNm | −5,00 kNm |
| Kéttámaszú, $L$ = 6 m ($L/h$ = 30): lehajlás a támaszköz közepén | 41,85 mm | 41,36 mm |

Kézi számítással: a középső lehajlás nyírásból származó része $qL^2/(8kGA)$, a rövid tartónál 0,055 mm, vagyis 11 %-kal több, mint a hajlításból származó $5qL^4/(384EI_y)$. A befogott–görgős tartóban a befogási nyomaték $qL^2/8$-ról $(qL^2/8)/(1 + \Phi/4)$-re csökken. $L/h$ = 30-nál mindkét hatás 1 % körüli vagy kisebb, ezért a karcsú keretek eredményei $k$-tól függetlenül egyeznek a tankönyvi megoldásokkal.

### Sokszög keresztmetszetek {#polygonal-sections}

A *Keresztmetszetek* fül → **Sokszög keresztmetszet**, vagy a Keresztmetszet hozzáadása párbeszédablakban a *Vagy adj meg egy sokszöget* egy alakszerkesztőt nyit meg, amely kiszámítja helyetted a keresztmetszeti jellemzőket.

![A sokszög keresztmetszet szerkesztője I-szelvény sablonnal, a főtengelyekkel és az inerciaellipszissel](/screenshots/hu/sections-polygon.webp)

::div{.steps}

### Indulj ki egy sablonból {#start-from-a-preset}

Válassz egy alakot a **Sablon** listából (téglalap, I-szelvény, T-szelvény, L-szelvény, U-szelvény, négyszög zártszelvény, kör, kör zártszelvény), add meg a méreteit, és nyomd meg az **Alkalmaz** gombot.

### Igazítsd az alakot {#adjust-the-shape}

Húzd a csúcsokat (az **Illesztés lépésköze** szerint illeszkednek), egy él felezőpontjára kattintva új csúcsot szúrhatsz be, dupla kattintással pedig csúcsot törölhetsz. A koordinátákat a **Csúcsok** táblázatba is beírhatod. A **Lyuk hozzáadása** belső kontúrt ad hozzá, a **Súlypontba helyezés** pedig úgy tolja el az alakot, hogy a súlypontja az origóba kerüljön.

### Olvasd le a jellemzőket {#read-the-properties}

A **Keresztmetszeti jellemzők** fül megmutatja $A$-t, a súlypontot, a súlyponti $I_y$, $I_z$ inercianyomatékot és az $I_{yz}$ centrifugális nyomatékot, az $I_1$, $I_2$ fő inercianyomatékot és a **Főtengely szöge** $\alpha$ értékét ($y$-tól az 1-es tengelyig), valamint az inerciasugarakat. A rajzon a főtengelyek és az inerciaellipszis látható.

### Add hozzá {#add-it}

Ellenőrizd a **Jelölés** és a **Nyírási tényező** $k$ értékét: ez 0,833-ról indul, ami téglalapnak megfelelő; I-szelvényhez kb. $A_{web}/A$ kell. Ezután nyomd meg a **Keresztmetszet hozzáadása** gombot (meglévő alak szerkesztésekor a **Mentés** gombot). $A$, $I_y$ és $h$ az alakból adódik, és a táblázatban csak olvasható; a módosításukhoz szerkeszd újra az alakot a *Műveletek* oszlop sokszög gombjával.

::

A keresztmetszet koordinátái lokálisak és jobbsodrásúak: $x$ a képernyőből kifelé, $y$ balra, $z$ lefelé mutat.

Ha az alak nem szimmetrikus a keret síkjára (például egy L-szelvény), a szerkesztő figyelmeztet: a síkbeli számítás csak akkor pontos, ha a rúd teljes hosszán meg van támasztva oldalirányú elmozdulás és elcsavarodás ellen, például födémlemezzel. Ha $I_{yz}$ jelentős, te választod ki a hajlítási merevséget: **teljes hosszán oldalirányban és elcsavarodás ellen megtámasztva** ($I_y$), vagy **oldalirányban szabadon elmozdulhat**, ami kisebb. Az elcsavarodást a számítás egyik esetben sem veszi figyelembe.
