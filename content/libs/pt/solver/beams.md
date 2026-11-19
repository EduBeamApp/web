---
title: Vigas
description: "Programas completos do @edubeam/fem para uma viga em balanço e uma viga contínua de dois vãos, com a saída, cada um conferido com a fórmula dos livros."
order: 12
group: Programas de exemplo
source: site
---

# Vigas {#beams}

Dois programas completos para copiar e modificar. Os dois usam uma seção rígida ao cisalhamento (`k: 1e32`), então os números coincidem exatamente com as fórmulas de Euler–Bernoulli. Execute-os com `node cantilever.ts` (Node 22.18 ou posterior), numa pasta preparada como em [Instalação](/pt/solver/getting-started#install).

## Uma viga em balanço {#a-cantilever}

Uma viga de 4 m, engastada em A, com uma carga de 18 kN para baixo na extremidade livre:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // engaste
const tip = domain.createNode('B', [4, 0, 0]) // livre
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // 18 kN para baixo na extremidade livre
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // N·m no engaste
console.log(tip.getUnknowns(lc, [DofID.Dz])) // m, a flecha na extremidade livre
```

```text [Saída]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, momento negativo, e a flecha na extremidade livre é $FL^3/3EI = 94{,}11$ mm, com $EI = 4{,}0803$ MNm². Essa mesma viga em balanço é um dos exemplos do aplicativo EduBeam.

## Uma viga contínua {#a-continuous-beam}

Dois vãos de 5 m sobre três apoios, com 10 kN/m nos dois. As reações, o momento sobre o apoio central e o maior momento no vão:

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// getReactions retorna uma Matrix do mathjs ou um array: converta para array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// O maior momento positivo no vão 1, a partir de 501 pontos ao longo dele
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Saída]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Os valores dos livros para dois vãos iguais: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$, e o maior momento no vão, $R_A^2/2q = 17{,}58$ kNm, em $x = R_A/q = 1{,}875$ m. A amostragem o encontra no ponto da grade 1,87 m, a menos de 0,0002 kNm do valor exato.

::model-figure{caption="Dois vãos de 5 m sob 10 kN/m"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

A figura usa a seção dos exemplos do aplicativo, e não o IPE 200. Com uma única seção em toda a viga, os esforços internos de uma viga contínua não dependem da rigidez, então os diagramas trazem os mesmos números; só a flecha muda.

## Modifique {#change-it}

- **Vãos ou cargas diferentes:** mude as coordenadas de C ou a lista de cargas. Uma carga em um só vão dá o conhecido carregamento alternado.
- **Três vãos:** adicione um nó D e uma barra `['C', 'D']`.
- **Uma extremidade engastada:** dê a A `[DofID.Dx, DofID.Dz, DofID.Ry]`.
- **Deformação por cisalhamento real:** `k: 5 / 6` para um retângulo, ou o coeficiente de cisalhamento da sua seção.
- **Uma figura da viga:** entregue o solver ao [@edubeam/plot](/pt/solver/drawing).

O [tutorial da viga contínua](/pt/tutorials/continuous-beam) monta uma viga como esta no aplicativo EduBeam, e a página [Conferir resultados à mão](/pt/guide/verification) traz mais casos dos livros com as suas fórmulas.
