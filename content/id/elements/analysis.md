---
description: "Metode kekakuan langsung seperti dijalankan EduBeam, dihitung manual pada balok jepit–rol: penomoran DOF, perakitan, tumpuan, reaksi, dan hasil batang."
source: site
---

# Cara EduBeam menghitung model

Setiap kali Anda mengubah model, EduBeam menghitungnya ulang dengan **metode kekakuan langsung**, di browser Anda, dalam beberapa milidetik. Halaman ini mengikuti solver [@edubeam/fem](/id/solver) langkah demi langkah pada sebuah contoh kecil, sehingga Anda dapat mereproduksi setiap angka secara manual dan memahami mengapa hasilnya dapat dipercaya.

Contohnya adalah balok jepit–rol: profil baja IPE 300, panjang 4 m, terjepit di A, bertumpu pada rol di B, dengan beban merata 10 kN/m. Kekakuan lenturnya $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm². Tanpa deformasi geser, rumus buku teks memberikan $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN, dan $\varphi_B = qL^3/(48EI)$.

::model-figure{caption="Balok jepit–rol, IPE 300, 10 kN/m: M = −20 kNm di A dan +11,25 kNm pada jarak 2,5 m, reaksi 25 kN dan 15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
section: { a: 53.8e-4, iy: 8.356e-5, h: 0.3 }
results: [M, V, w]
show: [nodeLabels]
---
::

## Dari model ke perpindahan {#from-model-to-displacements}

::div{.steps}
### Menomori derajat kebebasan {#number-the-degrees-of-freedom}

Setiap joint mendapat DOF yang dibutuhkan elemen-elemennya. Semua elemen adalah [elemen balok](/id/elements/beam), sehingga setiap joint memiliki `Dx`, `Dz`, dan `Ry`. Solver menomori DOF **bebas** lebih dulu, lalu DOF yang **ditahan**, joint demi joint. Di sini A terjepit dan B hanya ditahan secara vertikal, sehingga ada dua DOF bebas:

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$, dan $\varphi$ adalah perpindahan searah x dan z serta rotasi, seperti pada [tabel DOF](/id/elements/conventions#degrees-of-freedom). Setiap elemen memiliki **nomor kode**: posisi keenam DOF-nya di dalam $\mathbf{r}$. Dengan penomoran mulai dari 1, DOF balok $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ berada di posisi $(3, 4, 5, 1, 6, 2)$.

### Menghitung matriks elemen {#compute-the-element-matrices}

Untuk setiap elemen, solver menyusun [matriks kekakuan lokal](/id/elements/beam#local-stiffness-matrix), mengondensasi [sendi ujung](/id/elements/beam#end-hinges) jika ada, lalu mengubahnya ke sumbu global, $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Setiap beban elemen diubah menjadi [beban joint ekuivalen](/id/elements/beam#element-loads), $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Balok dalam contoh ini horizontal, sehingga $\mathbf{T}$ adalah matriks identitas, dan beban merata memberikan, dalam kN dan kNm,

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13{,}33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13{,}33 \end{bmatrix}.
$$

### Merakit {#assemble}

Matriks kekakuan global $\mathbf{K}$ mula-mula berisi nol. Setiap elemen menambahkan sukunya $(i, j)$ ke baris dan kolom matriks global yang ditunjukkan nomor kodenya untuk $i$ dan $j$, sehingga di joint tempat beberapa elemen bertemu, kekakuan elemen-elemen itu untuk DOF joint tersebut dijumlahkan. Vektor beban $\mathbf{F}$ mengumpulkan beban joint dan beban joint ekuivalen dengan cara yang sama. Perpindahan yang ditetapkan (penurunan tumpuan) dimasukkan ke $\mathbf{r}_p$. Dengan urutan DOF bebas lalu DOF yang ditahan, sistem persamaan terbagi menjadi blok-blok:

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

dengan $\mathbf{R}$ reaksi yang belum diketahui. Dalam contoh ini, hanya baris dan kolom balok untuk ujung B yang masuk ke $\mathbf{K}_{uu}$:

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13{,}33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### Menerapkan tumpuan dan menyelesaikan {#apply-the-supports-and-solve}

Tumpuan tidak dimodelkan sebagai pegas atau angka besar di diagonal: DOF yang ditahan cukup dipisahkan. Perpindahan bebas diperoleh dari

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

yang diselesaikan dengan dekomposisi LU. Tanpa penurunan tumpuan, $\mathbf{r}_p = \mathbf{0}$, dan di sini

$$
\varphi_B = \frac{13{,}33}{17\,548} = 7{,}598 \times 10^{-4} \text{ rad},
$$

yang sama dengan rumus buku teks $qL^3/(48EI)$, dan $u_B = 0$.

### Menghitung reaksi {#compute-the-reactions}

Setelah semua perpindahan diketahui, baris DOF yang ditahan memberikan reaksi, yaitu gaya yang diberikan tumpuan pada struktur:

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

Untuk $w_A$, baris $\mathbf{K}_{pu}$ memuat $-6EI/L^2$ di kolom $\varphi_B$, dan $\mathbf{F}_p$ memuat $qL/2$:

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

yaitu 25 kN ke atas (z mengarah ke bawah). Dengan cara yang sama diperoleh $R_{\varphi A} = +20$ kNm dan $R_{wB} = -15$ kN: rumus buku teks $qL^2/8$ dan $3qL/8$.
::

## Hasil di sepanjang batang {#results-along-the-members}

Untuk setiap elemen, solver mengambil perpindahan ujungnya dari $\mathbf{r}$, mengubahnya ke sumbu lokal, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, dan menghitung [gaya ujung](/id/elements/conventions#end-forces-element-results-table)

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

Dalam contoh ini, $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ memberikan $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN, dan $M_{21} = 0$.

Gaya dalam di sembarang $x$ kemudian diperoleh dari keseimbangan potongan elemen antara ujung awalnya dan titik $x$: gaya di ujung awal ditambah beban pada potongan itu.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

dengan $N_q$, $V_q$, dan $M_q$ berasal dari beban pada potongan tersebut. Untuk beban merata $q_z$, beban trapesium dari $q_1$ ke $q_2$ (dengan $\Delta q = q_2 - q_1$), serta gaya $F_z$ atau momen $M_y$ pada jarak $a$, yang baru bekerja untuk $x \ge a$:

$$
\begin{array}{l|cc}
\text{Beban} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ sama dengan $V_q$, dengan komponen aksial $q_x$ dan $F_x$ menggantikan $q_z$ dan $F_z$.

Untuk contoh ini, $M(x) = -20 + 25\,x - 5\,x^2$ kNm, maksimum di $x = 2{,}5$ m dengan nilai $11{,}25$ kNm $= 9qL^2/128$. Beban suhu tidak memiliki suku sendiri: beban ini hanya bekerja melalui gaya ujung.

Lendutan adalah [fungsi bentuk](/id/elements/beam#local-stiffness-matrix) dikalikan perpindahan ujung, ditambah lendutan akibat beban pada elemen yang terjepit di kedua ujung. Ujung bersendi lebih dulu mendapatkan kembali rotasinya sendiri dari [kondensasi](/id/elements/beam#end-hinges). Diagram dan bentuk deformasi tidak lain adalah fungsi-fungsi ini, yang nilainya dihitung di sepanjang setiap batang.

## Mengapa hasilnya eksak {#exact}

Setiap langkah di atas eksak untuk model yang dihitung:

- Kekakuan elemen berasal dari **solusi eksak** batang Timoshenko prismatis, bukan dari bentuk polinomial yang diasumsikan, sehingga sama dengan kekakuan batang yang sebenarnya.
- Gaya ujung jepit adalah solusi eksak elemen terjepit untuk setiap tipe beban, sehingga tidak ada yang hilang saat beban diubah menjadi beban joint ekuivalen.
- Karena itu, perpindahan joint eksak, dan gaya dalam di antara joint diperoleh dari keseimbangan dengan beban yang sebenarnya, sehingga juga eksak.

Itulah sebabnya EduBeam tidak pernah meminta Anda memperhalus jaring elemen: satu elemen per batang memberikan jawaban yang sama dengan seratus elemen. Joint hanya diperlukan di tempat batang itu sendiri berubah: di tumpuan, sendi, sudut, atau perubahan penampang. Beban terpusat di antara joint dapat tetap menjadi beban elemen. Satu-satunya galat yang tersisa adalah galat pembulatan aritmetika titik mengambang; tabel hasil menampilkan nilai yang lebih kecil daripada $10^{-12}$ kali nilai terbesar sejenisnya sebagai 0.

“Eksak” di sini berlaku untuk model, dan model itu memiliki batasan:

::div{.limits}
- **Material elastis linear** dan **perpindahan kecil**: keseimbangan ditulis pada bentuk yang belum berdeformasi, sehingga tidak ada efek orde kedua (P–Δ) ataupun tekuk.
- **Batang lurus dan prismatis**: satu penampang per elemen. Batang dengan penampang yang berubah (meruncing) harus didekati dengan beberapa elemen.
- **Lentur hanya pada bidang x–z**: tanpa torsi dan tanpa perilaku di luar bidang.
::

## Jika struktur tidak dapat berdiri {#mechanisms}

Struktur yang dapat bergerak tanpa berdeformasi memiliki matriks kekakuan singular dan tidak memiliki solusi tunggal. EduBeam memeriksa hal ini sebelum menghitung, lalu memeriksa jawabannya setelah menghitung:

1. **Sebelum menghitung**, setiap bagian struktur yang saling terhubung diperiksa berdasarkan geometrinya saja. Tumpuannya harus mencegah tiga gerak benda kaku pada bidang: kurang dari tiga kekangan berarti model memang belum selesai (*Struktur memerlukan tumpuan sebelum dapat dihitung.*), sedangkan tiga kekangan atau lebih yang tetap membiarkannya bergeser atau berputar, mis. beberapa tumpuan rol yang sejajar, merupakan kesalahan. Kemudian sendi diperiksa: jika batang-batang dapat berputar terhadap sendi sementara setiap batang tetap mempertahankan panjangnya, struktur merupakan mekanisme, dan EduBeam melingkari sendi tersebut dan menunjukkan gerakannya.
2. **Saat menghitung**, matriks yang benar-benar singular menghentikan dekomposisi LU: *Struktur adalah mekanisme: matriks kekakuan singular.*
3. **Setelah menghitung**, perpindahan atau rotasi yang lebih besar daripada $10^6$ m atau rad berarti matriksnya singular, hanya tersamarkan oleh galat pembulatan. EduBeam menyebutkan joint dan arah yang bergerak: *Struktur tidak stabil: … bergerak praktis tanpa hambatan.* Material atau penampang yang dimasukkan sebagai nol, atau dalam satuan yang salah, juga berujung pada kasus ini.

Rotasi yang tidak terhubung ke apa pun, di joint tempat semua batang bersendi, bukanlah mekanisme: solver membiarkannya nol. Halaman [Pemecahan masalah](/id/reference/troubleshooting#no-results-are-drawn) menjelaskan setiap pesan dan cara mengatasinya.

## Jalankan solver sendiri {#library}

Solver ini bersifat sumber terbuka (open-source): [@edubeam/fem](/id/solver), ditulis dalam TypeScript, untuk browser dan Node. Balok jepit–rol yang sama:

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// Satuan SI: m, N, Pa. Baja, IPE 300; k = 1e32 membuatnya kaku geser.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // jepit
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // rol
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, ke bawah

solver.solve()

solver.neq // 2: Dx dan Ry di B bebas
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: DOF bebas, lalu DOF yang ditahan
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), lalu B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, momen negatif di jepit
beam.computeBendingMomentAt(lc, 2.5) // 11250: momen positif terbesar
```

Setelah `solve()`, `solver.k` berisi matriks $\mathbf{K}$ yang telah dirakit dan `solver.f` berisi vektor beban $\mathbf{F}$, untuk dibandingkan dengan hasil perakitan Anda sendiri. Langkah-langkah di halaman ini ada di `Solver.ts` (penomoran), `LinearStaticSolver.ts` (perakitan, penyelesaian, reaksi), dan `Beam2D.ts` (matriks elemen dan hasil).

::div{.actions}
[Mulai dengan @edubeam/fem](/id/solver/getting-started) [Isi pustaka](/id/solver/reference) [Kode sumber di GitHub ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
