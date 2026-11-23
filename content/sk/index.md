---
description: "Statický výpočet 2D konštrukcií zadarmo v prehliadači. Nakreslite nosník, rám alebo priehradovú konštrukciu, zadajte zaťaženie a hneď uvidíte priebehy N, V, M, reakcie a priehyby."
source: site
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "Stavebná mechanika online a zadarmo"
  tagline: Nakreslite nosník, rám alebo priehradovú konštrukciu, pridajte zaťaženie a sledujte, ako sa priebehy menia s každou úpravou. Plnohodnotný výpočet MKP priamo v prehliadači – bez inštalácie, bez registrácie a bez poplatkov.
  image:
    src: /screenshots/sk/hero.webp
    alt: Aplikácia EduBeam s vyriešeným rámom
  actions:
    - theme: brand
      text: Spustiť aplikáciu
      link: https://run.edubeam.app/?lang=sk
    - theme: alt
      text: Prečítať príručku
      link: /sk/guide/introduction
    - theme: alt
      text: Pozrieť príklady
      link: /sk/examples/

features:
  - icon: ⚡
    title: Výsledky už pri kreslení
    details: Tlačidlo Vypočítať tu nenájdete. Presuňte uzol, zaškrtnite kĺb alebo zmeňte zaťaženie a N, V, M, reakcie aj deformovaný tvar sa okamžite prepočítajú.
    link: /sk/essentials/results
    linkText: Výsledky a priebehy
  - icon: 🧑‍🏫
    title: Navrhnutý pre výučbu
    details: Sprievodca prvými krokmi, hodnoty pri kurzore, riešič, ktorý vysvetlí, prečo je konštrukcia mechanizmom, a odkazy, ktoré vložíte priamo do skrípt.
    link: /sk/guide/teaching
    linkText: Výučba s EduBeamom
  - icon: 🌍
    title: Váš jazyk, vaše jednotky
    details: 22 jazykov rozhrania, jednotky SI alebo americké a voľba medzi osou z nadol a učebnicovou osou y nahor.
    link: /sk/essentials/units-settings
    linkText: Jednotky a nastavenia
  - icon: 🔗
    title: Zdieľanie, export a vkladanie
    details: Celý model pošlete ako odkaz alebo uložíte do súboru, výkres exportujete do PNG alebo SVG a tabuľky výsledkov do CSV.
    link: /sk/essentials/import-export
    linkText: Súbory, odkazy a export
---

## Kde začať {#start-here}

::div{.start-grid}

**Začínate s EduBeamom?** Prejdite si desaťminútový [Rýchly štart](/sk/guide/quick-start). Krok za krokom vymodelujete prostý nosník a každý výsledok overíte ručným výpočtom.

**Viete, čo chcete namodelovať?** Pustite sa rovno do [návodu](/sk/tutorials/three-hinged-frame) alebo otvorte hotový [príklad](/sk/examples/) a upravte si ho.

**Vyučujete?** Na stránke [Výučba s EduBeamom](/sk/guide/teaching) nájdete odkazy na zdieľanie zadaní, vloženie modelu do prezentácií a cvičenia.

::

::div{.shots}

![Priehradová konštrukcia: normálové sily, ťah kladný](/screenshots/sk/tut-truss.webp)

![Odhalený mechanizmus: EduBeam ukáže, prečo konštrukciu nemožno vyriešiť](/screenshots/sk/ui-mechanism.webp)

::

## Čo v EduBeame namodelujete {#what-you-can-model}

- **Nosníky, rámy a priehradové konštrukcie** v rovine: spojité nosníky, dvojkĺbové rámy, trojkĺbové oblúky, priehradové konštrukcie s kĺbovými uzlami.
- **Ľubovoľné podpery**: pevný kĺb, posuvný kĺb, votknutie, posuvné votknutie, šikmé podpery aj poklesy podpier.
- **Zaťaženie**: osamelé sily a momenty, rovnomerné a lichobežníkové spojité zaťaženie, osamelé sily kdekoľvek na prúte a zmena teploty.
- **Ľubovoľný prierez**: z knižnice (IPE, HEA, AISC W, HSS, obdĺžniky, rúry) alebo nakreslený ako polygón; prierezové charakteristiky sa vypočítajú automaticky.

Podrobnosti nájdete v [Úvode](/sk/guide/introduction).

::elementarium-promo
::
