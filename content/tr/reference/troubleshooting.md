---
description: "EduBeam neden sonuç göstermiyor ve nasıl düzeltilir: tüm hata ve uyarı mesajlarının açıklaması, yanlış görünen sonuçlar ve açılmayan dosyalar veya bağlantılar."
source: site
---

# Sorun giderme

Bir model çözülemediğinde [EduBeam]{.edubeam} bunun nedenini görüntüleyicinin sol üstündeki bir mesajla söyler; **Ayrıntıları göster** de tüm sorunları eksiksiz listeler. Gördüğünüz pencerenin başlığını seçin: aşağıda her mesajın ne anlama geldiği ve nasıl düzeltileceği açıklanıyor.

::card-grid{cols="2"}
:::card{title="Henüz çözülemiyor" icon="lucide:circle-dashed" to="#still-needed"}
Mavi bir **Mesnet gerekli** göstergesi. Hata yok: yapı yalnızca henüz mesnetlenmemiş.
:::
:::card{title="Model çözülemiyor" icon="lucide:circle-x" to="#errors"}
Kırmızı bir mesaj. Yapıyı tutmayan mesnetler, mekanizma oluşturan mafsallar, sıfır uzunluklu bir eleman.
:::
:::card{title="Model uyarıları" icon="lucide:triangle-alert" to="#warnings"}
Sarı bir mesaj. Model çözülmüştür, ama bir şey büyük olasılıkla kastettiğiniz gibi değildir.
:::
:::card{title="Sonuçlar yanlış görünüyor" icon="lucide:scale" to="#results-look-wrong"}
Yukarı doğru etkiyen yükler, 10, 100 ya da 1000 kat sapan sehimler, ters dönmüş gibi görünen bir işaret.
:::
::

## Mesajlar {#messages}

### Renkler ne anlama gelir? {#read-the-message}

| Gördüğünüz | Anlamı |
| --- | --- |
| Mavi bir **Mesnet gerekli** göstergesi | Model henüz tamamlanmamıştır. Mesnet ekleyin. Yapının hâlâ nasıl hareket edebildiğini kesikli bir çizgiyle görmek için imleci göstergenin üzerine getirin. |
| **Kırmızı** bir mesaj | Bir şey çözümü engelliyor. Mesaj sorunu belirtir; birden fazla sorun varsa *Modelde n hata var.* yazar. İlgili düğümler çizimde daire içine alınır. |
| **Sarı** bir mesaj | Uyarılar. Model yine de çözülmüştür. Birden fazla uyarı varsa *Modelde n uyarı var.* yazar. |
| *Tanımlı malzeme yok.* / *Tanımlı kesit yok.* | Elemanlar için ikisi de gerekir. Mesajın yanındaki **Yeni ekle** düğmesiyle bir tane ekleyin. |

**Ayrıntıları göster**, başlığı *Henüz çözülemiyor*, *Model çözülemiyor* veya *Model uyarıları* olan pencereyi açar. Penceredeki anahtar yapının nasıl hareket edebildiğini gösterir ya da gizler; **Sorun giderme** bağlantısı da bu sayfaya getirir.

![Model çözülemiyor penceresi ve yapının nasıl hareket edebildiğini gösteren anahtar](/screenshots/tr/ui-diagnostics.webp){.shot-lg}

Çizimde:

- Kırmızı mesajdaki **✕**, küçük bir ekranda yer açmak için mesajı küçük bir *Model çözülemiyor* göstergesine indirir. Yeniden açmak için göstergeye tıklayın.
- Kırmızı mesajdaki **göz** düğmesi, hareketi gösteren kesikli çizgiyi açar ya da gizler. **Ayarlar → Görüntüleyici ayarları → Model denetimi** bu çizgiyi ve animasyonunu kalıcı olarak kapatır.
- Sarı mesajdaki **✕** uyarıları gizler.

### Eksik olanlar {#still-needed}

Model yanlış değil, yalnızca tamamlanmamıştır. Kısa metni görmek için imleci göstergenin üzerine getirin; pencere uzun metni gösterir.

