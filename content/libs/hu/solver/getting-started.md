---
title: Első lépések
description: "Telepítsd az @edubeam/fem csomagot, az EduBeam mögött álló végeselemes számítómagot, és oldj meg, ellenőrizz és olvass ki egy kéttámaszú tartót nagyjából egy tucat sor TypeScripttel."
order: 1
group: Bevezetés
source: site
---

# Első lépések {#getting-started}

Az @edubeam/fem az [EduBeam]{.edubeam} mögött álló végeselemes számítómag: az alkalmazás minden ábrája, támaszereje és lehajlása tőle származik. Saját kódodból is használhatod síkbeli tartók, keretek és rácsos tartók számítására, böngészőben vagy Node-ban: feladatokat generálhatsz a megoldásukkal együtt, házi feladatokat ellenőrizhetsz, paramétervizsgálatokat futtathatsz, vagy számítómagot tehetsz egy weboldal mögé.

::div{.actions}
[Oldd meg az első tartódat](#a-simply-supported-beam) [Nézd meg a példaprogramokat](/hu/solver/beams)
::

TypeScriptben íródott, saját típusdefiníciókkal érkezik, és GPL-3.0 licencű szabad szoftver. Bořek Patzák hozta létre, és Jan Voříšekkel, valamint további közreműködőkkel együtt fejleszti.

## Telepítés {#install}

```bash
npm install @edubeam/fem
```

Működik `import`-tal és `require`-rel is, böngészőben és Node 18-as vagy újabb verzióban, egyetlen függősége pedig a [mathjs](https://mathjs.org). A 0.3.0-s verzióig GitHubról lehetett telepíteni `ts-fem` néven: ha így használtad, írd át az importokat `@edubeam/fem`-re. Más nem változott.

Ha egy üres mappából szeretnéd kipróbálni az alábbi példát, készíts belőle `import`-ot használó projektet, majd telepítsd a csomagot:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

Ha a `package.json` nem tartalmazza a `"type": "module"` beállítást, a példa akkor is lefut, de a Node előbb figyelmeztetést ír ki.

## Az első tartód {#a-simply-supported-beam}

Egy 6 m-es, IPE 200 szelvényű acéltartó csuklós és görgős támaszon, 12 kN/m egyenletesen megoszló teherrel:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// Mindenhol SI-mértékegységek: m, N, Pa. Acél és IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Csomópontok [x, y, z] helyen, méterben, a támasz által gátolt szabadságfokokkal
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // csuklós támasz
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // görgős támasz
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m a rúd lokális z tengelye mentén: balról jobbra rajzolt tartón lefelé
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m a támaszköz közepén
console.log(beam.computeShearForceAt(lc, 0)) // N az A pontban
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m a támaszköz közepén
```

Mentsd el `beam.ts` néven, és futtasd a `node beam.ts` paranccsal: a Node 22.18-as és újabb verziói közvetlenül futtatják a TypeScriptet. A fájlban nincsenek típusannotációk, így régebbi Node esetén elég `beam.mjs` néven menteni. A kimenet:

```text [Kimenet]
54000
36000
0.04990940552616746
```

Ezek a tankönyvi értékek: $M = qL^2/8 = 54$ kNm és $V = qL/2 = 36$ kN. Itt ugyanez a tartó látható, ugyanazzal a számítómaggal, a böngésződben megoldva:

::model-figure{caption="A fenti tartó: 6 m, IPE 200, 12 kN/m"}
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

A 49,91 mm-es lehajlás 0,28 mm-rel több az Euler–Bernoulli-féle $5qL^4/384EI = 49{,}63$ mm-nél. Ez nem hiba: a rúd Timoshenko-gerenda, és a 0,28 mm éppen $qL^2/8kGA$, vagyis a tartó nyírási alakváltozásából eredő rész. Ha `k`-nak óriási értéket adsz, például `1e32`-t, a különbség eltűnik: lásd [Nyírási alakváltozás](/hu/solver/materials-sections#shear-deformation).

## Mit csinál a kód? {#what-the-code-does}

::div{.steps}
### Hozz létre egy számítómagot {#make-a-solver}

A `new LinearStaticSolver()` egy üres `domain`-nel jön létre, amely a modellt tárolja, és egyetlen terhelési esettel, a `solver.loadCases[0]`-val.

### Írd le a modellt {#describe-the-model}

Anyagok és keresztmetszetek, csomópontok a támaszaikkal, majd rudak a csomópontok között. Mindennek van egy jelölése (szöveg vagy szám), amellyel a modell többi része hivatkozik rá. Lásd [Csomópontok és támaszok](/hu/solver/nodes-supports), [Anyagok és keresztmetszetek](/hu/solver/materials-sections) és [Rudak és csuklók](/hu/solver/members-hinges).

### Terheld meg {#load-it}

A terhek egy terhelési esethez tartoznak: csomóponti erők, rúdterhek, hőmérsékleti terhek és támaszsüllyedések. Lásd [Csomóponti terhek és rúdterhek](/hu/solver/loads).

### Oldd meg {#solve}

A `solver.solve()` összeállítja és megoldja az összes terhelési esetet. Lásd [Megoldás](/hu/solver/solving).

### Olvasd ki az eredményeket {#read-the-results}

Igénybevételek a rúd bármely pontján, lehajlások, rúdvégi erők, csomóponti elmozdulások és támaszerők. Lásd [Eredmények kiolvasása](/hu/solver/results), az ábrákhoz pedig [Eredmények rajzolása](/hu/solver/drawing).
::

## Mértékegységek és előjelek röviden {#axes-and-signs}

SI-mértékegységek be, SI-mértékegységek ki. A modell az x–z síkban fekszik, a **z tengely lefelé mutat**, így a pozitív `fz` lefelé nyom, egy 4 m-es oszlop teteje pedig $z = -4$-nél van. A rúd menti helyzeteket a rúd első csomópontjától mért méterben kell megadni. Az alul húzott nyomaték pozitív. A teljes összefoglaló a [Mértékegységek és előjelek](/hu/solver/conventions) oldalon található.

## Hat gyakori buktató {#pitfalls}

1. **A z tengely lefelé mutat.** A gravitációs terhek pozitívak, és ami a támaszok fölött van, annak negatív a z koordinátája. Lásd [Tengelyek](/hu/solver/conventions#axes).
2. **A rúd iránya határozza meg M és w előjelét.** A tartókat balról jobbra, az oszlopokat alulról felfelé add meg, és az előjelek a tankönyvben megszokottak lesznek. Lásd [A rúd iránya](/hu/solver/conventions#member-direction).
3. **A hiányzó paraméter `NaN`-t vagy értelmetlen eredményt ad, nem hibát.** A keresztmetszethez kell `a`, `iy` és `k`; az anyaghoz `e`, valamint `g`, hacsak `k` nem óriási. Lásd [Anyagok és keresztmetszetek](/hu/solver/materials-sections).
4. **Csomópontok vagy rudak hozzáadása, illetve a támaszok módosítása után** állítsd be a `solver.codeNumberGenerated = false` értéket, mielőtt újra megoldod a feladatot. Lásd [Újbóli megoldás módosítás után](/hu/solver/solving#solving-again-after-a-change).
5. **A támaszerőket mathjs-mátrixként vagy tömbként kapod vissza,** abban a sorrendben, ahogy a támasz szabadságfokait megadtad. Lásd [Támaszerők](/hu/solver/results#reactions).
6. **A mechanizmus nem mindig dob kivételt.** A $10^{12}$ m nagyságrendű elmozdulás azt jelenti, hogy a szerkezet szabadon elmozdulhat. Lásd [Ha a megoldás nem sikerül](/hu/solver/solving#when-solving-fails).

## Hogyan tovább {#next}

::card-grid{cols="2"}
:::card{title="Példaprogramok" icon="lucide:book-open" to="/hu/solver/beams"}
Teljes, ellenőrzött programok: tartók, keretek, rácsos tartók, feladatlap megoldókulccsal, egy kis HTTP-szerver.
:::
:::card{title="Eredmények rajzolása" icon="lucide:chart-spline" to="/hu/solver/drawing"}
Add át a megoldott modellt az @edubeam/plot csomagnak, és SVG-ként kapod meg az ábráit, Vue-ban vagy Node-szkriptből.
:::
:::card{title="API-referencia" icon="lucide:list-tree" to="/hu/solver/reference"}
Minden osztály, metódus és argumentum, mértékegységekkel és a visszatérési értékek leírásával.
:::
:::card{title="Az elmélet" icon="lucide:sigma" to="/hu/elements/beam"}
A gerendaelem, a merevségi mátrixa és a transzformációja az EduBeam elméleti kézikönyvében.
:::
::
