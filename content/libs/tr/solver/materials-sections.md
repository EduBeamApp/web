---
title: Malzemeler ve kesitler
description: "@edubeam/fem kütüphanesinin malzeme ve kesit parametreleri: hangi analiz hangisini ister, biri eksik olunca ne olur, kayma şekil değiştirmesi nasıl kapatılır."
order: 4
source: site
---

# Malzemeler ve kesitler {#materials-and-sections}

Çubuklar rijitliklerini bir malzemeden ve bir kesitten alır. Her ikisi de bir kez oluşturulur, sonra etiketiyle anılır.

```ts
domain.createMaterial('steel', { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection('IPE200', {
  a: 28.5e-4, // m²
  iy: 1943e-8, // m⁴
  h: 0.2, // m
  k: 5 / 6,
})
```

## Malzeme {#material}

| Parametre | Anlamı | Birim | Ne için gerekli |
| --- | --- | --- | --- |
| `e` | Elastisite modülü $E$ | Pa | her zaman |
| `g` | Kayma modülü $G$ | Pa | her zaman; `k` çok büyükse (kayma şekil değiştirmesi yoksa) gerekmez |
| `alpha` | Isıl genleşme katsayısı $\alpha$ | 1/K | sıcaklık yüklemeleri |
| `d` | Yoğunluk $\rho$ | kg/m³ | statik analizde kullanılmaz |

Vermediğiniz bir parametre tipik bir değer değil, **1** olur ve hiçbir şey sizi uyarmaz. Başlarken sayfasındaki kirişte `g` değerini unutursanız sehim 22 700 km çıkar.

## Kesit {#cross-section}

| Parametre | Anlamı | Birim | Ne için gerekli |
| --- | --- | --- | --- |
| `a` | Alan $A$ | m² | her zaman: eksenel ve kayma rijitliği |
| `iy` | Atalet momenti $I_y$ | m⁴ | her zaman: eğilme rijitliği |
| `k` | Kayma düzeltme katsayısı $k$ | – | her zaman: kayma rijitliği $kGA$ |
| `h` | Kesit yüksekliği $h$ | m | sıcaklık farkı yüklemeleri |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, burulma sabiti | m⁴ | düzlem modelde kullanılmaz |

Kesitin varsayılan değerleri yoktur. `a`, `iy` veya `k` eksikse bütün sonuçlar `NaN` olur; `h` eksikse sıcaklık farkı yüklemesi `NaN` verir. İkisi de hata fırlatmaz; bu yüzden sonucun `NaN` çıkması neredeyse her zaman eksik bir parametreye işaret eder.

## Kayma şekil değiştirmesi {#shear-deformation}

Çubuk bir Timoshenko kirişidir: eğilmenin yanında kaymayla da şekil değiştirir. Bunun ne kadar olduğu

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2}
$$

oranına bağlıdır; bu değeri `beam.computeShearFactor()` döndürür. Narin çubuklarda $\Phi$ çok küçüktür ve sehimler yalnızca %1'den az artar. Kısa ve yüksek kesitli çubuklarda ise etkisi önemlidir.

Ders kitabı tablolarındaki Euler–Bernoulli kirişi için kayma rijitliğini çok büyük bir kayma düzeltme katsayısıyla pratikte sonsuz yapın; EduBeam uygulamasının örnekleri de böyle yapar:

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

Bu sayfalardaki örnek programlar da bunu yapar; sayıları formüllerle tam olarak bu yüzden örtüşür. Gerçek bir kayma düzeltme katsayısı için dikdörtgen kesitte $k = 5/6$ uygundur. Etkinin büyüklüğünü [Sonuçların elle kontrolü](/tr/guide/verification#shear-deformation) sayfası gösterir.

## Eksenel doğrultuda rijit {#rigid-in-axial-direction}

Büyük bir alan çubukları pratikte uzamaz hâle getirir; el hesaplarında genellikle bu kabul yapılır. Bir çerçevenin iç kuvvetleri alana yalnızca biraz bağlıdır; bir kafes sistemin yer değiştirmeleri ise tamamen ona bağlıdır. İzostatik bir yapının iç kuvvetleri hiçbir rijitliğe bağlı değildir.

## Sonradan değiştirmek {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Her çubuk, çözücü denklemleri kurarken malzemesini ve kesitini okur; bu yüzden yeni bir `solve()` çağrısı yeterlidir. Farklı çubuklar farklı kesitler kullanabilir: her birine kendi etiketini verin.
