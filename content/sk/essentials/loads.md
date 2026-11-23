---
description: "Sily, momenty, poklesy podpier, spojité, osamelé aj teplotné zaťaženie v EduBeame a ich znamienka: z smeruje nadol, moment je kladný proti smeru hodinových ručičiek."
source: site
---

# Zaťaženie

Zaťaženie pôsobí v uzloch alebo po dĺžke prvkov. Všetky zaťaženia patria do **jediného zaťažovacieho stavu** a pôsobia súčasne; ak chcete porovnať rôzne varianty, uložte každý ako samostatný [súbor projektu alebo odkaz na zdieľanie](/sk/essentials/import-export).

| Zaťaženie | Pôsobí na | Kde ho pridáte |
| --- | --- | --- |
| [Sila alebo moment](#nodal-loads) | uzol | Karta *Zaťaženie* → **Pridať uzlové zaťaženie** alebo kliknite na uzol → **Pridať zaťaženie** |
| [Predpísané posunutie](#prescribed-displacements-support-settlements) (pokles podpery) | podopretý uzol | Ten istý dialóg alebo kliknite na uzol → **Predpísať posunutie** |
| [Rovnomerné spojité zaťaženie](#uniformly-distributed-load), [lineárne sa meniace zaťaženie](#trapezoidal-load), [osamelá sila](#concentrated-load) alebo [zmena teploty](#temperature-load) | prvok | Karta *Zaťaženie* → **Pridať prvkové zaťaženie** alebo kliknite na prvok → **Pridať zaťaženie** |

## Znamienková konvencia {#sign-convention-in-one-line}

Os x smeruje **doprava**, os z **nadol** a momenty sú kladné **proti smeru hodinových ručičiek**. Kladná sila `Fz` alebo zaťaženie `fz` teda smeruje nadol ako tiaž a zaťaženie smerom nahor je záporné.

::model-figure{caption="Všetky zaťaženia sú kladné: Fx = +10 kN doprava, Fz = +10 kN nadol, My = +10 kNm proti smeru hodinových ručičiek"}
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

| Kladný smer | Predvolené osi (z nadol) | [Osi s y nahor](/sk/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Vodorovná sila `Fx`, `fx` | doprava | doprava |
| Zvislá sila | `Fz`, `fz`: **nadol** | `Fy`, `fy`: **nahor** |
| Moment | `My`: proti smeru hodinových ručičiek | `Mz`: proti smeru hodinových ručičiek |
| Zvislý pokles podpery | `Dz`: nadol | `Dy`: nahor |

Zaťaženie v **lokálnych osiach** prvku (zaškrtnuté LCS) sa naopak riadi prvkom: lokálna os x vedie od počiatočného ku koncovému uzlu a lokálna os z je lokálna os x pootočená o 90° v smere hodinových ručičiek, smerom k čiarkovanej čiare pozdĺž prvku. Pozrite časť [Orientácia prvku](/sk/essentials/elements#element-direction). Úplnú konvenciu vrátane vnútorných síl nájdete v kapitole [Súradný systém a znamienková konvencia](/sk/elements/conventions#loads).

## Uzlové zaťaženia {#nodal-loads}

Karta *Zaťaženie* → **Pridať uzlové zaťaženie** alebo kliknite na uzol → **Pridať zaťaženie** a nechajte vybranú voľbu **Sila/moment**. Zadajte sily `Fx`, `Fz` (kN) a moment `My` (kNm) so znamienkami podľa [konvencie vyššie](#sign-convention-in-one-line); náhľad vykresľuje zaťaženie už počas písania.

![Pridať uzlové zaťaženie: náhľad ukazuje smer už počas písania](/screenshots/sk/loads-nodal.webp){.shot-md}

- Zložky sú v **globálnych** osiach. V uzle s pootočenými osami ([šikmá podpera](/sk/essentials/nodes-supports#inclined-skewed-supports)) pribudne v dialógu prepínač **Globálne osi** / **Osi uzla**. Zložky zadané v osiach uzla (označené `Fx′` a `Fz′`) pôsobia vo vlastných osiach uzla a pootočia sa s nimi, keď sa uhol neskôr zmení. Prepnutím sa hodnoty prepočítajú tak, aby sa zaťaženie nezmenilo.
- V jednom uzle môže pôsobiť viac uzlových zaťažení; sčítajú sa.

### Predpísané posunutia (poklesy podpier) {#prescribed-displacements-support-settlements}

Ak chcete podperu posunúť o zadanú hodnotu, zvoľte v tom istom dialógu **Predpísané posunutie** alebo kliknite na podopretý uzol → **Predpísať posunutie**. Zadajte posunutia `Dx`, `Dz` (kladné doprava a nadol, v [jednotke posunutia](/sk/essentials/units-settings#units), predvolene v metroch) a pootočenie `Ry` (rad, kladné proti smeru hodinových ručičiek).

- Predpísať možno iba **podopreté** stupne voľnosti: ostatné polia sú neaktívne a uzol bez podpery pokles mať vôbec nemôže.
- Uzol má najviac jedno predpísané posunutie. Ak ho chcete zmeniť, upravte existujúce a nepridávajte druhé.
- Pri šikmej podpere sú polia označené `Dx′` a `Dz′`: pokles pôsobí vo vlastných osiach podpery.

Či pokles podpery vyvolá vnútorné sily, závisí od konštrukcie. Rovnaký pokles podpery B o 10 mm, bez ďalšieho zaťaženia:

::div{.shots}

:::model-figure{caption="Prostý nosník: nosník sa len nakloní; žiadne reakcie, M = 0"}
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

:::model-figure{caption="Spojitý nosník cez podperu B: nosník sa ohne, nad B je M = 21,06 kNm"}
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

Staticky určitá konštrukcia sa poklesu podpery prispôsobí bez odporu. Spojitý nosník sa však ohnúť musí: podpera B ho stiahne nadol o $\delta = 10\ \text{mm}$, akoby v strede prostého nosníka s rozpätím 10 m pôsobila osamelá sila. Pri $L = 5\ \text{m}$ a $EI = 17\,548\ \text{kNm}^2$ ocele z príkladu je táto sila $P = 6EI\delta/L^3 = 8{,}423\ \text{kN}$, čo je reakcia v B, a $M_B = PL/2 = 3EI\delta/L^2 = 21{,}06\ \text{kNm}$. Pokles podpery v kombinácii s ďalším zaťažením ukazuje návod [Spojitý nosník a pokles podpery](/sk/tutorials/continuous-beam).

## Zaťaženie prvku {#element-loads}

Karta *Zaťaženie* → **Pridať prvkové zaťaženie** alebo kliknite na prvok → **Pridať zaťaženie**. Vyberte **Typ zaťaženia**; náhľad ukazuje zaťaženie na prvku už počas písania. Sily sú v kN a spojité zaťaženia v kN/m, prípadne v [jednotkách](/sk/essentials/units-settings#units), ktoré ste si zvolili.

![Pridať prvkové zaťaženie s rovnomerným spojitým zaťažením](/screenshots/sk/loads-udl.webp){.shot-md}

### Rovnomerné spojité zaťaženie {#uniformly-distributed-load}

Konštantné zaťaženie na jednotku dĺžky, `fx` a `fz`, po celom prvku. So zaškrtnutým **LCS** (predvolený stav) pôsobí v lokálnych osiach prvku, bez neho v globálnych osiach. Pri vodorovnom prvku nakreslenom zľava doprava je to to isté, pri šikmom prvku nie:

| Potrebujete | Zadajte |
| --- | --- |
| zaťaženie **kolmé** na prvok (vietor na krokvu) | `fz` so **zaškrtnutým** LCS |
| **zvislé** zaťaženie na meter dĺžky prvku (vlastná tiaž) | `fz` s **nezaškrtnutým** LCS |
| **zvislé** zaťaženie na meter vodorovného priemetu (sneh) | priamo zadať nemožno: vynásobte ho $\cos\alpha$, kde $\alpha$ je sklon prvku, a zadajte ho ako zvislé zaťaženie |

To isté zaťaženie 10 kN/m na krokve dlhej 5 m, ktorá má vodorovný priemet 4 m a prevýšenie 3 m:

::div{.shots}

:::model-figure{caption="LCS nezaškrtnuté: zvislé zaťaženie, spolu 50 kN; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="LCS zaškrtnuté: zaťaženie kolmé na prvok; M = 31,25 kNm"}
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

Ručný výpočet: pre kolmé zaťaženie je $M = qL^2/8 = 10 \cdot 5^2/8 = 31{,}25\ \text{kNm}$; zvislých 50 kN rozložených na 4 m rozpätia dáva 12,5 kN/m priemetu, takže $M = 12{,}5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Lineárne sa meniace (lichobežníkové) zaťaženie {#trapezoidal-load}

Zaťaženie, ktoré sa po dĺžke prvku mení lineárne: `f1x`, `f1z` v **počiatočnom** uzle, `f2x`, `f2z` v **koncovom** uzle. Trojuholníkové zaťaženie dostanete, keď na jednom konci zadáte nulu.

::model-figure{caption="Trojuholníkové zaťaženie od 0 do 10 kN/m: reakcie 10 a 20 kN, najväčší M = 23,09 kNm vo vzdialenosti 3,46 m"}
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

Ručný výpočet: celkové zaťaženie $qL/2 = 30\ \text{kN}$ pôsobí vo vzdialenosti $2L/3$, takže $R_A = 10\ \text{kN}$ a $R_B = 20\ \text{kN}$; priečna sila je nulová a moment najväčší v $x = L/\sqrt{3} = 3{,}46\ \text{m}$, kde $M = qL^2/(9\sqrt{3}) = 23{,}09\ \text{kNm}$.

Lineárne sa meniace zaťaženie pôsobí v **lokálnych osiach** prvku (políčko LCS je zamknuté). Pri vodorovnom prvku nakreslenom zľava doprava sú lokálne osi totožné s globálnymi; pri šikmom sú `f1z` a `f2z` kolmé na prvok a `f1x`, `f2x` smerujú pozdĺž neho.

Meniace sa **zvislé** zaťaženie na prvku so sklonom $\alpha$ napriek tomu zadáte presne: na každom konci zadajte jeho dve lokálne zložky, $f_z = q\cos\alpha$ a $f_x = q\sin\alpha$ v smere nadol po svahu, ktorá je záporná, ak prvok od počiatočného uzla stúpa. Pre krokvu vyššie, s priemetom 4 m a prevýšením 3 m, nakreslenú zdola, zadáte zvislé zaťaženie, ktoré rastie od 0 do 10 kN/m dĺžky prvku, hodnotami `f1x` = `f1z` = 0, `f2x` = −6 a `f2z` = 8 kN/m.

::model-figure{caption="Zvislé zaťaženie od 0 do 10 kN/m dĺžky prvku, zadané lokálnymi zložkami: reakcie 8,333 a 16,67 kN, najväčší M = 12,83 kNm"}
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

Ručný výpočet: výslednica 25 kN pôsobí v dvoch tretinách priemetu, vo vzdialenosti 2,67 m, takže $R_B = 25 \cdot 2{,}667/4 = 16{,}67\ \text{kN}$. Na priemete dlhom 4 m tvorí zaťaženie trojuholník, ktorý rastie do 12,5 kN/m, takže rovnako ako vyššie je $M = 12{,}5 \cdot 4^2/(9\sqrt{3}) = 12{,}83\ \text{kNm}$.

### Osamelá sila {#concentrated-load}

Sila `Fx`, `Fz` alebo moment `My` v ľubovoľnom bode **po dĺžke** prvku, bez ďalšieho uzla. **Vzdialenosť od počiatočného uzla** udáva polohu $a$ zaťaženia, $0 \le a \le L$. Predvolená hodnota je polovica dĺžky zaokrúhlená nadol na celé metre, najviac 5 m (v amerických jednotkách celé stopy, najviac 15 ft), preto ju nastavte podľa skutočnej polohy zaťaženia. **LCS** funguje rovnako ako pri rovnomernom zaťažení.

::model-figure{caption="20 kN vo vzdialenosti 2 m na rozpätí 6 m: V skočí z 13,33 na −6,667 kN, pod silou je M = 26,67 kNm"}
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

V mieste sily má priebeh priečnej sily skok o `Fz` a priebeh ohybového momentu zlom: $R_A = 20 \cdot 4/6 = 13{,}33\ \text{kN}$, $M = 13{,}33 \cdot 2 = 26{,}67\ \text{kNm}$. Osamelý moment `My` naopak spôsobí skok v priebehu momentu.

### Zmena teploty {#temperature-load}

| Pole | Význam | Účinok |
| --- | --- | --- |
| **ΔT<sub>s</sub>**, oteplenie strednice | rovnaká zmena teploty v celom priereze | predĺženie $\alpha\,\Delta T_s\,L$ |
| **ΔT<sub>d</sub> − ΔT<sub>h</sub>** | rozdiel zmien teploty dolných a horných vlákien | krivosť $\alpha\,(\Delta T_d - \Delta T_h)/h$ |

Obe hodnoty sú *zmeny* teploty oproti stavu bez napätia, predvolene v °C; zmena o 1 °C je 1 K. Zmena teploty počíta s **α** materiálu a **výškou h** prierezu. **Dolné** vlákna sú na strane čiarkovanej čiary. Kladné ΔT<sub>d</sub> − ΔT<sub>h</sub> (teplejšie dolné vlákna) dolné vlákna predĺži, takže sa prvok prehne nadol ako nosník zaťažený tiažou.

Pri staticky určitej konštrukcii vyvolá zmena teploty iba posunutia. Vnútorné sily vzniknú až vtedy, keď deformácii niečo bráni (votknuté konce, spojitosť, staticky nadbytočné prúty). Ten istý oceľový nosník s rozpätím 6 m a výškou 0,3 m, dole o 20 K teplejší ako hore:

::div{.shots}

:::model-figure{caption="Prostý nosník: v strede sa prehne o 3,6 mm, M = 0"}
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

:::model-figure{caption="Obojstranne votknutý nosník: zostane rovný, M = −14,04 kNm po celej dĺžke"}
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

Ručný výpočet: voľná krivosť je $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0{,}3 = 8 \times 10^{-4}\ \text{1/m}$. Prostý nosník sa jej voľne prispôsobí a prehne sa o $\kappa L^2/8 = 3{,}6\ \text{mm}$. Pri votknutých koncoch ju musí vyrušiť konštantný moment: $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14{,}04\ \text{kNm}$. Ďalší prípad podrobne počíta stránka [Ručné overenie výsledkov](/sk/guide/verification#temperature-gradient-on-a-simply-supported-beam).

## Úprava a odstránenie zaťaženia {#editing-and-removing-loads}

| Čo chcete | Postup |
| --- | --- |
| Rýchlo zmeniť hodnoty | Upravte zložky (aj políčko LCS) priamo na karte *Zaťaženie*. |
| Otvoriť dialóg úprav | Dvakrát kliknite na zaťaženie v zobrazení alebo naň kliknite → **Upraviť zaťaženie**. Zaťaženia sa zobrazujú aj ako štítky v tabuľkách *Uzly* a *Prvky*; kliknutím na štítok zaťaženie upravíte. |
| Vymazať ho | Vyberte ho a stlačte <kbd>Delete</kbd>, kliknite naň → **Vymazať** alebo použite × na karte *Zaťaženie*. |

Zaťaženie patrí k svojmu uzlu alebo prvku: pri vymazaní uzla alebo prvku sa vymaže aj ono, a keď uzol alebo prvok skopírujete aj s vybranými zaťaženiami, skopírujú sa tiež.

![Karta Zaťaženie: jeden riadok na zaťaženie, zložky možno upravovať priamo](/screenshots/sk/loads-table.webp)

## Čo nie je k dispozícii {#what-is-not-available}

::div{.limits}
- **Jediný zaťažovací stav.** Žiadne kombinácie: každý stav uložte ako samostatný súbor alebo odkaz.
- **Žiadna vlastná tiaž.** Zadajte ju ako rovnomerné zaťaženie s nezaškrtnutým LCS: $f_z = \rho\,g\,A$, napr. $\approx 0{,}22\ \text{kN/m}$ pri IPE 200.
- **Lineárne sa meniace zaťaženie iba v lokálnych osiach.** Meniace sa zvislé zaťaženie na šikmom prvku zadajte jeho [lokálnymi zložkami](#trapezoidal-load).
- **Žiadne zaťaženie len na časti prvku.** Spojité zaťaženie vždy pokrýva celý prvok: tam, kde začína alebo končí, pridajte uzol.
::
