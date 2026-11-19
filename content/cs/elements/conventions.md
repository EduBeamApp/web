---
description: "Znaménková konvence EduBeamu: osa x doprava a z dolů, kladná zatížení a posuny, lokální osy, N, V a M, koncové síly, reakce a volba os s y nahoru."
source: site
---

# Souřadný systém a znaménková konvence

Každé číslo, které EduBeam zobrazí, má znaménko. Tato stránka shrnuje, co znamená *kladný* směr u souřadnic, zatížení, posunů, vnitřních sil, koncových sil a reakcí, abyste mohli výsledky aplikace porovnat s vlastním výpočtem. Za většinou výsledků, které vypadají špatně, nakonec stojí právě znaménková konvence.

| Veličina | Kladná hodnota |
| --- | --- |
| `x`, `Dx`, `Fx` | doprava |
| `z`, `Dz`, `Fz` | **dolů** |
| `Ry`, `My` | proti směru hodinových ručiček na obrazovce |
| $N$ | tah |
| $V$ | otáčí krátkým úsekem prutu po směru hodinových ručiček |
| $M$ | tah v dolních vláknech, na straně čárkované čáry |
| Reakce | síla, kterou podpora působí na konstrukci, se znaménkem jako zatížení |

## Globální osy {#global-axes}

Model leží v rovině x–z:

- **x** je vodorovná, kladná **doprava**.
- **z** je svislá, kladná **dolů**.
- **y** míří z obrazovky k vám, takže systém je pravotočivý. Pootočení a momenty se vztahují k ose y, a proto je **kladný smysl proti směru hodinových ručiček**.

Ukazatel os v rohu plátna zobrazuje x červeně a z zeleně. Protože z míří dolů, má uzel na hlavě sloupu vysokého 3 m, jehož pata leží v `Z = 0`, souřadnici `Z = −3`. Úhly, například úhel šikmé podpory, se měří od x k z, tedy na obrazovce po směru hodinových ručiček.

