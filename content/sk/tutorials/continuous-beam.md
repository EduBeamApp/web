---
description: "Návod: spojitý nosník s dvoma poľami v EduBeame – porovnanie s dvoma prostými nosníkmi, pokles strednej podpery a kontrola silovou metódou. Asi 25 minút."
source: site
---

# Návod: spojitý nosník a pokles podpery

Vymodelujete nosník spojitý cez dve polia, porovnáte ho s dvoma prostými nosníkmi a potom necháte jeho strednú podperu poklesnúť o 10 mm. Reakcie tohto nosníka zo samotných podmienok rovnováhy neurčíte, a preto ich overíte silovou metódou.

- **Čas:** asi 25 minút. Je to posledný a najobsažnejší zo štyroch návodov.
- **Potrebujete:** EduBeam otvorený v druhej karte prehliadača, na počítači s myšou a klávesnicou. Ak ste s EduBeamom ešte nepracovali, prejdite si najprv [Rýchly štart](/sk/guide/quick-start) alebo niektorý z predchádzajúcich návodov.
- **Predpoklady:** silová metóda pre jedenkrát staticky neurčitú konštrukciu a priehyby prostého nosníka v strede rozpätia: $5qL^4/(384EI)$ od rovnomerného spojitého zaťaženia a $FL^3/(48EI)$ od osamelej sily.
- **Jednotky:** SI. Štítok jednotiek vpravo dole v zobrazení má ukazovať `m m² kN kNm MPa`. Ak ukazuje stopy a kipy, kliknite naň a v poli **Sústava jednotiek** zvoľte **SI (metrická)**.

**Naučíte sa**

- posúdiť, čo prináša spojitosť: menšie momenty a priehyby ako pri prostých nosníkoch,
- predpísať pokles podpery a odčítať sily, ktoré pokles vyvolá sám osebe,
- overiť staticky neurčitý nosník silovou metódou a vysvetliť, prečo tuhší nosník trpí poklesom podpery viac.

