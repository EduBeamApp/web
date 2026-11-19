---
description: "Eğitim: EduBeam'de düzlem kafes sistem kurun; çubuk kuvvetlerini ve sehimi elle kontrol edin, sıfır kuvvetli çubuğu bulun. Yaklaşık 20 dakika."
source: site
---

# Eğitim: düzlem kafes sistem

Mafsallı çubuklardan küçük, izostatik bir kafes sistem kuracaksınız. Çubuk kuvvetlerini düğüm noktası yöntemi ve kesim (Ritter) yöntemiyle, bir düğümün sehimini de virtüel iş ilkesiyle kontrol edeceksiniz.

- **Süre:** yaklaşık 20 dakika.
- **Gerekenler:** ikinci bir tarayıcı sekmesinde açık EduBeam; fare ve klavyesi olan bir bilgisayar. EduBeam'i daha önce kullanmadıysanız önce [Hızlı başlangıç](/tr/guide/quick-start) sayfasını ya da bundan önceki eğitimlerden birini yapın.
- **Ön bilgi:** düğüm noktası yöntemi ve kesim yöntemi. İsteğe bağlı sehim kontrolü birim yük yöntemini (virtüel iş ilkesi) kullanır.
- **Birimler:** SI. Görüntüleyicinin sağ altındaki birim göstergesinde `m m² kN kNm MPa` yazmalıdır. Fit ve kip görüyorsanız göstergeye tıklayın ve **Birim sistemi** olarak **SI (metrik)** seçin.

**Neler öğreneceksiniz**

- kafes çubuklarını iki ucu mafsallı kiriş elemanı olarak modellemeyi ve fareyle çizmeyi,
- çubuk kuvvetlerini düğüm noktası yöntemi ve kesim yöntemiyle kontrol etmeyi,
- sıfır kuvvetli çubuğu tanımayı ve mafsallı düğüm modelinin kafes sistemde neden işe yaradığını görmeyi.

