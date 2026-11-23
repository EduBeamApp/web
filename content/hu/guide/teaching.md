---
description: "Tanítás az EduBeammel: élő modellek a kivetítőn, megosztási linkek a jegyzetekben, önellenőrző házi feladatok, generált gyakorló feladatok és nyomtatható dolgozatok megoldókulccsal."
source: site
---

# Tanítás az EduBeammel

Az [EduBeam]{.edubeam} az előadóteremben született, és ma is ott működik a legjobban: a kivetítőn látható modell abban a pillanatban reagál, ahogy módosítod, egy linknek köszönhetően pedig ugyanez a modell minden hallgató laptopján ott van. Ez az oldal azt gyűjti össze, amit az oktatók a leggyakrabban használnak, az első előadástól a zárthelyiig.

::card-grid{cols="2"}
:::card{title="Az előadáson" icon="lucide:presentation" to="#in-the-lecture"}
A modell az utolsó sorból is olvasható, és élőben változtathatod.
:::
:::card{title="Az első gyakorlaton" icon="lucide:graduation-cap" to="#getting-students-started"}
Tíz perc az üres képernyőtől a kézzel ellenőrzött tartóig.
:::
:::card{title="Jegyzetekben és feladatokban" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
Egy PDF-ben vagy dián lévő link a teljes modellt nyitja meg, évek múlva is.
:::
:::card{title="Önellenőrző feladatok" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
Előbb a kézi számítás, aztán a modell mint ellenőrzés.
:::
:::card{title="Gyakorló feladatok és dolgozatok" icon="lucide:file-check" to="#practice-and-test-papers"}
Generált feladatok azonnali ellenőrzéssel és nyomtatható dolgozatok megoldókulccsal.
:::
:::card{title="Feladatlapok és diák kódból" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
Saját feladatgenerátorok és diaábrák a @edubeam/plot könyvtárral.
:::
::

## Az előadáson {#in-the-lecture}

- **Legyen olvasható az utolsó sorból is.** A **Beállítások → Megjelenítés beállításai** alatt növeld a **Betűméret** értékét 18 vagy 20 px-re (a 20 px a legnagyobb), a **Támaszok mérete** értékét pedig 130–150 %-ra. Ha az ábrák még mindig kicsinek tűnnek, növeld az **Eredmények léptéke** értékét.
- **Egyszerre egy dolgot mutass.** A nézet jobb felső sarkában lévő megjelenítési beállításokban kapcsolj ki mindent, kivéve azt a mennyiséget, amelyről éppen beszélsz, majd egyenként add hozzá a többit.
- **Módosítsd a modellt élőben.** Húzz el egy támaszt, jelöld be az `Ry`-t, adj hozzá egy csuklót. A hallgatók azonnal látják az okot és az okozatot, a <kbd>Ctrl</kbd>+<kbd>Z</kbd> pedig visszavisz.
- **Hagyd, hogy a számítómag elmagyarázza a mechanizmusokat.** Tegyél be eggyel több csuklót a kelleténél, és az EduBeam megrajzolja, hogyan mozdulhat el a szerkezet, animálja a mozgást, és bekarikázza a hibás csuklókat. Jó alkalom arra, hogy a stabilitásról beszélj. Mindkét kapcsolót a **Beállítások → Megjelenítés beállításai → Modell ellenőrzése** alatt találod.
- **Használd a hallgatóid nyelvét és tengelyeit.** Az EduBeam 18 nyelven beszél, a [Beállításokban](/hu/essentials/units-settings) pedig válthatsz az SI és az amerikai mértékegységek, valamint a lefelé mutató z és a felfelé mutató y tengely között, hogy illeszkedjen a jegyzetedhez.

![Láthatóvá tett mechanizmus: a B és a C csukló miatt a keret oldalirányban kileng](/screenshots/hu/ui-mechanism.webp)

## Az első gyakorlaton {#getting-students-started}

Az első látogatáskor az EduBeam megkérdezi a hallgatókat, hogyan szeretnének kezdeni, és milyen mértékegységeket és tengelyeket használjanak. Előre mondd meg nekik, milyen mértékegységeket és tengelyeket használ a kurzusod. A bemutató (**Mutasd be az alkalmazást**), a **Rajzold meg az első tartódat** vezetett feladat és a **Példák** később is elérhetők a **☰** menüben.

Egy jó első gyakorlat: „nyissátok meg a run.edubeam.app oldalt, és válasszátok a *Rajzold meg az első tartódat* lehetőséget”, utána pedig a körülbelül tízperces [Gyors kezdés](/hu/guide/quick-start), a végén kézi ellenőrzéssel.

### Gépterem és offline használat {#offline-and-lab-computers}

Az EduBeam progresszív webalkalmazás (PWA): ha a böngésző egyszer betöltötte, kapcsolat nélkül is működik, és a böngésző felajánlhatja, hogy asztali alkalmazásként telepítsd. A modell és a beállítások böngészőprofilonként tárolódnak, ezért a gépterem közös gépein a hallgatók fájlként vagy linkként vigyék magukkal a munkájukat. A részleteket a [Mit tárol a böngésződ](/hu/essentials/units-settings#what-is-stored-in-your-browser) című szakasz írja le.

## Jegyzetekben és feladatokban {#in-lecture-notes-and-assignments}

A megosztási link a teljes modellt tartalmazza, így bárhová beteheted, ahová linket lehet: PDF-be, diára, a tantárgy e-learning oldalára vagy e-mailbe.

::div{.steps}

### Építsd fel a modellt {#share-build}

Állítsd be úgy, ahogyan a hallgatóknak először látniuk kell: a kívánt terhekkel, feliratokkal és bekapcsolt ábrákkal.

### Másold ki a linket {#share-copy}

Nyomd meg az alkalmazássávon a **Szerkezet megosztása** gombot. Kapcsold be az **Úgy, ahogy én látom** lehetőséget, ha a linknek a te ábráiddal, terheiddel és felirataiddal kell megnyílnia, majd nyomd meg a **Másolás** gombot.

### Illeszd be a jegyzetedbe {#share-paste}

Aki megnyitja, saját másolatot kap, amellyel kísérletezhet. Semmi, amit módosít, nem jut el hozzád vagy bárki máshoz. A linkek az EduBeam újabb verzióiban is működnek, így a jegyzeteid évről évre érvényesek maradnak.

::

Az oktatási anyagokban hagyd kikapcsolva a **Rövidebb link** lehetőséget: az EduBeam olyan példánya, amely azóta nem frissült, hogy ez a lehetőség megjelent, a frissítéséig nem tudja megnyitni a rövidebb formát.

| Link | Mit nyit meg |
| --- | --- |
| `run.edubeam.app/?model=…` | a modellt, szerkesztésre készen |
| `run.edubeam.app/?viewer=1&model=…` | a modellt [megtekintő módban](/hu/essentials/import-export#embed-a-read-only-viewer), `<iframe>` számára |
| `run.edubeam.app/?panel=examples` | a [példatárat](/hu/examples/) |
| `run.edubeam.app/?lang=hu` | az alkalmazást magyarul vagy bármely [más nyelven](/hu/essentials/import-export#url-parameters) |

::callout{type="warning" title="A link lecseréli a hallgató saját modelljét"}
Egy link megnyitása – egyes böngészőkben egy beágyazott nézetet tartalmazó oldal megnyitása is – a hallgató addigi modelljét a **☰ → Legutóbbi szerkezetek** közé helyezi, ahonnan visszaállítható. Ennek ellenére kérd meg a hallgatókat, hogy az órai linkek megnyitása előtt mentsék el a fontos munkájukat a **☰ → Projekt mentése** paranccsal.
::

## Feladatok, amelyeket a hallgatók maguk ellenőrizhetnek {#assignments-students-can-check-themselves}

Az EduBeam azonnali visszajelzést ad a hallgatóknak a kézi számításukra, de nem oldja meg helyettük a feladatot.

- **Előbb számolj, aztán ellenőrizz.** Kérd kézzel a támaszerőket, az igénybevételeket és egy elmozdulást, majd a hallgatók építsék fel a modellt, és vessék össze az eredményeket. A képleteket az [Eredmények ellenőrzése kézi számítással](/hu/guide/verification) oldal tartalmazza, a menetet pedig a [Gyors kezdés](/hu/guide/quick-start#_8-check-by-hand) mutatja be.
- **Kérdezd meg, miért tér el az eredmény.** Nyírási alakváltozás, hiányzó csukló, globális helyett lokális tengelyekben megadott teher: mindegyik megmagyaráz egy kisebb vagy nagyobb eltérést, és ennek megtalálása többet tanít, mint az egyezés.
- **Kérd a modellt a számítással együtt.** Kérj megosztási linket vagy `project.json` fájlt a számítás mellé. Megnyithatod, és pontosan láthatod, mit modelleztek.
- **Igényes beadandók.** A hallgatók a rajzot **SVG** formátumban exportálhatják, amely Wordben és LaTeX-ben is éles marad, az eredményeket pedig **CSV**-ben. Lásd: [Kép exportálása](/hu/essentials/import-export#export-an-image).

## Kész feladatok {#ready-made-exercises}

- **[Példák](/hu/examples/):** hat modell, amely egy kattintással megnyílik, mindegyik kérdésekkel, megfigyelendő részletekkel és a válaszokkal.
- **[Gyakorló feladatok](/hu/practice):** generált tartók, keretek és rácsos tartók, amelyek ellenőrzik a hallgatók válaszait, és egy [dolgozatkészítő](/hu/exam), amely dolgozatként kinyomtatja őket. Lásd [lent](#practice-and-test-papers).
- **[Oktatóanyagok](/hu/tutorials/inclined-beam):** ferde tartó, háromcsuklós keret, síkbeli rácsos tartó és süllyedő támaszú többtámaszú tartó, mindegyik lépésről lépésre modellezve és kézzel ellenőrizve. 15–20 perces gyakorlati segédletként is használhatók.
- **[Eredmények ellenőrzése kézi számítással](/hu/guide/verification):** zárt alakú megoldással rendelkező esetek a konzoltól a támaszsüllyedésig, amelyeket gyors ellenőrzésként feladhatsz.

## Gyakorló feladatok és dolgozatok {#practice-and-test-papers}

Ennek a webhelynek két oldala készít helyetted statikai feladatokat, telepítés és programozás nélkül:

- **A [Gyakorlás](/hu/practice)** oldal minden kérésre új feladatot ad a hallgatóknak. Papíron megoldják, beírják a támaszerőket és a legnagyobb hajlítónyomatékot vagy egy rúderőt, az oldal pedig minden értéket összevet a pontos megoldással: az 1 %-on belüli eltérés elfogadott, a helyes nagyságú, de rossz irányú értéket pedig külön jelzi. Egy tipp megmutatja, hogyan kezdj hozzá, az ábrák pedig a megoldás után jelennek meg. Minden feladatnak van kódja, például `H2048`, amely mindig ugyanazt a feladatot jelöli: írd bele egy házi feladatba, és mindenki ugyanazokkal a számokkal ellenőriz.
- **A [dolgozatkészítő](/hu/exam)** dolgozatokat nyomtat: válaszd ki a szerkezettípusokat, dolgozatonként legfeljebb 6 feladatot és legfeljebb 40 változatot, és minden hallgató más változatot kap. Minden változatban ugyanazok a szerkezettípusok szerepelnek ugyanabban a sorrendben, így a dolgozatok egyformán nehezek. Hozzáad egy sort a névnek, helyet a számításnak és egy megoldókulcsot, a **Nyomtatás vagy mentés PDF-be** pedig kinyomtatja őket. A **.zip letöltése** minden ábrát SVG-fájlként ad LaTeX-hez és Wordhöz, a válaszokat pedig CSV-táblázatként a javításhoz.

Mindkettő ugyanazt a nyolc szerkezettípust kínálja: hat statikailag határozottat (kéttámaszú tartó, konzol, konzolos kéttámaszú tartó, Gerber-tartó, háromcsuklós keret és Warren-rendszerű rácsos tartó) és két határozatlant (kéttámaszközű többtámaszú tartó és merev sarkú keret).

A dolgozatkészítő a beállításait, köztük a számokat kiválasztó **Dolgozat száma** értéket, az oldal webcímében tárolja. Tedd könyvjelzők közé, és jövőre ugyanazokat a dolgozatokat és ugyanazt a megoldókulcsot kapod vissza. A feladatkódok a dolgozatokon alapértelmezés szerint ki vannak kapcsolva: a gyakorló oldal megmutatja a megoldást, ezért a kódok a házi feladatokba valók, amelyeket a hallgatók utólag maguk ellenőriznek.

## Feladatlapok, dolgozatok és diák kódból {#exercise-sheets-tests-and-slides-from-code}

Az oldal ábráit a [@edubeam/plot](/hu/plot) rajzolja: ez egy Vue-komponenskönyvtár, amely bármilyen síkbeli tartót, keretet vagy rácsos tartót megrajzol, amelyet a [@edubeam/fem](/hu/solver), az EduBeam számítómagja kiszámított. Ha tudsz egy kis JavaScriptet, néhány sor kódból oktatási anyag lesz:

- **Saját feladattípusok.** Ha a dolgozatkészítő szerkezetei nem azok, amelyeket tanítasz, írd meg a sajátjaidat: egy seed választja ki a szerkezetet és a számait, így ugyanaz a seed mindig ugyanazt a feladatot adja, és a megoldókulcs is ugyanabból a seedből készül.
- **Fokozatosan felépülő diák.** Mutasd a szerkezetet, aztán a támaszokat és a terheket, aztán a támaszerőket, végül a nyomatéki ábrát, lépésről lépésre, anélkül hogy a rajz elmozdulna a lépések között. [Egy rácsos tartókról szóló mintaelőadás](https://edubeam-slides.pages.dev) is így készült.
- **Ábrák jegyzetekhez és tantárgyi oldalakhoz.** Éles SVG, amely követi az oldal világos vagy sötét témáját, és – a beágyazott alkalmazással ellentétben – soha nem nyúl a hallgató saját modelljéhez.

Próbáld ki. Az **Új feladat** gomb minden megnyomása új feladatot rajzol a megoldókulcsával együtt:

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="Feladatok és dolgozatok" icon="lucide:file-check" to="/hu/plot/exercises"}
Feladatlapok és megoldókulcsok generálása egy seedből.
:::
:::card{title="Diák és jegyzetek" icon="lucide:presentation" to="/hu/plot/slides"}
Rétegről rétegre felépülő ábrák diákhoz és jegyzetekhez.
:::
::
