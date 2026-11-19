---
description: "Hướng dẫn: mô hình hóa dầm liên tục hai nhịp siêu tĩnh trong EduBeam, so sánh với hai dầm đơn giản, cho gối giữa bị lún và kiểm tra mọi con số bằng phương pháp lực. Khoảng 25 phút."
source: site
---

# Hướng dẫn: dầm liên tục và lún gối tựa

Mô hình hóa một dầm liên tục hai nhịp, so sánh nó với hai dầm đơn giản, rồi cho gối giữa lún 10 mm. Chỉ với các phương trình cân bằng thì không tìm được phản lực của dầm này, nên bạn sẽ kiểm tra chúng bằng phương pháp lực.

- **Thời gian:** khoảng 25 phút. Đây là bài cuối cùng và nhiều nội dung nhất trong bốn bài hướng dẫn.
- **Cần chuẩn bị:** EduBeam mở ở một thẻ khác của trình duyệt, trên máy tính có chuột và bàn phím. Nếu bạn chưa từng dùng EduBeam, hãy làm trước phần [Bắt đầu nhanh](/vi/guide/quick-start) hoặc một trong các bài hướng dẫn trước bài này.
- **Kiến thức cần có:** phương pháp lực với một ẩn số thừa, và độ võng giữa nhịp của dầm đơn giản: $5qL^4/(384EI)$ dưới tải phân bố đều và $FL^3/(48EI)$ dưới lực tập trung.
- **Đơn vị:** SI. Ô đơn vị ở góc dưới bên phải vùng hiển thị phải ghi `m m² kN kNm MPa`. Nếu ô này hiện feet và kip, nhấp vào nó và đặt **Hệ đơn vị** thành **SI (hệ mét)**.

**Bạn sẽ học cách**

- thấy được lợi ích của tính liên tục: mô men và độ võng nhỏ hơn so với dầm đơn giản,
- khai báo lún gối tựa bằng chuyển vị cưỡng bức, và đọc nội lực do riêng nó gây ra,
- kiểm tra một dầm siêu tĩnh bằng phương pháp lực, và hiểu vì sao dầm càng cứng thì càng chịu ảnh hưởng nặng khi gối bị lún.

