---
description: "Výsledky v EduBeame: priebehy N, V a M, deformovaný tvar a reakcie, ich znamienka, hodnoty pri kurzore, tabuľky výsledkov, export CSV a matica tuhosti."
source: site
---

# Výsledky a priebehy

[EduBeam]{.edubeam} prepočíta model po každej zmene, takže priebehy, reakcie aj tabuľky na obrazovke vždy patria k modelu, ktorý práve vidíte. Tlačidlo *Vypočítať* tu nenájdete. Keď sa nič nevykreslí, model zatiaľ nemožno vyriešiť: dôvod vám povie hlásenie vľavo hore v zobrazení a všetky hlásenia vysvetľuje stránka [Riešenie problémov](/sk/reference/troubleshooting).

## Vrstvy v zobrazení {#overlays-in-the-viewer}

Výsledky sa kreslia priamo na model. Zapínate a vypínate ich v **možnostiach zobrazenia** vpravo hore v zobrazení; tlačidlom ⚙ nad nimi panel zobrazíte alebo skryjete.

::model-figure{caption="Trojkĺbový rám, 10 kN/m: prepínajte medzi M, V, N a deformovaným tvarom"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, V, N, w]
show: [nodeLabels]
height: 300
---
::

| Prepínač | Čo vykreslí | Farba | Predvolene zapnutý |
| --- | --- | --- | --- |
| **Deformovaný tvar** | pretvorenú konštrukciu, zväčšenú tak, aby bola vidieť | sivá | áno |
| **N (x)** | normálovú silu | modrá | |
| **V<sub>z</sub> (x)** | priečnu silu | zelená | |
| **M<sub>y</sub> (x)** | ohybový moment | červená | áno |
| **Reakcie** | šípku a hodnotu v každom podopretom smere | fialová | áno |

