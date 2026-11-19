---
description: "EduBeam'de kuvvet, moment, mesnet çökmesi, düzgün yayılı, trapez, tekil yük ve sıcaklık yüklemesi tanımlayın; z aşağı, moment saat yönünün tersine pozitiftir."
source: site
---

# Yükler

Yükler düğümlere veya eleman boyunca etkir. Hepsi **tek bir yükleme durumuna** aittir ve birlikte etkir; farklı senaryoları karşılaştırmak için her birini ayrı bir [proje dosyası veya paylaşım bağlantısı](/tr/essentials/import-export) olarak kaydedin.

| Yük | Etkidiği yer | Nereden eklenir |
| --- | --- | --- |
| [Kuvvet veya moment](#nodal-loads) | düğüm | *Yükler* sekmesi → **Düğüm yükü ekle** ya da düğüme tıklayın → **Yük ekle** |
| [Öngörülen yer değiştirme](#prescribed-displacements-support-settlements) (mesnet çökmesi) | mesnetli düğüm | aynı pencere ya da düğüme tıklayın → **Yer değiştirme tanımla** |
| [Düzgün yayılı yük](#uniformly-distributed-load), [trapez yük](#trapezoidal-load), [tekil yük](#concentrated-load) veya [sıcaklık yüklemesi](#temperature-load) | eleman | *Yükler* sekmesi → **Eleman yükü ekle** ya da elemana tıklayın → **Yük ekle** |

## İşaret kabulü {#sign-convention-in-one-line}

x ekseni **sağa**, z ekseni **aşağı** doğrudur; momentler **saat yönünün tersine** pozitiftir. Yani pozitif bir `Fz` veya `fz`, yerçekimi gibi aşağı doğru etkiyen bir yüktür; yukarı doğru bir yük ise negatiftir.

::model-figure{caption="Buradaki her yük pozitiftir: sağa doğru Fx = +10 kN, aşağı doğru Fz = +10 kN, saat yönünün tersine My = +10 kNm"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| Pozitif yön | Varsayılan eksenler (z aşağı) | [y yukarı eksenler](/tr/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Yatay kuvvet `Fx`, `fx` | sağa | sağa |
| Düşey kuvvet | `Fz`, `fz`: **aşağı** | `Fy`, `fy`: **yukarı** |
| Moment | `My`: saat yönünün tersine | `Mz`: saat yönünün tersine |
| Düşey mesnet çökmesi | `Dz`: aşağı | `Dy`: yukarı |

Elemanın **yerel eksenlerinde** verilen yükler (LCS işaretli) ise elemanı izler: yerel x ekseni elemanın başlangıç düğümünden bitiş düğümüne doğrudur, yerel z ekseni ise yerel x'in saat yönünde 90° döndürülmüş hâlidir ve eleman boyunca çizilen kesikli çizgiye doğru bakar. Bkz. [Eleman yönü](/tr/essentials/elements#element-direction). İç kuvvetler dahil işaret kabulünün tamamı [Koordinat sistemi ve işaret kabulü](/tr/elements/conventions#loads) sayfasındadır.

## Düğüm yükleri {#nodal-loads}

*Yükler* sekmesi → **Düğüm yükü ekle** ya da bir düğüme tıklayın → **Yük ekle**; **Kuvvet/Moment** seçeneği seçili kalsın. `Fx`, `Fz` kuvvetlerini (kN) ve `My` momentini (kNm) [yukarıdaki](#sign-convention-in-one-line) işaretlerle girin; önizleme, siz yazarken yükü çizer.

![Düğüm yükü ekle: önizleme, siz yazarken yükün yönünü gösterir](/screenshots/tr/loads-nodal.webp){.shot-md}

- Bileşenler **global** eksenlerdedir. Eksenleri döndürülmüş bir düğümde ([eğik mesnet](/tr/essentials/nodes-supports#inclined-skewed-supports)) pencereye bir **Global eksenler** / **Düğüm eksenleri** anahtarı eklenir. Düğüm eksenlerinde `Fx′` ve `Fz′` olarak gösterilen bileşenler düğümün kendi eksenleri boyunca etkir; açı sonradan değişirse eksenlerle birlikte döner. Anahtarı değiştirdiğinizde sayılar yeniden hesaplanır, yükün kendisi değişmez.
- Bir düğüme birden çok düğüm yükü etkiyebilir; bunlar toplanır.

### Öngörülen yer değiştirmeler (mesnet çökmeleri) {#prescribed-displacements-support-settlements}

Bir mesnedi belirli bir miktar kadar hareket ettirmek için aynı pencerede **Öngörülen yer değiştirme** seçeneğini seçin ya da mesnetli bir düğüme tıklayın → **Yer değiştirme tanımla**. `Dx`, `Dz` yer değiştirmelerini (sağa ve aşağı pozitif, [yer değiştirme biriminde](/tr/essentials/units-settings#units), varsayılan olarak m) ve `Ry` dönmesini (rad, saat yönünün tersine pozitif) girin.

- Yalnızca **tutulu** serbestlik derecelerine değer verilebilir: diğer alanlar soluk görünür ve mesnedi olmayan bir düğüme hiç mesnet çökmesi tanımlanamaz.
- Bir düğümde en fazla bir öngörülen yer değiştirme olabilir. Değiştirmek için ikincisini eklemek yerine mevcut olanı düzenleyin.
- Eğik bir mesnette alanların adı `Dx′` ve `Dz′` olur: mesnet çökmesi mesnedin kendi eksenleri boyunca etkir.

Mesnet çökmesinin iç kuvvet oluşturup oluşturmadığı yapıya bağlıdır. B mesnedinin aynı 10 mm'lik çökmesi, başka hiçbir yük olmadan:

::div{.shots}

:::model-figure{caption="Basit mesnetli kiriş: kiriş yalnızca döner; mesnet tepkisi yok, M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="B üzerinde sürekli kiriş: kiriş eğilir, B üzerinde M = 21,06 kNm"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

İzostatik bir yapı mesnedi direnç göstermeden izler. Sürekli kiriş ise eğilmek zorundadır: B mesnedi kirişi $\delta = 10\ \text{mm}$ kadar aşağı çeker; bu, 10 m açıklıklı basit mesnetli bir kirişin ortasına etkiyen tekil bir yük gibidir. $L = 5\ \text{m}$ ve örnekteki çeliğin $EI = 17\,548\ \text{kNm}^2$ değeriyle bu yük $P = 6EI\delta/L^3 = 8{,}423\ \text{kN}$ olur; bu aynı zamanda B'deki mesnet tepkisidir. Moment ise $M_B = PL/2 = 3EI\delta/L^2 = 21{,}06\ \text{kNm}$'dir. [Sürekli kiriş ve mesnet çökmesi](/tr/tutorials/continuous-beam) eğitimi, mesnet çökmesini yüklerle birlikte ele alır.

## Eleman yükleri {#element-loads}

*Yükler* sekmesi → **Eleman yükü ekle** ya da bir elemana tıklayın → **Yük ekle**. **Yük türü** listesinden türü seçin; önizleme, siz yazarken yükü eleman üzerinde gösterir. Kuvvetler kN, yayılı yükler kN/m cinsindendir; başka [birimler](/tr/essentials/units-settings#units) seçtiyseniz o birimlerle girersiniz.

![Eleman yükü ekle, düzgün yayılı yükle](/screenshots/tr/loads-udl.webp){.shot-md}

### Düzgün yayılı yük {#uniformly-distributed-load}

Elemanın tamamı boyunca birim boy başına sabit bir yük: `fx` ve `fz`. **LCS** işaretliyken (varsayılan) bileşenler elemanın yerel eksenleri boyunca, işaretsizken global eksenler boyunca etkir. Soldan sağa çizilmiş yatay bir elemanda ikisi aynıdır; eğik bir çubukta ise değildir:

| İstediğiniz | Girmeniz gereken |
| --- | --- |
| çubuğa **dik** bir yük (mertek üzerindeki rüzgâr) | LCS **işaretliyken** `fz` |
| çubuk boyunun metresi başına **düşey** bir yük (zati ağırlık) | LCS **işaretsizken** `fz` |
| yatay izdüşümün metresi başına **düşey** bir yük (kar) | doğrudan girilemez: çubuğun eğimi $\alpha$ olmak üzere $\cos\alpha$ ile çarpın ve düşey yük olarak girin |

Yatay izdüşümü 4 m, yüksekliği 3 m, boyu 5 m olan bir mertekte aynı 10 kN/m'lik yük:

::div{.shots}

:::model-figure{caption="LCS işaretsiz: düşey, toplam 50 kN; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="LCS işaretli: çubuğa dik; M = 31,25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

El hesabıyla: dik yükte $M = qL^2/8 = 10 \cdot 5^2/8 = 31{,}25\ \text{kNm}$; düşey yükte 50 kN, 4 m'lik açıklığa yayıldığında izdüşümde 12,5 kN/m eder, dolayısıyla $M = 12{,}5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Trapez yük {#trapezoidal-load}

Eleman boyunca doğrusal olarak değişen bir yük: **başlangıç** düğümünde `f1x`, `f1z`, **bitiş** düğümünde `f2x`, `f2z`. Üçgen yayılı yük için bir ucu sıfır yapın.

::model-figure{caption="0'dan 10 kN/m'ye üçgen yayılı yük: mesnet tepkileri 10 ve 20 kN, en büyük M = 23,09 kNm, 3,46 m'de"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

El hesabıyla: toplam yük $qL/2 = 30\ \text{kN}$, $2L/3$ noktasında etkir; dolayısıyla $R_A = 10\ \text{kN}$ ve $R_B = 20\ \text{kN}$ olur. Kesme kuvveti $x = L/\sqrt{3} = 3{,}46\ \text{m}$'de sıfırdır ve moment orada en büyüktür: $M = qL^2/(9\sqrt{3}) = 23{,}09\ \text{kNm}$.

Trapez yükler elemanın **yerel eksenleri** boyunca etkir (LCS kutusu kilitlidir). Soldan sağa çizilmiş yatay bir elemanda bu, global eksenlerle aynıdır; eğik bir elemanda ise `f1z` ve `f2z` çubuğa dik, `f1x` ve `f2x` çubuk boyuncadır.

Eğimi $\alpha$ olan bir çubuktaki değişken **düşey** yük de kesin olarak girilebilir: her uçta yükün iki yerel bileşenini girin, $f_z = q\cos\alpha$ ve eğim boyunca aşağı doğru $f_x = q\sin\alpha$; eleman başlangıç düğümünden yukarı doğru çıkıyorsa $f_x$ negatiftir. Yukarıdaki mertekte (yatay izdüşümü 4 m, yüksekliği 3 m, alt ucundan başlanarak çizilmiş) çubuk boyunun metresi başına 0'dan 10 kN/m'ye artan düşey bir yük `f1x` = `f1z` = 0, `f2x` = −6 ve `f2z` = 8 kN/m olarak girilir.

::model-figure{caption="Çubuk boyunun metresi başına 0'dan 10 kN/m'ye artan düşey yük, yerel bileşenleriyle girilmiş: mesnet tepkileri 8,333 ve 16,67 kN, en büyük M = 12,83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

El hesabıyla: 25 kN'luk bileşke, yatay açıklığın üçte ikisinde, 2,67 m'de etkir; dolayısıyla $R_B = 25 \cdot 2{,}667/4 = 16{,}67\ \text{kN}$ olur. 4 m'lik izdüşüm üzerinde yük 12,5 kN/m'ye yükselen bir üçgendir; bu yüzden yukarıdaki gibi $M = 12{,}5 \cdot 4^2/(9\sqrt{3}) = 12{,}83\ \text{kNm}$ bulunur.

### Tekil yük {#concentrated-load}

Eleman **boyunca** herhangi bir noktada, ek düğüm gerektirmeyen tekil bir `Fx`, `Fz` kuvveti veya `My` momenti. **Yükün başlangıç düğümüne uzaklığı**, yükün başlangıç düğümünden $a$ uzaklığıdır ($0 \le a \le L$). Alanın başlangıç değeri, eleman boyunun yarısının tam metreye aşağı yuvarlanmış hâlidir ve en fazla 5 m'dir (ABD birimlerinde tam fit, en fazla 15 ft); bu yüzden değeri yükünüzün gerçek konumuna göre girin. **LCS**, düzgün yayılı yükteki gibi çalışır.

::model-figure{caption="6 m'lik açıklıkta 2 m'de 20 kN: V, 13,33'ten −6,667 kN'a sıçrar; yükün altında M = 26,67 kNm"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

Kesme kuvveti diyagramı yükün olduğu yerde `Fz` kadar sıçrar, moment diyagramında ise orada bir kırılma oluşur: $R_A = 20 \cdot 4/6 = 13{,}33\ \text{kN}$, $M = 13{,}33 \cdot 2 = 26{,}67\ \text{kNm}$. Tekil bir `My` ise moment diyagramında sıçramaya yol açar.

### Sıcaklık yüklemesi {#temperature-load}

| Alan | Anlamı | Etkisi |
| --- | --- | --- |
| **ΔT<sub>c</sub>**, eksendeki sıcaklık değişimi | kesitin tamamında aynı değişim | $\alpha\,\Delta T_c\,L$ kadar uzama |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | alt liflerin değişimi eksi üst liflerin değişimi | $\alpha\,(\Delta T_b - \Delta T_t)/h$ eğriliği |

İkisi de gerilmesiz durumdan itibaren sıcaklık *değişimleridir*, varsayılan olarak °C cinsinden; 1 °C'lik değişim 1 K'dir. Sıcaklık yüklemeleri malzemenin **α** değerini ve kesitin **h yüksekliğini** kullanır. **Alt** lifler kesikli çizginin olduğu taraftadır. Pozitif bir ΔT<sub>b</sub> − ΔT<sub>t</sub> (altta daha sıcak) alt lifleri uzatır; böylece eleman, yerçekimi yükü altındaki bir kiriş gibi aşağı doğru sehim yapar.

İzostatik bir yapıda sıcaklık yalnızca yer değiştirme oluşturur. Şekil değiştirme engellendiğinde (ankastre uçlar, süreklilik, fazladan çubuklar) sıcaklık iç kuvvetlere dönüşür. Aynı 6 m'lik, 0,3 m yüksekliğindeki çelik kiriş, altı üstünden 20 K daha sıcak:

::div{.shots}

:::model-figure{caption="Basit mesnetli: açıklık ortasında 3,6 mm sehim yapar, M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="İki ucu ankastre: düz kalır, tüm boyunca M = −14,04 kNm"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

El hesabıyla: serbest eğrilik $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0{,}3 = 8 \times 10^{-4}\ \text{1/m}$'dir. Basit mesnetli kiriş bu eğriliği serbestçe alır ve $\kappa L^2/8 = 3{,}6\ \text{mm}$ sehim yapar. Uçlar ankastre olduğunda bu eğriliği sabit bir moment ortadan kaldırmalıdır: $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14{,}04\ \text{kNm}$. [Sonuçların elle kontrolü](/tr/guide/verification#temperature-gradient-on-a-simply-supported-beam) sayfası başka bir durumu adım adım çözer.

## Yükleri düzenleme ve silme {#editing-and-removing-loads}

| Amaç | Yapılacak |
| --- | --- |
| Değerleri hızlıca değiştirmek | Bileşenleri (ve LCS kutusunu) *Yükler* sekmesinde yerinde düzenleyin. |
| Düzenleme penceresini açmak | Görüntüleyicide yüke çift tıklayın ya da yüke tıklayın → **Yükü düzenle**. Yükler *Düğümler* ve *Elemanlar* tablolarında da gösterge olarak görünür; düzenlemek için birine tıklayın. |
| Silmek | Yükü seçip <kbd>Delete</kbd> tuşuna basın, yüke tıklayın → **Sil** ya da *Yükler* sekmesindeki ×'i kullanın. |

Yükler bağlı oldukları düğüme veya elemana aittir: düğümü veya elemanı silerseniz yükleri de silinir; düğümü veya elemanı yükleriyle birlikte seçip kopyalarsanız yükler de kopyalanır.

![Yükler sekmesi: her yük için bir satır, bileşenleri yerinde düzenlenebilir](/screenshots/tr/loads-table.webp)

## Desteklenmeyen özellikler {#what-is-not-available}

::div{.limits}
- **Tek yükleme durumu.** Yük kombinasyonu yoktur: her durumu ayrı bir dosya veya bağlantı olarak kaydedin.
- **Zati ağırlık yok.** Zati ağırlığı LCS işaretsiz bir düzgün yayılı yük olarak ekleyin: $f_z = \rho\,g\,A$, örneğin bir IPE 200 için $\approx 0{,}22\ \text{kN/m}$.
- **Trapez yükler yalnızca yerel eksenlerde.** Eğik bir çubuktaki değişken düşey yük için [yerel bileşenlerini](#trapezoidal-load) girin.
- **Kısmi yayılı yük yok.** Yayılı yük elemanın tamamını kaplar: yükün başladığı veya bittiği yere bir düğüm ekleyin.
::
