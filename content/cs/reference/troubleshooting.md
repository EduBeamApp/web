---
description: "Proč EduBeam nezobrazuje výsledky a jak to napravit: vysvětlení všech chyb a varování, podezřelé výsledky a soubory či odkazy, které nejdou otevřít."
source: site
---

# Řešení potíží

:span{#reseni-problemu}

Když model nelze vypočítat, EduBeam vám to oznámí hlášením vlevo nahoře v zobrazení a tlačítko **Zobrazit podrobnosti** vypíše všechny problémy. Vyberte nadpis dialogu, který jste viděli: u každého hlášení níže najdete, co znamená a jak ho odstranit.

::card-grid{cols="2"}
:::card{title="Model zatím nelze vypočítat" icon="lucide:circle-dashed" to="#still-needed"}
Modrý štítek **Chybí podpory**. Nic není špatně: konstrukce jen ještě není podepřená.
:::
:::card{title="Model nelze vypočítat" icon="lucide:circle-x" to="#errors"}
Červené hlášení. Podpory, které konstrukci nedrží, klouby, které z ní dělají mechanismus, prvek nulové délky.
:::
:::card{title="Varování k modelu" icon="lucide:triangle-alert" to="#warnings"}
Žluté hlášení. Model je vypočtený, ale něco nejspíš není tak, jak jste zamýšleli.
:::
:::card{title="Výsledky vypadají špatně" icon="lucide:scale" to="#results-look-wrong"}
Zatížení působí nahoru, průhyby se liší o řády, znaménko se zdá obrácené.
:::
::

## Hlášení {#messages}

### Co znamenají barvy {#read-the-message}

| Vidíte | Znamená to |
| --- | --- |
| Modrý štítek **Chybí podpory** | Model ještě není hotový. Přidejte podpory. Když na štítek najedete myší, čárkovaný obrys ukáže, jak se konstrukce ještě může pohybovat. |
| **Červené** hlášení | Něco brání výpočtu. Hlášení problém pojmenuje, a když je problémů víc, zní *Chyby v modelu: n*. Dotčené uzly jsou na výkrese zakroužkované. |
| **Žluté** hlášení | Varování. Model se přesto vypočítal. Když je varování víc, zní *Varování v modelu: n*. |
| *Není definovaný žádný materiál* / *Není definovaný žádný průřez* | Prvky potřebují obojí. Přidejte je tlačítkem **Přidat** vedle hlášení. |

**Zobrazit podrobnosti** otevře dialog nadepsaný *Model zatím nelze vypočítat*, *Model nelze vypočítat* nebo *Varování k modelu*. Jeho přepínač ukáže nebo skryje, jak se konstrukce může pohybovat, a odkaz **Řešení potíží** vede na tuto stránku.

![Dialog Model nelze vypočítat s přepínačem, který ukáže, jak se konstrukce může pohybovat](/screenshots/cs/ui-diagnostics.webp){.shot-lg}

Na výkrese:

- **✕** na červeném hlášení ho sbalí do malého štítku *Model nelze vypočítat*, aby na malé obrazovce zbylo místo. Kliknutím na štítek ho zase rozbalíte.
- Tlačítko s **okem** na červeném hlášení ukáže nebo skryje čárkovaný obrys pohybu. **Nastavení → Nastavení zobrazení → Kontrola modelu** obrys i jeho animaci vypne natrvalo.
- **✕** na žlutém hlášení varování skryje.

### Zbývá doplnit {#still-needed}

Model není špatně, jen ještě není hotový. Když na štítek najedete myší, uvidíte krátký text, dialog ukazuje dlouhý.

| Hlášení | Význam a náprava |
| --- | --- |
| *Konstrukce potřebuje podpory, jinak ji nelze vypočítat.* <br> *Aby byl model při 2D výpočtu stabilní, musí mít alespoň 3 podepřené stupně volnosti.* | Celkem méně než tři podepřené směry. Přidejte podpory. |
| *Část s uzly … potřebuje podpory.* <br> *Samostatná část konstrukce (uzly …) má méně než 3 podepřené stupně volnosti a může se volně pohybovat.* | Model se rozpadá na části a jedna z nich není ničím podepřená. Připojte ji ke zbytku, nebo ji podepřete. |
| *Podpory chybí u částí konstrukce: n.* | Nepodepřených částí je několik. Tlačítko **Zobrazit podrobnosti** je všechny vypíše. |

### Chyby {#errors}

Něco brání výpočtu. Červené hlášení ukazuje krátký text, dialog dlouhý.

| Hlášení | Význam a náprava |
| --- | --- |
| *Podpory konstrukci nezajišťují: stále se může posouvat vodorovně / posouvat svisle / volně otáčet / pohybovat jako tuhý celek.* <br> *Konstrukce má dostatek podpor, ale ty ji nezajišťují: stále se může …* | Vazeb je dost, ale všechny jsou rovnoběžné nebo se jejich nositelky protínají v jednom bodě, jako u tří posuvných kloubů na vodorovném nosníku. Čárkovaný obrys ukazuje pohyb; natočte nebo přesuňte jednu z podpor. |
| *Část s uzly … není zajištěna: stále se může …* <br> *Samostatná část konstrukce (uzly …) má dostatek podpor, ale ty ji nezajišťují: stále se může …* | Totéž pro jednu část modelu, který se rozpadá na části. |
| *Klouby v uzlu … umožňují konstrukci pohyb.* <br> *Podpory konstrukci drží, ale přesto je to mechanismus: její pruty se mohou otáčet kolem kloubů v uzlu …* | Klouby dovolují prutům vzájemné pootočení, jako u rámu se dvěma kloubovými patkami a s kloubem na hlavě každého sloupu nebo u kloubově spojeného čtverce bez diagonály. Odstraňte kloub, nebo přidejte prut či podporu. |
| *Konstrukce je nestabilní: pohybuje se téměř bez odporu.* <br> *Konstrukce je nestabilní – tyto pohyby nemají prakticky žádný odpor: vodorovný posun uzlu … (Dx) …* | Téměř mechanismus, nebo tuhost blízká nule. Dlouhé hlášení uvádí uzly a směry. Zkontrolujte podpory, klouby a hodnoty `E`, `A` a `Iy`. |
| *Konstrukce je mechanismus: může se pohybovat bez odporu.* <br> *Konstrukce je mechanismus: matice tuhosti je singulární.* | Něco se může volně pohybovat a předchozí kontroly to nezachytily. Ověřte, že je každá část zajištěna alespoň třemi vazbami a že koncové klouby nenechávají žádný prut volně otočný. |
| *Prvek … má nulovou délku: uzly … a … leží ve stejném bodě.* | Dva uzly jednoho prvku leží na sobě. Jeden z nich přesuňte, nebo prvek smažte. |
| *Prvek … má na obou koncích stejný uzel.* | Prvek smažte a nakreslete ho znovu mezi dvěma různými uzly. |
| *Prvek … odkazuje na neexistující uzel / materiál / průřez …* | Objekt, který prvek používá, byl smazán, obvykle v ručně upraveném souboru projektu. V tabulce *Prvky* mu přiřaďte existující. |
| *Prvek … musí odkazovat právě na 2 uzly.* | Poškozený prvek v importovaném souboru. Smažte ho a nakreslete znovu. |
| *Uzlové zatížení č. n odkazuje na neexistující uzel …* <br> *Předepsané posunutí č. n odkazuje na neexistující uzel …* | Zatížení smažte, nebo mu přiřaďte existující uzel. |
| *Prvkové zatížení č. n odkazuje na neexistující prvek …* | Zatížení smažte. |
| *Výpočet selhal kvůli vnitřní nekonzistenci modelu.* | Obecná chyba. Vraťte poslední krok, nebo uložte projekt a [chybu nahlaste](#reporting-a-bug). |

### Varování {#warnings}

Model se přesto vypočítá, tato hlášení ale stojí za kontrolu:

| Hlášení | Význam a náprava |
| --- | --- |
| *Uzel … není připojen k žádnému prvku a výpočet jej ignoruje.* | Osamocený uzel. Smažte ho, nebo ho připojte. |
| *Uzel … je podepřen, ale nepřipojuje se k němu žádný prvek, takže podpora nic nepřenáší.* | Podpora na osamoceném uzlu. |
| *Uzlové zatížení č. n obsahuje neplatné hodnoty.* <br> *Předepsané posunutí č. n obsahuje neplatné hodnoty.* | Některá složka není číslo. Upravte zatížení. |

### Při úpravách {#while-editing}

Tato hlášení se během práce objeví v dialogovém okně prohlížeče a model zůstane beze změny:

| Hlášení | Význam a náprava |
| --- | --- |
| *Nejprve prosím přidejte materiál.* <br> *Nejprve prosím přidejte průřez.* | Prvek potřebuje obojí. Přidejte je v záložce *Materiály* nebo *Průřezy* a prvek nakreslete znovu. |
| *Vyberte prosím materiál a průřez.* | V dialogu **Přidat prvek** zůstalo prázdné pole. Vyberte obojí. |
| *Označení … je již použito.* | Dva uzly, prvky, materiály ani průřezy nemohou mít stejné označení. Zvolte jiné. |
| *Pro tento uzel již předepsané posunutí existuje. Nejprve jej prosím odstraňte.* | Uzel může mít jen jedno předepsané posunutí. Upravte to stávající, nebo ho nejprve smažte. |

## Nic se nevykresluje {#no-results-are-drawn}

Když se neobjeví žádný průběh, zkontrolujte postupně:

::div{.steps}

### Zkontrolujte možnosti zobrazení {#check-the-display-options}

Pokud nevidíte žádné hlášení, model je vypočtený: průběh může být jen vypnutý. Zaškrtněte **M<sub>y</sub>(x)** nebo jiný výsledek v možnostech zobrazení vpravo nahoře v zobrazení; pokud panel nevidíte, zobrazí ho tlačítko ⚙. Model bez zatížení má všude nulové výsledky, takže ani tehdy není co kreslit.

### Zkontrolujte podpory {#check-the-supports}

Řešič potřebuje alespoň tři podepřené směry a podpory musí společně zabránit tomu, aby se konstrukce posunula nebo otočila. Nosník na dvou posuvných kloubech má jen dva a ujede: jeden z nich změňte na **Kloub**. Ani tři rovnoběžné posuvné klouby nebo podpory, jejichž nositelky se protínají v jednom bodě, konstrukci neudrží. Viz [Uzly a podpory](/cs/essentials/nodes-supports#supports).

### Zkontrolujte, že jsou prvky propojené {#check-the-connections}

Dva uzly se stejnými souřadnicemi jsou pořád dva samostatné uzly a část, která se zbytku konstrukce dotýká jen tam, ve skutečnosti volně visí. Přebytečný uzel smažte a prvky znovu připojte. Když umisťujete uzel na prvek, odpovězte **Připojit ke konstrukci** a prvek se v tom místě rozdělí.

### Spočítejte klouby {#count-the-hinges}

Rám se dvěma kloubovými patkami a s kloubem na hlavě každého sloupu nebo čtverec z kloubově spojených prutů bez diagonály je mechanismus. EduBeam klouby zakroužkuje a čárkovaným obrysem ukáže pohyb. Viz [Koncové klouby](/cs/essentials/elements#end-hinges).

### Hledejte nulovou tuhost {#look-for-zero-stiffness}

`E`, `A` nebo `Iy` zadané jako 0 nebo ve špatné jednotce dovolí části konstrukce pohybovat se téměř bez odporu. EduBeam takovou konstrukci označí jako *nestabilní*.

::

## Výsledky vypadají špatně {#results-look-wrong}

| Příznak | Pravděpodobná příčina |
| --- | --- |
| Zatížení působí nahoru | Globální osa **z míří dolů**, takže kladné `Fz` nebo `fz` působí dolů a záporné hodnoty nahoru. S osami y nahoru je to naopak. Viz [Zatížení](/cs/essentials/loads#sign-convention-in-one-line). |
| Průhyb se liší o řády | Záměna jednotek: `E` zadané v Pa, ačkoli pole očekává MPa, nebo `Iy` v cm⁴, ačkoli pole očekává m⁴. Štítek jednotek vpravo dole v zobrazení uvádí jednotky všech polí. |
| Průhyb je o něco větší než podle učebnicového vzorce | Smyková deformace Timošenkova nosníku. Viz [Ověření výsledků ručně](/cs/guide/verification#shear-deformation). |
| Znaménko vypadá špatně | Znaménko čtěte z hodnoty, ne podle strany, na kterou je průběh vykreslený: kladný moment M znamená tah dole. Koncové síly ve *Výsledcích na prvcích* se řídí lokálními osami prvku, ne konvencí N-V-M. Viz [Jak číst znaménko](/cs/essentials/results#reading-the-sign). |
| Průběh je na „špatné“ straně | Strana je věcí nastavení zobrazení: ohybový moment na tažené, nebo tlačené straně, N a V na kterékoli straně čárkované čáry. **Nastavení → Nastavení zobrazení → Průběhy vnitřních sil**. |
| Dva stejné sloupy mají opačná znaménka posouvající síly | Znaménko V se řídí orientací každého prvku. Chcete-li je porovnat, u jednoho z nich prohoďte uzly. |
| Čísla jako `4 · 10¹` | Vědecký formát čísel. Zvolte *Automatický* v **Nastavení → Jazyk a prostředí → Formát čísel**. |
| Průběhy jsou obrovské nebo maličké | Jde jen o kresbu. Upravte **Měřítko výsledků** v **Nastavení → Nastavení zobrazení**. |
| Zatížení v lokálních osách míří špatným směrem | Lokální osa x prvku vede od jeho *počátečního* ke *koncovému* uzlu. Prohoďte uzly, nebo obraťte znaménko. |
| Zatížení šikmého prutu nesedí | **LCS** je ve výchozím stavu zaškrtnuté, takže `fz` působí kolmo k prutu. Pro svislé zatížení zaškrtnutí zrušte. |
| Teplotní zatížení nic nedělá | Staticky určitá konstrukce se při změně teploty volně deformuje a vnitřní síly v ní nevznikají. Pokud chybí i deformace, ověřte, že α není 0, a u nerovnoměrného oteplení také, že je zadaná výška průřezu $h$. |

## Soubory a odkazy {#files-and-links}

| Příznak | Náprava |
| --- | --- |
| *Soubor se nepodařilo importovat. Zkontrolujte prosím formát souboru.* | Soubor není projekt EduBeamu ani relace desktopového EduBeamu. Váš model zůstal beze změny. |
| *Tato relace programu EduBeam má několik zatěžovacích stavů, ale otevřít lze jen jeden.* | Relace desktopového EduBeamu s několika zatěžovacími stavy: EduBeam otevře první z nich a vypíše, které vynechal. |
| Sdílený odkaz místo toho otevře váš starý model | Odkaz se zkrátil nebo změnil, třeba když ho e-mailový klient zalomil. EduBeam odkaz, který nedokáže přečíst, ignoruje a váš model ponechá. Zkopírujte znovu celý odkaz. |
| Kratší odkaz se kolegovi neotevře | Jeho EduBeam je starší než verze 1.3.2. Ať aplikaci znovu načte, nebo sdílejte s vypnutou volbou **Kratší odkaz**. Viz [Sdílení odkazem](/cs/essentials/import-export#share-a-link). |

## Problémy s rozhraním {#interface-issues}

| Příznak | Náprava |
| --- | --- |
| Zkratky nic nedělají | Nejprve klikněte do výkresu: dokud má fokus textové pole, jednotlivé klávesy se ignorují. Na Macu použijte místo <kbd>Ctrl</kbd> klávesu <kbd>Cmd</kbd>. Viz [Klávesnice, myš a dotyk](/cs/reference/shortcuts). |
| <kbd>Delete</kbd> na Macu nic nedělá | Klávesa s popiskem *delete* na klávesnici Macu je Backspace. Stiskněte <kbd>Fn</kbd>+<kbd>Delete</kbd>. |
| Zobrazení nejde posunout | Posouvá se prostředním nebo pravým tlačítkem myši; které to bude, zvolíte v **Nastavení → Ovládání & zkratky**. Na touchpadu klikněte a táhněte dvěma prsty. Na dotykové obrazovce táhněte jedním prstem. |
| Můj model zmizel | Když otevřete odkaz, soubor nebo příklad, nebo když konstrukci smažete, starý model se uchová: **☰ → Nedávné konstrukce**, nebo <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Při otevření odkazu to EduBeam oznámí dole na obrazovce hlášením *Otevřena sdílená konstrukce. Předchozí najdete v Nedávných konstrukcích.* s tlačítkem **Zobrazit**. |
| Špatný jazyk | **Nastavení → Jazyk a prostředí**, nebo přidejte do adresy `?lang=cs`. |
| Změny nastavení se neuchovají | Místní úložiště je blokované, například v anonymním okně nebo v přísném režimu ochrany soukromí. Potřebuje ho nastavení, uložený model i Nedávné konstrukce. |

## Nahlášení chyby {#reporting-a-bug}

Založte [issue na GitHubu](https://github.com/janvorisek/edubeam/issues) a uveďte prohlížeč a operační systém, co jste udělali a co jste očekávali. Nejvíc pomůže **sdílený odkaz** nebo **soubor projektu**, na kterém se problém projeví.
