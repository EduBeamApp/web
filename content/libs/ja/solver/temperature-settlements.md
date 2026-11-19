---
title: 温度荷重と支点沈下
description: "@edubeam/fem の部材に一様な温度変化と温度勾配を与え、強制変位で支点を動かします。手計算で確かめた例付き。"
order: 7
source: site
---

# 温度荷重と支点沈下 {#temperature-and-settlements}

力ではない荷重が 2 つあります。長さや曲率を変えようとする部材と、動く支点です。どちらも、構造物がその動きを拘束する場所でだけ断面力を生じます。そのため、不静定構造物を学ぶのに適した題材です。どちらの理論も、アプリの理論マニュアルの[要素荷重](/ja/elements/beam#element-loads)で説明しています。

## 温度 {#temperature}

```ts
lc.createBeamTemperatureLoad(member, [dTc, dTb, dTt])
```

| 値 | 意味 | 自由な部材への影響 |
| --- | --- | --- |
| `dTc` | 図心での温度変化（K） | $\alpha\,\Delta T_c\,L$ だけ伸びる |
| `dTb` | 下縁（ローカル +z 側）での温度変化（K） | `dTt` とともに、曲率 $\kappa = \alpha\,(\Delta T_b - \Delta T_t)/h$ で曲がる |
| `dTt` | 上縁での温度変化（K） | |

部材を曲げるのは差 `dTb - dTt` だけなので、`[30, 20, 0]` と `[30, 10, -10]` は同じ荷重です。材料の `alpha` と断面の `h` が必要で、`h` がないと曲げモーメントは `NaN` になります。

両端固定の梁は伸びることも曲がることもできないので、代わりに圧縮され、曲げられます。断面力は $N = -EA\,\alpha\,\Delta T_c$、$M = -EI\,\alpha\,(\Delta T_b - \Delta T_t)/h$ です。

```ts [temperature.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]
domain.createMaterial(1, { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })

const fixed = [DofID.Dx, DofID.Dz, DofID.Ry]
domain.createNode('A', [0, 0, 0], fixed)
domain.createNode('B', [6, 0, 0], fixed)
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

// 図心で 30 K 上昇、下縁は上縁より 20 K 高い
lc.createBeamTemperatureLoad(1, [30, 20, 0])
solver.solve()

beam.computeNormalForceAt(lc, 3) // -215460 N：EA · 12e-6 · 30
beam.computeBendingMomentAt(lc, 3) // -4896.4 N·m：EI · 12e-6 · 20 / 0.2
```

IPE 200 では $EA = 598.5$ MN、$EI = 4.0803$ MNm² です。下縁の温度が高いと、自由な梁は両端が上に反ります。拘束はそれと逆向きに梁を曲げるので、負の曲げモーメント（上側引張）が生じます。

::model-figure{caption="両端固定梁：図心で 30 K 上昇、下縁は上縁より 20 K 高温"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 30, bottom: 20, top: 0 } }
results: [M, N]
show: [nodeLabels]
material: { e: 210e9, alpha: 12e-6 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

単純梁では、同じ荷重を与えても断面力はまったく生じず、変形するだけです。ローラー支点は $\alpha\,\Delta T_c\,L = 2.16$ mm 外側へ移動し、スパン中央は $\kappa L^2/8 = 5.4$ mm たわみます。

## 強制変位 {#prescribed-displacements}

```ts
lc.createPrescribedDisplacement(node, { [DofID.Dz]: 0.01 })
```

支点を所定の量だけ動かします。`Dx` と `Dz` はメートル、`Ry` はラジアンで、節点自身の座標軸で指定します。対象の自由度は、その節点の支点が拘束しているものでなければなりません。拘束されていない自由度に与えた値は、警告なしに無視されます。

一端固定他端ローラー支持梁で、ローラー支点が 10 mm 沈下する例です。新しいソルバーで、温度荷重の例と同じ材料と断面を使います。

```ts
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // 固定
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // ローラー
const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)

lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 }) // 下向きに 10 mm
solver.solve()

domain.getNode('B').getReactions(lc).values // [566.7] N：3EIw/L³
beam.computeBendingMomentAt(lc, 0) // A で -3400.2 N·m：3EIw/L²
```

梁を沈下に追従させるには、ローラー支点が梁を下に引く必要があります。そのため反力は +z 方向、つまり正で、$3EIw/L^3 = 3 \cdot 4.0803 \times 10^6 \cdot 0.01 / 216 = 566.7$ N です。

::model-figure{caption="一端固定他端ローラー支持梁のローラー支点が 10 mm 沈下：固定端で −3.4 kNm"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2 }
---
::

アプリでこの 2 種類の荷重がどう表示されるかは、[荷重](/ja/essentials/loads)のページにあります。
