---
description: "Eğitim: EduBeam'de eğik bir çatı merteği modelleyin, yatay izdüşüme göre verilen yükü girin, N ve V'yi okuyun, kayıcı mesnedi döndürün. Yaklaşık 15 dakika."
source: site
---

# Eğitim: eğik kiriş

Kar yükü altındaki bir çatı merteğini modelleyin, eğimi boyunca normal ve kesme kuvvetlerini okuyun ve bunları elle kontrol edin.

- **Süre:** yaklaşık 15 dakika. Dört eğitimin ilki ve en kısası budur.
- **Gerekenler:** ikinci bir tarayıcı sekmesinde açık EduBeam; fare ve klavyesi olan bir bilgisayar. EduBeam'i daha önce kullanmadıysanız önce [Hızlı başlangıç](/tr/guide/quick-start) sayfasını yapın: bu eğitimde kullanılan sekmeleri ve pencereleri orada tanırsınız.
- **Ön bilgi:** basit mesnetli bir kirişin dengesi ve bir kuvveti iki bileşene ayırmak.
- **Birimler:** SI. Görüntüleyicinin sağ altındaki birim göstergesinde `m m² kN kNm MPa` yazmalıdır. Fit ve kip görüyorsanız göstergeye tıklayın ve **Birim sistemi** olarak **SI (metrik)** seçin.

**Neler öğreneceksiniz**

- yatay izdüşümün metresi başına verilen bir yükü, EduBeam'in beklediği, eleman boyunca etkiyen yüke çevirmeyi,
- **LCS** (yerel koordinat sistemi) kutusuyla yayılı bir yükü düşey ya da elemana dik yönlendirmeyi,
- bir kayıcı mesnedi döndürmeyi ve bunun normal kuvveti değiştirdiğini, eğilme momentini ise değiştirmediğini görmeyi.

