---
title: Çizim modeli
description: "Çözülmüş bir @edubeam/fem modelinden modelFromSolver ile üretilen, JSON'a dönüştürülebilen PlotModel; parçalı polinom sonuçlar, kesin değerler ve ekstremumlar."
order: 9
source: site
---

# Çizim modeli

@edubeam/plot kütüphanesinin çizdiği her şey bir `PlotModel` nesnesinden gelir: `modelFromSolver` fonksiyonunun çözülmüş bir @edubeam/fem modelinden okuduğu düz veri. Bu veri geometriyi, mesnetleri, yükleri, mesnet tepkilerini ve her çubuğun sonuçlarını kesin polinomlar olarak içerir. JSON'a dönüştürülebilir; bu sayede derleme (build) sırasında üretilip çözücü yerine gönderilebilir. Çözülmüş bir yapının kesin değerlerini ve ekstremumlarını okumanın da en kolay yolu budur.

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // veya modelFromSolver(solver, { loadCase: 1 })
```

`results` alanı yalnızca yükleme durumu çözülmüşse vardır. Bu alan olmadan bileşenler yalnızca modeli çizer; [`reactionLabels: 'names'`](/tr/plot/structure-plot#reactions-as-unknowns) ile bilinmeyen mesnet tepkilerini yine de çizerler. Böylece çözülmemiş bir model de bir föy olarak kullanılabilir.

## Biçim {#the-format}

Her şey SI birimlerindedir (m, N, N·m, N/m, K, rad) ve çözücünün eksenlerine göredir: x sağa, z aşağı, dönmeler ekranda saat yönünün tersine pozitif.

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // yalnızca çözülmüş bir yükleme durumu için
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // tutulu serbestlik dereceleri
  readonly angle: number // döndürülmüş bir mesnedin eksenlerinin açısı, rad, ekranda saat yönünde
}

interface PlotMember {
  readonly id: string
  readonly start: string // düğüm kimlikleri
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // çubuk kimliğine göre
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // normal kuvvet, çekme pozitif
  readonly V: Piecewise // kesme kuvveti
  readonly M: Piecewise // eğilme momenti, yerel +z tarafı çekmedeyken pozitif
  readonly u: Piecewise // yerel x boyunca yer değiştirme
  readonly w: Piecewise // yerel z boyunca yer değiştirme
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // düğüm ekseni doğrultusunda yapıya etkiyen kuvvet, N (ry için N·m)
}
```

Bir yük, `kind` alanıyla ayırt edilen yedi türden biridir:

| `kind` | Alanlar | Anlamı |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | bir düğüme etkiyen kuvvet, global bileşenler, N |
| `'nodalMoment'` | `node`, `my` | bir düğüme etkiyen moment, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | doğrusal değişen yayılı yük, her uçta `{ fx, fz }`, N/m; iki uç eşitse düzgün yayılı |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | çubuğun başlangıcından `at` metre uzaktaki bir kuvvet |
| `'pointMoment'` | `member`, `at`, `my` | bir çubuğa etkiyen tekil moment |
| `'temperature'` | `member`, `uniform`, `gradient` | K: ağırlık merkezindeki değişim ve alt lif ile üst lif arasındaki fark |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | düğüm eksenlerinde bir mesnet yer değiştirmesi, m ve rad |

Bileşenler global eksenler yerine çubuğun yerel x ve z eksenlerine göre verilmişse `local` değeri `true` olur.

## Parçalı polinomlar {#piecewise-polynomials}

Bir çubuğun sonucu bir `Piecewise` değeridir: her biri çubuğun bir bölümü üzerinde tanımlı bir polinom olan parçaların listesi. Tekil bir kuvvetin veya momentin sonucu kırdığı her noktada yeni bir parça başlar.

```ts
interface Piece {
  readonly x0: number // çubuğun başlangıcından uzaklık, m
  readonly x1: number
  readonly c: readonly number[] // değer = Σ c[k]·sᵏ, burada s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V ve M en fazla kübik, sehim ise en fazla beşinci derecedendir; bu yüzden birkaç katsayı çözücünün sonucunu tam olarak saklar. 2 m'de 20 kN tekil yük taşıyan 6 m'lik bir kirişin kesme kuvveti iki sabit parçadan oluşur:

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## Değerleri kendiniz okuyun {#reading-values-yourself}

Diyagramları çizen fonksiyonlar onları okuyabilir de; örnekleme yapmadan, kesin olarak:

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// 6 m açıklıklı basit mesnetli kiriş, A'dan 2 m uzakta 20 kN, kaymada rijit IPE 200
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: parçalar yükün altında birleşir
valueAt(V, 2, 'left') // 13333.3 N, yükün hemen solunda
valueAt(V, 2, 'right') // -6666.7 N, yükün hemen sağında
extremes(M) // en büyük 26666.7 N·m, x = 2'de
extremes(w) // en büyük 0.018973 m, x = 2.734'te
```

`extremes`, her biri `{ x, value, side }` olan `{ max, min }` döndürür; boş bir liste için `null` döndürür. En büyük sehim yükün altında değildir: $x = L - \sqrt{(L^2 - a^2)/3} = 2{,}734$ m noktasındadır ve değeri, ortada olmayan tekil yük formülünün verdiği gibi $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18{,}97$ mm'dir.

[Soru üreteci](/tr/plot/exercises#the-generator) cevap anahtarı için en büyük momentleri bu şekilde bulur. Geri kalanlar, yani eğimler, bir parçanın içindeki ekstremumlar, polinom dereceleri ve Bézier eğrileri, [Fonksiyonlar](/tr/plot/functions#piecewise-polynomials) sayfasında listelenir.

## JSON olarak gönderin {#ship-it-as-json}

`JSON.stringify(model)` yeterlidir; `JSON.parse` ise çözücünün çizdiğinin aynısını çizen bir model geri verir. Yayılı yük ve tekil yük taşıyan bir portal çerçeve 2 kB'tan küçüktür. Bkz. [Sayfalara gömme](/tr/plot/embedding#ship-the-drawing-not-the-solver). Bir model, onu SVG dosyası olarak yazan [`structureSvg`](/tr/plot/functions#a-standalone-svg-file) fonksiyonuna da verilebilir.
