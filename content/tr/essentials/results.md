---
description: "EduBeam sonuçlarını okuyun: N, V, M diyagramları, deforme şekil, mesnet tepkileri ve işaretleri, bilgi kutuları, tablolar, CSV, rijitlik matrisi ve sayı biçimi."
source: site
---

# Sonuçlar ve diyagramlar

[EduBeam]{.edubeam} modeli her değişiklikten sonra çözer; bu yüzden ekrandaki diyagramlar, mesnet tepkileri ve tablolar her zaman gördüğünüz modele aittir. Ayrı bir *Çöz* düğmesi yoktur. Hiçbir şey çizilmiyorsa model henüz çözülemiyor demektir: nedenini görüntüleyicinin sol üstündeki mesaj söyler, her mesaj da [Sorun giderme](/tr/reference/troubleshooting) sayfasında açıklanır.

## Görüntüleyicideki diyagramlar {#overlays-in-the-viewer}

Sonuçlar modelin üzerine çizilir. Onları görüntüleyicinin sağ üstündeki **görünüm seçeneklerinden** açıp kapatın; seçeneklerin üstündeki ⚙ düğmesi paneli gösterir veya gizler.

::model-figure{caption="10 kN/m yüklü üç mafsallı çerçeve: M, V, N ve deforme şekil arasında geçiş yapın"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, V, N, w]
show: [nodeLabels]
height: 300
---
::

| Seçenek | Çizdiği | Renk | Başlangıçta açık |
| --- | --- | --- | --- |
| **Deforme şekil** | yapının yer değiştirmiş hâli, görünür olsun diye büyütülmüş olarak | gri | evet |
| **N (x)** | normal kuvvet | mavi | |
| **V<sub>z</sub> (x)** | kesme kuvveti | yeşil | |
| **M<sub>y</sub> (x)** | eğilme momenti | kırmızı | evet |
| **Mesnet tepkileri** | her tutulu doğrultu için bir ok ve bir değer | mor | evet |

