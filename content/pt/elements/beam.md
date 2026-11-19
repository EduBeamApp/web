---
description: "O elemento de viga de Timoshenko do EduBeam: rigidez exata, deformação por cisalhamento, rótulas por condensação, esforços de engastamento, transformação."
source: site
---

# Elemento de viga

Toda barra no EduBeam, seja viga, pilar ou barra de treliça, é o mesmo elemento: uma **viga de Timoshenko** reta, de dois nós, no plano x–z e com seção constante. Esta página apresenta a formulação exatamente como o solver a calcula, para que você possa refazer à mão qualquer matriz de elemento ou vetor de cargas e conferi-lo com o aplicativo. Os sinais seguem a página [Sistema de coordenadas e convenções de sinais](/pt/elements/conventions), o código é o `Beam2D.ts` da biblioteca [@edubeam/fem](/pt/solver), e [Como o EduBeam resolve um modelo](/pt/elements/analysis) mostra como os elementos se juntam numa solução.

## Graus de liberdade {#degrees-of-freedom}

Cada nó tem três graus de liberdade (GLs); o elemento tem, portanto, seis. Nos [eixos locais](/pt/elements/conventions#element-local-axes) do elemento, a cada deslocamento de extremidade corresponde um [esforço de extremidade](/pt/elements/conventions#end-forces-element-results-table), que é uma coluna da tabela *Resultados dos elementos*:

::element-sketch{mode="dofs" caption="Os seis graus de liberdade do elemento de viga, todos desenhados no sentido positivo; a linha tracejada marca as fibras inferiores (+z local)"}
::

| Direção | Nó inicial (1) | Nó final (2) |
| --- | --- | --- |
| ao longo do x local | $u_1$ e `X12` | $u_2$ e `X21` |
| ao longo do z local, para baixo num elemento desenhado da esquerda para a direita | $w_1$ e `Z12` | $w_2$ e `Z21` |
| rotação, no sentido anti-horário | $\varphi_1$ e `M12` | $\varphi_2$ e `M21` |

Nessa ordem, eles formam os vetores de deslocamentos e de esforços do elemento:

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

Como z aponta para baixo e as rotações são positivas no sentido anti-horário, o eixo de uma viga sem deformação por cisalhamento gira de $\varphi = -\,\mathrm{d}w/\mathrm{d}x$.

## Matriz de rigidez local {#local-stiffness-matrix}

Os esforços de extremidade de um elemento sem cargas de elemento são $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$, com

$$
\mathbf{K}_l =
\begin{bmatrix}
 k_N & 0 & 0 & -k_N & 0 & 0 \\
 0 & k_1 & -k_2 & 0 & -k_1 & -k_2 \\
 0 & -k_2 & k_3 & 0 & k_2 & k_4 \\
 -k_N & 0 & 0 & k_N & 0 & 0 \\
 0 & -k_1 & k_2 & 0 & k_1 & k_2 \\
 0 & -k_2 & k_4 & 0 & k_2 & k_3
\end{bmatrix}
$$

e

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ e $G$ são o módulo de elasticidade (de Young) e o módulo de cisalhamento do material, $A$ é a área, $I_y$ o momento de inércia em relação a y, $k$ o **Coeficiente de cisalhamento** da seção e $L$ o comprimento do elemento. $\Phi$ é o **parâmetro de cisalhamento**: mede o quanto a barra é flexível ao cisalhamento em comparação com a flexão e cresce à medida que a barra fica mais curta e mais alta. Com $\Phi = 0$, os termos voltam a ser os conhecidos $12EI/L^3$, $6EI/L^2$, $4EI/L$ e $2EI/L$ da viga de Euler–Bernoulli. Os comportamentos axial e de flexão são desacoplados: $u_1$ e $u_2$ só se combinam com $k_N$.

Os livros que usam o eixo y para cima trazem $+6EI/L^2$ onde esta matriz tem $-k_2$. As duas descrevem a mesma rigidez; muda apenas o sentido do deslocamento transversal.

::callout{type="details" title="De onde vem a matriz: as funções de forma exatas"}
Para uma barra prismática de Timoshenko sem carga, as equações de equilíbrio têm solução exata: $u$ é linear em $x$, $w$ é cúbico e $\varphi$ é quadrático. Escrita em função dos deslocamentos de extremidade, com $\xi = x/L$, a flecha é

$$
w(\xi) = N_1\,w_1 + N_2\,\varphi_1 + N_3\,w_2 + N_4\,\varphi_2,
$$

$$
\begin{aligned}
N_1 &= \frac{(1-\xi)\,(1+\Phi+\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_2 &= -\frac{L\,\xi\,(1-\xi)\,(2+\Phi-2\xi)}{2\,(1+\Phi)}, \\[1ex]
N_3 &= \frac{\xi\,(\Phi+3\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_4 &= \frac{L\,\xi\,(1-\xi)\,(\Phi+2\xi)}{2\,(1+\Phi)}.
\end{aligned}
$$

Para $\Phi = 0$, essas funções são os polinômios cúbicos de Hermite, $N_1 = 1 - 3\xi^2 + 2\xi^3$ e $N_2 = -L\,\xi(1-\xi)^2$, com o sinal negativo vindo de $\varphi = -w'$. A matriz de rigidez reúne os esforços de extremidade que essas formas exatas exigem; por isso, ela é a rigidez exata da barra, e não uma aproximação que melhora com mais elementos. O solver desenha a deformada com as mesmas funções.
::

## Deformação por cisalhamento: Timoshenko ou Euler–Bernoulli? {#timoshenko-or-euler-bernoulli}

Se o elemento se deforma ou não por cisalhamento depende apenas de $\Phi$ e, portanto, do coeficiente de cisalhamento $k$ da seção: $kA$ é a área que resiste ao cisalhamento. Cada tipo de seção começa com seu próprio $k$:

| Seção | Coeficiente de cisalhamento $k$ |
| --- | --- |
| O modelo inicial e os exemplos do aplicativo | $10^{32}$, o que dá $\Phi \approx 0$: Euler–Bernoulli |
| Perfis I, H e de abas largas da biblioteca | $h\,t_w / A$: a alma resiste ao cisalhamento |
| Perfis tubulares retangulares da biblioteca | $2\,h\,t / A$: as duas paredes laterais |
| Retângulos e quadrados da biblioteca | 0,833 |
| Círculos da biblioteca | 0,9 |
| Perfis tubulares circulares da biblioteca | 0,5 |
| Seções poligonais | 0,833 inicialmente |
| Diálogo **Adicionar seção** | 1 inicialmente |

Numa barra esbelta, a diferença é pequena. Sob carga uniforme, o cisalhamento acrescenta $0{,}8\,\Phi$ à flecha de flexão no meio do vão de uma viga biapoiada. Num perfil IPE 200 de aço, isso representa 1,2 % num vão de 6 m, mas 11 % num vão de 2 m. Para desligar a deformação por cisalhamento, defina $k$ como um número muito grande, por exemplo `1e32`. Salvo indicação em contrário, as figuras interativas deste site usam a seção dos exemplos, rígida ao cisalhamento, e por isso coincidem com os cálculos à mão pela teoria de Euler–Bernoulli. A figura abaixo é a exceção:

::model-figure{caption="IPE 200 com vão de 2 m e k = h·tw/A = 0,393: w = 0,5657 mm no meio do vão, 11 % a mais que os 0,5106 mm da teoria de Euler–Bernoulli (Φ = 0,135)"}
---
nodes: { A: [0, 0], B: [2, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
material: { e: 210e9, g: 81e9 }
section: { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 }
results: [w, M]
---
::

## Rótulas de extremidade {#end-hinges}

Uma [rótula de extremidade](/pt/essentials/elements#end-hinges) marcada anula o momento naquela extremidade do elemento. A rotação dessa extremidade fica então livre, e o solver a elimina por **condensação estática**. Divida os seis GLs entre os que são mantidos, $a$, e as rotações de extremidade liberadas, $b$:

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Aqui, $\mathbf{f}_\mathrm{fix}$ são os esforços de engastamento perfeito das [cargas de elemento](#element-loads). A segunda linha fornece a rotação na rótula,

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

e, substituindo-a na primeira linha, restam a rigidez e os esforços de engastamento perfeito condensados

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

O solver coloca $\mathbf{K}^{*}$ de volta numa matriz 6 × 6, com linhas e colunas nulas nas rotações liberadas, de modo que um elemento rotulado é montado exatamente como qualquer outro. Depois da solução, ele recupera $\mathbf{d}_b$ pela fórmula acima, e a deformada mostra a quebra de ângulo na rótula.

Com uma rótula no nó final, a parte de flexão correspondente a $(w_1, \varphi_1, w_2)$ fica

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

que, para $\Phi = 0$, é a clássica rigidez $3EI/L^3$ de uma barra engastada e apoiada. Com rótulas nas **duas** extremidades, não sobra nada dos termos de flexão, apenas $EA/L$: o elemento é uma [barra de treliça](/pt/elements/truss).

A rótula pertence à extremidade do elemento, não ao nó. Se todos os elementos que chegam a um nó forem rotulados nele, nada fica ligado à rotação do próprio nó. O solver a mantém nula, o que não causa problema, mas um momento nodal aplicado nesse nó não tem onde atuar e torna o sistema singular.

## Cargas de elemento {#element-loads}

As cargas ao longo de um elemento entram na solução como **cargas nodais equivalentes**, $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Os **esforços de engastamento perfeito** $\mathbf{f}_\mathrm{fix}$ são os esforços de extremidade que equilibram o elemento carregado com as duas extremidades engastadas.

Todas as fórmulas abaixo estão em eixos locais. Uma carga informada em eixos globais (com **LCS**, a opção do sistema de coordenadas local, desmarcada) é primeiro decomposta em componentes locais, com $c = \cos\theta$ e $s = \sin\theta$ do [ângulo](#transformation-matrix) do elemento,

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

onde o traço sobre o símbolo indica as componentes globais. As cargas distribuídas atuam por metro do comprimento do próprio elemento. Uma viga inclinada de cobertura que vai de $(0, 0)$ a $(3, -4)$, por exemplo, tem $L = 5$ m, $c = 0{,}6$ e $s = -0{,}8$ (ela sobe, então $z$ diminui). Uma carga gravitacional $\bar q_z = 10$ kN/m sobre ela tem $q_x = -8$ kN/m, descendo ao longo da inclinação, e $q_z = 6$ kN/m, perpendicular ao eixo, e a viga recebe ao todo $10 \times 5 = 50$ kN, e não $10 \times 3$.

Nas tabelas:

- $q_z$, $q_x$: carga uniforme; $q_1 \to q_2$: carga trapezoidal, com $q_1$ no nó inicial e $q_2$ no nó final.
- $F_z$, $F_x$, $M_y$: força ou momento a uma distância $a$ do nó inicial, com $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: fibras inferiores mais quentes que as superiores; $\Delta T_c$: eixo aquecido. $\alpha$ é o coeficiente de dilatação térmica do material e $h$ a **Altura** da seção.

Perpendicular ao eixo (componentes z), para $\Phi = 0$, no nó inicial:

$$
\begin{array}{l|cc}
\text{Carga} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

No nó final:

$$
\begin{array}{l|cc}
\text{Carga} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Ao longo do eixo (componentes x), para qualquer $\Phi$:

$$
\begin{array}{l|cc}
\text{Carga} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Esforços de engastamento perfeito com deformação por cisalhamento"}
A carga uniforme e a carga térmica dão os mesmos esforços de engastamento perfeito para qualquer $\Phi$. Para as demais, com $D = 1 + \Phi$ e $\Delta q = q_2 - q_1$ (componentes z):

$$
\begin{aligned}
&\text{Carga trapezoidal:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{Força } F_z\text{:} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&\text{Momento } M_y\text{:} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

São as soluções exatas de uma barra de Timoshenko biengastada, assim como a flecha que o solver acrescenta entre os nós para cada carga.
::

Num elemento rotulado, os esforços de engastamento perfeito são condensados em $\mathbf{f}^{*}_\mathrm{fix}$, como em [Rótulas de extremidade](#end-hinges). Uma carga uniforme num elemento com rótula no nó final, por exemplo, dá $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$ e $M_{21} = 0$ (para $\Phi = 0$): os esforços de engastamento perfeito de uma viga engastada e apoiada.

Depois da solução, os esforços internos ao longo do elemento resultam dos esforços de extremidade e da estática da carga que atua sobre ele, e a flecha resulta das funções de forma somadas à flecha da carga com as extremidades engastadas: veja [Resultados ao longo das barras](/pt/elements/analysis#results-along-the-members).

## Matriz de transformação {#transformation-matrix}

Um elemento com ângulo $\theta$, medido do x global para o z global (no sentido horário na tela), tem

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

e seus deslocamentos de extremidade locais se obtêm dos globais por $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, com

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 & 0 & 0 \\
 -s & c & 0 & 0 & 0 & 0 \\
 0 & 0 & 1 & 0 & 0 & 0 \\
 0 & 0 & 0 & c & s & 0 \\
 0 & 0 & 0 & -s & c & 0 \\
 0 & 0 & 0 & 0 & 0 & 1
\end{bmatrix}.
$$

As rotações são iguais nos dois sistemas. Se um nó tem um **Ângulo do SCL nodal** $\beta$ (um [apoio inclinado](/pt/essentials/nodes-supports#inclined-skewed-supports)), suas incógnitas $\mathbf{d}_n$ ficam nos eixos do próprio nó, girados de $\beta$ do x global para o z global. As componentes globais delas são

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

para os três GLs desse nó. O solver multiplica $\mathbf{T}$, pela direita, pela matriz bloco-diagonal formada pelas $\mathbf{T}_n$ dos dois nós de extremidade (a identidade, no caso de um nó sem eixos próprios), de modo que o elemento se liga a cada nó nos eixos desse nó.

## Matriz de rigidez global {#global-stiffness-matrix}

Em eixos globais, a matriz de rigidez e as cargas nodais equivalentes do elemento são

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

com $\mathbf{K}_l$ e $\mathbf{f}_\mathrm{eq}$ já condensadas, se o elemento tiver rótulas. É $\mathbf{K}_g$ que a janela **Matriz de rigidez** mostra para um elemento (abra-a pela tabela *Elementos* ou pelo menu de contexto do elemento), em unidades SI: N/m, N e N·m. A página [Como o EduBeam resolve um modelo](/pt/elements/analysis) monta essas matrizes e resolve à mão um pequeno exemplo.
