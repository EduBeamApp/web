---
description: "Tutorial: susun rangka batang bidang di EduBeam, periksa gaya batang dengan metode titik simpul dan potongan, temukan batang tanpa gaya, dan hitung lendutan. Sekitar 20 menit."
source: site
---

# Tutorial: rangka batang bidang

Susun rangka batang kecil yang statis tertentu dari batang bersendi, periksa gaya batangnya dengan metode titik simpul dan metode potongan, lalu periksa lendutannya dengan kerja virtual.

- **Waktu:** sekitar 20 menit.
- **Yang diperlukan:** EduBeam terbuka di tab kedua browser, di komputer dengan mouse dan keyboard. Jika Anda belum pernah memakai EduBeam, kerjakan dulu [Mulai cepat](/id/guide/quick-start) atau salah satu tutorial sebelumnya.
- **Bekal:** metode titik simpul dan metode potongan. Pemeriksaan lendutan (opsional) memakai metode beban satuan (kerja virtual).
- **Satuan:** SI. Label satuan di kanan bawah tampilan harus menunjukkan `m m² kN kNm MPa`. Jika yang tampil ft dan kip, klik label itu dan setel **Sistem satuan** ke **SI (metrik)**.

**Yang akan Anda pelajari**

- memodelkan batang rangka sebagai elemen balok dengan sendi di kedua ujung, digambar dengan mouse,
- memeriksa gaya batang dengan metode titik simpul dan metode potongan,
- mengenali batang tanpa gaya dan memahami mengapa model dengan sambungan sendi cocok untuk rangka batang.

