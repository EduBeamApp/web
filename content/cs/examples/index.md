---
description: "Šest vyřešených nosníků, rámů a příhradových konstrukcí, které otevřete v EduBeamu jedním kliknutím, s náměty na cvičení a výsledky pro kontrolu ručního výpočtu."
source: site
---

# Příklady

Každá dlaždice níže je živý, vyřešený model. Po kliknutí se otevře v aplikaci [EduBeam]{.edubeam}, připravený k úpravám: přetáhněte uzel, změňte zatížení nebo zaškrtněte kloub a sledujte, jak se průběhy změní. Náměty na cvičení níže udělají z každého modelu krátkou úlohu, i s výsledky, se kterými porovnáte svůj ruční výpočet.

::feature-structures
::

Tytéž modely najdete v aplikaci pod **☰ → Příklady** a odkaz [run.edubeam.app/?panel=examples&lang=cs](https://run.edubeam.app/?panel=examples&lang=cs){target="_blank"} otevře galerii přímo.

::callout{type="info" title="Stejné prvky ve všech šesti příkladech"}
Všechny příklady používají stejné ocelové prvky: $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (takže $EI = 17\,548$ kNm²), plochu $1\ \text{m}^2$ a tak velkou smykovou tuhost, že osová i smyková deformace jsou zanedbatelné. Učebnicové vzorce pro štíhlé nosníky se proto s výsledky aplikace shodují ve všech zobrazených číslicích. Výška průřezu je $1$ m, na čemž záleží jen u teplotního zatížení.
::

## Náměty na cvičení {#suggested-exercises}

Nejdřív výsledek spočítejte ručně a pak ho ověřte v aplikaci: model otevřete z jeho dlaždice nahoře nebo tlačítkem **Otevřít v EduBeamu** pod jeho obrázkem. Otevřený model nahradí ten, který máte rozpracovaný; zkratka <kbd>Ctrl</kbd>+<kbd>Z</kbd> vám ho vrátí a najdete ho i v **☰ → Nedávné konstrukce**.

### Staticky neurčitý nosník {#exercise-indeterminate-beam}

Nosník délky 3 m, vetknutý v A a uložený na posuvném kloubu v B, se zatížením 10 kN/m.

::model-figure{caption="Vetknutí v A, posuvný kloub v B, 10 kN/m"}
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

1. Ručně určete reakce a moment ve vetknutí, silovou metodou nebo pomocí tabulek primárních momentů.
2. Zrušte zaškrtnutí `Ry` v A a nosník bude prostě uložený. Jak se změní největší moment?
3. Znovu zaškrtněte `Ry` v A a zaškrtněte ho i v B: nosník bude oboustranně vetknutý.

**Všimněte si,** kde průběh momentu mění znaménko a jak vetknutí přenáší větší část zatížení než posuvný kloub.

::callout{type="details" title="Řešení"}
- Jednostranně vetknutý nosník: $R_A = 5qL/8 = 18{,}75$ kN, $R_B = 3qL/8 = 11{,}25$ kN, $M_A = qL^2/8 = 11{,}25$ kNm (záporný moment). Největší kladný moment je $9qL^2/128 = 6{,}33$ kNm ve vzdálenosti 1,125 m od B, kde je posouvající síla nulová.
- Prostý nosník: $qL^2/8 = 11{,}25$ kNm uprostřed rozpětí, tedy stejná hodnota, jakou předtím přenášelo vetknutí.
- Oboustranně vetknutý nosník: záporný moment $qL^2/12 = 7{,}5$ kNm na koncích, kladný moment $qL^2/24 = 3{,}75$ kNm uprostřed rozpětí.
::

### Konzola {#exercise-cantilever}

Konzola délky 4 m, vetknutá v A, se silou 18 kN dolů na volném konci B.

::model-figure{caption="Konzola, 18 kN na volném konci"}
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

1. Určete moment ve vetknutí, průhyb a pootočení volného konce. Porovnejte je s hodnotami uzlu B na záložce **Výsledky → Výsledky v uzlech**.
2. V záložce **Průřezy** zmenšete $I_y$ na polovinu. Co se změní a co ne?
3. Nahraďte osamělou sílu spojitým rovnoměrným zatížením 4,5 kN/m, tedy stejnými 18 kN celkem: v záložce **Zatížení** smažte uzlové zatížení a pak použijte **Přidat prvkové zatížení**.

**Všimněte si** tvaru průběhu momentů: od osamělé síly je to přímka, od spojitého zatížení parabola.

::callout{type="details" title="Řešení"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21{,}88$ mm, $\varphi_B = FL^2/(2EI) = 8{,}21$ mrad.
- Poloviční $I_y$ zdvojnásobí průhyb na 43,77 mm. Moment zůstane 72 kNm: konzola je staticky určitá, takže její vnitřní síly na tuhosti nezávisejí.
- Spojité zatížení: $M_A = qL^2/2 = 36$ kNm a $w_B = qL^4/(8EI) = 8{,}21$ mm. Stejné celkové zatížení dá poloviční moment a tři osminy průhybu.
::

### Warrenův příhradový nosník {#exercise-pratt-truss}

Příhradový nosník o rozpětí 9 m a výšce 1,8 m se silou 8 kN v každém ze tří horních styčníků E, F a G. Normálové síly zobrazíte zaškrtnutím **N(x)** v možnostech zobrazení. (Se střídavě skloněnými diagonálami a bez svislic jde o uspořádání, kterému většina učebnic říká Warrenův nosník.)

::model-figure{caption="Styčníky A až G, 8 kN v E, F a G"}
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

1. Určete reakce a pak metodou styčných bodů síly v krajní diagonále A–E a v dolním pásu A–B.
2. Průsečnou metodou určete sílu v horním pásu v prostředním poli a sílu v dolním pásu B–C.
3. Styčníky jsou v tomto modelu tuhé. V záložce **Prvky** zaškrtněte u každého prutu oba koncové klouby, aby vznikla příhradová konstrukce s kloubovými styčníky, a porovnejte normálové síly.
4. Smažte diagonálu B–F, nejdřív s tuhými styčníky, pak s klouby. Udrží se konstrukce?

**Všimněte si** rozložení znamének: horní pás je tlačený, dolní tažený a znaménka diagonál se střídají.

::callout{type="details" title="Řešení"}
- Reakce: 12 kN v A i v D.
- Krajní diagonály: tlak 15,62 kN. Dolní pás A–B a C–D: tah 10,00 kN.
- Horní pás E–F a F–G: tlak 13,33 kN (momentová podmínka k B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$). Dolní pás B–C: tah 16,67 kN (momentová podmínka k F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$). Vnitřní diagonály: 5,21 kN, tah v diagonálách vedoucích z E a G dolů k dolnímu pásu, tlak v diagonálách vedoucích nahoru k F.
- Tuhé i kloubové styčníky dávají stejné normálové síly s odchylkou do 0,1 %. Ohyb v příhradové konstrukci složené z trojúhelníků je zanedbatelný, a proto model s kloubovými styčníky funguje.
- Bez B–F se konstrukce s tuhými styčníky udrží díky rámovému působení, s ohybovými momenty kolem 3 kNm. S klouby jí jeden prut chybí: stane se z ní mechanismus a EduBeam ukáže, jak se může pohybovat.
::

### Spojitý nosník o třech polích {#exercise-three-span-continuous-beam}

Nosník délky 16 m s poli 5 + 6 + 5 m: 8 kN/m v prvním poli, 20 kN v C a 6 kN/m v posledním poli. Po otevření je podepřený jen v A a D.

::model-figure{caption="Po otevření: podepřený jen v A a D"}
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

1. Po otevření jde o jeden prostý nosník délky 16 m. Určete reakce a momenty v B a C.
2. Zaškrtnutím `Dz` v B a v C z něj uděláte spojitý nosník o čtyřech podporách.
3. Momenty nad B a C určete z rovnice tří momentů (Clapeyronovy rovnice) a pak dopočítejte reakce.

**Všimněte si** záporných momentů, které se objeví nad vnitřními podporami, o kolik menší jsou všechny momenty a co se stane se silou 20 kN, jakmile je v C podpora.

::callout{type="details" title="Řešení"}
- Prostý nosník: $R_A = 44{,}69$ kN, $R_D = 45{,}31$ kN, $M_B = 123{,}4$ kNm a $M_C = 151{,}6$ kNm, oba kladné.
- Spojitý nosník, s $M_A = M_D = 0$:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  Z toho $M_B = -9{,}766$ kNm a $M_C = -5{,}859$ kNm, oba záporné. Síla 20 kN v C jde přímo do podpory a nic neohýbá.
- Reakce: A 18,05 kN, B 22,60 kN, C 35,52 kN (včetně 20 kN), D 13,83 kN. Jejich součet je 90 kN, tedy celé zatížení.

::model-figure{caption="Spojitý nosník o čtyřech podporách"}
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

### Rámová konstrukce {#exercise-portal-frame}

Rám s příčlí délky 8 m na dvou sloupech výšky 6 m, vetknutý v A a uložený na posuvném kloubu v D. Příčel nese 10 kN/m a horní roh C zatěžuje síla 8 kN doleva a 10 kN dolů.

::model-figure{caption="Vetknutí v A, posuvný kloub v D: 10 kN/m na příčli, 8 kN a 10 kN v C"}
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

1. Kolikrát je rám staticky neurčitý?
2. Zrušte zaškrtnutí `Ry` v A, aby z vetknutí byl kloub. Rám je teď staticky určitý: ručně určete reakce a momenty v rozích B a C.
3. Znovu zaškrtněte `Ry` v A a pak zaškrtněte `Dx` v D, aby z posuvného kloubu byl pevný kloub. V deformovaném tvaru sledujte vodorovný posun příčle.

**Všimněte si,** kterým směrem se horní část rámu posune. U rámu v původní podobě se posune doprava, proti síle 8 kN. Proč?

::callout{type="details" title="Řešení"}
- Čtyři složky reakcí (tři ve vetknutí, jedna v posuvném kloubu) a tři podmínky rovnováhy: rám je jednou staticky neurčitý. S pevným kloubem i v D dvakrát.
- Kloub v A: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN doprava. Moment v rohu B je $8 \cdot 6 = 48$ kNm. V C je nulový: bez vodorovné reakce v D přenáší pravý sloup jen normálovou sílu 44 kN.
- V původní podobě se horní část rámu posune o 9,5 mm doprava: moment od zatížené příčle ohýbá vetknutý sloup víc než síla 8 kN. S pevným kloubem v D přenese podpora D vodorovně 4,9 kN a horní část se posune o 4,8 mm doleva.
::

### Teplotní zatížení {#exercise-temperature-load}

Prostý nosník délky 8 m, jehož střednice se ohřeje o $\Delta T_s = 20$ K a jehož dolní vlákna jsou o 10 K chladnější než horní ($\Delta T_d - \Delta T_h = -10$ K).

::model-figure{caption="Prostý nosník délky 8 m ohřátý o 20 K, dolní vlákna o 10 K chladnější než horní"}
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

1. Než se podíváte: jaké vnitřní síly teplota vyvolá a jak se nosník přetvoří?
2. Zaškrtněte `Dx` v B, aby se nosník nemohl prodloužit.
3. Zaškrtněte navíc `Ry` na obou koncích.

**Všimněte si** deformovaného tvaru a hodnot na záložce **Výsledky → Výsledky v uzlech**: nosník se přetváří bez jakýchkoli vnitřních sil, dokud mu v tom podpory nebrání.

::callout{type="details" title="Řešení"}
- Staticky určitý nosník se může volně prodloužit i prohnout, takže žádné vnitřní síly nevzniknou. Bod B se posune ven o $\alpha \Delta T_s L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1{,}92$ mm. Chladnější dolní vlákna se zkrátí, takže se nosník vyklene nahoru s křivostí $\kappa = \alpha (\Delta T_d - \Delta T_h)/h = -1{,}2 \cdot 10^{-4}$ 1/m: konce se pootočí o $\kappa L/2 = 0{,}48$ mrad a střed rozpětí se zvedne o $\kappa L^2/8 = 0{,}96$ mm.
- S oběma konci drženými ve směru x: $N = -EA\alpha\Delta T_s = -50\,400$ kN, tlak. Tak velká síla vychází z modelové plochy 1 m²; IPE 200 s plochou 28,48 cm² by přenášel 143,5 kN.
- S oběma konci vetknutými: konstantní moment $EI\alpha(\Delta T_d - \Delta T_h)/h = 2{,}11$ kNm po celé délce nosníku.
::

## Řešené návody {#worked-tutorials}

Větší modely, sestavené krok za krokem a ověřené ručním výpočtem:

::card-grid{cols="2"}
:::card{title="Šikmý nosník" icon="lucide:move-diagonal" to="/cs/tutorials/inclined-beam"}
Krokev zatížená sněhem: zatížení na metr půdorysu, normálové a posouvající síly podél sklonu a natočený posuvný kloub.
:::
:::card{title="Trojkloubový rám" icon="lucide:triangle" to="/cs/tutorials/three-hinged-frame"}
Reakce, N, V a M rámu s vnitřním kloubem.
:::
:::card{title="Rovinná příhradová konstrukce" icon="lucide:git-fork" to="/cs/tutorials/truss"}
Metoda styčných bodů, průsečná metoda, nulový prut a průhyb principem virtuálních prací.
:::
:::card{title="Spojitý nosník a pokles podpory" icon="lucide:spline" to="/cs/tutorials/continuous-beam"}
Nosník o dvou polích řešený silovou metodou, pak s poklesem střední podpory o 10 mm.
:::
::

Další kontroly v uzavřeném tvaru najdete v kapitole [Ověření výsledků ručně](/cs/guide/verification).

## Další úlohy {#more-problems}

[Procvičování](/cs/practice) vám kdykoli připraví nový nosník, rám nebo příhradovou konstrukci s novými čísly a hned zkontroluje vaše reakce a největší moment nebo sílu v prutu. Pro celou třídu vytiskne [Generátor písemek](/cs/exam) každému studentovi jinou variantu písemky i s klíčem řešení a knihovna [@edubeam/plot](/cs/guide/teaching#exercise-sheets-tests-and-slides-from-code) vytváří zadání cvičení přímo z kódu.

## Přispějte příkladem {#contribute-an-example}

Máte model, který se osvědčil ve výuce? Sdílejte odkaz na něj v [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) a možná ho přidáme do galerie.
