---
title: Scripts y servidores
description: "Usa @edubeam/fem desde Node: una hoja de ejercicios con sus soluciones, una línea de influencia en CSV y un pequeño endpoint HTTP que resuelve vigas a petición."
order: 15
source: site
---

# Scripts y servidores {#scripts-and-servers}

El solver no necesita navegador. En Node escribe hojas de soluciones, hace estudios paramétricos, prepara tablas para una hoja de cálculo o responde a peticiones de una página web.

Los ejemplos están en TypeScript. Node 22.18 o posterior ejecuta archivos `.ts` directamente (`node answers.ts`), en una carpeta preparada como en [Instalación](/es/solver/getting-started#install); con un Node más antiguo, quita las anotaciones de tipo y guárdalos como `.mjs`.

## Una hoja de ejercicios con sus soluciones {#answer-key}

Veinte variantes de un mismo ejercicio, una viga biapoyada con una carga lineal y una carga puntual, cada una con sus reacciones y su momento máximo, escritas en un archivo CSV. Los datos dependen solo del número del ejercicio, así que el mismo script escribe siempre la misma hoja:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Ejercicio i: una viga biapoyada con q kN/m y F kN a una distancia a (m) de A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // de 4 a 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 o 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 o 20 kN
  const a = L / 4 + (i % 3) // en algún punto del vano
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

  // Las reacciones son los cortantes en los extremos: V(0) en A, -V(L) en B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // El momento máximo, a partir de puntos separados 1 cm
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

Comprueba a mano el primero: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, y el cortante cambia de signo bajo la carga puntual, así que el momento máximo está ahí: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Dos decisiones mantienen el script corto. En una viga biapoyada, las reacciones son los cortantes en los extremos, así que no hace falta la [función auxiliar para las reacciones](/es/solver/results#reactions). Y el momento máximo sale de puntos separados 1 cm, lo que aquí es exacto porque el extremo cae en una carga o a menos de un centímetro de un punto muestreado. Para dibujar cada ejercicio, con o sin sus soluciones, consulta [Ejercicios y exámenes](/es/plot/exercises), en @edubeam/plot, que además imprime un examen completo.

## Una línea de influencia en CSV {#an-influence-line-as-csv}

¿Cómo cambia el momento sobre el apoyo central de una viga de dos vanos cuando una carga de 1 kN la recorre? Construye y resuelve la viga una vez por cada posición de la carga, y escribe una fila para cada una:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Dos vanos de 5 m, 1 kN a `at` m de A: el momento sobre el apoyo central */
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

La solución analítica para dos vanos iguales es $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $-0{,}46875$ kNm en $a = 2{,}5$ m, y la posición más desfavorable es $a = L/\sqrt{3} = 2{,}887$ m. La línea es simétrica, así que las 21 filas terminan como empezaron, en 0 sobre el apoyo C.

Un solver nuevo para cada posición es más sencillo que modificar uno ya existente, y cuesta unos pocos milisegundos. Si prefieres modificar un modelo ya resuelto, consulta [Volver a resolver tras un cambio](/es/solver/solving#solving-again-after-a-change).

## Un solver detrás de un endpoint HTTP {#a-solver-behind-an-http-endpoint}

Un pequeño servidor, sin nada más que el módulo `http` del propio Node, que resuelve una viga biapoyada para cualquier luz y carga que se le envíe:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Un IPE 200 biapoyado, `span` m, `q` kN/m: M y flecha en el centro del vano */
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
    // JSON no válido, números no válidos o un modelo sin solución: el servidor sigue en marcha
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm y $5qL^4/384EI = 49{,}63$ mm. El `try` es importante: un JSON no válido lanza una excepción, y también puede hacerlo un modelo que el solver no consigue resolver, y ninguno de los dos debe tumbar el servidor. Un servicio público, además, limitaría el tamaño de la petición y la luz.

## En el navegador {#in-the-browser}

El mismo código funciona tal cual en una página, y resuelve en el dispositivo del lector: así funcionan todas las figuras interactivas de este sitio. Importa el paquete a través de tu bundler, por ejemplo Vite o Nuxt, y [dibuja los resultados](/es/solver/drawing) con @edubeam/plot. Un modelo se resuelve en milisegundos, así que una página puede volver a resolverlo con cada evento de entrada.
