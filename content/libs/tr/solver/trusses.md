---
title: Kafes sistemler
description: "@edubeam/fem ile mafsal düğümlü bir Warren kafes kirişi, kesim yöntemiyle kontrol edilen çubuk kuvvetleri ve istenen sayıda gözlü kafes sistem üreten bir döngü."
order: 14
source: site
---

# Kafes sistemler {#trusses}

Kafes sistem, iki ucu mafsallı ve düğümlerinden yüklenen çubuklardan oluşur; bu yüzden her çubuk yalnızca normal kuvvet taşır. Bu örnek, iki listeden bir Warren kafes kirişi kurar, her çubuk kuvvetini elle kontrol eder, sonra bir döngüyle istenen büyüklükte kafes sistemler üretir.

::model-figure{caption="Bir Warren kafes kirişi: 9 m açıklık, 1,8 m yükseklik, her üst düğümde 8 kN"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members:
  - { nodes: [A, B], hinges: [true, true] }
  - { nodes: [B, C], hinges: [true, true] }
  - { nodes: [C, D], hinges: [true, true] }
  - { nodes: [E, F], hinges: [true, true] }
  - { nodes: [F, G], hinges: [true, true] }
  - { nodes: [A, E], hinges: [true, true] }
  - { nodes: [E, B], hinges: [true, true] }
  - { nodes: [B, F], hinges: [true, true] }
  - { nodes: [F, C], hinges: [true, true] }
  - { nodes: [C, G], hinges: [true, true] }
  - { nodes: [G, D], hinges: [true, true] }
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: [N, w]
show: [nodeLabels]
---
::

```ts [truss.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })

// Warren kafes kirişi: 9 m açıklık, 1,8 m yükseklik, alt başlık A-B-C-D, üst başlık E-F-G
const nodes: [string, number, number, DofID[]][] = [
  ['A', 0, 0, [DofID.Dx, DofID.Dz]],
  ['B', 3, 0, []],
  ['C', 6, 0, []],
  ['D', 9, 0, [DofID.Dz]],
  ['E', 1.5, -1.8, []],
  ['F', 4.5, -1.8, []],
  ['G', 7.5, -1.8, []],
]
for (const [label, x, z, support] of nodes) {
  domain.createNode(label, [x, 0, z], support)
}

// Her etiket çubuğun iki düğümünü adlandırır. İki ucu mafsallı: yalnızca normal kuvvet.
const bars = ['AB', 'BC', 'CD', 'EF', 'FG', 'AE', 'EB', 'BF', 'FC', 'CG', 'GD']
const members = bars.map((bar) =>
  domain.createBeam2D(bar, [bar[0], bar[1]], 1, 1, [true, true])
)

const lc = solver.loadCases[0]
for (const top of ['E', 'F', 'G']) {
  lc.createNodalLoad(top, { [DofID.Dz]: 8e3 }) // 8 kN aşağı
}
solver.solve()

for (const bar of members) {
  const n = bar.computeNormalForceAt(lc, 0) / 1e3
  console.log(bar.label, n.toFixed(2), n > 0 ? 'tension' : 'compression')
}
```

```text [Çıktı]
AB 10.00 tension
BC 16.67 tension
CD 10.00 tension
EF -13.33 compression
FG -13.33 compression
AE -15.62 compression
EB 5.21 tension
BF -5.21 compression
FC -5.21 compression
CG 5.21 tension
GD -15.62 compression
```

Bir çubuğun normal kuvveti sabittir; bu yüzden onu `x = 0`'da okumak yeterlidir. İki harfli etiketler aynı zamanda düğüm çiftleridir: `bar[0]` ve `bar[1]`.

## Elle kontrol edin {#check-it-by-hand}

Her mesnet 24 kN'un yarısını, 12 kN'u taşır. Kafes sistemi bir kesimle ikiye ayırın ve [kesim yönteminde](/tr/tutorials/truss) olduğu gibi kesilen çubuğun karşısındaki düğüme göre moment yazın:

| Çubuk | Kesim | Kuvvet |
| --- | --- | --- |
| BC, alt başlık | F'ye göre moment: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$ | 16,67 kN çekme |
| EF, üst başlık | B'ye göre moment: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$ | 13,33 kN basınç |
| AE, uç diyagonali | A düğümü: $12 \cdot \sqrt{1{,}5^2 + 1{,}8^2}/1{,}8$ | 15,62 kN basınç |
| EB, diyagonal | gözdeki kesme kuvveti, $12 - 8 = 4$ kN: $4 \cdot 2{,}343/1{,}8$ | 5,21 kN çekme |

Kesit, izostatik bir kafes sistemin çubuk kuvvetlerini değiştirmez; yalnızca düğümlerin ne kadar yer değiştireceğini belirler. Yukarıdaki şekil başka bir kesitle, EduBeam uygulamasının kesitiyle çözülmüştür ve aynı kuvvetleri verir.

## İstenen sayıda göz {#any-number-of-panels}

Alıştırmalar ya da bir parametre çalışması için kafes sistem üretmek istiyorsanız düğümleri ve çubukları bir döngüde, göz göz kurun. `panels = 3` ile bu, yukarıdaki kafes sistemdir ve aynı kuvvetleri yazdırır; başka bir sistem için `panels`, `w` ve `h` değerlerini değiştirin.

```ts [warren.ts]
import { type Beam2D, DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 1e-3, iy: 1e-6, k: 1e32 })
const lc = solver.loadCases[0]

const panels = 3 // alt başlıktaki göz sayısı
const w = 3 // göz genişliği, m
const h = 1.8 // yükseklik, m

// Alt düğümler b0, b1, … mafsallı ve kayıcı mesnet üzerinde; üst düğümler t0, t1, … aralarında
for (let i = 0; i <= panels; i++) {
  const ends = i === 0 ? [DofID.Dx, DofID.Dz] : i === panels ? [DofID.Dz] : []
  domain.createNode(`b${i}`, [i * w, 0, 0], ends)
}
for (let i = 0; i < panels; i++) {
  domain.createNode(`t${i}`, [(i + 0.5) * w, 0, -h])
  lc.createNodalLoad(`t${i}`, { [DofID.Dz]: 8e3 })
}

const members: Beam2D[] = []
const bar = (a: string, b: string) =>
  members.push(domain.createBeam2D(`${a}-${b}`, [a, b], 1, 1, [true, true]))
for (let i = 0; i < panels; i++) {
  bar(`b${i}`, `b${i + 1}`) // alt başlık
  bar(`b${i}`, `t${i}`) // yukarı giden diyagonal
  bar(`t${i}`, `b${i + 1}`) // aşağı inen diyagonal
  if (i > 0) bar(`t${i - 1}`, `t${i}`) // üst başlık
}
solver.solve()

for (const m of members) {
  console.log(m.label, (m.computeNormalForceAt(lc, 0) / 1e3).toFixed(2))
}
```

Çözüm süresi model büyüdükçe hızla artar: birkaç düzine göz sorunsuz çözülür, bkz. [Model büyüklüğü](/tr/solver/solving#model-size). Üretilen her kafes sistemi cevaplarıyla ya da cevapsız çizmek için @edubeam/plot kütüphanesinin [Alıştırmalar ve sınavlar](/tr/plot/exercises) sayfasına bakın.

## Dikkat edilecek noktalar {#things-to-notice}

- **Her çubuk ucunda mafsal.** Bu durumda her düğüm serbestçe dönebilir ve çözücü düğümün dönmesini 0 olarak bildirir. Böyle bir düğüme etkiyen momenti taşıyacak hiçbir şey yoktur ve [çözüm başarısız olur](/tr/solver/solving#when-solving-fails).
- **Yükler düğümlerde.** Çubuk boyunca etkiyen bir yük çubuğu eğer: o zaman çubuk bir kafes çubuğu değil, bir kiriştir ve moment diyagramı oluşur.

[Düzlem kafes sistem eğitimi](/tr/tutorials/truss) EduBeam uygulamasında bir kafes sistem kurar; [Kafes çubuğu](/tr/elements/truss) sayfası da çubuğun rijitlik matrisini çıkarır.
