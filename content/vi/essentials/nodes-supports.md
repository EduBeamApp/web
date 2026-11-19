---
description: "Đặt và sửa nút trong EduBeam, bắt dính vào lưới, chia phần tử và chọn đúng gối tựa: gối cố định, gối di động, ngàm, ngàm trượt, các dạng đứng và xiên."
source: site
---

# Nút và gối tựa

Nút là các điểm của mô hình: phần tử nối các nút với nhau, còn gối tựa và tải trọng nút đặt tại nút. Bạn đặt nút bằng cách nhập tọa độ hoặc nhấp chuột, rồi gán cho các nút tựa đúng loại gối tựa như trên sơ đồ của bạn.

## Tọa độ {#coordinates}

Mỗi nút có tọa độ **X** và **Z** theo [đơn vị chiều dài](/vi/essentials/units-settings#units) hiện tại. Trục X hướng sang phải và **trục Z hướng xuống dưới**, nên mọi điểm cao hơn mặt đất đều có Z âm: một cột cao 4 m đi từ `Z = 0` đến `Z = −4`.

::model-figure{caption="Khung cổng rộng 6 m, cao 4 m: A và D ở Z = 0, B và C ở Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

Nếu bạn muốn trục đứng hướng lên, hãy chuyển sang [hệ trục y hướng lên](/vi/elements/conventions#y-up-axes) trong phần Cài đặt. Chỉ cách hiển thị thay đổi; mô hình và các tệp của nó vẫn giữ nguyên.

## Thêm nút {#adding-nodes}

- **Bằng cách nhập.** Thẻ *Nút* → **Thêm nút** (nút bấm có biểu tượng **+**), hoặc nhấp chuột phải vào khung vẽ → *Thêm nút*. Nhập X và Z, nếu cần thì cả gối tựa và góc gối tựa.
- **Bằng cách nhấp chuột.** Thẻ *Nút* → **Thêm nút** (nút bấm có biểu tượng con trỏ), hoặc giữ <kbd>Ctrl</kbd> khi chọn *Thêm nút* trong menu khung vẽ. Mỗi lần nhấp đặt một nút; nhấn <kbd>Esc</kbd>, **Hủy** hoặc nhấn lại nút bấm đó để dừng.
- **Trong khi vẽ phần tử.** Khi bạn [vẽ phần tử bằng chuột](/vi/essentials/elements#adding-elements), một cú nhấp vào vùng trống của khung vẽ sẽ tạo nút tại đó.
- **Bằng cách sao chép.** Chọn các nút (và phần tử), nhấn <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>, rồi nhấp vào chỗ cần đặt bản sao, hoặc nhập độ dời Δx, Δz trong thanh thông báo và nhấn **Dán**.

::div{.shots}

![Hộp thoại Thêm nút](/screenshots/vi/qs-node.webp)

![Ở chế độ nhấp chuột, thanh thông báo phía trên đặt gối tựa và góc cho mọi nút bạn đặt](/screenshots/vi/nodes-add-banner.webp)

::

Nút mới được đánh số tiếp theo chưa dùng: `1`, `2`, `3`, … Bạn có thể đổi tên bất kỳ nút nào trong cột *Nút* của bảng, chẳng hạn thành `A`, `B`, `C`.

### Bắt dính {#snapping}

Khi bật **Bắt dính lưới** (nhấn <kbd>S</kbd>, hoặc nhãn **S** ở góc dưới bên phải vùng hiển thị), các nút bạn đặt hoặc kéo sẽ bắt vào điểm lưới. Bước lưới mặc định là 0,1 m, hoặc 0,5 ft với hệ đơn vị Mỹ; đổi bước lưới trong [Cài đặt → Cài đặt hiển thị → Lưới](/vi/essentials/units-settings#viewer-settings). Muốn đặt nút ở vị trí khác, hãy nhập tọa độ chính xác trong bảng.

### Đặt nút lên phần tử có sẵn {#placing-a-node-on-an-existing-element}

Khi đang thêm nút bằng chuột mà bạn nhấp lên (hoặc rất gần) một phần tử, EduBeam sẽ hỏi bạn muốn làm gì:

- **Nối vào kết cấu** chia phần tử làm hai, `1a` và `1b`, nối với nhau tại nút mới. Đây là cách nhanh nhất để thêm một gối tựa trung gian hoặc một điểm đặt tải. Khớp ở hai đầu ngoài vẫn giữ nguyên chỗ cũ. Tải phân bố đều và tải hình thang được chia cho hai nửa. Tải tập trung và tải nhiệt độ đều được gán cho nửa thứ nhất, `1a`: trong bảng *Tải trọng*, hãy chuyển lực tập trung nằm bên kia nút mới sang `1b` (vị trí của nó giờ tính từ nút mới), và gán cho `1b` tải nhiệt độ riêng.
- **Đặt nút riêng lẻ** đặt nút lên trên phần tử mà không nối vào nó.

Dù chọn cách nào, chế độ đặt nút cũng kết thúc tại đó; muốn đặt tiếp, nhấp lại nút bấm có biểu tượng con trỏ.

## Sửa nút {#editing-nodes}

| Muốn | Thao tác |
| --- | --- |
| Di chuyển một nút | Kéo nút trong vùng hiển thị (trên màn hình cảm ứng: nhấn rồi kéo), hoặc nhập X và Z trong bảng *Nút*. Các phần tử nối vào nút cùng tải trọng và đường kích thước của chúng di chuyển theo. |
| Đổi tên | Nhập nhãn mới trong cột *Nút*. |
| Đổi gối tựa | Nhấp vào nút → **Gối tựa tại nút**, hoặc dùng cột *Bậc tự do bị chặn*. Xem [Gối tựa](#supports). |
| Sửa mọi thứ cùng lúc | Biểu tượng bút chì trong cột *Thao tác* mở hộp thoại **Sửa nút**: tọa độ, gối tựa và góc gối tựa, kèm hình xem trước ký hiệu. |
| Xóa | Dấu × trong bảng, **Xóa** trong bảng thao tác của nút, hoặc chọn nút rồi nhấn <kbd>Delete</kbd>. Các phần tử, tải trọng và đường kích thước gắn vào nút cũng bị xóa theo. |

Mọi thay đổi đều hoàn tác được bằng <kbd>Ctrl</kbd>+<kbd>Z</kbd>.

## Gối tựa {#supports}

Mỗi nút có thể chuyển động theo ba cách, gọi là các **bậc tự do** (DOF): `Dx` theo x, `Dz` theo z và `Ry`, góc xoay trong mặt phẳng hình vẽ. Gối tựa **chặn** một số bậc tự do trong đó.

Tám loại gối tựa là tám cách tổ hợp ba bậc tự do. Đọc bảng theo hàng ngang: cột giữa là các gối xoay tự do, cột bên phải là các gối bị chặn cả xoay.

| Chuyển vị bị chặn | Xoay tự do | Chặn cả xoay |
| --- | --- | --- |
| **Cả hai** (`Dx` và `Dz`) | ![](/screenshots/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Gối cố định** | ![](/screenshots/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Ngàm** |
| **Chỉ phương đứng** (`Dz`): trượt ngang | ![](/screenshots/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Gối di động** | ![](/screenshots/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Ngàm trượt** |
| **Chỉ phương ngang** (`Dx`): trượt đứng | ![](/screenshots/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Gối di động đứng** | ![](/screenshots/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Ngàm trượt đứng** |
| **Không**: trượt theo cả hai phương | ![](/screenshots/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Tự do** (không có gối tựa) | ![](/screenshots/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Chỉ chặn xoay** |

Với mỗi bậc tự do bị chặn, EduBeam tính một **phản lực**: `Dx` cho lực ngang $R_x$, `Dz` cho lực đứng $R_z$, `Ry` cho mô men $M$. Vì vậy gối cố định cho $R_x$ và $R_z$, gối di động chỉ cho $R_z$, ngàm trượt cho $R_z$ và $M$, còn ngàm cho cả ba.

### Đặt gối tựa {#setting-a-support}

Chọn ký hiệu, hoặc đánh dấu từng bậc tự do một; ký hiệu và các ô đánh dấu luôn khớp nhau. Bạn tìm thấy cả hai ở ba chỗ:

- bảng thao tác của nút (nhấp vào nút) → **Gối tựa tại nút**, cùng với **Góc LCS của nút**, như hình dưới;
- các hộp thoại **Thêm nút** và **Sửa nút**;
- cột *Bậc tự do bị chặn* của bảng *Nút*, nơi ký hiệu là một menu nhỏ còn `Dx`, `Dz`, `Ry` là các ô đánh dấu.

![Gối tựa tại nút trong bảng thao tác của nút: các ký hiệu, ô đánh dấu bậc tự do và góc gối tựa](/screenshots/vi/nodes-support-picker.webp){.shot-lg}

Di chuột lên một ký hiệu để xem tên của nó.

### Gối di động hay ngàm trượt? {#roller-or-slider}

Cả hai đều nằm trên ray và trượt dọc theo ray. Chỗ khác nhau là khả năng xoay:

- **gối di động** giống gối cố định nhưng đặt trên ray: đầu thanh **xoay tự do**, nên tại đó không có mô men;
- **ngàm trượt** giống ngàm nhưng đặt trên ray: đầu thanh **không xoay được**, nên gối tựa chịu mô men.

Cùng một dầm dài 6 m chịu tải phân bố đều 10 kN/m, chỉ đổi gối tựa bên phải. Hãy chuyển qua lại giữa sơ đồ biến dạng và biểu đồ mô men uốn:

::div{.shots}

:::model-figure{caption="Gối cố định và gối di động: đầu phải xoay tự do; tại đó M = 0, phản lực mỗi gối 30 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Gối cố định và ngàm trượt: đầu phải luôn nằm ngang; tại đó M = −45 kNm, phản lực ngàm trượt 37,5 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

Trường hợp thứ nhất là dầm đơn giản ($M_{max} = qL^2/8 = 45\ \text{kNm}$ ở giữa nhịp). Dưới tải trọng đứng, ngàm trượt làm việc hệt như ngàm, nên trường hợp thứ hai là dầm một đầu ngàm, một đầu gối di động ($R_B = 5qL/8 = 37{,}5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Khi đầu dầm bị giữ không xoay, dầm cũng cứng hơn: độ võng lớn nhất giảm từ 9,617 mm xuống 4 mm. Ngàm trượt chỉ khác ngàm khi có lực đẩy dọc theo ray của nó.

### Gối tựa xiên {#inclined-skewed-supports}

Gối tựa đặt trên mặt dốc chặn chuyển vị của nút theo các trục đã xoay. Đặt **Góc LCS của nút** α, tính bằng độ, từ −180 đến 180, trong bảng thao tác của nút ở mục *Gối tựa tại nút*, trong các hộp thoại Thêm nút và Sửa nút, hoặc ở ô **α** của bảng *Nút*.

Các trục của nút xoay đi một góc α, và các bậc tự do được đánh dấu được hiểu theo các trục đã xoay này. α xoay trục x về phía trục z, tức là **theo chiều kim đồng hồ** trên màn hình (với hệ trục y hướng lên, nó xoay x về phía y, ngược chiều kim đồng hồ). Vì vậy gối di động trên mặt dốc nghiêng xuống 30° về bên phải là gối di động với α = 30°. Ký hiệu xoay theo các trục, và phản lực cũng được báo theo các trục đó.

::model-figure{caption="Gối di động tại B xoay góc α = 30°: phản lực 34,64 kN vuông góc với mặt dốc, và dầm chịu N = +17,32 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

Vẫn là dầm ở trên, dài 6 m, chịu 10 kN/m, nhưng gối di động nay nằm trên mặt dốc 30°. Thành phần đứng của phản lực tại B vẫn là $qL/2 = 30\ \text{kN}$, nên toàn bộ phản lực bằng $30/\cos 30° = 34{,}64\ \text{kN}$, còn thành phần ngang của nó, $30 \tan 30° = 17{,}32\ \text{kN}$, đẩy B sang phải. Gối cố định tại A giữ dầm lại, nên dầm chịu kéo. Mô men uốn không đổi.

[Tải trọng nút](/vi/essentials/loads#nodal-loads) tại một nút có trục đã xoay có thể nhập theo trục tổng thể hoặc theo trục nút; [chuyển vị cưỡng bức](/vi/essentials/loads#prescribed-displacements-support-settlements) luôn tác dụng theo các trục riêng của gối tựa.

### Ổn định {#stability}

Một kết cấu phẳng cần ít nhất **ba bậc tự do bị chặn**, bố trí sao cho chúng thực sự giữ được kết cấu. Khi còn thiếu gối tựa, vùng hiển thị hiện nhãn màu xanh dương **Cần gối tựa**. Nếu có đủ liên kết nhưng chúng không giữ được kết cấu (phương của chúng song song với nhau, hoặc cùng đồng quy tại một điểm), hoặc các khớp cho phép các thanh xoay tương đối với nhau, một thông báo màu đỏ sẽ nêu vấn đề và một đường bao nét đứt cho thấy kết cấu chuyển động ra sao. Trang [Khắc phục sự cố](/vi/reference/troubleshooting#messages) giải thích từng thông báo.

## Tải trọng nút và lún gối tựa {#nodal-loads-and-settlements}

Nhấp vào một nút → **Thêm tải trọng** để đặt lực hoặc mô men, hoặc → **Chuyển vị cưỡng bức** để dời gối tựa đi một khoảng cho trước (lún gối tựa). Cả hai được giải thích ở mục [Tải trọng nút](/vi/essentials/loads#nodal-loads).

## Đường kích thước {#dimension-lines}

Đường kích thước ghi chiều dài trên hình vẽ. Chúng không ảnh hưởng đến kết quả tính, nhưng được lưu cùng dự án, đi kèm trong liên kết chia sẻ và xuất hiện trong [hình ảnh xuất ra](/vi/essentials/import-export#export-an-image).

| Muốn | Thao tác |
| --- | --- |
| Thêm đường kích thước | Nhấp chuột phải vào khung vẽ → **Thêm kích thước**, rồi nhấp vào hai điểm đầu mút. Điểm gần một nút sẽ bắt dính vào nút đó. |
| Ghi kích thước một phần tử | Nhấp chuột phải vào phần tử → **Ghi kích thước phần tử**. |
| Sửa hoặc lật | Nhấp vào đường kích thước → **Sửa** để nhập tọa độ, hoặc **Lật kích thước** để đưa nhãn sang phía bên kia. |
| Di chuyển | Kéo đường kích thước, hoặc kéo một điểm đầu mút. Đầu mút nằm trên nút sẽ gắn với nút và đi theo nó. |
