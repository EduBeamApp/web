---
title: API komponen
description: "Semua prop dan event StructurePlot dan DiagramStack di @edubeam/plot 0.2.0, dengan tipe dan nilai bawaannya, plugin EduBeamPlot, serta tipe prop yang diekspor."
order: 8
group: Referensi API
source: site
---

# API komponen {#component-api}

Prop dan event kedua komponen, sebagaimana dideklarasikan di @edubeam/plot 0.2.0. Keduanya tidak memiliki slot. Nilai dalam satuan SI ditandai demikian; ukuran dalam piksel CSS.

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

Menggambar struktur bidang beserta hasilnya. Panduan: [StructurePlot](/id/plot/structure-plot).

### Props {#props}

| Prop | Tipe | Bawaan | Keterangan |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Solver @edubeam/fem. Hasil digambar setelah kasus bebannya dihitung. |
| `model` | `PlotModel` | – | Atau data biasa yang dibuat [`modelFromSolver`](/id/plot/model). Didahulukan daripada `solver`. |
| `loadCase` | `number` | `0` | Indeks dalam `solver.loadCases` |
| `revision` | `number` | `0` | Ubah nilainya untuk menggambar ulang solver yang diubah di tempat |
| `layers` | `readonly PlotLayer[]` | members, supports, loads, reactions and one result | Apa yang digambar: `'nodes'`, `'nodeLabels'`, `'dimensions'`, `'members'`, `'supports'`, `'loads'`, `'reactions'`, `'N'`, `'V'`, `'M'`, `'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | Lapisan yang tempatnya disiapkan selagi tersembunyi |
| `compact` | `boolean` | `false` | Gambar mini: simbol lebih kecil, paling banyak dua nilai per batang |
| `units` | `Partial<Units>` | `KN_UNITS` | Satuan tampilan |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | Memformat setiap angka |
| `colors` | `Partial<PlotColors>` | – | Penggantian warna per rona: [Tema dan warna](/id/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | Lebar sebelum kotak terukur, misalnya di server |
| `height` | `number` | – | Tinggi tetap. Tanpa nilai ini, tinggi mengikuti gambar. |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact none | Batas atas tinggi otomatis |
| `padding` | `number` | `6` | Ruang di sekeliling gambar |
| `fontSize` | `number` | `13`, compact `11.5` | Ukuran teks |
| `diagramSize` | `number` | `48`, compact `26` | Panjang ordinat diagram terbesar |
| `deformedSize` | `number` | `30`, compact `18` | Perpindahan terbesar pada bentuk deformasi |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | Skala tetap dalam px per satuan SI untuk suatu hasil, menggantikan `diagramSize` atau `deformedSize` |
| `momentOnTensionSide` | `boolean` | `true` | M di sisi tarik; `false` untuk sisi tekan |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | Nilai ditulis tegak, atau diputar sejajar ordinatnya |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | Reaksi sebagaimana bekerja, dengan besarnya; atau, untuk soal, setiap arah yang ditahan diberi nama (*A<sub>x</sub>*, *M<sub>A</sub>*) dan menunjuk ke arah positifnya. Nama tidak memerlukan hasil: [Reaksi sebagai besaran yang dicari](/id/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | Mode label yang tempatnya disiapkan selain mode saat ini |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | Gaya label reaksi yang tempatnya disiapkan selain `reactionLabels`, agar gambar soal yang berubah menjadi penyelesaiannya tetap diam |
| `animate` | `boolean` | `true` | Lapisan muncul perlahan dan batang tergambar bertahap. Selalu nonaktif jika `prefers-reduced-motion` aktif. |
| `hover` | `boolean` | `false` | Membaca nilai di bawah kursor, ditandai di ujung ordinat setiap diagram. Jika nonaktif, gambar sama sekali tidak menerima input pointer. |
| `title` | `string` | a description of what is shown | Nama aksesibel gambar |

Tanpa `layers`, hasil yang ditampilkan adalah `M` untuk balok dan portal, `N` untuk rangka batang, dan `w` jika tidak ada batang yang memikul gaya (`defaultResultLayer`).

### Event {#events}

| Event | Payload | Kapan |
| --- | --- | --- |
| `readout` | `Readout \| null` | Dengan `hover`: titik batang di bawah kursor dan hasilnya di titik itu; `null` saat kursor keluar |

```ts
interface Readout {
  readonly member: string
  readonly x: number // m dari joint awal batang
  readonly px: number // titik di layar, px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // satuan SI
  readonly u: number // perpindahan searah sumbu x lokal batang, m
}
interface SidedValue {
  readonly left: number
  readonly right: number // sama dengan left jika hasilnya kontinu
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

Menggambar balok lurus di atas diagram-diagramnya pada satu sumbu x. Batang-batangnya harus membentuk satu garis horizontal yang digambar dari kiri ke kanan; selain itu memunculkan galat. Panduan: [DiagramStack](/id/plot/diagram-stack).

### Props {#props-1}

| Prop | Tipe | Bawaan | Keterangan |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | Balok yang sudah dihitung |
| `model` | `PlotModel` | – | Atau data biasa dari `modelFromSolver`; didahulukan |
| `loadCase` | `number` | `0` | Indeks dalam `solver.loadCases` |
| `revision` | `number` | `0` | Ubah nilainya untuk menggambar ulang solver yang diubah di tempat |
| `members` | `readonly string[]` | all members | Batang yang membentuk garis balok |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | Baris diagram dari atas ke bawah, dari `'N'`, `'V'`, `'M'`, `'w'` |
| `loadRow` | `boolean` | `true` | Balok dengan tumpuan, beban dan reaksinya di atas baris-baris diagram |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | each row's own | Rentang nilai per baris, satuan SI |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; below 560 px wide 88, 96, 104, 64 | Tinggi baris sebelum diskalakan oleh `maxHeight` |
| `maxHeight` | `number` | – | Baris menyusut, paling jauh sampai 60%, agar gambar muat. Ukuran teks tetap. |
| `units` | `Partial<Units>` | `KN_UNITS` | Satuan tampilan |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | Memformat setiap angka |
| `colors` | `Partial<PlotColors>` | – | Penggantian warna |
| `width` | `number` | `720` | Lebar sebelum kotak terukur; lebar yang dipakai minimal 320 |
| `fontSize` | `number` | `12.5` | Ukuran teks |
| `hover` | `boolean` | `true` | Kursor pembaca nilai. Jika nonaktif, gambar tidak menerima input pointer. |
| `loadAt` | `number` | – | Posisi (m di sepanjang garis) beban terpusat yang dapat diseret pembaca; pakai bersama `v-model:load-at` |
| `loadLabel` | `string` | `P = …` with the load's magnitude | Teks di samping beban yang dapat diseret |
| `loadStep` | `number` | `0.05` | Posisi seretan dibulatkan ke langkah ini, m; tombol panah menggeser sejauh langkah ini |
| `title` | `string` | a description of the rows | Nama aksesibel gambar |

### Event {#events-1}

| Event | Payload | Kapan |
| --- | --- | --- |
| `update:loadAt` | `number` | Pembaca memindahkan beban: posisi barunya, m. Menggerakkan `v-model:load-at`. |
| `readout` | `StackReadout \| null` | Nilai kursor di semua baris; `null` saat kursor keluar |

```ts
interface StackReadout {
  readonly x: number // m di sepanjang garis balok
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## Plugin {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // mendaftarkan <StructurePlot> dan <DiagramStack> secara global
```

Plugin ini opsional: mengimpor komponen dengan nama lebih ringan, dan bundler membuang plugin dari build yang tidak memakainya.

## Tipe {#types}

Untuk wrapper bertipe di sekitar komponen, paket ini mengekspor prop dan event-nya:

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| Tipe | Isi |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | Prop dan event `StructurePlot` |
| `DiagramStackProps`, `DiagramStackEmits` | Prop dan event `DiagramStack` |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | Payload event |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | Nama lapisan, hasil, mode label, label reaksi dan baris |
| `Units`, `Unit`, `UnitKind` | Satuan tampilan: `{ symbol, scale }` untuk setiap jenis |
| `PlotColors` | Warna per rona |
| `PlotModel` | Model biasa: [Model gambar](/id/plot/model) |

Ekspor lainnya, di antaranya `structureSvg` untuk file SVG dan fungsi-fungsi di balik penggambaran, tercantum di [Fungsi](/id/plot/functions).
