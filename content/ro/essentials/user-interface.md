---
description: "Harta interfeței EduBeam: bara aplicației și meniul ☰, zona de desen și opțiunile de afișare, selectarea și editarea, tabelele din bara de jos, introducerea valorilor."
source: site
---

# Interfața aplicației

[EduBeam]{.edubeam} are trei zone: **bara aplicației** sus, **zona de desen** la mijloc, unde desenezi, și **bara de jos**, cu câte un tabel pentru fiecare tip de obiect. Tot ce poți face în zona de desen poți face și în tabele, și invers.

![Părțile interfeței, numerotate ca în lista de mai jos](/screenshots/ro/ui-overview.webp)

1. **Meniul ☰**: deschidere, salvare, partajare și export; exemple și tururi ghidate.
2. **Golește modelul** și **Partajează modelul**.
3. **Anulează** și **Refă**.
4. **Butoanele vederii**: centrare, încadrare în ecran și opțiunile de afișare.
5. **Opțiunile de afișare**: ce rezultate și ce părți ale modelului sunt desenate.
6. **Grila, alinierea, reticulul și unitățile.**
7. **Filele din bara de jos**: Noduri, Elemente, Încărcări, Materiale, Secțiuni, Rezultate.
8. **Tabelul** filei deschise, în care poți edita orice valoare.

::callout{type="tip" title="Fă turul aplicației"}
**☰ → Prezintă-mi aplicația** îți arată aceste părți direct în aplicație, una câte una.
::

## Bara aplicației {#app-bar}

