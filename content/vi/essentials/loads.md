---
description: "Lực, mô men, lún gối tựa, tải phân bố đều, hình thang, tập trung và nhiệt độ trong EduBeam, kèm quy ước dấu: z dương hướng xuống, mô men dương ngược chiều kim đồng hồ."
source: site
---

# Tải trọng

Tải trọng tác dụng tại nút hoặc dọc theo phần tử. Tất cả đều thuộc về **một trường hợp tải duy nhất** và tác dụng đồng thời; để so sánh các phương án, hãy lưu mỗi phương án thành một [tệp dự án hoặc liên kết chia sẻ](/vi/essentials/import-export).

| Tải trọng | Tác dụng lên | Thêm từ |
| --- | --- | --- |
| [Lực hoặc mô men](#nodal-loads) | một nút | thẻ *Tải trọng* → **Thêm tải nút**, hoặc nhấp vào nút → **Thêm tải trọng** |
| [Chuyển vị cưỡng bức](#prescribed-displacements-support-settlements) (lún gối tựa) | một nút có gối tựa | cùng hộp thoại đó, hoặc nhấp vào nút → **Chuyển vị cưỡng bức** |
| [Tải phân bố đều](#uniformly-distributed-load), [tải hình thang](#trapezoidal-load), [tải tập trung](#concentrated-load) hoặc [tải nhiệt độ](#temperature-load) | một phần tử | thẻ *Tải trọng* → **Thêm tải phần tử**, hoặc nhấp vào phần tử → **Thêm tải trọng** |

## Quy ước dấu {#sign-convention-in-one-line}

Trục x hướng **sang phải**, trục z hướng **xuống dưới**, và mô men dương khi quay **ngược chiều kim đồng hồ**. Vì vậy `Fz` hoặc `fz` dương là tải hướng xuống, giống trọng lực, còn tải hướng lên mang dấu âm.

::model-figure{caption="Mọi tải trọng ở đây đều dương: Fx = +10 kN sang phải, Fz = +10 kN hướng xuống, My = +10 kNm ngược chiều kim đồng hồ"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| Chiều dương | Hệ trục mặc định (z hướng xuống) | [Hệ trục y hướng lên](/vi/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Lực ngang `Fx`, `fx` | sang phải | sang phải |
| Lực đứng | `Fz`, `fz`: **hướng xuống** | `Fy`, `fy`: **hướng lên** |
| Mô men | `My`: ngược chiều kim đồng hồ | `Mz`: ngược chiều kim đồng hồ |
| Lún theo phương đứng | `Dz`: hướng xuống | `Dy`: hướng lên |

Tải trọng theo **hệ trục địa phương** của phần tử (khi đánh dấu LCS) thì đi theo phần tử: trục x địa phương hướng từ nút đầu đến nút cuối, còn trục z địa phương là trục x địa phương xoay 90° theo chiều kim đồng hồ, về phía nét đứt vẽ dọc phần tử. Xem [Chiều phần tử](/vi/essentials/elements#element-direction). Quy ước đầy đủ, kể cả cho nội lực, có ở trang [Hệ tọa độ và quy ước dấu](/vi/elements/conventions#loads).

## Tải trọng nút {#nodal-loads}

Thẻ *Tải trọng* → **Thêm tải nút**, hoặc nhấp vào một nút → **Thêm tải trọng**, và giữ nguyên lựa chọn **Lực/Mô men**. Nhập các lực `Fx`, `Fz` (kN) và mô men `My` (kNm), với dấu theo quy ước [ở trên](#sign-convention-in-one-line); hình xem trước vẽ tải trọng ngay khi bạn gõ.

![Thêm tải nút: hình xem trước cho thấy chiều tải ngay khi bạn gõ](/screenshots/vi/loads-nodal.webp){.shot-md}

- Các thành phần tính theo hệ trục **tổng thể**. Ở nút có hệ trục đã xoay ([gối tựa xiên](/vi/essentials/nodes-supports#inclined-skewed-supports)), hộp thoại có thêm công tắc **Trục tổng thể** / **Trục nút**. Khi chọn trục nút, các thành phần (ghi là `Fx′` và `Fz′`) tác dụng theo trục riêng của nút và xoay theo trục nếu sau này bạn đổi góc. Khi bạn chuyển công tắc, các con số được tính lại để tải trọng thực tế không thay đổi.
- Một nút có thể chịu nhiều tải trọng nút; chúng được cộng dồn.

### Chuyển vị cưỡng bức (lún gối tựa) {#prescribed-displacements-support-settlements}

Để dời một gối tựa đi một khoảng cho trước, chọn **Chuyển vị cưỡng bức** trong cùng hộp thoại, hoặc nhấp vào một nút có gối tựa → **Chuyển vị cưỡng bức**. Nhập các chuyển vị `Dx`, `Dz` (dương sang phải và hướng xuống, theo [đơn vị chuyển vị](/vi/essentials/units-settings#units), mặc định là m) và góc xoay `Ry` (rad, dương ngược chiều kim đồng hồ).

- Chỉ nhập được cho các bậc tự do **bị chặn**: các ô còn lại bị mờ đi, và nút không có gối tựa thì không thể có chuyển vị cưỡng bức.
- Mỗi nút có tối đa một chuyển vị cưỡng bức. Muốn đổi, hãy sửa chuyển vị đó, đừng thêm chuyển vị thứ hai.
- Ở gối tựa xiên, các ô ghi là `Dx′` và `Dz′`: chuyển vị cưỡng bức tác dụng theo các trục riêng của gối tựa.

Lún gối tựa có gây nội lực hay không là tùy kết cấu. Cùng một độ lún 10 mm của gối B, không có tải trọng nào khác:

::div{.shots}

:::model-figure{caption="Dầm đơn giản: dầm chỉ nghiêng đi; không có phản lực, M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Dầm liên tục qua B: dầm bị uốn, M = 21,06 kNm trên gối B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

Hệ tĩnh định đi theo gối tựa mà không có gì cản trở. Dầm liên tục thì phải uốn: gối B kéo dầm xuống một đoạn $\delta = 10\ \text{mm}$, giống như một lực tập trung đặt giữa nhịp của dầm đơn giản dài 10 m. Với $L = 5\ \text{m}$ và $EI = 17\,548\ \text{kNm}^2$ của thép trong ví dụ, lực đó bằng $P = 6EI\delta/L^3 = 8{,}423\ \text{kN}$, chính là phản lực tại B, và $M_B = PL/2 = 3EI\delta/L^2 = 21{,}06\ \text{kNm}$. Bài [Hướng dẫn: dầm liên tục và lún gối tựa](/vi/tutorials/continuous-beam) xét lún gối tựa cùng với tải trọng.

## Tải trọng phần tử {#element-loads}

Thẻ *Tải trọng* → **Thêm tải phần tử**, hoặc nhấp vào một phần tử → **Thêm tải trọng**. Chọn **Loại tải trọng**; hình xem trước vẽ tải trọng trên phần tử ngay khi bạn gõ. Lực tính bằng kN và tải phân bố bằng kN/m, hoặc theo [đơn vị](/vi/essentials/units-settings#units) bạn đã chọn.

![Thêm tải phần tử, với tải phân bố đều](/screenshots/vi/loads-udl.webp){.shot-md}

### Tải phân bố đều {#uniformly-distributed-load}

Tải không đổi trên một đơn vị chiều dài, `fx` và `fz`, trên toàn bộ phần tử. Khi đánh dấu **LCS** (mặc định), chúng tác dụng theo hệ trục địa phương của phần tử; khi bỏ đánh dấu, theo hệ trục tổng thể. Với phần tử nằm ngang vẽ từ trái sang phải, hai cách cho kết quả như nhau; với thanh xiên thì không:

| Bạn cần | Nhập |
| --- | --- |
| tải **vuông góc** với thanh (gió tác dụng lên mái dốc) | `fz` với LCS **được đánh dấu** |
| tải **thẳng đứng** trên mỗi mét chiều dài thanh (trọng lượng bản thân) | `fz` với LCS **bỏ đánh dấu** |
| tải **thẳng đứng** trên mỗi mét hình chiếu ngang (tải tuyết) | không nhập trực tiếp được: nhân với $\cos\alpha$, với $\alpha$ là góc nghiêng của thanh, rồi nhập như tải thẳng đứng |

Cùng tải 10 kN/m trên một kèo mái dài 5 m, vươn ngang 4 m và cao 3 m:

::div{.shots}

:::model-figure{caption="Bỏ đánh dấu LCS: tải thẳng đứng, tổng cộng 50 kN; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="Đánh dấu LCS: tải vuông góc với thanh; M = 31,25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

Tính tay: tải vuông góc cho $M = qL^2/8 = 10 \cdot 5^2/8 = 31{,}25\ \text{kNm}$; tải thẳng đứng tổng cộng 50 kN rải trên 4 m nhịp, tức 12,5 kN/m theo hình chiếu ngang, nên $M = 12{,}5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Tải hình thang {#trapezoidal-load}

Tải thay đổi tuyến tính dọc phần tử: `f1x`, `f1z` tại nút **đầu**, `f2x`, `f2z` tại nút **cuối**. Cho một đầu bằng 0 để có tải tam giác.

::model-figure{caption="Tải tam giác từ 0 đến 10 kN/m: phản lực 10 và 20 kN, M lớn nhất = 23,09 kNm tại 3,46 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

Tính tay: hợp lực $qL/2 = 30\ \text{kN}$ đặt tại $2L/3$, nên $R_A = 10\ \text{kN}$ và $R_B = 20\ \text{kN}$; lực cắt bằng 0 và mô men đạt cực đại tại $x = L/\sqrt{3} = 3{,}46\ \text{m}$, với $M = qL^2/(9\sqrt{3}) = 23{,}09\ \text{kNm}$.

Tải hình thang tác dụng theo **hệ trục địa phương** của phần tử (ô LCS bị khóa). Với phần tử nằm ngang vẽ từ trái sang phải, hệ trục địa phương trùng với hệ tổng thể; với phần tử xiên, `f1z` và `f2z` vuông góc với thanh, còn `f1x`, `f2x` dọc theo thanh.

Tải **thẳng đứng** thay đổi trên thanh có góc nghiêng $\alpha$ vẫn nhập chính xác được: nhập hai thành phần địa phương ở mỗi đầu, $f_z = q\cos\alpha$ và $f_x = q\sin\alpha$ hướng xuống dốc, tức mang dấu âm khi phần tử đi lên dốc từ nút đầu. Với kèo mái ở trên, vươn ngang 4 m, cao 3 m và vẽ từ chân lên, tải thẳng đứng tăng từ 0 đến 10 kN/m chiều dài thanh là `f1x` = `f1z` = 0, `f2x` = −6 và `f2z` = 8 kN/m.

::model-figure{caption="Tải thẳng đứng từ 0 đến 10 kN/m chiều dài thanh, nhập theo thành phần địa phương: phản lực 8,333 và 16,67 kN, M lớn nhất = 12,83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

Tính tay: hợp lực 25 kN đặt tại hai phần ba nhịp tính theo phương ngang, tức cách A 2,67 m, nên $R_B = 25 \cdot 2{,}667/4 = 16{,}67\ \text{kN}$. Trên hình chiếu 4 m, tải là một tam giác tăng đến 12,5 kN/m, nên giống như trên, $M = 12{,}5 \cdot 4^2/(9\sqrt{3}) = 12{,}83\ \text{kNm}$.

### Tải tập trung {#concentrated-load}

Lực tập trung `Fx`, `Fz` hoặc mô men `My` đặt ở bất kỳ vị trí nào **dọc theo** phần tử, không cần thêm nút. **Vị trí tải tính từ nút đầu** là khoảng cách $a$ từ nút đầu, $0 \le a \le L$. Giá trị ban đầu là nửa chiều dài làm tròn xuống số mét nguyên, tối đa 5 m (với đơn vị Mỹ: số feet nguyên, tối đa 15 ft), nên hãy đặt lại cho đúng vị trí tải của bạn. **LCS** có tác dụng như với tải phân bố đều.

::model-figure{caption="20 kN tại 2 m trên nhịp 6 m: V nhảy từ 13,33 xuống −6,667 kN, M = 26,67 kNm dưới điểm đặt tải"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

Biểu đồ lực cắt có bước nhảy bằng `Fz` tại điểm đặt tải, còn biểu đồ mô men có điểm gãy tại đó: $R_A = 20 \cdot 4/6 = 13{,}33\ \text{kN}$, $M = 13{,}33 \cdot 2 = 26{,}67\ \text{kNm}$. Mô men tập trung `My` thì làm biểu đồ mô men có bước nhảy.

### Tải nhiệt độ {#temperature-load}

| Thông số | Ý nghĩa | Tác dụng |
| --- | --- | --- |
| **ΔT<sub>c</sub>**, thay đổi nhiệt độ dọc trục | thay đổi như nhau trên toàn tiết diện | dãn dài $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | thay đổi ở thớ dưới trừ thay đổi ở thớ trên | độ cong $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Cả hai đều là *độ thay đổi* nhiệt độ so với trạng thái không ứng suất, mặc định tính bằng °C; thay đổi 1 °C bằng 1 K. Tải nhiệt độ dùng **α** của vật liệu và **chiều cao h** của tiết diện. Thớ **dưới** nằm ở phía nét đứt. ΔT<sub>b</sub> − ΔT<sub>t</sub> dương (thớ dưới nóng hơn) làm thớ dưới dãn dài, nên phần tử võng xuống như dầm chịu trọng lực.

Trong hệ tĩnh định, nhiệt độ chỉ gây chuyển vị. Khi biến dạng bị cản trở (đầu ngàm, dầm liên tục, liên kết thừa), nhiệt độ gây ra nội lực. Cùng một dầm thép dài 6 m, cao 0,3 m, thớ dưới nóng hơn thớ trên 20 K:

::div{.shots}

:::model-figure{caption="Dầm đơn giản: võng 3,6 mm ở giữa nhịp, M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="Dầm hai đầu ngàm: dầm vẫn thẳng, M = −14,04 kNm trên suốt chiều dài"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

Tính tay: độ cong tự do là $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0{,}3 = 8 \times 10^{-4}\ \text{1/m}$. Dầm đơn giản được tự do cong theo độ cong ấy và võng $\kappa L^2/8 = 3{,}6\ \text{mm}$. Với hai đầu ngàm, một mô men không đổi phải triệt tiêu độ cong đó: $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14{,}04\ \text{kNm}$. Trang [Kiểm tra kết quả bằng tính tay](/vi/guide/verification#temperature-gradient-on-a-simply-supported-beam) trình bày thêm một trường hợp khác.

## Sửa và xóa tải trọng {#editing-and-removing-loads}

| Muốn | Thao tác |
| --- | --- |
| Đổi giá trị nhanh | Sửa các thành phần (và ô LCS) ngay tại chỗ trong thẻ *Tải trọng*. |
| Mở hộp thoại sửa | Nhấp đúp vào tải trọng trong vùng hiển thị, hoặc nhấp vào nó → **Sửa tải trọng**. Tải trọng cũng hiện dưới dạng nhãn trong các bảng *Nút* và *Phần tử*; nhấp vào nhãn để sửa. |
| Xóa | Chọn tải trọng rồi nhấn <kbd>Delete</kbd>, nhấp vào nó → **Xóa**, hoặc dùng dấu × trong thẻ *Tải trọng*. |

Tải trọng thuộc về nút hoặc phần tử của nó: xóa nút hay phần tử thì tải trọng bị xóa theo, còn sao chép nút hay phần tử khi đang chọn cả tải trọng thì tải trọng cũng được sao chép.

![Thẻ Tải trọng: mỗi tải trọng một hàng, các thành phần sửa được ngay tại chỗ](/screenshots/vi/loads-table.webp)

## Những gì chưa có {#what-is-not-available}

::div{.limits}
- **Một trường hợp tải.** Không có tổ hợp tải trọng: hãy lưu mỗi trường hợp thành một tệp hoặc liên kết riêng.
- **Không có trọng lượng bản thân.** Hãy nhập nó như tải phân bố đều, bỏ đánh dấu LCS: $f_z = \rho\,g\,A$, ví dụ $\approx 0{,}22\ \text{kN/m}$ với IPE 200.
- **Tải hình thang chỉ theo hệ trục địa phương.** Với tải thẳng đứng thay đổi trên thanh xiên, hãy nhập các [thành phần địa phương](#trapezoidal-load) của nó.
- **Không có tải phân bố trên một phần thanh.** Tải phân bố phủ toàn bộ phần tử: hãy thêm nút ở chỗ tải bắt đầu hoặc kết thúc.
::
