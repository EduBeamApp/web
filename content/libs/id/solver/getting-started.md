---
title: Memulai
description: "Pasang @edubeam/fem, solver elemen hingga di balik EduBeam, lalu hitung, periksa, dan baca hasil balok sederhana dengan selusin baris TypeScript."
order: 1
group: Pendahuluan
source: site
---

# Memulai {#getting-started}

@edubeam/fem adalah solver metode elemen hingga di balik [EduBeam]{.edubeam}: setiap diagram, reaksi, dan lendutan yang ditampilkan aplikasi berasal darinya. Dengan pustaka ini Anda dapat menghitung balok, portal, dan rangka batang bidang dari kode Anda sendiri, di browser maupun di Node: membuat soal latihan beserta jawabannya, memeriksa tugas, menjalankan studi parametrik, atau memasang solver di balik sebuah halaman web.

::div{.actions}
[Hitung balok pertama Anda](#a-simply-supported-beam) [Lihat contoh program](/id/solver/beams)
::

Pustaka ini ditulis dalam TypeScript, sudah menyertakan tipenya sendiri, dan merupakan perangkat lunak bebas berlisensi GPL-3.0. Pustaka ini dibuat oleh Bořek Patzák dan dikembangkan bersama Jan Voříšek serta para kontributor.

## Instalasi {#install}

```bash
npm install @edubeam/fem
```

Pustaka ini dapat dipakai dengan `import` maupun `require`, di browser dan di Node 18 atau yang lebih baru, dan hanya membawa satu dependensi, [mathjs](https://mathjs.org). Sampai versi 0.3.0 pustaka ini dipasang dari GitHub dengan nama `ts-fem`: jika Anda memakainya, ganti import Anda menjadi `@edubeam/fem`. Selain itu tidak ada yang berubah.

Untuk mencoba contoh di bawah dari folder kosong, jadikan folder itu proyek yang memakai `import`, lalu pasang pustakanya:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

Tanpa `"type": "module"` di `package.json` contoh ini tetap berjalan, tetapi Node lebih dulu menampilkan peringatan.

## Balok pertama Anda {#a-simply-supported-beam}

Balok baja IPE 200 sepanjang 6 m di atas tumpuan sendi dan tumpuan rol, dengan beban merata 12 kN/m:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// Seluruhnya dalam satuan SI: m, N, Pa. Baja dan IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Joint di [x, y, z] dalam meter, beserta DOF yang ditahan tumpuannya
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // sendi
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // rol
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m searah sumbu z lokal batang: ke bawah pada balok yang digambar dari kiri ke kanan
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m di tengah bentang
console.log(beam.computeShearForceAt(lc, 0)) // N di A
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m di tengah bentang
```

Simpan sebagai `beam.ts` dan jalankan `node beam.ts`: Node 22.18 dan yang lebih baru menjalankan TypeScript apa adanya. File ini tidak memiliki anotasi tipe, jadi pada Node yang lebih lama cukup simpan sebagai `beam.mjs`. Program menampilkan:

```text [Keluaran]
54000
36000
0.04990940552616746
```

Itulah nilai dari buku teks, $M = qL^2/8 = 54$ kNm dan $V = qL/2 = 36$ kN. Berikut balok yang sama, dihitung di browser Anda oleh solver yang sama:

::model-figure{caption="Balok di atas: 6 m, IPE 200, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

Lendutannya, 49,91 mm, lebih besar 0,28 mm daripada nilai Euler–Bernoulli $5qL^4/384EI = 49{,}63$ mm. Ini bukan kesalahan: batangnya adalah balok Timoshenko, dan 0,28 mm itu adalah $qL^2/8kGA$, deformasi geser balok ini. Beri `k` nilai yang sangat besar, misalnya `1e32`, dan selisih itu hilang: lihat [Deformasi geser](/id/solver/materials-sections#shear-deformation).

## Apa yang dilakukan kode ini {#what-the-code-does}

::div{.steps}
### Buat solver {#make-a-solver}

`new LinearStaticSolver()` sudah dilengkapi `domain` kosong, yang menampung model, dan satu kasus beban, `solver.loadCases[0]`.

### Deskripsikan model {#describe-the-model}

Material dan penampang, joint beserta tumpuannya, lalu batang di antara joint. Setiap objek memiliki label, berupa string atau angka, yang dipakai bagian model lainnya untuk merujuknya. Lihat [Joint dan tumpuan](/id/solver/nodes-supports), [Material dan penampang](/id/solver/materials-sections), serta [Batang dan sendi](/id/solver/members-hinges).

### Bebani model {#load-it}

Setiap beban termasuk dalam suatu kasus beban: gaya di joint, beban di sepanjang batang, suhu, dan penurunan tumpuan. Lihat [Beban joint dan beban batang](/id/solver/loads).

### Hitung {#solve}

`solver.solve()` merakit dan menyelesaikan semua kasus beban. Lihat [Perhitungan](/id/solver/solving).

### Baca hasilnya {#read-the-results}

Gaya dalam di titik mana pun pada batang, lendutan, gaya ujung, perpindahan joint, dan reaksi. Lihat [Membaca hasil](/id/solver/results), dan [Menggambar hasil](/id/solver/drawing) untuk diagramnya.
::

## Satuan dan tanda secara singkat {#axes-and-signs}

Masukan dalam satuan SI, hasil pun dalam SI. Model terletak di bidang x–z dengan **sumbu z mengarah ke bawah**, jadi `fz` positif mendorong ke bawah dan puncak kolom setinggi 4 m berada di $z = -4$. Posisi pada batang dinyatakan dalam meter dari joint pertamanya. Momen positif menarik serat bawah. Daftar lengkapnya ada di [Satuan dan tanda](/id/solver/conventions).

## Enam hal yang sering menjebak {#pitfalls}

1. **Sumbu z mengarah ke bawah.** Beban gravitasi bernilai positif, dan apa pun yang berada di atas tumpuan memiliki z negatif. Lihat [Sumbu](/id/solver/conventions#axes).
2. **Arah batang menentukan tanda M dan w.** Definisikan balok dari kiri ke kanan dan kolom dari bawah ke atas, maka tandanya sama seperti di buku teks. Lihat [Arah batang](/id/solver/conventions#member-direction).
3. **Parameter yang terlupa menghasilkan `NaN` atau angka yang tidak masuk akal, bukan pesan kesalahan.** Penampang memerlukan `a`, `iy`, dan `k`; material memerlukan `e`, dan juga `g` kecuali `k` sangat besar. Lihat [Material dan penampang](/id/solver/materials-sections).
4. **Setelah menambah joint atau batang, atau mengubah tumpuan,** atur `solver.codeNumberGenerated = false` sebelum menghitung lagi. Lihat [Menghitung ulang setelah perubahan](/id/solver/solving#solving-again-after-a-change).
5. **Reaksi dikembalikan sebagai matriks mathjs atau sebagai array,** dengan urutan DOF tumpuan seperti saat diberikan. Lihat [Reaksi](/id/solver/results#reactions).
6. **Mekanisme tidak selalu memunculkan exception.** Perpindahan sebesar $10^{12}$ m berarti struktur dapat bergerak bebas. Lihat [Jika perhitungan gagal](/id/solver/solving#when-solving-fails).

## Langkah selanjutnya {#next}

::card-grid{cols="2"}
:::card{title="Contoh program" icon="lucide:book-open" to="/id/solver/beams"}
Program lengkap yang sudah diperiksa: balok, portal, rangka batang, lembar soal beserta kunci jawabannya, dan server HTTP kecil.
:::
:::card{title="Gambar hasilnya" icon="lucide:chart-spline" to="/id/solver/drawing"}
Serahkan model yang sudah dihitung ke @edubeam/plot dan dapatkan diagramnya sebagai SVG, di Vue atau dari skrip Node.
:::
:::card{title="Referensi API" icon="lucide:list-tree" to="/id/solver/reference"}
Setiap kelas, metode, dan argumen, lengkap dengan satuan dan nilai yang dikembalikan.
:::
:::card{title="Teorinya" icon="lucide:sigma" to="/id/elements/beam"}
Elemen balok, matriks kekakuan dan matriks transformasinya, di manual teori EduBeam.
:::
::
