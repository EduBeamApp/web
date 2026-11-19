---
description: "Návod: staticky neurčitý nosník o dvou polích v EduBeamu – srovnání se dvěma prostými nosníky, pokles střední podpory a kontrola silovou metodou. Asi 25 minut."
source: site
---

# Návod: spojitý nosník a pokles podpory

Vymodelujete nosník spojitý přes dvě pole, porovnáte ho se dvěma prostými nosníky a pak necháte jeho střední podporu poklesnout o 10 mm. Reakce tohoto nosníku ze samotných podmínek rovnováhy neurčíte, a proto je ověříte silovou metodou.

- **Čas:** asi 25 minut. Je to poslední a nejobsažnější ze čtyř návodů.
- **Potřebujete:** EduBeam otevřený na druhé kartě prohlížeče, na počítači s myší a klávesnicí. Pokud jste s EduBeamem ještě nepracovali, projděte si nejdřív [Rychlý start](/cs/guide/quick-start) nebo některý z předchozích návodů.
- **Předpoklady:** silová metoda pro jednou staticky neurčitou konstrukci a průhyby prostého nosníku uprostřed rozpětí: $5qL^4/(384EI)$ od spojitého rovnoměrného zatížení a $FL^3/(48EI)$ od osamělé síly.
- **Jednotky:** SI. Štítek jednotek vpravo dole v zobrazení má ukazovat `m m² kN kNm MPa`. Pokud ukazuje stopy a kipy, klikněte na něj a v poli **Soustava jednotek** zvolte **SI (metrická)**.

**Naučíte se**

- posoudit, co přináší spojitost: menší momenty a průhyby než u prostých nosníků,
- předepsat pokles podpory a odečíst síly, které pokles vyvolá sám o sobě,
- ověřit staticky neurčitý nosník silovou metodou a vysvětlit, proč tužší nosník trpí poklesem podpory víc.

