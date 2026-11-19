---
description: "Batang rangka di EduBeam: elemen balok bersendi di kedua ujung, mengapa sama persis dengan elemen rangka batang klasik, matriks kekakuan dan transformasinya."
source: site
---

# Elemen rangka batang

Batang rangka hanya memikul gaya aksial. EduBeam tidak memiliki elemen rangka batang tersendiri: batang rangka adalah [elemen balok](/id/elements/beam) dengan **kedua sendi ujung** dicentang. Halaman ini menunjukkan mengapa elemen tersebut sama persis dengan elemen rangka batang klasik dua joint, menyajikan matriks kekakuan dan matriks transformasinya, dan menjelaskan apa yang dapat dilakukan batang bersendi tetapi tidak dapat dilakukan batang rangka dalam buku teks.

::model-figure{caption="Semua batang bersendi di kedua ujung: kasau memikul N = −7,071 kN, batang tarik +5 kN, dan tidak ada batang yang melentur"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
results: [N]
show: [nodeLabels]
---
::

Untuk memodelkan rangka batang di aplikasi, centang **Sendi awal** dan **Sendi akhir** pada setiap batang, atau centang keduanya di banner di bagian atas sebelum Anda menggambar batang dengan mouse ([sendi ujung](/id/essentials/elements#end-hinges)). [Tutorial rangka batang bidang](/id/tutorials/truss) membangun sebuah rangka batang langkah demi langkah.

## Derajat kebebasan {#degrees-of-freedom}

Batang rangka bekerja dengan dua translasi di setiap ujung, dalam [sumbu lokal](/id/elements/conventions#element-local-axes) batang:

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="Batang rangka: bersendi di kedua ujung, dengan dua translasi di setiap ujung"}
::

| Arah | Joint awal (1) | Joint akhir (2) |
| --- | --- | --- |
| searah x lokal | $u_1$ dan `X12` | $u_2$ dan `X21` |
| searah z lokal | $w_1$ dan `Z12` | $w_2$ dan `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

Joint tetap memiliki rotasi `Ry`, karena setiap batang adalah elemen balok, tetapi batang yang bersendi di kedua ujung tidak merasakan maupun meneruskannya: momen ujungnya, `M12` dan `M21`, selalu nol. Di joint tempat semua batang bersendi, tidak ada yang menahan rotasi itu. Solver membiarkannya nol, tetapi momen joint yang diberikan di joint seperti itu tidak dipikul oleh batang mana pun dan menghentikan perhitungan dengan pesan *Struktur adalah mekanisme: matriks kekakuan singular.*

## Matriks kekakuan lokal {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

dengan $E$ modulus elastisitas, $A$ luas penampang, dan $L$ panjang batang. Hanya perpanjangan batang yang membutuhkan energi, sehingga gaya normal batang tanpa beban elemen bernilai konstan:

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### Mengapa balok dengan dua sendi adalah batang rangka {#why-a-beam-with-two-hinges-is-a-truss-bar}

Kondensasikan kedua rotasi ujung dari [matriks kekakuan balok](/id/elements/beam#local-stiffness-matrix), seperti untuk setiap [sendi ujung](/id/elements/beam#end-hinges). Suku aksial tidak melibatkan rotasi dan tetap seperti semula. Suku lentur hilang seluruhnya: begitu kedua rotasi bebas, sembarang pasangan perpindahan ujung $w_1$, $w_2$ hanya memutar batang sebagai benda kaku terhadap sendinya, dan ini tidak membutuhkan energi. Solver melakukan kondensasi ini secara numerik, untuk sembarang koefisien geser, dan memperoleh matriks di atas dengan selisih sebatas galat pembulatan aritmetika titik mengambang.

::callout{type="details" title="Kondensasinya, langkah demi langkah"}
Untuk bagian lentur, urutkan DOF menjadi yang dipertahankan, $a = (w_1, w_2)$, dan yang dilepas, $b = (\varphi_1, \varphi_2)$. Dari matriks balok, dengan $k_1$ sampai $k_4$ dan parameter geser $\Phi$ seperti yang didefinisikan di halaman [Elemen balok](/id/elements/beam#local-stiffness-matrix),

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

Karena kedua kolom $\mathbf{K}_{ab}$ sama, yang berpengaruh hanya jumlah semua suku $\mathbf{K}_{bb}^{-1}$, yaitu $2/(k_3 + k_4)$:

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

Dengan $k_3 + k_4 = 6EI_y / ((1+\Phi)L)$, faktornya menjadi $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$, sehingga hasil ini tepat sama dengan $\mathbf{K}_{aa}$, dan kekakuan lentur terkondensasi $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ bernilai nol.
::

## Matriks transformasi {#transformation-matrix}

Untuk batang dengan sudut $\theta$ dari x global ke arah z global, dengan $c = \cos\theta = (x_2 - x_1)/L$ dan $s = \sin\theta = (z_2 - z_1)/L$, perpindahan lokalnya adalah $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$ dengan

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

yaitu baris dan kolom translasi dari [matriks transformasi balok](/id/elements/beam#transformation-matrix). Perhatikan tanda $s$ karena z mengarah ke bawah: kasau A → C pada rangka batang di atas naik, sehingga $z_2 - z_1 = -3$ m, $c = 0{,}7071$, dan $s = -0{,}7071$.

## Matriks kekakuan global {#global-stiffness-matrix}

Setelah perkalian $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$ dijabarkan, diperoleh

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

Jendela **Matriks kekakuan** untuk batang bersendi menampilkan angka-angka ini pada baris dan kolom translasi, dan nol untuk rotasi.

## Kelebihan balok bersendi dibandingkan batang rangka {#where-a-hinged-beam-does-more}

Karena batang rangka di EduBeam tetap merupakan elemen balok, batang ini dapat melakukan dua hal yang tidak dapat dilakukan batang rangka dalam buku teks:

- **Memikul beban di sepanjang batang.** Beban garis pada batang, mis. berat sendirinya, membuat batang melentur di antara joint seperti balok sederhana dan menyalurkan $qL/2$ ke setiap joint. Batang-batang lainnya memikul gaya normal rangka batang akibat beban joint ini. Pada batang yang dibebani itu sendiri, komponen beban yang searah batang membuat $N$ berubah secara linear, dan gaya batang rangka adalah nilainya di tengah panjang batang.
- **Dipadukan dengan balok.** Portal dapat memuat batang bersendi, mis. batang tarik atau diagonal pengaku, tanpa tipe elemen khusus.

Tambahkan 5 kN/m pada batang tarik rangka batang di atas:

::model-figure{caption="Rangka batang yang sama dengan 5 kN/m pada batang tarik: gaya normal tidak berubah, dan batang tarik melentur dengan M = qL²/8 = 22,5 kNm"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
  - { member: 3, qz: 5 }
results: [M, N]
show: [nodeLabels]
---
::

Pemeriksaan manualnya: di C, keseimbangan vertikal $2\,N \sin 45^\circ + 10 = 0$ memberikan $N = -7{,}071$ kN pada setiap kasau. Di A, komponen horizontal kasau, $7{,}071 \cos 45^\circ = 5$ kN, diimbangi oleh batang tarik, yang mengalami gaya tarik $N = +5$ kN. Beban pada batang tarik langsung disalurkan ke tumpuan di ujung-ujungnya: beban ini menambah $qL/2 = 15$ kN pada setiap reaksi, tetapi tidak menambah apa pun pada gaya normal.

Rangka batang harus stabil sebagai struktur dengan sambungan sendi. Panel persegi tanpa diagonal, misalnya, adalah mekanisme: EduBeam menyebutkan sendinya dan menunjukkan gerakannya (lihat [Pemecahan masalah](/id/reference/troubleshooting#no-results-are-drawn)).
