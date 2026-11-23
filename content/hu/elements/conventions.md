---
description: "Az EduBeam előjelszabálya: x jobbra és z lefelé, pozitív terhek és elmozdulások, lokális tengelyek, N, V és M, rúdvégi erők, támaszerők és a felfelé mutató y tengely."
source: site
---

# Tengelyek és előjelszabály

Az EduBeam által mutatott minden számnak előjele van. Ez az oldal összefoglalja, mit jelent a *pozitív* a koordinátáknál, terheknél, elmozdulásoknál, igénybevételeknél, rúdvégi erőknél és támaszerőknél, hogy az alkalmazás eredményeit összevethesd a saját számításaiddal. A hibásnak látszó eredmények többségéről kiderül, hogy csak előjelszabály kérdése.

| Mennyiség | Pozitív |
| --- | --- |
| `x`, `Dx`, `Fx` | jobbra |
| `z`, `Dz`, `Fz` | **lefelé** |
| `Ry`, `My` | a képernyőn az óramutató járásával ellentétesen |
| $N$ | húzás |
| $V$ | a rúd egy rövid darabját az óramutató járásával megegyezően forgatja |
| $M$ | alul húzott: húzás az alsó szálban, a szaggatott vonal oldalán |
| Támaszerők | az az erő, amellyel a támasz a szerkezetre hat, előjele a teherével azonos módon értendő |

## Globális tengelyek {#global-axes}

A modell az x–z síkban fekszik:

- Az **x** vízszintes, **jobbra** pozitív.
- A **z** függőleges, **lefelé** pozitív.
- Az **y** a képernyőből kifelé, feléd mutat, így a rendszer jobbsodrású. Az elfordulások és a nyomatékok az y tengely körül értendők, ezért **az óramutató járásával ellentétes irány a pozitív**.

A rajzfelület sarkában lévő tengelyjel az x-et pirossal, a z-t zölddel mutatja. Mivel a z lefelé mutat, egy `Z = 0`-ban álló 3 m magas oszlop tetején lévő csomópont koordinátája `Z = −3`. A szögeket, például a ferde támasz szögét, az x-től a z felé mérjük, ami a képernyőn az óramutató járásával megegyező irány.

