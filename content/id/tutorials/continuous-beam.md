---
description: "Tutorial: balok menerus dua bentang di EduBeam. Bandingkan dengan dua balok sederhana, turunkan tumpuan tengah, dan periksa dengan metode gaya. Sekitar 25 menit."
source: site
---

# Tutorial: balok menerus dan penurunan tumpuan

Modelkan balok yang menerus di atas dua bentang, bandingkan dengan dua balok sederhana, lalu turunkan tumpuan tengahnya sebesar 10 mm. Reaksi balok ini tidak dapat dihitung dari keseimbangan saja, jadi Anda akan memeriksanya dengan metode gaya.

- **Waktu:** sekitar 25 menit. Ini tutorial terakhir dan terlengkap dari keempat tutorial.
- **Yang diperlukan:** EduBeam terbuka di tab kedua browser, di komputer dengan mouse dan keyboard. Jika Anda belum pernah memakai EduBeam, kerjakan dulu [Mulai cepat](/id/guide/quick-start) atau salah satu tutorial sebelumnya.
- **Bekal:** metode gaya dengan satu gaya kelebihan, dan lendutan di tengah bentang balok sederhana: $5qL^4/(384EI)$ akibat beban merata dan $FL^3/(48EI)$ akibat beban terpusat.
- **Satuan:** SI. Label satuan di kanan bawah tampilan harus menunjukkan `m m² kN kNm MPa`. Jika yang tampil ft dan kip, klik label itu dan setel **Sistem satuan** ke **SI (metrik)**.

**Yang akan Anda pelajari**

- melihat keuntungan kontinuitas: momen dan lendutan lebih kecil daripada pada balok sederhana,
- menetapkan penurunan tumpuan dan membaca gaya yang ditimbulkan oleh penurunan itu saja,
- memeriksa balok statis tak tentu dengan metode gaya, dan memahami mengapa balok yang lebih kaku lebih terpengaruh oleh penurunan tumpuan.

