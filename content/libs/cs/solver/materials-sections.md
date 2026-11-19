---
title: Materiály a průřezy
description: "Parametry materiálu a průřezu v @edubeam/fem: které potřebuje který výpočet, co se stane, když některý chybí, a jak vypnout smykovou deformaci."
order: 4
---

# Materiály a průřezy {#materials-and-sections}

Prvky berou svou tuhost z materiálu a průřezu. Každý z nich vytvoříte jednou a odkazujete se na něj jeho označením.

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

| Parametr | Význam | Jednotka | Potřeba pro |
| --- | --- | --- | --- |
| `e` | Modul pružnosti $E$ | Pa | vždy |
| `g` | Modul pružnosti ve smyku $G$ | Pa | vždy, pokud `k` není obrovské (bez smykové deformace) |
| `alpha` | Součinitel teplotní roztažnosti $\alpha$ | 1/K | změna teploty |
| `d` | Hustota $\rho$ | kg/m³ | ve statickém výpočtu se nepoužívá |

Parametr, který vynecháte, má hodnotu **1**, ne nějakou obvyklou hodnotu, a nic vás neupozorní. Když u nosníku ze stránky Začínáme zapomenete `g`, vyjde průhyb 22 700 km.

## Průřez {#cross-section}

| Parametr | Význam | Jednotka | Potřeba pro |
| --- | --- | --- | --- |
| `a` | Plocha $A$ | m² | vždy: osová a smyková tuhost |
| `iy` | Moment setrvačnosti $I_y$ | m⁴ | vždy: ohybová tuhost |
| `k` | Smykový součinitel $k$ | – | vždy: smyková tuhost $kGA$ |
| `h` | Výška $h$ | m | nerovnoměrné oteplení |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, moment tuhosti v kroucení | m⁴ | v rovinném modelu se nepoužívá |

Průřez nemá žádné výchozí hodnoty. Vynecháte-li `a`, `iy` nebo `k`, bude každý výsledek `NaN`; vynecháte-li `h`, dá nerovnoměrné oteplení `NaN`. Ani v jednom případě nevznikne chyba, takže výsledek `NaN` téměř vždy znamená chybějící parametr.

## Smyková deformace {#shear-deformation}

Prvek je Timošenkův nosník: deformuje se nejen ohybem, ale i smykem. Jak moc, záleží na

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2},
$$

které vrací `beam.computeShearFactor()`. U štíhlých prutů je $\Phi$ nepatrné a průhyby vzrostou o zlomek procenta. U krátkých a vysokých prutů je vliv podstatný.

Chcete-li nosník podle Bernoulliho–Navierovy teorie jako v učebnicových tabulkách, nastavte obrovský smykový součinitel, aby byla smyková tuhost prakticky nekonečná. Stejně to dělají příklady v aplikaci EduBeam:

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

Postupy na těchto stránkách to dělají také, takže jejich čísla přesně odpovídají vzorcům. Pokud chcete skutečný smykový součinitel, pro obdélník se hodí $k = 5/6$. Jak velký je tento vliv, ukazuje stránka [Ověření výsledků ručně](/cs/guide/verification#shear-deformation).

## Osově tuhé prvky {#rigid-in-axial-direction}

S velkou plochou jsou prvky prakticky neprotažitelné, jak obvykle předpokládá ruční výpočet. Vnitřní síly rámu závisí na ploše jen málo, posuny příhradové konstrukce na ní závisí zcela. Vnitřní síly staticky určité konstrukce nezávisí na tuhosti vůbec.

## Pozdější změny {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Každý prvek si materiál a průřez načte, až když řešič sestavuje soustavu, takže stačí nové `solve()`. Různé prvky mohou mít různé průřezy: stačí dát každému průřezu vlastní označení.
