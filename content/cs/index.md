---
description: "Statický výpočet 2D konstrukcí zdarma v prohlížeči. Nakreslete nosník, rám či příhradovou konstrukci, zadejte zatížení a hned uvidíte N, V, M, reakce a průhyby."
source: site
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "Statický výpočet konstrukcí online a zdarma"
  tagline: Nakreslete nosník, rám nebo příhradovou konstrukci, přidejte zatížení a sledujte, jak se průběhy mění s každou úpravou. Plnohodnotný výpočet MKP přímo v prohlížeči – bez instalace, bez registrace a bez poplatků.
  image:
    src: /screenshots/cs/hero.webp
    alt: Aplikace EduBeam s vyřešeným rámem
  actions:
    - theme: brand
      text: Spustit aplikaci
      link: https://run.edubeam.app/?lang=cs
    - theme: alt
      text: Přečíst příručku
      link: /cs/guide/introduction
    - theme: alt
      text: Prohlédnout příklady
      link: /cs/examples/

features:
  - icon: ⚡
    title: Výsledky už při kreslení
    details: Tlačítko Spočítat tu nenajdete. Přetáhněte uzel, zaškrtněte kloub nebo změňte zatížení a N, V, M, reakce i deformovaný tvar se okamžitě přepočítají.
    link: /cs/essentials/results
    linkText: Čtení výsledků
  - icon: 🧑‍🏫
    title: Navrženo pro výuku
    details: Průvodce prvními kroky, hodnoty po najetí myší, řešič, který vysvětlí, proč je konstrukce mechanismem, a odkazy, které vložíte přímo do skript.
    link: /cs/guide/teaching
    linkText: Výuka s EduBeamem
  - icon: 🌍
    title: Váš jazyk, vaše jednotky
    details: 18 jazyků rozhraní, jednotky SI nebo americké a na výběr osa z mířící dolů, nebo učebnicová osa y nahoru.
    link: /cs/essentials/units-settings
    linkText: Jednotky a nastavení
  - icon: 🔗
    title: Sdílení, export a vkládání
    details: Celý model pošlete jako odkaz nebo uložíte do souboru, výkres exportujete do PNG nebo SVG a tabulky výsledků do CSV.
    link: /cs/essentials/import-export
    linkText: Soubory a sdílení
---

## Kde začít {#start-here}

::div{.start-grid}

**Začínáte s EduBeamem?** Projděte si [desetiminutový Rychlý start](/cs/guide/quick-start). Krok za krokem vymodelujete prostý nosník a každý výsledek ověříte ručním výpočtem.

**Víte, co chcete namodelovat?** Pusťte se rovnou do [návodu](/cs/tutorials/three-hinged-frame), nebo otevřete hotový [příklad](/cs/examples/) a upravte si ho.

**Vyučujete?** Na stránce [Výuka s EduBeamem](/cs/guide/teaching) najdete odkazy pro zadání úloh, prohlížeč pro vložení do prezentací a cvičení.

::

::div{.shots}

![Příhradová konstrukce: normálové síly, tah kladný](/screenshots/cs/tut-truss.webp)

![Odhalený mechanismus: EduBeam ukáže, proč konstrukci nelze vyřešit](/screenshots/cs/ui-mechanism.webp)

::

## Co v EduBeamu namodelujete {#what-you-can-model}

- **Nosníky, rámy a příhradové konstrukce** v rovině: spojité nosníky, portálové rámy, trojkloubové oblouky, příhradové konstrukce s kloubovými styčníky.
- **Libovolné podpory**: kloub, posuvný kloub, vetknutí, posuvné vetknutí, šikmé podpory i poklesy podpor.
- **Zatížení**: osamělé síly a momenty, rovnoměrné a lichoběžníkové spojité zatížení, osamělé síly kdekoli na prutu a změna teploty.
- **Libovolný průřez**: z knihovny (IPE, HEA, AISC W, HSS, obdélníky, trubky) nebo nakreslený jako polygon; průřezové charakteristiky se spočítají automaticky.

Podrobnosti najdete v [Úvodu](/cs/guide/introduction).

::elementarium-promo
::
