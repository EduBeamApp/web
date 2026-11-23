---
description: "Menyimpan dan membuka proyek EduBeam dan sesi versi desktop, membagikan model lewat tautan, menyematkan penampil, parameter URL, serta ekspor gambar dan hasil."
source: site
---

# File, tautan & ekspor

:span{#impor-ekspor-berbagi}

Simpan model Anda sebagai file, kirim sebagai tautan, sematkan di halaman web, atau ekspor sebagai gambar atau tabel. Semua yang ada di [EduBeam]{.edubeam} terjadi di browser Anda dan tidak ada yang diunggah: tautan berbagi benar-benar memuat modelnya.

::card-grid{cols="3"}
:::card{title="File proyek" icon="lucide:file-json" to="#save-a-project"}
`project.json` untuk disimpan, dikumpulkan sebagai tugas, atau dibuka nanti.
:::
:::card{title="Tautan berbagi" icon="lucide:link" to="#share-a-link"}
Seluruh model dalam satu URL, untuk catatan kuliah, slide, dan pesan.
:::
:::card{title="Gambar atau tabel" icon="lucide:image" to="#export-an-image"}
PNG atau SVG untuk laporan, CSV untuk spreadsheet.
:::
::

## Menyimpan proyek {#save-a-project}

**☰ → Simpan proyek** atau <kbd>Ctrl</kbd>+<kbd>S</kbd> (<kbd>⌘</kbd>+<kbd>S</kbd> di Mac, seperti semua pintasan di halaman ini) mengunduh `project.json`. File ini berisi joint, elemen, material, penampang (beserta bentuk yang digambar), beban, garis dimensi, dan versi aplikasi yang menulisnya. Nama file boleh Anda ganti sesuka hati.

## Membuka proyek {#open-a-project}

**☰ → Buka proyek** atau <kbd>Ctrl</kbd>+<kbd>O</kbd>, lalu pilih file, atau **seret file dan lepaskan di mana saja pada jendela aplikasi**. EduBeam dapat membuka:

- file `project.json` yang disimpan oleh semua versi EduBeam;
- sesi `.xml` yang disimpan oleh **EduBeam versi desktop** 2.x sampai 3.5. Nilai di dalamnya tidak bersatuan, sehingga dibaca sebagai kN, kPa, dan m, satuan yang dipakai dalam manual program itu. EduBeam hanya membuka satu kasus beban: dari sesi dengan beberapa kasus beban, EduBeam membuka yang pertama dan menyebutkan nama kasus beban yang dilewati.

Membuka proyek menggantikan model saat ini, termasuk material dan penampangnya. Model yang tadinya terbuka tidak hilang: <kbd>Ctrl</kbd>+<kbd>Z</kbd> mengembalikannya, dan model itu disimpan di [Struktur terbaru](#recent-structures). File yang tidak dapat dibaca EduBeam ditolak dengan pesan, dan model Anda tetap seperti semula.

## Membagikan tautan {#share-a-link}

**Bagikan model**, di bilah aplikasi atau di menu ☰, membuka dialog *Bagikan model lewat URL*:

![Dialog Bagikan model lewat URL](/screenshots/id/c1-share.webp){.shot-lg}

- **Salin**, atau klik di mana saja di dalam kolom, menyalin tautan.
- **Buka tautan** membukanya di tab baru, sehingga Anda melihat apa yang akan dilihat penerima.
- **Bagikan lewat dialog sistem** meneruskan tautan ke menu berbagi perangkat Anda, jika browser mendukungnya.
- **Tautan lebih pendek** (aktif secara bawaan) menuliskan model yang sama dengan sekitar setengah jumlah karakter. Versi EduBeam yang lebih lama dari 1.3.2 (November 2026) tidak dapat membacanya sebelum diperbarui, jadi nonaktifkan opsi ini jika tautan harus langsung terbuka di mana saja.
- **Tampilkan yang saya lihat** (nonaktif secara bawaan) membuat tautan terbuka dengan diagram, beban, dan label yang Anda aktifkan, bukan dengan opsi tampilan milik penerima.

Tautan berbentuk `https://run.edubeam.app/?model=…` dan menyandikan seluruh model. Siapa pun yang membukanya mendapat salinan sendiri untuk diedit; perubahannya **tidak** disinkronkan kembali, jadi kirim tautan baru jika model berubah. Model yang sangat besar menghasilkan tautan yang sangat panjang; untuk model seperti itu, bagikan file proyeknya.

Saat seseorang membuka tautan, model yang sedang terbuka di aplikasinya dipindahkan ke Struktur terbaru, dan sebuah pesan memberi tahu di mana model itu dapat ditemukan. Tautan tidak pernah kedaluwarsa: tautan di catatan kuliah tahun lalu membuka model yang sama hari ini.

## Menyematkan penampil {#embed-a-read-only-viewer}

Tambahkan `&viewer=1` ke tautan berbagi untuk membuka model dalam **mode penampil**: bilah aplikasi, bilah bawah, urungkan dan ulangi, label grid dan satuan, serta crosshair disembunyikan, sehingga yang tersisa hanya gambar, tombol sesuaikan dan pusatkan, serta opsi tampilan. Dialog sambutan dan catatan rilis juga tidak terbuka. Masukkan URL itu ke dalam `<iframe>` untuk menyematkan model interaktif yang dapat diperbesar di catatan kuliah, halaman mata kuliah, atau slide:

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![Portal tiga sendi dalam mode penampil](/screenshots/id/viewer-mode.webp){.shot-lg}

Mode penampil ditujukan untuk melihat, tetapi tidak dikunci: pengunjung tetap dapat menyeret joint dan mengganti diagram. Jika dibuka langsung (tidak disematkan), tautan penampil menggantikan model pengunjung seperti tautan lainnya, dan model pengunjung itu tetap tersimpan di Struktur terbaru. Jika disematkan di halaman situs lain, sebagian besar browser saat ini memberi bingkai itu penyimpanan tersendiri, sehingga model pengunjung tidak tersentuh, tetapi tidak semua browser melakukannya.

Untuk gambar yang sama sekali tidak memerlukan aplikasi, misalnya diagram statis di halaman web, slide, atau lembar soal, [@edubeam/plot](/id/plot) menggambar struktur beserta diagramnya dari kode. Gambar interaktif di situs ini dibuat dengan pustaka itu.

## Parameter URL {#url-parameters}

| Parameter | Efek |
| --- | --- |
| `model=<data>` | Memuat model yang disandikan dan menyesuaikannya dengan layar. Ditulis oleh **Bagikan model**. |
| `viewer=1` | [Mode penampil](#embed-a-read-only-viewer). |
| `show=<letters>` | Membuka aplikasi dengan hanya lapisan-lapisan ini yang aktif, masing-masing ditandai satu huruf: `N` gaya normal, `V` gaya geser, `M` momen lentur, `U` bentuk deformasi, `R` reaksi, `L` beban, `S` tumpuan, `n` label joint, `e` label elemen. `show=MRLS` menampilkan momen lentur, reaksi, beban, dan tumpuan. Ditulis oleh **Tampilkan yang saya lihat**. |
| `lang=<code>` | Mengganti bahasa antarmuka: `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (Tionghoa), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Langsung membuka galeri contoh. |

Parameter digabungkan dengan `&`, misalnya `?lang=id&viewer=1&model=…`. Setelah membacanya, EduBeam menghapus parameter dari bilah alamat. `lang` dan `show` disimpan sebagai pengaturan pengunjung, seolah-olah ia memilihnya sendiri di aplikasi.

## Mengekspor gambar {#export-an-image}

**☰ → Ekspor gambar** atau <kbd>Ctrl</kbd>+<kbd>P</kbd> membuka ekspor gambar. Gambar disusun ulang untuk ukuran yang Anda pilih, sehingga garis dan label tetap memiliki ketebalan sebenarnya.

![Ekspor gambar: pilih lapisan, bingkai, dan ukuran, lalu unduh atau salin](/screenshots/id/export-image.webp)

::div{.steps}

### Pilih lapisan {#choose-the-layers}

Label di bagian atas memilih apa yang digambar: bentuk deformasi, N, V, M, dan reaksi, lalu tumpuan, beban, label joint, dan label elemen. Pada awalnya pilihan ini sama dengan opsi tampilan, dan mengubahnya di sini tidak mengubah tampilan.

### Atur bingkai gambar {#frame-the-drawing}

Pilih rasio aspek (16:9, 4:3, 3:2, atau 1:1), **Semua**, atau **Jendela…** untuk menyeret persegi panjang di atas gambar. Anda juga dapat menyeret tepi pratinjau.

### Atur ukuran {#set-the-size}

Lebar dan tinggi dalam piksel, atau **Skala** seperti 1 : 50 untuk gambar berskala di kertas (pada 96 DPI). **Tinggi diagram** mengatur ukuran diagram hasil, dan **Latar belakang transparan** menghilangkan latar putih. Jika diagram atau label tidak muat, dialog memberi tahu Anda dan menawarkan untuk memperkecil diagram atau memperbesar kanvas.

### Simpan gambar {#save-it}

**Unduh PNG**, **Unduh SVG**, atau, jika browser mengizinkan, **Salin ke clipboard**. Nama file mengikuti ukurannya, misalnya `edubeam-512x512.svg`. Pada layar beresolusi tinggi, PNG memiliki lebih banyak piksel daripada lebar dan tinggi yang Anda atur, sebanding dengan kepadatan piksel layar, agar sama tajamnya dengan aplikasi; ukurannya dalam piksel ditampilkan di samping tombol.

::

SVG tetap tajam pada ukuran berapa pun dan dapat dipakai di Word, Inkscape, dan LaTeX di Overleaf, sehingga menjadi pilihan terbaik untuk laporan dan skripsi. Ukuran yang sama selalu membingkai struktur dengan cara yang sama, sehingga N, V, dan M yang diekspor berturut-turut dapat dijajarkan berdampingan.

Untuk membuat gambar seperti itu dari kode, misalnya satu gambar untuk setiap soal di lembar soal, @edubeam/plot menulis [file SVG mandiri](/id/plot/functions#a-standalone-svg-file) yang dapat dibuka di program yang sama.

## Mengekspor hasil {#export-the-results}

**Ekspor CSV** di tab **Hasil** mengunduh kedua tabel hasil, termasuk reaksi, dan **Salin** menaruhnya di clipboard untuk spreadsheet. Lihat [Ekspor CSV dan Salin](/id/essentials/results#export-csv-and-copy).

## Struktur terbaru {#recent-structures}

**☰ → Struktur terbaru** menyimpan 10 struktur terakhir yang dihapus, atau yang digantikan oleh tautan, file, contoh, tugas balok pertama, atau pemulihan lain. Setiap struktur menampilkan gambar mini, apa yang menggantikannya, serta jumlah joint dan elemennya. **Pulihkan** mengembalikan salah satunya: model yang sedang terbuka gantian masuk ke daftar, dan <kbd>Ctrl</kbd>+<kbd>Z</kbd> membatalkan pemulihan. **Hapus** menghapus sebuah entri.

![Struktur terbaru](/screenshots/id/recent.webp){.shot-lg}

Daftar ini hanya disimpan di browser ini.

## Contoh {#examples}

**☰ → Contoh** membuka galeri model pengajaran siap pakai. Membuka salah satunya menggantikan model Anda, dan <kbd>Ctrl</kbd>+<kbd>Z</kbd> mengembalikan model Anda. Model yang sama, beserta latihannya, ada di halaman [Contoh](/id/examples/) dalam panduan ini.

![Galeri contoh](/screenshots/id/examples.webp){.shot-lg}

## Penyimpanan otomatis {#automatic-persistence}

Model dan pengaturan Anda disimpan di penyimpanan browser setelah setiap perubahan dan dipulihkan saat Anda kembali, bahkan setelah browser ditutup. Fitur ini sekadar kemudahan, bukan cadangan: datanya terikat pada satu profil browser di satu perangkat, jendela pribadi (incognito) tidak menyimpannya, dan menghapus data situs akan menghapusnya. Simpan pekerjaan penting sebagai file proyek. [Yang disimpan di browser Anda](/id/essentials/units-settings#what-is-stored-in-your-browser) mencantumkan semuanya.

## Format file proyek {#project-file-format}

`project.json` adalah JSON biasa yang mudah dibaca. Berikut balok dari [Mulai cepat](/id/guide/quick-start), dengan baja dan IPE 200 dari pustaka:

```json [project.json]
{
  "edubeam": true,
  "version": "1.3.4",
  "domain": {
    "materials": [
      {
        "label": "Steel (S235)",
        "d": 7850,
        "e": 210000000000,
        "g": 81000000000,
        "alpha": 0.000012
      }
    ],
    "crossSections": [
      {
        "label": "IPE 200 (approx)",
        "a": 0.002848,
        "iy": 0.00001943,
        "h": 0.2,
        "k": 0.3932584269662922
      }
    ],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [
      {
        "label": "1",
        "nodes": ["1", "2"],
        "mat": "Steel (S235)",
        "cs": "IPE 200 (approx)",
        "hinges": [false, false]
      }
    ],
    "loadCases": [
      {
        "label": "DefaultLC",
        "nodalLoads": [],
        "elementLoads": [
          { "type": "udl", "target": "1", "lcs": true, "values": [0, 12000] }
        ],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Semua nilai dalam **satuan SI** (m, N, Pa, rad), apa pun satuan yang ditampilkan aplikasi. Koordinat berbentuk `[x, y, z]` dengan $y = 0$ dan $z$ mengarah ke bawah. Tumpuan dan komponen beban memakai id DOF `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` beban elemen | Nilai |
| --- | --- |
| `udl` | `values: [fx, fz]` dalam N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` dalam N/m |
| `concentrated` | `values: [Fx, Fz, My, a]` dalam N, N·m, dan m dari joint awal |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` dalam K; gradiennya ΔTb − ΔTt |

`lcs: true`, atau tanpa `lcs` sama sekali, menempatkan beban elemen dalam sumbu lokal elemen; `false` dalam sumbu global. Entri lainnya:

- **Beban joint**: `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, ditambah `"lcs": true` untuk beban dalam sumbu tumpuan yang diputar.
- **Perpindahan tumpuan**: `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; komponen yang tidak dicantumkan bernilai 0.
- File yang ditulis aplikasi juga memuat `date`, `commit`, sumbu tumpuan yang diputar (`lcs` pada joint), dan `shape` penampang yang digambar.

Karena formatnya sederhana, Anda dapat membuat model dengan skrip atau spreadsheet dan membukanya dengan **Buka proyek**. Untuk menyusun dan menghitung model sepenuhnya dengan kode, gunakan solver di balik aplikasi, [@edubeam/fem](/id/solver).
