---
description: "Co je EduBeam: bezplatný MKP program v prohlížeči pro rovinné nosníky, rámy a příhradové konstrukce. Co umí a neumí, pro koho je a jak se vyznat v příručce."
source: site
---

# Úvod

[EduBeam]{.edubeam} je bezplatná aplikace pro statický výpočet **nosníků, rámů a příhradových konstrukcí**, která běží přímo v prohlížeči. Nakreslíte konstrukci, podepřete ji a zatížíte a řešič metodou konečných prvků přepočítá průběhy vnitřních sil, reakce i průhyby při každé vaší úpravě. Žádné tlačítko *Spočítat*, nic k instalaci a žádný účet.

::div{.actions}
[Spustit EduBeam ↗](https://run.edubeam.app/?lang=cs){target="_blank"} [Rychlý start za 10 minut](/cs/guide/quick-start)
::

![Trojkloubový rám v EduBeamu: zatížení oranžově, reakce fialově, ohybový moment červeně a deformovaný tvar šedě](/screenshots/cs/hero.webp)

:span{#your-first-visit}

## Co EduBeam umí {#what-it-does}

::card-grid{cols="2"}
:::card{title="Konstrukce" icon="lucide:triangle" to="/cs/essentials/elements"}
Nosníky, spojité nosníky, rámy a příhradové konstrukce v rovině x–z, sestavené z Timošenkových nosníkových prvků. Klouby na koncích udělají z prvku příhradový prut.
:::
:::card{title="Podpory" icon="lucide:anchor" to="/cs/essentials/nodes-supports#supports"}
Kloub, posuvný kloub, vetknutí, posuvné vetknutí nebo libovolná kombinace podepřených `Dx`, `Dz` a `Ry`, kterou vyberete podle značky. Šikmé podpory i poklesy podpor.
:::
:::card{title="Zatížení" icon="lucide:arrow-down-to-line" to="/cs/essentials/loads"}
Síly a momenty v uzlech i kdekoli na prvku, rovnoměrné a lichoběžníkové spojité zatížení, změna teploty a předepsaná posunutí.
:::
:::card{title="Průřezy" icon="lucide:shapes" to="/cs/essentials/elements#cross-sections"}
Evropské a americké knihovny nebo libovolný nakreslený polygon. Aplikace spočítá $A$, $I_y$, $I_z$, $I_{yz}$, hlavní osy i poloměry setrvačnosti.
:::
:::card{title="Výsledky" icon="lucide:chart-spline" to="/cs/essentials/results"}
Průběhy **N**, **V** a **M**, deformovaný tvar, reakce, posuny uzlů, koncové síly a matice tuhosti prvků.
:::
:::card{title="Výpočet" icon="lucide:calculator" to="/cs/elements/analysis"}
Lineární statika, pro lineární model přesná: síť tu není co zjemňovat. Když je konstrukce mechanismem, EduBeam vysvětlí proč a animací ukáže, jak se může pohybovat.
:::
:::card{title="Soubory" icon="lucide:folder-open" to="/cs/essentials/import-export"}
Projekty jako JSON, celé modely jako odkazy, výkresy v PNG nebo SVG, výsledky v CSV. Nahrazené modely aplikace uchovává a nic neopouští vaše zařízení.
:::
:::card{title="Jednotky" icon="lucide:ruler" to="/cs/essentials/units-settings"}
SI nebo americké jednotky jedním kliknutím, případně každá veličina zvlášť. Osa z dolů, nebo učebnicová osa y nahoru.
:::
::

## Co (zatím) neumí {#what-it-does-not-do-yet}

Když omezení znáte předem, ušetříte si čas:

::div{.limits}
- **Pouze 2D.** Žádné chování mimo rovinu, žádné prostorové rámy.
- **Pouze lineární statika.** Žádné účinky II. řádu (P–Δ), vzpěr, dynamika ani plasticita.
- **Jeden zatěžovací stav.** Žádné kombinace ani obálky: každý zatěžovací stav uložte do samostatného souboru nebo odkazu.
- **Bez vlastní tíhy.** Zadejte ji jako spojité zatížení.
- **Bez posudků.** EduBeam spočítá vnitřní síly a posuny; posouzení podle norem je na vás.
::

Pokud vám nějaká funkce chybí, [založte issue na GitHubu](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## Pro koho je EduBeam určen {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Studenti" icon="lucide:graduation-cap" to="/cs/practice"}
Okamžitá zpětná vazba k ručním výpočtům a úlohy k procvičení, které vaše výsledky hned kontrolují.
:::
:::card{title="Vyučující" icon="lucide:presentation" to="/cs/guide/teaching"}
Na projektoru živě ukážete, jak podpory, klouby a zatížení mění vnitřní síly, a to v 22 jazycích. Každému studentovi navíc vytisknete jinou písemku.
:::
:::card{title="Inženýři" icon="lucide:hard-hat" to="/cs/elements/analysis"}
Rychlá kontrola dřív, než otevřete rozsáhlejší desktopový program. Každý krok řešení je popsaný v dokumentaci.
:::
:::card{title="Vývojáři" icon="lucide:code-xml" to="#libraries"}
Řešič a vykreslování, na kterých EduBeam stojí, jako open-source knihovny pro váš vlastní kód.
:::
::

## Jak se v příručce vyznat {#how-this-guide-is-organised}

V postranním panelu jsou stránky seskupené takto. Tlačítka **?** v aplikaci otevírají odpovídající stránku této příručky ve vašem jazyce.

::card-grid{cols="2"}
:::card{title="Začínáme" icon="lucide:flag" to="/cs/guide/quick-start"}
Tato stránka a Rychlý start: první nosník za deset minut.
:::
:::card{title="Sestavení modelu" icon="lucide:pencil-ruler" to="/cs/essentials/user-interface"}
Rozhraní, uzly a podpory, prvky, materiály a průřezy, zatížení, jednotky a nastavení.
:::
:::card{title="Čtení výsledků" icon="lucide:chart-spline" to="/cs/essentials/results"}
Průběhy a tabulky výsledků a jejich ruční ověření.
:::
:::card{title="Sdílení a výuka" icon="lucide:share-2" to="/cs/essentials/import-export"}
Soubory projektů, odkazy ke sdílení, export obrázků a CSV, výuka s EduBeamem.
:::
:::card{title="Návody" icon="lucide:triangle" to="/cs/tutorials/inclined-beam"}
Šikmý nosník, trojkloubový rám, rovinná příhradová konstrukce a spojitý nosník s poklesem podpory. Všechny sestavíte krok za krokem a ověříte ručně.
:::
:::card{title="Příklady" icon="lucide:library" to="/cs/examples/"}
Šest hotových modelů, které otevřete jedním kliknutím, s úlohami a výsledky.
:::
:::card{title="Teoretický manuál" icon="lucide:sigma" to="/cs/elements/conventions"}
Osy a znaménková konvence, nosníkový a příhradový prvek a postup, kterým EduBeam model řeší.
:::
:::card{title="Nápověda" icon="lucide:life-buoy" to="/cs/reference/shortcuts"}
Klávesnice, myš a dotyk, řešení potíží a časté dotazy.
:::
::

## Vlastní nástroje {#libraries}

EduBeam stojí na dvou open-source knihovnách, které jsou zdokumentované i na tomto webu. Můžete s nimi řešit konstrukce ve skriptu, generovat pro každého studenta jiný příklad nebo kreslit obrázky do prezentací a skript.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/cs/solver"}
Řešič metodou konečných prvků, na kterém EduBeam stojí, napsaný v TypeScriptu: nosník zadáte, vyřešíte a výsledky přečtete asi na dvanácti řádcích kódu, v prohlížeči i v Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/cs/plot"}
Komponenty pro Vue 3, které vyřešenou konstrukci vykreslí jako SVG, včetně zatížení, reakcí a průběhů N, V a M.
:::
::

## Jazyky {#languages}

EduBeam mluví 22 jazyky a spustí se v jazyce vašeho prohlížeče. Přepnout ho můžete v **Nastavení → Jazyk a prostředí**, nebo si ho vyberte tady:

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

Jazyk může za čtenáře zvolit i odkaz: `run.edubeam.app/?lang=cs` se otevře česky.

## Autoři a poděkování {#authors-credits}

[EduBeam]{.edubeam} vyvíjí [Jan Voříšek](https://github.com/janvorisek) jako nezávislý projekt. Navazuje na desktopový EduBeam pro Windows a Linux, který vytvořili [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) a [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) na katedře mechaniky [Fakulty stavební ČVUT v Praze](https://www.fsv.cvut.cz/en), a dodnes otevře jeho uložené relace. Výpočetní jádro [@edubeam/fem](/cs/solver) vyrostlo z první verze Bořka Patzáka. Aplikace i výpočetní jádro jsou open source pod licencí GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Hlavní vývojář a autor návrhu aplikace","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Vývojář: ovládání dotykem, rychlost vykreslování, zatížení a podpory","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"Původní EduBeam a první řešič MKP","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Přispějte {#contribute}

::card-grid{cols="3"}
:::card{title="Nahlásit problém" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Něco je nejasné, chybné nebo nefunguje? Založte issue na GitHubu a zpráva dorazí přímo k týmu.
:::
:::card{title="Vylepšit překlad" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Texty aplikace jsou pro každý jazyk v jednom souboru; pull request uvítáme.
:::
:::card{title="Doporučit dál" icon="lucide:share-2"}
Řekněte o EduBeamu spolužákům a kolegům, nebo vložte odkaz na model do svých poznámek.
:::
::
