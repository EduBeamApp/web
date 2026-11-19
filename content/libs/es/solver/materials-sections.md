---
title: Materiales y secciones
description: "Los parámetros de material y sección que usa @edubeam/fem, cuáles necesita cada análisis, qué pasa si falta uno y cómo desactivar la deformación por cortante."
order: 4
source: site
---

# Materiales y secciones {#materials-and-sections}

Las barras toman su rigidez de un material y de una sección, que se crean una sola vez y se citan por su etiqueta.

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

| Parámetro | Significado | Unidad | Se necesita para |
| --- | --- | --- | --- |
| `e` | Módulo de Young $E$ | Pa | siempre |
| `g` | Módulo de cortante $G$ | Pa | siempre, salvo que `k` sea enorme (sin deformación por cortante) |
| `alpha` | Coeficiente de dilatación térmica $\alpha$ | 1/K | cargas térmicas |
| `d` | Densidad $\rho$ | kg/m³ | nada en un análisis estático |

Un parámetro que omites vale **1**, no un valor típico, y nada te avisa. Olvida `g` en la viga de Primeros pasos y su flecha será de 22 700 km.

## Sección {#cross-section}

| Parámetro | Significado | Unidad | Se necesita para |
| --- | --- | --- | --- |
| `a` | Área $A$ | m² | siempre: rigidez axil y a cortante |
| `iy` | Momento de inercia $I_y$ | m⁴ | siempre: rigidez a flexión |
| `k` | Coeficiente de cortante $k$ | – | siempre: rigidez a cortante $kGA$ |
| `h` | Canto $h$ | m | gradientes térmicos |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, módulo de torsión | m⁴ | nada en un modelo plano |

Una sección no tiene valores por defecto. Si omites `a`, `iy` o `k`, todos los resultados son `NaN`; si omites `h`, un gradiente térmico da `NaN`. Ninguno de los dos casos lanza un error, así que un resultado `NaN` casi siempre significa que falta un parámetro.

## Deformación por cortante {#shear-deformation}

La barra es una viga de Timoshenko: se deforma por cortante además de por flexión. Cuánto se deforma por cortante depende de

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2},
$$

que devuelve `beam.computeShearFactor()`. En barras esbeltas $\Phi$ es muy pequeño y las flechas aumentan menos de un 1 %. En barras cortas y de mucho canto sí importa.

Para obtener la viga de Euler–Bernoulli de las tablas de los libros de texto, haz que la rigidez a cortante sea prácticamente infinita con un coeficiente de cortante enorme, como hacen los ejemplos de la aplicación EduBeam:

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

Los programas de ejemplo de estas páginas lo hacen así, para que sus números coincidan exactamente con las fórmulas. Como coeficiente de cortante real, $k = 5/6$ es adecuado para un rectángulo. En [Comprobar resultados a mano](/es/guide/verification#shear-deformation) se ve la magnitud del efecto.

## Barras rígidas axialmente {#rigid-in-axial-direction}

Un área grande hace que las barras sean prácticamente inextensibles, como suele suponerse en el cálculo a mano. Los esfuerzos de un pórtico dependen del área solo ligeramente; los desplazamientos de una celosía dependen de ella por completo. Los esfuerzos de una estructura isostática no dependen de ninguna rigidez.

## Modificarlos después {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Cada barra lee su material y su sección cuando el solver ensambla, así que basta con un nuevo `solve()`. Las barras pueden usar secciones distintas: da a cada sección su propia etiqueta.
