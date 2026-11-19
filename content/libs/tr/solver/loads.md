---
title: Düğüm ve çubuk yükleri
description: "@edubeam/fem ile düğümlere kuvvet ve moment, çubuklara düzgün yayılı, trapez ve tekil yük uygulayın (global veya yerel eksenlerde); değiştirin ya da kaldırın."
order: 6
group: Yükler
source: site
---

# Düğüm ve çubuk yükleri {#nodal-and-member-loads}

Yükler bir yükleme durumuna aittir. Çözücü tek bir yükleme durumuyla (`solver.loadCases[0]`) başlar; bu nesnenin her `create…` metodu bir yük ekler ve o yükü döndürür. Birden fazla yükleme durumu ve kombinasyonları için bkz. [Yükleme durumları](/tr/solver/load-cases).

Değerler N, N/m ve N·m cinsindendir ve [eksenlere](/tr/solver/conventions#axes) uyar: +z aşağıdır, pozitif moment saat yönünün tersinedir.

## Her tür yükü taşıyan bir kiriş {#a-beam-with-every-kind}

Mafsallı ve kayıcı mesnetli, 8 m açıklıklı bir kiriş: 4 kN/m'den 10 kN/m'ye artan yayılı yük, 20 kN tekil yük, 10 kNm tekil moment ve kayıcı mesnette yatay bir kuvvet taşıyor:

```ts [loads.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // mafsallı mesnet
domain.createNode('B', [8, 0, 0], [DofID.Dz]) // kayıcı mesnet
domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
// A'da 4 kN/m, B'de 10 kN/m'ye artıyor, aşağı doğru
lc.createBeamElementTrapezoidalEdgeLoad(1, [0, 4e3], [0, 10e3], false)
// [fx, fz, my, a]: 20 kN aşağı, A'dan 2 m uzakta
lc.createBeamConcentratedLoad(1, [0, 20e3, 0, 2], false)
// saat yönünün tersine 10 kNm tekil moment, A'dan 6 m uzakta
lc.createBeamConcentratedLoad(1, [0, 0, 10e3, 6], false)
// B'de sağa doğru 5 kN
lc.createNodalLoad('B', { [DofID.Dx]: 5e3 })
solver.solve()

// getReactions bir mathjs Matrix ya da dizi verir: diziye çevirin
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

console.log(list(domain.getNode('A').getReactions(lc).values))
console.log(list(domain.getNode('B').getReactions(lc).values))
```

```text [Çıktı]
[ -5000, -40250 ]
[ -35750 ]
```

El hesabıyla: yayılı yükün bileşkesi 56 kN'dur ve A'dan 4,571 m uzakta etkir. A'ya göre moment alınırsa $8R_B = 56 \cdot 4{,}571 + 20 \cdot 2 - 10 = 286$, yani $R_B = 35{,}75$ kN yukarı ve $R_A = 76 - 35{,}75 = 40{,}25$ kN yukarı. Mafsallı mesnet 5 kN'luk kuvveti de karşılar; bu yüzden bütün kirişte 5 kN çekme oluşur.

::model-figure{caption="Aynı yükler. Şekilde tekil moment 6 m'deki bir C düğümüne konmuştur; sonuçlar aynıdır."}
---
nodes: { A: [0, 0], C: [6, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: [4, 8.5] }
  - { member: 2, qz: [8.5, 10] }
  - { member: 1, pz: 20, at: 2 }
  - { node: C, my: 10 }
  - { node: B, fx: 5 }
results: [M]
show: [nodeLabels]
labels: horizontal
---
::

## Düğüm yükleri {#nodal-loads}

```ts
lc.createNodalLoad(node, { [DofID.Dx]: fx, [DofID.Dz]: fz, [DofID.Ry]: my }, lcs)
```

Yalnızca gereken bileşenleri verin. Değerler global eksenlerdedir; `lcs` değeri `true` ise [`updateLcs`](/tr/solver/nodes-supports#inclined-supports) ile döndürülmüş bir düğümün kendi eksenlerindedir. Mesnedin tuttuğu bir serbestlik derecesine etkiyen kuvvet doğrudan mesnet tepkisine gider ve hiçbir şeyi eğmez.

## Çubuk yükleri {#member-loads}

| Metot | Değerler | Yük |
| --- | --- | --- |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | N/m | bütün çubuk boyunca düzgün yayılı |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | N/m | ilk düğümden ikinciye doğrusal değişen |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | N, N·m, m | ilk düğümden `a` metre uzakta bir kuvvet ve bir tekil moment |

Yayılı yükler her zaman çubuğun tamamını kaplar. Açıklığın bir kısmına etkiyen yük için çubuğu yükün başladığı noktaya bir düğüm koyarak bölün: fazladan bir düğüm hiçbir sonucu değiştirmez. Tekil yük veya tekil moment ise çubuk üzerinde herhangi bir noktada olabilir.

### Global veya yerel eksenler {#global-or-local-axes}

Son argüman `lcs`, bileşenlerin hangi eksenlerde verildiğini söyler:

- `false`: global x ve z. `fz`, çubuğun eğimi ne olursa olsun düşey etkir.
- `true`: çubuğun yerel x ekseni (çubuk boyunca) ve z ekseni (çubuğa dik). `fz` çubuğa dik etkir.

Soldan sağa çizilmiş yatay bir çubukta ikisi aynıdır; sağdan sola çizilmişse yerel `fz` yukarı bakar.

::callout{type="info" title="Yayılı yükler çubuğun metresi başınadır"}
İki tür de çubuğun kendi boyunun metresi başına etkir. Yatayda 4 m açıklık geçen 5 m uzunluğundaki bir mertekte global eksenlerde verilen `[0, 10e3]` toplam 50 kN eder. Yatay izdüşümün metresi başına 10 kN/m olan bir kar yükü, mertek boyunca $10 \cdot 4/5 = 8$ kN/m'dir: `[0, 8e3]` verin.
::

## Yükü değiştirmek veya kaldırmak {#change-or-remove-a-load}

Her `create…` metodu yükü döndürür. Değerlerini değiştirin ve yeniden çözün:

```ts
const q = lc.createBeamElementUniformEdgeLoad(1, [0, 10e3], true)
solver.solve()
q.values = [0, 20e3] // iki katı yük
solver.solve()
```

Yükler sıradan dizilerde durur: `lc.nodalLoadList` ve `lc.elementLoadList` (çubuk ve sıcaklık yükleri); bu yüzden `lc.elementLoadList.splice(index, 1)` bir yükü kaldırır. Her yükün özellik adları [API başvurusunda](/tr/solver/reference#loads) bulunur.

Sıcaklık değişimleri ve mesnet çökmeleri de yüktür: bkz. [Sıcaklık ve mesnet çökmeleri](/tr/solver/temperature-settlements).
