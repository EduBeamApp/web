---
description: "Tutorial: un cadru cu trei articulații încărcat uniform distribuit în EduBeam, cu reacțiunile, împingerea și eforturile, verificate prin calcul manual, inclusiv săgeata articulației."
source: site
---

# Tutorial: cadru cu trei articulații

Modelează un cadru portal cu o articulație la mijlocul deschiderii, citește reacțiunile și diagramele și verifică fiecare valoare prin calcul manual, până la săgeata articulației.

- **Timp:** aproximativ 15 minute.
- **Ai nevoie de:** EduBeam deschis într-o a doua filă, pe un calculator cu mouse și tastatură. Dacă n-ai mai folosit EduBeam, parcurge mai întâi [Ghidul de început](/ro/guide/quick-start) sau tutorialul [Grindă înclinată](/ro/tutorials/inclined-beam).
- **Cunoștințe necesare:** echilibrul unui cadru și diagramele de corp liber. Verificarea opțională a săgeții folosește metoda forței unitare (lucrul mecanic virtual).
- **Unități:** SI. Butonul unităților din colțul din dreapta jos al zonei de desen trebuie să arate `m m² kN kNm MPa`. Dacă arată picioare și kipi, dă clic pe el și setează **Sistem de unități** la **SI (metric)**.

**Vei învăța să**

- desenezi un cadru cu mouse-ul, ca o singură linie frântă,
- pui o articulație în interiorul unei bare cu căsuțele **Articulații la capete**,
- afli împingerea orizontală din condiția $M = 0$ în articulație și interpretezi semnul lui $V$ în bare desenate în sensuri diferite.

