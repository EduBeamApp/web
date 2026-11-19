---
description: "Eğitim: EduBeam'de üç mafsallı bir çerçeve modelleyin; mesnet tepkilerini, yatay itkiyi, iç kuvvetleri ve mafsalın sehimini elle kontrol edin. Yaklaşık 15 dakika."
source: site
---

# Eğitim: üç mafsallı çerçeve

Açıklık ortasında mafsalı olan bir portal çerçeve modelleyin, mesnet tepkilerini ve diyagramlarını okuyun ve her sayıyı, mafsalın sehimine kadar, elle kontrol edin.

- **Süre:** yaklaşık 15 dakika.
- **Gerekenler:** ikinci bir tarayıcı sekmesinde açık EduBeam; fare ve klavyesi olan bir bilgisayar. EduBeam'i daha önce kullanmadıysanız önce [Hızlı başlangıç](/tr/guide/quick-start) sayfasını ya da [eğik kiriş](/tr/tutorials/inclined-beam) eğitimini yapın.
- **Ön bilgi:** bir çerçevenin dengesi ve serbest cisim diyagramları. İsteğe bağlı sehim kontrolü birim yük yöntemini (virtüel iş ilkesi) kullanır.
- **Birimler:** SI. Görüntüleyicinin sağ altındaki birim göstergesinde `m m² kN kNm MPa` yazmalıdır. Fit ve kip görüyorsanız göstergeye tıklayın ve **Birim sistemi** olarak **SI (metrik)** seçin.

**Neler öğreneceksiniz**

- bir çerçeveyi fareyle tek bir çoklu çizgi olarak çizmeyi,
- **Uç mafsalları** kutularıyla bir çubuğun içine mafsal yerleştirmeyi,
- yatay itkiyi mafsaldaki $M = 0$ koşulundan bulmayı ve farklı yönlerde çizilmiş çubuklarda $V$'nin işaretini okumayı.

