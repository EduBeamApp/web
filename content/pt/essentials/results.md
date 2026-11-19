---
description: "Os resultados do EduBeam: diagramas N, V e M, deformada, reações e seus sinais, valores ao apontar, tabelas, exportação CSV, matriz de rigidez e formato numérico."
source: site
---

# Resultados e diagramas

O [EduBeam]{.edubeam} resolve o modelo depois de cada alteração, então os diagramas, as reações e as tabelas na tela sempre correspondem ao modelo que você está vendo. Não existe botão *Resolver*. Se nada for desenhado, o modelo ainda não pode ser resolvido: a mensagem no canto superior esquerdo da visualização diz por quê, e a página [Solução de problemas](/pt/reference/troubleshooting) explica cada mensagem.

## Diagramas na visualização {#overlays-in-the-viewer}

Os resultados são desenhados sobre o modelo. Ligue-os e desligue-os nas **opções de exibição**, no canto superior direito da visualização; o botão ⚙ acima delas mostra ou oculta o painel.

::model-figure{caption="Pórtico triarticulado, 10 kN/m: alterne entre M, V, N e a forma deformada"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, V, N, w]
show: [nodeLabels]
height: 300
---
::

| Opção | O que desenha | Cor | Ligada de início |
| --- | --- | --- | --- |
| **Forma deformada** | a estrutura deslocada, com os deslocamentos ampliados para ficarem visíveis | cinza | sim |
| **N (x)** | esforço normal | azul | |
| **V<sub>z</sub> (x)** | esforço cortante | verde | |
| **M<sub>y</sub> (x)** | momento fletor | vermelho | sim |
| **Reações** | uma seta e um valor para cada direção restringida | roxo | sim |

