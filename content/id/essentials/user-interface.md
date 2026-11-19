---
description: "Peta antarmuka EduBeam: bilah aplikasi dan menu ☰, tampilan dengan tombol dan opsi tampilannya, memilih dan mengedit, tabel bilah bawah, dan cara mengetik nilai."
source: site
---

# Antarmuka pengguna

[EduBeam]{.edubeam} terdiri atas tiga area: **bilah aplikasi** di atas, **tampilan** di tengah tempat Anda menggambar, dan **bilah bawah** dengan tabel untuk setiap jenis objek. Semua yang dapat Anda kerjakan di tampilan juga dapat dikerjakan di tabel, dan sebaliknya.

![Bagian-bagian antarmuka, bernomor sesuai daftar di bawah](/screenshots/id/ui-overview.webp)

1. **Menu ☰**: buka, simpan, bagikan, dan ekspor; contoh dan tur terpandu.
2. **Hapus model** dan **Bagikan model**.
3. **Urungkan** dan **Ulangi**.
4. **Tombol tampilan**: pusatkan, sesuaikan dengan layar, dan opsi tampilan.
5. **Opsi tampilan**: hasil dan bagian model mana yang digambar.
6. **Grid, snap, crosshair, dan satuan.**
7. **Tab bilah bawah**: Joint, Elemen, Beban, Material, Penampang, Hasil.
8. **Tabel** dari tab yang terbuka, tempat setiap nilai dapat diedit.

::callout{type="tip" title="Ikuti tur"}
**☰ → Ajak saya berkeliling** menunjukkan bagian-bagian ini langsung di aplikasi, satu per satu.
::

## Bilah aplikasi {#app-bar}

