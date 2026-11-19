---
description: "Hướng dẫn: dựng dàn phẳng trong EduBeam, kiểm tra lực dọc bằng phương pháp tách nút và mặt cắt, tìm thanh không chịu lực, tính độ võng bằng công khả dĩ."
source: site
---

# Hướng dẫn: dàn phẳng

Dựng một dàn tĩnh định nhỏ từ các thanh có khớp, kiểm tra lực dọc trong các thanh bằng phương pháp tách nút và phương pháp mặt cắt, rồi kiểm tra một độ võng bằng nguyên lý công khả dĩ.

- **Thời gian:** khoảng 20 phút.
- **Cần chuẩn bị:** EduBeam mở ở một thẻ khác của trình duyệt, trên máy tính có chuột và bàn phím. Nếu bạn chưa từng dùng EduBeam, hãy làm trước phần [Bắt đầu nhanh](/vi/guide/quick-start) hoặc một trong các bài hướng dẫn trước bài này.
- **Kiến thức cần có:** phương pháp tách nút và phương pháp mặt cắt. Phần kiểm tra độ võng (không bắt buộc) dùng công thức Maxwell–Mohr (nguyên lý công khả dĩ với lực đơn vị).
- **Đơn vị:** SI. Ô đơn vị ở góc dưới bên phải vùng hiển thị phải ghi `m m² kN kNm MPa`. Nếu ô này hiện feet và kip, nhấp vào nó và đặt **Hệ đơn vị** thành **SI (hệ mét)**.

**Bạn sẽ học cách**

- mô hình hóa thanh dàn bằng phần tử dầm có khớp ở cả hai đầu, vẽ bằng chuột,
- kiểm tra lực trong thanh bằng phương pháp tách nút và phương pháp mặt cắt,
- nhận ra thanh không chịu lực, và hiểu vì sao mô hình nút khớp dùng được cho dàn.

