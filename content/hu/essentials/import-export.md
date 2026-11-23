---
description: "EduBeam-projektek és asztali EduBeam-munkamenetek mentése és megnyitása, modell megosztása linkkel, élő nézet beágyazása, képek és eredménytáblázatok exportálása, mindez a böngészőben."
source: site
---

# Fájlok, linkek és exportálás

:span{#import-export-sharing}

A modellt elmentheted fájlba, elküldheted linkként, beágyazhatod egy weboldalba, vagy exportálhatod képként vagy táblázatként. Az [EduBeam]{.edubeam} minden művelete a böngésződben történik, és semmi sem kerül fel szerverre: a megosztási link szó szerint magát a modellt tartalmazza.

::card-grid{cols="3"}
:::card{title="Projektfájl" icon="lucide:file-json" to="#save-a-project"}
`project.json` megőrzésre, beadásra vagy későbbi megnyitásra.
:::
:::card{title="Megosztási link" icon="lucide:link" to="#share-a-link"}
A teljes modell egyetlen URL-ben, jegyzetekhez, diákhoz és üzenetekhez.
:::
:::card{title="Kép vagy táblázat" icon="lucide:image" to="#export-an-image"}
PNG vagy SVG jegyzőkönyvekhez, CSV táblázatkezelőkhöz.
:::
::

## Projekt mentése {#save-a-project}

A **☰ → Projekt mentése** vagy a <kbd>Ctrl</kbd>+<kbd>S</kbd> (Macen <kbd>⌘</kbd>+<kbd>S</kbd>, mint minden billentyűparancsnál ezen az oldalon) letölti a `project.json` fájlt. Ez tartalmazza a csomópontokat, az elemeket, az anyagokat, a keresztmetszeteket (a megrajzolt alakokkal együtt), a terheket, a méretvonalakat, valamint a fájlt író alkalmazás verzióját. A fájlt szabadon átnevezheted.

## Projekt megnyitása {#open-a-project}

**☰ → Projekt megnyitása** vagy <kbd>Ctrl</kbd>+<kbd>O</kbd>, majd válaszd ki a fájlt, vagy **húzd a fájlt bárhová az alkalmazás ablakába**. Az EduBeam a következőket nyitja meg:

- az EduBeam bármely verziójával mentett `project.json` fájlokat;
- az **asztali EduBeam** 2.x–3.5-ös verzióival mentett `.xml` munkameneteket. Ezek értékeinek nincs mértékegysége, ezért kN-ként, kPa-ként és m-ként olvasódnak be, ahogy az asztali program kézikönyve is használta őket. Az EduBeam egyszerre egy terhelési esetet nyit meg: a több terhelési esetet tartalmazó munkamenetből az elsőt nyitja meg, és felsorolja a kihagyottakat.

A megnyitás lecseréli az aktuális modellt, az anyagaival és keresztmetszeteivel együtt. Az addigi modelled nem vész el: a <kbd>Ctrl</kbd>+<kbd>Z</kbd> visszahozza, és a [Legutóbbi szerkezetek](#recent-structures) között is megmarad. Az olyan fájlt, amelyet az EduBeam nem tud beolvasni, üzenettel elutasítja, a modelled pedig változatlan marad.

## Link megosztása {#share-a-link}

Az alkalmazássávon vagy a ☰ menüben lévő **Szerkezet megosztása** megnyitja a *Szerkezet megosztása linkkel* párbeszédablakot:

![A Szerkezet megosztása linkkel párbeszédablak](/screenshots/hu/c1-share.webp){.shot-lg}

- A **Link másolása** vagy egy kattintás bárhová a mezőben kimásolja a linket.
- A **Link megnyitása** új lapon nyitja meg, így azt látod, amit a címzett is látni fog.
- A **Megosztás a rendszer párbeszédablakával** átadja a linket az eszközöd megosztási menüjének, ha a böngésző ezt támogatja.
- A **Rövidebb link** (alapértelmezés szerint bekapcsolva) ugyanazt a modellt nagyjából feleannyi karakterrel írja le. Az EduBeam 1.3.2-es verziójánál (2026. november) régebbi példányok csak frissítés után tudják beolvasni, ezért kapcsold ki, ha a linknek azonnal mindenhol meg kell nyílnia.
- Az **Úgy, ahogy én látom** (alapértelmezés szerint kikapcsolva) bekapcsolásakor a link a nálad bekapcsolt ábrákkal, terhekkel és feliratokkal nyílik meg, nem a címzett saját megjelenítési beállításaival.

A link `https://run.edubeam.app/?model=…` alakú, és a teljes modellt kódolja. Aki megnyitja, saját, szerkeszthető példányt kap; a módosítások **nem** szinkronizálódnak vissza, ezért ha a modell változik, küldj új linket. A nagyon nagy modellekből nagyon hosszú link lesz; ilyenkor inkább a projektfájlt oszd meg.

Amikor valaki megnyit egy linket, a saját korábbi modellje a Legutóbbi szerkezetek közé kerül, és egy üzenet megmondja, hol találja. A linkek sosem járnak le: a tavalyi előadásjegyzetben lévő link ma is ugyanazt a modellt nyitja meg.

## Nézet beágyazása {#embed-a-read-only-viewer}

Ha a megosztási linkhez hozzáfűzöd a `&viewer=1` paramétert, a modell **megtekintő módban** nyílik meg: az alkalmazássáv, az alsó sáv, a visszavonás és az újra, a rács és a mértékegységek gombja, valamint a szálkereszt rejtve marad, csak a rajz, az igazítás és a középre igazítás gombja, valamint a megjelenítési beállítások látszanak. Az üdvözlő párbeszédablak és a kiadási megjegyzések sem nyílnak meg. Ezt az URL-t egy `<iframe>` elembe téve élő, nagyítható modellt ágyazhatsz be előadásjegyzetbe, tantárgyi weboldalra vagy diára:

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![A háromcsuklós keret megtekintő módban](/screenshots/hu/viewer-mode.webp){.shot-lg}

A megtekintő mód nézelődésre szolgál, de nincs lezárva: a látogatók továbbra is húzhatják a csomópontokat és válthatnak az ábrák között. Ha önmagában nyitják meg, a megtekintő módú link is, mint bármely más link, lecseréli a látogató saját modelljét, amely ezután a Legutóbbi szerkezetek között található. Más webhely oldalába ágyazva a legtöbb mai böngésző külön tárolót ad a keretnek, így a látogató modellje érintetlen marad, de nem minden böngésző teszi ezt.

Olyan ábrához, amelyhez egyáltalán nincs szükség az alkalmazásra, például egy weboldal, dia vagy feladatlap statikus ábrájához, az [@edubeam/plot](/hu/plot) kódból rajzolja meg a szerkezeteket és az ábráikat. Ennek az oldalnak az élő ábrái is ezzel készültek.

## URL-paraméterek {#url-parameters}

| Paraméter | Hatás |
| --- | --- |
| `model=<data>` | Betölti a kódolt modellt, és a képernyőhöz igazítja. A **Szerkezet megosztása** írja. |
| `viewer=1` | [Megtekintő mód](#embed-a-read-only-viewer). |
| `show=<letters>` | Pontosan ezekkel a rétegekkel nyílik meg, rétegenként egy betűvel: `N` normálerő, `V` nyíróerő, `M` hajlítónyomaték, `U` deformált alak, `R` támaszerők, `L` terhek, `S` támaszok, `n` csomópontok jelölése, `e` elemek jelölése. A `show=MRLS` a hajlítónyomatékot, a támaszerőket, a terheket és a támaszokat mutatja. Az **Úgy, ahogy én látom** írja. |
| `lang=<code>` | A felület nyelvét állítja be: `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (kínai), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Azonnal megnyitja a példák galériáját. |

A paraméterek `&` jellel kapcsolhatók össze, például `?lang=hu&viewer=1&model=…`. Beolvasásuk után az EduBeam eltávolítja őket a címsorból. A `lang` és a `show` a látogató beállításaként megmarad, mintha az alkalmazásban választotta volna ki őket.

## Kép exportálása {#export-an-image}

A **☰ → Kép exportálása** vagy a <kbd>Ctrl</kbd>+<kbd>P</kbd> megnyitja a képexportálást. A rajz a választott méretre újra elrendeződik, így a vonalak és a feliratok megtartják valódi vastagságukat.

![Kép exportálása: válaszd ki a rétegeket, a kivágatot és a méretet, majd töltsd le vagy másold](/screenshots/hu/export-image.webp)

::div{.steps}

### Válaszd ki a rétegeket {#choose-the-layers}

A felső gombok határozzák meg, mi rajzolódjon ki: a deformált alak, az N, V, M és a támaszerők, majd a támaszok, a terhek, a csomópontok és az elemek jelölése. Kezdetben a nézet megjelenítési beállításait követik, és ha itt módosítod őket, a nézet nem változik.

### Válaszd ki a kivágatot {#frame-the-drawing}

Válassz méretarányt (16:9, 4:3, 3:2 vagy 1:1), a **Teljes rajz** lehetőséget, vagy a **Kivágat…** lehetőséget, és húzz egy téglalapot a rajz fölé. Az előnézet széleit is húzhatod.

### Állítsd be a méretet {#set-the-size}

Szélesség és magasság pixelben, vagy **Lépték**, például 1 : 50, ha méretarányos rajzot szeretnél papírra (96 DPI mellett). Az **Ábrák magassága** az eredményábrák méretét állítja be, az **Átlátszó háttér** pedig elhagyja a fehér hátteret. Ha az ábrák vagy a feliratok nem férnek el, a párbeszédablak jelzi, és felajánlja az ábrák kicsinyítését vagy a rajzlap nagyítását.

### Mentsd el {#save-it}

**PNG letöltése**, **SVG letöltése**, vagy ahol a böngésző engedi, **Másolás a vágólapra**. A fájlok nevét a méretük adja, például `edubeam-512x512.svg`. Nagy felbontású képernyőn a PNG több pixelből áll, mint a beállított szélesség és magasság, a képernyő pixelsűrűségével arányosan, hogy ugyanolyan éles legyen, mint az alkalmazásban; a pixelben mért mérete a gombok mellett látható.

::

Az SVG bármekkora méretben éles marad, és működik a Wordben, az Inkscape-ben és az Overleafen futó LaTeX-ben, ezért jegyzőkönyvekhez és szakdolgozatokhoz ez a legjobb választás. Azonos méretnél a szerkezet mindig ugyanúgy kerül a képre, így az egymás után exportált N, V és M ábra pontosan egymás mellé illeszthető.

Ha ilyen ábrákat kódból szeretnél készíteni, például egy feladatlap minden feladatához egyet, az @edubeam/plot [önálló SVG-fájlt](/hu/plot/functions#a-standalone-svg-file) ír, amely ugyanezekben a programokban nyílik meg.

## Eredmények exportálása {#export-the-results}

Az **Eredmények** fül **CSV exportálása** gombja letölti mindkét eredménytáblázatot, a támaszerőkkel együtt, a **Másolás** pedig táblázatkezelőbe illesztéshez a vágólapra teszi őket. Lásd: [CSV-export és másolás](/hu/essentials/results#export-csv-and-copy).

## Legutóbbi szerkezetek {#recent-structures}

A **☰ → Legutóbbi szerkezetek** az utolsó 10 olyan szerkezetet őrzi meg, amelyet töröltél, vagy amelyet egy link, egy fájl, egy példa, az *Az első tartód* bemutató vagy egy másik visszaállítás váltott fel. Mindegyiknél látható egy bélyegkép, hogy mi váltotta fel, valamint a csomópontjainak és elemeinek a száma. A **Visszaállítás** visszahozza a kiválasztottat: az addigi modelled ekkor maga is a listára kerül, a <kbd>Ctrl</kbd>+<kbd>Z</kbd> pedig visszavonja a visszaállítást. Az **Eltávolítás** töröl egy bejegyzést.

![Legutóbbi szerkezetek](/screenshots/hu/recent.webp){.shot-lg}

A lista csak ebben a böngészőben tárolódik.

## Példák {#examples}

A **☰ → Példák** kész oktatási modellek galériáját nyitja meg. Egy példa megnyitása lecseréli a modelledet, a <kbd>Ctrl</kbd>+<kbd>Z</kbd> pedig visszahozza a sajátodat. Ugyanezek a modellek feladatokkal együtt az útmutató [Példák](/hu/examples/) oldalán is megtalálhatók.

![A példák galériája](/screenshots/hu/examples.webp){.shot-lg}

## Automatikus mentés {#automatic-persistence}

A modelled és a beállításaid minden módosítás után a böngésző helyi tárolójába mentődnek, és visszatéréskor helyreállnak, még a böngésző bezárása után is. Ez kényelmi funkció, nem biztonsági mentés: egyetlen eszköz egyetlen böngészőprofiljához tartozik, a privát ablak elfelejti, és a webhely adatainak törlése eltávolítja. A fontos munkát mentsd projektfájlba. Mindent, amit a böngésző tárol, a [Mit tárol a böngésződ](/hu/essentials/units-settings#what-is-stored-in-your-browser) rész sorol fel.

## A projektfájl formátuma {#project-file-format}

A `project.json` egyszerű, olvasható JSON. Ez a [Gyors kezdés](/hu/guide/quick-start) tartója a könyvtárakból választott acéllal és IPE 200-as szelvénnyel:

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

Minden érték **SI-egységekben** (m, N, Pa, rad) szerepel, függetlenül attól, milyen mértékegységeket mutat az alkalmazás. A koordináták `[x, y, z]` alakúak, ahol $y = 0$, a $z$ tengely pedig lefelé mutat. A támaszok és a teherösszetevők a szabadságfokok azonosítóit használják: `0 = Dx`, `2 = Dz`, `4 = Ry`.

| Rúdteher `type` | Értékek |
| --- | --- |
| `udl` | `values: [fx, fz]` N/m-ben |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` N/m-ben |
| `concentrated` | `values: [Fx, Fz, My, a]` N-ban, N·m-ben, valamint m-ben a kezdőcsomóponttól mérve |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` K-ben; a hőmérséklet-különbség ΔTb − ΔTt |

Az `lcs: true` (vagy ha az `lcs` hiányzik) azt jelenti, hogy a rúdteher az elem lokális tengelyeiben van megadva, a `false` pedig azt, hogy a globális tengelyekben. A többi bejegyzés:

- **Csomóponti terhek**: `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, elforgatott támasz tengelyeiben megadott tehernél még `"lcs": true`.
- **Előírt elmozdulások**: `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; a kihagyott összetevő értéke 0.
- Az alkalmazás által írt fájlok tartalmaznak még egy `date` és egy `commit` mezőt, az elforgatott támaszok tengelyeit (`lcs` a csomópontnál) és a megrajzolt keresztmetszetek alakját (`shape`).

Mivel a formátum egyszerű, modelleket szkripttel vagy táblázatkezelővel is előállíthatsz, és a **Projekt megnyitása** paranccsal megnyithatod őket. Ha a modelleket teljes egészében kódban akarod felépíteni és kiszámítani, használd az alkalmazás mögött álló számítómagot, az [@edubeam/fem](/hu/solver) könyvtárat.
