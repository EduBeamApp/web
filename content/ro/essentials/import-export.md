---
description: "Salvarea și deschiderea proiectelor EduBeam și a sesiunilor din versiunea desktop, partajarea modelului printr-un link, încorporarea unei vizualizări interactive, export de imagini și tabele de rezultate, totul în browser."
source: site
---

# Fișiere, linkuri și export

:span{#import-export-sharing}

Poți salva modelul ca fișier, îl poți trimite ca link, îl poți încorpora într-o pagină web sau poți exporta o imagine ori un tabel al lui. Totul în [EduBeam]{.edubeam} se petrece în browserul tău și nimic nu se încarcă pe un server: un link de partajare conține, la propriu, modelul.

::card-grid{cols="3"}
:::card{title="Fișier de proiect" icon="lucide:file-json" to="#save-a-project"}
`project.json`, de păstrat, de predat sau de deschis mai târziu.
:::
:::card{title="Link de partajare" icon="lucide:link" to="#share-a-link"}
Tot modelul într-o singură adresă URL, pentru note de curs, prezentări și mesaje.
:::
:::card{title="Imagine sau tabel" icon="lucide:image" to="#export-an-image"}
PNG sau SVG pentru rapoarte, CSV pentru foi de calcul.
:::
::

## Salvarea unui proiect {#save-a-project}

**☰ → Salvează proiectul** sau <kbd>Ctrl</kbd>+<kbd>S</kbd> (<kbd>⌘</kbd>+<kbd>S</kbd> pe Mac, ca la toate scurtăturile de pe această pagină) descarcă fișierul `project.json`. El conține nodurile, elementele, materialele, secțiunile transversale (cu formele desenate), încărcările, cotele și versiunea aplicației care l-a scris. Poți redenumi fișierul cum vrei.

## Deschiderea unui proiect {#open-a-project}

**☰ → Deschide un proiect** sau <kbd>Ctrl</kbd>+<kbd>O</kbd>, apoi alege fișierul, ori **trage fișierul oriunde în fereastra aplicației**. EduBeam deschide:

- fișiere `project.json` salvate de orice versiune a EduBeam;
- sesiuni `.xml` salvate de **EduBeam pentru desktop**, versiunile 2.x până la 3.5. Valorile lor nu au unități, așa că sunt citite în kN, kPa și m, unitățile folosite în manualul programului. EduBeam deschide câte un singur caz de încărcare: dintr-o sesiune cu mai multe îl deschide pe primul și îți spune care au fost lăsate deoparte.

Deschiderea înlocuiește modelul curent, inclusiv materialele și secțiunile lui. Modelul pe care îl aveai nu se pierde: <kbd>Ctrl</kbd>+<kbd>Z</kbd> îl readuce, iar el se păstrează în [Structuri recente](#recent-structures). Un fișier pe care EduBeam nu îl poate citi este respins cu un mesaj, iar modelul tău rămâne cum era.

## Partajarea unui link {#share-a-link}

**Partajează modelul**, din bara aplicației sau din meniul ☰, deschide fereastra *Partajează modelul printr-un link*:

![Fereastra Partajează modelul printr-un link](/screenshots/ro/c1-share.webp){.shot-lg}

- **Copiază linkul** sau un clic oriunde în câmp copiază linkul.
- **Deschide linkul** îl deschide într-o filă nouă, ca să vezi ce va vedea destinatarul.
- **Partajează prin dialogul sistemului** trimite linkul la meniul de partajare al dispozitivului, dacă browserul permite acest lucru.
- **Link mai scurt** (pornit implicit) scrie același model cu aproximativ jumătate din caractere. Copiile EduBeam mai vechi decât versiunea 1.3.2 (noiembrie 2026) nu îl pot citi până nu sunt actualizate, așa că oprește opțiunea când un link trebuie să se deschidă peste tot imediat.
- **Arată ce văd eu** (oprit implicit) face ca linkul să se deschidă cu diagramele, încărcările și etichetele pe care le ai tu pornite, nu cu opțiunile de afișare ale destinatarului.

Linkul are forma `https://run.edubeam.app/?model=…` și codifică întregul model. Oricine îl deschide primește propria copie, pe care o poate edita; modificările **nu** se sincronizează înapoi, așa că trimite un link nou când se schimbă modelul. Modelele foarte mari dau linkuri foarte lungi; în acest caz, trimite fișierul de proiect.

Când cineva deschide un link, modelul lui anterior trece în Structuri recente, iar un mesaj îi spune unde îl găsește. Linkurile nu expiră niciodată: un link din notele de curs de anul trecut deschide și azi același model.

## Încorporarea unei vizualizări {#embed-a-read-only-viewer}

Adaugă `&viewer=1` la un link de partajare ca să deschizi modelul în **modul vizualizare**: bara aplicației, bara de jos, anularea și refacerea, butoanele pentru grilă și unități și reticulul sunt ascunse; rămân desenul, butoanele de încadrare și centrare și opțiunile de afișare. Nici fereastra de bun venit și nici notele de versiune nu se deschid. Pune adresa URL într-un `<iframe>` ca să încorporezi un model interactiv, care se poate mări, în note de curs, pe pagina unui curs sau într-o prezentare:

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![Cadrul cu trei articulații în modul vizualizare](/screenshots/ro/viewer-mode.webp){.shot-lg}

Modul vizualizare este gândit pentru privit, dar nu este blocat: vizitatorii pot încă trage nodurile și comuta diagramele. Deschis singur, un link de vizualizare înlocuiește modelul vizitatorului ca orice link, iar modelul lui așteaptă în Structuri recente. Încorporat într-o pagină de pe alt site, majoritatea browserelor actuale dau cadrului propriul spațiu de stocare, care lasă neatins modelul vizitatorului, dar nu toate browserele fac asta.

Pentru o figură care nu are deloc nevoie de aplicație, de exemplu o diagramă statică pe o pagină, într-o prezentare sau pe o fișă de exerciții, [@edubeam/plot](/ro/plot) desenează structuri și diagramele lor din cod. Figurile interactive de pe acest site sunt desenate cu el.

## Parametri URL {#url-parameters}

| Parametru | Efect |
| --- | --- |
| `model=<data>` | Încarcă modelul codificat și îl încadrează în ecran. Scris de **Partajează modelul**. |
| `viewer=1` | [Modul vizualizare](#embed-a-read-only-viewer). |
| `show=<letters>` | Deschide modelul exact cu aceste straturi pornite, câte o literă pentru fiecare: `N` forța axială, `V` forța tăietoare, `M` momentul încovoietor, `U` deformata, `R` reacțiunile, `L` încărcările, `S` reazemele, `n` etichetele nodurilor, `e` etichetele elementelor. `show=MRLS` arată momentul încovoietor, reacțiunile, încărcările și reazemele. Scris de **Arată ce văd eu**. |
| `lang=<code>` | Schimbă limba interfeței: `en`, `cs`, `sk`, `de`, `fr`, `es`, `pt`, `pl`, `hu`, `ro`, `el`, `cn` (chineză), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Deschide imediat galeria de exemple. |

Parametrii se combină cu `&`, ca în `?lang=ro&viewer=1&model=…`. EduBeam îi elimină din bara de adrese după ce i-a citit. `lang` și `show` se păstrează ca setări ale vizitatorului, ca și cum le-ar fi ales el în aplicație.

## Exportul unei imagini {#export-an-image}

**☰ → Exportă imaginea** sau <kbd>Ctrl</kbd>+<kbd>P</kbd> deschide exportul de imagini. Desenul este refăcut pentru dimensiunea aleasă, astfel încât liniile și etichetele își păstrează grosimea reală.

![Exportă imaginea: alege straturile, încadrarea și dimensiunea, apoi descarcă sau copiază](/screenshots/ro/export-image.webp)

::div{.steps}

### Alege straturile {#choose-the-layers}

Butoanele de sus aleg ce se desenează: deformata, N, V, M și reacțiunile, apoi reazemele, încărcările, etichetele nodurilor și etichetele elementelor. La început corespund opțiunilor de afișare din zona de desen, iar dacă le schimbi aici, zona de desen rămâne cum era.

### Încadrează desenul {#frame-the-drawing}

Alege un raport de aspect (16:9, 4:3, 3:2 sau 1:1), **Tot modelul** sau **Fereastră…**, ca să tragi un dreptunghi peste desen. Poți trage și de marginile previzualizării.

### Stabilește dimensiunea {#set-the-size}

Lățimea și înălțimea în pixeli sau o **Scară**, de exemplu 1 : 50, pentru un desen la scară pe hârtie (la 96 DPI). **Înălțimea diagramelor** stabilește mărimea diagramelor de rezultate, iar **Fundal transparent** renunță la fondul alb. Dacă diagramele sau etichetele nu încap, fereastra îți spune și îți propune să micșorezi diagramele sau să mărești planșa.

### Salvează {#save-it}

**Descarcă PNG**, **Descarcă SVG** sau, dacă browserul permite, **Copiază în clipboard**. Fișierele primesc numele după dimensiune, de exemplu `edubeam-512x512.svg`. Pe un ecran de înaltă rezoluție, fișierul PNG are mai mulți pixeli decât lățimea și înălțimea stabilite, proporțional cu densitatea de pixeli a ecranului, ca să fie la fel de clar ca în aplicație; dimensiunea lui în pixeli este afișată lângă butoane.

::

SVG rămâne clar la orice mărime și funcționează în Word, Inkscape și LaTeX pe Overleaf, de aceea este cea mai bună alegere pentru rapoarte și lucrări de licență. Aceeași dimensiune încadrează structura mereu la fel, așa că N, V și M exportate pe rând se aliniază una lângă alta.

Ca să generezi astfel de figuri din cod, de exemplu câte una pentru fiecare exercițiu de pe o fișă, @edubeam/plot scrie [un fișier SVG de sine stătător](/ro/plot/functions#a-standalone-svg-file), care se deschide în aceleași programe.

## Exportul rezultatelor {#export-the-results}

**Exportă CSV** din fila **Rezultate** descarcă ambele tabele de rezultate, inclusiv reacțiunile, iar **Copiază** le pune în clipboard pentru o foaie de calcul. Vezi [Exportă CSV și Copiază](/ro/essentials/results#export-csv-and-copy).

## Structuri recente {#recent-structures}

**☰ → Structuri recente** păstrează ultimele 10 structuri care au fost golite sau înlocuite de un link, un fișier, un exemplu, exercițiul cu prima grindă sau o altă restaurare. Fiecare intrare arată o miniatură, ce a înlocuit structura și numărul de noduri și elemente. **Restaurează** o readuce: modelul pe care îl aveai atunci intră la rândul lui în listă, iar <kbd>Ctrl</kbd>+<kbd>Z</kbd> anulează restaurarea. **Elimină** șterge o intrare.

![Structuri recente](/screenshots/ro/recent.webp){.shot-lg}

Lista este stocată doar în acest browser.

## Exemple {#examples}

**☰ → Exemple** deschide o galerie de modele gata făcute pentru predare. Deschiderea unuia înlocuiește modelul tău, iar <kbd>Ctrl</kbd>+<kbd>Z</kbd> îl readuce. Aceleași modele, împreună cu exerciții, se găsesc pe pagina [Exemple](/ro/examples/) a acestui ghid.

![Galeria de exemple](/screenshots/ro/examples.webp){.shot-lg}

## Salvarea automată {#automatic-persistence}

Modelul și setările tale se salvează în spațiul de stocare local al browserului după fiecare modificare și sunt restaurate când revii, chiar și după ce ai închis browserul. Este o comoditate, nu o copie de siguranță: ține de un singur profil de browser pe un singur dispozitiv, o fereastră privată o uită, iar ștergerea datelor site-ului o elimină. Salvează lucrul important ca fișier de proiect. [Ce se păstrează în browser](/ro/essentials/units-settings#what-is-stored-in-your-browser) enumeră tot.

## Formatul fișierului de proiect {#project-file-format}

`project.json` este un fișier JSON simplu și lizibil. Iată grinda din [Ghidul de început](/ro/guide/quick-start), cu oțelul și profilul IPE 200 din bibliotecă:

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

Toate valorile sunt în **unități SI** (m, N, Pa, rad), indiferent de unitățile afișate în aplicație. Coordonatele sunt `[x, y, z]`, cu $y = 0$ și axa $z$ orientată în jos. Reazemele și componentele încărcărilor folosesc identificatorii gradelor de libertate `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` al încărcării pe element | Valori |
| --- | --- |
| `udl` | `values: [fx, fz]` în N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` în N/m |
| `concentrated` | `values: [Fx, Fz, My, a]` în N, N·m și m de la nodul inițial |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` în K; diferența de temperatură este ΔTb − ΔTt |

`lcs: true`, sau lipsa lui `lcs`, pune o încărcare pe element în axele locale ale elementului; `false`, în cele globale. Celelalte intrări:

- **Încărcări nodale**: `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, plus `"lcs": true` pentru o încărcare în axele unui reazem rotit.
- **Deplasări impuse**: `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; o componentă omisă este 0.
- Fișierele scrise de aplicație conțin și o dată (`date`), un `commit`, axele reazemelor rotite (`lcs` la un nod) și formele desenate ale secțiunilor (`shape`).

Pentru că formatul este simplu, poți scrie modele cu un script sau dintr-o foaie de calcul și le poți deschide cu **Deschide un proiect**. Ca să construiești și să calculezi modele numai din cod, folosește programul de calcul din spatele aplicației, [@edubeam/fem](/ro/solver).
