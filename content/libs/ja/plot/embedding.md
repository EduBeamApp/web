---
title: 埋め込み
description: "@edubeam/plot の図を Vite アプリ、VitePress の講義資料、Nuxt サイトに埋め込む方法。サーバー側レンダリング、解析済みモデルの JSON での配信、Vue を使わない SVG の書き出し。"
order: 7
source: site
---

# 埋め込み

コンポーネントは普通の Vue 3 コンポーネントなので、Vue が動く場所ならどこでも動き、ブラウザだけでなくサーバーでもレンダリングできます。図がマウントされるまで `window` には一切触れず、図ごとに固有の id が付くので、1 ページにいくつでも置けます。手元の環境に合わせて選んでください。

| 手元にあるもの | すること |
| --- | --- |
| Vite でビルドする Vue アプリ | インストールしてインポートするだけ：[Vite アプリ](#a-vite-app) |
| Markdown で書いた講義資料 | VitePress にプラグインを一度登録：[VitePress の講義資料](#vitepress-course-notes) |
| Nuxt サイト | コンポーネントをインポートするか、プラグインを追加：[Nuxt](#nuxt) |
| 図を表示するだけのページ | ビルド時に解いて JSON を配信：[ソルバーではなく図を配信する](#ship-the-drawing-not-the-solver) |
| Vue をまったく使わない | Node で SVG を書き出す：[Vue を使わない場合](#plain-html-from-node) |

## Vite アプリ {#a-vite-app}

```bash
npm create vue@latest
npm install @edubeam/plot @edubeam/fem
```

[クイックスタート](/ja/plot/getting-started#draw-a-solved-model)のように使う場所でコンポーネントをインポートするか、`app.use(EduBeamPlot)` で両方を一度に登録します。ほかに設定するものはありません。スタイルシートもバンドラーのプラグインも不要です。

## VitePress の講義資料 {#vitepress-course-notes}

[VitePress](https://vitepress.dev) は Vue を使って Markdown のページをビルドするので、講義資料を置くのに向いています。テーマ `.vitepress/theme/index.ts` でコンポーネントを登録します。

```ts [.vitepress/theme/index.ts]
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { EduBeamPlot } from '@edubeam/plot'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(EduBeamPlot) // すべてのページで <StructurePlot> と <DiagramStack> が使える
  },
} satisfies Theme
```

あとは、`frame.ts` と同じフォルダーにあるページの中で、モデルを組み立てて描きます。

```md [portal-frame.md]
<script setup lang="ts">
import { portalFrame } from './frame' // () => 解析済みの LinearStaticSolver

const frame = portalFrame()
</script>

# Portal frame

The bending moment under the design loads:

<StructurePlot :solver="frame" :layers="['members', 'supports', 'loads', 'reactions', 'M']" />
```

`vitepress build` がラーメンを解き、ラベルも含めて完成した SVG をページの HTML に書き込みます。ブラウザではページがそれを引き継ぎ、図は本文の幅に合わせて調整されます。`frame.ts` は[スライドと講義資料](/ja/plot/slides#a-figure-that-builds-up)のページにあります。

## Nuxt {#nuxt}

Nuxt もサーバーでレンダリングします。このサイトも Nuxt で作られています。ページやコンポーネントで通常どおりコンポーネントをインポートするか、`plugins/edubeam-plot.ts` のプラグインでアプリ全体に登録します。

```ts [plugins/edubeam-plot.ts]
import { EduBeamPlot } from '@edubeam/plot'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(EduBeamPlot)
})
```

サーバー上には大きさを測る枠がないので、図は `width` プロパティの幅でレイアウトされます。既定は 640 px（`compact` では 400 px）、`DiagramStack` では 720 px です。マウントされると、実際の幅でレイアウトし直します。本文の幅がこれよりかなり狭い、または広い場合は、`width` に近い値を指定しておけば、ページの読み込み中に図の大きさが変わりません。

## ソルバーではなく図を配信する {#ship-the-drawing-not-the-solver}

図を表示するだけのページに、ソルバーは要りません。`modelFromSolver` は、解析済みのモデルをプレーンなデータに読み出します。節点、部材、荷重、反力、そして各部材の N、V、M と変位を厳密な多項式で持つデータです。`build-figures.ts` のようなスクリプトで、ビルド時に作っておきます。

```ts [build-figures.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

writeFileSync('portal-frame.json', JSON.stringify(modelFromSolver(portalFrame())))
```

そして、`model` プロパティで描きます。

```vue
<script setup lang="ts">
import { StructurePlot, type PlotModel } from '@edubeam/plot'
import frame from './portal-frame.json'
</script>

<template>
  <StructurePlot :model="frame as PlotModel" />
</template>
```

この門形ラーメンは JSON で 2 kB 未満で、ソルバーから描いたときとまったく同じに描けます。ソルバーで使える機能はすべてモデルでも使え、両方を渡した場合は `model` が優先されます。形式は[描画モデル](/ja/plot/model)にあります。

## Vue を使わない場合 {#plain-html-from-node}

`structureSvg` は、モデルを SVG ファイルのテキストに変えます。色は固定で、スタイルもスクリプトも含みません。任意の HTML、静的サイトジェネレーター、Markdown ファイル、CMS に貼り付けられます。次のスクリプトは、図を 1 つ含むページを書き出します。

```ts [frame-html.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts'

const svg = structureSvg(modelFromSolver(portalFrame()), { layers: ['members', 'supports', 'reactions', 'M'] })
writeFileSync('frame.html', `<!doctype html><meta charset="utf-8"><title>Portal frame</title>${svg}`)
```

このような図は、書き出したときの大きさ（既定で幅 640 px）になります。`max-width: 100%; height: auto` を指定すれば、本文の幅に合わせて縮みます。また、独自の白い背景を持ち、`background: false` を指定すると透明になります。ダークテーマには追従せず、ポインターでの値の読み取りもできません。それが必要なら、コンポーネントでレンダリングしてください。[試験を印刷するスクリプト](/ja/plot/exercises#print-a-test)は、この方法で試験全体を印刷します。オプションの一覧は[単体の SVG ファイル](/ja/plot/functions#a-standalone-svg-file)にあります。
