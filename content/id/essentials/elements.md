---
description: "Menggambar elemen balok di EduBeam, melepas ujungnya dengan sendi untuk sendi dalam dan batang rangka, serta mendefinisikan material dan penampang."
source: site
---

# Elemen, material & penampang

Setiap elemen di [EduBeam]{.edubeam} adalah balok di antara dua joint, dengan sebuah material dan sebuah penampang. Gambar elemen di antara joint, lepaskan ujungnya dengan sendi di tempat struktur memiliki sendi, lalu pilih material dan penampang dari pustaka atau definisikan sendiri.

## Elemen balok {#the-beam-element}

Hanya ada satu tipe elemen: **balok Timoshenko 2D** pada bidang x–z, dengan tiga derajat kebebasan di setiap ujung (`Dx`, `Dz`, `Ry`). Elemen ini memikul gaya normal, gaya geser, dan momen lentur, serta memperhitungkan [deformasi geser](#shear-deformation). Batang rangka adalah elemen yang sama dengan [kedua ujung bersendi](#end-hinges). Formulasinya ada di [manual teori](/id/elements/beam).

Hasil di sepanjang elemen eksak untuk model linear, sehingga **satu elemen per batang sudah cukup**. Tambahkan joint di dalam batang hanya di tempat Anda memerlukan tumpuan, sendi, perubahan penampang, atau titik untuk membaca perpindahan. Beban terpusat tidak memerlukan joint: [beban terpusat](/id/essentials/loads#concentrated-load) dapat diletakkan di titik mana pun di sepanjang elemen.

## Menambahkan elemen {#adding-elements}

Elemen memerlukan material dan penampang, jadi tambahkan keduanya lebih dulu (lihat [Material](#materials) dan [Penampang](#cross-sections)). Selama keduanya belum ada, tampilan menunjukkan *Belum ada material yang didefinisikan* atau *Belum ada penampang yang didefinisikan*, dengan tombol **Tambah baru**.

- **Dengan memilih joint.** Tab *Elemen* → **Tambah elemen** (tombol berikon **+**), atau klik kanan kanvas → *Tambah elemen*. Pilih **Joint awal** dan **Joint akhir**, centang **Sendi** di bawah salah satunya jika perlu, lalu pilih **Material** dan **Penampang**. Cara ini memerlukan setidaknya dua joint.
- **Dengan mengeklik.** Tab *Elemen* → **Tambah elemen** (tombol berikon kursor), atau tahan <kbd>Ctrl</kbd> saat memilih *Tambah elemen* di menu kanvas. Klik sebuah joint (atau kanvas yang kosong, yang membuat joint baru), lalu joint berikutnya; terus klik untuk menggambar rangkaian elemen, dan tekan <kbd>Esc</kbd> atau **Batal** untuk selesai. Banner di atas mengatur **Sendi awal** dan **Sendi akhir** untuk setiap elemen yang Anda gambar. Elemen mendapat material dan penampang pertama dalam model.

![Dialog Tambah elemen](/screenshots/id/qs-element.webp){.shot-md}

## Arah elemen {#element-direction}

Setiap elemen memiliki **sumbu lokal** sendiri. Sumbu x lokal mengarah dari **joint awal** ke **joint akhir**; sumbu z lokal adalah sumbu x lokal yang diputar 90° searah jarum jam di layar. Pada elemen yang digambar dari kiri ke kanan, sumbu lokal sama dengan sumbu global. **Garis putus-putus** di sepanjang setiap elemen menandai sisi +z lokalnya, yaitu “serat bawah”.

![Portal yang digambar A → B → C → D: garis putus-putus ketiga elemennya berada di sisi dalam portal](/screenshots/id/p2b-element-direction.webp){.shot-md}

Pada portal ini, elemen 1 mengarah ke atas dari A ke B, sehingga sumbu z lokalnya, dan garis putus-putusnya, mengarah ke kanan; elemen 3 mengarah ke bawah dari C ke D, sehingga garis putus-putusnya berada di kiri. Jika digambar dengan cara ini, semua garis putus-putus portal berada di sisi dalam.

Arah elemen berpengaruh pada:

- beban yang diberikan dalam sumbu lokal (**LCS** dicentang), lihat [Beban elemen](/id/essentials/loads#element-loads);
- **Posisi beban dari joint awal** pada beban terpusat;
- urutan [gaya ujung](/id/elements/conventions#end-forces-element-results-table) dalam hasil: `X12, Z12, M12` di joint awal, `X21, Z21, M21` di joint akhir;
- sisi mana yang menjadi “sisi putus-putus” dalam [pengaturan diagram](/id/essentials/units-settings#viewer-settings).

Untuk membalik elemen, tekan **Tukar joint** (tanda panah di antara kedua joint pada tabel *Elemen*).

## Sendi ujung {#end-hinges}

Sendi ujung melepas momen lentur di salah satu ujung elemen: momen di sana nol, dan ujung itu dapat berotasi tanpa terikat pada rotasi joint.

- **Satu sendi** membuat sendi dalam pada balok atau portal.
- **Dua sendi** membuat **batang rangka**, yang hanya memikul gaya normal.

Centang sendi di salah satu tempat berikut:

- kolom **Sendi ujung** pada tabel *Elemen*, satu kotak centang untuk setiap ujung;
- kotak **Sendi** di dialog **Tambah elemen**, atau di panel elemen → **Edit elemen**;
- **Sendi awal** dan **Sendi akhir** di banner saat menggambar dengan mouse.

![Tabel Elemen dari portal tiga sendi: elemen 2 memiliki sendi di ujung akhirnya, di joint C](/screenshots/id/elements-table.webp)

### Satu sendi: sendi di dalam struktur {#one-hinge-a-pin-inside-the-structure}

Balok menerus yang sama, dua bentang 5 m dengan beban 10 kN/m. Pada gambar kanan, elemen 1 memiliki sendi ujung di B: momen di atas tumpuan turun menjadi nol, dan setiap bentang memikul bebannya seperti balok sederhana.

::div{.shots}

:::model-figure{caption="Menerus: M = −31,25 kNm di atas B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Bersendi di B: M = 0 di atas B, 31,25 kNm di setiap bentang"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [{ nodes: [A, B], hinges: [false, true] }, [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

::

Perhitungan manual: pada balok menerus, $M_B = -qL^2/8 = -31{,}25\ \text{kNm}$ dan di setiap bentang paling besar $9qL^2/128 = 17{,}58\ \text{kNm}$; dengan sendi, $M_B = 0$ dan $M_{max} = qL^2/8 = 31{,}25\ \text{kNm}$ di setiap tengah bentang. Sendi membebaskan tumpuan dari momen, tetapi momen lapangan hampir menjadi dua kali lipat. Jika ingin berlatih menghitung balok dengan sendi dalam secara manual, dengan jawaban yang langsung diperiksa saat Anda mengetik, coba [soal latihan G2048](/id/practice?p=G2048).

### Dua sendi: batang rangka {#both-hinges-a-truss-bar}

Konsol dinding dari dua batang, keduanya bersendi di kedua ujung, memikul 20 kN di B. Batang-batangnya hanya memikul gaya normal, dan diagram momennya kosong.

::model-figure{caption="Batang tarik AB: N = +26,67 kN (tarik); batang tekan CB: N = −33,33 kN (tekan)"}
---
nodes: { A: [0, 0], B: [4, 0], C: [0, 3] }
supports: { A: pin, C: pin }
members: [{ nodes: [A, B], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: B, fz: 20 }
results: [N, M]
show: [nodeLabels]
---
::

Perhitungan manual: batang tekan panjangnya 5 m dan naik 3 m, sehingga $N_{CB} = -20 \cdot 5/3 = -33{,}33\ \text{kN}$, dan batang tarik mengimbangi komponen horizontalnya, $N_{AB} = 33{,}33 \cdot 4/5 = 26{,}67\ \text{kN}$. Tutorial [Rangka batang bidang](/id/tutorials/truss) menyusun seluruh rangka batang dengan cara ini, dan [Latihan soal](/id/practice?p=T2048) menyediakan rangka batang untuk dihitung secara manual.

### Sendi dipasang pada elemen, bukan pada joint {#hinge-the-element-not-the-node}

Sendi selalu terpasang pada satu ujung satu elemen: sendi membebaskan ujung itu untuk berotasi sendiri, sedangkan semua elemen lain di joint tersebut tetap tersambung kaku dengannya. Jadi di tempat dua batang bertemu, satu sendi sudah membuat sambungan sendi; di tempat beberapa batang bertemu, beri sendi pada semuanya kecuali satu. Pada joint rangka batang, semua batangnya adalah batang rangka, jadi semuanya bersendi.

Joint yang semua elemennya bersendi tidak memiliki kekakuan rotasi. EduBeam menerimanya dan melaporkan rotasinya sebagai 0. Jika sendi membuat struktur menjadi mekanisme, EduBeam melingkari sendi-sendi itu dan menunjukkan bagaimana struktur bergerak; lihat [Pemecahan masalah](/id/reference/troubleshooting#messages).

## Mengedit dan menghapus {#editing-and-deleting}

| Untuk | Lakukan ini |
| --- | --- |
| Mengubah joint, sendi, material, atau penampang | Klik elemen → **Edit elemen**, atau edit di tabel *Elemen*. |
| Membaliknya | **Tukar joint** di tabel *Elemen*. |
| Mengganti namanya | Ketik label baru di kolom *Elemen*. |
| Melihat matriks kekakuannya | Klik elemen → **Matriks kekakuan**, atau tombol matriks di kolom *Aksi*. Sebuah jendela menampilkan matriks elemen 6 × 6 dalam sumbu global, dalam satuan SI (N dan m) apa pun satuan yang ditampilkan, dan sendi ujungnya sudah dieliminasi dengan kondensasi statis. Berguna untuk memeriksa perakitan matriks secara manual. |
| Menghapusnya | Klik elemen → **Hapus**, tombol × di tabel, atau pilih elemen lalu tekan <kbd>Delete</kbd>. Bebannya ikut terhapus. |

![Panel elemen](/screenshots/id/ui-element-menu.webp){.shot-xs}

## Material {#materials}

Tab *Material* → **Tambah material**, atau **Pustaka material** untuk material siap pakai. Banyak elemen dapat memakai satu material yang sama; mengubah material itu memperbarui semuanya.

| Kolom | Satuan | Fungsinya |
| --- | --- | --- |
| Modulus elastisitas $E$ | MPa | Kekakuan aksial dan lentur, $EA$ dan $EI_y$. Baja 210 000 MPa, beton sekitar 30 000 MPa, kayu sekitar 11 000 MPa. |
| Modulus geser $G$ | MPa | Kekakuan geser $kGA$. Kecuali $k$ penampang sangat besar, $G$ menambahkan [deformasi geser](#shear-deformation): lendutan lebih besar dan, pada struktur statis tak tentu, gaya dalam yang berbeda. $G = E/(2(1+\nu))$: baja sekitar 81 000 MPa. |
| Massa jenis $\rho$ | kg/m³ | Disimpan bersama material, tetapi tidak dipakai: tidak ada beban berat sendiri. |
| Koefisien muai panas $\alpha$ | 1/K | Dipakai oleh [beban suhu](/id/essentials/loads#temperature-load). Baja $12 \times 10^{-6}$ 1/K. |

Satuan di atas adalah satuan SI bawaan; satuan yang tampil mengikuti [pengaturan](/id/essentials/units-settings#units) Anda, sehingga dalam satuan AS, E dan G dinyatakan dalam ksi, massa jenis dalam lb/ft³, dan α dalam 1/°F.

Material baru dimulai dengan $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2{,}4$, yaitu $\nu = 0{,}2$), $\rho$ = 1000 kg/m³, dan $\alpha = 12 \times 10^{-6}$ 1/K; dalam satuan AS, material baru adalah baja ASTM A992. Untuk baja, ubah $G$ menjadi 81 000 MPa atau pilih baja dari pustaka.

![Dialog Tambah material](/screenshots/id/qs-material.webp){.shot-md}

**Pustaka material** (juga *Atau pilih dari pustaka* di dialog Tambah material) menampilkan material metrik (EN) lebih dulu, atau material AS (baja ASTM, beton ACI) lebih dulu jika satuan panjang Anda feet atau inci. Tombol **+** di sebuah baris menambahkan material itu dengan nama yang sama:

| Kelompok | Material |
| --- | --- |
| Logam | Baja S235, S275, S355; baja tahan karat 304, 316; besi tuang; aluminium 6061-T6, 7075-T6, 5083; tembaga, kuningan, perunggu; titanium Grade 2 dan Ti-6Al-4V; baja AS ASTM A992, A36, A572 Gr. 50 dan HSS A500 Gr. C |
| Beton | C25/30, C30/37, C40/50, beton ringan; beton AS $f'_c$ = 4 ksi dan 5 ksi |
| Kayu | C24, GL24h, GL32h |
| Lainnya | Kaca, GFRP, CFRP, HDPE, PVC, PMMA, polikarbonat |

Material yang masih dipakai elemen tidak dapat dihapus: pasang material lain pada elemen-elemen itu terlebih dahulu.

## Penampang {#cross-sections}

Tab *Penampang* → **Tambah penampang**, **Pustaka penampang**, atau **Penampang poligon** untuk menggambar bentuk sendiri. Seperti material, satu penampang dapat dipakai oleh banyak elemen.

| Kolom | Satuan | Fungsinya |
| --- | --- | --- |
| Luas $A$ | m² | Kekakuan aksial $EA$, dan luas geser $kA$. |
| Momen inersia $I_y$ | m⁴ | Kekakuan lentur $EI_y$, terhadap sumbu yang tegak lurus bidang gambar. |
| Tinggi $h$ | m | Hanya dipakai oleh beban suhu: kelengkungannya $\alpha\,(\Delta T_b - \Delta T_t)/h$. |
| Koefisien geser $k$ | – | Luas geser efektif adalah $kA$, sehingga kekakuan gesernya $kGA$. Sekitar 0,83 untuk persegi panjang, $A_{web}/A$ untuk profil I. |

Penampang baru dimulai dengan $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m, dan $k$ = 1 (dalam satuan AS, profil W12×26 dengan $k$ = 1). Ganti dengan nilai penampang Anda, atau pilih dari pustaka.

::callout{type="tip" title="Menyamakan hasil dengan buku teks yang mengabaikan deformasi geser"}
Sebagian besar perhitungan manual memakai balok Euler–Bernoulli, tanpa deformasi geser. Untuk menyamakan hasilnya, beri $k$ nilai yang sangat besar, misalnya `1e10`; contoh di aplikasi dan gambar di situs ini memakai `1e32`. Penampang baru ($k = 1$), pustaka, dan editor poligon semuanya memperhitungkan deformasi geser; seberapa besar pengaruhnya dijelaskan [di bawah](#shear-deformation).
::

**Pustaka penampang** memberikan nilai pendekatan untuk:

| Kelompok | Penampang | $k$ |
| --- | --- | --- |
| Pejal | Persegi panjang, persegi, lingkaran | 0,833 (persegi panjang), 0,9 (lingkaran) |
| Profil I | IPE 100, IPE 200, HEA 100, HEA 200; profil AISC W8×31 sampai W36×150 | $h\,t_w/A$, badan profil |
| Pipa persegi panjang | RHS 100×50×3, 150×100×5; AISC HSS | $2ht/A$, kedua badan |
| Pipa bulat | CHS Ø60×3, Ø114×5; AISC HSS bulat | 0,5 |

Periksa nilai dari pustaka dengan tabel profil sebelum mengandalkannya.

![Pustaka penampang](/screenshots/id/sections-library.webp){.shot-lg}

Untuk pemeriksaan cepat secara manual: persegi panjang $b \times h$ memiliki $A = bh$ dan $I_y = bh^3/12$; lingkaran pejal berdiameter $d$ memiliki $A = \pi d^2/4$ dan $I_y = \pi d^4/64$.

### Deformasi geser: kapan G dan k berpengaruh {#shear-deformation}

Kekakuan geser $kGA$ masuk ke elemen melalui [parameter geser](/id/elements/beam#timoshenko-or-euler-bernoulli) $\Phi = 12EI_y/(kGAL^2)$. Dengan $k$ yang sangat besar, $\Phi = 0$ dan elemen menjadi balok Euler–Bernoulli, sehingga $G$ tidak berpengaruh. Dengan $k$ yang sebenarnya, deformasi geser selalu menambah lendutan. Pada struktur statis tertentu gaya dalam tetap sama; pada struktur statis tak tentu gaya dalam juga berubah, karena gaya kelebihannya bergantung pada kekakuan.

Seberapa besar perubahannya bergantung pada kelangsingan batang. Ambil profil IPE 200 dari pustaka ($k = h\,t_w/A = 0{,}393$), baja S235 ($G$ = 81 000 MPa), dan beban 10 kN/m, lalu bandingkan dengan balok yang sama dengan $k$ = `1e32`:

| Balok | Dengan deformasi geser | Euler–Bernoulli |
| --- | --- | --- |
| Balok sederhana, $L$ = 2 m ($L/h$ = 10): lendutan di tengah bentang | 0,566 mm | 0,511 mm |
| Balok jepit–rol, $L$ = 2 m: momen di ujung jepit | −4,84 kNm | −5,00 kNm |
| Balok sederhana, $L$ = 6 m ($L/h$ = 30): lendutan di tengah bentang | 41,85 mm | 41,36 mm |

Perhitungan manual: bagian geser dari lendutan di tengah bentang adalah $qL^2/(8kGA)$, yaitu 0,055 mm untuk balok pendek, tambahan 11% terhadap bagian lentur $5qL^4/(384EI_y)$. Pada balok jepit–rol, momen ujung jepit turun dari $qL^2/8$ menjadi $(qL^2/8)/(1 + \Phi/4)$. Pada $L/h$ = 30 kedua pengaruh itu sekitar 1% atau kurang; itulah sebabnya portal yang langsing dan jawaban buku teks tetap cocok berapa pun nilai $k$.

### Penampang poligon {#polygonal-sections}

Tab *Penampang* → **Penampang poligon**, atau *Atau definisikan bentuk poligon* di dialog Tambah penampang, membuka editor bentuk yang menghitung properti penampang untuk Anda.

![Editor penampang poligon dengan preset profil I, sumbu utama, dan elips inersianya](/screenshots/id/sections-polygon.webp)

::div{.steps}

### Mulai dari preset {#start-from-a-preset}

Pilih sebuah **Preset** (persegi panjang, profil I, profil T, profil L, kanal, persegi berongga, lingkaran, pipa), atur dimensinya, lalu tekan **Terapkan**.

### Sesuaikan bentuknya {#adjust-the-shape}

Seret titik sudut (titik sudut menempel pada **Jarak snap**), klik titik tengah sisi untuk menyisipkan titik sudut, atau klik ganda titik sudut untuk menghapusnya. Anda juga dapat mengetik koordinat di tabel **Titik sudut**. **Tambah lubang** menambahkan kontur dalam, dan **Pusatkan di titik berat** memindahkan bentuk sehingga titik beratnya berada di titik asal.

### Baca propertinya {#read-the-properties}

Tab **Properti penampang** menampilkan $A$, titik berat, $I_y$, $I_z$, $I_{yz}$ terhadap titik berat, momen inersia utama $I_1$, $I_2$ dengan **Sudut sumbu utama** $\alpha$ (dari $y$ ke sumbu 1), serta jari-jari girasi. Gambar menampilkan sumbu utama dan elips inersia.

### Tambahkan penampangnya {#add-it}

Periksa **Label** dan **Koefisien geser** $k$: nilai awalnya 0,833, tepat untuk persegi panjang; profil I memerlukan sekitar $A_{web}/A$. Lalu tekan **Tambah penampang** (**Simpan** jika Anda mengedit bentuk yang sudah ada). $A$, $I_y$, dan $h$ diambil dari bentuknya dan hanya-baca di tabel; untuk mengubahnya, edit bentuknya lagi dengan tombol poligon di kolom *Aksi*.

::

Koordinat penampang bersifat lokal dan mengikuti kaidah tangan kanan: $x$ keluar dari layar, $y$ ke kiri, $z$ ke bawah.

Jika bentuknya tidak simetris terhadap bidang portal (misalnya profil siku L), editor memperingatkan Anda: analisis 2D hanya eksak jika batang ditahan terhadap lendutan ke samping dan terhadap puntir di sepanjang batang, misalnya oleh pelat. Jika $I_{yz}$ cukup besar, Anda dapat memilih kekakuan lentur yang dipakai: **ditahan ke samping dan terhadap puntir di sepanjang batang** ($I_y$), atau **bebas melendut ke samping**, yang lebih kecil. Puntir tidak diperhitungkan pada kedua pilihan.
