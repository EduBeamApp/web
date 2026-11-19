---
description: "Ensine com o EduBeam: modelos ao vivo no projetor, links nas notas de aula, autoconferência, exercícios gerados e provas para imprimir com gabarito."
source: site
---

# Ensinar com o EduBeam

O [EduBeam]{.edubeam} nasceu em uma sala de aula, e é lá que ele ainda funciona melhor: um modelo no projetor que reage no instante em que você o altera, e o mesmo modelo no notebook de cada aluno por meio de um link. Esta página reúne o que os professores mais usam, da primeira aula até a prova.

::card-grid{cols="2"}
:::card{title="Na aula" icon="lucide:presentation" to="#in-the-lecture"}
Deixe o modelo legível do fundo da sala e altere-o ao vivo.
:::
:::card{title="Na primeira aula de laboratório" icon="lucide:graduation-cap" to="#getting-students-started"}
Dez minutos de uma tela vazia até uma viga conferida à mão.
:::
:::card{title="Em notas de aula e exercícios" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
Um link em um PDF ou em um slide abre o modelo inteiro, por anos.
:::
:::card{title="Exercícios autoconferíveis" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
Primeiro o cálculo à mão, depois o modelo como conferência.
:::
:::card{title="Exercícios e provas" icon="lucide:file-check" to="#practice-and-test-papers"}
Exercícios gerados com correção imediata e provas para imprimir com gabarito.
:::
:::card{title="Listas de exercícios e slides a partir de código" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
Seus próprios geradores de exercícios e figuras para slides, escritos com @edubeam/plot.
:::
::

## Na aula {#in-the-lecture}

- **Deixe tudo legível do fundo da sala.** Em **Configurações → Configurações de visualização**, aumente o **Tamanho da fonte** para 18 ou 20 px (20 px é o máximo) e o **Tamanho dos apoios** para 130–150 %. Aumente a **Escala de resultados** se os diagramas ainda parecerem pequenos.
- **Mostre uma coisa de cada vez.** Nas opções de exibição, no canto superior direito da visualização, desmarque tudo exceto a grandeza de que você está falando e depois acrescente as outras uma a uma.
- **Altere o modelo ao vivo.** Arraste um apoio, marque `Ry`, adicione uma rótula. Os alunos veem causa e efeito na hora, e <kbd>Ctrl</kbd>+<kbd>Z</kbd> leva você de volta.
- **Deixe o solver explicar os mecanismos.** Coloque uma rótula a mais e o EduBeam desenha como a estrutura pode se mover, anima o movimento e destaca com um círculo as rótulas responsáveis. É um bom momento para discutir estabilidade. As duas chaves ficam em **Configurações → Configurações de visualização → Verificação do modelo**.
- **Use o idioma e os eixos dos seus alunos.** O EduBeam fala 18 idiomas, e as [Configurações](/pt/essentials/units-settings) alternam entre unidades SI e americanas e entre eixos com z para baixo ou y para cima, de acordo com as suas notas de aula.

![Um mecanismo à vista: as rótulas em B e C deixam o pórtico se deslocar lateralmente](/screenshots/pt/ui-mechanism.webp)

## Na primeira aula de laboratório {#getting-students-started}

Na primeira visita, o EduBeam pergunta aos alunos como eles querem começar e quais unidades e eixos preferem. Avise antes quais unidades e eixos a sua disciplina usa. O tour (**Fazer um tour**), a tarefa guiada **Desenhar sua primeira viga** e os **Exemplos** continuam no menu **☰** para depois.

Uma boa primeira aula de laboratório: “abram run.edubeam.app e escolham *Desenhar sua primeira viga*”, e em seguida o [Início rápido](/pt/guide/quick-start), cerca de dez minutos com uma conferência à mão no final.

### Computadores de laboratório e uso offline {#offline-and-lab-computers}

O EduBeam é um aplicativo web progressivo (PWA): depois que o navegador o carrega uma vez, ele continua funcionando sem conexão, e o navegador pode oferecer a opção de instalá-lo como um programa de desktop. O modelo e as configurações ficam guardados por perfil do navegador; por isso, em computadores de laboratório compartilhados, os alunos devem levar o trabalho como arquivo ou link. Os detalhes estão em [O que fica guardado no seu navegador](/pt/essentials/units-settings#what-is-stored-in-your-browser).

## Em notas de aula e exercícios {#in-lecture-notes-and-assignments}

Um link de compartilhamento contém o modelo inteiro, então funciona em qualquer lugar onde um link funcione: um PDF, um slide, uma página do AVA, um e-mail.

::div{.steps}

### Monte o modelo {#share-build}

Deixe-o do jeito que os alunos devem vê-lo primeiro: com as cargas, os rótulos e os diagramas que você quer ligados.

### Copie o link {#share-copy}

Clique em **Compartilhar modelo** na barra superior. Ligue **Mostrar o que eu vejo** se quiser que o link abra com os seus diagramas, cargas e rótulos ligados, e clique em **Copiar**.

### Cole-o nas suas notas {#share-paste}

Os alunos que o abrirem recebem uma cópia própria para explorar. Nada do que eles alterarem chega a você nem a mais ninguém. Os links continuam funcionando nas novas versões do EduBeam, então as notas permanecem válidas ano após ano.

::

Deixe **Link mais curto** desligado no material da disciplina: uma cópia do EduBeam que não foi atualizada desde que essa opção surgiu não consegue abrir a forma curta até ser atualizada.

| Link | Abre |
| --- | --- |
| `run.edubeam.app/?model=…` | o modelo, pronto para editar |
| `run.edubeam.app/?viewer=1&model=…` | o modelo no [modo de visualização](/pt/essentials/import-export#embed-a-read-only-viewer), para um `<iframe>` |
| `run.edubeam.app/?panel=examples` | a [galeria de exemplos](/pt/examples/) |
| `run.edubeam.app/?lang=pt` | o aplicativo em português, ou em qualquer [outro idioma](/pt/essentials/import-export#url-parameters) |

::callout{type="warning" title="Um link substitui o modelo do próprio aluno"}
Abrir um link e, em alguns navegadores, uma página com um visualizador incorporado leva o modelo que o aluno tinha para **☰ → Estruturas recentes**, de onde ele pode ser restaurado. Mesmo assim, peça aos alunos que salvem o trabalho importante com **☰ → Salvar projeto** antes de abrir links da aula.
::

## Exercícios que os alunos podem conferir sozinhos {#assignments-students-can-check-themselves}

O EduBeam dá aos alunos um retorno imediato sobre o cálculo feito à mão, sem aplicar o método no lugar deles.

- **Primeiro calcular, depois conferir.** Peça as reações, os esforços internos e um deslocamento calculados à mão e depois peça que os alunos montem o modelo e comparem. [Conferir resultados à mão](/pt/guide/verification) traz as fórmulas, e o [Início rápido](/pt/guide/quick-start#_8-check-by-hand) mostra o roteiro.
- **Pergunte por que um resultado difere.** Deformação por cisalhamento, uma rótula faltando, uma carga em eixos locais em vez de globais: cada uma explica uma diferença pequena ou grande, e encontrá-la ensina mais do que acertar de primeira.
- **Receba o modelo junto com o cálculo.** Peça um link de compartilhamento ou um `project.json` junto com a resolução. Você pode abri-lo e ver exatamente o que foi modelado.
- **Relatórios com boa apresentação.** Os alunos podem exportar o desenho em **SVG**, que fica nítido no Word e no LaTeX, e os resultados em **CSV**. Veja [Exportar uma imagem](/pt/essentials/import-export#export-an-image).

## Exercícios prontos {#ready-made-exercises}

- **[Exemplos](/pt/examples/):** seis modelos que abrem com um clique, cada um com perguntas, o que observar e as respostas.
- **[Exercícios de estática](/pt/practice):** vigas, pórticos e treliças gerados que conferem as respostas dos alunos, e um [gerador de provas](/pt/exam) que os imprime como provas. Veja [abaixo](#practice-and-test-papers).
- **[Tutoriais](/pt/tutorials/inclined-beam):** uma viga inclinada, um pórtico triarticulado, uma treliça plana e uma viga contínua com recalque de apoio, cada um modelado passo a passo e conferido à mão. Servem como roteiros de 15 a 20 minutos para a aula de laboratório.
- **[Conferir resultados à mão](/pt/guide/verification):** os casos com solução analítica, da viga em balanço ao recalque de apoio, para propor como conferências rápidas.

## Exercícios e provas {#practice-and-test-papers}

Duas páginas deste site criam exercícios de estática para você, sem nada para instalar nem programar:

- **A página [Exercícios de estática](/pt/practice)** dá aos alunos um exercício novo sempre que eles pedem. Eles resolvem no papel, digitam as reações e o maior momento fletor ou o esforço em uma barra, e a página confere cada valor com a solução exata: um desvio de até 1 % é aceito, e um valor de módulo certo, mas com o sentido errado, é apontado. Uma dica mostra por onde começar, e os diagramas aparecem quando o aluno termina. Cada exercício tem um código, como `H2048`, que sempre corresponde ao mesmo exercício: coloque um código numa lista de exercícios, e todos conferem com os mesmos números.
- **O [gerador de provas](/pt/exam)** imprime provas: escolha os tipos de estrutura, até 6 exercícios por prova e até 40 versões, e cada aluno recebe uma versão diferente. Todas as versões têm os mesmos tipos de estrutura na mesma ordem, então as provas têm a mesma dificuldade. Ele acrescenta uma linha para o nome, espaço para os cálculos e um gabarito, e **Imprimir ou salvar como PDF** as imprime. **Baixar .zip** entrega cada figura como arquivo SVG para LaTeX e Word e as respostas como tabela CSV para a correção.

As duas páginas oferecem os mesmos oito tipos de estrutura: seis isostáticos (viga biapoiada, viga em balanço, viga biapoiada com balanço, viga Gerber, pórtico triarticulado e treliça Warren) e dois hiperestáticos (viga contínua de dois vãos e pórtico).

O gerador de provas guarda as configurações, inclusive o **Número da prova** que define os números, no endereço da página. Salve o endereço nos favoritos, e as mesmas provas e o mesmo gabarito voltam no ano seguinte. Nas provas, os códigos dos exercícios vêm desligados por padrão: a página Exercícios de estática mostra a solução, então os códigos são para os exercícios para casa, em que os alunos conferem o próprio trabalho depois.

## Listas de exercícios, provas e slides a partir de código {#exercise-sheets-tests-and-slides-from-code}

Os diagramas deste site são desenhados pela biblioteca [@edubeam/plot](/pt/plot), um conjunto de componentes Vue que desenha qualquer viga, pórtico ou treliça plana resolvida pela [@edubeam/fem](/pt/solver), o solver do EduBeam. Se você sabe escrever um pouco de JavaScript, ela transforma algumas linhas de código em material didático:

- **Seus próprios tipos de exercício.** Quando as estruturas do gerador de provas não são as que você ensina, escreva as suas: uma semente (valor inicial do gerador aleatório) escolhe a estrutura e os números, de modo que a mesma semente sempre gera o mesmo exercício, e o gabarito sai da mesma semente.
- **Slides que se constroem por etapas.** Mostre a estrutura, depois os apoios e as cargas, depois as reações e por fim o diagrama de momento fletor, passo a passo, sem que o desenho se mova entre as etapas.
- **Figuras para notas e páginas da disciplina.** SVG nítido que segue o tema claro ou escuro da página e, ao contrário de um aplicativo incorporado, nunca mexe no modelo do próprio aluno.

Experimente. Cada clique em **Novo exercício** desenha um novo exercício e o seu gabarito:

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="Exercícios e provas" icon="lucide:file-check" to="/pt/plot/exercises"}
Gere listas de exercícios e os gabaritos a partir de uma semente.
:::
:::card{title="Slides e notas de aula" icon="lucide:presentation" to="/pt/plot/slides"}
Figuras que se constroem camada por camada, para slides e notas.
:::
::
