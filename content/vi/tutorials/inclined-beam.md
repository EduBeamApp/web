---
description: "Hướng dẫn: dầm xiên (kèo mái, vế thang) trong EduBeam, tải trên mét hình chiếu ngang, lực dọc, lực cắt và ảnh hưởng của hướng gối di động. Khoảng 15 phút."
source: site
---

# Hướng dẫn: dầm xiên

Mô hình hóa một kèo mái chịu tải tuyết, đọc lực dọc và lực cắt dọc theo chiều dốc của kèo, rồi kiểm tra chúng bằng tính tay.

- **Thời gian:** khoảng 15 phút. Đây là bài đầu tiên và ngắn nhất trong bốn bài hướng dẫn.
- **Cần chuẩn bị:** EduBeam mở ở một thẻ khác của trình duyệt, trên máy tính có chuột và bàn phím. Nếu bạn chưa từng dùng EduBeam, hãy làm phần [Bắt đầu nhanh](/vi/guide/quick-start) trước: phần đó giới thiệu các thẻ và hộp thoại mà bài này dùng.
- **Kiến thức cần có:** cân bằng của dầm đơn giản, và phân tích một lực thành hai thành phần.
- **Đơn vị:** SI. Ô đơn vị ở góc dưới bên phải vùng hiển thị phải ghi `m m² kN kNm MPa`. Nếu ô này hiện feet và kip, nhấp vào nó và đặt **Hệ đơn vị** thành **SI (hệ mét)**.

**Bạn sẽ học cách**

- quy đổi tải cho trên mét hình chiếu ngang thành tải phân bố theo chiều dài thanh, dạng mà EduBeam nhận,
- cho tải phân bố tác dụng theo phương đứng hoặc vuông góc với thanh bằng ô **LCS** (hệ tọa độ địa phương),
- xoay gối di động và thấy rằng lực dọc thay đổi, còn mô men uốn thì không.

