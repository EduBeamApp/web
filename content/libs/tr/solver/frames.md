---
title: Çerçeveler
description: "Üç mafsallı bir çerçeve için eksiksiz bir @edubeam/fem programı: kolonlar, rijit köşeler ve tepe mafsalı; sonuçları elle kontrol edildi."
order: 13
source: site
---

# Çerçeveler {#frames}

Çerçeve, köşelerinde birbirine rijit bağlanmış kirişlerden ve kolonlardan oluşur. Bu örnek, [üç mafsallı çerçeve eğitimindeki](/tr/tutorials/three-hinged-frame) çerçeveyi kodla kurar: A ve E'de mafsallı mesnetli, 4 m yüksekliğinde iki kolon, C'de mafsalı olan 8 m açıklıklı bir kiriş ve kiriş üzerinde 10 kN/m. Eğitimde düğümler 1'den 5'e kadar numaralanır; burada A'dan E'ye kadar harflerle adlandırılır.

::model-figure{caption="Aşağıdaki programın çerçevesi: A ve E'de mafsallı mesnet, C'de mafsal, 10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// z aşağı bakar: 4 m'lik kolonların başları z = -4'te
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // tepe mafsalı
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // aşağıdan yukarı
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // C'de mafsal
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions bir mathjs Matrix ya da dizi verir: diziye çevirin
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [Çıktı]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Elle kontrol edin {#check-it-by-hand}

| Büyüklük | El hesabı | Çözücü |
| --- | --- | --- |
| Düşey mesnet tepkileri | $q \cdot 8/2 = 40$ kN yukarı | A ve E'de $R_z = -40$ kN |
| Yatay mesnet tepkileri | sol yarıda $M_C = 0$ koşulundan: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, içe doğru | A'da $R_x = +20$ kN, E'de $-20$ kN |
| Köşe momenti | $-20 \cdot 4 = -80$ kNm | kirişte ve kolonda $-80$ kNm |
| B'den 2 m uzakta moment | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Mafsaldaki moment | 0 | 0 |

## Dikkat edilecek noktalar {#things-to-notice}

- **Kolonlar yukarı uzanır, bu yüzden z negatiftir.** Kolon başları $z = -4$ noktasındadır.
- **Kolonun yerel eksenleri.** 1 numaralı çubuk A'dan yukarı, B'ye gider; bu yüzden yerel z ekseni sağa, çerçevenin içine bakar. Kolon başındaki moment, kirişin köşedeki momenti gibi −80 kNm'dir: dış yüzde çekme. Kolonu B'den aşağı, A'ya doğru tanımlarsanız yerel z sola bakar: moment işaret değiştirir ve `x` kolon başından başlar. Bkz. [Çubuğun yönü](/tr/solver/conventions#member-direction).
- **Bir mafsal, bir çubuk ucu.** Mafsal, 2 numaralı çubuğun C'deki ucundadır; 3 numaralı çubuk C'den rijit olarak başlar. C'nin mafsal olması için serbest bırakılmış tek bir uç yeterlidir.
- **Kirişte global yükler.** `false` yükü global eksenlerde verir: çubuğun eğimi ne olursa olsun düşey. Soldan sağa çizilmiş yatay bir kirişte bu, yerel eksenlerle aynıdır.

## Hiperstatik çerçeveler {#statically-indeterminate-frames}

Mafsalı kaldırın (`[false, false]`): çerçeve, bir derece hiperstatik bir portal çerçeveye dönüşür. Bu durumda iç kuvvetler, kirişin kolonlara göre ne kadar rijit olduğuna bağlıdır: bunu görmek için çubuklara farklı kesitler verin. [Eğitimdeki deneyler](/tr/tutorials/three-hinged-frame#_7-experiment) kolon ayaklarını ankastre yapar ve çerçeveyi yana iter; karşılaştıracağınız sayılar da oradadır. @edubeam/plot belgelerindeki [Slaytlar ve ders notları](/tr/plot/slides) sayfası böyle bir portal çerçeveyi adım adım çizer.
