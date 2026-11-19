---
title: Jednotky a znaménka
description: "Jednotky, osy, stupně volnosti a znaménková konvence knihovny @edubeam/fem a to, jak orientace prvku mění znaménko jeho výsledků."
order: 2
---

# Jednotky a znaménka {#units-and-signs}

Řešič nemá vlastní soustavu jednotek: počítá s čísly, která mu dáte. Zadáte-li vše v SI, dostanete v SI i všechny výsledky. Příklady na těchto stránkách i aplikace EduBeam tak postupují vždy. Znaménka jsou stejná jako v aplikaci; její teoretický manuál je i s obrázky vysvětluje na stránce [Souřadný systém a znaménková konvence](/cs/elements/conventions).

## Jednotky {#units}

| Veličina | Jednotka | Příklad |
| --- | --- | --- |
| Souřadnice, délky, polohy na prvku | m | `[6, 0, 0]` |
| Síly | N | `20e3` pro 20 kN |
| Momenty | N·m | `10e3` pro 10 kNm |
| Spojitá zatížení | N/m | `12e3` pro 12 kN/m |
| Modul pružnosti a modul pružnosti ve smyku | Pa | `210e9` |
| Plocha | m² | `28.5e-4` pro 28,5 cm² |
| Moment setrvačnosti | m⁴ | `1943e-8` pro 1943 cm⁴ |
| Změna teploty | K | `20` |
| Součinitel teplotní roztažnosti | 1/K | `12e-6` |
| Posuny, pootočení | m, rad | `0.01` pro 10 mm |

Funguje jakákoli konzistentní soustava, například kN, m a kPa, se kterou vyjdou výsledky v kN a kNm. S jednotkami SI si ale nemusíte nic hlídat.

## Osy {#axes}

- **x** míří doprava, **z míří dolů** a model leží v rovině x–z. Souřadnice se zapisují jako `[x, y, z]` s `y = 0`.
- **y** míří k vám, ven z obrazovky. Pootočení a momenty se vztahují k ose y, takže kladné působí na obrazovce **proti směru hodinových ručiček**.
- **Lokální osa x** prvku vede od jeho prvního uzlu k druhému. Jeho **lokální osa z** je lokální osa x pootočená na obrazovce o 90° po směru hodinových ručiček: u prvku zadaného zleva doprava míří dolů.

Protože z míří dolů, je tíhové zatížení kladné `fz` a hlava sloupu vysokého 4 m, který stojí v $z = 0$, leží v $z = -4$.

## Stupně volnosti {#degrees-of-freedom}

Každý uzel modelu z prvků `Beam2D` má tři stupně volnosti, pojmenované výčtem `DofID`:

| `DofID` | Hodnota | Význam |
| --- | --- | --- |
| `DofID.Dx` | 0 | Posun ve směru x |
| `DofID.Dz` | 2 | Posun ve směru z, dolů |
| `DofID.Ry` | 4 | Pootočení kolem y, proti směru hodinových ručiček |

`Dy`, `Rx` a `Rz` (1, 3, 5) ve výčtu existují, ale rovinné prvky je nepoužívají.

## Znaménka výsledků {#signs-of-the-results}

| Výsledek | Kladná hodnota znamená | Metoda |
| --- | --- | --- |
| Normálová síla N | tah | `computeNormalForceAt` |
| Ohybový moment M | tah na straně lokální +z: u nosníku zadaného zleva doprava tah dole | `computeBendingMomentAt` |
| Posouvající síla V | M roste ve směru lokální osy x, $V = dM/dx$; u nosníku zadaného zleva doprava otáčí úsekem po směru hodinových ručiček: $+qL/2$ u levé podpory prostého nosníku | `computeShearForceAt` |
| Průhyb w | ve směru lokální +z: u nosníku zadaného zleva doprava dolů | `computeLocalDefl` |
| Posun uzlu | ve směru +x, +z (dolů), proti směru hodinových ručiček | `node.getUnknowns` |
| Reakce | síla, kterou podpora působí na konstrukci, ve směru +x, +z (dolů), proti směru hodinových ručiček | `node.getReactions` |
| Koncové síly | síly, kterými uzly působí na prvek, v jeho lokálních osách | `computeEndForces` |

Kloub nosníku zatíženého směrem dolů proto vrátí reakci −36 000 N ve směru z, tedy 36 kN směrem nahoru.

## Polohy na prvku {#positions-along-a-member}

Všechny metody `…At(lc, x)` berou `x` v metrech od prvního uzlu prvku, ne jako poměrnou část jeho délky. Stejně se na prvku umisťují i osamělá zatížení.

## Orientace prvku {#member-direction}

M a w se měří ve vlastních osách prvku, takže na pořadí jeho dvou uzlů záleží. Vezměme nosník s 12 kN/m ze stránky [Začínáme](/cs/solver/getting-started) a zadejme ho oběma směry, se zatížením v globálních osách, `[0, 12e3], false`, aby v obou případech tlačilo dolů. Výsledky přečteme pomocí `computeBendingMomentAt(lc, 3)`, `computeLocalDefl(lc, 2).w[1]` a `computeShearForceAt`:

| Prvek | M uprostřed rozpětí | w uprostřed rozpětí | V v A |
| --- | --- | --- | --- |
| `['A', 'B']`, zleva doprava | +54 000 N·m | +0,0499 m | +36 000 N, v `x = 0` |
| `['B', 'A']`, zprava doleva | −54 000 N·m | −0,0499 m | +36 000 N, v `x = 6` |

Při zadání zprava doleva míří lokální osa z nahoru, takže tentýž nosník prohnutý dolů vrátí záporný moment a průhyb nahoru. N a V mají v každém bodě nosníku stejné znaménko jako předtím; jen `x` se měří od opačného konce. Zatížení zadané v lokálních osách (`true`) se otáčí s prvkem: u nosníku zadaného zprava doleva tlačí `[0, 12e3], true` nahoru.

::callout{type="tip" title="Zadávejte prvky tak, jak je kreslíte"}
Nosníky zleva doprava, sloupy zdola nahoru – pak znaménka odpovídají učebnici. U sloupu zadaného zdola nahoru míří lokální osa z doprava, takže tah na pravé straně je kladný moment. Ukazuje to [postup pro rám](/cs/solver/frames#things-to-notice).
::
