---
title: Menyematkan
description: "Gambar @edubeam/plot di aplikasi Vite, catatan kuliah VitePress atau situs Nuxt, render di server, model terhitung sebagai JSON, atau SVG biasa tanpa Vue."
order: 7
source: site
---

# Menyematkan {#embedding}

Komponennya adalah Vue 3 biasa, sehingga berfungsi di mana pun Vue berjalan, dan dapat dirender di server maupun di browser. Tidak ada yang menyentuh `window` sebelum gambar di-mount, dan setiap gambar mendapat id-nya sendiri, sehingga berapa pun banyaknya gambar dapat berada di satu halaman. Pilih sesuai yang Anda miliki:

| Yang Anda miliki | Lakukan ini |
| --- | --- |
| Aplikasi Vue yang di-build dengan Vite | Pasang, impor, selesai: [Aplikasi Vite](#a-vite-app) |
| Catatan kuliah dalam Markdown | Daftarkan plugin sekali di VitePress: [Catatan kuliah di VitePress](#vitepress-course-notes) |
| Situs Nuxt | Impor komponennya, atau tambahkan plugin: [Nuxt](#nuxt) |
| Halaman yang hanya menampilkan gambar | Hitung saat build dan kirim JSON: [Kirim gambarnya](#ship-the-drawing-not-the-solver) |
| Tanpa Vue sama sekali | Tulis SVG di Node: [Tanpa Vue](#plain-html-from-node) |

## Aplikasi Vite {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

Impor komponen di tempat Anda memakainya, seperti di [Memulai](/id/plot/getting-started#draw-a-solved-model), atau daftarkan keduanya sekali dengan `app.use(EduBeamPlot)`. Tidak ada lagi yang perlu dikonfigurasi: tanpa stylesheet dan tanpa plugin bundler.

## Catatan kuliah di VitePress {#vitepress-course-notes}

[VitePress](https://vitepress.dev) membangun halaman Markdown dengan Vue, sehingga cocok untuk catatan kuliah. Daftarkan komponen di tema, `.vitepress/theme/index.ts`:

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // <StructurePlot> dan <DiagramStack> tersedia di setiap halaman
  },
} satisfies Theme
```

Lalu susun dan gambar model langsung di dalam halaman, di samping `frame.ts`:

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => LinearStaticSolver yang sudah dihitung

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` menghitung portal dan menulis SVG jadinya, lengkap dengan label, ke dalam HTML halaman. Di browser, halaman mengambil alih, dan gambar menyesuaikan diri dengan lebar kolom. `frame.ts` ada di halaman [Slide dan catatan kuliah](/id/plot/slides#a-figure-that-builds-up).

## Nuxt {#nuxt}

Nuxt juga merender di server; situs ini dibangun dengannya. Impor komponen di halaman atau komponen seperti biasa, atau daftarkan untuk seluruh aplikasi dengan plugin di `plugins/edubeam-plot.ts`:

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

Di server tidak ada kotak yang dapat diukur, sehingga gambar ditata dengan lebar dari prop `width`: secara bawaan 640 px (400 px dengan `compact`), dan 720 px untuk `DiagramStack`. Setelah di-mount, gambar ditata ulang dengan lebar sesungguhnya. Jika kolom Anda jauh lebih sempit atau lebih lebar, berikan perkiraan yang lebih dekat lewat `width`, agar ukuran gambar tidak berubah saat halaman dimuat.

## Kirim gambarnya, bukan solvernya {#ship-the-drawing-not-the-solver}

Halaman yang hanya menampilkan gambar tidak memerlukan solver. `modelFromSolver` membaca model terhitung menjadi data biasa: joint, batang, beban, reaksi, serta N, V, M dan perpindahan setiap batang sebagai polinomial eksak. Buat data itu saat build, dengan skrip seperti `build-figures.ts`:

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

lalu gambar dengan prop `model`:

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

Portal ini berukuran kurang dari 2 kB JSON dan tergambar persis seperti dari solvernya. Semua fitur berfungsi pada model sama seperti pada solver; jika Anda memberikan keduanya, yang dipakai adalah `model`. Formatnya dijelaskan di [Model gambar](/id/plot/model).

## Tanpa Vue {#plain-html-from-node}

`structureSvg` mengubah model menjadi teks file SVG, dengan warna tetap dan tanpa style maupun skrip. Tempelkan teks itu ke HTML mana pun, ke generator situs statis, file Markdown atau CMS. Skrip berikut menulis halaman dengan satu gambar:

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

Gambar seperti ini berukuran sebagaimana saat ditulis, secara bawaan selebar 640 px (`max-width: 100%; height: auto` membuatnya ikut menyusut bersama kolom), dan memiliki latar belakang putih sendiri; `background: false` membuatnya transparan. Gambar ini tidak mengikuti tema gelap dan tidak membaca nilai di bawah kursor: untuk itu, render komponennya. [Pembangkit lembar soal ujian](/id/plot/exercises#print-a-test) mencetak seluruh ujian dengan cara ini, dan [File SVG mandiri](/id/plot/functions#a-standalone-svg-file) mencantumkan semua opsinya.
