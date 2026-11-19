---
title: API 레퍼런스
description: "@edubeam/fem 0.3의 모든 클래스, 메서드, 인수를 단위, 기본값, 반환 형태와 함께 정리했습니다."
order: 16
group: API 레퍼런스
source: site
---

# API 레퍼런스 {#api-reference}

`@edubeam/fem` 0.3이 내보내는 항목을 용도별로 묶었습니다. 단위는 모두 SI(m, N, N·m, N/m, Pa, K, rad)입니다. 레이블(`LabelType`)은 `string | number`이며 문자열로 저장됩니다. 여기에 없는 메서드는 내부용입니다. 솔버 자신의 클래스가 호출하기 때문에 TypeScript에서 public일 뿐입니다.

## 내보내는 항목 {#exports}

| 항목 | 종류 | 절 |
| --- | --- | --- |
| `LinearStaticSolver` | 클래스 | [해석](#analyses) |
| `Solver` | 추상 클래스 | [해석](#analyses) |
| `Domain` | 클래스 | [Domain](#domain) |
| `Node` | 클래스 | [Node](#node) |
| `Beam2D`, `Element` | 클래스 | [요소](#elements) |
| `Material`, `CrossSection` | 클래스 | [재료 및 단면](#materials-and-sections) |
| `LoadCase` | 클래스 | [하중](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | 클래스 | [하중](#loads) |
| `DofID` | 열거형 | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | 타입 | |

## 해석 {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| 멤버 | 타입 | 설명 |
| --- | --- | --- |
| `domain` | `Domain` | 모델 |
| `loadCases` | `LoadCase[]` | 처음에는 하중조건 `'DefaultLC'` 하나. `new LoadCase(label, solver.domain)`으로 만들어 추가: [하중조건](/ko/solver/load-cases) |
| `solve()` | `void` | 필요하면 방정식에 번호를 매기고, 모든 하중조건을 조립해 풂. [메커니즘](/ko/solver/solving#when-solving-fails)이면 예외를 던질 수 있지만 항상 그렇지는 않음. 0.3.1부터 출력 없음, 0.3.0은 소요 시간을 출력. |
| `codeNumberGenerated` | `boolean` | 절점이나 부재를 추가·삭제하거나 지점을 바꾼 뒤에는 `false`로 설정: [이유](/ko/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | 구속되지 않은 자유도와 구속된 자유도의 수, 해석 후 |
| `k` | mathjs `Matrix` | 조립된 전체 강성 행렬, 해석 후 |
| `getNodeDofIDs(label)` | `number[]` | 절점의 자유도, 해석 후 |

`EigenValueDynamicSolver`는 소스 코드에는 있지만 내보내지 않습니다.

## Domain {#domain}

`solver.domain`은 모델을 `Map` 네 개(`nodes`, `elements`, `materials`, `crossSections`)에 담으며, 키는 문자열로 바꾼 레이블입니다. 삭제 메서드는 없습니다. 절점이나 부재는 `domain.nodes.delete(label)`, `domain.elements.delete(label)`로 지운 뒤 [번호를 다시 매깁니다](/ko/solver/solving#solving-again-after-a-change).

| 메서드 | 반환값 | 설명 |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords`는 `[x, y, z]`, m(기본값 `[0, 0, 0]`), `bcs`는 구속된 `DofID` 목록(기본값 없음) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes`는 `[first, second]`, `hinges`는 `[atFirst, atSecond]`(기본값 `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | [재료 및 단면](#materials-and-sections) 참고 |
| `createCrossSection(label, params?)` | `CrossSection` | [재료 및 단면](#materials-and-sections) 참고 |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | 해당 객체 | 없는 레이블이면 `RangeError`를 던짐. `getElement`의 반환 타입은 `Element`이므로 결과를 읽으려면 `as Beam2D`를 붙임. |

이미 쓰고 있는 레이블로 객체를 만들면 기존 객체를 대체합니다.

## Node {#node}

| 멤버 | 타입 | 설명 |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. 바꾸면 절점이 옮겨짐. |
| `bcs` | `Set<DofID>` | 구속된 자유도. 새로 대입하면 지점이 바뀜. |
| `lcs` | `number[][] \| undefined` | 절점의 돌린 좌표축(있는 경우) |
| `updateLcs({ locx, locy }?)` | `void` | 절점의 좌표축을 돌림: `locx`는 x축의 전체 좌표계 성분, `locy`는 `[0, 1, 0]`. 인수가 없으면 원래대로. |
| `hasLcs()` | `boolean` | 좌표축을 돌렸는지 여부 |
| `getUnknowns(lc, dofs)` | `Matrix`, 자유도 하나면 `number` | 변위(m)와 회전각(rad), 절점의 좌표축 기준 |
| `getReactions(lc, global?)` | `{ dofs, values }` | 구속된 자유도의 반력, `bcs` 순서: N, N·m. `values`는 여러 개면 mathjs `Matrix`, 하나면 원소 하나짜리 배열, 자유 절점이면 `[]`. 좌표축을 돌린 절점에 `global`을 `true`로 주면 전체 좌표계의 자유도 3개 모두: `dofs`는 `[0, 2, 4]`, `values`는 구속하지 않은 자유도에 0을 넣은 배열. [반력 읽기](/ko/solver/results#reactions) |

## 요소 {#elements}

### `Beam2D` {#beam2d}

x–z 평면의 2절점 Timoshenko 보로, 절점마다 자유도가 3개(`Dx`, `Dz`, `Ry`) 있습니다. `x`는 첫 번째 절점에서 잰 거리(m)이고, `n`은 구간 수로 n + 1개 점을 줍니다.

| 멤버 | 반환값 | 설명 |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | 첫 번째, 두 번째 절점의 모멘트 해제 |
| `computeNormalForceAt(lc, x)` | `number` | N, 인장이 양수 |
| `computeShearForceAt(lc, x)` | `number` | V, 국부 x 방향으로 M이 증가하면 양수 |
| `computeBendingMomentAt(lc, x)` | `number` | M, 국부 +z 쪽이 인장이면 양수 |
| `computeNormalForce(lc, n)` | `{ x, N }` | n + 1개 점의 N |
| `computeShearForce(lc, n)` | `{ x, V }` | n + 1개 점의 V |
| `computeBendingMoment(lc, n)` | `{ x, M }` | n + 1개 점의 M |
| `computeLocalDefl(lc, n)` | `{ u, w }` | 부재 축 방향과 축에 수직인 방향의 변위, 국부 좌표계, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | 같은 값을 전체 좌표계의 x와 z로 |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, 절점이 부재에 가하는 힘, 국부 좌표계 |
| `computeEndDisplacement(lc)` | `Matrix` | 국부 좌표계의 단부 변위, 힌지 회전각 포함 |
| `computeGeo()` | `{ l, dx, dz }` | 길이와 투영 길이, m |
| `computeT()` | `Matrix` | 6 × 6 좌표 변환 행렬, 전체에서 국부로 |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: 국부 좌표계의 6 × 6 강성 행렬, 힌지는 축약됨 |
| `computeStiffness()` | `Matrix` | 전체 좌표계의 6 × 6 강성 행렬 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

집중하중 위치에서 `…At` 메서드는 하중을 막 지난 쪽의 값을 반환합니다. `Element`는 `Beam2D`의 추상 기반 클래스이며, `domain.elements`와 `getElement`가 쓰는 타입입니다.

## 재료 및 단면 {#materials-and-sections}

| `MaterialParameters` | 단위 | 기본값 | 용도 |
| --- | --- | --- | --- |
| `e` | Pa | 1 | 강성 |
| `g` | Pa | 1 | 전단강성 |
| `alpha` | 1/K | 1 | 온도하중 |
| `d` | kg/m³ | 1 | 정적 해석에서는 쓰지 않음 |

| `CrossSectionParameters` | 단위 | 기본값 | 용도 |
| --- | --- | --- | --- |
| `a` | m² | 없음, 필수 | 축강성과 전단강성 |
| `iy` | m⁴ | 없음, 필수 | 휨강성 |
| `k` | – | 없음, 필수 | 전단강성 $kGA$. 전단 변형을 무시하려면 `1e32` |
| `h` | m | 없음 | 온도구배(없으면 `NaN`) |
| `iz`, `dyz`, `j` | m⁴ | 없음 | `Beam2D`에서는 쓰지 않음 |

빠진 재료 매개변수는 일반적인 값이 아니라 1이 되고, `a`, `iy`, `k` 중 하나가 빠지면 모든 결과가 `NaN`이 됩니다. 어느 쪽도 예외를 던지지 않습니다. 두 클래스 모두 주어진 매개변수를 설정하는 `change(params)` 메서드가 있고, 매개변수는 같은 이름의 속성에 저장됩니다.

## 하중 {#loads}

### `LoadCase` {#loadcase}

| 메서드 | 반환값 | 값 |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`. `lcs`(기본값 `false`)가 `true`면 절점의 돌린 좌표축 기준 |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | 부재 전체에 N/m |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | 첫 번째와 두 번째 절점에서의 N/m, 그 사이는 선형 |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, 첫 번째 절점에서 `a` m 위치 |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: 도심, 하연, 상연 |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | 구속된 자유도에 `{ [DofID.Dz]: m, … }`, 절점의 좌표축 기준. 구속되지 않은 자유도에서는 무시 |

부재하중에서 `lcs`가 `true`면 국부 좌표계(x는 부재 축 방향, z는 부재에 수직), `false`면 전체 좌표계입니다. 분포하중은 부재 길이 1 m당 값입니다. 예제는 [절점하중 및 부재하중](/ko/solver/loads)에 있습니다.

| 멤버 | 타입 | 설명 |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | 부재하중과 온도하중 |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | 해석에 성공하면 `true` |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | 부재 하나에 작용하는 하중 |

하중 객체는 값을 public 속성에 담고 있으며, 다시 풀기 전에 이를 바꿀 수 있습니다. `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad`, `BeamTemperatureLoad`에는 `values`(와 `lcs`), `BeamElementTrapezoidalEdgeLoad`에는 `startValues`와 `endValues`, `PrescribedDisplacement`에는 `prescribedValues`가 있습니다. 모든 하중에는 작용 대상의 레이블인 `target`이 있습니다.

## DofID {#dofid}

| 이름 | 값 | `Beam2D`에서 사용 |
| --- | --- | --- |
| `Dx` | 0 | 예 |
| `Dy` | 1 | 아니요 |
| `Dz` | 2 | 예 |
| `Rx` | 3 | 아니요 |
| `Ry` | 4 | 예 |
| `Rz` | 5 | 아니요 |

## 결과 {#results}

결과는 `solve()` 후 항상 특정 `LoadCase`에 대해 `Beam2D`(부재력, 처짐, 단부력)와 `Node`(변위, 반력)에서 읽습니다. 위의 두 표를 보고, 예제와 부호는 [결과 읽기](/ko/solver/results)를 참고하세요. 요약하면 다음과 같습니다.

| 구할 값 | 호출 |
| --- | --- |
| 반력(N, N·m) | `node.getReactions(lc)` |
| 변위(m)와 회전각(rad) | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| 한 점의 N, V, M(N, N·m) | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| 부재를 따라가는 N, V, M | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| 변형 형상(m) | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| 단부력(N, N·m) | `beam.computeEndForces(lc)` |
| 이 모든 것의 그림 | [@edubeam/plot](/ko/solver/drawing)의 `StructurePlot` 또는 `structureSvg` |
