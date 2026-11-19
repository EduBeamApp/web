---
title: Funções
description: "Funções, constantes e tipos que o @edubeam/plot 0.2.0 exporta além dos componentes: structureSvg, leitura exata de resultados, unidades, linhas de viga e composição."
order: 10
source: site
---

# Funções

Tudo o que os componentes desenham vem de funções puras, sem nada de Vue. Elas escrevem uma figura como arquivo SVG, leem resultados de forma exata, preparam dados com antecedência e montam figuras próprias. Importações nomeadas deixam o bundle pequeno: uma página que importa só `modelFromSolver` não recebe nenhum código de componente.

Todos os valores estão em SI, a menos que uma unidade diga o contrário; as posições ao longo de uma barra são metros a partir do seu nó inicial.

## Um arquivo SVG independente {#a-standalone-svg-file}

Uma figura numa página busca as suas cores nas propriedades personalizadas CSS da página, então um `<svg>` copiado dela fica sem cores. `structureSvg`, por sua vez, escreve a figura como o texto de um arquivo `.svg` independente: cores fixas, sem folha de estilos, sem scripts, composto pela mesma rotina do `StructurePlot`. O Word, o PowerPoint, o Inkscape, o CairoSVG e as cadeias de ferramentas do LaTeX o desenham como a página.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => um LinearStaticSolver resolvido, como na página Slides e notas de aula

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![O pórtico como arquivo SVG independente, renderizado pelo CairoSVG: as cargas, as reações, 20 e 40 para cima e 2,3 e 12,7 na horizontal, e o momento fletor de −50,7 em C a 29,3 na viga](/screenshots/pt/p2p-plot-frame-svg.webp){.shot-lg}

