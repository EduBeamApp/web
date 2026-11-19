---
description: "Analisi strutturale 2D gratuita nel browser. Disegna travi, telai e travature reticolari, aggiungi i carichi e ottieni subito N, V, M, reazioni e frecce."
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "EduBeam"
  text: "Analisi strutturale online e gratuita"
  tagline: Disegna una trave, un telaio o una travatura reticolare, aggiungi i carichi e guarda i diagrammi aggiornarsi a ogni modifica. Risultati FEM completi nel browser, senza installare nulla, senza account e senza costi.
  image:
    src: /screenshots/it/hero.webp
    alt: L’app EduBeam con un telaio risolto
  actions:
    - theme: brand
      text: Avvia l’app
      link: https://run.edubeam.app/?lang=it
    - theme: alt
      text: Leggi la guida
      link: /it/guide/introduction
    - theme: alt
      text: Vedi gli esempi
      link: /it/examples/

features:
  - icon: ⚡
    title: Risultati mentre disegni
    details: Non c’è un pulsante «Calcola». Trascina un nodo, spunta una cerniera o cambia un carico, e N, V, M, reazioni e deformata si aggiornano all’istante.
    link: /it/essentials/results
    linkText: Leggere i risultati
  - icon: 🧑‍🏫
    title: Pensato per la didattica
    details: Primi passi guidati, valori al passaggio del mouse, un solutore che spiega perché una struttura è un meccanismo e link condivisi da inserire nelle dispense.
    link: /it/guide/teaching
    linkText: Insegnare con EduBeam
  - icon: 🌍
    title: La tua lingua, le tue unità
    details: 18 lingue dell’interfaccia, unità SI o statunitensi (imperiali) e la scelta tra l’asse z verso il basso e l’asse y verso l’alto dei libri di testo.
    link: /it/essentials/units-settings
    linkText: Unità e impostazioni
  - icon: 🔗
    title: Condividi, esporta, incorpora
    details: Invia un intero modello come link, salvalo in un file, esporta il disegno in PNG o SVG e le tabelle dei risultati in CSV.
    link: /it/essentials/import-export
    linkText: File, link ed esportazione
---

## Da dove iniziare {#start-here}

::div{.start-grid}

**Usi EduBeam per la prima volta?** Segui l’[Avvio rapido](/it/guide/quick-start), dieci minuti in tutto: modelli passo passo una trave semplicemente appoggiata e verifichi a mano ogni risultato.

**Sai già cosa vuoi modellare?** Passa direttamente a un [tutorial](/it/tutorials/three-hinged-frame) oppure apri un [esempio](/it/examples/) già pronto e modificalo.

**Tieni un corso?** Leggi [Insegnare con EduBeam](/it/guide/teaching): link condivisi per gli esercizi da assegnare, un visualizzatore da incorporare nelle slide ed esercizi.

::

::div{.shots}

![Una travatura reticolare: sforzi normali, trazione positiva](/screenshots/it/tut-truss.webp)

![Un meccanismo reso visibile: EduBeam mostra perché il modello non si può risolvere](/screenshots/it/ui-mechanism.webp)

::

## Cosa puoi modellare {#what-you-can-model}

- **Travi, telai e travature reticolari** nel piano: travi continue, telai a portale, archi a tre cerniere, travature reticolari con nodi a cerniera.
- **Qualsiasi vincolo**: cerniera, carrello, incastro, pattino, vincoli inclinati e cedimenti vincolari.
- **Carichi**: forze e momenti concentrati, carichi distribuiti uniformi e trapezoidali, carichi concentrati in qualsiasi punto di un’asta e carichi termici.
- **Qualsiasi sezione**: dalla libreria (IPE, HEA, AISC W, HSS, rettangoli, tubi) oppure disegnata come poligono, con le proprietà calcolate automaticamente.

Trovi tutti i dettagli nell’[Introduzione](/it/guide/introduction).

::elementarium-promo
::
