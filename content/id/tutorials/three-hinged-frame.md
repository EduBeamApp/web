---
description: "Tutorial: portal tiga sendi dengan beban merata di EduBeam. Baca reaksi, gaya dorong, dan gaya dalam, lalu periksa semuanya secara manual, sampai lendutan sendi. Sekitar 15 menit."
source: site
---

# Tutorial: portal tiga sendi

Modelkan portal dengan sendi di tengah bentang balok, baca reaksi dan diagramnya, lalu periksa setiap angka secara manual, sampai lendutan sendinya.

- **Waktu:** sekitar 15 menit.
- **Yang diperlukan:** EduBeam terbuka di tab kedua browser, di komputer dengan mouse dan keyboard. Jika Anda belum pernah memakai EduBeam, kerjakan dulu [Mulai cepat](/id/guide/quick-start) atau tutorial [balok miring](/id/tutorials/inclined-beam).
- **Bekal:** keseimbangan portal dan diagram benda bebas. Pemeriksaan lendutan (opsional) memakai metode beban satuan (kerja virtual).
- **Satuan:** SI. Label satuan di kanan bawah tampilan harus menunjukkan `m m² kN kNm MPa`. Jika yang tampil ft dan kip, klik label itu dan setel **Sistem satuan** ke **SI (metrik)**.

**Yang akan Anda pelajari**

- menggambar portal sebagai satu polyline dengan mouse,
- memasang sendi di dalam batang dengan kotak **Sendi ujung**,
- mencari gaya dorong horizontal dari syarat $M = 0$ di sendi, dan membaca tanda $V$ pada batang yang digambar ke arah berbeda.

