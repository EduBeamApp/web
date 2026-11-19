---
description: "Projekty a relace desktopového EduBeamu, sdílení odkazem, vložení živého prohlížeče, parametry URL, export obrázků a tabulek. Vše zůstává ve vašem prohlížeči."
source: site
---

# Soubory, odkazy a export

Model můžete uložit do souboru, poslat odkazem, vložit na webovou stránku nebo z něj exportovat obrázek či tabulku. V [EduBeamu]{.edubeam} se vše odehrává ve vašem prohlížeči a nic se nenahrává na server: sdílený odkaz model doslova obsahuje.

::card-grid{cols="3"}
:::card{title="Soubor projektu" icon="lucide:file-json" to="#save-a-project"}
`project.json` k uschování, odevzdání nebo pozdějšímu otevření.
:::
:::card{title="Sdílený odkaz" icon="lucide:link" to="#share-a-link"}
Celý model v jedné adrese URL pro skripta, prezentace i e-maily.
:::
:::card{title="Obrázek nebo tabulka" icon="lucide:image" to="#export-an-image"}
PNG nebo SVG do technických zpráv, CSV pro tabulkový procesor.
:::
::

## Uložení projektu {#save-a-project}

**☰ → Uložit projekt** nebo <kbd>Ctrl</kbd>+<kbd>S</kbd> (na Macu <kbd>⌘</kbd>+<kbd>S</kbd>, stejně jako u všech zkratek na této stránce) stáhne soubor `project.json`. Obsahuje uzly, prvky, materiály, průřezy (včetně nakreslených tvarů), zatížení, kóty a verzi aplikace, která ho zapsala. Soubor můžete libovolně přejmenovat.

## Otevření projektu {#open-a-project}

Zvolte **☰ → Otevřít projekt** nebo stiskněte <kbd>Ctrl</kbd>+<kbd>O</kbd> a vyberte soubor, případně **soubor přetáhněte kamkoli do okna aplikace**. EduBeam otevře:

- soubory `project.json` uložené kteroukoli verzí EduBeamu;
- relace `.xml` uložené **desktopovým EduBeamem** 2.x až 3.5. Jejich hodnoty nemají jednotky, a proto se čtou v kN, kPa a m, tedy v jednotkách, které používal jeho manuál. EduBeam otevírá vždy jen jeden zatěžovací stav: z relace s více stavy otevře první a vypíše, které vynechal.

