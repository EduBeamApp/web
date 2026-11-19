---
title: StructurePlot
description: "StructurePlot で平面の梁、ラーメン、トラスを描画。レイヤー、段階的に組み上がる図、演習用に記号で示す未知の反力、サムネイル、サイズ、単位、ポインターでの値の読み取り。"
order: 2
group: コンポーネント
source: site
---

# StructurePlot

`StructurePlot` は構造物全体を、枠の幅に合わせて描きます。部材、ヒンジ、支点、荷重、反力、N 図・V 図・M 図、変位図です。ソルバー、またはソルバーから作った[プレーンなモデル](/ja/plot/model)を渡し、何を描くかを指定します。

```vue
<StructurePlot :solver="solver" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

すべてのプロパティの型と既定値は[コンポーネント API](/ja/plot/components#structureplot) にあります。

下の図は、`nodeLabels` と `dimensions` を表示し、`hover` を設定し、このサイトの数値形式（有効数字 4 桁）を使った `StructurePlot` です。結果を切り替えたり、部材にポインターを合わせて値を読んだりしてみてください。

::model-figure{caption="門形ラーメン：柱脚はピン支点、梁に 10 kN/m、B に 15 kN"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: B, fx: 15 }
results: [M, V, N, w]
show: [nodeLabels, dimensions]
---
::

## レイヤー {#layers}

図はレイヤーで構成されます。レイヤーは、指定した順序にかかわらず、決まった順序で重ねて描かれます。

| レイヤー | 描くもの |
| --- | --- |
| `members` | 部材。ヒンジは小さな円 |
| `supports` | 各支点の記号。傾斜支点では回転させて描く |
| `loads` | 節点荷重と部材荷重、温度荷重、支点沈下と、その値 |
| `reactions` | 反力。矢印と曲線の矢印に値を添えて描く。`reactionLabels: 'names'` では、演習問題の[記号で示す未知数](#reactions-as-unknowns)として描く |
| `nodes` | 各節点を小さな円で |
| `nodeLabels` | 節点ラベル |
| `dimensions` | 演習プリントと同じ連続寸法。節点間と集中荷重間の各区間を構造物の下に、各階の高さを右側に、全体寸法をその外側の 2 段目に |
| `N`, `V`, `M` | 軸力図、せん断力図、曲げモーメント図 |
| `w` | 変位図 |

`layers` を省略すると、部材、支点、荷重、反力に加え、構造物に合わせて選んだ結果を 1 つ描きます。梁とラーメンでは `M`、トラスでは `N`、どの部材にも力が生じない場合（温度荷重を受けても自由に伸びられる梁など）は `w` です。

断面力図の描き方は EduBeam アプリと同じです。N 図と V 図は部材に直交するハッチングで描き、M 図は引張側に描くので、正の曲げモーメント（下側引張）は梁の下側に出ます。`:moment-on-tension-side="false"` を指定すると、M 図を圧縮側に描きます。トラスでは各部材の部材力を部材に沿って 1 回だけ書き、符号で色分けします。

## 段階的に組み上がる図 {#figures-that-build-up}

`reserve` には、非表示の間も場所を確保しておくレイヤーを指定します。予約したレイヤーはすべて最初からレイアウトに含まれるので、あるレイヤーを表示すると、それが所定の位置にフェードインし、ほかのものは動きません。

```vue
<script setup lang="ts">
import type { PlotLayer } from '@edubeam/plot'

const stages: PlotLayer[][] = [
  ['nodes', 'nodeLabels', 'dimensions'],
  ['nodeLabels', 'members', 'supports'],
  ['nodeLabels', 'members', 'supports', 'loads'],
  ['members', 'supports', 'loads', 'reactions'],
  ['members', 'supports', 'reactions', 'M'],
]
const all = [...new Set(stages.flat())]
// `frame` は解析済みのソルバー、`step` は現在の段階。コンポーネント全体は「スライドと講義資料」のページにある
</script>

<template>
  <StructurePlot :solver="frame" :layers="stages[step]" :reserve="all" />
