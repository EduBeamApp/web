---
description: "Tutorial: o grindă continuă cu două deschideri în EduBeam, comparată cu două grinzi simplu rezemate, cu cedare de reazem, verificată prin metoda eforturilor. Aproximativ 25 de minute."
source: site
---

# Tutorial: grindă continuă și cedare de reazem

Modelează o grindă continuă peste două deschideri, compar-o cu două grinzi simplu rezemate, apoi lasă reazemul din mijloc să cedeze cu 10 mm. Reacțiunile acestei grinzi nu rezultă doar din echilibru, așa că le vei verifica prin metoda eforturilor.

- **Timp:** aproximativ 25 de minute. Este ultimul și cel mai bogat dintre cele patru tutoriale.
- **Ai nevoie de:** EduBeam deschis într-o a doua filă, pe un calculator cu mouse și tastatură. Dacă n-ai mai folosit EduBeam, parcurge mai întâi [Ghidul de început](/ro/guide/quick-start) sau unul dintre tutorialele anterioare.
- **Cunoștințe necesare:** metoda eforturilor pentru o structură o dată static nedeterminată și săgețile la mijlocul deschiderii ale unei grinzi simplu rezemate, $5qL^4/(384EI)$ sub o încărcare uniform distribuită și $FL^3/(48EI)$ sub o forță concentrată.
- **Unități:** SI. Butonul unităților din colțul din dreapta jos al zonei de desen trebuie să arate `m m² kN kNm MPa`. Dacă arată picioare și kipi, dă clic pe el și setează **Sistem de unități** la **SI (metric)**.

**Vei învăța să**

- vezi ce aduce continuitatea: momente și săgeți mai mici decât la grinzile simplu rezemate,
- impui o cedare de reazem și citești eforturile pe care le produce singură,
- verifici o grindă static nedeterminată prin metoda eforturilor și înțelegi de ce o grindă mai rigidă suferă mai mult de pe urma unei cedări de reazem.

