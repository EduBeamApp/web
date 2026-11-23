---
description: "Projets EduBeam et sessions de l’EduBeam de bureau, liens de partage, visionneuse intégrée, paramètres d’URL, export d’images et de résultats."
source: site
---

# Fichiers, liens et export

:span{#import-export-et-partage}

Enregistrez votre modèle dans un fichier, envoyez-le sous forme de lien, intégrez-le dans une page web, ou exportez-en une image ou un tableau. Dans [EduBeam]{.edubeam}, tout se passe dans votre navigateur et rien n’est envoyé à un serveur : un lien de partage contient littéralement le modèle.

::card-grid{cols="3"}
:::card{title="Fichier de projet" icon="lucide:file-json" to="#save-a-project"}
`project.json`, à conserver, à rendre ou à rouvrir plus tard.
:::
:::card{title="Lien de partage" icon="lucide:link" to="#share-a-link"}
Tout le modèle dans une seule URL, pour les notes, les diapositives et les messages.
:::
:::card{title="Image ou tableau" icon="lucide:image" to="#export-an-image"}
PNG ou SVG pour les rapports, CSV pour les tableurs.
:::
::

## Enregistrer un projet {#save-a-project}

**☰ → Enregistrer le projet** ou <kbd>Ctrl</kbd>+<kbd>S</kbd> (<kbd>⌘</kbd>+<kbd>S</kbd> sur Mac, comme pour tous les raccourcis de cette page) télécharge `project.json`. Il contient les nœuds, les éléments, les matériaux, les sections (avec les formes dessinées), les charges, les lignes de cote et la version de l’application qui l’a écrit. Renommez le fichier librement.

## Ouvrir un projet {#open-a-project}

**☰ → Ouvrir le projet** ou <kbd>Ctrl</kbd>+<kbd>O</kbd>, puis choisissez le fichier, ou **déposez le fichier n’importe où sur la fenêtre de l’application**. EduBeam ouvre :

- les fichiers `project.json` enregistrés par toutes les versions d’EduBeam ;
- les sessions `.xml` enregistrées par l’**EduBeam de bureau** 2.x à 3.5. Leurs valeurs ne portent pas d’unités : elles sont lues en kN, kPa et m, les unités qu’utilisait son manuel. EduBeam ouvre un cas de charge à la fois : une session qui en contient plusieurs s’ouvre sur le premier, et EduBeam nomme ceux qu’il a laissés de côté.

L’ouverture remplace le modèle courant, matériaux et sections compris. Le modèle que vous aviez n’est pas perdu : <kbd>Ctrl</kbd>+<kbd>Z</kbd> le rétablit, et il est conservé dans les [Structures récentes](#recent-structures). Un fichier qu’EduBeam ne sait pas lire est refusé avec un message, et votre modèle reste tel quel.

## Partager un lien {#share-a-link}

**Partager le modèle**, dans la barre de l’application ou le menu ☰, ouvre la boîte de dialogue *Partager le modèle via URL* :

![La boîte de dialogue Partager le modèle via URL](/screenshots/fr/c1-share.webp){.shot-lg}

- **Copier**, ou un clic n’importe où dans le champ, copie le lien.
- **Ouvrir le lien** l’ouvre dans un nouvel onglet : vous voyez ce que verra le destinataire.
- **Partager via la boîte de dialogue système** transmet le lien au menu de partage de votre appareil, si le navigateur le permet.
- **Lien plus court** (activé par défaut) écrit le même modèle en deux fois moins de caractères environ. Les versions d’EduBeam antérieures à la 1.3.2 (novembre 2026) ne peuvent pas le lire tant qu’elles ne sont pas mises à jour : désactivez l’option quand un lien doit s’ouvrir partout tout de suite.
- **Montrer ce que je vois** (désactivé par défaut) fait s’ouvrir le lien avec les diagrammes, les charges et les étiquettes que vous avez activés, plutôt qu’avec les options d’affichage du destinataire.

Le lien a la forme `https://run.edubeam.app/?model=…` et encode tout le modèle. Quiconque l’ouvre obtient sa propre copie à modifier ; les modifications ne sont **pas** synchronisées en retour : envoyez un nouveau lien quand le modèle change. Les très gros modèles produisent des liens très longs ; partagez plutôt le fichier de projet.

Quand quelqu’un ouvre un lien, son propre modèle précédent passe dans les Structures récentes, et un message lui indique où le retrouver. Les liens n’expirent jamais : un lien placé dans les notes de cours de l’an dernier ouvre aujourd’hui le même modèle.

## Intégrer une visionneuse {#embed-a-read-only-viewer}

Ajoutez `&viewer=1` à un lien de partage pour ouvrir le modèle en **mode visionneuse** : la barre de l’application, la barre inférieure, les boutons Annuler et Rétablir, les pastilles de la grille et des unités et le réticule sont masqués ; il reste le dessin, les boutons d’ajustement et de centrage, et les options d’affichage. La fenêtre d’accueil et les notes de version ne s’ouvrent pas non plus. Placez cette URL dans un `<iframe>` pour intégrer un modèle interactif et zoomable dans des notes de cours, la page d’un cours ou une diapositive :

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![Le portique à trois articulations en mode visionneuse](/screenshots/fr/viewer-mode.webp){.shot-lg}

Le mode visionneuse est fait pour regarder, mais il n’est pas verrouillé : les visiteurs peuvent toujours déplacer des nœuds et changer de diagramme. Ouvert seul, un lien de visionneuse remplace le modèle du visiteur comme n’importe quel lien, et son modèle l’attend dans les Structures récentes. Intégré dans une page d’un autre site, le cadre reçoit, dans la plupart des navigateurs actuels, son propre stockage, ce qui laisse intact le modèle du visiteur ; mais tous les navigateurs ne le font pas.

Pour une figure qui n’a pas du tout besoin de l’application, comme un diagramme statique dans une page, une diapositive ou une feuille d’exercices, [@edubeam/plot](/fr/plot) dessine les structures et leurs diagrammes à partir de code. Les figures interactives de ce site sont dessinées avec cette bibliothèque.

## Paramètres d’URL {#url-parameters}

| Paramètre | Effet |
| --- | --- |
| `model=<data>` | Charge le modèle encodé et l’ajuste à l’écran. Écrit par **Partager le modèle**. |
| `viewer=1` | [Mode visionneuse](#embed-a-read-only-viewer). |
| `show=<lettres>` | Ouvre avec exactement ces couches activées, une lettre chacune : `N` effort normal, `V` effort tranchant, `M` moment fléchissant, `U` déformée, `R` réactions, `L` charges, `S` appuis, `n` étiquettes des nœuds, `e` étiquettes des éléments. `show=MRLS` affiche le moment fléchissant, les réactions, les charges et les appuis. Écrit par **Montrer ce que je vois**. |
| `lang=<code>` | Change la langue de l’interface : `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (chinois), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Ouvre directement la galerie d’exemples. |

Les paramètres se combinent avec `&`, comme dans `?lang=de&viewer=1&model=…`. EduBeam les retire de la barre d’adresse une fois qu’il les a lus. `lang` et `show` sont conservés comme paramètres du visiteur, exactement comme s’il les avait choisis dans l’application.

## Exporter une image {#export-an-image}

**☰ → Exporter une image** ou <kbd>Ctrl</kbd>+<kbd>P</kbd> ouvre l’export d’image. Le dessin est recomposé pour la taille que vous choisissez : les traits et les étiquettes gardent leur épaisseur réelle.

![Exporter une image : choisissez les couches, le cadrage et la taille, puis téléchargez ou copiez](/screenshots/fr/export-image.webp)

::div{.steps}

### Choisissez les couches {#choose-the-layers}

Les pastilles du haut choisissent ce qui est dessiné : la déformée, N, V, M et les réactions, puis les appuis, les charges, les étiquettes des nœuds et celles des éléments. Elles reprennent au départ les options d’affichage de la vue, et les modifier ici ne change rien à la vue.

### Cadrez le dessin {#frame-the-drawing}

Choisissez des proportions (16:9, 4:3, 3:2 ou 1:1), **Tout afficher**, ou **Fenêtre…** pour tracer un rectangle sur le dessin. Vous pouvez aussi faire glisser les bords de l’aperçu.

### Réglez la taille {#set-the-size}

Largeur et hauteur en pixels, ou une **Échelle** comme 1 : 50 pour un dessin à l’échelle sur papier (à 96 DPI). **Hauteur des diagrammes** règle la taille des diagrammes de résultats, et **Fond transparent** supprime le fond blanc. Si les diagrammes ou les étiquettes ne tiennent pas, la boîte de dialogue le signale et propose de réduire les diagrammes ou d’agrandir l’image.

### Enregistrez {#save-it}

**Télécharger en PNG**, **Télécharger en SVG** ou, si le navigateur le permet, **Copier dans le presse-papiers**. Les fichiers portent le nom de leur taille, par exemple `edubeam-512x512.svg`. Sur un écran haute résolution, le PNG a plus de pixels que la largeur et la hauteur choisies, en proportion de la densité de pixels de l’écran, pour être aussi net que dans l’application ; sa taille en pixels est indiquée à côté des boutons.

::

Le SVG reste net à toutes les tailles et fonctionne dans Word, Inkscape et LaTeX sur Overleaf : c’est le meilleur choix pour les rapports et les mémoires. Une même taille cadre toujours la structure de la même façon : N, V et M exportés l’un après l’autre s’alignent donc côte à côte.

Pour produire de telles figures à partir de code, par exemple une pour chaque exercice d’une feuille, @edubeam/plot écrit [un fichier SVG autonome](/fr/plot/functions#a-standalone-svg-file) qui s’ouvre dans les mêmes logiciels.

## Exporter les résultats {#export-the-results}

**Exporter en CSV**, dans l’onglet **Résultats**, télécharge les deux tableaux de résultats, réactions comprises, et **Copier** les place dans le presse-papiers pour un tableur. Voir [Exporter en CSV et Copier](/fr/essentials/results#export-csv-and-copy).

## Structures récentes {#recent-structures}

**☰ → Structures récentes** conserve les 10 dernières structures effacées, ou remplacées par un lien, un fichier, un exemple, l’exercice guidé de la première poutre ou une autre restauration. Chacune affiche une miniature, ce qui l’a remplacée, et son nombre de nœuds et d’éléments. **Restaurer** en fait revenir une : le modèle que vous aviez alors entre à son tour dans la liste, et <kbd>Ctrl</kbd>+<kbd>Z</kbd> annule la restauration. **Retirer** supprime une entrée.

![Structures récentes](/screenshots/fr/recent.webp){.shot-lg}

La liste n’est stockée que dans ce navigateur.

## Exemples {#examples}

**☰ → Exemples** ouvre une galerie de modèles pédagogiques prêts à l’emploi. En ouvrir un remplace votre modèle, et <kbd>Ctrl</kbd>+<kbd>Z</kbd> rétablit le vôtre. Les mêmes modèles, avec des exercices, se trouvent sur la page [Exemples](/fr/examples/) de ce guide.

![La galerie d’exemples](/screenshots/fr/examples.webp){.shot-lg}

## Persistance automatique {#automatic-persistence}

Votre modèle et vos paramètres sont enregistrés dans le stockage local du navigateur après chaque modification, et restaurés à votre retour, même après la fermeture du navigateur. C’est une commodité, pas une sauvegarde : elle est liée à un profil de navigateur sur un appareil, une fenêtre de navigation privée l’oublie, et effacer les données du site la supprime. Enregistrez les travaux importants dans un fichier de projet. La section [Ce qui est stocké dans votre navigateur](/fr/essentials/units-settings#what-is-stored-in-your-browser) dresse la liste complète.

## Format du fichier de projet {#project-file-format}

`project.json` est du JSON simple et lisible. Voici la poutre du [Démarrage rapide](/fr/guide/quick-start), avec l’acier et l’IPE 200 des bibliothèques :

```json [project.json]
{
  "edubeam": true,
  "version": "1.3.4",
  "domain": {
    "materials": [
      {
        "label": "Steel (S235)",
        "d": 7850,
        "e": 210000000000,
        "g": 81000000000,
        "alpha": 0.000012
      }
    ],
    "crossSections": [
      {
        "label": "IPE 200 (approx)",
        "a": 0.002848,
        "iy": 0.00001943,
        "h": 0.2,
        "k": 0.3932584269662922
      }
    ],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [
      {
        "label": "1",
        "nodes": ["1", "2"],
        "mat": "Steel (S235)",
        "cs": "IPE 200 (approx)",
        "hinges": [false, false]
      }
    ],
    "loadCases": [
      {
        "label": "DefaultLC",
        "nodalLoads": [],
        "elementLoads": [
          { "type": "udl", "target": "1", "lcs": true, "values": [0, 12000] }
        ],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Toutes les valeurs sont en **unités SI** (m, N, Pa, rad), quelles que soient les unités affichées par l’application. Les coordonnées sont `[x, y, z]`, avec $y = 0$ et $z$ dirigé vers le bas. Les appuis et les composantes de charge utilisent les identifiants de DDL `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` de charge d’élément | Valeurs |
| --- | --- |
| `udl` | `values: [fx, fz]` en N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` en N/m |
| `concentrated` | `values: [Fx, Fz, My, a]` en N, N·m, et en m depuis le nœud initial |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` en K ; le gradient vaut ΔTb − ΔTt |

`lcs: true`, ou l’absence de `lcs`, place une charge d’élément dans les axes locaux de l’élément ; `false`, dans les axes globaux. Les autres entrées :

- **Charges nodales** : `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, plus `"lcs": true` pour une charge dans les axes d’un appui tourné.
- **Déplacements imposés** : `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }` ; une composante omise vaut 0.
- Les fichiers écrits par l’application contiennent aussi une `date`, un `commit`, les axes des appuis tournés (`lcs` sur un nœud) et les `shape` des sections dessinées.

Comme le format est simple, vous pouvez écrire des modèles avec un script ou un tableur et les ouvrir avec **Ouvrir le projet**. Pour construire et calculer des modèles entièrement par le code, utilisez le solveur sur lequel repose l’application, [@edubeam/fem](/fr/solver).
