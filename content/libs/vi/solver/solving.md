---
title: Giải mô hình
description: "solve() trong @edubeam/fem làm gì, khi nào cần đánh số lại phương trình sau khi sửa mô hình, cách nhận biết hệ biến hình, và mô hình lớn đến đâu thì giải được."
order: 9
group: Giải và kết quả
source: site
---

# Giải mô hình {#solving}

```ts
solver.solve()
```

`solve()` đánh số các phương trình, ghép ma trận độ cứng tổng thể và véc tơ tải của mọi trường hợp tải, rồi giải ra chuyển vị và phản lực. Sau đó, mọi [kết quả](/vi/solver/results) đều đọc được; trước đó, đọc kết quả sẽ ném ra `TypeError`. Các bước này chính là các bước trong trang [EduBeam giải mô hình như thế nào](/vi/elements/analysis) của sổ tay lý thuyết.

Lời giải là chính xác đối với mô hình tuyến tính: đường đàn hồi và nội lực dọc theo mỗi thanh lấy từ nghiệm giải tích của dầm Timoshenko, nên không có lưới nào phải chia mịn và cũng không cần chia nhỏ thanh để có biểu đồ chính xác.

Từ phiên bản 0.3.1, `solve()` không in gì ra console; bản 0.3.0 in một dòng như `Solution took 9 [ms]` mỗi lần được gọi.

## Giải lại sau khi thay đổi {#solving-again-after-a-change}

Thay đổi các con số trong mô hình chỉ cần gọi lại `solve()`. Thay đổi bản thân hệ phương trình thì cần thêm một dòng trước đó:

```ts
domain.createNode('C', [10, 0, 0], [DofID.Dz])
domain.createBeam2D(2, ['B', 'C'], 1, 1)
solver.codeNumberGenerated = false // bậc tự do đã thay đổi: đánh số lại
solver.solve()
```

| Thay đổi | Sau đó |
| --- | --- |
| Giá trị tải trọng, thêm hoặc xóa tải trọng | `solve()` |
| Tọa độ nút, vật liệu, tiết diện, khớp | `solve()` |
| Thêm nút hoặc thanh | `codeNumberGenerated = false`, rồi `solve()` |
| Xóa nút hoặc thanh: `domain.nodes.delete(label)`, `domain.elements.delete(label)` | `codeNumberGenerated = false`, rồi `solve()` |
| Đổi gối tựa của nút, `node.bcs` | `codeNumberGenerated = false`, rồi `solve()` |

Quên dòng này sau khi thêm nút, `solve()` sẽ ném ra `TypeError`. Quên sau khi đổi gối tựa, nó **âm thầm** giải với gối tựa cũ. Khi không chắc, cứ đặt lại: đánh số gần như không tốn thời gian. Xóa một thanh cũng có nghĩa là phải xóa các tải trọng trên thanh đó khỏi `lc.elementLoadList`, nếu không `solve()` sẽ ném ra `RangeError` vì thiếu thanh.

Với nhiều biến thể của cùng một mô hình, chẳng hạn khi khảo sát tham số, tạo bộ giải mới cho mỗi biến thể đơn giản hơn mà nhanh không kém: xem [ví dụ đường ảnh hưởng](/vi/solver/scripts#an-influence-line-as-csv).

## Khi giải thất bại {#when-solving-fails}

Kết cấu có thể chuyển động mà không biến dạng, tức hệ biến hình, có ma trận độ cứng suy biến. Đôi khi `solve()` nhận ra điều đó và ném lỗi:

```text
Error: Linear system cannot be solved since matrix is singular
```

Nhưng thường thì không: sai số làm tròn khiến ma trận trông như giải được, và bạn nhận về chuyển vị cỡ $10^{12}$ m, hoặc những con số trông hợp lý cho một kết cấu đang tự do trượt. Chẳng hạn, dầm đặt trên hai gối di động vẫn giải bình thường mà không báo gì, miễn là không có lực nào đẩy nó theo phương ngang. Vì vậy hãy tự kiểm tra gối tựa, và coi chuyển vị cực lớn là dấu hiệu của hệ biến hình.

Nguyên nhân thường gặp:

- quá ít gối tựa, chẳng hạn dầm trên hai gối di động;
- gối tựa không giữ được kết cấu: tất cả song song, hoặc tất cả đồng quy tại một điểm;
- thừa một khớp, chẳng hạn ba khớp liên tiếp thẳng hàng;
- mô men tác dụng vào nút mà mọi đầu thanh tại đó đều có khớp.

Thông báo lỗi không cho biết vấn đề nằm ở đâu. Ứng dụng EduBeam kiểm tra hệ biến hình trước khi giải, tìm ra chuyển động đó và hiển thị nó dưới dạng hoạt họa; dựng lại cùng mô hình trong ứng dụng thường là cách nhanh nhất để thấy vấn đề. Trang [Khắc phục sự cố](/vi/reference/troubleshooting) liệt kê các nguyên nhân thường gặp.

Thiếu nút, vật liệu hay tiết diện sẽ ném ra `RangeError` kèm tên của đối tượng thiếu. Thiếu tham số tiết diện thì hoàn toàn không ném lỗi: mọi kết quả đều là `NaN`. Xem [Vật liệu và tiết diện](/vi/solver/materials-sections#cross-section).

## Kích thước mô hình {#model-size}

Bộ giải dùng ma trận đặc (dense), được thiết kế cho mô hình cỡ bài tập trên lớp. Trên một máy tính xách tay, trong Node, một dãy thanh thẳng hàng giải mất khoảng:

| Số thanh | Số bậc tự do | Thời gian |
| --- | --- | --- |
| 50 | 150 | 0,1 s |
| 100 | 300 | 0,2 s |
| 200 | 600 | 1 s |
| 400 | 1200 | 10 s |

Mỗi lần mô hình lớn gấp đôi, thời gian tăng từ sáu đến chín lần.

Mọi bài tập, khung và dàn trong môn Cơ học kết cấu đều nằm gọn trong giới hạn này. Thư viện không dành cho mô hình hàng nghìn thanh.

## Không có phân tích nào khác {#no-other-analyses}

Phiên bản này chỉ giải bài toán tĩnh tuyến tính. Mã nguồn có một bộ giải bài toán trị riêng để tính tần số dao động riêng, nhưng nó không nằm trong gói đã phát hành: không thể import `EigenValueDynamicSolver` từ `@edubeam/fem`.
