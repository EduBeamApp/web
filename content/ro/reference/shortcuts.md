---
description: "Toate scurtăturile de tastatură, acțiunile cu mouse-ul și gesturile tactile din EduBeam: anulare, salvare, deschidere, export de imagini, copiere și lipire, încadrare, mărire, selectare și deplasarea vederii."
source: site
---

# Tastatură, mouse și ecran tactil

EduBeam funcționează cu tastatură și mouse, cu touchpad sau cu degetul. Această pagină listează toate scurtăturile și gesturile. Pe Mac, folosește <kbd>Cmd</kbd> oriunde apare <kbd>Ctrl</kbd>; meniurile aplicației afișează acolo ⌘.

## Tastatură {#keyboard}

Scurtăturile pentru desen (<kbd>F</kbd>, <kbd>C</kbd>, <kbd>G</kbd>, <kbd>S</kbd>, <kbd>Delete</kbd> și <kbd>Ctrl</kbd>+<kbd>A</kbd>, <kbd>C</kbd>, <kbd>V</kbd>) nu fac nimic cât timp un câmp de text este activ, așa că tastarea unui `f` sau `s` într-un câmp nu le declanșează niciodată. Dă mai întâi clic pe desen.

### Fișiere și istoric {#files-and-history}

| Scurtătură | Acțiune |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> | Anulează ultima modificare a modelului |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> | Refă |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Salvează proiectul (descarcă `project.json`) |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Deschide un proiect |
| <kbd>Ctrl</kbd>+<kbd>P</kbd> | Exportă imaginea |

Anularea readuce și modelul după golire, după deschiderea unui fișier, a unui link sau a unui exemplu și după restaurarea unei structuri recente. Cât timp încă scrii într-o celulă de tabel, <kbd>Ctrl</kbd>+<kbd>Z</kbd> anulează ce ai scris; după ce celula este confirmată, anulează modificarea modelului. În câmpurile unei ferestre de dialog anulează întotdeauna ce ai scris.

### Desen {#drawing}

| Scurtătură | Acțiune |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>A</kbd> | Selectează tot |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Copiază nodurile, elementele și încărcările selectate |
| <kbd>Ctrl</kbd>+<kbd>V</kbd> | Lipește. O imagine transparentă a copiei urmează cursorul: dă clic ca s-o plasezi sau introdu un decalaj Δx, Δz în banda de sus și apasă **Lipește** sau <kbd>Enter</kbd> |
| <kbd>Delete</kbd> | Șterge selecția (pe un laptop Mac, <kbd>Fn</kbd>+<kbd>Delete</kbd>) |
| <kbd>Esc</kbd> | Părăsește modul curent (adăugarea de noduri, elemente sau cote, lipirea, alegerea unei ferestre pentru o imagine) și golește selecția; închide și meniul ☰ și încheie turul |
| <kbd>F</kbd> | Încadrează modelul în ecran |
| <kbd>C</kbd> | Centrează modelul |
| <kbd>G</kbd> | Afișează/ascunde grila |
| <kbd>S</kbd> | Pornește/oprește alinierea la grilă |
| <kbd>Ctrl</kbd>+<kbd>+</kbd> / <kbd>Ctrl</kbd>+<kbd>-</kbd> | Mărește / micșorează desenul față de centrul lui |

În EduBeam, <kbd>Ctrl</kbd>+<kbd>+</kbd> și <kbd>Ctrl</kbd>+<kbd>-</kbd> măresc și micșorează desenul, niciodată întreaga interfață, cum se întâmplă pe alte site-uri. Funcționează cu orice aranjament de tastatură: tastele marcate cu + și −, oriunde le-ar avea aranjamentul tău, cele două din stânga lui <kbd>Backspace</kbd> pe o tastatură americană și + și − de pe tastatura numerică.

### Tabele și ferestre de dialog {#tables-and-dialogs}

