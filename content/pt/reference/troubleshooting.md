---
description: "Por que o EduBeam não mostra resultados e como resolver: cada mensagem de erro e de aviso explicada, resultados que parecem errados e arquivos ou links que não abrem."
source: site
---

# Solução de problemas

Quando um modelo não pode ser resolvido, o [EduBeam]{.edubeam} explica o motivo numa mensagem no canto superior esquerdo da visualização, e **Mostrar detalhes** lista cada problema por completo. Escolha o título do diálogo que você viu: cada mensagem abaixo diz o que significa e como corrigir.

::card-grid{cols="2"}
:::card{title="Ainda não é possível resolver" icon="lucide:circle-dashed" to="#still-needed"}
Uma etiqueta azul *Faltam apoios*. Não há nada errado: a estrutura apenas não está fixada ainda.
:::
:::card{title="Não é possível resolver o modelo" icon="lucide:circle-x" to="#errors"}
Uma mensagem vermelha. Apoios que não fixam a estrutura, rótulas que formam um mecanismo, um elemento de comprimento nulo.
:::
:::card{title="Avisos do modelo" icon="lucide:triangle-alert" to="#warnings"}
Uma mensagem amarela. O modelo foi resolvido, mas provavelmente algo não está como você queria.
:::
:::card{title="Os resultados parecem errados" icon="lucide:scale" to="#results-look-wrong"}
Cargas atuando para cima, flechas que diferem por potências de dez, um sinal que parece invertido.
:::
::

## Mensagens {#messages}

### O que as cores significam {#read-the-message}

| Você vê | Significa |
| --- | --- |
| Uma etiqueta azul *Faltam apoios* | O modelo está incompleto. Adicione apoios. Aponte para a etiqueta para ver, como um contorno tracejado, como a estrutura ainda pode se mover. |
| Uma mensagem **vermelha** | Algo impede o cálculo. Ela indica o problema, ou mostra *Erros no modelo: n* quando há vários. Os nós envolvidos aparecem circulados no desenho. |
| Uma mensagem **amarela** | Avisos. O modelo foi resolvido mesmo assim. Quando há vários, ela mostra *Avisos no modelo: n*. |
| *Nenhum material definido.* / *Nenhuma seção definida.* | Os elementos precisam dos dois. Adicione um com o botão **Adicionar** ao lado da mensagem. |

**Mostrar detalhes** abre o diálogo, com o título *Ainda não é possível resolver*, *Não é possível resolver o modelo* ou *Avisos do modelo*. A chave dele mostra ou oculta como a estrutura pode se mover, e o link **Solução de problemas** leva a esta página.

![O diálogo Não é possível resolver o modelo, com a chave que mostra como a estrutura pode se mover](/screenshots/pt/ui-diagnostics.webp){.shot-lg}

No desenho:

- O **✕** numa mensagem vermelha a recolhe numa pequena etiqueta *Não é possível resolver o modelo*, para liberar espaço numa tela pequena. Clique na etiqueta para expandi-la de novo.
- O botão do **olho** numa mensagem vermelha mostra ou oculta o contorno tracejado do movimento. **Configurações → Configurações de visualização → Verificação do modelo** desliga de vez o contorno e a animação dele.
- O **✕** numa mensagem amarela oculta os avisos.

### Ainda falta {#still-needed}

O modelo não está errado, apenas incompleto. Aponte para a etiqueta para ler o texto curto; o diálogo mostra o longo.

| Mensagem | Significado e correção |
| --- | --- |
| *A estrutura precisa de apoios para poder ser resolvida.* <br> *O modelo precisa de pelo menos 3 GLs restringidos para ser estável na análise 2D.* | Menos de três direções restringidas no total. Adicione apoios. |
| *A parte com os nós … precisa de apoios.* <br> *Uma parte separada da estrutura (nós …) tem menos de 3 GLs restringidos e pode se mover livremente.* | O modelo está em pedaços e um deles está solto. Ligue-o ao resto ou coloque apoios nele. |
| *n partes da estrutura precisam de apoios.* | Vários pedaços estão soltos. **Mostrar detalhes** lista todos. |

