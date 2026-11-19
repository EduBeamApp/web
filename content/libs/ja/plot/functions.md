---
title: 関数
description: "@edubeam/plot 0.2.0 がコンポーネント以外にエクスポートする関数、定数、型。単体の SVG ファイルを書き出す structureSvg、結果の厳密な読み取り、単位、梁の線、独自の図のレイアウト。"
order: 10
source: site
---

# 関数

コンポーネントが描くものは、すべて Vue を含まない純粋関数から作られています。これらの関数を使えば、図を SVG ファイルに書き出したり、結果を厳密に読んだり、データを前もって用意したり、独自の図を作ったりできます。名前付きインポートを使えば、バンドルは小さく保てます。`modelFromSolver` だけをインポートするページには、コンポーネントのコードは一切含まれません。

値は、単位を明記したもの以外はすべて SI 単位です。部材に沿った位置は、始端節点からの距離（m）です。

## 単体の SVG ファイル {#a-standalone-svg-file}

ページ内の図は色をページの CSS カスタムプロパティから取るので、そこからコピーした `<svg>` には色が付いていません。そこで `structureSvg` は、図を単体の `.svg` ファイルのテキストとして書き出します。色は固定で、スタイルシートもスクリプトもなく、レイアウトは `StructurePlot` と同じ処理で行います。Word、PowerPoint、Inkscape、CairoSVG、LaTeX のツールチェーンでも、ページと同じように表示されます。

```ts [to-svg.ts]
import { writeFileSync } from 'node:fs'
import { modelFromSolver, structureSvg } from '@edubeam/plot'
import { portalFrame } from './frame.ts' // () => 解析済みの LinearStaticSolver（「スライドと講義資料」のページと同じ）

const frame = modelFromSolver(portalFrame())
writeFileSync('frame.svg', structureSvg(frame, { layers: ['members', 'supports', 'loads', 'reactions', 'M'] }))
```

![CairoSVG で描画した、単体の SVG ファイルとしての門形ラーメン：荷重、反力（上向きに 20 と 40、水平に 2.3 と 12.7）、曲げモーメントは C の −50.7 から梁の 29.3 まで](/screenshots/ja/p2p-plot-frame-svg.webp){.shot-lg}

