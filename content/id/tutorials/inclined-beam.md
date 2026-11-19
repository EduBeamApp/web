---
description: "Tutorial: balok miring (kasau atap atau tangga) di EduBeam. Beban per meter proyeksi horizontal, gaya normal dan geser, dan pengaruh arah tumpuan rol. Sekitar 15 menit."
source: site
---

# Tutorial: balok miring

Modelkan kasau atap yang memikul beban salju, baca gaya normal dan gaya geser di sepanjang kemiringannya, lalu periksa secara manual.

- **Waktu:** sekitar 15 menit. Ini tutorial pertama dan terpendek dari keempat tutorial.
- **Yang diperlukan:** EduBeam terbuka di tab kedua browser, di komputer dengan mouse dan keyboard. Jika Anda belum pernah memakai EduBeam, kerjakan dulu [Mulai cepat](/id/guide/quick-start): di sana diperkenalkan tab dan dialog yang dipakai dalam tutorial ini.
- **Bekal:** keseimbangan balok sederhana (balok di atas dua tumpuan) dan penguraian gaya menjadi dua komponen.
- **Satuan:** SI. Label satuan di kanan bawah tampilan harus menunjukkan `m m² kN kNm MPa`. Jika yang tampil ft dan kip, klik label itu dan setel **Sistem satuan** ke **SI (metrik)**.

**Yang akan Anda pelajari**

- mengubah beban per meter proyeksi horizontal menjadi beban sepanjang batang, seperti yang diterima EduBeam,
- mengarahkan beban garis vertikal atau tegak lurus batang dengan kotak **LCS**,
- memutar tumpuan rol, dan melihat bahwa hal itu mengubah gaya normal, tetapi tidak momen lentur.

