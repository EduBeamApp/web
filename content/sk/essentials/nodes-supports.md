---
description: "Ako v EduBeame zadať a upraviť uzly, prichytiť ich k mriežke, rozdeliť prvok a zvoliť podperu: pevný kĺb, posuvný kĺb, votknutie, posuvné votknutie a ich varianty."
source: site
---

# Uzly a podpery

Uzly sú body modelu: spájajú ich prvky a sú v nich podpery a uzlové zaťaženia. Umiestnite ich zadaním súradníc alebo kliknutím a podopretým uzlom potom priraďte podperu, ktorá zodpovedá vašej schéme.

## Súradnice {#coordinates}

Každý uzol má súradnice **X** a **Z** v aktuálnej [jednotke dĺžky](/sk/essentials/units-settings#units). Os x smeruje doprava a **os z nadol**, takže všetko nad terénom má zápornú súradnicu Z: stĺp vysoký 4 m vedie zo `Z = 0` do `Z = −4`.

::model-figure{caption="Rám široký 6 m a vysoký 4 m: A a D ležia v Z = 0, B a C v Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

Ak chcete, aby zvislá os smerovala nahor, prepnite v Nastaveniach na [osi s y nahor](/sk/elements/conventions#y-up-axes). Zmení sa len zobrazenie; model a jeho súbory zostanú rovnaké.

## Pridanie uzlov {#adding-nodes}

- **Zadaním súradníc.** Karta *Uzly* → **Pridať uzol** (tlačidlo s ikonou **+**) alebo pravé tlačidlo na plátne → *Pridať uzol*. Zadajte X a Z, prípadne aj podpery a uhol podpery.
- **Kliknutím.** Karta *Uzly* → **Pridať uzol** (tlačidlo s ikonou kurzora) alebo pri voľbe *Pridať uzol* v ponuke plátna podržte <kbd>Ctrl</kbd>. Každým kliknutím umiestnite uzol; pridávanie ukončíte klávesom <kbd>Esc</kbd>, tlačidlom **Zrušiť** alebo ďalším stlačením toho istého tlačidla.
- **Pri kreslení prvkov.** Keď [kreslíte prvky myšou](/sk/essentials/elements#adding-elements), kliknutím na prázdne plátno vytvoríte nový uzol.
- **Kopírovaním.** Vyberte uzly (a prvky), stlačte <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd> a kliknite tam, kam chcete kópiu umiestniť, alebo zadajte v lište hore posun Δx, Δz a stlačte **Vložiť**.

::div{.shots}

![Dialóg Pridať uzol](/screenshots/sk/qs-node.webp)

![V režime myši nastavíte v lište hore podpery a uhol pre každý umiestnený uzol](/screenshots/sk/nodes-add-banner.webp)

::

Nové uzly dostávajú ďalšie voľné číslo: `1`, `2`, `3`, … Ktorýkoľvek z nich môžete premenovať v stĺpci *Uzol* tabuľky, napríklad na `A`, `B`, `C`.

### Prichytávanie {#snapping}

Keď je zapnuté **Prichytávať k mriežke** (kláves <kbd>S</kbd> alebo štítok **S** vpravo dole v zobrazení), uzly, ktoré umiestnite alebo presuniete, sa prichytia k mriežke. Krok je predvolene 0,1 m, v amerických jednotkách 0,5 ft; zmeníte ho v časti [Nastavenia → Nastavenia zobrazenia → Mriežka](/sk/essentials/units-settings#viewer-settings). Akúkoľvek inú polohu zadáte presnými súradnicami v tabuľke.

### Umiestnenie uzla na existujúci prvok {#placing-a-node-on-an-existing-element}

Keď pri pridávaní uzlov myšou kliknete na prvok (alebo tesne vedľa neho), EduBeam sa opýta, čo chcete urobiť:

- **Pripojiť ku konštrukcii** rozdelí prvok na dva, `1a` a `1b`, spojené v novom uzle. Takto najrýchlejšie pridáte vnútornú podperu alebo bod, v ktorom chcete zadať zaťaženie. Kĺby na vonkajších koncoch zostanú, kde boli. Rovnomerné a lineárne sa meniace zaťaženie sa rozdelí medzi obe polovice. Osamelé sily a zmeny teploty však pripadnú všetky prvej polovici, `1a`: osamelú silu, ktorá ležala za novým uzlom, presuňte v tabuľke *Zaťaženie* na `1b` (jej poloha sa teraz meria od nového uzla) a prvku `1b` zadajte vlastnú zmenu teploty.
- **Umiestniť samostatný uzol** vytvorí uzol na prvku, ale nepripojí ho k nemu.

V oboch prípadoch tým umiestňovanie uzlov skončí; ak chcete pridať ďalšie, kliknite znova na tlačidlo s kurzorom.

## Úprava uzlov {#editing-nodes}

| Čo chcete | Postup |
| --- | --- |
| Presunúť uzol | Potiahnite ho v zobrazení (na dotykovej obrazovke ho stlačte a ťahajte) alebo zadajte X a Z v tabuľke *Uzly*. Pripojené prvky, ich zaťaženia aj kóty sa posunú s ním. |
| Premenovať ho | Zadajte nové označenie v stĺpci *Uzol*. |
| Zmeniť podpery | Kliknite na uzol → **Podpery uzla** alebo použite stĺpec *Podopreté stupne voľnosti*. Pozrite [Podpery](#supports). |
| Upraviť všetko naraz | Ceruzka v stĺpci *Akcie* otvorí dialóg **Upraviť uzol**: súradnice, podpery a uhol podpery s náhľadom značky. |
| Vymazať ho | × v tabuľke, **Vymazať** v paneli uzla alebo uzol vyberte a stlačte <kbd>Delete</kbd>. Vymažú sa aj prvky, zaťaženia a kóty, ktoré sú k nemu pripojené. |

Každú zmenu vrátite klávesmi <kbd>Ctrl</kbd>+<kbd>Z</kbd>.

## Podpery {#supports}

Každý uzol sa môže pohybovať tromi spôsobmi, má tri **stupne voľnosti**: `Dx` je posunutie v smere x, `Dz` posunutie v smere z a `Ry` pootočenie v rovine výkresu. Podpera niektoré z nich **odoberie**, teda pohybu v týchto smeroch zabráni.

Osem podpier zodpovedá ôsmim kombináciám týchto troch stupňov voľnosti. Tabuľku čítajte po riadkoch: v prostrednom stĺpci sa uzol voľne pootáča, v pravom je zabránené aj pootočenie.

| Zabránené posunutia | Voľné pootočenie | Zabránené aj pootočenie |
| --- | --- | --- |
| **Obe** (`Dx` aj `Dz`) | ![](/screenshots/sk/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Pevný kĺb** | ![](/screenshots/sk/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Votknutie** |
| **Iba zvislé** (`Dz`): posúva sa vodorovne | ![](/screenshots/sk/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Posuvný kĺb** | ![](/screenshots/sk/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Posuvné votknutie** |
| **Iba vodorovné** (`Dx`): posúva sa zvislo | ![](/screenshots/sk/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Zvislý posuvný kĺb** | ![](/screenshots/sk/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Zvislé posuvné votknutie** |
| **Žiadne**: posúva sa v oboch smeroch | ![](/screenshots/sk/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Voľný** (bez podpery) | ![](/screenshots/sk/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Zabránené pootočenie** |

Pre každý podopretý stupeň voľnosti vypočíta EduBeam **reakciu**: `Dx` dáva vodorovnú silu $R_x$, `Dz` zvislú silu $R_z$ a `Ry` moment $M$. Pevný kĺb teda dáva $R_x$ a $R_z$, posuvný kĺb iba $R_z$, posuvné votknutie $R_z$ a $M$ a votknutie všetky tri.

### Nastavenie podpery {#setting-a-support}

Vyberte značku alebo zaškrtnite stupne voľnosti jednotlivo; obe voľby sa vždy zhodujú. Nájdete ich na troch miestach:

- v paneli uzla (kliknite na uzol) → **Podpery uzla**, spolu s poľom **Pootočenie súradného systému**, pozrite obrázok nižšie;
- v dialógoch **Pridať uzol** a **Upraviť uzol**;
- v stĺpci *Podopreté stupne voľnosti* tabuľky *Uzly*, kde je značka malou ponukou a `Dx`, `Dz`, `Ry` sú začiarkavacie políčka.

![Podpery uzla v paneli uzla: značky, začiarkavacie políčka stupňov voľnosti a uhol podpery](/screenshots/sk/nodes-support-picker.webp){.shot-lg}

Keď ukážete myšou na značku, zobrazí sa jej názov.

### Posuvný kĺb, alebo posuvné votknutie? {#roller-or-slider}

Obe podpery stoja na koľajnici a môžu sa po nej posúvať. Líšia sa tým, či sa koniec môže pootočiť:

- **posuvný kĺb** je kĺb na koľajnici: koniec sa **voľne pootáča**, takže v ňom nevzniká moment;
- **posuvné votknutie** je votknutie na koľajnici: koniec sa **pootočiť nemôže**, takže podpera prenáša moment.

Ten istý nosník s rozpätím 6 m a zaťažením 10 kN/m, zmenená je len pravá podpera. Prepínajte medzi deformovaným tvarom a ohybovým momentom:

::div{.shots}

:::model-figure{caption="Pevný kĺb a posuvný kĺb: pravý koniec sa voľne pootáča, moment je v ňom nulový; v každej podpere reakcia 30 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Pevný kĺb a posuvné votknutie: pravý koniec zostáva vodorovný, moment je v ňom −45 kNm; v posuvnom votknutí reakcia 37,5 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

Prvý je prostý nosník ($M_{max} = qL^2/8 = 45\ \text{kNm}$ v strede rozpätia). Pri zvislom zaťažení sa posuvné votknutie správa presne ako votknutie, takže druhý je jednostranne votknutý nosník ($R_B = 5qL/8 = 37{,}5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Keď koniec zostáva vodorovný, je nosník navyše tuhší: najväčší priehyb klesne z 9,617 mm na 4 mm. Od votknutia sa posuvné votknutie líši, len keď naň niečo tlačí v smere koľajnice.

### Šikmé (natočené) podpery {#inclined-skewed-supports}

Podpera na svahu bráni pohybu uzla v pootočených osiach. **Pootočenie súradného systému** α v stupňoch od −180 do 180 nastavíte v paneli uzla pod *Podpery uzla*, v dialógoch na pridanie a úpravu uzla alebo v poli **α** tabuľky *Uzly*.

Osi uzla sa pootočia o α a zaškrtnuté stupne voľnosti pôsobia v nich. Uhol α pootáča os x smerom k osi z, teda na obrazovke **v smere hodinových ručičiek** (pri osiach s y nahor pootáča x k y, teda proti smeru hodinových ručičiek). Posuvný kĺb na povrchu, ktorý klesá doprava pod uhlom 30°, je preto posuvný kĺb s α = 30°. Značka sa natočí spolu s osami a v nich sa uvádza aj reakcia.

::model-figure{caption="Posuvný kĺb v B natočený o α = 30°: jeho reakcia 34,64 kN je kolmá na svah a nosník prenáša N = +17,32 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

Ten istý nosník ako vyššie, 6 m so zaťažením 10 kN/m, len jeho posuvný kĺb teraz stojí na svahu so sklonom 30°. Zvislá zložka reakcie v B je stále $qL/2 = 30\ \text{kN}$, takže výsledná reakcia je $30/\cos 30° = 34{,}64\ \text{kN}$ a jej vodorovná zložka $30 \tan 30° = 17{,}32\ \text{kN}$ tlačí uzol B doprava. Pevný kĺb v A ho drží, a preto je nosník ťahaný. Ohybový moment sa nezmení.

[Uzlové zaťaženia](/sk/essentials/loads#nodal-loads) v uzle s pootočenými osami môžete zadať v globálnych osiach alebo v osiach uzla; [predpísané posunutie](/sk/essentials/loads#prescribed-displacements-support-settlements) pôsobí vždy vo vlastných osiach podpery.

### Stabilita {#stability}

Rovinná konštrukcia potrebuje aspoň **tri podopreté stupne voľnosti**, usporiadané tak, aby ju skutočne udržali. Kým podpery chýbajú, zobrazenie ukazuje modrý štítok **Chýbajú podpery**. Ak je podpier dosť, ale konštrukciu neudržia (všetky sú rovnobežné alebo sa pretínajú v jednom bode), alebo ak sa prvky môžu v kĺboch navzájom pootáčať, červené hlásenie problém pomenuje a čiarkovaný obrys ukáže, ako sa konštrukcia pohybuje. Všetky hlásenia vysvetľuje kapitola [Riešenie problémov](/sk/reference/troubleshooting#messages).

## Uzlové zaťaženia a poklesy podpier {#nodal-loads-and-settlements}

Kliknite na uzol → **Pridať zaťaženie**, ak chcete zadať silu alebo moment, alebo → **Predpísať posunutie**, ak chcete podperu posunúť o zadanú hodnotu (pokles podpery). Oboje vysvetľuje časť [Uzlové zaťaženia](/sk/essentials/loads#nodal-loads).

## Kóty {#dimension-lines}

Kóty popisujú dĺžky vo výkrese. Na výpočet nemajú vplyv, ale ukladajú sa s projektom, prenášajú sa v odkazoch na zdieľanie a objavia sa aj v [exportovaných obrázkoch](/sk/essentials/import-export#export-an-image).

| Čo chcete | Postup |
| --- | --- |
| Pridať kótu | Pravé tlačidlo na plátne → **Pridať kótu**, potom kliknite na oba koncové body. Bod blízko uzla sa k uzlu prichytí. |
| Okótovať prvok | Pravé tlačidlo na prvku → **Okótovať prvok**. |
| Upraviť alebo prevrátiť kótu | Kliknite na kótu → **Upraviť** a zadajte jej súradnice, alebo → **Prevrátiť kótu**, ak chcete popis presunúť na druhú stranu. |
| Presunúť ju | Potiahnite ju, prípadne len jej koncový bod. Koniec ležiaci v uzle zostane s uzlom zviazaný a posúva sa s ním. |
