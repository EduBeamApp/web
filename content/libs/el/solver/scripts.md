---
title: Σενάρια και διακομιστές
description: "Χρησιμοποιήστε το @edubeam/fem από το Node: ένα φύλλο ασκήσεων με τις λύσεις του, μια γραμμή επιρροής γραμμένη σε CSV και ένα μικρό endpoint HTTP που επιλύει δοκούς κατ' απαίτηση."
order: 15
source: site
---

# Σενάρια και διακομιστές {#scripts-and-servers}

Ο επιλυτής δεν χρειάζεται πρόγραμμα περιήγησης. Στο Node γράφει λύσεις ασκήσεων, εκτελεί παραμετρικές μελέτες, φτιάχνει πίνακες για υπολογιστικά φύλλα ή απαντά σε αιτήματα από μια ιστοσελίδα.

Τα παραδείγματα είναι σε TypeScript. Το Node 22.18 ή νεότερο εκτελεί απευθείας αρχεία `.ts` (`node answers.ts`), σε φάκελο προετοιμασμένο όπως στην ενότητα [Εγκατάσταση](/el/solver/getting-started#install)· σε παλαιότερο Node, αφαιρέστε τις σημειώσεις τύπων και αποθηκεύστε τα ως `.mjs`.

## Φύλλο ασκήσεων με τις λύσεις του {#answer-key}

Είκοσι παραλλαγές μίας άσκησης, αμφιέρειστης δοκού με ομοιόμορφο και συγκεντρωμένο φορτίο, η καθεμία με τις αντιδράσεις της και τη μέγιστη ροπή της, γραμμένες σε αρχείο CSV. Οι αριθμοί προκύπτουν από τον αριθμό της άσκησης, οπότε το ίδιο σενάριο γράφει πάντα το ίδιο φύλλο:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Άσκηση i: αμφιέρειστη δοκός με q kN/m και F kN σε απόσταση a m από το A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // από 4 έως 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 ή 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 ή 20 kN
  const a = L / 4 + (i % 3) // κάπου μέσα στο άνοιγμα
  return { L, q, F, a }
}

const solve = ({ L, q, F, a }: ReturnType<typeof exercise>) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  solver.solve()

  // Οι αντιδράσεις είναι οι τέμνουσες στα άκρα: V(0) στο A, -V(L) στο B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // Η μέγιστη ροπή, από σημεία ανά 1 cm
  const { x, M } = beam.computeBendingMoment(lc, L * 100)
  const top = M.indexOf(Math.max(...M))
  return [rA, rB, M[top] / 1e3, x[top]].map((v) => v.toFixed(2))
}

const rows = ['no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m']
for (let i = 1; i <= 20; i++) {
  const ex = exercise(i)
  rows.push([i, ex.L, ex.q, ex.F, ex.a, ...solve(ex)].join(','))
}
writeFileSync('answers.csv', rows.join('\n') + '\n')
```

```text [answers.csv]
no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m
1,5,10,20,2.25,36.00,34.00,55.69,2.25
2,6,15,10,3.5,49.17,50.83,80.58,3.28
3,7,5,20,1.75,32.50,22.50,50.63,2.50
...
```

Ελέγξτε την πρώτη με το χέρι: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, και η τέμνουσα αλλάζει πρόσημο κάτω από το συγκεντρωμένο φορτίο, οπότε εκεί βρίσκεται η μέγιστη ροπή: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Δύο επιλογές κρατούν το σενάριο σύντομο. Σε αμφιέρειστη δοκό οι αντιδράσεις είναι οι τέμνουσες στα άκρα, οπότε δεν χρειάζεται [βοηθητική συνάρτηση για τις αντιδράσεις](/el/solver/results#reactions). Και η μέγιστη ροπή προκύπτει από σημεία ανά 1 cm, κάτι που εδώ είναι ακριβές, επειδή το ακρότατο πέφτει κάτω από φορτίο ή το πολύ ένα εκατοστό από σημείο του πλέγματος. Για να σχεδιάσετε κάθε άσκηση, με ή χωρίς τις λύσεις της, δείτε τη σελίδα [Ασκήσεις και διαγωνίσματα](/el/plot/exercises) του @edubeam/plot, που τυπώνει επίσης ολόκληρο διαγώνισμα.

## Γραμμή επιρροής ως CSV {#an-influence-line-as-csv}

Πώς μεταβάλλεται η ροπή πάνω από τη μεσαία στήριξη μιας δοκού δύο ανοιγμάτων καθώς ένα φορτίο 1 kN κινείται πάνω της; Κατασκευάστε και επιλύστε τη δοκό μία φορά για κάθε θέση του φορτίου και γράψτε μια γραμμή για καθεμία:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Δύο ανοίγματα των 5 m, 1 kN σε απόσταση `at` m από το A: η ροπή πάνω από τη μεσαία στήριξη */
const momentAtB = (at: number): number => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [5, 0, 0], [DofID.Dz])
  domain.createNode('C', [10, 0, 0], [DofID.Dz])
  const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  const [member, x] = at <= 5 ? [1, at] : [2, at - 5]
  solver.loadCases[0].createBeamConcentratedLoad(member, [0, 1e3, 0, x], true)
  solver.solve()
  return span1.computeBendingMomentAt(solver.loadCases[0], 5)
}

const rows = ['x_m,MB_kNm_per_kN']
for (let at = 0; at <= 10; at += 0.5) {
  rows.push(`${at},${(momentAtB(at) / 1e3).toFixed(4)}`)
}
writeFileSync('influence.csv', rows.join('\n') + '\n')
```

