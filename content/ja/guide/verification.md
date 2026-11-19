---
description: "EduBeam の結果を教科書の公式で確認：梁、トラス、温度荷重、支点沈下、そしてティモシェンコ梁がオイラー・ベルヌーイ梁と異なる点。"
source: site
---

# 手計算による結果の確認

おおよそでも自分で再現できない数値は、信用してはいけません。このページでは、教科書の代表的なケースを手計算で解き、[EduBeam]{.edubeam} の結果と比べます。表示されている桁はすべて一致します。表の数値は、アプリの*結果*タブと同じく有効数字 5 桁、図のラベルは 4 桁に丸めています。どの図も、このページを開いたときにブラウザで解析しています。**EduBeam で開く**を押すと同じモデルがアプリに読み込まれ、表を読んだり、値を変えて何が起こるかを確かめたりできます。

::div{.chips}
- [単純梁](#simply-supported-beam-uniform-load)
- [片持ち梁](#cantilever-tip-load)
- [両端固定梁](#fixed–fixed-beam-uniform-load)
- [一端固定他端ローラー支持梁](#propped-cantilever-uniform-load)
- [2 部材トラス](#two-bar-truss)
- [温度荷重](#temperature-gradient-on-a-simply-supported-beam)
- [支点沈下](#prescribed-displacement)
- [せん断変形](#shear-deformation)
::

構造物全体を最初から最後まで解いた例は、[3 ヒンジラーメン](/ja/tutorials/three-hinged-frame)と[平面トラス](/ja/tutorials/truss)のチュートリアルをご覧ください。手計算で解く新しい問題に、入力したそばから答え合わせをしたい場合は、[構造力学の練習問題](/ja/practice)のページを試してください。

## このページで使う断面 {#the-section-used-here}

特に断らない限り、どのケースもアプリの例題と同じ鋼製の梁を使います。$E = 210$ GPa、$I_y = 8356$ cm⁴（IPE 300）なので、

$$
EI = 210 \times 10^9 \cdot 8.356 \times 10^{-5} = 17{,}547.6\ \text{kNm}^2
$$

断面積（$A = 1$ m²）とせん断補正係数（$k = 10^{32}$）は非常に大きくしてあり、軸方向の変形とせん断変形は無視できます。そのため結果は、教科書にあるオイラー・ベルヌーイ梁の公式と厳密に一致します。

::callout{type="info" title="EduBeam の梁はティモシェンコ梁です"}
断面ライブラリの断面のような実際の断面を使うと、部材はせん断によっても変形します。そのため、たわみはオイラー・ベルヌーイ梁の公式よりわずかに大きくなり、不静定構造では断面力もわずかに変わります。どの程度変わるのか、せん断変形をどうすれば無視できるのかは、このページの最後の[せん断変形](#shear-deformation)で説明します。
::

*結果*タブの変位と回転角は[グローバル座標系](/ja/elements/conventions#global-axes)に従います。正の D<sub>z</sub> は下向き、正の R<sub>y</sub> は反時計回りです。変位の単位は、設定で変えない限りメートルです（[単位と設定](/ja/essentials/units-settings)を参照）。

## 単純梁、等分布荷重 {#simply-supported-beam-uniform-load}

$L = 6$ m、$q = 12$ kN/m。A はピン支点、B はローラー支点です。スパン中央の節点 C で、そこのたわみを読み取れます。部材を節点で分割しても、結果は変わりません。

::model-figure{caption="単純梁、12 kN/m"}
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

| 量 | 式 | 値 |
| --- | --- | --- |
| 反力 | $qL/2$ | 36 kN |
| 支点のせん断力 | $\pm qL/2$ | A で +36 kN、B で −36 kN |
| スパン中央の曲げモーメント | $qL^2/8$ | 54 kNm |
| A の回転角 | $qL^3/(24EI)$ | 0.0061547 rad、時計回り |
| C のたわみ | $5qL^4/(384EI)$ | 11.540 mm、下向き |

EduBeam も同じ値を示します。*結果*タブでは、節点 A が R<sub>y</sub> = −0.0061547 rad（負：時計回り）、節点 C が D<sub>z</sub> = 0.01154 m（正：下向き）です。

## 片持ち梁、先端荷重 {#cantilever-tip-load}

$L = 4$ m。A は固定支点で、自由端 B に下向きの $F = 18$ kN が作用します。

::model-figure{caption="片持ち梁、先端に 18 kN"}
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

| 量 | 式 | 値 |
| --- | --- | --- |
| 鉛直反力 | $F$ | 18 kN |
| 固定端モーメント | $FL$ | 72 kNm、上側引張：M = −72 kNm |
| 先端の回転角 | $FL^2/(2EI)$ | 0.0082063 rad、時計回り |
| 先端のたわみ | $FL^3/(3EI)$ | 21.883 mm、下向き |

*結果*タブでは、節点 B が R<sub>y</sub> = −0.0082063 rad、D<sub>z</sub> = 0.021883 m です。

## 両端固定梁、等分布荷重 {#fixed–fixed-beam-uniform-load}

$L = 6$ m、$q = 12$ kN/m、両端固定。この梁は不静定なので、解は剛性に依存します。公式は、両端の回転角が 0 という適合条件から導かれます。

::model-figure{caption="両端固定梁、12 kN/m"}
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

| 量 | 式 | 値 |
| --- | --- | --- |
| 反力 | $qL/2$ | 36 kN |
| 支点の曲げモーメント | $qL^2/12$ | 36 kNm、上側引張：M = −36 kNm |
| スパン中央の曲げモーメント | $qL^2/24$ | 18 kNm、下側引張 |
| C のたわみ | $qL^4/(384EI)$ | 2.3080 mm、下向き |

両端を固定すると、曲げモーメント図全体が $qL^2/12$ だけ持ち上がります。支点からスパン中央までの変化量は、単純梁と同じく $qL^2/8 = 54$ kNm のままです。アプリで単純梁のモデルから始め、両方の支点を**固定**に変えると、この様子を確かめられます。

## 一端固定他端ローラー支持梁、等分布荷重 {#propped-cantilever-uniform-load}

$L = 6$ m、$q = 12$ kN/m。A で固定、B はローラー支点です。

::model-figure{caption="一端固定他端ローラー支持梁、12 kN/m"}
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

| 量 | 式 | 値 |
| --- | --- | --- |
| 固定端の反力 | $5qL/8$ | 45 kN |
| ローラー支点の反力 | $3qL/8$ | 27 kN |
| 固定端モーメント | $qL^2/8$ | 54 kNm、上側引張：M = −54 kNm |
| 正の曲げモーメントの最大値 | $9qL^2/128$ | 30.375 kNm |
| …その位置（$V = 0$） | $x = 5L/8$ | A から 3.75 m |
| B の回転角 | $qL^3/(48EI)$ | 0.0030773 rad、反時計回り |

EduBeam は図の極値すべてにラベルを付けるので、正の曲げモーメントの最大値も、それが生じる位置に表示されます。位置を求めるには、せん断力が 0 になる点を読みます。$V(x) = 45 - 12x = 0$ から $x = 3.75$ m です。

## 2 部材トラス {#two-bar-truss}

ピン支点 A $(0, 0)$ と B $(4, 0)$ から 2 本の部材が立ち上がり、2 m 上の頂点 C $(2, -2)$ で交わります。両部材とも両端に**材端ヒンジ**があるので、部材は軸力だけを負担します。C に下向きの鉛直荷重 $F = 20$ kN が作用します。

::model-figure{caption="2 部材トラス、頂点に 20 kN"}
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

各部材の傾きは 45° です。対称性から両部材の軸力は等しいので、節点 C の鉛直方向のつり合いから

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14.142\ \text{kN}
\end{aligned}
$$

両部材とも**圧縮**です。各支点は鉛直方向に 10 kN、水平方向に内向きの 10 kN を負担します。部材が支点を外側へ押し広げようとするためです。**N (x)** の表示と反力も同じ結果を示します。

## 単純梁の温度勾配 {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m、$h = 0.3$ m、$\alpha = 12 \times 10^{-6}$ 1/K。上面の温度が 5 K 上がり、下面の温度が 5 K 下がるので、$\Delta T_b - \Delta T_t = -10$ K となり、軸線の温度は変わりません（$\Delta T_c = 0$）。単純梁は自由に曲がれるので、**断面力は生じず**、曲率だけが生じます。

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0.3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

上面が伸びて下面が縮むので、梁は**上向き**に反ります。

::model-figure{caption="上面が下面より 10 K 高温：梁は 3.2 mm 上に反り、断面力は生じない"}
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

| 量 | 式 | 値 |
| --- | --- | --- |
| C のたわみ | $\kappa L^2/8$ | 3.2 mm、上向き：D<sub>z</sub> = −0.0032 m |
| A の回転角 | $\kappa L/2$ | 0.0016 rad、反時計回り |
| 曲げモーメント |  | 0 |

一様な温度変化 $\Delta T_c$ は梁を伸ばすだけです。その伸びはローラー支点が許すので、やはり力は生じません。

次に、両端の回転を拘束します。A を**固定**に、B を**ローラー（回転拘束）** にします。B では梁の伸びは拘束されません。曲率が妨げられ、その代わりにスパン全体に一定の曲げモーメントが生じます。

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17{,}547.6 \cdot (-4 \times 10^{-4}) = 7.019\ \text{kNm}
\end{aligned}
$$

これは正の曲げモーメント（下側引張）です。拘束された上面は伸びようとするので、圧縮を受けることになります。

::model-figure{caption="同じ梁で両端の回転を拘束：一定の 7.019 kNm"}
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

温度荷重の入力方法は[荷重](/ja/essentials/loads#temperature-load)で説明しています。断面の高さ $h$ は[断面](/ja/essentials/elements#cross-sections)の一部として設定します。

## 支点沈下 {#prescribed-displacement}

[一端固定他端ローラー支持梁](#propped-cantilever-uniform-load)から荷重を取り除き、B のローラー支点を $w = 10$ mm 沈下させます。EduBeam では、B に D<sub>z</sub> = 0.01 m の**強制変位**を与えることになります。この変位に追従するには、ローラー支点が片持ち梁の先端を引き下げなければならず、そのために梁が曲がります。

::model-figure{caption="一端固定他端ローラー支持梁、B が 10 mm 沈下：ローラー支点が 2.437 kN で引き下げる"}
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

| 量 | 式 | 値 |
| --- | --- | --- |
| ローラー支点の力 | $R = 3EIw/L^3$ | 2.4372 kN、下向きに引く |
| 固定端モーメント | $RL$ | 14.623 kNm、上側引張：M = −14.623 kNm |
| B の回転角 | $3w/(2L)$ | 0.0025 rad、時計回り |

荷重と違い、支点沈下は構造物がそれに抵抗する場合にだけ力を生じます。この例では梁の剛性が高いほど $R$ は大きくなります。単純梁なら、同じ沈下に剛体として追従し、力はまったく生じません。

12 kN/m の荷重を戻すと、結果は重ね合わされます。固定端は $45 + 2.4372 = 47.437$ kN と $54 + 14.623 = 68.623$ kNm、ローラー支点は $27 - 2.4372 = 24.563$ kN を負担します。支点沈下の入力方法は[荷重](/ja/essentials/loads#prescribed-displacements-support-settlements)で説明しています。

## せん断変形 {#shear-deformation}

EduBeam の梁要素は**ティモシェンコ**梁です。曲げによるたわみに加えて、断面のせん断剛性 $kGA$ で決まる量だけせん断によってもたわみます。それによって何が変わるかは、構造物によって異なります。

- **静定構造**：反力と断面力はつり合いだけで決まるので、まったく変わりません。大きくなるのは変位だけです。単純梁と片持ち梁では断面の回転角も変わりませんが、それ以外の場所、たとえば張り出し部の先端では、回転角もわずかに変わります。
- **不静定構造**：力が剛性に依存するので、力もわずかに変わります。

### 単純梁 {#shear-simply-supported}

[クイックスタート](/ja/guide/quick-start#_8-check-by-hand)の梁で、その大きさがわかります。これは上の単純梁に、実際の断面として断面ライブラリの **IPE 200 (概略)** を使ったものです。$I_y = 1943$ cm⁴、$A = 28.48$ cm²、せん断補正係数 $k = 0.3933$（ウェブが占める面積の割合）、$G = 81$ GPa なので、$EI = 4080.3$ kNm²、$kGA = 90{,}720$ kN です。

| 量 | 式 | 値 |
| --- | --- | --- |
| 材端の回転角 | $qL^3/(24EI)$ | 0.026469 rad |
| スパン中央のたわみ（曲げ） | $5qL^4/(384EI)$ | 49.629 mm |
| スパン中央のたわみ（せん断） | $qL^2/(8kGA)$ | 0.59524 mm |
| スパン中央のたわみ（合計） | 合計 | 50.224 mm（EduBeam の表示と一致） |

せん断成分は全体の 1.2 % です。材端の回転角は、反力や曲げモーメントと同じく、オイラー・ベルヌーイ梁の値のままです。

### 片持ち梁：短い部材 {#shear-cantilever}

先端に荷重 $F$ を受ける片持ち梁の先端は、曲げによって $FL^3/(3EI)$、せん断によって $FL/(kGA)$ だけたわみます。その比は

$$
\frac{\text{せん断}}{\text{曲げ}} = \frac{3EI}{kGA\,L^2}
$$

です。同じ IPE 200 で、長さ 4 m の片持ち梁では 0.84 % ですが、1 m では 13.5 % になります。せん断変形は、短くてせいの高い部材で重要になります。

### 一端固定他端ローラー支持梁：力が変わる {#shear-propped-cantilever}

IPE 200 で作った[一端固定他端ローラー支持梁](#propped-cantilever-uniform-load)は不静定で、ローラー支点の負担がわずかに増えます。$L = 6$ m で $\beta = 3EI/(kGA\,L^2) = 0.0037481$ とすると、ローラー支点での適合条件から

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27.034\ \text{kN}
$$

となり、27 kN よりわずかに大きくなります。固定端モーメントは 54 kNm から $qL^2/2 - R_B L = 53.798$ kNm に下がります。この例では小さな差ですが、$\beta$ とともに、つまり部材が短くせいが高いほど大きくなります。

### オイラー・ベルヌーイ梁との比較 {#shear-switch-off}

オイラー・ベルヌーイ梁の公式と比べるには、断面の**せん断補正係数**を `1e10` のような非常に大きな値にします。すると、せん断成分が消え、このページのどのケースもふたたび一致します。要素の定式化は[理論マニュアル](/ja/elements/beam)にあります。

## 自分で確認するときのヒント {#tips-for-your-own-checks}

- ビューア右下の**単位チップ**をいつも確認しましょう。食い違いのほとんどは単位の取り違えです。
- 正確な数値は、図のラベルではなく、**結果**タブとマウスを重ねたときのツールチップから読み取りましょう。**CSV をエクスポート**や**コピー**を使えば、反力も表計算ソフトですぐ使える形で取り出せます。[結果と断面力図](/ja/essentials/results#results-tab)をご覧ください。
- 設定で**数値の表示形式**を*自動*にすると、`4 · 10¹` ではなく `40` と表示されます。
- 直接剛性法を学ぶときは、**剛性マトリクス**のウィンドウで 1 つの要素を[理論マニュアル](/ja/elements/beam)と比べてみましょう。
- **モデルを共有**を使えば、確認済みのモデルを同僚や教員に渡せます。
- 多くのケースをまとめて確認したり、答えのわかっている演習問題を作ったりするには、同じソルバーをコードから実行します。アプリのすべての数値を計算しているライブラリが [@edubeam/fem](/ja/solver) です。
