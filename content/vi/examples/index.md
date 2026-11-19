---
description: "Sáu dầm, khung và dàn đã giải, mở trong EduBeam chỉ với một cú nhấp, mỗi ví dụ kèm bài tập, điểm cần chú ý và đáp số để kiểm tra kết quả tính tay."
source: site
---

# Ví dụ

Mỗi thẻ dưới đây là một mô hình đã giải sẵn và tương tác được. Nhấp vào một thẻ để mở nó trong [EduBeam]{.edubeam}, sẵn sàng để chỉnh sửa: kéo một nút, đổi một tải trọng hay đánh dấu một khớp và xem các biểu đồ thay đổi theo. Phần bài tập bên dưới biến mỗi mô hình thành một bài nhỏ, kèm đáp số để bạn đối chiếu với kết quả tính tay.

::feature-structures
::

Các mô hình này cũng có trong ứng dụng tại **☰ → Ví dụ**, và liên kết [run.edubeam.app/?panel=examples&lang=vi](https://run.edubeam.app/?panel=examples&lang=vi){target="_blank"} mở thẳng danh sách ví dụ đó.

::callout{type="info" title="Cùng một loại thanh cho cả sáu ví dụ"}
Mọi ví dụ đều dùng cùng một thanh thép: $E = 210$ GPa, $I_y = 8356\ \text{cm}^4$ (nên $EI = 17\,548$ kNm²), diện tích $1\ \text{m}^2$ và độ cứng chống cắt lớn đến mức biến dạng dọc trục và biến dạng trượt có thể bỏ qua. Vì vậy các công thức trong giáo trình cho dầm mảnh trùng với kết quả của ứng dụng đến từng chữ số hiển thị. Chiều cao tiết diện là $1$ m, chỉ có ý nghĩa với tải nhiệt độ.
::

## Gợi ý bài tập {#suggested-exercises}

Hãy tính tay trước, rồi kiểm tra trong ứng dụng: mở mô hình từ thẻ của nó ở trên hoặc nhấp **Mở trong EduBeam** dưới hình. Mô hình vừa mở sẽ thay thế mô hình bạn đang có; <kbd>Ctrl</kbd>+<kbd>Z</kbd> lấy lại mô hình của bạn, và nó cũng được lưu trong **☰ → Kết cấu gần đây**.

### Dầm siêu tĩnh {#exercise-indeterminate-beam}

Dầm dài 3 m, ngàm tại A, gối di động tại B, chịu tải 10 kN/m.

::model-figure{caption="Ngàm tại A, gối di động tại B, 10 kN/m"}
---
nodes: { A: [0, 0], B: [3, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Tính tay phản lực và mô men tại ngàm, bằng phương pháp lực hoặc bảng mô men đầu ngàm.
2. Bỏ đánh dấu `Ry` tại A để có dầm đơn giản. Mô men lớn nhất thay đổi thế nào?
3. Đánh dấu lại `Ry` tại A, và cả tại B, để ngàm cả hai đầu.

**Chú ý** xem biểu đồ mô men đổi dấu ở đâu, và ngàm nhận phần tải lớn hơn gối di động ra sao.

::callout{type="details" title="Đáp số"}
- Ngàm – gối di động: $R_A = 5qL/8 = 18{,}75$ kN, $R_B = 3qL/8 = 11{,}25$ kN, $M_A = qL^2/8 = 11{,}25$ kNm, căng thớ trên. Mô men căng thớ dưới lớn nhất là $9qL^2/128 = 6{,}33$ kNm, cách B 1,125 m, tại chỗ lực cắt bằng không.
- Dầm đơn giản: $qL^2/8 = 11{,}25$ kNm giữa nhịp, đúng bằng mô men mà ngàm chịu trước đó.
- Ngàm hai đầu: $qL^2/12 = 7{,}5$ kNm căng thớ trên tại hai đầu, $qL^2/24 = 3{,}75$ kNm căng thớ dưới giữa nhịp.
::

### Dầm công xôn {#exercise-cantilever}

Dầm công xôn dài 4 m, ngàm tại A, chịu lực 18 kN hướng xuống tại đầu tự do B.

::model-figure{caption="Dầm công xôn, 18 kN tại đầu tự do"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Tính mô men tại ngàm, độ võng và góc xoay tại đầu tự do. So sánh với nút B trong **Kết quả → Kết quả tại nút**.
2. Giảm $I_y$ đi một nửa trong thẻ **Tiết diện**. Đại lượng nào thay đổi, đại lượng nào không?
3. Thay lực tập trung bằng tải phân bố đều 4,5 kN/m, tổng cộng vẫn là 18 kN: xóa tải nút trong thẻ **Tải trọng**, rồi chọn **Thêm tải phần tử**.

**Chú ý** dạng của biểu đồ mô men: đường thẳng khi chịu lực tập trung, đường parabol khi chịu tải phân bố đều.

::callout{type="details" title="Đáp số"}
- $M_A = FL = 72$ kNm, $w_B = FL^3/(3EI) = 21{,}88$ mm, $\varphi_B = FL^2/(2EI) = 8{,}21$ mrad.
- Giảm $I_y$ một nửa thì độ võng tăng gấp đôi, lên 43,77 mm. Mô men vẫn là 72 kNm: dầm công xôn là hệ tĩnh định, nên nội lực không phụ thuộc độ cứng.
- Tải phân bố đều: $M_A = qL^2/2 = 36$ kNm và $w_B = qL^4/(8EI) = 8{,}21$ mm. Cùng tổng tải trọng nhưng mô men chỉ bằng một nửa và độ võng bằng ba phần tám.
::

### Dàn Warren {#exercise-pratt-truss}

Dàn nhịp 9 m, cao 1,8 m, chịu 8 kN tại mỗi nút trong ba nút cánh trên E, F và G. Đánh dấu **N(x)** trong tùy chọn hiển thị để xem lực dọc. (Các thanh xiên đổi chiều luân phiên và không có thanh đứng: phần lớn giáo trình gọi sơ đồ này là dàn Warren.)

::model-figure{caption="Các nút A đến G, 8 kN tại E, F và G"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [1.5, -1.8], F: [4.5, -1.8], G: [7.5, -1.8] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D], [E, F], [F, G], [A, E], [E, B], [B, F], [F, C], [C, G], [G, D]]
loads:
  - { node: E, fz: 8 }
  - { node: F, fz: 8 }
  - { node: G, fz: 8 }
results: []
show: [nodeLabels]
---
::

1. Tính phản lực, rồi lực trong thanh xiên đầu dàn A–E và thanh cánh dưới A–B bằng phương pháp tách nút.
2. Tính lực trong thanh cánh trên ở khoang giữa và lực trong thanh cánh dưới B–C bằng phương pháp mặt cắt.
3. Các nút trong mô hình này là nút cứng. Đánh dấu cả hai khớp đầu thanh của mọi thanh trong thẻ **Phần tử** để có dàn nút khớp, rồi so sánh lực dọc.
4. Xóa thanh xiên B–F, trước hết với nút cứng, sau đó với nút khớp. Dàn có còn đứng vững không?

**Chú ý** quy luật về dấu: thanh cánh trên chịu nén, thanh cánh dưới chịu kéo, còn các thanh xiên luân phiên kéo, nén.

::callout{type="details" title="Đáp số"}
- Phản lực: 12 kN tại A và tại D.
- Thanh xiên đầu dàn: nén 15,62 kN. Thanh cánh dưới A–B và C–D: kéo 10,00 kN.
- Thanh cánh trên E–F và F–G: nén 13,33 kN (lấy mô men đối với B: $(12 \cdot 3 - 8 \cdot 1{,}5)/1{,}8$). Thanh cánh dưới B–C: kéo 16,67 kN (lấy mô men đối với F: $(12 \cdot 4{,}5 - 8 \cdot 3)/1{,}8$). Các thanh xiên bên trong: 5,21 kN, chịu kéo ở các thanh đi từ E và G xuống thanh cánh dưới, chịu nén ở các thanh đi lên F.
- Nút cứng và nút khớp cho lực dọc như nhau, sai khác không quá 0,1 %. Trong dàn ghép từ các tam giác, mô men uốn không đáng kể; vì thế mô hình nút khớp dùng được.
- Khi bỏ B–F, dàn nút cứng vẫn đứng vững nhờ làm việc như khung, với mô men uốn khoảng 3 kNm. Với nút khớp, dàn thiếu một thanh: nó trở thành hệ biến hình, và EduBeam cho thấy nó có thể chuyển động thế nào.
::

### Dầm liên tục ba nhịp {#exercise-three-span-continuous-beam}

Dầm dài 16 m, các nhịp 5 + 6 + 5 m: 8 kN/m trên nhịp thứ nhất, 20 kN tại C và 6 kN/m trên nhịp cuối. Khi vừa mở, chỉ A và D có gối tựa.

::model-figure{caption="Khi vừa mở: chỉ có gối tựa tại A và D"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Lúc vừa mở, đây là một dầm đơn giản dài 16 m. Tính phản lực và mô men tại B và C.
2. Đánh dấu `Dz` tại B và tại C để có dầm liên tục trên bốn gối tựa.
3. Tính mô men trên gối B và C bằng phương trình ba mô men, rồi tính phản lực.

**Chú ý** mô men âm xuất hiện trên các gối giữa, mọi mô men giảm đi bao nhiêu, và lực 20 kN ra sao khi C trở thành gối tựa.

::callout{type="details" title="Đáp số"}
- Dầm đơn giản: $R_A = 44{,}69$ kN, $R_D = 45{,}31$ kN, $M_B = 123{,}4$ kNm và $M_C = 151{,}6$ kNm, đều căng thớ dưới.
- Dầm liên tục, với $M_A = M_D = 0$:
  $$22 M_B + 6 M_C = -\tfrac{8 \cdot 5^3}{4}$$
  $$6 M_B + 22 M_C = -\tfrac{6 \cdot 5^3}{4}$$
  cho $M_B = -9{,}766$ kNm và $M_C = -5{,}859$ kNm, căng thớ trên. Lực 20 kN tại C truyền thẳng xuống gối tựa và không gây uốn.
- Phản lực: A 18,05 kN, B 22,60 kN, C 35,52 kN (kể cả 20 kN), D 13,83 kN. Tổng các phản lực bằng tổng tải trọng 90 kN.

::model-figure{caption="Dầm liên tục trên bốn gối tựa"}
---
nodes: { A: [0, 0], B: [5, 0], C: [11, 0], D: [16, 0] }
supports: { A: pin, B: roller, C: roller, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 8 }
  - { node: C, fz: 20 }
  - { member: 3, qz: 6 }
results: [M, V]
---
::
::

### Khung cổng {#exercise-portal-frame}

Dầm dài 8 m trên hai cột cao 6 m, ngàm tại A và gối di động tại D. Dầm chịu 10 kN/m, còn góc khung C chịu 8 kN hướng sang trái và 10 kN hướng xuống.

::model-figure{caption="Ngàm tại A, gối di động tại D: 10 kN/m trên dầm, 8 kN và 10 kN tại C"}
---
nodes: { A: [0, 0], B: [0, -6], C: [8, -6], D: [8, 0] }
supports: { A: fixed, D: roller }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
  - { node: C, fx: -8 }
  - { node: C, fz: 10 }
results: []
show: [nodeLabels, dimensions]
---
::

1. Khung siêu tĩnh bậc mấy?
2. Bỏ đánh dấu `Ry` tại A để A thành gối cố định. Khung lúc này tĩnh định: tính tay phản lực và mô men tại các góc khung B và C.
3. Đánh dấu lại `Ry` tại A, rồi đánh dấu `Dx` tại D để D thành gối cố định. Xem chuyển vị ngang của dầm trên sơ đồ biến dạng.

**Chú ý** đỉnh khung dịch về phía nào. Ở khung lúc vừa mở, đỉnh khung dịch sang phải, ngược chiều lực 8 kN. Tại sao?

::callout{type="details" title="Đáp số"}
- Bốn phản lực (ba tại ngàm, một tại gối di động) và ba phương trình cân bằng: siêu tĩnh bậc một. Nếu D cũng là gối cố định thì siêu tĩnh bậc hai.
- Với gối cố định tại A: $V_D = (10 \cdot 8 \cdot 4 + 10 \cdot 8 - 8 \cdot 6)/8 = 44$ kN, $V_A = 46$ kN, $H_A = 8$ kN hướng sang phải. Mô men tại góc khung B bằng $8 \cdot 6 = 48$ kNm. Tại C mô men bằng không: vì D không có phản lực ngang, cột phải chỉ chịu lực dọc 44 kN.
- Lúc vừa mở, đỉnh khung dịch sang phải 9,5 mm: mô men từ dầm chịu tải uốn cột chân ngàm mạnh hơn lực 8 kN. Khi D là gối cố định, D nhận 4,9 kN theo phương ngang, và đỉnh khung dịch sang trái 4,8 mm.
::

### Tải nhiệt độ {#exercise-temperature-load}

Dầm đơn giản dài 8 m, trục dầm nóng lên $\Delta T_c = 20$ K, thớ dưới lạnh hơn thớ trên 10 K ($\Delta T_b - \Delta T_t = -10$ K).

::model-figure{caption="Dầm đơn giản dài 8 m, nóng lên 20 K, thớ dưới lạnh hơn thớ trên 10 K"}
---
nodes: { A: [0, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, temperature: { centre: 20, bottom: -10, top: 0 } }
results: []
show: [nodeLabels, dimensions]
---
::

1. Trước khi xem kết quả: nhiệt độ gây ra những nội lực nào, và dầm chuyển vị ra sao?
2. Đánh dấu `Dx` tại B để ngăn dầm dãn dài.
3. Đánh dấu thêm `Ry` tại cả hai đầu.

**Chú ý** sơ đồ biến dạng và các con số trong **Kết quả → Kết quả tại nút**: dầm chuyển vị mà không có nội lực nào cho đến khi bạn ngăn nó lại.

::callout{type="details" title="Đáp số"}
- Dầm tĩnh định có thể tự do dãn dài và uốn cong, nên không có nội lực. B trượt ra một đoạn $\alpha \Delta T_c L = 12 \cdot 10^{-6} \cdot 20 \cdot 8 = 1{,}92$ mm. Thớ dưới lạnh hơn nên co ngắn lại, làm dầm cong vồng lên với độ cong $\kappa = \alpha (\Delta T_b - \Delta T_t)/h = -1{,}2 \cdot 10^{-4}$ 1/m: hai đầu xoay một góc $\kappa L/2 = 0{,}48$ mrad và điểm giữa nhịp vồng lên $\kappa L^2/8 = 0{,}96$ mm.
- Khi cả hai đầu bị giữ theo phương x: $N = -EA\alpha\Delta T_c = -50\,400$ kN, chịu nén. Độ lớn này là do diện tích giả định 1 m²; với IPE 200 có diện tích 28,48 cm², lực nén chỉ là 143,5 kN.
- Khi ngàm cả hai đầu: mô men không đổi $EI\alpha(\Delta T_b - \Delta T_t)/h = 2{,}11$ kNm dọc toàn bộ dầm.
::

## Bài hướng dẫn có lời giải {#worked-tutorials}

Những mô hình lớn hơn, dựng từng bước và kiểm tra bằng tính tay:

::card-grid{cols="2"}
:::card{title="Dầm xiên" icon="lucide:move-diagonal" to="/vi/tutorials/inclined-beam"}
Kèo mái chịu tải tuyết: tải trọng trên mỗi mét hình chiếu ngang, lực dọc và lực cắt dọc theo mái dốc, và một gối di động đặt xiên.
:::
:::card{title="Khung ba khớp" icon="lucide:triangle" to="/vi/tutorials/three-hinged-frame"}
Phản lực, N, V và M của khung có khớp trung gian.
:::
:::card{title="Dàn phẳng" icon="lucide:git-fork" to="/vi/tutorials/truss"}
Phương pháp tách nút, phương pháp mặt cắt, thanh không chịu lực và chuyển vị tính bằng nguyên lý công khả dĩ.
:::
:::card{title="Dầm liên tục và lún gối tựa" icon="lucide:spline" to="/vi/tutorials/continuous-beam"}
Dầm hai nhịp giải bằng phương pháp lực, rồi cho gối giữa lún 10 mm.
:::
::

Các phép kiểm tra khác bằng công thức giải tích có trong trang [Kiểm tra kết quả bằng tính tay](/vi/guide/verification).

## Thêm bài toán {#more-problems}

Trang [Luyện tập](/vi/practice) cho bạn một dầm, khung hoặc dàn mới với số liệu mới bất cứ khi nào bạn muốn, và kiểm tra ngay phản lực cùng mô men lớn nhất hoặc lực lớn nhất trong thanh. Cho cả lớp, [Trình tạo đề thi](/vi/exam) in cho mỗi sinh viên một mã đề riêng kèm đáp án, còn thư viện [@edubeam/plot](/vi/guide/teaching#exercise-sheets-tests-and-slides-from-code) tạo phiếu bài tập trực tiếp từ mã nguồn.

## Đóng góp một ví dụ {#contribute-an-example}

Bạn có một mô hình hay để giảng dạy? Hãy chia sẻ liên kết của nó trên [GitHub Discussions](https://github.com/janvorisek/edubeam/discussions), và chúng tôi có thể đưa nó vào danh sách ví dụ.
