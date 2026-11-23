---
description: "Az EduBeam felületének térképe: az alkalmazássáv és a ☰ menü, a nézet és megjelenítési beállításai, a kijelölés és szerkesztés, az alsó sáv táblázatai és az értékek beírása."
source: site
---

# Felhasználói felület

Az [EduBeam]{.edubeam} felülete három részből áll: felül az **alkalmazássáv**, középen a **nézet**, ahol rajzolsz, alul pedig az **alsó sáv**, amelyben minden objektumtípusnak saját táblázata van. Amit a nézetben megtehetsz, azt a táblázatokban is megteheted, és fordítva.

![A felület részei, az alábbi lista szerint számozva](/screenshots/hu/ui-overview.webp)

1. **☰ menü**: megnyitás, mentés, megosztás és exportálás; példák és bemutatók.
2. **Szerkezet törlése** és **Szerkezet megosztása**.
3. **Visszavonás** és **Újra**.
4. **A nézet gombjai**: középre igazítás, igazítás a képernyőhöz és a megjelenítési beállítások.
5. **Megjelenítési beállítások**: mely eredmények és a modell mely részei látszanak a rajzon.
6. **Rács, illesztés, szálkereszt és mértékegységek.**
7. **Az alsó sáv fülei**: Csomópontok, Elemek, Terhek, Anyagok, Keresztmetszetek, Eredmények.
8. **A megnyitott fül táblázata**, amelyben minden érték szerkeszthető.

::callout{type="tip" title="Nézd meg a bemutatót"}
A **☰ → Mutasd be az alkalmazást** sorra megmutatja ezeket a részeket, közvetlenül az alkalmazásban.
::

## Alkalmazássáv {#app-bar}

