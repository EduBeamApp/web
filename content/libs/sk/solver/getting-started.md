---
title: Začíname
description: "Nainštalujte @edubeam/fem, riešič MKP, na ktorom stojí EduBeam, a v pár riadkoch TypeScriptu vyriešte prostý nosník, overte ho a prečítajte výsledky."
order: 1
group: Úvod
source: site
---

# Začíname {#getting-started}

@edubeam/fem je riešič metódy konečných prvkov, na ktorom stojí [EduBeam]{.edubeam}: každý priebeh, reakcia aj priehyb, ktoré aplikácia zobrazí, pochádza z neho. Môžete s ním z vlastného kódu riešiť rovinné nosníky, rámy a priehradové konštrukcie, v prehliadači aj v Node: generovať príklady aj s výsledkami, kontrolovať domáce úlohy, robiť parametrické štúdie alebo ho použiť ako výpočtové jadro webovej stránky.

::div{.actions}
[Vyriešte prvý nosník](#a-simply-supported-beam) [Pozrite si postupy](/sk/solver/beams)
::

Je napísaný v TypeScripte, obsahuje vlastné typy a ide o slobodný softvér pod licenciou GPL-3.0. Vytvoril ho Bořek Patzák a vyvíja ho spolu s Janom Voříškom a ďalšími prispievateľmi.

## Inštalácia {#install}

```bash
npm install @edubeam/fem
```

Funguje s `import` aj `require`, v prehliadači aj v Node 18 a novšom, a má jedinú závislosť, [mathjs](https://mathjs.org). Až do verzie 0.3.0 sa inštaloval z GitHubu ako `ts-fem`: ak ste ho takto používali, zmeňte importy na `@edubeam/fem`. Nič iné sa nezmenilo.

Ak si chcete príklad nižšie vyskúšať v prázdnom priečinku, urobte z neho projekt, ktorý používa `import`, a potom balík nainštalujte:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

Bez `"type": "module"` v `package.json` príklad pobeží tiež, len Node najprv vypíše varovanie.

## Prvý nosník {#a-simply-supported-beam}

Oceľový nosník IPE 200 s rozpätím 6 m, uložený na pevnom a posuvnom kĺbe a zaťažený 12 kN/m:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// Všade jednotky SI: m, N, Pa. Oceľ a IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Uzly v bodoch [x, y, z] v metroch a stupne voľnosti, ktoré drží ich podpera
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // pevný kĺb
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // posuvný kĺb
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m v smere lokálnej osi z prvku: pri nosníku zadanom zľava doprava smeruje nadol
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m v strede rozpätia
console.log(beam.computeShearForceAt(lc, 0)) // N v A
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m v strede rozpätia
```

Uložte ho ako `beam.ts` a spustite `node beam.ts`: Node 22.18 a novší spúšťa TypeScript priamo. Súbor nemá žiadne typové anotácie, takže v staršom Node ho stačí uložiť ako `beam.mjs`. Program vypíše:

```text [Výstup]
54000
36000
0.04990940552616746
```

To sú učebnicové hodnoty, $M = qL^2/8 = 54$ kNm a $V = qL/2 = 36$ kN. Tu je ten istý nosník, vyriešený priamo vo vašom prehliadači tým istým riešičom:

::model-figure{caption="Nosník z príkladu: 6 m, IPE 200, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

Priehyb 49,91 mm je o 0,28 mm väčší ako $5qL^4/384EI = 49{,}63$ mm podľa Bernoulliho–Navierovej teórie. Nejde o chybu: prvok je Timošenkov nosník a 0,28 mm je $qL^2/8kGA$, teda príspevok šmykových deformácií tohto nosníka. Nastavte `k` na veľmi veľkú hodnotu, napríklad `1e32`, a rozdiel zmizne: pozrite [Šmykové deformácie](/sk/solver/materials-sections#shear-deformation).

## Čo kód robí {#what-the-code-does}

::div{.steps}
### Vytvorte riešič {#make-a-solver}

`new LinearStaticSolver()` má prázdnu doménu `domain`, v ktorej je uložený model, a jeden zaťažovací stav, `solver.loadCases[0]`.

### Opíšte model {#describe-the-model}

Materiály a prierezy, uzly s podperami a potom prvky medzi uzlami. Všetko má označenie (reťazec alebo číslo), ktorým sa naň odkazuje zvyšok modelu. Pozrite [Uzly a podpery](/sk/solver/nodes-supports), [Materiály a prierezy](/sk/solver/materials-sections) a [Prvky a kĺby](/sk/solver/members-hinges).

### Zaťažte ho {#load-it}

Zaťaženie patrí do zaťažovacieho stavu: sily v uzloch, zaťaženie po dĺžke prvkov, zmena teploty a poklesy podpier. Pozrite [Uzlové a prvkové zaťaženie](/sk/solver/loads).

### Vyriešte ho {#solve}

`solver.solve()` zostaví a vyrieši všetky zaťažovacie stavy. Pozrite [Výpočet](/sk/solver/solving).

### Prečítajte výsledky {#read-the-results}

Vnútorné sily v ľubovoľnom mieste prvku, priehyby, koncové sily, posunutia uzlov a reakcie. Pozrite [Čítanie výsledkov](/sk/solver/results) a pre priebehy [Vykreslenie výsledkov](/sk/solver/drawing).
::

## Jednotky a znamienka v skratke {#axes-and-signs}

Zadávate v jednotkách SI a v SI dostanete aj výsledky. Model leží v rovine x–z a **os z smeruje nadol**, takže kladné `fz` tlačí nadol a hlava stĺpa vysokého 4 m je v $z = -4$. Polohy na prvku sa zadávajú v metroch od jeho prvého uzla. Kladný je moment, ktorý ťahá dolné vlákna (nosník sa prehýba nadol). Úplný prehľad nájdete na stránke [Jednotky a znamienka](/sk/solver/conventions).

## Šesť vecí, pri ktorých sa často chybuje {#pitfalls}

1. **Os z smeruje nadol.** Tiažové zaťaženie je kladné a všetko nad podperami má zápornú súradnicu z. Pozrite [Osi](/sk/solver/conventions#axes).
2. **Orientácia prvku určuje znamienko M a w.** Keď nosníky zadáte zľava doprava a stĺpy zdola nahor, znamienka budú zodpovedať učebnici. Pozrite [Orientácia prvku](/sk/solver/conventions#member-direction).
3. **Chýbajúci parameter nevyvolá chybu, ale dá `NaN` alebo nezmysel.** Prierez potrebuje `a`, `iy` a `k`; materiál potrebuje `e` a, ak `k` nie je veľmi veľké, aj `g`. Pozrite [Materiály a prierezy](/sk/solver/materials-sections).
4. **Po pridaní uzlov alebo prvkov či po zmene podpier** nastavte pred ďalším výpočtom `solver.codeNumberGenerated = false`. Pozrite [Nový výpočet po zmene](/sk/solver/solving#solving-again-after-a-change).
5. **Reakcie sa vracajú ako matica mathjs alebo ako pole**, v poradí, v akom boli zadané stupne voľnosti podpery. Pozrite [Reakcie](/sk/solver/results#reactions).
6. **Mechanizmus nemusí vždy vyhodiť výnimku.** Posunutie rádovo $10^{12}$ m znamená, že sa konštrukcia môže voľne pohybovať. Pozrite [Keď výpočet zlyhá](/sk/solver/solving#when-solving-fails).

## Kam ďalej {#next}

::card-grid{cols="2"}
:::card{title="Postupy" icon="lucide:book-open" to="/sk/solver/beams"}
Kompletné overené programy: nosníky, rámy, priehradové konštrukcie, sada príkladov s kľúčom riešení a malý HTTP server.
:::
:::card{title="Vykreslite výsledky" icon="lucide:chart-spline" to="/sk/solver/drawing"}
Odovzdajte vyriešený model knižnici @edubeam/plot a získajte jeho priebehy ako SVG, vo Vue alebo zo skriptu v Node.
:::
:::card{title="Referencia API" icon="lucide:list-tree" to="/sk/solver/reference"}
Všetky triedy, metódy a argumenty, s jednotkami a s tým, čo vracajú.
:::
:::card{title="Teória" icon="lucide:sigma" to="/sk/elements/beam"}
Nosníkový prvok, jeho matica tuhosti a transformácia v teoretickej príručke EduBeamu.
:::
::
