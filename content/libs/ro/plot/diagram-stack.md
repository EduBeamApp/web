---
title: DiagramStack
description: "Cu DiagramStack desenezi grinda deasupra diagramelor V(x), M(x) și w(x), pe aceeași axă x, citești rândurile cu un cursor și îl lași pe cititor să tragă o forță concentrată."
order: 3
source: site
---

# DiagramStack

`DiagramStack` desenează figura din orice manual de statică: o grindă dreaptă cu reazemele, încărcările și reacțiunile ei, iar sub ea, pe aceeași axă x, forța tăietoare V(x), momentul încovoietor M(x) și săgeata w(x). Un cursor citește toate rândurile deodată, iar o forță concentrată opțională poate fi trasă de-a lungul grinzii.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: o grindă simplu rezemată cu deschiderea de 6 m și o forță de 20 kN pe care cititorul o poate trage, aici la 4,3 m de reazemul din stânga; reacțiuni de 5,7 kN și 14,3 kN, forța tăietoare cu salt de la 5,7 kN la −14,3 kN sub forță, momentul încovoietor cu maximul de 24,4 kNm în același punct și săgeata cu valoarea maximă de 17 mm](/screenshots/ro/p2p-plot-diagram-stack.webp){.shot-lg}

Barele trebuie să formeze o singură linie orizontală, definită de la stânga la dreapta. Orice altceva, o linie înclinată sau frântă ori o bară definită de la dreapta la stânga, este respins cu o eroare în loc să fie desenat greșit, pentru că axa x a figurii este axa grinzii. Toate props-urile sunt descrise în [API-ul componentelor](/ro/plot/components#diagramstack).

## Rânduri {#rows}

| Prop | Implicit | Stabilește |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | diagramele, de sus în jos; este disponibil și `'N'` |
| `loadRow` | `true` | grinda cu reazemele, încărcările și reacțiunile ei, deasupra rândurilor |
| `members` | toate barele | barele care formează linia grinzii, când modelul are și altele |
| `rowHeights` | N 100, V 116, M 128, w 76 px | înălțimile rândurilor; puțin mai mici sub 560 px lățime |
| `maxHeight` | niciuna | rândurile se micșorează, cel mult până la 60 %, ca figura să încapă; textul își păstrează mărimea |
| `ranges` | domeniul propriu al fiecărui rând | domenii fixe de valori pe rând, în unități SI |

V și N se desenează pozitiv în sus, M și w pozitiv în jos, ca în majoritatea manualelor: un moment pozitiv (cu fibra inferioară întinsă) și o săgeată în jos stau sub axă. Fiecare rând își scrie valorile extreme.

## Cursorul de citire {#the-reading-cursor}

`hover` este activat implicit. Când miști cursorul peste figură, o linie verticală traversează toate rândurile, iar valoarea fiecărui rând apare într-o etichetă rotunjită. La mai puțin de 8 px de un salt, la o forță concentrată sau la un reazem, cursorul se aliniază la el, iar V arată ambele valori, ca `5.7 → −14.3 kN` sub forța din figura de mai sus. Valorile sunt și emise ca eveniment:

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

O citire are forma `{ x, values }`: `x` în metri de-a lungul grinzii și `{ left, right }` pentru fiecare rând, în unități SI; `null` când cursorul iese din figură.

## O forță pe care cititorul o trage {#a-load-the-reader-can-drag}

Dă-i lui `v-model:load-at` poziția unei forțe concentrate și forța primește un mâner: cititorul o trage cu cursorul sau o selectează și folosește tastele săgeți. Componenta raportează doar noua poziție. Calculează din nou grinda cu forța în acel punct și transmite înapoi noul `solver`, cum face `MovingLoad.vue`:

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** Grinda calculată, cu forța concentrată la `at` metri de A. */
const solveWithLoadAt = (at: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamConcentratedLoad(1, [0, P, 0, at], true)
  solver.solve()
  return solver
}

/** Domeniul fiecărui rând pentru toate pozițiile forței, ca diagramele să crească și să scadă în loc să se rescaleze. */
const rows: StackRow[] = ['V', 'M', 'w']
const envelope = (() => {
  const ranges: Partial<Record<StackRow, [number, number]>> = {}
  for (let at = 0.25; at < L; at += 0.25) {
    const model = modelFromSolver(solveWithLoadAt(at))
    const line = beamLine(model)
    for (const row of rows) {
      const [lo, hi] = rowRange(lineDiagram(model, line, row))
      const [min, max] = ranges[row] ?? [0, 0]
      ranges[row] = [Math.min(min, lo), Math.max(max, hi)]
    }
  }
  return ranges
})()

const at = ref(2)
const solver = computed(() => solveWithLoadAt(at.value))
</script>

<template>
  <DiagramStack v-model:load-at="at" :solver="solver" :rows="rows" :ranges="envelope" load-label="P = 20 kN" />
  <p>The load is {{ at.toFixed(2) }} m from A.</p>
</template>
```

Cu forța la 4,3 m, figura arată reacțiunile de 5,7 kN și 14,3 kN, saltul forței tăietoare de la 5,7 la −14,3 kN sub forță și $M = 5{,}67 \cdot 4{,}3 = 24{,}4$ kNm în acel punct. Fără `ranges`, fiecare rând s-ar rescala la propriile extreme pe măsură ce forța se mută, și ar părea că diagramele nu se schimbă deloc.

| Prop | Implicit | Stabilește |
| --- | --- | --- |
| `loadAt` | niciuna | poziția forței, în m de la începutul liniei; cu `v-model:load-at` |
| `loadLabel` | `P = …` | textul de lângă mâner |
| `loadStep` | 0.05 | pasul în m la care se rotunjește tragerea; tastele săgeți mută forța cu acest pas |

Mânerul este un element `role="slider"` care poate primi focus și le comunică cititoarelor de ecran domeniul și poziția lui. Tastele săgeți îl mută cu `loadStep`, Page Up și Page Down cu 1 m, iar Home și End la capetele grinzii. Pe un ecran tactil poate fi tras cu degetul, iar derularea pe verticală peste figură funcționează în continuare.

Mânerul ține locul forței concentrate pe care modelul calculat o are în `loadAt`: forța este desenată ca mâner și etichetată cu valoarea ei, dacă nu dai `loadLabel`. Pune forța în model în aceeași poziție, cum face `solveWithLoadAt`.

## Dimensiune și randare pe server {#size-and-server-rendering}

Figura își măsoară containerul și se așază la lățimea lui, de cel puțin 320 px. Până să-l poată măsura, folosește `width`, implicit 720 px. Textul are 12,5 px (`fontSize`) și nu se micșorează niciodată odată cu figura.
