---
description: "ブラウザで使える無料の 2D 構造解析。梁、ラーメン、トラスを描いて荷重をかければ、N、V、M 図、反力、たわみがすぐに得られます。"
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "無料のオンライン構造解析"
  tagline: 梁、ラーメン、トラスを描いて荷重をかけると、編集するたびに図が更新されます。インストールもアカウント登録も料金も不要で、FEM による解析結果がすべてブラウザで得られます。
  image:
    src: /screenshots/ja/hero.webp
    alt: 解析済みのラーメンを表示した EduBeam
  actions:
    - theme: brand
      text: アプリを起動
      link: https://run.edubeam.app/?lang=ja
    - theme: alt
      text: ガイドを読む
      link: /ja/guide/introduction
    - theme: alt
      text: 例題を見る
      link: /ja/examples/

features:
  - icon: ⚡
    title: 描いたそばから結果が出る
    details: 「解析」ボタンはありません。節点をドラッグする、ヒンジにチェックを入れる、荷重を変える。そのたびに N、V、M、反力、変位図がすぐに追従します。
    link: /ja/essentials/results
    linkText: 結果と断面力図
  - icon: 🧑‍🏫
    title: 授業のための設計
    details: 最初の操作を案内するガイド、マウスを重ねると表示される値、構造物が不安定になる理由を説明するソルバー、講義資料に貼れる共有リンク。
    link: /ja/guide/teaching
    linkText: EduBeam を使った授業
  - icon: 🌍
    title: 言語も単位も選べる
    details: 画面表示は 22 言語に対応。単位は SI 単位系と米国慣用単位から、座標軸は z 下向きと教科書どおりの y 上向きから選べます。
    link: /ja/essentials/units-settings
    linkText: 単位と設定
  - icon: 🔗
    title: 共有、エクスポート、埋め込み
    details: モデル全体をリンクで送ったり、ファイルに保存したりできます。図は PNG や SVG で、結果の表は CSV でエクスポートできます。
    link: /ja/essentials/import-export
    linkText: ファイル・リンク・エクスポート
---

## ここから始める {#start-here}

::div{.start-grid}

**EduBeam ははじめてですか？** [10 分のクイックスタート](/ja/guide/quick-start)に沿って進めてください。単純梁を順を追ってモデル化し、すべての結果を手計算で確認します。

**作りたいものが決まっていますか？** [チュートリアル](/ja/tutorials/three-hinged-frame)に進むか、用意された[例題](/ja/examples/)を開いて変更してみましょう。

**授業を担当していますか？** [EduBeam を使った授業](/ja/guide/teaching)をご覧ください。課題用の共有リンク、スライドに埋め込めるビューア、演習問題を紹介しています。

::

::div{.shots}

![トラス：軸力（引張が正）](/screenshots/ja/tut-truss.webp)

![不安定構造を可視化：EduBeam が解析できない理由を示します](/screenshots/ja/ui-mechanism.webp)

::

## モデル化できるもの {#what-you-can-model}

- 平面内の**梁、ラーメン、トラス**：連続梁、門形ラーメン、3 ヒンジアーチ、ピン接合トラス。
- **あらゆる支点**：ピン、ローラー、固定、ローラー（回転拘束）、傾斜支点、支点沈下。
- **荷重**：集中荷重と集中モーメント、等分布荷重と台形分布荷重、部材上の任意の位置に作用する集中荷重、温度荷重。
- **あらゆる断面**：ライブラリ（IPE、HEA、AISC W、HSS、長方形、鋼管）から選ぶか、多角形として描きます。断面性能は自動で計算されます。

詳しくは[はじめに](/ja/guide/introduction)をご覧ください。

::elementarium-promo
::
