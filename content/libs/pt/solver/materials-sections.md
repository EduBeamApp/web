---
title: Materiais e seções
description: "Os parâmetros de material e de seção do @edubeam/fem, quais cada análise exige, o que acontece quando falta um e como desligar a deformação por cisalhamento."
order: 4
source: site
---

# Materiais e seções {#materials-and-sections}

As barras obtêm a sua rigidez de um material e de uma seção transversal. Cada um é criado uma única vez e referenciado pelo seu rótulo.

```ts
domain.createMaterial('steel', { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection('IPE200', {
  a: 28.5e-4, // m²
  iy: 1943e-8, // m⁴
  h: 0.2, // m
  k: 5 / 6,
})
```

## Material {#material}

| Parâmetro | Significado | Unidade | Necessário para |
| --- | --- | --- | --- |
| `e` | Módulo de elasticidade (de Young) $E$ | Pa | sempre |
| `g` | Módulo de cisalhamento $G$ | Pa | sempre, a menos que `k` seja enorme (sem deformação por cisalhamento) |
| `alpha` | Coeficiente de dilatação térmica $\alpha$ | 1/K | cargas térmicas |
| `d` | Massa específica $\rho$ | kg/m³ | nada numa análise estática |

Um parâmetro omitido vale **1**, e não um valor típico, sem nenhum aviso. Esqueça `g` na viga de Primeiros passos e a flecha dela dá 22 700 km.

## Seção transversal {#cross-section}

| Parâmetro | Significado | Unidade | Necessário para |
| --- | --- | --- | --- |
| `a` | Área $A$ | m² | sempre: rigidez axial e ao cisalhamento |
| `iy` | Momento de inércia $I_y$ | m⁴ | sempre: rigidez à flexão |
| `k` | Coeficiente de cisalhamento $k$ | – | sempre: rigidez ao cisalhamento $kGA$ |
| `h` | Altura $h$ | m | gradientes térmicos |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, constante de torção | m⁴ | nada num modelo plano |

Uma seção não tem valores padrão. Omita `a`, `iy` ou `k` e todos os resultados dão `NaN`; omita `h` e um gradiente térmico dá `NaN`. Nenhum dos casos lança erro, então um resultado `NaN` quase sempre indica um parâmetro faltando.

## Deformação por cisalhamento {#shear-deformation}

A barra é uma viga de Timoshenko: ela se deforma não só por flexão, mas também por cisalhamento. A intensidade desse efeito depende de

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2},
$$

que `beam.computeShearFactor()` retorna. Em barras esbeltas, $\Phi$ é minúsculo e as flechas aumentam só uma fração de 1 %. Em barras curtas e altas, a diferença importa.

Para a viga de Euler–Bernoulli das tabelas dos livros, torne a rigidez ao cisalhamento praticamente infinita com um coeficiente de cisalhamento enorme, como fazem os exemplos do aplicativo EduBeam:

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

Os programas de exemplo destas páginas fazem isso, e por isso os seus números batem exatamente com as fórmulas. Para um coeficiente de cisalhamento real, $k = 5/6$ serve para um retângulo. A página [Conferir resultados à mão](/pt/guide/verification#shear-deformation) mostra o tamanho do efeito.

## Rigidez axial infinita {#rigid-in-axial-direction}

Uma área grande torna as barras praticamente inextensíveis, como o cálculo à mão costuma supor. Os esforços internos de um pórtico dependem pouco da área; os deslocamentos de uma treliça dependem inteiramente dela. Os esforços internos de uma estrutura isostática não dependem de rigidez nenhuma.

## Alterar depois {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Cada barra lê o seu material e a sua seção quando o solver monta o sistema, então basta um novo `solve()`. Barras diferentes podem usar seções diferentes: dê a cada uma o seu próprio rótulo.
