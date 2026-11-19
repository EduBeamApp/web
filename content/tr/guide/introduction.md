---
description: "EduBeam nedir: 2B kiriş, çerçeve ve kafes sistemler için tarayıcıda çalışan ücretsiz bir sonlu elemanlar çözücüsü. Neler yapıp yapmadığı, kimler için olduğu, kılavuzun düzeni ve arkasındaki açık kaynaklı kütüphaneler."
source: site
---

# Giriş

[EduBeam]{.edubeam}, **kirişler, çerçeveler ve kafes sistemler** için tarayıcıda çalışan ücretsiz bir yapı analizi uygulamasıdır. Yapıyı çizin, mesnetlerini ve yüklerini tanımlayın: sonlu elemanlar çözücüsü her değişikliğinizde diyagramları, mesnet tepkilerini ve sehimleri yeniden hesaplar. *Çöz* düğmesi yok; kurulum ve hesap da gerekmez.

::div{.actions}
[EduBeam'i başlatın ↗](https://run.edubeam.app/?lang=tr){target="_blank"} [Hızlı başlangıç, 10 dakika](/tr/guide/quick-start)
::

![EduBeam'de üç mafsallı bir çerçeve: yükler turuncu, mesnet tepkileri mor, eğilme momenti kırmızı ve deforme şekil gri](/screenshots/tr/hero.webp)

:span{#your-first-visit}

## EduBeam neler yapar? {#what-it-does}

::card-grid{cols="2"}
:::card{title="Yapılar" icon="lucide:triangle" to="/tr/essentials/elements"}
x–z düzleminde kirişler, sürekli kirişler, çerçeveler ve kafes sistemler; hepsi Timoshenko kiriş elemanlarından kurulur. Uç mafsalları bir çubuğu kafes çubuğuna dönüştürür.
:::
:::card{title="Mesnetler" icon="lucide:anchor" to="/tr/essentials/nodes-supports#supports"}
Mafsallı mesnet, kayıcı mesnet, ankastre mesnet, kayar ankastre ya da tutulu `Dx`, `Dz` ve `Ry` serbestlik derecelerinin herhangi bir kombinasyonu; hepsi sembolüyle seçilir. Eğik mesnetler ve mesnet çökmeleri.
:::
:::card{title="Yükler" icon="lucide:arrow-down-to-line" to="/tr/essentials/loads"}
Düğümlerde veya çubuk boyunca herhangi bir noktada kuvvetler ve momentler, düzgün yayılı ve trapez yükler, sıcaklık ve öngörülen yer değiştirmeler.
:::
:::card{title="Kesitler" icon="lucide:shapes" to="/tr/essentials/elements#cross-sections"}
Avrupa ve ABD kesit kütüphaneleri ya da kendi çizdiğiniz herhangi bir çokgen; $A$, $I_y$, $I_z$, $I_{yz}$, asal eksenler ve atalet yarıçapları hesaplanır.
:::
:::card{title="Sonuçlar" icon="lucide:chart-spline" to="/tr/essentials/results"}
**N**, **V** ve **M** diyagramları, deforme şekil, mesnet tepkileri, düğüm yer değiştirmeleri, çubuk uç kuvvetleri ve eleman rijitlik matrisleri.
:::
:::card{title="Analiz" icon="lucide:calculator" to="/tr/elements/analysis"}
Doğrusal statik analiz; doğrusal model için kesin sonuç verir, sıklaştırılacak bir ağ yoktur. Bir yapı ayakta duramıyorsa EduBeam bunun nedenini açıklar ve yapının hareketini animasyonla gösterir.
:::
:::card{title="Dosyalar" icon="lucide:folder-open" to="/tr/essentials/import-export"}
Projeler JSON, bütün modeller bağlantı, çizimler PNG veya SVG, sonuçlar CSV olarak. Başka bir model açtığınızda önceki model saklanır; hiçbir veri cihazınızdan çıkmaz.
:::
:::card{title="Birimler" icon="lucide:ruler" to="/tr/essentials/units-settings"}
Tek tıkla SI veya ABD birimleri ya da her büyüklük için ayrı ayrı birim seçimi. z ekseni aşağı ya da ders kitaplarındaki gibi y ekseni yukarı.
:::
::

## EduBeam'in (henüz) yapmadıkları {#what-it-does-not-do-yet}

Sınırları baştan bilmek zaman kazandırır:

::div{.limits}
- **Yalnızca 2B.** Düzlem dışı davranış yok, 3B çerçeve yok.
- **Yalnızca doğrusal statik.** İkinci mertebe (P–Δ) etkileri, burkulma, dinamik analiz ve plastisite yok.
- **Tek yükleme durumu.** Yük kombinasyonu ve zarf yok: her durumu ayrı bir dosya ya da bağlantı olarak kaydedin.
- **Zati ağırlık yok.** Yayılı yük olarak uygulayın.
- **Boyutlandırma kontrolü yok.** EduBeam iç kuvvetleri ve yer değiştirmeleri verir; yönetmelik kontrolleri size kalır.
::

Eksik bir özellik sizin için önemliyse [GitHub'da bildirin](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## Kimler için? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Öğrenciler" icon="lucide:graduation-cap" to="/tr/practice"}
El hesaplarınıza anında geri bildirim ve siz çözdükçe cevaplarınızı kontrol eden alıştırma soruları.
:::
:::card{title="Öğretim elemanları" icon="lucide:presentation" to="/tr/guide/teaching"}
Mesnetlerin, mafsalların ve yüklerin iç kuvvetleri nasıl değiştirdiğini projeksiyonda canlı olarak, 18 dilde gösterin ve her öğrenciye ayrı bir sınav kâğıdı yazdırın.
:::
:::card{title="Mühendisler" icon="lucide:hard-hat" to="/tr/elements/analysis"}
Daha kapsamlı bir masaüstü programı açmadan önce hızlı bir sağlama; çözümün her adımı belgelenmiştir.
:::
:::card{title="Geliştiriciler" icon="lucide:code-xml" to="#libraries"}
EduBeam'in arkasındaki çözücü ve çizimler, kendi kodunuzda kullanabileceğiniz açık kaynaklı kütüphaneler olarak.
:::
::

## Kılavuzda yolunuzu bulun {#how-this-guide-is-organised}

Kenar çubuğunda sayfalar aşağıdaki gruplara ayrılır. Uygulamadaki **?** düğmeleri buradaki ilgili sayfayı sizin dilinizde açar.

::card-grid{cols="2"}
:::card{title="Başlarken" icon="lucide:flag" to="/tr/guide/quick-start"}
Bu sayfa ve Hızlı başlangıç: on dakikada ilk kirişiniz.
:::
:::card{title="Modelleme" icon="lucide:pencil-ruler" to="/tr/essentials/user-interface"}
Arayüz, düğümler ve mesnetler, elemanlar, malzemeler ve kesitler, yükler, birimler ve ayarlar.
:::
:::card{title="Sonuçlar" icon="lucide:chart-spline" to="/tr/essentials/results"}
Diyagramlar, sonuç tabloları ve sonuçların elle kontrolü.
:::
:::card{title="Paylaşım ve öğretim" icon="lucide:share-2" to="/tr/essentials/import-export"}
Proje dosyaları, paylaşım bağlantıları, görüntü ve CSV dışa aktarma ve EduBeam ile öğretim.
:::
:::card{title="Eğitimler" icon="lucide:triangle" to="/tr/tutorials/inclined-beam"}
Eğik bir kiriş, üç mafsallı bir çerçeve, bir düzlem kafes sistem ve mesnet çökmesi olan bir sürekli kiriş; her biri adım adım kurulur ve elle kontrol edilir.
:::
:::card{title="Örnekler" icon="lucide:library" to="/tr/examples/"}
Tek tıkla açılan altı hazır model; alıştırmaları ve cevaplarıyla birlikte.
:::
:::card{title="Teori kılavuzu" icon="lucide:sigma" to="/tr/elements/conventions"}
Eksenler ve işaret kabulü, kiriş ve kafes elemanları ve EduBeam'in bir modeli nasıl çözdüğü.
:::
:::card{title="Yardım" icon="lucide:life-buoy" to="/tr/reference/shortcuts"}
Klavye, fare ve dokunmatik kullanım, sorun giderme ve SSS.
:::
::

## Kendi araçlarınızı geliştirin {#libraries}

EduBeam, bu sitede belgelenen iki açık kaynaklı kütüphane üzerine kuruludur. Onlarla yapıları bir betikle çözebilir, her öğrenciye farklı bir soru üretebilir ya da slaytlar ve ders notları için şekiller çizebilirsiniz.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/tr/solver"}
EduBeam'in arkasındaki TypeScript sonlu elemanlar çözücüsü: bir kirişi tarayıcıda veya Node'da bir düzine satırda modelleyin, çözün ve sonuçlarını okuyun.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/tr/plot"}
Çözülmüş bir yapıyı yükleri, mesnet tepkileri ve N, V, M diyagramlarıyla birlikte SVG olarak çizen Vue 3 bileşenleri.
:::
::

## Diller {#languages}

EduBeam 18 dilde kullanılabilir ve tarayıcınızın diliyle açılır. Dili **Ayarlar → Dil ve bölge** bölümünden değiştirin ya da buradan seçin:

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

Dili bağlantının kendisi de belirleyebilir: `run.edubeam.app/?lang=tr` uygulamayı Türkçe açar.

## Yazarlar ve katkıda bulunanlar {#authors-credits}

[EduBeam]{.edubeam}, [Jan Voříšek](https://github.com/janvorisek)'in geliştirdiği bağımsız bir projedir. Windows ve Linux için masaüstü EduBeam'in izinden gider ve onun oturum dosyalarını hâlâ açabilir. Masaüstü EduBeam'i Prag Çek Teknik Üniversitesi (ČVUT) [İnşaat Fakültesi](https://www.fsv.cvut.cz/en) Mekanik Bölümünde [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) ve [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) geliştirmişti. Çözücüsü [@edubeam/fem](/tr/solver), Bořek Patzák'ın ilk sürümünden gelişmiştir. Uygulama da çözücü de GPL-3.0 lisansıyla açık kaynaklıdır.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Baş geliştirici ve ürün tasarımcısı","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Geliştirici: dokunmatik kontrol, çizim performansı, yükler ve mesnetler","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"Özgün EduBeam ve ilk sonlu elemanlar çözücüsü","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Katkıda bulunun {#contribute}

::card-grid{cols="3"}
:::card{title="Bir sorun bildirin" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Kafa karıştıran, yanlış ya da bozuk bir şey mi var? GitHub'da açtığınız bildirim ekibe ulaşır.
:::
:::card{title="Çeviriyi iyileştirin" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Uygulamanın metinleri her dil için tek bir dosyadadır; pull request'lerinizi bekliyoruz.
:::
:::card{title="Başkalarına da anlatın" icon="lucide:share-2"}
EduBeam'i sınıf arkadaşlarınızla ve meslektaşlarınızla paylaşın ya da ders notlarınıza bir model bağlantısı koyun.
:::
::
