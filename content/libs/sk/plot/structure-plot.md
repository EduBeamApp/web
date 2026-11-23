---
title: StructurePlot
description: "Nosník, rám alebo priehradová konštrukcia so StructurePlot: vrstvy, obrázky po krokoch, neznáme reakcie v zadaní, náhľady, veľkosť, jednotky a odčítanie hodnôt."
order: 2
group: Komponenty
source: site
---

# StructurePlot

`StructurePlot` vykreslí celú konštrukciu prispôsobenú šírke svojho kontajnera: prvky, kĺby, podpery, zaťaženie, reakcie, priebehy N, V a M a deformovaný tvar. Odovzdajte mu riešič alebo z neho vytvorený [model na vykreslenie](/sk/plot/model) a určte, čo sa má vykresliť.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Všetky props s typmi a predvolenými hodnotami nájdete v [API komponentov](/sk/plot/components#structureplot).

Tento obrázok je `StructurePlot` so zapnutými `nodeLabels` a `dimensions`, s nastaveným `hover` a s formátom čísel tohto webu na štyri platné číslice: prepínajte medzi výsledkami a ukážte na prvok, aby ste odčítali jeho hodnoty.

::model-figure{caption="Dvojkĺbový rám: 10 kN/m na nosníku, 15 kN v uzle B"}
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

## Vrstvy {#layers}

Obrázok sa skladá z vrstiev, ktoré sa kreslia v pevnom poradí bez ohľadu na to, v akom poradí ich uvediete:

| Vrstva | Kreslí |
| --- | --- |
| `members` | prvky, kĺby ako malé krúžky |
| `supports` | značku každej podpery, pri šikmých pootočenú |
| `loads` | uzlové a prvkové zaťaženia, zmeny teploty a poklesy podpier, s ich hodnotami |
| `reactions` | reakcie ako šípky a oblúkové šípky s hodnotami; alebo s `reactionLabels: 'names'` ako [pomenované neznáme](#reactions-as-unknowns) v zadaní príkladu |
| `nodes` | každý uzol ako malý krúžok |
| `nodeLabels` | popisy uzlov |
| `dimensions` | reťazové kóty, ako ich uvádza zadanie príkladu: všetky úseky medzi uzlami a osamelými silami pod konštrukciou, všetky podlažia vpravo od nej a celkový rozmer na druhom riadku |
| `N`, `V`, `M` | priebehy normálovej sily, priečnej sily a ohybového momentu |
| `w` | deformovaný tvar |

Ak `layers` vynecháte, obrázok nakreslí prvky, podpery, zaťaženie a reakcie a k tomu jeden výsledok zvolený podľa konštrukcie: `M` pre nosníky a rámy, `N` pre priehradovú konštrukciu a `w`, keď žiadny prvok neprenáša silu, ako pri nosníku, ktorý sa pri zmene teploty môže voľne predĺžiť.

Priebehy vyzerajú rovnako ako v aplikácii EduBeam: N a V sú šrafované naprieč prvkom a M sa kreslí na ťahanej strane, takže kladný moment, ktorý ťahá dolné vlákna, je pod nosníkom. `:moment-on-tension-side="false"` kreslí M naopak na tlačenej strane. Pri priehradovej konštrukcii je sila v každom prúte uvedená raz, pozdĺž prúta, a farba ukazuje jej znamienko.

## Postupne pribúdajúce obrázky {#figures-that-build-up}

`reserve` vymenúva vrstvy, pre ktoré sa má nechať miesto, aj keď sú skryté. Obrázok rozloží všetky rezervované vrstvy hneď od začiatku, takže keď niektorú zapnete, plynulo sa objaví na svojom mieste a nič iné sa nepohne:

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
// `frame` je vypočítaný riešič a `step` aktuálny krok: celý komponent nájdete na stránke Prezentácie a skriptá
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

S `animate`, ktoré je predvolene zapnuté, sa vrstvy plynulo objavujú a prvky sa vykresľujú od jedného konca k druhému. Pri `prefers-reduced-motion` sa nič neanimuje. Stránka [Prezentácie a skriptá](/sk/plot/slides) vkladá tento obrázok do prezentácie.

## Hodnoty na priebehoch {#diagram-values}

Každá hodnota stojí tesne za koncom poradnice, ku ktorej patrí, tak ako priebehy popisujú učebnice: na každom konci prvku, kde nie je nulová, v extrémoch medzi koncami, v skoku obe hodnoty a v tuhom rohu iba jedna. Hodnoty priebehov aj reakcií sú holé čísla v zobrazovanej jednotke (kN pre N a V, kNm pre M), rovnako ako v aplikácii EduBeam. Jednotky sa píšu iba pri zadaných veličinách: pri zaťažení, poklesoch podpier a zmenách teploty. Popis, ktorý by prekryl iný popis, prvok alebo šípku, skúsi iné miesta pri tom istom konci poradnice, a ak žiadne nie je voľné, vynechá sa, takže sa dve čísla nikdy neprekrývajú. Hodnoty zaťaženia a reakcií sa umiestňujú ako prvé, takže ich čísla priebehov nikdy nevytlačia. Sily v prútoch priehradovej konštrukcie sa nevynechávajú nikdy: posunú sa pozdĺž prúta, preskočia na jeho druhú stranu a až nakoniec sa zmenšia.

`result-label-mode="axis"` natočí hodnoty pozdĺž ich poradníc, ako ich píše aplikácia EduBeam. Ak môže čitateľ medzi oboma režimami prepínať, zadajte `:reserve-label-modes="['horizontal', 'axis']"`, aby sa výkres pri prepnutí nepohol.

## Reakcie ako neznáme {#reactions-as-unknowns}

Zadanie príkladu sa na reakcie pýta, takže ich má ukázať bez hodnôt. `reaction-labels="names"` nakreslí šípku pre každý smer, v ktorom podpera bráni pohybu, a to v kladnom zmysle: pozdĺž osi x uzla (doprava, ak podpera nie je pootočená), nahor a proti smeru hodinových ručičiek pre moment vo votknutí. Každá šípka nesie názov podľa svojho uzla, *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*, kurzívou a so skutočným dolným indexom. Znamienko každého výsledku je tak dané výkresom: reakcia, ktorá pôsobí opačne, vyjde záporná.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![Hore nosník votknutý v A a podopretý posuvným kĺbom v B ako zadanie príkladu: sila 40 kN v strede rozpätia, reťazové kóty 3 m a 3 m s celkovým rozmerom 6 m a reakcie nakreslené ako pomenované šípky A_x, A_z, M_A a B_z. Dole ten istý nosník s predvolenými popismi reakcií: 27,5 a 12,5 nahor, moment vo votknutí 45 a ohybový moment od −45 pri votknutí po 37,5 pod silou](/screenshots/sk/p4-plot-reaction-names.webp){.shot-lg}

Názvy nepotrebujú výsledky, takže ako zadanie môžete nakresliť aj model, ktorý ste ešte nevypočítali. Pre kľúč riešení nechajte `reactionLabels` na hodnote `'values'`. Názvy a hodnoty zaberajú rôzne miesto (vodorovná reakcia s nulovou hodnotou má v zadaní názov, ale v kľúči žiadnu šípku), takže obrázok, ktorý medzi nimi prepína, by mal nechať miesto pre oboje pomocou `:reserve-reaction-labels="['names', 'values']"`: výkres potom zostane na mieste a menia sa iba popisy. Karta príkladu na stránke [Príklady a písomky](/sk/plot/exercises#the-exercise-in-a-page) medzi nimi prepína pomocou prop `answers`, rovnako ako stránka [Precvičovanie](/sk/practice) na tomto webe, keď si študent nechá ukázať riešenie.

## Náhľady {#thumbnails}

`compact` prispôsobí kresbu dlaždiciam s veľkosťou približne 400 × 200 px: menšie značky a text 11,5 px, najviac dve hodnoty na prvok a spojité zaťaženia popísané iba veľkosťou, bez `q =`.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

Takto je vykreslená [galéria príkladov](/sk/examples/) na tomto webe.

## Veľkosť {#size}

Obrázok zmeria svoj kontajner a rozloží sa na jeho šírku, v skutočných pixeloch. Bez `height` sa jeho výška riadi výkresom, najviac však `maxHeight`, čo je predvolene $\max(320;\ 0{,}75 \times \text{šírka})$. Kým nemôže merať, napríklad na serveri, použije `width`, predvolene 640 px.

| Prop | Predvolené | Nastavuje |
| --- | --- | --- |
| `width` | 640, compact 400 | šírku rozloženia, kým nie je kontajner zmeraný, px |
| `height` | podľa výkresu | pevnú výšku, px |
| `maxHeight` | $\max(320, 0.75w)$, compact žiadna | hornú hranicu automatickej výšky |
| `padding` | 6 | okraj okolo výkresu, px |
| `fontSize` | 13, compact 11.5 | veľkosť textu, px |
| `diagramSize` | 48, compact 26 | dĺžku najväčšej poradnice, px |
| `deformedSize` | 30, compact 18 | najväčšie posunutie deformovaného tvaru, px |

### Viac obrázkov v rovnakej mierke {#several-plots-at-one-scale}

Každý obrázok škáluje priebehy podľa svojej najväčšej hodnoty, takže moment 20 kNm vyzerá rovnako veľký ako 80 kNm. Ak ich chcete porovnávať, nastavte pevnú mierku v pixeloch na jednotku SI pomocou `diagramScale`:

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // zo stránky Začíname: (rozpätie m, q kN/m) => vypočítaný riešič

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0,5 px na kNm (0,5e-3 px na N·m): 80 kNm pri rozpätí 8 m má poradnicu 40 px, 20 kNm pri rozpätí 4 m 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## Jednotky a čísla {#units-and-numbers}

Interne sú všetky hodnoty v jednotkách SI a prevádzajú sa iba na zobrazenie: predvolene na kN, kNm, kN/m, m, mm, mrad a K. Ktorúkoľvek jednotku môžete prepísať značkou a mierkou, pričom zobrazená hodnota = hodnota v SI × mierka:

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

Čísla sa formátujú cez `Intl.NumberFormat`, predvolene podľa angličtiny a s najviac jedným desatinným miestom. Odovzdajte vlastný formát, ktorý zodpovedá jazyku stránky:

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('sk', { maximumFractionDigits: 2 })" />
```

Záporné čísla majú skutočné znamienko mínus (−) a hodnota, ktorá sa zaokrúhli na nulu, sa nikdy nezobrazí ako −0. Jednotky sa volajú `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` a `temperature`; ako východiskový bod sa exportujú `KN_UNITS` a `SI_UNITS`.

## Odčítanie hodnôt {#reading-values}

S `hover` obrázok odčíta zobrazené výsledky v bode prvku pod ukazovateľom. Každú hodnotu vyznačí tam, kde je nakreslená, bodkou na konci poradnice každého zobrazeného priebehu (v skoku na oboch koncoch) alebo na deformovanom tvare, a vypíše ich do štítku, napríklad `M = 54 kNm`, v skoku obe strany, `V = 13.3 → −6.7 kN`. Ukazovateľ zachytí prvok kdekoľvek nad jeho priebehom, nielen priamo na prvku. Obrázok tieto hodnoty posiela aj ako dáta:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // zo stránky Prezentácie a skriptá: () => vypočítaný riešič

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

Odčítanie (`Readout`) má tvar `{ member, x, px, py, values, u }`: prvok, poloha na ňom v metroch, bod na obrazovke v px, `{ left, right }` pre každú z veličín `N`, `V`, `M` a `w` v jednotkách SI a osové posunutie `u`. Keď ukazovateľ z obrázka odíde, je `null`. Živé obrázky na tomto webe `hover` používajú: ukážte na niektorý z nich.

Bez `hover` obrázok nepripojí vôbec žiadne poslucháče udalostí, takže sa stránka nad ním normálne posúva a ťuknutie na obrázok vnútri odkazu otvorí odkaz. S `hover` počúva iba udalosti ukazovateľa a na dotykových obrazovkách zachová zvislé posúvanie aj zväčšovanie dvoma prstami.

## Prístupnosť {#accessibility}

Každý obrázok je `<svg role="img">` pomenovaný podľa prop `title`, inak popisom toho, čo ukazuje, napríklad „Structure with its loads, reactions, bending moment“. Tento predvolený názov je anglický; web alebo aplikácia ho môže nahradiť textom vo svojom jazyku cez injection key `PLOT_TEXTS` z `@edubeam/plot`, a preto slovenské obrázky na tomto webe hovoria „Konštrukcia: zaťaženie, reakcie a ohybové momenty“. Prop `title` má prednosť pred oboma. Skryté rezervované vrstvy majú `aria-hidden`.
