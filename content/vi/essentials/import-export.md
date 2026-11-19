---
description: "Lưu và mở dự án, mở phiên làm việc của EduBeam bản desktop, chia sẻ qua liên kết, nhúng trình xem, xuất hình ảnh và bảng kết quả, ngay trong trình duyệt."
source: site
---

# Tệp, liên kết và xuất dữ liệu

:span{#nhap-xuat-va-chia-se}

Bạn có thể lưu mô hình thành tệp, gửi đi dưới dạng liên kết, nhúng vào trang web, hoặc xuất ra hình ảnh hay bảng số liệu. Mọi thứ trong [EduBeam]{.edubeam} đều diễn ra trong trình duyệt của bạn và không có gì được tải lên máy chủ: bản thân liên kết chia sẻ chứa toàn bộ mô hình.

::card-grid{cols="3"}
:::card{title="Tệp dự án" icon="lucide:file-json" to="#save-a-project"}
`project.json` để lưu giữ, nộp bài hoặc mở lại sau.
:::
:::card{title="Liên kết chia sẻ" icon="lucide:link" to="#share-a-link"}
Toàn bộ mô hình trong một URL, dùng cho tài liệu bài giảng, slide và tin nhắn.
:::
:::card{title="Hình ảnh hoặc bảng" icon="lucide:image" to="#export-an-image"}
PNG hoặc SVG cho báo cáo, CSV cho bảng tính.
:::
::

## Lưu dự án {#save-a-project}

**☰ → Lưu dự án** hoặc <kbd>Ctrl</kbd>+<kbd>S</kbd> (<kbd>⌘</kbd>+<kbd>S</kbd> trên máy Mac, như với mọi phím tắt trên trang này) tải xuống tệp `project.json`. Tệp chứa các nút, phần tử, vật liệu, tiết diện (kèm hình đã vẽ), tải trọng, đường kích thước và phiên bản ứng dụng đã ghi tệp. Bạn có thể đổi tên tệp tùy ý.

## Mở dự án {#open-a-project}

**☰ → Mở dự án** hoặc <kbd>Ctrl</kbd>+<kbd>O</kbd>, rồi chọn tệp, hoặc **kéo tệp thả vào bất kỳ đâu trên cửa sổ ứng dụng**. EduBeam mở được:

- tệp `project.json` do mọi phiên bản EduBeam lưu;
- phiên làm việc `.xml` do **EduBeam bản desktop** 2.x đến 3.5 lưu. Giá trị trong đó không kèm đơn vị, nên được đọc theo kN, kPa và m, là các đơn vị mà sách hướng dẫn của chương trình đó dùng. EduBeam mở mỗi lần một trường hợp tải: với phiên làm việc có nhiều trường hợp tải, nó mở trường hợp đầu tiên và liệt kê tên những trường hợp bị bỏ qua.

Khi mở, tệp sẽ thay thế mô hình hiện tại, kể cả vật liệu và tiết diện. Mô hình cũ của bạn không bị mất: <kbd>Ctrl</kbd>+<kbd>Z</kbd> khôi phục nó, và nó được giữ trong [Kết cấu gần đây](#recent-structures). Tệp mà EduBeam không đọc được sẽ bị từ chối kèm thông báo, và mô hình của bạn vẫn giữ nguyên.

## Chia sẻ liên kết {#share-a-link}

**Chia sẻ mô hình**, trên thanh ứng dụng hoặc trong menu ☰, mở hộp thoại *Chia sẻ mô hình qua URL*:

![Hộp thoại Chia sẻ mô hình qua URL](/screenshots/vi/c1-share.webp){.shot-lg}

- Nhấn **Sao chép**, hoặc nhấp vào bất kỳ đâu trong ô, để sao chép liên kết.
- **Mở liên kết** mở nó trong thẻ trình duyệt mới, để bạn thấy đúng những gì người nhận sẽ thấy.
- **Chia sẻ qua hộp thoại hệ thống** chuyển liên kết sang bảng chia sẻ của thiết bị, nếu trình duyệt hỗ trợ.
- **Liên kết ngắn hơn** (bật sẵn) mã hóa cùng mô hình đó chỉ với khoảng một nửa số ký tự. Các bản EduBeam cũ hơn phiên bản 1.3.2 (tháng 11/2026) chưa đọc được nó cho đến khi cập nhật, nên hãy tắt tùy chọn này khi liên kết phải mở được ở mọi nơi ngay lập tức.
- **Hiện đúng những gì tôi thấy** (tắt sẵn) làm liên kết mở ra với các biểu đồ, tải trọng và nhãn bạn đang bật, thay vì tùy chọn hiển thị của chính người nhận.

Liên kết có dạng `https://run.edubeam.app/?model=…` và mã hóa toàn bộ mô hình. Ai mở liên kết sẽ có bản sao riêng để chỉnh sửa; các chỉnh sửa **không** được đồng bộ ngược lại, nên khi mô hình thay đổi, hãy gửi liên kết mới. Mô hình rất lớn tạo ra liên kết rất dài; khi đó hãy chia sẻ tệp dự án.

Khi ai đó mở một liên kết, mô hình trước đó của họ được chuyển vào Kết cấu gần đây, và một thông báo cho họ biết tìm nó ở đâu. Liên kết không bao giờ hết hạn: liên kết trong tài liệu bài giảng năm ngoái hôm nay vẫn mở đúng mô hình đó.

## Nhúng trình xem {#embed-a-read-only-viewer}

Thêm `&viewer=1` vào liên kết chia sẻ để mở mô hình ở **chế độ trình xem**: thanh ứng dụng, thanh dưới cùng, hoàn tác và làm lại, các nút lưới, ô đơn vị và dấu thập đều bị ẩn, chỉ còn hình vẽ, các nút vừa màn hình và căn giữa, và tùy chọn hiển thị. Hộp thoại chào mừng và ghi chú phát hành cũng không mở ra. Đặt URL đó vào một `<iframe>` để nhúng một mô hình tương tác, thu phóng được, vào tài liệu bài giảng, trang môn học hoặc slide:

```html
<iframe
  src="https://run.edubeam.app/?viewer=1&show=MRLS&model=…"
  width="100%"
  height="400"
></iframe>
```

![Khung ba khớp ở chế độ trình xem](/screenshots/vi/viewer-mode.webp){.shot-lg}

Chế độ trình xem dùng để xem, nhưng không bị khóa: người xem vẫn kéo được nút và chuyển đổi biểu đồ. Khi mở riêng, liên kết trình xem thay thế mô hình của người xem như mọi liên kết khác, và mô hình của họ chờ sẵn trong Kết cấu gần đây. Khi được nhúng vào trang của một website khác, phần lớn trình duyệt hiện nay cấp cho khung nhúng bộ nhớ riêng, nên mô hình của người xem không bị ảnh hưởng, nhưng không phải trình duyệt nào cũng vậy.

Với hình minh họa không cần đến ứng dụng, chẳng hạn một biểu đồ tĩnh trong trang web, slide hay phiếu bài tập, thư viện vẽ [@edubeam/plot](/vi/plot) vẽ kết cấu và biểu đồ nội lực từ mã nguồn. Các hình tương tác trên trang web này đều được vẽ bằng thư viện đó.

## Tham số URL {#url-parameters}

| Tham số | Tác dụng |
| --- | --- |
| `model=<data>` | Tải mô hình đã mã hóa và thu phóng cho vừa màn hình. **Chia sẻ mô hình** tự thêm tham số này. |
| `viewer=1` | [Chế độ trình xem](#embed-a-read-only-viewer). |
| `show=<letters>` | Mở với đúng các lớp hiển thị này được bật, mỗi lớp một chữ cái: `N` lực dọc, `V` lực cắt, `M` mô men uốn, `U` sơ đồ biến dạng, `R` phản lực, `L` tải trọng, `S` gối tựa, `n` nhãn nút, `e` nhãn phần tử. `show=MRLS` hiện mô men uốn, phản lực, tải trọng và gối tựa. **Hiện đúng những gì tôi thấy** tự thêm tham số này. |
| `lang=<code>` | Đổi ngôn ngữ giao diện: `en`, `cs`, `de`, `fr`, `es`, `pt`, `pl`, `cn` (tiếng Trung), `th`, `uk`, `ru`, `tr`, `hi`, `vi`, `it`, `id`, `ja`, `ko`. |
| `panel=examples` | Mở ngay thư viện ví dụ. |

Các tham số nối với nhau bằng `&`, như trong `?lang=de&viewer=1&model=…`. Sau khi đọc xong, EduBeam xóa chúng khỏi thanh địa chỉ. `lang` và `show` được giữ lại làm cài đặt của người xem, như thể họ đã tự chọn trong ứng dụng.

## Xuất hình ảnh {#export-an-image}

**☰ → Xuất hình ảnh** hoặc <kbd>Ctrl</kbd>+<kbd>P</kbd> mở hộp thoại xuất hình ảnh. Hình vẽ được bố trí lại theo kích thước bạn chọn, nên nét vẽ và chữ giữ đúng độ dày thật.

![Xuất hình ảnh: chọn lớp hiển thị, khung hình và kích thước, rồi tải xuống hoặc sao chép](/screenshots/vi/export-image.webp)

::div{.steps}

### Chọn lớp hiển thị {#choose-the-layers}

Các nhãn ở trên cùng chọn những gì được vẽ: sơ đồ biến dạng, N, V, M và phản lực, sau đó là gối tựa, tải trọng, nhãn nút và nhãn phần tử. Ban đầu chúng giống tùy chọn hiển thị của vùng hiển thị, và thay đổi chúng ở đây không ảnh hưởng đến vùng hiển thị.

### Chọn khung hình {#frame-the-drawing}

Chọn tỷ lệ khung hình (16:9, 4:3, 3:2 hoặc 1:1), **Toàn bộ**, hoặc **Vùng chọn…** để kéo một hình chữ nhật trên hình vẽ. Bạn cũng có thể kéo các cạnh của bản xem trước.

### Đặt kích thước {#set-the-size}

Chiều rộng và chiều cao tính bằng pixel, hoặc một **Tỷ lệ** như 1 : 50 để có bản vẽ đúng tỷ lệ trên giấy (ở 96 DPI). **Chiều cao biểu đồ** đặt kích cỡ các biểu đồ kết quả, còn **Nền trong suốt** bỏ nền trắng. Nếu biểu đồ hoặc nhãn không vừa, hộp thoại sẽ báo và đề nghị thu nhỏ biểu đồ hoặc mở rộng khung vẽ.

### Lưu hình {#save-it}

**Tải PNG**, **Tải SVG** hoặc, nếu trình duyệt cho phép, **Sao chép vào bộ nhớ tạm**. Tệp được đặt tên theo kích thước, ví dụ `edubeam-512x512.svg`. Trên màn hình độ phân giải cao, ảnh PNG có nhiều pixel hơn chiều rộng và chiều cao bạn đặt, theo tỷ lệ mật độ điểm ảnh của màn hình, để ảnh sắc nét như trong ứng dụng; kích thước tính bằng pixel của nó được ghi cạnh các nút bấm.

::

SVG sắc nét ở mọi kích thước và dùng được trong Word, Inkscape và LaTeX trên Overleaf, nên là lựa chọn tốt nhất cho báo cáo và đồ án, luận văn. Với cùng một kích thước, kết cấu luôn nằm ở cùng vị trí trong khung hình, nên các hình N, V và M xuất lần lượt rồi đặt cạnh nhau sẽ thẳng hàng.

Để tạo những hình như vậy từ mã nguồn, chẳng hạn mỗi bài trong phiếu bài tập một hình, thư viện @edubeam/plot xuất ra [một tệp SVG độc lập](/vi/plot/functions#a-standalone-svg-file) mở được trong chính các chương trình ấy.

## Xuất kết quả {#export-the-results}

**Xuất CSV** trong thẻ **Kết quả** tải xuống cả hai bảng kết quả, kể cả phản lực, còn **Sao chép** đưa chúng vào bộ nhớ tạm để dán vào bảng tính. Xem [Xuất CSV và sao chép](/vi/essentials/results#export-csv-and-copy).

## Kết cấu gần đây {#recent-structures}

**☰ → Kết cấu gần đây** giữ 10 kết cấu gần nhất đã bị xóa, hoặc đã bị thay bằng một liên kết, một tệp, một ví dụ, bài tập vẽ dầm đầu tiên hay một lần khôi phục khác. Mỗi mục có hình thu nhỏ, cho biết cái gì đã thay thế nó, cùng số nút và số phần tử. **Khôi phục** đưa một kết cấu trở lại: mô hình bạn đang có khi đó lại được đưa vào danh sách, và <kbd>Ctrl</kbd>+<kbd>Z</kbd> hoàn tác thao tác khôi phục. **Gỡ bỏ** xóa một mục.

![Kết cấu gần đây](/screenshots/vi/recent.webp){.shot-lg}

Danh sách chỉ được lưu trong trình duyệt này.

## Ví dụ {#examples}

**☰ → Ví dụ** mở thư viện các mô hình giảng dạy dựng sẵn. Mở một ví dụ sẽ thay thế mô hình của bạn, và <kbd>Ctrl</kbd>+<kbd>Z</kbd> đưa mô hình của bạn trở lại. Các mô hình này, kèm bài tập, có ở trang [Ví dụ](/vi/examples/) của tài liệu này.

![Thư viện ví dụ](/screenshots/vi/examples.webp){.shot-lg}

## Tự động lưu {#automatic-persistence}

Mô hình và cài đặt của bạn được lưu vào bộ nhớ cục bộ (local storage) của trình duyệt sau mỗi thay đổi và được khôi phục khi bạn quay lại, kể cả sau khi đã đóng trình duyệt. Đây chỉ là tiện ích, không phải bản sao lưu: nó thuộc về một hồ sơ trình duyệt trên một thiết bị, cửa sổ ẩn danh không nhớ nó, và xóa dữ liệu trang web sẽ xóa nó. Hãy lưu công việc quan trọng thành tệp dự án. Mục [Những gì được lưu trong trình duyệt](/vi/essentials/units-settings#what-is-stored-in-your-browser) liệt kê đầy đủ.

## Định dạng tệp dự án {#project-file-format}

`project.json` là JSON thuần, dễ đọc. Dưới đây là dầm trong bài [Bắt đầu nhanh](/vi/guide/quick-start), với thép và tiết diện IPE 200 lấy từ thư viện:

```json [project.json]
{
  "edubeam": true,
  "version": "1.3.4",
  "domain": {
    "materials": [
      {
        "label": "Steel (S235)",
        "d": 7850,
        "e": 210000000000,
        "g": 81000000000,
        "alpha": 0.000012
      }
    ],
    "crossSections": [
      {
        "label": "IPE 200 (approx)",
        "a": 0.002848,
        "iy": 0.00001943,
        "h": 0.2,
        "k": 0.3932584269662922
      }
    ],
    "nodes": [
      { "label": "1", "coords": [0, 0, 0], "bcs": [0, 2] },
      { "label": "2", "coords": [6, 0, 0], "bcs": [2] }
    ],
    "elements": [
      {
        "label": "1",
        "nodes": ["1", "2"],
        "mat": "Steel (S235)",
        "cs": "IPE 200 (approx)",
        "hinges": [false, false]
      }
    ],
    "loadCases": [
      {
        "label": "DefaultLC",
        "nodalLoads": [],
        "elementLoads": [
          { "type": "udl", "target": "1", "lcs": true, "values": [0, 12000] }
        ],
        "prescribedBC": []
      }
    ]
  },
  "dimensions": []
}
```

Mọi giá trị đều theo **đơn vị SI** (m, N, Pa, rad), bất kể ứng dụng đang hiển thị đơn vị nào. Tọa độ có dạng `[x, y, z]` với $y = 0$ và $z$ hướng xuống. Gối tựa và các thành phần tải trọng dùng mã bậc tự do `0 = Dx`, `2 = Dz`, `4 = Ry`.

| `type` của tải trọng phần tử | Giá trị |
| --- | --- |
| `udl` | `values: [fx, fz]` tính bằng N/m |
| `trapezoidal` | `startValues: [f1x, f1z]`, `endValues: [f2x, f2z]` tính bằng N/m |
| `concentrated` | `values: [Fx, Fz, My, a]` tính bằng N, N·m, và m tính từ nút đầu |
| `temperature` | `values: [ΔTc, ΔTb, ΔTt]` tính bằng K; chênh lệch nhiệt độ là ΔTb − ΔTt |

`lcs: true`, hoặc không có `lcs`, đặt tải trọng phần tử theo hệ trục địa phương của phần tử; `false` thì theo hệ trục tổng thể. Các mục khác:

- **Tải trọng nút**: `{ "target": "2", "values": { "0": Fx, "2": Fz, "4": My } }`, thêm `"lcs": true` cho tải trọng theo trục của gối tựa đã xoay.
- **Chuyển vị cưỡng bức**: `{ "target": "2", "prescribedValues": { "0": Dx, "2": Dz, "4": Ry } }`; thành phần nào bỏ trống thì bằng 0.
- Tệp do ứng dụng ghi còn chứa `date`, `commit`, trục của các gối tựa đã xoay (`lcs` ở nút) và `shape` của các tiết diện đã vẽ.

Vì định dạng đơn giản, bạn có thể tạo mô hình bằng script hoặc bảng tính rồi mở bằng **Mở dự án**. Để dựng và giải mô hình hoàn toàn bằng mã nguồn, hãy dùng bộ giải của chính ứng dụng, thư viện [@edubeam/fem](/vi/solver).
