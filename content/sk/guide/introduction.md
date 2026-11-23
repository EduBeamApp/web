---
description: "Čo je EduBeam: bezplatný program MKP v prehliadači na výpočet rovinných nosníkov, rámov a priehradových konštrukcií. Čo dokáže a čo nie, pre koho je a ako sa vyznať v príručke."
source: site
---

# Úvod

[EduBeam]{.edubeam} je bezplatná aplikácia na statický výpočet **nosníkov, rámov a priehradových konštrukcií**, ktorá beží priamo v prehliadači. Nakreslíte konštrukciu, podopriete ju, zaťažíte a riešič metódou konečných prvkov pri každej vašej úprave prepočíta priebehy vnútorných síl, reakcie aj priehyby. Žiadne tlačidlo *Vypočítať*, nič na inštaláciu a žiadny účet.

::div{.actions}
[Spustiť EduBeam ↗](https://run.edubeam.app/?lang=sk){target="_blank"} [Rýchly štart za 10 minút](/sk/guide/quick-start)
::

![Trojkĺbový rám v EduBeame: zaťaženie oranžovou, reakcie fialovou, ohybový moment červenou a deformovaný tvar sivou farbou](/screenshots/sk/hero.webp)

:span{#your-first-visit}

## Čo EduBeam dokáže {#what-it-does}

::card-grid{cols="2"}
:::card{title="Konštrukcie" icon="lucide:triangle" to="/sk/essentials/elements"}
Nosníky, spojité nosníky, rámy a priehradové konštrukcie v rovine x–z, zostavené z Timošenkových nosníkových prvkov. Kĺby na koncoch urobia z prvku priehradový prút.
:::
:::card{title="Podpery" icon="lucide:anchor" to="/sk/essentials/nodes-supports#supports"}
Pevný kĺb, posuvný kĺb, votknutie, posuvné votknutie alebo ľubovoľná kombinácia podopretých `Dx`, `Dz` a `Ry`, ktorú vyberiete podľa jej značky. Šikmé podpery aj poklesy podpier.
:::
:::card{title="Zaťaženie" icon="lucide:arrow-down-to-line" to="/sk/essentials/loads"}
Sily a momenty v uzloch aj kdekoľvek na prvku, rovnomerné a lichobežníkové spojité zaťaženie, zmena teploty a predpísané posunutia.
:::
:::card{title="Prierezy" icon="lucide:shapes" to="/sk/essentials/elements#cross-sections"}
Európske a americké knižnice alebo ľubovoľný nakreslený polygón. Aplikácia vypočíta $A$, $I_y$, $I_z$, $I_{yz}$, hlavné osi aj polomery zotrvačnosti.
:::
:::card{title="Výsledky" icon="lucide:chart-spline" to="/sk/essentials/results"}
Priebehy **N**, **V** a **M**, deformovaný tvar, reakcie, posunutia uzlov, koncové sily a matice tuhosti prvkov.
:::
:::card{title="Výpočet" icon="lucide:calculator" to="/sk/elements/analysis"}
Lineárna statika, pre lineárny model presná: nie je tu žiadna sieť, ktorú by bolo treba zjemňovať. Ak je konštrukcia mechanizmom, EduBeam vysvetlí prečo a animáciou ukáže, ako sa môže pohybovať.
:::
:::card{title="Súbory" icon="lucide:folder-open" to="/sk/essentials/import-export"}
Projekty ako JSON, celé modely ako odkazy, výkresy v PNG alebo SVG, výsledky v CSV. Nahradené modely sa uchovávajú a nič neopustí vaše zariadenie.
:::
:::card{title="Jednotky" icon="lucide:ruler" to="/sk/essentials/units-settings"}
Jednotky SI alebo americké jedným kliknutím, prípadne každá veličina zvlášť. Os z nadol alebo učebnicová os y nahor.
:::
::

## Čo (zatiaľ) nedokáže {#what-it-does-not-do-yet}

Ak obmedzenia poznáte vopred, ušetríte si čas:

::div{.limits}
- **Iba 2D.** Žiadne správanie mimo roviny, žiadne priestorové rámy.
- **Iba lineárna statika.** Žiadne účinky II. rádu (P–Δ), vzper, dynamika ani plasticita.
- **Jeden zaťažovací stav.** Žiadne kombinácie ani obálky: každý zaťažovací stav uložte do samostatného súboru alebo odkazu.
- **Bez vlastnej tiaže.** Zadajte ju ako spojité zaťaženie.
- **Bez posúdenia.** EduBeam vypočíta vnútorné sily a posunutia; posúdenie podľa noriem je na vás.
::

Ak vám niektorá funkcia chýba, [založte issue na GitHube](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## Pre koho je EduBeam určený {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Študenti" icon="lucide:graduation-cap" to="/sk/practice"}
Okamžitá spätná väzba k ručným výpočtom a úlohy na precvičenie, ktoré vaše výsledky priebežne kontrolujú.
:::
:::card{title="Vyučujúci" icon="lucide:presentation" to="/sk/guide/teaching"}
Na projektore naživo ukážete, ako podpery, kĺby a zaťaženie menia vnútorné sily, a to v 22 jazykoch. Každému študentovi navyše vytlačíte inú písomku.
:::
:::card{title="Inžinieri" icon="lucide:hard-hat" to="/sk/elements/analysis"}
Rýchla kontrola správnosti skôr, než otvoríte rozsiahlejší desktopový program. Každý krok riešenia je opísaný v dokumentácii.
:::
:::card{title="Vývojári" icon="lucide:code-xml" to="#libraries"}
Riešič a vykresľovanie, na ktorých EduBeam stojí, ako open-source knižnice pre váš vlastný kód.
:::
::

## Ako sa vyznať v príručke {#how-this-guide-is-organised}

V bočnom paneli sú stránky zoskupené takto. Tlačidlá **?** v aplikácii otvárajú zodpovedajúcu stránku tejto príručky vo vašom jazyku.

::card-grid{cols="2"}
:::card{title="Začíname" icon="lucide:flag" to="/sk/guide/quick-start"}
Táto stránka a Rýchly štart: prvý nosník za desať minút.
:::
:::card{title="Zostavenie modelu" icon="lucide:pencil-ruler" to="/sk/essentials/user-interface"}
Rozhranie, uzly a podpery, prvky, materiály a prierezy, zaťaženie, jednotky a nastavenia.
:::
:::card{title="Čítanie výsledkov" icon="lucide:chart-spline" to="/sk/essentials/results"}
Priebehy a tabuľky výsledkov a ich ručné overenie.
:::
:::card{title="Zdieľanie a výučba" icon="lucide:share-2" to="/sk/essentials/import-export"}
Súbory projektov, odkazy na zdieľanie, export obrázkov a CSV, výučba s EduBeamom.
:::
:::card{title="Návody" icon="lucide:triangle" to="/sk/tutorials/inclined-beam"}
Šikmý nosník, trojkĺbový rám, rovinná priehradová konštrukcia a spojitý nosník s poklesom podpery. Všetky zostavíte krok za krokom a overíte ručne.
:::
:::card{title="Príklady" icon="lucide:library" to="/sk/examples/"}
Šesť hotových modelov, ktoré otvoríte jedným kliknutím, s úlohami a výsledkami.
:::
:::card{title="Teoretická príručka" icon="lucide:sigma" to="/sk/elements/conventions"}
Osi a znamienková konvencia, nosníkový a priehradový prvok a postup, ktorým EduBeam model rieši.
:::
:::card{title="Pomocník" icon="lucide:life-buoy" to="/sk/reference/shortcuts"}
Klávesnica, myš a dotyk, riešenie problémov a časté otázky.
:::
::

## Vlastné nástroje {#libraries}

EduBeam stojí na dvoch open-source knižniciach, ktoré sú zdokumentované aj na tomto webe. Môžete s nimi riešiť konštrukcie v skripte, generovať pre každého študenta iný príklad alebo kresliť obrázky do prezentácií a skrípt.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/sk/solver"}
Riešič metódou konečných prvkov, na ktorom EduBeam stojí, napísaný v TypeScripte: nosník zadáte, vyriešite a výsledky prečítate asi na dvanástich riadkoch kódu, v prehliadači aj v Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/sk/plot"}
Komponenty pre Vue 3, ktoré vyriešenú konštrukciu vykreslia ako SVG vrátane zaťaženia, reakcií a priebehov N, V a M.
:::
::

## Jazyky {#languages}

EduBeam hovorí 22 jazykmi a spustí sa v jazyku vášho prehliadača. Prepnúť ho môžete cez **Nastavenia → Jazyk a prostredie** alebo si ho vyberte tu:

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

Jazyk môže za čitateľa zvoliť aj odkaz: `run.edubeam.app/?lang=sk` sa otvorí po slovensky.

## Autori a poďakovanie {#authors-credits}

[EduBeam]{.edubeam} vyvíja [Jan Voříšek](https://github.com/janvorisek) ako nezávislý projekt. Nadväzuje na desktopový EduBeam pre Windows a Linux, ktorý vytvorili [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) a [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) na Katedre mechaniky [Fakulty stavebnej ČVUT v Prahe](https://www.fsv.cvut.cz/en), a dodnes otvorí jeho uložené relácie. Riešič [@edubeam/fem](/sk/solver) vyrástol z prvej verzie Bořka Patzáka. Aplikácia aj riešič sú open source pod licenciou GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Hlavný vývojár a autor návrhu aplikácie","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Vývojár: ovládanie dotykom, rýchlosť vykresľovania, zaťaženie a podpery","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"Pôvodný EduBeam a prvý riešič MKP","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Prispejte {#contribute}

::card-grid{cols="3"}
:::card{title="Nahlásiť problém" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Niečo je nejasné, chybné alebo nefunguje? Založte issue na GitHube a správa sa dostane priamo k tímu.
:::
:::card{title="Vylepšiť preklad" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Texty aplikácie sú pre každý jazyk v jednom súbore; pull request privítame.
:::
:::card{title="Odporučiť ďalej" icon="lucide:share-2"}
Povedzte o EduBeame spolužiakom a kolegom alebo vložte odkaz na model do svojich poznámok.
:::
::
