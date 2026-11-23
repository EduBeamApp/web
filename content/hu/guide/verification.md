---
description: "Az EduBeam ellenőrzése tankönyvi képletekkel: tartók, rácsos tartó, hőmérsékleti teher, támaszsüllyedés, és miben tér el a Timoshenko-gerenda az Euler–Bernoulli-gerendától."
source: site
---

# Eredmények ellenőrzése kézi számítással

Soha ne bízz meg olyan számban, amelyet legalább nagyságrendileg nem tudsz reprodukálni. Ez az oldal kézzel végigszámolja a klasszikus tankönyvi eseteket, és összeveti őket az [EduBeam]{.edubeam} eredményeivel, amelyek minden kiírt számjegyre egyeznek. A táblázatok öt értékes jegyet adnak meg, ahogy az alkalmazás *Eredmények* füle is; az ábrák feliratai négy jegyre vannak kerekítve. Minden ábrát élőben számít ki a böngésződ; a **Megnyitás az EduBeamben** ugyanezt a modellt tölti be az alkalmazásba, ahol leolvashatod a táblázatokat, megváltoztathatsz egy értéket, és megnézheted, mi történik.

::div{.chips}
- [Kéttámaszú tartó](#simply-supported-beam-uniform-load)
- [Konzol](#cantilever-tip-load)
- [Mindkét végén befogott tartó](#fixed–fixed-beam-uniform-load)
- [Befogott–görgős tartó](#propped-cantilever-uniform-load)
- [Kétrudas rácsos tartó](#two-bar-truss)
- [Hőmérséklet](#temperature-gradient-on-a-simply-supported-beam)
- [Támaszsüllyedés](#prescribed-displacement)
- [Nyírási alakváltozás](#shear-deformation)
::

Az elejétől a végéig megoldott teljes szerkezeteket a [háromcsuklós keret](/hu/tutorials/three-hinged-frame) és a [síkbeli rácsos tartó](/hu/tutorials/truss) oktatóanyaga mutat be. Új, kézzel megoldandó feladatokat, amelyek beíráskor azonnal ellenőrzik a válaszaidat, a [Gyakorlás](/hu/practice) oldalon találsz.

## Az itt használt keresztmetszet {#the-section-used-here}

Ha nincs másként jelölve, minden eset az alkalmazás példáiban szereplő acéltartót használja: $E = 210$ GPa és $I_y = 8356$ cm⁴ (IPE 300), így

$$
EI = 210 \times 10^9 \cdot 8{,}356 \times 10^{-5} = 17\,547{,}6\ \text{kNm}^2
$$

A keresztmetszeti terület ($A = 1$ m²) és a nyírási tényező ($k = 10^{32}$) olyan nagy, hogy a tengelyirányú és a nyírási alakváltozás eltűnik, így az eredmények pontosan a tankönyved Euler–Bernoulli-képleteit követik.

::callout{type="info" title="Az EduBeam gerendái Timoshenko-gerendák"}
Valódi keresztmetszet esetén (például a szelvénykönyvtárból választott szelvénnyel) a rudak a nyírás hatására is alakváltoznak. A lehajlások ekkor kicsit nagyobbak, mint amit az Euler–Bernoulli-képletek adnak, statikailag határozatlan szerkezetben pedig az igénybevételek is kissé módosulnak. Az oldal végén a [Nyírási alakváltozás](#shear-deformation) szakasz megmutatja, mennyivel, és hogyan kapcsolhatod ki.
::

Az *Eredmények* fülön az elmozdulások és az elfordulások a [globális tengelyeket](/hu/elements/conventions#global-axes) követik: a pozitív D<sub>z</sub> lefelé, a pozitív R<sub>y</sub> az óramutató járásával ellentétes elfordulás, az elmozdulások pedig méterben vannak, hacsak a [Beállításokban](/hu/essentials/units-settings) nem változtatod meg a mértékegységet.

## Kéttámaszú tartó, egyenletesen megoszló teher {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, az A pontban csuklós, a B pontban görgős támasz. A támaszköz közepén lévő C csomópontban leolvasható a lehajlás; a rúd kettéosztása ezzel a csomóponttal egyetlen eredményt sem változtat meg.

::model-figure{caption="Kéttámaszú tartó, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Mennyiség | Képlet | Érték |
| --- | --- | --- |
| Támaszerők | $qL/2$ | 36 kN |
| Nyíróerő a támaszoknál | $\pm qL/2$ | +36 kN az A, −36 kN a B pontban |
| Nyomaték a támaszköz közepén | $qL^2/8$ | 54 kNm |
| Elfordulás az A pontban | $qL^3/(24EI)$ | 0,0061547 rad, az óramutató járásával megegyező |
| Lehajlás a C pontban | $5qL^4/(384EI)$ | 11,540 mm, lefelé |

Az EduBeam ugyanezeket az értékeket mutatja. Az *Eredmények* fülön az A csomópontnál R<sub>y</sub> = −0,0061547 rad (negatív: az óramutató járásával megegyező), a C csomópontnál D<sub>z</sub> = 0,01154 m (pozitív: lefelé).

## Konzol, koncentrált erő a végén {#cantilever-tip-load}

$L = 4$ m, befogás az A pontban, $F = 18$ kN lefelé mutató erő a szabad B végen.

::model-figure{caption="Konzol, 18 kN a végén"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Mennyiség | Képlet | Érték |
| --- | --- | --- |
| Függőleges támaszerő | $F$ | 18 kN |
| Befogási nyomaték | $FL$ | 72 kNm, negatív: M = −72 kNm |
| Elfordulás a konzol végén | $FL^2/(2EI)$ | 0,0082063 rad, az óramutató járásával megegyező |
| Lehajlás a konzol végén | $FL^3/(3EI)$ | 21,883 mm, lefelé |

Az *Eredmények* fülön a B csomópontnál R<sub>y</sub> = −0,0082063 rad és D<sub>z</sub> = 0,021883 m.

## Mindkét végén befogott tartó, egyenletesen megoszló teher {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, mindkét vége befogott. Ez a tartó statikailag határozatlan, ezért a megoldás a merevségtől függ; a képletek abból a kompatibilitási feltételből adódnak, hogy mindkét tartóvég elfordulása nulla.

::model-figure{caption="Mindkét végén befogott tartó, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Mennyiség | Képlet | Érték |
| --- | --- | --- |
| Támaszerők | $qL/2$ | 36 kN |
| Támasznyomatékok | $qL^2/12$ | 36 kNm, negatív: M = −36 kNm |
| Nyomaték a támaszköz közepén | $qL^2/24$ | 18 kNm, pozitív |
| Lehajlás a C pontban | $qL^4/(384EI)$ | 2,3080 mm, lefelé |

A végek befogása a teljes nyomatéki ábrát $qL^2/12$-vel tolja el: a támasz és a támaszköz közepe közötti különbség továbbra is $qL^2/8 = 54$ kNm, mint a kéttámaszú tartónál. Ha látni szeretnéd, hogyan történik ez, indulj ki az alkalmazásban a kéttámaszú tartó modelljéből, és állítsd mindkét támaszt **Befogás** típusúra.

## Egyik végén befogott, másik végén görgős támaszú tartó, egyenletesen megoszló teher {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m, befogás az A, görgős támasz a B pontban.

::model-figure{caption="Egyik végén befogott, másik végén görgős támaszú tartó, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Mennyiség | Képlet | Érték |
| --- | --- | --- |
| Támaszerő a befogásnál | $5qL/8$ | 45 kN |
| Támaszerő a görgős támasznál | $3qL/8$ | 27 kN |
| Befogási nyomaték | $qL^2/8$ | 54 kNm, negatív: M = −54 kNm |
| Legnagyobb pozitív nyomaték | $9qL^2/128$ | 30,375 kNm |
| … ott, ahol $V = 0$ | $x = 5L/8$ | 3,75 m-re az A ponttól |
| Elfordulás a B pontban | $qL^3/(48EI)$ | 0,0030773 rad, az óramutató járásával ellentétes |

Az EduBeam az ábrák minden szélsőértékét feliratozza, így a pozitív nyomaték csúcsa ott van megjelölve, ahol fellép. A helyét onnan olvashatod le, ahol a nyíróerő nullán halad át: $V(x) = 45 - 12x = 0$-ból $x = 3{,}75$ m.

## Kétrudas rácsos tartó {#two-bar-truss}

Két rúd indul az A $(0, 0)$ és a B $(4, 0)$ pontban lévő csuklós támaszokból, és a 2 m-rel magasabban lévő C $(2, -2)$ csúcspontban találkozik. Mindkét rúd mindkét végén **rúdvégi csukló** van, így a rudak csak normálerőt visznek. A C pontban $F = 20$ kN függőleges, lefelé mutató erő hat.

::model-figure{caption="Kétrudas rácsos tartó, 20 kN a csúcspontban"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

Mindkét rúd 45°-os szöget zár be. A szimmetria miatt a két rúdban ugyanakkora erő ébred, így a C csomópont függőleges vetületi egyenlete:

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14{,}142\ \text{kN}
\end{aligned}
$$

Mindkét rúd **nyomott**. Mindkét támasz 10 kN-t vesz fel függőlegesen és 10 kN-t vízszintesen, befelé mutatva: a rudak széttolják a támaszokat. Az **N (x)** ábra és a támaszerők ugyanezt mutatják.

## Hőmérséklet-különbség kéttámaszú tartón {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0{,}3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. A felső szál 5 K-nel melegszik, az alsó 5 K-nel hűl, így az alsó és a felső szál hőmérséklet-változásának különbsége $\Delta T_b - \Delta T_t = -10$ K, a rúdtengely hőmérséklete pedig nem változik ($\Delta T_c = 0$). A kéttámaszú tartó szabadon görbülhet, ezért **nem keletkeznek igénybevételek**, csak görbület:

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0{,}3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

A felső szál megnyúlik, az alsó megrövidül, így a tartó **felfelé** hajlik ki:

::model-figure{caption="A felső szál 10 K-nel melegebb az alsónál: a tartó 3,2 mm-t hajlik felfelé, igénybevételek nélkül"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| Mennyiség | Képlet | Érték |
| --- | --- | --- |
| Lehajlás a C pontban | $\kappa L^2/8$ | 3,2 mm, felfelé: D<sub>z</sub> = −0,0032 m |
| Elfordulás az A pontban | $\kappa L/2$ | 0,0016 rad, az óramutató járásával ellentétes |
| Hajlítónyomaték |  | 0 |

Az egyenletes $\Delta T_c$ hőmérséklet-változás csak megnyújtaná a tartót, amit a görgős támasz megenged, így az sem okoz igénybevételt.

Most gátold meg mindkét végen az elfordulást (**Befogás** az A, **Görgős befogás** a B pontban, amely továbbra is engedi a tartó megnyúlását). A görbület nem jöhet létre, helyette a teljes támaszközön állandó nyomaték lép fel:

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547{,}6 \cdot (-4 \times 10^{-4}) = 7{,}019\ \text{kNm}
\end{aligned}
$$

A nyomaték pozitív: a gátolt felső szál meg akarna nyúlni, ezért nyomott lesz.

::model-figure{caption="Ugyanez a tartó mindkét végén gátolt elfordulással: állandó 7,019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

A hőmérsékleti terheket a [Terhek](/hu/essentials/loads#temperature-load) oldalon leírt módon adhatod meg; a $h$ keresztmetszeti magasság a [keresztmetszet](/hu/essentials/elements#cross-sections) adatai között szerepel.

## Támaszsüllyedés {#prescribed-displacement}

Vedd a [befogott–görgős tartót](#propped-cantilever-uniform-load) teher nélkül, és hagyd, hogy a B pontbeli görgős támasz $w = 10$ mm-t süllyedjen. Az EduBeamben ez a B pontban megadott D<sub>z</sub> = 0,01 m **előírt elmozdulás**. Hogy ezt az elmozdulást kikényszerítse, a görgős támasznak le kell húznia a tartó végét, és ez meghajlítja a tartót:

::model-figure{caption="Befogott–görgős tartó, a B pont 10 mm-t süllyed: a görgős támasz 2,437 kN-nal húz lefelé"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| Mennyiség | Képlet | Érték |
| --- | --- | --- |
| Erő a görgős támaszban | $R = 3EIw/L^3$ | 2,4372 kN, lefelé húz |
| Befogási nyomaték | $RL$ | 14,623 kNm, negatív: M = −14,623 kNm |
| Elfordulás a B pontban | $3w/(2L)$ | 0,0025 rad, az óramutató járásával megegyező |

A teherrel ellentétben a süllyedés csak ott okoz erőket, ahol a szerkezet ellenáll neki: itt minél merevebb a tartó, annál nagyobb az $R$. Egy kéttámaszú tartó ugyanezt a süllyedést merev testként követné, mindenféle erő nélkül.

Add vissza a 12 kN/m-es terhet, és az eredmények szuperponálódnak: a befogás most $45 + 2{,}4372 = 47{,}437$ kN-t és $54 + 14{,}623 = 68{,}623$ kNm-t vesz fel, a görgős támasz pedig $27 - 2{,}4372 = 24{,}563$ kN-t. A támaszsüllyedés megadását a [Terhek](/hu/essentials/loads#prescribed-displacements-support-settlements) oldal írja le.

## Nyírási alakváltozás {#shear-deformation}

Az EduBeam gerendaelemei **Timoshenko**-gerendák: a hajlításból adódó lehajláson felül nyírásból is lehajlanak, mégpedig a keresztmetszet $kGA$ nyírási merevsége által meghatározott mértékben. Hogy ez mit változtat meg, az a szerkezettől függ:

- **Statikailag határozott**: a támaszerők és az igénybevételek pusztán az egyensúlyi egyenletekből adódnak, így pontosan ugyanazok maradnak. Csak az elmozdulások nőnek. Kéttámaszú tartóban és konzolban a keresztmetszetek elfordulásai is változatlanok; máshol, például egy konzolos kéttámaszú tartó konzolvégén, ezek is kissé megváltoznak.
- **Statikailag határozatlan**: az erők a merevségtől függenek, így ezek is kissé módosulnak.

### Kéttámaszú tartó {#shear-simply-supported}

Hogy mennyivel, azt a [Gyors kezdés](/hu/guide/quick-start#_8-check-by-hand) tartója mutatja. Ez a fenti kéttámaszú tartó valódi keresztmetszettel, a szelvénykönyvtár **IPE 200 (kb.)** szelvényével: $I_y = 1943$ cm⁴, $A = 28{,}48$ cm² és $k = 0{,}3933$ nyírási tényező (a gerinc részaránya a területből), $G = 81$ GPa mellett. Így $EI = 4080{,}3$ kNm² és $kGA = 90\,720$ kN.

| Mennyiség | Képlet | Érték |
| --- | --- | --- |
| Elfordulás a tartóvégen | $qL^3/(24EI)$ | 0,026469 rad |
| Lehajlás a támaszköz közepén, hajlításból | $5qL^4/(384EI)$ | 49,629 mm |
| Lehajlás a támaszköz közepén, nyírásból | $qL^2/(8kGA)$ | 0,59524 mm |
| Lehajlás a támaszköz közepén, összesen | összeg | 50,224 mm, ahogy az EduBeam mutatja |

A nyírási rész az egész 1,2 %-a. A tartóvég elfordulása az Euler–Bernoulli-érték, ahogy a támaszerők és a nyomatékok is.

### Konzol: rövid rudak {#shear-cantilever}

A végén $F$ erővel terhelt konzol vége hajlításból $FL^3/(3EI)$, nyírásból $FL/(kGA)$ értékkel hajlik le. A kettő aránya

$$
\frac{\text{nyírás}}{\text{hajlítás}} = \frac{3EI}{kGA\,L^2}
$$

Ugyanazzal az IPE 200-zal ez egy 4 m-es konzolnál 0,84 %, egy 1 m-esnél viszont 13,5 %: a nyírási alakváltozás a rövid, magas rudaknál számít.

### Befogott–görgős tartó: az erők átrendeződnek {#shear-propped-cantilever}

Az IPE 200 szelvényből készült [befogott–görgős tartó](#propped-cantilever-uniform-load) statikailag határozatlan, és a görgős támasz most valamivel többet vesz fel. $L = 6$ m mellett $\beta = 3EI/(kGA\,L^2) = 0{,}0037481$, és a görgős támasznál felírt kompatibilitási feltétel ezt adja:

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27{,}034\ \text{kN}
$$

27 kN helyett, a befogási nyomaték pedig 54-ről $qL^2/2 - R_B L = 53{,}798$ kNm-re csökken. Itt ez kevés, de $\beta$-val nő, vagyis a rövid, magas rudaknál.

### Összevetés az Euler–Bernoulli-elmélettel {#shear-switch-off}

Ha az Euler–Bernoulli-képletekkel akarsz összevetni, állítsd a keresztmetszet **Nyírási tényező** értékét nagyon nagyra, például `1e10`-re. A nyírási rész ekkor eltűnik, és ennek az oldalnak minden esete ismét egyezik. Az elem leírását az [elméleti háttér](/hu/elements/beam) tartalmazza.

## Tippek a saját ellenőrzéseidhez {#tips-for-your-own-checks}

- Tartsd szem előtt a nézet jobb alsó sarkában lévő **mértékegységek gombját**; az eltérések többsége mértékegység-tévesztés.
- A pontos számokat az **Eredmények** fülről és a rámutatáskor megjelenő értékekből olvasd le, ne az ábrák feliratairól. A **CSV exportálása** és a **Másolás** a támaszerőket is megadja, táblázatkezelőbe készen. Lásd: [Eredmények és igénybevételi ábrák](/hu/essentials/results#results-tab).
- A Beállításokban állítsd a **Számformátum** értékét *Automatikus* értékre, hogy `4 · 10¹` helyett `40`-et láss.
- Az elmozdulásmódszer tanulásakor a **Merevségi mátrix** ablakkal egyetlen elemet összevethetsz az [elméleti háttérrel](/hu/elements/beam).
- A **Szerkezet megosztása** gombbal átadhatsz egy ellenőrzött modellt egy kollégának vagy az oktatódnak.
- Ha sok esetet ellenőriznél egyszerre, vagy ismert megoldású feladatokat generálnál, futtasd ugyanazt a számítómagot kódból: a [@edubeam/fem](/hu/solver) az a könyvtár, amely az alkalmazás minden számát kiszámítja.
