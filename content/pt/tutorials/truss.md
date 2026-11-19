---
description: "Tutorial: treliça plana no EduBeam. Esforços nas barras pelos métodos dos nós e das seções, a barra de esforço nulo e uma flecha por trabalhos virtuais. Cerca de 20 minutos."
source: site
---

# Tutorial: treliça plana

Monte uma pequena treliça isostática com barras rotuladas, confira os esforços nas barras pelo método dos nós e pelo método das seções e verifique uma flecha pelo princípio dos trabalhos virtuais.

- **Tempo:** cerca de 20 minutos.
- **Você precisa de:** o EduBeam aberto em uma segunda aba, em um computador com mouse e teclado. Se ainda não usou o EduBeam, faça antes o [Início rápido](/pt/guide/quick-start) ou um dos tutoriais anteriores.
- **Pré-requisitos:** o método dos nós e o método das seções. A verificação opcional da flecha usa o método da carga unitária (trabalhos virtuais).
- **Unidades:** SI. O indicador de unidades, no canto inferior direito da visualização, deve mostrar `m m² kN kNm MPa`. Se aparecerem pés e kips, clique nele e escolha **SI (métrico)** em **Sistema de unidades**.

**Você vai aprender a**

- modelar as barras da treliça como elementos de viga com as duas rótulas de extremidade, desenhando-as com o mouse,
- conferir os esforços nas barras pelo método dos nós e pelo método das seções,
- reconhecer uma barra de esforço nulo e entender por que um modelo com nós articulados funciona para uma treliça.

