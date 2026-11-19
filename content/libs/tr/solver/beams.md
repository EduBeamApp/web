---
title: Kirişler
description: "Bir konsol ve iki açıklıklı sürekli kiriş için eksiksiz @edubeam/fem programları, çıktılarıyla; her biri ders kitabındaki formülüyle kontrol edildi."
order: 12
group: Örnek programlar
source: site
---

# Kirişler {#beams}

Kopyalayıp değiştirebileceğiniz iki eksiksiz program. İkisi de kayma rijitliği sonsuz bir kesit kullanır (`k: 1e32`); bu yüzden sonuçları Euler–Bernoulli formülleriyle tam olarak örtüşür. Onları [Kurulum](/tr/solver/getting-started#install) bölümündeki gibi hazırlanmış bir klasörde `node cantilever.ts` ile çalıştırın (Node 22.18 veya sonrası).

## Konsol kiriş {#a-cantilever}

4 m uzunluğunda, A'da ankastre, serbest ucunda aşağı doğru 18 kN:

```ts [cantilever.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // ankastre
const tip = domain.createNode('B', [4, 0, 0]) // serbest
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

const lc = solver.loadCases[0]
lc.createNodalLoad('B', { [DofID.Dz]: 18e3 }) // konsol ucunda aşağı doğru 18 kN
solver.solve()

console.log(beam.computeBendingMomentAt(lc, 0)) // ankastre uçta, N·m
console.log(tip.getUnknowns(lc, [DofID.Dz])) // konsol ucunun sehimi, m
```

```text [Çıktı]
-72000
0.09411072715241528
```

$M_A = -FL = -72$ kNm, yani negatif moment (üst lifler çekmede); $EI = 4{,}0803$ MNm² ile konsol ucunun sehimi $FL^3/3EI = 94{,}11$ mm'dir. Aynı konsol, EduBeam uygulamasının örneklerinden biridir.

## Sürekli kiriş {#a-continuous-beam}

Üç mesnet üzerinde 5 m'lik iki açıklık, ikisinde de 10 kN/m. Mesnet tepkileri, orta mesnet üzerindeki moment ve en büyük açıklık momenti:

```ts [continuous.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
domain.createNode('B', [5, 0, 0], [DofID.Dz])
domain.createNode('C', [10, 0, 0], [DofID.Dz])
const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
domain.createBeam2D(2, ['B', 'C'], 1, 1)

const lc = solver.loadCases[0]
for (const span of [1, 2]) {
  lc.createBeamElementUniformEdgeLoad(span, [0, 10e3], true)
}
solver.solve()

// getReactions bir mathjs Matrix ya da dizi verir: diziye çevirin
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()

for (const label of ['A', 'B', 'C']) {
  const { dofs, values } = domain.getNode(label).getReactions(lc)
  const rz = list(values)[dofs.indexOf(DofID.Dz)]
  console.log(`R${label} = ${(-rz / 1e3).toFixed(2)} kN up`)
}
const mB = span1.computeBendingMomentAt(lc, 5)
console.log(`MB = ${(mB / 1e3).toFixed(2)} kNm`)

// 1. açıklıktaki en büyük pozitif moment, açıklık boyunca 501 noktadan
const { x, M } = span1.computeBendingMoment(lc, 500)
const i = M.indexOf(Math.max(...M))
console.log(`max M = ${(M[i] / 1e3).toFixed(2)} kNm at x = ${x[i]} m`)
```

```text [Çıktı]
RA = 18.75 kN up
RB = 62.50 kN up
RC = 18.75 kN up
MB = -31.25 kNm
max M = 17.58 kNm at x = 1.87 m
```

Eşit iki açıklık için ders kitabı değerleri: $R_A = R_C = 0{,}375\,qL$, $R_B = 1{,}25\,qL$, $M_B = -qL^2/8$; en büyük açıklık momenti $R_A^2/2q = 17{,}58$ kNm'dir ve $x = R_A/q = 1{,}875$ m'dedir. Örnekleme onu 1,87 m'deki örnekleme noktasında bulur; gerçek değerden farkı 0,0002 kNm'nin altındadır.

::model-figure{caption="10 kN/m yüklü, 5 m'lik iki açıklık"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels]
---
::

Şekil, IPE 200 yerine uygulamanın örnek kesitini kullanır. Bütün kiriş boyunca tek bir kesit varsa sürekli kirişin iç kuvvetleri rijitliğe bağlı değildir; bu yüzden diyagramlardaki sayılar aynıdır, yalnızca sehim farklıdır.

## Değiştirin {#change-it}

- **Eşit olmayan açıklıklar veya yükler:** C'nin koordinatlarını ya da yük listesini değiştirin. Yükü yalnızca bir açıklığa koyarsanız bilinen damalı yüklemeyi elde edersiniz.
- **Üç açıklık:** bir D düğümü ve `['C', 'D']` çubuğu ekleyin.
- **Ankastre uç:** A'ya `[DofID.Dx, DofID.Dz, DofID.Ry]` verin.
- **Gerçek kayma şekil değiştirmesi:** dikdörtgen için `k: 5 / 6` ya da kendi kesitinizin kayma düzeltme katsayısı.
- **Şeklini çizmek için:** çözücüyü [@edubeam/plot](/tr/solver/drawing) kütüphanesine verin.

[Sürekli kiriş eğitimi](/tr/tutorials/continuous-beam) böyle bir kirişi EduBeam uygulamasında kurar; [Sonuçların elle kontrolü](/tr/guide/verification) sayfasında ise formülleriyle birlikte daha fazla ders kitabı örneği bulunur.
