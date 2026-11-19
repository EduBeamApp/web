---
description: "Convenções de sinais do EduBeam: x para a direita e z para baixo, cargas e deslocamentos positivos, eixos locais, N, V, M, esforços de extremidade e reações."
source: site
---

# Sistema de coordenadas e convenções de sinais

Todo número que o EduBeam mostra tem sinal. Esta página define o que significa *positivo* para coordenadas, cargas, deslocamentos, esforços internos, esforços de extremidade e reações, para que você possa comparar o aplicativo com os seus próprios cálculos. A maioria dos resultados que parecem errados acaba sendo uma questão de convenção de sinais.

| Grandeza | Positivo |
| --- | --- |
| `x`, `Dx`, `Fx` | para a direita |
| `z`, `Dz`, `Fz` | **para baixo** |
| `Ry`, `My` | anti-horário na tela |
| $N$ | tração |
| $V$ | gira um pequeno trecho da barra no sentido horário |
| $M$ | tração nas fibras inferiores, do lado da linha tracejada |
| Reações | a força que o apoio exerce sobre a estrutura, com o sinal de uma carga |

## Eixos globais {#global-axes}

O modelo fica no plano x–z:

- **x** é horizontal, positivo para a **direita**.
- **z** é vertical, positivo **para baixo**.
- **y** sai da tela, em direção a você, o que torna o sistema dextrogiro. Rotações e momentos são em torno de y; por isso, o **sentido anti-horário é positivo**.

A cruz de eixos no canto da tela mostra x em vermelho e z em verde. Como z aponta para baixo, o nó no topo de um pilar de 3 m que nasce em `Z = 0` tem `Z = −3`. Ângulos, como o de um apoio inclinado, são medidos de x para z, ou seja, no sentido horário na tela.

