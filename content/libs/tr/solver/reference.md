---
title: API başvurusu
description: "@edubeam/fem 0.3'ün bütün sınıfları, metotları ve argümanları; birimleri, varsayılan değerleri ve her birinin döndürdüğü verinin yapısıyla."
order: 16
group: API başvurusu
source: site
---

# API başvurusu {#api-reference}

`@edubeam/fem` 0.3'ün dışa aktardıkları, ne için kullanıldıklarına göre gruplanmış hâlde. Birimler her yerde SI'dır: m, N, N·m, N/m, Pa, K ve rad. Etiketler (`LabelType`) `string | number` tipindedir ve metin olarak saklanır. Burada listelenmeyen metotlar iç kullanım içindir: TypeScript'te yalnızca çözücünün kendi sınıfları onları çağırdığı için public görünürler.

## Dışa aktarılanlar {#exports}

| Dışa aktarılan | Türü | Bölüm |
| --- | --- | --- |
| `LinearStaticSolver` | sınıf | [Analizler](#analyses) |
| `Solver` | soyut sınıf | [Analizler](#analyses) |
| `Domain` | sınıf | [Domain](#domain) |
| `Node` | sınıf | [Node](#node) |
| `Beam2D`, `Element` | sınıflar | [Elemanlar](#elements) |
| `Material`, `CrossSection` | sınıflar | [Malzemeler ve kesitler](#materials-and-sections) |
| `LoadCase` | sınıf | [Yükler](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | sınıflar | [Yükler](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | tipler | |

## Analizler {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Üye | Tip | Açıklama |
| --- | --- | --- |
| `domain` | `Domain` | Model |
| `loadCases` | `LoadCase[]` | Tek bir yükleme durumuyla, `'DefaultLC'` ile başlar. Yenilerini `new LoadCase(label, solver.domain)` ile ekleyin: [Yükleme durumları](/tr/solver/load-cases). |
| `solve()` | `void` | Gerekirse denklemleri numaralandırır, her yükleme durumunu kurar ve çözer. Bir [mekanizmada](/tr/solver/solving#when-solving-fails) hata fırlatabilir, ama her zaman fırlatmaz. 0.3.1'den itibaren konsola yazmaz; 0.3.0 süresini yazdırıyordu. |
| `codeNumberGenerated` | `boolean` | Düğüm veya çubuk ekledikten ya da sildikten veya mesnetleri değiştirdikten sonra `false` yapın: [neden](/tr/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Serbest ve tutulu serbestlik derecelerinin sayısı, çözümden sonra |
| `k` | mathjs `Matrix` | Birleştirilmiş global rijitlik matrisi, çözümden sonra |
| `getNodeDofIDs(label)` | `number[]` | Bir düğümün serbestlik dereceleri, çözümden sonra |

`EigenValueDynamicSolver` kaynak kodda vardır, ama dışa aktarılmaz.

## Domain {#domain}

`solver.domain` modeli, etiketin metin hâliyle anahtarlanmış dört `Map` içinde tutar: `nodes`, `elements`, `materials`, `crossSections`. Silme metotları yoktur: bir düğümü veya çubuğu `domain.nodes.delete(label)` ve `domain.elements.delete(label)` siler; ardından [yeniden numaralandırma](/tr/solver/solving#solving-again-after-a-change) gerekir.

| Metot | Döndürdüğü | Açıklama |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords`: m cinsinden `[x, y, z]` (varsayılan `[0, 0, 0]`); `bcs`: tutulu `DofID`'ler (varsayılan: hiçbiri) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes`: `[first, second]`; `hinges`: `[atFirst, atSecond]` (varsayılan `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Bkz. [Malzemeler ve kesitler](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Bkz. [Malzemeler ve kesitler](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | nesnenin kendisi | Bilinmeyen bir etiket için `RangeError` fırlatır. `getElement` `Element` tipini döndürür: sonuç okumak için `as Beam2D` yazın. |

Kullanımdaki bir etiketle nesne oluşturursanız eski nesnenin yerini yenisi alır.

## Node {#node}

| Üye | Tip | Açıklama |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Düğümü taşımak için değiştirin. |
| `bcs` | `Set<DofID>` | Tutulu serbestlik dereceleri. Mesnedi değiştirmek için yenisiyle değiştirin. |
| `lcs` | `number[][] \| undefined` | Düğümün döndürülmüş eksenleri, varsa |
| `updateLcs({ locx, locy }?)` | `void` | Düğümün eksenlerini döndürür: `locx` düğümün x ekseninin global bileşenleri, `locy` `[0, 1, 0]`. Argümansız çağrı eksenleri sıfırlar. |
| `hasLcs()` | `boolean` | Eksenlerin döndürülüp döndürülmediği |
| `getUnknowns(lc, dofs)` | `Matrix`, tek bir serbestlik derecesi için `number` | Yer değiştirmeler (m) ve dönmeler (rad), düğümün eksenlerinde |
| `getReactions(lc, global?)` | `{ dofs, values }` | Tutulu serbestlik derecelerindeki mesnet tepkileri, `bcs` sırasıyla: N, N·m. `values` birden fazla tepki için mathjs `Matrix`, tek tepki için tek elemanlı bir dizi, serbest düğüm için `[]` olur. Döndürülmüş bir düğümde `global` `true` ise: global eksenlerde üç serbestlik derecesinin hepsi, `dofs` `[0, 2, 4]`, `values` tutulmayanlar için 0 içeren bir dizi. [Nasıl okunur](/tr/solver/results#reactions). |

## Elemanlar {#elements}

### `Beam2D` {#beam2d}

x–z düzleminde iki düğümlü bir Timoshenko kirişi; düğüm başına üç serbestlik derecesi (`Dx`, `Dz`, `Ry`). `x` ilk düğümden metre cinsinden ölçülür; `n` parça sayısıdır ve n + 1 nokta verir.

| Üye | Döndürdüğü | Açıklama |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | İlk ve ikinci düğümde momentin serbest bırakılması |
| `computeNormalForceAt(lc, x)` | `number` | N, çekme pozitif |
| `computeShearForceAt(lc, x)` | `number` | V, M'nin yerel x boyunca arttığı yerde pozitif |
| `computeBendingMomentAt(lc, x)` | `number` | M, yerel +z tarafında çekme oluşturduğunda pozitif |
| `computeNormalForce(lc, n)` | `{ x, N }` | n + 1 noktada N |
| `computeShearForce(lc, n)` | `{ x, V }` | n + 1 noktada V |
| `computeBendingMoment(lc, n)` | `{ x, M }` | n + 1 noktada M |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Çubuk boyunca ve çubuğa dik yer değiştirmeler, yerel eksenlerde, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | Aynısı, global x ve z'de |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, düğümlerin çubuğa uyguladığı kuvvetler, yerel eksenlerde |
| `computeEndDisplacement(lc)` | `Matrix` | Yerel eksenlerde uç yer değiştirmeleri, mafsal dönmeleri dahil |
| `computeGeo()` | `{ l, dx, dz }` | Boy ve izdüşümler, m |
| `computeT()` | `Matrix` | 6 × 6 dönüşüm matrisi, globalden yerele |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: 6 × 6 yerel rijitlik matrisi, mafsallar statik yoğunlaştırmayla çıkarılmış |
| `computeStiffness()` | `Matrix` | 6 × 6 global rijitlik matrisi |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

Tekil yükün olduğu noktada `…At` metotları yükün hemen sonrasındaki değeri döndürür. `Element`, `Beam2D`'nin soyut taban sınıfıdır; `domain.elements` ve `getElement` bu tipi kullanır.

## Malzemeler ve kesitler {#materials-and-sections}

| `MaterialParameters` | Birim | Varsayılan | Ne için kullanılır |
| --- | --- | --- | --- |
| `e` | Pa | 1 | rijitlik |
| `g` | Pa | 1 | kayma rijitliği |
| `alpha` | 1/K | 1 | sıcaklık yüklemeleri |
| `d` | kg/m³ | 1 | statikte kullanılmaz |

| `CrossSectionParameters` | Birim | Varsayılan | Ne için kullanılır |
| --- | --- | --- | --- |
| `a` | m² | yok, zorunlu | eksenel ve kayma rijitliği |
| `iy` | m⁴ | yok, zorunlu | eğilme rijitliği |
| `k` | – | yok, zorunlu | kayma rijitliği $kGA$; kayma şekil değiştirmesi istemiyorsanız `1e32` |
| `h` | m | yok | sıcaklık farkı yüklemeleri (yoksa `NaN`) |
| `iz`, `dyz`, `j` | m⁴ | yok | `Beam2D` kullanmaz |

Eksik bir malzeme parametresi tipik bir değer değil, 1 olur; eksik bir `a`, `iy` veya `k` bütün sonuçları `NaN` yapar. İkisi de hata fırlatmaz. İki sınıfın da verilen parametreleri ayarlayan bir `change(params)` metodu vardır; parametreler aynı adlı özellikler olarak saklanır.

## Yükler {#loads}

### `LoadCase` {#loadcase}

| Metot | Döndürdüğü | Değerler |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (varsayılan `false`) `true` ise düğümün döndürülmüş eksenlerinde |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | bütün çubuk boyunca N/m |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | ilk ve ikinci düğümde N/m, aralarında doğrusal |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m; ilk düğümden `a` m uzakta |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: ağırlık merkezi, alt lif, üst lif |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | tutulu serbestlik derecelerinde `{ [DofID.Dz]: m, … }`, düğümün eksenlerinde; serbest serbestlik derecelerinde yok sayılır |

Çubuk yüklerinde `lcs` `true` yerel eksenler (x çubuk boyunca, z çubuğa dik), `false` global eksenler demektir. Yayılı yükler çubuk boyunun metresi başınadır. Örnekler [Düğüm ve çubuk yükleri](/tr/solver/loads) sayfasındadır.

| Üye | Tip | Açıklama |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Çubuk ve sıcaklık yükleri |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | Başarılı bir çözümden sonra `true` |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Tek bir çubuğa etkiyen yükler |

Yük nesneleri değerlerini public özelliklerde tutar; bunları yeniden çözmeden önce değiştirebilirsiniz: `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` ve `BeamTemperatureLoad` üzerinde `values` (ve `lcs`); `BeamElementTrapezoidalEdgeLoad` üzerinde `startValues` ve `endValues`; `PrescribedDisplacement` üzerinde `prescribedValues`. Her birinin, etkidiği nesnenin etiketini tutan bir `target` özelliği vardır.

## DofID {#dofid}

| Ad | Değer | `Beam2D` kullanır mı |
| --- | --- | --- |
| `Dx` | 0 | evet |
| `Dy` | 1 | hayır |
| `Dz` | 2 | evet |
| `Rx` | 3 | hayır |
| `Ry` | 4 | evet |
| `Rz` | 5 | hayır |

## Sonuçlar {#results}

Sonuçlar, `solve()` çağrısından sonra, her zaman belirli bir `LoadCase` için bir `Beam2D` nesnesinden (iç kuvvetler, sehimler, uç kuvvetleri) ve bir `Node` nesnesinden (yer değiştirmeler, mesnet tepkileri) okunur: yukarıdaki iki tabloya, örnekler ve işaretler için de [Sonuçları okumak](/tr/solver/results) sayfasına bakın. Kısaca:

| İstenen | Çağrı |
| --- | --- |
| Mesnet tepkileri, N ve N·m | `node.getReactions(lc)` |
| Yer değiştirmeler (m) ve dönmeler (rad) | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| Bir noktada N, V veya M; N ve N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| Çubuk boyunca N, V veya M | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Elastik eğri, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Çubuk uç kuvvetleri, N ve N·m | `beam.computeEndForces(lc)` |
| Hepsini gösteren bir şekil | [@edubeam/plot](/tr/solver/drawing) kütüphanesinden `StructurePlot` veya `structureSvg` |
