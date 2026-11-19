---
description: "Respostas curtas sobre o EduBeam: custo, uso offline, privacidade, precisão, cálculo dos resultados, como citá-lo, exercícios, compartilhamento e código."
source: site
---

# Perguntas frequentes

Respostas curtas, cada uma com um link para a página que trata do assunto por completo. Não encontrou a sua? Veja [Solução de problemas](/pt/reference/troubleshooting) ou [pergunte no GitHub](https://github.com/janvorisek/edubeam/issues).

## Geral {#general}

### O que é o EduBeam? {#what-is-edubeam}

Um aplicativo gratuito e de código aberto para a análise estática linear de vigas, pórticos e treliças 2D, feito para alunos, professores e engenheiros que querem um retorno imediato. Ele roda no navegador. A [Introdução](/pt/guide/introduction) lista o que ele faz e o que não faz.

### É gratuito mesmo? Preciso de cadastro? {#is-it-really-free-do-i-need-an-account}

Sim, é gratuito, e não, você não precisa de cadastro. Abra [run.edubeam.app](https://run.edubeam.app/?lang=pt){target="_blank"} e comece a modelar: não há nada para instalar nem limite de uso. O código-fonte está no [GitHub](https://github.com/janvorisek/edubeam), sob a licença GPL-3.0.

### Quais navegadores e dispositivos funcionam? {#which-browsers-and-devices-work}

Qualquer versão atual do Chrome, Edge, Firefox ou Safari, no computador, no tablet ou no celular. Numa tela sensível ao toque, toque para selecionar, arraste um nó para movê-lo, arraste em outro lugar para mover a vista, faça o movimento de pinça para dar zoom e toque e segure para abrir o menu da tela. Com mouse e teclado, porém, a modelagem continua mais rápida. Veja [Teclado, mouse e toque](/pt/reference/shortcuts#touch).

### Perdi meu modelo. Consigo recuperá-lo? {#i-lost-my-model-can-i-get-it-back}

Provavelmente. Quando um modelo é limpo, ou substituído por um link, um arquivo ou um exemplo, o EduBeam o guarda em **☰ → Estruturas recentes** (os últimos 10), e <kbd>Ctrl</kbd>+<kbd>Z</kbd> desfaz a substituição. Os dois ficam apenas neste navegador, então um modelo feito em outro computador ou em outro perfil do navegador não aparece ali. Veja [Estruturas recentes](/pt/essentials/import-export#recent-structures).

### Posso usar offline? {#can-i-use-it-offline}

Sim. O EduBeam é um aplicativo web progressivo: depois que o navegador o carrega, ele continua funcionando sem conexão, e o navegador pode oferecer a opção de instalá-lo. Quando sai uma nova versão, um diálogo pergunta antes de atualizar.

### Onde meus dados ficam armazenados? {#where-is-my-data-stored}

No seu navegador. Não há contas nem armazenamento na nuvem: o aplicativo guarda o seu modelo e as suas configurações neste navegador, e um link de compartilhamento leva o modelo dentro do próprio link. Veja [O que fica guardado no seu navegador](/pt/essentials/units-settings#what-is-stored-in-your-browser).

O aplicativo em run.edubeam.app coleta, sim, estatísticas de uso (Google Analytics) e relatórios de erro (Sentry). Um relatório de erro, assim como a gravação que o Sentry faz de uma amostra das sessões, pode incluir o que estava na tela, inclusive o seu modelo.

### Onde posso praticar exercícios de estática? {#practice}

Na página [Exercícios de estática](/pt/practice). Ela propõe uma viga, um pórtico ou uma treliça com números novos a cada vez: calcule no papel as reações e o maior momento fletor ou o esforço em uma barra, digite os valores, e cada um é conferido na hora. Os [exemplos](/pt/examples/) também trazem perguntas e respostas. Os professores podem imprimir uma prova diferente para cada aluno, com gabarito, no [gerador de provas](/pt/exam); veja [Exercícios e provas](/pt/guide/teaching#practice-and-test-papers).

### Como cito o EduBeam? {#cite}

Como software, com a versão e a data em que você o usou. A versão aparece no fim do menu **☰**. Por exemplo:

> Voříšek, J. e colaboradores. *EduBeam*, versão 1.3.4 \[software\]. https://edubeam.app (acesso em: 18 nov. 2026).

Para se referir a um modelo específico, acrescente o [link de compartilhamento](/pt/essentials/import-export#share-a-link) dele: o link abre o mesmo modelo para todos os leitores.

## Modelagem {#modelling}

### Como faço um engaste, um apoio fixo ou um apoio móvel? {#how-do-i-make-a-fixed-pinned-roller-support}

Clique no nó, escolha **Apoios do nó** e selecione o símbolo: apoio fixo, apoio móvel, engaste, engaste deslizante e outros. Ou marque os GLs restringidos na aba **Nós**: `Dx` + `Dz` + `Ry` é um engaste, `Dx` + `Dz` é um apoio fixo, só `Dz` é um apoio móvel. A página [Nós e apoios](/pt/essentials/nodes-supports#supports) lista todos os tipos.

### Como modelo uma treliça? {#how-do-i-make-a-truss}

Desenhe as barras como elementos comuns e libere as duas extremidades de cada uma: marque as duas **Rótulas de extremidade** na aba **Elementos**, ou marque **Rótula no início** e **Rótula no fim** na faixa no topo antes de desenhar as barras com o mouse. Aplique as cargas nos nós. O tutorial [Treliça plana](/pt/tutorials/truss) monta uma passo a passo.

### Como coloco uma rótula em um pórtico? {#how-do-i-put-a-hinge-in-a-frame}

Libere o momento na extremidade do elemento que deve girar livremente: marque a rótula dessa extremidade na aba **Elementos**. Uma rótula pertence à extremidade de um elemento; por isso, num nó em que chegam vários elementos, liberar um deles deixa os outros ligados rigidamente. Veja [Rótulas de extremidade](/pt/essentials/elements#end-hinges).

### Como adiciono um apoio ou uma carga concentrada no meio de uma viga? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Para um apoio, adicione um nó sobre a viga com o mouse (o botão **Adicionar nó** com o ícone de cursor) e escolha **Conectar à estrutura**: a viga é dividida em duas nesse nó, e você pode colocar o apoio ali. Uma carga concentrada não precisa de nó: adicione ao elemento uma **Carga concentrada** e defina a posição a partir do nó inicial. Veja [Posicionar um nó sobre um elemento existente](/pt/essentials/nodes-supports#placing-a-node-on-an-existing-element) e [Carga concentrada](/pt/essentials/loads#concentrated-load).

### Posso aplicar o peso próprio? {#can-i-apply-self-weight}

Não automaticamente: a massa específica do material não é usada na análise estática. Aplique o peso próprio como carga distribuída uniforme $f_z = \rho g A$; para um IPE 200, por exemplo, $7850 \cdot 9{,}81 \cdot 28{,}48 \cdot 10^{-4} = 219$ N/m, ou seja, 0,22 kN/m.

### Posso modelar apoios inclinados? {#can-i-model-inclined-supports}

Sim. Defina um **Ângulo do SCL nodal** no nó, e os apoios dele passam a atuar segundo os eixos girados. Veja [Apoios inclinados](/pt/essentials/nodes-supports#inclined-skewed-supports).

### Posso trabalhar com unidades americanas? {#can-i-work-in-us-customary-units}

Sim. Clique no indicador de unidades, no canto inferior direito da visualização, que abre **Configurações → Idioma e localidade**, e escolha **Americano (imperial)** em **Sistema de unidades** para trabalhar com pés e kips, ou escolha cada unidade separadamente. O modelo é guardado em SI, então trocar as unidades converte o que você vê e nunca altera o modelo. Veja [Unidades e configurações](/pt/essentials/units-settings).

### Existem casos ou combinações de carga? {#are-there-load-cases-or-combinations}

Não, um modelo tem um único caso de carga. Salve cada caso como arquivo ou link próprio e combine os resultados você mesmo. Uma sessão do EduBeam original para desktop com vários casos de carga abre com o primeiro, e uma mensagem informa quais ficaram de fora.

### Por que minhas cargas apontam para cima? {#why-do-my-loads-point-up}

Provavelmente porque você informou um valor negativo. No EduBeam, o eixo global z aponta **para baixo**, então um `fz` ou `Fz` positivo é uma carga para baixo, gravitacional: 12 kN/m para baixo é `fz = 12`. Veja [Sistema de coordenadas e convenções de sinais](/pt/elements/conventions#loads). Se a sua disciplina usa um eixo vertical apontando para cima, mude para **x para a direita, y para cima** em **Configurações → Idioma e localidade → Sistema de coordenadas**: as entradas e os resultados passam a seguir esse eixo.

## Resultados {#results}

### Por que não há um botão “Calcular”? {#why-is-there-no-solve-button}

Porque o modelo é resolvido de novo após cada alteração. Se nenhum resultado aparece, o modelo ainda não pode ser resolvido, e uma mensagem na tela diz por quê. A página [Solução de problemas](/pt/reference/troubleshooting#no-results-are-drawn) lista o que verificar.

### Por que minha flecha difere ligeiramente da fórmula? {#why-does-my-deflection-differ-slightly-from-the-formula}

O EduBeam usa elementos de viga de Timoshenko, então a flecha inclui a deformação por cisalhamento, que as fórmulas dos livros costumam desprezar. Numa viga esbelta a diferença fica em torno de 1 %, e o [Início rápido](/pt/guide/quick-start#_8-check-by-hand) faz essa soma à mão. Numa estrutura hiperestática, a rigidez ao cisalhamento também altera um pouco os esforços internos. Mais detalhes em [Conferir resultados à mão](/pt/guide/verification).

### Quão precisos são os resultados? Preciso de mais elementos? {#how-accurate-are-the-results-do-i-need-more-elements}

Na estática linear, o elemento de viga é exato para todos os tipos de carga que o EduBeam oferece, então um elemento por barra basta e não há malha para refinar. Acrescente nós só onde precisar de um apoio, uma rótula, uma mudança de seção, uma carga nodal ou um deslocamento a ler. Veja [Precisão e exatidão](/pt/essentials/results#precision-and-accuracy).

### Como o EduBeam calcula os resultados? {#how-does-edubeam-compute-the-results}

Pelo método da rigidez direta, a forma do método dos elementos finitos ensinada nas disciplinas de análise estrutural, no seu navegador. A página [Como o EduBeam resolve um modelo](/pt/elements/analysis) acompanha cada passo num exemplo pequeno que você pode refazer à mão, e o próprio solver é de código aberto: a [@edubeam/fem](/pt/solver).

### Posso ver as matrizes de rigidez? {#can-i-see-the-stiffness-matrices}

Sim. Na aba **Elementos**, o botão de matriz na linha de um elemento abre a matriz de rigidez 6 × 6 dele, em eixos globais e unidades SI (N, m). Ao clicar em um elemento na visualização, a opção **Matriz de rigidez** também aparece. A página [Elemento de viga](/pt/elements/beam#global-stiffness-matrix) mostra a dedução.

### Onde as reações são listadas? {#where-are-the-reactions-listed}

Na visualização, como setas com os valores: **Reações** nas opções de exibição, ligadas por padrão. Elas também estão no arquivo gerado por **Resultados → Exportar CSV** e no que **Copiar** coloca na área de transferência. A aba **Resultados** lista os deslocamentos nodais e os esforços de extremidade dos elementos. Veja [Resultados e diagramas](/pt/essentials/results).

## Arquivos e compartilhamento {#files-sharing}

### Como compartilho um modelo? {#how-do-i-share-a-model}

Clique em **Compartilhar modelo** e depois em **Copiar**. O link contém o modelo inteiro, e quem o abre recebe uma cópia própria para editar: não há colaboração em tempo real. Ligue **Mostrar o que eu vejo** para que o link abra com os seus diagramas e rótulos ligados. Veja [Compartilhar um link](/pt/essentials/import-export#share-a-link) e, para disciplinas, [Ensinar com o EduBeam](/pt/guide/teaching#in-lecture-notes-and-assignments).

### Posso incorporar um modelo no meu site ou em slides? {#can-i-embed-a-model-on-my-website-or-in-slides}

Sim. Acrescente `&viewer=1` a um link de compartilhamento e coloque-o em um `<iframe>`: veja [Incorporar um visualizador](/pt/essentials/import-export#embed-a-read-only-viewer). Para uma figura estática numa página, num slide ou em notas impressas, exporte um SVG ou desenhe a figura em código com a [@edubeam/plot](/pt/plot).

### Posso exportar imagens ou tabelas? {#can-i-export-images-or-tables}

Sim. **☰ → Exportar imagem** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) salva o desenho em PNG ou SVG, no tamanho ou na escala que você escolher. **Resultados → Exportar CSV** salva as duas tabelas de resultados, e **Copiar** as coloca na área de transferência para uma planilha. Veja [Exportar uma imagem](/pt/essentials/import-export#export-an-image).

### Posso abrir arquivos do EduBeam para desktop? {#can-i-open-files-from-the-desktop-edubeam}

Sim. As sessões salvas pelo EduBeam original para desktop, versões 2.x a 3.5 (`.xml`), abrem com **☰ → Abrir projeto** ou arrastando o arquivo para o aplicativo, exatamente como um `project.json`. Os valores delas são lidos em kN, kPa e m. Veja [Abrir um projeto](/pt/essentials/import-export#open-a-project).

### Posso gerar modelos por programação? {#can-i-generate-models-programmatically}

Sim, de duas maneiras:

- **Escreva o arquivo.** Um `project.json` é JSON simples em unidades SI, então um script em qualquer linguagem pode gerá-lo, e o EduBeam o abre com **Abrir projeto** ou por arrastar e soltar. Veja o [formato do arquivo de projeto](/pt/essentials/import-export#project-file-format).
- **Resolva em código.** A [@edubeam/fem](/pt/solver) é o solver de elementos finitos do EduBeam, como biblioteca para JavaScript e TypeScript. A [@edubeam/plot](/pt/plot) desenha então o resultado, por exemplo como uma [lista de exercícios gerada](/pt/plot/exercises).

A viga do [Início rápido](/pt/guide/quick-start), em unidades SI:

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // apoio fixo
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // apoio móvel
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, para baixo

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 54000 N·m no meio do vão
beam.computeLocalDefl(lc, 2).w[1] // 0.0502 m no meio do vão
```

## Suporte {#support}

### Como relato um erro ou peço um recurso? {#how-do-i-report-a-bug-or-request-a-feature}

Abra uma issue no [GitHub](https://github.com/janvorisek/edubeam/issues) e anexe um link de compartilhamento ou um arquivo de projeto que mostre o problema. Para perguntas particulares, escreva para [support@edubeam.app](mailto:support@edubeam.app).
