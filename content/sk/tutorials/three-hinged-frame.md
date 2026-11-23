---
description: "Návod: trojkĺbový rám so spojitým zaťažením v EduBeame. Reakcie (aj vodorovnú) a vnútorné sily overíte ručne, spolu s priehybom kĺbu. Asi 15 minút."
source: site
---

# Návod: trojkĺbový rám

Vymodelujete rám s kĺbom v strede rozpätia nosníka, odčítate jeho reakcie a priebehy vnútorných síl a každé číslo overíte ručne, až po priehyb kĺbu.

- **Čas:** asi 15 minút.
- **Potrebujete:** EduBeam otvorený v druhej karte prehliadača, na počítači s myšou a klávesnicou. Ak ste s EduBeamom ešte nepracovali, začnite [Rýchlym štartom](/sk/guide/quick-start) alebo návodom [Šikmý nosník](/sk/tutorials/inclined-beam).
- **Predpoklady:** rovnováha rámu a metóda uvoľnenia. Nepovinná kontrola priehybu používa metódu jednotkovej sily (princíp virtuálnych prác).
- **Jednotky:** SI. Štítok jednotiek vpravo dole v zobrazení má ukazovať `m m² kN kNm MPa`. Ak ukazuje stopy a kipy, kliknite naň a v poli **Sústava jednotiek** zvoľte **SI (metrická)**.

**Naučíte sa**

- nakresliť rám myšou ako jednu lomenú čiaru,
- vložiť kĺb do prúta pomocou políčok **Koncové kĺby**,
- určiť vodorovnú reakciu z podmienky $M = 0$ v kĺbe a správne čítať znamienko $V$ v prútoch nakreslených rôznymi smermi.

