---
description: "Đọc kết quả EduBeam: biểu đồ N, V, M, sơ đồ biến dạng, phản lực và dấu của chúng, chú thích, bảng kết quả, xuất CSV, ma trận độ cứng và định dạng số."
source: site
---

# Kết quả và biểu đồ

[EduBeam]{.edubeam} giải lại mô hình sau mỗi thay đổi, nên biểu đồ, phản lực và bảng trên màn hình luôn ứng với đúng mô hình bạn đang thấy. Không có nút *Giải*. Nếu không có gì được vẽ, nghĩa là mô hình chưa giải được: thông báo ở góc trên bên trái vùng hiển thị cho biết lý do, và trang [Khắc phục sự cố](/vi/reference/troubleshooting) giải thích từng thông báo.

## Lớp hiển thị trên mô hình {#overlays-in-the-viewer}

Kết quả được vẽ chồng lên mô hình. Bật và tắt chúng trong **tùy chọn hiển thị** ở góc trên bên phải vùng hiển thị; nút ⚙ phía trên hiện hoặc ẩn bảng tùy chọn.

::model-figure{caption="Khung ba khớp, 10 kN/m: chuyển qua lại giữa M, V, N và sơ đồ biến dạng"}
---
nodes: { A: [0, 0], B: [0, -4], C: [4, -4], D: [8, -4], E: [8, 0] }
supports: { A: pin, E: pin }
members: [[A, B], { nodes: [B, C], hinges: [false, true] }, [C, D], [D, E]]
loads:
  - { member: 2, qz: 10 }
  - { member: 3, qz: 10 }
results: [M, V, N, w]
show: [nodeLabels]
height: 300
---
::

| Ô đánh dấu | Vẽ gì | Màu | Bật lúc đầu |
| --- | --- | --- | --- |
| **Biến dạng** | kết cấu sau khi chuyển vị, được phóng đại để nhìn thấy | xám | có |
| **N (x)** | lực dọc | xanh dương | |
| **V<sub>z</sub> (x)** | lực cắt | xanh lá | |
| **M<sub>y</sub> (x)** | mô men uốn | đỏ | có |
| **Phản lực** | một mũi tên và một giá trị cho mỗi phương bị chặn | tím | có |

