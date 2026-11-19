---
title: Exercícios e provas
description: "Com o @edubeam/fem e o @edubeam/plot, um exercício diferente para cada aluno a partir de uma semente, com um gabarito sempre certo: na web, impresso ou em SVG."
order: 5
group: Casos de uso
source: site
---

# Exercícios e provas

Escreva uma estrutura uma única vez como função de uma semente (o valor inicial do gerador aleatório) e você terá um exercício para cada aluno, toda semana, cada um com um gabarito que está sempre certo: o @edubeam/fem resolve a estrutura, e o @edubeam/plot desenha o enunciado e o gabarito a partir do mesmo modelo.

Clique em **Novo exercício** abaixo. Cada clique é uma nova semente: o exercício é gerado, resolvido e desenhado no seu navegador.

::exercise-generator
::

A demonstração desenha os exercícios de duas páginas deste site, ambas montadas com as peças descritas aqui: [Exercícios de estática](/pt/practice), em que o aluno informa as reações e o maior momento ou o maior esforço numa barra e recebe a correção na hora, e o [gerador de provas](/pt/exam), que imprime uma versão diferente da prova para cada aluno, com o gabarito, e salva as figuras como arquivos SVG e as respostas como CSV. Experimente as duas antes de escrever o seu próprio gerador.

## Como funciona {#how-it-works}

1. **A semente escolhe os números.** Um gerador aleatório com semente dá o mesmo exercício para a mesma semente, então a semente impressa na folha permite reencontrar o gabarito.
2. **O solver calcula o gabarito.** O @edubeam/fem resolve cada estrutura, de modo que as reações e os momentos vêm do solver, e não de uma fórmula em que você poderia errar.
3. **A figura desenha os dois.** O enunciado mostra a estrutura com os rótulos dos nós, as cotas e as reações incógnitas pelo nome; o gabarito dá os valores das reações e acrescenta o diagrama.

