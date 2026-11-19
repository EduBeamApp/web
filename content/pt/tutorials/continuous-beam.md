---
description: "Tutorial: viga contínua de dois vãos no EduBeam, comparada com dois vãos biapoiados, com recalque do apoio central e conferida pelo método das forças. Cerca de 25 minutos."
source: site
---

# Tutorial: viga contínua e recalque de apoio

Modele uma viga contínua de dois vãos, compare-a com dois vãos biapoiados e depois faça o apoio central recalcar 10 mm. O equilíbrio sozinho não fornece as reações desta viga, então você vai conferi-las pelo método das forças.

- **Tempo:** cerca de 25 minutos. Este é o último e o mais completo dos quatro tutoriais.
- **Você precisa de:** o EduBeam aberto em uma segunda aba, em um computador com mouse e teclado. Se ainda não usou o EduBeam, faça antes o [Início rápido](/pt/guide/quick-start) ou um dos tutoriais anteriores.
- **Pré-requisitos:** o método das forças com uma incógnita hiperestática e as flechas no meio do vão de uma viga biapoiada, $5qL^4/(384EI)$ sob carga uniforme e $FL^3/(48EI)$ sob carga concentrada.
- **Unidades:** SI. O indicador de unidades, no canto inferior direito da visualização, deve mostrar `m m² kN kNm MPa`. Se aparecerem pés e kips, clique nele e escolha **SI (métrico)** em **Sistema de unidades**.

**Você vai aprender a**

- ver o que a continuidade traz: momentos e flechas menores que em vãos biapoiados,
- prescrever um recalque de apoio e ler os esforços que ele provoca sozinho,
- conferir uma viga hiperestática pelo método das forças e entender por que uma viga mais rígida sofre mais com um recalque.

