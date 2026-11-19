---
description: "EduBeam が実行する直接剛性法を、一端固定他端ローラー支持梁で手計算でたどる：自由度の番号付け、組み立て、支点、反力、部材に沿った結果。"
source: site
---

# EduBeam がモデルを解く仕組み

モデルを変更するたびに、EduBeam はブラウザの中で、数ミリ秒で**直接剛性法**によってモデルを解き直します。このページでは、ソルバー [@edubeam/fem](/ja/solver) の処理を小さな例題で順を追ってたどります。どの数値も手計算で再現でき、結果を信頼できる理由がわかります。

例題は一端固定他端ローラー支持梁です。鋼の IPE 300、長さ 4 m で、A で固定、B でローラー支持され、10 kN/m の等分布荷重を受けます。曲げ剛性は $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17{,}548$ kNm² で、せん断変形を無視した教科書の答えは $M_A = -qL^2/8 = -20$ kNm、$R_B = 3qL/8 = 15$ kN、$\varphi_B = qL^3/(48EI)$ です。

::model-figure{caption="一端固定他端ローラー支持梁、IPE 300、10 kN/m：A で M = −20 kNm、2.5 m の位置で +11.25 kNm、反力は 25 kN と 15 kN"}
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

## モデルから変位まで {#from-model-to-displacements}

::div{.steps}
### 自由度の番号付け {#number-the-degrees-of-freedom}

