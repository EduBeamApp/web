---
title: コンポーネント API
description: "@edubeam/plot 0.2.0 の StructurePlot と DiagramStack のすべてのプロパティとイベント（型と既定値）、EduBeamPlot プラグイン、エクスポートされるプロパティの型。"
order: 8
group: API リファレンス
source: site
---

# コンポーネント API

@edubeam/plot 0.2.0 で宣言されている、2 つのコンポーネントのプロパティとイベントです。どちらにもスロットはありません。SI 単位の値はその旨を記しています。サイズは CSS ピクセルです。

## StructurePlot {#structureplot}

```ts
import { StructurePlot } from '@edubeam/plot'
```

平面の構造物とその結果を描きます。使い方は [StructurePlot](/ja/plot/structure-plot) のページで説明しています。

### プロパティ {#props}

| プロパティ | 型 | 既定値 | 説明 |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | @edubeam/fem のソルバー。荷重ケースが解かれていれば結果も描く。 |
| `model` | `PlotModel` | – | または [`modelFromSolver`](/ja/plot/model) が作るプレーンなデータ。`solver` より優先される。 |
| `loadCase` | `number` | `0` | `solver.loadCases` のインデックス |
| `revision` | `number` | `0` | その場で変更したソルバーを再描画するとき、この値を変える |
| `layers` | `readonly PlotLayer[]` | members, supports, loads, reactions and one result | 描くもの：`'nodes'`、`'nodeLabels'`、`'dimensions'`、`'members'`、`'supports'`、`'loads'`、`'reactions'`、`'N'`、`'V'`、`'M'`、`'w'` |
| `reserve` | `readonly PlotLayer[]` | `layers` | 非表示の間も場所を確保するレイヤー |
| `compact` | `boolean` | `false` | サムネイル用の描き方：小さな記号、値は 1 部材あたり最大 2 つ |
| `units` | `Partial<Units>` | `KN_UNITS` | 表示単位 |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | すべての数値の書式 |
| `colors` | `Partial<PlotColors>` | – | トーンごとの色の上書き：[テーマと色](/ja/plot/theming#the-colors-prop) |
| `width` | `number` | `640`, compact `400` | 枠を測るまでの幅（サーバー上など） |
| `height` | `number` | – | 固定の高さ。指定しないと、高さは図の内容に合わせて決まる。 |
| `maxHeight` | `number` | `max(320, 0.75 × width)`, compact none | 自動で決まる高さの上限 |
| `padding` | `number` | `6` | 図の周囲の余白 |
| `fontSize` | `number` | `13`, compact `11.5` | 文字サイズ |
| `diagramSize` | `number` | `48`, compact `26` | 断面力図の最大の縦距の長さ |
| `deformedSize` | `number` | `30`, compact `18` | 変位図の最大変位 |
| `diagramScale` | `Partial<Record<ResultLayer, number>>` | – | 結果ごとに SI 単位あたりの px を固定。`diagramSize` や `deformedSize` より優先 |
| `momentOnTensionSide` | `boolean` | `true` | M を引張側に描く。`false` で圧縮側 |
| `resultLabelMode` | `'horizontal' \| 'axis'` | `'horizontal'` | 値を正立させて書くか、縦距に沿って回転させるか |
| `reactionLabels` | `'values' \| 'names'` | `'values'` | 反力を作用する向きに大きさ付きで描くか、演習用に、拘束された方向ごとに記号（*A<sub>x</sub>*、*M<sub>A</sub>*）を付けて正とする向きに描くか。記号に結果は不要：[未知数としての反力](/ja/plot/structure-plot#reactions-as-unknowns) |
| `reserveLabelModes` | `readonly ResultLabelMode[]` | – | 現在のモード以外に場所を確保するラベルモード |
| `reserveReactionLabels` | `readonly ReactionLabels[]` | – | `reactionLabels` 以外に場所を確保する反力ラベルの種類。演習問題を解答に切り替えても図が動かない |
| `animate` | `boolean` | `true` | レイヤーのフェードインと部材の描画アニメーション。`prefers-reduced-motion` のときは常にオフ。 |
| `hover` | `boolean` | `false` | ポインターの下の値を読み取り、各断面力図の縦距の先端に印を付ける。オフのとき、図はポインター入力を一切受け取らない。 |
| `title` | `string` | a description of what is shown | 図のアクセシブルな名前 |

`layers` を指定しない場合、結果は梁とラーメンでは `M`、トラスでは `N`、どの部材にも力が生じない場合は `w` です（`defaultResultLayer`）。

### イベント {#events}

| イベント | ペイロード | 発行されるとき |
| --- | --- | --- |
| `readout` | `Readout \| null` | `hover` 指定時：ポインターの下にある部材上の点とその結果。ポインターが離れると `null` |

```ts
interface Readout {
  readonly member: string
  readonly x: number // 部材の始端節点からの距離、m
  readonly px: number // 画面上の点、px
  readonly py: number
  readonly values: Readonly<Record<'N' | 'V' | 'M' | 'w', SidedValue>> // SI 単位
  readonly u: number // 部材のローカル x 方向の変位、m
}
interface SidedValue {
  readonly left: number
  readonly right: number // 結果が連続な位置では left と等しい
}
```

## DiagramStack {#diagramstack}

```ts
import { DiagramStack } from '@edubeam/plot'
```

真っすぐな梁とその断面力図を、共通の x 軸で描きます。部材は左から右へ描いた 1 本の水平な直線になっていなければならず、それ以外ではエラーを投げます。使い方は [DiagramStack](/ja/plot/diagram-stack) のページで説明しています。

### プロパティ {#props-1}

| プロパティ | 型 | 既定値 | 説明 |
| --- | --- | --- | --- |
| `solver` | `Solver` | – | 解析済みの梁 |
| `model` | `PlotModel` | – | または `modelFromSolver` によるプレーンなデータ。こちらが優先される |
| `loadCase` | `number` | `0` | `solver.loadCases` のインデックス |
| `revision` | `number` | `0` | その場で変更したソルバーを再描画するとき、この値を変える |
| `members` | `readonly string[]` | all members | 梁の線を構成する部材 |
| `rows` | `readonly StackRow[]` | `['V', 'M', 'w']` | 図の段（上から順）。`'N'`、`'V'`、`'M'`、`'w'` から選ぶ |
| `loadRow` | `boolean` | `true` | 各段の上に、支点、荷重、反力の付いた梁を描く |
| `ranges` | `Partial<Record<StackRow, readonly [number, number]>>` | each row's own | 段ごとの値の範囲、SI 単位 |
| `rowHeights` | `Partial<Record<StackRow, number>>` | N 100, V 116, M 128, w 76; below 560 px wide 88, 96, 104, 64 | `maxHeight` で縮める前の各段の高さ |
| `maxHeight` | `number` | – | 図が収まるよう各段を縮める（最小 60 %）。文字サイズは変わらない。 |
| `units` | `Partial<Units>` | `KN_UNITS` | 表示単位 |
| `numberFormat` | `Intl.NumberFormat` | English, at most 1 decimal | すべての数値の書式 |
| `colors` | `Partial<PlotColors>` | – | 色の上書き |
| `width` | `number` | `720` | 枠を測るまでの幅。320 未満にはならない |
| `fontSize` | `number` | `12.5` | 文字サイズ |
| `hover` | `boolean` | `true` | 読み取りカーソル。オフのとき、図はポインター入力を受け取らない。 |
| `loadAt` | `number` | – | 読者がドラッグできる集中荷重の位置（梁の線に沿った m）。`v-model:load-at` と併用 |
| `loadLabel` | `string` | `P = …` with the load's magnitude | ドラッグできる荷重の横に表示する文字 |
| `loadStep` | `number` | `0.05` | ドラッグ時に丸める刻み、m。矢印キーでの移動量もこの値 |
| `title` | `string` | a description of the rows | 図のアクセシブルな名前 |

### イベント {#events-1}

| イベント | ペイロード | 発行されるとき |
| --- | --- | --- |
| `update:loadAt` | `number` | 読者が荷重を動かしたとき：新しい位置、m。`v-model:load-at` はこのイベントで動く |
| `readout` | `StackReadout \| null` | 各段のカーソル位置の値。ポインターが離れると `null` |

```ts
interface StackReadout {
  readonly x: number // 梁の線に沿った位置、m
  readonly values: Partial<Record<'N' | 'V' | 'M' | 'w', { readonly left: number; readonly right: number }>> // SI
}
```

## プラグイン {#the-plugin}

```ts
import { EduBeamPlot } from '@edubeam/plot'

app.use(EduBeamPlot) // <StructurePlot> と <DiagramStack> をグローバルに登録
```

プラグインは任意です。コンポーネントを名前でインポートするほうが軽く、プラグインを使わないビルドからはバンドラーがプラグインを取り除きます。

## 型 {#types}

コンポーネントを型付きでラップできるように、パッケージはそのプロパティとイベントの型をエクスポートしています。

```ts
import type { PlotLayer, StructurePlotProps } from '@edubeam/plot'

const figure: StructurePlotProps = { layers: ['members', 'supports', 'M'] satisfies PlotLayer[], compact: true }
```

| 型 | 内容 |
| --- | --- |
| `StructurePlotProps`, `StructurePlotEmits` | `StructurePlot` のプロパティとイベント |
| `DiagramStackProps`, `DiagramStackEmits` | `DiagramStack` のプロパティとイベント |
| `Readout`, `ReadoutQuantity`, `SidedValue`, `StackReadout` | イベントのペイロード |
| `PlotLayer`, `ResultLayer`, `ResultLabelMode`, `ReactionLabels`, `StackRow` | レイヤー、結果、ラベルモード、反力ラベル、段の名前 |
| `Units`, `Unit`, `UnitKind` | 表示単位：種類ごとの `{ symbol, scale }` |
| `PlotColors` | トーンごとの色 |
| `PlotModel` | プレーンなモデル：[描画モデル](/ja/plot/model) |

残りのエクスポート（SVG ファイル用の `structureSvg` や、描画を支える関数など）は[関数](/ja/plot/functions)のページにあります。
