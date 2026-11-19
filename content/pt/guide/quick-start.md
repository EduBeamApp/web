---
description: "Modele uma viga biapoiada de aço no EduBeam em cerca de dez minutos: material, seção, nós, apoios e carga; depois leia as reações e os diagramas e confira-os à mão."
source: site
---

# Início rápido

Em cerca de dez minutos você vai montar uma viga biapoiada de aço, ler as reações, o esforço cortante, o momento fletor e a flecha, e conferir cada número à mão. Abra o EduBeam em uma segunda aba, ou ao lado desta página, e acompanhe.

::div{.actions}
[Abrir o EduBeam ↗](https://run.edubeam.app/?lang=pt){target="_blank"} [Ir direto à conferência à mão](#_8-check-by-hand)
::

## O problema {#the-problem}

Uma viga de 6 m tem apoio fixo no nó 1 e apoio móvel no nó 2 e recebe uma carga uniforme de 12 kN/m em todo o comprimento. É um perfil de aço IPE 200: $E = 210$ GPa, $G = 81$ GPa, $A = 28{,}48\ \text{cm}^2$ e $I_y = 1943\ \text{cm}^4$. Os quatro valores vêm das bibliotecas do EduBeam, então não é preciso procurar nada.

::model-figure{caption="A viga que você vai montar: um vão de 6 m do nó 1 ao nó 2, sob 12 kN/m"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: []
show: [nodeLabels, dimensions]
---
::

## Monte o modelo {#build-the-model}

::div{.steps}

### Comece com um modelo vazio {#start-from-an-empty-model}

Na primeira visita, um diálogo de boas-vindas pergunta como você quer começar. Escolha **SI (métrico)** em **Sistema de unidades**, mantenha **x para a direita, z para baixo** em **Sistema de coordenadas** e clique em **Pular por enquanto**. O aplicativo mostra então um pequeno pórtico de exemplo.

1. Clique em **Limpar estrutura** na barra superior (no celular, o botão fica no menu **☰**).
2. Marque **Excluir materiais** e **Excluir seções** e clique em **Confirmar**.

A tela fica vazia, e duas mensagens em vermelho avisam que ainda não há material nem seção. Os próximos passos resolvem isso. Nada se perde: <kbd>Ctrl</kbd>+<kbd>Z</kbd> traz o pórtico de volta, e ele também fica guardado em **☰ → Estruturas recentes**.

### Confira as unidades {#_1-check-the-units}

O indicador de unidades, no canto inferior direito da visualização, mostra as unidades de todos os campos e resultados. Esta página usa o SI, que o indicador mostra como `m m² kN kNm MPa`, e o eixo z apontando para baixo. Se o indicador mostrar pés e kips, clique nele e escolha **SI (métrico)** em **Sistema de unidades**. No mesmo lugar, **Sistema de coordenadas** deve estar em **x para a direita, z para baixo**: com o y para cima, uma carga positiva aponta para cima, e os sinais desta página não corresponderiam.

![Os botões de grade (G) e de encaixe (S), a mira e o indicador de unidades](/screenshots/pt/ui-grid-units.webp){.shot-sm}

### Adicione o material e a seção {#_2-add-the-material-and-cross-section}

Todo elemento precisa de um material e de uma seção, então adicione-os primeiro, a partir das bibliotecas.

1. Abra a aba **Materiais** na barra inferior e clique em **Biblioteca de materiais**.
2. Clique em **+** na linha **Aço (S235)** ($E = 210\,000$ MPa, $G = 81\,000$ MPa). A biblioteca continua aberta para você adicionar outros; feche-a com **Cancelar**.
3. Abra a aba **Seções** e clique em **Biblioteca de seções**.
4. Role até a linha **IPE 200 (aprox.)**, clique em **+** e feche a biblioteca com **Cancelar**.

As duas mensagens em vermelho somem, e a aba **Seções** lista o IPE 200:

![O IPE 200 na aba Seções: área, Iy, altura e coeficiente de cisalhamento](/screenshots/pt/a-qs-cross-sections.webp)

Para digitar valores próprios em vez dos da biblioteca, use **Adicionar material** e **Adicionar seção**. O coeficiente de cisalhamento, aqui 0,3933, volta a aparecer na [conferência à mão](#_8-check-by-hand).

### Adicione os nós {#_3-add-the-nodes}

1. Abra a aba **Nós**. Ela tem dois botões **Adicionar nó**: o **+** abre um diálogo, e o do ícone de cursor posiciona nós com o mouse. Clique em **+ Adicionar nó**.
2. Deixe **Coordenada X** e **Coordenada Z** em `0` e clique em **Adicionar nó**. O diálogo se fecha e o nó `1` aparece.
3. Clique de novo em **+ Adicionar nó**, digite `6` em **Coordenada X** e clique em **Adicionar nó**. Este é o nó `2`.

![O diálogo Adicionar novo nó. Ele também pode definir os apoios de imediato.](/screenshots/pt/qs-node.webp){.shot-md}

### Conecte-os com um elemento {#_4-connect-them-with-an-element}

Abra a aba **Elementos** e clique em **+ Adicionar elemento**. O diálogo já sugere **Nó inicial** `1`, **Nó final** `2`, além do seu material e da sua seção. Clique em **Adicionar elemento**.

![Adicionar novo elemento: os dois nós de extremidade, uma rótula opcional em cada extremidade, o material e a seção](/screenshots/pt/a-qs-element.webp){.shot-md}

Uma viga aparece entre os nós. Pressione <kbd>F</kbd> para ajustá-la à tela. Uma etiqueta azul *Faltam apoios*, no canto superior esquerdo da visualização, explica por que ainda não há resultados.

### Adicione os apoios {#_5-add-the-supports}

De volta à aba **Nós**, cada linha tem um seletor de apoio no início da coluna **GLs restringidos**.

- Nó `1`: escolha **Apoio fixo** (de segundo gênero). Isso marca `Dx` e `Dz`.
- Nó `2`: escolha **Apoio móvel** (de primeiro gênero). Isso marca apenas `Dz`.

![O seletor de apoio na tabela da aba Nós](/screenshots/pt/a-qs-support-picker.webp){.shot-lg}

A etiqueta *Faltam apoios* desaparece. Você também pode clicar em um nó na visualização e escolher **Apoios do nó**. A página [Nós e apoios](/pt/essentials/nodes-supports#supports) lista todos os tipos de apoio.

### Adicione a carga {#_6-add-the-load}

1. Abra a aba **Cargas** e clique em **Adicionar carga de elemento**.
2. Mantenha **Tipo de carga** em *Carga distribuída uniforme* e **Elemento** em `1`.
3. Digite `12` em **fz**, deixe **fx** em `0` e clique em **Adicionar carga de elemento**.

![O diálogo mostra uma prévia da carga no elemento](/screenshots/pt/a-qs-load.webp){.shot-md}

Um `fz` positivo aponta no sentido +z, que é **para baixo**; portanto um valor positivo é uma carga gravitacional. A caixa **LCS** marcada significa que a carga segue os eixos do próprio elemento, o seu sistema de coordenadas local (SCL); numa viga horizontal desenhada da esquerda para a direita, eles coincidem com os eixos globais. Veja as [convenções de sinais](/pt/elements/conventions#loads).

::

## Leia os resultados {#_7-read-the-results}

A viga é resolvida no instante em que a carga entra, e de novo a cada alteração que você fizer: não há botão *Calcular*. O painel no canto superior direito da visualização liga e desliga os desenhos. **Forma deformada**, **M<sub>y</sub>(x)** e **Reações** já vêm ligados. Marque **V<sub>z</sub>(x)** para acrescentar o esforço cortante.

![As opções de exibição, com o esforço cortante ligado](/screenshots/pt/a-qs-display.webp){.shot-md}

Sua tela deve estar igual a esta figura. Alterne entre o momento fletor e o esforço cortante:

::model-figure{caption="A viga pronta: reações de 36 kN e 54 kNm no meio do vão"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: [M, V]
show: [nodeLabels]
---
::

| Desenho | O que observar |
| --- | --- |
| **Reações** | Duas setas para cima de **36 kN**, uma em cada apoio. |
| **V<sub>z</sub>(x)** | Uma reta de **+36 kN** no nó `1` até **−36 kN** no nó `2`, passando por zero no meio do vão. |
| **M<sub>y</sub>(x)** | Uma parábola com o máximo de **54 kNm** no meio do vão, desenhada do lado tracionado, abaixo da viga. |
| **Forma deformada** | Uma deformada simétrica, desenhada em escala ampliada. |

Para ver os números, abra a aba **Resultados**. **Resultados nodais** lista os deslocamentos `Dx`, `Dz` e a rotação `Ry` de cada nó, e **Resultados dos elementos** lista os esforços de extremidade de cada elemento nos seus eixos locais. O nó `1` gira $R_y = -2{,}6469 \cdot 10^{-2}$ rad, e o nó `2` gira o mesmo valor no sentido contrário. A página [Resultados e diagramas](/pt/essentials/results) explica cada tabela e cada sinal.

Se os diagramas parecerem grandes ou pequenos demais, altere **Escala de resultados** em **Configurações → Configurações de visualização**.

## Confira à mão {#_8-check-by-hand}

Com $q = 12$ kN/m e $L = 6$ m, as fórmulas dos livros dão:

| Grandeza | Fórmula | À mão | EduBeam |
| --- | --- | --- | --- |
| Reações | $qL/2$ | 36 kN | 36 kN |
| Maior esforço cortante | $qL/2$ | 36 kN | 36 kN |
| Maior momento | $qL^2/8$ | 54 kNm | 54 kNm |
| Rotação no apoio | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Flecha no meio do vão | $w_b + w_s$ | 49,63 + 0,60 = 50,22 mm | 50,22 mm |

A flecha tem duas parcelas, e a maioria dos livros dá só a primeira:

- **Flexão:** $w_b = 5qL^4/(384EI) = 49{,}63$ mm, com $EI = 4080$ kNm² a partir de $E = 210$ GPa e $I_y = 1943\ \text{cm}^4$.
- **Cisalhamento:** $w_s = qL^2/(8kGA) = 0{,}60$ mm, com $kGA \approx 90\,700$ kN a partir de $k = 0{,}3933$, $G = 81$ GPa e $A = 28{,}48\ \text{cm}^2$.

Ainda não há nó no meio do vão; adicione um para ler a flecha ali:

1. Na aba **Nós**, clique no segundo botão **Adicionar nó**, o do ícone de cursor.
2. Clique sobre a viga em `x = 3`; com o encaixe ligado, o nó cai na grade. O EduBeam pergunta o que fazer com o nó: clique em **Conectar à estrutura**. O elemento se divide em `1a` e `1b`, levando a carga junto, e o posicionamento de nós termina. Se o nó `3` não estiver em X = `3` na aba **Nós**, digite `3` ali.
3. Em **Resultados → Resultados nodais**, o nó `3` mostra agora $D_z = 5{,}0224 \cdot 10^{-2}$ m, ou seja, 50,22 mm.

![Resultados nodais após a divisão: o nó 3 desce 50,22 mm](/screenshots/pt/a-qs-nodal-results.webp){.shot-lg}

Dividir a viga não altera nenhum resultado, porque o elemento é exato para essas cargas: não há malha para refinar.

::callout{type="details" title="Por que o coeficiente de cisalhamento importa"}
O EduBeam usa elementos de viga de Timoshenko, que incluem a deformação por cisalhamento. O coeficiente de cisalhamento $k$ multiplica a área que resiste ao cisalhamento, de modo que $kGA$ é a rigidez ao cisalhamento. Para os perfis I da biblioteca, $k$ é a fração da área que cabe à alma, $h t_w / A$: no IPE 200, $0{,}2 \cdot 0{,}0056 / 0{,}002848 = 0{,}3933$. A parcela da flecha devida ao cisalhamento, $w_s = qL^2/(8kGA)$, é a integral de $V/(kGA)$ do apoio até o meio do vão.

Nesta viga esbelta, a parcela do cisalhamento é de 0,60 mm, cerca de 1 % do total. Numa viga curta e alta, ela é bem maior. Defina o coeficiente de cisalhamento como um número muito grande (por exemplo, `1e10`) na aba **Seções**, e o EduBeam devolve os 49,63 mm só da flexão. A teoria está na página [Elemento de viga](/pt/elements/beam).
::

Mais roteiros de conferência à mão (viga em balanço, viga biengastada, treliça, temperatura, recalque) estão em [Conferir resultados à mão](/pt/guide/verification).

## Experimente {#_9-experiment}

Altere o modelo e veja os diagramas acompanharem. Teste cada alteração separadamente e desfaça-a com <kbd>Ctrl</kbd>+<kbd>Z</kbd> antes da próxima. O nó `3` é o nó do meio do vão que você acabou de adicionar.

- **Arraste o nó `2`** para a direita. O momento cresce com $L^2$ e a flecha com $L^4$.
- **Marque `Ry` no nó `1`** para engastar essa extremidade. Surge um momento negativo no engaste: $qL^2/8 = 54$ kNm pela fórmula dos livros, 53,8 kNm no EduBeam. Numa viga hiperestática, a rigidez ao cisalhamento também altera os esforços.
- **Marque `Dz` no nó `3`** para acrescentar um apoio intermediário e obter uma viga contínua de dois vãos. O momento sobre o apoio intermediário passa a ser negativo: $q(L/2)^2/8 = 13{,}5$ kNm à mão, 13,3 kNm no EduBeam, pelo mesmo motivo.
- **Marque `Dz` no nó `3` e a segunda caixa da coluna *Rótulas de extremidade* do elemento `1a`** (a extremidade no nó `3`), na aba **Elementos**. A viga vira duas vigas biapoiadas de 3 m. Agora desmarque `Dz` no nó `3`: a viga se torna um mecanismo, e o EduBeam mostra como ela pode se mover.

Para experimentar o vão e a carga sem montar nada, arraste os controles deslizantes abaixo e alterne entre os resultados para ver como cada um cresce com o vão.

::example-structure
::

## Salve ou compartilhe {#_10-save-or-share}

- **Envie para alguém.** Clique em **Compartilhar modelo** na barra superior e depois em **Copiar**. O link contém o modelo inteiro, e quem o abre recebe uma cópia própria para editar.
- **Guarde como arquivo.** **☰ → Salvar projeto** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) baixa um `project.json`. Abra-o de novo com **☰ → Abrir projeto** (<kbd>Ctrl</kbd>+<kbd>O</kbd>) ou arrastando-o para o aplicativo.
- **Coloque o desenho em um relatório.** **☰ → Exportar imagem** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) salva o desenho em PNG ou SVG.

O modelo também fica guardado no navegador, então não se perde quando você recarrega a página. Os detalhes estão em [Arquivos, links e exportação](/pt/essentials/import-export).

## Próximos passos {#where-next}

::card-grid{cols="2"}
:::card{title="Tutoriais" icon="lucide:graduation-cap" to="/pt/tutorials/inclined-beam"}
Quatro modelos montados passo a passo e conferidos à mão, de uma viga inclinada a uma viga contínua com recalque de apoio.
:::
:::card{title="Exemplos" icon="lucide:library" to="/pt/examples/"}
Vigas, pórticos e treliças prontos que abrem com um clique, com exercícios e respostas.
:::
:::card{title="Cargas" icon="lucide:arrow-down-to-line" to="/pt/essentials/loads"}
Cargas trapezoidais, concentradas e térmicas, forças nodais e recalques de apoio.
:::
:::card{title="Teclado, mouse e toque" icon="lucide:keyboard" to="/pt/reference/shortcuts"}
Desenhe nós e elementos direto na tela e edite mais rápido.
:::
::