| Scurtătură | Acțiune |
| --- | --- |
| <kbd>Enter</kbd> | Într-o celulă de tabel: confirmă valoarea. Într-un câmp de text al unei ferestre de dialog: confirmă fereastra, ca butonul ei principal |
| <kbd>Esc</kbd> | Într-o celulă de tabel: o părăsește, păstrând valoarea. Într-o fereastră de dialog: o închide fără să salveze |
| <kbd>Tab</kbd> | Trece la câmpul următor; o celulă de tabel păstrează ce ai scris |

Câmpurile numerice acceptă operații aritmetice scrise așa cum calculezi: `6/2`, `3*1,5`, `2^3`, `(4+2)/3`, precum și `1e3`; separatorul zecimal poate fi virgula sau punctul.

## Mouse {#mouse}

| Acțiune | Rezultat |
| --- | --- |
| Clic | Selectează un nod, un element, o încărcare sau o cotă și îi deschide panoul |
| Tragere pe o zonă goală a desenului | Dreptunghi de selecție |
| Tragerea unui nod | Îl mută; cu alinierea pornită, nodul se aliniază la grilă |
| Clic în timpul adăugării | Plasează un nod sau începe ori continuă o linie frântă de elemente |
| Dublu clic pe o încărcare | Editează încărcarea (și o deplasare impusă) |
| Clic dreapta | Meniul desenului: Adaugă nod, Adaugă element, Adaugă cotă, Cotează elementul (deasupra unui element), Editează, Copiază, Lipește, Șterge |
| <kbd>Ctrl</kbd> + **Adaugă nod** sau **Adaugă element** în meniul desenului | Plasare cu mouse-ul în loc de deschiderea unei ferestre de dialog |
| Tragere cu butonul din mijloc sau din dreapta | Deplasează vederea. Butonul se alege în **Setări → Comenzi și scurtături → Deplasarea vederii cu** |
| Rotiță | Mărește spre cursor |
| Cursorul deasupra unui obiect | Etichetă cu deplasările, caracteristicile sau valorile încărcării |

Pe un touchpad, apropierea degetelor și derularea cu două degete măresc sau micșorează. Ca să deplasezi vederea, dă clic și trage cu două degete, ceea ce echivalează cu o tragere cu butonul din dreapta.

## Ecran tactil {#touch}

| Gest | Rezultat |
| --- | --- |
| Atingere | Selectează un obiect și îi arată detaliile și acțiunile |
| Atingere în timpul adăugării | Plasează un nod sau continuă un element |
| Apăsare pe un nod și tragere | Mută nodul |
| Tragere cu un deget în altă parte | Deplasează vederea |
| Apropierea sau depărtarea a două degete | Mărește sau micșorează |
| Apăsare lungă pe desen | Meniul desenului |
| Butonul **Selectare cu dreptunghi** (dreapta sus), apoi tragere | Dreptunghi de selecție; meniul desenului, cu Copiază și Șterge, se deschide acolo unde ridici degetul |

Când adaugi noduri, elemente sau cote, lipești sau alegi o fereastră pentru o imagine, o bandă din partea de sus a desenului arată modul curent și are un buton **Renunță**. Fără tasta <kbd>Esc</kbd>, așa părăsești modul pe un ecran tactil.

## Panourile obiectelor {#object-panels}

Un clic sau o atingere pe un obiect deschide lângă el un panou cu detaliile lui și cu aceste acțiuni:

| Obiect | Acțiuni |
| --- | --- |
| Nod | Adaugă încărcare · Reazeme în nod (simbolul reazemului, Dx, Dz, Ry) · Unghiul sistemului local al nodului · Impune o deplasare (pe un nod rezemat) · Șterge |
| Element | Editează elementul (nodurile de capăt și articulațiile, materialul, secțiunea transversală) · Adaugă încărcare · Matrice de rigiditate · Șterge |
| Încărcare nodală sau pe element | Editează încărcarea · Șterge |
| Cotă | Editează · Inversează cota · Șterge |

[Interfața aplicației](/ro/essentials/user-interface) prezintă ecranul, iar [Comenzi și scurtături](/ro/essentials/units-settings#controls-shortcuts) din setări alege butonul pentru deplasarea vederii.
