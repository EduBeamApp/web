---
title: StructurePlot
description: "StructurePlot ile kiriş, çerçeve ve kafes sistem çizimi: katmanlar, adım adım oluşan şekiller, bilinmeyen mesnet tepkileri, küçük resimler, birimler, değer okuma."
order: 2
group: Bileşenler
source: site
---

# StructurePlot

`StructurePlot` bir yapının tamamını kutusunun genişliğine sığdırarak çizer: çubuklar, mafsallar, mesnetler, yükler, mesnet tepkileri, N, V ve M diyagramları ve deforme şekil. Bileşene bir çözücü ya da çözücüden üretilmiş [düz modeli](/tr/plot/model) verin ve neyin çizileceğini söyleyin.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Her prop, tipi ve varsayılan değeriyle birlikte [Bileşen API'si](/tr/plot/components#structureplot) sayfasındadır.

Aşağıdaki şekil `nodeLabels` ve `dimensions` katmanları açık, `hover` ayarlı ve bu sitenin dört anlamlı basamaklı sayı biçimini kullanan bir `StructurePlot`. Sonuçlar arasında geçiş yapın ve değerlerini okumak için imleci bir çubuğun üzerine getirin.

::model-figure{caption="Portal çerçeve: mafsallı kolon ayakları, kirişte 10 kN/m, B'de 15 kN"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: B, fx: 15 }
results: [M, V, N, w]
show: [nodeLabels, dimensions]
---
::

## Katmanlar {#layers}

Bir şekil katmanlardan oluşur. Katmanlar, onları hangi sırayla listelediğinizden bağımsız olarak sabit bir sırayla çizilir:

| Katman | Çizdiği |
| --- | --- |
| `members` | çubuklar; mafsallar küçük dairelerle |
| `supports` | her mesnet için bir sembol; eğik mesnetlerde döndürülmüş |
| `loads` | düğüm ve çubuk yükleri, sıcaklık yüklemeleri ve mesnet çökmeleri, değerleriyle |
| `reactions` | mesnet tepkileri, değerleriyle birlikte oklar ve eğri oklar olarak; ya da `reactionLabels: 'names'` ile bir sorunun [adlandırılmış bilinmeyenleri](#reactions-as-unknowns) olarak |
| `nodes` | her düğüm küçük bir daire olarak |
| `nodeLabels` | düğüm etiketleri |
| `dimensions` | bir föydeki gibi zincir ölçüler: yapının altında düğümler ve tekil yükler arasındaki her açıklık, sağında her kat yüksekliği ve ikinci bir satırda toplam boyut |
| `N`, `V`, `M` | normal kuvvet, kesme kuvveti ve eğilme momenti diyagramları |
| `w` | deforme şekil |

`layers` verilmezse şekil çubukları, mesnetleri, yükleri ve mesnet tepkilerini, ayrıca yapıya göre seçilen bir sonucu çizer: kirişler ve çerçeveler için `M`, kafes sistem için `N`; sıcaklık yüklemesi altında serbestçe uzayabilen bir kiriş gibi hiçbir çubuk kuvvet taşımıyorsa `w`.

Diyagramlar EduBeam uygulamasındaki gibi çizilir: N ve V çubuğa dik olarak taranır, M ise çekme tarafına çizilir; yani pozitif moment kirişin altında kalır. `:moment-on-tension-side="false"` M'yi basınç tarafına çizer. Kafes sistemde her çubuğun kuvveti bir kez, çubuk boyunca ve işaretine göre renklendirilerek yazılır.

## Adım adım oluşan şekiller {#figures-that-build-up}

`reserve`, gizliyken de yer ayrılacak katmanları listeler. Şekil, ayrılan her katmanın yerleşimini en baştan yapar; bu yüzden bir katman açıldığında ait olduğu yerde belirir ve başka hiçbir şey kaymaz:

```vue
<script setup lang="ts">
import type { PlotLayer } from '@edubeam/plot'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
// `frame` çözülmüş bir çözücü, `step` o anki adım: bileşenin tamamı Slaytlar ve ders notları sayfasında
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

Varsayılan olarak açık olan `animate` ile katmanlar yavaşça belirir ve çubuklar bir uçtan diğerine doğru çizilir. `prefers-reduced-motion` ayarlıysa hiçbir şey canlandırılmaz. Bu şekli bir slayt sunumuna yerleştiren örnek [Slaytlar ve ders notları](/tr/plot/slides) sayfasındadır.

## Diyagram değerleri {#diagram-values}

Her değer, bir ders kitabının diyagramı etiketlediği gibi, ait olduğu ordinatın ucunun hemen ötesine yazılır: sıfır olmayan her çubuk ucu, aradaki ekstremumlar, bir sıçramadaki iki değer ve rijit bir köşede tek bir değer. Değerler, EduBeam uygulamasında olduğu gibi gösterim biriminde (N ve V için kN, M için kNm) birimleri yazılmadan verilir; mesnet tepkileri de öyle. Birimler yalnızca verilen büyüklüklerle yazılır: yükler, mesnet çökmeleri ve sıcaklık değişimleri. Başka bir etiketle, bir çubukla veya bir okla çakışacak bir etiket aynı ucun çevresinde başka yerler dener, boş yer yoksa çizilmez; böylece iki sayı hiçbir zaman üst üste binmez. Yüklerin ve mesnet tepkilerinin değerleri önce yerleştirilir, bu yüzden bir diyagramın sayıları onları yerinden edemez. Kafes çubuk kuvvetleri hiçbir zaman çıkarılmaz: çubuk boyunca kayar, öbür tarafa geçer ve son çare olarak küçülür.

`result-label-mode="axis"`, değerleri EduBeam uygulamasının yazdığı gibi ordinatları boyunca döndürür. Okuyucu iki biçim arasında geçiş yapabiliyorsa, geçişte çizimin kaymaması için `:reserve-label-modes="['horizontal', 'axis']"` verin.

## Bilinmeyen olarak mesnet tepkileri {#reactions-as-unknowns}

Bir föy mesnet tepkilerini sorar; bu yüzden onları değerleri olmadan göstermelidir. `reaction-labels="names"`, bir mesnedin tuttuğu her doğrultu için, pozitif sayıldığı yönü gösteren bir ok çizer: düğümün x ekseni boyunca (mesnet döndürülmemişse sağa), yukarı ve ankastrelik momenti için saat yönünün tersine. Her ok, düğümünün adıyla, gerçek bir alt simgeyle ve italik olarak adlandırılır: *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*. Böylece her cevabın işareti çizim üzerinde tanımlanmış olur: ters yönde etkiyen bir mesnet tepkisi negatiftir.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![Üstte föy olarak çizilmiş, bir ucu ankastre, diğer ucu kayıcı mesnetli kiriş: A'da ankastre mesnet, B'de kayıcı mesnet, açıklık ortasında 40 kN, 3 m ve 3 m'lik zincir ölçüler ile 6 m toplam boy ve adlandırılmış oklar olarak çizilmiş A_x, A_z, M_A ve B_z mesnet tepkileri. Altta, varsayılan mesnet tepkisi etiketleriyle aynı kiriş: yukarı doğru 27,5 ve 12,5, 45'lik bir ankastrelik momenti ve duvardaki −45'ten yükün altındaki 37,5'e uzanan eğilme momenti](/screenshots/tr/p4-plot-reaction-names.webp){.shot-lg}

Adlar sonuç gerektirmez; bu yüzden henüz çözülmemiş bir model de föy olarak çizilebilir. Cevap anahtarı için `reactionLabels` değerini `'values'` olarak bırakın. Adlar ve değerler farklı yer kaplar (sıfır olan yatay bir mesnet tepkisinin föyde adı vardır, ama cevap anahtarında oku yoktur). Bu yüzden ikisi arasında geçiş yapan bir şekil `:reserve-reaction-labels="['names', 'values']"` ile her ikisine de yer ayırmalıdır: böylece çizim yerinde kalır, yalnızca etiketler değişir. [Alıştırmalar ve sınavlar](/tr/plot/exercises#the-exercise-in-a-page) sayfasındaki soru kartı, bu sitedeki [alıştırmaların](/tr/practice) öğrenci çözümü istediğinde yaptığı gibi, bir `answers` prop'uyla ikisi arasında geçiş yapar.

## Küçük resimler {#thumbnails}

`compact`, yaklaşık 400 × 200 px boyutundaki kutucuklar için çizer: daha küçük semboller ve 11,5 px metin, çubuk başına en fazla iki değer ve `q =` olmadan, yalnızca büyüklüğüyle etiketlenen yayılı yükler.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

Bu sitedeki [örnekler galerisi](/tr/examples/) bu şekilde çizilir.

## Boyut {#size}

Şekil kutusunu ölçer ve yerleşimini o genişlikte, gerçek piksellerle yapar. `height` verilmezse yüksekliği çizime göre belirlenir; üst sınırı `maxHeight`, varsayılan olarak $\max(320;\ 0{,}75 \times \text{genişlik})$. Kutusunu ölçmeden önce, örneğin sunucuda, varsayılanı 640 px olan `width` değerini kullanır.

| Prop | Varsayılan | Belirlediği |
| --- | --- | --- |
| `width` | 640, compact 400 | kutu ölçülene kadar kullanılan yerleşim genişliği, px |
| `height` | çizime göre | sabit bir yükseklik, px |
| `maxHeight` | $\max(320;\ 0{,}75w)$, compact: yok | otomatik yüksekliğin üst sınırı |
| `padding` | 6 | çizimin çevresindeki boşluk, px |
| `fontSize` | 13, compact 11.5 | metin boyutu, px |
| `diagramSize` | 48, compact 26 | en büyük ordinatın uzunluğu, px |
| `deformedSize` | 30, compact 18 | deforme şekildeki en büyük yer değiştirme, px |

### Aynı ölçekte birden fazla şekil {#several-plots-at-one-scale}

Her şekil diyagramlarını kendi en büyük değerine göre ölçekler; bu yüzden 20 kNm'lik bir moment 80 kNm'lik bir moment kadar büyük görünür. Karşılaştırma yapmak için ölçeği `diagramScale` ile SI birimi başına piksel olarak sabitleyin:

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // Başlarken sayfasından: (açıklık m, q kN/m) => çözülmüş bir çözücü

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// kNm başına 0.5 px (N·m başına 0.5e-3 px): 8 m açıklığın 80 kNm'si 40 px, 4 m açıklığın 20 kNm'si 10 px derinliğinde çizilir
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## Birimler ve sayılar {#units-and-numbers}

Değerler içeride SI birimlerindedir ve yalnızca gösterim için dönüştürülür; varsayılan birimler kN, kNm, kN/m, m, mm, mrad ve K'dir. Herhangi bir birimi bir sembol ve bir ölçek çarpanıyla değiştirebilirsiniz; gösterilen değer = SI değeri × ölçek:

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

Sayılar bir `Intl.NumberFormat` ile biçimlendirilir; varsayılan biçim İngilizcedir ve en fazla bir ondalık basamak gösterir. Sayfanın diline uyması için kendi biçiminizi verin (Türkçe bir sayfa için `'tr'`, ondalık virgülle):

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

Eksi işaretleri gerçek eksi işaretidir (−) ve sıfıra yuvarlanan bir değer hiçbir zaman −0 olarak görünmez. Birimlerin adları şunlardır: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` ve `temperature`. Başlangıç noktası olarak `KN_UNITS` ve `SI_UNITS` dışa aktarılır.

## Değer okuma {#reading-values}

`hover` ile şekil, imlecin altındaki çubuk noktasında gösterilen sonuçları okur. Her değeri çizildiği yerde işaretler: gösterilen her diyagramın ordinat ucunda bir nokta (sıçramada iki uçta da) veya deforme şekil üzerinde bir nokta. Değerleri küçük bir etiket kutusunda listeler, örneğin `M = 54 kNm`, ya da bir sıçramanın iki tarafını, `V = 13.3 → −6.7 kN`. İmleç bir çubuğu yalnızca çubuğun üzerinden değil, diyagramının herhangi bir yerinden yakalar. Şekil değerleri veri olarak da iletir (emit):

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // Slaytlar ve ders notları sayfasından: () => çözülmüş bir çözücü

const frame = portalFrame()
const reading = ref<Readout | null>(null)
</script>

<template>
  <StructurePlot :solver="frame" :layers="['members', 'supports', 'M']" hover @readout="reading = $event" />
  <p v-if="reading">
    Member {{ reading.member }}, {{ reading.x.toFixed(2) }} m from its start:
    M = {{ (reading.values.M.left / 1e3).toFixed(1) }} kNm
  </p>
</template>
```

Bir okuma (readout) `{ member, x, px, py, values, u }` biçimindedir: çubuk, çubuk boyunca konum (metre), ekrandaki nokta (px), `N`, `V`, `M` ve `w` için SI birimlerinde `{ left, right }` ve eksenel yer değiştirme `u`. İmleç şekilden çıkınca değer `null` olur. Bu sitedeki canlı şekiller `hover` kullanır: imleci birinin üzerine getirin.

`hover` olmadan şekil hiçbir olay dinleyicisi eklemez; sayfa şeklin üzerinden kaydırılabilir ve bir bağlantının içindeki şekle dokunmak bağlantıyı açar. `hover` ile şekil yalnızca işaretçi (pointer) olaylarını dinler; dokunmatik ekranlarda dikey kaydırma ve iki parmakla yakınlaştırma çalışmaya devam eder.

## Erişilebilirlik {#accessibility}

Her şekil, `title` prop'uyla ya da gösterdiği şeyin bir açıklamasıyla (örneğin “Structure with its loads, reactions, bending moment”; bu varsayılan açıklama İngilizcedir) adlandırılmış bir `<svg role="img">` öğesidir. Gizli ayrılmış katmanlar `aria-hidden` olarak işaretlenir.
