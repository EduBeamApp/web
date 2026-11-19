---
title: Joint dan tumpuan
description: "Buat joint model @edubeam/fem, beri tumpuan dengan menahan derajat kebebasan, putar sumbu tumpuan untuk rol miring, dan ubah joint setelah perhitungan."
order: 3
group: Pemodelan
source: site
---

# Joint dan tumpuan {#nodes-and-supports}

Joint adalah titik tempat batang-batang bersambung. Tumpuan bukan objek tersendiri: tumpuan adalah daftar derajat kebebasan yang ditahan sebuah joint. Potongan kode di halaman ini adalah bagian dari program seperti di [Memulai](/id/solver/getting-started), dan memakai `solver`, `domain`, serta `lc` dari program itu.

## Membuat joint {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Argumen | Tipe | Arti |
| --- | --- | --- |
| `label` | `string \| number` | Namanya, disimpan sebagai string: `1` dan `'1'` adalah joint yang sama |
| `coords` | `number[]` | `[x, y, z]` dalam meter, dengan `y = 0`. Sumbu z mengarah ke bawah. |
| `bcs` | `DofID[]` | Derajat kebebasan yang ditahan tumpuan. Untuk joint bebas, abaikan argumen ini. |

Metode ini mengembalikan `Node`; `domain.getNode(label)` menemukannya kembali. Label yang sudah dipakai akan menggantikan joint yang lama.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // bebas: puncak kolom setinggi 4 m
```

## Tumpuan {#supports}

Setiap tumpuan di aplikasi EduBeam adalah sekumpulan DOF yang ditahan:

| Tumpuan | `bcs` | Menahan |
| --- | --- | --- |
| Jepit | `[DofID.Dx, DofID.Dz, DofID.Ry]` | semuanya |
| Sendi | `[DofID.Dx, DofID.Dz]` | kedua perpindahan, bebas berotasi |
| Rol | `[DofID.Dz]` | perpindahan vertikal, menggelinding searah x |
| Rol vertikal | `[DofID.Dx]` | perpindahan horizontal, menggelinding searah z |
| Jepit geser | `[DofID.Dz, DofID.Ry]` | perpindahan vertikal dan rotasi, bergeser searah x |
| Jepit geser vertikal | `[DofID.Dx, DofID.Ry]` | perpindahan horizontal dan rotasi, bergeser searah z |
| Hanya rotasi ditahan | `[DofID.Ry]` | rotasi |

[Reaksi](/id/solver/results#reactions) dikembalikan dalam urutan yang sama dengan urutan Anda menuliskan DOF itu. Struktur memerlukan setidaknya tiga DOF yang ditahan, dengan susunan yang mencegahnya bergerak sebagai mekanisme: lihat [Jika perhitungan gagal](/id/solver/solving#when-solving-fails).

DOF yang ditahan juga dapat dipindahkan sebesar nilai tertentu, yaitu penurunan tumpuan: lihat [Perpindahan yang ditetapkan](/id/solver/temperature-settlements#prescribed-displacements).

## Tumpuan miring {#inclined-supports}

Rol di atas bidang miring menahan joint tegak lurus bidang miring itu, bukan secara vertikal. Putar sumbu joint dengan `updateLcs`, maka `bcs`-nya mengacu pada sumbu yang sudah diputar. Dalam program di halaman Memulai, buat B seperti ini sebagai gantinya:

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // menahan sumbu z miliknya sendiri
const a = (30 * Math.PI) / 180 // 30°, dari x ke arah z: searah jarum jam di layar
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` adalah sumbu x milik joint itu sendiri sebagai vektor dalam sumbu global, dan `locy` sumbu y-nya, yang tetap `[0, 1, 0]`. Di aplikasi EduBeam, sudut yang sama adalah *Sudut LCS joint* sebesar 30° (LCS = sistem koordinat lokal).

Setelah `solve()`, B mendorong tegak lurus bidang miring, dan tumpuan sendi di A memikul komponen horizontalnya:

```ts
b.getReactions(lc).values // [-41569]: N searah sumbu z milik B, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: searah x, searah z, momen
```

::model-figure{caption="Rol yang diputar 30°: reaksinya tegak lurus bidang miring, dan balok mengalami tarik"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, N]
show: [nodeLabels]
---
::

Komponen vertikalnya tetap $qL/2 = 36$ kN; komponen horizontalnya, $36 \tan 30° = 20{,}8$ kN, menarik balok dari kedua ujungnya. Momennya tidak berubah.

Pada joint yang sumbunya diputar, perpindahan dan reaksi dinyatakan dalam sumbu joint itu sendiri, kecuali Anda memberikan `true` untuk sumbu global. Beban joint padanya dinyatakan dalam sumbu global, kecuali Anda menentukan lain: lihat [Beban joint](/id/solver/loads#nodal-loads). `node.updateLcs()` tanpa argumen mengembalikan sumbunya ke posisi semula.

## Mengubah joint {#change-a-node}

Joint adalah objek biasa: ubah `node.coords` untuk memindahkannya, atau ganti `node.bcs`, sebuah `Set<DofID>`, untuk mengubah tumpuannya.

```ts
domain.getNode('B').coords = [8, 0, 0] // bentang lebih panjang: cukup solve()
domain.getNode('A').bcs = new Set(fixed) // tumpuan baru: nomori ulang dulu
solver.codeNumberGenerated = false
solver.solve()
```

Mengubah tumpuan, atau menambah dan menghapus joint, mengubah sistem persamaannya: tanpa `codeNumberGenerated = false` solver **diam-diam tetap memakai tumpuan lama**. [Menghitung ulang setelah perubahan](/id/solver/solving#solving-again-after-a-change) mencantumkan perubahan mana saja yang memerlukannya.
