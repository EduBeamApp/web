---
title: Výpočet
description: "Co dělá solve() v @edubeam/fem, kdy po změně modelu znovu očíslovat rovnice, jak poznat mechanismus a jak velký model řešič zvládne."
order: 9
group: Výpočet a výsledky
---

# Výpočet {#solving}

```ts
solver.solve()
```

`solve()` očísluje rovnice, sestaví globální matici tuhosti a vektory zatížení všech zatěžovacích stavů a vyřeší posuny a reakce. Teprve potom lze číst [výsledky](/cs/solver/results); před výpočtem skončí čtení výsledku chybou `TypeError`. Jednotlivé kroky odpovídají stránce [Jak EduBeam řeší model](/cs/elements/analysis) v teoretickém manuálu.

Pro lineární model je řešení přesné: deformovaný tvar i vnitřní síly podél každého prvku vycházejí z uzavřeného řešení Timošenkova nosníku. Není tedy co zjemňovat a prvky není nutné dělit, aby byly průběhy přesné.

Od verze 0.3.1 `solve()` nic nevypisuje do konzole; verze 0.3.0 při každém volání vypsala řádek jako `Solution took 9 [ms]`.

## Nový výpočet po změně {#solving-again-after-a-change}

Když v modelu změníte jen čísla, stačí znovu zavolat `solve()`. Když se změní samotná soustava rovnic, tedy počet nebo číslování stupňů volnosti, je potřeba ještě jeden řádek:

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // změnily se stupně volnosti: očíslovat znovu
solver.solve()
```

| Změna | Potom |
| --- | --- |
| Hodnoty zatížení, přidaná nebo odebraná zatížení | `solve()` |
| Souřadnice uzlů, materiály, průřezy, klouby | `solve()` |
| Přidání uzlů nebo prvků | `codeNumberGenerated = false`, pak `solve()` |
| Odebrání uzlů nebo prvků: `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false`, pak `solve()` |
| Změna podepření uzlu, `node.bcs` | `codeNumberGenerated = false`, pak `solve()` |

Když na to po přidání uzlu zapomenete, `solve()` vyhodí `TypeError`. Když na to zapomenete po změně podpory, řešič **bez varování** spočítá model se starými podporami. Když si nejste jistí, nastavte ho raději na `false`: nové očíslování nestojí téměř nic. Při odebrání prvku odeberte i jeho zatížení z `lc.elementLoadList`, jinak `solve()` vyhodí `RangeError` kvůli chybějícímu prvku.

Pro mnoho variant jednoho modelu, třeba v parametrické studii, je jednodušší a stejně rychlé vytvořit pro každou variantu nový řešič: viz [postup pro příčinkovou čáru](/cs/solver/scripts#an-influence-line-as-csv).

## Když výpočet selže {#when-solving-fails}

Konstrukce, která se může pohybovat, aniž by se deformovala, tedy mechanismus, má singulární matici tuhosti. Někdy to `solve()` pozná a vyhodí chybu:

```text
Error: Linear system cannot be solved since matrix is singular
```

Často ale ne: zaokrouhlovací chyby způsobí, že matice vypadá řešitelně, a vy dostanete posuny řádu $10^{12}$ m nebo rozumně vypadající čísla pro konstrukci, která může volně ujet. Například nosník na dvou posuvných kloubech se spočítá bez jediné námitky, dokud ho nic netlačí do strany. Podpory proto kontrolujte sami a obrovské posuny berte jako znamení mechanismu.

Obvyklé příčiny:

- příliš málo podpor, například nosník na dvou posuvných kloubech;
- podpory, které konstrukci neudrží: všechny rovnoběžné nebo všechny mířící do jednoho bodu;
- o jeden kloub víc, než konstrukce snese, například tři klouby v řadě;
- moment zadaný do styčníku, ve kterém jsou všechny konce prvků připojené kloubově.

Chybové hlášení neříká, kde problém je. Aplikace EduBeam mechanismy hledá ještě před výpočtem a pohyb najde i animuje; sestavit tentýž model v ní bývá nejrychlejší způsob, jak ho uvidět. Obvyklé příčiny shrnuje stránka [Řešení potíží](/cs/reference/troubleshooting).

Chybějící uzel, materiál nebo průřez vyvolá `RangeError` s jeho názvem. Chybějící parametry průřezu chybu nevyhodí vůbec: všechny výsledky jsou `NaN`. Viz [Materiály a průřezy](/cs/solver/materials-sections#cross-section).

## Velikost modelu {#model-size}

Řešič pracuje s plnými maticemi a je stavěný na modely velikosti školních příkladů. Na notebooku v Node se přímá řada prvků vyřeší přibližně za:

| Prvky | Stupně volnosti | Čas |
| --- | --- | --- |
| 50 | 150 | 0,1 s |
| 100 | 300 | 0,2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

Každé zdvojnásobení modelu prodlouží výpočet šestkrát až devětkrát.

Každý příklad, rám i příhradovou konstrukci z kurzu stavební mechaniky řešič zvládne snadno. Na modely s tisíci prvky ale určený není.

## Žádné další výpočty {#no-other-analyses}

Tato verze řeší jen lineární statiku. Ve zdrojovém kódu je i řešič vlastních čísel pro vlastní frekvence, ale do publikovaného balíčku nepatří: `EigenValueDynamicSolver` z `@edubeam/fem` importovat nelze.