::div{.actions}
[Buka EduBeam ↗](https://run.edubeam.app/?lang=id){target="_blank"} [Langsung ke pemeriksaan manual](#_5-check-by-hand)
::

::model-figure{caption="Rangka batang yang sudah selesai: 30 kN di joint 2 dan 3, gaya batang dengan tarik bernilai positif"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N, w]
show: [nodeLabels, dimensions]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Soal {#the-problem}

- Bentang 12 m terbagi menjadi tiga panel 4 m, tinggi rangka 3 m: joint batang bawah 1 sampai 4, joint batang atas 5 dan 6.
- Tumpuan sendi di joint 1 dan tumpuan rol di joint 4.
- Dua beban 30 kN di joint batang bawah 2 dan 3.
- Batang baja, $E = 210$ GPa, $A = 20$ cm².

| Elemen | Batang (menurut joint) | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | batang bawah |
| 4, 5, 6 | 1–5, 5–6, 6–4 | diagonal ujung, batang atas, diagonal ujung |
| 7, 8, 9 | 2–5, 5–3, 3–6 | batang vertikal, diagonal tengah, batang vertikal |

**Statis tertentu?** Dengan $m = 9$ batang, $r = 3$ reaksi, dan $j = 6$ joint, $m + r = 12 = 2j$. Setiap joint memberi dua persamaan keseimbangan, jadi semua gaya batang dapat dihitung dari statika saja.

## Buat model {#model-it}

::div{.steps}

### Material dan penampang {#_1-material-and-section}

1. Klik **Hapus model** di bilah aplikasi, centang **Hapus material** dan **Hapus penampang**, lalu klik **Konfirmasi**. Penomoran joint dan elemen kembali mulai dari 1.
2. Tab **Material** → **Pustaka material** → **+** pada baris **Baja (S235)**, lalu tutup pustaka dengan **Batal**.
3. Tab **Penampang** → **Tambah penampang**. Ketik `0.002` di **Luas** dan `1e-6` di **Iy**, biarkan **Tinggi** dan **Koefisien geser** bernilai `1`, lalu klik **Tambah penampang**.

Pada batang yang bersendi di kedua ujung, hanya luas yang berpengaruh; $I_y$ cukup bernilai positif.

### Gambar batang dengan sendi {#_2-draw-the-bars-with-hinges}

Batang rangka di EduBeam adalah elemen balok dengan **kedua sendi ujung** dicentang. Saat menggambar dengan mouse, EduBeam dapat mencentangnya untuk Anda, dan urutan menggambar menentukan nomor batang pada tabel di atas.

1. Tab **Elemen** → tombol **Tambah elemen** yang kedua, yang berikon kursor.
2. Pada bilah yang muncul di bagian atas tampilan, centang **Sendi awal** dan **Sendi akhir**. Setiap batang yang Anda gambar sekarang mendapat kedua sendi itu.
3. Batang bawah: klik (0, 0), (4, 0), (8, 0), dan (12, 0), lalu tekan <kbd>Esc</kbd>.
4. Bagian atas: klik lagi tombol **Tambah elemen**, lalu klik joint 1 di (0, 0), titik (4, −3) dan (8, −3), dan joint 4 di (12, 0). Mengeklik joint yang sudah ada menyambungkan batang ke joint itu, tanpa membuat joint baru. Tekan <kbd>Esc</kbd>.
5. Diagonal dan batang vertikal: sekali lagi klik **Tambah elemen**, lalu joint 2 di (4, 0), joint 5 di (4, −3), joint 3 di (8, 0), dan joint 6 di (8, −3). Tekan <kbd>Esc</kbd>, lalu <kbd>F</kbd> agar seluruh model tampak di layar.

Tabel **Elemen** sekarang harus berisi sembilan elemen seperti pada tabel di atas, masing-masing dengan kedua kotak **Sendi ujung** tercentang. <kbd>Esc</kbd> mengakhiri mode menggambar, tetapi kedua kotak sendi di bilah atas tetap tercentang untuk berikutnya.

### Tumpuan dan beban {#_3-supports-and-loads}

1. Klik joint 1 → **Tumpuan joint** → simbol **Sendi**. Beri joint 4 tumpuan **Rol**.
2. Klik joint 2 → **Tambah beban** → `Fz = 30` → **Tambah beban joint**. Lakukan hal yang sama di joint 3.

`Fz` positif mengarah ke bawah. Semua batang yang bertemu di sebuah joint bersendi, jadi tidak ada yang menahan rotasi joint itu; EduBeam menerima keadaan ini dan melaporkan rotasi joint tersebut sebagai 0.

::

## Hasil {#_4-results}

Pada opsi tampilan di kanan atas (ikon roda gigi menampilkan dan menyembunyikannya), hapus centang **Bentuk deformasi** dan **M<sub>y</sub> (x)**, karena pada rangka batang tidak ada lentur, lalu centang **N (x)**. Tarik bernilai positif, dan EduBeam menampilkan gaya dalam kN dengan dua desimal.

- Kedua tumpuan menunjukkan `30,00` ke atas; reaksi horizontal tumpuan sendi menunjukkan `0,00`, karena tidak ada beban horizontal.
- Ketiga batang bawah menunjukkan `40,00`, yaitu tarik; batang atas `-40,00`, yaitu tekan.
- Diagonal tengah 5–3 tidak memikul gaya, sehingga tidak berlabel, seperti pada gambar di atas.
- Tab **Hasil** → **Hasil joint**: joint 2 turun sebesar $D_z$ = `2,2937 · 10⁻³ m`, yaitu 2,294 mm.

## Periksa secara manual {#_5-check-by-hand}

**Reaksi.** Bebannya simetris, jadi $R_1 = R_4 = 30$ kN ke atas, dan karena tidak ada beban horizontal, reaksi horizontal di tumpuan sendi bernilai nol.

**Joint 1** (metode titik simpul). Diagonal ujung 1–5 panjangnya 5 m, jadi $\sin\alpha = 3/5$ dan $\cos\alpha = 4/5$:

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**Joint 2.** Batang vertikal 2–5 adalah satu-satunya batang yang dapat menyalurkan beban 30 kN ke atas: $N_{25} = +30$ kN, dan $N_{23} = N_{12} = 40$ kN.

**Potongan melalui panel tengah** (metode potongan). Potong batang 5–6, 5–3, dan 2–3, lalu tinjau bagian kiri:

- Momen terhadap joint 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Gaya vertikal: gaya geser di panel ini adalah $R_1 - 30 = 0$, jadi diagonal tengah **5–3 tidak memikul gaya**: $N_{53} = 0$.

| Batang | Perhitungan manual | EduBeam |
| --- | --- | --- |
| Batang bawah 1–2, 2–3, 3–4 | +40 kN, tarik | 40,00 |
| Batang atas 5–6 | −40 kN, tekan | −40,00 |
| Diagonal ujung 1–5, 6–4 | −50 kN | −50,00 |
| Batang vertikal 2–5, 3–6 | +30 kN | 30,00 |
| Diagonal tengah 5–3 | 0 | tanpa label |

Batang tanpa gaya bukan batang yang tidak berguna: batang itu tidak memikul apa pun di bawah beban *ini*, tetapi jika dihilangkan, rangka batang runtuh, seperti yang ditunjukkan percobaan di bawah.

::callout{type="details" title="Lendutan joint 2 dengan kerja virtual"}
Pasang beban satuan ke bawah di joint 2 dan hitung lagi rangka batangnya secara manual: $R_1 = 2/3$, $R_4 = 1/3$, dan gaya batang $n$ seperti di bawah. Lendutannya adalah $\delta = \sum N\,n\,L / (EA)$:

| Batang | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
| --- | --- | --- | --- | --- |
| 1–2 | 40 | 8/9 | 4 | 142,2 |
| 2–3 | 40 | 8/9 | 4 | 142,2 |
| 3–4 | 40 | 4/9 | 4 | 71,1 |
| 1–5 | −50 | −10/9 | 5 | 277,8 |
| 5–6 | −40 | −4/9 | 4 | 71,1 |
| 6–4 | −50 | −5/9 | 5 | 138,9 |
| 2–5 | 30 | 1 | 3 | 90,0 |
| 5–3 | 0 | −5/9 | 5 | 0 |
| 3–6 | 30 | 1/3 | 3 | 30,0 |
| | | | jumlah | 963,3 |

$$
\delta_2 = \frac{963{,}3}{EA} = \frac{963{,}3}{210 \times 10^6 \cdot 0{,}002} = 0{,}002294\ \text{m}
$$

Hasilnya 2,294 mm, sama dengan $D_z$ joint 2 di EduBeam, `2,2937 · 10⁻³` m.
::

## Bereksperimen {#_6-experiment}

Ubah satu hal saja setiap kali, perkirakan hasilnya, lalu periksa di layar. <kbd>Ctrl</kbd>+<kbd>Z</kbd> membatalkan setiap perubahan.

**Pindahkan satu beban.** Letakkan kedua beban di joint 2: hapus beban di joint 3 dan ubah beban yang lain menjadi `Fz = 60`. Sekarang $R_1 = 40$ kN, gaya geser di panel tengah menjadi $40 - 60 = -20$ kN, dan diagonal tengah harus memikulnya: $N_{53} = -20 \cdot 5/3 = -33{,}33$ kN, yaitu tekan.

::model-figure{caption="60 kN di joint 2: diagonal tengah 5–3 sekarang memikul gaya geser panel"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 60 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

**Hapus diagonal tengah.** Hapus elemen 8. Panel tengah menjadi segi empat bersendi yang dapat bergeser ke samping. EduBeam tidak menampilkan hasil, melainkan melaporkan *Sendi di joint 2, 3, 5, 6 membuat struktur dapat bergerak.*, yaitu keempat sudut panel itu, lalu menganimasikan gerakannya.

**Hapus centang semua sendi** di tabel **Elemen**. Rangka batang menjadi portal dengan joint kaku. Centang **M<sub>y</sub> (x)**: momen lenturnya tetap di bawah 0,1 kNm, dan gaya normal berubah kurang dari 0,1%. Itulah sebabnya idealisasi sambungan sendi dapat dipakai untuk rangka batang yang tersusun dari segitiga.

**Pasang tumpuan sendi di kedua ujung.** Reaksi keempat membuat rangka batang statis tak tentu berderajat satu, dan hasilnya mungkin mengejutkan Anda: batang bawah sekarang **tidak memikul gaya sama sekali**, dan sebagai gantinya setiap tumpuan mendorong ke dalam sebesar 40 kN. Joint 1 dan 4 tidak dapat saling menjauh, jadi ketiga batang bawah di antara keduanya, yang terletak segaris, harus memiliki total perpanjangan nol. Ketiganya memikul gaya yang sama, jadi gaya itu nol, dan gaya 40 kN itu kini dipikul tumpuan. Hal ini berlaku berapa pun luas batangnya.

::model-figure{caption="Tumpuan sendi di kedua ujung: tumpuan mengambil alih tugas batang bawah"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: pin }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Langkah selanjutnya {#next-steps}

Teori di balik elemen batang ada di [Elemen rangka batang](/id/elements/truss).

::card-grid{cols="2"}
:::card{title="Latihan soal: rangka batang Warren" icon="lucide:dices" to="/id/practice?p=T2048"}
Reaksi dan gaya pada satu batang dari rangka batang yang lebih besar, dengan jawaban Anda langsung diperiksa. Mulai dengan T2048; untuk soal lain, biarkan hanya **Rangka batang Warren** yang terpilih dan tekan **Soal baru**.
:::
:::card{title="Berikutnya: balok menerus dan penurunan tumpuan" icon="lucide:spline" to="/id/tutorials/continuous-beam"}
Balok statis tak tentu: apa keuntungan kontinuitas, apa akibat penurunan tumpuan, dan metode gaya untuk memeriksa keduanya.
:::
::
