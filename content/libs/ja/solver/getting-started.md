---
title: クイックスタート
description: "EduBeam の計算を担う有限要素ソルバー @edubeam/fem をインストールし、十数行の TypeScript で単純梁を解いて、結果を確かめます。"
order: 1
group: 入門
source: site
---

# クイックスタート {#getting-started}

@edubeam/fem は [EduBeam]{.edubeam} の計算を担う有限要素ソルバーです。アプリに表示される断面力図、反力、たわみは、すべてこのソルバーが計算しています。自分のコードから平面の梁、ラーメン、トラスを解くのに使えます。ブラウザでも Node でも動き、解答付きの演習問題の作成、課題の採点、パラメータースタディ、Web ページへの計算機能の組み込みなどに利用できます。

::div{.actions}
[はじめての梁を解く](#a-simply-supported-beam) [プログラム例を見る](/ja/solver/beams)
::

TypeScript で書かれていて、型定義を同梱しています。GPL-3.0 のもとで公開されているフリーソフトウェアです。Bořek Patzák が作成し、Jan Voříšek やほかのコントリビューターとともに開発を続けています。

## インストール {#install}

```bash
npm install @edubeam/fem
```

`import` でも `require` でも使え、ブラウザと Node 18 以降で動作します。依存パッケージは [mathjs](https://mathjs.org) の 1 つだけです。バージョン 0.3.0 までは GitHub から `ts-fem` としてインストールしていました。それを使っていた場合は、import 文を `@edubeam/fem` に書き換えてください。ほかに変更点はありません。

下の例を空のフォルダーで試すには、まずそのフォルダーを `import` を使うプロジェクトにしてから、インストールします。

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

`package.json` に `"type": "module"` がなくても例は動きますが、その場合は Node が最初に警告を表示します。

## はじめての梁 {#a-simply-supported-beam}

スパン 6 m の鋼製の梁（IPE 200）をピン支点とローラー支点で支え、12 kN/m の等分布荷重をかけます。

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// 単位はすべて SI（m、N、Pa）。鋼材と IPE 200
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// 節点の座標 [x, y, z]（m）と、支点が拘束する自由度
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // ピン支点
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // ローラー支点
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 部材のローカル z 方向に 12 kN/m：左から右へ定義した梁では下向き
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // スパン中央の曲げモーメント（N·m）
console.log(beam.computeShearForceAt(lc, 0)) // A のせん断力（N）
console.log(beam.computeLocalDefl(lc, 2).w[1]) // スパン中央のたわみ（m）
```

`beam.ts` として保存し、`node beam.ts` で実行します。Node 22.18 以降は TypeScript をそのまま実行できます。このファイルには型注釈がないので、古い Node では `beam.mjs` として保存してください。出力は次のとおりです。

```text [出力]
54000
36000
0.04990940552616746
```

どちらも教科書どおりの値で、$M = qL^2/8 = 54$ kNm、$V = qL/2 = 36$ kN です。次の図は、同じ梁を同じソルバーでブラウザ上で解いたものです。

::model-figure{caption="上の梁：スパン 6 m、IPE 200、12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

たわみ 49.91 mm は、オイラー・ベルヌーイ梁の公式 $5qL^4/384EI = 49.63$ mm より 0.28 mm 大きくなっていますが、間違いではありません。この部材はティモシェンコ梁で、0.28 mm はこの梁のせん断変形 $qL^2/8kGA$ です。`k` を `1e32` のような非常に大きな値にすると、この差は消えます。[せん断変形](/ja/solver/materials-sections#shear-deformation)を参照してください。

## コードの流れ {#what-the-code-does}

::div{.steps}
### ソルバーを作る {#make-a-solver}

`new LinearStaticSolver()` は、モデルを保持する空の `domain` と、1 つの荷重ケース `solver.loadCases[0]` を持った状態で作られます。

### モデルを記述する {#describe-the-model}

材料と断面、支点付きの節点、そして節点間の部材を定義します。どれにもラベル（文字列または数値）を付け、モデルのほかの部分はそのラベルで参照します。[節点と支点](/ja/solver/nodes-supports)、[材料と断面](/ja/solver/materials-sections)、[部材とヒンジ](/ja/solver/members-hinges)を参照してください。

### 荷重をかける {#load-it}

荷重は荷重ケースに属します。節点に作用する力、部材に沿った荷重、温度荷重、支点沈下があります。[節点荷重と部材荷重](/ja/solver/loads)を参照してください。

### 解く {#solve}

`solver.solve()` は、すべての荷重ケースについて剛性マトリクスを組み立てて解きます。[解析](/ja/solver/solving)を参照してください。

### 結果を読む {#read-the-results}

部材上の任意の点の断面力、たわみ、材端力、節点変位、反力を読み出せます。[結果の読み出し](/ja/solver/results)を、図にするには[結果の描画](/ja/solver/drawing)を参照してください。
::

## 単位と符号の要点 {#axes-and-signs}

SI 単位で入力すれば、SI 単位で結果が返ります。モデルは x–z 平面にあり、**z 軸は下向き**です。そのため、正の `fz` は下向きに作用し、高さ 4 m の柱の頂部は $z = -4$ にあります。部材上の位置は、始端節点からの距離（m）で指定します。下側引張の曲げモーメントが正です。詳しくは[単位と符号](/ja/solver/conventions)にまとめてあります。

## つまずきやすい 6 つの点 {#pitfalls}

1. **z 軸は下向き**です。重力による荷重は正で、支点より上にあるものは z が負になります。[座標軸](/ja/solver/conventions#axes)を参照してください。
2. **部材の向きで M と w の符号が決まります**。梁は左から右へ、柱は下から上へ定義すると、符号が教科書どおりになります。[部材の向き](/ja/solver/conventions#member-direction)を参照してください。
3. **パラメーターが抜けていても、エラーにはならず `NaN` やおかしな値になります**。断面には `a`、`iy`、`k` が必要です。材料には `e` が必要で、`k` が非常に大きい場合を除いて `g` も必要です。[材料と断面](/ja/solver/materials-sections)を参照してください。
4. **節点や部材を追加したり、支点を変更したりしたら**、もう一度解く前に `solver.codeNumberGenerated = false` を設定してください。[変更後の再計算](/ja/solver/solving#solving-again-after-a-change)を参照してください。
5. **反力は mathjs の Matrix または配列で返ります**。並び順は、支点の自由度を指定した順です。[反力](/ja/solver/results#reactions)を参照してください。
6. **不安定構造（機構）でも、例外が出るとは限りません**。$10^{12}$ m のような変位は、構造物が自由に動けることを意味します。[解析に失敗するとき](/ja/solver/solving#when-solving-fails)を参照してください。

## 次に読むページ {#next}

::card-grid{cols="2"}
:::card{title="プログラム例" icon="lucide:book-open" to="/ja/solver/beams"}
動作を確認済みの完全なプログラム：梁、ラーメン、トラス、解答付きの演習プリント、小さな HTTP サーバー。
:::
:::card{title="結果を描画する" icon="lucide:chart-spline" to="/ja/solver/drawing"}
解いたモデルを @edubeam/plot に渡すと、その断面力図が SVG で得られます。Vue からでも、Node のスクリプトからでも使えます。
:::
:::card{title="API リファレンス" icon="lucide:list-tree" to="/ja/solver/reference"}
すべてのクラス、メソッド、引数を、単位と戻り値とともに掲載しています。
:::
:::card{title="理論" icon="lucide:sigma" to="/ja/elements/beam"}
梁要素とその剛性マトリクス、座標変換を、EduBeam の理論マニュアルで解説しています。
:::
::
