---
title: Sıcaklık ve mesnet çökmeleri
description: "@edubeam/fem çubuklarına düzgün sıcaklık değişimi ve sıcaklık farkı uygulayın, mesnetleri öngörülen yer değiştirmeyle hareket ettirin; kontrol edilmiş örneklerle."
order: 7
source: site
---

# Sıcaklık ve mesnet çökmeleri {#temperature-and-settlements}

Kuvvet olmayan iki yük: boyunu ya da eğriliğini değiştirmek isteyen bir çubuk ve yer değiştiren bir mesnet. İkisi de yalnızca yapının bu hareketi engellediği yerde iç kuvvet oluşturur; bu yüzden hiperstatik yapılar için iyi alıştırma malzemesidir. İkisinin de teorisi uygulamanın teori kılavuzunda, [Eleman yükleri](/tr/elements/beam#element-loads) bölümündedir.

## Sıcaklık {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| Değer | Anlamı | Serbest bir çubuğa etkisi |
| --- | --- | --- |
| `dTc` | ağırlık merkezindeki değişim, K | $\alpha\,\Delta T_c\,L$ kadar uzar |
| `dTb` | alt lifteki (yerel +z tarafı) değişim, K | `dTt` ile birlikte $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ eğriliği oluşturur |
| `dTt` | üst lifteki değişim, K | |

Çubuğu yalnızca `dTb - dTt` farkı eğer; bu yüzden `[30, 20, 0]` ile `[30, 10, -10]` aynı yüktür. Bu yük için malzemenin `alpha` değeri ve kesitin `h` değeri gerekir; `h` yoksa momentler `NaN` olur.

İki ucu ankastre bir kiriş ne uzayabilir ne de eğrilebilir; bu yüzden içinde basınç kuvveti ve eğilme momenti oluşur: $N = -EA\,\alpha\,\Delta T_c$ ve $M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$.

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// Ağırlık merkezi 30 K daha sıcak, alt lif üst liften 20 K daha sıcak
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N: EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m: EI · 12e-6 · 20 / 0.2
```

IPE 200 için $EA = 598{,}5$ MN ve $EI = 4{,}0803$ MNm²'dir. Alt lif daha sıcak olunca serbest bir kirişin uçları yukarı kalkar; ankastre mesnetler onu ters yöne eğer: negatif moment oluşur, üst lifler çekmededir.

::model-figure{caption="İki ucu ankastre kiriş: ağırlık merkezinde 30 K daha sıcak, alt lifi üst lifinden 20 K daha sıcak"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Basit mesnetli bir kirişte aynı yük hiç iç kuvvet oluşturmaz, yalnızca hareket oluşturur: kayıcı mesnet $\alpha\,\Delta T_c\,L = 2{,}16$ mm dışarı kayar ve açıklık ortası $\kappa L^2/8 = 5{,}4$ mm aşağı iner.

## Öngörülen yer değiştirmeler {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

Bir mesnedi belirli bir miktar hareket ettirir: `Dx` ve `Dz` için metre, `Ry` için radyan, düğümün kendi eksenlerinde. Bu serbestlik derecesi düğümün mesnedince tutulu olmalıdır; tutulu olmayan bir serbestlik derecesine verilen değer hiçbir uyarı olmadan yok sayılır.

Kayıcı mesnedi 10 mm çöken, bir ucu ankastre diğer ucu kayıcı mesnetli bir kiriş; sıcaklık örneğindeki malzeme ve kesitle, yeni bir çözücüde:

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // ankastre
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // kayıcı mesnet
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 10 mm aşağı
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N: 3EIw/L³
beam.computeBendingMomentAt(lc, 0) // A'da -3400.2 N·m: 3EIw/L²
```

Kirişin kendisini izlemesi için kayıcı mesnedin onu aşağı çekmesi gerekir; bu yüzden tepkisi +z yönünde, pozitiftir: $3EIw/L^3 = 3 \cdot 4{,}0803 \times 10^6 \cdot 0{,}01 / 216 = 566{,}7$ N.

::model-figure{caption="Ankastre–kayıcı mesnetli kirişin kayıcı mesnedi 10 mm çöküyor: ankastre uçta −3,4 kNm"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

Uygulamanın bu iki yükü nasıl çizdiğini [Yükler](/tr/essentials/loads) sayfası anlatır.
