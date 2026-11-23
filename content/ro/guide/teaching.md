---
description: "Predarea cu EduBeam: modele live pe proiector, linkuri de partajare în notele de curs, teme pe care studenții le verifică singuri, probleme generate și lucrări de tipărit cu barem."
source: site
---

# Predarea cu EduBeam

[EduBeam]{.edubeam} s-a născut într-o sală de curs și acolo funcționează în continuare cel mai bine: un model pe proiector care reacționează în clipa în care îl modifici și același model pe laptopul fiecărui student, printr-un link. Această pagină adună ce folosesc cel mai des cadrele didactice, de la primul curs până la examen.

::card-grid{cols="2"}
:::card{title="La curs" icon="lucide:presentation" to="#in-the-lecture"}
Fă modelul lizibil din ultimul rând și modifică-l live.
:::
:::card{title="La primul laborator" icon="lucide:graduation-cap" to="#getting-students-started"}
Zece minute de la un ecran gol la o grindă verificată prin calcul manual.
:::
:::card{title="În note de curs și teme" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
Un link într-un PDF sau pe un slide deschide întregul model, ani la rând.
:::
:::card{title="Teme cu autoverificare" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
Întâi calculul manual, apoi modelul ca verificare.
:::
:::card{title="Probleme de exersat și teste" icon="lucide:file-check" to="#practice-and-test-papers"}
Probleme generate, cu verificare imediată, și lucrări de tipărit cu barem.
:::
:::card{title="Fișe de exerciții și slide-uri din cod" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
Propriile tale generatoare de exerciții și figuri pentru slide-uri, scrise cu @edubeam/plot.
:::
::

## La curs {#in-the-lecture}

- **Fă modelul lizibil din ultimul rând.** În **Setări → Setări de afișare**, mărește **Mărimea fontului** la 18 sau 20 px (20 px este maximul) și **Mărimea reazemelor** la 130–150 %. Mărește **Scara rezultatelor** dacă diagramele par în continuare mici.
- **Arată câte un lucru pe rând.** În opțiunile de afișare din dreapta sus a zonei de desen, debifează totul în afară de mărimea despre care vorbești, apoi adaugă-le pe celelalte una câte una.
- **Modifică modelul live.** Mută un reazem, bifează `Ry`, adaugă o articulație. Studenții văd imediat cauza și efectul, iar <kbd>Ctrl</kbd>+<kbd>Z</kbd> te duce înapoi.
- **Lasă programul de calcul să explice mecanismele.** Eliberează o articulație în plus, iar EduBeam desenează cum se poate mișca structura, animă mișcarea și încercuiește articulațiile vinovate. Este un moment bun pentru a discuta despre stabilitate. Ambele comutatoare se află în **Setări → Setări de afișare → Verificări ale modelului**.
- **Folosește limba și axele studenților tăi.** EduBeam vorbește 18 limbi, iar din [Setări](/ro/essentials/units-settings) comuți între unități SI și americane și între axa z în jos și axa y în sus, ca să se potrivească cu notele tale de curs.

![Un mecanism făcut vizibil: articulațiile din B și C permit cadrului să se deplaseze lateral](/screenshots/ro/ui-mechanism.webp)

## La primul laborator {#getting-students-started}

La prima vizită, EduBeam îi întreabă pe studenți cum vor să înceapă și ce unități și axe să folosească. Spune-le dinainte ce unități și axe folosește cursul tău. Turul (**Prezintă-mi aplicația**), exercițiul ghidat **Desenează prima grindă** și **Exemple** rămân disponibile mai târziu în meniul **☰**.

Un prim laborator bun: „deschideți run.edubeam.app și alegeți *Desenează prima grindă*”, apoi [Ghidul de început](/ro/guide/quick-start), cam zece minute, cu o verificare manuală la final.

### Calculatoarele din laborator și lucrul offline {#offline-and-lab-computers}

EduBeam este o aplicație web progresivă (PWA): după ce browserul a încărcat-o o dată, funcționează și fără conexiune, iar browserul se poate oferi s-o instaleze ca pe o aplicație desktop. Modelul și setările se păstrează separat pentru fiecare profil de browser, așa că pe calculatoarele comune din laborator studenții ar trebui să-și ia lucrul cu ei, ca fișier sau ca link. Detaliile sunt în secțiunea [Ce se păstrează în browser](/ro/essentials/units-settings#what-is-stored-in-your-browser).

## În notele de curs și în teme {#in-lecture-notes-and-assignments}

Un link de partajare conține întregul model, deci funcționează oriunde funcționează un link: într-un PDF, pe un slide, pe o pagină a platformei de e-learning, într-un e-mail.

::div{.steps}

### Construiește modelul {#share-build}

Pregătește-l așa cum vrei să-l vadă studenții prima dată: cu încărcările, etichetele și diagramele pe care le vrei pornite.

### Copiază linkul {#share-copy}

Apasă **Partajează modelul** în bara aplicației. Pornește **Arată ce văd eu** dacă linkul trebuie să se deschidă cu diagramele, încărcările și etichetele tale pornite, apoi apasă **Copiază**.

### Pune-l în notele de curs {#share-paste}

Studenții care îl deschid primesc propria copie, pe care o pot explora. Nimic din ce modifică ei nu ajunge la tine sau la altcineva. Linkurile funcționează de la o versiune EduBeam la alta, așa că notele de curs rămân valabile an de an.

::

Pentru materialele de curs, lasă **Link mai scurt** oprit: o copie EduBeam care nu s-a mai actualizat de când a apărut această opțiune nu poate deschide forma scurtă până nu se actualizează.

| Link | Deschide |
| --- | --- |
| `run.edubeam.app/?model=…` | modelul, gata de editat |
| `run.edubeam.app/?viewer=1&model=…` | modelul în [modul de vizualizare](/ro/essentials/import-export#embed-a-read-only-viewer), pentru un `<iframe>` |
| `run.edubeam.app/?panel=examples` | [galeria de exemple](/ro/examples/) |
| `run.edubeam.app/?lang=ro` | aplicația în română sau în orice [altă limbă](/ro/essentials/import-export#url-parameters) |

::callout{type="warning" title="Un link înlocuiește modelul studentului"}
Deschiderea unui link și, în unele browsere, a unei pagini cu o vizualizare integrată mută modelul pe care îl avea studentul în **☰ → Structuri recente**, de unde poate fi restaurat. Totuși, roagă-i pe studenți să salveze lucrul care contează pentru ei cu **☰ → Salvează proiectul** înainte să deschidă linkurile de la curs.
::

## Teme pe care studenții și le verifică singuri {#assignments-students-can-check-themselves}

EduBeam le oferă studenților un răspuns imediat la calculul manual, fără să aplice metoda în locul lor.

- **Întâi calculează, apoi verifică.** Cere reacțiunile, eforturile și o deplasare calculate manual, apoi cere-le studenților să construiască modelul și să compare. Formulele sunt în [Verificarea rezultatelor prin calcul manual](/ro/guide/verification), iar [Ghidul de început](/ro/guide/quick-start#_8-check-by-hand) arată cum se procedează.
- **Întreabă de ce diferă un rezultat.** Deformațiile din forfecare, o articulație lipsă, o încărcare dată în axe locale în loc de globale: fiecare explică o diferență mică sau mare, iar căutarea ei îi învață pe studenți mai mult decât simpla potrivire a rezultatelor.
- **Cere modelul împreună cu rezolvarea.** Cere un link de partajare sau un `project.json` alături de calcul. Îl poți deschide și vezi exact ce s-a modelat.
- **Rapoarte care arată bine.** Studenții pot exporta desenul ca **SVG**, care rămâne clar în Word și LaTeX, iar rezultatele ca **CSV**. Vezi [Exportul unei imagini](/ro/essentials/import-export#export-an-image).

## Exerciții gata făcute {#ready-made-exercises}

- **[Exemple](/ro/examples/):** șase modele care se deschid dintr-un clic, fiecare cu întrebări, cu ce trebuie urmărit și cu răspunsuri.
- **[Probleme de statică](/ro/practice):** grinzi, cadre și grinzi cu zăbrele generate, care verifică răspunsurile studenților, și un [generator de teste](/ro/exam) care le tipărește ca lucrări. Vezi [mai jos](#practice-and-test-papers).
- **[Tutoriale](/ro/tutorials/inclined-beam):** o grindă înclinată, un cadru cu trei articulații, o grindă cu zăbrele plană și o grindă continuă cu cedare de reazem, fiecare modelată pas cu pas și verificată prin calcul manual. Se potrivesc ca fișe de laborator de 15–20 de minute.
- **[Verificarea rezultatelor prin calcul manual](/ro/guide/verification):** cazurile cu soluție exactă, de la consolă la cedarea de reazem, pe care le poți da ca verificări rapide.

## Probleme de exersat și lucrări de verificare {#practice-and-test-papers}

Două pagini de pe acest site creează probleme de statică pentru tine, fără nimic de instalat și fără nimic de programat:

- **[Probleme de statică](/ro/practice)** le dă studenților o problemă nouă de fiecare dată când o cer. Ei o rezolvă pe hârtie, introduc reacțiunile și momentul încovoietor maxim sau un efort dintr-o bară, iar pagina compară fiecare valoare cu soluția exactă: o abatere de cel mult 1 % este acceptată, iar o valoare corectă cu sensul greșit este semnalată separat. Un indiciu arată cum să înceapă, iar diagramele apar după rezolvare. Fiecare problemă are un cod, de exemplu `H2048`, care desemnează mereu aceeași problemă: pune-l într-o temă și toată lumea se verifică pe aceleași valori.
- **[Generatorul de teste](/ro/exam)** tipărește lucrări de verificare: alegi tipurile de structuri, până la 6 probleme pe lucrare și până la 40 de variante, iar fiecare student primește o variantă diferită. Fiecare variantă are aceleași tipuri de structuri în aceeași ordine, deci lucrările au aceeași dificultate. Generatorul adaugă un rând pentru nume, spațiu pentru rezolvare și barem, iar **Tipărește sau salvează ca PDF** le tipărește. **Descarcă .zip** dă fiecare figură ca fișier SVG pentru LaTeX și Word, iar răspunsurile ca tabel CSV pentru corectare.

Ambele oferă aceleași opt tipuri de structuri: șase static determinate (grindă simplu rezemată, consolă, grindă cu consolă, grindă Gerber, cadru cu trei articulații și grindă cu zăbrele Warren) și două static nedeterminate (grindă continuă cu două deschideri și cadru portal).

Generatorul de teste își păstrează setările, inclusiv **Numărul testului**, care alege valorile, în adresa paginii. Salvează un marcaj, iar anul viitor revin aceleași lucrări și același barem. Implicit, codurile problemelor nu apar pe lucrări: pagina de exerciții arată rezolvarea, deci codurile își au locul în teme, unde studenții își verifică singuri lucrul după aceea.

## Fișe de exerciții, teste și slide-uri din cod {#exercise-sheets-tests-and-slides-from-code}

Diagramele de pe acest site sunt desenate de [@edubeam/plot](/ro/plot), o bibliotecă de componente Vue care desenează orice grindă, cadru sau grindă cu zăbrele plană calculată cu [@edubeam/fem](/ro/solver), programul de calcul din spatele EduBeam. Dacă știi puțin JavaScript, câteva rânduri de cod devin material de curs:

- **Propriile tipuri de probleme.** Când structurile din generatorul de teste nu sunt cele pe care le predai, scrie-le pe ale tale: un seed (valoarea de inițializare a generatorului de numere aleatoare) alege structura și valorile ei, așa că același seed dă mereu același exercițiu, iar baremul se desenează din același seed.
- **Slide-uri care se construiesc treptat.** Arată structura, apoi reazemele și încărcările, apoi reacțiunile, apoi diagrama de moment, pas cu pas, fără ca desenul să se miște între pași. [Un curs demonstrativ despre grinzi cu zăbrele](https://edubeam-slides.pages.dev) este făcut astfel.
- **Figuri pentru note și pagini de curs.** SVG clar, care urmează tema luminoasă sau întunecată a paginii și care, spre deosebire de o aplicație integrată, nu atinge niciodată modelul studentului.

Încearcă. Fiecare apăsare pe **Exercițiu nou** desenează o problemă nouă și baremul ei:

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="Exerciții și teste" icon="lucide:file-check" to="/ro/plot/exercises"}
Generează fișe de exerciții și baremele lor dintr-un seed.
:::
:::card{title="Slide-uri și note de curs" icon="lucide:presentation" to="/ro/plot/slides"}
Figuri care se construiesc strat cu strat, pentru slide-uri și note de curs.
:::
::
