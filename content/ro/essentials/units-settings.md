---
description: "Setările EduBeam: limba, unități SI sau americane, formatul numerelor, axe cu z în jos sau y în sus, grila, stilul și culorile diagramelor și ce păstrează aplicația în browser."
source: site
---

# Unități și setări

Alegi limba, unitățile și axele cu care lucrezi, precum și aspectul desenului. Setările schimbă doar felul în care modelul este afișat și introdus: modelul însuși este stocat întotdeauna în unități SI, cu axa z orientată în jos, deci un proiect sau un link se deschide la fel indiferent de setări.

Setările se deschid în trei moduri:

- fila **Setări** de deasupra zonei de desen le afișează pe tot spațiul, în locul modelului, la *Limbă și regiune*; fila **Vizualizare** te duce înapoi;
- **butonul unităților** din dreapta jos a zonei de desen (`m m² kN kNm MPa`) le deschide ca fereastră de dialog, la *Limbă și regiune*;
- **Mai multe setări**, sub [opțiunile de afișare](/ro/essentials/user-interface#display-options), deschide fereastra la *Setări de afișare*.

Setările se salvează în browser și se păstrează după reîncărcarea paginii. **Resetează setările**, sub lista de pagini, readuce valorile implicite: formatul numerelor, axele, butonul pentru deplasarea vederii, unitățile regiunii tale și toate setările de afișare și opțiunile de afișare. Limba rămâne aceeași. Resetarea nu poate fi anulată.

## Limbă și regiune {#language-locale}

![Setări → Limbă și regiune](/screenshots/ro/settings-language.webp)

**Limbă.** 22 de limbi; la prima pornire, EduBeam urmează limba browserului. Separatorul zecimal urmează limba. Un link poate alege limba pentru cititor: adaugă `?lang=` cu unul dintre codurile `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (chineză), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`.

**Formatul numerelor.** Cum sunt scrise valorile rezultatelor în tabele și la cursor: *Științific* (1,5 · 10⁴, implicit), *Ingineresc* (15 · 10³) sau *Automat*. Vezi [Formatul numerelor](/ro/essentials/results#number-format).

**Sistem de coordonate.** *x spre dreapta, z în jos* (implicit) sau *x spre dreapta, y în sus*. Cu *x spre dreapta, y în sus*, axa verticală se numește y și este orientată în sus, iar momentele sunt față de z. Coordonatele verticale, forțele, deplasările, reacțiunile și unghiurile reazemelor își schimbă semnul, iar toate câmpurile de introducere, tabelele, valorile la cursor și exporturile folosesc noile denumiri. Modelul, desenul și fișierele salvate rămân exact aceleași. Vezi [Axe cu y în sus](/ro/elements/conventions#y-up-axes).

![Cadrul cu trei articulații cu axe cu y în sus: indicatorul de axe din colț arată y în sus](/screenshots/ro/settings-y-up.webp){.shot-lg}

**Sistem de unități.** *SI (metric)* sau *Unități americane (imperiale)* setează toate unitățile deodată. La prima vizită îl alegi în fereastra de bun venit. EduBeam propune unitățile americane doar dacă browserul are setări regionale americane *și* calculatorul este într-un fus orar din SUA; în rest propune SI. Dacă schimbi apoi o singură unitate, sistemul apare ca *Personalizat*.

### Unități {#units}

Fiecare mărime are propria unitate. Câmpurile de introducere (care o afișează la capătul câmpului), tabelele, valorile la cursor și etichetele diagramelor o folosesc toate, iar schimbarea unei unități convertește ce se afișează. În model nu se schimbă nimic, așa că poți comuta înainte și înapoi fără să pierzi ceva.

| Mărime | Opțiuni | SI | Unități americane |
| --- | --- | --- | --- |
| Lungime (geometrie, poziția încărcărilor) | m, cm, mm, ft, in | m | ft |
| Dimensiunile secțiunii | m, cm, mm, ft, in | m | in |
| Deplasare (rezultate, cedări de reazem impuse) | m, cm, mm, ft, in | m | in |
| Arie | m², cm², mm², ft², in² | m² | in² |
| Moment de inerție | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Masă | kg, lb | kg | lb |
| Forță | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Moment încovoietor | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Presiune (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Temperatură | °C, °F | °C | °F |

Câteva unități rezultă din celelalte:

- **Încărcările distribuite** sunt forță pe lungime: kN/m în SI, kip/ft în unități americane.
- **Densitatea** este masă pe lungime³: kg/m³ sau lb/ft³.
- **Coeficientul de dilatare termică** urmează temperatura: 1/K sau 1/°F. Variațiile de temperatură sunt *diferențe* de temperatură, deci 10 °C înseamnă 18 °F.
- **Rotirile** sunt întotdeauna în radiani, iar unghiurile reazemelor în grade.

Tonf este tona-forță metrică (1000 kgf), nu „short ton” americană. Unitățile americane folosesc definițiile lor exacte: 1 ft = 0,3048 m, 1 kip = 4448,2216 N. Introdu picioarele ca număr zecimal, de exemplu `5.5`; riglele și reticulul afișează picioare și inci (5′-6″).

## Setări de afișare {#viewer-settings}

Cum arată desenul. **Previzualizarea** din dreapta este o mică grindă înclinată care arată imediat orice modificare; butoanele de sub ea aleg ce rezultat afișează, iar modificarea unei setări de diagramă sau a unei culori o comută pe rezultatul respectiv.

![Setări → Setări de afișare, cu previzualizarea și setările diagramelor în dreapta](/screenshots/ro/b-settings-viewer.webp)

Coloana din stânga, de sus în jos:

- *Grilă*: **Afișează grila** (<kbd>G</kbd>) desenează grila și riglele; **Aliniere la grilă** (<kbd>S</kbd>) aduce pe grilă nodurile pe care le plasezi sau le tragi; **Afișează reticulul** marchează pe rigle poziția cursorului, când lucrezi cu mouse-ul. Toate trei sunt pornite la început. **Pasul de aliniere la grilă** este 0,1 m sau 0,5 ft în unități americane. Când treci între unitățile metrice și cele americane, un pas rămas la valoarea implicită trece la valoarea implicită a celuilalt sistem; un pas stabilit de tine se păstrează.
- *Dimensiuni*: **Scara rezultatelor**, de la 8 la 120 px (48 px la început), este înălțimea cu care se desenează cea mai mare ordonată a unei diagrame sau cea mai mare săgeată; are rol pur vizual, pentru că fiecare diagramă este scalată după propria valoare maximă. **Mărimea reazemelor** merge de la 50 la 150 % (100 %), iar **Mărimea fontului** de la 10 la 20 px (14 px); valorile mai mari ajută la proiector.
- *Orientarea valorilor*: valorile scrise în lungul ordonatei, *Perpendicular pe diagramă* (implicit), sau *Întotdeauna orizontal*.
- *Verificări ale modelului*: **Arată cum se poate mișca o structură instabilă** desenează un contur punctat al mecanismului, iar **Animează mișcarea** îl mișcă înainte și înapoi. Ambele sunt pornite la început.

### Diagrame de eforturi {#internal-force-diagrams}

Școlile desenează diagramele diferit, așa că EduBeam te lasă să alegi. Aceste setări schimbă doar desenul, niciodată valorile. **Linia punctată** de-a lungul fiecărui element marchează fibra inferioară, partea spre care este orientată axa locală z (vezi [Orientarea elementului](/ro/essentials/elements#element-direction)).

| Setare | Opțiuni | Implicit |
| --- | --- | --- |
| **Moment încovoietor** | desenat *Pe fibra întinsă* sau *Pe fibra comprimată* | *Pe fibra întinsă* |
| **Forță tăietoare pozitivă** | desenată *Pe partea opusă* liniei punctate sau *Pe partea punctată* | *Pe partea opusă* |
| **Forță axială pozitivă** | *Pe partea opusă* sau *Pe partea punctată* | *Pe partea opusă* |
| **Umplere** | *Plină*, *Hașurată* (linii transversale pe bară, ca la desenul de mână) sau *Fără* | *Plină* |
| **Gradul fiecărui segment** | scrie gradul polinomului, de la 0° la 3°, pe fiecare segment al diagramei | oprit |

[Rezultate și diagrame de eforturi](/ro/essentials/results#reading-the-sign) explică cum se citesc semnele.

### Culori {#colors}

Culori separate pentru noduri, elemente, încărcări, deformată, forța axială, forța tăietoare, momentul încovoietor și reacțiuni. Dă clic pe un eșantion de culoare ca s-o alegi. Valorile implicite: încărcări portocaliu, deformata gri, N albastru, V verde, M roșu, reacțiuni violet, noduri și elemente negru.

## Comenzi și scurtături {#controls-shortcuts}

**Deplasarea vederii cu** stabilește ce buton al mouse-ului deplasează desenul: *Rotița sau butonul din dreapta* (implicit), *Rotița mouse-ului* (apeși rotița și tragi) sau *Butonul din dreapta*. Toate scurtăturile se află pe pagina [Tastatură, mouse și ecran tactil](/ro/reference/shortcuts).

## Ce se păstrează în browser {#what-is-stored-in-your-browser}

Pe lângă setări, EduBeam păstrează în spațiul de stocare local al browserului:

- **modelul curent**, salvat după fiecare modificare, astfel încât la reîncărcarea filei sau la redeschiderea aplicației îl regăsești;
- **Structuri recente**: ultimele 10 modele pe care le-ai golit sau înlocuit, gata de restaurat din meniul ☰.

Ambele țin de acest browser pe acest dispozitiv, iar ștergerea datelor site-ului le elimină. Ca să păstrezi un model sau să-l muți pe alt dispozitiv, folosește [Salvează proiectul sau Partajează modelul](/ro/essentials/import-export).