</template>
```

既定で有効な `animate` により、レイヤーはフェードインし、部材は端から端へ描かれていきます。`prefers-reduced-motion` が有効なときはアニメーションしません。[スライドと講義資料](/ja/plot/slides)では、この図をスライドに載せています。

## 断面力図の値 {#diagram-values}

各値は、教科書の図と同じように、対応する縦距の先端のすぐ外側に書かれます。書かれるのは、値がゼロでない部材端すべて、その間の極値、段差の位置では両側の値で、剛な隅角部では 1 回だけです。値は表示単位（N と V は kN、M は kNm）の数値だけで、反力も EduBeam アプリと同じく数値だけです。単位を書くのは与えられた量、つまり荷重、支点沈下、温度変化だけです。ほかのラベル、部材、矢印と重なるラベルは、同じ先端のまわりのほかの位置を試し、空きがなければ省略されます。そのため、数値が 2 つ重なることはありません。荷重と反力の値を先に配置するので、断面力図の数値に押し出されることもありません。トラスの部材力は省略されず、部材に沿って移動し、反対側に移り、最後の手段として縮小されます。

`result-label-mode="axis"` を指定すると、値は EduBeam アプリと同じく縦距に沿った向きで書かれます。読者が 2 つの書き方を切り替えられるようにするなら、`:reserve-label-modes="['horizontal', 'axis']"` を指定してください。切り替えても図が動きません。

## 未知数としての反力 {#reactions-as-unknowns}

演習プリントでは反力を求めさせるので、反力は値なしで示す必要があります。`reaction-labels="names"` を指定すると、支点が拘束する方向ごとに、正とする向きに矢印を描きます。向きは、節点の x 方向（支点を回転させていなければ右向き）、上向き、そして固定端の反力モーメントは反時計回りです。それぞれ節点名にちなんで *A<sub>x</sub>*、*A<sub>z</sub>*、*M<sub>A</sub>* と名前が付き、イタリック体で、下付き文字も正しく組んで書かれます。これで、すべての答えの符号が図の上で定義されます。逆向きに作用する反力は負になります。

```vue
<StructurePlot
  :model="model"
  :layers="['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']"
  reaction-labels="names"
/>
```

![上は演習プリントとして描いた一端固定他端ローラー支持梁：A で固定、B にローラー、スパン中央に 40 kN、3 m と 3 m の連続寸法と全長 6 m、反力は記号付きの矢印 A_x、A_z、M_A、B_z。下は同じ梁を既定の反力ラベルで描いたもの：上向きに 27.5 と 12.5、固定端の反力モーメント 45、曲げモーメントは固定端の −45 から荷重直下の 37.5 まで](/screenshots/ja/p4-plot-reaction-names.webp){.shot-lg}

記号を描くのに結果は要らないので、解いていないモデルでも演習プリントとして描けます。解答では `reactionLabels` を `'values'` のままにします。記号と値では必要な場所が異なります（ゼロの水平反力は、演習プリントには記号付きで描かれても、解答には矢印が描かれません）。そのため、両者を切り替える図では `:reserve-reaction-labels="['names', 'values']"` で両方の場所を確保してください。そうすれば図は動かず、ラベルだけが変わります。[演習問題と試験](/ja/plot/exercises#the-exercise-in-a-page)の演習問題カードは、`answers` プロパティでこれを切り替えます。このサイトの[構造力学の練習問題](/ja/practice)でも、学生が答えを表示すると同じように切り替わります。

## サムネイル {#thumbnails}

`compact` は、約 400 × 200 px のタイル向けの描き方です。記号は小さく、文字は 11.5 px、値は 1 部材あたり最大 2 つで、分布荷重には `q =` を付けず大きさだけを書きます。

```vue
<StructurePlot v-for="t in tiles" :key="t.title" :solver="t.solver" compact :height="200" :title="t.title" />
```

このサイトの[例題](/ja/examples/)のページは、この方法で描いています。

## サイズ {#size}

図は枠の大きさを測り、その幅で、実ピクセル単位でレイアウトします。`height` を指定しないと、高さは図の内容に合わせて決まり、その上限は `maxHeight`（既定は $\max(320, 0.75 \times \text{width})$）です。サーバー上など、まだ測れないときは `width`（既定 640 px）を使います。

| プロパティ | 既定値 | 設定する内容 |
| --- | --- | --- |
| `width` | 640, compact 400 | 枠を測るまでのレイアウト幅、px |
| `height` | follows the drawing | 固定の高さ、px |
| `maxHeight` | $\max(320, 0.75w)$, compact none | 自動で決まる高さの上限 |
| `padding` | 6 | 図の周囲の余白、px |
| `fontSize` | 13, compact 11.5 | 文字サイズ、px |
| `diagramSize` | 48, compact 26 | 最大の縦距の長さ、px |
| `deformedSize` | 30, compact 18 | 変位図の最大変位、px |

### 複数の図を同じ縮尺で {#several-plots-at-one-scale}

各図は断面力図をそれぞれの最大値に合わせて縮尺するので、20 kNm のモーメントも 80 kNm のモーメントも同じ大きさに見えます。比較するには、`diagramScale` で縮尺を SI 単位あたりのピクセル数として固定します。

```vue
<script setup lang="ts">
import { StructurePlot } from '@edubeam/plot'
import { simpleBeam } from './beams' // 「クイックスタート」より：(スパン m, q kN/m) => 解析済みのソルバー

