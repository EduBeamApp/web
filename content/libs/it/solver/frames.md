---
title: Telai
description: "Un programma @edubeam/fem completo per un telaio a tre cerniere, con colonne, nodi d’angolo rigidi e una cerniera in mezzeria, e i risultati verificati a mano."
order: 13
source: site
---

# Telai {#frames}

Un telaio è fatto di travi e colonne collegate rigidamente nei nodi d’angolo. Questo esempio costruisce in codice il telaio del [tutorial sul telaio a tre cerniere](/it/tutorials/three-hinged-frame): due colonne di 4 m incernierate al piede in A ed E, una trave di 8 m con una cerniera in C e 10 kN/m sulla trave. Il tutorial numera i nodi da 1 a 5; qui sono chiamati da A a E.

::model-figure{caption="Il telaio del programma qui sotto: cerniere al piede in A ed E, una cerniera interna in C, 10 kN/m"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

```ts [frame.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, k: 1e32 }) // IPE 300

// z punta in basso: la testa delle colonne alte 4 m è a z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // la cerniera in mezzeria
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // dal basso verso l'alto
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // cerniera in C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions restituisce una Matrix di mathjs o un array: trasformala in array
const list = (v: unknown): number[] =>
  Array.isArray(v) ? v : (v as { toArray(): number[] }).toArray()
const kN = (v: number) => (v / 1e3).toFixed(2)

for (const label of ['A', 'E']) {
  const [rx, rz] = list(domain.getNode(label).getReactions(lc).values)
  console.log(`${label}: Rx = ${kN(rx)} kN, Rz = ${kN(rz)} kN`)
}
for (const x of [0, 2, 4]) {
  const m = left.computeBendingMomentAt(lc, x)
  console.log(`M at ${x} m from B = ${kN(m)} kNm`)
}
const top = column.computeBendingMomentAt(lc, 4)
console.log(`M at the top of column 1 = ${kN(top)} kNm`)
```

```text [Output]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Verifica a mano {#check-it-by-hand}

| Grandezza | A mano | Solutore |
| --- | --- | --- |
| Reazioni verticali | $q \cdot 8/2 = 40$ kN verso l’alto | $R_z = -40$ kN in A e in E |
| Reazioni orizzontali | da $M_C = 0$ sulla metà sinistra: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, verso l’interno | $R_x = +20$ kN in A, $-20$ kN in E |
| Momento nel nodo d’angolo | $-20 \cdot 4 = -80$ kNm | $-80$ kNm nella trave e nella colonna |
| Momento a 2 m da B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Momento nella cerniera | 0 | 0 |

## Da notare {#things-to-notice}

- **Le colonne salgono, quindi z è negativa.** La testa delle colonne è a $z = -4$.
- **Gli assi locali della colonna.** L’asta 1 va da A verso l’alto fino a B, quindi la sua z locale punta a destra, verso l’interno del telaio. Il suo momento in testa è −80 kNm, come quello della trave nel nodo d’angolo: sono tese le fibre esterne. Se definisci la colonna da B verso il basso fino ad A, la sua z locale punta a sinistra: il momento cambia segno, e `x` parte dalla testa. Vedi [Verso dell’asta](/it/solver/conventions#member-direction).
- **Una cerniera, un’estremità d’asta.** La cerniera sta sull’estremità dell’asta 2 in C; l’asta 3 parte da C con un collegamento rigido. Basta un’estremità svincolata per fare di C una cerniera.
- **Carichi globali sulla trave.** `false` dà il carico negli assi globali: verticale, qualunque sia l’inclinazione dell’asta. Su una trave orizzontale disegnata da sinistra a destra equivale al carico in assi locali.

## Telai iperstatici {#statically-indeterminate-frames}

Togli la cerniera, `[false, false]`, e il telaio diventa un portale una volta iperstatico. Le sue forze interne dipendono allora dalla rigidezza della trave rispetto a quella delle colonne: assegna alle aste sezioni diverse per vederlo. Gli [esperimenti del tutorial](/it/tutorials/three-hinged-frame#_7-experiment) incastrano le basi e spingono il telaio lateralmente, con i valori da confrontare. La pagina [Slide e dispense](/it/plot/slides) di @edubeam/plot disegna un portale di questo tipo passo dopo passo.