Druhý rad zapína a vypína časti výkresu: **Podpery**, **Zaťaženie**, **Popisy uzlov** a **Popisy prvkov**. Tlačidlo **Všetky nastavenia** pod panelom otvorí [nastavenia zobrazenia](/sk/essentials/units-settings#viewer-settings). Tam nastavíte veľkosť priebehov (*Mierka výsledkov*), farby, orientáciu popisov a štýl priebehov.

Hodnoty sa vypisujú tam, kde na nich záleží: na koncoch každého prvku, po oboch stranách skoku pod osamelou silou alebo nad podperou a v každom extréme priebehu, napríklad vo vrchole paraboly, kde $V = 0$. Obrázok hore ukazuje [trojkĺbový rám](/sk/tutorials/three-hinged-frame), ktorý si môžete overiť ručne: v každom stĺpe je tlaková sila 40 kN, v nosníku 20 kN a v oboch rohoch ohybový moment −80 kNm. V pohľade *w* vidno, že kĺb C poklesne o 42,55 mm.

### Ako čítať znamienko {#reading-the-sign}

Znamienko čítajte z **hodnoty**, nie podľa toho, na ktorú stranu prvku sa priebeh vykreslil. Konvencie sú rovnaké ako vo väčšine učebníc:

| Výsledok | Kladná hodnota znamená |
| --- | --- |
| **N** | ťah |
| **V<sub>z</sub>** | že sila otáča krátkym úsekom prvku v smere hodinových ručičiek. Keďže $V = \mathrm{d}M/\mathrm{d}x$, je pri prostom nosníku zaťaženom smerom nadol kladná pri ľavej podpere a záporná pri pravej |
| **M<sub>y</sub>** | ťah v dolných vláknach, teda na strane **čiarkovanej čiary**, ktorá sa kreslí pozdĺž každého prvku |

Nosník s previslým koncom ukazuje obe znamienka naraz. Medzi podperami je ohybový moment kladný (+13,5 kNm), nad pravou podperou záporný (−24 kNm) a ťahané vlákna sú hore. Priečna sila v bode B skočí o reakciu 54 kN, z −30 na +24 kN:

::model-figure{caption="Nosník s previslým koncom, 12 kN/m: medzi podperami kladný moment, nad podperou B záporný"}
---
nodes: { A: [0, 0], B: [4, 0], C: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

Predvolene sa ohybový moment kreslí na **ťahanej strane** a kladná normálová aj priečna sila na strane odvrátenej od čiarkovanej čiary. Zvyklosti sa však na rôznych školách líšia, a preto môžete každý priebeh preklopiť v časti **Nastavenia → Nastavenia zobrazenia → Priebehy vnútorných síl**. Tam tiež môžete priebehy šrafovať ako pri ručnom kreslení a ku každému úseku pripísať stupeň jeho polynómu. Preklopenie mení len kresbu, nikdy hodnoty. Úplné znamienkové konvencie vrátane lokálnych osí prvku nájdete v [teoretickej príručke](/sk/elements/conventions#internal-forces).

## Hodnoty pri kurzore {#hover-tooltips}

Keď ukážete myšou na objekt, zobrazia sa jeho hodnoty:

- **Uzol**: posunutia $u_x$, $u_z$ (v jednotke posunutia) a pootočenie $\varphi_y$ (v radiánoch).
- **Prvok**: označenie, prierez a materiál.
- **Zaťaženie**: jeho zložky.

Na dotykovej obrazovke na objekt ťuknite: rovnaké údaje uvidíte v jeho paneli.

![Kurzor na uzle 2 nosníka z Rýchleho štartu](/screenshots/sk/ui-hover.webp){.shot-sm}

## Karta Výsledky {#results-tab}

Karta **Výsledky** v spodnej lište obsahuje dve tabuľky. Prepínate medzi nimi tlačidlami **Výsledky v uzloch** a **Výsledky na prvkoch**.

### Výsledky v uzloch {#nodal-results}

Každý uzol má jeden riadok s posunutiami **D<sub>x</sub>** a **D<sub>z</sub>** (v jednotke posunutia) a pootočením **R<sub>y</sub>** (v radiánoch). Hodnoty sú v globálnych osiach: kladné D<sub>z</sub> smeruje nadol a kladné R<sub>y</sub> je pootočenie proti smeru hodinových ručičiek pri pohľade na obrazovku. V podopretom smere je 0 alebo posunutie, ktoré ste predpísali. Reakcie v tejto tabuľke nie sú: odčítate ich z výkresu alebo z [exportu CSV](#export-csv-and-copy).

![Výsledky v uzloch trojkĺbového rámu z obrázka vyššie, Formát čísel: Automatický](/screenshots/sk/p2c-results-nodal.webp){.shot-lg}

### Výsledky na prvkoch {#element-results}

Každý prvok má jeden riadok s **koncovými silami v lokálnom súradnom systéme prvku**:

| Stĺpec | Význam |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | normálová sila, priečna sila a moment, ktoré pôsobia na prvok v jeho **počiatočnom** uzle |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | to isté v **koncovom** uzle |

![Výsledky na prvkoch trojkĺbového rámu: koncové sily jeho štyroch prvkov](/screenshots/sk/p2c-results-element.webp)

Koncové sily sú sily, ktorými uzly pôsobia na prvok. Riadia sa lokálnymi osami, nie znamienkovou konvenciou priebehov N-V-M, a preto majú iné znamienka:

- **Prostý nosník** (6 m, 12 kN/m, z [Rýchleho štartu](/sk/guide/quick-start)): Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. Obe podpery tlačia nosník nahor, teda v smere −z.
- **Konzola** votknutá v počiatočnom uzle, na voľnom konci sila 18 kN nadol: Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **Stĺp 1 rámu** (A dole, B hore): X<sub>12</sub> = +40 kN tlačí do prvku v smere lokálnej osi x, stĺp je teda tlačený silou 40 kN.

Viac o tejto tabuľke nájdete v [teoretickej príručke](/sk/elements/conventions#end-forces-element-results-table).

### Export CSV a kopírovanie {#export-csv-and-copy}

**Exportovať CSV** stiahne súbor `edubeam-results.csv` s oboma tabuľkami v jednotkách, ktoré vidíte na obrazovke, pripravený pre tabuľkový procesor. **Kopírovať** uloží tie isté tabuľky do schránky ako text oddelený tabulátormi, ktorý vložíte priamo do Excelu, LibreOffice alebo Tabuliek Google.

| Tabuľka | Stĺpce |
| --- | --- |
| Uzly | `Node`, `x`, `z`, `Dx`, `Dz`, `Ry` a **reakcie** `Rx`, `Rz`, `My` |
| Prvky | `Element`, `Node 1`, `Node 2` a koncové sily `N1`, `V1`, `M1`, `N2`, `V2`, `M2` |

Záhlavia stĺpcov sú v súbore po anglicky a každé uvádza jednotku, napríklad `Dz [mm]`. Koncové sily prvkov sú tie isté lokálne hodnoty ako X<sub>12</sub> … M<sub>21</sub> na obrazovke.

### Matica tuhosti {#stiffness-matrix}

V paneli prvku alebo tlačidlom v jeho riadku tabuľky *Prvky* zvoľte **Matica tuhosti**. Otvorí sa matica tuhosti prvku 6 × 6 v **globálnych súradniciach** a jednotkách SI (N, m). Hodí sa na kontrolu ručne zostavenej matice na cvičeniach z deformačnej metódy; vzorce nájdete v [teoretickej príručke](/sk/elements/beam).

## Formát čísel {#number-format}

Tabuľky a hodnoty pri kurzore ukazujú výsledky s piatimi platnými číslicami. Ako sa zapisujú, určuje **Nastavenia → Jazyk a prostredie → Formát čísel**:

| Formát | 40 000 sa zapíše ako | Hodí sa na |
| --- | --- | --- |
| **Vedecký** (predvolený) | 4 · 10⁴ | hodnoty, ktoré sa líšia o mnoho rádov |
| **Inžiniersky** | 40 · 10³ | odčítanie predpôn kilo a mega |
| **Automatický** | 40 000 | bežné čísla vo výučbe |

*Automatický* formát zapisuje hodnoty od 0,001 do 100 000 ako obyčajné čísla. Mimo tohto rozsahu ich zapisuje rovnako ako *Inžiniersky*, s mocninami desiatich v krokoch po troch rádoch, napríklad 380,95 · 10⁻⁹ vo výsledkoch v uzloch vyššie. Desatinný oddeľovač sa riadi zvoleným jazykom.

Popisy vo výkrese (hodnoty priebehov a reakcie) majú vždy dve desatinné miesta bez ohľadu na formát čísel: 6,6667 kN sa zobrazí ako 6,67. Keď potrebujete viac číslic, pozrite sa do tabuliek alebo na hodnoty pri kurzore.

## Presnosť výpočtu {#precision-and-accuracy}

- Pre lineárny Timošenkov model je nosníkový prvok presný pri uzlovom, rovnomernom, lineárne sa meniacom, osamelom aj teplotnom zaťažení. Výsledky preto **nezávisia** od počtu prvkov a nie je potrebné zjemňovať žiadnu sieť.
- Výpočet prebieha v dvojnásobnej presnosti. Hodnota menšia ako biliontina najväčšej hodnoty rovnakého druhu je chyba zaokrúhlenia a tabuľky ju ukazujú ako 0.
- Priehyby zahŕňajú **šmykové deformácie**, ktoré v staticky neurčitej konštrukcii mierne posunú aj vnútorné sily. Pri štíhlych prvkoch pridajú k priehybu podľa Bernoulliho–Navierovej teórie zlomok percenta, pri krátkych a vysokých prvkoch môžu dosiahnuť desať aj viac percent. Kapitola [Ručné overenie výsledkov](/sk/guide/verification#shear-deformation) ukazuje, aké sú veľké a ako ich vypnúť, keď chcete výsledky porovnať so vzorcami z učebnice.

## Výsledky v správe {#results-in-a-report}

- **☰ → Exportovať obrázok** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) uloží výkres so zvolenými priebehmi ako PNG alebo SVG. Pozrite časť [Export obrázka](/sk/essentials/import-export#export-an-image).
- Čísla získate tlačidlom **Exportovať CSV** alebo **Kopírovať** na karte Výsledky.
- **Zdieľať konštrukciu** vytvorí odkaz, ktorým si čitateľ otvorí priamo model.
- Pre skriptá a zadania cvičení nakreslí tie isté priebehy z kódu knižnica [@edubeam/plot](/sk/plot).
