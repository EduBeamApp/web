---
title: 節点と支点
description: "@edubeam/fem のモデルの節点を作り、自由度を拘束して支点にします。傾斜したローラー支点のための軸の回転と、解いた後の節点の変更も説明します。"
order: 3
group: モデル化
source: site
---

# 節点と支点 {#nodes-and-supports}

節点は、部材どうしをつなぐ点です。支点は独立したオブジェクトではなく、節点が拘束する自由度のリストです。このページのコード片は、[クイックスタート](/ja/solver/getting-started)のようなプログラムの一部で、そこで定義した `solver`、`domain`、`lc` を使います。

## 節点の作成 {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| 引数 | 型 | 意味 |
| --- | --- | --- |
| `label` | `string \| number` | 節点の名前。文字列として保存されるので、`1` と `'1'` は同じ節点 |
| `coords` | `number[]` | `[x, y, z]`（m）、`y = 0`。z は下向き |
| `bcs` | `DofID[]` | 支点が拘束する自由度。省略すると自由な節点 |

戻り値は `Node` で、`domain.getNode(label)` で後から取り出せます。すでに使われているラベルを指定すると、古い節点が置き換えられます。

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // 自由：高さ 4 m の柱の頂部
```

## 支点 {#supports}

EduBeam アプリの各支点は、拘束する自由度の組で表せます。

| 支点 | `bcs` | 拘束するもの |
| --- | --- | --- |
| 固定 | `[DofID.Dx, DofID.Dz, DofID.Ry]` | すべて |
| ピン | `[DofID.Dx, DofID.Dz]` | 2 方向の変位。回転は自由 |
| ローラー | `[DofID.Dz]` | 鉛直変位。x 方向に移動できる |
| 鉛直ローラー | `[DofID.Dx]` | 水平変位。z 方向に移動できる |
| ローラー（回転拘束） | `[DofID.Dz, DofID.Ry]` | 鉛直変位と回転。x 方向に移動できる |
| 鉛直ローラー（回転拘束） | `[DofID.Dx, DofID.Ry]` | 水平変位と回転。z 方向に移動できる |
| 回転のみ拘束 | `[DofID.Ry]` | 回転 |

並べた順序が、そのまま[反力](/ja/solver/results#reactions)が返される順序になります。構造物には少なくとも 3 つの拘束された自由度が必要で、しかも不安定構造（機構）として動けないように配置されていなければなりません。[解析に失敗するとき](/ja/solver/solving#when-solving-fails)を参照してください。

拘束した自由度には、所定の量の変位（支点沈下）を与えることもできます。[強制変位](/ja/solver/temperature-settlements#prescribed-displacements)を参照してください。

## 傾斜支点 {#inclined-supports}

斜面上のローラー支点は、節点を鉛直方向ではなく、斜面に垂直な方向に拘束します。`updateLcs` で節点の座標軸を回転させると、`bcs` は回転後の軸を基準にします。「クイックスタート」のプログラムなら、B を次のように作ります。

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // 自身の z 方向を拘束
const a = (30 * Math.PI) / 180 // 30°、x から z の向き：画面上で時計回り
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx` は節点自身の x 軸をグローバル座標系で表したベクトル、`locy` は y 軸で、`[0, 1, 0]` のままにします。EduBeam アプリでは、同じ角度を*節点座標系の角度*に 30° と入力します。

`solve()` の後、B は斜面に垂直な方向に梁を押し、水平成分は A のピン支点が受け持ちます。

```ts
b.getReactions(lc).values // [-41569]：B 自身の z 方向の力（N）、36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]：x 方向、z 方向、モーメント
```

::model-figure{caption="30° 回転させたローラー支点：反力は斜面に垂直で、梁には引張が生じる"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, N]
show: [nodeLabels]
---
::

鉛直成分は変わらず $qL/2 = 36$ kN です。水平成分 $36 \tan 30° = 20.8$ kN が、梁を両端から引っ張ります。曲げモーメントは変わりません。

座標軸を回転させた節点では、`true` を渡してグローバル座標系を指定しない限り、変位と反力は節点自身の座標軸で表されます。一方、その節点にかける節点荷重は、特に指定しない限りグローバル座標系です。[節点荷重](/ja/solver/loads#nodal-loads)を参照してください。`node.updateLcs()` を引数なしで呼ぶと、軸は元に戻ります。

## 節点の変更 {#change-a-node}

節点は単純なオブジェクトです。移動するには `node.coords` を変更し、支点を変えるには `node.bcs`（`Set<DofID>`）を置き換えます。

```ts
domain.getNode('B').coords = [8, 0, 0] // スパンを長くする：solve() だけでよい
domain.getNode('A').bcs = new Set(fixed) // 支点を変える：先に番号を付け直す
solver.codeNumberGenerated = false
solver.solve()
```

支点の変更や節点の追加・削除は、方程式そのものを変えます。`codeNumberGenerated = false` を設定しないと、ソルバーは**何も知らせずに古い支点のまま**解きます。どの変更でこの設定が必要になるかは、[変更後の再計算](/ja/solver/solving#solving-again-after-a-change)にまとめてあります。
