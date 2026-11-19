---
title: 스크립트 및 서버
description: "Node에서 @edubeam/fem 라이브러리를 씁니다. 정답지가 딸린 연습 문제지, CSV로 저장하는 영향선, 요청을 받아 보를 푸는 작은 HTTP 엔드포인트."
order: 15
source: site
---

# 스크립트 및 서버 {#scripts-and-servers}

솔버에는 브라우저가 필요 없습니다. Node에서 정답지를 만들고, 매개변수 연구를 하고, 스프레드시트용 표를 만들고, 웹 페이지의 요청에 응답할 수 있습니다.

예제는 TypeScript로 작성했습니다. Node 22.18 이상에서는 [설치](/ko/solver/getting-started#install)에서처럼 준비한 폴더에서 `.ts` 파일을 바로 실행할 수 있습니다(`node answers.ts`). 그보다 오래된 Node에서는 타입 표기를 지우고 `.mjs`로 저장하세요.

## 정답지가 딸린 연습 문제지 {#answer-key}

한 연습 문제의 변형 20개입니다. 분포하중과 집중하중을 받는 단순보이며, 문제마다 반력과 최대 모멘트를 CSV 파일에 씁니다. 숫자는 문제 번호에서 정해지므로, 같은 스크립트는 언제나 같은 문제지를 만듭니다.

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** 문제 i: q kN/m와 A에서 a m 위치의 F kN을 받는 단순보 */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // 4–7 m
  const q = 5 + 5 * (i % 3) // 5, 10, 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 또는 20 kN
  const a = L / 4 + (i % 3) // 경간 안의 어딘가
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

  // 반력은 양 끝의 전단력: A에서 V(0), B에서 -V(L)
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // 최대 모멘트, 1 cm 간격의 점에서 구함
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

첫 번째 문제를 손으로 확인해 봅니다. $R_B = (10 \cdot 5 \cdot 2.5 + 20 \cdot 2.25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN입니다. 전단력의 부호가 집중하중 위치에서 바뀌므로 최대 모멘트도 그곳에 생깁니다. $36 \cdot 2.25 - 10 \cdot 2.25^2/2 = 55.69$ kNm입니다.

두 가지를 단순하게 처리한 덕분에 스크립트가 짧습니다. 단순보에서는 반력이 양 끝의 전단력과 같으므로 [반력 헬퍼 함수](/ko/solver/results#reactions)가 필요 없습니다. 그리고 최대 모멘트는 1 cm 간격의 점에서 구하는데, 이 문제에서는 극값이 하중 위치에 있거나 격자점에서 1 cm 이내에 있으므로 정확합니다. 문제마다 정답과 함께 또는 정답 없이 그림을 그리려면 @edubeam/plot의 [연습 문제와 시험](/ko/plot/exercises)을 참고하세요. 시험지 전체를 인쇄할 수도 있습니다.

## CSV로 저장하는 영향선 {#an-influence-line-as-csv}

1 kN의 하중이 2경간 연속보를 지나갈 때 중간 지점 위의 모멘트는 어떻게 변할까요? 하중 위치마다 보를 한 번씩 만들어 풀고, 위치마다 한 행씩 씁니다.

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** 5 m 경간 두 개, A에서 `at` m 위치에 1 kN: 중간 지점 위의 모멘트 */
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

경간이 같은 2경간 연속보의 닫힌 해는 $M_B = -P\,a\,(L^2 - a^2)/4L^2$입니다. $a = 2.5$ m에서 $-0.46875$ kNm이고, 가장 불리한 위치는 $a = L/\sqrt{3} = 2.887$ m입니다. 영향선은 대칭이므로, 21개 행은 시작할 때와 같이 지점 C 위의 0에서 끝납니다.

위치마다 새 솔버를 만드는 편이 솔버 하나를 고쳐 쓰는 것보다 간단하며, 몇 밀리초밖에 걸리지 않습니다. 풀린 모델을 바꿔서 쓰려면 [변경 후 다시 풀기](/ko/solver/solving#solving-again-after-a-change)를 참고하세요.

## HTTP 엔드포인트로 제공하는 솔버 {#a-solver-behind-an-http-endpoint}

Node 내장 `http` 모듈만 쓰는 작은 서버입니다. 보내 온 경간과 하중에 대해 단순보를 풉니다.

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** IPE 200 단순보, `span` m, `q` kN/m: 경간 중앙의 M과 처짐 */
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
    // 잘못된 JSON, 잘못된 숫자, 풀 수 없는 모델: 서버는 계속 동작
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm, $5qL^4/384EI = 49.63$ mm입니다. `try`가 중요합니다. 잘못된 JSON은 예외를 던지고, 솔버가 풀 수 없는 모델도 예외를 던질 수 있는데, 어느 쪽도 서버를 멈추게 해서는 안 됩니다. 공개 서비스라면 요청 크기와 경간도 제한해야 합니다.

## 브라우저에서 {#in-the-browser}

같은 코드가 웹 페이지에서도 그대로 동작하며, 독자의 기기에서 계산합니다. 이 사이트의 라이브 그림이 모두 이렇게 동작합니다. Vite나 Nuxt 같은 번들러로 패키지를 가져오고, @edubeam/plot으로 [결과를 그리세요](/ko/solver/drawing). 모델 하나는 몇 밀리초 만에 풀리므로, 입력 이벤트가 생길 때마다 다시 풀어도 됩니다.
