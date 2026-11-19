---
description: "EduBeam'in iki düğümlü Timoshenko kirişi: kesin rijitlik matrisi, kayma şekil değiştirmesi, statik yoğunlaştırmayla uç mafsalları, ankastrelik uç kuvvetleri, dönüşüm."
source: site
---

# Kiriş elemanı

EduBeam'deki her çubuk, ister kiriş ister kolon ister kafes çubuğu olsun, aynı elemandır: x–z düzleminde, sabit kesitli, iki düğümlü, doğru eksenli bir **Timoshenko kirişi**. Bu sayfa elemanın formülasyonunu çözücünün hesapladığı biçimiyle verir; böylece herhangi bir eleman matrisini veya yük vektörünü elle kurup uygulamadaki değerlerle karşılaştırabilirsiniz. İşaretler [Koordinat sistemi ve işaret kabulü](/tr/elements/conventions) sayfasındaki gibidir; kod, [@edubeam/fem](/tr/solver) kütüphanesindeki `Beam2D.ts` dosyasındadır. Elemanların bir araya gelip çözümü nasıl oluşturduğunu [EduBeam modeli nasıl çözer](/tr/elements/analysis) sayfası gösterir.

## Serbestlik dereceleri {#degrees-of-freedom}

Her düğümün üç serbestlik derecesi vardır, elemanın ise altı. Elemanın [yerel eksenlerinde](/tr/elements/conventions#element-local-axes) her uç yer değiştirmesine bir [çubuk uç kuvveti](/tr/elements/conventions#end-forces-element-results-table), yani *Eleman sonuçları* tablosunun bir sütunu karşılık gelir:

::element-sketch{mode="dofs" caption="Kiriş elemanının altı serbestlik derecesi, hepsi pozitif yönde çizilmiş; kesikli çizgi alt lifleri (yerel +z) gösterir"}
::

| Doğrultu | Başlangıç düğümü (1) | Bitiş düğümü (2) |
| --- | --- | --- |
| yerel x boyunca | $u_1$ ve `X12` | $u_2$ ve `X21` |
| yerel z boyunca; soldan sağa çizilmiş elemanda aşağı | $w_1$ ve `Z12` | $w_2$ ve `Z21` |
| dönme, saat yönünün tersine | $\varphi_1$ ve `M12` | $\varphi_2$ ve `M21` |

Bu sırayla elemanın yer değiştirme ve kuvvet vektörlerini oluştururlar:

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

z aşağı baktığı ve dönmeler saat yönünün tersine pozitif olduğu için, kayma şekil değiştirmesi olmayan bir kirişin ekseni $\varphi = -\,\mathrm{d}w/\mathrm{d}x$ kadar döner.

## Yerel rijitlik matrisi {#local-stiffness-matrix}

Eleman yükü taşımayan bir elemanın uç kuvvetleri $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$ bağıntısıyla bulunur; burada

$$
\mathbf{K}_l =
\begin{bmatrix}
 k_N & 0 & 0 & -k_N & 0 & 0 \\
 0 & k_1 & -k_2 & 0 & -k_1 & -k_2 \\
 0 & -k_2 & k_3 & 0 & k_2 & k_4 \\
 -k_N & 0 & 0 & k_N & 0 & 0 \\
 0 & -k_1 & k_2 & 0 & k_1 & k_2 \\
 0 & -k_2 & k_4 & 0 & k_2 & k_3
\end{bmatrix}
$$

ve

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ ve $G$ malzemenin elastisite ve kayma modülleri, $A$ kesit alanı, $I_y$ y eksenine göre atalet momenti, $k$ kesitin **Kayma düzeltme katsayısı**, $L$ ise elemanın boyudur. $\Phi$ **kayma parametresidir**: çubuğun kayma esnekliğini eğilme esnekliğiyle karşılaştırır; çubuk kısaldıkça ve kesit yükseldikçe büyür. $\Phi = 0$ için terimler, Euler–Bernoulli kirişinden bilinen $12EI/L^3$, $6EI/L^2$, $4EI/L$ ve $2EI/L$ olur. Eksenel davranış ile eğilme birbirinden bağımsızdır: $u_1$ ve $u_2$ yalnızca $k_N$ terimiyle bağlantılıdır.

y eksenini yukarı alan ders kitaplarında, bu matriste $-k_2$ bulunan yerlerde $+6EI/L^2$ yazar. İkisi de aynı rijitliği tanımlar; yalnızca enine yer değiştirmenin pozitif yönü farklıdır.

::callout{type="details" title="Matris nereden gelir: kesin şekil fonksiyonları"}
Yüksüz, prizmatik bir Timoshenko çubuğunun denge denklemlerinin kesin bir çözümü vardır: $u$, $x$'e göre doğrusal, $w$ kübik, $\varphi$ ise ikinci derecedendir. Uç yer değiştirmeleri cinsinden ve $\xi = x/L$ ile sehim şöyle yazılır:

$$
w(\xi) = N_1\,w_1 + N_2\,\varphi_1 + N_3\,w_2 + N_4\,\varphi_2,
$$

$$
\begin{aligned}
N_1 &= \frac{(1-\xi)\,(1+\Phi+\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_2 &= -\frac{L\,\xi\,(1-\xi)\,(2+\Phi-2\xi)}{2\,(1+\Phi)}, \\[1ex]
N_3 &= \frac{\xi\,(\Phi+3\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_4 &= \frac{L\,\xi\,(1-\xi)\,(\Phi+2\xi)}{2\,(1+\Phi)}.
\end{aligned}
$$

$\Phi = 0$ için bunlar kübik Hermite polinomlarıdır: $N_1 = 1 - 3\xi^2 + 2\xi^3$ ve $N_2 = -L\,\xi(1-\xi)^2$; buradaki eksi işareti $\varphi = -w'$ bağıntısından gelir. Rijitlik matrisi, bu kesin şekilleri oluşturmak için gereken uç kuvvetlerini içerir. Dolayısıyla çubuğun kesin rijitliğidir; eleman sayısı arttıkça iyileşen bir yaklaşım değildir. Çözücü deforme şekli de aynı fonksiyonlarla çizer.
::

## Kayma şekil değiştirmesi: Timoshenko mu, Euler–Bernoulli mi? {#timoshenko-or-euler-bernoulli}

Elemanın kaymayla şekil değiştirip değiştirmediği yalnızca $\Phi$'ye, dolayısıyla kesitin kayma düzeltme katsayısı $k$'ye bağlıdır: $kA$, kesmeyi taşıyan alandır. Her kesit türü kendi $k$ değeriyle başlar:

| Kesit | Kayma düzeltme katsayısı $k$ |
| --- | --- |
| Başlangıç modeli ve hazır örnekler | $10^{32}$; bu da $\Phi \approx 0$ yapar: Euler–Bernoulli |
| Kütüphanedeki I, H ve geniş başlıklı profiller | $h\,t_w / A$: kesmeyi gövde taşır |
| Kütüphanedeki dikdörtgen kutu profiller | $2\,h\,t / A$: iki yan duvar |
| Kütüphanedeki dikdörtgen ve kare kesitler | 0,833 |
| Kütüphanedeki dolu daire kesitler | 0,9 |
| Kütüphanedeki boru kesitler | 0,5 |
| Çokgen kesitler | başlangıçta 0,833 |
| **Kesit ekle** penceresi | başlangıçta 1 |

Narin bir çubukta fark küçüktür. Düzgün yayılı yük altındaki basit mesnetli bir kirişte kayma, açıklık ortasındaki eğilme sehimine oransal olarak $0{,}8\,\Phi$ ekler. Çelik bir IPE 200 için bu, 6 m açıklıkta %1,2, 2 m açıklıkta ise %11 eder. Kayma şekil değiştirmesini kapatmak için $k$'ye `1e32` gibi çok büyük bir sayı girin. Aksi belirtilmedikçe bu sitedeki canlı şekiller, kaymaya karşı rijit örnek kesiti kullanır; böylece Euler–Bernoulli teorisine göre yapılan el hesaplarıyla örtüşürler. Aşağıdaki şekil bunun dışındadır:

::model-figure{caption="2 m açıklıklı IPE 200, k = h·tw/A = 0,393: açıklık ortasında w = 0,5657 mm, Euler–Bernoulli teorisinin verdiği 0,5106 mm'den %11 fazla (Φ = 0,135)"}
---
nodes: { A: [0, 0], B: [2, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
material: { e: 210e9, g: 81e9 }
section: { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 }
results: [w, M]
---
::

## Uç mafsalları {#end-hinges}

İşaretlenmiş bir [uç mafsalı](/tr/essentials/elements#end-hinges), elemanın o ucundaki momenti sıfır yapar. Elemanın uç dönmesi artık serbesttir ve çözücü bu dönmeyi **statik yoğunlaştırma** (statik kondensasyon) ile matristen çıkarır. Altı serbestlik derecesini iki gruba ayıralım: korunanlar ($a$) ve serbest bırakılan uç dönmeleri ($b$):

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Burada $\mathbf{f}_\mathrm{fix}$, [eleman yüklerinin](#element-loads) ankastrelik uç kuvvetleridir. İkinci satır mafsaldaki dönmeyi verir:

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

bu ifade birinci satırda yerine konunca yoğunlaştırılmış rijitlik matrisi ve yoğunlaştırılmış ankastrelik uç kuvvetleri elde edilir:

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

Çözücü $\mathbf{K}^{*}$ matrisini, serbest bırakılan dönmelere ait satır ve sütunları sıfır olan 6 × 6'lık bir matrise geri yazar; böylece mafsallı bir eleman da sisteme tıpkı diğerleri gibi birleştirilir. Çözümden sonra $\mathbf{d}_b$'yi yukarıdaki formülle yeniden hesaplar ve deforme şekilde mafsaldaki kırılma görünür.

Bitiş düğümünde mafsal varsa $(w_1, \varphi_1, w_2)$ için eğilme kısmı şu hâle gelir:

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

$\Phi = 0$ için bu, bir ucu ankastre, diğer ucu mafsallı çubuğun klasik $3EI/L^3$ rijitliğidir. **İki** uçta da mafsal varsa eğilme terimlerinden hiçbir şey kalmaz, yalnızca $EA/L$ kalır: eleman bir [kafes çubuğudur](/tr/elements/truss).

Mafsal düğüme değil, eleman ucuna aittir. Bir düğümde birleşen elemanların hepsi o düğümde mafsallıysa, düğümün kendi dönmesine hiçbir şey bağlı değildir. Çözücü bu dönmeyi sıfır bırakır, bunun bir zararı yoktur; ancak böyle bir düğüme uygulanan düğüm momenti hiçbir elemana aktarılamaz ve sistemi tekil yapar.

## Eleman yükleri {#element-loads}

Eleman boyunca etkiyen yükler çözüme **eşdeğer düğüm yükleri** olarak girer: $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. **Ankastrelik uç kuvvetleri** $\mathbf{f}_\mathrm{fix}$, iki ucu ankastre olan yüklü elemanı dengede tutan uç kuvvetleridir.

Aşağıdaki formüllerin hepsi yerel eksenlerdedir. Global eksenlerde girilen bir yük (**LCS**, yani yerel koordinat sistemi kutusu işaretli değilken), önce elemanın [açısının](#transformation-matrix) $c = \cos\theta$ ve $s = \sin\theta$ değerleriyle yerel bileşenlere çevrilir:

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

burada üst çizgi global bileşenleri gösterir. Yayılı yükler elemanın kendi boyunun metresi başına etkir. Örneğin $(0, 0)$ noktasından $(3, -4)$ noktasına uzanan bir mertekte $L = 5$ m, $c = 0{,}6$ ve $s = -0{,}8$ olur (mertek yükseldiği için $z$ azalır). Bu mertekteki $\bar q_z = 10$ kN/m'lik bir yer çekimi yükünün bileşenleri $q_x = -8$ kN/m (eğim boyunca aşağı) ve $q_z = 6$ kN/m (eğime dik) olur; mertek toplam $10 \times 3$ değil, $10 \times 5 = 50$ kN taşır.

Tablolarda:

- $q_z$, $q_x$: düzgün yayılı yük; $q_1 \to q_2$: trapez yük, başlangıç düğümünde $q_1$, bitiş düğümünde $q_2$.
- $F_z$, $F_x$, $M_y$: başlangıç düğümünden $a$ uzaklığındaki kuvvet veya moment, $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: alt–üst lif sıcaklık farkı, alt lifler daha sıcaksa pozitif; $\Delta T_c$: eksenin ısınması. $\alpha$ malzemenin ısıl genleşme katsayısı, $h$ ise kesitin **Yükseklik** değeridir.

Eksene dik doğrultuda (z bileşenleri) ve $\Phi = 0$ için, başlangıç düğümünde:

$$
\begin{array}{l|cc}
\text{Yük} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Bitiş düğümünde:

$$
\begin{array}{l|cc}
\text{Yük} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Eksen doğrultusunda (x bileşenleri), her $\Phi$ için:

$$
\begin{array}{l|cc}
\text{Yük} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Kayma şekil değiştirmesiyle ankastrelik uç kuvvetleri"}
Düzgün yayılı yük ve sıcaklık yüklemesi her $\Phi$ için aynı ankastrelik uç kuvvetlerini verir. Diğerleri için, $D = 1 + \Phi$ ve $\Delta q = q_2 - q_1$ (z bileşenleri) ile:

$$
\begin{aligned}
&\text{Trapez yük:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&F_z\text{ kuvveti:} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&M_y\text{ momenti:} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

Bunlar iki ucu ankastre bir Timoshenko çubuğunun kesin çözümleridir; çözücünün her yük için düğümler arasına eklediği sehim de öyledir.
::

Mafsallı bir elemanda ankastrelik uç kuvvetleri de [Uç mafsalları](#end-hinges) bölümündeki gibi yoğunlaştırılır ve $\mathbf{f}^{*}_\mathrm{fix}$ elde edilir. Örneğin bitiş düğümünde mafsalı olan bir elemandaki düzgün yayılı yük ($\Phi = 0$ için) $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$ ve $M_{21} = 0$ verir: bunlar ankastre–kayıcı mesnetli kirişin ankastrelik uç kuvvetleridir.

Çözümden sonra eleman boyunca iç kuvvetler, uç kuvvetlerinden ve eleman üzerindeki yükün statiğinden; sehim ise şekil fonksiyonlarından ve yükün iki ucu ankastre elemanda oluşturduğu sehimden elde edilir: bkz. [Çubuklar boyunca sonuçlar](/tr/elements/analysis#results-along-the-members).

## Dönüşüm matrisi {#transformation-matrix}

Global x'ten global z'ye doğru (ekranda saat yönünde) ölçülen $\theta$ açısındaki bir eleman için

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L}
$$

olur ve yerel uç yer değiştirmeleri global olanlardan $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$ ile elde edilir:

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 & 0 & 0 \\
 -s & c & 0 & 0 & 0 & 0 \\
 0 & 0 & 1 & 0 & 0 & 0 \\
 0 & 0 & 0 & c & s & 0 \\
 0 & 0 & 0 & -s & c & 0 \\
 0 & 0 & 0 & 0 & 0 & 1
\end{bmatrix}.
$$

Dönmeler iki sistemde de aynıdır. Bir düğümün **Düğüm yerel eksen açısı** $\beta$ tanımlıysa (bir [eğik mesnet](/tr/essentials/nodes-supports#inclined-skewed-supports)), bilinmeyenleri $\mathbf{d}_n$, global x'ten global z'ye doğru $\beta$ kadar döndürülmüş kendi eksenlerindedir. Bunların global bileşenleri, o düğümün üç serbestlik derecesi için

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

olur. Çözücü $\mathbf{T}$'yi sağdan, iki uç düğümün $\mathbf{T}_n$ matrislerinden oluşan blok köşegen matrisle çarpar (kendi eksenleri olmayan düğüm için birim matris); böylece eleman her düğüme o düğümün eksenlerinde bağlanır.

## Global rijitlik matrisi {#global-stiffness-matrix}

Global eksenlerde elemanın rijitlik matrisi ve eşdeğer düğüm yükleri

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq}
$$

olur; elemanda mafsal varsa $\mathbf{K}_l$ ve $\mathbf{f}_\mathrm{eq}$ zaten yoğunlaştırılmıştır. Bir eleman için **Rijitlik matrisi** penceresinin gösterdiği matris $\mathbf{K}_g$'dir (pencereyi *Elemanlar* tablosundan veya elemanın sağ tık menüsünden açın); değerler SI birimlerindedir: N/m, N ve N·m. [EduBeam modeli nasıl çözer](/tr/elements/analysis) sayfası bu matrisleri birleştirir ve küçük bir örneği elle çözer.