### Erros {#errors}

Algo impede o cálculo. A mensagem vermelha mostra o texto curto; o diálogo, o longo.

| Mensagem | Significado e correção |
| --- | --- |
| *Os apoios não fixam a estrutura: ela ainda pode deslizar horizontalmente / se mover verticalmente / girar livremente / se mover como corpo rígido.* <br> *A estrutura tem apoios suficientes, mas eles não a fixam: ela ainda pode …* | Há restrições suficientes, mas todas são paralelas, ou as linhas de ação delas se encontram num ponto, como em três apoios móveis sob uma viga horizontal. O contorno tracejado mostra o movimento; gire ou mude de lugar um dos apoios. |
| *A parte com os nós … não está fixada: ela ainda pode …* <br> *Uma parte separada da estrutura (nós …) tem apoios suficientes, mas eles não a fixam: ela ainda pode …* | O mesmo, para um pedaço de um modelo dividido em partes. |
| *As articulações do nó … deixam a estrutura se mover.* <br> *Os apoios fixam a estrutura, mas ela ainda é um mecanismo: suas barras podem girar em torno das articulações do nó …* | As rótulas deixam as barras girarem umas em relação às outras, como num pórtico com apoios fixos nas duas bases e uma rótula no topo de cada pilar, ou num quadrado de barras articuladas sem diagonal. Remova uma rótula, ou acrescente uma barra ou um apoio. |
| *A estrutura é instável: move-se quase sem resistência.* <br> *A estrutura é instável. Movimentos praticamente sem resistência: nó … na horizontal (Dx) …* | Quase um mecanismo, ou uma rigidez próxima de zero. A mensagem longa indica os nós e as direções. Verifique os apoios, as rótulas e os valores de `E`, `A` e `Iy`. |
| *A estrutura é um mecanismo: pode se mover sem resistência.* <br> *A estrutura é um mecanismo: a matriz de rigidez é singular.* | Algo pode se mover livremente sem ter sido detectado pelas verificações acima. Verifique se cada parte está fixada por pelo menos três restrições e se as rótulas de extremidade não deixam uma barra livre para girar. |
| *O elemento … tem comprimento nulo: os nós … e … estão no mesmo ponto.* | Dois nós de um mesmo elemento estão um sobre o outro. Mova um deles ou exclua o elemento. |
| *O elemento … referencia o mesmo nó nas duas extremidades.* | Exclua o elemento e desenhe-o de novo entre dois nós diferentes. |
| *O elemento … referencia o nó / o material / a seção inexistente …* | O objeto que ele usa foi excluído, normalmente num arquivo de projeto editado à mão. Atribua outro na tabela *Elementos*. |
| *O elemento … deve referenciar exatamente 2 nós.* | Um elemento corrompido num arquivo importado. Exclua-o e desenhe-o de novo. |
| *A carga nodal nº n referencia o nó inexistente …* <br> *O deslocamento prescrito nº n referencia o nó inexistente …* | Exclua a carga ou atribua-a a um nó existente. |
| *A carga de elemento nº n referencia o elemento inexistente …* | Exclua a carga. |
| *O solver falhou devido a uma inconsistência interna do modelo.* | Uma falha genérica. Desfaça o último passo, ou salve o projeto e [relate o problema](#reporting-a-bug). |

### Avisos {#warnings}

O modelo é resolvido mesmo assim, mas verifique estes pontos:

| Mensagem | Significado e correção |
| --- | --- |
| *O nó … não está ligado a nenhum elemento e é ignorado pelo solver.* | Um nó solto. Exclua-o ou ligue-o à estrutura. |
| *O nó … tem apoio, mas nenhum elemento está ligado a ele, então o apoio não transmite nada.* | Um apoio num nó solto. |
| *A carga nodal nº n contém valores inválidos.* <br> *O deslocamento prescrito nº n contém valores inválidos.* | Uma componente que não é um número. Edite a carga. |

### Durante a edição {#while-editing}

Estas mensagens abrem num diálogo do navegador enquanto você trabalha, e o modelo fica como estava:

| Mensagem | Significado e correção |
| --- | --- |
| *Adicione um material primeiro.* <br> *Adicione uma seção primeiro.* | Um elemento precisa dos dois. Adicione um na aba *Materiais* ou *Seções* e desenhe o elemento de novo. |
| *Selecione um material e uma seção.* | O diálogo **Adicionar elemento** tem um campo vazio. Escolha os dois. |
| *O rótulo … já está em uso.* | Dois nós, elementos, materiais ou seções não podem ter o mesmo rótulo. Escolha outro. |
| *Já existe um deslocamento prescrito para este nó. Remova-o primeiro.* | Um nó aceita um único deslocamento prescrito. Edite o que já existe ou exclua-o antes. |

## Nada é desenhado {#no-results-are-drawn}

Quando nenhum diagrama aparece, verifique nesta ordem:

::div{.steps}

### Confira as opções de exibição {#check-the-display-options}

Se não há mensagem nenhuma, o modelo está resolvido: talvez o diagrama esteja apenas desligado. Marque **M<sub>y</sub>(x)**, ou outro resultado, nas opções de exibição no canto superior direito da visualização; o botão ⚙ acima delas mostra o painel. Um modelo sem nenhuma carga tem resultados nulos em todo lugar, então também não há nada para desenhar.

### Confira os apoios {#check-the-supports}

O solver precisa de pelo menos três direções restringidas, e os apoios, em conjunto, precisam impedir que a estrutura deslize ou gire. Uma viga sobre dois apoios móveis tem só duas restrições e desliza: transforme um deles em **apoio fixo**. Três apoios móveis paralelos, ou apoios cujas linhas de ação se encontram num ponto, também não a fixam. Veja [Nós e apoios](/pt/essentials/nodes-supports#supports).

### Confira se os elementos estão ligados {#check-the-connections}

Dois nós com as mesmas coordenadas continuam sendo dois nós distintos, e uma parte que só toca o resto ali fica solta. Exclua o nó solto e refaça a ligação. Quando você posicionar um nó sobre um elemento, responda **Conectar à estrutura** para dividir o elemento nesse ponto.

### Conte as rótulas {#count-the-hinges}

Um pórtico com apoios fixos nas duas bases e uma rótula no topo de cada pilar, ou um quadrado de barras articuladas sem diagonal, é um mecanismo. O EduBeam destaca as rótulas com um círculo e mostra o movimento com um contorno tracejado animado. Veja [Rótulas de extremidade](/pt/essentials/elements#end-hinges).

### Procure uma rigidez nula {#look-for-zero-stiffness}

`E`, `A` ou `Iy` digitados como 0, ou na unidade errada, deixam parte da estrutura se mover quase sem resistência. O EduBeam informa isso como *instável*.

::

## Os resultados parecem errados {#results-look-wrong}

| Sintoma | Causa provável |
| --- | --- |
| As cargas atuam para cima | O eixo global **z aponta para baixo**, então um `Fz` ou `fz` positivo atua para baixo; valores negativos apontam para cima. Com os eixos y para cima, é o contrário. Veja [Cargas](/pt/essentials/loads#sign-convention-in-one-line). |
| A flecha difere por potências de dez | Confusão de unidades: `E` digitado em Pa quando o campo espera MPa, ou `Iy` em cm⁴ quando ele espera m⁴. O indicador de unidades, no canto inferior direito da visualização, mostra as unidades de todos os campos. |
| A flecha é um pouco maior que a da fórmula do livro | Deformação por cisalhamento da viga de Timoshenko. Veja [Conferir resultados à mão](/pt/guide/verification#shear-deformation). |
| Um sinal parece errado | Leia o sinal pelo valor, não pelo lado em que o diagrama é desenhado: M positivo traciona a fibra inferior. Os esforços de extremidade em *Resultados dos elementos* seguem os eixos locais do elemento, não a convenção N-V-M. Veja [Leitura do sinal](/pt/essentials/results#reading-the-sign). |
| Um diagrama está do lado “errado” | O lado é uma opção de exibição: o momento fletor do lado tracionado ou do comprimido, N e V de qualquer um dos lados da linha tracejada. **Configurações → Configurações de visualização → Diagramas de esforços internos**. |
| Dois pilares idênticos mostram sinais opostos de cortante | O sinal de V segue a orientação de cada elemento. Inverta os nós de um deles para compará-los. |
| Números como `4 · 10¹` | O formato numérico científico. Escolha *Automático* em **Configurações → Idioma e localidade → Formato numérico**. |
| Diagramas enormes ou minúsculos | É só o desenho. Ajuste a **Escala de resultados** em **Configurações → Configurações de visualização**. |
| Uma carga em eixos locais aponta para o lado errado | O eixo x local de um elemento vai do nó *inicial* ao nó *final*. Inverta os nós ou troque o sinal. |
| A carga numa barra inclinada não está certa | A caixa **LCS** (sistema de coordenadas local) vem marcada por padrão, então `fz` atua perpendicularmente à barra. Desmarque-a para uma carga vertical. |
| Uma carga térmica não faz nada | Uma estrutura isostática se deforma livremente sob variação de temperatura, sem esforços internos. Para a deformação, confira se α não é 0 e, no caso do gradiente, se a altura $h$ da seção está definida. |

## Arquivos e links {#files-and-links}

| Sintoma | Correção |
| --- | --- |
| *Não foi possível importar o arquivo. Verifique o formato do arquivo.* | O arquivo não é nem um projeto do EduBeam nem uma sessão do EduBeam para desktop. O seu modelo não foi alterado. |
| *Esta sessão do EduBeam tem vários casos de carga, mas só é possível abrir um.* | Uma sessão do EduBeam para desktop com vários casos de carga: o EduBeam abre o primeiro e indica os que ficaram de fora. |
| Um link de compartilhamento abre o seu modelo antigo | O link foi cortado ou alterado, por exemplo por um programa de e-mail que o quebrou em duas linhas. O EduBeam ignora um link que não consegue ler e mantém o seu modelo. Copie o link inteiro de novo. |
| Um link mais curto não abre para um colega | A cópia do EduBeam dele é anterior à versão 1.3.2. Ele deve recarregar o aplicativo, ou você pode compartilhar com **Link mais curto** desligado. Veja [Compartilhar um link](/pt/essentials/import-export#share-a-link). |

## Problemas na interface {#interface-issues}

| Sintoma | Correção |
| --- | --- |
| Os atalhos não fazem nada | Clique primeiro no desenho: as teclas isoladas são ignoradas enquanto um campo de texto tem o foco. Num Mac, use <kbd>Cmd</kbd> no lugar de <kbd>Ctrl</kbd>. Veja [Teclado, mouse e toque](/pt/reference/shortcuts). |
| <kbd>Delete</kbd> não faz nada num Mac | A tecla marcada *delete* no teclado do Mac é o Backspace. Pressione <kbd>Fn</kbd>+<kbd>Delete</kbd>. |
| Não consigo mover a vista | A vista se move com o botão do meio ou o direito do mouse; escolha qual em **Configurações → Controles e atalhos**. No trackpad, clique e arraste com dois dedos. Numa tela sensível ao toque, arraste com um dedo. |
| Meu modelo sumiu | Abrir um link, um arquivo ou um exemplo, assim como limpar, guarda o modelo antigo: **☰ → Estruturas recentes**, ou <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Ao abrir, um link avisa isso na parte de baixo da tela: *Estrutura compartilhada aberta. A anterior está em Estruturas recentes.*, com um botão **Mostrar**. |
| Idioma errado | **Configurações → Idioma e localidade**, ou acrescente `?lang=pt` ao endereço. |
| As alterações nas configurações não ficam salvas | O armazenamento local está bloqueado, por exemplo numa janela anônima ou num modo de privacidade estrito. As configurações, o modelo salvo e as Estruturas recentes dependem dele. |

## Relatar um erro {#reporting-a-bug}

Abra uma [issue no GitHub](https://github.com/janvorisek/edubeam/issues) informando o navegador e o sistema operacional, o que você fez e o que esperava. O mais útil de tudo é um **link de compartilhamento** ou o **arquivo de projeto** que mostre o problema.