- **☰** membuka menu utama, yang dijelaskan di bawah.
- **Hapus model** menghapus semua joint, elemen, dan beban setelah Anda mengonfirmasinya; centang **Hapus material** atau **Hapus penampang** jika material atau penampang juga ingin dihapus. <kbd>Ctrl</kbd>+<kbd>Z</kbd> mengembalikan model, dan model itu juga disimpan di *Struktur terbaru*.
- **Bagikan model** membuka [dialog berbagi](/id/essentials/import-export#share-a-link) dengan tautan yang memuat seluruh model.
- **Apa yang baru?** menampilkan catatan rilis. Catatan ini juga muncul sendiri satu kali setelah aplikasi diperbarui.
- **Dokumentasi** membuka panduan ini, dan ikon GitHub membuka kode sumbernya.

Di ponsel, hanya ☰ dan **Dokumentasi** yang muat; **Hapus model** dan **Bagikan model** ada di menu.

### Menu ☰ {#the-☰-menu}

![Menu ☰](/screenshots/id/ui-app-menu.webp){.shot-xs}

- **Buka proyek** dan **Simpan proyek** membuka atau mengunduh file `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>).
- **Struktur terbaru** menyimpan 10 model terakhir yang Anda hapus atau ganti, siap dipulihkan.
- **Ekspor gambar** menyimpan gambar sebagai PNG atau SVG, atau menyalinnya (<kbd>Ctrl</kbd>+<kbd>P</kbd>).
- **Contoh** adalah galeri model siap pakai; **Gambar balok pertama Anda** adalah tugas terpandu tujuh langkah; **Ajak saya berkeliling** adalah tur antarmuka.
- **Bagikan model** dan **Hapus model** sama dengan tombol di bilah aplikasi.

Bagian bawah menu menampilkan versi aplikasi dan tanggal rilisnya. Membuka, menyimpan, membagikan, dan mengekspor dibahas di [File, tautan & ekspor](/id/essentials/import-export).

## Tampilan {#viewer}

Kanvas tempat Anda menggambar dan memeriksa model. Hasil dihitung ulang setiap kali model berubah, jadi tidak ada tombol *Hitung*.

### Tombol di kanvas {#buttons-on-the-canvas}

**Kiri atas: Urungkan dan Ulangi** membatalkan atau mengulangi setiap perubahan pada model, langkah demi langkah: menambah, mengedit, menyeret, menghapus objek, hingga menghapus seluruh model (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>).

**Kanan atas:**

- **Pilih dengan kotak**, di perangkat berlayar sentuh: seretan jari berikutnya memilih area berbentuk persegi panjang.
- **Pusatkan model** menaruh model di tengah tanpa mengubah zoom (<kbd>C</kbd>); **Sesuaikan dengan layar** mengatur zoom agar seluruh model terlihat (<kbd>F</kbd>).
- **⚙** menampilkan atau menyembunyikan [opsi tampilan](#display-options).

**Kanan bawah:**

![Tombol grid, snap, crosshair, dan satuan](/screenshots/id/ui-grid-units.webp){.shot-sm}

- **G** menampilkan atau menyembunyikan grid dan penggaris (<kbd>G</kbd>); **S** mengaktifkan atau menonaktifkan snap ke grid (<kbd>S</kbd>).
- Tombol **crosshair** menandai posisi kursor pada penggaris, hanya jika Anda memakai mouse.
- **Label satuan** membuka pengaturan di bagian [Bahasa & Wilayah](/id/essentials/units-settings#language-locale).

### Opsi tampilan {#display-options}

Tombol ⚙ membuka dua baris kotak centang. Baris pertama memilih hasil yang digambar di atas model: *Bentuk deformasi*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)*, dan *Reaksi*; sejak awal bentuk deformasi, momen lentur, dan reaksi sudah aktif. Baris kedua menampilkan atau menyembunyikan bagian model: *Tumpuan*, *Beban*, *Label joint*, dan *Label elemen*, semuanya aktif sejak awal.

![Tombol tampilan dan opsi tampilan](/screenshots/id/ui-display-settings.webp){.shot-lg}

**Pengaturan lain** membuka [pengaturan tampilan](/id/essentials/units-settings#viewer-settings): ukuran, warna, dan cara diagram digambar. Arti setiap hasil dijelaskan di [Hasil & diagram](/id/essentials/results#overlays-in-the-viewer).

### Navigasi {#navigating}

| Aksi | Mouse dan keyboard | Sentuh |
| --- | --- | --- |
| Zoom | Roda mouse, ke arah kursor; di trackpad, renggangkan atau rapatkan dua jari, atau gulir dengan dua jari | Renggangkan atau rapatkan dua jari |
| Menggeser tampilan | Seret dengan tombol kanan atau dengan roda mouse yang ditekan; tombol mana yang dipakai dapat dipilih di [Kontrol & Pintasan](/id/essentials/units-settings#controls-shortcuts) | Seret dengan satu jari |
| Sesuaikan, pusatkan | <kbd>F</kbd>, <kbd>C</kbd>, atau tombol di kanan atas | Tombol di kanan atas |

<kbd>Ctrl</kbd>+<kbd>+</kbd> dan <kbd>Ctrl</kbd>+<kbd>-</kbd> memperbesar dan memperkecil gambar terhadap pusatnya, pada tata letak keyboard apa pun. Berbeda dengan zoom bawaan browser, keduanya tidak pernah mengubah ukuran seluruh antarmuka.

### Memilih dan mengedit {#selecting-and-editing}

| Untuk | Lakukan ini |
| --- | --- |
| Memilih satu objek | Klik joint, elemen, beban, atau garis dimensi. Sebuah panel terbuka di sampingnya dengan aksi yang tersedia: tambah beban, atur tumpuan, edit, tampilkan matriks kekakuan, hapus. Bilah bawah berpindah ke tab objek itu. |
| Memilih beberapa objek | Seret persegi panjang di kanvas yang kosong (di layar sentuh, tekan dulu **Pilih dengan kotak**). Kotak itu memilih semua joint di dalamnya dan semua elemen yang disentuhnya, beserta beban dan garis dimensinya. <kbd>Ctrl</kbd>+<kbd>A</kbd> memilih semuanya. |
| Menghapus, menyalin, menempel | <kbd>Delete</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>. Objek yang ditempel mengikuti kursor sampai Anda mengeklik, atau digeser sejauh Δx, Δz yang Anda ketik di banner. |
| Memindahkan joint | Seret joint itu. Jika snap aktif, joint menempel ke grid; elemen dan beban yang tersambung ikut berpindah. |
| Mengedit beban | Klik ganda beban itu. |
| Melihat detail | Arahkan kursor ke objek apa pun untuk melihat tooltip: perpindahan dan rotasi joint, material dan penampang elemen, nilai beban. Di layar sentuh, ketuk objeknya: panel menampilkan hal yang sama. |
| Membuka menu kanvas | Klik kanan pada kanvas, atau tekan lama di layar sentuh. |

::div{.shots}

![Panel joint: tambah beban, atur tumpuan, tetapkan perpindahan](/screenshots/id/ui-node-menu.webp)

![Mengarahkan kursor ke joint menampilkan perpindahan dan rotasinya](/screenshots/id/ui-hover.webp)

::

**Menu kanvas** menawarkan *Tambah joint*, *Tambah elemen*, *Tambah dimensi* (dan *Dimensi elemen* jika kursor berada di atas elemen), lalu *Edit*, *Salin*, *Tempel*, dan *Hapus* untuk objek yang sedang terpilih. Tahan <kbd>Ctrl</kbd> saat memilih *Tambah joint* atau *Tambah elemen* untuk menempatkannya dengan mouse, bukan lewat dialog.

![Menu kanvas](/screenshots/id/ui-canvas-menu.webp){.shot-sm}

Halaman [Keyboard, mouse & sentuh](/id/reference/shortcuts) mencantumkan semua pintasan dan gerakan.

### Saat model tidak dapat dihitung {#when-the-model-cannot-be-solved}

Pesan muncul di kiri atas tampilan:

| Pesan | Artinya |
| --- | --- |
| *Belum ada material yang didefinisikan*, *Belum ada penampang yang didefinisikan* | Tambahkan material atau penampang dengan tombol **Tambah baru** di sebelahnya. |
| Label biru **Perlu tumpuan** | Model sebenarnya hanya belum selesai: tumpuannya masih kurang. |
| Pesan merah, dengan **Tampilkan detail** | Ada yang salah. Detailnya mencantumkan setiap masalah, masing-masing dengan petunjuk. |
| Pesan kuning | Model sudah dihitung, tetapi ada yang tampak janggal, misalnya joint yang tidak tersambung ke elemen mana pun. |

Jika struktur masih dapat bergerak, EduBeam mengayunkan struktur itu sebagai garis putus-putus dan melingkari joint atau sendi penyebabnya. Arahkan kursor ke pesan untuk melihat gerakan itu lagi; tombol mata pada pesan menyembunyikannya.

![Portal dengan sendi di B dan C adalah mekanisme: EduBeam menunjukkan cara bergeraknya](/screenshots/id/ui-mechanism.webp)

[Pemecahan masalah](/id/reference/troubleshooting#messages) menjelaskan setiap pesan dan cara mengatasinya.

## Bilah bawah {#bottom-bar}

Enam tab, masing-masing dengan bilah alat dan tabel yang dapat diedit. Label tab menunjukkan jumlah objek di dalamnya. Seret deretan tab ke atas atau ke bawah untuk mengubah tinggi bilah, atau sembunyikan bilah dengan tombol di sebelah kanan. Tanda **?** di sebelahnya menjelaskan tab yang terbuka, begitu pula **?** di samping beberapa judul kolom.

| Tab | Bilah alat | Kolom tabel |
| --- | --- | --- |
| **Joint** | Tambah joint (dialog), Tambah joint (mouse) | Joint, Koordinat, **DOF yang ditahan** (simbol tumpuan, `Dx`, `Dz`, `Ry`, sudut α), Beban, Aksi |
| **Elemen** | Tambah elemen (dialog), Tambah elemen (mouse) | Elemen, Tipe, Joint (dengan **Tukar joint**), Material, Penampang, **Sendi ujung**, Beban, Aksi |
| **Beban** | Tambah beban joint, Tambah beban elemen | Tipe, Bekerja pada, Komponen, Aksi |
| **Material** | Tambah material, Pustaka material | Material, E, G, α<sub>T</sub>, Aksi |
| **Penampang** | Tambah penampang, Pustaka penampang, Penampang poligon | Bentuk, Penampang, Luas, I<sub>y</sub>, Tinggi, Koefisien geser, Aksi |
| **Hasil** | Hasil joint, Hasil elemen, Ekspor CSV, Salin | Perpindahan per joint, atau gaya ujung per elemen; lihat [tab Hasil](/id/essentials/results#results-tab) |

Setiap tab dibahas lebih rinci di [Joint & tumpuan](/id/essentials/nodes-supports), [Elemen, material & penampang](/id/essentials/elements), [Beban](/id/essentials/loads), dan [Hasil & diagram](/id/essentials/results#results-tab).

### Mengetik nilai {#typing-values}

Setiap kolom angka, di tabel maupun di dialog, bekerja dengan cara yang sama:

- Nilai dinyatakan dalam [satuan yang berlaku](/id/essentials/units-settings#units), yang tertera di judul kolom atau di belakang kolom isian.
- Titik maupun koma dapat dipakai sebagai pemisah desimal: `2.5` dan `2,5` sama saja.
- Anda dapat mengetik ekspresi aritmetika: `+ - * / ^` dan tanda kurung, sehingga `6/2`, `3*1.5`, `2^3`, atau `(4+2)/3` langsung dihitung, dan `1e-5` berarti $10^{-5}$.
- Di tabel, <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Tab</kbd>, atau klik di tempat lain menerapkan nilai. Setelah itu <kbd>Ctrl</kbd>+<kbd>Z</kbd> membatalkannya; selama Anda masih mengetik, <kbd>Ctrl</kbd>+<kbd>Z</kbd> hanya membatalkan ketikan.

## Tab di atas tampilan {#tabs-above-the-viewer}

**Tampilan** menampilkan kanvas. **Pengaturan** menampilkan [pengaturan](/id/essentials/units-settings) dalam ukuran penuh di tempat kanvas, sehingga Anda dapat mengubah warna atau satuan lalu kembali untuk melihat hasilnya. Label satuan dan *Pengaturan lain* membuka pengaturan yang sama sebagai dialog di atas model.

## Jendela mengambang {#floating-windows}

**Matriks kekakuan** (dari panel elemen atau tabel *Elemen*) membuka jendela berisi matriks kekakuan elemen berukuran 6 × 6 dalam sumbu global. **Edit** di menu kanvas membuka tabel berisi objek yang sedang terpilih. Pindahkan jendela dengan menyeret bilah judulnya, dan tutup dengan tombol ×.
