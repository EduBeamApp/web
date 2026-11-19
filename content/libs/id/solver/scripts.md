---
title: Skrip dan server
description: "Pakai @edubeam/fem dari Node: lembar soal beserta kunci jawabannya, garis pengaruh dalam CSV, dan endpoint HTTP kecil yang menghitung balok sesuai permintaan."
order: 15
source: site
---

# Skrip dan server {#scripts-and-servers}

Solver ini tidak memerlukan browser. Di Node, solver dapat menulis kunci jawaban, menjalankan studi parametrik, membuat tabel untuk spreadsheet, atau menjawab permintaan dari halaman web.

Contoh-contohnya ditulis dalam TypeScript. Node 22.18 atau yang lebih baru menjalankan file `.ts` secara langsung (`node answers.ts`), di folder yang disiapkan seperti di [Instalasi](/id/solver/getting-started#install); pada Node yang lebih lama, hapus anotasi tipenya dan simpan sebagai `.mjs`.

## Lembar soal beserta kunci jawabannya {#answer-key}

Dua puluh variasi dari satu soal, yaitu balok sederhana dengan beban garis dan beban terpusat, masing-masing dengan reaksi dan momen terbesarnya, ditulis ke file CSV. Angka-angkanya ditentukan oleh nomor soal, sehingga skrip yang sama selalu menulis lembar yang sama:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Soal i: balok sederhana dengan beban q kN/m dan F kN sejauh a m dari A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // 4 sampai 7 m
  const q = 5 + 5 * (i % 3) // 5, 10, atau 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 atau 20 kN
  const a = L / 4 + (i % 3) // di suatu titik pada bentang
  return { L, q, F, a }
}

const solve = ({ L, q, F, a }: ReturnType<typeof exercise>) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  solver.solve()

  // Reaksi sama dengan gaya geser di ujung: V(0) di A, -V(L) di B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // Momen terbesar, dari titik-titik yang berjarak 1 cm
  const { x, M } = beam.computeBendingMoment(lc, L * 100)
  const top = M.indexOf(Math.max(...M))
  return [rA, rB, M[top] / 1e3, x[top]].map((v) => v.toFixed(2))
}

const rows = ['no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m']
for (let i = 1; i <= 20; i++) {
  const ex = exercise(i)
  rows.push([i, ex.L, ex.q, ex.F, ex.a, ...solve(ex)].join(','))
}
writeFileSync('answers.csv', rows.join('\n') + '\n')
```

```text [answers.csv]
no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m
1,5,10,20,2.25,36.00,34.00,55.69,2.25
2,6,15,10,3.5,49.17,50.83,80.58,3.28
3,7,5,20,1.75,32.50,22.50,50.63,2.50
...
```

Periksa soal pertama secara manual: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, dan gaya geser berganti tanda di bawah beban terpusat, sehingga momen terbesar berada di sana: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Dua pilihan membuat skrip ini tetap pendek. Pada balok sederhana, reaksi sama dengan gaya geser di ujung, sehingga [fungsi bantu reaksi](/id/solver/results#reactions) tidak diperlukan. Momen terbesar diambil dari titik-titik yang berjarak 1 cm, dan hasilnya eksak di sini karena nilai ekstremnya jatuh tepat di bawah beban atau dalam jarak satu sentimeter dari titik grid. Untuk menggambar setiap soal, dengan atau tanpa jawabannya, lihat [Soal latihan dan ujian](/id/plot/exercises) dari @edubeam/plot, yang juga mencetak satu ujian lengkap.

## Garis pengaruh sebagai CSV {#an-influence-line-as-csv}

Bagaimana momen di atas tumpuan tengah balok dua bentang berubah saat beban 1 kN melintasinya? Bangun dan hitung balok sekali untuk setiap posisi beban, lalu tulis satu baris untuk masing-masing:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Dua bentang 5 m, 1 kN sejauh `at` m dari A: momen di atas tumpuan tengah */
const momentAtB = (at: number): number => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [5, 0, 0], [DofID.Dz])
  domain.createNode('C', [10, 0, 0], [DofID.Dz])
  const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  const [member, x] = at <= 5 ? [1, at] : [2, at - 5]
  solver.loadCases[0].createBeamConcentratedLoad(member, [0, 1e3, 0, x], true)
  solver.solve()
  return span1.computeBendingMomentAt(solver.loadCases[0], 5)
}

const rows = ['x_m,MB_kNm_per_kN']
for (let at = 0; at <= 10; at += 0.5) {
  rows.push(`${at},${(momentAtB(at) / 1e3).toFixed(4)}`)
}
writeFileSync('influence.csv', rows.join('\n') + '\n')
```

```bash
node influence.ts
```

```text [influence.csv]
x_m,MB_kNm_per_kN
0,0.0000
0.5,-0.1237
1,-0.2400
1.5,-0.3412
2,-0.4200
2.5,-0.4688
3,-0.4800
...
```

Rumus tertutup untuk dua bentang yang sama panjang adalah $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $-0{,}46875$ kNm di $a = 2{,}5$ m, dan posisi terburuknya $a = L/\sqrt{3} = 2{,}887$ m. Garis pengaruhnya simetris, sehingga 21 baris itu berakhir seperti awalnya, dengan 0 di atas tumpuan C.

Solver baru untuk setiap posisi lebih sederhana daripada mengubah satu solver di tempat, dan hanya memakan beberapa milidetik. Untuk mengubah model yang sudah dihitung, lihat [Menghitung ulang setelah perubahan](/id/solver/solving#solving-again-after-a-change).

## Solver di balik endpoint HTTP {#a-solver-behind-an-http-endpoint}

Server kecil, hanya dengan modul `http` bawaan Node, yang menghitung balok sederhana untuk bentang dan beban berapa pun yang dikirimkan kepadanya:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** IPE 200 di atas dua tumpuan, bentang `span` m, `q` kN/m: M dan lendutan di tengah bentang */
const solveBeam = (span: number, q: number) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [span, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  solver.solve()
  return {
    momentKNm: beam.computeBendingMomentAt(lc, span / 2) / 1e3,
    deflectionMm: beam.computeLocalDefl(lc, 2).w[1] * 1e3,
  }
}

createServer(async (req, res) => {
  try {
    let body = ''
    for await (const chunk of req) body += chunk
    const { span, q } = JSON.parse(body) as { span?: unknown; q?: unknown }
    if (typeof span !== 'number' || !(span > 0) || typeof q !== 'number') {
      throw new Error('Bad input')
    }
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(solveBeam(span, q)) + '\n')
  } catch {
    // JSON rusak, angka tidak valid, atau model yang tidak dapat dihitung: server tetap berjalan
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm dan $5qL^4/384EI = 49{,}63$ mm. Blok `try` itu penting: JSON yang tidak valid memunculkan exception, dan model yang tidak dapat dihitung solver pun bisa demikian; keduanya tidak boleh menghentikan server. Layanan publik juga perlu membatasi ukuran permintaan dan panjang bentangnya.

## Di browser {#in-the-browser}

Kode yang sama berjalan apa adanya di halaman web, dan menghitung di perangkat pembaca: begitulah cara kerja setiap gambar interaktif di situs ini. Impor paketnya melalui bundler Anda, misalnya Vite atau Nuxt, dan [gambar hasilnya](/id/solver/drawing) dengan @edubeam/plot. Sebuah model terhitung dalam hitungan milidetik, sehingga halaman dapat menghitung ulang pada setiap event input.
