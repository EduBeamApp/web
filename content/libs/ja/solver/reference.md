---
title: API リファレンス
description: "@edubeam/fem 0.3 のすべてのクラス、メソッド、引数を、単位、既定値、戻り値の形とともにまとめます。"
order: 16
group: API リファレンス
source: site
---

# API リファレンス {#api-reference}

`@edubeam/fem` 0.3 がエクスポートするものを、用途別にまとめます。単位はすべて SI（m、N、N·m、N/m、Pa、K、rad）です。ラベル（`LabelType`）は `string | number` で、文字列として保存されます。ここに載っていないメソッドは内部用です。TypeScript で public になっているのは、ソルバー自身のクラスから呼び出すためにすぎません。

## エクスポート {#exports}

| エクスポート | 種類 | セクション |
| --- | --- | --- |
| `LinearStaticSolver` | クラス | [解析](#analyses) |
| `Solver` | 抽象クラス | [解析](#analyses) |
| `Domain` | クラス | [Domain](#domain) |
| `Node` | クラス | [Node](#node) |
| `Beam2D`, `Element` | クラス | [要素](#elements) |
| `Material`, `CrossSection` | クラス | [材料と断面](#materials-and-sections) |
| `LoadCase` | クラス | [荷重](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | クラス | [荷重](#loads) |
| `DofID` | 列挙型 | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | 型 | |

## 解析 {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| 名前 | 型 | 説明 |
| --- | --- | --- |
| `domain` | `Domain` | モデル |
| `loadCases` | `LoadCase[]` | 最初は荷重ケース `'DefaultLC'` が 1 つ。`new LoadCase(label, solver.domain)` で作って追加する：[荷重ケース](/ja/solver/load-cases) |
| `solve()` | `void` | 必要に応じて方程式に番号を付け、すべての荷重ケースについて組み立てて解く。[不安定構造](/ja/solver/solving#when-solving-fails)では例外を投げることがあるが、常にではない。0.3.1 以降は何も出力しない。0.3.0 は計算時間をログに出力していた |
| `codeNumberGenerated` | `boolean` | 節点や部材の追加・削除、支点の変更の後に `false` にする：[理由](/ja/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | 自由な自由度と拘束された自由度の数（解析後） |
| `k` | mathjs の `Matrix` | 組み立てた全体剛性マトリクス（解析後） |
| `getNodeDofIDs(label)` | `number[]` | 節点が持つ自由度（解析後） |

`EigenValueDynamicSolver` はソースコードにありますが、エクスポートされていません。

## Domain {#domain}

`solver.domain` は、モデルを 4 つの `Map`（`nodes`、`elements`、`materials`、`crossSections`）に保持します。キーは文字列にしたラベルです。削除用のメソッドはありません。節点や部材を削除するには `domain.nodes.delete(label)` や `domain.elements.delete(label)` を使い、その後で[番号を付け直します](/ja/solver/solving#solving-again-after-a-change)。

| メソッド | 戻り値 | 説明 |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` は `[x, y, z]`（m、既定値 `[0, 0, 0]`）、`bcs` は拘束する `DofID`（既定値はなし） |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` は `[first, second]`（始端、終端）、`hinges` は `[atFirst, atSecond]`（既定値 `[false, false]`） |
| `createMaterial(label, params?)` | `Material` | [材料と断面](#materials-and-sections)を参照 |
| `createCrossSection(label, params?)` | `CrossSection` | [材料と断面](#materials-and-sections)を参照 |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | 該当するオブジェクト | 存在しないラベルでは `RangeError` を投げる。`getElement` の型は `Element` なので、結果を読むには `as Beam2D` と書く |

すでに使われているラベルでオブジェクトを作成すると、古いものが置き換えられます。

## Node {#node}

| 名前 | 型 | 説明 |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`（m）。変更すると節点が移動する |
| `bcs` | `Set<DofID>` | 拘束する自由度。置き換えると支点が変わる |
| `lcs` | `number[][] \| undefined` | 節点の回転した座標軸（回転させた場合） |
| `updateLcs({ locx, locy }?)` | `void` | 節点の座標軸を回転させる。`locx` はグローバル成分で表した x 軸、`locy` は `[0, 1, 0]`。引数なしで元に戻す |
| `hasLcs()` | `boolean` | 座標軸が回転しているかどうか |
| `getUnknowns(lc, dofs)` | `Matrix`、自由度 1 つなら `number` | 変位（m）と回転角（rad）。節点の座標軸で表す |
| `getReactions(lc, global?)` | `{ dofs, values }` | 拘束された自由度の反力（`bcs` の順、N、N·m）。`values` は複数なら mathjs の `Matrix`、1 つなら要素 1 個の配列、自由な節点なら `[]`。座標軸を回転させた節点で `global` を `true` にすると、3 つの自由度すべてをグローバル座標系で返す。`dofs` は `[0, 2, 4]`、`values` は拘束していない自由度を 0 とした配列。[読み出し方](/ja/solver/results#reactions) |

## 要素 {#elements}

### `Beam2D` {#beam2d}

x–z 平面内の 2 節点ティモシェンコ梁で、節点あたり 3 つの自由度（`Dx`、`Dz`、`Ry`）を持ちます。`x` は始端節点からの距離（m）、`n` は分割数で、n + 1 点での値が得られます。

| 名前 | 戻り値 | 説明 |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | 始端節点と終端節点での曲げモーメントの解放 |
| `computeNormalForceAt(lc, x)` | `number` | N。引張が正 |
| `computeShearForceAt(lc, x)` | `number` | V。M がローカル x に沿って増える向きが正 |
| `computeBendingMomentAt(lc, x)` | `number` | M。ローカル +z 側が引張のとき正 |
| `computeNormalForce(lc, n)` | `{ x, N }` | n + 1 点での N |
| `computeShearForce(lc, n)` | `{ x, V }` | n + 1 点での V |
| `computeBendingMoment(lc, n)` | `{ x, M }` | n + 1 点での M |
| `computeLocalDefl(lc, n)` | `{ u, w }` | 部材軸方向と軸に直交する方向の変位。ローカル座標系、m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | 同じ変位をグローバル座標系の x と z で |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`。節点が部材に及ぼす力、ローカル座標系 |
| `computeEndDisplacement(lc)` | `Matrix` | ローカル座標系での材端変位（ヒンジの回転角を含む） |
| `computeGeo()` | `{ l, dx, dz }` | 部材長と射影長（m） |
| `computeT()` | `Matrix` | 6 × 6 座標変換マトリクス（グローバルからローカルへ） |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`：ローカル座標系の 6 × 6 剛性マトリクス（ヒンジは縮約済み） |
| `computeStiffness()` | `Matrix` | グローバル座標系の 6 × 6 剛性マトリクス |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

集中荷重の位置では、`…At` メソッドは荷重を過ぎた直後の値を返します。`Element` は `Beam2D` の抽象基底クラスで、`domain.elements` と `getElement` が使う型です。

## 材料と断面 {#materials-and-sections}

| `MaterialParameters` | 単位 | 既定値 | 用途 |
| --- | --- | --- | --- |
| `e` | Pa | 1 | 剛性 |
| `g` | Pa | 1 | せん断剛性 |
| `alpha` | 1/K | 1 | 温度荷重 |
| `d` | kg/m³ | 1 | 静的解析では使わない |

| `CrossSectionParameters` | 単位 | 既定値 | 用途 |
| --- | --- | --- | --- |
| `a` | m² | なし（必須） | 軸剛性とせん断剛性 |
| `iy` | m⁴ | なし（必須） | 曲げ剛性 |
| `k` | – | なし（必須） | せん断剛性 $kGA$。せん断変形を無視するなら `1e32` |
| `h` | m | なし | 温度勾配（ないと `NaN`） |
| `iz`, `dyz`, `j` | m⁴ | なし | `Beam2D` では使わない |

材料のパラメーターを省略すると、典型的な値ではなく 1 になります。`a`、`iy`、`k` のどれかを省略すると、すべての結果が `NaN` になります。どちらも例外は投げません。どちらのクラスにも、指定したパラメーターを設定する `change(params)` メソッドがあり、パラメーターは同じ名前のプロパティとして保持されます。

## 荷重 {#loads}

### `LoadCase` {#loadcase}

| メソッド | 戻り値 | 値 |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`。`lcs`（既定値 `false`）が `true` なら、節点の回転した座標軸で表す |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | 部材全長にわたる N/m |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | 始端節点と終端節点での N/m。その間は直線的に変化 |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N、N、N·m。始端節点から `a` m の位置 |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K：図心、下縁、上縁 |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | 拘束された自由度に `{ [DofID.Dz]: m, … }`。節点の座標軸で表す。拘束されていない自由度では無視される |

部材荷重では、`lcs` が `true` ならローカル座標系（x は部材軸方向、z は軸に直交する方向）、`false` ならグローバル座標系です。線荷重は部材長 1 m あたりの値です。例は[節点荷重と部材荷重](/ja/solver/loads)にあります。

| 名前 | 型 | 説明 |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | 部材荷重と温度荷重 |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | 解析が成功すると `true` |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | 1 つの部材にかかる荷重 |

荷重オブジェクトは値を public なプロパティに保持していて、解き直す前に変更できます。`NodalLoad`、`BeamElementUniformEdgeLoad`、`BeamConcentratedLoad`、`BeamTemperatureLoad` では `values`（と `lcs`）、`BeamElementTrapezoidalEdgeLoad` では `startValues` と `endValues`、`PrescribedDisplacement` では `prescribedValues` です。どの荷重にも、作用する対象のラベルを表す `target` があります。

## DofID {#dofid}

| 名前 | 値 | `Beam2D` で使用 |
| --- | --- | --- |
| `Dx` | 0 | する |
| `Dy` | 1 | しない |
| `Dz` | 2 | する |
| `Rx` | 3 | しない |
| `Ry` | 4 | する |
| `Rz` | 5 | しない |

## 結果 {#results}

結果は、`solve()` の後に、必ず `LoadCase` を指定して、`Beam2D`（断面力、たわみ、材端力）と `Node`（変位、反力）から読み出します。上の 2 つの表と、例と符号については[結果の読み出し](/ja/solver/results)を参照してください。要点は次のとおりです。

| 求めるもの | 呼び出し |
| --- | --- |
| 反力（N、N·m） | `node.getReactions(lc)` |
| 変位（m）と回転角（rad） | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| 1 点での N、V、M（N、N·m） | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| 部材に沿った N、V、M | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| 変位図（m） | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| 材端力（N、N·m） | `beam.computeEndForces(lc)` |
| すべてを図にする | [@edubeam/plot](/ja/solver/drawing) の `StructurePlot` または `structureSvg` |
