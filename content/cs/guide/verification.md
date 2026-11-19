---
description: "EduBeam ověřený učebnicovými vzorci: nosníky, příhradová konstrukce, změna teploty, pokles podpory a rozdíl mezi Timošenkovým a Bernoulliho–Navierovým nosníkem."
source: site
---

# Ověření výsledků ručně

Nevěřte číslu, které nedokážete aspoň přibližně zopakovat. Na této stránce ručně spočítáme klasické učebnicové případy a porovnáme je s výsledky aplikace; [EduBeam]{.edubeam} se s nimi shoduje ve všech zobrazených číslicích. Tabulky uvádějí pět platných číslic, stejně jako záložka *Výsledky* v aplikaci; popisky v obrázcích jsou zaokrouhlené na čtyři platné číslice. Každý obrázek se počítá živě ve vašem prohlížeči. Tlačítko **Otevřít v EduBeamu** načte stejný model do aplikace, kde si přečtete tabulky, změníte hodnotu a hned uvidíte, co se stane.

::div{.chips}
- [Prostý nosník](#simply-supported-beam-uniform-load)
- [Konzola](#cantilever-tip-load)
- [Oboustranně vetknutý nosník](#fixed–fixed-beam-uniform-load)
- [Jednostranně vetknutý nosník](#propped-cantilever-uniform-load)
- [Dvouprutová soustava](#two-bar-truss)
- [Změna teploty](#temperature-gradient-on-a-simply-supported-beam)
- [Pokles podpory](#prescribed-displacement)
- [Smyková deformace](#shear-deformation)
::

Celé konstrukce spočítané od začátku do konce najdete v návodech [Trojkloubový rám](/cs/tutorials/three-hinged-frame) a [Rovinná příhradová konstrukce](/cs/tutorials/truss). Nové úlohy k ručnímu výpočtu, u kterých se výsledky kontrolují hned při zadávání, nabízí stránka [Procvičování](/cs/practice).

## Použitý průřez {#the-section-used-here}

Pokud není uvedeno jinak, používají všechny případy ocelový nosník z příkladů v aplikaci: $E = 210$ GPa a $I_y = 8356$ cm⁴ (IPE 300), takže

$$
EI = 210 \times 10^9 \cdot 8{,}356 \times 10^{-5} = 17\,547{,}6\ \text{kNm}^2
$$

Jeho plocha ($A = 1$ m²) a smykový součinitel ($k = 10^{32}$) jsou tak velké, že osová i smyková deformace prakticky zmizí, a výsledky proto přesně odpovídají vzorcům pro Bernoulliho–Navierův nosník z vaší učebnice.

::callout{type="info" title="Nosníky v EduBeamu jsou Timošenkovy"}
Se skutečným průřezem, například z knihovny průřezů, se prvky deformují i smykem. Průhyby pak vycházejí o něco větší, než dávají vzorce pro Bernoulliho–Navierův nosník, a u staticky neurčitých konstrukcí se mírně posunou i vnitřní síly. Kolik to dělá a jak smyk vypnout, ukazuje oddíl [Smyková deformace](#shear-deformation) na konci stránky.
::

V záložce *Výsledky* se posuny a pootočení vztahují ke [globálním osám](/cs/elements/conventions#global-axes): kladné D<sub>z</sub> míří dolů, kladné R<sub>y</sub> je proti směru hodinových ručiček a posuny jsou v metrech, pokud jednotku nezměníte v [Nastavení](/cs/essentials/units-settings).

## Prostý nosník se spojitým rovnoměrným zatížením {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, kloub v A a posuvný kloub v B. Uzel C uprostřed rozpětí umožní odečíst průhyb; rozdělení prvku uzlem žádný výsledek nezmění.

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
| Reakce | $qL/2$ | 36 kN |
| Posouvající síla u podpor | $\pm qL/2$ | +36 kN v A, −36 kN v B |
| Moment uprostřed rozpětí | $qL^2/8$ | 54 kNm |
| Pootočení v A | $qL^3/(24EI)$ | 0,0061547 rad, po směru hodinových ručiček |
| Průhyb v C | $5qL^4/(384EI)$ | 11,540 mm, dolů |

EduBeam ukazuje stejné hodnoty. V záložce *Výsledky* má uzel A R<sub>y</sub> = −0,0061547 rad (záporné: po směru hodinových ručiček) a uzel C D<sub>z</sub> = 0,01154 m (kladné: dolů).

## Konzola se silou na konci {#cantilever-tip-load}

$L = 4$ m, vetknutí v A, síla $F = 18$ kN dolů na volném konci B.

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
| Svislá reakce | $F$ | 18 kN |
| Moment ve vetknutí | $FL$ | 72 kNm, záporný (tah nahoře): M = −72 kNm |
| Pootočení konce | $FL^2/(2EI)$ | 0,0082063 rad, po směru hodinových ručiček |
| Průhyb konce | $FL^3/(3EI)$ | 21,883 mm, dolů |

V záložce *Výsledky* má uzel B R<sub>y</sub> = −0,0082063 rad a D<sub>z</sub> = 0,021883 m.

## Oboustranně vetknutý nosník se spojitým rovnoměrným zatížením {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, oba konce vetknuté. Nosník je staticky neurčitý, takže řešení závisí na tuhosti; vzorce plynou z podmínky spojitosti deformace, podle které jsou obě koncová pootočení nulová.

::model-figure{caption="Oboustranně vetknutý nosník, 12 kN/m"}
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
| Reakce | $qL/2$ | 36 kN |
| Momenty ve vetknutí | $qL^2/12$ | 36 kNm, záporné: M = −36 kNm |
| Moment uprostřed rozpětí | $qL^2/24$ | 18 kNm, kladný (tah dole) |
| Průhyb v C | $qL^4/(384EI)$ | 2,3080 mm, dolů |

Vetknutí konců posune celý průběh momentu o $qL^2/12$ nahoru: celkový rozdíl mezi podporou a středem rozpětí je stále $qL^2/8 = 54$ kNm, stejně jako u prostého nosníku. Vyzkoušejte si to v aplikaci: vyjděte z modelu prostého nosníku a změňte obě podpory na **Vetknutí**.

## Jednostranně vetknutý nosník se spojitým rovnoměrným zatížením {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m, vetknutí v A a posuvný kloub v B.

::model-figure{caption="Jednostranně vetknutý nosník, 12 kN/m"}
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
| Reakce ve vetknutí | $5qL/8$ | 45 kN |
| Reakce v posuvném kloubu | $3qL/8$ | 27 kN |
| Moment ve vetknutí | $qL^2/8$ | 54 kNm, záporný: M = −54 kNm |
| Největší kladný moment | $9qL^2/128$ | 30,375 kNm |
| … v místě, kde $V = 0$ | $x = 5L/8$ | 3,75 m od A |
| Pootočení v B | $qL^3/(48EI)$ | 0,0030773 rad, proti směru hodinových ručiček |

EduBeam opatří popiskem každý extrém průběhu, takže kladné maximum je vyznačené přímo tam, kde nastává. Jeho polohu zjistíte z místa, kde posouvající síla prochází nulou: $V(x) = 45 - 12x = 0$ dává $x = 3{,}75$ m.

## Dvouprutová soustava {#two-bar-truss}

Dva pruty vycházejí z kloubových podpor v A $(0, 0)$ a B $(4, 0)$ a stýkají se ve vrcholu C $(2, -2)$, 2 m nad podporami. Oba pruty mají na obou koncích **koncové klouby**, takže přenášejí jen normálovou sílu. Ve vrcholu C působí svislá síla $F = 20$ kN dolů.

::model-figure{caption="Dvouprutová soustava, 20 kN ve vrcholu"}
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

Oba pruty svírají s vodorovnou úhel 45°. Ze svislé podmínky rovnováhy styčníku C, kde oba pruty díky symetrii přenášejí stejnou sílu, plyne:

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14{,}142\ \text{kN}
\end{aligned}
$$

Oba pruty jsou **tlačené**. Každá podpora přenáší 10 kN svisle a 10 kN vodorovně, přičemž vodorovné reakce míří dovnitř: pruty podpory od sebe roztlačují. Totéž ukazuje průběh **N (x)** i reakce.

## Nerovnoměrné oteplení prostého nosníku {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0{,}3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. Horní povrch se ohřeje o 5 K a dolní se o 5 K ochladí, takže $\Delta T_d - \Delta T_h = -10$ K a střednice si teplotu zachová ($\Delta T_s = 0$). Prostý nosník se může volně zakřivit, takže **nevznikají žádné vnitřní síly**, jen křivost:

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_d - \Delta T_h)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0{,}3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

Horní vlákna se prodlouží a dolní zkrátí, takže se nosník prohne **nahoru**:

::model-figure{caption="Horní povrch o 10 K teplejší než dolní: nosník se prohne o 3,2 mm nahoru, bez vnitřních sil"}
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
| Průhyb v C | $\kappa L^2/8$ | 3,2 mm, nahoru: D<sub>z</sub> = −0,0032 m |
| Pootočení v A | $\kappa L/2$ | 0,0016 rad, proti směru hodinových ručiček |
| Ohybový moment |  | 0 |

Rovnoměrná změna teploty $\Delta T_s$ by nosník jen prodloužila, což posuvný kloub dovolí: ani ta tedy žádné síly nevyvolá.

Teď na obou koncích zabraňte pootočení (v A **Vetknutí** a v B **Posuvné vetknutí**, které nosníku stále dovolí se prodloužit). Nosník se už nemůže zakřivit a místo křivosti vznikne po celém rozpětí konstantní moment:

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547{,}6 \cdot (-4 \times 10^{-4}) = 7{,}019\ \text{kNm}
\end{aligned}
$$

Moment je kladný (tah dole): horní vlákna se chtějí prodloužit, ale nemohou, a proto jsou tlačená.

::model-figure{caption="Stejný nosník se zabráněným pootočením na obou koncích: konstantní moment 7,019 kNm"}
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

Zatížení teplotou zadáte podle kapitoly [Zatížení](/cs/essentials/loads#temperature-load); výška $h$ je součástí [průřezu](/cs/essentials/elements#cross-sections).

## Pokles podpory {#prescribed-displacement}

Vezměte [jednostranně vetknutý nosník](#propped-cantilever-uniform-load) bez zatížení a nechte posuvný kloub v B poklesnout o $w = 10$ mm. V EduBeamu je to **předepsané posunutí** D<sub>z</sub> = 0,01 m v B. Aby nosník pokles sledoval, musí posuvný kloub stáhnout konec konzoly dolů, a tím nosník ohne:

::model-figure{caption="Jednostranně vetknutý nosník, B poklesne o 10 mm: posuvný kloub táhne dolů silou 2,437 kN"}
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
| Síla v posuvném kloubu | $R = 3EIw/L^3$ | 2,4372 kN, táhne dolů |
| Moment ve vetknutí | $RL$ | 14,623 kNm, záporný: M = −14,623 kNm |
| Pootočení v B | $3w/(2L)$ | 0,0025 rad, po směru hodinových ručiček |

Na rozdíl od zatížení vyvolá pokles podpory síly jen tam, kde se mu konstrukce brání: tady platí, že čím tužší nosník, tím větší $R$. Prostý nosník by stejný pokles sledoval jako tuhé těleso, bez jakýchkoli sil.

Vraťte zpět zatížení 12 kN/m a výsledky se sečtou (superpozice): vetknutí teď přenáší $45 + 2{,}4372 = 47{,}437$ kN a $54 + 14{,}623 = 68{,}623$ kNm a posuvný kloub $27 - 2{,}4372 = 24{,}563$ kN. Jak pokles podpory zadat, popisuje kapitola [Zatížení](/cs/essentials/loads#prescribed-displacements-support-settlements).

## Smyková deformace {#shear-deformation}

Nosníkové prvky EduBeamu jsou **Timošenkovy** nosníky: kromě ohybového průhybu se prohýbají i smykem, a to o hodnotu danou smykovou tuhostí průřezu $kGA$. Co to změní, záleží na konstrukci:

- **Staticky určité konstrukce**: reakce a vnitřní síly plynou jen z podmínek rovnováhy, takže zůstanou přesně stejné. Zvětší se jen posuny. U prostého nosníku a konzoly zůstanou stejná i pootočení průřezů; jinde, například na převislém konci, se také trochu změní.
- **Staticky neurčité konstrukce**: síly závisí na tuhosti, takže se mírně posunou i ony.

### Prostý nosník {#shear-simply-supported}

Kolik to dělá, ukazuje nosník z [Rychlého startu](/cs/guide/quick-start#_8-check-by-hand). Je to prostý nosník z prvního příkladu se skutečným průřezem **IPE 200 (approx)** z knihovny průřezů: $I_y = 1943$ cm⁴, $A = 28{,}48$ cm² a smykový součinitel $k = 0{,}3933$ (podíl stojiny na ploše průřezu), s $G = 81$ GPa. Tedy $EI = 4080{,}3$ kNm² a $kGA = 90\,720$ kN.

| Veličina | Vzorec | Hodnota |
| --- | --- | --- |
| Pootočení konce | $qL^3/(24EI)$ | 0,026469 rad |
| Průhyb uprostřed rozpětí, ohyb | $5qL^4/(384EI)$ | 49,629 mm |
| Průhyb uprostřed rozpětí, smyk | $qL^2/(8kGA)$ | 0,59524 mm |
| Průhyb uprostřed rozpětí, celkem | součet | 50,224 mm, stejně jako v EduBeamu |

Smyková část tvoří 1,2 % celku. Pootočení konce odpovídá Bernoulliho–Navierovu nosníku, stejně jako reakce a momenty.

### Konzola: krátké pruty {#shear-cantilever}

U konzoly se silou $F$ na konci se konec prohne o $FL^3/(3EI)$ ohybem a o $FL/(kGA)$ smykem. Jejich poměr je

$$
\frac{\text{smyk}}{\text{ohyb}} = \frac{3EI}{kGA\,L^2}
$$

Pro stejný IPE 200 to je 0,84 % u konzoly délky 4 m, ale 13,5 % u konzoly délky 1 m: smyková deformace je důležitá u krátkých a vysokých prutů.

### Jednostranně vetknutý nosník: síly se posunou {#shear-propped-cantilever}

[Jednostranně vetknutý nosník](#propped-cantilever-uniform-load) z profilu IPE 200 je staticky neurčitý a posuvný kloub teď přenese o něco víc. S $\beta = 3EI/(kGA\,L^2) = 0{,}0037481$ pro $L = 6$ m dává podmínka spojitosti deformace v posuvném kloubu

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27{,}034\ \text{kN}
$$

místo 27 kN a moment ve vetknutí klesne z 54 na $qL^2/2 - R_B L = 53{,}798$ kNm. Tady je rozdíl malý, ale roste s $\beta$, tedy u krátkých a vysokých prutů.

### Porovnání s Bernoulliho–Navierovým nosníkem {#shear-switch-off}

Chcete-li výsledky porovnat se vzorci pro Bernoulliho–Navierův nosník, nastavte **Smykový součinitel** průřezu na velmi velkou hodnotu, například `1e10`. Smyková část pak zmizí a všechny případy na této stránce opět souhlasí. Formulaci prvku najdete v [teoretickém manuálu](/cs/elements/beam).

## Tipy pro vlastní kontrolu {#tips-for-your-own-checks}

- Mějte stále na očích **štítek jednotek** vpravo dole v zobrazení; většina nesrovnalostí vzniká chybou v jednotkách.
- Přesné hodnoty čtěte v záložce **Výsledky** a v popiscích po najetí myší, ne z popisků průběhů. Přes **Exportovat CSV** nebo **Kopírovat** získáte i reakce, připravené pro tabulkový procesor. Viz [Výsledky a průběhy](/cs/essentials/results#results-tab).
- V Nastavení přepněte **Formát čísel** na *Automatický*, abyste viděli `40` místo `4 · 10¹`.
- Když se učíte deformační metodu, porovnejte v okně **Matice tuhosti** jeden prvek s [teoretickým manuálem](/cs/elements/beam).
- Ověřený model předáte kolegovi nebo vyučujícímu přes **Sdílet konstrukci**.
- Chcete-li zkontrolovat mnoho případů najednou nebo generovat cvičení se známými výsledky, spusťte stejný řešič z kódu: [@edubeam/fem](/cs/solver) je knihovna, ze které pochází každé číslo v aplikaci.
