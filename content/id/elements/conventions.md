---
description: "Konvensi tanda EduBeam: x ke kanan dan z ke bawah, beban dan perpindahan positif, sumbu lokal, N, V, dan M, gaya ujung, reaksi, serta opsi y ke atas."
source: site
---

# Sistem koordinat & konvensi tanda

Setiap angka yang ditampilkan EduBeam memiliki tanda. Halaman ini menjelaskan arti *positif* untuk koordinat, beban, perpindahan, gaya dalam, gaya ujung, dan reaksi, sehingga Anda dapat membandingkan aplikasi dengan perhitungan Anda sendiri. Sebagian besar hasil yang tampak salah ternyata hanya soal konvensi tanda.

| Besaran | Positif |
| --- | --- |
| `x`, `Dx`, `Fx` | ke kanan |
| `z`, `Dz`, `Fz` | **ke bawah** |
| `Ry`, `My` | berlawanan arah jarum jam di layar |
| $N$ | tarik |
| $V$ | memutar potongan pendek batang searah jarum jam |
| $M$ | momen positif: serat bawah tertarik, di sisi garis putus-putus |
| Reaksi | gaya yang diberikan tumpuan pada struktur, bertanda seperti beban |

## Sumbu global {#global-axes}

Model terletak pada bidang x–z:

- **x** horizontal, positif ke **kanan**.
- **z** vertikal, positif **ke bawah**.
- **y** mengarah keluar dari layar, ke arah Anda, sehingga sistem koordinatnya mengikuti kaidah tangan kanan. Rotasi dan momen bekerja terhadap sumbu y, sehingga **berlawanan arah jarum jam bernilai positif**.

Simbol sumbu di sudut kanvas menunjukkan x dengan warna merah dan z dengan warna hijau. Karena z mengarah ke bawah, joint di puncak kolom setinggi 3 m yang berdiri di `Z = 0` memiliki `Z = −3`. Sudut, mis. sudut tumpuan miring, diukur dari x ke arah z, yaitu searah jarum jam di layar.

