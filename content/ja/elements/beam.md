---
description: "EduBeam の 2 節点ティモシェンコ梁要素：厳密な剛性マトリクス、せん断変形、静的縮約による材端ヒンジ、固定端力、座標変換。"
source: site
---

# 梁要素

EduBeam の部材は、梁でも柱でもトラス材でも、すべて同じ要素です。x–z 平面内にある、断面が一定の直線状の 2 節点**ティモシェンコ梁**です。このページでは、ソルバーが実際に計算するとおりにその定式化を示します。どの要素の剛性マトリクスや荷重ベクトルも手計算で組み立て直し、アプリの値と照らし合わせられます。符号は[座標系と符号規約](/ja/elements/conventions)に従い、コードは [@edubeam/fem](/ja/solver) の `Beam2D.ts` です。要素を組み合わせて解を求める手順は [EduBeam がモデルを解く仕組み](/ja/elements/analysis)で説明しています。

## 自由度 {#degrees-of-freedom}

各節点は 3 つの自由度を持つので、要素の自由度は 6 つです。要素の[ローカル座標系](/ja/elements/conventions#element-local-axes)では、材端の各変位に対応する[材端力](/ja/elements/conventions#end-forces-element-results-table)が 1 つずつあり、*要素結果*の表の列に並びます。

::element-sketch{mode="dofs" caption="梁要素の 6 つの自由度（すべて正の向きに描いたもの）。破線は下縁（ローカル +z 側）を示す"}
::

| 方向 | 始端節点 (1) | 終端節点 (2) |
| --- | --- | --- |
| ローカル x 方向 | $u_1$ と `X12` | $u_2$ と `X21` |
| ローカル z 方向（左から右へ描いた要素では下向き） | $w_1$ と `Z12` | $w_2$ と `Z21` |
| 回転（反時計回り） | $\varphi_1$ と `M12` | $\varphi_2$ と `M21` |

この順に並べたものが、要素の変位ベクトルと力ベクトルです。

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

z が下向きで回転は反時計回りが正なので、せん断変形のない梁では、材軸の回転角は $\varphi = -\,\mathrm{d}w/\mathrm{d}x$ になります。

## ローカル剛性マトリクス {#local-stiffness-matrix}

要素荷重のない要素の材端力は $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$ で、

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

です。ここで

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ と $G$ は材料のヤング係数とせん断弾性係数、$A$ は断面積、$I_y$ は y 軸まわりの断面二次モーメント、$k$ は断面の**せん断補正係数**、$L$ は要素の長さです。$\Phi$ は**せん断パラメーター**で、部材が曲げに比べてせん断にどれだけ変形しやすいかを表します。部材が短く、せいが高くなるほど大きくなります。$\Phi = 0$ とすると、各項はオイラー・ベルヌーイ梁でおなじみの $12EI/L^3$、$6EI/L^2$、$4EI/L$、$2EI/L$ になります。軸方向と曲げの挙動は連成しません。$u_1$ と $u_2$ に関係するのは $k_N$ だけです。

y 軸を上向きにとる教科書では、このマトリクスの $-k_2$ の位置に $+6EI/L^2$ が書かれています。どちらも同じ剛性を表していて、違うのは横方向の変位の向きだけです。

::callout{type="details" title="マトリクスの導出：厳密な形状関数"}
荷重のない等断面のティモシェンコ部材では、つり合い式に厳密解があります。$u$ は $x$ の 1 次式、$w$ は 3 次式、$\varphi$ は 2 次式です。$\xi = x/L$ として材端変位で表すと、たわみは

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

となります。$\Phi = 0$ ではこれは 3 次のエルミート多項式 $N_1 = 1 - 3\xi^2 + 2\xi^3$、$N_2 = -L\,\xi(1-\xi)^2$ になり、負の符号は $\varphi = -w'$ によるものです。剛性マトリクスは、この厳密な変形形状を生じさせるのに必要な材端力を並べたものです。したがって部材の厳密な剛性であり、要素を増やすほど精度が上がる近似ではありません。ソルバーは変位図も同じ関数で描きます。
::

## せん断変形：ティモシェンコ梁かオイラー・ベルヌーイ梁か {#timoshenko-or-euler-bernoulli}

要素がせん断変形するかどうかは $\Phi$、つまり断面のせん断補正係数 $k$ だけで決まります。$kA$ がせん断を負担する断面積です。断面の種類ごとに、$k$ の初期値が決まっています。

| 断面 | せん断補正係数 $k$ |
| --- | --- |
| 初期モデルと組み込みの例題 | $10^{32}$。$\Phi \approx 0$ となり、オイラー・ベルヌーイ梁になる |
| ライブラリの I 形・H 形・広幅フランジ断面 | $h\,t_w / A$：ウェブがせん断を負担 |
| ライブラリの角形鋼管 | $2\,h\,t / A$：左右 2 枚の側板が負担 |
| ライブラリの長方形・正方形断面 | 0.833 |
| ライブラリの円形断面 | 0.9 |
| ライブラリの円形鋼管 | 0.5 |
| 多角形断面 | 初期値 0.833 |
| **断面を追加**ダイアログ | 初期値 1 |

細長い部材では違いはわずかです。等分布荷重を受ける単純梁では、せん断によってスパン中央のたわみが曲げによるたわみの $0.8\,\Phi$ 倍だけ増えます。鋼の IPE 200 では、スパン 6 m で 1.2 %、スパン 2 m では 11 % になります。せん断変形を無視するには、$k$ を `1e32` のような非常に大きな値にします。このサイトの動くモデル図は、特に断りがなければせん断に対して剛な例題の断面を使っているので、オイラー・ベルヌーイ理論による手計算と一致します。次の図はその例外です。

::model-figure{caption="スパン 2 m の IPE 200、k = h·tw/A = 0.393：スパン中央で w = 0.5657 mm。オイラー・ベルヌーイ理論の 0.5106 mm より 11 % 大きい（Φ = 0.135）"}
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

## 材端ヒンジ {#end-hinges}

[材端ヒンジ](/ja/essentials/elements#end-hinges)にチェックを入れると、要素のその端の曲げモーメントが 0 になります。このとき要素の材端回転角は自由になり、ソルバーはそれを**静的縮約**で消去します。6 つの自由度を、残す自由度 $a$ と解放する材端回転角 $b$ に分けると、

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}
$$

となります。$\mathbf{f}_\mathrm{fix}$ は[要素荷重](#element-loads)の固定端力です。2 行目からヒンジ位置の回転角

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right)
$$

が得られ、これを 1 行目に代入すると、縮約された剛性と固定端力が残ります。

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

ソルバーは $\mathbf{K}^{*}$ を 6 × 6 のマトリクスに書き戻し、解放した回転角の行と列は 0 にします。そのため、ヒンジのある要素もほかの要素とまったく同じように組み立てられます。解を求めたあとで上の式から $\mathbf{d}_b$ を復元するので、変位図にはヒンジ位置での折れが現れます。

終端節点にヒンジがある場合、$(w_1, \varphi_1, w_2)$ に対する曲げの部分は

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix}
$$

