---
title: Skrypty i serwery
description: "@edubeam/fem w Node: zestaw zadań z kluczem odpowiedzi, linia wpływu zapisana do CSV i mały endpoint HTTP, który na żądanie oblicza belki."
order: 15
source: site
---

# Skrypty i serwery {#scripts-and-servers}

Solver nie potrzebuje przeglądarki. W Node przygotuje klucze odpowiedzi, przeprowadzi analizy parametryczne, wygeneruje tabele do arkusza kalkulacyjnego albo będzie odpowiadał na żądania ze strony internetowej.

Przykłady są napisane w TypeScripcie. Node 22.18 lub nowszy uruchamia pliki `.ts` bezpośrednio (`node answers.ts`) w folderze przygotowanym jak w części [Instalacja](/pl/solver/getting-started#install); w starszym Node usuń adnotacje typów i zapisz pliki jako `.mjs`.

## Zestaw zadań z kluczem odpowiedzi {#answer-key}

Dwadzieścia wariantów jednego zadania – belki swobodnie podpartej z obciążeniem liniowym i siłą skupioną – każdy z reakcjami i największym momentem, zapisanych do pliku CSV. Liczby wynikają z numeru zadania, więc ten sam skrypt zawsze zapisuje ten sam zestaw:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Zadanie i: belka swobodnie podparta, q kN/m i F kN w odległości a m od A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // od 4 do 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 lub 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 lub 20 kN
  const a = L / 4 + (i % 3) // gdzieś w przęśle
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

  // Reakcje to siły tnące na końcach: V(0) w A, -V(L) w B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // Największy moment, z punktów co 1 cm
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

Sprawdź pierwszy wiersz ręcznie: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, a siła tnąca zmienia znak pod siłą skupioną, więc tam jest największy moment: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Dwie decyzje skracają skrypt. W belce swobodnie podpartej reakcje są równe siłom tnącym na końcach, więc [funkcja pomocnicza do reakcji](/pl/solver/results#reactions) nie jest potrzebna. A największy moment pochodzi z punktów co 1 cm, co jest tu dokładne, bo ekstremum wypada pod siłą albo najwyżej centymetr od punktu siatki. Aby narysować każde zadanie, z odpowiedziami lub bez, zob. stronę [Zadania i kolokwia](/pl/plot/exercises) biblioteki @edubeam/plot, która drukuje też całe kolokwium.

## Linia wpływu jako CSV {#an-influence-line-as-csv}

Jak zmienia się moment nad podporą środkową belki dwuprzęsłowej, gdy przesuwa się po niej siła 1 kN? Zbuduj i rozwiąż belkę osobno dla każdego położenia siły i dla każdego zapisz jeden wiersz:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Dwa przęsła po 5 m, 1 kN w odległości `at` m od A: moment nad podporą środkową */
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

Rozwiązanie analityczne dla dwóch równych przęseł to $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $-0{,}46875$ kNm dla $a = 2{,}5$ m, a najniekorzystniejsze położenie to $a = L/\sqrt{3} = 2{,}887$ m. Linia jest symetryczna, więc 21 wierszy kończy się tak, jak się zaczęło – zerem nad podporą C.

Nowy solver dla każdego położenia to prostsze rozwiązanie niż zmienianie jednego modelu w miejscu, a kosztuje kilka milisekund. Jeśli chcesz zamiast tego zmieniać już rozwiązany model, zob. [Ponowne obliczenia po zmianie](/pl/solver/solving#solving-again-after-a-change).

## Solver za endpointem HTTP {#a-solver-behind-an-http-endpoint}

Mały serwer, korzystający wyłącznie z wbudowanego modułu `http` Node, który rozwiązuje belkę swobodnie podpartą dla dowolnej przesłanej mu rozpiętości i obciążenia:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Belka swobodnie podparta z IPE 200, `span` m, `q` kN/m: M i ugięcie w środku rozpiętości */
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
    // Błędny JSON, złe liczby albo model, którego nie da się rozwiązać: serwer działa dalej
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm i $5qL^4/384EI = 49{,}63$ mm. Blok `try` jest tu ważny: niepoprawny JSON zgłasza wyjątek, podobnie jak może go zgłosić model, którego solver nie umie rozwiązać, a żadna z tych sytuacji nie powinna zatrzymać serwera. Publiczna usługa powinna też ograniczać rozmiar żądania i rozpiętość.

## W przeglądarce {#in-the-browser}

Ten sam kod działa bez zmian na stronie internetowej i liczy na urządzeniu czytelnika: tak działa każdy interaktywny rysunek w tej witrynie. Zaimportuj pakiet przez bundler, np. Vite albo Nuxt, i [narysuj wyniki](/pl/solver/drawing) za pomocą @edubeam/plot. Model rozwiązuje się w milisekundach, więc strona może go liczyć od nowa przy każdym zdarzeniu `input`.
