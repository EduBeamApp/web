---
description: "Výsledky v EduBeamu: průběhy N, V a M, deformovaný tvar a reakce, jejich znaménka, hodnoty po najetí myší, tabulky výsledků, export CSV, matice tuhosti a formát čísel."
source: site
---

# Výsledky a průběhy

[EduBeam]{.edubeam} přepočítá model po každé změně, takže průběhy, reakce i tabulky na obrazovce vždy patří k modelu, který právě vidíte. Tlačítko *Vypočítat* tu nenajdete. Když se nic nevykreslí, model zatím nelze vyřešit: důvod vám řekne hlášení vlevo nahoře v zobrazení a všechna hlášení vysvětluje stránka [Řešení problémů](/cs/reference/troubleshooting).

## Vrstvy v zobrazení {#overlays-in-the-viewer}

Výsledky se kreslí přes model. Zapínáte a vypínáte je v **možnostech zobrazení** vpravo nahoře v zobrazení; tlačítkem ⚙ nad nimi panel zobrazíte nebo skryjete.

::model-figure{caption="Trojkloubový rám, 10 kN/m: přepínejte mezi M, V, N a deformovaným tvarem"}
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

| Přepínač | Co vykreslí | Barva | Zapnutý na začátku |
| --- | --- | --- | --- |
| **Deformovaný tvar** | přetvořenou konstrukci, zvětšenou tak, aby byla vidět | šedá | ano |
| **N (x)** | normálovou sílu | modrá | |
| **V<sub>z</sub> (x)** | posouvající sílu | zelená | |
| **M<sub>y</sub> (x)** | ohybový moment | červená | ano |
| **Reakce** | šipku a hodnotu v každém podepřeném směru | fialová | ano |

