---
description: "EduBeam'in kullandığı doğrudan rijitlik yöntemi, elle çözülen ankastre–kayıcı mesnetli kirişte: numaralama, birleştirme, mesnetler, tepkiler, çubuk sonuçları."
source: site
---

# EduBeam modeli nasıl çözer

Modeli her değiştirdiğinizde EduBeam onu **doğrudan rijitlik yöntemiyle** tarayıcınızda, birkaç milisaniyede yeniden çözer. Bu sayfa [@edubeam/fem](/tr/solver) çözücüsünü küçük bir örnek üzerinde adım adım izler; böylece her sayıyı elle yeniden bulabilir ve sonuçlara neden güvenebileceğinizi görebilirsiniz.

Örnek, bir ucu ankastre, diğer ucu kayıcı mesnetli bir kiriştir: 4 m boyunda, çelik bir IPE 300; A'da ankastre, B'de kayıcı mesnetli, 10 kN/m yük altında. Eğilme rijitliği $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm²'dir ve kayma şekil değiştirmesi ihmal edildiğinde ders kitabındaki sonuçlar $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN ve $\varphi_B = qL^3/(48EI)$ olur.

::model-figure{caption="Ankastre–kayıcı mesnetli kiriş, IPE 300, 10 kN/m: A'da M = −20 kNm, 2,5 m'de +11,25 kNm, mesnet tepkileri 25 kN ve 15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
section: { a: 53.8e-4, iy: 8.356e-5, h: 0.3 }
results: [M, V, w]
show: [nodeLabels]
---
::

## Modelden yer değiştirmelere {#from-model-to-displacements}

::div{.steps}
### Serbestlik derecelerinin numaralanması {#number-the-degrees-of-freedom}

Her düğüm, elemanlarının gerektirdiği serbestlik derecelerini alır. Bütün elemanlar [kiriş elemanı](/tr/elements/beam) olduğu için her düğümde `Dx`, `Dz` ve `Ry` vardır. Çözücü düğüm düğüm ilerleyerek önce **serbest**, sonra **tutulu** serbestlik derecelerini numaralar. Burada A ankastredir, B ise yalnızca düşeyde tutulur; dolayısıyla iki serbestlik derecesi serbesttir:

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$ ve $\varphi$, [serbestlik dereceleri tablosundaki](/tr/elements/conventions#degrees-of-freedom) gibi x ve z doğrultusundaki yer değiştirmeler ile dönmedir. Her eleman bir **konum dizisi** tutar: altı serbestlik derecesinin $\mathbf{r}$ içindeki sıra numaraları. 1'den sayarsak kirişin $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ serbestlik dereceleri $(3, 4, 5, 1, 6, 2)$ konumlarındadır.

### Eleman matrisleri {#compute-the-element-matrices}

Çözücü her eleman için [yerel rijitlik matrisini](/tr/elements/beam#local-stiffness-matrix) kurar, varsa [uç mafsallarını](/tr/elements/beam#end-hinges) statik yoğunlaştırmayla matristen çıkarır ve matrisi global eksenlere dönüştürür: $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Her eleman yükü [eşdeğer düğüm yüklerine](/tr/elements/beam#element-loads) dönüşür: $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Kirişimiz yatay olduğu için $\mathbf{T}$ birim matristir ve düzgün yayılı yük, kN ve kNm cinsinden şunu verir:

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13{,}33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13{,}33 \end{bmatrix}.
$$

### Birleştirme {#assemble}

Global rijitlik matrisi $\mathbf{K}$ sıfırlarla başlar. Her eleman $(i, j)$ terimini, konum dizisinin $i$ ve $j$ için gösterdiği satır ve sütuna ekler; böylece bir düğümde birden çok eleman birleşiyorsa, o düğümün serbestlik derecelerine ait rijitlikleri toplanır. Yük vektörü $\mathbf{F}$, düğüm yüklerini ve eşdeğer düğüm yüklerini aynı yolla toplar. Öngörülen yer değiştirmeler (mesnet çökmeleri) $\mathbf{r}_p$ içine yazılır. Önce serbest, sonra tutulu serbestlik dereceleri sıralandığında sistem bloklara ayrılır:

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

burada $\mathbf{R}$ bilinmeyen mesnet tepkileridir. Örnekte kirişin yalnızca B ucuna ait satır ve sütunları $\mathbf{K}_{uu}$ bloğuna düşer:

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13{,}33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### Mesnet koşulları ve çözüm {#apply-the-supports-and-solve}

Mesnetler yaylarla ya da köşegene yazılan büyük sayılarla modellenmez: tutulu serbestlik dereceleri sistemden doğrudan ayrılır. Serbest yer değiştirmeler

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p
$$

denkleminden LU ayrıştırmasıyla bulunur. Mesnet çökmesi yoksa $\mathbf{r}_p = \mathbf{0}$ olur ve burada

$$
\varphi_B = \frac{13{,}33}{17\,548} = 7{,}598 \times 10^{-4} \text{ rad}
$$

elde edilir; ders kitabındaki $qL^3/(48EI)$ değerinin aynısıdır. $u_B$ ise sıfırdır.

### Mesnet tepkileri {#compute-the-reactions}

Tüm yer değiştirmeler bilindiğine göre, tutulu satırlar mesnet tepkilerini, yani mesnetlerin yapıya uyguladığı kuvvetleri verir:

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

$w_A$ satırında $\mathbf{K}_{pu}$, $\varphi_B$ sütununda $-6EI/L^2$ terimini, $\mathbf{F}_p$ ise $qL/2$ değerini içerir:

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

bu da yukarı doğru 25 kN demektir (z aşağı bakar). Aynı yolla $R_{\varphi A} = +20$ kNm ve $R_{wB} = -15$ kN bulunur: ders kitabındaki $qL^2/8$ ve $3qL/8$.
::

## Çubuklar boyunca sonuçlar {#results-along-the-members}

Çözücü her eleman için uç yer değiştirmelerini $\mathbf{r}$ vektöründen alır, yerel eksenlere dönüştürür, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, ve [çubuk uç kuvvetlerini](/tr/elements/conventions#end-forces-element-results-table) hesaplar:

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

Örnekte $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ vektörü $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN ve $M_{21} = 0$ verir.

Herhangi bir $x$ noktasındaki iç kuvvetler, elemanın başlangıcı ile $x$ arasındaki parçanın dengesinden bulunur: parçanın başındaki kuvvetler artı o parçadaki yük.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

burada $N_q$, $V_q$ ve $M_q$ o parçadaki yüklerden gelir. Düzgün yayılı yük $q_z$, $q_1$'den $q_2$'ye değişen trapez yük ($\Delta q = q_2 - q_1$ ile) ve $a$ uzaklığında, yalnızca $x \ge a$ için etkiyen $F_z$ kuvveti veya $M_y$ momenti için:

$$
\begin{array}{l|cc}
\text{Yük} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$, $V_q$ ifadesinde $q_z$ ve $F_z$ yerine eksenel bileşenler $q_x$ ve $F_x$ yazılarak elde edilir.

Örnekte $M(x) = -20 + 25\,x - 5\,x^2$ kNm olur; en büyük değeri $x = 2{,}5$ m'de $11{,}25$ kNm $= 9qL^2/128$ olarak bulunur. Sıcaklık yüklemesinin burada kendi terimi yoktur: yalnızca çubuk uç kuvvetleri üzerinden etkir.

Sehim, [şekil fonksiyonları](/tr/elements/beam#local-stiffness-matrix) ile uç yer değiştirmelerinin çarpımına, yükün iki ucu ankastre elemanda oluşturduğu sehimin eklenmesiyle bulunur. Mafsallı bir ucun kendi dönmesi önce [statik yoğunlaştırma](/tr/elements/beam#end-hinges) bağıntısından geri hesaplanır. Diyagramlar ve deforme şekil, her çubuk boyunca hesaplanan bu fonksiyonlardır.

## Sonuçlar neden kesindir {#exact}

Yukarıdaki her adım, çözdüğü model için kesindir:

- Eleman rijitliği, varsayılan polinom şekillerden değil, prizmatik bir Timoshenko çubuğunun **kesin çözümünden** gelir; dolayısıyla çubuğun gerçek rijitliğidir.
- Ankastrelik uç kuvvetleri her yük türü için iki ucu ankastre çubuğun kesin çözümleridir; bu yüzden eşdeğer düğüm yüklerinde hiçbir şey kaybolmaz.
- Bu nedenle düğüm yer değiştirmeleri kesindir; düğümler arasındaki iç kuvvetler de gerçek yükün dengesinden bulunduğu için onlar da kesindir.

EduBeam'in sizden hiçbir zaman ağı sıklaştırmanızı istememesinin nedeni budur: çubuk başına bir eleman, yüz elemanla aynı sonucu verir. Düğüm yalnızca çubuğun kendisinin değiştiği yerlerde gerekir: mesnette, mafsalda, köşede veya kesit değişiminde. Aradaki tekil bir yük eleman yükü olarak kalabilir. Geriye kalan tek hata kayan nokta yuvarlama hatasıdır; sonuç tabloları, kendi türündeki en büyük değerin $10^{-12}$ katından küçük değerleri 0 olarak gösterir.

“Kesin” sözü model için geçerlidir ve modelin de sınırları vardır:

::div{.limits}
- **Doğrusal elastik malzeme** ve **küçük yer değiştirmeler**: denge şekil değiştirmemiş geometri üzerinde yazılır; bu yüzden ikinci mertebe (P–Δ) etkileri ve burkulma yoktur.
- **Doğru eksenli, prizmatik çubuklar**: eleman başına tek bir kesit. Değişken kesitli bir çubuk birkaç elemanla yaklaşık olarak modellenmelidir.
- **Yalnızca x–z düzleminde eğilme**: burulma ve düzlem dışı davranış yoktur.
::

## Yapı ayakta duramadığında {#mechanisms}

Şekil değiştirmeden hareket edebilen bir yapının rijitlik matrisi tekildir ve tek bir çözümü yoktur. EduBeam bunu çözümden önce arar ve çözümden sonra sonucu denetler:

1. **Çözümden önce**, yapının birbirine bağlı her parçası yalnızca geometrisine göre denetlenir. Parçanın mesnetleri, düzlemdeki bir cismin üç rijit cisim hareketini engellemelidir: üçten az bağ, modelin henüz bitmediği anlamına gelir (*Yapının çözülebilmesi için mesnet gerekiyor.*); üç veya daha fazla bağ olduğu hâlde parça kayabiliyor ya da dönebiliyorsa (örneğin paralel kayıcı mesnetler) bu bir hatadır. Ardından mafsallar denetlenir: çubuklar boyları değişmeden mafsallar etrafında dönebiliyorsa yapı bir mekanizmadır; EduBeam mafsalları daire içine alır ve hareketi gösterir.
2. **Çözüm sırasında**, tam olarak tekil bir matris LU ayrıştırmasını durdurur: *Yapı bir mekanizma: rijitlik matrisi tekil.*
3. **Çözümden sonra**, $10^6$ m veya rad'dan büyük bir yer değiştirme ya da dönme, matrisin yuvarlama hatası dışında tekil olduğunu gösterir. EduBeam hareket eden düğümleri ve doğrultuları adlarıyla belirtir: *Yapı kararsız: … pratikte hiçbir dirençle karşılaşmıyor.* Sıfır olarak ya da yanlış birimle girilmiş bir malzeme veya kesit de bu duruma yol açar.

Bütün çubukların mafsallı bağlandığı bir düğümde, hiçbir şeye bağlı olmayan bir dönme mekanizma değildir: çözücü onu sıfır bırakır. Her mesajı ve nasıl giderileceğini [Sorun giderme](/tr/reference/troubleshooting#no-results-are-drawn) sayfası açıklar.

## Çözücüyü kendiniz çalıştırın {#library}

Çözücü açık kaynaklıdır: [@edubeam/fem](/tr/solver), TypeScript ile yazılmıştır ve tarayıcıda da Node'da da çalışır. Aynı ankastre–kayıcı mesnetli kiriş:

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// SI birimleri: m, N, Pa. Çelik, IPE 300; k = 1e32 kesiti kaymaya karşı rijit yapar.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // ankastre
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // kayıcı mesnet
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, aşağı

solver.solve()

solver.neq // 2: B'nin Dx ve Ry serbestlik dereceleri serbest
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: önce serbest, sonra tutulu serbestlik dereceleri
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), sonra B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, ankastre uçta negatif moment
beam.computeBendingMomentAt(lc, 2.5) // 11250: en büyük pozitif moment
```

`solve()` çağrısından sonra `solver.k` birleştirilmiş $\mathbf{K}$ matrisini, `solver.f` ise $\mathbf{F}$ yük vektörünü tutar; bunları kendi birleştirdiğiniz matrislerle karşılaştırabilirsiniz. Bu sayfadaki adımlar `Solver.ts` (numaralama), `LinearStaticSolver.ts` (birleştirme, çözüm, mesnet tepkileri) ve `Beam2D.ts` (eleman matrisleri ve sonuçlar) dosyalarındadır.

::div{.actions}
[@edubeam/fem ile başlarken](/tr/solver/getting-started) [Kütüphanede neler var](/tr/solver/reference) [GitHub'da kaynak kod ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
