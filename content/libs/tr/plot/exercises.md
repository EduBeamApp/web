---
title: Alıştırmalar ve sınavlar
description: "@edubeam/fem ve @edubeam/plot ile tohum değerinden her öğrenciye ayrı bir soru ve her zaman doğru cevap anahtarı: web sayfasında, basılı ya da SVG olarak."
order: 5
group: Kullanım alanları
source: site
---

# Alıştırmalar ve sınavlar

Bir yapıyı bir kez, tohum değerinin (rastgele sayı üretecinin başlangıç değeri) bir fonksiyonu olarak yazın; her öğrenciye, her hafta ayrı bir soru elde edersiniz ve her sorunun cevap anahtarı her zaman doğrudur: soruyu @edubeam/fem çözer, @edubeam/plot da soruyu ve cevap anahtarını aynı modelden çizer.

Aşağıdaki **Yeni soru** düğmesine basın. Her basış yeni bir tohum değeridir: soru tarayıcınızda üretilir, çözülür ve çizilir.

::exercise-generator
::

Bu örnek, sitedeki iki sayfanın sorularını çizer; ikisi de burada anlatılan parçalardan oluşur. [Alıştırmalar](/tr/practice) sayfasında öğrenci mesnet tepkilerini ve en büyük momenti veya çubuk kuvvetini girer ve cevabının doğru olup olmadığını hemen öğrenir. [Sınav oluşturucu](/tr/exam) ise her öğrenciye ayrı bir grup olmak üzere cevap anahtarlı sınav kâğıtları yazdırır; şekilleri SVG dosyası, cevapları CSV olarak kaydeder. Kendinizinkini yazmadan önce bunları deneyin.

## Nasıl çalışır {#how-it-works}

1. **Tohum değeri sayıları seçer.** Tohum değeriyle başlatılan bir rastgele sayı üreteci aynı tohum değeri için hep aynı soruyu verir; böylece kâğıda basılan tohum değeriyle sorunun cevap anahtarı yeniden bulunur.
2. **Cevap anahtarını çözücü hesaplar.** Her yapıyı @edubeam/fem çözer; mesnet tepkileri ve momentler, yanlış yazılabilecek bir formülden değil, çözücüden gelir.
3. **İkisini de çizim kütüphanesi çizer.** Soru, yapıyı düğüm etiketleri, ölçüleri ve adlarıyla gösterilen bilinmeyen mesnet tepkileriyle gösterir; cevap anahtarı mesnet tepkilerinin değerlerini verir ve diyagramı ekler.

