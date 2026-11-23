---
description: "Mi az EduBeam: ingyenes végeselemes program síkbeli tartókhoz, keretekhez és rácsos tartókhoz a böngészőben. Mire képes, mire nem, kinek szól, és hogyan épül fel az útmutató."
source: site
---

# Bevezetés

Az [EduBeam]{.edubeam} ingyenes statikai program **tartók, keretek és rácsos tartók** számításához, amely a böngésződben fut. Megrajzolod a szerkezetet, megtámasztod és megterheled, a végeselemes számítómag pedig minden módosítás után újraszámolja az ábrákat, a támaszerőket és a lehajlásokat. Nincs *Számítás* gomb, nem kell semmit telepíteni, és fiókot sem kell létrehozni.

::div{.actions}
[Az EduBeam indítása ↗](https://run.edubeam.app/?lang=hu){target="_blank"} [Gyors kezdés, 10 perc](/hu/guide/quick-start)
::

![Háromcsuklós keret az EduBeamben: a terhek narancssárgák, a támaszerők lilák, a hajlítónyomaték piros, a deformált alak szürke](/screenshots/hu/hero.webp)

:span{#your-first-visit}

## Mire képes {#what-it-does}

::card-grid{cols="2"}
:::card{title="Szerkezetek" icon="lucide:triangle" to="/hu/essentials/elements"}
Tartók, többtámaszú tartók, keretek és rácsos tartók az x–z síkban, Timoshenko-gerendaelemekből felépítve. Rúdvégi csuklókkal az elemből rácsrúd lesz.
:::
:::card{title="Támaszok" icon="lucide:anchor" to="/hu/essentials/nodes-supports#supports"}
A támaszt jele alapján választod ki: csuklós, görgős, befogás, görgős befogás, vagy a gátolt `Dx`, `Dz` és `Ry` tetszőleges kombinációja. Ezen felül ferde támaszok és támaszsüllyedés.
:::
:::card{title="Terhek" icon="lucide:arrow-down-to-line" to="/hu/essentials/loads"}
Erők és nyomatékok a csomópontokban vagy a rúd bármely pontján, egyenletesen megoszló és trapéz alakú vonalmenti terhek, hőmérsékleti teher és előírt elmozdulások.
:::
:::card{title="Keresztmetszetek" icon="lucide:shapes" to="/hu/essentials/elements#cross-sections"}
Európai és amerikai szelvénykönyvtárak, vagy bármilyen általad rajzolt sokszög. Az alkalmazás kiszámítja az $A$, $I_y$, $I_z$, $I_{yz}$ értékeket, a főtengelyeket és az inerciasugarakat.
:::
:::card{title="Eredmények" icon="lucide:chart-spline" to="/hu/essentials/results"}
**N**, **V** és **M** ábrák, deformált alak, támaszerők, csomóponti elmozdulások, rúdvégi erők és az elemek merevségi mátrixai.
:::
:::card{title="Számítás" icon="lucide:calculator" to="/hu/elements/analysis"}
Lineáris statika, a lineáris modellre pontos: nincs finomítandó háló. Ha a szerkezet labilis, az EduBeam elmagyarázza, miért, és animálja a mozgását.
:::
:::card{title="Fájlok" icon="lucide:folder-open" to="/hu/essentials/import-export"}
Projektek JSON-ban, teljes modellek linkként, rajzok PNG vagy SVG formátumban, eredmények CSV-ben. A lecserélt modellek nem vesznek el, és semmi sem hagyja el az eszközödet.
:::
:::card{title="Mértékegységek" icon="lucide:ruler" to="/hu/essentials/units-settings"}
SI vagy amerikai mértékegységek egy kattintással, vagy mennyiségenként külön. Lefelé mutató z tengely, vagy a tankönyvek felfelé mutató y tengelye.
:::
::

## Mire nem képes (még) {#what-it-does-not-do-yet}

Ha az elején ismered a korlátokat, időt spórolsz:

::div{.limits}
- **Csak síkbeli.** A szerkezet csak a saját síkjában dolgozik, térbeli kereteket nem modellezhetsz.
- **Csak lineáris statika.** Nincs másodrendű (P–Δ) hatás, kihajlás, dinamika és képlékenység.
- **Egy terhelési eset.** Nincsenek teherkombinációk és burkolóábrák: minden esetet ments külön fájlba vagy linkbe.
- **Nincs önsúly.** Add meg vonalmenti teherként.
- **Nincs méretezés.** Az EduBeam igénybevételeket és elmozdulásokat ad; a szabvány szerinti ellenőrzés a te feladatod.
::

Ha hiányzik egy funkció, amelyre szükséged volna, [nyiss egy issue-t a GitHubon](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## Kinek szól? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Hallgatók" icon="lucide:graduation-cap" to="/hu/practice"}
Azonnali visszajelzés a kézi számításokra, és gyakorló feladatok, amelyek menet közben ellenőrzik a válaszaidat.
:::
:::card{title="Oktatók" icon="lucide:presentation" to="/hu/guide/teaching"}
Mutasd meg élőben, kivetítőn, 22 nyelven, hogyan változtatják meg a támaszok, a csuklók és a terhek az igénybevételeket, és nyomtass minden hallgatónak más dolgozatot.
:::
:::card{title="Mérnökök" icon="lucide:hard-hat" to="/hu/elements/analysis"}
Gyors ellenőrzés, mielőtt megnyitnál egy nagyobb asztali programot; a megoldás minden lépése dokumentálva van.
:::
:::card{title="Fejlesztők" icon="lucide:code-xml" to="#libraries"}
Az EduBeam mögött álló számítómag és rajzoló modul, nyílt forráskódú könyvtárakként a saját kódodhoz.
:::
::

## Eligazodás az útmutatóban {#how-this-guide-is-organised}

Az oldalsáv az alábbiak szerint csoportosítja az oldalakat. Az alkalmazás **?** gombjai az útmutató megfelelő oldalát nyitják meg, a te nyelveden.

::card-grid{cols="2"}
:::card{title="Első lépések" icon="lucide:flag" to="/hu/guide/quick-start"}
Ez az oldal és a Gyors kezdés: az első tartó tíz perc alatt.
:::
:::card{title="Modellezés" icon="lucide:pencil-ruler" to="/hu/essentials/user-interface"}
A felület, a csomópontok és támaszok, az elemek, anyagok és keresztmetszetek, a terhek, a mértékegységek és a beállítások.
:::
:::card{title="Eredmények" icon="lucide:chart-spline" to="/hu/essentials/results"}
Az ábrák és az eredménytáblázatok, és hogyan ellenőrizheted őket kézi számítással.
:::
:::card{title="Megosztás és tanítás" icon="lucide:share-2" to="/hu/essentials/import-export"}
Projektfájlok, megosztási linkek, kép- és CSV-exportálás, valamint tanítás az EduBeammel.
:::
:::card{title="Oktatóanyagok" icon="lucide:triangle" to="/hu/tutorials/inclined-beam"}
Ferde tartó, háromcsuklós keret, síkbeli rácsos tartó és többtámaszú tartó süllyedő támasszal, mindegyik lépésről lépésre felépítve és kézi számítással ellenőrizve.
:::
:::card{title="Példák" icon="lucide:library" to="/hu/examples/"}
Hat kész modell, amelyek egy kattintással megnyílnak, feladatokkal és megoldásokkal.
:::
:::card{title="Elméleti háttér" icon="lucide:sigma" to="/hu/elements/conventions"}
Tengelyek és előjelszabály, a gerenda- és a rácsrúdelem, és hogyan számítja ki az EduBeam a modellt.
:::
:::card{title="Súgó" icon="lucide:life-buoy" to="/hu/reference/shortcuts"}
Billentyűzet, egér és érintés, hibaelhárítás és GYIK.
:::
::

## Saját eszközök készítése {#libraries}

Az EduBeam két nyílt forráskódú könyvtárra épül, amelyeket ez az oldal is dokumentál. Velük szkriptből számíthatsz szerkezeteket, minden hallgatónak más feladatot generálhatsz, vagy ábrákat rajzolhatsz diákhoz és jegyzetekhez.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/hu/solver"}
Az EduBeam végeselemes számítómagja TypeScriptben: egy tartót nagyjából egy tucat sorban modellezel, számítasz ki és olvasol ki, a böngészőben vagy Node-ban.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/hu/plot"}
Vue 3 komponensek, amelyek a kiszámított szerkezetet SVG-ként rajzolják meg a terheivel, a támaszerőivel és az N, V, M ábráival.
:::
::

## Nyelvek {#languages}

Az EduBeam 22 nyelven beszél, és a böngésződ nyelvén indul. Átválthatod a **Beállítások → Nyelv és területi beállítások** menüben, vagy itt:

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-hu"} Magyar](https://run.edubeam.app/?lang=hu){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-ro"} Română](https://run.edubeam.app/?lang=ro){target="_blank"}
- [:icon{name="circle-flags:lang-sk"} Slovenčina](https://run.edubeam.app/?lang=sk){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-el"} Ελληνικά](https://run.edubeam.app/?lang=el){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

A nyelvet egy link is kiválaszthatja az olvasó helyett: a `run.edubeam.app/?lang=hu` magyarul nyitja meg az alkalmazást.

## Szerzők és köszönetnyilvánítás {#authors-credits}

Az [EduBeam]{.edubeam} alkalmazást [Jan Voříšek](https://github.com/janvorisek) fejleszti független projektként. Az asztali, Windowsra és Linuxra készült EduBeam nyomdokain halad, amelyet [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) és [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) hozott létre a [prágai Cseh Műszaki Egyetem (ČVUT) Építőmérnöki Karának](https://www.fsv.cvut.cz/en) Mechanika Tanszékén, és ma is megnyitja annak munkamenet-fájljait. Számítómagja, a [@edubeam/fem](/hu/solver), Bořek Patzák első változatából nőtt ki. Az alkalmazás és a számítómag is nyílt forráskódú, GPL-3.0 licenc alatt.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Vezető fejlesztő és terméktervező","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Fejlesztő: érintéses vezérlés, rajzolási teljesítmény, terhek és támaszok","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"Az eredeti EduBeam és az első végeselemes számítómag","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Közreműködés {#contribute}

::card-grid{cols="3"}
:::card{title="Hiba bejelentése" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Valami zavaros, hibás vagy nem működik? Egy GitHub-issue eljut a csapathoz.
:::
:::card{title="Fordítás javítása" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Az alkalmazás szövegei nyelvenként egy-egy fájlban vannak; szívesen fogadunk pull requestet.
:::
:::card{title="Add tovább" icon="lucide:share-2"}
Mutasd meg az EduBeamet a csoporttársaidnak és a kollégáidnak, vagy tegyél egy modell-linket a jegyzeteidbe.
:::
::
