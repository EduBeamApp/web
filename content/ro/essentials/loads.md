---
description: "Încărcări în EduBeam: forțe, momente, cedări de reazem, încărcări uniform distribuite, trapezoidale, concentrate și variații de temperatură, cu semnele lor: z în jos, momentele pozitive în sens antiorar."
source: site
---

# Încărcări

Încărcările acționează în noduri sau în lungul elementelor. Toate aparțin unui **singur caz de încărcare** și acționează simultan; ca să compari mai multe situații, salvează-le pe fiecare ca [fișier de proiect sau link de partajare](/ro/essentials/import-export).

| Încărcare | Acționează pe | O adaugi din |
| --- | --- | --- |
| [Forță sau moment](#nodal-loads) | un nod | fila *Încărcări* → **Adaugă încărcare nodală** sau clic pe nod → **Adaugă încărcare** |
| [Deplasare impusă](#prescribed-displacements-support-settlements) (cedare de reazem) | un nod rezemat | aceeași fereastră sau clic pe nod → **Impune o deplasare** |
| [Încărcare uniform distribuită](#uniformly-distributed-load), [trapezoidală](#trapezoidal-load), [forță concentrată](#concentrated-load) sau [variație de temperatură](#temperature-load) | un element | fila *Încărcări* → **Adaugă încărcare pe element** sau clic pe element → **Adaugă încărcare** |

## Convenția de semne {#sign-convention-in-one-line}

Axa x este orientată **spre dreapta**, axa z **în jos**, iar momentele sunt pozitive **în sens antiorar**. Așadar un `Fz` sau `fz` pozitiv este o încărcare îndreptată în jos, ca greutatea, iar o încărcare îndreptată în sus este negativă.

::model-figure{caption="Toate încărcările de aici sunt pozitive: Fx = +10 kN spre dreapta, Fz = +10 kN în jos, My = +10 kNm în sens antiorar"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| Pozitiv | Axe implicite (z în jos) | [Axe cu y în sus](/ro/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Forța orizontală `Fx`, `fx` | spre dreapta | spre dreapta |
| Forța verticală | `Fz`, `fz`: **în jos** | `Fy`, `fy`: **în sus** |
| Momentul | `My`: în sens antiorar | `Mz`: în sens antiorar |
| Cedarea de reazem verticală | `Dz`: în jos | `Dy`: în sus |

Încărcările date în **axele locale** ale elementului (cu LCS bifat) urmează în schimb elementul: axa locală x merge de la nodul inițial la nodul final, iar axa locală z este axa locală x rotită cu 90° în sens orar, spre linia punctată desenată de-a lungul elementului. Vezi [Orientarea elementului](/ro/essentials/elements#element-direction). Convenția completă, inclusiv pentru eforturi, se află în [Axe și convenții de semne](/ro/elements/conventions#loads).

## Încărcări nodale {#nodal-loads}

Fila *Încărcări* → **Adaugă încărcare nodală** sau clic pe un nod → **Adaugă încărcare** și lasă selectat **Forță/Moment**. Introdu forțele `Fx`, `Fz` (kN) și momentul `My` (kNm), cu semnele de [mai sus](#sign-convention-in-one-line); previzualizarea desenează încărcarea pe măsură ce scrii.

![Adaugă încărcare nodală: previzualizarea arată direcția pe măsură ce scrii](/screenshots/ro/loads-nodal.webp){.shot-md}

- Componentele sunt în axe **globale**. La un nod cu axe rotite (un [reazem înclinat](/ro/essentials/nodes-supports#inclined-skewed-supports)), fereastra adaugă un comutator **Axe globale** / **Axele nodului**. În axele nodului, componentele, afișate ca `Fx′` și `Fz′`, acționează după axele proprii ale nodului și se rotesc odată cu ele dacă unghiul se schimbă ulterior. La comutare, valorile se recalculează astfel încât încărcarea să rămână aceeași.
- Un nod poate avea mai multe încărcări nodale; ele se însumează.

### Deplasări impuse (cedări de reazem) {#prescribed-displacements-support-settlements}

Ca să deplasezi un reazem cu o valoare dată, alege **Deplasare impusă** în aceeași fereastră sau dă clic pe un nod rezemat → **Impune o deplasare**. Introdu deplasările `Dx`, `Dz` (pozitive spre dreapta și în jos, în [unitatea pentru deplasări](/ro/essentials/units-settings#units), implicit m) și rotirea `Ry` (rad, pozitivă în sens antiorar).

- Se pot impune doar gradele de libertate **blocate**: celelalte câmpuri sunt inactive, iar un nod fără reazem nu poate avea deloc cedare de reazem.
- Un nod are cel mult o deplasare impusă. Ca s-o schimbi, editeaz-o în loc să adaugi încă una.
- La un reazem înclinat, câmpurile se numesc `Dx′` și `Dz′`: cedarea acționează după axele proprii ale reazemului.

Dacă o cedare de reazem produce eforturi depinde de structură. Aceeași cedare de 10 mm a reazemului B, fără nicio altă încărcare:

::div{.shots}

:::model-figure{caption="Grindă simplu rezemată: doar se înclină; nu apar reacțiuni, M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Grindă continuă peste B: grinda se încovoaie, M = 21,06 kNm pe reazemul B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

O structură static determinată urmează reazemul fără nicio rezistență. Grinda continuă trebuie să se încovoaie: reazemul B o trage în jos cu $\delta = 10\ \text{mm}$, ca o forță concentrată la mijlocul unei grinzi simplu rezemate cu deschiderea de 10 m. Cu $L = 5\ \text{m}$ și rigiditatea oțelului din exemplu $EI = 17\,548\ \text{kNm}^2$, această forță este $P = 6EI\delta/L^3 = 8{,}423\ \text{kN}$, adică reacțiunea din B, iar $M_B = PL/2 = 3EI\delta/L^2 = 21{,}06\ \text{kNm}$. Tutorialul [Grindă continuă și cedare de reazem](/ro/tutorials/continuous-beam) combină o cedare de reazem cu încărcări.

## Încărcări pe element {#element-loads}

Fila *Încărcări* → **Adaugă încărcare pe element** sau clic pe un element → **Adaugă încărcare**. Alege **Tipul încărcării**; previzualizarea arată încărcarea pe element pe măsură ce scrii. Forțele sunt în kN, iar încărcările distribuite în kN/m, sau în ce [unități](/ro/essentials/units-settings#units) ai ales.

![Adaugă încărcare pe element, cu o încărcare uniform distribuită](/screenshots/ro/loads-udl.webp){.shot-md}

### Încărcare uniform distribuită {#uniformly-distributed-load}

O încărcare constantă pe unitatea de lungime, `fx` și `fz`, pe tot elementul. Cu **LCS** bifat (implicit) acționează după axele locale ale elementului; nebifat, după axele globale. La un element orizontal desenat de la stânga la dreapta, cele două coincid; la o bară înclinată, nu:

| Vrei | Introdu |
| --- | --- |
| o încărcare **perpendiculară** pe bară (vântul pe un căprior) | `fz` cu LCS **bifat** |
| o încărcare **verticală** pe metru de bară (greutatea proprie) | `fz` cu LCS **nebifat** |
| o încărcare **verticală** pe metru de proiecție orizontală (zăpada) | nu există ca opțiune directă: înmulțește cu $\cos\alpha$, unde α este înclinarea barei, și introdu-o ca încărcare verticală |

Aceleași 10 kN/m pe un căprior cu proiecția orizontală de 4 m și cea verticală de 3 m, lung de 5 m:

::div{.shots}

:::model-figure{caption="LCS nebifat: verticală, 50 kN în total; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="LCS bifat: perpendiculară pe bară; M = 31,25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

Calcul manual: perpendiculară, $M = qL^2/8 = 10 \cdot 5^2/8 = 31{,}25\ \text{kNm}$; verticală, cei 50 kN repartizați pe 4 m de deschidere înseamnă 12,5 kN/m pe proiecție, deci $M = 12{,}5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Încărcare trapezoidală {#trapezoidal-load}

O încărcare care variază liniar în lungul elementului: `f1x`, `f1z` în nodul **inițial**, `f2x`, `f2z` în nodul **final**. Pune zero la un capăt pentru o încărcare triunghiulară.

::model-figure{caption="Încărcare triunghiulară de la 0 la 10 kN/m: reacțiuni de 10 și 20 kN, M maxim = 23,09 kNm la 3,46 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

Calcul manual: rezultanta $qL/2 = 30\ \text{kN}$ acționează la $2L/3$, deci $R_A = 10\ \text{kN}$ și $R_B = 20\ \text{kN}$; forța tăietoare este zero, iar momentul maxim, la $x = L/\sqrt{3} = 3{,}46\ \text{m}$, unde $M = qL^2/(9\sqrt{3}) = 23{,}09\ \text{kNm}$.

Încărcările trapezoidale acționează după **axele locale** ale elementului (caseta LCS este blocată). La un element orizontal desenat de la stânga la dreapta, este același lucru ca în axe globale; la unul înclinat, `f1z` și `f2z` sunt perpendiculare pe bară, iar `f1x`, `f2x` în lungul ei.

O încărcare **verticală** variabilă pe o bară cu înclinarea $\alpha$ se poate introduce totuși exact: dă la fiecare capăt cele două componente locale, $f_z = q\cos\alpha$ și $f_x = q\sin\alpha$, orientată în josul pantei, deci negativă când elementul urcă de la nodul inițial. Pentru căpriorul de mai sus, cu proiecțiile de 4 m și 3 m și desenat de jos în sus, o încărcare verticală care crește de la 0 la 10 kN/m de bară înseamnă `f1x` = `f1z` = 0, `f2x` = −6 și `f2z` = 8 kN/m.

::model-figure{caption="Încărcare verticală de la 0 la 10 kN/m de bară, introdusă prin componente locale: reacțiuni de 8,333 și 16,67 kN, M maxim = 12,83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

Calcul manual: rezultanta de 25 kN acționează la două treimi din proiecția orizontală, la 2,67 m, deci $R_B = 25 \cdot 2{,}667/4 = 16{,}67\ \text{kN}$. Pe proiecția de 4 m, încărcarea este un triunghi care crește până la 12,5 kN/m, deci, ca mai sus, $M = 12{,}5 \cdot 4^2/(9\sqrt{3}) = 12{,}83\ \text{kNm}$.

### Forță concentrată {#concentrated-load}

O forță concentrată `Fx`, `Fz` sau un moment `My` oriunde **în lungul** unui element, fără un nod suplimentar. **Poziția încărcării față de nodul inițial** este distanța $a$ de la nodul inițial, $0 \le a \le L$. Valoarea implicită este jumătatea lungimii, rotunjită în jos la metri întregi și de cel mult 5 m (picioare întregi și cel mult 15 ft în unități americane), așa că stabilește-o acolo unde se află încărcarea ta. **LCS** funcționează ca la încărcările uniform distribuite.

::model-figure{caption="20 kN la 2 m pe o deschidere de 6 m: V face un salt de la 13,33 la −6,667 kN, M = 26,67 kNm sub forță"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

Diagrama forței tăietoare are în dreptul forței un salt egal cu `Fz`, iar diagrama de momente are acolo un punct unghiular: $R_A = 20 \cdot 4/6 = 13{,}33\ \text{kN}$, $M = 13{,}33 \cdot 2 = 26{,}67\ \text{kNm}$. Un moment concentrat `My` produce în schimb un salt în diagrama de momente.

### Variație de temperatură {#temperature-load}

| Câmp | Semnificație | Efect |
| --- | --- | --- |
| **ΔT<sub>c</sub>**, variația de temperatură în axa barei | aceeași variație pe toată secțiunea | alungirea $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | variația fibrei inferioare minus cea a fibrei superioare | curbura $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Ambele sunt *variații* de temperatură față de starea fără tensiuni, implicit în °C; o variație de 1 °C este egală cu 1 K. Variațiile de temperatură folosesc **α** al materialului și **înălțimea h** a secțiunii. Fibra **inferioară** este pe partea liniei punctate. O valoare ΔT<sub>b</sub> − ΔT<sub>t</sub> pozitivă (mai cald jos) alungește fibra inferioară, așa că elementul se curbează în jos, ca o grindă sub greutatea proprie.

La o structură static determinată, temperatura produce doar deplasări. Legăturile suplimentare (încastrări, continuitate, bare de prisos) o transformă în eforturi. Aceeași grindă de oțel de 6 m, înaltă de 0,3 m, cu 20 K mai caldă jos decât sus:

::div{.shots}

:::model-figure{caption="Simplu rezemată: are o săgeată de 3,6 mm la mijlocul deschiderii, M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="Încastrată la ambele capete: rămâne dreaptă, M = −14,04 kNm pe toată lungimea"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

Calcul manual: curbura liberă este $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0{,}3 = 8 \times 10^{-4}\ \text{1/m}$. Simplu rezemată, grinda o preia liber și are o săgeată de $\kappa L^2/8 = 3{,}6\ \text{mm}$. Cu capetele încastrate, un moment constant trebuie s-o anuleze: $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14{,}04\ \text{kNm}$. Pagina [Verificarea rezultatelor prin calcul manual](/ro/guide/verification#temperature-gradient-on-a-simply-supported-beam) rezolvă încă un caz.

## Editarea și ștergerea încărcărilor {#editing-and-removing-loads}

| Ca să | Fă așa |
| --- | --- |
| Schimbi rapid valorile | Editează componentele (și caseta LCS) direct în fila *Încărcări*. |
| Deschizi fereastra de editare | Dă dublu clic pe încărcare în zona de desen sau clic pe ea → **Editează încărcarea**. Încărcările apar și ca etichete în tabelele *Noduri* și *Elemente*; dă clic pe una ca s-o editezi. |
| O ștergi | Selecteaz-o și apasă <kbd>Delete</kbd>, dă clic pe ea → **Șterge** sau folosește × din fila *Încărcări*. |

Încărcările aparțin nodului sau elementului lor: dacă ștergi nodul sau elementul, ele se șterg, iar dacă îl copiezi având selectate și încărcările, se copiază și ele.

![Fila Încărcări: câte un rând pentru fiecare încărcare, cu componentele editabile direct în tabel](/screenshots/ro/loads-table.webp)

## Ce nu este disponibil {#what-is-not-available}

::div{.limits}
- **Un singur caz de încărcare.** Fără combinații: salvează fiecare caz ca fișier sau link separat.
- **Fără greutate proprie.** Adaug-o ca încărcare uniform distribuită, cu LCS nebifat: $f_z = \rho\,g\,A$, de exemplu $\approx 0{,}22\ \text{kN/m}$ pentru un IPE 200.
- **Încărcări trapezoidale doar în axe locale.** Pentru o încărcare verticală variabilă pe o bară înclinată, introdu [componentele ei locale](#trapezoidal-load).
- **Fără încărcări distribuite pe o porțiune a elementului.** O încărcare distribuită acoperă tot elementul: adaugă un nod acolo unde începe sau se termină.
::
