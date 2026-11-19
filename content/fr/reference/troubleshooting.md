---
description: "EduBeam n’affiche aucun résultat ? Chaque message d’erreur et d’avertissement expliqué, les résultats douteux et les fichiers ou liens qui ne s’ouvrent pas."
source: site
---

# Dépannage

Quand un modèle ne peut pas être calculé, [EduBeam]{.edubeam} explique pourquoi dans un message en haut à gauche de la vue, et **Afficher les détails** liste chaque problème en entier. Repérez le titre de la boîte de dialogue que vous avez vue : chaque message ci-dessous indique ce qu’il signifie et comment y remédier.

::card-grid{cols="2"}
:::card{title="Pas encore prêt pour le calcul" icon="lucide:circle-dashed" to="#still-needed"}
Une pastille bleue **Appuis manquants**. Rien n’est faux : la structure n’est simplement pas encore retenue par des appuis.
:::
:::card{title="Impossible de résoudre le modèle" icon="lucide:circle-x" to="#errors"}
Un message rouge. Des appuis qui ne tiennent pas la structure, des rotules qui forment un mécanisme, un élément de longueur nulle.
:::
:::card{title="Avertissements du modèle" icon="lucide:triangle-alert" to="#warnings"}
Un message jaune. Le modèle est calculé, mais quelque chose ne correspond probablement pas à ce que vous vouliez.
:::
:::card{title="Les résultats semblent faux" icon="lucide:scale" to="#results-look-wrong"}
Des charges qui agissent vers le haut, des flèches fausses de plusieurs ordres de grandeur, un signe qui semble inversé.
:::
::

## Messages {#messages}

### Ce que signifient les couleurs {#read-the-message}

| Vous voyez | Cela signifie |
| --- | --- |
| Une pastille bleue **Appuis manquants** | Le modèle est inachevé. Ajoutez des appuis. Placez le pointeur sur la pastille pour voir, sous forme de contour en pointillés, comment la structure peut encore bouger. |
| Un message **rouge** | Quelque chose empêche le calcul. Le message nomme le problème, ou affiche *Erreurs dans le modèle : n* lorsqu’il y en a plusieurs. Les nœuds concernés sont entourés sur le dessin. |
| Un message **jaune** | Des avertissements. Le modèle a tout de même été calculé. S’il y en a plusieurs, le message affiche *Avertissements dans le modèle : n*. |
| *Aucun matériau défini.* / *Aucune section définie.* | Les éléments ont besoin des deux. Ajoutez-en un avec le bouton **Ajouter** à côté du message. |

**Afficher les détails** ouvre la boîte de dialogue, intitulée *Pas encore prêt pour le calcul*, *Impossible de résoudre le modèle* ou *Avertissements du modèle*. Son interrupteur affiche ou masque la façon dont la structure peut bouger, et son lien **Dépannage** mène ici.

![La boîte de dialogue Impossible de résoudre le modèle, avec l’interrupteur qui montre comment la structure peut bouger](/screenshots/fr/ui-diagnostics.webp){.shot-lg}

Sur le dessin :

- Le **✕** d’un message rouge le replie en une petite pastille *Impossible de résoudre le modèle*, pour gagner de la place sur un petit écran. Cliquez sur la pastille pour le déplier.
- Le bouton en forme d’**œil** d’un message rouge affiche ou masque le contour en pointillés du mouvement. **Paramètres → Paramètres d’affichage → Vérification du modèle** désactive durablement ce contour et son animation.
- Le **✕** d’un message jaune masque les avertissements.

### Reste à faire {#still-needed}

Le modèle n’est pas faux, seulement inachevé. Placez le pointeur sur la pastille pour lire le texte court ; la boîte de dialogue affiche le texte long.

| Message | Signification et solution |
| --- | --- |
| *La structure a besoin d’appuis pour pouvoir être calculée.* <br> *Le modèle doit comporter au moins 3 DDL bloqués pour être stable en analyse 2D.* | Moins de trois directions bloquées au total. Ajoutez des appuis. |
| *La partie avec les nœuds … a besoin d’appuis.* <br> *Une partie séparée de la structure (nœuds …) a moins de 3 DDL bloqués et peut se déplacer librement.* | Le modèle est en plusieurs morceaux et l’un d’eux flotte. Reliez-le au reste, ou donnez-lui des appuis. |
| *n parties de la structure ont besoin d’appuis.* | Plusieurs morceaux flottent. Afficher les détails les liste. |

