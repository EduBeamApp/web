---
title: Szkriptek és szerverek
description: "Az @edubeam/fem használata Node-ból: feladatlap megoldókulccsal, CSV-be írt hatásvonal és egy kis HTTP-végpont, amely kérésre tartókat számol."
order: 15
source: site
---

# Szkriptek és szerverek {#scripts-and-servers}

A számítómagnak nincs szüksége böngészőre. Node-ban megoldókulcsokat ír, paramétervizsgálatokat futtat, táblázatokat készít táblázatkezelőhöz, vagy egy weboldal kéréseire válaszol.

A példák TypeScriptben íródtak. A Node 22.18-as vagy újabb verziója közvetlenül futtatja a `.ts` fájlokat (`node answers.ts`), a [Telepítés](/hu/solver/getting-started#install) szerint előkészített mappában; régebbi Node esetén töröld a típusannotációkat, és mentsd a fájlokat `.mjs` kiterjesztéssel.

## Feladatlap megoldókulccsal {#answer-key}

Egy feladat húsz változata – egy kéttámaszú tartó megoszló teherrel és koncentrált erővel –, mindegyik a támaszerőivel és a legnagyobb nyomatékával, CSV-fájlba írva. A számok a feladat sorszámából adódnak, így ugyanaz a szkript mindig ugyanazt a feladatlapot írja ki:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Az i. feladat: kéttámaszú tartó q kN/m teherrel és A-tól a m-re F kN erővel. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // 4–7 m
  const q = 5 + 5 * (i % 3) // 5, 10 vagy 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 vagy 20 kN
  const a = L / 4 + (i % 3) // valahol a támaszközben
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

  // A támaszerők a végeken lévő nyíróerők: V(0) A-ban, -V(L) B-ben
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // A legnagyobb nyomaték, egymástól 1 cm-re lévő pontokból
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

Ellenőrizd az elsőt kézzel: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, a nyíróerő pedig a koncentrált erő alatt vált előjelet, így ott a legnagyobb a nyomaték: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Két döntés tartja röviden a szkriptet. Kéttámaszú tartón a támaszerők a végeken lévő nyíróerők, így nincs szükség a [támaszerőkhöz írt segédfüggvényre](/hu/solver/results#reactions). A legnagyobb nyomatékot pedig egymástól 1 cm-re lévő pontokból kapjuk, ami itt pontos, mert a szélsőérték a teher alá, vagy egy rácsponttól legfeljebb egy centiméterre esik. Ha minden feladatot meg szeretnél rajzolni, megoldással vagy anélkül, lásd az @edubeam/plot [Feladatok és dolgozatok](/hu/plot/exercises) oldalát, amely teljes dolgozatot is nyomtat.

## Hatásvonal CSV-ként {#an-influence-line-as-csv}

Hogyan változik egy kéttámaszközű tartó középső támasza feletti nyomaték, miközben egy 1 kN-os erő végighalad rajta? Építsd fel és oldd meg a tartót minden teherhelyzetre külön, és mindegyikhez írj ki egy sort:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Két 5 m-es támaszköz, 1 kN A-tól `at` m-re: a középső támasz feletti nyomaték */
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

Két egyenlő támaszköz esetén a zárt alakú megoldás $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $a = 2{,}5$ m-nél $-0{,}46875$ kNm, a legkedvezőtlenebb helyzet pedig $a = L/\sqrt{3} = 2{,}887$ m. A hatásvonal szimmetrikus, így a 21 sor ott végződik, ahol kezdődött: 0-val a C támasz felett.

Minden teherhelyzethez új számítómagot létrehozni egyszerűbb, mint egyet helyben módosítani, és csak néhány ezredmásodpercbe kerül. Ha inkább egy már megoldott modellt módosítanál, lásd [Újbóli megoldás módosítás után](/hu/solver/solving#solving-again-after-a-change).

## Számítómag HTTP-végpont mögött {#a-solver-behind-an-http-endpoint}

Egy kis szerver, amely csak a Node saját `http` modulját használja, és bármilyen elküldött támaszközre és teherre megold egy kéttámaszú tartót:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Kéttámaszú IPE 200, `span` m, `q` kN/m: M és lehajlás a támaszköz közepén */
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
    // Hibás JSON, rossz számok vagy megoldhatatlan modell: a szerver fut tovább
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm és $5qL^4/384EI = 49{,}63$ mm. A `try` fontos: az érvénytelen JSON kivételt dob, és ugyanígy dobhat egy olyan modell is, amelyet a számítómag nem tud megoldani, és egyik sem állíthatja le a szervert. Egy nyilvános szolgáltatásnak a kérés méretét és a támaszközt is korlátoznia kellene.

## Böngészőben {#in-the-browser}

Ugyanez a kód változtatás nélkül fut egy weboldalon, az olvasó eszközén számolva: így működik ezen az oldalon minden élő ábra. Importáld a csomagot a bundleren keresztül, például Vite-tal vagy Nuxttal, és [rajzold meg az eredményeket](/hu/solver/drawing) az @edubeam/plot segítségével. Egy modell ezredmásodpercek alatt megoldódik, így az oldal minden beviteli eseménynél újra számolhat.
