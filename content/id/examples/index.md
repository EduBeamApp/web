---
description: "Enam balok, portal, dan rangka batang yang sudah dihitung dan terbuka di EduBeam dengan satu klik, masing-masing dengan latihan dan jawaban untuk dicocokkan."
source: site
---

# Contoh

Setiap kartu di bawah adalah model interaktif yang sudah dihitung. Klik salah satunya untuk membukanya di [EduBeam]{.edubeam}, siap diedit: seret joint, ubah beban, atau centang sendi, lalu amati diagramnya ikut berubah. Latihan di bagian bawah menjadikan setiap model bahan kajian singkat, lengkap dengan jawaban untuk mencocokkan perhitungan manual Anda.

::feature-structures
::

Model yang sama ada di aplikasi di **☰ → Contoh**, dan [run.edubeam.app/?panel=examples&lang=id](https://run.edubeam.app/?panel=examples&lang=id){target="_blank"} langsung membuka galeri tersebut.

::callout{type="info" title="Satu tipe batang untuk keenam contoh"}
Semua contoh memakai batang baja yang sama: $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (sehingga $EI = 17\,548$ kNm²), luas penampang $1\ \text{m}^2$, dan kekakuan geser yang sangat besar sehingga deformasi aksial dan geser dapat diabaikan. Karena itu, rumus buku teks untuk balok langsing cocok dengan aplikasi sampai digit terakhir yang ditampilkan. Tinggi penampangnya $1$ m; nilai ini hanya berpengaruh pada beban suhu.
::

## Usulan latihan {#suggested-exercises}

Hitung jawabannya secara manual lebih dulu, lalu periksa di aplikasi: buka model dari kartunya di atas atau dengan **Buka di EduBeam** di bawah gambarnya. Membuka model akan mengganti model yang sedang Anda kerjakan; <kbd>Ctrl</kbd>+<kbd>Z</kbd> mengembalikannya, dan model itu juga tersimpan di **☰ → Struktur terbaru**.

### Balok statis tak tentu {#exercise-indeterminate-beam}

Balok sepanjang 3 m, terjepit di A dan bertumpu pada rol di B, dengan beban 10 kN/m.

::model-figure{caption="Jepit di A, rol di B, 10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Hitunglah reaksi dan momen di jepit secara manual, dengan metode gaya atau tabel momen ujung jepit.
2. Hapus centang `Ry` di A agar balok menjadi balok sederhana. Bagaimana perubahan momen terbesarnya?
3. Centang lagi `Ry` di A, dan juga di B, agar kedua ujung terjepit.

**Perhatikan** di mana diagram momen berganti tanda, dan bagaimana jepit memikul bagian beban yang lebih besar daripada rol.

::callout{type="details" title="Jawaban"}
- Jepit–rol: $R_A = 5qL/8 = 18{,}75$ kN, $R_B = 3qL/8 = 11{,}25$ kN, $M_A = qL^2/8 = 11{,}25$ kNm (momen negatif). Momen positif terbesar adalah $9qL^2/128 = 6{,}33$ kNm, pada jarak 1,125 m dari B, tempat gaya geser bernilai nol.
- Balok sederhana: $qL^2/8 = 11{,}25$ kNm di tengah bentang, sama dengan momen yang sebelumnya dipikul jepit.
- Jepit di kedua ujung: momen negatif $qL^2/12 = 7{,}5$ kNm di kedua ujung, momen positif $qL^2/24 = 3{,}75$ kNm di tengah bentang.
::

### Kantilever {#exercise-cantilever}

Kantilever sepanjang 4 m, terjepit di A, dengan beban 18 kN ke bawah di ujung bebas B.

::model-figure{caption="Kantilever, 18 kN di ujung bebas"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Hitunglah momen di jepit, lendutan ujung, dan rotasi ujung. Bandingkan dengan joint B di **Hasil → Hasil joint**.
2. Ubah $I_y$ menjadi setengahnya di tab **Penampang**. Apa yang berubah, dan apa yang tidak?
3. Ganti beban terpusat dengan beban merata 4,5 kN/m, yang totalnya sama, 18 kN: hapus beban joint di tab **Beban**, lalu **Tambah beban elemen**.

**Perhatikan** bentuk diagram momen: garis lurus akibat beban terpusat, parabola akibat beban merata.

::callout{type="details" title="Jawaban"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21{,}88$ mm, $\varphi_B = FL^2/(2EI) = 8{,}21$ mrad.
- Dengan $I_y$ setengahnya, lendutan menjadi dua kali lipat, 43,77 mm. Momen tetap 72 kNm: kantilever statis tertentu, sehingga gaya-gayanya tidak bergantung pada kekakuan.
- Beban merata: $M_A = qL^2/2 = 36$ kNm dan $w_B = qL^4/(8EI) = 8{,}21$ mm. Dengan beban total yang sama, momennya menjadi setengahnya dan lendutannya tiga perdelapannya.
::

### Rangka batang Warren {#exercise-pratt-truss}

Rangka batang sepanjang 9 m dan setinggi 1,8 m, dengan beban 8 kN pada setiap joint atas E, F, dan G. Centang **N(x)** di opsi tampilan untuk melihat gaya aksial. (Dengan diagonal yang berselang-seling dan tanpa batang vertikal, susunan ini disebut rangka batang Warren di sebagian besar buku teks.)

::model-figure{caption="Joint A sampai G, 8 kN di E, F, dan G"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. Hitunglah reaksi, lalu gaya pada diagonal ujung A–E dan batang bawah A–B dengan metode titik simpul.
2. Hitunglah gaya batang atas di panel tengah dan gaya batang bawah B–C dengan metode potongan.
3. Joint pada model ini kaku. Centang kedua sendi ujung pada setiap batang di tab **Elemen** agar menjadi rangka batang dengan sambungan sendi, lalu bandingkan gaya aksialnya.
4. Hapus diagonal B–F, pertama dengan joint kaku, lalu dengan sendi. Apakah rangka batang masih berdiri?

**Perhatikan** pola tandanya: batang atas tertekan, batang bawah tertarik, dan tanda gaya diagonal berselang-seling.

::callout{type="details" title="Jawaban"}
- Reaksi: 12 kN di A dan di D.
- Diagonal ujung: tekan 15,62 kN. Batang bawah A–B dan C–D: tarik 10,00 kN.
- Batang atas E–F dan F–G: tekan 13,33 kN (momen terhadap B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$). Batang bawah B–C: tarik 16,67 kN (momen terhadap F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$). Diagonal dalam: 5,21 kN; diagonal yang turun dari E dan G ke batang bawah tertarik, yang naik ke F tertekan.
- Joint kaku dan joint sendi memberikan gaya aksial yang sama dengan selisih kurang dari 0,1%. Lentur pada rangka batang yang tersusun dari segitiga dapat diabaikan; itulah sebabnya model dengan sambungan sendi dapat dipakai.
- Tanpa B–F, rangka batang dengan joint kaku tetap berdiri karena bekerja seperti portal, dengan momen lentur sekitar 3 kNm. Dengan sendi, rangka batang kekurangan satu batang: strukturnya menjadi mekanisme, dan EduBeam menunjukkan bagaimana struktur itu dapat bergerak.
::

### Balok menerus tiga bentang {#exercise-three-span-continuous-beam}

Balok sepanjang 16 m dengan bentang 5 + 6 + 5 m: 8 kN/m pada bentang pertama, 20 kN di C, dan 6 kN/m pada bentang terakhir. Saat dibuka, balok hanya ditumpu di A dan D.

::model-figure{caption="Saat dibuka: hanya ditumpu di A dan D"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Saat dibuka, model ini adalah satu balok sederhana sepanjang 16 m. Hitunglah reaksi dan momen di B dan C.
2. Centang `Dz` di B dan di C agar menjadi balok menerus di atas empat tumpuan.
3. Hitunglah momen di atas B dan C dengan persamaan tiga momen, lalu reaksinya.

**Perhatikan** momen negatif yang muncul di atas tumpuan dalam, seberapa jauh semua momen mengecil, dan apa yang terjadi dengan beban 20 kN setelah C menjadi tumpuan.

::callout{type="details" title="Jawaban"}
- Balok sederhana: $R_A = 44{,}69$ kN, $R_D = 45{,}31$ kN, $M_B = 123{,}4$ kNm dan $M_C = 151{,}6$ kNm, keduanya momen positif.
- Balok menerus, dengan $M_A = M_D = 0$:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  memberikan $M_B = -9{,}766$ kNm dan $M_C = -5{,}859$ kNm, momen negatif. Beban 20 kN di C langsung masuk ke tumpuan dan tidak menimbulkan lentur.
- Reaksi: A 18,05 kN, B 22,60 kN, C 35,52 kN (termasuk 20 kN), D 13,83 kN. Jumlahnya sama dengan beban total 90 kN.

::model-figure{caption="Balok menerus di atas empat tumpuan"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### Portal {#exercise-portal-frame}

Balok 8 m di atas dua kolom 6 m, terjepit di A dan bertumpu pada rol di D. Balok memikul 10 kN/m, dan sudut atas C menerima beban 8 kN ke kiri dan 10 kN ke bawah.

::model-figure{caption="Jepit di A, rol di D: 10 kN/m pada balok, 8 kN dan 10 kN di C"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Tentukan derajat ketidaktentuan statis portal ini.
2. Hapus centang `Ry` di A agar A menjadi sendi. Portal kini statis tertentu: hitunglah reaksi dan momen di sudut B dan C secara manual.
3. Centang lagi `Ry` di A, lalu centang `Dx` di D agar D menjadi sendi. Amati goyangan balok pada bentuk deformasi.

**Perhatikan** ke mana puncak portal bergerak. Pada model seperti saat dibuka, puncaknya bergerak ke kanan, melawan beban 8 kN. Mengapa?

::callout{type="details" title="Jawaban"}
- Empat reaksi (tiga di jepit, satu di rol) dan tiga persamaan keseimbangan: statis tak tentu berderajat satu. Jika D juga sendi, berderajat dua.
- Sendi di A: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN ke kanan. Momen sudut di B adalah $8 \cdot 6 = 48$ kNm. Di C momennya nol: karena tidak ada reaksi horizontal di D, kolom kanan hanya memikul gaya aksial 44 kN.
- Pada model seperti saat dibuka, puncaknya bergerak 9,5 mm ke kanan: momen dari balok yang dibebani melenturkan kolom terjepit lebih kuat daripada beban 8 kN. Jika D sendi, D menerima gaya horizontal 4,9 kN, dan puncaknya bergerak 4,8 mm ke kiri.
::

### Beban suhu {#exercise-temperature-load}

Balok sederhana sepanjang 8 m, dipanaskan $\Delta T_c = 20$ K pada sumbunya, dengan sisi bawah 10 K lebih dingin daripada sisi atas ($\Delta T_b - \Delta T_t = -10$ K).

::model-figure{caption="Balok sederhana 8 m, dipanaskan 20 K, sisi bawahnya 10 K lebih dingin daripada sisi atas"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. Sebelum melihat hasilnya: gaya dalam apa yang ditimbulkan oleh suhu, dan bagaimana balok bergerak?
2. Centang `Dx` di B untuk mencegah balok memanjang.
3. Centang juga `Ry` di kedua ujung.

**Perhatikan** bentuk deformasi dan angka di **Hasil → Hasil joint**: balok bergerak tanpa gaya dalam apa pun sampai Anda mengekangnya.

::callout{type="details" title="Jawaban"}
- Balok statis tertentu bebas memuai dan melentur, sehingga tidak ada gaya dalam. B bergeser keluar sejauh $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1{,}92$ mm. Sisi bawah yang lebih dingin memendek, sehingga balok melengkung ke atas dengan kelengkungan $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1{,}2 \cdot 10^{-4}$ 1/m: kedua ujung berotasi sebesar $\kappa L/2 = 0{,}48$ mrad dan tengah bentang naik $\kappa L^2/8 = 0{,}96$ mm.
- Dengan kedua ujung ditahan dalam arah x: $N = -EA\alpha\Delta T_c = -50\,400$ kN, tekan. Besarnya berasal dari luas penampang fiktif 1 m²; profil IPE 200 dengan luas 28,48 cm² akan memikul 143,5 kN.
- Dengan kedua ujung terjepit: momen konstan $EI\alpha(\Delta T_b - \Delta T_t)/h = 2{,}11$ kNm di sepanjang balok.
::

## Tutorial lengkap {#worked-tutorials}

Model yang lebih besar, disusun langkah demi langkah dan diperiksa secara manual:

::card-grid{cols="2"}
:::card{title="Balok miring" icon="lucide:move-diagonal" to="/id/tutorials/inclined-beam"}
Kasau dengan beban salju: beban per meter proyeksi horizontal, gaya normal dan gaya geser di sepanjang kemiringan, dan tumpuan rol yang diputar.
:::
:::card{title="Portal tiga sendi" icon="lucide:triangle" to="/id/tutorials/three-hinged-frame"}
Reaksi, N, V, dan M portal dengan sendi dalam.
:::
:::card{title="Rangka batang bidang" icon="lucide:git-fork" to="/id/tutorials/truss"}
Metode titik simpul, metode potongan, batang tanpa gaya, dan lendutan dengan kerja virtual.
:::
:::card{title="Balok menerus & penurunan tumpuan" icon="lucide:spline" to="/id/tutorials/continuous-beam"}
Balok dua bentang yang diselesaikan dengan metode gaya, lalu dengan tumpuan tengahnya turun 10 mm.
:::
::

Untuk pemeriksaan lain dengan rumus tertutup, lihat [Memeriksa hasil secara manual](/id/guide/verification).

## Soal lainnya {#more-problems}

[Latihan soal](/id/practice) memberi Anda balok, portal, atau rangka batang baru dengan angka baru setiap kali Anda memintanya, dan langsung memeriksa reaksi serta momen terbesar atau gaya batang terbesar Anda. Untuk keperluan kelas, [pembuat soal ujian](/id/exam) mencetak paket soal yang berbeda untuk setiap mahasiswa, lengkap dengan kunci jawaban, dan [@edubeam/plot](/id/guide/teaching#exercise-sheets-tests-and-slides-from-code) membuat lembar soal dari kode.

## Sumbangkan contoh {#contribute-an-example}

Punya model yang bagus untuk pengajaran? Bagikan tautannya di [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions), dan kami mungkin akan menambahkannya ke galeri.
