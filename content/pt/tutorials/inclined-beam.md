---
description: "Tutorial: viga inclinada de cobertura ou de escada no EduBeam: carga por metro em planta, esforços N e V ao longo da inclinação e o apoio móvel girado. Cerca de 15 minutos."
source: site
---

# Tutorial: viga inclinada

Modele uma viga inclinada de cobertura sob neve, leia os esforços normal e cortante ao longo da inclinação e confira-os à mão.

- **Tempo:** cerca de 15 minutos. Este é o primeiro e o mais curto dos quatro tutoriais.
- **Você precisa de:** o EduBeam aberto em uma segunda aba, em um computador com mouse e teclado. Se ainda não usou o EduBeam, faça antes o [Início rápido](/pt/guide/quick-start): ele mostra as abas e os diálogos que este tutorial usa.
- **Pré-requisitos:** o equilíbrio de uma viga biapoiada e a decomposição de uma força em duas componentes.
- **Unidades:** SI. O indicador de unidades, no canto inferior direito da visualização, deve mostrar `m m² kN kNm MPa`. Se aparecerem pés e kips, clique nele e escolha **SI (métrico)** em **Sistema de unidades**.

**Você vai aprender a**

- converter uma carga dada por metro em planta na carga por metro de barra que o EduBeam usa,
- orientar uma carga distribuída na vertical ou perpendicularmente à barra com a caixa **LCS**,
- girar um apoio móvel e ver que isso altera o esforço normal, mas não o momento fletor.

