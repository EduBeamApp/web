---
description: "Az EduBeam beállításai: nyelv, SI vagy amerikai mértékegységek, számformátum, lefelé mutató z vagy felfelé mutató y tengely, rács, az ábrák stílusa és színei, valamint amit az alkalmazás a böngésződben tárol."
source: site
---

# Mértékegységek és beállítások

Kiválaszthatod a nyelvet, a mértékegységeket és a tengelyeket, amelyekkel dolgozol, valamint a rajz megjelenését. A beállítások csak azt változtatják meg, hogyan jelenik meg és hogyan adod meg a modellt: maga a modell mindig SI-egységekben, lefelé mutató z tengellyel tárolódik, így egy projekt vagy link bármilyen beállítás mellett ugyanúgy nyílik meg.

A beállításokat háromféleképpen érheted el:

- a nézet fölötti **Beállítások** fül a modell helyén, teljes méretben jeleníti meg őket, a *Nyelv és területi beállítások* résznél; a **Szerkezet** fülre kattintva térhetsz vissza;
- a nézet jobb alsó sarkában lévő **mértékegységek gombja** (`m m² kN kNm MPa`) párbeszédablakként nyitja meg őket a *Nyelv és területi beállítások* résznél;
- a [megjelenítési beállítások](/hu/essentials/user-interface#display-options) alatti **További beállítások** a *Megjelenítés beállításai* résznél nyitja meg a párbeszédablakot.

A beállítások a böngésződben tárolódnak, és az oldal újratöltése után is megmaradnak. Az oldalak listája alatti **Beállítások visszaállítása** visszaállítja az alapértelmezéseket: a számformátumot, a tengelyeket, a nézet mozgatására szolgáló gombot, a régiódnak megfelelő mértékegységeket, valamint az összes megjelenítési beállítást. A nyelv nem változik. A visszaállítás nem vonható vissza.

## Nyelv és területi beállítások {#language-locale}

![Beállítások → Nyelv és területi beállítások](/screenshots/hu/settings-language.webp)

**Nyelv.** 22 nyelv; első alkalommal az EduBeam a böngésző nyelvét követi. A tizedesjel a nyelvtől függ. Egy link az olvasó számára is kiválaszthatja a nyelvet: add hozzá a `?lang=` paramétert a következők egyikével: `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (kínai), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`.

**Számformátum.** Hogyan íródnak ki az eredmények a táblázatokban és rámutatáskor: *Tudományos* (1,5 · 10⁴, az alapértelmezés), *Mérnöki* (15 · 10³) vagy *Automatikus*. Lásd: [Számformátum](/hu/essentials/results#number-format).

**Koordináta-rendszer.** *x jobbra, z lefelé* (az alapértelmezés) vagy *x jobbra, y felfelé*. Az *x jobbra, y felfelé* beállításnál a függőleges tengely neve y, felfelé mutat, a nyomatékok pedig a z tengelyre vonatkoznak. A függőleges koordináták, erők, elmozdulások, támaszerők és támaszszögek előjelet váltanak, és minden beviteli mező, táblázat, rámutatáskor megjelenő érték és export az új jelöléseket használja. A modell, a rajz és a mentett fájlok pontosan ugyanazok maradnak. Lásd: [Felfelé mutató y tengely](/hu/elements/conventions#y-up-axes).

![A háromcsuklós keret felfelé mutató y tengellyel: a sarokban lévő tengelyjel szerint az y felfelé mutat](/screenshots/hu/settings-y-up.webp){.shot-lg}

**Mértékegységrendszer.** Az *SI (metrikus)* vagy az *Amerikai (angolszász)* egyszerre állítja be az összes mértékegységet. Az első látogatáskor az üdvözlő párbeszédablakban választasz. Az EduBeam csak akkor javasol amerikai mértékegységeket, ha a böngésző amerikai területi beállítást használ, *és* a számítógép amerikai időzónában van; minden más esetben SI-t javasol. Ha utána bármelyik mértékegységet külön módosítod, a mértékegységrendszer értéke *Egyéni* lesz.

### Mértékegységek {#units}

Minden mennyiségnek saját mértékegysége van. Ezt használják a beviteli mezők (amelyek a mező végén mutatják), a táblázatok, a rámutatáskor megjelenő értékek és az ábrák feliratai, a mértékegység váltása pedig átszámítja a megjelenített értékeket. A modellben semmi sem változik, így oda-vissza váltogatva sem vész el semmi.

| Mennyiség | Választható | SI | Amerikai |
| --- | --- | --- | --- |
| Hossz (geometria, a terhek helyzete) | m, cm, mm, ft, in | m | ft |
| Keresztmetszet méretei | m, cm, mm, ft, in | m | in |
| Elmozdulás (eredmények, előírt támaszsüllyedések) | m, cm, mm, ft, in | m | in |
| Terület | m², cm², mm², ft², in² | m² | in² |
| Inercianyomaték | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Tömeg | kg, lb | kg | lb |
| Erő | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Hajlítónyomaték | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Feszültség (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Hőmérséklet | °C, °F | °C | °F |

Néhány mértékegység a többiből következik:

- A **vonal menti terhek** hosszegységre jutó erők: SI-ben kN/m, amerikai mértékegységekben kip/ft.
- A **sűrűség** térfogategységre jutó tömeg: kg/m³ vagy lb/ft³.
- A **hőtágulási együttható** a hőmérséklet mértékegységét követi: 1/K vagy 1/°F. A hőmérsékleti terhek hőmérséklet-*változások*, így 10 °C 18 °F-nek felel meg.
- Az **elfordulások** mindig radiánban, a támaszszögek fokban értendők.

A Tonf a metrikus tonnasúly (1000 kgf), nem az amerikai rövid tonna. Az amerikai mértékegységek pontos definíciójukkal szerepelnek: 1 ft = 0,3048 m, 1 kip = 4448,2216 N. A lábban megadott értékeket tizedes törtként írd be, például `5,5`; a vonalzók és a szálkereszt lábban és hüvelykben mutatják (5′-6″).

## Megjelenítés beállításai {#viewer-settings}

A rajz megjelenése. A jobb oldali **Megjelenítés előnézete** egy kis ferde tartó, amely minden módosítást azonnal megmutat; az alatta lévő gombokkal választhatod ki, melyik eredményt mutassa, és ha egy ábrabeállítást vagy színt módosítasz, az előnézet a megfelelő eredményre vált.

![Beállítások → Megjelenítés beállításai, jobbra az élő előnézettel és az ábrák beállításaival](/screenshots/hu/b-settings-viewer.webp)

A bal oldali oszlop, felülről lefelé:

- *Rács*: a **Rács megjelenítése** (<kbd>G</kbd>) megrajzolja a rácsot és a vonalzókat; az **Illesztés a rácshoz** (<kbd>S</kbd>) rácspontra teszi az elhelyezett vagy elhúzott csomópontokat; a **Szálkereszt megjelenítése** egér használatakor jelöli a vonalzókon a mutató helyét. Kezdetben mindhárom be van kapcsolva. A **Rácsillesztés lépésköze** 0,1 m, amerikai mértékegységekben 0,5 ft. Ha metrikus és amerikai mértékegységek között váltasz, a még alapértelmezett lépésköz a másik rendszer alapértelmezésére vált; az általad beállított lépésköz megmarad.
- *Méretek*: az **Eredmények léptéke**, 8 és 120 px között (kezdetben 48 px), azt adja meg, milyen magasra rajzolódik az ábra legnagyobb ordinátája vagy a legnagyobb lehajlás; ez tisztán vizuális beállítás, mert minden ábra a saját legnagyobb értékéhez van méretezve. A **Támaszok mérete** 50 és 150 % (100 %), a **Betűméret** 10 és 20 px (14 px) között állítható; projektornál a nagyobb érték segít.
- *Eredményfeliratok iránya*: *Merőleges az ábrára* (az alapértelmezés), vagyis az értékek az ordináta mentén olvashatók, vagy *Mindig vízszintes*.
- *Modell ellenőrzése*: a **Mutassa, hogyan mozdulhat el a labilis szerkezet** szaggatott körvonallal rajzolja meg a mechanizmust, **A mozgás animálása** pedig oda-vissza mozgatja. Kezdetben mindkettő be van kapcsolva.

### Igénybevételi ábrák {#internal-force-diagrams}

Az ábrákat iskolánként másként rajzolják, ezért az EduBeamben választhatsz. Ezek a beállítások csak a rajzot változtatják meg, az értékeket soha. Az elemek mentén húzott **szaggatott vonal** az alsó szálat jelöli, vagyis azt az oldalt, amerre a lokális z tengely mutat (lásd [Az elem iránya](/hu/essentials/elements#element-direction)).

| Beállítás | Választható | Alapértelmezés |
| --- | --- | --- |
| **Hajlítónyomaték** | *A húzott oldalon* vagy *A nyomott oldalon* rajzolva | *A húzott oldalon* |
| **Pozitív nyíróerő** | a szaggatott vonallal ellentétes oldalon (*Ellenkező oldalon*) vagy a szaggatott vonal oldalán (*Szaggatott oldalon*) rajzolva | *Ellenkező oldalon* |
| **Pozitív normálerő** | *Ellenkező oldalon* vagy *Szaggatott oldalon* | *Ellenkező oldalon* |
| **Kitöltés** | *Teli*, *Vonalkázott* (a rúdra merőleges vonalak, mint a kézi rajzon) vagy *Nincs* | *Teli* |
| **Szakaszonkénti fokszám** | az ábra minden szakaszára kiírja a polinom fokszámát, 0°-tól 3°-ig | kikapcsolva |

Az előjelek leolvasását az [Eredmények és igénybevételi ábrák](/hu/essentials/results#reading-the-sign) oldal magyarázza el.

### Színek {#colors}

Külön színt állíthatsz be a csomópontoknak, az elemeknek, a terheknek, a deformált alaknak, a normálerőnek, a nyíróerőnek, a hajlítónyomatéknak és a támaszerőknek. A színt a színmintára kattintva választhatod ki. Alapértelmezés szerint a terhek narancssárgák, a deformált alak szürke, az N kék, a V zöld, az M piros, a támaszerők lilák, a csomópontok és az elemek feketék.

## Vezérlés és billentyűparancsok {#controls-shortcuts}

A **Nézet mozgatása** azt állítja be, melyik egérgombbal húzhatod el a rajzfelületet: *Egérgörgő vagy jobb gomb* (az alapértelmezés), *Egérgörgő* (nyomd le a görgőt, és húzd) vagy *Jobb gomb*. Minden billentyűparancs a [Billentyűzet, egér és érintés](/hu/reference/shortcuts) oldalon található.

## Mit tárol a böngésződ {#what-is-stored-in-your-browser}

A beállításokon kívül az EduBeam a böngésző helyi tárolójában a következőket őrzi meg:

- az **aktuális modellt**, minden módosítás után mentve, így a lap újratöltése vagy az alkalmazás újbóli megnyitása visszahozza;
- a **Legutóbbi szerkezeteket**: az utolsó 10 törölt vagy lecserélt modellt, amelyeket a ☰ menüből visszaállíthatsz.

Mindkettő ehhez a böngészőhöz és ehhez az eszközhöz tartozik, és a webhely adatainak törlése eltávolítja őket. Ha meg akarsz tartani egy modellt, vagy át akarod vinni egy másik eszközre, használd a [Projekt mentése vagy a Szerkezet megosztása](/hu/essentials/import-export) parancsot.
