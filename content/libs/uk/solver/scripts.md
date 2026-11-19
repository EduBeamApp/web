---
title: Скрипти та сервери
description: "Використовуйте @edubeam/fem у Node: аркуш завдань із відповідями, лінія впливу, записана в CSV, і невеликий HTTP-сервер, що розраховує балки на запит."
order: 15
source: site
---

# Скрипти та сервери {#scripts-and-servers}

Розв’язувачу не потрібен браузер. У Node він готує відповіді до завдань, виконує параметричні дослідження, готує дані для електронних таблиць або відповідає на запити з вебсторінки.

Приклади написано на TypeScript. Node 22.18 і новіші версії запускають файли `.ts` безпосередньо (`node answers.ts`) у теці, підготовленій, як описано в розділі [Встановлення](/uk/solver/getting-started#install); у старішому Node приберіть анотації типів і збережіть файли як `.mjs`.

## Аркуш завдань із відповідями {#answer-key}

Двадцять варіантів однієї вправи — шарнірно оперта балка під розподіленим навантаженням і зосередженою силою, — кожен зі своїми реакціями та найбільшим моментом, записані у файл CSV. Числа визначаються номером вправи, тож той самий скрипт завжди записує той самий аркуш:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Вправа i: шарнірно оперта балка під q kN/m і F kN на відстані a m від A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // від 4 до 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 або 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 або 20 kN
  const a = L / 4 + (i % 3) // десь у прольоті
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

  // Реакції дорівнюють поперечним силам на кінцях: V(0) в A, -V(L) в B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // Найбільший момент із точок через 1 cm
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

Перевірте перший рядок вручну: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, а поперечна сила змінює знак під зосередженою силою, тож найбільший момент саме там: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Скрипт короткий завдяки двом спрощенням. На шарнірно опертій балці реакції дорівнюють поперечним силам на кінцях, тож [допоміжна функція для реакцій](/uk/solver/results#reactions) не потрібна. А найбільший момент береться з точок через 1 cm, і тут цього досить для точного значення, бо екстремум припадає на місце сили або лежить у межах сантиметра від точки сітки. Як побудувати рисунок кожної вправи, з відповідями або без них, описано на сторінці [Вправи та контрольні роботи](/uk/plot/exercises) бібліотеки @edubeam/plot; там же показано, як надрукувати цілу контрольну роботу.

## Лінія впливу в CSV {#an-influence-line-as-csv}

Як змінюється момент над середньою опорою двопрольотної балки, коли по ній рухається сила 1 kN? Побудуйте й розрахуйте балку один раз для кожного положення сили і запишіть для кожного рядок:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Два прольоти по 5 m, 1 kN на відстані `at` m від A: момент над середньою опорою */
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

Аналітичний розв’язок для двох однакових прольотів: $M_B = -P\,a\,(L^2 - a^2)/4L^2$, тобто $-0{,}46875$ kNm при $a = 2{,}5$ m, а найневигідніше положення $a = L/\sqrt{3} = 2{,}887$ m. Лінія симетрична, тож 21 рядок закінчується там, де почався, — нулем над опорою C.

Створювати новий розв’язувач для кожного положення простіше, ніж змінювати той самий, і це коштує лише кілька мілісекунд. Як натомість змінити вже розраховану модель, див. [Повторний розрахунок після зміни](/uk/solver/solving#solving-again-after-a-change).

## Розв’язувач як HTTP-сервіс {#a-solver-behind-an-http-endpoint}

Невеликий сервер лише на вбудованому модулі Node `http`, який розраховує шарнірно оперту балку для будь-якого прольоту й навантаження, що йому надішлють:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Шарнірно оперта балка IPE 200, проліт `span` m, `q` kN/m: M і прогин посередині прольоту */
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
    // Хибний JSON, хибні числа або модель, яку не можна розрахувати: сервер працює далі
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm і $5qL^4/384EI = 49{,}63$ mm. Блок `try` важливий: некоректний JSON спричиняє виняток, а може спричинити його й модель, яку розв’язувач не здатен розрахувати; ні те, ні інше не повинно зупиняти сервер. Публічний сервіс мав би ще обмежити розмір запиту та проліт.

## У браузері {#in-the-browser}

Той самий код без змін працює на сторінці й розраховує модель на пристрої читача: саме так працює кожен живий рисунок на цьому сайті. Імпортуйте пакет через бандлер, наприклад Vite або Nuxt, і [побудуйте епюри](/uk/solver/drawing) за допомогою @edubeam/plot. Модель розраховується за мілісекунди, тож сторінка може перераховувати її після кожної події введення.
