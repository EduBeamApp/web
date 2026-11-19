---
description: "Návod: šikmý nosník (krokev, schodiště) v EduBeamu – zatížení na metr půdorysu, síly N a V podél sklonu a vliv směru posuvného kloubu. Asi 15 minut."
source: site
---

# Návod: šikmý nosník

Vymodelujete krokev zatíženou sněhem, odečtete normálové a posouvající síly podél jejího sklonu a ověříte je ručně.

- **Čas:** asi 15 minut. Je to první a nejkratší ze čtyř návodů.
- **Potřebujete:** EduBeam otevřený na druhé kartě prohlížeče, na počítači s myší a klávesnicí. Pokud jste s EduBeamem ještě nepracovali, projděte si nejdřív [Rychlý start](/cs/guide/quick-start): ukazuje záložky a dialogy, se kterými tento návod pracuje.
- **Předpoklady:** rovnováha prostého nosníku a rozklad síly do dvou složek.
- **Jednotky:** SI. Štítek jednotek vpravo dole v zobrazení má ukazovat `m m² kN kNm MPa`. Pokud ukazuje stopy a kipy, klikněte na něj a v poli **Soustava jednotek** zvolte **SI (metrická)**.

**Naučíte se**

- přepočítat zatížení zadané na metr půdorysu na zatížení na délku prvku, se kterým EduBeam počítá,
- nasměrovat spojité zatížení svisle nebo kolmo k prvku pomocí políčka **LCS**,
- natočit posuvný kloub a ověřit si, že mění normálovou sílu, ale ne ohybový moment.

