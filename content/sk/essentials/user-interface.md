---
description: "Mapa rozhrania EduBeamu: horná lišta a ponuka ☰, zobrazenie s tlačidlami a možnosťami zobrazenia, výber a úpravy, tabuľky v spodnej lište a zadávanie hodnôt."
source: site
---

# Používateľské rozhranie

[EduBeam]{.edubeam} má tri časti: hore **hornú lištu**, v strede **zobrazenie**, v ktorom kreslíte, a dole **spodnú lištu** s tabuľkou pre každý druh objektu. Všetko, čo urobíte v zobrazení, môžete urobiť aj v tabuľkách, a naopak.

![Časti rozhrania, očíslované podľa zoznamu nižšie](/screenshots/sk/ui-overview.webp)

1. **Ponuka ☰**: otváranie, ukladanie, zdieľanie a export; príklady a interaktívni sprievodcovia aplikáciou.
2. **Vymazať konštrukciu** a **Zdieľať konštrukciu**.
3. **Späť** a **Znova**.
4. **Tlačidlá zobrazenia**: vycentrovanie, prispôsobenie obrazovke a možnosti zobrazenia.
5. **Možnosti zobrazenia**: ktoré výsledky a časti modelu sa vykreslia.
6. **Mriežka, prichytávanie, zameriavací kríž a jednotky.**
7. **Karty spodnej lišty**: Uzly, Prvky, Zaťaženie, Materiály, Prierezy, Výsledky.
8. **Tabuľka** otvorenej karty, v ktorej môžete upraviť každú hodnotu.

::callout{type="tip" title="Prejdite si prehliadku"}
Voľba **☰ → Prehliadka aplikácie** vám tieto časti postupne ukáže priamo v aplikácii.
::

## Horná lišta {#app-bar}