Uma segunda linha controla o próprio desenho: **Apoios**, **Cargas**, **Rótulos dos nós** e **Rótulos dos elementos**. **Mais configurações**, abaixo do painel, abre as [configurações de visualização](/pt/essentials/units-settings#viewer-settings), onde você define o tamanho dos diagramas (*Escala de resultados*), as cores, a orientação dos rótulos e o estilo dos diagramas.

Os valores aparecem onde importam: nas extremidades de cada barra, dos dois lados de um salto sob uma carga concentrada ou sobre um apoio, e em cada extremo do diagrama, como o vértice de uma parábola onde $V = 0$. A figura acima mostra o [pórtico triarticulado](/pt/tutorials/three-hinged-frame), que você pode conferir à mão: 40 kN de compressão em cada pilar, 20 kN na viga e −80 kNm nos dois cantos. Na vista *w*, a rótula em C desce 42,55 mm.

### Leitura do sinal {#reading-the-sign}

Leia o sinal pelo **valor**, não pelo lado da barra em que o diagrama está desenhado. As convenções são as da maioria dos livros:

| Resultado | Positivo significa |
| --- | --- |
| **N** | tração |
| **V<sub>z</sub>** | gira um pequeno trecho da barra no sentido horário. Como $V = \mathrm{d}M/\mathrm{d}x$, numa viga biapoiada sob carga gravitacional ele é positivo no apoio da esquerda e negativo no da direita |
| **M<sub>y</sub>** | momento positivo: tração na fibra inferior, do lado da **linha tracejada** desenhada ao longo de cada barra |

Uma viga biapoiada com balanço mostra os dois sinais ao mesmo tempo. Entre os apoios o momento é positivo (+13,5 kNm); sobre o apoio da direita é negativo (−24 kNm), com tração em cima. Em B, o esforço cortante dá um salto igual à reação de 54 kN, de −30 para +24 kN:

::model-figure{caption="Viga biapoiada com balanço, 12 kN/m: momento positivo entre os apoios, negativo sobre B"}
---
nodes: { A: [0, 0], B: [4, 0], C: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

Por padrão, o momento fletor é desenhado do **lado tracionado**, e os esforços normal e cortante positivos do lado oposto à linha tracejada. Aqui cada escola tem seu costume, por isso o lado de cada diagrama pode ser invertido em **Configurações → Configurações de visualização → Diagramas de esforços internos**, onde você também pode hachurar os diagramas como no desenho à mão e indicar em cada trecho o grau do polinômio. Inverter o lado muda apenas o desenho, nunca os valores. As convenções de sinais completas, incluindo os eixos locais do elemento, estão no [manual teórico](/pt/elements/conventions#internal-forces).

## Dicas ao passar o mouse {#hover-tooltips}

Aponte para um objeto para ler seus valores:

- **Nó**: os deslocamentos $u_x$, $u_z$ (na unidade de deslocamento) e a rotação $\varphi_y$ (em radianos).
- **Elemento**: seu rótulo, sua seção e seu material.
- **Carga**: suas componentes.

Numa tela sensível ao toque, toque no objeto: o painel dele mostra os mesmos detalhes.

![Apontando para o nó 2 da viga do Início rápido](/screenshots/pt/ui-hover.webp){.shot-sm}

## Aba Resultados {#results-tab}

A aba **Resultados** da barra inferior tem duas tabelas, alternadas com **Resultados nodais** e **Resultados dos elementos**.

### Resultados nodais {#nodal-results}

Uma linha por nó, com os deslocamentos **D<sub>x</sub>** e **D<sub>z</sub>** (na unidade de deslocamento) e a rotação **R<sub>y</sub>** (em radianos), nos eixos globais: D<sub>z</sub> positivo é para baixo e R<sub>y</sub> positivo é anti-horário na tela. Uma direção com apoio mostra 0, ou o recalque que você prescreveu. As reações não estão nesta tabela: leia-as no desenho ou na [exportação CSV](#export-csv-and-copy).

![Resultados nodais do pórtico triarticulado acima, com o Formato numérico em Automático](/screenshots/pt/p2c-results-nodal.webp){.shot-lg}

### Resultados dos elementos {#element-results}

Uma linha por elemento, com os **esforços de extremidade no sistema de coordenadas local do elemento**:

| Coluna | Significado |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | esforço normal, esforço cortante e momento que atuam sobre o elemento no nó **inicial** |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | o mesmo no nó **final** |

![Resultados dos elementos do pórtico triarticulado: os esforços de extremidade das suas quatro barras](/screenshots/pt/p2c-results-element.webp)

Os esforços de extremidade são as forças que os nós exercem sobre o elemento. Eles seguem os eixos locais, e não a convenção N-V-M dos diagramas, por isso os sinais são diferentes:

- **Viga biapoiada** (6 m, 12 kN/m, a do [Início rápido](/pt/guide/quick-start)): Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. Os dois apoios empurram a viga para cima, que é o sentido −z.
- **Viga em balanço** engastada no nó inicial, com 18 kN para baixo na extremidade livre: Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **Pilar 1 do pórtico** (A embaixo, B em cima): X<sub>12</sub> = +40 kN empurra ao longo do eixo x local para dentro do elemento, ou seja, 40 kN de compressão.

Mais sobre esta tabela no [manual teórico](/pt/elements/conventions#end-forces-element-results-table).

### Exportar CSV e Copiar {#export-csv-and-copy}

**Exportar CSV** baixa o arquivo `edubeam-results.csv` com as duas tabelas, nas unidades mostradas na tela e pronto para uma planilha. **Copiar** coloca as mesmas tabelas na área de transferência como texto separado por tabulações, que você pode colar diretamente no Excel, no LibreOffice ou no Google Planilhas.

| Tabela | Colunas (cabeçalhos em inglês) |
| --- | --- |
| Nós | Node, x, z, Dx, Dz, Ry e as **reações** Rx, Rz, My |
| Elementos | Element, Node 1, Node 2 e os esforços de extremidade N1, V1, M1, N2, V2, M2 |

Cada cabeçalho traz sua unidade, por exemplo `Dz [mm]`. Os esforços de extremidade dos elementos são os mesmos valores locais que X<sub>12</sub> … M<sub>21</sub> na tela.

### Matriz de rigidez {#stiffness-matrix}

Escolha **Matriz de rigidez** no painel de um elemento, ou pelo botão na linha dele na tabela *Elementos*, para abrir a matriz de rigidez 6 × 6 do elemento em **coordenadas globais** e unidades SI (N, m). Ela é útil para conferir a montagem feita à mão numa disciplina sobre o método da rigidez; as fórmulas estão no [manual teórico](/pt/elements/beam).

## Formato numérico {#number-format}

As tabelas e as dicas mostram os resultados com cinco algarismos significativos. **Configurações → Idioma e localidade → Formato numérico** define como eles são escritos:

| Formato | 40 000 aparece como | Use para |
| --- | --- | --- |
| **Científico** (padrão) | 4 · 10⁴ | valores que abrangem muitas ordens de grandeza |
| **Engenharia** | 40 · 10³ | ler diretamente os prefixos quilo e mega |
| **Automático** | 40.000 | os números do dia a dia no ensino |

*Automático* escreve os valores de 0,001 a 100 000 como números simples. Fora desse intervalo, escreve-os como *Engenharia*, com potências de dez de três em três, como 380,95 · 10⁻⁹ nos resultados nodais acima. O separador decimal acompanha o idioma.

Os rótulos no desenho (valores dos diagramas e reações) têm sempre duas casas decimais, qualquer que seja o formato numérico: 6,6667 kN aparece como 6,67. Consulte as tabelas ou as dicas quando precisar de mais algarismos.

## Precisão e exatidão {#precision-and-accuracy}

- O elemento de viga é exato para o modelo linear de Timoshenko sob cargas nodais, uniformes, trapezoidais, concentradas e térmicas. Os resultados **não** dependem do número de elementos, e não há malha para refinar.
- O cálculo é feito em dupla precisão. Um valor menor que um trilionésimo do maior valor do mesmo tipo é erro de arredondamento, e as tabelas o mostram como 0.
- As flechas incluem a **deformação por cisalhamento**, que numa estrutura hiperestática também altera ligeiramente os esforços. Em barras esbeltas, ela acrescenta uma fração de um por cento à flecha de Euler–Bernoulli; em barras curtas e altas, pode chegar a dez por cento ou mais. A página [Conferir resultados à mão](/pt/guide/verification#shear-deformation) mostra o tamanho do efeito e como desligá-lo para comparar com as fórmulas dos livros.

## Resultados em um relatório {#results-in-a-report}

- **☰ → Exportar imagem** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) salva o desenho em PNG ou SVG com os diagramas que você escolher. Veja [Exportar uma imagem](/pt/essentials/import-export#export-an-image).
- **Exportar CSV** ou **Copiar**, na aba Resultados, fornecem os números.
- **Compartilhar modelo** fornece um link, para que o leitor possa abrir o próprio modelo.
- Para notas de aula e listas de exercícios, a biblioteca de desenho [@edubeam/plot](/pt/plot) traça os mesmos diagramas a partir de código.
