---
description: "Oktatóanyag: kéttámaszközű többtámaszú tartó az EduBeamben – összevetés két kéttámaszú tartóval, támaszsüllyedés és ellenőrzés erőmódszerrel. Körülbelül 25 perc."
source: site
---

# Oktatóanyag: többtámaszú tartó és támaszsüllyedés

Modellezz egy két támaszközön átfutó, folytatólagos tartót, vesd össze két kéttámaszú tartóval, majd hagyd, hogy a középső támasza 10 mm-t süllyedjen. Ennek a tartónak a támaszerőit pusztán az egyensúlyi egyenletekből nem lehet meghatározni, ezért erőmódszerrel ellenőrzöd őket.

- **Idő:** körülbelül 25 perc. Ez a négy oktatóanyag közül az utolsó és a legtartalmasabb.
- **Amire szükséged lesz:** az EduBeam megnyitva egy másik lapon, egérrel és billentyűzettel ellátott számítógépen. Ha még nem használtad az EduBeamet, előbb végezd el a [Gyors kezdést](/hu/guide/quick-start) vagy valamelyik korábbi oktatóanyagot.
- **Előismeretek:** az erőmódszer egyszeresen határozatlan szerkezetre, valamint a kéttámaszú tartó támaszközépi lehajlásai: egyenletesen megoszló teherből $5qL^4/(384EI)$, koncentrált erőből $FL^3/(48EI)$.
- **Mértékegységek:** SI. A nézet jobb alsó sarkában lévő mértékegységek gombján `m m² kN kNm MPa` legyen. Ha láb és kip szerepel rajta, kattints rá, és a **Mértékegységrendszer** értékét állítsd **SI (metrikus)** értékre.

**Amit megtanulsz**

- meglátni, mit nyersz a folytonossággal: kisebb nyomatékokat és lehajlásokat, mint a kéttámaszú tartóknál,
- támaszsüllyedést előírni, és leolvasni a csak általa okozott erőket,
- erőmódszerrel ellenőrizni egy határozatlan tartót, és megérteni, miért szenved többet a süllyedéstől a merevebb tartó.