::div{.actions}
[Otvoriť EduBeam ↗](https://run.edubeam.app/?lang=sk){target="_blank"} [Prejsť na ručnú kontrolu](#_6-check-by-hand)
::

::model-figure{caption="Hotový rám: 10 kN/m na nosníku, pevné kĺby v uzloch 1 a 5, kĺb v uzle 3"}
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

## Zadanie {#the-problem}

- Dva stĺpy výšky 4 m s kĺbovo uloženými pätami v uzloch 1 a 5, vzdialené od seba 8 m.
- Hore vodorovný nosník z uzla 2 do uzla 4 s kĺbom v strede rozpätia, v uzle 3.
- Rovnomerné spojité zaťaženie $q = 10$ kN/m po celom nosníku.
- Oceľ, $E = 210$ GPa, a $I_y = 8{,}356 \times 10^{-5}$ m⁴ (IPE 300) pri všetkých prútoch.

| Uzol | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | pevný kĺb |
| 2 | 0 | −4 | roh |
| 3 | 4 | −4 | kĺb v nosníku |
| 4 | 8 | −4 | roh |
| 5 | 8 | 0 | pevný kĺb |

Os z smeruje **nadol**, takže hlavy stĺpov ležia v $z = -4$.

**Je konštrukcia staticky určitá?** Dva pevné kĺby dávajú štyri zložky reakcií. Tri podmienky rovnováhy a podmienka $M_3 = 0$ v kĺbe dávajú štyri rovnice: áno, je.

## Zostavte model {#model-it}

::div{.steps}

### Materiál a prierez {#_1-material-and-section}

1. V hornej lište aplikácie kliknite na **Vymazať konštrukciu**, zaškrtnite **Vymazať materiály** a **Vymazať prierezy** a kliknite na **Potvrdiť**. Uzly a prvky sa potom znova číslujú od 1.
2. Karta **Materiály** → **Knižnica materiálov** → **+** v riadku **Oceľ (S235)**; knižnicu potom zatvorte tlačidlom **Zrušiť**.
3. Karta **Prierezy** → **Pridať prierez**. Do poľa **Iy** napíšte `8.356e-5`, polia **Plocha**, **Výška** a **Šmykový súčiniteľ** ponechajte na hodnote `1` a kliknite na **Pridať prierez**.

Plocha 1 m² zaistí, že sa prúty znateľne neskrátia ani šmykovo nepretvoria, čo predpokladá aj ručný výpočet priehybu. Vnútorné sily staticky určitého rámu od $E$, $A$ ani $I_y$ vôbec nezávisia.

### Nakreslite rám {#_2-draw-the-frame}

1. Karta **Prvky** → druhé tlačidlo **Pridať prvok**, to s ikonou kurzora.
2. Kliknite postupne do bodov (0, 0), (0, −4), (4, −4), (8, −4) a (8, 0). Každé kliknutie pridá ďalší uzol a spojí ho s predchádzajúcim; kliknutia sa prichytávajú k mriežke.
3. Klávesom <kbd>Esc</kbd> kreslenie ukončíte a klávesom <kbd>F</kbd> zobrazíte celý model.

Teraz máte uzly 1 až 5 a prvky 1 až 4, očíslované v poradí, v akom ste ich kreslili, rovnako ako na obrázkoch v tomto návode. Porovnajte tabuľku **Uzly** s tabuľkou vyššie a súradnice, ktoré nesedia, prepíšte.

### Podpery a kĺb {#_3-supports-and-the-hinge}

1. Kliknite na uzol 1 → **Podpery uzla** → symbol **Pevný kĺb**. To isté urobte pri uzle 5.
2. V tabuľke **Prvky** nájdite prvok 2, z uzla 2 do uzla 3, a zaškrtnite druhé z jeho políčok **Koncové kĺby**: kĺb na jeho konci, v uzle 3.

![Tabuľka Prvky: prvok 2 má zaškrtnutý kĺb na konci, v uzle 3](/screenshots/sk/p2t-frame-elements-table.webp)

Jeden kĺb stačí. Prvok 3 je potom jediný prút tuho pripojený k uzlu 3, takže doň v tomto mieste nemôže prejsť žiadny moment. Ak zaškrtnete aj kĺb na začiatku prvku 3, nič sa nezmení.

### Zaťaženie {#_4-load}

1. Karta **Zaťaženie** → **Pridať prvkové zaťaženie**.
2. **Typ zaťaženia** *Rovnomerné spojité zaťaženie*, **Prvok** `2`, `fz = 10`. Kliknite na **Pridať prvkové zaťaženie**.
3. To isté zopakujte pre prvok 3.

Kladné `fz` smeruje nadol. Nosník je vodorovný, takže na políčku **LCS** tu nezáleží.

::

## Výsledky {#_5-results}

V možnostiach zobrazenia vpravo hore v okne konštrukcie (ozubeným kolieskom ich zobrazíte a skryjete) sú od začiatku zapnuté **Deformovaný tvar**, **M<sub>y</sub> (x)** a **Reakcie**. Zvyšné priebehy pridáte zaškrtnutím **N (x)** a **V<sub>z</sub> (x)**; niektoré môžete naopak vypnúť a prezerať si priebehy po jednom. EduBeam ich popisuje v kN a kNm na dve desatinné miesta.

- Pri každej päte uvidíte `40,00` smerom nahor a `20,00` smerom dovnútra.
- Ohybový moment má v oboch rohoch popis `-80,00`; v kĺbe, kde je nulový, popis nemá. EduBeam ho vykresľuje na ťahanej strane, tu zvonka rámu.
- Normálová sila je všade záporná: `-40,00` v stĺpoch, `-20,00` v nosníku. Všetky štyri prúty sú tlačené.
- Karta **Výsledky** → **Výsledky v uzloch**: kĺb, uzol 3, sa posunie nadol o $D_z$ = `4,2554 · 10⁻² m`, teda o 42,55 mm. Rovnakú hodnotu v kĺbe ukazuje pohľad $w(x)$ na obrázku hore.

## Kontrola ručným výpočtom {#_6-check-by-hand}

**Zvislé reakcie.** Zo symetrie pripadá na každú pätu polovica z 80 kN:

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Vodorovné reakcie.** Rozdeľte rám v kĺbe a pre ľavú polovicu napíšte momentovú podmienku k uzlu 3, kde je moment nulový:

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

Obe päty tlačia dovnútra silou 20 kN. Túto vodorovnú reakciu môžu vyvinúť iba pevné kĺby, ktoré sa nemôžu rozísť. Bez nej by rám nestál: stĺpy by sa roztvorili a kĺb by sa prepadol.

| Veličina | Vzorec | Ručne | EduBeam |
| --- | --- | --- | --- |
| Zvislé reakcie | $q \cdot 8/2$ | 40 kN | 40,00 |
| Vodorovné reakcie | z $M_3 = 0$ | 20 kN | 20,00 |
| Momenty v rohoch, uzly 2 a 4 | $H_1 \cdot 4$ | 80 kNm, ťah zvonka | −80,00 |
| Moment v kĺbe, uzol 3 | | 0 | bez popisu |
| $N$ v stĺpoch | $-V_1$ | −40 kN | −40,00 |
| $N$ v nosníku | $-H_1$ | −20 kN | −20,00 |
| $V$ v stĺpoch | $\pm H_1$ | ±20 kN | −20,00; 20,00 |
| $V$ v nosníku v uzloch 2, 3, 4 | $V_1 - q\,x$ | 40; 0; −40 kN | 40,00; bez popisu; −40,00 |

Oba stĺpy prenášajú rovnakú priečnu silu s opačným znamienkom, −20 kN v prvku 1 a +20 kN v prvku 4, pretože lokálne osi každého prvku sledujú smer, v ktorom bol nakreslený: prvok 1 nahor, prvok 4 nadol. Vymeňte uzly jedného stĺpa a jeho znamienko sa obráti. Prečo je to tak, vysvetľuje [znamienková konvencia](/sk/elements/conventions#internal-forces).

V nosníku platí $M(x) = -80 + 40x - 5x^2$ kNm, kde $x$ meriate od uzla 2. Moment je v kĺbe nulový a nikde nie je kladný: celý nosník je namáhaný záporným momentom (ťah hore). Priečna sila $V(x) = 40 - 10x$ je nulová presne v kĺbe, a práve tam má preto moment extrém.

::callout{type="details" title="Priehyb kĺbu princípom virtuálnych prác"}
Do uzla 3 vložte jednotkovú silu smerom nadol. Vyvolá reakcie $\bar V = \bar H = 1/2$ a moment $\bar m$, ktorý rastie od 0 v päte po 2 v rohu a klesá späť na 0 v kĺbe, s ťahom zvonka, rovnako ako skutočný moment $M$. Integrujte $M \bar m$ cez všetky štyri prúty:

$$
\text{stĺpy: } 2\int_0^4 (20\,y)(0{,}5\,y)\,dy = 426{,}7
$$

$$
\text{nosník: } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0{,}5x)\,dx = 320
$$

S $EI = 210 \times 10^6 \cdot 8{,}356 \times 10^{-5} = 17\,548$ kNm² vychádza:

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746{,}7}{17\,548} = 0{,}04255\ \text{m}
$$