Hàng thứ hai bật tắt các thành phần của hình vẽ: **Gối tựa**, **Tải trọng**, **Nhãn nút** và **Nhãn phần tử**. **Thêm cài đặt** bên dưới bảng tùy chọn mở [cài đặt hiển thị](/vi/essentials/units-settings#viewer-settings), nơi bạn đặt kích cỡ biểu đồ (*Tỷ lệ kết quả*), màu sắc, hướng nhãn và kiểu vẽ biểu đồ.

Giá trị được ghi ở những chỗ quan trọng: ở hai đầu mỗi thanh, ở hai bên bước nhảy dưới lực tập trung hoặc trên gối tựa, và tại mỗi cực trị của biểu đồ, chẳng hạn đỉnh parabol nơi $V = 0$. Hình trên là [khung ba khớp](/vi/tutorials/three-hinged-frame), bạn có thể kiểm tra bằng tính tay: mỗi cột chịu nén 40 kN, dầm chịu nén 20 kN, và −80 kNm tại cả hai góc khung. Ở chế độ xem *w*, khớp C lún xuống 42,55 mm.

### Cách đọc dấu {#reading-the-sign}

Hãy đọc dấu từ **giá trị**, chứ đừng nhìn biểu đồ nằm ở phía nào của thanh. Quy ước dấu giống với phần lớn giáo trình:

| Kết quả | Dương nghĩa là |
| --- | --- |
| **N** | kéo |
| **V<sub>z</sub>** | lực cắt làm một đoạn thanh ngắn quay theo chiều kim đồng hồ. Vì $V = \mathrm{d}M/\mathrm{d}x$, lực cắt dương ở gối trái và âm ở gối phải của dầm đơn giản chịu tải hướng xuống |
| **M<sub>y</sub>** | căng thớ dưới (thớ dưới chịu kéo), tức phía **nét đứt** vẽ dọc mỗi thanh |

Dầm có đầu thừa cho thấy cả hai dấu cùng lúc. Giữa hai gối, dầm căng thớ dưới (+13,5 kNm); trên gối phải, dầm căng thớ trên (−24 kNm). Lực cắt nhảy một lượng bằng phản lực 54 kN tại B, từ −30 lên +24 kN:

::model-figure{caption="Dầm có đầu thừa, 12 kN/m: căng thớ dưới giữa hai gối, căng thớ trên tại B"}
---
nodes: { A: [0, 0], B: [4, 0], C: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

Mặc định, mô men uốn được vẽ ở **phía thớ chịu kéo**, còn lực dọc và lực cắt dương được vẽ ở phía đối diện với nét đứt. Mỗi trường đại học vẽ một kiểu, nên bạn có thể đổi phía từng biểu đồ trong **Cài đặt → Cài đặt hiển thị → Biểu đồ nội lực**; ở đó bạn cũng có thể kẻ vạch biểu đồ như khi vẽ tay và ghi bậc đa thức trên mỗi đoạn. Đổi phía chỉ thay đổi hình vẽ, không bao giờ đổi giá trị. Quy ước dấu đầy đủ, kể cả hệ trục địa phương của phần tử, có trong [sổ tay lý thuyết](/vi/elements/conventions#internal-forces).

## Chú thích khi di chuột {#hover-tooltips}

Di chuột lên một đối tượng để đọc giá trị của nó:

- **Nút**: chuyển vị $u_x$, $u_z$ (theo đơn vị chuyển vị) và góc xoay $\varphi_y$ (tính bằng radian).
- **Phần tử**: nhãn, tiết diện và vật liệu.
- **Tải trọng**: các thành phần của nó.

Trên màn hình cảm ứng, hãy chạm vào đối tượng: bảng thao tác của nó hiện đúng các thông tin ấy.

![Di chuột lên nút 2 của dầm trong bài Bắt đầu nhanh](/screenshots/vi/ui-hover.webp){.shot-sm}

## Thẻ Kết quả {#results-tab}

Thẻ **Kết quả** ở thanh dưới cùng có hai bảng, chuyển qua lại bằng **Kết quả tại nút** và **Kết quả phần tử**.

### Kết quả tại nút {#nodal-results}

Mỗi nút một hàng, với chuyển vị **D<sub>x</sub>** và **D<sub>z</sub>** (theo đơn vị chuyển vị) và góc xoay **R<sub>y</sub>** (tính bằng radian), theo hệ trục tổng thể: D<sub>z</sub> dương hướng xuống và R<sub>y</sub> dương ngược chiều kim đồng hồ trên màn hình. Phương bị chặn ghi 0, hoặc chuyển vị cưỡng bức bạn đã đặt. Phản lực không có trong bảng này: hãy đọc chúng trên hình vẽ, hoặc trong [tệp CSV xuất ra](#export-csv-and-copy).

![Kết quả tại nút của khung ba khớp ở trên, với Định dạng số đặt là Tự động](/screenshots/vi/p2c-results-nodal.webp){.shot-lg}

### Kết quả phần tử {#element-results}

Mỗi phần tử một hàng, với **nội lực đầu phần tử trong hệ tọa độ địa phương của phần tử**:

| Cột | Ý nghĩa |
| --- | --- |
| X<sub>12</sub>, Z<sub>12</sub>, M<sub>12</sub> | lực dọc, lực cắt và mô men tác dụng lên phần tử tại nút **đầu** |
| X<sub>21</sub>, Z<sub>21</sub>, M<sub>21</sub> | tương tự tại nút **cuối** |

![Kết quả phần tử của khung ba khớp: nội lực đầu phần tử của bốn thanh](/screenshots/vi/p2c-results-element.webp)

Nội lực đầu phần tử là các lực mà nút tác dụng lên phần tử. Chúng theo hệ trục địa phương, không theo quy ước N-V-M của biểu đồ, nên dấu của chúng khác:

- **Dầm đơn giản** (6 m, 12 kN/m, trong bài [Bắt đầu nhanh](/vi/guide/quick-start)): Z<sub>12</sub> = Z<sub>21</sub> = −36 kN. Cả hai gối tựa đẩy dầm lên, tức là theo chiều −z.
- **Dầm công xôn** ngàm tại nút đầu, chịu 18 kN hướng xuống ở đầu tự do: Z<sub>12</sub> = −18 kN, M<sub>12</sub> = +72 kNm, Z<sub>21</sub> = +18 kN, M<sub>21</sub> = 0.
- **Cột 1 của khung** (A ở dưới, B ở trên): X<sub>12</sub> = +40 kN đẩy dọc trục x địa phương vào phần tử, tức là cột chịu nén 40 kN.

Bảng này được giải thích thêm trong [sổ tay lý thuyết](/vi/elements/conventions#end-forces-element-results-table).

### Xuất CSV và sao chép {#export-csv-and-copy}

**Xuất CSV** tải xuống tệp `edubeam-results.csv` chứa cả hai bảng, theo đơn vị đang hiển thị trên màn hình, sẵn sàng để mở bằng bảng tính. **Sao chép** đưa cùng các bảng đó vào bộ nhớ tạm dưới dạng văn bản phân tách bằng tab, dán thẳng được vào Excel, LibreOffice hoặc Google Sheets.

| Bảng | Các cột |
| --- | --- |
| Nút | Node, x, z, Dx, Dz, Ry, và **phản lực** Rx, Rz, My |
| Phần tử | Element, Node 1, Node 2, và nội lực đầu phần tử N1, V1, M1, N2, V2, M2 |

Mỗi tiêu đề cột đều ghi đơn vị, ví dụ `Dz [mm]`. Nội lực đầu phần tử chính là các giá trị địa phương X<sub>12</sub> … M<sub>21</sub> trên màn hình.

### Ma trận độ cứng {#stiffness-matrix}

Chọn **Ma trận độ cứng** trong bảng thao tác của một phần tử, hoặc nhấn nút bấm trên hàng của phần tử trong bảng ở thẻ *Phần tử*, để mở ma trận độ cứng 6 × 6 của phần tử trong **hệ tọa độ tổng thể**, theo đơn vị SI (N, m). Ma trận này tiện để kiểm tra khi bạn ghép ma trận bằng tay trong môn học về phương pháp chuyển vị; công thức có trong [sổ tay lý thuyết](/vi/elements/beam).

## Định dạng số {#number-format}

Bảng và chú thích hiện kết quả với năm chữ số có nghĩa. **Cài đặt → Ngôn ngữ và khu vực → Định dạng số** quyết định cách ghi:

| Định dạng | 40 000 được ghi là | Dùng cho |
| --- | --- | --- |
| **Khoa học** (mặc định) | 4 · 10⁴ | các giá trị chênh nhau nhiều bậc độ lớn |
| **Kỹ thuật** | 40 · 10³ | đọc nhanh theo tiền tố kilo, mega |
| **Tự động** | 40.000 | các con số thông thường khi giảng dạy |

*Tự động* ghi các giá trị từ 0,001 đến 100 000 dưới dạng số thường. Ngoài khoảng đó, nó ghi giống *Kỹ thuật*, với lũy thừa của mười theo bước ba bậc, chẳng hạn 380,95 · 10⁻⁹ trong kết quả tại nút ở trên. Dấu thập phân theo ngôn ngữ; với tiếng Việt, ứng dụng dùng dấu phẩy thập phân và dấu chấm phân cách hàng nghìn.

Nhãn trên hình vẽ (giá trị biểu đồ và phản lực) luôn có hai chữ số thập phân, bất kể định dạng số: 6,6667 kN hiện thành 6,67. Khi cần nhiều chữ số hơn, hãy đọc bảng hoặc chú thích.

## Độ chính xác {#precision-and-accuracy}

- Phần tử dầm cho kết quả chính xác với mô hình Timoshenko tuyến tính dưới tải trọng nút, tải phân bố đều, tải hình thang, tải tập trung và tải nhiệt độ. Kết quả **không** phụ thuộc vào số phần tử, và không có lưới nào cần làm mịn.
- Phép tính dùng số thực độ chính xác kép (double precision). Giá trị nhỏ hơn một phần nghìn tỷ giá trị lớn nhất cùng loại là sai số làm tròn, và bảng ghi nó bằng 0.
- Độ võng có kể đến **biến dạng trượt**, và trong hệ siêu tĩnh, biến dạng trượt cũng làm nội lực thay đổi chút ít. Với thanh mảnh, nó chỉ làm độ võng Euler–Bernoulli tăng thêm chưa đến một phần trăm; với thanh ngắn và cao, mức tăng có thể đạt mười phần trăm hoặc hơn. Trang [Kiểm tra kết quả bằng tính tay](/vi/guide/verification#shear-deformation) cho thấy ảnh hưởng này lớn đến đâu, và cách tắt nó để so sánh với công thức trong giáo trình.

## Kết quả trong báo cáo {#results-in-a-report}

- **☰ → Xuất hình ảnh** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) lưu hình vẽ thành PNG hoặc SVG với các biểu đồ bạn chọn. Xem [Xuất hình ảnh](/vi/essentials/import-export#export-an-image).
- **Xuất CSV** hoặc **Sao chép** trong thẻ Kết quả cho bạn các con số.
- **Chia sẻ mô hình** cho bạn một liên kết, để người đọc tự mở chính mô hình đó.
- Với tài liệu bài giảng và phiếu bài tập, thư viện vẽ [@edubeam/plot](/vi/plot) vẽ đúng các biểu đồ này từ mã nguồn.
