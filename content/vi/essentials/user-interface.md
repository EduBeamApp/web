---
description: "Bản đồ giao diện EduBeam: thanh ứng dụng và menu ☰, vùng hiển thị với các nút và tùy chọn hiển thị, chọn và sửa, các bảng ở thanh dưới cùng, cách nhập giá trị."
source: site
---

# Giao diện người dùng

[EduBeam]{.edubeam} có ba vùng: **thanh ứng dụng** ở trên cùng, **vùng hiển thị** ở giữa, nơi bạn vẽ, và **thanh dưới cùng** với một bảng cho mỗi loại đối tượng. Việc gì làm được trong vùng hiển thị thì cũng làm được trong các bảng, và ngược lại.

![Các phần của giao diện, đánh số theo danh sách bên dưới](/screenshots/vi/ui-overview.webp)

1. **Menu ☰**: mở, lưu, chia sẻ và xuất; ví dụ và các bài hướng dẫn trong ứng dụng.
2. **Xóa kết cấu** và **Chia sẻ mô hình**.
3. **Hoàn tác** và **Làm lại**.
4. **Các nút của vùng hiển thị**: căn giữa, vừa màn hình và tùy chọn hiển thị.
5. **Tùy chọn hiển thị**: chọn kết quả và thành phần nào của mô hình được vẽ.
6. **Lưới, bắt dính, dấu thập và đơn vị.**
7. **Các thẻ của thanh dưới cùng**: Nút, Phần tử, Tải trọng, Vật liệu, Tiết diện, Kết quả.
8. **Bảng** của thẻ đang mở, nơi bạn sửa được mọi giá trị.

::callout{type="tip" title="Tham quan giao diện"}
**☰ → Xem giới thiệu** lần lượt chỉ cho bạn từng phần này ngay trong ứng dụng.
::

## Thanh ứng dụng {#app-bar}