- A **☰** megnyitja a főmenüt (lásd lent).
- A **Szerkezet törlése** megerősítés után törli az összes csomópontot, elemet és terhet; ha az anyagokat vagy a keresztmetszeteket is törölni akarod, jelöld be az **Anyagok törlése** vagy a **Keresztmetszetek törlése** mezőt. A <kbd>Ctrl</kbd>+<kbd>Z</kbd> visszahozza a modellt, és a *Legutóbbi szerkezetek* között is megmarad.
- A **Szerkezet megosztása** megnyitja a [megosztási párbeszédablakot](/hu/essentials/import-export#share-a-link) egy linkkel, amely a teljes modellt tartalmazza.
- Az **Újdonságok** a kiadási megjegyzéseket mutatja. Frissítés után ezek egyszer maguktól is megjelennek.
- A **Dokumentáció** ezt az útmutatót nyitja meg, a GitHub ikon pedig a forráskódot.

Telefonon csak a ☰ és a **Dokumentáció** fér el; a **Szerkezet törlése** és a **Szerkezet megosztása** a menüben található.

### A ☰ menü {#the-☰-menu}

![A ☰ menü](/screenshots/hu/ui-app-menu.webp){.shot-xs}

- A **Projekt megnyitása** és a **Projekt mentése** megnyit, illetve letölt egy `project.json` fájlt (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>).
- A **Legutóbbi szerkezetek** az utolsó 10 törölt vagy lecserélt modellt őrzi meg, hogy visszaállíthasd őket.
- A **Kép exportálása** PNG vagy SVG formátumban menti a rajzot, vagy a vágólapra másolja (<kbd>Ctrl</kbd>+<kbd>P</kbd>).
- A **Példák** kész modellek gyűjteménye; a **Rajzold meg az első tartódat** hétlépéses, vezetett feladat; a **Mutasd be az alkalmazást** a felület bemutatója.
- A **Szerkezet megosztása** és a **Szerkezet törlése** ugyanaz, mint az alkalmazássáv gombjai.

A menü alján az alkalmazás verziója és kiadási dátuma látható. A megnyitásról, mentésről, megosztásról és exportálásról a [Fájlok, linkek és exportálás](/hu/essentials/import-export) oldal szól.

## Nézet {#viewer}

Ez a rajzfelület, ahol a modellt megrajzolod és vizsgálod. Az EduBeam minden módosítás után újraszámítja az eredményeket; *Számítás* gomb nincs.

### Gombok a rajzfelületen {#buttons-on-the-canvas}

**Bal felül: a Visszavonás és az Újra** a modell minden módosításán visszafelé és előre lépked: hozzáadáson, szerkesztésen, húzáson, törlésen, a szerkezet törlésén (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>).

**Jobb felül:**

- **Kijelölés téglalappal**, érintőképernyős eszközön: a következő ujjhúzás egy téglalapot jelöl ki.
- A **Középre igazítás** nagyítás nélkül a nézet közepére helyezi a modellt (<kbd>C</kbd>); az **Igazítás a képernyőhöz** úgy nagyít, hogy a teljes modell látsszon (<kbd>F</kbd>).
- A **⚙** megjeleníti vagy elrejti a [megjelenítési beállításokat](#display-options).

**Jobb alul:**

![A rács, az illesztés, a szálkereszt és a mértékegységek gombjai](/screenshots/hu/ui-grid-units.webp){.shot-sm}

- A **G** megjeleníti vagy elrejti a rácsot és a vonalzókat (<kbd>G</kbd>); az **S** be- vagy kikapcsolja a rácshoz illesztést (<kbd>S</kbd>).
- A **szálkereszt** gomb a vonalzókon jelöli a mutató helyét; csak egérrel működik.
- A **mértékegységek gombja** a beállításokat a [Nyelv és területi beállítások](/hu/essentials/units-settings#language-locale) résznél nyitja meg.

### Megjelenítési beállítások {#display-options}

A ⚙ gomb két sor jelölőnégyzetet nyit meg. Az első sorban azt választod ki, mely eredmények rajzolódjanak a modellre: *Deformált alak*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)* és *Támaszerők*; kezdetben a deformált alak, a hajlítónyomaték és a támaszerők vannak bekapcsolva. A második sor a modell részeit jeleníti meg vagy rejti el: *Támaszok*, *Terhek*, *Csomópontok jelölése* és *Elemek jelölése*; kezdetben mind be van kapcsolva.

![A nézet gombjai és a megjelenítési beállítások](/screenshots/hu/ui-display-settings.webp){.shot-lg}

A **További beállítások** a [megjelenítés beállításait](/hu/essentials/units-settings#viewer-settings) nyitja meg: méretek, színek és az ábrák rajzolásának módja. Hogy az egyes eredmények mit mutatnak, azt az [Eredmények és igénybevételi ábrák](/hu/essentials/results#overlays-in-the-viewer) oldal magyarázza el.

### Navigálás {#navigating}

| Művelet | Egér és billentyűzet | Érintés |
| --- | --- | --- |
| Nagyítás | Egérgörgő, a mutató felé; érintőpadon két ujj széthúzása vagy görgetés két ujjal | Két ujj széthúzása vagy összecsípése |
| Nézet mozgatása | Húzás a jobb gombbal vagy a lenyomott görgővel; hogy melyikkel, azt a [Vezérlés és billentyűparancsok](/hu/essentials/units-settings#controls-shortcuts) résznél választhatod ki | Húzás egy ujjal |
| Igazítás, középre igazítás | <kbd>F</kbd>, <kbd>C</kbd> vagy a jobb felső gombok | A jobb felső gombok |

A <kbd>Ctrl</kbd>+<kbd>+</kbd> és a <kbd>Ctrl</kbd>+<kbd>-</kbd> a rajz közepe körül nagyít és kicsinyít, bármilyen billentyűzetkiosztással. Az alkalmazás felületét nem méretezik át, ahogy a böngésző saját nagyítása tenné.

### Kijelölés és szerkesztés {#selecting-and-editing}

| Feladat | Teendő |
| --- | --- |
| Egy objektum kijelölése | Kattints egy csomópontra, elemre, teherre vagy méretvonalra. Mellette megnyílik egy panel a műveleteivel: teher hozzáadása, támaszok megadása, szerkesztés, a merevségi mátrix megjelenítése, törlés. Az alsó sáv az objektum fülére vált. |
| Több objektum kijelölése | Húzz egy téglalapot a rajzfelület üres részén (érintőképernyőn előbb nyomd meg a **Kijelölés téglalappal** gombot). Ez kijelöl minden csomópontot, amely a téglalapon belül van, és minden elemet, amelyhez a téglalap hozzáér, a terheikkel és méretvonalaikkal együtt. A <kbd>Ctrl</kbd>+<kbd>A</kbd> mindent kijelöl. |
| Törlés, másolás, beillesztés | <kbd>Delete</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>. A beillesztett másolat kattintásig követi a mutatót, vagy a megjelenő sávba beírhatsz egy Δx, Δz eltolást. |
| Csomópont mozgatása | Húzd el. Bekapcsolt illesztésnél rácspontra kerül; a hozzá kapcsolódó elemek és terhek követik. |
| Teher szerkesztése | Kattints rá duplán. |
| Részletek megtekintése | Mutass rá bármire, és megjelenik egy felugró címke: a csomópont elmozdulásai és elfordulása, az elem anyaga és keresztmetszete, a teher értékei. Érintőképernyőn koppints rá: ugyanezt a panel mutatja. |
| A rajzfelület menüjének megnyitása | Kattints a jobb gombbal a rajzfelületre, érintőképernyőn pedig tartsd rajta az ujjad. |

::div{.shots}

![A csomópont panelje: teher hozzáadása, támaszok megadása, elmozdulás előírása](/screenshots/hu/ui-node-menu.webp)

![Ha egy csomópontra mutatsz, látod az elmozdulásait és az elfordulását](/screenshots/hu/ui-hover.webp)

::

A **rajzfelület menüjében** a *Csomópont hozzáadása*, az *Elem hozzáadása* és a *Méretvonal hozzáadása* (elem fölött az *Elem méretezése* is), majd az aktuális kijelölésre vonatkozó *Szerkesztés*, *Másolás*, *Beillesztés* és *Törlés* található. Ha a *Csomópont hozzáadása* vagy az *Elem hozzáadása* kiválasztásakor lenyomva tartod a <kbd>Ctrl</kbd> billentyűt, párbeszédablak helyett egérrel helyezheted el őket.

![A rajzfelület menüje](/screenshots/hu/ui-canvas-menu.webp){.shot-sm}

Minden billentyűparancsot és kézmozdulatot a [Billentyűzet, egér és érintés](/hu/reference/shortcuts) oldal sorol fel.

### Ha a modell nem számítható {#when-the-model-cannot-be-solved}

Az üzenetek a nézet bal felső sarkában jelennek meg:

| Üzenet | Jelentése |
| --- | --- |
| *Nincs megadva anyag.*, *Nincs megadva keresztmetszet.* | Adj hozzá egyet a mellette lévő **Új hozzáadása** gombbal. |
| Kék **Támaszok hiányoznak** címke | A modell egyszerűen még nincs kész: több támasz kell. |
| Piros üzenet a **Részletek** gombbal | Valami hibás. A részletek minden problémát felsorolnak, mindegyikhez javítási javaslattal. |
| Sárga üzenet | A modell számítása lefutott, de valami gyanús, például egy csomópont, amelyhez egyetlen elem sem csatlakozik. |

Ha a szerkezet még el tud mozdulni, az EduBeam szaggatott körvonallal megmutatja a mozgását, és bekarikázza a hibás csomópontokat vagy csuklókat. A mozgást újra láthatod, ha az üzenetre mutatsz; a szem ikonos gomb elrejti.

![A B-ben és C-ben csuklós keret mechanizmus: az EduBeam megmutatja, hogyan mozdul el](/screenshots/hu/ui-mechanism.webp)

A [Hibaelhárítás](/hu/reference/troubleshooting#messages) oldal minden üzenetet és a javításuk módját is elmagyarázza.

## Alsó sáv {#bottom-bar}

Hat fül, mindegyiken egy eszköztár és egy szerkeszthető táblázat. A fül felirata mutatja, hány objektumot tartalmaz. A fülsort felfelé vagy lefelé húzva átméretezheted a sávot, a jobb oldali gombbal pedig összecsukhatod. A mellette lévő **?** a megnyitott fület magyarázza el; egyes oszlopfejlécek mellett is van ilyen **?**.

| Fül | Eszköztár | A táblázat oszlopai |
| --- | --- | --- |
| **Csomópontok** | Csomópont hozzáadása (párbeszédablak), Csomópont hozzáadása (egér) | Csomópont, Koordináták, **Megtámasztott szabadságfokok** (támaszjel, `Dx`, `Dz`, `Ry`, α szög), Terhek, Műveletek |
| **Elemek** | Elem hozzáadása (párbeszédablak), Elem hozzáadása (egér) | Elem, Típus, Csomópontok (a **Csomópontok felcserélése** gombbal), Anyag, Keresztmetszet, **Rúdvégi csuklók**, Terhek, Műveletek |
| **Terhek** | Csomóponti teher hozzáadása, Rúdteher hozzáadása | Típus, Hely, Összetevők, Műveletek |
| **Anyagok** | Anyag hozzáadása, Anyagkönyvtár | Anyag, E, G, α<sub>T</sub>, Műveletek |
| **Keresztmetszetek** | Keresztmetszet hozzáadása, Szelvénykönyvtár, Sokszög keresztmetszet | Alak, Keresztmetszet, Terület, I<sub>y</sub>, Magasság, Nyírási tényező, Műveletek |
| **Eredmények** | Csomóponti eredmények, Elemek eredményei, CSV exportálása, Másolás | Csomópontonként az elmozdulások, elemenként a rúdvégi erők; lásd [Eredmények](/hu/essentials/results#results-tab) |

A füleket részletesen a [Csomópontok és támaszok](/hu/essentials/nodes-supports), az [Elemek, anyagok és keresztmetszetek](/hu/essentials/elements), a [Terhek](/hu/essentials/loads) és az [Eredmények és igénybevételi ábrák](/hu/essentials/results#results-tab) oldal mutatja be.

### Értékek beírása {#typing-values}

Minden számmező, a táblázatokban és a párbeszédablakokban is, ugyanúgy működik:

- Az értékek az [aktuális mértékegységekben](/hu/essentials/units-settings#units) értendők, amelyeket az oszlopfejléc vagy a mező mögötti felirat mutat.
- Tizedespont és tizedesvessző is használható: a `2.5` és a `2,5` ugyanazt jelenti.
- Műveleteket is beírhatsz `+ - * / ^` jelekkel és zárójelekkel, így a `6/2`, `3*1.5`, `2^3` vagy `(4+2)/3` eredményét az alkalmazás kiszámítja; az `1e-5` jelentése $10^{-5}$.
- Táblázatban az <kbd>Enter</kbd>, az <kbd>Esc</kbd>, a <kbd>Tab</kbd> vagy egy máshová kattintás érvényesíti az értéket. Utána a <kbd>Ctrl</kbd>+<kbd>Z</kbd> visszavonja; gépelés közben viszont csak a beírt szöveget vonja vissza.

## Fülek a nézet fölött {#tabs-above-the-viewer}

A **Szerkezet** fül a rajzfelületet mutatja. A **Beállítások** fül a helyén, teljes méretben jeleníti meg a [beállításokat](/hu/essentials/units-settings), így módosíthatod a színeket vagy a mértékegységeket, majd visszaválthatsz, hogy lásd a hatásukat. A mértékegységek gombja és a *További beállítások* ugyanezeket a beállításokat a modell fölötti párbeszédablakban nyitják meg.

## Lebegő ablakok {#floating-windows}

A **Merevségi mátrix** (az elem paneljéről vagy az *Elemek* táblázatból) egy ablakot nyit meg az elem 6 × 6-os, globális tengelyekben felírt merevségi mátrixával. A rajzfelület menüjének **Szerkesztés** pontja az aktuális kijelölés táblázatát nyitja meg. Az ablakot a címsoránál fogva mozgathatod, és a × gombbal zárhatod be.
