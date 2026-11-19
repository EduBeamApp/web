---
title: Unità e segni
description: "Unità, assi, gradi di libertà e convenzioni dei segni di @edubeam/fem, e come il verso di un’asta cambia il segno dei suoi risultati."
order: 2
source: site
---

# Unità e segni {#units-and-signs}

Il solutore non ha un proprio sistema di unità: calcola con i numeri che gli dai. Se gli dai valori SI, ogni risultato torna in SI. Gli esempi di queste pagine, e l’app EduBeam, fanno sempre così. Anche i segni sono quelli dell’app; il suo manuale teorico li spiega con delle figure in [Sistema di coordinate e convenzioni dei segni](/it/elements/conventions).

## Unità {#units}

| Grandezza | Unità | Esempio |
| --- | --- | --- |
| Coordinate, lunghezze, posizioni lungo un’asta | m | `[6, 0, 0]` |
| Forze | N | `20e3` per 20 kN |
| Momenti | N·m | `10e3` per 10 kNm |
| Carichi distribuiti | N/m | `12e3` per 12 kN/m |
| Modulo elastico e modulo di taglio | Pa | `210e9` |
| Area | m² | `28.5e-4` per 28,5 cm² |
| Momento d’inerzia | m⁴ | `1943e-8` per 1943 cm⁴ |
| Variazione di temperatura | K | `20` |
| Coefficiente di dilatazione termica | 1/K | `12e-6` |
| Spostamenti, rotazioni | m, rad | `0.01` per 10 mm |

Va bene qualsiasi sistema coerente, ad esempio kN, m e kPa, che dà i risultati in kN e kNm. Con il SI non devi controllare nulla.

## Assi {#axes}

- **x** punta a destra, **z punta in basso**, e il modello giace nel piano x–z. Le coordinate sono `[x, y, z]`, con `y = 0`.
- **y** punta verso di te, fuori dallo schermo. Rotazioni e momenti sono attorno a y, quindi un valore positivo è **antiorario** sullo schermo.
- L’**asse x locale** di un’asta va dal suo primo nodo al secondo. Il suo **asse z locale** è l’asse x locale ruotato di 90° in senso orario sullo schermo: su un’asta disegnata da sinistra a destra punta in basso.

Poiché z punta in basso, un carico gravitazionale è un `fz` positivo, e la testa di una colonna alta 4 m con il piede a $z = 0$ si trova a $z = -4$.

## Gradi di libertà {#degrees-of-freedom}

Ogni nodo di un modello `Beam2D` ha tre gradi di libertà, identificati dall’enum `DofID`:

| `DofID` | Valore | Significato |
| --- | --- | --- |
| `DofID.Dx` | 0 | Spostamento lungo x |
| `DofID.Dz` | 2 | Spostamento lungo z, verso il basso |
| `DofID.Ry` | 4 | Rotazione attorno a y, antioraria |

`Dy`, `Rx` e `Rz` (1, 3, 5) esistono nell’enum, ma le aste piane non li usano.

## Segni dei risultati {#signs-of-the-results}

| Risultato | Positivo significa | Si legge con |
| --- | --- | --- |
| Sforzo normale N | trazione | `computeNormalForceAt` |
| Momento flettente M | trazione sul lato +z locale: fibre inferiori tese, su una trave disegnata da sinistra a destra | `computeBendingMomentAt` |
| Taglio V | M cresce lungo la x locale, $V = dM/dx$; su una trave disegnata da sinistra a destra fa ruotare un concio in senso orario: $+qL/2$ sull’appoggio sinistro di una trave semplicemente appoggiata | `computeShearForceAt` |
| Freccia w | lungo la +z locale: verso il basso, su una trave disegnata da sinistra a destra | `computeLocalDefl` |
| Spostamento nodale | lungo +x, +z (verso il basso), antiorario | `node.getUnknowns` |
| Reazione | la forza che il vincolo esercita sulla struttura, lungo +x, +z (verso il basso), antioraria | `node.getReactions` |
| Forze di estremità | le forze che i nodi esercitano sull’asta, nei suoi assi locali | `computeEndForces` |

Quindi la cerniera di una trave caricata verso il basso dà una reazione di −36 000 N lungo z: 36 kN verso l’alto.

## Posizioni lungo un’asta {#positions-along-a-member}

Ogni metodo `…At(lc, x)` riceve `x` in metri dal primo nodo dell’asta, non come frazione della sua lunghezza. I carichi concentrati lungo un’asta si posizionano allo stesso modo.

## Verso dell’asta {#member-direction}

M e w si misurano negli assi propri dell’asta, quindi l’ordine dei suoi due nodi conta. Prendi la trave con 12 kN/m di [Per iniziare](/it/solver/getting-started), definita nei due versi con il carico negli assi globali, `[0, 12e3], false`, così che spinga verso il basso in entrambi i casi, e letta con `computeBendingMomentAt(lc, 3)`, `computeLocalDefl(lc, 2).w[1]` e `computeShearForceAt`:

| Asta | M in mezzeria | w in mezzeria | V in A |
| --- | --- | --- | --- |
| `['A', 'B']`, da sinistra a destra | +54 000 N·m | +0,0499 m | +36 000 N, a `x = 0` |
| `['B', 'A']`, da destra a sinistra | −54 000 N·m | −0,0499 m | +36 000 N, a `x = 6` |

Se l’asta va da destra a sinistra, la sua z locale punta in alto: la stessa trave, sempre con le fibre inferiori tese, dà un momento negativo e una freccia verso l’alto. N e V mantengono il loro segno in ogni punto della trave; cambia solo l’estremo da cui parte `x`. Un carico dato negli assi locali (`true`) ruota con l’asta: sulla trave definita da destra a sinistra, `[0, 12e3], true` spinge verso l’alto.

::callout{type="tip" title="Definisci le aste come le disegni"}
Travi da sinistra a destra, colonne dal basso verso l’alto, e i segni si leggono come sul libro di testo. Per una colonna definita dal basso verso l’alto la z locale punta a destra, quindi un momento che tende la faccia destra è positivo. Lo mostra l’[esempio del telaio](/it/solver/frames#things-to-notice).
::
