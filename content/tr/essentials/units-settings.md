---
description: "EduBeam ayarları: dil, SI ya da ABD birimleri, sayı biçimi, z aşağı/y yukarı eksenler, ızgara, diyagram stili ve renkler, kaydırma tuşu, tarayıcıda saklananlar."
source: site
---

# Birimler ve ayarlar

Çalışacağınız dili, birimleri ve eksenleri, çizimin de nasıl görüneceğini seçin. Ayarlar yalnızca modelin nasıl gösterildiğini ve değerlerin nasıl girildiğini değiştirir: modelin kendisi her zaman SI birimlerinde ve z ekseni aşağı doğru olacak şekilde saklanır; bu yüzden bir proje veya bağlantı hangi ayarlarla açılırsa açılsın aynıdır.

Ayarlara üç yoldan ulaşabilirsiniz:

- görüntüleyicinin üstündeki **Ayarlar** sekmesi, ayarları modelin yerine tam boyutta, *Dil ve bölge* bölümünde açar; **Görüntüleyici** sekmesi sizi modele geri götürür;
- görüntüleyicinin sağ altındaki **birim göstergesi** (`m m² kN kNm MPa`), ayarları bir pencere olarak *Dil ve bölge* bölümünde açar;
- [görünüm seçeneklerinin](/tr/essentials/user-interface#display-options) altındaki **Diğer ayarlar**, pencereyi *Görüntüleyici ayarları* bölümünde açar.

Ayarlar tarayıcınızda saklanır ve sayfa yenilendiğinde kaybolmaz. Bölüm listesinin altındaki **Ayarları sıfırla** varsayılanları geri yükler: sayı biçimi, eksenler, kaydırma tuşu, bölgenize uygun birimler ve tüm görüntüleyici ayarları ile görünüm seçenekleri. Diliniz korunur. Sıfırlama geri alınamaz.

## Dil ve bölge {#language-locale}

![Ayarlar → Dil ve bölge](/screenshots/tr/settings-language.webp)

**Dil.** 22 dil vardır; ilk açılışta EduBeam tarayıcınızın dilini kullanır. Ondalık ayırıcı dile göre belirlenir. Bir bağlantı, okuyucu için dili de seçebilir: `?lang=` parametresini şu kodlardan biriyle ekleyin: `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (Çince), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`.

**Sayı biçimi.** Sonuç değerlerinin tablolarda ve bilgi kutularında nasıl yazılacağı: *Bilimsel* (1,5 · 10⁴, varsayılan), *Mühendislik* (15 · 10³) veya *Otomatik*. Bkz. [Sayı biçimi](/tr/essentials/results#number-format).

**Koordinat sistemi.** *x sağa, z aşağı* (varsayılan) veya *x sağa, y yukarı*. *x sağa, y yukarı* seçildiğinde düşey eksenin adı y olur ve yukarı doğru bakar; momentler z eksenine göre alınır. Düşey koordinatların, kuvvetlerin, yer değiştirmelerin, mesnet tepkilerinin ve mesnet açılarının işareti değişir; her girdi, tablo, bilgi kutusu ve dışa aktarma yeni adları kullanır. Model, çizim ve kaydedilen dosyalar tamamen aynı kalır. Bkz. [y yukarı eksenler](/tr/elements/conventions#y-up-axes).

![y yukarı eksenlerle üç mafsallı çerçeve: köşedeki eksen göstergesi y'yi yukarı gösteriyor](/screenshots/tr/settings-y-up.webp){.shot-lg}

**Birim sistemi.** *SI (metrik)* veya *ABD (emperyal)*, bütün birimleri tek adımda ayarlar. İlk ziyarette seçimi karşılama penceresinde yaparsınız. EduBeam, ABD birimlerini yalnızca tarayıcı ABD bölge ayarındaysa *ve* bilgisayar bir ABD saat dilimindeyse önerir; diğer her durumda SI'yı önerir. Sonradan herhangi bir birimi tek başına değiştirirseniz sistem *Özel* olarak görünür.

### Birimler {#units}

Her büyüklüğün kendi birimi vardır. Giriş alanları (birimi alanın sonunda gösterirler), tablolar, bilgi kutuları ve diyagram etiketleri bu birimi kullanır; bir birimi değiştirmek gösterilen değerleri dönüştürür. Modelde hiçbir şey değişmez; bu yüzden birimler arasında gidip gelmekle hiçbir şey kaybolmaz.

| Büyüklük | Seçenekler | SI | ABD |
| --- | --- | --- | --- |
| Uzunluk (geometri, yük konumları) | m, cm, mm, ft, in | m | ft |
| Kesit boyutları | m, cm, mm, ft, in | m | in |
| Yer değiştirme (sonuçlar, öngörülen mesnet çökmeleri) | m, cm, mm, ft, in | m | in |
| Alan | m², cm², mm², ft², in² | m² | in² |
| Atalet momenti | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Kütle | kg, lb | kg | lb |
| Kuvvet | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Eğilme momenti | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Basınç (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Sıcaklık | °C, °F | °C | °F |

Bazı birimler diğerlerinden türetilir:

- **Yayılı yükler** uzunluk başına kuvvettir: SI'da kN/m, ABD birimlerinde kip/ft.
- **Yoğunluk** uzunluk³ başına kütledir: kg/m³ veya lb/ft³.
- **Isıl genleşme katsayısı** sıcaklık birimini izler: 1/K veya 1/°F. Sıcaklık yüklemeleri sıcaklık *değişimleridir*; bu yüzden 10 °C'lik bir değişim 18 °F demektir.
- **Dönmeler** her zaman radyan, mesnet açıları ise derece cinsindendir.

Tonf, ABD kısa tonu değil, metrik ton-kuvvettir (1000 kgf). ABD birimleri tam tanımlarıyla kullanılır: 1 ft = 0,3048 m, 1 kip = 4448,2216 N. Fit değerlerini `5.5` gibi ondalık sayı olarak yazın; cetveller ve artı imleci ise fit ve inç cinsinden gösterir (5′-6″).

## Görüntüleyici ayarları {#viewer-settings}

Bu bölüm çizimin nasıl görüneceğini belirler. Sağdaki **Görüntüleyici önizlemesi**, her değişikliği anında gösteren küçük, eğik bir kiriştir; altındaki düğmeler hangi sonucun gösterileceğini seçer. Bir diyagram ayarını veya bir rengi değiştirdiğinizde önizleme o sonuca geçer.

![Ayarlar → Görüntüleyici ayarları, sağda canlı önizleme ve diyagram ayarları](/screenshots/tr/b-settings-viewer.webp)

Sol sütun, yukarıdan aşağıya:

- *Izgara*: **Izgarayı göster** (<kbd>G</kbd>) ızgarayı ve cetvelleri çizer; **Izgaraya yakala** (<kbd>S</kbd>) yerleştirdiğiniz veya sürüklediğiniz düğümleri ızgaraya oturtur; **Artı imlecini göster** fareyle çalışırken imlecin konumunu cetvellerde işaretler. Üçü de başlangıçta açıktır. **Izgara adımı** 0,1 m, ABD birimlerinde 0,5 ft'tir. Metrik ve ABD birimleri arasında geçiş yaptığınızda, hâlâ varsayılan değerde olan bir adım diğer sistemin varsayılanına geçer; kendi belirlediğiniz adım korunur.
- *Boyutlar*: **Sonuç ölçeği** 8 ile 120 px arasındadır (başlangıçta 48 px) ve bir diyagramın en büyük ordinatının veya en büyük sehimin ne kadar yüksek çizileceğini belirler. Ayar tamamen görseldir, çünkü her diyagram kendi en büyük değerine göre ölçeklenir. **Mesnet boyutu** %50 ile %150 (%100), **Yazı boyutu** 10 ile 20 px (14 px) arasındadır; projeksiyonla gösterirken büyük değerler işe yarar.
- *Sonuç etiketlerinin yönü*: değerler ya ordinat doğrultusunda (*Diyagrama dik*, varsayılan) ya da *Her zaman yatay* yazılır.
- *Model denetimi*: **Kararsız yapının nasıl hareket edebileceğini göster** mekanizmayı kesikli çizgiyle çizer, **Hareketi canlandır** ise yapıyı bu mekanizmaya göre ileri geri hareket ettirir. İkisi de başlangıçta açıktır.

### İç kuvvet diyagramları {#internal-force-diagrams}

Diyagram çizme alışkanlıkları okuldan okula değişir; bu yüzden EduBeam seçimi size bırakır. Bu ayarlar yalnızca çizimi değiştirir, değerleri asla değiştirmez. Her eleman boyunca uzanan **kesikli çizgi**, elemanın alt liflerini, yani yerel z ekseninin baktığı tarafı gösterir (bkz. [Eleman yönü](/tr/essentials/elements#element-direction)).

| Ayar | Seçenekler | Varsayılan |
| --- | --- | --- |
| **Eğilme momenti** | *Çekme tarafı* veya *Basınç tarafı* üzerine çizilir | *Çekme tarafı* |
| **Pozitif kesme kuvveti** | kesikli çizginin karşısına (*Karşı taraf*) veya kesikli çizginin olduğu tarafa (*Kesikli taraf*) çizilir | *Karşı taraf* |
| **Pozitif normal kuvvet** | *Karşı taraf* veya *Kesikli taraf* | *Karşı taraf* |
| **Dolgu** | *Düz*, *Taralı* (elle çizildiği gibi çubuğa dik çizgiler) veya *Yok* | *Düz* |
| **Her bölgenin derecesi** | diyagramın her bölgesine polinom derecesini, 0° ile 3° arasında, yazar | kapalı |

İşaretlerin nasıl okunacağı [Sonuçlar ve diyagramlar](/tr/essentials/results#reading-the-sign) sayfasında açıklanır.

### Renkler {#colors}

Düğümler, elemanlar, yükler, deforme şekil, normal kuvvet, kesme kuvveti, eğilme momenti ve mesnet tepkileri için ayrı renkler. Bir renk seçmek için renk örneğine tıklayın. Varsayılanlar: yükler turuncu, deforme şekil gri, N mavi, V yeşil, M kırmızı, mesnet tepkileri mor, düğümler ve elemanlar siyah.

## Kontroller ve kısayollar {#controls-shortcuts}

**Kaydırma tuşu**, tuvali hangi fare tuşuyla sürükleyeceğinizi belirler: *Fare tekerleği veya sağ tuş* (varsayılan), *Fare tekerleği* (tekerleğe basıp sürükleyin) veya *Sağ tuş*. Bütün kısayollar [Klavye, fare ve dokunmatik](/tr/reference/shortcuts) sayfasındadır.

## Tarayıcınızda neler saklanır {#what-is-stored-in-your-browser}

EduBeam, ayarların yanı sıra tarayıcı belleğinde şunları tutar:

- **mevcut model**: her değişiklikten sonra kaydedilir; böylece sekmeyi yenilediğinizde veya uygulamayı yeniden açtığınızda geri gelir;
- **Son modeller**: temizlediğiniz veya yerine başkasını açtığınız son 10 model; ☰ menüsünden geri yüklenmeye hazırdır.

İkisi de bu cihazdaki bu tarayıcıya aittir; site verilerini temizlerseniz ikisi de silinir. Bir modeli saklamak veya başka bir cihaza taşımak için [Projeyi kaydet veya Modeli paylaş](/tr/essentials/import-export) seçeneklerini kullanın.
