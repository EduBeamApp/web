---
description: "Az EduBeam összes billentyűparancsa, egérművelete és érintőgesztusa: visszavonás, mentés, megnyitás, képexportálás, másolás és beillesztés, igazítás, nagyítás, kijelölés és a nézet mozgatása."
source: site
---

# Billentyűzet, egér és érintés

Az EduBeam billentyűzettel és egérrel, érintőpaddal vagy ujjal is használható. Ez az oldal az összes billentyűparancsot és gesztust felsorolja. Macen használd a <kbd>Cmd</kbd> billentyűt mindenhol, ahol <kbd>Ctrl</kbd> szerepel; az alkalmazás saját menüi ott ⌘ jelet mutatnak.

## Billentyűzet {#keyboard}

A rajzolás billentyűparancsai (<kbd>F</kbd>, <kbd>C</kbd>, <kbd>G</kbd>, <kbd>S</kbd>, <kbd>Delete</kbd>, valamint <kbd>Ctrl</kbd>+<kbd>A</kbd>, <kbd>C</kbd>, <kbd>V</kbd>) nem működnek, amíg egy szövegmező aktív, így ha egy mezőbe `f`-et vagy `s`-t írsz, az sosem indítja el őket. Előbb kattints a rajzra.

### Fájlok és előzmények {#files-and-history}

| Billentyűparancs | Művelet |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> | A modell utolsó módosításának visszavonása |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | Újra |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Projekt mentése (letölti a `project.json` fájlt) |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Projekt megnyitása |
| <kbd>Ctrl</kbd>+<kbd>P</kbd> | Kép exportálása |

A visszavonás a modell törlését, egy fájl, link vagy példa megnyitását és egy legutóbbi szerkezet visszaállítását is visszavonja. Amíg egy táblázatcellába még gépelsz, a <kbd>Ctrl</kbd>+<kbd>Z</kbd> a gépelést vonja vissza; a cella jóváhagyása után a modell módosítását. Egy párbeszédablak mezőiben mindig a gépelést vonja vissza.

### Rajzolás {#drawing}

| Billentyűparancs | Művelet |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>A</kbd> | Az összes kijelölése |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | A kijelölt csomópontok, elemek és terhek másolása |
| <kbd>Ctrl</kbd>+<kbd>V</kbd> | Beillesztés. A másolat áttetsző képe követi a mutatót: kattintással elhelyezed, vagy a felső sávban megadod a Δx, Δz eltolást, és megnyomod a **Beillesztés** gombot vagy az <kbd>Enter</kbd> billentyűt |
| <kbd>Delete</kbd> | A kijelölés törlése (Mac laptopon <kbd>Fn</kbd>+<kbd>Delete</kbd>) |
| <kbd>Esc</kbd> | Kilépés az aktuális módból (csomópontok, elemek vagy méretvonalak hozzáadása, beillesztés, kivágat kijelölése képhez) és a kijelölés megszüntetése; bezárja a ☰ menüt is, és befejezi a bemutatót |
| <kbd>F</kbd> | Igazítás a képernyőhöz |
| <kbd>C</kbd> | Középre igazítás |
| <kbd>G</kbd> | Rács be/ki |
| <kbd>S</kbd> | Rácsillesztés be/ki |
| <kbd>Ctrl</kbd>+<kbd>+</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | A rajz nagyítása / kicsinyítése a közepe körül |

Az EduBeamben a <kbd>Ctrl</kbd>+<kbd>+</kbd> és a <kbd>Ctrl</kbd>+<kbd>-</kbd> a rajzot nagyítja és kicsinyíti, nem a teljes oldalt, mint más weboldalakon. Bármilyen billentyűzetkiosztással működnek: a + és − jelű billentyűkkel, bárhol legyenek is a kiosztásodban, amerikai billentyűzeten a <kbd>Backspace</kbd> bal oldalán lévő kettővel, valamint a numerikus billentyűzet + és − billentyűjével.

### Táblázatok és párbeszédablakok {#tables-and-dialogs}

| Billentyűparancs | Művelet |
| --- | --- |
| <kbd>Enter</kbd> | Táblázatcellában: jóváhagyja az értéket. Párbeszédablak szövegmezőjében: a fő gombhoz hasonlóan jóváhagyja a párbeszédablakot |
| <kbd>Esc</kbd> | Táblázatcellában: kilép belőle, megtartva az értéket. Párbeszédablakban: mentés nélkül bezárja |
| <kbd>Tab</kbd> | Továbblép a következő mezőre; a táblázatcella megtartja, amit beírtál |

