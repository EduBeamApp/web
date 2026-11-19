---
title: Scripts e servidores
description: "Use o @edubeam/fem no Node: uma lista de exercícios com o gabarito, uma linha de influência em CSV e um pequeno endpoint HTTP que resolve vigas sob demanda."
order: 15
source: site
---

# Scripts e servidores {#scripts-and-servers}

O solver não precisa de navegador. No Node, ele escreve gabaritos, faz estudos paramétricos, gera tabelas para uma planilha ou responde a requisições de uma página web.

Os exemplos são em TypeScript. O Node 22.18 ou posterior executa arquivos `.ts` diretamente (`node answers.ts`), numa pasta preparada como em [Instalação](/pt/solver/getting-started#install); num Node mais antigo, retire as anotações de tipo e salve os arquivos como `.mjs`.

## Uma lista de exercícios com o gabarito {#answer-key}

Vinte versões de um mesmo exercício, uma viga biapoiada com uma carga distribuída e uma carga concentrada, cada uma com as reações e o maior momento, gravadas num arquivo CSV. Os números são derivados do número do exercício, então o mesmo script sempre gera a mesma lista:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Exercício i: viga biapoiada sob q kN/m e F kN a a m de A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // de 4 a 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 ou 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 ou 20 kN
  const a = L / 4 + (i % 3) // em algum ponto do vão
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

  // As reações são os cortantes nas extremidades: V(0) em A, -V(L) em B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // O maior momento, a partir de pontos espaçados de 1 cm
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

Confira a primeira à mão: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, e o cortante muda de sinal sob a carga concentrada, então o maior momento está ali: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Duas escolhas mantêm o script curto. Numa viga biapoiada, as reações são os cortantes nas extremidades, então não é preciso a [função auxiliar das reações](/pt/solver/results#reactions). E o maior momento vem de pontos espaçados de 1 cm, o que aqui é exato, porque o extremo cai sob uma carga ou a menos de um centímetro de um ponto da grade. Para desenhar cada exercício, com ou sem as respostas, veja [Exercícios e provas](/pt/plot/exercises), do @edubeam/plot, que também imprime uma prova inteira.

## Uma linha de influência em CSV {#an-influence-line-as-csv}

Como varia o momento sobre o apoio central de uma viga de dois vãos quando uma carga de 1 kN a percorre? Monte e resolva a viga uma vez para cada posição da carga e grave uma linha para cada uma:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Dois vãos de 5 m, 1 kN a `at` m de A: o momento sobre o apoio central */
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

A solução analítica para dois vãos iguais é $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $-0{,}46875$ kNm em $a = 2{,}5$ m, e a posição mais desfavorável é $a = L/\sqrt{3} = 2{,}887$ m. A linha é simétrica, então as 21 linhas do arquivo terminam como começaram, em 0 sobre o apoio C.

Um solver novo para cada posição é mais simples do que alterar um mesmo solver, e custa poucos milissegundos. Para alterar um modelo já resolvido, veja [Resolver de novo após uma alteração](/pt/solver/solving#solving-again-after-a-change).

## Um solver por trás de um endpoint HTTP {#a-solver-behind-an-http-endpoint}

Um pequeno servidor, só com o módulo `http` do próprio Node, que resolve uma viga biapoiada para qualquer vão e carga que receber:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Um IPE 200 biapoiado, vão `span` m, `q` kN/m: M e flecha no meio do vão */
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
    // JSON inválido, números inválidos ou um modelo sem solução: o servidor continua no ar
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm e $5qL^4/384EI = 49{,}63$ mm. O `try` é importante: um JSON inválido lança uma exceção, e um modelo que o solver não consegue resolver também pode lançar, e nenhum dos dois deve derrubar o servidor. Um serviço público também limitaria o tamanho da requisição e o vão.

## No navegador {#in-the-browser}

O mesmo código roda numa página sem nenhuma alteração, resolvendo no dispositivo do leitor: é assim que funciona cada figura interativa deste site. Importe o pacote pelo seu bundler, por exemplo Vite ou Nuxt, e [desenhe os resultados](/pt/solver/drawing) com o @edubeam/plot. Um modelo é resolvido em milissegundos, então uma página pode resolvê-lo de novo a cada evento de entrada.
