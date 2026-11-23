---
description: "Csomópontok elhelyezése és szerkesztése az EduBeamben, rácshoz illesztés, elemek kettéosztása és a megfelelő támasz kiválasztása: csuklós, görgős, befogás, görgős befogás, függőleges vagy ferde."
source: site
---

# Csomópontok és támaszok

A csomópontok a modell pontjai: ezeket kötik össze az elemek, és ezekre kerülnek a támaszok és a csomóponti terhek. Elhelyezheted őket koordináták beírásával vagy kattintással, majd a megtámasztott csomópontokon add meg a rajzodnak megfelelő támaszt.

## Koordináták {#coordinates}

Minden csomópontnak van egy **X** és egy **Z** koordinátája az aktuális [hosszmértékegységben](/hu/essentials/units-settings#units). Az x tengely jobbra, a **z tengely lefelé mutat**, így minden, ami a talaj fölött van, negatív Z koordinátájú: egy 4 m magas oszlop `Z = 0`-tól `Z = −4`-ig tart.

::model-figure{caption="6 m széles és 4 m magas keret: A és D a Z = 0, B és C a Z = −4 magasságban van"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

Ha inkább felfelé mutató függőleges tengellyel dolgoznál, a Beállításokban válts [felfelé mutató y tengelyre](/hu/elements/conventions#y-up-axes). Ez csak a megjelenítést változtatja meg; a modell és a fájljai ugyanazok maradnak.

## Csomópontok hozzáadása {#adding-nodes}

- **Beírással.** *Csomópontok* fül → **Csomópont hozzáadása** (a **+** ikonos gomb), vagy jobb kattintás a rajzfelületen → *Csomópont hozzáadása*. Írd be az X és a Z koordinátát, és ha kell, a támaszokat és a támasz szögét is.
- **Kattintással.** *Csomópontok* fül → **Csomópont hozzáadása** (a kurzor ikonos gomb), vagy tartsd lenyomva a <kbd>Ctrl</kbd> billentyűt, miközben a rajzfelület menüjében a *Csomópont hozzáadása* pontot választod. Minden kattintás elhelyez egy csomópontot; a befejezéshez nyomd meg az <kbd>Esc</kbd> billentyűt, a **Mégse** gombot vagy újra ugyanazt a gombot.
- **Elemek rajzolása közben.** Ha [egérrel rajzolsz elemeket](/hu/essentials/elements#adding-elements), az üres rajzfelületre kattintva ott új csomópont jön létre.
- **Másolással.** Jelölj ki csomópontokat (és elemeket), nyomd meg a <kbd>Ctrl</kbd>+<kbd>C</kbd>, majd a <kbd>Ctrl</kbd>+<kbd>V</kbd> billentyűt, és kattints oda, ahová a másolatot szánod, vagy írj be egy Δx, Δz eltolást a felső sávba, és nyomd meg a **Beillesztés** gombot.

::div{.shots}

![A Csomópont hozzáadása párbeszédablak](/screenshots/hu/qs-node.webp)

![Egérrel való elhelyezéskor a felső sávban adhatod meg minden új csomópont támaszát és szögét](/screenshots/hu/nodes-add-banner.webp)

::

Az új csomópontok a következő szabad számot kapják: `1`, `2`, `3`, …. Bármelyiket átnevezheted a táblázat *Csomópont* oszlopában, például `A`, `B`, `C` jelölésre.

### Illesztés {#snapping}

Ha az **Illesztés a rácshoz** be van kapcsolva (nyomd meg az <kbd>S</kbd> billentyűt, vagy kattints a nézet jobb alsó sarkában az **S** gombra), az elhelyezett vagy elhúzott csomópontok rácspontra kerülnek. A lépésköz alapértelmezés szerint 0,1 m, amerikai mértékegységekben 0,5 ft; a [Beállítások → Megjelenítés beállításai → Rács](/hu/essentials/units-settings#viewer-settings) résznél módosíthatod. Bármilyen más helyzethez írd be a pontos koordinátákat a táblázatba.

### Csomópont elhelyezése meglévő elemen {#placing-a-node-on-an-existing-element}

Ha csomópontok egérrel való elhelyezése közben egy elemre (vagy nagyon közel hozzá) kattintasz, az EduBeam megkérdezi, mit szeretnél:

- A **Bekötés a szerkezetbe** kettéosztja az elemet `1a` és `1b` elemre, amelyeket az új csomópont köt össze. Így adhatsz hozzá a leggyorsabban közbenső támaszt vagy egy pontot, amelyet megterhelhetsz. A külső végeken lévő csuklók a helyükön maradnak. Az egyenletesen megoszló és a trapéz alakú terhek megoszlanak a két rész között. A koncentrált és a hőmérsékleti terhek mind az első részre, az `1a` elemre kerülnek: a *Terhek* táblázatban tedd át az `1b` elemre azt a koncentrált terhet, amely az új csomóponton túl volt (a helyzetét ezután az új csomóponttól kell mérni), és adj az `1b` elemnek saját hőmérsékleti terhet.
- Az **Önálló csomópont elhelyezése** az elemre teszi a csomópontot, de nem köti hozzá.

A csomópontok elhelyezése mindkét esetben itt véget ér; további csomópontokhoz kattints újra a kurzor ikonos gombra.

## Csomópontok szerkesztése {#editing-nodes}

| Feladat | Teendő |
| --- | --- |
| Csomópont mozgatása | Húzd el a nézetben (érintőképernyőn nyomd le és húzd), vagy írd be az X és a Z koordinátát a *Csomópontok* táblázatba. A hozzá kapcsolódó elemek, terheik és a méretvonalak követik. |
| Átnevezés | Írj be új jelölést a *Csomópont* oszlopba. |
| Támaszok módosítása | Kattints a csomópontra → **Csomóponti támasz**, vagy használd a *Megtámasztott szabadságfokok* oszlopot. Lásd: [Támaszok](#supports). |
| Minden egyszerre | A *Műveletek* oszlop ceruza ikonja megnyitja a **Csomópont szerkesztése** ablakot: koordináták, támaszok és a támasz szöge, a támaszjel előnézetével. |
| Törlés | A táblázatban a ×, a csomópont paneljén a **Törlés**, vagy jelöld ki, és nyomd meg a <kbd>Delete</kbd> billentyűt. A hozzá kapcsolódó elemek, terhek és méretvonalak is törlődnek. |

Minden módosítás visszavonható a <kbd>Ctrl</kbd>+<kbd>Z</kbd> billentyűkombinációval.

## Támaszok {#supports}

Minden csomópont háromféleképpen mozdulhat el, ezek a **szabadságfokai**: `Dx` az x irányú, `Dz` a z irányú eltolódás, `Ry` pedig a rajz síkjában történő elfordulás. A támasz ezek közül néhányat **gátol**.

A nyolc támasztípus a három szabadságfok nyolc lehetséges kombinációja. A táblázatot soronként olvasd: a középső oszlopban a csomópont szabadon elfordul, a jobb oldaliban az elfordulása is gátolt.

| Gátolt eltolódások | Szabad elfordulás | Gátolt elfordulás is |
| --- | --- | --- |
| **Mindkettő** (`Dx` és `Dz`) | ![](/screenshots/hu/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Csuklós támasz** | ![](/screenshots/hu/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Befogás** |
| **Csak függőleges** (`Dz`): vízszintesen elcsúszhat | ![](/screenshots/hu/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Görgős támasz** | ![](/screenshots/hu/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Görgős befogás** |
| **Csak vízszintes** (`Dx`): függőlegesen elcsúszhat | ![](/screenshots/hu/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Függőleges görgős támasz** | ![](/screenshots/hu/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Függőleges görgős befogás** |
| **Egyik sem**: mindkét irányban elcsúszhat | ![](/screenshots/hu/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Szabad** (nincs támasz) | ![](/screenshots/hu/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Gátolt elfordulás** |

Minden gátolt szabadságfokhoz az EduBeam kiszámít egy **támaszerőt**: a `Dx` vízszintes $R_x$ erőt, a `Dz` függőleges $R_z$ erőt, az `Ry` pedig $M$ nyomatékot ad. A csuklós támasznál tehát $R_x$ és $R_z$ keletkezik, a görgős támasznál csak $R_z$, a görgős befogásnál $R_z$ és $M$, a befogásnál pedig mindhárom.

### Támasz megadása {#setting-a-support}

Válaszd ki a támaszjelet, vagy jelöld be egyenként a szabadságfokokat; a kettő mindig összhangban van. Mindkettőt három helyen találod:

- a csomópont paneljén (kattints a csomópontra) → **Csomóponti támasz**, a **Csomóponti koordináta-rendszer szöge** mezővel együtt, ahogy lent látható;
- a **Csomópont hozzáadása** és a **Csomópont szerkesztése** párbeszédablakban;
- a *Csomópontok* táblázat *Megtámasztott szabadságfokok* oszlopában, ahol a támaszjel egy kis menü, a `Dx`, `Dz`, `Ry` pedig jelölőnégyzet.

![Csomóponti támasz a csomópont paneljén: a támaszjelek, a szabadságfokok jelölőnégyzetei és a támasz szöge](/screenshots/hu/nodes-support-picker.webp){.shot-lg}

Ha egy támaszjelre mutatsz, megjelenik a neve.

### Görgős támasz vagy görgős befogás? {#roller-or-slider}

Mindkettő síneken áll, és elcsúszhat rajtuk. A különbség az elfordulásban van:

- a **görgős támasz** sínre tett csukló: a tartóvég **szabadon elfordul**, így ott nem ébred nyomaték;
- a **görgős befogás** sínre tett befogás: a tartóvég **nem tud elfordulni**, így a támasz nyomatékot is felvesz.

Ugyanaz a 6 m-es, 10 kN/m-rel terhelt tartó, csak a jobb oldali támasz más. Válts a deformált alak és a hajlítónyomaték között:

::div{.shots}

:::model-figure{caption="Csuklós és görgős támasz: a jobb vég szabadon elfordul; ott M = 0, mindkét támaszerő 30 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Csuklós támasz és görgős befogás: a jobb vég vízszintes marad; ott M = −45 kNm, a görgős befogásnál a támaszerő 37,5 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

Az első egy kéttámaszú tartó ($M_{max} = qL^2/8 = 45\ \text{kNm}$ a támaszköz közepén). Függőleges teher alatt a görgős befogás pontosan úgy viselkedik, mint egy befogás, így a második egy egyik végén befogott, másik végén csuklós támaszú tartó ($R_B = 5qL/8 = 37{,}5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Az, hogy a tartóvég vízszintes marad, a tartót merevebbé is teszi: a legnagyobb lehajlás 9,617 mm-ről 4 mm-re csökken. A görgős befogás csak akkor viselkedik másként, mint a befogás, ha valami a sínek irányában nyomja.

### Ferde támaszok {#inclined-skewed-supports}

A lejtőn álló támasz elforgatott tengelyek mentén gátolja a csomópont mozgását. Add meg a **Csomóponti koordináta-rendszer szöge** α értékét fokban, −180 és 180 között: a csomópont paneljén a *Csomóponti támasz* alatt, a csomópont hozzáadására és szerkesztésére szolgáló párbeszédablakban, vagy a *Csomópontok* táblázat **α** mezőjében.

A csomópont tengelyei α szöggel elfordulnak, és a bejelölt szabadságfokok ezek mentén hatnak. Az α az x tengelyt a z felé forgatja, ami a képernyőn az **óramutató járásával megegyező** irány (felfelé mutató y tengelynél az x-et az y felé forgatja, az óramutató járásával ellentétesen). Egy jobbra 30°-ban lejtő felületen álló görgős támasz tehát egy α = 30°-os görgős támasz. A támaszjel a tengelyekkel együtt fordul el, és a támaszerő is ezek mentén jelenik meg.

::model-figure{caption="A B-beli görgős támasz α = 30°-kal elforgatva: a 34,64 kN-os támaszerő merőleges a lejtőre, a tartóban N = +17,32 kN normálerő ébred"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

Ez ugyanaz a 6 m-es, 10 kN/m-rel terhelt tartó, mint fent, de a görgős támasza most egy 30°-os lejtőn áll. A B-beli támaszerő függőleges összetevője továbbra is $qL/2 = 30\ \text{kN}$, így maga a támaszerő $30/\cos 30° = 34{,}64\ \text{kN}$, a vízszintes összetevője pedig ($30 \tan 30° = 17{,}32\ \text{kN}$) jobbra tolja B-t. Az A-beli csuklós támasz ezt megakadályozza, így a tartó húzott. A hajlítónyomaték nem változik.

Az elforgatott csomópontra ható [csomóponti terhek](/hu/essentials/loads#nodal-loads) globális vagy csomóponti tengelyekben is megadhatók; az [előírt elmozdulás](/hu/essentials/loads#prescribed-displacements-support-settlements) mindig a támasz saját tengelyei mentén hat.

### Stabilitás {#stability}

Egy síkbeli szerkezetnek legalább **három gátolt szabadságfokra** van szüksége, mégpedig úgy elrendezve, hogy valóban rögzítsék. Amíg támaszok hiányoznak, a nézetben kék **Támaszok hiányoznak** címke látható. Ha elég támasz van, de ezek nem tudják rögzíteni a szerkezetet (mind párhuzamosak, vagy a hatásvonalaik egy ponton mennek át), vagy a csuklók miatt a rudak egymáshoz képest elfordulhatnak, piros üzenet nevezi meg a problémát, és szaggatott körvonal mutatja, hogyan mozdul el a szerkezet. Minden üzenetet a [Hibaelhárítás](/hu/reference/troubleshooting#messages) oldal magyaráz el.

## Csomóponti terhek és támaszsüllyedések {#nodal-loads-and-settlements}

Kattints egy csomópontra → **Teher hozzáadása** erő vagy nyomaték megadásához, vagy → **Elmozdulás előírása**, ha egy támaszt adott értékkel el akarsz mozdítani (támaszsüllyedés). Mindkettőt a [Csomóponti terhek](/hu/essentials/loads#nodal-loads) rész ismerteti.

## Méretvonalak {#dimension-lines}

A méretvonalak hosszakat jelölnek a rajzon. A számítást nem befolyásolják, de a projekttel együtt mentődnek, a megosztási linkekben is benne vannak, és megjelennek az [exportált képeken](/hu/essentials/import-export#export-an-image).

| Feladat | Teendő |
| --- | --- |
| Méretvonal hozzáadása | Jobb kattintás a rajzfelületen → **Méretvonal hozzáadása**, majd kattints a két végpontra. A csomópont közelébe eső pont a csomóponthoz illeszkedik. |
| Elem méretezése | Jobb kattintás az elemen → **Elem méretezése**. |
| Szerkesztés vagy átfordítás | Kattints a vonalra → **Szerkesztés** a koordinátái beírásához, vagy **Méretvonal átfordítása**, hogy a felirat a másik oldalra kerüljön. |
| Mozgatás | Húzd el a vonalat vagy az egyik végpontját. A csomóponton lévő végpont a csomóponthoz kötve marad, és követi azt. |