Druhá řada zapíná a vypíná části výkresu: **Podpory**, **Zatížení**, **Popisky uzlů** a **Popisky prvků**. Tlačítko **Všechna nastavení** pod panelem otevře [nastavení zobrazení](/cs/essentials/units-settings#viewer-settings). Tam nastavíte velikost průběhů (*Měřítko výsledků*), barvy, orientaci popisků a styl průběhů.

Hodnoty se vypisují tam, kde na nich záleží: na koncích každého prvku, po obou stranách skoku pod osamělou silou nebo nad podporou a v každém extrému průběhu, například ve vrcholu paraboly, kde $V = 0$. Obrázek nahoře ukazuje [trojkloubový rám](/cs/tutorials/three-hinged-frame), který si můžete ověřit ručně: v každém sloupu je tlaková síla 40 kN, v příčli 20 kN a v obou rozích ohybový moment −80 kNm. V pohledu *w* je vidět, že kloub C poklesne o 42,55 mm.

### Jak číst znaménko {#reading-the-sign}

Znaménko čtěte z **hodnoty**, ne podle toho, na kterou stranu prvku se průběh vykreslil. Konvence jsou stejné jako ve většině učebnic:

| Výsledek | Kladná hodnota znamená |
| --- | --- |
| **N** | tah |
| **V<sub>z</sub>** | že síla otáčí krátkým úsekem prvku ve směru hodinových ručiček. Protože $V = \mathrm{d}M/\mathrm{d}x$, je u prostého nosníku zatíženého směrem dolů kladná u levé podpory a záporná u pravé |
| **M<sub>y</sub>** | tah v dolních vláknech, tedy na straně **čárkované čáry**, která se kreslí podél každého prvku |

Nosník s převislým koncem ukazuje obě znaménka naráz. Mezi podporami je ohybový moment kladný (+13,5 kNm), nad pravou podporou záporný (−24 kNm) a tažená vlákna jsou nahoře. Posouvající síla v bodě B skočí o reakci 54 kN, z −30 na +24 kN:

::model-figure{caption="Nosník s převislým koncem, 12 kN/m: mezi podporami kladný moment, nad podporou B záporný"}
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

Ve výchozím stavu se ohybový moment kreslí na **tažené straně** a kladná normálová i posouvající síla na straně odvrácené od čárkované čáry. Zvyklosti se ale škola od školy liší, a proto můžete každý průběh překlopit v **Nastavení → Nastavení zobrazení → Průběhy vnitřních sil**. Tam také můžete průběhy šrafovat jako při ručním kreslení a ke každému úseku připsat stupeň jeho polynomu. Překlopení mění jen kresbu, nikdy hodnoty. Úplné znaménkové konvence včetně lokálních os prvku najdete v [teoretickém manuálu](/cs/elements/conventions#internal-forces).

## Popisky po najetí myší {#hover-tooltips}

Když na objekt najedete myší, zobrazí se jeho hodnoty:

- **Uzel**: posuny $u_x$, $u_z$ (v jednotce posunu) a pootočení $\varphi_y$ (v radiánech).
- **Prvek**: označení, průřez a materiál.
- **Zatížení**: jeho složky.

Na dotykové obrazovce na objekt klepněte: stejné údaje uvidíte v jeho panelu.

![Najetí myší na uzel 2 nosníku z Rychlého startu](/screenshots/cs/ui-hover.webp){.shot-sm}

## Záložka Výsledky {#results-tab}

Záložka **Výsledky** ve spodní liště obsahuje dvě tabulky. Přepínáte mezi nimi tlačítky **Výsledky v uzlech** a **Výsledky na prvcích**.

### Výsledky v uzlech {#nodal-results}

Každý uzel má jeden řádek s posuny **D<sub>x</sub>** a **D<sub>z</sub>** (v jednotce posunu) a pootočením **R<sub>y</sub>** (v radiánech). Hodnoty jsou v globálních osách: kladné D<sub>z</sub> míří dolů a kladné R<sub>y</sub> je pootočení proti směru hodinových ručiček při pohledu na obrazovku. V podepřeném směru je 0, nebo posun, který jste předepsali. Reakce v této tabulce nejsou: odečtete je z výkresu nebo z [exportu CSV](#export-csv-and-copy).

![Výsledky v uzlech trojkloubového rámu z obrázku výše, Formát čísel: Automatický](/screenshots/cs/p2c-results-nodal.webp){.shot-lg}

### Výsledky na prvcích {#element-results}

Každý prvek má jeden řádek s **koncovými silami v lokálním souřadném systému prvku**:

| Sloupec | Význam |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | normálová síla, posouvající síla a moment, které působí na prvek v jeho **počátečním** uzlu |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | totéž v **koncovém** uzlu |

![Výsledky na prvcích trojkloubového rámu: koncové síly jeho čtyř prvků](/screenshots/cs/p2c-results-element.webp)

Koncové síly jsou síly, kterými uzly působí na prvek. Řídí se lokálními osami, nikoli znaménkovou konvencí průběhů N-V-M, a proto mají jiná znaménka:

- **Prostý nosník** (6 m, 12 kN/m, z [Rychlého startu](/cs/guide/quick-start)): Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. Obě podpory tlačí nosník nahoru, tedy ve směru −z.
- **Konzola** vetknutá v počátečním uzlu, na volném konci síla 18 kN dolů: Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **Sloup 1 rámu** (A dole, B nahoře): X<sub>12</sub> = +40 kN tlačí do prvku ve směru lokální osy x, sloup je tedy tlačený silou 40 kN.

Více o této tabulce najdete v [teoretickém manuálu](/cs/elements/conventions#end-forces-element-results-table).

### Export CSV a kopírování {#export-csv-and-copy}

**Exportovat CSV** stáhne soubor `edubeam-results.csv` s oběma tabulkami v jednotkách, které vidíte na obrazovce, připravený pro tabulkový procesor. **Kopírovat** uloží tytéž tabulky do schránky jako text oddělený tabulátory, který vložíte přímo do Excelu, LibreOffice nebo Tabulek Google.

| Tabulka | Sloupce |
| --- | --- |
| Uzly | `Node`, `x`, `z`, `Dx`, `Dz`, `Ry` a **reakce** `Rx`, `Rz`, `My` |
| Prvky | `Element`, `Node 1`, `Node 2` a koncové síly `N1`, `V1`, `M1`, `N2`, `V2`, `M2` |

Záhlaví sloupců jsou v souboru anglicky a každé uvádí jednotku, například `Dz [mm]`. Koncové síly prvků jsou tytéž lokální hodnoty jako X<sub>12</sub> … M<sub>21</sub> na obrazovce.

### Matice tuhosti {#stiffness-matrix}

V panelu prvku nebo tlačítkem v jeho řádku tabulky *Prvky* zvolte **Matice tuhosti**. Otevře se matice tuhosti prvku 6 × 6 v **globálních souřadnicích** a jednotkách SI (N, m). Hodí se pro kontrolu ručního sestavení v kurzu deformační metody; vzorce najdete v [teoretickém manuálu](/cs/elements/beam).

## Formát čísel {#number-format}

Tabulky a popisky po najetí myší ukazují výsledky s pěti platnými číslicemi. Jak se zapisují, určuje **Nastavení → Jazyk a prostředí → Formát čísel**:

| Formát | 40 000 se zapíše jako | Hodí se pro |
| --- | --- | --- |
| **Vědecký** (výchozí) | 4 · 10⁴ | hodnoty, které se liší o mnoho řádů |
| **Inženýrský** | 40 · 10³ | odečítání předpon kilo a mega |
| **Automatický** | 40 000 | běžná čísla ve výuce |

*Automatický* formát zapisuje hodnoty od 0,001 do 100 000 jako obyčejná čísla. Mimo tento rozsah je zapisuje stejně jako *Inženýrský*, s mocninami deseti po třech řádech, například 380,95 · 10⁻⁹ ve výsledcích v uzlech výše. Desetinný oddělovač se řídí zvoleným jazykem.

Popisky ve výkresu (hodnoty průběhů a reakce) mají vždy dvě desetinná místa bez ohledu na formát čísel: 6,6667 kN se zobrazí jako 6,67. Když potřebujete víc číslic, podívejte se do tabulek nebo do popisků po najetí myší.

## Přesnost výpočtu {#precision-and-accuracy}

- Pro lineární Timošenkův model je nosníkový prvek přesný při uzlovém, rovnoměrném, lineárně proměnném, osamělém i teplotním zatížení. Výsledky proto **nezávisejí** na počtu prvků a žádnou síť není potřeba zjemňovat.
- Výpočet probíhá ve dvojnásobné přesnosti. Hodnota menší než biliontina největší hodnoty stejného druhu je zaokrouhlovací chyba a tabulky ji ukazují jako 0.
- Průhyby zahrnují **smykovou deformaci**, která ve staticky neurčité konstrukci mírně posune i vnitřní síly. U štíhlých prvků přidá k průhybu podle Bernoulliho–Navierovy teorie zlomek procenta, u krátkých a vysokých prvků může dosáhnout deseti i více procent. Kapitola [Ověření výsledků ručně](/cs/guide/verification#shear-deformation) ukazuje, jak je velká a jak ji vypnout, když chcete výsledky porovnat se vzorci z učebnice.

## Výsledky ve zprávě {#results-in-a-report}

- **☰ → Exportovat obrázek** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) uloží výkres se zvolenými průběhy jako PNG nebo SVG. Viz [Export obrázku](/cs/essentials/import-export#export-an-image).
- Čísla získáte tlačítkem **Exportovat CSV** nebo **Kopírovat** v záložce Výsledky.
- **Sdílet konstrukci** vytvoří odkaz, kterým si čtenář otevře přímo model.
- Pro skripta a zadání cvičení nakreslí tytéž průběhy z kódu knihovna [@edubeam/plot](/cs/plot).
