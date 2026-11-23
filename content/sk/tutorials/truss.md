---
description: "Návod: v EduBeame zostavíte priehradovú konštrukciu z kĺbovo pripojených prútov, overíte sily v prútoch, nájdete nulový prút a skontrolujete priehyb. Asi 20 minút."
source: site
---

# Návod: rovinná priehradová konštrukcia

Z prútov s kĺbmi zostavíte malú staticky určitú priehradovú konštrukciu, sily v prútoch overíte uzlovou a priesečnou metódou a priehyb skontrolujete princípom virtuálnych prác.

- **Čas:** asi 20 minút.
- **Potrebujete:** EduBeam otvorený v druhej karte prehliadača, na počítači s myšou a klávesnicou. Ak ste s EduBeamom ešte nepracovali, prejdite si najprv [Rýchly štart](/sk/guide/quick-start) alebo niektorý z predchádzajúcich návodov.
- **Predpoklady:** uzlová metóda a priesečná metóda. Nepovinná kontrola priehybu používa metódu jednotkovej sily (princíp virtuálnych prác).
- **Jednotky:** SI. Štítok jednotiek vpravo dole v zobrazení má ukazovať `m m² kN kNm MPa`. Ak ukazuje stopy a kipy, kliknite naň a v poli **Sústava jednotiek** zvoľte **SI (metrická)**.

**Naučíte sa**

- modelovať prúty priehradovej konštrukcie ako nosníkové prvky s kĺbmi na oboch koncoch a kresliť ich myšou,
- overiť sily v prútoch uzlovou metódou a priesečnou metódou,
- rozpoznať nulový prút a pochopiť, prečo pre priehradovú konštrukciu funguje model s kĺbovými uzlami.

