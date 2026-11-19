---
description: "O método da rigidez direta como o EduBeam o executa, resolvido à mão numa viga engastada e apoiada: numeração dos GLs, montagem, apoios, reações e resultados."
source: site
---

# Como o EduBeam resolve um modelo

Sempre que você altera o modelo, o EduBeam o resolve de novo pelo **método da rigidez direta**, no seu navegador, em poucos milissegundos. Esta página acompanha o solver [@edubeam/fem](/pt/solver) passo a passo num pequeno exemplo, para que você possa reproduzir cada número à mão e saiba por que os resultados são confiáveis.

O exemplo é uma viga engastada e apoiada: um perfil IPE 300 de aço, com 4 m de comprimento, engastado em A, com apoio móvel em B e carga de 10 kN/m. Sua rigidez é $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm² e, sem deformação por cisalhamento, as respostas dos livros são $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN e $\varphi_B = qL^3/(48EI)$.

::model-figure{caption="Viga engastada e apoiada, IPE 300, 10 kN/m: M = −20 kNm em A e +11,25 kNm a 2,5 m, reações de 25 kN e 15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
section: { a: 53.8e-4, iy: 8.356e-5, h: 0.3 }
results: [M, V, w]
show: [nodeLabels]
---
::

## Do modelo aos deslocamentos {#from-model-to-displacements}

::div{.steps}
### Numere os graus de liberdade {#number-the-degrees-of-freedom}

Cada nó recebe os GLs de que seus elementos precisam. Todos os elementos são [elementos de viga](/pt/elements/beam), então todo nó tem `Dx`, `Dz` e `Ry`. O solver numera primeiro os GLs **livres** e depois os **restringidos**, nó por nó. Aqui, A é engastado e B é impedido apenas na vertical; restam, portanto, dois GLs livres:

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$ e $\varphi$ são os deslocamentos ao longo de x e de z e a rotação, como na [tabela de GLs](/pt/elements/conventions#degrees-of-freedom). Cada elemento guarda um **vetor de localização**: as posições dos seus seis GLs em $\mathbf{r}$. Contando a partir de 1, os GLs da viga $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ ocupam as posições $(3, 4, 5, 1, 6, 2)$.

### Calcule as matrizes dos elementos {#compute-the-element-matrices}

Para cada elemento, o solver monta a [matriz de rigidez local](/pt/elements/beam#local-stiffness-matrix), condensa as [rótulas de extremidade](/pt/elements/beam#end-hinges) que houver e leva a matriz para eixos globais, $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Cada carga de elemento vira [cargas nodais equivalentes](/pt/elements/beam#element-loads), $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Nossa viga é horizontal, então $\mathbf{T}$ é a identidade, e a carga uniforme dá, em kN e kNm,

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13{,}33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13{,}33 \end{bmatrix}.
$$

### Monte o sistema {#assemble}

A matriz de rigidez global $\mathbf{K}$ começa zerada. Cada elemento soma o seu termo $(i, j)$ na linha e na coluna que o seu vetor de localização indica para $i$ e $j$; assim, onde vários elementos se encontram num nó, as rigidezes correspondentes aos GLs desse nó se somam. O vetor de cargas $\mathbf{F}$ reúne da mesma forma as cargas nodais e as cargas nodais equivalentes. Os deslocamentos prescritos (recalques) entram em $\mathbf{r}_p$. Com os GLs livres primeiro e os restringidos depois, o sistema se divide em blocos:

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

onde $\mathbf{R}$ são as reações desconhecidas. No exemplo, só as linhas e colunas da extremidade B da viga caem em $\mathbf{K}_{uu}$:

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13{,}33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### Aplique os apoios e resolva {#apply-the-supports-and-solve}

Os apoios não são molas nem números grandes na diagonal: os GLs restringidos são simplesmente separados. Os deslocamentos livres resultam de

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

resolvido por decomposição LU. Sem recalques, $\mathbf{r}_p = \mathbf{0}$, e aqui

$$
\varphi_B = \frac{13{,}33}{17\,548} = 7{,}598 \times 10^{-4} \text{ rad},
$$

que é o $qL^3/(48EI)$ dos livros, e $u_B = 0$.

### Calcule as reações {#compute-the-reactions}

Com todos os deslocamentos conhecidos, as linhas restringidas dão as reações, isto é, as forças que os apoios exercem sobre a estrutura:

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

Para $w_A$, a linha de $\mathbf{K}_{pu}$ contém $-6EI/L^2$ na coluna de $\varphi_B$, e $\mathbf{F}_p$ contém $qL/2$:

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

ou seja, 25 kN para cima (z aponta para baixo). Da mesma forma, $R_{\varphi A} = +20$ kNm e $R_{wB} = -15$ kN: os $qL^2/8$ e $3qL/8$ dos livros.
::

## Resultados ao longo das barras {#results-along-the-members}

Para cada elemento, o solver extrai de $\mathbf{r}$ os deslocamentos de extremidade, converte-os para eixos locais, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, e calcula os [esforços de extremidade](/pt/elements/conventions#end-forces-element-results-table)

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

No exemplo, $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ dá $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN e $M_{21} = 0$.

Os esforços internos em qualquer $x$ resultam então do equilíbrio do trecho do elemento entre o seu início e $x$: os esforços no início mais a carga nesse trecho.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

onde $N_q$, $V_q$ e $M_q$ vêm das cargas nesse trecho. Para uma carga uniforme $q_z$, uma carga trapezoidal de $q_1$ a $q_2$ (com $\Delta q = q_2 - q_1$) e uma força $F_z$ ou um momento $M_y$ à distância $a$, que só atuam para $x \ge a$:

$$
\begin{array}{l|cc}
\text{Carga} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ é igual a $V_q$, com as componentes axiais $q_x$ e $F_x$ no lugar de $q_z$ e $F_z$.

No exemplo, $M(x) = -20 + 25\,x - 5\,x^2$ kNm, máximo em $x = 2{,}5$ m, onde vale $11{,}25$ kNm $= 9qL^2/128$. Uma carga térmica não tem termo próprio: atua apenas por meio dos esforços de extremidade.

A flecha é o produto das [funções de forma](/pt/elements/beam#local-stiffness-matrix) pelos deslocamentos de extremidade, somado à flecha da carga no elemento com as duas extremidades engastadas. Uma extremidade rotulada recupera antes a sua própria rotação a partir da [condensação](/pt/elements/beam#end-hinges). Os diagramas e a deformada são essas funções, avaliadas ao longo de cada barra.

## Por que os resultados são exatos {#exact}

Cada passo acima é exato para o modelo que ele resolve:

- A rigidez do elemento vem da **solução exata** de uma barra prismática de Timoshenko, e não de formas polinomiais supostas; é, portanto, a rigidez verdadeira da barra.
- Os esforços de engastamento perfeito são as soluções exatas da barra biengastada para cada tipo de carga; assim, as cargas nodais equivalentes não perdem nada.
- Os deslocamentos nodais são, portanto, exatos, e os esforços internos entre os nós vêm do equilíbrio com a carga real; logo, também são exatos.

Por isso, o EduBeam nunca pede que você refine a malha: um elemento por barra dá a mesma resposta que cem. Só são necessários nós onde a própria barra muda: num apoio, numa rótula, num canto ou numa mudança de seção. Uma carga concentrada entre eles pode continuar sendo carga de elemento. O único erro que resta é o de arredondamento em ponto flutuante; as tabelas de resultados mostram como 0 os valores menores que $10^{-12}$ do maior valor do mesmo tipo.

“Exato” se refere ao modelo, que tem seus limites:

::div{.limits}
- **Material elástico linear** e **pequenos deslocamentos**: o equilíbrio é escrito na configuração indeformada, então não há efeitos de segunda ordem (P–Δ) nem flambagem.
- **Barras retas e prismáticas**: uma seção por elemento. Uma barra de seção variável precisa ser aproximada por vários elementos.
- **Flexão apenas no plano x–z**: sem torção e sem comportamento fora do plano.
::

## Quando a estrutura não se sustenta {#mechanisms}

Uma estrutura que pode se mover sem se deformar tem matriz de rigidez singular e não tem solução única. O EduBeam procura essa situação antes de resolver e confere a resposta depois:

1. **Antes de resolver**, cada parte conexa da estrutura é verificada apenas pela geometria. Os apoios precisam impedir os três movimentos de corpo rígido de um corpo plano: menos de três restrições significa que o modelo simplesmente ainda não está pronto (*A estrutura precisa de apoios para poder ser resolvida.*), enquanto três ou mais que ainda a deixam deslizar ou girar, como apoios móveis paralelos, são um erro. Em seguida vêm as rótulas: se as barras podem girar em torno delas sem que nenhuma mude de comprimento, a estrutura é um mecanismo, e o EduBeam destaca as rótulas com um círculo e mostra o movimento.
2. **Durante a solução**, uma matriz exatamente singular interrompe a decomposição LU: *A estrutura é um mecanismo: a matriz de rigidez é singular.*
3. **Depois da solução**, um deslocamento ou uma rotação maior que $10^6$ m ou rad significa que a matriz era singular, a menos de erros de arredondamento. O EduBeam indica os nós e as direções que se movem: *A estrutura é instável. Movimentos praticamente sem resistência: …* Um material ou uma seção informados como zero, ou na unidade errada, também caem aqui.

Uma rotação à qual nada está ligado, num nó em que todas as barras são rotuladas, não é um mecanismo: o solver a mantém nula. A página [Solução de problemas](/pt/reference/troubleshooting#no-results-are-drawn) explica cada mensagem e como resolvê-la.

## Execute o solver você mesmo {#library}

O solver é de código aberto: [@edubeam/fem](/pt/solver), em TypeScript, para o navegador e o Node. A mesma viga engastada e apoiada:

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// Unidades SI: m, N, Pa. Aço, IPE 300; k = 1e32 torna a seção rígida ao cisalhamento.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // engaste
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // apoio móvel
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, para baixo

solver.solve()

solver.neq // 2: Dx e Ry de B estão livres
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: GLs livres, depois os restringidos
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), depois B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, momento negativo no engaste
beam.computeBendingMomentAt(lc, 2.5) // 11250: o maior momento positivo
```

Depois de `solve()`, `solver.k` contém a matriz montada $\mathbf{K}$ e `solver.f` o vetor de cargas $\mathbf{F}$, para você comparar com a sua própria montagem. Os passos desta página estão em `Solver.ts` (numeração), `LinearStaticSolver.ts` (montagem, solução, reações) e `Beam2D.ts` (matrizes do elemento e resultados).

::div{.actions}
[Primeiros passos com @edubeam/fem](/pt/solver/getting-started) [O que a biblioteca contém](/pt/solver/reference) [Código-fonte no GitHub ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
