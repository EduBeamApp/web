---
description: "Ce este EduBeam: un program gratuit de calcul cu elemente finite pentru grinzi, cadre și grinzi cu zăbrele plane, în browser. Ce poate și ce nu poate face, cui se adresează și cum este organizat ghidul."
source: site
---

# Introducere

[EduBeam]{.edubeam} este o aplicație gratuită de calcul structural pentru **grinzi, cadre și grinzi cu zăbrele**, care rulează în browser. Desenezi structura, o rezemi și o încarci, iar programul de calcul cu elemente finite recalculează diagramele, reacțiunile și săgețile la fiecare modificare. Nu există un buton *Calculează*, nu trebuie instalat nimic și nu ai nevoie de cont.

::div{.actions}
[Pornește EduBeam ↗](https://run.edubeam.app/?lang=ro){target="_blank"} [Ghid de început, 10 minute](/ro/guide/quick-start)
::

![Un cadru cu trei articulații în EduBeam: încărcările cu portocaliu, reacțiunile cu violet, momentul încovoietor cu roșu și deformata cu gri](/screenshots/ro/hero.webp)

:span{#your-first-visit}

## Ce poate face {#what-it-does}

::card-grid{cols="2"}
:::card{title="Structuri" icon="lucide:triangle" to="/ro/essentials/elements"}
Grinzi, grinzi continue, cadre și grinzi cu zăbrele în planul x–z, alcătuite din elemente de bară Timoshenko. Articulațiile la capete transformă o bară într-o bară de grindă cu zăbrele.
:::
:::card{title="Reazeme" icon="lucide:anchor" to="/ro/essentials/nodes-supports#supports"}
Alegi reazemul după simbol: articulație, reazem simplu, încastrare, încastrare glisantă sau orice combinație de `Dx`, `Dz` și `Ry` blocate. În plus, reazeme înclinate și cedări de reazem.
:::
:::card{title="Încărcări" icon="lucide:arrow-down-to-line" to="/ro/essentials/loads"}
Forțe și momente în noduri sau oriunde pe o bară, încărcări uniform distribuite și trapezoidale, variații de temperatură și deplasări impuse.
:::
:::card{title="Secțiuni" icon="lucide:shapes" to="/ro/essentials/elements#cross-sections"}
Biblioteci europene și americane sau orice poligon pe care îl desenezi. Aplicația calculează $A$, $I_y$, $I_z$, $I_{yz}$, axele principale și razele de girație.
:::
:::card{title="Rezultate" icon="lucide:chart-spline" to="/ro/essentials/results"}
Diagramele **N**, **V** și **M**, deformata, reacțiunile, deplasările nodurilor, forțele la capete și matricele de rigiditate ale elementelor.
:::
:::card{title="Calcul" icon="lucide:calculator" to="/ro/elements/analysis"}
Calcul static liniar, exact pentru modelul liniar: nu există o rețea de discretizare de îndesit. Când structura nu poate sta în echilibru, EduBeam explică de ce și îi animă mișcarea.
:::
:::card{title="Fișiere" icon="lucide:folder-open" to="/ro/essentials/import-export"}
Proiecte ca JSON, modele întregi ca linkuri, desene ca PNG sau SVG, rezultate ca CSV. Modelele înlocuite se păstrează și nimic nu părăsește dispozitivul tău.
:::
:::card{title="Unități" icon="lucide:ruler" to="/ro/essentials/units-settings"}
SI sau unități americane dintr-un clic, ori separat pentru fiecare mărime. Axa z în jos sau, ca în manuale, axa y în sus.
:::
::

## Ce nu poate face (încă) {#what-it-does-not-do-yet}

Dacă știi limitele de la început, economisești timp:

::div{.limits}
- **Doar 2D.** Nimic în afara planului structurii; nu poți modela cadre spațiale.
- **Doar calcul static liniar.** Fără efecte de ordinul II (P–Δ), flambaj, dinamică sau plasticitate.
- **Un singur caz de încărcare.** Fără combinații sau înfășurători: salvează fiecare caz ca fișier sau link separat.
- **Fără greutate proprie.** Aplic-o ca încărcare distribuită.
- **Fără verificări de dimensionare.** EduBeam dă eforturile și deplasările; verificările după normă rămân în sarcina ta.
::

Dacă îți lipsește o funcție, [deschide un issue pe GitHub](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## Cui se adresează EduBeam? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Studenți" icon="lucide:graduation-cap" to="/ro/practice"}
Verificare imediată a calculelor manuale și probleme de exersat care îți verifică răspunsurile pe loc.
:::
:::card{title="Cadre didactice" icon="lucide:presentation" to="/ro/guide/teaching"}
Arată live, pe proiector, cum se schimbă eforturile cu reazemele, articulațiile și încărcările, în 22 de limbi, și tipărește câte o lucrare diferită pentru fiecare student.
:::
:::card{title="Ingineri" icon="lucide:hard-hat" to="/ro/elements/analysis"}
O verificare rapidă înainte să deschizi un program desktop mai complex, cu fiecare pas al soluției documentat.
:::
:::card{title="Programatori" icon="lucide:code-xml" to="#libraries"}
Programul de calcul și desenele din spatele EduBeam, ca biblioteci open source pentru propriul tău cod.
:::
::

## Cum te orientezi în ghid {#how-this-guide-is-organised}

Bara laterală grupează paginile ca mai jos. Butoanele **?** din aplicație deschid pagina corespunzătoare de aici, în limba ta.

::card-grid{cols="2"}
:::card{title="Primii pași" icon="lucide:flag" to="/ro/guide/quick-start"}
Această pagină și Ghidul de început: prima grindă în zece minute.
:::
:::card{title="Modelare" icon="lucide:pencil-ruler" to="/ro/essentials/user-interface"}
Interfața, nodurile și reazemele, elementele, materialele și secțiunile, încărcările, unitățile și setările.
:::
:::card{title="Rezultate" icon="lucide:chart-spline" to="/ro/essentials/results"}
Diagramele și tabelele de rezultate și cum le verifici prin calcul manual.
:::
:::card{title="Partajare și predare" icon="lucide:share-2" to="/ro/essentials/import-export"}
Fișiere de proiect, linkuri de partajare, export de imagini și CSV și predarea cu EduBeam.
:::
:::card{title="Tutoriale" icon="lucide:triangle" to="/ro/tutorials/inclined-beam"}
O grindă înclinată, un cadru cu trei articulații, o grindă cu zăbrele plană și o grindă continuă cu cedare de reazem, fiecare construită pas cu pas și verificată prin calcul manual.
:::
:::card{title="Exemple" icon="lucide:library" to="/ro/examples/"}
Șase modele gata făcute, care se deschid dintr-un clic, cu exerciții și răspunsuri.
:::
:::card{title="Teorie" icon="lucide:sigma" to="/ro/elements/conventions"}
Axe și convenții de semne, elementul de bară și elementul de bară articulată și cum calculează EduBeam un model.
:::
:::card{title="Ajutor" icon="lucide:life-buoy" to="/ro/reference/shortcuts"}
Tastatură, mouse și ecran tactil, depanare și întrebări frecvente.
:::
::

## Construiește-ți propriile instrumente {#libraries}

EduBeam se bazează pe două biblioteci open source, documentate pe acest site. Cu ele poți calcula structuri dintr-un script, poți genera câte o problemă diferită pentru fiecare student sau poți desena figuri pentru slide-uri și note de curs.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/ro/solver"}
Programul de calcul cu elemente finite din spatele EduBeam, scris în TypeScript: modelezi, calculezi și citești rezultatele unei grinzi în câteva rânduri de cod, în browser sau în Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/ro/plot"}
Componente Vue 3 care desenează o structură calculată ca SVG, cu încărcările, reacțiunile și diagramele N, V și M.
:::
::

## Limbi {#languages}

EduBeam vorbește 22 de limbi și pornește în limba browserului tău. O poți schimba din **Setări → Limbă și regiune** sau poți alege una de aici:

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-hu"} Magyar](https://run.edubeam.app/?lang=hu){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-ro"} Română](https://run.edubeam.app/?lang=ro){target="_blank"}
- [:icon{name="circle-flags:lang-sk"} Slovenčina](https://run.edubeam.app/?lang=sk){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-el"} Ελληνικά](https://run.edubeam.app/?lang=el){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

Limba poate fi aleasă și prin link, în locul cititorului: `run.edubeam.app/?lang=ro` deschide aplicația în română.

## Autori și mulțumiri {#authors-credits}

[EduBeam]{.edubeam} este dezvoltat de [Jan Voříšek](https://github.com/janvorisek) ca proiect independent. Continuă programul desktop EduBeam pentru Windows și Linux, creat de [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) și [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) la Departamentul de Mecanică al [Facultății de Construcții a Universității Tehnice Cehe din Praga (ČVUT)](https://www.fsv.cvut.cz/en) și deschide în continuare fișierele de sesiune ale acestuia. Programul său de calcul, [@edubeam/fem](/ro/solver), a pornit de la prima versiune scrisă de Bořek Patzák. Atât aplicația, cât și programul de calcul sunt open source, sub licența GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Dezvoltator principal și designer de produs","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Dezvoltator: control tactil, performanța desenării, încărcări și reazeme","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"EduBeam original și primul program de calcul MEF","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Contribuie {#contribute}

::card-grid{cols="3"}
:::card{title="Raportează o problemă" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Ceva neclar, greșit sau care nu funcționează? Un issue pe GitHub ajunge direct la echipă.
:::
:::card{title="Îmbunătățește o traducere" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Textele aplicației se află într-un fișier separat pentru fiecare limbă; un pull request este binevenit.
:::
:::card{title="Recomandă mai departe" icon="lucide:share-2"}
Arată EduBeam colegilor de facultate și de serviciu sau pune un link către un model în notele tale de curs.
:::
::
