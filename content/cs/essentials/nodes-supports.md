---
description: "Jak v EduBeamu zadat a upravit uzly, přichytit je k mřížce, rozdělit prvek a zvolit podporu: kloub, posuvný kloub, vetknutí, posuvné vetknutí a jejich varianty."
source: site
---

# Uzly a podpory

Uzly jsou body modelu: spojují je prvky a jsou v nich podpory a uzlová zatížení. Umístíte je zadáním souřadnic nebo kliknutím a podepřeným uzlům pak přiřadíte podporu, která odpovídá vašemu schématu.

## Souřadnice {#coordinates}

Každý uzel má souřadnice **X** a **Z** v aktuální [jednotce délky](/cs/essentials/units-settings#units). Osa x míří doprava a **osa z dolů**, takže vše nad terénem má zápornou souřadnici Z: sloup vysoký 4 m vede ze `Z = 0` do `Z = −4`.

::model-figure{caption="Rám široký 6 m a vysoký 4 m: A a D leží v Z = 0, B a C v Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

Chcete-li, aby svislá osa mířila nahoru, přepněte v Nastavení na [osy s y nahoru](/cs/elements/conventions#y-up-axes). Změní se jen zobrazení; model a jeho soubory zůstanou stejné.

## Přidání uzlů {#adding-nodes}

- **Zadáním souřadnic.** Záložka *Uzly* → **Přidat uzel** (tlačítko s ikonou **+**), nebo pravé tlačítko na plátně → *Přidat uzel*. Zadejte X a Z, případně také podpory a úhel podpory.
- **Kliknutím.** Záložka *Uzly* → **Přidat uzel** (tlačítko s ikonou kurzoru), nebo při volbě *Přidat uzel* v nabídce plátna podržte <kbd>Ctrl</kbd>. Každým kliknutím umístíte uzel; přidávání ukončíte klávesou <kbd>Esc</kbd>, tlačítkem **Zrušit** nebo dalším stisknutím téhož tlačítka.
- **Při kreslení prvků.** Když [kreslíte prvky myší](/cs/essentials/elements#adding-elements), vytvoříte kliknutím na prázdné plátno nový uzel.
- **Kopírováním.** Vyberte uzly (a prvky), stiskněte <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd> a klikněte tam, kam chcete kopii umístit, nebo zadejte v liště nahoře posun Δx, Δz a stiskněte **Vložit**.

::div{.shots}

![Dialog Přidat uzel](/screenshots/cs/qs-node.webp)

![V režimu myši nastavíte v liště nahoře podpory a úhel pro každý umístěný uzel](/screenshots/cs/nodes-add-banner.webp)

::

Nové uzly dostávají další volné číslo: `1`, `2`, `3`, … Kterýkoli z nich můžete přejmenovat ve sloupci *Uzel* tabulky, například na `A`, `B`, `C`.

### Přichytávání {#snapping}

Když je zapnuté **Přichytávat k mřížce** (klávesa <kbd>S</kbd> nebo štítek **S** vpravo dole v zobrazení), uzly, které umístíte nebo přetáhnete, se přichytí k mřížce. Krok je ve výchozím stavu 0,1 m, v amerických jednotkách 0,5 ft; změníte ho v [Nastavení → Nastavení zobrazení → Mřížka](/cs/essentials/units-settings#viewer-settings). Jakoukoli jinou polohu zadáte přesnými souřadnicemi v tabulce.

### Umístění uzlu na existující prvek {#placing-a-node-on-an-existing-element}

Když při přidávání uzlů myší kliknete na prvek (nebo těsně vedle něj), EduBeam se zeptá, co chcete udělat:

- **Připojit ke konstrukci** rozdělí prvek na dva, `1a` a `1b`, spojené v novém uzlu. Tak nejrychleji přidáte vnitřní podporu nebo bod, ve kterém chcete zadat zatížení. Klouby na vnějších koncích zůstanou, kde byly. Rovnoměrné a lineárně proměnné zatížení se rozdělí mezi obě poloviny. Osamělé síly a změny teploty ale připadnou všechny první polovině, `1a`: osamělou sílu, která ležela za novým uzlem, přesuňte v tabulce *Zatížení* na `1b` (její poloha se teď měří od nového uzlu) a prvku `1b` zadejte vlastní změnu teploty.
- **Umístit samostatný uzel** vytvoří uzel na prvku, ale nepřipojí ho k němu.

V obou případech tím umísťování uzlů skončí; chcete-li přidat další, klikněte znovu na tlačítko s kurzorem.

## Úprava uzlů {#editing-nodes}

| Co chcete | Postup |
| --- | --- |
| Přesunout uzel | Přetáhněte ho v zobrazení (na dotykové obrazovce ho stiskněte a táhněte), nebo zadejte X a Z v tabulce *Uzly*. Připojené prvky, jejich zatížení i kóty se posunou s ním. |
| Přejmenovat ho | Zadejte nové označení ve sloupci *Uzel*. |
| Změnit podpory | Klikněte na uzel → **Podepření uzlu**, nebo použijte sloupec *Podepřené stupně volnosti*. Viz [Podpory](#supports). |
| Upravit vše najednou | Tužka ve sloupci *Akce* otevře dialog **Upravit uzel**: souřadnice, podpory a úhel podpory s náhledem značky. |
| Smazat ho | × v tabulce, **Smazat** v panelu uzlu, nebo uzel vyberte a stiskněte <kbd>Delete</kbd>. Smažou se i prvky, zatížení a kóty, které jsou k němu připojené. |

Každou změnu vrátíte klávesami <kbd>Ctrl</kbd>+<kbd>Z</kbd>.

## Podpory {#supports}

Každý uzel se může pohybovat třemi způsoby, má tři **stupně volnosti**: `Dx` je posun ve směru x, `Dz` posun ve směru z a `Ry` pootočení v rovině výkresu. Podpora některé z nich **odebere**, tedy pohybu v těchto směrech zabrání.

Osm podpor odpovídá osmi kombinacím těchto tří stupňů volnosti. Tabulku čtěte po řádcích: v prostředním sloupci se uzel volně pootáčí, v pravém je zabráněno i pootočení.

| Zabráněné posuny | Volné pootočení | Zabráněné i pootočení |
| --- | --- | --- |
| **Oba** (`Dx` i `Dz`) | ![](/screenshots/cs/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Kloub** | ![](/screenshots/cs/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Vetknutí** |
| **Jen svislý** (`Dz`): posouvá se vodorovně | ![](/screenshots/cs/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Posuvný kloub** | ![](/screenshots/cs/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Posuvné vetknutí** |
| **Jen vodorovný** (`Dx`): posouvá se svisle | ![](/screenshots/cs/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Svislý posuvný kloub** | ![](/screenshots/cs/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Svislé posuvné vetknutí** |
| **Žádný**: posouvá se v obou směrech | ![](/screenshots/cs/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Volný** (bez podpory) | ![](/screenshots/cs/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Zamezené pootočení** |

Pro každý podepřený stupeň volnosti spočítá EduBeam **reakci**: `Dx` dává vodorovnou sílu $R_x$, `Dz` svislou sílu $R_z$ a `Ry` moment $M$. Kloub tedy dává $R_x$ a $R_z$, posuvný kloub jen $R_z$, posuvné vetknutí $R_z$ a $M$ a vetknutí všechny tři.

### Nastavení podpory {#setting-a-support}

Vyberte značku, nebo zaškrtněte stupně volnosti jednotlivě; obojí si vždy odpovídá. Obojí najdete na třech místech:

- v panelu uzlu (klikněte na uzel) → **Podepření uzlu**, spolu s polem **Pootočení systému souřadnic**, viz obrázek níže;
- v dialozích **Přidat uzel** a **Upravit uzel**;
- ve sloupci *Podepřené stupně volnosti* tabulky *Uzly*, kde je značka malou nabídkou a `Dx`, `Dz`, `Ry` jsou zaškrtávací políčka.

![Podepření uzlu v panelu uzlu: značky, zaškrtávací políčka stupňů volnosti a úhel podpory](/screenshots/cs/nodes-support-picker.webp){.shot-lg}

Když najedete myší na značku, ukáže se její název.

### Posuvný kloub, nebo posuvné vetknutí? {#roller-or-slider}

Obě podpory stojí na kolejnici a mohou se po ní posouvat. Liší se tím, jestli se konec může pootočit:

- **posuvný kloub** je kloub na kolejnici: konec se **volně pootáčí**, takže v něm nevzniká moment;
- **posuvné vetknutí** je vetknutí na kolejnici: konec se **pootočit nemůže**, takže podpora přenáší moment.

Stejný nosník o rozpětí 6 m se zatížením 10 kN/m, liší se jen pravá podpora. Přepínejte mezi deformovaným tvarem a ohybovým momentem:

::div{.shots}

:::model-figure{caption="Kloub a posuvný kloub: pravý konec se volně pootáčí, moment je v něm nulový; v každé podpoře reakce 30 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Kloub a posuvné vetknutí: pravý konec zůstává vodorovný, moment je v něm −45 kNm; v posuvném vetknutí reakce 37,5 kN"}
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

První je prostý nosník ($M_{max} = qL^2/8 = 45\ \text{kNm}$ uprostřed rozpětí). Při svislém zatížení se posuvné vetknutí chová přesně jako vetknutí, takže druhý je jednostranně vetknutý nosník ($R_B = 5qL/8 = 37{,}5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Když konec zůstává vodorovný, je nosník navíc tužší: největší průhyb klesne z 9,617 mm na 4 mm. Od vetknutí se posuvné vetknutí liší, jen když na něj něco tlačí ve směru kolejnice.

### Šikmé (natočené) podpory {#inclined-skewed-supports}

Podpora na svahu brání pohybu uzlu v pootočených osách. **Pootočení systému souřadnic** α ve stupních od −180 do 180 nastavíte v panelu uzlu pod *Podepření uzlu*, v dialozích pro přidání a úpravu uzlu nebo v poli **α** tabulky *Uzly*.

Osy uzlu se pootočí o α a zaškrtnuté stupně volnosti působí v nich. Úhel α otáčí osu x směrem k ose z, tedy na obrazovce **ve směru hodinových ručiček** (při osách s y nahoru otáčí x k y, tedy proti směru hodinových ručiček). Posuvný kloub na povrchu, který klesá doprava pod úhlem 30°, je proto posuvný kloub s α = 30°. Značka se natočí spolu s osami a v nich se uvádí i reakce.

::model-figure{caption="Posuvný kloub v B natočený o α = 30°: jeho reakce 34,64 kN je kolmá ke svahu a nosník přenáší N = +17,32 kN"}
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

Stejný nosník jako výše, 6 m se zatížením 10 kN/m, jen jeho posuvný kloub teď stojí na svahu se sklonem 30°. Svislá složka reakce v B je stále $qL/2 = 30\ \text{kN}$, takže výsledná reakce je $30/\cos 30° = 34{,}64\ \text{kN}$ a její vodorovná složka $30 \tan 30° = 17{,}32\ \text{kN}$ tlačí uzel B doprava. Kloub v A ho drží, a proto je nosník tažený. Ohybový moment se nezmění.

[Uzlová zatížení](/cs/essentials/loads#nodal-loads) v uzlu s pootočenými osami můžete zadat v globálních osách, nebo v osách uzlu; [předepsané posunutí](/cs/essentials/loads#prescribed-displacements-support-settlements) působí vždy ve vlastních osách podpory.

### Stabilita {#stability}

Rovinná konstrukce potřebuje alespoň **tři podepřené stupně volnosti**, uspořádané tak, aby ji skutečně udržely. Dokud podpory chybí, ukazuje zobrazení modrý štítek **Chybí podpory**. Pokud je podpor dost, ale konstrukci neudrží (všechny jsou rovnoběžné, nebo se protínají v jednom bodě), nebo pokud se prvky mohou v kloubech vzájemně pootáčet, červené hlášení problém pojmenuje a čárkovaný obrys ukáže, jak se konstrukce pohybuje. Všechna hlášení vysvětluje kapitola [Řešení problémů](/cs/reference/troubleshooting#messages).

## Uzlová zatížení a poklesy podpor {#nodal-loads-and-settlements}

Klikněte na uzel → **Přidat zatížení**, chcete-li zadat sílu nebo moment, nebo → **Předepsat posunutí**, chcete-li podporu posunout o zadanou hodnotu (pokles podpory). Obojí vysvětluje oddíl [Uzlová zatížení](/cs/essentials/loads#nodal-loads).

## Kóty {#dimension-lines}

Kóty popisují délky ve výkresu. Na výpočet nemají vliv, ale ukládají se s projektem, přenášejí se ve sdílených odkazech a objeví se i v [exportovaných obrázcích](/cs/essentials/import-export#export-an-image).

| Co chcete | Postup |
| --- | --- |
| Přidat kótu | Pravé tlačítko na plátně → **Přidat kótu**, pak klikněte na oba koncové body. Bod blízko uzlu se k uzlu přichytí. |
| Okótovat prvek | Pravé tlačítko na prvku → **Okótovat prvek**. |
| Upravit nebo převrátit kótu | Klikněte na kótu → **Upravit** a zadejte její souřadnice, nebo → **Převrátit kótu**, chcete-li popisek přesunout na druhou stranu. |
| Přesunout ji | Přetáhněte ji, případně jen její koncový bod. Konec ležící v uzlu zůstane s uzlem svázaný a posouvá se s ním. |