::div{.actions}
[Mở EduBeam ↗](https://run.edubeam.app/?lang=vi){target="_blank"} [Đến phần kiểm tra bằng tính tay](#_5-check-by-hand)
::

::model-figure{caption="Dàn hoàn chỉnh: 30 kN tại nút 2 và 3, lực dọc trong các thanh (kéo mang dấu dương)"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N, w]
show: [nodeLabels, dimensions]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Bài toán {#the-problem}

- Nhịp 12 m chia thành ba khoang 4 m, chiều cao dàn 3 m: các nút 1 đến 4 nằm trên thanh cánh dưới, các nút 5 và 6 trên thanh cánh trên.
- Gối cố định tại nút 1 và gối di động tại nút 4.
- Hai lực 30 kN đặt tại các nút 2 và 3 của thanh cánh dưới.
- Các thanh bằng thép, $E = 210$ GPa, $A = 20$ cm².

| Phần tử | Thanh, theo nút | |
| --- | --- | --- |
| 1, 2, 3 | 1–2, 2–3, 3–4 | thanh cánh dưới |
| 4, 5, 6 | 1–5, 5–6, 6–4 | thanh xiên đầu dàn, thanh cánh trên, thanh xiên đầu dàn |
| 7, 8, 9 | 2–5, 5–3, 3–6 | thanh đứng, thanh xiên giữa, thanh đứng |

**Hệ có tĩnh định không?** Với $m = 9$ thanh, $r = 3$ phản lực và $j = 6$ nút thì $m + r = 12 = 2j$. Mỗi nút cho hai phương trình cân bằng, nên lực trong mọi thanh tìm được ngay từ các phương trình đó.

## Dựng mô hình {#model-it}

::div{.steps}

### Vật liệu và tiết diện {#_1-material-and-section}

1. Nhấp vào **Xóa kết cấu** trên thanh ứng dụng, đánh dấu **Xóa vật liệu** và **Xóa tiết diện**, rồi nhấp vào **Xác nhận**. Nút và phần tử lại được đánh số từ 1.
2. Thẻ **Vật liệu** → **Thư viện vật liệu** → **+** ở dòng **Thép (S235)**, rồi nhấp vào **Hủy** để đóng thư viện.
3. Thẻ **Tiết diện** → **Thêm tiết diện**. Nhập `0.002` vào **Diện tích** và `1e-6` vào **Iy**, giữ **Chiều cao** và **Hệ số hiệu chỉnh cắt** bằng `1`, rồi nhấp vào **Thêm tiết diện**.

Với thanh có khớp ở hai đầu, chỉ diện tích ảnh hưởng đến kết quả; $I_y$ chỉ cần lớn hơn không.

### Vẽ các thanh có khớp {#_2-draw-the-bars-with-hinges}

Trong EduBeam, thanh dàn là một phần tử dầm được đánh dấu **khớp ở cả hai đầu**. Công cụ vẽ bằng chuột có thể đánh dấu sẵn hai khớp này cho bạn, và nếu vẽ theo đúng thứ tự dưới đây, các phần tử sẽ được đánh số như trong bảng trên.

1. Thẻ **Phần tử** → nút bấm **Thêm phần tử** thứ hai, nút có biểu tượng con trỏ chuột.
2. Trên thanh thông báo ở phía trên vùng hiển thị, đánh dấu **Khớp đầu** và **Khớp cuối**. Từ giờ, mọi thanh bạn vẽ đều có khớp ở cả hai đầu.
3. Thanh cánh dưới: nhấp tại (0, 0), (4, 0), (8, 0) và (12, 0), rồi nhấn <kbd>Esc</kbd>.
4. Phần phía trên: nhấp lại vào nút bấm **Thêm phần tử**, rồi lần lượt nhấp vào nút 1 tại (0, 0), các điểm (4, −3), (8, −3) và nút 4 tại (12, 0). Nhấp vào một nút đã có thì thanh được nối vào nút đó chứ không tạo nút mới. Nhấn <kbd>Esc</kbd>.
5. Các thanh bụng: nhấp vào **Thêm phần tử** một lần nữa, rồi nhấp vào nút 2 tại (4, 0), nút 5 tại (4, −3), nút 3 tại (8, 0) và nút 6 tại (8, −3). Nhấn <kbd>Esc</kbd>, rồi <kbd>F</kbd> để đưa kết cấu vừa màn hình.

Bảng **Phần tử** giờ phải liệt kê đúng chín phần tử như bảng trên, phần tử nào cũng được đánh dấu cả hai ô **Khớp đầu thanh**. <kbd>Esc</kbd> thoát chế độ vẽ, nhưng hai ô khớp trên thanh thông báo vẫn giữ dấu cho lần vẽ sau.

### Gối tựa và tải trọng {#_3-supports-and-loads}

1. Nhấp vào nút 1 → **Gối tựa tại nút** → biểu tượng **Gối cố định**. Đặt **Gối di động** cho nút 4.
2. Nhấp vào nút 2 → **Thêm tải trọng** → `Fz = 30` → **Thêm tải nút**. Làm tương tự tại nút 3.

`Fz` dương hướng xuống. Mọi thanh nối vào một nút dàn đều có khớp, nên không có gì giữ cho nút khỏi xoay; EduBeam chấp nhận điều đó và báo góc xoay của những nút như vậy bằng 0.

::

## Kết quả {#_4-results}

Trong tùy chọn hiển thị ở góc trên bên phải vùng hiển thị (biểu tượng bánh răng để hiện hoặc ẩn các tùy chọn này), bỏ đánh dấu **Biến dạng** và **M<sub>y</sub> (x)**, vì dàn không chịu uốn, rồi đánh dấu **N (x)**. Lực kéo mang dấu dương, và EduBeam ghi lực theo kN với hai chữ số thập phân.

- Cả hai gối đều ghi `30,00` hướng lên; phản lực ngang của gối cố định ghi `0,00`, vì không có tải trọng ngang.
- Cả ba thanh cánh dưới ghi `40,00`, chịu kéo; thanh cánh trên ghi `-40,00`, chịu nén.
- Thanh xiên giữa 5–3 không chịu lực, nên không có nhãn, như trên hình ở đầu trang.
- Thẻ **Kết quả** → **Kết quả tại nút**: nút 2 chuyển vị xuống $D_z$ = `2,2937 · 10⁻³ m`, tức 2,294 mm.

## Kiểm tra bằng tính tay {#_5-check-by-hand}

**Phản lực.** Tải trọng đối xứng, nên $R_1 = R_4 = 30$ kN hướng lên. Không có tải trọng ngang, nên phản lực ngang của gối cố định bằng không.

**Nút 1** (phương pháp tách nút). Thanh xiên đầu dàn 1–5 dài 5 m, nên $\sin\alpha = 3/5$ và $\cos\alpha = 4/5$:

$$
\textstyle\sum F_z:\ N_{15} \cdot \tfrac{3}{5} = -30 \ \Rightarrow\ N_{15} = -50\ \text{kN}
$$

$$
\textstyle\sum F_x:\ N_{12} = -N_{15} \cdot \tfrac{4}{5} = 40\ \text{kN}
$$

**Nút 2.** Thanh đứng 2–5 là thanh duy nhất có thể truyền lực 30 kN lên trên: $N_{25} = +30$ kN, và $N_{23} = N_{12} = 40$ kN.

**Mặt cắt qua khoang giữa** (phương pháp mặt cắt). Cắt qua các thanh 5–6, 5–3 và 2–3, rồi xét phần bên trái:

- Mô men đối với nút 3: $R_1 \cdot 8 - 30 \cdot 4 + N_{56} \cdot 3 = 0 \Rightarrow N_{56} = -40$ kN.
- Hình chiếu lên phương đứng: lực cắt trong khoang là $R_1 - 30 = 0$, nên thanh xiên giữa **5–3 không chịu lực**: $N_{53} = 0$.

| Thanh | Tính tay | EduBeam |
| --- | --- | --- |
| Thanh cánh dưới 1–2, 2–3, 3–4 | +40 kN, kéo | 40,00 |
| Thanh cánh trên 5–6 | −40 kN, nén | −40,00 |
| Thanh xiên đầu dàn 1–5, 6–4 | −50 kN | −50,00 |
| Thanh đứng 2–5, 3–6 | +30 kN | 30,00 |
| Thanh xiên giữa 5–3 | 0 | không có nhãn |

Thanh không chịu lực không phải là thanh thừa: nó không chịu lực dưới tải trọng *này*, nhưng bỏ nó đi thì dàn sụp, như các thử nghiệm dưới đây cho thấy.

::callout{type="details" title="Độ võng của nút 2 tính bằng nguyên lý công khả dĩ"}
Đặt một lực đơn vị hướng xuống tại nút 2 và giải lại dàn bằng tay: $R_1 = 2/3$, $R_4 = 1/3$, lực trong các thanh $n$ ghi ở bảng dưới. Độ võng là $\delta = \sum N\,n\,L / (EA)$:

| Thanh | $N$ (kN) | $n$ | $L$ (m) | $N\,n\,L$ |
| --- | --- | --- | --- | --- |
| 1–2 | 40 | 8/9 | 4 | 142,2 |
| 2–3 | 40 | 8/9 | 4 | 142,2 |
| 3–4 | 40 | 4/9 | 4 | 71,1 |
| 1–5 | −50 | −10/9 | 5 | 277,8 |
| 5–6 | −40 | −4/9 | 4 | 71,1 |
| 6–4 | −50 | −5/9 | 5 | 138,9 |
| 2–5 | 30 | 1 | 3 | 90,0 |
| 5–3 | 0 | −5/9 | 5 | 0 |
| 3–6 | 30 | 1/3 | 3 | 30,0 |
| | | | tổng | 963,3 |

$$
\delta_2 = \frac{963{,}3}{EA} = \frac{963{,}3}{210 \times 10^6 \cdot 0{,}002} = 0{,}002294\ \text{m}
$$

Tức 2,294 mm, đúng bằng $D_z$ của nút 2 trong EduBeam, `2,2937 · 10⁻³` m.
::

## Thử nghiệm {#_6-experiment}

Mỗi lần chỉ thay đổi một thứ, dự đoán kết quả trước rồi mới xem. <kbd>Ctrl</kbd>+<kbd>Z</kbd> hoàn tác từng thay đổi.

**Dời một tải trọng.** Dồn cả hai tải trọng vào nút 2: xóa tải trọng tại nút 3 và đổi tải trọng còn lại thành `Fz = 60`. Lúc này $R_1 = 40$ kN, lực cắt trong khoang giữa là $40 - 60 = -20$ kN, và thanh xiên giữa phải chịu lực cắt đó: $N_{53} = -20 \cdot 5/3 = -33{,}33$ kN, tức chịu nén.

::model-figure{caption="60 kN tại nút 2: thanh xiên giữa 5–3 giờ chịu lực cắt của khoang"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: roller }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 60 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

**Bỏ thanh xiên giữa.** Xóa phần tử 8. Khoang giữa trở thành một hình chữ nhật có khớp ở bốn góc, có thể bị xô lệch sang ngang. EduBeam không hiện kết quả, báo *Khớp tại các nút 2, 3, 5, 6 cho phép kết cấu chuyển động.* – đó là bốn góc của khoang – và cho thấy chuyển động đó bằng hoạt ảnh.

**Bỏ đánh dấu mọi khớp** trong bảng **Phần tử**. Dàn trở thành khung có nút cứng. Đánh dấu **M<sub>y</sub> (x)**: mô men uốn đều nhỏ hơn 0,1 kNm, còn lực dọc thay đổi chưa đến 0,1 %. Đó là lý do giả thiết nút khớp dùng được cho dàn có các thanh tạo thành tam giác.

**Đổi cả hai gối thành gối cố định.** Phản lực thứ tư làm dàn thành hệ siêu tĩnh bậc một, và kết quả có thể khiến bạn bất ngờ: thanh cánh dưới giờ **không chịu lực**, còn mỗi gối đẩy vào trong 40 kN. Nút 1 và nút 4 không thể dịch ra xa nhau, nên ba thanh cánh dưới nằm thẳng hàng giữa chúng phải có tổng độ dãn dài bằng không. Cả ba thanh chịu cùng một lực, nên lực đó bằng không, và lực 40 kN ấy chuyển sang các gối. Kết luận này đúng với mọi diện tích thanh.

::model-figure{caption="Cả hai gối đều là gối cố định: các gối làm thay nhiệm vụ của thanh cánh dưới"}
---
nodes: { 1: [0, 0], 2: [4, 0], 3: [8, 0], 4: [12, 0], 5: [4, -3], 6: [8, -3] }
supports: { 1: pin, 4: pin }
members:
  - { nodes: [1, 2], hinges: [true, true] }
  - { nodes: [2, 3], hinges: [true, true] }
  - { nodes: [3, 4], hinges: [true, true] }
  - { nodes: [1, 5], hinges: [true, true] }
  - { nodes: [5, 6], hinges: [true, true] }
  - { nodes: [6, 4], hinges: [true, true] }
  - { nodes: [2, 5], hinges: [true, true] }
  - { nodes: [5, 3], hinges: [true, true] }
  - { nodes: [3, 6], hinges: [true, true] }
loads:
  - { node: 2, fz: 30 }
  - { node: 3, fz: 30 }
results: [N]
show: [nodeLabels]
section: { a: 0.002, iy: 1.0e-6, h: 0.1 }
---
::

## Bước tiếp theo {#next-steps}

Lý thuyết về phần tử này có ở trang [Phần tử thanh dàn](/vi/elements/truss).

::card-grid{cols="2"}
:::card{title="Luyện tập: dàn Warren" icon="lucide:dices" to="/vi/practice?p=T2048"}
Tìm phản lực và lực dọc trong một thanh của một dàn lớn hơn; đáp số được kiểm tra ngay. Bắt đầu với mã bài T2048; muốn có thêm bài, chỉ giữ chọn **Dàn Warren** và nhấn **Bài mới**.
:::
:::card{title="Tiếp theo: dầm liên tục và lún gối tựa" icon="lucide:spline" to="/vi/tutorials/continuous-beam"}
Một dầm siêu tĩnh: tính liên tục mang lại điều gì, gối tựa bị lún ảnh hưởng ra sao, và phương pháp lực để kiểm tra cả hai.
:::
::
