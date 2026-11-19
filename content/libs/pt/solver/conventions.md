---
title: Unidades e sinais
description: "As unidades, os eixos, os graus de liberdade e a convenção de sinais do @edubeam/fem, e como a orientação de uma barra muda o sinal dos seus resultados."
order: 2
source: site
---

# Unidades e sinais {#units-and-signs}

O solver não tem um sistema de unidades próprio: ele calcula com os números que você fornece. Forneça os dados em SI e todos os resultados saem em SI. Os exemplos destas páginas e o aplicativo EduBeam sempre trabalham assim. Os sinais também são os do aplicativo; o manual teórico os explica com figuras em [Sistema de coordenadas e convenções de sinais](/pt/elements/conventions).

## Unidades {#units}

| Grandeza | Unidade | Exemplo |
| --- | --- | --- |
| Coordenadas, comprimentos, posições ao longo de uma barra | m | `[6, 0, 0]` |
| Forças | N | `20e3` para 20 kN |
| Momentos | N·m | `10e3` para 10 kNm |
| Cargas distribuídas | N/m | `12e3` para 12 kN/m |
| Módulo de elasticidade e módulo de cisalhamento | Pa | `210e9` |
| Área | m² | `28.5e-4` para 28,5 cm² |
| Momento de inércia | m⁴ | `1943e-8` para 1943 cm⁴ |
| Variação de temperatura | K | `20` |
| Coeficiente de dilatação térmica | 1/K | `12e-6` |
| Deslocamentos, rotações | m, rad | `0.01` para 10 mm |

Qualquer sistema coerente funciona, por exemplo kN, m e kPa, que dá os resultados em kN e kNm. Com o SI, você não precisa conferir a coerência das unidades.

## Eixos {#axes}

- **x** aponta para a direita, **z aponta para baixo**, e o modelo fica no plano x–z. As coordenadas são `[x, y, z]`, com `y = 0`.
- **y** aponta para você, saindo da tela. As rotações e os momentos são em torno de y, então um valor positivo gira no **sentido anti-horário** na tela.
- O **eixo x local** de uma barra vai do seu primeiro nó ao segundo. O **eixo z local** é o x local girado 90° no sentido horário na tela: numa barra desenhada da esquerda para a direita, ele aponta para baixo.

Como z aponta para baixo, uma carga gravitacional é uma `fz` positiva, e o topo de um pilar de 4 m com a base em $z = 0$ fica em $z = -4$.

## Graus de liberdade {#degrees-of-freedom}

Cada nó de um modelo com `Beam2D` tem três graus de liberdade, nomeados pelo enum `DofID`:

| `DofID` | Valor | Significado |
| --- | --- | --- |
| `DofID.Dx` | 0 | Deslocamento na direção x |
| `DofID.Dz` | 2 | Deslocamento na direção z, para baixo |
| `DofID.Ry` | 4 | Rotação em torno de y, anti-horária |

`Dy`, `Rx` e `Rz` (1, 3, 5) existem no enum, mas as barras planas não os usam.

## Sinais dos resultados {#signs-of-the-results}

| Resultado | Positivo significa | Obtido com |
| --- | --- | --- |
| Esforço normal N | tração | `computeNormalForceAt` |
| Momento fletor M | tração no lado +z local: momento positivo (tração embaixo), numa viga desenhada da esquerda para a direita | `computeBendingMomentAt` |
| Esforço cortante V | M cresce ao longo do x local, $V = dM/dx$; numa viga desenhada da esquerda para a direita, gira um trecho no sentido horário: $+qL/2$ no apoio esquerdo de uma viga biapoiada | `computeShearForceAt` |
| Flecha w | no sentido +z local: para baixo, numa viga desenhada da esquerda para a direita | `computeLocalDefl` |
| Deslocamento nodal | no sentido +x, +z (para baixo), anti-horário | `node.getUnknowns` |
| Reação | a força que o apoio exerce sobre a estrutura, no sentido +x, +z (para baixo), anti-horário | `node.getReactions` |
| Esforços de extremidade | as forças que os nós exercem sobre a barra, nos eixos locais dela | `computeEndForces` |

Por isso o apoio fixo de uma viga carregada para baixo informa uma reação de −36 000 N em z: 36 kN empurrando para cima.

## Posições ao longo de uma barra {#positions-along-a-member}

Todo método `…At(lc, x)` recebe `x` em metros a partir do primeiro nó da barra, e não como fração do seu comprimento. As cargas concentradas nas barras são posicionadas da mesma forma.

## Orientação da barra {#member-direction}

M e w são medidos nos eixos da própria barra, por isso a ordem dos seus dois nós importa. Veja a viga de 12 kN/m de [Primeiros passos](/pt/solver/getting-started), definida nos dois sentidos com a carga em eixos globais, `[0, 12e3], false`, para que empurre para baixo nos dois casos, e lida com `computeBendingMomentAt(lc, 3)`, `computeLocalDefl(lc, 2).w[1]` e `computeShearForceAt`:

| Barra | M no meio do vão | w no meio do vão | V em A |
| --- | --- | --- | --- |
| `['A', 'B']`, da esquerda para a direita | +54 000 N·m | +0,0499 m | +36 000 N, em `x = 0` |
| `['B', 'A']`, da direita para a esquerda | −54 000 N·m | −0,0499 m | +36 000 N, em `x = 6` |

Definida da direita para a esquerda, a barra tem o eixo z local apontando para cima, então a mesma viga, tracionada embaixo, informa um momento negativo e uma flecha para cima. N e V mantêm o sinal em cada ponto da viga; só `x` passa a ser medido a partir da outra extremidade. Uma carga dada em eixos locais (`true`) gira com a barra: na viga definida da direita para a esquerda, `[0, 12e3], true` empurra para cima.

::callout{type="tip" title="Defina as barras do jeito que você as desenha"}
Vigas da esquerda para a direita, pilares de baixo para cima, e os sinais saem como nos livros. Num pilar definido de baixo para cima, o eixo z local aponta para a direita, então tração na face direita é momento positivo. O [exemplo do pórtico](/pt/solver/frames#things-to-notice) mostra isso.
::
