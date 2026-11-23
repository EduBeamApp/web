---
description: "Tutorial: o grindă înclinată în EduBeam, cu încărcarea dată pe metru de proiecție orizontală, forța axială și forța tăietoare de-a lungul pantei și direcția reazemului simplu. 15 minute."
source: site
---

# Tutorial: grindă înclinată

Modelează un căprior de acoperiș încărcat cu zăpadă, citește forța axială și forța tăietoare de-a lungul pantei și verifică-le prin calcul manual.

- **Timp:** aproximativ 15 minute. Este primul și cel mai scurt dintre cele patru tutoriale.
- **Ai nevoie de:** EduBeam deschis într-o a doua filă, pe un calculator cu mouse și tastatură. Dacă n-ai mai folosit EduBeam, parcurge mai întâi [Ghidul de început](/ro/guide/quick-start): arată filele și ferestrele de dialog folosite în acest tutorial.
- **Cunoștințe necesare:** echilibrul unei grinzi simplu rezemate și descompunerea unei forțe în două componente.
- **Unități:** SI. Butonul unităților din colțul din dreapta jos al zonei de desen trebuie să arate `m m² kN kNm MPa`. Dacă arată picioare și kipi, dă clic pe el și setează **Sistem de unități** la **SI (metric)**.

**Vei învăța să**

- transformi o încărcare dată pe metru de proiecție orizontală în încărcarea pe lungimea barei, pe care o folosește EduBeam,
- orientezi o încărcare distribuită vertical sau perpendicular pe bară cu ajutorul căsuței **LCS**,
- rotești un reazem simplu și observi că rotirea modifică forța axială, dar nu și momentul încovoietor.

