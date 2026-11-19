---
title: Slaytlar ve ders notları
description: "@edubeam/plot ile Slidev, Vue veya Beamer'da tıkladıkça oluşan, derste canlı çözülen ve SVG olarak ders notlarına, PowerPoint'e ve Word'e giren şekiller."
order: 6
source: site
---

# Slaytlar ve ders notları

Bir yapıyı anlattığınız sırayla gösterin: önce geometri, sonra mesnetler ve yükler, ardından mesnet tepkileri ve en son eğilme momenti. Çözülmüş bir modelden çizilen şekil, her tıklamada bir katman ekleyerek yerinde oluşur ve her zaman doğrudur. Aynı model, ders notlarınızın şekillerini de verir.

![0, 2 ve 4 tıklamadan sonra bir Slidev slaytı: önce ölçüleriyle birlikte bir portal çerçevenin düğümleri, sonra mesnetleri ve yükleriyle çerçeve, en son mesnet tepkileri ve eğilme momenti](/screenshots/tr/p2p-plot-slidev-steps.webp){.shot-md}

## Adım adım oluşan şekil {#a-figure-that-builds-up}

İki dosya. `frame.ts` yapıyı oluşturur ve çözer:

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Portal çerçeve: 6 m × 4 m, mafsallı kolon ayakları, kirişte 10 kN/m ve B'yi iten 15 kN. */
export const portalFrame = (): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 }) // IPE 300
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [0, 0, -4]) // z aşağı doğru: 4 m yukarıda
  domain.createNode('C', [6, 0, -4])
  domain.createNode('D', [6, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  domain.createBeam2D(3, ['C', 'D'], 1, 1)
  solver.loadCases[0].createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 15e3 })
  solver.solve()
  return solver
}
```

`BuildUp.vue` onu adım adım çizer. Her adım gösterdiği katmanları listeler; `reserve` ise hepsini ilk tıklamadan itibaren yerleştirir. Böylece her katman ait olduğu yerde belirir ve hiçbir şey kaymaz:

```vue [BuildUp.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { StructurePlot, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame'

const props = defineProps<{ step: number }>()

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'], // geometri
  ['nodeLabels', 'members', 'supports'], // yapı
  ['nodeLabels', 'members', 'supports', 'loads'], // yükleri
  ['members', 'supports', 'loads', 'reactions'], // mesnet tepkileri
  ['members', 'supports', 'reactions', 'M'], // ve eğilme momenti
]
const all = [...new Set(stages.flat())] // ilk adımdan itibaren yerleştirilir, sonra hiçbir şey kaymaz
const layers = computed(() => stages[Math.min(props.step, stages.length - 1)])

const frame = portalFrame()
</script>

<template>
  <StructurePlot :solver="frame" :layers="layers" :reserve="all" :height="360" />
</template>
```

Bir katman kaybolabilir de: son adım, momente yer açmak için yükleri kaldırır. `:height="360"` şekli slaytın içinde tutar. Çubuklar ilk göründüklerinde bir uçtan diğerine doğru çizilir, katmanlar da yarım saniyede belirir; `prefers-reduced-motion` ayarlıysa ikisi de kapalıdır, `:animate="false"` ise onları herkes için kapatır. Animasyonları amfi için yavaşlatmak isterseniz bkz. [Animasyonu yeniden biçimlendirme](/tr/plot/theming#restyling-the-animation).

## Slidev'de {#in-slidev}

[Slidev](https://sli.dev), Markdown'dan Vue ile slayt üretir; bu yüzden bileşen orada olduğu gibi çalışır. Kütüphaneleri sunumun projesine kurun:

```bash
npm install @edubeam/plot @edubeam/fem
```

`frame.ts` ve `BuildUp.vue` dosyalarını sunumun `components/` klasörüne koyun ve `slides.md` içinde adımı slaydın tıklamalarına bağlayın:

```md [slides.md]
---
clicks: 4
---

# From geometry to bending moment

<BuildUp :step="$clicks" />
```

`clicks: 4` slayda dört tıklama verir, `$clicks` da onları 0'dan itibaren sayar. Ok tuşuna her basış bir sonraki adımı gösterir; geri gitmek onu yeniden gizler. `slidev export` sunumun PDF'ini üretir; `--with-clicks` ile her tıklama ayrı bir sayfa olur.

## Herhangi bir Vue slayt sisteminde {#in-any-vue-slides}

Başka her yerde adımı kendiniz tutun:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import BuildUp from './BuildUp.vue'

const step = ref(0)
</script>

<template>
  <BuildUp :step="step" />
  <button type="button" @click="step = Math.max(0, step - 1)">Back</button>
  <button type="button" @click="step++">Next</button>
</template>
```

## Canlı çözün {#solve-it-live}

Çözücü böyle bir çerçeveyi milisaniyeler içinde çözer; bu yüzden derste yapıyı değiştirip hemen orada çözebilirsiniz. Bir yükü bir kaydırıcıya bağlayın ve her seferinde yeni çözülmüş modeli verin; [Model değiştiğinde](/tr/plot/getting-started#when-the-model-changes) bölümündeki gibi.

- **Kiriş üzerinde gezen yük.** [DiagramStack](/tr/plot/diagram-stack#a-load-the-reader-can-drag), öğrencilerin bir tekil yükü kiriş boyunca sürüklemesine ve kesme kuvveti ile eğilme momentinin onu nasıl izlediğini görmesine olanak verir.
- **Durumları yan yana.** [`diagramScale`](/tr/plot/structure-plot#several-plots-at-one-scale) değerini sabitleyin; iki şekil momentlerini aynı ölçekte çizer ve büyük olan gerçekten büyük görünür.
- **Değer okuma.** `hover` açıkken imleci bir çubuğun üzerine getirdiğinizde her diyagramın ordinat ucundaki değer işaretlenir: bkz. [Değer okuma](/tr/plot/structure-plot#reading-values).

## Beamer, PowerPoint ve Word için şekiller {#figures-for-beamer-powerpoint-and-word}

LaTeX Beamer veya PowerPoint ile hazırlanan bir sunum ya da Word'de yazılan ders notları, şekli dosya olarak alır. `structureSvg`, şekli `StructurePlot` ile aynı yerleşimde, sabit renkli, bağımsız bir SVG olarak yazar. `frame.ts` dosyasının yanına `frame-svg.ts` adlı bir Node betiği koyun:

```ts [frame-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![CairoSVG ile çizilmiş, bağımsız SVG dosyası olarak portal çerçeve: yükler, yukarı doğru 20 ve 40, yatayda 2,3 ve 12,7 mesnet tepkileri ve C'deki −50,7'den kirişteki 29,3'e uzanan eğilme momenti](/screenshots/tr/p2p-plot-frame-svg.webp){.shot-lg}

PowerPoint ve Word (2019 ve Microsoft 365) SVG'yi olduğu gibi ekler. LaTeX onu PDF olarak alır: `cairosvg frame.svg -o frame.pdf` ile veya Inkscape ile dönüştürün ya da bu işi `svg` paketinin `\includesvg` komutuna bırakın. Ayrıntılar [LaTeX ve Word için şekiller](/tr/plot/exercises#figures-for-latex-and-word) bölümünde, tüm seçenekler [Bağımsız bir SVG dosyası](/tr/plot/functions#a-standalone-svg-file) bölümündedir.

### Beamer'da adım adım oluşan şekil {#a-build-up-in-beamer}

Bir dosya çizdiği katmanlara göre boyutlandırılır; bu yüzden her adım için ayrı ayrı yazılan dosyalar üst üste oturmaz. `structureSvg` fonksiyonuna `BuildUp.vue` ile aynı `reserve` değerini, yani tüm adımların tüm katmanlarını verin: her dosya aynı boyutta olur ve yapı hepsinde aynı yerde durur. `frame-stages.ts` her adım için bir dosya yazar:

```ts [frame-stages.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg, type PlotLayer } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
const frame = modelFromSolver(portalFrame())

stages.forEach((layers, i) => {
  writeFileSync(`frame-${i + 1}.svg`, structureSvg(frame, { layers, reserve: all }))
})
```

Dosyaları PDF'e dönüştürün:

```bash
for i in 1 2 3 4 5; do cairosvg frame-$i.svg -o frame-$i.pdf; done
```

ve her birine kendi overlay'ini verin. Her dosya bir adımın tamamını içerir; bu yüzden slayt aynı anda yalnızca birini gösterir. Dosyalar üst üste oturduğu için her tıklama bir katman ekliyormuş gibi görünür:

```latex [lecture.tex]
\begin{frame}{From geometry to bending moment}
  \centering
  \includegraphics<1>[width=0.8\linewidth]{frame-1.pdf}%
  \includegraphics<2>[width=0.8\linewidth]{frame-2.pdf}%
  \includegraphics<3>[width=0.8\linewidth]{frame-3.pdf}%
  \includegraphics<4>[width=0.8\linewidth]{frame-4.pdf}%
  \includegraphics<5>[width=0.8\linewidth]{frame-5.pdf}
\end{frame}
```

PowerPoint'te beş dosyayı aralarında geçiş efekti olmadan art arda beş slayta koyun: her adım, dersteki bir tıklamayla aynı görünür.

## Ders notları ve dağıtılan notlar {#notes-and-handouts}

- **Web'de ders notları.** VitePress ve Nuxt şekilleri derleme sırasında oluşturur; şekiller herhangi bir betik çalışmadan önce HTML'de hazırdır: bkz. [Sayfalara gömme](/tr/plot/embedding).
- **Basılı notlar.** [Sınav kâğıdı betiğinin](/tr/plot/exercises#print-a-test) yaptığı gibi şekilleri `structureSvg` ile bir HTML sayfasına yazıp yazdırın ya da dosyaları LaTeX veya Word belgenize ekleyin.
- **Tek model, tüm şekiller.** Aynı `frame.ts` slaytları, ders notlarını ve föyü besler; bu yüzden aralarında hiçbir zaman çelişki olmaz.