Otevřený soubor nahradí aktuální model včetně materiálů a průřezů. Dosavadní model se ale neztratí: vrátíte ho klávesami <kbd>Ctrl</kbd>+<kbd>Z</kbd> a najdete ho také v [Nedávných konstrukcích](#recent-structures). Soubor, který EduBeam neumí přečíst, aplikace s hlášením odmítne a váš model nechá beze změny.

## Sdílení odkazem {#share-a-link}

**Sdílet konstrukci** v horní liště nebo v nabídce ☰ otevře dialog *Sdílejte konstrukci pomocí odkazu*:

![Dialog Sdílejte konstrukci pomocí odkazu](/screenshots/cs/c1-share.webp){.shot-lg}

- **Kopírovat** zkopíruje odkaz do schránky. Stejně funguje kliknutí kamkoli do pole.
- **Otevřít odkaz** ho otevře v nové záložce, abyste viděli, co uvidí příjemce.
- **Sdílet přes systémové dialogové okno** předá odkaz do nabídky sdílení vašeho zařízení, pokud to prohlížeč umí.
- **Kratší odkaz** (ve výchozím stavu zapnutý) zapíše tentýž model zhruba polovinou znaků. EduBeam starší než verze 1.3.2 (listopad 2026) ho přečte až po aktualizaci, takže když musí odkaz hned fungovat všude, volbu vypněte.
- **Zobrazit to, co vidím já** (ve výchozím stavu vypnuté) zajistí, že se odkaz otevře s průběhy, zatížením a popisky, které máte zapnuté vy, a ne s možnostmi zobrazení příjemce.

Odkaz má tvar `https://run.edubeam.app/?model=…` a obsahuje celý zakódovaný model. Kdo ho otevře, dostane vlastní kopii, kterou může upravovat; úpravy se zpět **nesynchronizují**, takže po změně modelu pošlete nový odkaz. Z velmi velkých modelů vznikají velmi dlouhé odkazy; takové modely raději sdílejte jako soubor projektu.

Když někdo odkaz otevře, jeho dosavadní model se přesune do Nedávných konstrukcí a hlášení mu řekne, kde ho najde. Platnost odkazů nikdy nevyprší: odkaz v loňských skriptech dnes otevře tentýž model.

## Vložení prohlížeče {#embed-a-read-only-viewer}

Když ke sdílenému odkazu přidáte `&viewer=1`, model se otevře v **režimu prohlížeče**: horní a spodní lišta, tlačítka zpět a znovu, štítky mřížky a jednotek i zaměřovací kříž jsou skryté a zůstane jen výkres, tlačítka přizpůsobení a vystředění a možnosti zobrazení. Neotevře se ani uvítací dialog, ani přehled novinek (*Co je nového?*). Vložte tuto adresu do `<iframe>` a ve skriptech, na stránce kurzu nebo v prezentaci budete mít živý model, který si čtenáři mohou přibližovat:

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![Trojkloubový rám v režimu prohlížeče](/screenshots/cs/viewer-mode.webp){.shot-lg}

Režim prohlížeče slouží k prohlížení, ale není uzamčený: návštěvníci mohou dál přetahovat uzly a přepínat průběhy. Když se odkaz v režimu prohlížeče otevře samostatně, nahradí návštěvníkův vlastní model stejně jako každý jiný odkaz a jeho model počká v Nedávných konstrukcích. Když je odkaz vložený do stránky na jiném webu, dostane rám ve většině současných prohlížečů vlastní úložiště a model návštěvníka zůstane nedotčený. Neplatí to ale ve všech prohlížečích.

Pro obrázek, ke kterému aplikaci vůbec nepotřebujete, například statický průběh na webové stránce, v prezentaci nebo v zadání cvičení, nakreslí konstrukce a jejich průběhy z kódu knihovna [@edubeam/plot](/cs/plot). Jsou jí nakreslené i živé obrázky na tomto webu.

## Parametry URL {#url-parameters}

| Parametr | Účinek |
| --- | --- |
| `model=<data>` | Načte zakódovaný model a přizpůsobí ho obrazovce. Zapisuje ho **Sdílet konstrukci**. |
| `viewer=1` | [Režim prohlížeče](#embed-a-read-only-viewer). |
| `show=<písmena>` | Otevře model se zapnutými právě těmito vrstvami, každá má jedno písmeno: `N` normálová síla, `V` posouvající síla, `M` ohybový moment, `U` deformovaný tvar, `R` reakce, `L` zatížení, `S` podpory, `n` popisky uzlů, `e` popisky prvků. `show=MRLS` zobrazí ohybový moment, reakce, zatížení a podpory. Zapisuje ho **Zobrazit to, co vidím já**. |
| `lang=<kód>` | Přepne jazyk rozhraní: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn` (čínština), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Rovnou otevře galerii příkladů. |

Parametry se spojují znakem `&`, například `?lang=de&viewer=1&model=…`. Jakmile je EduBeam přečte, z adresního řádku je odstraní. `lang` a `show` si zapamatuje jako nastavení návštěvníka, stejně jako kdyby je zvolil přímo v aplikaci.

## Export obrázku {#export-an-image}

**☰ → Exportovat obrázek** nebo <kbd>Ctrl</kbd>+<kbd>P</kbd> otevře export obrázku. Výkres se vykreslí znovu přímo pro zvolenou velikost, takže čáry i popisky si zachovají skutečnou tloušťku.

![Exportovat obrázek: zvolte vrstvy, výřez a velikost a obrázek stáhněte nebo zkopírujte](/screenshots/cs/export-image.webp)

::div{.steps}

### Zvolte vrstvy {#choose-the-layers}

Štítky nahoře určují, co se vykreslí: deformovaný tvar, N, V, M a reakce, dále podpory, zatížení, popisky uzlů a popisky prvků. Na začátku odpovídají možnostem zobrazení a jejich změna zde zobrazení neovlivní.

### Vyberte výřez {#frame-the-drawing}

Zvolte poměr stran (16:9, 4:3, 3:2 nebo 1:1), **Vše**, nebo **Výřez…** a tažením nad výkresem vyberte obdélník. Táhnout můžete také za okraje náhledu.

### Nastavte velikost {#set-the-size}

Šířka a výška v pixelech, nebo **Měřítko**, například 1 : 50 pro výkres v měřítku na papíře (při 96 DPI). **Výška diagramů** určuje velikost průběhů výsledků a **Průhledné pozadí** vynechá bílou. Když se průběhy nebo popisky nevejdou, dialog vás upozorní a nabídne zmenšení průběhů nebo zvětšení plátna.

### Uložte obrázek {#save-it}

**Stáhnout PNG**, **Stáhnout SVG** nebo, pokud to prohlížeč dovolí, **Kopírovat do schránky**. Soubory se jmenují podle velikosti, například `edubeam-512x512.svg`. Na obrazovce s vysokým rozlišením má PNG víc pixelů, než jakou šířku a výšku jste nastavili, a to v poměru k hustotě pixelů obrazovky, aby byl stejně ostrý jako aplikace; jeho skutečný rozměr v pixelech je uvedený vedle tlačítek.

::

SVG zůstává ostré v jakékoli velikosti a funguje ve Wordu, Inkscapu i v LaTeXu na Overleafu, takže je pro zprávy a závěrečné práce nejlepší volbou. Stejná velikost vždy zarámuje konstrukci stejně, takže N, V a M exportované jeden po druhém proto přesně lícují vedle sebe.

Pokud chcete takové obrázky vytvářet z kódu, například jeden ke každému příkladu v zadání, @edubeam/plot zapíše [samostatný soubor SVG](/cs/plot/functions#a-standalone-svg-file), který otevřete ve stejných programech.

## Export výsledků {#export-the-results}

**Exportovat CSV** v záložce **Výsledky** stáhne obě tabulky výsledků včetně reakcí a **Kopírovat** je uloží do schránky pro tabulkový procesor. Viz [Export CSV a kopírování](/cs/essentials/results#export-csv-and-copy).

## Nedávné konstrukce {#recent-structures}

**☰ → Nedávné konstrukce** uchovává posledních 10 konstrukcí, které byly smazány nebo nahrazeny odkazem, souborem, příkladem, návodem *Nakreslit první nosník* nebo jiným obnovením. U každé vidíte náhled, čím byla nahrazena, a počet uzlů a prvků. Tlačítkem **Obnovit** konstrukci vrátíte: model, který jste měli otevřený, se naopak přesune do seznamu a <kbd>Ctrl</kbd>+<kbd>Z</kbd> obnovení vrátí zpět. Tlačítkem **Odebrat** položku smažete.

![Nedávné konstrukce](/screenshots/cs/recent.webp){.shot-lg}

Seznam se ukládá jen v tomto prohlížeči.

## Příklady {#examples}

**☰ → Příklady** otevře galerii hotových výukových modelů. Otevřený příklad nahradí váš model, který vrátíte klávesami <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Tytéž modely i se cvičeními najdete v této dokumentaci na stránce [Příklady](/cs/examples/).

![Galerie příkladů](/screenshots/cs/examples.webp){.shot-lg}

## Automatické ukládání {#automatic-persistence}

Váš model a nastavení se po každé změně ukládají do místního úložiště prohlížeče a po návratu se obnoví, i když jste mezitím prohlížeč zavřeli. Jde o pohodlí, ne o zálohu: patří k jednomu profilu prohlížeče na jednom zařízení, anonymní okno si ho nepamatuje a smazáním dat webu zmizí. Důležitou práci si ukládejte do souboru projektu. Vše, co se ukládá, vyjmenovává oddíl [Co se ukládá v prohlížeči](/cs/essentials/units-settings#what-is-stored-in-your-browser).

## Formát souboru projektu {#project-file-format}

`project.json` je obyčejný, čitelný JSON. Toto je nosník z [Rychlého startu](/cs/guide/quick-start) s ocelí a profilem IPE 200 z knihoven:

```json [project.json]
{
  "edubeam": true,
  "version": "1.3.4",
  "domain": {
    "materials": [
      {
        "label": "Steel (S235)",
        "d": 7850,
        "e": 210000000000,
        "g": 81000000000,
        "alpha": 0.000012
      }
    ],
    "crossSections": [
      {
        "label": "IPE 200 (approx)",
        "a": 0.002848,
        "iy": 0.00001943,
        "h": 0.2,
        "k": 0.3932584269662922
      }
    ],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [
      {
        "label": "1",
        "nodes": ["1", "2"],
        "mat": "Steel (S235)",
        "cs": "IPE 200 (approx)",
        "hinges": [false, false]
      }
    ],
    "loadCases": [
      {
        "label": "DefaultLC",
        "nodalLoads": [],
        "elementLoads": [
          { "type": "udl", "target": "1", "lcs": true, "values": [0, 12000] }
        ],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Všechny hodnoty jsou v **jednotkách SI** (m, N, Pa, rad) bez ohledu na to, v jakých jednotkách aplikace zobrazuje. Souřadnice mají tvar `[x, y, z]`, přičemž $y = 0$ a osa $z$ míří dolů. Podpory a složky zatížení používají identifikátory stupňů volnosti `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` prvkového zatížení | Hodnoty |
| --- | --- |
| `udl` | `values: [fx, fz]` v N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` v N/m |
| `concentrated` | `values: [Fx, Fz, My, a]` v N, N·m a m od počátečního uzlu |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` v K; gradient je ΔTb − ΔTt |

`lcs: true` nebo chybějící `lcs` znamená, že prvkové zatížení působí v lokálních osách prvku; `false` znamená globální osy. Další položky:

- **Uzlová zatížení**: `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, případně s `"lcs": true` pro zatížení v osách pootočené podpory.
- **Předepsaná posunutí**: `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; složka, kterou vynecháte, je 0.
- Soubory, které zapíše aplikace, obsahují navíc `date`, `commit`, osy pootočených podpor (`lcs` u uzlu) a nakreslené tvary průřezů `shape`.

Formát je jednoduchý, takže modely můžete generovat skriptem nebo v tabulkovém procesoru a pak je otevřít přes **Otevřít projekt**. Pokud chcete modely sestavovat a řešit celé v kódu, použijte výpočetní jádro aplikace, knihovnu [@edubeam/fem](/cs/solver).
