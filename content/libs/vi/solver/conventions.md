---
title: Đơn vị và quy ước dấu
description: "Đơn vị, hệ trục, bậc tự do và quy ước dấu của @edubeam/fem, và vì sao chiều của thanh làm đổi dấu kết quả."
order: 2
source: site
---

# Đơn vị và quy ước dấu {#units-and-signs}

Bộ giải không có hệ đơn vị riêng: nó tính với đúng những con số bạn đưa vào. Nhập theo SI thì mọi kết quả cũng ra theo SI. Các ví dụ trên những trang này, cũng như ứng dụng EduBeam, luôn dùng SI. Quy ước dấu cũng giống ứng dụng; sổ tay lý thuyết giải thích chúng kèm hình vẽ ở trang [Hệ tọa độ và quy ước dấu](/vi/elements/conventions).

## Đơn vị {#units}

| Đại lượng | Đơn vị | Ví dụ |
| --- | --- | --- |
| Tọa độ, chiều dài, vị trí dọc theo thanh | m | `[6, 0, 0]` |
| Lực | N | `20e3` là 20 kN |
| Mô men | N·m | `10e3` là 10 kNm |
| Tải phân bố | N/m | `12e3` là 12 kN/m |
| Mô đun đàn hồi và mô đun trượt | Pa | `210e9` |
| Diện tích | m² | `28.5e-4` là 28,5 cm² |
| Mô men quán tính | m⁴ | `1943e-8` là 1943 cm⁴ |
| Thay đổi nhiệt độ | K | `20` |
| Hệ số dãn dài do nhiệt | 1/K | `12e-6` |
| Chuyển vị, góc xoay | m, rad | `0.01` là 10 mm |

Bộ đơn vị nào cũng dùng được, miễn là nhất quán, chẳng hạn kN, m và kPa; khi đó kết quả ra kN và kNm. Dùng SI thì bạn khỏi phải kiểm tra lại.

## Hệ trục {#axes}

- **x** hướng sang phải, **z hướng xuống**, và mô hình nằm trong mặt phẳng x–z. Tọa độ viết dạng `[x, y, z]`, với `y = 0`.
- **y** hướng về phía bạn, ra khỏi màn hình. Góc xoay và mô men đều lấy quanh trục y, nên giá trị dương là **ngược chiều kim đồng hồ** trên màn hình.
- **Trục x địa phương** của thanh chạy từ nút thứ nhất đến nút thứ hai. **Trục z địa phương** là trục x địa phương quay 90° theo chiều kim đồng hồ trên màn hình: với thanh vẽ từ trái sang phải, nó hướng xuống.

Vì z hướng xuống, tải trọng trọng lực là `fz` dương, và đỉnh một cột cao 4 m đứng tại $z = 0$ nằm ở $z = -4$.

## Bậc tự do {#degrees-of-freedom}

Mỗi nút của mô hình `Beam2D` có ba bậc tự do, đặt tên theo enum `DofID`:

| `DofID` | Giá trị | Ý nghĩa |
| --- | --- | --- |
| `DofID.Dx` | 0 | Chuyển vị theo x |
| `DofID.Dz` | 2 | Chuyển vị theo z, hướng xuống |
| `DofID.Ry` | 4 | Góc xoay quanh y, ngược chiều kim đồng hồ |

`Dy`, `Rx` và `Rz` (1, 3, 5) có trong enum nhưng thanh phẳng không dùng đến.

## Dấu của kết quả {#signs-of-the-results}

| Kết quả | Dương nghĩa là | Đọc bằng |
| --- | --- | --- |
| Lực dọc N | kéo | `computeNormalForceAt` |
| Mô men uốn M | căng thớ phía +z địa phương: căng thớ dưới, với dầm vẽ từ trái sang phải | `computeBendingMomentAt` |
| Lực cắt V | M tăng dọc theo trục x địa phương, $V = dM/dx$; với dầm vẽ từ trái sang phải, lực cắt dương làm phân tố quay theo chiều kim đồng hồ: $+qL/2$ tại gối trái của dầm đơn giản | `computeShearForceAt` |
| Độ võng w | theo chiều +z địa phương: hướng xuống, với dầm vẽ từ trái sang phải | `computeLocalDefl` |
| Chuyển vị nút | theo +x, +z (xuống), ngược chiều kim đồng hồ | `node.getUnknowns` |
| Phản lực | lực mà gối tựa tác dụng lên kết cấu, theo +x, +z (xuống), ngược chiều kim đồng hồ | `node.getReactions` |
| Nội lực đầu phần tử | lực mà các nút tác dụng lên thanh, trong hệ trục địa phương của thanh | `computeEndForces` |

Vì vậy, gối cố định của một dầm chịu tải hướng xuống báo phản lực −36 000 N theo z: tức là 36 kN đẩy lên.

## Vị trí dọc theo thanh {#positions-along-a-member}

Mọi phương thức `…At(lc, x)` nhận `x` tính bằng mét kể từ nút thứ nhất của thanh, không phải tỷ lệ so với chiều dài thanh. Lực tập trung trên thanh cũng được định vị theo cách này.

## Chiều của thanh {#member-direction}

M và w được đo trong hệ trục riêng của thanh, nên thứ tự hai nút của thanh có ý nghĩa. Lấy dầm 12 kN/m ở trang [Bắt đầu](/vi/solver/getting-started), khai báo theo cả hai chiều, với tải trong hệ trục tổng thể, `[0, 12e3], false`, để cả hai lần tải đều đẩy xuống, rồi đọc bằng `computeBendingMomentAt(lc, 3)`, `computeLocalDefl(lc, 2).w[1]` và `computeShearForceAt`:

| Thanh | M giữa nhịp | w giữa nhịp | V tại A |
| --- | --- | --- | --- |
| `['A', 'B']`, trái sang phải | +54 000 N·m | +0,0499 m | +36 000 N, tại `x = 0` |
| `['B', 'A']`, phải sang trái | −54 000 N·m | −0,0499 m | +36 000 N, tại `x = 6` |

Khi khai báo từ phải sang trái, trục z địa phương hướng lên, nên cùng một dầm căng thớ dưới lại báo mô men âm và độ võng hướng lên. N và V giữ nguyên dấu tại mọi điểm của dầm; chỉ có `x` được tính từ đầu kia. Tải cho trong hệ trục địa phương (`true`) quay theo thanh: với dầm khai báo từ phải sang trái, `[0, 12e3], true` đẩy lên.

::callout{type="tip" title="Khai báo thanh theo đúng cách bạn vẽ"}
Dầm từ trái sang phải, cột từ dưới lên trên, khi đó dấu sẽ giống trong giáo trình. Với cột khai báo từ dưới lên, trục z địa phương hướng sang phải, nên mô men căng thớ bên phải là dương. [Ví dụ khung](/vi/solver/frames#things-to-notice) minh họa điều này.
::
