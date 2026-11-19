---
title: Referência da API
description: "Todas as classes, métodos e argumentos do @edubeam/fem 0.3, com unidades, valores padrão e o formato do que cada um retorna."
order: 16
group: Referência
source: site
---

# Referência da API {#api-reference}

O que o `@edubeam/fem` 0.3 exporta, agrupado pelo uso. As unidades são sempre SI: m, N, N·m, N/m, Pa, K e rad. Os rótulos (`LabelType`) são `string | number`, guardados como strings. Os métodos que não aparecem aqui são internos: são públicos no TypeScript só porque as próprias classes do solver os chamam.

## Exportações {#exports}

| Exportação | Tipo | Ver em |
| --- | --- | --- |
| `LinearStaticSolver` | classe | [Análises](#analyses) |
| `Solver` | classe abstrata | [Análises](#analyses) |
| `Domain` | classe | [Domain](#domain) |
| `Node` | classe | [Node](#node) |
| `Beam2D`, `Element` | classes | [Elementos](#elements) |
| `Material`, `CrossSection` | classes | [Materiais e seções](#materials-and-sections) |
| `LoadCase` | classe | [Cargas](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | classes | [Cargas](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | tipos | |

## Análises {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Membro | Tipo | Descrição |
| --- | --- | --- |
| `domain` | `Domain` | O modelo |
| `loadCases` | `LoadCase[]` | Começa com um caso, `'DefaultLC'`. Adicione outros com `new LoadCase(label, solver.domain)`: [Casos de carga](/pt/solver/load-cases). |
| `solve()` | `void` | Numera as equações, se necessário, monta e resolve todos os casos de carga. Pode lançar uma exceção diante de um [mecanismo](/pt/solver/solving#when-solving-fails), mas nem sempre lança. Silencioso a partir da 0.3.1; a 0.3.0 registrava o tempo no console. |
| `codeNumberGenerated` | `boolean` | Defina como `false` depois de adicionar ou remover nós ou barras, ou de mudar apoios: [por quê](/pt/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Número de GLs livres e de GLs restringidos, após o cálculo |
| `k` | `Matrix` do mathjs | A matriz de rigidez global montada, após o cálculo |
| `getNodeDofIDs(label)` | `number[]` | Os GLs que um nó tem, após o cálculo |

`EigenValueDynamicSolver` existe no código-fonte, mas não é exportado.

## Domain {#domain}

`solver.domain` guarda o modelo em quatro `Map`s cuja chave é o rótulo como string: `nodes`, `elements`, `materials`, `crossSections`. Não há métodos de remoção: `domain.nodes.delete(label)` e `domain.elements.delete(label)` removem um nó ou uma barra, e depois é preciso [renumerar](/pt/solver/solving#solving-again-after-a-change).

| Método | Retorna | Descrição |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` `[x, y, z]` em m (padrão `[0, 0, 0]`), `bcs` os `DofID`s restringidos (padrão: nenhum) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` `[first, second]`, `hinges` `[atFirst, atSecond]` (padrão `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Veja [Materiais e seções](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Veja [Materiais e seções](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | o objeto | Lança um `RangeError` para um rótulo desconhecido. `getElement` é tipado como `Element`: escreva `as Beam2D` para ler resultados. |

Criar um objeto com um rótulo que já está em uso substitui o antigo.

## Node {#node}

| Membro | Tipo | Descrição |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Altere-o para mover o nó. |
| `bcs` | `Set<DofID>` | GLs restringidos. Substitua-o para mudar o apoio. |
| `lcs` | `number[][] \| undefined` | Os eixos girados do nó, se houver |
| `updateLcs({ locx, locy }?)` | `void` | Gira os eixos do nó: `locx` é o seu eixo x em componentes globais, `locy` é `[0, 1, 0]`. Sem argumento, restaura os eixos. |
| `hasLcs()` | `boolean` | Se os eixos estão girados |
| `getUnknowns(lc, dofs)` | `Matrix`, ou um `number` para um só GL | Deslocamentos (m) e rotações (rad), nos eixos do nó |
| `getReactions(lc, global?)` | `{ dofs, values }` | Reações nos GLs restringidos, na ordem de `bcs`: N, N·m. `values` é uma `Matrix` do mathjs quando há várias, um array de um elemento quando há uma só, e `[]` para um nó livre. Com `global` igual a `true` num nó girado: os três GLs em eixos globais, `dofs` `[0, 2, 4]`, `values` um array com 0 onde nada é restringido. [Como lê-las](/pt/solver/results#reactions). |

## Elementos {#elements}

### `Beam2D` {#beam2d}

Uma viga de Timoshenko de dois nós no plano x–z, com três GLs por nó (`Dx`, `Dz`, `Ry`). `x` é dado em metros a partir do primeiro nó; `n` é um número de segmentos, que dá n + 1 pontos.

| Membro | Retorna | Descrição |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Liberação do momento no primeiro e no segundo nó |
| `computeNormalForceAt(lc, x)` | `number` | N, positivo na tração |
| `computeShearForceAt(lc, x)` | `number` | V, positivo onde M cresce ao longo do x local |
| `computeBendingMomentAt(lc, x)` | `number` | M, positivo com tração no lado +z local |
| `computeNormalForce(lc, n)` | `{ x, N }` | N em n + 1 pontos |
| `computeShearForce(lc, n)` | `{ x, V }` | V em n + 1 pontos |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M em n + 1 pontos |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Deslocamentos ao longo da barra e perpendiculares a ela, em eixos locais, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | O mesmo em x e z globais |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, as forças que os nós exercem sobre a barra, em eixos locais |
| `computeEndDisplacement(lc)` | `Matrix` | Deslocamentos das extremidades em eixos locais, incluindo as rotações nas rótulas |
| `computeGeo()` | `{ l, dx, dz }` | Comprimento e projeções, m |
| `computeT()` | `Matrix` | Transformação 6 × 6, dos eixos globais para os locais |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: rigidez local 6 × 6, com as rótulas condensadas |
| `computeStiffness()` | `Matrix` | Rigidez global 6 × 6 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

No ponto de uma carga concentrada, os métodos `…At` retornam o valor logo depois dela. `Element` é a classe base abstrata de `Beam2D`; é o tipo que `domain.elements` e `getElement` usam.

## Materiais e seções {#materials-and-sections}

| `MaterialParameters` | Unidade | Padrão | Usado para |
| --- | --- | --- | --- |
| `e` | Pa | 1 | rigidez |
| `g` | Pa | 1 | rigidez ao cisalhamento |
| `alpha` | 1/K | 1 | cargas térmicas |
| `d` | kg/m³ | 1 | nada na estática |

| `CrossSectionParameters` | Unidade | Padrão | Usado para |
| --- | --- | --- | --- |
| `a` | m² | nenhum, obrigatório | rigidez axial e ao cisalhamento |
| `iy` | m⁴ | nenhum, obrigatório | rigidez à flexão |
| `k` | – | nenhum, obrigatório | rigidez ao cisalhamento $kGA$; `1e32` para desprezá-la |
| `h` | m | nenhum | gradientes térmicos (`NaN` sem ele) |
| `iz`, `dyz`, `j` | m⁴ | nenhum | não usados pelo `Beam2D` |

Um parâmetro de material omitido vale 1, e não um valor típico; omitir `a`, `iy` ou `k` faz todos os resultados darem `NaN`. Nenhum dos casos lança erro. As duas classes têm um método `change(params)`, que define os parâmetros informados, e guardam os parâmetros como propriedades com os mesmos nomes.

## Cargas {#loads}

### `LoadCase` {#loadcase}

| Método | Retorna | Valores |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (padrão `false`) igual a `true`: nos eixos girados do nó |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m em toda a barra |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m no primeiro e no segundo nó, linear entre eles |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, a `a` m do primeiro nó |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: centroide, fibra inferior, fibra superior |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` em GLs restringidos, nos eixos do nó; ignorado em GLs livres |

Para cargas nas barras, `lcs` igual a `true` significa eixos locais (x ao longo da barra, z perpendicular a ela), e `false`, eixos globais. As cargas distribuídas são por metro do comprimento da barra. [Cargas nodais e nas barras](/pt/solver/loads) traz exemplos.

| Membro | Tipo | Descrição |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Cargas nas barras e cargas térmicas |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` depois de um cálculo bem-sucedido |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | As cargas de uma barra |

Os objetos de carga guardam os seus valores em propriedades públicas, que você pode alterar antes de resolver de novo: `values` (e `lcs`) em `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` e `BeamTemperatureLoad`; `startValues` e `endValues` em `BeamElementTrapezoidalEdgeLoad`; `prescribedValues` em `PrescribedDisplacement`. Cada um tem um `target`, o rótulo do objeto em que atua.

## DofID {#dofid}

| Nome | Valor | Usado pelo `Beam2D` |
| --- | --- | --- |
| `Dx` | 0 | sim |
| `Dy` | 1 | não |
| `Dz` | 2 | sim |
| `Rx` | 3 | não |
| `Ry` | 4 | sim |
| `Rz` | 5 | não |

## Resultados {#results}

Os resultados são lidos de um `Beam2D` (esforços internos, flechas, esforços de extremidade) e de um `Node` (deslocamentos, reações), sempre para um `LoadCase` dado, depois de `solve()`: veja as duas tabelas acima e [Leitura dos resultados](/pt/solver/results) para exemplos e sinais. Em resumo:

| Para obter | Chamada |
| --- | --- |
| Reações, N e N·m | `node.getReactions(lc)` |
| Deslocamentos, m, e rotações, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V ou M num ponto, N e N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V ou M ao longo de uma barra | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Deformada, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Esforços de extremidade, N e N·m | `beam.computeEndForces(lc)` |
| Uma figura de tudo isso | `StructurePlot` ou `structureSvg` do [@edubeam/plot](/pt/solver/drawing) |
