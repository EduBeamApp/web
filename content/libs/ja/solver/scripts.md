---
title: スクリプトとサーバー
description: "Node から @edubeam/fem を使います。解答付きの演習プリント、CSV に書き出す影響線、梁を解く小さな HTTP エンドポイント。"
order: 15
source: site
---

# スクリプトとサーバー {#scripts-and-servers}

ソルバーはブラウザを必要としません。Node では、解答の作成、パラメータースタディ、表計算ソフト用の表の作成、Web ページからのリクエストへの応答などに使えます。

例は TypeScript で書いてあります。Node 22.18 以降は `.ts` ファイルを直接実行できます（`node answers.ts`）。[インストール](/ja/solver/getting-started#install)のとおりに準備したフォルダーで実行してください。古い Node では、型注釈を削除して `.mjs` として保存します。

## 解答付きの演習プリント {#answer-key}

1 つの演習問題について、数値の異なる 20 問を作ります。等分布荷重と集中荷重を受ける単純梁で、それぞれの反力と最大曲げモーメントを CSV ファイルに書き出します。数値は問題番号から決まるので、同じスクリプトは常に同じプリントを書き出します。

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** 問題 i：q kN/m の等分布荷重と、A から a m の位置の F kN を受ける単純梁 */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // 4〜7 m
  const q = 5 + 5 * (i % 3) // 5、10、15 kN/m のいずれか
  const F = 10 + 10 * (i % 2) // 10 または 20 kN
  const a = L / 4 + (i % 3) // スパン内のどこか
  return { L, q, F, a }
}

const solve = ({ L, q, F, a }: ReturnType<typeof exercise>) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  solver.solve()

  // 反力は端部のせん断力に等しい：A では V(0)、B では -V(L)
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // 1 cm 間隔の点から求めた最大曲げモーメント
  const { x, M } = beam.computeBendingMoment(lc, L * 100)
  const top = M.indexOf(Math.max(...M))
  return [rA, rB, M[top] / 1e3, x[top]].map((v) => v.toFixed(2))
}

const rows = ['no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m']
for (let i = 1; i <= 20; i++) {
  const ex = exercise(i)
  rows.push([i, ex.L, ex.q, ex.F, ex.a, ...solve(ex)].join(','))
}
writeFileSync('answers.csv', rows.join('\n') + '\n')
```

```text [answers.csv]
no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m
1,5,10,20,2.25,36.00,34.00,55.69,2.25
2,6,15,10,3.5,49.17,50.83,80.58,3.28
3,7,5,20,1.75,32.50,22.50,50.63,2.50
...
```

1 問目を手計算で確かめます。$R_B = (10 \cdot 5 \cdot 2.5 + 20 \cdot 2.25)/5 = 34$ kN、$R_A = 70 - 34 = 36$ kN です。せん断力は集中荷重の位置で符号が変わるので、最大曲げモーメントはそこで生じ、$36 \cdot 2.25 - 10 \cdot 2.25^2/2 = 55.69$ kNm となります。

スクリプトを短くするための工夫が 2 つあります。単純梁では反力が端部のせん断力に等しいので、[反力用のヘルパー関数](/ja/solver/results#reactions)は要りません。また、最大曲げモーメントは 1 cm 間隔の点から求めています。この問題では極値が荷重位置にあるか、評価点から 1 cm 以内にあるので、これで厳密な値が得られます。各問題を解答付きまたは解答なしで描くには、@edubeam/plot の[演習問題と試験](/ja/plot/exercises)を参照してください。試験問題一式を印刷することもできます。

## CSV に書き出す影響線 {#an-influence-line-as-csv}

2 径間連続梁の中間支点上の曲げモーメントは、1 kN の荷重が梁の上を移動するとどう変わるでしょうか。荷重位置ごとに梁を作って解き、1 行ずつ書き出します。

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** スパン 5 m の 2 径間、A から `at` m の位置に 1 kN：中間支点上の曲げモーメント */
const momentAtB = (at: number): number => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [5, 0, 0], [DofID.Dz])
  domain.createNode('C', [10, 0, 0], [DofID.Dz])
  const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  const [member, x] = at <= 5 ? [1, at] : [2, at - 5]
  solver.loadCases[0].createBeamConcentratedLoad(member, [0, 1e3, 0, x], true)
  solver.solve()
  return span1.computeBendingMomentAt(solver.loadCases[0], 5)
}

const rows = ['x_m,MB_kNm_per_kN']
for (let at = 0; at <= 10; at += 0.5) {
  rows.push(`${at},${(momentAtB(at) / 1e3).toFixed(4)}`)
}
writeFileSync('influence.csv', rows.join('\n') + '\n')
```

```bash
node influence.ts
```

```text [influence.csv]
x_m,MB_kNm_per_kN
0,0.0000
0.5,-0.1237
1,-0.2400
1.5,-0.3412
2,-0.4200
2.5,-0.4688
3,-0.4800
...
```

等スパンの 2 径間連続梁の公式は $M_B = -P\,a\,(L^2 - a^2)/4L^2$ です。$a = 2.5$ m で $-0.46875$ kNm、最も不利な位置は $a = L/\sqrt{3} = 2.887$ m です。影響線は対称なので、21 行の最後は最初と同じく、支点 C 上の 0 で終わります。

荷重位置ごとに新しいソルバーを作るほうが、1 つのソルバーを書き換えるより簡単で、かかる時間も数ミリ秒です。解いたモデルを書き換える方法は、[変更後の再計算](/ja/solver/solving#solving-again-after-a-change)を参照してください。

## HTTP エンドポイントで動くソルバー {#a-solver-behind-an-http-endpoint}

Node 標準の `http` モジュールだけを使った小さなサーバーです。送られてきた任意のスパンと荷重について、単純梁を解きます。

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** スパン `span` m、`q` kN/m の IPE 200 単純梁：スパン中央の M とたわみ */
const solveBeam = (span: number, q: number) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [span, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  solver.solve()
  return {
    momentKNm: beam.computeBendingMomentAt(lc, span / 2) / 1e3,
    deflectionMm: beam.computeLocalDefl(lc, 2).w[1] * 1e3,
  }
}

createServer(async (req, res) => {
  try {
    let body = ''
    for await (const chunk of req) body += chunk
    const { span, q } = JSON.parse(body) as { span?: unknown; q?: unknown }
    if (typeof span !== 'number' || !(span > 0) || typeof q !== 'number') {
      throw new Error('Bad input')
    }
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(solveBeam(span, q)) + '\n')
  } catch {
    // 不正な JSON、不正な数値、解けないモデル：どれでもサーバーは止めない
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm、$5qL^4/384EI = 49.63$ mm です。`try` が重要です。不正な JSON は例外を投げ、ソルバーが解けないモデルも例外を投げることがあります。どちらの場合も、サーバーが止まってはいけません。一般に公開するサービスなら、リクエストのサイズとスパンにも上限を設けるべきです。

## ブラウザで使う {#in-the-browser}

同じコードはそのままページ内で動き、読者の端末上で解きます。このサイトでその場で計算される図は、すべてこの仕組みで動いています。Vite や Nuxt などのバンドラーでパッケージを import し、@edubeam/plot で[結果を描画](/ja/solver/drawing)します。モデルは数ミリ秒で解けるので、入力イベントのたびに解き直すこともできます。
