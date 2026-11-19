---
description: "Cài đặt EduBeam: ngôn ngữ, đơn vị SI hoặc hệ Mỹ, định dạng số, trục z xuống hoặc y lên, lưới, kiểu và màu biểu đồ, dữ liệu lưu trong trình duyệt."
source: site
---

# Đơn vị và cài đặt

Tại đây bạn chọn ngôn ngữ, đơn vị và hệ trục để làm việc, cùng cách trình bày hình vẽ. Cài đặt chỉ thay đổi cách mô hình được hiển thị và nhập: bản thân mô hình luôn được lưu theo đơn vị SI với trục z hướng xuống, nên dự án hay liên kết mở ra vẫn là cùng một mô hình, dù cài đặt thế nào.

Có ba cách để mở cài đặt:

- thẻ **Cài đặt** phía trên vùng hiển thị hiện cài đặt toàn khổ thay chỗ mô hình, ở mục *Ngôn ngữ và khu vực*; thẻ **Mô hình** đưa bạn trở lại;
- **ô đơn vị** ở góc dưới bên phải vùng hiển thị (`m m² kN kNm MPa`) mở cài đặt dưới dạng hộp thoại, ở mục *Ngôn ngữ và khu vực*;
- **Thêm cài đặt** bên dưới [tùy chọn hiển thị](/vi/essentials/user-interface#display-options) mở hộp thoại ở mục *Cài đặt hiển thị*.

Cài đặt được lưu trong trình duyệt và vẫn còn sau khi tải lại trang. **Đặt lại cài đặt**, bên dưới danh sách các mục, khôi phục giá trị mặc định: định dạng số, hệ trục, nút kéo màn hình, đơn vị theo khu vực của bạn, cùng toàn bộ cài đặt hiển thị và tùy chọn hiển thị. Ngôn ngữ được giữ nguyên. Thao tác đặt lại không hoàn tác được.

## Ngôn ngữ và khu vực {#language-locale}

![Cài đặt → Ngôn ngữ và khu vực](/screenshots/vi/settings-language.webp)

**Ngôn ngữ.** Có 18 ngôn ngữ; lần đầu mở, EduBeam dùng ngôn ngữ của trình duyệt. Dấu thập phân đi theo ngôn ngữ. Một liên kết có thể chọn sẵn ngôn ngữ cho người đọc: thêm `?lang=` với một trong các mã `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn` (tiếng Trung), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`.

**Định dạng số.** Cách ghi giá trị kết quả trong bảng và chú thích: *Khoa học* (1,5 · 10⁴, mặc định), *Kỹ thuật* (15 · 10³) hoặc *Tự động*. Xem [Định dạng số](/vi/essentials/results#number-format).

**Hệ tọa độ.** *x sang phải, z xuống dưới* (mặc định) hoặc *x sang phải, y lên trên*. Với *x sang phải, y lên trên*, trục đứng là trục y và hướng lên, còn mô men lấy quanh trục z. Tọa độ đứng, lực, chuyển vị, phản lực và góc gối tựa đổi dấu, và mọi ô nhập, bảng, chú thích và tệp xuất đều dùng tên mới. Mô hình, hình vẽ và các tệp đã lưu vẫn giữ nguyên như cũ. Xem [Hệ trục y hướng lên](/vi/elements/conventions#y-up-axes).

![Khung ba khớp với hệ trục y hướng lên: biểu tượng hệ trục ở góc cho thấy y hướng lên](/screenshots/vi/settings-y-up.webp){.shot-lg}

**Hệ đơn vị.** *SI (hệ mét)* hoặc *Hệ Mỹ (imperial)* đặt mọi đơn vị cùng lúc. Ở lần truy cập đầu tiên, bạn chọn trong hộp thoại chào mừng. EduBeam chỉ gợi ý hệ Mỹ khi trình duyệt đặt khu vực Mỹ *và* máy tính ở múi giờ Mỹ; ở mọi nơi khác, nó gợi ý SI. Nếu sau đó bạn đổi riêng một đơn vị nào, hệ đơn vị sẽ hiện là *Tùy chỉnh*.

### Đơn vị {#units}

Mỗi đại lượng có đơn vị riêng. Ô nhập (ghi đơn vị ở cuối ô), bảng, chú thích và nhãn biểu đồ đều dùng đơn vị đó, và khi đổi đơn vị, những gì đang hiển thị được quy đổi theo. Mô hình không hề thay đổi, nên chuyển qua lại bao nhiêu lần cũng không mất gì.

| Đại lượng | Lựa chọn | SI | Hệ Mỹ |
| --- | --- | --- | --- |
| Chiều dài (hình học, vị trí tải) | m, cm, mm, ft, in | m | ft |
| Kích thước tiết diện | m, cm, mm, ft, in | m | in |
| Chuyển vị (kết quả, chuyển vị cưỡng bức) | m, cm, mm, ft, in | m | in |
| Diện tích | m², cm², mm², ft², in² | m² | in² |
| Mô men quán tính | m⁴, cm⁴, mm⁴, ft⁴, in⁴ | m⁴ | in⁴ |
| Khối lượng | kg, lb | kg | lb |
| Lực | N, kN, MN, kgf, Tonf, lbf, kip | kN | kip |
| Mô men uốn | Nmm, Nm, kNm, MNm, Tonf·m, lbf·in, lbf·ft, kip·in, kip·ft | kNm | kip·ft |
| Ứng suất (E, G) | Pa, kPa, MPa, GPa, ksc, psi, ksi, psf, ksf | MPa | ksi |
| Nhiệt độ | °C, °F | °C | °F |

Một số đơn vị suy ra từ các đơn vị khác:

- **Tải phân bố** là lực trên chiều dài: kN/m trong SI, kip/ft trong hệ Mỹ.
- **Khối lượng riêng** là khối lượng trên chiều dài³: kg/m³ hoặc lb/ft³.
- **Hệ số dãn dài do nhiệt** theo đơn vị nhiệt độ: 1/K hoặc 1/°F. Tải nhiệt độ là *độ thay đổi* nhiệt độ, nên 10 °C ứng với 18 °F.
- **Góc xoay** luôn tính bằng radian, còn góc gối tựa bằng độ.

Tonf là tấn lực hệ mét (1000 kgf), không phải tấn ngắn (short ton) của Mỹ. Đơn vị hệ Mỹ dùng định nghĩa chính xác: 1 ft = 0,3048 m, 1 kip = 4448,2216 N. Nhập feet dưới dạng số thập phân, như `5.5`; thước đo và dấu thập hiển thị theo feet và inch (5′-6″).

## Cài đặt hiển thị {#viewer-settings}

Các cài đặt về cách trình bày hình vẽ. **Xem trước hiển thị** ở bên phải là một dầm xiên nhỏ thể hiện ngay mọi thay đổi; các nút bấm bên dưới chọn kết quả được hiển thị, và khi bạn đổi một cài đặt biểu đồ hay một màu, bản xem trước chuyển sang kết quả tương ứng.

![Cài đặt → Cài đặt hiển thị, bên phải là bản xem trước trực tiếp và các cài đặt biểu đồ](/screenshots/vi/b-settings-viewer.webp)

Cột bên trái, từ trên xuống:

- *Lưới*: **Hiện lưới** (<kbd>G</kbd>) vẽ lưới và thước đo; **Bắt dính lưới** (<kbd>S</kbd>) làm các nút bạn đặt hoặc kéo bắt vào điểm lưới; **Hiện dấu thập** đánh dấu vị trí con trỏ chuột trên thước đo. Lúc đầu cả ba đều bật. **Bước bắt dính lưới** là 0,1 m, hoặc 0,5 ft với hệ đơn vị Mỹ. Khi bạn chuyển giữa hệ mét và hệ Mỹ, bước lưới còn ở giá trị mặc định sẽ chuyển sang mặc định của hệ kia; bước lưới do bạn tự đặt được giữ nguyên.
- *Kích cỡ*: **Tỷ lệ kết quả**, từ 8 đến 120 px (lúc đầu 48 px), là chiều cao trên màn hình của tung độ lớn nhất trong biểu đồ, hay của chuyển vị lớn nhất; nó chỉ có tác dụng hiển thị, vì mỗi biểu đồ được co giãn theo giá trị lớn nhất của chính nó. **Kích cỡ gối tựa** từ 50 đến 150 % (100 %), và **Cỡ chữ** từ 10 đến 20 px (14 px); cỡ lớn hơn giúp dễ nhìn trên máy chiếu.
- *Hướng nhãn kết quả*: giá trị ghi dọc theo tung độ, tức *Vuông góc với biểu đồ* (mặc định), hoặc *Luôn nằm ngang*.
- *Kiểm tra mô hình*: **Hiện cách kết cấu không ổn định có thể chuyển động** vẽ đường bao nét đứt của hệ biến hình, còn **Tạo hoạt ảnh chuyển động** cho hình đó đung đưa qua lại. Lúc đầu cả hai đều bật.

### Biểu đồ nội lực {#internal-force-diagrams}

Mỗi trường đại học vẽ biểu đồ theo một kiểu, nên EduBeam để bạn tự chọn. Các cài đặt này chỉ đổi hình vẽ, không bao giờ đổi giá trị. **Nét đứt** dọc mỗi phần tử đánh dấu thớ dưới của nó, tức phía mà trục z địa phương hướng tới (xem [Chiều phần tử](/vi/essentials/elements#element-direction)).

| Cài đặt | Lựa chọn | Mặc định |
| --- | --- | --- |
| **Mô men uốn** | vẽ ở *Phía thớ chịu kéo* hoặc *Phía thớ chịu nén* | *Phía thớ chịu kéo* |
| **Lực cắt dương** | vẽ ở *Phía đối diện* với nét đứt, hoặc ở *Phía nét đứt* | *Phía đối diện* |
| **Lực dọc dương** | *Phía đối diện* hoặc *Phía nét đứt* | *Phía đối diện* |
| **Tô màu** | *Tô đặc*, *Kẻ vạch* (các vạch cắt ngang thanh, như khi vẽ tay), hoặc *Không* | *Tô đặc* |
| **Bậc của từng đoạn** | ghi bậc của đa thức, từ 0° đến 3°, trên mỗi đoạn biểu đồ | tắt |

Trang [Kết quả và biểu đồ](/vi/essentials/results#reading-the-sign) giải thích cách đọc dấu.

### Màu sắc {#colors}

Màu riêng cho nút, phần tử, tải trọng, sơ đồ biến dạng, lực dọc, lực cắt, mô men uốn và phản lực. Nhấp vào một ô màu để chọn màu. Mặc định: tải trọng màu cam, sơ đồ biến dạng xám, N xanh dương, V xanh lá, M đỏ, phản lực tím, nút và phần tử đen.

## Điều khiển và phím tắt {#controls-shortcuts}

**Kéo màn hình bằng** chọn nút chuột dùng để kéo khung vẽ: *Con lăn hoặc nút phải* (mặc định), *Con lăn chuột* (nhấn giữ con lăn rồi kéo), hoặc *Nút phải*. Mọi phím tắt có ở trang [Bàn phím, chuột và cảm ứng](/vi/reference/shortcuts).

## Những gì được lưu trong trình duyệt {#what-is-stored-in-your-browser}

Ngoài cài đặt, EduBeam còn lưu trong bộ nhớ cục bộ (local storage) của trình duyệt:

- **mô hình hiện tại**, được lưu sau mỗi thay đổi, nên khi tải lại thẻ trình duyệt hoặc mở lại ứng dụng, mô hình sẽ trở lại;
- **Kết cấu gần đây**: 10 mô hình gần nhất bạn đã xóa hoặc thay thế, sẵn sàng để khôi phục từ menu ☰.

Cả hai chỉ thuộc về trình duyệt này trên thiết bị này, và sẽ mất khi bạn xóa dữ liệu của trang web. Để giữ một mô hình hoặc chuyển nó sang thiết bị khác, hãy dùng [Lưu dự án hoặc Chia sẻ mô hình](/vi/essentials/import-export).
