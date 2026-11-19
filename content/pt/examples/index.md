---
description: "Seis vigas, pórticos e treliças resolvidos que abrem no EduBeam com um clique, cada um com exercícios, o que observar e respostas para conferir o cálculo à mão."
source: site
---

# Exemplos

Cada cartão abaixo é um modelo interativo, já resolvido. Clique em um para abri-lo no [EduBeam]{.edubeam}, pronto para editar: arraste um nó, mude uma carga ou marque uma rótula e veja os diagramas acompanharem. Os exercícios mais abaixo transformam cada modelo num pequeno estudo, com respostas para você conferir o seu cálculo à mão.

::feature-structures
::

Os mesmos modelos estão no aplicativo em **☰ → Exemplos**, e [run.edubeam.app/?panel=examples&lang=pt](https://run.edubeam.app/?panel=examples&lang=pt){target="_blank"} abre essa galeria diretamente.

::callout{type="info" title="Uma só barra para os seis exemplos"}
Todos os exemplos usam a mesma barra de aço: $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (portanto $EI = 17\,548$ kNm²), área de $1\ \text{m}^2$ e uma rigidez ao cisalhamento tão grande que as deformações axial e por cisalhamento são desprezíveis. Por isso, as fórmulas dos livros para vigas esbeltas coincidem com o aplicativo em todos os dígitos mostrados. A altura da seção é $1$ m, o que só importa para a carga térmica.
::

## Exercícios sugeridos {#suggested-exercises}

Resolva primeiro à mão e depois confira no aplicativo: abra o modelo pelo cartão acima ou pelo botão **Abrir no EduBeam** abaixo da figura. Abrir um modelo substitui o que você tem aberto; <kbd>Ctrl</kbd>+<kbd>Z</kbd> traz o seu de volta, e ele também fica guardado em **☰ → Estruturas recentes**.

### Viga hiperestática {#exercise-indeterminate-beam}

Uma viga de 3 m, engastada em A e com apoio móvel em B, sob 10 kN/m.

::model-figure{caption="Engaste em A, apoio móvel em B, 10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Determine à mão as reações e o momento no engaste, pelo método das forças ou com uma tabela de momentos de engastamento perfeito.
2. Desmarque `Ry` em A para tornar a viga biapoiada. Como muda o maior momento?
3. Marque `Ry` em A de novo, e também em B, para engastar as duas extremidades.

**Observe** onde o diagrama de momento fletor muda de sinal e como o engaste absorve uma parcela maior da carga que o apoio móvel.

::callout{type="details" title="Respostas"}
- Engastada e apoiada: $R_A = 5qL/8 = 18{,}75$ kN, $R_B = 3qL/8 = 11{,}25$ kN, $M_A = qL^2/8 = 11{,}25$ kNm, negativo (tração em cima). O maior momento positivo é $9qL^2/128 = 6{,}33$ kNm, a 1,125 m de B, onde o esforço cortante se anula.
- Biapoiada: $qL^2/8 = 11{,}25$ kNm no meio do vão, o mesmo valor que o engaste recebia antes.
- Biengastada: $qL^2/12 = 7{,}5$ kNm negativo nas extremidades e $qL^2/24 = 3{,}75$ kNm positivo no meio do vão.
::

### Viga em balanço {#exercise-cantilever}

Uma viga em balanço de 4 m, engastada em A, com 18 kN para baixo na extremidade livre B.

::model-figure{caption="Viga em balanço, 18 kN na extremidade livre"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Determine o momento no engaste, a flecha e a rotação na extremidade livre. Compare-os com o nó B em **Resultados → Resultados nodais**.
2. Reduza $I_y$ à metade na aba **Seções**. O que muda e o que não muda?
3. Substitua a carga concentrada por uma carga uniforme de 4,5 kN/m, com os mesmos 18 kN no total: exclua a carga nodal na aba **Cargas** e use **Adicionar carga de elemento**.

**Observe** a forma do diagrama de momento fletor: uma reta sob a carga concentrada, uma parábola sob a carga uniforme.

::callout{type="details" title="Respostas"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21{,}88$ mm, $\varphi_B = FL^2/(2EI) = 8{,}21$ mrad.
- Com metade do $I_y$, a flecha dobra para 43,77 mm. O momento continua 72 kNm: a viga em balanço é isostática, então seus esforços não dependem da rigidez.
- Carga uniforme: $M_A = qL^2/2 = 36$ kNm e $w_B = qL^4/(8EI) = 8{,}21$ mm. A mesma carga total dá metade do momento e três oitavos da flecha.
::

### Treliça Warren {#exercise-pratt-truss}

Uma treliça com 9 m de vão e 1,8 m de altura, com 8 kN em cada um dos três nós superiores E, F e G. Marque **N(x)** nas opções de exibição para ver os esforços normais. (Com diagonais alternadas e sem montantes, sua configuração é a que a maioria dos livros chama de treliça Warren.)

::model-figure{caption="Nós A a G, 8 kN em E, F e G"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. Determine as reações e, em seguida, os esforços na diagonal de extremidade A–E e no banzo inferior A–B pelo método dos nós.
2. Determine o esforço no banzo superior do painel central e o esforço no banzo inferior B–C pelo método das seções.
3. Os nós deste modelo são rígidos. Marque as duas rótulas de extremidade de todas as barras na aba **Elementos** para obter uma treliça de nós rotulados e compare os esforços normais.
4. Exclua a diagonal B–F, primeiro com nós rígidos e depois com rótulas. A treliça ainda se sustenta?

**Observe** o padrão dos sinais: banzo superior comprimido, banzo inferior tracionado e diagonais alternando entre tração e compressão.

::callout{type="details" title="Respostas"}
- Reações: 12 kN em A e em D.
- Diagonais de extremidade: 15,62 kN de compressão. Banzos inferiores A–B e C–D: 10,00 kN de tração.
- Banzos superiores E–F e F–G: 13,33 kN de compressão (momentos em relação a B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$). Banzo inferior B–C: 16,67 kN de tração (momentos em relação a F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$). Diagonais internas: 5,21 kN, tracionadas as que descem de E e de G até o banzo inferior e comprimidas as que sobem até F.
- Nós rígidos e rotulados dão os mesmos esforços normais, com diferença inferior a 0,1 %. A flexão numa treliça triangulada é desprezível, e é por isso que o modelo de nós rotulados funciona.
- Sem B–F, a treliça de nós rígidos ainda se sustenta por efeito de pórtico, com momentos fletores de cerca de 3 kNm. Com rótulas, falta uma barra: ela vira um mecanismo, e o EduBeam mostra como ela pode se mover.
::

### Viga contínua de três vãos {#exercise-three-span-continuous-beam}

Uma viga de 16 m com vãos de 5 + 6 + 5 m: 8 kN/m no primeiro vão, 20 kN em C e 6 kN/m no último vão. Quando o modelo abre, só A e D estão apoiados.

::model-figure{caption="Como o modelo abre: apoiado apenas em A e D"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Ao abrir, o modelo é uma única viga biapoiada de 16 m. Determine as reações e os momentos em B e C.
2. Marque `Dz` em B e em C para torná-la uma viga contínua sobre quatro apoios.
3. Determine os momentos sobre B e C com a equação dos três momentos e, depois, as reações.

**Observe** os momentos negativos que surgem sobre os apoios internos, o quanto todos os momentos diminuem e o que acontece com a carga de 20 kN quando C passa a ser um apoio.

::callout{type="details" title="Respostas"}
- Biapoiada: $R_A = 44{,}69$ kN, $R_D = 45{,}31$ kN, $M_B = 123{,}4$ kNm e $M_C = 151{,}6$ kNm, ambos positivos.
- Contínua, com $M_A = M_D = 0$:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  dão $M_B = -9{,}766$ kNm e $M_C = -5{,}859$ kNm, negativos. Os 20 kN em C vão direto para o apoio e não fletem nada.
- Reações: A 18,05 kN, B 22,60 kN, C 35,52 kN (incluindo os 20 kN), D 13,83 kN. A soma dá os 90 kN de carga.

::model-figure{caption="A viga contínua sobre quatro apoios"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### Pórtico {#exercise-portal-frame}

Um pórtico com viga de 8 m sobre dois pilares de 6 m, engastado em A e com apoio móvel em D. A viga recebe 10 kN/m, e o canto superior C recebe 8 kN para a esquerda e 10 kN para baixo.

::model-figure{caption="Engaste em A, apoio móvel em D: 10 kN/m na viga, 8 kN e 10 kN em C"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Qual é o grau de hiperestaticidade do pórtico?
2. Desmarque `Ry` em A para transformar A num apoio fixo. Agora o pórtico é isostático: determine à mão as reações e os momentos nos cantos B e C.
3. Marque `Ry` em A de novo e depois marque `Dx` em D para transformá-lo num apoio fixo. Observe o deslocamento lateral da viga na deformada.

**Observe** para que lado o topo do pórtico se desloca. No modelo tal como abre, o topo vai para a direita, contra a carga de 8 kN. Por quê?

::callout{type="details" title="Respostas"}
- Quatro reações (três no engaste e uma no apoio móvel) e três equações de equilíbrio: uma vez hiperestático. Com D também fixo, duas vezes.
- Apoio fixo em A: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN para a direita. O momento no canto B é $8 \cdot 6 = 48$ kNm. Em C, ele é nulo: sem reação horizontal em D, o pilar direito recebe apenas um esforço normal de 44 kN.
- No modelo tal como abre, o topo se desloca 9,5 mm para a direita: o momento da viga carregada flete o pilar engastado mais do que os 8 kN. Com D fixo, D absorve 4,9 kN na horizontal, e o topo se desloca 4,8 mm para a esquerda.
::

### Carga térmica {#exercise-temperature-load}

Uma viga biapoiada de 8 m, aquecida em $\Delta T_c = 20$ K ao longo do eixo, com a face inferior 10 K mais fria que a superior ($\Delta T_b - \Delta T_t = -10$ K).

::model-figure{caption="Viga biapoiada de 8 m, aquecida em 20 K, com a face inferior 10 K mais fria que a superior"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. Antes de olhar: que esforços internos a variação de temperatura provoca, e como a viga se move?
2. Marque `Dx` em B para impedir que a viga se alongue.
3. Marque também `Ry` nas duas extremidades.

**Observe** a deformada e os números em **Resultados → Resultados nodais**: a viga se move sem nenhum esforço interno até que você a restrinja.

::callout{type="details" title="Respostas"}
- Uma viga isostática pode se dilatar e fletir livremente, então não há esforços internos. B desliza para fora $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1{,}92$ mm. A face inferior, mais fria, encurta, e a viga se curva para cima com curvatura $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1{,}2 \cdot 10^{-4}$ 1/m: as extremidades giram $\kappa L/2 = 0{,}48$ mrad e o meio do vão sobe $\kappa L^2/8 = 0{,}96$ mm.
- Com as duas extremidades impedidas em x: $N = -EA\alpha\Delta T_c = -50\,400$ kN, compressão. O valor vem da área fictícia de 1 m²; um IPE 200 com 28,48 cm² receberia 143,5 kN.
- Com as duas extremidades engastadas: um momento constante $EI\alpha(\Delta T_b - \Delta T_t)/h = 2{,}11$ kNm ao longo de toda a viga.
::

## Tutoriais resolvidos {#worked-tutorials}

Modelos maiores, montados passo a passo e conferidos à mão:

::card-grid{cols="2"}
:::card{title="Viga inclinada" icon="lucide:move-diagonal" to="/pt/tutorials/inclined-beam"}
Uma viga inclinada de cobertura sob neve: cargas por metro em planta, esforços normal e cortante ao longo da inclinação e um apoio móvel girado.
:::
:::card{title="Pórtico triarticulado" icon="lucide:triangle" to="/pt/tutorials/three-hinged-frame"}
Reações, N, V e M de um pórtico com uma rótula interna.
:::
:::card{title="Treliça plana" icon="lucide:git-fork" to="/pt/tutorials/truss"}
O método dos nós, o método das seções, uma barra de esforço nulo e um deslocamento pelo princípio dos trabalhos virtuais.
:::
:::card{title="Viga contínua e recalque de apoio" icon="lucide:spline" to="/pt/tutorials/continuous-beam"}
Uma viga de dois vãos resolvida pelo método das forças e depois com um recalque de 10 mm no apoio central.
:::
::

Para mais verificações com soluções analíticas, veja [Conferir resultados à mão](/pt/guide/verification).

## Mais exercícios {#more-problems}

A página [Exercícios de estática](/pt/practice) gera uma viga, um pórtico ou uma treliça com números novos sempre que você pedir e confere na hora as suas reações e o maior momento ou esforço na barra. Para uma turma, o [gerador de provas](/pt/exam) imprime uma prova diferente para cada aluno, com o gabarito, e a biblioteca [@edubeam/plot](/pt/guide/teaching#exercise-sheets-tests-and-slides-from-code) cria listas de exercícios a partir de código.

## Contribua com um exemplo {#contribute-an-example}

Tem um bom modelo didático? Compartilhe o link dele no [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions), e talvez o adicionemos à galeria.
