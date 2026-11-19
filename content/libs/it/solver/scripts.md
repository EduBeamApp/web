---
title: Script e server
description: "Usa @edubeam/fem da Node: un foglio di esercizi con le soluzioni, una linea d’influenza salvata in CSV e un piccolo endpoint HTTP che risolve travi su richiesta."
order: 15
source: site
---

# Script e server {#scripts-and-servers}

Il solutore non ha bisogno di un browser. In Node scrive le soluzioni degli esercizi, svolge studi parametrici, prepara tabelle per un foglio di calcolo o risponde alle richieste di una pagina web.

Gli esempi sono in TypeScript. Node 22.18 e successivi eseguono direttamente i file `.ts` (`node answers.ts`), in una cartella preparata come in [Installazione](/it/solver/getting-started#install); con un Node più vecchio, togli le annotazioni di tipo e salva i file come `.mjs`.

## Un foglio di esercizi con le soluzioni {#answer-key}

Venti varianti dello stesso esercizio, una trave semplicemente appoggiata con un carico distribuito e un carico concentrato, ciascuna con le sue reazioni e il suo momento massimo, scritte in un file CSV. I numeri derivano dal numero dell’esercizio, quindi lo stesso script scrive sempre lo stesso foglio:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Esercizio i: una trave semplicemente appoggiata con q kN/m e F kN alla distanza a (m) da A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // da 4 a 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 o 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 o 20 kN
  const a = L / 4 + (i % 3) // in un punto della campata
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

  // Le reazioni sono i tagli alle estremità: V(0) in A, -V(L) in B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // Il momento massimo, da punti distanti 1 cm
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

Verifica a mano il primo: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, e il taglio cambia segno sotto il carico concentrato, quindi il momento massimo è lì: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Due scelte rendono breve lo script. Su una trave semplicemente appoggiata le reazioni sono i tagli alle estremità, quindi non serve la [funzione di supporto per le reazioni](/it/solver/results#reactions). E il momento massimo si cerca su punti distanti 1 cm, il che qui dà il valore esatto, perché l’estremo cade sotto un carico o entro un centimetro da un punto della griglia. Per disegnare ogni esercizio, con o senza soluzioni, vedi [Esercizi e compiti](/it/plot/exercises) di @edubeam/plot, che stampa anche un compito intero.

## Una linea d’influenza in CSV {#an-influence-line-as-csv}

Come cambia il momento sull’appoggio centrale di una trave a due campate mentre un carico di 1 kN la percorre? Costruisci e risolvi la trave una volta per ogni posizione del carico, e scrivi una riga per ciascuna:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Due campate di 5 m, 1 kN a `at` m da A: il momento sull'appoggio centrale */
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

La forma chiusa per due campate uguali è $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $-0{,}46875$ kNm per $a = 2{,}5$ m, e la posizione più sfavorevole è $a = L/\sqrt{3} = 2{,}887$ m. La linea è simmetrica, quindi le 21 righe finiscono come sono iniziate, con 0 sull’appoggio C.

Un nuovo solutore per ogni posizione è più semplice che modificarne uno esistente, e costa pochi millisecondi. Per modificare invece un modello già risolto, vedi [Risolvere di nuovo dopo una modifica](/it/solver/solving#solving-again-after-a-change).

## Un solutore dietro un endpoint HTTP {#a-solver-behind-an-http-endpoint}

Un piccolo server, con il solo modulo `http` di Node, che risolve una trave semplicemente appoggiata per qualsiasi luce e carico gli vengano inviati:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Un IPE 200 semplicemente appoggiato, `span` m, `q` kN/m: M e freccia in mezzeria */
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
    // JSON non valido, numeri non validi o modello irrisolvibile: il server resta attivo
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm e $5qL^4/384EI = 49{,}63$ mm. Il `try` è importante: un JSON non valido lancia un’eccezione, e lo stesso può fare un modello che il solutore non riesce a risolvere, ma nessuno dei due deve far cadere il server. Un servizio pubblico limiterebbe anche le dimensioni della richiesta e il valore della luce.

## Nel browser {#in-the-browser}

Lo stesso codice funziona così com’è in una pagina, e risolve il modello sul dispositivo del lettore: è così che funzionano tutte le figure interattive di questo sito. Importa il pacchetto tramite il tuo bundler, ad esempio Vite o Nuxt, e [disegna i risultati](/it/solver/drawing) con @edubeam/plot. Un modello si risolve in pochi millisecondi, quindi una pagina può risolverlo di nuovo a ogni evento di input.