Ha a felfelé mutató y tengelyt szereted, válts [megjelenítési konvenciót](#y-up-axes): a modell ugyanaz marad, csak a leolvasott és beírt számok változnak.

## Szabadságfokok {#degrees-of-freedom}

Minden csomópontnak három szabadságfoka van:

| Szabadságfok | Jelentés | Pozitív irány | Mértékegység |
| --- | --- | --- | --- |
| `Dx` | vízszintes elmozdulás | jobbra | m |
| `Dz` | függőleges elmozdulás | lefelé | m |
| `Ry` | elfordulás | az óramutató járásával ellentétesen | rad |

Ugyanezek az előjelek érvényesek az [előírt elmozdulásokra](/hu/essentials/loads#prescribed-displacements-support-settlements), a *Csomóponti eredmények* táblázatra és a csomópontra való rámutatáskor megjelenő értékekre.

## Terhek {#loads}

A terhek a tengelyek pozitív irányában pozitívak. Az **Fx**, **Fz** és **My** a csomóponti vagy koncentrált teher összetevői, az **fx** és **fz** az egyenletesen megoszló teheré, az **f₁x**, **f₂x**, **f₁z**, **f₂z** pedig a trapéz alakú teheré az elem elején és végén.

| Teher | Pozitív irány |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, jobbra; bejelölt **LCS** esetén az elem lokális x tengelye mentén |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **lefelé**; bejelölt **LCS** esetén az elem lokális z tengelye mentén |
| `My` | az óramutató járásával ellentétesen |
| `ΔTc` | a rúdtengely felmelegedése, amely megnyújtja a rudat |
| `ΔTb − ΔTt` | az alsó szál melegebb a felsőnél |

A gravitációs teher tehát **pozitív** `fz`, a bal oldali oszlopot jobbra nyomó szél pedig pozitív `fx`. A vonal menti teher mindig a rúd saját hosszának egy méterére hat, akkor is, ha ferde rúdon globális tengelyekben van megadva. Az egyes tehertípusok megadását a [Terhek](/hu/essentials/loads#element-loads) oldal mutatja be.

::model-figure{caption="Itt minden teher pozitív: fz = 5 kN/m az A–B szakaszon, Fz = 10 kN B-ben, My = 10 kNm C-ben és Fx = 10 kN D-ben"}
---
nodes: { A: [0, 0], B: [3, 0], C: [4.5, 0], D: [6, 0] }
supports: { A: fixed }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 5 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
  - { node: D, fx: 10 }
results: []
reactions: false
show: [nodeLabels]
---
::

## Az elem lokális tengelyei {#element-local-axes}

Minden elemnek saját tengelyei vannak:

- a **lokális x** az elem kezdő csomópontjától a végcsomópontja felé mutat;
- a **lokális z** a lokális x **a képernyőn az óramutató járásával megegyezően** 90°-kal elforgatva, ugyanazzal a forgatással, amely a globális x-et a globális z-be viszi. Ha a kezdő csomóponttól a végcsomópont felé haladsz, a lokális z a jobb kezed felé esik.

| Az elem rajzolási iránya | A lokális z iránya |
| --- | --- |
| balról jobbra | lefelé: a lokális és a globális tengelyek egybeesnek |
| jobbról balra | felfelé |
| alulról felfelé | jobbra |
| felülről lefelé | balra |

Az elem irányát a $\theta$ szöge adja meg, amelyet a globális x-től a globális z felé mérünk (a képernyőn az óramutató járásával megegyezően). A [transzformációs mátrix](/hu/elements/beam#transformation-matrix) $\cos\theta$ és $\sin\theta$ segítségével számítja át a rúdvégi elmozdulásokat a két rendszer között.

A nézetben az elem mentén húzott szaggatott vonal a lokális +z oldalt, vagyis az **alsó szálat** jelöli. A bejelölt **LCS** mellett megadott rúdterhek, a koncentrált teher helyzete és a rúdvégi erők mind a lokális tengelyeket követik. Egy elem megfordításához használd a **Csomópontok felcserélése** gombot az *Elemek* táblázatban (lásd [Az elem iránya](/hu/essentials/elements#element-direction)).

## Igénybevételek {#internal-forces}

Vágd el a rudat a kezdő csomópontjától $x$ távolságban. A vágás **előtti** rész keresztmetszetén, amelynek kifelé mutató normálisa a lokális +x irányba mutat, az igénybevételek akkor pozitívak, ha a lokális +x, illetve a lokális +z irányba mutatnak, a nyomaték pedig az óramutató járásával ellentétesen forgat. A másik keresztmetszeten ellentétes irányban hatnak.

::element-sketch{mode="internal-forces" caption="Pozitív N, V és M a rúd egy rövid darabján: húzás, az óramutató járásával megegyezően forgató nyíróerőpár, alul húzott nyomaték (húzott alsó szál a szaggatott vonalnál)"}
::

Szavakkal:

| Mennyiség | Pozitív, ha |
| --- | --- |
| $N$ | húzás |
| $V$ | a rúd egy rövid darabját az óramutató járásával megegyezően forgatja: balról jobbra rajzolt rúdnál a darab bal oldali keresztmetszetén felfelé, a jobb oldalin lefelé hat |
| $M$ | **alul húzott**: húzás az alsó szálban, a szaggatott vonal oldalán |

A lokális tengelyekben értelmezett $q_x$ és $q_z$ vonal menti teherrel fennállnak a következő összefüggések:

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

Egy $F_x$, $F_z$ vagy $M_y$ koncentrált teher helyén (lokális tengelyekben) az igénybevételek ugranak: $\Delta N = -F_x$, $\Delta V = -F_z$ és $\Delta M = -M_y$. A lokális +z irányú erő tehát csökkenti $V$-t, az óramutató járásával ellentétes nyomaték pedig $M$-et.

A gravitációs teherrel terhelt kéttámaszú tartó nyomatéka ezért pozitív, a nyíróerő a bal támasznál pozitív, a jobbnál negatív. Az alábbi tartót a görgős támasznál még húzza is egy erő, így a normálereje pozitív.

::model-figure{caption="Kéttámaszú tartó, 10 kN/m és 20 kN-os húzóerő: M = +45 kNm a támaszköz közepén, V = +30 kN a bal és −30 kN a jobb támasznál, N = +20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
  - { node: B, fx: 20 }
results: [M, V, N]
---
::

A konzolon a nyomaték előjelet vált: a konzol felül húzott. A tengelye mentén ható nyomóerő összenyomja.

::model-figure{caption="Konzol 10 kN-os végponti teherrel és 15 kN-os nyomóerővel: M = −40 kNm a befogásnál, V = +10 kN, N = −15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 10 }
  - { member: 1, px: -15, at: 4 }
results: [M, V, N]
---
::

Keretben minden rúd alsó oldala a lokális +z oldala, így az oszlop rajzolásának iránya dönti el, melyik oldala az „alsó”. Ez a keret A → B → C → D sorrendben készült, ezért minden rúd lokális z tengelye befelé mutat: a pozitív nyomaték a keret belső oldalán okoz húzást, a negatív saroknyomatékok pedig a külső oldalon húzzák a rudakat.

::model-figure{caption="A → B → C → D sorrendben rajzolt keret: mindhárom rúd lokális z tengelye a keret belseje felé mutat"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

Az EduBeam az ábrákat úgy rajzolja, ahogy a legtöbb európai egyetemen szokás: $M$ a húzott oldalon, a pozitív $N$ és $V$ a szaggatott vonallal ellentétes oldalon. A **Beállítások → Megjelenítés beállításai → Igénybevételi ábrák** résznél $M$ a nyomott oldalra, $N$ vagy $V$ a szaggatott oldalra tehető. Ez csak a rajzot változtatja meg, az értékeket soha: az előjelet a feliratról olvasd le, ne abból, hogy az ábra melyik oldalon van.

## Rúdvégi erők (Elemek eredményei táblázat) {#end-forces-element-results-table}

Az *Elemek eredményei* táblázat elemenként hat **rúdvégi erőt** sorol fel, az elem **lokális** tengelyeiben:

::element-sketch{mode="end-forces" caption="A hat rúdvégi erő, mindegyik pozitív irányban rajzolva: a lokális x és z mentén, illetve az óramutató járásával ellentétesen"}
::

| Oszlop | Hol hat az elemre | Pozitív irány |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | a kezdő csomópontjában | lokális +x, lokális +z, az óramutató járásával ellentétesen |
| `X21`, `Z21`, `M21` | a végcsomópontjában | lokális +x, lokális +z, az óramutató járásával ellentétesen |

Ezek azok az erők, amelyekkel a csomópontok az elemre hatnak: az elem merevségi mátrixának és rúdvégi elmozdulásainak szorzata, plusz azok az erők, amelyek a rúdterheit tartanák, ha mindkét vége be volna fogva:

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

ahol $\mathbf{d}_l$ az elem lokális tengelyekben vett rúdvégi elmozdulásai, $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ pedig a [rúdterheiből](/hu/elements/beam#element-loads) származó egyenértékű csomóponti terhek.

A rúdvégi erők a tengelyeket követik, nem az $N$–$V$–$M$ előjelszabályt, ezért a kezdő csomópontban ellentétes az előjelük:

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

A fenti kéttámaszú tartóra: `X12 = −20 kN` és `X21 = +20 kN` (húzás), `Z12 = Z21 = −30 kN` (mindkét támasz felfelé, vagyis −z irányba nyom), és `M12 = M21 = 0`.

Minden csomópontban az ott találkozó elemek globális tengelyekre átszámított rúdvégi erőinek összege egyenlő a csomóponti teher és a támaszerő összegével. Így gyorsan ellenőrizheted egy csomópont egyensúlyát.

## Támaszerők {#reactions}

A támaszerő az az erő vagy nyomaték, amellyel a támasz **a szerkezetre** hat, minden gátolt szabadságfokhoz egy. Előjele a teherével azonos módon értendő: +x irányban, +z irányban (lefelé) és az óramutató járásával ellentétesen pozitív. A gravitációs terhet viselő támasz `Rz` támaszereje ezért **negatív**.

A támaszerők globális tengelyekben szerepelnek, vagy a csomópont saját tengelyeiben, ha a csomópontnak van **Csomóponti koordináta-rendszer szöge** ([ferde támasz](/hu/essentials/nodes-supports#inclined-skewed-supports)). A nézetben minden támaszerő egy nyíl, amely abba az irányba mutat, amerre a támasz nyom, és a nagysága van mellé írva. Az előjeles értékek a CSV-exportban találhatók, `Rx`, `Rz` és `My` néven.

## Felfelé mutató y tengely {#y-up-axes}

A **Beállítások → Nyelv és területi beállítások → Koordináta-rendszer → x jobbra, y felfelé** mindent, amit beírsz és leolvasol, a tankönyvi rendszerre állít át: **x** jobbra, **y** felfelé, **z** feléd mutat. A modell, a mentett fájlok és a rajzok pontosan ugyanazok maradnak; csak a számok és a betűk változnak:

| Mennyiség | x jobbra, z lefelé (alapértelmezés) | x jobbra, y felfelé |
| --- | --- | --- |
| Függőleges koordináta | `Z` | `Y`, ellentétes előjellel |
| Függőleges terhek, elmozdulások, támaszerők, rúdvégi erők | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, ellentétes előjellel |
| Elfordulások és nyomatékok | `Ry`, `My` | `Rz`, `Mz`, azonos előjellel (az óramutató járásával ellentétesen pozitív) |
| Támasz szöge | az óramutató járásával megegyezően mérve | az óramutató járásával ellentétesen mérve, ellentétes előjellel |
| Igénybevételek | $N$, $V$, $M$ | ugyanazok, azonos előjellel, ugyanúgy rajzolva |

Felfelé mutató y tengellyel tehát a gravitációs teher **negatív** `fy`, egy 3 m magas oszlop teteje pedig `Y = 3`.

## Mértékegységek {#units}

A számítómag mindenhol SI-egységekben dolgozik: m, N, Pa, rad, a hőmérséklet-változásokat pedig K-ben kezeli. A [Mértékegységek és beállítások](/hu/essentials/units-settings) oldalon választott megjelenítési mértékegységek csak azt változtatják meg, amit beírsz és leolvasol, a modellt soha.