::div{.actions}
[Otevřít EduBeam ↗](https://run.edubeam.app/?lang=cs){target="_blank"} [Přejít na ruční kontrolu](#check-by-hand)
::

::model-figure{caption="Hotový nosník: dvě pole po 6 m se zatížením 10 kN/m, před poklesem podpory"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels, dimensions]
---
::

## Zadání {#the-problem}

- Dvě pole o délce $L = 6$ m: pevný kloub v uzlu 1, posuvné klouby v uzlech 2 a 3.
- Spojité rovnoměrné zatížení $q = 10$ kN/m v obou polích.
- Ocel, $E = 210$ GPa, a $I_y = 8{,}356 \times 10^{-5}$ m⁴ (IPE 300), takže $EI = 17\,547{,}6$ kNm².
- Ve druhé části návodu poklesne střední podpora, uzel 2, o $\Delta = 10$ mm.

**Je konstrukce staticky určitá?** Čtyři složky reakcí (dvě v uzlu 1, po jedné v uzlech 2 a 3) proti třem podmínkám rovnováhy: nosník je jednou staticky neurčitý. Chybějící rovnici dodá deformace: uzel 2 se neposune, nebo se posune přesně o $\Delta$.

## Sestavte model {#model-it}

::div{.steps}

### Materiál a průřez {#material-and-section}

1. V horní liště aplikace klikněte na **Smazat konstrukci**, zaškrtněte **Smazat materiály** a **Smazat průřezy** a klikněte na **Potvrdit**. Uzly a prvky se pak znovu číslují od 1.
2. Záložka **Materiály** → **Knihovna materiálů** → **+** v řádku **Ocel (S235)**; knihovnu pak zavřete tlačítkem **Zrušit**.
3. Záložka **Průřezy** → **Přidat průřez**. Do pole **Iy** napište `8.356e-5`, pole **Plocha**, **Výška** a **Smykový součinitel** ponechte na hodnotě `1` a klikněte na **Přidat průřez**.

Plocha 1 m² zajistí, že se nosník znatelně smykově nepřetvoří, jak předpokládá ruční výpočet. Tentokrát $I_y$ ovlivní i síly: uvidíte, kde.

### Nakreslete nosník {#draw-the-beam}

1. Záložka **Prvky** → druhé tlačítko **Přidat prvek**, to s ikonou kurzoru.
2. Klikněte do bodů (0, 0), (6, 0) a (12, 0).
3. Klávesou <kbd>Esc</kbd> kreslení ukončíte a klávesou <kbd>F</kbd> zobrazíte celý model.

Vzniknou tři uzly a dva prvky. Souřadnice zkontrolujte v tabulce **Uzly**.

### Podpory {#supports}

Klikněte na uzel 1 → **Podepření uzlu** → symbol **Kloub**. Uzlům 2 a 3 dejte **Posuvný kloub**.

### Zatížení {#load}

Záložka **Zatížení** → **Přidat prvkové zatížení** → *Spojité rovnoměrné zatížení* na **Prvek** `1`, `fz = 10` → **Přidat prvkové zatížení**. Totéž zopakujte pro prvek 2.

::

## Výsledky {#results}

Ohybový moment, reakce a deformovaný tvar jsou zapnuté od začátku. Posouvající sílu přidáte zaškrtnutím **V<sub>z</sub> (x)** v možnostech zobrazení vpravo nahoře v okně konstrukce (ozubeným kolem je zobrazíte a skryjete). EduBeam popisuje průběhy a reakce v kN a kNm na dvě desetinná místa.

- Reakce mají popisky `22,50` v uzlech 1 a 3 a `75,00` v uzlu 2: střední podpora nese víc než polovinu ze 120 kN.
- Moment nad uzlem 2 má popisek `-45,00`, je tedy záporný. V polích dosahuje kladný moment nejvýše `25,31` kNm, ve vzdálenosti 2,25 m od krajních podpor.
- Posouvající síla nad uzlem 2 skočí z `-37,50` na `37,50`.

### Porovnání se dvěma prostými nosníky {#compare-with-two-simple-spans}

Co spojitost přináší? Přerušte ji: v tabulce **Prvky** zaškrtněte kloub na **konci** prvku 1, v uzlu 2. Z nosníku se stanou dva prosté nosníky o rozpětí 6 m, tedy staticky určitá konstrukce.

::model-figure{caption="S kloubem nad uzlem 2: dva prosté nosníky, každý s qL²/8 = 45 kNm"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [{ nodes: [1, 2], hinges: [false, true] }, [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

| | Spojitý nosník | Dva prosté nosníky |
| --- | --- | --- |
| Reakce v uzlech 1, 2, 3 | 22,5; 75; 22,5 kN | 30; 60; 30 kN |
| Moment nad uzlem 2 | −45 kNm | 0 |
| Největší kladný moment | 25,31 kNm | 45 kNm |
| Největší průhyb (v pohledu $w(x)$ na obrázcích) | 4,000 mm | 9,617 mm |

Největší moment je v obou případech 45 kNm, u spojitého nosníku se ale přesune nad podporu a pole se prohýbají mnohem méně. Každé pole je navíc 2,4krát tužší: jeho konec nad uzlem 2 se nemůže pootočit, skoro jako by byl vetknutý. Než budete pokračovat, kloub zase odškrtněte.

## Pokles střední podpory {#settle-the-middle-support}

Teď nechte uzel 2 poklesnout o 10 mm, jak se to může stát základu na měkkém podloží.

::div{.steps}

### Předepište pokles {#prescribe-the-settlement}

Klikněte na uzel 2 → **Předepsat posunutí**. V dialogu je už vybrané **Předepsané posunutí**; do pole **Dz** napište `0.01` a klikněte na **Přidat uzlové zatížení**.

![Dialog předepsaného posunutí: nastavit lze jen Dz, tedy směr, ve kterém posuvný kloub drží](/screenshots/cs/p2t-prescribe-displacement.webp){.shot-sm}

Ve výchozích jednotkách SI se posunutí zadávají v metrech, takže 10 mm je `0.01`; kladné posunutí míří dolů. Nastavit lze jen podepřené směry: posuvný kloub můžete posunout dolů, ale ne do strany. Více najdete v kapitole [Předepsaná posunutí](/cs/essentials/loads#prescribed-displacements-support-settlements).

### Nové výsledky {#read-the-new-results}

Střední reakce klesne na `70,13` kN a krajní reakce vzrostou na `24,94` kN. Moment nad uzlem 2 se zmenší na `-30,38` kNm a pole se prohýbají víc, kladný moment dosáhne až `31,09` kNm.

::model-figure{caption="Uzel 2 poklesl o 10 mm: záporný moment nad ním se zmenší a pole přenášejí víc"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

### Samotný pokles {#look-at-the-settlement-alone}

Smažte obě prvková zatížení: každé vyberte a stiskněte <kbd>Delete</kbd>, nebo klikněte na × v jeho řádku tabulky **Zatížení**. Zůstane účinek samotného poklesu: trojúhelníkový průběh kladného momentu s hodnotou `14,62` kNm nad uzlem 2 a reakce, které uzel 2 táhnou **dolů** silou `4,87` kN, zatímco v uzlech 1 a 3 tlačí nahoru, každá silou `2,44` kN. Nosník se brání ohnutí do tvaru, který mu pokles vnutí, a jen tento odpor ho zatěžuje.

::model-figure{caption="Samotný pokles podpory: žádné zatížení, a přesto je nosník ohnutý a podpory reagují"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, w]
show: [nodeLabels]
---
::

Když tyto hodnoty přičtete k výsledkům od samotného zatížení, dostanete zatížený nosník s poklesem podpory: 75 − 4,87 = 70,13 kN, −45 + 14,62 = −30,38 kNm. Výpočet je lineární, takže účinky můžete sčítat.

### Znovu přerušte spojitost {#cut-the-continuity-again}

Zatížení vraťte zkratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd>, jednou za každé smazané zatížení, a znovu zaškrtněte kloub na konci prvku 1. Pole se teď po poklesu jen natočí: reakce i momenty jsou přesně jako u dvou prostých nosníků, ať je pokles jakýkoli, a bez zatížení by byly nulové. **Pokles podpory vyvolá vnitřní síly jen ve staticky neurčité konstrukci.** Než budete pokračovat, kloub odškrtněte.

::

## Kontrola ručním výpočtem {#check-by-hand}

Použijte silovou metodu. Odstraňte podporu v uzlu 2 a nahraďte ji neznámou reakcí $R_2$, která působí nahoru na prostý nosník o rozpětí $2L = 12$ m.

**Průhyby uvolněného nosníku v uzlu 2** od zatížení a od jednotkové síly působící v uzlu 2 nahoru:

$$
\delta_q = \frac{5q\,(2L)^4}{384\,EI} = \frac{5 \cdot 10 \cdot 12^4}{384 \cdot 17\,547{,}6} = 0{,}15387\ \text{m}
$$

$$
\delta_{1} = \frac{(2L)^3}{48\,EI} = \frac{12^3}{48 \cdot 17\,547{,}6} = 0{,}0020516\ \text{m/kN}
$$

**Deformační podmínka.** Reakce $R_2$ musí uzel 2 zatlačit zpět nahoru tak, aby ležel tam, kde je podpora: v nule, nebo o $\Delta$ níž.

$$
R_2\,\delta_1 = \delta_q - \Delta \quad\Rightarrow\quad R_2 = \frac{\delta_q - \Delta}{\delta_1}
$$

**Všechno ostatní** plyne z podmínek rovnováhy; největší kladný moment leží tam, kde je posouvající síla $R_1 - qx$ nulová.

| | Vzorec | Bez poklesu | Pokles uzlu 2 o 10 mm |
| --- | --- | --- | --- |
| $R_2$ | $(\delta_q - \Delta)/\delta_1$ | 75,00 kN | 70,13 kN |
| $R_1 = R_3$ | $(2qL - R_2)/2$ | 22,50 kN | 24,94 kN |
| $M_2$ | $R_1 L - qL^2/2$ | −45,00 kNm | −30,38 kNm |
| $M_{\max}$ | $R_1^2/(2q)$ | 25,31 kNm | 31,09 kNm |

EduBeam ukazuje tytéž hodnoty do poslední číslice.

Bez poklesu jde o učebnicové hodnoty $R_2 = 10qL/8$, $M_2 = -qL^2/8$ a $M_{\max} = 9qL^2/128$. Samotný pokles změní reakce o $\Delta/\delta_1 = 4{,}874$ kN a moment nad uzlem 2 o

$$
\Delta M_2 = \frac{\Delta}{\delta_1} \cdot \frac{2L}{4} = \frac{3\,EI\,\Delta}{L^2} = \frac{3 \cdot 17\,547{,}6 \cdot 0{,}01}{36} = 14{,}62\ \text{kNm}
$$

Všimněte si, že ve vzorci vystupuje $EI$. Síly od zatížení závisejí jen na tom, jak tuhé jsou pruty *vůči sobě navzájem*; síly od vnuceného posunutí rostou se samotnou tuhostí. Nad poklesající podporou si proto tužší nosník přitáhne větší momenty.

## Experimentujte {#experiment}

Začněte od zatíženého nosníku s poklesem podpory, měňte vždy jen jednu věc, odhadněte výsledek a teprve pak se podívejte. Zkratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> každou změnu vrátíte.

**Zdvojnásobte tuhost.** V tabulce **Průřezy** nastavte **Iy** na `1.6712e-4`. Účinek poklesu na moment nad uzlem 2 se zdvojnásobí na 29,25 kNm a $M_2$ se zmenší na −15,75 kNm. Při samotném zatížení by se nezměnilo nic kromě průhybů, které by se zmenšily na polovinu.

**Najděte pokles, který uvolní uzel 2.** Při jakém $\Delta$ je moment nad uzlem 2 nulový? Na $\Delta M_2 = 45$ kNm je potřeba $\Delta = 45 L^2/(3EI) = qL^4/(24EI) = 0{,}0308$ m. Změňte pokles na `0.0308`, v tabulce **Zatížení** nebo dvojklikem na něj v zobrazení: reakce budou 30, 60 a 30 kN, stejně jako u dvou prostých nosníků, až na zaokrouhlení $\Delta$. Výraz $qL^4/(24EI)$ je pootočení konce prostého nosníku krát $L$: pokles natočí každé pole právě tak, aby se zlom nad uzlem 2 vyrovnal, a spojitost už nemá co přenášet.

**Pusťte uzel 2.** Změňte pokles na `0.1539`, tedy na průhyb $\delta_q$ uvolněného nosníku délky 12 m. Reakce v uzlu 2 klesne prakticky na nulu a nosník nese zatížení jako jeden prostý nosník: uprostřed rozpětí je moment 180 kNm. Podpora, která takhle poklesne, už podporou není.

**Uzel 2 naopak zvedněte.** Změňte pokles na `-0.01`, tedy 10 mm nahoru. Všechny změny způsobené poklesem obrátí znaménko: uzel 2 teď nese 79,87 kN a záporný moment vzroste na −59,62 kNm.

Další kontroly v uzavřeném tvaru, mimo jiné pokles podpory jednostranně vetknutého nosníku, najdete v kapitole [Ověření výsledků ručně](/cs/guide/verification#prescribed-displacement).

## Co dál {#next-steps}

::card-grid{cols="2"}
:::card{title="Procvičování: spojité nosníky" icon="lucide:dices" to="/cs/practice?p=K2049"}
Nosníky o dvou polích zatížené v jednom nebo v obou polích, řešené silovou metodou, s okamžitou kontrolou vašich odpovědí. Začněte úlohou K2049; další dostanete, když vyberete jen typ **Spojitý nosník o dvou polích** a stisknete **Nová úloha**.
:::
:::card{title="Galerie příkladů" icon="lucide:library" to="/cs/examples/"}
To byl poslední návod. V galerii příkladů najdete další modely, které můžete otevřít, upravit a ověřit, a k nim náměty na cvičení.
:::
::