となり、$\Phi = 0$ では一端固定他端ローラー支持の部材でおなじみの剛性 $3EI/L^3$ になります。**両端**にヒンジがあると曲げの項は何も残らず、$EA/L$ だけになります。この要素は[トラス材](/ja/elements/truss)です。

ヒンジは節点ではなく、要素の端に属します。ある節点に集まるすべての要素がその節点でヒンジ結合されていると、節点自身の回転角には何もつながっていません。ソルバーはその回転角を 0 のままにするので害はありませんが、そのような節点に節点モーメントを与えると、それを受け止めるものがなく、剛性方程式が特異になります。

## 要素荷重 {#element-loads}

要素に沿って作用する荷重は、**等価節点荷重** $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ として解析に入ります。**固定端力** $\mathbf{f}_\mathrm{fix}$ は、両端を固定した要素に荷重を載せたとき、それを支える材端力です。

以下の式はすべてローカル座標系で書いています。グローバル座標系で入力した荷重（**LCS**、つまりローカル座標系のチェックを外した場合）は、まず要素の[角度](#transformation-matrix)の $c = \cos\theta$ と $s = \sin\theta$ を使ってローカル成分に変換します。

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

記号の上の横棒はグローバル成分を表します。線荷重は、要素自身の長さ 1 m あたりの値です。たとえば $(0, 0)$ から $(3, -4)$ へ向かう垂木では $L = 5$ m、$c = 0.6$、$s = -0.8$ です（上り勾配なので $z$ は減少します）。この垂木に重力方向の荷重 $\bar q_z = 10$ kN/m を与えると、$q_x = -8$ kN/m（斜面に沿って下向き）、$q_z = 6$ kN/m（材軸に直角）となり、垂木が受ける荷重の合計は $10 \times 3$ ではなく $10 \times 5 = 50$ kN です。

表の記号は次のとおりです。

- $q_z$、$q_x$：等分布荷重。$q_1 \to q_2$：台形分布荷重で、$q_1$ が始端節点、$q_2$ が終端節点の値。
- $F_z$、$F_x$、$M_y$：始端節点から距離 $a$ の位置に作用する集中荷重または集中モーメント。$b = L - a$。
- $\Delta T = \Delta T_b - \Delta T_t$：下縁が上縁より高温。$\Delta T_c$：材軸の温度上昇。$\alpha$ は材料の線膨張係数、$h$ は断面の**高さ**。

材軸に直角な方向（z 成分）、$\Phi = 0$ のとき、始端節点では次のとおりです。

$$
\begin{array}{l|cc}
\text{荷重} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

終端節点では次のとおりです。

$$
\begin{array}{l|cc}
\text{荷重} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

材軸方向（x 成分）は、$\Phi$ によらず次のとおりです。

$$
\begin{array}{l|cc}
\text{荷重} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="せん断変形を考慮した固定端力"}
等分布荷重と温度荷重の固定端力は、$\Phi$ によらず同じです。それ以外の荷重では、$D = 1 + \Phi$、$\Delta q = q_2 - q_1$（z 成分）として次のようになります。

