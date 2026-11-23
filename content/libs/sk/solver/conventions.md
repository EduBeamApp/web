---
title: Jednotky a znamienka
description: "Jednotky, osi, stupne voľnosti a znamienková konvencia knižnice @edubeam/fem a to, ako orientácia prvku mení znamienko jeho výsledkov."
order: 2
source: site
---

# Jednotky a znamienka {#units-and-signs}

Riešič nemá vlastnú sústavu jednotiek: počíta s číslami, ktoré mu dáte. Ak zadáte všetko v SI, dostanete v SI aj všetky výsledky. Príklady na týchto stránkach aj aplikácia EduBeam tak postupujú vždy. Znamienka sú rovnaké ako v aplikácii; jej teoretická príručka ich aj s obrázkami vysvetľuje na stránke [Súradný systém a znamienková konvencia](/sk/elements/conventions).

## Jednotky {#units}

| Veličina | Jednotka | Príklad |
| --- | --- | --- |
| Súradnice, dĺžky, polohy na prvku | m | `[6, 0, 0]` |
| Sily | N | `20e3` pre 20 kN |
| Momenty | N·m | `10e3` pre 10 kNm |
| Spojité zaťaženie | N/m | `12e3` pre 12 kN/m |
| Modul pružnosti a šmykový modul | Pa | `210e9` |
| Plocha | m² | `28.5e-4` pre 28,5 cm² |
| Moment zotrvačnosti | m⁴ | `1943e-8` pre 1943 cm⁴ |
| Zmena teploty | K | `20` |
| Súčiniteľ teplotnej rozťažnosti | 1/K | `12e-6` |
| Posunutia, pootočenia | m, rad | `0.01` pre 10 mm |

Funguje akákoľvek konzistentná sústava, napríklad kN, m a kPa, s ktorou vyjdú výsledky v kN a kNm. S jednotkami SI však nemusíte nič strážiť.

## Osi {#axes}

- **x** smeruje doprava, **z smeruje nadol** a model leží v rovine x–z. Súradnice sa zapisujú ako `[x, y, z]` s `y = 0`.
- **y** smeruje k vám, von z obrazovky. Pootočenia a momenty sú okolo osi y, takže kladné sú na obrazovke **proti smeru hodinových ručičiek**.
- **Lokálna os x** prvku vedie od jeho prvého uzla k druhému. Jeho **lokálna os z** je lokálna os x pootočená na obrazovke o 90° v smere hodinových ručičiek: pri prvku zadanom zľava doprava smeruje nadol.

Keďže z smeruje nadol, tiažové zaťaženie je kladné `fz` a hlava stĺpa vysokého 4 m, ktorý stojí v $z = 0$, leží v $z = -4$.

## Stupne voľnosti {#degrees-of-freedom}

Každý uzol modelu z prvkov `Beam2D` má tri stupne voľnosti, pomenované výčtom `DofID`:

| `DofID` | Hodnota | Význam |
| --- | --- | --- |
| `DofID.Dx` | 0 | Posunutie v smere x |
| `DofID.Dz` | 2 | Posunutie v smere z, nadol |
| `DofID.Ry` | 4 | Pootočenie okolo y, proti smeru hodinových ručičiek |

`Dy`, `Rx` a `Rz` (1, 3, 5) vo výčte existujú, ale rovinné prvky ich nepoužívajú.

## Znamienka výsledkov {#signs-of-the-results}

| Výsledok | Kladná hodnota znamená | Metóda |
| --- | --- | --- |
| Normálová sila N | ťah | `computeNormalForceAt` |
| Ohybový moment M | ťah na strane lokálnej +z: pri nosníku zadanom zľava doprava ťah dole | `computeBendingMomentAt` |
| Priečna sila V | M rastie v smere lokálnej osi x, $V = dM/dx$; pri nosníku zadanom zľava doprava otáča úsekom v smere hodinových ručičiek: $+qL/2$ pri ľavej podpere prostého nosníka | `computeShearForceAt` |
| Priehyb w | v smere lokálnej +z: pri nosníku zadanom zľava doprava nadol | `computeLocalDefl` |
| Posunutie uzla | v smere +x, +z (nadol), proti smeru hodinových ručičiek | `node.getUnknowns` |
| Reakcia | sila, ktorou podpera pôsobí na konštrukciu, v smere +x, +z (nadol), proti smeru hodinových ručičiek | `node.getReactions` |
| Koncové sily | sily, ktorými uzly pôsobia na prvok, v jeho lokálnych osiach | `computeEndForces` |

V pevnom kĺbe nosníka zaťaženého nadol preto dostanete reakciu −36 000 N v smere z, teda 36 kN pôsobiacich nahor.

## Polohy na prvku {#positions-along-a-member}

Všetky metódy `…At(lc, x)` berú `x` v metroch od prvého uzla prvku, nie ako pomernú časť jeho dĺžky. Rovnako sa na prvku umiestňujú aj osamelé sily.

## Orientácia prvku {#member-direction}

M a w sa merajú vo vlastných osiach prvku, takže na poradí jeho dvoch uzlov záleží. Vezmime nosník s 12 kN/m zo stránky [Začíname](/sk/solver/getting-started) a zadajme ho oboma smermi, so zaťažením v globálnych osiach, `[0, 12e3], false`, aby v oboch prípadoch tlačilo nadol. Výsledky prečítame pomocou `computeBendingMomentAt(lc, 3)`, `computeLocalDefl(lc, 2).w[1]` a `computeShearForceAt`:

| Prvok | M v strede rozpätia | w v strede rozpätia | V v A |
| --- | --- | --- | --- |
| `['A', 'B']`, zľava doprava | +54 000 N·m | +0,0499 m | +36 000 N, v `x = 0` |
| `['B', 'A']`, sprava doľava | −54 000 N·m | −0,0499 m | +36 000 N, v `x = 6` |

Pri zadaní sprava doľava smeruje lokálna os z nahor, takže ten istý nosník prehnutý nadol vráti záporný moment a priehyb nahor. N a V majú v každom bode nosníka rovnaké znamienko ako predtým; len `x` sa meria od opačného konca. Zaťaženie zadané v lokálnych osiach (`true`) sa otáča s prvkom: pri nosníku zadanom sprava doľava tlačí `[0, 12e3], true` nahor.

::callout{type="tip" title="Zadávajte prvky tak, ako ich kreslíte"}
Nosníky zľava doprava, stĺpy zdola nahor – potom znamienka zodpovedajú učebnici. Pri stĺpe zadanom zdola nahor smeruje lokálna os z doprava, takže ťah na pravej strane je kladný moment. Ukazuje to [postup pre rám](/sk/solver/frames#things-to-notice).
::
