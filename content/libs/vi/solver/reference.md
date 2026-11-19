---
title: Tham chiếu API
description: "Mọi lớp, phương thức và đối số của @edubeam/fem 0.3, kèm đơn vị, giá trị mặc định và dạng dữ liệu mà mỗi phương thức trả về."
order: 16
group: Tham chiếu API
source: site
---

# Tham chiếu API {#api-reference}

Những gì `@edubeam/fem` 0.3 export, nhóm theo mục đích sử dụng. Mọi đơn vị đều theo SI: m, N, N·m, N/m, Pa, K và rad. Nhãn (`LabelType`) là `string | number`, lưu dưới dạng chuỗi. Các phương thức không có trong danh sách này là phương thức nội bộ: chúng là public trong TypeScript chỉ vì các lớp của chính bộ giải cần gọi đến chúng.

## Các export {#exports}

| Export | Loại | Mục |
| --- | --- | --- |
| `LinearStaticSolver` | lớp | [Phân tích](#analyses) |
| `Solver` | lớp trừu tượng | [Phân tích](#analyses) |
| `Domain` | lớp | [Domain](#domain) |
| `Node` | lớp | [Node](#node) |
| `Beam2D`, `Element` | lớp | [Phần tử](#elements) |
| `Material`, `CrossSection` | lớp | [Vật liệu và tiết diện](#materials-and-sections) |
| `LoadCase` | lớp | [Tải trọng](#loads) |
| `NodalLoad`, `BeamConcentratedLoad`, `BeamElementUniformEdgeLoad`, `BeamElementTrapezoidalEdgeLoad`, `BeamTemperatureLoad`, `PrescribedDisplacement`, `Load`, `BeamElementLoad` | lớp | [Tải trọng](#loads) |
| `DofID` | enum | [DofID](#dofid) |
| `LabelType`, `EnumDictionary`, `MaterialParameters`, `CrossSectionParameters` | kiểu | |

## Phân tích {#analyses}

### `LinearStaticSolver` {#linearstaticsolver}

```ts
const solver = new LinearStaticSolver()
```

| Thành viên | Kiểu | Mô tả |
| --- | --- | --- |
| `domain` | `Domain` | Mô hình |
| `loadCases` | `LoadCase[]` | Ban đầu có một trường hợp tải, `'DefaultLC'`. Thêm trường hợp bằng `new LoadCase(label, solver.domain)`: xem [Trường hợp tải](/vi/solver/load-cases). |
| `solve()` | `void` | Đánh số phương trình nếu cần, ghép và giải mọi trường hợp tải. Có thể ném lỗi khi gặp [hệ biến hình](/vi/solver/solving#when-solving-fails), nhưng không phải lúc nào cũng vậy. Không in gì từ bản 0.3.1; bản 0.3.0 ghi ra thời gian giải. |
| `codeNumberGenerated` | `boolean` | Đặt về `false` sau khi thêm hoặc xóa nút hay thanh, hoặc đổi gối tựa: [lý do](/vi/solver/solving#solving-again-after-a-change) |
| `neq`, `pneq` | `number` | Số bậc tự do không bị chặn và số bậc tự do bị chặn, sau khi giải |
| `k` | mathjs `Matrix` | Ma trận độ cứng tổng thể đã ghép, sau khi giải |
| `getNodeDofIDs(label)` | `number[]` | Các bậc tự do của một nút, sau khi giải |

`EigenValueDynamicSolver` có trong mã nguồn nhưng không được export.

## Domain {#domain}

`solver.domain` chứa mô hình trong bốn `Map` có khóa là nhãn dạng chuỗi: `nodes`, `elements`, `materials`, `crossSections`. Không có phương thức xóa: `domain.nodes.delete(label)` và `domain.elements.delete(label)` xóa một nút hoặc một thanh, sau đó cần [đánh số lại](/vi/solver/solving#solving-again-after-a-change).

| Phương thức | Trả về | Mô tả |
| --- | --- | --- |
| `createNode(label, coords?, bcs?)` | `Node` | `coords` là `[x, y, z]` tính bằng m (mặc định `[0, 0, 0]`), `bcs` là các `DofID` bị chặn (mặc định không có) |
| `createBeam2D(label, nodes, mat, cs, hinges?)` | `Beam2D` | `nodes` là `[first, second]`, `hinges` là `[atFirst, atSecond]` (mặc định `[false, false]`) |
| `createMaterial(label, params?)` | `Material` | Xem [Vật liệu và tiết diện](#materials-and-sections) |
| `createCrossSection(label, params?)` | `CrossSection` | Xem [Vật liệu và tiết diện](#materials-and-sections) |
| `getNode(label)`, `getElement(label)`, `getMaterial(label)`, `getCS(label)` | đối tượng tương ứng | Ném `RangeError` khi nhãn không tồn tại. `getElement` có kiểu `Element`: viết `as Beam2D` để đọc kết quả. |

Tạo đối tượng với một nhãn đã dùng sẽ thay thế đối tượng cũ.

## Node {#node}

| Thành viên | Kiểu | Mô tả |
| --- | --- | --- |
| `label` | `string` | |
| `coords` | `number[]` | `[x, y, z]`, m. Đổi giá trị này để di chuyển nút. |
| `bcs` | `Set<DofID>` | Các bậc tự do bị chặn. Thay tập này để đổi gối tựa. |
| `lcs` | `number[][] \| undefined` | Hệ trục đã xoay của nút, nếu có |
| `updateLcs({ locx, locy }?)` | `void` | Xoay hệ trục của nút: `locx` là trục x của nút theo các thành phần tổng thể, `locy` là `[0, 1, 0]`. Không có đối số thì đưa hệ trục về như cũ. |
| `hasLcs()` | `boolean` | Hệ trục có bị xoay hay không |
| `getUnknowns(lc, dofs)` | `Matrix`, hoặc `number` khi chỉ có một bậc tự do | Chuyển vị (m) và góc xoay (rad), theo hệ trục của nút |
| `getReactions(lc, global?)` | `{ dofs, values }` | Phản lực tại các bậc tự do bị chặn, theo thứ tự của `bcs`: N, N·m. `values` là `Matrix` của mathjs khi có nhiều phản lực, mảng một phần tử khi chỉ có một, `[]` với nút tự do. Với `global` là `true` trên nút đã xoay: cả ba bậc tự do theo hệ trục tổng thể, `dofs` là `[0, 2, 4]`, `values` là mảng có 0 ở những chỗ không bị chặn. [Cách đọc](/vi/solver/results#reactions). |

## Phần tử {#elements}

### `Beam2D` {#beam2d}

Dầm Timoshenko hai nút trong mặt phẳng x–z, mỗi nút có ba bậc tự do (`Dx`, `Dz`, `Ry`). `x` tính bằng mét kể từ nút thứ nhất; `n` là số đoạn chia, cho n + 1 điểm.

| Thành viên | Trả về | Mô tả |
| --- | --- | --- |
| `label`, `nodes`, `mat`, `cs` | `string`, `string[]`, `string`, `string` | |
| `hinges` | `[boolean, boolean]` | Giải phóng mô men tại nút thứ nhất và nút thứ hai |
| `computeNormalForceAt(lc, x)` | `number` | N, kéo là dương |
| `computeShearForceAt(lc, x)` | `number` | V, dương khi M tăng dọc theo trục x địa phương |
| `computeBendingMomentAt(lc, x)` | `number` | M, dương khi căng thớ phía +z địa phương |
| `computeNormalForce(lc, n)` | `{ x, N }` | N tại n + 1 điểm |
| `computeShearForce(lc, n)` | `{ x, V }` | V tại n + 1 điểm |
| `computeBendingMoment(lc, n)` | `{ x, M }` | M tại n + 1 điểm |
| `computeLocalDefl(lc, n)` | `{ u, w }` | Chuyển vị dọc và vuông góc với thanh, trong hệ trục địa phương, m |
| `computeGlobalDefl(lc, n)` | `{ u, w }` | Như trên, theo x và z tổng thể |
| `computeEndForces(lc)` | `Matrix` | `[X12, Z12, M12, X21, Z21, M21]`, lực mà các nút tác dụng lên thanh, trong hệ trục địa phương |
| `computeEndDisplacement(lc)` | `Matrix` | Chuyển vị đầu thanh trong hệ trục địa phương, kể cả góc xoay tại khớp |
| `computeGeo()` | `{ l, dx, dz }` | Chiều dài và các hình chiếu, m |
| `computeT()` | `Matrix` | Ma trận biến đổi 6 × 6, từ hệ trục tổng thể sang địa phương |
| `computeLocalStiffnessMtrx()` | `{ answer }` | `answer`: ma trận độ cứng địa phương 6 × 6, đã ngưng tụ bậc tự do tại khớp |
| `computeStiffness()` | `Matrix` | Ma trận độ cứng tổng thể 6 × 6 |
| `computeShearFactor()` | `number` | $\Phi = 12EI_y/kGAL^2$ |
| `getMaterial()`, `getCS()` | `Material`, `CrossSection` | |

Tại vị trí lực tập trung, các phương thức `…At` trả về giá trị ngay sau lực. `Element` là lớp cơ sở trừu tượng của `Beam2D`; đó là kiểu mà `domain.elements` và `getElement` dùng.

## Vật liệu và tiết diện {#materials-and-sections}

| `MaterialParameters` | Đơn vị | Mặc định | Dùng cho |
| --- | --- | --- | --- |
| `e` | Pa | 1 | độ cứng |
| `g` | Pa | 1 | độ cứng chống cắt |
| `alpha` | 1/K | 1 | tải nhiệt độ |
| `d` | kg/m³ | 1 | không dùng trong phân tích tĩnh |

| `CrossSectionParameters` | Đơn vị | Mặc định | Dùng cho |
| --- | --- | --- | --- |
| `a` | m² | không có, bắt buộc | độ cứng dọc trục và độ cứng chống cắt |
| `iy` | m⁴ | không có, bắt buộc | độ cứng chống uốn |
| `k` | – | không có, bắt buộc | độ cứng chống cắt $kGA$; `1e32` để bỏ qua biến dạng trượt |
| `h` | m | không có | chênh lệch nhiệt độ (thiếu thì ra `NaN`) |
| `iz`, `dyz`, `j` | m⁴ | không có | `Beam2D` không dùng |

Tham số vật liệu bị thiếu nhận giá trị 1, không phải giá trị điển hình; thiếu `a`, `iy` hoặc `k` thì mọi kết quả là `NaN`. Cả hai trường hợp đều không ném lỗi. Cả hai lớp đều có phương thức `change(params)` để đặt các tham số được truyền vào, và lưu các tham số thành thuộc tính cùng tên.

## Tải trọng {#loads}

### `LoadCase` {#loadcase}

| Phương thức | Trả về | Giá trị |
| --- | --- | --- |
| `createNodalLoad(node, values, lcs?)` | `NodalLoad` | `{ [DofID.Dx]: N, [DofID.Dz]: N, [DofID.Ry]: N·m }`; `lcs` (mặc định `false`): `true` nghĩa là theo hệ trục đã xoay của nút |
| `createBeamElementUniformEdgeLoad(el, [fx, fz], lcs)` | `BeamElementUniformEdgeLoad` | N/m trên toàn bộ thanh |
| `createBeamElementTrapezoidalEdgeLoad(el, [fx1, fz1], [fx2, fz2], lcs)` | `BeamElementTrapezoidalEdgeLoad` | N/m tại nút thứ nhất và nút thứ hai, tuyến tính ở giữa |
| `createBeamConcentratedLoad(el, [fx, fz, my, a], lcs)` | `BeamConcentratedLoad` | N, N, N·m, cách nút thứ nhất `a` m |
| `createBeamTemperatureLoad(el, [dTc, dTb, dTt])` | `BeamTemperatureLoad` | K: trọng tâm, thớ dưới, thớ trên |
| `createPrescribedDisplacement(node, values)` | `PrescribedDisplacement` | `{ [DofID.Dz]: m, … }` trên các bậc tự do bị chặn, theo hệ trục của nút; bị bỏ qua trên bậc tự do không bị chặn |

Với tải trên thanh, `lcs` là `true` nghĩa là hệ trục địa phương (x dọc thanh, z vuông góc với thanh), `false` là hệ trục tổng thể. Tải phân bố tính trên mỗi mét chiều dài thanh. Trang [Tải trọng](/vi/solver/loads) có ví dụ.

| Thành viên | Kiểu | Mô tả |
| --- | --- | --- |
| `label` | `string` | |
| `nodalLoadList` | `NodalLoad[]` | |
| `elementLoadList` | `BeamElementLoad[]` | Tải trên thanh và tải nhiệt độ |
| `prescribedBC` | `PrescribedDisplacement[]` | |
| `solved` | `boolean` | `true` sau khi giải thành công |
| `getElementLoadsOnElement(el)` | `BeamElementLoad[]` | Các tải trọng trên một thanh |

Các đối tượng tải trọng giữ giá trị trong những thuộc tính public mà bạn có thể đổi trước khi giải lại: `values` (và `lcs`) trên `NodalLoad`, `BeamElementUniformEdgeLoad`, `BeamConcentratedLoad` và `BeamTemperatureLoad`; `startValues` và `endValues` trên `BeamElementTrapezoidalEdgeLoad`; `prescribedValues` trên `PrescribedDisplacement`. Mỗi đối tượng có một `target`, là nhãn của nút hoặc thanh mà tải tác dụng lên.

## DofID {#dofid}

| Tên | Giá trị | `Beam2D` dùng |
| --- | --- | --- |
| `Dx` | 0 | có |
| `Dy` | 1 | không |
| `Dz` | 2 | có |
| `Rx` | 3 | không |
| `Ry` | 4 | có |
| `Rz` | 5 | không |

## Kết quả {#results}

Kết quả được đọc từ `Beam2D` (nội lực, độ võng, nội lực đầu phần tử) và từ `Node` (chuyển vị, phản lực), luôn cho một `LoadCase` cụ thể, sau `solve()`: xem hai bảng ở trên, và trang [Đọc kết quả](/vi/solver/results) để có ví dụ và quy ước dấu. Tóm tắt:

| Cần lấy | Lệnh gọi |
| --- | --- |
| Phản lực, N và N·m | `node.getReactions(lc)` |
| Chuyển vị, m, và góc xoay, rad | `node.getUnknowns(lc, [DofID.Dx, DofID.Dz, DofID.Ry])` |
| N, V hoặc M tại một điểm, N và N·m | `beam.computeNormalForceAt(lc, x)`, `computeShearForceAt`, `computeBendingMomentAt` |
| N, V hoặc M dọc theo thanh | `beam.computeNormalForce(lc, n)`, `computeShearForce`, `computeBendingMoment` |
| Đường đàn hồi, m | `beam.computeLocalDefl(lc, n)`, `computeGlobalDefl` |
| Nội lực đầu phần tử, N và N·m | `beam.computeEndForces(lc)` |
| Hình vẽ của tất cả các kết quả trên | `StructurePlot` hoặc `structureSvg` từ [@edubeam/plot](/vi/solver/drawing) |
