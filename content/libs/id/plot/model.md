---
title: Model gambar
description: "PlotModel: data biasa yang dapat diserialkan ke JSON, dibuat modelFromSolver dari model terhitung, berisi hasil sebagai polinomial per bagian dan nilai eksaknya."
order: 9
source: site
---

# Model gambar {#plot-model}

Semua yang digambar @edubeam/plot berasal dari `PlotModel`: data biasa yang dibaca `modelFromSolver` dari model @edubeam/fem yang sudah dihitung. Isinya geometri, tumpuan, beban, reaksi, dan hasil setiap batang sebagai polinomial eksak. Model ini dapat diserialkan ke JSON, sehingga dapat dibuat saat build dan dikirim sebagai pengganti solver, dan merupakan cara termudah untuk membaca nilai eksak dan nilai ekstrem dari struktur yang sudah dihitung.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // atau modelFromSolver(solver, { loadCase: 1 })
```

`results` hanya ada jika kasus bebannya sudah dihitung. Tanpa `results`, komponen hanya menggambar modelnya, dan dengan [`reactionLabels: 'names'`](/id/plot/structure-plot#reactions-as-unknowns) tetap menggambar reaksi yang dicari, sehingga model yang belum dihitung dapat menjadi lembar soal.

## Format {#the-format}

Semua dalam satuan SI (m, N, N·m, N/m, K, rad) dan dalam sumbu solver: x ke kanan, z ke bawah, rotasi positif berlawanan arah jarum jam di layar.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // hanya untuk kasus beban yang sudah dihitung
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // DOF yang ditahan
  readonly angle: number // putaran sumbu tumpuan yang diputar, rad, searah jarum jam di layar
}

interface PlotMember {
  readonly id: string
  readonly start: string // id joint
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // menurut id batang
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // gaya normal, tarik positif
  readonly V: Piecewise // gaya geser
  readonly M: Piecewise // momen lentur, positif jika sisi +z lokal tertarik
  readonly u: Piecewise // perpindahan searah x lokal
  readonly w: Piecewise // perpindahan searah z lokal
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // gaya pada struktur searah sumbu joint, N (N·m untuk ry)
}
```

Beban terdiri atas tujuh jenis, yang dibedakan oleh `kind`:

| `kind` | Properti | Arti |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | gaya di joint, komponen global, N |
| `'nodalMoment'` | `node`, `my` | momen di joint, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | beban garis yang berubah linear, `{ fx, fz }` di setiap ujung, N/m; merata jika keduanya sama |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | gaya sejauh `at` meter dari awal batang |
| `'pointMoment'` | `member`, `at`, `my` | momen terpusat pada batang |
| `'temperature'` | `member`, `uniform`, `gradient` | K: perubahan suhu di titik berat, dan suhu sisi bawah dikurangi sisi atas |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | perpindahan tumpuan dalam sumbu joint, m dan rad |

`local` bernilai `true` jika komponennya searah sumbu x dan z lokal batang, bukan sumbu global.

## Polinomial per bagian {#piecewise-polynomials}

Hasil sebuah batang berupa `Piecewise`: daftar bagian, masing-masing polinomial pada sebagian panjang batang. Bagian baru dimulai di setiap tempat beban terpusat atau momen terpusat memutus hasilnya.

```ts
interface Piece {
  readonly x0: number // m dari awal batang
  readonly x1: number
  readonly c: readonly number[] // nilai = Σ c[k]·sᵏ, dengan s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V dan M paling tinggi berderajat tiga, dan lendutan paling tinggi berderajat lima, sehingga beberapa koefisien sudah cukup untuk menyimpan jawaban solver secara eksak. Gaya geser balok 6 m dengan beban 20 kN di 2 m terdiri atas dua bagian konstan:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Membaca nilai sendiri {#reading-values-yourself}

Fungsi-fungsi yang menggambar diagram juga dapat membacanya, secara eksak dan tanpa pengambilan sampel:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// balok sederhana 6 m, 20 kN sejauh 2 m dari A, IPE 200 kaku terhadap geser
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: bagian-bagiannya bertemu di bawah beban
valueAt(V, 2, 'left') // 13333.3 N, tepat sebelum beban
valueAt(V, 2, 'right') // -6666.7 N, tepat sesudahnya
extremes(M) // max 26666.7 N·m di x = 2
extremes(w) // max 0.018973 m di x = 2.734
```

`extremes` mengembalikan `{ max, min }`, masing-masing berbentuk `{ x, value, side }`, atau `null` untuk daftar kosong. Lendutan terbesar tidak berada di bawah beban, tetapi di $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m, dan besarnya $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm, sesuai rumus untuk beban yang tidak di tengah bentang.

Dengan cara inilah [pembangkit soal](/id/plot/exercises#the-generator) mencari momen ekstrem untuk kunci jawabannya. Halaman [Fungsi](/id/plot/functions#piecewise-polynomials) mencantumkan sisanya: kemiringan, ekstrem di dalam satu bagian, derajat polinomial dan kurva Bézier.

## Kirim sebagai JSON {#ship-it-as-json}

Cukup `JSON.stringify(model)`, dan `JSON.parse` mengembalikan model yang tergambar persis seperti dari solvernya. Portal dengan satu beban garis dan satu beban terpusat berukuran kurang dari 2 kB. Lihat [Menyematkan](/id/plot/embedding#ship-the-drawing-not-the-solver). Model juga dapat diberikan ke [`structureSvg`](/id/plot/functions#a-standalone-svg-file), yang menuliskannya sebagai file SVG.
