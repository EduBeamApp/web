---
description: "Výuka s EduBeamem: živé modely na projektoru, odkazy ve skriptech, domácí úkoly s kontrolou, generované příklady a písemky s klíčem řešení."
source: site
---

# Výuka s EduBeamem

[EduBeam]{.edubeam} vznikl v posluchárně a tam se mu také daří nejlépe: model na projektoru reaguje na každou změnu a díky odkazu má tentýž model každý student ve svém notebooku. Na této stránce jsme shromáždili to, co vyučující používají nejčastěji, od první přednášky až po zkoušku.

::card-grid{cols="2"}
:::card{title="Na přednášce" icon="lucide:presentation" to="#in-the-lecture"}
Model čitelný i z poslední řady, který upravujete živě.
:::
:::card{title="Na prvním cvičení" icon="lucide:graduation-cap" to="#getting-students-started"}
Deset minut od prázdné obrazovky k nosníku ověřenému ručně.
:::
:::card{title="Ve skriptech a zadáních" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
Odkaz v PDF nebo na snímku otevře celý model, i za několik let.
:::
:::card{title="Zadání s kontrolou" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
Nejdřív ruční výpočet, potom model jako kontrola.
:::
:::card{title="Procvičování a písemky" icon="lucide:file-check" to="#practice-and-test-papers"}
Generované příklady s okamžitou kontrolou a písemky k tisku s klíčem řešení.
:::
:::card{title="Cvičení a prezentace z kódu" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
Vlastní generátory příkladů a obrázky do prezentací, napsané pomocí knihovny @edubeam/plot.
:::
::

## Na přednášce {#in-the-lecture}

- **Zajistěte čitelnost i z poslední řady.** V **Nastavení → Nastavení zobrazení** zvyšte **Velikost písma** na 18 nebo 20 px (20 px je maximum) a **Velikost podpor** na 130–150 %. Pokud průběhy pořád vypadají malé, zvětšete **Měřítko výsledků**.
- **Ukazujte vždy jen jednu věc.** V možnostech zobrazení vpravo nahoře vypněte vše kromě veličiny, o které právě mluvíte, a ostatní přidávejte postupně.
- **Upravujte model živě.** Přetáhněte podporu, zaškrtněte `Ry`, přidejte kloub. Studenti hned vidí příčinu i následek a zkratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> se kdykoli vrátíte.
- **Nechte řešič vysvětlit mechanismy.** Uvolněte o jeden kloub víc, než konstrukce snese, a EduBeam nakreslí, jak se může pohybovat, pohyb animuje a zakroužkuje klouby, které ho způsobují. Výborná příležitost probrat stabilitu. Oba přepínače najdete v **Nastavení → Nastavení zobrazení → Kontrola modelu**.
- **Používejte jazyk a osy svých studentů.** EduBeam umí 18 jazyků a v [Nastavení](/cs/essentials/units-settings) přepnete mezi jednotkami SI a americkými i mezi osou z dolů a osou y nahoru, aby vše odpovídalo vašim skriptům.

![Odhalený mechanismus: klouby v B a C umožňují vodorovný posun rámu](/screenshots/cs/ui-mechanism.webp)

## Na prvním cvičení {#getting-students-started}

Při první návštěvě se EduBeam studentů zeptá, jak chtějí začít a jaké jednotky a osy chtějí používat. Řekněte jim předem, které jednotky a osy používáte ve svém předmětu. Prohlídka (**Provést aplikací**), krátký průvodce **Nakreslit první nosník** i **Příklady** zůstávají na později v nabídce **☰**.

Osvědčené první cvičení: „Otevřete run.edubeam.app a zvolte *Nakreslit první nosník*“, potom [Rychlý start](/cs/guide/quick-start), zhruba deset minut s ručním ověřením na konci.

### Počítače v učebnách a práce offline {#offline-and-lab-computers}

EduBeam je progresivní webová aplikace (PWA): jakmile ji prohlížeč jednou načte, funguje i bez připojení a prohlížeč může nabídnout, že ji nainstaluje jako běžný program. Model a nastavení se ukládají zvlášť pro každý profil prohlížeče, takže na sdílených počítačích v učebnách by si studenti měli práci odnést jako soubor nebo odkaz. Podrobnosti najdete v části [Co se ukládá v prohlížeči](/cs/essentials/units-settings#what-is-stored-in-your-browser).

## Ve skriptech a zadáních {#in-lecture-notes-and-assignments}

Sdílený odkaz obsahuje celý model, takže funguje všude, kam lze vložit odkaz: v PDF, na snímku prezentace, na stránce předmětu v LMS nebo v e-mailu.

::div{.steps}

### Sestavte model {#share-build}

Připravte ho tak, jak ho mají studenti poprvé vidět: se zatížením, popisky a průběhy, které chcete mít zapnuté.

### Zkopírujte odkaz {#share-copy}

V horní liště klikněte na **Sdílet konstrukci**. Pokud se má odkaz otevřít s vašimi průběhy, zatížením a popisky, zapněte **Zobrazit to, co vidím já**. Pak klikněte na **Kopírovat**.

### Vložte ho do svých materiálů {#share-paste}

Každý student, který odkaz otevře, dostane vlastní kopii a může s ní libovolně experimentovat. Nic z toho, co změní, se nedostane k vám ani k nikomu jinému. Odkazy fungují napříč verzemi EduBeamu, takže vaše skripta zůstanou platná rok co rok.

::

Pro výukové materiály nechte **Kratší odkaz** vypnutý: kopie EduBeamu, která se neaktualizovala od doby, kdy tato volba přibyla, kratší tvar odkazu neotevře, dokud se neaktualizuje.

| Odkaz | Otevře |
| --- | --- |
| `run.edubeam.app/?model=…` | model připravený k úpravám |
| `run.edubeam.app/?viewer=1&model=…` | model v [režimu prohlížeče](/cs/essentials/import-export#embed-a-read-only-viewer) pro vložení do `<iframe>` |
| `run.edubeam.app/?panel=examples` | [galerii příkladů](/cs/examples/) |
| `run.edubeam.app/?lang=cs` | aplikaci v češtině nebo v kterémkoli [jiném jazyce](/cs/essentials/import-export#url-parameters) |

::callout{type="warning" title="Odkaz nahradí model, který má student otevřený"}
Když student otevře odkaz (a v některých prohlížečích i stránku s vloženým prohlížečem), jeho dosavadní model se přesune do **☰ → Nedávné konstrukce**, odkud ho lze obnovit. Přesto studentům doporučte, aby si důležitou práci před otevřením odkazů z výuky uložili přes **☰ → Uložit projekt**.
::

## Zadání, která si studenti zkontrolují sami {#assignments-students-can-check-themselves}

EduBeam dává studentům okamžitou zpětnou vazbu k ručnímu výpočtu, aniž by za ně postup řešení udělal sám.

- **Nejdřív počítat, potom kontrolovat.** Zadejte ruční výpočet reakcí, vnitřních sil a jednoho posunu a pak nechte studenty sestavit model a výsledky porovnat. Vzorce najdete v kapitole [Ověření výsledků ručně](/cs/guide/verification), celý postup ukazuje [Rychlý start](/cs/guide/quick-start#_8-check-by-hand).
- **Ptejte se, proč se výsledek liší.** Smyková deformace, chybějící kloub, zatížení zadané v lokálních místo v globálních osách: každá z těchto příčin vysvětlí malý či velký rozdíl a jeho dohledání naučí víc než samotná shoda.
- **Chtějte model spolu s výpočtem.** Ať studenti k výpočtu přiloží sdílený odkaz nebo soubor `project.json`. Otevřete ho a uvidíte přesně to, co namodelovali.
- **Zprávy na úrovni.** Studenti mohou výkres exportovat jako **SVG**, které zůstane ostré ve Wordu i v LaTeXu, a výsledky jako **CSV**. Viz [Export obrázku](/cs/essentials/import-export#export-an-image).

## Hotová cvičení {#ready-made-exercises}

- **[Příklady](/cs/examples/):** šest modelů, které otevřete jedním kliknutím, ke každému otázky, na co se zaměřit, a odpovědi.
- **[Procvičování](/cs/practice):** generované nosníky, rámy a příhradové konstrukce, které studentům kontrolují výsledky, a [Generátor písemek](/cs/exam), který z nich sestaví písemky k tisku. Viz [níže](#practice-and-test-papers).
- **[Návody](/cs/tutorials/inclined-beam):** šikmý nosník, trojkloubový rám, rovinná příhradová konstrukce a spojitý nosník s poklesem podpory, všechny sestavené krok za krokem a ověřené ručně. Poslouží jako podklad pro cvičení na 15 až 20 minut.
- **[Ověření výsledků ručně](/cs/guide/verification):** případy s analytickým řešením, od konzoly po pokles podpory, vhodné jako rychlé kontrolní úlohy.

## Procvičování a písemky {#practice-and-test-papers}

Dvě stránky tohoto webu za vás připraví úlohy ze statiky, bez instalace a bez programování:

- **[Procvičování](/cs/practice)** dá studentům novou úlohu, kdykoli o ni požádají. Studenti ji vyřeší na papíře, zadají reakce a největší ohybový moment nebo sílu v prutu a stránka každou hodnotu porovná s přesným řešením: odchylka do 1 % se uzná a hodnota se správnou velikostí, ale opačným směrem se označí. **Nápověda** ukáže, jak začít, a po vyřešení se zobrazí průběhy. Každá úloha má kód, například `H2048`, který vždy označuje tutéž úlohu: uvedete-li ho v zadání, všichni porovnávají své výsledky se stejnými čísly.
- **[Generátor písemek](/cs/exam)** připraví písemky k tisku: zvolíte typy konstrukcí, až 6 úloh na písemku a až 40 variant a každý student dostane jinou variantu. Všechny varianty mají stejné typy konstrukcí ve stejném pořadí, takže jsou stejně těžké. Generátor přidá řádek pro jméno, místo na výpočet a klíč řešení a tlačítko **Vytisknout nebo uložit jako PDF** je vytiskne. Tlačítko **Stáhnout .zip** uloží všechny obrázky jako soubory SVG pro LaTeX a Word a výsledky jako tabulku CSV pro opravování.

Obě stránky nabízejí stejných osm typů konstrukcí: šest staticky určitých (prostý nosník, konzola, nosník s převislým koncem, Gerberův nosník, trojkloubový rám a Warrenův příhradový nosník) a dvě staticky neurčité (spojitý nosník o dvou polích a dvoukloubový rám).

Generátor písemek ukládá nastavení do adresy stránky, včetně pole **Číslo písemky**, které určuje čísla v zadání. Uložte si adresu do záložek a příští rok dostanete stejné písemky i s klíčem. **Kódy úloh** jsou na písemkách ve výchozím stavu vypnuté: stránka Procvičování ukazuje řešení, takže kódy patří do domácích úkolů, kde si studenti práci kontrolují až po vypracování.

## Cvičení, písemky a prezentace z kódu {#exercise-sheets-tests-and-slides-from-code}

Obrázky na tomto webu kreslí [@edubeam/plot](/cs/plot), knihovna komponent pro Vue, která vykreslí libovolný rovinný nosník, rám nebo příhradovou konstrukci vyřešenou knihovnou [@edubeam/fem](/cs/solver), výpočetním jádrem EduBeamu. Pokud zvládnete trochu JavaScriptu, uděláte z několika řádků kódu studijní materiály:

- **Vlastní typy příkladů.** Když generátor písemek nenabízí konstrukce, které učíte, napište si vlastní: seed (počáteční hodnota generátoru) určí konstrukci i její čísla, takže stejný seed dá vždy stejný příklad a ze stejného seedu vznikne i klíč řešení.
- **Prezentace, které se postupně skládají.** Ukažte konstrukci, pak podpory a zatížení, pak reakce a nakonec průběh momentu, krok za krokem, aniž by se výkres mezi snímky posunul.
- **Obrázky do skript a na stránky předmětu.** Ostré SVG, které se přizpůsobí světlému i tmavému motivu stránky a na rozdíl od vložené aplikace nikdy nezmění studentův vlastní model.

Vyzkoušejte si to. Každé stisknutí tlačítka **Nový příklad** vygeneruje nový příklad i s klíčem řešení:

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="Cvičení a písemky" icon="lucide:file-check" to="/cs/plot/exercises"}
Ze seedu vygenerujete zadání cvičení i s klíčem řešení.
:::
:::card{title="Prezentace a skripta" icon="lucide:presentation" to="/cs/plot/slides"}
Obrázky, které se skládají vrstvu po vrstvě, do prezentací i skript.
:::
::