### Erreurs {#errors}

Quelque chose empêche le calcul. Le message rouge affiche le texte court ; la boîte de dialogue, le texte long.

| Message | Signification et solution |
| --- | --- |
| *Les appuis ne maintiennent pas la structure : elle peut encore glisser horizontalement / se déplacer verticalement / tourner librement / se déplacer comme un corps rigide.* <br> *La structure a suffisamment d’appuis, mais ils ne la maintiennent pas : elle peut encore …* | Les liaisons sont assez nombreuses, mais elles sont toutes parallèles, ou leurs lignes d’action concourent en un même point, comme avec trois appuis simples sous une poutre horizontale. Le contour en pointillés montre le mouvement ; tournez ou déplacez l’un des appuis. |
| *La partie avec les nœuds … n’est pas maintenue : elle peut encore …* <br> *Une partie séparée de la structure (nœuds …) a suffisamment d’appuis, mais ils ne la maintiennent pas : elle peut encore …* | La même chose, pour un seul morceau d’un modèle en plusieurs morceaux. |
| *Les articulations du nœud … laissent la structure bouger.* <br> *Les appuis maintiennent la structure, mais c’est encore un mécanisme : ses barres peuvent tourner autour des articulations du nœud …* | Les rotules laissent des barres tourner les unes par rapport aux autres, comme dans un portique sur deux pieds articulés avec une rotule en tête de chaque poteau, ou dans un carré de barres articulées sans diagonale. Supprimez une rotule, ou ajoutez une barre ou un appui. |
| *La structure est instable : elle bouge presque sans résistance.* <br> *La structure est instable. Déplacement pratiquement sans résistance : nœud … horizontalement (Dx) …* | Presque un mécanisme, ou une rigidité proche de zéro. Le message long nomme les nœuds et les directions. Vérifiez les appuis, les rotules et les valeurs de `E`, `A` et `Iy`. |
| *La structure est un mécanisme : elle peut bouger sans résistance.* <br> *La structure est un mécanisme : la matrice de rigidité est singulière.* | Quelque chose peut bouger librement sans avoir été détecté par les vérifications ci-dessus. Vérifiez que chaque partie est maintenue par au moins trois liaisons et que les rotules d’extrémité ne laissent aucune barre libre de tourner. |
| *L’élément … a une longueur nulle : les nœuds … et … sont au même point.* | Deux nœuds d’un même élément sont confondus. Déplacez-en un, ou supprimez l’élément. |
| *L’élément … référence le même nœud à ses deux extrémités.* | Supprimez l’élément et redessinez-le entre deux nœuds différents. |
| *L’élément … référence le nœud inexistant / le matériau inexistant / la section inexistante …* | L’objet qu’il utilise a été supprimé, généralement dans un fichier de projet modifié à la main. Réaffectez-le dans le tableau *Éléments*. |
| *L’élément … doit référencer exactement 2 nœuds.* | Un élément défectueux dans un fichier importé. Supprimez-le et redessinez-le. |
| *La charge nodale n° n référence le nœud inexistant …* <br> *Le déplacement imposé n° n référence le nœud inexistant …* | Supprimez la charge, ou attribuez-lui un nœud existant. |
| *La charge d’élément n° n référence l’élément inexistant …* | Supprimez la charge. |
| *Échec du solveur dû à une incohérence interne du modèle.* | Un échec générique. Annulez la dernière étape, ou enregistrez le projet et [signalez-le](#reporting-a-bug). |

### Avertissements {#warnings}

Le modèle est tout de même calculé, mais vérifiez ces points :

| Message | Signification et solution |
| --- | --- |
| *Le nœud … n’est relié à aucun élément et est ignoré par le solveur.* | Un nœud isolé. Supprimez-le, ou reliez-le. |
| *Le nœud … possède un appui mais aucun élément n’y est relié : l’appui ne reprend donc rien.* | Un appui sur un nœud isolé. |
| *La charge nodale n° n contient des valeurs invalides.* <br> *Le déplacement imposé n° n contient des valeurs invalides.* | Une composante qui n’est pas un nombre. Modifiez la charge. |

### Pendant la modification {#while-editing}

Ces messages s’ouvrent dans une boîte de dialogue du navigateur pendant que vous travaillez, et le modèle reste tel qu’il était :

| Message | Signification et solution |
| --- | --- |
| *Veuillez d’abord ajouter un matériau.* <br> *Veuillez d’abord ajouter une section.* | Un élément a besoin des deux. Ajoutez-en un dans l’onglet *Matériaux* ou *Sections*, puis redessinez l’élément. |
| *Veuillez sélectionner un matériau et une section.* | La boîte de dialogue **Ajouter un élément** a un champ vide. Choisissez les deux. |
| *Le libellé … est déjà utilisé.* | Deux nœuds, éléments, matériaux ou sections ne peuvent pas porter le même libellé. Choisissez-en un autre. |
| *Un déplacement imposé existe déjà pour ce nœud. Veuillez d’abord le supprimer.* | Un nœud n’accepte qu’un seul déplacement imposé. Modifiez celui qu’il a, ou supprimez-le d’abord. |

## Rien ne s’affiche {#no-results-are-drawn}

Quand aucun diagramme n’apparaît, vérifiez, dans cet ordre :

::div{.steps}

### Vérifiez les options d’affichage {#check-the-display-options}

S’il n’y a aucun message, le modèle est calculé : le diagramme est peut-être simplement désactivé. Cochez **M<sub>y</sub>(x)**, ou un autre résultat, dans les options d’affichage en haut à droite de la vue ; le bouton ⚙ au-dessus affiche le panneau. Un modèle sans aucune charge a des résultats nuls partout : il n’y a donc rien à dessiner non plus.

### Vérifiez les appuis {#check-the-supports}

Le solveur a besoin d’au moins trois directions bloquées, et les appuis doivent ensemble empêcher la structure de glisser ou de tourner. Une poutre sur deux appuis simples n’en a que deux et glisse : transformez l’un d’eux en **articulation** (symbole **Rotule**). Trois appuis simples parallèles, ou des appuis dont les lignes d’action concourent en un même point, ne la maintiennent pas non plus. Voir [Nœuds et appuis](/fr/essentials/nodes-supports#supports).

### Vérifiez que les éléments sont reliés {#check-the-connections}

Deux nœuds aux mêmes coordonnées restent deux nœuds distincts, et une partie qui ne touche le reste qu’en ce point flotte librement. Supprimez le nœud en trop et reliez à nouveau. Quand vous placez un nœud sur un élément, répondez **Connecter à la structure** pour y scinder l’élément.

### Comptez les rotules {#count-the-hinges}

Un portique sur deux pieds articulés avec une rotule en tête de chaque poteau, ou un carré de barres articulées sans diagonale, est un mécanisme. EduBeam entoure les rotules et fait osciller un contour en pointillés selon le mouvement. Voir [Rotules d’extrémité](/fr/essentials/elements#end-hinges).

### Cherchez une rigidité nulle {#look-for-zero-stiffness}

`E`, `A` ou `Iy` saisi à 0, ou dans la mauvaise unité, laisse une partie de la structure bouger presque sans résistance. EduBeam le signale comme *instable*.

::

## Les résultats semblent faux {#results-look-wrong}

| Symptôme | Cause probable |
| --- | --- |
| Les charges agissent vers le haut | L’axe global **z pointe vers le bas** : un `Fz` ou un `fz` positif agit vers le bas, et les valeurs négatives pointent vers le haut. Avec les axes y vers le haut, c’est l’inverse. Voir [Charges](/fr/essentials/loads#sign-convention-in-one-line). |
| La flèche est fausse de plusieurs ordres de grandeur | Une confusion d’unités : `E` saisi en Pa alors que le champ attend des MPa, ou `Iy` en cm⁴ alors qu’il attend des m⁴. La pastille des unités, en bas à droite de la vue, liste les unités de tous les champs. |
| La flèche est légèrement supérieure à celle de la formule du manuel | La déformation d’effort tranchant de la poutre de Timoshenko. Voir [Vérifier les résultats à la main](/fr/guide/verification#shear-deformation). |
| Un signe semble faux | Lisez le signe sur la valeur, pas d’après le côté où le diagramme est dessiné : un M positif tend la fibre inférieure. Les efforts aux extrémités dans *Résultats par élément* suivent les axes locaux de l’élément, et non la convention N-V-M. Voir [Lire le signe](/fr/essentials/results#reading-the-sign). |
| Un diagramme est du « mauvais » côté | Le côté est un réglage d’affichage : moment fléchissant du côté tendu ou du côté comprimé, N et V d’un côté ou de l’autre de la ligne en pointillés. **Paramètres → Paramètres d’affichage → Diagrammes des efforts internes**. |
| Deux poteaux identiques ont des efforts tranchants de signes opposés | Le signe de V suit l’orientation de chaque élément. Inversez les nœuds de l’un d’eux pour les comparer. |
| Des nombres comme `4 · 10¹` | Le format des nombres est réglé sur *Scientifique*. Choisissez *Automatique* dans **Paramètres → Langue et paramètres régionaux → Format des nombres**. |
| Les diagrammes sont énormes ou minuscules | Seul le dessin est concerné. Ajustez **Échelle des résultats** dans **Paramètres → Paramètres d’affichage**. |
| Une charge en axes locaux pointe dans le mauvais sens | L’axe x local d’un élément va de son nœud *initial* à son nœud *final*. Inversez les nœuds, ou changez le signe. |
| La charge sur une barre inclinée semble fausse | La case **LCS** est cochée par défaut : `fz` agit donc perpendiculairement à la barre. Décochez-la pour une charge verticale. |
| Une charge thermique n’a aucun effet | Une structure isostatique se déforme librement sous l’effet de la température, sans efforts internes. Pour obtenir une déformation, vérifiez que α n’est pas nul et, pour une différence de température, que la hauteur $h$ de la section est renseignée. |

## Fichiers et liens {#files-and-links}

| Symptôme | Solution |
| --- | --- |
| *Impossible d’importer le fichier. Veuillez vérifier le format du fichier.* | Le fichier n’est ni un projet EduBeam ni une session de l’EduBeam de bureau. Votre modèle n’a pas changé. |
| *Cette session EduBeam contient plusieurs cas de charge, mais un seul peut être ouvert.* | Une session de l’EduBeam de bureau avec plusieurs cas de charge : EduBeam ouvre le premier et nomme ceux qu’il a laissés de côté. |
| Un lien de partage ouvre votre ancien modèle à la place | Le lien a été tronqué ou modifié, par exemple par un logiciel de messagerie qui l’a coupé sur deux lignes. EduBeam ignore un lien qu’il ne peut pas lire et conserve votre modèle. Copiez de nouveau le lien en entier. |
| Un lien plus court ne s’ouvre pas chez un collègue | Sa copie d’EduBeam est antérieure à la version 1.3.2. Il lui suffit de recharger l’application, ou vous pouvez partager avec **Lien plus court** désactivé. Voir [Partager un lien](/fr/essentials/import-export#share-a-link). |

## Problèmes d’interface {#interface-issues}

| Symptôme | Solution |
| --- | --- |
| Les raccourcis ne font rien | Cliquez d’abord sur le dessin : les touches seules sont ignorées tant qu’un champ de texte a le focus. Sur un Mac, utilisez <kbd>Cmd</kbd> à la place de <kbd>Ctrl</kbd>. Voir [Clavier, souris et tactile](/fr/reference/shortcuts). |
| <kbd>Suppr</kbd> ne fait rien sur un Mac | Sur un clavier Mac, la touche <kbd>⌫</kbd> efface vers l’arrière, comme Retour arrière. Appuyez sur <kbd>Fn</kbd>+<kbd>⌫</kbd>. |
| Impossible de déplacer la vue | Le déplacement de la vue utilise le bouton central ou droit de la souris ; choisissez lequel dans **Paramètres → Commandes et raccourcis**. Sur un pavé tactile, cliquez et faites glisser avec deux doigts. Sur un écran tactile, faites glisser un doigt. |
| Mon modèle a disparu | Ouvrir un lien, un fichier ou un exemple, ou effacer le modèle, conserve l’ancien : **☰ → Structures récentes**, ou <kbd>Ctrl</kbd>+<kbd>Z</kbd>. À l’ouverture d’un lien, un message l’indique en bas de l’écran : *Structure partagée ouverte. La précédente est conservée dans Structures récentes.*, avec un bouton **Afficher**. |
| L’interface n’est pas dans la bonne langue | **Paramètres → Langue et paramètres régionaux**, ou ajoutez `?lang=fr` à l’adresse. |
| Les modifications des paramètres ne sont pas conservées | Le stockage local est bloqué, par exemple dans une fenêtre privée ou en mode de confidentialité strict. Les paramètres, le modèle enregistré et les Structures récentes en ont tous besoin. |

## Signaler un bogue {#reporting-a-bug}

Ouvrez un [ticket GitHub](https://github.com/janvorisek/edubeam/issues) en indiquant votre navigateur et votre système d’exploitation, ce que vous avez fait et ce que vous attendiez. Rien n’est plus utile qu’un **lien de partage** ou que le **fichier de projet** qui montre le problème.
