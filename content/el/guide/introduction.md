---
description: "Τι είναι το EduBeam: δωρεάν πρόγραμμα πεπερασμένων στοιχείων στο πρόγραμμα περιήγησης για επίπεδες δοκούς, πλαίσια και δικτυώματα. Τι μπορεί και τι δεν μπορεί να κάνει, σε ποιους απευθύνεται και πώς είναι οργανωμένος ο οδηγός."
source: site
---

# Εισαγωγή

Το [EduBeam]{.edubeam} είναι δωρεάν εφαρμογή στατικής ανάλυσης για **δοκούς, πλαίσια και δικτυώματα**, που λειτουργεί στο πρόγραμμα περιήγησης. Σχεδιάζετε έναν φορέα, τον στηρίζετε και τον φορτίζετε, και ο επιλυτής πεπερασμένων στοιχείων υπολογίζει ξανά τα διαγράμματα, τις αντιδράσεις και τα βέλη κάμψης με κάθε αλλαγή. Δεν υπάρχει κουμπί *Επίλυση*, δεν χρειάζεται εγκατάσταση ούτε λογαριασμός.

::div{.actions}
[Άνοιγμα του EduBeam ↗](https://run.edubeam.app/?lang=el){target="_blank"} [Γρήγορη εκκίνηση σε 10 λεπτά](/el/guide/quick-start)
::

![Τριαρθρωτό πλαίσιο στο EduBeam: τα φορτία με πορτοκαλί, οι αντιδράσεις με μωβ, η καμπτική ροπή με κόκκινο και ο παραμορφωμένος φορέας με γκρι](/screenshots/el/hero.webp)

:span{#your-first-visit}

## Τι κάνει {#what-it-does}

::card-grid{cols="2"}
:::card{title="Φορείς" icon="lucide:triangle" to="/el/essentials/elements"}
Δοκοί, συνεχείς δοκοί, πλαίσια και δικτυώματα στο επίπεδο x–z, από στοιχεία δοκού Timoshenko. Με ακραίες αρθρώσεις ένα μέλος γίνεται ράβδος δικτυώματος.
:::
:::card{title="Στηρίξεις" icon="lucide:anchor" to="/el/essentials/nodes-supports#supports"}
Η στήριξη επιλέγεται από το σύμβολό της: άρθρωση, κύλιση, πάκτωση, ολισθαίνουσα πάκτωση ή οποιοσδήποτε συνδυασμός δεσμευμένων `Dx`, `Dz` και `Ry`. Επίσης κεκλιμένες στηρίξεις και υποχωρήσεις στηρίξεων.
:::
:::card{title="Φορτία" icon="lucide:arrow-down-to-line" to="/el/essentials/loads"}
Δυνάμεις και ροπές στους κόμβους ή σε οποιοδήποτε σημείο ενός μέλους, ομοιόμορφα και τραπεζοειδή γραμμικά φορτία, θερμοκρασιακή φόρτιση και επιβαλλόμενες μετακινήσεις.
:::
:::card{title="Διατομές" icon="lucide:shapes" to="/el/essentials/elements#cross-sections"}
Ευρωπαϊκές και αμερικανικές βιβλιοθήκες ή οποιοδήποτε πολύγωνο σχεδιάσετε. Η εφαρμογή υπολογίζει τα $A$, $I_y$, $I_z$, $I_{yz}$, τους κύριους άξονες και τις ακτίνες αδράνειας.
:::
:::card{title="Αποτελέσματα" icon="lucide:chart-spline" to="/el/essentials/results"}
Διαγράμματα **N**, **V** και **M**, παραμορφωμένος φορέας, αντιδράσεις, μετακινήσεις κόμβων, δυνάμεις άκρων και μητρώα στιβαρότητας στοιχείων.
:::
:::card{title="Ανάλυση" icon="lucide:calculator" to="/el/elements/analysis"}
Γραμμική στατική ανάλυση, ακριβής για το γραμμικό μοντέλο: δεν υπάρχει πλέγμα για πύκνωση. Όταν ένας φορέας είναι μηχανισμός, το EduBeam εξηγεί γιατί και δείχνει την κίνησή του.
:::
:::card{title="Αρχεία" icon="lucide:folder-open" to="/el/essentials/import-export"}
Έργα ως JSON, ολόκληρα μοντέλα ως σύνδεσμοι, σχέδια ως PNG ή SVG, αποτελέσματα ως CSV. Τα μοντέλα που αντικαθίστανται δεν χάνονται, και τίποτα δεν φεύγει από τη συσκευή σας.
:::
:::card{title="Μονάδες" icon="lucide:ruler" to="/el/essentials/units-settings"}
SI ή αμερικανικές μονάδες με ένα κλικ, ή χωριστά για κάθε μέγεθος. Άξονας z προς τα κάτω ή, όπως στα βιβλία, άξονας y προς τα πάνω.
:::
::

## Τι δεν κάνει (ακόμη) {#what-it-does-not-do-yet}

Αν γνωρίζετε τους περιορισμούς από την αρχή, κερδίζετε χρόνο:

::div{.limits}
- **Μόνο 2D.** Καμία συμπεριφορά εκτός επιπέδου, κανένα χωρικό πλαίσιο.
- **Μόνο γραμμική στατική ανάλυση.** Χωρίς φαινόμενα δεύτερης τάξης (P–Δ), λυγισμό, δυναμική ανάλυση ή πλαστικότητα.
- **Μία περίπτωση φόρτισης.** Χωρίς συνδυασμούς ή περιβάλλουσες: αποθηκεύστε κάθε περίπτωση ως χωριστό αρχείο ή σύνδεσμο.
- **Χωρίς ίδιο βάρος.** Εισάγετέ το ως γραμμικό φορτίο.
- **Χωρίς ελέγχους διαστασιολόγησης.** Το EduBeam δίνει εντατικά μεγέθη και μετακινήσεις· οι έλεγχοι κατά τους κανονισμούς είναι δική σας δουλειά.
::

Αν σας λείπει κάποια λειτουργία, [ανοίξτε ένα issue στο GitHub](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## Σε ποιους απευθύνεται; {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Φοιτητές" icon="lucide:graduation-cap" to="/el/practice"}
Άμεσος έλεγχος των υπολογισμών που κάνετε με το χέρι και ασκήσεις που ελέγχουν τις απαντήσεις σας καθώς προχωράτε.
:::
:::card{title="Διδάσκοντες" icon="lucide:presentation" to="/el/guide/teaching"}
Δείξτε ζωντανά στον προβολέα πώς οι στηρίξεις, οι αρθρώσεις και τα φορτία αλλάζουν τα εντατικά μεγέθη, σε 22 γλώσσες, και τυπώστε διαφορετικό διαγώνισμα για κάθε φοιτητή.
:::
:::card{title="Μηχανικοί" icon="lucide:hard-hat" to="/el/elements/analysis"}
Ένας γρήγορος έλεγχος πριν ανοίξετε ένα βαρύτερο πρόγραμμα, με κάθε βήμα της επίλυσης τεκμηριωμένο.
:::
:::card{title="Προγραμματιστές" icon="lucide:code-xml" to="#libraries"}
Ο επιλυτής και η σχεδίαση πίσω από το EduBeam, ως βιβλιοθήκες ανοιχτού κώδικα για τον δικό σας κώδικα.
:::
::

## Πώς είναι οργανωμένος ο οδηγός {#how-this-guide-is-organised}

Η πλαϊνή στήλη ομαδοποιεί τις σελίδες όπως παρακάτω. Τα κουμπιά **?** στην εφαρμογή ανοίγουν την αντίστοιχη σελίδα εδώ, στη γλώσσα σας.

::card-grid{cols="2"}
:::card{title="Ξεκινώντας" icon="lucide:flag" to="/el/guide/quick-start"}
Αυτή η σελίδα και η Γρήγορη εκκίνηση: μια πρώτη δοκός σε δέκα λεπτά.
:::
:::card{title="Μοντελοποίηση" icon="lucide:pencil-ruler" to="/el/essentials/user-interface"}
Το περιβάλλον εργασίας, κόμβοι και στηρίξεις, στοιχεία, υλικά και διατομές, φορτία, μονάδες και ρυθμίσεις.
:::
:::card{title="Αποτελέσματα" icon="lucide:chart-spline" to="/el/essentials/results"}
Τα διαγράμματα και οι πίνακες αποτελεσμάτων, και πώς να τα ελέγξετε με το χέρι.
:::
:::card{title="Κοινή χρήση και διδασκαλία" icon="lucide:share-2" to="/el/essentials/import-export"}
Αρχεία έργου, σύνδεσμοι κοινής χρήσης, εξαγωγή εικόνας και CSV, και διδασκαλία με το EduBeam.
:::
:::card{title="Βήμα προς βήμα" icon="lucide:triangle" to="/el/tutorials/inclined-beam"}
Μια κεκλιμένη δοκός, ένα τριαρθρωτό πλαίσιο, ένα επίπεδο δικτύωμα και μια συνεχής δοκός με υποχώρηση στήριξης, το καθένα βήμα προς βήμα και με έλεγχο με το χέρι.
:::
:::card{title="Παραδείγματα" icon="lucide:library" to="/el/examples/"}
Έξι έτοιμα μοντέλα που ανοίγουν με ένα κλικ, με ασκήσεις και απαντήσεις.
:::
:::card{title="Θεωρητικό εγχειρίδιο" icon="lucide:sigma" to="/el/elements/conventions"}
Άξονες και συμβάσεις προσήμων, τα στοιχεία δοκού και δικτυώματος, και πώς επιλύει το EduBeam ένα μοντέλο.
:::
:::card{title="Βοήθεια" icon="lucide:life-buoy" to="/el/reference/shortcuts"}
Πληκτρολόγιο, ποντίκι και αφή, επίλυση προβλημάτων και συχνές ερωτήσεις.
:::
::

## Φτιάξτε τα δικά σας εργαλεία {#libraries}

Το EduBeam βασίζεται σε δύο βιβλιοθήκες ανοιχτού κώδικα, που τεκμηριώνονται σε αυτόν τον ιστότοπο. Με αυτές μπορείτε να επιλύετε φορείς σε ένα script, να δημιουργείτε διαφορετική άσκηση για κάθε φοιτητή ή να σχεδιάζετε σχήματα για διαφάνειες και σημειώσεις.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/el/solver"}
Ο επιλυτής πεπερασμένων στοιχείων του EduBeam, σε TypeScript: ορίστε, επιλύστε και διαβάστε μια δοκό σε δώδεκα περίπου γραμμές, στο πρόγραμμα περιήγησης ή στο Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/el/plot"}
Components της Vue 3 που σχεδιάζουν έναν επιλυμένο φορέα ως SVG, με τα φορτία, τις αντιδράσεις και τα διαγράμματα N, V και M.
:::
::

## Γλώσσες {#languages}

Το EduBeam μιλά 22 γλώσσες και ξεκινά στη γλώσσα του προγράμματος περιήγησής σας. Αλλάξτε τη στις **Ρυθμίσεις → Γλώσσα και τοπικές ρυθμίσεις** ή επιλέξτε μία εδώ:

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

Η γλώσσα μπορεί να οριστεί και από τον σύνδεσμο: το `run.edubeam.app/?lang=el` ανοίγει την εφαρμογή στα ελληνικά.

## Δημιουργοί και ευχαριστίες {#authors-credits}

Το [EduBeam]{.edubeam} αναπτύσσεται από τον [Jan Voříšek](https://github.com/janvorisek) ως ανεξάρτητο έργο. Συνεχίζει την παράδοση της εφαρμογής desktop EduBeam για Windows και Linux, που δημιούργησαν οι [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) και [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) στον Τομέα Μηχανικής της [Σχολής Πολιτικών Μηχανικών του Τσεχικού Τεχνικού Πανεπιστημίου της Πράγας (ČVUT)](https://www.fsv.cvut.cz/en), και εξακολουθεί να ανοίγει τα αρχεία συνεδρίας του. Ο επιλυτής του, το [@edubeam/fem](/el/solver), προήλθε από την πρώτη έκδοση του Bořek Patzák. Η εφαρμογή και ο επιλυτής είναι ανοιχτού κώδικα, με άδεια GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Επικεφαλής προγραμματιστής και σχεδιαστής προϊόντος","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Προγραμματιστής: χειρισμός με αφή, ταχύτητα σχεδίασης, φορτία και στηρίξεις","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"Το αρχικό EduBeam και ο πρώτος επιλυτής πεπερασμένων στοιχείων","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Συμμετοχή {#contribute}

::card-grid{cols="3"}
:::card{title="Αναφορά προβλήματος" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Κάτι ασαφές, λανθασμένο ή χαλασμένο; Ένα issue στο GitHub φτάνει απευθείας στην ομάδα.
:::
:::card{title="Βελτιώστε μια μετάφραση" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Τα κείμενα της εφαρμογής βρίσκονται σε ένα αρχείο ανά γλώσσα· κάθε pull request είναι ευπρόσδεκτο.
:::
:::card{title="Διαδώστε το" icon="lucide:share-2"}
Μοιραστείτε το EduBeam με συμφοιτητές και συναδέλφους ή βάλτε έναν σύνδεσμο μοντέλου στις σημειώσεις σας.
:::
::