A számmezők úgy fogadják el a műveleteket, ahogy kézzel számolnál: `6/2`, `3*1,5`, `2^3`, `(4+2)/3`, valamint `1e3`; tizedesjelként vessző és pont is használható.

## Egér {#mouse}

| Művelet | Eredmény |
| --- | --- |
| Kattintás | Kijelöl egy csomópontot, elemet, terhet vagy méretvonalat, és megnyitja a paneljét |
| Húzás üres rajzfelületen | Kijelölő téglalap |
| Csomópont húzása | Mozgatja; bekapcsolt illesztésnél a rácshoz illeszkedik |
| Kattintás hozzáadás közben | Csomópontot helyez el, vagy elemekből álló töröttvonalat kezd vagy folytat |
| Dupla kattintás egy terhen | A teher szerkesztése (előírt elmozdulásé is) |
| Jobb kattintás | A rajzfelület menüje: Csomópont hozzáadása, Elem hozzáadása, Méretvonal hozzáadása, Elem méretezése (elem felett), Szerkesztés, Másolás, Beillesztés, Törlés |
| <kbd>Ctrl</kbd> + **Csomópont hozzáadása** vagy **Elem hozzáadása** a rajzfelület menüjében | Elhelyezés egérrel párbeszédablak helyett |
| Húzás középső vagy jobb gombbal | A nézet mozgatása. A gombot a **Beállítások → Vezérlés és billentyűparancsok → Nézet mozgatása** alatt választhatod ki |
| Görgő | Nagyítás a mutató felé |
| Rámutatás egy objektumra | Az objektum elmozdulásai, tulajdonságai vagy teherértékei egy felugró címkében |

Érintőpadon a csíptetés és a kétujjas görgetés is nagyít. A nézet mozgatásához kattints és húzz két ujjal, ez jobb gombos húzásnak felel meg.

## Érintés {#touch}

| Gesztus | Eredmény |
| --- | --- |
| Koppintás | Kijelöl egy objektumot, és megmutatja a részleteit és a műveleteit |
| Koppintás hozzáadás közben | Csomópontot helyez el, vagy folytatja az elemet |
| Csomópont megérintése és húzása | Mozgatja a csomópontot |
| Egyujjas húzás máshol | A nézet mozgatása |
| Csíptetés | Nagyítás |
| A rajzfelület hosszan lenyomva tartása | A rajzfelület menüje |
| **Kijelölés téglalappal** gomb (jobb felül), majd húzás | Kijelölő téglalap; a rajzfelület menüje a Másolás és Törlés paranccsal ott nyílik meg, ahol felemeled az ujjad |

Amikor csomópontokat, elemeket vagy méretvonalakat adsz hozzá, beillesztesz, vagy kivágatot jelölsz ki egy képhez, a rajz tetején egy sáv mutatja a mód nevét, és van rajta egy **Mégse** gomb. <kbd>Esc</kbd> billentyű híján érintőképernyőn így léphetsz ki a módból.

## Objektumpanelek {#object-panels}

Egy objektumra kattintva vagy koppintva mellette megnyílik egy panel a részleteivel és ezekkel a műveletekkel:

| Objektum | Műveletek |
| --- | --- |
| Csomópont | Teher hozzáadása · Csomóponti támasz (támaszjel, Dx, Dz, Ry) · Csomóponti koordináta-rendszer szöge · Elmozdulás előírása (megtámasztott csomópontnál) · Törlés |
| Elem | Elem szerkesztése (végcsomópontok és csuklók, anyag, keresztmetszet) · Teher hozzáadása · Merevségi mátrix · Törlés |
| Csomóponti teher vagy rúdteher | Teher szerkesztése · Törlés |
| Méretvonal | Szerkesztés · Méretvonal átfordítása · Törlés |

A [Felhasználói felület](/hu/essentials/user-interface) oldal bemutatja a képernyőt, a beállítások [Vezérlés és billentyűparancsok](/hu/essentials/units-settings#controls-shortcuts) része pedig a nézet mozgatására szolgáló gombot választja ki.
