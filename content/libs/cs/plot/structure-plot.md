---
title: StructurePlot
description: "Nosník, rám nebo příhradová konstrukce se StructurePlot: vrstvy, postupně přibývající obrázky, neznámé reakce v zadání, náhledy, velikost, jednotky a odečet hodnot."
order: 2
group: Komponenty
---

# StructurePlot

`StructurePlot` vykreslí celou konstrukci přizpůsobenou šířce svého kontejneru: prvky, klouby, podpory, zatížení, reakce, průběhy N, V a M a deformovaný tvar. Předejte mu řešič nebo z něj vytvořený [model pro vykreslení](/cs/plot/model) a určete, co se má vykreslit.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Všechny props s typy a výchozími hodnotami najdete v [API komponent](/cs/plot/components#structureplot).

Tento obrázek je `StructurePlot` se zapnutými `nodeLabels` a `dimensions`, s nastaveným `hover` a s formátem čísel tohoto webu na čtyři platné číslice: přepínejte mezi výsledky a najetím ukazatele na prvek odečtěte jeho hodnoty.

::model-figure{caption="Dvoukloubový rám: 10 kN/m na příčli, 15 kN v uzlu B"}
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

Obrázek se skládá z vrstev, které se kreslí v pevném pořadí bez ohledu na to, v jakém pořadí je uvedete:

| Vrstva | Kreslí |
| --- | --- |
| `members` | prvky, klouby jako malá kolečka |
| `supports` | značku každé podpory, u šikmých pootočenou |
| `loads` | uzlová a prvková zatížení, změny teploty a poklesy podpor, s jejich hodnotami |
| `reactions` | reakce jako šipky a obloukové šipky s hodnotami; nebo s `reactionLabels: 'names'` jako [pojmenované neznámé](#reactions-as-unknowns) v zadání příkladu |
| `nodes` | každý uzel jako malé kolečko |
| `nodeLabels` | popisky uzlů |
| `dimensions` | řetězové kóty, jak je uvádí zadání příkladu: všechny úseky mezi uzly a osamělými silami pod konstrukcí, všechna podlaží vpravo od ní a celkový rozměr na druhém řádku |
| `N`, `V`, `M` | průběhy normálové síly, posouvající síly a ohybového momentu |
| `w` | deformovaný tvar |

Když `layers` vynecháte, obrázek nakreslí prvky, podpory, zatížení a reakce a k tomu jeden výsledek zvolený podle konstrukce: `M` pro nosníky a rámy, `N` pro příhradovou konstrukci a `w`, když žádný prvek nepřenáší sílu, jako u nosníku, který se může volně roztahovat při změně teploty.

Průběhy vypadají stejně jako v aplikaci EduBeam: N a V jsou šrafované napříč prvkem a M se kreslí na tažené straně, takže kladný moment, který táhne spodní vlákna, je pod nosníkem. `:moment-on-tension-side="false"` kreslí M naopak na tlačené straně. U příhradové konstrukce je síla v každém prutu napsaná jednou, podél prutu, a barva ukazuje její znaménko.

## Postupně přibývající obrázky {#figures-that-build-up}

`reserve` vyjmenovává vrstvy, pro které se má nechat místo, i když jsou skryté. Obrázek rozvrhne všechny rezervované vrstvy hned od začátku, takže když některou zapnete, plynule se objeví na svém místě a nic jiného se nepohne:

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
// `frame` je spočtený řešič a `step` aktuální krok: celou komponentu najdete na stránce Prezentace a skripta
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

S `animate`, které je ve výchozím stavu zapnuté, se vrstvy plynule objevují a prvky se vykreslují od jednoho konce ke druhému. Při `prefers-reduced-motion` se nic neanimuje. Stránka [Prezentace a skripta](/cs/plot/slides) vkládá tento obrázek do prezentace.

## Hodnoty na průbězích {#diagram-values}

Každá hodnota stojí těsně za koncem pořadnice, ke které patří, tak jak průběhy popisují učebnice: na každém konci prvku, kde není nulová, v extrémech mezi konci, ve skoku obě hodnoty a v tuhém rohu jen jedna. Hodnoty průběhů i reakcí jsou holá čísla v zobrazované jednotce (kN pro N a V, kNm pro M), stejně jako v aplikaci EduBeam. Jednotky se píšou jen u zadaných veličin: u zatížení, poklesů podpor a změn teploty. Popisek, který by překryl jiný popisek, prvek nebo šipku, zkusí jiná místa u téhož konce pořadnice, a pokud žádné není volné, vynechá se, takže se dvě čísla nikdy nepřekrývají. Hodnoty zatížení a reakcí se umisťují jako první, takže je čísla průběhů nikdy nevytlačí. Síly v prutech příhradové konstrukce se nevynechávají nikdy: posunou se podél prutu, přeskočí na jeho druhou stranu a teprve nakonec se zmenší.

`result-label-mode="axis"` natočí hodnoty podél jejich pořadnic, jak je píše aplikace EduBeam. Pokud může čtenář mezi oběma režimy přepínat, zadejte `:reserve-label-modes="['horizontal', 'axis']"`, aby se výkres při přepnutí nepohnul.

## Reakce jako neznámé {#reactions-as-unknowns}

Zadání příkladu se na reakce ptá, takže je má ukázat bez hodnot. `reaction-labels="names"` nakreslí šipku pro každý směr, ve kterém podpora brání pohybu, a to v kladném smyslu: podél osy x uzlu (doprava, pokud podpora není pootočená), nahoru a proti směru hodinových ručiček pro moment ve vetknutí. Každá šipka nese jméno podle svého uzlu, *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*, kurzivou a se skutečným dolním indexem. Znaménko každého výsledku je tak dané výkresem: reakce, která působí opačně, vyjde záporná.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![Nahoře nosník vetknutý v A a podepřený posuvným kloubem v B jako zadání příkladu: síla 40 kN uprostřed rozpětí, řetězové kóty 3 m a 3 m s celkovým rozměrem 6 m a reakce nakreslené jako pojmenované šipky A_x, A_z, M_A a B_z. Dole tentýž nosník s výchozími popisky reakcí: 27,5 a 12,5 nahoru, moment ve vetknutí 45 a ohybový moment od −45 u vetknutí do 37,5 pod silou](/screenshots/cs/p4-plot-reaction-names.webp){.shot-lg}

Jména nepotřebují výsledky, takže jako zadání můžete nakreslit i model, který jste ještě nespočítali. Pro klíč řešení nechte `reactionLabels` na hodnotě `'values'`. Jména a hodnoty zabírají různé místo (vodorovná reakce s nulovou hodnotou má v zadání jméno, ale v klíči žádnou šipku), takže obrázek, který mezi nimi přepíná, by měl nechat místo pro obojí pomocí `:reserve-reaction-labels="['names', 'values']"`: výkres pak zůstane na místě a mění se jen popisky. Karta příkladu na stránce [Příklady a písemky](/cs/plot/exercises#the-exercise-in-a-page) mezi nimi přepíná pomocí prop `answers`, stejně jako stránka [Procvičování](/cs/practice) na tomto webu, když si student nechá ukázat výsledky.

## Náhledy {#thumbnails}

`compact` přizpůsobí kresbu dlaždicím o velikosti zhruba 400 × 200 px: menší značky a text 11,5 px, nejvýše dvě hodnoty na prvek a spojitá zatížení popsaná jen velikostí, bez `q =`.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

Takto je vykreslená [galerie příkladů](/cs/examples/) na tomto webu.

## Velikost {#size}

Obrázek změří svůj kontejner a rozvrhne se na jeho šířku, ve skutečných pixelech. Bez `height` se jeho výška řídí výkresem, nejvýše však `maxHeight`, což je ve výchozím stavu $\max(320;\ 0{,}75 \times \text{šířka})$. Dokud nemůže měřit, například na serveru, použije `width`, ve výchozím stavu 640 px.

| Prop | Výchozí | Nastavuje |
| --- | --- | --- |
| `width` | 640, compact 400 | šířku rozvržení, dokud není kontejner změřen, px |
| `height` | podle výkresu | pevnou výšku, px |
| `maxHeight` | $\max(320, 0.75w)$, compact žádná | horní mez automatické výšky |
| `padding` | 6 | okraj kolem výkresu, px |
| `fontSize` | 13, compact 11.5 | velikost textu, px |
| `diagramSize` | 48, compact 26 | délku největší pořadnice, px |
| `deformedSize` | 30, compact 18 | největší posunutí deformovaného tvaru, px |

### Více obrázků ve stejném měřítku {#several-plots-at-one-scale}

Každý obrázek škáluje průběhy podle své největší hodnoty, takže moment 20 kNm vypadá stejně velký jako 80 kNm. Chcete-li je porovnávat, nastavte pevné měřítko v pixelech na jednotku SI pomocí `diagramScale`:

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // ze stránky Začínáme: (rozpětí m, q kN/m) => spočtený řešič

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0,5 px na kNm (0,5e-3 px na N·m): 80 kNm u rozpětí 8 m má pořadnici 40 px, 20 kNm u rozpětí 4 m 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## Jednotky a čísla {#units-and-numbers}

Uvnitř jsou všechny hodnoty v SI a převádějí se jen pro zobrazení: ve výchozím stavu na kN, kNm, kN/m, m, mm, mrad a K. Kteroukoli jednotku můžete přepsat značkou a měřítkem, přičemž zobrazená hodnota = hodnota v SI × měřítko:

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

Čísla se formátují přes `Intl.NumberFormat`, ve výchozím stavu anglicky s nejvýše jedním desetinným místem. Předejte vlastní formát, který odpovídá jazyku stránky:

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

Záporná čísla mají skutečné znaménko minus (−) a hodnota, která se zaokrouhlí na nulu, se nikdy nezobrazí jako −0. Jednotky se jmenují `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` a `temperature`; jako výchozí bod se exportují `KN_UNITS` a `SI_UNITS`.

## Odečítání hodnot {#reading-values}

S `hover` obrázek odečte zobrazené výsledky v bodě prvku pod ukazatelem. Každou hodnotu vyznačí tam, kde je nakreslená, tečkou na konci pořadnice každého zobrazeného průběhu (ve skoku na obou koncích) nebo na deformovaném tvaru, a vypíše je do štítku, například `M = 54 kNm`, ve skoku obě strany, `V = 13.3 → −6.7 kN`. Ukazatel zachytí prvek kdekoli nad jeho průběhem, nejen přímo na prvku. Obrázek hodnoty také emituje jako data:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // ze stránky Prezentace a skripta: () => spočtený řešič

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

Odečet (`Readout`) má tvar `{ member, x, px, py, values, u }`: prvek, poloha na něm v metrech, bod na obrazovce v px, `{ left, right }` pro každou z veličin `N`, `V`, `M` a `w` v jednotkách SI a osové posunutí `u`. Když ukazatel z obrázku odjede, je `null`. Živé obrázky na tomto webu `hover` používají: najeďte na některý z nich.

Bez `hover` obrázek nepřipojí vůbec žádné posluchače událostí, takže se stránka nad ním normálně posouvá a klepnutí na obrázek uvnitř odkazu otevře odkaz. S `hover` naslouchá jen událostem ukazatele a na dotykových displejích zachová svislé posouvání i zvětšování dvěma prsty.

## Přístupnost {#accessibility}

Každý obrázek je `<svg role="img">` pojmenovaný podle prop `title`, nebo popisem toho, co ukazuje, například „Structure with its loads, reactions, bending moment“. Tento výchozí název je anglický; web nebo aplikace ho mohou nahradit textem ve svém jazyce přes injection key `PLOT_TEXTS` z `@edubeam/plot`, a proto české obrázky na tomto webu říkají „Konstrukce: zatížení, reakce, ohybové momenty“. Prop `title` má přednost před obojím. Skryté rezervované vrstvy mají `aria-hidden`.