- **☰** deschide meniul principal, descris mai jos.
- **Golește modelul** șterge, după confirmare, toate nodurile, elementele și încărcările; bifează **Șterge materialele** sau **Șterge secțiunile** ca să le elimini și pe acestea. <kbd>Ctrl</kbd>+<kbd>Z</kbd> readuce modelul, care se păstrează și în *Structuri recente*.
- **Partajează modelul** deschide [fereastra de partajare](/ro/essentials/import-export#share-a-link), cu un link care conține tot modelul.
- **Ce este nou?** afișează notele de versiune. După o actualizare, ele se deschid și singure, o singură dată.
- **Documentație** deschide acest ghid, iar pictograma GitHub, codul sursă.

Pe telefon încap doar ☰ și **Documentație**; **Golește modelul** și **Partajează modelul** se găsesc în meniu.

### Meniul ☰ {#the-☰-menu}

![Meniul ☰](/screenshots/ro/ui-app-menu.webp){.shot-xs}

- **Deschide un proiect** și **Salvează proiectul** deschid, respectiv descarcă, un fișier `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>).
- **Structuri recente** păstrează ultimele 10 modele pe care le-ai golit sau înlocuit, gata de restaurat.
- **Exportă imaginea** salvează desenul ca PNG sau SVG ori îl copiază în clipboard (<kbd>Ctrl</kbd>+<kbd>P</kbd>).
- **Exemple** este galeria de modele gata făcute; **Desenează prima grindă** este un exercițiu ghidat în șapte pași; **Prezintă-mi aplicația** este turul interfeței.
- **Partajează modelul** și **Golește modelul** fac același lucru ca butoanele din bara aplicației.

În partea de jos a meniului apar versiunea aplicației și data lansării ei. Deschiderea, salvarea, partajarea și exportul sunt descrise în [Fișiere, linkuri și export](/ro/essentials/import-export).

## Zona de desen {#viewer}

Suprafața pe care desenezi și examinezi modelul. Rezultatele se recalculează la fiecare modificare, așa că nu există un buton *Calculează*.

### Butoanele din zona de desen {#buttons-on-the-canvas}

**Stânga sus: Anulează și Refă** te duc înapoi și înainte prin toate modificările modelului: adăugare, editare, tragere, ștergere, golire (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>).

**Dreapta sus:**

- **Selectare cu dreptunghi**, pe un dispozitiv cu ecran tactil: următoarea tragere cu degetul selectează un dreptunghi.
- **Centrează modelul** aduce modelul în centru fără să schimbe mărirea (<kbd>C</kbd>); **Încadrează modelul în ecran** alege mărirea astfel încât să se vadă tot modelul (<kbd>F</kbd>).
- **⚙** afișează sau ascunde [opțiunile de afișare](#display-options).

**Dreapta jos:**

![Butoanele pentru grilă, aliniere, reticul și unități](/screenshots/ro/ui-grid-units.webp){.shot-sm}

- **G** afișează sau ascunde grila și riglele (<kbd>G</kbd>); **S** pornește sau oprește alinierea la grilă (<kbd>S</kbd>).
- Butonul **reticulului** marchează pe rigle poziția cursorului, doar când lucrezi cu mouse-ul.
- **Butonul unităților** deschide setările la secțiunea [Limbă și regiune](/ro/essentials/units-settings#language-locale).

### Opțiunile de afișare {#display-options}

Butonul ⚙ deschide două rânduri de casete de bifare. Primul alege rezultatele desenate peste model: *Deformata*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)* și *Reacțiuni*; la început sunt pornite deformata, momentul încovoietor și reacțiunile. Al doilea afișează sau ascunde părți ale modelului: *Reazeme*, *Încărcări*, *Etichetele nodurilor* și *Etichetele elementelor*, toate pornite la început.

![Butoanele vederii și opțiunile de afișare](/screenshots/ro/ui-display-settings.webp){.shot-lg}

**Mai multe setări** deschide [setările de afișare](/ro/essentials/units-settings#viewer-settings): dimensiuni, culori și modul în care se desenează diagramele. Ce arată fiecare rezultat este explicat în [Rezultate și diagrame de eforturi](/ro/essentials/results#overlays-in-the-viewer).

### Navigarea {#navigating}

| Acțiune | Mouse și tastatură | Ecran tactil |
| --- | --- | --- |
| Mărire și micșorare | Rotița mouse-ului, spre cursor; pe touchpad, apropie sau depărtează degetele ori derulează cu două degete | Apropie sau depărtează degetele |
| Deplasarea vederii | Tragere cu butonul din dreapta sau cu rotița apăsată; alegi care dintre ele în [Comenzi și scurtături](/ro/essentials/units-settings#controls-shortcuts) | Tragere cu un deget |
| Încadrare, centrare | <kbd>F</kbd>, <kbd>C</kbd> sau butoanele din dreapta sus | Butoanele din dreapta sus |

<kbd>Ctrl</kbd>+<kbd>+</kbd> și <kbd>Ctrl</kbd>+<kbd>-</kbd> măresc și micșorează desenul față de centrul lui, indiferent de configurația tastaturii. Nu scalează niciodată întreaga interfață, cum ar face mărirea din browser.

### Selectarea și editarea {#selecting-and-editing}

| Ca să | Fă așa |
| --- | --- |
| Selectezi un obiect | Dă clic pe un nod, un element, o încărcare sau o cotă. Lângă el se deschide un panou cu acțiunile lui: adăugarea unei încărcări, definirea reazemelor, editarea, afișarea matricei de rigiditate, ștergerea. Bara de jos trece la fila corespunzătoare. |
| Selectezi mai multe | Trage un dreptunghi pe o zonă goală a desenului (pe ecran tactil, apasă mai întâi **Selectare cu dreptunghi**). Se selectează toate nodurile din interior și toate elementele atinse de dreptunghi, împreună cu încărcările și cotele lor. <kbd>Ctrl</kbd>+<kbd>A</kbd> selectează tot. |
| Ștergi, copiezi, lipești | <kbd>Delete</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>. Copia lipită urmează cursorul până dai clic; poți și să introduci un decalaj Δx, Δz în bara care apare. |
| Muți un nod | Trage-l. Cu alinierea pornită, ajunge pe grilă; elementele și încărcările legate de el îl urmează. |
| Editezi o încărcare | Dă dublu clic pe ea. |
| Vezi detalii | Ține cursorul deasupra oricărui obiect și apare o explicație: la un nod, deplasările și rotirea; la un element, materialul și secțiunea; la o încărcare, valorile ei. Pe ecran tactil, atinge obiectul: panoul arată același lucru. |
| Deschizi meniul desenului | Dă clic dreapta pe desen sau, pe ecran tactil, ține degetul apăsat. |

::div{.shots}

![Panoul unui nod: adaugă o încărcare, definește reazemele, impune o deplasare](/screenshots/ro/ui-node-menu.webp)

![Cu cursorul deasupra unui nod se văd deplasările și rotirea lui](/screenshots/ro/ui-hover.webp)

::

**Meniul desenului** oferă *Adaugă nod*, *Adaugă element*, *Adaugă cotă* (iar deasupra unui element și *Cotează elementul*), apoi *Editează*, *Copiază*, *Lipește* și *Șterge* pentru selecția curentă. Dacă ții apăsat <kbd>Ctrl</kbd> când alegi *Adaugă nod* sau *Adaugă element*, le plasezi cu mouse-ul în loc de fereastra de dialog.

![Meniul desenului](/screenshots/ro/ui-canvas-menu.webp){.shot-sm}

Pagina [Tastatură, mouse și ecran tactil](/ro/reference/shortcuts) cuprinde toate scurtăturile și gesturile.

### Când modelul nu poate fi calculat {#when-the-model-cannot-be-solved}

Mesajele apar în stânga sus a zonei de desen:

| Mesaj | Înseamnă |
| --- | --- |
| *Nu există materiale definite.*, *Nu există secțiuni definite.* | Adaugă unul cu butonul **Adaugă** de lângă mesaj. |
| O etichetă albastră **Necesită reazeme** | Modelul pur și simplu nu este terminat: mai are nevoie de reazeme. |
| Un mesaj roșu, cu **Arată detaliile** | Ceva este greșit. Detaliile enumeră fiecare problemă, fiecare cu o indicație. |
| Un mesaj galben | Modelul a fost calculat, dar ceva pare ciudat, de exemplu un nod de care nu este legat niciun element. |

Când structura încă se poate mișca, EduBeam îi animă mișcarea printr-un contur punctat și încercuiește nodurile sau articulațiile care o permit. Ține cursorul deasupra mesajului ca să vezi din nou mișcarea; butonul cu ochi o ascunde.

![Un cadru cu articulații în B și C este un mecanism: EduBeam arată cum se mișcă](/screenshots/ro/ui-mechanism.webp)

[Depanare](/ro/reference/troubleshooting#messages) explică fiecare mesaj și cum rezolvi problema.

## Bara de jos {#bottom-bar}

Șase file, fiecare cu o bară de instrumente și un tabel editabil. Eticheta filei arată câte obiecte conține. Trage în sus sau în jos șirul de file ca să schimbi înălțimea barei sau pliaz-o cu butonul din dreapta. Butonul **?** de lângă acesta explică fila deschisă, la fel ca **?** de lângă unele titluri de coloane.

| Filă | Bara de instrumente | Coloanele tabelului |
| --- | --- | --- |
| **Noduri** | Adaugă nod (dialog), Adaugă nod (mouse) | Nod, Coordonate, **Grade de libertate blocate** (simbolul reazemului, `Dx`, `Dz`, `Ry`, unghiul α), Încărcări, Acțiuni |
| **Elemente** | Adaugă element (dialog), Adaugă element (mouse) | Element, Tip, Noduri (cu **Inversează nodurile**), Material, Secțiune transversală, **Articulații la capete**, Încărcări, Acțiuni |
| **Încărcări** | Adaugă încărcare nodală, Adaugă încărcare pe element | Tip, Punct de aplicare, Componente, Acțiuni |
| **Materiale** | Adaugă material, Bibliotecă de materiale | Material, E, G, α<sub>T</sub>, Acțiuni |
| **Secțiuni** | Adaugă secțiune, Bibliotecă de secțiuni, Secțiune poligonală | Formă, Secțiune transversală, Arie, I<sub>y</sub>, Înălțime, Coeficient de forfecare, Acțiuni |
| **Rezultate** | Rezultate în noduri, Rezultate pe elemente, Exportă CSV, Copiază | Deplasările fiecărui nod sau forțele la capetele fiecărui element; vezi [Rezultate](/ro/essentials/results#results-tab) |

Filele sunt descrise în detaliu în [Noduri și reazeme](/ro/essentials/nodes-supports), [Elemente, materiale și secțiuni](/ro/essentials/elements), [Încărcări](/ro/essentials/loads) și [Rezultate și diagrame de eforturi](/ro/essentials/results#results-tab).

### Introducerea valorilor {#typing-values}

Toate câmpurile numerice, din tabele și din ferestrele de dialog, funcționează la fel:

- Valorile sunt în [unitățile curente](/ro/essentials/units-settings#units), afișate în titlul coloanei sau după câmp.
- Merg atât punctul, cât și virgula zecimală: `2.5` și `2,5` înseamnă același lucru.
- Poți scrie operații cu `+ - * / ^` și paranteze, deci `6/2`, `3*1.5`, `2^3` sau `(4+2)/3` sunt calculate automat, iar `1e-5` înseamnă $10^{-5}$.
- Într-un tabel, valoarea se aplică la <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Tab</kbd> sau la un clic în altă parte. Apoi <kbd>Ctrl</kbd>+<kbd>Z</kbd> o anulează; cât timp încă scrii, anulează doar textul tastat.

## Filele de deasupra zonei de desen {#tabs-above-the-viewer}

**Vizualizare** afișează desenul. **Setări** afișează în locul lui [setările](/ro/essentials/units-settings) pe tot spațiul, așa că poți schimba culorile sau unitățile și poți reveni ca să vezi efectul. Butonul unităților și *Mai multe setări* deschid aceleași setări ca fereastră de dialog peste model.

## Ferestre flotante {#floating-windows}

**Matrice de rigiditate** (din panoul unui element sau din tabelul *Elemente*) deschide o fereastră cu matricea de rigiditate 6 × 6 a elementului în axe globale. **Editează** din meniul desenului deschide un tabel cu selecția curentă. Muți o fereastră trăgând de bara ei de titlu și o închizi cu ×.
