---
title: Birimler ve işaretler
description: "@edubeam/fem kütüphanesinin birimleri, eksenleri, serbestlik dereceleri ve işaret kabulleri; çubuğun yönünün sonuçların işaretini nasıl değiştirdiği."
order: 2
source: site
---

# Birimler ve işaretler {#units-and-signs}

Çözücünün kendine ait bir birim sistemi yoktur: ona verdiğiniz sayılarla hesap yapar. SI birimleri verirseniz bütün sonuçlar da SI birimleriyle döner. Bu sayfalardaki örnekler ve EduBeam uygulaması her zaman SI kullanır. İşaret kabulleri de uygulamanınkiyle aynıdır; teori kılavuzu bunları [koordinat sistemi ve işaret kabulü](/tr/elements/conventions) sayfasında şekillerle açıklar.

## Birimler {#units}

| Büyüklük | Birim | Örnek |
| --- | --- | --- |
| Koordinatlar, uzunluklar, çubuk üzerindeki konumlar | m | `[6, 0, 0]` |
| Kuvvetler | N | 20 kN için `20e3` |
| Momentler | N·m | 10 kNm için `10e3` |
| Çizgisel yükler | N/m | 12 kN/m için `12e3` |
| Elastisite ve kayma modülü | Pa | `210e9` |
| Alan | m² | 28,5 cm² için `28.5e-4` |
| Atalet momenti | m⁴ | 1943 cm⁴ için `1943e-8` |
| Sıcaklık değişimi | K | `20` |
| Isıl genleşme katsayısı | 1/K | `12e-6` |
| Yer değiştirmeler, dönmeler | m, rad | 10 mm için `0.01` |

Tutarlı olduğu sürece başka bir birim takımı da kullanabilirsiniz; örneğin kN, m ve kPa ile sonuçlar kN ve kNm cinsinden çıkar. SI ise sizi bu kontrolden kurtarır.

## Eksenler {#axes}

- **x** sağa, **z aşağı** bakar; model x–z düzleminde durur. Koordinatlar `[x, y, z]` biçimindedir ve `y = 0` olur.
- **y** ekrandan dışarı, size doğru bakar. Dönmeler ve momentler y ekseni etrafındadır; bu yüzden pozitif olanlar ekranda **saat yönünün tersinedir**.
- Çubuğun **yerel x** ekseni ilk düğümünden ikinci düğümüne gider. **Yerel z** ekseni, yerel x'in ekranda saat yönünde 90° döndürülmüş hâlidir: soldan sağa çizilmiş bir çubukta aşağı bakar.

z aşağı baktığı için yerçekimi yükü pozitif bir `fz`'dir ve $z = 0$'da duran 4 m'lik bir kolonun başı $z = -4$ noktasındadır.

## Serbestlik dereceleri {#degrees-of-freedom}

Bir `Beam2D` modelinde her düğümün üç serbestlik derecesi vardır; adlarını `DofID` enum'u verir:

| `DofID` | Değer | Anlamı |
| --- | --- | --- |
| `DofID.Dx` | 0 | x doğrultusunda yer değiştirme |
| `DofID.Dz` | 2 | z doğrultusunda, aşağı doğru yer değiştirme |
| `DofID.Ry` | 4 | y ekseni etrafında, saat yönünün tersine dönme |

`Dy`, `Rx` ve `Rz` (1, 3, 5) enum'da bulunur, ama düzlem çubuklar bunları kullanmaz.

## Sonuçların işaretleri {#signs-of-the-results}

| Sonuç | Pozitif olduğunda | Okuyan metot |
| --- | --- | --- |
| Normal kuvvet N | çekme | `computeNormalForceAt` |
| Eğilme momenti M | yerel +z tarafında çekme: soldan sağa çizilmiş bir kirişte alt lifler çekmede | `computeBendingMomentAt` |
| Kesme kuvveti V | M yerel x boyunca artar, $V = dM/dx$; soldan sağa çizilmiş bir kirişte parçayı saat yönünde döndürür: basit mesnetli kirişin sol mesnedinde $+qL/2$ | `computeShearForceAt` |
| Sehim w | yerel +z yönünde: soldan sağa çizilmiş bir kirişte aşağı | `computeLocalDefl` |
| Düğüm yer değiştirmesi | +x, +z (aşağı) yönünde, saat yönünün tersine | `node.getUnknowns` |
| Mesnet tepkisi | mesnedin yapıya uyguladığı kuvvet; +x, +z (aşağı) yönünde, saat yönünün tersine | `node.getReactions` |
| Çubuk uç kuvvetleri | düğümlerin çubuğa uyguladığı kuvvetler, çubuğun yerel eksenlerinde | `computeEndForces` |

Bu yüzden aşağı yüklenmiş bir kirişin mafsallı mesnedi z doğrultusunda −36 000 N tepki bildirir: yukarı iten 36 kN.

## Çubuk üzerindeki konumlar {#positions-along-a-member}

`…At(lc, x)` biçimindeki her metot `x` değerini çubuğun ilk düğümünden metre cinsinden alır, çubuk boyunun bir oranı olarak değil. Çubuk üzerindeki tekil yükler de aynı şekilde yerleştirilir.

## Çubuğun yönü {#member-direction}

M ve w çubuğun kendi eksenlerinde ölçülür; bu yüzden iki düğümünün sırası önemlidir. [Başlarken](/tr/solver/getting-started) sayfasındaki 12 kN/m yüklü kirişi iki yönde de tanımlayalım. Yük global eksenlerde verilsin (`[0, 12e3], false`), böylece iki durumda da aşağı itsin; sonuçları `computeBendingMomentAt(lc, 3)`, `computeLocalDefl(lc, 2).w[1]` ve `computeShearForceAt` ile okuyalım:

| Çubuk | Açıklık ortasında M | Açıklık ortasında w | A'da V |
| --- | --- | --- | --- |
| `['A', 'B']`, soldan sağa | +54 000 N·m | +0,0499 m | +36 000 N, `x = 0` noktasında |
| `['B', 'A']`, sağdan sola | −54 000 N·m | −0,0499 m | +36 000 N, `x = 6` noktasında |

Sağdan sola tanımlanan çubukta yerel z yukarı bakar; bu yüzden alt lifleri çekmede olan aynı kiriş negatif moment ve yukarı doğru sehim bildirir. N ve V kirişin her noktasında işaretini korur; yalnızca `x` öbür uçtan başlar. Yerel eksenlerde (`true`) verilen bir yük çubukla birlikte döner: sağdan sola tanımlanmış kirişte `[0, 12e3], true` yukarı iter.

::callout{type="tip" title="Çubukları çizdiğiniz gibi tanımlayın"}
Kirişleri soldan sağa, kolonları aşağıdan yukarı tanımlarsanız işaretler ders kitabındaki gibi çıkar. Aşağıdan yukarı tanımlanan bir kolonda yerel z sağa bakar; sağ yüzde çekme oluşturan moment pozitiftir. [Çerçeve örneği](/tr/solver/frames#things-to-notice) bunu gösterir.
::
