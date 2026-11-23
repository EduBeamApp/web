---
description: "Rezultatele în EduBeam: diagramele N, V și M, deformata și reacțiunile, semnele lor, valorile la cursor, tabelele de rezultate, exportul CSV și matricea de rigiditate."
source: site
---

# Rezultate și diagrame de eforturi

[EduBeam]{.edubeam} calculează modelul după fiecare modificare, așa că diagramele, reacțiunile și tabelele de pe ecran corespund întotdeauna modelului pe care îl vezi. Nu există un buton *Calculează*. Dacă nu se desenează nimic, modelul încă nu poate fi calculat: mesajul din stânga sus a zonei de desen spune de ce, iar [Depanare](/ro/reference/troubleshooting) explică fiecare mesaj.

## Rezultatele în zona de desen {#overlays-in-the-viewer}

Rezultatele sunt desenate peste model. Le pornești și le oprești din **opțiunile de afișare** din dreapta sus a zonei de desen; butonul ⚙ de deasupra lor afișează sau ascunde panoul.

::model-figure{caption="Cadru cu trei articulații, 10 kN/m: comută între M, V, N și deformată"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, V, N, w]
show: [nodeLabels]
height: 300
---
::

| Comutator | Desenează | Culoare | Pornit la început |
| --- | --- | --- | --- |
| **Deformata** | structura deplasată, exagerată ca să fie vizibilă | gri | da |
| **N (x)** | forța axială | albastru | |
| **V<sub>z</sub> (x)** | forța tăietoare | verde | |
| **M<sub>y</sub> (x)** | momentul încovoietor | roșu | da |
| **Reacțiuni** | o săgeată și o valoare pentru fiecare direcție blocată | violet | da |

