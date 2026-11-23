---
description: "Plasarea și editarea nodurilor în EduBeam, alinierea la grilă, împărțirea elementelor și alegerea reazemului potrivit: articulație, reazem simplu, încastrare, încastrare glisantă, reazem vertical sau înclinat."
source: site
---

# Noduri și reazeme

Nodurile sunt punctele modelului: elementele le leagă, iar reazemele și încărcările nodale stau pe ele. Le plasezi introducând coordonatele sau cu clicuri, apoi dai nodurilor rezemate reazemul care corespunde schemei tale.

## Coordonate {#coordinates}

Fiecare nod are o coordonată **X** și una **Z**, în [unitatea de lungime](/ro/essentials/units-settings#units) curentă. Axa X este orientată spre dreapta, iar axa **Z în jos**, deci tot ce se află deasupra terenului are Z negativ: un stâlp înalt de 4 m merge de la `Z = 0` la `Z = −4`.

::model-figure{caption="Un cadru portal cu deschiderea de 6 m și înălțimea de 4 m: A și D sunt la Z = 0, B și C la Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

Dacă preferi ca axa verticală să fie orientată în sus, treci la [axe cu y în sus](/ro/elements/conventions#y-up-axes) în Setări. Se schimbă doar afișarea; modelul și fișierele lui rămân aceleași.

## Adăugarea nodurilor {#adding-nodes}

- **Prin introducerea coordonatelor.** Fila *Noduri* → **Adaugă nod** (butonul cu pictograma **+**) sau clic dreapta pe desen → *Adaugă nod*. Introdu X și Z și, opțional, reazemele și unghiul reazemului.
- **Cu clicuri.** Fila *Noduri* → **Adaugă nod** (butonul cu pictograma cursorului) sau ține apăsat <kbd>Ctrl</kbd> când alegi *Adaugă nod* din meniul desenului. Fiecare clic plasează un nod; ca să te oprești, apasă <kbd>Esc</kbd>, **Renunță** sau din nou același buton.
- **În timp ce desenezi elemente.** Când [desenezi elemente cu mouse-ul](/ro/essentials/elements#adding-elements), un clic pe o zonă goală a desenului creează acolo un nod.
- **Prin copiere.** Selectează nodurile (și elementele), apasă <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>, apoi dă clic unde vrei copia sau introdu un decalaj Δx, Δz în bara de sus și apasă **Lipește**.

::div{.shots}

![Fereastra Adaugă nod](/screenshots/ro/qs-node.webp)

![În modul mouse, bara de sus stabilește reazemele și unghiul fiecărui nod plasat](/screenshots/ro/nodes-add-banner.webp)

::

Nodurile noi primesc următorul număr liber, `1`, `2`, `3`, …. Oricare dintre ele poate fi redenumit în coloana *Nod* a tabelului, de exemplu `A`, `B`, `C`.

### Alinierea la grilă {#snapping}

Cu **Aliniere la grilă** pornită (apasă <kbd>S</kbd> sau butonul **S** din dreapta jos a zonei de desen), nodurile pe care le plasezi sau le tragi ajung pe grilă. Pasul este implicit 0,1 m, iar în unități americane 0,5 ft; îl schimbi în [Setări → Setări de afișare → Grilă](/ro/essentials/units-settings#viewer-settings). Pentru orice altă poziție, introdu coordonatele exacte în tabel.

### Plasarea unui nod pe un element existent {#placing-a-node-on-an-existing-element}

Dacă dai clic pe un element (sau foarte aproape de el) în timp ce adaugi noduri cu mouse-ul, EduBeam te întreabă ce vrei să faci:

- **Conectează la structură** împarte elementul în două, `1a` și `1b`, legate în noul nod. Este cel mai rapid mod de a adăuga un reazem intermediar sau un punct în care să aplici o încărcare. Articulațiile de la capetele exterioare rămân unde erau. Încărcările uniform distribuite și trapezoidale se împart între cele două jumătăți. Forțele concentrate și variațiile de temperatură ajung toate pe prima jumătate, `1a`: în tabelul *Încărcări*, mută pe `1b` forța concentrată care se afla dincolo de noul nod (poziția ei se măsoară acum de la noul nod) și dă-i lui `1b` propria variație de temperatură.
- **Plasează un nod separat** pune nodul peste element, fără să-l conecteze.

În ambele cazuri, plasarea nodurilor se oprește aici; dă din nou clic pe butonul cu cursorul ca să plasezi altele.

## Editarea nodurilor {#editing-nodes}

| Ca să | Fă așa |
| --- | --- |
| Muți un nod | Trage-l în zona de desen (pe ecran tactil, apasă și trage) sau introdu X și Z în tabelul *Noduri*. Elementele legate, încărcările lor și cotele îl urmează. |
| Îl redenumești | Scrie o etichetă nouă în coloana *Nod*. |
| Îi schimbi reazemele | Dă clic pe el → **Reazeme în nod** sau folosește coloana *Grade de libertate blocate*. Vezi [Reazeme](#supports). |
| Editezi totul deodată | Creionul din coloana *Acțiuni* deschide **Editează nodul**: coordonate, reazeme și unghiul reazemului, cu o previzualizare a simbolului. |
| Îl ștergi | × din tabel, **Șterge** din panoul nodului sau selectează-l și apasă <kbd>Delete</kbd>. Odată cu el dispar și elementele, încărcările și cotele legate de el. |

Orice modificare poate fi anulată cu <kbd>Ctrl</kbd>+<kbd>Z</kbd>.

## Reazeme {#supports}

Fiecare nod se poate mișca în trei feluri, numite **grade de libertate**: `Dx` în lungul lui x, `Dz` în lungul lui z și `Ry`, o rotire în planul desenului. Un reazem **blochează** o parte dintre ele.

Cele opt tipuri de reazeme corespund celor opt combinații posibile ale acestor trei grade de libertate. Citește tabelul pe rânduri: în coloana din mijloc nodul se rotește liber, în cea din dreapta are blocată și rotirea.

| Translații blocate | Rotire liberă | Rotire blocată |
| --- | --- | --- |
| **Ambele** (`Dx` și `Dz`) | ![](/screenshots/ro/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Articulație** | ![](/screenshots/ro/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Încastrare** |
| **Doar cea verticală** (`Dz`): lunecă pe orizontală | ![](/screenshots/ro/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Reazem simplu** | ![](/screenshots/ro/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Încastrare glisantă** |
| **Doar cea orizontală** (`Dx`): lunecă pe verticală | ![](/screenshots/ro/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Reazem simplu vertical** | ![](/screenshots/ro/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Încastrare glisantă verticală** |
| **Niciuna**: lunecă în ambele direcții | ![](/screenshots/ro/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Liber** (fără reazem) | ![](/screenshots/ro/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Doar rotire blocată** |

Pentru fiecare grad de libertate blocat, EduBeam calculează o **reacțiune**: `Dx` dă o forță orizontală $R_x$, `Dz` o forță verticală $R_z$, iar `Ry` un moment $M$. Așadar o articulație dă $R_x$ și $R_z$, un reazem simplu doar $R_z$, o încastrare glisantă $R_z$ și $M$, iar o încastrare toate trei.

### Definirea unui reazem {#setting-a-support}

Alege simbolul sau bifează gradele de libertate unul câte unul; cele două rămân mereu sincronizate. Le găsești pe amândouă în trei locuri:

- în panoul nodului (dă clic pe nod) → **Reazeme în nod**, împreună cu **Unghiul sistemului local al nodului**, ca mai jos;
- în ferestrele **Adaugă nod** și **Editează nodul**;
- în coloana *Grade de libertate blocate* a tabelului *Noduri*, unde simbolul este un mic meniu, iar `Dx`, `Dz`, `Ry` sunt casete de bifare.

![Reazeme în nod, în panoul nodului: simbolurile, casetele gradelor de libertate și unghiul reazemului](/screenshots/ro/nodes-support-picker.webp){.shot-lg}

Ține cursorul deasupra unui simbol ca să-i vezi numele.

### Reazem simplu sau încastrare glisantă? {#roller-or-slider}

Ambele stau pe o glisieră și lunecă de-a lungul ei. Diferența este rotirea:

- un **reazem simplu** este o articulație pe glisieră: capătul **se rotește liber**, deci acolo nu există moment;
- o **încastrare glisantă** este o încastrare pe glisieră: capătul **nu se poate roti**, deci reazemul preia un moment.

Aceeași grindă de 6 m încărcată cu 10 kN/m, la care se schimbă doar reazemul din dreapta. Comută între deformată și momentul încovoietor:

::div{.shots}

:::model-figure{caption="Articulație și reazem simplu: capătul din dreapta se rotește liber; acolo M = 0, iar în fiecare reazem 30 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Articulație și încastrare glisantă: capătul din dreapta rămâne orizontal; acolo M = −45 kNm, iar în încastrarea glisantă 37,5 kN"}
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

Prima este o grindă simplu rezemată ($M_{max} = qL^2/8 = 45\ \text{kNm}$ la mijlocul deschiderii). Sub încărcări verticale, încastrarea glisantă se comportă exact ca o încastrare, deci a doua este o grindă încastrată și simplu rezemată ($R_B = 5qL/8 = 37{,}5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Faptul că acel capăt rămâne orizontal face grinda și mai rigidă: săgeata maximă scade de la 9,617 mm la 4 mm. Încastrarea glisantă diferă de o încastrare doar când ceva împinge în lungul glisierei.

### Reazeme înclinate {#inclined-skewed-supports}

Un reazem pe o suprafață înclinată blochează nodul după axe rotite. Stabilește **Unghiul sistemului local al nodului** α, în grade de la −180 la 180, în panoul nodului, la *Reazeme în nod*, în ferestrele de adăugare și editare a nodului sau în câmpul **α** din tabelul *Noduri*.

Axele nodului se rotesc cu α, iar gradele de libertate bifate acționează după ele. α rotește x spre z, adică **în sens orar** pe ecran (cu axe cu y în sus, rotește x spre y, în sens antiorar). Așadar un reazem simplu pe o suprafață care coboară spre dreapta cu 30° este un reazem simplu cu α = 30°. Simbolul se rotește odată cu axele, iar reacțiunea este raportată după ele.

::model-figure{caption="Reazemul simplu din B rotit cu α = 30°: reacțiunea lui de 34,64 kN este perpendiculară pe pantă, iar grinda preia N = +17,32 kN"}
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

Este aceeași grindă de mai sus, de 6 m, încărcată cu 10 kN/m, dar reazemul simplu stă acum pe o pantă de 30°. Componenta verticală a reacțiunii din B este tot $qL/2 = 30\ \text{kN}$, deci reacțiunea însăși este $30/\cos 30° = 34{,}64\ \text{kN}$, iar componenta ei orizontală, $30 \tan 30° = 17{,}32\ \text{kN}$, împinge B spre dreapta. Articulația din A îl reține, așa că grinda este întinsă. Momentul încovoietor nu se schimbă.

[Încărcările nodale](/ro/essentials/loads#nodal-loads) dintr-un nod cu axe rotite pot fi date în axe globale sau în axele nodului; o [deplasare impusă](/ro/essentials/loads#prescribed-displacements-support-settlements) acționează întotdeauna după axele proprii ale reazemului.

### Stabilitate {#stability}

O structură plană are nevoie de cel puțin **trei grade de libertate blocate**, dispuse astfel încât s-o fixeze efectiv. Cât timp lipsesc reazeme, zona de desen afișează o etichetă albastră **Necesită reazeme**. Dacă reazemele sunt destule, dar nu pot fixa structura (sunt toate paralele sau se intersectează toate într-un punct), ori articulațiile lasă barele să se rotească unele față de altele, un mesaj roșu indică problema, iar un contur punctat arată cum se mișcă structura. [Depanare](/ro/reference/troubleshooting#messages) explică fiecare mesaj.

## Încărcări nodale și cedări de reazem {#nodal-loads-and-settlements}

Dă clic pe un nod → **Adaugă încărcare** pentru o forță sau un moment, sau → **Impune o deplasare** ca să deplasezi un reazem cu o valoare dată (o cedare de reazem). Ambele sunt explicate la [Încărcări nodale](/ro/essentials/loads#nodal-loads).

## Cote {#dimension-lines}

Cotele marchează lungimi pe desen. Nu influențează calculul, dar se salvează în proiect, se transmit prin linkurile de partajare și apar în [imaginile exportate](/ro/essentials/import-export#export-an-image).

| Ca să | Fă așa |
| --- | --- |
| Adaugi o cotă | Clic dreapta pe desen → **Adaugă cotă**, apoi dă clic pe cele două capete. Un punct de lângă un nod se aliniază la el. |
| Cotezi un element | Clic dreapta pe element → **Cotează elementul**. |
| O editezi sau o inversezi | Dă clic pe cotă → **Editează** ca să-i introduci coordonatele sau **Inversează cota** ca să muți eticheta pe partea cealaltă. |
| O muți | Trage de ea sau de unul dintre capete. Un capăt aflat pe un nod rămâne legat de el și îl urmează. |
