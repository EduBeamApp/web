---
description: "Nastavenia EduBeamu: jazyk, jednotky SI alebo americké, formát čísel, osi z nadol alebo y nahor, mriežka, štýl a farby priebehov a čo sa ukladá v prehliadači."
source: site
---

# Jednotky a nastavenia

Zvoľte si jazyk, jednotky a osi, s ktorými pracujete, aj vzhľad výkresu. Nastavenia menia len to, ako sa model zobrazuje a zadáva: samotný model sa vždy ukladá v jednotkách SI s osou z smerujúcou nadol, takže projekt aj odkaz sa otvoria rovnako pri akýchkoľvek nastaveniach.

Nastavenia otvoríte tromi spôsobmi:

- kartou **Nastavenia** nad zobrazením – nastavenia sa potom zobrazia na celej ploche namiesto modelu, a to na stránke *Jazyk a prostredie*; späť sa vrátite kartou **Konštrukcia**;
- **štítkom jednotiek** vpravo dole v zobrazení (`m m² kN kNm MPa`) – otvoria sa ako dialóg na stránke *Jazyk a prostredie*;
- tlačidlom **Všetky nastavenia** pod [možnosťami zobrazenia](/sk/essentials/user-interface#display-options) – otvorí sa dialóg na stránke *Nastavenia zobrazenia*.

Nastavenia sa ukladajú v prehliadači, takže vydržia aj obnovenie stránky. Tlačidlo **Obnoviť predvolené nastavenia** pod zoznamom stránok vráti predvolené hodnoty: formát čísel, osi, tlačidlo na posun, jednotky vášho regiónu a všetky nastavenia a možnosti zobrazenia. Jazyk zostane zachovaný. Obnovenie nastavení nemožno vrátiť späť.

## Jazyk a prostredie {#language-locale}

![Nastavenia → Jazyk a prostredie](/screenshots/sk/settings-language.webp)

**Jazyk.** Rozhranie je k dispozícii v 22 jazykoch; pri prvej návšteve sa EduBeam riadi jazykom prehliadača. Desatinný oddeľovač sa riadi zvoleným jazykom. Jazyk môžete čitateľovi určiť aj odkazom: pridajte parameter `?lang=` s jedným z kódov `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (čínština), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`.

**Formát čísel.** Určuje, ako sa zapisujú výsledky v tabuľkách a v hodnotách pri kurzore: *Vedecký* (1,5 · 10⁴, predvolený), *Inžiniersky* (15 · 10³) alebo *Automatický*. Pozrite [Formát čísel](/sk/essentials/results#number-format).

**Súradný systém.** *x doprava, z nadol* (predvolený) alebo *x doprava, y nahor*. Pri voľbe *x doprava, y nahor* sa zvislá os volá y a smeruje nahor a momenty sa vzťahujú k osi z. Zvislé súradnice, sily, posunutia, reakcie a uhly podpier zmenia znamienko a všetky vstupy, tabuľky, popisy aj exporty používajú nové názvy. Model, výkres aj uložené súbory zostanú presne rovnaké. Pozrite [Osi s y nahor](/sk/elements/conventions#y-up-axes).

![Trojkĺbový rám s osou y nahor: ukazovateľ osí v rohu ukazuje os y nahor](/screenshots/sk/settings-y-up.webp){.shot-lg}

**Sústava jednotiek.** Voľba *SI (metrická)* alebo *Americká (imperiálna)* nastaví naraz všetky jednotky. Pri prvej návšteve sústavu vyberáte v uvítacom dialógu. EduBeam vám americké jednotky ponúkne len vtedy, keď má prehliadač nastavené americké miestne nastavenia *a* počítač je v americkom časovom pásme; inde vždy ponúkne SI. Keď potom ktorúkoľvek jednotku zmeníte, sústava sa zobrazí ako *Vlastná*.

### Jednotky {#units}

Každá veličina má vlastnú jednotku. Používajú ju vstupy (jednotka je uvedená na konci poľa), tabuľky, popisy aj hodnoty v priebehoch a po zmene jednotky sa zobrazené hodnoty prepočítajú. V modeli sa nič nemení, takže prepínaním tam a späť nič nestratíte.

| Veličina | Možnosti | SI | Americké |
| --- | --- | --- | --- |
| Dĺžka (geometria, poloha zaťaženia) | m, cm, mm, ft, in | m | ft |
| Rozmery prierezu | m, cm, mm, ft, in | m | in |
| Posunutie (výsledky, predpísané posunutia) | m, cm, mm, ft, in | m | in |
| Plocha | m², cm², mm², ft², in² | m² | in² |
| Moment zotrvačnosti | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Hmotnosť | kg, lb | kg | lb |
| Sila | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Ohybový moment | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Napätie (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Teplota | °C, °F | °C | °F |

Niektoré jednotky vyplývajú z ostatných:

- **Spojité zaťaženie** je sila na jednotku dĺžky: kN/m v SI, kip/ft v amerických jednotkách.
- **Hustota** je hmotnosť na jednotku objemu (dĺžka³): kg/m³ alebo lb/ft³.
- **Súčiniteľ teplotnej rozťažnosti** sa riadi jednotkou teploty: 1/K alebo 1/°F. Teplotné zaťaženia sú *zmeny* teploty, takže 10 °C zodpovedá 18 °F.
- **Pootočenia** sú vždy v radiánoch, uhly podpier v stupňoch.

Tonf je metrická tona-sila (1000 kgf), nie americká krátka tona (short ton). Americké jednotky sa prevádzajú podľa presných definícií: 1 ft = 0,3048 m, 1 kip = 4448,2216 N. Stopy zadávajte ako desatinné číslo, napríklad `5.5`; pravítka a zameriavací kríž ukazujú stopy a palce (5′-6″).

## Nastavenia zobrazenia {#viewer-settings}

Tu nastavíte vzhľad výkresu. **Náhľad zobrazenia** vpravo ukazuje malý šikmý nosník, na ktorom hneď uvidíte každú zmenu. Tlačidlá pod ním určujú, ktorý výsledok náhľad ukazuje; keď zmeníte nastavenie priebehu alebo farbu, náhľad sa na príslušný výsledok prepne sám.

![Nastavenia → Nastavenia zobrazenia, vpravo živý náhľad a nastavenia priebehov](/screenshots/sk/b-settings-viewer.webp)

Ľavý stĺpec zhora:

- *Mriežka*: **Zobraziť mriežku** (<kbd>G</kbd>) vykreslí mriežku a pravítka; **Prichytávať k mriežke** (<kbd>S</kbd>) prichytí k mriežke uzly, ktoré umiestňujete alebo presúvate; **Zobraziť zameriavací kríž** vyznačí na pravítkach polohu kurzora myši. Všetky tri voľby sú predvolene zapnuté. **Krok prichytávania k mriežke** je 0,1 m, v amerických jednotkách 0,5 ft. Keď prepnete medzi metrickými a americkými jednotkami, krok, ktorý má ešte predvolenú hodnotu, sa zmení na predvolený krok druhej sústavy; krok, ktorý ste nastavili sami, zostane.
- *Veľkosť*: **Mierka výsledkov** od 8 do 120 px (predvolene 48 px) udáva, ako vysoko sa vykreslí najväčšia poradnica priebehu alebo najväčší priehyb. Ide čisto o vzhľad, pretože každý priebeh sa mierkuje podľa svojej najväčšej hodnoty. **Veľkosť podpier** je od 50 do 150 % (predvolene 100 %) a **Veľkosť písma** od 10 do 20 px (predvolene 14 px); na projektore sa hodí väčšia.
- *Orientácia popisov výsledkov*: hodnoty písané pozdĺž poradnice, teda *Kolmo na graf* (predvolené), alebo *Vždy vodorovne*.
- *Kontrola modelu*: **Zobraziť, ako sa môže nestabilná konštrukcia pohybovať** vykreslí čiarkovaný obrys mechanizmu a **Animovať pohyb** ho rozkýve tam a späť. Obe voľby sú predvolene zapnuté.

### Priebehy vnútorných síl {#internal-force-diagrams}

Na rôznych školách sa priebehy kreslia rôzne, a preto si v EduBeame môžete vybrať. Tieto nastavenia menia len kresbu, nikdy hodnoty. **Čiarkovaná čiara** pozdĺž každého prvku označuje jeho dolné vlákna, teda stranu, kam smeruje jeho lokálna os z (pozrite časť [Orientácia prvku](/sk/essentials/elements#element-direction)).

| Nastavenie | Možnosti | Predvolené |
| --- | --- | --- |
| **Ohybový moment** | kreslí sa *Na ťahanej strane* alebo *Na tlačenej strane* | *Na ťahanej strane* |
| **Kladná priečna sila** | *Opačná strana* (odvrátená od čiarkovanej čiary) alebo *Čiarkovaná strana* | *Opačná strana* |
| **Kladná normálová sila** | *Opačná strana* alebo *Čiarkovaná strana* | *Opačná strana* |
| **Výplň** | *Plná*, *Šrafovaná* (čiary naprieč prvkom ako pri ručnom kreslení) alebo *Žiadna* | *Plná* |
| **Stupeň polynómu na úsekoch** | ku každému úseku priebehu pripíše stupeň polynómu, 0° až 3° | vypnuté |

Ako čítať znamienka, vysvetľuje stránka [Výsledky a priebehy](/sk/essentials/results#reading-the-sign).

### Farby {#colors}

Samostatné farby pre uzly, prvky, zaťaženie, deformovaný tvar, normálovú silu, priečnu silu, ohybový moment a reakcie. Farbu vyberiete kliknutím na vzorku. Predvolené farby: zaťaženie oranžová, deformovaný tvar sivá, N modrá, V zelená, M červená, reakcie fialová, uzly a prvky čierna.

## Ovládanie a skratky {#controls-shortcuts}

**Posun zobrazenia pomocou** určuje, ktorým tlačidlom myši plátno posúvate: *Koliesko alebo pravé tlačidlo* (predvolené), *Koliesko myši* (stlačte koliesko a ťahajte) alebo *Pravé tlačidlo*. Všetky skratky nájdete na stránke [Klávesnica, myš a dotyk](/sk/reference/shortcuts).

## Čo sa ukladá v prehliadači {#what-is-stored-in-your-browser}

Okrem nastavení si EduBeam v lokálnom úložisku prehliadača uchováva:

- **aktuálny model** – ukladá sa po každej zmene, takže sa po obnovení stránky alebo opätovnom otvorení aplikácie vráti;
- **Nedávne konštrukcie** – posledných 10 modelov, ktoré ste vymazali alebo nahradili; obnovíte ich z ponuky ☰.

Oboje patrí len k tomuto prehliadaču na tomto zariadení a vymazaním údajov webu zmizne. Ak chcete model uchovať alebo preniesť na iné zariadenie, použite [Uložiť projekt alebo Zdieľať konštrukciu](/sk/essentials/import-export).
