---
description: "Prvky v EduBeamu: kreslení prvků, koncové klouby pro kloubové spoje a příhradové pruty, materiály a průřezy z knihovny nebo z vlastního polygonu."
source: site
---

# Prvky, materiály a průřezy

[EduBeam]{.edubeam} modeluje každý prvek jako nosník mezi dvěma uzly, s materiálem a průřezem. Prvky nakreslíte mezi uzly, tam, kde má konstrukce klouby, uvolníte jejich konce a materiály i průřezy vyberete z knihoven, nebo si zadáte vlastní.

## Prutový prvek {#the-beam-element}

EduBeam má jediný typ prvku: **rovinný Timošenkův nosník** v rovině x–z se třemi stupni volnosti na každém konci (`Dx`, `Dz`, `Ry`). Přenáší normálovou sílu, posouvající sílu i ohybový moment a zahrnuje [smykovou deformaci](#shear-deformation). Příhradový prut je tentýž prvek s [klouby na obou koncích](#end-hinges). Formulaci najdete v [teoretickém manuálu](/cs/elements/beam).

Výsledky po délce prvku jsou v lineárním modelu přesné, takže **na jeden prut stačí jeden prvek**. Uzel uvnitř prutu přidávejte jen tam, kde potřebujete podporu, kloub, změnu průřezu nebo bod, ve kterém chcete odečíst posuny. Kvůli osamělé síle uzel přidávat nemusíte: [osamělá síla](/cs/essentials/loads#concentrated-load) může působit kdekoli po délce prvku.

## Přidání prvků {#adding-elements}

Prvek potřebuje materiál a průřez, proto je přidejte jako první (viz [Materiály](#materials) a [Průřezy](#cross-sections)). Dokud v modelu žádné nejsou, zobrazuje se hlášení *Není definovaný žádný materiál* nebo *Není definovaný žádný průřez* s tlačítkem **Přidat**.

- **Výběrem uzlů.** Záložka *Prvky* → **Přidat prvek** (tlačítko s ikonou **+**), nebo pravé tlačítko na plátně → *Přidat prvek*. Zvolte **Počáteční uzel** a **Koncový uzel**, podle potřeby zaškrtněte pod kterýmkoli z nich **Kloub** a vyberte **Materiál** a **Průřez**. Potřebujete k tomu alespoň dva uzly.
- **Kliknutím.** Záložka *Prvky* → **Přidat prvek** (tlačítko s ikonou kurzoru), nebo při volbě *Přidat prvek* v nabídce plátna podržte <kbd>Ctrl</kbd>. Klikněte na uzel (nebo na prázdné plátno, kde se uzel vytvoří) a pak na další; dalšími kliknutími kreslíte řetěz prvků a klávesou <kbd>Esc</kbd> nebo tlačítkem **Zrušit** kreslení ukončíte. V liště nahoře nastavíte **Kloub na začátku** a **Kloub na konci** pro každý nakreslený prvek. Prvky dostanou první materiál a první průřez v modelu.

![Dialog Přidat prvek](/screenshots/cs/qs-element.webp){.shot-md}

## Orientace prvku {#element-direction}

Každý prvek má vlastní **lokální osy**. Lokální osa x vede od **počátečního uzlu** ke **koncovému uzlu**; lokální osa z je lokální osa x pootočená na obrazovce o 90° ve směru hodinových ručiček. U prvku nakresleného zleva doprava jsou lokální osy totožné s globálními. **Čárkovaná čára** podél každého prvku vyznačuje jeho lokální stranu +z, tzv. „dolní vlákna“.

![Rám nakreslený A → B → C → D: čárkované čáry všech tří prvků leží uvnitř rámu](/screenshots/cs/p2b-element-direction.webp){.shot-md}

V tomto rámu vede prvek 1 nahoru z A do B, takže jeho lokální osa z, a s ní i čárkovaná čára, míří doprava; prvek 3 vede dolů z C do D, takže jeho čárkovaná čára je vlevo. Když rám nakreslíte takto, leží všechny čárkované čáry uvnitř.

Na orientaci záleží:

- u zatížení zadaných v lokálních osách (zaškrtnuté **LCS**), viz [Prvková zatížení](/cs/essentials/loads#element-loads);
- u údaje **Vzdálenost od počátečního uzlu** u osamělé síly;
- u pořadí [koncových sil](/cs/elements/conventions#end-forces-element-results-table) ve výsledcích: `X12, Z12, M12` v počátečním uzlu, `X21, Z21, M21` v koncovém;
- u toho, která strana je „čárkovaná“ v [nastavení průběhů](/cs/essentials/units-settings#viewer-settings).

Orientaci prvku obrátíte tlačítkem **Přehodit pořadí uzlů** (šipky mezi oběma uzly v tabulce *Prvky*).

## Koncové klouby {#end-hinges}

Koncový kloub uvolní ohybový moment na jednom konci prvku: moment je tam nulový a konec se může pootáčet nezávisle na uzlu.

- **Jeden kloub** vytvoří kloubový spoj uvnitř nosníku nebo rámu.
- **Dva klouby** udělají z prvku **příhradový prut**, který přenáší pouze normálovou sílu.

Zaškrtnete je na kterémkoli z těchto míst:

- ve sloupci **Koncové klouby** tabulky *Prvky*, jedno políčko pro každý konec;
- políčky **Kloub** v dialogu **Přidat prvek** nebo v panelu prvku → **Upravit prvek**;
- volbami **Kloub na začátku** a **Kloub na konci** v liště nahoře při kreslení myší.

![Tabulka Prvky trojkloubového rámu: prvek 2 má kloub na konci, v uzlu C](/screenshots/cs/elements-table.webp)

### Jeden kloub: vnitřní kloub v konstrukci {#one-hinge-a-pin-inside-the-structure}

Stejný spojitý nosník o dvou polích po 5 m se zatížením 10 kN/m. Vpravo má prvek 1 kloub na konci v B: moment nad podporou klesne na nulu a každé pole nese své zatížení jako prostý nosník.

::div{.shots}

:::model-figure{caption="Spojitý nosník: nad B je M = −31,25 kNm"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

:::model-figure{caption="S kloubem v B: nad B je M = 0, v každém poli 31,25 kNm"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [{ nodes: [A, B], hinges: [false, true] }, [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

::

Ruční výpočet: spojitý nosník má $M_B = -qL^2/8 = -31{,}25\ \text{kNm}$ a v každém poli nejvýše $9qL^2/128 = 17{,}58\ \text{kNm}$; s kloubem je $M_B = 0$ a $M_{max} = qL^2/8 = 31{,}25\ \text{kNm}$ uprostřed každého pole. Kloub podporu odlehčí, ale momenty v polích téměř zdvojnásobí. Nosník s vnitřním kloubem si můžete spočítat ručně v [úloze G2048](/cs/practice?p=G2048) z Procvičování, která vaše odpovědi kontroluje už během psaní.

### Dva klouby: příhradový prut {#both-hinges-a-truss-bar}

Nástěnná konzola ze dvou prutů s klouby na obou koncích nese v B sílu 20 kN. Pruty přenášejí jen normálovou sílu a průběh momentů je prázdný.

::model-figure{caption="Táhlo AB: N = +26,67 kN (tah); vzpěra CB: N = −33,33 kN (tlak)"}
---
nodes: { A: [0, 0], B: [4, 0], C: [0, 3] }
supports: { A: pin, C: pin }
members: [{ nodes: [A, B], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: B, fz: 20 }
results: [N, M]
show: [nodeLabels]
---
::

Ruční výpočet: vzpěra je dlouhá 5 m a stoupá o 3 m, takže $N_{CB} = -20 \cdot 5/3 = -33{,}33\ \text{kN}$, a táhlo vyrovnává její vodorovnou složku, $N_{AB} = 33{,}33 \cdot 4/5 = 26{,}67\ \text{kN}$. Celou příhradovou konstrukci takto sestavíte v [návodu k příhradové konstrukci](/cs/tutorials/truss) a příhradové konstrukce k ručnímu řešení najdete v [Procvičování](/cs/practice?p=T2048).

### Kloub patří prvku, ne uzlu {#hinge-the-element-not-the-node}

Kloub patří k jednomu konci jednoho prvku: uvolní pootočení právě tohoto konce, zatímco všechny ostatní prvky zůstanou s uzlem tuhě spojené. Kde se stýkají dva prvky, stačí ke kloubovému spoji jeden kloub; kde se jich stýká víc, dejte kloub všem kromě jednoho. Ve styčníku příhradové konstrukce, kde jsou všechny pruty příhradové, mají kloub všechny.

Uzel, ve kterém mají všechny prvky kloub, nemá žádnou tuhost v pootočení. EduBeam takový uzel přijme a jeho pootočení uvede jako 0. Pokud se konstrukce kvůli kloubům stane mechanismem, EduBeam klouby zakroužkuje a ukáže, jak se konstrukce pohybuje; viz [Řešení problémů](/cs/reference/troubleshooting#messages).

## Úprava a mazání {#editing-and-deleting}

| Co chcete | Postup |
| --- | --- |
| Změnit uzly, klouby, materiál nebo průřez | Klikněte na prvek → **Upravit prvek**, nebo ho upravte v tabulce *Prvky*. |
| Obrátit ho | **Přehodit pořadí uzlů** v tabulce *Prvky*. |
| Přejmenovat ho | Zadejte nové označení ve sloupci *Prvek*. |
| Zobrazit matici tuhosti | Klikněte na prvek → **Matice tuhosti**, nebo použijte tlačítko matice ve sloupci *Akce*. V okně se zobrazí matice prvku 6 × 6 v globálních osách, v jednotkách SI (N a m) bez ohledu na zobrazené jednotky, koncové klouby jsou už vyloučené statickou kondenzací. Hodí se pro kontrolu ručně sestavené matice. |
| Smazat ho | Klikněte na prvek → **Smazat**, použijte × v tabulce, nebo prvek vyberte a stiskněte <kbd>Delete</kbd>. Smažou se i jeho zatížení. |

![Panel prvku](/screenshots/cs/ui-element-menu.webp){.shot-xs}

## Materiály {#materials}

Záložka *Materiály* → **Přidat materiál**, nebo **Knihovna materiálů**, chcete-li hotový materiál. Jeden materiál může používat mnoho prvků; když ho změníte, změní se u všech.

| Pole | Jednotka | K čemu slouží |
| --- | --- | --- |
| Modul pružnosti $E$ | MPa | Osová a ohybová tuhost, $EA$ a $EI_y$. Ocel 210 000 MPa, beton asi 30 000 MPa, dřevo asi 11 000 MPa. |
| Smykový modul $G$ | MPa | Smyková tuhost $kGA$. Pokud součinitel $k$ průřezu není extrémně velký, přidá [smykovou deformaci](#shear-deformation): větší průhyby a u staticky neurčité konstrukce i jiné vnitřní síly. $G = E/(2(1+\nu))$: ocel asi 81 000 MPa. |
| Hustota $\rho$ | kg/m³ | Ukládá se s materiálem, ale nepoužívá se: zatížení vlastní tíhou EduBeam nemá. |
| Součinitel teplotní roztažnosti $\alpha$ | 1/K | Používá ho [změna teploty](/cs/essentials/loads#temperature-load). Ocel $12 \times 10^{-6}$ 1/K. |

Uvedené jednotky jsou výchozí jednotky SI. Řídí se vaším [nastavením](/cs/essentials/units-settings#units), takže v amerických jednotkách jsou E a G v ksi, hustota v lb/ft³ a α v 1/°F.

Nový materiál má výchozí hodnoty $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2{,}4$, tedy $\nu = 0{,}2$), $\rho$ = 1000 kg/m³ a $\alpha = 12 \times 10^{-6}$ 1/K; v amerických jednotkách je to ocel ASTM A992. U oceli změňte $G$ na 81 000 MPa, nebo vyberte ocel z knihovny.

![Dialog Přidat materiál](/screenshots/cs/qs-material.webp){.shot-md}

**Knihovna materiálů** (v dialogu Přidat materiál také *Nebo vybrat z knihovny*) uvádí nejdřív metrické materiály (EN), nebo americké (oceli ASTM, beton ACI), když máte délky ve stopách nebo palcích. Tlačítko **+** v řádku přidá daný materiál pod jeho názvem:

| Skupina | Materiály |
| --- | --- |
| Kovy | Oceli S235, S275, S355; nerezové oceli 304, 316; litina; hliník 6061-T6, 7075-T6, 5083; měď, mosaz, bronz; titan Grade 2 a Ti-6Al-4V; americké oceli ASTM A992, A36, A572 Gr. 50 a HSS A500 Gr. C |
| Beton | C25/30, C30/37, C40/50, lehký beton; americký $f'_c$ = 4 ksi a 5 ksi |
| Dřevo | C24, GL24h, GL32h |
| Ostatní | Sklo, GFRP, CFRP, HDPE, PVC, PMMA, polykarbonát |

Materiál, který ještě používají nějaké prvky, nelze smazat: nejdřív těmto prvkům přiřaďte jiný materiál.

## Průřezy {#cross-sections}

Záložka *Průřezy* → **Přidat průřez**, **Knihovna průřezů**, nebo **Polygonální průřez**, chcete-li nakreslit vlastní tvar. Stejně jako materiál může jeden průřez používat mnoho prvků.

| Pole | Jednotka | K čemu slouží |
| --- | --- | --- |
| Plocha $A$ | m² | Osová tuhost $EA$ a smyková plocha $kA$. |
| Moment setrvačnosti $I_y$ | m⁴ | Ohybová tuhost $EI_y$ k ose kolmé na rovinu výkresu. |
| Výška $h$ | m | Používá ji jen změna teploty: křivost je $\alpha\,(\Delta T_d - \Delta T_h)/h$. |
| Smykový součinitel $k$ | – | Účinná smyková plocha je $kA$, smyková tuhost tedy $kGA$. Pro obdélník asi 0,83, pro I-profil $A_{stojina}/A$. |

Nový průřez má výchozí hodnoty $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m a $k$ = 1 (v amerických jednotkách je to W12×26 s $k$ = 1). Nahraďte je hodnotami svého průřezu, nebo vyberte průřez z knihovny.

::callout{type="tip" title="Shoda s učebnicí, která zanedbává smykovou deformaci"}
Většina ručních výpočtů vychází z Bernoulliho–Navierovy teorie, tedy bez smykové deformace. Chcete-li dostat stejné výsledky, zadejte $k$ velmi velké, například `1e10`; příklady v aplikaci i obrázky na tomto webu používají `1e32`. Nový průřez ($k = 1$), knihovna i editor polygonu smykovou deformaci zahrnují; o kolik výsledky mění, ukazuje [oddíl níže](#shear-deformation).
::

**Knihovna průřezů** nabízí přibližné hodnoty pro:

| Skupina | Průřezy | $k$ |
| --- | --- | --- |
| Plné průřezy | Obdélníky, čtverce, kruhy | 0,833 (obdélník), 0,9 (kruh) |
| I-profily | IPE 100, IPE 200, HEA 100, HEA 200; profily AISC W od W8×31 do W36×150 | $h\,t_w/A$, stojina |
| Obdélníkové trubky | RHS 100×50×3, 150×100×5; AISC HSS | $2ht/A$, obě stojiny |
| Kruhové trubky | CHS Ø60×3, Ø114×5; kruhové AISC HSS | 0,5 |

Hodnoty z knihovny si před použitím ověřte v tabulkách průřezů.

![Knihovna průřezů](/screenshots/cs/sections-library.webp){.shot-lg}

Pro rychlou ruční kontrolu: obdélník $b \times h$ má $A = bh$ a $I_y = bh^3/12$, plný kruh o průměru $d$ má $A = \pi d^2/4$ a $I_y = \pi d^4/64$.

### Smyková deformace: kdy záleží na G a k {#shear-deformation}

Smyková tuhost $kGA$ vstupuje do prvku přes [smykový parametr](/cs/elements/beam#timoshenko-or-euler-bernoulli) $\Phi = 12EI_y/(kGAL^2)$. Při velmi velkém $k$ je $\Phi = 0$ a prvek se chová jako Bernoulliho–Navierův nosník, takže $G$ nemá žádný vliv. Se skutečným $k$ smyková deformace průhyby vždy zvětší. U staticky určité konstrukce zůstanou vnitřní síly stejné; u neurčité se změní také, protože staticky neurčité veličiny závisejí na tuhosti.

Jak moc, záleží na tom, jak je prut podsaditý. Nosník z profilu IPE 200 z knihovny ($k = h\,t_w/A = 0{,}393$) z oceli S235 ($G$ = 81 000 MPa), zatížený 10 kN/m, v porovnání s týmž nosníkem s $k$ = `1e32`:

| Nosník | Se smykovou deformací | Bernoulli–Navier |
| --- | --- | --- |
| Prostý nosník, $L$ = 2 m ($L/h$ = 10): průhyb uprostřed | 0,566 mm | 0,511 mm |
| Vetknutí a posuvný kloub, $L$ = 2 m: moment ve vetknutí | −4,84 kNm | −5,00 kNm |
| Prostý nosník, $L$ = 6 m ($L/h$ = 30): průhyb uprostřed | 41,85 mm | 41,36 mm |

Ruční výpočet: smyková část průhybu uprostřed je $qL^2/(8kGA)$, u krátkého nosníku 0,055 mm, tedy 11 % navíc k ohybové části $5qL^4/(384EI_y)$. U nosníku s vetknutím a posuvným kloubem klesne moment ve vetknutí z $qL^2/8$ na $(qL^2/8)/(1 + \Phi/4)$. Při $L/h$ = 30 jsou oba vlivy kolem 1 % nebo menší, a proto se štíhlé rámy s učebnicovými výsledky shodují bez ohledu na $k$.

### Polygonální průřezy {#polygonal-sections}

Záložka *Průřezy* → **Polygonální průřez**, případně volba *Nebo zadat polygonální tvar* v dialogu Přidat průřez, otevře editor tvaru, který průřezové charakteristiky spočítá za vás.

![Editor polygonálního průřezu s předlohou I-profilu, jeho hlavními osami a elipsou setrvačnosti](/screenshots/cs/sections-polygon.webp)

::div{.steps}

### Začněte předlohou {#start-from-a-preset}

V poli **Předloha** vyberte tvar (obdélník, I-profil, T-profil, L-profil, U-profil, obdélníková trubka, kruh, kruhová trubka), zadejte jeho rozměry a stiskněte **Použít**.

### Upravte tvar {#adjust-the-shape}

Táhněte vrcholy (přichytávají se podle pole **Krok přichytávání**), kliknutím na střed hrany vložte vrchol, dvojklikem na vrchol ho odstraňte. Souřadnice můžete zadat i v tabulce **Vrcholy**. **Přidat otvor** přidá vnitřní obrys a **Vystředit do těžiště** posune tvar tak, aby jeho těžiště leželo v počátku.

### Odečtěte charakteristiky {#read-the-properties}

Záložka **Průřezové charakteristiky** ukazuje $A$, těžiště, těžišťové momenty setrvačnosti $I_y$, $I_z$, $I_{yz}$, hlavní momenty setrvačnosti $I_1$, $I_2$ s údajem **Úhel hlavních os** $\alpha$ (od $y$ k ose 1) a poloměry setrvačnosti. Na obrázku jsou vidět hlavní osy a elipsa setrvačnosti.

### Přidejte průřez {#add-it}

Zkontrolujte **Označení** a **Smykový součinitel** $k$: začíná na 0,833, což odpovídá obdélníku; I-profil potřebuje asi $A_{stojina}/A$. Pak stiskněte **Přidat průřez** (**Uložit**, když upravujete existující tvar). $A$, $I_y$ a $h$ se odvodí z tvaru a v tabulce je nelze měnit; chcete-li je změnit, upravte tvar znovu tlačítkem polygonu ve sloupci *Akce*.

::

Souřadný systém průřezu je lokální a pravotočivý: $x$ míří ven z obrazovky, $y$ doleva a $z$ dolů.

Pokud tvar není symetrický k rovině rámu (například úhelník L), editor vás upozorní: 2D výpočet je přesný jen tehdy, je-li prut po celé délce zajištěn proti vybočení do strany a proti zkroucení, například deskou. Pokud je deviační moment $I_{yz}$ významný, zvolíte, s jakou ohybovou tuhostí se počítá: **zajištěn do strany a proti zkroucení po celé délce** ($I_y$), nebo **volně vychýlitelný do strany**, což dává nižší tuhost. Zkroucení nezahrnuje ani jedna z možností.
