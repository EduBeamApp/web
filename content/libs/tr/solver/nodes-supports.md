---
title: Düğümler ve mesnetler
description: "@edubeam/fem modelinde düğüm oluşturun, serbestlik derecelerini tutarak mesnet tanımlayın, eğik mesnet için eksenleri döndürün, çözümden sonra düğümleri değiştirin."
order: 3
group: Modelleme
source: site
---

# Düğümler ve mesnetler {#nodes-and-supports}

Düğümler, çubukların birbirine bağlandığı noktalardır. Mesnet ayrı bir nesne değildir: bir düğümün tuttuğu serbestlik derecelerinin listesidir. Bu sayfadaki kod parçaları [Başlarken](/tr/solver/getting-started) sayfasındaki gibi bir programın parçalarıdır ve onun `solver`, `domain` ve `lc` değişkenlerini kullanır.

## Düğüm oluşturmak {#create-a-node}

```ts
domain.createNode(label, [x, y, z], bcs)
```

| Argüman | Tip | Anlamı |
| --- | --- | --- |
| `label` | `string \| number` | Düğümün adı; metin olarak saklanır: `1` ile `'1'` aynı düğümdür |
| `coords` | `number[]` | Metre cinsinden `[x, y, z]`, `y = 0` ile. z aşağı bakar. |
| `bcs` | `DofID[]` | Mesnedin tuttuğu serbestlik dereceleri. Serbest bir düğüm için vermeyin. |

Metot `Node` nesnesini döndürür; `domain.getNode(label)` onu yeniden bulur. Kullanımda olan bir etiket verirseniz eski düğümün yerini yenisi alır.

```ts
import { DofID } from '@edubeam/fem'

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [0, 0, -4]) // serbest: 4 m'lik bir kolonun başı
```

## Mesnetler {#supports}

EduBeam uygulamasındaki her mesnet, tutulu serbestlik derecelerinden oluşan bir kümedir:

| Mesnet | `bcs` | Tuttukları |
| --- | --- | --- |
| Ankastre | `[DofID.Dx, DofID.Dz, DofID.Ry]` | hepsini |
| Mafsallı mesnet | `[DofID.Dx, DofID.Dz]` | iki yer değiştirmeyi; dönme serbest |
| Kayıcı mesnet | `[DofID.Dz]` | düşey yer değiştirmeyi; x boyunca kayar |
| Düşey kayıcı mesnet | `[DofID.Dx]` | yatay yer değiştirmeyi; z boyunca kayar |
| Kayar ankastre | `[DofID.Dz, DofID.Ry]` | düşey yer değiştirmeyi ve dönmeyi; x boyunca kayar |
| Düşey kayar ankastre | `[DofID.Dx, DofID.Ry]` | yatay yer değiştirmeyi ve dönmeyi; z boyunca kayar |
| Yalnız dönme tutulu | `[DofID.Ry]` | dönmeyi |

Serbestlik derecelerini hangi sırayla yazarsanız [mesnet tepkileri](/tr/solver/results#reactions) de o sırayla döner. Bir yapının en az üç tutulu serbestlik derecesi olmalı ve bunlar yapının bir mekanizma gibi hareket edemeyeceği şekilde yerleşmelidir: bkz. [Çözüm başarısız olursa](/tr/solver/solving#when-solving-fails).

Tutulu bir serbestlik derecesine belirli bir yer değiştirme de verebilirsiniz; bu bir mesnet çökmesidir: bkz. [Öngörülen yer değiştirmeler](/tr/solver/temperature-settlements#prescribed-displacements).

## Eğik mesnetler {#inclined-supports}

Eğimli bir yüzeydeki kayıcı mesnet düğümü düşey doğrultuda değil, eğime dik doğrultuda tutar. Düğümün eksenlerini `updateLcs` ile döndürün; düğümün `bcs` listesi artık döndürülmüş eksenlere göre tanımlanır. Başlarken sayfasındaki programda B düğümünü bunun yerine şöyle oluşturun:

```ts
const b = domain.createNode('B', [6, 0, 0], [DofID.Dz]) // kendi z doğrultusunda tutulu
const a = (30 * Math.PI) / 180 // 30°, x'ten z'ye doğru: ekranda saat yönünde
b.updateLcs({ locx: [Math.cos(a), 0, Math.sin(a)], locy: [0, 1, 0] })
```

`locx`, düğümün kendi x ekseninin global eksenlerdeki vektörüdür; `locy` ise y eksenidir ve `[0, 1, 0]` olarak kalır. EduBeam uygulamasında aynı açı, düğümün *Düğüm yerel eksen açısı* alanındaki 30°'dir.

`solve()` çağrısından sonra B mesnedi eğime dik doğrultuda iter, yatay bileşeni ise A'daki mafsallı mesnet karşılar:

```ts
b.getReactions(lc).values // [-41569]: B'nin kendi z ekseni boyunca N, 36 kN / cos 30°
b.getReactions(lc, true).values // [20785, -36000, 0]: x boyunca, z boyunca, moment
```

::model-figure{caption="30° döndürülmüş bir kayıcı mesnet: tepkisi eğime diktir ve kirişte çekme oluşur"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, N]
show: [nodeLabels]
---
::

Düşey bileşen yine $qL/2 = 36$ kN'dur; yatay bileşen, yani $36 \tan 30° = 20{,}8$ kN, kirişi iki ucundan çeker. Moment değişmez.

Döndürülmüş bir düğümde yer değiştirmeler ve mesnet tepkileri, global eksenler için `true` vermediğiniz sürece düğümün kendi eksenlerindedir. Böyle bir düğüme etkiyen düğüm yükleri ise aksini belirtmediğiniz sürece globaldir: bkz. [Düğüm yükleri](/tr/solver/loads#nodal-loads). Argümansız `node.updateLcs()` eksenleri ilk hâline getirir.

## Düğümü değiştirmek {#change-a-node}

Düğüm sıradan bir nesnedir: taşımak için `node.coords` değerini değiştirin, mesnedini değiştirmek için `Set<DofID>` tipindeki `node.bcs` kümesini yenisiyle değiştirin.

```ts
domain.getNode('B').coords = [8, 0, 0] // daha uzun açıklık: solve() yeterli
domain.getNode('A').bcs = new Set(fixed) // yeni mesnet: önce yeniden numaralandırın
solver.codeNumberGenerated = false
solver.solve()
```

Mesnetleri değiştirmek ya da düğüm eklemek ve silmek denklemleri değiştirir: `codeNumberGenerated = false` olmadan çözücü **hiçbir uyarı vermeden eski mesnetleri kullanmaya devam eder**. Hangi değişikliklerin bunu gerektirdiği [Değişiklikten sonra yeniden çözmek](/tr/solver/solving#solving-again-after-a-change) bölümünde listelenmiştir.