::div{.actions}
[EduBeam'i açın ↗](https://run.edubeam.app/?lang=tr){target="_blank"} [El hesabına geçin](#_6-check-by-hand)
::

::model-figure{caption="Tamamlanmış çerçeve: kirişte 10 kN/m, 1 ve 5 düğümlerinde mafsallı mesnet, 3 düğümünde mafsal"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Problem {#the-problem}

- 4 m yüksekliğinde iki kolon; ayakları 1 ve 5 düğümlerinde mafsallı mesnetli, aralarındaki uzaklık 8 m.
- Üstte 2 düğümünden 4 düğümüne uzanan yatay bir kiriş; açıklık ortasında, 3 düğümünde bir mafsal var.
- Kirişin tamamında düzgün yayılı yük $q = 10$ kN/m.
- Çelik, $E = 210$ GPa; bütün çubuklarda $I_y = 8{,}356 \times 10^{-5}$ m⁴ (bir IPE 300).

| Düğüm | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | mafsallı mesnet |
| 2 | 0 | −4 | köşe |
| 3 | 4 | −4 | kirişteki mafsal |
| 4 | 8 | −4 | köşe |
| 5 | 8 | 0 | mafsallı mesnet |

z ekseni **aşağı** doğrudur; bu yüzden kolonların üst uçları $z = -4$'tedir.

**Sistem izostatik mi?** İki mafsallı mesnet dört mesnet tepkisi verir. Üç denge denklemiyle mafsaldaki $M_3 = 0$ koşulu dört denklem eder: evet.

## Modeli kurun {#model-it}

::div{.steps}

### Malzeme ve kesit {#_1-material-and-section}

1. Üst araç çubuğunda **Modeli temizle** düğmesine tıklayın, **Malzemeleri sil** ve **Kesitleri sil** kutularını işaretleyin ve **Onayla** düğmesine tıklayın. Düğümler ve elemanlar yeniden 1'den başlayarak numaralanır.
2. **Malzemeler** sekmesi → **Malzeme kütüphanesi** → **Çelik (S235)** satırındaki **+**; ardından kütüphaneyi **İptal** ile kapatın.
3. **Kesitler** sekmesi → **Kesit ekle**. **Iy** için `8.356e-5` girin; **Alan**, **Yükseklik** ve **Kayma düzeltme katsayısı** değerlerini `1` olarak bırakın ve **Kesit ekle** düğmesine tıklayın.

1 m²'lik alan sayesinde çubuklar fark edilir ölçüde kısalmaz ve kayma şekil değiştirmesi yapmaz; sehimin el hesabı da bunu varsayar. İzostatik bir çerçevenin iç kuvvetleri ise $E$'ye, $A$'ya ve $I_y$'ye hiç bağlı değildir.

### Çerçeveyi çizin {#_2-draw-the-frame}

1. **Elemanlar** sekmesi → ikinci **Eleman ekle** düğmesi, imleç simgeli olan.
2. Sırasıyla (0, 0), (0, −4), (4, −4), (8, −4) ve (8, 0) noktalarına tıklayın. Her tıklama bir sonraki düğümü ekler ve onu bir öncekine bağlar; tıklamalar ızgaraya yakalanır.
3. Çizimi bitirmek için <kbd>Esc</kbd> tuşuna, ardından görünümü ekrana sığdırmak için <kbd>F</kbd> tuşuna basın.

Artık 1–5 düğümleri ve 1–4 elemanları var; buradaki şekillerde olduğu gibi çizim sıranıza göre numaralanmışlardır. **Düğümler** tablosunu yukarıdaki tabloyla karşılaştırın ve tutmayan koordinatların üzerine doğrusunu yazın.

### Mesnetler ve mafsal {#_3-supports-and-the-hinge}

1. 1 düğümüne tıklayın → **Düğüm mesnetleri** → **Mafsallı mesnet** simgesi. Aynısını 5 düğümü için yapın.
2. **Elemanlar** tablosunda 2 düğümünden 3 düğümüne giden 2 numaralı elemanı bulun ve **Uç mafsalları** kutularından ikincisini işaretleyin: bu, elemanın bitişindeki, yani 3 düğümündeki mafsaldır.

![Elemanlar tablosu: 2 numaralı elemanın bitiş mafsalı, 3 düğümünde, işaretli](/screenshots/tr/p2t-frame-elements-table.webp)

Tek mafsal yeterlidir. Bu durumda 3 düğümüne rijit olarak bağlı tek çubuk 3 numaralı elemandır; bu yüzden ona orada hiçbir moment aktarılamaz. 3 numaralı elemanın başlangıcını da işaretlemek hiçbir şeyi değiştirmez.

### Yük {#_4-load}

1. **Yükler** sekmesi → **Eleman yükü ekle**.
2. **Yük türü** *Düzgün yayılı yük*, **Eleman** `2`, `fz = 10`. **Eleman yükü ekle** düğmesine tıklayın.
3. Aynısını 3 numaralı eleman için tekrarlayın.

`fz` aşağı doğru pozitiftir. Kiriş yatay olduğundan **LCS** (yerel koordinat sistemi) kutusu burada fark yaratmaz.

::

## Sonuçlar {#_5-results}

Görüntüleyicinin sağ üstündeki görünüm seçeneklerinde (dişli simgesi onları gösterir ve gizler) **Deforme şekil**, **M<sub>y</sub> (x)** ve **Mesnet tepkileri** baştan açıktır. Diğer diyagramlar için **N (x)** ve **V<sub>z</sub> (x)** seçeneklerini işaretleyin ya da diyagramları tek tek görmek için bazılarının işaretini kaldırın. EduBeam bunları kN ve kNm cinsinden, iki ondalık basamakla etiketler.

- Her kolon ayağında yukarı doğru `40,00` ve içe doğru `20,00` görürsünüz.
- Eğilme momenti iki köşede de `-80,00` gösterir; sıfır olduğu mafsalda etiketi yoktur. EduBeam momenti çekme tarafına, burada çerçevenin dışına çizer.
- Normal kuvvet her yerde negatiftir: kolonlarda `-40,00`, kirişte `-20,00`. Dört çubuğun hepsi basınç altındadır.
- **Sonuçlar** sekmesi → **Düğüm sonuçları**: mafsal, yani 3 düğümü, $D_z$ = `4,2554 · 10⁻² m` kadar, yani 42,55 mm aşağı iner. Yukarıdaki şeklin $w(x)$ görünümünde mafsalda okunan değer de budur.

## Elle kontrol edin {#_6-check-by-hand}

**Düşey mesnet tepkileri.** Simetri nedeniyle her kolon ayağı 80 kN'un yarısını taşır:

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Yatay mesnet tepkileri.** Çerçeveyi mafsaldan kesin ve sol yarı için, momentin sıfır olduğu 3 düğümüne göre moment alın:

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

İki kolon ayağı da 20 kN'luk bir kuvvetle içe doğru iter. Birbirinden uzaklaşamayan mafsallı mesnetlerin sağladığı bu yatay itki olmasaydı çerçeve ayakta duramazdı: kolonlar iki yana açılır, mafsal da aşağı düşerdi.

| Büyüklük | Formül | El hesabı | EduBeam |
| --- | --- | --- | --- |
| Düşey mesnet tepkileri | $q \cdot 8/2$ | 40 kN | 40,00 |
| Yatay mesnet tepkileri | $M_3 = 0$ koşulundan | 20 kN | 20,00 |
| Köşe momentleri, 2 ve 4 düğümleri | $H_1 \cdot 4$ | 80 kNm, dış lifler çekmede | −80,00 |
| Mafsaldaki moment, 3 düğümü | | 0 | etiket yok |
| Kolonlarda $N$ | $-V_1$ | −40 kN | −40,00 |
| Kirişte $N$ | $-H_1$ | −20 kN | −20,00 |
| Kolonlarda $V$ | $\pm H_1$ | ±20 kN | −20,00; 20,00 |
| Kirişte 2, 3, 4 düğümlerinde $V$ | $V_1 - q\,x$ | 40; 0; −40 kN | 40,00; etiket yok; −40,00 |

İki kolon aynı kesme kuvvetini zıt işaretlerle taşır: 1 numaralı elemanda −20 kN, 4 numaralı elemanda +20 kN. Bunun nedeni, her elemanın yerel eksenlerinin o elemanın çizildiği yönü izlemesidir: 1 numaralı eleman yukarı, 4 numaralı eleman aşağı doğru çizildi. Kolonlardan birinin düğüm sırasını ters çevirirseniz işareti de değişir. Nedenini [Koordinat sistemi ve işaret kabulü](/tr/elements/conventions#internal-forces) sayfası açıklıyor.

Kirişte, $x$ 2 düğümünden ölçülmek üzere, $M(x) = -80 + 40x - 5x^2$ kNm'dir. Moment mafsalda sıfırdır ve hiçbir yerde pozitif değildir: kirişin tamamı negatif moment altındadır (üst lifler çekmede). Kesme kuvveti $V(x) = 40 - 10x$ tam mafsalda sıfır olur; momentin ekstremumu da bu yüzden oradadır.

::callout{type="details" title="Mafsalın sehimi, virtüel iş ilkesiyle"}
3 düğümüne aşağı doğru bir birim yük koyun. Bu yük $\bar V = \bar H = 1/2$ tepkilerini ve bir $\bar m$ momentini oluşturur: $\bar m$ kolon ayağında 0'dan köşede 2'ye çıkar, mafsalda yeniden 0'a iner ve gerçek moment $M$ gibi dış liflerde çekme oluşturur. $M \bar m$ çarpımını dört çubuk boyunca integre edin:

$$
\text{kolonlar: } 2\int_0^4 (20\,y)(0{,}5\,y)\,dy = 426{,}7
$$

$$
\text{kiriş: } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0{,}5x)\,dx = 320
$$

$EI = 210 \times 10^6 \cdot 8{,}356 \times 10^{-5} = 17\,548$ kNm² ile:

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746{,}7}{17\,548} = 0{,}04255\ \text{m}
$$

Bu, EduBeam'in `4,2554 · 10⁻²` m olarak verdiği 42,55 mm'dir. Son basamaktaki 4, 1 m²'lik alanın hâlâ izin verdiği çok küçük kısalma ve kayma şekil değiştirmesinden gelir; el hesabı bunları hesaba katmaz. IPE 300'ün gerçek alanı $A = 53{,}8$ cm² girilir ve kayma alanı olarak gövdesi alınırsa (kayma düzeltme katsayısı 0,40), çubuklar daha çok kısalır, kayma şekil değiştirmesi de artar; mafsal 43,7 mm, yani yaklaşık %3 daha fazla iner.
::

## Deneyin {#_7-experiment}

Her seferinde tek bir şeyi değiştirin, sonucu önce tahmin edin, sonra bakın. Her değişikliği <kbd>Ctrl</kbd>+<kbd>Z</kbd> ile geri alabilirsiniz.

**Mafsalın işaretini kaldırın.** Çerçeve bir derece hiperstatik olur. Yatay itki yarıya, 10 kN'a iner; köşe momentleri −40 kNm'ye düşer ve kiriş açıklık ortasında 40 kNm'lik pozitif moment taşır. 3 düğümü artık 42,55 mm yerine yalnızca 12,16 mm aşağı iner. Artık kesitler de önemlidir: kirişe kolonlardan daha rijit bir kesit verirseniz köşe momentleri büyür.

::model-figure{caption="Mafsal olmadan: daha küçük yatay itki, yarıya inen köşe momentleri ve açıklık ortasında pozitif moment"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], [2, 3], [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

**Kolon ayaklarını ankastre yapın.** 1 ve 5 düğümlerine **Ankastre** simgesini verin. Yatay itki 30 kN'a çıkar ve kolon ayaklarında 40 kNm'lik momentler oluşur (kolonlar çok az kısaldığı için EduBeam `39,99` gösterir); köşe momentleri ise 80 kNm'de kalır. Simetri nedeniyle mafsaldaki kesme kuvveti sıfırdır; dolayısıyla kirişin her yarısı yine köşesinden çıkan 4 m'lik bir konsol gibi çalışır: $q \cdot 4^2/2 = 80$ kNm.

**Yandan itin.** Mafsallı mesnetlere geri dönün ve 2 düğümüne `Fx = 10` kN büyüklüğünde bir düğüm yükü ekleyin. Mesnet tepkilerinin simetrisi bozulur: düşeyde 35 kN ve 45 kN, yatayda 15 kN ve 25 kN. Bunları aynı üç denge denklemi ve $M_3 = 0$ koşuluyla kontrol edin; 2 düğümündeki yükün 3 düğümüne göre moment kolu yoktur. Sol köşe momenti −60 kNm'ye iner ve kirişin sol yarısında artık küçük bir pozitif moment oluşur: mafsaldan 0,5 m uzakta 1,25 kNm.

::model-figure{caption="2 düğümünde 10 kN'luk yatay yük: sağ köşe artık 100 kNm alıyor"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
  - { node: 2, fx: 10 }
results: [M, N]
show: [nodeLabels]
---
::

**İkinci bir mafsal ekleyin.** 2 numaralı elemanın 2 düğümündeki başlangıç mafsalını da işaretleyin. Mafsallı mesnetli iki kolonun taşıdığı kirişte iki mafsal olunca sistem mekanizmaya dönüşür. EduBeam sonuç göstermez, *Mafsallar yapının hareket etmesine izin veriyor (düğümler: 2, 3).* mesajını verir ve hareketi animasyonla gösterir.

## Sonraki adımlar {#next-steps}

::card-grid{cols="2"}
:::card{title="Alıştırma: üç mafsallı çerçeveler" icon="lucide:dices" to="/tr/practice?p=H2048"}
Aynı çerçeve, aralarında yatay bir yükün de bulunduğu yeni yüklemeler altında; cevaplarınız anında kontrol edilir. H2048 ile başlayın; daha fazlası için yalnızca **Üç mafsallı çerçeve** seçili kalsın ve **Yeni soru** düğmesine basın.
:::
:::card{title="Sonraki: düzlem kafes sistem" icon="lucide:git-fork" to="/tr/tutorials/truss"}
Dokuz mafsallı çubuk: düğüm noktası yöntemi, kesim yöntemi, sıfır kuvvetli çubuk ve virtüel iş ilkesiyle sehim.
:::
::
