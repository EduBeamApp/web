---
description: "Todos os atalhos de teclado, ações do mouse e gestos de toque do EduBeam: desfazer, salvar, abrir, exportar imagem, copiar, colar, ajustar, zoom, seleção e panorâmica."
source: site
---

# Teclado, mouse e toque

O EduBeam funciona com teclado e mouse, com trackpad ou com o dedo. Esta página lista todos os atalhos e gestos. Num Mac, use <kbd>Cmd</kbd> onde aparece <kbd>Ctrl</kbd>; os menus do próprio aplicativo mostram ⌘ nesses lugares.

## Teclado {#keyboard}

Os atalhos de desenho (<kbd>F</kbd>, <kbd>C</kbd>, <kbd>G</kbd>, <kbd>S</kbd>, <kbd>Delete</kbd> e <kbd>Ctrl</kbd>+<kbd>A</kbd>, <kbd>C</kbd>, <kbd>V</kbd>) não fazem nada enquanto um campo de texto está com o foco; assim, digitar um `f` ou um `s` num campo nunca os aciona. Clique no desenho primeiro.

### Arquivos e histórico {#files-and-history}

| Atalho | Ação |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> | Desfazer a última alteração do modelo |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | Refazer |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Salvar projeto (baixa o `project.json`) |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Abrir projeto |
| <kbd>Ctrl</kbd>+<kbd>P</kbd> | Exportar imagem |

Desfazer também reverte a limpeza do modelo, a abertura de um arquivo, de um link ou de um exemplo e a restauração de uma estrutura recente. Enquanto você ainda está digitando numa célula de tabela, <kbd>Ctrl</kbd>+<kbd>Z</kbd> desfaz a digitação; depois que a célula é confirmada, desfaz a alteração do modelo. Nos campos de um diálogo, sempre desfaz a digitação.

### Desenho {#drawing}

| Atalho | Ação |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>A</kbd> | Selecionar tudo |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Copiar os nós, elementos e cargas selecionados |
| <kbd>Ctrl</kbd>+<kbd>V</kbd> | Colar. Uma prévia da cópia segue o cursor: clique para posicioná-la, ou digite um deslocamento Δx, Δz na faixa no topo e clique em **Colar** ou pressione <kbd>Enter</kbd> |
| <kbd>Delete</kbd> | Excluir a seleção (num notebook Mac, <kbd>Fn</kbd>+<kbd>Delete</kbd>) |
| <kbd>Esc</kbd> | Sair do modo atual (adicionar nós, elementos ou cotas, colar, escolher a área de uma imagem) e limpar a seleção; também fecha o menu ☰ e encerra o tour |
| <kbd>F</kbd> | Ajustar conteúdo à tela |
| <kbd>C</kbd> | Centralizar conteúdo |
| <kbd>G</kbd> | Ligar/desligar a grade |
| <kbd>S</kbd> | Ligar/desligar o encaixe na grade |
| <kbd>Ctrl</kbd>+<kbd>+</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Aproximar / afastar o desenho em torno do centro |

No EduBeam, <kbd>Ctrl</kbd>+<kbd>+</kbd> e <kbd>Ctrl</kbd>+<kbd>-</kbd> ampliam e reduzem o desenho, e não a interface inteira, como fazem em outros sites. Eles funcionam com qualquer layout de teclado: as teclas marcadas com + e −, onde quer que o seu layout as coloque, as duas teclas à esquerda de <kbd>Backspace</kbd> (num teclado ABNT2, como no americano) e o + e o − do teclado numérico.

### Tabelas e diálogos {#tables-and-dialogs}

| Atalho | Ação |
| --- | --- |
| <kbd>Enter</kbd> | Numa célula de tabela: confirma o valor. Num campo de texto de um diálogo: confirma o diálogo, como o botão principal dele |
| <kbd>Esc</kbd> | Numa célula de tabela: sai dela, mantendo o valor. Num diálogo: fecha sem salvar |
| <kbd>Tab</kbd> | Passa para o campo seguinte; uma célula de tabela mantém o que você digitou |

Os campos numéricos aceitam contas escritas como você as faria: `6/2`, `3*1,5`, `2^3`, `(4+2)/3`, além de `1e3`; tanto a vírgula quanto o ponto decimal são aceitos.

## Mouse {#mouse}

| Ação | Resultado |
| --- | --- |
| Clique | Seleciona um nó, elemento, carga ou linha de cota e abre o painel dele |
| Arrastar na tela vazia | Retângulo de seleção |
| Arrastar um nó | Move o nó; ele encaixa na grade quando o encaixe está ligado |
| Clique durante a adição | Posiciona um nó, ou inicia ou continua uma poligonal de elementos |
| Clique duplo em uma carga | Edita a carga (também um deslocamento prescrito) |
| Clique com o botão direito | Menu da tela: Adicionar nó, Adicionar elemento, Adicionar cota, Cotar o elemento (sobre um elemento), Editar, Copiar, Colar, Excluir |
| <kbd>Ctrl</kbd> + **Adicionar nó** ou **Adicionar elemento** no menu da tela | Posiciona com o mouse em vez de abrir um diálogo |
| Arrastar com o botão do meio ou o direito | Move a vista. Escolha o botão em **Configurações → Controles e atalhos → Panorâmica com** |
| Roda do mouse | Zoom em direção ao cursor |
| Apontar para um objeto | Dica com os deslocamentos, as propriedades ou os valores de carga |

No trackpad, tanto a pinça quanto a rolagem com dois dedos aplicam zoom. Para mover a vista, clique e arraste com dois dedos, o que equivale a arrastar com o botão direito.

## Toque {#touch}

| Gesto | Resultado |
| --- | --- |
| Toque | Seleciona um objeto e mostra os detalhes e as ações dele |
| Toque durante a adição | Posiciona um nó ou continua um elemento |
| Pressionar um nó e arrastar | Move o nó |
| Arrastar com um dedo em outro lugar | Move a vista |
| Pinça | Zoom |
| Tocar e segurar a tela | Menu da tela |
| Botão **Seleção por retângulo** (canto superior direito), depois arrastar | Retângulo de seleção; o menu da tela, com Copiar e Excluir, abre onde você levantar o dedo |

Enquanto você adiciona nós, elementos ou cotas, cola ou escolhe a área de uma imagem, uma faixa no topo do desenho indica o modo e tem um botão **Cancelar**. Sem a tecla <kbd>Esc</kbd>, é assim que você sai do modo numa tela sensível ao toque.

## Painéis dos objetos {#object-panels}

Clicar ou tocar em um objeto abre ao lado dele um painel com os detalhes e estas ações:

| Objeto | Ações |
| --- | --- |
| Nó | Adicionar carga · Apoios do nó (símbolo do apoio, Dx, Dz, Ry) · Ângulo do SCL nodal · Prescrever deslocamento (em um nó com apoio) · Excluir |
| Elemento | Editar elemento (nós de extremidade e rótulas, material, seção) · Adicionar carga · Matriz de rigidez · Excluir |
| Carga nodal ou de elemento | Editar carga · Excluir |
| Linha de cota | Editar · Inverter cota · Excluir |

A página [Interface do usuário](/pt/essentials/user-interface) apresenta a tela, e [Controles e atalhos](/pt/essentials/units-settings#controls-shortcuts), nas configurações, define o botão que move a vista.
