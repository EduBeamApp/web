---
title: Materiali e sezioni
description: "I parametri di materiale e sezione di @edubeam/fem, quali servono a ciascuna analisi, cosa succede se ne manca uno e come escludere la deformazione a taglio."
order: 4
source: site
---

# Materiali e sezioni {#materials-and-sections}

Le aste prendono la loro rigidezza da un materiale e da una sezione, ciascuno creato una sola volta e richiamato con la sua etichetta.

```ts
domain.createMaterial('steel', { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection('IPE200', {
  a: 28.5e-4, // m²
  iy: 1943e-8, // m⁴
  h: 0.2, // m
  k: 5 / 6,
})
```

## Materiale {#material}

| Parametro | Significato | Unità | Serve per |
| --- | --- | --- | --- |
| `e` | Modulo elastico (di Young) $E$ | Pa | sempre |
| `g` | Modulo di taglio $G$ | Pa | sempre, a meno che `k` sia enorme (nessuna deformazione a taglio) |
| `alpha` | Coefficiente di dilatazione termica $\alpha$ | 1/K | carichi termici |
| `d` | Densità $\rho$ | kg/m³ | niente, in un’analisi statica |

Un parametro omesso vale **1**, non un valore tipico, e nessun avviso te lo segnala. Se dimentichi `g` nella trave della pagina [Per iniziare](/it/solver/getting-started), la sua freccia risulta di 22 700 km.

## Sezione {#cross-section}

| Parametro | Significato | Unità | Serve per |
| --- | --- | --- | --- |
| `a` | Area $A$ | m² | sempre: rigidezza assiale e a taglio |
| `iy` | Momento d’inerzia $I_y$ | m⁴ | sempre: rigidezza flessionale |
| `k` | Coefficiente di taglio $k$ | – | sempre: rigidezza a taglio $kGA$ |
| `h` | Altezza $h$ | m | gradienti termici |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, costante torsionale | m⁴ | niente, in un modello piano |

Una sezione non ha valori predefiniti. Ometti `a`, `iy` o `k` e ogni risultato è `NaN`; ometti `h` e un gradiente termico dà `NaN`. In nessuno dei due casi compare un errore, quindi un risultato `NaN` indica quasi sempre un parametro mancante.

## Deformazione a taglio {#shear-deformation}

L’asta è una trave di Timoshenko: si deforma a taglio oltre che a flessione. Quanto, dipende da

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2},
$$

che restituisce `beam.computeShearFactor()`. Per aste snelle $\Phi$ è minuscolo e le frecce crescono di una frazione di punto percentuale. Per aste corte e alte, invece, l’effetto si fa sentire.

Per la trave di Eulero–Bernoulli delle tabelle dei libri di testo, rendi la rigidezza a taglio praticamente infinita con un coefficiente di taglio enorme, come fanno gli esempi dell’app EduBeam:

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

I programmi di esempio di queste pagine fanno così, perciò i loro risultati coincidono esattamente con le formule. Come coefficiente di taglio reale, per un rettangolo vale $k = 5/6$ (l’area a taglio è $kA$, quindi $k$ è l’inverso del fattore di taglio $\chi = 6/5$). La pagina [Verificare i risultati a mano](/it/guide/verification#shear-deformation) mostra l’entità dell’effetto.

## Aste assialmente indeformabili {#rigid-in-axial-direction}

Un’area grande rende le aste praticamente inestensibili, come di solito si assume nel calcolo a mano. Le forze interne di un telaio dipendono dall’area solo di poco; gli spostamenti di una travatura reticolare ne dipendono interamente. Le forze interne di una struttura isostatica non dipendono da alcuna rigidezza.

## Modificarli in seguito {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Ogni asta legge il suo materiale e la sua sezione quando il solutore assembla le matrici, quindi basta un nuovo `solve()`. Aste diverse possono usare sezioni diverse: dai a ciascuna la propria etichetta.
