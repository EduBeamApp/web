---
description: "Mengajar dengan EduBeam: model langsung di proyektor, tautan berbagi di catatan kuliah, tugas yang diperiksa sendiri, latihan soal, dan lembar soal ujian dengan kunci jawaban."
source: site
---

# Mengajar dengan EduBeam

[EduBeam]{.edubeam} lahir di ruang kuliah, dan di sanalah EduBeam masih paling berguna: model di proyektor yang langsung bereaksi saat Anda mengubahnya, dan model yang sama di laptop setiap mahasiswa melalui sebuah tautan. Halaman ini merangkum hal yang paling sering dipakai dosen, dari kuliah pertama sampai ujian.

::card-grid{cols="2"}
:::card{title="Di ruang kuliah" icon="lucide:presentation" to="#in-the-lecture"}
Buat model terbaca dari barisan belakang dan ubah secara langsung.
:::
:::card{title="Di praktikum pertama" icon="lucide:graduation-cap" to="#getting-students-started"}
Sepuluh menit dari layar kosong sampai balok yang diperiksa secara manual.
:::
:::card{title="Di catatan kuliah dan tugas" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
Tautan di PDF atau slide membuka seluruh model, bahkan bertahun-tahun kemudian.
:::
:::card{title="Tugas yang diperiksa sendiri" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
Perhitungan manual lebih dulu, lalu model sebagai pemeriksanya.
:::
:::card{title="Latihan soal dan lembar soal ujian" icon="lucide:file-check" to="#practice-and-test-papers"}
Soal yang dibuat otomatis dengan pemeriksaan langsung, dan lembar soal ujian siap cetak dengan kunci jawaban.
:::
:::card{title="Lembar soal dan slide dari kode" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
Pembangkit soal dan ilustrasi slide Anda sendiri, ditulis dengan @edubeam/plot.
:::
::

## Di ruang kuliah {#in-the-lecture}

- **Buat terbaca dari barisan belakang.** Di **Pengaturan → Pengaturan tampilan**, naikkan **Ukuran huruf** menjadi 18 atau 20 px (20 px adalah yang terbesar) dan **Ukuran tumpuan** menjadi 130–150%. Naikkan **Skala hasil** jika diagram masih tampak kecil.
- **Mulai dari satu besaran.** Di opsi tampilan (kanan atas tampilan), hapus centang semuanya kecuali besaran yang sedang dibahas, lalu tambahkan yang lain satu per satu.
- **Ubah model secara langsung.** Seret tumpuan, centang `Ry`, tambahkan sendi. Mahasiswa langsung melihat sebab dan akibatnya, dan dengan <kbd>Ctrl</kbd>+<kbd>Z</kbd> Anda kembali ke keadaan semula.
- **Biarkan solver menjelaskan mekanisme.** Tambahkan satu sendi terlalu banyak, dan EduBeam menggambar bagaimana struktur dapat bergerak, menganimasikannya, dan melingkari sendi penyebabnya. Inilah saat yang tepat untuk membahas stabilitas. Kedua sakelarnya ada di **Pengaturan → Pengaturan tampilan → Pemeriksaan model**.
- **Gunakan bahasa dan sumbu mahasiswa Anda.** EduBeam tersedia dalam 18 bahasa, dan di [Pengaturan](/id/essentials/units-settings) Anda dapat beralih antara satuan SI dan satuan AS serta antara sumbu z ke bawah dan y ke atas, sesuai catatan kuliah Anda.

![Mekanisme yang terlihat jelas: sendi di B dan C membuat portal dapat bergoyang](/screenshots/id/ui-mechanism.webp)

## Di praktikum pertama {#getting-students-started}

Pada kunjungan pertama, EduBeam menanyakan kepada mahasiswa bagaimana mereka ingin memulai serta satuan dan sumbu yang ingin mereka pakai. Beri tahu mereka sebelumnya satuan dan sumbu yang dipakai di mata kuliah Anda. Tur (**Ajak saya berkeliling**), tugas terpandu **Gambar balok pertama Anda**, dan **Contoh** tetap tersedia di menu **☰** untuk nanti.

Praktikum pertama yang baik: “buka run.edubeam.app dan pilih *Gambar balok pertama Anda*”, lalu [Mulai cepat](/id/guide/quick-start), sekitar sepuluh menit dengan pemeriksaan manual di akhir.

### Komputer laboratorium dan pemakaian tanpa internet {#offline-and-lab-computers}

EduBeam adalah progressive web app: setelah browser memuatnya sekali, aplikasi tetap berfungsi tanpa koneksi internet, dan browser mungkin menawarkan untuk memasangnya seperti aplikasi desktop. Model dan pengaturan disimpan per profil browser, jadi di komputer laboratorium bersama, mahasiswa sebaiknya membawa pulang pekerjaannya sebagai file atau tautan. Rinciannya ada di [Yang disimpan di browser Anda](/id/essentials/units-settings#what-is-stored-in-your-browser).

## Di catatan kuliah dan tugas {#in-lecture-notes-and-assignments}

Tautan berbagi memuat seluruh model, jadi tautan itu berfungsi di mana pun tautan dapat dipakai: PDF, slide, halaman LMS, atau e-mail.

::div{.steps}

### Buat model {#share-build}

Siapkan model seperti yang seharusnya pertama kali dilihat mahasiswa: beban, label, dan diagram yang ingin ditampilkan.

### Salin tautan {#share-copy}

Tekan **Bagikan model** di bilah aplikasi. Aktifkan **Tampilkan yang saya lihat** jika tautan harus terbuka dengan diagram, beban, dan label Anda, lalu tekan **Salin**.

### Tempelkan ke catatan Anda {#share-paste}

Mahasiswa yang membukanya mendapat salinan sendiri untuk dijelajahi. Perubahan mereka tidak sampai kepada Anda atau orang lain. Tautan tetap berfungsi di versi EduBeam yang lebih baru, jadi catatan kuliah tetap berlaku dari tahun ke tahun.

::

Biarkan **Tautan lebih pendek** nonaktif untuk materi kuliah: salinan EduBeam yang belum diperbarui sejak opsi itu tersedia tidak dapat membuka bentuk pendek itu sampai diperbarui.

| Tautan | Membuka |
| --- | --- |
| `run.edubeam.app/?model=…` | model, siap diedit |
| `run.edubeam.app/?viewer=1&model=…` | model dalam [mode penampil](/id/essentials/import-export#embed-a-read-only-viewer), untuk `<iframe>` |
| `run.edubeam.app/?panel=examples` | galeri [Contoh](/id/examples/) |
| `run.edubeam.app/?lang=id` | aplikasi dalam bahasa Indonesia, atau dalam [bahasa lain](/id/essentials/import-export#url-parameters) apa pun |

::callout{type="warning" title="Tautan menggantikan model milik mahasiswa"}
Membuka tautan, dan di beberapa browser juga membuka halaman dengan penampil tersemat, memindahkan model yang sedang dibuka mahasiswa ke **☰ → Struktur terbaru**, tempat model itu dapat dipulihkan. Meski begitu, minta mahasiswa menyimpan pekerjaan penting dengan **☰ → Simpan proyek** sebelum membuka tautan dari kelas.
::

## Tugas yang dapat diperiksa sendiri oleh mahasiswa {#assignments-students-can-check-themselves}

EduBeam memberi mahasiswa umpan balik langsung atas perhitungan manual tanpa mengerjakan metodenya untuk mereka.

- **Hitung dulu, lalu periksa.** Minta mahasiswa menghitung reaksi, gaya dalam, dan satu perpindahan secara manual, lalu membuat modelnya dan membandingkan hasilnya. [Memeriksa hasil secara manual](/id/guide/verification) berisi rumus-rumusnya, dan [Mulai cepat](/id/guide/quick-start#_8-check-by-hand) menunjukkan alurnya.
- **Tanyakan mengapa hasilnya berbeda.** Deformasi geser, sendi yang terlewat, beban pada sumbu lokal alih-alih global: masing-masing menjelaskan selisih kecil atau besar, dan mencari penyebabnya lebih mendidik daripada sekadar hasil yang cocok.
- **Kumpulkan model bersama pekerjaannya.** Minta tautan berbagi atau `project.json` di samping perhitungan. Anda dapat membukanya dan melihat persis apa yang dimodelkan.
- **Laporan yang rapi.** Mahasiswa dapat mengekspor gambar sebagai **SVG**, yang tetap tajam di Word dan LaTeX, dan hasil sebagai **CSV**. Lihat [Mengekspor gambar](/id/essentials/import-export#export-an-image).

## Latihan siap pakai {#ready-made-exercises}

- **[Contoh](/id/examples/):** enam model yang terbuka dengan satu klik, masing-masing dengan pertanyaan, hal yang perlu diperhatikan, dan jawabannya.
- **[Latihan soal](/id/practice):** balok, portal, dan rangka batang yang dibuat otomatis dan memeriksa jawaban mahasiswa, ditambah [pembuat soal ujian](/id/exam) yang mencetaknya sebagai lembar soal. Lihat [di bawah](#practice-and-test-papers).
- **[Tutorial](/id/tutorials/inclined-beam):** balok miring, portal tiga sendi, rangka batang bidang, dan balok menerus dengan penurunan tumpuan, masing-masing dimodelkan langkah demi langkah dan diperiksa secara manual. Cocok sebagai lembar kerja praktikum 15 sampai 20 menit.
- **[Memeriksa hasil secara manual](/id/guide/verification):** kasus dengan rumus tertutup, dari kantilever sampai penurunan tumpuan, untuk dijadikan pemeriksaan cepat.

## Latihan soal dan lembar soal ujian {#practice-and-test-papers}

Dua halaman di situs ini membuatkan soal statika untuk Anda, tanpa perlu memasang atau memprogram apa pun:

- **[Latihan soal](/id/practice)** memberi mahasiswa soal baru setiap kali mereka memintanya. Mereka mengerjakannya di kertas, mengetik reaksi dan momen lentur terbesar atau gaya batang, dan halaman itu memeriksa setiap nilai terhadap jawaban eksak: selisih tidak lebih dari 1% dianggap benar, dan nilai yang besarnya benar tetapi arahnya salah diberi tanda. Petunjuk menunjukkan cara memulai, dan diagramnya muncul setelah soal selesai. Setiap soal memiliki kode soal, misalnya `H2048`, yang selalu menunjuk soal yang sama: cantumkan satu kode di tugas, dan semua mahasiswa mencocokkan jawabannya dengan angka yang sama.
- **[Pembuat soal ujian](/id/exam)** mencetak lembar soal ujian: pilih jenis struktur, sampai 6 soal per lembar dan sampai 40 paket, dan setiap mahasiswa mendapat paket yang berbeda. Setiap paket berisi jenis struktur yang sama dengan urutan yang sama, sehingga tingkat kesulitannya setara. Pembuat soal menambahkan baris nama, ruang untuk perhitungan, dan kunci jawaban, dan **Cetak atau simpan sebagai PDF** mencetaknya. **Unduh .zip** memberikan setiap gambar sebagai file SVG untuk LaTeX dan Word, serta jawabannya sebagai tabel CSV untuk penilaian.

Keduanya menawarkan delapan jenis struktur yang sama: enam yang statis tertentu (balok sederhana, kantilever, balok dengan overstek, balok Gerber, portal tiga sendi, dan rangka batang Warren) dan dua yang statis tak tentu (balok menerus dua bentang dan portal dua sendi).

Pembuat soal ujian menyimpan pengaturannya, termasuk **Nomor ujian** yang menentukan angka-angkanya, di alamat halaman. Simpan halaman itu sebagai bookmark, dan lembar soal serta kunci jawaban yang sama muncul lagi tahun depan. Kode soal secara bawaan tidak dicetak di lembar soal ujian: halaman latihan soal menampilkan penyelesaiannya, jadi kode soal lebih cocok untuk tugas rumah, tempat mahasiswa memeriksa pekerjaannya sendiri setelah selesai.

## Lembar soal, ujian, dan slide dari kode {#exercise-sheets-tests-and-slides-from-code}

Diagram di situs ini digambar oleh [@edubeam/plot](/id/plot), pustaka komponen Vue yang menggambar balok, portal, atau rangka batang bidang apa pun yang dihitung oleh [@edubeam/fem](/id/solver), solver di balik EduBeam. Jika Anda bisa menulis sedikit JavaScript, beberapa baris kode sudah cukup untuk menghasilkan materi kuliah:

- **Jenis soal Anda sendiri.** Jika struktur di pembuat soal ujian bukan yang Anda ajarkan, tulis sendiri: seed (nilai awal pembangkit bilangan acak) memilih struktur dan angka-angkanya, sehingga seed yang sama selalu menghasilkan soal yang sama, dan kunci jawabannya dihasilkan dari seed yang sama pula.
- **Slide yang tersusun bertahap.** Tampilkan struktur, lalu tumpuan dan beban, lalu reaksi, lalu diagram momen, langkah demi langkah, tanpa gambar bergeser di antara langkah.
- **Ilustrasi untuk catatan dan halaman mata kuliah.** SVG tajam yang mengikuti tema terang atau gelap halaman dan, tidak seperti aplikasi tersemat, tidak pernah menyentuh model milik mahasiswa.

Coba sendiri. Setiap kali Anda menekan **Soal baru**, soal baru beserta kunci jawabannya digambar:

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="Soal latihan dan ujian" icon="lucide:file-check" to="/id/plot/exercises"}
Buat lembar soal beserta kunci jawabannya dari sebuah seed.
:::
:::card{title="Slide dan catatan kuliah" icon="lucide:presentation" to="/id/plot/slides"}
Ilustrasi yang tersusun lapis demi lapis, untuk slide dan catatan kuliah.
:::
::