::div{.actions}
[Az EduBeam megnyitása ↗](https://run.edubeam.app/?lang=hu){target="_blank"} [Ugrás a kézi ellenőrzéshez](#check-by-hand)
::

::model-figure{caption="A kész tartó: két 6 m-es támaszköz 10 kN/m teherrel, a süllyedés előtt"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels, dimensions]
---
::

## A feladat {#the-problem}

- Két $L = 6$ m-es támaszköz: csuklós támasz az 1-es, görgős támaszok a 2-es és a 3-as csomópontban.
- $q = 10$ kN/m egyenletesen megoszló teher mindkét támaszközön.
- Acél, $E = 210$ GPa, és $I_y = 8{,}356 \times 10^{-5}$ m⁴ (IPE 300), így $EI = 17\,547{,}6$ kNm².
- A második részben a középső támasz, a 2-es csomópont $\Delta = 10$ mm-t süllyed.

**Statikailag határozott?** Négy támaszerő (kettő az 1-es csomópontban, egy-egy a 2-esben és a 3-asban) áll szemben három egyensúlyi egyenlettel: a tartó egyszeresen statikailag határozatlan. A hiányzó egyenletet az alakváltozás adja: a 2-es csomópont nem mozdul el, vagy pontosan $\Delta$-val mozdul el.

## A modell felépítése {#model-it}

::div{.steps}

### Anyag és keresztmetszet {#material-and-section}

1. Kattints az alkalmazássávon a **Szerkezet törlése** gombra, jelöld be az **Anyagok törlése** és a **Keresztmetszetek törlése** mezőt, és kattints a **Megerősítés** gombra. A csomópontok és az elemek számozása ismét 1-től indul.
2. **Anyagok** fül → **Anyagkönyvtár** → **+** az **Acél (S235)** sorban, majd **Mégse** a könyvtár bezárásához.
3. **Keresztmetszetek** fül → **Keresztmetszet hozzáadása**. Az **Iy** mezőbe írd be, hogy `8,356e-5`, a **Terület**, a **Magasság** és a **Nyírási tényező** maradjon `1`, majd kattints a **Keresztmetszet hozzáadása** gombra.

Az 1 m²-es terület mellett a tartó gyakorlatilag nem szenved nyírási alakváltozást, ahogy a kézi számítás feltételezi. Ezúttal az $I_y$ az erőkre is hatással van: majd meglátod, hol.

### A tartó megrajzolása {#draw-the-beam}

1. **Elemek** fül → a második, kurzor ikonos **Elem hozzáadása** gomb.
2. Kattints a (0, 0), (6, 0) és (12, 0) pontokra.
3. Nyomd meg az <kbd>Esc</kbd> billentyűt a rajzolás befejezéséhez, majd az <kbd>F</kbd>-et, hogy a nézetet a képernyőhöz igazítsd.

Három csomópont és két elem. Ellenőrizd a koordinátákat a **Csomópontok** táblázatban.

### Támaszok {#supports}

Kattints az 1-es csomópontra → **Csomóponti támasz** → a **Csuklós támasz** jele. A 2-es és a 3-as csomópontnál válaszd a **Görgős támasz** jelét.

### Teher {#load}

**Terhek** fül → **Rúdteher hozzáadása** → *Egyenletesen megoszló teher*, **Elem**: `1`, `fz = 10` → **Rúdteher hozzáadása**. Ismételd meg a 2-es elemre.

::

## Eredmények {#results}

A hajlítónyomaték, a támaszerők és a deformált alak alapértelmezésként be vannak kapcsolva. A nyíróerőhöz jelöld be a **V<sub>z</sub> (x)** mezőt a nézet jobb felső sarkában lévő megjelenítési beállításokban (a fogaskerék jeleníti meg és rejti el őket). Az EduBeam az ábrákat és a támaszerőket kN-ban és kNm-ben, két tizedesjeggyel feliratozza.

- A támaszerők az 1-es és a 3-as csomópontban `22,50`, a 2-esben `75,00`: a középső támasz a 120 kN több mint felét viseli.
- A 2-es csomópont feletti nyomaték `-45,00`, negatív (felül húzott). A támaszközökben a legnagyobb pozitív nyomaték `25,31` kNm, a szélső támaszoktól 2,25 m-re.
- A nyíróerő a 2-es csomópont felett `-37,50`-ről `37,50`-re ugrik.

### Összevetés két kéttámaszú tartóval {#compare-with-two-simple-spans}

Mit nyersz a folytonossággal? Szakítsd meg: az **Elemek** táblázatban jelöld be az 1-es elem **végén**, a 2-es csomópontnál lévő csuklót. A tartóból két 6 m-es kéttámaszú tartó lesz, vagyis statikailag határozott szerkezet.

::model-figure{caption="Csuklóval a 2-es csomópont felett: két kéttámaszú tartó, mindkettőben qL²/8 = 45 kNm"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [{ nodes: [1, 2], hinges: [false, true] }, [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

| | Többtámaszú tartó | Két kéttámaszú tartó |
| --- | --- | --- |
| Támaszerők az 1-es, 2-es, 3-as csomópontban | 22,5; 75; 22,5 kN | 30; 60; 30 kN |
| Nyomaték a 2-es csomópont felett | −45 kNm | 0 |
| Legnagyobb pozitív nyomaték | 25,31 kNm | 45 kNm |
| Legnagyobb lehajlás (az ábrák $w(x)$ nézetében) | 4,000 mm | 9,617 mm |

A legnagyobb nyomaték mindkét esetben ugyanaz a 45 kNm, de a többtámaszú tartóban a támasz fölé kerül, és a támaszközök sokkal kevésbé hajlanak le. Minden támaszköz 2,4-szer merevebb is: a 2-es csomópont feletti vége nem tud elfordulni, szinte mintha be lenne fogva. Mielőtt továbblépsz, vedd ki újra a csukló jelölését.

## A középső támasz süllyedése {#settle-the-middle-support}

Most hagyd, hogy a 2-es csomópont 10 mm-t süllyedjen, ahogy egy gyenge talajon álló alap is süllyedhet.

::div{.steps}

### A süllyedés előírása {#prescribe-the-settlement}

Kattints a 2-es csomópontra → **Elmozdulás előírása**. A párbeszédablakban már ki van választva az **Előírt elmozdulás**; a **Dz** mezőbe írd be, hogy `0,01`, és kattints a **Csomóponti teher hozzáadása** gombra.

![Az előírt elmozdulás párbeszédablaka: csak a Dz adható meg, vagyis az az irány, amelyet a görgős támasz megtart](/screenshots/hu/p2t-prescribe-displacement.webp){.shot-sm}

Az alapértelmezett SI mértékegységekben az elmozdulások méterben vannak, így a 10 mm `0,01`; a pozitív érték lefelé mutat. Csak a megtámasztott irányok adhatók meg: a görgős támasz lesüllyeszthető, de oldalra nem tolható el. Bővebben az [Előírt elmozdulások](/hu/essentials/loads#prescribed-displacements-support-settlements) szakaszban.

### Az új eredmények leolvasása {#read-the-new-results}

A középső támaszerő `70,13` kN-ra csökken, a szélsők `24,94` kN-ra nőnek. A 2-es csomópont feletti nyomaték `-30,38` kNm-re mérséklődik, a támaszközök nyomatéka pedig `31,09` kNm-ig nő.

::model-figure{caption="A 2-es csomópont 10 mm-t süllyedt: a felette lévő negatív nyomaték csökken, a támaszközök többet kapnak"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

### A süllyedés önmagában {#look-at-the-settlement-alone}

Töröld a két rúdterhet: jelöld ki mindkettőt, és nyomd meg a <kbd>Delete</kbd> billentyűt, vagy használd a sorukban lévő ×-et a **Terhek** táblázatban. Ami marad, az a süllyedés önálló hatása: a 2-es csomópont felett `14,62` kNm-es csúcsú, háromszög alakú pozitív nyomatéki ábra, és olyan támaszerők, amelyek a 2-es csomópontot `4,87` kN-nal **lefelé** húzzák, az 1-es és a 3-as csomópontban pedig egyaránt `2,44` kN-nal felfelé tolnak. A tartó ellenáll annak, hogy a süllyedés által megszabott alakba hajlítsák, és egyedül ez az ellenállás terheli.

::model-figure{caption="Csak a süllyedés: nincs teher, a tartó mégis meghajlik, és a támaszokban erők ébrednek"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, w]
show: [nodeLabels]
---
::

Add hozzá ezt a csak teherből számított eredményekhez, és megkapod a süllyedt, terhelt tartót: 75 − 4,87 = 70,13 kN, −45 + 14,62 = −30,38 kNm. A számítás lineáris, így a hatások szuperponálhatók.

### A folytonosság ismételt megszakítása {#cut-the-continuity-again}

Hozd vissza a terheket a <kbd>Ctrl</kbd>+<kbd>Z</kbd> billentyűkkel, minden törölt teherért egyszer, és jelöld be ismét az 1-es elem végén lévő csuklót. A süllyedt támaszközök most egyszerűen csak elbillennek: a támaszerők és a nyomatékok pontosan a két kéttámaszú tartó értékei, bármekkora is a süllyedés, és teher nélkül nullák lennének. **A támaszsüllyedés csak statikailag határozatlan szerkezetben okoz igénybevételeket.** Mielőtt továbblépsz, vedd ki a csukló jelölését.

::

## Kézi ellenőrzés {#check-by-hand}

Alkalmazd az erőmódszert. Távolítsd el a 2-es csomópontbeli támaszt, és helyettesítsd az ismeretlen $R_2$ támaszerővel, amely felfelé hat egy $2L = 12$ m-es támaszközű kéttámaszú tartóra.

**Az alaptartó lehajlásai a 2-es csomópontban** a teherből, illetve a 2-es csomópontban működő, felfelé mutató egységerőből:

$$
\delta_q = \frac{5q\,(2L)^4}{384\,EI} = \frac{5 \cdot 10 \cdot 12^4}{384 \cdot 17\,547{,}6} = 0{,}15387\ \text{m}
$$

$$
\delta_{1} = \frac{(2L)^3}{48\,EI} = \frac{12^3}{48 \cdot 17\,547{,}6} = 0{,}0020516\ \text{m/kN}
$$

**Kompatibilitási feltétel.** Az $R_2$-nek addig kell visszatolnia a 2-es csomópontot felfelé, amíg oda nem kerül, ahol a támasz van: a nulla szintre, vagy $\Delta$-val lejjebb.

$$
R_2\,\delta_1 = \delta_q - \Delta \quad\Rightarrow\quad R_2 = \frac{\delta_q - \Delta}{\delta_1}
$$

**Minden más** az egyensúlyi egyenletekből adódik; a legnagyobb pozitív nyomaték ott van, ahol az $R_1 - qx$ nyíróerő nulla.

| | Képlet | Süllyedés nélkül | A 2-es csomópont 10 mm-t süllyedt |
| --- | --- | --- | --- |
| $R_2$ | $(\delta_q - \Delta)/\delta_1$ | 75,00 kN | 70,13 kN |
| $R_1 = R_3$ | $(2qL - R_2)/2$ | 22,50 kN | 24,94 kN |
| $M_2$ | $R_1 L - qL^2/2$ | −45,00 kNm | −30,38 kNm |
| $M_{\max}$ | $R_1^2/(2q)$ | 25,31 kNm | 31,09 kNm |

Az EduBeam az utolsó számjegyig ugyanezeket az értékeket mutatja.

Süllyedés nélkül ezek a tankönyvi $R_2 = 10qL/8$, $M_2 = -qL^2/8$ és $M_{\max} = 9qL^2/128$ értékek. A süllyedés önmagában $\Delta/\delta_1 = 4{,}874$ kN-nal változtatja meg a támaszerőket, a 2-es csomópont feletti nyomatékot pedig ennyivel:

$$
\Delta M_2 = \frac{\Delta}{\delta_1} \cdot \frac{2L}{4} = \frac{3\,EI\,\Delta}{L^2} = \frac{3 \cdot 17\,547{,}6 \cdot 0{,}01}{36} = 14{,}62\ \text{kNm}
$$

Figyeld meg benne az $EI$-t. A teher okozta erők csak attól függenek, mennyire merevek a rudak *egymáshoz képest*; a kényszerelmozdulás okozta erők viszont magával a merevséggel nőnek. Süllyedő támasz felett a merevebb tartó nagyobb nyomatékokat kap.

## Kísérletezés {#experiment}

Indulj ki a süllyedt, terhelt tartóból, egyszerre egy dolgot változtass meg, jósold meg az eredményt, és csak utána nézd meg. A <kbd>Ctrl</kbd>+<kbd>Z</kbd> minden változtatást visszavon.

**Duplázd meg a merevséget.** A **Keresztmetszetek** táblázatban állítsd az **Iy** értékét `1,6712e-4`-re. A süllyedés hatása a 2-es csomópont feletti nyomatékra 29,25 kNm-re duplázódik, az $M_2$ pedig −15,75 kNm-re mérséklődik. Ha csak a teher hatna, a lehajlásokon kívül semmi sem változna, azok pedig a felükre csökkennének.

**Keresd meg azt a süllyedést, amely felszabadítja a 2-es csomópontot.** Mekkora $\Delta$ mellett nulla a 2-es csomópont feletti nyomaték? A $\Delta M_2 = 45$ kNm-hez $\Delta = 45 L^2/(3EI) = qL^4/(24EI) = 0{,}0308$ m kell. Változtasd a süllyedést `0,0308`-ra a **Terhek** táblázatban, vagy a nézetben rá duplán kattintva: a támaszerők 30, 60 és 30 kN lesznek, mint két kéttámaszú tartónál, a $\Delta$ kerekítésének pontosságával. A $qL^4/(24EI)$ a kéttámaszú tartó végelfordulása szorozva $L$-lel: a süllyedés éppen annyira billenti el mindkét támaszközt, hogy eltűnjön a törés a 2-es csomópont felett, így a folytonosságnak már nincs mit átvinnie.

**Engedd el a 2-es csomópontot.** Változtasd a süllyedést `0,1539`-re, vagyis a 12 m-es alaptartó $\delta_q$ lehajlására. A 2-es csomópont támaszereje gyakorlatilag nullára csökken, és a tartó egyetlen kéttámaszú tartóként viseli a terhet: 180 kNm a támaszköz közepén. Az a támasz, amely ennyit süllyed, már nem támasz.

**Emeld meg inkább a 2-es csomópontot.** Változtasd a süllyedést `-0,01`-re, vagyis 10 mm-re felfelé. A süllyedésből adódó minden változás előjelet vált: a 2-es csomópont most 79,87 kN-t visel, a negatív nyomaték pedig −59,62 kNm-re nő.

További zárt alakú ellenőrzéseket, köztük egy befogott–görgős tartó támaszsüllyedését, az [Eredmények ellenőrzése kézi számítással](/hu/guide/verification#prescribed-displacement) oldalon találsz.

## Hogyan tovább {#next-steps}

::card-grid{cols="2"}
:::card{title="Gyakorolj: többtámaszú tartók" icon="lucide:dices" to="/hu/practice?p=K2049"}
Egyik vagy mindkét támaszközükön terhelt kéttámaszközű tartók erőmódszerrel megoldva, a válaszaid azonnali ellenőrzésével. Kezdd a K2049-es feladattal; a továbbiakhoz csak a **Kéttámaszközű többtámaszú tartó** típust válaszd ki, és nyomd meg az **Új feladat** gombot.
:::
:::card{title="Példatár" icon="lucide:library" to="/hu/examples/"}
Ez volt az utolsó oktatóanyag. A példatárban további modelleket találsz, amelyeket megnyithatsz, módosíthatsz és ellenőrizhetsz, valamint kiadható feladatokat.
:::
::