::div{.actions}
[Abrir o EduBeam ↗](https://run.edubeam.app/?lang=pt){target="_blank"} [Ir para a verificação à mão](#_5-check-by-hand)
::

::model-figure{caption="A treliça pronta: 30 kN nos nós 2 e 3 e os esforços normais nas barras, com tração positiva"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N, w]
show: [nodeLabels, dimensions]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## O problema {#the-problem}

- Um vão de 12 m dividido em três painéis de 4 m, com 3 m de altura: nós 1 a 4 no banzo inferior, nós 5 e 6 no banzo superior.
- Um apoio fixo (de segundo gênero) no nó 1 e um apoio móvel (de primeiro gênero) no nó 4.
- Duas cargas de 30 kN, nos nós 2 e 3 do banzo inferior.
- Barras de aço, $E = 210$ GPa, $A = 20$ cm².

| Elementos | Barras, pelos seus nós | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | banzo inferior |
| 4, 5, 6 | 1–5, 5–6, 6–4 | diagonal de extremidade, banzo superior, diagonal de extremidade |
| 7, 8, 9 | 2–5, 5–3, 3–6 | montante, diagonal central, montante |

**É isostática?** Com $m = 9$ barras, $r = 3$ reações e $j = 6$ nós, $m + r = 12 = 2j$. Cada nó fornece duas equações de equilíbrio, então os esforços nas barras saem apenas da estática.

## Monte o modelo {#model-it}

::div{.steps}

### Material e seção {#_1-material-and-section}

1. Clique em **Limpar estrutura** na barra superior, marque **Excluir materiais** e **Excluir seções** e clique em **Confirmar**. A numeração dos nós e dos elementos recomeça do 1.
2. Aba **Materiais** → **Biblioteca de materiais** → **+** na linha **Aço (S235)**; depois feche a biblioteca com **Cancelar**.
3. Aba **Seções** → **Adicionar seção**. Digite `0,002` em **Área** e `1e-6` em **Iy**, mantenha **Altura** e **Coeficiente de cisalhamento** em `1` e clique em **Adicionar seção**.

Com barras rotuladas, só a área importa; $I_y$ precisa apenas ser positivo.

### Desenhe as barras com rótulas {#_2-draw-the-bars-with-hinges}

No EduBeam, uma barra de treliça é um elemento de viga com **as duas rótulas de extremidade** marcadas. A ferramenta de mouse pode marcá-las para você, e a ordem em que você desenha define a numeração da tabela acima.

1. Aba **Elementos** → o segundo botão **Adicionar elemento**, o do ícone de cursor.
2. Na faixa no topo da visualização, marque **Rótula no início** e **Rótula no fim**. Toda barra que você desenhar a partir de agora recebe as duas.
3. Banzo inferior: clique em (0, 0), (4, 0), (8, 0) e (12, 0) e pressione <kbd>Esc</kbd>.
4. Parte de cima: clique de novo no botão **Adicionar elemento** e depois no nó 1 em (0, 0), em (4, −3), em (8, −3) e no nó 4 em (12, 0). Clicar em um nó existente liga a barra a ele, sem criar um nó novo. Pressione <kbd>Esc</kbd>.
5. Montantes e diagonal central: mais uma vez **Adicionar elemento**; depois clique no nó 2 em (4, 0), no nó 5 em (4, −3), no nó 3 em (8, 0) e no nó 6 em (8, −3). Pressione <kbd>Esc</kbd> e depois <kbd>F</kbd> para ajustar a vista.

A tabela **Elementos** deve listar agora os nove elementos da tabela acima, cada um com as duas caixas de **Rótulas de extremidade** marcadas. <kbd>Esc</kbd> encerra o modo de desenho, mas as caixas das rótulas na faixa continuam marcadas para a próxima vez.

### Apoios e cargas {#_3-supports-and-loads}

1. Clique no nó 1 → **Apoios do nó** → o símbolo **Apoio fixo**. Dê ao nó 4 o **Apoio móvel**.
2. Clique no nó 2 → **Adicionar carga** → `Fz = 30` → **Adicionar carga nodal**. Faça o mesmo no nó 3.

Um `Fz` positivo aponta para baixo. Todas as barras que chegam a um nó são rotuladas, então nada impede a rotação do nó; o EduBeam aceita isso e informa a rotação desse nó como 0.

::

## Resultados {#_4-results}

Nas opções de exibição, no canto superior direito da visualização (a engrenagem as mostra e oculta), desmarque **Forma deformada** e **M<sub>y</sub> (x)**, já que não há flexão em uma treliça, e marque **N (x)**. A tração é positiva, e o EduBeam indica os esforços em kN com duas casas decimais.

- Os dois apoios mostram `30,00` para cima; a reação horizontal do apoio fixo mostra `0,00`, pois não há carga horizontal.
- O banzo inferior mostra `40,00` nas três barras, tração; o banzo superior, `-40,00`, compressão.
- A diagonal central, 5–3, não recebe esforço algum e por isso aparece sem valor, como na figura do topo.
- Aba **Resultados** → **Resultados nodais**: o nó 2 desce $D_z$ = `2,2937 · 10⁻³ m`, ou seja, 2,294 mm.

## Confira à mão {#_5-check-by-hand}

**Reações.** As cargas são simétricas, então $R_1 = R_4 = 30$ kN para cima; sem carga horizontal, a reação horizontal do apoio fixo é nula.

**Nó 1** (método dos nós). A diagonal de extremidade 1–5 tem 5 m de comprimento, então $\sin\alpha = 3/5$ e $\cos\alpha = 4/5$:

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**Nó 2.** O montante 2–5 é a única barra capaz de levar a carga de 30 kN para cima: $N_{25} = +30$ kN, e $N_{23} = N_{12} = 40$ kN.

**Seção pelo painel central** (método das seções). Corte as barras 5–6, 5–3 e 2–3 e fique com a parte esquerda:

- Momentos em relação ao nó 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Forças verticais: o cortante no painel é $R_1 - 30 = 0$, então a diagonal central **5–3 não recebe esforço**: $N_{53} = 0$.

| Barras | À mão | EduBeam |
| --- | --- | --- |
| Banzo inferior 1–2, 2–3, 3–4 | +40 kN, tração | 40,00 |
| Banzo superior 5–6 | −40 kN, compressão | −40,00 |
| Diagonais de extremidade 1–5, 6–4 | −50 kN | −50,00 |
| Montantes 2–5, 3–6 | +30 kN | 30,00 |
| Diagonal central 5–3 | 0 | sem valor |

Uma barra de esforço nulo não é uma barra inútil: ela não recebe esforço *sob este carregamento*, mas, sem ela, a treliça desmorona, como mostram os experimentos abaixo.

::callout{type="details" title="A flecha do nó 2 pelo princípio dos trabalhos virtuais"}
Aplique uma carga unitária para baixo no nó 2 e resolva a treliça de novo à mão: $R_1 = 2/3$, $R_4 = 1/3$ e os esforços $n$ da tabela abaixo. A flecha é $\delta = \sum N\,n\,L / (EA)$:

| Barra | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
| --- | --- | --- | --- | --- |
| 1–2 | 40 | 8/9 | 4 | 142,2 |
| 2–3 | 40 | 8/9 | 4 | 142,2 |
| 3–4 | 40 | 4/9 | 4 | 71,1 |
| 1–5 | −50 | −10/9 | 5 | 277,8 |
| 5–6 | −40 | −4/9 | 4 | 71,1 |
| 6–4 | −50 | −5/9 | 5 | 138,9 |
| 2–5 | 30 | 1 | 3 | 90,0 |
| 5–3 | 0 | −5/9 | 5 | 0 |
| 3–6 | 30 | 1/3 | 3 | 30,0 |
| | | | soma | 963,3 |

$$
\delta_2 = \frac{963{,}3}{EA} = \frac{963{,}3}{210 \times 10^6 \cdot 0{,}002} = 0{,}002294\ \text{m}
$$

São 2,294 mm, o mesmo que o EduBeam mostra como $D_z$ do nó 2, `2,2937 · 10⁻³` m.
::

## Experimente {#_6-experiment}

Mude uma coisa de cada vez, preveja o resultado e só então confira. <kbd>Ctrl</kbd>+<kbd>Z</kbd> desfaz cada alteração.

**Mova uma carga.** Coloque as duas cargas no nó 2: exclua a carga do nó 3 e altere a outra para `Fz = 60`. Agora $R_1 = 40$ kN, o cortante no painel central é $40 - 60 = -20$ kN, e a diagonal central precisa absorvê-lo: $N_{53} = -20 \cdot 5/3 = -33{,}33$ kN, compressão.

::model-figure{caption="60 kN no nó 2: a diagonal central 5–3 agora absorve o cortante do painel"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 60 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

**Remova a diagonal central.** Exclua o elemento 8. O painel central vira um retângulo de barras rotuladas, que pode se distorcer lateralmente. O EduBeam não mostra resultados, informa *As articulações dos nós 2, 3, 5, 6 deixam a estrutura se mover.* (os quatro cantos desse painel) e anima o movimento.

**Desmarque todas as rótulas** na tabela **Elementos**. A treliça vira um pórtico de nós rígidos. Marque **M<sub>y</sub> (x)**: os momentos fletores ficam abaixo de 0,1 kNm, e os esforços normais mudam menos de 0,1 %. É por isso que a idealização com nós articulados funciona para uma treliça triangulada.

**Troque o apoio móvel por um apoio fixo.** Uma quarta reação torna a treliça uma vez hiperestática, e o resultado pode surpreender: o banzo inferior passa a **não receber esforço algum**, e cada apoio empurra para dentro com 40 kN. Os nós 1 e 4 não podem se afastar, então as três barras alinhadas do banzo entre eles precisam ter alongamento total nulo. As três têm o mesmo esforço, logo esse esforço é zero, e os seus 40 kN passam para os apoios. Isso vale quaisquer que sejam as áreas das barras.

::model-figure{caption="Apoios fixos nas duas extremidades: os apoios assumem o papel do banzo inferior"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: pin }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Próximos passos {#next-steps}

A teoria por trás do elemento de barra está em [Elemento de treliça](/pt/elements/truss).

::card-grid{cols="2"}
:::card{title="Praticar: treliças Warren" icon="lucide:dices" to="/pt/practice?p=T2048"}
As reações e o esforço em uma barra de uma treliça maior, com as suas respostas conferidas na hora. Comece pelo exercício T2048; para mais, deixe selecionada apenas **Treliça Warren** e clique em **Novo exercício**.
:::
:::card{title="Próximo: viga contínua e recalque de apoio" icon="lucide:spline" to="/pt/tutorials/continuous-beam"}
Uma viga hiperestática: o que a continuidade traz, o que um recalque de apoio provoca nela e o método das forças para conferir as duas coisas.
:::
::
