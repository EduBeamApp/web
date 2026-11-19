---
description: "Mapa rozhraní EduBeamu: horní lišta a nabídka ☰, zobrazení s tlačítky a možnostmi zobrazení, výběr a úpravy, tabulky ve spodní liště a zadávání hodnot."
source: site
---

# Uživatelské rozhraní

[EduBeam]{.edubeam} má tři části: nahoře **horní lištu**, uprostřed **zobrazení**, ve kterém kreslíte, a dole **spodní lištu** s tabulkou pro každý druh objektu. Všechno, co uděláte v zobrazení, můžete udělat i v tabulkách – a naopak.

![Části rozhraní, očíslované podle seznamu níže](/screenshots/cs/ui-overview.webp)

1. **Nabídka ☰**: otevírání, ukládání, sdílení a export; příklady a interaktivní průvodci aplikací.
2. **Smazat konstrukci** a **Sdílet konstrukci**.
3. **Zpět** a **Znovu**.
4. **Tlačítka zobrazení**: vystředění, přizpůsobení obrazovce a možnosti zobrazení.
5. **Možnosti zobrazení**: které výsledky a části modelu se vykreslí.
6. **Mřížka, přichytávání, zaměřovací kříž a jednotky.**
7. **Záložky spodní lišty**: Uzly, Prvky, Zatížení, Materiály, Průřezy, Výsledky.
8. **Tabulka** otevřené záložky, ve které můžete upravit každou hodnotu.

::callout{type="tip" title="Nechte se provést"}
Volba **☰ → Provést aplikací** vám tyto části postupně ukáže přímo v aplikaci.
::

## Horní lišta {#app-bar}

