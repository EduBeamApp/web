---
title: Skripty a servery
description: "@edubeam/fem v Node: sada příkladů s klíčem řešení, příčinková čára zapsaná do CSV a malý HTTP endpoint, který na požádání spočítá nosník."
order: 15
---

# Skripty a servery {#scripts-and-servers}

Řešič nepotřebuje prohlížeč. V Node vám vygeneruje klíč řešení, spočítá parametrickou studii, připraví tabulky pro tabulkový procesor nebo vyřizuje požadavky z webové stránky.

Příklady jsou v TypeScriptu. Node 22.18 nebo novější spouští soubory `.ts` přímo (`node answers.ts`) ve složce připravené podle oddílu [Instalace](/cs/solver/getting-started#install); se starší verzí Node odstraňte typové anotace a soubory uložte jako `.mjs`.

## Sada příkladů s klíčem řešení {#answer-key}

Dvacet variant jednoho příkladu (prostého nosníku se spojitým zatížením a osamělou silou), každá s reakcemi a největším momentem, zapsaných do souboru CSV. Čísla se odvozují z čísla příkladu, takže stejný skript vždy vytvoří stejnou sadu:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Příklad i: prostý nosník se zatížením q kN/m a silou F kN ve vzdálenosti a m od A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // 4 až 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 nebo 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 nebo 20 kN
  const a = L / 4 + (i % 3) // někde v poli
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

  // Reakce jsou posouvající síly na koncích: V(0) v A, -V(L) v B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // Největší moment z bodů vzdálených 1 cm
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

Zkontrolujte první řádek ručně: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, a posouvající síla mění znaménko pod osamělou silou, takže tam je i největší moment: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Skript je krátký díky dvěma volbám. U prostého nosníku jsou reakce rovny posouvajícím silám na koncích, takže [pomocná funkce pro reakce](/cs/solver/results#reactions) není potřeba. A největší moment se hledá v bodech vzdálených 1 cm, což tu dává přesný výsledek, protože extrém leží pod silou nebo do centimetru od bodu sítě. Jak každý příklad vykreslit, s výsledky nebo bez nich, popisuje stránka [Příklady a písemky](/cs/plot/exercises) dokumentace @edubeam/plot, která ukazuje i tisk celé písemky.

## Příčinková čára jako CSV {#an-influence-line-as-csv}

Jak se mění moment nad střední podporou nosníku o dvou polích, když po něm přejíždí síla 1 kN? Pro každou polohu síly nosník sestavte a vyřešte znovu a zapište jeden řádek:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Dvě pole po 5 m, 1 kN ve vzdálenosti `at` m od A: moment nad střední podporou */
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

Uzavřené řešení pro dvě stejná pole je $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $-0{,}46875$ kNm pro $a = 2{,}5$ m a nejnepříznivější poloha $a = L/\sqrt{3} = 2{,}887$ m. Čára je symetrická, takže tabulka o 21 řádcích končí stejně, jak začala: nulou nad podporou C.

Vytvořit pro každou polohu nový řešič je jednodušší než měnit ten existující a stojí to jen několik milisekund. Jak naopak změnit už vyřešený model, popisuje [Nový výpočet po změně](/cs/solver/solving#solving-again-after-a-change).

## Řešič za HTTP endpointem {#a-solver-behind-an-http-endpoint}

Malý server, jen s vestavěným modulem `http` z Node, který spočítá prostý nosník pro libovolné rozpětí a zatížení, které mu pošlete:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Prostý nosník IPE 200, rozpětí `span` m, `q` kN/m: M a průhyb uprostřed */
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
    // Chybný JSON, chybná čísla nebo neřešitelný model: server musí běžet dál
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm a $5qL^4/384EI = 49{,}63$ mm. Na bloku `try` záleží: neplatný JSON vyhodí výjimku a může ji vyhodit i model, který řešič nedokáže vyřešit. Ani jedno nesmí server shodit. Veřejná služba by navíc měla omezit velikost požadavku i rozpětí.

## V prohlížeči {#in-the-browser}

Stejný kód poběží beze změny i na webové stránce a bude počítat na zařízení čtenáře: přesně tak fungují všechny živé obrázky na tomto webu. Balíček importujte přes svůj bundler, třeba Vite nebo Nuxt, a [výsledky vykreslete](/cs/solver/drawing) pomocí @edubeam/plot. Model se vyřeší za několik milisekund, takže stránka může počítat znovu při každé události input.
