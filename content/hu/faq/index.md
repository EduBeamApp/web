---
description: "Rövid válaszok az EduBeamről: ár, offline használat, adatvédelem, pontosság, az eredmények számítása, hivatkozás, gyakorló feladatok, megosztás és kód."
source: site
---

# Gyakran ismételt kérdések

Rövid válaszok, mindegyik mellett egy link arra az oldalra, amely a témát részletesen tárgyalja. Nem találod a kérdésedet? Nézd meg a [Hibaelhárítás](/hu/reference/troubleshooting) oldalt, vagy [kérdezz a GitHubon](https://github.com/janvorisek/edubeam/issues).

## Általános kérdések {#general}

### Mi az EduBeam? {#what-is-edubeam}

Ingyenes, nyílt forráskódú alkalmazás síkbeli tartók, keretek és rácsos tartók lineáris statikai számításához, hallgatóknak, oktatóknak és mérnököknek, akik azonnali visszajelzést szeretnének. A böngészőben fut. A [Bevezetés](/hu/guide/introduction) leírja, mire képes, és mire nem.

### Tényleg ingyenes? Kell hozzá fiók? {#is-it-really-free-do-i-need-an-account}

Igen, ingyenes, és nem, nem kell fiók. Nyisd meg a [run.edubeam.app](https://run.edubeam.app/?lang=hu){target="_blank"} oldalt, és kezdj modellezni: nem kell semmit telepíteni, és nincs használati korlát. A forráskód a [GitHubon](https://github.com/janvorisek/edubeam) érhető el, GPL-3.0 licenc alatt.

### Milyen böngészőkben és eszközökön működik? {#which-browsers-and-devices-work}

Bármely aktuális Chrome, Edge, Firefox vagy Safari böngészőben, számítógépen, táblagépen és telefonon. Érintőképernyőn koppintással jelölsz ki, egy csomópontot húzással mozgatsz, máshol húzva a nézetet mozgatod, két ujjal nagyítasz, hosszan lenyomva pedig a rajzfelület menüjét nyitod meg. Egérrel és billentyűzettel azért gyorsabb a modellezés. Lásd: [Billentyűzet, egér és érintés](/hu/reference/shortcuts#touch).

### Elveszett a modellem. Visszakaphatom? {#i-lost-my-model-can-i-get-it-back}

Valószínűleg igen. Ha egy modellt törölsz, vagy egy link, fájl vagy példa lecseréli, az EduBeam megőrzi a **☰ → Legutóbbi szerkezetek** között (az utolsó 10-et), a <kbd>Ctrl</kbd>+<kbd>Z</kbd> pedig visszavonja a cserét. Mindkettő csak ebben a böngészőben működik, így egy másik számítógépen vagy böngészőprofilban készült modell nincs ott. Lásd: [Legutóbbi szerkezetek](/hu/essentials/import-export#recent-structures).

### Használhatom offline? {#can-i-use-it-offline}

Igen. Az EduBeam progresszív webalkalmazás (PWA): ha a böngésződ egyszer betöltötte, kapcsolat nélkül is működik, és a böngésző felajánlhatja a telepítését. Amikor új verzió jelenik meg, egy ablak a frissítés előtt megkérdez.

### Hol tárolódnak az adataim? {#where-is-my-data-stored}

A böngésződben. Nincsenek fiókok és nincs felhőtárhely: az alkalmazás a modellt és a beállításokat ebben a böngészőben tárolja, a megosztási link pedig magában a linkben hordozza a modellt. Lásd: [Mit tárol a böngésződ](/hu/essentials/units-settings#what-is-stored-in-your-browser).

A run.edubeam.app alkalmazás ugyanakkor használati statisztikákat (Google Analytics) és hibajelentéseket (Sentry) gyűjt. Egy hibajelentés, valamint a Sentry által a munkamenetek egy részéről készített felvétel tartalmazhatja azt, ami a képernyőn volt, köztük a modelledet is.

### Hol gyakorolhatok statikai feladatokat? {#practice}

A [Gyakorlás](/hu/practice) oldalon. Minden alkalommal új számokkal kapsz egy tartót, keretet vagy rácsos tartót: papíron határozd meg a támaszerőket és a legnagyobb hajlítónyomatékot vagy egy rúderőt, írd be őket, az oldal pedig minden értéket azonnal ellenőriz. A [példákhoz](/hu/examples/) is tartoznak kérdések és megoldások. Az oktatók a [dolgozatkészítővel](/hu/exam) minden hallgatónak más dolgozatot nyomtathatnak megoldókulccsal; lásd: [Gyakorló feladatok és dolgozatok](/hu/guide/teaching#practice-and-test-papers).

### Hogyan hivatkozzak az EduBeamre? {#cite}

Szoftverként, a verziószámmal és a használat dátumával. A verziószám a **☰** menü alján található. Például:

> Voříšek, J. és közreműködők. *EduBeam*, 1.3.4-es verzió \[szoftver\]. https://edubeam.app (letöltés: 2026. november 18.).

Ha egy adott modellre szeretnél hivatkozni, add hozzá a [megosztási linkjét](/hu/essentials/import-export#share-a-link): minden olvasónak ugyanazt a modellt nyitja meg.

## Modellezés {#modelling}

### Hogyan készítsek befogást, csuklós vagy görgős támaszt? {#how-do-i-make-a-fixed-pinned-roller-support}

Kattints a csomópontra, válaszd a **Csomóponti támasz** lehetőséget, és kattints a jelre: csuklós támasz, görgős támasz, befogás, görgős befogás és mások. Vagy jelöld be a megtámasztott szabadságfokokat a **Csomópontok** fülön: a `Dx` + `Dz` + `Ry` befogás, a `Dx` + `Dz` csuklós támasz, a csak `Dz` görgős támasz. Az összes típust a [Csomópontok és támaszok](/hu/essentials/nodes-supports#supports) oldal sorolja fel.

### Hogyan készítsek rácsos tartót? {#how-do-i-make-a-truss}

Rajzold meg a rudakat közönséges elemekként, és tegyél mindegyik mindkét végére csuklót: jelöld be mindkét **Rúdvégi csuklók** mezőt az **Elemek** fülön, vagy jelöld be a **Csukló a kezdőpontban** és a **Csukló a végpontban** mezőt a felső sávban, mielőtt egérrel megrajzolod a rudakat. A terheket a csomópontokban add meg. A [rácsos tartó oktatóanyaga](/hu/tutorials/truss) lépésről lépésre felépít egyet.

### Hogyan tegyek csuklót egy keretbe? {#how-do-i-put-a-hinge-in-a-frame}

Tegyél csuklót annak az elemnek a végére, amelynek szabadon kell elfordulnia: jelöld be a rúdvégi csuklóját az **Elemek** fülön. A csukló egy elemvéghez tartozik, így egy több elemet összekötő csomópontban az egyik elem csuklója nem változtat a többi elem merev kapcsolatán. Lásd: [Rúdvégi csuklók](/hu/essentials/elements#end-hinges).

### Hogyan adjak támaszt vagy koncentrált erőt egy tartó közepére? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Támaszhoz vegyél fel egérrel egy csomópontot a tartón (a kurzor ikonos **Csomópont hozzáadása** gombbal), és válaszd a **Bekötés a szerkezetbe** lehetőséget: a tartó ebben a csomópontban kettéválik, és ott megtámaszthatod. Koncentrált erőhöz nem kell csomópont: adj az elemhez egy **Koncentrált teher** típusú terhet, és állítsd be a helyét a kezdő csomóponttól mérve. Lásd: [Csomópont elhelyezése meglévő elemen](/hu/essentials/nodes-supports#placing-a-node-on-an-existing-element) és [Koncentrált teher](/hu/essentials/loads#concentrated-load).

### Megadhatom az önsúlyt? {#can-i-apply-self-weight}

Automatikusan nem: az anyag sűrűségét a statikai számítás nem használja. Add meg egyenletesen megoszló teherként: $f_z = \rho g A$, például egy IPE 200-ra $7850 \cdot 9{,}81 \cdot 28{,}48 \cdot 10^{-4} = 219$ N/m, vagyis 0,22 kN/m.

### Modellezhetek ferde támaszokat? {#can-i-model-inclined-supports}

Igen. Add meg a csomópontnál a **Csomóponti koordináta-rendszer szöge** értéket, és a csomópont támaszai az elforgatott tengelyek mentén működnek. Lásd: [Ferde támaszok](/hu/essentials/nodes-supports#inclined-skewed-supports).

### Dolgozhatok amerikai mértékegységekkel? {#can-i-work-in-us-customary-units}

Igen. Kattints a nézet jobb alsó sarkában lévő mértékegységek gombjára, amely a **Beállítások → Nyelv és területi beállítások** oldalt nyitja meg, és állítsd a **Mértékegységrendszer** értékét **Amerikai (angolszász)** értékre a lábhoz és a kiphez, vagy válaszd ki egyenként a mértékegységeket. A modellt az EduBeam SI-ben tárolja, így a mértékegység váltása csak a megjelenített értékeket számítja át, a modellt sosem változtatja meg. Lásd: [Mértékegységek és beállítások](/hu/essentials/units-settings).

### Vannak terhelési esetek vagy teherkombinációk? {#are-there-load-cases-or-combinations}

Nincsenek, egy modellben egy terhelési eset van. Minden esetet ments külön fájlba vagy linkbe, és az eredményeket magad kombináld. Az asztali EduBeam több terhelési esetet tartalmazó munkamenete az elsővel nyílik meg, és egy üzenet felsorolja a kimaradtakat.

### Miért mutatnak felfelé a terheim? {#why-do-my-loads-point-up}

Valószínűleg negatív értéket adtál meg. Az EduBeamben a globális z tengely **lefelé** mutat, így a pozitív `fz` vagy `Fz` lefelé ható, gravitációs teher: a lefelé mutató 12 kN/m-es teher `fz = 12`. Lásd: [Tengelyek és előjelszabály](/hu/elements/conventions#loads). Ha a kurzusodon a függőleges tengely felfelé mutat, válts az **x jobbra, y felfelé** beállításra a **Beállítások → Nyelv és területi beállítások → Koordináta-rendszer** alatt: a bemenetek és az eredmények ezután ezt a tengelyt követik.

## Eredmények {#results}

### Miért nincs „Számítás” gomb? {#why-is-there-no-solve-button}

Mert az EduBeam minden módosítás után újraszámítja a modellt. Ha nem jelennek meg eredmények, a modell még nem számítható, és a rajzfelületen megjelenő üzenet megmondja, miért. Hogy mit érdemes ellenőrizni, azt a [Hibaelhárítás](/hu/reference/troubleshooting#no-results-are-drawn) oldal sorolja fel.

### Miért tér el kicsit a lehajlásom a képlettől? {#why-does-my-deflection-differ-slightly-from-the-formula}

Az EduBeam Timoshenko-gerendaelemeket használ, így a lehajlás tartalmazza a nyírási alakváltozást, amelyet a tankönyvi képletek általában elhanyagolnak. Karcsú tartónál a különbség 1 % körüli, a [Gyors kezdés](/hu/guide/quick-start#_8-check-by-hand) kézzel ki is számítja. Statikailag határozatlan szerkezetben a nyírási merevség az igénybevételeket is kissé módosítja. Bővebben az [Eredmények ellenőrzése kézi számítással](/hu/guide/verification) oldalon.

### Mennyire pontosak az eredmények? Kell több elem? {#how-accurate-are-the-results-do-i-need-more-elements}

Lineáris statikában a gerendaelem az EduBeam minden tehertípusára pontos, így rudanként egy elem elég, és nincs finomítandó háló. Csomópontot csak ott vegyél fel, ahol támaszra, csuklóra, keresztmetszet-váltásra, csomóponti teherre vagy leolvasandó elmozdulásra van szükséged. Lásd: [Pontosság](/hu/essentials/results#precision-and-accuracy).

### Hogyan számítja az EduBeam az eredményeket? {#how-does-edubeam-compute-the-results}

A végeselem-módszer elmozdulásmódszerével – azzal, amelyet a Tartók statikája tárgyban tanítanak –, a böngésződben. A [Hogyan számít az EduBeam](/hu/elements/analysis) oldal minden lépést végigvesz egy kis példán, amelyet kézzel is megismételhetsz, maga a számítómag pedig nyílt forráskódú: [@edubeam/fem](/hu/solver).

### Megnézhetem a merevségi mátrixokat? {#can-i-see-the-stiffness-matrices}

Igen. Az **Elemek** fülön az elem sorában lévő mátrix gomb megnyitja a 6 × 6-os merevségi mátrixát globális tengelyekben és SI mértékegységekben (N, m). Ha a nézetben egy elemre kattintasz, a megjelenő menüben is megtalálod a **Merevségi mátrix** lehetőséget. A levezetését a [gerendaelem](/hu/elements/beam#global-stiffness-matrix) oldal tartalmazza.

### Hol találom a támaszerőket? {#where-are-the-reactions-listed}

A nézetben, nyilakként az értékeikkel: a megjelenítési beállítások **Támaszerők** kapcsolója alapértelmezés szerint be van kapcsolva. Megtalálod őket az **Eredmények → CSV exportálása** által mentett fájlban és abban is, amit a **Másolás** a vágólapra tesz. Az **Eredmények** fül a csomóponti elmozdulásokat és az elemek rúdvégi erőit sorolja fel. Lásd: [Eredmények és igénybevételi ábrák](/hu/essentials/results).

## Fájlok és megosztás {#files-sharing}

### Hogyan oszthatok meg egy modellt? {#how-do-i-share-a-model}

Nyomd meg a **Szerkezet megosztása**, majd a **Másolás** gombot. A link a teljes modellt tartalmazza, és aki megnyitja, saját, szerkeszthető másolatot kap: élő közös szerkesztés nincs. Kapcsold be az **Úgy, ahogy én látom** lehetőséget, hogy a link a te ábráiddal és felirataiddal nyíljon meg. Lásd: [Link megosztása](/hu/essentials/import-export#share-a-link), kurzusokhoz pedig: [Tanítás az EduBeammel](/hu/guide/teaching#in-lecture-notes-and-assignments).

### Beágyazhatok egy modellt a weboldalamba vagy a diáimba? {#can-i-embed-a-model-on-my-website-or-in-slides}

Igen. Fűzd hozzá a `&viewer=1` paramétert egy megosztási linkhez, és tedd egy `<iframe>`-be: lásd: [Nézet beágyazása](/hu/essentials/import-export#embed-a-read-only-viewer). Weboldalra, diára vagy nyomtatott jegyzetbe szánt statikus ábrához exportálj SVG-t, vagy rajzold meg kódból a [@edubeam/plot](/hu/plot) segítségével.

### Exportálhatok képeket vagy táblázatokat? {#can-i-export-images-or-tables}

Igen. A **☰ → Kép exportálása** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) a rajzot PNG vagy SVG formátumban menti, a választott méretben vagy léptékben. Az **Eredmények → CSV exportálása** mindkét eredménytáblázatot menti, a **Másolás** pedig táblázatkezelőhöz készen a vágólapra teszi őket. Lásd: [Kép exportálása](/hu/essentials/import-export#export-an-image).

### Megnyithatom az asztali EduBeam fájljait? {#can-i-open-files-from-the-desktop-edubeam}

Igen. Az asztali EduBeam 2.x–3.5 verzióiban mentett munkameneteket (`.xml`) a **☰ → Projekt megnyitása** menüponttal vagy az alkalmazásra húzva nyithatod meg, ugyanúgy, mint egy `project.json` fájlt. Az értékeket kN-ban, kPa-ban és m-ben értelmezve olvassa be. Lásd: [Projekt megnyitása](/hu/essentials/import-export#open-a-project).

### Generálhatok modelleket programból? {#can-i-generate-models-programmatically}

Igen, kétféleképpen:

- **Írd meg a fájlt.** A `project.json` SI mértékegységekben megadott sima JSON, így bármilyen nyelvű szkript elkészítheti, az EduBeam pedig a **Projekt megnyitása** paranccsal vagy ráhúzással megnyitja. Lásd: [a projektfájl formátuma](/hu/essentials/import-export#project-file-format).
- **Számítsd ki kódban.** A [@edubeam/fem](/hu/solver) az EduBeam végeselemes számítómagja JavaScript- és TypeScript-könyvtárként. Az eredményt ezután a [@edubeam/plot](/hu/plot) rajzolja meg, például [generált feladatlapként](/hu/plot/exercises).

A [Gyors kezdés](/hu/guide/quick-start) tartója SI mértékegységekben:

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // csuklós támasz
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // görgős támasz
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, lefelé

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 54000 N·m a támaszköz közepén
beam.computeLocalDefl(lc, 2).w[1] // 0.0502 m a támaszköz közepén
```

## Támogatás {#support}

### Hogyan jelenthetek be hibát vagy javasolhatok új funkciót? {#how-do-i-report-a-bug-or-request-a-feature}

Nyiss egy issue-t a [GitHubon](https://github.com/janvorisek/edubeam/issues), és csatolj egy megosztási linket vagy projektfájlt, amely mutatja a problémát. Nem nyilvános kérdéseiddel írj a [support@edubeam.app](mailto:support@edubeam.app) címre.