$$
\begin{aligned}
&\text{台形分布荷重：} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{集中荷重 } F_z\text{：} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&\text{集中モーメント } M_y\text{：} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

これらは両端固定のティモシェンコ部材の厳密解です。ソルバーが荷重ごとに節点間に加えるたわみも、同じく厳密解です。
::

ヒンジのある要素では、固定端力は[材端ヒンジ](#end-hinges)の節で示したように $\mathbf{f}^{*}_\mathrm{fix}$ に縮約されます。たとえば終端節点にヒンジがある要素に等分布荷重を与えると、$Z_{12} = -5q_zL/8$、$M_{12} = q_zL^2/8$、$Z_{21} = -3q_zL/8$、$M_{21} = 0$ となります（$\Phi = 0$ のとき）。これは一端固定他端ローラー支持梁の固定端力です。

解を求めたあと、要素に沿った断面力は材端力と要素上の荷重のつり合いから、たわみは形状関数に両端固定時の荷重によるたわみを加えて求めます。詳しくは[部材に沿った結果](/ja/elements/analysis#results-along-the-members)を参照してください。

## 座標変換マトリクス {#transformation-matrix}

グローバル x 軸からグローバル z 軸の向き（画面上では時計回り）に測った角度 $\theta$ の要素では

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L}
$$

で、ローカル座標系の材端変位はグローバル座標系の材端変位から $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$ で求まります。ここで

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

回転角はどちらの座標系でも同じです。節点に**節点座標系の角度** $\beta$ が設定されている場合（[傾斜支点](/ja/essentials/nodes-supports#inclined-skewed-supports)）、その節点の未知量 $\mathbf{d}_n$ は、グローバル x 軸からグローバル z 軸の向きに $\beta$ だけ回転した節点自身の座標軸で表されます。そのグローバル成分は、節点の 3 つの自由度について

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

です。ソルバーは $\mathbf{T}$ の右から、両端節点の $\mathbf{T}_n$ を対角に並べたブロック対角マトリクス（節点座標軸のない節点では単位マトリクス）を掛けます。これで、要素はそれぞれの節点にその節点の座標軸で接続されます。

## グローバル剛性マトリクス {#global-stiffness-matrix}

グローバル座標系での要素の剛性マトリクスと等価節点荷重は

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq}
$$

です。要素にヒンジがあれば、$\mathbf{K}_l$ と $\mathbf{f}_\mathrm{eq}$ は縮約済みのものを使います。要素の**剛性マトリクス**ウィンドウ（*要素*の表または要素のコンテキストメニューから開きます）に表示されるのがこの $\mathbf{K}_g$ で、単位は SI 単位系の N/m、N、N·m です。[EduBeam がモデルを解く仕組み](/ja/elements/analysis)では、これらのマトリクスを組み立て、小さな例題を手計算で解いています。
