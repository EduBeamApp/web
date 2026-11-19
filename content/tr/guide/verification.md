---
description: "EduBeam'in ders kitabı formülleriyle kontrolü: kirişler, bir kafes sistem, sıcaklık, mesnet çökmesi ve Timoshenko kirişinin Euler–Bernoulli'den nerede ayrıldığı."
source: site
---

# Sonuçların elle kontrolü

Kabaca kendiniz bulamadığınız bir sayıya asla güvenmeyin. Bu sayfa ders kitaplarındaki klasik durumları elle çözer ve sonuçları, gösterilen her basamakta aynı değeri veren [EduBeam]{.edubeam} ile karşılaştırır. Tablolar, uygulamanın *Sonuçlar* sekmesi gibi beş anlamlı basamak verir; şekillerdeki etiketler dört basamağa yuvarlanmıştır. Her şekil tarayıcınızda canlı olarak çözülür. **EduBeam'de aç** düğmesi aynı modeli uygulamada açar; orada tabloları okuyabilir, bir değeri değiştirip ne olduğunu izleyebilirsiniz.

::div{.chips}
- [Basit mesnetli kiriş](#simply-supported-beam-uniform-load)
- [Konsol](#cantilever-tip-load)
- [İki ucu ankastre kiriş](#fixed–fixed-beam-uniform-load)
- [Ankastre–kayıcı mesnetli kiriş](#propped-cantilever-uniform-load)
- [İki çubuklu kafes sistem](#two-bar-truss)
- [Sıcaklık](#temperature-gradient-on-a-simply-supported-beam)
- [Mesnet çökmesi](#prescribed-displacement)
- [Kayma şekil değiştirmesi](#shear-deformation)
::

Baştan sona çözülmüş bütün yapılar için [üç mafsallı çerçeve](/tr/tutorials/three-hinged-frame) ve [düzlem kafes sistem](/tr/tutorials/truss) eğitimlerine bakın. Elle çözeceğiniz, cevaplarınız siz yazarken kontrol edilen yeni sorular için [Alıştırmalar](/tr/practice) sayfasını deneyin.

## Burada kullanılan kesit {#the-section-used-here}

Aksi belirtilmedikçe tüm durumlarda uygulamanın örneklerindeki çelik kiriş kullanılır: $E = 210$ GPa ve $I_y = 8356$ cm⁴ (IPE 300), dolayısıyla

$$
EI = 210 \times 10^9 \cdot 8{,}356 \times 10^{-5} = 17\,547{,}6\ \text{kNm}^2
$$

Alanı ($A = 1$ m²) ve kayma düzeltme katsayısı ($k = 10^{32}$) o kadar büyüktür ki eksenel ve kayma şekil değiştirmeleri ortadan kalkar; sonuçlar ders kitabınızdaki Euler–Bernoulli formüllerini tam olarak izler.

::callout{type="info" title="EduBeam'in kirişleri Timoshenko kirişleridir"}
Gerçek bir kesitte (örneğin kesit kütüphanesinden seçilen bir kesitte) çubuklarda kayma şekil değiştirmesi de oluşur. Sehimler bu durumda Euler–Bernoulli formüllerinin verdiğinden biraz daha büyük çıkar; hiperstatik bir yapıda iç kuvvetler de biraz değişir. Bu sayfanın sonundaki [Kayma şekil değiştirmesi](#shear-deformation) bölümü farkın ne kadar olduğunu ve kayma etkisini nasıl devre dışı bırakacağınızı gösterir.
::

*Sonuçlar* sekmesinde yer değiştirmeler ve dönmeler [global eksenleri](/tr/elements/conventions#global-axes) izler: pozitif D<sub>z</sub> aşağı, pozitif R<sub>y</sub> saat yönünün tersinedir. Birimi değiştirmediğiniz sürece (bkz. [Birimler ve ayarlar](/tr/essentials/units-settings)) yer değiştirmeler metre cinsindendir.

## Düzgün yayılı yüklü basit mesnetli kiriş {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m; A'da mafsallı mesnet, B'de kayıcı mesnet. Açıklık ortasındaki C düğümü oradaki sehimi okumanızı sağlar; bir çubuğu bir düğümde bölmek hiçbir sonucu değiştirmez.

::model-figure{caption="Basit mesnetli kiriş, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Büyüklük | Formül | Değer |
| --- | --- | --- |
| Mesnet tepkileri | $qL/2$ | 36 kN |
| Mesnetlerdeki kesme kuvveti | $\pm qL/2$ | A'da +36 kN, B'de −36 kN |
| Açıklık ortası momenti | $qL^2/8$ | 54 kNm |
| A'daki dönme | $qL^3/(24EI)$ | 0,0061547 rad, saat yönünde |
| C'deki sehim | $5qL^4/(384EI)$ | 11,540 mm, aşağı |

EduBeam aynı değerleri gösterir. *Sonuçlar* sekmesinde A düğümünde R<sub>y</sub> = −0,0061547 rad (negatif: saat yönünde), C düğümünde D<sub>z</sub> = 0,01154 m (pozitif: aşağı) okunur.

## Ucunda tekil yük bulunan konsol {#cantilever-tip-load}

$L = 4$ m; A'da ankastre, serbest uç B'de aşağı doğru $F = 18$ kN.

::model-figure{caption="Konsol, ucunda 18 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Büyüklük | Formül | Değer |
| --- | --- | --- |
| Düşey mesnet tepkisi | $F$ | 18 kN |
| Ankastrelik momenti | $FL$ | 72 kNm, negatif: M = −72 kNm |
| Uç dönmesi | $FL^2/(2EI)$ | 0,0082063 rad, saat yönünde |
| Uç sehimi | $FL^3/(3EI)$ | 21,883 mm, aşağı |

*Sonuçlar* sekmesinde B düğümünde R<sub>y</sub> = −0,0082063 rad ve D<sub>z</sub> = 0,021883 m okunur.

## Düzgün yayılı yüklü iki ucu ankastre kiriş {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, iki uç da ankastre. Bu kiriş hiperstatiktir, dolayısıyla çözüm rijitliğe bağlıdır; formüller, iki uç dönmesinin de sıfır olduğu uygunluk koşulundan gelir.

::model-figure{caption="İki ucu ankastre kiriş, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Büyüklük | Formül | Değer |
| --- | --- | --- |
| Mesnet tepkileri | $qL/2$ | 36 kN |
| Mesnet momentleri | $qL^2/12$ | 36 kNm, negatif: M = −36 kNm |
| Açıklık ortası momenti | $qL^2/24$ | 18 kNm, pozitif |
| C'deki sehim | $qL^4/(384EI)$ | 2,3080 mm, aşağı |

Uçları ankastre yapmak bütün moment diyagramını $qL^2/12$ kadar kaydırır: mesnetten açıklık ortasına toplam değişim, basit mesnetli kirişte olduğu gibi yine $qL^2/8 = 54$ kNm'dir. Bunu uygulamada görmek için basit mesnetli modelden başlayın ve iki mesneti de **Ankastre** olarak değiştirin.

## Düzgün yayılı yüklü, bir ucu ankastre diğer ucu kayıcı mesnetli kiriş {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m; A'da ankastre, B'de kayıcı mesnet.

::model-figure{caption="Ankastre–kayıcı mesnetli kiriş, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Büyüklük | Formül | Değer |
| --- | --- | --- |
| Ankastre uçtaki mesnet tepkisi | $5qL/8$ | 45 kN |
| Kayıcı mesnetteki tepki | $3qL/8$ | 27 kN |
| Ankastrelik momenti | $qL^2/8$ | 54 kNm, negatif: M = −54 kNm |
| En büyük pozitif moment | $9qL^2/128$ | 30,375 kNm |
| … $V = 0$ olduğu yerde | $x = 5L/8$ | A'dan 3,75 m |
| B'deki dönme | $qL^3/(48EI)$ | 0,0030773 rad, saat yönünün tersine |

EduBeam bir diyagramın her ekstremum değerini etiketler; böylece pozitif momentin tepe değeri oluştuğu yerde işaretlenir. Konumunu bulmak için kesme kuvvetinin sıfırdan geçtiği yeri okuyun: $V(x) = 45 - 12x = 0$ bağıntısından $x = 3{,}75$ m çıkar.

## İki çubuklu kafes sistem {#two-bar-truss}

A $(0, 0)$ ve B $(4, 0)$ noktalarındaki mafsallı mesnetlerden yükselen iki çubuk, 2 m yukarıdaki C $(2, -2)$ tepe noktasında birleşir. İki çubuğun da iki ucunda **uç mafsalı** vardır, dolayısıyla çubuklar yalnızca normal kuvvet taşır. C'ye aşağı doğru düşey $F = 20$ kN yük etkir.

::model-figure{caption="İki çubuklu kafes sistem, tepe noktasında 20 kN"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

Her çubuk 45° eğimlidir. Simetriden dolayı iki çubuk aynı kuvveti taşır; C düğümünün düşey dengesi:

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14{,}142\ \text{kN}
\end{aligned}
$$

İki çubuk da **basınç** altındadır. Her mesnet düşeyde 10 kN ve yatayda içeri doğru 10 kN alır: çubuklar mesnetleri birbirinden uzağa iter. **N (x)** diyagramı ve mesnet tepkileri de aynısını gösterir.

## Basit mesnetli kirişte sıcaklık farkı {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0{,}3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. Üst yüz 5 K ısınır, alt yüz 5 K soğur; dolayısıyla $\Delta T_b - \Delta T_t = -10$ K olur ve eksenin sıcaklığı değişmez ($\Delta T_c = 0$). Basit mesnetli bir kiriş serbestçe eğrilebilir, bu yüzden **hiç iç kuvvet oluşmaz**, yalnızca bir eğrilik oluşur:

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0{,}3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

Üst lifler uzar, alt lifler kısalır; kiriş **yukarı** doğru eğrilir:

::model-figure{caption="Üst taraf alttan 10 K daha sıcak: kiriş iç kuvvet oluşmadan 3,2 mm yukarı sehim yapar"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| Büyüklük | Formül | Değer |
| --- | --- | --- |
| C'deki sehim | $\kappa L^2/8$ | 3,2 mm, yukarı: D<sub>z</sub> = −0,0032 m |
| A'daki dönme | $\kappa L/2$ | 0,0016 rad, saat yönünün tersine |
| Eğilme momenti |  | 0 |

Düzgün bir $\Delta T_c$ değişimi kirişi yalnızca uzatırdı; kayıcı mesnet buna izin verdiği için o da kuvvet oluşturmaz.

Şimdi iki uçta da dönmeyi tutun (A'da **Ankastre**, B'de kirişin uzamasına hâlâ izin veren **Kayar ankastre** mesnet). Eğrilik engellenir ve yerine bütün açıklık boyunca sabit bir moment oluşur:

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547{,}6 \cdot (-4 \times 10^{-4}) = 7{,}019\ \text{kNm}
\end{aligned}
$$

Moment pozitiftir: üst lifler uzamak ister, ama uzamaları engellendiği için basınca girer.

::model-figure{caption="Aynı kiriş, iki uçta da dönme tutulu: sabit 7,019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

Sıcaklık yüklemesinin nasıl girileceği [Yükler](/tr/essentials/loads#temperature-load) sayfasında anlatılır; kesit yüksekliği $h$ ise [kesit](/tr/essentials/elements#cross-sections) özellikleri arasında girilir.

## Mesnet çökmesi {#prescribed-displacement}

[Bir ucu ankastre, diğer ucu kayıcı mesnetli kirişi](#propped-cantilever-uniform-load) yüksüz olarak ele alın ve B'deki kayıcı mesnet $w = 10$ mm çöksün. EduBeam'de bu, B düğümünde D<sub>z</sub> = 0,01 m değerinde bir **öngörülen yer değiştirme** olarak tanımlanır. Kayıcı mesnet bu çökmeyi izlemek için konsolun ucunu aşağı çekmek zorundadır ve bu da kirişi eğer:

::model-figure{caption="Ankastre–kayıcı mesnetli kiriş, B 10 mm çöker: kayıcı mesnet 2,437 kN ile aşağı çeker"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| Büyüklük | Formül | Değer |
| --- | --- | --- |
| Kayıcı mesnetteki kuvvet | $R = 3EIw/L^3$ | 2,4372 kN, aşağı çeker |
| Ankastrelik momenti | $RL$ | 14,623 kNm, negatif: M = −14,623 kNm |
| B'deki dönme | $3w/(2L)$ | 0,0025 rad, saat yönünde |

Bir yükün aksine, mesnet çökmesi yalnızca yapının ona direndiği yerde kuvvet oluşturur: burada kiriş ne kadar rijitse $R$ o kadar büyüktür. Basit mesnetli bir kiriş aynı çökmeyi hiç kuvvet oluşmadan rijit cisim gibi izlerdi.

12 kN/m yükü geri eklediğinizde sonuçlar süperpoze olur: ankastre uç artık $45 + 2{,}4372 = 47{,}437$ kN ve $54 + 14{,}623 = 68{,}623$ kNm, kayıcı mesnet ise $27 - 2{,}4372 = 24{,}563$ kN alır. Mesnet çökmesinin nasıl girileceği [Yükler](/tr/essentials/loads#prescribed-displacements-support-settlements) sayfasında anlatılır.

## Kayma şekil değiştirmesi {#shear-deformation}

EduBeam'in kiriş elemanları **Timoshenko** kirişleridir: eğilme sehimine ek olarak, kesitin kayma rijitliği $kGA$ ile belirlenen miktarda kaymadan da sehim yaparlar. Bunun neyi değiştirdiği yapıya bağlıdır:

- **İzostatik**: mesnet tepkileri ve iç kuvvetler yalnızca dengeden çıkar, dolayısıyla tam olarak aynı kalır. Yalnızca yer değiştirmeler büyür. Basit mesnetli kirişte ve konsolda kesit dönmeleri de aynı kalır; başka yerlerde, örneğin konsollu bir kirişin çıkma ucunda, onlar da biraz değişir.
- **Hiperstatik**: iç kuvvetler rijitliğe bağlıdır, dolayısıyla onlar da biraz değişir.

### Basit mesnetli bir kiriş {#shear-simply-supported}

Farkın ne kadar olduğunu [Hızlı başlangıç](/tr/guide/quick-start#_8-check-by-hand) kirişi gösterir. Bu, yukarıdaki basit mesnetli kirişin gerçek bir kesitle, kesit kütüphanesindeki **IPE 200 (yaklaşık)** ile kurulmuş hâlidir: $I_y = 1943$ cm⁴, $A = 28{,}48$ cm², kayma düzeltme katsayısı $k = 0{,}3933$ (gövdenin alandaki payı) ve $G = 81$ GPa. Dolayısıyla $EI = 4080{,}3$ kNm² ve $kGA = 90\,720$ kN.

| Büyüklük | Formül | Değer |
| --- | --- | --- |
| Uç dönmesi | $qL^3/(24EI)$ | 0,026469 rad |
| Açıklık ortası sehimi, eğilme | $5qL^4/(384EI)$ | 49,629 mm |
| Açıklık ortası sehimi, kayma | $qL^2/(8kGA)$ | 0,59524 mm |
| Açıklık ortası sehimi, toplam | toplam | 50,224 mm, EduBeam'in gösterdiği gibi |

Kayma kısmı toplamın %1,2'sidir. Uç dönmesi de mesnet tepkileri ve momentler gibi Euler–Bernoulli değerine eşittir.

### Bir konsol: kısa çubuklar {#shear-cantilever}

Ucunda $F$ tekil yükü bulunan bir konsolda uç, eğilmeden $FL^3/(3EI)$, kaymadan $FL/(kGA)$ kadar sehim yapar. Bunların oranı:

$$
\frac{\text{kayma}}{\text{eğilme}} = \frac{3EI}{kGA\,L^2}
$$

Aynı IPE 200 ile bu oran 4 m'lik bir konsolda %0,84, 1 m'lik bir konsolda ise %13,5'tir: kayma şekil değiştirmesi kısa ve yüksek çubuklarda önem kazanır.

### Ankastre–kayıcı mesnetli kiriş: kuvvetler değişir {#shear-propped-cantilever}

IPE 200'den yapılmış [bir ucu ankastre, diğer ucu kayıcı mesnetli kiriş](#propped-cantilever-uniform-load) hiperstatiktir ve kayıcı mesnet artık biraz daha fazla yük alır. $L = 6$ m için $\beta = 3EI/(kGA\,L^2) = 0{,}0037481$ ile kayıcı mesnetteki uygunluk koşulu şunu verir:

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27{,}034\ \text{kN}
$$

Bu değer, Euler–Bernoulli çözümündeki 27 kN'dan biraz büyüktür; ankastrelik momenti de 54 kNm'den $qL^2/2 - R_B L = 53{,}798$ kNm'ye düşer. Burada fark küçüktür, ama $\beta$ ile, yani kısa ve yüksek çubuklarda büyür.

### Euler–Bernoulli ile karşılaştırma {#shear-switch-off}

Euler–Bernoulli formülleriyle karşılaştırmak için kesitin **Kayma düzeltme katsayısı** değerini çok büyük bir sayıya, örneğin `1e10` yapın. Kayma kısmı ortadan kalkar ve bu sayfadaki her durum yeniden tutar. Eleman formülasyonu, teori kılavuzunun [Kiriş elemanı](/tr/elements/beam) sayfasında anlatılır.

## Kendi kontrolleriniz için ipuçları {#tips-for-your-own-checks}

- Görüntüleyicinin sağ altındaki **birim göstergesini** gözünüzün önünde tutun; uyuşmazlıkların çoğu birim hatasından kaynaklanır.
- Kesin sayıları diyagram etiketlerinden değil, **Sonuçlar** sekmesinden ve imleci üzerine getirince çıkan bilgi kutularından okuyun. **CSV olarak dışa aktar** veya **Kopyala** size mesnet tepkilerini de elektronik tabloya hazır biçimde verir. Bkz. [Sonuçlar ve diyagramlar](/tr/essentials/results#results-tab).
- `4 · 10¹` yerine `40` görmek için **Ayarlar** bölümünde **Sayı biçimi** seçeneğini *Otomatik* yapın.
- Doğrudan rijitlik yöntemini öğrenirken tek bir elemanı teori kılavuzundaki [Kiriş elemanı](/tr/elements/beam) sayfasıyla karşılaştırmak için **Rijitlik matrisi** penceresini kullanın.
- Kontrol ettiğiniz bir modeli bir arkadaşınıza ya da öğretim elemanınıza iletmek için **Modeli paylaş** düğmesini kullanın.
- Pek çok durumu aynı anda kontrol etmek ya da cevabı bilinen sorular üretmek için aynı çözücüyü koddan çalıştırın: [@edubeam/fem](/tr/solver), uygulamadaki her sayının arkasındaki kütüphanedir.
