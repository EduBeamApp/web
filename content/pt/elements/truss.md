---
description: "A barra de treliça no EduBeam: um elemento de viga rotulado nas duas extremidades, por que equivale ao elemento clássico de treliça e suas matrizes."
source: site
---

# Elemento de treliça

Uma barra de treliça transmite apenas esforço normal. O EduBeam não tem um elemento de treliça separado: uma barra de treliça é um [elemento de viga](/pt/elements/beam) com **as duas rótulas de extremidade** marcadas. Esta página mostra por que isso equivale exatamente ao elemento clássico de treliça de dois nós, apresenta as matrizes de rigidez e de transformação e explica o que uma barra rotulada consegue fazer e uma barra de treliça dos livros não.

::model-figure{caption="Todas as barras rotuladas nas duas extremidades: as barras inclinadas têm N = −7,071 kN, o tirante +5 kN, e nenhuma barra sofre flexão"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
results: [N]
show: [nodeLabels]
---
::

Para modelar uma treliça no aplicativo, marque **Rótula no início** e **Rótula no fim** em todas as barras, ou marque as duas na faixa no topo antes de desenhar as barras com o mouse ([rótulas de extremidade](/pt/essentials/elements#end-hinges)). O [tutorial da treliça plana](/pt/tutorials/truss) monta uma treliça passo a passo.

## Graus de liberdade {#degrees-of-freedom}

Uma barra de treliça trabalha com as duas translações de cada extremidade, nos seus [eixos locais](/pt/elements/conventions#element-local-axes):

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="Uma barra de treliça: rotulada nas duas extremidades, com duas translações em cada uma"}
::

| Direção | Nó inicial (1) | Nó final (2) |
| --- | --- | --- |
| ao longo do x local | $u_1$ e `X12` | $u_2$ e `X21` |
| ao longo do z local | $w_1$ e `Z12` | $w_2$ e `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

Os nós mantêm a rotação `Ry`, porque toda barra é um elemento de viga, mas uma barra rotulada nas duas extremidades não sente nem transmite essa rotação: seus momentos de extremidade `M12` e `M21` são sempre nulos. Num nó em que todas as barras são rotuladas, nada segura essa rotação. O solver a mantém nula, mas um momento nodal aplicado nesse nó não tem onde atuar e interrompe a solução com *A estrutura é um mecanismo: a matriz de rigidez é singular.*

## Matriz de rigidez local {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

onde $E$ é o módulo de elasticidade, $A$ a área da seção e $L$ o comprimento. Só o alongamento da barra consome energia; por isso, o esforço normal de uma barra sem cargas de elemento é constante:

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### Por que uma viga com duas rótulas é uma barra de treliça {#why-a-beam-with-two-hinges-is-a-truss-bar}

Condense as duas rotações de extremidade da [matriz de rigidez da viga](/pt/elements/beam#local-stiffness-matrix), como em qualquer [rótula de extremidade](/pt/elements/beam#end-hinges). Os termos axiais não envolvem rotações e permanecem como estão. Os termos de flexão desaparecem por completo: com as duas rotações livres, qualquer par de deslocamentos de extremidade $w_1$, $w_2$ apenas gira a barra como corpo rígido em torno das rótulas, o que não consome energia. O solver faz essa condensação numericamente, para qualquer coeficiente de cisalhamento, e obtém a matriz acima, a menos de erros de arredondamento em ponto flutuante.

::callout{type="details" title="A condensação, passo a passo"}
Para a parte de flexão, ordene os GLs em mantidos, $a = (w_1, w_2)$, e liberados, $b = (\varphi_1, \varphi_2)$. Da matriz da viga, com $k_1$ a $k_4$ e o parâmetro de cisalhamento $\Phi$ definidos [naquela página](/pt/elements/beam#local-stiffness-matrix),

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

Como $\mathbf{K}_{ab}$ tem duas colunas iguais, só importa a soma dos termos de $\mathbf{K}_{bb}^{-1}$, que é $2/(k_3 + k_4)$:

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

Com $k_3 + k_4 = 6EI_y / ((1+\Phi)L)$, o fator vale $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$; isso é, portanto, exatamente $\mathbf{K}_{aa}$, e a rigidez à flexão condensada $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ é nula.
::

## Matriz de transformação {#transformation-matrix}

Para uma barra com ângulo $\theta$ medido do x global para o z global, com $c = \cos\theta = (x_2 - x_1)/L$ e $s = \sin\theta = (z_2 - z_1)/L$, os deslocamentos locais são $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, com

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

são as linhas e colunas de translação da [matriz de transformação da viga](/pt/elements/beam#transformation-matrix). Atenção ao sinal de $s$ com z para baixo: a barra inclinada A → C da treliça acima sobe, então $z_2 - z_1 = -3$ m, $c = 0{,}7071$ e $s = -0{,}7071$.

## Matriz de rigidez global {#global-stiffness-matrix}

Efetuando o produto $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$, obtém-se

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

A janela **Matriz de rigidez** de uma barra rotulada mostra esses números nas linhas e colunas de translação, e zeros nas rotações.

## O que uma viga rotulada faz além de uma barra de treliça {#where-a-hinged-beam-does-more}

Como uma barra de treliça no EduBeam continua sendo um elemento de viga, ela consegue fazer duas coisas que uma barra de treliça dos livros não consegue:

- **Receber cargas ao longo do comprimento.** Uma carga distribuída numa barra, como o peso próprio, flete a barra entre os nós como uma viga biapoiada e transmite $qL/2$ a cada nó. As demais barras recebem os esforços normais da treliça sob essas cargas nodais. Na própria barra carregada, a componente da carga ao longo da barra faz $N$ variar linearmente, e o esforço de treliça é o valor de $N$ no meio do comprimento.
- **Combinar-se com vigas.** Um pórtico pode conter barras rotuladas, como um tirante ou uma diagonal de contraventamento, sem nenhum tipo especial de elemento.

Acrescente 5 kN/m ao tirante da treliça acima:

::model-figure{caption="A mesma treliça com 5 kN/m no tirante: os esforços normais não mudam, e o tirante sofre flexão com M = qL²/8 = 22,5 kNm"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
  - { member: 3, qz: 5 }
results: [M, N]
show: [nodeLabels]
---
::

Para conferir à mão: em C, o equilíbrio vertical $2\,N \sin 45^\circ + 10 = 0$ dá $N = -7{,}071$ kN em cada barra inclinada. Em A, a componente horizontal da barra inclinada, $7{,}071 \cos 45^\circ = 5$ kN, é equilibrada pelo tirante, que fica tracionado com $N = +5$ kN. A carga no tirante vai direto para os apoios nas suas extremidades: acrescenta $qL/2 = 15$ kN a cada reação, mas nada aos esforços normais.

Uma treliça precisa ser estável como estrutura de barras articuladas. Um painel quadrado sem diagonal, por exemplo, é um mecanismo: o EduBeam indica as rótulas e mostra o movimento ([Solução de problemas](/pt/reference/troubleshooting#no-results-are-drawn)).
