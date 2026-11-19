---
title: Tema ve renkler
description: "@edubeam/plot şekillerinin renkleri: CSS custom property'leri veya colors prop'u, açık ve koyu tema, siyah-beyaz baskı, SVG dosyaları, yazı tipi ve animasyon."
order: 4
source: site
---

# Tema ve renkler

Bir şekil renklerini sayfadaki CSS custom property'lerinden alır; bu sayede sitenin açık ve koyu temaları olduğu gibi uygulanır. Sayfa bunları tanımlamıyorsa yerlerine sayfanın `color-scheme` değerini izleyen CSS sistem renkleri kullanılır. Hiçbir ayar yapılmadığında şekil, açık bir sayfada beyaz üzerine siyah, koyu bir sayfada koyu üzerine açık renktedir.

## Custom property'ler {#custom-properties}

| Kullanıldığı yer | Custom property | Yedek değer |
| --- | --- | --- |
| Çubuklar, mesnetler, metin | `--figure-ink`, sonra `--ink` | `CanvasText` |
| Arka plan, etiket haleleri | `--paper` | `Canvas` |
| Ölçü çizgileri, eksenler | `--muted` | `GrayText` |
| Düğümler, sürüklenebilir yük | `--brand` | `#4f46e5` |
| Normal kuvvet | `--color-normal` | `#2222ff` |
| Kesme kuvveti | `--color-shear` | `#00af00` |
| Eğilme momenti | `--color-moment` | `#ff2222` |
| Deforme şekil | `--figure-ink`, sonra `--ink` | `CanvasText` |
| Yükler | `--color-load` | `#ff8700` |
| Mesnet tepkileri | `--color-reaction` | `#a020f0` |
| Çekmedeki kafes çubukları | `--color-tension`, sonra `--color-moment` | `#ff2222` |
| Basınçtaki kafes çubukları | `--color-compression`, sonra `--color-normal` | `#2222ff` |
| Yazı tipi | `--ebp-font`, sonra `--font-sans` | `inherit` |

Property'leri şeklin üstündeki herhangi bir öğede tanımlayın; sitenin tamamı için `:root` üzerinde:

```css
:root {
  --ink: #1b1b3a;
  --paper: #ffffff;
  --color-moment: #d7263d;
}

.dark {
  --ink: #eeeeff;
  --paper: #0b0d1f;
}
```

Etiketler, taramanın üzerinde de okunaklı kalmaları için `--paper` renginde bir hale alır: bu rengi şeklin bulunduğu arka planla eşleştirin.

## `colors` prop'u {#the-colors-prop}

Tek bir şekli renklendirmek için tonlardan istediklerinizi adlarıyla verin:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

Tonlar şunlardır: `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` ve `compression`. Herhangi bir CSS rengi, `var(…)` de dahil, kullanılabilir. Her tonun varsayılan değeri `DEFAULT_COLORS` içindedir.

## Siyah-beyaz {#black-and-white}

Fotokopiyle çoğaltılacak bir sınav veya siyah-beyaz bir baskı için renkli tonların hepsini mürekkep rengine ayarlayın:

```vue
<script setup lang="ts">
import type { PlotColors } from '@edubeam/plot'

const print: Partial<PlotColors> = {
  ink: '#000', paper: '#fff', muted: '#555', brand: '#000',
  normal: '#000', shear: '#000', moment: '#000', deformed: '#000',
  load: '#000', reaction: '#000', tension: '#000', compression: '#000',
}
</script>

<template>
  <StructurePlot :solver="solver" :colors="print" :animate="false" />
</template>
```

Diyagramlar renk olmadan da okunaklı kalır: taralıdırlar ve moment çekme tarafına çizilir.

## SVG dosyasında renkler {#colours-in-an-svg-file}

[`structureSvg`](/tr/plot/functions#a-standalone-svg-file) ile yazılan bir dosyanın çevresinde sayfa yoktur; bu yüzden sabit renkler kullanır: `PRINT_COLORS`, yani beyaz zemin üzerinde EduBeam uygulamasının renkleri. Dosyanın `colors` seçeneği prop ile aynı tonları alır; yukarıdaki siyah-beyaz renk takımı orada da çalışır:

```ts
structureSvg(model, { colors: print }) // beyaz üzerine siyah
structureSvg(model, { background: false }) // arka plansız, renkli bir slayt için
```

Yalnızca sabit renkler kullanın: `var(…)` Word veya Inkscape için bir şey ifade etmez.

## Yazı tipleri {#fonts}

Metin, sayfanın yazı tipini `--ebp-font` veya `--font-sans` üzerinden, sabit genişlikli rakamlarla (tabular figures) kullanır. `DiagramStack` içindeki V(x) gibi satır adları, sayfa KaTeX yazı tiplerini yüklüyorsa onlarla, yüklemiyorsa serifli bir yazı tipiyle yazılır. Bir SVG dosyası sayfanın yazı tipini bilemeyeceği için `fontFamily` seçeneğini kullanır; varsayılan Helvetica veya Arial'dır.

## Animasyonu yeniden biçimlendirme {#restyling-the-animation}

Bir şeklin ihtiyaç duyduğu birkaç CSS kuralı her SVG'nin içine gömülüdür; bu yüzden stil dosyası gerekmez. Her sınıfın önünde `ebp-` öneki vardır ve bir sayfa bu sınıfları geçersiz kılabilir. Her katman bir `<g class="ebp-layer ebp-layer-{name}">` öğesidir ve gösterildiğinde `ebp-on` sınıfını alır:

```css
/* Daha yavaş belirme, amfi için */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

Kendi şekillerinizi [çizim fonksiyonlarıyla](/tr/plot/functions#drawing) oluşturacaksanız `PLOT_CSS` gömülü kuralları, `toneVars(colors)` ise bir şeklin kök öğesine atadığı custom property'leri verir.
