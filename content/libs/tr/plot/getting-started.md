---
title: Başlarken
description: "@edubeam/plot kurulumu: @edubeam/fem ile çözülmüş bir kirişi Vue 3'te yükleri, mesnet tepkileri ve momentiyle çizin, güncelleyin ve SVG olarak kaydedin."
order: 1
group: Giriş
source: site
---

# Başlarken

@edubeam/plot çizim kütüphanesi düzlem bir kirişi, çerçeveyi veya kafes sistemi sonuçlarıyla birlikte SVG olarak çizer: çubuklar, mesnetler, yükler, mesnet tepkileri, N, V ve M diyagramları ve deforme şekil, tıpkı bu sitedeki şekiller gibi. Kütüphaneye [EduBeam]{.edubeam} uygulamasının arkasındaki çözücü [@edubeam/fem](/tr/solver) ile çözülmüş bir model verirsiniz; yerleşimi, ölçeği ve her sayının nereye yazılacağını kütüphane kendisi belirler.

Öğretim elemanları bu kütüphaneyle tohum değerinden (rastgele sayı üretecinin başlangıç değeri) üretilen [alıştırmalar ve sınavlar](/tr/plot/exercises), her tıklamada bir adım ilerleyen [slaytlar](/tr/plot/slides) ve ders notları için şekiller hazırlar; şekiller bir web sayfasında ya da LaTeX ve Word için dosya olarak kullanılabilir. Bu sitedeki [alıştırmalar](/tr/practice) ve [sınav oluşturucu](/tr/exam) da bu kütüphaneyle yapıldı.

