---
description: "Membaca hasil EduBeam: diagram N, V, dan M, bentuk deformasi dan reaksi, tandanya, tooltip, tabel hasil, ekspor CSV, matriks kekakuan, dan format angka."
source: site
---

# Hasil & diagram

[EduBeam]{.edubeam} menghitung model setelah setiap perubahan, sehingga diagram, reaksi, dan tabel di layar selalu sesuai dengan model yang Anda lihat. Tidak ada tombol *Hitung*. Jika tidak ada yang digambar, model belum dapat dihitung: pesan di kiri atas tampilan menjelaskan alasannya, dan [Pemecahan masalah](/id/reference/troubleshooting) menjelaskan setiap pesan.

## Lapisan di tampilan {#overlays-in-the-viewer}

Hasil digambar di atas model. Aktifkan dan nonaktifkan hasil di **opsi tampilan** di kanan atas tampilan; tombol ⚙ di atasnya menampilkan atau menyembunyikan panel itu.

::model-figure{caption="Portal tiga sendi, 10 kN/m: pilih M, V, N, atau bentuk deformasi"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, V, N, w]
show: [nodeLabels]
height: 300
---
::

| Kotak centang | Yang digambar | Warna | Aktif sejak awal |
| --- | --- | --- | --- |
| **Bentuk deformasi** | bentuk struktur setelah berpindah, diperbesar agar terlihat | abu-abu | ya |
| **N (x)** | gaya normal | biru | |
| **V<sub>z</sub> (x)** | gaya geser | hijau | |
| **M<sub>y</sub> (x)** | momen lentur | merah | ya |
| **Reaksi** | panah dan nilai untuk setiap arah yang ditahan | ungu | ya |

