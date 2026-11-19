---
description: "Desenhe elementos no EduBeam, libere as extremidades com rótulas para articulações e barras de treliça, e defina materiais e seções pelas bibliotecas ou por polígono."
source: site
---

# Elementos, materiais e seções

Todo elemento do [EduBeam]{.edubeam} é uma viga entre dois nós, com um material e uma seção. Desenhe os elementos entre os nós, libere suas extremidades com rótulas onde a estrutura tem articulações e escolha materiais e seções nas bibliotecas ou defina os seus.

## O elemento de viga {#the-beam-element}

Há um único tipo de elemento: uma **viga de Timoshenko 2D** no plano x–z, com três graus de liberdade em cada extremidade (`Dx`, `Dz`, `Ry`). Ele transmite esforço normal, esforço cortante e momento fletor, e inclui a [deformação por cisalhamento](#shear-deformation). Uma barra de treliça é o mesmo elemento com as [duas extremidades rotuladas](#end-hinges). A formulação está no [manual teórico](/pt/elements/beam).

Os resultados ao longo de um elemento são exatos para o modelo linear, então **um elemento por barra é suficiente**. Só acrescente um nó no meio de uma barra onde você precisar de um apoio, de uma rótula, de uma mudança de seção ou de um ponto onde ler os deslocamentos. Uma carga concentrada não exige nó: ela pode ficar em qualquer ponto ao longo do elemento (veja [Carga concentrada](/pt/essentials/loads#concentrated-load)).

## Adicionar elementos {#adding-elements}

Um elemento precisa de um material e de uma seção, então crie-os primeiro (veja [Materiais](#materials) e [Seções](#cross-sections)). Enquanto não houver nenhum, a visualização mostra *Nenhum material definido.* ou *Nenhuma seção definida.*, com um botão **Adicionar**.

- **Escolhendo os nós.** Aba *Elementos* → **Adicionar elemento** (o botão com o ícone **+**), ou botão direito na tela → *Adicionar elemento*. Escolha o **Nó inicial** e o **Nó final**, marque **Rótula** embaixo de qualquer um deles se precisar e escolha o **Material** e a **Seção**. Para isso, o modelo precisa ter pelo menos dois nós.
- **Clicando.** Aba *Elementos* → **Adicionar elemento** (o botão com o ícone de cursor), ou segure <kbd>Ctrl</kbd> ao escolher *Adicionar elemento* no menu da tela. Clique em um nó (ou na tela vazia, o que cria um nó) e depois no seguinte; continue clicando para desenhar uma sequência de elementos e pressione <kbd>Esc</kbd> ou **Cancelar** para terminar. A faixa no topo define **Rótula no início** e **Rótula no fim** para cada elemento que você desenha. Os elementos recebem o primeiro material e a primeira seção do modelo.

![O diálogo Adicionar elemento](/screenshots/pt/qs-element.webp){.shot-md}

## Orientação do elemento {#element-direction}

Cada elemento tem seus próprios **eixos locais**. O eixo x local vai do **nó inicial** ao **nó final**; o eixo z local é o x local girado de 90° no sentido horário na tela. Num elemento desenhado da esquerda para a direita, os eixos locais coincidem com os globais. A **linha tracejada** desenhada ao longo de cada elemento marca o lado +z local, as “fibras inferiores”.

![Um pórtico desenhado A → B → C → D: as linhas tracejadas dos três elementos ficam do lado de dentro](/screenshots/pt/p2b-element-direction.webp){.shot-md}

Neste pórtico, o elemento 1 sobe de A para B, então seu z local, e com ele a linha tracejada, aponta para a direita; o elemento 3 desce de C para D, então sua linha tracejada fica à esquerda. Desenhadas assim, as linhas tracejadas de um pórtico ficam todas do lado de dentro.

A orientação importa para:

- as cargas dadas em eixos locais (**LCS** marcado), veja [Cargas de elemento](/pt/essentials/loads#element-loads);
- a **Posição da carga a partir do nó inicial** de uma carga concentrada;
- a ordem dos [esforços de extremidade](/pt/elements/conventions#end-forces-element-results-table) nos resultados: `X12, Z12, M12` no nó inicial, `X21, Z21, M21` no nó final;
- qual é o “lado tracejado” nas [configurações dos diagramas](/pt/essentials/units-settings#viewer-settings).

Para inverter um elemento, pressione **Inverter nós** (as setas entre os dois nós na tabela *Elementos*).

## Rótulas de extremidade {#end-hinges}

Uma rótula de extremidade libera o momento fletor em uma extremidade do elemento: ali o momento é nulo, e a extremidade pode girar independentemente do nó.

- **Uma rótula** cria uma articulação dentro de uma viga ou de um pórtico.
- **Duas rótulas** transformam o elemento em uma **barra de treliça**, que transmite apenas esforço normal.

Marque-as em qualquer um destes lugares:

- na coluna **Rótulas de extremidade** da tabela *Elementos*, uma caixa de seleção para cada extremidade;
- nas caixas **Rótula** do diálogo **Adicionar elemento** ou no painel do elemento → **Editar elemento**;
- em **Rótula no início** e **Rótula no fim**, na faixa no topo, ao desenhar com o mouse.

![A tabela Elementos de um pórtico triarticulado: o elemento 2 tem uma rótula no fim, no nó C](/screenshots/pt/elements-table.webp)

### Uma rótula: articulação dentro da estrutura {#one-hinge-a-pin-inside-the-structure}

A mesma viga contínua, com dois vãos de 5 m sob 10 kN/m. Na figura da direita, o elemento 1 tem uma rótula de extremidade em B: o momento sobre o apoio cai a zero, e cada vão trabalha como uma viga biapoiada.

::div{.shots}

:::model-figure{caption="Contínua: M = −31,25 kNm sobre B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Rotulada em B: M = 0 sobre B, 31,25 kNm em cada vão"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [{ nodes: [A, B], hinges: [false, true] }, [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

::

À mão: na viga contínua, $M_B = -qL^2/8 = -31{,}25\ \text{kNm}$ e no máximo $9qL^2/128 = 17{,}58\ \text{kNm}$ em cada vão; na rotulada, $M_B = 0$ e $M_{max} = qL^2/8 = 31{,}25\ \text{kNm}$ no meio de cada vão. A rótula alivia o apoio, mas quase dobra os momentos nos vãos. Para resolver à mão uma viga com rótula interna, com as respostas conferidas enquanto você digita, experimente o [exercício G2048](/pt/practice?p=G2048).

### Duas rótulas: barra de treliça {#both-hinges-a-truss-bar}

Uma mão-francesa presa à parede, com duas barras rotuladas nas duas extremidades, carrega 20 kN em B. As barras transmitem apenas esforço normal, e o diagrama de momento fletor fica vazio.

::model-figure{caption="Tirante AB: N = +26,67 kN (tração); escora CB: N = −33,33 kN (compressão)"}
---
nodes: { A: [0, 0], B: [4, 0], C: [0, 3] }
supports: { A: pin, C: pin }
members: [{ nodes: [A, B], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: B, fz: 20 }
results: [N, M]
show: [nodeLabels]
---
::

À mão: a escora tem 5 m de comprimento e sobe 3 m, então $N_{CB} = -20 \cdot 5/3 = -33{,}33\ \text{kN}$, e o tirante equilibra sua componente horizontal, $N_{AB} = 33{,}33 \cdot 4/5 = 26{,}67\ \text{kN}$. O [tutorial da treliça plana](/pt/tutorials/truss) monta uma treliça inteira desse jeito, e a página [Exercícios de estática](/pt/practice?p=T2048) tem treliças para resolver à mão.

### Rotule o elemento, não o nó {#hinge-the-element-not-the-node}

Uma rótula pertence a uma extremidade de um elemento: ela deixa essa extremidade girar sozinha, enquanto todos os outros elementos que chegam ao nó continuam ligados rigidamente a ele. Assim, onde duas barras se encontram, uma rótula basta para formar uma ligação articulada; onde se encontram várias, rotule todas menos uma. Num nó de treliça, onde todas as barras são barras de treliça, todas estão rotuladas.

Um nó em que todos os elementos estão rotulados não tem rigidez à rotação. O EduBeam o aceita e informa sua rotação como 0. Se as rótulas transformarem a estrutura em um mecanismo, o EduBeam as marca com um círculo e mostra como ela se move; veja [Solução de problemas](/pt/reference/troubleshooting#messages).

## Editar e excluir {#editing-and-deleting}

| Para | Faça assim |
| --- | --- |
| Mudar os nós, as rótulas, o material ou a seção | Clique no elemento → **Editar elemento**, ou edite-o na tabela *Elementos*. |
| Invertê-lo | **Inverter nós** na tabela *Elementos*. |
| Renomeá-lo | Digite um novo rótulo na coluna *Elemento*. |
| Ver sua matriz de rigidez | Clique nele → **Matriz de rigidez**, ou o botão da matriz na coluna *Ações*. Uma janela mostra a matriz 6 × 6 do elemento em eixos globais, em unidades SI (N e m), quaisquer que sejam as unidades exibidas, com as rótulas de extremidade já condensadas. É útil para conferir uma montagem feita à mão. |
| Excluí-lo | Clique nele → **Excluir**, o × na tabela, ou selecione-o e pressione <kbd>Delete</kbd>. Suas cargas são excluídas junto. |

![O painel de um elemento](/screenshots/pt/ui-element-menu.webp){.shot-xs}

## Materiais {#materials}

Aba *Materiais* → **Adicionar material**, ou **Biblioteca de materiais** para um material pronto. Vários elementos podem compartilhar o mesmo material; alterá-lo atualiza todos eles.

| Campo | Unidade | Para que serve |
| --- | --- | --- |
| Módulo de Young $E$ | MPa | Rigidez axial e à flexão, $EA$ e $EI_y$. Aço 210 000 MPa, concreto cerca de 30 000 MPa, madeira cerca de 11 000 MPa. |
| Módulo de cisalhamento $G$ | MPa | Rigidez ao cisalhamento $kGA$. A menos que o $k$ da seção seja enorme, ele acrescenta a [deformação por cisalhamento](#shear-deformation): flechas maiores e, numa estrutura hiperestática, esforços internos diferentes. $G = E/(2(1+\nu))$: aço cerca de 81 000 MPa. |
| Densidade $\rho$ (massa específica) | kg/m³ | Fica guardada com o material, mas não é usada: não há carga de peso próprio. |
| Coeficiente de dilatação térmica $\alpha$ | 1/K | Usado pelas [cargas térmicas](/pt/essentials/loads#temperature-load). Aço $12 \times 10^{-6}$ 1/K. |

As unidades indicadas são as padrão do SI; elas seguem suas [configurações](/pt/essentials/units-settings#units), então em unidades americanas E e G ficam em ksi, a massa específica em lb/ft³ e α em 1/°F.

Um material novo começa com $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2{,}4$, ou seja, $\nu = 0{,}2$), $\rho$ = 1000 kg/m³ e $\alpha = 12 \times 10^{-6}$ 1/K; em unidades americanas, começa como o aço ASTM A992. Para aço, mude $G$ para 81 000 MPa ou escolha um aço na biblioteca.

![O diálogo Adicionar material](/screenshots/pt/qs-material.webp){.shot-md}

A **Biblioteca de materiais** (também *Ou escolha da biblioteca* no diálogo Adicionar material) lista primeiro os materiais métricos (EN), ou primeiro os americanos (aços ASTM, concreto ACI) quando os comprimentos estão em pés ou polegadas. O **+** de uma linha adiciona esse material, com o nome dele:

| Família | Materiais |
| --- | --- |
| Metais | Aço S235, S275, S355; aço inoxidável 304, 316; ferro fundido; alumínio 6061-T6, 7075-T6, 5083; cobre, latão, bronze; titânio Grade 2 e Ti-6Al-4V; aços americanos ASTM A992, A36, A572 Gr. 50 e HSS A500 Gr. C |
| Concreto | C25/30, C30/37, C40/50, concreto leve; americanos $f'_c$ = 4 ksi e 5 ksi |
| Madeira | C24, GL24h, GL32h |
| Outros | Vidro, GFRP, CFRP, PEAD, PVC, PMMA, policarbonato |

Um material que algum elemento ainda usa não pode ser excluído: primeiro atribua outro material a esses elementos.

## Seções {#cross-sections}

Aba *Seções* → **Adicionar seção**, **Biblioteca de seções**, ou **Seção poligonal** para desenhar sua própria forma. Como os materiais, as seções podem ser compartilhadas por vários elementos.

| Campo | Unidade | Para que serve |
| --- | --- | --- |
| Área $A$ | m² | Rigidez axial $EA$ e área efetiva ao cisalhamento $kA$. |
| Momento de inércia $I_y$ | m⁴ | Rigidez à flexão $EI_y$, em torno do eixo perpendicular ao desenho. |
| Altura $h$ | m | Usada apenas pelas cargas térmicas: a curvatura é $\alpha\,(\Delta T_b - \Delta T_t)/h$. |
| Coeficiente de cisalhamento $k$ | – | A área efetiva ao cisalhamento é $kA$, então a rigidez ao cisalhamento é $kGA$. Cerca de 0,83 para um retângulo, $A_{alma}/A$ para um perfil I. |

Uma seção nova começa com $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m e $k$ = 1 (em unidades americanas, um W12×26 com $k$ = 1). Substitua esses valores pelos da sua seção ou escolha uma na biblioteca.

::callout{type="tip" title="Para obter os resultados de um livro que despreza a deformação por cisalhamento"}
A maioria dos cálculos à mão usa vigas de Euler–Bernoulli, sem deformação por cisalhamento. Para obter os mesmos valores, dê a $k$ um valor muito grande, como `1e10`; os exemplos do aplicativo e as figuras deste site usam `1e32`. Uma seção nova ($k = 1$), a biblioteca e o editor de polígonos incluem a deformação por cisalhamento; [abaixo](#shear-deformation) você vê quanto ela muda os resultados.
::

A **Biblioteca de seções** fornece valores aproximados para:

| Família | Seções | $k$ |
| --- | --- | --- |
| Maciças | Retângulos, quadrados, círculos | 0,833 (retângulo), 0,9 (círculo) |
| Perfis I | IPE 100, IPE 200, HEA 100, HEA 200; perfis AISC W de W8×31 a W36×150 | $h\,t_w/A$, a alma |
| Tubos retangulares | RHS 100×50×3, 150×100×5; AISC HSS | $2ht/A$, as duas almas |
| Tubos circulares | CHS Ø60×3, Ø114×5; AISC HSS circulares | 0,5 |

Confira os valores da biblioteca em uma tabela de perfis antes de confiar neles.

![A Biblioteca de seções](/screenshots/pt/sections-library.webp){.shot-lg}

Para conferir rapidamente à mão: um retângulo $b \times h$ tem $A = bh$ e $I_y = bh^3/12$; um círculo maciço de diâmetro $d$ tem $A = \pi d^2/4$ e $I_y = \pi d^4/64$.

### Deformação por cisalhamento: quando G e k importam {#shear-deformation}

A rigidez ao cisalhamento $kGA$ entra no elemento pelo [parâmetro de cisalhamento](/pt/elements/beam#timoshenko-or-euler-bernoulli) $\Phi = 12EI_y/(kGAL^2)$. Com um $k$ muito grande, $\Phi = 0$ e o elemento é uma viga de Euler–Bernoulli, então $G$ não tem efeito. Com um $k$ real, a deformação por cisalhamento sempre aumenta os deslocamentos. Numa estrutura isostática, os esforços internos continuam os mesmos; numa hiperestática, eles também mudam, porque as incógnitas hiperestáticas dependem da rigidez.

Quanto os resultados mudam depende da esbeltez da barra. Um IPE 200 da biblioteca ($k = h\,t_w/A = 0{,}393$) em aço S235 ($G$ = 81 000 MPa), sob 10 kN/m, comparado com a mesma viga com $k$ = `1e32`:

| Viga | Com deformação por cisalhamento | Euler–Bernoulli |
| --- | --- | --- |
| Biapoiada, $L$ = 2 m ($L/h$ = 10): flecha no meio do vão | 0,566 mm | 0,511 mm |
| Engastada e apoiada, $L$ = 2 m: momento no engaste | −4,84 kNm | −5,00 kNm |
| Biapoiada, $L$ = 6 m ($L/h$ = 30): flecha no meio do vão | 41,85 mm | 41,36 mm |

À mão: a parcela de cisalhamento da flecha no meio do vão é $qL^2/(8kGA)$, 0,055 mm na viga curta, 11 % a mais que a parcela de flexão $5qL^4/(384EI_y)$. Na viga engastada e apoiada, o momento no engaste cai de $qL^2/8$ para $(qL^2/8)/(1 + \Phi/4)$. Com $L/h$ = 30, os dois efeitos ficam em torno de 1 % ou menos; é por isso que pórticos esbeltos e as respostas dos livros concordam, seja qual for o $k$.

### Seções poligonais {#polygonal-sections}

Aba *Seções* → **Seção poligonal**, ou *Ou defina uma forma poligonal* no diálogo Adicionar seção, abre um editor de forma que calcula as propriedades da seção para você.

![O editor de seção poligonal com o modelo de perfil I, seus eixos principais e a elipse de inércia](/screenshots/pt/sections-polygon.webp)

::div{.steps}

### Comece por um modelo {#start-from-a-preset}

Escolha um **Modelo** (retângulo, perfil I, perfil T, perfil L, perfil U, tubo retangular, círculo, tubo circular), defina suas dimensões e pressione **Aplicar**.

### Ajuste a forma {#adjust-the-shape}

Arraste os vértices (eles se encaixam no **Passo do encaixe**), clique no ponto médio de uma aresta para inserir um vértice ou clique duas vezes em um vértice para removê-lo. Você também pode digitar as coordenadas na tabela **Vértices**. **Adicionar furo** acrescenta um contorno interno, e **Centralizar no centroide** move a forma para que o centroide fique na origem.

### Leia as propriedades {#read-the-properties}

A aba **Propriedades da seção** mostra $A$, o centroide, $I_y$, $I_z$, $I_{yz}$ em relação ao centroide, os momentos principais $I_1$, $I_2$ com o **Ângulo do eixo principal** $\alpha$ (de $y$ ao eixo 1) e os raios de giração. O desenho mostra os eixos principais e a elipse de inércia.

### Adicione a seção {#add-it}

Confira o **Rótulo** e o **Coeficiente de cisalhamento** $k$: ele começa em 0,833, o valor certo para um retângulo; um perfil I precisa de cerca de $A_{alma}/A$. Depois pressione **Adicionar seção** (**Salvar** quando você edita uma forma existente). $A$, $I_y$ e $h$ vêm da forma e aparecem como somente leitura na tabela; para alterá-los, edite a forma de novo com o botão de polígono na coluna *Ações*.

::

As coordenadas da seção são locais e dextrogiras: $x$ para fora da tela, $y$ para a esquerda, $z$ para baixo.

Se a forma não for simétrica em relação ao plano do pórtico (uma cantoneira, por exemplo), o editor avisa: uma análise 2D só é exata se a barra estiver contida contra deslocamento lateral e torção em todo o comprimento, por exemplo por uma laje. Quando $I_{yz}$ é significativo, você escolhe a rigidez à flexão: **contida lateralmente e à torção em todo o comprimento** ($I_y$) ou **livre para se deslocar lateralmente**, que é menor. A torção não é incluída em nenhum dos casos.