::div{.actions}
[Deschide EduBeam ↗](https://run.edubeam.app/?lang=ro){target="_blank"} [Sari la verificarea manuală](#_6-check-by-hand)
::

::model-figure{caption="Cadrul terminat: 10 kN/m pe riglă, articulații în nodurile 1 și 5, o articulație interioară în nodul 3"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Problema {#the-problem}

- Doi stâlpi de 4 m, articulați la bază în nodurile 1 și 5, la 8 m distanță unul de altul.
- O riglă orizontală de la nodul 2 la nodul 4, deasupra, cu o articulație la mijlocul deschiderii, în nodul 3.
- O încărcare uniform distribuită $q = 10$ kN/m pe toată rigla.
- Oțel, $E = 210$ GPa, și $I_y = 8{,}356 \times 10^{-5}$ m⁴ (un IPE 300) pentru toate barele.

| Nod | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | articulație |
| 2 | 0 | −4 | colț |
| 3 | 4 | −4 | articulație în riglă |
| 4 | 8 | −4 | colț |
| 5 | 8 | 0 | articulație |

Axa z este îndreptată **în jos**, deci capetele de sus ale stâlpilor au $z = -4$.

**Este static determinat?** Cele două articulații dau patru reacțiuni. Trei ecuații de echilibru și $M_3 = 0$ în articulație fac patru ecuații: da.

## Modelează {#model-it}

::div{.steps}

### Material și secțiune {#_1-material-and-section}

1. Dă clic pe **Golește modelul** în bara aplicației, bifează **Șterge materialele** și **Șterge secțiunile** și dă clic pe **Confirmă**. Nodurile și elementele se numerotează din nou de la 1.
2. Fila **Materiale** → **Bibliotecă de materiale** → **+** pe rândul **Oțel (S235)**, apoi **Renunță** ca să închizi biblioteca.
3. Fila **Secțiuni** → **Adaugă secțiune**. Introdu `8,356e-5` la **Iy**, păstrează **Arie**, **Înălțime** și **Coeficient de forfecare** la `1` și dă clic pe **Adaugă secțiune**.

O arie de 1 m² împiedică barele să se scurteze sau să se deformeze vizibil din forfecare, așa cum presupune calculul manual al săgeții. Eforturile unui cadru static determinat nu depind deloc de $E$, $A$ sau $I_y$.

### Desenează cadrul {#_2-draw-the-frame}

1. Fila **Elemente** → al doilea buton **Adaugă element**, cel cu pictograma cursorului.
2. Dă clic în (0, 0), (0, −4), (4, −4), (8, −4) și (8, 0). Fiecare clic adaugă următorul nod și îl leagă de cel anterior; clicurile se aliniază la grilă.
3. Apasă <kbd>Esc</kbd> ca să oprești desenarea, apoi <kbd>F</kbd> ca să încadrezi vederea.

Acum ai nodurile 1–5 și elementele 1–4, numerotate în ordinea în care le-ai desenat, ca în figurile de aici. Compară tabelul **Noduri** cu tabelul de mai sus și corectează orice coordonată greșită.

### Reazemele și articulația {#_3-supports-and-the-hinge}

1. Dă clic pe nodul 1 → **Reazeme în nod** → simbolul **Articulație**. Fă la fel pentru nodul 5.
2. În tabelul **Elemente**, găsește elementul 2, de la nodul 2 la nodul 3, și bifează a doua dintre căsuțele lui **Articulații la capete**: articulația de la capătul lui, din nodul 3.

![Tabelul Elemente: elementul 2 are bifată articulația de la capăt, în nodul 3](/screenshots/ro/p2t-frame-elements-table.webp)

O singură articulație este suficientă. Elementul 3 este atunci singura bară legată rigid de nodul 3, deci în nodul 3 nu i se poate transmite niciun moment. Dacă bifezi și începutul elementului 3, nu se schimbă nimic.

### Încărcare {#_4-load}

1. Fila **Încărcări** → **Adaugă încărcare pe element**.
2. **Tipul încărcării** *Încărcare uniform distribuită*, **Element** `2`, `fz = 10`. Dă clic pe **Adaugă încărcare pe element**.
3. Repetă pentru elementul 3.

`fz` este pozitiv în jos. Rigla este orizontală, deci căsuța **LCS** nu contează aici.

::

## Rezultate {#_5-results}

În opțiunile de afișare din dreapta sus a zonei de desen (rotița le afișează și le ascunde), **Deformata**, **M<sub>y</sub> (x)** și **Reacțiuni** sunt pornite de la început. Bifează **N (x)** și **V<sub>z</sub> (x)** pentru restul sau debifează câteva ca să vezi câte o diagramă pe rând. EduBeam le etichetează în kN și kNm, cu două zecimale.

- Fiecare bază arată `40,00` în sus și `20,00` spre interior.
- Momentul încovoietor arată `-80,00` în ambele colțuri și nu are etichetă în articulație, unde este zero. EduBeam îl desenează de partea fibrei întinse, aici spre exteriorul cadrului.
- Forța axială este negativă peste tot: `-40,00` în stâlpi, `-20,00` în riglă. Toate cele patru bare sunt comprimate.
- Fila **Rezultate** → **Rezultate în noduri**: articulația, nodul 3, coboară cu $D_z$ = `4,2554 · 10⁻² m`, adică 42,55 mm, valoarea din articulație în diagrama $w(x)$ din figura de mai sus.

## Verificarea prin calcul manual {#_6-check-by-hand}

**Reacțiunile verticale.** Din simetrie, fiecare bază preia jumătate din cei 80 kN:

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Reacțiunile orizontale.** Secționează cadrul prin articulație și scrie momentele față de nodul 3 pentru jumătatea din stânga, unde momentul este zero:

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

Ambele baze împing spre interior cu 20 kN. Fără această împingere, dată de reazemele articulate care nu se pot îndepărta unul de altul, cadrul nu s-ar putea menține: stâlpii s-ar răsfira, iar articulația s-ar prăbuși.

| Mărime | Formulă | Calcul manual | EduBeam |
| --- | --- | --- | --- |
| Reacțiunile verticale | $q \cdot 8/2$ | 40 kN | 40,00 |
| Reacțiunile orizontale | din $M_3 = 0$ | 20 kN | 20,00 |
| Momentele din colțuri, nodurile 2 și 4 | $H_1 \cdot 4$ | 80 kNm, fibra exterioară întinsă | −80,00 |
| Momentul din articulație, nodul 3 | | 0 | fără etichetă |
| $N$ în stâlpi | $-V_1$ | −40 kN | −40,00 |
| $N$ în riglă | $-H_1$ | −20 kN | −20,00 |
| $V$ în stâlpi | $\pm H_1$ | ±20 kN | −20,00; 20,00 |
| $V$ în riglă în nodurile 2, 3, 4 | $V_1 - q\,x$ | 40; 0; −40 kN | 40,00; fără etichetă; −40,00 |

Cei doi stâlpi au aceeași forță tăietoare cu semne opuse, −20 kN în elementul 1 și +20 kN în elementul 4, pentru că axele locale ale fiecărui element urmează sensul în care a fost desenat: elementul 1 în sus, elementul 4 în jos. Inversează nodurile unui stâlp și semnul lui se schimbă. [Axe și convenții de semne](/ro/elements/conventions#internal-forces) explică de ce.

În riglă, $M(x) = -80 + 40x - 5x^2$ kNm, cu $x$ măsurat de la nodul 2. Momentul este zero în articulație și nu este niciodată pozitiv: pe toată rigla este întinsă fibra superioară. Forța tăietoare $V(x) = 40 - 10x$ este zero exact în articulație, deci acolo momentul își atinge valoarea extremă.

::callout{type="details" title="Săgeata articulației, prin lucrul mecanic virtual"}
Aplică o forță unitară în jos în nodul 3. Ea dă reacțiunile $\bar V = \bar H = 1/2$ și un moment $\bar m$ care crește de la 0 la bază la 2 în colț și scade înapoi la 0 în articulație, cu fibra exterioară întinsă, ca momentul real $M$. Integrează $M \bar m$ pe cele patru bare:

$$
\text{stâlpi: } 2\int_0^4 (20\,y)(0{,}5\,y)\,dy = 426{,}7
$$

$$
\text{riglă: } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0{,}5x)\,dx = 320
$$

Cu $EI = 210 \times 10^6 \cdot 8{,}356 \times 10^{-5} = 17\,548$ kNm²:

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746{,}7}{17\,548} = 0{,}04255\ \text{m}
$$

Aceștia sunt cei 42,55 mm pe care EduBeam îi raportează ca `4,2554 · 10⁻²` m. Ultima cifră, 4, provine din mica scurtare și din deformația din forfecare pe care o arie de 1 m² încă le permite și pe care calculul manual le neglijează. Cu aria reală a unui IPE 300, $A = 53{,}8$ cm², și cu inima ca arie de forfecare (un coeficient de forfecare de 0,40), barele se scurtează și se deformează din forfecare mai mult, iar articulația coboară cu 43,7 mm, cu circa 3 % mai mult.
::

## Experimentează {#_7-experiment}

Modifică pe rând câte un singur lucru, anticipează rezultatul, apoi verifică-l. <kbd>Ctrl</kbd>+<kbd>Z</kbd> anulează fiecare modificare.

**Debifează articulația.** Cadrul devine o dată static nedeterminat. Împingerea scade la jumătate, la 10 kN, momentele din colțuri scad la −40 kNm, iar la mijlocul riglei apare un moment pozitiv de 40 kNm. Nodul 3 coboară acum doar cu 12,16 mm în loc de 42,55 mm. Acum contează și secțiunile: dă-i riglei o secțiune mai rigidă decât stâlpilor și momentele din colțuri cresc.

::model-figure{caption="Fără articulație: împingere mai mică, momente în colțuri de două ori mai mici și un moment pozitiv la mijlocul deschiderii"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], [2, 3], [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

**Încastrează bazele.** Dă-le nodurilor 1 și 5 simbolul **Încastrare**. Împingerea crește la 30 kN, iar la baze apar momente de 40 kNm (EduBeam arată `39,99`, pentru că stâlpii se scurtează foarte puțin), însă momentele din colțuri rămân la 80 kNm. Din simetrie, forța tăietoare din articulație este zero, deci fiecare jumătate a riglei lucrează în continuare ca o consolă de 4 m pornind din colțul ei: $q \cdot 4^2/2 = 80$ kNm.

**Împinge lateral.** Cu articulațiile la loc, adaugă o încărcare nodală `Fx = 10` kN în nodul 2. Reacțiunile își pierd simetria: 35 kN și 45 kN în sus, 15 kN și 25 kN pe orizontală. Verifică-le cu aceleași trei ecuații și cu $M_3 = 0$; încărcarea din nodul 2 nu are braț față de nodul 3. Colțul din stânga scade la −60 kNm, iar jumătatea stângă a riglei are acum un mic moment pozitiv, de 1,25 kNm, la 0,5 m de articulație.

::model-figure{caption="O forță orizontală de 10 kN în nodul 2: colțul din dreapta preia acum 100 kNm"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
  - { node: 2, fx: 10 }
results: [M, N]
show: [nodeLabels]
---
::

**Adaugă o a doua articulație.** Bifează și articulația de la începutul elementului 2, în nodul 2. Două articulații în riglă, pe doi stâlpi articulați, formează un mecanism. EduBeam nu afișează rezultate, raportează *Articulațiile din nodurile 2, 3 permit mișcarea structurii.* și animă mișcarea.

## Pașii următori {#next-steps}

::card-grid{cols="2"}
:::card{title="Exersează: cadre cu trei articulații" icon="lucide:dices" to="/ro/practice?p=H2048"}
Același cadru sub încărcări noi, printre care și o împingere orizontală, cu răspunsurile verificate imediat. Începe cu H2048; pentru mai multe, lasă selectat doar **Cadru cu trei articulații** și apasă **Problemă nouă**.
:::
:::card{title="Următorul: grindă cu zăbrele plană" icon="lucide:git-fork" to="/ro/tutorials/truss"}
Nouă bare articulate: metoda izolării nodurilor, metoda secțiunilor, o bară de efort nul și o săgeată prin lucrul mecanic virtual.
:::
::
