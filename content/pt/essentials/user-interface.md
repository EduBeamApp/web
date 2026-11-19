---
description: "Mapa da interface do EduBeam: barra superior e menu ☰, visualização e opções de exibição, seleção e edição, tabelas da barra inferior e digitação de valores."
source: site
---

# Interface do usuário

O [EduBeam]{.edubeam} tem três áreas: a **barra superior**, no topo; a **visualização**, no meio, onde você desenha; e a **barra inferior**, com uma tabela para cada tipo de objeto. Tudo o que você faz na visualização você também pode fazer nas tabelas, e vice-versa.

![As partes da interface, numeradas como na lista abaixo](/screenshots/pt/ui-overview.webp)

1. **Menu ☰**: abrir, salvar, compartilhar e exportar; exemplos e tours guiados.
2. **Limpar estrutura** e **Compartilhar modelo**.
3. **Desfazer** e **Refazer**.
4. **Botões da visualização**: centralizar, ajustar à tela e as opções de exibição.
5. **Opções de exibição**: quais resultados e quais partes do modelo são desenhados.
6. **Grade, encaixe, mira e unidades.**
7. **Abas da barra inferior**: Nós, Elementos, Cargas, Materiais, Seções, Resultados.
8. **A tabela** da aba aberta, onde todos os valores podem ser editados.

::callout{type="tip" title="Faça o tour"}
**☰ → Fazer um tour** mostra essas partes no próprio aplicativo, uma de cada vez.
::

## Barra superior {#app-bar}

