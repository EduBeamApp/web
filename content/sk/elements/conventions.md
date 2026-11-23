---
description: "Znamienková konvencia EduBeamu: os x doprava a z nadol, kladné zaťaženia a posunutia, lokálne osi, N, V a M, koncové sily, reakcie a voľba osí s y nahor."
source: site
---

# Súradný systém a znamienková konvencia

Každé číslo, ktoré EduBeam zobrazí, má znamienko. Táto stránka zhŕňa, čo znamená *kladný* smer pri súradniciach, zaťaženiach, posunutiach, vnútorných silách, koncových silách a reakciách, aby ste mohli výsledky aplikácie porovnať s vlastným výpočtom. Za väčšinou výsledkov, ktoré vyzerajú zle, nakoniec stojí práve znamienková konvencia.

| Veličina | Kladná hodnota |
| --- | --- |
| `x`, `Dx`, `Fx` | doprava |
| `z`, `Dz`, `Fz` | **nadol** |
| `Ry`, `My` | proti smeru hodinových ručičiek na obrazovke |
| $N$ | ťah |
| $V$ | otáča krátkym úsekom prúta v smere hodinových ručičiek |
| $M$ | ťah v dolných vláknach, na strane čiarkovanej čiary |
| Reakcie | sila, ktorou podpera pôsobí na konštrukciu, so znamienkom ako zaťaženie |

## Globálne osi {#global-axes}

Model leží v rovine x–z:

- **x** je vodorovná, kladná **doprava**.
- **z** je zvislá, kladná **nadol**.
- **y** smeruje z obrazovky k vám, takže systém je pravotočivý. Pootočenia a momenty sa určujú okolo osi y, a preto je **kladný zmysel proti smeru hodinových ručičiek**.

Ukazovateľ osí v rohu plátna zobrazuje x červenou a z zelenou farbou. Keďže z smeruje nadol, má uzol na hlave stĺpa vysokého 3 m, ktorého päta leží v `Z = 0`, súradnicu `Z = −3`. Uhly, napríklad uhol šikmej podpery, sa merajú od x k z, teda na obrazovke v smere hodinových ručičiek.

