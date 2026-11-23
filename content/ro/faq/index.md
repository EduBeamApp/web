---
description: "Răspunsuri scurte despre EduBeam: cost, lucrul offline, confidențialitate, precizie, cum se calculează rezultatele, cum îl citezi, probleme de exersat, partajare și cod."
source: site
---

# Întrebări frecvente

Răspunsuri scurte, fiecare cu un link către pagina care tratează subiectul pe larg. Nu-ți găsești întrebarea? Vezi [Depanare](/ro/reference/troubleshooting) sau [întreabă pe GitHub](https://github.com/janvorisek/edubeam/issues).

## Generalități {#general}

### Ce este EduBeam? {#what-is-edubeam}

O aplicație gratuită și open source pentru calculul static liniar al grinzilor, cadrelor și grinzilor cu zăbrele plane, făcută pentru studenți, cadre didactice și ingineri care vor un răspuns imediat. Rulează în browser. [Introducerea](/ro/guide/introduction) arată ce poate și ce nu poate face.

### Este chiar gratuit? Am nevoie de cont? {#is-it-really-free-do-i-need-an-account}

Da, este gratuit, și nu, nu ai nevoie de cont. Deschide [run.edubeam.app](https://run.edubeam.app/?lang=ro){target="_blank"} și începe să modelezi: nu trebuie instalat nimic și nu există limite de utilizare. Codul sursă este pe [GitHub](https://github.com/janvorisek/edubeam), sub licența GPL-3.0.

### Pe ce browsere și dispozitive funcționează? {#which-browsers-and-devices-work}

Pe orice versiune actuală de Chrome, Edge, Firefox sau Safari, pe calculator, tabletă sau telefon. Pe un ecran tactil, atinge ca să selectezi, trage un nod ca să-l muți, trage în altă parte ca să deplasezi vederea, apropie sau depărtează două degete ca să mărești sau să micșorezi și ține apăsat pentru meniul desenului. Cu mouse și tastatură modelarea rămâne totuși mai rapidă. Vezi [Tastatură, mouse și ecran tactil](/ro/reference/shortcuts#touch).

### Mi-am pierdut modelul. Îl pot recupera? {#i-lost-my-model-can-i-get-it-back}

Probabil. Când un model este golit sau înlocuit de un link, un fișier sau un exemplu, EduBeam îl păstrează în **☰ → Structuri recente** (ultimele 10), iar <kbd>Ctrl</kbd>+<kbd>Z</kbd> anulează înlocuirea. Ambele există doar în acest browser, deci un model de pe alt calculator sau din alt profil de browser nu se află acolo. Vezi [Structuri recente](/ro/essentials/import-export#recent-structures).

### Îl pot folosi offline? {#can-i-use-it-offline}

Da. EduBeam este o aplicație web progresivă: după ce browserul a încărcat-o, funcționează și fără conexiune, iar browserul se poate oferi s-o instaleze. Când apare o versiune nouă, o fereastră de dialog te întreabă înainte de actualizare.

### Unde sunt stocate datele mele? {#where-is-my-data-stored}

În browserul tău. Nu există conturi și nici stocare în cloud: aplicația păstrează modelul și setările în acest browser, iar un link de partajare poartă modelul în linkul însuși. Vezi [Ce se păstrează în browser](/ro/essentials/units-settings#what-is-stored-in-your-browser).

Aplicația de pe run.edubeam.app colectează totuși statistici de utilizare (Google Analytics) și rapoarte de erori (Sentry). Un raport de eroare, precum și înregistrarea pe care Sentry o face pentru o parte dintre sesiuni, pot include ce era pe ecran, inclusiv modelul tău.

### Unde pot exersa probleme de statică? {#practice}

Pe pagina [Probleme de statică](/ro/practice). Îți dă de fiecare dată o grindă, un cadru sau o grindă cu zăbrele cu alte valori: calculezi pe hârtie reacțiunile și momentul încovoietor maxim sau efortul dintr-o bară, le introduci, iar fiecare valoare este verificată imediat. Și [exemplele](/ro/examples/) vin cu întrebări și răspunsuri. Cadrele didactice pot tipări din [generatorul de teste](/ro/exam) câte o lucrare diferită pentru fiecare student, cu barem; vezi [Probleme de exersat și lucrări de verificare](/ro/guide/teaching#practice-and-test-papers).

### Cum citez EduBeam? {#cite}

Ca pe un program, cu versiunea și data la care l-ai folosit. Versiunea se află în partea de jos a meniului **☰**. De exemplu:

> Voříšek, J. et al. *EduBeam*, versiunea 1.3.4 \[software\]. https://edubeam.app (accesat la 18 noiembrie 2026).

Ca să faci trimitere la un anumit model, adaugă [linkul lui de partajare](/ro/essentials/import-export#share-a-link): el deschide același model pentru fiecare cititor.

## Modelare {#modelling}

### Cum fac o încastrare, o articulație sau un reazem simplu? {#how-do-i-make-a-fixed-pinned-roller-support}

Dă clic pe nod, alege **Reazeme în nod** și alege simbolul: articulație, reazem simplu, încastrare, încastrare glisantă și altele. Sau bifează gradele de libertate blocate în fila **Noduri**: `Dx` + `Dz` + `Ry` este o încastrare, `Dx` + `Dz` o articulație, iar doar `Dz` un reazem simplu. [Noduri și reazeme](/ro/essentials/nodes-supports#supports) descrie toate tipurile.

### Cum fac o grindă cu zăbrele? {#how-do-i-make-a-truss}

Desenează barele ca elemente obișnuite și eliberează ambele capete ale fiecăreia: bifează ambele **Articulații la capete** în fila **Elemente** sau bifează **Articulație la început** și **Articulație la sfârșit** în banda de sus înainte să desenezi barele cu mouse-ul. Aplică încărcările în noduri. [Tutorialul despre grinzi cu zăbrele](/ro/tutorials/truss) construiește una pas cu pas.

### Cum pun o articulație într-un cadru? {#how-do-i-put-a-hinge-in-a-frame}

Eliberează momentul la capătul elementului care trebuie să se rotească liber: bifează articulația de la capătul lui în fila **Elemente**. O articulație aparține unui capăt de element, deci într-un nod în care se întâlnesc mai multe elemente, eliberarea unuia dintre ele le lasă pe celelalte legate rigid. Vezi [Articulații la capete](/ro/essentials/elements#end-hinges).

### Cum adaug un reazem sau o forță concentrată la mijlocul unei grinzi? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Pentru un reazem, adaugă cu mouse-ul un nod pe grindă (butonul **Adaugă nod** cu pictograma cursorului) și alege **Conectează la structură**: grinda se împarte în două în acel nod, pe care apoi îl poți rezema. O forță concentrată nu are nevoie de nod: adaugă elementului o **Forță concentrată** și setează-i poziția față de nodul inițial. Vezi [Plasarea unui nod pe un element existent](/ro/essentials/nodes-supports#placing-a-node-on-an-existing-element) și [Forță concentrată](/ro/essentials/loads#concentrated-load).

### Pot aplica greutatea proprie? {#can-i-apply-self-weight}

Nu automat: densitatea materialului nu se folosește în calculul static. Adaug-o ca încărcare uniform distribuită $f_z = \rho g A$, de exemplu $7850 \cdot 9{,}81 \cdot 28{,}48 \cdot 10^{-4} = 219$ N/m, adică 0,22 kN/m, pentru un IPE 200.

### Pot modela reazeme înclinate? {#can-i-model-inclined-supports}

Da. Setează pentru nod **Unghiul sistemului local al nodului**, iar reazemele lui acționează apoi după axele rotite. Vezi [Reazeme înclinate](/ro/essentials/nodes-supports#inclined-skewed-supports).

### Pot lucra în unități americane? {#can-i-work-in-us-customary-units}

Da. Dă clic pe butonul unităților din colțul din dreapta jos al zonei de desen, care deschide **Setări → Limbă și regiune**, și setează **Sistem de unități** la **Unități americane (imperiale)** pentru picioare și kipi, sau alege fiecare unitate separat. Modelul este stocat în SI, deci schimbarea unităților convertește ce vezi și nu modifică niciodată modelul. Vezi [Unități și setări](/ro/essentials/units-settings).

### Există cazuri sau combinații de încărcări? {#are-there-load-cases-or-combinations}

Nu, un model are un singur caz de încărcare. Salvează fiecare caz ca fișier sau link separat și combină singur rezultatele. O sesiune din programul desktop EduBeam cu mai multe cazuri de încărcare se deschide cu primul dintre ele, iar un mesaj le numește pe cele omise.

### De ce încărcările mele sunt îndreptate în sus? {#why-do-my-loads-point-up}

Probabil pentru că ai introdus o valoare negativă. În EduBeam axa globală z este îndreptată **în jos**, deci un `fz` sau `Fz` pozitiv este o încărcare gravitațională, în jos: 12 kN/m în jos înseamnă `fz = 12`. Vezi [Axe și convenții de semne](/ro/elements/conventions#loads). Dacă la cursul tău axa verticală este îndreptată în sus, comută la **x spre dreapta, y în sus** în **Setări → Limbă și regiune → Sistem de coordonate**: datele introduse și rezultatele urmează atunci această axă.

## Rezultate {#results}

### De ce nu există un buton „Calculează”? {#why-is-there-no-solve-button}

Pentru că modelul este calculat din nou după fiecare modificare. Dacă nu apar rezultate, modelul nu poate fi încă calculat, iar un mesaj pe desen spune de ce. [Depanare](/ro/reference/troubleshooting#no-results-are-drawn) arată ce trebuie verificat.

### De ce diferă puțin săgeata mea de formulă? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam folosește elemente de bară Timoshenko, deci o săgeată include și deformațiile din forfecare, pe care formulele din manuale de obicei le neglijează. La o grindă zveltă diferența este de circa 1 %, iar [Ghidul de început](/ro/guide/quick-start#_8-check-by-hand) o calculează manual. La o structură static nedeterminată, rigiditatea la forfecare modifică puțin și eforturile. Mai multe în [Verificarea rezultatelor prin calcul manual](/ro/guide/verification).

### Cât de precise sunt rezultatele? Am nevoie de mai multe elemente? {#how-accurate-are-the-results-do-i-need-more-elements}

În calculul static liniar, elementul de bară este exact pentru toate tipurile de încărcări pe care le oferă EduBeam, deci un element pe bară este suficient și nu există o rețea de discretizare de îndesit. Adaugă noduri doar acolo unde ai nevoie de un reazem, o articulație, o schimbare de secțiune, o încărcare nodală sau o deplasare de citit. Vezi [Precizie și exactitate](/ro/essentials/results#precision-and-accuracy).

### Cum calculează EduBeam rezultatele? {#how-does-edubeam-compute-the-results}

Prin metoda deplasărilor, în formularea metodei elementelor finite, cea predată la cursurile de Statica construcțiilor, direct în browserul tău. [Cum calculează EduBeam modelul](/ro/elements/analysis) urmărește fiecare pas pe un mic exemplu pe care îl poți reface manual, iar programul de calcul însuși este open source, sub numele [@edubeam/fem](/ro/solver).

### Pot vedea matricele de rigiditate? {#can-i-see-the-stiffness-matrices}

Da. În fila **Elemente**, butonul de matrice din rândul unui element deschide matricea lui de rigiditate de 6 × 6, în axe globale și unități SI (N, m). Un clic pe un element de pe desen oferă și opțiunea **Matrice de rigiditate**. Pagina [Elementul de bară](/ro/elements/beam#global-stiffness-matrix) o deduce.

### Unde găsesc reacțiunile? {#where-are-the-reactions-listed}

Pe desen, ca săgeți cu valorile lor: **Reacțiuni** în opțiunile de afișare, pornite implicit. Se află și în fișierul din **Rezultate → Exportă CSV** și în ce pune **Copiază** în clipboard. Fila **Rezultate** listează deplasările nodurilor și forțele la capetele elementelor. Vezi [Rezultate și diagrame de eforturi](/ro/essentials/results).

## Fișiere și partajare {#files-sharing}

### Cum partajez un model? {#how-do-i-share-a-model}

Apasă **Partajează modelul**, apoi **Copiază**. Linkul conține întregul model, iar oricine îl deschide primește propria copie, pe care o poate edita: nu există colaborare în timp real. Pornește **Arată ce văd eu** ca linkul să se deschidă cu diagramele și etichetele tale pornite. Vezi [Partajarea unui link](/ro/essentials/import-export#share-a-link) și, pentru cursuri, [Predarea cu EduBeam](/ro/guide/teaching#in-lecture-notes-and-assignments).

### Pot încorpora un model pe site-ul meu sau în slide-uri? {#can-i-embed-a-model-on-my-website-or-in-slides}

Da. Adaugă `&viewer=1` la un link de partajare și pune-l într-un `<iframe>`: vezi [Încorporarea unei vizualizări](/ro/essentials/import-export#embed-a-read-only-viewer). Pentru o figură statică într-o pagină, pe un slide sau în note de curs tipărite, exportă un SVG sau desenează-l din cod cu [@edubeam/plot](/ro/plot).

### Pot exporta imagini sau tabele? {#can-i-export-images-or-tables}

Da. **☰ → Exportă imaginea** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) salvează desenul ca PNG sau SVG, la mărimea sau la scara pe care o alegi. **Rezultate → Exportă CSV** salvează ambele tabele de rezultate, iar **Copiază** le pune în clipboard pentru o foaie de calcul. Vezi [Exportul unei imagini](/ro/essentials/import-export#export-an-image).

### Pot deschide fișiere din programul desktop EduBeam? {#can-i-open-files-from-the-desktop-edubeam}

Da. Sesiunile salvate de programul desktop EduBeam 2.x–3.5 (`.xml`) se deschid cu **☰ → Deschide un proiect** sau trăgându-le peste aplicație, la fel ca un `project.json`. Valorile lor sunt citite în kN, kPa și m. Vezi [Deschiderea unui proiect](/ro/essentials/import-export#open-a-project).

### Pot genera modele din cod? {#can-i-generate-models-programmatically}

Da, în două moduri:

- **Scrie fișierul.** Un `project.json` este JSON simplu, în unități SI, deci îl poate scrie un script în orice limbaj, iar EduBeam îl deschide cu **Deschide un proiect** sau prin tragere și plasare. Vezi [formatul fișierului de proiect](/ro/essentials/import-export#project-file-format).
- **Calculează-l din cod.** [@edubeam/fem](/ro/solver) este programul de calcul cu elemente finite din spatele EduBeam, sub forma unei biblioteci JavaScript și TypeScript. [@edubeam/plot](/ro/plot) desenează apoi rezultatul, de exemplu ca [fișă de exerciții generată](/ro/plot/exercises).

Grinda din [Ghidul de început](/ro/guide/quick-start), în unități SI:

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // articulație
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // reazem simplu
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, în jos

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 54000 N·m la mijlocul deschiderii
beam.computeLocalDefl(lc, 2).w[1] // 0.0502 m la mijlocul deschiderii
```

## Asistență {#support}

### Cum raportez o eroare sau propun o funcție? {#how-do-i-report-a-bug-or-request-a-feature}

Deschide un issue pe [GitHub](https://github.com/janvorisek/edubeam/issues) și atașează un link de partajare sau un fișier de proiect care arată problema. Pentru întrebări private, scrie la [support@edubeam.app](mailto:support@edubeam.app).