- **☰** otevře hlavní nabídku, popsanou níže.
- **Smazat konstrukci** po potvrzení smaže všechny uzly, prvky a zatížení; když zaškrtnete **Smazat materiály** nebo **Smazat průřezy**, odstraní i je. Klávesami <kbd>Ctrl</kbd>+<kbd>Z</kbd> model vrátíte a najdete ho také v nabídce *Nedávné konstrukce*.
- **Sdílet konstrukci** otevře [dialog sdílení](/cs/essentials/import-export#share-a-link) s odkazem, který nese celý model.
- **Co je nového?** ukáže poznámky k vydání. Po aktualizaci se jednou otevřou samy.
- **Dokumentace** otevře tuto příručku, ikona GitHubu zdrojový kód.

Na telefonu se do lišty vejde jen ☰ a **Dokumentace**; **Smazat konstrukci** a **Sdílet konstrukci** najdete v nabídce.

### Nabídka ☰ {#the-☰-menu}

![Nabídka ☰](/screenshots/cs/ui-app-menu.webp){.shot-xs}

- **Otevřít projekt** a **Uložit projekt** otevřou nebo stáhnou soubor `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>).
- **Nedávné konstrukce** uchovávají posledních 10 modelů, které jste smazali nebo nahradili, takže je můžete obnovit.
- **Exportovat obrázek** uloží kresbu jako PNG nebo SVG, případně ho zkopíruje (<kbd>Ctrl</kbd>+<kbd>P</kbd>).
- **Příklady** jsou galerie hotových modelů, **Nakreslit první nosník** je návod v sedmi krocích a **Provést aplikací** je prohlídka rozhraní.
- **Sdílet konstrukci** a **Smazat konstrukci** dělají totéž co tlačítka v horní liště.

Dole v nabídce najdete verzi aplikace a datum jejího vydání. Otevírání, ukládání, sdílení a export popisuje kapitola [Soubory, odkazy a export](/cs/essentials/import-export).

## Zobrazení {#viewer}

Plátno, na kterém model kreslíte a prohlížíte. Výsledky se přepočítají při každé změně, takže tlačítko *Vypočítat* tu nehledejte – žádné není.

### Tlačítka na plátně {#buttons-on-the-canvas}

**Vlevo nahoře: Zpět a Znovu.** Vracejí a znovu provádějí každou změnu modelu: přidání, úpravu, přetažení, smazání i vymazání celé konstrukce (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>).

**Vpravo nahoře:**

- **Výběr obdélníkem** (jen na zařízení s dotykovou obrazovkou): dalším tažením prstem vyberete obdélníkovou oblast.
- **Vystředit konstrukci** posune model doprostřed bez změny měřítka (<kbd>C</kbd>); **Přizpůsobit obrazovce** nastaví měřítko tak, aby byl vidět celý model (<kbd>F</kbd>).
- **⚙** zobrazí nebo skryje [možnosti zobrazení](#display-options).

**Vpravo dole:**

![Tlačítka mřížky, přichytávání, zaměřovacího kříže a jednotek](/screenshots/cs/ui-grid-units.webp){.shot-sm}

- **G** zobrazí nebo skryje mřížku a pravítka (<kbd>G</kbd>); **S** zapne nebo vypne přichytávání k mřížce (<kbd>S</kbd>).
- Tlačítko **zaměřovacího kříže** vyznačí na pravítkách polohu ukazatele (jen při ovládání myší).
- **Štítek jednotek** otevře nastavení v části [Jazyk a prostředí](/cs/essentials/units-settings#language-locale).

### Možnosti zobrazení {#display-options}

Tlačítko ⚙ otevře dvě řady zaškrtávacích políček. První určuje, které výsledky se vykreslí přes model: *Deformovaný tvar*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)* a *Reakce*; na začátku jsou zapnuté deformovaný tvar, ohybový moment a reakce. Druhá řada zobrazuje nebo skrývá části modelu: *Podpory*, *Zatížení*, *Popisky uzlů* a *Popisky prvků*; na začátku jsou zapnuté všechny.

![Tlačítka zobrazení a možnosti zobrazení](/screenshots/cs/ui-display-settings.webp){.shot-lg}

**Všechna nastavení** otevře [nastavení zobrazení](/cs/essentials/units-settings#viewer-settings): velikosti, barvy a způsob vykreslení průběhů. Co který výsledek ukazuje, vysvětluje kapitola [Výsledky a průběhy](/cs/essentials/results#overlays-in-the-viewer).

### Pohyb po plátně {#navigating}

| Akce | Myš a klávesnice | Dotyk |
| --- | --- | --- |
| Přiblížení | Kolečko myši (přibližuje k ukazateli); na touchpadu roztažení prstů nebo posun dvěma prsty | Roztažení prstů |
| Posun | Tažení pravým tlačítkem nebo stisknutým kolečkem; které z nich, nastavíte v části [Ovládání & zkratky](/cs/essentials/units-settings#controls-shortcuts) | Tažení jedním prstem |
| Přizpůsobit, vystředit | <kbd>F</kbd>, <kbd>C</kbd> nebo tlačítka vpravo nahoře | Tlačítka vpravo nahoře |

<kbd>Ctrl</kbd>+<kbd>+</kbd> a <kbd>Ctrl</kbd>+<kbd>-</kbd> přibližují a oddalují výkres kolem jeho středu, na každém rozložení klávesnice. Celé rozhraní nikdy nezvětší, jak by to udělalo přiblížení prohlížeče.

### Výběr a úpravy {#selecting-and-editing}

| Co chcete | Postup |
| --- | --- |
| Vybrat jeden objekt | Klikněte na uzel, prvek, zatížení nebo kótu. Vedle něj se otevře panel s akcemi: přidat zatížení, nastavit podpory, upravit, zobrazit matici tuhosti, smazat. Spodní lišta se přepne na příslušnou záložku. |
| Vybrat více objektů | Táhněte obdélník po prázdném plátně (na dotykové obrazovce nejdřív stiskněte **Výběr obdélníkem**). Vybere všechny uzly uvnitř a všechny prvky, kterých se dotkne, i s jejich zatíženími a kótami. <kbd>Ctrl</kbd>+<kbd>A</kbd> vybere vše. |
| Smazat, kopírovat, vložit | <kbd>Delete</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>. Vložená kopie se pohybuje s ukazatelem, dokud nekliknete. Místo toho můžete do lišty, která se objeví, zadat posun Δx, Δz. |
| Přesunout uzel | Přetáhněte ho. Se zapnutým přichytáváním skončí na mřížce; připojené prvky a zatížení se posunou s ním. |
| Upravit zatížení | Dvakrát na něj klikněte. |
| Zobrazit podrobnosti | Najeďte myší na libovolný objekt a zobrazí se popisek: u uzlu posuny a pootočení, u prvku materiál a průřez, u zatížení jeho hodnoty. Na dotykové obrazovce klepněte – totéž ukáže panel. |
| Otevřít nabídku plátna | Klikněte na plátno pravým tlačítkem, na dotykové obrazovce na něm podržte prst. |

::div{.shots}

![Panel uzlu: přidat zatížení, nastavit podpory, předepsat posunutí](/screenshots/cs/ui-node-menu.webp)

![Po najetí myší na uzel se ukážou jeho posuny a pootočení](/screenshots/cs/ui-hover.webp)

::

**Nabídka plátna** nabízí *Přidat uzel*, *Přidat prvek*, *Přidat kótu* (a nad prvkem *Okótovat prvek*) a dále *Upravit*, *Kopírovat*, *Vložit* a *Smazat* pro aktuální výběr. Když při volbě *Přidat uzel* nebo *Přidat prvek* podržíte <kbd>Ctrl</kbd>, umístíte je myší, a ne přes dialog.

![Nabídka plátna](/screenshots/cs/ui-canvas-menu.webp){.shot-sm}

Všechny zkratky a gesta najdete na stránce [Klávesnice, myš a dotyk](/cs/reference/shortcuts).

### Když model nelze vypočítat {#when-the-model-cannot-be-solved}

Vlevo nahoře v zobrazení se objeví hlášení:

| Hlášení | Význam |
| --- | --- |
| *Není definovaný žádný materiál*, *Není definovaný žádný průřez* | Přidejte ho tlačítkem **Přidat** vedle hlášení. |
| Modrý štítek **Chybí podpory** | Model ještě není hotový, jen potřebuje další podpory. |
| Červené hlášení s tlačítkem **Zobrazit podrobnosti** | Něco je špatně. Podrobnosti vypíšou každý problém i s radou, jak ho opravit. |
| Žluté hlášení | Model se vypočítal, ale něco vypadá podezřele, například uzel, ke kterému není připojený žádný prvek. |

Pokud se konstrukce může pohybovat, EduBeam rozpohybuje její čárkovaný obrys a zakroužkuje uzly nebo klouby, které pohyb umožňují. Chcete-li pohyb vidět znovu, najeďte myší na hlášení; tlačítkem s okem ho skryjete.

![Rám s klouby v B a C je mechanismus: EduBeam ukáže, jak se pohybuje](/screenshots/cs/ui-mechanism.webp)

Každé hlášení a způsob, jak problém opravit, vysvětluje kapitola [Řešení problémů](/cs/reference/troubleshooting#messages).

## Spodní lišta {#bottom-bar}

Lišta má šest záložek, každou s panelem tlačítek a upravitelnou tabulkou. Na záložce vidíte, kolik objektů obsahuje. Výšku lišty změníte tažením pruhu se záložkami nahoru nebo dolů, tlačítkem vpravo ji sbalíte. Tlačítko **?** vedle něj vysvětlí otevřenou záložku, stejně jako **?** u některých záhlaví sloupců.

| Záložka | Tlačítka | Sloupce tabulky |
| --- | --- | --- |
| **Uzly** | Přidat uzel (dialog), Přidat uzel (myš) | Uzel, Souřadnice, **Podepřené stupně volnosti** (značka podpory, `Dx`, `Dz`, `Ry`, úhel α), Zatížení, Akce |
| **Prvky** | Přidat prvek (dialog), Přidat prvek (myš) | Prvek, Typ, Uzly (s tlačítkem **Přehodit pořadí uzlů**), Materiál, Průřez, **Koncové klouby**, Zatížení, Akce |
| **Zatížení** | Přidat uzlové zatížení, Přidat prvkové zatížení | Typ, Působiště, Složky, Akce |
| **Materiály** | Přidat materiál, Knihovna materiálů | Materiál, E, G, α<sub>T</sub>, Akce |
| **Průřezy** | Přidat průřez, Knihovna průřezů, Polygonální průřez | Tvar, Průřez, Plocha, I<sub>y</sub>, Výška, Smykový součinitel, Akce |
| **Výsledky** | Výsledky v uzlech, Výsledky na prvcích, Exportovat CSV, Kopírovat | Posuny uzlů nebo koncové síly prvků; viz [Výsledky](/cs/essentials/results#results-tab) |

Jednotlivé záložky podrobně popisují kapitoly [Uzly a podpory](/cs/essentials/nodes-supports), [Prvky, materiály a průřezy](/cs/essentials/elements), [Zatížení](/cs/essentials/loads) a [Výsledky a průběhy](/cs/essentials/results#results-tab).

### Zadávání hodnot {#typing-values}

Všechna číselná pole, v tabulkách i v dialozích, fungují stejně:

- Hodnoty jsou v [aktuálních jednotkách](/cs/essentials/units-settings#units), které vidíte v záhlaví sloupce nebo za polem.
- Desetinná tečka i čárka fungují stejně: `2.5` a `2,5` znamenají totéž.
- Můžete psát i výpočty: `+ - * / ^` a závorky, takže `6/2`, `3*1.5`, `2^3` nebo `(4+2)/3` se vyhodnotí za vás a `1e-5` znamená $10^{-5}$.
- V tabulce hodnotu potvrdí <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Tab</kbd> nebo kliknutí jinam. <kbd>Ctrl</kbd>+<kbd>Z</kbd> ji pak vrátí; dokud ještě píšete, vrací jen to, co jste napsali.

## Záložky nad zobrazením {#tabs-above-the-viewer}

Záložka **Konstrukce** zobrazuje plátno. **Nastavení** zobrazí na jeho místě [nastavení](/cs/essentials/units-settings) přes celou plochu, takže můžete změnit barvy nebo jednotky a po přepnutí zpět hned vidět výsledek. Štítek jednotek a *Všechna nastavení* otevírají totéž nastavení jako dialog nad modelem.

## Plovoucí okna {#floating-windows}

**Matice tuhosti** (z panelu prvku nebo z tabulky *Prvky*) otevře okno s maticí tuhosti prvku (6 × 6) v globálních osách. **Upravit** v nabídce plátna otevře tabulku s aktuálním výběrem. Okno přesunete tažením za záhlaví a zavřete křížkem ×.