Pokud dáváte přednost ose y nahoru, přepněte [konvenci zobrazení](#y-up-axes): model zůstane stejný, změní se jen čísla, která čtete a zadáváte.

## Stupně volnosti {#degrees-of-freedom}

Každý uzel má tři stupně volnosti:

| Stupeň volnosti | Význam | Kladný směr | Jednotka |
| --- | --- | --- | --- |
| `Dx` | vodorovný posun | doprava | m |
| `Dz` | svislý posun | dolů | m |
| `Ry` | pootočení | proti směru hodinových ručiček | rad |

Stejná znaménka platí pro [předepsaná posunutí](/cs/essentials/loads#prescribed-displacements-support-settlements), pro tabulku *Výsledky v uzlech* i pro hodnoty, které se ukážou, když najedete myší na uzel.

## Zatížení {#loads}

Zatížení jsou kladná ve směru kladných os. **Fx**, **Fz** a **My** jsou složky uzlového zatížení nebo osamělé síly, **fx** a **fz** složky rovnoměrného zatížení a **f₁x**, **f₂x**, **f₁z**, **f₂z** složky lichoběžníkového zatížení na začátku a na konci prvku.

| Zatížení | Kladný směr |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, doprava; při zaškrtnutém **LCS** ve směru lokální osy x prvku |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **dolů**; při zaškrtnutém **LCS** ve směru lokální osy z prvku |
| `My` | proti směru hodinových ručiček |
| `ΔTs` | oteplení střednice prutu, které ho prodlouží |
| `ΔTd − ΔTh` | dolní vlákna teplejší než horní |

Tíhové zatížení je tedy **kladné** `fz` a vítr, který tlačí levý sloup doprava, je kladné `fx`. Spojité zatížení vždy působí na metr vlastní délky prutu, a to i tehdy, když je na šikmém prutu zadané v globálních osách. Jak zadat jednotlivé typy, ukazuje stránka [Zatížení](/cs/essentials/loads#element-loads).

::model-figure{caption="Všechna zatížení jsou zde kladná: fz = 5 kN/m na A–B, Fz = 10 kN v B, My = 10 kNm v C a Fx = 10 kN v D"}
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

## Lokální osy prvku {#element-local-axes}

Každý prvek má vlastní osy:

- **lokální x** vede od počátečního uzlu prvku ke koncovému;
- **lokální z** vznikne pootočením lokální osy x o 90° **po směru hodinových ručiček na obrazovce**, tedy stejně, jako se globální x otočí do globální z. Když jdete od počátečního uzlu ke koncovému, máte lokální z po pravé ruce.

| Prvek nakreslený | Lokální z míří |
| --- | --- |
| zleva doprava | dolů: lokální a globální osy splývají |
| zprava doleva | nahoru |
| zdola nahoru | doprava |
| shora dolů | doleva |

Směr prvku udává jeho úhel $\theta$, měřený od globální osy x ke globální ose z (na obrazovce po směru hodinových ručiček). [Transformační matice](/cs/elements/beam#transformation-matrix) převádí koncové posuny mezi oběma systémy pomocí $\cos\theta$ a $\sin\theta$.

V zobrazení označuje čárkovaná čára podél každého prvku stranu jeho lokální osy +z, tedy **dolní vlákna**. Lokálními osami se řídí prvková zatížení se zaškrtnutým **LCS**, poloha osamělé síly i koncové síly. Prvek otočíte tlačítkem **Přehodit pořadí uzlů** v tabulce *Prvky* (viz [orientace prvku](/cs/essentials/elements#element-direction)).

## Vnitřní síly {#internal-forces}

Veďte řez prutem ve vzdálenosti $x$ od jeho počátečního uzlu. Na průřezu části **před** řezem, jejíž vnější normála míří ve směru lokální osy +x, jsou vnitřní síly kladné, když působí ve směru lokální +x, lokální +z a proti směru hodinových ručiček. Na protější straně řezu působí opačně.

::element-sketch{mode="internal-forces" caption="Kladné N, V a M na krátkém úseku prutu: tah, dvojice posouvajících sil otáčející úsekem po směru hodinových ručiček, kladný moment (tah v čárkovaných dolních vláknech)"}
::

Slovy:

| Veličina | Kladná znamená |
| --- | --- |
| $N$ | tah |
| $V$ | otáčí krátkým úsekem prutu po směru hodinových ručiček: u prutu nakresleného zleva doprava míří na levém konci úseku nahoru a na pravém dolů |
| $M$ | **tah v dolních vláknech**, na čárkované straně |

Pro spojité zatížení $q_x$ a $q_z$ v lokálních osách platí Schwedlerovy vztahy

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

V místě osamělého zatížení $F_x$, $F_z$ nebo $M_y$ (v lokálních osách) se vnitřní síly mění skokem o $\Delta N = -F_x$, $\Delta V = -F_z$ a $\Delta M = -M_y$: síla ve směru lokální osy +z posouvající sílu $V$ sníží a moment proti směru hodinových ručiček sníží $M$.

Prostý nosník s tíhovým zatížením má proto kladný moment, kladnou posouvající sílu u levé podpory a zápornou u pravé. Nosník níže je navíc v posuvném kloubu tažen, takže jeho normálová síla je kladná.

::model-figure{caption="Prostý nosník, 10 kN/m a tah 20 kN: M = +45 kNm uprostřed rozpětí, V = +30 kN u levé podpory a −30 kN u pravé, N = +20 kN"}
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

Konzola má moment opačného znaménka: tažená vlákna jsou nahoře. Osová tlaková síla namáhá prut tlakem.

::model-figure{caption="Konzola se silou 10 kN na volném konci a tlakovou silou 15 kN: M = −40 kNm ve vetknutí, V = +10 kN, N = −15 kN"}
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

V rámu je dolní stranou každého prutu jeho lokální strana +z, takže o tom, která strana sloupu je „dolní“, rozhoduje pořadí, v jakém ho nakreslíte. Tento rám je nakreslený A → B → C → D, takže lokální osa z všech prutů míří dovnitř: kladný moment znamená tah na vnitřní straně rámu a záporné momenty v rozích tah na vnější straně.

::model-figure{caption="Dvoukloubový rám nakreslený A → B → C → D: lokální osa z všech tří prutů míří dovnitř rámu"}
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

Průběhy se kreslí tak, jak je kreslí většina evropských kurzů: $M$ na tažené straně, $N$ a $V$ kladné na straně odvrácené od čárkované čáry. V **Nastavení → Nastavení zobrazení → Průběhy vnitřních sil** můžete $M$ kreslit na tlačené straně a $N$ či $V$ na čárkované straně. Mění se tím jen kresba, nikdy hodnoty: znaménko čtěte z popisku, ne podle strany, na kterou se průběh vykreslil.

## Koncové síly (tabulka Výsledky na prvcích) {#end-forces-element-results-table}

Tabulka *Výsledky na prvcích* uvádí pro každý prvek šest **koncových sil** v jeho **lokálních** osách:

::element-sketch{mode="end-forces" caption="Šest koncových sil, všechny nakreslené v kladném smyslu: ve směru lokálních os x a z a proti směru hodinových ručiček"}
::

| Sloupec | Působí na prvek v | Kladný směr |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | jeho počátečním uzlu | lokální +x, lokální +z, proti směru hodinových ručiček |
| `X21`, `Z21`, `M21` | jeho koncovém uzlu | lokální +x, lokální +z, proti směru hodinových ručiček |

Jsou to síly, kterými na prvek působí uzly: součin matice tuhosti prvku a jeho koncových posunů plus síly, které by prvková zatížení přenesly, kdyby byly oba konce prvku vetknuté (primární koncové síly),

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

kde $\mathbf{d}_l$ jsou koncové posuny prvku v lokálních osách a $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ ekvivalentní uzlová zatížení od jeho [prvkových zatížení](/cs/elements/beam#element-loads).

Koncové síly se řídí osami, ne konvencí $N$–$V$–$M$, takže v počátečním uzlu mají opačné znaménko:

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

U prostého nosníku výše: `X12 = −20 kN` a `X21 = +20 kN` (tah), `Z12 = Z21 = −30 kN` (obě podpory tlačí nahoru, tedy ve směru −z) a `M12 = M21 = 0`.

V každém uzlu dají koncové síly prvků, které se v něm stýkají, po transformaci do globálních os dohromady uzlové zatížení plus reakci. To je rychlá kontrola rovnováhy styčníku.

## Reakce {#reactions}

Reakce je síla nebo moment, kterým podpora působí **na konstrukci**, jedna pro každý podepřený stupeň volnosti. Má znaménko jako zatížení: kladná je ve směru +x, +z (dolů) a proti směru hodinových ručiček. Podpora nesoucí tíhové zatížení má proto **zápornou** `Rz`.

Reakce jsou v globálních osách, nebo v osách uzlu, má-li uzel zadané **Pootočení systému souřadnic** ([šikmá podpora](/cs/essentials/nodes-supports#inclined-skewed-supports)). Na výkresu je každá reakce znázorněna šipkou ve směru, kterým podpora působí, s popiskem velikosti. Hodnoty se znaménkem najdete v exportu CSV jako `Rx`, `Rz` a `My`.

## Osy s y nahoru {#y-up-axes}

**Nastavení → Jazyk a prostředí → Souřadnicový systém → x doprava, y nahoru** přepne vše, co zadáváte a čtete, do učebnicového systému: **x** doprava, **y** nahoru a **z** k vám. Model, uložené soubory i výkresy zůstanou úplně stejné; mění se jen čísla a písmena:

| Veličina | x doprava, z dolů (výchozí) | x doprava, y nahoru |
| --- | --- | --- |
| Svislá souřadnice | `Z` | `Y`, opačné znaménko |
| Svislá zatížení, posuny, reakce, koncové síly | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, opačné znaménko |
| Pootočení a momenty | `Ry`, `My` | `Rz`, `Mz`, stejné znaménko (kladné proti směru hodinových ručiček) |
| Úhel podpory | měřený po směru hodinových ručiček | měřený proti směru hodinových ručiček, opačné znaménko |
| Vnitřní síly | $N$, $V$, $M$ | stejné, se stejnými znaménky a stejně kreslené |

V osách s y nahoru je tedy tíhové zatížení **záporné** `fy` a hlava sloupu vysokého 3 m má `Y = 3`.

## Jednotky {#units}

Řešič pracuje všude v SI: m, N, Pa, rad a pro změny teploty K. Zobrazované jednotky ze stránky [Jednotky a nastavení](/cs/essentials/units-settings) mění jen to, co zadáváte a čtete, nikdy model.
