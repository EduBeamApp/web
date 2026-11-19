---
title: DiagramStack
description: "DiagramStack ile bir kirişi tek x ekseni üzerinde V(x), M(x) ve w(x) diyagramlarının üstünde çizin, satırları imleçle okuyun, tekil yükü sürüklenebilir yapın."
order: 3
source: site
---

# DiagramStack

`DiagramStack`, her statik ders kitabında bulunan şekli çizer: mesnetleri, yükleri ve mesnet tepkileriyle düz bir kiriş ve altında, aynı x ekseni üzerinde kesme kuvveti V(x), eğilme momenti M(x) ve sehim w(x). Bir imleç tüm satırları aynı anda okur; istenirse tekil bir yük kiriş boyunca sürüklenebilir.

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack: okuyucunun sürükleyebildiği 20 kN'luk bir yük taşıyan 6 m açıklıklı basit mesnetli kiriş; yük burada sol mesnetten 4,3 m uzakta. Mesnet tepkileri 5,7 kN ve 14,3 kN; kesme kuvveti yükün altında 5,7 kN'dan −14,3 kN'a sıçrıyor, eğilme momenti orada 24,4 kNm ile en büyük değerine ulaşıyor ve sehimin en büyük değeri 17 mm](/screenshots/tr/p2p-plot-diagram-stack.webp){.shot-lg}

Çubuklar soldan sağa çizilmiş, tek bir yatay çizgi oluşturmalıdır. Bunun dışındaki her şey – eğik ya da kırık bir çizgi veya sağdan sola çizilmiş bir çubuk – yanlış çizilmek yerine hatayla reddedilir, çünkü şeklin x ekseni kirişin eksenidir. Tüm prop'lar [Bileşen API'si](/tr/plot/components#diagramstack) sayfasındadır.

## Satırlar {#rows}

| Prop | Varsayılan | Belirlediği |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | yukarıdan aşağıya diyagramlar; `'N'` de kullanılabilir |
| `loadRow` | `true` | satırların üstünde mesnetleri, yükleri ve mesnet tepkileriyle kiriş |
| `members` | tüm çubuklar | model başka çubuklar da içeriyorsa kiriş hattını oluşturan çubuklar |
| `rowHeights` | N 100, V 116, M 128, w 76 px | satır yükseklikleri; 560 px'in altındaki genişliklerde biraz daha küçük |
| `maxHeight` | yok | şeklin sığması için satırlar en fazla %60'a kadar küçülür; metin boyutunu korur |
| `ranges` | her satırın kendi aralığı | her satır için SI birimlerinde sabit değer aralıkları |

V ve N, çoğu ders kitabındaki gibi yukarı doğru pozitif, M ve w ise aşağı doğru pozitif çizilir: pozitif moment ve aşağı doğru sehim eksenin altında kalır. Her satır kendi ekstremum değerlerini yazar.

## Okuma imleci {#the-reading-cursor}

`hover` varsayılan olarak açıktır. İmleç şeklin üzerinde gezinirken tüm satırları kesen dikey bir çizgi görünür ve her satırın değeri küçük bir etiket kutusunda yazılır. Bir sıçramanın, yani bir tekil yükün veya bir mesnedin 8 px yakınında imleç oraya yakalanır ve V iki tarafı da gösterir; yukarıdaki şekilde yükün altında `5.7 → −14.3 kN` gibi. Değerler olay olarak da iletilir:

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

Bir okuma `{ x, values }` biçimindedir: kiriş boyunca metre cinsinden `x` ve her satır için SI birimlerinde `{ left, right }`. İmleç şekilden çıkınca değer `null` olur.

## Okuyucunun sürükleyebildiği yük {#a-load-the-reader-can-drag}

`v-model:load-at` ile bir tekil yükün konumunu verdiğinizde yükte bir tutamaç belirir. Okuyucu tutamacı imleçle sürükler ya da odaklayıp ok tuşlarıyla hareket ettirir. Bileşen yalnızca yeni konumu bildirir. Kirişi yükün yeni konumuyla yeniden çözün ve yeni çözücüyü geri verin; `MovingLoad.vue` bunu şöyle yapar:

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** Tekil yükü A'dan `at` metre uzakta olan kiriş, çözülmüş olarak. */
const solveWithLoadAt = (at: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamConcentratedLoad(1, [0, P, 0, at], true)
  solver.solve()
  return solver
}

/** Her satırın tüm yük konumları üzerindeki aralığı: diyagramlar yeniden ölçeklenmek yerine büyüyüp küçülür. */
const rows: StackRow[] = ['V', 'M', 'w']
const envelope = (() => {
  const ranges: Partial<Record<StackRow, [number, number]>> = {}
  for (let at = 0.25; at < L; at += 0.25) {
    const model = modelFromSolver(solveWithLoadAt(at))
    const line = beamLine(model)
    for (const row of rows) {
      const [lo, hi] = rowRange(lineDiagram(model, line, row))
      const [min, max] = ranges[row] ?? [0, 0]
      ranges[row] = [Math.min(min, lo), Math.max(max, hi)]
    }
  }
  return ranges
})()

const at = ref(2)
const solver = computed(() => solveWithLoadAt(at.value))
</script>

<template>
  <DiagramStack v-model:load-at="at" :solver="solver" :rows="rows" :ranges="envelope" load-label="P = 20 kN" />
  <p>The load is {{ at.toFixed(2) }} m from A.</p>
</template>
```

Yük 4,3 m'deyken şekil 5,7 kN ve 14,3 kN mesnet tepkilerini, yükün altında 5,7'den −14,3 kN'a kesme kuvveti sıçramasını ve orada $M = 5{,}67 \cdot 4{,}3 = 24{,}4$ kNm değerini gösterir. `ranges` olmadan her satır, yük hareket ettikçe kendi ekstremumlarına göre yeniden ölçeklenir ve diyagramlar hiç değişmiyormuş gibi görünür.

| Prop | Varsayılan | Belirlediği |
| --- | --- | --- |
| `loadAt` | yok | yükün konumu, hattın başından metre cinsinden; `v-model:load-at` ile |
| `loadLabel` | `P = …` | tutamacın yanındaki metin |
| `loadStep` | 0.05 | sürükleme bu adıma yuvarlanır, m; ok tuşları yükü bu adım kadar kaydırır |

Tutamaç, ekran okuyucular için aralığı ve konumu bildirilen, odaklanabilir bir `role="slider"` öğesidir. Ok tuşları onu `loadStep` kadar, Page Up ve Page Down 1 m, Home ve End ise kirişin uçlarına taşır. Dokunmatik ekranda parmakla sürüklenebilir; şeklin üzerinde dikey kaydırma da çalışmaya devam eder.

Tutamaç, çözülmüş modelde `loadAt` konumundaki tekil kuvvetin yerini alır: bu kuvvet tutamaç olarak çizilir ve `loadLabel` vermediğiniz sürece büyüklüğüyle etiketlenir. Yükü modele aynı konumda koyun; `solveWithLoadAt` bunu yapar.

## Boyut ve sunucuda oluşturma {#size-and-server-rendering}

Şekil kutusunu ölçer ve yerleşimini o genişlikte, en az 320 px olarak yapar. Kutusunu ölçebilene kadar varsayılanı 720 px olan `width` değerini kullanır. Metin boyutu 12,5 px'dir (`fontSize`) ve şekille birlikte hiçbir zaman küçülmez.
