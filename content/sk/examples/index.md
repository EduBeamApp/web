---
description: "Šesť vyriešených nosníkov, rámov a priehradových konštrukcií, ktoré otvoríte v EduBeame jedným kliknutím, s námetmi na cvičenia a výsledkami na kontrolu ručného výpočtu."
source: site
---

# Príklady

Každá dlaždica nižšie je živý, vyriešený model. Po kliknutí sa otvorí v aplikácii [EduBeam]{.edubeam}, pripravený na úpravy: presuňte uzol, zmeňte zaťaženie alebo zaškrtnite kĺb a sledujte, ako sa priebehy zmenia. Námety na cvičenia nižšie urobia z každého modelu krátku úlohu, aj s výsledkami, s ktorými porovnáte svoj ručný výpočet.

::feature-structures
::

Tie isté modely nájdete v aplikácii v ponuke **☰ → Príklady** a odkaz [run.edubeam.app/?panel=examples&lang=sk](https://run.edubeam.app/?panel=examples&lang=sk){target="_blank"} otvorí galériu priamo.

::callout{type="info" title="Rovnaké prvky vo všetkých šiestich príkladoch"}
Všetky príklady používajú rovnaké oceľové prvky: $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (takže $EI = 17\,548$ kNm²), plochu $1\ \text{m}^2$ a takú veľkú šmykovú tuhosť, že osové aj šmykové deformácie sú zanedbateľné. Učebnicové vzorce pre štíhle nosníky sa preto s výsledkami aplikácie zhodujú vo všetkých zobrazených čísliciach. Výška prierezu je $1$ m; uplatní sa iba pri teplotnom zaťažení.
::

## Námety na cvičenia {#suggested-exercises}

Najprv výsledok vypočítajte ručne a potom ho overte v aplikácii: model otvorte z jeho dlaždice hore alebo tlačidlom **Otvoriť v EduBeame** pod jeho obrázkom. Otvorený model nahradí ten, ktorý máte rozpracovaný; skratka <kbd>Ctrl</kbd>+<kbd>Z</kbd> vám ho vráti a nájdete ho aj v ponuke **☰ → Nedávne konštrukcie**.

### Staticky neurčitý nosník {#exercise-indeterminate-beam}

Nosník dĺžky 3 m, votknutý v A a uložený na posuvnom kĺbe v B, so zaťažením 10 kN/m.

::model-figure{caption="Votknutie v A, posuvný kĺb v B, 10 kN/m"}
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

1. Ručne určte reakcie a moment vo votknutí, silovou metódou alebo pomocou tabuliek momentov vo votknutí.
2. Zrušte zaškrtnutie `Ry` v A a nosník bude prostý. Ako sa zmení najväčší moment?
3. Znova zaškrtnite `Ry` v A a zaškrtnite ho aj v B: nosník bude obojstranne votknutý.

**Všimnite si,** kde priebeh momentu mení znamienko a ako votknutie prenáša väčšiu časť zaťaženia než posuvný kĺb.

::callout{type="details" title="Riešenie"}
- Jednostranne votknutý nosník: $R_A = 5qL/8 = 18{,}75$ kN, $R_B = 3qL/8 = 11{,}25$ kN, $M_A = qL^2/8 = 11{,}25$ kNm (záporný moment). Najväčší kladný moment je $9qL^2/128 = 6{,}33$ kNm vo vzdialenosti 1,125 m od B, kde je priečna sila nulová.
- Prostý nosník: $qL^2/8 = 11{,}25$ kNm v strede rozpätia, teda rovnaká hodnota, akú predtým prenášalo votknutie.
- Obojstranne votknutý nosník: záporný moment $qL^2/12 = 7{,}5$ kNm na koncoch, kladný moment $qL^2/24 = 3{,}75$ kNm v strede rozpätia.
::

### Konzola {#exercise-cantilever}

Konzola dĺžky 4 m, votknutá v A, so silou 18 kN nadol na voľnom konci B.

::model-figure{caption="Konzola, 18 kN na voľnom konci"}
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

1. Určte moment vo votknutí, priehyb a pootočenie voľného konca. Porovnajte ich s hodnotami uzla B na karte **Výsledky → Výsledky v uzloch**.
2. Na karte **Prierezy** zmenšite $I_y$ na polovicu. Čo sa zmení a čo nie?
3. Nahraďte osamelú silu rovnomerným spojitým zaťažením 4,5 kN/m, teda rovnakým celkovým zaťažením 18 kN: na karte **Zaťaženie** vymažte uzlové zaťaženie a potom použite **Pridať prvkové zaťaženie**.

**Všimnite si** tvar priebehu momentov: od osamelej sily je to priamka, od spojitého zaťaženia parabola.

::callout{type="details" title="Riešenie"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21{,}88$ mm, $\varphi_B = FL^2/(2EI) = 8{,}21$ mrad.
- Polovičné $I_y$ zdvojnásobí priehyb na 43,77 mm. Moment zostane 72 kNm: konzola je staticky určitá, takže jej vnútorné sily od tuhosti nezávisia.
- Spojité zaťaženie: $M_A = qL^2/2 = 36$ kNm a $w_B = qL^4/(8EI) = 8{,}21$ mm. Rovnaké celkové zaťaženie dá polovičný moment a tri osminy priehybu.
::

### Warrenov priehradový nosník {#exercise-pratt-truss}

Priehradový nosník s rozpätím 9 m a výškou 1,8 m so silou 8 kN v každom z troch horných uzlov E, F a G. Normálové sily zobrazíte zaškrtnutím **N(x)** v možnostiach zobrazenia. (So striedavo sklonenými diagonálami a bez zvislíc ide o usporiadanie, ktoré väčšina učebníc nazýva Warrenov nosník.)

::model-figure{caption="Uzly A až G, 8 kN v E, F a G"}
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

1. Určte reakcie a potom uzlovou metódou sily v krajnej diagonále A–E a v dolnom páse A–B.
2. Priesečnou metódou určte silu v hornom páse v strednom poli a silu v dolnom páse B–C.
3. Uzly sú v tomto modeli tuhé. Na karte **Prvky** zaškrtnite pri každom prúte oba koncové kĺby, aby vznikla priehradová konštrukcia s kĺbovými uzlami, a porovnajte normálové sily.
4. Vymažte diagonálu B–F, najprv s tuhými uzlami, potom s kĺbmi. Udrží sa konštrukcia?

**Všimnite si** rozloženie znamienok: horný pás je tlačený, dolný ťahaný a znamienka diagonál sa striedajú.

::callout{type="details" title="Riešenie"}
- Reakcie: 12 kN v A aj v D.
- Krajné diagonály: tlak 15,62 kN. Dolný pás A–B a C–D: ťah 10,00 kN.
- Horný pás E–F a F–G: tlak 13,33 kN (momentová podmienka k B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$). Dolný pás B–C: ťah 16,67 kN (momentová podmienka k F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$). Vnútorné diagonály: 5,21 kN, ťah v diagonálach vedúcich z E a G nadol k dolnému pásu, tlak v diagonálach vedúcich nahor k F.
- Tuhé aj kĺbové uzly dávajú rovnaké normálové sily s odchýlkou do 0,1 %. Ohyb v priehradovej konštrukcii zloženej z trojuholníkov je zanedbateľný, a preto model s kĺbovými uzlami funguje.
- Bez B–F sa konštrukcia s tuhými uzlami udrží vďaka rámovému pôsobeniu, s ohybovými momentmi okolo 3 kNm. S kĺbmi jej jeden prút chýba: stane sa z nej mechanizmus a EduBeam ukáže, ako sa môže pohybovať.
::

### Spojitý nosník s tromi poľami {#exercise-three-span-continuous-beam}

Nosník dĺžky 16 m s poľami 5 + 6 + 5 m: 8 kN/m v prvom poli, 20 kN v C a 6 kN/m v poslednom poli. Po otvorení je podopretý iba v A a D.

::model-figure{caption="Po otvorení: podopretý iba v A a D"}
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

1. Po otvorení ide o jeden prostý nosník dĺžky 16 m. Určte reakcie a momenty v B a C.
2. Zaškrtnutím `Dz` v B a v C z neho urobíte spojitý nosník na štyroch podperách.
3. Momenty nad B a C určte z rovnice troch momentov (Clapeyronovej rovnice) a potom dopočítajte reakcie.

**Všimnite si** záporné momenty, ktoré sa objavia nad vnútornými podperami, o koľko menšie sú všetky momenty a čo sa stane so silou 20 kN, len čo je v C podpera.

::callout{type="details" title="Riešenie"}
- Prostý nosník: $R_A = 44{,}69$ kN, $R_D = 45{,}31$ kN, $M_B = 123{,}4$ kNm a $M_C = 151{,}6$ kNm, oba kladné.
- Spojitý nosník, s $M_A = M_D = 0$:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  Z toho $M_B = -9{,}766$ kNm a $M_C = -5{,}859$ kNm, oba záporné. Sila 20 kN v C prejde priamo do podpery a nič neohýba.
- Reakcie: A 18,05 kN, B 22,60 kN, C 35,52 kN (vrátane 20 kN), D 13,83 kN. Ich súčet je 90 kN, teda celé zaťaženie.

::model-figure{caption="Spojitý nosník na štyroch podperách"}
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

### Rámová konštrukcia {#exercise-portal-frame}

Rám s nosníkom dĺžky 8 m na dvoch stĺpoch výšky 6 m, votknutý v A a uložený na posuvnom kĺbe v D. Nosník nesie 10 kN/m a horný roh C zaťažuje sila 8 kN doľava a 10 kN nadol.

::model-figure{caption="Votknutie v A, posuvný kĺb v D: 10 kN/m na nosníku, 8 kN a 10 kN v C"}
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

1. Koľkokrát je rám staticky neurčitý?
2. Zrušte zaškrtnutie `Ry` v A, aby sa z votknutia stal pevný kĺb. Rám je teraz staticky určitý: ručne určte reakcie a momenty v rohoch B a C.
3. Znova zaškrtnite `Ry` v A a potom zaškrtnite `Dx` v D, aby sa z posuvného kĺbu stal pevný kĺb. V deformovanom tvare sledujte vodorovný posun nosníka.

**Všimnite si,** ktorým smerom sa horná časť rámu posunie. Pri ráme v pôvodnej podobe sa posunie doprava, proti sile 8 kN. Prečo?

::callout{type="details" title="Riešenie"}
- Štyri zložky reakcií (tri vo votknutí, jedna v posuvnom kĺbe) a tri podmienky rovnováhy: rám je jedenkrát staticky neurčitý. S pevným kĺbom aj v D dvakrát.
- Pevný kĺb v A: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN doprava. Moment v rohu B je $8 \cdot 6 = 48$ kNm. V C je nulový: bez vodorovnej reakcie v D prenáša pravý stĺp iba normálovú silu 44 kN.
- V pôvodnej podobe sa horná časť rámu posunie o 9,5 mm doprava: moment od zaťaženého nosníka ohýba votknutý stĺp viac než sila 8 kN. S pevným kĺbom v D prenesie podpera D vodorovnú silu 4,9 kN a horná časť sa posunie o 4,8 mm doľava.
::

### Teplotné zaťaženie {#exercise-temperature-load}

Prostý nosník dĺžky 8 m, ktorého strednica sa zohreje o $\Delta T_s = 20$ K a ktorého dolné vlákna sú o 10 K chladnejšie ako horné ($\Delta T_d - \Delta T_h = -10$ K).

::model-figure{caption="Prostý nosník dĺžky 8 m zohriaty o 20 K, dolné vlákna o 10 K chladnejšie ako horné"}
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

1. Skôr než sa pozriete do aplikácie: aké vnútorné sily teplota vyvolá a ako sa nosník pretvorí?
2. Zaškrtnite `Dx` v B, aby sa nosník nemohol predĺžiť.
3. Zaškrtnite navyše `Ry` na oboch koncoch.

**Všimnite si** deformovaný tvar a hodnoty na karte **Výsledky → Výsledky v uzloch**: nosník sa pretvára bez akýchkoľvek vnútorných síl, kým mu v tom podpery nebránia.

::callout{type="details" title="Riešenie"}
- Staticky určitý nosník sa môže voľne predĺžiť aj prehnúť, takže nevzniknú žiadne vnútorné sily. Bod B sa posunie von o $\alpha \Delta T_s L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1{,}92$ mm. Chladnejšie dolné vlákna sa skrátia, takže sa nosník vyklene nahor s krivosťou $\kappa = \alpha (\Delta T_d - \Delta T_h)/h = -1{,}2 \cdot 10^{-4}$ 1/m: konce sa pootočia o $\kappa L/2 = 0{,}48$ mrad a stred rozpätia sa zdvihne o $\kappa L^2/8 = 0{,}96$ mm.
- Keď sú oba konce zachytené v smere x: $N = -EA\alpha\Delta T_s = -50\,400$ kN, tlak. Taká veľká sila vychádza z modelovej plochy 1 m²; IPE 200 s plochou 28,48 cm² by prenášal 143,5 kN.
- Keď sú oba konce votknuté: konštantný moment $EI\alpha(\Delta T_d - \Delta T_h)/h = 2{,}11$ kNm po celej dĺžke nosníka.
::

## Riešené návody {#worked-tutorials}

Väčšie modely, zostavené krok za krokom a overené ručným výpočtom:

::card-grid{cols="2"}
:::card{title="Šikmý nosník" icon="lucide:move-diagonal" to="/sk/tutorials/inclined-beam"}
Krokva zaťažená snehom: zaťaženie na meter pôdorysu, normálové a priečne sily pozdĺž sklonu a natočený posuvný kĺb.
:::
:::card{title="Trojkĺbový rám" icon="lucide:triangle" to="/sk/tutorials/three-hinged-frame"}
Reakcie, N, V a M rámu s vnútorným kĺbom.
:::
:::card{title="Rovinná priehradová konštrukcia" icon="lucide:git-fork" to="/sk/tutorials/truss"}
Uzlová metóda, priesečná metóda, nulový prút a priehyb princípom virtuálnych prác.
:::
:::card{title="Spojitý nosník a pokles podpery" icon="lucide:spline" to="/sk/tutorials/continuous-beam"}
Nosník s dvoma poľami riešený silovou metódou, potom s poklesom strednej podpery o 10 mm.
:::
::

Ďalšie kontroly v uzavretom tvare nájdete v kapitole [Ručné overenie výsledkov](/sk/guide/verification).

## Ďalšie úlohy {#more-problems}

[Precvičovanie](/sk/practice) vám kedykoľvek pripraví nový nosník, rám alebo priehradovú konštrukciu s novými číslami a hneď skontroluje vaše reakcie a najväčší moment alebo silu v prúte. Pre celú triedu vytlačí [Generátor písomiek](/sk/exam) každému študentovi iný variant písomky aj s kľúčom riešení a knižnica [@edubeam/plot](/sk/guide/teaching#exercise-sheets-tests-and-slides-from-code) vytvára zadania cvičení priamo z kódu.

## Prispejte príkladom {#contribute-an-example}

Máte model, ktorý sa osvedčil vo výučbe? Zdieľajte odkaz naň v [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) a možno ho pridáme do galérie.
