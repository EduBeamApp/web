---
title: DiagramStack
description: "DiagramStack で梁とその V(x)、M(x)、w(x) を共通の x 軸に並べて描画。カーソルで全段の値を読み取り、読者が集中荷重を梁に沿ってドラッグできます。"
order: 3
source: site
---

# DiagramStack

`DiagramStack` は、構造力学の教科書でおなじみの図を描きます。支点、荷重、反力の付いた真っすぐな梁と、その下に同じ x 軸で並べたせん断力 V(x)、曲げモーメント M(x)、たわみ w(x) です。カーソルを使えば全段の値を一度に読み取れます。また、梁に沿ってドラッグできる集中荷重を加えることもできます。

```vue
<DiagramStack :solver="solver" />
```

![DiagramStack：スパン 6 m の単純梁と、読者がドラッグできる 20 kN の荷重（ここでは左の支点から 4.3 m）。反力は 5.7 kN と 14.3 kN、せん断力は荷重の位置で 5.7 kN から −14.3 kN に跳び、曲げモーメントはそこで最大の 24.4 kNm、たわみの最大値は 17 mm](/screenshots/ja/p2p-plot-diagram-stack.webp){.shot-lg}

部材は、左から右へ描いた 1 本の水平な直線になっていなければなりません。それ以外のもの（傾いた線や折れ線、右から左へ描いた部材）は、誤った図を描く代わりにエラーで拒否されます。図の x 軸が梁の軸そのものだからです。すべてのプロパティは[コンポーネント API](/ja/plot/components#diagramstack) にあります。

## 段 {#rows}

| プロパティ | 既定値 | 設定する内容 |
| --- | --- | --- |
| `rows` | `['V', 'M', 'w']` | 上から順に並べる図。`'N'` も使える |
| `loadRow` | `true` | 各段の上に、支点、荷重、反力の付いた梁を描く |
| `members` | all members | モデルにほかの部材もあるときの、梁の線を構成する部材 |
| `rowHeights` | N 100, V 116, M 128, w 76 px | 各段の高さ。幅 560 px 未満では少し小さくなる |
| `maxHeight` | none | 図が収まるよう各段を縮める（最小 60 %）。文字サイズは変わらない |
| `ranges` | each row's own | 各段の値の範囲を固定、SI 単位 |

多くの教科書と同じく、V と N は上向きを正、M と w は下向きを正として描きます。そのため、正の曲げモーメント（下側引張）と下向きのたわみは軸の下側に出ます。各段には極値が書かれます。

## 読み取りカーソル {#the-reading-cursor}

`hover` は既定でオンです。図の上でポインターを動かすと、全段を貫く縦のカーソルが現れ、各段の値がピル型のラベルに表示されます。集中荷重や支点などの段差から 8 px 以内では、カーソルがその位置にスナップし、V は両側の値を示します。上の図の荷重位置での `5.7 → −14.3 kN` がその例です。値はイベントとしても発行されます。

```vue
<DiagramStack :solver="solver" @readout="(r) => (reading = r)" />
```

読み取り値は `{ x, values }` です。`x` は梁に沿った位置（m）、各段の値は `{ left, right }`（SI 単位）です。ポインターが離れると `null` になります。

## 読者がドラッグできる荷重 {#a-load-the-reader-can-drag}

`v-model:load-at` に集中荷重の位置を渡すと、荷重にハンドル（つまみ）が付きます。読者はポインターでドラッグするか、フォーカスして矢印キーで動かせます。コンポーネントが知らせるのは新しい位置だけです。その位置に荷重を置いて梁を解き直し、新しいソルバーを渡し返してください。`MovingLoad.vue` がその例です。

```vue [MovingLoad.vue]
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { beamLine, DiagramStack, lineDiagram, modelFromSolver, rowRange, type StackRow } from '@edubeam/plot'

const L = 6 // m
const P = 20e3 // N

/** 集中荷重を A から `at` m の位置に置いた梁を解いて返す。 */
const solveWithLoadAt = (at: number): LinearStaticSolver => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  solver.loadCases[0].createBeamConcentratedLoad(1, [0, P, 0, at], true)
  solver.solve()
  return solver
}

/** すべての荷重位置にわたる各段の値の範囲。縮尺し直す代わりに、図そのものが伸び縮みする。 */
const rows: StackRow[] = ['V', 'M', 'w']
const envelope = (() => {
  const ranges: Partial<Record<StackRow, [number, number]>> = {}
  for (let at = 0.25; at < L; at += 0.25) {
    const model = modelFromSolver(solveWithLoadAt(at))
    const line = beamLine(model)
    for (const row of rows) {
      const [lo, hi] = rowRange(lineDiagram(model, line, row))
      const [min, max] = ranges[row] ?? [0, 0]
      ranges[row] = [Math.min(min, lo), Math.max(max, hi)]
    }
  }
  return ranges
})()

const at = ref(2)
const solver = computed(() => solveWithLoadAt(at.value))
</script>

<template>
  <DiagramStack v-model:load-at="at" :solver="solver" :rows="rows" :ranges="envelope" load-label="P = 20 kN" />
  <p>The load is {{ at.toFixed(2) }} m from A.</p>
</template>
```

荷重が 4.3 m の位置にあるとき、図には反力 5.7 kN と 14.3 kN、荷重の位置でのせん断力の 5.7 kN から −14.3 kN への段差、そこでの $M = 5.67 \cdot 4.3 = 24.4$ kNm が示されます。`ranges` を指定しないと、荷重が動くたびに各段がそれぞれの極値に合わせて縮尺し直されるので、図がまったく変わらないように見えてしまいます。

| プロパティ | 既定値 | 設定する内容 |
| --- | --- | --- |
| `loadAt` | none | 荷重の位置、梁の線の始端からの m。`v-model:load-at` と併用 |
| `loadLabel` | `P = …` | ハンドルの横に表示する文字 |
| `loadStep` | 0.05 | ドラッグ時に丸める刻み、m。矢印キーでの移動量もこの値 |

ハンドルはフォーカスできる `role="slider"` で、範囲と位置をスクリーンリーダーに伝えます。矢印キーで `loadStep` ずつ、Page Up と Page Down で 1 m ずつ動き、Home と End で梁の両端に移動します。タッチスクリーンでは指でドラッグでき、図の上でも縦スクロールはそのまま使えます。

ハンドルは、解析済みモデルの `loadAt` の位置にある集中荷重の代わりに表示されます。その荷重はハンドルとして描かれ、`loadLabel` を指定しなければ大きさがラベルになります。`solveWithLoadAt` のように、同じ位置の荷重をモデルに入れておいてください。

## サイズとサーバー側レンダリング {#size-and-server-rendering}

図は枠の大きさを測り、その幅（最小 320 px）でレイアウトします。測れるようになるまでは `width`（既定 720 px）を使います。文字は 12.5 px（`fontSize`）で、図を縮めても小さくなりません。
