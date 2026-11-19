---
title: Başlarken
description: "EduBeam'in sonlu elemanlar çözücüsü @edubeam/fem kütüphanesini kurun; bir düzine TypeScript satırıyla basit mesnetli bir kirişi çözüp sonuçlarını kontrol edin."
order: 1
group: Giriş
source: site
---

# Başlarken {#getting-started}

@edubeam/fem, [EduBeam]{.edubeam} uygulamasının arkasındaki sonlu elemanlar çözücüsüdür: uygulamanın gösterdiği her diyagram, mesnet tepkisi ve sehim ondan gelir. Düzlem kirişleri, çerçeveleri ve kafes sistemleri onunla kendi kodunuzdan, tarayıcıda ya da Node'da çözebilirsiniz: cevaplarıyla birlikte soru üretin, ödevleri kontrol edin, parametrik çalışmalar yapın ya da bir web sayfasının arkasına çözücü koyun.

::div{.actions}
[İlk kirişinizi çözün](#a-simply-supported-beam) [Örnek programlara göz atın](/tr/solver/beams)
::

TypeScript ile yazılmıştır, kendi tip tanımlarıyla gelir ve GPL-3.0 lisanslı özgür bir yazılımdır. Kütüphaneyi Bořek Patzák yazdı; Jan Voříšek ve diğer katkıda bulunanlarla birlikte geliştiriyor.

## Kurulum {#install}

```bash
npm install @edubeam/fem
```

`import` ile de `require` ile de çalışır, tarayıcıda ve Node 18 veya sonrasında kullanılabilir ve tek bir bağımlılık getirir: [mathjs](https://mathjs.org). 0.3.0 sürümüne kadar GitHub'dan `ts-fem` adıyla kuruluyordu: onu kullandıysanız import'larınızı `@edubeam/fem` olarak değiştirin. Başka hiçbir şey değişmedi.

Aşağıdaki örneği boş bir klasörde denemek için klasörü `import` kullanan bir projeye dönüştürün, ardından paketi kurun:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

`package.json` içinde `"type": "module"` olmasa da örnek çalışır, yalnızca Node önce bir uyarı yazdırır.

## İlk kirişiniz {#a-simply-supported-beam}

6 m açıklıklı, IPE 200 profilli bir çelik kiriş; bir ucunda mafsallı mesnet, diğerinde kayıcı mesnet var ve 12 kN/m düzgün yayılı yük taşıyor:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// Her yerde SI birimleri: m, N, Pa. Çelik ve IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Düğümler metre cinsinden [x, y, z] noktalarında, mesnetlerinin tuttuğu serbestlik dereceleriyle
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // mafsallı mesnet
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // kayıcı mesnet
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// Çubuğun yerel z ekseni yönünde 12 kN/m: soldan sağa çizilmiş kirişte aşağı doğru
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // açıklık ortasında, N·m
console.log(beam.computeShearForceAt(lc, 0)) // A'da, N
console.log(beam.computeLocalDefl(lc, 2).w[1]) // açıklık ortasında, m
```

Dosyayı `beam.ts` olarak kaydedin ve `node beam.ts` ile çalıştırın: Node 22.18 ve sonrası TypeScript'i olduğu gibi çalıştırır. Dosyada hiç tip bildirimi olmadığı için daha eski bir Node'da `beam.mjs` olarak kaydetmeniz yeterlidir. Program şunu yazdırır:

```text [Çıktı]
54000
36000
0.04990940552616746
```

Bunlar ders kitabındaki değerlerdir: $M = qL^2/8 = 54$ kNm ve $V = qL/2 = 36$ kN. Aynı kiriş, aynı çözücüyle, şimdi doğrudan tarayıcınızda çözülmüş hâliyle:

::model-figure{caption="Yukarıdaki kiriş: 6 m, IPE 200, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

49,91 mm'lik sehim, Euler–Bernoulli kirişinin $5qL^4/384EI = 49{,}63$ mm değerinden 0,28 mm fazladır. Bu bir hata değildir: çubuk bir Timoshenko kirişidir ve 0,28 mm, yani $qL^2/8kGA$, bu kirişin kayma şekil değiştirmesinden gelir. `k` değerini çok büyük yapın, örneğin `1e32`, fark ortadan kalkar: bkz. [Kayma şekil değiştirmesi](/tr/solver/materials-sections#shear-deformation).

## Kod ne yapıyor? {#what-the-code-does}

::div{.steps}
### Bir çözücü oluşturun {#make-a-solver}

`new LinearStaticSolver()` boş bir `domain` ile gelir; model bu nesnede tutulur. Bir de yükleme durumu vardır: `solver.loadCases[0]`.

### Modeli tanımlayın {#describe-the-model}

Malzemeler ve kesitler, mesnetleriyle birlikte düğümler, sonra düğümler arasındaki çubuklar. Her şeyin bir etiketi vardır (bir metin ya da sayı); modelin geri kalanı ona bu etiketle başvurur. Bkz. [Düğümler ve mesnetler](/tr/solver/nodes-supports), [Malzemeler ve kesitler](/tr/solver/materials-sections) ve [Çubuklar ve mafsallar](/tr/solver/members-hinges).

### Yükleyin {#load-it}

Yükler bir yükleme durumuna aittir: düğümlerdeki kuvvetler, çubuklar boyunca etkiyen yükler, sıcaklık ve mesnet çökmeleri. Bkz. [Yükler](/tr/solver/loads).

### Çözün {#solve}

`solver.solve()` her yükleme durumunun denklemlerini kurar ve çözer. Bkz. [Çözüm](/tr/solver/solving).

### Sonuçları okuyun {#read-the-results}

Çubuğun herhangi bir noktasındaki iç kuvvetler, sehimler, çubuk uç kuvvetleri, düğüm yer değiştirmeleri ve mesnet tepkileri. Bkz. [Sonuçları okumak](/tr/solver/results); diyagramlar için de [Sonuçları çizmek](/tr/solver/drawing).
::

## Kısaca birimler ve işaretler {#axes-and-signs}

SI birimleriyle girersiniz, SI birimleriyle alırsınız. Model x–z düzleminde durur ve **z ekseni aşağı bakar**; bu yüzden pozitif bir `fz` aşağı iter ve 4 m yüksekliğindeki bir kolonun başı $z = -4$ noktasındadır. Çubuk üzerindeki konumlar, çubuğun ilk düğümünden metre cinsinden ölçülür. Alt liflerde çekme oluşturan moment pozitiftir. Tam liste [Birimler ve işaretler](/tr/solver/conventions) sayfasındadır.

## Sık yapılan altı hata {#pitfalls}

1. **z aşağı bakar.** Yerçekimi yükleri pozitiftir ve mesnetlerin üstündeki her şeyin z koordinatı negatiftir. Bkz. [Eksenler](/tr/solver/conventions#axes).
2. **M ve w'nin işaretini çubuğun yönü belirler.** Kirişleri soldan sağa, kolonları aşağıdan yukarı tanımlayın; işaretler ders kitabındaki gibi çıkar. Bkz. [Çubuğun yönü](/tr/solver/conventions#member-direction).
3. **Eksik bir parametre hata vermez; `NaN` ya da anlamsız bir sonuç verir.** Kesit için `a`, `iy` ve `k` gerekir; malzeme için `e`, `k` çok büyük değilse `g` de. Bkz. [Malzemeler ve kesitler](/tr/solver/materials-sections).
4. **Düğüm veya çubuk ekledikten ya da mesnetleri değiştirdikten sonra** yeniden çözmeden önce `solver.codeNumberGenerated = false` yazın. Bkz. [Değişiklikten sonra yeniden çözmek](/tr/solver/solving#solving-again-after-a-change).
5. **Mesnet tepkileri bir mathjs matrisi ya da dizi olarak döner;** sıraları, mesnetin serbestlik derecelerinin verildiği sıradır. Bkz. [Mesnet tepkileri](/tr/solver/results#reactions).
6. **Mekanizma her zaman hata fırlatmaz.** $10^{12}$ m mertebesinde bir yer değiştirme, yapının serbestçe hareket edebildiği anlamına gelir. Bkz. [Çözüm başarısız olursa](/tr/solver/solving#when-solving-fails).

## Sırada ne var? {#next}

::card-grid{cols="2"}
:::card{title="Örnek programlar" icon="lucide:book-open" to="/tr/solver/beams"}
Eksiksiz, kontrol edilmiş programlar: kirişler, çerçeveler, kafes sistemler, cevap anahtarıyla bir föy ve küçük bir HTTP sunucusu.
:::
:::card{title="Sonuçları çizin" icon="lucide:chart-spline" to="/tr/solver/drawing"}
Çözülmüş bir modeli @edubeam/plot kütüphanesine verin ve diyagramlarını SVG olarak alın: Vue içinde ya da bir Node betiğinden.
:::
:::card{title="API başvurusu" icon="lucide:list-tree" to="/tr/solver/reference"}
Her sınıf, metot ve argüman; birimleri ve ne döndürdükleriyle birlikte.
:::
:::card{title="Teori" icon="lucide:sigma" to="/tr/elements/beam"}
Kiriş elemanı, rijitlik matrisi ve dönüşümü, EduBeam'in teori kılavuzunda.
:::
::
