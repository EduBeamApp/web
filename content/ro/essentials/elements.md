---
description: "Desenarea elementelor de bară în EduBeam, articulații la capete pentru noduri articulate și bare de grinzi cu zăbrele, materiale și secțiuni din bibliotecă sau definite printr-un poligon."
source: site
---

# Elemente, materiale și secțiuni

Fiecare element din [EduBeam]{.edubeam} este o bară între două noduri, cu un material și o secțiune transversală. Desenezi elemente între noduri, le eliberezi capetele cu articulații acolo unde structura are articulații și alegi materialele și secțiunile din bibliotecă sau le definești singur.

## Elementul de bară {#the-beam-element}

Există un singur tip de element: o **bară Timoshenko 2D** în planul x–z, cu trei grade de libertate la fiecare capăt (`Dx`, `Dz`, `Ry`). Preia forță axială, forță tăietoare și moment încovoietor și ține seama de [deformația din forfecare](#shear-deformation). O bară de grindă cu zăbrele este același element, cu [ambele capete articulate](#end-hinges). Formularea se găsește în [partea de teorie](/ro/elements/beam).

Rezultatele în lungul unui element sunt exacte pentru modelul liniar, deci **un singur element pe bară este suficient**. Adaugă un nod în interiorul unei bare doar acolo unde ai nevoie de un reazem, de o articulație, de o schimbare de secțiune sau de un punct în care vrei să citești deplasările. O forță concentrată nu are nevoie de nod: o [forță concentrată](/ro/essentials/loads#concentrated-load) poate sta oriunde pe element.

## Adăugarea elementelor {#adding-elements}

Un element are nevoie de un material și de o secțiune, așa că adaugă-le mai întâi pe acestea (vezi [Materiale](#materials) și [Secțiuni transversale](#cross-sections)). Cât timp nu există, zona de desen afișează *Nu există materiale definite.* sau *Nu există secțiuni definite.*, cu un buton **Adaugă**.

- **Prin alegerea nodurilor.** Fila *Elemente* → **Adaugă element** (butonul cu pictograma **+**) sau clic dreapta pe desen → *Adaugă element*. Alege **Nodul inițial** și **Nodul final**, bifează la nevoie **Articulație** sub oricare dintre ele și alege **Materialul** și **Secțiunea transversală**. Pentru asta trebuie să existe cel puțin două noduri.
- **Cu clicuri.** Fila *Elemente* → **Adaugă element** (butonul cu pictograma cursorului) sau ține apăsat <kbd>Ctrl</kbd> când alegi *Adaugă element* din meniul desenului. Dă clic pe un nod (sau pe o zonă goală, unde se creează unul), apoi pe următorul; continuă cu clicuri ca să desenezi un șir de elemente și apasă <kbd>Esc</kbd> sau **Renunță** ca să termini. Bara de sus stabilește **Articulație la început** și **Articulație la sfârșit** pentru fiecare element desenat. Elementele primesc primul material și prima secțiune din model.

![Fereastra Adaugă element](/screenshots/ro/qs-element.webp){.shot-md}

## Orientarea elementului {#element-direction}

Fiecare element are propriile **axe locale**. Axa locală x merge de la **nodul inițial** la **nodul final**; axa locală z este axa locală x rotită cu 90° în sens orar pe ecran. La un element desenat de la stânga la dreapta, axele locale coincid cu cele globale. **Linia punctată** desenată de-a lungul fiecărui element marchează partea +z locală, „fibra inferioară”.

![Un cadru portal desenat A → B → C → D: liniile punctate ale tuturor celor trei elemente cad în interiorul cadrului](/screenshots/ro/p2b-element-direction.webp){.shot-md}

În acest cadru, elementul 1 urcă de la A la B, deci axa lui locală z, și odată cu ea linia punctată, este orientată spre dreapta; elementul 3 coboară de la C la D, deci linia lui punctată este în stânga. Desenat astfel, un cadru portal are toate liniile punctate în interior.

Orientarea contează pentru:

- încărcările date în axe locale (cu **LCS** bifat), vezi [Încărcări pe element](/ro/essentials/loads#element-loads);
- **Poziția încărcării față de nodul inițial** la o forță concentrată;
- ordinea [forțelor de la capete](/ro/elements/conventions#end-forces-element-results-table) în rezultate: `X12, Z12, M12` în nodul inițial, `X21, Z21, M21` în nodul final;
- partea considerată „partea punctată” în [setările diagramelor](/ro/essentials/units-settings#viewer-settings).

Ca să inversezi un element, apasă **Inversează nodurile** (săgețile dintre cele două noduri în tabelul *Elemente*).

## Articulații la capete {#end-hinges}

O articulație la capăt eliberează momentul încovoietor la un capăt al elementului: acolo momentul este zero, iar capătul se poate roti independent de nod.

- **O articulație** introduce o articulație în interiorul unei grinzi sau al unui cadru.
- **Două articulații** fac din element o **bară de grindă cu zăbrele**, care preia doar forță axială.

Le bifezi în oricare dintre aceste locuri:

- coloana **Articulații la capete** din tabelul *Elemente*, câte o casetă pentru fiecare capăt;
- casetele **Articulație** din fereastra **Adaugă element** sau din panoul elementului → **Editează elementul**;
- **Articulație la început** și **Articulație la sfârșit** în bara de sus, când desenezi cu mouse-ul.

![Tabelul Elemente al unui cadru cu trei articulații: elementul 2 are o articulație la capăt, în nodul C](/screenshots/ro/elements-table.webp)

### O articulație: articulație în interiorul structurii {#one-hinge-a-pin-inside-the-structure}

Aceeași grindă continuă cu două deschideri de 5 m, încărcată cu 10 kN/m. În dreapta, elementul 1 are o articulație la capăt în B: momentul de pe reazem scade la zero, iar fiecare deschidere își preia încărcarea ca o grindă simplu rezemată.

::div{.shots}

:::model-figure{caption="Grindă continuă: M = −31,25 kNm pe reazemul B"}
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

:::model-figure{caption="Articulație în B: M = 0 pe reazemul B, 31,25 kNm în fiecare deschidere"}
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

Calcul manual: la grinda continuă, $M_B = -qL^2/8 = -31{,}25\ \text{kNm}$ și cel mult $9qL^2/128 = 17{,}58\ \text{kNm}$ în fiecare deschidere; cu articulație, $M_B = 0$ și $M_{max} = qL^2/8 = 31{,}25\ \text{kNm}$ la mijlocul fiecărei deschideri. Articulația descarcă reazemul, dar aproape dublează momentele din deschideri. Pentru o grindă cu articulație interioară de rezolvat de mână, cu răspunsurile verificate pe măsură ce le introduci, încearcă [problema G2048](/ro/practice?p=G2048).

### Două articulații: bară de grindă cu zăbrele {#both-hinges-a-truss-bar}

Un suport de perete din două bare, ambele articulate la ambele capete, încărcat cu 20 kN în B. Barele preiau doar forță axială, iar diagrama de momente este goală.

::model-figure{caption="Tirantul AB: N = +26,67 kN (întindere); contrafișa CB: N = −33,33 kN (compresiune)"}
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

Calcul manual: contrafișa are 5 m lungime și urcă 3 m, deci $N_{CB} = -20 \cdot 5/3 = -33{,}33\ \text{kN}$, iar tirantul echilibrează componenta ei orizontală, $N_{AB} = 33{,}33 \cdot 4/5 = 26{,}67\ \text{kN}$. [Tutorialul despre grinzi cu zăbrele](/ro/tutorials/truss) construiește astfel o grindă cu zăbrele întreagă, iar la [Probleme de statică](/ro/practice?p=T2048) găsești grinzi cu zăbrele de rezolvat de mână.

### Articulează elementul, nu nodul {#hinge-the-element-not-the-node}

O articulație aparține unui capăt al unui singur element: ea lasă acel capăt să se rotească independent, în timp ce toate celelalte elemente din nod rămân legate rigid de el. Așadar, unde se întâlnesc două bare, o singură articulație creează un nod articulat; unde se întâlnesc mai multe, articulează-le pe toate în afară de una. Un nod de grindă cu zăbrele, în care fiecare bară este articulată la capete, are toate barele articulate.

Un nod în care toate elementele sunt articulate nu are rigiditate la rotire. EduBeam îl acceptă și îi raportează rotirea ca 0. Dacă articulațiile transformă structura într-un mecanism, EduBeam le încercuiește și arată cum se mișcă; vezi [Depanare](/ro/reference/troubleshooting#messages).

## Editare și ștergere {#editing-and-deleting}

| Ca să | Fă așa |
| --- | --- |
| Schimbi nodurile, articulațiile, materialul sau secțiunea | Dă clic pe element → **Editează elementul** sau editează-l în tabelul *Elemente*. |
| Îl inversezi | **Inversează nodurile** în tabelul *Elemente*. |
| Îl redenumești | Scrie o etichetă nouă în coloana *Element*. |
| Îi vezi matricea de rigiditate | Dă clic pe el → **Matrice de rigiditate** sau butonul matricei din coloana *Acțiuni*. O fereastră arată matricea 6 × 6 a elementului în axe globale, în unități SI (N și m) indiferent de unitățile afișate, cu articulațiile de la capete deja condensate. Utilă pentru verificarea unei asamblări făcute de mână. |
| Îl ștergi | Dă clic pe el → **Șterge**, × din tabel sau selectează-l și apasă <kbd>Delete</kbd>. Încărcările lui dispar odată cu el. |

![Panoul unui element](/screenshots/ro/ui-element-menu.webp){.shot-xs}

## Materiale {#materials}

Fila *Materiale* → **Adaugă material** sau **Bibliotecă de materiale** pentru un material gata definit. Mai multe elemente pot avea același material; dacă îl modifici, se actualizează toate.

| Câmp | Unitate | Ce face |
| --- | --- | --- |
| Modulul de elasticitate longitudinal (Young) $E$ | MPa | Rigiditatea axială și la încovoiere, $EA$ și $EI_y$. Oțel 210 000 MPa, beton circa 30 000 MPa, lemn circa 11 000 MPa. |
| Modulul de elasticitate transversal $G$ | MPa | Rigiditatea la forfecare $kGA$. Dacă $k$ al secțiunii nu este uriaș, introduce [deformația din forfecare](#shear-deformation): săgeți mai mari și, la o structură static nedeterminată, alte eforturi. $G = E/(2(1+\nu))$: oțel circa 81 000 MPa. |
| Densitatea $\rho$ | kg/m³ | Se păstrează la material, dar nu se folosește: nu există încărcare din greutate proprie. |
| Coeficientul de dilatare termică $\alpha$ | 1/K | Folosit de [variațiile de temperatură](/ro/essentials/loads#temperature-load). Oțel $12 \times 10^{-6}$ 1/K. |

Unitățile sunt cele SI implicite; ele urmează [setările](/ro/essentials/units-settings#units), deci în unități americane E și G sunt în ksi, densitatea în lb/ft³, iar α în 1/°F.

Un material nou pornește cu $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2{,}4$, adică $\nu = 0{,}2$), $\rho$ = 1000 kg/m³ și $\alpha = 12 \times 10^{-6}$ 1/K; în unități americane pornește ca oțel ASTM A992. Pentru oțel, schimbă $G$ la 81 000 MPa sau alege un oțel din bibliotecă.

![Fereastra Adaugă material](/screenshots/ro/qs-material.webp){.shot-md}

**Biblioteca de materiale** (și *Sau alege din bibliotecă* din fereastra Adaugă material) afișează mai întâi materialele metrice (EN) sau, dacă lungimile tale sunt în picioare ori inci, mai întâi pe cele americane (oțeluri ASTM, beton ACI). Butonul **+** de pe un rând adaugă materialul respectiv, cu numele lui:

| Familie | Materiale |
| --- | --- |
| Metale | Oțel S235, S275, S355; oțel inoxidabil 304, 316; fontă; aluminiu 6061-T6, 7075-T6, 5083; cupru, alamă, bronz; titan Grade 2 și Ti-6Al-4V; oțeluri americane ASTM A992, A36, A572 Gr. 50 și HSS A500 Gr. C |
| Beton | C25/30, C30/37, C40/50, beton ușor; american $f'_c$ = 4 ksi și 5 ksi |
| Lemn | C24, GL24h, GL32h |
| Altele | Sticlă, GFRP, CFRP, HDPE, PVC, PMMA, policarbonat |

Un material folosit încă de elemente nu poate fi șters: atribuie mai întâi acelor elemente alt material.

## Secțiuni transversale {#cross-sections}

Fila *Secțiuni* → **Adaugă secțiune**, **Bibliotecă de secțiuni** sau **Secțiune poligonală**, ca să desenezi propria formă. La fel ca materialele, o secțiune poate fi folosită de mai multe elemente.

| Câmp | Unitate | Ce face |
| --- | --- | --- |
| Aria $A$ | m² | Rigiditatea axială $EA$ și aria de forfecare $kA$. |
| Momentul de inerție $I_y$ | m⁴ | Rigiditatea la încovoiere $EI_y$, față de axa perpendiculară pe planul desenului. |
| Înălțimea $h$ | m | Folosită doar de variațiile de temperatură: curbura este $\alpha\,(\Delta T_b - \Delta T_t)/h$. |
| Coeficientul de forfecare $k$ | – | Aria efectivă de forfecare este $kA$, deci rigiditatea la forfecare este $kGA$. Circa 0,83 pentru un dreptunghi, $A_{web}/A$ pentru un profil I. |

O secțiune nouă pornește cu $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m și $k$ = 1 (în unități americane, un W12×26 cu $k$ = 1). Înlocuiește-le cu valorile secțiunii tale sau alege una din bibliotecă.

::callout{type="tip" title="Rezultate ca în manualele care neglijează deformația din forfecare"}
Majoritatea calculelor de mână folosesc bara Euler–Bernoulli, fără deformație din forfecare. Ca să obții aceleași rezultate, dă-i lui $k$ o valoare foarte mare, de exemplu `1e10`; exemplele din aplicație și figurile de pe acest site folosesc `1e32`. O secțiune nouă ($k = 1$), biblioteca și editorul de poligoane includ toate deformația din forfecare; [mai jos](#shear-deformation) vezi cât de mult schimbă ea rezultatele.
::

**Biblioteca de secțiuni** oferă valori aproximative pentru:

| Familie | Secțiuni | $k$ |
| --- | --- | --- |
| Pline | Dreptunghiuri, pătrate, cercuri | 0,833 (dreptunghi), 0,9 (cerc) |
| Profile I | IPE 100, IPE 200, HEA 100, HEA 200; profile AISC W de la W8×31 la W36×150 | $h\,t_w/A$, inima |
| Țevi rectangulare | RHS 100×50×3, 150×100×5; AISC HSS | $2ht/A$, ambele inimi |
| Țevi rotunde | CHS Ø60×3, Ø114×5; AISC HSS rotunde | 0,5 |

Verifică valorile din bibliotecă într-un tabel de profile înainte să te bazezi pe ele.

![Biblioteca de secțiuni](/screenshots/ro/sections-library.webp){.shot-lg}

Pentru o verificare rapidă de mână: un dreptunghi $b \times h$ are $A = bh$ și $I_y = bh^3/12$; un cerc plin cu diametrul $d$ are $A = \pi d^2/4$ și $I_y = \pi d^4/64$.

### Deformația din forfecare: când contează G și k {#shear-deformation}

Rigiditatea la forfecare $kGA$ intră în element prin [parametrul de forfecare](/ro/elements/beam#timoshenko-or-euler-bernoulli) $\Phi = 12EI_y/(kGAL^2)$. Cu un $k$ foarte mare, $\Phi = 0$, iar elementul este o bară Euler–Bernoulli, deci $G$ nu are niciun efect. Cu un $k$ real, deformația din forfecare mărește întotdeauna deplasările. La o structură static determinată eforturile rămân aceleași; la una static nedeterminată se schimbă și ele, pentru că necunoscutele static nedeterminate depind de rigidități.

Cât de mult contează depinde de cât de scurtă și de groasă este bara. Un IPE 200 din bibliotecă ($k = h\,t_w/A = 0{,}393$) din oțel S235 ($G$ = 81 000 MPa), încărcat cu 10 kN/m, comparat cu aceeași grindă cu $k$ = `1e32`:

| Grindă | Cu deformația din forfecare | Euler–Bernoulli |
| --- | --- | --- |
| Simplu rezemată, $L$ = 2 m ($L/h$ = 10): săgeata la mijlocul deschiderii | 0,566 mm | 0,511 mm |
| Încastrată și simplu rezemată, $L$ = 2 m: momentul din încastrare | −4,84 kNm | −5,00 kNm |
| Simplu rezemată, $L$ = 6 m ($L/h$ = 30): săgeata la mijlocul deschiderii | 41,85 mm | 41,36 mm |

Calcul manual: partea din forfecare a săgeții de la mijlocul deschiderii este $qL^2/(8kGA)$, adică 0,055 mm la grinda scurtă, cu 11 % peste partea din încovoiere $5qL^4/(384EI_y)$. La grinda încastrată și simplu rezemată, momentul din încastrare scade de la $qL^2/8$ la $(qL^2/8)/(1 + \Phi/4)$. La $L/h$ = 30 ambele efecte sunt de circa 1 % sau mai puțin, de aceea cadrele zvelte și răspunsurile din manuale coincid indiferent de $k$.

### Secțiuni poligonale {#polygonal-sections}

Fila *Secțiuni* → **Secțiune poligonală** sau *Sau definește o formă poligonală* din fereastra Adaugă secțiune deschide un editor de forme care îți calculează caracteristicile secțiunii.

![Editorul de secțiuni poligonale cu forma predefinită Profil I, axele principale și elipsa de inerție](/screenshots/ro/sections-polygon.webp)

::div{.steps}

### Pornește de la o formă predefinită {#start-from-a-preset}

Alege o **Formă predefinită** (dreptunghi, profil I, profil T, cornier L, profil U, țeavă rectangulară, cerc, țeavă rotundă), stabilește-i dimensiunile și apasă **Aplică**.

### Ajustează forma {#adjust-the-shape}

Trage vârfurile (se aliniază la **Pasul de aliniere la grilă**), dă clic pe mijlocul unei laturi ca să inserezi un vârf sau dă dublu clic pe un vârf ca să-l elimini. Poți introduce coordonatele și în tabelul **Vârfuri**. **Adaugă gol** adaugă un contur interior, iar **Centrează în centrul de greutate** mută forma astfel încât centrul ei de greutate să fie în origine.

### Citește caracteristicile {#read-the-properties}

Fila **Caracteristicile secțiunii** arată $A$, centrul de greutate, $I_y$, $I_z$, $I_{yz}$ față de centrul de greutate, momentele de inerție principale $I_1$, $I_2$ cu **Unghiul axelor principale** $\alpha$ (de la $y$ la axa 1) și razele de girație. Desenul arată axele principale și elipsa de inerție.

### Adaug-o {#add-it}

Verifică câmpurile **Etichetă** și **Coeficient de forfecare** $k$: pornește de la 0,833, valoarea corectă pentru un dreptunghi; un profil I are nevoie de circa $A_{web}/A$. Apoi apasă **Adaugă secțiune** (**Salvează** când editezi o formă existentă). $A$, $I_y$ și $h$ provin din formă și nu pot fi editate în tabel; ca să le schimbi, editează din nou forma cu butonul poligonului din coloana *Acțiuni*.

::

Coordonatele secțiunii sunt locale și formează un sistem drept: $x$ iese din ecran, $y$ spre stânga, $z$ în jos.

Dacă forma nu este simetrică față de planul cadrului (de exemplu un cornier L), editorul te avertizează: un calcul 2D este exact doar dacă bara este împiedicată să se deplaseze lateral și să se răsucească pe toată lungimea ei, de exemplu de o placă. Când $I_{yz}$ este semnificativ, alegi rigiditatea la încovoiere: **fixată lateral și împotriva răsucirii pe toată lungimea** ($I_y$) sau **liberă să se deplaseze lateral**, care este mai mică. Răsucirea nu este inclusă în niciun caz.
