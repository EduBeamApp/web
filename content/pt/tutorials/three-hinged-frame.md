---
description: "Tutorial: modele no EduBeam um pórtico triarticulado com carga uniforme, leia reações, empuxo e esforços e confira tudo à mão, até a flecha da rótula."
source: site
---

# Tutorial: pórtico triarticulado

Modele um pórtico com uma rótula no meio do vão, leia as reações e os diagramas e confira cada número à mão, até a flecha da rótula.

- **Tempo:** cerca de 15 minutos.
- **Você precisa de:** o EduBeam aberto em uma segunda aba, em um computador com mouse e teclado. Se ainda não usou o EduBeam, faça antes o [Início rápido](/pt/guide/quick-start) ou o tutorial da [viga inclinada](/pt/tutorials/inclined-beam).
- **Pré-requisitos:** o equilíbrio de um pórtico e os diagramas de corpo livre. A verificação opcional da flecha usa o método da carga unitária (trabalhos virtuais).
- **Unidades:** SI. O indicador de unidades, no canto inferior direito da visualização, deve mostrar `m m² kN kNm MPa`. Se aparecerem pés e kips, clique nele e escolha **SI (métrico)** em **Sistema de unidades**.

**Você vai aprender a**

- desenhar um pórtico como uma única poligonal com o mouse,
- colocar uma rótula dentro de uma barra com as caixas de **Rótulas de extremidade**,
- obter o empuxo horizontal da condição $M = 0$ na rótula e interpretar o sinal de $V$ em barras desenhadas em sentidos diferentes.