::div{.actions}
[Otevřít EduBeam ↗](https://run.edubeam.app/?lang=cs){target="_blank"} [Přejít na ruční kontrolu](#check-by-hand)
::

::model-figure{caption="Hotová krokev: sníh 3 kN/m na metr půdorysu, zadaný jako 2,4 kN/m na délku prvku, s pevným kloubem u okapu (uzel 1) a posuvným kloubem u hřebene (uzel 2)"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Zadání {#the-problem}

- Přímá krokev z uzlu 1 v (0, 0) nahoru do uzlu 2 v (4, −3): 4 m v půdorysu a 3 m na výšku, takže je dlouhá $L = 5$ m, $\cos\alpha = 4/5$ a $\sin\alpha = 3/5$.
- Pevný kloub v uzlu 1 u okapu. V uzlu 2 u hřebene posuvný kloub, který se posouvá vodorovně, takže jeho reakce je svislá.
- Sníh $s = 3$ kN/m, zadaný tak, jak ho uvádějí normy: **na metr půdorysu** (vodorovného průmětu).
- Ocel, $E = 210$ GPa, a $I_y = 8{,}356 \times 10^{-5}$ m⁴, což odpovídá IPE 300.

**Je konstrukce staticky určitá?** Tři složky reakcí a tři podmínky rovnováhy: ano. Síly plynou ze samotných podmínek rovnováhy; $E$ a $I_y$ ovlivňují jen průhyb.

## Sestavte model {#model-it}

::div{.steps}

### Materiál a průřez {#material-and-section}

1. V horní liště aplikace klikněte na **Smazat konstrukci**, zaškrtněte **Smazat materiály** a **Smazat průřezy** a klikněte na **Potvrdit**. Uzly a prvky se pak znovu číslují od 1.
2. Záložka **Materiály** → **Knihovna materiálů** → **+** v řádku **Ocel (S235)**; knihovnu pak zavřete tlačítkem **Zrušit**.
3. Záložka **Průřezy** → **Přidat průřez**. Do pole **Iy** napište `8.356e-5`, pole **Plocha**, **Výška** a **Smykový součinitel** ponechte na hodnotě `1` a klikněte na **Přidat průřez**.

Plocha 1 m² zajistí, že se prvek znatelně nezkrátí ani smykově nepřetvoří, jak předpokládá ruční výpočet.

### Nakreslete prvek {#draw-the-member}

1. Záložka **Prvky** → druhé tlačítko **Přidat prvek**, to s ikonou kurzoru.
2. Klikněte do bodu (0, 0) a pak do bodu (4, −3). Pravítka a zaměřovací kříž ukazují, kde jste, a kliknutí se přichytávají k mřížce.
3. Klávesou <kbd>Esc</kbd> kreslení ukončíte a klávesou <kbd>F</kbd> zobrazíte celý model.

Osa z míří dolů, takže uzel 2, který leží 3 m **nad** uzlem 1, má $z = -3$. Oba uzly zkontrolujte v tabulce **Uzly** a souřadnice, které nesedí, přepište.

### Podpory {#supports}

Klikněte na uzel 1 → **Podepření uzlu** → symbol **Kloub**. Uzlu 2 dejte stejným způsobem **Posuvný kloub**.

### Zatížení {#load}

Na krokev připadá celkem $3 \cdot 4 = 12$ kN sněhu. EduBeam rozkládá spojité rovnoměrné zatížení po **délce** prvku, takže stejných 12 kN na 5 m odpovídá

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0{,}8 = 2{,}4\ \text{kN/m}
$$

1. Záložka **Zatížení** → **Přidat prvkové zatížení**.
2. **Typ zatížení** *Spojité rovnoměrné zatížení*, **Prvek** `1`, `fz = 2.4`.
3. **Odškrtněte LCS**, aby `fz` působilo svisle, a klikněte na **Přidat prvkové zatížení**.

::callout{type="warning" title="LCS je ve výchozím stavu zaškrtnuté"}
Se zaškrtnutým **LCS** působí `fz` ve směru lokální osy z prvku, tedy kolmo ke sklonu: jako vítr na střechu, ne jako sníh. U vodorovného nosníku je obojí totéž, a proto se to snadno přehlédne. Kam zatížení míří, ukazují jeho šipky; podrobnosti najdete v kapitole [Zatížení](/cs/essentials/loads#uniformly-distributed-load).
::

::

## Výsledky {#results}

Nosník je vyřešený, jakmile zadáte zatížení. V možnostech zobrazení vpravo nahoře v okně konstrukce (ozubeným kolem je zobrazíte a skryjete) jsou od začátku zapnuté **Deformovaný tvar**, **M<sub>y</sub> (x)** a **Reakce**; zaškrtněte ještě **N (x)** a **V<sub>z</sub> (x)**. Tytéž průběhy ukazuje i přepínač pod obrázkem nahoře.

EduBeam popisuje průběhy a reakce v kN a kNm na dvě desetinná místa, takže uvidíte:

- V každé podpoře `6,00` směrem nahoru. Pevný kloub nemá vodorovnou šipku: nepřenáší žádnou vodorovnou sílu.
- Uprostřed rozpětí vrchol ohybového momentu `6,00` kNm.
- Posouvající sílu `4,80` kN v uzlu 1 a `-4,80` v uzlu 2.
- Normálovou sílu `-3,60` kN v uzlu 1 (tlak) a `3,60` v uzlu 2 (tah), uprostřed rozpětí nulovou.

## Kontrola ručním výpočtem {#check-by-hand}

**Reakce.** Výslednice 12 kN působí v půdorysné vzdálenosti 2 m od uzlu 1, takže momentové podmínky k oběma koncům dávají $V_1 = V_2 = 6$ kN. Žádná vodorovná síla nepůsobí, proto $H_1 = 0$.

**Ohybový moment.** U svislých sil se uplatní jen vodorovná ramena. V půdorysné vzdálenosti $x$ od uzlu 1 platí

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

přesně jako u vodorovného nosníku o rozpětí $a = 4$ m se stejným zatížením na metr půdorysu.

**Posouvající a normálová síla.** Síly vlevo od řezu v místě $x$ dávají dohromady svislou sílu $T(x) = V_1 - s\,x$. Rozložte ji na složku kolmou k prvku a složku ve směru prvku:

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | Uzel 1, $T = +6$ kN | Střed rozpětí, $T = 0$ | Uzel 2, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0{,}8 = 4{,}8$ kN | 0 | −4,8 kN |
| $N$ | $-6 \cdot 0{,}6 = -3{,}6$ kN | 0 | +3,6 kN |
| $M$ | 0 | 6 kNm | 0 |

Vše souhlasí s EduBeamem. Reakce v uzlu 1, která míří nahoru, tlačí dolní konec vzhůru po sklonu, do prvku: tlak. Reakce v uzlu 2, která také míří nahoru, táhne horní konec dál vzhůru po sklonu, od prvku: tah. Znaménka se řídí směrem prvku, od uzlu 1 k uzlu 2, jak vysvětluje [znaménková konvence](/cs/elements/conventions#internal-forces).

## Experimentujte {#experiment}

Měňte vždy jen jednu věc, odhadněte výsledek a teprve pak se podívejte. Zkratkou <kbd>Ctrl</kbd>+<kbd>Z</kbd> každou změnu vrátíte.

**Zapomeňte na kosinus.** Zadejte `fz = 3` místo 2,4. To jsou 3 kN na metr délky krokve, celkem 15 kN, a všechny výsledky vyjdou o 25 % větší: reakce 7,5 kN a moment 7,5 kNm. U střechy se sklonem 30° by chyba byla 15 %, při sklonu 45° 41 %.

**Nechte LCS zaškrtnuté.** U zatížení 2,4 kN/m zaškrtněte **LCS**. Zatížení teď působí kolmo ke sklonu, jako vítr, a má vodorovnou složku 7,2 kN, kterou může přenést jen pevný kloub. Moment vzroste na $2{,}4 \cdot 5^2/8 = 7{,}5$ kNm a normálová síla bude konstantní tah 4,5 kN.

::model-figure{caption="Stejných 2,4 kN/m se zaškrtnutým LCS: kolmo ke sklonu, takže pevný kloub přenáší 7,2 kN do strany"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Natočte posuvný kloub.** **LCS** znovu odškrtněte a změňte jen směr, ve kterém se posuvný kloub v uzlu 2 posouvá. Klikněte na uzel 2 → **Podepření uzlu**, do pole **Pootočení systému souřadnic** napište `-36.87` a stiskněte <kbd>Enter</kbd> (nebo hodnotu zadejte do pole **α** v řádku uzlu v tabulce **Uzly**).

![Nabídka Podepření uzlu u uzlu 2: symboly podpor, podepřené směry a Pootočení systému souřadnic](/screenshots/cs/p2t-node-supports-angle.webp){.shot-md}

Úhel natáčí vlastní osy uzlu. Ve výchozích osách (x doprava, z dolů) je záporný úhel natočí na obrazovce proti směru hodinových ručiček. Více najdete v kapitole [Šikmé podpory](/cs/essentials/nodes-supports#inclined-skewed-supports).

Posuvný kloub se teď posouvá podél sklonu, takže jeho reakce je kolmá k prvku: z momentové podmínky k uzlu 1 vychází $12 \cdot 2 / 5 = 4{,}8$ kN. Zbytek převezme pevný kloub, a s ním i celou normálovou sílu: −7,2 kN v uzlu 1, nula v uzlu 2. (EduBeam může u uzlu 2 ukázat `-0,00`, stopu po zaokrouhlení úhlu na −36,87°.)

::model-figure{caption="Posuvný kloub v uzlu 2 natočený o −36,87°, aby se posouval podél sklonu: normálová síla probíhá od −7,2 kN do nuly"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Udělejte z něj svislý posuvný kloub.** Vraťte úhel na 0 a uzlu 2 dejte **Svislý posuvný kloub**. Ten se posouvá svisle, takže může tlačit jen do strany: momentová podmínka k uzlu 1, $H_2 \cdot 3 = 12 \cdot 2$, dává 8 kN a pevný kloub drží krokev proti tomuto rozpěru. Celý prvek je tlačený.

::model-figure{caption="Svislý posuvný kloub v uzlu 2: vodorovný rozpěr 8 kN a celá krokev v tlaku"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

Všechny tři posuvné klouby vedle sebe:

| Posuvný kloub v uzlu 2 | Reakce v uzlu 2 | Reakce v uzlu 1 | $N$ od uzlu 1 k uzlu 2 |
| --- | --- | --- | --- |
| Vodorovný | 6 kN ↑ | 6 kN ↑ | −3,6 až +3,6 kN |
| Podél sklonu | 4,8 kN ⊥ k prvku | 2,88 kN →, 8,16 kN ↑ | −7,2 až 0 kN |
| Svislý | 8 kN ← | 8 kN →, 12 kN ↑ | −13,6 až −6,4 kN |

**Ohybový moment se nikdy nezmění**, a posouvající síla také ne: ve všech třech případech je to 6 kNm a ±4,8 kN. Uzel 1, uzel 2 i každý řez leží na jedné přímce, na ose prvku. Složka reakce v uzlu 2, která působí podél této přímky, nemá k žádnému z těchto bodů moment, takže přidává jen normálovou sílu. Složka kolmá k prvku vychází z momentové podmínky k uzlu 1 vždy 4,8 kN, ať posuvný kloub míří kamkoli. Směr posuvného kloubu rozhoduje jen o tom, kam se rozpěr přenese, a na tom záleží zdi nebo schodišťové podestě, která ho musí převzít.

## Co dál {#next-steps}

::card-grid{cols="2"}
:::card{title="Procvičování: nosníky s převislým koncem" icon="lucide:dices" to="/cs/practice?p=O2048"}
Reakce a největší moment nosníku se spojitým zatížením, s okamžitou kontrolou vašich odpovědí. Začněte úlohou O2048; další dostanete, když ponecháte vybraný jen typ **Nosník s převislým koncem** a stisknete **Nová úloha**.
:::
:::card{title="Další: trojkloubový rám" icon="lucide:triangle" to="/cs/tutorials/three-hinged-frame"}
Čtyři pruty, vnitřní kloub a vodorovný rozpěr: rám, který pořád vyřešíte ze samotných podmínek rovnováhy.
:::
::
