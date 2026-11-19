---
description: "Jawaban singkat tentang EduBeam: biaya, pemakaian tanpa internet, privasi, ketelitian, cara hasil dihitung, cara mengutip, latihan soal, berbagi, dan kode."
source: site
---

# Pertanyaan yang sering diajukan

Jawaban singkat, masing-masing dengan tautan ke halaman yang membahas topiknya secara lengkap. Pertanyaan Anda tidak ada di sini? Lihat [Pemecahan masalah](/id/reference/troubleshooting) atau [tanyakan di GitHub](https://github.com/janvorisek/edubeam/issues).

## Umum {#general}

### Apa itu EduBeam? {#what-is-edubeam}

Aplikasi gratis dan bersumber terbuka untuk analisis statis linear balok, portal, dan rangka batang 2D, dibuat untuk mahasiswa, dosen, dan insinyur yang menginginkan umpan balik seketika. Aplikasi ini berjalan di browser. [Pendahuluan](/id/guide/introduction) mencantumkan apa yang dapat dan tidak dapat dilakukannya.

### Apakah benar-benar gratis? Apakah perlu akun? {#is-it-really-free-do-i-need-an-account}

Ya, gratis, dan Anda tidak memerlukan akun. Buka [run.edubeam.app](https://run.edubeam.app/?lang=id){target="_blank"} dan langsung mulai membuat model: tidak ada yang perlu dipasang dan tidak ada batas pemakaian. Kode sumbernya ada di [GitHub](https://github.com/janvorisek/edubeam) dengan lisensi GPL-3.0.

### Browser dan perangkat apa saja yang didukung? {#which-browsers-and-devices-work}

Chrome, Edge, Firefox, atau Safari versi terkini, di komputer, tablet, atau ponsel. Di layar sentuh, ketuk untuk memilih, seret joint untuk memindahkannya, seret di tempat lain untuk menggeser tampilan, rapatkan atau renggangkan dua jari untuk zoom, dan tekan lama untuk membuka menu kanvas. Untuk memodelkan, mouse dan keyboard tetap lebih cepat. Lihat [Keyboard, mouse & sentuh](/id/reference/shortcuts#touch).

### Model saya hilang. Bisakah dikembalikan? {#i-lost-my-model-can-i-get-it-back}

Kemungkinan besar bisa. Saat model dihapus, atau diganti oleh tautan, file, atau contoh, EduBeam menyimpannya di **☰ → Struktur terbaru** (10 terakhir), dan <kbd>Ctrl</kbd>+<kbd>Z</kbd> mengurungkan penggantian itu. Keduanya hanya ada di browser ini, jadi model dari komputer atau profil browser lain tidak ada di sana. Lihat [Struktur terbaru](/id/essentials/import-export#recent-structures).

### Bisakah dipakai tanpa koneksi internet? {#can-i-use-it-offline}

Bisa. EduBeam adalah progressive web app: setelah browser Anda memuatnya, aplikasi tetap berfungsi tanpa koneksi internet, dan browser mungkin menawarkan untuk memasangnya. Saat versi baru tersedia, sebuah dialog meminta persetujuan Anda sebelum memperbarui.

### Di mana data saya disimpan? {#where-is-my-data-stored}

Di browser Anda. Tidak ada akun dan tidak ada penyimpanan cloud: aplikasi menyimpan model dan pengaturan Anda di browser ini, dan tautan berbagi membawa model di dalam tautan itu sendiri. Lihat [Yang disimpan di browser Anda](/id/essentials/units-settings#what-is-stored-in-your-browser).

Aplikasi di run.edubeam.app memang mengumpulkan statistik pemakaian (Google Analytics) dan laporan kesalahan (Sentry). Laporan kesalahan, dan rekaman yang dibuat Sentry dari sebagian sesi, dapat memuat apa yang tampil di layar, termasuk model Anda.

### Di mana saya bisa berlatih soal statika? {#practice}

Di halaman [Latihan soal](/id/practice). Halaman ini memberi Anda balok, portal, atau rangka batang dengan angka baru setiap kali: hitung reaksi dan momen lentur terbesar atau gaya batang di kertas, ketikkan, dan setiap nilai langsung diperiksa. [Contoh](/id/examples/) juga dilengkapi pertanyaan dan jawaban. Dosen dapat mencetak lembar soal ujian yang berbeda untuk setiap mahasiswa, lengkap dengan kunci jawaban, dari [pembuat soal ujian](/id/exam); lihat [Latihan soal dan lembar soal ujian](/id/guide/teaching#practice-and-test-papers).

### Bagaimana cara mengutip EduBeam? {#cite}

Sebagai perangkat lunak, dengan versi dan tanggal Anda menggunakannya. Versinya tertera di bagian bawah menu **☰**. Contohnya:

> Voříšek, J. dan kontributor. *EduBeam*, versi 1.3.4 \[perangkat lunak\]. https://edubeam.app (diakses 18 November 2026).

Untuk merujuk satu model tertentu, tambahkan [tautan berbaginya](/id/essentials/import-export#share-a-link): tautan itu membuka model yang sama bagi setiap pembaca.

## Pemodelan {#modelling}

### Bagaimana membuat tumpuan jepit / sendi / rol? {#how-do-i-make-a-fixed-pinned-roller-support}

Klik joint, pilih **Tumpuan joint**, dan pilih simbolnya: sendi, rol, jepit, jepit geser, dan lainnya. Atau centang DOF yang ditahan di tab **Joint**: `Dx` + `Dz` + `Ry` adalah jepit, `Dx` + `Dz` adalah sendi, `Dz` saja adalah rol. Semua tipe tercantum di [Joint & tumpuan](/id/essentials/nodes-supports#supports).

### Bagaimana membuat rangka batang? {#how-do-i-make-a-truss}

Gambar batang sebagai elemen biasa dan lepaskan momen di kedua ujung setiap batang: centang kedua **Sendi ujung** di tab **Elemen**, atau centang **Sendi awal** dan **Sendi akhir** di banner sebelum menggambar batang dengan mouse. Berikan beban di joint. [Tutorial: rangka batang bidang](/id/tutorials/truss) menyusunnya langkah demi langkah.

### Bagaimana memasang sendi di portal? {#how-do-i-put-a-hinge-in-a-frame}

Lepaskan momen di ujung elemen yang harus dapat berputar bebas: centang sendi ujungnya di tab **Elemen**. Sendi selalu terpasang pada satu ujung elemen, jadi pada joint yang menghubungkan beberapa elemen, melepas momen pada salah satunya tidak mengubah sambungan kaku elemen lainnya. Lihat [Sendi ujung](/id/essentials/elements#end-hinges).

### Bagaimana menambahkan tumpuan atau beban terpusat di tengah balok? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Untuk tumpuan, tambahkan joint pada balok dengan mouse (tombol **Tambah joint** yang berikon kursor) dan pilih **Sambungkan ke struktur**: balok terbagi dua di joint itu, dan Anda dapat memberinya tumpuan. Beban terpusat tidak memerlukan joint: tambahkan **Beban terpusat** pada elemen dan atur posisinya dari joint awal. Lihat [Menempatkan joint pada elemen yang ada](/id/essentials/nodes-supports#placing-a-node-on-an-existing-element) dan [Beban terpusat](/id/essentials/loads#concentrated-load).

### Bisakah memberikan berat sendiri? {#can-i-apply-self-weight}

Tidak secara otomatis: massa jenis material tidak dipakai dalam analisis statis. Tambahkan berat sendiri sebagai beban merata $f_z = \rho g A$, misalnya $7850 \cdot 9{,}81 \cdot 28{,}48 \cdot 10^{-4} = 219$ N/m, yaitu 0,22 kN/m, untuk IPE 200.

### Bisakah memodelkan tumpuan miring? {#can-i-model-inclined-supports}

Bisa. Isi **Sudut LCS joint** pada joint tersebut; tumpuannya kemudian bekerja menurut sumbu yang diputar. Lihat [Tumpuan miring](/id/essentials/nodes-supports#inclined-skewed-supports).

### Bisakah bekerja dengan satuan AS? {#can-i-work-in-us-customary-units}

Bisa. Klik label satuan di kanan bawah tampilan, yang membuka **Pengaturan → Bahasa & Wilayah**, lalu atur **Sistem satuan** ke **US customary (imperial)** untuk feet dan kip, atau pilih setiap satuan secara terpisah. Model disimpan dalam SI, jadi beralih satuan hanya mengonversi apa yang Anda lihat dan tidak pernah mengubah model. Lihat [Satuan & pengaturan](/id/essentials/units-settings).

### Apakah ada kasus beban atau kombinasi? {#are-there-load-cases-or-combinations}

Tidak, satu model memiliki satu kasus beban. Simpan setiap kasus sebagai file atau tautan tersendiri, dan kombinasikan hasilnya sendiri. Sesi dari EduBeam versi desktop yang memiliki beberapa kasus beban terbuka dengan kasus pertama, dan sebuah pesan menyebutkan kasus yang tidak dimuat.

### Mengapa beban saya mengarah ke atas? {#why-do-my-loads-point-up}

Kemungkinan karena Anda memasukkan nilai negatif. Di EduBeam, sumbu z global mengarah **ke bawah**, jadi `fz` atau `Fz` positif adalah beban gravitasi ke bawah: 12 kN/m ke bawah adalah `fz = 12`. Lihat [Sistem koordinat & konvensi tanda](/id/elements/conventions#loads). Jika mata kuliah Anda memakai sumbu vertikal yang mengarah ke atas, pilih **x ke kanan, y ke atas** di **Pengaturan → Bahasa & Wilayah → Sistem koordinat**: masukan dan hasil kemudian mengikuti sumbu itu.

## Hasil {#results}

### Mengapa tidak ada tombol “Hitung”? {#why-is-there-no-solve-button}

Karena model dihitung ulang setelah setiap perubahan. Jika hasil tidak muncul, model belum dapat dihitung, dan sebuah pesan di kanvas menjelaskan sebabnya. [Pemecahan masalah](/id/reference/troubleshooting#no-results-are-drawn) mencantumkan hal yang perlu diperiksa.

### Mengapa lendutan saya sedikit berbeda dari rumus? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam memakai elemen balok Timoshenko, sehingga lendutan mencakup deformasi geser yang biasanya diabaikan rumus buku teks. Untuk balok langsing, selisihnya sekitar 1%, dan [Mulai cepat](/id/guide/quick-start#_8-check-by-hand) menjumlahkannya secara manual. Pada struktur statis tak tentu, kekakuan geser juga sedikit mengubah gaya dalam. Selengkapnya di [Memeriksa hasil secara manual](/id/guide/verification).

### Seberapa akurat hasilnya? Apakah perlu lebih banyak elemen? {#how-accurate-are-the-results-do-i-need-more-elements}

Untuk statika linear, elemen balok eksak untuk setiap tipe beban yang tersedia di EduBeam, jadi satu elemen per batang sudah cukup dan tidak ada jaring elemen yang perlu diperhalus. Tambahkan joint hanya di tempat Anda memerlukan tumpuan, sendi, perubahan penampang, beban joint, atau perpindahan yang ingin dibaca. Lihat [Presisi dan akurasi](/id/essentials/results#precision-and-accuracy).

### Bagaimana EduBeam menghitung hasilnya? {#how-does-edubeam-compute-the-results}

Dengan metode kekakuan langsung dari metode elemen hingga, yang diajarkan di mata kuliah analisis struktur, langsung di browser Anda. [Cara EduBeam menghitung model](/id/elements/analysis) mengikuti setiap langkah pada contoh kecil yang dapat Anda ulangi secara manual, dan solvernya sendiri bersumber terbuka sebagai [@edubeam/fem](/id/solver).

### Bisakah saya melihat matriks kekakuan? {#can-i-see-the-stiffness-matrices}

Bisa. Di tab **Elemen**, tombol matriks pada baris elemen membuka matriks kekakuan 6 × 6 elemen itu, dalam sumbu global dan satuan SI (N, m). Mengeklik elemen di tampilan juga menawarkan **Matriks kekakuan**. Halaman [elemen balok](/id/elements/beam#global-stiffness-matrix) menurunkannya.

### Di mana reaksi dicantumkan? {#where-are-the-reactions-listed}

Di tampilan, sebagai panah dengan nilainya: **Reaksi** di opsi tampilan, aktif secara bawaan. Reaksi juga ada di file dari **Hasil → Ekspor CSV** dan dalam data yang disalin ke clipboard dengan **Salin**. Tab **Hasil** mencantumkan perpindahan joint dan gaya ujung elemen. Lihat [Hasil & diagram](/id/essentials/results).

## File & berbagi {#files-sharing}

### Bagaimana membagikan model? {#how-do-i-share-a-model}

Tekan **Bagikan model**, lalu **Salin**. Tautan memuat seluruh model, dan siapa pun yang membukanya mendapat salinan sendiri untuk diedit: tidak ada kolaborasi langsung. Aktifkan **Tampilkan yang saya lihat** agar tautan terbuka dengan diagram dan label Anda. Lihat [Membagikan tautan](/id/essentials/import-export#share-a-link) dan, untuk mata kuliah, [Mengajar dengan EduBeam](/id/guide/teaching#in-lecture-notes-and-assignments).

### Bisakah menyematkan model di situs web atau slide? {#can-i-embed-a-model-on-my-website-or-in-slides}

Bisa. Tambahkan `&viewer=1` ke tautan berbagi dan masukkan ke dalam `<iframe>`: lihat [Menyematkan penampil](/id/essentials/import-export#embed-a-read-only-viewer). Untuk gambar statis di halaman web, slide, atau catatan cetak, ekspor SVG, atau gambar dari kode dengan [@edubeam/plot](/id/plot).

### Bisakah mengekspor gambar atau tabel? {#can-i-export-images-or-tables}

Bisa. **☰ → Ekspor gambar** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) menyimpan gambar sebagai PNG atau SVG, dengan ukuran atau skala pilihan Anda. **Hasil → Ekspor CSV** menyimpan kedua tabel hasil, dan **Salin** menaruhnya di clipboard untuk spreadsheet. Lihat [Mengekspor gambar](/id/essentials/import-export#export-an-image).

### Bisakah membuka file dari EduBeam versi desktop? {#can-i-open-files-from-the-desktop-edubeam}

Bisa. Sesi yang disimpan EduBeam versi desktop 2.x sampai 3.5 (`.xml`) terbuka lewat **☰ → Buka proyek** atau dengan menyeretnya ke jendela aplikasi, sama seperti `project.json`. Nilainya dibaca dalam kN, kPa, dan m. Lihat [Membuka proyek](/id/essentials/import-export#open-a-project).

### Bisakah membuat model secara terprogram? {#can-i-generate-models-programmatically}

Bisa, dengan dua cara:

- **Tulis filenya.** `project.json` adalah JSON biasa dalam satuan SI, jadi skrip dalam bahasa pemrograman apa pun dapat menuliskannya, dan EduBeam membukanya lewat **Buka proyek** atau dengan seret dan lepas. Lihat [format file proyek](/id/essentials/import-export#project-file-format).
- **Hitung dengan kode.** [@edubeam/fem](/id/solver) adalah solver elemen hingga di balik EduBeam, sebagai pustaka JavaScript dan TypeScript. [@edubeam/plot](/id/plot) kemudian menggambar hasilnya, misalnya sebagai [lembar soal yang dibuat otomatis](/id/plot/exercises).

Balok dari [Mulai cepat](/id/guide/quick-start), dalam satuan SI:

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // sendi
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // rol
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, ke bawah

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 54000 N·m di tengah bentang
beam.computeLocalDefl(lc, 2).w[1] // 0.0502 m di tengah bentang
```

## Dukungan {#support}

### Bagaimana melaporkan kesalahan atau mengusulkan fitur? {#how-do-i-report-a-bug-or-request-a-feature}

Buat laporan (issue) di [GitHub](https://github.com/janvorisek/edubeam/issues) dan lampirkan tautan berbagi atau file proyek yang memperlihatkan masalahnya. Untuk pertanyaan yang bersifat pribadi, kirim e-mail ke [support@edubeam.app](mailto:support@edubeam.app).
