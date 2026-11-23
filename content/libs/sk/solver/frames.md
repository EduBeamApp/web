---
title: Rámy
description: "Kompletný program v @edubeam/fem pre trojkĺbový rám so stĺpmi, tuhými rohmi a vrcholovým kĺbom, s výsledkami overenými ručným výpočtom."
order: 13
source: site
---

# Rámy {#frames}

Rám tvoria nosníky a stĺpy, ktoré sú v rohoch spojené tuho. Tento postup zostaví v kóde rám z návodu [Trojkĺbový rám](/sk/tutorials/three-hinged-frame): dva stĺpy výšky 4 m s pevnými kĺbmi v A a E, nosník dĺžky 8 m s kĺbom v C a zaťaženie 10 kN/m na nosníku. Návod čísluje uzly 1 až 5, tu sú označené A až E.

::model-figure{caption="Rám z programu nižšie: pevné kĺby v A a E, kĺb v C, 10 kN/m"}
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

// z smeruje nadol: hlavy stĺpov vysokých 4 m sú v z = -4
const pin = [DofID.Dx, DofID.Dz]
domain.createNode('A', [0, 0, 0], pin)
domain.createNode('B', [0, 0, -4])
domain.createNode('C', [4, 0, -4]) // vrcholový kĺb
domain.createNode('D', [8, 0, -4])
domain.createNode('E', [8, 0, 0], pin)

const column = domain.createBeam2D(1, ['A', 'B'], 1, 1) // zdola nahor
const left = domain.createBeam2D(2, ['B', 'C'], 1, 1, [false, true]) // kĺb v C
domain.createBeam2D(3, ['C', 'D'], 1, 1)
domain.createBeam2D(4, ['D', 'E'], 1, 1)

const lc = solver.loadCases[0]
for (const half of [2, 3]) {
  lc.createBeamElementUniformEdgeLoad(half, [0, 10e3], false)
}
solver.solve()

// getReactions vracia maticu mathjs alebo pole: prevedieme ju na pole
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

```text [Výstup]
A: Rx = 20.00 kN, Rz = -40.00 kN
E: Rx = -20.00 kN, Rz = -40.00 kN
M at 0 m from B = -80.00 kNm
M at 2 m from B = -20.00 kNm
M at 4 m from B = 0.00 kNm
M at the top of column 1 = -80.00 kNm
```

## Kontrola ručným výpočtom {#check-it-by-hand}

| Veličina | Ručne | Riešič |
| --- | --- | --- |
| Zvislé reakcie | $q \cdot 8/2 = 40$ kN nahor | $R_z = -40$ kN v A aj E |
| Vodorovné reakcie | z $M_C = 0$ na ľavej polovici: $(40 \cdot 4 - 10 \cdot 4 \cdot 2)/4 = 20$ kN, dovnútra | $R_x = +20$ kN v A, $-20$ kN v E |
| Moment v rohu | $-20 \cdot 4 = -80$ kNm | $-80$ kNm v nosníku aj v stĺpe |
| Moment 2 m od B | $-80 + 40 \cdot 2 - 10 \cdot 2^2/2 = -20$ kNm | $-20$ kNm |
| Moment v kĺbe | 0 | 0 |

## Čoho si všimnúť {#things-to-notice}

- **Stĺpy smerujú nahor, takže z je záporné.** Hlavy stĺpov sú v $z = -4$.
- **Lokálne osi stĺpa.** Prvok 1 vedie z A nahor do B, takže jeho lokálna os z smeruje doprava, dovnútra rámu. Jeho moment v hlave je −80 kNm, rovnako ako moment nosníka v rohu: ťah je na vonkajšej strane. Keď stĺp zadáte zhora nadol, z B do A, jeho lokálna os z smeruje doľava: moment zmení znamienko a `x` sa meria od hlavy. Pozrite [Orientácia prvku](/sk/solver/conventions#member-direction).
- **Jeden kĺb, jeden koniec prvku.** Kĺb je na konci prvku 2 v uzle C; prvok 3 je k uzlu C pripojený tuho. Na to, aby bol uzol C kĺbom, stačí uvoľniť jeden koniec.
- **Globálne zaťaženie na nosníku.** `false` zadáva zaťaženie v globálnych osiach: zvislo, nech je prvok sklonený akokoľvek. Pri vodorovnom nosníku zadanom zľava doprava je to to isté ako v lokálnych osiach.

## Staticky neurčité rámy {#statically-indeterminate-frames}

Odstráňte kĺb, `[false, false]`, a z rámu sa stane dvojkĺbový rám s jednou nadbytočnou reakciou. Jeho vnútorné sily potom závisia od toho, aký tuhý je nosník v porovnaní so stĺpmi: presvedčíte sa o tom, keď prvkom zadáte rôzne prierezy. [Experimenty v návode](/sk/tutorials/three-hinged-frame#_7-experiment) votknú päty stĺpov a zaťažia rám vodorovnou silou, aj s číslami na kontrolu. Stránka [Prezentácie a skriptá](/sk/plot/slides) dokumentácie @edubeam/plot takýto rám vykresľuje krok za krokom.
