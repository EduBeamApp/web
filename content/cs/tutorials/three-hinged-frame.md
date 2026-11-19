---
description: "Návod: trojkloubový rám se spojitým zatížením v EduBeamu. Reakce, rozpěr a vnitřní síly ověříte ručně, včetně průhybu kloubu. Asi 15 minut."
source: site
---

# Návod: trojkloubový rám

Vymodelujete rám s kloubem uprostřed rozpětí příčle, odečtete jeho reakce a průběhy vnitřních sil a každé číslo ověříte ručně, až po průhyb kloubu.

- **Čas:** asi 15 minut.
- **Potřebujete:** EduBeam otevřený na druhé kartě prohlížeče, na počítači s myší a klávesnicí. Pokud jste s EduBeamem ještě nepracovali, začněte [Rychlým startem](/cs/guide/quick-start) nebo návodem [Šikmý nosník](/cs/tutorials/inclined-beam).
- **Předpoklady:** rovnováha rámu a metoda uvolňování. Nepovinná kontrola průhybu používá metodu jednotkové síly (princip virtuálních prací).
- **Jednotky:** SI. Štítek jednotek vpravo dole v zobrazení má ukazovat `m m² kN kNm MPa`. Pokud ukazuje stopy a kipy, klikněte na něj a v poli **Soustava jednotek** zvolte **SI (metrická)**.

**Naučíte se**

- nakreslit rám myší jako jednu lomenou čáru,
- vložit kloub do prutu pomocí políček **Koncové klouby**,
- určit vodorovnou reakci (rozpěr) z podmínky $M = 0$ v kloubu a správně číst znaménko $V$ v prutech nakreslených různými směry.