Alguns arquivos curtos levam você daqui até uma prova impressa: [o gerador](#the-generator), [um componente](#the-exercise-in-a-page) para uma página web e [um script](#print-a-test) que imprime uma prova ou [escreve as figuras](#figures-for-latex-and-word) para o LaTeX e o Word. Copie-os para um projeto que tenha [as bibliotecas instaladas](/pt/plot/getting-started#install); os scripts rodam com `node` a partir da versão 22.18, ou com `npx tsx` em versões anteriores.

## O gerador {#the-generator}

Um único módulo, `exercise.ts`, transforma uma semente num exercício: uma viga sobre um apoio fixo e um apoio móvel, em metade dos casos com um balanço que leva uma carga concentrada na extremidade livre. Os dois casos são isostáticos, então qualquer semente pode ser resolvida tanto à mão quanto pelo solver.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** A estrutura resolvida como dados simples: desenha tanto o enunciado quanto o gabarito */
  readonly model: PlotModel
  /** Reações de apoio, positivas para cima, N, e os momentos fletores extremos, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: um pequeno gerador com semente, para que cada semente identifique sempre o mesmo exercício */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const makeExercise = (seed: number): Exercise => {
  const r = random(seed)
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

  // Um vão sobre apoio fixo e apoio móvel, com balanço em metade dos casos: isostático, sempre tem solução
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m de balanço
  const q = int(4, 12) // kN/m no vão
  const F = int(2, 6) * 5 // kN na extremidade livre, ou a `a` de A sem balanço
  const a = int(1, L - 1) // m

  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  if (c > 0) {
    domain.createNode('C', [L + c, 0, 0])
    domain.createBeam2D(2, ['B', 'C'], 1, 1)
    lc.createNodalLoad('C', { [DofID.Dz]: F * 1e3 })
  } else {
    lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  }
  solver.solve()

  const statement =
    c > 0
      ? `Span L = ${L} m with an overhang c = ${c} m. q = ${q} kN/m on the span, F = ${F} kN at the tip C.`
      : `Span L = ${L} m. q = ${q} kN/m over the span, F = ${F} kN at ${a} m from A.`

  // O gabarito, do modelo resolvido: reações (z aponta para baixo, então para cima é negativo), extremos exatos de M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` lê a estrutura resolvida num [modelo de desenho](/pt/plot/model): dados simples com as reações e os resultados de cada barra como polinômios exatos, de modo que `extremes` encontra os maiores momentos sem amostragem. O exercício guarda só esse modelo; o solver não é mais necessário.

A semente 5 dá “Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.” (um vão de 6 m com um balanço de 1,5 m, 5 kN/m no vão e 25 kN na extremidade livre C). O gabarito: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm sobre o apoio e $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm no vão, onde o cortante se anula. O solver chega ao mesmo resultado, até o último algarismo.

## Numa página web {#the-exercise-in-a-page}

Um componente, `ExerciseCard.vue`, desenha o enunciado ou, com `answers`, o gabarito:

```vue [ExerciseCard.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { formatQuantity, KN_UNITS, StructurePlot, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise'

const props = defineProps<{ seed: number; answers?: boolean }>()
const exercise = computed(() => makeExercise(props.seed))

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const twoDecimals = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const kN = (si: number) => formatQuantity(si, KN_UNITS.force, twoDecimals)
const kNm = (si: number) => formatQuantity(si, KN_UNITS.moment, twoDecimals)
</script>

<template>
  <article>
    <h3>Exercise {{ seed }}</h3>
    <p>{{ exercise.statement }} Find the reactions and draw the bending moment diagram.</p>
    <StructurePlot
      :model="exercise.model"
      :layers="answers ? key : sheet"
      :reserve="[...sheet, ...key]"
      :reaction-labels="answers ? 'values' : 'names'"
      :reserve-reaction-labels="['names', 'values']"
    />
    <p v-if="answers">
      R<sub>A</sub> = {{ kN(exercise.key.RA) }}, R<sub>B</sub> = {{ kN(exercise.key.RB) }},
      M from {{ kNm(exercise.key.mMin) }} to {{ kNm(exercise.key.mMax) }}
    </p>
  </article>
</template>
```

```vue
<ExerciseCard :seed="5" />
<ExerciseCard :seed="5" answers />
```

O segundo cartão termina com *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. `formatQuantity` escreve a unidade e um sinal de menos de verdade, como a figura faz. O ponto decimal vem do formato `'en'`; com `new Intl.NumberFormat('pt', …)` você obtém a vírgula decimal.

No enunciado, `reaction-labels="names"` desenha as reações como incógnitas: uma seta para cada direção que um apoio restringe, no sentido em que ela é considerada positiva (para a direita, para cima, anti-horário), com o nome *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* em vez do valor. Assim, o sinal de cada resposta fica definido no próprio desenho: uma reação que atua no sentido contrário é negativa. O gabarito escreve os valores.

`reserve` posiciona desde o início as camadas das duas versões, de modo que, ao ligar `answers`, por exemplo com um botão *Mostrar a solução* para o estudo individual, o diagrama surge suavemente no seu lugar ([Figuras que se completam passo a passo](/pt/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` faz o mesmo com as reações, e a viga fica parada enquanto os nomes se transformam em valores: veja [Reações como incógnitas](/pt/plot/structure-plot#reactions-as-unknowns).

## Uma prova impressa {#print-a-test}

Para uma prova escrita, um script Node, `print-test.ts`, escreve uma página por aluno e, depois delas, os gabaritos. `structureSvg` transforma cada modelo em texto SVG, então o script não precisa do Vue nem de um navegador:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // sementes 1000, 1001, …

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const task = 'Find the reactions and draw the bending moment diagram.'

const pages = [
  ...exercises.map((e, i) => `<h2>${students[i]}, exercise ${e.seed}</h2>
    <p>${e.statement} ${task}</p>${structureSvg(e.model, { layers: sheet, reactionLabels: 'names' })}`),
  ...exercises.map((e) => `<h2>Key, exercise ${e.seed}</h2>
    ${structureSvg(e.model, { layers: key })}`),
]

const style = `body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 2rem auto }
  section { break-after: page }`
writeFileSync('test.html', `<!doctype html><meta charset="utf-8"><title>Test</title>
  <style>${style}</style>${pages.map((page) => `<section>${page}</section>`).join('\n')}`)
```

```bash
node print-test.ts
```

Abra `test.html` num navegador e imprima, ou salve como PDF: o exercício de cada aluno e cada gabarito ficam numa página própria. A página da Ada e o seu gabarito:

![Exercício 1000: um vão de 6 m com um balanço de 2 m, 10 kN/m no vão e 30 kN na extremidade livre, as reações incógnitas nomeadas A_x, A_z e B_z e cotas em cadeia de 6 m e 2 m com 8 m no total; embaixo, o gabarito, com reações de 20 e 70 e o momento fletor de −60 sobre o apoio a 20 no vão](/screenshots/pt/p2p-plot-exercise-sheet.webp){.shot-lg}

A camada `dimensions` dá cada vão e o comprimento total, como num enunciado de exercício, e `reactionLabels: 'names'` nomeia as incógnitas, com cada seta apontando no sentido em que a resposta é considerada positiva. No gabarito, as reações e os valores dos diagramas são números sem unidade, em kN e kNm, como no aplicativo EduBeam: indique isso no título do gabarito se os seus alunos precisarem do aviso. Para uma copiadora em preto e branco, passe `colors` com todos os tons em preto: veja [Preto e branco](/pt/plot/theming#black-and-white).

## Figuras para LaTeX e Word {#figures-for-latex-and-word}

Se as suas provas são escritas em LaTeX ou no Word, escreva as figuras como arquivos e mantenha o seu próprio modelo de documento. `figures.ts` escreve o enunciado e o gabarito de 30 sementes:

```ts [figures.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']

for (let seed = 1000; seed < 1030; seed++) {
  const { model } = makeExercise(seed)
  writeFileSync(`exercise-${seed}.svg`, structureSvg(model, { layers: sheet, reactionLabels: 'names' }))
  writeFileSync(`exercise-${seed}-key.svg`, structureSvg(model, { layers: key }))
}
```

Execute-o com `node figures.ts`: são 60 arquivos para 30 alunos, cada um deles um SVG simples com cores fixas, sem CSS e sem scripts.

- O **Word** (2019 e Microsoft 365) insere um SVG como ele é: *Inserir › Imagens*.
- O **LaTeX** inclui PDF, e não SVG. Converta uma vez, com o [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) ou o Inkscape, e depois use `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. O `\includesvg` do pacote `svg` faz a conversão por você, se o Inkscape estiver instalado.

Uma figura tem 640 unidades de largura com texto de 13 unidades, então, na largura da coluna de texto de uma página A4, cerca de 16 cm, os rótulos ficam com 9 pt. Defina `fontFamily` com uma fonte que o seu documento usa: veja [Um arquivo SVG independente](/pt/plot/functions#a-standalone-svg-file) para todas as opções.

## Adapte à sua disciplina {#make-it-your-own}

- **Mais tipos de estrutura.** Acrescente casos: uma viga em balanço, uma viga contínua de dois vãos, um pórtico, uma treliça. A demonstração no topo da página escolhe entre oito tipos, de uma viga biapoiada a um pórtico triarticulado, uma treliça Warren e um pórtico biarticulado.
- **Exercícios hiperestáticos.** O solver os resolve igualmente bem; só a solução à mão fica mais longa.
- **Números redondos.** Sorteie cargas e comprimentos de listas curtas, como acima, para que o gabarito saia tão redondo quanto você quiser. Percorra algumas centenas de sementes e descarte aquelas cujo gabarito tem mais casas decimais do que você deseja.
- **Proteja-se contra mecanismos.** Um gerador que pode posicionar mal os apoios deve resolver dentro de um `try` e descartar as sementes que lançam erro: veja [Quando o cálculo falha](/pt/solver/solving#when-solving-fails).
- **Peça mais.** Desenhe o esforço cortante (`'V'`), a flecha (`'w'`, com os valores de [`getUnknowns`](/pt/solver/results#displacements)) ou o esforço normal numa barra inclinada.
