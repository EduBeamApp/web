---
description: "Stručné odpovede o EduBeame: cena, práca offline, súkromie, presnosť, ako sa výsledky počítajú, ako EduBeam citovať, úlohy na precvičenie, zdieľanie a kód."
source: site
---

# Často kladené otázky

Stručné odpovede, každá s odkazom na stránku, ktorá tému rozoberá podrobne. Nenašli ste svoju otázku? Pozrite si [Riešenie problémov](/sk/reference/troubleshooting) alebo sa [opýtajte na GitHube](https://github.com/janvorisek/edubeam/issues).

## Všeobecné {#general}

### Čo je EduBeam? {#what-is-edubeam}

Bezplatná open-source aplikácia na lineárny statický výpočet rovinných nosníkov, rámov a priehradových konštrukcií, určená študentom, vyučujúcim a inžinierom, ktorí chcú okamžitú spätnú väzbu. Beží v prehliadači. Čo dokáže a čo nie, nájdete v [Úvode](/sk/guide/introduction).

### Je naozaj zadarmo? Potrebujem účet? {#is-it-really-free-do-i-need-an-account}

Áno, je zadarmo, a nie, účet nepotrebujete. Otvorte [run.edubeam.app](https://run.edubeam.app/?lang=sk){target="_blank"} a rovno modelujte: nič sa neinštaluje a používanie nemá žiadne limity. Zdrojový kód je na [GitHube](https://github.com/janvorisek/edubeam) pod licenciou GPL-3.0.

### V akých prehliadačoch a zariadeniach EduBeam funguje? {#which-browsers-and-devices-work}

V každom aktuálnom prehliadači Chrome, Edge, Firefox alebo Safari, na počítači, tablete aj telefóne. Na dotykovej obrazovke ťuknutím vyberáte, ťahaním uzla ho presúvate, ťahaním inde posúvate zobrazenie, roztiahnutím prstov približujete a dlhým podržaním otvoríte ponuku plátna. Myšou a klávesnicou sa však modeluje rýchlejšie. Pozrite [Klávesnica, myš a dotyk](/sk/reference/shortcuts#touch).

### Stratil sa mi model. Dá sa obnoviť? {#i-lost-my-model-can-i-get-it-back}

Pravdepodobne áno. Keď sa model vymaže alebo ho nahradí odkaz, súbor či príklad, EduBeam ho uloží do **☰ → Nedávne konštrukcie** (posledných 10) a nahradenie vrátite aj klávesmi <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Oboje však funguje iba v tomto prehliadači, takže model z iného počítača alebo iného profilu prehliadača tam nenájdete. Pozrite [Nedávne konštrukcie](/sk/essentials/import-export#recent-structures).

### Funguje EduBeam aj offline? {#can-i-use-it-offline}

Áno. EduBeam je progresívna webová aplikácia: len čo ju prehliadač raz načíta, funguje aj bez pripojenia a prehliadač môže ponúknuť jej inštaláciu. Keď vyjde nová verzia, aplikácia sa vás pred aktualizáciou opýta.

### Kde sú moje dáta uložené? {#where-is-my-data-stored}

Vo vašom prehliadači. Neexistujú žiadne účty ani cloudové úložisko: aplikácia uchováva váš model a nastavenia v tomto prehliadači a odkaz na zdieľanie nesie model priamo v sebe. Pozrite [Čo sa ukladá v prehliadači](/sk/essentials/units-settings#what-is-stored-in-your-browser).

Aplikácia na run.edubeam.app však zbiera štatistiky používania (Google Analytics) a hlásenia chýb (Sentry). Hlásenie chyby aj záznam, ktorý Sentry vytvára pri niektorých reláciách, môže obsahovať to, čo bolo na obrazovke, a teda aj váš model.

### Kde si môžem precvičiť úlohy zo statiky? {#practice}

Na stránke [Precvičovanie](/sk/practice). Zakaždým vám zadá nosník, rám alebo priehradovú konštrukciu s novými číslami: na papieri vypočítajte reakcie a najväčší ohybový moment alebo silu v prúte, zadajte ich a každá hodnota sa hneď skontroluje. Otázky s odpoveďami nájdete aj pri [príkladoch](/sk/examples/). Vyučujúci môžu v [Generátore písomiek](/sk/exam) vytlačiť každému študentovi inú písomku aj s kľúčom riešení; pozrite [Precvičovanie a písomky](/sk/guide/teaching#practice-and-test-papers).

### Ako EduBeam citovať? {#cite}

Ako softvér, s verziou a dátumom, kedy ste ho použili. Verziu nájdete dole v ponuke **☰**. Napríklad:

> Voříšek, J. a kol. *EduBeam*, verzia 1.3.4 \[softvér\]. https://edubeam.app (citované 18. novembra 2026).

Ak chcete odkázať na konkrétny model, pridajte jeho [odkaz na zdieľanie](/sk/essentials/import-export#share-a-link): každému čitateľovi otvorí ten istý model.

## Modelovanie {#modelling}

### Ako zadám votknutie, pevný kĺb alebo posuvný kĺb? {#how-do-i-make-a-fixed-pinned-roller-support}

Kliknite na uzol, zvoľte **Podpery uzla** a vyberte značku: pevný kĺb, posuvný kĺb, votknutie, posuvné votknutie a ďalšie. Druhou možnosťou je zaškrtnúť podopreté stupne voľnosti na karte **Uzly**: `Dx` + `Dz` + `Ry` je votknutie, `Dx` + `Dz` pevný kĺb a samotné `Dz` posuvný kĺb. Všetky typy nájdete v kapitole [Uzly a podpery](/sk/essentials/nodes-supports#supports).

### Ako vytvorím priehradovú konštrukciu? {#how-do-i-make-a-truss}

Prúty nakreslite ako bežné prvky a pri každom uvoľnite oba konce: na karte **Prvky** zaškrtnite oba **Koncové kĺby** alebo pred kreslením prútov myšou zaškrtnite v lište **Kĺb na začiatku** a **Kĺb na konci**. Zaťaženie zadávajte do uzlov. Krok za krokom vás prevedie návod [Rovinná priehradová konštrukcia](/sk/tutorials/truss).

### Ako vložím do rámu kĺb? {#how-do-i-put-a-hinge-in-a-frame}

Uvoľnite moment na konci prvku, ktorý sa má voľne otáčať: na karte **Prvky** zaškrtnite jeho koncový kĺb. Kĺb patrí vždy k jednému koncu prvku, takže keď v uzle, kde sa stretáva niekoľko prvkov, uvoľníte iba jeden z nich, ostatné zostanú tuho spojené. Pozrite [Koncové kĺby](/sk/essentials/elements#end-hinges).

### Ako pridám podperu alebo osamelú silu doprostred nosníka? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Pre podperu pridajte na nosník uzol myšou (tlačidlo **Pridať uzol** s ikonou kurzora) a zvoľte **Pripojiť ku konštrukcii**: nosník sa v tomto uzle rozdelí na dva a uzol potom môžete podoprieť. Osamelá sila uzol nepotrebuje: pridajte prvku zaťaženie **Osamelá sila** a zadajte jej vzdialenosť od počiatočného uzla. Pozrite [Umiestnenie uzla na existujúci prvok](/sk/essentials/nodes-supports#placing-a-node-on-an-existing-element) a [Osamelá sila](/sk/essentials/loads#concentrated-load).

### Dá sa zadať vlastná tiaž? {#can-i-apply-self-weight}

Automaticky nie: hustota materiálu sa pri statickom výpočte nepoužíva. Zadajte vlastnú tiaž ako rovnomerné spojité zaťaženie $f_z = \rho g A$, napríklad pre IPE 200 $7850 \cdot 9{,}81 \cdot 28{,}48 \cdot 10^{-4} = 219$ N/m, teda 0,22 kN/m.

### Dajú sa modelovať šikmé podpery? {#can-i-model-inclined-supports}

Áno. Nastavte pri uzle **Pootočenie súradného systému** a jeho podpery potom pôsobia v smere pootočených osí. Pozrite [Šikmé podpery](/sk/essentials/nodes-supports#inclined-skewed-supports).

### Môžem pracovať v amerických jednotkách? {#can-i-work-in-us-customary-units}

Áno. Kliknite na štítok jednotiek vpravo dole v zobrazení, ktorý otvorí **Nastavenia → Jazyk a prostredie**, a v poli **Sústava jednotiek** zvoľte **Americká (imperiálna)** pre stopy a kipy alebo si vyberte každú jednotku zvlášť. Model sa ukladá v SI, takže prepnutie jednotiek iba prepočíta zobrazené hodnoty a model nikdy nezmení. Pozrite [Jednotky a nastavenia](/sk/essentials/units-settings).

### Sú k dispozícii zaťažovacie stavy alebo kombinácie? {#are-there-load-cases-or-combinations}

Nie, model má iba jeden zaťažovací stav. Každý stav uložte ako samostatný súbor alebo odkaz a výsledky skombinujte sami. Relácia z desktopového EduBeamu s viacerými zaťažovacími stavmi sa otvorí s prvým z nich a hlásenie vypíše tie vynechané.

### Prečo moje zaťaženie smeruje nahor? {#why-do-my-loads-point-up}

Pravdepodobne preto, že ste zadali zápornú hodnotu. V EduBeame smeruje globálna os z **nadol**, takže kladné `fz` alebo `Fz` je zaťaženie pôsobiace nadol, ako tiaž: 12 kN/m nadol zadáte ako `fz = 12`. Pozrite [Súradný systém a znamienková konvencia](/sk/elements/conventions#loads). Ak vo vašom predmete smeruje zvislá os nahor, prepnite v **Nastavenia → Jazyk a prostredie → Súradný systém** na **x doprava, y nahor**: vstupy aj výsledky sa potom riadia touto osou.

## Výsledky {#results}

### Prečo chýba tlačidlo „Vypočítať“? {#why-is-there-no-solve-button}

Pretože sa model po každej zmene vypočíta znova sám. Ak sa výsledky neobjavia, model zatiaľ nemožno vyriešiť a hlásenie na plátne povie prečo. Čo skontrolovať, nájdete v kapitole [Riešenie problémov](/sk/reference/troubleshooting#no-results-are-drawn).

### Prečo sa môj priehyb mierne líši od vzorca? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam používa Timošenkove nosníkové prvky, takže priehyb zahŕňa aj šmykové deformácie, ktoré vzorce v učebniciach obvykle zanedbávajú. Pri štíhlom nosníku je rozdiel okolo 1 % a [Rýchly štart](/sk/guide/quick-start#_8-check-by-hand) ho ručne dopočíta. V staticky neurčitej konštrukcii šmyková tuhosť mierne posunie aj vnútorné sily. Viac nájdete v kapitole [Ručné overenie výsledkov](/sk/guide/verification).

### Aké presné sú výsledky? Potrebujem viac prvkov? {#how-accurate-are-the-results-do-i-need-more-elements}

Pri lineárnom statickom výpočte je nosníkový prvok presný pre všetky typy zaťaženia, ktoré EduBeam ponúka, takže na každý prút stačí jeden prvok a žiadnu sieť netreba zjemňovať. Ďalšie uzly pridávajte iba tam, kde potrebujete podperu, kĺb, zmenu prierezu, uzlové zaťaženie alebo kde chcete odčítať posunutie. Pozrite [Presnosť výpočtu](/sk/essentials/results#precision-and-accuracy).

### Ako EduBeam výsledky počíta? {#how-does-edubeam-compute-the-results}

Priamo vo vašom prehliadači, deformačnou metódou v podobe metódy konečných prvkov, teda tak, ako sa vyučuje v stavebnej mechanike. Stránka [Ako EduBeam rieši model](/sk/elements/analysis) prechádza jednotlivé kroky na malom príklade, ktorý si môžete zopakovať ručne, a samotný riešič je open source ako knižnica [@edubeam/fem](/sk/solver).

### Môžem si zobraziť matice tuhosti? {#can-i-see-the-stiffness-matrices}

Áno. Na karte **Prvky** otvorí tlačidlo matice v riadku prvku jeho maticu tuhosti 6 × 6 v globálnych osiach a jednotkách SI (N, m). **Maticu tuhosti** ponúka aj panel, ktorý sa otvorí po kliknutí na prvok v zobrazení. Odvodenie nájdete na stránke [Nosníkový prvok](/sk/elements/beam#global-stiffness-matrix).

### Kde nájdem reakcie? {#where-are-the-reactions-listed}

V zobrazení ako šípky s hodnotami: voľba **Reakcie** v možnostiach zobrazenia, predvolene zapnutá. Nájdete ich aj v súbore z **Výsledky → Exportovať CSV** a v tom, čo do schránky uloží **Kopírovať**. Karta **Výsledky** obsahuje posunutia uzlov a koncové sily prvkov. Pozrite [Výsledky a priebehy](/sk/essentials/results).

## Súbory a zdieľanie {#files-sharing}

### Ako zdieľam model? {#how-do-i-share-a-model}

Kliknite na **Zdieľať konštrukciu** a potom na **Kopírovať odkaz**. Odkaz obsahuje celý model a každý, kto ho otvorí, dostane vlastnú kópiu, ktorú môže upravovať: spoločná práca v reálnom čase nie je možná. Keď zapnete **Zobraziť to, čo vidím ja**, odkaz sa otvorí s vašimi priebehmi a popismi. Pozrite [Zdieľanie odkazom](/sk/essentials/import-export#share-a-link) a pre výučbu [Výučba s EduBeamom](/sk/guide/teaching#in-lecture-notes-and-assignments).

### Môžem model vložiť na svoj web alebo do prezentácie? {#can-i-embed-a-model-on-my-website-or-in-slides}

Áno. Pridajte k odkazu na zdieľanie `&viewer=1` a vložte ho do `<iframe>`: pozrite [Vloženie modelu do stránky](/sk/essentials/import-export#embed-a-read-only-viewer). Na statický obrázok na webe, v prezentácii alebo v tlačených skriptách exportujte SVG alebo ho nakreslite z kódu knižnicou [@edubeam/plot](/sk/plot).

### Môžem exportovať obrázky alebo tabuľky? {#can-i-export-images-or-tables}

Áno. **☰ → Exportovať obrázok** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) uloží výkres ako PNG alebo SVG vo zvolenej veľkosti či mierke. **Výsledky → Exportovať CSV** uloží obe tabuľky výsledkov a **Kopírovať** ich skopíruje do schránky, odkiaľ ich vložíte do tabuľkového procesora. Pozrite [Export obrázka](/sk/essentials/import-export#export-an-image).

### Môžem otvoriť súbory z desktopového EduBeamu? {#can-i-open-files-from-the-desktop-edubeam}

Áno. Relácie uložené desktopovým EduBeamom 2.x až 3.5 (`.xml`) otvoríte cez **☰ → Otvoriť projekt** alebo pretiahnutím do aplikácie, rovnako ako `project.json`. Ich hodnoty sa čítajú v kN, kPa a m. Pozrite [Otvorenie projektu](/sk/essentials/import-export#open-a-project).

### Môžem modely generovať programovo? {#can-i-generate-models-programmatically}

Áno, dvoma spôsobmi:

- **Zapíšte súbor.** `project.json` je obyčajný JSON v jednotkách SI, takže ho môže zapísať skript v akomkoľvek jazyku a EduBeam ho otvorí cez **Otvoriť projekt** alebo pretiahnutím. Pozrite [formát súboru projektu](/sk/essentials/import-export#project-file-format).
- **Vypočítajte ho v kóde.** [@edubeam/fem](/sk/solver) je riešič metódou konečných prvkov, na ktorom EduBeam stojí, dostupný ako knižnica pre JavaScript a TypeScript. Výsledok potom nakreslí [@edubeam/plot](/sk/plot), napríklad ako [generované zadanie cvičenia](/sk/plot/exercises).

Nosník z [Rýchleho štartu](/sk/guide/quick-start) v jednotkách SI:

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

## Pomoc a kontakt {#support}

### Ako nahlásim chybu alebo navrhnem novú funkciu? {#how-do-i-report-a-bug-or-request-a-feature}

Založte issue na [GitHube](https://github.com/janvorisek/edubeam/issues) a priložte odkaz na zdieľanie alebo súbor projektu, na ktorom sa problém prejaví. So súkromnými otázkami píšte na [support@edubeam.app](mailto:support@edubeam.app).
