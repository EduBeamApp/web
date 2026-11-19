---
description: "Trả lời ngắn về EduBeam: chi phí, dùng ngoại tuyến, quyền riêng tư, độ chính xác, cách tính kết quả, trích dẫn, bài luyện tập, chia sẻ và lập trình."
source: site
---

# Câu hỏi thường gặp

Câu trả lời ngắn gọn, mỗi câu kèm liên kết đến trang trình bày đầy đủ chủ đề đó. Không thấy câu hỏi của bạn? Xem [Khắc phục sự cố](/vi/reference/troubleshooting) hoặc [hỏi trên GitHub](https://github.com/janvorisek/edubeam/issues).

## Tổng quan {#general}

### EduBeam là gì? {#what-is-edubeam}

Một ứng dụng miễn phí, mã nguồn mở, dùng để phân tích tĩnh tuyến tính dầm, khung và dàn phẳng, dành cho sinh viên, giảng viên và kỹ sư muốn có phản hồi tức thì. Ứng dụng chạy trên trình duyệt. Trang [Giới thiệu](/vi/guide/introduction) liệt kê những gì EduBeam làm được và chưa làm được.

### Có thật sự miễn phí không? Có cần tài khoản không? {#is-it-really-free-do-i-need-an-account}

Hoàn toàn miễn phí, và không cần tài khoản. Mở [run.edubeam.app](https://run.edubeam.app/?lang=vi){target="_blank"} và bắt đầu mô hình hóa: không phải cài đặt gì và không giới hạn sử dụng. Mã nguồn có trên [GitHub](https://github.com/janvorisek/edubeam), theo giấy phép GPL-3.0.

### EduBeam chạy trên trình duyệt và thiết bị nào? {#which-browsers-and-devices-work}

Mọi phiên bản hiện hành của Chrome, Edge, Firefox hoặc Safari, trên máy tính, máy tính bảng hay điện thoại. Trên màn hình cảm ứng, chạm để chọn, kéo một nút để di chuyển nó, kéo ở chỗ khác để dịch chuyển khung nhìn, chụm hai ngón để thu phóng, và nhấn giữ để mở menu khung vẽ. Dù vậy, dựng mô hình bằng chuột và bàn phím vẫn nhanh hơn. Xem [Bàn phím, chuột và cảm ứng](/vi/reference/shortcuts#touch).

### Tôi bị mất mô hình. Có lấy lại được không? {#i-lost-my-model-can-i-get-it-back}

Nhiều khả năng là được. Khi một mô hình bị xóa, hoặc bị một liên kết, một tệp hay một ví dụ thay thế, EduBeam giữ nó trong **☰ → Kết cấu gần đây** (10 mô hình gần nhất), và <kbd>Ctrl</kbd>+<kbd>Z</kbd> hoàn tác việc thay thế. Cả danh sách này lẫn lịch sử hoàn tác chỉ nằm trong trình duyệt này, nên mô hình từ máy tính khác hay hồ sơ trình duyệt khác sẽ không có ở đây. Xem [Kết cấu gần đây](/vi/essentials/import-export#recent-structures).

### Có dùng được khi không có mạng không? {#can-i-use-it-offline}

Có. EduBeam là một ứng dụng web tiến bộ (PWA): sau khi trình duyệt đã tải EduBeam một lần, ứng dụng vẫn chạy khi mất mạng, và trình duyệt có thể đề nghị cài đặt nó. Khi có phiên bản mới, một hộp thoại sẽ hỏi bạn trước khi cập nhật.

### Dữ liệu của tôi được lưu ở đâu? {#where-is-my-data-stored}

Trong trình duyệt của bạn. Không có tài khoản và không có lưu trữ đám mây: ứng dụng giữ mô hình và cài đặt của bạn trong trình duyệt này, còn liên kết chia sẻ chứa mô hình ngay trong bản thân liên kết. Xem [Những gì được lưu trong trình duyệt](/vi/essentials/units-settings#what-is-stored-in-your-browser).

Ứng dụng tại run.edubeam.app có thu thập thống kê sử dụng (Google Analytics) và báo cáo lỗi (Sentry). Một báo cáo lỗi, cũng như bản ghi mà Sentry tạo cho một số phiên làm việc được chọn mẫu, có thể chứa những gì hiện trên màn hình, trong đó có mô hình của bạn.

### Luyện giải bài tập Cơ học kết cấu ở đâu? {#practice}

Trên trang [Luyện tập](/vi/practice). Mỗi lần trang cho bạn một dầm, khung hoặc dàn với bộ số mới: giải trên giấy để tìm phản lực và mô men uốn lớn nhất hoặc lực dọc trong thanh dàn, nhập kết quả vào, và từng giá trị được kiểm tra ngay. Các [ví dụ](/vi/examples/) cũng có câu hỏi kèm đáp số. Giảng viên có thể in cho mỗi sinh viên một mã đề khác nhau, kèm đáp án, bằng [Trình tạo đề thi](/vi/exam); xem [Bài luyện tập và đề thi](/vi/guide/teaching#practice-and-test-papers).

### Trích dẫn EduBeam thế nào? {#cite}

Trích dẫn như một phần mềm, ghi rõ phiên bản và ngày bạn sử dụng. Số phiên bản nằm ở cuối menu **☰**. Ví dụ:

> Voříšek, J. và những người đóng góp. *EduBeam*, phiên bản 1.3.4 \[phần mềm\]. https://edubeam.app (truy cập ngày 18 tháng 11 năm 2026).

Để dẫn chiếu một mô hình cụ thể, hãy thêm [liên kết chia sẻ](/vi/essentials/import-export#share-a-link) của nó: liên kết mở đúng mô hình đó cho mọi người đọc.

## Mô hình hóa {#modelling}

### Làm sao tạo ngàm, gối cố định hoặc gối di động? {#how-do-i-make-a-fixed-pinned-roller-support}

Nhấp vào nút, chọn **Gối tựa tại nút** và chọn ký hiệu: gối cố định, gối di động, ngàm, ngàm trượt và các loại khác. Hoặc đánh dấu các bậc tự do bị chặn trong thẻ **Nút**: `Dx` + `Dz` + `Ry` là ngàm, `Dx` + `Dz` là gối cố định, chỉ `Dz` là gối di động. Trang [Nút và gối tựa](/vi/essentials/nodes-supports#supports) liệt kê mọi loại.

### Làm sao tạo dàn? {#how-do-i-make-a-truss}

Vẽ các thanh như phần tử thông thường và giải phóng cả hai đầu của từng thanh: đánh dấu cả hai ô **Khớp đầu thanh** trong thẻ **Phần tử**, hoặc đánh dấu **Khớp đầu** và **Khớp cuối** trên thanh thông báo trước khi vẽ các thanh bằng chuột. Đặt tải trọng tại các nút. Bài hướng dẫn [Dàn phẳng](/vi/tutorials/truss) dựng một dàn từng bước.

### Làm sao đặt khớp trong khung? {#how-do-i-put-a-hinge-in-a-frame}

Giải phóng mô men tại đầu của phần tử cần xoay tự do: đánh dấu khớp ở đầu đó trong thẻ **Phần tử**. Khớp thuộc về một đầu phần tử, nên tại nút có nhiều phần tử, giải phóng đầu của một phần tử thì các phần tử còn lại vẫn nối cứng với nhau. Xem [Khớp đầu thanh](/vi/essentials/elements#end-hinges).

### Làm sao thêm gối tựa hoặc lực tập trung ở giữa dầm? {#how-do-i-add-a-support-or-a-point-load-in-the-middle-of-a-beam}

Với gối tựa, hãy thêm một nút lên dầm bằng chuột (nút bấm **Thêm nút** có biểu tượng con trỏ) và chọn **Nối vào kết cấu**: dầm được chia làm hai tại nút đó, và bạn có thể đặt gối tựa tại nút này. Lực tập trung thì không cần nút: thêm **Tải tập trung** cho phần tử và nhập vị trí của nó tính từ nút đầu. Xem [Đặt nút lên phần tử có sẵn](/vi/essentials/nodes-supports#placing-a-node-on-an-existing-element) và [Tải tập trung](/vi/essentials/loads#concentrated-load).

### Có tính được trọng lượng bản thân không? {#can-i-apply-self-weight}

Không tính tự động: khối lượng riêng của vật liệu không được dùng trong phân tích tĩnh. Hãy nhập trọng lượng bản thân thành tải phân bố đều $f_z = \rho g A$, ví dụ với IPE 200 là $7850 \cdot 9{,}81 \cdot 28{,}48 \cdot 10^{-4} = 219$ N/m, tức 0,22 kN/m.

### Có mô hình hóa được gối tựa xiên không? {#can-i-model-inclined-supports}

Có. Đặt **Góc LCS của nút** cho nút, khi đó các liên kết gối tựa của nút sẽ theo hệ trục đã xoay. Xem [Gối tựa xiên](/vi/essentials/nodes-supports#inclined-skewed-supports).

### Có làm việc với đơn vị hệ Mỹ được không? {#can-i-work-in-us-customary-units}

Có. Nhấp vào ô đơn vị ở góc dưới bên phải vùng hiển thị để mở **Cài đặt → Ngôn ngữ và khu vực**, rồi đặt **Hệ đơn vị** thành **Hệ Mỹ (imperial)** để dùng feet và kip, hoặc chọn riêng từng đơn vị. Mô hình luôn được lưu theo SI, nên đổi đơn vị chỉ đổi cách hiển thị, không bao giờ làm thay đổi mô hình. Xem [Đơn vị và cài đặt](/vi/essentials/units-settings).

### Có trường hợp tải hoặc tổ hợp tải không? {#are-there-load-cases-or-combinations}

Không, mỗi mô hình chỉ có một trường hợp tải. Hãy lưu mỗi trường hợp thành một tệp hoặc một liên kết riêng, và tự tổ hợp kết quả. Một phiên làm việc từ EduBeam bản desktop có nhiều trường hợp tải sẽ mở với trường hợp đầu tiên, và một thông báo nêu tên những trường hợp bị bỏ qua.

### Tại sao tải trọng của tôi hướng lên trên? {#why-do-my-loads-point-up}

Có lẽ vì bạn đã nhập giá trị âm. Trong EduBeam, trục z tổng thể hướng **xuống**, nên `fz` hay `Fz` dương là tải hướng xuống, cùng chiều trọng lực: 12 kN/m hướng xuống là `fz = 12`. Xem [Hệ tọa độ và quy ước dấu](/vi/elements/conventions#loads). Nếu môn học của bạn dùng trục đứng hướng lên, hãy chuyển sang **x sang phải, y lên trên** trong **Cài đặt → Ngôn ngữ và khu vực → Hệ tọa độ**: khi đó dữ liệu nhập và kết quả đều theo trục này.

## Kết quả {#results}

### Tại sao không có nút “Giải”? {#why-is-there-no-solve-button}

Vì EduBeam giải lại mô hình sau mỗi thay đổi. Nếu không thấy kết quả, nghĩa là mô hình chưa giải được, và một thông báo trên khung vẽ cho biết lý do. Trang [Khắc phục sự cố](/vi/reference/troubleshooting#no-results-are-drawn) liệt kê những gì cần kiểm tra.

### Tại sao độ võng hơi khác so với công thức? {#why-does-my-deflection-differ-slightly-from-the-formula}

EduBeam dùng phần tử dầm Timoshenko, nên độ võng có kể đến biến dạng trượt mà công thức trong giáo trình thường bỏ qua. Với dầm mảnh, chênh lệch vào khoảng 1 %, và trang [Bắt đầu nhanh](/vi/guide/quick-start#_8-check-by-hand) tính tay cả phần chênh lệch này. Trong kết cấu siêu tĩnh, độ cứng chống cắt còn làm nội lực thay đổi đôi chút. Xem thêm [Kiểm tra kết quả bằng tính tay](/vi/guide/verification).

### Kết quả chính xác đến đâu? Có cần thêm phần tử không? {#how-accurate-are-the-results-do-i-need-more-elements}

Với phân tích tĩnh tuyến tính, phần tử dầm cho kết quả chính xác với mọi loại tải trọng mà EduBeam có, nên mỗi thanh một phần tử là đủ, không cần chia lưới mịn hơn. Chỉ thêm nút ở những chỗ cần gối tựa, khớp, thay đổi tiết diện, tải trọng nút, hoặc cần đọc chuyển vị. Xem [Độ chính xác](/vi/essentials/results#precision-and-accuracy).

### EduBeam tính kết quả như thế nào? {#how-does-edubeam-compute-the-results}

Bằng phương pháp độ cứng trực tiếp – cách làm của phương pháp phần tử hữu hạn được dạy trong môn Cơ học kết cấu – ngay trên trình duyệt của bạn. Trang [EduBeam giải mô hình như thế nào](/vi/elements/analysis) đi qua từng bước trên một ví dụ nhỏ mà bạn có thể tự tính lại bằng tay, và bản thân bộ giải là mã nguồn mở, dưới tên [@edubeam/fem](/vi/solver).

### Có xem được ma trận độ cứng không? {#can-i-see-the-stiffness-matrices}

Có. Trong thẻ **Phần tử**, nút bấm ma trận trên dòng của mỗi phần tử mở ma trận độ cứng 6 × 6 của nó, theo hệ trục tổng thể và đơn vị SI (N, m). Nhấp vào một phần tử trong vùng hiển thị cũng có mục **Ma trận độ cứng**. Trang [Phần tử dầm](/vi/elements/beam#global-stiffness-matrix) trình bày cách thiết lập ma trận này.

### Phản lực được liệt kê ở đâu? {#where-are-the-reactions-listed}

Trong vùng hiển thị, dưới dạng mũi tên kèm giá trị: mục **Phản lực** trong tùy chọn hiển thị, bật sẵn theo mặc định. Phản lực cũng có trong tệp từ **Kết quả → Xuất CSV** và trong dữ liệu mà **Sao chép** đưa vào bộ nhớ tạm. Thẻ **Kết quả** liệt kê chuyển vị nút và nội lực đầu phần tử. Xem [Kết quả và biểu đồ](/vi/essentials/results).

## Tệp và chia sẻ {#files-sharing}

### Làm sao chia sẻ mô hình? {#how-do-i-share-a-model}

Nhấn **Chia sẻ mô hình** rồi nhấn **Sao chép**. Liên kết chứa toàn bộ mô hình, và ai mở nó cũng nhận được một bản sao riêng để chỉnh sửa: không có tính năng cùng làm việc trực tiếp. Bật **Hiện đúng những gì tôi thấy** để liên kết mở ra với các biểu đồ và nhãn bạn đang bật. Xem [Chia sẻ liên kết](/vi/essentials/import-export#share-a-link) và, với môn học, [Giảng dạy với EduBeam](/vi/guide/teaching#in-lecture-notes-and-assignments).

### Có nhúng mô hình vào website hoặc slide được không? {#can-i-embed-a-model-on-my-website-or-in-slides}

Được. Thêm `&viewer=1` vào liên kết chia sẻ và đặt nó trong một `<iframe>`: xem [Nhúng trình xem](/vi/essentials/import-export#embed-a-read-only-viewer). Với hình tĩnh trong trang web, slide hay tài liệu in, hãy xuất ra SVG, hoặc vẽ hình từ mã nguồn bằng [@edubeam/plot](/vi/plot).

### Có xuất được hình ảnh hoặc bảng không? {#can-i-export-images-or-tables}

Được. **☰ → Xuất hình ảnh** (<kbd>Ctrl</kbd>+<kbd>P</kbd>) lưu hình vẽ thành PNG hoặc SVG, theo kích thước hoặc tỷ lệ bạn chọn. **Kết quả → Xuất CSV** lưu cả hai bảng kết quả, còn **Sao chép** đưa chúng vào bộ nhớ tạm để dán vào bảng tính. Xem [Xuất hình ảnh](/vi/essentials/import-export#export-an-image).

### Có mở được tệp từ EduBeam bản desktop không? {#can-i-open-files-from-the-desktop-edubeam}

Được. Các phiên làm việc lưu từ EduBeam bản desktop 2.x đến 3.5 (`.xml`) mở được bằng **☰ → Mở dự án** hoặc bằng cách kéo thả vào ứng dụng, giống như tệp `project.json`. Các giá trị trong đó được đọc theo đơn vị kN, kPa và m. Xem [Mở dự án](/vi/essentials/import-export#open-a-project).

### Có tạo mô hình bằng lập trình được không? {#can-i-generate-models-programmatically}

Được, theo hai cách:

- **Tự viết tệp.** Tệp `project.json` là JSON thuần theo đơn vị SI, nên một script bằng bất kỳ ngôn ngữ nào cũng ghi được, và EduBeam mở nó bằng **Mở dự án** hoặc kéo thả. Xem [định dạng tệp dự án](/vi/essentials/import-export#project-file-format).
- **Giải bằng mã nguồn.** [@edubeam/fem](/vi/solver) là bộ giải phần tử hữu hạn của EduBeam, dưới dạng thư viện JavaScript và TypeScript. Sau đó [@edubeam/plot](/vi/plot) vẽ kết quả, chẳng hạn thành một [phiếu bài tập tự sinh](/vi/plot/exercises).

Dầm ở trang [Bắt đầu nhanh](/vi/guide/quick-start), theo đơn vị SI:

```ts
import { DofID, LinearStaticSolver } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
domain.createMaterial('steel', { e: 210e9, g: 81e9 }) // Pa
const section = { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 } // m², m⁴, m
domain.createCrossSection('IPE200', section)
domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz]) // gối cố định
domain.createNode('2', [6, 0, 0], [DofID.Dz]) // gối di động
const beam = domain.createBeam2D('1', ['1', '2'], 'steel', 'IPE200')
const lc = solver.loadCases[0]
lc.createBeamElementUniformEdgeLoad('1', [0, 12e3], true) // 12 kN/m, hướng xuống

solver.solve()
beam.computeBendingMomentAt(lc, 3) // 54000 N·m ở giữa nhịp
beam.computeLocalDefl(lc, 2).w[1] // 0.0502 m ở giữa nhịp
```

## Trợ giúp {#support}

### Làm sao báo lỗi hoặc đề xuất tính năng? {#how-do-i-report-a-bug-or-request-a-feature}

Mở một issue trên [GitHub](https://github.com/janvorisek/edubeam/issues) và đính kèm liên kết chia sẻ hoặc tệp dự án tái hiện được vấn đề. Với câu hỏi riêng, hãy viết đến [support@edubeam.app](mailto:support@edubeam.app).
