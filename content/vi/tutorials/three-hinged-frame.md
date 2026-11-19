---
description: "Hướng dẫn: mô hình hóa khung ba khớp chịu tải phân bố đều trong EduBeam, đọc phản lực, lực xô ngang và nội lực, rồi kiểm tra bằng tính tay, kể cả độ võng của khớp. Khoảng 15 phút."
source: site
---

# Hướng dẫn: khung ba khớp

Mô hình hóa một khung cổng có khớp ở giữa nhịp dầm, đọc phản lực và các biểu đồ nội lực, rồi kiểm tra mọi con số bằng tính tay, kể cả độ võng tại khớp.

- **Thời gian:** khoảng 15 phút.
- **Cần chuẩn bị:** EduBeam mở ở một thẻ khác của trình duyệt, trên máy tính có chuột và bàn phím. Nếu bạn chưa từng dùng EduBeam, hãy làm trước phần [Bắt đầu nhanh](/vi/guide/quick-start) hoặc bài hướng dẫn [dầm xiên](/vi/tutorials/inclined-beam).
- **Kiến thức cần có:** cân bằng của khung và sơ đồ vật tự do. Phần kiểm tra độ võng (không bắt buộc) dùng công thức Maxwell–Mohr (nguyên lý công khả dĩ với lực đơn vị).
- **Đơn vị:** SI. Ô đơn vị ở góc dưới bên phải vùng hiển thị phải ghi `m m² kN kNm MPa`. Nếu ô này hiện feet và kip, nhấp vào nó và đặt **Hệ đơn vị** thành **SI (hệ mét)**.

**Bạn sẽ học cách**

- vẽ khung thành một đường gấp khúc bằng chuột,
- đặt khớp bên trong một thanh bằng các ô **Khớp đầu thanh**,
- tìm lực xô ngang từ điều kiện $M = 0$ tại khớp, và hiểu dấu của $V$ trong các thanh vẽ theo những chiều khác nhau.