::div{.actions}
[Otevřít EduBeam ↗](https://run.edubeam.app/?lang=cs){target="_blank"} [Přejít na ruční kontrolu](#_6-check-by-hand)
::

::model-figure{caption="Hotový rám: 10 kN/m na příčli, pevné klouby v uzlech 1 a 5, kloub v uzlu 3"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Zadání {#the-problem}

- Dva sloupy výšky 4 m s kloubovými patkami v uzlech 1 a 5, vzdálené od sebe 8 m.
- Nahoře vodorovná příčel z uzlu 2 do uzlu 4 s kloubem uprostřed rozpětí, v uzlu 3.
- Spojité rovnoměrné zatížení $q = 10$ kN/m po celé příčli.
- Ocel, $E = 210$ GPa, a $I_y = 8{,}356 \times 10^{-5}$ m⁴ (IPE 300) u všech prutů.

| Uzel | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | pevný kloub |
| 2 | 0 | −4 | roh |
| 3 | 4 | −4 | kloub v příčli |
| 4 | 8 | −4 | roh |
| 5 | 8 | 0 | pevný kloub |

Osa z míří **dolů**, takže hlavy sloupů leží v $z = -4$.

**Je konstrukce staticky určitá?** Dva pevné klouby dávají čtyři složky reakcí. Tři podmínky rovnováhy a podmínka $M_3 = 0$ v kloubu dávají čtyři rovnice: ano, je.

## Sestavte model {#model-it}

::div{.steps}

### Materiál a průřez {#_1-material-and-section}

1. V horní liště aplikace klikněte na **Smazat konstrukci**, zaškrtněte **Smazat materiály** a **Smazat průřezy** a klikněte na **Potvrdit**. Uzly a prvky se pak znovu číslují od 1.
2. Záložka **Materiály** → **Knihovna materiálů** → **+** v řádku **Ocel (S235)**; knihovnu pak zavřete tlačítkem **Zrušit**.
3. Záložka **Průřezy** → **Přidat průřez**. Do pole **Iy** napište `8.356e-5`, pole **Plocha**, **Výška** a **Smykový součinitel** ponechte na hodnotě `1` a klikněte na **Přidat průřez**.

Plocha 1 m² zajistí, že se pruty znatelně nezkrátí ani smykově nepřetvoří, což předpokládá i ruční výpočet průhybu. Vnitřní síly staticky určitého rámu na $E$, $A$ ani $I_y$ vůbec nezávisejí.

### Nakreslete rám {#_2-draw-the-frame}

1. Záložka **Prvky** → druhé tlačítko **Přidat prvek**, to s ikonou kurzoru.
2. Klikněte postupně do bodů (0, 0), (0, −4), (4, −4), (8, −4) a (8, 0). Každé kliknutí přidá další uzel a spojí ho s předchozím; kliknutí se přichytávají k mřížce.
3. Klávesou <kbd>Esc</kbd> kreslení ukončíte a klávesou <kbd>F</kbd> zobrazíte celý model.

Teď máte uzly 1 až 5 a prvky 1 až 4, očíslované v pořadí, v jakém jste je kreslili, stejně jako na obrázcích v tomto návodu. Porovnejte tabulku **Uzly** s tabulkou výše a souřadnice, které nesedí, přepište.

### Podpory a kloub {#_3-supports-and-the-hinge}

1. Klikněte na uzel 1 → **Podepření uzlu** → symbol **Kloub**. Totéž udělejte u uzlu 5.
2. V tabulce **Prvky** najděte prvek 2, z uzlu 2 do uzlu 3, a zaškrtněte druhé z jeho políček **Koncové klouby**: kloub na jeho konci, v uzlu 3.

![Tabulka Prvky: prvek 2 má zaškrtnutý kloub na konci, v uzlu 3](/screenshots/cs/p2t-frame-elements-table.webp)

Jeden kloub stačí. Prvek 3 je pak jediný prut tuze připojený k uzlu 3, takže do něj v tomto místě žádný moment přejít nemůže. Když zaškrtnete i kloub na začátku prvku 3, nic se nezmění.

### Zatížení {#_4-load}

1. Záložka **Zatížení** → **Přidat prvkové zatížení**.
2. **Typ zatížení** *Spojité rovnoměrné zatížení*, **Prvek** `2`, `fz = 10`. Klikněte na **Přidat prvkové zatížení**.
3. Totéž zopakujte pro prvek 3.

Kladné `fz` míří dolů. Příčel je vodorovná, takže na políčku **LCS** tu nezáleží.

::

## Výsledky {#_5-results}

V možnostech zobrazení vpravo nahoře v okně konstrukce (ozubeným kolem je zobrazíte a skryjete) jsou od začátku zapnuté **Deformovaný tvar**, **M<sub>y</sub> (x)** a **Reakce**. Zbylé průběhy přidáte zaškrtnutím **N (x)** a **V<sub>z</sub> (x)**; některé můžete naopak vypnout a prohlížet si průběhy po jednom. EduBeam je popisuje v kN a kNm na dvě desetinná místa.

- U každé patky uvidíte `40,00` směrem nahoru a `20,00` směrem dovnitř.
- Ohybový moment má v obou rozích popisek `-80,00`; v kloubu, kde je nulový, popisek nemá. EduBeam ho vykresluje na tažené straně, tady vně rámu.
- Normálová síla je všude záporná: `-40,00` ve sloupech, `-20,00` v příčli. Všechny čtyři pruty jsou tlačené.
- Záložka **Výsledky** → **Výsledky v uzlech**: kloub, uzel 3, se posune dolů o $D_z$ = `4,2554 · 10⁻² m`, tedy o 42,55 mm. Stejnou hodnotu v kloubu ukazuje pohled $w(x)$ na obrázku nahoře.

## Kontrola ručním výpočtem {#_6-check-by-hand}

**Svislé reakce.** Ze symetrie připadá na každou patku polovina z 80 kN:

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Vodorovné reakce.** Rozdělte rám v kloubu a pro levou polovinu napište momentovou podmínku k uzlu 3, kde je moment nulový:

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

Obě patky tlačí dovnitř silou 20 kN. Tento rozpěr vzniká jen díky pevným kloubům, které se nemohou rozjet. Bez něj by rám nestál: sloupy by se rozevřely a kloub by se propadl.

| Veličina | Vzorec | Ručně | EduBeam |
| --- | --- | --- | --- |
| Svislé reakce | $q \cdot 8/2$ | 40 kN | 40,00 |
| Vodorovné reakce | z $M_3 = 0$ | 20 kN | 20,00 |
| Momenty v rozích, uzly 2 a 4 | $H_1 \cdot 4$ | 80 kNm, tah vně | −80,00 |
| Moment v kloubu, uzel 3 | | 0 | bez popisku |
| $N$ ve sloupech | $-V_1$ | −40 kN | −40,00 |
| $N$ v příčli | $-H_1$ | −20 kN | −20,00 |
| $V$ ve sloupech | $\pm H_1$ | ±20 kN | −20,00; 20,00 |
| $V$ v příčli v uzlech 2, 3, 4 | $V_1 - q\,x$ | 40; 0; −40 kN | 40,00; bez popisku; −40,00 |

Oba sloupy přenášejí stejnou posouvající sílu s opačným znaménkem, −20 kN v prvku 1 a +20 kN v prvku 4, protože lokální osy každého prvku sledují směr, ve kterém byl nakreslen: prvek 1 nahoru, prvek 4 dolů. Prohoďte uzly jednoho sloupu a jeho znaménko se obrátí. Proč tomu tak je, vysvětluje [znaménková konvence](/cs/elements/conventions#internal-forces).

V příčli platí $M(x) = -80 + 40x - 5x^2$ kNm, kde $x$ měříte od uzlu 2. Moment je v kloubu nulový a nikde není kladný: celá příčel je namáhaná záporným momentem (tah nahoře). Posouvající síla $V(x) = 40 - 10x$ je nulová přesně v kloubu, a právě tam má proto moment extrém.

::callout{type="details" title="Průhyb kloubu principem virtuálních prací"}
Do uzlu 3 vložte jednotkovou sílu směrem dolů. Vyvolá reakce $\bar V = \bar H = 1/2$ a moment $\bar m$, který roste od 0 v patce do 2 v rohu a klesá zpět na 0 v kloubu, s tahem vně, stejně jako skutečný moment $M$. Integrujte $M \bar m$ přes všechny čtyři pruty:

$$
\text{sloupy: } 2\int_0^4 (20\,y)(0{,}5\,y)\,dy = 426{,}7
$$

$$
\text{příčel: } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0{,}5x)\,dx = 320
$$

S $EI = 210 \times 10^6 \cdot 8{,}356 \times 10^{-5} = 17\,548$ kNm² vychází:

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746{,}7}{17\,548} = 0{,}04255\ \text{m}
$$

To je 42,55 mm, které EduBeam uvádí jako `4,2554 · 10⁻²` m. Čtyřka na posledním místě odpovídá nepatrnému zkrácení a smykové deformaci, které plocha 1 m² ještě připouští a které ruční výpočet zanedbává. Se skutečnou plochou IPE 300, $A = 53{,}8$ cm², a se stojinou jako smykovou plochou (smykový součinitel 0,40) se pruty zkrátí a smykově přetvoří víc a kloub poklesne o 43,7 mm, tedy asi o 3 % víc.
::

## Experimentujte {#_7-experiment}

Měňte vždy jen jednu věc, odhadněte výsledek a teprve pak se podívejte. Zkratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> každou změnu vrátíte.

**Odškrtněte kloub.** Rám bude jednou staticky neurčitý. Rozpěr klesne na polovinu, na 10 kN, momenty v rozích se zmenší na −40 kNm a uprostřed rozpětí vznikne kladný moment 40 kNm. Uzel 3 se teď posune dolů jen o 12,16 mm místo 42,55 mm. Teď už záleží i na průřezech: dejte příčli tužší průřez než sloupům a momenty v rozích vzrostou.

::model-figure{caption="Bez kloubu: menší rozpěr, poloviční momenty v rozích a kladný moment uprostřed rozpětí"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], [2, 3], [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

**Vetkněte patky.** Uzlům 1 a 5 dejte symbol **Vetknutí**. Rozpěr vzroste na 30 kN a v patkách se objeví momenty 40 kNm (EduBeam ukáže `39,99`, protože se sloupy nepatrně zkrátí), momenty v rozích ale zůstanou 80 kNm. Ze symetrie je posouvající síla v kloubu nulová, takže každá polovina příčle pořád působí jako konzola délky 4 m vetknutá v rohu: $q \cdot 4^2/2 = 80$ kNm.

**Zatlačte do strany.** Vraťte patkám klouby a v uzlu 2 přidejte uzlové zatížení `Fx = 10` kN. Reakce přestanou být symetrické: svisle 35 kN a 45 kN, vodorovně 15 kN a 25 kN. Ověřte je stejnými třemi rovnicemi a podmínkou $M_3 = 0$; síla v uzlu 2 nemá k uzlu 3 žádné rameno. Moment v levém rohu se změní na −60 kNm a levá polovina příčle se teď mírně prohne dolů, kladným momentem 1,25 kNm ve vzdálenosti 0,5 m od kloubu.

::model-figure{caption="Vodorovná síla 10 kN v uzlu 2: pravý roh teď přenáší 100 kNm"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
  - { node: 2, fx: 10 }
results: [M, N]
show: [nodeLabels]
---
::

**Přidejte druhý kloub.** Zaškrtněte i kloub na začátku prvku 2, v uzlu 2. Dva klouby v příčli na dvou kloubově uložených sloupech tvoří mechanismus. EduBeam nezobrazí žádné výsledky, vypíše *Klouby v uzlech 2, 3 umožňují konstrukci pohyb.* a pohyb ukáže animací.

## Co dál {#next-steps}

::card-grid{cols="2"}
:::card{title="Procvičování: trojkloubové rámy" icon="lucide:dices" to="/cs/practice?p=H2048"}
Stejný rám s novými zatíženími, mezi nimi i s vodorovnou silou, a s okamžitou kontrolou vašich odpovědí. Začněte úlohou H2048; další dostanete, když ponecháte vybraný jen typ **Trojkloubový rám** a stisknete **Nová úloha**.
:::
:::card{title="Další: rovinná příhradová konstrukce" icon="lucide:git-fork" to="/cs/tutorials/truss"}
Devět kloubových prutů: metoda styčných bodů, průsečná metoda, nulový prut a průhyb principem virtuálních prací.
:::
::
