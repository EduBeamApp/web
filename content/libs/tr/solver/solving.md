---
title: Çözüm
description: "@edubeam/fem çözücüsünde solve() ne yapar; model değişince denklemler ne zaman yeniden numaralandırılır, mekanizma nasıl tanınır, model ne kadar büyük olabilir."
order: 9
group: Çözüm ve sonuçlar
source: site
---

# Çözüm {#solving}

```ts
solver.solve()
```

`solve()` denklemleri numaralandırır, global rijitlik matrisini ve her yükleme durumunun yük vektörlerini kurar, yer değiştirmeleri ve mesnet tepkilerini hesaplar. Ondan sonra her [sonuç](/tr/solver/results) okunabilir; ondan önce bir sonuç okumaya çalışırsanız `TypeError` fırlatılır. Adımlar, teori kılavuzundaki [EduBeam modeli nasıl çözer](/tr/elements/analysis) sayfasında anlatılanlarla aynıdır.

Çözüm, doğrusal model için kesindir: her çubuk boyunca elastik eğri ve iç kuvvetler, Timoshenko kirişinin kapalı form çözümlerinden gelir. Bu yüzden iyileştirilecek bir sonlu eleman ağı yoktur ve doğru diyagramlar için çubukları bölmeniz gerekmez.

`solve()` 0.3.1 sürümünden itibaren konsola hiçbir şey yazmaz; 0.3.0 her çağrıda `Solution took 9 [ms]` gibi bir satır yazdırıyordu.

## Değişiklikten sonra yeniden çözmek {#solving-again-after-a-change}

Modeldeki sayıları değiştirmek için yalnızca yeni bir `solve()` yeterlidir. Hangi denklemlerin bulunduğunu değiştirmek için ise önce bir satır daha gerekir:

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // serbestlik dereceleri değişti: yeniden numaralandırın
solver.solve()
```

| Değişiklik | Ardından |
| --- | --- |
| Yük değerleri, yeni veya kaldırılmış yükler | `solve()` |
| Düğüm koordinatları, malzemeler, kesitler, mafsallar | `solve()` |
| Düğüm veya çubuk eklemek | `codeNumberGenerated = false`, sonra `solve()` |
| Düğüm veya çubuk silmek: `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false`, sonra `solve()` |
| Bir düğümün mesnetlerini (`node.bcs`) değiştirmek | `codeNumberGenerated = false`, sonra `solve()` |

Düğüm ekledikten sonra bunu unutursanız `solve()` bir `TypeError` fırlatır. Mesnedi değiştirdikten sonra unutursanız **hiçbir uyarı vermeden** eski mesnetlerle çözer. Emin değilseniz sıfırlayın: numaralandırma neredeyse hiç zaman almaz. Bir çubuğu silerken onun yüklerini de `lc.elementLoadList` listesinden kaldırın; yoksa `solve()` eksik çubuk için bir `RangeError` fırlatır.

Aynı modelin birçok varyantı için, örneğin bir parametre çalışmasında, her varyant için yeni bir çözücü oluşturmak daha basittir ve aynı hızdadır: bkz. [tesir çizgisi örneği](/tr/solver/scripts#an-influence-line-as-csv).

## Çözüm başarısız olursa {#when-solving-fails}

Şekil değiştirmeden hareket edebilen bir yapının, yani bir mekanizmanın, rijitlik matrisi tekildir. Bazen `solve()` bunu fark eder ve hata fırlatır:

```text
Error: Linear system cannot be solved since matrix is singular
```

Çoğu zaman fark etmez: yuvarlama hataları matrisi çözülebilir gösterir ve ya $10^{12}$ m mertebesinde yer değiştirmeler ya da serbestçe kayabilen bir yapı için makul görünen sayılar elde edersiniz. Örneğin iki kayıcı mesnet üzerindeki bir kiriş, onu yana iten bir şey olmadığı sürece hiç itiraz etmeden çözülür. Bu yüzden mesnetleri kendiniz kontrol edin ve çok büyük yer değiştirmeleri bir mekanizma işareti sayın.

Tipik nedenler:

- çok az mesnet, örneğin iki kayıcı mesnet üzerinde bir kiriş;
- yapıyı tutamayan mesnetler: hepsi paralel ya da doğrultuları tek bir noktadan geçiyor;
- bir mafsal fazla, örneğin bir doğru üzerinde art arda üç mafsal;
- bütün çubuk uçlarının mafsallı olduğu bir düğüme etkiyen moment.

Hata mesajı sorunun nerede olduğunu söylemez. EduBeam uygulaması çözmeden önce mekanizmaları denetler, hareketi bulur ve canlandırır; aynı modeli orada kurmak çoğu zaman sorunu görmenin en hızlı yoludur. Olağan nedenleri [Sorun giderme](/tr/reference/troubleshooting) sayfası listeler.

Eksik bir düğüm, malzeme veya kesit, adını veren bir `RangeError` fırlatır. Eksik kesit parametreleri ise hiç hata fırlatmaz: bütün sonuçlar `NaN` olur. Bkz. [Malzemeler ve kesitler](/tr/solver/materials-sections#cross-section).

## Model büyüklüğü {#model-size}

Çözücü yoğun (dense) matrisler kullanır; ders ölçeğindeki modeller için yapılmıştır. Bir dizüstü bilgisayarda, Node'da, düz bir hat boyunca dizilmiş çubuklardan oluşan bir model yaklaşık şu sürelerde çözülür:

| Çubuk | Serbestlik derecesi | Süre |
| --- | --- | --- |
| 50 | 150 | 0,1 s |
| 100 | 300 | 0,2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

Modelin boyutu her iki katına çıktığında süre altı ila dokuz katına çıkar.

Bir yapı statiği dersindeki her alıştırma, çerçeve ve kafes sistem bu sınırların rahatça içinde kalır. Çözücü binlerce çubuklu modeller için tasarlanmamıştır.

## Başka analiz yok {#no-other-analyses}

Bu sürüm yalnızca doğrusal statik analiz yapar. Kaynak kodda doğal frekanslar için bir özdeğer çözücüsü bulunur, ama yayımlanan pakete dahil değildir: `EigenValueDynamicSolver`, `@edubeam/fem` içinden import edilemez.