::div{.actions}
[Mở EduBeam ↗](https://run.edubeam.app/?lang=vi){target="_blank"} [Đến phần kiểm tra bằng tính tay](#check-by-hand)
::

::model-figure{caption="Dầm hoàn chỉnh: hai nhịp 6 m chịu 10 kN/m, trước khi gối lún"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, V, w]
show: [nodeLabels, dimensions]
---
::

## Bài toán {#the-problem}

- Hai nhịp $L = 6$ m: gối cố định tại nút 1, gối di động tại nút 2 và 3.
- Tải phân bố đều $q = 10$ kN/m trên cả hai nhịp.
- Thép, $E = 210$ GPa, và $I_y = 8{,}356 \times 10^{-5}$ m⁴ (thép hình IPE 300), nên $EI = 17\,547{,}6$ kNm².
- Ở phần thứ hai, gối giữa tại nút 2 lún $\Delta = 10$ mm.

**Hệ có tĩnh định không?** Bốn phản lực (hai tại nút 1, mỗi nút 2 và 3 một phản lực) nhưng chỉ có ba phương trình cân bằng: dầm là hệ siêu tĩnh bậc một. Phương trình còn thiếu đến từ điều kiện biến dạng: nút 2 không chuyển vị, hoặc chuyển vị đúng bằng $\Delta$.

## Dựng mô hình {#model-it}

::div{.steps}

### Vật liệu và tiết diện {#material-and-section}

1. Nhấp vào **Xóa kết cấu** trên thanh ứng dụng, đánh dấu **Xóa vật liệu** và **Xóa tiết diện**, rồi nhấp vào **Xác nhận**. Nút và phần tử lại được đánh số từ 1.
2. Thẻ **Vật liệu** → **Thư viện vật liệu** → **+** ở dòng **Thép (S235)**, rồi nhấp vào **Hủy** để đóng thư viện.
3. Thẻ **Tiết diện** → **Thêm tiết diện**. Nhập `8.356e-5` vào **Iy**, giữ **Diện tích**, **Chiều cao** và **Hệ số hiệu chỉnh cắt** bằng `1`, rồi nhấp vào **Thêm tiết diện**.

Với diện tích 1 m², dầm hầu như không biến dạng trượt, đúng như giả thiết của phép tính tay. Lần này $I_y$ ảnh hưởng cả đến nội lực; bạn sẽ thấy điều đó ở phần sau.

### Vẽ dầm {#draw-the-beam}

1. Thẻ **Phần tử** → nút bấm **Thêm phần tử** thứ hai, nút có biểu tượng con trỏ chuột.
2. Nhấp tại (0, 0), (6, 0) và (12, 0).
3. Nhấn <kbd>Esc</kbd> để dừng vẽ, rồi <kbd>F</kbd> để đưa kết cấu vừa màn hình.

Ba nút và hai phần tử. Kiểm tra tọa độ trong bảng **Nút**.

### Gối tựa {#supports}

Nhấp vào nút 1 → **Gối tựa tại nút** → biểu tượng **Gối cố định**. Đặt **Gối di động** cho nút 2 và 3.

### Tải trọng {#load}

Thẻ **Tải trọng** → **Thêm tải phần tử** → *Tải phân bố đều* trên **Phần tử** `1`, `fz = 10` → **Thêm tải phần tử**. Lặp lại cho phần tử 2.

::

## Kết quả {#results}

Mô men uốn, phản lực và sơ đồ biến dạng được bật sẵn. Để xem lực cắt, đánh dấu **V<sub>z</sub> (x)** trong tùy chọn hiển thị ở góc trên bên phải vùng hiển thị (biểu tượng bánh răng để hiện hoặc ẩn các tùy chọn này). EduBeam ghi biểu đồ và phản lực theo kN và kNm với hai chữ số thập phân.

- Phản lực ghi `22,50` tại nút 1 và 3, và `75,00` tại nút 2: gối giữa chịu hơn một nửa trong tổng số 120 kN.
- Mô men trên gối giữa (nút 2) ghi `-45,00`, tức mô men âm. Trong các nhịp, mô men dương lớn nhất là `25,31` kNm, cách gối biên 2,25 m.
- Lực cắt nhảy từ `-37,50` lên `37,50` tại nút 2.

### So sánh với hai dầm đơn giản {#compare-with-two-simple-spans}

Tính liên tục mang lại lợi ích gì? Hãy thử bỏ nó đi: trong bảng **Phần tử**, đánh dấu khớp ở **cuối** phần tử 1, tại nút 2. Dầm trở thành hai dầm đơn giản nhịp 6 m, một hệ tĩnh định.

::model-figure{caption="Có khớp trên nút 2: hai dầm đơn giản, mỗi dầm có qL²/8 = 45 kNm"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [{ nodes: [1, 2], hinges: [false, true] }, [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M, w]
show: [nodeLabels]
---
::

| | Dầm liên tục | Hai dầm đơn giản |
| --- | --- | --- |
| Phản lực tại nút 1, 2, 3 | 22,5; 75; 22,5 kN | 30; 60; 30 kN |
| Mô men trên nút 2 | −45 kNm | 0 |
| Mô men dương lớn nhất | 25,31 kNm | 45 kNm |
| Độ võng lớn nhất, khi xem $w(x)$ trên các hình | 4,000 mm | 9,617 mm |

Trị số mô men lớn nhất vẫn là 45 kNm, nhưng ở dầm liên tục nó nằm trên gối giữa, còn mô men dương trong các nhịp nhỏ hơn hẳn. Mỗi nhịp cũng cứng hơn 2,4 lần: đầu nhịp trên nút 2 không xoay được, gần như bị ngàm. Bỏ đánh dấu khớp trước khi làm tiếp.

## Lún gối giữa {#settle-the-middle-support}

Bây giờ cho nút 2 lún xuống 10 mm, như khi móng đặt trên nền đất yếu bị lún.

::div{.steps}

### Khai báo độ lún {#prescribe-the-settlement}

Nhấp vào nút 2 → **Chuyển vị cưỡng bức**. Trong hộp thoại mở ra, loại **Chuyển vị cưỡng bức** đã được chọn sẵn; nhập `0.01` vào **Dz** rồi nhấp vào **Thêm tải nút**.

![Hộp thoại chuyển vị cưỡng bức: chỉ đặt được Dz, phương mà gối di động giữ](/screenshots/vi/p2t-prescribe-displacement.webp){.shot-sm}

Với hệ đơn vị SI mặc định, chuyển vị tính bằng mét, nên 10 mm là `0.01`; chiều dương hướng xuống. Chỉ đặt được chuyển vị theo các phương bị chặn: gối di động có thể bị dời xuống, nhưng không dời sang ngang được. Xem thêm ở mục [Chuyển vị cưỡng bức](/vi/essentials/loads#prescribed-displacements-support-settlements).

### Đọc kết quả mới {#read-the-new-results}

Phản lực ở gối giữa giảm còn `70,13` kN, còn phản lực ở hai gối biên tăng lên `24,94` kN. Mô men trên nút 2 giảm còn `-30,38` kNm, và mô men dương trong các nhịp tăng lên, tới `31,09` kNm.

::model-figure{caption="Nút 2 lún 10 mm: mô men âm trên gối giảm, các nhịp phải chịu nhiều hơn"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

### Xét riêng ảnh hưởng của lún {#look-at-the-settlement-alone}

Xóa hai tải trọng phần tử: chọn từng tải và nhấn <kbd>Delete</kbd>, hoặc dùng dấu × ở dòng của nó trong bảng **Tải trọng**. Phần còn lại là ảnh hưởng của riêng độ lún: biểu đồ mô men hình tam giác, `14,62` kNm trên nút 2, căng thớ dưới, và các phản lực kéo nút 2 **xuống** `4,87` kN, trong khi nút 1 và nút 3 mỗi nút được đẩy lên `2,44` kN. Các gối buộc dầm phải cong theo vị trí mới, dầm chống lại, và chính sức chống ấy là nguyên nhân duy nhất gây ra nội lực.

::model-figure{caption="Chỉ có lún gối: không có tải trọng, nhưng dầm vẫn bị uốn và các gối có phản lực"}
---
nodes: { 1: [0, 0], 2: [6, 0], 3: [12, 0] }
supports: { 1: pin, 2: roller, 3: roller }
members: [[1, 2], [2, 3]]
loads:
  - { node: 2, settlement: { dz: 0.01 } }
results: [M, w]
show: [nodeLabels]
---
::

Cộng kết quả này với kết quả do riêng tải trọng gây ra, bạn được kết quả của dầm chịu tải có gối đã lún: 75 − 4,87 = 70,13 kN, −45 + 14,62 = −30,38 kNm. Bài toán là tuyến tính, nên áp dụng được nguyên lý cộng tác dụng.

### Cắt tính liên tục lần nữa {#cut-the-continuity-again}

Khôi phục các tải trọng bằng <kbd>Ctrl</kbd>+<kbd>Z</kbd>, nhấn một lần cho mỗi tải đã xóa, rồi lại đánh dấu khớp ở cuối phần tử 1. Giờ các nhịp đã lún chỉ nghiêng đi: phản lực và mô men đúng bằng phản lực và mô men của hai dầm đơn giản, dù độ lún là bao nhiêu, và nếu không có tải trọng thì chúng bằng không. **Lún gối tựa chỉ gây ra nội lực trong hệ siêu tĩnh.** Bỏ đánh dấu khớp trước khi làm tiếp.

::

## Kiểm tra bằng tính tay {#check-by-hand}

Dùng phương pháp lực. Bỏ gối tựa tại nút 2 và thay nó bằng phản lực chưa biết $R_2$, hướng lên, tác dụng lên dầm đơn giản nhịp $2L = 12$ m.

**Độ võng tại nút 2 của hệ cơ bản.** Do tải trọng, và do lực đơn vị hướng lên đặt tại nút 2:

$$
\delta_q = \frac{5q\,(2L)^4}{384\,EI} = \frac{5 \cdot 10 \cdot 12^4}{384 \cdot 17\,547{,}6} = 0{,}15387\ \text{m}
$$

$$
\delta_{1} = \frac{(2L)^3}{48\,EI} = \frac{12^3}{48 \cdot 17\,547{,}6} = 0{,}0020516\ \text{m/kN}
$$

**Điều kiện tương thích chuyển vị.** $R_2$ phải đẩy nút 2 lên lại đúng vị trí của gối: về 0, hoặc thấp hơn một đoạn $\Delta$.

$$
R_2\,\delta_1 = \delta_q - \Delta \quad\Rightarrow\quad R_2 = \frac{\delta_q - \Delta}{\delta_1}
$$

**Các đại lượng còn lại** suy ra từ điều kiện cân bằng; mô men dương lớn nhất nằm ở chỗ lực cắt $R_1 - qx$ bằng không.

| | Công thức | Không lún | Nút 2 lún 10 mm |
| --- | --- | --- | --- |
| $R_2$ | $(\delta_q - \Delta)/\delta_1$ | 75,00 kN | 70,13 kN |
| $R_1 = R_3$ | $(2qL - R_2)/2$ | 22,50 kN | 24,94 kN |
| $M_2$ | $R_1 L - qL^2/2$ | −45,00 kNm | −30,38 kNm |
| $M_{\max}$ | $R_1^2/(2q)$ | 25,31 kNm | 31,09 kNm |

EduBeam cho đúng các giá trị này đến chữ số cuối cùng.

Khi không lún, đây là các giá trị quen thuộc trong giáo trình: $R_2 = 10qL/8$, $M_2 = -qL^2/8$ và $M_{\max} = 9qL^2/128$. Riêng độ lún làm các phản lực thay đổi $\Delta/\delta_1 = 4{,}874$ kN và mô men trên nút 2 thay đổi

$$
\Delta M_2 = \frac{\Delta}{\delta_1} \cdot \frac{2L}{4} = \frac{3\,EI\,\Delta}{L^2} = \frac{3 \cdot 17\,547{,}6 \cdot 0{,}01}{36} = 14{,}62\ \text{kNm}
$$

Hãy để ý $EI$ trong công thức. Nội lực do tải trọng chỉ phụ thuộc vào độ cứng *tương đối* giữa các thanh; nội lực do chuyển vị cưỡng bức tăng theo chính độ cứng. Khi gối bị lún, dầm càng cứng thì mô men phát sinh càng lớn.

## Thử nghiệm {#experiment}

Bắt đầu từ dầm chịu tải có gối đã lún, mỗi lần chỉ thay đổi một thứ, dự đoán kết quả trước rồi mới xem. <kbd>Ctrl</kbd>+<kbd>Z</kbd> hoàn tác từng thay đổi.

**Tăng gấp đôi độ cứng.** Trong bảng **Tiết diện**, đặt **Iy** bằng `1.6712e-4`. Ảnh hưởng của độ lún lên mô men trên nút 2 tăng gấp đôi, thành 29,25 kNm, và $M_2$ giảm còn −15,75 kNm. Nếu chỉ có tải trọng thì chỉ có độ võng thay đổi: giảm một nửa.

**Tìm độ lún làm mô men trên nút 2 bằng không.** Với $\Delta$ bằng bao nhiêu thì mô men trên nút 2 bằng không? Để $\Delta M_2 = 45$ kNm cần $\Delta = 45 L^2/(3EI) = qL^4/(24EI) = 0{,}0308$ m. Đổi độ lún thành `0.0308`, trong bảng **Tải trọng** hoặc bằng cách nhấp đúp vào nó trong vùng hiển thị: các phản lực thành 30, 60 và 30 kN, đúng như của hai dầm đơn giản, chỉ sai khác chút ít do làm tròn $\Delta$. $qL^4/(24EI)$ là góc xoay ở đầu một dầm đơn giản nhân với $L$: độ lún làm mỗi nhịp nghiêng vừa đủ để triệt tiêu điểm gãy trên nút 2, nên tính liên tục không còn tác dụng gì nữa.

**Thả nút 2.** Đổi độ lún thành `0.1539`, bằng độ võng $\delta_q$ của dầm cơ bản nhịp 12 m. Phản lực tại nút 2 giảm gần như về không, và dầm chịu tải như một dầm đơn giản duy nhất: 180 kNm ở giữa nhịp. Một gối lún nhiều đến thế không còn là gối tựa nữa.

**Nâng nút 2 lên.** Đổi độ lún thành `-0.01`, tức nâng lên 10 mm. Mọi thay đổi do lún gây ra đều đổi dấu: nút 2 giờ chịu 79,87 kN và mô men âm tăng lên −59,62 kNm.

Các phép kiểm tra khác bằng công thức giải tích, trong đó có lún gối của dầm một đầu ngàm, một đầu gối di động, có ở trang [Kiểm tra kết quả bằng tính tay](/vi/guide/verification#prescribed-displacement).

## Bước tiếp theo {#next-steps}

::card-grid{cols="2"}
:::card{title="Luyện tập: dầm liên tục hai nhịp" icon="lucide:dices" to="/vi/practice?p=K2049"}
Dầm hai nhịp chịu tải trên một nhịp hoặc cả hai nhịp, giải bằng phương pháp lực, đáp số được kiểm tra ngay. Bắt đầu với mã bài K2049; muốn có thêm bài, chỉ chọn **Dầm liên tục hai nhịp** và nhấn **Bài mới**.
:::
:::card{title="Ví dụ" icon="lucide:library" to="/vi/examples/"}
Đây là bài hướng dẫn cuối cùng. Trang Ví dụ còn nhiều mô hình để mở, thay đổi và kiểm tra, cùng các bài tập để giao cho sinh viên.
:::
::
