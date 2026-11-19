---
description: "EduBeam'in işaret kabulleri: x sağa, z aşağı; pozitif yükler ve yer değiştirmeler, yerel eksenler, N, V, M, uç kuvvetleri, mesnet tepkileri, y yukarı seçeneği."
source: site
---

# Koordinat sistemi ve işaret kabulü

EduBeam'in gösterdiği her sayının bir işareti vardır. Bu sayfa koordinatlar, yükler, yer değiştirmeler, iç kuvvetler, çubuk uç kuvvetleri ve mesnet tepkileri için *pozitif* sözcüğünün ne anlama geldiğini açıklar; böylece uygulamayı kendi hesaplarınızla karşılaştırabilirsiniz. Yanlış görünen sonuçların çoğu, aslında işaret kabulünden kaynaklanır.

| Büyüklük | Pozitif yön |
| --- | --- |
| `x`, `Dx`, `Fx` | sağa |
| `z`, `Dz`, `Fz` | **aşağı** |
| `Ry`, `My` | ekranda saat yönünün tersine |
| $N$ | çekme |
| $V$ | çubuktan kesilen kısa bir parçayı saat yönünde döndürür |
| $M$ | pozitif moment: alt liflerde, yani kesikli çizginin olduğu tarafta çekme |
| Mesnet tepkileri | mesnedin yapıya uyguladığı kuvvet; işareti yükün işareti gibi alınır |

## Global eksenler {#global-axes}

Model x–z düzlemindedir:

- **x** yataydır, pozitif yönü **sağa** doğrudur.
- **z** düşeydir, pozitif yönü **aşağı** doğrudur.
- **y** ekrandan dışarı, size doğru bakar; böylece eksen takımı sağ el kuralına uyar. Dönmeler ve momentler y ekseni etrafında tanımlanır, bu yüzden **saat yönünün tersi pozitiftir**.

Tuvalin köşesindeki eksen göstergesi x eksenini kırmızı, z eksenini yeşil gösterir. z aşağı baktığı için, tabanı `Z = 0` noktasında duran 3 m'lik bir kolonun tepesindeki düğüm `Z = −3` olur. Eğik bir mesnedin açısı gibi açılar x'ten z'ye doğru, yani ekranda saat yönünde ölçülür.

