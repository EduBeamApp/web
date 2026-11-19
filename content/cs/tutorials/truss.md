---
description: "Návod: v EduBeamu sestavíte příhradovou konstrukci z kloubových prutů, ověříte síly v prutech, najdete nulový prut a ověříte průhyb. Asi 20 minut."
source: site
---

# Návod: rovinná příhradová konstrukce

Z prutů s klouby sestavíte malou staticky určitou příhradovou konstrukci, síly v prutech ověříte metodou styčných bodů a průsečnou metodou a průhyb ověříte principem virtuálních prací.

- **Čas:** asi 20 minut.
- **Potřebujete:** EduBeam otevřený na druhé kartě prohlížeče, na počítači s myší a klávesnicí. Pokud jste s EduBeamem ještě nepracovali, projděte si nejdřív [Rychlý start](/cs/guide/quick-start) nebo některý z předchozích návodů.
- **Předpoklady:** metoda styčných bodů a průsečná metoda. Nepovinná kontrola průhybu používá metodu jednotkové síly (princip virtuálních prací).
- **Jednotky:** SI. Štítek jednotek vpravo dole v zobrazení má ukazovat `m m² kN kNm MPa`. Pokud ukazuje stopy a kipy, klikněte na něj a v poli **Soustava jednotek** zvolte **SI (metrická)**.

**Naučíte se**

- modelovat pruty příhradové konstrukce jako nosníkové prvky s klouby na obou koncích a kreslit je myší,
- ověřit síly v prutech metodou styčných bodů a průsečnou metodou,
- poznat nulový prut a pochopit, proč pro příhradovou konstrukci funguje model s kloubovými styčníky.

