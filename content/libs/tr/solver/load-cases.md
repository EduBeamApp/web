---
title: Yükleme durumları
description: "Bir @edubeam/fem modelinin birkaç yükleme durumunu birlikte çözün ve sonuçlarını süperpozisyonla yük kombinasyonları ve zarflar hâlinde birleştirin."
order: 8
source: site
---

# Yükleme durumları {#load-cases}

Yükleme durumu, birlikte çözülen bir yük takımıdır. Çözücü tek bir yükleme durumuyla başlar; yenilerini eklerseniz tek bir `solve()` çağrısı hepsini aynı rijitlik matrisiyle çözer. Analiz doğrusal olduğu için farklı yükleme durumlarının sonuçları katsayılarla çarpılıp toplanabilir: yük kombinasyonu da bundan ibarettir.

## Yükleme durumu eklemek {#add-a-load-case}

```ts [load-cases.ts]
import { DofID, LinearStaticSolver, LoadCase } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const dead = solver.loadCases[0] // her çözücünün başladığı yükleme durumu
const live = new LoadCase('live', domain)
solver.loadCases.push(live)

dead.createBeamElementUniformEdgeLoad(1, [0, 10e3], true) // 10 kN/m
live.createBeamConcentratedLoad(1, [0, 20e3, 0, 3], true) // açıklık ortasında 20 kN
solver.solve() // bütün yükleme durumlarını çözer

console.log(beam.computeBendingMomentAt(dead, 3)) // qL²/8
console.log(beam.computeBendingMomentAt(live, 3)) // PL/4
```

```text [Çıktı]
45000
30000
```

Her sonuç metodu, okuyacağı yükleme durumunu argüman olarak alır. İlk yükleme durumunun etiketi `'DefaultLC'` olur; etiketler yalnızca birer addır, çözücü yükleme durumlarını nesnenin kendisinden ayırt eder.

## Kombinasyon oluşturmak {#combine-them}

Her yükleme durumunun sonucunu kendi katsayısıyla çarpın ve toplayın. Eurocode'un taşıma gücü sınır durumu kombinasyonu $1{,}35\,G + 1{,}5\,Q$ için açıklık ortasındaki moment:

```ts
1.35 * beam.computeBendingMomentAt(dead, 3) +
  1.5 * beam.computeBendingMomentAt(live, 3) // 105750 N·m
```

Aynısı mesnet tepkileri, yer değiştirmeler ve diğer bütün sonuçlar için de geçerlidir. Bütün bir çubuk boyunca nokta nokta birleştirin: `computeBendingMoment(lc, n)` dizileri her yükleme durumu için aynı `x` değerlerini kullanır.

```ts
const n = 60
const g = beam.computeBendingMoment(dead, n).M
const q = beam.computeBendingMoment(live, n).M
const uls = g.map((m, i) => 1.35 * m + 1.5 * q[i])
Math.max(...uls) // 105750 N·m, x = 3'te
```

Zarf, yani birkaç kombinasyon içindeki en büyük ve en küçük değer, bu tür diziler üzerinde nokta nokta alınan bir `Math.max` ve `Math.min`'den ibarettir. Hareketli bir yük için ise her yük konumunda bir kez çözün: [tesir çizgisi örneği](/tr/solver/scripts#an-influence-line-as-csv) bunu yapar.

## EduBeam uygulamasında {#in-the-edubeam-app}

Uygulama aynı anda tek bir yükleme durumu çözer; kombinasyonlar, kütüphanenin uygulamadan daha ileri gittiği yerdir. Birkaç yükleme durumu olan bir model yine de durum durum [çizilebilir](/tr/solver/drawing): @edubeam/plot kütüphanesindeki `StructurePlot`, `solver.loadCases` içindeki sırayı gösteren bir `loadCase` indisi alır.
