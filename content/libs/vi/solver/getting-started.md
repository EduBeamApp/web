---
title: Bắt đầu
description: "Cài đặt @edubeam/fem, bộ giải phần tử hữu hạn của EduBeam, rồi giải, kiểm tra và đọc kết quả một dầm đơn giản chỉ với khoảng chục dòng TypeScript."
order: 1
group: Giới thiệu
source: site
---

# Bắt đầu {#getting-started}

@edubeam/fem là bộ giải phần tử hữu hạn đứng sau [EduBeam]{.edubeam}: mọi biểu đồ, phản lực và độ võng mà ứng dụng hiển thị đều do nó tính. Bạn có thể dùng nó để giải dầm, khung và dàn phẳng ngay từ mã của mình, trong trình duyệt hoặc trong Node: tạo bài tập kèm đáp số, chấm bài tập về nhà, chạy khảo sát tham số, hay đặt một bộ giải phía sau trang web.

::div{.actions}
[Giải dầm đầu tiên](#a-simply-supported-beam) [Xem các ví dụ hoàn chỉnh](/vi/solver/beams)
::

Thư viện được viết bằng TypeScript, có sẵn định nghĩa kiểu và là phần mềm tự do theo giấy phép GPL-3.0. Tác giả là Bořek Patzák; thư viện được phát triển cùng Jan Voříšek và những người đóng góp khác.

## Cài đặt {#install}

```bash
npm install @edubeam/fem
```

Thư viện dùng được với cả `import` lẫn `require`, trong trình duyệt và trong Node 18 trở lên, và chỉ phụ thuộc vào một gói: [mathjs](https://mathjs.org). Trước phiên bản 0.3.0, nó được cài từ GitHub dưới tên `ts-fem`: nếu bạn từng dùng tên đó, chỉ cần đổi các lệnh import sang `@edubeam/fem`. Ngoài ra không có gì thay đổi.

Để chạy thử ví dụ bên dưới trong một thư mục trống, hãy biến thư mục đó thành một dự án dùng `import`, rồi cài đặt:

```bash
npm init -y
npm pkg set type=module
npm install @edubeam/fem
```

Nếu `package.json` không có `"type": "module"`, ví dụ vẫn chạy, nhưng Node sẽ in một cảnh báo trước.

## Dầm đầu tiên {#a-simply-supported-beam}

Một dầm thép IPE 200 dài 6 m, đặt trên một gối cố định và một gối di động, chịu tải phân bố đều 12 kN/m:

```ts [beam.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver

// Mọi đại lượng theo đơn vị SI: m, N, Pa. Thép và tiết diện IPE 200.
domain.createMaterial('steel', { e: 210e9, g: 81e9 })
domain.createCrossSection('IPE200', { a: 28.5e-4, iy: 1943e-8, k: 5 / 6 })

// Nút tại [x, y, z] tính bằng mét, kèm các bậc tự do mà gối tựa chặn
domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]) // gối cố định
domain.createNode('B', [6, 0, 0], [DofID.Dz]) // gối di động
const beam = domain.createBeam2D(1, ['A', 'B'], 'steel', 'IPE200')

// 12 kN/m theo trục z địa phương của thanh: hướng xuống với dầm vẽ từ trái sang phải
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad(1, [0, 12e3], true)

solver.solve()

console.log(beam.computeBendingMomentAt(lc, 3)) // N·m, giữa nhịp
console.log(beam.computeShearForceAt(lc, 0)) // N, tại A
console.log(beam.computeLocalDefl(lc, 2).w[1]) // m, giữa nhịp
```

Lưu tệp thành `beam.ts` và chạy `node beam.ts`: từ Node 22.18 trở đi, Node chạy thẳng tệp TypeScript. Tệp này không có chú thích kiểu nào, nên với Node cũ hơn, bạn chỉ cần lưu nó thành `beam.mjs`. Chương trình in ra:

```text [Đầu ra]
54000
36000
0.04990940552616746
```

Đó chính là các giá trị trong giáo trình, $M = qL^2/8 = 54$ kNm và $V = qL/2 = 36$ kN. Dưới đây là cùng dầm đó, do chính bộ giải này tính ngay trong trình duyệt của bạn:

::model-figure{caption="Dầm ở trên: 6 m, IPE 200, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
material: { e: 210e9, g: 81e9 }
section: { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 0.8333333 }
---
::

Độ võng 49,91 mm lớn hơn giá trị Euler–Bernoulli $5qL^4/384EI = 49{,}63$ mm đúng 0,28 mm. Đây không phải lỗi: thanh là dầm Timoshenko, và 0,28 mm chính là $qL^2/8kGA$, phần độ võng do biến dạng trượt của dầm này. Đặt `k` thật lớn, chẳng hạn `1e32`, phần này sẽ biến mất: xem [Biến dạng trượt](/vi/solver/materials-sections#shear-deformation).

## Đoạn mã làm gì {#what-the-code-does}

::div{.steps}
### Tạo bộ giải {#make-a-solver}

`new LinearStaticSolver()` tạo sẵn một `domain` trống để chứa mô hình, và một trường hợp tải, `solver.loadCases[0]`.

### Mô tả mô hình {#describe-the-model}

Vật liệu và tiết diện, các nút cùng gối tựa của chúng, rồi đến các thanh nối giữa các nút. Mỗi đối tượng có một nhãn (label), là chuỗi hoặc số, và phần còn lại của mô hình tham chiếu đến nó qua nhãn này. Xem [Nút và gối tựa](/vi/solver/nodes-supports), [Vật liệu và tiết diện](/vi/solver/materials-sections) và [Thanh và khớp](/vi/solver/members-hinges).

### Đặt tải {#load-it}

Tải trọng thuộc về một trường hợp tải: lực tại nút, tải trọng trên thanh, nhiệt độ và lún gối tựa. Xem [Tải trọng](/vi/solver/loads).

### Giải {#solve}

`solver.solve()` ghép ma trận và giải mọi trường hợp tải. Xem [Giải mô hình](/vi/solver/solving).

### Đọc kết quả {#read-the-results}

Nội lực tại bất kỳ điểm nào trên thanh, độ võng, nội lực đầu phần tử, chuyển vị nút và phản lực. Xem [Đọc kết quả](/vi/solver/results), và [Vẽ kết quả](/vi/solver/drawing) nếu cần biểu đồ.
::

## Tóm tắt đơn vị và dấu {#axes-and-signs}

Đầu vào theo SI thì đầu ra cũng theo SI. Mô hình nằm trong mặt phẳng x–z với **trục z hướng xuống**, nên `fz` dương đẩy xuống và đỉnh một cột cao 4 m nằm tại $z = -4$. Vị trí dọc theo thanh tính bằng mét kể từ nút thứ nhất của thanh. Mô men căng thớ dưới là dương. Danh sách đầy đủ có ở trang [Đơn vị và quy ước dấu](/vi/solver/conventions).

## Sáu điểm dễ nhầm {#pitfalls}

1. **Trục z hướng xuống.** Tải trọng trọng lực mang dấu dương, và mọi điểm cao hơn gối tựa có z âm. Xem [Hệ trục](/vi/solver/conventions#axes).
2. **Chiều của thanh quyết định dấu của M và w.** Khai báo dầm từ trái sang phải và cột từ dưới lên trên, khi đó dấu sẽ giống trong giáo trình. Xem [Chiều của thanh](/vi/solver/conventions#member-direction).
3. **Thiếu tham số sẽ cho `NaN` hoặc kết quả vô nghĩa, không báo lỗi.** Tiết diện cần `a`, `iy` và `k`; vật liệu cần `e`, và cả `g` trừ khi `k` rất lớn. Xem [Vật liệu và tiết diện](/vi/solver/materials-sections).
4. **Sau khi thêm nút, thêm thanh hoặc đổi gối tựa,** hãy đặt `solver.codeNumberGenerated = false` trước khi giải lại. Xem [Giải lại sau khi thay đổi](/vi/solver/solving#solving-again-after-a-change).
5. **Phản lực trả về dưới dạng ma trận mathjs hoặc mảng,** theo thứ tự đã khai báo các bậc tự do của gối tựa. Xem [Phản lực](/vi/solver/results#reactions).
6. **Hệ biến hình không phải lúc nào cũng gây lỗi.** Chuyển vị cỡ $10^{12}$ m nghĩa là kết cấu có thể chuyển động tự do. Xem [Khi giải thất bại](/vi/solver/solving#when-solving-fails).

## Tiếp theo {#next}

::card-grid{cols="2"}
:::card{title="Ví dụ hoàn chỉnh" icon="lucide:book-open" to="/vi/solver/beams"}
Chương trình hoàn chỉnh, đã kiểm tra: dầm, khung, dàn, phiếu bài tập kèm đáp án, một máy chủ HTTP nhỏ.
:::
:::card{title="Vẽ kết quả" icon="lucide:chart-spline" to="/vi/solver/drawing"}
Chuyển mô hình đã giải cho @edubeam/plot và nhận biểu đồ dạng SVG, trong Vue hoặc từ một script Node.
:::
:::card{title="Tham chiếu API" icon="lucide:list-tree" to="/vi/solver/reference"}
Mọi lớp, phương thức và đối số, kèm đơn vị và giá trị trả về.
:::
:::card{title="Lý thuyết" icon="lucide:sigma" to="/vi/elements/beam"}
Phần tử dầm, ma trận độ cứng và ma trận biến đổi của nó, trong sổ tay lý thuyết của EduBeam.
:::
::
