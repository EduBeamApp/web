---
title: 脚本与服务器
description: "在 Node 中使用 @edubeam/fem：生成附参考答案的习题单，把影响线写入 CSV，以及搭建一个按请求求解梁的小型 HTTP 接口。"
order: 15
source: site
---

# 脚本与服务器 {#scripts-and-servers}

求解器不需要浏览器。在 Node 中，它可以生成参考答案、做参数分析、为电子表格生成数据表，或者响应网页发来的请求。

示例都用 TypeScript 编写。在按[安装](/zh/solver/getting-started#install)一节准备好的文件夹中，Node 22.18 及以上版本可以直接运行 `.ts` 文件（`node answers.ts`）；在较旧的 Node 上，去掉类型注解并保存为 `.mjs` 即可。

## 附参考答案的习题单 {#answer-key}

同一道题的二十个变体：一根承受线荷载和集中荷载的简支梁，每个变体都给出支反力和最大弯矩，写入一个 CSV 文件。数据由题号决定，所以同一个脚本每次都生成同样的习题单：

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** 第 i 题：简支梁，承受 q kN/m，以及距 A a m 处的 F kN。 */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // 4 到 7 m
  const q = 5 + 5 * (i % 3) // 5、10 或 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 或 20 kN
  const a = L / 4 + (i % 3) // 跨内某处
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

  // 支反力就是杆端剪力：A 处为 V(0)，B 处为 -V(L)
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // 最大弯矩，取自间距 1 cm 的点
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

手算核对第 1 题：$R_B = (10 \cdot 5 \cdot 2.5 + 20 \cdot 2.25)/5 = 34$ kN，$R_A = 70 - 34 = 36$ kN；剪力在集中荷载处变号，所以最大弯矩就在那里：$36 \cdot 2.25 - 10 \cdot 2.25^2/2 = 55.69$ kNm。

两个取舍让脚本保持简短。在简支梁上，支反力就是杆端剪力，所以不需要[读取支反力的辅助函数](/zh/solver/results#reactions)。最大弯矩取自间距 1 cm 的点，在这里是精确的，因为极值点要么落在荷载处，要么离网格点不到一厘米。要把每道题画出来，无论带不带答案，参见 @edubeam/plot 的[习题与测验](/zh/plot/exercises)，它还能打印整份测验卷。

## 以 CSV 输出影响线 {#an-influence-line-as-csv}

1 kN 的荷载在两跨连续梁上移动时，中间支座处的弯矩如何变化？对每个荷载位置建立并求解一次梁，每个位置写一行：

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** 两跨各 5 m，距 A `at` m 处作用 1 kN：中间支座处的弯矩 */
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

等跨两跨连续梁的闭合解为 $M_B = -P\,a\,(L^2 - a^2)/4L^2$：$a = 2.5$ m 时为 $-0.46875$ kNm，最不利位置为 $a = L/\sqrt{3} = 2.887$ m。影响线是对称的，所以 21 行数据的最后一行回到起始值：支座 C 处为 0。

每个位置新建一个求解器，比原地修改同一个求解器更简单，只多花几毫秒。如果要修改已求解的模型，参见[修改后重新求解](/zh/solver/solving#solving-again-after-a-change)。

## HTTP 接口背后的求解器 {#a-solver-behind-an-http-endpoint}

一个小型服务器，只用 Node 自带的 `http` 模块，对发来的任意跨度和荷载求解一根简支梁：

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** IPE 200 简支梁，跨度 `span` m，荷载 `q` kN/m：跨中弯矩和挠度 */
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
    // JSON 无效、数值不对或模型无法求解：服务器继续运行
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm，$5qL^4/384EI = 49.63$ mm。`try` 很重要：无效的 JSON 会抛出异常，求解器无法求解的模型也可能抛出异常，两者都不应让服务器崩溃。公开的服务还应限制请求的大小和跨度。

## 在浏览器中 {#in-the-browser}

同样的代码原样就能在网页中运行，在读者的设备上求解：本网站上的每一张实时图都是这样工作的。通过你的打包工具（例如 Vite 或 Nuxt）导入这个包，再用 @edubeam/plot [绘制结果](/zh/solver/drawing)。一个模型几毫秒就能解完，所以网页可以在每次输入时重新求解。
