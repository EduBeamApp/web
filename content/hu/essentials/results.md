---
description: "Az EduBeam eredményeinek leolvasása: N, V és M ábrák, a deformált alak és a támaszerők, előjeleik, a rámutatáskor megjelenő értékek, eredménytáblázatok, CSV-export és a merevségi mátrix."
source: site
---

# Eredmények és igénybevételi ábrák

Az [EduBeam]{.edubeam} minden módosítás után kiszámítja a modellt, így a képernyőn lévő ábrák, támaszerők és táblázatok mindig az éppen látható modellhez tartoznak. *Számítás* gomb nincs. Ha semmi sem jelenik meg, a modell még nem számítható: a nézet bal felső sarkában lévő üzenet megmondja, miért, és minden üzenetet a [Hibaelhárítás](/hu/reference/troubleshooting) oldal magyaráz el.

## Ábrák a nézetben {#overlays-in-the-viewer}

Az eredmények a modellre rajzolódnak. A nézet jobb felső sarkában, a **megjelenítési beállításokban** kapcsolhatod be és ki őket; a fölöttük lévő ⚙ gomb megjeleníti vagy elrejti a panelt.

::model-figure{caption="Háromcsuklós keret, 10 kN/m: válts az M, V, N és a deformált alak között"}
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

| Kapcsoló | Mit rajzol | Szín | Kezdetben bekapcsolva |
| --- | --- | --- | --- |
| **Deformált alak** | az elmozdult szerkezetet, a láthatóság kedvéért felnagyítva | szürke | igen |
| **N (x)** | normálerő | kék | |
| **V<sub>z</sub> (x)** | nyíróerő | zöld | |
| **M<sub>y</sub> (x)** | hajlítónyomaték | piros | igen |
| **Támaszerők** | nyíl és érték minden gátolt irányban | lila | igen |

