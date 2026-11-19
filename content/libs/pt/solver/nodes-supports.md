---
title: Nós e apoios
description: "Crie os nós de um modelo do @edubeam/fem, apoie-os restringindo graus de liberdade, gire os eixos de um apoio móvel inclinado e altere nós após o cálculo."
order: 3
group: Modelagem
source: site
---

# Nós e apoios {#nodes-and-supports}

Os nós são os pontos que as barras ligam. Um apoio não é um objeto à parte: é a lista de graus de liberdade que o nó mantém restringidos. Os trechos de código desta página fazem parte de um programa como o de [Primeiros passos](/pt/solver/getting-started) e usam os seus `solver`, `domain` e `lc`.

## Criar um nó {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Argumento | Tipo | Significado |
| --- | --- | --- |
| `label` | `string \| number` | O nome do nó, guardado como string: `1` e `'1'` são o mesmo nó |
| `coords` | `number[]` | `[x, y, z]` em metros, com `y = 0`. O eixo z aponta para baixo. |
| `bcs` | `DofID[]` | Os graus de liberdade que o apoio restringe. Omita-o para um nó livre. |

O método retorna o `Node`; `domain.getNode(label)` o encontra de novo. Criar um nó com um rótulo que já está em uso substitui o nó antigo.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // livre: o topo de um pilar de 4 m
```

## Apoios {#supports}

Cada apoio do aplicativo EduBeam é um conjunto de GLs restringidos:

| Apoio | `bcs` | Restringe |
| --- | --- | --- |
| Engaste (de terceiro gênero) | `[DofID.Dx, DofID.Dz, DofID.Ry]` | tudo |
| Apoio fixo (de segundo gênero) | `[DofID.Dx, DofID.Dz]` | os dois deslocamentos; a rotação fica livre |
| Apoio móvel (de primeiro gênero) | `[DofID.Dz]` | o deslocamento vertical; desliza ao longo de x |
| Apoio móvel vertical | `[DofID.Dx]` | o deslocamento horizontal; desliza ao longo de z |
| Engaste deslizante | `[DofID.Dz, DofID.Ry]` | o deslocamento vertical e a rotação; desliza ao longo de x |
| Engaste deslizante vertical | `[DofID.Dx, DofID.Ry]` | o deslocamento horizontal e a rotação; desliza ao longo de z |
| Apenas rotação impedida | `[DofID.Ry]` | a rotação |

A ordem em que você os lista é a ordem em que as [reações](/pt/solver/results#reactions) são retornadas. Uma estrutura precisa de pelo menos três GLs restringidos, dispostos de modo que ela não possa se mover como um mecanismo: veja [Quando o cálculo falha](/pt/solver/solving#when-solving-fails).

Um GL restringido também pode ser deslocado de um valor dado, um recalque de apoio: veja [Deslocamentos prescritos](/pt/solver/temperature-settlements#prescribed-displacements).

## Apoios inclinados {#inclined-supports}

Um apoio móvel sobre um plano inclinado restringe o nó na direção perpendicular ao plano, e não na vertical. Gire os eixos do nó com `updateLcs`; os seus `bcs` passam a se referir aos eixos girados. No programa de Primeiros passos, crie B assim:

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // restringe o seu próprio z
const a = (30 * Math.PI) / 180 // 30°, de x para z: sentido horário na tela
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` é o eixo x do próprio nó, escrito como vetor nos eixos globais, e `locy` é o seu eixo y, que continua `[0, 1, 0]`. No aplicativo EduBeam, o mesmo ângulo é o *Ângulo do SCL nodal* do nó, 30°.

Depois de `solve()`, B empurra perpendicularmente ao plano inclinado, e o apoio fixo em A absorve a componente horizontal:

```ts
b.getReactions(lc).values // [-41569]: N no z do próprio B, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: em x, em z, momento
```

::model-figure{caption="Um apoio móvel girado 30°: a reação é perpendicular ao plano inclinado, e a viga fica tracionada"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, N]
show: [nodeLabels]
---
::

A componente vertical continua sendo $qL/2 = 36$ kN; a horizontal, $36 \tan 30° = 20{,}8$ kN, puxa a viga pelas duas extremidades. O momento não muda.

Num nó girado, os deslocamentos e as reações são dados nos eixos do próprio nó, a menos que você passe `true` para obtê-los nos globais. Já as cargas nodais aplicadas nele são globais, a menos que você indique o contrário: veja [Cargas nodais](/pt/solver/loads#nodal-loads). `node.updateLcs()` sem argumento faz os eixos voltarem à posição original.

## Alterar um nó {#change-a-node}

Um nó é um objeto simples: altere `node.coords` para movê-lo, ou substitua `node.bcs`, um `Set<DofID>`, para mudar o seu apoio.

```ts
domain.getNode('B').coords = [8, 0, 0] // um vão maior: basta solve()
domain.getNode('A').bcs = new Set(fixed) // um novo apoio: renumere antes
solver.codeNumberGenerated = false
solver.solve()
```

Mudar apoios, ou adicionar e remover nós, muda as equações: sem `codeNumberGenerated = false`, o solver **mantém os apoios antigos sem avisar**. [Resolver de novo após uma alteração](/pt/solver/solving#solving-again-after-a-change) lista quais alterações exigem isso.
