---
title: Satuan dan tanda
description: "Satuan, sumbu, derajat kebebasan, dan konvensi tanda @edubeam/fem, serta bagaimana arah batang mengubah tanda hasilnya."
order: 2
source: site
---

# Satuan dan tanda {#units-and-signs}

Solver tidak memiliki sistem satuan sendiri: ia hanya menghitung dengan angka yang Anda berikan. Masukkan data dalam SI, maka semua hasil juga keluar dalam SI. Contoh-contoh di halaman ini, begitu pula aplikasi EduBeam, selalu memakai SI. Konvensi tandanya pun sama dengan aplikasi; manual teorinya menjelaskan konvensi itu dengan gambar di [Sistem koordinat & konvensi tanda](/id/elements/conventions).

## Satuan {#units}

| Besaran | Satuan | Contoh |
| --- | --- | --- |
| Koordinat, panjang, posisi pada batang | m | `[6, 0, 0]` |
| Gaya | N | `20e3` untuk 20 kN |
| Momen | N·m | `10e3` untuk 10 kNm |
| Beban garis | N/m | `12e3` untuk 12 kN/m |
| Modulus elastisitas (Young) dan modulus geser | Pa | `210e9` |
| Luas | m² | `28.5e-4` untuk 28,5 cm² |
| Momen inersia | m⁴ | `1943e-8` untuk 1943 cm⁴ |
| Perubahan suhu | K | `20` |
| Koefisien muai termal | 1/K | `12e-6` |
| Perpindahan, rotasi | m, rad | `0.01` untuk 10 mm |

Sistem satuan apa pun yang konsisten dapat dipakai, misalnya kN, m, dan kPa, yang memberikan hasil dalam kN dan kNm. Dengan SI Anda tidak perlu memeriksanya lagi.

## Sumbu {#axes}

- **x** mengarah ke kanan, **z mengarah ke bawah**, dan model terletak di bidang x–z. Koordinat ditulis `[x, y, z]`, dengan `y = 0`.
- **y** mengarah ke Anda, keluar dari layar. Rotasi dan momen bekerja terhadap sumbu y, jadi nilai positif berarti **berlawanan arah jarum jam** di layar.
- **Sumbu x lokal** batang berjalan dari joint pertamanya ke joint kedua. **Sumbu z lokal**-nya adalah sumbu x lokal yang diputar 90° searah jarum jam di layar: pada batang yang digambar dari kiri ke kanan, sumbu ini mengarah ke bawah.

Karena sumbu z mengarah ke bawah, beban gravitasi adalah `fz` positif, dan puncak kolom setinggi 4 m yang berdiri di $z = 0$ berada di $z = -4$.

## Derajat kebebasan {#degrees-of-freedom}

Setiap joint pada model `Beam2D` memiliki tiga derajat kebebasan (DOF), yang dinamai oleh enum `DofID`:

| `DofID` | Nilai | Arti |
| --- | --- | --- |
| `DofID.Dx` | 0 | Perpindahan searah x |
| `DofID.Dz` | 2 | Perpindahan searah z, ke bawah |
| `DofID.Ry` | 4 | Rotasi terhadap y, berlawanan arah jarum jam |

`Dy`, `Rx`, dan `Rz` (1, 3, 5) ada di dalam enum, tetapi tidak dipakai oleh batang bidang.

## Tanda hasil {#signs-of-the-results}

| Hasil | Positif berarti | Dibaca dengan |
| --- | --- | --- |
| Gaya normal N | tarik | `computeNormalForceAt` |
| Momen lentur M | tarik di sisi +z lokal: momen positif (serat bawah tertarik) pada balok yang digambar dari kiri ke kanan | `computeBendingMomentAt` |
| Gaya geser V | M bertambah sepanjang x lokal, $V = dM/dx$; pada balok yang digambar dari kiri ke kanan, gaya ini memutar potongan balok searah jarum jam: $+qL/2$ di tumpuan kiri balok sederhana | `computeShearForceAt` |
| Lendutan w | searah +z lokal: ke bawah, pada balok yang digambar dari kiri ke kanan | `computeLocalDefl` |
| Perpindahan joint | searah +x, +z (ke bawah), berlawanan arah jarum jam | `node.getUnknowns` |
| Reaksi | gaya yang diberikan tumpuan pada struktur, searah +x, +z (ke bawah), berlawanan arah jarum jam | `node.getReactions` |
| Gaya ujung | gaya yang diberikan joint pada batang, dalam sumbu lokal batang | `computeEndForces` |

Jadi tumpuan sendi pada balok yang dibebani ke bawah melaporkan reaksi −36 000 N searah z: 36 kN yang mendorong ke atas.

## Posisi pada batang {#positions-along-a-member}

Setiap metode `…At(lc, x)` menerima `x` dalam meter dari joint pertama batang, bukan sebagai pecahan dari panjangnya. Beban terpusat pada batang ditempatkan dengan cara yang sama.

## Arah batang {#member-direction}

M dan w diukur dalam sumbu batang itu sendiri, jadi urutan kedua joint-nya berpengaruh. Ambil balok 12 kN/m dari [Memulai](/id/solver/getting-started) dan definisikan dengan kedua arah. Bebannya diberikan dalam sumbu global, `[0, 12e3], false`, sehingga pada kedua balok beban itu mendorong ke bawah. Hasilnya dibaca dengan `computeBendingMomentAt(lc, 3)`, `computeLocalDefl(lc, 2).w[1]`, dan `computeShearForceAt`:

| Batang | M di tengah bentang | w di tengah bentang | V di A |
| --- | --- | --- | --- |
| `['A', 'B']`, dari kiri ke kanan | +54 000 N·m | +0,0499 m | +36 000 N, di `x = 0` |
| `['B', 'A']`, dari kanan ke kiri | −54 000 N·m | −0,0499 m | +36 000 N, di `x = 6` |

Jika didefinisikan dari kanan ke kiri, sumbu z lokal mengarah ke atas, sehingga balok yang sama, yang tetap melentur dengan serat bawah tertarik, melaporkan momen negatif dan lendutan ke atas. N dan V mempertahankan tandanya di setiap titik balok; hanya `x` yang dihitung dari ujung yang lain. Beban yang diberikan dalam sumbu lokal (`true`) ikut berputar bersama batang: pada balok dari kanan ke kiri, `[0, 12e3], true` mendorong ke atas.

::callout{type="tip" title="Definisikan batang seperti Anda menggambarnya"}
Balok dari kiri ke kanan, kolom dari bawah ke atas, maka tandanya sama seperti di buku teks. Pada kolom dari bawah ke atas, sumbu z lokal mengarah ke kanan, sehingga tarik di sisi kanan adalah momen positif. [Contoh program portal](/id/solver/frames#things-to-notice) memperlihatkannya.
::
