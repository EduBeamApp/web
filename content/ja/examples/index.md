---
description: "ワンクリックで EduBeam で開ける、解析済みの梁、ラーメン、トラス 6 題。それぞれに演習、注目する点、手計算を確かめるための解答が付いています。"
source: site
---

# 例題

下のカードは、どれも解析済みの動くモデルです。クリックすると、編集できる状態で [EduBeam]{.edubeam} に開きます。節点をドラッグしたり、荷重を変えたり、ヒンジにチェックを入れたりすると、図がすぐに追従します。ページの後半の演習では、各モデルを短い課題にしています。手計算の答えを確かめるための解答も付いています。

::feature-structures
::

同じモデルはアプリの **☰ → 例題**にもあり、[run.edubeam.app/?panel=examples&lang=ja](https://run.edubeam.app/?panel=examples&lang=ja){target="_blank"} を開くとこのギャラリーが直接表示されます。

::callout{type="info" title="6 題すべてで同じ部材"}
どの例題も同じ鋼の部材を使っています。$E = 210$ GPa、$I_y = 8356\ \text{cm}^4$（したがって $EI = 17{,}548$ kNm²）、断面積は $1\ \text{m}^2$ で、せん断剛性は非常に大きくしてあるので、軸方向変形とせん断変形は無視できます。そのため、細長い梁に対する教科書の公式が、アプリに表示される桁まで一致します。断面の高さは $1$ m で、これが効いてくるのは温度荷重の場合だけです。
::

## 演習の案 {#suggested-exercises}

まず手計算で答えを求め、それからアプリで確認してください。モデルは上のカードから、または各図の下の **EduBeam で開く**から開けます。モデルを開くと、いま開いているモデルは置き換えられます。<kbd>Ctrl</kbd>+<kbd>Z</kbd> で元に戻せるほか、**☰ → 最近のモデル**にも残ります。

### 不静定梁 {#exercise-indeterminate-beam}

長さ 3 m の梁で、A で固定、B でローラー支持され、10 kN/m の等分布荷重を受けます。

::model-figure{caption="A で固定、B でローラー支持、10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. 応力法または固定端モーメントの表を使って、反力と固定端のモーメントを手計算で求めます。
2. A の `Ry` のチェックを外して単純梁にします。曲げモーメントの最大値はどう変わるでしょうか。
3. A の `Ry` にもう一度チェックを入れ、B の `Ry` にもチェックを入れて両端固定にします。

**注目する点**：曲げモーメント図の符号が変わる位置と、固定端がローラー支点より多くの荷重を負担する様子。

::callout{type="details" title="解答"}
- 一端固定他端ローラー支持：$R_A = 5qL/8 = 18.75$ kN、$R_B = 3qL/8 = 11.25$ kN、$M_A = qL^2/8 = 11.25$ kNm（上側引張）。正の曲げモーメントの最大値は $9qL^2/128 = 6.33$ kNm で、せん断力が 0 になる B から 1.125 m の位置に生じます。
- 単純梁：スパン中央で $qL^2/8 = 11.25$ kNm。固定端が先ほど負担していたのと同じ値です。
- 両端固定：両端で $qL^2/12 = 7.5$ kNm（上側引張）、スパン中央で $qL^2/24 = 3.75$ kNm（下側引張）。
::

### 片持ち梁 {#exercise-cantilever}

長さ 4 m の片持ち梁で、A で固定され、自由端 B に下向きの 18 kN を受けます。

::model-figure{caption="自由端に 18 kN を受ける片持ち梁"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. 固定端のモーメント、先端のたわみ、先端の回転角を求めます。**結果 → 節点結果**の節点 B の値と比べてください。
2. **断面**タブで $I_y$ を半分にします。何が変わり、何が変わらないでしょうか。
3. 集中荷重を、合計が同じ 18 kN になる 4.5 kN/m の等分布荷重に置き換えます。**荷重**タブで節点荷重を削除し、**要素荷重を追加**を使います。

**注目する点**：曲げモーメント図の形。集中荷重では直線、等分布荷重では放物線になります。

::callout{type="details" title="解答"}
- $M_A = FL = 72$ kNm、$w_B = FL^3/(3EI) = 21.88$ mm、$\varphi_B = FL^2/(2EI) = 8.21$ mrad。
- $I_y$ を半分にすると、たわみは 2 倍の 43.77 mm になります。モーメントは 72 kNm のままです。片持ち梁は静定なので、断面力が剛性に左右されないからです。
- 等分布荷重：$M_A = qL^2/2 = 36$ kNm、$w_B = qL^4/(8EI) = 8.21$ mm。荷重の合計が同じでも、モーメントは半分、たわみは 8 分の 3 になります。
::

### ワーレントラス {#exercise-pratt-truss}

スパン 9 m、高さ 1.8 m のトラスで、上弦材の 3 つの節点 E、F、G にそれぞれ 8 kN を受けます。軸力を見るには、表示オプションで **N (x)** にチェックを入れます（斜材が交互に向きを変え、垂直材のないこの形式は、多くの教科書でワーレントラスと呼ばれています）。

::model-figure{caption="節点 A〜G、E、F、G にそれぞれ 8 kN"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. 反力を求め、次に節点法で端斜材 A–E と下弦材 A–B の部材力を求めます。
2. 切断法で、中央の格間（パネル）の上弦材の部材力と下弦材 B–C の部材力を求めます。
3. このモデルの節点は剛接合です。**要素**タブですべての部材の両端の材端ヒンジにチェックを入れてピン接合のトラスにし、軸力を比べます。
4. 斜材 B–F を削除します。まず剛接合のまま、次にヒンジ結合で試します。トラスはまだ安定しているでしょうか。

**注目する点**：符号の並び方。上弦材は圧縮、下弦材は引張、斜材は引張と圧縮が交互になります。

::callout{type="details" title="解答"}
- 反力：A と D でそれぞれ 12 kN。
- 端斜材：15.62 kN の圧縮。下弦材 A–B と C–D：10.00 kN の引張。
- 上弦材 E–F と F–G：13.33 kN の圧縮（B まわりのモーメント：$(12 \cdot 3 - 8 \cdot 1.5)/1.8$）。下弦材 B–C：16.67 kN の引張（F まわりのモーメント：$(12 \cdot 4.5 - 8 \cdot 3)/1.8$）。内側の斜材：5.21 kN。E と G から下弦材へ下りる斜材は引張、F へ上る斜材は圧縮です。
- 剛接合とピン接合で、軸力の差は 0.1 % 以内です。三角形で構成されたトラスでは曲げが無視できるほど小さく、そのためピン接合のモデルが成り立ちます。
- B–F がなくても、剛接合のトラスはラーメンとしての働きで安定しており、曲げモーメントは約 3 kNm です。ヒンジ結合では部材が 1 本足りず、不安定構造（機構）になります。EduBeam はその動き方を表示します。
::

### 3 径間連続梁 {#exercise-three-span-continuous-beam}

長さ 16 m の梁で、スパンは 5 + 6 + 5 m です。第 1 スパンに 8 kN/m、C に 20 kN、第 3 スパンに 6 kN/m を受けます。開いた時点では、A と D だけが支持されています。

::model-figure{caption="開いた時点：A と D だけで支持"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. 開いた時点では、スパン 16 m の単純梁 1 本です。反力と、B と C のモーメントを求めます。
2. B と C の `Dz` にチェックを入れ、4 つの支点で支える連続梁にします。
3. 三連モーメント式で B と C の支点上のモーメントを求め、次に反力を求めます。

**注目する点**：中間支点の上に現れる負の曲げモーメント（上側引張）、すべてのモーメントがどれだけ小さくなるか、C が支点になったあと 20 kN の荷重がどうなるか。

::callout{type="details" title="解答"}
- 単純梁：$R_A = 44.69$ kN、$R_D = 45.31$ kN、$M_B = 123.4$ kNm、$M_C = 151.6$ kNm（どちらも下側引張）。
- 連続梁では $M_A = M_D = 0$ として
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  から $M_B = -9.766$ kNm、$M_C = -5.859$ kNm（上側引張）が得られます。C の 20 kN はそのまま支点に伝わり、梁を曲げません。
- 反力：A 18.05 kN、B 22.60 kN、C 35.52 kN（20 kN を含む）、D 13.83 kN。合計は荷重の 90 kN に等しくなります。

::model-figure{caption="4 つの支点で支えた連続梁"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### 門形ラーメン {#exercise-portal-frame}

高さ 6 m の 2 本の柱に長さ 8 m の梁を載せたラーメンで、A で固定、D でローラー支持されています。梁に 10 kN/m、右上の隅角部 C に左向きの 8 kN と下向きの 10 kN を受けます。

::model-figure{caption="A で固定、D でローラー支持：梁に 10 kN/m、C に 8 kN と 10 kN"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. このラーメンは何次不静定でしょうか。
2. A の `Ry` のチェックを外して、A をピン支点にします。これでラーメンは静定になります。反力と隅角部 B、C のモーメントを手計算で求めます。
3. A の `Ry` にもう一度チェックを入れ、次に D の `Dx` にチェックを入れて D をピン支点にします。変位図で梁の水平変位を見てください。

**注目する点**：ラーメンの頂部がどちらへ動くか。開いた時点のラーメンでは、8 kN の荷重に逆らって右へ動きます。なぜでしょうか。

::callout{type="details" title="解答"}
- 反力が 4 つ（固定端に 3 つ、ローラー支点に 1 つ）、つり合い式が 3 つなので、1 次不静定です。D もピン支点にすると 2 次不静定です。
- A をピン支点にした場合：$V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN、$V_A = 46$ kN、$H_A = 8$ kN（右向き）。隅角部 B のモーメントは $8 \cdot 6 = 48$ kNm です。C では 0 です。D に水平反力がないので、右の柱は 44 kN の軸力だけを負担します。
- 開いた時点では、頂部は右へ 9.5 mm 動きます。荷重を受けた梁からのモーメントが、固定された柱を 8 kN の荷重よりも大きく曲げるためです。D をピン支点にすると、D が水平方向に 4.9 kN を負担し、頂部は左へ 4.8 mm 動きます。
::

### 温度荷重 {#exercise-temperature-load}

スパン 8 m の単純梁で、材軸の温度が $\Delta T_c = 20$ K 上昇し、下縁は上縁より 10 K 低温です（$\Delta T_b - \Delta T_t = -10$ K）。

::model-figure{caption="スパン 8 m の単純梁：温度が 20 K 上昇し、下縁は上縁より 10 K 低温"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. 結果を見る前に考えます。温度によってどの断面力が生じ、梁はどう動くでしょうか。
2. B の `Dx` にチェックを入れて、梁が伸びないようにします。
3. さらに両端の `Ry` にもチェックを入れます。

**注目する点**：変位図と**結果 → 節点結果**の数値。拘束するまでは、梁は断面力を生じずに動くだけです。

::callout{type="details" title="解答"}
- 静定梁は自由に伸びたり曲がったりできるので、断面力は生じません。B は $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1.92$ mm だけ外側へ動きます。低温の下縁が縮むので、梁は曲率 $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1.2 \cdot 10^{-4}$ 1/m で上に凸に反ります。両端は $\kappa L/2 = 0.48$ mrad 回転し、スパン中央は $\kappa L^2/8 = 0.96$ mm 持ち上がります。
- 両端を x 方向に拘束した場合：$N = -EA\alpha\Delta T_c = -50{,}400$ kN の圧縮。この大きさは仮の断面積 1 m² によるもので、断面積 28.48 cm² の IPE 200 なら 143.5 kN です。
- 両端を固定した場合：梁全体に一定のモーメント $EI\alpha(\Delta T_b - \Delta T_t)/h = 2.11$ kNm が生じます。
::

## 解説付きのチュートリアル {#worked-tutorials}

より大きなモデルを段階を追って組み立て、手計算で確認します。

::card-grid{cols="2"}
:::card{title="傾斜梁" icon="lucide:move-diagonal" to="/ja/tutorials/inclined-beam"}
積雪荷重を受ける垂木：水平投影長さ 1 m あたりの荷重、勾配に沿った軸力とせん断力、傾けたローラー支点。
:::
:::card{title="3 ヒンジラーメン" icon="lucide:triangle" to="/ja/tutorials/three-hinged-frame"}
中間ヒンジのあるラーメンの反力、N、V、M。
:::
:::card{title="平面トラス" icon="lucide:git-fork" to="/ja/tutorials/truss"}
節点法、切断法、ゼロメンバー、仮想仕事の原理によるたわみ。
:::
:::card{title="連続梁と支点沈下" icon="lucide:spline" to="/ja/tutorials/continuous-beam"}
2 径間連続梁を応力法で解き、さらに中間支点が 10 mm 沈下した場合を解きます。
:::
::

公式（解析解）による確認例は、[手計算による結果の確認](/ja/guide/verification)にまとめています。

## さらに問題を解く {#more-problems}

[構造力学の練習問題](/ja/practice)のページでは、求めるたびに数値の異なる新しい梁、ラーメン、トラスが出題され、反力と、曲げモーメントまたは部材力の最大値をすぐに答え合わせできます。授業では、[試験問題作成ツール](/ja/exam)で学生ごとに異なる試験問題を解答付きで印刷でき、[@edubeam/plot](/ja/guide/teaching#exercise-sheets-tests-and-slides-from-code) を使えばコードから演習プリントを作れます。

## 例題を投稿する {#contribute-an-example}

授業に役立つモデルはありますか。[GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) でリンクを共有してください。ギャラリーに加えることがあります。