::div{.actions}
[Abrir o EduBeam ↗](https://run.edubeam.app/?lang=pt){target="_blank"} [Ir para a verificação à mão](#check-by-hand)
::

::model-figure{caption="A viga pronta: dois vãos de 6 m sob 10 kN/m, antes do recalque"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels, dimensions]
---
::

## O problema {#the-problem}

- Dois vãos de $L = 6$ m: um apoio fixo (de segundo gênero) no nó 1 e apoios móveis (de primeiro gênero) nos nós 2 e 3.
- Uma carga uniforme $q = 10$ kN/m nos dois vãos.
- Aço, $E = 210$ GPa, e $I_y = 8{,}356 \times 10^{-5}$ m⁴ (um IPE 300), portanto $EI = 17\,547{,}6$ kNm².
- Na segunda parte, o apoio central, nó 2, recalca $\Delta = 10$ mm.

**É isostática?** Quatro reações (duas no nó 1 e uma em cada um dos nós 2 e 3) contra três equações de equilíbrio: a viga é uma vez hiperestática. A equação que falta vem da deformação: o nó 2 não se desloca, ou se desloca exatamente $\Delta$.

## Monte o modelo {#model-it}

::div{.steps}

### Material e seção {#material-and-section}

1. Clique em **Limpar estrutura** na barra superior, marque **Excluir materiais** e **Excluir seções** e clique em **Confirmar**. A numeração dos nós e dos elementos recomeça do 1.
2. Aba **Materiais** → **Biblioteca de materiais** → **+** na linha **Aço (S235)**; depois feche a biblioteca com **Cancelar**.
3. Aba **Seções** → **Adicionar seção**. Digite `8,356e-5` em **Iy**, mantenha **Área**, **Altura** e **Coeficiente de cisalhamento** em `1` e clique em **Adicionar seção**.

Uma área de 1 m² impede que a viga se deforme por cisalhamento de forma perceptível, como supõe o cálculo à mão. Desta vez, $I_y$ também influi nos esforços: você vai ver onde.

### Desenhe a viga {#draw-the-beam}

1. Aba **Elementos** → o segundo botão **Adicionar elemento**, o do ícone de cursor.
2. Clique em (0, 0), (6, 0) e (12, 0).
3. Pressione <kbd>Esc</kbd> para parar de desenhar e depois <kbd>F</kbd> para ajustar a vista.

Três nós e dois elementos. Confira as coordenadas na tabela **Nós**.

### Apoios {#supports}

Clique no nó 1 → **Apoios do nó** → o símbolo **Apoio fixo**. Dê aos nós 2 e 3 o **Apoio móvel**.

### Carga {#load}

Aba **Cargas** → **Adicionar carga de elemento** → *Carga distribuída uniforme* no **Elemento** `1`, `fz = 10` → **Adicionar carga de elemento**. Repita para o elemento 2.

::

## Resultados {#results}

O momento fletor, as reações e a forma deformada já vêm ligados. Para ver o esforço cortante, marque **V<sub>z</sub> (x)** nas opções de exibição, no canto superior direito da visualização (a engrenagem as mostra e oculta). O EduBeam indica os diagramas e as reações em kN e kNm com duas casas decimais.

- As reações mostram `22,50` nos nós 1 e 3 e `75,00` no nó 2: o apoio central recebe mais da metade dos 120 kN.
- O momento sobre o nó 2 mostra `-45,00`, momento negativo. Nos vãos, o momento positivo chega no máximo a `25,31` kNm, a 2,25 m dos apoios extremos.
- O esforço cortante salta de `-37,50` para `37,50` sobre o nó 2.

### Compare com dois vãos biapoiados {#compare-with-two-simple-spans}

O que a continuidade traz? Interrompa-a: na tabela **Elementos**, marque a rótula do **fim** do elemento 1, no nó 2. A viga vira dois vãos biapoiados de 6 m, uma estrutura isostática.

::model-figure{caption="Com uma rótula sobre o nó 2: dois vãos biapoiados, cada um com qL²/8 = 45 kNm"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [{ nodes: [1, 2], hinges: [false, true] }, [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

| | Contínua | Dois vãos biapoiados |
| --- | --- | --- |
| Reações nos nós 1, 2, 3 | 22,5; 75; 22,5 kN | 30; 60; 30 kN |
| Momento sobre o nó 2 | −45 kNm | 0 |
| Maior momento positivo | 25,31 kNm | 45 kNm |
| Maior flecha, na vista $w(x)$ das figuras | 4,000 mm | 9,617 mm |

O maior momento continua sendo 45 kNm, mas na viga contínua ele passa para cima do apoio, e os momentos nos vãos ficam bem menores. Cada vão também fica 2,4 vezes mais rígido: a sua extremidade sobre o nó 2 não pode girar, quase como se estivesse engastada. Desmarque a rótula de novo antes de continuar.

## Faça o apoio central recalcar {#settle-the-middle-support}

Agora faça o nó 2 afundar 10 mm, como poderia acontecer com uma fundação em solo mole.

::div{.steps}

### Prescreva o recalque {#prescribe-the-settlement}

Clique no nó 2 → **Prescrever deslocamento**. No diálogo, **Deslocamento prescrito** já vem escolhido; digite `0,01` em **Dz** e clique em **Adicionar carga nodal**.

![O diálogo de deslocamento prescrito: só é possível definir Dz, a direção que o apoio móvel restringe](/screenshots/pt/p2t-prescribe-displacement.webp){.shot-sm}

Nas unidades SI padrão, os deslocamentos são dados em metros, então 10 mm são `0,01`; o sentido positivo é para baixo. Só as direções restringidas podem ser definidas: um apoio móvel pode ser deslocado para baixo, mas não para o lado. Mais detalhes em [Deslocamentos prescritos](/pt/essentials/loads#prescribed-displacements-support-settlements).

### Leia os novos resultados {#read-the-new-results}

A reação central cai para `70,13` kN, e as reações extremas sobem para `24,94` kN. O momento sobre o nó 2 diminui para `-30,38` kNm, e o momento positivo nos vãos aumenta, até `31,09` kNm.

::model-figure{caption="O nó 2 recalcou 10 mm: o momento negativo sobre ele diminui, e os vãos recebem mais"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

### Veja o recalque sozinho {#look-at-the-settlement-alone}

Exclua as duas cargas de elemento: selecione cada uma e pressione <kbd>Delete</kbd>, ou use o × na linha dela na tabela **Cargas**. O que sobra é o efeito do recalque sozinho: um momento triangular de `14,62` kNm sobre o nó 2, positivo, e reações que puxam o nó 2 **para baixo** com `4,87` kN, enquanto os nós 1 e 3 empurram para cima com `2,44` kN cada. A viga resiste a ser fletida na forma recalcada, e essa resistência é tudo o que a solicita.

::model-figure{caption="Só o recalque: nenhuma carga, e mesmo assim a viga está fletida e os apoios reagem"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, w]
show: [nodeLabels]
---
::

Some isso aos resultados sob a carga sozinha e você obtém a viga recalcada sob carga: 75 − 4,87 = 70,13 kN, −45 + 14,62 = −30,38 kNm. A análise é linear, então os efeitos se superpõem.

### Interrompa a continuidade de novo {#cut-the-continuity-again}

Traga as cargas de volta com <kbd>Ctrl</kbd>+<kbd>Z</kbd>, uma vez para cada carga excluída, e marque de novo a rótula do fim do elemento 1. Os vãos recalcados agora apenas se inclinam: as reações e os momentos são exatamente os de dois vãos biapoiados, qualquer que seja o recalque, e sem as cargas seriam nulos. **Um recalque só provoca esforços internos em uma estrutura hiperestática.** Desmarque a rótula antes de continuar.

::

## Confira à mão {#check-by-hand}

Use o método das forças. Retire o apoio do nó 2 e substitua-o pela sua reação desconhecida $R_2$, que atua para cima em uma viga biapoiada de vão $2L = 12$ m.

**Flechas da viga liberada no nó 2.** Sob a carga e sob uma força unitária para cima no nó 2:

$$
\delta_q = \frac{5q\,(2L)^4}{384\,EI} = \frac{5 \cdot 10 \cdot 12^4}{384 \cdot 17\,547{,}6} = 0{,}15387\ \text{m}
$$

$$
\delta_{1} = \frac{(2L)^3}{48\,EI} = \frac{12^3}{48 \cdot 17\,547{,}6} = 0{,}0020516\ \text{m/kN}
$$

**Compatibilidade.** $R_2$ precisa empurrar o nó 2 de volta para cima até ele ficar onde está o apoio: em zero, ou $\Delta$ abaixo.

$$
R_2\,\delta_1 = \delta_q - \Delta \quad\Rightarrow\quad R_2 = \frac{\delta_q - \Delta}{\delta_1}
$$

**Todo o resto** sai do equilíbrio; o maior momento positivo fica onde o cortante $R_1 - qx$ se anula.

| | Fórmula | Sem recalque | Nó 2 recalcado 10 mm |
| --- | --- | --- | --- |
| $R_2$ | $(\delta_q - \Delta)/\delta_1$ | 75,00 kN | 70,13 kN |
| $R_1 = R_3$ | $(2qL - R_2)/2$ | 22,50 kN | 24,94 kN |
| $M_2$ | $R_1 L - qL^2/2$ | −45,00 kNm | −30,38 kNm |
| $M_{\max}$ | $R_1^2/(2q)$ | 25,31 kNm | 31,09 kNm |

O EduBeam mostra os mesmos valores até o último algarismo.

Sem recalque, esses são os valores clássicos dos livros: $R_2 = 10qL/8$, $M_2 = -qL^2/8$ e $M_{\max} = 9qL^2/128$. O recalque sozinho altera as reações em $\Delta/\delta_1 = 4{,}874$ kN e o momento sobre o nó 2 em

$$
\Delta M_2 = \frac{\Delta}{\delta_1} \cdot \frac{2L}{4} = \frac{3\,EI\,\Delta}{L^2} = \frac{3 \cdot 17\,547{,}6 \cdot 0{,}01}{36} = 14{,}62\ \text{kNm}
$$

Repare no $EI$ da fórmula. Os esforços causados por uma carga dependem apenas da rigidez das barras *umas em relação às outras*; os esforços causados por um deslocamento imposto crescem com a própria rigidez. Sobre um apoio que recalca, uma viga mais rígida atrai momentos maiores.

## Experimente {#experiment}

Parta da viga recalcada sob carga, mude uma coisa de cada vez, preveja o resultado e só então confira. <kbd>Ctrl</kbd>+<kbd>Z</kbd> desfaz cada alteração.

**Dobre a rigidez.** Na tabela **Seções**, altere **Iy** para `1,6712e-4`. O efeito do recalque no momento sobre o nó 2 dobra, para 29,25 kNm, e $M_2$ cai para −15,75 kNm. Sob a carga sozinha nada mudaria além das flechas, que cairiam à metade.

**Encontre o recalque que libera o nó 2.** Para qual $\Delta$ o momento sobre o nó 2 é nulo? $\Delta M_2 = 45$ kNm exige $\Delta = 45 L^2/(3EI) = qL^4/(24EI) = 0{,}0308$ m. Altere o recalque para `0,0308`, na tabela **Cargas** ou com um clique duplo sobre ele na visualização: as reações passam a 30, 60 e 30 kN, as de dois vãos biapoiados, a menos do arredondamento de $\Delta$. $qL^4/(24EI)$ é a rotação na extremidade de um vão biapoiado multiplicada por $L$: o recalque inclina cada vão exatamente o necessário para fechar o ângulo sobre o nó 2, e a continuidade não tem mais nada a fazer.

**Solte o nó 2.** Altere o recalque para `0,1539`, a flecha $\delta_q$ da viga liberada de 12 m. A reação no nó 2 cai praticamente a zero, e a viga resiste à carga como um único vão biapoiado: 180 kNm no meio do vão. Um apoio que recalca tanto já não é um apoio.

**Levante o nó 2.** Altere o recalque para `-0,01`, 10 mm para cima. Todas as alterações causadas pelo recalque trocam de sinal: o nó 2 agora recebe 79,87 kN, e o momento negativo aumenta para −59,62 kNm.

Mais verificações com solução analítica, entre elas o recalque de uma viga engastada e apoiada, estão em [Conferir resultados à mão](/pt/guide/verification#prescribed-displacement).

## Próximos passos {#next-steps}

::card-grid{cols="2"}
:::card{title="Praticar: vigas contínuas" icon="lucide:dices" to="/pt/practice?p=K2049"}
Vigas de dois vãos carregadas em um vão ou nos dois, resolvidas pelo método das forças, com as suas respostas conferidas na hora. Comece pelo exercício K2049; para mais, deixe selecionada apenas **Viga contínua de dois vãos** e clique em **Novo exercício**.
:::
:::card{title="Galeria de exemplos" icon="lucide:library" to="/pt/examples/"}
Este foi o último tutorial. A galeria de exemplos tem mais modelos para abrir, modificar e conferir, e exercícios para passar aos alunos.
:::
::
