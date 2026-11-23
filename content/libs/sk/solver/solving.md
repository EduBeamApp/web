---
title: Výpočet
description: "Čo robí solve() v @edubeam/fem, kedy po zmene modelu znova očíslovať rovnice, ako rozpoznať mechanizmus a aký veľký model riešič zvládne."
order: 9
group: Výpočet a výsledky
source: site
---

# Výpočet {#solving}

```ts
solver.solve()
```

`solve()` očísluje rovnice, zostaví globálnu maticu tuhosti a vektory zaťaženia všetkých zaťažovacích stavov a vyrieši posunutia a reakcie. Až potom možno čítať [výsledky](/sk/solver/results); pred výpočtom skončí čítanie výsledku chybou `TypeError`. Jednotlivé kroky zodpovedajú stránke [Ako EduBeam rieši model](/sk/elements/analysis) v teoretickej príručke.

Pre lineárny model je riešenie presné: deformovaný tvar aj vnútorné sily pozdĺž každého prvku vychádzajú z riešenia Timošenkovho nosníka v uzavretom tvare. Netreba teda zjemňovať sieť ani deliť prvky, aby boli priebehy presné.

Od verzie 0.3.1 `solve()` nič nevypisuje do konzoly; verzia 0.3.0 pri každom volaní vypísala riadok ako `Solution took 9 [ms]`.

## Nový výpočet po zmene {#solving-again-after-a-change}

Keď v modeli zmeníte len čísla, stačí znova zavolať `solve()`. Keď sa zmení samotná sústava rovníc, teda počet alebo číslovanie stupňov voľnosti, treba ešte jeden riadok:

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // zmenili sa stupne voľnosti: očíslovať znova
solver.solve()
```

| Zmena | Potom |
| --- | --- |
| Hodnoty zaťaženia, pridané alebo odobraté zaťaženia | `solve()` |
| Súradnice uzlov, materiály, prierezy, kĺby | `solve()` |
| Pridanie uzlov alebo prvkov | `codeNumberGenerated = false`, potom `solve()` |
| Odobratie uzlov alebo prvkov: `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false`, potom `solve()` |
| Zmena podopretia uzla, `node.bcs` | `codeNumberGenerated = false`, potom `solve()` |

Keď na to po pridaní uzla zabudnete, `solve()` vyhodí `TypeError`. Keď na to zabudnete po zmene podpery, riešič **bez varovania** vypočíta model so starými podperami. Ak si nie ste istí, nastavte ho radšej na `false`: nové očíslovanie nestojí takmer nič. Pri odobratí prvku odoberte aj jeho zaťaženie z `lc.elementLoadList`, inak `solve()` vyhodí `RangeError` pre chýbajúci prvok.

Pri mnohých variantoch jedného modelu, napríklad v parametrickej štúdii, je jednoduchšie a rovnako rýchle vytvoriť pre každý variant nový riešič: pozrite postup [Príčinková čiara ako CSV](/sk/solver/scripts#an-influence-line-as-csv).

## Keď výpočet zlyhá {#when-solving-fails}

Konštrukcia, ktorá sa môže pohybovať bez toho, aby sa deformovala, teda mechanizmus, má singulárnu maticu tuhosti. Niekedy to `solve()` rozpozná a vyhodí chybu:

```text
Error: Linear system cannot be solved since matrix is singular
```

Často však nie: zaokrúhľovacie chyby spôsobia, že matica vyzerá riešiteľne, a vy dostanete posunutia rádovo $10^{12}$ m alebo rozumne vyzerajúce čísla pre konštrukciu, ktorá sa môže voľne posúvať. Napríklad nosník na dvoch posuvných kĺboch sa vypočíta bez jediného varovania, kým ho nič netlačí do strany. Podpery preto kontrolujte sami a extrémne veľké posunutia berte ako znak mechanizmu.

Obvyklé príčiny:

- príliš málo podpier, napríklad nosník na dvoch posuvných kĺboch;
- podpery, ktoré konštrukciu neudržia: všetky rovnobežné alebo všetky smerujúce do jedného bodu;
- o jeden kĺb viac, než konštrukcia znesie, napríklad tri kĺby v rade;
- moment zadaný do uzla, v ktorom sú všetky konce prvkov pripojené kĺbovo.

Chybové hlásenie nehovorí, kde problém je. Aplikácia EduBeam mechanizmy hľadá ešte pred výpočtom a nájdený pohyb aj animuje; zostaviť ten istý model v nej býva najrýchlejší spôsob, ako ho uvidieť. Obvyklé príčiny zhŕňa stránka [Riešenie problémov](/sk/reference/troubleshooting).

Chýbajúci uzol, materiál alebo prierez vyvolá `RangeError` s jeho označením. Chýbajúce parametre prierezu chybu nevyhodia vôbec: všetky výsledky sú `NaN`. Pozrite [Materiály a prierezy](/sk/solver/materials-sections#cross-section).

## Veľkosť modelu {#model-size}

Riešič pracuje s plnými maticami a je stavaný na modely veľkosti školských príkladov. Na notebooku v Node sa priamy rad prvkov vyrieši približne za:

| Prvky | Stupne voľnosti | Čas |
| --- | --- | --- |
| 50 | 150 | 0,1 s |
| 100 | 300 | 0,2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

Každé zdvojnásobenie modelu predĺži výpočet šesťkrát až deväťkrát.

Každý príklad, rám aj priehradovú konštrukciu z kurzu stavebnej mechaniky riešič zvládne ľahko. Na modely s tisíckami prvkov však určený nie je.

## Žiadne ďalšie výpočty {#no-other-analyses}

Táto verzia rieši len lineárnu statiku. V zdrojovom kóde je aj riešič vlastných čísel pre vlastné frekvencie, ale do publikovaného balíka nepatrí: `EigenValueDynamicSolver` z `@edubeam/fem` importovať nemožno.
