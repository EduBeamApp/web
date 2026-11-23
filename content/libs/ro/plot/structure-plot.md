---
title: StructurePlot
description: "Grindă, cadru sau grindă cu zăbrele în StructurePlot: straturi, figuri construite pas cu pas, reacțiuni ca necunoscute, miniaturi, mărimea figurii, unități și citirea valorilor."
order: 2
group: Componente
source: site
---

# StructurePlot

`StructurePlot` desenează o structură întreagă, încadrată în lățimea containerului: bare, articulații, reazeme, încărcări, reacțiuni, diagramele N, V și M și deformata. Dă-i un `solver` sau [modelul simplu](/ro/plot/model) obținut din el și spune ce să deseneze.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Fiecare prop, cu tipul și valoarea lui implicită, este descris în [API-ul componentelor](/ro/plot/components#structureplot).

Figura de mai jos este un `StructurePlot` cu `nodeLabels` și `dimensions` activate, cu `hover` activat și cu formatul numeric al acestui site, de patru cifre semnificative: comută între rezultate și arată cu cursorul spre o bară ca să-i citești valorile.

::model-figure{caption="Un cadru portal: articulat la baza stâlpilor, 10 kN/m pe riglă, 15 kN în B"}
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

## Straturi {#layers}

Un desen este alcătuit din straturi, desenate într-o ordine fixă, indiferent de ordinea în care le enumeri:

| Strat | Desenează |
| --- | --- |
| `members` | barele, cu articulațiile ca cerculețe |
| `supports` | un simbol pentru fiecare reazem, rotit la reazemele înclinate |
| `loads` | încărcările nodale și pe elemente, variațiile de temperatură și cedările de reazem, cu valorile lor |
| `reactions` | reacțiunile, ca săgeți drepte și curbe cu valorile lor; sau, cu `reactionLabels: 'names'`, ca [necunoscutele denumite](#reactions-as-unknowns) ale unui exercițiu |
| `nodes` | fiecare nod ca un cerculeț |
| `nodeLabels` | etichetele nodurilor |
| `dimensions` | cote în lanț, ca într-un enunț de exercițiu: fiecare porțiune dintre noduri și forțe concentrate sub structură, fiecare nivel în dreapta ei și cota totală pe un al doilea rând |
| `N`, `V`, `M` | diagramele de forță axială, forță tăietoare și moment încovoietor |
| `w` | deformata |

Dacă omiți `layers`, desenul arată barele, reazemele, încărcările și reacțiunile, plus un rezultat ales pentru structură: `M` pentru grinzi și cadre, `N` pentru o grindă cu zăbrele și `w` când nimic nu preia forțe, de exemplu când o grindă liberă se dilată sub o variație de temperatură.

Diagramele arată ca în aplicația EduBeam: N și V sunt hașurate transversal pe bară, iar M este desenat de partea fibrei întinse, așa că un moment pozitiv (cu fibra inferioară întinsă) stă sub grindă. `:moment-on-tension-side="false"` desenează M de partea fibrei comprimate. O grindă cu zăbrele arată efortul din fiecare bară o singură dată, de-a lungul barei, colorat după semn.

## Figuri construite pas cu pas {#figures-that-build-up}

`reserve` enumeră straturile pentru care se păstrează loc cât timp sunt ascunse. Desenul așază de la început fiecare strat rezervat, așa că atunci când îl activezi, apare treptat exact unde îi e locul și nimic altceva nu se mișcă:

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
// `frame` este un solver calculat, iar `step` etapa curentă: componenta întreagă este pe pagina Slide-uri și note de curs
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

Cu `animate`, activat implicit, straturile apar treptat, iar barele se desenează de la un capăt la celălalt. La `prefers-reduced-motion` nu se animă nimic. [Slide-uri și note de curs](/ro/plot/slides) pune această figură într-o prezentare.

## Valorile de pe diagrame {#diagram-values}

Fiecare valoare se scrie imediat dincolo de vârful ordonatei căreia îi aparține, așa cum se cotează o diagramă în manual: la fiecare capăt de bară cu valoare nenulă, la extremele dintre ele, ambele valori la un salt și o singură dată la un colț rigid. Valorile sunt numere simple în unitatea de afișare (kN pentru N și V, kNm pentru M), la fel ca reacțiunile, ca în aplicația EduBeam; unitățile se scriu doar la mărimile date: încărcări, cedări de reazem și variații de temperatură. O etichetă care s-ar suprapune peste altă etichetă, peste o bară sau peste o săgeată încearcă alte poziții la același vârf și este omisă dacă niciuna nu e liberă, așa că două numere nu stau niciodată unul peste altul. Valorile încărcărilor și ale reacțiunilor sunt așezate primele, așa că numerele diagramelor nu le împing niciodată afară. Eforturile din barele grinzilor cu zăbrele nu sunt omise niciodată: alunecă de-a lungul barei, trec pe partea cealaltă și, în ultimă instanță, se micșorează.

`result-label-mode="axis"` rotește valorile ca să fie scrise de-a lungul ordonatelor lor, cum le scrie aplicația EduBeam. Dacă cititorul poate comuta între cele două moduri, dă `:reserve-label-modes="['horizontal', 'axis']"`, ca desenul să nu se miște la comutare.

## Reacțiunile ca necunoscute {#reactions-as-unknowns}

Un enunț de exercițiu cere reacțiunile, deci ar trebui să le arate fără valori. `reaction-labels="names"` desenează o săgeată pentru fiecare direcție blocată de un reazem, orientată în sensul considerat pozitiv: după axa x a nodului (spre dreapta, dacă reazemul nu e rotit), în sus și în sens antiorar pentru momentul din încastrare. Fiecare poartă numele nodului ei, *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*, cu italice și cu un indice adevărat. Semnul fiecărui răspuns este astfel definit pe desen: o reacțiune care acționează în sens opus este negativă.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![Sus, o grindă încastrată și simplu rezemată, ca enunț de exercițiu: încastrare în A, reazem simplu în B, 40 kN la mijlocul deschiderii, cote în lanț de 3 m și 3 m, cu 6 m în total, și reacțiunile desenate ca săgeți denumite A_x, A_z, M_A și B_z. Jos, aceeași grindă cu etichetele implicite ale reacțiunilor: 27,5 și 12,5 în sus, un moment în încastrare de 45 și momentul încovoietor de la −45 la încastrare la 37,5 sub forță](/screenshots/ro/p4-plot-reaction-names.webp){.shot-lg}

Denumirile nu au nevoie de rezultate, așa că un model care nu a fost calculat poate fi desenat ca enunț. Pentru barem, lasă `reactionLabels` pe `'values'`. Denumirile și valorile ocupă spațiu diferit (o reacțiune orizontală nulă are nume pe enunț, dar nicio săgeată în barem), așa că un desen care comută între ele ar trebui să facă loc pentru ambele cu `:reserve-reaction-labels="['names', 'values']"`: desenul rămâne atunci pe loc și se schimbă doar etichetele. Fișa de exercițiu din [Exerciții și teste](/ro/plot/exercises#the-exercise-in-a-page) comută între ele cu un prop `answers`, la fel ca pagina [Probleme de statică](/ro/practice) de pe acest site când studentul cere rezolvarea.

## Miniaturi {#thumbnails}

`compact` desenează pentru casete de circa 400 × 200 px: simboluri mai mici și text de 11,5 px, cel mult două valori pe bară, iar încărcările distribuite sunt etichetate doar cu valoarea lor, fără `q =`.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

[Galeria de exemple](/ro/examples/) a acestui site este desenată astfel.

## Dimensiune {#size}

Desenul își măsoară containerul și se așază la lățimea lui, în pixeli reali. Fără `height`, înălțimea urmează desenul, până la `maxHeight`, implicit $\max(320;\ 0{,}75 \times \text{lățimea})$. Până să poată măsura, de exemplu pe server, folosește `width`, implicit 640 px.

| Prop | Implicit | Stabilește |
| --- | --- | --- |
| `width` | 640, compact 400 | lățimea de așezare până când containerul este măsurat, px |
| `height` | urmează desenul | o înălțime fixă, px |
| `maxHeight` | $\max(320;\ 0{,}75w)$, compact niciuna | limita superioară a înălțimii automate |
| `padding` | 6 | spațiul din jurul desenului, px |
| `fontSize` | 13, compact 11.5 | mărimea textului, px |
| `diagramSize` | 48, compact 26 | lungimea celei mai mari ordonate, px |
| `deformedSize` | 30, compact 18 | cea mai mare deplasare a deformatei, px |

### Mai multe desene la aceeași scară {#several-plots-at-one-scale}

Fiecare desen își scalează diagramele la propria valoare maximă, așa că un moment de 20 kNm pare la fel de mare ca unul de 80 kNm. Ca să le compari, fixează scara în pixeli pe unitate SI cu `diagramScale`:

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // din Primii pași: (deschidere m, q kN/m) => un solver calculat

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0,5 px pe kNm (0.5e-3 px pe N·m): cei 80 kNm ai deschiderii de 8 m au 40 px, cei 20 kNm ai deschiderii de 4 m au 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## Unități și numere {#units-and-numbers}

Valorile sunt în SI în interior și se convertesc doar pentru afișare: implicit în kN, kNm, kN/m, m, mm, mrad și K. Poți înlocui orice unitate cu un simbol și o scară, iar valoarea afișată = valoarea SI × scara:

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

Numerele trec printr-un `Intl.NumberFormat`, implicit în engleză, cu cel mult o zecimală. Transmite-l pe al tău, potrivit limbii paginii:

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

Semnele minus sunt minusuri adevărate (−), iar o valoare care se rotunjește la zero nu apare niciodată ca −0. Numele unităților sunt `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` și `temperature`; `KN_UNITS` și `SI_UNITS` sunt exportate ca puncte de pornire.

## Citirea valorilor {#reading-values}

Cu `hover`, desenul citește rezultatele afișate în punctul de pe bară aflat sub cursor. Marchează fiecare valoare acolo unde este desenată, cu un punct la vârful ordonatei fiecărei diagrame afișate (la ambele vârfuri, la un salt) sau pe deformată, și le enumeră într-o etichetă rotunjită, de exemplu `M = 54 kNm`, sau ambele valori la un salt, `V = 13.3 → −6.7 kN`. Cursorul prinde bara oriunde deasupra diagramei ei, nu doar pe bară. Desenul emite valorile și ca date:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // din Slide-uri și note de curs: () => un solver calculat

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

O citire are forma `{ member, x, px, py, values, u }`: bara, poziția de-a lungul ei în metri, punctul de pe ecran în px, `{ left, right }` pentru fiecare dintre `N`, `V`, `M` și `w`, în unități SI, și deplasarea axială `u`. Este `null` când cursorul iese din desen. Figurile interactive de pe acest site folosesc `hover`: arată spre una dintre ele.

Fără `hover`, desenul nu atașează niciun listener de evenimente, așa că pagina se derulează peste el, iar o atingere pe un desen aflat într-un link deschide linkul. Cu `hover`, desenul ascultă doar evenimentele de pointer (pointer events) și lasă să funcționeze în continuare derularea pe verticală și zoomul cu două degete pe ecranele tactile.

## Accesibilitate {#accessibility}

Fiecare desen este un `<svg role="img">` denumit prin prop-ul `title` sau printr-o descriere a ceea ce arată, de exemplu „Structure with its loads, reactions, bending moment”. Straturile rezervate ascunse au `aria-hidden`.