::div{.actions}
[Buka EduBeam ↗](https://run.edubeam.app/?lang=id){target="_blank"} [Langsung ke pemeriksaan manual](#check-by-hand)
::

::model-figure{caption="Kasau yang sudah selesai: beban salju 3 kN/m per meter proyeksi horizontal, dimasukkan sebagai 2,4 kN/m sepanjang batang, dengan tumpuan sendi di ujung bawah atap (joint 1) dan tumpuan rol di bubungan (joint 2)"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Soal {#the-problem}

- Kasau lurus dari joint 1 di (0, 0) naik ke joint 2 di (4, −3): 4 m pada proyeksi horizontal dan tinggi 3 m, jadi panjangnya $L = 5$ m, dengan $\cos\alpha = 4/5$ dan $\sin\alpha = 3/5$.
- Tumpuan sendi di joint 1, ujung bawah atap. Di joint 2, bubungan, tumpuan rol yang bergerak horizontal, sehingga reaksinya vertikal.
- Beban salju $s = 3$ kN/m, diberikan seperti dalam peraturan pembebanan, **per meter proyeksi horizontal**.
- Baja, $E = 210$ GPa, dan $I_y = 8{,}356 \times 10^{-5}$ m⁴, yaitu momen inersia profil IPE 300.

**Statis tertentu?** Tiga reaksi dan tiga persamaan keseimbangan: ya. Gaya-gayanya diperoleh dari statika saja; $E$ dan $I_y$ hanya berpengaruh pada lendutan.

## Buat model {#model-it}

::div{.steps}

### Material dan penampang {#material-and-section}

1. Klik **Hapus model** di bilah aplikasi, centang **Hapus material** dan **Hapus penampang**, lalu klik **Konfirmasi**. Penomoran joint dan elemen kembali mulai dari 1.
2. Tab **Material** → **Pustaka material** → **+** pada baris **Baja (S235)**, lalu tutup pustaka dengan **Batal**.
3. Tab **Penampang** → **Tambah penampang**. Ketik `8.356e-5` di **Iy**, biarkan **Luas**, **Tinggi**, dan **Koefisien geser** bernilai `1`, lalu klik **Tambah penampang**.

Dengan luas 1 m², batang praktis tidak memendek dan tidak berdeformasi geser, sesuai anggapan perhitungan manual.

### Gambar batang {#draw-the-member}

1. Tab **Elemen** → tombol **Tambah elemen** yang kedua, yang berikon kursor.
2. Klik di (0, 0), lalu di (4, −3). Penggaris dan crosshair menunjukkan posisi kursor, dan titik yang diklik menempel ke grid.
3. Tekan <kbd>Esc</kbd> untuk berhenti menggambar, lalu <kbd>F</kbd> agar seluruh model tampak di layar.

Sumbu z mengarah ke bawah, jadi joint 2, yang terletak 3 m **di atas** joint 1, berada di $z = -3$. Periksa kedua joint di tabel **Joint** dan ketik ulang koordinat yang meleset.

### Tumpuan {#supports}

Klik joint 1 → **Tumpuan joint** → simbol **Sendi**. Dengan cara yang sama, beri joint 2 tumpuan **Rol**.

### Beban {#load}

Beban salju pada kasau totalnya $3 \cdot 4 = 12$ kN. EduBeam membagi beban merata pada **panjang** batang, jadi 12 kN yang sama, tersebar pada 5 m, menjadi

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0{,}8 = 2{,}4\ \text{kN/m}
$$

1. Tab **Beban** → **Tambah beban elemen**.
2. **Tipe beban** *Beban merata*, **Elemen** `1`, `fz = 2.4`.
3. **Hapus centang LCS** agar `fz` bekerja vertikal, lalu klik **Tambah beban elemen**.

::callout{type="warning" title="Secara bawaan, LCS tercentang"}
Jika **LCS** (sistem koordinat lokal) dicentang, `fz` bekerja searah sumbu z lokal elemen, tegak lurus kemiringan: seperti angin pada atap, bukan salju. Pada balok horizontal keduanya sama, karena itu kesalahan ini mudah luput. Panah beban menunjukkan arah beban; rinciannya ada di [Beban](/id/essentials/loads#uniformly-distributed-load).
::

::

## Hasil {#results}

Balok langsung dihitung begitu bebannya dimasukkan. Pada opsi tampilan di kanan atas (ikon roda gigi menampilkan dan menyembunyikannya), **Bentuk deformasi**, **M<sub>y</sub> (x)**, dan **Reaksi** sudah aktif sejak awal; centang juga **N (x)** dan **V<sub>z</sub> (x)**. Sakelar di bawah gambar di bagian atas halaman ini menampilkan diagram yang sama.

EduBeam menampilkan nilai diagram dan reaksi dalam kN dan kNm dengan dua desimal, jadi Anda akan melihat:

- `6,00` di setiap tumpuan, ke atas. Reaksi horizontal tumpuan sendi menunjukkan `0,00`: tidak ada gaya horizontal yang bekerja.
- `6,00` kNm, puncak momen lentur, di tengah bentang.
- Gaya geser `4,80` kN di joint 1 dan `-4,80` di joint 2.
- Gaya normal `-3,60` kN di joint 1 (tekan) dan `3,60` di joint 2 (tarik), melewati nol di tengah bentang.

## Periksa secara manual {#check-by-hand}

**Reaksi.** Resultan 12 kN bekerja pada jarak horizontal 2 m dari joint 1, jadi momen terhadap salah satu ujung memberi $V_1 = V_2 = 6$ kN. Tidak ada gaya horizontal, jadi $H_1 = 0$.

**Momen lentur.** Untuk gaya vertikal, yang diperhitungkan hanya lengan momen horizontal. Pada jarak horizontal $x$ dari joint 1,

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

persis seperti pada balok horizontal dengan bentang $a = 4$ m yang memikul beban per meter proyeksi horizontal yang sama.

**Gaya geser dan gaya normal.** Resultan gaya di sebelah kiri potongan pada $x$ adalah gaya vertikal $T(x) = V_1 - s\,x$. Uraikan gaya ini menjadi komponen tegak lurus batang dan komponen searah batang:

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | Joint 1, $T = +6$ kN | Tengah bentang, $T = 0$ | Joint 2, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0{,}8 = 4{,}8$ kN | 0 | −4,8 kN |
| $N$ | $-6 \cdot 0{,}6 = -3{,}6$ kN | 0 | +3,6 kN |
| $M$ | 0 | 6 kNm | 0 |

Semuanya sama dengan EduBeam. Reaksi ke atas di joint 1 mendorong ujung bawah ke atas searah kemiringan, masuk ke batang: tekan. Reaksi ke atas di joint 2 menarik ujung atas lebih jauh ke atas searah kemiringan, menjauhi batang: tarik. Tandanya mengikuti arah elemen, dari joint 1 ke joint 2, seperti dijelaskan di [Sistem koordinat & konvensi tanda](/id/elements/conventions#internal-forces).

## Bereksperimen {#experiment}

Ubah satu hal saja setiap kali, perkirakan hasilnya, lalu periksa di layar. <kbd>Ctrl</kbd>+<kbd>Z</kbd> membatalkan setiap perubahan.

**Lupakan kosinusnya.** Masukkan `fz = 3`, bukan 2,4. Itu berarti 3 kN per meter panjang miring, total 15 kN, dan semua hasil menjadi 25% terlalu besar: reaksi 7,5 kN dan momen 7,5 kNm. Pada atap dengan kemiringan 30°, kesalahannya 15%, pada 45° sebesar 41%.

**Biarkan LCS tercentang.** Centang **LCS** pada beban 2,4 kN/m. Beban sekarang mendorong tegak lurus kemiringan, seperti angin, dengan komponen horizontal 7,2 kN yang hanya dapat ditahan tumpuan sendi. Momen naik menjadi $2{,}4 \cdot 5^2/8 = 7{,}5$ kNm, dan gaya normal menjadi tarik konstan 4,5 kN.

::model-figure{caption="2,4 kN/m yang sama dengan LCS tercentang: tegak lurus kemiringan, sehingga tumpuan sendi menahan 7,2 kN ke samping"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Putar tumpuan rol.** Hapus lagi centang **LCS**, lalu ubah hanya arah gerak tumpuan rol di joint 2. Klik joint 2 → **Tumpuan joint**, ketik `-36.87` di **Sudut LCS joint**, dan tekan <kbd>Enter</kbd> (atau isi kolom **α** pada baris joint itu di tabel **Joint**).

![Menu Tumpuan joint pada joint 2: simbol tumpuan, arah yang ditahan, dan Sudut LCS joint](/screenshots/id/p2t-node-supports-angle.webp){.shot-md}

Sudut ini memutar sumbu joint itu sendiri. Pada sumbu bawaan, x ke kanan dan z ke bawah, sudut negatif memutarnya berlawanan arah jarum jam di layar. Selengkapnya di [Tumpuan miring](/id/essentials/nodes-supports#inclined-skewed-supports).

Tumpuan rol sekarang bergerak searah kemiringan, jadi reaksinya tegak lurus batang: $12 \cdot 2 / 5 = 4{,}8$ kN, dari momen terhadap joint 1. Tumpuan sendi menahan sisanya, termasuk seluruh gaya normal: −7,2 kN di joint 1, nol di joint 2.

::model-figure{caption="Tumpuan rol di joint 2 diputar −36,87° agar bergerak searah kemiringan: gaya normal berubah dari −7,2 kN sampai nol"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Jadikan rol vertikal.** Kembalikan sudutnya ke 0 dan pilih **Rol vertikal** untuk joint 2. Tumpuan ini bergerak vertikal, jadi hanya dapat mendorong ke samping: momen terhadap joint 1, $H_2 \cdot 3 = 12 \cdot 2$, memberi 8 kN, dan tumpuan sendi menahan kasau terhadap gaya dorong itu. Seluruh batang mengalami tekan.

::model-figure{caption="Rol vertikal di joint 2: gaya dorong horizontal 8 kN, dan seluruh kasau mengalami tekan"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

Perbandingan ketiga tumpuan rol:

| Rol di joint 2 | Reaksi di joint 2 | Reaksi di joint 1 | $N$ dari joint 1 ke 2 |
| --- | --- | --- | --- |
| Horizontal | 6 kN ↑ | 6 kN ↑ | −3,6 sampai +3,6 kN |
| Searah kemiringan | 4,8 kN ⊥ batang | 2,88 kN →, 8,16 kN ↑ | −7,2 sampai 0 kN |
| Vertikal | 8 kN ← | 8 kN →, 12 kN ↑ | −13,6 sampai −6,4 kN |

**Momen lentur tidak pernah berubah**, begitu pula gaya geser: 6 kNm dan ±4,8 kN pada ketiganya. Joint 1, joint 2, dan setiap potongan terletak pada satu garis lurus, yaitu sumbu batang. Komponen reaksi di joint 2 yang bekerja searah garis itu tidak menghasilkan momen terhadap titik mana pun di garis tersebut, jadi hanya menambah gaya normal. Komponen yang tegak lurus batang selalu 4,8 kN, sesuai keseimbangan momen terhadap joint 1, ke mana pun arah tumpuan rol. Arah tumpuan rol hanya menentukan ke mana gaya dorong disalurkan, dan itu penting bagi dinding atau bordes tangga yang harus menerimanya.

## Langkah selanjutnya {#next-steps}

::card-grid{cols="2"}
:::card{title="Latihan soal: balok dengan overstek" icon="lucide:dices" to="/id/practice?p=O2048"}
Reaksi dan momen terbesar balok yang memikul beban terbagi, dengan jawaban Anda langsung diperiksa. Mulai dengan O2048; untuk soal lain, biarkan hanya **Balok dengan overstek** yang terpilih dan tekan **Soal baru**.
:::
:::card{title="Berikutnya: portal tiga sendi" icon="lucide:triangle" to="/id/tutorials/three-hinged-frame"}
Empat batang, sendi dalam, dan gaya dorong horizontal: portal yang masih dapat diselesaikan dengan statika saja.
:::
::
