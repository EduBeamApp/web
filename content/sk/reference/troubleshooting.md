---
description: "Prečo EduBeam nezobrazuje výsledky a ako to napraviť: vysvetlenie všetkých chýb a upozornení, podozrivé výsledky a súbory či odkazy, ktoré sa nedajú otvoriť."
source: site
---

# Riešenie problémov

Keď model nemožno vypočítať, [EduBeam]{.edubeam} vám to oznámi hlásením vľavo hore v zobrazení a tlačidlo **Zobraziť podrobnosti** vypíše všetky problémy. Nižšie vyhľadajte nadpis dialógu, ktorý ste videli: pri každom hlásení nájdete, čo znamená a ako ho odstrániť.

::card-grid{cols="2"}
:::card{title="Model zatiaľ nemožno vypočítať" icon="lucide:circle-dashed" to="#still-needed"}
Modrý štítok **Chýbajú podpery**. Nič nie je zle: konštrukcia len ešte nie je podopretá.
:::
:::card{title="Model nemožno vypočítať" icon="lucide:circle-x" to="#errors"}
Červené hlásenie. Podpery, ktoré konštrukciu nedržia, kĺby, ktoré z nej robia mechanizmus, prvok nulovej dĺžky.
:::
:::card{title="Upozornenia k modelu" icon="lucide:triangle-alert" to="#warnings"}
Žlté hlásenie. Model je vypočítaný, ale niečo pravdepodobne nie je tak, ako ste zamýšľali.
:::
:::card{title="Výsledky vyzerajú zle" icon="lucide:scale" to="#results-look-wrong"}
Zaťaženie pôsobí nahor, priehyby sa líšia o rády, znamienko sa zdá obrátené.
:::
::

## Hlásenia {#messages}

### Čo znamenajú farby {#read-the-message}

| Vidíte | Znamená to |
| --- | --- |
| Modrý štítok **Chýbajú podpery** | Model ešte nie je hotový. Pridajte podpery. Keď na štítok ukážete myšou, čiarkovaný obrys ukáže, ako sa konštrukcia ešte môže pohybovať. |
| **Červené** hlásenie | Niečo bráni výpočtu. Hlásenie problém pomenuje, a keď je problémov viac, znie *Chyby v modeli: n*. Problémové uzly sú na výkrese zakrúžkované. |
| **Žlté** hlásenie | Upozornenia. Model sa napriek tomu vypočítal. Keď je upozornení viac, znie *Upozornenia v modeli: n*. |
| *Nie je definovaný žiadny materiál.* / *Nie je definovaný žiadny prierez.* | Prvky potrebujú oboje. Pridajte ich tlačidlom **Pridať** vedľa hlásenia. |

**Zobraziť podrobnosti** otvorí dialóg s nadpisom *Model zatiaľ nemožno vypočítať*, *Model nemožno vypočítať* alebo *Upozornenia k modelu*. Jeho prepínač ukáže alebo skryje, ako sa konštrukcia môže pohybovať, a odkaz **Riešenie problémov** vedie na túto stránku.

![Dialóg Model nemožno vypočítať s prepínačom, ktorý ukáže, ako sa konštrukcia môže pohybovať](/screenshots/sk/ui-diagnostics.webp){.shot-lg}

Na výkrese:

- **✕** na červenom hlásení ho zbalí do malého štítka *Model nemožno vypočítať*, aby na malej obrazovke zostalo miesto. Kliknutím na štítok ho opäť rozbalíte.
- Tlačidlo s **okom** na červenom hlásení ukáže alebo skryje čiarkovaný obrys pohybu. V časti **Nastavenia → Nastavenia zobrazenia → Kontrola modelu** obrys aj jeho animáciu vypnete natrvalo.
- **✕** na žltom hlásení upozornenia skryje.

### Zostáva doplniť {#still-needed}

V modeli nie je chyba, iba ešte nie je hotový. Keď na štítok ukážete myšou, uvidíte krátky text; dialóg ukazuje dlhý.

| Hlásenie | Význam a náprava |
| --- | --- |
| *Konštrukcia potrebuje podpery, inak ju nemožno vypočítať.* <br> *Aby bol model pri 2D výpočte stabilný, musí mať aspoň 3 podopreté stupne voľnosti.* | Celkovo sú podopreté menej ako tri smery. Pridajte podpery. |
| *Časť s uzlami … potrebuje podpery.* <br> *Samostatná časť konštrukcie (uzly …) má menej ako 3 podopreté stupne voľnosti a môže sa voľne pohybovať.* | Model sa rozpadá na časti a jedna z nich nie je ničím podopretá. Pripojte ju k zvyšku alebo ju podoprite. |
| *Podpery chýbajú pri častiach konštrukcie: n.* | Nepodopretých častí je niekoľko. Tlačidlo **Zobraziť podrobnosti** ich všetky vypíše. |