Jika Anda lebih suka y ke atas, ganti [konvensi tampilan](#y-up-axes): modelnya tetap sama, hanya angka yang Anda baca dan ketik yang berubah.

## Derajat kebebasan {#degrees-of-freedom}

Setiap joint memiliki tiga derajat kebebasan (DOF):

| DOF | Arti | Positif | Satuan |
| --- | --- | --- | --- |
| `Dx` | perpindahan horizontal | ke kanan | m |
| `Dz` | perpindahan vertikal | ke bawah | m |
| `Ry` | rotasi | berlawanan arah jarum jam | rad |

Tanda yang sama berlaku untuk [perpindahan yang ditetapkan](/id/essentials/loads#prescribed-displacements-support-settlements), untuk tabel *Hasil joint*, dan untuk nilai yang muncul saat Anda mengarahkan kursor ke sebuah joint.

## Beban {#loads}

Beban bernilai positif searah sumbu positif. **Fx**, **Fz**, dan **My** adalah komponen beban joint atau beban terpusat, **fx** dan **fz** komponen beban merata, dan **f₁x**, **f₂x**, **f₁z**, **f₂z** komponen beban trapesium di awal dan akhir elemen.

| Beban | Arah positif |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, ke kanan; searah x lokal elemen jika **LCS** dicentang |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **ke bawah**; searah z lokal elemen jika **LCS** dicentang |
| `My` | berlawanan arah jarum jam |
| `ΔTc` | pemanasan sumbu batang, yang membuatnya memanjang |
| `ΔTb − ΔTt` | serat bawah lebih panas daripada serat atas |

Jadi beban gravitasi adalah `fz` **positif**, dan angin yang mendorong kolom kiri ke kanan adalah `fx` positif. Beban garis selalu bekerja per meter panjang batang itu sendiri, juga jika beban itu diberikan dalam sumbu global pada batang miring. Halaman [Beban](/id/essentials/loads#element-loads) menunjukkan cara memasukkan setiap tipe beban.

::model-figure{caption="Semua beban di sini positif: fz = 5 kN/m pada A–B, Fz = 10 kN di B, My = 10 kNm di C, dan Fx = 10 kN di D"}
---
nodes: { A: [0, 0], B: [3, 0], C: [4.5, 0], D: [6, 0] }
supports: { A: fixed }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 5 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
  - { node: D, fx: 10 }
results: []
reactions: false
show: [nodeLabels]
---
::

## Sumbu lokal elemen {#element-local-axes}

Setiap elemen memiliki sumbunya sendiri:

- **x lokal** mengarah dari joint awal ke joint akhir elemen;
- **z lokal** adalah x lokal yang diputar 90° **searah jarum jam di layar**, yaitu putaran yang sama seperti dari x global ke z global. Jika Anda berjalan dari joint awal ke joint akhir, z lokal ada di sebelah kanan Anda.

| Elemen digambar | z lokal mengarah |
| --- | --- |
| dari kiri ke kanan | ke bawah: sumbu lokal dan global berimpit |
| dari kanan ke kiri | ke atas |
| dari bawah ke atas | ke kanan |
| dari atas ke bawah | ke kiri |

Arah elemen dinyatakan dengan sudutnya $\theta$, yang diukur dari x global ke arah z global (searah jarum jam di layar). [Matriks transformasi](/id/elements/beam#transformation-matrix) mengubah perpindahan ujung antara kedua sistem dengan $\cos\theta$ dan $\sin\theta$.

Di tampilan, garis putus-putus di sepanjang setiap elemen menandai sisi +z lokalnya: **serat bawah**. Beban elemen dengan **LCS** dicentang, posisi beban terpusat, dan gaya ujung semuanya mengikuti sumbu lokal. Untuk membalik arah elemen, gunakan **Tukar joint** di tabel *Elemen* (lihat [arah elemen](/id/essentials/elements#element-direction)).

## Gaya dalam {#internal-forces}

Potong batang pada jarak $x$ dari joint awalnya. Pada muka bagian **sebelum** potongan, yang normal luarnya mengarah ke +x lokal, gaya dalam positif jika mengarah ke +x lokal, ke +z lokal, dan berlawanan arah jarum jam. Pada muka yang lain, gaya dalam bekerja dengan arah berlawanan.

::element-sketch{mode="internal-forces" caption="N, V, dan M positif pada potongan pendek batang: tarik, sepasang gaya geser yang memutar searah jarum jam, momen positif (serat bawah bergaris putus-putus tertarik)"}
::

Dengan kata lain:

| Besaran | Positif berarti |
| --- | --- |
| $N$ | tarik |
| $V$ | memutar potongan pendek batang searah jarum jam: untuk batang yang digambar dari kiri ke kanan, ke atas di muka kiri potongan dan ke bawah di muka kanannya |
| $M$ | **momen positif**: serat bawah tertarik, di sisi garis putus-putus |

Dengan $q_x$ dan $q_z$ beban garis dalam sumbu lokal, berlaku

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

Di lokasi beban terpusat $F_x$, $F_z$, atau $M_y$ (dalam sumbu lokal), gaya dalam melompat sebesar $\Delta N = -F_x$, $\Delta V = -F_z$, dan $\Delta M = -M_y$: gaya searah +z lokal menurunkan $V$, dan momen berlawanan arah jarum jam menurunkan $M$.

Karena itu, balok sederhana dengan beban gravitasi memiliki momen positif, gaya geser positif di tumpuan kiri, dan gaya geser negatif di tumpuan kanan. Balok di bawah juga ditarik di tumpuan rol, sehingga gaya normalnya positif.

::model-figure{caption="Balok sederhana, 10 kN/m dan tarikan 20 kN: M = +45 kNm di tengah bentang, V = +30 kN di tumpuan kiri dan −30 kN di tumpuan kanan, N = +20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
  - { node: B, fx: 20 }
results: [M, V, N]
---
::

Pada kantilever, tanda momen berbalik: momennya negatif (serat atas tertarik). Dorongan searah sumbunya membuat batang tertekan.

::model-figure{caption="Kantilever dengan beban 10 kN di ujung bebas dan dorongan 15 kN: M = −40 kNm di jepit, V = +10 kN, N = −15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 10 }
  - { member: 1, px: -15, at: 4 }
results: [M, V, N]
---
::

Pada portal, sisi bawah setiap batang adalah sisi +z lokalnya, sehingga urutan joint saat Anda menggambar kolom menentukan sisi mana yang menjadi sisi bawahnya. Portal ini digambar A → B → C → D, sehingga z lokal semua batang mengarah ke dalam: momen positif berarti sisi dalam portal tertarik, dan momen negatif di sudut portal berarti sisi luar tertarik.

::model-figure{caption="Portal yang digambar A → B → C → D: z lokal ketiga batang mengarah ke dalam portal"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

Diagram digambar seperti lazimnya di sebagian besar perkuliahan di Eropa: $M$ di sisi tarik, $N$ dan $V$ positif di sisi yang jauh dari garis putus-putus. **Pengaturan → Pengaturan tampilan → Diagram gaya dalam** dapat memindahkan $M$ ke sisi tekan dan $N$ atau $V$ ke sisi garis putus-putus. Itu hanya mengubah gambar, tidak pernah mengubah nilainya: baca tanda dari label, bukan dari sisi diagram.

## Gaya ujung (tabel Hasil elemen) {#end-forces-element-results-table}

Tabel *Hasil elemen* mencantumkan enam **gaya ujung** untuk setiap elemen, dalam sumbu **lokal** elemen:

::element-sketch{mode="end-forces" caption="Enam gaya ujung, masing-masing digambar positif: searah x dan z lokal, serta berlawanan arah jarum jam"}
::

| Kolom | Bekerja pada elemen di | Positif searah |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | joint awalnya | +x lokal, +z lokal, berlawanan arah jarum jam |
| `X21`, `Z21`, `M21` | joint akhirnya | +x lokal, +z lokal, berlawanan arah jarum jam |

Gaya-gaya ini adalah gaya yang diberikan joint pada elemen: matriks kekakuan elemen dikalikan perpindahan ujungnya, ditambah gaya yang akan menahan beban elemennya jika kedua ujungnya dijepit,

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

dengan $\mathbf{d}_l$ perpindahan ujung elemen dalam sumbu lokal dan $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ beban joint ekuivalen dari [beban elemennya](/id/elements/beam#element-loads).

Gaya ujung mengikuti sumbu, bukan konvensi $N$–$V$–$M$, sehingga di joint awal tandanya terbalik:

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

Untuk balok sederhana di atas: `X12 = −20 kN` dan `X21 = +20 kN` (tarik), `Z12 = Z21 = −30 kN` (kedua tumpuan mendorong ke atas, yaitu ke arah −z), dan `M12 = M21 = 0`.

Di setiap joint, gaya ujung elemen-elemen yang bertemu di sana, setelah diubah ke sumbu global, berjumlah sama dengan beban joint ditambah reaksi. Dengan begitu, keseimbangan joint dapat diperiksa dengan cepat.

## Reaksi {#reactions}

Reaksi adalah gaya atau momen yang diberikan tumpuan **pada struktur**, satu untuk setiap DOF yang ditahan. Tandanya seperti beban: positif searah +x, searah +z (ke bawah), dan berlawanan arah jarum jam. Karena itu, tumpuan yang memikul beban gravitasi memiliki `Rz` **negatif**.

Reaksi dinyatakan dalam sumbu global, atau dalam sumbu joint itu sendiri jika joint memiliki **Sudut LCS joint** ([tumpuan miring](/id/essentials/nodes-supports#inclined-skewed-supports)). Di tampilan, setiap reaksi digambar sebagai panah searah dorongan tumpuan, diberi label besarnya. Nilai bertanda ada di ekspor CSV, sebagai `Rx`, `Rz`, dan `My`.

## Sumbu y ke atas {#y-up-axes}

**Pengaturan → Bahasa & Wilayah → Sistem koordinat → x ke kanan, y ke atas** mengalihkan semua yang Anda ketik dan baca ke sistem buku teks: **x** ke kanan, **y** ke atas, dan **z** ke arah Anda. Model, file yang disimpan, dan gambar tetap sama persis; hanya angka dan hurufnya yang berubah:

| Besaran | x ke kanan, z ke bawah (bawaan) | x ke kanan, y ke atas |
| --- | --- | --- |
| Koordinat vertikal | `Z` | `Y`, tanda berlawanan |
| Beban, perpindahan, reaksi, dan gaya ujung vertikal | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, tanda berlawanan |
| Rotasi dan momen | `Ry`, `My` | `Rz`, `Mz`, tanda sama (positif berlawanan arah jarum jam) |
| Sudut tumpuan | diukur searah jarum jam | diukur berlawanan arah jarum jam, tanda berlawanan |
| Gaya dalam | $N$, $V$, $M$ | sama, dengan tanda yang sama, digambar dengan cara yang sama |

Jadi dalam sistem y ke atas, beban gravitasi adalah `fy` **negatif**, dan puncak kolom setinggi 3 m memiliki `Y = 3`.

## Satuan {#units}

Solver selalu bekerja dalam satuan SI: m, N, Pa, rad, dan K untuk perubahan suhu. Satuan tampilan yang diatur di halaman [Satuan & pengaturan](/id/essentials/units-settings) hanya mengubah apa yang Anda ketik dan baca, tidak pernah mengubah model.