::div{.actions}
[Otvoriť EduBeam ↗](https://run.edubeam.app/?lang=sk){target="_blank"} [Prejsť na ručnú kontrolu](#_5-check-by-hand)
::

::model-figure{caption="Hotová priehradová konštrukcia: 30 kN v uzloch 2 a 3, normálové sily v prútoch (ťah je kladný)"}
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

## Zadanie {#the-problem}

- Rozpätie 12 m rozdelené na tri polia po 4 m, výška 3 m: uzly dolného pásu 1 až 4, uzly horného pásu 5 a 6.
- Pevný kĺb v uzle 1, posuvný kĺb v uzle 4.
- Dve sily po 30 kN v uzloch dolného pásu 2 a 3.
- Oceľové prúty, $E = 210$ GPa, $A = 20$ cm².

| Prvky | Prúty (podľa uzlov) | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | dolný pás |
| 4, 5, 6 | 1–5, 5–6, 6–4 | krajná diagonála, horný pás, krajná diagonála |
| 7, 8, 9 | 2–5, 5–3, 3–6 | zvislica, stredná diagonála, zvislica |

**Je konštrukcia staticky určitá?** Má $m = 9$ prútov, $r = 3$ zložky reakcií a $j = 6$ uzlov, takže $m + r = 12 = 2j$. Každý uzol dáva dve podmienky rovnováhy, a sily v prútoch preto určíte zo samotných podmienok rovnováhy.

## Zostavte model {#model-it}

::div{.steps}

### Materiál a prierez {#_1-material-and-section}

1. V hornej lište aplikácie kliknite na **Vymazať konštrukciu**, zaškrtnite **Vymazať materiály** a **Vymazať prierezy** a kliknite na **Potvrdiť**. Uzly a prvky sa potom znova číslujú od 1.
2. Karta **Materiály** → **Knižnica materiálov** → **+** v riadku **Oceľ (S235)**; knižnicu potom zatvorte tlačidlom **Zrušiť**.
3. Karta **Prierezy** → **Pridať prierez**. Do poľa **Plocha** napíšte `0.002` a do poľa **Iy** `1e-6`, polia **Výška** a **Šmykový súčiniteľ** ponechajte na hodnote `1` a kliknite na **Pridať prierez**.

Pri prútoch s kĺbmi na oboch koncoch záleží iba na ploche; $I_y$ musí byť len kladný.

### Nakreslite prúty s kĺbmi {#_2-draw-the-bars-with-hinges}

Prút priehradovej konštrukcie je v EduBeame nosníkový prvok so zaškrtnutými **oboma koncovými kĺbmi**. Nástroj na kreslenie myšou ich môže zaškrtnúť za vás a poradie, v akom prúty nakreslíte, určí ich čísla v tabuľke vyššie.

1. Karta **Prvky** → druhé tlačidlo **Pridať prvok**, to s ikonou kurzora.
2. V lište v hornej časti okna konštrukcie zaškrtnite **Kĺb na začiatku** a **Kĺb na konci**. Každý prút, ktorý teraz nakreslíte, dostane oba kĺby.
3. Dolný pás: kliknite do bodov (0, 0), (4, 0), (8, 0) a (12, 0) a stlačte <kbd>Esc</kbd>.
4. Horná časť: znova kliknite na tlačidlo **Pridať prvok**, potom na uzol 1 v (0, 0), do bodov (4, −3) a (8, −3) a na uzol 4 v (12, 0). Keď kliknete na existujúci uzol, prút sa k nemu pripojí a nový uzol nevznikne. Stlačte <kbd>Esc</kbd>.
5. Výplňové prúty: ešte raz kliknite na **Pridať prvok** a potom na uzol 2 v (4, 0), uzol 5 v (4, −3), uzol 3 v (8, 0) a uzol 6 v (8, −3). Stlačte <kbd>Esc</kbd> a potom <kbd>F</kbd>, aby sa zobrazil celý model.

Tabuľka **Prvky** by teraz mala obsahovať deväť prvkov z tabuľky vyššie, všetky so zaškrtnutými oboma políčkami v stĺpci **Koncové kĺby**. Kláves <kbd>Esc</kbd> ukončí kreslenie, políčka kĺbov v lište však zostanú zaškrtnuté aj nabudúce.

### Podpery a zaťaženie {#_3-supports-and-loads}

1. Kliknite na uzol 1 → **Podpery uzla** → symbol **Pevný kĺb**. Uzlu 4 dajte **Posuvný kĺb**.
2. Kliknite na uzol 2 → **Pridať zaťaženie** → `Fz = 30` → **Pridať uzlové zaťaženie**. To isté zopakujte v uzle 3.

Kladná sila `Fz` smeruje nadol. Všetky prúty sú v uzle pripojené kĺbovo, takže uzol proti pootočeniu nič nedrží. EduBeam to prijme a pootočenie takého uzla vypíše ako 0.

::

## Výsledky {#_4-results}

V možnostiach zobrazenia vpravo hore v okne konštrukcie (ozubeným kolieskom ich zobrazíte a skryjete) vypnite **Deformovaný tvar** a **M<sub>y</sub> (x)**, pretože v priehradovej konštrukcii ohyb nevzniká, a zapnite **N (x)**. Ťah je kladný a EduBeam sily popisuje v kN na dve desatinné miesta.

- Pri oboch podperách uvidíte `30,00` smerom nahor. Vodorovná reakcia v pevnom kĺbe ukazuje `0,00`, pretože nepôsobí vodorovné zaťaženie.
- Všetky tri prúty dolného pásu majú popis `40,00`, teda ťah, horný pás `-40,00`, teda tlak.
- Stredná diagonála 5–3 neprenáša nič, a preto nemá popis, rovnako ako na obrázku hore.
- Karta **Výsledky** → **Výsledky v uzloch**: uzol 2 sa posunie nadol o $D_z$ = `2,2937 · 10⁻³ m`, teda o 2,294 mm.

## Kontrola ručným výpočtom {#_5-check-by-hand}

**Reakcie.** Zaťaženie je symetrické, takže $R_1 = R_4 = 30$ kN smerom nahor. Vodorovné zaťaženie nepôsobí, a vodorovná reakcia v pevnom kĺbe je preto nulová.

**Uzol 1** (uzlová metóda). Krajná diagonála 1–5 je dlhá 5 m, takže $\sin\alpha = 3/5$ a $\cos\alpha = 4/5$:

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**Uzol 2.** Silu 30 kN môže nahor preniesť jedine zvislica 2–5: $N_{25} = +30$ kN a $N_{23} = N_{12} = 40$ kN.

**Rez stredným poľom** (priesečná metóda). Veďte rez prútmi 5–6, 5–3 a 2–3 a uvažujte ľavú časť:

- Momentová podmienka k uzlu 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Zvislé sily: priečna sila v poli je $R_1 - 30 = 0$, takže stredná diagonála **5–3 neprenáša nič**: $N_{53} = 0$.

| Prúty | Ručne | EduBeam |
| --- | --- | --- |
| Dolný pás 1–2, 2–3, 3–4 | +40 kN, ťah | 40,00 |
| Horný pás 5–6 | −40 kN, tlak | −40,00 |
| Krajné diagonály 1–5, 6–4 | −50 kN | −50,00 |
| Zvislice 2–5, 3–6 | +30 kN | 30,00 |
| Stredná diagonála 5–3 | 0 | bez popisu |

Nulový prút nie je zbytočný: pri *tomto* zaťažení neprenáša nič, ale keď ho odoberiete, konštrukcia sa zrúti, ako ukážu pokusy nižšie.

::callout{type="details" title="Priehyb uzla 2 princípom virtuálnych prác"}
Do uzla 2 vložte jednotkovú silu smerom nadol a konštrukciu znova ručne vyriešte: $R_1 = 2/3$, $R_4 = 1/3$ a sily v prútoch $n$ sú v tabuľke nižšie. Priehyb je $\delta = \sum N\,n\,L / (EA)$:

| Prút | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
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
| | | | súčet | 963,3 |

$$
\delta_2 = \frac{963{,}3}{EA} = \frac{963{,}3}{210 \times 10^6 \cdot 0{,}002} = 0{,}002294\ \text{m}
$$

To je 2,294 mm, rovnako ako $D_z$ uzla 2 v EduBeame, `2,2937 · 10⁻³` m.
::

## Experimentujte {#_6-experiment}

Meňte vždy iba jednu vec, odhadnite výsledok a až potom sa pozrite. Skratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> každú zmenu vrátite.

**Presuňte jedno zaťaženie.** Dajte obe sily do uzla 2: zaťaženie v uzle 3 vymažte a to druhé zmeňte na `Fz = 60`. Teraz je $R_1 = 40$ kN, priečna sila v strednom poli je $40 - 60 = -20$ kN a stredná diagonála ju musí preniesť: $N_{53} = -20 \cdot 5/3 = -33{,}33$ kN, teda tlak.

::model-figure{caption="60 kN v uzle 2: stredná diagonála 5–3 teraz prenáša priečnu silu poľa"}
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

**Odstráňte strednú diagonálu.** Vymažte prvok 8. Zo stredného poľa sa stane kĺbový obdĺžnik, ktorý sa môže zošikmiť do strany. EduBeam nezobrazí žiadne výsledky, vypíše *Kĺby v uzloch 2, 3, 5, 6 umožňujú pohyb konštrukcie.*, teda štyri rohy tohto poľa, a pohyb ukáže animáciou.

**Zrušte zaškrtnutie všetkých kĺbov** v tabuľke **Prvky**. Z priehradovej konštrukcie sa stane rám s tuhými uzlami. Zapnite **M<sub>y</sub> (x)**: ohybové momenty zostanú pod 0,1 kNm a normálové sily sa zmenia o menej ako 0,1 %. Preto pri priehradovej konštrukcii zloženej z trojuholníkov idealizácia kĺbových uzlov funguje.

**Zmeňte obe podpery na pevné kĺby.** Štvrtá zložka reakcie urobí z konštrukcie jedenkrát staticky neurčitú a výsledok vás možno prekvapí: dolný pás teraz neprenáša **nič** a namiesto neho tlačí každá podpera dovnútra silou 40 kN. Uzly 1 a 4 sa nemôžu vzdialiť, takže tri prúty pásu medzi nimi, ležiace v jednej priamke, musia mať nulové celkové predĺženie. Všetky tri prenášajú rovnakú silu, takže táto sila je nulová a 40 kN, ktoré pás predtým prenášal, prevezmú podpery. Platí to bez ohľadu na plochy prútov.

::model-figure{caption="Obe podpery sú pevné kĺby: podpery prevezmú úlohu dolného pásu"}
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

## Čo ďalej {#next-steps}

Teóriu priehradového prúta nájdete na stránke [Priehradový prút](/sk/elements/truss).

::card-grid{cols="2"}
:::card{title="Precvičovanie: Warrenove priehradové nosníky" icon="lucide:dices" to="/sk/practice?p=T2048"}
Reakcie a sila v jednom prúte väčšej priehradovej konštrukcie, s okamžitou kontrolou vašich odpovedí. Začnite úlohou T2048; ďalšie dostanete, keď ponecháte vybraný iba typ **Warrenov priehradový nosník** a stlačíte **Nová úloha**.
:::
:::card{title="Ďalej: spojitý nosník a pokles podpery" icon="lucide:spline" to="/sk/tutorials/continuous-beam"}
Staticky neurčitý nosník: čo prináša spojitosť, čo s ním urobí pokles podpery a ako oboje overiť silovou metódou.
:::
::
