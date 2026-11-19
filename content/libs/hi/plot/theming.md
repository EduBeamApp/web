---
title: थीम और रंग
description: "@edubeam/plot के चित्रों के रंग CSS custom properties या colors prop से बदलें: light और dark थीम, श्वेत-श्याम छपाई, SVG में रंग, फ़ॉन्ट और animation।"
order: 4
source: site
---

# थीम और रंग {#theming-and-colours}

प्लॉट अपने रंग पेज की CSS custom properties से लेता है, इसलिए साइट की light और dark थीम उस पर जैसी हैं वैसी ही लागू होती हैं। जहाँ पेज कोई property तय नहीं करता, वहाँ CSS system colours काम आते हैं, जो पेज के `color-scheme` का पालन करते हैं। बिना कुछ बदले, light पेज में प्लॉट सफ़ेद पर काला होता है और dark पेज में गहरे पर हल्का।

## Custom properties {#custom-properties}

| किसके लिए | Custom property | Fallback |
| --- | --- | --- |
| सदस्य, सपोर्ट, पाठ | `--figure-ink`, फिर `--ink` | `CanvasText` |
| पृष्ठभूमि, लेबलों के halo | `--paper` | `Canvas` |
| विमा रेखाएँ, अक्ष | `--muted` | `GrayText` |
| नोड, खींचा जाने वाला भार | `--brand` | `#4f46e5` |
| अक्षीय बल | `--color-normal` | `#2222ff` |
| अपरूपण बल | `--color-shear` | `#00af00` |
| बंकन आघूर्ण | `--color-moment` | `#ff2222` |
| विरूपित आकार | `--figure-ink`, फिर `--ink` | `CanvasText` |
| भार | `--color-load` | `#ff8700` |
| प्रतिक्रियाएँ | `--color-reaction` | `#a020f0` |
| तनाव वाली ट्रस छड़ें | `--color-tension`, फिर `--color-moment` | `#ff2222` |
| संपीड़न वाली ट्रस छड़ें | `--color-compression`, फिर `--color-normal` | `#2222ff` |
| फ़ॉन्ट | `--ebp-font`, फिर `--font-sans` | `inherit` |

ये properties प्लॉट से ऊपर के किसी भी element पर तय करें; पूरी साइट के लिए `:root` पर:

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

लेबलों के चारों ओर `--paper` रंग का halo होता है, ताकि हैचिंग के ऊपर भी वे पढ़े जा सकें: इसे उस पृष्ठभूमि से मिलाएँ जिस पर प्लॉट रखा है।

## `colors` prop {#the-colors-prop}

किसी एक प्लॉट के रंग बदलने के लिए किसी भी tone को उसके नाम से दें:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

Tone ये हैं: `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` और `compression`। कोई भी CSS रंग चलता है, `var(…)` भी। `DEFAULT_COLORS` में हर tone का default मान है।

## श्वेत-श्याम {#black-and-white}

फ़ोटोकॉपी किए जाने वाले प्रश्नपत्र या श्वेत-श्याम छपाई के लिए हर रंगीन tone को ink पर सेट करें:

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

आरेख बिना रंग के भी पढ़े जा सकते हैं: वे हैच होते हैं, और आघूर्ण तनाव की ओर बनता है।

## SVG फ़ाइल में रंग {#colours-in-an-svg-file}

[`structureSvg`](/hi/plot/functions#a-standalone-svg-file) की लिखी फ़ाइल के चारों ओर कोई पेज नहीं होता, इसलिए वह साधारण रंगों का उपयोग करती है: `PRINT_COLORS`, यानी सफ़ेद पर EduBeam ऐप के रंग। उसका `colors` विकल्प prop वाले ही tone लेता है, इसलिए ऊपर का श्वेत-श्याम set वहाँ भी काम करता है:

```ts
structureSvg(model, { colors: print }) // सफ़ेद पर काला
structureSvg(model, { background: false }) // बिना पृष्ठभूमि, रंगीन स्लाइड के लिए
```

केवल साधारण रंग: Word या Inkscape के लिए `var(…)` का कोई अर्थ नहीं है।

## फ़ॉन्ट {#fonts}

पाठ पेज का फ़ॉन्ट लेता है, `--ebp-font` या `--font-sans` से, और अंक tabular figures में होते हैं। `DiagramStack` में V(x) जैसे पंक्तियों के नाम KaTeX के फ़ॉन्ट में लिखे जाते हैं, अगर पेज उन्हें load करता है, नहीं तो किसी serif फ़ॉन्ट में। SVG फ़ाइल अपने `fontFamily` विकल्प का उपयोग करती है, default रूप से Helvetica या Arial, क्योंकि वह पेज का फ़ॉन्ट नहीं जान सकती।

## Animation बदलना {#restyling-the-animation}

प्लॉट को जो थोड़े-से CSS नियम चाहिए, वे हर SVG के अंदर ही लिखे होते हैं, इसलिए उसे किसी stylesheet की ज़रूरत नहीं। हर class का prefix `ebp-` है, और पेज उन्हें override कर सकता है। हर लेयर एक `<g class="ebp-layer ebp-layer-{name}">` है, जिसे दिखाए जाने पर `ebp-on` मिलता है:

```css
/* धीमे fade, व्याख्यान कक्ष के लिए */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` में ये अंदर लिखे नियम मिलते हैं, और `toneVars(colors)` से वे custom properties जो प्लॉट अपने root element पर सेट करता है; इनसे आप [ड्रॉइंग फ़ंक्शनों](/hi/plot/functions#drawing) के साथ अपने चित्र बना सकते हैं।
