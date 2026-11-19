---
description: "Stručné odpovědi o EduBeamu: cena, práce offline, soukromí, přesnost, jak se výsledky počítají, jak EduBeam citovat, úlohy k procvičení, sdílení a kód."
source: site
---

# Často kladené otázky

Stručné odpovědi, každá s odkazem na stránku, která téma probírá podrobně. Nenašli jste svou otázku? Podívejte se do [Řešení potíží](/cs/reference/troubleshooting) nebo se [zeptejte na GitHubu](https://github.com/janvorisek/edubeam/issues).

## Obecné {#general}

### Co je EduBeam? {#what-is-edubeam}

Bezplatná open-source aplikace pro lineární statický výpočet rovinných nosníků, rámů a příhradových konstrukcí, určená studentům, vyučujícím a inženýrům, kteří chtějí okamžitou zpětnou vazbu. Běží v prohlížeči. Co umí a co ne, najdete v [Úvodu](/cs/guide/introduction).

### Je opravdu zdarma? Potřebuji účet? {#is-it-really-free-do-i-need-an-account}

Ano, je zdarma, a ne, účet nepotřebujete. Otevřete [run.edubeam.app](https://run.edubeam.app/?lang=cs){target="_blank"} a rovnou modelujte: nic se neinstaluje a používání nemá žádné limity. Zdrojový kód je na [GitHubu](https://github.com/janvorisek/edubeam) pod licencí GPL-3.0.

### V jakých prohlížečích a zařízeních EduBeam funguje? {#which-browsers-and-devices-work}

V každém aktuálním prohlížeči Chrome, Edge, Firefox nebo Safari, na počítači, tabletu i telefonu. Na dotykové obrazovce klepnutím vybíráte, tažením uzlu ho přesouváte, tažením jinde posouváte zobrazení, roztažením prstů přibližujete a dlouhým podržením otevřete nabídku plátna. Myší a klávesnicí se ale modeluje rychleji. Viz [Klávesnice, myš a dotyk](/cs/reference/shortcuts#touch).

### Model se mi ztratil. Dá se obnovit? {#i-lost-my-model-can-i-get-it-back}

Nejspíš ano. Když se model smaže nebo ho nahradí odkaz, soubor či příklad, EduBeam ho uloží do **☰ → Nedávné konstrukce** (posledních 10) a nahrazení vrátíte i klávesami <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Obojí ale funguje jen v tomto prohlížeči, takže model z jiného počítače nebo jiného profilu prohlížeče tam nenajdete. Viz [Nedávné konstrukce](/cs/essentials/import-export#recent-structures).

### Funguje EduBeam i offline? {#can-i-use-it-offline}

Ano. EduBeam je progresivní webová aplikace: jakmile ji prohlížeč jednou načte, funguje i bez připojení a prohlížeč může nabídnout její instalaci. Když vyjde nová verze, aplikace se vás před aktualizací zeptá.

### Kde jsou moje data uložená? {#where-is-my-data-stored}

Ve vašem prohlížeči. Neexistují žádné účty ani cloudové úložiště: aplikace uchovává váš model a nastavení v tomto prohlížeči a sdílený odkaz nese model přímo v sobě. Viz [Co se ukládá v prohlížeči](/cs/essentials/units-settings#what-is-stored-in-your-browser).

Aplikace na run.edubeam.app ale sbírá statistiky používání (Google Analytics) a hlášení chyb (Sentry). Hlášení chyby i záznam, který Sentry pořizuje u části relací, může obsahovat to, co bylo na obrazovce, a tedy i váš model.

### Kde si můžu procvičit úlohy ze statiky? {#practice}

Na stránce [Procvičování](/cs/practice). Pokaždé vám zadá nosník, rám nebo příhradovou konstrukci s novými čísly: na papíře spočítejte reakce a největší ohybový moment nebo sílu v prutu, zadejte je a každá hodnota se hned zkontroluje. Otázky a odpovědi mají i [příklady](/cs/examples/). Vyučující mohou v [Generátoru písemek](/cs/exam) vytisknout každému studentovi jinou písemku i s klíčem řešení; viz [Procvičování a písemky](/cs/guide/teaching#practice-and-test-papers).

### Jak EduBeam citovat? {#cite}

Jako software, s verzí a datem, kdy jste ho použili. Verzi najdete dole v nabídce **☰**. Například:

> Voříšek, J. a přispěvatelé. *EduBeam*, verze 1.3.4 \[software\]. https://edubeam.app (citováno 18. listopadu 2026).

Pokud chcete odkázat na konkrétní model, přidejte jeho [sdílený odkaz](/cs/essentials/import-export#share-a-link): každému čtenáři otevře tentýž model.

## Modelování {#modelling}

### Jak zadám vetknutí, kloub nebo posuvný kloub? {#how-do-i-make-a-fixed-pinned-roller-support}

Klikněte na uzel, zvolte **Podepření uzlu** a vyberte značku: kloub, posuvný kloub, vetknutí, posuvné vetknutí a další. Druhou možností je zaškrtnout podepřené stupně volnosti v záložce **Uzly**: `Dx` + `Dz` + `Ry` je vetknutí, `Dx` + `Dz` kloub a samotné `Dz` posuvný kloub. Všechny typy najdete v kapitole [Uzly a podpory](/cs/essentials/nodes-supports#supports).

### Jak vytvořím příhradovou konstrukci? {#how-do-i-make-a-truss}

Pruty nakreslete jako běžné prvky a u každého uvolněte oba konce: v záložce **Prvky** zaškrtněte oba **Koncové klouby**, nebo před kreslením prutů myší zaškrtněte v liště **Kloub na začátku** a **Kloub na konci**. Zatížení zadávejte do styčníků. Krok za krokem vás provede [návod pro příhradovou konstrukci](/cs/tutorials/truss).

### Jak vložím do rámu kloub? {#how-do-i-put-a-hinge-in-a-frame}

Uvolněte moment na konci prvku, který se má volně otáčet: v záložce **Prvky** zaškrtněte jeho koncový kloub. Kloub patří vždy k jednomu konci prvku, takže když ve styčníku několika prvků uvolníte jen jeden z nich, ostatní zůstanou spojené tuze. Viz [Koncové klouby](/cs/essentials/elements#end-hinges).

### Jak přidám podporu nebo osamělou sílu doprostřed nosníku? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Pro podporu přidejte na nosník uzel myší (tlačítko **Přidat uzel** s ikonou kurzoru) a zvolte **Připojit ke konstrukci**: nosník se v tomto uzlu rozdělí na dva a uzel pak můžete podepřít. Osamělá síla uzel nepotřebuje: přidejte prvku zatížení **Osamělá síla** a zadejte jeho vzdálenost od počátečního uzlu. Viz [Umístění uzlu na existující prvek](/cs/essentials/nodes-supports#placing-a-node-on-an-existing-element) a [Osamělá síla](/cs/essentials/loads#concentrated-load).

### Lze zadat vlastní tíhu? {#can-i-apply-self-weight}

Automaticky ne: hustota materiálu se při statickém výpočtu nepoužívá. Zadejte vlastní tíhu jako rovnoměrné spojité zatížení $f_z = \rho g A$, například pro IPE 200 $7850 \cdot 9{,}81 \cdot 28{,}48 \cdot 10^{-4} = 219$ N/m, tedy 0,22 kN/m.

### Lze modelovat šikmé podpory? {#can-i-model-inclined-supports}

Ano. Nastavte u uzlu **Pootočení systému souřadnic** a jeho podpory pak působí ve směru pootočených os. Viz [Šikmé podpory](/cs/essentials/nodes-supports#inclined-skewed-supports).

### Můžu pracovat v amerických jednotkách? {#can-i-work-in-us-customary-units}

Ano. Klikněte na štítek jednotek vpravo dole v zobrazení, který otevře **Nastavení → Jazyk a prostředí**, a v poli **Soustava jednotek** zvolte **Americká (imperiální)** pro stopy a kipy, nebo si vyberte každou jednotku zvlášť. Model se ukládá v SI, takže přepnutí jednotek jen přepočítá zobrazené hodnoty a model nikdy nezmění. Viz [Jednotky a nastavení](/cs/essentials/units-settings).

### Jsou k dispozici zatěžovací stavy nebo kombinace? {#are-there-load-cases-or-combinations}

Ne, model má jen jeden zatěžovací stav. Každý stav uložte jako samostatný soubor nebo odkaz a výsledky zkombinujte sami. Relace z desktopového EduBeamu s více zatěžovacími stavy se otevře s prvním z nich a hlášení vypíše ty vynechané.

### Proč moje zatížení míří nahoru? {#why-do-my-loads-point-up}

Nejspíš proto, že jste zadali zápornou hodnotu. V EduBeamu míří globální osa z **dolů**, takže kladné `fz` nebo `Fz` je zatížení působící dolů, jako tíha: 12 kN/m dolů zadáte jako `fz = 12`. Viz [Souřadný systém a znaménková konvence](/cs/elements/conventions#loads). Pokud ve vašem kurzu míří svislá osa nahoru, přepněte v **Nastavení → Jazyk a prostředí → Souřadnicový systém** na **x doprava, y nahoru**: vstupy i výsledky se pak řídí touto osou.

## Výsledky {#results}

### Proč chybí tlačítko „Spočítat“? {#why-is-there-no-solve-button}

Protože se model po každé změně spočítá znovu sám. Pokud se výsledky neobjeví, model zatím nejde vyřešit a hlášení na plátně řekne proč. Co zkontrolovat, najdete v kapitole [Řešení potíží](/cs/reference/troubleshooting#no-results-are-drawn).

### Proč se můj průhyb mírně liší od vzorce? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam používá Timošenkovy nosníkové prvky, takže průhyb zahrnuje i smykovou deformaci, kterou vzorce v učebnicích obvykle zanedbávají. U štíhlého nosníku je rozdíl kolem 1 % a [Rychlý start](/cs/guide/quick-start#_8-check-by-hand) ho ručně dopočítá. Ve staticky neurčité konstrukci smyková tuhost mírně posune i vnitřní síly. Více najdete v kapitole [Ověření výsledků ručně](/cs/guide/verification).

### Jak přesné jsou výsledky? Potřebuji víc prvků? {#how-accurate-are-the-results-do-i-need-more-elements}

Při lineárním statickém výpočtu je nosníkový prvek přesný pro všechny typy zatížení, které EduBeam nabízí, takže na každý prut stačí jeden prvek a žádnou síť není potřeba zjemňovat. Další uzly přidávejte jen tam, kde potřebujete podporu, kloub, změnu průřezu, uzlové zatížení nebo kde chcete odečíst posun. Viz [Přesnost výpočtu](/cs/essentials/results#precision-and-accuracy).

### Jak EduBeam výsledky počítá? {#how-does-edubeam-compute-the-results}

Přímo ve vašem prohlížeči, deformační metodou v podobě metody konečných prvků, tedy tak, jak se vyučuje ve stavební mechanice. Stránka [Jak EduBeam řeší model](/cs/elements/analysis) prochází jednotlivé kroky na malém příkladu, který si můžete zopakovat ručně, a samotný řešič je open source jako knihovna [@edubeam/fem](/cs/solver).

### Můžu si zobrazit matice tuhosti? {#can-i-see-the-stiffness-matrices}

Ano. V záložce **Prvky** otevře tlačítko matice v řádku prvku jeho matici tuhosti 6 × 6 v globálních osách a jednotkách SI (N, m). **Matici tuhosti** nabízí i panel, který se otevře po kliknutí na prvek v zobrazení. Odvození najdete na stránce [Nosníkový prvek](/cs/elements/beam#global-stiffness-matrix).

### Kde najdu reakce? {#where-are-the-reactions-listed}

V zobrazení jako šipky s hodnotami: volba **Reakce** v možnostech zobrazení, ve výchozím stavu zapnutá. Najdete je také v souboru z **Výsledky → Exportovat CSV** a v tom, co do schránky uloží **Kopírovat**. Záložka **Výsledky** obsahuje posuny uzlů a koncové síly prvků. Viz [Výsledky a průběhy](/cs/essentials/results).

## Soubory a sdílení {#files-sharing}

### Jak model nasdílím? {#how-do-i-share-a-model}

Stiskněte **Sdílet konstrukci** a pak **Kopírovat**. Odkaz obsahuje celý model a každý, kdo ho otevře, dostane vlastní kopii, kterou může upravovat: společná práce v reálném čase možná není. Když zapnete **Zobrazit to, co vidím já**, odkaz se otevře s vašimi průběhy a popisky. Viz [Sdílení odkazem](/cs/essentials/import-export#share-a-link) a pro výuku [Výuka s EduBeamem](/cs/guide/teaching#in-lecture-notes-and-assignments).

### Můžu model vložit na svůj web nebo do prezentace? {#can-i-embed-a-model-on-my-website-or-in-slides}

Ano. Přidejte ke sdílenému odkazu `&viewer=1` a vložte ho do `<iframe>`: viz [Vložení prohlížeče](/cs/essentials/import-export#embed-a-read-only-viewer). Pro statický obrázek na webu, v prezentaci nebo v tištěných skriptech exportujte SVG, nebo ho nakreslete z kódu knihovnou [@edubeam/plot](/cs/plot).

### Můžu exportovat obrázky nebo tabulky? {#can-i-export-images-or-tables}

Ano. **☰ → Exportovat obrázek** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) uloží výkres jako PNG nebo SVG ve zvolené velikosti či měřítku. **Výsledky → Exportovat CSV** uloží obě tabulky výsledků a **Kopírovat** je zkopíruje do schránky, odkud je vložíte do tabulkového procesoru. Viz [Export obrázku](/cs/essentials/import-export#export-an-image).

### Můžu otevřít soubory z desktopového EduBeamu? {#can-i-open-files-from-the-desktop-edubeam}

Ano. Relace uložené desktopovým EduBeamem 2.x až 3.5 (`.xml`) otevřete přes **☰ → Otevřít projekt** nebo přetažením do aplikace, stejně jako `project.json`. Jejich hodnoty se čtou v kN, kPa a m. Viz [Otevření projektu](/cs/essentials/import-export#open-a-project).

### Můžu modely generovat programově? {#can-i-generate-models-programmatically}

Ano, dvěma způsoby:

- **Zapište soubor.** `project.json` je obyčejný JSON v jednotkách SI, takže ho může zapsat skript v jakémkoli jazyce a EduBeam ho otevře přes **Otevřít projekt** nebo přetažením. Viz [formát souboru projektu](/cs/essentials/import-export#project-file-format).
- **Spočítejte ho v kódu.** [@edubeam/fem](/cs/solver) je řešič metodou konečných prvků, na kterém EduBeam stojí, jako knihovna pro JavaScript a TypeScript. Výsledek pak nakreslí [@edubeam/plot](/cs/plot), například jako [generované zadání cvičení](/cs/plot/exercises).

Nosník z [Rychlého startu](/cs/guide/quick-start) v jednotkách SI:

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // pin
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // roller
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, downward

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 54000 N·m at mid-span
beam.computeLocalDefl(lc, 2).w[1] // 0.0502 m at mid-span
```

## Podpora {#support}

### Jak nahlásím chybu nebo navrhnu novou funkci? {#how-do-i-report-a-bug-or-request-a-feature}

Založte issue na [GitHubu](https://github.com/janvorisek/edubeam/issues) a přiložte sdílený odkaz nebo soubor projektu, na kterém se problém projeví. Se soukromými dotazy pište na [support@edubeam.app](mailto:support@edubeam.app).
