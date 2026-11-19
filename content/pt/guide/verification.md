---
description: "O EduBeam conferido com as fórmulas dos livros: vigas, uma treliça, temperatura, um recalque e onde a viga de Timoshenko difere da de Euler–Bernoulli."
source: site
---

# Conferir resultados à mão

Nunca confie em um número que você não consegue reproduzir, ao menos aproximadamente. Esta página resolve à mão os casos clássicos dos livros e os compara com o [EduBeam]{.edubeam}, que concorda em todos os algarismos mostrados. As tabelas trazem cinco algarismos significativos, como a aba *Resultados* do aplicativo; os rótulos das figuras são arredondados para quatro. Cada figura é resolvida ao vivo no seu navegador; **Abrir no EduBeam** carrega o mesmo modelo no aplicativo, onde você pode ler as tabelas, alterar um valor e ver o que acontece.

::div{.chips}
- [Viga biapoiada](#simply-supported-beam-uniform-load)
- [Viga em balanço](#cantilever-tip-load)
- [Viga biengastada](#fixed–fixed-beam-uniform-load)
- [Viga engastada e apoiada](#propped-cantilever-uniform-load)
- [Treliça de duas barras](#two-bar-truss)
- [Temperatura](#temperature-gradient-on-a-simply-supported-beam)
- [Recalque de apoio](#prescribed-displacement)
- [Deformação por cisalhamento](#shear-deformation)
::

Para estruturas completas resolvidas do início ao fim, veja os tutoriais do [pórtico triarticulado](/pt/tutorials/three-hinged-frame) e da [treliça plana](/pt/tutorials/truss). Para resolver à mão exercícios novos, com as respostas conferidas enquanto você as digita, use a página [Exercícios de estática](/pt/practice).

## A seção usada aqui {#the-section-used-here}

Salvo indicação em contrário, todos os casos usam a viga de aço dos exemplos do aplicativo: $E = 210$ GPa e $I_y = 8356$ cm⁴ (um IPE 300), portanto

$$
EI = 210 \times 10^9 \cdot 8{,}356 \times 10^{-5} = 17\,547{,}6\ \text{kNm}^2
$$

A área ($A = 1$ m²) e o coeficiente de cisalhamento ($k = 10^{32}$) são tão grandes que as deformações axial e por cisalhamento desaparecem, e os resultados seguem exatamente as fórmulas de Euler–Bernoulli do seu livro.

::callout{type="info" title="As vigas do EduBeam são vigas de Timoshenko"}
Com uma seção real, como as da biblioteca de seções, as barras também se deformam por cisalhamento. As flechas ficam então um pouco maiores do que as fórmulas de Euler–Bernoulli indicam, e numa estrutura hiperestática os esforços também mudam um pouco. A seção [Deformação por cisalhamento](#shear-deformation), no fim desta página, mostra quanto, e como desligar esse efeito.
::

Na aba *Resultados*, os deslocamentos e as rotações seguem os [eixos globais](/pt/elements/conventions#global-axes): D<sub>z</sub> positivo é para baixo, R<sub>y</sub> positivo é anti-horário, e os deslocamentos estão em metros, a menos que você mude a unidade nas [Configurações](/pt/essentials/units-settings).

## Viga biapoiada com carga uniforme {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, apoio fixo em A e apoio móvel em B. O nó C, no meio do vão, permite ler a flecha ali; dividir uma barra num nó não altera nenhum resultado.

::model-figure{caption="Viga biapoiada, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandeza | Fórmula | Valor |
| --- | --- | --- |
| Reações | $qL/2$ | 36 kN |
| Esforço cortante nos apoios | $\pm qL/2$ | +36 kN em A, −36 kN em B |
| Momento no meio do vão | $qL^2/8$ | 54 kNm |
| Rotação em A | $qL^3/(24EI)$ | 0,0061547 rad, horária |
| Flecha em C | $5qL^4/(384EI)$ | 11,540 mm, para baixo |

O EduBeam mostra os mesmos valores. Na aba *Resultados*, o nó A tem R<sub>y</sub> = −0,0061547 rad (negativo: horário) e o nó C tem D<sub>z</sub> = 0,01154 m (positivo: para baixo).

## Viga em balanço com carga na extremidade {#cantilever-tip-load}

$L = 4$ m, engaste em A, $F = 18$ kN para baixo na extremidade livre B.

::model-figure{caption="Viga em balanço, 18 kN na extremidade"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandeza | Fórmula | Valor |
| --- | --- | --- |
| Reação vertical | $F$ | 18 kN |
| Momento de engastamento | $FL$ | 72 kNm, negativo: M = −72 kNm |
| Rotação na extremidade | $FL^2/(2EI)$ | 0,0082063 rad, horária |
| Flecha na extremidade | $FL^3/(3EI)$ | 21,883 mm, para baixo |

Na aba *Resultados*, o nó B tem R<sub>y</sub> = −0,0082063 rad e D<sub>z</sub> = 0,021883 m.

## Viga biengastada com carga uniforme {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, as duas extremidades engastadas. Esta viga é hiperestática, então a solução depende da rigidez; as fórmulas vêm da condição de compatibilidade: rotações nulas nas duas extremidades.

::model-figure{caption="Viga biengastada, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandeza | Fórmula | Valor |
| --- | --- | --- |
| Reações | $qL/2$ | 36 kN |
| Momentos nos apoios | $qL^2/12$ | 36 kNm, negativos: M = −36 kNm |
| Momento no meio do vão | $qL^2/24$ | 18 kNm, positivo |
| Flecha em C | $qL^4/(384EI)$ | 2,3080 mm, para baixo |

Engastar as extremidades desloca todo o diagrama de momento fletor em $qL^2/12$: a variação total do apoio até o meio do vão continua sendo $qL^2/8 = 54$ kNm, como na viga biapoiada. No aplicativo, parta do modelo biapoiado e troque os dois apoios por **Engaste** para ver isso acontecer.

## Viga engastada e apoiada com carga uniforme {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m, engaste em A e apoio móvel em B.

::model-figure{caption="Viga engastada e apoiada, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandeza | Fórmula | Valor |
| --- | --- | --- |
| Reação no engaste | $5qL/8$ | 45 kN |
| Reação no apoio móvel | $3qL/8$ | 27 kN |
| Momento de engastamento | $qL^2/8$ | 54 kNm, negativo: M = −54 kNm |
| Maior momento positivo | $9qL^2/128$ | 30,375 kNm |
| … onde $V = 0$ | $x = 5L/8$ | a 3,75 m de A |
| Rotação em B | $qL^3/(48EI)$ | 0,0030773 rad, anti-horária |

O EduBeam indica o valor de todos os extremos de um diagrama, então o máximo do momento positivo aparece marcado onde ocorre. Para achar a posição, veja onde o esforço cortante passa por zero: $V(x) = 45 - 12x = 0$ dá $x = 3{,}75$ m.

## Treliça de duas barras {#two-bar-truss}

Duas barras partem de apoios fixos em A $(0, 0)$ e B $(4, 0)$ e se encontram no vértice C $(2, -2)$, 2 m acima. As duas extremidades de ambas as barras têm **rótulas de extremidade**, então as barras recebem apenas esforço normal. Uma carga vertical $F = 20$ kN atua para baixo em C.

::model-figure{caption="Treliça de duas barras, 20 kN no vértice"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

Cada barra está a 45°. O equilíbrio vertical do nó C, com as duas barras sujeitas ao mesmo esforço por simetria, dá:

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14{,}142\ \text{kN}
\end{aligned}
$$

As duas barras estão **comprimidas**. Cada apoio recebe 10 kN na vertical e 10 kN na horizontal, voltados para dentro: as barras empurram os apoios para fora. O diagrama **N (x)** e as reações mostram o mesmo.

## Gradiente térmico em viga biapoiada {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0{,}3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. A face superior aquece 5 K e a inferior esfria 5 K, então $\Delta T_b - \Delta T_t = -10$ K e o eixo mantém a temperatura ($\Delta T_c = 0$). Uma viga biapoiada pode se curvar livremente, então **não há esforços internos**, apenas uma curvatura:

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0{,}3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

A face superior se alonga e a inferior se encurta, então a viga se curva **para cima**:

::model-figure{caption="Face superior 10 K mais quente que a inferior: a viga sobe 3,2 mm, sem esforços internos"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| Grandeza | Fórmula | Valor |
| --- | --- | --- |
| Flecha em C | $\kappa L^2/8$ | 3,2 mm, para cima: D<sub>z</sub> = −0,0032 m |
| Rotação em A | $\kappa L/2$ | 0,0016 rad, anti-horária |
| Momento fletor |  | 0 |

Uma variação uniforme $\Delta T_c$ apenas alongaria a viga, o que o apoio móvel permite: ela também não gera esforços.

Agora impeça a rotação nas duas extremidades (um **Engaste** em A e um **Engaste deslizante** em B, que ainda deixa a viga se alongar). A curvatura fica impedida, e em seu lugar surge um momento constante ao longo de todo o vão:

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547{,}6 \cdot (-4 \times 10^{-4}) = 7{,}019\ \text{kNm}
\end{aligned}
$$

O momento é positivo: a face superior, impedida de se alongar como queria, acaba comprimida.

::model-figure{caption="A mesma viga com as duas rotações impedidas: momento constante de 7,019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

As cargas térmicas são informadas como descrito em [Cargas](/pt/essentials/loads#temperature-load); a altura da seção $h$ faz parte da [seção transversal](/pt/essentials/elements#cross-sections).

## Recalque de apoio {#prescribed-displacement}

Tome a [viga engastada e apoiada](#propped-cantilever-uniform-load) sem a carga e deixe o apoio móvel em B recalcar $w = 10$ mm. No EduBeam isso é um **deslocamento prescrito** D<sub>z</sub> = 0,01 m em B. Para acompanhá-lo, o apoio móvel precisa puxar para baixo a extremidade do balanço, e isso flete a viga:

::model-figure{caption="Viga engastada e apoiada, B recalca 10 mm: o apoio móvel puxa para baixo com 2,437 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| Grandeza | Fórmula | Valor |
| --- | --- | --- |
| Força no apoio móvel | $R = 3EIw/L^3$ | 2,4372 kN, puxando para baixo |
| Momento de engastamento | $RL$ | 14,623 kNm, negativo: M = −14,623 kNm |
| Rotação em B | $3w/(2L)$ | 0,0025 rad, horária |

Ao contrário de uma carga, um recalque só gera esforços onde a estrutura resiste a ele: aqui, quanto mais rígida a viga, maior $R$. Uma viga biapoiada acompanharia o mesmo recalque como corpo rígido, sem esforço nenhum.

Volte a aplicar a carga de 12 kN/m e os resultados se superpõem: o engaste recebe agora $45 + 2{,}4372 = 47{,}437$ kN e $54 + 14{,}623 = 68{,}623$ kNm, e o apoio móvel $27 - 2{,}4372 = 24{,}563$ kN. Como informar um recalque está descrito em [Cargas](/pt/essentials/loads#prescribed-displacements-support-settlements).

## Deformação por cisalhamento {#shear-deformation}

Os elementos de viga do EduBeam são vigas de **Timoshenko**: além da flecha por flexão, eles se deformam por cisalhamento, numa medida definida pela rigidez ao cisalhamento da seção, $kGA$. O que isso muda depende da estrutura:

- **Isostática**: as reações e os esforços internos vêm apenas do equilíbrio, então continuam exatamente iguais. Só os deslocamentos crescem. Na viga biapoiada e na viga em balanço, as rotações das seções também não mudam; em outros casos, como na extremidade livre de uma viga biapoiada com balanço, elas mudam um pouco.
- **Hiperestática**: os esforços dependem da rigidez, então também mudam um pouco.

### Uma viga biapoiada {#shear-simply-supported}

A viga do [Início rápido](/pt/guide/quick-start#_8-check-by-hand) mostra quanto. É a viga biapoiada acima com uma seção real, o **IPE 200 (aprox.)** da biblioteca de seções: $I_y = 1943$ cm⁴, $A = 28{,}48$ cm² e coeficiente de cisalhamento $k = 0{,}3933$ (a fração da área que cabe à alma), com $G = 81$ GPa. Assim, $EI = 4080{,}3$ kNm² e $kGA = 90\,720$ kN.

| Grandeza | Fórmula | Valor |
| --- | --- | --- |
| Rotação no apoio | $qL^3/(24EI)$ | 0,026469 rad |
| Flecha no meio do vão, flexão | $5qL^4/(384EI)$ | 49,629 mm |
| Flecha no meio do vão, cisalhamento | $qL^2/(8kGA)$ | 0,59524 mm |
| Flecha no meio do vão, total | soma | 50,224 mm, como mostra o EduBeam |

A parcela do cisalhamento é 1,2 % do total. A rotação no apoio é o valor de Euler–Bernoulli, assim como as reações e os momentos.

### Uma viga em balanço: barras curtas {#shear-cantilever}

Numa viga em balanço com carga $F$ na extremidade, a extremidade desce $FL^3/(3EI)$ por flexão e $FL/(kGA)$ por cisalhamento. A razão entre as duas é

$$
\frac{\text{cisalhamento}}{\text{flexão}} = \frac{3EI}{kGA\,L^2}
$$

Com o mesmo IPE 200, isso dá 0,84 % para um balanço de 4 m, mas 13,5 % para um de 1 m: a deformação por cisalhamento importa em barras curtas e altas.

### Uma viga engastada e apoiada: os esforços mudam {#shear-propped-cantilever}

A [viga engastada e apoiada](#propped-cantilever-uniform-load) feita com o IPE 200 é hiperestática, e o apoio móvel passa a receber um pouco mais. Com $\beta = 3EI/(kGA\,L^2) = 0{,}0037481$ para $L = 6$ m, a compatibilidade no apoio móvel dá

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27{,}034\ \text{kN}
$$

em vez de 27 kN, e o momento de engastamento cai de 54 para $qL^2/2 - R_B L = 53{,}798$ kNm. Aqui é pouco, mas cresce com $\beta$, ou seja, em barras curtas e altas.

### Comparação com Euler–Bernoulli {#shear-switch-off}

Para comparar com as fórmulas de Euler–Bernoulli, defina o **Coeficiente de cisalhamento** da seção como um valor muito grande, por exemplo `1e10`. A parcela do cisalhamento desaparece e todos os casos desta página voltam a coincidir. A formulação do elemento está no [manual teórico](/pt/elements/beam).

## Dicas para suas próprias conferências {#tips-for-your-own-checks}

- Mantenha à vista o **indicador de unidades**, no canto inferior direito da visualização; a maioria das diferenças vem de erros de unidade.
- Leia os números exatos na aba **Resultados** e nas dicas que aparecem ao passar o mouse, não nos rótulos dos diagramas. **Exportar CSV** ou **Copiar** também fornecem as reações, prontas para uma planilha. Veja [Resultados e diagramas](/pt/essentials/results#results-tab).
- Defina **Formato numérico** como *Automático* nas Configurações para ler `40` em vez de `4 · 10¹`.
- Use a janela **Matriz de rigidez** para comparar um único elemento com o [manual teórico](/pt/elements/beam) ao estudar o método da rigidez direta.
- Use **Compartilhar modelo** para entregar um modelo conferido a um colega ou professor.
- Para conferir muitos casos de uma vez, ou para gerar exercícios com respostas conhecidas, use o mesmo solver em código: a [@edubeam/fem](/pt/solver) é a biblioteca por trás de cada número do aplicativo.