```bash
node influence.ts
```

```text [influence.csv]
x_m,MB_kNm_per_kN
0,0.0000
0.5,-0.1237
1,-0.2400
1.5,-0.3412
2,-0.4200
2.5,-0.4688
3,-0.4800
...
```

Η αναλυτική λύση για δύο ίσα ανοίγματα είναι $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $-0{,}46875$ kNm για $a = 2{,}5$ m, και η δυσμενέστερη θέση είναι $a = L/\sqrt{3} = 2{,}887$ m. Η γραμμή είναι συμμετρική, οπότε οι 21 γραμμές τελειώνουν όπως άρχισαν, με 0 πάνω από τη στήριξη C.

Ένας νέος επιλυτής για κάθε θέση είναι απλούστερος από την αλλαγή του ίδιου μοντέλου και κοστίζει λίγα χιλιοστά του δευτερολέπτου. Αν προτιμάτε να αλλάζετε ένα ήδη επιλυμένο μοντέλο, δείτε [Νέα επίλυση μετά από αλλαγή](/el/solver/solving#solving-again-after-a-change).

## Επιλυτής πίσω από endpoint HTTP {#a-solver-behind-an-http-endpoint}

Ένας μικρός διακομιστής, μόνο με το ενσωματωμένο module `http` του Node, που επιλύει αμφιέρειστη δοκό για οποιοδήποτε άνοιγμα και φορτίο του στείλετε:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Αμφιέρειστη IPE 200, `span` m, `q` kN/m: M και βέλος κάμψης στο μέσο του ανοίγματος */
const solveBeam = (span: number, q: number) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [span, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  solver.solve()
  return {
    momentKNm: beam.computeBendingMomentAt(lc, span / 2) / 1e3,
    deflectionMm: beam.computeLocalDefl(lc, 2).w[1] * 1e3,
  }
}

createServer(async (req, res) => {
  try {
    let body = ''
    for await (const chunk of req) body += chunk
    const { span, q } = JSON.parse(body) as { span?: unknown; q?: unknown }
    if (typeof span !== 'number' || !(span > 0) || typeof q !== 'number') {
      throw new Error('Bad input')
    }
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(solveBeam(span, q)) + '\n')
  } catch {
    // Λανθασμένο JSON, λάθος αριθμοί ή μοντέλο που δεν επιλύεται: ο διακομιστής συνεχίζει να λειτουργεί
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm και $5qL^4/384EI = 49{,}63$ mm. Το `try` έχει σημασία: ένα μη έγκυρο JSON προκαλεί εξαίρεση, όπως ενδέχεται να προκαλέσει και ένα μοντέλο που ο επιλυτής δεν μπορεί να επιλύσει, και κανένα από τα δύο δεν πρέπει να ρίξει τον διακομιστή. Μια δημόσια υπηρεσία θα έπρεπε επίσης να περιορίζει το μέγεθος του αιτήματος και το άνοιγμα.

## Στο πρόγραμμα περιήγησης {#in-the-browser}

Ο ίδιος κώδικας εκτελείται αυτούσιος σε μια σελίδα, επιλύοντας στη συσκευή του αναγνώστη: έτσι λειτουργεί κάθε διαδραστικό σχήμα αυτού του ιστότοπου. Εισαγάγετε το πακέτο μέσω του bundler σας, για παράδειγμα Vite ή Nuxt, και [σχεδιάστε τα αποτελέσματα](/el/solver/drawing) με το @edubeam/plot. Ένα μοντέλο επιλύεται σε χιλιοστά του δευτερολέπτου, οπότε μια σελίδα μπορεί να επιλύει ξανά σε κάθε συμβάν `input`.
