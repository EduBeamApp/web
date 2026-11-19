---
description: "EduBeam'de düğüm ekleyip düzenleyin, ızgaraya yakalayın, elemanları bölün; mafsallı, kayıcı, ankastre, kayar ankastre mesnetleri, düşey ve eğik türlerini seçin."
source: site
---

# Düğümler ve mesnetler

Düğümler modelinizin noktalarıdır: elemanlar düğümleri birbirine bağlar, mesnetler ve düğüm yükleri de düğümlere tanımlanır. Düğümleri koordinatlarını yazarak veya tıklayarak yerleştirin, ardından mesnet olan düğümlere çiziminize uygun mesnedi atayın.

## Koordinatlar {#coordinates}

Her düğümün geçerli [uzunluk biriminde](/tr/essentials/units-settings#units) bir **X** ve bir **Z** koordinatı vardır. X ekseni sağa, **Z ekseni aşağı** doğrudur; bu yüzden zeminin üstündeki her noktanın Z koordinatı negatiftir: 4 m yüksekliğindeki bir kolon `Z = 0`'dan `Z = −4`'e uzanır.

::model-figure{caption="6 m genişliğinde ve 4 m yüksekliğinde bir portal çerçeve: A ve D, Z = 0'da; B ve C, Z = −4'te"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

Düşey eksenin yukarı doğru olmasını tercih ediyorsanız **Ayarlar** sekmesinde [y yukarı eksenlere](/tr/elements/conventions#y-up-axes) geçin. Yalnızca görünüm değişir; model ve dosyaları aynı kalır.

## Düğüm ekleme {#adding-nodes}

- **Yazarak.** *Düğümler* sekmesi → **Düğüm ekle** (**+** simgeli düğme) ya da tuvale sağ tıklayın → *Düğüm ekle*. X ve Z'yi, isterseniz mesnetleri ve mesnet açısını da girin.
- **Tıklayarak.** *Düğümler* sekmesi → **Düğüm ekle** (imleç simgeli düğme) ya da tuval menüsünde *Düğüm ekle* seçeneğini seçerken <kbd>Ctrl</kbd> tuşunu basılı tutun. Her tıklama bir düğüm yerleştirir; bitirmek için <kbd>Esc</kbd> tuşuna, **İptal** düğmesine veya aynı düğmeye yeniden basın.
- **Eleman çizerken.** [Elemanları fareyle çizerken](/tr/essentials/elements#adding-elements) tuvalin boş bir yerine tıkladığınızda orada yeni bir düğüm oluşur.
- **Kopyalayarak.** Düğümleri (ve elemanları) seçin, <kbd>Ctrl</kbd>+<kbd>C</kbd> ve <kbd>Ctrl</kbd>+<kbd>V</kbd> tuşlarına basın; ardından kopyanın gideceği yere tıklayın ya da şeride bir Δx, Δz kaydırması yazıp **Yapıştır** düğmesine basın.

::div{.shots}

![Düğüm ekle penceresi](/screenshots/tr/qs-node.webp)

![Fare modunda üstteki şerit, yerleştirdiğiniz her düğümün mesnetlerini ve açısını belirler](/screenshots/tr/nodes-add-banner.webp)

::

Yeni düğümler sıradaki boş numarayı alır: `1`, `2`, `3`, …. Düğümlerin adını tablonun *Düğüm* sütununda değiştirebilirsiniz; örneğin `A`, `B`, `C` yapabilirsiniz.

### Yakalama {#snapping}

**Izgaraya yakala** açıkken (<kbd>S</kbd> tuşu veya görüntüleyicinin sağ altındaki **S** göstergesi), yerleştirdiğiniz veya sürüklediğiniz düğümler ızgaraya oturur. Adım varsayılan olarak 0,1 m, ABD birimlerinde 0,5 ft'tir; bunu [Ayarlar → Görüntüleyici ayarları → Izgara](/tr/essentials/units-settings#viewer-settings) bölümünden değiştirebilirsiniz. Izgaraya denk gelmeyen bir konum için kesin koordinatları tabloya yazın.

### Mevcut bir elemanın üzerine düğüm yerleştirme {#placing-a-node-on-an-existing-element}

Fareyle düğüm eklerken bir elemanın üzerine (veya çok yakınına) tıklarsanız EduBeam ne yapmak istediğinizi sorar:

- **Yapıya bağla**, elemanı yeni düğümde birleşen iki parçaya böler: `1a` ve `1b`. Ara mesnet veya yük noktası eklemenin en hızlı yolu budur. Dış uçlardaki mafsallar yerinde kalır. Düzgün yayılı ve trapez yükler iki parçaya paylaştırılır. Tekil yüklerin ve sıcaklık yüklemelerinin tümü ise birinci parçaya, `1a`'ya geçer: *Yükler* tablosunda, yeni düğümün ötesinde kalan bir tekil yükü `1b`'ye taşıyın (konumu artık yeni düğümden ölçülür) ve `1b`'ye kendi sıcaklık yüklemesini verin.
- **Bağımsız düğüm yerleştir**, düğümü elemanın üzerine koyar ama elemana bağlamaz.

Her iki durumda da düğüm yerleştirme modu burada sona erer; daha fazla düğüm için imleç düğmesine yeniden tıklayın.

## Düğümleri düzenleme {#editing-nodes}

| Amaç | Yapılacak |
| --- | --- |
| Bir düğümü taşımak | Görüntüleyicide sürükleyin (dokunmatik ekranda basıp sürükleyin) ya da *Düğümler* tablosuna X ve Z'yi yazın. Bağlı elemanlar, yükleri ve ölçü çizgileri de onunla birlikte hareket eder. |
| Yeniden adlandırmak | *Düğüm* sütununa yeni bir etiket yazın. |
| Mesnetlerini değiştirmek | Düğüme tıklayın → **Düğüm mesnetleri** ya da *Tutulu serbestlik dereceleri* sütununu kullanın. Bkz. [Mesnetler](#supports). |
| Her şeyi tek seferde düzenlemek | *İşlemler* sütunundaki kalem simgesi **Düğümü düzenle** penceresini açar: koordinatlar, mesnetler ve mesnet açısı, mesnet sembolünün önizlemesiyle birlikte. |
| Silmek | Tablodaki × işaretine veya düğüm panelindeki **Sil** düğmesine tıklayın ya da düğümü seçip <kbd>Delete</kbd> tuşuna basın. Düğüme bağlı elemanlar, yükler ve ölçü çizgileri de silinir. |

Her değişikliği <kbd>Ctrl</kbd>+<kbd>Z</kbd> ile geri alabilirsiniz.

## Mesnetler {#supports}

Her düğüm üç şekilde hareket edebilir; bunlar düğümün **serbestlik dereceleridir**: x doğrultusunda `Dx`, z doğrultusunda `Dz` ve çizim düzleminde bir dönme olan `Ry`. Mesnet bunların bazılarını **tutar**.

Sekiz mesnet tipi, bu üç serbestlik derecesinin sekiz olası birleşimidir. Tabloyu satır satır okuyun: ortadaki sütunda düğüm serbestçe döner, sağdaki sütunda dönmesi de tutulmuştur.

| Tutulan ötelemeler | Serbestçe döner | Dönmesi de tutulu |
| --- | --- | --- |
| **İkisi de** (`Dx` ve `Dz`) | ![](/screenshots/tr/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Mafsallı mesnet** | ![](/screenshots/tr/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Ankastre** |
| **Yalnız düşey** (`Dz`): yatay kayar | ![](/screenshots/tr/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Kayıcı mesnet** | ![](/screenshots/tr/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Kayar ankastre** |
| **Yalnız yatay** (`Dx`): düşey kayar | ![](/screenshots/tr/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Düşey kayıcı mesnet** | ![](/screenshots/tr/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Düşey kayar ankastre** |
| **Hiçbiri**: iki yönde de kayar | ![](/screenshots/tr/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Serbest** (mesnet yok) | ![](/screenshots/tr/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Yalnız dönme tutulu** |

EduBeam tutulu her serbestlik derecesi için bir **mesnet tepkisi** hesaplar: `Dx` yatay bir $R_x$ kuvveti, `Dz` düşey bir $R_z$ kuvveti, `Ry` ise bir $M$ momenti verir. Yani mafsallı mesnette $R_x$ ve $R_z$, kayıcı mesnette yalnızca $R_z$, kayar ankastrede $R_z$ ve $M$, ankastre mesnette ise üçü birden oluşur.

### Mesnet tanımlama {#setting-a-support}

Sembolü seçin ya da serbestlik derecelerini tek tek işaretleyin; ikisi her zaman birbiriyle uyumludur. Her ikisini de üç yerde bulursunuz:

- düğüm panelinde (düğüme tıklayın) → **Düğüm mesnetleri**, aşağıdaki gibi **Düğüm yerel eksen açısı** ile birlikte;
- **Düğüm ekle** ve **Düğümü düzenle** pencerelerinde;
- *Düğümler* tablosunun *Tutulu serbestlik dereceleri* sütununda; burada sembol küçük bir menüdür, `Dx`, `Dz`, `Ry` ise onay kutularıdır.

![Düğüm panelindeki Düğüm mesnetleri: semboller, serbestlik derecesi onay kutuları ve mesnet açısı](/screenshots/tr/nodes-support-picker.webp){.shot-lg}

Bir sembolün adını görmek için imleci üzerine getirin.

### Kayıcı mesnet mi, kayar ankastre mi? {#roller-or-slider}

İkisi de bir ray üzerinde durur ve ray boyunca kayar. Fark dönmededir:

- **kayıcı mesnet**, ray üzerindeki bir mafsallı mesnettir: uç **serbestçe döner**, bu yüzden orada moment oluşmaz;
- **kayar ankastre**, ray üzerindeki bir ankastre mesnettir: uç **dönemez**, bu yüzden mesnet moment de karşılar.

10 kN/m yük altındaki aynı 6 m'lik kiriş; yalnızca sağdaki mesnet değişiyor. Deforme şekil ile eğilme momenti arasında geçiş yapın:

::div{.shots}

:::model-figure{caption="Mafsallı ve kayıcı mesnet: sağ uç serbestçe döner; orada M = 0, her mesnette 30 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Mafsallı mesnet ve kayar ankastre: sağ uç yatay kalır; orada M = −45 kNm, kayar ankastrede 37,5 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

Birincisi basit mesnetli bir kiriştir (açıklık ortasında $M_{max} = qL^2/8 = 45\ \text{kNm}$). Düşey yük altında kayar ankastre tıpkı bir ankastre uç gibi davranır; bu yüzden ikincisi bir ucu ankastre, diğer ucu kayıcı mesnetli bir kiriştir ($R_B = 5qL/8 = 37{,}5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Ucun yatay tutulması kirişin rijitliğini de artırır: en büyük sehim 9,617 mm'den 4 mm'ye düşer. Kayar ankastre ile ankastre uç arasındaki fark ancak ray doğrultusunda bir kuvvet etkidiğinde ortaya çıkar.

### Eğik mesnetler {#inclined-skewed-supports}

Eğimli bir yüzeydeki mesnet, düğümü döndürülmüş eksenler boyunca tutar. **Düğüm yerel eksen açısı** α'yı −180 ile 180 arasında derece cinsinden girin: düğüm panelinde *Düğüm mesnetleri* altında, Düğüm ekle ve Düğümü düzenle pencerelerinde ya da *Düğümler* tablosunun **α** alanında.

Düğümün eksenleri α kadar döner ve işaretli serbestlik dereceleri bu eksenler boyunca etkir. α, x eksenini z eksenine doğru, yani ekranda **saat yönünde** döndürür (y yukarı eksenlerde x'i y'ye doğru, saat yönünün tersine döndürür). Dolayısıyla sağa doğru 30° alçalan bir yüzeydeki kayıcı mesnet, α = 30° olan bir kayıcı mesnettir. Sembol eksenlerle birlikte döner ve mesnet tepkisi bu eksenler boyunca verilir.

::model-figure{caption="B'deki kayıcı mesnet α = 30° döndürülmüş: 34,64 kN'luk mesnet tepkisi eğime diktir ve kiriş N = +17,32 kN taşır"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

Yukarıdaki kirişin aynısı: 6 m açıklıklı, 10 kN/m yüklü; ancak kayıcı mesnedi artık 30° eğimli bir yüzeyde duruyor. B'deki mesnet tepkisinin düşey bileşeni yine $qL/2 = 30\ \text{kN}$'dur; dolayısıyla tepkinin kendisi $30/\cos 30° = 34{,}64\ \text{kN}$ olur ve yatay bileşeni $30 \tan 30° = 17{,}32\ \text{kN}$, B'yi sağa iter. A'daki mafsallı mesnet buna karşı koyar; bu yüzden kirişte çekme oluşur. Eğilme momenti değişmez.

Döndürülmüş bir düğümdeki [düğüm yükleri](/tr/essentials/loads#nodal-loads) global eksenlerde veya düğüm eksenlerinde verilebilir; [öngörülen yer değiştirme](/tr/essentials/loads#prescribed-displacements-support-settlements) ise her zaman mesnedin kendi eksenleri boyunca etkir.

### Kararlılık {#stability}

Düzlem bir yapı için en az **üç tutulu serbestlik derecesi** gerekir; bunlar da yapıyı gerçekten tutacak biçimde yerleşmiş olmalıdır. Mesnet eksik olduğu sürece görüntüleyicide mavi bir **Mesnet gerekli** göstergesi görünür. Mesnet sayısı yeterli olduğu hâlde mesnetler yapıyı tutamıyorsa (hepsi paralelse veya hepsi tek bir noktada kesişiyorsa) ya da mafsallar çubukların birbirine göre dönmesine izin veriyorsa, kırmızı bir mesaj sorunu belirtir ve kesikli bir çizgi yapının nasıl hareket ettiğini gösterir. Her mesaj [Sorun giderme](/tr/reference/troubleshooting#messages) sayfasında açıklanır.

## Düğüm yükleri ve mesnet çökmeleri {#nodal-loads-and-settlements}

Bir kuvvet veya moment için düğüme tıklayın → **Yük ekle**; bir mesnedi belirli bir miktar kadar hareket ettirmek (mesnet çökmesi) için düğüme tıklayın → **Yer değiştirme tanımla**. İkisi de [Düğüm yükleri](/tr/essentials/loads#nodal-loads) bölümünde anlatılır.

## Ölçü çizgileri {#dimension-lines}

Ölçü çizgileri çizimdeki uzunlukları gösterir. Analizi etkilemezler, ancak projeyle birlikte kaydedilir, paylaşım bağlantılarında taşınır ve [dışa aktarılan görüntülerde](/tr/essentials/import-export#export-an-image) görünürler.

| Amaç | Yapılacak |
| --- | --- |
| Ölçü çizgisi eklemek | Tuvale sağ tıklayın → **Ölçü ekle**, ardından iki uç noktaya tıklayın. Bir düğüme yakın nokta o düğüme yakalanır. |
| Bir elemanı ölçülendirmek | Elemana sağ tıklayın → **… elemanını ölçülendir**. |
| Düzenlemek veya ters çevirmek | Çizgiye tıklayın → koordinatlarını yazmak için **Düzenle**, etiketi diğer tarafa almak için **Ölçü çizgisini ters çevir**. |
| Taşımak | Çizgiyi veya bir uç noktasını sürükleyin. Düğüm üzerindeki bir uç düğüme bağlı kalır ve onunla birlikte hareket eder. |
