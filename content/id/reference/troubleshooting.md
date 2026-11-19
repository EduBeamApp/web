---
description: "Mengapa EduBeam tidak menampilkan hasil dan cara mengatasinya: setiap pesan kesalahan dan peringatan, hasil yang janggal, file atau tautan yang tidak terbuka."
source: site
---

# Pemecahan masalah

Jika model tidak dapat dihitung, [EduBeam]{.edubeam} menjelaskan sebabnya dalam pesan di kiri atas tampilan, dan **Tampilkan detail** mencantumkan setiap masalah secara lengkap. Pilih judul dialog yang Anda lihat: setiap pesan di bawah dijelaskan artinya dan cara mengatasinya.

::card-grid{cols="2"}
:::card{title="Belum siap dihitung" icon="lucide:circle-dashed" to="#still-needed"}
Label biru **Perlu tumpuan**. Tidak ada yang salah: struktur hanya belum tertahan di tempatnya.
:::
:::card{title="Model tidak dapat dihitung" icon="lucide:circle-x" to="#errors"}
Pesan merah. Tumpuan yang tidak menahan, sendi yang membentuk mekanisme, elemen dengan panjang nol.
:::
:::card{title="Peringatan model" icon="lucide:triangle-alert" to="#warnings"}
Pesan kuning. Model sudah dihitung, tetapi kemungkinan ada sesuatu yang tidak sesuai maksud Anda.
:::
:::card{title="Hasil tampak salah" icon="lucide:scale" to="#results-look-wrong"}
Beban mengarah ke atas, lendutan yang meleset dengan faktor pangkat sepuluh, tanda yang tampak terbalik.
:::
::

## Pesan {#messages}

### Arti warna {#read-the-message}

| Yang terlihat | Artinya |
| --- | --- |
| Label biru **Perlu tumpuan** | Model belum selesai. Tambahkan tumpuan. Arahkan kursor ke label itu untuk melihat, sebagai garis putus-putus, bagaimana struktur masih dapat bergerak. |
| Pesan **merah** | Ada yang menghalangi perhitungan. Pesan menyebutkan masalahnya, atau berbunyi *Kesalahan pada model: n* jika ada beberapa. Joint yang terlibat dilingkari pada gambar. |
| Pesan **kuning** | Peringatan. Model tetap dihitung. Jika ada beberapa, pesan berbunyi *Peringatan pada model: n*. |
| *Belum ada material yang didefinisikan.* / *Belum ada penampang yang didefinisikan.* | Elemen memerlukan keduanya. Tambahkan dengan tombol **Tambah baru** di samping pesan. |

**Tampilkan detail** membuka dialog berjudul *Belum siap dihitung*, *Model tidak dapat dihitung*, atau *Peringatan model*. Sakelarnya menampilkan atau menyembunyikan bagaimana struktur dapat bergerak, dan tautan **Pemecahan masalah** di dalamnya mengarah ke halaman ini.

![Dialog Model tidak dapat dihitung, dengan sakelar yang menampilkan bagaimana struktur dapat bergerak](/screenshots/id/ui-diagnostics.webp){.shot-lg}

Pada gambar:

- Tombol **✕** pada pesan merah melipatnya menjadi label kecil *Model tidak dapat dihitung*, agar layar kecil lebih lega. Klik label itu untuk membukanya lagi.
- Tombol **mata** pada pesan merah menampilkan atau menyembunyikan garis putus-putus gerakan. **Pengaturan → Pengaturan tampilan → Pemeriksaan model** mematikan garis itu, beserta animasinya, secara permanen.
- Tombol **✕** pada pesan kuning menyembunyikan peringatan.

### Masih diperlukan {#still-needed}

Model tidak salah, hanya belum selesai. Arahkan kursor ke label untuk teks singkatnya; dialog menampilkan teks panjangnya.

| Pesan | Arti dan cara mengatasi |
| --- | --- |
| *Struktur memerlukan tumpuan sebelum dapat dihitung.* <br> *Model memerlukan setidaknya 3 DOF yang ditahan agar stabil dalam analisis 2D.* | Secara keseluruhan arah yang ditahan kurang dari tiga. Tambahkan tumpuan. |
| *Bagian dengan joint … memerlukan tumpuan.* <br> *Bagian struktur yang terpisah (joint …) memiliki kurang dari 3 DOF yang ditahan dan dapat bergerak bebas.* | Model terdiri atas beberapa bagian, dan salah satunya melayang. Sambungkan ke bagian lain, atau beri tumpuan. |
| *n bagian struktur memerlukan tumpuan.* | Beberapa bagian melayang. Tampilkan detail mencantumkannya. |

