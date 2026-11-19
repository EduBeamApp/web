---
description: "Síly, momenty, poklesy podpor, rovnoměrné, lineárně proměnné, osamělé i teplotní zatížení v EduBeamu a jejich znaménka: z míří dolů, moment je kladný proti směru hodinových ručiček."
source: site
---

# Zatížení

Zatížení působí v uzlech nebo po délce prvků. Všechna patří do **jediného zatěžovacího stavu** a působí současně; chcete-li porovnat různé varianty, uložte každou jako samostatný [soubor projektu nebo sdílený odkaz](/cs/essentials/import-export).

| Zatížení | Působí na | Kde ho přidáte |
| --- | --- | --- |
| [Síla nebo moment](#nodal-loads) | uzel | Záložka *Zatížení* → **Přidat uzlové zatížení**, nebo klikněte na uzel → **Přidat zatížení** |
| [Předepsané posunutí](#prescribed-displacements-support-settlements) (pokles podpory) | podepřený uzel | Stejný dialog, nebo klikněte na uzel → **Předepsat posunutí** |
| [Spojité rovnoměrné zatížení](#uniformly-distributed-load), [lineárně proměnné zatížení](#trapezoidal-load), [osamělá síla](#concentrated-load) nebo [změna teploty](#temperature-load) | prvek | Záložka *Zatížení* → **Přidat prvkové zatížení**, nebo klikněte na prvek → **Přidat zatížení** |

## Znaménková konvence {#sign-convention-in-one-line}

Osa x míří **doprava**, osa z **dolů** a momenty jsou kladné **proti směru hodinových ručiček**. Kladná síla `Fz` nebo zatížení `fz` tedy míří dolů jako tíha a zatížení nahoru je záporné.

::model-figure{caption="Všechna zatížení jsou kladná: Fx = +10 kN doprava, Fz = +10 kN dolů, My = +10 kNm proti směru hodinových ručiček"}
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

| Kladný směr | Výchozí osy (z dolů) | [Osy s y nahoru](/cs/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Vodorovná síla `Fx`, `fx` | doprava | doprava |
| Svislá síla | `Fz`, `fz`: **dolů** | `Fy`, `fy`: **nahoru** |
| Moment | `My`: proti směru hodinových ručiček | `Mz`: proti směru hodinových ručiček |
| Svislý pokles podpory | `Dz`: dolů | `Dy`: nahoru |

Zatížení v **lokálních osách** prvku (zaškrtnuté LCS) se naopak řídí prvkem: lokální osa x vede od počátečního ke koncovému uzlu a lokální osa z je lokální osa x pootočená o 90° ve směru hodinových ručiček, směrem k čárkované čáře podél prvku. Viz [Orientace prvku](/cs/essentials/elements#element-direction). Úplnou konvenci, včetně vnitřních sil, najdete v kapitole [Souřadný systém a znaménková konvence](/cs/elements/conventions#loads).

## Uzlová zatížení {#nodal-loads}

Záložka *Zatížení* → **Přidat uzlové zatížení**, nebo klikněte na uzel → **Přidat zatížení**, a nechte vybranou volbu **Síla/moment**. Zadejte síly `Fx`, `Fz` (kN) a moment `My` (kNm) se znaménky podle [konvence výše](#sign-convention-in-one-line); náhled vykresluje zatížení už během psaní.

![Přidat uzlové zatížení: náhled ukazuje směr už během psaní](/screenshots/cs/loads-nodal.webp){.shot-md}

- Složky jsou v **globálních** osách. V uzlu s pootočenými osami ([šikmá podpora](/cs/essentials/nodes-supports#inclined-skewed-supports)) přibude v dialogu přepínač **Globální osy** / **Osy uzlu**. Složky zadané v osách uzlu (označené `Fx′` a `Fz′`) působí ve vlastních osách uzlu a pootočí se s nimi, když se úhel později změní. Přepnutím se hodnoty přepočtou tak, aby se zatížení nezměnilo.
- V jednom uzlu může působit více uzlových zatížení; sečtou se.

### Předepsaná posunutí (poklesy podpor) {#prescribed-displacements-support-settlements}

Chcete-li podporu posunout o zadanou hodnotu, zvolte ve stejném dialogu **Předepsané posunutí**, nebo klikněte na podepřený uzel → **Předepsat posunutí**. Zadejte posuny `Dx`, `Dz` (kladné doprava a dolů, v [jednotce posunu](/cs/essentials/units-settings#units), výchozí jsou metry) a pootočení `Ry` (rad, kladné proti směru hodinových ručiček).

- Předepsat lze jen **podepřené** stupně volnosti: ostatní pole jsou neaktivní a uzel bez podpory pokles mít nemůže vůbec.
- Uzel má nejvýše jedno předepsané posunutí. Chcete-li ho změnit, upravte to stávající, místo abyste přidávali druhé.
- U šikmé podpory jsou pole označena `Dx′` a `Dz′`: pokles působí ve vlastních osách podpory.

Zda pokles podpory vyvolá vnitřní síly, záleží na konstrukci. Stejný pokles podpory B o 10 mm, bez dalšího zatížení:

::div{.shots}

:::model-figure{caption="Prostý nosník: nosník se jen nakloní; žádné reakce, M = 0"}
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

:::model-figure{caption="Spojitý nosník přes podporu B: nosník se ohne, nad B je M = 21,06 kNm"}
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

Staticky určitá konstrukce se poklesu podpory bez odporu přizpůsobí. Spojitý nosník se ale ohnout musí: podpora B ho stáhne dolů o $\delta = 10\ \text{mm}$, jako by uprostřed prostého nosníku o rozpětí 10 m působila osamělá síla. Při $L = 5\ \text{m}$ a $EI = 17\,548\ \text{kNm}^2$ oceli z příkladu je tato síla $P = 6EI\delta/L^3 = 8{,}423\ \text{kN}$, což je reakce v B, a $M_B = PL/2 = 3EI\delta/L^2 = 21{,}06\ \text{kNm}$. Pokles podpory v kombinaci s dalším zatížením ukazuje [návod ke spojitému nosníku](/cs/tutorials/continuous-beam).

## Prvková zatížení {#element-loads}

Záložka *Zatížení* → **Přidat prvkové zatížení**, nebo klikněte na prvek → **Přidat zatížení**. Vyberte **Typ zatížení**; náhled ukazuje zatížení na prvku už během psaní. Síly jsou v kN a spojitá zatížení v kN/m, případně v [jednotkách](/cs/essentials/units-settings#units), které jste si zvolili.

![Přidat prvkové zatížení se spojitým rovnoměrným zatížením](/screenshots/cs/loads-udl.webp){.shot-md}

### Spojité rovnoměrné zatížení {#uniformly-distributed-load}

Konstantní zatížení na jednotku délky, `fx` a `fz`, po celém prvku. Se zaškrtnutým **LCS** (výchozí stav) působí v lokálních osách prvku, bez něj v globálních osách. U vodorovného prvku nakresleného zleva doprava je to totéž, u šikmého prvku ne:

| Potřebujete | Zadejte |
| --- | --- |
| zatížení **kolmé** na prvek (vítr na krokev) | `fz` se **zaškrtnutým** LCS |
| **svislé** zatížení na metr délky prvku (vlastní tíha) | `fz` s **nezaškrtnutým** LCS |
| **svislé** zatížení na metr vodorovného průmětu (sníh) | přímo zadat nelze: vynásobte ho $\cos\alpha$, kde $\alpha$ je sklon prvku, a zadejte ho jako svislé zatížení |

Totéž zatížení 10 kN/m na krokvi dlouhé 5 m, která má vodorovný průmět 4 m a převýšení 3 m:

::div{.shots}

:::model-figure{caption="LCS nezaškrtnuto: svislé zatížení, celkem 50 kN; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="LCS zaškrtnuto: zatížení kolmé na prvek; M = 31,25 kNm"}
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

Ruční výpočet: pro kolmé zatížení je $M = qL^2/8 = 10 \cdot 5^2/8 = 31{,}25\ \text{kNm}$; svislých 50 kN rozložených na 4 m rozpětí dává 12,5 kN/m průmětu, takže $M = 12{,}5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Lineárně proměnné (lichoběžníkové) zatížení {#trapezoidal-load}

Zatížení, které se po délce prvku mění lineárně: `f1x`, `f1z` v **počátečním** uzlu, `f2x`, `f2z` v **koncovém** uzlu. Trojúhelníkové zatížení dostanete, když na jednom konci zadáte nulu.

::model-figure{caption="Trojúhelníkové zatížení od 0 do 10 kN/m: reakce 10 a 20 kN, největší M = 23,09 kNm ve vzdálenosti 3,46 m"}
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

Ruční výpočet: celkové zatížení $qL/2 = 30\ \text{kN}$ působí ve vzdálenosti $2L/3$, takže $R_A = 10\ \text{kN}$ a $R_B = 20\ \text{kN}$; posouvající síla je nulová a moment největší v $x = L/\sqrt{3} = 3{,}46\ \text{m}$, kde $M = qL^2/(9\sqrt{3}) = 23{,}09\ \text{kNm}$.

Lineárně proměnné zatížení působí v **lokálních osách** prvku (políčko LCS je zamčené). U vodorovného prvku nakresleného zleva doprava je to totéž co globální osy; u šikmého jsou `f1z` a `f2z` kolmé na prvek a `f1x`, `f2x` míří podél něj.

Proměnné **svislé** zatížení na prvku se sklonem $\alpha$ přesto zadáte přesně: na každém konci zadejte jeho dvě lokální složky, $f_z = q\cos\alpha$ a $f_x = q\sin\alpha$ ve směru dolů po svahu, která je záporná, pokud prvek od počátečního uzlu stoupá. Pro krokev výše, s průmětem 4 m a převýšením 3 m, nakreslenou zdola, je svislé zatížení rostoucí od 0 do 10 kN/m délky prvku `f1x` = `f1z` = 0, `f2x` = −6 a `f2z` = 8 kN/m.

::model-figure{caption="Svislé zatížení od 0 do 10 kN/m délky prvku, zadané lokálními složkami: reakce 8,333 a 16,67 kN, největší M = 12,83 kNm"}
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

Ruční výpočet: výslednice 25 kN působí ve dvou třetinách průmětu, ve vzdálenosti 2,67 m, takže $R_B = 25 \cdot 2{,}667/4 = 16{,}67\ \text{kN}$. Na průmětu dlouhém 4 m tvoří zatížení trojúhelník, který roste do 12,5 kN/m, takže stejně jako výše je $M = 12{,}5 \cdot 4^2/(9\sqrt{3}) = 12{,}83\ \text{kNm}$.

### Osamělá síla {#concentrated-load}

Síla `Fx`, `Fz` nebo moment `My` v libovolném bodě **po délce** prvku, bez dalšího uzlu. **Vzdálenost od počátečního uzlu** udává polohu $a$ zatížení, $0 \le a \le L$. Výchozí hodnota je polovina délky zaokrouhlená dolů na celé metry, nejvýše 5 m (v amerických jednotkách celé stopy, nejvýše 15 ft), proto ji nastavte podle skutečné polohy zatížení. **LCS** funguje stejně jako u rovnoměrného zatížení.

::model-figure{caption="20 kN ve vzdálenosti 2 m na rozpětí 6 m: V skočí z 13,33 na −6,667 kN, pod silou je M = 26,67 kNm"}
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

V místě síly má průběh posouvající síly skok o `Fz` a průběh ohybového momentu zlom: $R_A = 20 \cdot 4/6 = 13{,}33\ \text{kN}$, $M = 13{,}33 \cdot 2 = 26{,}67\ \text{kNm}$. Osamělý moment `My` naopak způsobí skok v průběhu momentu.

### Změna teploty {#temperature-load}

| Pole | Význam | Účinek |
| --- | --- | --- |
| **ΔT<sub>s</sub>**, oteplení střednice | stejná změna teploty v celém průřezu | prodloužení $\alpha\,\Delta T_s\,L$ |
| **ΔT<sub>d</sub> − ΔT<sub>h</sub>** | rozdíl změn teploty dolních a horních vláken | křivost $\alpha\,(\Delta T_d - \Delta T_h)/h$ |

Obě hodnoty jsou *změny* teploty oproti stavu bez napětí, ve výchozím nastavení ve °C; změna o 1 °C je 1 K. Změna teploty počítá s **α** materiálu a **výškou h** průřezu. **Dolní** vlákna jsou na straně čárkované čáry. Kladné ΔT<sub>d</sub> − ΔT<sub>h</sub> (teplejší dolní vlákna) dolní vlákna prodlouží, takže se prvek prohne dolů jako nosník zatížený tíhou.

U staticky určité konstrukce vyvolá změna teploty jen posuny. Vnitřní síly vzniknou teprve tehdy, když deformaci něco brání (vetknuté konce, spojitost, staticky nadbytečné prvky). Stejný ocelový nosník o rozpětí 6 m a výšce 0,3 m, dole o 20 K teplejší než nahoře:

::div{.shots}

:::model-figure{caption="Prostý nosník: uprostřed se prohne o 3,6 mm, M = 0"}
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

:::model-figure{caption="Oboustranně vetknutý nosník: zůstane rovný, M = −14,04 kNm po celé délce"}
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

Ruční výpočet: volná křivost je $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0{,}3 = 8 \times 10^{-4}\ \text{1/m}$. Prostý nosník se jí volně přizpůsobí a prohne se o $\kappa L^2/8 = 3{,}6\ \text{mm}$. U vetknutých konců ji musí vyrušit konstantní moment: $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14{,}04\ \text{kNm}$. Další případ podrobně počítá stránka [Ověření výsledků ručně](/cs/guide/verification#temperature-gradient-on-a-simply-supported-beam).

## Úprava a odstranění zatížení {#editing-and-removing-loads}

| Co chcete | Postup |
| --- | --- |
| Rychle změnit hodnoty | Upravte složky (i políčko LCS) přímo na záložce *Zatížení*. |
| Otevřít dialog úprav | Dvakrát klikněte na zatížení v zobrazení, nebo na něj klikněte → **Upravit zatížení**. Zatížení se zobrazují také jako štítky v tabulkách *Uzly* a *Prvky*; kliknutím na štítek zatížení upravíte. |
| Smazat ho | Vyberte ho a stiskněte <kbd>Delete</kbd>, klikněte na něj → **Smazat**, nebo použijte × na záložce *Zatížení*. |

Zatížení patří ke svému uzlu nebo prvku: se smazáním uzlu nebo prvku se smažou i ona, a když uzel nebo prvek zkopírujete i s vybranými zatíženími, zkopírují se také.

![Záložka Zatížení: jeden řádek na zatížení, složky lze upravovat přímo](/screenshots/cs/loads-table.webp)

## Co k dispozici není {#what-is-not-available}

::div{.limits}
- **Jediný zatěžovací stav.** Žádné kombinace: každý stav uložte jako samostatný soubor nebo odkaz.
- **Žádná vlastní tíha.** Zadejte ji jako rovnoměrné zatížení s nezaškrtnutým LCS: $f_z = \rho\,g\,A$, např. $\approx 0{,}22\ \text{kN/m}$ u IPE 200.
- **Lineárně proměnné zatížení jen v lokálních osách.** Proměnné svislé zatížení na šikmém prvku zadejte jeho [lokálními složkami](#trapezoidal-load).
- **Žádné zatížení jen na části prvku.** Spojité zatížení vždy pokrývá celý prvek: tam, kde začíná nebo končí, přidejte uzel.
::
