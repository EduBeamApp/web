---
title: Betikler ve sunucular
description: "@edubeam/fem kütüphanesini Node'da kullanın: cevap anahtarıyla bir föy, CSV'ye yazılan bir tesir çizgisi ve istek üzerine kiriş çözen küçük bir HTTP uç noktası."
order: 15
source: site
---

# Betikler ve sunucular {#scripts-and-servers}

Çözücünün tarayıcıya ihtiyacı yoktur. Node'da cevap anahtarları yazar, parametre çalışmaları yapar, elektronik tablo için tablolar hazırlar ya da bir web sayfasından gelen isteklere cevap verir.

Örnekler TypeScript ile yazılmıştır. Node 22.18 ve sonrası `.ts` dosyalarını doğrudan çalıştırır (`node answers.ts`); klasörü [Kurulum](/tr/solver/getting-started#install) bölümündeki gibi hazırlayın. Daha eski bir Node'da tip bildirimlerini silin ve dosyaları `.mjs` olarak kaydedin.

## Cevap anahtarıyla bir föy {#answer-key}

Aynı sorunun yirmi farklı hâli: düzgün yayılı yük ve tekil yük taşıyan basit mesnetli bir kiriş; her birinin mesnet tepkileri ve en büyük momenti bir CSV dosyasına yazılır. Sayılar soru numarasından türetilir; bu yüzden aynı betik her seferinde aynı föyü yazar:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** i. soru: q kN/m ve A'dan a m uzakta F kN yüklü basit mesnetli kiriş. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // 4 ile 7 m arası
  const q = 5 + 5 * (i % 3) // 5, 10 veya 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 veya 20 kN
  const a = L / 4 + (i % 3) // açıklık içinde bir yerde
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

  // Mesnet tepkileri uçlardaki kesme kuvvetleridir: A'da V(0), B'de -V(L)
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // En büyük moment, 1 cm aralıklı noktalardan
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

İlk soruyu elle kontrol edin: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN; kesme kuvveti tekil yükün altında işaret değiştirir, bu yüzden en büyük moment oradadır: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Betiği iki tercih kısa tutar. Basit mesnetli bir kirişte mesnet tepkileri uçlardaki kesme kuvvetleridir; bu yüzden [mesnet tepkileri için yardımcı fonksiyona](/tr/solver/results#reactions) gerek kalmaz. En büyük moment de 1 cm aralıklı noktalardan bulunur; burada bu kesin sonuç verir, çünkü uç değer ya bir yükün altına ya da örnekleme noktalarından birine bir santimetreden daha yakın bir yere düşer. Her soruyu cevaplarıyla ya da cevapsız çizmek için @edubeam/plot kütüphanesinin [Alıştırmalar ve sınavlar](/tr/plot/exercises) sayfasına bakın; orada bütün bir sınavı yazdıran bir betik de bulunur.

## CSV olarak bir tesir çizgisi {#an-influence-line-as-csv}

İki açıklıklı bir kirişte 1 kN'luk bir yük kirişin üzerinden geçerken orta mesnet üzerindeki moment nasıl değişir? Kirişi her yük konumu için bir kez kurup çözün ve her konum için bir satır yazın:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** 5 m'lik iki açıklık, A'dan `at` m uzakta 1 kN: orta mesnet üzerindeki moment */
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

Eşit iki açıklık için kapalı form çözüm $M_B = -P\,a\,(L^2 - a^2)/4L^2$'dir: $a = 2{,}5$ m'de $-0{,}46875$ kNm; en elverişsiz konum ise $a = L/\sqrt{3} = 2{,}887$ m'dir. Çizgi simetriktir; bu yüzden 21 satır başladığı gibi, C mesnedi üzerinde 0 ile biter.

Her konum için yeni bir çözücü oluşturmak, tek bir çözücüyü yerinde değiştirmekten daha basittir ve yalnızca birkaç milisaniye sürer. Bunun yerine çözülmüş bir modeli değiştirmek isterseniz bkz. [Değişiklikten sonra yeniden çözmek](/tr/solver/solving#solving-again-after-a-change).

## HTTP uç noktasının arkasında bir çözücü {#a-solver-behind-an-http-endpoint}

Node'un kendi `http` modülünden başka hiçbir şey kullanmayan küçük bir sunucu; kendisine gönderilen her açıklık ve yük için basit mesnetli bir kirişi çözer:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Basit mesnetli IPE 200, `span` m, `q` kN/m: açıklık ortasında M ve sehim */
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
    // Hatalı JSON, hatalı sayılar ya da çözülemeyen bir model: sunucu çalışmaya devam etsin
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm ve $5qL^4/384EI = 49{,}63$ mm. `try` bloğu önemlidir: geçersiz JSON hata fırlatır, çözücünün çözemediği bir model de fırlatabilir; ikisi de sunucuyu çökertmemelidir. Herkese açık bir servis ayrıca isteğin boyutunu ve açıklığı sınırlamalıdır.

## Tarayıcıda {#in-the-browser}

Aynı kod bir sayfada olduğu gibi çalışır ve okuyucunun cihazında çözer: bu sitedeki bütün canlı şekiller böyle çalışır. Paketi bundler'ınız üzerinden, örneğin Vite veya Nuxt ile import edin ve sonuçları @edubeam/plot ile [çizin](/tr/solver/drawing). Bir model milisaniyeler içinde çözülür; bu yüzden sayfa her girdi olayında yeniden çözebilir.