::div{.actions}
[Deschide EduBeam ↗](https://run.edubeam.app/?lang=ro){target="_blank"} [Sari la verificarea manuală](#check-by-hand)
::

::model-figure{caption="Grinda terminată: două deschideri de 6 m încărcate cu 10 kN/m, înainte de cedarea reazemului"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels, dimensions]
---
::

## Problema {#the-problem}

- Două deschideri de $L = 6$ m: o articulație în nodul 1, reazeme simple în nodurile 2 și 3.
- O încărcare uniform distribuită $q = 10$ kN/m pe ambele deschideri.
- Oțel, $E = 210$ GPa, și $I_y = 8{,}356 \times 10^{-5}$ m⁴ (un IPE 300), deci $EI = 17\,547{,}6$ kNm².
- În a doua parte, reazemul din mijloc, nodul 2, cedează cu $\Delta = 10$ mm.

**Este static determinată?** Patru reacțiuni (două în nodul 1 și câte una în nodurile 2 și 3) față de trei ecuații de echilibru: grinda este o dată static nedeterminată. Ecuația care lipsește rezultă din deformații: nodul 2 nu se deplasează sau se deplasează exact cu $\Delta$.

## Modelează {#model-it}

::div{.steps}

### Material și secțiune {#material-and-section}

1. Dă clic pe **Golește modelul** în bara aplicației, bifează **Șterge materialele** și **Șterge secțiunile** și dă clic pe **Confirmă**. Nodurile și elementele se numerotează din nou de la 1.
2. Fila **Materiale** → **Bibliotecă de materiale** → **+** pe rândul **Oțel (S235)**, apoi **Renunță** ca să închizi biblioteca.
3. Fila **Secțiuni** → **Adaugă secțiune**. Introdu `8,356e-5` la **Iy**, păstrează **Arie**, **Înălțime** și **Coeficient de forfecare** la `1` și dă clic pe **Adaugă secțiune**.

O arie de 1 m² împiedică grinda să se deformeze vizibil din forfecare, așa cum presupune calculul manual. De data aceasta $I_y$ contează și pentru eforturi: vei vedea unde.

### Desenează grinda {#draw-the-beam}

1. Fila **Elemente** → al doilea buton **Adaugă element**, cel cu pictograma cursorului.
2. Dă clic în (0, 0), (6, 0) și (12, 0).
3. Apasă <kbd>Esc</kbd> ca să oprești desenarea, apoi <kbd>F</kbd> ca să încadrezi vederea.

Trei noduri și două elemente. Verifică coordonatele în tabelul **Noduri**.

### Reazeme {#supports}

Dă clic pe nodul 1 → **Reazeme în nod** → simbolul **Articulație**. Dă-le nodurilor 2 și 3 câte un **Reazem simplu**.

### Încărcare {#load}

Fila **Încărcări** → **Adaugă încărcare pe element** → *Încărcare uniform distribuită* pe **Element** `1`, `fz = 10` → **Adaugă încărcare pe element**. Repetă pentru elementul 2.

::

## Rezultate {#results}

Momentul încovoietor, reacțiunile și deformata sunt pornite de la început. Bifează **V<sub>z</sub> (x)** în opțiunile de afișare din dreapta sus a zonei de desen (rotița le afișează și le ascunde) pentru forța tăietoare. EduBeam etichetează diagramele și reacțiunile în kN și kNm, cu două zecimale.

- Reacțiunile arată `22,50` în nodurile 1 și 3 și `75,00` în nodul 2: reazemul din mijloc preia mai mult de jumătate din cei 120 kN.
- Momentul din nodul 2 arată `-45,00`, negativ. Momentul pozitiv din deschideri este de cel mult `25,31` kNm, la 2,25 m de reazemele marginale.
- Forța tăietoare face un salt de la `-37,50` la `37,50` în dreptul nodului 2.

### Comparația cu două grinzi simplu rezemate {#compare-with-two-simple-spans}

Ce aduce continuitatea? Întrerupe-o: în tabelul **Elemente**, bifează articulația de la **sfârșitul** elementului 1, în nodul 2. Grinda devine două grinzi simplu rezemate de câte 6 m, o structură static determinată.

::model-figure{caption="Cu o articulație deasupra nodului 2: două grinzi simplu rezemate, fiecare cu qL²/8 = 45 kNm"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [{ nodes: [1, 2], hinges: [false, true] }, [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

| | Grindă continuă | Două grinzi simplu rezemate |
| --- | --- | --- |
| Reacțiunile în nodurile 1, 2, 3 | 22,5; 75; 22,5 kN | 30; 60; 30 kN |
| Momentul din nodul 2 | −45 kNm | 0 |
| Momentul pozitiv maxim | 25,31 kNm | 45 kNm |
| Săgeata maximă, în diagrama $w(x)$ din figuri | 4,000 mm | 9,617 mm |

Momentul maxim are aceeași valoare de 45 kNm, dar la grinda continuă se mută pe reazem, iar deschiderile se încovoaie mult mai puțin. Fiecare deschidere este și de 2,4 ori mai rigidă: capătul ei din nodul 2 nu se poate roti, aproape ca și cum ar fi încastrat. Debifează din nou articulația înainte să continui.

## Cedarea reazemului din mijloc {#settle-the-middle-support}

Acum lasă nodul 2 să coboare cu 10 mm, cum s-ar putea întâmpla cu o fundație pe un teren moale.

::div{.steps}

### Impune cedarea de reazem {#prescribe-the-settlement}

Dă clic pe nodul 2 → **Impune o deplasare**. În fereastra de dialog, **Deplasare impusă** este deja aleasă; introdu `0,01` la **Dz** și dă clic pe **Adaugă încărcare nodală**.

![Fereastra pentru o deplasare impusă: se poate seta doar Dz, direcția pe care o blochează reazemul simplu](/screenshots/ro/p2t-prescribe-displacement.webp){.shot-sm}

În unitățile SI implicite deplasările sunt în metri, deci 10 mm înseamnă `0,01`; sensul pozitiv este în jos. Se pot seta doar direcțiile blocate: un reazem simplu poate fi deplasat în jos, dar nu lateral. Mai multe în [Deplasări impuse](/ro/essentials/loads#prescribed-displacements-support-settlements).

### Citește noile rezultate {#read-the-new-results}

Reacțiunea din mijloc scade la `70,13` kN, iar reacțiunile marginale cresc la `24,94` kN. Momentul din nodul 2 scade la `-30,38` kNm, iar momentele pozitive din deschideri cresc, până la `31,09` kNm.

::model-figure{caption="Nodul 2 a cedat cu 10 mm: momentul negativ de deasupra lui scade, iar deschiderile preiau mai mult"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

### Efectul cedării singure {#look-at-the-settlement-alone}

Șterge cele două încărcări pe element: selecteaz-o pe fiecare și apasă <kbd>Delete</kbd> sau folosește × din rândul ei în tabelul **Încărcări**. Ce rămâne este efectul cedării de reazem singure: o diagramă de moment triunghiulară, cu `14,62` kNm pozitiv în nodul 2, și reacțiuni care trag nodul 2 **în jos** cu `4,87` kN, în timp ce nodurile 1 și 3 împing în sus cu câte `2,44` kN. Grinda se opune încovoierii impuse de cedare și numai această rezistență o solicită.

::model-figure{caption="Doar cedarea de reazem: nicio încărcare, și totuși grinda este încovoiată, iar reazemele reacționează"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, w]
show: [nodeLabels]
---
::

Adună aceste rezultate la cele produse de încărcare și obții grinda cu cedare de reazem sub încărcare: 75 − 4,87 = 70,13 kN, −45 + 14,62 = −30,38 kNm. Calculul este liniar, deci efectele se suprapun.

### Întrerupe din nou continuitatea {#cut-the-continuity-again}

Readu încărcările cu <kbd>Ctrl</kbd>+<kbd>Z</kbd>, o dată pentru fiecare încărcare ștearsă, și bifează din nou articulația de la sfârșitul elementului 1. Acum deschiderile doar se înclină odată cu reazemul cedat: reacțiunile și momentele sunt exact cele ale celor două grinzi simplu rezemate, oricât de mare ar fi cedarea, iar fără încărcări ar fi zero. **O cedare de reazem produce eforturi doar într-o structură static nedeterminată.** Debifează articulația înainte să continui.

::

## Verificarea prin calcul manual {#check-by-hand}

Folosește metoda eforturilor. Elimină reazemul din nodul 2 și înlocuiește-l cu reacțiunea lui necunoscută $R_2$, care acționează în sus asupra unei grinzi simplu rezemate cu deschiderea $2L = 12$ m.

**Săgețile grinzii eliberate în nodul 2.** Sub încărcare și sub o forță unitară în sus în nodul 2:

$$
\delta_q = \frac{5q\,(2L)^4}{384\,EI} = \frac{5 \cdot 10 \cdot 12^4}{384 \cdot 17\,547{,}6} = 0{,}15387\ \text{m}
$$

$$
\delta_{1} = \frac{(2L)^3}{48\,EI} = \frac{12^3}{48 \cdot 17\,547{,}6} = 0{,}0020516\ \text{m/kN}
$$

**Compatibilitatea.** $R_2$ trebuie să împingă nodul 2 înapoi în sus până ajunge acolo unde este reazemul: la zero sau cu $\Delta$ mai jos.

$$
R_2\,\delta_1 = \delta_q - \Delta \quad\Rightarrow\quad R_2 = \frac{\delta_q - \Delta}{\delta_1}
$$

**Restul** rezultă din echilibru; momentul pozitiv maxim se află acolo unde forța tăietoare $R_1 - qx$ este zero.

| | Formulă | Fără cedare | Nodul 2 cedat cu 10 mm |
| --- | --- | --- | --- |
| $R_2$ | $(\delta_q - \Delta)/\delta_1$ | 75,00 kN | 70,13 kN |
| $R_1 = R_3$ | $(2qL - R_2)/2$ | 22,50 kN | 24,94 kN |
| $M_2$ | $R_1 L - qL^2/2$ | −45,00 kNm | −30,38 kNm |
| $M_{\max}$ | $R_1^2/(2q)$ | 25,31 kNm | 31,09 kNm |

EduBeam arată aceleași valori, până la ultima cifră.

Fără cedare de reazem, acestea sunt valorile din manual $R_2 = 10qL/8$, $M_2 = -qL^2/8$ și $M_{\max} = 9qL^2/128$. Cedarea singură modifică reacțiunile cu $\Delta/\delta_1 = 4{,}874$ kN, iar momentul din nodul 2 cu

$$
\Delta M_2 = \frac{\Delta}{\delta_1} \cdot \frac{2L}{4} = \frac{3\,EI\,\Delta}{L^2} = \frac{3 \cdot 17\,547{,}6 \cdot 0{,}01}{36} = 14{,}62\ \text{kNm}
$$

Observă $EI$ din formulă. Eforturile produse de o încărcare depind doar de rigiditățile barelor *una față de alta*; eforturile produse de o deplasare impusă cresc odată cu rigiditatea însăși. Deasupra unui reazem care cedează, o grindă mai rigidă atrage momente mai mari.

## Experimentează {#experiment}

Pornește de la grinda încărcată, cu reazemul cedat, modifică pe rând câte un singur lucru, anticipează rezultatul, apoi verifică-l. <kbd>Ctrl</kbd>+<kbd>Z</kbd> anulează fiecare modificare.

**Dublează rigiditatea.** În tabelul **Secțiuni**, setează **Iy** la `1,6712e-4`. Efectul cedării asupra momentului din nodul 2 se dublează, la 29,25 kNm, iar $M_2$ scade la −15,75 kNm. Doar sub încărcare nu s-ar schimba nimic în afară de săgeți, care s-ar înjumătăți.

**Găsește cedarea care eliberează nodul 2.** Pentru ce $\Delta$ este zero momentul din nodul 2? $\Delta M_2 = 45$ kNm cere $\Delta = 45 L^2/(3EI) = qL^4/(24EI) = 0{,}0308$ m. Schimbă cedarea la `0,0308`, în tabelul **Încărcări** sau cu dublu clic pe ea pe desen: reacțiunile devin 30, 60 și 30 kN, cele ale celor două grinzi simplu rezemate, cu abaterea dată de rotunjirea lui $\Delta$. $qL^4/(24EI)$ este rotirea pe reazem a unei grinzi simplu rezemate înmulțită cu $L$: cedarea înclină fiecare deschidere exact cât trebuie ca să închidă frântura de deasupra nodului 2, așa că continuitatea nu mai are nimic de făcut.

**Lasă nodul 2 liber.** Schimbă cedarea la `0,1539`, săgeata $\delta_q$ a grinzii eliberate de 12 m. Reacțiunea din nodul 2 scade practic la zero, iar grinda preia încărcarea ca o singură grindă simplu rezemată: 180 kNm la mijlocul deschiderii. Un reazem care cedează atât de mult nu mai este un reazem.

**Ridică nodul 2.** Schimbă cedarea la `-0,01`, adică 10 mm în sus. Fiecare modificare produsă de cedare își schimbă semnul: nodul 2 preia acum 79,87 kN, iar momentul negativ crește la −59,62 kNm.

Mai multe verificări cu soluție exactă, inclusiv cedarea de reazem a unei grinzi încastrate și simplu rezemate, găsești în [Verificarea rezultatelor prin calcul manual](/ro/guide/verification#prescribed-displacement).

## Pașii următori {#next-steps}

::card-grid{cols="2"}
:::card{title="Exersează: grinzi continue" icon="lucide:dices" to="/ro/practice?p=K2049"}
Grinzi cu două deschideri, încărcate pe o deschidere sau pe ambele, rezolvate prin metoda eforturilor, cu răspunsurile verificate imediat. Începe cu K2049; pentru mai multe, selectează doar **Grindă continuă cu două deschideri** și apasă **Problemă nouă**.
:::
:::card{title="Galeria de exemple" icon="lucide:library" to="/ro/examples/"}
Acesta a fost ultimul tutorial. Galeria de exemple are și alte modele de deschis, modificat și verificat, precum și exerciții de dat studenților.
:::
::