To je 42,55 mm, ktoré EduBeam uvádza ako `4,2554 · 10⁻²` m. Štvorka na poslednom mieste zodpovedá nepatrnému skráteniu a šmykovej deformácii, ktoré plocha 1 m² ešte pripúšťa a ktoré ručný výpočet zanedbáva. So skutočnou plochou IPE 300, $A = 53{,}8$ cm², a so stojinou ako šmykovou plochou (šmykový súčiniteľ 0,40) sa prúty skrátia a šmykovo pretvoria viac a kĺb poklesne o 43,7 mm, teda asi o 3 % viac.
::

## Experimentujte {#_7-experiment}

Meňte vždy iba jednu vec, odhadnite výsledok a až potom sa pozrite. Skratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> každú zmenu vrátite.

**Zrušte zaškrtnutie kĺbu.** Rám bude jedenkrát staticky neurčitý. Vodorovná reakcia klesne na polovicu, na 10 kN, momenty v rohoch sa zmenšia na −40 kNm a v strede rozpätia vznikne kladný moment 40 kNm. Uzol 3 sa teraz posunie nadol iba o 12,16 mm namiesto 42,55 mm. Teraz už záleží aj na prierezoch: dajte nosníku tuhší prierez ako stĺpom a momenty v rohoch narastú.

::model-figure{caption="Bez kĺbu: menšia vodorovná reakcia, polovičné momenty v rohoch a kladný moment v strede rozpätia"}
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

**Votknite päty.** Uzlom 1 a 5 dajte symbol **Votknutie**. Vodorovná reakcia vzrastie na 30 kN a v pätách sa objavia momenty 40 kNm (EduBeam ukáže `39,99`, pretože sa stĺpy nepatrne skrátia), momenty v rohoch však zostanú 80 kNm. Zo symetrie je priečna sila v kĺbe nulová, takže každá polovica nosníka stále pôsobí ako konzola dĺžky 4 m votknutá v rohu: $q \cdot 4^2/2 = 80$ kNm.

**Zatlačte do strany.** Vráťte pätám pevné kĺby a v uzle 2 pridajte uzlové zaťaženie `Fx = 10` kN. Reakcie prestanú byť symetrické: zvisle 35 kN a 45 kN, vodorovne 15 kN a 25 kN. Overte ich rovnakými tromi rovnicami a podmienkou $M_3 = 0$; sila v uzle 2 nemá k uzlu 3 žiadne rameno. Moment v ľavom rohu sa zmení na −60 kNm a ľavá polovica nosníka sa teraz mierne prehne nadol, kladným momentom 1,25 kNm vo vzdialenosti 0,5 m od kĺbu.

::model-figure{caption="Vodorovná sila 10 kN v uzle 2: pravý roh teraz prenáša 100 kNm"}
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

**Pridajte druhý kĺb.** Zaškrtnite aj kĺb na začiatku prvku 2, v uzle 2. Dva kĺby v nosníku na dvoch kĺbovo uložených stĺpoch tvoria mechanizmus. EduBeam nezobrazí žiadne výsledky, vypíše *Kĺby v uzloch 2, 3 umožňujú pohyb konštrukcie.* a pohyb ukáže animáciou.

## Čo ďalej {#next-steps}

::card-grid{cols="2"}
:::card{title="Precvičovanie: trojkĺbové rámy" icon="lucide:dices" to="/sk/practice?p=H2048"}
Rovnaký rám s novými zaťaženiami, medzi nimi aj s vodorovnou silou, a s okamžitou kontrolou vašich odpovedí. Začnite úlohou H2048; ďalšie dostanete, keď ponecháte vybraný iba typ **Trojkĺbový rám** a stlačíte **Nová úloha**.
:::
:::card{title="Ďalej: rovinná priehradová konštrukcia" icon="lucide:git-fork" to="/sk/tutorials/truss"}
Deväť kĺbovo pripojených prútov: uzlová metóda, priesečná metóda, nulový prút a priehyb princípom virtuálnych prác.
:::
::
