---
title: Perhitungan
description: "Apa yang dilakukan solve() di @edubeam/fem, kapan persamaan dinomori ulang setelah perubahan, cara mengenali mekanisme, dan sebesar apa model yang sanggup dihitung."
order: 9
group: Perhitungan dan hasil
source: site
---

# Perhitungan {#solving}

```ts
solver.solve()
```

`solve()` menomori persamaan, merakit matriks kekakuan global dan vektor beban setiap kasus beban, lalu menyelesaikannya untuk mendapatkan perpindahan dan reaksi. Setelah itu, setiap [hasil](/id/solver/results) dapat dibaca; sebelumnya, membaca hasil akan memunculkan `TypeError`. Langkah-langkahnya sama dengan yang dijelaskan di [Cara EduBeam menghitung model](/id/elements/analysis) pada manual teori.

Solusinya eksak untuk model linear: bentuk deformasi dan gaya dalam di sepanjang setiap batang berasal dari rumus tertutup balok Timoshenko, jadi tidak ada jaring elemen yang perlu diperhalus dan batang tidak perlu dibagi-bagi demi diagram yang akurat.

Sejak versi 0.3.1, `solve()` tidak menulis apa pun ke konsol; versi 0.3.0 menampilkan baris seperti `Solution took 9 [ms]` pada setiap panggilan.

## Menghitung ulang setelah perubahan {#solving-again-after-a-change}

Mengubah angka dalam model hanya memerlukan `solve()` sekali lagi. Jika yang berubah adalah persamaannya sendiri, yaitu derajat kebebasan mana saja yang ada, tambahkan dulu satu baris:

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // DOF berubah: nomori ulang
solver.solve()
```

| Perubahan | Lalu |
| --- | --- |
| Nilai beban, beban baru atau yang dihapus | `solve()` |
| Koordinat joint, material, penampang, sendi | `solve()` |
| Menambah joint atau batang | `codeNumberGenerated = false`, lalu `solve()` |
| Menghapus joint atau batang: `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false`, lalu `solve()` |
| Mengubah tumpuan joint, `node.bcs` | `codeNumberGenerated = false`, lalu `solve()` |

Jika Anda melupakannya setelah menambah joint, `solve()` memunculkan `TypeError`. Jika Anda melupakannya setelah mengubah tumpuan, solver **diam-diam** menghitung dengan tumpuan lama. Jika ragu, atur ulang saja: penomoran hampir tidak memakan waktu. Menghapus batang juga berarti menghapus bebannya dari `lc.elementLoadList`; jika tidak, `solve()` memunculkan `RangeError` karena batangnya tidak ditemukan.

Untuk banyak variasi dari satu model, misalnya studi parametrik, solver baru untuk setiap variasi lebih sederhana dan sama cepatnya: lihat [contoh program garis pengaruh](/id/solver/scripts#an-influence-line-as-csv).

## Jika perhitungan gagal {#when-solving-fails}

Struktur yang dapat bergerak tanpa berdeformasi, yaitu mekanisme, memiliki matriks kekakuan singular. Kadang `solve()` menyadarinya dan memunculkan exception:

```text
Error: Linear system cannot be solved since matrix is singular
```

Sering kali tidak: galat pembulatan membuat matriksnya tampak dapat diselesaikan, dan Anda mendapat perpindahan sebesar $10^{12}$ m, atau angka yang tampak wajar untuk struktur yang sebenarnya bebas bergeser. Balok di atas dua tumpuan rol, misalnya, tetap terhitung tanpa pesan kesalahan selama tidak ada yang mendorongnya ke samping. Jadi periksa sendiri tumpuannya, dan anggap perpindahan yang sangat besar sebagai tanda mekanisme.

Penyebab yang umum:

- tumpuan terlalu sedikit, misalnya balok di atas dua tumpuan rol;
- tumpuan yang tidak dapat menahan struktur: semuanya sejajar, atau semuanya mengarah ke satu titik;
- satu sendi terlalu banyak, misalnya tiga sendi segaris;
- momen yang bekerja pada joint yang semua ujung batangnya bersendi.

Pesan kesalahannya tidak menyebutkan letak masalahnya. Aplikasi EduBeam memeriksa mekanisme sebelum menghitung, lalu menemukan dan menganimasikan gerakannya; membangun model yang sama di sana sering kali menjadi cara tercepat untuk melihatnya. [Pemecahan masalah](/id/reference/troubleshooting) mencantumkan penyebab yang umum.

Joint, material, atau penampang yang tidak ada memunculkan `RangeError` yang menyebutkan namanya. Parameter penampang yang terlupa sama sekali tidak memunculkan exception: setiap hasil menjadi `NaN`. Lihat [Material dan penampang](/id/solver/materials-sections#cross-section).

## Ukuran model {#model-size}

Solver memakai matriks penuh (dense), dirancang untuk model seukuran soal kuliah. Pada laptop, di Node, deretan batang yang lurus terhitung dalam waktu sekitar:

| Batang | DOF | Waktu |
| --- | --- | --- |
| 50 | 150 | 0,1 s |
| 100 | 300 | 0,2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

Setiap kali ukuran model dilipatgandakan, waktunya menjadi enam sampai sembilan kali lebih lama.

Setiap soal latihan, portal, dan rangka batang dalam mata kuliah analisis struktur dapat ditangani dengan mudah. Solver ini tidak ditujukan untuk model dengan ribuan batang.

## Tidak ada analisis lain {#no-other-analyses}

Versi ini hanya menghitung statika linear. Kode sumbernya memuat solver nilai eigen untuk frekuensi alami, tetapi solver itu bukan bagian dari paket yang dipublikasikan: `EigenValueDynamicSolver` tidak dapat diimpor dari `@edubeam/fem`.