| Opção | Padrão | O que faz |
| --- | --- | --- |
| `layers` | barras, apoios, cargas, reações e o resultado que o `StructurePlot` escolheria | O que desenhar |
| `width` | `640` | Largura em px, as unidades de usuário do SVG |
| `height` | acompanha o desenho | Uma altura fixa, px |
| `maxHeight` | max(320, 0.75 × width) | O limite superior da altura automática |
| `padding` | `6` | Espaço em volta do desenho, px |
| `fontSize` | `13`, compact `11.5` | Tamanho do texto, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Uma lista de fontes disponíveis no programa que abre o arquivo |
| `colors` | `PRINT_COLORS` | Qualquer um dos tons, como cores fixas |
| `background` | `true` | Pinta o fundo na cor `paper`; `false` o deixa transparente |
| `title` | nenhum | Escrito como o `<title>` do SVG |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | nenhum | Camadas, estilos de rótulo e estilos de rótulo das reações para os quais se reserva espaço além dos desenhados, para que os arquivos de uma figura em etapas fiquem alinhados: [Uma figura em etapas no Beamer](/pt/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | como no `StructurePlot` | O mesmo significado das props do componente |

`PRINT_COLORS` são as cores do aplicativo EduBeam sobre branco: traço `#16182b`, esforço normal `#2222ff`, esforço cortante `#00af00`, momento fletor `#ff2222`, cargas `#ff8700`, reações `#a020f0`. Cada rótulo é escrito duas vezes, com um halo na cor do fundo sob o texto, porque nem todo programa de SVG entende `paint-order`, e um subscrito, como nos nomes das reações *A<sub>x</sub>*, é um `tspan` com números simples que o Word e o Inkscape leem. Sem `reserve`, um arquivo é ajustado às camadas que desenha.

Para usar o arquivo:

- **Word e PowerPoint** (2019 e Microsoft 365): *Inserir › Imagens*.
- **LaTeX**: converta-o para PDF com o [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) ou o Inkscape e depois use `\includegraphics`; ou use o `\includesvg` do pacote `svg`, que chama o Inkscape por você. Com 640 unidades de largura, uma figura ajustada a uma coluna de texto de 16 cm tem rótulos de 9 pt.
- **Uma página web sem Vue**: cole o texto no HTML. Veja [Sem Vue](/pt/plot/embedding#plain-html-from-node).

[Exercícios e provas](/pt/plot/exercises#figures-for-latex-and-word) escreve um arquivo para o exercício e o gabarito de cada aluno.

## A partir de um solver {#from-a-solver}

| Exportação | Assinatura | O que faz |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Converte um solver no [modelo de desenho](/pt/plot/model), em dados simples; resultados só para um caso de carga resolvido |
| `FromSolverOptions` | tipo | `{ loadCase?: number }`, um índice em `solver.loadCases` |

## Polinômios por trechos {#piecewise-polynomials}

Os resultados de uma barra são valores `Piecewise`: listas de trechos `{ x0, x1, c }`, explicadas em [Modelo de desenho](/pt/plot/model#piecewise-polynomials). `side` escolhe o valor logo antes (`'left'`) ou logo depois (`'right'`, o padrão) de um ponto onde dois trechos se encontram.

| Exportação | Assinatura | O que faz |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | O valor em `x`; além das extremidades, o valor da extremidade mais próxima |
| `slopeAt` | `(pw, x, side?) => number` | A derivada, em unidades do valor por metro |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | O maior e o menor valor, exatos, cada um `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | O maior valor absoluto |
| `innerBreaks` | `(pw) => number[]` | Onde os trechos se encontram, sem as duas extremidades |
| `isZero` | `(pw) => boolean` | Se o resultado é nulo em todo o comprimento |
| `evalPiece` | `(piece, x) => number` | O valor de um trecho |
| `evalPieceSlope` | `(piece, x) => number` | A inclinação de um trecho |
| `pieceExtrema` | `(piece) => number[]` | Onde a inclinação de um trecho se anula, m |
| `pieceDegree` | `(piece) => number \| null` | O grau de um trecho; `null` quando ele é nulo |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Descarta coeficientes abaixo de `tolerance`, o erro de arredondamento de um modelo resolvido |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | O polinômio do grau dado ajustado a uma função em `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | O trecho como curvas de Bézier cúbicas em (x, valor): exato até polinômios cúbicos; acima disso, `segments` curvas, 4 por padrão |

Tipos: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Unidades e números {#units-and-numbers}

| Exportação | Assinatura | O que faz |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: o padrão |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` com as suas substituições |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Inglês, no máximo uma casa decimal |
| `formatNumber` | `(value, format?) => string` | O número com um sinal de menos de verdade, nunca −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: um valor SI numa unidade, com um espaço estreito inseparável |

Uma `Unit` é `{ symbol, scale }`, com valor exibido = valor SI × `scale`. `Units` tem uma para cada `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` e `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Leitura de valores {#reading-values}

| Exportação | Assinatura | O que faz |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M e w em `x`, cada um `{ left, right }`, e o deslocamento axial `u`; a menos de `snap` m de um salto, lê no próprio salto |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | A barra mais próxima de um ponto da tela, a menos de `reach` px, e os seus resultados ali |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Onde os valores lidos são desenhados: a extremidade da ordenada de cada diagrama exibido (as duas num salto), o ponto na deformada |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"`, ou `"V = 13.3 → −6.7 kN"` num salto |

`k` é a escala em px por unidade SI de cada resultado, e `side` o lado em que cada diagrama é desenhado, obtidos de `diagramScales` e `diagramSide`, mais abaixo. Tipos: `Readout`, `ReadoutMark` (`{ tone, from, to }` em px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Linhas de viga {#beam-lines}

As peças do [DiagramStack](/pt/plot/diagram-stack), para montar uma figura empilhada própria.

| Exportação | Assinatura | O que faz |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | As barras como uma única linha horizontal, da esquerda para a direita; lança um erro para qualquer outra coisa |
| `lineDiagram` | `(model, line, row) => Piecewise` | Um resultado ao longo de toda a linha, no x da linha |
| `rowRange` | `(pw) => [number, number]` | O intervalo para o qual uma linha é escalada, sempre incluindo o zero |
| `rowPeaks` | `(pw) => RowPeak[]` | Os extremos que vale a pena escrever numa linha |
| `rowBreaks` | `(pw) => number[]` | Onde o resultado se interrompe: apoios, ligações entre barras e cargas concentradas |
| `rowOutline` | `(pw, sx, sy, close) => string` | Os dados de path SVG do contorno de uma linha, dadas as transformações de m e de valor para px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Os dados de path SVG das ordenadas da hachura, espaçadas de `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | O modelo reduzido à linha, opcionalmente sem uma das cargas |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | A força concentrada na posição `at` da linha |

Tipos: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

A página [DiagramStack](/pt/plot/diagram-stack#a-load-the-reader-can-drag) usa `beamLine`, `lineDiagram` e `rowRange` para manter a escala de cada linha em todas as posições de uma carga móvel.

## Geometria e apoios {#geometry-and-supports}

| Exportação | Assinatura | O que faz |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Os nós por id |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | O início de uma barra, a tangente unitária, o z local unitário e o comprimento |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | O mesmo para todas as barras, por id |
| `pointAlong` | `(frame, at) => { x, z }` | O ponto a `at` metros ao longo de uma barra |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` ou `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | O símbolo de um nó e o seu giro no sentido horário, em graus |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | As linhas do símbolo, em px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Até onde um símbolo girado chega numa direção, px |

## Desenho {#drawing}

O desenho é feito em três passos. `buildStructureScene` transforma um modelo em itens de cena: pontos do modelo com deslocamentos em pixels de tela. `fitScene` encontra a escala e o deslocamento que os fazem caber num contêiner. `resolveScene` os transforma em dados de path SVG, em círculos e nos rótulos que têm espaço. `layoutStructure` executa os três passos como o `StructurePlot` e o `structureSvg` fazem, de modo que uma figura própria é composta como as deles.

| Exportação | Assinatura | O que faz |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | A composição completa: ajusta com todos os rótulos, descarta os rótulos amontoados e ajusta de novo. Retorna `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | Um arquivo `.svg` independente: [acima](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | O desenho das camadas escolhidas numa escala, em px por metro |
| `fitScene` | `(items, box: FitBox) => Fit` | A escala e o deslocamento para caber num contêiner `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` em px, com os rótulos que cabem |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Quais rótulos manter, e onde |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | As camadas de resultado mostradas uma de cada vez, cujos rótulos cedem lugar aos demais, mas não uns aos outros |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | A extensão de uma cena, px |
| `project` | `(transform, anchor) => [number, number]` | Um ponto da cena na tela, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | O resultado que uma figura mostra quando nenhum é pedido |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | A escala em px por unidade SI de cada resultado |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | Em que lado de uma barra um valor positivo é desenhado |
| `isBarStructure` | `(model, memberResults) => boolean` | Se N é escrito como números ao longo das barras (uma treliça) em vez de desenhado como diagrama |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | As posições que um valor pode ocupar além da extremidade de uma ordenada |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Todas as camadas, na ordem de pintura |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | As camadas de resultado |
| `HATCH_SPACING_PX` | `7` | O espaçamento das ordenadas dos diagramas, px |
| `DEFAULT_COLORS` | `PlotColors` | A cor padrão de cada tom, como CSS: [Temas e cores](/pt/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Cores fixas para um arquivo, as do aplicativo sobre branco |
| `toneVars` | `(colors?) => Record<string, string>` | As propriedades personalizadas que uma figura define na sua raiz |
| `PLOT_CSS` | `string` | As regras CSS embutidas em cada figura |

`ResolveOptions` são `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: `shields` são os grupos cujas linhas afastam os rótulos (os diagramas exibidos), todos eles quando a opção é omitida. Em `layoutStructure`, `options.layers` são as camadas a compor (tudo o que pode ser exibido, como em `reserve`), `shown` as que estão visíveis e `labelModes` os estilos de rótulo para os quais se reserva espaço.

Tipos: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart` e os tipos de modelo de [Modelo de desenho](/pt/plot/model).
