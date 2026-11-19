---
description: "Eğitim: EduBeam'de iki açıklıklı sürekli kiriş modelleyin, basit kirişlerle karşılaştırın, orta mesnedi çöktürün, kuvvet yöntemiyle kontrol edin. Yaklaşık 25 dakika."
source: site
---

# Eğitim: sürekli kiriş ve mesnet çökmesi

İki açıklıklı sürekli bir kiriş modelleyin, onu iki basit kirişle karşılaştırın, sonra orta mesnedini 10 mm çöktürün. Bu kirişin mesnet tepkileri yalnızca denge denklemlerinden bulunamaz; bu yüzden onları kuvvet yöntemiyle kontrol edeceksiniz.

- **Süre:** yaklaşık 25 dakika. Dört eğitimin sonuncusu ve en kapsamlısı budur.
- **Gerekenler:** ikinci bir tarayıcı sekmesinde açık EduBeam; fare ve klavyesi olan bir bilgisayar. EduBeam'i daha önce kullanmadıysanız önce [Hızlı başlangıç](/tr/guide/quick-start) sayfasını ya da bundan önceki eğitimlerden birini yapın.
- **Ön bilgi:** tek hiperstatik bilinmeyenli kuvvet yöntemi ve basit kirişin açıklık ortası sehimleri: düzgün yayılı yük altında $5qL^4/(384EI)$, tekil yük altında $FL^3/(48EI)$.
- **Birimler:** SI. Görüntüleyicinin sağ altındaki birim göstergesinde `m m² kN kNm MPa` yazmalıdır. Fit ve kip görüyorsanız göstergeye tıklayın ve **Birim sistemi** olarak **SI (metrik)** seçin.

**Neler öğreneceksiniz**

- sürekliliğin ne kazandırdığını görmeyi: basit kirişlere göre daha küçük momentler ve sehimler,
- bir mesnet çökmesi tanımlamayı ve onun tek başına doğurduğu kuvvetleri okumayı,
- hiperstatik bir kirişi kuvvet yöntemiyle kontrol etmeyi ve daha rijit bir kirişin mesnet çökmesinden neden daha çok etkilendiğini görmeyi.

