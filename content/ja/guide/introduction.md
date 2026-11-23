---
description: "EduBeam とは：2D の梁、ラーメン、トラスを解く、ブラウザで動く無料の FEM ソルバーです。できること・できないこと、対象ユーザー、ガイドの構成、土台のオープンソースライブラリを紹介します。"
source: site
---

# はじめに

[EduBeam]{.edubeam} は、ブラウザで動く**梁、ラーメン、トラス**のための無料の構造解析アプリです。構造物を描き、支点を設け、荷重をかけると、変更するたびに有限要素法ソルバーが断面力図、反力、たわみを計算し直します。*解析*ボタンはなく、インストールもアカウント登録も不要です。

::div{.actions}
[EduBeam を起動 ↗](https://run.edubeam.app/?lang=ja){target="_blank"} [クイックスタート（10 分）](/ja/guide/quick-start)
::

![EduBeam の 3 ヒンジラーメン：荷重はオレンジ、反力は紫、曲げモーメントは赤、変位図はグレー](/screenshots/ja/hero.webp)

:span{#your-first-visit}

## できること {#what-it-does}

::card-grid{cols="2"}
:::card{title="構造" icon="lucide:triangle" to="/ja/essentials/elements"}
x–z 平面内の梁、連続梁、ラーメン、トラス。ティモシェンコ梁要素で組み立てます。材端ヒンジを設ければ、部材はトラス材になります。
:::
:::card{title="支点" icon="lucide:anchor" to="/ja/essentials/nodes-supports#supports"}
ピン、ローラー、固定、ローラー（回転拘束）のほか、`Dx`、`Dz`、`Ry` を自由に組み合わせた拘束も、記号を見ながら選べます。傾斜支点と支点沈下も扱えます。
:::
:::card{title="荷重" icon="lucide:arrow-down-to-line" to="/ja/essentials/loads"}
節点または部材上の任意の位置に作用する力とモーメント、等分布荷重と台形分布荷重、温度荷重、強制変位。
:::
:::card{title="断面" icon="lucide:shapes" to="/ja/essentials/elements#cross-sections"}
欧州と米国の断面ライブラリ、または自分で描いた任意の多角形。$A$、$I_y$、$I_z$、$I_{yz}$、主軸、断面二次半径は自動で計算されます。
:::
:::card{title="結果" icon="lucide:chart-spline" to="/ja/essentials/results"}
**N**、**V**、**M** 図、変位図、反力、節点変位、材端力、要素剛性マトリクス。
:::
:::card{title="解析" icon="lucide:calculator" to="/ja/elements/analysis"}
線形静的解析です。線形モデルの範囲では結果は厳密で、メッシュを細かくする必要はありません。構造物が不安定な場合は、その理由を説明し、動き方をアニメーションで示します。
:::
:::card{title="ファイル" icon="lucide:folder-open" to="/ja/essentials/import-export"}
プロジェクトは JSON、モデル全体はリンク、図は PNG や SVG、結果は CSV。置き換えたモデルも残り、データが端末の外に出ることはありません。
:::
:::card{title="単位" icon="lucide:ruler" to="/ja/essentials/units-settings"}
SI 単位と米国慣用単位をワンクリックで切り替え、物理量ごとの設定もできます。z 軸は下向き、または教科書どおりの y 軸上向き。
:::
::

## （まだ）できないこと {#what-it-does-not-do-yet}

制約を先に知っておくと、時間の節約になります。

::div{.limits}
- **2D のみ。** 面外の挙動も 3D のラーメンも扱えません。
- **線形静的解析のみ。** 2 次（P–Δ）効果、座屈、動的解析、塑性は扱えません。
- **荷重ケースは 1 つ。** 荷重の組み合わせや包絡線はありません。ケースごとに別々のファイルやリンクとして保存してください。
- **自重なし。** 分布荷重として加えてください。
- **断面検定なし。** EduBeam が出すのは断面力と変位です。設計規準に基づく検定は利用者自身で行ってください。
::

必要な機能が足りない場合は、[issue を作成](https://github.com/janvorisek/edubeam/issues)してください。

::elementarium-promo{placement="introduction"}
::

## 対象ユーザー {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="学生" icon="lucide:graduation-cap" to="/ja/practice"}
手計算の結果をすぐに確かめられます。練習問題では、解きながら答え合わせができます。
:::
:::card{title="教員" icon="lucide:presentation" to="/ja/guide/teaching"}
支点、ヒンジ、荷重によって断面力がどう変わるかを、教室のプロジェクターでその場で示せます（22 言語に対応）。学生ごとに異なる試験問題も印刷できます。
:::
:::card{title="技術者" icon="lucide:hard-hat" to="/ja/elements/analysis"}
本格的なデスクトップソフトを開く前の、手早い検算に。解析の手順はすべてドキュメントで説明しています。
:::
:::card{title="開発者" icon="lucide:code-xml" to="#libraries"}
EduBeam を支えるソルバーと描画を、オープンソースのライブラリとして自分のコードで使えます。
:::
::

## このガイドの構成 {#how-this-guide-is-organised}

サイドバーではページを次のようにまとめています。アプリの **?** ボタンを押すと、このガイドの該当ページがお使いの言語で開きます。

::card-grid{cols="2"}
:::card{title="入門" icon="lucide:flag" to="/ja/guide/quick-start"}
このページと、10 分で最初の梁を作るクイックスタート。
:::
:::card{title="モデル化" icon="lucide:pencil-ruler" to="/ja/essentials/user-interface"}
インターフェース、節点と支点、要素、材料と断面、荷重、単位と設定。
:::
:::card{title="結果の読み取り" icon="lucide:chart-spline" to="/ja/essentials/results"}
断面力図と結果の表、そして手計算による確認方法。
:::
:::card{title="共有と授業" icon="lucide:share-2" to="/ja/essentials/import-export"}
プロジェクトファイル、共有リンク、画像と CSV のエクスポート、EduBeam を使った授業。
:::
:::card{title="チュートリアル" icon="lucide:triangle" to="/ja/tutorials/inclined-beam"}
傾斜梁、3 ヒンジラーメン、平面トラス、支点沈下のある連続梁。どれも順を追ってモデル化し、手計算で確認します。
:::
:::card{title="例題" icon="lucide:library" to="/ja/examples/"}
ワンクリックで開ける 6 つのモデル。演習問題と解答付きです。
:::
:::card{title="理論マニュアル" icon="lucide:sigma" to="/ja/elements/conventions"}
座標系と符号規約、梁要素とトラス要素、EduBeam がモデルを解く仕組み。
:::
:::card{title="ヘルプ" icon="lucide:life-buoy" to="/ja/reference/shortcuts"}
キーボード・マウス・タッチ操作、トラブルシューティング、よくある質問。
:::
::

## 自分のツールを作る {#libraries}

EduBeam は 2 つのオープンソースライブラリの上に作られており、どちらもこのサイトで解説しています。スクリプトで構造物を解く、学生ごとに異なる演習問題を作る、スライドや講義資料の図を描く、といった用途に使えます。

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/ja/solver"}
EduBeam を支える TypeScript 製の有限要素法ソルバー。ブラウザでも Node でも、十数行のコードで梁をモデル化し、解き、結果を読み出せます。
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/ja/plot"}
解析済みの構造物を、荷重、反力、N、V、M 図とともに SVG で描く Vue 3 コンポーネント。
:::
::

## 言語 {#languages}

EduBeam は 22 言語に対応し、ブラウザの言語設定に合わせた言語で起動します。**設定 → 言語と地域**で切り替えるか、ここから選んでください。

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-hu"} Magyar](https://run.edubeam.app/?lang=hu){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-ro"} Română](https://run.edubeam.app/?lang=ro){target="_blank"}
- [:icon{name="circle-flags:lang-sk"} Slovenčina](https://run.edubeam.app/?lang=sk){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-el"} Ελληνικά](https://run.edubeam.app/?lang=el){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

リンク側で言語を指定することもできます。`run.edubeam.app/?lang=ja` は日本語で開きます。

## 作者とクレジット {#authors-credits}

[EduBeam]{.edubeam} は [Jan Voříšek](https://github.com/janvorisek) が独立したプロジェクトとして開発しています。その前身は、[チェコ工科大学プラハ校（CTU）土木工学部](https://www.fsv.cvut.cz/en)力学科の [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/)、[Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/)、[Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) が作った、Windows と Linux 向けのデスクトップ版 EduBeam です。そのセッションファイルは今も開けます。ソルバー [@edubeam/fem](/ja/solver) は Bořek Patzák の最初のバージョンから発展したものです。アプリもソルバーも GPL-3.0 のオープンソースです。

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"リード開発者・プロダクトデザイナー","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"開発者：タッチ操作、描画の高速化、荷重と支点","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"初代 EduBeam と最初の FEM ソルバー","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## 貢献する {#contribute}

::card-grid{cols="3"}
:::card{title="問題を報告" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
わかりにくい点、誤り、不具合はありませんか。GitHub の issue で開発チームに届きます。
:::
:::card{title="翻訳を改善" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
アプリの文言は言語ごとに 1 つのファイルにまとまっています。プルリクエストを歓迎します。
:::
:::card{title="広める" icon="lucide:share-2"}
クラスメートや同僚に EduBeam を紹介したり、講義資料にモデルのリンクを載せたりしてください。
:::
::
