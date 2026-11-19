---
description: "EduBeam diperiksa dengan rumus buku teks: balok, rangka batang, beban suhu, penurunan tumpuan, serta perbedaan balok Timoshenko dari Euler–Bernoulli."
source: site
---

# Memeriksa hasil secara manual

Jangan memercayai angka yang tidak dapat Anda perkirakan sendiri, setidaknya secara kasar. Di halaman ini, kasus-kasus klasik dari buku teks dihitung secara manual dan dibandingkan dengan [EduBeam]{.edubeam}; hasilnya cocok sampai digit terakhir yang ditampilkan. Tabel memberikan lima angka penting, seperti tab *Hasil* di aplikasi; label pada gambar dibulatkan menjadi empat angka penting. Setiap gambar dihitung langsung di browser Anda; **Buka di EduBeam** memuat model yang sama ke aplikasi, tempat Anda dapat membaca tabelnya, mengubah suatu nilai, dan mengamati apa yang terjadi.

::div{.chips}
- [Balok sederhana](#simply-supported-beam-uniform-load)
- [Kantilever](#cantilever-tip-load)
- [Balok jepit–jepit](#fixed–fixed-beam-uniform-load)
- [Balok jepit–rol](#propped-cantilever-uniform-load)
- [Rangka dua batang](#two-bar-truss)
- [Beban suhu](#temperature-gradient-on-a-simply-supported-beam)
- [Penurunan tumpuan](#prescribed-displacement)
- [Deformasi geser](#shear-deformation)
::

Untuk struktur lengkap yang dikerjakan dari awal sampai akhir, lihat tutorial [portal tiga sendi](/id/tutorials/three-hinged-frame) dan [rangka batang bidang](/id/tutorials/truss). Untuk soal baru yang dikerjakan secara manual, dengan jawaban yang diperiksa begitu Anda mengetiknya, coba halaman [Latihan soal](/id/practice).

## Penampang yang dipakai di sini {#the-section-used-here}

Kecuali disebutkan lain, setiap kasus memakai balok baja dari contoh-contoh di aplikasi: $E = 210$ GPa dan $I_y = 8356$ cm⁴ (IPE 300), sehingga

$$
EI = 210 \times 10^9 \cdot 8{,}356 \times 10^{-5} = 17\,547{,}6\ \text{kNm}^2
$$

Luasnya ($A = 1$ m²) dan koefisien gesernya ($k = 10^{32}$) begitu besar sehingga deformasi aksial dan geser praktis hilang, dan hasilnya persis mengikuti rumus Euler–Bernoulli di buku teks Anda.

::callout{type="info" title="Balok di EduBeam adalah balok Timoshenko"}
Dengan penampang nyata, misalnya dari pustaka penampang, batang juga berdeformasi akibat geser. Lendutan menjadi sedikit lebih besar daripada hasil rumus Euler–Bernoulli, dan pada struktur statis tak tentu gaya dalamnya juga sedikit berubah. Bagian [Deformasi geser](#shear-deformation) di akhir halaman ini menunjukkan seberapa besar, dan cara mematikannya.
::

Di tab *Hasil*, perpindahan dan rotasi mengikuti [sumbu global](/id/elements/conventions#global-axes): D<sub>z</sub> positif berarti ke bawah, R<sub>y</sub> positif berlawanan arah jarum jam, dan perpindahan dalam meter, kecuali Anda mengubah satuannya di [Pengaturan](/id/essentials/units-settings).

## Balok sederhana, beban merata {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, tumpuan sendi di A dan rol di B. Joint C di tengah bentang memungkinkan Anda membaca lendutan di sana; membagi batang dengan sebuah joint tidak mengubah hasil apa pun.

::model-figure{caption="Balok sederhana, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Besaran | Rumus | Nilai |
| --- | --- | --- |
| Reaksi | $qL/2$ | 36 kN |
| Gaya geser di tumpuan | $\pm qL/2$ | +36 kN di A, −36 kN di B |
| Momen tengah bentang | $qL^2/8$ | 54 kNm |
| Rotasi di A | $qL^3/(24EI)$ | 0,0061547 rad, searah jarum jam |
| Lendutan di C | $5qL^4/(384EI)$ | 11,540 mm, ke bawah |

EduBeam menunjukkan nilai yang sama. Di tab *Hasil*, joint A memiliki R<sub>y</sub> = −0,0061547 rad (negatif: searah jarum jam) dan joint C memiliki D<sub>z</sub> = 0,01154 m (positif: ke bawah).

## Kantilever, beban di ujung {#cantilever-tip-load}

$L = 4$ m, jepit di A, $F = 18$ kN ke bawah di ujung bebas B.

::model-figure{caption="Kantilever, 18 kN di ujung"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Besaran | Rumus | Nilai |
| --- | --- | --- |
| Reaksi vertikal | $F$ | 18 kN |
| Momen jepit | $FL$ | 72 kNm, serat atas tertarik: M = −72 kNm |
| Rotasi ujung | $FL^2/(2EI)$ | 0,0082063 rad, searah jarum jam |
| Lendutan ujung | $FL^3/(3EI)$ | 21,883 mm, ke bawah |

Di tab *Hasil*, joint B memiliki R<sub>y</sub> = −0,0082063 rad dan D<sub>z</sub> = 0,021883 m.

## Balok jepit–jepit, beban merata {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, kedua ujung jepit. Balok ini statis tak tentu, jadi penyelesaiannya bergantung pada kekakuan; rumusnya berasal dari syarat kompatibilitas bahwa kedua rotasi ujung sama dengan nol.

::model-figure{caption="Balok jepit–jepit, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Besaran | Rumus | Nilai |
| --- | --- | --- |
| Reaksi | $qL/2$ | 36 kN |
| Momen tumpuan | $qL^2/12$ | 36 kNm, serat atas tertarik: M = −36 kNm |
| Momen tengah bentang | $qL^2/24$ | 18 kNm, serat bawah tertarik |
| Lendutan di C | $qL^4/(384EI)$ | 2,3080 mm, ke bawah |

Menjepit kedua ujung menggeser seluruh diagram momen ke atas sebesar $qL^2/12$: selisih total dari tumpuan ke tengah bentang tetap $qL^2/8 = 54$ kNm, sama seperti pada balok sederhana. Di aplikasi, mulai dari model balok sederhana, ubah kedua tumpuan menjadi **Jepit**, dan amati perubahannya.

## Balok jepit–rol, beban merata {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m, jepit di A dan rol di B.

::model-figure{caption="Balok jepit–rol, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Besaran | Rumus | Nilai |
| --- | --- | --- |
| Reaksi di ujung jepit | $5qL/8$ | 45 kN |
| Reaksi di rol | $3qL/8$ | 27 kN |
| Momen jepit | $qL^2/8$ | 54 kNm, serat atas tertarik: M = −54 kNm |
| Momen positif terbesar | $9qL^2/128$ | 30,375 kNm |
| … di tempat $V = 0$ | $x = 5L/8$ | 3,75 m dari A |
| Rotasi di B | $qL^3/(48EI)$ | 0,0030773 rad, berlawanan arah jarum jam |

EduBeam memberi label pada setiap nilai ekstrem diagram, sehingga puncak momen positif ditandai tepat di tempatnya. Untuk menemukan letaknya, lihat di mana gaya geser bernilai nol: $V(x) = 45 - 12x = 0$ memberikan $x = 3{,}75$ m.

## Rangka dua batang {#two-bar-truss}

Dua batang naik dari tumpuan sendi di A $(0, 0)$ dan B $(4, 0)$ dan bertemu di puncak C $(2, -2)$, 2 m di atasnya. Kedua ujung setiap batang diberi **sendi ujung**, sehingga batang hanya memikul gaya aksial. Beban vertikal $F = 20$ kN bekerja ke bawah di C.

::model-figure{caption="Rangka dua batang, 20 kN di puncak"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

Setiap batang miring 45°. Keseimbangan vertikal joint C, dengan kedua batang memikul gaya yang sama karena simetri:

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14{,}142\ \text{kN}
\end{aligned}
$$

Kedua batang mengalami gaya **tekan**. Setiap tumpuan menerima 10 kN vertikal dan 10 kN horizontal yang mengarah ke dalam: batang-batang mendorong tumpuan saling menjauh. Lapisan **N (x)** dan reaksinya menunjukkan hal yang sama.

## Gradien suhu pada balok sederhana {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0{,}3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. Suhu sisi atas naik 5 K dan suhu sisi bawah turun 5 K, sehingga $\Delta T_b - \Delta T_t = -10$ K dan sumbu batang tidak berubah suhunya ($\Delta T_c = 0$). Balok sederhana bebas melengkung, sehingga **tidak ada gaya dalam**, hanya kelengkungan:

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0{,}3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

Sisi atas memanjang dan sisi bawah memendek, sehingga balok melengkung **ke atas**:

::model-figure{caption="Sisi atas 10 K lebih hangat daripada sisi bawah: balok melengkung ke atas 3,2 mm, tanpa gaya dalam"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| Besaran | Rumus | Nilai |
| --- | --- | --- |
| Lendutan di C | $\kappa L^2/8$ | 3,2 mm, ke atas: D<sub>z</sub> = −0,0032 m |
| Rotasi di A | $\kappa L/2$ | 0,0016 rad, berlawanan arah jarum jam |
| Momen lentur |  | 0 |

Perubahan suhu merata $\Delta T_c$ hanya akan memperpanjang balok, dan rol mengizinkannya: ini pun tidak menimbulkan gaya.

Sekarang tahan rotasi di kedua ujung (tumpuan **Jepit** di A dan **Jepit geser** di B, yang masih membiarkan balok memanjang). Kelengkungan tertahan, dan sebagai gantinya muncul momen konstan di sepanjang bentang:

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547{,}6 \cdot (-4 \times 10^{-4}) = 7{,}019\ \text{kNm}
\end{aligned}
$$

Momen ini positif (serat bawah tertarik): sisi atas yang tertahan ingin memanjang, sehingga akhirnya tertekan.

::model-figure{caption="Balok yang sama dengan kedua rotasi ditahan: momen konstan 7,019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

Beban suhu dimasukkan seperti dijelaskan di [Beban](/id/essentials/loads#temperature-load); tinggi penampang $h$ merupakan bagian dari [penampang](/id/essentials/elements#cross-sections).

## Penurunan tumpuan {#prescribed-displacement}

Ambil [balok jepit–rol](#propped-cantilever-uniform-load) tanpa bebannya, dan biarkan rol di B turun sebesar $w = 10$ mm. Di EduBeam, penurunan ini dimasukkan sebagai **Perpindahan tumpuan** D<sub>z</sub> = 0,01 m di B. Agar ujung kantilever ikut turun, rol harus menariknya ke bawah, dan itu melenturkan balok:

::model-figure{caption="Balok jepit–rol, B turun 10 mm: rol menarik ke bawah dengan gaya 2,437 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| Besaran | Rumus | Nilai |
| --- | --- | --- |
| Gaya di rol | $R = 3EIw/L^3$ | 2,4372 kN, menarik ke bawah |
| Momen jepit | $RL$ | 14,623 kNm, serat atas tertarik: M = −14,623 kNm |
| Rotasi di B | $3w/(2L)$ | 0,0025 rad, searah jarum jam |

Berbeda dengan beban, penurunan tumpuan hanya menimbulkan gaya jika struktur menahannya: di sini, makin kaku balok, makin besar $R$. Balok sederhana akan mengikuti penurunan yang sama sebagai benda kaku, tanpa gaya sama sekali.

Tambahkan kembali beban 12 kN/m, dan hasilnya bersuperposisi: ujung jepit sekarang menerima $45 + 2{,}4372 = 47{,}437$ kN dan $54 + 14{,}623 = 68{,}623$ kNm, dan rol $27 - 2{,}4372 = 24{,}563$ kN. Cara memasukkan penurunan tumpuan dijelaskan di [Beban](/id/essentials/loads#prescribed-displacements-support-settlements).

## Deformasi geser {#shear-deformation}

Elemen balok di EduBeam adalah balok **Timoshenko**: selain lendutan akibat lentur, balok juga melendut akibat geser, sebesar yang ditentukan oleh kekakuan geser penampang $kGA$. Apa yang berubah bergantung pada strukturnya:

- **Statis tertentu**: reaksi dan gaya dalam diperoleh dari keseimbangan saja, sehingga tetap persis sama. Hanya perpindahan yang bertambah. Pada balok sederhana dan kantilever, rotasi penampang juga tetap; di tempat lain, misalnya di ujung overstek, rotasinya juga sedikit berubah.
- **Statis tak tentu**: gaya dalam bergantung pada kekakuan, sehingga ikut sedikit berubah.

### Balok sederhana {#shear-simply-supported}

Balok dari [Mulai cepat](/id/guide/quick-start#_8-check-by-hand) menunjukkan seberapa besar pengaruhnya. Balok itu sama dengan balok sederhana di atas, tetapi dengan penampang nyata, **IPE 200 (perkiraan)** dari pustaka penampang: $I_y = 1943$ cm⁴, $A = 28{,}48$ cm², dan koefisien geser $k = 0{,}3933$ (porsi luas badan), dengan $G = 81$ GPa. Jadi $EI = 4080{,}3$ kNm² dan $kGA = 90\,720$ kN.

| Besaran | Rumus | Nilai |
| --- | --- | --- |
| Rotasi ujung | $qL^3/(24EI)$ | 0,026469 rad |
| Lendutan tengah bentang, lentur | $5qL^4/(384EI)$ | 49,629 mm |
| Lendutan tengah bentang, geser | $qL^2/(8kGA)$ | 0,59524 mm |
| Lendutan tengah bentang, total | jumlah | 50,224 mm, seperti yang ditunjukkan EduBeam |

Bagian geser adalah 1,2% dari total. Rotasi ujung sama dengan nilai Euler–Bernoulli, demikian pula reaksi dan momennya.

### Kantilever: batang pendek {#shear-cantilever}

Untuk kantilever dengan beban $F$ di ujung, ujungnya melendut sebesar $FL^3/(3EI)$ akibat lentur dan $FL/(kGA)$ akibat geser. Perbandingan keduanya adalah

$$
\frac{\text{geser}}{\text{lentur}} = \frac{3EI}{kGA\,L^2}
$$

Dengan IPE 200 yang sama, perbandingan ini 0,84% untuk kantilever 4 m, tetapi 13,5% untuk kantilever 1 m: deformasi geser berpengaruh pada batang yang pendek dan tinggi.

### Balok jepit–rol: gaya dalam ikut berubah {#shear-propped-cantilever}

[Balok jepit–rol](#propped-cantilever-uniform-load) dari IPE 200 adalah struktur statis tak tentu, dan rol sekarang memikul sedikit lebih banyak. Dengan $\beta = 3EI/(kGA\,L^2) = 0{,}0037481$ untuk $L = 6$ m, syarat kompatibilitas di rol memberikan

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27{,}034\ \text{kN}
$$

alih-alih 27 kN, dan momen jepit turun dari 54 menjadi $qL^2/2 - R_B L = 53{,}798$ kNm. Selisih ini kecil, tetapi makin besar seiring $\beta$, yaitu pada batang yang pendek dan tinggi.

### Membandingkan dengan Euler–Bernoulli {#shear-switch-off}

Untuk membandingkan dengan rumus Euler–Bernoulli, isi **Koefisien geser** penampang dengan nilai yang sangat besar, misalnya `1e10`. Bagian geser pun hilang, dan setiap kasus di halaman ini kembali cocok. Formulasi elemennya ada di [manual teori](/id/elements/beam).

## Tips untuk pemeriksaan sendiri {#tips-for-your-own-checks}

- Biarkan **label satuan** di kanan bawah tampilan tetap terlihat; sebagian besar selisih berasal dari kekeliruan satuan.
- Baca angka eksak dari tab **Hasil** dan dari tooltip saat kursor diarahkan, bukan dari label diagram. **Ekspor CSV** atau **Salin** juga memberikan reaksi, siap untuk spreadsheet. Lihat [Hasil & diagram](/id/essentials/results#results-tab).
- Atur **Format angka** ke *Otomatis* di Pengaturan untuk membaca `40` alih-alih `4 · 10¹`.
- Gunakan jendela **Matriks kekakuan** untuk membandingkan satu elemen dengan [manual teori](/id/elements/beam) saat mempelajari metode kekakuan langsung.
- Gunakan **Bagikan model** untuk menyerahkan model yang sudah diperiksa kepada rekan atau dosen.
- Untuk memeriksa banyak kasus sekaligus, atau membuat soal latihan dengan jawaban yang diketahui, jalankan solver yang sama dari kode: [@edubeam/fem](/id/solver) adalah pustaka di balik setiap angka di aplikasi.
