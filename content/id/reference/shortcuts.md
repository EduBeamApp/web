---
description: "Semua pintasan keyboard, aksi mouse, dan gerakan sentuh EduBeam: urungkan, simpan, buka, ekspor gambar, salin-tempel, sesuaikan layar, zoom, pilih, dan geser."
source: site
---

# Keyboard, mouse & sentuh

EduBeam dapat dipakai dengan keyboard dan mouse, trackpad, atau jari. Halaman ini mencantumkan semua pintasan dan gerakan. Di Mac, gunakan <kbd>Cmd</kbd> sebagai ganti <kbd>Ctrl</kbd>; menu aplikasi sendiri menampilkan ⌘ di tempat itu.

## Keyboard {#keyboard}

Pintasan gambar (<kbd>F</kbd>, <kbd>C</kbd>, <kbd>G</kbd>, <kbd>S</kbd>, <kbd>Delete</kbd>, serta <kbd>Ctrl</kbd>+<kbd>A</kbd>, <kbd>C</kbd>, <kbd>V</kbd>) tidak bekerja selama kolom teks sedang aktif, jadi mengetik `f` atau `s` di sebuah kolom tidak pernah memicunya. Klik dulu di area gambar.

### File dan riwayat {#files-and-history}

| Pintasan | Aksi |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> | Urungkan perubahan terakhir pada model |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | Ulangi |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Simpan proyek (mengunduh `project.json`) |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Buka proyek |
| <kbd>Ctrl</kbd>+<kbd>P</kbd> | Ekspor gambar |

Urungkan juga membatalkan penghapusan model, pembukaan file, tautan, atau contoh, dan pemulihan struktur terbaru. Selama Anda masih mengetik di sel tabel, <kbd>Ctrl</kbd>+<kbd>Z</kbd> membatalkan ketikan; setelah sel dikonfirmasi, pintasan ini mengurungkan perubahan pada model. Di kolom isian dialog, pintasan ini selalu membatalkan ketikan.

### Menggambar {#drawing}

| Pintasan | Aksi |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>A</kbd> | Pilih semua |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Salin joint, elemen, dan beban yang dipilih |
| <kbd>Ctrl</kbd>+<kbd>V</kbd> | Tempel. Bayangan salinan mengikuti kursor: klik untuk menempatkannya, atau ketik pergeseran Δx, Δz di banner dan tekan **Tempel** atau <kbd>Enter</kbd> |
| <kbd>Delete</kbd> | Hapus pilihan (di laptop Mac, <kbd>Fn</kbd>+<kbd>Delete</kbd>) |
| <kbd>Esc</kbd> | Keluar dari mode yang aktif (menambah joint, elemen, atau dimensi, menempel, memilih area untuk gambar) dan membatalkan pilihan; juga menutup menu ☰ dan mengakhiri tur |
| <kbd>F</kbd> | Sesuaikan dengan layar |
| <kbd>C</kbd> | Pusatkan model |
| <kbd>G</kbd> | Tampilkan/sembunyikan grid |
| <kbd>S</kbd> | Nyalakan/matikan snap ke grid |
| <kbd>Ctrl</kbd>+<kbd>+</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Perbesar / perkecil gambar terhadap titik tengahnya |

Di EduBeam, <kbd>Ctrl</kbd>+<kbd>+</kbd> dan <kbd>Ctrl</kbd>+<kbd>-</kbd> memperbesar dan memperkecil gambar, tidak pernah seluruh antarmuka seperti di situs lain. Keduanya bekerja dengan tata letak keyboard apa pun: tombol bertanda + dan −, di mana pun letaknya pada tata letak Anda, dua tombol di kiri <kbd>Backspace</kbd> pada keyboard AS, serta + dan − pada keypad numerik.

### Tabel dan dialog {#tables-and-dialogs}