::div{.actions}
[Mở EduBeam ↗](https://run.edubeam.app/?lang=vi){target="_blank"} [Đến phần kiểm tra bằng tính tay](#_6-check-by-hand)
::

::model-figure{caption="Khung hoàn chỉnh: 10 kN/m trên dầm, gối cố định tại nút 1 và 5, khớp tại nút 3"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Bài toán {#the-problem}

- Hai cột cao 4 m, cách nhau 8 m, chân cột (nút 1 và 5) là gối cố định.
- Trên đỉnh cột là dầm ngang từ nút 2 đến nút 4, có khớp ở giữa nhịp, tại nút 3.
- Tải phân bố đều $q = 10$ kN/m trên toàn bộ dầm.
- Thép, $E = 210$ GPa, và $I_y = 8{,}356 \times 10^{-5}$ m⁴ (thép hình IPE 300) cho mọi thanh.

| Nút | x (m) | z (m) | |
| --- | --- | --- | --- |
| 1 | 0 | 0 | gối cố định |
| 2 | 0 | −4 | góc khung |
| 3 | 4 | −4 | khớp trong dầm |
| 4 | 8 | −4 | góc khung |
| 5 | 8 | 0 | gối cố định |

Trục z hướng **xuống**, nên đỉnh cột nằm tại $z = -4$.

**Hệ có tĩnh định không?** Hai gối cố định cho bốn phản lực. Ba phương trình cân bằng cùng điều kiện $M_3 = 0$ tại khớp cho đủ bốn phương trình: có.

## Dựng mô hình {#model-it}

::div{.steps}

### Vật liệu và tiết diện {#_1-material-and-section}

1. Nhấp vào **Xóa kết cấu** trên thanh ứng dụng, đánh dấu **Xóa vật liệu** và **Xóa tiết diện**, rồi nhấp vào **Xác nhận**. Nút và phần tử lại được đánh số từ 1.
2. Thẻ **Vật liệu** → **Thư viện vật liệu** → **+** ở dòng **Thép (S235)**, rồi nhấp vào **Hủy** để đóng thư viện.
3. Thẻ **Tiết diện** → **Thêm tiết diện**. Nhập `8.356e-5` vào **Iy**, giữ **Diện tích**, **Chiều cao** và **Hệ số hiệu chỉnh cắt** bằng `1`, rồi nhấp vào **Thêm tiết diện**.

Với diện tích 1 m², các thanh hầu như không co ngắn hay biến dạng trượt, đúng như giả thiết của phép tính tay độ võng. Nội lực của khung tĩnh định hoàn toàn không phụ thuộc vào $E$, $A$ hay $I_y$.

### Vẽ khung {#_2-draw-the-frame}

1. Thẻ **Phần tử** → nút bấm **Thêm phần tử** thứ hai, nút có biểu tượng con trỏ chuột.
2. Nhấp lần lượt tại (0, 0), (0, −4), (4, −4), (8, −4) và (8, 0). Mỗi lần nhấp thêm một nút mới và nối nó với nút trước; điểm nhấp tự bắt dính vào lưới.
3. Nhấn <kbd>Esc</kbd> để dừng vẽ, rồi <kbd>F</kbd> để đưa kết cấu vừa màn hình.

Bây giờ bạn có các nút 1 đến 5 và các phần tử 1 đến 4, được đánh số theo thứ tự vẽ, như trên các hình ở trang này. Đối chiếu bảng **Nút** với bảng ở trên và nhập lại tọa độ nào bị lệch.

### Gối tựa và khớp {#_3-supports-and-the-hinge}

1. Nhấp vào nút 1 → **Gối tựa tại nút** → biểu tượng **Gối cố định**. Làm tương tự với nút 5.
2. Trong bảng **Phần tử**, tìm phần tử 2, đi từ nút 2 đến nút 3, và đánh dấu ô thứ hai trong cột **Khớp đầu thanh**: khớp ở nút cuối của phần tử, tức nút 3.

![Bảng Phần tử: phần tử 2 có khớp ở nút cuối, tức nút 3](/screenshots/vi/p2t-frame-elements-table.webp)

Một khớp là đủ. Khi đó phần tử 3 là thanh duy nhất liên kết cứng với nút 3, nên tại đó không có mô men nào truyền vào nó được. Đánh dấu thêm khớp ở đầu phần tử 3 cũng không thay đổi gì.

### Tải trọng {#_4-load}

1. Thẻ **Tải trọng** → **Thêm tải phần tử**.
2. **Loại tải trọng** *Tải phân bố đều*, **Phần tử** `2`, `fz = 10`. Nhấp vào **Thêm tải phần tử**.
3. Lặp lại cho phần tử 3.

`fz` dương hướng xuống. Dầm nằm ngang, nên ở đây đánh dấu ô **LCS** (hệ tọa độ địa phương) hay không cũng như nhau.

::

## Kết quả {#_5-results}

Trong tùy chọn hiển thị ở góc trên bên phải vùng hiển thị (biểu tượng bánh răng để hiện hoặc ẩn các tùy chọn này), **Biến dạng**, **M<sub>y</sub> (x)** và **Phản lực** được bật sẵn. Đánh dấu thêm **N (x)** và **V<sub>z</sub> (x)** để xem các biểu đồ còn lại, hoặc bỏ đánh dấu bớt để xem từng biểu đồ một. EduBeam ghi giá trị theo kN và kNm với hai chữ số thập phân.

- Mỗi chân cột ghi `40,00` hướng lên và `20,00` hướng vào trong.
- Mô men uốn ghi `-80,00` tại cả hai góc khung và không có nhãn tại khớp, nơi nó bằng không. EduBeam vẽ biểu đồ mô men về phía thớ chịu kéo, ở đây là phía ngoài khung.
- Lực dọc âm ở mọi chỗ: `-40,00` trong cột, `-20,00` trong dầm. Cả bốn thanh đều chịu nén.
- Thẻ **Kết quả** → **Kết quả tại nút**: khớp (nút 3) chuyển vị xuống $D_z$ = `4,2554 · 10⁻² m`, tức 42,55 mm, đúng bằng giá trị tại khớp trên hình ở đầu trang khi chọn $w(x)$.

## Kiểm tra bằng tính tay {#_6-check-by-hand}

**Phản lực đứng.** Do đối xứng, mỗi chân cột chịu một nửa của 80 kN:

$$
V_1 = V_5 = \frac{q \cdot 8}{2} = 40\ \text{kN}
$$

**Phản lực ngang.** Cắt khung tại khớp, xét nửa trái và lấy tổng mô men đối với nút 3, nơi mô men uốn bằng không:

$$
V_1 \cdot 4 - H_1 \cdot 4 - q \cdot 4 \cdot 2 = 0 \quad\Rightarrow\quad H_1 = \frac{160 - 80}{4} = 20\ \text{kN}
$$

Cả hai chân cột đều đẩy vào trong 20 kN. Lực xô ngang này có được là nhờ hai gối cố định không thể trượt ra xa nhau. Không có nó, khung không đứng được: hai cột sẽ choãi ra và khớp sẽ sụp xuống.

| Đại lượng | Công thức | Tính tay | EduBeam |
| --- | --- | --- | --- |
| Phản lực đứng | $q \cdot 8/2$ | 40 kN | 40,00 |
| Phản lực ngang | từ $M_3 = 0$ | 20 kN | 20,00 |
| Mô men tại góc khung, nút 2 và 4 | $H_1 \cdot 4$ | 80 kNm, căng thớ ngoài | −80,00 |
| Mô men tại khớp, nút 3 | | 0 | không có nhãn |
| $N$ trong cột | $-V_1$ | −40 kN | −40,00 |
| $N$ trong dầm | $-H_1$ | −20 kN | −20,00 |
| $V$ trong cột | $\pm H_1$ | ±20 kN | −20,00; 20,00 |
| $V$ trong dầm tại nút 2, 3, 4 | $V_1 - q\,x$ | 40; 0; −40 kN | 40,00; không có nhãn; −40,00 |

Hai cột chịu cùng một lực cắt nhưng ngược dấu, −20 kN trong phần tử 1 và +20 kN trong phần tử 4, vì hệ trục địa phương của mỗi phần tử đi theo chiều vẽ phần tử đó: phần tử 1 vẽ từ dưới lên, phần tử 4 từ trên xuống. Đổi thứ tự nút của một cột thì dấu lực cắt trong cột đó đổi theo. Lý do được giải thích ở trang [Hệ tọa độ và quy ước dấu](/vi/elements/conventions#internal-forces).

Trong dầm, $M(x) = -80 + 40x - 5x^2$ kNm, với $x$ tính từ nút 2. Mô men bằng không tại khớp và không bao giờ dương: toàn bộ dầm chịu mô men âm (căng thớ trên). Lực cắt $V(x) = 40 - 10x$ bằng không đúng tại khớp, nên mô men đạt cực trị tại đó.

::callout{type="details" title="Độ võng của khớp tính bằng nguyên lý công khả dĩ"}
Đặt một lực đơn vị hướng xuống tại nút 3. Lực này gây ra các phản lực $\bar V = \bar H = 1/2$ và mô men $\bar m$ tăng từ 0 tại chân cột lên 2 tại góc khung rồi giảm về 0 tại khớp, căng thớ ngoài, giống như mô men thực $M$. Lấy tích phân $M \bar m$ trên cả bốn thanh:

$$
\text{cột: } 2\int_0^4 (20\,y)(0{,}5\,y)\,dy = 426{,}7
$$

$$
\text{dầm: } 2\int_0^4 (80 - 40x + 5x^2)(2 - 0{,}5x)\,dx = 320
$$

Với $EI = 210 \times 10^6 \cdot 8{,}356 \times 10^{-5} = 17\,548$ kNm²:

$$
\delta_3 = \frac{1}{EI}\int M \bar m\,dx = \frac{746{,}7}{17\,548} = 0{,}04255\ \text{m}
$$

Đó chính là 42,55 mm mà EduBeam báo là `4,2554 · 10⁻²` m. Chữ số 4 ở cuối đến từ độ co ngắn và biến dạng trượt rất nhỏ mà diện tích 1 m² vẫn cho phép, còn phép tính tay thì bỏ qua. Với diện tích thực của IPE 300, $A = 53{,}8$ cm², và lấy bản bụng làm diện tích chịu cắt (hệ số hiệu chỉnh cắt 0,40), các thanh co ngắn và biến dạng trượt nhiều hơn, và khớp võng xuống 43,7 mm, lớn hơn khoảng 3 %.
::

## Thử nghiệm {#_7-experiment}

Mỗi lần chỉ thay đổi một thứ, dự đoán kết quả trước rồi mới xem. <kbd>Ctrl</kbd>+<kbd>Z</kbd> hoàn tác từng thay đổi.

**Bỏ đánh dấu khớp.** Khung trở thành hệ siêu tĩnh bậc một. Lực xô ngang giảm một nửa, còn 10 kN, mô men tại góc khung giảm còn −40 kNm, và dầm chịu mô men dương 40 kNm ở giữa nhịp. Nút 3 giờ chỉ chuyển vị xuống 12,16 mm thay vì 42,55 mm. Lúc này tiết diện cũng có ảnh hưởng: cho dầm một tiết diện cứng hơn cột thì mô men tại góc khung tăng lên.

::model-figure{caption="Không có khớp: lực xô ngang nhỏ hơn, mô men tại góc khung giảm một nửa, và mô men dương ở giữa nhịp"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], [2, 3], [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

**Ngàm chân cột.** Chọn biểu tượng **Ngàm** cho nút 1 và 5. Lực xô ngang tăng lên 30 kN và tại chân cột xuất hiện mô men 40 kNm (EduBeam ghi `39,99`, vì các cột co ngắn đi một chút), nhưng mô men tại góc khung vẫn là 80 kNm. Do đối xứng, lực cắt tại khớp bằng không, nên mỗi nửa dầm vẫn làm việc như một dầm công xôn dài 4 m ngàm tại góc khung: $q \cdot 4^2/2 = 80$ kNm.

**Đẩy ngang.** Trả chân cột về gối cố định, rồi thêm tải trọng nút `Fx = 10` kN tại nút 2. Các phản lực mất tính đối xứng: 35 kN và 45 kN hướng lên, 15 kN và 25 kN theo phương ngang. Kiểm tra chúng bằng chính ba phương trình cân bằng và điều kiện $M_3 = 0$; tải trọng tại nút 2 không có cánh tay đòn đối với nút 3. Mô men tại góc khung bên trái giảm còn −60 kNm, và nửa trái của dầm giờ chịu mô men dương nhỏ, 1,25 kNm tại điểm cách khớp 0,5 m.

::model-figure{caption="Tải trọng ngang 10 kN tại nút 2: góc khung bên phải giờ chịu 100 kNm"}
---
nodes: { 1: [0, 0], 2: [0, -4], 3: [4, -4], 4: [8, -4], 5: [8, 0] }
supports: { 1: pin, 5: pin }
members: [[1, 2], { nodes: [2, 3], hinges: [false, true] }, [3, 4], [4, 5]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
  - { node: 2, fx: 10 }
results: [M, N]
show: [nodeLabels]
---
::

**Thêm khớp thứ hai.** Đánh dấu thêm khớp ở nút đầu của phần tử 2, tức tại nút 2. Hai khớp trong dầm đặt trên hai cột có chân là gối cố định tạo thành hệ biến hình. EduBeam không hiện kết quả, báo *Khớp tại các nút 2, 3 cho phép kết cấu chuyển động.* và cho thấy chuyển động đó bằng hoạt ảnh.

## Bước tiếp theo {#next-steps}

::card-grid{cols="2"}
:::card{title="Luyện tập: khung ba khớp" icon="lucide:dices" to="/vi/practice?p=H2048"}
Cùng dạng khung này với các tải trọng mới, trong đó có cả lực đẩy ngang; đáp số được kiểm tra ngay. Bắt đầu với mã bài H2048; muốn có thêm bài, chỉ giữ chọn **Khung ba khớp** và nhấn **Bài mới**.
:::
:::card{title="Tiếp theo: dàn phẳng" icon="lucide:git-fork" to="/vi/tutorials/truss"}
Chín thanh có khớp: phương pháp tách nút, phương pháp mặt cắt, một thanh không chịu lực và độ võng tính bằng nguyên lý công khả dĩ.
:::
::
