---
description: "Erők, nyomatékok, támaszsüllyedések, egyenletesen megoszló, trapéz alakú, koncentrált és hőmérsékleti terhek az EduBeamben, és előjelük: a z tengely lefelé mutat, a nyomaték az óramutató járásával ellentétesen pozitív."
source: site
---

# Terhek

A terhek csomópontokon vagy elemek mentén hatnak. Mind **ugyanahhoz az egy terhelési esethez** tartoznak, és együtt hatnak; ha változatokat akarsz összehasonlítani, mindegyiket mentsd külön [projektfájlba vagy linkbe](/hu/essentials/import-export).

| Teher | Hol hat | Hol adod hozzá |
| --- | --- | --- |
| [Erő vagy nyomaték](#nodal-loads) | csomóponton | *Terhek* fül → **Csomóponti teher hozzáadása**, vagy kattints a csomópontra → **Teher hozzáadása** |
| [Előírt elmozdulás](#prescribed-displacements-support-settlements) (támaszsüllyedés) | megtámasztott csomóponton | ugyanabban a párbeszédablakban, vagy kattints a csomópontra → **Elmozdulás előírása** |
| [Egyenletesen megoszló](#uniformly-distributed-load), [trapéz alakú](#trapezoidal-load), [koncentrált](#concentrated-load) vagy [hőmérsékleti](#temperature-load) teher | elemen | *Terhek* fül → **Rúdteher hozzáadása**, vagy kattints az elemre → **Teher hozzáadása** |

## Előjelszabály {#sign-convention-in-one-line}

Az x tengely **jobbra**, a z tengely **lefelé** mutat, a nyomaték pedig az **óramutató járásával ellentétesen** pozitív. A pozitív `Fz` vagy `fz` tehát lefelé mutató, a gravitációhoz hasonló teher, a felfelé mutató teher pedig negatív.

::model-figure{caption="Itt minden teher pozitív: Fx = +10 kN jobbra, Fz = +10 kN lefelé, My = +10 kNm az óramutató járásával ellentétesen"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| Pozitív irány | Alapértelmezett tengelyek (z lefelé) | [Felfelé mutató y tengely](/hu/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Vízszintes erő `Fx`, `fx` | jobbra | jobbra |
| Függőleges erő | `Fz`, `fz`: **lefelé** | `Fy`, `fy`: **felfelé** |
| Nyomaték | `My`: az óramutató járásával ellentétesen | `Mz`: az óramutató járásával ellentétesen |
| Függőleges támaszsüllyedés | `Dz`: lefelé | `Dy`: felfelé |

Az elem **lokális tengelyeiben** megadott terhek (bejelölt LCS) viszont az elemet követik: a lokális x tengely a kezdőcsomóponttól a végcsomópont felé mutat, a lokális z pedig a lokális x tengelyből 90°-os, az óramutató járásával megegyező elforgatással adódik, és az elem mentén rajzolt szaggatott vonal felé mutat. Lásd: [Az elem iránya](/hu/essentials/elements#element-direction). A teljes előjelszabályt, az igénybevételekkel együtt, a [Tengelyek és előjelszabály](/hu/elements/conventions#loads) oldal írja le.

## Csomóponti terhek {#nodal-loads}

*Terhek* fül → **Csomóponti teher hozzáadása**, vagy kattints egy csomópontra → **Teher hozzáadása**, és hagyd kiválasztva az **Erő/nyomaték** lehetőséget. Add meg az `Fx`, `Fz` erőt (kN) és az `My` nyomatékot (kNm) a [fenti](#sign-convention-in-one-line) előjelekkel; az előnézet már gépelés közben megrajzolja a terhet.

![Csomóponti teher hozzáadása: az előnézet gépelés közben mutatja az irányt](/screenshots/hu/loads-nodal.webp){.shot-md}

- Az összetevők **globális** tengelyekben értendők. Elforgatott tengelyű csomópontnál ([ferde támasz](/hu/essentials/nodes-supports#inclined-skewed-supports)) a párbeszédablakban megjelenik egy **Globális tengelyek** / **Csomóponti tengelyek** kapcsoló. Csomóponti tengelyekben az `Fx′` és `Fz′` jelű összetevők a csomópont saját tengelyei mentén hatnak, és ha a szög később változik, velük együtt fordulnak el. Átváltáskor az értékek úgy számítódnak át, hogy a teher ugyanaz maradjon.
- Egy csomópontra több csomóponti teher is hathat; ezek összeadódnak.

### Előírt elmozdulások (támaszsüllyedések) {#prescribed-displacements-support-settlements}

Ha egy támaszt adott értékkel el akarsz mozdítani, ugyanebben a párbeszédablakban válaszd az **Előírt elmozdulás** lehetőséget, vagy kattints egy megtámasztott csomópontra → **Elmozdulás előírása**. Add meg a `Dx`, `Dz` elmozdulást (jobbra és lefelé pozitív, az [elmozdulás mértékegységében](/hu/essentials/units-settings#units), alapértelmezés szerint m-ben) és az `Ry` elfordulást (rad, az óramutató járásával ellentétesen pozitív).

- Elmozdulás csak **gátolt** szabadságfokban írható elő: a többi mező szürke, támasz nélküli csomópontnak pedig egyáltalán nem lehet támaszsüllyedése.
- Egy csomópontnak legfeljebb egy előírt elmozdulása lehet. Ha módosítani akarod, szerkeszd, ne adj hozzá másodikat.
- Ferde támasznál a mezők jele `Dx′` és `Dz′`: a támaszsüllyedés a támasz saját tengelyei mentén hat.

Hogy a támaszsüllyedés okoz-e igénybevételt, az a szerkezettől függ. Ugyanaz a 10 mm-es süllyedés a B támasznál, más teher nélkül:

::div{.shots}

:::model-figure{caption="Kéttámaszú tartó: csak elbillen; nincsenek támaszerők, M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="B fölött folytatólagos tartó: meghajlik, M = 21,06 kNm B fölött"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

A statikailag határozott szerkezet ellenállás nélkül követi a támaszt. A többtámaszú tartónak viszont meg kell hajlania: a B támasz $\delta = 10\ \text{mm}$-rel lehúzza, mintha egy 10 m-es támaszközű kéttámaszú tartó közepén koncentrált erő hatna. $L = 5\ \text{m}$ és a példában szereplő acéltartó $EI = 17\,548\ \text{kNm}^2$ hajlítási merevsége mellett ez az erő $P = 6EI\delta/L^3 = 8{,}423\ \text{kN}$, vagyis a B-beli támaszerő, és $M_B = PL/2 = 3EI\delta/L^2 = 21{,}06\ \text{kNm}$. A [Többtámaszú tartó és támaszsüllyedés](/hu/tutorials/continuous-beam) oktatóanyag a támaszsüllyedést terhekkel együtt vizsgálja.

## Rúdterhek {#element-loads}

*Terhek* fül → **Rúdteher hozzáadása**, vagy kattints egy elemre → **Teher hozzáadása**. Válaszd ki a **Teher típusa** értékét; az előnézet gépelés közben mutatja a terhet az elemen. Az erők kN-ban, a vonal menti terhek kN/m-ben értendők, vagy a választott [mértékegységekben](/hu/essentials/units-settings#units).

![Rúdteher hozzáadása egyenletesen megoszló teherrel](/screenshots/hu/loads-udl.webp){.shot-md}

### Egyenletesen megoszló teher {#uniformly-distributed-load}

Állandó, hosszegységre jutó `fx` és `fz` teher a teljes elemen. Bejelölt **LCS** mellett (ez az alapértelmezés) az elem lokális tengelyei mentén hat, bejelölés nélkül a globális tengelyek mentén. Balról jobbra rajzolt vízszintes elemen a kettő ugyanaz; ferde rúdon nem:

| Amit szeretnél | Amit beírsz |
| --- | --- |
| a rúdra **merőleges** teher (szél a szarufán) | `fz`, **bejelölt** LCS |
| **függőleges** teher a rúd egy méterére (önsúly) | `fz`, LCS **bejelölés nélkül** |
| **függőleges** teher a vízszintes vetület egy méterére (hó) | közvetlenül nem adható meg: szorozd meg $\cos\alpha$-val, ahol $\alpha$ a rúd hajlásszöge, és add meg függőleges teherként |

Ugyanaz a 10 kN/m egy szarufán, amelynek vízszintes vetülete 4 m, magassága 3 m, hossza 5 m:

::div{.shots}

:::model-figure{caption="LCS bejelölés nélkül: függőleges, összesen 50 kN; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="Bejelölt LCS: a rúdra merőleges; M = 31,25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

Kézi számítással: merőleges teherre $M = qL^2/8 = 10 \cdot 5^2/8 = 31{,}25\ \text{kNm}$; függőleges teherre az 50 kN 4 m támaszközre elosztva 12,5 kN/m a vetületen, így $M = 12{,}5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Trapéz alakú teher {#trapezoidal-load}

Az elem mentén lineárisan változó teher: `f1x`, `f1z` a **kezdő**csomópontban, `f2x`, `f2z` a **vég**csomópontban. Háromszög alakú teherhez az egyik végén adj meg nullát.

::model-figure{caption="Háromszög alakú teher 0-tól 10 kN/m-ig: a támaszerők 10 és 20 kN, a legnagyobb nyomaték M = 23,09 kNm, 3,46 m-re"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

Kézi számítással: a $qL/2 = 30\ \text{kN}$ eredő $2L/3$ távolságban hat, így $R_A = 10\ \text{kN}$ és $R_B = 20\ \text{kN}$; a nyíróerő nulla, a nyomaték pedig legnagyobb az $x = L/\sqrt{3} = 3{,}46\ \text{m}$ helyen, ahol $M = qL^2/(9\sqrt{3}) = 23{,}09\ \text{kNm}$.

A trapéz alakú terhek az elem **lokális tengelyei** mentén hatnak (az LCS mező zárolva van). Balról jobbra rajzolt vízszintes elemen ez ugyanaz, mintha globális tengelyekben adnád meg; ferde elemen az `f1z` és az `f2z` merőleges a rúdra, az `f1x` és az `f2x` pedig a rúd irányába mutat.

Ferde, $\alpha$ hajlású rúdon a változó **függőleges** teher is pontosan megadható: mindkét végén add meg a két lokális összetevőjét, az $f_z = q\cos\alpha$ és a lejtőn lefelé mutató $f_x = q\sin\alpha$ értéket; ez utóbbi negatív, ha az elem a kezdőcsomópontjától felfelé halad. A fenti, 4 m vetületű és 3 m magas, alulról rajzolt szarufán a rúd egy méterére jutó, 0-tól 10 kN/m-ig növekvő függőleges teher így adható meg: `f1x` = `f1z` = 0, `f2x` = −6 és `f2z` = 8 kN/m.

::model-figure{caption="Függőleges teher 0-tól 10 kN/m-ig a rúd hosszára, lokális összetevőkkel megadva: a támaszerők 8,333 és 16,67 kN, a legnagyobb nyomaték M = 12,83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

Kézi számítással: a 25 kN-os eredő a vetület kétharmadánál, 2,67 m-nél hat, így $R_B = 25 \cdot 2{,}667/4 = 16{,}67\ \text{kN}$. A 4 m-es vetületen a teher 12,5 kN/m-ig növekvő háromszög, így a fentiekhez hasonlóan $M = 12{,}5 \cdot 4^2/(9\sqrt{3}) = 12{,}83\ \text{kNm}$.

### Koncentrált teher {#concentrated-load}

`Fx`, `Fz` koncentrált erő vagy `My` nyomaték az elem **mentén** bárhol, külön csomópont nélkül. A **Távolság a kezdőponttól** a teher $a$ távolsága a kezdőcsomóponttól, $0 \le a \le L$. Kezdőértéke a hossz fele egész méterre lefelé kerekítve, legfeljebb 5 m (amerikai mértékegységekben egész láb, legfeljebb 15 ft), ezért állítsd be oda, ahol a terhed valóban van. Az **LCS** ugyanúgy működik, mint az egyenletesen megoszló tehernél.

::model-figure{caption="20 kN 2 m-re egy 6 m-es támaszközön: V 13,33-ról −6,667 kN-ra ugrik, a teher alatt M = 26,67 kNm"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

A nyíróerőábra a teher helyén `Fz`-vel ugrik, a nyomatéki ábrának pedig ott töréspontja van: $R_A = 20 \cdot 4/6 = 13{,}33\ \text{kN}$, $M = 13{,}33 \cdot 2 = 26{,}67\ \text{kNm}$. A koncentrált `My` nyomaték viszont a nyomatéki ábrában okoz ugrást.

### Hőmérsékleti teher {#temperature-load}

| Mező | Jelentés | Hatás |
| --- | --- | --- |
| **ΔT<sub>c</sub>**, a rúdtengely hőmérséklet-változása | ugyanaz a változás a teljes keresztmetszetben | megnyúlás: $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | az alsó és a felső szál hőmérséklet-változásának különbsége | görbület: $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Mindkettő a feszültségmentes állapothoz viszonyított hőmérséklet-*változás*, alapértelmezés szerint °C-ban; 1 °C-os változás 1 K-nek felel meg. A hőmérsékleti terhek az anyag **α** értékét és a keresztmetszet **h magasságát** használják. Az **alsó** szál a szaggatott vonal felőli oldalon van. A pozitív ΔT<sub>b</sub> − ΔT<sub>t</sub> (alul melegebb) megnyújtja az alsó szálat, így az elem úgy hajlik le, mint egy gravitációs teherrel terhelt tartó.

Statikailag határozott szerkezetben a hőmérséklet-változás csak elmozdulásokat okoz. Ha a szerkezet gátolja az alakváltozást (befogott végek, folytatólagosság, fölös rudak), igénybevételek keletkeznek. Ugyanaz a 6 m-es, 0,3 m magas acéltartó, alul 20 K-nel melegebb, mint felül:

::div{.shots}

:::model-figure{caption="Kéttámaszú tartó: a támaszköz közepén 3,6 mm-t hajlik le, M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="Mindkét végén befogott tartó: egyenes marad, M = −14,04 kNm a teljes hosszán"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

Kézi számítással: a szabad görbület $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0{,}3 = 8 \times 10^{-4}\ \text{1/m}$. A kéttámaszú tartó akadálytalanul felveszi, és $\kappa L^2/8 = 3{,}6\ \text{mm}$-t hajlik le. Befogott végeknél egy állandó nyomatéknak kell ezt kiegyenlítenie: $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14{,}04\ \text{kNm}$. Egy másik esetet az [Eredmények ellenőrzése kézi számítással](/hu/guide/verification#temperature-gradient-on-a-simply-supported-beam) oldal dolgoz fel.

## Terhek szerkesztése és törlése {#editing-and-removing-loads}

| Feladat | Teendő |
| --- | --- |
| Értékek gyors módosítása | Szerkeszd az összetevőket (és az LCS mezőt) közvetlenül a *Terhek* fülön. |
| A szerkesztő párbeszédablak megnyitása | Kattints duplán a teherre a nézetben, vagy kattints rá → **Teher szerkesztése**. A terhek címkeként a *Csomópontok* és az *Elemek* táblázatban is megjelennek; a szerkesztéshez kattints a címkére. |
| Törlés | Jelöld ki, és nyomd meg a <kbd>Delete</kbd> billentyűt, kattints rá → **Törlés**, vagy használd a × gombot a *Terhek* fülön. |

A terhek a csomópontjukhoz vagy elemükhöz tartoznak: ha a csomópontot vagy az elemet törlöd, velük együtt törlődnek, ha pedig a terheivel együtt kijelölve másolod, azok is másolódnak.

![A Terhek fül: terhenként egy sor, az összetevők közvetlenül szerkeszthetők](/screenshots/hu/loads-table.webp)

## Ami nem érhető el {#what-is-not-available}

::div{.limits}
- **Egyetlen terhelési eset.** Teherkombinációk nincsenek: minden esetet ments külön fájlba vagy linkbe.
- **Nincs önsúly.** Add meg egyenletesen megoszló teherként, LCS bejelölés nélkül: $f_z = \rho\,g\,A$, például IPE 200 esetén $\approx 0{,}22\ \text{kN/m}$.
- **Trapéz alakú teher csak lokális tengelyekben.** Ferde rúdon a változó függőleges terhet a [lokális összetevőivel](#trapezoidal-load) add meg.
- **Nincs részleges vonal menti teher.** A vonal menti teher a teljes elemre hat: vegyél fel csomópontot ott, ahol kezdődik vagy véget ér.
::
