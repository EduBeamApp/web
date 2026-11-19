---
title: Scripts and servers
description: "Use @edubeam/fem from Node: an exercise sheet with its answer key, an influence line written to CSV, and a small HTTP endpoint that solves beams on request."
order: 15
source: site
---

# Scripts and servers

The solver needs no browser. In Node it writes answer keys, runs parameter studies, makes tables for a spreadsheet, or answers requests from a web page.

The examples are TypeScript. Node 22.18 or later runs `.ts` files directly (`node answers.ts`), in a folder set up as in [Install](/solver/getting-started#install); with an older Node, drop the type annotations and save them as `.mjs`.

## An exercise sheet with its answer key {#answer-key}

Twenty variants of one exercise, a simply supported beam under a line load and a point load, each with its reactions and its largest moment, written to a CSV file. The numbers come from the exercise number, so the same script always writes the same sheet:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Exercise i: a simply supported beam under q kN/m and F kN at a m from A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // 4 to 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 or 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 or 20 kN
  const a = L / 4 + (i % 3) // somewhere in the span
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

  // Reactions are the end shears: V(0) at A, -V(L) at B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // The largest moment, from points 1 cm apart
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

Check the first by hand: $R_B = (10 \cdot 5 \cdot 2.5 + 20 \cdot 2.25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, and the shear changes sign under the point load, so the largest moment is there: $36 \cdot 2.25 - 10 \cdot 2.25^2/2 = 55.69$ kNm.

Two choices keep the script short. On a simply supported beam the reactions are the end shears, so no [reaction helper](/solver/results#reactions) is needed. And the largest moment comes from points 1 cm apart, exact here because the extreme falls on a load or within a centimetre of the grid. To draw each exercise, with or without its answers, see [Exercises and tests](/plot/exercises) of @edubeam/plot, which also prints a whole test.

## An influence line as CSV {#an-influence-line-as-csv}

How does the moment over the middle support of a two-span beam change as a 1 kN load crosses it? Build and solve the beam once per load position, and write a row for each:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Two 5 m spans, 1 kN at `at` m from A: the moment over the middle support */
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

The closed form for two equal spans is $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $-0.46875$ kNm at $a = 2.5$ m, and the worst position $a = L/\sqrt{3} = 2.887$ m. The line is symmetric, so the 21 rows end where they began, at 0 over the support C.

A new solver per position is simpler than changing one in place, and costs a few milliseconds. To change a solved model instead, see [Solving again after a change](/solver/solving#solving-again-after-a-change).

## A solver behind an HTTP endpoint

A small server, with nothing but Node's own `http` module, that solves a simply supported beam for any span and load sent to it:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** A simply supported IPE 200, `span` m, `q` kN/m: midspan M and deflection */
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
    // Bad JSON, bad numbers or an unsolvable model: keep the server up
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm and $5qL^4/384EI = 49.63$ mm. The `try` matters: invalid JSON throws, and so may a model the solver cannot solve, and neither should take the server down. A public service would also limit the size of the request and the span.

## In the browser

The same code runs in a page as it is, solving on the reader's device: that is how every live figure on this site works. Import the package through your bundler, Vite or Nuxt for instance, and [draw the results](/solver/drawing) with @edubeam/plot. A model solves in milliseconds, so a page can solve again on every input event.