::div{.actions}
[Mở EduBeam ↗](https://run.edubeam.app/?lang=vi){target="_blank"} [Đến phần kiểm tra bằng tính tay](#check-by-hand)
::

::model-figure{caption="Kèo mái hoàn chỉnh: tuyết 3 kN/m trên mét hình chiếu ngang, nhập thành 2,4 kN/m dọc theo thanh, với gối cố định ở chân kèo (nút 1) và gối di động ở đỉnh mái (nút 2)"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [M, N, V, w]
show: [nodeLabels, dimensions]
---
::

## Bài toán {#the-problem}

- Một kèo thẳng đi từ nút 1 tại (0, 0) lên nút 2 tại (4, −3): hình chiếu ngang 4 m và cao 3 m, nên chiều dài $L = 5$ m, với $\cos\alpha = 4/5$ và $\sin\alpha = 3/5$.
- Gối cố định tại nút 1, ở chân kèo. Tại nút 2, ở đỉnh mái, là gối di động lăn theo phương ngang, nên phản lực của nó có phương đứng.
- Tải tuyết $s = 3$ kN/m, cho **trên mỗi mét hình chiếu ngang**, như cách các tiêu chuẩn vẫn cho.
- Thép, $E = 210$ GPa, và $I_y = 8{,}356 \times 10^{-5}$ m⁴, của thép hình IPE 300.

**Hệ có tĩnh định không?** Ba phản lực và ba phương trình cân bằng: có. Chỉ cần các phương trình cân bằng là tìm được nội lực; $E$ và $I_y$ chỉ ảnh hưởng đến độ võng.

## Dựng mô hình {#model-it}

::div{.steps}

### Vật liệu và tiết diện {#material-and-section}

1. Nhấp vào **Xóa kết cấu** trên thanh ứng dụng, đánh dấu **Xóa vật liệu** và **Xóa tiết diện**, rồi nhấp vào **Xác nhận**. Nút và phần tử lại được đánh số từ 1.
2. Thẻ **Vật liệu** → **Thư viện vật liệu** → **+** ở dòng **Thép (S235)**, rồi nhấp vào **Hủy** để đóng thư viện.
3. Thẻ **Tiết diện** → **Thêm tiết diện**. Nhập `8.356e-5` vào **Iy**, giữ **Diện tích**, **Chiều cao** và **Hệ số hiệu chỉnh cắt** bằng `1`, rồi nhấp vào **Thêm tiết diện**.

Với diện tích 1 m², thanh hầu như không co ngắn hay biến dạng trượt, đúng như giả thiết của phép tính tay.

### Vẽ thanh {#draw-the-member}

1. Thẻ **Phần tử** → nút bấm **Thêm phần tử** thứ hai, nút có biểu tượng con trỏ chuột.
2. Nhấp tại (0, 0), rồi tại (4, −3). Thước và dấu thập cho biết bạn đang ở đâu, và điểm nhấp tự bắt dính vào lưới.
3. Nhấn <kbd>Esc</kbd> để dừng vẽ, rồi <kbd>F</kbd> để đưa kết cấu vừa màn hình.

Trục z hướng xuống, nên nút 2 tuy nằm **cao hơn** nút 1 đến 3 m nhưng lại có $z = -3$. Kiểm tra cả hai nút trong bảng **Nút** và nhập lại tọa độ nào bị lệch.

### Gối tựa {#supports}

Nhấp vào nút 1 → **Gối tựa tại nút** → biểu tượng **Gối cố định**. Đặt **Gối di động** cho nút 2 theo cách tương tự.

### Tải trọng {#load}

Tổng tải tuyết trên kèo là $3 \cdot 4 = 12$ kN. EduBeam rải tải phân bố đều theo **chiều dài** thanh, nên cùng 12 kN đó rải trên 5 m cho

$$
f_z = s \cdot \frac{4}{5} = s\cos\alpha = 3 \cdot 0{,}8 = 2{,}4\ \text{kN/m}
$$

1. Thẻ **Tải trọng** → **Thêm tải phần tử**.
2. **Loại tải trọng** *Tải phân bố đều*, **Phần tử** `1`, `fz = 2.4`.
3. **Bỏ đánh dấu LCS** để `fz` tác dụng theo phương đứng, rồi nhấp vào **Thêm tải phần tử**.

::callout{type="warning" title="LCS được đánh dấu sẵn"}
Khi **LCS** được đánh dấu, `fz` tác dụng theo trục z địa phương của phần tử, tức vuông góc với mặt dốc: như gió trên mái, không phải tuyết. Với dầm nằm ngang, hai cách này như nhau, nên chi tiết này rất dễ bị bỏ qua. Mũi tên tải trọng cho biết tải hướng về phía nào; xem chi tiết ở trang [Tải trọng](/vi/essentials/loads#uniformly-distributed-load).
::

::

## Kết quả {#results}

EduBeam giải dầm ngay khi có tải trọng. Trong tùy chọn hiển thị ở góc trên bên phải vùng hiển thị (biểu tượng bánh răng để hiện hoặc ẩn các tùy chọn này), **Biến dạng**, **M<sub>y</sub> (x)** và **Phản lực** được bật sẵn; đánh dấu thêm **N (x)** và **V<sub>z</sub> (x)**. Công tắc bên dưới hình ở đầu trang cũng cho xem các biểu đồ này.

EduBeam ghi biểu đồ và phản lực theo kN và kNm với hai chữ số thập phân, nên bạn sẽ đọc được:

- `6,00` tại mỗi gối, hướng lên. Phản lực ngang của gối cố định ghi `0,00`: không có lực ngang nào tác dụng.
- `6,00` kNm, mô men uốn lớn nhất, ở giữa nhịp.
- Lực cắt `4,80` kN tại nút 1 và `-4,80` tại nút 2.
- Lực dọc `-3,60` kN tại nút 1 (nén) và `3,60` tại nút 2 (kéo), và bằng không ở giữa nhịp.

## Kiểm tra bằng tính tay {#check-by-hand}

**Phản lực.** Hợp lực 12 kN đặt cách nút 1 một đoạn 2 m theo phương ngang, nên lấy mô men đối với từng đầu dầm được $V_1 = V_2 = 6$ kN. Không có lực ngang, nên $H_1 = 0$.

**Mô men uốn.** Với các lực thẳng đứng, chỉ cánh tay đòn theo phương ngang mới có tác dụng. Tại mặt cắt cách nút 1 một đoạn $x$ theo phương ngang,

$$
M(x) = V_1\,x - \frac{s\,x^2}{2}, \qquad M_{\max} = \frac{s\,a^2}{8} = \frac{3 \cdot 4^2}{8} = 6\ \text{kNm}
$$

đúng như với dầm nằm ngang nhịp $a = 4$ m chịu cùng tải trọng trên mét hình chiếu ngang.

**Lực cắt và lực dọc.** Các lực ở bên trái mặt cắt tại $x$ cộng lại thành một lực thẳng đứng $T(x) = V_1 - s\,x$. Phân tích lực này thành thành phần vuông góc với thanh và thành phần dọc theo thanh:

$$
V = T\cos\alpha, \qquad N = -T\sin\alpha
$$

| | Nút 1, $T = +6$ kN | Giữa nhịp, $T = 0$ | Nút 2, $T = -6$ kN |
| --- | --- | --- | --- |
| $V$ | $6 \cdot 0{,}8 = 4{,}8$ kN | 0 | −4,8 kN |
| $N$ | $-6 \cdot 0{,}6 = -3{,}6$ kN | 0 | +3,6 kN |
| $M$ | 0 | 6 kNm | 0 |

Tất cả đều khớp với EduBeam. Phản lực hướng lên tại nút 1 đẩy đầu dưới của thanh lên theo chiều dốc, ép vào thanh: thanh chịu nén. Phản lực hướng lên tại nút 2 kéo đầu trên lên cao hơn theo chiều dốc, ra xa thanh: thanh chịu kéo. Dấu được xác định theo hướng của phần tử, từ nút 1 đến nút 2, như trang [Hệ tọa độ và quy ước dấu](/vi/elements/conventions#internal-forces) giải thích.

## Thử nghiệm {#experiment}

Mỗi lần chỉ thay đổi một thứ, dự đoán kết quả trước rồi mới xem. <kbd>Ctrl</kbd>+<kbd>Z</kbd> hoàn tác từng thay đổi.

**Quên nhân cos α.** Nhập `fz = 3` thay cho 2,4. Như vậy là 3 kN trên mỗi mét dọc theo mặt dốc, tổng cộng 15 kN, và mọi kết quả đều lớn hơn thực tế 25 %: phản lực 7,5 kN và mô men 7,5 kNm. Với mái dốc 30°, sai số là 15 %, với mái dốc 45° là 41 %.

**Để LCS được đánh dấu.** Đánh dấu **LCS** cho tải 2,4 kN/m. Giờ tải tác dụng vuông góc với mặt dốc, như gió, với thành phần ngang 7,2 kN mà chỉ gối cố định chịu được. Mô men tăng lên $2{,}4 \cdot 5^2/8 = 7{,}5$ kNm, và lực dọc thành lực kéo không đổi 4,5 kN.

::model-figure{caption="Vẫn 2,4 kN/m nhưng đánh dấu LCS: vuông góc với mặt dốc, nên gối cố định chịu 7,2 kN theo phương ngang"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4, local: true }
results: [M, N]
show: [nodeLabels]
---
::

**Xoay gối di động.** Bỏ đánh dấu **LCS** trở lại và chỉ đổi hướng lăn của gối di động tại nút 2. Nhấp vào nút 2 → **Gối tựa tại nút**, nhập `-36.87` vào **Góc LCS của nút** rồi nhấn <kbd>Enter</kbd> (hoặc nhập vào ô **α** ở dòng của nút trong bảng **Nút**).

![Menu Gối tựa tại nút của nút 2: các biểu tượng gối tựa, các phương bị chặn và Góc LCS của nút](/screenshots/vi/p2t-node-supports-angle.webp){.shot-md}

Góc này xoay hệ trục riêng của nút. Trong hệ trục mặc định, x sang phải và z xuống dưới, góc âm xoay chúng ngược chiều kim đồng hồ trên màn hình. Xem thêm ở mục [Gối tựa xiên](/vi/essentials/nodes-supports#inclined-skewed-supports).

Gối di động giờ lăn dọc theo mặt dốc, nên phản lực của nó vuông góc với thanh: $12 \cdot 2 / 5 = 4{,}8$ kN, theo phương trình mô men đối với nút 1. Gối cố định chịu phần còn lại, kèm theo toàn bộ lực dọc: −7,2 kN tại nút 1, bằng không tại nút 2.

::model-figure{caption="Gối di động tại nút 2 xoay −36,87° để lăn dọc theo mặt dốc: lực dọc biến thiên từ −7,2 kN về không"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: roller }
angles: { 2: -36.87 }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

**Đổi thành gối di động đứng.** Đặt góc về 0 và chọn **Gối di động đứng** cho nút 2. Gối này lăn theo phương đứng, nên chỉ có thể đẩy theo phương ngang: phương trình mô men đối với nút 1, $H_2 \cdot 3 = 12 \cdot 2$, cho 8 kN, và gối cố định giữ kèo chống lại lực xô ngang đó. Toàn bộ thanh chịu nén.

::model-figure{caption="Gối di động đứng tại nút 2: lực xô ngang 8 kN, và toàn bộ kèo chịu nén"}
---
nodes: { 1: [0, 0], 2: [4, -3] }
supports: { 1: pin, 2: verticalRoller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 2.4 }
results: [N, M]
show: [nodeLabels]
---
::

So sánh ba kiểu gối di động:

| Gối di động tại nút 2 | Phản lực tại nút 2 | Phản lực tại nút 1 | $N$ từ nút 1 đến nút 2 |
| --- | --- | --- | --- |
| Lăn ngang | 6 kN ↑ | 6 kN ↑ | −3,6 đến +3,6 kN |
| Lăn dọc mặt dốc | 4,8 kN ⊥ thanh | 2,88 kN →, 8,16 kN ↑ | −7,2 đến 0 kN |
| Lăn đứng | 8 kN ← | 8 kN →, 12 kN ↑ | −13,6 đến −6,4 kN |

**Mô men uốn không bao giờ thay đổi**, lực cắt cũng vậy: 6 kNm và ±4,8 kN trong cả ba trường hợp. Nút 1, nút 2 và mọi mặt cắt đều nằm trên một đường thẳng, là trục của thanh. Thành phần phản lực tại nút 2 tác dụng dọc theo đường này không gây mô men đối với điểm nào trong số đó, nên chỉ làm thay đổi lực dọc. Thành phần vuông góc với thanh luôn bằng 4,8 kN, theo phương trình mô men đối với nút 1, dù gối di động quay theo hướng nào. Hướng của gối di động chỉ quyết định lực xô truyền đi đâu, và điều đó quan trọng với bức tường hay chiếu nghỉ cầu thang phải chịu lực này.

## Bước tiếp theo {#next-steps}

::card-grid{cols="2"}
:::card{title="Luyện tập: dầm có đầu thừa" icon="lucide:dices" to="/vi/practice?p=O2048"}
Phản lực và mô men lớn nhất của dầm chịu tải phân bố, đáp số được kiểm tra ngay. Bắt đầu với mã bài O2048; muốn có thêm bài, chỉ giữ chọn **Dầm có đầu thừa** và nhấn **Bài mới**.
:::
:::card{title="Tiếp theo: khung ba khớp" icon="lucide:triangle" to="/vi/tutorials/three-hinged-frame"}
Bốn thanh, một khớp trung gian và lực xô ngang: một khung vẫn giải được chỉ bằng các phương trình cân bằng.
:::
::