| オプション | 既定値 | 内容 |
| --- | --- | --- |
| `layers` | members, supports, loads, reactions and the result `StructurePlot` would pick | 描くもの |
| `width` | `640` | 幅、px（SVG のユーザー単位） |
| `height` | follows the drawing | 固定の高さ、px |
| `maxHeight` | max(320, 0.75 × width) | 自動で決まる高さの上限 |
| `padding` | `6` | 図の周囲の余白、px |
| `fontSize` | `13`, compact `11.5` | 文字サイズ、px |
| `fontFamily` | `Helvetica, Arial, sans-serif` | ファイルを開くプログラムにあるフォントの指定（フォントスタック） |
| `colors` | `PRINT_COLORS` | 任意のトーンを固定色で指定 |
| `background` | `true` | 背景を `paper` の色で塗る。`false` で透明 |
| `title` | none | SVG の `<title>` として書き込む |
| `reserve`, `reserveLabelModes`, `reserveReactionLabels` | none | 描くもの以外に場所を確保するレイヤー、ラベルの種類、反力ラベルの種類。段階表示用のファイルの位置が揃う：[Beamer での段階表示](/ja/plot/slides#a-build-up-in-beamer) |
| `units`, `numberFormat`, `compact`, `diagramSize`, `deformedSize`, `momentOnTensionSide`, `resultLabelMode`, `reactionLabels` | as `StructurePlot` | コンポーネントの同名のプロパティと同じ意味 |

`PRINT_COLORS` は、白地に EduBeam アプリの色を使います。線と文字は `#16182b`、軸力は `#2222ff`、せん断力は `#00af00`、曲げモーメントは `#ff2222`、荷重は `#ff8700`、反力は `#a020f0` です。`paint-order` を解釈しない SVG ソフトもあるので、ラベルはすべて 2 回書き込みます。下に背景色の縁取り（ハロー）、その上に文字です。また、反力の記号 *A<sub>x</sub>* のような下付き文字は、Word や Inkscape が読める単純な数値を持つ `tspan` で書きます。`reserve` を指定しない場合、ファイルは描くレイヤーに合わせた大きさになります。

ファイルの使い方は次のとおりです。

- **Word と PowerPoint**（2019 と Microsoft 365）：*挿入 › 画像*。
- **LaTeX**：[CairoSVG](https://cairosvg.org)（`cairosvg frame.svg -o frame.pdf`）か Inkscape で PDF に変換し、`\includegraphics` で取り込みます。または、Inkscape を自動で呼び出す `svg` パッケージの `\includesvg` を使います。幅 640 単位の図を 16 cm の本文幅に合わせると、ラベルは 9 pt になります。
- **Vue を使わない Web ページ**：テキストを HTML に貼り付けます。[Vue を使わない場合](/ja/plot/embedding#plain-html-from-node)を参照してください。

[演習問題と試験](/ja/plot/exercises#figures-for-latex-and-word)では、学生ごとの問題と解答をそれぞれファイルに書き出しています。

## ソルバーから {#from-a-solver}

| エクスポート | シグネチャ | 機能 |
| --- | --- | --- |
| `modelFromSolver` | `(solver: Solver, options?: FromSolverOptions) => PlotModel` | ソルバーをプレーンな[描画モデル](/ja/plot/model)に読み出す。結果は解析済みの荷重ケースのみ |
| `FromSolverOptions` | type | `{ loadCase?: number }`、`solver.loadCases` のインデックス |

## 区分多項式 {#piecewise-polynomials}

部材の結果は `Piecewise` 型の値、つまり `{ x0, x1, c }` という区間のリストです。詳しくは[描画モデル](/ja/plot/model#piecewise-polynomials)で説明しています。`side` は、2 つの区間がつながる点の直前（`'left'`）と直後（`'right'`、既定）のどちらの値を取るかを選びます。

| エクスポート | シグネチャ | 機能 |
| --- | --- | --- |
| `valueAt` | `(pw, x, side?) => number` | `x` での値。両端より外では、近いほうの端の値 |
| `slopeAt` | `(pw, x, side?) => number` | 導関数。単位は「値の単位/m」 |
| `extremes` | `(pw) => { max: Extreme; min: Extreme } \| null` | 最大値と最小値（厳密）。それぞれ `{ x, value, side }` |
| `maxAbs` | `(pw) => number` | 絶対値の最大 |
| `innerBreaks` | `(pw) => number[]` | 区間のつなぎ目（両端を除く） |
| `isZero` | `(pw) => boolean` | 全長にわたってゼロかどうか |
| `evalPiece` | `(piece, x) => number` | 1 つの区間の値 |
| `evalPieceSlope` | `(piece, x) => number` | 1 つの区間の勾配 |
| `pieceExtrema` | `(piece) => number[]` | 区間の勾配がゼロになる位置、m |
| `pieceDegree` | `(piece) => number \| null` | 区間の次数。ゼロのときは `null` |
| `cleanPiecewise` | `(pw, tolerance) => Piecewise` | `tolerance` 未満の係数（解析済みモデルの丸め誤差）を捨てる |
| `fitPiece` | `(f, x0, x1, degree) => Piece` | `(x0, x1)` 上の関数を通る、指定した次数の多項式 |
| `pieceToBeziers` | `(piece, segments?) => CubicSegment[]` | 区間を (x, 値) 平面の 3 次ベジェ曲線で表す。3 次以下なら厳密、それ以外は `segments` 個（既定 4）で近似 |

型：`Piece`、`Piecewise`、`Side`（`'left' \| 'right'`）、`Extreme`、`CubicSegment`。

## 単位と数値 {#units-and-numbers}

| エクスポート | シグネチャ | 機能 |
| --- | --- | --- |
| `KN_UNITS` | `Units` | kN、kNm、kN/m、m、mm、mrad、K：既定値 |
| `SI_UNITS` | `Units` | N、N·m、N/m、m、m、rad、K |
| `resolveUnits` | `(units?: Partial<Units>) => Units` | `KN_UNITS` に指定した上書きを適用したもの |
| `DEFAULT_NUMBER_FORMAT` | `Intl.NumberFormat` | 英語の書式、小数点以下最大 1 桁 |
| `formatNumber` | `(value, format?) => string` | 正式なマイナス記号（−）を使った数値。−0 にはならない |
| `formatQuantity` | `(si, unit, format?) => string` | `"36 kN"`：SI の値を指定の単位で、幅の狭いノーブレークスペースを挟んで書く |

`Unit` は `{ symbol, scale }` で、表示値 = SI 値 × `scale` です。`Units` は、`UnitKind`（`force`、`moment`、`distributed`、`length`、`displacement`、`rotation`、`temperature`）ごとに 1 つずつ `Unit` を持ちます。

```ts
import { formatQuantity, KN_UNITS } from '@edubeam/plot'

formatQuantity(-37500, KN_UNITS.moment) // "−37.5 kNm"
```

## 値の読み取り {#reading-values}

| エクスポート | シグネチャ | 機能 |
| --- | --- | --- |
| `readMember` | `(results: MemberResults, x, snap?) => { x, u, values }` | `x` での N、V、M、w（それぞれ `{ left, right }`）と軸方向変位 `u`。`snap` m 以内の段差にはスナップする |
| `readoutAt` | `(model, transform, px, py, reach) => Readout \| null` | 画面上の点から `reach` px 以内で最も近い部材と、その点での結果 |
| `readoutMarks` | `(model, transform, readout, shown, k, side) => ReadoutMark[]` | 読み取った値を描く位置。表示中の各断面力図の縦距の先端（段差では両方）と、変位図上の点 |
| `formatReadout` | `(readout, quantity, units, format?) => string` | `"M = 54 kNm"`、段差では `"V = 13.3 → −6.7 kN"` |

`k` は結果ごとの SI 単位あたりの px、`side` は各断面力図を描く側で、下の `diagramScales` と `diagramSide` から得られます。型：`Readout`、`ReadoutMark`（px 単位の `{ tone, from, to }`）、`ReadoutQuantity`（`'N' \| 'V' \| 'M' \| 'w'`）、`SidedValue`。

## 梁の線 {#beam-lines}

[DiagramStack](/ja/plot/diagram-stack) を構成する部品です。断面力図を並べた独自の図を作るときに使います。

| エクスポート | シグネチャ | 機能 |
| --- | --- | --- |
| `beamLine` | `(model, ids?) => BeamLine` | 部材を左から右への 1 本の水平な線にまとめる。それ以外の形ではエラーを投げる |
| `lineDiagram` | `(model, line, row) => Piecewise` | 線全体に沿った 1 つの結果（線の x 座標で） |
| `rowRange` | `(pw) => [number, number]` | 段の縮尺の基準になる範囲。常にゼロを含む |
| `rowPeaks` | `(pw) => RowPeak[]` | 段に書き込むべき極値 |
| `rowBreaks` | `(pw) => number[]` | 結果が折れたり跳んだりする位置：支点、部材の接合点、集中荷重 |
| `rowOutline` | `(pw, sx, sy, close) => string` | 段の輪郭の SVG パスデータ。m と値から px への写像を与える |
| `rowOrdinates` | `(pw, sx, sy, spacing) => string` | ハッチングの縦距の SVG パスデータ。間隔は `spacing` px |
| `lineModel` | `(model, line, omit?) => PlotModel` | 線の部分だけに切り詰めたモデル。荷重を 1 つ除くこともできる |
| `pointLoadAt` | `(model, line, at) => PlotLoad \| undefined` | 線上の位置 `at` にある集中荷重 |

型：`BeamLine`、`LineMember`、`RowPeak`、`StackRow`。

[DiagramStack](/ja/plot/diagram-stack#a-load-the-reader-can-drag) のページでは、`beamLine`、`lineDiagram`、`rowRange` を使って、移動荷重のどの位置でも各段の縮尺を一定に保っています。

## 形状と支点 {#geometry-and-supports}

| エクスポート | シグネチャ | 機能 |
| --- | --- | --- |
| `nodeMap` | `(model) => ReadonlyMap<string, PlotNode>` | id ごとの節点 |
| `memberFrame` | `(model, member, nodes?) => MemberFrame` | 部材の始点、単位接線ベクトル、ローカル z 方向の単位ベクトル、長さ |
| `memberFrames` | `(model) => Map<string, MemberFrame>` | 全部材について同じものを id ごとに |
| `pointAlong` | `(frame, at) => { x, z }` | 部材に沿って `at` m の点 |
| `supportKind` | `(fixity) => SupportKind` | `'fixed'`、`'pin'`、`'roller'`、`'slider'`、`'rotation'`、`'none'` のいずれか |
| `supportPlacement` | `(model, node) => SupportPlacement` | 節点の支点記号と、その時計回りの回転角（度） |
| `supportGlyph` | `(kind) => readonly GlyphPart[]` | 記号を構成する線、px |
| `glyphReach` | `(kind, rotation, x, z) => number` | 回転した記号がある方向にどこまで届くか、px |

## 描画 {#drawing}

描画は 3 段階で行います。`buildStructureScene` は、モデルをシーン要素（画面上のピクセル単位のオフセットを持つ、モデル上の点）に変えます。`fitScene` は、それらを枠に収める縮尺とオフセットを求めます。`resolveScene` は、それらを SVG のパスデータ、円、そして配置できたラベルに変換します。`layoutStructure` は、`StructurePlot` や `structureSvg` と同じように 3 段階をすべて実行するので、独自の図もそれらと同じようにレイアウトできます。

| エクスポート | シグネチャ | 機能 |
| --- | --- | --- |
| `layoutStructure` | `(model, options, box, shown?, labelModes?) => StructureLayout` | レイアウト全体：全ラベル込みで収め、混み合ったラベルを省き、もう一度収める。`{ fit, items, resolved }` を返す |
| `structureSvg` | `(model, options?) => string` | 単体の `.svg` ファイル：[上記](#a-standalone-svg-file) |
| `buildStructureScene` | `(model, options: StructureSceneOptions) => SceneItem[]` | 選んだレイヤーを、指定した縮尺（px/m）で描いたもの |
| `fitScene` | `(items, box: FitBox) => Fit` | 枠 `{ width, height?, maxHeight?, padding, fontSize }` に収める縮尺とオフセット |
| `resolveScene` | `(items, transform, options: ResolveOptions) => ResolvedScene` | px 単位の `{ paths, circles, texts }`。収まるラベルのみ |
| `placeLabels` | `(items, transform, options: ResolveOptions) => Map<SceneText, SceneText>` | 残すラベルとその位置 |
| `alternativeResultGroups` | `(shown) => ReadonlySet<string>` | 一度に 1 つずつ表示される結果レイヤー。そのラベルはほかのラベルには場所を譲るが、互いには譲らない |
| `sceneBounds` | `(items, scale, fontSize) => Bounds` | シーンの範囲、px |
| `project` | `(transform, anchor) => [number, number]` | シーン上の点の画面座標、px |
| `defaultResultLayer` | `(model) => ResultLayer \| null` | 指定がないときに図が表示する結果 |
| `diagramScales` | `(model, options) => Record<ResultLayer, number>` | 結果ごとの SI 単位あたりの px |
| `diagramSide` | `(q, momentOnTensionSide) => 1 \| -1` | 正の値を部材のどちら側に描くか |
| `isBarStructure` | `(model, memberResults) => boolean` | N を断面力図ではなく、部材に沿った数値で書くかどうか（トラス） |
| `tipPlacements` | `(tip, out, mode, gaps?) => TextPlacement[]` | 縦距の先端の外側で、値を置ける位置 |
| `PLOT_LAYERS` | `readonly PlotLayer[]` | 全レイヤー（描画順） |
| `RESULT_LAYERS` | `['N', 'V', 'M', 'w']` | 結果レイヤー |
| `HATCH_SPACING_PX` | `7` | 断面力図の縦距の間隔、px |
| `DEFAULT_COLORS` | `PlotColors` | 各トーンの既定の色（CSS）：[テーマと色](/ja/plot/theming) |
| `PRINT_COLORS` | `Record<Tone \| 'paper', string>` | ファイル用の固定色。白地にアプリの色 |
| `toneVars` | `(colors?) => Record<string, string>` | 図がルート要素に設定するカスタムプロパティ |
| `PLOT_CSS` | `string` | 各図にインラインで埋め込まれる CSS ルール |

`ResolveOptions` は `{ fontSize, viewport?, exclude?, alternativeGroups?, shields? }` です。`shields` は、その線がラベルを寄せ付けないグループ（表示中の断面力図）で、省略するとすべてのグループが対象になります。`layoutStructure` では、`options.layers` がレイアウトするレイヤー（`reserve` と同じく、表示されうるものすべて）、`shown` が表示中のレイヤー、`labelModes` が場所を確保するラベルの書き方です。

型：`StructureSceneOptions`、`StructureLayout`、`StructureSvgOptions`、`SceneItem`、`SceneText`、`TextPlacement`、`ResolvedScene`、`ResolvedPath`、`ResolvedText`、`ResolvedCircle`、`ResolveOptions`、`Bounds`、`Anchor`、`Transform`、`Fit`、`FitBox`、`Tone`、`PlotLayer`、`ResultLayer`、`ResultLabelMode`、`ReactionLabels`、`SupportKind`、`SupportPlacement`、`GlyphPart`、および[描画モデル](/ja/plot/model)のモデル型。
