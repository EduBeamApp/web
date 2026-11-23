---
description: "EduBeam verificat cu formulele din manual: grinzi, o grindă cu zăbrele, variație de temperatură, cedare de reazem și diferența dintre bara Timoshenko și bara Euler–Bernoulli."
source: site
---

# Verificarea rezultatelor prin calcul manual

Nu te încrede într-o valoare pe care nu o poți reproduce măcar aproximativ. Pe această pagină rezolvăm manual cazurile clasice din manuale și le comparăm cu [EduBeam]{.edubeam}, care dă aceleași valori la fiecare cifră afișată. Tabelele dau cinci cifre semnificative, ca fila *Rezultate* din aplicație; etichetele din figuri sunt rotunjite la patru. Fiecare figură este calculată live în browserul tău; **Deschide în EduBeam** încarcă același model în aplicație, unde poți citi tabelele, poți modifica o valoare și poți urmări ce se întâmplă.

::div{.chips}
- [Grindă simplu rezemată](#simply-supported-beam-uniform-load)
- [Consolă](#cantilever-tip-load)
- [Grindă dublu încastrată](#fixed–fixed-beam-uniform-load)
- [Grindă încastrată și simplu rezemată](#propped-cantilever-uniform-load)
- [Grindă cu zăbrele din două bare](#two-bar-truss)
- [Variație de temperatură](#temperature-gradient-on-a-simply-supported-beam)
- [Cedare de reazem](#prescribed-displacement)
- [Deformații din forfecare](#shear-deformation)
::

Structuri întregi, rezolvate de la început până la sfârșit, găsești în tutorialele [Cadru cu trei articulații](/ro/tutorials/three-hinged-frame) și [Grindă cu zăbrele plană](/ro/tutorials/truss). Pentru probleme noi de rezolvat manual, cu răspunsurile verificate pe măsură ce le introduci, încearcă pagina [Probleme de statică](/ro/practice).

## Secțiunea folosită aici {#the-section-used-here}

Dacă nu se precizează altfel, toate cazurile folosesc grinda de oțel din exemplele aplicației: $E = 210$ GPa și $I_y = 8356$ cm⁴ (un IPE 300), deci

$$
EI = 210 \times 10^9 \cdot 8{,}356 \times 10^{-5} = 17\,547{,}6\ \text{kNm}^2
$$

Aria ei ($A = 1$ m²) și coeficientul de forfecare ($k = 10^{32}$) sunt atât de mari încât deformațiile axiale și cele din forfecare dispar, așa că rezultatele urmează exact formulele Euler–Bernoulli din manualul tău.

::callout{type="info" title="Barele din EduBeam sunt bare Timoshenko"}
Cu o secțiune reală, de exemplu una din biblioteca de secțiuni, barele se deformează și din forfecare. Săgețile ies atunci puțin mai mari decât cele date de formulele Euler–Bernoulli, iar la o structură static nedeterminată se modifică puțin și eforturile. Secțiunea [Deformații din forfecare](#shear-deformation) de la sfârșitul paginii arată cu cât și cum le poți elimina.
::

În fila *Rezultate*, deplasările și rotirile urmează [axele globale](/ro/elements/conventions#global-axes): un D<sub>z</sub> pozitiv este în jos, un R<sub>y</sub> pozitiv este în sens antiorar, iar deplasările sunt în metri, dacă nu schimbi unitatea din [Setări](/ro/essentials/units-settings).

## Grindă simplu rezemată, încărcare uniform distribuită {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, articulată în A și simplu rezemată în B. Nodul C de la mijlocul deschiderii îți permite să citești săgeata acolo; împărțirea unei bare printr-un nod nu schimbă niciun rezultat.

::model-figure{caption="Grindă simplu rezemată, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Mărime | Formulă | Valoare |
| --- | --- | --- |
| Reacțiuni | $qL/2$ | 36 kN |
| Forța tăietoare pe reazeme | $\pm qL/2$ | +36 kN în A, −36 kN în B |
| Momentul la mijlocul deschiderii | $qL^2/8$ | 54 kNm |
| Rotirea în A | $qL^3/(24EI)$ | 0,0061547 rad, în sens orar |
| Săgeata în C | $5qL^4/(384EI)$ | 11,540 mm, în jos |

EduBeam arată aceleași valori. În fila *Rezultate*, nodul A are R<sub>y</sub> = −0,0061547 rad (negativ: în sens orar), iar nodul C are D<sub>z</sub> = 0,01154 m (pozitiv: în jos).

## Consolă, forță la capăt {#cantilever-tip-load}

$L = 4$ m, încastrată în A, $F = 18$ kN în jos la capătul liber B.

::model-figure{caption="Consolă, 18 kN la capăt"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Mărime | Formulă | Valoare |
| --- | --- | --- |
| Reacțiunea verticală | $F$ | 18 kN |
| Momentul de încastrare | $FL$ | 72 kNm, negativ: M = −72 kNm |
| Rotirea la capăt | $FL^2/(2EI)$ | 0,0082063 rad, în sens orar |
| Săgeata la capăt | $FL^3/(3EI)$ | 21,883 mm, în jos |

În fila *Rezultate*, nodul B are R<sub>y</sub> = −0,0082063 rad și D<sub>z</sub> = 0,021883 m.

## Grindă dublu încastrată, încărcare uniform distribuită {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, ambele capete încastrate. Grinda este static nedeterminată, deci soluția depinde de rigiditate; formulele rezultă din condiția de compatibilitate ca ambele rotiri de capăt să fie nule.

::model-figure{caption="Grindă dublu încastrată, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Mărime | Formulă | Valoare |
| --- | --- | --- |
| Reacțiuni | $qL/2$ | 36 kN |
| Momentele pe reazeme | $qL^2/12$ | 36 kNm, negativ: M = −36 kNm |
| Momentul la mijlocul deschiderii | $qL^2/24$ | 18 kNm, pozitiv |
| Săgeata în C | $qL^4/(384EI)$ | 2,3080 mm, în jos |

Încastrarea capetelor ridică întreaga diagramă de moment cu $qL^2/12$: diferența totală de la reazem la mijlocul deschiderii rămâne $qL^2/8 = 54$ kNm, ca la grinda simplu rezemată. În aplicație, pornește de la modelul simplu rezemat și schimbă ambele reazeme în **Încastrare** ca să vezi ce se întâmplă.

## Grindă încastrată și simplu rezemată, încărcare uniform distribuită {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m, încastrată în A și simplu rezemată în B.

::model-figure{caption="Grindă încastrată și simplu rezemată, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Mărime | Formulă | Valoare |
| --- | --- | --- |
| Reacțiunea în încastrare | $5qL/8$ | 45 kN |
| Reacțiunea în reazemul simplu | $3qL/8$ | 27 kN |
| Momentul de încastrare | $qL^2/8$ | 54 kNm, negativ: M = −54 kNm |
| Momentul pozitiv maxim | $9qL^2/128$ | 30,375 kNm |
| … acolo unde $V = 0$ | $x = 5L/8$ | la 3,75 m de A |
| Rotirea în B | $qL^3/(48EI)$ | 0,0030773 rad, în sens antiorar |

EduBeam etichetează fiecare extrem al unei diagrame, așa că maximul pozitiv este marcat acolo unde apare. Ca să-i afli poziția, citește unde trece forța tăietoare prin zero: $V(x) = 45 - 12x = 0$ dă $x = 3{,}75$ m.

## Grindă cu zăbrele din două bare {#two-bar-truss}

Două bare urcă din articulațiile A $(0, 0)$ și B $(4, 0)$ și se întâlnesc în vârful C $(2, -2)$, cu 2 m mai sus. Ambele capete ale ambelor bare au **articulații la capete**, deci barele preiau doar forță axială. În C acționează în jos o forță verticală $F = 20$ kN.

::model-figure{caption="Grindă cu zăbrele din două bare, 20 kN în vârf"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

Fiecare bară este înclinată la 45°. Din simetrie, ambele bare preiau aceeași forță, iar echilibrul pe verticală al nodului C dă:

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14{,}142\ \text{kN}
\end{aligned}
$$

Ambele bare sunt **comprimate**. Fiecare reazem preia 10 kN pe verticală și 10 kN pe orizontală, orientate spre interior: barele împing reazemele în afară. Afișarea **N (x)** și reacțiunile arată același lucru.

## Variație de temperatură pe o grindă simplu rezemată {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0{,}3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. Fața superioară se încălzește cu 5 K, iar cea inferioară se răcește cu 5 K, deci $\Delta T_b - \Delta T_t = -10$ K, iar axa își păstrează temperatura ($\Delta T_c = 0$). O grindă simplu rezemată se poate curba liber, așa că **nu apar eforturi**, ci doar o curbură:

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0{,}3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

Fața de sus se lungește, iar cea de jos se scurtează, deci grinda se curbează **în sus**:

::model-figure{caption="Sus cu 10 K mai cald decât jos: grinda se ridică cu 3,2 mm, fără eforturi"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| Mărime | Formulă | Valoare |
| --- | --- | --- |
| Săgeata în C | $\kappa L^2/8$ | 3,2 mm, în sus: D<sub>z</sub> = −0,0032 m |
| Rotirea în A | $\kappa L/2$ | 0,0016 rad, în sens antiorar |
| Momentul încovoietor |  | 0 |

O variație uniformă $\Delta T_c$ doar ar lungi grinda, ceea ce reazemul simplu permite: nici ea nu produce eforturi.

Acum blochează rotirea la ambele capete (o **Încastrare** în A și o **Încastrare glisantă** în B, care permite în continuare lungirea grinzii). Curbura este împiedicată, iar în locul ei apare un moment constant pe toată deschiderea:

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547{,}6 \cdot (-4 \times 10^{-4}) = 7{,}019\ \text{kNm}
\end{aligned}
$$

Momentul este pozitiv: fața de sus, împiedicată, vrea să se lungească, așa că ajunge comprimată.

::model-figure{caption="Aceeași grindă cu ambele rotiri blocate: un moment constant de 7,019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

Variațiile de temperatură se introduc așa cum este descris în [Încărcări](/ro/essentials/loads#temperature-load); înălțimea secțiunii $h$ face parte din [secțiunea transversală](/ro/essentials/elements#cross-sections).

## Cedare de reazem {#prescribed-displacement}

Ia [grinda încastrată și simplu rezemată](#propped-cantilever-uniform-load) fără încărcare și lasă reazemul simplu din B să cedeze cu $w = 10$ mm. În EduBeam aceasta este o **deplasare impusă** D<sub>z</sub> = 0,01 m în B. Ca s-o urmeze, reazemul simplu trebuie să tragă în jos capătul consolei, iar asta încovoaie grinda:

::model-figure{caption="Grindă încastrată și simplu rezemată, B cedează cu 10 mm: reazemul simplu trage în jos cu 2,437 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| Mărime | Formulă | Valoare |
| --- | --- | --- |
| Forța din reazemul simplu | $R = 3EIw/L^3$ | 2,4372 kN, trage în jos |
| Momentul de încastrare | $RL$ | 14,623 kNm, negativ: M = −14,623 kNm |
| Rotirea în B | $3w/(2L)$ | 0,0025 rad, în sens orar |

Spre deosebire de o încărcare, o cedare de reazem produce eforturi doar acolo unde structura i se opune: aici, cu cât grinda este mai rigidă, cu atât $R$ este mai mare. O grindă simplu rezemată ar urma aceeași cedare ca un corp rigid, fără niciun efort.

Adaugă la loc încărcarea de 12 kN/m, iar rezultatele se suprapun: încastrarea preia acum $45 + 2{,}4372 = 47{,}437$ kN și $54 + 14{,}623 = 68{,}623$ kNm, iar reazemul simplu $27 - 2{,}4372 = 24{,}563$ kN. Cum se introduce o cedare de reazem este descris în [Încărcări](/ro/essentials/loads#prescribed-displacements-support-settlements).

## Deformații din forfecare {#shear-deformation}

Elementele de bară din EduBeam sunt bare **Timoshenko**: pe lângă săgeata din încovoiere, ele se deformează și din forfecare, cu o valoare determinată de rigiditatea la forfecare a secțiunii, $kGA$. Ce schimbă acest lucru depinde de structură:

- **Static determinată**: reacțiunile și eforturile rezultă doar din echilibru, deci rămân exact aceleași. Cresc numai deplasările. La o grindă simplu rezemată și la o consolă rămân neschimbate și rotirile secțiunilor; în alte locuri, de exemplu la capătul consolei unei grinzi cu consolă, se modifică și ele puțin.
- **Static nedeterminată**: eforturile depind de rigiditate, deci se modifică și ele puțin.

### O grindă simplu rezemată {#shear-simply-supported}

Grinda din [Ghidul de început](/ro/guide/quick-start#_8-check-by-hand) arată cât de mult. Este grinda simplu rezemată de mai sus, cu o secțiune reală, **IPE 200 (aprox.)** din biblioteca de secțiuni: $I_y = 1943$ cm⁴, $A = 28{,}48$ cm² și un coeficient de forfecare $k = 0{,}3933$ (ponderea inimii în arie), cu $G = 81$ GPa. Deci $EI = 4080{,}3$ kNm² și $kGA = 90\,720$ kN.

| Mărime | Formulă | Valoare |
| --- | --- | --- |
| Rotirea pe reazem | $qL^3/(24EI)$ | 0,026469 rad |
| Săgeata la mijloc, din încovoiere | $5qL^4/(384EI)$ | 49,629 mm |
| Săgeata la mijloc, din forfecare | $qL^2/(8kGA)$ | 0,59524 mm |
| Săgeata la mijloc, totală | suma | 50,224 mm, cum arată EduBeam |

Componenta din forfecare reprezintă 1,2 % din total. Rotirea pe reazem este valoarea Euler–Bernoulli, la fel ca reacțiunile și momentele.

### O consolă: bare scurte {#shear-cantilever}

La o consolă cu forța $F$ la capăt, capătul coboară cu $FL^3/(3EI)$ din încovoiere și cu $FL/(kGA)$ din forfecare. Raportul lor este

$$
\frac{\text{forfecare}}{\text{încovoiere}} = \frac{3EI}{kGA\,L^2}
$$

Cu același IPE 200 raportul este de 0,84 % pentru o consolă de 4 m, dar de 13,5 % pentru una de 1 m: deformațiile din forfecare contează la barele scurte și înalte.

### O grindă încastrată și simplu rezemată: eforturile se modifică {#shear-propped-cantilever}

[Grinda încastrată și simplu rezemată](#propped-cantilever-uniform-load) din IPE 200 este static nedeterminată, iar reazemul simplu preia acum puțin mai mult. Cu $\beta = 3EI/(kGA\,L^2) = 0{,}0037481$ pentru $L = 6$ m, condiția de compatibilitate în reazemul simplu dă

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27{,}034\ \text{kN}
$$

în loc de 27 kN, iar momentul de încastrare scade de la 54 la $qL^2/2 - R_B L = 53{,}798$ kNm. Diferența este mică aici, dar crește cu $\beta$, deci la barele scurte și înalte.

### Comparația cu teoria Euler–Bernoulli {#shear-switch-off}

Ca să compari cu formulele Euler–Bernoulli, setează câmpul **Coeficient de forfecare** al secțiunii la o valoare foarte mare, de exemplu `1e10`. Componenta din forfecare dispare atunci, iar toate cazurile de pe această pagină coincid din nou. Formularea elementului este descrisă în [teorie](/ro/elements/beam).

## Sfaturi pentru propriile verificări {#tips-for-your-own-checks}

- Urmărește **butonul unităților** din colțul din dreapta jos al zonei de desen; cele mai multe nepotriviri sunt greșeli de unități.
- Citește valorile exacte din fila **Rezultate** și din valorile afișate la cursor, nu din etichetele diagramelor. **Exportă CSV** sau **Copiază** îți dau și reacțiunile, gata de pus într-o foaie de calcul. Vezi [Rezultate și diagrame de eforturi](/ro/essentials/results#results-tab).
- Setează **Formatul numerelor** la *Automat* în Setări ca să citești `40` în loc de `4 · 10¹`.
- Folosește fereastra **Matrice de rigiditate** ca să compari un singur element cu [teoria](/ro/elements/beam) atunci când înveți metoda deplasărilor.
- Folosește **Partajează modelul** ca să trimiți un model verificat unui coleg sau profesorului.
- Ca să verifici multe cazuri deodată sau să generezi exerciții cu răspunsuri cunoscute, rulează același program de calcul din cod: [@edubeam/fem](/ro/solver) este biblioteca din spatele fiecărei valori din aplicație.
