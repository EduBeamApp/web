---
description: "Tutorial: o grindă cu zăbrele plană în EduBeam, cu eforturile din bare verificate prin metoda izolării nodurilor și metoda secțiunilor, o bară de efort nul și o săgeată prin lucrul mecanic virtual."
source: site
---

# Tutorial: grindă cu zăbrele plană

Construiește din bare articulate o mică grindă cu zăbrele static determinată, verifică eforturile din bare prin metoda izolării nodurilor și prin metoda secțiunilor și verifică o săgeată prin lucrul mecanic virtual.

- **Timp:** aproximativ 20 de minute.
- **Ai nevoie de:** EduBeam deschis într-o a doua filă, pe un calculator cu mouse și tastatură. Dacă n-ai mai folosit EduBeam, parcurge mai întâi [Ghidul de început](/ro/guide/quick-start) sau unul dintre tutorialele anterioare.
- **Cunoștințe necesare:** metoda izolării nodurilor și metoda secțiunilor. Verificarea opțională a săgeții folosește metoda forței unitare (lucrul mecanic virtual).
- **Unități:** SI. Butonul unităților din colțul din dreapta jos al zonei de desen trebuie să arate `m m² kN kNm MPa`. Dacă arată picioare și kipi, dă clic pe el și setează **Sistem de unități** la **SI (metric)**.

**Vei învăța să**

- modelezi barele unei grinzi cu zăbrele ca elemente de bară cu articulații la ambele capete, desenate cu mouse-ul,
- verifici eforturile din bare prin metoda izolării nodurilor și prin metoda secțiunilor,
- recunoști o bară de efort nul și înțelegi de ce un model cu noduri articulate funcționează pentru o grindă cu zăbrele.

