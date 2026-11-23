---
description: "EduBeam overený učebnicovými vzorcami: nosníky, priehradová konštrukcia, zmena teploty, pokles podpery a rozdiel medzi Timošenkovým a Bernoulliho–Navierovým nosníkom."
source: site
---

# Ručné overenie výsledkov

Neverte číslu, ktoré neviete aspoň približne zopakovať. Na tejto stránke ručne vypočítame klasické učebnicové prípady a porovnáme ich s výsledkami aplikácie; [EduBeam]{.edubeam} sa s nimi zhoduje vo všetkých zobrazených čísliciach. Tabuľky uvádzajú päť platných číslic, rovnako ako karta *Výsledky* v aplikácii; popisy v obrázkoch sú zaokrúhlené na štyri platné číslice. Každý obrázok sa počíta naživo vo vašom prehliadači. Tlačidlo **Otvoriť v EduBeame** načíta rovnaký model do aplikácie, kde si prečítate tabuľky, zmeníte hodnotu a hneď uvidíte, čo sa stane.

::div{.chips}
- [Prostý nosník](#simply-supported-beam-uniform-load)
- [Konzola](#cantilever-tip-load)
- [Obojstranne votknutý nosník](#fixed–fixed-beam-uniform-load)
- [Jednostranne votknutý nosník](#propped-cantilever-uniform-load)
- [Dvojprútová sústava](#two-bar-truss)
- [Zmena teploty](#temperature-gradient-on-a-simply-supported-beam)
- [Pokles podpery](#prescribed-displacement)
- [Šmykové deformácie](#shear-deformation)
::

Celé konštrukcie vypočítané od začiatku do konca nájdete v návodoch [Trojkĺbový rám](/sk/tutorials/three-hinged-frame) a [Rovinná priehradová konštrukcia](/sk/tutorials/truss). Nové úlohy na ručný výpočet, pri ktorých sa výsledky kontrolujú hneď pri zadávaní, ponúka stránka [Precvičovanie](/sk/practice).

## Použitý prierez {#the-section-used-here}

Ak nie je uvedené inak, všetky prípady používajú oceľový nosník z príkladov v aplikácii: $E = 210$ GPa a $I_y = 8356$ cm⁴ (IPE 300), takže

$$
EI = 210 \times 10^9 \cdot 8{,}356 \times 10^{-5} = 17\,547{,}6\ \text{kNm}^2
$$

Jeho plocha ($A = 1$ m²) a šmykový súčiniteľ ($k = 10^{32}$) sú také veľké, že osové aj šmykové deformácie prakticky zmiznú, a výsledky preto presne zodpovedajú vzorcom pre Bernoulliho–Navierov nosník z vašej učebnice.

::callout{type="info" title="Nosníky v EduBeame sú Timošenkove"}
So skutočným prierezom, napríklad z knižnice prierezov, sa prvky deformujú aj šmykom. Priehyby potom vychádzajú o niečo väčšie, než dávajú vzorce pre Bernoulliho–Navierov nosník, a pri staticky neurčitých konštrukciách sa mierne posunú aj vnútorné sily. Aký veľký je tento vplyv a ako šmyk vypnúť, ukazuje časť [Šmykové deformácie](#shear-deformation) na konci stránky.
::

Na karte *Výsledky* sa posunutia a pootočenia vzťahujú ku [globálnym osiam](/sk/elements/conventions#global-axes): kladné D<sub>z</sub> smeruje nadol, kladné R<sub>y</sub> je proti smeru hodinových ručičiek a posunutia sú v metroch, ak jednotku nezmeníte v [Nastaveniach](/sk/essentials/units-settings).

## Prostý nosník s rovnomerným spojitým zaťažením {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, pevný kĺb v A a posuvný kĺb v B. Uzol C v strede rozpätia umožní odčítať priehyb; rozdelenie prvku uzlom nezmení žiadny výsledok.

::model-figure{caption="Prostý nosník, 12 kN/m"}
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

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Reakcie | $qL/2$ | 36 kN |
| Priečna sila pri podperách | $\pm qL/2$ | +36 kN v A, −36 kN v B |
| Moment v strede rozpätia | $qL^2/8$ | 54 kNm |
| Pootočenie v A | $qL^3/(24EI)$ | 0,0061547 rad, v smere hodinových ručičiek |
| Priehyb v C | $5qL^4/(384EI)$ | 11,540 mm, nadol |

EduBeam ukazuje rovnaké hodnoty. Na karte *Výsledky* má uzol A R<sub>y</sub> = −0,0061547 rad (záporné: v smere hodinových ručičiek) a uzol C D<sub>z</sub> = 0,01154 m (kladné: nadol).

## Konzola so silou na konci {#cantilever-tip-load}

$L = 4$ m, votknutie v A, sila $F = 18$ kN nadol na voľnom konci B.

::model-figure{caption="Konzola, 18 kN na konci"}
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

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Zvislá reakcia | $F$ | 18 kN |
| Moment vo votknutí | $FL$ | 72 kNm, záporný (ťah hore): M = −72 kNm |
| Pootočenie konca | $FL^2/(2EI)$ | 0,0082063 rad, v smere hodinových ručičiek |
| Priehyb konca | $FL^3/(3EI)$ | 21,883 mm, nadol |

Na karte *Výsledky* má uzol B R<sub>y</sub> = −0,0082063 rad a D<sub>z</sub> = 0,021883 m.

## Obojstranne votknutý nosník s rovnomerným spojitým zaťažením {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, oba konce votknuté. Nosník je staticky neurčitý, takže riešenie závisí od tuhosti; vzorce vyplývajú z podmienky spojitosti deformácie, podľa ktorej sú obe koncové pootočenia nulové.

::model-figure{caption="Obojstranne votknutý nosník, 12 kN/m"}
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

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Reakcie | $qL/2$ | 36 kN |
| Momenty vo votknutí | $qL^2/12$ | 36 kNm, záporné: M = −36 kNm |
| Moment v strede rozpätia | $qL^2/24$ | 18 kNm, kladný (ťah dole) |
| Priehyb v C | $qL^4/(384EI)$ | 2,3080 mm, nadol |

Votknutie koncov posunie celý priebeh momentu o $qL^2/12$ nahor: celkový rozdiel medzi podperou a stredom rozpätia je stále $qL^2/8 = 54$ kNm, rovnako ako pri prostom nosníku. Vyskúšajte si to v aplikácii: vyjdite z modelu prostého nosníka a zmeňte obe podpery na **Votknutie**.

## Jednostranne votknutý nosník s rovnomerným spojitým zaťažením {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m, votknutie v A a posuvný kĺb v B.

::model-figure{caption="Jednostranne votknutý nosník, 12 kN/m"}
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

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Reakcia vo votknutí | $5qL/8$ | 45 kN |
| Reakcia v posuvnom kĺbe | $3qL/8$ | 27 kN |
| Moment vo votknutí | $qL^2/8$ | 54 kNm, záporný: M = −54 kNm |
| Najväčší kladný moment | $9qL^2/128$ | 30,375 kNm |
| … v mieste, kde $V = 0$ | $x = 5L/8$ | 3,75 m od A |
| Pootočenie v B | $qL^3/(48EI)$ | 0,0030773 rad, proti smeru hodinových ručičiek |

EduBeam označí popisom každý extrém priebehu, takže kladné maximum je vyznačené priamo tam, kde nastáva. Jeho polohu zistíte z miesta, kde priečna sila prechádza nulou: $V(x) = 45 - 12x = 0$ dáva $x = 3{,}75$ m.

## Dvojprútová sústava {#two-bar-truss}

Dva prúty vychádzajú z pevných kĺbových podpier v A $(0, 0)$ a B $(4, 0)$ a stretávajú sa vo vrchole C $(2, -2)$, 2 m nad podperami. Oba prúty majú na oboch koncoch **koncové kĺby**, takže prenášajú iba normálovú silu. Vo vrchole C pôsobí zvislá sila $F = 20$ kN nadol.

::model-figure{caption="Dvojprútová sústava, 20 kN vo vrchole"}
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

Oba prúty zvierajú s vodorovnou osou uhol 45°. Z podmienky rovnováhy uzla C vo zvislom smere, v ktorom oba prúty vďaka symetrii prenášajú rovnakú silu, vyplýva:

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14{,}142\ \text{kN}
\end{aligned}
$$

Oba prúty sú **tlačené**. Každá podpera prenáša 10 kN zvisle a 10 kN vodorovne, pričom vodorovné reakcie smerujú dovnútra: prúty podpery od seba roztláčajú. To isté ukazujú priebeh **N (x)** aj reakcie.

## Nerovnomerné oteplenie prostého nosníka {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0{,}3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. Horný povrch sa zohreje o 5 K a dolný sa o 5 K ochladí, takže $\Delta T_d - \Delta T_h = -10$ K a strednica si teplotu zachová ($\Delta T_s = 0$). Prostý nosník sa môže voľne zakriviť, takže **nevznikajú žiadne vnútorné sily**, iba krivosť:

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_d - \Delta T_h)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0{,}3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

Horné vlákna sa predĺžia a dolné skrátia, takže sa nosník prehne **nahor**:

::model-figure{caption="Horný povrch o 10 K teplejší ako dolný: nosník sa prehne o 3,2 mm nahor, bez vnútorných síl"}
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

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Priehyb v C | $\kappa L^2/8$ | 3,2 mm, nahor: D<sub>z</sub> = −0,0032 m |
| Pootočenie v A | $\kappa L/2$ | 0,0016 rad, proti smeru hodinových ručičiek |
| Ohybový moment |  | 0 |

Rovnomerná zmena teploty $\Delta T_s$ by nosník iba predĺžila, čo posuvný kĺb dovolí: ani tá teda nevyvolá žiadne sily.

Teraz na oboch koncoch zabráňte pootočeniu (v A **Votknutie** a v B **Posuvné votknutie**, ktoré nosníku stále dovolí predĺžiť sa). Nosník sa už nemôže zakriviť a namiesto krivosti vznikne po celom rozpätí konštantný moment:

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547{,}6 \cdot (-4 \times 10^{-4}) = 7{,}019\ \text{kNm}
\end{aligned}
$$

Moment je kladný (ťah dole): horné vlákna sa chcú predĺžiť, ale nemôžu, a preto sú tlačené.

::model-figure{caption="Rovnaký nosník so zabráneným pootočením na oboch koncoch: konštantný moment 7,019 kNm"}
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

Teplotné zaťaženie zadáte podľa kapitoly [Zaťaženie](/sk/essentials/loads#temperature-load); výška $h$ je súčasťou [prierezu](/sk/essentials/elements#cross-sections).

## Pokles podpery {#prescribed-displacement}

Vezmite [jednostranne votknutý nosník](#propped-cantilever-uniform-load) bez zaťaženia a nechajte posuvný kĺb v B poklesnúť o $w = 10$ mm. V EduBeame je to **predpísané posunutie** D<sub>z</sub> = 0,01 m v B. Aby nosník pokles sledoval, musí posuvný kĺb stiahnuť koniec konzoly nadol, a tým nosník ohne:

::model-figure{caption="Jednostranne votknutý nosník, B poklesne o 10 mm: posuvný kĺb ťahá nadol silou 2,437 kN"}
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

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Sila v posuvnom kĺbe | $R = 3EIw/L^3$ | 2,4372 kN, ťahá nadol |
| Moment vo votknutí | $RL$ | 14,623 kNm, záporný: M = −14,623 kNm |
| Pootočenie v B | $3w/(2L)$ | 0,0025 rad, v smere hodinových ručičiek |

Na rozdiel od zaťaženia vyvolá pokles podpery sily iba tam, kde mu konštrukcia bráni: tu platí, že čím tuhší nosník, tým väčšie $R$. Prostý nosník by rovnaký pokles sledoval ako tuhé teleso, bez akýchkoľvek síl.

Vráťte späť zaťaženie 12 kN/m a výsledky sa sčítajú (superpozícia): votknutie teraz prenáša $45 + 2{,}4372 = 47{,}437$ kN a $54 + 14{,}623 = 68{,}623$ kNm a posuvný kĺb $27 - 2{,}4372 = 24{,}563$ kN. Ako zadať pokles podpery, opisuje kapitola [Zaťaženie](/sk/essentials/loads#prescribed-displacements-support-settlements).

## Šmykové deformácie {#shear-deformation}

Nosníkové prvky EduBeamu sú **Timošenkove** nosníky: okrem ohybového priehybu sa prehýbajú aj šmykom, a to o hodnotu danú šmykovou tuhosťou prierezu $kGA$. Čo to zmení, závisí od konštrukcie:

- **Staticky určité konštrukcie**: reakcie a vnútorné sily vyplývajú iba z podmienok rovnováhy, takže zostanú presne rovnaké. Zväčšia sa iba posunutia. Pri prostom nosníku a konzole zostanú rovnaké aj pootočenia prierezov; inde, napríklad na previslom konci, sa tiež trochu zmenia.
- **Staticky neurčité konštrukcie**: sily závisia od tuhosti, takže sa mierne posunú aj ony.

### Prostý nosník {#shear-simply-supported}

Veľkosť tohto vplyvu ukazuje nosník z [Rýchleho štartu](/sk/guide/quick-start#_8-check-by-hand). Je to prostý nosník z prvého príkladu so skutočným prierezom **IPE 200 (pribl.)** z knižnice prierezov: $I_y = 1943$ cm⁴, $A = 28{,}48$ cm² a šmykový súčiniteľ $k = 0{,}3933$ (podiel stojiny na ploche prierezu), s $G = 81$ GPa. Teda $EI = 4080{,}3$ kNm² a $kGA = 90\,720$ kN.

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Pootočenie konca | $qL^3/(24EI)$ | 0,026469 rad |
| Priehyb v strede rozpätia, ohyb | $5qL^4/(384EI)$ | 49,629 mm |
| Priehyb v strede rozpätia, šmyk | $qL^2/(8kGA)$ | 0,59524 mm |
| Priehyb v strede rozpätia, celkom | súčet | 50,224 mm, rovnako ako v EduBeame |

Šmyková časť tvorí 1,2 % celku. Pootočenie konca zodpovedá Bernoulliho–Navierovmu nosníku, rovnako ako reakcie a momenty.

### Konzola: krátke prúty {#shear-cantilever}

Pri konzole so silou $F$ na konci sa koniec prehne o $FL^3/(3EI)$ ohybom a o $FL/(kGA)$ šmykom. Ich pomer je

$$
\frac{\text{šmyk}}{\text{ohyb}} = \frac{3EI}{kGA\,L^2}
$$

Pre rovnaký IPE 200 je to 0,84 % pri konzole dĺžky 4 m, ale 13,5 % pri konzole dĺžky 1 m: šmykové deformácie sú dôležité pri krátkych a vysokých prútoch.

### Jednostranne votknutý nosník: sily sa posunú {#shear-propped-cantilever}

[Jednostranne votknutý nosník](#propped-cantilever-uniform-load) z profilu IPE 200 je staticky neurčitý a posuvný kĺb teraz prenesie o niečo viac. S $\beta = 3EI/(kGA\,L^2) = 0{,}0037481$ pre $L = 6$ m dáva podmienka spojitosti deformácie v posuvnom kĺbe

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27{,}034\ \text{kN}
$$

namiesto 27 kN a moment vo votknutí klesne z 54 na $qL^2/2 - R_B L = 53{,}798$ kNm. Tu je rozdiel malý, ale rastie s $\beta$, teda pri krátkych a vysokých prútoch.

### Porovnanie s Bernoulliho–Navierovým nosníkom {#shear-switch-off}

Ak chcete výsledky porovnať so vzorcami pre Bernoulliho–Navierov nosník, nastavte **Šmykový súčiniteľ** prierezu na veľmi veľkú hodnotu, napríklad `1e10`. Šmyková časť potom zmizne a všetky prípady na tejto stránke sa opäť zhodujú. Formuláciu prvku nájdete v [teoretickej príručke](/sk/elements/beam).

## Tipy na vlastnú kontrolu {#tips-for-your-own-checks}

- Majte stále na očiach **štítok jednotiek** vpravo dole v zobrazení; väčšina nezrovnalostí vzniká chybou v jednotkách.
- Presné hodnoty čítajte na karte **Výsledky** a v hodnotách pri kurzore, nie z popisov priebehov. Cez **Exportovať CSV** alebo **Kopírovať** získate aj reakcie, pripravené pre tabuľkový procesor. Pozrite si kapitolu [Výsledky a priebehy](/sk/essentials/results#results-tab).
- V Nastaveniach prepnite **Formát čísel** na *Automatický*, aby ste videli `40` namiesto `4 · 10¹`.
- Keď sa učíte deformačnú metódu, porovnajte v okne **Matica tuhosti** jeden prvok s [teoretickou príručkou](/sk/elements/beam).
- Overený model odovzdáte kolegovi alebo vyučujúcemu cez **Zdieľať konštrukciu**.
- Ak chcete skontrolovať mnoho prípadov naraz alebo generovať cvičenia so známymi výsledkami, spustite rovnaký riešič z kódu: [@edubeam/fem](/sk/solver) je knižnica, z ktorej pochádza každé číslo v aplikácii.
