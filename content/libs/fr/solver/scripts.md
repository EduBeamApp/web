---
title: Scripts et serveurs
description: "@edubeam/fem dans Node : une feuille d’exercices et son corrigé, une ligne d’influence en CSV et un point d’accès HTTP qui calcule des poutres à la demande."
order: 15
source: site
---

# Scripts et serveurs {#scripts-and-servers}

Le solveur n’a pas besoin de navigateur. Dans Node, il écrit des corrigés, mène des études paramétriques, produit des tableaux pour un tableur ou répond aux requêtes d’une page web.

Les exemples sont en TypeScript. Node 22.18 ou plus récent exécute directement les fichiers `.ts` (`node answers.ts`), dans un dossier préparé comme dans [Installation](/fr/solver/getting-started#install) ; avec un Node plus ancien, supprimez les annotations de type et enregistrez les fichiers en `.mjs`.

## Une feuille d’exercices avec son corrigé {#answer-key}

Vingt variantes d’un même exercice, une poutre sur deux appuis sous une charge linéique et une charge ponctuelle, chacune avec ses réactions et son plus grand moment, écrites dans un fichier CSV. Les valeurs découlent du numéro de l’exercice : le même script écrit donc toujours la même feuille.

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Exercice i : une poutre sur deux appuis sous q kN/m et F kN à a m de A. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // de 4 à 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 ou 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 ou 20 kN
  const a = L / 4 + (i % 3) // quelque part dans la travée
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

  // Les réactions sont les efforts tranchants d'extrémité : V(0) en A, -V(L) en B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // Le plus grand moment, sur des points espacés de 1 cm
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

Vérifiez le premier à la main : $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, et l’effort tranchant change de signe sous la charge ponctuelle : c’est donc là que se trouve le plus grand moment, $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Deux choix gardent le script court. Sur une poutre sur deux appuis, les réactions sont les efforts tranchants d’extrémité : la [fonction utilitaire des réactions](/fr/solver/results#reactions) est donc inutile. Et le plus grand moment est pris sur des points espacés de 1 cm, ce qui est exact ici, car l’extremum tombe sous une charge ou à moins d’un centimètre d’un point échantillonné. Pour dessiner chaque exercice, avec ou sans ses solutions, voir la page [Exercices et examens](/fr/plot/exercises) de @edubeam/plot, qui imprime aussi un sujet complet.

## Une ligne d’influence en CSV {#an-influence-line-as-csv}

Comment le moment sur l’appui central d’une poutre à deux travées varie-t-il quand une charge de 1 kN la parcourt ? Construisez et calculez la poutre une fois par position de la charge, et écrivez une ligne pour chacune :

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Deux travées de 5 m, 1 kN à `at` m de A : le moment sur l'appui central */
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

La solution analytique pour deux travées égales est $M_B = -P\,a\,(L^2 - a^2)/4L^2$ : $-0{,}46875$ kNm pour $a = 2{,}5$ m, et la position la plus défavorable est $a = L/\sqrt{3} = 2{,}887$ m. La ligne est symétrique : les 21 lignes du fichier finissent donc comme elles ont commencé, à 0 au droit de l’appui C.

Un nouveau solveur par position est plus simple que de modifier toujours le même, et ne coûte que quelques millisecondes. Pour modifier plutôt un modèle déjà calculé, voir [Recalculer après une modification](/fr/solver/solving#solving-again-after-a-change).

## Un solveur derrière un point d’accès HTTP {#a-solver-behind-an-http-endpoint}

Un petit serveur, qui n’utilise que le module `http` de Node, et qui calcule une poutre sur deux appuis pour toute portée et toute charge qu’on lui envoie :

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Un IPE 200 sur deux appuis, `span` m, `q` kN/m : M et flèche à mi-portée */
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
    // JSON invalide, valeurs incorrectes ou modèle impossible à calculer : le serveur reste en marche
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm et $5qL^4/384EI = 49{,}63$ mm. Le `try` compte : un JSON invalide lève une exception, tout comme peut le faire un modèle que le solveur ne sait pas calculer, et aucun des deux ne doit faire tomber le serveur. Un service public limiterait en outre la taille de la requête et la portée.

## Dans le navigateur {#in-the-browser}

Le même code fonctionne tel quel dans une page, et calcule sur l’appareil du lecteur : c’est ainsi que fonctionnent toutes les figures en direct de ce site. Importez le paquet via votre bundler, Vite ou Nuxt par exemple, et [dessinez les résultats](/fr/solver/drawing) avec @edubeam/plot. Un modèle se calcule en quelques millisecondes : une page peut donc relancer le calcul à chaque événement de saisie.
