---
title: Sayfalara gömme
description: "@edubeam/plot şekilleri Vite, VitePress ve Nuxt'ta: sunucuda oluşturma, önceden çözülmüş modelleri JSON olarak gönderme ve Vue olmadan düz SVG."
order: 7
source: site
---

# Sayfalara gömme

Bileşenler düz Vue 3 bileşenleridir; Vue'nun çalıştığı her yerde çalışır ve tarayıcıda olduğu gibi sunucuda da oluşturulur. Bir şekil yerleştirilmeden (mount) önce hiçbir şey `window` nesnesine dokunmaz ve her şeklin kimlikleri (id) kendisine aittir; bu yüzden bir sayfada istediğiniz kadar şekil bulunabilir. Elinizdeki kuruluma göre seçin:

| Elinizde olan | Yapmanız gereken |
| --- | --- |
| Vite ile derlenen bir Vue uygulaması | Kurun, içe aktarın, bu kadar: [Vite uygulaması](#a-vite-app) |
| Markdown ile yazılmış ders notları | Eklentiyi VitePress'te bir kez kaydedin: [VitePress ile ders notları](#vitepress-course-notes) |
| Bir Nuxt sitesi | Bileşenleri içe aktarın veya bir eklenti ekleyin: [Nuxt](#nuxt) |
| Yalnızca şekil gösteren bir sayfa | Derleme sırasında çözün ve JSON gönderin: [Çözücüyü değil çizimi gönderin](#ship-the-drawing-not-the-solver) |
| Hiç Vue yok | SVG'yi Node'da yazın: [Vue olmadan](#plain-html-from-node) |

## Vite uygulaması {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Bileşenleri [Başlarken](/tr/plot/getting-started#draw-a-solved-model) sayfasındaki gibi kullandığınız yerde içe aktarın ya da ikisini `app.use(EduBeamPlot)` ile bir kez kaydedin. Yapılandırılacak başka bir şey yoktur: ne stil dosyası ne de bundler eklentisi gerekir.

## VitePress ile ders notları {#vitepress-course-notes}

[VitePress](https://vitepress.dev), Markdown sayfalarını Vue ile derler; bu yüzden ders notları için çok uygundur. Bileşenleri temada, `.vitepress/theme/index.ts` dosyasında kaydedin:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // her sayfada <StructurePlot> ve <DiagramStack>
  },
} satisfies Theme
```

Ardından modeli doğrudan sayfada, `frame.ts` dosyasının yanında kurun ve çizin:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => çözülmüş bir LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` çerçeveyi çözer ve bitmiş SVG'yi etiketleriyle birlikte sayfanın HTML'ine yazar. Tarayıcıda sayfa kontrolü devralır ve şekil kendini sütuna sığdırır. `frame.ts` dosyası [Slaytlar ve ders notları](/tr/plot/slides#a-figure-that-builds-up) sayfasındadır.

## Nuxt {#nuxt}

Nuxt da sunucuda oluşturur; bu site de onunla yapıldı. Bileşenleri bir sayfada veya bileşende her zamanki gibi içe aktarın ya da `plugins/edubeam-plot.ts` dosyasındaki bir eklentiyle tüm uygulama için kaydedin:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

Sunucuda ölçülecek bir kutu yoktur; bu yüzden şeklin yerleşimi `width` prop'una göre yapılır: varsayılan 640 px (`compact` ile 400 px), `DiagramStack` için 720 px. Şekil yerleştirildikten sonra gerçek genişliğinde yeniden yerleşir. Sütununuz bundan çok daha dar veya genişse `width` için daha yakın bir tahmin verin; böylece şekil sayfa yüklenirken boyut değiştirmez.

## Çözücüyü değil çizimi gönderin {#ship-the-drawing-not-the-solver}

Yalnızca bir şekil gösteren bir sayfanın çözücüye ihtiyacı yoktur. `modelFromSolver`, çözülmüş bir modeli düz veriye dönüştürür: düğümler, çubuklar, yükler, mesnet tepkileri ve her çubuğun N, V, M ve yer değiştirmeleri kesin polinomlar olarak. Bu veriyi derleme sırasında, örneğin `build-figures.ts` gibi bir betikle üretin:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

ve `model` prop'uyla çizin:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

Portal çerçeve 2 kB'tan küçük bir JSON'dur ve çözücüsünün çizdiğinin aynısını çizer. Her özellik bir modelle de bir çözücüyle olduğu gibi çalışır; ikisini birden verirseniz `model` geçerli olur. Biçim [Çizim modeli](/tr/plot/model) sayfasında anlatılır.

## Vue olmadan {#plain-html-from-node}

`structureSvg`, bir modeli bir SVG dosyasının metnine dönüştürür: sabit renkli, stilsiz ve betiksiz. Bu metni herhangi bir HTML'e, bir statik site üretecine, bir Markdown dosyasına veya bir içerik yönetim sistemine (CMS) yapıştırabilirsiniz. Şu betik tek şekilli bir sayfa yazar:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Böyle bir şekil yazıldığı boyuttadır, varsayılan olarak 640 px genişliğindedir (`max-width: 100%; height: auto` ile sütunla birlikte küçülür) ve kendi beyaz arka planı vardır; `background: false` arka planı saydam bırakır. Koyu temaya uymaz ve imlecin altındaki değerleri okumaz: bunlar için bileşeni kullanın. [Sınav kâğıdı betiği](/tr/plot/exercises#print-a-test) bütün bir sınavı bu şekilde yazdırır; seçenekler [Bağımsız bir SVG dosyası](/tr/plot/functions#a-standalone-svg-file) bölümünde listelenir.