Se preferir o y para cima, mude a [convenção de exibição](#y-up-axes): o modelo continua o mesmo, só mudam os números que você lê e digita.

## Graus de liberdade {#degrees-of-freedom}

Cada nó tem três graus de liberdade (GLs):

| GL | Significado | Positivo | Unidade |
| --- | --- | --- | --- |
| `Dx` | deslocamento horizontal | para a direita | m |
| `Dz` | deslocamento vertical | para baixo | m |
| `Ry` | rotação | anti-horário | rad |

Os mesmos sinais valem para os [deslocamentos prescritos](/pt/essentials/loads#prescribed-displacements-support-settlements), para a tabela *Resultados nodais* e para os valores mostrados quando você aponta para um nó.

## Cargas {#loads}

As cargas são positivas no sentido positivo dos eixos. **Fx**, **Fz** e **My** são as componentes de uma carga nodal ou concentrada, **fx** e **fz** as de uma carga uniforme, e **f₁x**, **f₂x**, **f₁z**, **f₂z** as de uma carga trapezoidal no início e no fim do elemento.

| Carga | Sentido positivo |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, para a direita; ao longo do x local do elemento quando **LCS** (sistema de coordenadas local) está marcado |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **para baixo**; ao longo do z local do elemento quando **LCS** está marcado |
| `My` | anti-horário |
| `ΔTc` | aquecimento do eixo da barra, que a alonga |
| `ΔTb − ΔTt` | fibras inferiores mais quentes que as superiores |

Assim, a gravidade é um `fz` **positivo**, e o vento que empurra para a direita o pilar da esquerda é um `fx` positivo. Uma carga distribuída sempre atua por metro do comprimento da própria barra, também quando é dada em eixos globais numa barra inclinada. A página [Cargas](/pt/essentials/loads#element-loads) mostra como informar cada tipo.

::model-figure{caption="Todas as cargas aqui são positivas: fz = 5 kN/m em A–B, Fz = 10 kN em B, My = 10 kNm em C e Fx = 10 kN em D"}
---
nodes: { A: [0, 0], B: [3, 0], C: [4.5, 0], D: [6, 0] }
supports: { A: fixed }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 5 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
  - { node: D, fx: 10 }
results: []
reactions: false
show: [nodeLabels]
---
::

## Eixos locais do elemento {#element-local-axes}

Cada elemento tem seus próprios eixos:

- o **x local** vai do nó inicial ao nó final do elemento;
- o **z local** é o x local girado de 90° no **sentido horário na tela**, o mesmo giro que leva o x global ao z global. Caminhando do nó inicial para o nó final, o z local fica à sua direita.

| Elemento desenhado | O z local aponta para |
| --- | --- |
| da esquerda para a direita | baixo: os eixos locais coincidem com os globais |
| da direita para a esquerda | cima |
| de baixo para cima | a direita |
| de cima para baixo | a esquerda |

A direção do elemento é dada pelo ângulo $\theta$, medido do x global para o z global (no sentido horário na tela). A [matriz de transformação](/pt/elements/beam#transformation-matrix) converte os deslocamentos de extremidade entre os dois sistemas com $\cos\theta$ e $\sin\theta$.

Na visualização, uma linha tracejada ao longo de cada elemento marca o seu lado +z local: as **fibras inferiores**. As cargas de elemento com **LCS** marcado, a posição de uma carga concentrada e os esforços de extremidade seguem os eixos locais. Para inverter o sentido de um elemento, use **Inverter nós** na tabela *Elementos* (veja [direção do elemento](/pt/essentials/elements#element-direction)).

## Esforços internos {#internal-forces}

Corte uma barra a uma distância $x$ do nó inicial. Na face da parte **antes** do corte, cuja normal externa aponta no sentido +x local, os esforços internos são positivos quando apontam no sentido +x local, no sentido +z local e no sentido anti-horário. Na outra face, eles atuam no sentido oposto.

::element-sketch{mode="internal-forces" caption="N, V e M positivos num pequeno trecho de barra: tração, um par de esforços cortantes no sentido horário e momento positivo (tração nas fibras inferiores, tracejadas)"}
::

Em palavras:

| Grandeza | Positivo significa |
| --- | --- |
| $N$ | tração |
| $V$ | gira um pequeno trecho da barra no sentido horário: numa barra desenhada da esquerda para a direita, aponta para cima na face esquerda do trecho e para baixo na face direita |
| $M$ | **tração nas fibras inferiores**, do lado tracejado |

Sendo $q_x$ e $q_z$ a carga distribuída em eixos locais, eles obedecem a

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

Numa carga concentrada $F_x$, $F_z$ ou $M_y$ (em eixos locais), eles sofrem um salto de $\Delta N = -F_x$, $\Delta V = -F_z$ e $\Delta M = -M_y$: uma força no sentido +z local diminui $V$, e um momento anti-horário diminui $M$.

Por isso, uma viga biapoiada sob carga gravitacional tem momento positivo, esforço cortante positivo no apoio esquerdo e negativo no apoio direito. A viga abaixo também é puxada no apoio móvel, de modo que seu esforço normal é positivo.

::model-figure{caption="Viga biapoiada, 10 kN/m e uma força de tração de 20 kN: M = +45 kNm no meio do vão, V = +30 kN no apoio esquerdo e −30 kN no direito, N = +20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
  - { node: B, fx: 20 }
results: [M, V, N]
---
::

Numa viga em balanço, o momento se inverte: é negativo, com tração em cima. Uma força que empurra ao longo do eixo comprime a barra.

::model-figure{caption="Viga em balanço com 10 kN na extremidade livre e 15 kN de compressão: M = −40 kNm no engaste, V = +10 kN, N = −15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 10 }
  - { member: 1, px: -15, at: 4 }
results: [M, V, N]
---
::

Num pórtico, o lado de baixo de cada barra é o seu lado +z local; por isso, a ordem em que você desenha um pilar decide qual dos lados dele é o de baixo. Este pórtico foi desenhado A → B → C → D, o que coloca o z local de todas as barras do lado de dentro: momento positivo significa tração no lado interno do pórtico, e os momentos negativos nos cantos significam tração no lado externo.

::model-figure{caption="Pórtico desenhado A → B → C → D: o z local das três barras aponta para dentro do pórtico"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

Os diagramas são desenhados como na maioria dos cursos europeus: $M$ do lado tracionado, $N$ e $V$ positivos do lado oposto à linha tracejada. Em **Configurações → Configurações de visualização → Diagramas de esforços internos**, você pode colocar $M$ do lado comprimido e $N$ ou $V$ do lado tracejado. Isso muda o desenho, nunca os valores: leia o sinal no valor indicado no diagrama, não no lado em que ele foi desenhado.

## Esforços de extremidade (tabela Resultados dos elementos) {#end-forces-element-results-table}

A tabela *Resultados dos elementos* lista seis **esforços de extremidade** por elemento, nos seus eixos **locais**:

::element-sketch{mode="end-forces" caption="Os seis esforços de extremidade, todos desenhados no sentido positivo: ao longo de x e z locais e no sentido anti-horário"}
::

| Coluna | Atua sobre o elemento no | Positivo no sentido |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | nó inicial | +x local, +z local, anti-horário |
| `X21`, `Z21`, `M21` | nó final | +x local, +z local, anti-horário |

São as forças que os nós exercem sobre o elemento: a matriz de rigidez vezes os deslocamentos de extremidade, mais as forças que equilibrariam as cargas de elemento se as duas extremidades estivessem engastadas,

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

onde $\mathbf{d}_l$ são os deslocamentos de extremidade do elemento em eixos locais e $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ as cargas nodais equivalentes das suas [cargas de elemento](/pt/elements/beam#element-loads).

Os esforços de extremidade seguem os eixos, e não a convenção de $N$–$V$–$M$; por isso, no nó inicial, os sinais se invertem:

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

Para a viga biapoiada acima: `X12 = −20 kN` e `X21 = +20 kN` (tração), `Z12 = Z21 = −30 kN` (os dois apoios empurram para cima, que é −z) e `M12 = M21 = 0`.

Em cada nó, os esforços de extremidade dos elementos que chegam a ele, convertidos para eixos globais, somam a carga nodal mais a reação. Isso permite conferir rapidamente o equilíbrio de um nó.

## Reações {#reactions}

A reação é a força ou o momento que um apoio exerce **sobre a estrutura**, uma para cada GL restringido. Ela tem o sinal de uma carga: positiva no sentido +x, no sentido +z (para baixo) e no sentido anti-horário. Um apoio que recebe carga gravitacional tem, portanto, `Rz` **negativo**.

As reações são dadas em eixos globais, ou nos eixos do próprio nó, quando ele tem um **Ângulo do SCL nodal** (um [apoio inclinado](/pt/essentials/nodes-supports#inclined-skewed-supports)). Na visualização, cada reação é uma seta que aponta no sentido em que o apoio empurra, acompanhada do seu valor absoluto. Os valores com sinal estão na exportação CSV, como `Rx`, `Rz` e `My`.

## Eixos com y para cima {#y-up-axes}

**Configurações → Idioma e localidade → Sistema de coordenadas → x para a direita, y para cima** passa tudo o que você digita e lê para o sistema dos livros: **x** para a direita, **y** para cima e **z** em direção a você. O modelo, os arquivos salvos e os desenhos continuam exatamente iguais; só mudam os números e as letras:

| Grandeza | x para a direita, z para baixo (padrão) | x para a direita, y para cima |
| --- | --- | --- |
| Coordenada vertical | `Z` | `Y`, sinal oposto |
| Cargas, deslocamentos, reações e esforços de extremidade verticais | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, sinal oposto |
| Rotações e momentos | `Ry`, `My` | `Rz`, `Mz`, mesmo sinal (positivo no sentido anti-horário) |
| Ângulo do apoio | medido no sentido horário | medido no sentido anti-horário, sinal oposto |
| Esforços internos | $N$, $V$, $M$ | os mesmos, com os mesmos sinais, desenhados da mesma forma |

Assim, com y para cima, a gravidade é um `fy` **negativo**, e o topo de um pilar de 3 m tem `Y = 3`.

## Unidades {#units}

O solver trabalha sempre em SI: m, N, Pa, rad e, para variações de temperatura, K. As unidades de exibição em [Unidades e configurações](/pt/essentials/units-settings) mudam apenas o que você digita e lê, nunca o modelo.
