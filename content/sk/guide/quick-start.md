---
description: "Za desať minút vymodelujete v EduBeame prostý oceľový nosník: materiál, prierez, uzly, podpery a zaťaženie. Potom odčítate reakcie a priebehy a overíte ich ručne."
source: site
---

# Rýchly štart

Zhruba za desať minút zostavíte prostý oceľový nosník, odčítate jeho reakcie, priečnu silu, ohybový moment a priehyb a každé číslo overíte ručným výpočtom. Otvorte si EduBeam na ďalšej karte prehliadača alebo vedľa tejto stránky a postupujte s nami.

::div{.actions}
[Otvoriť EduBeam ↗](https://run.edubeam.app/?lang=sk){target="_blank"} [Rovno k ručnému overeniu](#_8-check-by-hand)
::

## Zadanie {#the-problem}

Nosník s rozpätím 6 m je v uzle 1 podopretý pevným kĺbom, v uzle 2 posuvným kĺbom a po celej dĺžke nesie rovnomerné spojité zaťaženie 12 kN/m. Ide o oceľový profil IPE 200: $E = 210$ GPa, $G = 81$ GPa, $A = 28{,}48\ \text{cm}^2$ a $I_y = 1943\ \text{cm}^4$. Všetky štyri hodnoty nájdete v knižniciach EduBeamu, takže nič nemusíte dohľadávať.

::model-figure{caption="Nosník, ktorý zostavíte: rozpätie 6 m od uzla 1 po uzol 2, zaťaženie 12 kN/m"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: []
show: [nodeLabels, dimensions]
---
::

## Zostavenie modelu {#build-the-model}

::div{.steps}

### Začnite s prázdnym modelom {#start-from-an-empty-model}

Pri prvej návšteve sa vás uvítací dialóg opýta, ako chcete začať. V časti **Sústava jednotiek** zvoľte **SI (metrická)**, v časti **Súradný systém** ponechajte **x doprava, z nadol** a kliknite na **Preskočiť**. Aplikácia potom zobrazí malý ukážkový rám.

1. V hornej lište kliknite na **Vymazať konštrukciu** (na telefóne je v ponuke **☰**).
2. Zaškrtnite **Vymazať materiály** a **Vymazať prierezy** a kliknite na **Potvrdiť**.

Plátno je teraz prázdne a dve červené hlásenia upozorňujú, že zatiaľ chýba materiál aj prierez. To napravíte v ďalších krokoch. Nič sa nestratí: skratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> rám vrátite a nájdete ho aj v **☰ → Nedávne konštrukcie**.

### Skontrolujte jednotky {#_1-check-the-units}

Štítok v pravom dolnom rohu zobrazenia ukazuje jednotky všetkých polí a výsledkov. Táto stránka počíta s jednotkami SI, ktoré štítok zobrazí ako `m m² kN kNm MPa`, a s osou z smerujúcou nadol. Ak štítok ukazuje stopy a kipy, kliknite naň a v časti **Sústava jednotiek** zvoľte **SI (metrická)**. Na tom istom mieste musí byť v časti **Súradný systém** zvolené **x doprava, z nadol**: pri osi y nahor smeruje kladné zaťaženie nahor a znamienka by nezodpovedali tejto stránke.

![Prepínače mriežky (G) a prichytávania (S), zameriavací kríž a štítok jednotiek](/screenshots/sk/ui-grid-units.webp){.shot-sm}

### Pridajte materiál a prierez {#_2-add-the-material-and-cross-section}

Každý prvok potrebuje materiál a prierez, preto ich pridajte najskôr, a to z knižníc.

1. V spodnej lište otvorte kartu **Materiály** a kliknite na **Knižnica materiálov**.
2. V riadku **Oceľ (S235)** kliknite na **+** ($E = 210\,000$ MPa, $G = 81\,000$ MPa). Knižnica zostane otvorená pre ďalší výber, preto ju zatvorte tlačidlom **Zrušiť**.
3. Otvorte kartu **Prierezy** a kliknite na **Knižnica prierezov**.
4. Prejdite na riadok **IPE 200 (pribl.)**, kliknite na **+** a knižnicu zatvorte tlačidlom **Zrušiť**.

Obe červené hlásenia zmizli a na karte **Prierezy** je IPE 200:

![IPE 200 na karte Prierezy: plocha, Iy, výška a šmykový súčiniteľ](/screenshots/sk/a-qs-cross-sections.webp)

Ak chcete radšej zadať vlastné hodnoty, použite **Pridať materiál** a **Pridať prierez**. Šmykový súčiniteľ, tu 0,3933, sa ešte objaví v [ručnom overení](#_8-check-by-hand).

### Pridajte uzly {#_3-add-the-nodes}

1. Otvorte kartu **Uzly**. Nájdete na nej dve tlačidlá **Pridať uzol**: **+** otvorí dialóg, tlačidlo s ikonou kurzora slúži na umiestňovanie uzlov myšou. Kliknite na **+ Pridať uzol**.
2. Polia **Súradnica X** a **Súradnica Z** nechajte na `0` a kliknite na **Pridať uzol**. Dialóg sa zatvorí a objaví sa uzol `1`.
3. Znova kliknite na **+ Pridať uzol**, do poľa **Súradnica X** zadajte `6` a kliknite na **Pridať uzol**. To je uzol `2`.

![Dialóg Pridať nový uzol, v ktorom môžete rovno nastaviť aj podpery](/screenshots/sk/qs-node.webp){.shot-md}

### Spojte ich prvkom {#_4-connect-them-with-an-element}

Otvorte kartu **Prvky** a kliknite na **+ Pridať prvok**. Dialóg už predvyplní **Počiatočný uzol** `1`, **Koncový uzol** `2` a váš materiál a prierez. Kliknite na **Pridať prvok**.

![Pridať nový prvok: dva koncové uzly, voliteľný kĺb na každom konci, materiál a prierez](/screenshots/sk/a-qs-element.webp){.shot-md}

Medzi uzlami sa objaví nosník. Klávesom <kbd>F</kbd> ho prispôsobíte obrazovke. Modrý štítok **Chýbajú podpery** vľavo hore v zobrazení vysvetľuje, prečo zatiaľ nie sú žiadne výsledky.

### Pridajte podpery {#_5-add-the-supports}

Vráťte sa na kartu **Uzly**. Každý riadok tu má na začiatku stĺpca **Podopreté stupne voľnosti** výber podpery.

- Uzol `1`: zvoľte **Pevný kĺb**. Tým sa zaškrtnú `Dx` a `Dz`.
- Uzol `2`: zvoľte **Posuvný kĺb**. Zaškrtne sa iba `Dz`.

![Výber podpery v tabuľke Uzly](/screenshots/sk/a-qs-support-picker.webp){.shot-lg}

Štítok **Chýbajú podpery** zmizne. Podperu môžete zadať aj tak, že v zobrazení kliknete na uzol a zvolíte **Podpery uzla**. Všetky typy podpier nájdete v kapitole [Uzly a podpery](/sk/essentials/nodes-supports#supports).

### Pridajte zaťaženie {#_6-add-the-load}

1. Otvorte kartu **Zaťaženie** a kliknite na **Pridať prvkové zaťaženie**.
2. **Typ zaťaženia** ponechajte *Rovnomerné spojité zaťaženie* a **Prvok** `1`.
3. Do poľa **fz** zadajte `12`, **fx** nechajte na `0` a kliknite na **Pridať prvkové zaťaženie**.

![V dialógu vidíte náhľad zaťaženia na prvku](/screenshots/sk/a-qs-load.webp){.shot-md}

Kladné `fz` pôsobí v smere +z, teda **nadol**, takže kladná hodnota zodpovedá tiažovému zaťaženiu. Zaškrtnuté políčko **LCS** znamená, že zaťaženie sleduje vlastné (lokálne) osi prvku; pri vodorovnom nosníku nakreslenom zľava doprava splývajú s globálnymi osami. Pozrite si [znamienkovú konvenciu](/sk/elements/conventions#loads).

::

## Odčítajte výsledky {#_7-read-the-results}

EduBeam nosník vyrieši, len čo zadáte zaťaženie, a potom znova po každej vašej úprave: tlačidlo *Vypočítať* tu nie je. Panel vpravo hore v zobrazení zapína a vypína jednotlivé vrstvy. **Deformovaný tvar**, **M<sub>y</sub>(x)** a **Reakcie** sú zapnuté od začiatku. Priečnu silu pridáte zaškrtnutím **V<sub>z</sub>(x)**.

![Možnosti zobrazenia so zapnutou priečnou silou](/screenshots/sk/a-qs-display.webp){.shot-md}

Obrazovka by teraz mala zodpovedať tomuto obrázku. Prepínajte medzi ohybovým momentom a priečnou silou:

::model-figure{caption="Hotový nosník: reakcie 36 kN a moment 54 kNm v strede rozpätia"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: [M, V]
show: [nodeLabels]
---
::

| Vrstva | Čo by ste mali vidieť |
| --- | --- |
| **Reakcie** | Dve šípky smerujúce nahor, každá **36 kN**, jedna pri každej podpere. |
| **V<sub>z</sub>(x)** | Priamka od **+36 kN** v uzle `1` po **−36 kN** v uzle `2`, nulová v strede rozpätia. |
| **M<sub>y</sub>(x)** | Parabola s maximom **54 kNm** v strede rozpätia, vykreslená na ťahanej strane, teda pod nosníkom. |
| **Deformovaný tvar** | Symetrický priehyb, vykreslený zväčšene. |

Čísla nájdete na karte **Výsledky**. Tabuľka **Výsledky v uzloch** obsahuje posunutia `Dx`, `Dz` a pootočenie `Ry` každého uzla, tabuľka **Výsledky na prvkoch** koncové sily každého prvku v jeho lokálnych osiach. Uzol `1` sa pootočí o $R_y = -2{,}6469 \cdot 10^{-2}$ rad, uzol `2` o rovnakú hodnotu na opačnú stranu. Všetky tabuľky a znamienka vysvetľuje kapitola [Výsledky a priebehy](/sk/essentials/results).

Ak sa vám priebehy zdajú príliš veľké alebo malé, upravte **Mierku výsledkov** cez **Nastavenia → Nastavenia zobrazenia**.

## Overte ručne {#_8-check-by-hand}

Pre $q = 12$ kN/m a $L = 6$ m dávajú učebnicové vzorce:

| Veličina | Vzorec | Ručne | EduBeam |
| --- | --- | --- | --- |
| Reakcie | $qL/2$ | 36 kN | 36 kN |
| Najväčšia priečna sila | $qL/2$ | 36 kN | 36 kN |
| Najväčší moment | $qL^2/8$ | 54 kNm | 54 kNm |
| Pootočenie konca | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Priehyb v strede rozpätia | $w_b + w_s$ | 49,63 + 0,60 = 50,22 mm | 50,22 mm |

Priehyb má dve zložky a väčšina učebníc uvádza iba prvú:

- **Ohyb:** $w_b = 5qL^4/(384EI) = 49{,}63$ mm, kde $EI = 4080$ kNm² vyplýva z $E = 210$ GPa a $I_y = 1943\ \text{cm}^4$.
- **Šmyk:** $w_s = qL^2/(8kGA) = 0{,}60$ mm, kde $kGA \approx 90\,700$ kN vyplýva z $k = 0{,}3933$, $G = 81$ GPa a $A = 28{,}48\ \text{cm}^2$.

V strede rozpätia zatiaľ nie je žiadny uzol. Aby ste tam mohli odčítať priehyb, jeden pridajte:

1. Na karte **Uzly** kliknite na druhé tlačidlo **Pridať uzol**, to s ikonou kurzora.
2. Kliknite na nosník v mieste `x = 3`; so zapnutým prichytávaním padne uzol presne na mriežku. EduBeam sa opýta, čo s uzlom urobiť: zvoľte **Pripojiť ku konštrukcii**. Prvok sa aj so svojím zaťažením rozdelí na `1a` a `1b` a umiestňovanie uzlov sa skončí. Ak uzol `3` na karte **Uzly** nemá X = `3`, prepíšte hodnotu na `3`.
3. Na karte **Výsledky → Výsledky v uzloch** má teraz uzol `3` hodnotu $D_z = 5{,}0224 \cdot 10^{-2}$ m, teda 50,22 mm.

![Výsledky v uzloch po rozdelení: uzol 3 sa posunie o 50,22 mm nadol](/screenshots/sk/a-qs-nodal-results.webp){.shot-lg}

Rozdelenie nosníka nezmení žiadny výsledok, pretože prvok je pre tieto zaťaženia presný: nie je tu žiadna sieť, ktorú by bolo treba zjemňovať.

::callout{type="details" title="Prečo záleží na šmykovom súčiniteli"}
EduBeam používa Timošenkove nosníkové prvky, ktoré zahŕňajú šmykové deformácie. Šmykovým súčiniteľom $k$ sa násobí plocha, ktorá prenáša šmyk, takže šmyková tuhosť je $kGA$. Pri I-profiloch z knižnice je $k$ podiel stojiny na ploche prierezu, $h t_w / A$: pre IPE 200 $0{,}2 \cdot 0{,}0056 / 0{,}002848 = 0{,}3933$. Šmyková časť priehybu, $w_s = qL^2/(8kGA)$, je integrál $V/(kGA)$ od podpery po stred rozpätia.

Pri tomto štíhlom nosníku je šmyková časť 0,60 mm, asi 1 % celku. Pri krátkom a vysokom nosníku je oveľa väčšia. Nastavte na karte **Prierezy** šmykový súčiniteľ na veľmi veľké číslo (napríklad `1e10`) a EduBeam ukáže čisto ohybový priehyb 49,63 mm. Teóriu nájdete na stránke [Nosníkový prvok](/sk/elements/beam).
::

Ďalšie postupy ručnej kontroly (konzola, obojstranne votknutý nosník, priehradová konštrukcia, zmena teploty, pokles podpery) nájdete v kapitole [Ručné overenie výsledkov](/sk/guide/verification).

## Experimentujte {#_9-experiment}

Meňte model a sledujte, ako sa s ním menia priebehy. Skúšajte každú zmenu zvlášť a pred ďalšou ju vráťte skratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Uzol `3` je uzol v strede rozpätia, ktorý ste práve pridali.

- **Presuňte uzol `2`** doprava. Moment rastie s $L^2$, priehyb s $L^4$.
- **Zaškrtnite `Ry` v uzle `1`** a tento koniec votknete. Vo votknutí sa objaví záporný moment: podľa učebnicového vzorca $qL^2/8 = 54$ kNm, v EduBeame 53,8 kNm. Pri staticky neurčitom nosníku totiž šmyková tuhosť ovplyvňuje aj vnútorné sily.
- **Zaškrtnite `Dz` v uzle `3`**, pridáte tým strednú podperu a vznikne spojitý nosník s dvoma poľami. Moment nad strednou podperou bude záporný: ručne $q(L/2)^2/8 = 13{,}5$ kNm, v EduBeame 13,3 kNm, z rovnakého dôvodu.
- **Zaškrtnite `Dz` v uzle `3` a koncový kĺb prvku `1a`**: na karte **Prvky** je to druhé políčko v stĺpci *Koncové kĺby* (koniec prvku v uzle `3`). Z nosníka vzniknú dva prosté nosníky s rozpätím 3 m. Teraz v uzle `3` zrušte zaškrtnutie `Dz`: nosník sa stane mechanizmom a EduBeam ukáže, ako sa môže pohybovať.

Ak si chcete vyskúšať vplyv rozpätia a zaťaženia bez toho, aby ste čokoľvek zostavovali, posúvajte posúvače nižšie a prepínajte medzi výsledkami: uvidíte, ako ktorá veličina rastie s rozpätím.

::example-structure
::

## Uložte alebo zdieľajte {#_10-save-or-share}

- **Pošlite ho niekomu.** V hornej lište kliknite na **Zdieľať konštrukciu** a potom na **Kopírovať odkaz**. Odkaz obsahuje celý model a kto ho otvorí, dostane vlastnú kópiu na úpravy.
- **Uložte si ho do súboru.** **☰ → Uložiť projekt** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) stiahne súbor `project.json`. Znova ho otvoríte cez **☰ → Otvoriť projekt** (<kbd>Ctrl</kbd>+<kbd>O</kbd>) alebo pretiahnutím do aplikácie.
- **Vložte výkres do správy.** **☰ → Exportovať obrázok** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) ho uloží ako PNG alebo SVG.

Model sa tiež priebežne ukladá v prehliadači, takže ho obnovením stránky nestratíte. Podrobnosti nájdete v kapitole [Súbory, odkazy a export](/sk/essentials/import-export).

## Kam ďalej {#where-next}

::card-grid{cols="2"}
:::card{title="Návody" icon="lucide:graduation-cap" to="/sk/tutorials/inclined-beam"}
Štyri modely zostavené krok za krokom a overené ručne, od šikmého nosníka po spojitý nosník s poklesom podpery.
:::
:::card{title="Príklady" icon="lucide:library" to="/sk/examples/"}
Hotové nosníky, rámy a priehradové konštrukcie, ktoré otvoríte jedným kliknutím, s úlohami a výsledkami.
:::
:::card{title="Zaťaženie" icon="lucide:arrow-down-to-line" to="/sk/essentials/loads"}
Lichobežníkové a osamelé zaťaženie, zmena teploty, uzlové sily a poklesy podpier.
:::
:::card{title="Klávesnica, myš a dotyk" icon="lucide:keyboard" to="/sk/reference/shortcuts"}
Kreslite uzly a prvky priamo na plátne a upravujte model rýchlejšie.
:::
::
