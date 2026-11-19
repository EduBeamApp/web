---
title: Material dan penampang
description: "Parameter material dan penampang yang dipakai @edubeam/fem, mana yang diperlukan setiap analisis, akibatnya jika terlupa, dan cara mematikan deformasi geser."
order: 4
source: site
---

# Material dan penampang {#materials-and-sections}

Batang mengambil kekakuannya dari sebuah material dan sebuah penampang; keduanya dibuat sekali dan dirujuk lewat labelnya.

```ts
domain.createMaterial('steel', { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection('IPE200', {
  a: 28.5e-4, // m²
  iy: 1943e-8, // m⁴
  h: 0.2, // m
  k: 5 / 6,
})
```

## Material {#material}

| Parameter | Arti | Satuan | Diperlukan untuk |
| --- | --- | --- | --- |
| `e` | Modulus elastisitas (Young) $E$ | Pa | selalu |
| `g` | Modulus geser $G$ | Pa | selalu, kecuali `k` sangat besar (tanpa deformasi geser) |
| `alpha` | Koefisien muai termal $\alpha$ | 1/K | beban suhu |
| `d` | Massa jenis $\rho$ | kg/m³ | tidak dipakai dalam analisis statis |

Parameter yang tidak Anda isi bernilai **1**, bukan nilai yang lazim, dan tidak ada peringatan apa pun. Jika `g` terlupa pada balok dari Memulai, lendutannya menjadi 22 700 km.

## Penampang {#cross-section}

| Parameter | Arti | Satuan | Diperlukan untuk |
| --- | --- | --- | --- |
| `a` | Luas $A$ | m² | selalu: kekakuan aksial dan kekakuan geser |
| `iy` | Momen inersia $I_y$ | m⁴ | selalu: kekakuan lentur |
| `k` | Koefisien geser $k$ | – | selalu: kekakuan geser $kGA$ |
| `h` | Tinggi $h$ | m | selisih (gradien) suhu |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, konstanta torsi | m⁴ | tidak dipakai dalam model bidang |

Penampang tidak memiliki nilai bawaan. Jika `a`, `iy`, atau `k` tidak diisi, semua hasil menjadi `NaN`; jika `h` tidak diisi, selisih suhu menghasilkan `NaN`. Keduanya tidak memunculkan pesan kesalahan, jadi hasil `NaN` hampir selalu berarti ada parameter yang terlupa.

## Deformasi geser {#shear-deformation}

Batangnya adalah balok Timoshenko: selain melentur, batang juga berdeformasi akibat geser. Besarnya bergantung pada

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2},
$$

yang dikembalikan oleh `beam.computeShearFactor()`. Pada batang yang langsing, $\Phi$ sangat kecil, dan lendutan bertambah hanya sepersekian persen. Pada batang yang pendek dan tinggi, pengaruhnya cukup besar.

Untuk balok Euler–Bernoulli seperti pada tabel di buku teks, buat kekakuan gesernya praktis tak hingga dengan koefisien geser yang sangat besar, seperti yang dilakukan contoh-contoh di aplikasi EduBeam:

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

Semua contoh program dalam dokumentasi ini melakukannya, sehingga angkanya tepat sama dengan rumusnya. Untuk koefisien geser yang sesungguhnya, $k = 5/6$ cocok untuk penampang persegi panjang. Halaman [Memeriksa hasil secara manual](/id/guide/verification#shear-deformation) memperlihatkan besarnya pengaruh ini.

## Kaku dalam arah aksial {#rigid-in-axial-direction}

Luas penampang yang besar membuat batang praktis tidak dapat memanjang, seperti yang biasanya diasumsikan dalam perhitungan manual. Gaya dalam portal hanya sedikit bergantung pada luas penampang; perpindahan rangka batang sepenuhnya bergantung padanya. Gaya dalam struktur statis tertentu sama sekali tidak bergantung pada kekakuan.

## Mengubahnya setelah model dibuat {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Setiap batang membaca material dan penampangnya saat solver merakit matriks, jadi cukup panggil `solve()` lagi. Batang yang berbeda dapat memakai penampang yang berbeda: beri masing-masing labelnya sendiri.
