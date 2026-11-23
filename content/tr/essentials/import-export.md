---
description: "Projeleri kaydedip açın, masaüstü EduBeam oturumlarını yükleyin, modeli bağlantıyla paylaşın, görüntüleyici gömün, görüntü ve tablo dışa aktarın."
source: site
---

# Dosyalar, bağlantılar ve dışa aktarma

:span{#ice-aktarma-dısa-aktarma-ve-paylasım}

Modelinizi dosya olarak kaydedin, bağlantı olarak gönderin, bir web sayfasına gömün ya da görüntüsünü veya sonuç tablosunu dışa aktarın. [EduBeam]{.edubeam}'de her şey tarayıcınızda gerçekleşir ve hiçbir şey bir sunucuya yüklenmez: paylaşım bağlantısı modelin kendisini içerir.

::card-grid{cols="3"}
:::card{title="Proje dosyası" icon="lucide:file-json" to="#save-a-project"}
Saklamak, teslim etmek veya sonra açmak için `project.json`.
:::
:::card{title="Paylaşım bağlantısı" icon="lucide:link" to="#share-a-link"}
Ders notları, slaytlar ve mesajlar için tüm model tek bir URL'de.
:::
:::card{title="Görüntü veya tablo" icon="lucide:image" to="#export-an-image"}
Raporlar için PNG veya SVG, elektronik tablolar için CSV.
:::
::

## Projeyi kaydetme {#save-a-project}

**☰ → Projeyi kaydet** veya <kbd>Ctrl</kbd>+<kbd>S</kbd> (Mac'te <kbd>⌘</kbd>+<kbd>S</kbd>; bu sayfadaki bütün kısayollar için aynısı geçerlidir) `project.json` dosyasını indirir. Dosya düğümleri, elemanları, malzemeleri, kesitleri (çizilmiş şekilleriyle birlikte), yükleri, ölçü çizgilerini ve dosyayı yazan uygulama sürümünü içerir. Dosyanın adını istediğiniz gibi değiştirebilirsiniz.

## Proje açma {#open-a-project}

**☰ → Proje aç** veya <kbd>Ctrl</kbd>+<kbd>O</kbd> ile dosyayı seçin ya da **dosyayı uygulama penceresinin herhangi bir yerine sürükleyip bırakın**. EduBeam şunları açar:

- EduBeam'in bütün sürümlerinde kaydedilmiş `project.json` dosyaları;
- **masaüstü EduBeam** 2.x–3.5 ile kaydedilmiş `.xml` oturum dosyaları. Bu dosyalardaki değerler birim taşımaz; bu yüzden eski programın kılavuzundaki birimlerle, yani kN, kPa ve m cinsinden okunur. EduBeam tek seferde tek bir yükleme durumu açar: birden çok yükleme durumu içeren bir oturumda ilkini açar ve açmadıklarının adlarını bildirir.

Açılan dosya, malzemeler ve kesitler dahil mevcut modelin yerini alır. Önceki modeliniz kaybolmaz: <kbd>Ctrl</kbd>+<kbd>Z</kbd> onu geri getirir ve model [Son modeller](#recent-structures) listesinde de saklanır. EduBeam okuyamadığı bir dosyayı bir mesajla reddeder ve modeliniz olduğu gibi kalır.

## Bağlantıyla paylaşma {#share-a-link}

Üst araç çubuğunda veya ☰ menüsünde bulunan **Modeli paylaş**, *Modeli bağlantıyla paylaş* penceresini açar:

![Modeli bağlantıyla paylaş penceresi](/screenshots/tr/c1-share.webp){.shot-lg}

- **Kopyala** düğmesine veya alanın herhangi bir yerine tıkladığınızda bağlantı kopyalanır.
- **Bağlantıyı aç**, bağlantıyı yeni bir sekmede açar; böylece alıcının ne göreceğini görürsünüz.
- **Sistem penceresiyle paylaş**, tarayıcı destekliyorsa bağlantıyı cihazınızın paylaşım menüsüne iletir.
- **Daha kısa bağlantı** (varsayılan olarak açık), aynı modeli yaklaşık yarı uzunlukta yazar. EduBeam'in 1.3.2'den (Kasım 2026) eski sürümleri bu bağlantıyı ancak güncellendikten sonra okuyabilir; bu yüzden bağlantının her yerde hemen açılması gerekiyorsa bu seçeneği kapatın.
- **Gördüğümü göster** (varsayılan olarak kapalı), bağlantının alıcının kendi görünüm seçenekleriyle değil, sizin açık tuttuğunuz diyagramlar, yükler ve etiketlerle açılmasını sağlar.

Bağlantı `https://run.edubeam.app/?model=…` biçimindedir ve modelin tamamını kodlanmış olarak içerir. Bağlantıyı açan herkes düzenleyebileceği kendi kopyasını alır; yapılan değişiklikler size geri **aktarılmaz**, bu yüzden model değiştiğinde yeni bir bağlantı gönderin. Çok büyük modeller çok uzun bağlantılar oluşturur; bu durumda proje dosyasını paylaşın.

Biri bir bağlantıyı açtığında kendi önceki modeli Son modeller listesine taşınır ve bir mesaj, onu nerede bulacağını söyler. Bağlantıların süresi dolmaz: geçen yılın ders notlarındaki bir bağlantı bugün de aynı modeli açar.

## Görüntüleyici gömme {#embed-a-read-only-viewer}

Modeli **görüntüleyici modunda** açmak için paylaşım bağlantısına `&viewer=1` ekleyin: üst araç çubuğu, alt panel, geri al ve yinele, ızgara ve birim göstergeleri ile artı imleci gizlenir; geriye çizim, sığdırma ve ortalama düğmeleri ile görünüm seçenekleri kalır. Karşılama penceresi ve sürüm notları da açılmaz. Ders notlarına, bir ders sayfasına veya bir slayta canlı, yakınlaştırılabilir bir model gömmek için bu URL'yi bir `<iframe>` içine koyun:

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![Görüntüleyici modunda üç mafsallı çerçeve](/screenshots/tr/viewer-mode.webp){.shot-lg}

Görüntüleyici modu incelemek içindir, ancak kilitli değildir: ziyaretçiler yine de düğümleri sürükleyebilir ve diyagramlar arasında geçiş yapabilir. Tek başına açılan bir görüntüleyici bağlantısı, her bağlantı gibi ziyaretçinin kendi modelinin yerini alır; ziyaretçinin modeli Son modeller listesinde bekler. Başka bir sitedeki bir sayfaya gömüldüğünde güncel tarayıcıların çoğu çerçeveye ayrı bir bellek ayırır; böylece ziyaretçinin kendi modeli etkilenmez. Ancak her tarayıcı bunu yapmaz.

Uygulamaya hiç gerek duymayan bir şekil için, örneğin bir sayfadaki, slayttaki veya föydeki statik bir diyagram için, [`@edubeam/plot` çizim kütüphanesi](/tr/plot) yapıları ve diyagramlarını koddan çizer. Bu sitedeki canlı şekiller de onunla çizilmiştir.

## URL parametreleri {#url-parameters}

| Parametre | Etkisi |
| --- | --- |
| `model=<veri>` | Kodlanmış modeli yükler ve ekrana sığdırır. Bu parametreyi **Modeli paylaş** yazar. |
| `viewer=1` | [Görüntüleyici modu](#embed-a-read-only-viewer). |
| `show=<harfler>` | Uygulamayı yalnızca bu katmanlar açık olacak şekilde açar; her katman bir harfle gösterilir: `N` normal kuvvet, `V` kesme kuvveti, `M` eğilme momenti, `U` deforme şekil, `R` mesnet tepkileri, `L` yükler, `S` mesnetler, `n` düğüm etiketleri, `e` eleman etiketleri. `show=MRLS` eğilme momentini, mesnet tepkilerini, yükleri ve mesnetleri gösterir. Bu parametreyi **Gördüğümü göster** yazar. |
| `lang=<kod>` | Arayüz dilini değiştirir: `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (Çince), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Örnek galerisini hemen açar. |

Parametreler `&` ile birleştirilir: `?lang=de&viewer=1&model=…` gibi. EduBeam parametreleri okuduktan sonra adres çubuğundan kaldırır. `lang` ve `show` değerleri, ziyaretçi bunları uygulamada kendisi seçmiş gibi onun ayarlarına kaydedilir.

## Görüntüyü dışa aktarma {#export-an-image}

**☰ → Görüntüyü dışa aktar** veya <kbd>Ctrl</kbd>+<kbd>P</kbd>, görüntü dışa aktarma penceresini açar. EduBeam çizimi seçtiğiniz boyuta göre yeniden düzenler; böylece çizgiler ve etiketler gerçek kalınlıklarını korur.

![Görüntüyü dışa aktar: katmanları, kadrajı ve boyutu seçin, ardından indirin veya kopyalayın](/screenshots/tr/export-image.webp)

::div{.steps}

### Katmanları seçin {#choose-the-layers}

Üstteki göstergeler neyin çizileceğini seçer: deforme şekil, N, V, M ve mesnet tepkileri, ardından mesnetler, yükler, düğüm etiketleri ve eleman etiketleri. Başlangıçta görüntüleyicinin görünüm seçenekleriyle aynıdırlar; burada yaptığınız değişiklikler görüntüleyiciyi etkilemez.

### Kadrajı belirleyin {#frame-the-drawing}

Bir en-boy oranı (16:9, 4:3, 3:2 veya 1:1), **Tümünü sığdır** ya da çizimin üzerinde bir dikdörtgen sürüklemek için **Pencere…** seçin. Önizlemenin kenarlarını da sürükleyebilirsiniz.

### Boyutu ayarlayın {#set-the-size}

Piksel cinsinden genişlik ve yükseklik ya da kâğıt üzerinde ölçekli bir çizim için 1 : 50 gibi bir **Ölçek** girin (96 DPI'da). **Diyagram yüksekliği** sonuç diyagramlarının boyutunu belirler; **Saydam arka plan** beyaz zemini çıkarır. Diyagramlar veya etiketler sığmazsa pencere bunu söyler ve diyagramları küçültmeyi ya da tuvali büyütmeyi önerir.

### Kaydedin {#save-it}

**PNG indir**, **SVG indir** veya tarayıcı izin veriyorsa **Panoya kopyala** düğmesine basın. Dosyalar boyutlarına göre adlandırılır, örneğin `edubeam-512x512.svg`. Yüksek çözünürlüklü bir ekranda PNG, uygulamadaki kadar keskin olsun diye, ekranın piksel yoğunluğu oranında belirlediğiniz genişlik ve yükseklikten daha fazla piksel içerir; piksel cinsinden boyutu düğmelerin yanında gösterilir.

::

SVG her boyutta keskin kalır ve Word'de, Inkscape'te ve Overleaf üzerindeki LaTeX'te çalışır; bu yüzden raporlar ve tezler için en iyi seçimdir. Aynı boyut yapıyı her zaman aynı şekilde kadrajlar; böylece art arda dışa aktarılan N, V ve M yan yana hizalanır.

Bu tür şekilleri koddan üretmek isterseniz (örneğin bir föydeki her soru için bir şekil), `@edubeam/plot` kütüphanesi aynı programlarda açılan [bağımsız bir SVG dosyası](/tr/plot/functions#a-standalone-svg-file) yazar.

## Sonuçları dışa aktarma {#export-the-results}

**Sonuçlar** sekmesindeki **CSV olarak dışa aktar**, mesnet tepkileri dahil iki sonuç tablosunu da indirir; **Kopyala** ise bunları elektronik tabloda kullanmak üzere panoya koyar. Bkz. [CSV olarak dışa aktarma ve kopyalama](/tr/essentials/results#export-csv-and-copy).

## Son modeller {#recent-structures}

**☰ → Son modeller**, temizlenen ya da yerine bir bağlantı, dosya, örnek model, *İlk kirişinizi çizin* görevi veya başka bir geri yükleme açılan son 10 modeli saklar. Her birinde bir küçük resim, modelin neyle değiştirildiği ve düğüm ile eleman sayısı görünür. **Geri yükle** bir modeli geri getirir: o sırada açık olan model de bu kez listeye girer ve <kbd>Ctrl</kbd>+<kbd>Z</kbd> geri yüklemeyi geri alır. **Kaldır** bir kaydı siler.

![Son modeller](/screenshots/tr/recent.webp){.shot-lg}

Liste yalnızca bu tarayıcıda saklanır.

## Örnekler {#examples}

**☰ → Örnekler**, hazır ders modellerinden oluşan bir galeri açar. Açtığınız örnek mevcut modelinizin yerini alır; <kbd>Ctrl</kbd>+<kbd>Z</kbd> kendi modelinizi geri getirir. Aynı modelleri alıştırmalarıyla birlikte bu kılavuzun [Örnekler](/tr/examples/) sayfasında bulabilirsiniz.

![Örnek galerisi](/screenshots/tr/examples.webp){.shot-lg}

## Otomatik kaydetme {#automatic-persistence}

Modeliniz ve ayarlarınız her değişiklikten sonra tarayıcı belleğine kaydedilir ve tarayıcıyı kapatsanız bile geri döndüğünüzde geri yüklenir. Bu bir kolaylıktır, yedek değildir: tek bir cihazdaki tek bir tarayıcı profiline aittir, gizli pencere kapanınca silinir, site verilerini temizlerseniz de kaybolur. Önemli çalışmalarınızı proje dosyası olarak kaydedin. Saklanan her şey [Tarayıcınızda neler saklanır](/tr/essentials/units-settings#what-is-stored-in-your-browser) bölümünde listelenir.

## Proje dosyası biçimi {#project-file-format}

`project.json` sade, okunabilir bir JSON dosyasıdır. Aşağıda, kütüphanelerden alınan çelik ve IPE 200 ile kurulmuş [Hızlı başlangıç](/tr/guide/quick-start) kirişi görülüyor:

```json [project.json]
{
  "edubeam": true,
  "version": "1.3.4",
  "domain": {
    "materials": [
      {
        "label": "Steel (S235)",
        "d": 7850,
        "e": 210000000000,
        "g": 81000000000,
        "alpha": 0.000012
      }
    ],
    "crossSections": [
      {
        "label": "IPE 200 (approx)",
        "a": 0.002848,
        "iy": 0.00001943,
        "h": 0.2,
        "k": 0.3932584269662922
      }
    ],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [
      {
        "label": "1",
        "nodes": ["1", "2"],
        "mat": "Steel (S235)",
        "cs": "IPE 200 (approx)",
        "hinges": [false, false]
      }
    ],
    "loadCases": [
      {
        "label": "DefaultLC",
        "nodalLoads": [],
        "elementLoads": [
          { "type": "udl", "target": "1", "lcs": true, "values": [0, 12000] }
        ],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Uygulama hangi birimleri gösterirse göstersin, bütün değerler **SI birimlerindedir** (m, N, Pa, rad). Koordinatlar $y = 0$ olmak üzere `[x, y, z]` biçimindedir ve $z$ aşağı doğrudur. Mesnetler ve yük bileşenleri serbestlik derecesi numaralarını kullanır: `0 = Dx`, `2 = Dz`, `4 = Ry`.

| Eleman yükü `type` | Değerler |
| --- | --- |
| `udl` | `values: [fx, fz]`, N/m cinsinden |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]`, N/m cinsinden |
| `concentrated` | `values: [Fx, Fz, My, a]`; N, N·m ve (başlangıç düğümünden uzaklık) m cinsinden |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]`, K cinsinden; sıcaklık farkı ΔTb − ΔTt'dir |

`lcs: true` ya da hiç `lcs` olmaması, eleman yükünü elemanın yerel eksenlerine; `false` ise global eksenlere yerleştirir. Diğer kayıtlar:

- **Düğüm yükleri**: `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`; döndürülmüş bir mesnedin eksenlerindeki yük için ayrıca `"lcs": true`.
- **Öngörülen yer değiştirmeler**: `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; yazmadığınız bir bileşen 0 kabul edilir.
- Uygulamanın yazdığı dosyalar ayrıca bir `date`, bir `commit`, döndürülmüş mesnetlerin eksenlerini (düğümde `lcs`) ve çizilmiş kesit şekillerini (`shape`) taşır.

Biçim basit olduğu için modelleri bir betik veya elektronik tabloyla yazabilir ve **Proje aç** ile açabilirsiniz. Modelleri tamamen kodla kurmak ve çözmek için uygulamanın arkasındaki çözücüyü, [`@edubeam/fem` çözücü kütüphanesini](/tr/solver) kullanın.