::div{.actions}
[EduBeam'i açın ↗](https://run.edubeam.app/?lang=tr){target="_blank"} [El hesabına geçin](#check-by-hand)
::

::model-figure{caption="Tamamlanmış kiriş: 10 kN/m altında 6 m'lik iki açıklık, mesnet çökmesinden önce"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels, dimensions]
---
::

## Problem {#the-problem}

- $L = 6$ m'lik iki açıklık: 1 düğümünde mafsallı mesnet, 2 ve 3 düğümlerinde kayıcı mesnet.
- İki açıklıkta da düzgün yayılı yük $q = 10$ kN/m.
- Çelik, $E = 210$ GPa ve $I_y = 8{,}356 \times 10^{-5}$ m⁴ (bir IPE 300); dolayısıyla $EI = 17\,547{,}6$ kNm².
- İkinci bölümde orta mesnet, yani 2 düğümü, $\Delta = 10$ mm çöker.

**Sistem izostatik mi?** Dört mesnet tepkisi (1 düğümünde iki, 2 ve 3 düğümlerinde birer) ve üç denge denklemi var: kiriş bir derece hiperstatiktir. Eksik denklem şekil değiştirmeden gelir: 2 düğümü ya hiç yer değiştirmez ya da tam $\Delta$ kadar yer değiştirir.

## Modeli kurun {#model-it}

::div{.steps}

### Malzeme ve kesit {#material-and-section}

1. Üst araç çubuğunda **Modeli temizle** düğmesine tıklayın, **Malzemeleri sil** ve **Kesitleri sil** kutularını işaretleyin ve **Onayla** düğmesine tıklayın. Düğümler ve elemanlar yeniden 1'den başlayarak numaralanır.
2. **Malzemeler** sekmesi → **Malzeme kütüphanesi** → **Çelik (S235)** satırındaki **+**; ardından kütüphaneyi **İptal** ile kapatın.
3. **Kesitler** sekmesi → **Kesit ekle**. **Iy** için `8.356e-5` girin; **Alan**, **Yükseklik** ve **Kayma düzeltme katsayısı** değerlerini `1` olarak bırakın ve **Kesit ekle** düğmesine tıklayın.

1 m²'lik alan sayesinde kirişte, el hesabının varsaydığı gibi, fark edilir bir kayma şekil değiştirmesi oluşmaz. Bu kez $I_y$ kuvvetleri de etkiler; nerede etkilediğini göreceksiniz.

### Kirişi çizin {#draw-the-beam}

1. **Elemanlar** sekmesi → ikinci **Eleman ekle** düğmesi, imleç simgeli olan.
2. (0, 0), (6, 0) ve (12, 0) noktalarına tıklayın.
3. Çizimi bitirmek için <kbd>Esc</kbd> tuşuna, ardından görünümü ekrana sığdırmak için <kbd>F</kbd> tuşuna basın.

Üç düğüm ve iki eleman oluşur. Koordinatları **Düğümler** tablosunda kontrol edin.

### Mesnetler {#supports}

1 düğümüne tıklayın → **Düğüm mesnetleri** → **Mafsallı mesnet** simgesi. 2 ve 3 düğümlerine **Kayıcı mesnet** verin.

### Yük {#load}

**Yükler** sekmesi → **Eleman yükü ekle** → **Eleman** `1` üzerinde *Düzgün yayılı yük*, `fz = 10` → **Eleman yükü ekle**. Aynısını 2 numaralı eleman için tekrarlayın.

::

## Sonuçlar {#results}

Eğilme momenti, mesnet tepkileri ve deforme şekil baştan açıktır. Kesme kuvveti için görüntüleyicinin sağ üstündeki görünüm seçeneklerinde (dişli simgesi onları gösterir ve gizler) **V<sub>z</sub> (x)** seçeneğini işaretleyin. EduBeam diyagramları ve mesnet tepkilerini kN ve kNm cinsinden, iki ondalık basamakla etiketler.

- Mesnet tepkileri 1 ve 3 düğümlerinde `22,50`, 2 düğümünde `75,00` gösterir: orta mesnet 120 kN'un yarısından fazlasını taşır.
- 2 düğümü üzerindeki moment `-45,00` gösterir, yani negatif momenttir. Açıklıklardaki pozitif moment en çok `25,31` kNm'ye ulaşır; bu en büyük değer uç mesnetlerden 2,25 m uzakta oluşur.
- Kesme kuvveti 2 düğümü üzerinde `-37,50` değerinden `37,50` değerine sıçrar.

### İki basit kirişle karşılaştırın {#compare-with-two-simple-spans}

Süreklilik ne kazandırır? Sürekliliği kesin: **Elemanlar** tablosunda 1 numaralı elemanın 2 düğümündeki **bitiş** mafsalını işaretleyin. Kiriş, 6 m'lik iki basit mesnetli kirişe, yani izostatik bir sisteme dönüşür.

::model-figure{caption="2 düğümü üzerinde mafsal: her birinde qL²/8 = 45 kNm olan iki basit kiriş"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [{ nodes: [1, 2], hinges: [false, true] }, [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

| | Sürekli kiriş | İki basit kiriş |
| --- | --- | --- |
| 1, 2, 3 düğümlerindeki mesnet tepkileri | 22,5; 75; 22,5 kN | 30; 60; 30 kN |
| 2 düğümü üzerindeki moment | −45 kNm | 0 |
| En büyük pozitif moment | 25,31 kNm | 45 kNm |
| En büyük sehim (şekillerin $w(x)$ görünümünde) | 4,000 mm | 9,617 mm |

En büyük moment aynıdır, 45 kNm; ama sürekli kirişte mesnedin üzerine geçer ve açıklıklardaki pozitif moment çok daha küçük kalır. Her açıklık ayrıca 2,4 kat daha rijittir: 2 düğümü üzerindeki ucu dönemez, neredeyse ankastre gibidir. Devam etmeden önce mafsalın işaretini yeniden kaldırın.

## Orta mesnedi çöktürün {#settle-the-middle-support}

Şimdi 2 düğümünü, yumuşak zemine oturan bir temelin yapabileceği gibi, 10 mm aşağı indirin.

::div{.steps}

### Mesnet çökmesini tanımlayın {#prescribe-the-settlement}

2 düğümüne tıklayın → **Yer değiştirme tanımla**. Açılan pencerede **Öngörülen yer değiştirme** zaten seçilidir; **Dz** için `0.01` girin ve **Düğüm yükü ekle** düğmesine tıklayın.

![Öngörülen yer değiştirme penceresi: yalnızca kayıcı mesnedin tuttuğu doğrultu, Dz girilebilir](/screenshots/tr/p2t-prescribe-displacement.webp){.shot-sm}

Varsayılan SI birimlerinde yer değiştirmeler metre cinsindendir; bu yüzden 10 mm `0.01` olarak girilir. Pozitif yön aşağıdır. Yalnızca tutulu doğrultulara değer verilebilir: kayıcı mesnet aşağı indirilebilir, ama yana kaydırılamaz. Ayrıntılar [Öngörülen yer değiştirmeler](/tr/essentials/loads#prescribed-displacements-support-settlements) bölümünde.

### Yeni sonuçları okuyun {#read-the-new-results}

Orta mesnet tepkisi `70,13` kN'a düşer, uç mesnet tepkileri `24,94` kN'a çıkar. 2 düğümü üzerindeki moment `-30,38` kNm'ye iner; açıklıklardaki pozitif moment ise büyür ve `31,09` kNm'ye ulaşır.

::model-figure{caption="2 düğümü 10 mm çöktü: üzerindeki negatif moment küçülür, açıklıklar daha fazlasını taşır"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

### Yalnızca mesnet çökmesine bakın {#look-at-the-settlement-alone}

İki eleman yükünü silin: her birini seçip <kbd>Delete</kbd> tuşuna basın ya da **Yükler** tablosunda satırındaki × simgesini kullanın. Geriye mesnet çökmesinin tek başına etkisi kalır: 2 düğümü üzerinde `14,62` kNm'lik üçgen biçimli, pozitif bir moment; 2 düğümünü `4,87` kN ile **aşağı** çeken, 1 ve 3 düğümlerini ise `2,44` kN ile yukarı iten mesnet tepkileri. Kiriş, çöken mesnedin dayattığı biçime eğilmeye direnir; kirişi zorlayan tek şey bu dirençtir.

::model-figure{caption="Yalnızca mesnet çökmesi: yük yok, yine de kiriş eğilir ve mesnetlerde tepki oluşur"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, w]
show: [nodeLabels]
---
::

Bu değerleri, çökme olmadan yalnızca yükün verdiği sonuçlara eklerseniz yük altındaki çökmüş kirişin sonuçlarını bulursunuz: 75 − 4,87 = 70,13 kN, −45 + 14,62 = −30,38 kNm. Analiz doğrusal olduğundan etkiler toplanabilir (süperpozisyon).

### Sürekliliği yeniden kesin {#cut-the-continuity-again}

Silinen yükleri <kbd>Ctrl</kbd>+<kbd>Z</kbd> ile (her yük için bir kez) geri getirin ve 1 numaralı elemanın bitiş mafsalını yeniden işaretleyin. Çöken açıklıklar artık yalnızca rijit olarak döner: mesnet tepkileri ve momentler, çökme ne olursa olsun, tam olarak iki basit kirişinkilerdir; yükler olmasaydı sıfır olurlardı. **Mesnet çökmesi yalnızca hiperstatik sistemlerde iç kuvvet doğurur.** Devam etmeden önce mafsalın işaretini kaldırın.

::

## Elle kontrol edin {#check-by-hand}

Kuvvet yöntemini kullanın. 2 düğümündeki mesnedi kaldırın ve yerine bilinmeyen tepkisini, $R_2$'yi koyun. İzostatik esas sistem $2L = 12$ m açıklıklı basit kiriştir; $R_2$ ona yukarı doğru etkir.

**Esas sistemin 2 düğümündeki sehimleri.** Yük altında ve 2 düğümüne yukarı doğru etkiyen birim kuvvet altında:

$$
\delta_q = \frac{5q\,(2L)^4}{384\,EI} = \frac{5 \cdot 10 \cdot 12^4}{384 \cdot 17\,547{,}6} = 0{,}15387\ \text{m}
$$

$$
\delta_{1} = \frac{(2L)^3}{48\,EI} = \frac{12^3}{48 \cdot 17\,547{,}6} = 0{,}0020516\ \text{m/kN}
$$

**Uygunluk koşulu.** $R_2$, 2 düğümünü mesnedin bulunduğu yere, yani sıfıra ya da $\Delta$ kadar aşağıya gelene dek yukarı itmelidir.

$$
R_2\,\delta_1 = \delta_q - \Delta \quad\Rightarrow\quad R_2 = \frac{\delta_q - \Delta}{\delta_1}
$$

**Geri kalan her şey** dengeden bulunur; en büyük pozitif moment, kesme kuvveti $R_1 - qx$'in sıfır olduğu yerdedir.

| | Formül | Çökme yok | 2 düğümü 10 mm çökmüş |
| --- | --- | --- | --- |
| $R_2$ | $(\delta_q - \Delta)/\delta_1$ | 75,00 kN | 70,13 kN |
| $R_1 = R_3$ | $(2qL - R_2)/2$ | 22,50 kN | 24,94 kN |
| $M_2$ | $R_1 L - qL^2/2$ | −45,00 kNm | −30,38 kNm |
| $M_{\max}$ | $R_1^2/(2q)$ | 25,31 kNm | 31,09 kNm |

EduBeam aynı değerleri son basamağına kadar gösterir.

Çökme olmadan bunlar ders kitaplarındaki $R_2 = 10qL/8$, $M_2 = -qL^2/8$ ve $M_{\max} = 9qL^2/128$ değerleridir. Mesnet çökmesi tek başına mesnet tepkilerini $\Delta/\delta_1 = 4{,}874$ kN, 2 düğümü üzerindeki momenti ise şu kadar değiştirir:

$$
\Delta M_2 = \frac{\Delta}{\delta_1} \cdot \frac{2L}{4} = \frac{3\,EI\,\Delta}{L^2} = \frac{3 \cdot 17\,547{,}6 \cdot 0{,}01}{36} = 14{,}62\ \text{kNm}
$$

Formüldeki $EI$ çarpımına dikkat edin. Yükün doğurduğu kuvvetler yalnızca çubukların birbirine *göre* ne kadar rijit olduğuna bağlıdır; zorlanmış bir yer değiştirmenin doğurduğu kuvvetler ise rijitliğin kendisiyle büyür. Çöken bir mesnedin üzerinde daha rijit bir kiriş daha büyük momentler çeker.

## Deneyin {#experiment}

Yük altındaki çökmüş kirişten başlayın; her seferinde tek bir şeyi değiştirin, sonucu önce tahmin edin, sonra bakın. Her değişikliği <kbd>Ctrl</kbd>+<kbd>Z</kbd> ile geri alabilirsiniz.

**Rijitliği iki katına çıkarın.** **Kesitler** tablosunda **Iy** değerini `1.6712e-4` yapın. Mesnet çökmesinin 2 düğümü üzerindeki momente etkisi iki katına, 29,25 kNm'ye çıkar ve $M_2$ −15,75 kNm'ye iner. Yalnızca yük altında sehimler dışında hiçbir şey değişmezdi; sehimler de yarıya inerdi.

**2 düğümünü serbest bırakan çökmeyi bulun.** Hangi $\Delta$ için 2 düğümü üzerindeki moment sıfır olur? $\Delta M_2 = 45$ kNm için $\Delta = 45 L^2/(3EI) = qL^4/(24EI) = 0{,}0308$ m gerekir. Çökmeyi **Yükler** tablosunda ya da görüntüleyicide üzerine çift tıklayarak `0.0308` olarak değiştirin: mesnet tepkileri, $\Delta$'nın yuvarlanmasından gelen küçük farkla, 30, 60 ve 30 kN olur; bunlar iki basit kirişin değerleridir. $qL^4/(24EI)$, basit bir açıklığın uç dönmesinin $L$ ile çarpımıdır: mesnet çökmesi her açıklığı, 2 düğümü üzerindeki dönme farkını kapatacak kadar döndürür; böylece sürekliliğe yapacak bir iş kalmaz.

**2 düğümünü bırakın.** Çökmeyi `0.1539` yapın; bu, 12 m'lik esas sistemin $\delta_q$ sehimidir. 2 düğümündeki tepki pratikte sıfıra iner ve kiriş yükü tek bir basit kiriş gibi taşır: açıklık ortasında 180 kNm. Bu kadar çöken bir mesnet artık mesnet değildir.

**Bu kez 2 düğümünü yukarı kaldırın.** Çökmeyi `-0.01` yapın, yani 10 mm yukarı. Mesnet çökmesinden gelen her değişikliğin işareti tersine döner: 2 düğümü artık 79,87 kN taşır ve negatif moment −59,62 kNm'ye büyür.

Kapalı form çözümlü başka kontrolleri, bir ucu ankastre, diğer ucu kayıcı mesnetli kirişte mesnet çökmesi örneğiyle birlikte, [Sonuçların elle kontrolü](/tr/guide/verification#prescribed-displacement) sayfasında bulabilirsiniz.

## Sonraki adımlar {#next-steps}

::card-grid{cols="2"}
:::card{title="Alıştırma: sürekli kirişler" icon="lucide:dices" to="/tr/practice?p=K2049"}
Bir ya da iki açıklığı yüklü, kuvvet yöntemiyle çözülen iki açıklıklı kirişler; cevaplarınız anında kontrol edilir. K2049 ile başlayın; daha fazlası için yalnızca **İki açıklıklı sürekli kiriş** seçin ve **Yeni soru** düğmesine basın.
:::
:::card{title="Örnek galerisi" icon="lucide:library" to="/tr/examples/"}
Bu son eğitimdi. Örnek galerisinde açıp değiştirebileceğiniz ve kontrol edebileceğiniz başka modeller, ödev olarak verilebilecek alıştırmalar da var.
:::
::