::div{.actions}
[Abrir o EduBeam ↗](https://run.edubeam.app/?lang=pt){target="_blank"} [Ir para a verificação à mão](#check-by-hand)
::

::model-figure{caption="A viga de cobertura pronta: 3 kN/m de neve por metro em planta, informados como 2,4 kN/m ao longo da barra, com apoio fixo no beiral (nó 1) e apoio móvel na cumeeira (nó 2)"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## O problema {#the-problem}

- Uma viga reta, do nó 1 em (0, 0) até o nó 2 em (4, −3): 4 m em planta e 3 m de altura, portanto com $L = 5$ m de comprimento, $\cos\alpha = 4/5$ e $\sin\alpha = 3/5$.
- Um apoio fixo (de segundo gênero) no nó 1, o beiral. No nó 2, a cumeeira, um apoio móvel (de primeiro gênero) que se desloca na horizontal, de modo que a sua reação é vertical.
- Neve $s = 3$ kN/m, dada, como as normas a dão, **por metro em planta** (de projeção horizontal).
- Aço, $E = 210$ GPa, e $I_y = 8{,}356 \times 10^{-5}$ m⁴, o de um IPE 300.

**É isostática?** Três reações e três equações de equilíbrio: sim. Os esforços saem apenas da estática; $E$ e $I_y$ só importam para a flecha.

## Monte o modelo {#model-it}

::div{.steps}

### Material e seção {#material-and-section}

1. Clique em **Limpar estrutura** na barra superior, marque **Excluir materiais** e **Excluir seções** e clique em **Confirmar**. A numeração dos nós e dos elementos recomeça do 1.
2. Aba **Materiais** → **Biblioteca de materiais** → **+** na linha **Aço (S235)**; depois feche a biblioteca com **Cancelar**.
3. Aba **Seções** → **Adicionar seção**. Digite `8,356e-5` em **Iy**, mantenha **Área**, **Altura** e **Coeficiente de cisalhamento** em `1` e clique em **Adicionar seção**.

Uma área de 1 m² impede que a barra encurte ou se deforme por cisalhamento de forma perceptível, como supõe o cálculo à mão.

### Desenhe a barra {#draw-the-member}

1. Aba **Elementos** → o segundo botão **Adicionar elemento**, o do ícone de cursor.
2. Clique em (0, 0) e depois em (4, −3). As réguas e a mira mostram onde você está, e os cliques se encaixam na grade.
3. Pressione <kbd>Esc</kbd> para parar de desenhar e depois <kbd>F</kbd> para ajustar a vista.

O eixo z aponta para baixo, então o nó 2, 3 m **acima** do nó 1, fica em $z = -3$. Confira os dois nós na tabela **Nós** e corrija qualquer coordenada que tenha saído errada.

### Apoios {#supports}

Clique no nó 1 → **Apoios do nó** → o símbolo **Apoio fixo**. Dê ao nó 2 o **Apoio móvel** da mesma forma.

### Carga {#load}

A neve sobre a viga soma $3 \cdot 4 = 12$ kN. O EduBeam distribui uma carga uniforme ao longo do **comprimento** da barra, então os mesmos 12 kN sobre 5 m dão

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0{,}8 = 2{,}4\ \text{kN/m}
$$

1. Aba **Cargas** → **Adicionar carga de elemento**.
2. **Tipo de carga** *Carga distribuída uniforme*, **Elemento** `1`, `fz = 2,4`.
3. **Desmarque LCS**, para que `fz` atue na vertical, e clique em **Adicionar carga de elemento**.

::callout{type="warning" title="LCS vem marcado por padrão"}
Com **LCS** (sistema de coordenadas local) marcado, `fz` atua segundo o eixo z local do elemento, perpendicular à inclinação: é o caso do vento sobre um telhado, não da neve. Em uma viga horizontal as duas coisas coincidem, e por isso o detalhe passa despercebido com facilidade. As setas da carga mostram para onde ela aponta; os detalhes estão em [Cargas](/pt/essentials/loads#uniformly-distributed-load).
::

::

## Resultados {#results}

O EduBeam resolve a viga assim que a carga é aplicada. Nas opções de exibição, no canto superior direito da visualização (a engrenagem as mostra e oculta), **Forma deformada**, **M<sub>y</sub> (x)** e **Reações** já vêm ligados; marque também **N (x)** e **V<sub>z</sub> (x)**. A chave sob a figura do topo mostra os mesmos diagramas.

O EduBeam indica diagramas e reações em kN e kNm com duas casas decimais, então você deve ler:

- `6,00` em cada apoio, para cima. A reação horizontal do apoio fixo mostra `0,00`: nenhuma força horizontal atua.
- `6,00` kNm, o pico do momento fletor, no meio do vão.
- `4,80` kN de cortante no nó 1 e `-4,80` no nó 2.
- `-3,60` kN de esforço normal no nó 1 (compressão) e `3,60` no nó 2 (tração), passando por zero no meio do vão.

## Confira à mão {#check-by-hand}

**Reações.** A resultante de 12 kN atua a 2 m do nó 1, medidos em planta, então os momentos em relação a qualquer uma das extremidades dão $V_1 = V_2 = 6$ kN. Nenhuma força horizontal atua, portanto $H_1 = 0$.

**Momento fletor.** Para forças verticais, só os braços de alavanca horizontais contam. A uma distância $x$ do nó 1, medida em planta,

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

exatamente como em uma viga horizontal de vão $a = 4$ m sob a mesma carga por metro em planta.

**Cortante e esforço normal.** As forças à esquerda de um corte em $x$ somam uma força vertical $T(x) = V_1 - s\,x$. Decomponha-a em uma parte perpendicular à barra e outra ao longo dela:

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | Nó 1, $T = +6$ kN | Meio do vão, $T = 0$ | Nó 2, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0{,}8 = 4{,}8$ kN | 0 | −4,8 kN |
| $N$ | $-6 \cdot 0{,}6 = -3{,}6$ kN | 0 | +3,6 kN |
| $M$ | 0 | 6 kNm | 0 |

Tudo como no EduBeam. A reação para cima no nó 1 empurra a extremidade inferior para cima ao longo da inclinação, contra a barra: compressão. A reação para cima no nó 2 puxa a extremidade superior ainda mais para cima ao longo da inclinação, afastando-a da barra: tração. Os sinais seguem o sentido do elemento, do nó 1 para o nó 2, como explica a página [Sistema de coordenadas e convenções de sinais](/pt/elements/conventions#internal-forces).

## Experimente {#experiment}

Mude uma coisa de cada vez, preveja o resultado e só então confira. <kbd>Ctrl</kbd>+<kbd>Z</kbd> desfaz cada alteração.

**Esqueça o cosseno.** Informe `fz = 3` em vez de 2,4. São 3 kN por metro de inclinação, 15 kN no total, e todos os resultados ficam 25 % maiores do que deveriam: reações de 7,5 kN e 7,5 kNm. Em um telhado com 30° de inclinação o erro seria de 15 %; com 45°, de 41 %.

**Deixe LCS marcado.** Marque **LCS** na carga de 2,4 kN/m. Agora ela empurra perpendicularmente à inclinação, como faria o vento, com uma componente horizontal de 7,2 kN que só o apoio fixo pode absorver. O momento sobe para $2{,}4 \cdot 5^2/8 = 7{,}5$ kNm, e o esforço normal passa a ser uma tração constante de 4,5 kN.

::model-figure{caption="Os mesmos 2,4 kN/m com LCS marcado: perpendiculares à inclinação, e o apoio fixo absorve 7,2 kN na horizontal"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Gire o apoio móvel.** Desmarque **LCS** de novo e mude apenas a direção em que o apoio móvel do nó 2 se desloca. Clique no nó 2 → **Apoios do nó**, digite `-36,87` em **Ângulo do SCL nodal** e pressione <kbd>Enter</kbd> (ou use o campo **α** da linha dele na tabela **Nós**).

![O menu Apoios do nó do nó 2: os símbolos de apoio, as direções restringidas e o Ângulo do SCL nodal](/screenshots/pt/p2t-node-supports-angle.webp){.shot-md}

O ângulo gira os eixos próprios do nó. Nos eixos padrão, x para a direita e z para baixo, um ângulo negativo os gira no sentido anti-horário na tela. Há mais detalhes em [Apoios inclinados](/pt/essentials/nodes-supports#inclined-skewed-supports).

O apoio móvel agora se desloca ao longo da inclinação, então a sua reação é perpendicular à barra: $12 \cdot 2 / 5 = 4{,}8$ kN, pelos momentos em relação ao nó 1. O apoio fixo absorve o resto e, com ele, todo o esforço normal: −7,2 kN no nó 1, zero no nó 2.

::model-figure{caption="O apoio móvel do nó 2 girado −36,87° para se deslocar ao longo da inclinação: o esforço normal vai de −7,2 kN a zero"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Use um apoio móvel vertical.** Volte o ângulo para 0 e escolha o **Apoio móvel vertical** para o nó 2. Ele se desloca na vertical, então só pode empurrar na horizontal: os momentos em relação ao nó 1, $H_2 \cdot 3 = 12 \cdot 2$, dão 8 kN, e o apoio fixo segura a viga contra esse empuxo. A barra inteira fica comprimida.

::model-figure{caption="Um apoio móvel vertical no nó 2: um empuxo horizontal de 8 kN e a viga inteira comprimida"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

Os três apoios móveis lado a lado:

| Apoio móvel no nó 2 | Reação no nó 2 | Reação no nó 1 | $N$ do nó 1 ao 2 |
| --- | --- | --- | --- |
| Horizontal | 6 kN ↑ | 6 kN ↑ | −3,6 a +3,6 kN |
| Ao longo da inclinação | 4,8 kN ⊥ barra | 2,88 kN →, 8,16 kN ↑ | −7,2 a 0 kN |
| Vertical | 8 kN ← | 8 kN →, 12 kN ↑ | −13,6 a −6,4 kN |

**O momento fletor nunca muda**, e o esforço cortante também não: 6 kNm e ±4,8 kN nos três casos. O nó 1, o nó 2 e todos os cortes estão sobre uma mesma reta, o eixo da barra. A parte da reação do nó 2 que atua ao longo dessa reta não tem momento em relação a nenhum desses pontos, então só acrescenta esforço normal. A parte perpendicular à barra fica fixada em 4,8 kN pelos momentos em relação ao nó 1, para qualquer direção do apoio móvel. A direção do apoio móvel decide apenas para onde vai o empuxo, o que importa para a parede ou para o patamar da escada que precisa absorvê-lo.

## Próximos passos {#next-steps}

::card-grid{cols="2"}
:::card{title="Praticar: vigas biapoiadas com balanço" icon="lucide:dices" to="/pt/practice?p=O2048"}
As reações e o maior momento de uma viga sob carga distribuída, com as suas respostas conferidas na hora. Comece pelo exercício O2048; para mais, deixe selecionada apenas **Viga biapoiada com balanço** e clique em **Novo exercício**.
:::
:::card{title="Próximo: pórtico triarticulado" icon="lucide:triangle" to="/pt/tutorials/three-hinged-frame"}
Quatro barras, uma rótula interna e um empuxo horizontal: um pórtico que ainda se resolve apenas com a estática.
:::
::