const spans = [4, 6, 8].map((L) => ({ L, solver: simpleBeam(L, 10) }))
// 0.5 px/kNm（0.5e-3 px/N·m）：スパン 8 m の 80 kNm は 40 px、スパン 4 m の 20 kNm は 10 px の深さで描かれる
const scale = { M: 0.5e-3 }
</script>

<template>
  <figure v-for="s in spans" :key="s.L">
    <StructurePlot :solver="s.solver" :layers="['members', 'supports', 'M']" :diagram-scale="scale" />
    <figcaption>L = {{ s.L }} m</figcaption>
  </figure>
</template>
```

## 単位と数値 {#units-and-numbers}

内部の値は SI 単位で、表示のときだけ換算します。既定の表示単位は kN、kNm、kN/m、m、mm、mrad、K です。どの単位も記号と倍率で上書きでき、表示値 = SI 値 × 倍率 となります。

```vue
<StructurePlot :solver="solver" :units="{ force: { symbol: 'N', scale: 1 } }" />
```

数値は `Intl.NumberFormat` で整形され、既定は英語の書式で小数点以下最大 1 桁です。ページの言語に合わせるには、独自の書式を渡します。

```vue
<StructurePlot :solver="solver" :number-format="new Intl.NumberFormat('cs', { maximumFractionDigits: 2 })" />
```

マイナス記号にはハイフンではなく正式なマイナス記号（−）を使い、丸めてゼロになる値が −0 と表示されることはありません。単位の名前は `force`、`moment`、`distributed`、`length`、`displacement`、`rotation`、`temperature` です。出発点として `KN_UNITS` と `SI_UNITS` がエクスポートされています。

## 値の読み取り {#reading-values}

`hover` を指定すると、ポインターの下にある部材上の点で、表示中の結果を読み取ります。読み取った値には、描かれている位置に印が付きます。表示中の各断面力図では縦距の先端に点が打たれ（段差では両方の先端）、変位図では変位図上に点が打たれます。値はピル型のラベルに一覧表示され、`M = 54 kNm` のように、段差では `V = 13.3 → −6.7 kN` のように両側の値が示されます。ポインターが部材の真上になくても、その部材の断面力図の上にあれば部材を捉えます。値はデータとしてもイベントで発行されます。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { StructurePlot, type Readout } from '@edubeam/plot'
import { portalFrame } from './frame' // 「スライドと講義資料」より：() => 解析済みのソルバー

const frame = portalFrame()
const reading = ref<Readout | null>(null)
</script>

<template>
  <StructurePlot :solver="frame" :layers="['members', 'supports', 'M']" hover @readout="reading = $event" />
  <p v-if="reading">
    Member {{ reading.member }}, {{ reading.x.toFixed(2) }} m from its start:
    M = {{ (reading.values.M.left / 1e3).toFixed(1) }} kNm
  </p>
</template>
```

読み取り値は `{ member, x, px, py, values, u }` です。部材、部材に沿った位置（m）、画面上の点（px）、`N`、`V`、`M`、`w` それぞれの `{ left, right }`（SI 単位）、そして軸方向変位 `u` です。ポインターが離れると `null` になります。このサイトでその場で描画している図は `hover` を使っています。ポインターを合わせてみてください。

`hover` を指定しないと、図はイベントリスナーを一切登録しません。そのため図の上でもページがスクロールし、リンク内の図をタップするとリンク先に移動します。`hover` を指定した場合もポインターイベントだけを受け取るので、タッチスクリーンでの縦スクロールとピンチズームはそのまま使えます。

## アクセシビリティ {#accessibility}

各図は `<svg role="img">` で、`title` プロパティ、または「Structure with its loads, reactions, bending moment」のような表示内容の説明がその名前になります。非表示の予約レイヤーには `aria-hidden` が付きます。
