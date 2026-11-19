---
description: "Réponses courtes sur EduBeam : coût, hors ligne, confidentialité, précision, méthode de calcul, citation, exercices d’entraînement, partage et code."
source: site
---

# Foire aux questions

Des réponses courtes, chacune avec un lien vers la page qui traite le sujet en détail. Vous ne trouvez pas la vôtre ? Consultez le [Dépannage](/fr/reference/troubleshooting) ou [posez-la sur GitHub](https://github.com/janvorisek/edubeam/issues).

## Généralités {#general}

### Qu’est-ce qu’EduBeam ? {#what-is-edubeam}

Une application gratuite et open source de calcul statique linéaire des poutres, portiques et treillis 2D, conçue pour les étudiants, les enseignants et les ingénieurs qui veulent un retour immédiat. Elle fonctionne dans le navigateur. L’[Introduction](/fr/guide/introduction) liste ce qu’elle fait et ce qu’elle ne fait pas.

### Est-ce vraiment gratuit ? Faut-il un compte ? {#is-it-really-free-do-i-need-an-account}

Oui, c’est gratuit, et non, vous n’avez pas besoin de compte. Ouvrez [run.edubeam.app](https://run.edubeam.app/?lang=fr){target="_blank"} et commencez à modéliser : il n’y a rien à installer et aucune limite d’utilisation. Le code source est sur [GitHub](https://github.com/janvorisek/edubeam), sous licence GPL-3.0.

### Quels navigateurs et appareils sont pris en charge ? {#which-browsers-and-devices-work}

Toute version récente de Chrome, Edge, Firefox ou Safari, sur ordinateur, tablette ou téléphone. Sur un écran tactile, touchez pour sélectionner, faites glisser un nœud pour le déplacer, faites glisser ailleurs pour déplacer la vue, pincez pour zoomer, et faites un appui long pour ouvrir le menu contextuel. Une souris et un clavier restent plus rapides pour modéliser. Voir [Clavier, souris et tactile](/fr/reference/shortcuts#touch).

### J’ai perdu mon modèle. Puis-je le récupérer ? {#i-lost-my-model-can-i-get-it-back}

Probablement. Quand un modèle est effacé, ou remplacé par un lien, un fichier ou un exemple, EduBeam le conserve dans **☰ → Structures récentes** (les 10 derniers), et <kbd>Ctrl</kbd>+<kbd>Z</kbd> annule le remplacement. L’un comme l’autre n’existent que dans ce navigateur : un modèle créé sur un autre ordinateur ou dans un autre profil de navigateur n’y figure pas. Voir [Structures récentes](/fr/essentials/import-export#recent-structures).

### Puis-je l’utiliser hors ligne ? {#can-i-use-it-offline}

Oui. EduBeam est une application web progressive (PWA) : une fois que votre navigateur l’a chargée, elle continue de fonctionner sans connexion, et le navigateur peut proposer de l’installer. Quand une nouvelle version est disponible, une boîte de dialogue vous demande votre accord avant la mise à jour.

### Où mes données sont-elles stockées ? {#where-is-my-data-stored}

Dans votre navigateur. Il n’y a ni compte ni stockage en ligne : l’application conserve votre modèle et vos paramètres dans ce navigateur, et un lien de partage transporte le modèle dans le lien lui-même. Voir [Ce qui est stocké dans votre navigateur](/fr/essentials/units-settings#what-is-stored-in-your-browser).

L’application sur run.edubeam.app collecte toutefois des statistiques d’utilisation (Google Analytics) et des rapports d’erreur (Sentry). Un rapport d’erreur, comme l’enregistrement que Sentry fait d’un échantillon de sessions, peut contenir ce qui était affiché à l’écran, y compris votre modèle.

### Où m’entraîner sur des exercices de statique ? {#practice}

Sur la page [Exercices d’entraînement](/fr/practice). Elle vous propose une poutre, un portique ou un treillis avec de nouvelles valeurs à chaque fois : calculez sur papier les réactions et le moment fléchissant maximal ou l’effort dans une barre, saisissez-les, et chaque valeur est vérifiée immédiatement. Les [exemples](/fr/examples/) sont eux aussi accompagnés de questions et de réponses. Les enseignants peuvent imprimer un sujet différent pour chaque étudiant, avec son corrigé, grâce au [générateur d’examens](/fr/exam) ; voir [Exercices d’entraînement et sujets d’examen](/fr/guide/teaching#practice-and-test-papers).

### Comment citer EduBeam ? {#cite}

Comme un logiciel, avec la version et la date à laquelle vous l’avez utilisé. La version figure en bas du menu **☰**. Par exemple :

> Voříšek, J. et contributeurs. *EduBeam*, version 1.3.4 \[logiciel\]. https://edubeam.app (consulté le 18 novembre 2026).

Pour renvoyer à un modèle précis, ajoutez son [lien de partage](/fr/essentials/import-export#share-a-link) : il ouvre le même modèle pour chaque lecteur.

## Modélisation {#modelling}

### Comment créer un encastrement, une articulation ou un appui simple ? {#how-do-i-make-a-fixed-pinned-roller-support}

Cliquez sur le nœud, choisissez **Appuis du nœud** et sélectionnez le symbole : rotule (articulation), appui simple, encastrement, glissière, etc. Ou cochez les DDL bloqués dans l’onglet **Nœuds** : `Dx` + `Dz` + `Ry` donne un encastrement, `Dx` + `Dz` une articulation, `Dz` seul un appui simple. La page [Nœuds et appuis](/fr/essentials/nodes-supports#supports) présente tous les types.

### Comment créer un treillis ? {#how-do-i-make-a-truss}

Dessinez les barres comme des éléments ordinaires et libérez les deux extrémités de chacune : cochez les deux **Rotules d’extrémité** dans l’onglet **Éléments**, ou cochez **Rotule au début** et **Rotule à la fin** dans le bandeau avant de dessiner les barres à la souris. Appliquez les charges aux nœuds. Le tutoriel [Treillis plan](/fr/tutorials/truss) en construit un pas à pas.

### Comment placer une rotule dans un portique ? {#how-do-i-put-a-hinge-in-a-frame}

Libérez le moment à l’extrémité de l’élément qui doit tourner librement : cochez sa rotule d’extrémité dans l’onglet **Éléments**. Une rotule appartient à une extrémité d’élément : en un nœud où se rejoignent plusieurs éléments, en libérer un laisse les autres liés rigidement entre eux. Voir [Rotules d’extrémité](/fr/essentials/elements#end-hinges).

### Comment ajouter un appui ou une charge ponctuelle au milieu d’une poutre ? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Pour un appui, ajoutez un nœud sur la poutre à la souris (le bouton **Ajouter un nœud** avec l’icône du curseur) et choisissez **Connecter à la structure** : la poutre est scindée en deux en ce nœud, et vous pouvez y placer un appui. Une charge ponctuelle n’a pas besoin de nœud : ajoutez une **Charge ponctuelle** à l’élément et donnez sa position depuis le nœud initial. Voir [Placer un nœud sur un élément existant](/fr/essentials/nodes-supports#placing-a-node-on-an-existing-element) et [Charge ponctuelle](/fr/essentials/loads#concentrated-load).

### Puis-je appliquer le poids propre ? {#can-i-apply-self-weight}

Pas automatiquement : la masse volumique du matériau n’est pas utilisée en calcul statique. Ajoutez le poids propre comme charge uniformément répartie $f_z = \rho g A$, par exemple $7850 \cdot 9{,}81 \cdot 28{,}48 \cdot 10^{-4} = 219$ N/m, soit 0,22 kN/m, pour un IPE 200.

### Puis-je modéliser des appuis inclinés ? {#can-i-model-inclined-supports}

Oui. Donnez au nœud un **Angle du SCL nodal** : ses appuis agissent alors selon les axes tournés. Voir [Appuis inclinés](/fr/essentials/nodes-supports#inclined-skewed-supports).

### Puis-je travailler en unités américaines ? {#can-i-work-in-us-customary-units}

Oui. Cliquez sur la pastille des unités en bas à droite de la vue, qui ouvre **Paramètres → Langue et paramètres régionaux**, et réglez **Système d’unités** sur **Américain (impérial)** pour travailler en pieds et en kips, ou choisissez chaque unité séparément. Le modèle est stocké en SI : changer d’unités convertit ce que vous voyez et ne modifie jamais le modèle. Voir [Unités et paramètres](/fr/essentials/units-settings).

### Y a-t-il des cas de charge ou des combinaisons ? {#are-there-load-cases-or-combinations}

Non, un modèle a un seul cas de charge. Enregistrez chaque cas dans son propre fichier ou lien, et combinez les résultats vous-même. Une session de l’EduBeam de bureau comportant plusieurs cas de charge s’ouvre avec le premier, et un message indique ceux qui ont été laissés de côté.

### Pourquoi mes charges pointent-elles vers le haut ? {#why-do-my-loads-point-up}

Probablement parce que vous avez saisi une valeur négative. Dans EduBeam, l’axe global z pointe **vers le bas** : un `fz` ou un `Fz` positif est donc une charge dirigée vers le bas, comme la pesanteur. Une charge de 12 kN/m vers le bas s’écrit `fz = 12`. Voir [Repère et conventions de signes](/fr/elements/conventions#loads). Si votre cours utilise un axe vertical dirigé vers le haut, passez à **x vers la droite, y vers le haut** dans **Paramètres → Langue et paramètres régionaux → Système de coordonnées** : les saisies et les résultats suivent alors cet axe.

## Résultats {#results}

### Pourquoi n’y a-t-il pas de bouton « Calculer » ? {#why-is-there-no-solve-button}

Parce que le modèle est recalculé après chaque modification. Si aucun résultat n’apparaît, le modèle ne peut pas encore être calculé, et un message sur la zone de dessin explique pourquoi. Le [Dépannage](/fr/reference/troubleshooting#no-results-are-drawn) liste ce qu’il faut vérifier.

### Pourquoi ma flèche diffère-t-elle légèrement de la formule ? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam utilise des éléments poutre de Timoshenko : une flèche inclut donc la déformation d’effort tranchant, que les formules des manuels négligent généralement. Pour une poutre élancée, l’écart est d’environ 1 %, et le [Démarrage rapide](/fr/guide/quick-start#_8-check-by-hand) en fait le calcul à la main. Dans une structure hyperstatique, la rigidité au cisaillement décale aussi légèrement les efforts internes. Pour en savoir plus, voir [Vérifier les résultats à la main](/fr/guide/verification).

### Quelle est la précision des résultats ? Faut-il plus d’éléments ? {#how-accurate-are-the-results-do-i-need-more-elements}

En statique linéaire, l’élément poutre est exact pour tous les types de charge que propose EduBeam : un seul élément par barre suffit, et il n’y a pas de maillage à raffiner. N’ajoutez des nœuds que là où vous avez besoin d’un appui, d’une rotule, d’un changement de section, d’une charge nodale ou d’un déplacement à lire. Voir [Précision et exactitude](/fr/essentials/results#precision-and-accuracy).

### Comment EduBeam calcule-t-il les résultats ? {#how-does-edubeam-compute-the-results}

Par la méthode des éléments finis, sous la forme de la méthode des déplacements (méthode directe des rigidités) enseignée en cours de calcul des structures, directement dans votre navigateur. [Comment EduBeam résout un modèle](/fr/elements/analysis) suit chaque étape sur un petit exemple que vous pouvez refaire à la main, et le solveur lui-même est open source : c’est [@edubeam/fem](/fr/solver).

### Puis-je voir les matrices de rigidité ? {#can-i-see-the-stiffness-matrices}

Oui. Dans l’onglet **Éléments**, le bouton de matrice sur la ligne d’un élément ouvre sa matrice de rigidité 6 × 6, en axes globaux et en unités SI (N, m). Cliquer sur un élément dans la vue propose aussi **Matrice de rigidité**. La page [Élément poutre](/fr/elements/beam#global-stiffness-matrix) l’établit.

### Où les réactions sont-elles listées ? {#where-are-the-reactions-listed}

Dans la vue, sous forme de flèches avec leurs valeurs, grâce à l’option **Réactions** des options d’affichage, activée par défaut. Elles figurent aussi dans le fichier produit par **Résultats → Exporter en CSV** et dans ce que **Copier** place dans le presse-papiers. L’onglet **Résultats** liste les déplacements nodaux et les efforts aux extrémités des éléments. Voir [Résultats et diagrammes](/fr/essentials/results).

## Fichiers et partage {#files-sharing}

### Comment partager un modèle ? {#how-do-i-share-a-model}

Cliquez sur **Partager le modèle**, puis sur **Copier**. Le lien contient tout le modèle, et chaque personne qui l’ouvre obtient sa propre copie modifiable : il n’y a pas de collaboration en direct. Activez **Montrer ce que je vois** pour que le lien s’ouvre avec vos diagrammes et vos étiquettes affichés. Voir [Partager un lien](/fr/essentials/import-export#share-a-link) et, pour les cours, [Enseigner avec EduBeam](/fr/guide/teaching#in-lecture-notes-and-assignments).

### Puis-je intégrer un modèle dans mon site web ou mes diapositives ? {#can-i-embed-a-model-on-my-website-or-in-slides}

Oui. Ajoutez `&viewer=1` à un lien de partage et placez-le dans un `<iframe>` : voir [Intégrer une visionneuse](/fr/essentials/import-export#embed-a-read-only-viewer). Pour une figure statique dans une page, une diapositive ou des notes imprimées, exportez un SVG, ou dessinez-la à partir du code avec [@edubeam/plot](/fr/plot).

### Puis-je exporter des images ou des tableaux ? {#can-i-export-images-or-tables}

Oui. **☰ → Exporter une image** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) enregistre le dessin en PNG ou SVG, à la taille ou à l’échelle de votre choix. **Résultats → Exporter en CSV** enregistre les deux tableaux de résultats, et **Copier** les place dans le presse-papiers pour un tableur. Voir [Exporter une image](/fr/essentials/import-export#export-an-image).

### Puis-je ouvrir les fichiers de l’EduBeam de bureau ? {#can-i-open-files-from-the-desktop-edubeam}

Oui. Les sessions enregistrées par l’EduBeam de bureau, versions 2.x à 3.5 (`.xml`), s’ouvrent avec **☰ → Ouvrir le projet** ou en les déposant sur l’application, exactement comme un `project.json`. Leurs valeurs sont lues en kN, kPa et m. Voir [Ouvrir un projet](/fr/essentials/import-export#open-a-project).

### Puis-je générer des modèles par programme ? {#can-i-generate-models-programmatically}

Oui, de deux façons :

- **Écrire le fichier.** Un `project.json` est du JSON simple en unités SI : un script dans n’importe quel langage peut en écrire un, et EduBeam l’ouvre avec **Ouvrir le projet** ou par glisser-déposer. Voir le [format du fichier de projet](/fr/essentials/import-export#project-file-format).
- **Le calculer dans le code.** [@edubeam/fem](/fr/solver) est le solveur aux éléments finis d’EduBeam, sous forme de bibliothèque JavaScript et TypeScript. [@edubeam/plot](/fr/plot) dessine ensuite le résultat, par exemple sous forme de [feuille d’exercices générée](/fr/plot/exercises).

La poutre du [Démarrage rapide](/fr/guide/quick-start), en unités SI :

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // articulation
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // appui simple
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, vers le bas

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 54000 N·m à mi-portée
beam.computeLocalDefl(lc, 2).w[1] // 0.0502 m à mi-portée
```

## Assistance {#support}

### Comment signaler un bogue ou demander une fonctionnalité ? {#how-do-i-report-a-bug-or-request-a-feature}

Ouvrez un ticket sur [GitHub](https://github.com/janvorisek/edubeam/issues) et joignez un lien de partage ou un fichier de projet qui montre le problème. Pour les questions privées, écrivez à [support@edubeam.app](mailto:support@edubeam.app).
