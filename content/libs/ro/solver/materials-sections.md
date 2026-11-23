---
title: Materiale și secțiuni
description: "Parametrii de material și de secțiune pe care îi folosește @edubeam/fem, care sunt necesari pentru fiecare tip de calcul, ce se întâmplă când lipsește unul și cum se dezactivează deformația din forfecare."
order: 4
source: site
---

# Materiale și secțiuni {#materials-and-sections}

Barele își iau rigiditatea dintr-un material și o secțiune transversală, fiecare creat o singură dată și identificat prin eticheta lui.

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

| Parametru | Semnificație | Unitate | Necesar pentru |
| --- | --- | --- | --- |
| `e` | Modulul de elasticitate longitudinal (Young) $E$ | Pa | întotdeauna |
| `g` | Modulul de elasticitate transversal $G$ | Pa | întotdeauna, cu excepția cazului în care `k` este uriaș (fără deformație din forfecare) |
| `alpha` | Coeficientul de dilatare termică $\alpha$ | 1/K | încărcări din variație de temperatură |
| `d` | Densitatea $\rho$ | kg/m³ | nimic într-un calcul static |

Un parametru pe care îl omiți are valoarea **1**, nu o valoare tipică, și nimic nu te avertizează. Uită `g` la grinda din Primii pași și săgeata ei va fi de 22 700 km.

## Secțiune transversală {#cross-section}

| Parametru | Semnificație | Unitate | Necesar pentru |
| --- | --- | --- | --- |
| `a` | Aria $A$ | m² | întotdeauna: rigiditatea axială și la forfecare |
| `iy` | Momentul de inerție $I_y$ | m⁴ | întotdeauna: rigiditatea la încovoiere |
| `k` | Coeficientul de forfecare $k$ | – | întotdeauna: rigiditatea la forfecare $kGA$ |
| `h` | Înălțimea $h$ | m | diferențe de temperatură între fețe |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, momentul de inerție la răsucire | m⁴ | nimic într-un model plan |

O secțiune transversală nu are valori implicite. Omite `a`, `iy` sau `k` și toate rezultatele sunt `NaN`; omite `h` și o diferență de temperatură între fețe dă `NaN`. Niciuna dintre situații nu aruncă o eroare, așa că un rezultat `NaN` înseamnă aproape întotdeauna un parametru lipsă.

## Deformația din forfecare {#shear-deformation}

Bara este o grindă Timoshenko: se deformează din forfecare, nu doar din încovoiere. Cât de mult depinde de

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2},
$$

valoare pe care o întoarce `beam.computeShearFactor()`. La barele zvelte $\Phi$ este foarte mic, iar săgețile cresc cu o fracțiune de procent. La barele scurte și înalte contează.

Pentru grinda Euler–Bernoulli din tabelele manualelor, fă rigiditatea la forfecare practic infinită cu un coeficient de forfecare uriaș, cum fac exemplele din aplicația EduBeam:

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

Exemplele de programe de pe aceste pagini fac la fel, așa că valorile lor coincid exact cu formulele. Ca valoare reală a coeficientului de forfecare, $k = 5/6$ corespunde unei secțiuni dreptunghiulare. Pagina [Verificarea rezultatelor prin calcul manual](/ro/guide/verification#shear-deformation) arată cât de mare este efectul.

## Bare rigide axial {#rigid-in-axial-direction}

O arie mare face barele practic inextensibile, cum presupune de obicei calculul manual. Eforturile dintr-un cadru depind doar puțin de arie; deplasările unei grinzi cu zăbrele depind în întregime de ea. Eforturile dintr-o structură static determinată nu depind de nicio rigiditate.

## Modificarea ulterioară {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Fiecare bară își citește materialul și secțiunea atunci când programul de calcul asamblează matricea de rigiditate, așa că un nou `solve()` este suficient. Bare diferite pot folosi secțiuni diferite: dă fiecăreia propria etichetă.