::div{.actions}
[Buka EduBeam ↗](https://run.edubeam.app/?lang=id){target="_blank"} [Langsung ke pemeriksaan manual](#check-by-hand)
::

::model-figure{caption="Balok yang sudah selesai: dua bentang 6 m dengan beban 10 kN/m, sebelum penurunan tumpuan"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels, dimensions]
---
::

## Soal {#the-problem}

- Dua bentang $L = 6$ m: tumpuan sendi di joint 1, tumpuan rol di joint 2 dan 3.
- Beban merata $q = 10$ kN/m di kedua bentang.
- Baja, $E = 210$ GPa, dan $I_y = 8{,}356 \times 10^{-5}$ m⁴ (profil IPE 300), jadi $EI = 17\,547{,}6$ kNm².
- Pada bagian kedua, tumpuan tengah, joint 2, turun sebesar $\Delta = 10$ mm.

**Statis tertentu?** Empat reaksi (dua di joint 1, masing-masing satu di joint 2 dan 3) berhadapan dengan tiga persamaan keseimbangan: balok ini statis tak tentu berderajat satu. Persamaan yang kurang diperoleh dari deformasi: joint 2 tidak berpindah, atau berpindah tepat sebesar $\Delta$.

## Buat model {#model-it}

::div{.steps}

### Material dan penampang {#material-and-section}

1. Klik **Hapus model** di bilah aplikasi, centang **Hapus material** dan **Hapus penampang**, lalu klik **Konfirmasi**. Penomoran joint dan elemen kembali mulai dari 1.
2. Tab **Material** → **Pustaka material** → **+** pada baris **Baja (S235)**, lalu tutup pustaka dengan **Batal**.
3. Tab **Penampang** → **Tambah penampang**. Ketik `8.356e-5` di **Iy**, biarkan **Luas**, **Tinggi**, dan **Koefisien geser** bernilai `1`, lalu klik **Tambah penampang**.

Dengan luas 1 m², balok praktis tidak berdeformasi geser, sesuai anggapan perhitungan manual. Kali ini $I_y$ juga memengaruhi gaya dalam; Anda akan melihat di mana.

### Gambar balok {#draw-the-beam}

1. Tab **Elemen** → tombol **Tambah elemen** yang kedua, yang berikon kursor.
2. Klik di (0, 0), (6, 0), dan (12, 0).
3. Tekan <kbd>Esc</kbd> untuk berhenti menggambar, lalu <kbd>F</kbd> agar seluruh model tampak di layar.

Tiga joint dan dua elemen. Periksa koordinatnya di tabel **Joint**.

### Tumpuan {#supports}

Klik joint 1 → **Tumpuan joint** → simbol **Sendi**. Beri joint 2 dan 3 tumpuan **Rol**.

### Beban {#load}

Tab **Beban** → **Tambah beban elemen** → *Beban merata* pada **Elemen** `1`, `fz = 10` → **Tambah beban elemen**. Ulangi untuk elemen 2.

::

## Hasil {#results}

Momen lentur, reaksi, dan bentuk deformasi sudah tampil sejak awal. Untuk gaya geser, centang **V<sub>z</sub> (x)** pada opsi tampilan di kanan atas (ikon roda gigi menampilkan dan menyembunyikannya). EduBeam menampilkan nilai diagram dan reaksi dalam kN dan kNm dengan dua desimal.

- Reaksi menunjukkan `22,50` di joint 1 dan 3, dan `75,00` di joint 2: tumpuan tengah memikul lebih dari separuh beban 120 kN.
- Momen di atas joint 2 menunjukkan `-45,00`, momen negatif (serat atas tertarik). Momen lapangan (positif) paling besar `25,31` kNm, pada jarak 2,25 m dari tumpuan ujung.
- Gaya geser melompat dari `-37,50` menjadi `37,50` di atas joint 2.

### Bandingkan dengan dua balok sederhana {#compare-with-two-simple-spans}

Apa keuntungan kontinuitas? Untuk melihatnya, putuskan kontinuitas itu: di tabel **Elemen**, centang sendi **akhir** elemen 1, di joint 2. Balok berubah menjadi dua balok sederhana dengan bentang 6 m, struktur yang statis tertentu.

::model-figure{caption="Dengan sendi di atas joint 2: dua balok sederhana, masing-masing dengan qL²/8 = 45 kNm"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [{ nodes: [1, 2], hinges: [false, true] }, [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

| | Balok menerus | Dua balok sederhana |
| --- | --- | --- |
| Reaksi di joint 1, 2, 3 | 22,5, 75, 22,5 kN | 30, 60, 30 kN |
| Momen di atas joint 2 | −45 kNm | 0 |
| Momen lapangan terbesar | 25,31 kNm | 45 kNm |
| Lendutan terbesar (diagram $w(x)$ pada gambar) | 4,000 mm | 9,617 mm |

Momen terbesar sama-sama 45 kNm, tetapi pada balok menerus momen itu berpindah ke atas tumpuan, dan momen lapangannya jauh lebih kecil. Setiap bentang juga 2,4 kali lebih kaku: ujungnya di atas joint 2 tidak dapat berotasi, hampir seperti terjepit. Hapus lagi centang sendi itu sebelum melanjutkan.

## Turunkan tumpuan tengah {#settle-the-middle-support}

Sekarang biarkan joint 2 turun 10 mm, seperti yang dapat terjadi pada fondasi di atas tanah lunak.

::div{.steps}

### Tetapkan penurunan tumpuan {#prescribe-the-settlement}

Klik joint 2 → **Tetapkan perpindahan**. Di dialog, **Perpindahan tumpuan** sudah terpilih; ketik `0.01` di **Dz** dan klik **Tambah beban joint**.

![Dialog perpindahan tumpuan: hanya Dz, arah yang ditahan tumpuan rol, yang dapat diisi](/screenshots/id/p2t-prescribe-displacement.webp){.shot-sm}

Dalam satuan SI bawaan, perpindahan dinyatakan dalam meter, jadi 10 mm adalah `0.01`; nilai positif berarti ke bawah. Hanya arah yang ditahan yang dapat diisi: tumpuan rol dapat diturunkan, tetapi tidak digeser ke samping. Selengkapnya di [Perpindahan tumpuan](/id/essentials/loads#prescribed-displacements-support-settlements).

### Baca hasil yang baru {#read-the-new-results}

Reaksi tengah turun menjadi `70,13` kN dan reaksi ujung naik menjadi `24,94` kN. Momen di atas joint 2 berkurang menjadi `-30,38` kNm, dan momen lapangan bertambah, sampai `31,09` kNm.

::model-figure{caption="Joint 2 turun 10 mm: momen negatif di atasnya mengecil, dan bentang memikul lebih banyak"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

### Lihat akibat penurunan tumpuan saja {#look-at-the-settlement-alone}

Hapus kedua beban elemen: pilih masing-masing dan tekan <kbd>Delete</kbd>, atau klik × di barisnya pada tabel **Beban**. Yang tersisa adalah akibat penurunan tumpuan saja: momen segitiga `14,62` kNm di atas joint 2, positif, dan reaksi yang menarik joint 2 **ke bawah** sebesar `4,87` kN, sedangkan joint 1 dan 3 masing-masing mendorong ke atas sebesar `2,44` kN. Balok melawan saat dipaksa melentur mengikuti bentuk tumpuan yang turun, dan perlawanan itulah satu-satunya yang membebaninya.

::model-figure{caption="Penurunan tumpuan saja: tanpa beban, tetapi balok melentur dan tumpuan memberi reaksi"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, w]
show: [nodeLabels]
---
::

Jumlahkan hasil ini dengan hasil akibat beban saja, dan Anda memperoleh hasil balok berbeban dengan tumpuan tengah yang turun: 75 − 4,87 = 70,13 kN, −45 + 14,62 = −30,38 kNm. Analisisnya linear, jadi berlaku superposisi.

### Putuskan lagi kontinuitasnya {#cut-the-continuity-again}

Kembalikan beban dengan <kbd>Ctrl</kbd>+<kbd>Z</kbd>, sekali untuk setiap beban yang dihapus, lalu centang lagi sendi akhir elemen 1. Kedua bentang sekarang hanya miring mengikuti tumpuan yang turun: reaksi dan momennya persis sama dengan dua balok sederhana, berapa pun penurunannya, dan tanpa beban semuanya nol. **Penurunan tumpuan menimbulkan gaya dalam hanya pada struktur statis tak tentu.** Hapus centang sendi itu sebelum melanjutkan.

::

## Periksa secara manual {#check-by-hand}

Gunakan metode gaya. Hilangkan tumpuan di joint 2 dan ganti dengan reaksinya yang belum diketahui, $R_2$, yang bekerja ke atas pada balok sederhana dengan bentang $2L = 12$ m.

**Lendutan di joint 2 pada balok yang dilepas.** Akibat beban, dan akibat gaya satuan ke atas di joint 2:

$$
\delta_q = \frac{5q\,(2L)^4}{384\,EI} = \frac{5 \cdot 10 \cdot 12^4}{384 \cdot 17\,547{,}6} = 0{,}15387\ \text{m}
$$

$$
\delta_{1} = \frac{(2L)^3}{48\,EI} = \frac{12^3}{48 \cdot 17\,547{,}6} = 0{,}0020516\ \text{m/kN}
$$

**Kompatibilitas.** $R_2$ harus mendorong joint 2 kembali ke atas sampai tepat berada di tempat tumpuannya: di posisi nol, atau $\Delta$ di bawahnya.

$$
R_2\,\delta_1 = \delta_q - \Delta \quad\Rightarrow\quad R_2 = \frac{\delta_q - \Delta}{\delta_1}
$$

**Sisanya** diperoleh dari keseimbangan; momen lapangan terbesar terletak di tempat gaya geser $R_1 - qx$ bernilai nol.

| | Rumus | Tanpa penurunan | Joint 2 turun 10 mm |
| --- | --- | --- | --- |
| $R_2$ | $(\delta_q - \Delta)/\delta_1$ | 75,00 kN | 70,13 kN |
| $R_1 = R_3$ | $(2qL - R_2)/2$ | 22,50 kN | 24,94 kN |
| $M_2$ | $R_1 L - qL^2/2$ | −45,00 kNm | −30,38 kNm |
| $M_{\max}$ | $R_1^2/(2q)$ | 25,31 kNm | 31,09 kNm |

EduBeam menunjukkan nilai yang sama sampai digit terakhir.

Tanpa penurunan tumpuan, ini adalah nilai-nilai yang ada di buku teks: $R_2 = 10qL/8$, $M_2 = -qL^2/8$, dan $M_{\max} = 9qL^2/128$. Penurunan tumpuan saja mengubah reaksi sebesar $\Delta/\delta_1 = 4{,}874$ kN dan momen di atas joint 2 sebesar

$$
\Delta M_2 = \frac{\Delta}{\delta_1} \cdot \frac{2L}{4} = \frac{3\,EI\,\Delta}{L^2} = \frac{3 \cdot 17\,547{,}6 \cdot 0{,}01}{36} = 14{,}62\ \text{kNm}
$$

Perhatikan $EI$ di dalamnya. Gaya akibat beban hanya bergantung pada kekakuan batang *relatif satu sama lain*; gaya akibat perpindahan yang dipaksakan bertambah seiring kekakuan itu sendiri. Di atas tumpuan yang turun, balok yang lebih kaku menerima momen yang lebih besar.

## Bereksperimen {#experiment}

Mulai dari balok berbeban dengan tumpuan tengah yang turun. Ubah satu hal saja setiap kali, perkirakan hasilnya, lalu periksa di layar. <kbd>Ctrl</kbd>+<kbd>Z</kbd> membatalkan setiap perubahan.

**Gandakan kekakuan.** Di tabel **Penampang**, setel **Iy** menjadi `1.6712e-4`. Pengaruh penurunan tumpuan pada momen di atas joint 2 menjadi dua kali lipat, 29,25 kNm, dan $M_2$ berkurang menjadi −15,75 kNm. Jika hanya ada beban, tidak ada yang berubah selain lendutan, yang menjadi separuhnya.

**Cari penurunan yang membebaskan joint 2.** Pada $\Delta$ berapa momen di atas joint 2 menjadi nol? $\Delta M_2 = 45$ kNm membutuhkan $\Delta = 45 L^2/(3EI) = qL^4/(24EI) = 0{,}0308$ m. Ubah penurunan menjadi `0.0308`, di tabel **Beban** atau dengan mengeklik ganda penurunan itu di tampilan: reaksinya menjadi 30, 60, dan 30 kN, sama dengan dua balok sederhana, dengan selisih kecil akibat pembulatan $\Delta$. $qL^4/(24EI)$ adalah rotasi ujung balok sederhana dikali $L$: penurunan tumpuan memiringkan setiap bentang tepat sejauh yang diperlukan untuk menutup patahan di atas joint 2, sehingga kontinuitas tidak lagi berperan.

**Lepaskan joint 2.** Ubah penurunan menjadi `0.1539`, yaitu lendutan $\delta_q$ balok 12 m yang dilepas. Reaksi di joint 2 turun hingga praktis nol, dan balok memikul beban sebagai satu balok sederhana: 180 kNm di tengah bentang. Tumpuan yang turun sejauh itu sudah bukan tumpuan lagi.

**Angkat joint 2.** Ubah penurunan menjadi `-0.01`, yaitu 10 mm ke atas. Setiap perubahan akibat penurunan tumpuan berbalik tanda: joint 2 sekarang memikul 79,87 kN dan momen negatif bertambah menjadi −59,62 kNm.

Pemeriksaan lain dengan rumus tertutup, termasuk penurunan tumpuan pada balok jepit–rol, ada di [Memeriksa hasil secara manual](/id/guide/verification#prescribed-displacement).

## Langkah selanjutnya {#next-steps}

::card-grid{cols="2"}
:::card{title="Latihan soal: balok menerus dua bentang" icon="lucide:dices" to="/id/practice?p=K2049"}
Balok dua bentang dengan beban pada satu atau kedua bentang, diselesaikan dengan metode gaya, dengan jawaban Anda langsung diperiksa. Mulai dengan K2049; untuk soal lain, pilih hanya **Balok menerus dua bentang** dan tekan **Soal baru**.
:::
:::card{title="Contoh" icon="lucide:library" to="/id/examples/"}
Ini tutorial terakhir. Halaman Contoh berisi lebih banyak model untuk dibuka, diubah, dan diperiksa, serta usulan latihan untuk mahasiswa.
:::
::