::div{.actions}
[EduBeam'i açın ↗](https://run.edubeam.app/?lang=tr){target="_blank"} [El hesabına geçin](#check-by-hand)
::

::model-figure{caption="Tamamlanmış mertek: yatay izdüşümün metresi başına 3 kN/m kar, eleman boyunca 2,4 kN/m olarak girildi; saçakta (1 düğümü) mafsallı mesnet, mahyada (2 düğümü) kayıcı mesnet"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Problem {#the-problem}

- (0, 0)'daki 1 düğümünden (4, −3)'teki 2 düğümüne yükselen düz bir mertek: planda 4 m, yükseklik 3 m; dolayısıyla uzunluğu $L = 5$ m, $\cos\alpha = 4/5$ ve $\sin\alpha = 3/5$.
- Saçakta, 1 düğümünde mafsallı mesnet. Mahyada, 2 düğümünde yatay doğrultuda kayan bir kayıcı mesnet; tepkisi bu yüzden düşeydir.
- Kar yükü $s = 3$ kN/m; yönetmeliklerin verdiği gibi **yatay izdüşümün metresi başına**.
- Çelik, $E = 210$ GPa ve bir IPE 300'ünki kadar $I_y = 8{,}356 \times 10^{-5}$ m⁴.

**Sistem izostatik mi?** Üç mesnet tepkisi ve üç denge denklemi var: evet. Kuvvetler yalnızca denge denklemlerinden bulunur; $E$ ve $I_y$ yalnızca sehimi etkiler.

## Modeli kurun {#model-it}

::div{.steps}

### Malzeme ve kesit {#material-and-section}

1. Üst araç çubuğunda **Modeli temizle** düğmesine tıklayın, **Malzemeleri sil** ve **Kesitleri sil** kutularını işaretleyin ve **Onayla** düğmesine tıklayın. Düğümler ve elemanlar yeniden 1'den başlayarak numaralanır.
2. **Malzemeler** sekmesi → **Malzeme kütüphanesi** → **Çelik (S235)** satırındaki **+**; ardından kütüphaneyi **İptal** ile kapatın.
3. **Kesitler** sekmesi → **Kesit ekle**. **Iy** için `8.356e-5` girin; **Alan**, **Yükseklik** ve **Kayma düzeltme katsayısı** değerlerini `1` olarak bırakın ve **Kesit ekle** düğmesine tıklayın.

1 m²'lik alan sayesinde eleman, el hesabının varsaydığı gibi, fark edilir ölçüde kısalmaz ve kayma şekil değiştirmesi yapmaz.

### Elemanı çizin {#draw-the-member}

1. **Elemanlar** sekmesi → ikinci **Eleman ekle** düğmesi, imleç simgeli olan.
2. Önce (0, 0), sonra (4, −3) noktasına tıklayın. Cetveller ve artı imleci nerede olduğunuzu gösterir; tıklamalar ızgaraya yakalanır.
3. Çizimi bitirmek için <kbd>Esc</kbd> tuşuna, ardından görünümü ekrana sığdırmak için <kbd>F</kbd> tuşuna basın.

z ekseni aşağı doğrudur; bu yüzden 1 düğümünden 3 m **yukarıdaki** 2 düğümü $z = -3$'tedir. İki düğümü de **Düğümler** tablosunda kontrol edin ve tutmayan koordinatların üzerine doğrusunu yazın.

### Mesnetler {#supports}

1 düğümüne tıklayın → **Düğüm mesnetleri** → **Mafsallı mesnet** simgesi. 2 düğümüne de aynı yolla **Kayıcı mesnet** verin.

### Yük {#load}

Mertekteki toplam kar yükü $3 \cdot 4 = 12$ kN'dur. EduBeam düzgün yayılı yükü elemanın **uzunluğu** boyunca dağıtır; aynı 12 kN 5 m'ye yayılınca

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0{,}8 = 2{,}4\ \text{kN/m}
$$

olur.

1. **Yükler** sekmesi → **Eleman yükü ekle**.
2. **Yük türü** *Düzgün yayılı yük*, **Eleman** `1`, `fz = 2.4`.
3. `fz` düşey etkisin diye **LCS işaretini kaldırın** ve **Eleman yükü ekle** düğmesine tıklayın.

::callout{type="warning" title="LCS varsayılan olarak işaretlidir"}
**LCS** işaretliyken `fz` elemanın yerel z ekseni boyunca, yani eğime dik etkir: bu kar değil, çatıdaki rüzgârdır. Yatay bir kirişte ikisi aynı şeydir; bu fark bu yüzden kolayca gözden kaçar. Yükün hangi yöne etkidiğini yük okları gösterir; ayrıntılar [Yükler](/tr/essentials/loads#uniformly-distributed-load) sayfasında.
::

::

## Sonuçlar {#results}

Yükü girer girmez kiriş çözülür. Görüntüleyicinin sağ üstündeki görünüm seçeneklerinde (dişli simgesi onları gösterir ve gizler) **Deforme şekil**, **M<sub>y</sub> (x)** ve **Mesnet tepkileri** baştan açıktır; **N (x)** ve **V<sub>z</sub> (x)** seçeneklerini de işaretleyin. En üstteki şeklin altındaki anahtar da aynı diyagramları gösterir.

EduBeam diyagramları ve mesnet tepkilerini kN ve kNm cinsinden, iki ondalık basamakla etiketler; şunları görmelisiniz:

- Her mesnette yukarı doğru `6,00`. Mafsallı mesnetin yatay tepkisi `0,00` gösterir: yatay bir kuvvet etkimez.
- Açıklık ortasında eğilme momentinin tepe değeri, `6,00` kNm.
- 1 düğümünde `4,80` kN, 2 düğümünde `-4,80` kesme kuvveti.
- 1 düğümünde `-3,60` kN (basınç), 2 düğümünde `3,60` (çekme) normal kuvvet; açıklık ortasında sıfırdan geçer.

## Elle kontrol edin {#check-by-hand}

**Mesnet tepkileri.** 12 kN'luk bileşke, planda 1 düğümünden 2 m uzakta etkir; dolayısıyla uçlardan herhangi birine göre moment alınca $V_1 = V_2 = 6$ kN bulunur. Yatay kuvvet olmadığından $H_1 = 0$.

**Eğilme momenti.** Düşey kuvvetlerde yalnızca yatay moment kolları önemlidir. 1 düğümünden planda $x$ uzaklıkta

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

olur; bu, yatay izdüşümün metresi başına aynı yükü taşıyan $a = 4$ m açıklıklı yatay bir kirişin değerinin tıpatıp aynısıdır.

**Kesme ve normal kuvvet.** $x$'teki bir kesimin solundaki kuvvetlerin toplamı düşey bir $T(x) = V_1 - s\,x$ kuvvetidir. Bunu elemana dik ve eleman boyunca bileşenlerine ayırın:

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | 1 düğümü, $T = +6$ kN | Açıklık ortası, $T = 0$ | 2 düğümü, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0{,}8 = 4{,}8$ kN | 0 | −4,8 kN |
| $N$ | $-6 \cdot 0{,}6 = -3{,}6$ kN | 0 | +3,6 kN |
| $M$ | 0 | 6 kNm | 0 |

Hepsi EduBeam'deki gibi. 1 düğümündeki yukarı doğru tepki alt ucu eğim boyunca yukarı, elemanın içine doğru iter: basınç. 2 düğümündeki yukarı doğru tepki üst ucu eğim boyunca daha da yukarı, elemandan dışarı doğru çeker: çekme. İşaretler elemanın 1 düğümünden 2 düğümüne olan yönünü izler; bunu [Koordinat sistemi ve işaret kabulü](/tr/elements/conventions#internal-forces) sayfası açıklıyor.

## Deneyin {#experiment}

Her seferinde tek bir şeyi değiştirin, sonucu önce tahmin edin, sonra bakın. Her değişikliği <kbd>Ctrl</kbd>+<kbd>Z</kbd> ile geri alabilirsiniz.

**Kosinüsü unutun.** 2,4 yerine `fz = 3` girin. Bu, eğim boyunca metre başına 3 kN, toplamda 15 kN eder ve bütün sonuçlar %25 fazla çıkar: 7,5 kN'luk mesnet tepkileri ve 7,5 kNm. 30° eğimli bir çatıda hata %15, 45° eğimli bir çatıda %41 olurdu.

**LCS işaretli kalsın.** 2,4 kN/m'lik yükte **LCS** kutusunu işaretleyin. Yük artık rüzgâr gibi eğime dik iter; 7,2 kN'luk yatay bileşenini yalnızca mafsallı mesnet karşılayabilir. Moment $2{,}4 \cdot 5^2/8 = 7{,}5$ kNm'ye çıkar ve normal kuvvet 4,5 kN'luk sabit bir çekmeye dönüşür.

::model-figure{caption="LCS işaretliyken aynı 2,4 kN/m: yük eğime dik, bu yüzden mafsallı mesnet yatayda 7,2 kN alır"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Kayıcı mesnedi döndürün.** **LCS** işaretini yeniden kaldırın ve yalnızca 2 düğümündeki kayıcı mesnedin kayma yönünü değiştirin. 2 düğümüne tıklayın → **Düğüm mesnetleri**, **Düğüm yerel eksen açısı** alanına `-36.87` yazın ve <kbd>Enter</kbd> tuşuna basın (ya da değeri **Düğümler** tablosunda o düğümün satırındaki **α** alanına yazın).

![2 düğümünün Düğüm mesnetleri menüsü: mesnet simgeleri, tutulu doğrultular ve Düğüm yerel eksen açısı](/screenshots/tr/p2t-node-supports-angle.webp){.shot-md}

Açı, düğümün kendi eksenlerini döndürür. Varsayılan eksenlerde (x sağa, z aşağı) negatif bir açı onları ekranda saat yönünün tersine döndürür. Ayrıntılar [Eğik mesnetler](/tr/essentials/nodes-supports#inclined-skewed-supports) bölümünde.

Kayıcı mesnet artık eğim boyunca kayar; bu yüzden tepkisi elemana diktir ve 1 düğümüne göre moment alınca $12 \cdot 2 / 5 = 4{,}8$ kN bulunur. Geri kalanını, onunla birlikte de normal kuvvetin tamamını mafsallı mesnet alır: 1 düğümünde −7,2 kN, 2 düğümünde sıfır.

::model-figure{caption="Eğim boyunca kayması için 2 düğümündeki kayıcı mesnet −36,87° döndürüldü: normal kuvvet −7,2 kN'dan sıfıra iner"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Düşey kayıcı mesnet yapın.** Açıyı yeniden 0 yapın ve 2 düğümü için **Düşey kayıcı mesnet** seçin. Bu mesnet düşey doğrultuda kayar, dolayısıyla yalnızca yatay doğrultuda itebilir: 1 düğümüne göre moment denklemi $H_2 \cdot 3 = 12 \cdot 2$'den 8 kN bulunur; mafsallı mesnet de merteği bu itkiye karşı tutar. Elemanın tamamı basınç altındadır.

::model-figure{caption="2 düğümünde düşey kayıcı mesnet: 8 kN'luk yatay itki ve tamamı basınç altındaki mertek"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

Üç kayıcı mesnet yan yana:

| 2 düğümündeki kayıcı mesnet | 2 düğümündeki tepki | 1 düğümündeki tepki | 1 düğümünden 2'ye $N$ |
| --- | --- | --- | --- |
| Yatay | 6 kN ↑ | 6 kN ↑ | −3,6'dan +3,6 kN'a |
| Eğim boyunca | 4,8 kN, elemana ⊥ | 2,88 kN →, 8,16 kN ↑ | −7,2'den 0 kN'a |
| Düşey | 8 kN ← | 8 kN →, 12 kN ↑ | −13,6'dan −6,4 kN'a |

**Eğilme momenti hiç değişmez**, kesme kuvveti de: üç durumda da 6 kNm ve ±4,8 kN. 1 düğümü, 2 düğümü ve her kesim noktası tek bir doğru, elemanın ekseni üzerindedir. 2 düğümündeki tepkinin bu doğru boyunca etkiyen bileşeninin bu noktaların hiçbirine göre momenti yoktur; bu yüzden yalnızca normal kuvvet ekler. Elemana dik bileşeni ise, kayıcı mesnet hangi yöne bakarsa baksın, 1 düğümüne göre moment dengesinden 4,8 kN olarak belirlenir. Kayıcı mesnedin yönü yalnızca itkinin nereye gittiğini belirler; bu da onu karşılamak zorunda olan duvar ya da merdiven sahanlığı için önemlidir.

## Sonraki adımlar {#next-steps}

::card-grid{cols="2"}
:::card{title="Alıştırma: konsollu kirişler" icon="lucide:dices" to="/tr/practice?p=O2048"}
Yayılı yük altındaki bir kirişin mesnet tepkileri ve en büyük momenti; cevaplarınız anında kontrol edilir. O2048 ile başlayın; daha fazlası için yalnızca **Konsollu kiriş** seçili kalsın ve **Yeni soru** düğmesine basın.
:::
:::card{title="Sonraki: üç mafsallı çerçeve" icon="lucide:triangle" to="/tr/tutorials/three-hinged-frame"}
Dört çubuk, bir ara mafsal ve yatay itki: hâlâ yalnızca denge denklemleriyle çözebileceğiniz bir çerçeve.
:::
::
