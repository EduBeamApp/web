---
description: "Návod: šikmý nosník (krokva, schodisko) v EduBeame – zaťaženie na meter pôdorysu, sily N a V pozdĺž sklonu a vplyv smeru posuvného kĺbu. Asi 15 minút."
source: site
---

# Návod: šikmý nosník

Vymodelujete krokvu zaťaženú snehom, odčítate normálové a priečne sily pozdĺž jej sklonu a overíte ich ručne.

- **Čas:** asi 15 minút. Je to prvý a najkratší zo štyroch návodov.
- **Potrebujete:** EduBeam otvorený v druhej karte prehliadača, na počítači s myšou a klávesnicou. Ak ste s EduBeamom ešte nepracovali, prejdite si najprv [Rýchly štart](/sk/guide/quick-start): ukazuje karty a dialógy, s ktorými tento návod pracuje.
- **Predpoklady:** rovnováha prostého nosníka a rozklad sily na dve zložky.
- **Jednotky:** SI. Štítok jednotiek vpravo dole v zobrazení má ukazovať `m m² kN kNm MPa`. Ak ukazuje stopy a kipy, kliknite naň a v poli **Sústava jednotiek** zvoľte **SI (metrická)**.

**Naučíte sa**

- prepočítať zaťaženie zadané na meter pôdorysu na zaťaženie na dĺžku prvku, s ktorým EduBeam počíta,
- nasmerovať spojité zaťaženie zvisle alebo kolmo na prvok pomocou políčka **LCS**,
- natočiť posuvný kĺb a overiť si, že mení normálovú silu, ale nie ohybový moment.

