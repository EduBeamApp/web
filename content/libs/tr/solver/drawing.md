---
title: Sonuçları çizmek
description: "Çözülmüş bir @edubeam/fem modelini @edubeam/plot ile çizin: bir Vue bileşeninde, Node betiğinden bağımsız bir SVG dosyası olarak ya da sonra çizilecek JSON olarak."
order: 11
source: site
---

# Sonuçları çizmek {#drawing-the-results}

[@edubeam/plot](/tr/plot), çözülmüş bir modeli bu sitedeki şekillerin görünümüyle çizer: çubuklar, mesnetler, yükler, mesnet tepkileri, N, V ve M diyagramları ve deforme şekil, hepsi SVG olarak. Çözücüyü ona verin; ihtiyaç duyduğu her şeyi kendisi okur.

```bash
npm install @edubeam/plot @edubeam/fem vue
```

## Bir Vue bileşeninde {#in-a-vue-component}

```vue [BeamFigure.vue]
<script setup lang="ts">
import { markRaw } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { StructurePlot } from '@edubeam/plot'

// 12 kN/m yüklü, 6 m açıklıklı basit mesnetli kiriş, SI birimleriyle: m, N, Pa
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // mafsallı mesnet
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // kayıcı mesnet
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

// Yalnızca okunur, izlenmez: markRaw, Vue'nun çözücüyü reaktif yapmasını önler
const beam = markRaw(solver)
</script>

<template>
  <StructurePlot
    :solver="beam"
    :layers="['members', 'supports', 'loads', 'reactions', 'M']"
  />
</template>
```

Bileşen 36 kN'luk mesnet tepkilerini ve 54 kNm'lik momenti çizer, tıpkı aşağıdaki canlı şekil gibi:

::model-figure{caption="BeamFigure.vue'nun çizdiği şekil"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
---
::

`StructurePlot` 0 numaralı yükleme durumunu çizer; `loadCase` prop'u `solver.loadCases` içinden başka birini seçer. Bileşen çözücüyü izlemez: modeli değiştirip yeniden çözdükten sonra yeniden çizdirmek için `revision` prop'unu değiştirin. Bütün seçenekler [StructurePlot](/tr/plot/structure-plot) sayfasındadır.

## Tarayıcı olmadan {#without-a-browser}

@edubeam/plot 0.2 ile gelen `structureSvg`, aynı çizimi bağımsız bir SVG dosyası olarak yazar; Word'ün, Inkscape'in ve LaTeX araç zincirlerinin anladığı düz renklerle. Tarayıcı da Vue bileşeni de gerekmez, bir Node betiği yeterlidir:

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { modelFromSolver, structureSvg } from '@edubeam/plot'

// BeamFigure.vue'daki kirişin aynısı
const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [6, 0, 0], [DofID.Dz])
domain.createBeam2D(1, ['A', 'B'], 1, 1)
solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, 12e3], true)
solver.solve()

const svg = structureSvg(modelFromSolver(solver), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
  width: 640,
})
writeFileSync('beam.svg', svg)
```

Dosya, yukarıdaki canlı şeklin gösterdiğini baskı renkleriyle gösterir. Ölçülecek bir kutu olmadığı için boyutunu piksel cinsinden `width` belirler. Yazdırılabilir bir sayfa dolusu şekil için böyle birkaç dosyayı tek bir HTML sayfasına koyun; @edubeam/plot belgelerindeki [sınav kâğıdı betiği](/tr/plot/exercises#print-a-test) de bunu ne Vue ne de tarayıcı kullanmadan yapar. `structureSvg` seçenekleri [Fonksiyonlar](/tr/plot/functions#a-standalone-svg-file) sayfasındadır.

## Çözücüyü değil, çizimi gönderin {#ship-the-drawing-not-the-solver}

`modelFromSolver`, çözülmüş bir modeli JSON'a dönüştürülebilir sade verilere çevirir: geometri, yükler, mesnet tepkileri ve her çubuğun sonuçları, kesin polinomlar olarak. Build sırasında çözün, JSON'u gönderin ve `solver` yerine `model` prop'uyla çizin:

```ts
import { modelFromSolver } from '@edubeam/plot'

// ... to-svg.ts'teki çözülmüş kiriş
writeFileSync('beam.json', JSON.stringify(modelFromSolver(solver)))
```

Böylece şekli gösteren sayfa hiçbir şey çözmez: iş bir kez, siz build ederken yapılır. Bileşen tarafını [Sayfalara gömme](/tr/plot/embedding#ship-the-drawing-not-the-solver), veri biçimini [Çizim modeli](/tr/plot/model) sayfası anlatır.

Renklerden imleçle değer okumaya ve sürüklenebilir yüklere kadar geri kalan her şey [@edubeam/plot belgelerinde](/tr/plot/getting-started) anlatılıyor.
