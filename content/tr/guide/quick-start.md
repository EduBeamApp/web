---
description: "On dakikada EduBeam'de basit mesnetli bir çelik kiriş modelleyin: malzeme, kesit, düğümler, mesnetler ve yük; sonra sonuçları okuyup elle kontrol edin."
source: site
---

# Hızlı başlangıç

Yaklaşık on dakikada basit mesnetli bir çelik kiriş kuracak, mesnet tepkilerini, kesme kuvvetini, eğilme momentini ve sehimi okuyacak ve her sayıyı elle kontrol edeceksiniz. EduBeam'i ikinci bir sekmede ya da bu sayfanın yanında açın ve adımları birlikte uygulayın.

::div{.actions}
[EduBeam'i açın ↗](https://run.edubeam.app/?lang=tr){target="_blank"} [Doğrudan elle kontrole geçin](#_8-check-by-hand)
::

## Problem {#the-problem}

6 m açıklıklı bir kiriş 1 düğümünde mafsallı mesnete, 2 düğümünde kayıcı mesnete oturuyor ve tüm uzunluğu boyunca 12 kN/m düzgün yayılı yük taşıyor. Kesit, çelik bir IPE 200 profilidir: $E = 210$ GPa, $G = 81$ GPa, $A = 28{,}48\ \text{cm}^2$ ve $I_y = 1943\ \text{cm}^4$. Bu dört değerin hepsi EduBeam'in kütüphanelerinde hazır; tablodan bir şey aramanız gerekmez.

::model-figure{caption="Kuracağınız kiriş: 1 düğümünden 2 düğümüne 6 m'lik açıklık, 12 kN/m yük altında"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: []
show: [nodeLabels, dimensions]
---
::

## Modeli kurun {#build-the-model}

::div{.steps}

### Boş bir modelle başlayın {#start-from-an-empty-model}

İlk ziyaretinizde bir karşılama penceresi nasıl başlamak istediğinizi sorar. **Birim sistemi** altında **SI (metrik)** seçin, **Koordinat sistemi** altında **x sağa, z aşağı** seçeneğini bırakın ve **Şimdilik geç** düğmesine basın. Ardından uygulama küçük bir örnek çerçeve gösterir.

1. Üst çubuktaki **Modeli temizle** düğmesine basın (telefonda bu düğme **☰** menüsündedir).
2. **Malzemeleri sil** ve **Kesitleri sil** kutularını işaretleyin ve **Onayla** düğmesine basın.

Tuval artık boştur ve iki kırmızı mesaj henüz malzeme ve kesit tanımlanmadığını bildirir. Sonraki adımlar bunu giderir. Hiçbir şey kaybolmaz: <kbd>Ctrl</kbd>+<kbd>Z</kbd> çerçeveyi geri getirir; çerçeve ayrıca **☰ → Son modeller** listesinde de saklanır.

### Birimleri kontrol edin {#_1-check-the-units}

Görüntüleyicinin sağ altındaki birim göstergesi, tüm alanların ve sonuçların kullandığı birimleri listeler. Bu sayfada SI birimleri (göstergede `m m² kN kNm MPa`) ve aşağı yönlü z ekseni kullanılır. Göstergede ft ve kip görüyorsanız ona tıklayın ve **Birim sistemi** olarak **SI (metrik)** seçin. Aynı yerde **Koordinat sistemi** **x sağa, z aşağı** olmalıdır: y yukarı seçildiğinde pozitif bir yük yukarı yönelir ve bu sayfadaki işaretler tutmaz.

![Izgara (G) ve yakalama (S) düğmeleri, artı imleci ve birim göstergesi](/screenshots/tr/ui-grid-units.webp){.shot-sm}

### Malzemeyi ve kesiti ekleyin {#_2-add-the-material-and-cross-section}

Her eleman için bir malzeme ve bir kesit gerekir; bu yüzden önce bunları kütüphanelerden ekleyin.

1. Alt paneldeki **Malzemeler** sekmesini açın ve **Malzeme kütüphanesi** düğmesine tıklayın.
2. **Çelik (S235)** satırındaki **+** düğmesine basın ($E = 210\,000$ MPa, $G = 81\,000$ MPa). Kütüphane başka seçimler için açık kalır; onu **İptal** ile kapatın.
3. **Kesitler** sekmesini açın ve **Kesit kütüphanesi** düğmesine tıklayın.
4. **IPE 200 (yaklaşık)** satırına inin, **+** düğmesine basın ve kütüphaneyi **İptal** ile kapatın.

İki kırmızı mesaj da kaybolur ve **Kesitler** sekmesinde IPE 200 listelenir:

![Kesitler sekmesindeki IPE 200: alan, Iy, yükseklik ve kayma düzeltme katsayısı](/screenshots/tr/a-qs-cross-sections.webp)

Değerleri kendiniz girmek isterseniz **Malzeme ekle** ve **Kesit ekle** düğmelerini kullanın. Burada 0,3933 olan kayma düzeltme katsayısı [elle kontrolde](#_8-check-by-hand) yeniden karşınıza çıkacak.

### Düğümleri ekleyin {#_3-add-the-nodes}

1. **Düğümler** sekmesini açın. Burada iki **Düğüm ekle** düğmesi vardır: **+** bir pencere açar, imleç simgeli olan ise düğümleri fareyle yerleştirir. **+ Düğüm ekle** düğmesine tıklayın.
2. **X koordinatı** ve **Z koordinatı** alanlarını `0` olarak bırakın ve **Düğüm ekle** düğmesine basın. Pencere kapanır ve `1` düğümü belirir.
3. Yeniden **+ Düğüm ekle** düğmesine tıklayın, **X koordinatı** alanına `6` girin ve **Düğüm ekle** düğmesine basın. Bu da `2` düğümü olur.

![Yeni düğüm ekle penceresi. Bu pencerede mesnetleri de hemen tanımlayabilirsiniz.](/screenshots/tr/qs-node.webp){.shot-md}

### Düğümleri bir elemanla birleştirin {#_4-connect-them-with-an-element}

**Elemanlar** sekmesini açın ve **+ Eleman ekle** düğmesine tıklayın. Pencere **Başlangıç düğümü** için `1`, **Bitiş düğümü** için `2` değerini ve malzemenizle kesitinizi kendiliğinden önerir. **Eleman ekle** düğmesine basın.

![Yeni eleman ekle: iki uç düğümü, her uçta isteğe bağlı bir mafsal, malzeme ve kesit](/screenshots/tr/a-qs-element.webp){.shot-md}

Düğümler arasında bir kiriş belirir. Onu ekrana sığdırmak için <kbd>F</kbd> tuşuna basın. Görüntüleyicinin sol üstündeki mavi **Mesnet gerekli** göstergesi neden henüz sonuç çıkmadığını belirtir.

### Mesnetleri ekleyin {#_5-add-the-supports}

**Düğümler** sekmesine dönün. Her satırda, **Tutulu serbestlik dereceleri** sütununun başında bir mesnet seçici bulunur.

- `1` düğümü: **Mafsallı mesnet** seçin; `Dx` ve `Dz` kutuları işaretlenir.
- `2` düğümü: **Kayıcı mesnet** seçin; yalnızca `Dz` kutusu işaretlenir.

![Düğümler tablosundaki mesnet seçici](/screenshots/tr/a-qs-support-picker.webp){.shot-lg}

**Mesnet gerekli** göstergesi kaybolur. Mesnetleri, görüntüleyicide bir düğüme tıklayıp **Düğüm mesnetleri** seçeneğiyle de tanımlayabilirsiniz. Tüm mesnet türleri [Düğümler ve mesnetler](/tr/essentials/nodes-supports#supports) sayfasında listelenmiştir.

### Yükü ekleyin {#_6-add-the-load}

1. **Yükler** sekmesini açın ve **Eleman yükü ekle** düğmesine tıklayın.
2. **Yük türü** olarak *Düzgün yayılı yük* ve **Eleman** olarak `1` kalsın.
3. **fz** alanına `12` girin, **fx** alanını `0` bırakın ve **Eleman yükü ekle** düğmesine basın.

![Pencere, yükün eleman üzerindeki önizlemesini gösterir](/screenshots/tr/a-qs-load.webp){.shot-md}

Pozitif `fz` +z yönünü, yani **aşağıyı** gösterir; dolayısıyla pozitif bir değer yerçekimi yönündeki bir yüktür. İşaretli **LCS** kutusu (yerel koordinat sistemi), yükün elemanın kendi eksenlerini izlediği anlamına gelir; soldan sağa çizilmiş yatay bir kirişte bu eksenler global eksenlerle aynıdır. Ayrıntılar için [Koordinat sistemi ve işaret kabulü](/tr/elements/conventions#loads) sayfasına bakın.

::

## Sonuçları okuyun {#_7-read-the-results}

Kiriş, yük girildiği anda çözülür ve her değişiklikten sonra yeniden çözülür: *Çöz* düğmesi yoktur. Görüntüleyicinin sağ üstündeki panel çizimleri açıp kapatır. **Deforme şekil**, **M<sub>y</sub>(x)** ve **Mesnet tepkileri** baştan açıktır. Kesme kuvvetini eklemek için **V<sub>z</sub>(x)** kutusunu işaretleyin.

![Görünüm seçenekleri, kesme kuvveti açık](/screenshots/tr/a-qs-display.webp){.shot-md}

Ekranınız artık bu şekille aynı görünmelidir. Eğilme momentiyle kesme kuvveti arasında geçiş yapın:

::model-figure{caption="Tamamlanmış kiriş: 36 kN'luk mesnet tepkileri ve açıklık ortasında 54 kNm"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: [M, V]
show: [nodeLabels]
---
::

| Çizim | Görmeniz gereken |
| --- | --- |
| **Mesnet tepkileri** | Her mesnette birer tane olmak üzere, yukarı yönlü **36 kN**'luk iki ok. |
| **V<sub>z</sub>(x)** | `1` düğümünde **+36 kN**'dan `2` düğümünde **−36 kN**'a inen ve açıklık ortasında sıfırdan geçen bir doğru. |
| **M<sub>y</sub>(x)** | En büyük değeri açıklık ortasında **54 kNm** olan, çekme tarafında, yani kirişin altında çizilmiş bir parabol. |
| **Deforme şekil** | Büyütülerek çizilmiş, simetrik bir sehim. |

Sayısal değerler için **Sonuçlar** sekmesini açın. **Düğüm sonuçları** her düğümün `Dx`, `Dz` yer değiştirmelerini ve `Ry` dönmesini, **Eleman sonuçları** ise her elemanın uç kuvvetlerini kendi eksenlerinde listeler. `1` düğümü $R_y = -2{,}6469 \cdot 10^{-2}$ rad döner, `2` düğümü de aynı miktarda ters yönde. Tüm tablolar ve işaretler [Sonuçlar ve diyagramlar](/tr/essentials/results) sayfasında açıklanır.

Diyagramlar çok büyük veya çok küçük görünüyorsa **Ayarlar → Görüntüleyici ayarları** altındaki **Sonuç ölçeği** değerini değiştirin.

## Elle kontrol edin {#_8-check-by-hand}

$q = 12$ kN/m ve $L = 6$ m ile ders kitabı formülleri şunları verir:

| Büyüklük | Formül | El hesabı | EduBeam |
| --- | --- | --- | --- |
| Mesnet tepkileri | $qL/2$ | 36 kN | 36 kN |
| En büyük kesme kuvveti | $qL/2$ | 36 kN | 36 kN |
| En büyük moment | $qL^2/8$ | 54 kNm | 54 kNm |
| Mesnet dönmesi | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Açıklık ortası sehimi | $w_b + w_s$ | 49,63 + 0,60 = 50,22 mm | 50,22 mm |

Sehim iki kısımdan oluşur ve çoğu ders kitabı yalnızca ilkini verir:

- **Eğilme:** $w_b = 5qL^4/(384EI) = 49{,}63$ mm; burada $E = 210$ GPa ve $I_y = 1943\ \text{cm}^4$ ile $EI = 4080$ kNm².
- **Kayma:** $w_s = qL^2/(8kGA) = 0{,}60$ mm; burada $k = 0{,}3933$, $G = 81$ GPa ve $A = 28{,}48\ \text{cm}^2$ ile $kGA \approx 90\,700$ kN.

Açıklık ortasında henüz düğüm yok; oradaki sehimi okumak için bir düğüm ekleyin:

1. **Düğümler** sekmesinde ikinci **Düğüm ekle** düğmesine, yani imleç simgeli olana tıklayın.
2. Kirişin üzerinde `x = 3` noktasına tıklayın; yakalama açıksa düğüm ızgaraya oturur. EduBeam düğümle ne yapılacağını sorar: **Yapıya bağla** düğmesine basın. Eleman, yüküyle birlikte `1a` ve `1b` olarak ikiye bölünür ve düğüm yerleştirme sona erer. **Düğümler** sekmesinde `3` düğümü X = `3` konumunda değilse oraya `3` yazın.
3. **Sonuçlar → Düğüm sonuçları** tablosunda `3` düğümü artık $D_z = 5{,}0224 \cdot 10^{-2}$ m, yani 50,22 mm gösterir.

![Bölmeden sonra düğüm sonuçları: 3 düğümü 50,22 mm aşağı iner](/screenshots/tr/a-qs-nodal-results.webp){.shot-lg}

Kirişi bölmek hiçbir sonucu değiştirmez, çünkü eleman bu yükler için kesin sonuç verir: sıklaştırılacak bir ağ yoktur.

::callout{type="details" title="Kayma düzeltme katsayısı neden önemli?"}
EduBeam, kayma şekil değiştirmesini hesaba katan Timoshenko kiriş elemanlarını kullanır. Kayma düzeltme katsayısı $k$ kaymayı taşıyan alanı ölçekler; böylece $kGA$ kayma rijitliği olur. Kütüphanedeki I kesitlerde $k$, gövdenin alandaki payıdır, yani $h t_w / A$: IPE 200 için $0{,}2 \cdot 0{,}0056 / 0{,}002848 = 0{,}3933$. Sehimin kayma kısmı $w_s = qL^2/(8kGA)$, $V/(kGA)$ ifadesinin mesnetten açıklık ortasına kadar integralidir.

Bu narin kirişte kayma kısmı 0,60 mm'dir, toplamın yaklaşık %1'i. Kısa ve yüksek bir kirişte bu pay çok daha büyüktür. **Kesitler** sekmesinde kayma düzeltme katsayısını çok büyük bir sayıya (örneğin `1e10`) ayarlayın; EduBeam yalnızca eğilmeden gelen 49,63 mm'yi verir. Teorisi [Kiriş elemanı](/tr/elements/beam) sayfasında anlatılır.
::

Başka elle kontrol örnekleri (konsol, iki ucu ankastre kiriş, kafes sistem, sıcaklık, mesnet çökmesi) [Sonuçların elle kontrolü](/tr/guide/verification) sayfasında.

## Deneyin {#_9-experiment}

Modeli değiştirin ve diyagramların nasıl değiştiğini izleyin. Her değişikliği tek başına deneyin ve bir sonrakine geçmeden önce <kbd>Ctrl</kbd>+<kbd>Z</kbd> ile geri alın. `3` düğümü, az önce eklediğiniz açıklık ortası düğümüdür.

- **`2` düğümünü** sağa **sürükleyin**. Moment $L^2$ ile, sehim $L^4$ ile büyür.
- Bu ucu ankastre yapmak için **`1` düğümünde `Ry` kutusunu işaretleyin**. Ankastre uçta negatif moment oluşur: ders kitabı formülüne göre $qL^2/8 = 54$ kNm, EduBeam'de 53,8 kNm. Hiperstatik bir kirişte kayma rijitliği iç kuvvetleri de değiştirir.
- Ortaya bir mesnet ekleyip iki açıklıklı bir sürekli kiriş elde etmek için **`3` düğümünde `Dz` kutusunu işaretleyin**. Orta mesnet üzerinde negatif moment oluşur: elle $q(L/2)^2/8 = 13{,}5$ kNm, aynı nedenle EduBeam'de 13,3 kNm.
- **`3` düğümünde `Dz` kutusunu ve** **Elemanlar** sekmesinde **`1a` elemanının *Uç mafsalları* sütunundaki ikinci kutuyu** (elemanın `3` düğümündeki ucu) işaretleyin. Kiriş, 3 m'lik iki basit kirişe dönüşür. Şimdi `3` düğümündeki `Dz` işaretini kaldırın: kiriş bir mekanizma olur ve EduBeam onun nasıl hareket edebileceğini gösterir.

Hiçbir şey kurmadan açıklığı ve yükü değiştirmek için aşağıdaki kaydırıcıları sürükleyin ve her sonucun açıklıkla nasıl büyüdüğünü görmek için sonuçlar arasında geçiş yapın.

::example-structure
::

## Kaydedin veya paylaşın {#_10-save-or-share}

- **Birine gönderin.** Üst çubukta **Modeli paylaş** düğmesine, ardından **Kopyala** düğmesine basın. Bağlantı modelin tamamını içerir; onu açan herkes düzenleyebileceği kendi kopyasını alır.
- **Dosya olarak saklayın.** **☰ → Projeyi kaydet** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) bir `project.json` dosyası indirir. Onu **☰ → Proje aç** (<kbd>Ctrl</kbd>+<kbd>O</kbd>) ile ya da uygulamanın üzerine sürükleyip bırakarak yeniden açın.
- **Çizimi bir rapora ekleyin.** **☰ → Görüntüyü dışa aktar** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) çizimi PNG veya SVG olarak kaydeder.

Model tarayıcınızda da saklanır, bu yüzden sayfayı yenilediğinizde kaybolmaz. Ayrıntılar [Dosyalar, bağlantılar ve dışa aktarma](/tr/essentials/import-export) sayfasındadır.

## Sırada ne var? {#where-next}

::card-grid{cols="2"}
:::card{title="Eğitimler" icon="lucide:graduation-cap" to="/tr/tutorials/inclined-beam"}
Eğik bir kirişten mesnet çökmesi olan bir sürekli kirişe kadar, adım adım kurulup elle kontrol edilen dört model.
:::
:::card{title="Örnekler" icon="lucide:library" to="/tr/examples/"}
Tek tıkla açılan hazır kirişler, çerçeveler ve kafes sistemler; alıştırmaları ve cevaplarıyla birlikte.
:::
:::card{title="Yükler" icon="lucide:arrow-down-to-line" to="/tr/essentials/loads"}
Trapez ve tekil yükler, sıcaklık yüklemesi, düğüm kuvvetleri ve mesnet çökmeleri.
:::
:::card{title="Klavye, fare ve dokunmatik" icon="lucide:keyboard" to="/tr/reference/shortcuts"}
Düğümleri ve elemanları doğrudan tuval üzerinde çizin, daha hızlı düzenleyin.
:::
::
