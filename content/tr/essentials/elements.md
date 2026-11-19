---
description: "EduBeam'de kiriş elemanı çizin, uç mafsallarıyla mafsallı birleşim ve kafes çubuğu modelleyin; malzeme ve kesitleri kütüphaneden alın veya çokgenle tanımlayın."
source: site
---

# Elemanlar, malzemeler ve kesitler

[EduBeam]{.edubeam}'deki her eleman, iki düğüm arasında uzanan, bir malzemesi ve bir kesiti olan bir kiriştir. Elemanları düğümler arasına çizin, yapıda mafsal bulunan yerlerde eleman uçlarını mafsallı yapın, malzemeleri ve kesitleri kütüphanelerden seçin ya da kendiniz tanımlayın.

## Kiriş elemanı {#the-beam-element}

Tek bir eleman türü vardır: x–z düzleminde, her ucunda üç serbestlik derecesi (`Dx`, `Dz`, `Ry`) bulunan **2B Timoshenko kirişi**. Eleman normal kuvvet, kesme kuvveti ve eğilme momenti taşır ve [kayma şekil değiştirmesini](#shear-deformation) hesaba katar. Kafes çubuğu da aynı elemandır, yalnızca [iki ucu mafsallıdır](#end-hinges). Formülasyon [teori kılavuzunda](/tr/elements/beam) yer alır.

Doğrusal modelde eleman boyunca bulunan sonuçlar kesindir; bu yüzden **her çubuk için tek eleman yeterlidir**. Bir çubuğun ara noktasına yalnızca mesnet, mafsal veya kesit değişimi gereken yerde ya da yer değiştirmesini okumak istediğiniz noktada düğüm ekleyin. Tekil yük için düğüm gerekmez: [tekil yük](/tr/essentials/loads#concentrated-load) elemanın herhangi bir noktasına etkiyebilir.

## Eleman ekleme {#adding-elements}

Her elemanın bir malzemesi ve bir kesiti olmalıdır; bu yüzden önce bunları ekleyin (bkz. [Malzemeler](#materials) ve [Kesitler](#cross-sections)). Bunlar tanımlanana kadar görüntüleyici, bir **Yeni ekle** düğmesiyle birlikte *Tanımlı malzeme yok.* veya *Tanımlı kesit yok.* uyarısını gösterir.

- **Düğüm seçerek.** *Elemanlar* sekmesi → **Eleman ekle** (**+** simgeli düğme) ya da tuvale sağ tıklayın → *Eleman ekle*. **Başlangıç düğümü** ve **Bitiş düğümü** alanlarında düğümleri seçin, gerekiyorsa altlarındaki **Mafsal** kutusunu işaretleyin, **Malzeme** ve **Kesit** alanlarını da doldurun. Bunun için en az iki düğüm gerekir.
- **Tıklayarak.** *Elemanlar* sekmesi → **Eleman ekle** (imleç simgeli düğme) ya da tuval menüsünde *Eleman ekle* seçeneğini seçerken <kbd>Ctrl</kbd> tuşunu basılı tutun. Bir düğüme (veya tuvalin boş bir yerine; orada yeni bir düğüm oluşur), ardından sonrakine tıklayın. Tıklamaya devam ederek birbirine bağlı bir eleman zinciri çizebilirsiniz; bitirmek için <kbd>Esc</kbd> tuşuna veya **İptal** düğmesine basın. Üstteki şerit, çizdiğiniz her elemanın **Başlangıç mafsalı** ve **Bitiş mafsalı** ayarını belirler. Elemanlar modeldeki ilk malzemeyi ve ilk kesiti alır.

![Eleman ekle penceresi](/screenshots/tr/qs-element.webp){.shot-md}

## Eleman yönü {#element-direction}

Her elemanın kendi **yerel eksenleri** vardır. Yerel x ekseni **başlangıç düğümünden** **bitiş düğümüne** doğrudur; yerel z ekseni ise yerel x'in ekranda saat yönünde 90° döndürülmüş hâlidir. Soldan sağa çizilen bir elemanda yerel eksenler global eksenlerle çakışır. Her eleman boyunca çizilen **kesikli çizgi**, elemanın yerel +z tarafını, yani “alt lifleri” gösterir.

![A → B → C → D sırasıyla çizilmiş bir portal çerçeve: üç elemanın kesikli çizgileri de çerçevenin içinde kalır](/screenshots/tr/p2b-element-direction.webp){.shot-md}

Bu çerçevede 1 numaralı eleman A'dan B'ye yukarı doğru gider; bu yüzden yerel z ekseni ve kesikli çizgisi sağa bakar. 3 numaralı eleman C'den D'ye aşağı doğru gider; bu yüzden kesikli çizgisi soldadır. Bu sırayla çizildiğinde bir portal çerçevenin bütün kesikli çizgileri içeride kalır.

Yön şunlar için önemlidir:

- yerel eksenlerde verilen yükler (**LCS** işaretli), bkz. [Eleman yükleri](/tr/essentials/loads#element-loads);
- tekil yükte **Yükün başlangıç düğümüne uzaklığı**;
- sonuçlarda [çubuk uç kuvvetlerinin](/tr/elements/conventions#end-forces-element-results-table) sırası: başlangıç düğümünde `X12, Z12, M12`, bitiş düğümünde `X21, Z21, M21`;
- [diyagram ayarlarında](/tr/essentials/units-settings#viewer-settings) hangi tarafın “kesikli taraf” olduğu.

Bir elemanın yönünü ters çevirmek için **Düğüm sırasını ters çevir** düğmesine basın (*Elemanlar* tablosunda iki düğüm arasındaki oklar).

## Uç mafsalları {#end-hinges}

Uç mafsalı, elemanın bir ucundaki eğilme momentini serbest bırakır: orada moment sıfırdır ve uç, düğümden bağımsız olarak dönebilir.

- **Tek mafsal**, bir kirişin veya çerçevenin içine bir mafsal koyar.
- **İki mafsal**, yalnızca normal kuvvet taşıyan bir **kafes çubuğu** oluşturur.

Mafsalları şu yerlerden birinde işaretleyin:

- *Elemanlar* tablosunun **Uç mafsalları** sütununda, her uç için bir onay kutusu;
- **Eleman ekle** penceresindeki veya elemanın paneli → **Elemanı düzenle** penceresindeki **Mafsal** kutularında;
- fareyle çizerken üstteki şeritte **Başlangıç mafsalı** ve **Bitiş mafsalı**.

![Üç mafsallı bir çerçevenin Elemanlar tablosu: 2 numaralı elemanın bitiş ucunda, C düğümünde bir mafsal var](/screenshots/tr/elements-table.webp)

### Tek mafsal: yapının içinde bir mafsal {#one-hinge-a-pin-inside-the-structure}

Aynı sürekli kiriş: 10 kN/m yük altında 5 m'lik iki açıklık. Sağdaki şekilde 1 numaralı elemanın B ucunda bir uç mafsalı vardır: mesnet üzerindeki moment sıfıra düşer ve her açıklık kendi yükünü basit mesnetli bir kiriş gibi taşır.

::div{.shots}

:::model-figure{caption="Sürekli kiriş: B üzerinde M = −31,25 kNm"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

:::model-figure{caption="B'de mafsallı: B üzerinde M = 0, her açıklıkta 31,25 kNm"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [{ nodes: [A, B], hinges: [false, true] }, [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

::

El hesabıyla: sürekli kirişte $M_B = -qL^2/8 = -31{,}25\ \text{kNm}$ ve her açıklıkta en büyük $9qL^2/128 = 17{,}58\ \text{kNm}$; mafsallı kirişte $M_B = 0$ ve her açıklık ortasında $M_{max} = qL^2/8 = 31{,}25\ \text{kNm}$. Mafsal mesnet momentini ortadan kaldırır, ama açıklık momentlerini neredeyse iki katına çıkarır. Ara mafsallı bir kirişi elle çözmek ve cevaplarınızı yazdıkça kontrol ettirmek için [Alıştırmalar](/tr/practice?p=G2048) sayfasındaki G2048 kodlu soruyu deneyin.

### İki mafsal: kafes çubuğu {#both-hinges-a-truss-bar}

İki çubuktan oluşan bir duvar konsolu: her iki çubuğun da iki ucu mafsallı, B'de 20 kN'luk bir yük var. Çubuklar yalnızca normal kuvvet taşır ve moment diyagramı boştur.

::model-figure{caption="AB çekme çubuğu: N = +26,67 kN (çekme); CB basınç çubuğu: N = −33,33 kN (basınç)"}
---
nodes: { A: [0, 0], B: [4, 0], C: [0, 3] }
supports: { A: pin, C: pin }
members: [{ nodes: [A, B], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: B, fz: 20 }
results: [N, M]
show: [nodeLabels]
---
::

El hesabıyla: basınç çubuğu 5 m uzunluğundadır ve 3 m yükselir; dolayısıyla $N_{CB} = -20 \cdot 5/3 = -33{,}33\ \text{kN}$ olur. Çekme çubuğu bu kuvvetin yatay bileşenini dengeler: $N_{AB} = 33{,}33 \cdot 4/5 = 26{,}67\ \text{kN}$. [Düzlem kafes sistem](/tr/tutorials/truss) eğitimi bütün bir kafes sistemi bu yolla kurar; [Alıştırmalar](/tr/practice?p=T2048) sayfasında da elle çözülecek kafes sistemler bulunur.

### Düğümü değil, elemanı mafsallayın {#hinge-the-element-not-the-node}

Mafsal, tek bir elemanın tek bir ucuna aittir: o ucun kendi başına dönmesine izin verir, düğümdeki diğer bütün elemanlar ise düğüme rijit olarak bağlı kalır. Bu yüzden iki çubuğun birleştiği yerde tek mafsal bir mafsallı birleşim oluşturur; birkaç çubuğun birleştiği yerde biri dışında hepsini mafsallayın. Bütün çubukların kafes çubuğu olduğu bir kafes düğümünde hepsi mafsallıdır.

Bağlı bütün elemanların mafsallı olduğu bir düğümün dönme rijitliği yoktur. EduBeam böyle bir düğümü kabul eder ve dönmesini 0 olarak verir. Mafsallar yapıyı mekanizmaya dönüştürürse EduBeam onları daire içine alır ve yapının nasıl hareket ettiğini gösterir; bkz. [Sorun giderme](/tr/reference/troubleshooting#messages).

## Düzenleme ve silme {#editing-and-deleting}

| Amaç | Yapılacak |
| --- | --- |
| Düğümleri, mafsalları, malzemeyi veya kesiti değiştirmek | Elemana tıklayın → **Elemanı düzenle** ya da elemanı *Elemanlar* tablosunda düzenleyin. |
| Yönünü ters çevirmek | *Elemanlar* tablosunda **Düğüm sırasını ters çevir**. |
| Yeniden adlandırmak | *Eleman* sütununa yeni bir etiket yazın. |
| Rijitlik matrisini görmek | Elemana tıklayın → **Rijitlik matrisi** ya da *İşlemler* sütunundaki matris düğmesi. Bir pencere, elemanın global eksenlerdeki 6 × 6 matrisini gösterir; ekranda hangi birimler seçili olursa olsun SI birimlerinde (N ve m) ve uç mafsalları statik kondensasyonla zaten elenmiş olarak. Elle yaptığınız birleştirmeyi kontrol etmek için kullanışlıdır. |
| Silmek | Elemana tıklayıp **Sil** düğmesini seçin, tablodaki × işaretine tıklayın ya da elemanı seçip <kbd>Delete</kbd> tuşuna basın. Yükleri de onunla birlikte silinir. |

![Bir elemanın paneli](/screenshots/tr/ui-element-menu.webp){.shot-xs}

## Malzemeler {#materials}

*Malzemeler* sekmesi → **Malzeme ekle** ya da hazır bir malzeme için **Malzeme kütüphanesi**. Birçok eleman aynı malzemeyi paylaşabilir; malzemeyi değiştirdiğinizde hepsi güncellenir.

| Alan | Birim | İşlevi |
| --- | --- | --- |
| Elastisite modülü $E$ | MPa | Eksenel ve eğilme rijitliği, $EA$ ve $EI_y$. Çelik 210 000 MPa, beton yaklaşık 30 000 MPa, ahşap yaklaşık 11 000 MPa. |
| Kayma modülü $G$ | MPa | Kayma rijitliği $kGA$. Kesitin $k$ değeri aşırı büyük değilse modele [kayma şekil değiştirmesini](#shear-deformation) katar: yer değiştirmeler büyür, hiperstatik bir yapıda iç kuvvetler de değişir. $G = E/(2(1+\nu))$: çelikte yaklaşık 81 000 MPa. |
| Yoğunluk $\rho$ | kg/m³ | Malzemeyle birlikte saklanır, ama kullanılmaz: EduBeam'de zati ağırlık yüklemesi yoktur. |
| Isıl genleşme katsayısı $\alpha$ | 1/K | [Sıcaklık yüklemelerinde](/tr/essentials/loads#temperature-load) kullanılır. Çelik: $12 \times 10^{-6}$ 1/K. |

Tablodaki birimler SI varsayılanlarıdır; uygulamada [ayarlarınıza](/tr/essentials/units-settings#units) göre değişir. ABD birimlerinde E ve G ksi, yoğunluk lb/ft³, α ise 1/°F cinsindendir.

Yeni bir malzeme $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2{,}4$, yani $\nu = 0{,}2$), $\rho$ = 1000 kg/m³ ve $\alpha = 12 \times 10^{-6}$ 1/K değerleriyle başlar; ABD birimlerinde ise ASTM A992 çeliğidir. Çelik için $G$'yi 81 000 MPa yapın ya da kütüphaneden bir çelik seçin.

![Malzeme ekle penceresi](/screenshots/tr/qs-material.webp){.shot-md}

**Malzeme kütüphanesi** (Malzeme ekle penceresinde *Veya kütüphaneden seçin* ile de açılır) önce metrik (EN) malzemeleri listeler; uzunluklarınız fit veya inç cinsindeyse önce ABD malzemelerini (ASTM çelikleri, ACI betonları) gösterir. Bir satırdaki **+**, o malzemeyi kendi adıyla ekler:

| Grup | Malzemeler |
| --- | --- |
| Metaller | S235, S275, S355 çelikleri; 304, 316 paslanmaz çelikleri; dökme demir; 6061-T6, 7075-T6, 5083 alüminyum; bakır, pirinç, bronz; Grade 2 ve Ti-6Al-4V titanyum; ABD çelikleri ASTM A992, A36, A572 Gr. 50 ve HSS A500 Gr. C |
| Beton | C25/30, C30/37, C40/50, hafif beton; ABD $f'_c$ = 4 ksi ve 5 ksi |
| Ahşap | C24, GL24h, GL32h |
| Diğer | Cam, GFRP, CFRP, HDPE, PVC, PMMA, polikarbonat |

Elemanların hâlâ kullandığı bir malzeme silinemez: önce bu elemanlara başka bir malzeme atayın.

## Kesitler {#cross-sections}

*Kesitler* sekmesi → **Kesit ekle**, **Kesit kütüphanesi** ya da kendi şeklinizi çizmek için **Çokgen kesit**. Malzemelerde olduğu gibi, bir kesiti de birçok eleman kullanabilir.

| Alan | Birim | İşlevi |
| --- | --- | --- |
| Alan $A$ | m² | Eksenel rijitlik $EA$ ve kayma alanı $kA$. |
| Atalet momenti $I_y$ | m⁴ | Çizim düzlemine dik eksene göre eğilme rijitliği $EI_y$. |
| Yükseklik $h$ | m | Yalnızca sıcaklık yüklemelerinde kullanılır: eğrilik $\alpha\,(\Delta T_b - \Delta T_t)/h$'dir. |
| Kayma düzeltme katsayısı $k$ | – | Etkili kayma alanı $kA$'dır, dolayısıyla kayma rijitliği $kGA$ olur. Dikdörtgende yaklaşık 0,83, I kesitte $A_{web}/A$. |

Yeni bir kesit $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m ve $k$ = 1 değerleriyle başlar (ABD birimlerinde $k$ = 1 olan bir W12×26). Bunları kendi kesitinizin değerleriyle değiştirin ya da kütüphaneden bir kesit seçin.

::callout{type="tip" title="Kayma şekil değiştirmesini ihmal eden bir ders kitabıyla aynı sonucu almak"}
El hesaplarının çoğu, kayma şekil değiştirmesi olmayan Euler–Bernoulli kirişlerini kullanır. Aynı sonuçları almak için $k$'ye `1e10` gibi çok büyük bir değer verin; uygulamadaki örnekler ve bu sitedeki şekiller `1e32` kullanır. Yeni bir kesit ($k = 1$), kütüphane ve çokgen düzenleyici kayma şekil değiştirmesini hesaba katar; bunun sonuçları ne kadar değiştirdiği [aşağıda](#shear-deformation) anlatılıyor.
::

**Kesit kütüphanesi** şunlar için yaklaşık değerler verir:

| Grup | Kesitler | $k$ |
| --- | --- | --- |
| Dolu kesitler | Dikdörtgenler, kareler, daireler | 0,833 (dikdörtgen), 0,9 (daire) |
| I profiller | IPE 100, IPE 200, HEA 100, HEA 200; AISC W profilleri W8×31'den W36×150'ye | $h\,t_w/A$, gövde |
| Dikdörtgen borular | RHS 100×50×3, 150×100×5; AISC HSS | $2ht/A$, iki gövde |
| Dairesel borular | CHS Ø60×3, Ø114×5; AISC dairesel HSS | 0,5 |

Kütüphane değerlerine güvenmeden önce onları bir profil tablosuyla karşılaştırın.

![Kesit kütüphanesi](/screenshots/tr/sections-library.webp){.shot-lg}

Elle hızlı bir kontrol için: $b \times h$ boyutlarındaki dikdörtgende $A = bh$ ve $I_y = bh^3/12$; $d$ çaplı dolu dairede $A = \pi d^2/4$ ve $I_y = \pi d^4/64$.

### Kayma şekil değiştirmesi: G ve k ne zaman önemlidir {#shear-deformation}

Kayma rijitliği $kGA$, elemana [kayma parametresi](/tr/elements/beam#timoshenko-or-euler-bernoulli) $\Phi = 12EI_y/(kGAL^2)$ üzerinden girer. $k$ çok büyükse $\Phi = 0$ olur ve eleman bir Euler–Bernoulli kirişi gibi davranır; $G$'nin hiçbir etkisi kalmaz. Gerçekçi bir $k$ değerinde kayma şekil değiştirmesi yer değiştirmeleri her zaman artırır. İzostatik bir yapıda iç kuvvetler aynı kalır; hiperstatik bir yapıda ise onlar da değişir, çünkü hiperstatik bilinmeyenler rijitliğe bağlıdır.

Etkinin büyüklüğü çubuğun ne kadar tıknaz olduğuna bağlıdır. Kütüphaneden alınmış S235 çeliğinden ($G$ = 81 000 MPa) bir IPE 200 ($k = h\,t_w/A = 0{,}393$), 10 kN/m yük altında, aynı kirişin $k$ = `1e32` ile hesaplanmış hâliyle karşılaştırıldığında:

| Kiriş | Kayma şekil değiştirmesiyle | Euler–Bernoulli |
| --- | --- | --- |
| Basit mesnetli, $L$ = 2 m ($L/h$ = 10): açıklık ortası sehimi | 0,566 mm | 0,511 mm |
| Ankastre–kayıcı mesnetli, $L$ = 2 m: ankastre uçtaki moment | −4,84 kNm | −5,00 kNm |
| Basit mesnetli, $L$ = 6 m ($L/h$ = 30): açıklık ortası sehimi | 41,85 mm | 41,36 mm |

El hesabıyla: açıklık ortası sehiminin kaymadan gelen kısmı $qL^2/(8kGA)$'dır; kısa kirişte bu 0,055 mm eder, yani eğilmeden gelen $5qL^4/(384EI_y)$ kısmına %11 ekler. Ankastre–kayıcı mesnetli kirişte ankastrelik momenti $qL^2/8$'den $(qL^2/8)/(1 + \Phi/4)$'e düşer. $L/h$ = 30'da iki etki de yaklaşık %1 veya daha azdır; narin çerçevelerde $k$ ne olursa olsun sonuçların ders kitabı cevaplarıyla örtüşmesinin nedeni budur.

### Çokgen kesitler {#polygonal-sections}

*Kesitler* sekmesi → **Çokgen kesit** ya da Kesit ekle penceresindeki *Veya çokgen bir kesit tanımlayın*, kesit özelliklerini sizin yerinize hesaplayan bir şekil düzenleyici açar.

![I kesit hazır şekliyle, asal eksenleri ve atalet elipsiyle çokgen kesit düzenleyicisi](/screenshots/tr/sections-polygon.webp)

::div{.steps}

### Hazır bir şekille başlayın {#start-from-a-preset}

Bir **Hazır şekil** seçin (dikdörtgen, I kesit, T kesit, L kesit (korniyer), U kesit, kutu kesit, daire, boru kesit), boyutlarını girin ve **Uygula** düğmesine basın.

### Şekli ayarlayın {#adjust-the-shape}

Köşeleri sürükleyin (**Yakalama adımı** değerine göre yakalanırlar), köşe eklemek için bir kenarın orta noktasına tıklayın, bir köşeyi silmek için üzerine çift tıklayın. Koordinatları **Köşeler** tablosuna da yazabilirsiniz. **Boşluk ekle** bir iç kontur ekler; **Ağırlık merkezine ortala** ise şekli, ağırlık merkezi orijine gelecek biçimde taşır.

### Özellikleri okuyun {#read-the-properties}

**Kesit özellikleri** sekmesi $A$'yı, ağırlık merkezini, ağırlık merkezine göre $I_y$, $I_z$, $I_{yz}$ değerlerini, **Asal eksen açısı** $\alpha$ ile ($y$'den 1 eksenine) asal atalet momentleri $I_1$, $I_2$'yi ve atalet yarıçaplarını gösterir. Çizimde asal eksenler ve atalet elipsi görünür.

### Kesiti ekleyin {#add-it}

**Etiket** ve **Kayma düzeltme katsayısı** $k$ değerlerini kontrol edin: $k$, dikdörtgene uygun olan 0,833 ile başlar; I kesit için yaklaşık $A_{web}/A$ gerekir. Ardından **Kesit ekle** düğmesine basın (mevcut bir şekli düzenliyorsanız **Kaydet**). $A$, $I_y$ ve $h$ şekilden gelir ve tabloda salt okunurdur; bunları değiştirmek için *İşlemler* sütunundaki çokgen düğmesiyle şekli yeniden düzenleyin.

::

Kesit koordinatları yereldir ve sağ el kuralına uyar: $x$ ekrandan dışarı, $y$ sola, $z$ aşağı doğrudur.

Şekil çerçeve düzlemine göre simetrik değilse (örneğin bir L korniyer), düzenleyici sizi uyarır: 2B analiz ancak eleman tüm boyu boyunca (örneğin bir döşemeyle) yanal yer değiştirmeye ve burulmaya karşı tutuluyorsa kesindir. $I_{yz}$ ihmal edilemeyecek kadar büyükse eğilme rijitliğini siz seçersiniz: **Tüm boyu boyunca yanal olarak ve burulmaya karşı tutulu** ($I_y$) ya da daha düşük olan **Yanal yönde serbest**. Burulma her iki durumda da hesaba katılmaz.
