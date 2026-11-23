---
description: "De ce EduBeam nu arată rezultate și cum rezolvi problema: fiecare mesaj de eroare și avertisment explicat, rezultate care par greșite și fișiere sau linkuri care nu se deschid."
source: site
---

# Depanare

Când un model nu poate fi calculat, [EduBeam]{.edubeam} spune de ce într-un mesaj din stânga sus a zonei de desen, iar **Arată detaliile** listează complet fiecare problemă. Alege titlul ferestrei pe care ai văzut-o: fiecare mesaj de mai jos explică ce înseamnă și cum îl rezolvi.

::card-grid{cols="2"}
:::card{title="Încă nu poate fi calculat" icon="lucide:circle-dashed" to="#still-needed"}
O etichetă albastră **Necesită reazeme**. Nu e nimic greșit: structura doar nu este încă fixată.
:::
:::card{title="Modelul nu poate fi calculat" icon="lucide:circle-x" to="#errors"}
Un mesaj roșu. Reazeme care nu fixează structura, articulații care formează un mecanism, un element de lungime zero.
:::
:::card{title="Avertismente pentru model" icon="lucide:triangle-alert" to="#warnings"}
Un mesaj galben. Modelul este calculat, dar probabil ceva nu este cum ai vrut.
:::
:::card{title="Rezultatele par greșite" icon="lucide:scale" to="#results-look-wrong"}
Încărcări care acționează în sus, săgeți greșite cu câteva ordine de mărime, un semn care pare inversat.
:::
::

## Mesaje {#messages}

### Ce înseamnă culorile {#read-the-message}

| Vezi | Înseamnă |
| --- | --- |
| O etichetă albastră **Necesită reazeme** | Modelul nu este terminat. Adaugă reazeme. Ține cursorul deasupra etichetei ca să vezi, ca un contur punctat, cum se mai poate mișca structura. |
| Un mesaj **roșu** | Ceva împiedică calculul. Mesajul numește problema sau, când sunt mai multe, arată *Erori în model: n*. Nodurile implicate sunt încercuite pe desen. |
| Un mesaj **galben** | Avertismente. Modelul a fost totuși calculat. Când sunt mai multe, arată *Avertismente în model: n*. |
| *Nu există materiale definite.* / *Nu există secțiuni definite.* | Elementele au nevoie de amândouă. Adaugă câte unul cu butonul **Adaugă** de lângă mesaj. |

**Arată detaliile** deschide fereastra de dialog, intitulată *Încă nu poate fi calculat*, *Modelul nu poate fi calculat* sau *Avertismente pentru model*. Comutatorul ei arată sau ascunde cum se poate mișca structura, iar linkul **Depanare** duce aici.

![Fereastra Modelul nu poate fi calculat, cu comutatorul care arată cum se poate mișca structura](/screenshots/ro/ui-diagnostics.webp){.shot-lg}

Pe desen:

- **✕** de pe un mesaj roșu îl restrânge într-o mică etichetă *Modelul nu poate fi calculat*, ca să facă loc pe un ecran mic. Dă clic pe etichetă ca s-o extinzi.
- Butonul cu **ochi** de pe un mesaj roșu arată sau ascunde conturul punctat al mișcării. **Setări → Setări de afișare → Verificări ale modelului** oprește definitiv conturul și animația lui.
- **✕** de pe un mesaj galben ascunde avertismentele.

### Mai lipsește {#still-needed}

Modelul nu este greșit, doar neterminat. Ține cursorul deasupra etichetei pentru textul scurt; fereastra de dialog îl arată pe cel lung.

| Mesaj | Semnificație și soluție |
| --- | --- |
| *Structura are nevoie de reazeme înainte de a putea fi calculată.* <br> *Pentru a fi stabil în calculul 2D, modelul are nevoie de cel puțin 3 grade de libertate blocate.* | În total sunt blocate mai puțin de trei direcții. Adaugă reazeme. |
| *Partea cu nodurile … are nevoie de reazeme.* <br> *O parte separată a structurii (nodurile …) are mai puțin de 3 grade de libertate blocate și se poate mișca liber.* | Modelul este format din bucăți, iar una dintre ele plutește. Leag-o de restul sau rezem-o. |
| *Părți ale structurii care au nevoie de reazeme: n.* | Mai multe bucăți plutesc. **Arată detaliile** le listează. |

