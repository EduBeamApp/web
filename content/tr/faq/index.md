---
description: "EduBeam hakkında kısa cevaplar: ücret, çevrim dışı kullanım, gizlilik, doğruluk, sonuçların nasıl hesaplandığı, atıf, alıştırma soruları, paylaşım ve kod."
source: site
---

# Sıkça sorulan sorular

Kısa cevaplar; her birinde konuyu ayrıntılı anlatan sayfaya bir bağlantı var. Sorunuzu bulamadınız mı? [Sorun giderme](/tr/reference/troubleshooting) sayfasına bakın ya da [GitHub'da bize yazın](https://github.com/janvorisek/edubeam/issues).

## Genel {#general}

### EduBeam nedir? {#what-is-edubeam}

Düzlem kirişlerin, çerçevelerin ve kafes sistemlerin doğrusal statik analizi için ücretsiz ve açık kaynaklı bir uygulama; anında geri bildirim isteyen öğrenciler, öğretim elemanları ve mühendisler için yapıldı. Tarayıcıda çalışır. Neler yapıp neler yapmadığı [Giriş](/tr/guide/introduction) sayfasında listelenir.

### Gerçekten ücretsiz mi? Hesap gerekiyor mu? {#is-it-really-free-do-i-need-an-account}

Evet, ücretsizdir; hayır, hesap gerekmez. [run.edubeam.app](https://run.edubeam.app/?lang=tr){target="_blank"} adresini açın ve modellemeye başlayın: kurulacak bir şey ve kullanım sınırı yoktur. Kaynak kodu GPL-3.0 lisansıyla [GitHub](https://github.com/janvorisek/edubeam)'dadır.

### Hangi tarayıcılarda ve cihazlarda çalışır? {#which-browsers-and-devices-work}

Bilgisayar, tablet veya telefonda Chrome, Edge, Firefox ya da Safari'nin güncel her sürümünde. Dokunmatik ekranda seçmek için dokunun, bir düğümü taşımak için onu sürükleyin, görünümü kaydırmak için başka bir yerde sürükleyin, yakınlaştırmak için iki parmakla kıstırın, tuval menüsü için basılı tutun. Yine de fare ve klavyeyle modellemek daha hızlıdır. Bkz. [Klavye, fare ve dokunmatik](/tr/reference/shortcuts#touch).

### Modelimi kaybettim. Geri alabilir miyim? {#i-lost-my-model-can-i-get-it-back}

Büyük olasılıkla evet. Bir model temizlendiğinde ya da yerine bir bağlantı, dosya veya örnek açıldığında EduBeam onu **☰ → Son modeller** listesinde (son 10 model) saklar; <kbd>Ctrl</kbd>+<kbd>Z</kbd> da bu değişikliği geri alır. İkisi de yalnızca bu tarayıcıda tutulur; başka bir bilgisayardaki ya da tarayıcı profilindeki model burada bulunmaz. Bkz. [Son modeller](/tr/essentials/import-export#recent-structures).

### Çevrim dışı kullanabilir miyim? {#can-i-use-it-offline}

Evet. EduBeam aşamalı bir web uygulamasıdır (PWA): tarayıcınız onu bir kez yükledikten sonra bağlantı olmadan da çalışmaya devam eder ve tarayıcı onu kurmayı önerebilir. Yeni bir sürüm çıktığında bir pencere güncellemeden önce size sorar.

### Verilerim nerede saklanıyor? {#where-is-my-data-stored}

Tarayıcınızda. Hesap ve bulut depolama yoktur: uygulama modelinizi ve ayarlarınızı bu tarayıcıda tutar, paylaşım bağlantısı da modeli bağlantının kendi içinde taşır. Bkz. [Tarayıcınızda neler saklanır](/tr/essentials/units-settings#what-is-stored-in-your-browser).

run.edubeam.app adresindeki uygulama kullanım istatistikleri (Google Analytics) ve hata raporları (Sentry) toplar. Bir hata raporu ve Sentry'nin oturumların bir kısmından aldığı kayıt, ekranda görünenleri, dolayısıyla modelinizi de içerebilir.

### Statik sorularıyla nerede alıştırma yapabilirim? {#practice}

[Alıştırmalar](/tr/practice) sayfasında. Sayfa size her seferinde yeni sayılarla bir kiriş, çerçeve veya kafes sistem verir: mesnet tepkilerini ve en büyük eğilme momentini ya da çubuk kuvvetini kâğıt üzerinde bulun, değerleri girin; her biri anında kontrol edilir. [Örnekler](/tr/examples/) de sorular ve cevaplarla birlikte gelir. Öğretim elemanları [sınav oluşturucu](/tr/exam) ile her öğrenciye cevap anahtarlı, farklı bir sınav kâğıdı hazırlayıp yazdırabilir; bkz. [Alıştırma soruları ve sınav kâğıtları](/tr/guide/teaching#practice-and-test-papers).

### EduBeam'e nasıl atıf yaparım? {#cite}

Yazılım olarak, kullandığınız sürüm ve tarihle birlikte. Sürüm numarası **☰** menüsünün en altındadır. Örneğin:

> Voříšek, J. ve katkıda bulunanlar. *EduBeam*, sürüm 1.3.4 \[yazılım\]. https://edubeam.app (erişim tarihi: 18 Kasım 2026).

Belirli bir modele atıf yapmak için onun [paylaşım bağlantısını](/tr/essentials/import-export#share-a-link) ekleyin: bağlantı her okuyucu için aynı modeli açar.

## Modelleme {#modelling}

### Ankastre, mafsallı veya kayıcı mesneti nasıl tanımlarım? {#how-do-i-make-a-fixed-pinned-roller-support}

Düğüme tıklayın, **Düğüm mesnetleri** seçeneğini açın ve sembolü belirleyin: mafsallı mesnet, kayıcı mesnet, ankastre, kayar ankastre ve diğerleri. Ya da **Düğümler** sekmesinde tutulu serbestlik derecelerini işaretleyin: `Dx` + `Dz` + `Ry` ankastre, `Dx` + `Dz` mafsallı mesnet, yalnızca `Dz` kayıcı mesnettir. Tüm türler [Düğümler ve mesnetler](/tr/essentials/nodes-supports#supports) sayfasında listelenir.

### Kafes sistemi nasıl oluştururum? {#how-do-i-make-a-truss}

Çubukları sıradan elemanlar olarak çizin ve her birinin iki ucunu da serbest bırakın: **Elemanlar** sekmesinde **Uç mafsalları** sütunundaki iki kutuyu da işaretleyin ya da çubukları fareyle çizmeden önce şeritteki **Başlangıç mafsalı** ve **Bitiş mafsalı** kutularını işaretleyin. Yükleri düğüm noktalarına uygulayın. [Düzlem kafes sistem eğitimi](/tr/tutorials/truss) bir kafes sistemi adım adım kurar.

### Çerçeveye nasıl mafsal koyarım? {#how-do-i-put-a-hinge-in-a-frame}

Serbestçe dönmesi gereken eleman ucundaki momenti serbest bırakın: **Elemanlar** sekmesinde o ucun mafsalını işaretleyin. Mafsal bir eleman ucuna aittir; birkaç elemanın birleştiği bir düğümde bunlardan birini serbest bırakmak, diğerlerini birbirine rijit bağlı bırakır. Bkz. [Uç mafsalları](/tr/essentials/elements#end-hinges).

### Kirişin ortasına nasıl mesnet veya tekil yük eklerim? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Mesnet için kirişin üzerine fareyle bir düğüm ekleyin (imleç simgeli **Düğüm ekle** düğmesi) ve **Yapıya bağla** seçeneğini seçin: kiriş o düğümde ikiye bölünür ve düğüme mesnet tanımlayabilirsiniz. Tekil yük için düğüm gerekmez: elemana bir **Tekil yük** ekleyin ve konumunu başlangıç düğümünden ölçerek girin. Bkz. [Mevcut bir elemanın üzerine düğüm yerleştirme](/tr/essentials/nodes-supports#placing-a-node-on-an-existing-element) ve [Tekil yük](/tr/essentials/loads#concentrated-load).

### Zati ağırlık uygulayabilir miyim? {#can-i-apply-self-weight}

Otomatik olarak uygulanmaz: malzemenin yoğunluğu statik analizde kullanılmaz. Zati ağırlığı $f_z = \rho g A$ değerinde düzgün yayılı yük olarak ekleyin; örneğin bir IPE 200 için $7850 \cdot 9{,}81 \cdot 28{,}48 \cdot 10^{-4} = 219$ N/m, yani 0,22 kN/m.

### Eğik mesnet modelleyebilir miyim? {#can-i-model-inclined-supports}

Evet. Düğüme bir **Düğüm yerel eksen açısı** verin; düğümün mesnetleri bundan sonra döndürülmüş eksenler doğrultusunda etkir. Bkz. [Eğik mesnetler](/tr/essentials/nodes-supports#inclined-skewed-supports).

### ABD birimleriyle çalışabilir miyim? {#can-i-work-in-us-customary-units}

Evet. Görüntüleyicinin sağ altındaki birim göstergesine tıklayın; **Ayarlar → Dil ve bölge** açılır. ft ve kip için **Birim sistemi** olarak **ABD (emperyal)** seçin ya da her birimi ayrı ayrı seçin. Model SI birimlerinde saklanır; birim değiştirmek yalnızca gördüklerinizi dönüştürür, modeli asla değiştirmez. Bkz. [Birimler ve ayarlar](/tr/essentials/units-settings).

### Yükleme durumları veya kombinasyonları var mı? {#are-there-load-cases-or-combinations}

Hayır, bir modelde tek bir yükleme durumu vardır. Her durumu ayrı bir dosya ya da bağlantı olarak kaydedin ve sonuçları kendiniz birleştirin. Masaüstü EduBeam'den birden fazla yükleme durumu içeren bir oturum ilk yükleme durumuyla açılır ve bir mesaj dışarıda kalanları belirtir.

### Yüklerim neden yukarıyı gösteriyor? {#why-do-my-loads-point-up}

Büyük olasılıkla negatif bir değer girdiğiniz için. EduBeam'de global z ekseni **aşağı** doğrudur; dolayısıyla pozitif bir `fz` veya `Fz` aşağı yönlü, yerçekimi yönündeki bir yüktür: aşağı doğru 12 kN/m, `fz = 12` demektir. Bkz. [Koordinat sistemi ve işaret kabulü](/tr/elements/conventions#loads). Dersiniz yukarı doğru bir düşey eksen kullanıyorsa **Ayarlar → Dil ve bölge → Koordinat sistemi** bölümünde **x sağa, y yukarı** seçeneğine geçin: girdiler ve sonuçlar bu eksene göre verilir.

## Sonuçlar {#results}

### Neden “Çöz” düğmesi yok? {#why-is-there-no-solve-button}

Çünkü model her değişiklikten sonra yeniden çözülür. Sonuç görünmüyorsa model henüz çözülemiyordur ve tuvaldeki bir mesaj nedenini söyler. Neleri kontrol etmeniz gerektiği [Sorun giderme](/tr/reference/troubleshooting#no-results-are-drawn) sayfasında listelenir.

### Sehimim neden formülden biraz farklı? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam Timoshenko kiriş elemanları kullanır; bu yüzden sehim, ders kitabı formüllerinin genellikle dışarıda bıraktığı kayma şekil değiştirmesini de içerir. Narin bir kirişte fark %1 civarındadır; [Hızlı başlangıç](/tr/guide/quick-start#_8-check-by-hand) sayfasında bu iki kısım elle toplanır. Hiperstatik bir yapıda kayma rijitliği iç kuvvetleri de biraz değiştirir. Daha fazlası [Sonuçların elle kontrolü](/tr/guide/verification) sayfasında.

### Sonuçlar ne kadar doğru? Daha fazla eleman gerekir mi? {#how-accurate-are-the-results-do-i-need-more-elements}

Doğrusal statikte kiriş elemanı EduBeam'in sunduğu her yük türü için kesin sonuç verir; bu yüzden her çubuk için tek eleman yeterlidir ve sıklaştırılacak bir ağ yoktur. Düğümleri yalnızca mesnet, mafsal, kesit değişimi, düğüm yükü ya da okumak istediğiniz bir yer değiştirme için ekleyin. Bkz. [Hassasiyet ve doğruluk](/tr/essentials/results#precision-and-accuracy).

### EduBeam sonuçları nasıl hesaplar? {#how-does-edubeam-compute-the-results}

Tarayıcınızda, sonlu elemanlar yönteminin yapı statiği derslerinde öğretilen doğrudan rijitlik yöntemiyle. [EduBeam modeli nasıl çözer](/tr/elements/analysis) sayfası her adımı elle tekrarlayabileceğiniz küçük bir örnek üzerinde izler; çözücünün kendisi de [@edubeam/fem](/tr/solver) adıyla açık kaynaklıdır.

### Rijitlik matrislerini görebilir miyim? {#can-i-see-the-stiffness-matrices}

Evet. **Elemanlar** sekmesinde bir elemanın satırındaki matris düğmesi, onun 6 × 6 rijitlik matrisini global eksenlerde ve SI birimlerinde (N, m) açar. Görüntüleyicide bir elemana tıkladığınızda da **Rijitlik matrisi** seçeneği çıkar. Matris [Kiriş elemanı](/tr/elements/beam#global-stiffness-matrix) sayfasında türetilir.

### Mesnet tepkileri nerede listeleniyor? {#where-are-the-reactions-listed}

Görüntüleyicide, değerleriyle birlikte oklar olarak gösterilir; bunları görünüm seçeneklerindeki **Mesnet tepkileri** açar (varsayılan olarak açıktır). Ayrıca **Sonuçlar → CSV olarak dışa aktar** ile indirilen dosyada ve **Kopyala** ile panoya alınan verilerde de bulunurlar. **Sonuçlar** sekmesi düğüm yer değiştirmelerini ve çubuk uç kuvvetlerini listeler. Bkz. [Sonuçlar ve diyagramlar](/tr/essentials/results).

## Dosyalar ve paylaşım {#files-sharing}

### Bir modeli nasıl paylaşırım? {#how-do-i-share-a-model}

**Modeli paylaş** düğmesine, ardından **Kopyala** düğmesine basın. Bağlantı modelin tamamını içerir; onu açan herkes düzenleyebileceği kendi kopyasını alır: canlı ortak çalışma yoktur. Bağlantının sizin diyagramlarınız ve etiketlerinizle açılması için **Gördüğümü göster** seçeneğini açın. Bkz. [Bağlantıyla paylaşma](/tr/essentials/import-export#share-a-link) ve dersler için [EduBeam ile öğretim](/tr/guide/teaching#in-lecture-notes-and-assignments).

### Bir modeli web siteme veya sunuma gömebilir miyim? {#can-i-embed-a-model-on-my-website-or-in-slides}

Evet. Paylaşım bağlantısına `&viewer=1` ekleyin ve bir `<iframe>` içine yerleştirin: bkz. [Görüntüleyici gömme](/tr/essentials/import-export#embed-a-read-only-viewer). Bir sayfada, slaytta ya da basılı notlarda durağan bir şekil için SVG dışa aktarın ya da şekli [@edubeam/plot](/tr/plot) ile koddan çizin.

### Görüntü veya tablo dışa aktarabilir miyim? {#can-i-export-images-or-tables}

Evet. **☰ → Görüntüyü dışa aktar** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) çizimi seçtiğiniz boyut veya ölçekte PNG ya da SVG olarak kaydeder. **Sonuçlar → CSV olarak dışa aktar** iki sonuç tablosunu da kaydeder; **Kopyala** ise bunları elektronik tabloya yapıştırmak üzere panoya alır. Bkz. [Görüntüyü dışa aktarma](/tr/essentials/import-export#export-an-image).

### Masaüstü EduBeam'in dosyalarını açabilir miyim? {#can-i-open-files-from-the-desktop-edubeam}

Evet. Masaüstü EduBeam 2.x–3.5'in kaydettiği oturumlar (`.xml`), tıpkı bir `project.json` gibi **☰ → Proje aç** ile ya da uygulamanın üzerine bırakılarak açılır. Değerleri kN, kPa ve m olarak okunur. Bkz. [Proje açma](/tr/essentials/import-export#open-a-project).

### Modelleri programla üretebilir miyim? {#can-i-generate-models-programmatically}

Evet, iki yolla:

- **Dosyayı yazın.** `project.json`, SI birimlerinde düz bir JSON dosyasıdır; herhangi bir dildeki bir betik onu yazabilir, EduBeam de onu **Proje aç** ile ya da sürükleyip bırakarak açar. Bkz. [proje dosyası biçimi](/tr/essentials/import-export#project-file-format).
- **Kodda çözün.** [@edubeam/fem](/tr/solver), EduBeam'in arkasındaki sonlu elemanlar çözücüsüdür ve bir JavaScript ve TypeScript kütüphanesi olarak kullanılabilir. Ardından [@edubeam/plot](/tr/plot) sonucu çizer, örneğin [üretilmiş bir föy](/tr/plot/exercises) olarak.

[Hızlı başlangıç](/tr/guide/quick-start) kirişi, SI birimlerinde:

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // mafsallı mesnet
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // kayıcı mesnet
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, aşağı yönlü

solver.solve()
beam.computeBendingMomentAt(lc, 3) // açıklık ortasında 54000 N·m
beam.computeLocalDefl(lc, 2).w[1] // açıklık ortasında 0.0502 m
```

## Destek {#support}

### Bir hatayı nasıl bildiririm veya yeni bir özelliği nasıl isterim? {#how-do-i-report-a-bug-or-request-a-feature}

[GitHub](https://github.com/janvorisek/edubeam/issues)'da bildirin ve sorunu gösteren bir paylaşım bağlantısı veya proje dosyası ekleyin. Özel sorularınız için [support@edubeam.app](mailto:support@edubeam.app) adresine yazın.
