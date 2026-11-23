---
description: "Șase grinzi, cadre și grinzi cu zăbrele calculate, care se deschid în EduBeam dintr-un clic, fiecare cu exerciții, cu ce trebuie urmărit și cu răspunsuri pentru verificarea calculului manual."
source: site
---

# Exemple

Fiecare card de mai jos este un model calculat live. Dă clic pe unul ca să-l deschizi în [EduBeam]{.edubeam}, gata de editat: mută un nod, modifică o încărcare sau bifează o articulație și urmărește cum se schimbă diagramele. Exercițiile de mai jos transformă fiecare model într-un scurt studiu, cu răspunsuri cu care îți poți verifica calculul manual.

::feature-structures
::

Aceleași modele se găsesc în aplicație la **☰ → Exemple**, iar linkul [run.edubeam.app/?panel=examples&lang=ro](https://run.edubeam.app/?panel=examples&lang=ro){target="_blank"} deschide direct această galerie.

::callout{type="info" title="Aceeași bară în toate cele șase exemple"}
Toate exemplele folosesc aceeași bară de oțel: $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (deci $EI = 17\,548$ kNm²), o arie de $1\ \text{m}^2$ și o rigiditate la forfecare atât de mare încât deformațiile axiale și cele din forfecare sunt neglijabile. De aceea, formulele din manual pentru grinzi zvelte coincid cu aplicația la fiecare cifră afișată. Înălțimea secțiunii este de $1$ m, ceea ce contează doar pentru variația de temperatură.
::

## Exerciții propuse {#suggested-exercises}

Rezolvă mai întâi manual, apoi verifică în aplicație: deschide modelul din cardul lui de mai sus sau cu **Deschide în EduBeam** de sub figura lui. Deschiderea unui model îl înlocuiește pe cel pe care îl ai; <kbd>Ctrl</kbd>+<kbd>Z</kbd> îl readuce pe al tău, care rămâne păstrat și în **☰ → Structuri recente**.

### Grindă static nedeterminată {#exercise-indeterminate-beam}

O grindă de 3 m, încastrată în A și simplu rezemată în B, încărcată cu 10 kN/m.

::model-figure{caption="Încastrată în A, simplu rezemată în B, 10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Află manual reacțiunile și momentul din încastrare, prin metoda eforturilor sau cu un tabel de momente de încastrare perfectă.
2. Debifează `Ry` în A ca grinda să devină simplu rezemată. Cum se schimbă momentul maxim?
3. Bifează din nou `Ry` în A și, de data aceasta, și în B, ca să încastrezi ambele capete.

**Urmărește** unde își schimbă semnul diagrama de moment și cum încastrarea preia mai mult din încărcare decât reazemul simplu.

::callout{type="details" title="Răspunsuri"}
- Încastrată și simplu rezemată: $R_A = 5qL/8 = 18{,}75$ kN, $R_B = 3qL/8 = 11{,}25$ kN, $M_A = qL^2/8 = 11{,}25$ kNm, negativ. Momentul pozitiv maxim este $9qL^2/128 = 6{,}33$ kNm, la 1,125 m de B, unde forța tăietoare este zero.
- Simplu rezemată: $qL^2/8 = 11{,}25$ kNm la mijlocul deschiderii, aceeași valoare pe care o prelua înainte încastrarea.
- Încastrată la ambele capete: $qL^2/12 = 7{,}5$ kNm negativ la capete, $qL^2/24 = 3{,}75$ kNm pozitiv la mijlocul deschiderii.
::

### Consolă {#exercise-cantilever}

O consolă de 4 m, încastrată în A, cu 18 kN în jos la capătul liber B.

::model-figure{caption="Consolă, 18 kN la capătul liber"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Află momentul din încastrare, săgeata la capăt și rotirea la capăt. Compară-le cu nodul B din **Rezultate → Rezultate în noduri**.
2. Înjumătățește $I_y$ în fila **Secțiuni**. Ce se schimbă și ce nu?
3. Înlocuiește forța concentrată cu o încărcare uniform distribuită de 4,5 kN/m, tot 18 kN în total: șterge încărcarea nodală în fila **Încărcări**, apoi **Adaugă încărcare pe element**.

**Urmărește** forma diagramei de moment: o dreaptă sub forța concentrată, o parabolă sub încărcarea uniform distribuită.

::callout{type="details" title="Răspunsuri"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21{,}88$ mm, $\varphi_B = FL^2/(2EI) = 8{,}21$ mrad.
- Jumătate din $I_y$ dublează săgeata, la 43,77 mm. Momentul rămâne 72 kNm: consola este static determinată, deci eforturile ei nu depind de rigiditate.
- Încărcare uniform distribuită: $M_A = qL^2/2 = 36$ kNm și $w_B = qL^4/(8EI) = 8{,}21$ mm. Aceeași încărcare totală dă jumătate din moment și trei optimi din săgeată.
::

### Grindă cu zăbrele Warren {#exercise-pratt-truss}

O grindă cu zăbrele de 9 m, înaltă de 1,8 m, cu câte 8 kN în fiecare dintre cele trei noduri de sus E, F și G. Bifează **N(x)** în opțiunile de afișare ca să vezi forțele axiale. (Cu diagonale alternante și fără montanți, alcătuirea ei este ceea ce majoritatea manualelor numesc grindă cu zăbrele Warren.)

::model-figure{caption="Nodurile A–G, câte 8 kN în E, F și G"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. Află reacțiunile, apoi forțele din diagonala de capăt A–E și din talpa inferioară A–B prin metoda izolării nodurilor.
2. Află forța din talpa superioară în panoul din mijloc și forța din talpa inferioară B–C prin metoda secțiunilor.
3. Nodurile acestui model sunt rigide. Bifează ambele articulații la capete ale fiecărei bare în fila **Elemente** ca să obții o grindă cu zăbrele cu noduri articulate și compară forțele axiale.
4. Șterge diagonala B–F, întâi cu noduri rigide, apoi cu articulații. Mai stă grinda cu zăbrele în picioare?

**Urmărește** distribuția semnelor: talpa superioară comprimată, talpa inferioară întinsă, iar diagonalele alternând.

::callout{type="details" title="Răspunsuri"}
- Reacțiunile: 12 kN în A și în D.
- Diagonalele de capăt: 15,62 kN compresiune. Tălpile inferioare A–B și C–D: 10,00 kN întindere.
- Tălpile superioare E–F și F–G: 13,33 kN compresiune (momente față de B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$). Talpa inferioară B–C: 16,67 kN întindere (momente față de F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$). Diagonalele interioare: 5,21 kN, întinse cele care coboară din E și G spre talpa inferioară, comprimate cele care urcă spre F.
- Nodurile rigide și cele articulate dau aceleași forțe axiale, cu o diferență sub 0,1 %. Încovoierea într-o grindă cu zăbrele triangulată este neglijabilă, de aceea funcționează modelul cu noduri articulate.
- Fără B–F, grinda cu zăbrele cu noduri rigide stă încă în picioare prin efect de cadru, cu momente încovoietoare de circa 3 kNm. Cu articulații îi lipsește o bară: devine un mecanism, iar EduBeam arată cum se poate mișca.
::

### Grindă continuă cu trei deschideri {#exercise-three-span-continuous-beam}

O grindă de 16 m cu deschideri de 5 + 6 + 5 m: 8 kN/m pe prima deschidere, 20 kN în C și 6 kN/m pe ultima deschidere. La deschiderea modelului, doar A și D sunt rezemate.

::model-figure{caption="La deschidere: rezemată doar în A și D"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Așa cum se deschide, este o singură grindă simplu rezemată de 16 m. Află reacțiunile și momentele în B și C.
2. Bifează `Dz` în B și în C ca să obții o grindă continuă pe patru reazeme.
3. Află momentele de pe B și C cu ecuația celor trei momente, apoi reacțiunile.

**Urmărește** momentele negative care apar pe reazemele intermediare, cât de mult scade fiecare moment și ce se întâmplă cu forța de 20 kN când C devine reazem.

::callout{type="details" title="Răspunsuri"}
- Simplu rezemată: $R_A = 44{,}69$ kN, $R_D = 45{,}31$ kN, $M_B = 123{,}4$ kNm și $M_C = 151{,}6$ kNm, ambele pozitive.
- Continuă, cu $M_A = M_D = 0$:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  dau $M_B = -9{,}766$ kNm și $M_C = -5{,}859$ kNm, ambele negative. Forța de 20 kN din C trece direct în reazem și nu încovoaie nimic.
- Reacțiunile: A 18,05 kN, B 22,60 kN, C 35,52 kN (inclusiv cei 20 kN), D 13,83 kN. Însumate, dau cei 90 kN ai încărcării.

::model-figure{caption="Grinda continuă pe patru reazeme"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### Cadru portal {#exercise-portal-frame}

O riglă de 8 m pe doi stâlpi de 6 m, încastrat în A și simplu rezemat în D. Rigla este încărcată cu 10 kN/m, iar colțul de sus C preia 8 kN spre stânga și 10 kN în jos.

::model-figure{caption="Încastrat în A, simplu rezemat în D: 10 kN/m pe riglă, 8 kN și 10 kN în C"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. De câte ori este cadrul static nedeterminat?
2. Debifează `Ry` în A ca A să devină o articulație. Cadrul este acum static determinat: află manual reacțiunile și momentele din colțurile B și C.
3. Bifează din nou `Ry` în A, apoi bifează `Dx` în D ca D să devină o articulație. Urmărește deplasarea laterală a riglei pe deformată.

**Urmărește** încotro se deplasează partea de sus a cadrului. În cadrul așa cum se deschide, ea se deplasează spre dreapta, împotriva forței de 8 kN. De ce?

::callout{type="details" title="Răspunsuri"}
- Patru reacțiuni (trei în încastrare, una în reazemul simplu) și trei ecuații de echilibru: o dată static nedeterminat. Cu D articulat, de două ori.
- Articulație în A: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN spre dreapta. Momentul din colțul B este $8 \cdot 6 = 48$ kNm. În C este zero: fără reacțiune orizontală în D, stâlpul din dreapta preia doar o forță axială de 44 kN.
- Așa cum se deschide, partea de sus se deplasează cu 9,5 mm spre dreapta: momentul din rigla încărcată încovoaie stâlpul încastrat mai mult decât forța de 8 kN. Cu D articulat, D preia 4,9 kN pe orizontală, iar partea de sus se deplasează cu 4,8 mm spre stânga.
::

### Variație de temperatură {#exercise-temperature-load}

O grindă simplu rezemată de 8 m, încălzită cu $\Delta T_c = 20$ K în axa ei, cu fața de jos cu 10 K mai rece decât cea de sus ($\Delta T_b - \Delta T_t = -10$ K).

::model-figure{caption="Grindă simplu rezemată de 8 m, încălzită cu 20 K, cu fața de jos cu 10 K mai rece decât cea de sus"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. Înainte să te uiți: ce eforturi produce variația de temperatură și cum se deplasează grinda?
2. Bifează `Dx` în B ca să împiedici lungirea grinzii.
3. Bifează în plus `Ry` la ambele capete.

**Urmărește** deformata și valorile din **Rezultate → Rezultate în noduri**: grinda se deplasează fără niciun efort până când o împiedici.

::callout{type="details" title="Răspunsuri"}
- O grindă static determinată se poate dilata și curba liber, deci nu apar eforturi. B alunecă spre exterior cu $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1{,}92$ mm. Fața de jos, mai rece, se scurtează, deci grinda se curbează în sus cu curbura $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1{,}2 \cdot 10^{-4}$ 1/m: capetele se rotesc cu $\kappa L/2 = 0{,}48$ mrad, iar mijlocul deschiderii se ridică cu $\kappa L^2/8 = 0{,}96$ mm.
- Cu deplasarea pe x blocată la ambele capete: $N = -EA\alpha\Delta T_c = -50\,400$ kN, compresiune. Valoarea mare provine din aria convențională de 1 m²; un IPE 200 cu 28,48 cm² ar prelua 143,5 kN.
- Cu ambele capete încastrate: un moment constant $EI\alpha(\Delta T_b - \Delta T_t)/h = 2{,}11$ kNm pe toată grinda.
::

## Tutoriale rezolvate {#worked-tutorials}

Modele mai lungi, construite pas cu pas și verificate prin calcul manual:

::card-grid{cols="2"}
:::card{title="Grindă înclinată" icon="lucide:move-diagonal" to="/ro/tutorials/inclined-beam"}
Un căprior încărcat cu zăpadă: încărcări pe metru de proiecție orizontală, forța axială și forța tăietoare de-a lungul pantei și un reazem simplu rotit.
:::
:::card{title="Cadru cu trei articulații" icon="lucide:triangle" to="/ro/tutorials/three-hinged-frame"}
Reacțiunile și diagramele N, V și M ale unui cadru cu o articulație interioară.
:::
:::card{title="Grindă cu zăbrele plană" icon="lucide:git-fork" to="/ro/tutorials/truss"}
Metoda izolării nodurilor, metoda secțiunilor, o bară de efort nul și o săgeată prin lucrul mecanic virtual.
:::
:::card{title="Grindă continuă și cedare de reazem" icon="lucide:spline" to="/ro/tutorials/continuous-beam"}
O grindă cu două deschideri, rezolvată prin metoda eforturilor, apoi cu reazemul din mijloc cedând cu 10 mm.
:::
::

Pentru mai multe verificări cu soluție exactă, vezi [Verificarea rezultatelor prin calcul manual](/ro/guide/verification).

## Mai multe probleme {#more-problems}

[Probleme de statică](/ro/practice) îți dă o grindă, un cadru sau o grindă cu zăbrele nouă, cu alte valori, ori de câte ori ceri, și îți verifică imediat reacțiunile și momentul maxim sau efortul dintr-o bară. Pentru o grupă de studenți, [generatorul de teste](/ro/exam) tipărește o lucrare diferită pentru fiecare student, cu barem, iar [@edubeam/plot](/ro/guide/teaching#exercise-sheets-tests-and-slides-from-code) creează fișe de exerciții din cod.

## Propune un exemplu {#contribute-an-example}

Ai un model bun pentru predare? Postează linkul lui în [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions) și s-ar putea să-l adăugăm în galerie.
