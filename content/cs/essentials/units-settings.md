---
description: "Nastavení EduBeamu: jazyk, jednotky SI nebo americké, formát čísel, osy z dolů nebo y nahoru, mřížka, styl a barvy průběhů a co se ukládá v prohlížeči."
source: site
---

# Jednotky a nastavení

Zvolte si jazyk, jednotky a osy, se kterými pracujete, a také vzhled výkresu. Nastavení mění jen to, jak se model zobrazuje a zadává: samotný model se vždy ukládá v jednotkách SI s osou z mířící dolů, takže se projekt i odkaz otevřou stejně při jakémkoli nastavení.

Nastavení otevřete třemi způsoby:

- záložkou **Nastavení** nad zobrazením – nastavení se pak zobrazí přes celou plochu místo modelu, a to na stránce *Jazyk a prostředí*; zpět se vrátíte záložkou **Konstrukce**;
- **štítkem jednotek** vpravo dole v zobrazení (`m m² kN kNm MPa`) – otevře se jako dialog na stránce *Jazyk a prostředí*;
- tlačítkem **Všechna nastavení** pod [možnostmi zobrazení](/cs/essentials/user-interface#display-options) – otevře se dialog na stránce *Nastavení zobrazení*.

Nastavení se ukládá v prohlížeči, takže vydrží i obnovení stránky. Tlačítko **Obnovit výchozí nastavení** pod seznamem stránek vrátí výchozí hodnoty: formát čísel, osy, tlačítko pro posun, jednotky vašeho regionu a všechna nastavení a možnosti zobrazení. Jazyk zůstane zachovaný. Obnovení nastavení nelze vzít zpět.

## Jazyk a prostředí {#language-locale}

![Nastavení → Jazyk a prostředí](/screenshots/cs/settings-language.webp)

**Jazyk.** Rozhraní je k dispozici v 18 jazycích; při první návštěvě se EduBeam řídí jazykem prohlížeče. Desetinný oddělovač se řídí zvoleným jazykem. Jazyk můžete čtenáři určit i odkazem: přidejte parametr `?lang=` s jedním z kódů `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn` (čínština), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`.

**Formát čísel.** Určuje, jak se zapisují výsledky v tabulkách a v popiscích po najetí myší: *Vědecký* (1,5 · 10⁴, výchozí), *Inženýrský* (15 · 10³) nebo *Automatický*. Viz [Formát čísel](/cs/essentials/results#number-format).

**Souřadnicový systém.** *x doprava, z dolů* (výchozí) nebo *x doprava, y nahoru*. Při volbě *x doprava, y nahoru* se svislá osa jmenuje y a míří nahoru a momenty se vztahují k ose z. Svislé souřadnice, síly, posuny, reakce a úhly podpor změní znaménko a všechny vstupy, tabulky, popisky i exporty používají nové názvy. Model, výkres i uložené soubory zůstanou přesně stejné. Viz [Osy s y nahoru](/cs/elements/conventions#y-up-axes).

![Trojkloubový rám s osou y nahoru: ukazatel os v rohu ukazuje osu y nahoru](/screenshots/cs/settings-y-up.webp){.shot-lg}

**Soustava jednotek.** Volba *SI (metrická)* nebo *Americká (imperiální)* nastaví naráz všechny jednotky. Při první návštěvě soustavu vybíráte v uvítacím dialogu. EduBeam vám americké jednotky nabídne jen tehdy, když má prohlížeč nastavené americké národní prostředí *a* počítač je v americkém časovém pásmu; jinde vždy nabídne SI. Když potom kteroukoli jednotku změníte, soustava se zobrazí jako *Vlastní*.

### Jednotky {#units}

Každá veličina má vlastní jednotku. Používají ji vstupy (jednotka je uvedená na konci pole), tabulky, popisky i hodnoty v průbězích a po změně jednotky se zobrazené hodnoty přepočítají. V modelu se nic nemění, takže přepínáním tam a zpět nic neztratíte.

| Veličina | Možnosti | SI | Americké |
| --- | --- | --- | --- |
| Délka (geometrie, poloha zatížení) | m, cm, mm, ft, in | m | ft |
| Rozměry průřezu | m, cm, mm, ft, in | m | in |
| Posun (výsledky, předepsaná posunutí) | m, cm, mm, ft, in | m | in |
| Plocha | m², cm², mm², ft², in² | m² | in² |
| Moment setrvačnosti | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Hmotnost | kg, lb | kg | lb |
| Síla | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Ohybový moment | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Napětí (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Teplota | °C, °F | °C | °F |

Některé jednotky vyplývají z ostatních:

- **Spojité zatížení** je síla na jednotku délky: kN/m v SI, kip/ft v amerických jednotkách.
- **Hustota** je hmotnost na délku³: kg/m³ nebo lb/ft³.
- **Součinitel teplotní roztažnosti** se řídí jednotkou teploty: 1/K nebo 1/°F. Teplotní zatížení jsou *změny* teploty, takže 10 °C odpovídá 18 °F.
- **Pootočení** jsou vždy v radiánech, úhly podpor ve stupních.

Tonf je metrická tuna-síla (1000 kgf), nikoli americká krátká tuna (short ton). Americké jednotky se převádějí podle přesných definic: 1 ft = 0,3048 m, 1 kip = 4448,2216 N. Stopy zadávejte jako desetinné číslo, například `5.5`; pravítka a zaměřovací kříž ukazují stopy a palce (5′-6″).

## Nastavení zobrazení {#viewer-settings}

Tady nastavíte vzhled výkresu. **Náhled zobrazení** vpravo ukazuje malý šikmý nosník, na kterém hned uvidíte každou změnu. Tlačítka pod ním určují, který výsledek náhled ukazuje; když změníte nastavení průběhu nebo barvu, náhled se na příslušný výsledek přepne sám.

![Nastavení → Nastavení zobrazení, vpravo živý náhled a nastavení průběhů](/screenshots/cs/b-settings-viewer.webp)

Levý sloupec shora:

- *Mřížka*: **Zobrazit mřížku** (<kbd>G</kbd>) vykreslí mřížku a pravítka; **Přichytávat k mřížce** (<kbd>S</kbd>) přichytí k mřížce uzly, které umisťujete nebo přetahujete; **Zobrazit zaměřovací kříž** vyznačí na pravítkách polohu ukazatele myši. Všechny tři volby jsou na začátku zapnuté. **Krok příchytu k mřížce** je 0,1 m, v amerických jednotkách 0,5 ft. Když přepnete mezi metrickými a americkými jednotkami, krok, který má ještě výchozí hodnotu, se změní na výchozí krok druhé soustavy; krok, který jste nastavili sami, zůstane.
- *Velikost*: **Měřítko výsledků** od 8 do 120 px (na začátku 48 px) udává, jak vysoko se vykreslí největší pořadnice průběhu nebo největší průhyb. Jde čistě o vzhled, protože každý průběh se škáluje podle své největší hodnoty. **Velikost podpor** je od 50 do 150 % (výchozí 100 %) a **Velikost písma** od 10 do 20 px (výchozí 14 px); na projektoru se hodí větší.
- *Orientace popisků výsledků*: hodnoty psané podél pořadnice, *Kolmo k vykreslení grafu* (výchozí), nebo *Vždy vodorovně*.
- *Kontrola modelu*: **Zobrazit, jak se nestabilní konstrukce může pohybovat** vykreslí čárkovaný obrys mechanismu a **Animovat pohyb** ho rozhýbe tam a zpět. Obě volby jsou na začátku zapnuté.

### Průběhy vnitřních sil {#internal-force-diagrams}

Na různých školách se průběhy kreslí různě, a proto si v EduBeamu můžete vybrat. Tato nastavení mění jen kresbu, nikdy hodnoty. **Čárkovaná čára** podél každého prvku označuje jeho dolní vlákna, tedy stranu, kam míří jeho lokální osa z (viz [Orientace prvku](/cs/essentials/elements#element-direction)).

| Nastavení | Možnosti | Výchozí |
| --- | --- | --- |
| **Ohybový moment** | kreslí se *Na tažené straně*, nebo *Na tlačené straně* | *Na tažené straně* |
| **Kladná posouvající síla** | *Opačná strana* (odvrácená od čárkované čáry), nebo *Čárkovaná strana* | *Opačná strana* |
| **Kladná normálová síla** | *Opačná strana* nebo *Čárkovaná strana* | *Opačná strana* |
| **Výplň** | *Plná*, *Šrafovaná* (čáry napříč prvkem jako při ručním kreslení) nebo *Žádná* | *Plná* |
| **Stupeň polynomu na úsecích** | ke každému úseku průběhu připíše stupeň polynomu, 0° až 3° | vypnuto |

Jak číst znaménka, vysvětluje stránka [Výsledky a průběhy](/cs/essentials/results#reading-the-sign).

### Barvy {#colors}

Samostatné barvy pro uzly, prvky, zatížení, deformovaný tvar, normálovou sílu, posouvající sílu, ohybový moment a reakce. Barvu vyberete kliknutím na vzorek. Výchozí barvy: zatížení oranžová, deformovaný tvar šedá, N modrá, V zelená, M červená, reakce fialová, uzly a prvky černá.

## Ovládání & zkratky {#controls-shortcuts}

**Posun zobrazení pomocí** určuje, kterým tlačítkem myši plátno posouváte: *Kolečko nebo pravé tlačítko* (výchozí), *Kolečko myši* (stiskněte kolečko a táhněte) nebo *Pravé tlačítko*. Všechny zkratky najdete na stránce [Klávesnice, myš a dotyk](/cs/reference/shortcuts).

## Co se ukládá v prohlížeči {#what-is-stored-in-your-browser}

Kromě nastavení si EduBeam v místním úložišti prohlížeče uchovává:

- **aktuální model** – ukládá se po každé změně, takže se po obnovení záložky nebo opětovném otevření aplikace vrátí;
- **Nedávné konstrukce** – posledních 10 modelů, které jste smazali nebo nahradili; obnovíte je z nabídky ☰.

Obojí patří jen k tomuto prohlížeči na tomto zařízení a smazáním dat webu zmizí. Pokud chcete model uchovat nebo přenést na jiné zařízení, použijte [Uložit projekt nebo Sdílet konstrukci](/cs/essentials/import-export).