### Kesalahan {#errors}

Ada yang menghalangi perhitungan. Pesan merah menampilkan teks singkat; dialog menampilkan teks panjang.

| Pesan | Arti dan cara mengatasi |
| --- | --- |
| *Tumpuan tidak menahan struktur: struktur masih dapat bergeser horizontal / bergerak vertikal / berputar bebas / bergerak sebagai benda kaku.* <br> *Jumlah tumpuan struktur sudah cukup, tetapi tumpuan tidak menahannya: struktur masih dapat …* | Jumlah kekangan sudah cukup, tetapi semuanya sejajar, atau garis kerjanya bertemu di satu titik, seperti tiga tumpuan rol pada balok horizontal. Garis putus-putus menunjukkan gerakannya; putar atau pindahkan salah satu tumpuan. |
| *Bagian dengan joint … tidak tertahan: bagian itu masih dapat …* <br> *Bagian struktur yang terpisah (joint …) memiliki cukup tumpuan, tetapi tumpuan tidak menahannya: bagian itu masih dapat …* | Sama seperti di atas, untuk satu bagian dari model yang terpisah-pisah. |
| *Sendi di joint … membuat struktur dapat bergerak.* <br> *Tumpuan menahan struktur, tetapi struktur masih merupakan mekanisme: batangnya dapat berputar pada sendi di joint …* | Sendi membuat batang-batang dapat berputar satu terhadap yang lain, seperti portal dengan dua kaki bertumpuan sendi dan sendi di puncak setiap kolom, atau persegi dari batang bersambungan sendi tanpa diagonal. Hapus sebuah sendi, atau tambahkan batang atau tumpuan. |
| *Struktur tidak stabil: struktur bergerak hampir tanpa hambatan.* <br> *Struktur tidak stabil: joint … secara horizontal (Dx) … bergerak praktis tanpa hambatan.* | Hampir mekanisme, atau kekakuan yang mendekati nol. Pesan panjang menyebutkan joint dan arahnya. Periksa tumpuan, sendi, dan nilai `E`, `A`, dan `Iy`. |
| *Struktur adalah mekanisme: struktur dapat bergerak tanpa hambatan.* <br> *Struktur adalah mekanisme: matriks kekakuan singular.* | Ada bagian yang dapat bergerak bebas yang tidak tertangkap oleh pemeriksaan di atas. Pastikan setiap bagian ditahan oleh setidaknya tiga kekangan dan sendi ujung tidak membuat batang bebas berputar. |
| *Elemen … memiliki panjang nol: joint … dan … berada di titik yang sama.* | Dua joint dari satu elemen saling bertumpuk. Pindahkan salah satunya, atau hapus elemennya. |
| *Elemen … merujuk joint yang sama di kedua ujungnya.* | Hapus elemen itu dan gambar lagi di antara dua joint yang berbeda. |
| *Elemen … merujuk joint / material / penampang … yang tidak ada.* | Objek yang dipakainya sudah dihapus, biasanya di file proyek yang diedit manual. Tetapkan ulang di tabel *Elemen*. |
| *Elemen … harus merujuk tepat 2 joint.* | Elemen rusak di file yang diimpor. Hapus dan gambar lagi. |
| *Beban joint #n merujuk joint … yang tidak ada.* <br> *Perpindahan tumpuan #n merujuk joint … yang tidak ada.* | Hapus bebannya, atau tetapkan ke joint yang ada. |
| *Beban elemen #n merujuk elemen … yang tidak ada.* | Hapus bebannya. |
| *Solver gagal karena ada ketidakkonsistenan internal pada model.* | Kegagalan umum. Urungkan langkah terakhir, atau simpan proyek dan [laporkan](#reporting-a-bug). |

### Peringatan {#warnings}

Model tetap dihitung, tetapi periksa hal-hal berikut:

| Pesan | Arti dan cara mengatasi |
| --- | --- |
| *Joint … tidak tersambung ke elemen mana pun dan diabaikan oleh solver.* | Joint yang tidak terpakai. Hapus, atau sambungkan ke elemen. |
| *Joint … diberi tumpuan tetapi tidak ada elemen yang tersambung, sehingga tumpuannya tidak memikul apa pun.* | Tumpuan pada joint yang tidak tersambung ke elemen. |
| *Beban joint #n berisi nilai yang tidak valid.* <br> *Perpindahan tumpuan #n berisi nilai yang tidak valid.* | Ada komponen yang bukan angka. Edit bebannya. |

### Saat mengedit {#while-editing}

Pesan-pesan ini muncul di dialog browser saat Anda bekerja, dan model dibiarkan seperti semula:

| Pesan | Arti dan cara mengatasi |
| --- | --- |
| *Tambahkan material terlebih dahulu.* <br> *Tambahkan penampang terlebih dahulu.* | Elemen memerlukan keduanya. Tambahkan di tab *Material* atau *Penampang*, lalu gambar elemennya lagi. |
| *Pilih material dan penampang.* | Ada kolom kosong di dialog **Tambah elemen**. Pilih keduanya. |
| *Label … sudah digunakan.* | Dua joint, elemen, material, atau penampang tidak boleh berlabel sama. Pilih label lain. |
| *Perpindahan tumpuan sudah ada untuk joint ini. Hapus terlebih dahulu.* | Satu joint hanya dapat memiliki satu perpindahan yang ditetapkan. Edit yang sudah ada, atau hapus dulu. |

## Tidak ada yang digambar {#no-results-are-drawn}

Jika tidak ada diagram yang muncul, periksa dengan urutan berikut:

::div{.steps}

### Periksa opsi tampilan {#check-the-display-options}

Jika tidak ada pesan sama sekali, model sudah dihitung: diagramnya mungkin hanya dimatikan. Centang **M<sub>y</sub>(x)**, atau hasil lain, di opsi tampilan di kanan atas tampilan; tombol ⚙ di atasnya menampilkan panel itu. Model tanpa beban sama sekali memiliki hasil nol di mana-mana, jadi tidak ada yang perlu digambar.

### Periksa tumpuan {#check-the-supports}

Solver memerlukan setidaknya tiga arah yang ditahan, dan bersama-sama tumpuan harus mencegah struktur bergeser atau berputar. Balok di atas dua tumpuan rol hanya memiliki dua dan akan bergeser: ubah salah satunya menjadi tumpuan **sendi**. Tiga tumpuan rol yang sejajar, atau tumpuan yang garis kerjanya bertemu di satu titik, juga tidak menahannya. Lihat [Joint & tumpuan](/id/essentials/nodes-supports#supports).

### Periksa apakah elemen tersambung {#check-the-connections}

Dua joint di koordinat yang sama tetaplah dua joint terpisah, dan bagian yang hanya bersentuhan dengan bagian lain di situ akan melayang bebas. Hapus joint yang berlebih dan sambungkan ulang. Saat menempatkan joint pada elemen, jawab **Sambungkan ke struktur** untuk membagi elemen di sana.

### Hitung jumlah sendi {#count-the-hinges}

Portal dengan dua kaki bertumpuan sendi dan sendi di puncak setiap kolom, atau persegi dari batang bersambungan sendi tanpa diagonal, adalah mekanisme. EduBeam melingkari sendi-sendinya dan menggerakkan garis putus-putus mengikuti gerakan itu. Lihat [Sendi ujung](/id/essentials/elements#end-hinges).

### Cari kekakuan nol {#look-for-zero-stiffness}

`E`, `A`, atau `Iy` yang dimasukkan sebagai 0, atau dalam satuan yang salah, membuat sebagian struktur bergerak hampir tanpa hambatan. EduBeam melaporkannya sebagai *tidak stabil*.

::

## Hasil tampak salah {#results-look-wrong}

| Gejala | Kemungkinan penyebab |
| --- | --- |
| Beban mengarah ke atas | Sumbu global **z mengarah ke bawah**, jadi `Fz` atau `fz` positif bekerja ke bawah; nilai negatif mengarah ke atas. Dengan sumbu y ke atas, berlaku sebaliknya. Lihat [Beban](/id/essentials/loads#sign-convention-in-one-line). |
| Lendutan meleset dengan faktor 10, 100, 1000, … | Satuan tertukar: `E` dimasukkan dalam Pa padahal kolom mengharapkan MPa, atau `Iy` dalam cm⁴ padahal kolom mengharapkan m⁴. Label satuan di kanan bawah tampilan mencantumkan satuan yang dipakai setiap kolom. |
| Lendutan sedikit lebih besar daripada rumus buku teks | Deformasi geser balok Timoshenko. Lihat [Memeriksa hasil secara manual](/id/guide/verification#shear-deformation). |
| Tanda tampak salah | Baca tanda dari nilainya, bukan dari sisi tempat diagram digambar: M positif berarti serat bawah tertarik. Gaya ujung di *Hasil elemen* mengikuti sumbu lokal elemen, bukan konvensi N-V-M. Lihat [Membaca tanda](/id/essentials/results#reading-the-sign). |
| Diagram berada di sisi yang “salah” | Sisinya adalah pengaturan tampilan: momen lentur di sisi tarik atau sisi tekan, N dan V di salah satu sisi garis putus-putus. **Pengaturan → Pengaturan tampilan → Diagram gaya dalam**. |
| Dua kolom identik menunjukkan tanda gaya geser yang berlawanan | Tanda V mengikuti arah masing-masing elemen. Tukar joint salah satunya untuk membandingkan. |
| Angka seperti `4 · 10¹` | Format angka ilmiah. Pilih *Otomatis* di **Pengaturan → Bahasa & Wilayah → Format angka**. |
| Diagram sangat besar atau sangat kecil | Hanya gambarnya. Atur **Skala hasil** di **Pengaturan → Pengaturan tampilan**. |
| Beban dalam sumbu lokal mengarah ke arah yang salah | Sumbu x lokal elemen berjalan dari joint *awal* ke joint *akhir*. Tukar joint-nya, atau balik tandanya. |
| Beban pada batang miring meleset | **LCS** tercentang secara bawaan, jadi `fz` bekerja tegak lurus batang. Hapus centangnya untuk beban vertikal. |
| Beban suhu tidak berpengaruh | Struktur statis tertentu berdeformasi bebas akibat suhu, tanpa gaya dalam. Untuk melihat deformasinya, pastikan α tidak 0 dan, untuk selisih suhu, tinggi penampang $h$ sudah diisi. |

## File dan tautan {#files-and-links}

| Gejala | Cara mengatasi |
| --- | --- |
| *File tidak dapat diimpor. Periksa format file.* | File itu bukan proyek EduBeam maupun sesi EduBeam versi desktop. Model Anda tidak berubah. |
| *Sesi EduBeam ini memiliki beberapa kasus beban, tetapi hanya satu yang dapat dibuka.* | Sesi EduBeam versi desktop dengan beberapa kasus beban: EduBeam membuka yang pertama dan menyebutkan yang tidak dibuka. |
| Tautan berbagi malah membuka model lama Anda | Tautannya terpotong atau berubah, misalnya karena program e-mail memecahnya ke baris baru. EduBeam mengabaikan tautan yang tidak dapat dibacanya dan mempertahankan model Anda. Salin lagi seluruh tautannya. |
| Tautan pendek tidak terbuka di komputer rekan | Salinan EduBeam miliknya lebih lama daripada versi 1.3.2. Ia perlu memuat ulang aplikasi, atau Anda dapat membagikan tautan dengan **Tautan lebih pendek** dinonaktifkan. Lihat [Membagikan tautan](/id/essentials/import-export#share-a-link). |

## Masalah antarmuka {#interface-issues}

| Gejala | Cara mengatasi |
| --- | --- |
| Pintasan tidak berfungsi | Klik dulu di area gambar: tombol tunggal diabaikan selama kolom teks sedang aktif. Di Mac, gunakan <kbd>Cmd</kbd> sebagai ganti <kbd>Ctrl</kbd>. Lihat [Keyboard, mouse & sentuh](/id/reference/shortcuts). |
| <kbd>Delete</kbd> tidak berfungsi di Mac | Tombol berlabel *delete* pada keyboard Mac sebenarnya Backspace. Tekan <kbd>Fn</kbd>+<kbd>Delete</kbd>. |
| Tampilan tidak dapat digeser | Menggeser tampilan memakai tombol tengah atau kanan mouse; pilih tombolnya di **Pengaturan → Kontrol & Pintasan**. Pada trackpad, klik dan seret dengan dua jari. Di layar sentuh, seret dengan satu jari. |
| Model saya hilang | Membuka tautan, file, atau contoh, dan menghapus model, selalu menyimpan model lama: **☰ → Struktur terbaru**, atau <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Saat tautan dibuka, pesan di bagian bawah layar memberitahukannya: *Struktur yang dibagikan telah dibuka. Struktur Anda sebelumnya disimpan di Struktur terbaru.*, dengan tombol **Tampilkan**. |
| Bahasa salah | **Pengaturan → Bahasa & Wilayah**, atau tambahkan `?lang=id` ke alamat. |
| Perubahan pengaturan tidak tersimpan | Penyimpanan browser diblokir, misalnya di jendela pribadi atau mode privasi yang ketat. Pengaturan, model yang tersimpan, dan Struktur terbaru semuanya memerlukannya. |

## Melaporkan kesalahan {#reporting-a-bug}

Buat [laporan (issue) di GitHub](https://github.com/janvorisek/edubeam/issues) yang mencantumkan browser dan sistem operasi Anda, apa yang Anda lakukan, dan apa yang Anda harapkan. Yang paling membantu adalah **tautan berbagi** atau **file proyek** yang memperlihatkan masalahnya.