::div{.actions}
[İlk şeklinizi çizin](#draw-a-solved-model) [Soru üretin](/tr/plot/exercises)
::

## Kurulum {#install}

```bash
npm install @edubeam/plot @edubeam/fem vue
```

Vue 3.5 veya üstü ve çözücü, peer dependency olarak tanımlıdır; böylece uygulamanızda her birinin tek bir kopyası bulunur. Paket yalnızca ESM'dir, kendi tiplerini içerir ve stil dosyası gerektirmez. Node 20.19 veya üstünde çalışır; TypeScript ile yazılmış bir betiği olduğu gibi, `node script.ts` komutuyla çalıştırmak için Node 22.18 veya üstü gerekir.

## Çözülmüş bir modeli çizin {#draw-a-solved-model}

İki dosya yeterli. Birincisi, `beams.ts`, @edubeam/fem ile bir kirişi oluşturur ve çözer. Sıradan bir fonksiyon olduğu için aynı model bir sayfada, bir slaytta ve bir betikte kullanılabilir:

```ts [beams.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** `span` m açıklıklı, `q` kN/m yüklü, çözülmüş basit mesnetli kiriş. Çözücü SI birimleriyle çalışır. */
export const simpleBeam = (span: number, q: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 }) // çelik, Pa
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 }) // IPE 200, kaymada rijit
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // mafsallı mesnet
  domain.createNode('B', [span, 0, 0], [DofID.Dz]) // kayıcı mesnet
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true) // N/m, +z aşağı doğru
  solver.solve()
  return solver
}
```

İkincisi, `BeamFigure.vue`, çözücüyü `StructurePlot` bileşenine verir ve neyin çizileceğini söyler:

```vue [BeamFigure.vue]
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const beam = simpleBeam(6, 12)
</script>

<template>
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

Şeklin tamamı bu kadar: mesnetleri üzerindeki kiriş, 12 kN/m yük, her biri 36 kN olan iki mesnet tepkisi ve açıklık ortasında $qL^2/8 = 54$ kNm değerine ulaşan, çekme tarafına çizilmiş eğilme momenti:

::model-figure{caption="BeamFigure.vue'nun çizdiği şekil: 12 kN/m yüklü, 6 m açıklıklı kiriş"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M]
labels: horizontal
---
::

Şekil, içinde bulunduğu kutunun genişliğini doldurur ve yüksekliğini kendisi belirler. Yapı ne büyüklükte olursa olsun metin, semboller ve çizgi kalınlıkları piksel cinsinden boyutlarını korur; bu sayede şekil telefonda da okunaklı kalır. `layers` prop'unu vermezseniz gösterilecek sonucu kütüphane seçer: kirişler ve çerçeveler için M, kafes sistem için N. Tüm [katmanlar](/tr/plot/structure-plot#layers) `StructurePlot` sayfasında listelenir; model kurmayı ise [çözücü belgeleri](/tr/solver/getting-started) anlatır.

## Model değiştiğinde {#when-the-model-changes}

Şekil kendisine verilen çözücüyü okur, onu izlemez. Bir şey değiştiğinde modeli yeniden çözün ve yeni çözücüyü verin. Bir `computed` tam olarak bunu yapar:

```vue [LoadSlider.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams'

const q = ref(12) // kN/m
const beam = computed(() => simpleBeam(6, q.value))
</script>

<template>
  <input v-model.number="q" type="range" min="1" max="30" />
  <StructurePlot :solver="beam" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
</template>
```

Böyle bir kiriş yaklaşık bir milisaniyede çözülür; şekil, kaydırıcı hareket ettikçe onu izler. Çözücüyü yerinde mi değiştirdiniz? `revision` prop'unun değerini artırın, şekil çözücüyü yeniden okur.

::callout{type="tip" title="Çözücüleri derin reaktiviteden uzak tutun"}
Bir `computed`, bir prop veya düz bir `const` çözücüyü olduğu gibi tutar. Bileşen durumunda bir çözücü saklamak için `shallowRef` kullanın ya da onu `markRaw` ile sarın: düz bir `ref` ise Vue'nun çözücünün tamamını boşu boşuna dolaşıp reaktif yapmasına yol açar.
::

## Dosya olarak kaydedin {#save-it-as-a-file}

LaTeX, Word veya Inkscape'te kullanılacak bir şekil için `structureSvg`, aynı çizimi sabit renkli, bağımsız bir SVG dosyası olarak yazar. Ne Vue'ya ne de tarayıcıya ihtiyaç duyar, Node yeterlidir. Aşağıdaki kodu `beams.ts` dosyasının yanına `beam-svg.ts` adıyla kaydedin:

```ts [beam-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { simpleBeam } from './beams.ts'

const svg = structureSvg(modelFromSolver(simpleBeam(6, 12)), {
  layers: ['members', 'supports', 'loads', 'reactions', 'M'],
})
writeFileSync('beam.svg', svg)
```

Betiği `node beam-svg.ts` ile çalıştırın (Node 22.18 veya üstü; daha eski sürümlerde `npx tsx beam-svg.ts`). Seçenekler ve dosyanın LaTeX ile Word'e nasıl aktarılacağı [Bağımsız bir SVG dosyası](/tr/plot/functions#a-standalone-svg-file) bölümündedir.

## Alt alta diyagramlar {#the-stacked-figure}

`DiagramStack`, her statik ders kitabında bulunan şekli çizer: yükleriyle birlikte düz bir kiriş ve altında, aynı x ekseni üzerinde V(x), M(x) ve w(x). `v-model:load-at` ile okuyucu tekil bir yükü kiriş boyunca sürükleyebilir ve diyagramların onu nasıl izlediğini görebilir:

```vue
<DiagramStack v-model:load-at="at" :solver="solveWithLoadAt(at)" />
```

Örneğin tamamı [DiagramStack](/tr/plot/diagram-stack) sayfasındadır.

## Her yerde kullanın {#use-it-everywhere}

İki bileşeni kullandığınız her yerde ayrı ayrı içe aktarmak yerine global olarak kaydetmek için:

```ts [main.ts]
import { createApp } from 'vue'
import { EduBeamPlot } from '@edubeam/plot'
import App from './App.vue'

createApp(App).use(EduBeamPlot).mount('#app') // her şablonda <StructurePlot> ve <DiagramStack>
```

Adlandırılmış içe aktarmalar (named import) paketi küçük tutar: yalnızca `StructurePlot` bileşenini içe aktaran bir sayfaya ne `DiagramStack` ne de eklenti dahil olur. İki bileşen Nuxt veya VitePress'te sunucuda da oluşturulabilir: bkz. [Sayfalara gömme](/tr/plot/embedding).

## Sırada ne var {#next}

::card-grid{cols="2"}
:::card{title="Alıştırmalar ve sınavlar" icon="lucide:dices" to="/tr/plot/exercises"}
Tohum değerinden her öğrenciye ayrı bir soru ve cevap anahtarı; basılı olarak ya da LaTeX için dosya olarak.
:::
:::card{title="Slaytlar ve ders notları" icon="lucide:presentation" to="/tr/plot/slides"}
Slidev, Vue veya Beamer'da tıkladıkça adım adım oluşan şekiller ve ders notları için aynı şekiller.
:::
:::card{title="StructurePlot" icon="lucide:frame" to="/tr/plot/structure-plot"}
Katmanlar, ölçüler, küçük resimler, boyutlar, birimler ve imleçle değer okuma.
:::
:::card{title="DiagramStack" icon="lucide:rows-3" to="/tr/plot/diagram-stack"}
V, M ve w diyagramlarının üzerinde, okuyucunun sürükleyebileceği bir yük taşıyan kiriş.
:::
::
