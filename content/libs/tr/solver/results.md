---
title: Sonuçları okumak
description: "Çözülmüş @edubeam/fem modelinden mesnet tepkilerini, yer değiştirmeleri, iç kuvvetleri, elastik eğriyi ve uç kuvvetlerini okuyun; her çağrının dönüş değeriyle."
order: 10
source: site
---

# Sonuçları okumak {#reading-results}

`solve()` çağrısından sonra sonuçlar, belirli bir yükleme durumu için düğümlerden ve çubuklardan okunur. Bu sayfadaki bütün örnekler aynı modeli okur: kayma rijitliği sonsuz kabul edilen IPE 200 kesitli, 6 m açıklıklı basit mesnetli bir kiriş; A'dan 2 m uzakta 20 kN tekil yük taşıyor:

```ts [results.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 }) // kayma rijitliği sonsuz

const A = domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
const B = domain.createNode('B', [6, 0, 0], [DofID.Dz])
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
const lc = solver.loadCases[0]
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], true)
solver.solve()
```

::model-figure{caption="6 m'lik açıklıkta, 2 m'de 20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M, w]
show: [nodeLabels]
---
::

## Neyi nereden okursunuz? {#what-to-read-where}

| Sonuç | Çağrı | Döndürdüğü |
| --- | --- | --- |
| Mesnet tepkileri | `node.getReactions(lc)` | `{ dofs, values }`: N, N·m |
| Yer değiştirmeler | `node.getUnknowns(lc, dofs)` | m, rad |
| Bir noktada N, V veya M | `beam.computeBendingMomentAt(lc, x)` | bir sayı: N, N·m |
| Çubuk boyunca N, V veya M | `beam.computeBendingMoment(lc, n)` | `{ x, M }`, n + 1 nokta |
| Elastik eğri | `beam.computeLocalDefl(lc, n)` | `{ u, w }`, n + 1 nokta, m |
| Çubuk uç kuvvetleri | `beam.computeEndForces(lc)` | 6 elemanlı bir mathjs matrisi |

N ve V için metotlar `computeNormalForceAt` ve `computeShearForceAt`, `computeNormalForce` ve `computeShearForce`'tur; son ikisi `{ x, N }` ve `{ x, V }` döndürür. İşaretler [Birimler ve işaretler](/tr/solver/conventions#signs-of-the-results) sayfasındadır.

## Mesnet tepkileri {#reactions}

`getReactions`, mesnedin tuttuğu her serbestlik derecesi için bir tepki verir: `dofs` bunları `createNode`'a verildikleri sırayla listeler, `values` da tepkileri aynı sırayla tutar. Birden fazla tepki varsa `values` bir **mathjs matrisi**, tek tepki varsa sıradan bir dizidir; bu yüzden küçük bir yardımcı fonksiyon onu her durumda diziye çevirir:

```ts
/** Bir mathjs Matrix'i, diziyi veya sayıyı sıradan bir diziye çevirir. */
const list = (v: unknown): number[] =>
  typeof v === 'number'
    ? [v]
    : Array.isArray(v)
      ? v
      : (v as { toArray(): number[] }).toArray()

A.getReactions(lc).dofs // [0, 2]: DofID.Dx, DofID.Dz
list(A.getReactions(lc).values) // [0, -13333.3]
list(B.getReactions(lc).values) // [-6666.7]
```

Sıradan bağımsız olarak tek bir tepkiyi almak için serbestlik derecesini arayın: `list(values)[dofs.indexOf(DofID.Dz)]`; [sürekli kiriş örneği](/tr/solver/beams#a-continuous-beam) de böyle yapar.

Mesnet tepkisi, mesnedin yapıya uyguladığı kuvvettir: z doğrultusunda −13 333 N, yukarı iten 13,3 kN demektir, $P\,b/L = 20 \cdot 4/6$. [Eksenleri döndürülmüş](/tr/solver/nodes-supports#inclined-supports) bir düğümde tepkiler o eksenlerdedir; `getReactions(lc, true)` onları global eksenlere çevirir ve üç serbestlik derecesinin hepsini döndürür, tutulmayanlar için 0 ile. Mesnedi olmayan bir düğüm `{ dofs: [], values: [] }` verir.

## Yer değiştirmeler {#displacements}

`getUnknowns`, mesnetli olsun olmasın bir düğümün istediğiniz serbestlik derecelerini okur:

```ts
list(A.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])) // [0, 0, -0.0108924]
```

A, saat yönünde 0,010892 rad döner: $P\,b\,(L^2 - b^2)/6EIL$. Tek bir serbestlik derecesi istendiğinde `getUnknowns`, TypeScript bir matris bildirdiği hâlde sıradan bir sayı döndürür: `list` bunu da halleder.

## Çubuk boyunca iç kuvvetler {#internal-forces-along-a-member}

`…At` metotları, çubuğun ilk düğümünden `x` metre uzaktaki değeri verir:

```ts
beam.computeShearForceAt(lc, 1) // 13333.3 N
beam.computeShearForceAt(lc, 2) // -6666.7 N: yükün olduğu noktada, yükten sonraki değer
beam.computeBendingMomentAt(lc, 2) // 26666.7 N·m: R_A · 2
```

Tekil yük diyagramda bir sıçrama oluşturur; tam yükün olduğu noktada okunan değer, yükün öbür tarafındaki değerdir. Yükten önceki değeri okumak için yükün çok az gerisindeki bir noktayı sorun, örneğin `x - 1e-9`.

Dizi döndüren metotlar çubuğu, uçlar dahil, eşit aralıklı n + 1 noktada örnekler:

```ts
beam.computeBendingMoment(lc, 3)
// { x: [0, 2, 4, 6], M: [0, 26666.7, 13333.3, 0] }, yuvarlama hatası dışında
```

Kesin değerin 0 olduğu yerlerde `-3.6e-12` gibi yuvarlama hataları bekleyin: sayıları yazdırmadan önce `toFixed` ile biçimlendirin. Çubuk boyunca en büyük değer, [sürekli kiriş örneğinde](/tr/solver/beams#a-continuous-beam) olduğu gibi, `computeBendingMoment(lc, 500)` gibi sık bir örneklemenin en büyük değeridir. Yayılı yükler altında M bir polinomdur; kesin uç değeri V'nin sıfırdan geçtiği yerdedir. [@edubeam/plot](/tr/plot/model#reading-values-yourself) bu noktayı tam olarak bulur.

## Elastik eğri {#deflected-shape}

```ts
beam.computeLocalDefl(lc, 3)
// { u: [0, 0, 0, 0], w: [0, 0.0174279, 0.0152494, 0] }
```

`computeLocalDefl`, çubuk boyunca ve çubuğa dik yer değiştirmeleri, `u` ve `w`, yerel eksenlerde verir; `computeGlobalDefl` aynı noktaları global x ve z'de verir. Yükün altındaki 17,43 mm'lik sehim $P\,a^2 b^2/3EIL$ formülünden çıkar. Düğümler arasındaki şekil kesindir; uç değerlerinden interpolasyonla bulunmaz. Çizmek için bkz. [Sonuçları çizmek](/tr/solver/drawing).

## Çubuk uç kuvvetleri {#end-forces}

```ts
beam.computeEndForces(lc).toArray()
// [0, -13333.3, 0, 0, -6666.7, 0]: X12, Z12, M12, X21, Z21, M21
```

İki düğümün çubuğa uyguladığı kuvvetler, çubuğun yerel eksenlerinde: uygulamadaki *Eleman sonuçları* tablosunun sayıları. Ayrıntılar [Çubuk uç kuvvetleri](/tr/elements/conventions#end-forces-element-results-table) bölümündedir.

## Kontrol edilebilir sonuçlar {#results-as-numbers-to-check}

Yukarıdaki her değer kendi kapalı form formülüyle örtüşür. [Sonuçların elle kontrolü](/tr/guide/verification) sayfası çok daha fazla ders kitabı örneğini ele alır; hepsi bu aynı çözücüyle, tarayıcınızda çözülür.
