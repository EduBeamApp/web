---
description: "Miért nem mutat eredményt az EduBeam, és hogyan javíthatod: minden hiba- és figyelmeztető üzenet magyarázata, gyanús eredmények, valamint meg nem nyíló fájlok és linkek."
source: site
---

# Hibaelhárítás

Ha egy modell nem számítható, az [EduBeam]{.edubeam} a nézet bal felső sarkában megjelenő üzenetben megmondja, miért, a **Részletek** gomb pedig minden problémát teljes szövegével felsorol. Keresd meg alább a megjelent ablak címét: minden üzenetnél leírjuk, mit jelent, és hogyan javíthatod.

::card-grid{cols="2"}
:::card{title="Még nem számítható" icon="lucide:circle-dashed" to="#still-needed"}
Kék **Támaszok hiányoznak** címke. Nincs semmi baj: a szerkezet egyszerűen még nincs megtámasztva.
:::
:::card{title="A modell nem számítható" icon="lucide:circle-x" to="#errors"}
Piros üzenet. Támaszok, amelyek nem rögzítik a szerkezetet, mechanizmust okozó csuklók, nulla hosszúságú elem.
:::
:::card{title="Figyelmeztetések" icon="lucide:triangle-alert" to="#warnings"}
Sárga üzenet. A modell kiszámítható, de valami valószínűleg nem úgy van, ahogy szeretted volna.
:::
:::card{title="Gyanús eredmények" icon="lucide:scale" to="#results-look-wrong"}
Felfelé ható terhek, nagyságrendekkel eltérő lehajlások, megfordultnak tűnő előjel.
:::
::

## Üzenetek {#messages}

### Mit jelentenek a színek {#read-the-message}

| Amit látsz | Amit jelent |
| --- | --- |
| Kék **Támaszok hiányoznak** címke | A modell még nincs kész. Adj hozzá támaszokat. Mutass a címkére, és szaggatott körvonal mutatja, hogyan mozdulhat még el a szerkezet. |
| **Piros** üzenet | Valami megakadályozza a számítást. Az üzenet megnevezi a problémát, vagy ha több van, ez áll benne: *Hibák a modellben: n*. Az érintett csomópontokat az EduBeam bekarikázza a rajzon. |
| **Sárga** üzenet | Figyelmeztetések. A modell ennek ellenére kiszámítható volt. Ha több van, ez áll benne: *Figyelmeztetések a modellben: n*. |
| *Nincs megadva anyag.* / *Nincs megadva keresztmetszet.* | Az elemekhez mindkettő kell. Add hozzá a hiányzót az üzenet melletti **Új hozzáadása** gombbal. |

A **Részletek** megnyitja az ablakot, amelynek címe *Még nem számítható*, *A modell nem számítható* vagy *Figyelmeztetések*. A benne lévő kapcsoló megjeleníti vagy elrejti, hogyan mozdulhat el a szerkezet, a **Hibaelhárítás** link pedig ide vezet.

![A modell nem számítható ablak a kapcsolóval, amely megmutatja, hogyan mozdulhat el a szerkezet](/screenshots/hu/ui-diagnostics.webp){.shot-lg}

A rajzon:

- A piros üzenet **✕** gombja egy kis *A modell nem számítható* címkévé csukja össze, hogy kis képernyőn helyet adjon. Kattints a címkére a kibontásához.
- A piros üzenet **szem** gombja megjeleníti vagy elrejti a mozgás szaggatott körvonalát. A **Beállítások → Megjelenítés beállításai → Modell ellenőrzése** véglegesen kikapcsolja a körvonalat és az animációját.
- A sárga üzenet **✕** gombja elrejti a figyelmeztetéseket.

### Még hiányzik {#still-needed}

A modell nem hibás, csak még nincs kész. A rövid szöveget a címkére mutatva látod, a hosszút az ablakban.

