---
title: Tema dan warna
description: "Warna gambar @edubeam/plot lewat custom property CSS atau prop colors: tema terang dan gelap, cetak hitam-putih, warna file SVG, font dan animasi."
order: 4
source: site
---

# Tema dan warna {#theming-and-colours}

Gambar mengambil warnanya dari custom property CSS (variabel CSS) di halaman, sehingga tema terang dan gelap sebuah situs langsung berlaku. Jika halaman tidak mendefinisikannya, warna sistem CSS menggantikannya, dan warna-warna ini mengikuti `color-scheme` halaman. Tanpa pengaturan apa pun, gambar berwarna hitam di atas putih pada halaman terang dan terang di atas gelap pada halaman gelap.

## Custom property {#custom-properties}

| Dipakai untuk | Custom property | Cadangan |
| --- | --- | --- |
| Batang, tumpuan, teks | `--figure-ink`, lalu `--ink` | `CanvasText` |
| Latar belakang, halo label | `--paper` | `Canvas` |
| Garis dimensi, sumbu | `--muted` | `GrayText` |
| Joint, beban yang dapat diseret | `--brand` | `#4f46e5` |
| Gaya normal | `--color-normal` | `#2222ff` |
| Gaya geser | `--color-shear` | `#00af00` |
| Momen lentur | `--color-moment` | `#ff2222` |
| Bentuk deformasi | `--figure-ink`, lalu `--ink` | `CanvasText` |
| Beban | `--color-load` | `#ff8700` |
| Reaksi | `--color-reaction` | `#a020f0` |
| Batang rangka yang tertarik | `--color-tension`, lalu `--color-moment` | `#ff2222` |
| Batang rangka yang tertekan | `--color-compression`, lalu `--color-normal` | `#2222ff` |
| Font | `--ebp-font`, lalu `--font-sans` | `inherit` |

Tetapkan property ini di elemen mana saja di atas gambar, atau di `:root` untuk seluruh situs:

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

Label diberi halo berwarna `--paper` agar tetap terbaca di atas arsiran: samakan warnanya dengan latar belakang tempat gambar berada.

## Prop `colors` {#the-colors-prop}

Untuk mewarnai satu gambar saja, berikan rona mana pun menurut namanya:

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

Ronanya adalah `ink`, `paper`, `muted`, `brand`, `normal`, `shear`, `moment`, `deformed`, `load`, `reaction`, `tension` dan `compression`. Semua warna CSS dapat dipakai, termasuk `var(…)`. `DEFAULT_COLORS` berisi nilai bawaan setiap rona.

## Hitam-putih {#black-and-white}

Untuk lembar ujian yang difotokopi atau cetakan hitam-putih, atur semua rona berwarna menjadi warna tinta:

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

Diagram tetap terbaca tanpa warna: diagram diarsir, dan momen digambar di sisi tarik.

## Warna dalam file SVG {#colours-in-an-svg-file}

File yang ditulis oleh [`structureSvg`](/id/plot/functions#a-standalone-svg-file) tidak memiliki halaman di sekelilingnya, sehingga memakai warna tetap: `PRINT_COLORS`, yaitu warna aplikasi EduBeam di atas putih. Opsi `colors`-nya menerima rona yang sama dengan prop, sehingga set hitam-putih di atas juga berlaku di sini:

```ts
structureSvg(model, { colors: print }) // hitam di atas putih
structureSvg(model, { background: false }) // tanpa latar belakang, untuk slide berwarna
```

Hanya warna tetap: `var(…)` tidak berarti apa-apa bagi Word atau Inkscape.

## Font {#fonts}

Teks memakai font halaman, melalui `--ebp-font` atau `--font-sans`, dengan angka tabular. Nama baris seperti V(x) di `DiagramStack` ditulis dengan font KaTeX jika halaman memuatnya, dan dengan font serif jika tidak. File SVG memakai opsi `fontFamily`, secara bawaan Helvetica atau Arial, karena file tidak dapat mengetahui font halaman.

## Mengubah gaya animasi {#restyling-the-animation}

Beberapa aturan CSS yang diperlukan gambar disisipkan langsung ke dalam setiap SVG, sehingga tidak diperlukan stylesheet. Setiap kelas diawali `ebp-`, dan halaman dapat menimpanya. Setiap lapisan adalah `<g class="ebp-layer ebp-layer-{name}">`, yang mendapat kelas `ebp-on` saat ditampilkan:

```css
/* Kemunculan yang lebih lambat, untuk ruang kuliah */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

`PLOT_CSS` mengekspor aturan-aturan yang disisipkan itu, dan `toneVars(colors)` custom property yang dipasang gambar pada elemen akarnya, untuk menyusun gambar Anda sendiri dari [fungsi-fungsi penggambar](/id/plot/functions#drawing).
