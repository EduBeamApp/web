---
description: "Výučba s EduBeamom: živé modely na projektore, odkazy v skriptách, domáce úlohy s kontrolou, generované príklady a písomky s kľúčom riešení."
source: site
---

# Výučba s EduBeamom

[EduBeam]{.edubeam} vznikol v posluchárni a tam sa mu aj najviac darí: model na projektore reaguje na každú zmenu a vďaka odkazu má ten istý model každý študent vo svojom notebooku. Na tejto stránke sme zhromaždili to, čo vyučujúci používajú najčastejšie, od prvej prednášky až po skúšku.

::card-grid{cols="2"}
:::card{title="Na prednáške" icon="lucide:presentation" to="#in-the-lecture"}
Model čitateľný aj z poslednej rady, ktorý upravujete naživo.
:::
:::card{title="Na prvom cvičení" icon="lucide:graduation-cap" to="#getting-students-started"}
Desať minút od prázdnej obrazovky k nosníku overenému ručne.
:::
:::card{title="V skriptách a zadaniach" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
Odkaz v PDF alebo na snímke otvorí celý model, aj o niekoľko rokov.
:::
:::card{title="Zadania s kontrolou" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
Najprv ručný výpočet, potom model ako kontrola.
:::
:::card{title="Precvičovanie a písomky" icon="lucide:file-check" to="#practice-and-test-papers"}
Generované úlohy s okamžitou kontrolou a písomky na tlač s kľúčom riešení.
:::
:::card{title="Cvičenia a prezentácie z kódu" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
Vlastné generátory príkladov a obrázky do prezentácií, vytvorené knižnicou @edubeam/plot.
:::
::

## Na prednáške {#in-the-lecture}

- **Zabezpečte čitateľnosť aj z poslednej rady.** V časti **Nastavenia → Nastavenia zobrazenia** zväčšite **Veľkosť písma** na 18 alebo 20 px (20 px je maximum) a **Veľkosť podpier** na 130–150 %. Ak priebehy stále vyzerajú malé, zväčšite **Mierku výsledkov**.
- **Ukazujte vždy iba jednu vec.** V možnostiach zobrazenia vpravo hore vypnite všetko okrem veličiny, o ktorej práve hovoríte, a ostatné pridávajte postupne.
- **Upravujte model naživo.** Presuňte podperu, zaškrtnite `Ry`, pridajte kĺb. Študenti hneď vidia príčinu aj následok a skratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> sa kedykoľvek vrátite späť.
- **Nechajte riešič vysvetliť mechanizmy.** Uvoľnite o jeden kĺb viac, než konštrukcia znesie, a EduBeam nakreslí, ako sa môže pohybovať, pohyb animuje a zakrúžkuje kĺby, ktoré ho spôsobujú. Je to dobrá príležitosť prebrať stabilitu. Oba prepínače nájdete v časti **Nastavenia → Nastavenia zobrazenia → Kontrola modelu**.
- **Používajte jazyk a osi svojich študentov.** EduBeam hovorí 18 jazykmi a v [Nastaveniach](/sk/essentials/units-settings) prepnete medzi jednotkami SI a americkými aj medzi osou z nadol a osou y nahor, aby všetko zodpovedalo vašim skriptám.

![Odhalený mechanizmus: kĺby v B a C umožňujú vodorovný posun rámu](/screenshots/sk/ui-mechanism.webp)

## Na prvom cvičení {#getting-students-started}

Pri prvej návšteve sa EduBeam študentov opýta, ako chcú začať a aké jednotky a osi chcú používať. Povedzte im vopred, ktoré jednotky a osi používate vo svojom predmete. Prehliadka (**Prehliadka aplikácie**), krátky sprievodca **Nakresliť prvý nosník** aj **Príklady** zostanú dostupné aj neskôr v ponuke **☰**.

Osvedčené prvé cvičenie: „Otvorte run.edubeam.app a zvoľte *Nakresliť prvý nosník*“, potom [Rýchly štart](/sk/guide/quick-start), zhruba desať minút s ručným overením na konci.

### Počítače v učebniach a práca offline {#offline-and-lab-computers}

EduBeam je progresívna webová aplikácia (PWA): len čo ju prehliadač raz načíta, funguje aj bez pripojenia a prehliadač môže ponúknuť, že ju nainštaluje ako bežný program. Model a nastavenia sa ukladajú zvlášť pre každý profil prehliadača, takže na zdieľaných počítačoch v učebniach by si študenti mali prácu odniesť ako súbor alebo odkaz. Podrobnosti nájdete v časti [Čo sa ukladá v prehliadači](/sk/essentials/units-settings#what-is-stored-in-your-browser).

## V skriptách a zadaniach {#in-lecture-notes-and-assignments}

Odkaz na zdieľanie obsahuje celý model, takže funguje všade, kam možno vložiť odkaz: v PDF, na snímke prezentácie, na stránke predmetu v LMS alebo v e-maile.

::div{.steps}

### Zostavte model {#share-build}

Pripravte ho tak, ako ho majú študenti prvýkrát vidieť: so zaťažením, popismi a priebehmi, ktoré chcete mať zapnuté.

### Skopírujte odkaz {#share-copy}

V hornej lište kliknite na **Zdieľať konštrukciu**. Ak sa má odkaz otvoriť s vašimi priebehmi, zaťažením a popismi, zapnite **Zobraziť to, čo vidím ja**. Potom kliknite na **Kopírovať odkaz**.

### Vložte ho do svojich materiálov {#share-paste}

Každý študent, ktorý odkaz otvorí, dostane vlastnú kópiu a môže s ňou ľubovoľne experimentovať. Nič z toho, čo zmení, sa nedostane k vám ani k nikomu inému. Odkazy fungujú naprieč verziami EduBeamu, takže vaše skriptá zostanú platné rok čo rok.

::

Pre výučbové materiály nechajte **Kratší odkaz** vypnutý: EduBeam, ktorý sa od pridania tejto voľby neaktualizoval, kratší tvar odkazu neotvorí, kým sa neaktualizuje.

| Odkaz | Otvorí |
| --- | --- |
| `run.edubeam.app/?model=…` | model pripravený na úpravy |
| `run.edubeam.app/?viewer=1&model=…` | model v režime iba na prezeranie, určený na [vloženie do stránky](/sk/essentials/import-export#embed-a-read-only-viewer) cez `<iframe>` |
| `run.edubeam.app/?panel=examples` | [galériu príkladov](/sk/examples/) |
| `run.edubeam.app/?lang=sk` | aplikáciu v slovenčine alebo v ktoromkoľvek [inom jazyku](/sk/essentials/import-export#url-parameters) |

::callout{type="warning" title="Odkaz nahradí model, ktorý má študent otvorený"}
Keď študent otvorí odkaz (a v niektorých prehliadačoch aj stránku s vloženým modelom), jeho doterajší model sa presunie do **☰ → Nedávne konštrukcie**, odkiaľ ho možno obnoviť. Napriek tomu študentom odporučte, aby si dôležitú prácu pred otvorením odkazov z výučby uložili cez **☰ → Uložiť projekt**.
::

## Zadania, ktoré si študenti skontrolujú sami {#assignments-students-can-check-themselves}

EduBeam dáva študentom okamžitú spätnú väzbu k ručnému výpočtu bez toho, aby úlohu vyriešil za nich.

- **Najprv počítať, potom kontrolovať.** Zadajte ručný výpočet reakcií, vnútorných síl a jedného posunutia a potom nechajte študentov zostaviť model a výsledky porovnať. Vzorce nájdete v kapitole [Ručné overenie výsledkov](/sk/guide/verification), celý postup ukazuje [Rýchly štart](/sk/guide/quick-start#_8-check-by-hand).
- **Pýtajte sa, prečo sa výsledok líši.** Šmykové deformácie, chýbajúci kĺb, zaťaženie zadané v lokálnych namiesto v globálnych osiach: každá z týchto príčin vysvetlí malý či veľký rozdiel a jeho dohľadanie naučí viac než samotná zhoda.
- **Vyžadujte model spolu s výpočtom.** Nech študenti k výpočtu priložia odkaz na zdieľanie alebo súbor `project.json`. Otvoríte ho a uvidíte presne to, čo namodelovali.
- **Úhľadné protokoly.** Študenti môžu výkres exportovať ako **SVG**, ktoré zostane ostré vo Worde aj v LaTeXe, a výsledky ako **CSV**. Pozrite si [Export obrázka](/sk/essentials/import-export#export-an-image).

## Hotové cvičenia {#ready-made-exercises}

- **[Príklady](/sk/examples/):** šesť modelov, ktoré otvoríte jedným kliknutím, ku každému otázky, na čo sa zamerať, a odpovede.
- **[Precvičovanie](/sk/practice):** generované nosníky, rámy a priehradové konštrukcie, ktoré študentom kontrolujú výsledky, a [Generátor písomiek](/sk/exam), ktorý z nich zostaví písomky na tlač. Viac [nižšie](#practice-and-test-papers).
- **[Návody](/sk/tutorials/inclined-beam):** šikmý nosník, trojkĺbový rám, rovinná priehradová konštrukcia a spojitý nosník s poklesom podpery, všetky zostavené krok za krokom a overené ručne. Hodia sa ako podklad na 15- až 20-minútové cvičenie.
- **[Ručné overenie výsledkov](/sk/guide/verification):** prípady s analytickým riešením, od konzoly po pokles podpery, vhodné ako rýchle kontrolné úlohy.

## Precvičovanie a písomky {#practice-and-test-papers}

Dve stránky tohto webu za vás pripravia úlohy zo statiky, bez inštalácie a bez programovania:

- **[Precvičovanie](/sk/practice)** dá študentom novú úlohu, kedykoľvek o ňu požiadajú. Študenti ju vyriešia na papieri, zadajú reakcie a najväčší ohybový moment alebo silu v prúte a stránka každú hodnotu porovná s presným riešením: odchýlka do 1 % sa uzná a hodnota so správnou veľkosťou, ale opačným smerom sa označí. **Nápoveď** ukáže, ako začať, a po vyriešení sa zobrazia priebehy. Každá úloha má kód, napríklad `H2048`, ktorý vždy označuje tú istú úlohu: ak ho uvediete v zadaní, všetci porovnávajú svoje výsledky s rovnakými číslami.
- **[Generátor písomiek](/sk/exam)** pripraví písomky na tlač: zvolíte typy konštrukcií, až 6 úloh na písomku a až 40 variantov a každý študent dostane iný variant. Všetky varianty majú rovnaké typy konštrukcií v rovnakom poradí, takže sú rovnako ťažké. Generátor pridá riadok na meno, miesto na výpočet a kľúč riešení a tlačidlo **Vytlačiť alebo uložiť ako PDF** ich vytlačí. Tlačidlo **Stiahnuť .zip** uloží všetky obrázky ako súbory SVG pre LaTeX a Word a výsledky ako tabuľku CSV na opravovanie.

Obe stránky ponúkajú rovnakých osem typov konštrukcií: šesť staticky určitých (prostý nosník, konzola, nosník s previslým koncom, Gerberov nosník, trojkĺbový rám a Warrenov priehradový nosník) a dve staticky neurčité (spojitý nosník s dvoma poľami a dvojkĺbový rám).

Generátor písomiek ukladá nastavenia do adresy stránky vrátane poľa **Číslo písomky**, ktoré určuje čísla v zadaní. Uložte si adresu medzi záložky a o rok dostanete rovnaké písomky aj s kľúčom. **Kódy úloh** sú na písomkách predvolene vypnuté: stránka Precvičovanie ukazuje riešenie, takže kódy patria do domácich úloh, kde si študenti prácu kontrolujú až po vypracovaní.

## Cvičenia, písomky a prezentácie z kódu {#exercise-sheets-tests-and-slides-from-code}

Obrázky na tomto webe kreslí [@edubeam/plot](/sk/plot), knižnica komponentov pre Vue, ktorá vykreslí ľubovoľný rovinný nosník, rám alebo priehradovú konštrukciu vyriešenú knižnicou [@edubeam/fem](/sk/solver), riešičom EduBeamu. Ak zvládnete trochu JavaScriptu, urobíte z niekoľkých riadkov kódu študijné materiály:

- **Vlastné typy príkladov.** Ak generátor písomiek neponúka konštrukcie, ktoré učíte, napíšte si vlastné: seed (počiatočná hodnota generátora) určí konštrukciu aj jej čísla, takže rovnaký seed dá vždy rovnaký príklad a z rovnakého seedu vznikne aj kľúč riešení.
- **Prezentácie, ktoré sa postupne skladajú.** Ukážte konštrukciu, potom podpery a zaťaženie, potom reakcie a nakoniec priebeh momentu, krok za krokom, bez toho, aby sa výkres medzi snímkami posunul. Takto vznikla [ukážková prednáška o priehradových konštrukciách](https://edubeam-slides.pages.dev).
- **Obrázky do skrípt a na stránky predmetu.** Ostré SVG, ktoré sa prispôsobí svetlému aj tmavému motívu stránky a na rozdiel od vloženej aplikácie nikdy nezmení vlastný model študenta.

Vyskúšajte si to. Každé stlačenie tlačidla **Nový príklad** vygeneruje nový príklad aj s kľúčom riešení:

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="Príklady a písomky" icon="lucide:file-check" to="/sk/plot/exercises"}
Zo seedu vygenerujete zadanie cvičenia aj s kľúčom riešení.
:::
:::card{title="Prezentácie a skriptá" icon="lucide:presentation" to="/sk/plot/slides"}
Obrázky, ktoré sa skladajú vrstvu po vrstve, do prezentácií aj skrípt.
:::
::
