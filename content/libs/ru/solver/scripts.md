---
title: Скрипты и серверы
description: "@edubeam/fem в Node: набор задач с ответами, линия влияния в CSV и небольшой HTTP-сервер, который рассчитывает балки по запросу."
order: 15
source: site
---

# Скрипты и серверы {#scripts-and-servers}

Решателю не нужен браузер. В Node он составляет ответы к задачам, проводит параметрические исследования, готовит данные для электронных таблиц или отвечает на запросы веб-страницы.

Примеры написаны на TypeScript. Node 22.18 и новее выполняет файлы `.ts` напрямую (`node answers.ts`) в папке, подготовленной, как описано в разделе [Установка](/ru/solver/getting-started#install); для более старого Node уберите аннотации типов и сохраните файлы как `.mjs`.

## Набор задач с ответами {#answer-key}

Скрипт записывает в CSV-файл двадцать вариантов одной задачи — шарнирно опёртой балки под погонной нагрузкой и сосредоточенной силой — с реакциями и наибольшим моментом для каждого варианта. Исходные данные зависят только от номера задачи, поэтому скрипт всегда выдаёт один и тот же набор:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Задача i: шарнирно опёртая балка под нагрузкой q kN/m и силой F kN на расстоянии a m от A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // от 4 до 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 или 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 или 20 kN
  const a = L / 4 + (i % 3) // где-то в пролёте
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

  // Реакции равны поперечным силам на концах: V(0) в A, -V(L) в B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // Наибольший момент по точкам через 1 cm
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

Проверьте первый вариант вручную: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ кН, $R_A = 70 - 34 = 36$ кН, а поперечная сила меняет знак под сосредоточенной силой, поэтому наибольший момент именно там: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ кН·м.

Скрипт остаётся коротким благодаря двум решениям. У шарнирно опёртой балки реакции равны поперечным силам на концах, поэтому [вспомогательная функция для реакций](/ru/solver/results#reactions) не нужна. А наибольший момент берётся по точкам через 1 см, и здесь это точно, поскольку экстремум приходится на точку приложения силы или лежит в пределах сантиметра от точки сетки. Чтобы нарисовать каждую задачу, с ответами или без, см. страницу [Упражнения и контрольные работы](/ru/plot/exercises) библиотеки @edubeam/plot, которая печатает и целую контрольную работу.

## Линия влияния в CSV {#an-influence-line-as-csv}

Как меняется момент над средней опорой двухпролётной балки, когда по ней движется сила 1 кН? Постройте и рассчитайте балку для каждого положения силы и запишите по строке на каждое положение:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Два пролёта по 5 m, 1 kN в `at` m от A: момент над средней опорой */
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

Аналитическое решение для двух равных пролётов — $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $-0{,}46875$ кН·м при $a = 2{,}5$ м, а самое невыгодное положение силы $a = L/\sqrt{3} = 2{,}887$ м. Линия симметрична, поэтому 21 строка заканчивается тем же, с чего началась: нулём над опорой C.

Новый решатель для каждого положения проще, чем изменение одного решателя на месте, и стоит несколько миллисекунд. Чтобы вместо этого изменить уже рассчитанную модель, см. [Повторный расчёт после изменений](/ru/solver/solving#solving-again-after-a-change).

## Решатель как HTTP-сервис {#a-solver-behind-an-http-endpoint}

Небольшой сервер на одном лишь встроенном модуле Node `http`, который рассчитывает шарнирно опёртую балку для любого присланного пролёта и нагрузки:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Шарнирно опёртая балка IPE 200, пролёт `span` m, `q` kN/m: M и прогиб в середине пролёта */
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
    // Неверный JSON, неверные числа или нерешаемая модель: сервер продолжает работать
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ кН·м и $5qL^4/384EI = 49{,}63$ мм. Блок `try` здесь важен: некорректный JSON вызывает исключение, как может вызвать его и модель, которую решатель не в силах рассчитать, и ни то, ни другое не должно ронять сервер. Публичный сервис должен также ограничивать размер запроса и пролёт.

## В браузере {#in-the-browser}

Тот же код без изменений работает на странице и выполняет расчёт на устройстве читателя: так работает каждый интерактивный рисунок на этом сайте. Импортируйте пакет через свой bundler, например Vite или Nuxt, и [рисуйте результаты](/ru/solver/drawing) с помощью @edubeam/plot. Модель рассчитывается за миллисекунды, поэтому страница может пересчитывать её при каждом событии ввода.