::div{.actions}
[EduBeam'i açın ↗](https://run.edubeam.app/?lang=tr){target="_blank"} [El hesabına geçin](#_5-check-by-hand)
::

::model-figure{caption="Tamamlanmış kafes sistem: 2 ve 3 düğümlerinde 30 kN, çubuk kuvvetleri (çekme pozitif)"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N, w]
show: [nodeLabels, dimensions]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Problem {#the-problem}

- Her biri 4 m'lik üç göze bölünmüş 12 m'lik açıklık, yükseklik 3 m: alt başlık düğümleri 1–4, üst başlık düğümleri 5 ve 6.
- 1 düğümünde mafsallı mesnet, 4 düğümünde kayıcı mesnet.
- Alt başlığın 2 ve 3 düğümlerinde 30'ar kN'luk iki yük.
- Çelik çubuklar, $E = 210$ GPa, $A = 20$ cm².

| Elemanlar | Çubuklar (düğümlerine göre) | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | alt başlık |
| 4, 5, 6 | 1–5, 5–6, 6–4 | uç diyagonali, üst başlık, uç diyagonali |
| 7, 8, 9 | 2–5, 5–3, 3–6 | dikme, orta diyagonal, dikme |

**Sistem izostatik mi?** $m = 9$ çubuk, $r = 3$ mesnet tepkisi ve $j = 6$ düğüm için $m + r = 12 = 2j$ olur. Her düğüm iki denge denklemi verdiğinden, çubuk kuvvetleri yalnızca bu denklemlerle bulunabilir.

## Modeli kurun {#model-it}

::div{.steps}

### Malzeme ve kesit {#_1-material-and-section}

1. Üst araç çubuğunda **Modeli temizle** düğmesine tıklayın, **Malzemeleri sil** ve **Kesitleri sil** kutularını işaretleyin ve **Onayla** düğmesine tıklayın. Düğümler ve elemanlar yeniden 1'den başlayarak numaralanır.
2. **Malzemeler** sekmesi → **Malzeme kütüphanesi** → **Çelik (S235)** satırındaki **+**; ardından kütüphaneyi **İptal** ile kapatın.
3. **Kesitler** sekmesi → **Kesit ekle**. **Alan** için `0.002`, **Iy** için `1e-6` girin; **Yükseklik** ve **Kayma düzeltme katsayısı** değerlerini `1` olarak bırakın ve **Kesit ekle** düğmesine tıklayın.

İki ucu mafsallı çubuklarda yalnızca alan önemlidir; $I_y$'nin pozitif olması yeterlidir.

### Çubukları mafsallarıyla çizin {#_2-draw-the-bars-with-hinges}

EduBeam'de bir kafes çubuğu, **iki uç mafsalı da** işaretli bir kiriş elemanıdır. Fareyle çizim aracı bu kutuları sizin yerinize işaretleyebilir; çizim sıranız da elemanlara yukarıdaki tablodaki numaraları verir.

1. **Elemanlar** sekmesi → ikinci **Eleman ekle** düğmesi, imleç simgeli olan.
2. Görüntüleyicinin üstündeki şeritte **Başlangıç mafsalı** ve **Bitiş mafsalı** kutularını işaretleyin. Bundan sonra çizdiğiniz her çubukta ikisi de olur.
3. Alt başlık: (0, 0), (4, 0), (8, 0) ve (12, 0) noktalarına tıklayın, sonra <kbd>Esc</kbd> tuşuna basın.
4. Üst kısım: **Eleman ekle** düğmesine yeniden tıklayın; ardından (0, 0)'daki 1 düğümüne, (4, −3) ve (8, −3) noktalarına ve (12, 0)'daki 4 düğümüne tıklayın. Var olan bir düğüme tıkladığınızda yeni düğüm eklenmez, çubuk o düğüme bağlanır. <kbd>Esc</kbd> tuşuna basın.
5. Örgü çubukları: bir kez daha **Eleman ekle** düğmesine tıklayın; (4, 0)'daki 2 düğümüne, (4, −3)'teki 5 düğümüne, (8, 0)'daki 3 düğümüne ve (8, −3)'teki 6 düğümüne tıklayın. <kbd>Esc</kbd> tuşuna, ardından görünümü ekrana sığdırmak için <kbd>F</kbd> tuşuna basın.

**Elemanlar** tablosunda artık yukarıdaki tablonun dokuz elemanı bulunmalı ve her birinde iki **Uç mafsalları** kutusu da işaretli olmalıdır. <kbd>Esc</kbd> çizim modundan çıkar, ama şeritteki mafsal kutuları bir sonraki çizim için işaretli kalır.

### Mesnetler ve yükler {#_3-supports-and-loads}

1. 1 düğümüne tıklayın → **Düğüm mesnetleri** → **Mafsallı mesnet** simgesi. 4 düğümüne de **Kayıcı mesnet** verin.
2. 2 düğümüne tıklayın → **Yük ekle** → `Fz = 30` → **Düğüm yükü ekle**. Aynısını 3 düğümünde yapın.

Pozitif `Fz` aşağı doğrudur. Bir düğüme bağlanan bütün çubuklar mafsallı olduğundan düğümü dönmeye karşı tutan hiçbir şey yoktur; EduBeam bunu kabul eder ve böyle bir düğümün dönmesini 0 olarak verir.

::

## Sonuçlar {#_4-results}

Görüntüleyicinin sağ üstündeki görünüm seçeneklerinde (dişli simgesi onları gösterir ve gizler) **Deforme şekil** ve **M<sub>y</sub> (x)** seçeneklerinin işaretini kaldırın, çünkü kafes sistemde eğilme yoktur; **N (x)** seçeneğini işaretleyin. Çekme pozitiftir; EduBeam kuvvetleri kN cinsinden, iki ondalık basamakla yazar.

- İki mesnette de yukarı doğru `30,00` görürsünüz. Yatay yük olmadığından mafsallı mesnetin yatay tepkisi `0,00` olarak görünür.
- Alt başlığın üç çubuğunda da `40,00` yazar, yani çekme; üst başlıkta `-40,00`, yani basınç.
- Orta diyagonal 5–3 hiçbir kuvvet taşımaz; bu yüzden, en üstteki şekilde olduğu gibi, etiketi yoktur.
- **Sonuçlar** sekmesi → **Düğüm sonuçları**: 2 düğümü $D_z$ = `2,2937 · 10⁻³ m` kadar, yani 2,294 mm aşağı iner.

## Elle kontrol edin {#_5-check-by-hand}

**Mesnet tepkileri.** Yükler simetrik olduğundan $R_1 = R_4 = 30$ kN (yukarı doğru) olur; yatay yük olmadığı için mafsallı mesnetin yatay tepkisi sıfırdır.

**1 düğümü** (düğüm noktası yöntemi). 1–5 uç diyagonali 5 m uzunluğundadır; dolayısıyla $\sin\alpha = 3/5$ ve $\cos\alpha = 4/5$:

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**2 düğümü.** 30 kN'luk yükü yukarı aktarabilecek tek çubuk 2–5 dikmesidir: $N_{25} = +30$ kN ve $N_{23} = N_{12} = 40$ kN.

**Orta gözden geçen kesim** (kesim yöntemi). 5–6, 5–3 ve 2–3 çubuklarını kesin ve sol parçayı ele alın:

- 3 düğümüne göre moment: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Düşey kuvvetler: gözdeki kesme kuvveti $R_1 - 30 = 0$ olduğundan orta diyagonal **5–3 hiçbir kuvvet taşımaz**: $N_{53} = 0$.

| Çubuklar | El hesabı | EduBeam |
| --- | --- | --- |
| Alt başlık 1–2, 2–3, 3–4 | +40 kN, çekme | 40,00 |
| Üst başlık 5–6 | −40 kN, basınç | −40,00 |
| Uç diyagonalleri 1–5, 6–4 | −50 kN | −50,00 |
| Dikmeler 2–5, 3–6 | +30 kN | 30,00 |
| Orta diyagonal 5–3 | 0 | etiket yok |

Sıfır kuvvetli çubuk gereksiz bir çubuk değildir: *bu* yükleme altında kuvvet taşımaz, ama onu kaldırırsanız kafes sistem göçer. Aşağıdaki deneyler bunu gösteriyor.

::callout{type="details" title="2 düğümünün sehimi, virtüel iş ilkesiyle"}
2 düğümüne aşağı doğru bir birim yük koyun ve kafes sistemi yeniden elle çözün: $R_1 = 2/3$, $R_4 = 1/3$; çubuk kuvvetleri $n$ aşağıdaki tablodadır. Sehim $\delta = \sum N\,n\,L / (EA)$ olur:

| Çubuk | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
| --- | --- | --- | --- | --- |
| 1–2 | 40 | 8/9 | 4 | 142,2 |
| 2–3 | 40 | 8/9 | 4 | 142,2 |
| 3–4 | 40 | 4/9 | 4 | 71,1 |
| 1–5 | −50 | −10/9 | 5 | 277,8 |
| 5–6 | −40 | −4/9 | 4 | 71,1 |
| 6–4 | −50 | −5/9 | 5 | 138,9 |
| 2–5 | 30 | 1 | 3 | 90,0 |
| 5–3 | 0 | −5/9 | 5 | 0 |
| 3–6 | 30 | 1/3 | 3 | 30,0 |
| | | | toplam | 963,3 |

$$
\delta_2 = \frac{963{,}3}{EA} = \frac{963{,}3}{210 \times 10^6 \cdot 0{,}002} = 0{,}002294\ \text{m}
$$

Bu, 2,294 mm demektir; EduBeam'in 2 düğümü için verdiği $D_z$ değeriyle (`2,2937 · 10⁻³` m) aynıdır.
::

## Deneyin {#_6-experiment}

Her seferinde tek bir şeyi değiştirin, sonucu önce tahmin edin, sonra bakın. Her değişikliği <kbd>Ctrl</kbd>+<kbd>Z</kbd> ile geri alabilirsiniz.

**Bir yükün yerini değiştirin.** İki yükü de 2 düğümünde toplayın: 3 düğümündeki yükü silin, diğerini `Fz = 60` olarak değiştirin. Artık $R_1 = 40$ kN, orta gözdeki kesme kuvveti $40 - 60 = -20$ kN'dur ve bunu orta diyagonal taşımak zorundadır: $N_{53} = -20 \cdot 5/3 = -33{,}33$ kN, yani basınç.

::model-figure{caption="2 düğümünde 60 kN: orta diyagonal 5–3 artık gözün kesme kuvvetini taşıyor"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 60 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

**Orta diyagonali kaldırın.** 8 numaralı elemanı silin. Orta göz, yana doğru kayabilen mafsallı bir dikdörtgene dönüşür. EduBeam sonuç göstermez; *Mafsallar yapının hareket etmesine izin veriyor (düğümler: 2, 3, 5, 6).* mesajıyla o gözün dört köşesini bildirir ve hareketi animasyonla gösterir.

**Bütün mafsalların işaretini kaldırın** (**Elemanlar** tablosunda). Kafes sistem rijit düğümlü bir çerçeveye dönüşür. **M<sub>y</sub> (x)** seçeneğini işaretleyin: eğilme momentleri 0,1 kNm'nin altında kalır, normal kuvvetler %0,1'den az değişir. Üçgenlerden oluşan bir kafes sistemde mafsallı düğüm idealleştirmesinin işe yaramasının nedeni budur.

**İki mesneti de mafsallı mesnet yapın.** Dördüncü bir mesnet tepkisi kafes sistemi bir derece hiperstatik yapar ve sonuç sizi şaşırtabilir: alt başlık artık **hiçbir kuvvet** taşımaz; onun yerine her mesnet 40 kN'luk bir kuvvetle içe doğru iter. 1 ve 4 düğümleri birbirinden uzaklaşamaz; bu yüzden aralarında aynı doğru üzerinde duran üç başlık çubuğunun toplam uzaması sıfır olmalıdır. Üçü de aynı kuvveti taşıdığından bu kuvvet sıfırdır ve o 40 kN mesnetlere geçer. Bu sonuç, çubuk alanları ne olursa olsun geçerlidir.

::model-figure{caption="İki mesnet de mafsallı: alt başlığın görevini mesnetler üstlenir"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: pin }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Sonraki adımlar {#next-steps}

Kafes çubuğu elemanının teorisi [Kafes çubuğu](/tr/elements/truss) sayfasında.

::card-grid{cols="2"}
:::card{title="Alıştırma: Warren kafes kirişleri" icon="lucide:dices" to="/tr/practice?p=T2048"}
Daha büyük bir kafes sistemin mesnet tepkileri ve bir çubuğunun kuvveti; cevaplarınız anında kontrol edilir. T2048 ile başlayın; daha fazlası için yalnızca **Warren kafes kirişi** seçili kalsın ve **Yeni soru** düğmesine basın.
:::
:::card{title="Sonraki: sürekli kiriş ve mesnet çökmesi" icon="lucide:spline" to="/tr/tutorials/continuous-beam"}
Hiperstatik bir kiriş: süreklilik ne kazandırır, mesnet çökmesi kirişi nasıl etkiler ve ikisi kuvvet yöntemiyle nasıl kontrol edilir.
:::
::
