---
description: "EduBeam'de kafes çubuğu: iki ucu mafsallı bir kiriş elemanı; bunun neden klasik kafes elemanıyla tam olarak aynı olduğu, rijitlik ve dönüşüm matrisleri."
source: site
---

# Kafes çubuğu

Kafes çubuğu yalnızca eksenel kuvvet taşır. EduBeam'de ayrı bir kafes elemanı yoktur: kafes çubuğu, **iki uç mafsalı da** işaretlenmiş bir [kiriş elemanıdır](/tr/elements/beam). Bu sayfa, bunun neden klasik iki düğümlü kafes elemanıyla tam olarak aynı olduğunu gösterir, rijitlik ve dönüşüm matrislerini verir ve mafsallı bir çubuğun ders kitabındaki kafes çubuğundan fazla neler yapabildiğini açıklar.

::model-figure{caption="Tüm çubukların iki ucu mafsallı: merteklerde N = −7,071 kN, çekme çubuğunda +5 kN; hiçbir çubuk eğilmiyor"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
results: [N]
show: [nodeLabels]
---
::

Uygulamada bir kafes sistem modellemek için her çubukta **Başlangıç mafsalı** ve **Bitiş mafsalı** kutularını işaretleyin ya da çubukları fareyle çizmeye başlamadan önce ikisini de üstteki şeritte işaretleyin ([uç mafsalları](/tr/essentials/elements#end-hinges)). [Düzlem kafes sistem eğitimi](/tr/tutorials/truss) adım adım bir kafes sistem kurar.

## Serbestlik dereceleri {#degrees-of-freedom}

Kafes çubuğu, [yerel eksenlerinde](/tr/elements/conventions#element-local-axes) her ucundaki iki ötelenmeyle çalışır:

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="Kafes çubuğu: iki ucu mafsallı, her ucunda iki ötelenme"}
::

| Doğrultu | Başlangıç düğümü (1) | Bitiş düğümü (2) |
| --- | --- | --- |
| yerel x boyunca | $u_1$ ve `X12` | $u_2$ ve `X21` |
| yerel z boyunca | $w_1$ ve `Z12` | $w_2$ ve `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

Her çubuk bir kiriş elemanı olduğu için düğümlerin `Ry` dönmesi yine vardır; ancak iki ucu mafsallı bir çubuk bu dönmeyi ne hisseder ne de aktarır: uç momentleri `M12` ve `M21` her zaman sıfırdır. Bütün çubukların mafsallı bağlandığı bir düğüm noktasında bu dönmeyi hiçbir şey tutmaz. Çözücü onu sıfır bırakır; ancak böyle bir düğüm noktasına uygulanan düğüm momentinin etkiyeceği bir şey yoktur ve çözüm *Yapı bir mekanizma: rijitlik matrisi tekil.* mesajıyla durur.

## Yerel rijitlik matrisi {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

burada $E$ elastisite modülü, $A$ kesit alanı, $L$ ise çubuğun boyudur. Şekil değiştirme enerjisi yalnızca çubuk uzayıp kısalınca oluşur; bu yüzden eleman yükü taşımayan bir çubuğun normal kuvveti sabittir:

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### İki mafsallı kiriş neden kafes çubuğudur {#why-a-beam-with-two-hinges-is-a-truss-bar}

Her [uç mafsalında](/tr/elements/beam#end-hinges) olduğu gibi, iki uç dönmesini de [kiriş rijitlik matrisinden](/tr/elements/beam#local-stiffness-matrix) yoğunlaştırarak çıkarın. Eksenel terimler dönmeleri içermez ve olduğu gibi kalır. Eğilme terimleri ise tamamen kaybolur: iki dönme de serbest kalınca, $w_1$, $w_2$ uç yer değiştirmelerinin her çifti çubuğu mafsalları etrafında yalnızca rijit cisim gibi döndürür ve bunun için enerji gerekmez. Çözücü bu yoğunlaştırmayı her kayma düzeltme katsayısı için sayısal olarak yapar ve yukarıdaki matrisi, kayan noktalı aritmetiğin yuvarlama hataları dışında, aynen elde eder.

::callout{type="details" title="Yoğunlaştırmanın adım adım hesabı"}
Eğilme kısmı için serbestlik derecelerini korunanlar $a = (w_1, w_2)$ ve serbest bırakılanlar $b = (\varphi_1, \varphi_2)$ olarak sıralayın. Kiriş matrisinden, $k_1$–$k_4$ ve kayma parametresi $\Phi$ [orada](/tr/elements/beam#local-stiffness-matrix) tanımlandığı gibi olmak üzere,

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

$\mathbf{K}_{ab}$'nin iki sütunu eşit olduğundan, $\mathbf{K}_{bb}^{-1}$ terimlerinden yalnızca toplamları önemlidir; bu toplam $2/(k_3 + k_4)$'tür:

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

$k_3 + k_4 = 6EI_y / ((1+\Phi)L)$ olduğundan çarpan $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$ olur; yani bu ifade tam olarak $\mathbf{K}_{aa}$'dır ve yoğunlaştırılmış eğilme rijitliği $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ sıfırdır.
::

## Dönüşüm matrisi {#transformation-matrix}

Global x'ten global z'ye doğru $\theta$ açısında duran bir çubukta, $c = \cos\theta = (x_2 - x_1)/L$ ve $s = \sin\theta = (z_2 - z_1)/L$ ile yerel yer değiştirmeler $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$ olur; burada

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

bunlar [kirişin dönüşüm matrisinin](/tr/elements/beam#transformation-matrix) ötelenmelere ait satır ve sütunlarıdır. z aşağı baktığı için $s$'nin işaretine dikkat edin: yukarıdaki kafes sistemin A → C merteği yükselir; bu yüzden $z_2 - z_1 = -3$ m, $c = 0{,}7071$ ve $s = -0{,}7071$ olur.

## Global rijitlik matrisi {#global-stiffness-matrix}

$\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$ çarpımı açıldığında

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}
$$

elde edilir. Mafsallı bir çubuğun **Rijitlik matrisi** penceresi, ötelenmelere ait satır ve sütunlarda bu sayıları, dönmelere ait olanlarda ise sıfırları gösterir.

## Mafsallı kirişin kafes çubuğundan fazlası {#where-a-hinged-beam-does-more}

EduBeam'de kafes çubuğu hâlâ bir kiriş elemanı olduğu için, ders kitabındaki kafes çubuğunun yapamadığı iki şeyi yapabilir:

- **Boyunca yük taşıyabilir.** Çubuğa etkiyen yayılı bir yük, örneğin zati ağırlığı, çubuğu düğüm noktaları arasında basit mesnetli bir kiriş gibi eğer ve her düğüm noktasına $qL/2$ aktarır. Bu düğüm yükleri altındaki kafes normal kuvvetlerini diğer çubuklar taşır. Yüklü çubuğun kendisinde, yükün çubuk doğrultusundaki bileşeni $N$'yi doğrusal olarak değiştirir; kafes çubuk kuvveti, $N$'nin çubuk ortasındaki değeridir.
- **Kirişlerle birlikte kullanılabilir.** Bir çerçeve, özel bir eleman türüne gerek kalmadan, çekme çubuğu veya stabilite çaprazı gibi mafsallı çubuklar içerebilir.

Yukarıdaki kafes sistemin çekme çubuğuna 5 kN/m ekleyin:

::model-figure{caption="Aynı kafes sistem, çekme çubuğunda 5 kN/m ile: normal kuvvetler değişmiyor, çekme çubuğu M = qL²/8 = 22,5 kNm ile eğiliyor"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
  - { member: 3, qz: 5 }
results: [M, N]
show: [nodeLabels]
---
::

El hesabıyla kontrol: C'de düşey denge $2\,N \sin 45^\circ + 10 = 0$ her mertekte $N = -7{,}071$ kN verir. A'da merteğin yatay bileşenini, $7{,}071 \cos 45^\circ = 5$ kN, çekme çubuğu dengeler; çekme çubuğunda $N = +5$ kN çekme vardır. Çekme çubuğundaki yük doğrudan uçlarındaki mesnetlere gider: her mesnet tepkisine $qL/2 = 15$ kN ekler, normal kuvvetlere ise hiçbir şey eklemez.

Bir kafes sistemin, düğümleri mafsallı bir yapı olarak kararlı olması gerekir. Örneğin diyagonali olmayan kare bir göz bir mekanizmadır: EduBeam mafsalları adlarıyla belirtir ve hareketi gösterir ([sorun giderme](/tr/reference/troubleshooting#no-results-are-drawn)).