::div{.actions}
[Otevřít EduBeam ↗](https://run.edubeam.app/?lang=cs){target="_blank"} [Přejít na ruční kontrolu](#_5-check-by-hand)
::

::model-figure{caption="Hotová příhradová konstrukce: 30 kN v uzlech 2 a 3, normálové síly v prutech (tah je kladný)"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N, w]
show: [nodeLabels, dimensions]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Zadání {#the-problem}

- Rozpětí 12 m rozdělené na tři pole po 4 m, výška 3 m: uzly dolního pásu 1 až 4, uzly horního pásu 5 a 6.
- Pevný kloub v uzlu 1, posuvný kloub v uzlu 4.
- Dvě síly po 30 kN ve styčnících dolního pásu 2 a 3.
- Ocelové pruty, $E = 210$ GPa, $A = 20$ cm².

| Prvky | Pruty (podle uzlů) | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | dolní pás |
| 4, 5, 6 | 1–5, 5–6, 6–4 | krajní diagonála, horní pás, krajní diagonála |
| 7, 8, 9 | 2–5, 5–3, 3–6 | svislice, prostřední diagonála, svislice |

**Je konstrukce staticky určitá?** Má $m = 9$ prutů, $r = 3$ složky reakcí a $j = 6$ styčníků, takže $m + r = 12 = 2j$. Každý styčník dává dvě podmínky rovnováhy, a síly v prutech proto určíte ze samotných podmínek rovnováhy.

## Sestavte model {#model-it}

::div{.steps}

### Materiál a průřez {#_1-material-and-section}

1. V horní liště aplikace klikněte na **Smazat konstrukci**, zaškrtněte **Smazat materiály** a **Smazat průřezy** a klikněte na **Potvrdit**. Uzly a prvky se pak znovu číslují od 1.
2. Záložka **Materiály** → **Knihovna materiálů** → **+** v řádku **Ocel (S235)**; knihovnu pak zavřete tlačítkem **Zrušit**.
3. Záložka **Průřezy** → **Přidat průřez**. Do pole **Plocha** napište `0.002` a do pole **Iy** `1e-6`, pole **Výška** a **Smykový součinitel** ponechte na hodnotě `1` a klikněte na **Přidat průřez**.

U prutů s klouby na obou koncích záleží jen na ploše; $I_y$ musí být pouze kladný.

### Nakreslete pruty s klouby {#_2-draw-the-bars-with-hinges}

Prut příhradové konstrukce je v EduBeamu nosníkový prvek se zaškrtnutými **oběma koncovými klouby**. Nástroj pro kreslení myší je může zaškrtnout za vás a pořadí, v jakém pruty nakreslíte, určí jejich čísla v tabulce výše.

1. Záložka **Prvky** → druhé tlačítko **Přidat prvek**, to s ikonou kurzoru.
2. V liště v horní části okna konstrukce zaškrtněte **Kloub na začátku** a **Kloub na konci**. Každý prut, který teď nakreslíte, dostane oba klouby.
3. Dolní pás: klikněte do bodů (0, 0), (4, 0), (8, 0) a (12, 0) a stiskněte <kbd>Esc</kbd>.
4. Horní část: znovu klikněte na tlačítko **Přidat prvek**, pak na uzel 1 v (0, 0), do bodů (4, −3) a (8, −3) a na uzel 4 v (12, 0). Když kliknete na existující uzel, prut se k němu připojí a nový uzel nevznikne. Stiskněte <kbd>Esc</kbd>.
5. Výplňové pruty: ještě jednou klikněte na **Přidat prvek** a pak na uzel 2 v (4, 0), uzel 5 v (4, −3), uzel 3 v (8, 0) a uzel 6 v (8, −3). Stiskněte <kbd>Esc</kbd> a potom <kbd>F</kbd>, aby se zobrazil celý model.

Tabulka **Prvky** by teď měla obsahovat devět prvků z tabulky výše, všechny se zaškrtnutými oběma políčky ve sloupci **Koncové klouby**. Klávesa <kbd>Esc</kbd> ukončí kreslení, políčka kloubů v liště ale zůstanou zaškrtnutá i pro příště.

### Podpory a zatížení {#_3-supports-and-loads}

1. Klikněte na uzel 1 → **Podepření uzlu** → symbol **Kloub**. Uzlu 4 dejte **Posuvný kloub**.
2. Klikněte na uzel 2 → **Přidat zatížení** → `Fz = 30` → **Přidat uzlové zatížení**. Totéž zopakujte v uzlu 3.

Kladná síla `Fz` míří dolů. Všechny pruty jsou ve styčníku připojené kloubově, takže styčník proti pootočení nic nedrží. EduBeam to přijme a pootočení takového uzlu vypíše jako 0.

::

## Výsledky {#_4-results}

V možnostech zobrazení vpravo nahoře v okně konstrukce (ozubeným kolem je zobrazíte a skryjete) vypněte **Deformovaný tvar** a **M<sub>y</sub> (x)**, protože v příhradové konstrukci ohyb nevzniká, a zapněte **N (x)**. Tah je kladný a EduBeam síly popisuje v kN na dvě desetinná místa.

- U obou podpor uvidíte `30,00` směrem nahoru. Vodorovná reakce v pevném kloubu ukazuje `0,00`, protože vodorovné zatížení nepůsobí.
- Všechny tři pruty dolního pásu mají popisek `40,00`, tedy tah, horní pás `-40,00`, tedy tlak.
- Prostřední diagonála 5–3 nepřenáší nic, a proto nemá popisek, stejně jako na obrázku nahoře.
- Záložka **Výsledky** → **Výsledky v uzlech**: uzel 2 se posune dolů o $D_z$ = `2,2937 · 10⁻³ m`, tedy o 2,294 mm.

## Kontrola ručním výpočtem {#_5-check-by-hand}

**Reakce.** Zatížení je symetrické, takže $R_1 = R_4 = 30$ kN směrem nahoru. Vodorovné zatížení nepůsobí, a vodorovná reakce v pevném kloubu je proto nulová.

**Styčník 1** (metoda styčných bodů). Krajní diagonála 1–5 je dlouhá 5 m, takže $\sin\alpha = 3/5$ a $\cos\alpha = 4/5$:

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**Styčník 2.** Sílu 30 kN může nahoru přenést jedině svislice 2–5: $N_{25} = +30$ kN a $N_{23} = N_{12} = 40$ kN.

**Řez prostředním polem** (průsečná metoda). Veďte řez pruty 5–6, 5–3 a 2–3 a uvažujte levou část:

- Momentová podmínka k uzlu 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Svislé síly: posouvající síla v poli je $R_1 - 30 = 0$, takže prostřední diagonála **5–3 nepřenáší nic**: $N_{53} = 0$.

| Pruty | Ručně | EduBeam |
| --- | --- | --- |
| Dolní pás 1–2, 2–3, 3–4 | +40 kN, tah | 40,00 |
| Horní pás 5–6 | −40 kN, tlak | −40,00 |
| Krajní diagonály 1–5, 6–4 | −50 kN | −50,00 |
| Svislice 2–5, 3–6 | +30 kN | 30,00 |
| Prostřední diagonála 5–3 | 0 | bez popisku |

Nulový prut není zbytečný: při *tomto* zatížení nepřenáší nic, ale když ho odeberete, konstrukce se zhroutí, jak ukážou pokusy níže.

::callout{type="details" title="Průhyb uzlu 2 principem virtuálních prací"}
Do uzlu 2 vložte jednotkovou sílu směrem dolů a konstrukci znovu ručně vyřešte: $R_1 = 2/3$, $R_4 = 1/3$ a síly v prutech $n$ jsou v tabulce níže. Průhyb je $\delta = \sum N\,n\,L / (EA)$:

| Prut | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
| --- | --- | --- | --- | --- |
| 1–2 | 40 | 8/9 | 4 | 142,2 |
| 2–3 | 40 | 8/9 | 4 | 142,2 |
| 3–4 | 40 | 4/9 | 4 | 71,1 |
| 1–5 | −50 | −10/9 | 5 | 277,8 |
| 5–6 | −40 | −4/9 | 4 | 71,1 |
| 6–4 | −50 | −5/9 | 5 | 138,9 |
| 2–5 | 30 | 1 | 3 | 90,0 |
| 5–3 | 0 | −5/9 | 5 | 0 |
| 3–6 | 30 | 1/3 | 3 | 30,0 |
| | | | součet | 963,3 |

$$
\delta_2 = \frac{963{,}3}{EA} = \frac{963{,}3}{210 \times 10^6 \cdot 0{,}002} = 0{,}002294\ \text{m}
$$

To je 2,294 mm, stejně jako $D_z$ uzlu 2 v EduBeamu, `2,2937 · 10⁻³` m.
::

## Experimentujte {#_6-experiment}

Měňte vždy jen jednu věc, odhadněte výsledek a teprve pak se podívejte. Zkratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> každou změnu vrátíte.

**Přesuňte jedno zatížení.** Dejte obě síly do uzlu 2: zatížení v uzlu 3 smažte a to druhé změňte na `Fz = 60`. Teď je $R_1 = 40$ kN, posouvající síla v prostředním poli je $40 - 60 = -20$ kN a prostřední diagonála ji musí přenést: $N_{53} = -20 \cdot 5/3 = -33{,}33$ kN, tedy tlak.

::model-figure{caption="60 kN v uzlu 2: prostřední diagonála 5–3 teď přenáší posouvající sílu pole"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 60 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

**Odstraňte prostřední diagonálu.** Smažte prvek 8. Z prostředního pole se stane kloubový obdélník, který se může zkosit do strany. EduBeam nezobrazí žádné výsledky, vypíše *Klouby v uzlech 2, 3, 5, 6 umožňují konstrukci pohyb.*, tedy čtyři rohy tohoto pole, a pohyb ukáže animací.

**Odškrtněte všechny klouby** v tabulce **Prvky**. Z příhradové konstrukce se stane rám s tuhými styčníky. Zapněte **M<sub>y</sub> (x)**: ohybové momenty zůstanou pod 0,1 kNm a normálové síly se změní o méně než 0,1 %. Proto u příhradové konstrukce složené z trojúhelníků idealizace kloubových styčníků funguje.

**Změňte obě podpory na pevné klouby.** Čtvrtá složka reakce udělá z konstrukce jednou staticky neurčitou a výsledek vás možná překvapí: dolní pás teď nepřenáší **nic** a místo něj tlačí každá podpora dovnitř silou 40 kN. Uzly 1 a 4 se nemohou vzdálit, takže tři pruty pásu mezi nimi, ležící v jedné přímce, musí mít nulové celkové prodloužení. Všechny tři přenášejí stejnou sílu, takže tato síla je nulová a jejích 40 kN převezmou podpory. Platí to bez ohledu na plochy prutů.

::model-figure{caption="Obě podpory jsou pevné klouby: podpory převezmou úlohu dolního pásu"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: pin }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Co dál {#next-steps}

Teorii příhradového prutu najdete na stránce [Příhradový prut](/cs/elements/truss).

::card-grid{cols="2"}
:::card{title="Procvičování: Warrenovy příhradové nosníky" icon="lucide:dices" to="/cs/practice?p=T2048"}
Reakce a síla v jednom prutu větší příhradové konstrukce, s okamžitou kontrolou vašich odpovědí. Začněte úlohou T2048; další dostanete, když ponecháte vybraný jen typ **Warrenův příhradový nosník** a stisknete **Nová úloha**.
:::
:::card{title="Další: spojitý nosník a pokles podpory" icon="lucide:spline" to="/cs/tutorials/continuous-beam"}
Staticky neurčitý nosník: co přináší spojitost, co s ním udělá pokles podpory a jak obojí ověřit silovou metodou.
:::
::
