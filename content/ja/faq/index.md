---
description: "EduBeam についての短い回答：料金、オフラインでの利用、プライバシー、精度、結果の計算方法、引用の仕方、練習問題、共有、コードからの利用。"
source: site
---

# よくある質問

どの質問にも短く答え、詳しく説明しているページへのリンクを添えています。探している質問が見つからない場合は、[トラブルシューティング](/ja/reference/troubleshooting)を見るか、[GitHub で質問](https://github.com/janvorisek/edubeam/issues)してください。

## 全般 {#general}

### EduBeam とは何ですか？ {#what-is-edubeam}

2D の梁、ラーメン、トラスの線形静的解析を行う、無料のオープンソースのアプリです。すぐにフィードバックが欲しい学生、教員、技術者のために作られ、ブラウザで動きます。できることとできないことは[はじめに](/ja/guide/introduction)にまとめています。

### 本当に無料ですか？アカウントは必要ですか？ {#is-it-really-free-do-i-need-an-account}

無料で、アカウントも不要です。[run.edubeam.app](https://run.edubeam.app/?lang=ja){target="_blank"} を開けば、すぐにモデル化を始められます。インストールするものはなく、利用制限もありません。ソースコードは GPL-3.0 ライセンスで [GitHub](https://github.com/janvorisek/edubeam) に公開しています。

### どのブラウザや端末で使えますか？ {#which-browsers-and-devices-work}

最新の Chrome、Edge、Firefox、Safari であれば、パソコンでもタブレットでもスマートフォンでも使えます。タッチスクリーンでは、タップで選択、節点のドラッグで移動、それ以外の場所のドラッグで表示の移動（パン）、ピンチでズーム、長押しでキャンバスのメニューを開きます。それでも、モデル化はマウスとキーボードのほうが速くできます。[キーボード・マウス・タッチ](/ja/reference/shortcuts#touch)をご覧ください。

### モデルが消えてしまいました。元に戻せますか？ {#i-lost-my-model-can-i-get-it-back}

おそらく戻せます。モデルをクリアしたり、リンク、ファイル、例題で置き換えたりすると、EduBeam は前のモデルを **☰ → 最近のモデル**（直近 10 件）に残します。<kbd>Ctrl</kbd>+<kbd>Z</kbd> でも置き換えを取り消せます。どちらもそのブラウザの中にしか残らないため、別のコンピューターや別のブラウザプロファイルで作ったモデルはそこにはありません。[最近のモデル](/ja/essentials/import-export#recent-structures)をご覧ください。

### オフラインで使えますか？ {#can-i-use-it-offline}

使えます。EduBeam はプログレッシブ Web アプリ（PWA）です。一度ブラウザで読み込めば接続がなくても動作し続け、ブラウザによってはインストールを勧められることもあります。新しいバージョンが出ると、更新の前にダイアログで確認されます。

### データはどこに保存されますか？ {#where-is-my-data-stored}

お使いのブラウザの中です。アカウントもクラウドストレージもありません。アプリはモデルと設定をそのブラウザに保存し、共有リンクはモデルをリンク自体に埋め込んでいます。[ブラウザに保存される内容](/ja/essentials/units-settings#what-is-stored-in-your-browser)をご覧ください。

ただし、run.edubeam.app のアプリは利用統計（Google Analytics）とエラーレポート（Sentry）を収集しています。エラーレポートや、Sentry が一部のセッションについて行う記録には、モデルを含め、画面に表示されていた内容が含まれることがあります。

### 構造力学の問題はどこで練習できますか？ {#practice}

[構造力学の練習問題](/ja/practice)のページで練習できます。毎回新しい数値で梁、ラーメン、トラスが出題されます。反力と曲げモーメントの最大値、または部材力を紙の上で求めて入力すると、各値がすぐに判定されます。[例題](/ja/examples/)にも問いと解答が付いています。教員は[試験問題作成ツール](/ja/exam)で、学生ごとに異なる試験問題を解答付きで印刷できます。[練習問題と試験問題](/ja/guide/teaching#practice-and-test-papers)をご覧ください。

### EduBeam はどう引用すればよいですか？ {#cite}

ソフトウェアとして、使用したバージョンと日付を添えて引用してください。バージョンは **☰** メニューの一番下に表示されています。たとえば次のようにします。

> Voříšek, J. ほか. *EduBeam*. バージョン 1.3.4, \[ソフトウェア\]. https://edubeam.app, (参照 2026-11-18).

特定のモデルを示したい場合は、その[共有リンク](/ja/essentials/import-export#share-a-link)を添えてください。どの読者にも同じモデルが開きます。

## モデル化 {#modelling}

### 固定・ピン・ローラー支点はどう作りますか？ {#how-do-i-make-a-fixed-pinned-roller-support}

節点をクリックして**支点条件**を選び、ピン、ローラー、固定、ローラー（回転拘束）などの記号を選びます。または、**節点**タブで拘束する自由度にチェックを入れます。`Dx` + `Dz` + `Ry` は固定、`Dx` + `Dz` はピン、`Dz` だけならローラーです。支点の種類はすべて[節点と支点](/ja/essentials/nodes-supports#supports)に載っています。

### トラスはどう作りますか？ {#how-do-i-make-a-truss}

部材を通常の要素として描き、それぞれの両端を解放します。**要素**タブで**材端ヒンジ**の両方にチェックを入れるか、マウスで部材を描く前に、バナーで**始端ヒンジ**と**終端ヒンジ**にチェックを入れておきます。荷重は節点にかけます。[チュートリアル：平面トラス](/ja/tutorials/truss)で、トラスを 1 つ順を追って作っています。

### ラーメンにヒンジを入れるには？ {#how-do-i-put-a-hinge-in-a-frame}

自由に回転させたい要素の端で、曲げモーメントを解放します。**要素**タブで、その端の材端ヒンジにチェックを入れてください。ヒンジは要素の端ごとに設けるものなので、複数の要素が集まる節点で 1 つの要素だけを解放すると、残りの要素は剛に接合されたままです。[材端ヒンジ](/ja/essentials/elements#end-hinges)をご覧ください。

### 梁の途中に支点や集中荷重を加えるには？ {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

支点の場合は、マウスで梁の上に節点を追加し（カーソルアイコンの**節点を追加**ボタン）、**構造物に接続**を選びます。梁はその節点で 2 つに分割され、そこに支点を設けられます。集中荷重には節点は不要です。要素に**集中荷重**を加え、始端節点からの位置を指定してください。[既存の要素の上に節点を置く](/ja/essentials/nodes-supports#placing-a-node-on-an-existing-element)と[集中荷重](/ja/essentials/loads#concentrated-load)をご覧ください。

### 自重はかけられますか？ {#can-i-apply-self-weight}

自動ではかけられません。材料の密度は静的解析には使われないためです。等分布荷重 $f_z = \rho g A$ として加えてください。たとえば IPE 200 なら $7850 \cdot 9.81 \cdot 28.48 \cdot 10^{-4} = 219$ N/m、つまり 0.22 kN/m です。

### 傾斜支点はモデル化できますか？ {#can-i-model-inclined-supports}

できます。節点に**節点座標系の角度**を設定すると、その節点の支点は回転した座標軸の方向に働きます。[傾斜支点](/ja/essentials/nodes-supports#inclined-skewed-supports)をご覧ください。

### 米国慣用単位で作業できますか？ {#can-i-work-in-us-customary-units}

できます。ビューア右下の単位チップをクリックすると**設定 → 言語と地域**が開きます。**単位系**を**米国慣用単位（ヤード・ポンド法）** にすればフィートとキップになり、単位を 1 つずつ選ぶこともできます。モデルは SI 単位で保存されるので、単位を切り替えても表示が換算されるだけで、モデルは変わりません。[単位と設定](/ja/essentials/units-settings)をご覧ください。

### 荷重ケースや荷重の組み合わせはありますか？ {#are-there-load-cases-or-combinations}

ありません。1 つのモデルの荷重ケースは 1 つです。ケースごとに別々のファイルやリンクとして保存し、結果は手作業で組み合わせてください。複数の荷重ケースを含むデスクトップ版 EduBeam のセッションを開くと、最初のケースだけが読み込まれ、読み込まれなかったケースがメッセージで示されます。

### 荷重が上を向いてしまうのはなぜですか？ {#why-do-my-loads-point-up}

おそらく負の値を入力したためです。EduBeam ではグローバル座標系の z 軸が**下向き**なので、正の `fz` や `Fz` は下向き、つまり重力方向の荷重です。下向きに 12 kN/m なら `fz = 12` です。[座標系と符号規約](/ja/elements/conventions#loads)をご覧ください。授業で鉛直軸を上向きにしている場合は、**設定 → 言語と地域 → 座標系**で **x 右向き、y 上向き**に切り替えてください。入力も結果もその軸に従うようになります。

## 結果 {#results}

### 「解析」ボタンがないのはなぜですか？ {#why-is-there-no-solve-button}

変更のたびにモデルを解き直しているからです。結果が表示されない場合は、モデルがまだ解ける状態になっていません。その理由はキャンバス上のメッセージに表示されます。確認すべき点は[トラブルシューティング](/ja/reference/troubleshooting#no-results-are-drawn)にまとめています。

### たわみが公式とわずかに異なるのはなぜですか？ {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam はティモシェンコ梁要素を使うので、たわみには、教科書の公式ではふつう省略されるせん断変形が含まれます。細長い梁では差は 1 % 程度で、[クイックスタート](/ja/guide/quick-start#_8-check-by-hand)ではそれを手計算で足し合わせています。不静定構造では、せん断剛性によって断面力もわずかに変わります。詳しくは[手計算による結果の確認](/ja/guide/verification)をご覧ください。

### 結果の精度は？要素を増やす必要はありますか？ {#how-accurate-are-the-results-do-i-need-more-elements}

線形静的解析では、EduBeam が扱うどの種類の荷重に対しても梁要素は厳密です。部材 1 本につき要素 1 つで十分で、細分化すべきメッシュはありません。節点を追加するのは、支点、ヒンジ、断面の変化、節点荷重を設けたい場所や、変位を読み取りたい場所だけです。[精度](/ja/essentials/results#precision-and-accuracy)をご覧ください。

### EduBeam はどうやって結果を計算していますか？ {#how-does-edubeam-compute-the-results}

構造解析の授業で教わる直接剛性法（有限要素法）で、ブラウザの中で計算しています。[EduBeam がモデルを解く仕組み](/ja/elements/analysis)では、手計算でもたどれる小さな例で各ステップを追っています。ソルバー自体もオープンソースの [@edubeam/fem](/ja/solver) として公開しています。

### 剛性マトリクスは見られますか？ {#can-i-see-the-stiffness-matrices}

見られます。**要素**タブで、要素の行にあるマトリクスのボタンを押すと、その要素の 6 × 6 の剛性マトリクスがグローバル座標系、SI 単位（N、m）で開きます。ビューアで要素をクリックしても**剛性マトリクス**を選べます。導出は[梁要素](/ja/elements/beam#global-stiffness-matrix)のページにあります。

### 反力はどこに表示されますか？ {#where-are-the-reactions-listed}

ビューアに、値の付いた矢印として表示されます（表示オプションの**反力**。初期状態でオン）。**結果 → CSV をエクスポート**で出力したファイルや、**コピー**でクリップボードに入る内容にも含まれます。**結果**タブには節点変位と要素の材端力が表示されます。[結果と断面力図](/ja/essentials/results)をご覧ください。

## ファイルと共有 {#files-sharing}

### モデルを共有するには？ {#how-do-i-share-a-model}

**モデルを共有**を押し、**コピー**を押します。リンクにはモデル全体が含まれ、開いた人はそれぞれ自分用のコピーを編集できます。リアルタイムの共同編集はできません。**自分の表示を共有**をオンにすると、自分の画面と同じ図やラベルを表示した状態でリンクが開きます。[リンクで共有する](/ja/essentials/import-export#share-a-link)と、授業で使う場合は[EduBeam を使った授業](/ja/guide/teaching#in-lecture-notes-and-assignments)をご覧ください。

### 自分の Web サイトやスライドにモデルを埋め込めますか？ {#can-i-embed-a-model-on-my-website-or-in-slides}

できます。共有リンクに `&viewer=1` を付けて `<iframe>` に入れてください。[ビューアの埋め込み](/ja/essentials/import-export#embed-a-read-only-viewer)をご覧ください。ページ、スライド、印刷した講義資料に静止した図を載せたい場合は、SVG をエクスポートするか、[@edubeam/plot](/ja/plot) を使ってコードから描いてください。

### 画像や表をエクスポートできますか？ {#can-i-export-images-or-tables}

できます。**☰ → 画像をエクスポート**（<kbd>Ctrl</kbd>+<kbd>P</kbd>）で、図を指定したサイズや縮尺の PNG または SVG で保存できます。**結果 → CSV をエクスポート**で 2 つの結果表を保存でき、**コピー**で表計算ソフト用にクリップボードへコピーできます。[画像のエクスポート](/ja/essentials/import-export#export-an-image)をご覧ください。

### デスクトップ版 EduBeam のファイルを開けますか？ {#can-i-open-files-from-the-desktop-edubeam}

開けます。デスクトップ版 EduBeam 2.x〜3.5 で保存したセッション（`.xml`）は、`project.json` と同じように、**☰ → プロジェクトを開く**を使うか、アプリにドロップして開きます。値は kN、kPa、m として読み込まれます。[プロジェクトを開く](/ja/essentials/import-export#open-a-project)をご覧ください。

### モデルをプログラムで生成できますか？ {#can-i-generate-models-programmatically}

できます。方法は 2 つあります。

- **ファイルを書き出す。** `project.json` は SI 単位のプレーンな JSON なので、どの言語のスクリプトでも書き出せます。EduBeam では**プロジェクトを開く**かドラッグ＆ドロップで開けます。[プロジェクトファイルの形式](/ja/essentials/import-export#project-file-format)をご覧ください。
- **コードで解く。** [@edubeam/fem](/ja/solver) は、EduBeam を支える有限要素法ソルバーを JavaScript と TypeScript のライブラリにしたものです。その結果は [@edubeam/plot](/ja/plot) で、たとえば[自動生成した演習プリント](/ja/plot/exercises)として描けます。

[クイックスタート](/ja/guide/quick-start)の梁を SI 単位で書くと次のようになります。

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // ピン支点
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // ローラー支点
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m、下向き

solver.solve()
beam.computeBendingMomentAt(lc, 3) // スパン中央で 54000 N·m
beam.computeLocalDefl(lc, 2).w[1] // スパン中央で 0.0502 m
```

## お問い合わせ {#support}

### 不具合の報告や機能のリクエストはどうすればいいですか？ {#how-do-i-report-a-bug-or-request-a-feature}

[GitHub](https://github.com/janvorisek/edubeam/issues) で issue を作成し、問題がわかる共有リンクかプロジェクトファイルを添付してください。個別の問い合わせは [support@edubeam.app](mailto:support@edubeam.app) までお寄せください。
