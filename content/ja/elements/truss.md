---
description: "EduBeam のトラス材：両端ヒンジの梁要素がそのまま古典的なトラス要素になる理由と、その剛性マトリクスと座標変換マトリクス。"
source: site
---

# トラス要素

トラス材は軸力だけを負担します。EduBeam には独立したトラス要素はありません。トラス材は、**両端の材端ヒンジ**にチェックを入れた[梁要素](/ja/elements/beam)です。このページでは、それがなぜ古典的な 2 節点トラス要素とまったく同じになるのかを示し、その剛性マトリクスと座標変換マトリクスを導きます。また、教科書のトラス材にはできなくても、両端ヒンジの部材ならできることも説明します。

::model-figure{caption="すべての部材が両端ヒンジ：垂木は N = −7.071 kN、下弦材（タイ）は +5 kN で、曲げを受ける部材はない"}
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

アプリでトラスをモデル化するには、すべての部材で**始端ヒンジ**と**終端ヒンジ**にチェックを入れます。マウスで部材を描く前にバナーで両方にチェックを入れておくこともできます（[材端ヒンジ](/ja/essentials/elements#end-hinges)）。[チュートリアル：平面トラス](/ja/tutorials/truss)では、トラスを一歩ずつ組み立てます。

## 自由度 {#degrees-of-freedom}

トラス材が使うのは、[ローカル座標系](/ja/elements/conventions#element-local-axes)での各端の 2 つの並進変位です。

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="トラス材：両端ヒンジで、各端に 2 つの並進変位"}
::

| 方向 | 始端節点 (1) | 終端節点 (2) |
| --- | --- | --- |
| ローカル x 方向 | $u_1$ と `X12` | $u_2$ と `X21` |
| ローカル z 方向 | $w_1$ と `Z12` | $w_2$ と `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

すべての部材が梁要素なので、節点は回転の自由度 `Ry` を持ったままです。ただし両端ヒンジの部材はその回転の影響を受けず、伝えることもありません。材端モーメント `M12` と `M21` は常に 0 です。すべての部材がヒンジ結合されている節点では、その回転を拘束するものがありません。ソルバーはその回転角を 0 のままにしますが、そのような節点に節点モーメントを与えると受け止めるものがなく、「不安定構造（機構）です：剛性マトリクスが特異になっています。」というメッセージで解析が止まります。

## ローカル剛性マトリクス {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

ここで $E$ はヤング係数、$A$ は断面積、$L$ は部材の長さです。ひずみエネルギーを生じるのは部材の伸縮だけなので、要素荷重のない部材の軸力は一定です。

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### 両端ヒンジの梁がトラス材になる理由 {#why-a-beam-with-two-hinges-is-a-truss-bar}

[梁の剛性マトリクス](/ja/elements/beam#local-stiffness-matrix)から、[材端ヒンジ](/ja/elements/beam#end-hinges)の場合と同じように両端の回転角を縮約します。軸方向の項は回転角を含まないので、そのまま残ります。曲げの項はすべて消えます。両端の回転が自由になると、材端変位 $w_1$、$w_2$ がどんな組み合わせでも、部材はヒンジまわりに剛体として回転するだけで、エネルギーを必要としないからです。ソルバーはこの縮約を、せん断補正係数の値によらず数値的に行い、浮動小数点の丸め誤差の範囲で上のマトリクスを得ます。

::callout{type="details" title="縮約の計算"}
曲げの部分について、自由度を残すもの $a = (w_1, w_2)$ と解放するもの $b = (\varphi_1, \varphi_2)$ に並べます。梁のマトリクスから、$k_1$〜$k_4$ とせん断パラメーター $\Phi$ を[梁要素のページ](/ja/elements/beam#local-stiffness-matrix)の定義のとおりとすると、

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

$\mathbf{K}_{ab}$ の 2 つの列は等しいので、効いてくるのは $\mathbf{K}_{bb}^{-1}$ の全成分の和 $2/(k_3 + k_4)$ だけです。

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

$k_3 + k_4 = 6EI_y / ((1+\Phi)L)$ なので係数は $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$ となり、これはちょうど $\mathbf{K}_{aa}$ に等しくなります。したがって、縮約後の曲げ剛性 $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ は 0 です。
::

## 座標変換マトリクス {#transformation-matrix}

グローバル x 軸からグローバル z 軸の向きに測った角度 $\theta$ の部材で、$c = \cos\theta = (x_2 - x_1)/L$、$s = \sin\theta = (z_2 - z_1)/L$ とすると、ローカル座標系の変位は $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$ で、

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}
$$

です。これは[梁の座標変換マトリクス](/ja/elements/beam#transformation-matrix)から並進の行と列を取り出したものです。z が下向きなので、$s$ の符号に注意してください。上のトラスの垂木 A → C は上り勾配なので $z_2 - z_1 = -3$ m となり、$c = 0.7071$、$s = -0.7071$ です。

## グローバル剛性マトリクス {#global-stiffness-matrix}

$\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$ を計算すると、次のようになります。

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

両端ヒンジの部材の**剛性マトリクス**ウィンドウでは、並進の行と列にこの値が、回転の行と列には 0 が表示されます。

## ヒンジ結合の梁ならではの使い方 {#where-a-hinged-beam-does-more}

EduBeam のトラス材は梁要素のままなので、教科書のトラス材にはできないことが 2 つあります。

- **部材に沿った荷重を受けられます。** 自重のような線荷重を部材に与えると、部材は節点間で単純梁のように曲がり、各節点に $qL/2$ を伝えます。ほかの部材は、この節点荷重に対するトラスの軸力を負担します。荷重を受けた部材自身では、荷重の材軸方向成分によって $N$ が直線的に変化し、トラスとしての部材力は部材中央での値になります。
- **梁と組み合わせられます。** 特別な要素を用意しなくても、タイ材や筋かいのようなヒンジ結合の部材をラーメンに組み込めます。

上のトラスの下弦材に 5 kN/m を加えてみます。

::model-figure{caption="下弦材に 5 kN/m を加えた同じトラス：軸力は変わらず、下弦材は M = qL²/8 = 22.5 kNm で曲がる"}
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

手計算で確認します。節点 C での鉛直方向のつり合い $2\,N \sin 45^\circ + 10 = 0$ から、各垂木の軸力は $N = -7.071$ kN です。節点 A では、垂木の水平成分 $7.071 \cos 45^\circ = 5$ kN が下弦材とつり合い、下弦材は $N = +5$ kN の引張になります。下弦材に載せた荷重は、その両端の支点に直接伝わります。各反力は $qL/2 = 15$ kN 増えますが、軸力には何も加わりません。

トラスは、ピン接合の構造物として安定でなければなりません。たとえば斜材のない四角形の格間（パネル）は不安定構造（機構）です。EduBeam は該当するヒンジを示し、その動きを表示します（[トラブルシューティング](/ja/reference/troubleshooting#no-results-are-drawn)）。
