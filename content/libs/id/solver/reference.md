---
title: Referensi API
description: "Setiap kelas, metode, dan argumen @edubeam/fem 0.3, beserta satuan, nilai bawaan, dan bentuk nilai yang dikembalikannya."
order: 16
group: Referensi API
source: site
---

# Referensi API {#api-reference}

Semua yang diekspor `@edubeam/fem` 0.3, dikelompokkan menurut kegunaannya. Seluruhnya dalam satuan SI: m, N, N·m, N/m, Pa, K, dan rad. Label (`LabelType`) bertipe `string | number` dan disimpan sebagai string. Metode yang tidak tercantum di sini bersifat internal: metode itu bersifat public di TypeScript hanya karena dipanggil oleh kelas-kelas solver sendiri.

## Ekspor {#exports}

| Ekspor | Jenis | Bagian |
| --- | --- | --- |
| `LinearStaticSolver` | kelas | [Analisis](#analyses) |
| `Solver` | kelas abstrak | [Analisis](#analyses) |
| `Domain` | kelas | [Domain](#domain) |
| `Node` | kelas | [Node](#node) |
| `Beam2D`, `Element` | kelas | [Elemen](#elements) |
| `Material`, `CrossSection` | kelas | [Material dan penampang](#materials-and-sections) |
| `LoadCase` | kelas | [Beban](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | kelas | [Beban](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | tipe | |

## Analisis {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Properti / metode | Tipe | Keterangan |
| --- | --- | --- |
| `domain` | `Domain` | Modelnya |
| `loadCases` | `LoadCase[]` | Dimulai dengan satu kasus beban, `'DefaultLC'`. Tambahkan yang lain dengan `new LoadCase(label, solver.domain)`: [Kasus beban](/id/solver/load-cases). |
| `solve()` | `void` | Menomori persamaan jika perlu, merakit dan menyelesaikan semua kasus beban. Dapat memunculkan exception pada [mekanisme](/id/solver/solving#when-solving-fails), tetapi tidak selalu. Sejak 0.3.1 tidak menulis apa pun ke konsol; 0.3.0 mencetak waktu hitungnya. |
| `codeNumberGenerated` | `boolean` | Atur ke `false` setelah menambah atau menghapus joint atau batang, atau mengubah tumpuan: [alasannya](/id/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Jumlah DOF bebas dan DOF yang ditahan, setelah perhitungan |
| `k` | `Matrix` mathjs | Matriks kekakuan global yang sudah dirakit, setelah perhitungan |
| `getNodeDofIDs(label)` | `number[]` | DOF yang dimiliki sebuah joint, setelah perhitungan |

`EigenValueDynamicSolver` ada di kode sumber, tetapi tidak diekspor.

## Domain {#domain}

`solver.domain` menyimpan model dalam empat `Map` dengan kunci berupa label sebagai string: `nodes`, `elements`, `materials`, `crossSections`. Tidak ada metode untuk menghapus: `domain.nodes.delete(label)` dan `domain.elements.delete(label)` menghapus joint atau batang, lalu diikuti [penomoran ulang](/id/solver/solving#solving-again-after-a-change).

| Metode | Mengembalikan | Keterangan |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` `[x, y, z]` dalam m (bawaan `[0, 0, 0]`), `bcs` daftar `DofID` yang ditahan (bawaan tidak ada) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` `[first, second]`, `hinges` `[atFirst, atSecond]` (bawaan `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Lihat [Material dan penampang](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Lihat [Material dan penampang](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | objeknya | Memunculkan `RangeError` untuk label yang tidak dikenal. `getElement` bertipe `Element`: tulis `as Beam2D` untuk membaca hasil. |

Membuat objek dengan label yang sudah dipakai akan menggantikan objek yang lama.

## Node {#node}

| Properti / metode | Tipe | Keterangan |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Ubah untuk memindahkan joint. |
| `bcs` | `Set<DofID>` | DOF yang ditahan. Ganti untuk mengubah tumpuan. |
| `lcs` | `number[][] \| undefined` | Sumbu joint yang diputar, jika ada |
| `updateLcs({ locx, locy }?)` | `void` | Memutar sumbu joint: `locx` sumbu x-nya dalam komponen global, `locy` `[0, 1, 0]`. Tanpa argumen, sumbunya dikembalikan ke semula. |
| `hasLcs()` | `boolean` | Apakah sumbunya diputar |
| `getUnknowns(lc, dofs)` | `Matrix`, atau `number` untuk satu DOF | Perpindahan (m) dan rotasi (rad), dalam sumbu joint |
| `getReactions(lc, global?)` | `{ dofs, values }` | Reaksi pada DOF yang ditahan, dalam urutan `bcs`: N, N·m. `values` berupa `Matrix` mathjs jika lebih dari satu, array berisi satu elemen jika hanya satu, `[]` untuk joint bebas. Dengan `global` `true` pada joint yang diputar: ketiga DOF dalam sumbu global, `dofs` `[0, 2, 4]`, `values` berupa array dengan 0 di DOF yang tidak ditahan. [Cara membacanya](/id/solver/results#reactions). |

## Elemen {#elements}

### `Beam2D` {#beam2d}

Balok Timoshenko dengan dua joint di bidang x–z, tiga DOF per joint (`Dx`, `Dz`, `Ry`). `x` dinyatakan dalam meter dari joint pertama; `n` adalah jumlah segmen, yang menghasilkan n + 1 titik.

| Properti / metode | Mengembalikan | Keterangan |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Pelepasan momen di joint pertama dan kedua |
| `computeNormalForceAt(lc, x)` | `number` | N, tarik positif |
| `computeShearForceAt(lc, x)` | `number` | V, positif jika M bertambah sepanjang x lokal |
| `computeBendingMomentAt(lc, x)` | `number` | M, positif jika sisi +z lokal tertarik |
| `computeNormalForce(lc, n)` | `{ x, N }` | N di n + 1 titik |
| `computeShearForce(lc, n)` | `{ x, V }` | V di n + 1 titik |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M di n + 1 titik |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Perpindahan searah dan tegak lurus batang, sumbu lokal, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | Sama, dalam x dan z global |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, gaya yang diberikan joint pada batang, sumbu lokal |
| `computeEndDisplacement(lc)` | `Matrix` | Perpindahan ujung dalam sumbu lokal, termasuk rotasi di sendi |
| `computeGeo()` | `{ l, dx, dz }` | Panjang dan proyeksinya, m |
| `computeT()` | `Matrix` | Matriks transformasi 6 × 6, dari global ke lokal |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: matriks kekakuan lokal 6 × 6, sendi sudah dikondensasi |
| `computeStiffness()` | `Matrix` | Matriks kekakuan global 6 × 6 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

Tepat di titik beban terpusat, metode `…At` mengembalikan nilai sesaat sesudahnya. `Element` adalah kelas dasar abstrak dari `Beam2D`; tipe inilah yang dipakai `domain.elements` dan `getElement`.

## Material dan penampang {#materials-and-sections}

| `MaterialParameters` | Satuan | Bawaan | Dipakai untuk |
| --- | --- | --- | --- |
| `e` | Pa | 1 | kekakuan |
| `g` | Pa | 1 | kekakuan geser |
| `alpha` | 1/K | 1 | beban suhu |
| `d` | kg/m³ | 1 | tidak dipakai dalam statika |

| `CrossSectionParameters` | Satuan | Bawaan | Dipakai untuk |
| --- | --- | --- | --- |
| `a` | m² | tidak ada, wajib | kekakuan aksial dan kekakuan geser |
| `iy` | m⁴ | tidak ada, wajib | kekakuan lentur |
| `k` | – | tidak ada, wajib | kekakuan geser $kGA$; `1e32` untuk meniadakannya |
| `h` | m | tidak ada | selisih (gradien) suhu (`NaN` tanpa parameter ini) |
| `iz`, `dyz`, `j` | m⁴ | tidak ada | tidak dipakai oleh `Beam2D` |

Parameter material yang tidak diisi bernilai 1, bukan nilai yang lazim; `a`, `iy`, atau `k` yang tidak diisi membuat setiap hasil menjadi `NaN`. Dalam kedua kasus tidak muncul exception. Kedua kelas memiliki metode `change(params)` yang mengatur parameter yang diberikan, dan menyimpannya sebagai properti dengan nama yang sama.

## Beban {#loads}

### `LoadCase` {#loadcase}

| Metode | Mengembalikan | Nilai |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (bawaan `false`) `true`: dalam sumbu joint yang diputar |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m di sepanjang seluruh batang |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m di joint pertama dan kedua, linear di antaranya |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, sejauh `a` m dari joint pertama |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: titik berat, serat bawah, serat atas |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` pada DOF yang ditahan, dalam sumbu joint; diabaikan pada DOF bebas |

Untuk beban batang, `lcs` `true` berarti sumbu lokal (x sepanjang batang, z tegak lurus batang), `false` berarti sumbu global. Beban garis dinyatakan per meter panjang batang. Contohnya ada di [Beban joint dan beban batang](/id/solver/loads).

| Properti / metode | Tipe | Keterangan |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Beban batang dan beban suhu |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` setelah perhitungan berhasil |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Beban pada satu batang |

Objek beban menyimpan nilainya dalam properti public, yang dapat Anda ubah sebelum menghitung lagi: `values` (dan `lcs`) pada `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad`, dan `BeamTemperatureLoad`; `startValues` dan `endValues` pada `BeamElementTrapezoidalEdgeLoad`; `prescribedValues` pada `PrescribedDisplacement`. Masing-masing memiliki `target`, yaitu label objek tempat beban bekerja.

## DofID {#dofid}

| Nama | Nilai | Dipakai oleh `Beam2D` |
| --- | --- | --- |
| `Dx` | 0 | ya |
| `Dy` | 1 | tidak |
| `Dz` | 2 | ya |
| `Rx` | 3 | tidak |
| `Ry` | 4 | ya |
| `Rz` | 5 | tidak |

## Hasil {#results}

Hasil dibaca dari `Beam2D` (gaya dalam, lendutan, gaya ujung) dan dari `Node` (perpindahan, reaksi), selalu untuk `LoadCase` tertentu, setelah `solve()`: lihat kedua tabel di atas, dan [Membaca hasil](/id/solver/results) untuk contoh dan tandanya. Ringkasnya:

| Untuk mendapatkan | Panggilan |
| --- | --- |
| Reaksi, N dan N·m | `node.getReactions(lc)` |
| Perpindahan, m, dan rotasi, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V, atau M di satu titik, N dan N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V, atau M di sepanjang batang | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Bentuk deformasi, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Gaya ujung, N dan N·m | `beam.computeEndForces(lc)` |
| Gambar semua hasil itu | `StructurePlot` atau `structureSvg` dari [@edubeam/plot](/id/solver/drawing) |
