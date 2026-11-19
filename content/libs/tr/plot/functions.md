---
title: Fonksiyonlar
description: "@edubeam/plot 0.2.0'ın bileşenler dışındaki tüm dışa aktarımları: bağımsız SVG için structureSvg, kesin sonuç okuma, birimler, kiriş hatları ve yerleşim."
order: 10
source: site
---

# Fonksiyonlar

Bileşenlerin çizdiği her şey, içinde Vue olmayan saf fonksiyonlardan gelir. Bu fonksiyonlar bir şekli SVG dosyası olarak yazar, sonuçları kesin olarak okur, veriyi önceden hazırlar ve kendi şekillerinizi oluşturmanızı sağlar. Adlandırılmış içe aktarmalar paketi küçük tutar: yalnızca `modelFromSolver` fonksiyonunu içe aktaran bir sayfaya hiç bileşen kodu girmez.

Bir birim belirtilmedikçe tüm değerler SI birimlerindedir; bir çubuk boyunca konumlar, çubuğun başlangıç düğümünden metre cinsinden uzaklıktır.

## Bağımsız bir SVG dosyası {#a-standalone-svg-file}

Bir sayfadaki şekil renklerini sayfanın CSS custom property'lerinden alır; bu yüzden şekilden kopyalanan bir `<svg>` öğesinin hiç rengi yoktur. `structureSvg` ise şekli bağımsız bir `.svg` dosyasının metni olarak yazar: sabit renkler, stil dosyası yok, betik yok; yerleşim `StructurePlot` ile aynı yordamla yapılır. Word, PowerPoint, Inkscape, CairoSVG ve LaTeX araç zincirleri dosyayı sayfadaki gibi çizer.

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => çözülmüş bir LinearStaticSolver, Slaytlar sayfasındaki gibi

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![CairoSVG ile çizilmiş, bağımsız SVG dosyası olarak portal çerçeve: yükler, yukarı doğru 20 ve 40, yatayda 2,3 ve 12,7 mesnet tepkileri ve C'deki −50,7'den kirişteki 29,3'e uzanan eğilme momenti](/screenshots/tr/p2p-plot-frame-svg.webp){.shot-lg}

| Seçenek | Varsayılan | Ne yapar |
| --- | --- | --- |
| `layers` | çubuklar, mesnetler, yükler, mesnet tepkileri ve `StructurePlot` bileşeninin seçeceği sonuç | Neyin çizileceği |
| `width` | `640` | px cinsinden genişlik, SVG'nin kullanıcı birimleri |
| `height` | çizime göre | Sabit bir yükseklik, px |
| `maxHeight` | max(320; 0,75 × width) | Otomatik yüksekliğin üst sınırı |
| `padding` | `6` | Çizimin çevresindeki boşluk, px |
| `fontSize` | `13`, compact `11.5` | Metin boyutu, px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | Dosyayı açan programda bulunan bir yazı tipi listesi |
| `colors` | `PRINT_COLORS` | Tonlardan istedikleriniz, sabit renkler olarak |
| `background` | `true` | Arka planı `paper` rengiyle boyar; `false` saydam bırakır |
| `title` | yok | SVG'nin `<title>` öğesi olarak yazılır |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | yok | Çizilenlerin yanı sıra yer ayrılacak katmanlar, etiket biçimleri ve mesnet tepkisi etiket biçimleri; böylece adım adım oluşan bir şeklin dosyaları üst üste oturur: [Beamer'da adım adım oluşan şekil](/tr/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | `StructurePlot` ile aynı | Bileşenin prop'larıyla aynı anlamda |

`PRINT_COLORS`, beyaz zemin üzerinde EduBeam uygulamasının renkleridir: mürekkep `#16182b`, normal kuvvet `#2222ff`, kesme kuvveti `#00af00`, eğilme momenti `#ff2222`, yükler `#ff8700`, mesnet tepkileri `#a020f0`. Her etiket iki kez yazılır, metnin altında arka plan renginde bir hale olarak, çünkü `paint-order` özelliğini anlamayan SVG programları da vardır. Mesnet tepkisi adlarındaki *A<sub>x</sub>* gibi bir alt simge ise Word ve Inkscape'in okuyabildiği, düz sayılar içeren bir `tspan` öğesidir. `reserve` verilmezse dosya çizdiği katmanlara göre boyutlandırılır.

Dosyayı kullanmak için:

- **Word ve PowerPoint** (2019 ve Microsoft 365): *Ekle › Resimler*.
- **LaTeX**: dosyayı [CairoSVG](https://cairosvg.org) (`cairosvg frame.svg -o frame.pdf`) veya Inkscape ile PDF'e dönüştürün, sonra `\includegraphics` kullanın; ya da Inkscape'i sizin yerinize çağıran `svg` paketinin `\includesvg` komutunu kullanın. 640 birim genişliğindeki bir şekil 16 cm'lik bir metin sütununa yerleştirildiğinde etiketleri 9 pt olur.
- **Vue olmayan bir web sayfası**: metni HTML'e yapıştırın. Bkz. [Vue olmadan](/tr/plot/embedding#plain-html-from-node).

[Alıştırmalar ve sınavlar](/tr/plot/exercises#figures-for-latex-and-word) sayfası her öğrencinin sorusu ve cevap anahtarı için bir dosya yazar.

## Çözücüden {#from-a-solver}

| Dışa aktarım | İmza | Ne yapar |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | Bir çözücüyü düz [çizim modeline](/tr/plot/model) dönüştürür; sonuçlar yalnızca çözülmüş bir yükleme durumu için |
| `FromSolverOptions` | tip | `{ loadCase?: number }`, `solver.loadCases` içindeki indis |

## Parçalı polinomlar {#piecewise-polynomials}

Bir çubuğun sonuçları `Piecewise` değerleridir: [Çizim modeli](/tr/plot/model#piecewise-polynomials) sayfasında anlatılan `{ x0, x1, c }` parçalarının listeleri. `side`, iki parçanın birleştiği bir noktanın hemen solundaki (`'left'`) veya hemen sağındaki (`'right'`, varsayılan) değeri seçer.

| Dışa aktarım | İmza | Ne yapar |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | `x` noktasındaki değer; uçların ötesinde en yakın uçtaki değer |
| `slopeAt` | `(pw, x, side?) => number` | Türev, metre başına değer birimi |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | En büyük ve en küçük değer, kesin olarak; her biri `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | En büyük mutlak değer |
| `innerBreaks` | `(pw) => number[]` | İki uç hariç, parçaların birleştiği noktalar |
| `isZero` | `(pw) => boolean` | Sonucun her yerde sıfır olup olmadığı |
| `evalPiece` | `(piece, x) => number` | Tek bir parçanın değeri |
| `evalPieceSlope` | `(piece, x) => number` | Tek bir parçanın eğimi |
| `pieceExtrema` | `(piece) => number[]` | Bir parçanın eğiminin sıfır olduğu noktalar, m |
| `pieceDegree` | `(piece) => number \| null` | Bir parçanın derecesi; parça sıfırsa `null` |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | `tolerance` değerinden küçük katsayıları, yani çözülmüş bir modelin yuvarlama hatasını atar |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | `(x0, x1)` aralığında bir fonksiyondan geçen, verilen dereceden polinom |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | Parçayı (x, değer) düzleminde kübik Bézier eğrileri olarak verir: kübik dereceye kadar kesin, daha yüksek derecede `segments` adet, varsayılan 4 |

Tipler: `Piece`, `Piecewise`, `Side` (`'left' \| 'right'`), `Extreme`, `CubicSegment`.

## Birimler ve sayılar {#units-and-numbers}

| Dışa aktarım | İmza | Ne yapar |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN, kNm, kN/m, m, mm, mrad, K: varsayılan |
| `SI_UNITS` | `Units` | N, N·m, N/m, m, m, rad, K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | Verdiğiniz birimlerle değiştirilmiş `KN_UNITS` |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | İngilizce, en fazla bir ondalık basamak |
| `formatNumber` | `(value, format?) => string` | Sayıyı gerçek bir eksi işaretiyle yazar, hiçbir zaman −0 yazmaz |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`: bir SI değerini, araya dar bir bölünmez boşluk koyarak bir birimde yazar |

Bir `Unit`, `{ symbol, scale }` biçimindedir; gösterilen değer = SI değeri × `scale`. `Units`, her `UnitKind` için bir birim içerir: `force`, `moment`, `distributed`, `length`, `displacement`, `rotation` ve `temperature`.

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## Değer okuma {#reading-values}

| Dışa aktarım | İmza | Ne yapar |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | `x` noktasında her biri `{ left, right }` olan N, V, M ve w ile eksenel yer değiştirme `u`; `snap` m mesafedeki bir sıçramaya yakalanır |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | Bir ekran noktasına `reach` px içinde en yakın çubuk ve oradaki sonuçları |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | Okunan değerlerin işaretlendiği yerler: gösterilen her diyagramın ordinat ucu (sıçramada iki uç), deforme şekil üzerindeki nokta |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"` ya da sıçramada `"V = 13.3 → −6.7 kN"` |

`k`, her sonuç için SI birimi başına piksel, `side` ise her diyagramın çizildiği taraftır; ikisi de aşağıdaki `diagramScales` ve `diagramSide` fonksiyonlarından gelir. Tipler: `Readout`, `ReadoutMark` (px cinsinden `{ tone, from, to }`), `ReadoutQuantity` (`'N' \| 'V' \| 'M' \| 'w'`), `SidedValue`.

## Kiriş hatları {#beam-lines}

Kendi alt alta diyagramlı şeklinizi oluşturmak için [DiagramStack](/tr/plot/diagram-stack) bileşeninin parçaları.

| Dışa aktarım | İmza | Ne yapar |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | Çubukları soldan sağa tek bir yatay hat olarak verir; başka her durumda hata fırlatır |
| `lineDiagram` | `(model, line, row) => Piecewise` | Hattın tamamı boyunca tek bir sonuç, hattın x ekseninde |
| `rowRange` | `(pw) => [number, number]` | Bir satırın ölçeklendiği, her zaman sıfırı içeren aralık |
| `rowPeaks` | `(pw) => RowPeak[]` | Bir satırda yazılmaya değer ekstremumlar |
| `rowBreaks` | `(pw) => number[]` | Sonucun kırıldığı yerler: mesnetler, birleşimler ve tekil yükler |
| `rowOutline` | `(pw, sx, sy, close) => string` | m ve değerden px'e dönüşümler verildiğinde bir satırın dış çizgisinin SVG path verisi |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | Aralarında `spacing` px olan tarama ordinatlarının SVG path verisi |
| `lineModel` | `(model, line, omit?) => PlotModel` | Hatta indirgenmiş model; istenirse bir yük hariç |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | Hat üzerinde `at` konumundaki tekil kuvvet |

Tipler: `BeamLine`, `LineMember`, `RowPeak`, `StackRow`.

[DiagramStack](/tr/plot/diagram-stack#a-load-the-reader-can-drag) sayfası, hareket eden bir yükün tüm konumlarında her satırın ölçeğini sabit tutmak için `beamLine`, `lineDiagram` ve `rowRange` fonksiyonlarını kullanır.

## Geometri ve mesnetler {#geometry-and-supports}

| Dışa aktarım | İmza | Ne yapar |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | Kimliğe göre düğümler |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | Bir çubuğun başlangıç noktası, birim teğeti, birim yerel z vektörü ve uzunluğu |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | Aynısı, her çubuk için, kimliğe göre |
| `pointAlong` | `(frame, at) => { x, z }` | Bir çubuk boyunca `at` metredeki nokta |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`, `'pin'`, `'roller'`, `'slider'`, `'rotation'` veya `'none'` |
| `supportPlacement` | `(model, node) => SupportPlacement` | Bir düğümün sembolü ve saat yönündeki dönme açısı, derece |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | Sembolün çizgileri, px |
| `glyphReach` | `(kind, rotation, x, z) => number` | Döndürülmüş bir sembolün bir doğrultu boyunca ne kadar uzandığı, px |

## Çizim {#drawing}

Çizim üç adımda yapılır. `buildStructureScene` bir modeli sahne öğelerine dönüştürür: ekran pikseli cinsinden kaydırmalarla birlikte model noktaları. `fitScene`, öğeleri bir kutuya sığdıran ölçeği ve kaydırmayı bulur. `resolveScene` öğeleri SVG path verisine, dairelere ve yeri olan etiketlere dönüştürür. `layoutStructure` üç adımı `StructurePlot` ve `structureSvg` gibi çalıştırır; böylece kendi şekliniz de onlarınki gibi yerleşir.

| Dışa aktarım | İmza | Ne yapar |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | Tüm yerleşim: tüm etiketlerle sığdır, kalabalık etiketleri at, yeniden sığdır. `{ fit, items, resolved }` döndürür |
| `structureSvg` | `(model, options?) => string` | Bağımsız bir `.svg` dosyası: [yukarıda](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | Seçilen katmanların, metre başına piksel cinsinden bir ölçekte çizimi |
| `fitScene` | `(items, box: FitBox) => Fit` | `{ width, height?, maxHeight?, padding, fontSize }` kutusuna sığdırmak için ölçek ve kaydırma |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | px cinsinden `{ paths, circles, texts }`, sığan etiketlerle |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | Hangi etiketlerin kalacağı ve nereye yerleşeceği |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | Birer birer gösterilen sonuç katmanları; etiketleri diğerlerine yol verir ama birbirine vermez |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | Bir sahnenin kapladığı alan, px |
| `project` | `(transform, anchor) => [number, number]` | Bir sahne noktasının ekrandaki yeri, px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | Hiçbiri istenmediğinde şeklin gösterdiği sonuç |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | Her sonuç için SI birimi başına piksel |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | Pozitif bir değerin çubuğun hangi tarafına çizildiği |
| `isBarStructure` | `(model, memberResults) => boolean` | N'nin diyagram olarak çizilmek yerine çubuklar boyunca sayı olarak yazılıp yazılmadığı (kafes sistem) |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | Bir değerin bir ordinat ucunun ötesinde alabileceği konumlar |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | Çizim sırasıyla tüm katmanlar |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | Sonuç katmanları |
| `HATCH_SPACING_PX` | `7` | Diyagram ordinatlarının aralığı, px |
| `DEFAULT_COLORS` | `PlotColors` | Her tonun CSS olarak varsayılan rengi: [Tema ve renkler](/tr/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | Dosya için sabit renkler: beyaz zemin üzerinde uygulamanın renkleri |
| `toneVars` | `(colors?) => Record<string, string>` | Bir şeklin kök öğesine atadığı custom property'ler |
| `PLOT_CSS` | `string` | Her şeklin içine gömülen CSS kuralları |

`ResolveOptions`, `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }` biçimindedir: `shields`, çizgileri etiketleri uzak tutan gruplardır (gösterilen diyagramlar); verilmezse hepsi. `layoutStructure` içinde `options.layers` yerleştirilecek katmanlardır (`reserve` gibi, gösterilebilecek her şey), `shown` gösterilenler, `labelModes` ise yer ayrılacak etiket biçimleridir.

Tipler: `StructureSceneOptions`, `StructureLayout`, `StructureSvgOptions`, `SceneItem`, `SceneText`, `TextPlacement`, `ResolvedScene`, `ResolvedPath`, `ResolvedText`, `ResolvedCircle`, `ResolveOptions`, `Bounds`, `Anchor`, `Transform`, `Fit`, `FitBox`, `Tone`, `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `SupportKind`, `SupportPlacement`, `GlyphPart` ve [Çizim modeli](/tr/plot/model) sayfasındaki model tipleri.
