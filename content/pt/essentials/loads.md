---
description: "Forças, momentos, recalques e cargas uniformes, trapezoidais, concentradas e térmicas no EduBeam, com seus sinais: z positivo para baixo, momento positivo anti-horário."
source: site
---

# Cargas

As cargas atuam nos nós ou ao longo dos elementos. Todas pertencem a um **único caso de carga** e atuam juntas; para comparar situações, salve cada uma como [arquivo de projeto ou link de compartilhamento](/pt/essentials/import-export).

| Carga | Atua em | Onde adicionar |
| --- | --- | --- |
| [Força ou momento](#nodal-loads) | um nó | Aba *Cargas* → **Adicionar carga nodal**, ou clique no nó → **Adicionar carga** |
| [Deslocamento prescrito](#prescribed-displacements-support-settlements) (recalque) | um nó com apoio | O mesmo diálogo, ou clique no nó → **Prescrever deslocamento** |
| Carga [distribuída uniforme](#uniformly-distributed-load), [trapezoidal](#trapezoidal-load), [concentrada](#concentrated-load) ou [térmica](#temperature-load) | um elemento | Aba *Cargas* → **Adicionar carga de elemento**, ou clique no elemento → **Adicionar carga** |

## Convenção de sinais {#sign-convention-in-one-line}

O eixo x aponta para a **direita**, o eixo z aponta para **baixo**, e os momentos são positivos no sentido **anti-horário**. Assim, um `Fz` ou `fz` positivo é uma carga para baixo, como a gravidade, e uma carga para cima é negativa.

::model-figure{caption="Todas as cargas aqui são positivas: Fx = +10 kN para a direita, Fz = +10 kN para baixo, My = +10 kNm no sentido anti-horário"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| Positivo | Eixos padrão (z para baixo) | [Eixos com y para cima](/pt/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Força horizontal `Fx`, `fx` | para a direita | para a direita |
| Força vertical | `Fz`, `fz`: **para baixo** | `Fy`, `fy`: **para cima** |
| Momento | `My`: anti-horário | `Mz`: anti-horário |
| Recalque vertical | `Dz`: para baixo | `Dy`: para cima |

Já as cargas nos **eixos locais** do elemento (caixa **LCS**, de sistema de coordenadas local, marcada) acompanham o elemento: o x local vai do nó inicial ao nó final, e o z local é o x local girado de 90° no sentido horário, para o lado da linha tracejada desenhada ao longo do elemento. Veja [Orientação do elemento](/pt/essentials/elements#element-direction). A convenção completa, incluindo a dos esforços internos, está em [Sistema de coordenadas e convenções de sinais](/pt/elements/conventions#loads).

## Cargas nodais {#nodal-loads}

Aba *Cargas* → **Adicionar carga nodal**, ou clique em um nó → **Adicionar carga**, e deixe **Força/Momento** selecionado. Informe as forças `Fx`, `Fz` (kN) e o momento `My` (kNm), com os sinais [acima](#sign-convention-in-one-line); a prévia desenha a carga enquanto você digita.

![Adicionar carga nodal: a prévia mostra o sentido enquanto você digita](/screenshots/pt/loads-nodal.webp){.shot-md}

- As componentes estão nos eixos **globais**. Em um nó com eixos girados (um [apoio inclinado](/pt/essentials/nodes-supports#inclined-skewed-supports)), o diálogo acrescenta a escolha entre **Eixos globais** e **Eixos do nó**. Nos eixos do nó, as componentes, mostradas como `Fx′` e `Fz′`, atuam segundo os eixos próprios do nó e giram com eles se o ângulo mudar depois. Ao trocar de eixos, os números são recalculados para que a carga continue a mesma.
- Um nó pode receber várias cargas nodais; elas se somam.

### Deslocamentos prescritos (recalques de apoio) {#prescribed-displacements-support-settlements}

Para deslocar um apoio de um valor dado, escolha **Deslocamento prescrito** no mesmo diálogo, ou clique em um nó com apoio → **Prescrever deslocamento**. Informe os deslocamentos `Dx`, `Dz` (positivos para a direita e para baixo, na [unidade de deslocamento](/pt/essentials/units-settings#units), metros por padrão) e a rotação `Ry` (rad, positiva no sentido anti-horário).

- Só é possível prescrever GLs **restringidos**: os outros campos ficam desativados, e um nó sem apoio não pode ter recalque nenhum.
- Cada nó tem no máximo um deslocamento prescrito. Para mudá-lo, edite-o em vez de adicionar um segundo.
- Em um apoio inclinado, os campos se chamam `Dx′` e `Dz′`: o recalque atua segundo os eixos próprios do apoio.

Se um recalque provoca esforços internos ou não, depende da estrutura. O mesmo recalque de 10 mm do apoio B, sem nenhuma outra carga:

::div{.shots}

:::model-figure{caption="Viga biapoiada: a viga apenas se inclina; sem reações, M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Viga contínua sobre B: a viga se curva, M = 21,06 kNm sobre B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

Uma estrutura isostática acompanha o apoio sem oferecer resistência. A viga contínua precisa se curvar: o apoio B a puxa para baixo de $\delta = 10\ \text{mm}$, como uma carga concentrada no meio de um vão biapoiado de 10 m. Com $L = 5\ \text{m}$ e o $EI = 17\,548\ \text{kNm}^2$ do aço do exemplo, essa carga vale $P = 6EI\delta/L^3 = 8{,}423\ \text{kN}$, que é a reação em B, e $M_B = PL/2 = 3EI\delta/L^2 = 21{,}06\ \text{kNm}$. O [tutorial da viga contínua](/pt/tutorials/continuous-beam) combina um recalque com cargas.

## Cargas de elemento {#element-loads}

Aba *Cargas* → **Adicionar carga de elemento**, ou clique em um elemento → **Adicionar carga**. Escolha o **Tipo de carga**; a prévia mostra a carga sobre o elemento enquanto você digita. As forças ficam em kN e as cargas distribuídas em kN/m, ou nas [unidades](/pt/essentials/units-settings#units) que você escolheu.

![Adicionar carga de elemento, com uma carga distribuída uniforme](/screenshots/pt/loads-udl.webp){.shot-md}

### Carga distribuída uniforme {#uniformly-distributed-load}

Uma carga constante por unidade de comprimento, `fx` e `fz`, ao longo de todo o elemento. Com **LCS** marcado (o padrão), elas atuam segundo os eixos locais do elemento; desmarcado, segundo os eixos globais. Num elemento horizontal desenhado da esquerda para a direita, as duas opções coincidem; numa barra inclinada, não:

| Você quer | Informe |
| --- | --- |
| uma carga **perpendicular** à barra (vento numa viga inclinada de cobertura) | `fz` com LCS **marcado** |
| uma carga **vertical** por metro de barra (peso próprio) | `fz` com LCS **desmarcado** |
| uma carga **vertical** por metro em planta, isto é, de projeção horizontal (neve) | não disponível diretamente: multiplique por $\cos\alpha$, sendo $\alpha$ a inclinação da barra, e informe como carga vertical |

Os mesmos 10 kN/m numa viga inclinada de cobertura com 4 m de projeção horizontal e 3 m de altura, ou seja, 5 m de comprimento:

::div{.shots}

:::model-figure{caption="LCS desmarcado: carga vertical, 50 kN no total; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="LCS marcado: carga perpendicular à barra; M = 31,25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

À mão: perpendicular, $M = qL^2/8 = 10 \cdot 5^2/8 = 31{,}25\ \text{kNm}$; vertical, os 50 kN distribuídos sobre 4 m de vão dão 12,5 kN/m de projeção, então $M = 12{,}5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Carga trapezoidal {#trapezoidal-load}

Uma carga que varia linearmente ao longo do elemento: `f1x`, `f1z` no nó **inicial** e `f2x`, `f2z` no nó **final**. Zere uma das extremidades para obter uma carga triangular.

::model-figure{caption="Carga triangular de 0 a 10 kN/m: reações de 10 e 20 kN, maior M = 23,09 kNm a 3,46 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

À mão: a carga total $qL/2 = 30\ \text{kN}$ atua a $2L/3$, então $R_A = 10\ \text{kN}$ e $R_B = 20\ \text{kN}$; o cortante se anula, e o momento é máximo, em $x = L/\sqrt{3} = 3{,}46\ \text{m}$, onde $M = qL^2/(9\sqrt{3}) = 23{,}09\ \text{kNm}$.

As cargas trapezoidais atuam segundo os **eixos locais** do elemento (a caixa LCS fica travada). Num elemento horizontal desenhado da esquerda para a direita, isso é o mesmo que os eixos globais; numa barra inclinada, `f1z` e `f2z` são perpendiculares à barra, e `f1x`, `f2x` paralelas a ela.

Mesmo assim, uma carga **vertical** variável sobre uma barra com inclinação $\alpha$ pode ser representada exatamente: informe em cada extremidade suas duas componentes locais, $f_z = q\cos\alpha$ e $f_x = q\sin\alpha$, apontando para baixo ao longo da inclinação, o que dá um valor negativo quando o elemento sobe a partir do nó inicial. Na viga inclinada de cobertura acima, com 4 m de projeção, 3 m de altura e desenhada de baixo para cima, uma carga vertical que cresce de 0 a 10 kN/m de barra é `f1x` = `f1z` = 0, `f2x` = −6 e `f2z` = 8 kN/m.

::model-figure{caption="Carga vertical de 0 a 10 kN/m de barra, informada em componentes locais: reações de 8,333 e 16,67 kN, maior M = 12,83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

À mão: a resultante de 25 kN atua a dois terços da projeção, a 2,67 m, então $R_B = 25 \cdot 2{,}667/4 = 16{,}67\ \text{kN}$. Sobre os 4 m de projeção, a carga é um triângulo que cresce até 12,5 kN/m, então, como acima, $M = 12{,}5 \cdot 4^2/(9\sqrt{3}) = 12{,}83\ \text{kNm}$.

### Carga concentrada {#concentrated-load}

Uma força concentrada `Fx`, `Fz` ou um momento `My` em qualquer ponto **ao longo** de um elemento, sem um nó adicional. A **Posição da carga a partir do nó inicial** é sua distância $a$ ao nó inicial, $0 \le a \le L$. O valor inicial é a metade do comprimento, arredondada para baixo a metros inteiros, e no máximo 5 m (pés inteiros e no máximo 15 ft em unidades americanas); por isso, ajuste-o para a posição da sua carga. **LCS** funciona como nas cargas uniformes.

::model-figure{caption="20 kN a 2 m num vão de 6 m: V salta de 13,33 para −6,667 kN, M = 26,67 kNm sob a carga"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

O diagrama de esforço cortante salta de `Fz` no ponto da carga, e o diagrama de momento fletor tem ali um ponto anguloso: $R_A = 20 \cdot 4/6 = 13{,}33\ \text{kN}$, $M = 13{,}33 \cdot 2 = 26{,}67\ \text{kNm}$. Já um `My` concentrado faz saltar o diagrama de momento fletor.

### Carga térmica {#temperature-load}

| Campo | Significado | Efeito |
| --- | --- | --- |
| **ΔT<sub>c</sub>**, variação axial de temperatura | a mesma variação em toda a seção | alongamento $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | variação da fibra inferior menos a da fibra superior | curvatura $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

As duas são *variações* de temperatura em relação ao estado sem tensões, em °C por padrão; uma variação de 1 °C equivale a 1 K. As cargas térmicas usam o **α** do material e a **altura h** da seção. A fibra **inferior** fica do lado da linha tracejada. Um ΔT<sub>b</sub> − ΔT<sub>t</sub> positivo (mais quente embaixo) alonga a fibra inferior, e o elemento se curva para baixo como uma viga sob carga gravitacional.

Numa estrutura isostática, a temperatura só causa deslocamentos. As restrições (engastes, continuidade, barras redundantes) a transformam em esforços internos. A mesma viga de aço de 6 m, com 0,3 m de altura, 20 K mais quente embaixo do que em cima:

::div{.shots}

:::model-figure{caption="Viga biapoiada: flecha de 3,6 mm no meio do vão, M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="Viga biengastada: continua reta, M = −14,04 kNm em todo o comprimento"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

À mão: a curvatura livre é $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0{,}3 = 8 \times 10^{-4}\ \text{1/m}$. Biapoiada, a viga se curva livremente e tem flecha $\kappa L^2/8 = 3{,}6\ \text{mm}$. Com as extremidades engastadas, um momento constante precisa anular essa curvatura: $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14{,}04\ \text{kNm}$. A página [Conferir resultados à mão](/pt/guide/verification#temperature-gradient-on-a-simply-supported-beam) resolve outro caso.

## Editar e remover cargas {#editing-and-removing-loads}

| Para | Faça assim |
| --- | --- |
| Mudar valores rapidamente | Edite as componentes (e a caixa LCS) no lugar, na aba *Cargas*. |
| Abrir o diálogo de edição | Clique duas vezes na carga na visualização, ou clique nela → **Editar carga**. As cargas também aparecem como etiquetas nas tabelas *Nós* e *Elementos*; clique em uma para editá-la. |
| Excluí-la | Selecione-a e pressione <kbd>Delete</kbd>, clique nela → **Excluir**, ou use o × na aba *Cargas*. |

As cargas pertencem ao seu nó ou elemento: excluir o nó ou o elemento as exclui, e copiá-lo com as cargas selecionadas as copia também.

![A aba Cargas: uma linha por carga, com as componentes editáveis no lugar](/screenshots/pt/loads-table.webp)

## O que não está disponível {#what-is-not-available}

::div{.limits}
- **Um único caso de carga.** Não há combinações: salve cada caso em um arquivo ou link próprio.
- **Sem peso próprio.** Informe-o como carga uniforme, com LCS desmarcado: $f_z = \rho\,g\,A$, por exemplo $\approx 0{,}22\ \text{kN/m}$ para um IPE 200.
- **Cargas trapezoidais só em eixos locais.** Para uma carga vertical variável numa barra inclinada, informe suas [componentes locais](#trapezoidal-load).
- **Sem cargas distribuídas parciais.** Uma carga distribuída cobre o elemento inteiro: acrescente um nó onde ela começa ou termina.
::