### Chyby {#errors}

Niečo bráni výpočtu. Červené hlásenie ukazuje krátky text, dialóg dlhý.

| Hlásenie | Význam a náprava |
| --- | --- |
| *Podpery konštrukciu nezaisťujú: stále sa môže posúvať vodorovne / posúvať zvislo / voľne otáčať / pohybovať ako tuhý celok.* <br> *Konštrukcia má dostatok podpier, ale tie ju nezaisťujú: stále sa môže …* | Väzieb je dosť, ale všetky sú rovnobežné alebo sa ich nositeľky pretínajú v jednom bode, ako pri troch posuvných kĺboch na vodorovnom nosníku. Čiarkovaný obrys ukazuje pohyb; natočte alebo presuňte jednu z podpier. |
| *Časť s uzlami … nie je zaistená: stále sa môže …* <br> *Samostatná časť konštrukcie (uzly …) má dostatok podpier, ale tie ju nezaisťujú: stále sa môže …* | To isté pre jednu časť modelu, ktorý sa rozpadá na časti. |
| *Kĺby v uzle … umožňujú pohyb konštrukcie.* <br> *Podpery konštrukciu držia, ale napriek tomu je to mechanizmus: jej prúty sa môžu otáčať okolo kĺbov v uzle …* | Kĺby dovoľujú prútom vzájomné pootočenie, ako pri ráme s dvoma kĺbovo uloženými pätami a s kĺbom na hlave každého stĺpa alebo pri kĺbovo spojenom štvorci bez diagonály. Odstráňte kĺb alebo pridajte prút či podperu. |
| *Konštrukcia je nestabilná: pohybuje sa takmer bez odporu.* <br> *Konštrukcia je nestabilná – tieto pohyby nemajú prakticky žiadny odpor: vodorovné posunutie uzla … (Dx) …* | Takmer mechanizmus alebo tuhosť blízka nule. Dlhé hlásenie uvádza uzly a smery. Skontrolujte podpery, kĺby a hodnoty `E`, `A` a `Iy`. |
| *Konštrukcia je mechanizmus: môže sa pohybovať bez odporu.* <br> *Konštrukcia je mechanizmus: matica tuhosti je singulárna.* | Niečo sa môže voľne pohybovať a predchádzajúce kontroly to nezachytili. Overte, či je každá časť zaistená aspoň tromi väzbami a či koncové kĺby nenechávajú žiadny prút voľne otočný. |
| *Prvok … má nulovú dĺžku: uzly … a … ležia v rovnakom bode.* | Dva uzly jedného prvku ležia na sebe. Jeden z nich presuňte alebo prvok vymažte. |
| *Prvok … má na oboch koncoch rovnaký uzol.* | Prvok vymažte a nakreslite ho znova medzi dvoma rôznymi uzlami. |
| *Prvok … odkazuje na neexistujúci uzol / materiál / prierez …* | Objekt, ktorý prvok používa, bol vymazaný, obvykle v ručne upravenom súbore projektu. V tabuľke *Prvky* mu priraďte existujúci. |
| *Prvok … musí odkazovať práve na 2 uzly.* | Poškodený prvok v importovanom súbore. Vymažte ho a nakreslite znova. |
| *Uzlové zaťaženie č. n odkazuje na neexistujúci uzol …* <br> *Predpísané posunutie č. n odkazuje na neexistujúci uzol …* | Zaťaženie vymažte alebo mu priraďte existujúci uzol. |
| *Prvkové zaťaženie č. n odkazuje na neexistujúci prvok …* | Zaťaženie vymažte. |
| *Výpočet zlyhal pre vnútornú nekonzistentnosť modelu.* | Všeobecná chyba. Vráťte posledný krok alebo uložte projekt a [chybu nahláste](#reporting-a-bug). |

### Upozornenia {#warnings}

Model sa napriek tomu vypočíta, tieto hlásenia však stojí za to skontrolovať:

| Hlásenie | Význam a náprava |
| --- | --- |
| *Uzol … nie je pripojený k žiadnemu prvku a výpočet ho ignoruje.* | Osamotený uzol. Vymažte ho alebo ho pripojte. |
| *Uzol … je podopretý, ale nepripája sa k nemu žiadny prvok, takže podpera nič neprenáša.* | Podpera na osamotenom uzle. |
| *Uzlové zaťaženie č. n obsahuje neplatné hodnoty.* <br> *Predpísané posunutie č. n obsahuje neplatné hodnoty.* | Niektorá zložka nie je číslo. Upravte zaťaženie. |

### Pri úpravách {#while-editing}

Tieto hlásenia sa počas práce objavia v dialógovom okne prehliadača a model zostane bez zmeny:

| Hlásenie | Význam a náprava |
| --- | --- |
| *Najprv, prosím, pridajte materiál.* <br> *Najprv, prosím, pridajte prierez.* | Prvok potrebuje oboje. Pridajte ich na karte *Materiály* alebo *Prierezy* a prvok nakreslite znova. |
| *Vyberte, prosím, materiál a prierez.* | V dialógu **Pridať prvok** zostalo prázdne pole. Vyberte oboje. |
| *Označenie … sa už používa.* | Žiadne dva uzly, prvky, materiály ani prierezy nemôžu mať rovnaké označenie. Zvoľte iné. |
| *Pre tento uzol už predpísané posunutie existuje. Najprv ho, prosím, odstráňte.* | Uzol môže mať iba jedno predpísané posunutie. Upravte to existujúce alebo ho najprv vymažte. |

## Nič sa nevykresľuje {#no-results-are-drawn}

Keď sa neobjaví žiadny priebeh, skontrolujte postupne:

::div{.steps}

### Skontrolujte možnosti zobrazenia {#check-the-display-options}

Ak nevidíte žiadne hlásenie, model je vypočítaný: priebeh môže byť iba vypnutý. Zaškrtnite **M<sub>y</sub>(x)** alebo iný výsledok v možnostiach zobrazenia vpravo hore v zobrazení; ak panel nevidíte, zobrazí ho tlačidlo ⚙. Model bez zaťaženia má všade nulové výsledky, takže ani vtedy nie je čo kresliť.

### Skontrolujte podpery {#check-the-supports}

Riešič potrebuje aspoň tri podopreté smery a podpery musia spoločne zabrániť tomu, aby sa konštrukcia posunula alebo otočila. Nosník na dvoch posuvných kĺboch má iba dva a môže sa voľne posunúť: jeden z nich zmeňte na **Pevný kĺb**. Ani tri rovnobežné posuvné kĺby alebo podpery, ktorých nositeľky sa pretínajú v jednom bode, konštrukciu neudržia. Pozrite [Uzly a podpery](/sk/essentials/nodes-supports#supports).

### Skontrolujte, či sú prvky prepojené {#check-the-connections}

Dva uzly s rovnakými súradnicami sú stále dva samostatné uzly a časť, ktorá sa zvyšku konštrukcie dotýka iba tam, v skutočnosti voľne visí. Nadbytočný uzol vymažte a prvky znova pripojte. Keď umiestňujete uzol na prvok, zvoľte **Pripojiť ku konštrukcii** a prvok sa v tom mieste rozdelí.

### Spočítajte kĺby {#count-the-hinges}

Rám s dvoma kĺbovo uloženými pätami a s kĺbom na hlave každého stĺpa alebo štvorec z kĺbovo spojených prútov bez diagonály je mechanizmus. EduBeam kĺby zakrúžkuje a čiarkovaným obrysom ukáže pohyb. Pozrite [Koncové kĺby](/sk/essentials/elements#end-hinges).

### Hľadajte nulovú tuhosť {#look-for-zero-stiffness}

Ak je `E`, `A` alebo `Iy` zadané ako 0 alebo v nesprávnej jednotke, časť konštrukcie sa môže pohybovať takmer bez odporu. EduBeam takú konštrukciu označí ako *nestabilnú*.

::

## Výsledky vyzerajú zle {#results-look-wrong}

| Príznak | Pravdepodobná príčina |
| --- | --- |
| Zaťaženie pôsobí nahor | Globálna os **z smeruje nadol**, takže kladné `Fz` alebo `fz` pôsobí nadol a záporné hodnoty nahor. Pri osiach y nahor je to naopak. Pozrite [Zaťaženie](/sk/essentials/loads#sign-convention-in-one-line). |
| Priehyb sa líši o rády | Zámena jednotiek: `E` zadané v Pa, hoci pole očakáva MPa, alebo `Iy` v cm⁴, hoci pole očakáva m⁴. Štítok jednotiek vpravo dole v zobrazení uvádza jednotky všetkých polí. |
| Priehyb je o niečo väčší ako podľa učebnicového vzorca | Šmykové deformácie Timošenkovho nosníka. Pozrite [Ručné overenie výsledkov](/sk/guide/verification#shear-deformation). |
| Znamienko vyzerá zle | Znamienko čítajte z hodnoty, nie podľa strany, na ktorú je priebeh vykreslený: kladný moment M znamená ťah dole. Koncové sily vo *Výsledkoch na prvkoch* sa riadia lokálnymi osami prvku, nie konvenciou N-V-M. Pozrite [Ako čítať znamienko](/sk/essentials/results#reading-the-sign). |
| Priebeh je na „nesprávnej“ strane | Strana je vecou nastavenia zobrazenia: ohybový moment na ťahanej alebo tlačenej strane, N a V na ktorejkoľvek strane čiarkovanej čiary. **Nastavenia → Nastavenia zobrazenia → Priebehy vnútorných síl**. |
| Dva rovnaké stĺpy majú opačné znamienka priečnej sily | Znamienko V sa riadi orientáciou každého prvku. Ak ich chcete porovnať, pri jednom z nich vymeňte uzly. |
| Čísla ako `4 · 10¹` | Vedecký formát čísel. Zvoľte *Automatický* v **Nastavenia → Jazyk a prostredie → Formát čísel**. |
| Priebehy sú obrovské alebo maličké | Ide iba o kresbu. Upravte **Mierku výsledkov** cez **Nastavenia → Nastavenia zobrazenia**. |
| Zaťaženie v lokálnych osiach smeruje nesprávnym smerom | Lokálna os x prvku vedie od jeho *počiatočného* ku *koncovému* uzlu. Vymeňte uzly alebo obráťte znamienko. |
| Zaťaženie šikmého prúta nesedí | **LCS** je predvolene zaškrtnuté, takže `fz` pôsobí kolmo na prút. Pre zvislé zaťaženie zaškrtnutie zrušte. |
| Teplotné zaťaženie nič nerobí | Staticky určitá konštrukcia sa pri zmene teploty voľne deformuje a vnútorné sily v nej nevznikajú. Ak chýba aj deformácia, overte, či α nie je 0, a pri nerovnomernom oteplení aj to, či je zadaná výška prierezu $h$. |

## Súbory a odkazy {#files-and-links}

| Príznak | Náprava |
| --- | --- |
| *Súbor sa nepodarilo importovať. Skontrolujte, prosím, formát súboru.* | Súbor nie je projekt EduBeamu ani relácia desktopového EduBeamu. Váš model zostal bez zmeny. |
| *Táto relácia programu EduBeam má niekoľko zaťažovacích stavov, ale otvoriť možno iba jeden.* | Relácia desktopového EduBeamu s niekoľkými zaťažovacími stavmi: EduBeam otvorí prvý z nich a vypíše, ktoré vynechal. |
| Odkaz na zdieľanie namiesto toho otvorí váš starý model | Odkaz sa skrátil alebo zmenil, napríklad keď ho e-mailový klient zalomil. EduBeam odkaz, ktorý nedokáže prečítať, ignoruje a váš model ponechá. Skopírujte znova celý odkaz. |
| Kratší odkaz sa kolegovi neotvorí | Jeho EduBeam je starší ako verzia 1.3.2. Nech aplikáciu znova načíta alebo zdieľajte s vypnutou voľbou **Kratší odkaz**. Pozrite [Zdieľanie odkazom](/sk/essentials/import-export#share-a-link). |

## Problémy s rozhraním {#interface-issues}

| Príznak | Náprava |
| --- | --- |
| Skratky nič nerobia | Najprv kliknite do výkresu: kým má fokus textové pole, jednotlivé klávesy sa ignorujú. Na Macu použite namiesto <kbd>Ctrl</kbd> kláves <kbd>Cmd</kbd>. Pozrite [Klávesnica, myš a dotyk](/sk/reference/shortcuts). |
| <kbd>Delete</kbd> na Macu nič nerobí | Kláves s popisom *delete* na klávesnici Macu je Backspace. Stlačte <kbd>Fn</kbd>+<kbd>Delete</kbd>. |
| Zobrazenie sa nedá posunúť | Zobrazenie sa posúva stredným alebo pravým tlačidlom myši; ktorým z nich, zvolíte v **Nastavenia → Ovládanie a skratky**. Na touchpade kliknite a ťahajte dvoma prstami. Na dotykovej obrazovke ťahajte jedným prstom. |
| Môj model zmizol | Keď otvoríte odkaz, súbor alebo príklad, alebo keď konštrukciu vymažete, starý model sa uchová: **☰ → Nedávne konštrukcie** alebo <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Pri otvorení odkazu to EduBeam oznámi dole na obrazovke hlásením *Otvorená zdieľaná konštrukcia. Predchádzajúcu nájdete v Nedávnych konštrukciách.* s tlačidlom **Zobraziť**. |
| Nesprávny jazyk | Zmeňte ho cez **Nastavenia → Jazyk a prostredie** alebo pridajte do adresy `?lang=sk`. |
| Zmeny nastavení sa neuchovajú | Lokálne úložisko je zablokované, napríklad v anonymnom okne alebo v prísnom režime ochrany súkromia. Potrebujú ho nastavenia, uložený model aj Nedávne konštrukcie. |

## Nahlásenie chyby {#reporting-a-bug}

Založte [issue na GitHube](https://github.com/janvorisek/edubeam/issues) a uveďte prehliadač a operačný systém, čo ste urobili a čo ste očakávali. Najviac pomôže **odkaz na zdieľanie** alebo **súbor projektu**, na ktorom sa problém prejaví.
