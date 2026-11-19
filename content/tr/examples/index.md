---
description: "Tek tıkla EduBeam'de açılan altı çözülmüş kiriş, çerçeve ve kafes sistem; her birinde alıştırmalar, dikkat edilecek noktalar ve el hesabı için cevaplar."
source: site
---

# Örnekler

Aşağıdaki her kart canlı, çözülmüş bir modeldir. Birine tıkladığınızda model, düzenlemeye hazır olarak [EduBeam]{.edubeam} uygulamasında açılır: bir düğümü sürükleyin, bir yükü değiştirin veya bir mafsalı işaretleyin ve diyagramların nasıl değiştiğini izleyin. Sayfanın devamındaki alıştırmalar her modeli kısa bir çalışmaya dönüştürür; el hesabınızı karşılaştırabileceğiniz cevaplar da verilmiştir.

::feature-structures
::

Aynı modeller uygulamada **☰ → Örnekler** altında da bulunur; [run.edubeam.app/?panel=examples&lang=tr](https://run.edubeam.app/?panel=examples&lang=tr){target="_blank"} bağlantısı bu galeriyi doğrudan açar.

::callout{type="info" title="Altı örnekte de aynı çubuk"}
Bütün örnekler aynı çelik çubuğu kullanır: $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (dolayısıyla $EI = 17\,548$ kNm²), $1\ \text{m}^2$ alan ve eksenel ile kayma şekil değiştirmelerini ihmal edilebilir kılacak kadar büyük bir kayma rijitliği. Bu yüzden narin kirişler için ders kitabı formülleri, uygulamanın gösterdiği her basamakta aynı sonucu verir. Kesit yüksekliği $1$ m'dir; bu yalnızca sıcaklık yüklemesinde önemlidir.
::

## Önerilen alıştırmalar {#suggested-exercises}

Önce cevabı elle bulun, sonra uygulamada kontrol edin: modeli yukarıdaki kartından ya da şeklinin altındaki **EduBeam'de aç** düğmesiyle açın. Bir model açmak, üzerinde çalıştığınız modelin yerini alır; <kbd>Ctrl</kbd>+<kbd>Z</kbd> ile kendi modelinize geri dönebilirsiniz. Modeliniz ayrıca **☰ → Son modeller** altında da saklanır.

### Hiperstatik kiriş {#exercise-indeterminate-beam}

3 m'lik bir kiriş; A'da ankastre, B'de kayıcı mesnetli, 10 kN/m yük altında.

::model-figure{caption="A'da ankastre, B'de kayıcı mesnet, 10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Mesnet tepkilerini ve ankastre uçtaki momenti kuvvet yöntemiyle ya da ankastrelik momentleri tablosuyla elle bulunuz.
2. Kirişi basit mesnetli yapmak için A'daki `Ry` işaretini kaldırınız. En büyük moment nasıl değişiyor?
3. A'daki `Ry` kutusunu yeniden, B'dekini de işaretleyerek kirişin iki ucunu ankastre yapınız.

**Dikkat edin:** moment diyagramının nerede işaret değiştirdiğine ve ankastre mesnedin yükün kayıcı mesnetten daha büyük bir kısmını nasıl taşıdığına.

::callout{type="details" title="Cevaplar"}
- Ankastre–kayıcı mesnetli: $R_A = 5qL/8 = 18{,}75$ kN, $R_B = 3qL/8 = 11{,}25$ kN, $M_A = qL^2/8 = 11{,}25$ kNm (negatif moment). En büyük pozitif moment $9qL^2/128 = 6{,}33$ kNm'dir ve kesme kuvvetinin sıfır olduğu, B'den 1,125 m uzaktaki kesitte oluşur.
- Basit mesnetli: açıklık ortasında $qL^2/8 = 11{,}25$ kNm; ankastre ucun daha önce taşıdığı değerle aynı.
- İki ucu ankastre: uçlarda $qL^2/12 = 7{,}5$ kNm negatif, açıklık ortasında $qL^2/24 = 3{,}75$ kNm pozitif moment.
::

### Konsol kiriş {#exercise-cantilever}

4 m'lik bir konsol; A'da ankastre, serbest ucu B'ye aşağı doğru 18 kN etkir.

::model-figure{caption="Konsol kiriş, serbest uçta 18 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Ankastre uçtaki momenti, uçtaki sehimi ve uçtaki dönmeyi bulunuz. Bunları **Sonuçlar → Düğüm sonuçları** altında B düğümünün değerleriyle karşılaştırınız.
2. **Kesitler** sekmesinde $I_y$'yi yarıya indiriniz. Ne değişiyor, ne değişmiyor?
3. Tekil yükü, toplamı yine 18 kN olan 4,5 kN/m'lik düzgün yayılı yükle değiştiriniz: **Yükler** sekmesinde düğüm yükünü silip **Eleman yükü ekle** düğmesine tıklayınız.

**Dikkat edin:** moment diyagramının biçimine: tekil yük altında doğru, düzgün yayılı yük altında parabol.

::callout{type="details" title="Cevaplar"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21{,}88$ mm, $\varphi_B = FL^2/(2EI) = 8{,}21$ mrad.
- $I_y$ yarıya inince sehim iki katına çıkar: 43,77 mm. Moment 72 kNm olarak kalır: konsol izostatiktir, bu yüzden iç kuvvetleri rijitliğe bağlı değildir.
- Düzgün yayılı yük: $M_A = qL^2/2 = 36$ kNm ve $w_B = qL^4/(8EI) = 8{,}21$ mm. Aynı toplam yük, momentin yarısını ve sehimin sekizde üçünü verir.
::

### Warren kafes kirişi {#exercise-pratt-truss}

9 m açıklıklı, 1,8 m yüksekliğinde bir kafes kiriş; üst başlıktaki E, F ve G düğüm noktalarının her birinde 8 kN. Eksenel kuvvetleri görmek için görünüm seçeneklerinde **N(x)** kutusunu işaretleyin. (Diyagonalleri dönüşümlü, dikmesiz bu düzen, ders kitaplarının çoğunda Warren kafes kirişi olarak adlandırılır.)

::model-figure{caption="A'dan G'ye düğüm noktaları, E, F ve G'de 8 kN"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. Mesnet tepkilerini, ardından düğüm noktası yöntemiyle A–E uç diyagonalindeki ve A–B alt başlığındaki kuvvetleri bulunuz.
2. Kesim (Ritter) yöntemiyle orta gözdeki üst başlık kuvvetini ve B–C alt başlık kuvvetini bulunuz.
3. Bu modeldeki düğüm noktaları rijittir. Mafsal düğümlü bir kafes sistem elde etmek için **Elemanlar** sekmesinde her çubuğun iki uç mafsalını da işaretleyiniz ve eksenel kuvvetleri karşılaştırınız.
4. B–F diyagonalini önce rijit düğümlerle, sonra mafsallarla siliniz. Kafes sistem hâlâ ayakta duruyor mu?

**Dikkat edin:** işaretlerin düzenine: üst başlık basınçta, alt başlık çekmede, diyagonaller ise bir çekmede, bir basınçta.

::callout{type="details" title="Cevaplar"}
- Mesnet tepkileri: A'da ve D'de 12 kN.
- Uç diyagonalleri: 15,62 kN basınç. A–B ve C–D alt başlıkları: 10,00 kN çekme.
- E–F ve F–G üst başlıkları: 13,33 kN basınç (B'ye göre moment: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$). B–C alt başlığı: 16,67 kN çekme (F'ye göre moment: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$). İç diyagonaller: 5,21 kN; E'den ve G'den alt başlığa inenler çekmede, F'ye çıkanlar basınçta.
- Rijit ve mafsallı düğümlerle bulunan eksenel kuvvetler arasındaki fark %0,1'in altındadır. Üçgenlerden oluşan bir kafes sistemde eğilme ihmal edilebilir düzeydedir; mafsal düğümlü modelin işe yaramasının nedeni budur.
- B–F olmadan rijit düğümlü kafes sistem, yaklaşık 3 kNm'lik eğilme momentleriyle çerçeve gibi çalışarak ayakta kalır. Mafsallarla ise bir çubuğu eksik kalır: mekanizmaya dönüşür ve EduBeam nasıl hareket edebileceğini gösterir.
::

### Üç açıklıklı sürekli kiriş {#exercise-three-span-continuous-beam}

Açıklıkları 5 + 6 + 5 m olan 16 m'lik bir kiriş: ilk açıklıkta 8 kN/m, C'de 20 kN, son açıklıkta 6 kN/m. Model açıldığında yalnızca A ve D mesnetlidir.

::model-figure{caption="Açıldığı hâliyle: yalnızca A ve D mesnetli"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Açıldığı hâliyle bu, 16 m'lik tek bir basit mesnetli kiriştir. Mesnet tepkilerini ve B ile C'deki momentleri bulunuz.
2. Dört mesnet üzerinde sürekli bir kiriş elde etmek için B'de ve C'de `Dz` kutusunu işaretleyiniz.
3. B ve C üzerindeki momentleri üç moment denklemiyle, ardından mesnet tepkilerini bulunuz.

**Dikkat edin:** iç mesnetlerin üzerinde oluşan negatif momentlere, bütün momentlerin ne kadar küçüldüğüne ve C mesnet olduktan sonra 20 kN'luk yüke ne olduğuna.

::callout{type="details" title="Cevaplar"}
- Basit mesnetli: $R_A = 44{,}69$ kN, $R_D = 45{,}31$ kN, $M_B = 123{,}4$ kNm ve $M_C = 151{,}6$ kNm; ikisi de pozitif moment.
- Sürekli kiriş, $M_A = M_D = 0$ ile:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  denklemlerinden $M_B = -9{,}766$ kNm ve $M_C = -5{,}859$ kNm (negatif moment) bulunur. C'deki 20 kN doğrudan mesnede gider ve hiçbir şeyi eğmez.
- Mesnet tepkileri: A 18,05 kN, B 22,60 kN, C 35,52 kN (20 kN dahil), D 13,83 kN. Toplamları 90 kN'luk yüke eşittir.

::model-figure{caption="Dört mesnet üzerinde sürekli kiriş"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### Portal çerçeve {#exercise-portal-frame}

6 m'lik iki kolon üzerinde 8 m'lik bir kiriş; A'da ankastre, D'de kayıcı mesnetli. Kirişte 10 kN/m yük vardır; üst köşe C'ye ise sola doğru 8 kN ve aşağı doğru 10 kN etkir.

::model-figure{caption="A'da ankastre, D'de kayıcı mesnet: kirişte 10 kN/m, C'de 8 kN ve 10 kN"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Çerçeve kaç derece hiperstatiktir?
2. A'yı mafsallı mesnet yapmak için A'daki `Ry` işaretini kaldırınız. Çerçeve artık izostatiktir: mesnet tepkilerini ve B ile C köşelerindeki momentleri elle bulunuz.
3. A'daki `Ry` kutusunu yeniden işaretleyiniz, ardından D'yi mafsallı mesnet yapmak için D'de `Dx` kutusunu işaretleyiniz. Deforme şekilde kirişin yanal ötelemesini izleyiniz.

**Dikkat edin:** çerçevenin üstü hangi yöne gidiyor? Açıldığı hâliyle çerçevede, 8 kN'luk yüke rağmen sağa gider. Neden?

::callout{type="details" title="Cevaplar"}
- Dört mesnet tepkisi (üçü ankastre mesnette, biri kayıcı mesnette) ve üç denge denklemi: bir derece hiperstatik. D de mafsallı mesnet olursa iki derece.
- A mafsallı: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN sağa doğru. B köşesindeki moment $8 \cdot 6 = 48$ kNm'dir. C'de moment sıfırdır: D'de yatay mesnet tepkisi olmadığından sağ kolon yalnızca 44 kN'luk eksenel kuvvet taşır.
- Açıldığı hâliyle üst kısım 9,5 mm sağa gider: yüklü kirişten gelen moment, ankastre kolonu 8 kN'luk yükten daha çok eğer. D mafsallı mesnet olunca D yatayda 4,9 kN taşır ve üst kısım 4,8 mm sola gider.
::

### Sıcaklık yüklemesi {#exercise-temperature-load}

8 m'lik basit mesnetli bir kiriş; ekseni boyunca $\Delta T_c = 20$ K ısıtılmış, alt yüzü üst yüzünden 10 K daha soğuk ($\Delta T_b - \Delta T_t = -10$ K).

::model-figure{caption="8 m'lik basit mesnetli kiriş, 20 K ısıtılmış, alt yüzü üst yüzünden 10 K daha soğuk"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. Sonuçlara bakmadan önce: sıcaklık hangi iç kuvvetleri oluşturur ve kiriş nasıl hareket eder?
2. Kirişin uzamasını engellemek için B'de `Dx` kutusunu işaretleyiniz.
3. İki uçta `Ry` kutusunu da işaretleyiniz.

**Dikkat edin:** deforme şekle ve **Sonuçlar → Düğüm sonuçları** altındaki sayılara: kiriş, siz onu tutana kadar hiçbir iç kuvvet oluşmadan hareket eder.

::callout{type="details" title="Cevaplar"}
- İzostatik bir kiriş serbestçe uzayıp eğilebilir, bu yüzden iç kuvvet oluşmaz. B, $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1{,}92$ mm dışarı kayar. Daha soğuk olan alt yüz kısalır; bu yüzden kiriş $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1{,}2 \cdot 10^{-4}$ 1/m eğrilikle yukarı doğru kavislenir: uçlar $\kappa L/2 = 0{,}48$ mrad döner, açıklık ortası $\kappa L^2/8 = 0{,}96$ mm yükselir.
- İki ucu x doğrultusunda tutulursa: $N = -EA\alpha\Delta T_c = -50\,400$ kN, basınç. Bu büyüklük, örnekteki 1 m²'lik temsilî alandan gelir; 28,48 cm² alanlı bir IPE 200'de kuvvet 143,5 kN olurdu.
- İki ucu ankastreyse: kirişin tüm boyunca sabit $EI\alpha(\Delta T_b - \Delta T_t)/h = 2{,}11$ kNm moment.
::

## Çözümlü eğitimler {#worked-tutorials}

Adım adım kurulan ve elle kontrol edilen daha kapsamlı modeller:

::card-grid{cols="2"}
:::card{title="Eğik kiriş" icon="lucide:move-diagonal" to="/tr/tutorials/inclined-beam"}
Kar yükü altında bir mertek: yatay izdüşümün metresi başına yükler, eğim boyunca normal ve kesme kuvvetleri, döndürülmüş bir kayıcı mesnet.
:::
:::card{title="Üç mafsallı çerçeve" icon="lucide:triangle" to="/tr/tutorials/three-hinged-frame"}
Ara mafsallı bir çerçevenin mesnet tepkileri ve N, V, M diyagramları.
:::
:::card{title="Düzlem kafes sistem" icon="lucide:git-fork" to="/tr/tutorials/truss"}
Düğüm noktası yöntemi, kesim (Ritter) yöntemi, sıfır kuvvetli çubuk ve virtüel iş ilkesiyle bir yer değiştirme.
:::
:::card{title="Sürekli kiriş ve mesnet çökmesi" icon="lucide:spline" to="/tr/tutorials/continuous-beam"}
Kuvvet yöntemiyle çözülen iki açıklıklı bir kiriş; ardından orta mesnedin 10 mm çökmesi.
:::
::

Kapalı form çözümlerle başka kontroller için [Sonuçların elle kontrolü](/tr/guide/verification) sayfasına bakın.

## Daha fazla soru {#more-problems}

[Alıştırmalar](/tr/practice) sayfası her istediğinizde yeni sayılarla yeni bir kiriş, çerçeve veya kafes sistem verir ve mesnet tepkilerinizi, en büyük momenti ya da çubuk kuvvetini anında kontrol eder. Bir sınıf için [sınav oluşturucu](/tr/exam), her öğrenciye ayrı bir grup olmak üzere cevap anahtarlı sınav kâğıtları yazdırır; [@edubeam/plot](/tr/guide/teaching#exercise-sheets-tests-and-slides-from-code) ise koddan föyler hazırlar.

## Örnek önerin {#contribute-an-example}

Derste işe yarayan iyi bir modeliniz mi var? Bağlantısını [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) üzerinden paylaşın; galeriye ekleyebiliriz.
