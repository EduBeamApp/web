---
description: "Prvky v EduBeame: kreslenie prvkov, koncové kĺby pre kĺbové spoje a priehradové prúty, materiály a prierezy z knižnice alebo z vlastného polygónu."
source: site
---

# Prvky, materiály a prierezy

[EduBeam]{.edubeam} modeluje každý prvok ako nosník medzi dvoma uzlami, s materiálom a prierezom. Prvky nakreslíte medzi uzlami, tam, kde má konštrukcia kĺby, uvoľníte ich konce a materiály aj prierezy vyberiete z knižníc alebo si zadáte vlastné.

## Nosníkový prvok {#the-beam-element}

EduBeam má jediný typ prvku: **rovinný Timošenkov nosník** v rovine x–z s tromi stupňami voľnosti na každom konci (`Dx`, `Dz`, `Ry`). Prenáša normálovú silu, priečnu silu aj ohybový moment a zahŕňa [šmykové deformácie](#shear-deformation). Priehradový prút je ten istý prvok s [kĺbmi na oboch koncoch](#end-hinges). Formuláciu nájdete v [teoretickej príručke](/sk/elements/beam).

Výsledky po dĺžke prvku sú v lineárnom modeli presné, takže **na jeden prút stačí jeden prvok**. Uzol vnútri prúta pridávajte len tam, kde potrebujete podperu, kĺb, zmenu prierezu alebo bod, v ktorom chcete odčítať posunutia. Kvôli osamelej sile uzol pridávať nemusíte: [osamelá sila](/sk/essentials/loads#concentrated-load) môže pôsobiť kdekoľvek po dĺžke prvku.

## Pridanie prvkov {#adding-elements}

Prvok potrebuje materiál a prierez, preto ich pridajte ako prvé (pozrite [Materiály](#materials) a [Prierezy](#cross-sections)). Kým v modeli žiadne nie sú, zobrazuje sa hlásenie *Nie je definovaný žiadny materiál* alebo *Nie je definovaný žiadny prierez* s tlačidlom **Pridať**.

- **Výberom uzlov.** Karta *Prvky* → **Pridať prvok** (tlačidlo s ikonou **+**) alebo pravé tlačidlo na plátne → *Pridať prvok*. Zvoľte **Počiatočný uzol** a **Koncový uzol**, podľa potreby zaškrtnite pod ktorýmkoľvek z nich **Kĺb** a vyberte **Materiál** a **Prierez**. Potrebujete na to aspoň dva uzly.
- **Kliknutím.** Karta *Prvky* → **Pridať prvok** (tlačidlo s ikonou kurzora) alebo pri voľbe *Pridať prvok* v ponuke plátna podržte <kbd>Ctrl</kbd>. Kliknite na uzol (alebo na prázdne plátno, kde sa uzol vytvorí) a potom na ďalší; ďalšími kliknutiami kreslíte reťaz prvkov a klávesom <kbd>Esc</kbd> alebo tlačidlom **Zrušiť** kreslenie ukončíte. V lište hore nastavíte **Kĺb na začiatku** a **Kĺb na konci** pre každý nakreslený prvok. Prvky dostanú prvý materiál a prvý prierez v modeli.

![Dialóg Pridať prvok](/screenshots/sk/qs-element.webp){.shot-md}

## Orientácia prvku {#element-direction}

Každý prvok má vlastné **lokálne osi**. Lokálna os x vedie od **počiatočného uzla** ku **koncovému uzlu**; lokálna os z je lokálna os x pootočená na obrazovke o 90° v smere hodinových ručičiek. Pri prvku nakreslenom zľava doprava sú lokálne osi totožné s globálnymi. **Čiarkovaná čiara** pozdĺž každého prvku vyznačuje jeho lokálnu stranu +z, tzv. „dolné vlákna“.

![Rám nakreslený A → B → C → D: čiarkované čiary všetkých troch prvkov ležia vnútri rámu](/screenshots/sk/p2b-element-direction.webp){.shot-md}

V tomto ráme vedie prvok 1 nahor z A do B, takže jeho lokálna os z, a s ňou aj čiarkovaná čiara, smeruje doprava; prvok 3 vedie nadol z C do D, takže jeho čiarkovaná čiara je vľavo. Keď rám nakreslíte takto, ležia všetky čiarkované čiary vnútri.

Na orientácii záleží:

- pri zaťaženiach zadaných v lokálnych osiach (zaškrtnuté **LCS**), pozrite [Zaťaženie prvku](/sk/essentials/loads#element-loads);
- pri údaji **Vzdialenosť od počiatočného uzla** pri osamelej sile;
- pri poradí [koncových síl](/sk/elements/conventions#end-forces-element-results-table) vo výsledkoch: `X12, Z12, M12` v počiatočnom uzle, `X21, Z21, M21` v koncovom;
- pri tom, ktorá strana je „čiarkovaná“ v [nastaveniach priebehov](/sk/essentials/units-settings#viewer-settings).

Orientáciu prvku obrátite tlačidlom **Vymeniť poradie uzlov** (šípky medzi oboma uzlami v tabuľke *Prvky*).

## Koncové kĺby {#end-hinges}

Koncový kĺb uvoľní ohybový moment na jednom konci prvku: moment je tam nulový a koniec sa môže pootáčať nezávisle od uzla.

- **Jeden kĺb** vytvorí kĺbový spoj vnútri nosníka alebo rámu.
- **Dva kĺby** urobia z prvku **priehradový prút**, ktorý prenáša iba normálovú silu.

Zaškrtnete ich na ktoromkoľvek z týchto miest:

- v stĺpci **Koncové kĺby** tabuľky *Prvky*, jedno políčko pre každý koniec;
- políčkami **Kĺb** v dialógu **Pridať prvok** alebo v paneli prvku → **Upraviť prvok**;
- voľbami **Kĺb na začiatku** a **Kĺb na konci** v lište hore pri kreslení myšou.

![Tabuľka Prvky trojkĺbového rámu: prvok 2 má kĺb na konci, v uzle C](/screenshots/sk/elements-table.webp)

### Jeden kĺb: vnútorný kĺb v konštrukcii {#one-hinge-a-pin-inside-the-structure}

Ten istý spojitý nosník s dvoma poľami po 5 m a zaťažením 10 kN/m. Vpravo má prvok 1 kĺb na konci v B: moment nad podperou klesne na nulu a každé pole nesie svoje zaťaženie ako prostý nosník.

::div{.shots}

:::model-figure{caption="Spojitý nosník: nad B je M = −31,25 kNm"}
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

:::model-figure{caption="S kĺbom v B: nad B je M = 0, v každom poli 31,25 kNm"}
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

Ručný výpočet: spojitý nosník má $M_B = -qL^2/8 = -31{,}25\ \text{kNm}$ a v každom poli najviac $9qL^2/128 = 17{,}58\ \text{kNm}$; s kĺbom je $M_B = 0$ a $M_{max} = qL^2/8 = 31{,}25\ \text{kNm}$ v strede každého poľa. Kĺb podperu odľahčí, ale momenty v poliach takmer zdvojnásobí. Nosník s vnútorným kĺbom si môžete vypočítať ručne v [úlohe G2048](/sk/practice?p=G2048) z precvičovania, ktorá vaše odpovede kontroluje už počas písania.

### Dva kĺby: priehradový prút {#both-hinges-a-truss-bar}

Nástenná konzola z dvoch prútov s kĺbmi na oboch koncoch nesie v B silu 20 kN. Prúty prenášajú iba normálovú silu a priebeh momentov je prázdny.

::model-figure{caption="Ťahadlo AB: N = +26,67 kN (ťah); vzpera CB: N = −33,33 kN (tlak)"}
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

Ručný výpočet: vzpera je dlhá 5 m a stúpa o 3 m, takže $N_{CB} = -20 \cdot 5/3 = -33{,}33\ \text{kN}$, a ťahadlo vyrovnáva jej vodorovnú zložku, $N_{AB} = 33{,}33 \cdot 4/5 = 26{,}67\ \text{kN}$. Celú priehradovú konštrukciu takto zostavíte v návode [Rovinná priehradová konštrukcia](/sk/tutorials/truss) a priehradové konštrukcie na ručné riešenie nájdete v [precvičovaní](/sk/practice?p=T2048).

### Kĺb patrí prvku, nie uzlu {#hinge-the-element-not-the-node}

Kĺb patrí k jednému koncu jedného prvku: uvoľní pootočenie práve tohto konca, zatiaľ čo všetky ostatné prvky zostanú s uzlom tuho spojené. Kde sa stretávajú dva prvky, na kĺbový spoj stačí jeden kĺb; kde sa ich stretáva viac, dajte kĺb všetkým okrem jedného. V uzle priehradovej konštrukcie, kde sú všetky prúty priehradové, majú kĺb všetky.

Uzol, v ktorom majú všetky prvky kĺb, nemá žiadnu tuhosť v pootočení. EduBeam taký uzol prijme a jeho pootočenie uvedie ako 0. Ak sa konštrukcia pre kĺby stane mechanizmom, EduBeam kĺby zakrúžkuje a ukáže, ako sa konštrukcia pohybuje; pozrite [Riešenie problémov](/sk/reference/troubleshooting#messages).

## Úprava a vymazanie {#editing-and-deleting}

| Čo chcete | Postup |
| --- | --- |
| Zmeniť uzly, kĺby, materiál alebo prierez | Kliknite na prvok → **Upraviť prvok** alebo ho upravte v tabuľke *Prvky*. |
| Obrátiť ho | **Vymeniť poradie uzlov** v tabuľke *Prvky*. |
| Premenovať ho | Zadajte nové označenie v stĺpci *Prvok*. |
| Zobraziť maticu tuhosti | Kliknite na prvok → **Matica tuhosti** alebo použite tlačidlo matice v stĺpci *Akcie*. V okne sa zobrazí matica prvku 6 × 6 v globálnych osiach, v jednotkách SI (N a m) bez ohľadu na zobrazené jednotky, s koncovými kĺbmi už vylúčenými statickou kondenzáciou. Hodí sa na kontrolu ručne zostavenej matice. |
| Vymazať ho | Kliknite na prvok → **Vymazať**, použite × v tabuľke alebo prvok vyberte a stlačte <kbd>Delete</kbd>. Vymažú sa aj jeho zaťaženia. |

![Panel prvku](/screenshots/sk/ui-element-menu.webp){.shot-xs}

## Materiály {#materials}

Karta *Materiály* → **Pridať materiál** alebo **Knižnica materiálov**, ak chcete hotový materiál. Jeden materiál môže používať mnoho prvkov; keď ho zmeníte, zmení sa pri všetkých.

| Pole | Jednotka | Na čo slúži |
| --- | --- | --- |
| Modul pružnosti $E$ | MPa | Osová a ohybová tuhosť, $EA$ a $EI_y$. Oceľ 210 000 MPa, betón približne 30 000 MPa, drevo približne 11 000 MPa. |
| Šmykový modul $G$ | MPa | Šmyková tuhosť $kGA$. Ak súčiniteľ $k$ prierezu nie je extrémne veľký, pridá [šmykové deformácie](#shear-deformation): väčšie priehyby a pri staticky neurčitej konštrukcii aj iné vnútorné sily. $G = E/(2(1+\nu))$: oceľ približne 81 000 MPa. |
| Hustota $\rho$ | kg/m³ | Ukladá sa s materiálom, ale nepoužíva sa: zaťaženie vlastnou tiažou EduBeam nemá. |
| Súčiniteľ teplotnej rozťažnosti $\alpha$ | 1/K | Používa ho [zmena teploty](/sk/essentials/loads#temperature-load). Oceľ $12 \times 10^{-6}$ 1/K. |

Uvedené jednotky sú predvolené jednotky SI. Riadia sa vašimi [nastaveniami](/sk/essentials/units-settings#units), takže v amerických jednotkách sú E a G v ksi, hustota v lb/ft³ a α v 1/°F.

Nový materiál má predvolené hodnoty $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2{,}4$, teda $\nu = 0{,}2$), $\rho$ = 1000 kg/m³ a $\alpha = 12 \times 10^{-6}$ 1/K; v amerických jednotkách je to oceľ ASTM A992. Pri oceli zmeňte $G$ na 81 000 MPa alebo vyberte oceľ z knižnice.

![Dialóg Pridať materiál](/screenshots/sk/qs-material.webp){.shot-md}

**Knižnica materiálov** (v dialógu Pridať materiál aj voľba *Alebo vybrať z knižnice*) uvádza na prvom mieste metrické materiály (EN), a ak máte dĺžky v stopách alebo palcoch, americké (ocele ASTM, betón ACI). Tlačidlo **+** v riadku pridá daný materiál pod jeho názvom:

| Skupina | Materiály |
| --- | --- |
| Kovy | Ocele S235, S275, S355; nehrdzavejúce ocele 304, 316; liatina; hliník 6061-T6, 7075-T6, 5083; meď, mosadz, bronz; titán Grade 2 a Ti-6Al-4V; americké ocele ASTM A992, A36, A572 Gr. 50 a HSS A500 Gr. C |
| Betón | C25/30, C30/37, C40/50, ľahký betón; americký $f'_c$ = 4 ksi a 5 ksi |
| Drevo | C24, GL24h, GL32h |
| Ostatné | Sklo, GFRP, CFRP, HDPE, PVC, PMMA, polykarbonát |

Materiál, ktorý ešte používajú nejaké prvky, nemožno vymazať: najprv týmto prvkom priraďte iný materiál.

## Prierezy {#cross-sections}

Karta *Prierezy* → **Pridať prierez**, **Knižnica prierezov** alebo **Polygonálny prierez**, ak chcete nakresliť vlastný tvar. Rovnako ako materiál môže jeden prierez používať mnoho prvkov.

| Pole | Jednotka | Na čo slúži |
| --- | --- | --- |
| Plocha $A$ | m² | Osová tuhosť $EA$ a šmyková plocha $kA$. |
| Moment zotrvačnosti $I_y$ | m⁴ | Ohybová tuhosť $EI_y$ k osi kolmej na rovinu výkresu. |
| Výška $h$ | m | Používa ju iba zmena teploty: krivosť je $\alpha\,(\Delta T_d - \Delta T_h)/h$. |
| Šmykový súčiniteľ $k$ | – | Účinná šmyková plocha je $kA$, šmyková tuhosť teda $kGA$. Pre obdĺžnik približne 0,83, pre I-profil $A_{stojina}/A$. |

Nový prierez má predvolené hodnoty $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m a $k$ = 1 (v amerických jednotkách je to W12×26 s $k$ = 1). Nahraďte ich hodnotami svojho prierezu alebo vyberte prierez z knižnice.

::callout{type="tip" title="Zhoda s učebnicou, ktorá zanedbáva šmykové deformácie"}
Väčšina ručných výpočtov vychádza z Bernoulliho–Navierovej teórie, teda bez šmykových deformácií. Ak chcete dostať rovnaké výsledky, zadajte $k$ veľmi veľké, napríklad `1e10`; príklady v aplikácii aj obrázky na tomto webe používajú `1e32`. Nový prierez ($k = 1$), knižnica aj editor polygónu šmykové deformácie zahŕňajú; o koľko menia výsledky, ukazuje [časť nižšie](#shear-deformation).
::

**Knižnica prierezov** ponúka približné hodnoty pre:

| Skupina | Prierezy | $k$ |
| --- | --- | --- |
| Plné prierezy | Obdĺžniky, štvorce, kruhy | 0,833 (obdĺžnik), 0,9 (kruh) |
| I-profily | IPE 100, IPE 200, HEA 100, HEA 200; profily AISC W od W8×31 po W36×150 | $h\,t_w/A$, stojina |
| Obdĺžnikové rúry | RHS 100×50×3, 150×100×5; AISC HSS | $2ht/A$, obe stojiny |
| Kruhové rúry | CHS Ø60×3, Ø114×5; kruhové AISC HSS | 0,5 |

Hodnoty z knižnice si pred použitím overte v tabuľkách prierezov.

![Knižnica prierezov](/screenshots/sk/sections-library.webp){.shot-lg}

Na rýchlu ručnú kontrolu: obdĺžnik $b \times h$ má $A = bh$ a $I_y = bh^3/12$, plný kruh s priemerom $d$ má $A = \pi d^2/4$ a $I_y = \pi d^4/64$.

### Šmykové deformácie: kedy záleží na G a k {#shear-deformation}

Šmyková tuhosť $kGA$ vstupuje do prvku cez [šmykový parameter](/sk/elements/beam#timoshenko-or-euler-bernoulli) $\Phi = 12EI_y/(kGAL^2)$. Pri veľmi veľkom $k$ je $\Phi = 0$ a prvok sa správa ako Bernoulliho–Navierov nosník, takže $G$ nemá žiadny vplyv. So skutočným $k$ šmykové deformácie priehyby vždy zväčšia. Pri staticky určitej konštrukcii zostanú vnútorné sily rovnaké; pri neurčitej sa zmenia tiež, pretože staticky neurčité veličiny závisia od tuhosti.

Ako veľmi, závisí od toho, aký je prút zavalitý. Nosník z profilu IPE 200 z knižnice ($k = h\,t_w/A = 0{,}393$) z ocele S235 ($G$ = 81 000 MPa), zaťažený 10 kN/m, v porovnaní s tým istým nosníkom s $k$ = `1e32`:

| Nosník | So šmykovými deformáciami | Bernoulli–Navier |
| --- | --- | --- |
| Prostý nosník, $L$ = 2 m ($L/h$ = 10): priehyb v strede | 0,566 mm | 0,511 mm |
| Jednostranne votknutý nosník, $L$ = 2 m: moment vo votknutí | −4,84 kNm | −5,00 kNm |
| Prostý nosník, $L$ = 6 m ($L/h$ = 30): priehyb v strede | 41,85 mm | 41,36 mm |

Ručný výpočet: šmyková časť priehybu v strede je $qL^2/(8kGA)$, pri krátkom nosníku 0,055 mm, teda 11 % navyše k ohybovej časti $5qL^4/(384EI_y)$. Pri jednostranne votknutom nosníku klesne moment vo votknutí z $qL^2/8$ na $(qL^2/8)/(1 + \Phi/4)$. Pri $L/h$ = 30 sú oba vplyvy okolo 1 % alebo menej, a preto sa štíhle rámy s učebnicovými výsledkami zhodujú bez ohľadu na $k$.

### Polygonálne prierezy {#polygonal-sections}

Karta *Prierezy* → **Polygonálny prierez**, prípadne voľba *Alebo zadať polygonálny tvar* v dialógu Pridať prierez, otvorí editor tvaru, ktorý prierezové charakteristiky vypočíta za vás.

![Editor polygonálneho prierezu s predlohou I-profilu, jeho hlavnými osami a elipsou zotrvačnosti](/screenshots/sk/sections-polygon.webp)

::div{.steps}

### Začnite predlohou {#start-from-a-preset}

V poli **Predloha** vyberte tvar (obdĺžnik, I-profil, T-profil, L-profil, U-profil, obdĺžniková rúra, kruh, kruhová rúra), zadajte jeho rozmery a stlačte **Použiť**.

### Upravte tvar {#adjust-the-shape}

Ťahajte vrcholy (prichytávajú sa podľa poľa **Krok prichytávania**), kliknutím na stred hrany vložte vrchol, dvojklikom na vrchol ho odstráňte. Súradnice môžete zadať aj v tabuľke **Vrcholy**. **Pridať otvor** pridá vnútorný obrys a **Vycentrovať do ťažiska** posunie tvar tak, aby jeho ťažisko ležalo v začiatku súradníc.

### Odčítajte charakteristiky {#read-the-properties}

Karta **Prierezové charakteristiky** ukazuje $A$, ťažisko, ťažiskové momenty zotrvačnosti $I_y$, $I_z$, $I_{yz}$, hlavné momenty zotrvačnosti $I_1$, $I_2$ s údajom **Uhol hlavných osí** $\alpha$ (od $y$ k osi 1) a polomery zotrvačnosti. Na obrázku vidno hlavné osi a elipsu zotrvačnosti.

### Pridajte prierez {#add-it}

Skontrolujte **Označenie** a **Šmykový súčiniteľ** $k$: začína na 0,833, čo zodpovedá obdĺžniku; I-profil potrebuje približne $A_{stojina}/A$. Potom stlačte **Pridať prierez** (**Uložiť**, keď upravujete existujúci tvar). $A$, $I_y$ a $h$ sa odvodia z tvaru a v tabuľke ich nemožno meniť; ak ich chcete zmeniť, upravte tvar znova tlačidlom polygónu v stĺpci *Akcie*.

::

Súradný systém prierezu je lokálny a pravotočivý: $x$ smeruje von z obrazovky, $y$ doľava a $z$ nadol.

Ak tvar nie je symetrický k rovine rámu (napríklad uholník L), editor vás upozorní: 2D výpočet je presný len vtedy, ak je prút po celej dĺžke zaistený proti vybočeniu do strany a proti skrúteniu, napríklad doskou. Ak je deviačný moment $I_{yz}$ významný, zvolíte, s akou ohybovou tuhosťou sa počíta: **zaistený do strany a proti skrúteniu po celej dĺžke** ($I_y$) alebo **voľne vychýliteľný do strany**, čo dáva nižšiu tuhosť. Skrútenie nezahŕňa ani jedna z možností.
