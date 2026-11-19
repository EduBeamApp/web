---
title: Fungsi
description: "Fungsi, konstanta dan tipe @edubeam/plot 0.2.0 di luar komponen: structureSvg untuk file SVG, pembacaan hasil eksak, satuan, garis balok dan tata letak."
order: 10
source: site
---

# Fungsi {#functions}

Semua yang digambar komponen berasal dari fungsi murni tanpa Vue di dalamnya. Fungsi-fungsi ini menulis gambar sebagai file SVG, membaca hasil secara eksak, menyiapkan data lebih awal, dan menjadi bahan untuk menyusun gambar Anda sendiri. Impor bernama menjaga bundle tetap kecil: halaman yang hanya mengimpor `modelFromSolver` sama sekali tidak membawa kode komponen.

Semua nilai dalam satuan SI kecuali satuannya disebutkan lain; posisi di sepanjang batang dinyatakan dalam meter dari joint awalnya.

## File SVG mandiri {#a-standalone-svg-file}

Gambar di halaman web mengambil warnanya dari custom property CSS halaman, sehingga `<svg>` yang disalin keluar darinya tidak memiliki warna. Sebagai gantinya, `structureSvg` menulis gambar sebagai teks file `.svg` mandiri: warna tetap, tanpa stylesheet, tanpa skrip, dan ditata oleh rutin yang sama dengan `StructurePlot`. Word, PowerPoint, Inkscape, CairoSVG dan rangkaian alat LaTeX menampilkannya persis seperti halaman web.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => LinearStaticSolver yang sudah dihitung, seperti di halaman Slide dan catatan kuliah

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![Portal sebagai file SVG mandiri yang dirender dengan CairoSVG: beban, reaksi 20 dan 40 ke atas serta 2,3 dan 12,7 ke samping, dan momen lentur dari −50,7 di C sampai 29,3 di balok](/screenshots/id/p2p-plot-frame-svg.webp){.shot-lg}