Birkaç kısa dosya sizi buradan basılı bir sınava götürür: [üreteç](#the-generator), web sayfası için [bir bileşen](#the-exercise-in-a-page) ve [bir betik](#print-a-test). Betik bir sınavı yazdırır ya da LaTeX ve Word için [şekilleri dosya olarak yazar](#figures-for-latex-and-word). Bunları [kütüphanelerin kurulu olduğu](/tr/plot/getting-started#install) bir projeye kopyalayın; betikler 22.18 sürümünden itibaren `node` ile, daha eski sürümlerde `npx tsx` ile çalışır.

## Üreteç {#the-generator}

Tek bir modül, `exercise.ts`, bir tohum değerini bir soruya dönüştürür: mafsallı ve kayıcı mesnet üzerinde bir kiriş; durumların yarısında ucunda tekil yük taşıyan bir konsolu vardır. İki durum da izostatiktir; bu yüzden her tohum değeri çözücüyle olduğu gibi elle de çözülebilir.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** Düz veri olarak çözülmüş yapı: hem soruyu hem cevap anahtarını çizer */
  readonly model: PlotModel
  /** Yukarı doğru mesnet tepkileri, N, ve ekstremum eğilme momentleri, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: tohum değeriyle çalışan küçük bir üreteç; aynı tohum değeri her zaman aynı soruyu verir */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const makeExercise = (seed: number): Exercise => {
  const r = random(seed)
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

  // Mafsallı ve kayıcı mesnet üzerinde bir açıklık, durumların yarısında konsollu: izostatik, dolayısıyla hep çözülebilir
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m, konsol boyu
  const q = int(4, 12) // kN/m, açıklıkta
  const F = int(2, 6) * 5 // kN, konsol ucunda; konsol yoksa A'dan `a` uzaklıkta
  const a = int(1, L - 1) // m

  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  if (c > 0) {
    domain.createNode('C', [L + c, 0, 0])
    domain.createBeam2D(2, ['B', 'C'], 1, 1)
    lc.createNodalLoad('C', { [DofID.Dz]: F * 1e3 })
  } else {
    lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  }
  solver.solve()

  const statement =
    c > 0
      ? `Span L = ${L} m with an overhang c = ${c} m. q = ${q} kN/m on the span, F = ${F} kN at the tip C.`
      : `Span L = ${L} m. q = ${q} kN/m over the span, F = ${F} kN at ${a} m from A.`

  // Çözülmüş modelden cevap anahtarı: mesnet tepkileri (z aşağı doğru, bu yüzden yukarı eksidir), M'nin kesin ekstremumları
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver`, çözülmüş yapıyı bir [çizim modeline](/tr/plot/model) dönüştürür: mesnet tepkilerini ve her çubuğun sonuçlarını kesin polinomlar olarak içeren düz veri. Bu sayede `extremes`, en büyük momentleri örnekleme yapmadan bulur. Soru yalnızca bu modeli saklar; çözücüye artık ihtiyaç yoktur.

Tohum değeri 5 şu soruyu verir: *“Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.”* (6 m açıklık, 1,5 m konsol, açıklıkta q = 5 kN/m, konsol ucu C'de F = 25 kN). Cevap anahtarı: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, mesnet üzerinde $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm ve açıklıkta, kesme kuvvetinin sıfır olduğu yerde, $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm. Çözücü son basamağına kadar aynı sonucu verir.

## Web sayfasında {#the-exercise-in-a-page}

`ExerciseCard.vue` bileşeni soruyu, `answers` ile de cevap anahtarını çizer:

```vue [ExerciseCard.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { formatQuantity, KN_UNITS, StructurePlot, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise'

const props = defineProps<{ seed: number; answers?: boolean }>()
const exercise = computed(() => makeExercise(props.seed))

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const twoDecimals = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const kN = (si: number) => formatQuantity(si, KN_UNITS.force, twoDecimals)
const kNm = (si: number) => formatQuantity(si, KN_UNITS.moment, twoDecimals)
</script>

<template>
  <article>
    <h3>Exercise {{ seed }}</h3>
    <p>{{ exercise.statement }} Find the reactions and draw the bending moment diagram.</p>
    <StructurePlot
      :model="exercise.model"
      :layers="answers ? key : sheet"
      :reserve="[...sheet, ...key]"
      :reaction-labels="answers ? 'values' : 'names'"
      :reserve-reaction-labels="['names', 'values']"
    />
    <p v-if="answers">
      R<sub>A</sub> = {{ kN(exercise.key.RA) }}, R<sub>B</sub> = {{ kN(exercise.key.RB) }},
      M from {{ kNm(exercise.key.mMin) }} to {{ kNm(exercise.key.mMax) }}
    </p>
  </article>
</template>
```

```vue
<ExerciseCard :seed="5" />
<ExerciseCard :seed="5" answers />
```

İkinci kart *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm* ile biter. `formatQuantity`, şeklin yaptığı gibi birimi ve gerçek bir eksi işaretini yazar. Ondalık noktayı `'en'` biçimi verir; `new Intl.NumberFormat('tr', …)` ile ondalık virgül elde edersiniz.

Soruda `reaction-labels="names"`, mesnet tepkilerini bilinmeyen olarak çizer: bir mesnedin tuttuğu her doğrultu için, pozitif sayıldığı yönü (sağa, yukarı, saat yönünün tersine) gösteren ve büyüklüğü yerine *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* adını taşıyan bir ok. Böylece her cevabın işareti çizim üzerinde tanımlanmış olur: ters yönde etkiyen bir mesnet tepkisi negatiftir. Cevap anahtarı ise değerleri yazar.

`reserve` her iki görünümün katmanlarını en baştan yerleştirir; böylece kendi kendine çalışma için bir *Çözümü göster* düğmesiyle `answers` açıldığında diyagram ait olduğu yerde belirir ([Adım adım oluşan şekiller](/tr/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` aynısını mesnet tepkileri için yapar: adlar değerlere dönüşürken kiriş yerinde kalır. Bkz. [Bilinmeyen olarak mesnet tepkileri](/tr/plot/structure-plot#reactions-as-unknowns).

## Basılı sınav {#print-a-test}

Yazılı bir sınav için `print-test.ts` adlı bir Node betiği her öğrenciye bir sayfa, ardından da cevap anahtarlarını yazar. `structureSvg` her modeli SVG metnine dönüştürür; bu yüzden betik ne Vue'ya ne de tarayıcıya ihtiyaç duyar:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // tohum değerleri 1000, 1001, …

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const task = 'Find the reactions and draw the bending moment diagram.'

const pages = [
  ...exercises.map((e, i) => `<h2>${students[i]}, exercise ${e.seed}</h2>
    <p>${e.statement} ${task}</p>${structureSvg(e.model, { layers: sheet, reactionLabels: 'names' })}`),
  ...exercises.map((e) => `<h2>Key, exercise ${e.seed}</h2>
    ${structureSvg(e.model, { layers: key })}`),
]

const style = `body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 2rem auto }
  section { break-after: page }`
writeFileSync('test.html', `<!doctype html><meta charset="utf-8"><title>Test</title>
  <style>${style}</style>${pages.map((page) => `<section>${page}</section>`).join('\n')}`)
```

```bash
node print-test.ts
```

`test.html` dosyasını bir tarayıcıda açın ve yazdırın ya da PDF olarak kaydedin: her öğrencinin sorusu ve her cevap anahtarı ayrı bir sayfaya gelir. Ada'nın sayfası ve cevap anahtarı:

![Soru 1000: 2 m konsollu 6 m'lik bir açıklık, açıklıkta 10 kN/m, konsol ucunda 30 kN, A_x, A_z ve B_z olarak adlandırılmış bilinmeyen mesnet tepkileri ve 6 m ile 2 m'lik zincir ölçüler, toplam 8 m; altında cevap anahtarı: 20 ve 70 değerinde mesnet tepkileri ve mesnet üzerindeki −60'tan açıklıktaki 20'ye uzanan eğilme momenti](/screenshots/tr/p2p-plot-exercise-sheet.webp){.shot-lg}

`dimensions` katmanı, bir föyde olduğu gibi her açıklığı ve toplam boyu verir; `reactionLabels: 'names'` ise bilinmeyenleri adlandırır ve her ok, cevabının pozitif sayıldığı yönü gösterir. Cevap anahtarında mesnet tepkileri ve diyagram değerleri, EduBeam uygulamasındaki gibi birimleri yazılmadan, kN ve kNm cinsinden sayı olarak verilir: öğrencilerinizin bunu bilmesi gerekiyorsa cevap anahtarının başlığında belirtin. Siyah-beyaz bir fotokopi makinesi için her tonu siyaha ayarlayan bir `colors` verin: bkz. [Siyah-beyaz](/tr/plot/theming#black-and-white).

## LaTeX ve Word için şekiller {#figures-for-latex-and-word}

Sınavlarınızı LaTeX veya Word ile hazırlıyorsanız şekilleri dosya olarak yazın ve kendi şablonunuzu kullanmaya devam edin. `figures.ts`, 30 tohum değerinin sorusunu ve cevap anahtarını yazar:

```ts [figures.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']

for (let seed = 1000; seed < 1030; seed++) {
  const { model } = makeExercise(seed)
  writeFileSync(`exercise-${seed}.svg`, structureSvg(model, { layers: sheet, reactionLabels: 'names' }))
  writeFileSync(`exercise-${seed}-key.svg`, structureSvg(model, { layers: key }))
}
```

Betiği `node figures.ts` ile çalıştırın: 30 öğrenci için 60 dosya; her biri sabit renkli, CSS'siz ve betiksiz düz bir SVG.

- **Word** (2019 ve Microsoft 365) bir SVG'yi olduğu gibi ekler: *Ekle › Resimler*.
- **LaTeX** SVG yerine PDF ekler. Dosyaları bir kez [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) veya Inkscape ile dönüştürün, sonra `\includegraphics[width=\linewidth]{exercise-1000.pdf}` kullanın. Inkscape kuruluysa `svg` paketinin `\includesvg` komutu dönüştürmeyi sizin yerinize yapar.

Bir şekil 640 birim genişliğindedir, metin boyutu 13 birimdir; bu yüzden yaklaşık 16 cm olan bir A4 metin sütunu genişliğinde etiketleri 9 pt olur. `fontFamily` seçeneğini belgenizin kullandığı bir yazı tipine ayarlayın: tüm seçenekler için bkz. [Bağımsız bir SVG dosyası](/tr/plot/functions#a-standalone-svg-file).

## Kendinize göre uyarlayın {#make-it-your-own}

- **Daha fazla yapı türü.** Yeni durumlar ekleyin: konsol kiriş, iki açıklıklı sürekli kiriş, portal çerçeve, kafes sistem. Sayfanın başındaki canlı örnek, basit mesnetli kirişten üç mafsallı çerçeveye, Warren kafes kirişine ve portal çerçeveye kadar sekiz türden birini seçer.
- **Hiperstatik sorular.** Çözücü bunları da aynı kolaylıkla çözer; yalnızca elle çözüm uzar.
- **Yuvarlak sayılar.** Yükleri ve uzunlukları yukarıdaki gibi kısa listelerden seçin; cevap anahtarı istediğiniz kadar yuvarlak çıkar. Birkaç yüz tohum değeri üzerinde döngü kurun ve cevap anahtarında istediğinizden fazla ondalık basamak olanları atlayın.
- **Mekanizmalara karşı önlem alın.** Mesnetleri hatalı yerleştirebilecek bir üreteç, çözümü bir `try` içinde yapmalı ve hata fırlatan tohum değerlerini atlamalıdır: bkz. [Çözüm başarısız olursa](/tr/solver/solving#when-solving-fails).
- **Daha fazlasını sorun.** Kesme kuvvetini (`'V'`), sehimi (`'w'`; değerleri [`getUnknowns`](/tr/solver/results#displacements) ile) ya da eğik bir çubuktaki normal kuvveti çizdirin.