### Erori {#errors}

Ceva împiedică calculul. Mesajul roșu arată textul scurt; fereastra de dialog pe cel lung.

| Mesaj | Semnificație și soluție |
| --- | --- |
| *Reazemele nu fixează structura: încă se poate deplasa pe orizontală / deplasa pe verticală / roti liber / mișca precum un corp rigid.* <br> *Structura are destule reazeme, dar acestea nu o fixează: încă se poate …* | Legăturile sunt suficiente ca număr, dar sunt toate paralele sau direcțiile lor se intersectează într-un singur punct, ca la trei reazeme simple pe o grindă orizontală. Conturul punctat arată mișcarea; rotește sau mută un reazem. |
| *Partea cu nodurile … nu este fixată: încă se poate …* <br> *O parte separată a structurii (nodurile …) are destule reazeme, dar acestea nu o fixează: încă se poate …* | Același lucru, pentru o bucată a unui model format din mai multe bucăți. |
| *Articulațiile din nodul … permit mișcarea structurii.* <br> *Reazemele fixează structura, dar ea este încă un mecanism: barele se pot roti în jurul articulațiilor din nodul …* | Articulațiile permit barelor să se rotească unele față de altele, ca la un cadru pe două baze articulate cu câte o articulație în vârful fiecărui stâlp sau la un pătrat din bare articulate fără diagonală. Elimină o articulație sau adaugă o bară ori un reazem. |
| *Structura este instabilă: se deplasează aproape fără rezistență.* <br> *Structura este instabilă: nodul … pe orizontală (Dx) … se deplasează practic fără rezistență.* | Aproape un mecanism sau o rigiditate apropiată de zero. Mesajul lung numește nodurile și direcțiile. Verifică reazemele, articulațiile și valorile `E`, `A` și `Iy`. |
| *Structura este un mecanism: se poate mișca fără rezistență.* <br> *Structura este un mecanism: matricea de rigiditate este singulară.* | Ceva se poate mișca liber, fără să fi fost prins de verificările de mai sus. Verifică dacă fiecare parte este fixată de cel puțin trei legături și dacă articulațiile de capăt nu lasă vreo bară liberă să se rotească. |
| *Elementul … are lungime zero: nodurile … și … sunt în același punct.* | Două noduri ale aceluiași element sunt suprapuse. Mută unul dintre ele sau șterge elementul. |
| *Elementul … are același nod la ambele capete.* | Șterge elementul și desenează-l din nou între două noduri diferite. |
| *Elementul … face referire la nodul / materialul / secțiunea inexistent(ă) …* | Obiectul folosit a fost șters, de obicei într-un fișier de proiect editat manual. Atribuie-l din nou în tabelul *Elemente*. |
| *Elementul … trebuie să aibă exact 2 noduri.* | Un element defect într-un fișier importat. Șterge-l și desenează-l din nou. |
| *Încărcarea nodală nr. n face referire la nodul inexistent …* <br> *Deplasarea impusă nr. n face referire la nodul inexistent …* | Șterge încărcarea sau atribuie-i un nod existent. |
| *Încărcarea pe element nr. n face referire la elementul inexistent …* | Șterge încărcarea. |
| *Calculul a eșuat din cauza unei neconcordanțe interne în model.* | O eroare generică. Anulează ultimul pas sau salvează proiectul și [raportează problema](#reporting-a-bug). |

### Avertismente {#warnings}

Modelul este totuși calculat, dar verifică aceste situații:

| Mesaj | Semnificație și soluție |
| --- | --- |
| *Nodul … nu este legat de niciun element și este ignorat la calcul.* | Un nod rătăcit. Șterge-l sau leagă-l de structură. |
| *Nodul … are reazem, dar niciun element nu este legat de el, așa că reazemul nu preia nimic.* | Un reazem pe un nod rătăcit. |
| *Încărcarea nodală nr. n conține valori invalide.* <br> *Deplasarea impusă nr. n conține valori invalide.* | O componentă care nu este un număr. Editează încărcarea. |

### În timpul editării {#while-editing}

Aceste mesaje apar într-o fereastră de dialog a browserului în timp ce lucrezi, iar modelul rămâne neschimbat:

| Mesaj | Semnificație și soluție |
| --- | --- |
| *Adaugă mai întâi un material.* <br> *Adaugă mai întâi o secțiune.* | Un element are nevoie de amândouă. Adaugă unul în fila *Materiale* sau *Secțiuni*, apoi desenează din nou elementul. |
| *Alege un material și o secțiune.* | Fereastra **Adaugă element** are un câmp gol. Alege-le pe amândouă. |
| *Eticheta … este deja folosită.* | Două noduri, elemente, materiale sau secțiuni nu pot avea aceeași etichetă. Alege alta. |
| *Pentru acest nod există deja o deplasare impusă. Elimin-o mai întâi.* | Un nod poate avea o singură deplasare impusă. Editează-o pe cea existentă sau șterge-o mai întâi. |

## Nu se desenează nimic {#no-results-are-drawn}

Când nu apare nicio diagramă, verifică, în această ordine:

::div{.steps}

### Verifică opțiunile de afișare {#check-the-display-options}

Dacă nu există niciun mesaj, modelul este calculat: diagrama poate fi pur și simplu oprită. Bifează **M<sub>y</sub>(x)** sau alt rezultat în opțiunile de afișare din dreapta sus a zonei de desen; butonul ⚙ de deasupra lor afișează panoul. Un model fără nicio încărcare are rezultate nule peste tot, deci nici atunci nu există nimic de desenat.

### Verifică reazemele {#check-the-supports}

Programul de calcul are nevoie de cel puțin trei direcții blocate, iar împreună reazemele trebuie să împiedice structura să alunece sau să se rotească. O grindă pe două reazeme simple are doar două și alunecă: transformă unul dintre ele într-o **articulație**. Nici trei reazeme simple paralele sau reazemele ale căror direcții se intersectează într-un singur punct nu o fixează. Vezi [Noduri și reazeme](/ro/essentials/nodes-supports#supports).

### Verifică dacă elementele sunt legate {#check-the-connections}

Două noduri cu aceleași coordonate sunt totuși două noduri separate, iar o parte care atinge restul structurii doar acolo plutește liber. Șterge nodul în plus și leagă din nou elementele. Când plasezi un nod pe un element, răspunde cu **Conectează la structură** ca elementul să fie împărțit acolo.

### Numără articulațiile {#count-the-hinges}

Un cadru pe două baze articulate cu câte o articulație în vârful fiecărui stâlp sau un pătrat din bare articulate fără diagonală este un mecanism. EduBeam încercuiește articulațiile și animă un contur punctat care arată mișcarea posibilă. Vezi [Articulații la capete](/ro/essentials/elements#end-hinges).

### Caută o rigiditate nulă {#look-for-zero-stiffness}

`E`, `A` sau `Iy` introduse ca 0 sau în unitatea greșită lasă o parte a structurii să se miște aproape fără rezistență. EduBeam raportează acest lucru ca *instabil*.

::

## Rezultatele par greșite {#results-look-wrong}

| Simptom | Cauză probabilă |
| --- | --- |
| Încărcările acționează în sus | Axa globală **z este îndreptată în jos**, deci un `Fz` sau `fz` pozitiv acționează în jos; valorile negative sunt îndreptate în sus. Cu axa y în sus este invers. Vezi [Încărcări](/ro/essentials/loads#sign-convention-in-one-line). |
| Săgeata este greșită cu câteva ordine de mărime | O confuzie de unități: `E` introdus în Pa când câmpul așteaptă MPa sau `Iy` în cm⁴ când așteaptă m⁴. Butonul unităților din dreapta jos a zonei de desen arată unitățile folosite de fiecare câmp. |
| Săgeata este puțin mai mare decât după formula din manual | Deformațiile din forfecare ale barei Timoshenko. Vezi [Verificarea rezultatelor prin calcul manual](/ro/guide/verification#shear-deformation). |
| Un semn pare greșit | Citește semnul din valoare, nu din partea pe care este desenată diagrama: un M pozitiv întinde fibra inferioară. Forțele la capete din *Rezultate pe elemente* urmează axele locale ale elementului, nu convenția pentru N, V, M. Vezi [Citirea semnului](/ro/essentials/results#reading-the-sign). |
| O diagramă este pe partea „greșită” | Partea este o setare de afișare: momentul încovoietor pe fibra întinsă sau pe cea comprimată, N și V de oricare parte a liniei punctate. **Setări → Setări de afișare → Diagrame de eforturi**. |
| Doi stâlpi identici au forțe tăietoare de semne opuse | Semnul lui V urmează sensul fiecărui element. Inversează nodurile unuia ca să-i compari. |
| Valori ca `4 · 10¹` | Formatul științific al numerelor. Alege *Automat* în **Setări → Limbă și regiune → Formatul numerelor**. |
| Diagramele sunt uriașe sau minuscule | Doar desenul este afectat. Ajustează **Scara rezultatelor** în **Setări → Setări de afișare**. |
| O încărcare în axe locale este îndreptată greșit | Axa x locală a unui element merge de la nodul lui *inițial* la nodul *final*. Inversează nodurile sau schimbă semnul. |
| O încărcare pe o bară înclinată dă rezultate greșite | **LCS** este bifat implicit, deci `fz` acționează perpendicular pe bară. Debifează-l pentru o încărcare verticală. |
| O variație de temperatură nu are niciun efect | O structură static determinată se deformează liber sub variații de temperatură, fără eforturi. Pentru deformații, verifică dacă α nu este 0 și, pentru o diferență de temperatură, dacă este setată înălțimea secțiunii $h$. |

## Fișiere și linkuri {#files-and-links}

| Simptom | Soluție |
| --- | --- |
| *Fișierul nu a putut fi importat. Verifică formatul fișierului.* | Fișierul nu este nici un proiect EduBeam, nici o sesiune a programului desktop EduBeam. Modelul tău rămâne neschimbat. |
| *Această sesiune EduBeam are mai multe cazuri de încărcare, dar se poate deschide doar unul odată.* | O sesiune a programului desktop EduBeam cu mai multe cazuri de încărcare: EduBeam îl deschide pe primul și le numește pe cele omise. |
| Un link de partajare deschide în schimb modelul tău vechi | Linkul a fost trunchiat sau modificat, de exemplu de un client de e-mail care l-a împărțit pe mai multe rânduri. EduBeam ignoră un link pe care nu-l poate citi și îți păstrează modelul. Copiază din nou linkul întreg. |
| Un link mai scurt nu se deschide la un coleg | Colegul are încă deschisă o versiune EduBeam mai veche decât 1.3.2. Ar trebui să reîncarce aplicația sau poți partaja cu **Link mai scurt** oprit. Vezi [Partajarea unui link](/ro/essentials/import-export#share-a-link). |

## Probleme cu interfața {#interface-issues}

| Simptom | Soluție |
| --- | --- |
| Scurtăturile nu fac nimic | Dă mai întâi clic pe desen: tastele simple sunt ignorate cât timp un câmp de text este activ. Pe Mac, folosește <kbd>Cmd</kbd> în loc de <kbd>Ctrl</kbd>. Vezi [Tastatură, mouse și ecran tactil](/ro/reference/shortcuts). |
| <kbd>Delete</kbd> nu face nimic pe Mac | Tasta marcată *delete* pe o tastatură Mac este Backspace. Apasă <kbd>Fn</kbd>+<kbd>Delete</kbd>. |
| Nu pot deplasa vederea | Deplasarea vederii folosește butonul din mijloc sau din dreapta al mouse-ului; alegi care în **Setări → Comenzi și scurtături**. Pe un touchpad, dă clic și trage cu două degete. Pe un ecran tactil, trage cu un deget. |
| Mi-a dispărut modelul | Deschiderea unui link, a unui fișier sau a unui exemplu, precum și golirea modelului păstrează modelul vechi: **☰ → Structuri recente** sau <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Un link anunță acest lucru în partea de jos a ecranului când se deschide: *S-a deschis o structură partajată. Cea anterioară este păstrată în Structuri recente.*, cu un buton **Arată**. |
| Limba este greșită | **Setări → Limbă și regiune** sau adaugă `?lang=ro` la adresă. |
| Modificările setărilor nu se păstrează | Stocarea locală este blocată, de exemplu într-o fereastră privată sau într-un mod strict de confidențialitate. Setările, modelul salvat și Structurile recente au nevoie de ea. |

## Raportarea unei erori {#reporting-a-bug}

Deschide un [issue pe GitHub](https://github.com/janvorisek/edubeam/issues) cu browserul și sistemul de operare folosite, ce ai făcut și ce te așteptai să se întâmple. Cel mai util este un **link de partajare** sau **fișierul de proiect** care arată problema.
