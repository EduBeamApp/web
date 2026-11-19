---
title: Bileşen API'si
description: "StructurePlot ve DiagramStack bileşenlerinin (@edubeam/plot 0.2.0) tüm prop'ları ve olayları, tip ve varsayılanlarıyla; EduBeamPlot eklentisi ve prop tipleri."
order: 8
group: API başvurusu
source: site
---

# Bileşen API'si

İki bileşenin prop'ları ve olayları, @edubeam/plot 0.2.0'da tanımlandıkları biçimiyle. İkisinin de slot'u yoktur. SI birimlerindeki değerler belirtilmiştir; boyutlar CSS pikselidir.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Düzlem bir yapıyı ve sonuçlarını çizer. Kılavuz: [StructurePlot](/tr/plot/structure-plot).

### Prop'lar {#props}

| Prop | Tip | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Bir @edubeam/fem çözücüsü. Yükleme durumu çözüldüğünde sonuçlar çizilir. |
| `model` | `PlotModel` | – | Ya da [`modelFromSolver`](/tr/plot/model) fonksiyonunun ürettiği düz veri. `solver` prop'una göre önceliklidir. |
| `loadCase` | `number` | `0` | `solver.loadCases` içindeki indis |
| `revision` | `number` | `0` | Yerinde değiştirilmiş bir çözücüyü yeniden çizmek için değiştirin |
| `layers` | `readonly PlotLayer[]` | çubuklar, mesnetler, yükler, mesnet tepkileri ve bir sonuç | Neyin çizileceği: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Gizliyken de yer ayrılacak katmanlar |
| `compact` | `boolean` | `false` | Küçük resim çizimi: daha küçük semboller, çubuk başına en fazla iki değer |
| `units` | `Partial<Units>` | `KN_UNITS` | Gösterim birimleri |
| `numberFormat` | `Intl.NumberFormat` | İngilizce, en fazla 1 ondalık basamak | Tüm sayıları biçimlendirir |
| `colors` | `Partial<PlotColors>` | – | Tonlara göre renk değişiklikleri: [Tema ve renkler](/tr/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Kutu ölçülmeden önceki genişlik, örneğin sunucuda |
| `height` | `number` | – | Sabit yükseklik. Verilmezse yükseklik çizime göre belirlenir. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact: yok | Otomatik yüksekliğin üst sınırı |
| `padding` | `number` | `6` | Çizimin çevresindeki boşluk |
| `fontSize` | `number` | `13`, compact `11.5` | Metin boyutu |
| `diagramSize` | `number` | `48`, compact `26` | En büyük diyagram ordinatının uzunluğu |
| `deformedSize` | `number` | `30`, compact `18` | Deforme şekildeki en büyük yer değiştirme |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Bir sonuç için SI birimi başına sabit piksel; `diagramSize` veya `deformedSize` yerine geçer |
| `momentOnTensionSide` | `boolean` | `true` | M çekme tarafında; basınç tarafı için `false` |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Değerler dik mi yazılır, yoksa ordinatları boyunca mı döndürülür |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Mesnet tepkileri etkidikleri yönde ve büyüklükleriyle; ya da bir soru için, tutulan her doğrultu adlandırılmış (*A<sub>x</sub>*, *M<sub>A</sub>*) ve pozitif sayıldığı yönü gösteren bir okla. Adlar sonuç gerektirmez: [Bilinmeyen olarak mesnet tepkileri](/tr/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | O anki biçimin yanı sıra yer ayrılacak etiket biçimleri |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | `reactionLabels` dışında yer ayrılacak mesnet tepkisi etiket biçimleri; böylece çözümüne dönüşen bir soruda çizim yerinde kalır |
| `animate` | `boolean` | `true` | Katmanlar yavaşça belirir, çubuklar uçtan uca çizilerek görünür. `prefers-reduced-motion` altında her zaman kapalıdır. |
| `hover` | `boolean` | `false` | İmlecin altındaki değerleri okur ve her diyagramın ordinat ucunda işaretler. Kapalıyken şekil hiçbir işaretçi girdisi almaz. |
| `title` | `string` | gösterilenin bir açıklaması | Şeklin erişilebilir adı |

`layers` verilmezse sonuç kirişler ve çerçeveler için `M`, kafes sistem için `N`, hiçbir çubuk kuvvet taşımıyorsa `w` olur (`defaultResultLayer`).

### Olaylar {#events}

| Olay | Taşıdığı veri | Ne zaman |
| --- | --- | --- |
| `readout` | `Readout \| null` | `hover` ile: imlecin altındaki çubuk noktası ve oradaki sonuçlar; imleç ayrılınca `null` |

```ts
interface Readout {
  readonly member: string
  readonly x: number // çubuğun başlangıç düğümünden uzaklık, m
  readonly px: number // ekrandaki nokta, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // SI birimleri
  readonly u: number // çubuğun yerel x ekseni boyunca yer değiştirme, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // sonuç sürekli olduğu yerde left'e eşit
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Düz bir kirişi, tek bir x ekseni üzerinde diyagramlarının üstünde çizer. Çubuklar soldan sağa çizilmiş, tek bir yatay çizgi oluşturmalıdır; başka her durumda hata fırlatılır. Kılavuz: [DiagramStack](/tr/plot/diagram-stack).

### Prop'lar {#props-1}

| Prop | Tip | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Çözülmüş kiriş |
| `model` | `PlotModel` | – | Ya da `modelFromSolver` ile üretilmiş düz veri; önceliklidir |
| `loadCase` | `number` | `0` | `solver.loadCases` içindeki indis |
| `revision` | `number` | `0` | Yerinde değiştirilmiş bir çözücüyü yeniden çizmek için değiştirin |
| `members` | `readonly string[]` | tüm çubuklar | Kiriş hattını oluşturan çubuklar |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Yukarıdan aşağıya diyagram satırları; `'N'`, `'V'`, `'M'`, `'w'` arasından |
| `loadRow` | `boolean` | `true` | Satırların üstünde mesnetleri, yükleri ve mesnet tepkileriyle kiriş |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | her satırın kendi aralığı | Her satırın değer aralığı, SI birimleri |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; 560 px'den dar ise 88, 96, 104, 64 | `maxHeight` onları ölçeklemeden önceki satır yükseklikleri |
| `maxHeight` | `number` | – | Şeklin sığması için satırlar en fazla %60'a kadar küçülür. Metin boyutunu korur. |
| `units` | `Partial<Units>` | `KN_UNITS` | Gösterim birimleri |
| `numberFormat` | `Intl.NumberFormat` | İngilizce, en fazla 1 ondalık basamak | Tüm sayıları biçimlendirir |
| `colors` | `Partial<PlotColors>` | – | Renk değişiklikleri |
| `width` | `number` | `720` | Kutu ölçülmeden önceki genişlik; en az 320 kullanılır |
| `fontSize` | `number` | `12.5` | Metin boyutu |
| `hover` | `boolean` | `true` | Okuma imleci. Kapalıyken şekil hiçbir işaretçi girdisi almaz. |
| `loadAt` | `number` | – | Okuyucunun sürükleyebileceği tekil yükün konumu (hat boyunca m); `v-model:load-at` ile kullanın |
| `loadLabel` | `string` | yükün büyüklüğüyle `P = …` | Sürüklenebilir yükün yanındaki metin |
| `loadStep` | `number` | `0.05` | Sürükleme bu adıma yuvarlanır, m; ok tuşları yükü bu adım kadar kaydırır |
| `title` | `string` | satırların bir açıklaması | Şeklin erişilebilir adı |

### Olaylar {#events-1}

| Olay | Taşıdığı veri | Ne zaman |
| --- | --- | --- |
| `update:loadAt` | `number` | Okuyucu yükü kaydırdı: yeni konumu, m. `v-model:load-at` bununla çalışır. |
| `readout` | `StackReadout \| null` | İmlecin satırlardaki değerleri; imleç ayrılınca `null` |

```ts
interface StackReadout {
  readonly x: number // kiriş hattı boyunca m
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## Eklenti {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // <StructurePlot> ve <DiagramStack> bileşenlerini global olarak kaydeder
```

Eklenti isteğe bağlıdır: bileşenleri adlarıyla içe aktarmak daha hafiftir ve bir bundler, eklentiyi kullanmayan bir derlemeden onu çıkarır.

## Tipler {#types}

Bileşenlerin çevresine tipli sarmalayıcılar yazmak için paket, prop'larını ve olaylarını dışa aktarır:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Tip | Anlamı |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | `StructurePlot` bileşeninin prop'ları ve olayları |
| `DiagramStackProps`, `DiagramStackEmits` | `DiagramStack` bileşeninin prop'ları ve olayları |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Olayların taşıdığı veriler |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Katman, sonuç, etiket biçimi, mesnet tepkisi etiketi ve satır adları |
| `Units`, `Unit`, `UnitKind` | Gösterim birimleri: her tür için `{ symbol, scale }` |
| `PlotColors` | Tonlara göre renkler |
| `PlotModel` | Düz model: [Çizim modeli](/tr/plot/model) |

Geri kalan dışa aktarımlar, aralarında SVG dosyaları için `structureSvg` ve çizimin arkasındaki fonksiyonlar, [Fonksiyonlar](/tr/plot/functions) sayfasındadır.
