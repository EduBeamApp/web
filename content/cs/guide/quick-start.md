---
description: "Za deset minut vymodelujete v EduBeamu prostý ocelový nosník: materiál, průřez, uzly, podpory a zatížení. Pak odečtete reakce a průběhy a ověříte je ručně."
source: site
---

# Rychlý start

Za zhruba deset minut sestavíte prostý ocelový nosník, odečtete jeho reakce, posouvající sílu, ohybový moment a průhyb a každé číslo ověříte ručním výpočtem. Otevřete si EduBeam ve druhé záložce nebo vedle této stránky a postupujte s námi.

::div{.actions}
[Otevřít EduBeam ↗](https://run.edubeam.app/?lang=cs){target="_blank"} [Rovnou k ručnímu ověření](#_8-check-by-hand)
::

## Zadání {#the-problem}

Nosník o rozpětí 6 m je v uzlu 1 uložený na kloubu, v uzlu 2 na posuvném kloubu a po celé délce nese rovnoměrné spojité zatížení 12 kN/m. Jde o ocelový profil IPE 200: $E = 210$ GPa, $G = 81$ GPa, $A = 28{,}48\ \text{cm}^2$ a $I_y = 1943\ \text{cm}^4$. Všechny čtyři hodnoty najdete v knihovnách EduBeamu, takže nic nemusíte dohledávat.

::model-figure{caption="Nosník, který sestavíte: rozpětí 6 m od uzlu 1 k uzlu 2, zatížení 12 kN/m"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: []
show: [nodeLabels, dimensions]
---
::

## Sestavení modelu {#build-the-model}

::div{.steps}

### Začněte s prázdným modelem {#start-from-an-empty-model}

Při první návštěvě se vás uvítací dialog zeptá, jak chcete začít. V části **Soustava jednotek** zvolte **SI (metrická)**, v části **Souřadnicový systém** ponechte **x doprava, z dolů** a klikněte na **Přeskočit**. Aplikace pak zobrazí malý ukázkový rám.

1. V horní liště klikněte na **Smazat konstrukci** (na telefonu je v nabídce **☰**).
2. Zaškrtněte **Smazat materiály** a **Smazat průřezy** a klikněte na **Potvrdit**.

Plátno je teď prázdné a dvě červená hlášení upozorňují, že zatím chybí materiál i průřez. To napravíte v dalších krocích. Nic se neztratí: zkratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> rám vrátíte a najdete ho i v **☰ → Nedávné konstrukce**.

### Zkontrolujte jednotky {#_1-check-the-units}

Štítek v pravém dolním rohu zobrazení ukazuje jednotky, ve kterých jsou všechna pole a výsledky. Tato stránka počítá s jednotkami SI, které štítek zobrazí jako `m m² kN kNm MPa`, a s osou z mířící dolů. Pokud štítek ukazuje stopy a kipy, klikněte na něj a nastavte **Soustava jednotek** na **SI (metrická)**. Na stejném místě musí být **Souřadnicový systém** nastavený na **x doprava, z dolů**: s osou y nahoru míří kladné zatížení vzhůru a znaménka by neodpovídala této stránce.

![Přepínače mřížky (G) a přichytávání (S), zaměřovací kříž a štítek jednotek](/screenshots/cs/ui-grid-units.webp){.shot-sm}

### Přidejte materiál a průřez {#_2-add-the-material-and-cross-section}

Každý prvek potřebuje materiál a průřez, proto je přidejte jako první, a to z knihoven.

1. Ve spodní liště otevřete záložku **Materiály** a klikněte na **Knihovna materiálů**.
2. Na řádku **Ocel (S235)** klikněte na **+** ($E = 210\,000$ MPa, $G = 81\,000$ MPa). Knihovna zůstane otevřená pro další výběr, zavřete ji tedy tlačítkem **Zrušit**.
3. Otevřete záložku **Průřezy** a klikněte na **Knihovna průřezů**.
4. Sjeďte na řádek **IPE 200 (přibl.)**, klikněte na **+** a knihovnu zavřete tlačítkem **Zrušit**.

Obě červená hlášení zmizela a v záložce **Průřezy** je IPE 200:

![IPE 200 v záložce Průřezy: plocha, Iy, výška a smykový součinitel](/screenshots/cs/a-qs-cross-sections.webp)

Chcete-li raději zadat vlastní hodnoty, použijte **Přidat materiál** a **Přidat průřez**. Smykový součinitel, tady 0,3933, se ještě objeví v [ručním ověření](#_8-check-by-hand).

### Přidejte uzly {#_3-add-the-nodes}

1. Otevřete záložku **Uzly**. Najdete v ní dvě tlačítka **Přidat uzel**: **+** otevře dialog, tlačítko s ikonou kurzoru slouží k umisťování uzlů myší. Klikněte na **+ Přidat uzel**.
2. **Souřadnice X** a **Souřadnice Z** nechte na `0` a klikněte na **Přidat uzel**. Dialog se zavře a objeví se uzel `1`.
3. Znovu klikněte na **+ Přidat uzel**, do pole **Souřadnice X** zadejte `6` a klikněte na **Přidat uzel**. To je uzel `2`.

![Dialog Přidat nový uzel. Podpory v něm můžete nastavit rovnou.](/screenshots/cs/qs-node.webp){.shot-md}

### Spojte je prvkem {#_4-connect-them-with-an-element}

Otevřete záložku **Prvky** a klikněte na **+ Přidat prvek**. Dialog už předvyplní **Počáteční uzel** `1`, **Koncový uzel** `2` a váš materiál a průřez. Klikněte na **Přidat prvek**.

![Přidat nový prvek: dva koncové uzly, volitelný kloub na každém konci, materiál a průřez](/screenshots/cs/a-qs-element.webp){.shot-md}

Mezi uzly se objeví nosník. Klávesou <kbd>F</kbd> ho přizpůsobíte obrazovce. Modrý štítek **Chybí podpory** vlevo nahoře v zobrazení vysvětluje, proč zatím nejsou žádné výsledky.

### Přidejte podpory {#_5-add-the-supports}

Zpátky v záložce **Uzly** má každý řádek na začátku sloupce **Podepřené stupně volnosti** výběr podpory.

- Uzel `1`: zvolte **Kloub**. Tím se zaškrtnou `Dx` a `Dz`.
- Uzel `2`: zvolte **Posuvný kloub**. Zaškrtne se jen `Dz`.

![Výběr podpory v tabulce Uzly](/screenshots/cs/a-qs-support-picker.webp){.shot-lg}

Štítek **Chybí podpory** zmizí. Podporu můžete zadat i tak, že v zobrazení kliknete na uzel a zvolíte **Podepření uzlu**. Všechny typy podpor najdete v kapitole [Uzly a podpory](/cs/essentials/nodes-supports#supports).

### Přidejte zatížení {#_6-add-the-load}

1. Otevřete záložku **Zatížení** a klikněte na **Přidat prvkové zatížení**.
2. **Typ zatížení** ponechte *Spojité rovnoměrné zatížení* a **Prvek** `1`.
3. Do pole **fz** zadejte `12`, **fx** nechte na `0` a klikněte na **Přidat prvkové zatížení**.

![V dialogu vidíte náhled zatížení na prvku](/screenshots/cs/a-qs-load.webp){.shot-md}

Kladné `fz` míří ve směru +z, tedy **dolů**, takže kladná hodnota odpovídá tíhovému zatížení. Zaškrtnuté políčko **LCS** znamená, že zatížení sleduje vlastní (lokální) osy prvku; u vodorovného nosníku nakresleného zleva doprava splývají s globálními osami. Viz [znaménkovou konvenci](/cs/elements/conventions#loads).

::

## Odečtěte výsledky {#_7-read-the-results}

EduBeam nosník vyřeší, jakmile zadáte zatížení, a pak znovu po každé vaší úpravě: tlačítko *Spočítat* tu není. Panel vpravo nahoře v zobrazení zapíná a vypíná jednotlivé vrstvy. **Deformovaný tvar**, **M<sub>y</sub>(x)** a **Reakce** jsou zapnuté od začátku. Posouvající sílu přidáte zaškrtnutím **V<sub>z</sub>(x)**.

![Možnosti zobrazení se zapnutou posouvající silou](/screenshots/cs/a-qs-display.webp){.shot-md}

Obrazovka by teď měla odpovídat tomuto obrázku. Přepínejte mezi ohybovým momentem a posouvající silou:

::model-figure{caption="Hotový nosník: reakce 36 kN a moment 54 kNm uprostřed rozpětí"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: [M, V]
show: [nodeLabels]
---
::

| Vrstva | Co byste měli vidět |
| --- | --- |
| **Reakce** | Dvě šipky mířící vzhůru, každá **36 kN**, jedna u každé podpory. |
| **V<sub>z</sub>(x)** | Přímka od **+36 kN** v uzlu `1` po **−36 kN** v uzlu `2`, nulová uprostřed rozpětí. |
| **M<sub>y</sub>(x)** | Parabola s maximem **54 kNm** uprostřed rozpětí, vykreslená na tažené straně, tedy pod nosníkem. |
| **Deformovaný tvar** | Symetrický průhyb, vykreslený zvětšeně. |

Čísla najdete v záložce **Výsledky**. **Výsledky v uzlech** obsahují posuny `Dx`, `Dz` a pootočení `Ry` každého uzlu, **Výsledky na prvcích** koncové síly každého prvku v jeho lokálních osách. Uzel `1` se pootočí o $R_y = -2{,}6469 \cdot 10^{-2}$ rad, uzel `2` o stejnou hodnotu na opačnou stranu. Všechny tabulky a znaménka vysvětluje kapitola [Výsledky a průběhy](/cs/essentials/results).

Pokud se vám průběhy zdají příliš velké nebo malé, změňte **Měřítko výsledků** v **Nastavení → Nastavení zobrazení**.

## Ověřte ručně {#_8-check-by-hand}

Pro $q = 12$ kN/m a $L = 6$ m dávají učebnicové vzorce:

| Veličina | Vzorec | Ručně | EduBeam |
| --- | --- | --- | --- |
| Reakce | $qL/2$ | 36 kN | 36 kN |
| Největší posouvající síla | $qL/2$ | 36 kN | 36 kN |
| Největší moment | $qL^2/8$ | 54 kNm | 54 kNm |
| Pootočení konce | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Průhyb uprostřed rozpětí | $w_b + w_s$ | 49,63 + 0,60 = 50,22 mm | 50,22 mm |

Průhyb má dvě složky a většina učebnic uvádí jen první:

- **Ohyb:** $w_b = 5qL^4/(384EI) = 49{,}63$ mm, kde $EI = 4080$ kNm² plyne z $E = 210$ GPa a $I_y = 1943\ \text{cm}^4$.
- **Smyk:** $w_s = qL^2/(8kGA) = 0{,}60$ mm, kde $kGA \approx 90\,700$ kN plyne z $k = 0{,}3933$, $G = 81$ GPa a $A = 28{,}48\ \text{cm}^2$.

Uprostřed rozpětí zatím žádný uzel není. Abyste tam mohli odečíst průhyb, jeden přidejte:

1. V záložce **Uzly** klikněte na druhé tlačítko **Přidat uzel**, to s ikonou kurzoru.
2. Klikněte na nosník v místě `x = 3`; se zapnutým přichytáváním padne uzel přesně na mřížku. EduBeam se zeptá, co s uzlem udělat: zvolte **Připojit ke konstrukci**. Prvek se i se svým zatížením rozdělí na `1a` a `1b` a umisťování uzlů skončí. Pokud uzel `3` v záložce **Uzly** neleží v X = `3`, zapište tam `3`.
3. V záložce **Výsledky → Výsledky v uzlech** má teď uzel `3` hodnotu $D_z = 5{,}0224 \cdot 10^{-2}$ m, tedy 50,22 mm.

![Výsledky v uzlech po rozdělení: uzel 3 se posune o 50,22 mm dolů](/screenshots/cs/a-qs-nodal-results.webp){.shot-lg}

Rozdělení nosníku žádný výsledek nezmění, protože prvek je pro tato zatížení přesný: síť tu není co zjemňovat.

::callout{type="details" title="Proč záleží na smykovém součiniteli"}
EduBeam používá Timošenkovy nosníkové prvky, které zahrnují smykovou deformaci. Smykovým součinitelem $k$ se násobí plocha, která přenáší smyk, takže smyková tuhost je $kGA$. U I-profilů z knihovny je $k$ podíl stojiny na ploše průřezu, $h t_w / A$: pro IPE 200 $0{,}2 \cdot 0{,}0056 / 0{,}002848 = 0{,}3933$. Smyková část průhybu, $w_s = qL^2/(8kGA)$, je integrál $V/(kGA)$ od podpory do středu rozpětí.

U tohoto štíhlého nosníku je smyková část 0,60 mm, asi 1 % celku. U krátkého a vysokého nosníku je mnohem větší. Nastavte v záložce **Průřezy** smykový součinitel na velmi velké číslo (třeba `1e10`) a EduBeam vrátí čistě ohybových 49,63 mm. Teorii najdete na stránce [Nosníkový prvek](/cs/elements/beam).
::

Další postupy ruční kontroly (konzola, oboustranně vetknutý nosník, příhradová konstrukce, změna teploty, pokles podpory) najdete v kapitole [Ověření výsledků ručně](/cs/guide/verification).

## Experimentujte {#_9-experiment}

Měňte model a sledujte, jak se s ním mění průběhy. Zkoušejte každou změnu zvlášť a před další ji vraťte zkratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Uzel `3` je uzel uprostřed rozpětí, který jste právě přidali.

- **Přetáhněte uzel `2`** doprava. Moment roste s $L^2$, průhyb s $L^4$.
- **Zaškrtněte `Ry` v uzlu `1`** a tento konec vetknete. Ve vetknutí se objeví záporný moment: podle učebnicového vzorce $qL^2/8 = 54$ kNm, v EduBeamu 53,8 kNm. U staticky neurčitého nosníku totiž smyková tuhost ovlivňuje i vnitřní síly.
- **Zaškrtněte `Dz` v uzlu `3`**, přidáte tím prostřední podporu a vznikne spojitý nosník o dvou polích. Moment nad prostřední podporou bude záporný: ručně $q(L/2)^2/8 = 13{,}5$ kNm, v EduBeamu 13,3 kNm, ze stejného důvodu.
- **Zaškrtněte `Dz` v uzlu `3` a koncový kloub prvku `1a`**: v záložce **Prvky** je to druhé políčko ve sloupci *Koncové klouby* (konec prvku v uzlu `3`). Z nosníku vzniknou dva prosté nosníky o rozpětí 3 m. Teď v uzlu `3` zrušte zaškrtnutí `Dz`: nosník se stane mechanismem a EduBeam ukáže, jak se může pohybovat.

Chcete-li si vyzkoušet vliv rozpětí a zatížení, aniž byste cokoli sestavovali, posouvejte jezdce níže a přepínejte mezi výsledky: uvidíte, jak která veličina roste s rozpětím.

::example-structure
::

## Uložte nebo sdílejte {#_10-save-or-share}

- **Pošlete ho někomu.** V horní liště klikněte na **Sdílet konstrukci** a pak na **Kopírovat**. Odkaz obsahuje celý model a kdo ho otevře, dostane vlastní kopii k úpravám.
- **Uložte si ho do souboru.** **☰ → Uložit projekt** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) stáhne soubor `project.json`. Znovu ho otevřete přes **☰ → Otevřít projekt** (<kbd>Ctrl</kbd>+<kbd>O</kbd>) nebo přetažením do aplikace.
- **Vložte výkres do zprávy.** **☰ → Exportovat obrázek** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) ho uloží jako PNG nebo SVG.

Model se také průběžně ukládá v prohlížeči, takže ho obnovením stránky neztratíte. Podrobnosti najdete v kapitole [Import, export a sdílení](/cs/essentials/import-export).

## Kam dál {#where-next}

::card-grid{cols="2"}
:::card{title="Návody" icon="lucide:graduation-cap" to="/cs/tutorials/inclined-beam"}
Čtyři modely sestavené krok za krokem a ověřené ručně, od šikmého nosníku po spojitý nosník s poklesem podpory.
:::
:::card{title="Příklady" icon="lucide:library" to="/cs/examples/"}
Hotové nosníky, rámy a příhradové konstrukce, které otevřete jedním kliknutím, s úlohami a výsledky.
:::
:::card{title="Zatížení" icon="lucide:arrow-down-to-line" to="/cs/essentials/loads"}
Lichoběžníkové a osamělé zatížení, změna teploty, uzlové síly a poklesy podpor.
:::
:::card{title="Klávesnice, myš a dotyk" icon="lucide:keyboard" to="/cs/reference/shortcuts"}
Kreslete uzly a prvky přímo na plátně a upravujte model rychleji.
:::
::