- **☰** otvorí hlavnú ponuku, opísanú nižšie.
- **Vymazať konštrukciu** po potvrdení vymaže všetky uzly, prvky a zaťaženia; ak zaškrtnete **Vymazať materiály** alebo **Vymazať prierezy**, odstráni aj tie. Model obnovíte klávesmi <kbd>Ctrl</kbd>+<kbd>Z</kbd> a uloží sa aj do ponuky *Nedávne konštrukcie*.
- **Zdieľať konštrukciu** otvorí [dialóg zdieľania](/sk/essentials/import-export#share-a-link) s odkazom, ktorý obsahuje celý model.
- **Čo je nové?** zobrazí poznámky k vydaniu. Po aktualizácii sa raz otvoria samy.
- **Dokumentácia** otvorí túto príručku a ikona GitHubu zdrojový kód.

Na telefóne sa do lišty zmestí len ☰ a **Dokumentácia**; **Vymazať konštrukciu** a **Zdieľať konštrukciu** nájdete v ponuke.

### Ponuka ☰ {#the-☰-menu}

![Ponuka ☰](/screenshots/sk/ui-app-menu.webp){.shot-xs}

- **Otvoriť projekt** a **Uložiť projekt** otvoria alebo stiahnu súbor `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>).
- **Nedávne konštrukcie** uchovávajú posledných 10 modelov, ktoré ste vymazali alebo nahradili, takže ich môžete obnoviť.
- **Exportovať obrázok** uloží kresbu ako PNG alebo SVG, prípadne ju skopíruje (<kbd>Ctrl</kbd>+<kbd>P</kbd>).
- **Príklady** sú galéria hotových modelov, **Nakresliť prvý nosník** je sprievodca v siedmich krokoch a **Prehliadka aplikácie** je prehliadka rozhrania.
- **Zdieľať konštrukciu** a **Vymazať konštrukciu** robia to isté ako tlačidlá v hornej lište.

Dole v ponuke nájdete verziu aplikácie a dátum jej vydania. Otváranie, ukladanie, zdieľanie a export opisuje kapitola [Súbory, odkazy a export](/sk/essentials/import-export).

## Zobrazenie {#viewer}

Plátno, na ktorom model kreslíte a prezeráte. Výsledky sa prepočítajú pri každej zmene, takže tlačidlo *Vypočítať* tu nehľadajte – žiadne nie je.

### Tlačidlá na plátne {#buttons-on-the-canvas}

**Vľavo hore: Späť a Znova.** Vracajú a znova vykonávajú každú zmenu modelu: pridanie, úpravu, presunutie, vymazanie aj vymazanie celej konštrukcie (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>).

**Vpravo hore:**

- **Výber obdĺžnikom** (len na zariadení s dotykovou obrazovkou): ďalším ťahaním prsta vyberiete obdĺžnikovú oblasť.
- **Vycentrovať konštrukciu** posunie model do stredu bez zmeny mierky (<kbd>C</kbd>); **Prispôsobiť obrazovke** nastaví mierku tak, aby bol vidieť celý model (<kbd>F</kbd>).
- **⚙** zobrazí alebo skryje [možnosti zobrazenia](#display-options).

**Vpravo dole:**

![Tlačidlá mriežky, prichytávania, zameriavacieho kríža a jednotiek](/screenshots/sk/ui-grid-units.webp){.shot-sm}

- **G** zobrazí alebo skryje mriežku a pravítka (<kbd>G</kbd>); **S** zapne alebo vypne prichytávanie k mriežke (<kbd>S</kbd>).
- Tlačidlo **zameriavacieho kríža** vyznačí na pravítkach polohu kurzora (len pri ovládaní myšou).
- **Štítok jednotiek** otvorí nastavenia v časti [Jazyk a prostredie](/sk/essentials/units-settings#language-locale).

### Možnosti zobrazenia {#display-options}

Tlačidlo ⚙ otvorí dva rady začiarkavacích políčok. Prvý určuje, ktoré výsledky sa vykreslia na modeli: *Deformovaný tvar*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)* a *Reakcie*; predvolene sú zapnuté deformovaný tvar, ohybový moment a reakcie. Druhý rad zobrazuje alebo skrýva časti modelu: *Podpery*, *Zaťaženie*, *Popisy uzlov* a *Popisy prvkov*; predvolene sú zapnuté všetky.

![Tlačidlá zobrazenia a možnosti zobrazenia](/screenshots/sk/ui-display-settings.webp){.shot-lg}

**Všetky nastavenia** otvorí [nastavenia zobrazenia](/sk/essentials/units-settings#viewer-settings): veľkosti, farby a spôsob vykreslenia priebehov. Čo ktorý výsledok ukazuje, vysvetľuje kapitola [Výsledky a priebehy](/sk/essentials/results#overlays-in-the-viewer).

### Pohyb po plátne {#navigating}

| Akcia | Myš a klávesnica | Dotyk |
| --- | --- | --- |
| Priblíženie | Koliesko myši (približuje ku kurzoru); na touchpade roztiahnutie prstov alebo posun dvoma prstami | Roztiahnutie prstov |
| Posun | Ťahanie pravým tlačidlom alebo stlačeným kolieskom; ktorým z nich, nastavíte v časti [Ovládanie a skratky](/sk/essentials/units-settings#controls-shortcuts) | Ťahanie jedným prstom |
| Prispôsobiť, vycentrovať | <kbd>F</kbd>, <kbd>C</kbd> alebo tlačidlá vpravo hore | Tlačidlá vpravo hore |

<kbd>Ctrl</kbd>+<kbd>+</kbd> a <kbd>Ctrl</kbd>+<kbd>-</kbd> približujú a odďaľujú výkres okolo jeho stredu, pri každom rozložení klávesnice. Nikdy nezväčšia celé rozhranie, ako by to urobilo priblíženie prehliadača.

### Výber a úpravy {#selecting-and-editing}

| Čo chcete | Postup |
| --- | --- |
| Vybrať jeden objekt | Kliknite na uzol, prvok, zaťaženie alebo kótu. Vedľa neho sa otvorí panel s akciami: pridať zaťaženie, nastaviť podpery, upraviť, zobraziť maticu tuhosti, vymazať. Spodná lišta sa prepne na príslušnú kartu. |
| Vybrať viac objektov | Ťahajte obdĺžnik po prázdnom plátne (na dotykovej obrazovke najprv stlačte **Výber obdĺžnikom**). Vyberie všetky uzly vnútri a všetky prvky, ktorých sa dotkne, aj s ich zaťaženiami a kótami. <kbd>Ctrl</kbd>+<kbd>A</kbd> vyberie všetko. |
| Vymazať, kopírovať, vložiť | <kbd>Delete</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>. Vložená kópia sa pohybuje s kurzorom, kým nekliknete. Namiesto toho môžete do lišty, ktorá sa objaví, zadať posun Δx, Δz. |
| Presunúť uzol | Potiahnite ho. So zapnutým prichytávaním skončí na mriežke; pripojené prvky a zaťaženia sa posunú s ním. |
| Upraviť zaťaženie | Dvakrát naň kliknite. |
| Zobraziť podrobnosti | Ukážte myšou na ľubovoľný objekt a zobrazia sa podrobnosti: pri uzle posunutia a pootočenie, pri prvku materiál a prierez, pri zaťažení jeho hodnoty. Na dotykovej obrazovke naň ťuknite – to isté ukáže panel. |
| Otvoriť ponuku plátna | Kliknite na plátno pravým tlačidlom, na dotykovej obrazovke na ňom podržte prst. |

::div{.shots}

![Panel uzla: pridať zaťaženie, nastaviť podpery, predpísať posunutie](/screenshots/sk/ui-node-menu.webp)

![Keď ukážete myšou na uzol, zobrazia sa jeho posunutia a pootočenie](/screenshots/sk/ui-hover.webp)

::

**Ponuka plátna** ponúka *Pridať uzol*, *Pridať prvok*, *Pridať kótu* (a nad prvkom *Okótovať prvok*) a ďalej *Upraviť*, *Kopírovať*, *Vložiť* a *Vymazať* pre aktuálny výber. Ak pri voľbe *Pridať uzol* alebo *Pridať prvok* podržíte <kbd>Ctrl</kbd>, umiestnite ich myšou, a nie cez dialóg.

![Ponuka plátna](/screenshots/sk/ui-canvas-menu.webp){.shot-sm}

Všetky skratky a gestá nájdete na stránke [Klávesnica, myš a dotyk](/sk/reference/shortcuts).

### Keď model nemožno vypočítať {#when-the-model-cannot-be-solved}

Vľavo hore v zobrazení sa objaví hlásenie:

| Hlásenie | Význam |
| --- | --- |
| *Nie je definovaný žiadny materiál*, *Nie je definovaný žiadny prierez* | Pridajte ho tlačidlom **Pridať** vedľa hlásenia. |
| Modrý štítok **Chýbajú podpery** | Model ešte nie je hotový, len potrebuje ďalšie podpery. |
| Červené hlásenie s tlačidlom **Zobraziť podrobnosti** | Niečo je zle. Podrobnosti vypíšu každý problém aj s radou, ako ho opraviť. |
| Žlté hlásenie | Model sa vypočítal, ale niečo vyzerá podozrivo, napríklad uzol, ku ktorému nie je pripojený žiadny prvok. |

Ak sa konštrukcia môže pohybovať, EduBeam rozpohybuje jej čiarkovaný obrys a zakrúžkuje uzly alebo kĺby, ktoré pohyb umožňujú. Ak chcete pohyb vidieť znova, ukážte myšou na hlásenie; tlačidlom s okom ho skryjete.

![Rám s kĺbmi v B a C je mechanizmus: EduBeam ukáže, ako sa pohybuje](/screenshots/sk/ui-mechanism.webp)

Každé hlásenie a spôsob, ako problém opraviť, vysvetľuje kapitola [Riešenie problémov](/sk/reference/troubleshooting#messages).

## Spodná lišta {#bottom-bar}

Lišta má šesť kariet, každú s panelom tlačidiel a upraviteľnou tabuľkou. Na karte vidíte, koľko objektov obsahuje. Výšku lišty zmeníte ťahaním pruhu s kartami hore alebo dole, tlačidlom vpravo ju zbalíte. Tlačidlo **?** vedľa neho vysvetlí otvorenú kartu, rovnako ako **?** pri niektorých záhlaviach stĺpcov.

| Karta | Tlačidlá | Stĺpce tabuľky |
| --- | --- | --- |
| **Uzly** | Pridať uzol (dialógom), Pridať uzol (myšou) | Uzol, Súradnice, **Podopreté stupne voľnosti** (značka podpery, `Dx`, `Dz`, `Ry`, uhol α), Zaťaženie, Akcie |
| **Prvky** | Pridať prvok (dialógom), Pridať prvok (myšou) | Prvok, Typ, Uzly (s tlačidlom **Vymeniť poradie uzlov**), Materiál, Prierez, **Koncové kĺby**, Zaťaženie, Akcie |
| **Zaťaženie** | Pridať uzlové zaťaženie, Pridať prvkové zaťaženie | Typ, Pôsobisko, Zložky, Akcie |
| **Materiály** | Pridať materiál, Knižnica materiálov | Materiál, E, G, α<sub>T</sub>, Akcie |
| **Prierezy** | Pridať prierez, Knižnica prierezov, Polygonálny prierez | Tvar, Prierez, Plocha, I<sub>y</sub>, Výška, Šmykový súčiniteľ, Akcie |
| **Výsledky** | Výsledky v uzloch, Výsledky na prvkoch, Exportovať CSV, Kopírovať | Posunutia uzlov alebo koncové sily prvkov; pozrite [Výsledky](/sk/essentials/results#results-tab) |

Jednotlivé karty podrobne opisujú kapitoly [Uzly a podpery](/sk/essentials/nodes-supports), [Prvky, materiály a prierezy](/sk/essentials/elements), [Zaťaženie](/sk/essentials/loads) a [Výsledky a priebehy](/sk/essentials/results#results-tab).

### Zadávanie hodnôt {#typing-values}

Všetky číselné polia, v tabuľkách aj v dialógoch, fungujú rovnako:

- Hodnoty sú v [aktuálnych jednotkách](/sk/essentials/units-settings#units), ktoré vidíte v záhlaví stĺpca alebo za poľom.
- Desatinná bodka aj čiarka fungujú rovnako: `2.5` a `2,5` znamenajú to isté.
- Môžete písať aj výpočty: `+ - * / ^` a zátvorky, takže `6/2`, `3*1.5`, `2^3` alebo `(4+2)/3` sa vyhodnotia za vás a `1e-5` znamená $10^{-5}$.
- V tabuľke hodnotu potvrdí <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Tab</kbd> alebo kliknutie inam. <kbd>Ctrl</kbd>+<kbd>Z</kbd> ju potom vráti; kým ešte píšete, vracia len to, čo ste napísali.

## Karty nad zobrazením {#tabs-above-the-viewer}

Karta **Konštrukcia** zobrazuje plátno. **Nastavenia** zobrazia na jeho mieste [nastavenia](/sk/essentials/units-settings) na celej ploche, takže môžete zmeniť farby alebo jednotky a po prepnutí späť hneď vidieť výsledok. Štítok jednotiek a *Všetky nastavenia* otvárajú tie isté nastavenia ako dialóg nad modelom.

## Plávajúce okná {#floating-windows}

**Matica tuhosti** (z panela prvku alebo z tabuľky *Prvky*) otvorí okno s maticou tuhosti prvku (6 × 6) v globálnych osiach. **Upraviť** v ponuke plátna otvorí tabuľku s aktuálnym výberom. Okno presuniete ťahaním za záhlavie a zatvoríte krížikom ×.
