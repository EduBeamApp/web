---
title: Scripturi și servere
description: "Folosește @edubeam/fem din Node: o fișă de exerciții cu barem, o linie de influență scrisă în CSV și un mic endpoint HTTP care calculează grinzi la cerere."
order: 15
source: site
---

# Scripturi și servere {#scripts-and-servers}

Programul de calcul nu are nevoie de browser. În Node scrie bareme, face studii parametrice, generează tabele pentru o foaie de calcul sau răspunde la cereri venite de la o pagină web.

Exemplele sunt în TypeScript. Node 22.18 sau mai nou rulează direct fișierele `.ts` (`node answers.ts`), într-un folder pregătit ca la [Instalare](/ro/solver/getting-started#install); cu un Node mai vechi, șterge adnotările de tip și salvează-le ca `.mjs`.

## O fișă de exerciții cu barem {#answer-key}

Douăzeci de variante ale aceluiași exercițiu, o grindă simplu rezemată sub o încărcare liniară și o forță concentrată, fiecare cu reacțiunile și momentul maxim, scrise într-un fișier CSV. Valorile rezultă din numărul exercițiului, așa că același script scrie întotdeauna aceeași fișă:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Exercițiul i: o grindă simplu rezemată sub q kN/m și F kN la a m de A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // de la 4 la 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 sau 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 sau 20 kN
  const a = L / 4 + (i % 3) // undeva în deschidere
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

  // Reacțiunile sunt forțele tăietoare de la capete: V(0) în A, -V(L) în B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // Momentul maxim, din puncte aflate la 1 cm unul de altul
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

Verifică primul rând prin calcul manual: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, iar forța tăietoare își schimbă semnul sub forța concentrată, deci acolo este momentul maxim: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Două alegeri păstrează scriptul scurt. La o grindă simplu rezemată, reacțiunile sunt forțele tăietoare de la capete, deci nu e nevoie de [funcția ajutătoare pentru reacțiuni](/ro/solver/results#reactions). Iar momentul maxim provine din puncte aflate la 1 cm unul de altul, ceea ce aici este exact, pentru că extremul cade sub o forță sau la cel mult un centimetru de un punct al grilei. Pentru a desena fiecare exercițiu, cu sau fără răspunsuri, vezi [Exerciții și teste](/ro/plot/exercises) din @edubeam/plot, care tipărește și un test întreg.

## O linie de influență în CSV {#an-influence-line-as-csv}

Cum variază momentul de pe reazemul din mijloc al unei grinzi cu două deschideri când o forță de 1 kN o traversează? Construiește și calculează grinda o dată pentru fiecare poziție a forței și scrie câte un rând pentru fiecare:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Două deschideri de 5 m, 1 kN la `at` m de A: momentul de pe reazemul din mijloc */
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

Soluția analitică pentru două deschideri egale este $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $-0{,}46875$ kNm pentru $a = 2{,}5$ m, iar poziția cea mai defavorabilă este $a = L/\sqrt{3} = 2{,}887$ m. Linia este simetrică, așa că cele 21 de rânduri se termină cum au început, cu 0 deasupra reazemului C.

Un program de calcul nou pentru fiecare poziție este mai simplu decât modificarea unuia existent și costă câteva milisecunde. Dacă vrei în schimb să modifici un model deja calculat, vezi [Recalcularea după o modificare](/ro/solver/solving#solving-again-after-a-change).

## Un program de calcul în spatele unui endpoint HTTP {#a-solver-behind-an-http-endpoint}

Un mic server care folosește doar modulul `http` inclus în Node și calculează o grindă simplu rezemată pentru orice deschidere și încărcare primite:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Un IPE 200 simplu rezemat, `span` m, `q` kN/m: M și săgeata la mijlocul deschiderii */
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
    // JSON greșit, valori greșite sau un model care nu poate fi calculat: serverul rămâne pornit
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm și $5qL^4/384EI = 49{,}63$ mm. Blocul `try` contează: un JSON invalid aruncă o excepție, la fel poate face și un model pe care programul de calcul nu îl poate rezolva, și niciuna dintre situații nu trebuie să oprească serverul. Un serviciu public ar limita, de asemenea, dimensiunea cererii și deschiderea.

## În browser {#in-the-browser}

Același cod rulează neschimbat într-o pagină web, calculând pe dispozitivul cititorului: așa funcționează fiecare figură interactivă de pe acest site. Importă pachetul prin bundlerul tău, de exemplu Vite sau Nuxt, și [desenează rezultatele](/ro/solver/drawing) cu @edubeam/plot. Un model se calculează în câteva milisecunde, așa că o pagină îl poate recalcula la fiecare eveniment `input`.
