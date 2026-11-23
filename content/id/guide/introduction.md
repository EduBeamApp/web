---
description: "EduBeam adalah solver elemen hingga gratis di browser untuk balok, portal, dan rangka batang 2D: kemampuan dan batasnya, sasaran pengguna, dan susunan panduan."
source: site
---

# Pendahuluan

[EduBeam]{.edubeam} adalah aplikasi analisis struktur gratis untuk **balok, portal, dan rangka batang** yang berjalan langsung di browser. Gambar struktur, beri tumpuan dan beban: solver elemen hingga menghitung ulang diagram, reaksi, dan lendutan setiap kali Anda mengubah sesuatu. Tidak ada tombol *Hitung*, tidak ada yang perlu dipasang, dan tidak perlu membuat akun.

::div{.actions}
[Buka EduBeam ↗](https://run.edubeam.app/?lang=id){target="_blank"} [Mulai cepat, 10 menit](/id/guide/quick-start)
::

![Portal tiga sendi di EduBeam: beban berwarna oranye, reaksi ungu, momen lentur merah, dan bentuk deformasi abu-abu](/screenshots/id/hero.webp)

:span{#your-first-visit}

## Apa yang dapat dilakukan {#what-it-does}

::card-grid{cols="2"}
:::card{title="Struktur" icon="lucide:triangle" to="/id/essentials/elements"}
Balok, balok menerus, portal, dan rangka batang pada bidang x–z, tersusun dari elemen balok Timoshenko. Sendi ujung mengubah batang menjadi batang rangka.
:::
:::card{title="Tumpuan" icon="lucide:anchor" to="/id/essentials/nodes-supports#supports"}
Sendi, rol, jepit, jepit geser, atau kombinasi apa pun dari `Dx`, `Dz`, dan `Ry` yang ditahan, dipilih lewat simbolnya. Tumpuan miring dan penurunan tumpuan.
:::
:::card{title="Beban" icon="lucide:arrow-down-to-line" to="/id/essentials/loads"}
Gaya dan momen di joint atau di sembarang titik pada batang, beban garis merata dan trapesium, beban suhu, serta perpindahan yang ditetapkan.
:::
:::card{title="Penampang" icon="lucide:shapes" to="/id/essentials/elements#cross-sections"}
Pustaka profil Eropa dan AS, atau poligon apa pun yang Anda gambar. EduBeam menghitung $A$, $I_y$, $I_z$, $I_{yz}$, sumbu utama, dan jari-jari girasi.
:::
:::card{title="Hasil" icon="lucide:chart-spline" to="/id/essentials/results"}
Diagram **N**, **V**, dan **M**, bentuk deformasi, reaksi, perpindahan joint, gaya ujung, dan matriks kekakuan elemen.
:::
:::card{title="Analisis" icon="lucide:calculator" to="/id/elements/analysis"}
Analisis statis linear, eksak untuk model linear: tidak ada jaring elemen yang perlu diperhalus. Jika struktur tidak stabil, EduBeam menjelaskan sebabnya dan menganimasikan gerakannya.
:::
:::card{title="File" icon="lucide:folder-open" to="/id/essentials/import-export"}
Proyek sebagai JSON, seluruh model sebagai tautan, gambar sebagai PNG atau SVG, hasil sebagai CSV. Model yang diganti tetap tersimpan, dan tidak ada data yang meninggalkan perangkat Anda.
:::
:::card{title="Satuan" icon="lucide:ruler" to="/id/essentials/units-settings"}
SI atau satuan AS dengan satu klik, atau setiap besaran secara terpisah. Sumbu z ke bawah, atau sumbu y ke atas seperti di buku teks.
:::
::

## Apa yang belum dapat dilakukan {#what-it-does-not-do-yet}

Mengetahui batasannya sejak awal menghemat waktu:

::div{.limits}
- **Hanya 2D.** Tidak ada perilaku di luar bidang dan tidak ada portal 3D.
- **Hanya statis linear.** Tidak ada efek orde kedua (P–Δ), tekuk, dinamika, atau plastisitas.
- **Satu kasus beban.** Tidak ada kombinasi beban atau envelope (selubung): simpan setiap kasus sebagai file atau tautan tersendiri.
- **Tanpa berat sendiri.** Masukkan sebagai beban garis.
- **Tanpa pemeriksaan desain.** EduBeam memberikan gaya dalam dan perpindahan; pemeriksaan menurut standar menjadi tugas Anda.
::

Jika Anda membutuhkan fitur yang belum ada, [buat laporan (issue) di GitHub](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## Untuk siapa? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Mahasiswa" icon="lucide:graduation-cap" to="/id/practice"}
Umpan balik langsung untuk perhitungan manual, dan latihan soal yang memeriksa jawaban Anda selama Anda mengerjakannya.
:::
:::card{title="Dosen" icon="lucide:presentation" to="/id/guide/teaching"}
Peragakan langsung di proyektor, dalam 22 bahasa, bagaimana tumpuan, sendi, dan beban mengubah gaya dalam, lalu cetak lembar soal ujian yang berbeda untuk setiap mahasiswa.
:::
:::card{title="Insinyur" icon="lucide:hard-hat" to="/id/elements/analysis"}
Pemeriksaan cepat sebelum membuka program desktop yang lebih berat, dengan setiap langkah penyelesaian terdokumentasi.
:::
:::card{title="Pengembang" icon="lucide:code-xml" to="#libraries"}
Solver dan komponen gambar di balik EduBeam, tersedia sebagai pustaka sumber terbuka untuk kode Anda sendiri.
:::
::

## Menjelajahi panduan {#how-this-guide-is-organised}

Bilah samping mengelompokkan halaman seperti berikut. Tombol **?** di aplikasi membuka halaman yang sesuai di sini, dalam bahasa Anda.

::card-grid{cols="2"}
:::card{title="Memulai" icon="lucide:flag" to="/id/guide/quick-start"}
Halaman ini dan Mulai cepat: balok pertama dalam sepuluh menit.
:::
:::card{title="Membuat model" icon="lucide:pencil-ruler" to="/id/essentials/user-interface"}
Antarmuka, joint dan tumpuan, elemen, material dan penampang, beban, satuan dan pengaturan.
:::
:::card{title="Membaca hasil" icon="lucide:chart-spline" to="/id/essentials/results"}
Diagram dan tabel hasil, serta cara memeriksanya secara manual.
:::
:::card{title="Berbagi & mengajar" icon="lucide:share-2" to="/id/essentials/import-export"}
File proyek, tautan berbagi, ekspor gambar dan CSV, serta mengajar dengan EduBeam.
:::
:::card{title="Tutorial" icon="lucide:triangle" to="/id/tutorials/inclined-beam"}
Balok miring, portal tiga sendi, rangka batang bidang, dan balok menerus dengan penurunan tumpuan. Setiap model dibuat langkah demi langkah dan diperiksa secara manual.
:::
:::card{title="Contoh" icon="lucide:library" to="/id/examples/"}
Enam model siap pakai yang terbuka dengan satu klik, lengkap dengan latihan dan jawabannya.
:::
:::card{title="Manual teori" icon="lucide:sigma" to="/id/elements/conventions"}
Sumbu dan konvensi tanda, elemen balok dan rangka batang, serta cara EduBeam menghitung model.
:::
:::card{title="Bantuan" icon="lucide:life-buoy" to="/id/reference/shortcuts"}
Keyboard, mouse dan layar sentuh, pemecahan masalah, dan FAQ.
:::
::

## Membuat alat sendiri {#libraries}

EduBeam dibangun di atas dua pustaka sumber terbuka yang juga didokumentasikan di situs ini. Gunakan keduanya untuk menghitung struktur dalam skrip, membangkitkan soal yang berbeda untuk setiap mahasiswa, atau menggambar ilustrasi untuk slide dan catatan kuliah.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/id/solver"}
Solver elemen hingga di balik EduBeam, ditulis dalam TypeScript: memodelkan balok, menghitungnya, dan membaca hasilnya cukup dengan selusin baris kode, di browser atau di Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/id/plot"}
Komponen Vue 3 yang menggambar struktur yang sudah dihitung sebagai SVG, lengkap dengan beban, reaksi, dan diagram N, V, dan M.
:::
::

## Bahasa {#languages}

EduBeam tersedia dalam 22 bahasa dan otomatis terbuka dalam bahasa browser Anda. Ubah di **Pengaturan → Bahasa & Wilayah**, atau pilih di sini:

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-hu"} Magyar](https://run.edubeam.app/?lang=hu){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-ro"} Română](https://run.edubeam.app/?lang=ro){target="_blank"}
- [:icon{name="circle-flags:lang-sk"} Slovenčina](https://run.edubeam.app/?lang=sk){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-el"} Ελληνικά](https://run.edubeam.app/?lang=el){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

Tautan juga dapat memilihkan bahasa untuk pembacanya: `run.edubeam.app/?lang=id` terbuka dalam bahasa Indonesia.

## Penulis & ucapan terima kasih {#authors-credits}

[EduBeam]{.edubeam} dikembangkan oleh [Jan Voříšek](https://github.com/janvorisek) sebagai proyek independen. Aplikasi ini meneruskan jejak EduBeam versi desktop untuk Windows dan Linux, yang dibuat oleh [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/), dan [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) di Departemen Mekanika, [Fakultas Teknik Sipil, Universitas Teknik Ceko di Praha (ČVUT)](https://www.fsv.cvut.cz/en). EduBeam yang baru masih dapat membuka file sesi program tersebut. Solvernya, [@edubeam/fem](/id/solver), berkembang dari versi pertama karya Bořek Patzák. Aplikasi dan solver sama-sama bersumber terbuka dan berlisensi GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Pengembang utama & perancang produk","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Pengembang: kontrol sentuh, kinerja penggambaran, beban dan tumpuan","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"EduBeam asli dan solver elemen hingga pertama","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Berkontribusi {#contribute}

::card-grid{cols="3"}
:::card{title="Laporkan masalah" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Ada yang membingungkan, salah, atau tidak berfungsi? Laporan (issue) di GitHub langsung sampai ke tim.
:::
:::card{title="Perbaiki terjemahan" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Teks aplikasi tersimpan dalam satu file per bahasa; pull request Anda kami sambut dengan senang hati.
:::
:::card{title="Sebarkan" icon="lucide:share-2"}
Kenalkan EduBeam kepada teman kuliah dan rekan kerja, atau cantumkan tautan model di catatan Anda.
:::
::
