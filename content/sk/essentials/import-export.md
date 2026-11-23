---
description: "Projekty a relácie desktopového EduBeamu, zdieľanie odkazom, vloženie živého modelu do stránky, parametre URL, export obrázkov a tabuliek. Všetko zostáva vo vašom prehliadači."
source: site
---

# Súbory, odkazy a export

:span{#import-export-sharing}

Model môžete uložiť do súboru, poslať odkazom, vložiť na webovú stránku alebo z neho exportovať obrázok či tabuľku. V [EduBeame]{.edubeam} sa všetko odohráva vo vašom prehliadači a nič sa nenahráva na server: zdieľaný odkaz model doslova obsahuje.

::card-grid{cols="3"}
:::card{title="Súbor projektu" icon="lucide:file-json" to="#save-a-project"}
`project.json` na uschovanie, odovzdanie alebo neskoršie otvorenie.
:::
:::card{title="Odkaz na zdieľanie" icon="lucide:link" to="#share-a-link"}
Celý model v jednej adrese URL pre skriptá, prezentácie aj e-maily.
:::
:::card{title="Obrázok alebo tabuľka" icon="lucide:image" to="#export-an-image"}
PNG alebo SVG do technických správ, CSV pre tabuľkový procesor.
:::
::

## Uloženie projektu {#save-a-project}

**☰ → Uložiť projekt** alebo <kbd>Ctrl</kbd>+<kbd>S</kbd> (na Macu <kbd>⌘</kbd>+<kbd>S</kbd>, rovnako ako pri všetkých skratkách na tejto stránke) stiahne súbor `project.json`. Obsahuje uzly, prvky, materiály, prierezy (vrátane nakreslených tvarov), zaťaženia, kóty a verziu aplikácie, ktorá ho zapísala. Súbor môžete ľubovoľne premenovať.

## Otvorenie projektu {#open-a-project}

Zvoľte **☰ → Otvoriť projekt** alebo stlačte <kbd>Ctrl</kbd>+<kbd>O</kbd> a vyberte súbor, prípadne **súbor pretiahnite kamkoľvek do okna aplikácie**. EduBeam otvorí:

- súbory `project.json` uložené ktoroukoľvek verziou EduBeamu;
- relácie `.xml` uložené **desktopovým EduBeamom** 2.x až 3.5. Ich hodnoty nemajú jednotky, a preto sa čítajú v kN, kPa a m, teda v jednotkách, ktoré používala jeho príručka. EduBeam otvára vždy len jeden zaťažovací stav: z relácie s viacerými stavmi otvorí prvý a vypíše, ktoré vynechal.

Otvorený súbor nahradí aktuálny model vrátane materiálov a prierezov. Doterajší model sa však nestratí: vrátite ho klávesmi <kbd>Ctrl</kbd>+<kbd>Z</kbd> a nájdete ho aj v [Nedávnych konštrukciách](#recent-structures). Súbor, ktorý EduBeam nevie prečítať, aplikácia s hlásením odmietne a váš model nechá bez zmeny.

## Zdieľanie odkazom {#share-a-link}

**Zdieľať konštrukciu** v hornej lište alebo v ponuke ☰ otvorí dialóg *Zdieľajte konštrukciu pomocou odkazu*:

![Dialóg Zdieľajte konštrukciu pomocou odkazu](/screenshots/sk/c1-share.webp){.shot-lg}

- **Kopírovať odkaz** skopíruje odkaz do schránky. Rovnako funguje kliknutie kamkoľvek do poľa.
- **Otvoriť odkaz** ho otvorí na novej karte, aby ste videli, čo uvidí príjemca.
- **Zdieľať cez systémové dialógové okno** odovzdá odkaz do ponuky zdieľania vášho zariadenia, ak to prehliadač podporuje.
- **Kratší odkaz** (predvolene zapnutý) zapíše ten istý model približne polovicou znakov. EduBeam starší ako verzia 1.3.2 (november 2026) ho prečíta až po aktualizácii, takže keď musí odkaz hneď fungovať všade, voľbu vypnite.
- **Zobraziť to, čo vidím ja** (predvolene vypnuté) zabezpečí, že sa odkaz otvorí s priebehmi, zaťažením a popismi, ktoré máte zapnuté vy, a nie s možnosťami zobrazenia príjemcu.

Odkaz má tvar `https://run.edubeam.app/?model=…` a obsahuje celý zakódovaný model. Kto ho otvorí, dostane vlastnú kópiu, ktorú môže upravovať; úpravy sa späť **nesynchronizujú**, takže po zmene modelu pošlite nový odkaz. Z veľmi veľkých modelov vznikajú veľmi dlhé odkazy; také modely radšej zdieľajte ako súbor projektu.

Keď niekto odkaz otvorí, jeho doterajší model sa presunie do Nedávnych konštrukcií a hlásenie mu povie, kde ho nájde. Platnosť odkazov nikdy nevyprší: odkaz vo vlaňajších skriptách dnes otvorí ten istý model.

## Vloženie modelu do stránky {#embed-a-read-only-viewer}

Keď k odkazu na zdieľanie pridáte `&viewer=1`, model sa otvorí v **režime iba na prezeranie**: horná a spodná lišta, tlačidlá späť a znova, štítky mriežky a jednotiek aj zameriavací kríž sú skryté a zostane len výkres, tlačidlá prispôsobenia a vycentrovania a možnosti zobrazenia. Neotvorí sa ani uvítací dialóg, ani prehľad noviniek (*Čo je nové?*). Vložte túto adresu do `<iframe>` a v skriptách, na stránke predmetu alebo v prezentácii budete mať živý model, ktorý si čitatelia môžu približovať:

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![Trojkĺbový rám v režime iba na prezeranie](/screenshots/sk/viewer-mode.webp){.shot-lg}

Režim iba na prezeranie je určený na prezeranie, ale nie je uzamknutý: návštevníci môžu ďalej presúvať uzly a prepínať priebehy. Keď sa takýto odkaz otvorí samostatne, nahradí vlastný model návštevníka rovnako ako každý iný odkaz a jeho model počká v Nedávnych konštrukciách. Keď je odkaz vložený do stránky na inom webe, dostane rám vo väčšine súčasných prehliadačov vlastné úložisko a model návštevníka zostane nedotknutý. Neplatí to však vo všetkých prehliadačoch.

Na obrázok, na ktorý aplikáciu vôbec nepotrebujete, napríklad statický priebeh na webovej stránke, v prezentácii alebo v zadaní cvičenia, nakreslí konštrukcie a ich priebehy z kódu knižnica [@edubeam/plot](/sk/plot). Kreslí aj živé obrázky na tomto webe.

## Parametre URL {#url-parameters}

| Parameter | Účinok |
| --- | --- |
| `model=<data>` | Načíta zakódovaný model a prispôsobí ho obrazovke. Zapisuje ho **Zdieľať konštrukciu**. |
| `viewer=1` | [Režim iba na prezeranie](#embed-a-read-only-viewer). |
| `show=<písmená>` | Otvorí model so zapnutými práve týmito vrstvami, každá má jedno písmeno: `N` normálová sila, `V` priečna sila, `M` ohybový moment, `U` deformovaný tvar, `R` reakcie, `L` zaťaženie, `S` podpery, `n` popisy uzlov, `e` popisy prvkov. `show=MRLS` zobrazí ohybový moment, reakcie, zaťaženie a podpery. Zapisuje ho **Zobraziť to, čo vidím ja**. |
| `lang=<kód>` | Prepne jazyk rozhrania: `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (čínština), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Hneď otvorí galériu príkladov. |

Parametre sa spájajú znakom `&`, napríklad `?lang=de&viewer=1&model=…`. Len čo ich EduBeam prečíta, z panela s adresou ich odstráni. `lang` a `show` si zapamätá ako nastavenia návštevníka, rovnako ako keby ich zvolil priamo v aplikácii.

## Export obrázka {#export-an-image}

**☰ → Exportovať obrázok** alebo <kbd>Ctrl</kbd>+<kbd>P</kbd> otvorí export obrázka. Výkres sa vykreslí znova priamo pre zvolenú veľkosť, takže čiary aj popisy si zachovajú skutočnú hrúbku.

![Exportovať obrázok: zvoľte vrstvy, výrez a veľkosť a obrázok stiahnite alebo skopírujte](/screenshots/sk/export-image.webp)

::div{.steps}

### Zvoľte vrstvy {#choose-the-layers}

Štítky hore určujú, čo sa vykreslí: deformovaný tvar, N, V, M a reakcie, ďalej podpery, zaťaženie, popisy uzlov a popisy prvkov. Na začiatku zodpovedajú možnostiam zobrazenia a ich zmena tu zobrazenie neovplyvní.

### Vyberte výrez {#frame-the-drawing}

Zvoľte pomer strán (16:9, 4:3, 3:2 alebo 1:1), **Všetko** alebo **Výrez…** a ťahaním nad výkresom vyberte obdĺžnik. Ťahať môžete aj za okraje náhľadu.

### Nastavte veľkosť {#set-the-size}

Šírka a výška v pixeloch alebo **Mierka**, napríklad 1 : 50 pre výkres v mierke na papieri (pri 96 DPI). **Výška diagramov** určuje veľkosť priebehov výsledkov a **Priehľadné pozadie** vynechá biele pozadie. Keď sa priebehy alebo popisy nezmestia, dialóg vás upozorní a ponúkne zmenšenie priebehov alebo zväčšenie plátna.

### Uložte obrázok {#save-it}

**Stiahnuť PNG**, **Stiahnuť SVG** alebo, ak to prehliadač dovolí, **Kopírovať do schránky**. Súbory sa volajú podľa veľkosti, napríklad `edubeam-512x512.svg`. Na obrazovke s vysokým rozlíšením má PNG viac pixelov, než akú šírku a výšku ste nastavili, a to v pomere k hustote pixelov obrazovky, aby bol rovnako ostrý ako aplikácia; jeho skutočný rozmer v pixeloch je uvedený vedľa tlačidiel.

::

SVG zostáva ostré v akejkoľvek veľkosti a funguje vo Worde, Inkscape aj v LaTeXe na Overleafe, takže je pre správy a záverečné práce najlepšou voľbou. Rovnaká veľkosť vždy zarámuje konštrukciu rovnako, takže N, V a M exportované jeden po druhom presne lícujú vedľa seba.

Ak chcete také obrázky vytvárať z kódu, napríklad jeden ku každému príkladu v zadaní, @edubeam/plot zapíše [samostatný súbor SVG](/sk/plot/functions#a-standalone-svg-file), ktorý otvoríte v tých istých programoch.

## Export výsledkov {#export-the-results}

**Exportovať CSV** na karte **Výsledky** stiahne obe tabuľky výsledkov vrátane reakcií a **Kopírovať** ich uloží do schránky pre tabuľkový procesor. Pozrite [Export CSV a kopírovanie](/sk/essentials/results#export-csv-and-copy).

## Nedávne konštrukcie {#recent-structures}

**☰ → Nedávne konštrukcie** uchováva posledných 10 konštrukcií, ktoré boli vymazané alebo nahradené odkazom, súborom, príkladom, sprievodcom *Nakresliť prvý nosník* alebo iným obnovením. Pri každej vidíte náhľad, čím bola nahradená, a počet uzlov a prvkov. Tlačidlom **Obnoviť** konštrukciu vrátite: model, ktorý ste mali otvorený, sa naopak presunie do zoznamu a <kbd>Ctrl</kbd>+<kbd>Z</kbd> obnovenie vráti späť. Tlačidlom **Odobrať** položku vymažete.

![Nedávne konštrukcie](/screenshots/sk/recent.webp){.shot-lg}

Zoznam sa ukladá iba v tomto prehliadači.

## Príklady {#examples}

**☰ → Príklady** otvorí galériu hotových výučbových modelov. Otvorený príklad nahradí váš model, ktorý vrátite klávesmi <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Tie isté modely aj s cvičeniami nájdete v tejto príručke na stránke [Príklady](/sk/examples/).

![Galéria príkladov](/screenshots/sk/examples.webp){.shot-lg}

## Automatické ukladanie {#automatic-persistence}

Váš model a nastavenia sa po každej zmene ukladajú do lokálneho úložiska prehliadača a po návrate sa obnovia, aj keď ste medzitým prehliadač zatvorili. Je to pohodlie, nie záloha: patrí k jednému profilu prehliadača na jednom zariadení, súkromné okno (inkognito) si ho nepamätá a vymazaním údajov webu zmizne. Dôležitú prácu si ukladajte do súboru projektu. Všetko, čo sa ukladá, vymenúva časť [Čo sa ukladá v prehliadači](/sk/essentials/units-settings#what-is-stored-in-your-browser).

## Formát súboru projektu {#project-file-format}

`project.json` je obyčajný, čitateľný JSON. Toto je nosník z [Rýchleho štartu](/sk/guide/quick-start) s oceľou a profilom IPE 200 z knižníc:

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

Všetky hodnoty sú v **jednotkách SI** (m, N, Pa, rad) bez ohľadu na to, v akých jednotkách aplikácia zobrazuje. Súradnice majú tvar `[x, y, z]`, pričom $y = 0$ a os $z$ smeruje nadol. Podpery a zložky zaťaženia používajú identifikátory stupňov voľnosti `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` prvkového zaťaženia | Hodnoty |
| --- | --- |
| `udl` | `values: [fx, fz]` v N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` v N/m |
| `concentrated` | `values: [Fx, Fz, My, a]` v N, N·m a m od počiatočného uzla |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` v K; gradient je ΔTb − ΔTt |

`lcs: true` alebo chýbajúce `lcs` znamená, že prvkové zaťaženie pôsobí v lokálnych osiach prvku; `false` znamená globálne osi. Ďalšie položky:

- **Uzlové zaťaženia**: `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, prípadne s `"lcs": true` pre zaťaženie v osiach pootočenej podpery.
- **Predpísané posunutia**: `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; zložka, ktorú vynecháte, je 0.
- Súbory, ktoré zapíše aplikácia, obsahujú navyše `date`, `commit`, osi pootočených podpier (`lcs` pri uzle) a nakreslené tvary prierezov `shape`.

Formát je jednoduchý, takže modely môžete generovať skriptom alebo v tabuľkovom procesore a potom ich otvoriť voľbou **Otvoriť projekt**. Ak chcete modely zostavovať a riešiť celé v kóde, použite výpočtové jadro aplikácie, knižnicu [@edubeam/fem](/sk/solver).
