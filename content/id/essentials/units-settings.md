---
description: "Pengaturan EduBeam: bahasa, satuan SI atau AS, format angka, sumbu z ke bawah atau y ke atas, grid, gaya dan warna diagram, tombol geser, dan data di browser."
source: site
---

# Satuan & pengaturan

Pilih bahasa, satuan, dan sumbu yang Anda pakai, serta tampilan gambarnya. Pengaturan hanya mengubah cara model ditampilkan dan diketik: model itu sendiri selalu disimpan dalam satuan SI dengan sumbu z mengarah ke bawah, sehingga proyek atau tautan selalu terbuka sama persis, apa pun pengaturannya.

Ada tiga cara membuka pengaturan:

- tab **Pengaturan** di atas tampilan menampilkannya dalam ukuran penuh di tempat model, dimulai dari bagian *Bahasa & Wilayah*; tab **Tampilan** membawa Anda kembali;
- **label satuan** di kanan bawah tampilan (`m m² kN kNm MPa`) membukanya sebagai dialog di bagian *Bahasa & Wilayah*;
- **Pengaturan lain** di bawah [opsi tampilan](/id/essentials/user-interface#display-options) membuka dialog di bagian *Pengaturan tampilan*.

Pengaturan disimpan di browser Anda dan tetap ada setelah halaman dimuat ulang. **Reset pengaturan**, di bawah daftar halaman pengaturan, mengembalikan semua nilai bawaan: format angka, sumbu, tombol geser, satuan untuk wilayah Anda, serta semua pengaturan tampilan dan opsi tampilan. Bahasa tidak ikut direset. Reset tidak dapat diurungkan.

## Bahasa & Wilayah {#language-locale}

![Pengaturan → Bahasa & Wilayah](/screenshots/id/settings-language.webp)

**Bahasa.** 22 bahasa; pada kunjungan pertama, EduBeam mengikuti bahasa browser Anda. Pemisah desimal mengikuti bahasa. Sebuah tautan dapat memilihkan bahasa untuk pembacanya: tambahkan `?lang=` dengan salah satu kode `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (Tionghoa), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`.

**Format angka.** Cara nilai hasil ditulis di tabel dan tooltip: *Ilmiah* (1,5 · 10⁴, bawaan), *Teknik* (15 · 10³), atau *Otomatis*. Lihat [Format angka](/id/essentials/results#number-format).

**Sistem koordinat.** *x ke kanan, z ke bawah* (bawaan) atau *x ke kanan, y ke atas*. Dengan *x ke kanan, y ke atas*, sumbu vertikal disebut y dan mengarah ke atas, dan momen bekerja terhadap sumbu z. Koordinat vertikal, gaya, perpindahan, reaksi, dan sudut tumpuan berganti tanda, dan setiap kolom isian, tabel, tooltip, dan ekspor memakai nama yang baru. Model, gambar, dan file yang disimpan tetap sama persis. Lihat [Sumbu y ke atas](/id/elements/conventions#y-up-axes).

![Portal tiga sendi dengan sumbu y ke atas: indikator sumbu di sudut menunjukkan y ke atas](/screenshots/id/settings-y-up.webp){.shot-lg}

**Sistem satuan.** *SI (metrik)* atau *US customary (imperial)* mengatur semua satuan sekaligus. Pada kunjungan pertama, Anda memilihnya di dialog sambutan. EduBeam menyarankan satuan AS hanya jika browser memakai pengaturan wilayah AS *dan* komputer berada di zona waktu AS; di tempat lain EduBeam menyarankan SI. Jika sesudahnya Anda mengubah salah satu satuan, sistemnya ditampilkan sebagai *Kustom*.

### Satuan {#units}

Setiap besaran memiliki satuannya sendiri. Kolom isian (yang menampilkan satuannya di ujungnya), tabel, tooltip, dan label diagram semuanya memakai satuan itu, dan mengubah satuan mengonversi nilai yang ditampilkan. Tidak ada yang berubah di dalam model, jadi berganti satuan bolak-balik tidak menghilangkan apa pun.

| Besaran | Pilihan | SI | US customary |
| --- | --- | --- | --- |
| Panjang (geometri, posisi beban) | m, cm, mm, ft, in | m | ft |
| Dimensi penampang | m, cm, mm, ft, in | m | in |
| Perpindahan (hasil, penurunan tumpuan yang ditetapkan) | m, cm, mm, ft, in | m | in |
| Luas | m², cm², mm², ft², in² | m² | in² |
| Momen inersia | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Massa | kg, lb | kg | lb |
| Gaya | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Momen lentur | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Tekanan (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Suhu | °C, °F | °C | °F |

Beberapa satuan diturunkan dari satuan lain:

- **Beban garis** adalah gaya per panjang: kN/m dalam SI, kip/ft dalam satuan AS.
- **Massa jenis** adalah massa per panjang³: kg/m³ atau lb/ft³.
- **Koefisien muai panas** mengikuti satuan suhu: 1/K atau 1/°F. Beban suhu adalah *perubahan* suhu, jadi perubahan 10 °C sama dengan 18 °F.
- **Rotasi** selalu dalam radian, dan sudut tumpuan dalam derajat.

Tonf adalah ton-gaya metrik (1000 kgf), bukan short ton AS. Satuan AS memakai definisi eksaknya: 1 ft = 0,3048 m, 1 kip = 4448,2216 N. Ketik feet sebagai bilangan desimal, misalnya `5.5`; penggaris dan crosshair menampilkan feet dan inci (5′-6″).

## Pengaturan tampilan {#viewer-settings}

Bagian ini mengatur tampilan gambar. **Pratinjau tampilan** di kanan berupa balok miring kecil yang langsung menunjukkan setiap perubahan; tombol di bawahnya memilih hasil yang ditampilkan, dan mengubah pengaturan diagram atau warna memindahkan pratinjau ke hasil yang bersangkutan.

![Pengaturan → Pengaturan tampilan, dengan pratinjau langsung dan pengaturan diagram di kanan](/screenshots/id/b-settings-viewer.webp)

Kolom kiri, dari atas:

- *Grid*: **Tampilkan grid** (<kbd>G</kbd>) menggambar grid dan penggaris; **Snap ke grid** (<kbd>S</kbd>) membuat joint yang Anda tempatkan atau seret menempel ke grid; **Tampilkan crosshair** menandai posisi kursor pada penggaris, jika Anda memakai mouse. Ketiganya aktif sejak awal. **Jarak snap grid** bernilai 0,1 m, atau 0,5 ft dalam satuan AS. Saat Anda beralih antara satuan metrik dan AS, jarak yang masih bernilai bawaan berpindah ke nilai bawaan sistem lain; jarak yang Anda atur sendiri tetap dipertahankan.
- *Ukuran*: **Skala hasil**, 8 sampai 120 px (pada awalnya 48 px), adalah tinggi gambar ordinat terbesar sebuah diagram, atau lendutan terbesar; pengaturan ini murni visual, karena setiap diagram diskalakan terhadap nilai terbesarnya sendiri. **Ukuran tumpuan** berkisar 50–150% (awalnya 100%), dan **Ukuran huruf** 10–20 px (awalnya 14 px); ukuran yang lebih besar membantu di proyektor.
- *Orientasi label hasil*: *Tegak lurus diagram* (bawaan), yaitu nilai ditulis searah ordinat, atau *Selalu horizontal*.
- *Pemeriksaan model*: **Tunjukkan bagaimana struktur tidak stabil dapat bergerak** menggambar garis putus-putus mekanismenya, dan **Animasikan gerakannya** mengayunkannya bolak-balik. Keduanya aktif sejak awal.

### Diagram gaya dalam {#internal-force-diagrams}

Cara menggambar diagram berbeda dari satu perguruan tinggi ke perguruan tinggi lain, jadi EduBeam memberi Anda pilihan. Pengaturan ini hanya mengubah gambar, tidak pernah mengubah nilai. **Garis putus-putus** di sepanjang setiap elemen menandai serat bawahnya, yaitu sisi yang ditunjuk sumbu z lokalnya (lihat [Arah elemen](/id/essentials/elements#element-direction)).

| Pengaturan | Pilihan | Bawaan |
| --- | --- | --- |
| **Momen lentur** | digambar di *Sisi tarik* atau di *Sisi tekan* | *Sisi tarik* |
| **Gaya geser positif** | digambar di *Sisi berlawanan* dari garis putus-putus, atau di *Sisi putus-putus* | *Sisi berlawanan* |
| **Gaya normal positif** | *Sisi berlawanan* atau *Sisi putus-putus* | *Sisi berlawanan* |
| **Isian** | *Penuh*, *Arsir* (garis-garis melintang batang, seperti digambar dengan tangan), atau *Tanpa* | *Penuh* |
| **Derajat tiap segmen** | menuliskan derajat polinomial, 0° sampai 3°, pada setiap segmen diagram | nonaktif |

[Hasil & diagram](/id/essentials/results#reading-the-sign) menjelaskan cara membaca tandanya.

### Warna {#colors}

Warna tersendiri untuk joint, elemen, beban, bentuk deformasi, gaya normal, gaya geser, momen lentur, dan reaksi. Klik kotak warna untuk memilih warna. Warna bawaan: beban oranye, bentuk deformasi abu-abu, N biru, V hijau, M merah, reaksi ungu, joint dan elemen hitam.

## Kontrol & Pintasan {#controls-shortcuts}

**Geser tampilan dengan** mengatur tombol mouse yang menggeser kanvas: *Roda mouse atau tombol kanan* (bawaan), *Roda mouse* (tekan roda lalu seret), atau *Tombol kanan*. Semua pintasan ada di halaman [Keyboard, mouse & sentuh](/id/reference/shortcuts).

## Yang disimpan di browser Anda {#what-is-stored-in-your-browser}

Selain pengaturan, EduBeam menyimpan hal berikut di penyimpanan browser:

- **model saat ini**, disimpan setelah setiap perubahan, sehingga memuat ulang tab atau membuka kembali aplikasi akan memulihkannya;
- **Struktur terbaru**: 10 model terakhir yang Anda hapus atau ganti, siap dipulihkan dari menu ☰.

Keduanya hanya ada di browser ini pada perangkat ini, dan menghapus data situs akan menghapus keduanya. Untuk menyimpan model atau memindahkannya ke perangkat lain, gunakan [Simpan proyek atau Bagikan model](/id/essentials/import-export).