Baris kedua mengatur gambar model itu sendiri: **Tumpuan**, **Beban**, **Label joint**, dan **Label elemen**. **Pengaturan lain** di bawah panel membuka [pengaturan tampilan](/id/essentials/units-settings#viewer-settings), tempat Anda mengatur ukuran diagram (*Skala hasil*), warna, orientasi label, dan gaya diagram.

Nilai dituliskan di tempat yang penting: di kedua ujung setiap batang, di kedua sisi lompatan di bawah beban terpusat atau di atas tumpuan, dan di setiap nilai ekstrem diagram, misalnya puncak parabola tempat $V = 0$. Gambar di atas menunjukkan [portal tiga sendi](/id/tutorials/three-hinged-frame), yang dapat Anda periksa secara manual: gaya tekan 40 kN di setiap kolom, 20 kN di balok, dan −80 kNm di kedua sudut portal. Tampilan *w*-nya menunjukkan sendi di C turun 42,55 mm.

### Membaca tanda {#reading-the-sign}

Baca tanda dari **nilainya**, bukan dari sisi batang tempat diagram digambar. Konvensinya sama dengan sebagian besar buku teks:

| Hasil | Positif berarti |
| --- | --- |
| **N** | tarik |
| **V<sub>z</sub>** | memutar potongan kecil batang searah jarum jam. Karena $V = \mathrm{d}M/\mathrm{d}x$, gaya geser positif di tumpuan kiri balok sederhana yang dibebani gravitasi dan negatif di tumpuan kanan |
| **M<sub>y</sub>** | momen positif: serat bawah tertarik, di sisi **garis putus-putus** yang digambar di sepanjang setiap batang |

Balok dengan overstek menunjukkan kedua tanda sekaligus. Di antara tumpuan, momennya positif (+13,5 kNm); di atas tumpuan kanan, momennya negatif (−24 kNm), dengan serat atas tertarik. Gaya geser melompat sebesar reaksi 54 kN di B, dari −30 ke +24 kN:

::model-figure{caption="Balok dengan overstek, 12 kN/m: momen positif di antara tumpuan, momen negatif di atas B"}
---
nodes: { A: [0, 0], B: [4, 0], C: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

Secara bawaan, momen lentur digambar di **sisi tarik**, sedangkan gaya normal dan gaya geser positif di sisi yang berlawanan dengan garis putus-putus. Kebiasaan tiap perguruan tinggi berbeda di sini, jadi masing-masing dapat dibalik di **Pengaturan → Pengaturan tampilan → Diagram gaya dalam**; di sana Anda juga dapat mengarsir diagram seperti digambar dengan tangan dan memberi label derajat polinomial pada setiap segmen. Membalik sisi hanya mengubah gambar, tidak pernah mengubah nilai. Konvensi tanda selengkapnya, termasuk sumbu lokal elemen, ada di [manual teori](/id/elements/conventions#internal-forces).

## Tooltip {#hover-tooltips}

Arahkan kursor ke sebuah objek untuk membaca nilainya:

- **Joint**: perpindahan $u_x$, $u_z$ (dalam satuan perpindahan) dan rotasi $\varphi_y$ (dalam radian).
- **Elemen**: label, penampang, dan materialnya.
- **Beban**: komponennya.

Di layar sentuh, ketuk objeknya: panelnya menampilkan detail yang sama.

![Mengarahkan kursor ke joint 2 pada balok dari Mulai cepat](/screenshots/id/ui-hover.webp){.shot-sm}

## Tab Hasil {#results-tab}

Tab **Hasil** di bilah bawah memuat dua tabel, yang dapat dipilih dengan tombol **Hasil joint** dan **Hasil elemen**.

### Hasil joint {#nodal-results}

Satu baris per joint dengan perpindahan **D<sub>x</sub>** dan **D<sub>z</sub>** (dalam satuan perpindahan) dan rotasi **R<sub>y</sub>** (dalam radian), dalam sumbu global: D<sub>z</sub> positif ke bawah dan R<sub>y</sub> positif berlawanan arah jarum jam di layar. Arah yang ditahan tumpuan menunjukkan 0, atau penurunan tumpuan yang Anda tetapkan. Reaksi tidak ada di tabel ini: baca reaksi di gambar, atau di [ekspor CSV](#export-csv-and-copy).

![Hasil joint dari portal tiga sendi di atas, dengan Format angka diatur ke Otomatis](/screenshots/id/p2c-results-nodal.webp){.shot-lg}

### Hasil elemen {#element-results}

Satu baris per elemen dengan **gaya ujung dalam sistem koordinat lokal elemen**:

| Kolom | Arti |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | gaya aksial, gaya geser, dan momen yang bekerja pada elemen di joint **awal**-nya |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | hal yang sama di joint **akhir**-nya |

![Hasil elemen dari portal tiga sendi: gaya ujung keempat batangnya](/screenshots/id/p2c-results-element.webp)

Gaya ujung adalah gaya yang diberikan joint pada elemen. Gaya ini mengikuti sumbu lokal, bukan konvensi N-V-M pada diagram, sehingga tandanya berbeda:

- **Balok sederhana** (6 m, 12 kN/m, dari [Mulai cepat](/id/guide/quick-start)): Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. Kedua tumpuan mendorong balok ke atas, yaitu ke arah −z.
- **Kantilever** yang dijepit di joint awalnya, dengan beban 18 kN ke bawah di ujung bebas: Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **Kolom 1 portal** (A di bawah, B di atas): X<sub>12</sub> = +40 kN mendorong searah sumbu x lokal ke dalam elemen, yaitu tekan sebesar 40 kN.

Penjelasan lebih lanjut tentang tabel ini ada di [manual teori](/id/elements/conventions#end-forces-element-results-table).

### Ekspor CSV dan Salin {#export-csv-and-copy}

**Ekspor CSV** mengunduh `edubeam-results.csv` berisi kedua tabel, dalam satuan yang ditampilkan di layar dan siap dibuka di spreadsheet. **Salin** menaruh tabel yang sama di clipboard sebagai teks yang dipisahkan tab, yang dapat langsung ditempel ke Excel, LibreOffice, atau Google Sheets.

| Tabel | Kolom |
| --- | --- |
| Joint | `Node`, `x`, `z`, `Dx`, `Dz`, `Ry`, dan **reaksi** `Rx`, `Rz`, `My` |
| Elemen | `Element`, `Node 1`, `Node 2`, dan gaya ujung `N1`, `V1`, `M1`, `N2`, `V2`, `M2` |

Setiap judul kolom mencantumkan satuannya, misalnya `Dz [mm]`. Gaya ujung elemen adalah nilai lokal yang sama dengan X<sub>12</sub> … M<sub>21</sub> di layar.

### Matriks kekakuan {#stiffness-matrix}

Pilih **Matriks kekakuan** di panel elemen, atau dengan tombol di barisnya pada tabel *Elemen*, untuk membuka matriks kekakuan elemen berukuran 6 × 6 dalam **koordinat global** dan satuan SI (N, m). Matriks ini berguna untuk memeriksa perakitan manual dalam mata kuliah metode kekakuan; rumusnya ada di [manual teori](/id/elements/beam).

## Format angka {#number-format}

Tabel dan tooltip menampilkan hasil dengan lima angka penting. **Pengaturan → Bahasa & Wilayah → Format angka** menentukan cara penulisannya:

| Format | 40 000 ditulis sebagai | Cocok untuk |
| --- | --- | --- |
| **Ilmiah** (bawaan) | 4 · 10⁴ | nilai yang mencakup banyak orde besaran |
| **Teknik** | 40 · 10³ | membaca awalan kilo dan mega |
| **Otomatis** | 40.000 | angka sehari-hari dalam perkuliahan |

*Otomatis* menulis nilai dari 0,001 sampai 100 000 sebagai angka biasa. Di luar rentang itu, nilainya ditulis seperti pada format *Teknik*, dengan pangkat sepuluh berkelipatan tiga, misalnya 380,95 · 10⁻⁹ pada hasil joint di atas. Pemisah desimal mengikuti bahasa.

Label pada gambar (nilai diagram dan reaksi) selalu memiliki dua angka desimal, apa pun format angkanya: 6,6667 kN tertulis 6,67. Lihat tabel atau tooltip jika Anda memerlukan lebih banyak digit.

## Presisi dan akurasi {#precision-and-accuracy}

- Elemen balok eksak untuk model Timoshenko linear di bawah beban joint, beban merata, beban trapesium, beban terpusat, dan beban suhu. Hasilnya **tidak** bergantung pada jumlah elemen, dan tidak ada jaring elemen yang perlu diperhalus.
- Perhitungan berjalan dalam presisi ganda. Nilai yang lebih kecil dari sepertriliun nilai terbesar sejenisnya adalah galat pembulatan, dan tabel menampilkannya sebagai 0.
- Lendutan mencakup **deformasi geser**, dan pada struktur statis tak tentu deformasi geser juga sedikit mengubah gaya dalam. Pada batang langsing, tambahannya hanya sepersekian persen dari lendutan Euler–Bernoulli; pada batang pendek dan tinggi, tambahannya dapat mencapai sepuluh persen atau lebih. [Memeriksa hasil secara manual](/id/guide/verification#shear-deformation) menunjukkan seberapa besar pengaruhnya, dan cara menonaktifkannya untuk membandingkan dengan rumus buku teks.

## Hasil dalam laporan {#results-in-a-report}

- **☰ → Ekspor gambar** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) menyimpan gambar sebagai PNG atau SVG dengan diagram yang Anda pilih. Lihat [Mengekspor gambar](/id/essentials/import-export#export-an-image).
- **Ekspor CSV** atau **Salin** di tab Hasil memberikan angkanya.
- **Bagikan model** memberikan tautan, sehingga pembaca dapat membuka modelnya sendiri.
- Untuk catatan kuliah dan lembar soal, [@edubeam/plot](/id/plot) menggambar diagram yang sama dari kode.
