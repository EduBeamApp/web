---
description: "Elemen balok Timoshenko dua joint di EduBeam: matriks kekakuan eksak, deformasi geser, sendi ujung lewat kondensasi statis, gaya ujung jepit, transformasi."
source: site
---

# Elemen balok

Setiap batang di EduBeam, entah balok, kolom, atau batang rangka, adalah elemen yang sama: **balok Timoshenko** lurus dengan dua joint pada bidang x–z dan penampang konstan. Halaman ini menyajikan formulasinya persis seperti yang dihitung solver, sehingga Anda dapat menyusun ulang matriks elemen atau vektor beban mana pun secara manual dan membandingkannya dengan aplikasi. Tandanya mengikuti halaman [Sistem koordinat & konvensi tanda](/id/elements/conventions), kodenya ada di `Beam2D.ts` dalam [@edubeam/fem](/id/solver), dan halaman [Cara EduBeam menghitung model](/id/elements/analysis) menunjukkan bagaimana elemen-elemen itu dirakit menjadi satu penyelesaian.

## Derajat kebebasan {#degrees-of-freedom}

Setiap joint memiliki tiga derajat kebebasan (DOF), sehingga elemen memiliki enam. Dalam [sumbu lokal](/id/elements/conventions#element-local-axes) elemen, setiap perpindahan ujung berpasangan dengan satu [gaya ujung](/id/elements/conventions#end-forces-element-results-table), yaitu satu kolom tabel *Hasil elemen*:

::element-sketch{mode="dofs" caption="Enam derajat kebebasan elemen balok, masing-masing digambar positif; garis putus-putus menandai serat bawah (+z lokal)"}
::

| Arah | Joint awal (1) | Joint akhir (2) |
| --- | --- | --- |
| searah x lokal | $u_1$ dan `X12` | $u_2$ dan `X21` |
| searah z lokal, ke bawah untuk elemen yang digambar dari kiri ke kanan | $w_1$ dan `Z12` | $w_2$ dan `Z21` |
| rotasi, berlawanan arah jarum jam | $\varphi_1$ dan `M12` | $\varphi_2$ dan `M21` |

Dengan urutan ini, besaran-besaran tersebut membentuk vektor perpindahan dan vektor gaya elemen:

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

Karena z mengarah ke bawah dan rotasi positif berlawanan arah jarum jam, sumbu balok tanpa deformasi geser berputar sebesar $\varphi = -\,\mathrm{d}w/\mathrm{d}x$.

## Matriks kekakuan lokal {#local-stiffness-matrix}

Gaya ujung elemen tanpa beban elemen adalah $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$, dengan

$$
\mathbf{K}_l =
\begin{bmatrix}
 k_N & 0 & 0 & -k_N & 0 & 0 \\
 0 & k_1 & -k_2 & 0 & -k_1 & -k_2 \\
 0 & -k_2 & k_3 & 0 & k_2 & k_4 \\
 -k_N & 0 & 0 & k_N & 0 & 0 \\
 0 & -k_1 & k_2 & 0 & k_1 & k_2 \\
 0 & -k_2 & k_4 & 0 & k_2 & k_3
\end{bmatrix}
$$

dan

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ dan $G$ adalah modulus elastisitas dan modulus geser material, $A$ luas penampang, $I_y$ momen inersia terhadap sumbu y, $k$ **Koefisien geser** penampang, dan $L$ panjang elemen. $\Phi$ adalah **parameter geser**: besaran ini mengukur seberapa mudah batang berdeformasi akibat geser dibandingkan akibat lentur, dan nilainya makin besar jika batang makin pendek dan tinggi. Dengan $\Phi = 0$, suku-sukunya menjadi $12EI/L^3$, $6EI/L^2$, $4EI/L$, dan $2EI/L$ yang sudah dikenal dari balok Euler–Bernoulli. Perilaku aksial dan lentur tidak saling bergantung: $u_1$ dan $u_2$ hanya berhubungan dengan $k_N$.

Buku teks yang memakai sumbu y ke atas menuliskan $+6EI/L^2$ di tempat matriks ini memuat $-k_2$. Keduanya menggambarkan kekakuan yang sama; yang berbeda hanya arah perpindahan transversalnya.

::callout{type="details" title="Asal matriks ini: fungsi bentuk eksak"}
Untuk batang Timoshenko prismatis tanpa beban, persamaan keseimbangan memiliki solusi eksak: $u$ linear terhadap $x$, $w$ kubik, dan $\varphi$ kuadratik. Jika dinyatakan dengan perpindahan ujung, dengan $\xi = x/L$, lendutannya adalah

$$
w(\xi) = N_1\,w_1 + N_2\,\varphi_1 + N_3\,w_2 + N_4\,\varphi_2,
$$

$$
\begin{aligned}
N_1 &= \frac{(1-\xi)\,(1+\Phi+\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_2 &= -\frac{L\,\xi\,(1-\xi)\,(2+\Phi-2\xi)}{2\,(1+\Phi)}, \\[1ex]
N_3 &= \frac{\xi\,(\Phi+3\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_4 &= \frac{L\,\xi\,(1-\xi)\,(\Phi+2\xi)}{2\,(1+\Phi)}.
\end{aligned}
$$

Untuk $\Phi = 0$, fungsi-fungsi ini adalah polinomial Hermite kubik, $N_1 = 1 - 3\xi^2 + 2\xi^3$ dan $N_2 = -L\,\xi(1-\xi)^2$; tanda minusnya berasal dari $\varphi = -w'$. Matriks kekakuan memuat gaya ujung yang diperlukan oleh bentuk eksak ini, sehingga matriks tersebut adalah kekakuan eksak batang, bukan pendekatan yang makin baik jika jumlah elemen ditambah. Solver menggambar bentuk deformasi dengan fungsi yang sama.
::

## Deformasi geser: Timoshenko atau Euler–Bernoulli? {#timoshenko-or-euler-bernoulli}

Ada tidaknya deformasi geser pada elemen hanya bergantung pada $\Phi$, dan dengan demikian pada koefisien geser penampang $k$: $kA$ adalah luas yang memikul geser. Setiap jenis penampang mendapat nilai awal $k$ sendiri:

| Penampang | Koefisien geser $k$ |
| --- | --- |
| Model awal dan contoh bawaan | $10^{32}$, sehingga $\Phi \approx 0$: Euler–Bernoulli |
| Profil I, H, dan sayap lebar (WF) dari pustaka | $h\,t_w / A$: badan memikul geser |
| Profil persegi berongga dari pustaka | $2\,h\,t / A$: kedua dinding samping |
| Persegi panjang dan bujur sangkar dari pustaka | 0,833 |
| Lingkaran dari pustaka | 0,9 |
| Pipa (lingkaran berongga) dari pustaka | 0,5 |
| Penampang poligon | awalnya 0,833 |
| Dialog **Tambah penampang** | awalnya 1 |

Untuk batang langsing, perbedaannya kecil. Pada balok sederhana dengan beban merata, geser memperbesar lendutan di tengah bentang sebesar $0{,}8\,\Phi$ kali lendutan akibat lentur. Untuk profil baja IPE 200, tambahan ini 1,2% pada bentang 6 m, tetapi 11% pada bentang 2 m. Untuk mematikan deformasi geser, isi $k$ dengan angka yang sangat besar, mis. `1e32`. Kecuali disebutkan lain, gambar interaktif di situs ini memakai penampang contoh yang kaku geser, sehingga hasilnya cocok dengan perhitungan manual menurut teori Euler–Bernoulli. Gambar di bawah ini pengecualiannya:

::model-figure{caption="IPE 200 dengan bentang 2 m, k = h·tw/A = 0,393: w = 0,5657 mm di tengah bentang, 11% lebih besar daripada 0,5106 mm menurut teori Euler–Bernoulli (Φ = 0,135)"}
---
nodes: { A: [0, 0], B: [2, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
material: { e: 210e9, g: 81e9 }
section: { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 }
results: [w, M]
---
::

## Sendi ujung {#end-hinges}

[Sendi ujung](/id/essentials/elements#end-hinges) yang dicentang membuat momen di ujung elemen itu nol. Rotasi ujung elemen menjadi bebas, dan solver mengeliminasinya dengan **kondensasi statis**. Bagi keenam DOF menjadi DOF yang dipertahankan, $a$, dan rotasi ujung yang dilepas, $b$:

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Di sini $\mathbf{f}_\mathrm{fix}$ adalah gaya ujung jepit akibat [beban elemen](#element-loads). Baris kedua memberikan rotasi di sendi,

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

dan jika rotasi ini disubstitusikan ke baris pertama, diperoleh kekakuan dan gaya ujung jepit terkondensasi

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

Solver menuliskan kembali $\mathbf{K}^{*}$ ke dalam matriks 6 × 6 dengan baris dan kolom nol untuk rotasi yang dilepas, sehingga elemen bersendi dirakit persis seperti elemen lainnya. Setelah sistem persamaan diselesaikan, solver menghitung kembali $\mathbf{d}_b$ dari rumus di atas, sehingga bentuk deformasi tampak patah di sendi.

Dengan sendi di joint akhir, bagian lentur untuk $(w_1, \varphi_1, w_2)$ menjadi

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

yang untuk $\Phi = 0$ adalah kekakuan klasik $3EI/L^3$ batang jepit–rol. Dengan sendi di **kedua** ujung, suku lentur hilang seluruhnya dan yang tersisa hanya $EA/L$: elemen menjadi [batang rangka](/id/elements/truss).

Sendi melekat pada ujung elemen, bukan pada joint. Jika semua elemen yang bertemu di sebuah joint bersendi di sana, rotasi joint itu sendiri tidak terhubung ke elemen mana pun. Solver membiarkan rotasi itu nol, dan hal ini tidak menimbulkan masalah; tetapi momen joint yang diberikan di joint seperti itu tidak dipikul oleh elemen mana pun dan membuat sistem persamaan singular.

## Beban elemen {#element-loads}

Beban di sepanjang elemen masuk ke penyelesaian sebagai **beban joint ekuivalen**, $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. **Gaya ujung jepit** $\mathbf{f}_\mathrm{fix}$ adalah gaya ujung yang menahan elemen yang dibebani jika kedua ujungnya dijepit.

Semua rumus di bawah dinyatakan dalam sumbu lokal. Beban yang dimasukkan dalam sumbu global (**LCS** tidak dicentang) lebih dulu diuraikan menjadi komponen lokal dengan $c = \cos\theta$ dan $s = \sin\theta$ dari [sudut](#transformation-matrix) elemen,

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

dengan garis di atas huruf menandai komponen global. Beban garis bekerja per meter panjang elemen itu sendiri. Kasau dari $(0, 0)$ ke $(3, -4)$, misalnya, memiliki $L = 5$ m, $c = 0{,}6$, dan $s = -0{,}8$ (kasau naik, sehingga $z$ berkurang). Beban gravitasi $\bar q_z = 10$ kN/m padanya menghasilkan $q_x = -8$ kN/m searah kemiringan ke bawah dan $q_z = 6$ kN/m tegak lurus kasau, dan kasau memikul total $10 \times 5 = 50$ kN, bukan $10 \times 3$.

Dalam tabel:

- $q_z$, $q_x$: beban merata; $q_1 \to q_2$: beban trapesium, $q_1$ di joint awal dan $q_2$ di joint akhir.
- $F_z$, $F_x$, $M_y$: gaya atau momen pada jarak $a$ dari joint awal, dengan $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: serat bawah lebih panas daripada serat atas; $\Delta T_c$: kenaikan suhu sumbu batang. $\alpha$ adalah koefisien muai panas material dan $h$ adalah **Tinggi** penampang.

Tegak lurus sumbu (komponen z) dan untuk $\Phi = 0$, di joint awal:

$$
\begin{array}{l|cc}
\text{Beban} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Di joint akhir:

$$
\begin{array}{l|cc}
\text{Beban} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Searah sumbu (komponen x), untuk sembarang $\Phi$:

$$
\begin{array}{l|cc}
\text{Beban} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Gaya ujung jepit dengan deformasi geser"}
Beban merata dan beban suhu memberikan gaya ujung jepit yang sama untuk sembarang $\Phi$. Untuk beban lainnya, dengan $D = 1 + \Phi$ dan $\Delta q = q_2 - q_1$ (komponen z):

$$
\begin{aligned}
&\text{Trapesium:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{Gaya } F_z\text{:} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&\text{Momen } M_y\text{:} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

Rumus-rumus ini adalah solusi eksak batang Timoshenko yang terjepit di kedua ujung, demikian pula lendutan yang ditambahkan solver di antara joint untuk setiap beban.
::

Pada elemen bersendi, gaya ujung jepit dikondensasi menjadi $\mathbf{f}^{*}_\mathrm{fix}$, seperti pada bagian [Sendi ujung](#end-hinges). Beban merata pada elemen dengan sendi di joint akhirnya, misalnya, memberikan $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$, dan $M_{21} = 0$ (untuk $\Phi = 0$): gaya ujung jepit balok jepit–rol.

Setelah penyelesaian, gaya dalam di sepanjang elemen diperoleh dari gaya ujungnya dan statika beban yang bekerja padanya, sedangkan lendutan diperoleh dari fungsi bentuk ditambah lendutan akibat beban pada elemen yang terjepit di kedua ujung: lihat [Hasil di sepanjang batang](/id/elements/analysis#results-along-the-members).

## Matriks transformasi {#transformation-matrix}

Elemen dengan sudut $\theta$, yang diukur dari x global ke arah z global (searah jarum jam di layar), memiliki

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

dan perpindahan ujung lokalnya diperoleh dari perpindahan global sebagai $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, dengan

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 & 0 & 0 \\
 -s & c & 0 & 0 & 0 & 0 \\
 0 & 0 & 1 & 0 & 0 & 0 \\
 0 & 0 & 0 & c & s & 0 \\
 0 & 0 & 0 & -s & c & 0 \\
 0 & 0 & 0 & 0 & 0 & 1
\end{bmatrix}.
$$

Rotasi sama di kedua sistem. Jika sebuah joint memiliki **Sudut LCS joint** $\beta$ ([tumpuan miring](/id/essentials/nodes-supports#inclined-skewed-supports)), perpindahan yang dicari $\mathbf{d}_n$ di joint itu dinyatakan dalam sumbu joint itu sendiri, yang diputar sebesar $\beta$ dari x global ke arah z global. Komponen globalnya adalah

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

untuk tiga DOF joint tersebut. Solver mengalikan $\mathbf{T}$ dari kanan dengan matriks blok-diagonal yang tersusun dari $\mathbf{T}_n$ kedua joint ujung (matriks identitas untuk joint tanpa sumbu sendiri), sehingga elemen terhubung ke setiap joint dalam sumbu joint tersebut.

## Matriks kekakuan global {#global-stiffness-matrix}

Dalam sumbu global, matriks kekakuan elemen dan beban joint ekuivalennya adalah

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

dengan $\mathbf{K}_l$ dan $\mathbf{f}_\mathrm{eq}$ yang sudah dikondensasi jika elemen memiliki sendi. $\mathbf{K}_g$ inilah yang ditampilkan jendela **Matriks kekakuan** untuk sebuah elemen (buka dari tabel *Elemen* atau dari menu konteks elemen), dalam satuan SI: N/m, N, dan N·m. Halaman [Cara EduBeam menghitung model](/id/elements/analysis) merakit matriks-matriks ini dan menyelesaikan sebuah contoh kecil secara manual.