| Opsi | Bawaan | Fungsinya |
| --- | --- | --- |
| `layers` | members, supports, loads, reactions and the result `StructurePlot` would pick | Apa yang digambar |
| `width` | `640` | Lebar dalam px, satuan pengguna SVG |
| `height` | follows the drawing | Tinggi tetap, px |
| `maxHeight` | max(320, 0.75 × width) | Batas atas tinggi otomatis |
| `padding` | `6` | Ruang di sekeliling gambar, px |
| `fontSize` | `13`, compact `11.5` | Ukuran teks, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Daftar font yang tersedia di program yang membuka file |
| `colors` | `PRINT_COLORS` | Rona mana pun, sebagai warna tetap |
| `background` | `true` | Mewarnai latar belakang dengan `paper`; `false` membiarkannya transparan |
| `title` | none | Ditulis sebagai `<title>` SVG |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | none | Lapisan, gaya label dan gaya label reaksi yang tempatnya disiapkan selain yang digambar, agar file-file gambar bertahap saling berimpit: [Gambar bertahap di Beamer](/id/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | as `StructurePlot` | Artinya sama dengan prop komponen |

`PRINT_COLORS` adalah warna aplikasi EduBeam di atas putih: tinta `#16182b`, gaya normal `#2222ff`, gaya geser `#00af00`, momen lentur `#ff2222`, beban `#ff8700`, reaksi `#a020f0`. Setiap label ditulis dua kali, dengan halo berwarna latar di bawah teksnya, karena tidak semua program SVG memahami `paint-order`; subskrip, seperti pada nama reaksi *A<sub>x</sub>*, ditulis sebagai `tspan` dengan angka biasa yang dapat dibaca Word dan Inkscape. Tanpa `reserve`, file disesuaikan dengan lapisan yang digambarnya.

Cara memakai file ini:

- **Word dan PowerPoint** (2019 dan Microsoft 365): *Insert › Pictures* (dalam versi bahasa Indonesia *Sisipkan › Gambar*).
- **LaTeX**: konversikan ke PDF dengan [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) atau Inkscape, lalu `\includegraphics`; atau pakai `\includesvg` dari paket `svg`, yang memanggil Inkscape untuk Anda. Dengan lebar 640 unit, gambar yang dipasang di kolom teks 16 cm memiliki label berukuran 9 pt.
- **Halaman web tanpa Vue**: tempelkan teksnya ke HTML. Lihat [Tanpa Vue](/id/plot/embedding#plain-html-from-node).

[Soal latihan dan ujian](/id/plot/exercises#figures-for-latex-and-word) menulis file untuk soal dan kunci jawaban setiap mahasiswa.

## Dari solver {#from-a-solver}

| Ekspor | Signature | Fungsinya |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Membaca solver menjadi [model gambar](/id/plot/model) biasa; hasil hanya untuk kasus beban yang sudah dihitung |
| `FromSolverOptions` | type | `{ loadCase?: number }`, indeks dalam `solver.loadCases` |

## Polinomial per bagian {#piecewise-polynomials}

Hasil sebuah batang berupa nilai `Piecewise`: daftar bagian `{ x0, x1, c }`, yang dijelaskan di [Model gambar](/id/plot/model#piecewise-polynomials). `side` memilih nilai tepat sebelum (`'left'`) atau tepat sesudah (`'right'`, bawaan) titik tempat dua bagian bertemu.

| Ekspor | Signature | Fungsinya |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | Nilai di `x`; di luar ujung-ujungnya, nilai ujung terdekat |
| `slopeAt` | `(pw, x, side?) => number` | Turunan, dalam satuan nilai per meter |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | Nilai terbesar dan terkecil, secara eksak, masing-masing `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | Nilai mutlak terbesar |
| `innerBreaks` | `(pw) => number[]` | Tempat bagian-bagian bertemu, tanpa kedua ujung |
| `isZero` | `(pw) => boolean` | Apakah hasilnya nol di seluruh panjang |
| `evalPiece` | `(piece, x) => number` | Nilai satu bagian |
| `evalPieceSlope` | `(piece, x) => number` | Kemiringan satu bagian |
| `pieceExtrema` | `(piece) => number[]` | Tempat kemiringan suatu bagian bernilai nol, m |
| `pieceDegree` | `(piece) => number \| null` | Derajat suatu bagian; `null` jika bagian itu nol |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | Membuang koefisien di bawah `tolerance`, yaitu galat pembulatan model terhitung |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | Polinomial berderajat tertentu yang melalui sebuah fungsi pada `(x0, x1)` |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | Bagian sebagai kurva Bézier kubik dalam (x, nilai): eksak sampai derajat tiga, selebihnya dengan `segments` kurva, secara bawaan 4 |

Tipe: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Satuan dan angka {#units-and-numbers}

| Ekspor | Signature | Fungsinya |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: bawaan |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` dengan penggantian Anda |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | Format bahasa Inggris, paling banyak satu desimal |
| `formatNumber` | `(value, format?) => string` | Angka dengan tanda minus sungguhan, tidak pernah −0 |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: nilai SI dalam suatu satuan, dengan spasi sempit tak terputus |

`Unit` berbentuk `{ symbol, scale }`, nilai tampilan = nilai SI × `scale`. `Units` berisi satu `Unit` untuk setiap `UnitKind`: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` dan `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Membaca nilai {#reading-values}

| Ekspor | Signature | Fungsinya |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | N, V, M dan w di `x`, masing-masing `{ left, right }`, serta perpindahan aksial `u`; menempel ke lompatan dalam jarak `snap` m |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | Batang terdekat dari suatu titik layar dalam jarak `reach` px, dan hasilnya di titik itu |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Tempat nilai yang dibaca digambar: ujung ordinat setiap diagram yang tampil (kedua ujung di tempat lompatan), titik pada bentuk deformasi |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"`, atau `"V = 13.3 → −6.7 kN"` di tempat lompatan |

`k` adalah px per satuan SI untuk setiap hasil, dan `side` sisi tempat setiap diagram digambar, dari `diagramScales` dan `diagramSide` di bawah. Tipe: `Readout`, `ReadoutMark` (`{ tone, from, to }` dalam px), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Garis balok {#beam-lines}

Bagian-bagian penyusun [DiagramStack](/id/plot/diagram-stack), untuk membuat gambar bertumpuk Anda sendiri.

| Ekspor | Signature | Fungsinya |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Batang-batang sebagai satu garis horizontal, dari kiri ke kanan; memunculkan galat untuk bentuk lain |
| `lineDiagram` | `(model, line, row) => Piecewise` | Satu hasil di sepanjang seluruh garis, dalam koordinat x garis |
| `rowRange` | `(pw) => [number, number]` | Rentang yang dipakai untuk menskalakan sebuah baris, selalu mencakup nol |
| `rowPeaks` | `(pw) => RowPeak[]` | Nilai ekstrem yang layak ditulis pada sebuah baris |
| `rowBreaks` | `(pw) => number[]` | Tempat hasilnya patah: tumpuan, joint dan beban terpusat |
| `rowOutline` | `(pw, sx, sy, close) => string` | Data path SVG untuk garis tepi sebuah baris, dengan pemetaan dari m dan nilai ke px |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Data path SVG untuk ordinat arsiran, berjarak `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | Model yang dipangkas menjadi garis itu saja, bila perlu tanpa satu beban |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | Gaya terpusat di posisi garis `at` |

Tipe: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

Halaman [DiagramStack](/id/plot/diagram-stack#a-load-the-reader-can-drag) memakai `beamLine`, `lineDiagram` dan `rowRange` agar skala setiap baris tetap sama di semua posisi beban berjalan.

## Geometri dan tumpuan {#geometry-and-supports}

| Ekspor | Signature | Fungsinya |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Joint menurut id |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Titik awal batang, vektor singgung satuan, vektor satuan z lokal dan panjangnya |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | Sama untuk setiap batang, menurut id |
| `pointAlong` | `(frame, at) => { x, z }` | Titik sejauh `at` meter di sepanjang batang |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` atau `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Simbol untuk sebuah joint dan putarannya searah jarum jam, dalam derajat |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Garis-garis penyusun simbol, dalam px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Seberapa jauh simbol yang diputar menjangkau ke suatu arah, px |

## Penggambaran {#drawing}

Penggambaran berlangsung dalam tiga langkah. `buildStructureScene` mengubah model menjadi item scene: titik-titik model dengan offset dalam piksel layar. `fitScene` mencari skala dan offset yang membuat semuanya muat dalam sebuah kotak. `resolveScene` mengubahnya menjadi data path SVG, lingkaran, dan label-label yang mendapat tempat. `layoutStructure` menjalankan ketiganya seperti yang dilakukan `StructurePlot` dan `structureSvg`, sehingga gambar buatan Anda sendiri ditata seperti gambar keduanya.

| Ekspor | Signature | Fungsinya |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | Seluruh tata letak: menyesuaikan dengan semua label, membuang label yang berdesakan, lalu menyesuaikan lagi. Mengembalikan `{ fit, items, resolved }` |
| `structureSvg` | `(model, options?) => string` | File `.svg` mandiri: [di atas](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | Gambar lapisan-lapisan terpilih pada suatu skala, px per meter |
| `fitScene` | `(items, box: FitBox) => Fit` | Skala dan offset agar muat dalam kotak `{ width, height?, maxHeight?, padding, fontSize }` |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | `{ paths, circles, texts }` dalam px, dengan label yang muat |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Label mana yang dipertahankan, dan di mana |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Lapisan hasil yang ditampilkan bergantian, yang labelnya mengalah kepada label lain tetapi tidak satu sama lain |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | Batas-batas sebuah scene, px |
| `project` | `(transform, anchor) => [number, number]` | Titik scene di layar, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Hasil yang ditampilkan gambar jika tidak diminta hasil tertentu |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | px per satuan SI untuk setiap hasil |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | Di sisi batang mana nilai positif digambar |
| `isBarStructure` | `(model, memberResults) => boolean` | Apakah N ditulis sebagai angka di sepanjang batang (rangka batang), bukan digambar sebagai diagram |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Posisi-posisi yang dapat ditempati sebuah nilai di luar ujung ordinat |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Semua lapisan, dalam urutan pelukisan |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Lapisan hasil |
| `HATCH_SPACING_PX` | `7` | Jarak antarordinat arsiran diagram, px |
| `DEFAULT_COLORS` | `PlotColors` | Warna bawaan setiap rona, sebagai CSS: [Tema dan warna](/id/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Warna tetap untuk file, yaitu warna aplikasi di atas putih |
| `toneVars` | `(colors?) => Record<string, string>` | Custom property yang dipasang gambar pada elemen akarnya |
| `PLOT_CSS` | `string` | Aturan CSS yang disisipkan ke setiap gambar |

`ResolveOptions` berbentuk `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }`: `shields` adalah grup yang garis-garisnya menghalangi label (diagram yang sedang tampil), semuanya jika tidak diisi. Di `layoutStructure`, `options.layers` adalah lapisan yang ditata (semua yang mungkin ditampilkan, seperti `reserve`), `shown` lapisan yang sedang tampil, dan `labelModes` gaya label yang tempatnya disiapkan.

Tipe: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart`, serta tipe-tipe model dari [Model gambar](/id/plot/model).
