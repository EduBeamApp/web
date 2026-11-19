---
description: "EduBeam ile öğretim: projeksiyonda canlı modeller, ders notlarında paylaşım bağlantıları, kendi kendine kontrol edilen ödevler, üretilen sorular ve cevap anahtarlı sınavlar."
source: site
---

# EduBeam ile öğretim

[EduBeam]{.edubeam} bir derslikte doğdu ve hâlâ en iyi orada işe yarıyor: projeksiyondaki model her değişikliğe anında tepki verir, bir bağlantı sayesinde aynı model her öğrencinin dizüstü bilgisayarında da açılır. Bu sayfa, ilk dersten sınava kadar öğretim elemanlarının en sık kullandığı özellikleri bir araya getirir.

::card-grid{cols="2"}
:::card{title="Derste" icon="lucide:presentation" to="#in-the-lecture"}
Modeli arka sıralardan da okunur hâle getirin ve canlı olarak değiştirin.
:::
:::card{title="İlk laboratuvar dersinde" icon="lucide:graduation-cap" to="#getting-students-started"}
Boş bir ekrandan elle kontrol edilmiş bir kirişe on dakikada.
:::
:::card{title="Ders notlarında ve ödevlerde" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
Bir PDF'teki ya da slayttaki bağlantı modelin tamamını açar, yıllar sonra bile.
:::
:::card{title="Kendi kendine kontrol edilen ödevler" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
Önce el hesabı, sonra kontrol için model.
:::
:::card{title="Alıştırmalar ve sınav kâğıtları" icon="lucide:file-check" to="#practice-and-test-papers"}
Anında kontrol edilen üretilmiş sorular ve cevap anahtarlı, yazdırılabilir sınavlar.
:::
:::card{title="Koddan föyler ve slaytlar" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
@edubeam/plot ile yazılmış kendi soru üreteçleriniz ve slayt şekilleriniz.
:::
::

## Derste {#in-the-lecture}

- **Arka sıralardan da okunabilir olsun.** **Ayarlar → Görüntüleyici ayarları** bölümünde **Yazı boyutu** değerini 18 ya da 20 px'e (en büyük değer 20 px'tir), **Mesnet boyutu** değerini %130–150'ye çıkarın. Diyagramlar hâlâ küçük görünüyorsa **Sonuç ölçeği** değerini artırın.
- **Her seferinde tek bir şey gösterin.** Görüntüleyicinin sağ üstündeki görünüm seçeneklerinde o an anlattığınız büyüklük dışındaki her şeyin işaretini kaldırın, diğerlerini sonra tek tek ekleyin.
- **Modeli canlı değiştirin.** Bir mesneti sürükleyin, `Ry` kutusunu işaretleyin, bir mafsal ekleyin. Öğrenciler neden ile sonucu aynı anda görür; <kbd>Ctrl</kbd>+<kbd>Z</kbd> sizi geri götürür.
- **Mekanizmaları çözücü anlatsın.** Gereğinden bir fazla mafsal koyun: EduBeam yapının nasıl hareket edebileceğini çizer, bu hareketi canlandırır ve soruna yol açan mafsalları daire içine alır. Kararlılığı konuşmak için iyi bir an. İki anahtar da **Ayarlar → Görüntüleyici ayarları → Model denetimi** altındadır.
- **Öğrencilerin dilini ve eksenlerini kullanın.** EduBeam 18 dilde kullanılabilir. Ders notlarınıza uymak için **Ayarlar** bölümünde SI ile ABD birimleri ve z aşağı ile y yukarı eksenler arasında geçiş yapabilirsiniz (bkz. [Birimler ve ayarlar](/tr/essentials/units-settings)).

![Görünür hâle gelen bir mekanizma: B ve C'deki mafsallar çerçevenin yanal ötelenmesine izin veriyor](/screenshots/tr/ui-mechanism.webp)

## İlk laboratuvar dersinde {#getting-students-started}

EduBeam, öğrencilere ilk ziyaretlerinde nasıl başlamak istediklerini ve hangi birimleri ve eksenleri kullanacaklarını sorar. Dersinizin hangi birimleri ve eksenleri kullandığını onlara önceden söyleyin. Tur (**Beni gezdir**), rehberli görev **İlk kirişinizi çizin** ve **Örnekler** sonradan kullanmak için **☰** menüsünde durur.

İyi bir ilk laboratuvar dersi: “run.edubeam.app adresini açın ve *İlk kirişinizi çizin* seçeneğini seçin”, ardından sonunda elle kontrolü olan, yaklaşık on dakikalık [Hızlı başlangıç](/tr/guide/quick-start).

### Laboratuvar bilgisayarları ve çevrim dışı kullanım {#offline-and-lab-computers}

EduBeam aşamalı bir web uygulamasıdır (PWA): bir tarayıcı onu bir kez yükledikten sonra bağlantı olmadan da çalışmaya devam eder ve tarayıcı onu bir masaüstü uygulaması gibi kurmayı önerebilir. Model ve ayarlar her tarayıcı profili için ayrı saklanır; bu nedenle ortak kullanılan laboratuvar bilgisayarlarında öğrenciler çalışmalarını bir dosya ya da bağlantı olarak yanlarında götürmelidir. Ayrıntılar [Tarayıcınızda neler saklanır](/tr/essentials/units-settings#what-is-stored-in-your-browser) bölümündedir.

## Ders notlarında ve ödevlerde {#in-lecture-notes-and-assignments}

Paylaşım bağlantısı modelin tamamını içerir; bu yüzden bağlantı koyabildiğiniz her yerde çalışır: PDF, slayt, LMS sayfası, e-posta.

::div{.steps}

### Modeli kurun {#share-build}

Modeli öğrencilerin ilk görmesini istediğiniz gibi hazırlayın: yükler, etiketler ve açık olmasını istediğiniz diyagramlar.

### Bağlantıyı kopyalayın {#share-copy}

Üst çubukta **Modeli paylaş** düğmesine basın. Bağlantının sizin diyagramlarınız, yükleriniz ve etiketlerinizle açılmasını istiyorsanız **Gördüğümü göster** seçeneğini açın, ardından **Kopyala** düğmesine basın.

### Notlarınıza yapıştırın {#share-paste}

Bağlantıyı açan öğrenciler, üzerinde çalışabilecekleri kendi kopyalarını alır. Yaptıkları değişiklikler ne size ne de başka birine ulaşır. Bağlantılar yeni EduBeam sürümlerinde de çalışır; notlarınız yıllar boyunca geçerli kalır.

::

Ders materyalinde **Daha kısa bağlantı** seçeneğini kapalı bırakın: bu seçenek eklendiğinden beri güncellenmemiş bir EduBeam kopyası, güncellenene kadar kısa biçimi açamaz.

| Bağlantı | Ne açılır |
| --- | --- |
| `run.edubeam.app/?model=…` | düzenlemeye hazır model |
| `run.edubeam.app/?viewer=1&model=…` | `<iframe>` için [görüntüleyici modunda](/tr/essentials/import-export#embed-a-read-only-viewer) model |
| `run.edubeam.app/?panel=examples` | [örnek galerisi](/tr/examples/) |
| `run.edubeam.app/?lang=cs` | Çekçe ya da herhangi bir [başka dilde](/tr/essentials/import-export#url-parameters) uygulama |

::callout{type="warning" title="Bağlantı öğrencinin kendi modelinin yerine geçer"}
Bir bağlantıyı ve bazı tarayıcılarda gömülü görüntüleyici içeren bir sayfayı açmak, öğrencinin o anki modelini **☰ → Son modeller** listesine taşır; model oradan geri yüklenebilir. Yine de öğrencilerden, dersten gelen bağlantıları açmadan önce önem verdikleri çalışmaları **☰ → Projeyi kaydet** ile kaydetmelerini isteyin.
::

## Öğrencilerin kendi kontrol edebileceği ödevler {#assignments-students-can-check-themselves}

EduBeam, yöntemi öğrencinin yerine uygulamadan, el hesabına anında geri bildirim verir.

- **Önce hesap, sonra kontrol.** Mesnet tepkilerini, iç kuvvetleri ve bir yer değiştirmeyi elle hesaplatın, ardından öğrencilerin modeli kurup sonuçları karşılaştırmasını isteyin. Formüller [Sonuçların elle kontrolü](/tr/guide/verification) sayfasında, izlenecek yol ise [Hızlı başlangıç](/tr/guide/quick-start#_8-check-by-hand) sayfasında.
- **Bir sonucun neden farklı çıktığını sorun.** Kayma şekil değiştirmesi, eksik bir mafsal, global yerine yerel eksenlerde tanımlanmış bir yük: her biri küçük ya da büyük bir farkı açıklar ve farkı bulmak, sonucun tutmasından daha çok şey öğretir.
- **Modeli hesapla birlikte toplayın.** Hesabın yanında bir paylaşım bağlantısı veya bir `project.json` dosyası isteyin. Açtığınızda tam olarak neyin modellendiğini görürsünüz.
- **Raporlar düzgün görünür.** Öğrenciler çizimi Word'de ve LaTeX'te keskin kalan **SVG** olarak, sonuçları da **CSV** olarak dışa aktarabilir. Bkz. [Görüntüyü dışa aktarma](/tr/essentials/import-export#export-an-image).

## Hazır alıştırmalar {#ready-made-exercises}

- **[Örnekler](/tr/examples/):** tek tıkla açılan altı model; her biri sorular, nelere bakılacağı ve cevaplarla birlikte.
- **[Alıştırmalar](/tr/practice):** öğrencilerin cevaplarını kontrol eden, otomatik üretilmiş kiriş, çerçeve ve kafes sistem soruları. [Sınav oluşturucu](/tr/exam) aynı soruları sınav kâğıdı olarak yazdırır. Ayrıntılar [aşağıda](#practice-and-test-papers).
- **[Eğitimler](/tr/tutorials/inclined-beam):** eğik bir kiriş, üç mafsallı bir çerçeve, bir düzlem kafes sistem ve mesnet çökmesi olan bir sürekli kiriş; her biri adım adım modellenir ve elle kontrol edilir. 15–20 dakikalık laboratuvar föyleri olarak kullanılabilir.
- **[Sonuçların elle kontrolü](/tr/guide/verification):** konsoldan mesnet çökmesine kadar kısa kontroller olarak verebileceğiniz kapalı form çözümler.

## Alıştırma soruları ve sınav kâğıtları {#practice-and-test-papers}

Bu sitedeki iki sayfa, hiçbir şey kurmanıza ya da programlamanıza gerek kalmadan sizin için statik soruları hazırlar:

- **[Alıştırmalar](/tr/practice)** sayfası öğrencilere her istediklerinde yeni bir soru verir. Öğrenciler soruyu kâğıt üzerinde çözer, mesnet tepkilerini ve en büyük eğilme momentini ya da bir çubuk kuvvetini girer; sayfa her değeri kesin çözümle karşılaştırır: %1'e kadar sapma doğru sayılır, büyüklüğü doğru ama yönü yanlış bir değer ayrıca belirtilir. İpucu nereden başlanacağını gösterir, diyagramlar da soru çözüldükten sonra gelir. Her sorunun, hep aynı soruyu açan bir kodu vardır (örneğin `H2048`): ödeve bir soru kodu yazın, herkes aynı sayılarla kontrol etsin.
- **[Sınav oluşturucu](/tr/exam)** yazdırılabilir sınav kâğıtları hazırlar: yapı türlerini seçin, kâğıt başına en fazla 6 soru ve en fazla 40 grup belirleyin; her öğrenci farklı bir grup alır. Her grupta aynı yapı türleri aynı sırayla yer alır, böylece kâğıtların zorluğu eşittir. Kâğıtlara ad soyad satırı ve çözüm için boşluk, sonuna da cevap anahtarı ekler; **Yazdır veya PDF olarak kaydet** bunları yazdırır. **.zip indir** her şekli LaTeX ve Word için SVG dosyası olarak, cevapları da notlandırma için bir CSV tablosu olarak verir.

İkisi de aynı sekiz yapı türünü sunar: altı izostatik yapı (basit mesnetli kiriş, konsol kiriş, konsollu kiriş, Gerber kirişi, üç mafsallı çerçeve ve Warren kafes kirişi) ve iki hiperstatik yapı (iki açıklıklı sürekli kiriş ve portal çerçeve).

Sınav oluşturucu, sayıları belirleyen **Sınav numarası** dahil tüm ayarlarını sayfanın adresinde tutar. Adresi yer imlerine ekleyin; gelecek yıl aynı kâğıtları ve cevap anahtarını yeniden elde edersiniz. Soru kodları sınav kâğıtlarında varsayılan olarak kapalıdır: alıştırma sayfası çözümü gösterir, bu yüzden kodların yeri öğrencilerin kendi çalışmalarını sonradan kontrol ettiği ödevlerdir.

## Koddan föyler, sınavlar ve slaytlar {#exercise-sheets-tests-and-slides-from-code}

Bu sitedeki diyagramları [@edubeam/plot](/tr/plot) çizim kütüphanesi çizer. Vue bileşenlerinden oluşan bu kütüphane, EduBeam'in arkasındaki çözücü [@edubeam/fem](/tr/solver) ile çözülmüş her düzlem kirişi, çerçeveyi ya da kafes sistemi çizebilir. Biraz JavaScript biliyorsanız, birkaç satır kodla ders materyali hazırlayabilirsiniz:

- **Kendi soru türleriniz.** Sınav oluşturucudaki yapılar sizin derste anlattıklarınız değilse kendi türlerinizi yazın: bir tohum değeri (rastgele sayı üretecinin başlangıç değeri) yapıyı ve sayılarını seçer, böylece aynı tohum değeri her zaman aynı soruyu verir; cevap anahtarı da aynı tohum değerinden üretilir.
- **Adım adım gelişen slaytlar.** Önce yapıyı, sonra mesnetleri ve yükleri, sonra mesnet tepkilerini, en sonunda moment diyagramını adım adım gösterin; çizim adımlar arasında kaymaz.
- **Ders notları ve ders sayfaları için şekiller.** Sayfanın açık ya da koyu temasını izleyen keskin SVG; gömülü bir uygulamanın aksine öğrencinin kendi modeline asla dokunmaz.

Deneyin. **Yeni soru** düğmesine her bastığınızda yeni bir soru ve cevap anahtarı çizilir:

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="Alıştırmalar ve sınavlar" icon="lucide:file-check" to="/tr/plot/exercises"}
Bir tohum değerinden föyler ve cevap anahtarları üretin.
:::
:::card{title="Slaytlar ve ders notları" icon="lucide:presentation" to="/tr/plot/slides"}
Slaytlar ve notlar için katman katman gelişen şekiller.
:::
::
