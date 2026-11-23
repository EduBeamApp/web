---
description: "EduBeam, solveur aux éléments finis gratuit pour poutres, portiques et treillis 2D : ce qu’il fait ou non, pour qui, le guide et les bibliothèques open source."
source: site
---

# Introduction

[EduBeam]{.edubeam} est une application gratuite de calcul des structures pour les **poutres, portiques et treillis**, qui fonctionne dans votre navigateur. Dessinez une structure, ajoutez ses appuis et ses charges : le solveur aux éléments finis recalcule les diagrammes, les réactions et les flèches à chacune de vos modifications. Il n’y a pas de bouton *Calculer*, rien à installer et aucun compte à créer.

::div{.actions}
[Lancer EduBeam ↗](https://run.edubeam.app/?lang=fr){target="_blank"} [Démarrage rapide, 10 minutes](/fr/guide/quick-start)
::

![Un portique à trois articulations dans EduBeam : charges en orange, réactions en violet, moment fléchissant en rouge et déformée en gris](/screenshots/fr/hero.webp)

:span{#your-first-visit}

## Ce que fait EduBeam {#what-it-does}

::card-grid{cols="2"}
:::card{title="Structures" icon="lucide:triangle" to="/fr/essentials/elements"}
Poutres, poutres continues, portiques et treillis dans le plan x–z, construits à partir d’éléments poutre de Timoshenko. Avec des rotules à ses extrémités, une barre devient une barre de treillis.
:::
:::card{title="Appuis" icon="lucide:anchor" to="/fr/essentials/nodes-supports#supports"}
Articulation, appui simple, encastrement, glissière, ou toute combinaison de `Dx`, `Dz` et `Ry` bloqués, choisis par leur symbole. Appuis inclinés et tassements d’appui.
:::
:::card{title="Charges" icon="lucide:arrow-down-to-line" to="/fr/essentials/loads"}
Forces et moments aux nœuds ou en tout point d’une barre, charges linéaires uniformes et trapézoïdales, charges thermiques et déplacements imposés.
:::
:::card{title="Sections" icon="lucide:shapes" to="/fr/essentials/elements#cross-sections"}
Bibliothèques européenne et américaine, ou tout polygone que vous dessinez, avec calcul de $A$, $I_y$, $I_z$, $I_{yz}$, des axes principaux et des rayons de giration.
:::
:::card{title="Résultats" icon="lucide:chart-spline" to="/fr/essentials/results"}
Diagrammes **N**, **V** et **M**, déformée, réactions, déplacements nodaux, efforts aux extrémités et matrices de rigidité élémentaires.
:::
:::card{title="Calcul" icon="lucide:calculator" to="/fr/elements/analysis"}
Statique linéaire, exacte pour le modèle linéaire : il n’y a pas de maillage à raffiner. Quand une structure ne peut pas tenir, EduBeam explique pourquoi et anime son mouvement.
:::
:::card{title="Fichiers" icon="lucide:folder-open" to="/fr/essentials/import-export"}
Projets en JSON, modèles complets sous forme de lien, dessins en PNG ou SVG, résultats en CSV. Les modèles remplacés sont conservés, et rien ne quitte votre appareil.
:::
:::card{title="Unités" icon="lucide:ruler" to="/fr/essentials/units-settings"}
SI ou américaines en un clic, ou unité par unité. L’axe z vers le bas, ou l’axe y vers le haut des manuels.
:::
::

## Ce qu’EduBeam ne fait pas (encore) {#what-it-does-not-do-yet}

Connaître les limites dès le départ fait gagner du temps :

::div{.limits}
- **2D uniquement.** Pas de comportement hors plan, pas de portiques 3D.
- **Statique linéaire uniquement.** Pas d’effets du second ordre (P–Δ), ni flambement, ni dynamique, ni plasticité.
- **Un seul cas de charge.** Ni combinaisons ni enveloppes : enregistrez chaque cas dans son propre fichier ou lien.
- **Pas de poids propre.** Saisissez-le comme une charge linéaire.
- **Pas de vérifications réglementaires.** EduBeam donne les efforts internes et les déplacements ; les vérifications selon les normes restent à votre charge.
::

S’il vous manque une fonctionnalité importante, [ouvrez un ticket](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## À qui s’adresse EduBeam ? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Étudiants" icon="lucide:graduation-cap" to="/fr/practice"}
Un retour immédiat sur vos calculs à la main, et des exercices d’entraînement qui vérifient vos réponses au fur et à mesure.
:::
:::card{title="Enseignants" icon="lucide:presentation" to="/fr/guide/teaching"}
Montrez en direct au vidéoprojecteur comment appuis, rotules et charges modifient les efforts, dans 22 langues, et imprimez un sujet différent pour chaque étudiant.
:::
:::card{title="Ingénieurs" icon="lucide:hard-hat" to="/fr/elements/analysis"}
Une vérification rapide avant d’ouvrir un logiciel de bureau plus lourd, avec une résolution documentée étape par étape.
:::
:::card{title="Développeurs" icon="lucide:code-xml" to="#libraries"}
Le solveur et le dessin d’EduBeam, sous forme de bibliothèques open source à utiliser dans votre propre code.
:::
::

## Se repérer dans le guide {#how-this-guide-is-organised}

La barre latérale regroupe les pages comme ci-dessous. Les boutons **?** de l’application ouvrent la page correspondante de ce guide, dans votre langue.

::card-grid{cols="2"}
:::card{title="Pour commencer" icon="lucide:flag" to="/fr/guide/quick-start"}
Cette page et le Démarrage rapide : une première poutre en dix minutes.
:::
:::card{title="Créer un modèle" icon="lucide:pencil-ruler" to="/fr/essentials/user-interface"}
L’interface, les nœuds et appuis, les éléments, les matériaux et sections, les charges, les unités et paramètres.
:::
:::card{title="Lire les résultats" icon="lucide:chart-spline" to="/fr/essentials/results"}
Les diagrammes et les tableaux de résultats, et comment les vérifier à la main.
:::
:::card{title="Partager et enseigner" icon="lucide:share-2" to="/fr/essentials/import-export"}
Fichiers de projet, liens de partage, export d’images et de CSV, et l’enseignement avec EduBeam.
:::
:::card{title="Tutoriels" icon="lucide:triangle" to="/fr/tutorials/inclined-beam"}
Une poutre inclinée, un portique à trois articulations, un treillis plan et une poutre continue avec un tassement d’appui, chacun construit pas à pas et vérifié à la main.
:::
:::card{title="Exemples" icon="lucide:library" to="/fr/examples/"}
Six modèles prêts à l’emploi qui s’ouvrent en un clic, avec exercices et réponses.
:::
:::card{title="Manuel théorique" icon="lucide:sigma" to="/fr/elements/conventions"}
Axes et conventions de signes, éléments poutre et treillis, et la façon dont EduBeam résout un modèle.
:::
:::card{title="Aide" icon="lucide:life-buoy" to="/fr/reference/shortcuts"}
Clavier, souris et tactile, dépannage et FAQ.
:::
::

## Créer vos propres outils {#libraries}

EduBeam repose sur deux bibliothèques open source, documentées sur ce site. Elles vous permettent de calculer des structures dans un script, de générer un exercice différent pour chaque étudiant ou de dessiner des figures pour vos diapositives et vos notes de cours.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/fr/solver"}
Le solveur aux éléments finis d’EduBeam, en TypeScript : modélisez, calculez et lisez une poutre en une douzaine de lignes, dans le navigateur ou sous Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/fr/plot"}
Des composants Vue 3 qui dessinent en SVG une structure calculée, avec ses charges, ses réactions et ses diagrammes N, V et M.
:::
::

## Langues {#languages}

EduBeam parle 22 langues et démarre dans celle de votre navigateur. Changez-la dans **Paramètres → Langue et paramètres régionaux**, ou choisissez-en une ici :

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

Un lien peut aussi choisir la langue à la place du lecteur : `run.edubeam.app/?lang=cs` ouvre l’application en tchèque.

## Auteurs et remerciements {#authors-credits}

[EduBeam]{.edubeam} est développé par [Jan Voříšek](https://github.com/janvorisek) en tant que projet indépendant. Il prend la suite de l’EduBeam de bureau pour Windows et Linux, créé par [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) et [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) au département de mécanique de la [Faculté de génie civil de l’Université technique tchèque de Prague (ČVUT)](https://www.fsv.cvut.cz/en), et ouvre toujours ses fichiers de session. Son solveur, [@edubeam/fem](/fr/solver), est issu de la première version écrite par Bořek Patzák. L’application et le solveur sont tous deux open source, sous licence GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Développeur principal et concepteur du produit","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Développeur : commande tactile, performances du dessin, charges et appuis","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"EduBeam d’origine et premier solveur aux éléments finis","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Contribuer {#contribute}

::card-grid{cols="3"}
:::card{title="Signaler un problème" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Quelque chose de déroutant, de faux ou qui ne fonctionne pas ? Ouvrez un ticket sur GitHub : il parvient directement à l’équipe.
:::
:::card{title="Améliorer une traduction" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Les textes de l’application sont rassemblés dans un fichier par langue ; une pull request est la bienvenue.
:::
:::card{title="Faire connaître EduBeam" icon="lucide:share-2"}
Parlez d’EduBeam à vos camarades et collègues, ou mettez le lien d’un modèle dans vos notes de cours.
:::
::
