---
description: "Trong mười phút, dựng một dầm thép đơn giản trong EduBeam: vật liệu, tiết diện, nút, gối tựa và tải trọng, rồi đọc phản lực, biểu đồ và kiểm tra bằng tính tay."
source: site
---

# Bắt đầu nhanh

Trong khoảng mười phút, bạn sẽ dựng một dầm thép đơn giản, đọc phản lực, lực cắt, mô men uốn và độ võng của nó, rồi kiểm tra lại từng con số bằng tính tay. Hãy mở EduBeam ở một thẻ khác của trình duyệt hoặc đặt cạnh trang này để làm theo.

::div{.actions}
[Mở EduBeam ↗](https://run.edubeam.app/?lang=vi){target="_blank"} [Đến thẳng phần tính tay](#_8-check-by-hand)
::

## Bài toán {#the-problem}

Dầm dài 6 m, gối cố định tại nút 1 và gối di động tại nút 2, chịu tải phân bố đều 12 kN/m trên suốt chiều dài. Dầm bằng thép, tiết diện IPE 200: $E = 210$ GPa, $G = 81$ GPa, $A = 28{,}48\ \text{cm}^2$ và $I_y = 1943\ \text{cm}^4$. Cả bốn giá trị đều có sẵn trong thư viện của EduBeam, nên bạn không phải tra cứu gì.

::model-figure{caption="Dầm bạn sẽ dựng: nhịp 6 m từ nút 1 đến nút 2, chịu 12 kN/m"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: []
show: [nodeLabels, dimensions]
---
::

## Dựng mô hình {#build-the-model}

::div{.steps}

### Bắt đầu từ một mô hình trống {#start-from-an-empty-model}

Lần đầu mở ứng dụng, hộp thoại chào mừng hỏi bạn muốn bắt đầu thế nào. Trong **Hệ đơn vị**, chọn **SI (hệ mét)**; trong **Hệ tọa độ**, giữ **x sang phải, z xuống dưới**; rồi nhấn **Để sau**. Ứng dụng sẽ hiện một khung ví dụ nhỏ.

1. Nhấn **Xóa kết cấu** trên thanh ứng dụng (trên điện thoại, mục này nằm trong menu **☰**).
2. Đánh dấu **Xóa vật liệu** và **Xóa tiết diện**, rồi nhấn **Xác nhận**.

Khung vẽ giờ đã trống, và hai thông báo màu đỏ cho biết chưa có vật liệu và tiết diện nào. Các bước sau sẽ khắc phục điều đó. Không có gì bị mất: <kbd>Ctrl</kbd>+<kbd>Z</kbd> đưa khung ví dụ trở lại, và khung này cũng được lưu trong **☰ → Kết cấu gần đây**.

### Kiểm tra đơn vị {#_1-check-the-units}

Ô đơn vị ở góc dưới bên phải vùng hiển thị liệt kê các đơn vị mà mọi ô nhập và mọi kết quả đang dùng. Trang này dùng đơn vị SI, ô đơn vị hiện là `m m² kN kNm MPa`, và trục z hướng xuống. Nếu ô đơn vị hiện feet và kip, hãy nhấp vào nó và đặt **Hệ đơn vị** thành **SI (hệ mét)**. Cũng tại đó, **Hệ tọa độ** phải là **x sang phải, z xuống dưới**: với trục y hướng lên, tải trọng dương hướng lên trên và dấu trên trang này sẽ không khớp.

![Nút bấm bật/tắt lưới (G) và bắt dính (S), dấu thập và ô đơn vị](/screenshots/vi/ui-grid-units.webp){.shot-sm}

### Thêm vật liệu và tiết diện {#_2-add-the-material-and-cross-section}

Phần tử nào cũng cần vật liệu và tiết diện, nên trước hết hãy lấy chúng từ thư viện.

1. Mở thẻ **Vật liệu** ở thanh dưới cùng và nhấp **Thư viện vật liệu**.
2. Nhấn **+** ở dòng **Thép (S235)** ($E = 210\,000$ MPa, $G = 81\,000$ MPa). Thư viện vẫn mở để bạn thêm tiếp, nên hãy đóng nó bằng **Hủy**.
3. Mở thẻ **Tiết diện** và nhấp **Thư viện tiết diện**.
4. Cuộn đến dòng **IPE 200 (gần đúng)**, nhấn **+** rồi đóng thư viện bằng **Hủy**.

Cả hai thông báo màu đỏ đã biến mất, và thẻ **Tiết diện** liệt kê IPE 200:

![IPE 200 trong thẻ Tiết diện: diện tích, Iy, chiều cao và hệ số hiệu chỉnh cắt](/screenshots/vi/a-qs-cross-sections.webp)

Nếu muốn tự nhập giá trị, hãy dùng **Thêm vật liệu** và **Thêm tiết diện**. Hệ số hiệu chỉnh cắt, ở đây là 0,3933, sẽ xuất hiện lại trong [phần tính tay](#_8-check-by-hand).

### Thêm nút {#_3-add-the-nodes}

1. Mở thẻ **Nút**. Thẻ này có hai nút bấm **Thêm nút**: nút bấm **+** mở hộp thoại, còn nút bấm có biểu tượng con trỏ đặt nút bằng chuột. Nhấp **+ Thêm nút**.
2. Để **Tọa độ X** và **Tọa độ Z** bằng `0` và nhấn **Thêm nút**. Hộp thoại đóng lại và nút `1` xuất hiện.
3. Nhấp **+ Thêm nút** lần nữa, nhập `6` vào **Tọa độ X** và nhấn **Thêm nút**. Đây là nút `2`.

![Hộp thoại Thêm nút mới. Bạn cũng có thể đặt gối tựa ngay tại đây.](/screenshots/vi/qs-node.webp){.shot-md}

### Nối chúng bằng một phần tử {#_4-connect-them-with-an-element}

Mở thẻ **Phần tử** và nhấp **+ Thêm phần tử**. Hộp thoại đã đề xuất sẵn **Nút đầu** `1`, **Nút cuối** `2`, cùng vật liệu và tiết diện của bạn. Nhấn **Thêm phần tử**.

![Thêm phần tử mới: hai nút ở hai đầu, khớp tùy chọn ở mỗi đầu, vật liệu và tiết diện](/screenshots/vi/a-qs-element.webp){.shot-md}

Một dầm xuất hiện giữa hai nút. Nhấn <kbd>F</kbd> để dầm vừa khít màn hình. Nhãn màu xanh lam **Cần gối tựa** ở góc trên bên trái vùng hiển thị cho biết vì sao chưa có kết quả.

### Thêm gối tựa {#_5-add-the-supports}

Quay lại thẻ **Nút**: mỗi dòng có một bộ chọn gối tựa ở đầu cột **Bậc tự do bị chặn**.

- Nút `1`: chọn **Gối cố định**. Thao tác này đánh dấu `Dx` và `Dz`.
- Nút `2`: chọn **Gối di động**. Thao tác này chỉ đánh dấu `Dz`.

![Bộ chọn gối tựa trong bảng Nút](/screenshots/vi/a-qs-support-picker.webp){.shot-lg}

Nhãn **Cần gối tựa** biến mất. Bạn cũng có thể nhấp vào một nút trong vùng hiển thị và chọn **Gối tựa tại nút**. Trang [Nút và gối tựa](/vi/essentials/nodes-supports#supports) liệt kê mọi loại gối tựa.

### Thêm tải trọng {#_6-add-the-load}

1. Mở thẻ **Tải trọng** và nhấp **Thêm tải phần tử**.
2. Giữ **Loại tải trọng** là *Tải phân bố đều* và **Phần tử** là `1`.
3. Nhập `12` vào **fz**, để **fx** bằng `0` và nhấn **Thêm tải phần tử**.

![Hộp thoại hiện trước tải trọng trên phần tử](/screenshots/vi/a-qs-load.webp){.shot-md}

`fz` dương hướng theo chiều +z, tức là **xuống dưới**, nên giá trị dương tác dụng theo chiều trọng lực. Ô **LCS** (hệ tọa độ địa phương) được đánh dấu nghĩa là tải trọng đi theo hệ trục riêng của phần tử; với một dầm nằm ngang vẽ từ trái sang phải, hệ trục này trùng với hệ trục tổng thể. Xem [quy ước dấu](/vi/elements/conventions#loads).

::

## Đọc kết quả {#_7-read-the-results}

EduBeam giải dầm ngay khi có tải trọng và giải lại sau mỗi thay đổi của bạn: không có nút bấm *Giải*. Bảng ở góc trên bên phải vùng hiển thị dùng để bật, tắt các hình vẽ. **Biến dạng**, **M<sub>y</sub>(x)** và **Phản lực** được bật sẵn. Đánh dấu **V<sub>z</sub>(x)** để thêm lực cắt.

![Tùy chọn hiển thị, với lực cắt đã được bật](/screenshots/vi/a-qs-display.webp){.shot-md}

Màn hình của bạn lúc này sẽ giống hình dưới đây. Hãy chuyển qua lại giữa mô men uốn và lực cắt:

::model-figure{caption="Dầm hoàn chỉnh: phản lực 36 kN và 54 kNm ở giữa nhịp"}
---
nodes: { 1: [0, 0], 2: [6, 0] }
supports: { 1: pin, 2: roller }
members: [[1, 2]]
loads:
  - { member: 1, qz: 12 }
results: [M, V]
show: [nodeLabels]
---
::

| Hình vẽ | Cần chú ý |
| --- | --- |
| **Phản lực** | Hai mũi tên hướng lên, mỗi gối tựa một mũi tên **36 kN**. |
| **V<sub>z</sub>(x)** | Đường thẳng từ **+36 kN** tại nút `1` đến **−36 kN** tại nút `2`, bằng không ở giữa nhịp. |
| **M<sub>y</sub>(x)** | Đường parabol, đỉnh **54 kNm** ở giữa nhịp, vẽ về phía thớ chịu kéo, bên dưới dầm. |
| **Biến dạng** | Dầm võng xuống đối xứng, vẽ phóng đại. |

Để xem các con số, mở thẻ **Kết quả**. **Kết quả tại nút** liệt kê chuyển vị `Dx`, `Dz` và góc xoay `Ry` của từng nút; **Kết quả phần tử** liệt kê nội lực đầu phần tử của từng phần tử theo hệ trục riêng của nó. Nút `1` xoay một góc $R_y = -2{,}6469 \cdot 10^{-2}$ rad, nút `2` xoay một góc đúng bằng thế theo chiều ngược lại. Trang [Kết quả và biểu đồ](/vi/essentials/results) giải thích mọi bảng và mọi quy ước dấu.

Nếu biểu đồ trông quá lớn hoặc quá nhỏ, hãy đổi **Tỷ lệ kết quả** trong **Cài đặt → Cài đặt hiển thị**.

## Kiểm tra bằng tính tay {#_8-check-by-hand}

Với $q = 12$ kN/m và $L = 6$ m, các công thức trong giáo trình cho:

| Đại lượng | Công thức | Tính tay | EduBeam |
| --- | --- | --- | --- |
| Phản lực | $qL/2$ | 36 kN | 36 kN |
| Lực cắt lớn nhất | $qL/2$ | 36 kN | 36 kN |
| Mô men lớn nhất | $qL^2/8$ | 54 kNm | 54 kNm |
| Góc xoay tại gối | $qL^3/(24EI)$ | 0,02647 rad | 0,02647 rad |
| Độ võng giữa nhịp | $w_b + w_s$ | 49,63 + 0,60 = 50,22 mm | 50,22 mm |

Độ võng gồm hai phần, và phần lớn giáo trình chỉ xét phần thứ nhất:

- **Do uốn:** $w_b = 5qL^4/(384EI) = 49{,}63$ mm, với $EI = 4080$ kNm² tính từ $E = 210$ GPa và $I_y = 1943\ \text{cm}^4$.
- **Do cắt:** $w_s = qL^2/(8kGA) = 0{,}60$ mm, với $kGA \approx 90\,700$ kN tính từ $k = 0{,}3933$, $G = 81$ GPa và $A = 28{,}48\ \text{cm}^2$.

Ở giữa nhịp chưa có nút, nên hãy thêm một nút để đọc độ võng tại đó:

1. Trong thẻ **Nút**, nhấp nút bấm **Thêm nút** thứ hai (nút có biểu tượng con trỏ).
2. Nhấp lên dầm tại `x = 3`; khi bật bắt dính, nút sẽ nằm đúng trên điểm lưới. EduBeam hỏi bạn muốn làm gì với nút này: nhấn **Nối vào kết cấu**. Phần tử được chia thành `1a` và `1b`, tải trọng cũng được chia theo, và chế độ đặt nút kết thúc. Nếu trong thẻ **Nút**, nút `3` không nằm tại X = `3`, hãy nhập `3` vào đó.
3. Trong **Kết quả → Kết quả tại nút**, nút `3` giờ có $D_z = 5{,}0224 \cdot 10^{-2}$ m, tức là 50,22 mm.

![Kết quả tại nút sau khi chia dầm: nút 3 chuyển vị xuống 50,22 mm](/screenshots/vi/a-qs-nodal-results.webp){.shot-lg}

Chia dầm không làm thay đổi kết quả nào, vì với các tải trọng này phần tử cho lời giải chính xác: không cần chia lưới mịn hơn.

::callout{type="details" title="Vì sao hệ số hiệu chỉnh cắt lại quan trọng"}
EduBeam dùng phần tử dầm Timoshenko, có kể đến biến dạng trượt. Hệ số hiệu chỉnh cắt $k$ nhân với diện tích để ra phần diện tích chịu cắt, nên $kGA$ là độ cứng chống cắt. Với tiết diện chữ I trong thư viện, $k$ là tỷ lệ diện tích bản bụng trên toàn tiết diện, $h t_w / A$: với IPE 200, $0{,}2 \cdot 0{,}0056 / 0{,}002848 = 0{,}3933$. Phần độ võng do cắt, $w_s = qL^2/(8kGA)$, là tích phân của $V/(kGA)$ từ gối tựa đến giữa nhịp.

Với dầm mảnh này, phần do cắt là 0,60 mm, khoảng 1 % tổng độ võng. Với dầm ngắn và cao, phần này lớn hơn nhiều. Nếu đặt hệ số hiệu chỉnh cắt bằng một số rất lớn (chẳng hạn `1e10`) trong thẻ **Tiết diện**, EduBeam sẽ cho độ võng chỉ do uốn là 49,63 mm. Lý thuyết được trình bày ở trang [Phần tử dầm](/vi/elements/beam).
::

Các cách kiểm tra bằng tính tay khác (dầm công xôn, dầm hai đầu ngàm, dàn, nhiệt độ, lún gối tựa) có trong trang [Kiểm tra kết quả bằng tính tay](/vi/guide/verification).

## Thử nghiệm {#_9-experiment}

Hãy sửa mô hình và xem biểu đồ thay đổi theo. Thử từng thay đổi một, và hoàn tác bằng <kbd>Ctrl</kbd>+<kbd>Z</kbd> trước khi sang thay đổi tiếp theo. Nút `3` là nút giữa nhịp bạn vừa thêm.

- **Kéo nút `2`** sang phải. Mô men tăng theo $L^2$, độ võng tăng theo $L^4$.
- **Đánh dấu `Ry` tại nút `1`** để ngàm đầu đó lại. Tại ngàm xuất hiện mô men âm: theo công thức giáo trình là $qL^2/8 = 54$ kNm, trong EduBeam là 53,8 kNm. Ở dầm siêu tĩnh, độ cứng chống cắt cũng làm thay đổi nội lực.
- **Đánh dấu `Dz` tại nút `3`** để thêm một gối tựa ở giữa, biến dầm thành dầm liên tục hai nhịp. Mô men trên gối giữa chuyển thành mô men âm: tính tay $q(L/2)^2/8 = 13{,}5$ kNm, trong EduBeam là 13,3 kNm, cũng vì lý do trên.
- **Đánh dấu `Dz` tại nút `3`, và ô thứ hai trong cột *Khớp đầu thanh* của phần tử `1a`** (đầu nối vào nút `3`) trong thẻ **Phần tử**. Dầm trở thành hai dầm đơn giản nhịp 3 m. Giờ bỏ đánh dấu `Dz` tại nút `3`: dầm trở thành hệ biến hình, và EduBeam cho thấy hệ có thể chuyển động ra sao.

Để thử đổi nhịp và tải trọng mà không phải dựng gì, hãy kéo các thanh trượt bên dưới, và chuyển qua lại giữa các kết quả để xem mỗi đại lượng tăng theo nhịp ra sao.

::example-structure
::

## Lưu hoặc chia sẻ {#_10-save-or-share}

- **Gửi cho người khác.** Nhấn **Chia sẻ mô hình** trên thanh ứng dụng, rồi nhấn **Sao chép**. Liên kết chứa toàn bộ mô hình, và ai mở nó cũng nhận được một bản sao riêng để chỉnh sửa.
- **Lưu thành tệp.** **☰ → Lưu dự án** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) tải xuống tệp `project.json`. Mở lại bằng **☰ → Mở dự án** (<kbd>Ctrl</kbd>+<kbd>O</kbd>) hoặc kéo thả tệp vào ứng dụng.
- **Đưa hình vẽ vào báo cáo.** **☰ → Xuất hình ảnh** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) lưu hình vẽ thành PNG hoặc SVG.

Mô hình cũng được lưu trong trình duyệt, nên tải lại trang sẽ không làm mất nó. Chi tiết có trong trang [Tệp, liên kết và xuất dữ liệu](/vi/essentials/import-export).

## Tiếp theo {#where-next}

::card-grid{cols="2"}
:::card{title="Hướng dẫn" icon="lucide:graduation-cap" to="/vi/tutorials/inclined-beam"}
Bốn mô hình dựng từng bước và kiểm tra bằng tính tay, từ dầm xiên đến dầm liên tục có gối bị lún.
:::
:::card{title="Ví dụ" icon="lucide:library" to="/vi/examples/"}
Dầm, khung và dàn có sẵn, mở chỉ với một cú nhấp, kèm bài tập và đáp số.
:::
:::card{title="Tải trọng" icon="lucide:arrow-down-to-line" to="/vi/essentials/loads"}
Tải hình thang, tải tập trung, tải nhiệt độ, lực tại nút và lún gối tựa.
:::
:::card{title="Bàn phím, chuột và cảm ứng" icon="lucide:keyboard" to="/vi/reference/shortcuts"}
Vẽ nút và phần tử ngay trên khung vẽ, và chỉnh sửa nhanh hơn.
:::
::