İkinci sıra çizimin kendisini açıp kapatır: **Mesnetler**, **Yükler**, **Düğüm etiketleri** ve **Eleman etiketleri**. Panelin altındaki **Diğer ayarlar**, [görüntüleyici ayarlarını](/tr/essentials/units-settings#viewer-settings) açar; orada diyagramların boyutunu (*Sonuç ölçeği*), renkleri, etiketlerin yönünü ve diyagram stilini ayarlarsınız.

Değerler önemli oldukları yerlere yazılır: her çubuğun iki ucuna, tekil yükün altında veya mesnet üzerinde bir sıçramanın iki yanına ve diyagramın her ekstremumuna, örneğin bir parabolün $V = 0$ olan tepe noktasına. Yukarıdaki şekil, [Üç mafsallı çerçeve](/tr/tutorials/three-hinged-frame) eğitimindeki çerçevedir ve sonuçlarını elle kontrol edebilirsiniz: her kolonda 40 kN, kirişte 20 kN basınç ve iki köşede −80 kNm. *w* görünümünde C'deki mafsalın 42,55 mm çöktüğü görülür.

### İşaretin okunması {#reading-the-sign}

İşareti diyagramın çubuğun hangi tarafına çizildiğinden değil, **değerden** okuyun. İşaret kabulleri çoğu ders kitabındakiyle aynıdır:

| Sonuç | Pozitif olması şu anlama gelir |
| --- | --- |
| **N** | çekme |
| **V<sub>z</sub>** | çubuktan kesilen kısa bir parçayı saat yönünde döndürür. $V = \mathrm{d}M/\mathrm{d}x$ olduğundan, yerçekimi yükü altındaki basit mesnetli bir kirişte sol mesnette pozitif, sağ mesnette negatiftir |
| **M<sub>y</sub>** | pozitif moment: alt lifte, yani her çubuk boyunca çizilen **kesikli çizginin** tarafında çekme |

Konsollu bir kiriş iki işareti birden gösterir. Mesnetler arasında pozitif moment (+13,5 kNm), sağ mesnet üzerinde ise üst lifleri çekmede olan negatif moment (−24 kNm) oluşur. Kesme kuvveti B'deki 54 kN'luk mesnet tepkisi kadar, −30'dan +24 kN'a sıçrar:

::model-figure{caption="12 kN/m yüklü konsollu kiriş: mesnetler arasında pozitif, B üzerinde negatif moment"}
---
nodes: { A: [0, 0], B: [4, 0], C: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

Varsayılan olarak eğilme momenti **çekme tarafına**, pozitif normal ve kesme kuvvetleri ise kesikli çizginin karşı tarafına çizilir. Bu konuda okulların alışkanlıkları farklıdır; bu yüzden her biri **Ayarlar → Görüntüleyici ayarları → İç kuvvet diyagramları** bölümünden ters çevrilebilir. Orada diyagramları elle çizilmiş gibi tarayabilir ve her bölgeye polinom derecesini yazdırabilirsiniz. Tarafı değiştirdiğinizde yalnızca çizim değişir, değerler asla değişmez. Elemanın yerel eksenleri dahil işaret kabullerinin tamamı [teori kılavuzunda](/tr/elements/conventions#internal-forces) yer alır.

## Bilgi kutuları {#hover-tooltips}

Bir nesnenin değerlerini okumak için imleci üzerine getirin:

- **Düğüm**: $u_x$, $u_z$ yer değiştirmeleri (yer değiştirme biriminde) ve $\varphi_y$ dönmesi (radyan cinsinden).
- **Eleman**: etiketi, kesiti ve malzemesi.
- **Yük**: bileşenleri.

Dokunmatik ekranda nesneye dokunun: nesnenin paneli aynı bilgileri gösterir.

![İmleç, Hızlı başlangıç kirişinin 2 numaralı düğümünün üzerinde](/screenshots/tr/ui-hover.webp){.shot-sm}

## Sonuçlar sekmesi {#results-tab}

Alt paneldeki **Sonuçlar** sekmesinde iki tablo vardır; **Düğüm sonuçları** ve **Eleman sonuçları** düğmeleriyle aralarında geçiş yaparsınız.

### Düğüm sonuçları {#nodal-results}

Her düğüm için bir satırda, global eksenlerde **D<sub>x</sub>** ve **D<sub>z</sub>** yer değiştirmeleri (yer değiştirme biriminde) ile **R<sub>y</sub>** dönmesi (radyan cinsinden) yer alır: pozitif D<sub>z</sub> aşağı doğrudur, pozitif R<sub>y</sub> ise ekranda saat yönünün tersinedir. Mesnetli bir doğrultuda 0 ya da tanımladığınız mesnet çökmesi görünür. Mesnet tepkileri bu tabloda yoktur: onları çizimden veya [CSV dosyasından](#export-csv-and-copy) okuyun.

![Yukarıdaki üç mafsallı çerçevenin düğüm sonuçları, Sayı biçimi: Otomatik](/screenshots/tr/p2c-results-nodal.webp){.shot-lg}

### Eleman sonuçları {#element-results}

Her eleman için bir satırda **elemanın yerel koordinat sistemindeki çubuk uç kuvvetleri** yer alır:

| Sütun | Anlamı |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | elemanın **başlangıç** düğümünde elemana etkiyen eksenel kuvvet, kesme kuvveti ve moment |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | aynı büyüklükler **bitiş** düğümünde |

![Üç mafsallı çerçevenin eleman sonuçları: dört çubuğunun uç kuvvetleri](/screenshots/tr/p2c-results-element.webp)

Çubuk uç kuvvetleri, düğümlerin elemana uyguladığı kuvvetlerdir. Diyagramların N-V-M işaret kabulünü değil, yerel eksenleri izlerler; bu yüzden işaretleri farklıdır:

- **Basit mesnetli kiriş** (6 m, 12 kN/m, [Hızlı başlangıç](/tr/guide/quick-start) kirişi): Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. İki mesnet de kirişi yukarı, yani −z yönünde iter.
- Başlangıç düğümünde ankastre, ucunda 18 kN'luk aşağı yönlü yük taşıyan **konsol**: Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **Çerçevenin 1 numaralı kolonu** (A altta, B üstte): X<sub>12</sub> = +40 kN, yerel x ekseni boyunca elemanın içine doğru iter; bu da 40 kN'luk basınç demektir.

Bu tablo [teori kılavuzunda](/tr/elements/conventions#end-forces-element-results-table) ayrıntılı olarak anlatılır.

### CSV olarak dışa aktarma ve kopyalama {#export-csv-and-copy}

**CSV olarak dışa aktar**, iki tabloyu içeren `edubeam-results.csv` dosyasını ekranda gösterilen birimlerle, elektronik tabloya hazır olarak indirir. **Kopyala**, aynı tabloları sekmeyle ayrılmış metin olarak panoya koyar; bu metin doğrudan Excel'e, LibreOffice'e veya Google E-Tablolar'a yapıştırılabilir.

| Tablo | Sütunlar |
| --- | --- |
| Düğümler | Node, x, z, Dx, Dz, Ry ve **mesnet tepkileri** Rx, Rz, My |
| Elemanlar | Element, Node 1, Node 2 ve çubuk uç kuvvetleri N1, V1, M1, N2, V2, M2 |

Her sütun başlığı birimini taşır, örneğin `Dz [mm]`. Eleman uç kuvvetleri, ekrandaki X<sub>12</sub> … M<sub>21</sub> ile aynı yerel değerlerdir.

### Rijitlik matrisi {#stiffness-matrix}

Bir elemanın panelinde veya *Elemanlar* tablosundaki satırında bulunan düğmeyle **Rijitlik matrisi** seçeneğini seçin; elemanın **global koordinatlardaki** ve SI birimlerindeki (N, m) 6 × 6 rijitlik matrisi açılır. Rijitlik yöntemi derslerinde elle yapılan birleştirmeyi kontrol etmek için kullanışlıdır; formüller [teori kılavuzunda](/tr/elements/beam) yer alır.

## Sayı biçimi {#number-format}

Tablolar ve bilgi kutuları sonuçları beş anlamlı basamakla gösterir. Nasıl yazılacaklarını **Ayarlar → Dil ve bölge → Sayı biçimi** belirler:

| Biçim | 40 000 şöyle yazılır | Kullanım alanı |
| --- | --- | --- |
| **Bilimsel** (varsayılan) | 4 · 10⁴ | büyüklük mertebeleri çok farklı olan değerler |
| **Mühendislik** | 40 · 10³ | kilo ve mega öneklerini doğrudan okumak |
| **Otomatik** | 40.000 | derslerdeki gündelik sayılar |

*Otomatik* biçim, 0,001 ile 100 000 arasındaki değerleri düz sayı olarak yazar. Bu aralığın dışında değerleri *Mühendislik* biçimi gibi, üçer üçer ilerleyen 10'un kuvvetleriyle yazar; yukarıdaki düğüm sonuçlarında görülen 380,95 · 10⁻⁹ gibi. Ondalık ayırıcı dile göre belirlenir.

Çizimdeki etiketler (diyagram değerleri ve mesnet tepkileri), sayı biçimi ne olursa olsun her zaman iki ondalık basamakla yazılır: 6,6667 kN, 6,67 olarak görünür. Daha fazla basamak gerektiğinde tablolara veya bilgi kutularına bakın.

## Hassasiyet ve doğruluk {#precision-and-accuracy}

- Kiriş elemanı; düğüm yükleri, düzgün yayılı, trapez, tekil yükler ve sıcaklık yüklemeleri altında doğrusal Timoshenko modeli için kesin sonuç verir. Sonuçlar eleman sayısına **bağlı değildir** ve sıklaştırılacak bir sonlu eleman ağı yoktur.
- Hesap çift duyarlıkla yapılır. Kendi türündeki en büyük değerin trilyonda birinden küçük bir değer yuvarlama hatasıdır ve tablolar onu 0 olarak gösterir.
- Sehimler **kayma şekil değiştirmesini** içerir; hiperstatik bir yapıda bu, kuvvetleri de biraz değiştirir. Narin çubuklarda Euler–Bernoulli sehimine %1'in altında bir katkı yapar; kısa ve yüksek çubuklarda %10'a, hatta daha fazlasına ulaşabilir. Etkinin ne kadar büyük olduğunu ve ders kitabı formülleriyle karşılaştırmak için nasıl kapatılacağını [Sonuçların elle kontrolü](/tr/guide/verification#shear-deformation) sayfası gösterir.

## Sonuçları rapora aktarma {#results-in-a-report}

- **☰ → Görüntüyü dışa aktar** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) çizimi, seçtiğiniz diyagramlarla birlikte PNG veya SVG olarak kaydeder. Bkz. [Görüntüyü dışa aktarma](/tr/essentials/import-export#export-an-image).
- Sayılar için Sonuçlar sekmesindeki **CSV olarak dışa aktar** veya **Kopyala** düğmesini kullanın.
- **Modeli paylaş** bir bağlantı verir; okuyucu bu bağlantıyla modelin kendisini açabilir.
- Ders notları ve föyler için [`@edubeam/plot` çizim kütüphanesi](/tr/plot) aynı diyagramları koddan çizer.
