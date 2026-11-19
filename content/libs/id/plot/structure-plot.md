---
title: StructurePlot
description: "Balok, portal dan rangka batang dengan StructurePlot: lapisan, gambar bertahap, reaksi yang dicari untuk soal, gambar mini, ukuran, satuan dan pembacaan nilai."
order: 2
group: Komponen
source: site
---

# StructurePlot

`StructurePlot` menggambar seluruh struktur selebar kotak wadahnya: batang, sendi, tumpuan, beban, reaksi, diagram N, V dan M, serta bentuk deformasi. Berikan sebuah solver, atau [model sederhana](/id/plot/model) yang dibuat darinya, lalu tentukan apa yang digambar.

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

Semua prop, beserta tipe dan nilai bawaannya, tercantum di [API komponen](/id/plot/components#structureplot).

Gambar berikut adalah `StructurePlot` dengan `nodeLabels` dan `dimensions` aktif, `hover` dipasang, dan format angka situs ini, yaitu empat angka penting. Pilih hasil yang ingin ditampilkan, lalu arahkan kursor ke sebuah batang untuk membaca nilainya.

::model-figure{caption="Portal dengan kaki bertumpuan sendi, 10 kN/m pada balok dan 15 kN di B"}
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

## Lapisan {#layers}

Gambar tersusun dari lapisan-lapisan yang selalu dilukis dalam urutan tetap, bagaimanapun urutan Anda menuliskannya:

| Lapisan | Menggambar |
| --- | --- |
| `members` | batang, dengan sendi sebagai lingkaran kecil |
| `supports` | simbol setiap tumpuan, diputar untuk tumpuan miring |
| `loads` | beban joint dan beban batang, beban suhu dan penurunan tumpuan, beserta nilainya |
| `reactions` | reaksi sebagai panah lurus dan panah lengkung beserta nilainya; atau, dengan `reactionLabels: 'names'`, sebagai [besaran yang dicari](#reactions-as-unknowns) dalam soal |
| `nodes` | setiap joint sebagai lingkaran kecil |
| `nodeLabels` | label joint |
| `dimensions` | dimensi berantai seperti pada lembar soal: setiap jarak antara joint dan beban terpusat di bawah struktur, setiap tinggi tingkat di sebelah kanannya, dan ukuran total pada baris kedua |
| `N`, `V`, `M` | diagram gaya normal, gaya geser dan momen lentur |
| `w` | bentuk deformasi |

Jika `layers` tidak diisi, gambar menampilkan batang, tumpuan, beban dan reaksi, ditambah satu hasil yang dipilih sesuai strukturnya: `M` untuk balok dan portal, `N` untuk rangka batang, dan `w` jika tidak ada batang yang memikul gaya, misalnya balok yang bebas memuai akibat beban suhu.

Diagram mengikuti aplikasi EduBeam: N dan V diarsir melintang batang, dan M digambar di sisi tarik, sehingga momen positif berada di bawah balok. `:moment-on-tension-side="false"` menggambar M di sisi tekan. Rangka batang menampilkan gaya setiap batang satu kali, di sepanjang batang, dengan warna menurut tandanya.

## Gambar yang tersusun bertahap {#figures-that-build-up}

`reserve` mendaftar lapisan yang tempatnya disiapkan meskipun sedang tersembunyi. Gambar menata semua lapisan cadangan sejak awal, sehingga saat salah satunya diaktifkan, lapisan itu muncul perlahan di tempatnya dan tidak ada yang bergeser:

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
// `frame` adalah solver yang sudah dihitung dan `step` tahap saat ini: komponen lengkapnya ada di Slide dan catatan kuliah
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

Dengan `animate`, yang aktif secara bawaan, lapisan muncul perlahan dan batang tergambar dari ujung ke ujung. Jika `prefers-reduced-motion` aktif, tidak ada animasi sama sekali. Halaman [Slide dan catatan kuliah](/id/plot/slides) memasukkan gambar ini ke dalam slide.

## Nilai pada diagram {#diagram-values}

Setiap nilai ditulis tepat di luar ujung ordinat yang bersangkutan, seperti buku ajar memberi label pada diagram: di setiap ujung batang yang nilainya bukan nol, di nilai ekstrem di antaranya, kedua nilai di tempat lompatan, dan di sudut kaku cukup satu kali. Nilai ditulis sebagai angka tanpa satuan dalam satuan tampilan (kN untuk N dan V, kNm untuk M), demikian pula reaksi, seperti di aplikasi EduBeam; satuan hanya ditulis pada besaran yang diberikan: beban, penurunan tumpuan dan perubahan suhu. Label yang akan menimpa label lain, batang atau panah mencoba posisi lain di ujung yang sama, dan dihilangkan jika tidak ada tempat yang kosong, sehingga dua angka tidak pernah saling menumpuk. Nilai beban dan reaksi ditempatkan lebih dulu, sehingga angka diagram tidak pernah menggesernya. Gaya batang rangka batang tidak pernah dihilangkan: labelnya bergeser sepanjang batang, pindah sisi, dan sebagai upaya terakhir mengecil.

`result-label-mode="axis"` memutar nilai agar sejajar dengan ordinatnya, seperti yang ditulis aplikasi EduBeam. Jika pembaca dapat beralih di antara keduanya, berikan `:reserve-label-modes="['horizontal', 'axis']"` agar gambar tidak bergeser saat mereka beralih.

## Reaksi sebagai besaran yang dicari {#reactions-as-unknowns}

Lembar soal menanyakan reaksi, jadi reaksi harus tampil tanpa nilainya. `reaction-labels="names"` menggambar panah untuk setiap arah yang ditahan tumpuan, menunjuk ke arah positifnya: searah sumbu x joint (ke kanan, kecuali tumpuannya diputar), ke atas, dan berlawanan arah jarum jam untuk momen jepit. Setiap panah diberi nama menurut joint-nya, *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>*, dalam huruf miring dengan subskrip sungguhan. Dengan begitu, tanda setiap jawaban sudah ditetapkan pada gambar: reaksi yang bekerja ke arah sebaliknya bernilai negatif.

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![Di atas, balok jepit–rol sebagai lembar soal: jepit di A, rol di B, 40 kN di tengah bentang, dimensi berantai 3 m dan 3 m dengan total 6 m, dan reaksi digambar sebagai panah bernama A_x, A_z, M_A dan B_z. Di bawah, balok yang sama dengan label reaksi bawaan: 27,5 dan 12,5 ke atas, momen jepit 45, dan momen lentur dari −45 di jepit sampai 37,5 di bawah beban](/screenshots/id/p4-plot-reaction-names.webp){.shot-lg}

Nama tidak memerlukan hasil, sehingga model yang belum dihitung pun dapat digambar sebagai lembar soal. Untuk kunci jawaban, biarkan `reactionLabels` bernilai `'values'`. Nama dan nilai membutuhkan ruang yang berbeda (reaksi horizontal yang bernilai nol punya nama di lembar soal, tetapi tidak punya panah di kunci jawaban), sehingga gambar yang beralih di antara keduanya sebaiknya menyiapkan tempat untuk keduanya dengan `:reserve-reaction-labels="['names', 'values']"`: gambar lalu tetap di tempatnya dan hanya labelnya yang berubah. Kartu soal di [Soal latihan dan ujian](/id/plot/exercises#the-exercise-in-a-page) beralih di antara keduanya dengan prop `answers`, seperti halaman [Latihan soal](/id/practice) di situs ini saat mahasiswa meminta penyelesaiannya.

## Gambar mini {#thumbnails}

`compact` menggambar untuk petak berukuran sekitar 400 × 200 px: simbol lebih kecil dan teks 11,5 px, paling banyak dua nilai per batang, dan beban garis hanya diberi label besarnya, tanpa `q =`.

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

Galeri di halaman [Contoh](/id/examples/) situs ini digambar dengan cara ini.

## Ukuran {#size}

Gambar mengukur kotak wadahnya dan menata isinya selebar kotak itu, dalam piksel sesungguhnya. Tanpa `height`, tingginya mengikuti gambar, sampai batas `maxHeight`, yang secara bawaan bernilai $\max(320;\ 0{,}75 \times \text{lebar})$. Sebelum dapat mengukur, misalnya di server, gambar memakai `width`, secara bawaan 640 px.

| Prop | Bawaan | Mengatur |
| --- | --- | --- |
| `width` | 640, compact 400 | lebar tata letak sampai kotak terukur, px |
| `height` | follows the drawing | tinggi tetap, px |
| `maxHeight` | $\max(320, 0.75w)$, compact none | batas atas tinggi otomatis |
| `padding` | 6 | ruang di sekeliling gambar, px |
| `fontSize` | 13, compact 11.5 | ukuran teks, px |
| `diagramSize` | 48, compact 26 | panjang ordinat terbesar, px |
| `deformedSize` | 30, compact 18 | perpindahan terbesar pada bentuk deformasi, px |

### Beberapa gambar dengan skala yang sama {#several-plots-at-one-scale}

Setiap gambar menskalakan diagramnya terhadap nilai terbesarnya sendiri, sehingga momen 20 kNm tampak sama besar dengan momen 80 kNm. Untuk membandingkannya, tetapkan skala dalam piksel per satuan SI dengan `diagramScale`:

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // dari Memulai: (bentang m, q kN/m) => solver yang sudah dihitung

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0.5 px per kNm (0.5e-3 px per N·m): 80 kNm pada bentang 8 m digambar sedalam 40 px, 20 kNm pada bentang 4 m sedalam 10 px
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## Satuan dan angka {#units-and-numbers}

Di dalam, semua nilai dalam satuan SI dan baru dikonversi saat ditampilkan: secara bawaan kN, kNm, kN/m, m, mm, mrad dan K. Setiap satuan dapat diganti dengan simbol dan faktor skala, nilai tampilan = nilai SI × skala:

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

Angka diformat dengan `Intl.NumberFormat`, secara bawaan dalam format bahasa Inggris dengan paling banyak satu desimal. Berikan format Anda sendiri agar sesuai dengan bahasa halaman:

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

Tanda minus ditulis sebagai tanda minus sungguhan (−), dan nilai yang dibulatkan menjadi nol tidak pernah tampil sebagai −0. Nama satuannya adalah `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` dan `temperature`; `KN_UNITS` dan `SI_UNITS` diekspor sebagai titik awal.

## Membaca nilai {#reading-values}

Dengan `hover`, gambar membaca hasil yang ditampilkan di titik batang di bawah kursor. Gambar menandai setiap nilai di tempat nilai itu digambar, dengan titik di ujung ordinat setiap diagram yang tampil (kedua ujung di tempat lompatan) atau pada bentuk deformasi, lalu mencantumkannya dalam label kecil, misalnya `M = 54 kNm`, atau kedua sisi lompatan, `V = 13.3 → −6.7 kN`. Kursor menangkap batang dari mana saja di atas diagramnya, tidak hanya tepat di batang. Gambar juga memancarkan nilai-nilai itu sebagai data:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // dari Slide dan catatan kuliah: () => solver yang sudah dihitung

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

Hasil pembacaan berbentuk `{ member, x, px, py, values, u }`: batang, posisi di sepanjang batang dalam meter, titik di layar dalam px, `{ left, right }` untuk masing-masing `N`, `V`, `M` dan `w` dalam satuan SI, dan perpindahan aksial `u`. Nilainya `null` saat kursor keluar. Gambar interaktif di situs ini memakai `hover`: arahkan kursor ke salah satunya.

Tanpa `hover`, gambar sama sekali tidak memasang event listener, sehingga halaman tetap dapat digulir di atasnya dan ketukan pada gambar di dalam tautan membuka tautan itu. Dengan `hover`, gambar hanya mendengarkan pointer event, dan pengguliran vertikal serta zoom dengan dua jari tetap berfungsi di layar sentuh.

## Aksesibilitas {#accessibility}

Setiap gambar adalah `<svg role="img">` yang diberi nama oleh prop `title`, atau oleh deskripsi isinya, misalnya “Structure with its loads, reactions, bending moment”. Lapisan cadangan yang tersembunyi diberi `aria-hidden`.
