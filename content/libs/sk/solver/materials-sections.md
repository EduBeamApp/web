---
title: Materiály a prierezy
description: "Parametre materiálu a prierezu v @edubeam/fem: ktoré potrebuje ktorý výpočet, čo sa stane, keď niektorý chýba, a ako vypnúť šmykové deformácie."
order: 4
source: site
---

# Materiály a prierezy {#materials-and-sections}

Prvky berú svoju tuhosť z materiálu a prierezu. Každý z nich vytvoríte raz a potom sa naň odkazujete jeho označením.

```ts
domain.createMaterial('steel', { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection('IPE200', {
  a: 28.5e-4, // m²
  iy: 1943e-8, // m⁴
  h: 0.2, // m
  k: 5 / 6,
})
```

## Materiál {#material}

| Parameter | Význam | Jednotka | Potrebný pre |
| --- | --- | --- | --- |
| `e` | Modul pružnosti $E$ | Pa | vždy |
| `g` | Šmykový modul $G$ | Pa | vždy, ak `k` nie je veľmi veľké (šmykové deformácie vypnuté) |
| `alpha` | Súčiniteľ teplotnej rozťažnosti $\alpha$ | 1/K | zmena teploty |
| `d` | Hustota $\rho$ | kg/m³ | v statickom výpočte sa nepoužíva |

Parameter, ktorý vynecháte, má hodnotu **1**, nie nejakú obvyklú hodnotu, a nič vás neupozorní. Keď pri nosníku zo stránky Začíname zabudnete `g`, vyjde priehyb 22 700 km.

## Prierez {#cross-section}

| Parameter | Význam | Jednotka | Potrebný pre |
| --- | --- | --- | --- |
| `a` | Plocha $A$ | m² | vždy: osová a šmyková tuhosť |
| `iy` | Moment zotrvačnosti $I_y$ | m⁴ | vždy: ohybová tuhosť |
| `k` | Šmykový súčiniteľ $k$ | – | vždy: šmyková tuhosť $kGA$ |
| `h` | Výška $h$ | m | nerovnomerné oteplenie |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, moment tuhosti v krútení | m⁴ | v rovinnom modeli sa nepoužíva |

Prierez nemá žiadne predvolené hodnoty. Ak vynecháte `a`, `iy` alebo `k`, bude každý výsledok `NaN`; ak vynecháte `h`, dá nerovnomerné oteplenie `NaN`. Ani v jednom prípade nevznikne chyba, takže výsledok `NaN` takmer vždy znamená chýbajúci parameter.

## Šmykové deformácie {#shear-deformation}

Prvok je Timošenkov nosník: deformuje sa nielen ohybom, ale aj šmykom. Nakoľko, to závisí od

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2},
$$

ktoré vracia `beam.computeShearFactor()`. Pri štíhlych prútoch je $\Phi$ nepatrné a priehyby vzrastú o zlomok percenta. Pri krátkych a vysokých prútoch je vplyv podstatný.

Ak chcete nosník podľa Bernoulliho–Navierovej teórie ako v učebnicových tabuľkách, nastavte veľmi veľký šmykový súčiniteľ, aby bola šmyková tuhosť prakticky nekonečná. Rovnako to robia príklady v aplikácii EduBeam:

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

Postupy na týchto stránkach to robia tiež, takže ich čísla presne zodpovedajú vzorcom. Ak chcete skutočný šmykový súčiniteľ, pre obdĺžnik sa hodí $k = 5/6$. Aký veľký je tento vplyv, ukazuje stránka [Ručné overenie výsledkov](/sk/guide/verification#shear-deformation).

## Osovo tuhé prvky {#rigid-in-axial-direction}

Pri veľkej ploche sú prvky prakticky nepredĺžiteľné, ako zvyčajne predpokladá ručný výpočet. Vnútorné sily rámu závisia od plochy len málo, posunutia priehradovej konštrukcie od nej závisia úplne. Vnútorné sily staticky určitej konštrukcie od tuhosti nezávisia vôbec.

## Neskoršie zmeny {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Každý prvok si materiál a prierez načíta až vtedy, keď riešič zostavuje sústavu, takže stačí nové `solve()`. Rôzne prvky môžu mať rôzne prierezy: stačí dať každému prierezu vlastné označenie.
