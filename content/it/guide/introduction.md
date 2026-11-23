---
description: "Che cos’è EduBeam: un solutore FEM gratuito nel browser per travi, telai e travature 2D. Cosa fa e cosa no, a chi serve, la guida e le librerie open source."
source: site
---

# Introduzione

[EduBeam]{.edubeam} è un’app gratuita di analisi strutturale per **travi, telai e travature reticolari** che funziona nel browser. Disegna la struttura, assegna vincoli e carichi: il solutore agli elementi finiti ricalcola diagrammi, reazioni e frecce a ogni tua modifica. Non c’è un pulsante *Calcola*, non devi installare nulla né creare un account.

::div{.actions}
[Avvia EduBeam ↗](https://run.edubeam.app/?lang=it){target="_blank"} [Avvio rapido, 10 minuti](/it/guide/quick-start)
::

![Un telaio a tre cerniere in EduBeam: carichi in arancione, reazioni in viola, momento flettente in rosso e deformata in grigio](/screenshots/it/hero.webp)

:span{#your-first-visit}

## Cosa fa {#what-it-does}

::card-grid{cols="2"}
:::card{title="Strutture" icon="lucide:triangle" to="/it/essentials/elements"}
Travi, travi continue, telai e travature reticolari nel piano x–z, modellati con elementi trave di Timoshenko. Con le cerniere di estremità un’asta lavora come asta reticolare (biella).
:::
:::card{title="Vincoli" icon="lucide:anchor" to="/it/essentials/nodes-supports#supports"}
Cerniera, carrello, incastro, pattino o qualsiasi combinazione di `Dx`, `Dz` e `Ry` bloccati, da scegliere tramite il simbolo. Vincoli inclinati e cedimenti vincolari.
:::
:::card{title="Carichi" icon="lucide:arrow-down-to-line" to="/it/essentials/loads"}
Forze e momenti nei nodi o in qualsiasi punto di un’asta, carichi distribuiti uniformi e trapezoidali, carichi termici e spostamenti imposti.
:::
:::card{title="Sezioni" icon="lucide:shapes" to="/it/essentials/elements#cross-sections"}
Librerie europee e statunitensi, oppure qualsiasi poligono disegnato da te, con il calcolo di $A$, $I_y$, $I_z$, $I_{yz}$, assi principali e raggi d’inerzia.
:::
:::card{title="Risultati" icon="lucide:chart-spline" to="/it/essentials/results"}
Diagrammi di **N**, **V** e **M**, deformata, reazioni, spostamenti nodali, forze di estremità e matrici di rigidezza degli elementi.
:::
:::card{title="Analisi" icon="lucide:calculator" to="/it/elements/analysis"}
Statica lineare, esatta per il modello lineare: non c’è una mesh da infittire. Se una struttura non sta in piedi, EduBeam spiega perché e ne anima il moto.
:::
:::card{title="File" icon="lucide:folder-open" to="/it/essentials/import-export"}
Progetti in JSON, interi modelli come link, disegni in PNG o SVG, risultati in CSV. I modelli sostituiti restano recuperabili e nulla esce dal tuo dispositivo.
:::
:::card{title="Unità" icon="lucide:ruler" to="/it/essentials/units-settings"}
Unità SI o statunitensi con un clic, oppure una grandezza alla volta. L’asse z verso il basso, oppure l’asse y verso l’alto dei libri di testo.
:::
::

## Cosa non fa (ancora) {#what-it-does-not-do-yet}

Conoscere i limiti fin dall’inizio fa risparmiare tempo:

::div{.limits}
- **Solo 2D.** Nessun comportamento fuori dal piano, nessun telaio 3D.
- **Solo statica lineare.** Niente effetti del secondo ordine (P–Δ), instabilità, dinamica o plasticità.
- **Un solo caso di carico.** Niente combinazioni né inviluppi: salva ogni caso in un file o in un link a parte.
- **Niente peso proprio.** Applicalo come carico distribuito.
- **Nessuna verifica di progetto.** EduBeam fornisce forze interne e spostamenti; le verifiche normative spettano a te.
::

Se ti manca una funzione importante, [apri una issue](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## A chi si rivolge? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Studenti" icon="lucide:graduation-cap" to="/it/practice"}
Un riscontro immediato sui calcoli a mano ed esercizi che verificano le risposte man mano che procedi.
:::
:::card{title="Docenti" icon="lucide:presentation" to="/it/guide/teaching"}
Mostra dal vivo, al proiettore e in 22 lingue, come vincoli, cerniere e carichi cambiano le forze interne, e stampa un compito diverso per ogni studente.
:::
:::card{title="Ingegneri" icon="lucide:hard-hat" to="/it/elements/analysis"}
Un rapido controllo di plausibilità prima di aprire un software desktop più pesante, con ogni passo della soluzione documentato.
:::
:::card{title="Sviluppatori" icon="lucide:code-xml" to="#libraries"}
Il solutore e i disegni su cui si basa EduBeam, come librerie open source da usare nel tuo codice.
:::
::

## Come orientarsi nella guida {#how-this-guide-is-organised}

La barra laterale raggruppa le pagine come qui sotto. I pulsanti **?** nell’app aprono la pagina corrispondente di questa guida, nella tua lingua.

::card-grid{cols="2"}
:::card{title="Per iniziare" icon="lucide:flag" to="/it/guide/quick-start"}
Questa pagina e l’Avvio rapido: la prima trave in dieci minuti.
:::
:::card{title="Crea un modello" icon="lucide:pencil-ruler" to="/it/essentials/user-interface"}
L’interfaccia, nodi e vincoli, elementi, materiali e sezioni, carichi, unità e impostazioni.
:::
:::card{title="Leggi i risultati" icon="lucide:chart-spline" to="/it/essentials/results"}
I diagrammi e le tabelle dei risultati, e come verificarli a mano.
:::
:::card{title="Condividi e insegna" icon="lucide:share-2" to="/it/essentials/import-export"}
File di progetto, link condivisi, esportazione di immagini e CSV, e come insegnare con EduBeam.
:::
:::card{title="Tutorial" icon="lucide:triangle" to="/it/tutorials/inclined-beam"}
Una trave inclinata, un telaio a tre cerniere, una travatura reticolare piana e una trave continua con il cedimento di un appoggio, ciascuno costruito passo passo e verificato a mano.
:::
:::card{title="Esempi" icon="lucide:library" to="/it/examples/"}
Sei modelli già pronti che si aprono con un clic, con esercizi e soluzioni.
:::
:::card{title="Manuale teorico" icon="lucide:sigma" to="/it/elements/conventions"}
Assi e convenzioni dei segni, l’elemento trave e l’elemento reticolare, e come EduBeam risolve un modello.
:::
:::card{title="Aiuto" icon="lucide:life-buoy" to="/it/reference/shortcuts"}
Tastiera, mouse e touch, risoluzione dei problemi e domande frequenti.
:::
::

## Crea i tuoi strumenti {#libraries}

EduBeam si basa su due librerie open source, documentate su questo sito. Usale per risolvere strutture in uno script, generare un esercizio diverso per ogni studente o disegnare figure per le slide e le dispense.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/it/solver"}
Il solutore agli elementi finiti di EduBeam, in TypeScript: modelli, risolvi e leggi i risultati di una trave in una dozzina di righe, nel browser o in Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/it/plot"}
Componenti Vue 3 che disegnano in SVG una struttura risolta, con i carichi, le reazioni e i diagrammi di N, V e M.
:::
::

## Lingue {#languages}

EduBeam parla 22 lingue e si avvia in quella del tuo browser. Puoi cambiarla in **Impostazioni → Lingua e impostazioni locali**, oppure sceglierla qui:

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-hu"} Magyar](https://run.edubeam.app/?lang=hu){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-ro"} Română](https://run.edubeam.app/?lang=ro){target="_blank"}
- [:icon{name="circle-flags:lang-sk"} Slovenčina](https://run.edubeam.app/?lang=sk){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-el"} Ελληνικά](https://run.edubeam.app/?lang=el){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

Anche un link può scegliere la lingua per chi lo apre: `run.edubeam.app/?lang=it` apre l’app in italiano.

## Autori e riconoscimenti {#authors-credits}

[EduBeam]{.edubeam} è sviluppato da [Jan Voříšek](https://github.com/janvorisek) come progetto indipendente. Raccoglie l’eredità dell’EduBeam desktop per Windows e Linux, creato da [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) e [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) presso il Dipartimento di Meccanica della [Facoltà di Ingegneria Civile del Politecnico di Praga (ČVUT)](https://www.fsv.cvut.cz/en), e ne apre ancora i file di sessione. Il suo solutore, [@edubeam/fem](/it/solver), è nato dalla prima versione scritta da Bořek Patzák. Sia l’app sia il solutore sono open source, con licenza GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Sviluppatore principale e product designer","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Sviluppatore: controllo touch, prestazioni del disegno, carichi e vincoli","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"L’EduBeam originale e il primo solutore FEM","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Contribuisci {#contribute}

::card-grid{cols="3"}
:::card{title="Segnala un problema" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Qualcosa di poco chiaro, sbagliato o che non funziona? Una issue su GitHub arriva direttamente al team.
:::
:::card{title="Migliora una traduzione" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
I testi dell’app stanno in un file per ogni lingua; una pull request è sempre benvenuta.
:::
:::card{title="Passaparola" icon="lucide:share-2"}
Fai conoscere EduBeam a compagni di corso e colleghi, oppure inserisci il link a un modello nelle tue dispense.
:::
::
