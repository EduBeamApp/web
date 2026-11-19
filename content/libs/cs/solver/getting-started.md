---
title: Začínáme
description: "Nainstalujte @edubeam/fem, řešič MKP, na kterém stojí EduBeam, a na tuctu řádků TypeScriptu vyřešte prostý nosník, ověřte ho a přečtěte výsledky."
order: 1
group: Úvod
---

# Začínáme {#getting-started}

@edubeam/fem je řešič metody konečných prvků, na kterém stojí [EduBeam]{.edubeam}: každý průběh, reakce i průhyb, které aplikace ukáže, pochází z něj. Můžete s ním z vlastního kódu řešit rovinné nosníky, rámy a příhradové konstrukce, v prohlížeči i v Node: generovat příklady i s výsledky, kontrolovat domácí úkoly, počítat parametrické studie nebo ho použít jako výpočetní jádro webové stránky.

::div{.actions}
[Vyřešte první nosník](#a-simply-supported-beam) [Prohlédněte si postupy](/cs/solver/beams)
::

Je napsaný v TypeScriptu, obsahuje vlastní typy a jde o svobodný software pod licencí GPL-3.0. Vytvořil ho Bořek Patzák a vyvíjí ho spolu s Janem Voříškem a dalšími přispěvateli.

## Instalace {#install}

```bash
npm install @edubeam/fem
```

Funguje s `import` i `require`, v prohlížeči i v Node 18 a novějším, a má jedinou závislost, [mathjs](https://mathjs.org). Až do verze 0.3.0 se instaloval z GitHubu jako `ts-fem`: pokud jste ho tak používali, změňte importy na `@edubeam/fem`. Nic jiného se nezměnilo.

Chcete-li si příklad níže vyzkoušet v prázdné složce, udělejte z ní projekt, který používá `import`, a pak balíček nainstalujte:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

Bez `"type": "module"` v `package.json` příklad poběží také, jen Node nejdřív vypíše varování.

## První nosník {#a-simply-supported-beam}

Ocelový nosník IPE 200 o rozpětí 6 m, uložený na kloubu a posuvném kloubu a zatížený 12 kN/m:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// Všude jednotky SI: m, N, Pa. Ocel a IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Uzly v bodech [x, y, z] v metrech a stupně volnosti, které drží jejich podpora
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // kloub
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // posuvný kloub
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m ve směru lokální osy z prvku: u nosníku zadaného zleva doprava míří dolů
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m uprostřed rozpětí
console.log(beam.computeShearForceAt(lc, 0)) // N v A
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m uprostřed rozpětí
```

Uložte ho jako `beam.ts` a spusťte `node beam.ts`: Node 22.18 a novější spouští TypeScript přímo. Soubor nemá žádné typové anotace, takže ve starším Node ho stačí uložit jako `beam.mjs`. Program vypíše:

```text [Výstup]
54000
36000
0.04990940552616746
```

To jsou učebnicové hodnoty, $M = qL^2/8 = 54$ kNm a $V = qL/2 = 36$ kN. Tady je tentýž nosník, vyřešený přímo ve vašem prohlížeči stejným řešičem:

::model-figure{caption="Nosník z příkladu: 6 m, IPE 200, 12 kN/m"}
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

Průhyb 49,91 mm je o 0,28 mm větší než $5qL^4/384EI = 49{,}63$ mm podle Bernoulliho–Navierovy teorie. Nejde o chybu: prvek je Timošenkův nosník a 0,28 mm je $qL^2/8kGA$, tedy smyková deformace tohoto nosníku. Nastavte `k` na obrovskou hodnotu, například `1e32`, a rozdíl zmizí: viz [Smyková deformace](/cs/solver/materials-sections#shear-deformation).

## Co kód dělá {#what-the-code-does}

::div{.steps}
### Vytvořte řešič {#make-a-solver}

`new LinearStaticSolver()` má prázdnou doménu `domain`, ve které je uložený model, a jeden zatěžovací stav, `solver.loadCases[0]`.

### Popište model {#describe-the-model}

Materiály a průřezy, uzly s podporami a pak prvky mezi uzly. Všechno má označení (řetězec nebo číslo), kterým se na to odkazuje zbytek modelu. Viz [Uzly a podpory](/cs/solver/nodes-supports), [Materiály a průřezy](/cs/solver/materials-sections) a [Prvky a klouby](/cs/solver/members-hinges).

### Zatižte ho {#load-it}

Zatížení patří do zatěžovacího stavu: síly v uzlech, zatížení po délce prvků, změna teploty a poklesy podpor. Viz [Uzlová a prvková zatížení](/cs/solver/loads).

### Vyřešte ho {#solve}

`solver.solve()` sestaví a vyřeší všechny zatěžovací stavy. Viz [Výpočet](/cs/solver/solving).

### Přečtěte výsledky {#read-the-results}

Vnitřní síly v libovolném místě prvku, průhyby, koncové síly, posuny uzlů a reakce. Viz [Čtení výsledků](/cs/solver/results) a pro průběhy [Vykreslení výsledků](/cs/solver/drawing).
::

## Jednotky a znaménka ve zkratce {#axes-and-signs}

Zadáváte v jednotkách SI a v SI dostanete i výsledky. Model leží v rovině x–z a **osa z míří dolů**, takže kladné `fz` tlačí dolů a hlava sloupu vysokého 4 m je v $z = -4$. Polohy na prvku se zadávají v metrech od jeho prvního uzlu. Kladný je moment, který táhne dolní vlákna (nosník se prohýbá dolů). Úplný přehled najdete na stránce [Jednotky a znaménka](/cs/solver/conventions).

## Šest věcí, na kterých se často chybuje {#pitfalls}

1. **Osa z míří dolů.** Tíhová zatížení jsou kladná a vše nad podporami má zápornou souřadnici z. Viz [Osy](/cs/solver/conventions#axes).
2. **Orientace prvku určuje znaménko M a w.** Když nosníky zadáte zleva doprava a sloupy zdola nahoru, budou znaménka odpovídat učebnici. Viz [Orientace prvku](/cs/solver/conventions#member-direction).
3. **Chybějící parametr nevyvolá chybu, ale dá `NaN` nebo nesmysl.** Průřez potřebuje `a`, `iy` a `k`; materiál potřebuje `e` a také `g`, pokud `k` není obrovské. Viz [Materiály a průřezy](/cs/solver/materials-sections).
4. **Po přidání uzlů nebo prvků či po změně podpor** nastavte před dalším výpočtem `solver.codeNumberGenerated = false`. Viz [Nový výpočet po změně](/cs/solver/solving#solving-again-after-a-change).
5. **Reakce se vracejí jako matice mathjs nebo jako pole**, v pořadí, v jakém byly zadány stupně volnosti podpory. Viz [Reakce](/cs/solver/results#reactions).
6. **Mechanismus nemusí vždy vyhodit výjimku.** Posun řádu $10^{12}$ m znamená, že se konstrukce může volně pohybovat. Viz [Když výpočet selže](/cs/solver/solving#when-solving-fails).

## Kam dál {#next}

::card-grid{cols="2"}
:::card{title="Postupy" icon="lucide:book-open" to="/cs/solver/beams"}
Kompletní ověřené programy: nosníky, rámy, příhradové konstrukce, sada příkladů s klíčem řešení a malý HTTP server.
:::
:::card{title="Vykreslete výsledky" icon="lucide:chart-spline" to="/cs/solver/drawing"}
Předejte vyřešený model knihovně @edubeam/plot a získejte jeho průběhy jako SVG, ve Vue nebo ze skriptu v Node.
:::
:::card{title="Reference API" icon="lucide:list-tree" to="/cs/solver/reference"}
Všechny třídy, metody a argumenty, s jednotkami a s tím, co vracejí.
:::
:::card{title="Teorie" icon="lucide:sigma" to="/cs/elements/beam"}
Nosníkový prvek, jeho matice tuhosti a transformace v teoretickém manuálu EduBeamu.
:::
::