Ak dávate prednosť osi y nahor, prepnite [konvenciu zobrazenia](#y-up-axes): model zostane rovnaký, zmenia sa len čísla, ktoré čítate a zadávate.

## Stupne voľnosti {#degrees-of-freedom}

Každý uzol má tri stupne voľnosti:

| Stupeň voľnosti | Význam | Kladný smer | Jednotka |
| --- | --- | --- | --- |
| `Dx` | vodorovné posunutie | doprava | m |
| `Dz` | zvislé posunutie | nadol | m |
| `Ry` | pootočenie | proti smeru hodinových ručičiek | rad |

Rovnaké znamienka platia pre [predpísané posunutia](/sk/essentials/loads#prescribed-displacements-support-settlements), pre tabuľku *Výsledky v uzloch* aj pre hodnoty, ktoré sa zobrazia, keď ukážete myšou na uzol.

## Zaťaženie {#loads}

Zaťaženia sú kladné v smere kladných osí. **Fx**, **Fz** a **My** sú zložky uzlového zaťaženia alebo osamelej sily, **fx** a **fz** zložky rovnomerného zaťaženia a **f₁x**, **f₂x**, **f₁z**, **f₂z** zložky lichobežníkového zaťaženia na začiatku a na konci prvku.

| Zaťaženie | Kladný smer |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, doprava; pri zaškrtnutom **LCS** v smere lokálnej osi x prvku |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **nadol**; pri zaškrtnutom **LCS** v smere lokálnej osi z prvku |
| `My` | proti smeru hodinových ručičiek |
| `ΔTs` | oteplenie strednice prúta, ktoré ho predĺži |
| `ΔTd − ΔTh` | dolné vlákna teplejšie ako horné |

Tiažové zaťaženie je teda **kladné** `fz` a vietor, ktorý tlačí ľavý stĺp doprava, je kladné `fx`. Spojité zaťaženie vždy pôsobí na meter vlastnej dĺžky prúta, a to aj vtedy, keď je na šikmom prúte zadané v globálnych osiach. Ako zadať jednotlivé typy, ukazuje stránka [Zaťaženie](/sk/essentials/loads#element-loads).

::model-figure{caption="Všetky zaťaženia sú tu kladné: fz = 5 kN/m na A–B, Fz = 10 kN v B, My = 10 kNm v C a Fx = 10 kN v D"}
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

## Lokálne osi prvku {#element-local-axes}

Každý prvok má vlastné osi:

- **lokálna x** vedie od počiatočného uzla prvku ku koncovému;
- **lokálna z** vznikne pootočením lokálnej osi x o 90° **v smere hodinových ručičiek na obrazovke**, teda rovnako, ako sa globálna x otočí do globálnej z. Keď idete od počiatočného uzla ku koncovému, máte lokálnu z po pravej ruke.

| Prvok nakreslený | Lokálna z smeruje |
| --- | --- |
| zľava doprava | nadol: lokálne a globálne osi splývajú |
| sprava doľava | nahor |
| zdola nahor | doprava |
| zhora nadol | doľava |

Smer prvku udáva jeho uhol $\theta$, meraný od globálnej osi x ku globálnej osi z (na obrazovke v smere hodinových ručičiek). [Transformačná matica](/sk/elements/beam#transformation-matrix) prevádza koncové posunutia medzi oboma systémami pomocou $\cos\theta$ a $\sin\theta$.

V zobrazení označuje čiarkovaná čiara pozdĺž každého prvku stranu jeho lokálnej osi +z, teda **dolné vlákna**. Lokálnymi osami sa riadia prvkové zaťaženia so zaškrtnutým **LCS**, poloha osamelej sily aj koncové sily. Prvok otočíte tlačidlom **Vymeniť poradie uzlov** v tabuľke *Prvky* (pozrite [Orientácia prvku](/sk/essentials/elements#element-direction)).

## Vnútorné sily {#internal-forces}

Veďte rez prútom vo vzdialenosti $x$ od jeho počiatočného uzla. Na priereze časti **pred** rezom, ktorej vonkajšia normála smeruje v smere lokálnej osi +x, sú vnútorné sily kladné, keď pôsobia v smere lokálnej +x, lokálnej +z a proti smeru hodinových ručičiek. Na protiľahlej strane rezu pôsobia opačne.

::element-sketch{mode="internal-forces" caption="Kladné N, V a M na krátkom úseku prúta: ťah, dvojica priečnych síl otáčajúca úsekom v smere hodinových ručičiek, kladný moment (ťah v čiarkovaných dolných vláknach)"}
::

Slovami:

| Veličina | Kladná znamená |
| --- | --- |
| $N$ | ťah |
| $V$ | otáča krátkym úsekom prúta v smere hodinových ručičiek: pri prúte nakreslenom zľava doprava smeruje na ľavom konci úseku nahor a na pravom nadol |
| $M$ | **ťah v dolných vláknach**, na čiarkovanej strane |

Pre spojité zaťaženie $q_x$ a $q_z$ v lokálnych osiach platia Schwedlerove vzťahy

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

V mieste osamelého zaťaženia $F_x$, $F_z$ alebo $M_y$ (v lokálnych osiach) sa vnútorné sily menia skokom o $\Delta N = -F_x$, $\Delta V = -F_z$ a $\Delta M = -M_y$: sila v smere lokálnej osi +z priečnu silu $V$ zníži a moment proti smeru hodinových ručičiek zníži $M$.

Prostý nosník s tiažovým zaťažením má preto kladný moment, kladnú priečnu silu pri ľavej podpere a zápornú pri pravej. Nosník nižšie je navyše v posuvnom kĺbe ťahaný, takže jeho normálová sila je kladná.

::model-figure{caption="Prostý nosník, 10 kN/m a ťah 20 kN: M = +45 kNm v strede rozpätia, V = +30 kN pri ľavej podpere a −30 kN pri pravej, N = +20 kN"}
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

Konzola má moment opačného znamienka: ťahané vlákna sú hore. Osová tlaková sila prút stláča.

::model-figure{caption="Konzola so silou 10 kN na voľnom konci a tlakovou silou 15 kN: M = −40 kNm vo votknutí, V = +10 kN, N = −15 kN"}
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

V ráme je dolnou stranou každého prúta jeho lokálna strana +z, takže o tom, ktorá strana stĺpa je „dolná“, rozhoduje poradie, v akom ho nakreslíte. Tento rám je nakreslený A → B → C → D, takže lokálna os z všetkých prútov smeruje dovnútra: kladný moment znamená ťah na vnútornej strane rámu a záporné momenty v rohoch ťah na vonkajšej strane.

::model-figure{caption="Dvojkĺbový rám nakreslený A → B → C → D: lokálna os z všetkých troch prútov smeruje dovnútra rámu"}
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

Priebehy sa kreslia tak, ako je zvykom na väčšine európskych vysokých škôl: $M$ na ťahanej strane, $N$ a $V$ kladné na strane odvrátenej od čiarkovanej čiary. V časti **Nastavenia → Nastavenia zobrazenia → Priebehy vnútorných síl** môžete $M$ kresliť na tlačenej strane a $N$ či $V$ na čiarkovanej strane. Mení sa tým len kresba, nikdy hodnoty: znamienko čítajte z popisu, nie podľa strany, na ktorú sa priebeh vykreslil.

## Koncové sily (tabuľka Výsledky na prvkoch) {#end-forces-element-results-table}

Tabuľka *Výsledky na prvkoch* uvádza pre každý prvok šesť **koncových síl** v jeho **lokálnych** osiach:

::element-sketch{mode="end-forces" caption="Šesť koncových síl, všetky nakreslené v kladnom zmysle: v smere lokálnych osí x a z a proti smeru hodinových ručičiek"}
::

| Stĺpec | Pôsobí na prvok v | Kladný smer |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | jeho počiatočnom uzle | lokálna +x, lokálna +z, proti smeru hodinových ručičiek |
| `X21`, `Z21`, `M21` | jeho koncovom uzle | lokálna +x, lokálna +z, proti smeru hodinových ručičiek |

Sú to sily, ktorými na prvok pôsobia uzly: súčin matice tuhosti prvku a jeho koncových posunutí plus sily, ktoré by prvkové zaťaženia preniesli, keby boli oba konce prvku votknuté (primárne koncové sily),

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

kde $\mathbf{d}_l$ sú koncové posunutia prvku v lokálnych osiach a $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ ekvivalentné uzlové zaťaženia od jeho [prvkových zaťažení](/sk/elements/beam#element-loads).

Koncové sily sa riadia osami, nie konvenciou $N$–$V$–$M$, takže v počiatočnom uzle majú opačné znamienko:

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

Pri prostom nosníku vyššie: `X12 = −20 kN` a `X21 = +20 kN` (ťah), `Z12 = Z21 = −30 kN` (obe podpery tlačia nahor, teda v smere −z) a `M12 = M21 = 0`.

V každom uzle dajú koncové sily prvkov, ktoré sa v ňom stretávajú, po transformácii do globálnych osí spolu uzlové zaťaženie plus reakciu. To je rýchla kontrola rovnováhy uzla.

## Reakcie {#reactions}

Reakcia je sila alebo moment, ktorým podpera pôsobí **na konštrukciu**, jedna pre každý podopretý stupeň voľnosti. Má znamienko ako zaťaženie: kladná je v smere +x, +z (nadol) a proti smeru hodinových ručičiek. Podpera nesúca tiažové zaťaženie má preto **zápornú** `Rz`.

Reakcie sú v globálnych osiach, alebo v osiach uzla, ak má uzol zadané **Pootočenie súradného systému** ([šikmá podpera](/sk/essentials/nodes-supports#inclined-skewed-supports)). Na výkrese je každá reakcia znázornená šípkou v smere, ktorým podpera pôsobí, s popisom veľkosti. Hodnoty so znamienkom nájdete v exporte CSV ako `Rx`, `Rz` a `My`.

## Osi s y nahor {#y-up-axes}

**Nastavenia → Jazyk a prostredie → Súradný systém → x doprava, y nahor** prepne všetko, čo zadávate a čítate, do učebnicového systému: **x** doprava, **y** nahor a **z** k vám. Model, uložené súbory aj výkresy zostanú úplne rovnaké; menia sa len čísla a písmená:

| Veličina | x doprava, z nadol (predvolené) | x doprava, y nahor |
| --- | --- | --- |
| Zvislá súradnica | `Z` | `Y`, opačné znamienko |
| Zvislé zaťaženia, posunutia, reakcie, koncové sily | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, opačné znamienko |
| Pootočenia a momenty | `Ry`, `My` | `Rz`, `Mz`, rovnaké znamienko (kladné proti smeru hodinových ručičiek) |
| Uhol podpery | meraný v smere hodinových ručičiek | meraný proti smeru hodinových ručičiek, opačné znamienko |
| Vnútorné sily | $N$, $V$, $M$ | rovnaké, s rovnakými znamienkami a rovnako kreslené |

V osiach s y nahor je teda tiažové zaťaženie **záporné** `fy` a hlava stĺpa vysokého 3 m má `Y = 3`.

## Jednotky {#units}

Riešič pracuje všade v SI: m, N, Pa, rad a pre zmeny teploty K. Zobrazované jednotky zo stránky [Jednotky a nastavenia](/sk/essentials/units-settings) menia len to, čo zadávate a čítate, nikdy model.