::div{.actions}
[Otvoriť EduBeam ↗](https://run.edubeam.app/?lang=sk){target="_blank"} [Prejsť na ručnú kontrolu](#check-by-hand)
::

::model-figure{caption="Hotová krokva: sneh 3 kN/m na meter pôdorysu, zadaný ako 2,4 kN/m na dĺžku prvku, s pevným kĺbom pri odkvape (uzol 1) a posuvným kĺbom pri hrebeni (uzol 2)"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Zadanie {#the-problem}

- Priama krokva z uzla 1 v (0, 0) nahor do uzla 2 v (4, −3): 4 m v pôdoryse a 3 m na výšku, takže je dlhá $L = 5$ m, $\cos\alpha = 4/5$ a $\sin\alpha = 3/5$.
- Pevný kĺb v uzle 1 pri odkvape. V uzle 2 pri hrebeni posuvný kĺb, ktorý sa posúva vodorovne, takže jeho reakcia je zvislá.
- Sneh $s = 3$ kN/m, zadaný tak, ako ho uvádzajú normy: **na meter pôdorysu** (vodorovného priemetu).
- Oceľ, $E = 210$ GPa, a $I_y = 8{,}356 \times 10^{-5}$ m⁴, čo zodpovedá IPE 300.

**Je konštrukcia staticky určitá?** Tri zložky reakcií a tri podmienky rovnováhy: áno. Sily vyplývajú zo samotných podmienok rovnováhy; $E$ a $I_y$ ovplyvňujú iba priehyb.

## Zostavte model {#model-it}

::div{.steps}

### Materiál a prierez {#material-and-section}

1. V hornej lište aplikácie kliknite na **Vymazať konštrukciu**, zaškrtnite **Vymazať materiály** a **Vymazať prierezy** a kliknite na **Potvrdiť**. Uzly a prvky sa potom znova číslujú od 1.
2. Karta **Materiály** → **Knižnica materiálov** → **+** v riadku **Oceľ (S235)**; knižnicu potom zatvorte tlačidlom **Zrušiť**.
3. Karta **Prierezy** → **Pridať prierez**. Do poľa **Iy** napíšte `8.356e-5`, polia **Plocha**, **Výška** a **Šmykový súčiniteľ** ponechajte na hodnote `1` a kliknite na **Pridať prierez**.

Plocha 1 m² zaistí, že sa prvok znateľne neskráti ani šmykovo nepretvorí, ako predpokladá ručný výpočet.

### Nakreslite prvok {#draw-the-member}

1. Karta **Prvky** → druhé tlačidlo **Pridať prvok**, to s ikonou kurzora.
2. Kliknite do bodu (0, 0) a potom do bodu (4, −3). Pravítka a zameriavací kríž ukazujú, kde ste, a kliknutia sa prichytávajú k mriežke.
3. Klávesom <kbd>Esc</kbd> kreslenie ukončíte a klávesom <kbd>F</kbd> zobrazíte celý model.

Os z smeruje nadol, takže uzol 2, ktorý leží 3 m **nad** uzlom 1, má $z = -3$. Oba uzly skontrolujte v tabuľke **Uzly** a súradnice, ktoré nesedia, prepíšte.

### Podpery {#supports}

Kliknite na uzol 1 → **Podpery uzla** → symbol **Pevný kĺb**. Uzlu 2 dajte rovnakým spôsobom **Posuvný kĺb**.

### Zaťaženie {#load}

Na krokvu pripadá celkom $3 \cdot 4 = 12$ kN snehu. EduBeam rozdeľuje rovnomerné spojité zaťaženie po **dĺžke** prvku, takže rovnakých 12 kN na 5 m zodpovedá

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0{,}8 = 2{,}4\ \text{kN/m}
$$

1. Karta **Zaťaženie** → **Pridať prvkové zaťaženie**.
2. **Typ zaťaženia** *Rovnomerné spojité zaťaženie*, **Prvok** `1`, `fz = 2.4`.
3. **Zrušte zaškrtnutie LCS**, aby `fz` pôsobilo zvisle, a kliknite na **Pridať prvkové zaťaženie**.

::callout{type="warning" title="LCS je predvolene zaškrtnuté"}
So zaškrtnutým **LCS** pôsobí `fz` v smere lokálnej osi z prvku, teda kolmo na sklon: ako vietor na strechu, nie ako sneh. Pri vodorovnom nosníku je oboje to isté, a preto sa to ľahko prehliadne. Kam zaťaženie smeruje, ukazujú jeho šípky; podrobnosti nájdete v kapitole [Zaťaženie](/sk/essentials/loads#uniformly-distributed-load).
::

::

## Výsledky {#results}

Nosník je vyriešený, len čo zadáte zaťaženie. V možnostiach zobrazenia vpravo hore v okne konštrukcie (ozubeným kolieskom ich zobrazíte a skryjete) sú od začiatku zapnuté **Deformovaný tvar**, **M<sub>y</sub> (x)** a **Reakcie**; zaškrtnite ešte **N (x)** a **V<sub>z</sub> (x)**. Tie isté priebehy ukazuje aj prepínač pod obrázkom hore.

EduBeam popisuje priebehy a reakcie v kN a kNm na dve desatinné miesta, takže uvidíte:

- V každej podpere `6,00` smerom nahor. Vodorovná reakcia v pevnom kĺbe ukazuje `0,00`: nepôsobí žiadna vodorovná sila.
- V strede rozpätia vrchol ohybového momentu `6,00` kNm.
- Priečnu silu `4,80` kN v uzle 1 a `-4,80` v uzle 2.
- Normálovú silu `-3,60` kN v uzle 1 (tlak) a `3,60` v uzle 2 (ťah), v strede rozpätia nulovú.

## Kontrola ručným výpočtom {#check-by-hand}

**Reakcie.** Výslednica 12 kN pôsobí v pôdorysnej vzdialenosti 2 m od uzla 1, takže momentové podmienky k obom koncom dávajú $V_1 = V_2 = 6$ kN. Nepôsobí žiadna vodorovná sila, preto $H_1 = 0$.

**Ohybový moment.** Pri zvislých silách sa uplatnia iba vodorovné ramená. V pôdorysnej vzdialenosti $x$ od uzla 1 platí

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

presne ako pri vodorovnom nosníku s rozpätím $a = 4$ m a s rovnakým zaťažením na meter pôdorysu.

**Priečna a normálová sila.** Sily vľavo od rezu v mieste $x$ dávajú spolu zvislú silu $T(x) = V_1 - s\,x$. Rozložte ju na zložku kolmú na prvok a zložku v smere prvku:

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | Uzol 1, $T = +6$ kN | Stred rozpätia, $T = 0$ | Uzol 2, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0{,}8 = 4{,}8$ kN | 0 | −4,8 kN |
| $N$ | $-6 \cdot 0{,}6 = -3{,}6$ kN | 0 | +3,6 kN |
| $M$ | 0 | 6 kNm | 0 |

Všetko sa zhoduje s EduBeamom. Reakcia v uzle 1, ktorá smeruje nahor, tlačí dolný koniec nahor po sklone, do prvku: tlak. Reakcia v uzle 2, ktorá tiež smeruje nahor, ťahá horný koniec ďalej nahor po sklone, od prvku: ťah. Znamienka sa riadia smerom prvku, od uzla 1 k uzlu 2, ako vysvetľuje [znamienková konvencia](/sk/elements/conventions#internal-forces).

## Experimentujte {#experiment}

Meňte vždy iba jednu vec, odhadnite výsledok a až potom sa pozrite. Skratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> každú zmenu vrátite.

**Zabudnite na kosínus.** Zadajte `fz = 3` namiesto 2,4. To sú 3 kN na meter dĺžky krokvy, celkom 15 kN, a všetky výsledky vyjdú o 25 % väčšie: reakcie 7,5 kN a moment 7,5 kNm. Pri streche so sklonom 30° by chyba bola 15 %, pri sklone 45° 41 %.

**Nechajte LCS zaškrtnuté.** Pri zaťažení 2,4 kN/m zaškrtnite **LCS**. Zaťaženie teraz pôsobí kolmo na sklon, ako vietor, a má vodorovnú zložku 7,2 kN, ktorú môže preniesť iba pevný kĺb. Moment vzrastie na $2{,}4 \cdot 5^2/8 = 7{,}5$ kNm a normálová sila bude konštantný ťah 4,5 kN.

::model-figure{caption="Rovnakých 2,4 kN/m so zaškrtnutým LCS: kolmo na sklon, takže pevný kĺb prenáša 7,2 kN do strany"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Natočte posuvný kĺb.** Zaškrtnutie **LCS** znova zrušte a zmeňte iba smer, v ktorom sa posuvný kĺb v uzle 2 posúva. Kliknite na uzol 2 → **Podpery uzla**, do poľa **Pootočenie súradného systému** napíšte `-36.87` a stlačte <kbd>Enter</kbd> (alebo hodnotu zadajte do poľa **α** v riadku uzla v tabuľke **Uzly**).

![Ponuka Podpery uzla pri uzle 2: symboly podpier, podopreté smery a Pootočenie súradného systému](/screenshots/sk/p2t-node-supports-angle.webp){.shot-md}

Uhol natáča vlastné osi uzla. Vo východiskových osiach (x doprava, z nadol) záporný uhol ich natočí na obrazovke proti smeru hodinových ručičiek. Viac nájdete v kapitole [Šikmé podpery](/sk/essentials/nodes-supports#inclined-skewed-supports).

Posuvný kĺb sa teraz posúva pozdĺž sklonu, takže jeho reakcia je kolmá na prvok: z momentovej podmienky k uzlu 1 vychádza $12 \cdot 2 / 5 = 4{,}8$ kN. Zvyšok prevezme pevný kĺb, a s ním aj celú normálovú silu: −7,2 kN v uzle 1, nula v uzle 2.

::model-figure{caption="Posuvný kĺb v uzle 2 natočený o −36,87°, aby sa posúval pozdĺž sklonu: normálová sila prebieha od −7,2 kN po nulu"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Urobte z neho zvislý posuvný kĺb.** Vráťte uhol na 0 a uzlu 2 dajte **Zvislý posuvný kĺb**. Ten sa posúva zvisle, takže môže tlačiť iba do strany: momentová podmienka k uzlu 1, $H_2 \cdot 3 = 12 \cdot 2$, dáva 8 kN a pevný kĺb drží krokvu proti tejto vodorovnej sile. Celý prvok je tlačený.

::model-figure{caption="Zvislý posuvný kĺb v uzle 2: vodorovná reakcia 8 kN a celá krokva v tlaku"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

Všetky tri posuvné kĺby vedľa seba:

| Posuvný kĺb v uzle 2 | Reakcia v uzle 2 | Reakcia v uzle 1 | $N$ od uzla 1 k uzlu 2 |
| --- | --- | --- | --- |
| Vodorovný | 6 kN ↑ | 6 kN ↑ | −3,6 až +3,6 kN |
| Pozdĺž sklonu | 4,8 kN ⊥ na prvok | 2,88 kN →, 8,16 kN ↑ | −7,2 až 0 kN |
| Zvislý | 8 kN ← | 8 kN →, 12 kN ↑ | −13,6 až −6,4 kN |

**Ohybový moment sa nikdy nezmení** a priečna sila tiež nie: vo všetkých troch prípadoch je to 6 kNm a ±4,8 kN. Uzol 1, uzol 2 aj každý rez ležia na jednej priamke, na osi prvku. Zložka reakcie v uzle 2, ktorá pôsobí pozdĺž tejto priamky, nemá k žiadnemu z týchto bodov moment, takže pridáva iba normálovú silu. Zložka kolmá na prvok vychádza z momentovej podmienky k uzlu 1 vždy 4,8 kN, nech posuvný kĺb smeruje kamkoľvek. Smer posuvného kĺbu rozhoduje iba o tom, kam sa vodorovná sila prenesie, a na tom záleží stene alebo schodiskovej podeste, ktorá ju musí prevziať.

## Čo ďalej {#next-steps}

::card-grid{cols="2"}
:::card{title="Precvičovanie: nosníky s previslým koncom" icon="lucide:dices" to="/sk/practice?p=O2048"}
Reakcie a najväčší moment nosníka so spojitým zaťažením, s okamžitou kontrolou vašich odpovedí. Začnite úlohou O2048; ďalšie dostanete, keď ponecháte vybraný iba typ **Nosník s previslým koncom** a stlačíte **Nová úloha**.
:::
:::card{title="Ďalej: trojkĺbový rám" icon="lucide:triangle" to="/sk/tutorials/three-hinged-frame"}
Štyri prúty, vnútorný kĺb a vodorovná reakcia: rám, ktorý stále vyriešite zo samotných podmienok rovnováhy.
:::
::