::div{.actions}
[Abrir o EduBeam ↗](https://run.edubeam.app/?lang=pt){target="_blank"} [Ir para a verificação à mão](#_6-check-by-hand)
::

::model-figure{caption="O pórtico pronto: 10 kN/m na viga, apoios fixos nos nós 1 e 5 e uma rótula no nó 3"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## O problema {#the-problem}

- Dois pilares de 4 m, com apoios fixos (de segundo gênero) nas bases, nós 1 e 5, a 8 m um do outro.
- Uma viga horizontal do nó 2 ao nó 4 no topo, com uma rótula no meio do vão, no nó 3.
- Uma carga uniforme $q = 10$ kN/m em toda a viga.
- Aço, $E = 210$ GPa, e $I_y = 8{,}356 \times 10^{-5}$ m⁴ (um IPE 300) em todas as barras.

| Nó | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | apoio fixo |
| 2 | 0 | −4 | canto |
| 3 | 4 | −4 | rótula na viga |
| 4 | 8 | −4 | canto |
| 5 | 8 | 0 | apoio fixo |

O eixo z aponta **para baixo**, então o topo dos pilares está em $z = -4$.

**É isostático?** Dois apoios fixos dão quatro reações. As três equações de equilíbrio e $M_3 = 0$ na rótula somam quatro equações: sim.

## Monte o modelo {#model-it}

::div{.steps}

### Material e seção {#_1-material-and-section}

1. Clique em **Limpar estrutura** na barra superior, marque **Excluir materiais** e **Excluir seções** e clique em **Confirmar**. A numeração dos nós e dos elementos recomeça do 1.
2. Aba **Materiais** → **Biblioteca de materiais** → **+** na linha **Aço (S235)**; depois feche a biblioteca com **Cancelar**.
3. Aba **Seções** → **Adicionar seção**. Digite `8,356e-5` em **Iy**, mantenha **Área**, **Altura** e **Coeficiente de cisalhamento** em `1` e clique em **Adicionar seção**.

Uma área de 1 m² impede que as barras encurtem ou se deformem por cisalhamento de forma perceptível, como supõe o cálculo à mão da flecha. Os esforços internos de um pórtico isostático não dependem de $E$, $A$ nem $I_y$.

### Desenhe o pórtico {#_2-draw-the-frame}

1. Aba **Elementos** → o segundo botão **Adicionar elemento**, o do ícone de cursor.
2. Clique em (0, 0), (0, −4), (4, −4), (8, −4) e (8, 0). Cada clique adiciona o nó seguinte e o liga ao anterior; os cliques se encaixam na grade.
3. Pressione <kbd>Esc</kbd> para parar de desenhar e depois <kbd>F</kbd> para ajustar a vista.

Agora você tem os nós 1 a 5 e os elementos 1 a 4, numerados na ordem em que os desenhou, como nas figuras desta página. Compare a tabela **Nós** com a tabela acima e corrija qualquer coordenada que tenha saído errada.

### Apoios e a rótula {#_3-supports-and-the-hinge}

1. Clique no nó 1 → **Apoios do nó** → o símbolo **Apoio fixo**. Faça o mesmo no nó 5.
2. Na tabela **Elementos**, encontre o elemento 2, do nó 2 ao nó 3, e marque a segunda das suas caixas de **Rótulas de extremidade**: a rótula no fim dele, no nó 3.

![A tabela Elementos: o elemento 2 tem a rótula do fim marcada, no nó 3](/screenshots/pt/p2t-frame-elements-table.webp)

Uma rótula basta. O elemento 3 passa a ser a única barra ligada rigidamente ao nó 3, então nenhum momento pode passar para ele ali. Marcar também o início do elemento 3 não muda nada.

### Carga {#_4-load}

1. Aba **Cargas** → **Adicionar carga de elemento**.
2. **Tipo de carga** *Carga distribuída uniforme*, **Elemento** `2`, `fz = 10`. Clique em **Adicionar carga de elemento**.
3. Repita para o elemento 3.

Um `fz` positivo aponta para baixo. A viga é horizontal, então a caixa **LCS** (sistema de coordenadas local) não faz diferença aqui.

::

## Resultados {#_5-results}

Nas opções de exibição, no canto superior direito da visualização (a engrenagem as mostra e oculta), **Forma deformada**, **M<sub>y</sub> (x)** e **Reações** já vêm ligados. Marque **N (x)** e **V<sub>z</sub> (x)** para ver o resto, ou desmarque alguns para ver um diagrama de cada vez. O EduBeam indica os valores em kN e kNm com duas casas decimais.

- Cada base mostra `40,00` para cima e `20,00` para dentro.
- O momento fletor mostra `-80,00` nos dois cantos e não tem valor na rótula, onde é nulo. O EduBeam o desenha do lado tracionado, aqui por fora do pórtico.
- O esforço normal é negativo em todo o pórtico: `-40,00` nos pilares, `-20,00` na viga. As quatro barras estão comprimidas.
- Aba **Resultados** → **Resultados nodais**: a rótula, nó 3, desce $D_z$ = `4,2554 · 10⁻² m`, ou seja, 42,55 mm, o valor na rótula na vista $w(x)$ da figura acima.

## Confira à mão {#_6-check-by-hand}

**Reações verticais.** Por simetria, cada base recebe metade dos 80 kN:

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Reações horizontais.** Corte o pórtico na rótula e tome os momentos em relação ao nó 3 para a metade esquerda, onde o momento é nulo:

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

As duas bases empurram para dentro com 20 kN. Sem esse empuxo, que vem de apoios fixos que não podem se afastar, o pórtico não ficaria em pé: os pilares se abririam e a rótula cairia.

| Grandeza | Fórmula | À mão | EduBeam |
| --- | --- | --- | --- |
| Reações verticais | $q \cdot 8/2$ | 40 kN | 40,00 |
| Reações horizontais | de $M_3 = 0$ | 20 kN | 20,00 |
| Momentos nos cantos, nós 2 e 4 | $H_1 \cdot 4$ | 80 kNm, tração por fora | −80,00 |
| Momento na rótula, nó 3 | | 0 | sem valor |
| $N$ nos pilares | $-V_1$ | −40 kN | −40,00 |
| $N$ na viga | $-H_1$ | −20 kN | −20,00 |
| $V$ nos pilares | $\pm H_1$ | ±20 kN | −20,00; 20,00 |
| $V$ na viga nos nós 2, 3, 4 | $V_1 - q\,x$ | 40; 0; −40 kN | 40,00; sem valor; −40,00 |

Os dois pilares têm o mesmo cortante com sinais opostos, −20 kN no elemento 1 e +20 kN no elemento 4, porque os eixos locais de cada elemento seguem o sentido em que ele foi desenhado: o elemento 1 para cima, o elemento 4 para baixo. Inverta os nós de um pilar e o sinal dele se inverte. A página [Sistema de coordenadas e convenções de sinais](/pt/elements/conventions#internal-forces) explica por quê.

Na viga, $M(x) = -80 + 40x - 5x^2$ kNm, com $x$ medido a partir do nó 2. O momento é nulo na rótula e nunca positivo: a viga inteira tem momento negativo. O cortante $V(x) = 40 - 10x$ se anula exatamente na rótula, e é ali, portanto, que o momento tem o seu extremo.

::callout{type="details" title="A flecha da rótula pelo princípio dos trabalhos virtuais"}
Aplique uma carga unitária para baixo no nó 3. Ela dá as reações $\bar V = \bar H = 1/2$ e um momento $\bar m$ que cresce de 0 na base até 2 no canto e volta a 0 na rótula, com tração por fora, como o momento real $M$. Integre $M \bar m$ nas quatro barras:

$$
\text{pilares: } 2\int_0^4 (20\,y)(0{,}5\,y)\,dy = 426{,}7
$$

$$
\text{viga: } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0{,}5x)\,dx = 320
$$

Com $EI = 210 \times 10^6 \cdot 8{,}356 \times 10^{-5} = 17\,548$ kNm²:

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746{,}7}{17\,548} = 0{,}04255\ \text{m}
$$

São os 42,55 mm que o EduBeam mostra como `4,2554 · 10⁻²` m. O 4 do último algarismo vem do pequeníssimo encurtamento e da deformação por cisalhamento que uma área de 1 m² ainda permite e que o cálculo à mão despreza. Com a área real de um IPE 300, $A = 53{,}8$ cm², e a alma como área de cisalhamento (um coeficiente de cisalhamento de 0,40), as barras encurtam e se deformam mais por cisalhamento, e a rótula desce 43,7 mm, cerca de 3 % a mais.
::

## Experimente {#_7-experiment}

Mude uma coisa de cada vez, preveja o resultado e só então confira. <kbd>Ctrl</kbd>+<kbd>Z</kbd> desfaz cada alteração.

**Desmarque a rótula.** O pórtico passa a ser uma vez hiperestático. O empuxo cai à metade, 10 kN, os momentos nos cantos caem para −40 kNm, e surge na viga um momento positivo de 40 kNm no meio do vão. O nó 3 agora desce apenas 12,16 mm, em vez de 42,55 mm. As seções também passam a importar: dê à viga uma seção mais rígida que a dos pilares, e os momentos nos cantos aumentam.

::model-figure{caption="Sem a rótula: menos empuxo, metade do momento nos cantos e um momento positivo no meio do vão"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], [2, 3], [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

**Engaste as bases.** Dê aos nós 1 e 5 o símbolo **Engaste**. O empuxo sobe para 30 kN e surgem momentos de 40 kNm nas bases (o EduBeam mostra `39,99`, porque os pilares encurtam ligeiramente), mas os momentos nos cantos continuam em 80 kNm. Por simetria, o cortante na rótula é nulo, então cada metade da viga continua trabalhando como um balanço de 4 m a partir do seu canto: $q \cdot 4^2/2 = 80$ kNm.

**Empurre lateralmente.** De volta aos apoios fixos, adicione uma carga nodal `Fx = 10` kN no nó 2. As reações perdem a simetria: 35 kN e 45 kN para cima, 15 kN e 25 kN na horizontal. Confira-as com as mesmas três equações e $M_3 = 0$; a carga no nó 2 não tem braço de alavanca em relação ao nó 3. O canto esquerdo cai para −60 kNm, e a metade esquerda da viga passa a ter um pequeno momento positivo, de 1,25 kNm a 0,5 m da rótula.

::model-figure{caption="Uma carga horizontal de 10 kN no nó 2: o canto direito agora recebe 100 kNm"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
  - { node: 2, fx: 10 }
results: [M, N]
show: [nodeLabels]
---
::

**Adicione uma segunda rótula.** Marque também a rótula do início do elemento 2, no nó 2. Duas rótulas na viga sobre dois pilares com apoios fixos formam um mecanismo. O EduBeam não mostra resultados, informa *As articulações dos nós 2, 3 deixam a estrutura se mover.* e anima o movimento.

## Próximos passos {#next-steps}

::card-grid{cols="2"}
:::card{title="Praticar: pórticos triarticulados" icon="lucide:dices" to="/pt/practice?p=H2048"}
O mesmo pórtico sob novas cargas, entre elas um empurrão horizontal, com as suas respostas conferidas na hora. Comece pelo exercício H2048; para mais, deixe selecionado apenas **Pórtico triarticulado** e clique em **Novo exercício**.
:::
:::card{title="Próximo: treliça plana" icon="lucide:git-fork" to="/pt/tutorials/truss"}
Nove barras rotuladas: o método dos nós, o método das seções, uma barra de esforço nulo e uma flecha pelo princípio dos trabalhos virtuais.
:::
::