- **☰** abre o menu principal, descrito abaixo.
- **Limpar estrutura** exclui todos os nós, elementos e cargas depois de uma confirmação; marque **Excluir materiais** ou **Excluir seções** para remover também esses itens. <kbd>Ctrl</kbd>+<kbd>Z</kbd> traz o modelo de volta, e ele também fica guardado em *Estruturas recentes*.
- **Compartilhar modelo** abre o [diálogo de compartilhamento](/pt/essentials/import-export#share-a-link) com um link que contém o modelo inteiro.
- **O que há de novo?** mostra as notas de versão. Elas também se abrem sozinhas uma vez depois de cada atualização.
- **Documentação** abre este guia, e o ícone do GitHub, o código-fonte.

No celular só cabem o ☰ e **Documentação**; **Limpar estrutura** e **Compartilhar modelo** ficam no menu.

### O menu ☰ {#the-☰-menu}

![O menu ☰](/screenshots/pt/ui-app-menu.webp){.shot-xs}

- **Abrir projeto** e **Salvar projeto** abrem ou baixam um arquivo `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>).
- **Estruturas recentes** guarda os últimos 10 modelos que você limpou ou substituiu, prontos para restaurar.
- **Exportar imagem** salva o desenho em PNG ou SVG, ou o copia (<kbd>Ctrl</kbd>+<kbd>P</kbd>).
- **Exemplos** é a galeria de modelos prontos; **Desenhar sua primeira viga** é uma tarefa guiada de sete passos; **Fazer um tour** é o tour pela interface.
- **Compartilhar modelo** e **Limpar estrutura** fazem o mesmo que os botões da barra superior.

Na parte de baixo do menu aparecem a versão do aplicativo e a data de lançamento. Abrir, salvar, compartilhar e exportar estão explicados em [Arquivos, links e exportação](/pt/essentials/import-export).

## Visualização {#viewer}

É a tela onde você desenha e inspeciona o modelo. O EduBeam recalcula os resultados a cada alteração; não existe botão *Resolver*.

### Botões sobre a tela {#buttons-on-the-canvas}

**Canto superior esquerdo: Desfazer e Refazer** voltam e avançam por todas as alterações do modelo: adicionar, editar, arrastar, excluir, limpar (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>).

**Canto superior direito:**

- **Seleção por retângulo**, em dispositivos com tela sensível ao toque: o próximo movimento do dedo seleciona um retângulo.
- **Centralizar conteúdo** centraliza o modelo sem alterar o zoom (<kbd>C</kbd>); **Ajustar conteúdo à tela** ajusta o zoom para mostrar o modelo inteiro (<kbd>F</kbd>).
- **⚙** mostra ou oculta as [opções de exibição](#display-options).

**Canto inferior direito:**

![Os botões da grade, do encaixe, da mira e das unidades](/screenshots/pt/ui-grid-units.webp){.shot-sm}

- **G** mostra ou oculta a grade e as réguas (<kbd>G</kbd>); **S** liga ou desliga o encaixe na grade (<kbd>S</kbd>).
- O botão da **mira** marca a posição do ponteiro nas réguas; funciona só com o mouse.
- O **indicador de unidades** abre as configurações em [Idioma e localidade](/pt/essentials/units-settings#language-locale).

### Opções de exibição {#display-options}

O botão ⚙ abre duas linhas de caixas de seleção. A primeira escolhe os resultados desenhados sobre o modelo: *Forma deformada*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)* e *Reações*; de início, a forma deformada, o momento fletor e as reações estão marcados. A segunda mostra ou oculta partes do modelo: *Apoios*, *Cargas*, *Rótulos dos nós* e *Rótulos dos elementos*, todas marcadas de início.

![Os botões da visualização e as opções de exibição](/screenshots/pt/ui-display-settings.webp){.shot-lg}

**Mais configurações** abre as [configurações de visualização](/pt/essentials/units-settings#viewer-settings): tamanhos, cores e a forma de desenhar os diagramas. O que cada resultado mostra está explicado em [Resultados e diagramas](/pt/essentials/results#overlays-in-the-viewer).

### Navegação {#navigating}

| Ação | Mouse e teclado | Toque |
| --- | --- | --- |
| Zoom | Roda do mouse, em direção ao ponteiro; no trackpad, pinça ou rolagem com dois dedos | Pinça |
| Mover a vista | Arrastar com o botão direito ou com a roda pressionada; escolha qual em [Controles e atalhos](/pt/essentials/units-settings#controls-shortcuts) | Arrastar com um dedo |
| Ajustar, centralizar | <kbd>F</kbd>, <kbd>C</kbd> ou os botões do canto superior direito | Os botões do canto superior direito |

<kbd>Ctrl</kbd>+<kbd>+</kbd> e <kbd>Ctrl</kbd>+<kbd>-</kbd> aproximam e afastam o desenho em torno do centro, em qualquer layout de teclado. Eles nunca ampliam a interface inteira, como faria o zoom do próprio navegador.

### Selecionar e editar {#selecting-and-editing}

| Para | Faça assim |
| --- | --- |
| Selecionar um objeto | Clique em um nó, elemento, carga ou linha de cota. Ao lado dele se abre um painel com as ações cabíveis: adicionar uma carga, definir apoios, editar, mostrar a matriz de rigidez, excluir. A barra inferior muda para a aba correspondente. |
| Selecionar vários | Arraste um retângulo sobre a tela vazia (numa tela sensível ao toque, pressione antes **Seleção por retângulo**). Ele seleciona todos os nós que estão dentro e todos os elementos que toca, com suas cargas e linhas de cota. <kbd>Ctrl</kbd>+<kbd>A</kbd> seleciona tudo. |
| Excluir, copiar, colar | <kbd>Delete</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>. O que você cola acompanha o ponteiro até você clicar, ou é colado com o deslocamento Δx, Δz que você digitar na faixa no topo. |
| Mover um nó | Arraste-o. Com o encaixe ligado, ele se encaixa na grade; os elementos e as cargas ligados a ele acompanham. |
| Editar uma carga | Clique duas vezes nela. |
| Ver detalhes | Aponte para qualquer objeto e aparece uma dica: os deslocamentos e a rotação de um nó, o material e a seção de um elemento, os valores de uma carga. Numa tela sensível ao toque, toque no objeto: o painel mostra o mesmo. |
| Abrir o menu da tela | Clique com o botão direito na tela ou, numa tela sensível ao toque, toque e segure. |

::div{.shots}

![O painel de um nó: adicionar uma carga, definir apoios, prescrever um deslocamento](/screenshots/pt/ui-node-menu.webp)

![Ao apontar para um nó, aparecem seus deslocamentos e sua rotação](/screenshots/pt/ui-hover.webp)

::

O **menu da tela** oferece *Adicionar nó*, *Adicionar elemento*, *Adicionar cota* (e, sobre um elemento, *Cotar o elemento*) e, para a seleção atual, *Editar*, *Copiar*, *Colar* e *Excluir*. Segure <kbd>Ctrl</kbd> ao escolher *Adicionar nó* ou *Adicionar elemento* para posicioná-los com o mouse em vez de usar um diálogo.

![O menu da tela](/screenshots/pt/ui-canvas-menu.webp){.shot-sm}

A página [Teclado, mouse e toque](/pt/reference/shortcuts) lista todos os atalhos e gestos.

### Quando o modelo não pode ser resolvido {#when-the-model-cannot-be-solved}

As mensagens aparecem no canto superior esquerdo da visualização:

| Mensagem | Significado |
| --- | --- |
| *Nenhum material definido.*, *Nenhuma seção definida.* | Crie um com o botão **Adicionar** ao lado. |
| A etiqueta azul **Faltam apoios** | O modelo simplesmente ainda não está pronto: faltam apoios. |
| Uma mensagem vermelha, com **Mostrar detalhes** | Há algo errado. Os detalhes listam cada problema, cada um com uma dica. |
| Uma mensagem amarela | O modelo foi resolvido, mas algo parece estranho, por exemplo um nó ao qual nenhum elemento está ligado. |

Quando a estrutura ainda pode se mover, o EduBeam mostra o movimento dela com um contorno tracejado que oscila e marca com um círculo os nós ou as rótulas responsáveis. Aponte para a mensagem para ver o movimento de novo; o botão do olho o oculta.

![Um pórtico com rótulas em B e C é um mecanismo: o EduBeam mostra como ele se move](/screenshots/pt/ui-mechanism.webp)

Em [Solução de problemas](/pt/reference/troubleshooting#messages) você encontra cada mensagem e como resolvê-la.

## Barra inferior {#bottom-bar}

São seis abas, cada uma com uma barra de ferramentas e uma tabela editável. O nome da aba mostra quantos objetos ela contém. Arraste a faixa de abas para cima ou para baixo para redimensionar a barra, ou recolha-a com o botão à direita. O **?** ao lado explica a aba aberta, assim como o **?** ao lado de alguns títulos de coluna.

| Aba | Barra de ferramentas | Colunas da tabela |
| --- | --- | --- |
| **Nós** | Adicionar nó (diálogo), Adicionar nó (mouse) | Nó, Coordenadas, **GLs restringidos** (símbolo do apoio, `Dx`, `Dz`, `Ry`, ângulo α), Cargas, Ações |
| **Elementos** | Adicionar elemento (diálogo), Adicionar elemento (mouse) | Elemento, Tipo, Nós (com **Inverter nós**), Material, Seção, **Rótulas de extremidade**, Cargas, Ações |
| **Cargas** | Adicionar carga nodal, Adicionar carga de elemento | Tipo, Alvo, Componentes, Ações |
| **Materiais** | Adicionar material, Biblioteca de materiais | Material, E, G, α<sub>T</sub>, Ações |
| **Seções** | Adicionar seção, Biblioteca de seções, Seção poligonal | Forma, Seção, Área, I<sub>y</sub>, Altura, Coeficiente de cisalhamento, Ações |
| **Resultados** | Resultados nodais, Resultados dos elementos, Exportar CSV, Copiar | Deslocamentos por nó ou esforços de extremidade por elemento; veja [Resultados](/pt/essentials/results#results-tab) |

Cada aba é explicada em detalhe nas páginas [Nós e apoios](/pt/essentials/nodes-supports), [Elementos, materiais e seções](/pt/essentials/elements), [Cargas](/pt/essentials/loads) e [Resultados e diagramas](/pt/essentials/results#results-tab).

### Digitar valores {#typing-values}

Todos os campos numéricos, nas tabelas e nos diálogos, funcionam do mesmo jeito:

- Os valores estão nas [unidades atuais](/pt/essentials/units-settings#units), indicadas no título da coluna ou depois do campo.
- Tanto o ponto quanto a vírgula servem de separador decimal: `2.5` e `2,5` dão o mesmo valor.
- Você pode digitar contas com `+ - * / ^` e parênteses: `6/2`, `3*1.5`, `2^3` ou `(4+2)/3` são calculados para você, e `1e-5` vale $10^{-5}$.
- Na tabela, <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Tab</kbd> ou um clique em outro lugar aplicam o valor. Depois disso, <kbd>Ctrl</kbd>+<kbd>Z</kbd> o desfaz; enquanto você ainda está digitando, ele desfaz só a digitação.

## Abas acima da visualização {#tabs-above-the-viewer}

**Estrutura** mostra a tela. **Configurações** mostra as [configurações](/pt/essentials/units-settings) em tamanho inteiro no lugar dela, para que você mude cores ou unidades e volte para ver o efeito. O indicador de unidades e *Mais configurações* abrem as mesmas configurações como um diálogo sobre o modelo.

## Janelas flutuantes {#floating-windows}

**Matriz de rigidez** (no painel de um elemento ou na tabela *Elementos*) abre uma janela com a matriz de rigidez 6 × 6 do elemento em eixos globais. **Editar**, no menu da tela, abre uma tabela com a seleção atual. Mova uma janela arrastando a barra de título e feche-a com o ×.