::div{.actions}
[Otvoriť EduBeam ↗](https://run.edubeam.app/?lang=sk){target="_blank"} [Prejsť na ručnú kontrolu](#check-by-hand)
::

::model-figure{caption="Hotový nosník: dve polia po 6 m so zaťažením 10 kN/m, pred poklesom podpery"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels, dimensions]
---
::

## Zadanie {#the-problem}

- Dve polia s rozpätím $L = 6$ m: pevný kĺb v uzle 1, posuvné kĺby v uzloch 2 a 3.
- Rovnomerné spojité zaťaženie $q = 10$ kN/m v oboch poliach.
- Oceľ, $E = 210$ GPa, a $I_y = 8{,}356 \times 10^{-5}$ m⁴ (IPE 300), takže $EI = 17\,547{,}6$ kNm².
- V druhej časti návodu poklesne stredná podpera, uzol 2, o $\Delta = 10$ mm.

**Je konštrukcia staticky určitá?** Štyri zložky reakcií (dve v uzle 1, po jednej v uzloch 2 a 3) proti trom podmienkam rovnováhy: nosník je jedenkrát staticky neurčitý. Chýbajúcu rovnicu dodá deformačná podmienka: uzol 2 sa neposunie alebo sa posunie presne o $\Delta$.

## Zostavte model {#model-it}

::div{.steps}

### Materiál a prierez {#material-and-section}

1. V hornej lište aplikácie kliknite na **Vymazať konštrukciu**, zaškrtnite **Vymazať materiály** a **Vymazať prierezy** a kliknite na **Potvrdiť**. Uzly a prvky sa potom znova číslujú od 1.
2. Karta **Materiály** → **Knižnica materiálov** → **+** v riadku **Oceľ (S235)**; knižnicu potom zatvorte tlačidlom **Zrušiť**.
3. Karta **Prierezy** → **Pridať prierez**. Do poľa **Iy** napíšte `8.356e-5`, polia **Plocha**, **Výška** a **Šmykový súčiniteľ** ponechajte na hodnote `1` a kliknite na **Pridať prierez**.

Plocha 1 m² zaistí, že sa nosník znateľne šmykovo nepretvorí, ako predpokladá ručný výpočet. Tentoraz $I_y$ ovplyvní aj sily: uvidíte, kde.

### Nakreslite nosník {#draw-the-beam}

1. Karta **Prvky** → druhé tlačidlo **Pridať prvok**, to s ikonou kurzora.
2. Kliknite do bodov (0, 0), (6, 0) a (12, 0).
3. Klávesom <kbd>Esc</kbd> kreslenie ukončíte a klávesom <kbd>F</kbd> zobrazíte celý model.

Vzniknú tri uzly a dva prvky. Súradnice skontrolujte v tabuľke **Uzly**.

### Podpery {#supports}

Kliknite na uzol 1 → **Podpery uzla** → symbol **Pevný kĺb**. Uzlom 2 a 3 dajte **Posuvný kĺb**.

### Zaťaženie {#load}

Karta **Zaťaženie** → **Pridať prvkové zaťaženie** → *Rovnomerné spojité zaťaženie* na **Prvok** `1`, `fz = 10` → **Pridať prvkové zaťaženie**. To isté zopakujte pre prvok 2.

::

## Výsledky {#results}

Ohybový moment, reakcie a deformovaný tvar sú zapnuté od začiatku. Priečnu silu pridáte zaškrtnutím **V<sub>z</sub> (x)** v možnostiach zobrazenia vpravo hore v okne konštrukcie (ozubeným kolieskom ich zobrazíte a skryjete). EduBeam popisuje priebehy a reakcie v kN a kNm na dve desatinné miesta.

- Reakcie majú popisy `22,50` v uzloch 1 a 3 a `75,00` v uzle 2: stredná podpera nesie viac ako polovicu zo 120 kN.
- Moment nad uzlom 2 má popis `-45,00`, je teda záporný. V poliach dosahuje kladný moment najviac `25,31` kNm, vo vzdialenosti 2,25 m od krajných podpier.
- Priečna sila sa nad uzlom 2 skokom zmení z `-37,50` na `37,50`.

### Porovnanie s dvoma prostými nosníkmi {#compare-with-two-simple-spans}

Čo prináša spojitosť? Prerušte ju: v tabuľke **Prvky** zaškrtnite kĺb na **konci** prvku 1, v uzle 2. Z nosníka sa stanú dva prosté nosníky s rozpätím 6 m, teda staticky určitá konštrukcia.

::model-figure{caption="S kĺbom nad uzlom 2: dva prosté nosníky, každý s qL²/8 = 45 kNm"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [{ nodes: [1, 2], hinges: [false, true] }, [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

| | Spojitý nosník | Dva prosté nosníky |
| --- | --- | --- |
| Reakcie v uzloch 1, 2, 3 | 22,5; 75; 22,5 kN | 30; 60; 30 kN |
| Moment nad uzlom 2 | −45 kNm | 0 |
| Najväčší kladný moment | 25,31 kNm | 45 kNm |
| Najväčší priehyb (v pohľade $w(x)$ na obrázkoch) | 4,000 mm | 9,617 mm |

Najväčší moment je v oboch prípadoch 45 kNm, pri spojitom nosníku sa však presunie nad podperu a polia sa prehýbajú oveľa menej. Každé pole je navyše 2,4-krát tuhšie: jeho koniec nad uzlom 2 sa nemôže pootočiť, takmer akoby bol votknutý. Skôr ako budete pokračovať, zaškrtnutie kĺbu opäť zrušte.

## Pokles strednej podpery {#settle-the-middle-support}

Teraz nechajte uzol 2 poklesnúť o 10 mm, ako sa to môže stať základu na mäkkom podloží.

::div{.steps}

### Predpíšte pokles {#prescribe-the-settlement}

Kliknite na uzol 2 → **Predpísať posunutie**. V dialógu je už vybrané **Predpísané posunutie**; do poľa **Dz** napíšte `0.01` a kliknite na **Pridať uzlové zaťaženie**.

![Dialóg predpísaného posunutia: nastaviť možno iba Dz, teda smer, v ktorom posuvný kĺb drží](/screenshots/sk/p2t-prescribe-displacement.webp){.shot-sm}

V predvolených jednotkách SI sa posunutia zadávajú v metroch, takže 10 mm je `0.01`; kladné posunutie smeruje nadol. Nastaviť možno iba podopreté smery: posuvný kĺb môžete posunúť nadol, ale nie do strany. Viac nájdete v kapitole [Predpísané posunutia](/sk/essentials/loads#prescribed-displacements-support-settlements).

### Nové výsledky {#read-the-new-results}

Stredná reakcia klesne na `70,13` kN a krajné reakcie vzrastú na `24,94` kN. Moment nad uzlom 2 sa zmenší na `-30,38` kNm a polia sa prehýbajú viac, kladný moment dosiahne až `31,09` kNm.

::model-figure{caption="Uzol 2 poklesol o 10 mm: záporný moment nad ním sa zmenší a polia prenášajú viac"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

### Samotný pokles {#look-at-the-settlement-alone}

Vymažte obe prvkové zaťaženia: každé vyberte a stlačte <kbd>Delete</kbd> alebo kliknite na × v jeho riadku tabuľky **Zaťaženie**. Zostane účinok samotného poklesu: trojuholníkový priebeh kladného momentu s hodnotou `14,62` kNm nad uzlom 2 a reakcie, ktoré uzol 2 ťahajú **nadol** silou `4,87` kN, zatiaľ čo v uzloch 1 a 3 tlačia nahor, každá silou `2,44` kN. Nosník sa bráni ohnutiu do tvaru, ktorý mu pokles vnúti, a namáha ho iba tento odpor.

::model-figure{caption="Samotný pokles podpery: žiadne zaťaženie, a predsa je nosník ohnutý a podpery reagujú"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, w]
show: [nodeLabels]
---
::

Keď tieto hodnoty pripočítate k výsledkom od samotného zaťaženia, dostanete zaťažený nosník s poklesom podpery: 75 − 4,87 = 70,13 kN, −45 + 14,62 = −30,38 kNm. Výpočet je lineárny, takže účinky môžete sčítať.

### Znova prerušte spojitosť {#cut-the-continuity-again}

Zaťaženia vráťte skratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd>, raz za každé vymazané zaťaženie, a znova zaškrtnite kĺb na konci prvku 1. Polia sa teraz po poklese iba natočia: reakcie aj momenty sú presne ako pri dvoch prostých nosníkoch, nech je pokles akýkoľvek, a bez zaťaženia by boli nulové. **Pokles podpery vyvolá vnútorné sily iba v staticky neurčitej konštrukcii.** Skôr ako budete pokračovať, zaškrtnutie kĺbu zrušte.

::

## Kontrola ručným výpočtom {#check-by-hand}

Použite silovú metódu. Odstráňte podperu v uzle 2 a nahraďte ju neznámou reakciou $R_2$, ktorá pôsobí nahor na prostý nosník s rozpätím $2L = 12$ m.

**Priehyby uvoľneného nosníka v uzle 2** od zaťaženia a od jednotkovej sily pôsobiacej v uzle 2 nahor:

$$
\delta_q = \frac{5q\,(2L)^4}{384\,EI} = \frac{5 \cdot 10 \cdot 12^4}{384 \cdot 17\,547{,}6} = 0{,}15387\ \text{m}
$$

$$
\delta_{1} = \frac{(2L)^3}{48\,EI} = \frac{12^3}{48 \cdot 17\,547{,}6} = 0{,}0020516\ \text{m/kN}
$$

**Deformačná podmienka.** Reakcia $R_2$ musí uzol 2 zatlačiť späť nahor tak, aby ležal tam, kde je podpera: v nule alebo o $\Delta$ nižšie.

$$
R_2\,\delta_1 = \delta_q - \Delta \quad\Rightarrow\quad R_2 = \frac{\delta_q - \Delta}{\delta_1}
$$

**Všetko ostatné** vyplýva z podmienok rovnováhy; najväčší kladný moment leží tam, kde je priečna sila $R_1 - qx$ nulová.

| | Vzorec | Bez poklesu | Pokles uzla 2 o 10 mm |
| --- | --- | --- | --- |
| $R_2$ | $(\delta_q - \Delta)/\delta_1$ | 75,00 kN | 70,13 kN |
| $R_1 = R_3$ | $(2qL - R_2)/2$ | 22,50 kN | 24,94 kN |
| $M_2$ | $R_1 L - qL^2/2$ | −45,00 kNm | −30,38 kNm |
| $M_{\max}$ | $R_1^2/(2q)$ | 25,31 kNm | 31,09 kNm |

EduBeam ukazuje tie isté hodnoty do poslednej číslice.

Bez poklesu ide o učebnicové hodnoty $R_2 = 10qL/8$, $M_2 = -qL^2/8$ a $M_{\max} = 9qL^2/128$. Samotný pokles zmení reakcie o $\Delta/\delta_1 = 4{,}874$ kN a moment nad uzlom 2 o

$$
\Delta M_2 = \frac{\Delta}{\delta_1} \cdot \frac{2L}{4} = \frac{3\,EI\,\Delta}{L^2} = \frac{3 \cdot 17\,547{,}6 \cdot 0{,}01}{36} = 14{,}62\ \text{kNm}
$$

Všimnite si, že vo vzorci vystupuje $EI$. Sily od zaťaženia závisia iba od toho, aké tuhé sú prúty *voči sebe navzájom*; sily od vnúteného posunutia rastú so samotnou tuhosťou. Nad klesajúcou podperou si preto tuhší nosník pritiahne väčšie momenty.

## Experimentujte {#experiment}

Začnite od zaťaženého nosníka s poklesom podpery, meňte vždy iba jednu vec, odhadnite výsledok a až potom sa pozrite. Skratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> každú zmenu vrátite.

**Zdvojnásobte tuhosť.** V tabuľke **Prierezy** nastavte **Iy** na `1.6712e-4`. Účinok poklesu na moment nad uzlom 2 sa zdvojnásobí na 29,25 kNm a $M_2$ sa zmenší na −15,75 kNm. Pri samotnom zaťažení by sa nezmenilo nič okrem priehybov, ktoré by sa zmenšili na polovicu.

**Nájdite pokles, ktorý uvoľní uzol 2.** Pri akom $\Delta$ je moment nad uzlom 2 nulový? Na $\Delta M_2 = 45$ kNm treba $\Delta = 45 L^2/(3EI) = qL^4/(24EI) = 0{,}0308$ m. Zmeňte pokles na `0.0308`, v tabuľke **Zaťaženie** alebo dvojklikom naň v zobrazení: reakcie budú 30, 60 a 30 kN, rovnako ako pri dvoch prostých nosníkoch, až na zaokrúhlenie $\Delta$. Výraz $qL^4/(24EI)$ je pootočenie konca prostého nosníka krát $L$: pokles natočí každé pole práve tak, aby sa zlom nad uzlom 2 vyrovnal, a spojitosť už nemá čo prenášať.

**Pustite uzol 2.** Zmeňte pokles na `0.1539`, teda na priehyb $\delta_q$ uvoľneného nosníka dĺžky 12 m. Reakcia v uzle 2 klesne prakticky na nulu a nosník nesie zaťaženie ako jeden prostý nosník: v strede rozpätia je moment 180 kNm. Podpera, ktorá takto poklesne, už nie je podperou.

**Uzol 2 naopak zdvihnite.** Zmeňte pokles na `-0.01`, teda 10 mm nahor. Všetky zmeny spôsobené poklesom obrátia znamienko: uzol 2 teraz nesie 79,87 kN a záporný moment narastie na −59,62 kNm.

Ďalšie kontroly v uzavretom tvare, okrem iného pokles podpery jednostranne votknutého nosníka, nájdete v kapitole [Ručné overenie výsledkov](/sk/guide/verification#prescribed-displacement).

## Čo ďalej {#next-steps}

::card-grid{cols="2"}
:::card{title="Precvičovanie: spojité nosníky" icon="lucide:dices" to="/sk/practice?p=K2049"}
Nosníky s dvoma poľami zaťažené v jednom alebo v oboch poliach, riešené silovou metódou, s okamžitou kontrolou vašich odpovedí. Začnite úlohou K2049; ďalšie dostanete, keď vyberiete iba typ **Spojitý nosník s dvoma poľami** a stlačíte **Nová úloha**.
:::
:::card{title="Galéria príkladov" icon="lucide:library" to="/sk/examples/"}
To bol posledný návod. V galérii príkladov nájdete ďalšie modely, ktoré môžete otvoriť, upraviť a overiť, a k nim námety na cvičenia.
:::
::