各節点には、そこにつながる要素が必要とする自由度が割り当てられます。要素はすべて[梁要素](/ja/elements/beam)なので、どの節点も `Dx`、`Dz`、`Ry` を持ちます。ソルバーはまず**拘束されていない**自由度に、続いて**拘束された**自由度に、それぞれ節点の順に番号を付けます。ここでは A が固定、B は鉛直方向だけが拘束されているので、拘束されていない自由度は 2 つです。

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$、$w$、$\varphi$ は、[自由度の表](/ja/elements/conventions#degrees-of-freedom)のとおり x 方向と z 方向の変位、および回転角です。各要素は、自分の 6 つの自由度が $\mathbf{r}$ の何番目にあたるかを表す**自由度番号**の組を持っています。1 から数えると、梁の自由度 $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ は $(3, 4, 5, 1, 6, 2)$ 番目にあります。

### 要素マトリクスの計算 {#compute-the-element-matrices}

ソルバーは要素ごとに[ローカル剛性マトリクス](/ja/elements/beam#local-stiffness-matrix)を作り、[材端ヒンジ](/ja/elements/beam#end-hinges)があれば縮約して、グローバル座標系に変換します（$\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$）。要素荷重はそれぞれ[等価節点荷重](/ja/elements/beam#element-loads) $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ になります。この梁は水平なので $\mathbf{T}$ は単位マトリクスで、等分布荷重からは次の値が得られます（単位は kN と kNm）。

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13.33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13.33 \end{bmatrix}.
$$

### 組み立て {#assemble}

全体剛性マトリクス $\mathbf{K}$ は、最初はすべて 0 です。各要素は、自分の成分 $(i, j)$ を、$i$ と $j$ の自由度番号が示す行と列に加えます。そのため、複数の要素が集まる節点では、その節点の自由度に対する各要素の剛性が足し合わされます。荷重ベクトル $\mathbf{F}$ にも、節点荷重と等価節点荷重を同じ方法で集めます。強制変位（支点沈下）は $\mathbf{r}_p$ に入ります。拘束されていない自由度、拘束された自由度の順に並べると、連立方程式は次のようにブロックに分かれます。

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

ここで $\mathbf{R}$ は未知の反力です。この例題では、梁の B 端の行と列だけが $\mathbf{K}_{uu}$ に入ります。

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282{,}450 \text{ kN/m} & 0 \\ 0 & 17{,}548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13.33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### 支点条件の導入と求解 {#apply-the-supports-and-solve}

支点を、ばねや対角成分に入れる大きな数で表すことはしません。拘束された自由度を切り離すだけです。拘束されていない自由度の変位は、次の式から求まります。

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

これを LU 分解で解きます。支点沈下がなければ $\mathbf{r}_p = \mathbf{0}$ で、この例題では

$$
\varphi_B = \frac{13.33}{17{,}548} = 7.598 \times 10^{-4} \text{ rad},
$$

となります。これは教科書の $qL^3/(48EI)$ そのもので、$u_B = 0$ です。

### 反力の計算 {#compute-the-reactions}

すべての変位がわかれば、拘束された自由度の行から反力、つまり支点が構造物に及ぼす力が求まります。

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

$w_A$ の行では、$\mathbf{K}_{pu}$ の $\varphi_B$ の列に $-6EI/L^2$ が、$\mathbf{F}_p$ に $qL/2$ が入っています。

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

z は下向きなので、これは上向きに 25 kN です。同様に $R_{\varphi A} = +20$ kNm、$R_{wB} = -15$ kN となり、教科書の $qL^2/8$ と $3qL/8$ に一致します。
::

## 部材に沿った結果 {#results-along-the-members}

ソルバーは要素ごとに、材端変位を $\mathbf{r}$ から取り出し、ローカル座標系に変換して（$\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$）、[材端力](/ja/elements/conventions#end-forces-element-results-table)を計算します。

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

この例題では、$\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ から $Z_{12} = -25$ kN、$M_{12} = 20$ kNm、$Z_{21} = -15$ kN、$M_{21} = 0$ が得られます。

任意の位置 $x$ の断面力は、要素の始端から $x$ までの部分のつり合い、つまり始端に作用する力とその部分に載る荷重から求まります。

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

$N_q$、$V_q$、$M_q$ は、その部分に載る荷重による項です。等分布荷重 $q_z$、$q_1$ から $q_2$ まで変化する台形分布荷重（$\Delta q = q_2 - q_1$）、距離 $a$ の位置の集中荷重 $F_z$ または集中モーメント $M_y$（$x \ge a$ でのみ作用）では、次のとおりです。

$$
\begin{array}{l|cc}
\text{荷重} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ は、$V_q$ の $q_z$ と $F_z$ を材軸方向の成分 $q_x$ と $F_x$ に置き換えたものです。

この例題では $M(x) = -20 + 25\,x - 5\,x^2$ kNm で、最大値は $x = 2.5$ m での $11.25$ kNm $= 9qL^2/128$ です。温度荷重には独自の項がなく、材端力を通してのみ作用します。

たわみは、[形状関数](/ja/elements/beam#local-stiffness-matrix)と材端変位の積に、両端を固定した要素に載る荷重によるたわみを加えたものです。ヒンジのある端は、まず[縮約](/ja/elements/beam#end-hinges)の式から自身の回転角を復元します。断面力図と変位図は、これらの関数を各部材に沿って評価したものです。

## 結果が厳密である理由 {#exact}

上の各ステップは、解いているモデルに対して厳密です。

- 要素の剛性は、仮定した多項式の形状からではなく、等断面のティモシェンコ部材の**厳密解**から得ているので、部材の真の剛性です。
- 固定端力は荷重の種類ごとの両端固定の厳密解なので、等価節点荷重で失われるものはありません。
- したがって節点変位は厳密で、節点間の断面力も実際の荷重のつり合いから求めるので、やはり厳密です。

EduBeam で要素分割を細かくする必要がないのはこのためです。1 部材を 1 要素で表しても、100 要素に分けても答えは同じです。節点が必要なのは、支点、ヒンジ、隅角部、断面の変わる位置など、部材そのものが変わる場所だけです。その間の集中荷重は要素荷重のままでかまいません。残る誤差は浮動小数点の丸め誤差だけで、結果の表では、同じ種類の値のうち最大のものの $10^{-12}$ 倍に満たない値を 0 と表示します。

ただし「厳密」とはモデルに対してであり、モデルには次の限界があります。

::div{.limits}
- **線形弾性材料**と**微小変位**：つり合いを変形前の形状で考えるので、2 次の効果（P–Δ 効果）や座屈は扱いません。
- **直線状の等断面部材**：1 要素につき断面は 1 つです。テーパー部材は、複数の要素で近似する必要があります。
- **x–z 平面内の曲げのみ**：ねじりや面外の挙動は扱いません。
::

## 構造物が安定しない場合 {#mechanisms}

変形せずに動ける構造物では、剛性マトリクスが特異になり、解が一意に定まりません。EduBeam は解く前にこれを調べ、解いたあとにも答えを確認します。

1. **解く前に**、構造物のつながった各部分を、形状だけから調べます。支点は、平面内の 3 つの剛体運動を止めなければなりません。拘束が 3 つ未満なら、モデルはまだ完成していないだけです（「構造物を解析するには支点が必要です。」）。一方、平行なローラー支点のように、拘束が 3 つ以上あってもまだ滑ったり回転したりできるなら、エラーになります。次にヒンジを調べます。すべての部材の長さを保ったままヒンジまわりに部材が回転できるなら、その構造物は不安定構造（機構）です。EduBeam はそのヒンジを丸で囲み、動きを表示します。
2. **解いている間に**、剛性マトリクスが完全に特異であれば、LU 分解が止まります：「不安定構造（機構）です：剛性マトリクスが特異になっています。」
3. **解いたあとに**、$10^6$ m または rad を超える変位や回転角があれば、丸め誤差を除けばマトリクスが特異だったことを意味します。EduBeam は、動いてしまう節点と方向を示します：「構造物が不安定です：… に対する抵抗がほとんどありません。」材料や断面の値を 0 と入力した場合や、単位を間違えて入力した場合も、ここに該当します。

すべての部材がヒンジ結合されている節点の、何にもつながっていない回転は、不安定構造ではありません。ソルバーはその回転角を 0 のままにします。それぞれのメッセージの意味と対処法は[トラブルシューティング](/ja/reference/troubleshooting#no-results-are-drawn)で説明しています。

## ソルバーを自分で動かす {#library}

ソルバーはオープンソースの [@edubeam/fem](/ja/solver) で、TypeScript で書かれ、ブラウザでも Node でも動きます。同じ一端固定他端ローラー支持梁を解くと、次のようになります。

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// SI 単位：m、N、Pa。鋼、IPE 300。k = 1e32 でせん断に対して剛になる
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // 固定
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // ローラー
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m、下向き

solver.solve()

solver.neq // 2：B の Dx と Ry が自由
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]：拘束されていない自由度、次に拘束された自由度
lc.R.toArray() // [0, -25000, 20000, -15000]：A (Dx, Dz, Ry)、次に B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000：N·m、固定端で上側引張
beam.computeBendingMomentAt(lc, 2.5) // 11250：正の曲げモーメントの最大値
```

`solve()` のあと、`solver.k` には組み立てたマトリクス $\mathbf{K}$ が、`solver.f` には荷重ベクトル $\mathbf{F}$ が入っているので、自分で組み立てたものと比べられます。このページの各ステップは、`Solver.ts`（番号付け）、`LinearStaticSolver.ts`（組み立て、求解、反力）、`Beam2D.ts`（要素マトリクスと結果）にあります。

::div{.actions}
[@edubeam/fem を使い始める](/ja/solver/getting-started) [API リファレンス](/ja/solver/reference) [GitHub のソースコード ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
