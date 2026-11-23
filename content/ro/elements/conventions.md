---
description: "Convențiile de semne din EduBeam: x spre dreapta și z în jos, încărcări și deplasări pozitive, axe locale, N, V și M, forțe la capete, reacțiuni și opțiunea cu y în sus."
source: site
---

# Axe și convenții de semne

Fiecare număr afișat de EduBeam are un semn. Această pagină stabilește ce înseamnă *pozitiv* pentru coordonate, încărcări, deplasări, eforturi, forțe la capete și reacțiuni, ca să poți compara aplicația cu propriile calcule. Cele mai multe rezultate care par greșite se dovedesc a fi o problemă de convenție de semne.

| Mărime | Pozitiv |
| --- | --- |
| `x`, `Dx`, `Fx` | spre dreapta |
| `z`, `Dz`, `Fz` | **în jos** |
| `Ry`, `My` | în sens antiorar pe ecran |
| $N$ | întindere |
| $V$ | rotește în sens orar un segment scurt al barei |
| $M$ | moment pozitiv: întinde fibra inferioară, pe partea liniei punctate |
| Reacțiuni | forța cu care reazemul acționează asupra structurii, cu semn ca o încărcare |

## Axe globale {#global-axes}

Modelul se află în planul x–z:

- **x** este orizontală, pozitivă **spre dreapta**.
- **z** este verticală, pozitivă **în jos**.
- **y** iese din ecran, spre tine, astfel încât sistemul este drept. Rotirile și momentele sunt față de y, deci **sensul antiorar este pozitiv**.

Crucea axelor din colțul desenului arată x cu roșu și z cu verde. Deoarece z este orientată în jos, nodul din vârful unui stâlp de 3 m care pornește de la `Z = 0` are `Z = −3`. Unghiurile, de exemplu unghiul unui reazem înclinat, se măsoară de la x spre z, adică în sens orar pe ecran.

