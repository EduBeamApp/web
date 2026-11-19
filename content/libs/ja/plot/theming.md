---
title: テーマと色
description: "CSS カスタムプロパティや colors プロパティによる @edubeam/plot の図の配色。ライトテーマとダークテーマへの追従、白黒印刷、SVG ファイルの色、フォント、アニメーションの調整。"
order: 4
source: site
---

# テーマと色

図の色はページの CSS カスタムプロパティから取られるので、サイトのライトテーマとダークテーマがそのまま適用されます。ページで定義されていない場合は CSS のシステムカラーが代わりに使われ、これはページの `color-scheme` に従います。何も設定しなければ、明るいページでは白地に黒、暗いページでは暗い地に明るい色で描かれます。

## カスタムプロパティ {#custom-properties}

| 用途 | カスタムプロパティ | フォールバック |
| --- | --- | --- |
| 部材、支点、文字 | `--figure-ink`、なければ `--ink` | `CanvasText` |
| 背景、ラベルの縁取り | `--paper` | `Canvas` |
| 寸法線、軸 | `--muted` | `GrayText` |
| 節点、ドラッグできる荷重 | `--brand` | `#4f46e5` |
| 軸力 | `--color-normal` | `#2222ff` |
| せん断力 | `--color-shear` | `#00af00` |
| 曲げモーメント | `--color-moment` | `#ff2222` |
| 変位図 | `--figure-ink`、なければ `--ink` | `CanvasText` |
| 荷重 | `--color-load` | `#ff8700` |
| 反力 | `--color-reaction` | `#a020f0` |
| 引張のトラス材 | `--color-tension`、なければ `--color-moment` | `#ff2222` |
| 圧縮のトラス材 | `--color-compression`、なければ `--color-normal` | `#2222ff` |
| フォント | `--ebp-font`、なければ `--font-sans` | `inherit` |

カスタムプロパティは、図より上位のどの要素に設定してもかまいません。サイト全体に適用するなら `:root` に設定します。

```css
:root {
  --ink: #1b1b3a;
  --paper: #ffffff;
  --color-moment: #d7263d;
}

.dark {
  --ink: #eeeeff;
  --paper: #0b0d1f;
}
```

ラベルには `--paper` の色で縁取り（ハロー）が付くので、ハッチングの上でも読めます。図を置く背景の色に合わせてください。

## `colors` プロパティ {#the-colors-prop}

1 つの図だけに色を付けるには、トーンを名前で指定して渡します。

```vue
<StructurePlot :solver="solver" :colors="{ moment: '#c00', paper: 'transparent' }" />
```

トーンは `ink`、`paper`、`muted`、`brand`、`normal`、`shear`、`moment`、`deformed`、`load`、`reaction`、`tension`、`compression` です。CSS の色ならどれでも使え、`var(…)` も使えます。各トーンの既定値は `DEFAULT_COLORS` にあります。

## 白黒 {#black-and-white}

コピーして配る試験や白黒印刷では、色の付いたトーンをすべて `ink` と同じ黒にします。

```vue
<script setup lang="ts">
import type { PlotColors } from '@edubeam/plot'

const print: Partial<PlotColors> = {
  ink: '#000', paper: '#fff', muted: '#555', brand: '#000',
  normal: '#000', shear: '#000', moment: '#000', deformed: '#000',
  load: '#000', reaction: '#000', tension: '#000', compression: '#000',
}
</script>

<template>
  <StructurePlot :solver="solver" :colors="print" :animate="false" />
</template>
```

断面力図は色がなくても読めます。ハッチングで描かれ、曲げモーメントは引張側に出るからです。

## SVG ファイルの色 {#colours-in-an-svg-file}

[`structureSvg`](/ja/plot/functions#a-standalone-svg-file) が書き出すファイルには周囲のページがないので、固定の色を使います。既定は `PRINT_COLORS`、つまり白地に EduBeam アプリの色です。`colors` オプションはプロパティと同じトーンを受け付けるので、上の白黒の設定もそのまま使えます。

```ts
structureSvg(model, { colors: print }) // 白地に黒
structureSvg(model, { background: false }) // 背景なし、色付きのスライド用
```

使えるのは固定の色だけです。`var(…)` は Word や Inkscape では意味を持ちません。

## フォント {#fonts}

文字には `--ebp-font` または `--font-sans` を通じてページのフォントが使われ、数字は等幅（tabular figures）になります。`DiagramStack` の V(x) などの段の名前は、ページが KaTeX のフォントを読み込んでいればそのフォントで、そうでなければセリフ体で書かれます。SVG ファイルはページのフォントを知りようがないので、`fontFamily` オプション（既定は Helvetica または Arial）を使います。

## アニメーションの調整 {#restyling-the-animation}

図に必要な少数の CSS ルールは各 SVG にインラインで埋め込まれているので、スタイルシートは不要です。クラスにはすべて `ebp-` の接頭辞が付いており、ページから上書きできます。各レイヤーは `<g class="ebp-layer ebp-layer-{name}">` で、表示されると `ebp-on` が付きます。

```css
/* 講義室向けに、ゆっくりフェードインさせる */
.slides .ebp-animate .ebp-layer {
  transition-duration: 1s;
}
```

インラインで埋め込まれるルールは `PLOT_CSS` として、図がルート要素に設定するカスタムプロパティは `toneVars(colors)` として、それぞれエクスポートされています。[描画関数](/ja/plot/functions#drawing)で独自の図を作るときに使います。