- **☰** mở menu chính, xem bên dưới.
- **Xóa kết cấu** xóa mọi nút, phần tử và tải trọng sau khi bạn xác nhận; đánh dấu **Xóa vật liệu** hoặc **Xóa tiết diện** để xóa luôn vật liệu hoặc tiết diện. <kbd>Ctrl</kbd>+<kbd>Z</kbd> khôi phục mô hình, và mô hình đã xóa cũng được giữ trong *Kết cấu gần đây*.
- **Chia sẻ mô hình** mở [hộp thoại chia sẻ](/vi/essentials/import-export#share-a-link) với một liên kết chứa toàn bộ mô hình.
- **Có gì mới?** hiện ghi chú phát hành. Sau mỗi lần cập nhật, chúng tự mở một lần.
- **Tài liệu** mở tài liệu hướng dẫn này, còn biểu tượng GitHub mở mã nguồn.

Trên điện thoại, thanh chỉ đủ chỗ cho ☰ và **Tài liệu**; **Xóa kết cấu** và **Chia sẻ mô hình** nằm trong menu.

### Menu ☰ {#the-☰-menu}

![Menu ☰](/screenshots/vi/ui-app-menu.webp){.shot-xs}

- **Mở dự án** và **Lưu dự án** mở hoặc tải xuống tệp `project.json` (<kbd>Ctrl</kbd>+<kbd>O</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>).
- **Kết cấu gần đây** giữ 10 mô hình gần nhất bạn đã xóa hoặc thay thế, để bạn khôi phục khi cần.
- **Xuất hình ảnh** lưu hình vẽ thành PNG hoặc SVG, hoặc sao chép hình vẽ (<kbd>Ctrl</kbd>+<kbd>P</kbd>).
- **Ví dụ** là bộ sưu tập các mô hình dựng sẵn; **Vẽ dầm đầu tiên** là bài tập có hướng dẫn gồm bảy bước; **Xem giới thiệu** đưa bạn đi một vòng quanh giao diện.
- **Chia sẻ mô hình** và **Xóa kết cấu** giống hệt hai nút trên thanh ứng dụng.

Cuối menu ghi phiên bản ứng dụng và ngày phát hành. Mở, lưu, chia sẻ và xuất được trình bày ở trang [Tệp, liên kết và xuất dữ liệu](/vi/essentials/import-export).

## Vùng hiển thị {#viewer}

Khung vẽ là nơi bạn vẽ và xem mô hình. EduBeam tính lại kết quả sau mỗi thay đổi, nên không có nút *Giải*.

### Các nút trên khung vẽ {#buttons-on-the-canvas}

**Góc trên bên trái: Hoàn tác và Làm lại** lần lượt lùi lại hoặc tiến tới qua từng thay đổi của mô hình: thêm, sửa, kéo, xóa, xóa toàn bộ kết cấu (<kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>).

**Góc trên bên phải:**

- **Chọn bằng khung**, trên thiết bị có màn hình cảm ứng: lần kéo ngón tay tiếp theo sẽ vẽ một khung chọn hình chữ nhật.
- **Căn giữa** đưa mô hình vào giữa mà không thu phóng (<kbd>C</kbd>); **Vừa màn hình** thu phóng để cả mô hình vừa khít màn hình (<kbd>F</kbd>).
- **⚙** hiện hoặc ẩn [tùy chọn hiển thị](#display-options).

**Góc dưới bên phải:**

![Các nút lưới, bắt dính, dấu thập và đơn vị](/screenshots/vi/ui-grid-units.webp){.shot-sm}

- **G** hiện hoặc ẩn lưới và thước (<kbd>G</kbd>); **S** bật hoặc tắt bắt dính lưới (<kbd>S</kbd>).
- Nút **dấu thập** đánh dấu vị trí con trỏ trên thước (chỉ khi dùng chuột).
- **Ô đơn vị** mở phần cài đặt ở mục [Ngôn ngữ và khu vực](/vi/essentials/units-settings#language-locale).

### Tùy chọn hiển thị {#display-options}

Nút ⚙ mở hai hàng ô đánh dấu. Hàng thứ nhất chọn các kết quả được vẽ chồng lên mô hình: *Biến dạng*, *N (x)*, *V<sub>z</sub> (x)*, *M<sub>y</sub> (x)* và *Phản lực*; ban đầu bật sẵn biến dạng, mô men uốn và phản lực. Hàng thứ hai hiện hoặc ẩn các phần của mô hình: *Gối tựa*, *Tải trọng*, *Nhãn nút* và *Nhãn phần tử*, ban đầu đều bật.

![Các nút của vùng hiển thị và tùy chọn hiển thị](/screenshots/vi/ui-display-settings.webp){.shot-lg}

**Thêm cài đặt** mở [cài đặt hiển thị](/vi/essentials/units-settings#viewer-settings): kích cỡ, màu sắc và cách vẽ biểu đồ. Trang [Kết quả và biểu đồ](/vi/essentials/results#overlays-in-the-viewer) giải thích từng kết quả cho biết gì.

### Di chuyển trên khung vẽ {#navigating}

| Thao tác | Chuột và bàn phím | Cảm ứng |
| --- | --- | --- |
| Thu phóng | Con lăn chuột (thu phóng về phía con trỏ); trên bàn di chuột, chụm hoặc cuộn bằng hai ngón | Chụm hai ngón |
| Dịch chuyển hình vẽ | Kéo khi giữ nút chuột phải hoặc giữ con lăn; chọn nút nào trong [Điều khiển và phím tắt](/vi/essentials/units-settings#controls-shortcuts) | Kéo bằng một ngón tay |
| Vừa màn hình, căn giữa | <kbd>F</kbd>, <kbd>C</kbd> hoặc các nút ở góc trên bên phải | Các nút ở góc trên bên phải |

<kbd>Ctrl</kbd>+<kbd>+</kbd> và <kbd>Ctrl</kbd>+<kbd>-</kbd> thu phóng hình vẽ quanh tâm của nó, với mọi kiểu bố trí bàn phím. Hai tổ hợp phím này không bao giờ phóng to cả giao diện như khi trình duyệt tự thu phóng.

### Chọn và sửa {#selecting-and-editing}

| Muốn | Thao tác |
| --- | --- |
| Chọn một đối tượng | Nhấp vào một nút, phần tử, tải trọng hoặc đường kích thước. Bảng thao tác của đối tượng mở ra ngay bên cạnh: thêm tải trọng, đặt gối tựa, sửa, xem ma trận độ cứng, xóa. Thanh dưới cùng chuyển sang thẻ tương ứng. |
| Chọn nhiều đối tượng | Kéo một hình chữ nhật trên vùng trống của khung vẽ (trên màn hình cảm ứng, nhấn **Chọn bằng khung** trước). Mọi nút nằm bên trong và mọi phần tử mà hình chữ nhật chạm vào đều được chọn, cùng tải trọng và đường kích thước của chúng. <kbd>Ctrl</kbd>+<kbd>A</kbd> chọn tất cả. |
| Xóa, sao chép, dán | <kbd>Delete</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>. Phần được dán đi theo con trỏ cho đến khi bạn nhấp chuột; bạn cũng có thể nhập độ dời Δx, Δz ở thanh thông báo. |
| Di chuyển một nút | Kéo nút đó. Khi bật bắt dính, nút sẽ bắt vào điểm lưới; các phần tử và tải trọng nối với nút di chuyển theo. |
| Sửa một tải trọng | Nhấp đúp vào tải trọng. |
| Xem chi tiết | Di chuột lên bất kỳ đối tượng nào để xem chú thích: chuyển vị và góc xoay của nút, vật liệu và tiết diện của phần tử, giá trị của tải trọng. Trên màn hình cảm ứng, chạm vào đối tượng: bảng thao tác của nó hiện đúng các thông tin ấy. |
| Mở menu khung vẽ | Nhấp chuột phải vào khung vẽ, hoặc nhấn giữ trên màn hình cảm ứng. |

::div{.shots}

![Bảng thao tác của một nút: thêm tải trọng, đặt gối tựa, đặt chuyển vị cưỡng bức](/screenshots/vi/ui-node-menu.webp)

![Di chuột lên một nút sẽ hiện chuyển vị và góc xoay của nó](/screenshots/vi/ui-hover.webp)

::

**Menu khung vẽ** có *Thêm nút*, *Thêm phần tử*, *Thêm kích thước* (và *Ghi kích thước phần tử* khi mở trên một phần tử), sau đó là *Sửa*, *Sao chép*, *Dán* và *Xóa* cho các đối tượng đang chọn. Giữ <kbd>Ctrl</kbd> khi chọn *Thêm nút* hoặc *Thêm phần tử* để đặt chúng bằng chuột thay vì qua hộp thoại.

![Menu khung vẽ](/screenshots/vi/ui-canvas-menu.webp){.shot-sm}

Trang [Bàn phím, chuột và cảm ứng](/vi/reference/shortcuts) liệt kê mọi phím tắt và thao tác cảm ứng.

### Khi mô hình không giải được {#when-the-model-cannot-be-solved}

Các thông báo hiện ở góc trên bên trái vùng hiển thị:

| Thông báo | Ý nghĩa |
| --- | --- |
| *Chưa có vật liệu nào.*, *Chưa có tiết diện nào.* | Nhấn **Thêm mới** ngay bên cạnh để thêm vật liệu hoặc tiết diện. |
| Nhãn màu xanh dương **Cần gối tựa** | Mô hình chỉ là chưa dựng xong: cần thêm gối tựa. |
| Thông báo màu đỏ, kèm **Hiện chi tiết** | Mô hình có lỗi. Phần chi tiết liệt kê từng vấn đề, mỗi vấn đề kèm một gợi ý. |
| Thông báo màu vàng | Mô hình đã giải được, nhưng có chỗ trông bất thường, chẳng hạn một nút không nối với phần tử nào. |

Khi kết cấu vẫn còn chuyển động được, EduBeam vẽ nó bằng nét đứt, đung đưa qua lại, và khoanh tròn các nút hoặc khớp gây ra lỗi. Di chuột lên thông báo để xem lại chuyển động; biểu tượng con mắt trên thông báo sẽ ẩn hình chuyển động đi.

![Khung có khớp tại B và C là hệ biến hình: EduBeam cho thấy nó chuyển động thế nào](/screenshots/vi/ui-mechanism.webp)

Trang [Khắc phục sự cố](/vi/reference/troubleshooting#messages) giải thích từng thông báo và cách sửa.

## Thanh dưới cùng {#bottom-bar}

Thanh dưới cùng có sáu thẻ, mỗi thẻ gồm một thanh công cụ và một bảng sửa trực tiếp được. Nhãn của thẻ cho biết thẻ đang chứa bao nhiêu đối tượng. Kéo dải thẻ lên hoặc xuống để đổi chiều cao của thanh, hoặc thu gọn hẳn bằng nút bấm ở bên phải. Dấu **?** bên cạnh giải thích thẻ đang mở; dấu **?** cạnh một số tiêu đề cột cũng giải thích cột đó.

| Thẻ | Thanh công cụ | Các cột của bảng |
| --- | --- | --- |
| **Nút** | Thêm nút (hộp thoại), Thêm nút (chuột) | Nút, Tọa độ, **Bậc tự do bị chặn** (ký hiệu gối tựa, `Dx`, `Dz`, `Ry`, góc α), Tải trọng, Thao tác |
| **Phần tử** | Thêm phần tử (hộp thoại), Thêm phần tử (chuột) | Phần tử, Loại, Nút (kèm **Đổi thứ tự nút**), Vật liệu, Tiết diện, **Khớp đầu thanh**, Tải trọng, Thao tác |
| **Tải trọng** | Thêm tải nút, Thêm tải phần tử | Loại, Đối tượng, Thành phần, Thao tác |
| **Vật liệu** | Thêm vật liệu, Thư viện vật liệu | Vật liệu, E, G, α<sub>T</sub>, Thao tác |
| **Tiết diện** | Thêm tiết diện, Thư viện tiết diện, Tiết diện đa giác | Hình dạng, Tiết diện, Diện tích, I<sub>y</sub>, Chiều cao, Hệ số hiệu chỉnh cắt, Thao tác |
| **Kết quả** | Kết quả tại nút, Kết quả phần tử, Xuất CSV, Sao chép | Chuyển vị tại từng nút, hoặc nội lực đầu phần tử của từng phần tử; xem [Kết quả và biểu đồ](/vi/essentials/results#results-tab) |

Các thẻ được trình bày chi tiết ở các trang [Nút và gối tựa](/vi/essentials/nodes-supports), [Phần tử, vật liệu và tiết diện](/vi/essentials/elements), [Tải trọng](/vi/essentials/loads) và [Kết quả và biểu đồ](/vi/essentials/results#results-tab).

### Nhập giá trị {#typing-values}

Mọi ô nhập số, trong bảng cũng như trong hộp thoại, đều hoạt động như nhau:

- Giá trị tính theo [đơn vị hiện tại](/vi/essentials/units-settings#units), ghi ở tiêu đề cột hoặc sau ô nhập.
- Dùng dấu chấm hay dấu phẩy thập phân đều được: `2.5` và `2,5` là như nhau.
- Bạn có thể gõ cả phép tính với `+ - * / ^` và dấu ngoặc: EduBeam tự tính `6/2`, `3*1.5`, `2^3` hay `(4+2)/3`, còn `1e-5` nghĩa là $10^{-5}$.
- Trong bảng, <kbd>Enter</kbd>, <kbd>Esc</kbd>, <kbd>Tab</kbd> hoặc một cú nhấp ra chỗ khác sẽ áp dụng giá trị. Sau đó <kbd>Ctrl</kbd>+<kbd>Z</kbd> lấy lại giá trị cũ; còn khi bạn đang gõ dở, nó chỉ hoàn tác phần vừa gõ.

## Các thẻ phía trên vùng hiển thị {#tabs-above-the-viewer}

**Mô hình** hiện khung vẽ. **Cài đặt** hiện [phần cài đặt](/vi/essentials/units-settings) toàn khổ ngay tại chỗ đó, để bạn đổi màu hoặc đơn vị rồi chuyển lại xem tác dụng. Ô đơn vị và *Thêm cài đặt* mở cùng phần cài đặt ấy dưới dạng hộp thoại nằm đè lên mô hình.

## Cửa sổ nổi {#floating-windows}

**Ma trận độ cứng** (từ bảng thao tác của một phần tử hoặc từ bảng ở thẻ *Phần tử*) mở một cửa sổ chứa ma trận độ cứng 6 × 6 của phần tử trong hệ trục tổng thể. **Sửa** trong menu khung vẽ mở một bảng gồm các đối tượng đang chọn. Kéo thanh tiêu đề để di chuyển cửa sổ và đóng nó bằng dấu ×.