y ekseninin yukarı bakmasını tercih ediyorsanız [görüntüleme kabulünü](#y-up-axes) değiştirin: model aynı kalır, yalnızca okuduğunuz ve girdiğiniz sayılar değişir.

## Serbestlik dereceleri {#degrees-of-freedom}

Her düğümün üç serbestlik derecesi vardır:

| Serbestlik derecesi | Anlamı | Pozitif yön | Birim |
| --- | --- | --- | --- |
| `Dx` | yatay yer değiştirme | sağa | m |
| `Dz` | düşey yer değiştirme | aşağı | m |
| `Ry` | dönme | saat yönünün tersine | rad |

Aynı işaretler [öngörülen yer değiştirmeler](/tr/essentials/loads#prescribed-displacements-support-settlements), *Düğüm sonuçları* tablosu ve imleci bir düğümün üzerine getirdiğinizde gösterilen değerler için de geçerlidir.

## Yükler {#loads}

Yükler pozitif eksenler yönünde pozitiftir. **Fx**, **Fz** ve **My** bir düğüm yükünün veya tekil yükün, **fx** ve **fz** düzgün yayılı yükün, **f₁x**, **f₂x**, **f₁z**, **f₂z** ise trapez yükün elemanın başındaki ve sonundaki bileşenleridir. **LCS** kutusu işaretliyse yük, elemanın yerel koordinat sisteminde verilir.

| Yük | Pozitif yön |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, sağa; **LCS** işaretliyse elemanın yerel x ekseni boyunca |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **aşağı**; **LCS** işaretliyse elemanın yerel z ekseni boyunca |
| `My` | saat yönünün tersine |
| `ΔTc` | çubuk ekseninin ısınması; çubuğu uzatır |
| `ΔTb − ΔTt` | alt liflerin üst liflerden daha sıcak olması |

Yani yer çekimi yükü **pozitif** bir `fz`, sol kolonu sağa doğru iten rüzgâr yükü de pozitif bir `fx` olur. Yayılı yük, global eksenlerde verilse ve çubuk eğik olsa bile her zaman çubuğun kendi boyunun metresi başına etkir. Her yük türünün nasıl girildiğini [Yükler](/tr/essentials/loads#element-loads) sayfası gösterir.

::model-figure{caption="Buradaki yüklerin hepsi pozitif: A–B üzerinde fz = 5 kN/m, B'de Fz = 10 kN, C'de My = 10 kNm, D'de Fx = 10 kN"}
---
nodes: { A: [0, 0], B: [3, 0], C: [4.5, 0], D: [6, 0] }
supports: { A: fixed }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 5 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
  - { node: D, fx: 10 }
results: []
reactions: false
show: [nodeLabels]
---
::

## Elemanın yerel eksenleri {#element-local-axes}

Her elemanın kendi eksenleri vardır:

- **yerel x**, elemanın başlangıç düğümünden bitiş düğümüne doğru uzanır;
- **yerel z**, yerel x'in **ekranda saat yönünde** 90° döndürülmüş hâlidir; global x'i global z'ye getiren dönüşle aynıdır. Başlangıç düğümünden bitiş düğümüne doğru yürürken yerel z sağınızda kalır.

| Elemanın çizildiği yön | Yerel z'nin baktığı yön |
| --- | --- |
| soldan sağa | aşağı: yerel ve global eksenler çakışır |
| sağdan sola | yukarı |
| aşağıdan yukarı | sağa |
| yukarıdan aşağı | sola |

Elemanın doğrultusu, global x'ten global z'ye doğru (ekranda saat yönünde) ölçülen $\theta$ açısıdır. [Dönüşüm matrisi](/tr/elements/beam#transformation-matrix), uç yer değiştirmelerini $\cos\theta$ ve $\sin\theta$ ile iki sistem arasında dönüştürür.

Görüntüleyicide her elemanın boyunca uzanan kesikli çizgi, elemanın yerel +z tarafını, yani **alt liflerini** gösterir. **LCS** işaretliyken girilen eleman yükleri, tekil yükün konumu ve çubuk uç kuvvetleri hep yerel eksenlere göredir. Bir elemanın yönünü ters çevirmek için *Elemanlar* tablosundaki **Düğüm sırasını ters çevir** düğmesini kullanın (bkz. [elemanın yönü](/tr/essentials/elements#element-direction)).

## İç kuvvetler {#internal-forces}

Bir çubuğu başlangıç düğümünden $x$ uzaklıkta kesin. Kesimden **önceki** parçanın, yani başlangıç düğümü tarafındaki parçanın, dış normali yerel +x yönüne bakan yüzünde iç kuvvetler yerel +x yönünde, yerel +z yönünde ve saat yönünün tersine olduklarında pozitiftir. Öteki yüzde ters yönde etkirler.

::element-sketch{mode="internal-forces" caption="Kısa bir çubuk parçasında pozitif N, V ve M: çekme, parçayı saat yönünde döndüren kesme kuvveti çifti, pozitif moment (kesikli çizgili alt liflerde çekme)"}
::

Sözle ifade edersek:

| Büyüklük | Pozitif olduğunda |
| --- | --- |
| $N$ | çekme |
| $V$ | çubuktan kesilen kısa bir parçayı saat yönünde döndürür: soldan sağa çizilmiş bir çubukta parçanın sol yüzünde yukarı, sağ yüzünde aşağı |
| $M$ | **pozitif moment**: alt liflerde, kesikli çizginin olduğu tarafta çekme |

$q_x$ ve $q_z$ yerel eksenlerdeki yayılı yük olmak üzere şu bağıntılar geçerlidir:

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

(Yerel eksenlerdeki) bir $F_x$, $F_z$ tekil kuvvetinde veya $M_y$ tekil momentinde iç kuvvetler $\Delta N = -F_x$, $\Delta V = -F_z$ ve $\Delta M = -M_y$ kadar sıçrar: yerel +z yönündeki bir kuvvet $V$'yi, saat yönünün tersine bir moment ise $M$'yi azaltır.

Bu yüzden yer çekimi yükü altındaki basit mesnetli bir kirişte moment pozitiftir; kesme kuvveti sol mesnette pozitif, sağ mesnette negatiftir. Aşağıdaki kiriş ayrıca kayıcı mesnetli ucundan çekildiği için normal kuvveti de pozitiftir.

::model-figure{caption="Basit mesnetli kiriş, 10 kN/m ve 20 kN'luk çekme: açıklık ortasında M = +45 kNm, sol mesnette V = +30 kN, sağ mesnette −30 kN, N = +20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
  - { node: B, fx: 20 }
results: [M, V, N]
---
::

Konsolda momentin işareti tersine döner: negatif moment oluşur, üst lifler çekmededir. Ekseni boyunca itilen konsol basınca çalışır.

::model-figure{caption="Konsol, uçta 10 kN'luk yük ve 15 kN'luk itme: ankastre uçta M = −40 kNm, V = +10 kN, N = −15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 10 }
  - { member: 1, px: -15, at: 4 }
results: [M, V, N]
---
::

Bir çerçevede her çubuğun alt tarafı onun yerel +z tarafıdır; bu yüzden bir kolonu hangi yönde çizdiğiniz, hangi yüzünün alt taraf olacağını belirler. Bu çerçeve A → B → C → D sırasıyla çizilmiştir; böylece her çubuğun yerel z ekseni içeri bakar: pozitif moment çerçevenin iç tarafında çekme, köşelerdeki negatif momentler ise dış tarafta çekme demektir.

::model-figure{caption="A → B → C → D sırasıyla çizilmiş portal çerçeve: üç çubuğun da yerel z ekseni çerçevenin içine bakar"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

Diyagramlar Avrupa'daki derslerin çoğunda olduğu gibi çizilir: $M$ çekme tarafına, pozitif $N$ ve $V$ ise kesikli çizginin karşı tarafına. **Ayarlar → Görüntüleyici ayarları → İç kuvvet diyagramları** altında $M$'yi basınç tarafına, $N$'yi veya $V$'yi kesikli tarafa çizdirebilirsiniz. Bu yalnızca çizimi değiştirir, değerleri asla: işareti diyagramın hangi tarafta olduğundan değil, etiketinden okuyun.

## Çubuk uç kuvvetleri (Eleman sonuçları tablosu) {#end-forces-element-results-table}

*Eleman sonuçları* tablosu her eleman için, elemanın **yerel** eksenlerinde altı **çubuk uç kuvveti** listeler:

::element-sketch{mode="end-forces" caption="Altı çubuk uç kuvveti, hepsi pozitif yönde çizilmiş: yerel x ve z boyunca ve saat yönünün tersine"}
::

| Sütun | Elemana etkidiği yer | Pozitif yön |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | başlangıç düğümü | yerel +x, yerel +z, saat yönünün tersine |
| `X21`, `Z21`, `M21` | bitiş düğümü | yerel +x, yerel +z, saat yönünün tersine |

Bunlar düğümlerin elemana uyguladığı kuvvetlerdir: elemanın rijitlik matrisi ile uç yer değiştirmelerinin çarpımı, artı iki ucu ankastre olsaydı eleman yüklerini dengede tutacak kuvvetler:

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

burada $\mathbf{d}_l$ elemanın yerel eksenlerdeki uç yer değiştirmeleri, $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ ise [eleman yüklerinin](/tr/elements/beam#element-loads) eşdeğer düğüm yükleridir.

Çubuk uç kuvvetleri $N$–$V$–$M$ kabulüne değil eksenlere uyar; bu yüzden başlangıç düğümünde işaretleri terstir:

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

Yukarıdaki basit mesnetli kiriş için: `X12 = −20 kN` ve `X21 = +20 kN` (çekme), `Z12 = Z21 = −30 kN` (iki mesnet de yukarı, yani −z yönünde iter) ve `M12 = M21 = 0`.

Her düğümde, orada birleşen elemanların global eksenlere dönüştürülmüş uç kuvvetlerinin toplamı, düğüm yükü ile mesnet tepkisinin toplamına eşittir. Böylece bir düğümün dengesini hızla kontrol edebilirsiniz.

## Mesnet tepkileri {#reactions}

Mesnet tepkisi, mesnedin **yapıya** uyguladığı kuvvet veya momenttir; tutulu her serbestlik derecesi için bir tane vardır. İşareti yükünki gibi alınır: +x yönünde, +z yönünde (aşağı) ve saat yönünün tersine pozitiftir. Bu yüzden yer çekimi yükü taşıyan bir mesnedin `Rz` değeri **negatiftir**.

Mesnet tepkileri global eksenlerde verilir; düğümün bir **Düğüm yerel eksen açısı** varsa (bir [eğik mesnet](/tr/essentials/nodes-supports#inclined-skewed-supports)) düğümün kendi eksenlerinde. Görüntüleyicide her mesnet tepkisi, mesnedin yapıyı ittiği yönü gösteren ve büyüklüğüyle etiketlenmiş bir oktur. Değerler işaretleriyle birlikte CSV dışa aktarımında `Rx`, `Rz` ve `My` olarak yer alır.

## Yukarı bakan y ekseni {#y-up-axes}

**Ayarlar → Dil ve bölge → Koordinat sistemi → x sağa, y yukarı** seçeneği, girdiğiniz ve okuduğunuz her şeyi ders kitaplarındaki sisteme geçirir: **x** sağa, **y** yukarı, **z** size doğru. Model, kaydedilen dosyalar ve çizimler tamamen aynı kalır; yalnızca sayılar ve harfler değişir:

| Büyüklük | x sağa, z aşağı (varsayılan) | x sağa, y yukarı |
| --- | --- | --- |
| Düşey koordinat | `Z` | `Y`, ters işaretli |
| Düşey yükler, yer değiştirmeler, mesnet tepkileri, çubuk uç kuvvetleri | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, ters işaretli |
| Dönmeler ve momentler | `Ry`, `My` | `Rz`, `Mz`, aynı işaretli (saat yönünün tersi pozitif) |
| Mesnet açısı | saat yönünde ölçülür | saat yönünün tersine ölçülür, ters işaretli |
| İç kuvvetler | $N$, $V$, $M$ | aynı, aynı işaretlerle, aynı biçimde çizilir |

Yani y ekseni yukarı bakarken yer çekimi yükü **negatif** bir `fy` olur ve 3 m'lik bir kolonun tepesi `Y = 3` noktasındadır.

## Birimler {#units}

Çözücü baştan sona SI birimleriyle çalışır: m, N, Pa, rad ve sıcaklık değişimleri için K. [Birimler ve ayarlar](/tr/essentials/units-settings) sayfasındaki görüntüleme birimleri yalnızca girdiğiniz ve okuduğunuz değerleri değiştirir, modeli asla.
