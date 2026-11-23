---
title: Anyagok és keresztmetszetek
description: "Az @edubeam/fem anyag- és keresztmetszeti paraméterei: melyiket igényli az adott számítás, mi történik, ha valamelyik hiányzik, és hogyan kapcsolható ki a nyírási alakváltozás."
order: 4
source: site
---

# Anyagok és keresztmetszetek {#materials-and-sections}

A rudak a merevségüket egy anyagtól és egy keresztmetszettől kapják. Mindkettőt egyszer hozod létre, és a jelölésükkel hivatkozol rájuk.

```ts
domain.createMaterial('steel', { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection('IPE200', {
  a: 28.5e-4, // m²
  iy: 1943e-8, // m⁴
  h: 0.2, // m
  k: 5 / 6,
})
```

## Anyag {#material}

| Paraméter | Jelentés | Mértékegység | Mikor kell |
| --- | --- | --- | --- |
| `e` | Rugalmassági modulus, $E$ | Pa | mindig |
| `g` | Nyírási rugalmassági modulus, $G$ | Pa | mindig, hacsak `k` nem óriási (nyírási alakváltozás nélkül) |
| `alpha` | Hőtágulási együttható, $\alpha$ | 1/K | hőmérsékleti terhekhez |
| `d` | Sűrűség, $\rho$ | kg/m³ | statikai számításhoz nem kell |

A kihagyott paraméter értéke **1**, nem valamilyen szokásos érték, és erre semmi sem figyelmeztet. Ha az Első lépések tartójánál elfelejted a `g`-t, a lehajlása 22 700 km lesz.

## Keresztmetszet {#cross-section}

| Paraméter | Jelentés | Mértékegység | Mikor kell |
| --- | --- | --- | --- |
| `a` | Keresztmetszeti terület, $A$ | m² | mindig: tengelyirányú és nyírási merevség |
| `iy` | Inercianyomaték, $I_y$ | m⁴ | mindig: hajlítási merevség |
| `k` | Nyírási tényező, $k$ | – | mindig: nyírási merevség, $kGA$ |
| `h` | Magasság, $h$ | m | hőmérséklet-különbséghez |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, csavarási inercianyomaték | m⁴ | síkbeli modellhez nem kell |

A keresztmetszetnek nincsenek alapértelmezett értékei. Ha kihagyod az `a`, `iy` vagy `k` paramétert, minden eredmény `NaN` lesz; ha a `h`-t hagyod ki, a hőmérséklet-különbség ad `NaN`-t. Egyik esetben sem keletkezik hiba, ezért a `NaN` eredmény szinte mindig hiányzó paramétert jelent.

## Nyírási alakváltozás {#shear-deformation}

A rúd Timoshenko-gerenda: nemcsak hajlításból, hanem nyírásból is alakváltozást szenved. Hogy mennyit, azt a

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2}
$$

érték határozza meg, amelyet a `beam.computeShearFactor()` ad vissza. Karcsú rudaknál $\Phi$ elenyésző, a lehajlások egy százaléknál is kevesebbel nőnek. Rövid, magas rudaknál viszont számít.

A tankönyvi táblázatok Euler–Bernoulli-gerendájához tedd a nyírási merevséget gyakorlatilag végtelenné egy óriási nyírási tényezővel, ahogy az EduBeam alkalmazás példái is teszik:

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

Az itteni példaprogramok így járnak el, ezért az eredményeik pontosan egyeznek a képletekkel. Valódi nyírási tényezőként téglalaphoz $k = 5/6$ megfelelő. Az [Eredmények ellenőrzése kézi számítással](/hu/guide/verification#shear-deformation) oldal megmutatja, mekkora a hatás.

## Tengelyirányban merev rudak {#rigid-in-axial-direction}

Nagy keresztmetszeti terület mellett a rudak gyakorlatilag nyúlásmentesek, ahogy a kézi számítás általában feltételezi. Egy keret igénybevételei csak kevéssé függenek a területtől; egy rácsos tartó elmozdulásai viszont teljes egészében tőle függenek. Statikailag határozott szerkezet igénybevételei egyáltalán nem függenek a merevségtől.

## Későbbi módosítás {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Minden rúd akkor olvassa ki az anyagát és a keresztmetszetét, amikor a számítómag összeállítja a merevségi mátrixot, így elég egy újabb `solve()`. A különböző rudak különböző keresztmetszetet kaphatnak: adj mindegyiknek saját jelölést.