A második sor magát a rajzot kapcsolja: **Támaszok**, **Terhek**, **Csomópontok jelölése** és **Elemek jelölése**. A panel alatti **További beállítások** a [megjelenítés beállításait](/hu/essentials/units-settings#viewer-settings) nyitja meg, ahol az ábrák méretét (*Eredmények léptéke*), a színeket, a feliratok irányát és az ábrák stílusát állíthatod be.

Az értékek ott jelennek meg, ahol fontosak: minden rúd végén, ugrásnál (koncentrált erő alatt vagy támasz fölött) mindkét oldalon, és az ábra minden szélsőértékénél, például a parabola csúcsán, ahol $V = 0$. A fenti ábra a [háromcsuklós keretet](/hu/tutorials/three-hinged-frame) mutatja, amelyet kézzel is ellenőrizhetsz: mindkét oszlopban 40 kN nyomás, a gerendában 20 kN, és mindkét sarokban −80 kNm. A *w* nézetben látszik, hogy a C-beli csukló 42,55 mm-t süllyed.

### Az előjel leolvasása {#reading-the-sign}

Az előjelet az **értékből** olvasd le, ne abból, hogy az ábra a rúd melyik oldalára van rajzolva. Az előjelszabály megegyezik a legtöbb tankönyvben használttal:

| Eredmény | Pozitív, ha |
| --- | --- |
| **N** | húzás |
| **V<sub>z</sub>** | a rúd egy rövid darabját az óramutató járásával megegyezően forgatja. Mivel $V = \mathrm{d}M/\mathrm{d}x$, lefelé mutató (gravitációs) teherrel terhelt kéttámaszú tartónál a bal támasznál pozitív, a jobbnál negatív |
| **M<sub>y</sub>** | alul húzott: húzás az alsó szálban, a rudak mentén rajzolt **szaggatott vonal** felőli oldalon |

A konzolos kéttámaszú tartón mindkét előjel egyszerre látható. A támaszok között pozitív a nyomaték (+13,5 kNm), a jobb támasz fölött negatív (−24 kNm), felül húzott. A nyíróerő B-ben az 54 kN-os támaszerővel ugrik, −30-ról +24 kN-ra:

::model-figure{caption="Konzolos kéttámaszú tartó, 12 kN/m: a támaszok között pozitív, B fölött negatív nyomaték"}
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

Alapértelmezés szerint a hajlítónyomaték a **húzott oldalra** rajzolódik, a pozitív normál- és nyíróerő pedig a szaggatott vonallal ellentétes oldalra. Ez iskolánként eltér, ezért mindegyik átfordítható a **Beállítások → Megjelenítés beállításai → Igénybevételi ábrák** résznél, ahol az ábrákat a kézi rajzhoz hasonlóan vonalkázhatod is, és minden szakaszt felirathatsz a polinom fokszámával. Az oldal átfordítása csak a rajzot változtatja meg, az értékeket soha. A teljes előjelszabályt, az elem lokális tengelyeivel együtt, az elméleti rész [Tengelyek és előjelszabály](/hu/elements/conventions#internal-forces) oldala tartalmazza.

## Értékek rámutatáskor {#hover-tooltips}

Mutass egy objektumra, és leolvashatod az értékeit:

- **Csomópont**: az $u_x$, $u_z$ elmozdulás (az elmozdulás mértékegységében) és a $\varphi_y$ elfordulás (radiánban).
- **Elem**: a jelölése, a keresztmetszete és az anyaga.
- **Teher**: az összetevői.

Érintőképernyőn koppints az objektumra: ugyanezeket a részleteket a panelje mutatja.

![Rámutatás a Gyors kezdés tartójának 2. csomópontjára](/screenshots/hu/ui-hover.webp){.shot-sm}

## Az Eredmények fül {#results-tab}

Az alsó sáv **Eredmények** füle két táblázatot tartalmaz, amelyek között a **Csomóponti eredmények** és az **Elemek eredményei** gombbal válthatsz.

### Csomóponti eredmények {#nodal-results}

Csomópontonként egy sor a **D<sub>x</sub>** és **D<sub>z</sub>** elmozdulással (az elmozdulás mértékegységében) és az **R<sub>y</sub>** elfordulással (radiánban), globális tengelyekben: a pozitív D<sub>z</sub> lefelé mutat, a pozitív R<sub>y</sub> pedig a képernyőn az óramutató járásával ellentétes. Megtámasztott irányban 0 vagy az előírt támaszsüllyedés jelenik meg. A támaszerők nincsenek ebben a táblázatban: olvasd le őket a rajzról, vagy a [CSV-exportból](#export-csv-and-copy).

![A fenti háromcsuklós keret csomóponti eredményei, Automatikus számformátummal](/screenshots/hu/p2c-results-nodal.webp){.shot-lg}

### Elemek eredményei {#element-results}

Elemenként egy sor a **rúdvégi erőkkel az elem lokális koordináta-rendszerében**:

| Oszlop | Jelentés |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | az elemre a **kezdő** csomópontjában ható tengelyirányú erő, nyíróerő és nyomaték |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | ugyanezek a **vég**csomópontjában |

![A háromcsuklós keret elemeinek eredményei: négy rúdjának rúdvégi erői](/screenshots/hu/p2c-results-element.webp)

A rúdvégi erők azok az erők, amelyekkel a csomópontok az elemre hatnak. A lokális tengelyeket követik, nem az ábrák N-V-M előjelszabályát, ezért az előjelük eltér:

- **Kéttámaszú tartó** (6 m, 12 kN/m, a [Gyors kezdés](/hu/guide/quick-start) példája): Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. Mindkét támasz felfelé, vagyis −z irányba nyomja a tartót.
- A kezdő csomópontjában befogott **konzol**, a végén 18 kN lefelé mutató teherrel: Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **A keret 1. oszlopa** (A alul, B felül): az X<sub>12</sub> = +40 kN a lokális x tengely mentén az elem belseje felé nyom, ami 40 kN nyomás.

A táblázatról bővebben a [Tengelyek és előjelszabály](/hu/elements/conventions#end-forces-element-results-table) oldalon olvashatsz.

### CSV-export és másolás {#export-csv-and-copy}

A **CSV exportálása** letölti az `edubeam-results.csv` fájlt mindkét táblázattal, a képernyőn látható mértékegységekben, táblázatkezelőhöz előkészítve. A **Másolás** ugyanezeket a táblázatokat tabulátorral tagolt szövegként a vágólapra teszi, így közvetlenül beilleszthetők az Excelbe, a LibreOffice-ba vagy a Google Táblázatokba.

| Táblázat | Oszlopok |
| --- | --- |
| Csomópontok | Node, x, z, Dx, Dz, Ry, valamint a **támaszerők**: Rx, Rz, My |
| Elemek | Element, Node 1, Node 2, valamint a rúdvégi erők: N1, V1, M1, N2, V2, M2 |

Minden fejléc tartalmazza a mértékegységet, például `Dz [mm]`. Az elemek rúdvégi erői ugyanazok a lokális értékek, mint a képernyőn az X<sub>12</sub> … M<sub>21</sub>.

### Merevségi mátrix {#stiffness-matrix}

Az elem paneljén a **Merevségi mátrix** parancs vagy az *Elemek* táblázat sorában lévő gomb megnyitja az elem 6 × 6-os merevségi mátrixát **globális koordináta-rendszerben** és SI-egységekben (N, m). Az elmozdulásmódszer gyakorlatain jól jön a kézi összeállítás ellenőrzéséhez; a képleteket az elméleti rész [Gerendaelem](/hu/elements/beam) oldalán találod.

## Számformátum {#number-format}

A táblázatok és a rámutatáskor megjelenő értékek öt értékes jegyre kerekítve mutatják az eredményeket. Hogy hogyan íródnak ki, azt a **Beállítások → Nyelv és területi beállítások → Számformátum** határozza meg:

| Formátum | 40 000 így jelenik meg | Mire való |
| --- | --- | --- |
| **Tudományos** (alapértelmezett) | 4 · 10⁴ | sok nagyságrendet átfogó értékekhez |
| **Mérnöki** | 40 · 10³ | a kilo és mega előtagok leolvasásához |
| **Automatikus** | 40 000 | hétköznapi számokhoz az oktatásban |

Az *Automatikus* a 0,001 és 100 000 közötti értékeket egyszerű számként írja ki. E tartományon kívül úgy írja őket, mint a *Mérnöki*, hárommal osztható kitevőjű tízhatványokkal, mint a fenti csomóponti eredményekben a 380,95 · 10⁻⁹. A tizedesjel a nyelvet követi.

A rajzon lévő feliratok (az ábrák értékei és a támaszerők) a számformátumtól függetlenül mindig két tizedesjegyűek: a 6,6667 kN felirata 6,67. Ha több jegyre van szükséged, olvasd le a táblázatokból vagy rámutatással.

## Pontosság {#precision-and-accuracy}

- A gerendaelem a lineáris Timoshenko-modellre pontos csomóponti, egyenletesen megoszló, trapéz alakú, koncentrált és hőmérsékleti terhek esetén. Az eredmények **nem** függenek az elemek számától, és nincs finomítandó háló.
- A számítás dupla pontossággal fut. Ha egy érték kisebb az azonos fajtájú legnagyobb érték billiomodánál, az kerekítési hiba, és a táblázatok 0-nak mutatják.
- A lehajlások tartalmazzák a **nyírási alakváltozást**, statikailag határozatlan szerkezetben pedig ez az erőket is kissé módosítja. Karcsú rudaknál egy százaléknál kevesebbel növeli az Euler–Bernoulli-féle lehajlást; rövid, magas rudaknál elérheti a tíz százalékot vagy többet is. Az [Eredmények ellenőrzése kézi számítással](/hu/guide/verification#shear-deformation) oldal megmutatja, mekkora a hatása, és hogyan kapcsolhatod ki a tankönyvi képletekkel való összevetéshez.

## Eredmények a jegyzőkönyvben {#results-in-a-report}

- A **☰ → Kép exportálása** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) PNG vagy SVG formátumban menti a rajzot a választott ábrákkal. Lásd: [Kép exportálása](/hu/essentials/import-export#export-an-image).
- Az Eredmények fül **CSV exportálása** vagy **Másolás** gombja a számokat adja.
- A **Szerkezet megosztása** linket ad, így az olvasó magát a modellt is megnyithatja.
- Előadásjegyzetekhez és feladatlapokhoz az [@edubeam/plot](/hu/plot) ugyanezeket az ábrákat kódból rajzolja meg.