Dacă preferi y în sus, schimbă [convenția de afișare](#y-up-axes): modelul rămâne același, se schimbă doar numerele pe care le citești și le introduci.

## Grade de libertate {#degrees-of-freedom}

Fiecare nod are trei grade de libertate:

| Grad de libertate | Semnificație | Pozitiv | Unitate |
| --- | --- | --- | --- |
| `Dx` | deplasare orizontală | spre dreapta | m |
| `Dz` | deplasare verticală | în jos | m |
| `Ry` | rotire | în sens antiorar | rad |

Aceleași semne se aplică [deplasărilor impuse](/ro/essentials/loads#prescribed-displacements-support-settlements), tabelului *Rezultate în noduri* și valorilor afișate când ții cursorul deasupra unui nod.

## Încărcări {#loads}

Încărcările sunt pozitive în sensul pozitiv al axelor. **Fx**, **Fz** și **My** sunt componentele unei încărcări nodale sau ale unei forțe concentrate, **fx** și **fz** cele ale unei încărcări uniform distribuite, iar **f₁x**, **f₂x**, **f₁z**, **f₂z** cele ale unei încărcări trapezoidale la începutul și la sfârșitul elementului.

| Încărcare | Sens pozitiv |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, spre dreapta; după axa locală x a elementului când **LCS** este bifat |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **în jos**; după axa locală z a elementului când **LCS** este bifat |
| `My` | în sens antiorar |
| `ΔTc` | încălzirea axei barei, care o alungește |
| `ΔTb − ΔTt` | fibra inferioară mai caldă decât cea superioară |

Așadar greutatea este un `fz` **pozitiv**, iar vântul care împinge spre dreapta un stâlp din stânga este un `fx` pozitiv. O încărcare distribuită acționează întotdeauna pe metru din lungimea proprie a barei, chiar și atunci când este dată în axe globale pe o bară înclinată. Pagina [Încărcări](/ro/essentials/loads#element-loads) arată cum introduci fiecare tip.

::model-figure{caption="Toate încărcările de aici sunt pozitive: fz = 5 kN/m pe A–B, Fz = 10 kN în B, My = 10 kNm în C și Fx = 10 kN în D"}
---
nodes: { A: [0, 0], B: [3, 0], C: [4.5, 0], D: [6, 0] }
supports: { A: fixed }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 5 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
  - { node: D, fx: 10 }
results: []
reactions: false
show: [nodeLabels]
---
::

## Axele locale ale elementului {#element-local-axes}

Fiecare element are propriile axe:

- **axa locală x** merge de la nodul inițial al elementului la nodul lui final;
- **axa locală z** este axa locală x rotită cu 90° **în sens orar pe ecran**, aceeași rotire care duce axa globală x în axa globală z. Dacă mergi de la nodul inițial spre nodul final, axa locală z este în dreapta ta.

| Elementul desenat | Axa locală z este orientată |
| --- | --- |
| de la stânga la dreapta | în jos: axele locale coincid cu cele globale |
| de la dreapta la stânga | în sus |
| de jos în sus | spre dreapta |
| de sus în jos | spre stânga |

Orientarea elementului este unghiul său $\theta$, măsurat de la axa globală x spre axa globală z (în sens orar pe ecran). [Matricea de transformare](/ro/elements/beam#transformation-matrix) trece deplasările de la capete dintr-un sistem în celălalt cu $\cos\theta$ și $\sin\theta$.

În zona de desen, o linie punctată de-a lungul fiecărui element marchează partea +z locală: **fibra inferioară**. Încărcările pe element cu **LCS** bifat, poziția unei forțe concentrate și forțele de la capete urmează toate axele locale. Ca să întorci un element, folosește **Inversează nodurile** din tabelul *Elemente* (vezi [orientarea elementului](/ro/essentials/elements#element-direction)).

## Eforturi {#internal-forces}

Secționează o bară la distanța $x$ de nodul inițial. Pe fața părții **dinaintea** secțiunii, a cărei normală exterioară este orientată după +x local, eforturile sunt pozitive când sunt orientate după +x local, după +z local și în sens antiorar. Pe cealaltă față acționează în sens opus.

::element-sketch{mode="internal-forces" caption="N, V și M pozitive pe un segment scurt al barei: întindere, o pereche de forțe tăietoare care rotește segmentul în sens orar, moment pozitiv (fibra inferioară, punctată, este întinsă)"}
::

În cuvinte:

| Mărime | Pozitiv înseamnă |
| --- | --- |
| $N$ | întindere |
| $V$ | rotește în sens orar un segment scurt al barei: la o bară desenată de la stânga la dreapta, în sus pe fața din stânga a segmentului și în jos pe fața din dreapta |
| $M$ | **moment pozitiv**: întinde fibra inferioară, pe partea punctată |

Cu $q_x$ și $q_z$ încărcarea distribuită în axe locale, ele respectă relațiile

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

Sub o încărcare concentrată $F_x$, $F_z$ sau $M_y$ (în axe locale) au salturi $\Delta N = -F_x$, $\Delta V = -F_z$ și $\Delta M = -M_y$: o forță orientată după +z local micșorează $V$, iar un moment în sens antiorar micșorează $M$.

O grindă simplu rezemată sub încărcări gravitaționale are deci moment pozitiv, forță tăietoare pozitivă la reazemul din stânga și negativă la reazemul din dreapta. Grinda de mai jos este și trasă de reazemul simplu, deci forța ei axială este pozitivă.

::model-figure{caption="Grindă simplu rezemată, 10 kN/m și o forță de întindere de 20 kN: M = +45 kNm la mijlocul deschiderii, V = +30 kN la reazemul din stânga și −30 kN la cel din dreapta, N = +20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
  - { node: B, fx: 20 }
results: [M, V, N]
---
::

La o consolă momentul își schimbă semnul: este negativ. O forță care împinge în lungul axei ei o comprimă.

::model-figure{caption="Consolă cu o forță de 10 kN la capăt și o forță de compresiune de 15 kN: M = −40 kNm în încastrare, V = +10 kN, N = −15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 10 }
  - { member: 1, px: -15, at: 4 }
results: [M, V, N]
---
::

Într-un cadru, fibra inferioară a fiecărei bare este pe partea +z locală, deci ordinea în care desenezi un stâlp decide care parte a lui este cea inferioară. Acest cadru este desenat A → B → C → D, ceea ce orientează axa locală z a fiecărei bare spre interior: un moment pozitiv înseamnă fibra interioară întinsă, iar momentele negative din colțuri înseamnă fibra exterioară întinsă.

::model-figure{caption="Cadru portal desenat A → B → C → D: axa locală z a tuturor celor trei bare este orientată spre interiorul cadrului"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

Diagramele sunt desenate ca la majoritatea cursurilor europene: $M$ pe fibra întinsă, $N$ și $V$ pozitive pe partea opusă liniei punctate. **Setări → Setări de afișare → Diagrame de eforturi** poate pune $M$ pe fibra comprimată și $N$ sau $V$ pe partea punctată. Asta schimbă desenul, niciodată valorile: citește semnul din etichetă, nu din partea pe care este desenată diagrama.

## Forțe la capete (tabelul Rezultate pe elemente) {#end-forces-element-results-table}

Tabelul *Rezultate pe elemente* conține șase **forțe la capete** pentru fiecare element, în axele lui **locale**:

::element-sketch{mode="end-forces" caption="Cele șase forțe la capete, fiecare desenată pozitiv: după axele locale x și z și în sens antiorar"}
::

| Coloană | Acționează asupra elementului în | Pozitivă după |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | nodul inițial | +x local, +z local, sens antiorar |
| `X21`, `Z21`, `M21` | nodul final | +x local, +z local, sens antiorar |

Ele sunt forțele cu care nodurile acționează asupra elementului: matricea lui de rigiditate înmulțită cu deplasările de la capete, plus forțele care i-ar echilibra încărcările dacă ambele capete ar fi încastrate,

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

unde $\mathbf{d}_l$ sunt deplasările de la capetele elementului în axe locale, iar $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ încărcările nodale echivalente ale [încărcărilor lui pe element](/ro/elements/beam#element-loads).

Forțele de la capete urmează axele, nu convenția $N$–$V$–$M$, așa că în nodul inițial semnele lor sunt inversate:

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

Pentru grinda simplu rezemată de mai sus: `X12 = −20 kN` și `X21 = +20 kN` (întindere), `Z12 = Z21 = −30 kN` (ambele reazeme împing în sus, adică în sensul −z) și `M12 = M21 = 0`.

În fiecare nod, forțele de la capetele elementelor care se întâlnesc acolo, trecute în axe globale și însumate, dau încărcarea nodală plus reacțiunea. Astfel poți verifica rapid echilibrul unui nod.

## Reacțiuni {#reactions}

O reacțiune este forța sau momentul cu care un reazem acționează **asupra structurii**, câte una pentru fiecare grad de libertate blocat. Are semn ca o încărcare: pozitivă după +x, după +z (în jos) și în sens antiorar. Un reazem care preia încărcări gravitaționale are deci un `Rz` **negativ**.

Reacțiunile sunt în axe globale sau, când nodul are un **Unghiul sistemului local al nodului** (un [reazem înclinat](/ro/essentials/nodes-supports#inclined-skewed-supports)), în axele proprii ale nodului. În zona de desen, fiecare reacțiune este o săgeată orientată în sensul în care împinge reazemul, etichetată cu mărimea ei. Valorile cu semn se găsesc în exportul CSV, ca `Rx`, `Rz` și `My`.

## Axe cu y în sus {#y-up-axes}

**Setări → Limbă și regiune → Sistem de coordonate → x spre dreapta, y în sus** trece tot ce introduci și citești în sistemul din manuale: **x** spre dreapta, **y** în sus și **z** spre tine. Modelul, fișierele salvate și desenele rămân exact aceleași; se schimbă doar numerele și literele:

| Mărime | x spre dreapta, z în jos (implicit) | x spre dreapta, y în sus |
| --- | --- | --- |
| Coordonata verticală | `Z` | `Y`, cu semn opus |
| Încărcări verticale, deplasări, reacțiuni, forțe la capete | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, cu semn opus |
| Rotiri și momente | `Ry`, `My` | `Rz`, `Mz`, același semn (pozitiv în sens antiorar) |
| Unghiul reazemului | măsurat în sens orar | măsurat în sens antiorar, cu semn opus |
| Eforturi | $N$, $V$, $M$ | aceleași, cu aceleași semne, desenate la fel |

Așadar, cu y în sus, greutatea este un `fy` **negativ**, iar vârful unui stâlp de 3 m are `Y = 3`.

## Unități {#units}

Programul de calcul lucrează peste tot în SI: m, N, Pa, rad și K pentru variațiile de temperatură. Unitățile de afișare din [Unități și setări](/ro/essentials/units-settings) schimbă doar ce introduci și citești, niciodată modelul.