::div{.actions}
[Deschide EduBeam ↗](https://run.edubeam.app/?lang=ro){target="_blank"} [Sari la verificarea manuală](#_5-check-by-hand)
::

::model-figure{caption="Grinda cu zăbrele terminată: 30 kN în nodurile 2 și 3, eforturile din bare cu întinderea pozitivă"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N, w]
show: [nodeLabels, dimensions]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Problema {#the-problem}

- O deschidere de 12 m în trei panouri de 4 m, cu înălțimea de 3 m: nodurile tălpii inferioare 1–4, nodurile tălpii superioare 5 și 6.
- O articulație în nodul 1 și un reazem simplu în nodul 4.
- Două forțe de 30 kN, în nodurile 2 și 3 ale tălpii inferioare.
- Bare din oțel, $E = 210$ GPa, $A = 20$ cm².

| Elemente | Barele, după noduri | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | talpa inferioară |
| 4, 5, 6 | 1–5, 5–6, 6–4 | diagonală de capăt, talpa superioară, diagonală de capăt |
| 7, 8, 9 | 2–5, 5–3, 3–6 | montant, diagonala din mijloc, montant |

**Este static determinată?** Cu $m = 9$ bare, $r = 3$ reacțiuni și $j = 6$ noduri, $m + r = 12 = 2j$. Fiecare nod dă două ecuații de echilibru, deci eforturile din bare rezultă doar din statică.

## Modelează {#model-it}

::div{.steps}

### Material și secțiune {#_1-material-and-section}

1. Dă clic pe **Golește modelul** în bara aplicației, bifează **Șterge materialele** și **Șterge secțiunile** și dă clic pe **Confirmă**. Nodurile și elementele se numerotează din nou de la 1.
2. Fila **Materiale** → **Bibliotecă de materiale** → **+** pe rândul **Oțel (S235)**, apoi **Renunță** ca să închizi biblioteca.
3. Fila **Secțiuni** → **Adaugă secțiune**. Introdu `0,002` la **Arie** și `1e-6` la **Iy**, păstrează **Înălțime** și **Coeficient de forfecare** la `1` și dă clic pe **Adaugă secțiune**.

La barele articulate contează doar aria; $I_y$ trebuie doar să fie pozitiv.

### Desenează barele cu articulații {#_2-draw-the-bars-with-hinges}

În EduBeam, o bară de grindă cu zăbrele este un element de bară cu **ambele articulații la capete** bifate. Instrumentul de desenare cu mouse-ul le poate bifa în locul tău, iar ordinea în care desenezi dă numerele din tabelul de mai sus.

1. Fila **Elemente** → al doilea buton **Adaugă element**, cel cu pictograma cursorului.
2. În banda din partea de sus a zonei de desen, bifează **Articulație la început** și **Articulație la sfârșit**. Fiecare bară pe care o desenezi de acum le primește pe amândouă.
3. Talpa inferioară: dă clic în (0, 0), (4, 0), (8, 0) și (12, 0), apoi apasă <kbd>Esc</kbd>.
4. Partea de sus: dă clic din nou pe butonul **Adaugă element**, apoi pe nodul 1 în (0, 0), în (4, −3), în (8, −3) și pe nodul 4 în (12, 0). Un clic pe un nod existent se leagă de el, în loc să adauge unul nou. Apasă <kbd>Esc</kbd>.
5. Zăbrelele: încă o dată, dă clic pe nodul 2 în (4, 0), pe nodul 5 în (4, −3), pe nodul 3 în (8, 0) și pe nodul 6 în (8, −3). Apasă <kbd>Esc</kbd>, apoi <kbd>F</kbd> ca să încadrezi vederea.

Tabelul **Elemente** ar trebui să conțină acum cele nouă elemente din tabelul de mai sus, fiecare cu ambele **Articulații la capete** bifate. <kbd>Esc</kbd> părăsește modul de desenare, dar căsuțele pentru articulații din bandă rămân bifate pentru data viitoare.

### Reazeme și încărcări {#_3-supports-and-loads}

1. Dă clic pe nodul 1 → **Reazeme în nod** → simbolul **Articulație**. Dă-i nodului 4 un **Reazem simplu**.
2. Dă clic pe nodul 2 → **Adaugă încărcare** → `Fz = 30` → **Adaugă încărcare nodală**. Fă la fel în nodul 3.

Un `Fz` pozitiv este îndreptat în jos. Toate barele dintr-un nod sunt articulate, deci nimic nu împiedică rotirea nodului; EduBeam acceptă acest lucru și raportează rotirea unui astfel de nod ca 0.

::

## Rezultate {#_4-results}

În opțiunile de afișare din dreapta sus a zonei de desen (rotița le afișează și le ascunde), debifează **Deformata** și **M<sub>y</sub> (x)**, pentru că într-o grindă cu zăbrele nu există încovoiere, și bifează **N (x)**. Întinderea este pozitivă, iar EduBeam etichetează forțele în kN, cu două zecimale.

- Ambele reazeme arată `30,00` în sus; reacțiunea orizontală a articulației arată `0,00`, deoarece nu acționează nicio încărcare orizontală.
- Talpa inferioară arată `40,00` în toate cele trei bare, întindere; talpa superioară `-40,00`, compresiune.
- Diagonala din mijloc, 5–3, nu preia nimic, deci nu are etichetă, ca în figura de sus.
- Fila **Rezultate** → **Rezultate în noduri**: nodul 2 coboară cu $D_z$ = `2,2937 · 10⁻³ m`, adică 2,294 mm.

## Verificarea prin calcul manual {#_5-check-by-hand}

**Reacțiunile.** Încărcările sunt simetrice, deci $R_1 = R_4 = 30$ kN în sus, iar fără încărcare orizontală reacțiunea orizontală a articulației este zero.

**Nodul 1** (metoda izolării nodurilor). Diagonala de capăt 1–5 are lungimea de 5 m, deci $\sin\alpha = 3/5$ și $\cos\alpha = 4/5$:

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**Nodul 2.** Montantul 2–5 este singura bară care poate transmite în sus forța de 30 kN: $N_{25} = +30$ kN, iar $N_{23} = N_{12} = 40$ kN.

**Secțiune prin panoul din mijloc** (metoda secțiunilor). Secționează barele 5–6, 5–3 și 2–3 și păstrează partea din stânga:

- Momentele față de nodul 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Proiecțiile pe verticală: forța tăietoare din panou este $R_1 - 30 = 0$, deci diagonala din mijloc **5–3 nu preia nimic**: $N_{53} = 0$.

| Bare | Calcul manual | EduBeam |
| --- | --- | --- |
| Talpa inferioară 1–2, 2–3, 3–4 | +40 kN, întindere | 40,00 |
| Talpa superioară 5–6 | −40 kN, compresiune | −40,00 |
| Diagonalele de capăt 1–5, 6–4 | −50 kN | −50,00 |
| Montanții 2–5, 3–6 | +30 kN | 30,00 |
| Diagonala din mijloc 5–3 | 0 | fără etichetă |

O bară de efort nul nu este o bară inutilă: nu preia nimic sub *această* încărcare, dar dacă o elimini, grinda cu zăbrele se prăbușește, așa cum arată experimentele de mai jos.

::callout{type="details" title="Săgeata nodului 2, prin lucrul mecanic virtual"}
Aplică o forță unitară în jos în nodul 2 și rezolvă din nou manual grinda cu zăbrele: $R_1 = 2/3$, $R_4 = 1/3$ și eforturile din bare $n$ de mai jos. Săgeata este $\delta = \sum N\,n\,L / (EA)$:

| Bară | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
| --- | --- | --- | --- | --- |
| 1–2 | 40 | 8/9 | 4 | 142,2 |
| 2–3 | 40 | 8/9 | 4 | 142,2 |
| 3–4 | 40 | 4/9 | 4 | 71,1 |
| 1–5 | −50 | −10/9 | 5 | 277,8 |
| 5–6 | −40 | −4/9 | 4 | 71,1 |
| 6–4 | −50 | −5/9 | 5 | 138,9 |
| 2–5 | 30 | 1 | 3 | 90,0 |
| 5–3 | 0 | −5/9 | 5 | 0 |
| 3–6 | 30 | 1/3 | 3 | 30,0 |
| | | | suma | 963,3 |

$$
\delta_2 = \frac{963{,}3}{EA} = \frac{963{,}3}{210 \times 10^6 \cdot 0{,}002} = 0{,}002294\ \text{m}
$$

Aceștia sunt 2,294 mm, la fel ca $D_z$ al nodului 2 din EduBeam, `2,2937 · 10⁻³` m.
::

## Experimentează {#_6-experiment}

Modifică pe rând câte un singur lucru, anticipează rezultatul, apoi verifică-l. <kbd>Ctrl</kbd>+<kbd>Z</kbd> anulează fiecare modificare.

**Mută o forță.** Pune ambele forțe în nodul 2: șterge forța din nodul 3 și schimbă-o pe cealaltă în `Fz = 60`. Acum $R_1 = 40$ kN, forța tăietoare din panoul din mijloc este $40 - 60 = -20$ kN, iar diagonala din mijloc trebuie s-o preia: $N_{53} = -20 \cdot 5/3 = -33{,}33$ kN, compresiune.

::model-figure{caption="60 kN în nodul 2: diagonala din mijloc 5–3 preia acum forța tăietoare din panou"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 60 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

**Elimină diagonala din mijloc.** Șterge elementul 8. Panoul din mijloc devine un dreptunghi articulat care se poate deforma lateral. EduBeam nu afișează rezultate, raportează *Articulațiile din nodurile 2, 3, 5, 6 permit mișcarea structurii.*, adică cele patru colțuri ale panoului, și animă mișcarea.

**Debifează toate articulațiile** în tabelul **Elemente**. Grinda cu zăbrele devine un cadru cu noduri rigide. Bifează **M<sub>y</sub> (x)**: momentele încovoietoare rămân sub 0,1 kNm, iar forțele axiale se schimbă cu mai puțin de 0,1 %. De aceea idealizarea cu noduri articulate funcționează pentru o grindă cu zăbrele triangulată.

**Articulează ambele reazeme.** O a patra reacțiune face ca grinda cu zăbrele să fie o dată static nedeterminată, iar rezultatul te poate surprinde: talpa inferioară nu mai preia **nimic**, iar în schimb fiecare reazem împinge spre interior cu 40 kN. Nodurile 1 și 4 nu se pot depărta, deci cele trei bare coliniare ale tălpii dintre ele trebuie să aibă o lungire totală nulă. Toate preiau aceeași forță, deci această forță este zero, iar cei 40 kN ai ei trec în reazeme. Acest lucru este valabil oricare ar fi ariile barelor.

::model-figure{caption="Ambele reazeme articulate: reazemele preiau rolul tălpii inferioare"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: pin }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Pașii următori {#next-steps}

Teoria elementului de bară articulată se găsește în [Elementul de bară articulată](/ro/elements/truss).

::card-grid{cols="2"}
:::card{title="Exersează: grinzi cu zăbrele Warren" icon="lucide:dices" to="/ro/practice?p=T2048"}
Reacțiunile și efortul dintr-o bară a unei grinzi cu zăbrele mai mari, cu răspunsurile verificate imediat. Începe cu T2048; pentru mai multe, lasă selectată doar **Grindă cu zăbrele Warren** și apasă **Problemă nouă**.
:::
:::card{title="Următorul: grindă continuă și cedare de reazem" icon="lucide:spline" to="/ro/tutorials/continuous-beam"}
O grindă static nedeterminată: ce aduce continuitatea, ce îi face o cedare de reazem și metoda eforturilor pentru a le verifica pe amândouă.
:::
::
