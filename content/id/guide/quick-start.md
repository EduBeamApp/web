---
description: "Modelkan balok baja sederhana di EduBeam dalam sepuluh menit: material, penampang, joint, tumpuan, dan beban, lalu baca hasilnya dan periksa secara manual."
source: site
---

# Mulai cepat

Dalam sekitar sepuluh menit Anda akan membuat model balok baja sederhana (balok di atas dua tumpuan), membaca reaksi, gaya geser, momen lentur, dan lendutannya, lalu memeriksa setiap angka secara manual. Buka EduBeam di tab kedua, atau di samping halaman ini, dan ikuti langkah-langkahnya.

::div{.actions}
[Buka EduBeam ↗](https://run.edubeam.app/?lang=id){target="_blank"} [Langsung ke pemeriksaan manual](#_8-check-by-hand)
::

## Soal {#the-problem}

Balok sepanjang 6 m bertumpu pada tumpuan sendi di joint 1 dan tumpuan rol di joint 2, dan memikul beban merata 12 kN/m di sepanjang bentangnya. Profilnya baja IPE 200: $E = 210$ GPa, $G = 81$ GPa, $A = 28{,}48\ \text{cm}^2$, dan $I_y = 1943\ \text{cm}^4$. Keempat nilai ini sudah ada di pustaka EduBeam, jadi tidak ada yang perlu dicari.

::model-figure{caption="Balok yang akan Anda modelkan: bentang 6 m dari joint 1 ke joint 2, dengan beban 12 kN/m"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: []
show: [nodeLabels, dimensions]
---
::

## Membuat model {#build-the-model}

::div{.steps}

### Mulai dari model kosong {#start-from-an-empty-model}

Pada kunjungan pertama, dialog sambutan menanyakan bagaimana Anda ingin memulai. Pilih **SI (metrik)** di **Sistem satuan**, biarkan **x ke kanan, z ke bawah** di **Sistem koordinat**, lalu tekan **Lewati dulu**. Aplikasi kemudian menampilkan contoh portal kecil.

1. Tekan **Hapus model** di bilah aplikasi (di ponsel, tombol ini ada di menu **☰**).
2. Centang **Hapus material** dan **Hapus penampang**, lalu tekan **Konfirmasi**.

Kanvas sekarang kosong, dan dua pesan merah memberi tahu bahwa belum ada material dan penampang. Langkah-langkah berikut mengatasinya. Tidak ada yang hilang: <kbd>Ctrl</kbd>+<kbd>Z</kbd> mengembalikan portal tadi, dan portal itu juga tersimpan di **☰ → Struktur terbaru**.

### Periksa satuan {#_1-check-the-units}

Label di kanan bawah tampilan mencantumkan satuan yang dipakai semua kolom isian dan hasil. Halaman ini memakai satuan SI, yang ditampilkan label sebagai `m m² kN kNm MPa`, dengan sumbu z mengarah ke bawah. Jika label menunjukkan feet dan kip, klik label itu dan atur **Sistem satuan** ke **SI (metrik)**. Di tempat yang sama, **Sistem koordinat** harus **x ke kanan, z ke bawah**: dengan sumbu y ke atas, beban positif mengarah ke atas, dan tanda-tanda di halaman ini tidak akan cocok.

![Tombol grid (G) dan snap (S), crosshair, dan label satuan](/screenshots/id/ui-grid-units.webp){.shot-sm}

### Tambahkan material dan penampang {#_2-add-the-material-and-cross-section}

Setiap elemen memerlukan material dan penampang, jadi tambahkan keduanya lebih dulu, langsung dari pustaka.

1. Buka tab **Material** di bilah bawah dan klik **Pustaka material**.
2. Tekan **+** pada baris **Baja (S235)** ($E = 210\,000$ MPa, $G = 81\,000$ MPa). Pustaka tetap terbuka untuk pilihan berikutnya, jadi tutup dengan **Batal**.
3. Buka tab **Penampang** dan klik **Pustaka penampang**.
4. Gulir ke baris **IPE 200 (perkiraan)**, tekan **+**, lalu tutup pustaka dengan **Batal**.

Kedua pesan merah hilang, dan tab **Penampang** mencantumkan IPE 200:

![IPE 200 di tab Penampang: luas, Iy, tinggi, dan koefisien geser](/screenshots/id/a-qs-cross-sections.webp)

Jika ingin mengetik nilai sendiri, gunakan **Tambah material** dan **Tambah penampang**. Koefisien geser, di sini 0,3933, akan muncul lagi dalam [pemeriksaan manual](#_8-check-by-hand).

### Tambahkan joint {#_3-add-the-nodes}

1. Buka tab **Joint**. Ada dua tombol **Tambah joint**: **+** membuka dialog, sedangkan tombol dengan ikon kursor menempatkan joint dengan mouse. Klik **+ Tambah joint**.
2. Biarkan **Koordinat X** dan **Koordinat Z** bernilai `0` dan tekan **Tambah joint**. Dialog tertutup, dan joint `1` muncul.
3. Klik **+ Tambah joint** lagi, masukkan `6` di **Koordinat X**, dan tekan **Tambah joint**. Inilah joint `2`.

![Dialog Tambah joint baru. Tumpuan juga dapat langsung diatur di sini.](/screenshots/id/qs-node.webp){.shot-md}

### Hubungkan dengan elemen {#_4-connect-them-with-an-element}

Buka tab **Elemen** dan klik **+ Tambah elemen**. Dialog sudah mengusulkan **Joint awal** `1`, **Joint akhir** `2`, serta material dan penampang Anda. Tekan **Tambah elemen**.

![Tambah elemen baru: kedua joint ujung, sendi opsional di setiap ujung, material, dan penampang](/screenshots/id/a-qs-element.webp){.shot-md}

Balok muncul di antara kedua joint. Tekan <kbd>F</kbd> untuk menyesuaikannya dengan layar. Label biru **Perlu tumpuan** di kiri atas tampilan menjelaskan mengapa belum ada hasil.

### Tambahkan tumpuan {#_5-add-the-supports}

Kembali ke tab **Joint**: setiap baris memiliki pemilih tumpuan di awal kolom **DOF yang ditahan**.

- Joint `1`: pilih **Sendi**; `Dx` dan `Dz` tercentang.
- Joint `2`: pilih **Rol**; hanya `Dz` yang tercentang.

![Pemilih tumpuan di tabel Joint](/screenshots/id/a-qs-support-picker.webp){.shot-lg}

Label **Perlu tumpuan** menghilang. Anda juga dapat mengklik joint di tampilan dan memilih **Tumpuan joint**. Semua tipe tumpuan tercantum di [Joint & tumpuan](/id/essentials/nodes-supports#supports).

### Tambahkan beban {#_6-add-the-load}

1. Buka tab **Beban** dan klik **Tambah beban elemen**.
2. Biarkan **Tipe beban** *Beban merata* dan **Elemen** `1`.
3. Masukkan `12` di **fz**, biarkan **fx** bernilai `0`, dan tekan **Tambah beban elemen**.

![Dialog menampilkan pratinjau beban pada elemen](/screenshots/id/a-qs-load.webp){.shot-md}

`fz` positif mengarah ke +z, yaitu **ke bawah**, jadi nilai positif adalah beban gravitasi. Kotak **LCS** (sistem koordinat lokal) yang tercentang berarti beban mengikuti sumbu elemen itu sendiri; untuk balok horizontal yang digambar dari kiri ke kanan, sumbu ini sama dengan sumbu global. Lihat [konvensi tanda](/id/elements/conventions#loads).

::

## Membaca hasil {#_7-read-the-results}

Balok langsung dihitung begitu beban dimasukkan, dan dihitung ulang setiap kali Anda mengubah sesuatu: tidak ada tombol *Hitung*. Panel di kanan atas tampilan mengatur gambar mana yang ditampilkan. **Bentuk deformasi**, **M<sub>y</sub>(x)**, dan **Reaksi** sudah aktif sejak awal. Centang **V<sub>z</sub>(x)** untuk menambahkan gaya geser.

![Opsi tampilan, dengan gaya geser dinyalakan](/screenshots/id/a-qs-display.webp){.shot-md}

Layar Anda sekarang seharusnya sama dengan gambar ini. Coba beralih antara momen lentur dan gaya geser:

::model-figure{caption="Balok yang sudah selesai: reaksi 36 kN dan momen 54 kNm di tengah bentang"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: [M, V]
show: [nodeLabels]
---
::

| Gambar | Yang perlu diperhatikan |
| --- | --- |
| **Reaksi** | Dua panah ke atas sebesar **36 kN**, satu di setiap tumpuan. |
| **V<sub>z</sub>(x)** | Garis lurus dari **+36 kN** di joint `1` hingga **−36 kN** di joint `2`, memotong nol di tengah bentang. |
| **M<sub>y</sub>(x)** | Parabola dengan puncak **54 kNm** di tengah bentang, digambar di sisi tarik, di bawah balok. |
| **Bentuk deformasi** | Lendutan simetris yang digambar diperbesar. |

Untuk angkanya, buka tab **Hasil**. **Hasil joint** mencantumkan perpindahan `Dx`, `Dz` dan rotasi `Ry` setiap joint, dan **Hasil elemen** mencantumkan gaya ujung setiap elemen dalam sumbu lokalnya. Joint `1` berotasi sebesar $R_y = -2{,}6469 \cdot 10^{-2}$ rad, dan joint `2` sebesar nilai yang sama ke arah sebaliknya. Semua tabel dan tanda dijelaskan di [Hasil & diagram](/id/essentials/results).

Jika diagram terlihat terlalu besar atau terlalu kecil, ubah **Skala hasil** di **Pengaturan → Pengaturan tampilan**.

## Memeriksa secara manual {#_8-check-by-hand}

Dengan $q = 12$ kN/m dan $L = 6$ m, rumus buku teks memberikan:

| Besaran | Rumus | Manual | EduBeam |
| --- | --- | --- | --- |
| Reaksi | $qL/2$ | 36 kN | 36 kN |
| Gaya geser terbesar | $qL/2$ | 36 kN | 36 kN |
| Momen terbesar | $qL^2/8$ | 54 kNm | 54 kNm |
| Rotasi ujung | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Lendutan tengah bentang | $w_b + w_s$ | 49,63 + 0,60 = 50,22 mm | 50,22 mm |

Lendutan terdiri atas dua bagian, dan kebanyakan buku teks hanya memberikan yang pertama:

- **Lentur:** $w_b = 5qL^4/(384EI) = 49{,}63$ mm, dengan $EI = 4080$ kNm² dari $E = 210$ GPa dan $I_y = 1943\ \text{cm}^4$.
- **Geser:** $w_s = qL^2/(8kGA) = 0{,}60$ mm, dengan $kGA \approx 90\,700$ kN dari $k = 0{,}3933$, $G = 81$ GPa, dan $A = 28{,}48\ \text{cm}^2$.

Belum ada joint di tengah bentang, jadi tambahkan satu untuk membaca lendutan di sana:

1. Di tab **Joint**, klik tombol **Tambah joint** yang kedua, yang berikon kursor.
2. Klik balok di `x = 3`; dengan snap aktif, joint jatuh tepat di grid. EduBeam menanyakan apa yang harus dilakukan dengan joint itu: tekan **Sambungkan ke struktur**. Elemen terbagi menjadi `1a` dan `1b` beserta bebannya, dan mode penempatan joint berhenti. Jika joint `3` di tab **Joint** tidak berada di X = `3`, ketik `3` di sana.
3. Di **Hasil → Hasil joint**, joint `3` sekarang menunjukkan $D_z = 5{,}0224 \cdot 10^{-2}$ m, yaitu 50,22 mm.

![Hasil joint setelah pembagian: joint 3 turun 50,22 mm](/screenshots/id/a-qs-nodal-results.webp){.shot-lg}

Membagi balok tidak mengubah hasil apa pun, karena elemennya eksak untuk beban ini: tidak ada jaring elemen yang perlu diperhalus.

::callout{type="details" title="Mengapa koefisien geser berpengaruh"}
EduBeam memakai elemen balok Timoshenko, yang memperhitungkan deformasi geser. Koefisien geser $k$ menskalakan luas yang memikul geser, sehingga $kGA$ adalah kekakuan geser. Untuk profil I dari pustaka, $k$ adalah porsi luas badan terhadap luas total, $h t_w / A$: untuk IPE 200, $0{,}2 \cdot 0{,}0056 / 0{,}002848 = 0{,}3933$. Bagian geser dari lendutan, $w_s = qL^2/(8kGA)$, adalah integral $V/(kGA)$ dari tumpuan sampai tengah bentang.

Untuk balok langsing ini, bagian geser bernilai 0,60 mm, sekitar 1% dari total. Pada balok yang pendek dan tinggi, bagian ini jauh lebih besar. Isi koefisien geser dengan angka yang sangat besar (misalnya `1e10`) di tab **Penampang**, dan EduBeam memberikan lendutan lentur saja, 49,63 mm. Teorinya ada di [halaman elemen balok](/id/elements/beam).
::

Contoh pemeriksaan manual lainnya (kantilever, balok jepit–jepit, rangka batang, beban suhu, penurunan tumpuan) ada di [Memeriksa hasil secara manual](/id/guide/verification).

## Bereksperimen {#_9-experiment}

Ubah model dan amati bagaimana diagram ikut berubah. Coba setiap perubahan secara terpisah, dan urungkan dengan <kbd>Ctrl</kbd>+<kbd>Z</kbd> sebelum mencoba yang berikutnya. Joint `3` adalah joint tengah bentang yang baru saja Anda tambahkan.

- **Seret joint `2`** ke kanan. Momen bertambah sebanding dengan $L^2$ dan lendutan dengan $L^4$.
- **Centang `Ry` di joint `1`** untuk menjepit ujung itu. Momen negatif muncul di tumpuan jepit: $qL^2/8 = 54$ kNm menurut rumus buku teks, 53,8 kNm di EduBeam. Pada balok statis tak tentu, kekakuan geser juga memengaruhi gaya dalam.
- **Centang `Dz` di joint `3`** untuk menambah tumpuan tengah dan membuat balok menerus dua bentang. Momen di atas tumpuan tengah menjadi negatif: $q(L/2)^2/8 = 13{,}5$ kNm secara manual, 13,3 kNm di EduBeam, karena alasan yang sama.
- **Centang `Dz` di joint `3`, serta kotak kedua di kolom *Sendi ujung* elemen `1a`** (ujungnya di joint `3`) di tab **Elemen**. Balok berubah menjadi dua balok sederhana dengan bentang 3 m. Sekarang hapus centang `Dz` di joint `3`: balok menjadi mekanisme, dan EduBeam menunjukkan bagaimana balok itu dapat bergerak.

Untuk mencoba berbagai bentang dan beban tanpa membuat model, geser slider di bawah, lalu beralih di antara hasil untuk melihat bagaimana setiap besaran bertambah seiring panjang bentang.

::example-structure
::

## Simpan atau bagikan {#_10-save-or-share}

- **Kirim ke orang lain.** Tekan **Bagikan model** di bilah aplikasi, lalu **Salin**. Tautan memuat seluruh model, dan siapa pun yang membukanya mendapat salinan sendiri untuk diedit.
- **Simpan sebagai file.** **☰ → Simpan proyek** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) mengunduh `project.json`. Buka lagi dengan **☰ → Buka proyek** (<kbd>Ctrl</kbd>+<kbd>O</kbd>) atau dengan menyeret file itu ke jendela aplikasi.
- **Masukkan gambar ke laporan.** **☰ → Ekspor gambar** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) menyimpannya sebagai PNG atau SVG.

Model juga tersimpan di browser Anda, jadi memuat ulang halaman tidak menghilangkannya. Rinciannya ada di [File, tautan & ekspor](/id/essentials/import-export).

## Langkah selanjutnya {#where-next}

::card-grid{cols="2"}
:::card{title="Tutorial" icon="lucide:graduation-cap" to="/id/tutorials/inclined-beam"}
Empat model yang dibuat langkah demi langkah dan diperiksa secara manual, dari balok miring hingga balok menerus dengan penurunan tumpuan.
:::
:::card{title="Contoh" icon="lucide:library" to="/id/examples/"}
Balok, portal, dan rangka batang siap pakai yang terbuka dengan satu klik, lengkap dengan latihan dan jawabannya.
:::
:::card{title="Beban" icon="lucide:arrow-down-to-line" to="/id/essentials/loads"}
Beban trapesium, terpusat, dan suhu, gaya joint, serta penurunan tumpuan.
:::
:::card{title="Keyboard, mouse & sentuh" icon="lucide:keyboard" to="/id/reference/shortcuts"}
Gambar joint dan elemen langsung di kanvas, dan edit lebih cepat.
:::
::
