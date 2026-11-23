---
title: Skripty a servery
description: "@edubeam/fem v Node: sada príkladov s kľúčom riešení, príčinková čiara zapísaná do CSV a malý HTTP endpoint, ktorý na požiadanie vypočíta nosník."
order: 15
source: site
---

# Skripty a servery {#scripts-and-servers}

Riešič nepotrebuje prehliadač. V Node vám vygeneruje kľúč riešení, vypočíta parametrickú štúdiu, pripraví tabuľky pre tabuľkový procesor alebo odpovedá na požiadavky z webovej stránky.

Príklady sú v TypeScripte. Node 22.18 alebo novší spúšťa súbory `.ts` priamo (`node answers.ts`) v priečinku pripravenom podľa časti [Inštalácia](/sk/solver/getting-started#install); so staršou verziou Node odstráňte typové anotácie a súbory uložte ako `.mjs`.

## Sada príkladov s kľúčom riešení {#answer-key}

Dvadsať variantov jedného príkladu (prostého nosníka so spojitým zaťažením a osamelou silou), každý s reakciami a najväčším momentom, zapísaných do súboru CSV. Čísla sa odvodzujú z čísla príkladu, takže ten istý skript vždy vytvorí rovnakú sadu:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Príklad i: prostý nosník so zaťažením q kN/m a silou F kN vo vzdialenosti a m od A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // 4 až 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 alebo 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 alebo 20 kN
  const a = L / 4 + (i % 3) // niekde v poli
  return { L, q, F, a }
}

const solve = ({ L, q, F, a }: ReturnType<typeof exercise>) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  solver.solve()

  // Reakcie sú priečne sily na koncoch: V(0) v A, -V(L) v B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // Najväčší moment z bodov vzdialených 1 cm
  const { x, M } = beam.computeBendingMoment(lc, L * 100)
  const top = M.indexOf(Math.max(...M))
  return [rA, rB, M[top] / 1e3, x[top]].map((v) => v.toFixed(2))
}

const rows = ['no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m']
for (let i = 1; i <= 20; i++) {
  const ex = exercise(i)
  rows.push([i, ex.L, ex.q, ex.F, ex.a, ...solve(ex)].join(','))
}
writeFileSync('answers.csv', rows.join('\n') + '\n')
```

```text [answers.csv]
no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m
1,5,10,20,2.25,36.00,34.00,55.69,2.25
2,6,15,10,3.5,49.17,50.83,80.58,3.28
3,7,5,20,1.75,32.50,22.50,50.63,2.50
...
```

Skontrolujte prvý riadok ručne: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, a priečna sila mení znamienko pod osamelou silou, takže tam je aj najväčší moment: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Skript je krátky vďaka dvom rozhodnutiam. Pri prostom nosníku sa reakcie rovnajú priečnym silám na koncoch, takže [pomocná funkcia pre reakcie](/sk/solver/results#reactions) nie je potrebná. A najväčší moment sa hľadá v bodoch vzdialených 1 cm, čo tu dáva presný výsledok, pretože extrém leží pod silou alebo do centimetra od bodu delenia. Ako každý príklad vykresliť, s výsledkami alebo bez nich, opisuje stránka [Príklady a písomky](/sk/plot/exercises) dokumentácie @edubeam/plot, ktorá ukazuje aj tlač celej písomky.

## Príčinková čiara ako CSV {#an-influence-line-as-csv}

Ako sa mení moment nad strednou podperou nosníka s dvoma poľami, keď po ňom prechádza sila 1 kN? Pre každú polohu sily nosník zostavte a vyriešte znova a zapíšte jeden riadok:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Dve polia po 5 m, 1 kN vo vzdialenosti `at` m od A: moment nad strednou podperou */
const momentAtB = (at: number): number => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [5, 0, 0], [DofID.Dz])
  domain.createNode('C', [10, 0, 0], [DofID.Dz])
  const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  const [member, x] = at <= 5 ? [1, at] : [2, at - 5]
  solver.loadCases[0].createBeamConcentratedLoad(member, [0, 1e3, 0, x], true)
  solver.solve()
  return span1.computeBendingMomentAt(solver.loadCases[0], 5)
}

const rows = ['x_m,MB_kNm_per_kN']
for (let at = 0; at <= 10; at += 0.5) {
  rows.push(`${at},${(momentAtB(at) / 1e3).toFixed(4)}`)
}
writeFileSync('influence.csv', rows.join('\n') + '\n')
```

```bash
node influence.ts
```

```text [influence.csv]
x_m,MB_kNm_per_kN
0,0.0000
0.5,-0.1237
1,-0.2400
1.5,-0.3412
2,-0.4200
2.5,-0.4688
3,-0.4800
...
```

Riešenie v uzavretom tvare pre dve rovnaké polia je $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $-0{,}46875$ kNm pre $a = 2{,}5$ m, pričom najnepriaznivejšia poloha je $a = L/\sqrt{3} = 2{,}887$ m. Čiara je symetrická, takže tabuľka s 21 riadkami končí rovnako, ako začala: nulou nad podperou C.

Vytvoriť pre každú polohu nový riešič je jednoduchšie ako meniť ten existujúci a stojí to len niekoľko milisekúnd. Ako naopak zmeniť už vyriešený model, opisuje [Nový výpočet po zmene](/sk/solver/solving#solving-again-after-a-change).

## Riešič za HTTP endpointom {#a-solver-behind-an-http-endpoint}

Malý server, len so vstavaným modulom `http` z Node, ktorý vypočíta prostý nosník pre ľubovoľné rozpätie a zaťaženie, ktoré mu pošlete:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Prostý nosník IPE 200, rozpätie `span` m, `q` kN/m: M a priehyb v strede */
const solveBeam = (span: number, q: number) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [span, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  solver.solve()
  return {
    momentKNm: beam.computeBendingMomentAt(lc, span / 2) / 1e3,
    deflectionMm: beam.computeLocalDefl(lc, 2).w[1] * 1e3,
  }
}

createServer(async (req, res) => {
  try {
    let body = ''
    for await (const chunk of req) body += chunk
    const { span, q } = JSON.parse(body) as { span?: unknown; q?: unknown }
    if (typeof span !== 'number' || !(span > 0) || typeof q !== 'number') {
      throw new Error('Bad input')
    }
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(solveBeam(span, q)) + '\n')
  } catch {
    // Chybný JSON, chybné čísla alebo neriešiteľný model: server musí bežať ďalej
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm a $5qL^4/384EI = 49{,}63$ mm. Na bloku `try` záleží: neplatný JSON vyhodí výnimku a môže ju vyhodiť aj model, ktorý riešič nedokáže vyriešiť. Ani jedno nesmie server zhodiť. Verejná služba by navyše mala obmedziť veľkosť požiadavky aj rozpätie.

## V prehliadači {#in-the-browser}

Ten istý kód pobeží bez zmeny aj na webovej stránke a bude počítať na zariadení čitateľa: presne tak fungujú všetky živé obrázky na tomto webe. Balík importujte cez svoj bundler, napríklad Vite alebo Nuxt, a [výsledky vykreslite](/sk/solver/drawing) pomocou @edubeam/plot. Model sa vyrieši za niekoľko milisekúnd, takže stránka môže počítať znova pri každej udalosti `input`.
