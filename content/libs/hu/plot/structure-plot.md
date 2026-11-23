---
title: StructurePlot
description: "Tartó, keret vagy rácsos tartó rajza a StructurePlot komponenssel: rétegek, fokozatosan felépülő rajzok, megnevezett támaszerők feladatokhoz, bélyegképek, méret, mértékegységek és leolvasás."
order: 2
group: Komponensek
source: site
---

# StructurePlot

A `StructurePlot` a teljes szerkezetet rajzolja meg a tárolója szélességéhez igazítva: a rudakat, a csuklókat, a támaszokat, a terheket, a támaszerőket, az N, V és M ábrát és a deformált alakot. Adj át neki egy számítómagot vagy a belőle készült [egyszerű modellt](/hu/plot/model), és mondd meg, mit rajzoljon.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Az összes propot a típusával és az alapértékével együtt a [Komponens API](/hu/plot/components#structureplot) oldal ismerteti.

Ez a rajz egy `StructurePlot` bekapcsolt `nodeLabels` és `dimensions` réteggel, beállított `hover` proppal és a webhely négy értékes jegyre kerekítő számformátumával: válts az eredmények között, és mutass egy rúdra az értékei leolvasásához.

::model-figure{caption="Keret csuklós oszloptalpakkal, a gerendán 10 kN/m, B-ben 15 kN"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: B, fx: 15 }
results: [M, V, N, w]
show: [nodeLabels, dimensions]
---
::

## Rétegek {#layers}

A rajz rétegekből áll, amelyek mindig ugyanabban a sorrendben rajzolódnak ki, akármilyen sorrendben sorolod fel őket:

| Réteg | Mit rajzol |
| --- | --- |
| `members` | a rudakat, a csuklókat kis körökként |
| `supports` | minden támasz jelét, ferde támasznál elforgatva |
| `loads` | a csomóponti terheket és a rúdterheket, a hőmérsékleti terheket és a támaszsüllyedéseket, az értékükkel együtt |
| `reactions` | a támaszerőket egyenes és íves nyilakként az értékükkel, vagy `reactionLabels: 'names'` esetén a feladat [megnevezett ismeretlenjeiként](#reactions-as-unknowns) |
| `nodes` | minden csomópontot kis körként |
| `nodeLabels` | a csomópontok jelölését |
| `dimensions` | láncméretezést, ahogy egy feladatlapon szokás: a szerkezet alatt minden szakaszt a csomópontok és a koncentrált erők között, jobb oldalt minden emeletmagasságot, egy második sorban pedig a teljes méretet |
| `N`, `V`, `M` | a normálerő-, a nyíróerő- és a nyomatéki ábrát |
| `w` | a deformált alakot |

Ha a `layers` propot elhagyod, a rajz a rudakat, a támaszokat, a terheket és a támaszerőket mutatja, valamint egy, a szerkezethez választott eredményt: tartóknál és kereteknél `M`, rácsos tartónál `N`, és `w`, ha semmi sem visel erőt, mint egy hőmérsékleti teher alatt szabadon nyúló tartónál.

Az ábrák az EduBeam alkalmazást követik: az N és a V ábra a rúdra merőlegesen vonalkázott, az M a húzott oldalon van, így a pozitív (alul húzott) nyomaték a tartó alatt látható. A `:moment-on-tension-side="false"` az M ábrát a nyomott oldalra rajzolja. A rácsos tartó minden rúd erejét egyszer mutatja, a rúd mentén, előjel szerint színezve.

## Fokozatosan felépülő rajzok {#figures-that-build-up}

A `reserve` azokat a rétegeket sorolja fel, amelyeknek rejtve is helyet kell hagyni. A rajz kezdettől elrendezi az összes lefoglalt réteget, így amikor egyet bekapcsolsz, az a helyén úszik be, és semmi más nem mozdul el:

```vue
<script setup lang="ts">
import type { PlotLayer } from '@edubeam/plot'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
// a `frame` egy kiszámított számítómag, a `step` az aktuális szakasz: a teljes komponens a Diák és jegyzetek oldalon van
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

Az alapértelmezés szerint bekapcsolt `animate` mellett a rétegek beúsznak, a rudak pedig egyik végüktől a másikig kirajzolódnak. `prefers-reduced-motion` mellett semmi sem animálódik. A [Diák és jegyzetek](/hu/plot/slides) oldal ezt a rajzot egy diasorba teszi.

## Értékek az ábrákon {#diagram-values}

Minden érték közvetlenül a hozzá tartozó ordináta vége mögé kerül, ahogy a tankönyvek feliratozzák az ábrákat: minden nem nulla rúdvégen, a közbenső szélső értékeknél, ugrásnál mindkét oldalon, merev saroknál pedig egyszer. Az értékek puszta számok a megjelenítési mértékegységben (N és V esetén kN, M esetén kNm), ahogy a támaszerők is, az EduBeam alkalmazáshoz hasonlóan; mértékegység csak a megadott mennyiségek mellett szerepel: a terheknél, a támaszsüllyedéseknél és a hőmérséklet-változásoknál. Az a felirat, amely átfedne egy másik feliratot, egy rudat vagy egy nyilat, ugyanannál az ordinátavégnél más helyeket próbál ki, és ha egyik sem szabad, kimarad, így két szám soha nem kerül egymásra. A terhek és a támaszerők értékei kerülnek elsőként a helyükre, így az ábrák számai soha nem szorítják ki őket. A rúderők a rácsos tartónál soha nem maradnak ki: elcsúsznak a rúd mentén, átkerülnek a másik oldalra, végső esetben pedig kisebbek lesznek.

A `result-label-mode="axis"` az értékeket az ordinátáik mentén forgatja el, ahogy az EduBeam alkalmazás írja őket. Ha az olvasó válthat a két mód között, add meg a `:reserve-label-modes="['horizontal', 'axis']"` értéket, hogy a rajz váltáskor ne mozduljon el.

## Támaszerők mint ismeretlenek {#reactions-as-unknowns}

Egy feladatlap a támaszerőket kérdezi, ezért érték nélkül kell mutatnia őket. A `reaction-labels="names"` minden irányhoz, amelyet a támasz gátol, egy nyilat rajzol, amely a pozitív irányba mutat: a csomópont x tengelye mentén (jobbra, hacsak a támasz nincs elforgatva), felfelé, a befogási nyomatéknál pedig az óramutató járásával ellentétesen. Mindegyik a csomópontjáról kapja a nevét – *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* –, dőlt betűvel és valódi alsó indexszel. Így minden válasz előjele a rajzon definiált: az ellenkező irányban ható támaszerő negatív.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![Fent egy egyik végén befogott, másik végén görgős támaszú tartó feladatlapként: befogás A-ban, görgős támasz B-ben, a támaszköz közepén 40 kN, láncméretezés 3 m-rel és 3 m-rel, 6 m teljes hosszal, a támaszerők pedig A_x, A_z, M_A és B_z nevű nyilakként. Lent ugyanez a tartó az alapértelmezett támaszerő-feliratokkal: 27,5 és 12,5 felfelé, 45-ös befogási nyomaték, a hajlítónyomaték pedig a befogásnál lévő −45-től az erő alatti 37,5-ig](/screenshots/hu/p4-plot-reaction-names.webp){.shot-lg}

A nevekhez nem kellenek eredmények, így egy ki nem számított modell is megrajzolható feladatlapként. A megoldókulcshoz hagyd a `reactionLabels` értékét `'values'`-on. A nevek és az értékek különböző helyet foglalnak (a nulla értékű vízszintes támaszerőnek a feladatlapon van neve, a megoldókulcsban viszont nincs nyila), ezért a kettő között váltó rajz a `:reserve-reaction-labels="['names', 'values']"` beállítással hagyjon helyet mindkettőnek: a rajz így a helyén marad, és csak a feliratok változnak. A [Feladatok és dolgozatok](/hu/plot/exercises#the-exercise-in-a-page) oldal feladatkártyája egy `answers` proppal vált közöttük, ahogy a webhely [gyakorló feladatai](/hu/practice) is, amikor a hallgató a megoldást kéri.

## Bélyegképek {#thumbnails}

A `compact` körülbelül 400 × 200 px-es csempékhez rajzol: kisebb jelekkel és 11,5 px-es szöveggel, rudanként legfeljebb két értékkel, a megoszló terheket pedig csak a nagyságukkal feliratozza, `q =` nélkül.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

A webhely [Példák](/hu/examples/) oldalának ábrái is így készültek.

## Méret {#size}

A rajz megméri a tárolóját, és annak szélességéhez igazítja az elrendezést, valódi pixelekben. `height` nélkül a magassága a rajzhoz igazodik, legfeljebb a `maxHeight` értékéig, amely alapértelmezés szerint $\max(320;\ 0{,}75 \times \text{szélesség})$. Amíg nem tudja megmérni a tárolót, például a szerveren, a `width` értékét használja, alapértelmezés szerint 640 px-et.

| Prop | Alapérték | Mit állít be |
| --- | --- | --- |
| `width` | 640, compact 400 | az elrendezés szélességét, amíg a tárolót meg nem méri, px |
| `height` | a rajzhoz igazodik | rögzített magasságot, px |
| `maxHeight` | $\max(320;\ 0{,}75w)$, compact nincs | az automatikus magasság felső korlátját |
| `padding` | 6 | a rajz körüli térközt, px |
| `fontSize` | 13, compact 11.5 | a betűméretet, px |
| `diagramSize` | 48, compact 26 | a legnagyobb ordináta hosszát, px |
| `deformedSize` | 30, compact 18 | a deformált alak legnagyobb elmozdulását, px |

### Több rajz azonos léptékben {#several-plots-at-one-scale}

Minden rajz a saját legnagyobb értékéhez skálázza az ábráit, így egy 20 kNm-es nyomaték ugyanakkorának látszik, mint egy 80 kNm-es. Összehasonlításhoz rögzítsd a léptéket pixel/SI-egységben a `diagramScale` segítségével:

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // az Első lépésekből: (támaszköz m, q kN/m) => kiszámított számítómag

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0,5 px/kNm (0.5e-3 px/N·m): a 8 m-es támaszköz 80 kNm-es nyomatéka 40 px mély, a 4 m-esé (20 kNm) 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## Mértékegységek és számok {#units-and-numbers}

Belül minden érték SI-egységben van, és csak megjelenítéskor váltódik át: alapértelmezés szerint kN, kNm, kN/m, m, mm, mrad és K egységre. Bármelyik mértékegységet felülírhatod egy jellel és egy szorzóval, ahol a megjelenített érték = SI-érték × szorzó:

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

A számokat egy `Intl.NumberFormat` formázza, alapértelmezés szerint angolul, legfeljebb egy tizedesjeggyel. Adj át sajátot, amely illik az oldal nyelvéhez:

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

A mínuszjelek valódi mínuszjelek (−), és a nullára kerekedő érték soha nem jelenik meg −0-ként. A mértékegységek nevei: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` és `temperature`; kiindulópontként a könyvtár exportálja a `KN_UNITS` és az `SI_UNITS` készletet.

## Értékek leolvasása {#reading-values}

`hover` mellett a rajz a mutató alatti rúdpontban olvassa le a megjelenített eredményeket. Minden értéket ott jelöl meg, ahol ki van rajzolva: egy ponttal minden látható ábra ordinátájának végén (ugrásnál mindkét végen) vagy a deformált alakon, és egy címkében felsorolja őket, például `M = 54 kNm`, ugrásnál pedig mindkét oldalt: `V = 13.3 → −6.7 kN`. A mutató az ábrája fölötti bármely pontról kiválasztja a rudat, nem csak magán a rúdon. A rajz az értékeket adatként is kibocsátja:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // a Diák és jegyzetek oldalról: () => kiszámított számítómag

const frame = portalFrame()
const reading = ref<Readout | null>(null)
</script>

<template>
  <StructurePlot :solver="frame" :layers="['members', 'supports', 'M']" hover @readout="reading = $event" />
  <p v-if="reading">
    Member {{ reading.member }}, {{ reading.x.toFixed(2) }} m from its start:
    M = {{ (reading.values.M.left / 1e3).toFixed(1) }} kNm
  </p>
</template>
```

A leolvasás alakja `{ member, x, px, py, values, u }`: a rúd, a rúd mentén mért távolság méterben, a pont a képernyőn px-ben, `{ left, right }` az `N`, `V`, `M` és `w` mindegyikére SI-egységekben, valamint az `u` tengelyirányú elmozdulás. Ha a mutató elhagyja a rajzot, a leolvasás `null`. A webhely élő rajzai `hover` beállítással működnek: mutass rá valamelyikre.

`hover` nélkül a rajz egyáltalán nem csatol eseménykezelőket, így az oldal görgethető fölötte, és egy linkben lévő rajzra koppintva a link megnyílik. `hover` mellett a rajz csak a mutatóeseményekre (pointer events) figyel, és érintőképernyőn továbbra is működik a függőleges görgetés és a kétujjas nagyítás.

## Akadálymentesség {#accessibility}

Minden rajz egy `<svg role="img">` elem, amelynek a nevét a `title` prop adja, ennek hiányában pedig annak leírása, amit a rajz mutat, például „Structure with its loads, reactions, bending moment”. A rejtett, lefoglalt rétegek `aria-hidden` attribútumot kapnak.