::div{.actions}
[Buka EduBeam ↗](https://run.edubeam.app/?lang=id){target="_blank"} [Langsung ke pemeriksaan manual](#_6-check-by-hand)
::

::model-figure{caption="Portal yang sudah selesai: 10 kN/m pada balok, tumpuan sendi di joint 1 dan 5, sendi di joint 3"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Soal {#the-problem}

- Dua kolom setinggi 4 m dengan tumpuan sendi di kakinya, joint 1 dan 5, berjarak 8 m.
- Balok horizontal dari joint 2 ke joint 4 di atasnya, dengan sendi di tengah bentang, joint 3.
- Beban merata $q = 10$ kN/m di sepanjang balok.
- Baja, $E = 210$ GPa, dan $I_y = 8{,}356 \times 10^{-5}$ m⁴ (profil IPE 300) untuk semua batang.

| Joint | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | tumpuan sendi |
| 2 | 0 | −4 | sudut portal |
| 3 | 4 | −4 | sendi di balok |
| 4 | 8 | −4 | sudut portal |
| 5 | 8 | 0 | tumpuan sendi |

Sumbu z mengarah **ke bawah**, jadi puncak kolom berada di $z = -4$.

**Statis tertentu?** Dua tumpuan sendi memberi empat reaksi. Tiga persamaan keseimbangan ditambah $M_3 = 0$ di sendi memberi empat persamaan: ya.

## Buat model {#model-it}

::div{.steps}

### Material dan penampang {#_1-material-and-section}

1. Klik **Hapus model** di bilah aplikasi, centang **Hapus material** dan **Hapus penampang**, lalu klik **Konfirmasi**. Penomoran joint dan elemen kembali mulai dari 1.
2. Tab **Material** → **Pustaka material** → **+** pada baris **Baja (S235)**, lalu tutup pustaka dengan **Batal**.
3. Tab **Penampang** → **Tambah penampang**. Ketik `8.356e-5` di **Iy**, biarkan **Luas**, **Tinggi**, dan **Koefisien geser** bernilai `1`, lalu klik **Tambah penampang**.

Dengan luas 1 m², batang praktis tidak memendek dan tidak berdeformasi geser, sesuai anggapan perhitungan lendutan secara manual. Gaya dalam portal statis tertentu sama sekali tidak bergantung pada $E$, $A$, atau $I_y$.

### Gambar portal {#_2-draw-the-frame}

1. Tab **Elemen** → tombol **Tambah elemen** yang kedua, yang berikon kursor.
2. Klik di (0, 0), (0, −4), (4, −4), (8, −4), dan (8, 0). Setiap klik menambahkan joint berikutnya dan menyambungkannya ke joint sebelumnya; titik yang diklik menempel ke grid.
3. Tekan <kbd>Esc</kbd> untuk berhenti menggambar, lalu <kbd>F</kbd> agar seluruh model tampak di layar.

Sekarang Anda memiliki joint 1 sampai 5 dan elemen 1 sampai 4, bernomor sesuai urutan menggambar, sama seperti pada gambar di halaman ini. Bandingkan tabel **Joint** dengan tabel di atas dan ketik ulang koordinat yang meleset.

### Tumpuan dan sendi {#_3-supports-and-the-hinge}

1. Klik joint 1 → **Tumpuan joint** → simbol **Sendi**. Lakukan hal yang sama untuk joint 5.
2. Di tabel **Elemen**, cari elemen 2, dari joint 2 ke joint 3, dan centang kotak kedua di kolom **Sendi ujung**: sendi di ujung akhirnya, di joint 3.

![Tabel Elemen: elemen 2 dengan sendi ujung akhir tercentang, di joint 3](/screenshots/id/p2t-frame-elements-table.webp)

Satu sendi sudah cukup. Dengan begitu, elemen 3 menjadi satu-satunya batang yang tersambung kaku ke joint 3, sehingga di joint itu tidak ada momen yang dapat diteruskan ke elemen 3. Mencentang juga sendi awal elemen 3 tidak mengubah apa pun.

### Beban {#_4-load}

1. Tab **Beban** → **Tambah beban elemen**.
2. **Tipe beban** *Beban merata*, **Elemen** `2`, `fz = 10`. Klik **Tambah beban elemen**.
3. Ulangi untuk elemen 3.

`fz` positif mengarah ke bawah. Baloknya horizontal, jadi kotak **LCS** tidak berpengaruh di sini.

::

## Hasil {#_5-results}

Pada opsi tampilan di kanan atas (ikon roda gigi menampilkan dan menyembunyikannya), **Bentuk deformasi**, **M<sub>y</sub> (x)**, dan **Reaksi** sudah aktif sejak awal. Centang **N (x)** dan **V<sub>z</sub> (x)** untuk melihat sisanya, atau hapus centang sebagian agar diagram tampil satu per satu. EduBeam menampilkan nilainya dalam kN dan kNm dengan dua desimal.

- Setiap kaki kolom menunjukkan `40,00` ke atas dan `20,00` ke dalam.
- Diagram momen lentur menunjukkan `-80,00` di kedua sudut portal dan tidak berlabel di sendi, tempat momennya nol. EduBeam menggambarnya di sisi tarik, di sini di sisi luar portal.
- Gaya normal negatif di mana-mana: `-40,00` di kolom, `-20,00` di balok. Keempat batang mengalami tekan.
- Tab **Hasil** → **Hasil joint**: sendi di joint 3 turun sebesar $D_z$ = `4,2554 · 10⁻² m`, yaitu 42,55 mm, nilai di sendi pada diagram $w(x)$ di gambar atas.

## Periksa secara manual {#_6-check-by-hand}

**Reaksi vertikal.** Karena simetri, setiap kaki kolom menerima separuh dari 80 kN:

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Reaksi horizontal.** Potong portal di sendi dan ambil momen terhadap joint 3 untuk separuh kiri; di sendi momennya nol:

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

Kedua kaki kolom mendorong ke dalam sebesar 20 kN. Gaya dorong ini diberikan oleh tumpuan sendi, yang tidak dapat bergeser saling menjauh. Tanpa gaya itu portal tidak dapat berdiri: kolom akan membuka ke samping dan sendi akan turun.

| Besaran | Rumus | Perhitungan manual | EduBeam |
| --- | --- | --- | --- |
| Reaksi vertikal | $q \cdot 8/2$ | 40 kN | 40,00 |
| Reaksi horizontal | dari $M_3 = 0$ | 20 kN | 20,00 |
| Momen di sudut portal, joint 2 dan 4 | $H_1 \cdot 4$ | 80 kNm, tarik di sisi luar | −80,00 |
| Momen di sendi, joint 3 | | 0 | tanpa label |
| $N$ di kolom | $-V_1$ | −40 kN | −40,00 |
| $N$ di balok | $-H_1$ | −20 kN | −20,00 |
| $V$ di kolom | $\pm H_1$ | ±20 kN | −20,00, 20,00 |
| $V$ di balok di joint 2, 3, 4 | $V_1 - q\,x$ | 40, 0, −40 kN | 40,00, tanpa label, −40,00 |

Kedua kolom memikul gaya geser yang sama besar dengan tanda berlawanan, −20 kN di elemen 1 dan +20 kN di elemen 4, karena sumbu lokal setiap elemen mengikuti arah elemen itu digambar: elemen 1 ke atas, elemen 4 ke bawah. Tukar joint salah satu kolom, dan tandanya berbalik. Alasannya dijelaskan di halaman [Sistem koordinat & konvensi tanda](/id/elements/conventions#internal-forces).

Di balok, $M(x) = -80 + 40x - 5x^2$ kNm, dengan $x$ diukur dari joint 2. Momen ini nol di sendi dan tidak pernah positif: di seluruh balok serat atas tertarik (momen negatif). Gaya geser $V(x) = 40 - 10x$ bernilai nol tepat di sendi, jadi di situlah momen mencapai nilai ekstremnya.

::callout{type="details" title="Lendutan sendi dengan kerja virtual"}
Pasang beban satuan ke bawah di joint 3. Beban ini memberi reaksi $\bar V = \bar H = 1/2$ dan momen $\bar m$ yang naik dari 0 di kaki kolom menjadi 2 di sudut portal dan turun lagi ke 0 di sendi, dengan sisi tarik di luar, seperti momen sebenarnya $M$. Integrasikan $M \bar m$ di sepanjang keempat batang:

$$
\text{kolom: } 2\int_0^4 (20\,y)(0{,}5\,y)\,dy = 426{,}7
$$

$$
\text{balok: } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0{,}5x)\,dx = 320
$$

Dengan $EI = 210 \times 10^6 \cdot 8{,}356 \times 10^{-5} = 17\,548$ kNm²:

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746{,}7}{17\,548} = 0{,}04255\ \text{m}
$$

Itulah 42,55 mm yang dilaporkan EduBeam sebagai `4,2554 · 10⁻²` m. Angka 4 di digit terakhir berasal dari pemendekan dan deformasi geser yang sangat kecil, yang masih terjadi dengan luas 1 m² dan diabaikan dalam perhitungan manual. Dengan luas sebenarnya profil IPE 300, $A = 53{,}8$ cm², dan badannya sebagai luas geser (koefisien geser 0,40), batang memendek dan berdeformasi geser lebih besar, dan sendi turun 43,7 mm, sekitar 3% lebih besar.
::

## Bereksperimen {#_7-experiment}

Ubah satu hal saja setiap kali, perkirakan hasilnya, lalu periksa di layar. <kbd>Ctrl</kbd>+<kbd>Z</kbd> membatalkan setiap perubahan.

**Hapus centang sendi.** Portal menjadi statis tak tentu berderajat satu. Gaya dorong horizontal berkurang separuhnya menjadi 10 kN, momen di sudut berkurang menjadi −40 kNm, dan di tengah bentang balok muncul momen positif 40 kNm. Joint 3 sekarang hanya turun 12,16 mm, bukan 42,55 mm. Kini penampang juga berpengaruh: jika balok diberi penampang yang lebih kaku daripada kolom, momen di sudut bertambah.

::model-figure{caption="Tanpa sendi: gaya dorong lebih kecil, momen sudut tinggal separuh, dan momen positif di tengah bentang"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], [2, 3], [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

**Jepit kaki kolom.** Beri joint 1 dan 5 simbol **Jepit**. Gaya dorong naik menjadi 30 kN dan di kaki kolom muncul momen 40 kNm (EduBeam menunjukkan `39,99`, karena kolom sedikit memendek), tetapi momen di sudut tetap 80 kNm. Karena simetri, gaya geser di sendi bernilai nol, jadi setiap separuh balok tetap bekerja sebagai kantilever 4 m dari sudutnya: $q \cdot 4^2/2 = 80$ kNm.

**Dorong ke samping.** Kembali ke tumpuan sendi, lalu tambahkan beban joint `Fx = 10` kN di joint 2. Reaksi tidak lagi simetris: 35 kN dan 45 kN ke atas, 15 kN dan 25 kN horizontal. Periksa dengan tiga persamaan yang sama dan $M_3 = 0$; beban di joint 2 tidak memiliki lengan momen terhadap joint 3. Momen di sudut kiri berkurang menjadi −60 kNm, dan separuh kiri balok sekarang mendapat sedikit momen positif, 1,25 kNm pada jarak 0,5 m dari sendi.

::model-figure{caption="Beban horizontal 10 kN di joint 2: sudut kanan sekarang memikul 100 kNm"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
  - { node: 2, fx: 10 }
results: [M, N]
show: [nodeLabels]
---
::

**Tambahkan sendi kedua.** Centang juga sendi awal elemen 2, di joint 2. Dua sendi di balok di atas dua kolom bertumpuan sendi membentuk mekanisme. EduBeam tidak menampilkan hasil, melainkan melaporkan *Sendi di joint 2, 3 membuat struktur dapat bergerak.*, lalu menganimasikan gerakannya.

## Langkah selanjutnya {#next-steps}

::card-grid{cols="2"}
:::card{title="Latihan soal: portal tiga sendi" icon="lucide:dices" to="/id/practice?p=H2048"}
Portal yang sama dengan beban baru, termasuk dorongan horizontal, dengan jawaban Anda langsung diperiksa. Mulai dengan H2048; untuk soal lain, biarkan hanya **Portal tiga sendi** yang terpilih dan tekan **Soal baru**.
:::
:::card{title="Berikutnya: rangka batang bidang" icon="lucide:git-fork" to="/id/tutorials/truss"}
Sembilan batang bersendi: metode titik simpul, metode potongan, batang tanpa gaya, dan lendutan dengan kerja virtual.
:::
::
