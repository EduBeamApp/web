---
description: "EduBeam arayüzünün haritası: üst araç çubuğu ve ☰ menüsü, görüntüleyici ve görünüm seçenekleri, seçme ve düzenleme, alt paneldeki tablolar ve değer girme."
source: site
---

# Kullanıcı arayüzü

[EduBeam]{.edubeam} ekranı üç bölümden oluşur: üstte **üst araç çubuğu**, ortada çizim yaptığınız **görüntüleyici** ve altta her nesne türü için bir tablo bulunan **alt panel**. Görüntüleyicide yapabildiğiniz her şeyi tablolarda da yapabilirsiniz; tersi de geçerlidir.

![Arayüzün bölümleri, aşağıdaki listeyle aynı numaralarla](/screenshots/tr/ui-overview.webp)

1. **☰ menüsü**: açma, kaydetme, paylaşma ve dışa aktarma; örnekler ve rehberli turlar.
2. **Modeli temizle** ve **Modeli paylaş**.
3. **Geri al** ve **Yinele**.
4. **Görüntüleyici düğmeleri**: ortalama, ekrana sığdırma ve görünüm seçenekleri.
5. **Görünüm seçenekleri**: hangi sonuçların ve model parçalarının çizileceği.
6. **Izgara, yakalama, artı imleci ve birimler.**
7. **Alt panel sekmeleri**: Düğümler, Elemanlar, Yükler, Malzemeler, Kesitler, Sonuçlar.
8. Açık sekmenin **tablosu**; buradaki her değeri düzenleyebilirsiniz.

::callout{type="tip" title="Turu başlatın"}
**☰ → Beni gezdir**, bu bölümleri uygulamanın içinde tek tek gösterir.
::

## Üst araç çubuğu {#app-bar}