Al doilea rând comută desenul propriu-zis: **Reazeme**, **Încărcări**, **Etichetele nodurilor** și **Etichetele elementelor**. **Mai multe setări**, sub panou, deschide [setările de afișare](/ro/essentials/units-settings#viewer-settings), unde stabilești mărimea diagramelor (*Scara rezultatelor*), culorile, orientarea valorilor și stilul diagramelor.

Valorile sunt scrise acolo unde contează: la capetele fiecărei bare, de o parte și de alta a unui salt sub o forță concentrată sau deasupra unui reazem și în fiecare extrem al diagramei, de exemplu în vârful unei parabole, unde $V = 0$. Figura de mai sus arată [cadrul cu trei articulații](/ro/tutorials/three-hinged-frame), pe care îl poți verifica de mână: 40 kN compresiune în fiecare stâlp, 20 kN în riglă și −80 kNm în ambele colțuri. Diagrama *w* arată că articulația din C coboară cu 42,55 mm.

### Citirea semnului {#reading-the-sign}

Citește semnul din **valoare**, nu din partea barei pe care este desenată diagrama. Convențiile sunt cele din majoritatea manualelor:

| Rezultat | Pozitiv înseamnă |
| --- | --- |
| **N** | întindere |
| **V<sub>z</sub>** | rotește în sens orar un segment scurt al barei. Deoarece $V = \mathrm{d}M/\mathrm{d}x$, la o grindă simplu rezemată sub încărcări gravitaționale este pozitivă la reazemul din stânga și negativă la cel din dreapta |
| **M<sub>y</sub>** | moment pozitiv: întinde fibra inferioară, pe partea **liniei punctate** desenate de-a lungul fiecărei bare |

O grindă cu consolă arată ambele semne deodată. Între reazeme momentul este pozitiv (+13,5 kNm); pe reazemul din dreapta este negativ (−24 kNm), cu fibra întinsă sus. Forța tăietoare face în B un salt egal cu reacțiunea de 54 kN, de la −30 la +24 kN:

::model-figure{caption="Grindă cu consolă, 12 kN/m: moment pozitiv între reazeme, negativ pe reazemul B"}
---
nodes: { A: [0, 0], B: [4, 0], C: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

Implicit, momentul încovoietor este desenat pe **fibra întinsă**, iar forțele axiale și tăietoare pozitive pe partea opusă liniei punctate. Școlile diferă în această privință, așa că fiecare se poate inversa în **Setări → Setări de afișare → Diagrame de eforturi**, unde poți și să hașurezi diagramele ca la desenul de mână și să notezi pe fiecare segment gradul polinomului. Inversarea părții schimbă doar desenul, niciodată valorile. Convențiile de semne complete, inclusiv axele locale ale elementului, se găsesc în [partea de teorie](/ro/elements/conventions#internal-forces).

## Valori la cursor {#hover-tooltips}

Ține cursorul deasupra unui obiect ca să-i citești valorile:

- **Nod**: deplasările $u_x$, $u_z$ (în unitatea pentru deplasări) și rotirea $\varphi_y$ (în radiani).
- **Element**: eticheta, secțiunea transversală și materialul.
- **Încărcare**: componentele ei.

Pe ecran tactil, atinge obiectul: panoul lui arată aceleași detalii.

![Cursorul deasupra nodului 2 al grinzii din Ghidul de început](/screenshots/ro/ui-hover.webp){.shot-sm}

## Fila Rezultate {#results-tab}

Fila **Rezultate** din bara de jos conține două tabele, între care comuți cu **Rezultate în noduri** și **Rezultate pe elemente**.

### Rezultate în noduri {#nodal-results}

Câte un rând pentru fiecare nod, cu deplasările **D<sub>x</sub>** și **D<sub>z</sub>** (în unitatea pentru deplasări) și rotirea **R<sub>y</sub>** (în radiani), în axe globale: D<sub>z</sub> pozitiv este în jos, iar R<sub>y</sub> pozitiv în sens antiorar pe ecran. O direcție blocată arată 0 sau cedarea de reazem pe care ai impus-o. Reacțiunile nu apar în acest tabel: citește-le pe desen sau în [exportul CSV](#export-csv-and-copy).

![Rezultatele în noduri ale cadrului cu trei articulații de mai sus, cu Formatul numerelor setat pe Automat](/screenshots/ro/p2c-results-nodal.webp){.shot-lg}

### Rezultate pe elemente {#element-results}

Câte un rând pentru fiecare element, cu **forțele de la capete în sistemul de coordonate local al elementului**:

| Coloană | Semnificație |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | forța axială, forța tăietoare și momentul care acționează asupra elementului în nodul lui **inițial** |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | același lucru în nodul **final** |

![Rezultatele pe elemente ale cadrului cu trei articulații: forțele de la capetele celor patru bare](/screenshots/ro/p2c-results-element.webp)

Forțele de la capete sunt forțele cu care nodurile acționează asupra elementului. Ele urmează axele locale, nu convenția N-V-M a diagramelor, de aceea semnele lor diferă:

- **Grindă simplu rezemată** (6 m, 12 kN/m, din [Ghidul de început](/ro/guide/quick-start)): Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. Ambele reazeme împing grinda în sus, adică în sensul −z.
- **Consolă** încastrată în nodul inițial, cu 18 kN în jos la capătul liber: Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **Stâlpul 1 al cadrului** (A jos, B sus): X<sub>12</sub> = +40 kN împinge în lungul axei locale x, spre interiorul elementului, ceea ce înseamnă o compresiune de 40 kN.

Mai multe despre acest tabel în [partea de teorie](/ro/elements/conventions#end-forces-element-results-table).

### Exportă CSV și Copiază {#export-csv-and-copy}

**Exportă CSV** descarcă fișierul `edubeam-results.csv` cu ambele tabele, în unitățile afișate pe ecran, gata pentru un program de calcul tabelar. **Copiază** pune aceleași tabele în clipboard ca text separat prin tabulatori, care se lipește direct în Excel, LibreOffice sau Google Sheets.

| Tabel | Coloane |
| --- | --- |
| Noduri | Node, x, z, Dx, Dz, Ry și **reacțiunile** Rx, Rz, My |
| Elemente | Element, Node 1, Node 2 și forțele de la capete N1, V1, M1, N2, V2, M2 |

Fiecare titlu de coloană conține unitatea, de exemplu `Dz [mm]`. Forțele de la capetele elementelor sunt aceleași valori locale ca X<sub>12</sub> … M<sub>21</sub> de pe ecran.

### Matricea de rigiditate {#stiffness-matrix}

Alege **Matrice de rigiditate** din panoul unui element sau cu butonul din rândul lui din tabelul *Elemente* ca să deschizi matricea de rigiditate 6 × 6 a elementului în **coordonate globale** și unități SI (N, m). Este utilă pentru verificarea asamblării de mână la un curs despre metoda deplasărilor; formulele se găsesc în [partea de teorie](/ro/elements/beam).

## Formatul numerelor {#number-format}

Tabelele și valorile la cursor arată rezultatele cu cinci cifre semnificative. **Setări → Limbă și regiune → Formatul numerelor** stabilește cum sunt scrise:

| Format | 40 000 se scrie | Folosește-l pentru |
| --- | --- | --- |
| **Științific** (implicit) | 4 · 10⁴ | valori care se întind pe multe ordine de mărime |
| **Ingineresc** | 40 · 10³ | citirea directă a prefixelor kilo și mega |
| **Automat** | 40 000 | numerele obișnuite de la curs și seminar |

*Automat* scrie valorile de la 0,001 până la 100 000 ca numere obișnuite. În afara acestui interval le scrie ca *Ingineresc*, cu puteri ale lui zece din trei în trei, de exemplu 380,95 · 10⁻⁹ în rezultatele în noduri de mai sus. Separatorul zecimal urmează limba.

Etichetele de pe desen (valorile diagramelor și reacțiunile) au întotdeauna două zecimale, indiferent de formatul numerelor: 6,6667 kN apare ca 6,67. Citește tabelele sau valorile la cursor când ai nevoie de mai multe cifre.

## Precizie și exactitate {#precision-and-accuracy}

- Elementul de bară este exact pentru modelul liniar Timoshenko sub încărcări nodale, uniform distribuite, trapezoidale, concentrate și variații de temperatură. Rezultatele **nu** depind de numărul de elemente și nu există o rețea de discretizare de rafinat.
- Calculul se face în dublă precizie. O valoare mai mică decât o miime de miliard din cea mai mare valoare de același fel este eroare de rotunjire, iar tabelele o arată ca 0.
- Deplasările includ **deformația din forfecare**, iar la o structură static nedeterminată aceasta modifică ușor și eforturile. La barele zvelte adaugă o fracțiune de procent la săgeata Euler–Bernoulli; la barele scurte și înalte poate ajunge la zece procente sau mai mult. [Verificarea rezultatelor prin calcul manual](/ro/guide/verification#shear-deformation) arată cât de mare este și cum o dezactivezi pentru comparația cu formulele din manuale.

## Rezultatele într-un raport {#results-in-a-report}

- **☰ → Exportă imaginea** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) salvează desenul ca PNG sau SVG, cu diagramele pe care le alegi. Vezi [Exportul unei imagini](/ro/essentials/import-export#export-an-image).
- **Exportă CSV** sau **Copiază** din fila Rezultate îți dau valorile numerice.
- **Partajează modelul** îți dă un link, astfel încât cititorul să poată deschide chiar modelul.
- Pentru note de curs și fișe de exerciții, [@edubeam/plot](/ro/plot) desenează aceleași diagrame din cod.
