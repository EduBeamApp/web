---
title: Çubuklar ve mafsallar
description: "Düğümleri Beam2D çubuklarıyla bağlayın, uç mafsalıyla momenti serbest bırakın, kafes çubuğu modelleyin, rijitlik ve dönüşüm matrislerini @edubeam/fem ile alın."
order: 5
source: site
---

# Çubuklar ve mafsallar {#members-and-hinges}

Her çubuk bir `Beam2D`'dir: x–z düzleminde, iki düğümlü, doğru eksenli bir Timoshenko kirişi; normal kuvvet, kesme kuvveti ve eğilme momenti taşır. Uçlarındaki mafsallar o noktadaki momenti serbest bırakır. Kod parçaları, [Başlarken](/tr/solver/getting-started) sayfasındaki gibi bir programın `solver`, `domain` ve `lc` değişkenlerini, `'steel'` malzemesini ve `'IPE200'` kesitini kullanır.

## Çubuk oluşturmak {#create-a-member}

```ts
domain.createBeam2D(label, [startNode, endNode], material, crossSection, hinges)
```

| Argüman | Tip | Anlamı |
| --- | --- | --- |
| `label` | `string \| number` | Çubuğun adı; metin olarak saklanır |
| `nodes` | `[label, label]` | İlk ve ikinci düğüm. Yerel x ilk düğümden ikinciye gider: bkz. [Çubuğun yönü](/tr/solver/conventions#member-direction). |
| `mat`, `cs` | `string \| number` | Bir malzemenin ve bir kesitin etiketleri |
| `hinges` | `[boolean, boolean]` | İlk düğümde ve ikinci düğümde mafsal. İsteğe bağlı; varsayılanı `[false, false]`, yani rijit uçlar. |

Metot `Beam2D` nesnesini döndürür: sonuçları okumak için onu saklayın. `domain.getElement(label)` çubuğu yeniden bulur, ama genel `Element` tipiyle döndürür; bu yüzden sonuç okumadan önce TypeScript sizden `as Beam2D` ister.

Bir düğümde mafsalsız birleşen çubuklar birbirine rijit bağlıdır: birlikte dönerler. Düğümleri, malzemeyi ve kesiti istediğiniz sırayla oluşturabilirsiniz; yeter ki çözüm anında hepsi var olsun. Eksik olan varsa `solve()` onun adını veren bir `RangeError` fırlatır.

## Uç mafsalları {#end-hinges}

Mafsal düğüme değil, çubuk ucuna aittir. Burada 2 numaralı çubuk C'de bir mafsalla başlar; bu yüzden C, C–D açıklığından A–C konsoluna kesme kuvvetini iletir ama moment iletmez:

```ts [hinge.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry])
domain.createNode('C', [2, 0, 0])
domain.createNode('D', [6, 0, 0], [DofID.Dz])
const ac = domain.createBeam2D(1, ['A', 'C'], 'steel', 'IPE200')
const cd = domain.createBeam2D(2, ['C', 'D'], 'steel', 'IPE200', [true, false])

lc.createBeamElementUniformEdgeLoad(2, [0, 10e3], true)
solver.solve()

cd.computeBendingMomentAt(lc, 0) // mafsalda 0
cd.computeBendingMomentAt(lc, 2) // 20000 N·m: 4 m'lik açıklığın qL²/8 değeri
ac.computeBendingMomentAt(lc, 0) // -40000 N·m: C–D'den gelen 20 kN, 2 m uzakta
```

::model-figure{caption="Mafsallı bir açıklığı taşıyan konsol: C'de moment yok"}
---
nodes: { A: [0, 0], C: [2, 0], D: [6, 0] }
supports: { A: fixed, D: roller }
members: [[A, C], { nodes: [C, D], hinges: [true, false] }]
loads:
  - { member: 2, qz: 10 }
results: [M, V]
show: [nodeLabels]
---
::

Mafsallı bir düğümde birkaç çubuk birleşiyorsa, biri dışındaki bütün çubuk uçlarına mafsal koymak yeterlidir. Her uca mafsal koymak da çalışır: o zaman düğümü döndüren hiçbir şey kalmaz ve çözücü düğümün dönmesini 0 olarak bildirir. Ama böyle bir düğüme etkiyen momenti taşıyacak hiçbir şey yoktur ve [çözüm başarısız olur](/tr/solver/solving#when-solving-fails).

## Kafes çubukları {#truss-bars}

İki ucu da mafsallı bir çubuk, yükler yalnızca düğümlerine etkidiği sürece sadece normal kuvvet taşır: böylece bir kafes çubuğu elde edersiniz.

```ts
domain.createBeam2D('AE', ['A', 'E'], 'steel', 'bar', [true, true])
```

[Kafes sistem örneği](/tr/solver/trusses) bütün bir kafes sistemi bu şekilde çözer. EduBeam uygulamasının kafes sistem örneği ise rijit düğümler kullanır; çubuk alanı o kadar büyüktür ki eğilme momentleri eksenel kuvvetlerin yanında ihmal edilebilir. İki model de geçerlidir; yalnızca bu küçük momentlerde ayrılırlar. Çubuğun kendi rijitlik matrisi, teori kılavuzunun [Kafes çubuğu](/tr/elements/truss) sayfasında çıkarılır.

## Elemanın matrisleri {#the-element-s-matrices}

Yöntemin kendisini öğretirken işinize yarar: bir `Beam2D` matrislerini [mathjs](https://mathjs.org) matrisleri olarak verir; `.toArray()` onları `number[][]` dizisine çevirir:

| Metot | Verdiği |
| --- | --- |
| `computeGeo()` | `{ l, dx, dz }`: boy ve izdüşümler, m |
| `computeLocalStiffnessMtrx().answer` | yerel eksenlerde 6 × 6 rijitlik matrisi, mafsallar statik yoğunlaştırmayla çıkarılmış |
| `computeT()` | global eksenlerden yerel eksenlere 6 × 6 dönüşüm matrisi |
| `computeStiffness()` | global eksenlerde 6 × 6 rijitlik matrisi, $T^T K_l T$ |
| `computeShearFactor()` | $\Phi = 12EI_y/kGAL^2$ |

```ts
ac.computeStiffness().toArray() // number[][]; N/m, N ve N·m
```

Serbestlik dereceleri $u_1, w_1, \varphi_1, u_2, w_2, \varphi_2$ sırasındadır. Bu matrisler teori kılavuzunun [Kiriş elemanı](/tr/elements/beam) sayfasında çıkarılır; nasıl birleştirildiklerini [EduBeam modeli nasıl çözer](/tr/elements/analysis) sayfası gösterir.