- **☰** ana menüyü açar (aşağıya bakın).
- **Modeli temizle**, onayınızı aldıktan sonra tüm düğümleri, elemanları ve yükleri siler. Malzemeleri ve kesitleri de kaldırmak için **Malzemeleri sil** veya **Kesitleri sil** kutusunu işaretleyin. <kbd>Ctrl</kbd>+<kbd>Z</kbd> modeli geri getirir; model *Son modeller* listesinde de saklanır.
- **Modeli paylaş**, tüm modeli içeren bir bağlantıyla [paylaşım penceresini](/tr/essentials/import-export#share-a-link) açar.
- **Yenilikler** sürüm notlarını gösterir. Notlar bir güncellemeden sonra bir kez kendiliğinden de açılır.
- **Dokümantasyon** bu kılavuzu, GitHub simgesi ise kaynak kodu açar.

Telefonda yalnızca ☰ ve **Dokümantasyon** sığar; **Modeli temizle** ile **Modeli paylaş** menüdedir.

### ☰ menüsü {#the-☰-menu}

![☰ menüsü](/screenshots/tr/ui-app-menu.webp){.shot-xs}

- **Proje aç** ve **Projeyi kaydet** bir `project.json` dosyasını açar veya indirir (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>).
- **Son modeller**, temizlediğiniz veya yerine başkasını açtığınız son 10 modeli geri yüklemeye hazır tutar.
- **Görüntüyü dışa aktar** çizimi PNG veya SVG olarak kaydeder ya da panoya kopyalar (<kbd>Ctrl</kbd>+<kbd>P</kbd>).
- **Örnekler** hazır modellerin galerisidir; **İlk kirişinizi çizin** yedi adımlık rehberli bir görevdir; **Beni gezdir** ise arayüz turudur.
- **Modeli paylaş** ve **Modeli temizle**, üst araç çubuğundaki düğmelerle aynı işi yapar.

Menünün en altında uygulamanın sürümü ve yayımlanma tarihi yer alır. Açma, kaydetme, paylaşma ve dışa aktarma [Dosyalar, bağlantılar ve dışa aktarma](/tr/essentials/import-export) sayfasında anlatılır.

## Görüntüleyici {#viewer}

Tuval, modeli çizdiğiniz ve incelediğiniz yerdir. EduBeam sonuçları her değişiklikte yeniden hesaplar; ayrı bir *Çöz* düğmesi yoktur.

### Tuvaldeki düğmeler {#buttons-on-the-canvas}

**Sol üst: Geri al ve Yinele**, modeldeki her değişikliği adım adım geri alır ve yineler: ekleme, düzenleme, sürükleme, silme, temizleme (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>).

**Sağ üst:**

- **Dikdörtgenle seç** (dokunmatik ekranlı cihazlarda): parmağınızla yapacağınız bir sonraki sürükleme bir seçim dikdörtgeni çizer.
- **Modeli ortala**, modeli yakınlaştırmadan ortaya alır (<kbd>C</kbd>); **Modeli ekrana sığdır** ise tüm model ekrana sığacak şekilde yakınlaştırır (<kbd>F</kbd>).
- **⚙** [görünüm seçeneklerini](#display-options) gösterir veya gizler.

**Sağ alt:**

![Izgara, yakalama, artı imleci ve birim düğmeleri](/screenshots/tr/ui-grid-units.webp){.shot-sm}

- **G** ızgarayı ve cetvelleri gösterir veya gizler (<kbd>G</kbd>); **S** ızgaraya yakalamayı açar veya kapatır (<kbd>S</kbd>).
- **Artı imleci** düğmesi imlecin konumunu cetvellerde işaretler; yalnızca fareyle çalışır.
- **Birim göstergesi**, ayarları [Dil ve bölge](/tr/essentials/units-settings#language-locale) sayfasında açar.

### Görünüm seçenekleri {#display-options}

⚙ düğmesi iki sıra onay kutusu açar. Birinci sıra, modelin üzerine çizilecek sonuçları seçer: *Deforme şekil*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)* ve *Mesnet tepkileri*; başlangıçta deforme şekil, eğilme momenti ve mesnet tepkileri açıktır. İkinci sıra modelin parçalarını gösterir veya gizler: *Mesnetler*, *Yükler*, *Düğüm etiketleri* ve *Eleman etiketleri*; bunların hepsi başlangıçta açıktır.

![Görüntüleyici düğmeleri ve görünüm seçenekleri](/screenshots/tr/ui-display-settings.webp){.shot-lg}

**Diğer ayarlar**, [görüntüleyici ayarlarını](/tr/essentials/units-settings#viewer-settings) açar: boyutlar, renkler ve diyagramların nasıl çizileceği. Her sonucun neyi gösterdiği [Sonuçlar ve diyagramlar](/tr/essentials/results#overlays-in-the-viewer) sayfasında açıklanır.

### Gezinme {#navigating}

| İşlem | Fare ve klavye | Dokunmatik |
| --- | --- | --- |
| Yakınlaştırma | Fare tekerleği, imlecin olduğu yere doğru; dokunmatik yüzeyde iki parmakla kıstırma veya iki parmakla kaydırma | İki parmakla kıstırma |
| Kaydırma | Sağ tuşla veya basılı tekerlekle sürükleme; hangisi olacağını [Kontroller ve kısayollar](/tr/essentials/units-settings#controls-shortcuts) bölümünde seçin | Tek parmakla sürükleme |
| Sığdırma, ortalama | <kbd>F</kbd>, <kbd>C</kbd> veya sağ üstteki düğmeler | Sağ üstteki düğmeler |

<kbd>Ctrl</kbd>+<kbd>+</kbd> ve <kbd>Ctrl</kbd>+<kbd>-</kbd>, klavye düzeni ne olursa olsun çizimi merkezine göre yakınlaştırır ve uzaklaştırır. Tarayıcının kendi yakınlaştırması gibi tüm arayüzü büyütüp küçültmez.

### Seçme ve düzenleme {#selecting-and-editing}

| Amaç | Yapılacak |
| --- | --- |
| Tek bir nesne seçmek | Bir düğüme, elemana, yüke veya ölçü çizgisine tıklayın. Yanında, ona uygun işlemleri içeren bir panel açılır: yük ekleme, mesnet tanımlama, düzenleme, rijitlik matrisini gösterme, silme. Alt panel de o nesnenin sekmesine geçer. |
| Birden çok nesne seçmek | Tuvalin boş bir yerinde bir dikdörtgen sürükleyin (dokunmatik ekranda önce **Dikdörtgenle seç** düğmesine basın). Dikdörtgenin içindeki her düğüm ve dikdörtgenin değdiği her eleman, yükleri ve ölçü çizgileriyle birlikte seçilir. <kbd>Ctrl</kbd>+<kbd>A</kbd> her şeyi seçer. |
| Silmek, kopyalamak, yapıştırmak | <kbd>Delete</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>. Yapıştırılan kopya, siz tıklayana kadar imleci izler; isterseniz beliren şeride bir Δx, Δz kaydırması da yazabilirsiniz. |
| Bir düğümü taşımak | Düğümü sürükleyin. Yakalama açıksa düğüm ızgaraya oturur; bağlı elemanlar ve yükler de onunla birlikte hareket eder. |
| Bir yükü düzenlemek | Yüke çift tıklayın. |
| Ayrıntıları görmek | Bilgi kutusu için imleci herhangi bir nesnenin üzerine getirin: düğümün yer değiştirmeleri ve dönmesi, elemanın malzemesi ve kesiti, yükün değerleri. Dokunmatik ekranda nesneye dokunun: panel aynı bilgileri gösterir. |
| Tuval menüsünü açmak | Tuvale sağ tıklayın veya dokunmatik ekranda basılı tutun. |

::div{.shots}

![Düğüm paneli: yük ekleme, mesnet tanımlama, yer değiştirme tanımlama](/screenshots/tr/ui-node-menu.webp)

![İmleci bir düğümün üzerine getirdiğinizde düğümün yer değiştirmeleri ve dönmesi görünür](/screenshots/tr/ui-hover.webp)

::

**Tuval menüsünde** *Düğüm ekle*, *Eleman ekle*, *Ölçü ekle* (bir elemanın üzerinde ayrıca *… elemanını ölçülendir*), ardından geçerli seçim için *Düzenle*, *Kopyala*, *Yapıştır* ve *Sil* bulunur. *Düğüm ekle* veya *Eleman ekle* seçeneğini seçerken <kbd>Ctrl</kbd> tuşunu basılı tutarsanız nesneleri pencere yerine fareyle yerleştirirsiniz.

![Tuval menüsü](/screenshots/tr/ui-canvas-menu.webp){.shot-sm}

Tüm kısayollar ve dokunma hareketleri [Klavye, fare ve dokunmatik](/tr/reference/shortcuts) sayfasında listelenir.

### Model çözülemediğinde {#when-the-model-cannot-be-solved}

Görüntüleyicinin sol üst köşesinde mesajlar görünür:

| Mesaj | Anlamı |
| --- | --- |
| *Tanımlı malzeme yok.*, *Tanımlı kesit yok.* | Yanındaki **Yeni ekle** düğmesiyle bir tane ekleyin. |
| Mavi bir **Mesnet gerekli** göstergesi | Model yalnızca henüz tamamlanmamış: daha fazla mesnet gerekiyor. |
| **Ayrıntıları göster** düğmeli kırmızı bir mesaj | Modelde bir hata var. Ayrıntılar her sorunu bir ipucuyla birlikte listeler. |
| Sarı bir mesaj | Model çözüldü, ancak bir şey olağan dışı görünüyor; örneğin hiçbir elemana bağlı olmayan bir düğüm. |

Yapı hâlâ hareket edebiliyorsa EduBeam bu hareketi kesikli çizgiyle canlandırır ve soruna yol açan düğümleri veya mafsalları daire içine alır. Hareketi yeniden görmek için imleci mesajın üzerine getirin; mesajdaki göz düğmesi hareketi gizler.

![B ve C'de mafsallı bir çerçeve mekanizmadır: EduBeam çerçevenin nasıl hareket ettiğini gösterir](/screenshots/tr/ui-mechanism.webp)

Her mesajın anlamı ve nasıl giderileceği [Sorun giderme](/tr/reference/troubleshooting#messages) sayfasında açıklanır.

## Alt panel {#bottom-bar}

Her biri bir araç çubuğu ve düzenlenebilir bir tablo içeren altı sekme vardır. Sekmenin etiketi, içinde kaç nesne olduğunu gösterir. Paneli yeniden boyutlandırmak için sekme şeridini yukarı veya aşağı sürükleyin ya da sağdaki düğmeyle paneli daraltın. Bu düğmenin yanındaki **?** açık sekmeyi açıklar; bazı sütun başlıklarının yanındaki **?** de aynı işi görür.

| Sekme | Araç çubuğu | Tablo sütunları |
| --- | --- | --- |
| **Düğümler** | Düğüm ekle (pencere), Düğüm ekle (fare) | Düğüm, Koordinatlar, **Tutulu serbestlik dereceleri** (mesnet sembolü, `Dx`, `Dz`, `Ry`, α açısı), Yükler, İşlemler |
| **Elemanlar** | Eleman ekle (pencere), Eleman ekle (fare) | Eleman, Tür, Düğümler (**Düğüm sırasını ters çevir** düğmesiyle), Malzeme, Kesit, **Uç mafsalları**, Yükler, İşlemler |
| **Yükler** | Düğüm yükü ekle, Eleman yükü ekle | Tür, Hedef, Bileşenler, İşlemler |
| **Malzemeler** | Malzeme ekle, Malzeme kütüphanesi | Malzeme, E, G, α<sub>T</sub>, İşlemler |
| **Kesitler** | Kesit ekle, Kesit kütüphanesi, Çokgen kesit | Şekil, Kesit, Alan, I<sub>y</sub>, Yükseklik, Kayma düzeltme katsayısı, İşlemler |
| **Sonuçlar** | Düğüm sonuçları, Eleman sonuçları, CSV olarak dışa aktar, Kopyala | Düğüm başına yer değiştirmeler veya eleman başına çubuk uç kuvvetleri; bkz. [Sonuçlar sekmesi](/tr/essentials/results#results-tab) |

Sekmeler [Düğümler ve mesnetler](/tr/essentials/nodes-supports), [Elemanlar, malzemeler ve kesitler](/tr/essentials/elements), [Yükler](/tr/essentials/loads) ve [Sonuçlar ve diyagramlar](/tr/essentials/results#results-tab) sayfalarında ayrıntılı olarak anlatılır.

### Değer girme {#typing-values}

Tablolardaki ve pencerelerdeki her sayı alanı aynı şekilde çalışır:

- Değerler [geçerli birimlerdedir](/tr/essentials/units-settings#units); birim sütun başlığında veya alanın sonunda yazılıdır.
- Ondalık nokta da virgül de kabul edilir: `2.5` ile `2,5` aynıdır.
- Aritmetik işlem de yazabilirsiniz: `+ - * / ^` ve parantezler. `6/2`, `3*1.5`, `2^3` veya `(4+2)/3` sizin için hesaplanır; `1e-5` ise $10^{-5}$ demektir.
- Tabloda değeri <kbd>Enter</kbd>, <kbd>Esc</kbd> veya <kbd>Tab</kbd> tuşuna basarak ya da başka bir yere tıklayarak uygularsınız. Ardından <kbd>Ctrl</kbd>+<kbd>Z</kbd> bu değişikliği geri alır; siz daha yazarken ise yazdığınızı geri alır.

## Görüntüleyicinin üstündeki sekmeler {#tabs-above-the-viewer}

**Görüntüleyici** tuvali gösterir. **Ayarlar**, tuvalin yerine [ayarları](/tr/essentials/units-settings) tam boyutta açar; böylece renkleri veya birimleri değiştirip etkisini görmek için geri dönebilirsiniz. Birim göstergesi ve *Diğer ayarlar*, aynı ayarları modelin üzerinde bir pencere olarak açar.

## Kayan pencereler {#floating-windows}

**Rijitlik matrisi** (bir elemanın panelinden veya *Elemanlar* tablosundan), elemanın global eksenlerdeki 6 × 6 rijitlik matrisini bir pencerede açar. Tuval menüsündeki **Düzenle**, geçerli seçimin tablosunu açar. Bir pencereyi başlık çubuğundan sürükleyerek taşıyın ve × ile kapatın.
