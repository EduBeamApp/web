---
description: "Enseigner avec EduBeam : modèle en direct au vidéoprojecteur, liens dans les supports de cours, devoirs vérifiables, exercices générés et sujets avec corrigé."
source: site
---

# Enseigner avec EduBeam

[EduBeam]{.edubeam} est né dans un amphithéâtre, et c’est toujours là qu’il donne le meilleur de lui-même : un modèle au vidéoprojecteur qui réagit dès que vous le modifiez, et le même modèle sur l’ordinateur de chaque étudiant grâce à un lien. Cette page rassemble ce que les enseignants utilisent le plus, du premier cours jusqu’à l’examen.

::card-grid{cols="2"}
:::card{title="En cours magistral" icon="lucide:presentation" to="#in-the-lecture"}
Rendez le modèle lisible depuis le dernier rang et modifiez-le en direct.
:::
:::card{title="Au premier TP" icon="lucide:graduation-cap" to="#getting-students-started"}
Dix minutes pour passer d’un écran vide à une poutre vérifiée à la main.
:::
:::card{title="Dans les supports et les devoirs" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
Un lien dans un PDF ou sur une diapositive ouvre tout le modèle, pendant des années.
:::
:::card{title="Devoirs autovérifiables" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
D’abord le calcul à la main, puis le modèle pour vérifier.
:::
:::card{title="Entraînement et sujets d’examen" icon="lucide:file-check" to="#practice-and-test-papers"}
Des exercices générés et vérifiés immédiatement, et des sujets imprimables avec corrigé.
:::
:::card{title="Feuilles d’exercices et diapositives à partir du code" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
Vos propres générateurs d’exercices et figures de diapositives, écrits avec @edubeam/plot.
:::
::

## En cours magistral {#in-the-lecture}

- **Rendez le modèle lisible depuis le dernier rang.** Dans **Paramètres → Paramètres d’affichage**, portez la **Taille de police** à 18 ou 20 px (20 px est le maximum) et la **Taille des appuis** de 130 à 150 %. Augmentez l’**Échelle des résultats** si les diagrammes paraissent encore petits.
- **Montrez une chose à la fois.** Dans les options d’affichage, en haut à droite de la vue, décochez tout sauf la grandeur dont vous parlez, puis ajoutez les autres une à une.
- **Modifiez le modèle en direct.** Déplacez un appui, cochez `Ry`, ajoutez une rotule. Les étudiants voient immédiatement la cause et l’effet, et <kbd>Ctrl</kbd>+<kbd>Z</kbd> vous ramène en arrière.
- **Laissez le solveur expliquer les mécanismes.** Ajoutez une rotule de trop : EduBeam dessine comment la structure peut bouger, anime ce mouvement et entoure les rotules en cause. C’est le bon moment pour parler de stabilité. Les deux interrupteurs se trouvent dans **Paramètres → Paramètres d’affichage → Vérification du modèle**.
- **Adoptez la langue et les axes de vos étudiants.** EduBeam parle 18 langues, et ses paramètres (voir [Unités et paramètres](/fr/essentials/units-settings)) permettent de passer des unités SI aux unités américaines, et de l’axe z vers le bas à l’axe y vers le haut, pour suivre vos notes de cours.

![Un mécanisme rendu visible : les rotules en B et C laissent le portique se déplacer latéralement](/screenshots/fr/ui-mechanism.webp)

## Au premier TP {#getting-students-started}

À leur première visite, EduBeam demande aux étudiants comment ils veulent commencer, et quelles unités et quels axes utiliser. Indiquez-leur à l’avance les unités et les axes de votre cours. La visite de l’interface (**Faire le tour**), l’exercice guidé **Dessiner votre première poutre** et les **Exemples** restent disponibles plus tard dans le menu **☰**.

Un bon premier TP : « ouvrez run.edubeam.app et choisissez *Dessiner votre première poutre* », puis le [Démarrage rapide](/fr/guide/quick-start), une dizaine de minutes avec une vérification à la main à la fin.

### Ordinateurs de TP et utilisation hors ligne {#offline-and-lab-computers}

EduBeam est une application web progressive (PWA) : une fois qu’un navigateur l’a chargée, elle continue de fonctionner sans connexion, et le navigateur peut proposer de l’installer comme une application de bureau. Le modèle et les paramètres sont conservés par profil de navigateur : sur les ordinateurs partagés des salles de TP, les étudiants doivent donc emporter leur travail sous forme de fichier ou de lien. Les détails sont dans [Ce qui est stocké dans votre navigateur](/fr/essentials/units-settings#what-is-stored-in-your-browser).

## Dans les supports de cours et les devoirs {#in-lecture-notes-and-assignments}

Un lien de partage contient tout le modèle : il fonctionne partout où un lien fonctionne, dans un PDF, sur une diapositive, sur une page de plateforme pédagogique ou dans un courriel.

::div{.steps}

### Construisez le modèle {#share-build}

Préparez-le tel que les étudiants doivent le découvrir : avec les charges, les étiquettes et les diagrammes que vous voulez afficher.

### Copiez le lien {#share-copy}

Cliquez sur **Partager le modèle** dans la barre de l’application. Activez **Montrer ce que je vois** si le lien doit s’ouvrir avec vos diagrammes, vos charges et vos étiquettes affichés, puis cliquez sur **Copier**.

### Collez-le dans vos supports {#share-paste}

Les étudiants qui l’ouvrent obtiennent leur propre copie à explorer. Leurs modifications ne parviennent ni à vous ni à personne d’autre. Les liens fonctionnent d’une version d’EduBeam à l’autre : vos supports restent valables d’année en année.

::

Laissez **Lien plus court** désactivé pour les supports de cours : une copie d’EduBeam qui n’a pas été mise à jour depuis l’arrivée de cette option ne peut pas ouvrir la forme courte tant qu’elle n’est pas mise à jour.

| Lien | Ouvre |
| --- | --- |
| `run.edubeam.app/?model=…` | le modèle, prêt à être modifié |
| `run.edubeam.app/?viewer=1&model=…` | le modèle en [mode visionneuse](/fr/essentials/import-export#embed-a-read-only-viewer), pour un `<iframe>` |
| `run.edubeam.app/?panel=examples` | la [galerie d’exemples](/fr/examples/) |
| `run.edubeam.app/?lang=cs` | l’application en tchèque, ou dans toute [autre langue](/fr/essentials/import-export#url-parameters) |

::callout{type="warning" title="Un lien remplace le modèle de l’étudiant"}
Ouvrir un lien, et dans certains navigateurs une page contenant une visionneuse intégrée, place le modèle qu’avait l’étudiant dans **☰ → Structures récentes**, d’où il peut être restauré. Demandez quand même aux étudiants d’enregistrer le travail auquel ils tiennent avec **☰ → Enregistrer le projet** avant d’ouvrir des liens donnés en cours.
::

## Des devoirs que les étudiants vérifient eux-mêmes {#assignments-students-can-check-themselves}

EduBeam donne aux étudiants un retour immédiat sur leur calcul à la main, sans appliquer la méthode à leur place.

- **D’abord le calcul, puis la vérification.** Demandez les réactions, les efforts internes et un déplacement calculés à la main, puis faites construire le modèle aux étudiants pour comparer. [Vérifier les résultats à la main](/fr/guide/verification) contient les formules, et le [Démarrage rapide](/fr/guide/quick-start#_8-check-by-hand) montre la démarche.
- **Demandez pourquoi un résultat diffère.** Déformation d’effort tranchant, rotule oubliée, charge en axes locaux au lieu des axes globaux : chacune explique un écart, petit ou grand, et le trouver en apprend davantage qu’un résultat qui concorde.
- **Faites rendre le modèle avec le travail.** Demandez un lien de partage ou un `project.json` joint au calcul. Vous pouvez l’ouvrir et voir exactement ce qui a été modélisé.
- **Des rapports soignés.** Les étudiants peuvent exporter le dessin en **SVG**, qui reste net dans Word et LaTeX, et les résultats en **CSV**. Voir [Exporter une image](/fr/essentials/import-export#export-an-image).

## Exercices prêts à l’emploi {#ready-made-exercises}

- **[Exemples](/fr/examples/) :** six modèles qui s’ouvrent en un clic, chacun avec des questions, ce qu’il faut observer et les réponses.
- **[Exercices d’entraînement](/fr/practice) :** des poutres, portiques et treillis générés qui vérifient les réponses des étudiants, et un [générateur d’examens](/fr/exam) qui les imprime sous forme de sujets. Voir [plus bas](#practice-and-test-papers).
- **[Tutoriels](/fr/tutorials/inclined-beam) :** une poutre inclinée, un portique à trois articulations, un treillis plan et une poutre continue avec un tassement d’appui, chacun modélisé pas à pas et vérifié à la main. Ils font de bonnes fiches de TP de 15 à 20 minutes.
- **[Vérifier les résultats à la main](/fr/guide/verification) :** les cas à solution analytique, de la console au tassement d’appui, à donner comme vérifications rapides.

## Exercices d’entraînement et sujets d’examen {#practice-and-test-papers}

Deux pages de ce site créent pour vous des exercices de statique, sans rien à installer ni à programmer :

- La page **[Exercices d’entraînement](/fr/practice)** donne aux étudiants un nouvel exercice chaque fois qu’ils le demandent. Ils le résolvent sur papier, saisissent les réactions et le moment fléchissant maximal ou l’effort dans une barre, et la page compare chaque valeur à la solution exacte : une réponse juste à 1 % près est acceptée, et une valeur correcte en grandeur mais de sens contraire est signalée. Une indication montre comment commencer, et les diagrammes s’affichent une fois l’exercice terminé. Chaque exercice a un code, comme `H2048`, qui désigne toujours le même exercice : mettez-en un dans un devoir, et tout le monde vérifie sur les mêmes valeurs.
- Le **[générateur d’examens](/fr/exam)** imprime des sujets : choisissez les types de structures, jusqu’à 6 exercices par sujet et jusqu’à 40 versions, et chaque étudiant reçoit une version différente. Chaque version comporte les mêmes types de structures dans le même ordre : les sujets sont donc de difficulté égale. Le générateur ajoute une ligne pour le nom, de la place pour les calculs et un corrigé, et **Imprimer ou enregistrer en PDF** les imprime. **Télécharger le .zip** fournit chaque figure sous forme de fichier SVG pour LaTeX et Word, et les réponses sous forme de tableau CSV pour la correction.

Les deux proposent les mêmes huit types de structures : six isostatiques (une poutre sur deux appuis, une console, une poutre sur deux appuis avec porte-à-faux, une poutre Gerber, un portique à trois articulations et un treillis Warren) et deux hyperstatiques (une poutre continue à deux travées et un portique bi-articulé).

Le générateur d’examens conserve ses réglages, y compris le **Numéro d’examen** qui détermine les valeurs numériques, dans l’adresse de la page. Ajoutez-la à vos favoris : les mêmes sujets et le même corrigé reviendront l’année prochaine. Les codes d’exercice sont désactivés par défaut sur les sujets d’examen : la page Exercices d’entraînement affiche la solution, les codes ont donc leur place dans les devoirs, où les étudiants vérifient leur travail après coup.

## Feuilles d’exercices, sujets et diapositives à partir du code {#exercise-sheets-tests-and-slides-from-code}

Les diagrammes de ce site sont dessinés par [@edubeam/plot](/fr/plot), une bibliothèque de composants Vue qui dessine toute poutre, tout portique ou tout treillis plan calculé par [@edubeam/fem](/fr/solver), le solveur d’EduBeam. Si vous savez écrire un peu de JavaScript, quelques lignes de code suffisent pour en tirer des supports de cours :

- **Vos propres types d’exercices.** Quand les structures du générateur d’examens ne sont pas celles que vous enseignez, écrivez les vôtres : une graine (valeur initiale du générateur aléatoire) choisit la structure et ses valeurs, si bien que la même graine donne toujours le même exercice, et le corrigé est généré à partir de la même graine.
- **Des diapositives qui se construisent.** Montrez la structure, puis les appuis et les charges, puis les réactions, puis le diagramme des moments, étape par étape, sans que le dessin bouge d’une étape à l’autre.
- **Des figures pour les notes et les pages de cours.** Un SVG net qui suit le thème clair ou sombre de la page et qui, contrairement à une application intégrée, ne touche jamais au modèle de l’étudiant.

Essayez. Chaque clic sur **Nouvel exercice** génère un nouvel exercice et son corrigé :

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="Exercices et examens" icon="lucide:file-check" to="/fr/plot/exercises"}
Générez des feuilles d’exercices et leurs corrigés à partir d’une graine.
:::
:::card{title="Diapositives et supports de cours" icon="lucide:presentation" to="/fr/plot/slides"}
Des figures qui se construisent couche par couche, pour les diapositives et les notes.
:::
::