| Üzenet | Jelentés és megoldás |
| --- | --- |
| *A szerkezetet meg kell támasztani, mielőtt kiszámítható.* <br> *Ahhoz, hogy a modell síkbeli számításban stabil legyen, legalább 3 megtámasztott szabadságfok kell.* | Összesen háromnál kevesebb a megtámasztott irány. Adj hozzá támaszokat. |
| *Támaszokra van szüksége a résznek, amelyhez ezek a csomópontok tartoznak: …* <br> *A szerkezet egy különálló részének (csomópontok: …) 3-nál kevesebb megtámasztott szabadságfoka van, így szabadon elmozdulhat.* | A modell több darabból áll, és az egyik „lebeg”. Kösd össze a többivel, vagy támaszd meg. |
| *Támaszra váró szerkezetrészek: n.* | Több darab „lebeg”. A **Részletek** felsorolja őket. |

### Hibák {#errors}

Valami megakadályozza a számítást. A piros üzenet a rövid szöveget mutatja, az ablak a hosszút.

| Üzenet | Jelentés és megoldás |
| --- | --- |
| *A támaszok nem rögzítik a szerkezetet: még mindig képes vízszintesen eltolódni / függőlegesen elmozdulni / szabadon elfordulni / merev testként elmozdulni.* <br> *A szerkezetnek elég támasza van, de ezek nem rögzítik: még mindig képes …* | Elég kényszer van, de mind párhuzamos, vagy a hatásvonalaik egy pontban metszik egymást, mint három görgős támasz egy vízszintes tartó alatt. A szaggatott körvonal mutatja a mozgást; forgasd el vagy helyezd át az egyik támaszt. |
| *A rész nincs rögzítve (csomópontok: …): még mindig képes …* <br> *A szerkezet egy különálló részének (csomópontok: …) elég támasza van, de ezek nem rögzítik: még mindig képes …* | Ugyanez egy több darabból álló modell egyik darabjára. |
| *A csomópont csuklói miatt a szerkezet elmozdulhat (csomópont: …).* <br> *A támaszok rögzítik a szerkezetet, de az mégis mechanizmus: rúdjai elfordulhatnak a csomópont csuklói körül (csomópont: …).* | A csuklók miatt a rudak elfordulhatnak egymáshoz képest, mint egy csuklós talpú keretben, amelynek mindkét oszlopfején is csukló van, vagy egy csuklósan kapcsolt rudakból álló, átló nélküli négyzetben. Távolíts el egy csuklót, vagy adj hozzá egy rudat vagy támaszt. |
| *A szerkezet labilis: szinte ellenállás nélkül elmozdul.* <br> *A szerkezet labilis, ezek a mozgások gyakorlatilag ellenállás nélkül jönnek létre: csomópont … vízszintesen (Dx) …* | Majdnem mechanizmus, vagy nullához közeli merevség. A hosszú üzenet megnevezi a csomópontokat és az irányokat. Ellenőrizd a támaszokat, a csuklókat és az `E`, `A` és `Iy` értékét. |
| *A szerkezet mechanizmus: ellenállás nélkül elmozdulhat.* <br> *A szerkezet mechanizmus: a merevségi mátrix szinguláris.* | Valami szabadon elmozdulhat, amit a fenti ellenőrzések nem szűrtek ki. Ellenőrizd, hogy minden részét legalább három kényszer rögzíti-e, és hogy a rúdvégi csuklók nem hagynak-e szabadon elfordulni egy rudat. |
| *Elem …: a hossza nulla, mert a végcsomópontjai (…, …) ugyanabban a pontban vannak.* | Egy elem két csomópontja egymáson fekszik. Mozgasd el az egyiket, vagy töröld az elemet. |
| *Elem …: mindkét végén ugyanaz a csomópont van.* | Töröld az elemet, és rajzold meg újra két különböző csomópont között. |
| *Elem …: nem létező csomópontra / anyagra / keresztmetszetre hivatkozik (…).* | A használt objektumot törölték, általában kézzel szerkesztett projektfájlban. Rendelj hozzá egy létezőt az *Elemek* táblázatban. |
| *Elem …: pontosan 2 csomópontra kell hivatkoznia.* | Hibás elem egy importált fájlban. Töröld, és rajzold meg újra. |
| *Csomóponti teher #n: nem létező csomópontra hivatkozik (…).* <br> *Előírt elmozdulás #n: nem létező csomópontra hivatkozik (…).* | Töröld a terhet, vagy rendelj hozzá egy létező csomópontot. |
| *Rúdteher #n: nem létező elemre hivatkozik (…).* | Töröld a terhet. |
| *A számítás a modell belső ellentmondása miatt nem sikerült.* | Általános hiba. Vond vissza az utolsó lépést, vagy mentsd a projektet, és [jelentsd be](#reporting-a-bug). |

### Figyelmeztetések {#warnings}

A modell ennek ellenére kiszámítható, de ezeket ellenőrizd:

| Üzenet | Jelentés és megoldás |
| --- | --- |
| *Csomópont …: egyetlen elemhez sem kapcsolódik, ezért a számítás figyelmen kívül hagyja.* | Kóbor csomópont. Töröld, vagy kösd be. |
| *Csomópont …: meg van támasztva, de egyetlen elem sem csatlakozik hozzá, így a támasz semmit sem visel.* | Támasz egy kóbor csomóponton. |
| *Csomóponti teher #n: érvénytelen értékeket tartalmaz.* <br> *Előírt elmozdulás #n: érvénytelen értékeket tartalmaz.* | Egy összetevő nem szám. Szerkeszd a terhet. |

### Szerkesztés közben {#while-editing}

Ezek munka közben felugró böngészőablakban jelennek meg, a modell pedig változatlan marad:

| Üzenet | Jelentés és megoldás |
| --- | --- |
| *Előbb adj hozzá egy anyagot.* <br> *Előbb adj hozzá egy keresztmetszetet.* | Az elemhez mindkettő kell. Add hozzá az *Anyagok* vagy a *Keresztmetszetek* fülön, majd rajzold meg újra az elemet. |
| *Válassz anyagot és keresztmetszetet.* | Az **Elem hozzáadása** ablakban egy mező üres. Válaszd ki mindkettőt. |
| *Ez a jelölés már foglalt: ….* | Két csomópont, elem, anyag vagy keresztmetszet nem kaphatja ugyanazt a jelölést. Válassz másikat. |
| *Ehhez a csomóponthoz már tartozik előírt elmozdulás. Előbb töröld azt.* | Egy csomóponthoz egy előírt elmozdulás tartozhat. Szerkeszd a meglévőt, vagy előbb töröld. |

## Semmi sem jelenik meg {#no-results-are-drawn}

Ha egyetlen ábra sem jelenik meg, ebben a sorrendben ellenőrizd:

::div{.steps}

### A megjelenítési beállítások ellenőrzése {#check-the-display-options}

Ha egyáltalán nincs üzenet, a modell ki van számítva: lehet, hogy az ábra egyszerűen ki van kapcsolva. Jelöld be az **M<sub>y</sub>(x)** mezőt vagy egy másik eredményt a nézet jobb felső sarkában lévő megjelenítési beállításokban; a felettük lévő ⚙ gomb jeleníti meg a panelt. A teher nélküli modellnek mindenhol nulla az eredménye, így annál sincs mit rajzolni.

### A támaszok ellenőrzése {#check-the-supports}

A számítómagnak legalább három megtámasztott irány kell, és a támaszoknak együtt meg kell akadályozniuk, hogy a szerkezet eltolódjon vagy elforduljon. Egy két görgős támaszon nyugvó tartónak csak kettő van, és elcsúszik: az egyiket változtasd **csuklós támaszra**. Három párhuzamos görgős támasz, vagy olyan támaszok, amelyek hatásvonalai egy pontban metszik egymást, szintén nem rögzítik a szerkezetet. Lásd: [Csomópontok és támaszok](/hu/essentials/nodes-supports#supports).

### Az elemek kapcsolatának ellenőrzése {#check-the-connections}

Két azonos koordinátájú csomópont is két külön csomópont, és az a rész, amely csak ott érintkezik a többivel, szabadon „lebeg”. Töröld a fölösleges csomópontot, és kösd be újra az elemeket. Ha egy elemre helyezel csomópontot, válaszd a **Bekötés a szerkezetbe** lehetőséget, hogy az elem ott kettéváljon.

### Számold meg a csuklókat {#count-the-hinges}

Egy csuklós talpú keret, amelynek mindkét oszlopfején is csukló van, vagy egy csuklósan kapcsolt rudakból álló, átló nélküli négyzet mechanizmus. Az EduBeam bekarikázza a csuklókat, és szaggatott körvonallal végigvezeti a mozgást. Lásd: [Rúdvégi csuklók](/hu/essentials/elements#end-hinges).

### Nulla merevség keresése {#look-for-zero-stiffness}

Ha az `E`, `A` vagy `Iy` értéke 0, vagy rossz mértékegységben adtad meg, a szerkezet egy része szinte ellenállás nélkül elmozdulhat. Az EduBeam ezt *labilisként* jelzi.

::

## Gyanús eredmények {#results-look-wrong}

| Tünet | Valószínű ok |
| --- | --- |
| A terhek felfelé hatnak | A globális **z tengely lefelé mutat**, így a pozitív `Fz` vagy `fz` lefelé hat, a negatív értékek felfelé. Felfelé mutató y tengelynél fordítva. Lásd: [Terhek](/hu/essentials/loads#sign-convention-in-one-line). |
| A lehajlás nagyságrendekkel eltér | Mértékegység-tévesztés: az `E`-t Pa-ban adtad meg, miközben a mező MPa-t vár, vagy az `Iy`-t cm⁴-ben, miközben m⁴-t vár. A nézet jobb alsó sarkában lévő mértékegységek gombja minden mező mértékegységét mutatja. |
| A lehajlás kicsit nagyobb, mint a tankönyvi képlet szerint | A Timoshenko-gerenda nyírási alakváltozása. Lásd: [Eredmények ellenőrzése kézi számítással](/hu/guide/verification#shear-deformation). |
| Rossznak tűnik egy előjel | Az előjelet az értékből olvasd le, ne abból, melyik oldalra van rajzolva az ábra: a pozitív M alul húzott. Az *Elemek eredményei* rúdvégi erői az elem lokális tengelyeit követik, nem az N-V-M előjelszabályt. Lásd: [Az előjel leolvasása](/hu/essentials/results#reading-the-sign). |
| Az ábra a „rossz” oldalon van | Az, hogy melyik oldalra rajzolódik, megjelenítési beállítás: a hajlítónyomaték a húzott vagy a nyomott oldalon, az N és a V a szaggatott vonal bármelyik oldalán. **Beállítások → Megjelenítés beállításai → Igénybevételi ábrák**. |
| Két egyforma oszlop nyíróereje ellentétes előjelű | A V előjele minden elem irányát követi. Az összevetéshez cseréld fel az egyik csomópontjait. |
| `4 · 10¹`-hez hasonló számok | Tudományos számformátum van beállítva. Válaszd az *Automatikus* lehetőséget a **Beállítások → Nyelv és területi beállítások → Számformátum** alatt. |
| Az ábrák óriásiak vagy aprók | Ez csak a rajzot érinti. Állítsd be az **Eredmények léptéke** értékét a **Beállítások → Megjelenítés beállításai** alatt. |
| Lokális tengelyekben megadott teher rossz irányba mutat | Az elem lokális x tengelye a *kezdő*csomóponttól a *vég*csomópont felé mutat. Cseréld fel a csomópontokat, vagy fordítsd meg az előjelet. |
| Ferde rúd terhe hibásnak tűnik | Az **LCS** alapértelmezés szerint be van jelölve, így az `fz` merőleges a rúdra. Függőleges teherhez vedd ki a jelölését. |
| A hőmérsékleti tehernek nincs hatása | Egy statikailag határozott szerkezet a hőmérséklet hatására szabadon, igénybevételek nélkül alakváltozik. Ha alakváltozást sem látsz, ellenőrizd, hogy az α nem 0-e, hőmérséklet-különbségnél pedig azt, hogy meg van-e adva a keresztmetszet $h$ magassága. |

## Fájlok és linkek {#files-and-links}

| Tünet | Megoldás |
| --- | --- |
| *A fájlt nem sikerült importálni. Ellenőrizd a fájl formátumát.* | A fájl sem EduBeam-projekt, sem asztali EduBeam-munkamenet. A modelled változatlan. |
| *Ebben az EduBeam-munkamenetben több terhelési eset van, de egyszerre csak egy nyitható meg.* | Az asztali EduBeam több terhelési esetet tartalmazó munkamenete: az EduBeam az elsőt nyitja meg, és felsorolja a kimaradtakat. |
| Egy megosztási link helyette a régi modelledet nyitja meg | A link megcsonkult vagy megváltozott, például mert egy levelezőprogram több sorba tördelte. Az EduBeam figyelmen kívül hagyja az olvashatatlan linket, és megtartja a modelledet. Másold ki újra a teljes linket. |
| Egy rövidebb link nem nyílik meg egy kollégádnál | Az ő EduBeam-példánya régebbi az 1.3.2-es verziónál. Elég, ha újratölti az alkalmazást, vagy oszd meg kikapcsolt **Rövidebb link** mellett. Lásd: [Link megosztása](/hu/essentials/import-export#share-a-link). |

## A felület problémái {#interface-issues}

| Tünet | Megoldás |
| --- | --- |
| A billentyűparancsok nem működnek | Előbb kattints a rajzra: az egybillentyűs parancsokat a program figyelmen kívül hagyja, amíg egy szövegmező aktív. Macen a <kbd>Ctrl</kbd> helyett használd a <kbd>Cmd</kbd> billentyűt. Lásd: [Billentyűzet, egér és érintés](/hu/reference/shortcuts). |
| Macen nem működik a <kbd>Delete</kbd> | A Mac billentyűzetén a *delete* feliratú billentyű valójában Backspace. Nyomd meg az <kbd>Fn</kbd>+<kbd>Delete</kbd> kombinációt. |
| Nem tudom mozgatni a nézetet | A nézetet a középső vagy a jobb egérgombbal mozgatod; hogy melyikkel, azt a **Beállítások → Vezérlés és billentyűparancsok** alatt választhatod ki. Érintőpadon kattints és húzz két ujjal. Érintőképernyőn húzz egy ujjal. |
| Eltűnt a modellem | Egy link, fájl vagy példa megnyitása, valamint a törlés megőrzi a régi modellt: **☰ → Legutóbbi szerkezetek**, vagy <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Egy link ezt a megnyitásakor a képernyő alján jelzi is: *Megnyitottál egy megosztott szerkezetet. Az előzőt a Legutóbbi szerkezetek között találod.*, egy **Megjelenítés** gombbal. |
| Rossz a nyelv | **Beállítások → Nyelv és területi beállítások**, vagy add hozzá a `?lang=hu` paramétert a címhez. |
| A beállítások módosításai nem maradnak meg | A böngésző helyi tárolója (local storage) le van tiltva, például privát ablakban vagy szigorú adatvédelmi módban. A beállításoknak, a mentett modellnek és a Legutóbbi szerkezeteknek is szükségük van rá. |

## Hiba bejelentése {#reporting-a-bug}

Nyiss egy [issue-t a GitHubon](https://github.com/janvorisek/edubeam/issues), és írd meg, milyen böngészőt és operációs rendszert használsz, mit csináltál, és mit vártál. A leghasznosabb egy **megosztási link** vagy a problémát mutató **projektfájl**.
