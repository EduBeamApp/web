---
description: "Modelează în EduBeam, în zece minute, o grindă de oțel simplu rezemată: material, secțiune, noduri, reazeme și încărcare, apoi citește rezultatele și verifică-le prin calcul manual."
source: site
---

# Ghid de început

În aproximativ zece minute vei construi o grindă de oțel simplu rezemată, vei citi reacțiunile, forța tăietoare, momentul încovoietor și săgeata și vei verifica fiecare valoare prin calcul manual. Deschide EduBeam într-o a doua filă sau lângă această pagină și urmează pașii pe rând.

::div{.actions}
[Deschide EduBeam ↗](https://run.edubeam.app/?lang=ro){target="_blank"} [Sari la verificarea manuală](#_8-check-by-hand)
::

## Problema {#the-problem}

O grindă cu deschiderea de 6 m este articulată în nodul 1 și simplu rezemată în nodul 2 și este încărcată pe toată lungimea cu o încărcare uniform distribuită de 12 kN/m. Grinda este un profil de oțel IPE 200: $E = 210$ GPa, $G = 81$ GPa, $A = 28{,}48\ \text{cm}^2$ și $I_y = 1943\ \text{cm}^4$. Toate cele patru valori se găsesc în bibliotecile EduBeam, deci nu trebuie să cauți nimic.

::model-figure{caption="Grinda pe care o vei construi: o deschidere de 6 m de la nodul 1 la nodul 2, încărcată cu 12 kN/m"}
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

## Construiește modelul {#build-the-model}

::div{.steps}

### Pornește de la un model gol {#start-from-an-empty-model}

La prima vizită, o fereastră de întâmpinare te întreabă cum vrei să începi. Alege **SI (metric)** la **Sistem de unități**, păstrează **x spre dreapta, z în jos** la **Sistem de coordonate** și apasă **Mai târziu**. Aplicația afișează apoi un mic cadru de exemplu.

1. Apasă **Golește modelul** în bara aplicației (pe telefon, butonul se află în meniul **☰**).
2. Bifează **Șterge materialele** și **Șterge secțiunile**, apoi apasă **Confirmă**.

Zona de desen este acum goală, iar două mesaje roșii spun că nu există încă niciun material și nicio secțiune. Pașii următori rezolvă asta. Nu se pierde nimic: <kbd>Ctrl</kbd>+<kbd>Z</kbd> readuce cadrul, care rămâne păstrat și în **☰ → Structuri recente**.

### Verifică unitățile {#_1-check-the-units}

Butonul unităților din colțul din dreapta jos al zonei de desen arată unitățile folosite în toate câmpurile și rezultatele. Această pagină folosește unități SI, pe care butonul le afișează ca `m m² kN kNm MPa`, și axa z îndreptată în jos. Dacă butonul arată picioare și kipi, dă clic pe ea și setează **Sistem de unități** la **SI (metric)**. În același loc, **Sistem de coordonate** trebuie să fie **x spre dreapta, z în jos**: cu axa y în sus, o încărcare pozitivă acționează în sus, iar semnele de pe această pagină nu s-ar mai potrivi.

![Butoanele pentru grilă (G) și aliniere (S), reticulul și butonul unităților](/screenshots/ro/ui-grid-units.webp){.shot-sm}

### Adaugă materialul și secțiunea {#_2-add-the-material-and-cross-section}

Fiecare element are nevoie de un material și de o secțiune transversală, așa că adaugă-le mai întâi, din biblioteci.

1. Deschide fila **Materiale** din bara de jos și dă clic pe **Bibliotecă de materiale**.
2. Apasă **+** pe rândul **Oțel (S235)** ($E = 210\,000$ MPa, $G = 81\,000$ MPa). Biblioteca rămâne deschisă pentru alte adăugări, așa că închide-o cu **Renunță**.
3. Deschide fila **Secțiuni** și dă clic pe **Bibliotecă de secțiuni**.
4. Derulează până la rândul **IPE 200 (aprox.)**, apasă **+** și închide biblioteca cu **Renunță**.

Ambele mesaje roșii au dispărut, iar fila **Secțiuni** conține profilul IPE 200:

![IPE 200 în fila Secțiuni: aria, Iy, înălțimea și coeficientul de forfecare](/screenshots/ro/a-qs-cross-sections.webp)

Dacă preferi să introduci propriile valori, folosește **Adaugă material** și **Adaugă secțiune**. Coeficientul de forfecare, aici 0,3933, apare din nou la [verificarea manuală](#_8-check-by-hand).

### Adaugă nodurile {#_3-add-the-nodes}

1. Deschide fila **Noduri**. Are două butoane **Adaugă nod**: **+** deschide o fereastră de dialog, iar cel cu pictograma cursorului plasează nodurile cu mouse-ul. Dă clic pe **+ Adaugă nod**.
2. Lasă **Coordonata X** și **Coordonata Z** la `0` și apasă **Adaugă nod**. Fereastra se închide și apare nodul `1`.
3. Dă clic din nou pe **+ Adaugă nod**, introdu `6` la **Coordonata X** și apasă **Adaugă nod**. Acesta este nodul `2`.

![Fereastra Adaugă un nod nou. În ea poți seta direct și reazemele.](/screenshots/ro/qs-node.webp){.shot-md}

### Leagă-le printr-un element {#_4-connect-them-with-an-element}

Deschide fila **Elemente** și dă clic pe **+ Adaugă element**. Fereastra propune deja **Nodul inițial** `1`, **Nodul final** `2`, precum și materialul și secțiunea tale. Apasă **Adaugă element**.

![Adaugă un element nou: cele două noduri de capăt, câte o articulație opțională la fiecare capăt, materialul și secțiunea](/screenshots/ro/a-qs-element.webp){.shot-md}

Între noduri apare o grindă. Apasă <kbd>F</kbd> ca s-o încadrezi în ecran. O etichetă albastră **Necesită reazeme**, în colțul din stânga sus al zonei de desen, îți spune de ce nu există încă rezultate.

### Adaugă reazemele {#_5-add-the-supports}

Înapoi în fila **Noduri**, fiecare rând are un selector de reazem la începutul coloanei **Grade de libertate blocate**.

- Nodul `1`: alege **Articulație**. Aceasta bifează `Dx` și `Dz`.
- Nodul `2`: alege **Reazem simplu**. Acesta bifează doar `Dz`.

![Selectorul de reazem din tabelul Noduri](/screenshots/ro/a-qs-support-picker.webp){.shot-lg}

Eticheta **Necesită reazeme** dispare. Poți de asemenea să dai clic pe un nod de pe desen și să alegi **Reazeme în nod**. Pagina [Noduri și reazeme](/ro/essentials/nodes-supports#supports) descrie toate tipurile de reazeme.

### Adaugă încărcarea {#_6-add-the-load}

1. Deschide fila **Încărcări** și dă clic pe **Adaugă încărcare pe element**.
2. Păstrează **Tipul încărcării** *Încărcare uniform distribuită* și **Element** `1`.
3. Introdu `12` la **fz**, lasă **fx** la `0` și apasă **Adaugă încărcare pe element**.

![Fereastra de dialog arată o previzualizare a încărcării pe element](/screenshots/ro/a-qs-load.webp){.shot-md}

Un `fz` pozitiv acționează în sensul +z, adică **în jos**, deci o valoare pozitivă este o încărcare gravitațională. Căsuța bifată **LCS** (sistem de coordonate local) înseamnă că încărcarea urmează axele proprii ale elementului; la o grindă orizontală desenată de la stânga la dreapta, acestea coincid cu axele globale. Vezi [convențiile de semne](/ro/elements/conventions#loads).

::

## Citește rezultatele {#_7-read-the-results}

Grinda este calculată în clipa în care adaugi încărcarea și din nou după fiecare modificare: nu există un buton *Calculează*. Panoul din colțul din dreapta sus al zonei de desen pornește și oprește diagramele. **Deformata**, **M<sub>y</sub>(x)** și **Reacțiuni** sunt pornite de la început. Bifează **V<sub>z</sub>(x)** ca să adaugi forța tăietoare.

![Opțiunile de afișare, cu forța tăietoare pornită](/screenshots/ro/a-qs-display.webp){.shot-md}

Ecranul tău ar trebui să arate acum ca figura de mai jos. Comută între momentul încovoietor și forța tăietoare:

::model-figure{caption="Grinda terminată: reacțiuni de 36 kN și 54 kNm la mijlocul deschiderii"}
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

| Desen | Ce urmărești |
| --- | --- |
| **Reacțiuni** | Două săgeți în sus de câte **36 kN**, câte una în fiecare reazem. |
| **V<sub>z</sub>(x)** | O dreaptă de la **+36 kN** în nodul `1` la **−36 kN** în nodul `2`, care trece prin zero la mijlocul deschiderii. |
| **M<sub>y</sub>(x)** | O parabolă cu maximul de **54 kNm** la mijlocul deschiderii, trasată pe fibra întinsă, sub grindă. |
| **Deformata** | O încovoiere simetrică, desenată mărit. |

Pentru valori numerice, deschide fila **Rezultate**. **Rezultate în noduri** listează deplasările `Dx`, `Dz` și rotirea `Ry` ale fiecărui nod, iar **Rezultate pe elemente** listează forțele la capetele fiecărui element, în axele lui proprii. Nodul `1` se rotește cu $R_y = -2{,}6469 \cdot 10^{-2}$ rad, iar nodul `2` cu aceeași valoare în sens opus. Pagina [Rezultate și diagrame de eforturi](/ro/essentials/results) explică fiecare tabel și fiecare semn.

Dacă diagramele par prea mari sau prea mici, modifică **Scara rezultatelor** din **Setări → Setări de afișare**.

## Verificarea prin calcul manual {#_8-check-by-hand}

Cu $q = 12$ kN/m și $L = 6$ m, formulele din manual dau:

| Mărime | Formulă | Calcul manual | EduBeam |
| --- | --- | --- | --- |
| Reacțiuni | $qL/2$ | 36 kN | 36 kN |
| Forța tăietoare maximă | $qL/2$ | 36 kN | 36 kN |
| Momentul maxim | $qL^2/8$ | 54 kNm | 54 kNm |
| Rotirea pe reazem | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Săgeata la mijlocul deschiderii | $w_b + w_s$ | 49,63 + 0,60 = 50,22 mm | 50,22 mm |

Săgeata are două componente, iar majoritatea manualelor o dau doar pe prima:

- **Din încovoiere:** $w_b = 5qL^4/(384EI) = 49{,}63$ mm, cu $EI = 4080$ kNm² din $E = 210$ GPa și $I_y = 1943\ \text{cm}^4$.
- **Din forfecare:** $w_s = qL^2/(8kGA) = 0{,}60$ mm, cu $kGA \approx 90\,700$ kN din $k = 0{,}3933$, $G = 81$ GPa și $A = 28{,}48\ \text{cm}^2$.

La mijlocul deschiderii nu există încă un nod, așa că adaugă unul ca să citești săgeata acolo:

1. În fila **Noduri**, dă clic pe al doilea buton **Adaugă nod**, cel cu pictograma cursorului.
2. Dă clic pe grindă la `x = 3`; cu alinierea pornită, nodul cade exact pe grilă. EduBeam te întreabă ce să facă cu nodul: apasă **Conectează la structură**. Elementul este împărțit în `1a` și `1b`, împreună cu încărcarea lui, iar plasarea nodurilor se oprește. Dacă nodul `3` nu are X = `3` în fila **Noduri**, introdu `3` acolo.
3. În **Rezultate → Rezultate în noduri**, nodul `3` arată acum $D_z = 5{,}0224 \cdot 10^{-2}$ m, adică 50,22 mm.

![Rezultatele în noduri după împărțire: nodul 3 coboară cu 50,22 mm](/screenshots/ro/a-qs-nodal-results.webp){.shot-lg}

Împărțirea grinzii nu schimbă niciun rezultat, pentru că elementul este exact pentru aceste încărcări: nu există o rețea de discretizare de îndesit.

::callout{type="details" title="De ce contează coeficientul de forfecare"}
EduBeam folosește elemente de bară Timoshenko, care includ deformațiile din forfecare. Coeficientul de forfecare $k$ scalează aria care preia forfecarea, astfel că $kGA$ este rigiditatea la forfecare. Pentru profilele I din bibliotecă, $k$ este ponderea inimii în arie, $h t_w / A$: pentru IPE 200, $0{,}2 \cdot 0{,}0056 / 0{,}002848 = 0{,}3933$. Componenta din forfecare a săgeții, $w_s = qL^2/(8kGA)$, este integrala lui $V/(kGA)$ de la reazem până la mijlocul deschiderii.

La această grindă zveltă componenta din forfecare este de 0,60 mm, cam 1 % din total. La o grindă scurtă și înaltă este mult mai mare. Setează coeficientul de forfecare la un număr foarte mare (de exemplu `1e10`) în fila **Secțiuni**, iar EduBeam dă doar săgeata din încovoiere, 49,63 mm. Teoria se găsește pe pagina [Elementul de bară](/ro/elements/beam).
::

Mai multe cazuri de verificare manuală (consolă, grindă dublu încastrată, grindă cu zăbrele, variație de temperatură, cedare de reazem) găsești în [Verificarea rezultatelor prin calcul manual](/ro/guide/verification).

## Experimentează {#_9-experiment}

Modifică modelul și urmărește cum se schimbă diagramele. Încearcă fiecare modificare separat și anuleaz-o cu <kbd>Ctrl</kbd>+<kbd>Z</kbd> înainte de următoarea. Nodul `3` este nodul de la mijlocul deschiderii pe care tocmai l-ai adăugat.

- **Trage nodul `2`** spre dreapta. Momentul crește cu $L^2$, iar săgeata cu $L^4$.
- **Bifează `Ry` în nodul `1`** ca să încastrezi acel capăt. În încastrare apare un moment negativ: $qL^2/8 = 54$ kNm după formula din manual, 53,8 kNm în EduBeam. La o grindă static nedeterminată, rigiditatea la forfecare modifică și eforturile.
- **Bifează `Dz` în nodul `3`** ca să adaugi un reazem intermediar și să obții o grindă continuă cu două deschideri. Momentul pe reazemul intermediar devine negativ: $q(L/2)^2/8 = 13{,}5$ kNm prin calcul manual, 13,3 kNm în EduBeam, din același motiv.
- **Bifează `Dz` în nodul `3` și a doua căsuță din coloana *Articulații la capete* a elementului `1a`** (capătul lui din nodul `3`) în fila **Elemente**. Grinda devine două grinzi simplu rezemate de câte 3 m. Acum debifează `Dz` în nodul `3`: grinda devine un mecanism, iar EduBeam arată cum se poate mișca.

Ca să explorezi influența deschiderii și a încărcării fără să construiești nimic, trage de cursoarele de mai jos și comută între rezultate ca să vezi cum crește fiecare odată cu deschiderea.

::example-structure
::

## Salvează sau partajează {#_10-save-or-share}

- **Trimite-l cuiva.** Apasă **Partajează modelul** în bara aplicației, apoi **Copiază**. Linkul conține întregul model, iar oricine îl deschide primește propria copie, pe care o poate edita.
- **Păstrează-l ca fișier.** **☰ → Salvează proiectul** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) descarcă un fișier `project.json`. Îl redeschizi cu **☰ → Deschide un proiect** (<kbd>Ctrl</kbd>+<kbd>O</kbd>) sau trăgându-l peste aplicație.
- **Pune desenul într-un raport.** **☰ → Exportă imaginea** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) îl salvează ca PNG sau SVG.

Modelul se păstrează și în browser, așa că reîncărcarea paginii nu îl pierde. Detaliile sunt în [Fișiere, linkuri și export](/ro/essentials/import-export).

## Ce urmează {#where-next}

::card-grid{cols="2"}
:::card{title="Tutoriale" icon="lucide:graduation-cap" to="/ro/tutorials/inclined-beam"}
Patru modele construite pas cu pas și verificate prin calcul manual, de la o grindă înclinată la o grindă continuă cu cedare de reazem.
:::
:::card{title="Exemple" icon="lucide:library" to="/ro/examples/"}
Grinzi, cadre și grinzi cu zăbrele gata făcute, care se deschid dintr-un clic, cu exerciții și răspunsuri.
:::
:::card{title="Încărcări" icon="lucide:arrow-down-to-line" to="/ro/essentials/loads"}
Încărcări trapezoidale, concentrate și din variație de temperatură, forțe nodale și cedări de reazem.
:::
:::card{title="Tastatură, mouse și ecran tactil" icon="lucide:keyboard" to="/ro/reference/shortcuts"}
Desenează noduri și elemente direct în zona de desen și editează mai repede.
:::
::
