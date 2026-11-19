---
description: "Posicione e edite nós no EduBeam, encaixe-os na grade, divida elementos e escolha o apoio: fixo, móvel, engaste, engaste deslizante e as variantes verticais e inclinadas."
source: site
---

# Nós e apoios

Os nós são os pontos do modelo: os elementos ligam os nós, e os apoios e as cargas nodais ficam sobre eles. Posicione-os digitando as coordenadas ou clicando na tela; depois, atribua aos nós apoiados o apoio que corresponde ao seu desenho.

## Coordenadas {#coordinates}

Cada nó tem uma coordenada **X** e uma **Z** na [unidade de comprimento](/pt/essentials/units-settings#units) atual. O eixo X aponta para a direita e o **eixo Z aponta para baixo**, então tudo o que está acima do chão tem Z negativo: um pilar de 4 m de altura vai de `Z = 0` a `Z = −4`.

::model-figure{caption="Um pórtico de 6 m de largura e 4 m de altura: A e D estão em Z = 0, B e C em Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

Se preferir o eixo vertical apontando para cima, mude para os [eixos com y para cima](/pt/elements/conventions#y-up-axes) nas Configurações. Só a exibição muda; o modelo e os arquivos continuam os mesmos.

## Adicionar nós {#adding-nodes}

- **Digitando.** Aba *Nós* → **Adicionar nó** (o botão com o ícone **+**), ou botão direito na tela → *Adicionar nó*. Informe X e Z e, se quiser, os apoios e o ângulo do apoio.
- **Clicando.** Aba *Nós* → **Adicionar nó** (o botão com o ícone de cursor), ou segure <kbd>Ctrl</kbd> ao escolher *Adicionar nó* no menu da tela. Cada clique posiciona um nó; para parar, pressione <kbd>Esc</kbd>, **Cancelar** ou o mesmo botão de novo.
- **Ao desenhar elementos.** Quando você [desenha elementos com o mouse](/pt/essentials/elements#adding-elements), um clique na tela vazia cria um nó naquele ponto.
- **Copiando.** Selecione nós (e elementos), pressione <kbd>Ctrl</kbd>+<kbd>C</kbd> e <kbd>Ctrl</kbd>+<kbd>V</kbd> e clique onde a cópia deve ficar, ou digite um deslocamento Δx, Δz na faixa no topo e pressione **Colar**.

::div{.shots}

![O diálogo Adicionar nó](/screenshots/pt/qs-node.webp)

![No modo de mouse, a faixa no topo define os apoios e o ângulo de cada nó que você posiciona](/screenshots/pt/nodes-add-banner.webp)

::

Os nós novos recebem o próximo número livre: `1`, `2`, `3`, …. Você pode renomear qualquer um deles na coluna *Nó* da tabela, por exemplo para `A`, `B`, `C`.

### Encaixe {#snapping}

Com **Encaixar na grade** ligado (pressione <kbd>S</kbd> ou o botão **S** no canto inferior direito da visualização), os nós que você posiciona ou arrasta se encaixam na grade. O passo é de 0,1 m por padrão, ou 0,5 ft em unidades americanas; altere-o em [Configurações → Configurações de visualização → Grade](/pt/essentials/units-settings#viewer-settings). Para qualquer outra posição, digite as coordenadas exatas na tabela.

### Posicionar um nó sobre um elemento existente {#placing-a-node-on-an-existing-element}

Se você clicar sobre um elemento (ou bem perto dele) enquanto adiciona nós com o mouse, o EduBeam pergunta o que você quer:

- **Conectar à estrutura** divide o elemento em dois, `1a` e `1b`, unidos no novo nó. É o jeito mais rápido de criar um apoio intermediário ou um ponto para aplicar uma carga. As rótulas nas extremidades externas continuam onde estavam. As cargas uniformes e trapezoidais são repartidas entre as duas metades. As cargas concentradas e térmicas vão todas para a primeira metade, `1a`: na tabela *Cargas*, passe para `1b` a carga concentrada que ficava além do novo nó (sua posição agora é medida a partir do novo nó) e dê a `1b` sua própria carga térmica.
- **Posicionar nó individual** coloca o nó sobre o elemento sem ligá-lo a ele.

Nos dois casos, o posicionamento de nós termina ali; clique de novo no botão do cursor para posicionar mais nós.

## Editar nós {#editing-nodes}

| Para | Faça assim |
| --- | --- |
| Mover um nó | Arraste-o na visualização (numa tela sensível ao toque, pressione e arraste) ou digite X e Z na tabela *Nós*. Os elementos ligados a ele, suas cargas e as linhas de cota acompanham. |
| Renomeá-lo | Digite um novo rótulo na coluna *Nó*. |
| Mudar seus apoios | Clique nele → **Apoios do nó**, ou use a coluna *GLs restringidos*. Veja [Apoios](#supports). |
| Editar tudo de uma vez | O lápis na coluna *Ações* abre **Editar nó**: coordenadas, apoios e ângulo do apoio, com uma prévia do símbolo. |
| Excluí-lo | O × na tabela, **Excluir** no painel do nó, ou selecione-o e pressione <kbd>Delete</kbd>. Os elementos, as cargas e as linhas de cota ligados a ele também são excluídos. |

Qualquer alteração pode ser desfeita com <kbd>Ctrl</kbd>+<kbd>Z</kbd>.

## Apoios {#supports}

Cada nó pode se mover de três maneiras, seus **graus de liberdade** (GLs): `Dx` ao longo de x, `Dz` ao longo de z e `Ry`, uma rotação no plano do desenho. Um apoio **restringe** alguns deles.

Os oito apoios são as oito combinações possíveis dessas restrições. Leia a tabela por linha: na coluna do meio o nó gira livremente; na da direita, a rotação também está impedida.

| Translações impedidas | Gira livremente | Rotação também impedida |
| --- | --- | --- |
| **As duas** (`Dx` e `Dz`) | ![](/screenshots/pt/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Apoio fixo** | ![](/screenshots/pt/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Engaste** |
| **Só a vertical** (`Dz`): desliza na horizontal | ![](/screenshots/pt/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Apoio móvel** | ![](/screenshots/pt/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Engaste deslizante** |
| **Só a horizontal** (`Dx`): desliza na vertical | ![](/screenshots/pt/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Apoio móvel vertical** | ![](/screenshots/pt/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Engaste deslizante vertical** |
| **Nenhuma**: desliza nas duas direções | ![](/screenshots/pt/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Livre** (sem apoio) | ![](/screenshots/pt/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Apenas rotação impedida** |

Para cada GL restringido, o EduBeam calcula uma **reação**: `Dx` dá uma força horizontal $R_x$, `Dz` uma força vertical $R_z$ e `Ry` um momento $M$. Assim, o apoio fixo (de segundo gênero) dá $R_x$ e $R_z$, o apoio móvel (de primeiro gênero) só $R_z$, o engaste deslizante $R_z$ e $M$, e o engaste (de terceiro gênero) as três.

### Definir um apoio {#setting-a-support}

Escolha o símbolo ou marque os GLs um a um; os dois sempre concordam. Você encontra ambos em três lugares:

- no painel do nó (clique no nó) → **Apoios do nó**, junto com o **Ângulo do SCL nodal**, como na figura abaixo;
- nos diálogos **Adicionar nó** e **Editar nó**;
- na coluna *GLs restringidos* da tabela *Nós*, onde o símbolo é um pequeno menu e `Dx`, `Dz`, `Ry` são caixas de seleção.

![Apoios do nó no painel do nó: os símbolos, as caixas de seleção dos GLs e o ângulo do apoio](/screenshots/pt/nodes-support-picker.webp){.shot-lg}

Aponte para um símbolo para ver o nome dele.

### Apoio móvel ou engaste deslizante? {#roller-or-slider}

Os dois correm sobre um trilho e deslizam ao longo dele. A diferença está na rotação:

- o **apoio móvel** é um apoio fixo sobre trilhos: a extremidade **gira livremente**, por isso ali não há momento;
- o **engaste deslizante** é um engaste sobre trilhos: a extremidade **não pode girar**, por isso o apoio absorve um momento.

A mesma viga de 6 m sob 10 kN/m, mudando apenas o apoio da direita. Alterne entre a forma deformada e o momento fletor:

::div{.shots}

:::model-figure{caption="Apoio fixo e apoio móvel: a extremidade direita gira livremente; ali M = 0, e cada apoio recebe 30 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Apoio fixo e engaste deslizante: a extremidade direita fica horizontal; ali M = −45 kNm, e o engaste deslizante recebe 37,5 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

A primeira é uma viga biapoiada ($M_{max} = qL^2/8 = 45\ \text{kNm}$ no meio do vão). Sob carga vertical, o engaste deslizante age exatamente como um engaste, então a segunda é uma viga engastada e apoiada ($R_B = 5qL/8 = 37{,}5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Manter a extremidade horizontal também deixa a viga mais rígida: a maior flecha cai de 9,617 mm para 4 mm. O engaste deslizante só se comporta de modo diferente do engaste quando alguma força empurra o nó ao longo do trilho.

### Apoios inclinados {#inclined-skewed-supports}

Um apoio sobre um plano inclinado restringe o nó segundo eixos girados. Defina o **Ângulo do SCL nodal** α, em graus de −180 a 180, no painel do nó em *Apoios do nó*, nos diálogos Adicionar nó e Editar nó, ou no campo **α** da tabela *Nós*.

Os eixos do nó giram de α e os GLs marcados atuam segundo eles. O ângulo α gira x em direção a z, o que na tela é o sentido **horário** (com os eixos y para cima, gira x em direção a y, no sentido anti-horário). Assim, um apoio móvel sobre uma superfície que desce 30° para a direita é um apoio móvel com α = 30°. O símbolo gira junto com os eixos, e a reação é informada segundo eles.

::model-figure{caption="Apoio móvel em B girado de α = 30°: sua reação de 34,64 kN é perpendicular ao plano inclinado, e a viga fica com N = +17,32 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

É a mesma viga de antes, 6 m sob 10 kN/m, mas agora o apoio móvel está sobre um plano inclinado a 30°. A componente vertical da reação em B continua sendo $qL/2 = 30\ \text{kN}$, então a própria reação vale $30/\cos 30° = 34{,}64\ \text{kN}$, e sua componente horizontal, $30 \tan 30° = 17{,}32\ \text{kN}$, empurra B para a direita. O apoio fixo em A o segura, e por isso a viga fica tracionada. O momento fletor não muda.

As [cargas nodais](/pt/essentials/loads#nodal-loads) em um nó girado podem ser dadas nos eixos globais ou nos eixos do nó; um [deslocamento prescrito](/pt/essentials/loads#prescribed-displacements-support-settlements) sempre atua segundo os eixos do próprio apoio.

### Estabilidade {#stability}

Uma estrutura plana precisa de pelo menos **três GLs restringidos**, dispostos de modo que realmente a fixem. Enquanto faltarem apoios, a visualização mostra a etiqueta azul **Faltam apoios**. Se os apoios forem suficientes em número mas não conseguirem fixar a estrutura (todos paralelos ou todos concorrentes em um ponto), ou se as rótulas deixarem as barras girar umas em relação às outras, uma mensagem vermelha indica o problema e um contorno tracejado mostra como a estrutura se move. Em [Solução de problemas](/pt/reference/troubleshooting#messages) você encontra todas as mensagens.

## Cargas nodais e recalques {#nodal-loads-and-settlements}

Clique em um nó → **Adicionar carga** para uma força ou um momento, ou → **Prescrever deslocamento** para deslocar um apoio de um valor dado (um recalque). As duas coisas estão explicadas em [Cargas nodais](/pt/essentials/loads#nodal-loads).

## Linhas de cota {#dimension-lines}

As linhas de cota indicam comprimentos no desenho. Elas não influenciam o cálculo, mas são salvas com o projeto, vão junto nos links de compartilhamento e aparecem nas [imagens exportadas](/pt/essentials/import-export#export-an-image).

| Para | Faça assim |
| --- | --- |
| Adicionar uma cota | Botão direito na tela → **Adicionar cota** e clique nos dois pontos extremos. Um ponto perto de um nó se encaixa nele. |
| Cotar um elemento | Botão direito no elemento → **Cotar o elemento**. |
| Editar ou inverter a cota | Clique na linha → **Editar** para digitar suas coordenadas, ou **Inverter cota** para colocar o rótulo do outro lado. |
| Movê-la | Arraste a linha ou uma de suas extremidades. Uma extremidade sobre um nó fica presa a ele e o acompanha. |
