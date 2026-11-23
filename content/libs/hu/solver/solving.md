---
title: Megoldás
description: "Mit csinál a solve() az @edubeam/fem csomagban, mikor kell a modell módosítása után újraszámozni az egyenleteket, hogyan ismerhető fel a mechanizmus, és mekkora modellt kezel."
order: 9
group: Megoldás és eredmények
source: site
---

# Megoldás {#solving}

```ts
solver.solve()
```

A `solve()` megszámozza az egyenleteket, összeállítja a globális merevségi mátrixot és minden terhelési eset tehervektorát, majd meghatározza az elmozdulásokat és a támaszerőket. Ezután bármely [eredmény](/hu/solver/results) kiolvasható; előtte egy eredmény kiolvasása `TypeError` kivételt dob. A lépések ugyanazok, mint az elméleti kézikönyv [Hogyan számít az EduBeam](/hu/elements/analysis) oldalán.

A lineáris modell megoldása pontos: a deformált alak és az igénybevételek minden rúd mentén a Timoshenko-gerenda zárt alakú megoldásaiból adódnak, így nincs sűrítendő háló, és a pontos ábrákhoz sem kell felosztani a rudakat.

A 0.3.1-es verziótól a `solve()` semmit sem ír a konzolra; a 0.3.0 minden hívásnál kiírt egy `Solution took 9 [ms]`-hez hasonló sort.

## Újbóli megoldás módosítás után {#solving-again-after-a-change}

Ha csak számokat változtatsz a modellben, elég egy újabb `solve()`. Ha az változik, hogy milyen egyenletek vannak, előtte még egy sor kell:

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // megváltoztak a szabadságfokok: számozd újra őket
solver.solve()
```

| Módosítás | Utána |
| --- | --- |
| Teherértékek, új vagy törölt terhek | `solve()` |
| Csomóponti koordináták, anyagok, keresztmetszetek, csuklók | `solve()` |
| Csomópontok vagy rudak hozzáadása | `codeNumberGenerated = false`, majd `solve()` |
| Csomópontok vagy rudak törlése: `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false`, majd `solve()` |
| Egy csomópont támaszainak módosítása, `node.bcs` | `codeNumberGenerated = false`, majd `solve()` |

Ha csomópont hozzáadása után elfelejted, a `solve()` `TypeError` kivételt dob. Ha támasz módosítása után felejted el, **szó nélkül** a régi támaszokkal számol. Ha bizonytalan vagy, állítsd `false`-ra: a számozás szinte semmibe sem kerül. Egy rúd törlésekor a terheit is törölni kell az `lc.elementLoadList` tömbből, különben a `solve()` a hiányzó rúd miatt `RangeError` kivételt dob.

Egy modell sok változatánál, például paramétervizsgálatkor, egyszerűbb és ugyanolyan gyors minden változathoz új számítómagot létrehozni: lásd a [hatásvonalas példaprogramot](/hu/solver/scripts#an-influence-line-as-csv).

## Ha a megoldás nem sikerül {#when-solving-fails}

Az alakváltozás nélkül elmozdulni képes szerkezet, a mechanizmus merevségi mátrixa szinguláris. A `solve()` ezt néha észreveszi, és kivételt dob:

```text
Error: Linear system cannot be solved since matrix is singular
```

Gyakran azonban nem: a kerekítési hibák miatt a mátrix megoldhatónak látszik, és $10^{12}$ m nagyságrendű elmozdulásokat kapsz, vagy észszerűnek tűnő számokat egy szabadon elcsúszni képes szerkezetre. Egy két görgős támaszon álló tartó például panasz nélkül megoldódik, amíg semmi sem tolja oldalirányban. Ezért a támaszokat magad ellenőrizd, a hatalmas elmozdulásokat pedig tekintsd a mechanizmus jelének.

Tipikus okok:

- túl kevés támasz, például két görgős támaszon álló tartó;
- a szerkezetet megtartani nem képes támaszok: mind párhuzamos, vagy mind egy pont felé mutat;
- eggyel több csukló a kelleténél, például három egy egyenesben;
- olyan csomópontra működő nyomaték, amelyben minden rúdvég csuklós.

A hibaüzenet nem mondja meg, hol van a probléma. Az EduBeam alkalmazás megoldás előtt ellenőrzi, nem mechanizmus-e a szerkezet, és megkeresi, majd animálja a mozgást; ha ugyanezt a modellt ott felépíted, az gyakran a leggyorsabb módja annak, hogy meglásd. A [Hibaelhárítás](/hu/reference/troubleshooting) oldal felsorolja a szokásos okokat.

A hiányzó csomópont, anyag vagy keresztmetszet a nevét megadó `RangeError` kivételt dob. A hiányzó keresztmetszeti paraméterek egyáltalán nem okoznak hibát: minden eredmény `NaN` lesz. Lásd [Anyagok és keresztmetszetek](/hu/solver/materials-sections#cross-section).

## Modellméret {#model-size}

A számítómag sűrű (teli) mátrixokat használ, oktatási méretű modellekhez készült. Laptopon, Node-ban egy egyenes vonalban sorakozó rúdlánc megoldása nagyjából ennyi ideig tart:

| Rudak | Szabadságfokok | Idő |
| --- | --- | --- |
| 50 | 150 | 0,1 s |
| 100 | 300 | 0,2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

A modell méretének minden megduplázása hat-kilencszer hosszabb időt jelent.

Egy tartók statikája kurzus minden feladata, kerete és rácsos tartója bőven belefér. Több ezer rúdból álló modellekhez nem készült.

## Más számítás nincs {#no-other-analyses}

Ez a verzió csak lineáris statikai feladatokat old meg. A forráskód tartalmaz egy sajátérték-megoldót a sajátfrekvenciák meghatározásához, de az nem része a közzétett csomagnak: az `EigenValueDynamicSolver` nem importálható az `@edubeam/fem` csomagból.