::div{.actions}
[Deschide EduBeam ↗](https://run.edubeam.app/?lang=ro){target="_blank"} [Sari la verificarea manuală](#check-by-hand)
::

::model-figure{caption="Căpriorul terminat: zăpadă de 3 kN/m pe metru de proiecție orizontală, introdusă ca 2,4 kN/m pe lungimea barei, cu o articulație la streașină (nodul 1) și un reazem simplu la coamă (nodul 2)"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Problema {#the-problem}

- Un căprior drept de la nodul 1, în (0, 0), până la nodul 2, în (4, −3): 4 m în proiecție orizontală și 3 m înălțime, deci are lungimea $L = 5$ m, cu $\cos\alpha = 4/5$ și $\sin\alpha = 3/5$.
- O articulație în nodul 1, la streașină. În nodul 2, la coamă, un reazem simplu care se deplasează pe orizontală, deci reacțiunea lui este verticală.
- Încărcarea din zăpadă $s = 3$ kN/m, dată, ca în normative, **pe metru de proiecție orizontală**.
- Oțel, $E = 210$ GPa, iar $I_y = 8{,}356 \times 10^{-5}$ m⁴, ca la un IPE 300.

**Este static determinată?** Trei reacțiuni și trei ecuații de echilibru: da. Eforturile rezultă doar din statică; $E$ și $I_y$ contează numai pentru săgeată.

## Modelează {#model-it}

::div{.steps}

### Material și secțiune {#material-and-section}

1. Dă clic pe **Golește modelul** în bara aplicației, bifează **Șterge materialele** și **Șterge secțiunile** și dă clic pe **Confirmă**. Nodurile și elementele se numerotează din nou de la 1.
2. Fila **Materiale** → **Bibliotecă de materiale** → **+** pe rândul **Oțel (S235)**, apoi **Renunță** ca să închizi biblioteca.
3. Fila **Secțiuni** → **Adaugă secțiune**. Introdu `8,356e-5` la **Iy**, păstrează **Arie**, **Înălțime** și **Coeficient de forfecare** la `1` și dă clic pe **Adaugă secțiune**.

O arie de 1 m² împiedică bara să se scurteze sau să se deformeze vizibil din forfecare, așa cum presupune calculul manual.

### Desenează bara {#draw-the-member}

1. Fila **Elemente** → al doilea buton **Adaugă element**, cel cu pictograma cursorului.
2. Dă clic în (0, 0), apoi în (4, −3). Riglele și reticulul îți arată unde te afli, iar clicurile se aliniază la grilă.
3. Apasă <kbd>Esc</kbd> ca să oprești desenarea, apoi <kbd>F</kbd> ca să încadrezi vederea.

Axa z este îndreptată în jos, deci nodul 2, aflat cu 3 m **deasupra** nodului 1, are $z = -3$. Verifică ambele noduri în tabelul **Noduri** și corectează orice coordonată greșită.

### Reazeme {#supports}

Dă clic pe nodul 1 → **Reazeme în nod** → simbolul **Articulație**. Dă-i nodului 2, în același fel, un **Reazem simplu**.

### Încărcare {#load}

Zăpada de pe căprior totalizează $3 \cdot 4 = 12$ kN. EduBeam distribuie o încărcare uniformă pe **lungimea** barei, așa că aceiași 12 kN pe 5 m înseamnă

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0{,}8 = 2{,}4\ \text{kN/m}
$$

1. Fila **Încărcări** → **Adaugă încărcare pe element**.
2. **Tipul încărcării** *Încărcare uniform distribuită*, **Element** `1`, `fz = 2,4`.
3. **Debifează LCS**, ca `fz` să acționeze vertical, și dă clic pe **Adaugă încărcare pe element**.

::callout{type="warning" title="LCS este bifat implicit"}
Cu **LCS** bifat, `fz` acționează după axa z locală a elementului, perpendicular pe pantă: ca vântul pe un acoperiș, nu ca zăpada. La o grindă orizontală cele două coincid, de aceea greșeala trece ușor neobservată. Săgețile încărcării arată în ce sens acționează aceasta; detaliile sunt în [Încărcări](/ro/essentials/loads#uniformly-distributed-load).
::

::

## Rezultate {#results}

Grinda este calculată de îndată ce adaugi încărcarea. În opțiunile de afișare din dreapta sus a zonei de desen (rotița le afișează și le ascunde), **Deformata**, **M<sub>y</sub> (x)** și **Reacțiuni** sunt pornite de la început; bifează și **N (x)** și **V<sub>z</sub> (x)**. Comutatorul de sub figura de sus arată aceleași diagrame.

EduBeam etichetează diagramele și reacțiunile în kN și kNm, cu două zecimale, așa că ar trebui să citești:

- `6,00` în fiecare reazem, în sus. Reacțiunea orizontală a articulației arată `0,00`: nu acționează nicio forță orizontală.
- `6,00` kNm, maximul momentului încovoietor, la mijlocul deschiderii.
- `4,80` kN forță tăietoare în nodul 1 și `-4,80` în nodul 2.
- `-3,60` kN forță axială în nodul 1 (compresiune) și `3,60` în nodul 2 (întindere), cu trecere prin zero la mijlocul deschiderii.

## Verificarea prin calcul manual {#check-by-hand}

**Reacțiunile.** Rezultanta de 12 kN acționează la 2 m în proiecție orizontală de nodul 1, deci momentele față de oricare capăt dau $V_1 = V_2 = 6$ kN. Nu acționează nicio forță orizontală, deci $H_1 = 0$.

**Momentul încovoietor.** Pentru forțe verticale contează doar brațele orizontale. La distanța $x$ în proiecție orizontală de nodul 1,

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

exact ca la o grindă orizontală cu deschiderea $a = 4$ m, sub aceeași încărcare pe metru de proiecție orizontală.

**Forța tăietoare și forța axială.** Forțele din stânga unei secțiuni în $x$ se însumează într-o forță verticală $T(x) = V_1 - s\,x$. Descompune-o în componenta perpendiculară pe bară și cea în lungul ei:

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | Nodul 1, $T = +6$ kN | Mijlocul deschiderii, $T = 0$ | Nodul 2, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0{,}8 = 4{,}8$ kN | 0 | −4,8 kN |
| $N$ | $-6 \cdot 0{,}6 = -3{,}6$ kN | 0 | +3,6 kN |
| $M$ | 0 | 6 kNm | 0 |

Totul coincide cu EduBeam. Reacțiunea în sus din nodul 1 împinge capătul inferior în sus pe pantă, spre interiorul barei: compresiune. Reacțiunea în sus din nodul 2 trage capătul superior mai departe în sus pe pantă, în afara barei: întindere. Semnele urmează sensul elementului, de la nodul 1 la nodul 2, așa cum explică [Axe și convenții de semne](/ro/elements/conventions#internal-forces).

## Experimentează {#experiment}

Modifică pe rând câte un singur lucru, anticipează rezultatul, apoi verifică-l. <kbd>Ctrl</kbd>+<kbd>Z</kbd> anulează fiecare modificare.

**Uită de cosinus.** Introdu `fz = 3` în loc de 2,4. Asta înseamnă 3 kN pe metru de pantă, 15 kN în total, iar fiecare rezultat iese cu 25 % prea mare: reacțiuni de 7,5 kN și un moment de 7,5 kNm. La un acoperiș cu panta de 30° eroarea ar fi de 15 %, la 45° de 41 %.

**Lasă LCS bifat.** Bifează **LCS** la încărcarea de 2,4 kN/m. Acum încărcarea împinge perpendicular pe pantă, ca vântul, cu o componentă orizontală de 7,2 kN pe care o poate prelua doar articulația. Momentul crește la $2{,}4 \cdot 5^2/8 = 7{,}5$ kNm, iar forța axială devine o întindere constantă de 4,5 kN.

::model-figure{caption="Aceiași 2,4 kN/m cu LCS bifat: perpendicular pe pantă, deci articulația preia 7,2 kN lateral"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Rotește reazemul simplu.** Debifează din nou **LCS** și schimbă doar direcția în care se deplasează reazemul simplu din nodul 2. Dă clic pe nodul 2 → **Reazeme în nod**, introdu `-36,87` la **Unghiul sistemului local al nodului** și apasă <kbd>Enter</kbd> (sau introdu valoarea în câmpul **α** din rândul nodului în tabelul **Noduri**).

![Meniul Reazeme în nod pentru nodul 2: simbolurile reazemelor, direcțiile blocate și Unghiul sistemului local al nodului](/screenshots/ro/p2t-node-supports-angle.webp){.shot-md}

Unghiul rotește axele proprii ale nodului. În axele implicite, x spre dreapta și z în jos, un unghi negativ le rotește pe ecran în sens antiorar. Mai multe găsești la [Reazeme înclinate](/ro/essentials/nodes-supports#inclined-skewed-supports).

Reazemul simplu se deplasează acum de-a lungul pantei, deci reacțiunea lui este perpendiculară pe bară: $12 \cdot 2 / 5 = 4{,}8$ kN, din momentele față de nodul 1. Articulația preia restul și, odată cu el, întreaga forță axială: −7,2 kN în nodul 1, zero în nodul 2.

::model-figure{caption="Reazemul simplu din nodul 2, rotit cu −36,87° ca să se deplaseze de-a lungul pantei: forța axială variază de la −7,2 kN la zero"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Pune un reazem simplu vertical.** Readu unghiul la 0 și alege **Reazem simplu vertical** pentru nodul 2. Acesta se deplasează pe verticală, deci poate împinge doar lateral: momentele față de nodul 1, $H_2 \cdot 3 = 12 \cdot 2$, dau 8 kN, iar articulația ține căpriorul împotriva acestei împingeri. Întreaga bară este comprimată.

::model-figure{caption="Un reazem simplu vertical în nodul 2: o împingere orizontală de 8 kN și întregul căprior comprimat"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

Cele trei reazeme simple, unul lângă altul:

| Reazemul simplu din nodul 2 | Reacțiunea în nodul 2 | Reacțiunea în nodul 1 | $N$ de la nodul 1 la nodul 2 |
| --- | --- | --- | --- |
| Orizontal | 6 kN ↑ | 6 kN ↑ | de la −3,6 la +3,6 kN |
| De-a lungul pantei | 4,8 kN ⊥ pe bară | 2,88 kN →, 8,16 kN ↑ | de la −7,2 la 0 kN |
| Vertical | 8 kN ← | 8 kN →, 12 kN ↑ | de la −13,6 la −6,4 kN |

**Momentul încovoietor nu se schimbă niciodată**, și nici forța tăietoare: 6 kNm și ±4,8 kN în toate trei cazurile. Nodul 1, nodul 2 și orice secțiune se află pe aceeași dreaptă, axa barei. Componenta reacțiunii din nodul 2 care acționează de-a lungul acestei drepte nu are moment față de niciunul dintre aceste puncte, deci adaugă doar forță axială. Componenta perpendiculară pe bară este fixată la 4,8 kN de momentele față de nodul 1, oricum ar fi orientat reazemul simplu. Direcția reazemului simplu decide doar unde ajunge împingerea, ceea ce contează pentru zidul sau podestul de scară care trebuie s-o preia.

## Pașii următori {#next-steps}

::card-grid{cols="2"}
:::card{title="Exersează: grinzi cu consolă" icon="lucide:dices" to="/ro/practice?p=O2048"}
Reacțiunile și momentul maxim ale unei grinzi sub o încărcare distribuită, cu răspunsurile verificate imediat. Începe cu O2048; pentru mai multe, lasă selectată doar **Grindă cu consolă** și apasă **Problemă nouă**.
:::
:::card{title="Următorul: cadru cu trei articulații" icon="lucide:triangle" to="/ro/tutorials/three-hinged-frame"}
Patru bare, o articulație interioară și o împingere orizontală: un cadru pe care îl poți rezolva în continuare doar cu ecuațiile de echilibru.
:::
::