| Mesaj | Anlamı ve çözümü |
| --- | --- |
| *Yapının çözülebilmesi için mesnet gerekiyor.* <br> *2B analizde modelin kararlı olması için en az 3 serbestlik derecesinin tutulu olması gerekir.* | Toplamda üçten az tutulu doğrultu var. Mesnet ekleyin. |
| *… düğümlü parçanın mesnete ihtiyacı var.* <br> *Yapının ayrık bir parçasında (düğüm: …) 3'ten az tutulu serbestlik derecesi var ve bu parça serbestçe hareket edebiliyor.* | Model parçalara ayrılmış ve parçalardan biri boşta kalıyor. Onu yapının geri kalanına bağlayın ya da ona mesnet ekleyin. |
| *Yapının n parçasının mesnete ihtiyacı var.* | Birkaç parça boşta kalıyor. **Ayrıntıları göster** bunları listeler. |

### Hatalar {#errors}

Bir şey çözümü engelliyor. Kırmızı mesaj kısa metni, pencere uzun metni gösterir.

| Mesaj | Anlamı ve çözümü |
| --- | --- |
| *Mesnetler yapıyı tutmuyor: yapı hâlâ yatay doğrultuda kayabiliyor / düşey doğrultuda hareket edebiliyor / serbestçe dönebiliyor / rijit cisim olarak hareket edebiliyor.* <br> *Yapıda yeterli sayıda mesnet var, ancak bu mesnetler yapıyı tutmuyor: yapı hâlâ …* | Yeterince bağ var, ama hepsi paralel ya da etki çizgileri tek bir noktada kesişiyor; yatay bir kirişin altındaki üç kayıcı mesnette olduğu gibi. Kesikli çizgi hareketi gösterir; mesnetlerden birini döndürün ya da taşıyın. |
| *… düğümlü parça tutulmuyor: hâlâ …* <br> *Yapının ayrık bir parçasında (düğüm: …) yeterli sayıda mesnet var, ancak bu mesnetler parçayı tutmuyor: parça hâlâ …* | Aynı durum, parçalara ayrılmış bir modelin tek bir parçası için. |
| *Mafsallar yapının hareket etmesine izin veriyor (düğüm: …).* <br> *Mesnetler yapıyı tutuyor, ancak yapı yine de bir mekanizma: çubukları mafsallar etrafında dönebiliyor (düğüm: …).* | Mafsallar çubukların birbirine göre dönmesine izin veriyor; örneğin iki kolon ayağı mafsallı mesnetli olan ve iki kolonunun da başında mafsal bulunan bir çerçevede ya da düğümleri mafsallı, diyagonalsiz bir karede. Bir mafsalı kaldırın ya da bir çubuk veya mesnet ekleyin. |
| *Yapı kararsız: neredeyse hiç direnç göstermeden hareket ediyor.* <br> *Yapı kararsız: … düğümünün yatay yer değiştirmesi (Dx) … pratikte hiçbir dirençle karşılaşmıyor.* | Neredeyse bir mekanizma ya da sıfıra yakın bir rijitlik. Uzun mesaj düğümleri ve doğrultuları belirtir. Mesnetleri, mafsalları ve `E`, `A`, `Iy` değerlerini kontrol edin. |
| *Yapı bir mekanizma: dirençsiz hareket edebiliyor.* <br> *Yapı bir mekanizma: rijitlik matrisi tekil.* | Yukarıdaki kontrollerin yakalamadığı bir şey serbestçe hareket edebiliyor. Her parçanın en az üç bağla tutulduğunu ve uç mafsallarının hiçbir çubuğu serbestçe dönebilir bırakmadığını kontrol edin. |
| *… elemanının uzunluğu sıfır: … ve … düğümleri aynı noktada.* | Bir elemanın iki düğümü üst üste duruyor. Birini taşıyın ya da elemanı silin. |
| *… elemanının iki ucu da aynı düğüme bağlı.* | Elemanı silin ve iki farklı düğüm arasında yeniden çizin. |
| *… elemanı mevcut olmayan … düğümüne bağlı.* / *… elemanına atanan … malzemesi / kesiti mevcut değil.* | Elemanın kullandığı nesne silinmiş; bu genellikle elle düzenlenmiş bir proje dosyasında olur. *Elemanlar* tablosunda yeniden atayın. |
| *… elemanı tam olarak 2 düğüme bağlanmalıdır.* | İçe aktarılan bir dosyada bozuk bir eleman. Silin ve yeniden çizin. |
| *Düğüm yükü #n, mevcut olmayan … düğümüne etkiyor.* <br> *Öngörülen yer değiştirme #n, mevcut olmayan … düğümüne tanımlanmış.* | Yükü silin ya da ona mevcut bir düğüm atayın. |
| *Eleman yükü #n, mevcut olmayan … elemanına etkiyor.* | Yükü silin. |
| *Modeldeki bir iç tutarsızlık nedeniyle çözüm başarısız oldu.* | Genel bir hata. Son adımı geri alın ya da projeyi kaydedip [hatayı bildirin](#reporting-a-bug). |

### Uyarılar {#warnings}

Model yine de çözülür, ama şunları kontrol edin:

| Mesaj | Anlamı ve çözümü |
| --- | --- |
| *… düğümü hiçbir elemana bağlı değil ve çözümde dikkate alınmıyor.* | Bağlantısız bir düğüm. Silin ya da bir elemana bağlayın. |
| *… düğümü mesnetli, ancak hiçbir elemana bağlı değil; bu nedenle mesnet hiçbir yük taşımıyor.* | Bağlantısız bir düğümdeki mesnet. |
| *Düğüm yükü #n geçersiz değerler içeriyor.* <br> *Öngörülen yer değiştirme #n geçersiz değerler içeriyor.* | Bileşenlerden biri sayı değil. Yükü düzenleyin. |

### Düzenleme sırasında {#while-editing}

Bu mesajlar siz çalışırken bir tarayıcı penceresinde açılır ve model olduğu gibi kalır:

| Mesaj | Anlamı ve çözümü |
| --- | --- |
| *Lütfen önce bir malzeme ekleyin.* <br> *Lütfen önce bir kesit ekleyin.* | Her eleman için ikisi de gerekir. *Malzemeler* veya *Kesitler* sekmesinde bir tane ekleyin, sonra elemanı yeniden çizin. |
| *Lütfen bir malzeme ve bir kesit seçin.* | **Eleman ekle** penceresinde boş bir alan var. İkisini de seçin. |
| *… etiketi zaten kullanılıyor.* | İki düğüm, eleman, malzeme veya kesit aynı etiketi taşıyamaz. Başka bir etiket seçin. |
| *Bu düğüm için zaten öngörülen bir yer değiştirme var. Lütfen önce onu kaldırın.* | Bir düğüme yalnızca bir öngörülen yer değiştirme tanımlanabilir. Mevcut olanı düzenleyin ya da önce silin. |

## Hiçbir şey çizilmiyor {#no-results-are-drawn}

Hiçbir diyagram görünmüyorsa şunları sırasıyla kontrol edin:

::div{.steps}

### Görünüm seçeneklerini kontrol edin {#check-the-display-options}

Hiç mesaj yoksa model çözülmüştür: diyagram yalnızca kapalı olabilir. Görüntüleyicinin sağ üstündeki görünüm seçeneklerinde **M<sub>y</sub>(x)** ya da başka bir sonucu işaretleyin; üstlerindeki ⚙ düğmesi paneli gösterir. Hiç yükü olmayan bir modelin sonuçları her yerde sıfırdır, dolayısıyla o zaman da çizilecek bir şey yoktur.

### Mesnetleri kontrol edin {#check-the-supports}

Çözüm için en az üç tutulu doğrultu gerekir ve mesnetler birlikte yapının kaymasını ya da dönmesini engellemelidir. İki kayıcı mesnet üzerindeki bir kirişin yalnızca iki tutulu doğrultusu vardır ve kiriş kayıp gider: mesnetlerden birini **mafsallı mesnet** yapın. Paralel üç kayıcı mesnet ya da etki çizgileri tek bir noktada kesişen mesnetler de yapıyı tutmaz. Bkz. [Düğümler ve mesnetler](/tr/essentials/nodes-supports#supports).

### Elemanların birbirine bağlı olduğunu kontrol edin {#check-the-connections}

Aynı koordinatlardaki iki düğüm yine de iki ayrı düğümdür; yapının geri kalanına yalnızca orada değen bir parça boşta kalır. Fazla olan düğümü silin ve elemanları yeniden bağlayın. Bir elemanın üzerine düğüm yerleştirirken elemanı orada bölmek için **Yapıya bağla** cevabını verin.

### Mafsalları sayın {#count-the-hinges}

İki kolon ayağı mafsallı mesnetli olan ve iki kolonunun da başında mafsal bulunan bir çerçeve ya da diyagonali olmayan, düğümleri mafsallı çubuklardan oluşan bir kare bir mekanizmadır. EduBeam mafsalları daire içine alır ve hareketi kesikli bir çizgiyle canlandırır. Bkz. [Uç mafsalları](/tr/essentials/elements#end-hinges).

### Sıfır rijitlik arayın {#look-for-zero-stiffness}

0 olarak ya da yanlış birimle girilmiş `E`, `A` veya `Iy`, yapının bir kısmının neredeyse hiç direnç göstermeden hareket etmesine yol açar. EduBeam bunu *kararsız* olarak bildirir.

::

## Sonuçlar yanlış görünüyor {#results-look-wrong}

| Belirti | Olası neden |
| --- | --- |
| Yükler yukarı doğru etkiyor | Global **z ekseni aşağı doğrudur**; bu yüzden pozitif `Fz` veya `fz` aşağı doğru etkir, negatif değerler yukarıyı gösterir. y yukarı eksenlerle durum tam tersidir. Bkz. [Yükler](/tr/essentials/loads#sign-convention-in-one-line). |
| Sehim 10, 100 ya da 1000 kat farklı | Birim karışıklığı: alan MPa beklerken `E` Pa olarak ya da m⁴ beklerken `Iy` cm⁴ olarak girilmiş. Görüntüleyicinin sağ altındaki birim göstergesi her alanın kullandığı birimleri listeler. |
| Sehim ders kitabındaki formülden biraz büyük | Timoshenko kirişinin kayma şekil değiştirmesi. Bkz. [Sonuçların elle kontrolü](/tr/guide/verification#shear-deformation). |
| Bir işaret yanlış görünüyor | İşareti diyagramın hangi tarafta çizildiğinden değil, değerden okuyun: pozitif M, alt lifleri çeken momenttir. *Eleman sonuçları* içindeki uç kuvvetleri N-V-M işaret kabulüne değil, elemanın yerel eksenlerine göre verilir. Bkz. [İşaretin okunması](/tr/essentials/results#reading-the-sign). |
| Bir diyagram “yanlış” tarafta | Taraf bir görünüm ayarıdır: eğilme momenti çekme ya da basınç tarafında, N ve V kesikli çizginin iki tarafından birinde. **Ayarlar → Görüntüleyici ayarları → İç kuvvet diyagramları**. |
| Özdeş iki kolonda kesme kuvvetinin işareti zıt | V'nin işareti her elemanın yönüne bağlıdır. Karşılaştırmak için birinin düğüm sırasını ters çevirin. |
| `4 · 10¹` gibi sayılar | Bilimsel sayı biçimi. **Ayarlar → Dil ve bölge → Sayı biçimi** altında *Otomatik* seçeneğini seçin. |
| Diyagramlar çok büyük veya çok küçük | Bu yalnızca çizimi etkiler. **Ayarlar → Görüntüleyici ayarları** altında **Sonuç ölçeği** değerini ayarlayın. |
| Yerel eksenlerde tanımlı bir yük ters yönü gösteriyor | Bir elemanın yerel x ekseni *başlangıç* düğümünden *bitiş* düğümüne doğrudur. Düğüm sırasını ters çevirin ya da işareti değiştirin. |
| Eğik bir çubuğun yükü beklenenden farklı | **LCS** (yerel koordinat sistemi) varsayılan olarak işaretlidir, bu yüzden `fz` çubuğa dik etkir. Düşey bir yük için işareti kaldırın. |
| Sıcaklık yüklemesi hiçbir etki yapmıyor | İzostatik bir yapı sıcaklık altında iç kuvvet oluşmadan serbestçe şekil değiştirir. Şekil değiştirme görmek için α'nın 0 olmadığını, sıcaklık farkında da kesit yüksekliği $h$'nin girildiğini kontrol edin. |

## Dosyalar ve bağlantılar {#files-and-links}

| Belirti | Çözüm |
| --- | --- |
| *Dosya içe aktarılamadı. Lütfen dosya biçimini kontrol edin.* | Dosya ne bir EduBeam projesi ne de bir masaüstü EduBeam oturumu. Modeliniz değişmez. |
| *Bu EduBeam oturumunda birden fazla yükleme durumu var, ancak aynı anda yalnızca biri açılabilir.* | Birden fazla yükleme durumu içeren bir masaüstü EduBeam oturumu: EduBeam ilkini açar ve açmadıklarını belirtir. |
| Paylaşım bağlantısı açılmıyor, eski modeliniz ekranda kalıyor | Bağlantı kesilmiş ya da değiştirilmiş; örneğin bir e-posta programı onu satırlara bölmüş olabilir. EduBeam okuyamadığı bir bağlantıyı yok sayar ve modelinizi korur. Bağlantının tamamını yeniden kopyalayın. |
| Kısa bir bağlantı bir meslektaşınızda açılmıyor | Onun EduBeam kopyası 1.3.2 sürümünden eski. Uygulamayı yeniden yüklemesi gerekir; ya da siz bağlantıyı **Daha kısa bağlantı** kapalıyken paylaşabilirsiniz. Bkz. [Bağlantıyla paylaşma](/tr/essentials/import-export#share-a-link). |

## Arayüz sorunları {#interface-issues}

| Belirti | Çözüm |
| --- | --- |
| Kısayollar çalışmıyor | Önce çizime tıklayın: imleç bir metin alanındayken tek tuşlu kısayollar çalışmaz. Mac'te <kbd>Ctrl</kbd> yerine <kbd>Cmd</kbd> kullanın. Bkz. [Klavye, fare ve dokunmatik](/tr/reference/shortcuts). |
| Mac'te <kbd>Delete</kbd> çalışmıyor | Mac klavyesinde *delete* yazan tuş aslında Backspace'tir. <kbd>Fn</kbd>+<kbd>Delete</kbd> tuşlarına basın. |
| Görünüm kaydırılamıyor | Kaydırma farenin orta ya da sağ tuşuyla yapılır; hangisi olacağını **Ayarlar → Kontroller ve kısayollar** altında seçin. Dokunmatik yüzeyde iki parmakla tıklayıp sürükleyin. Dokunmatik ekranda tek parmakla sürükleyin. |
| Modelim kayboldu | Bir bağlantı, dosya veya örnek açtığınızda ya da modeli temizlediğinizde eski model saklanır: **☰ → Son modeller** ya da <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Bağlantı açılırken ekranın altında bir **Göster** düğmesiyle şu mesaj çıkar: *Paylaşılan bir model açıldı. Öncekini Son modeller listesinde bulabilirsiniz.* |
| Dil yanlış | **Ayarlar → Dil ve bölge** ya da adrese `?lang=tr` ekleyin. |
| Ayar değişiklikleri kalıcı olmuyor | Tarayıcı belleği engellenmiş; örneğin gizli bir pencerede ya da sıkı bir gizlilik modunda. Ayarlar, kaydedilen model ve Son modeller listesi bu belleği kullanır. |

## Hata bildirme {#reporting-a-bug}

Tarayıcınızı ve işletim sisteminizi, ne yaptığınızı ve ne beklediğinizi yazarak [GitHub'da bildirin](https://github.com/janvorisek/edubeam/issues). En yararlısı, sorunu gösteren bir **paylaşım bağlantısı** ya da **proje dosyasıdır**.