| Pintasan | Aksi |
| --- | --- |
| <kbd>Enter</kbd> | Di sel tabel: konfirmasi nilai. Di kolom teks dialog: konfirmasi dialog, seperti tombol utamanya |
| <kbd>Esc</kbd> | Di sel tabel: keluar dari sel, nilainya tetap. Di dialog: tutup tanpa menyimpan |
| <kbd>Tab</kbd> | Pindah ke kolom berikutnya; sel tabel menyimpan apa yang Anda ketik |

Kolom angka menerima operasi aritmetika seperti yang Anda tulis saat menghitung: `6/2`, `3*1.5`, `2^3`, `(4+2)/3`, serta `1e3` atau koma desimal.

## Mouse {#mouse}

| Aksi | Hasil |
| --- | --- |
| Klik | Memilih joint, elemen, beban, atau garis dimensi dan membuka panelnya |
| Seret di kanvas kosong | Kotak pemilihan |
| Seret joint | Memindahkannya; joint menempel ke grid saat snap aktif |
| Klik dalam mode tambah | Menempatkan joint, atau memulai atau melanjutkan polyline elemen |
| Klik ganda beban | Mengedit beban (juga perpindahan yang ditetapkan) |
| Klik kanan | Menu kanvas: Tambah joint, Tambah elemen, Tambah dimensi, Dimensi elemen (di atas elemen), Edit, Salin, Tempel, Hapus |
| <kbd>Ctrl</kbd> + **Tambah joint** atau **Tambah elemen** di menu kanvas | Menempatkan dengan mouse alih-alih membuka dialog |
| Seret dengan tombol tengah atau kanan | Menggeser tampilan. Pilih tombolnya di **Pengaturan → Kontrol & Pintasan → Geser tampilan dengan** |
| Roda mouse | Zoom ke arah kursor |
| Arahkan kursor ke objek | Tooltip berisi perpindahan, properti, atau nilai beban |

Pada trackpad, merapatkan atau merenggangkan dua jari dan menggulir dengan dua jari sama-sama memperbesar atau memperkecil gambar. Untuk menggeser tampilan, klik dan seret dengan dua jari, yang sama dengan menyeret dengan tombol kanan.

## Sentuh {#touch}

| Gerakan | Hasil |
| --- | --- |
| Ketuk | Memilih objek dan menampilkan detail serta aksinya |
| Ketuk dalam mode tambah | Menempatkan joint atau melanjutkan elemen |
| Tekan joint lalu seret | Memindahkan joint |
| Seret satu jari di tempat lain | Menggeser tampilan |
| Rapatkan atau renggangkan dua jari | Zoom |
| Tekan lama di kanvas | Menu kanvas |
| Tombol **Pilih dengan kotak** (kanan atas), lalu seret | Kotak pemilihan; menu kanvas, dengan Salin dan Hapus, terbuka di tempat Anda mengangkat jari |

Selama Anda menambah joint, elemen, atau dimensi, menempel, atau memilih area untuk gambar, sebuah banner di bagian atas gambar menyebutkan mode yang aktif dan memiliki tombol **Batal**. Tanpa tombol <kbd>Esc</kbd>, itulah cara keluar dari mode tersebut di layar sentuh.

## Panel objek {#object-panels}

Mengeklik atau mengetuk objek membuka panel di sampingnya berisi detail dan aksi berikut:

| Objek | Aksi |
| --- | --- |
| Joint | Tambah beban · Tumpuan joint (simbol tumpuan, Dx, Dz, Ry) · Sudut LCS joint · Tetapkan perpindahan (pada joint bertumpuan) · Hapus |
| Elemen | Edit elemen (joint ujung dan sendi, material, penampang) · Tambah beban · Matriks kekakuan · Hapus |
| Beban joint atau beban elemen | Edit beban · Hapus |
| Garis dimensi | Edit · Balik dimensi · Hapus |

[Antarmuka pengguna](/id/essentials/user-interface) memperkenalkan bagian-bagian layar, dan [Kontrol & Pintasan](/id/essentials/units-settings#controls-shortcuts) di pengaturan menentukan tombol untuk menggeser tampilan.
