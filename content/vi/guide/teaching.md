---
description: "Giảng dạy với EduBeam: mô hình trực tiếp trên máy chiếu, liên kết chia sẻ trong tài liệu, bài tập tự kiểm tra, bài luyện tập tự sinh và đề thi in kèm đáp án."
source: site
---

# Giảng dạy với EduBeam

[EduBeam]{.edubeam} ra đời trong giảng đường, và đó vẫn là nơi nó phát huy tốt nhất: một mô hình trên máy chiếu phản hồi ngay khi bạn thay đổi, và cùng mô hình đó có trên máy tính của từng sinh viên qua một liên kết. Trang này tổng hợp những gì giảng viên dùng nhiều nhất, từ buổi giảng đầu tiên đến kỳ thi.

::card-grid{cols="2"}
:::card{title="Trong giờ giảng" icon="lucide:presentation" to="#in-the-lecture"}
Cho hàng ghế cuối cũng nhìn rõ mô hình, và sửa mô hình ngay trên lớp.
:::
:::card{title="Buổi thực hành đầu tiên" icon="lucide:graduation-cap" to="#getting-students-started"}
Mười phút từ màn hình trống đến một dầm đã kiểm tra bằng tính tay.
:::
:::card{title="Trong tài liệu và bài tập" icon="lucide:link" to="#in-lecture-notes-and-assignments"}
Một liên kết trong tệp PDF hay trên slide mở ra toàn bộ mô hình, và vẫn mở được sau nhiều năm.
:::
:::card{title="Bài tập tự kiểm tra" icon="lucide:list-checks" to="#assignments-students-can-check-themselves"}
Tính tay trước, rồi dùng mô hình để kiểm tra.
:::
:::card{title="Luyện tập và đề thi" icon="lucide:file-check" to="#practice-and-test-papers"}
Bài tập tự sinh, kiểm tra đáp số ngay, và đề thi in được kèm đáp án.
:::
:::card{title="Phiếu bài tập và slide từ mã nguồn" icon="lucide:dices" to="#exercise-sheets-tests-and-slides-from-code"}
Trình tạo bài tập và hình vẽ cho slide của riêng bạn, viết bằng @edubeam/plot.
:::
::

## Trong giờ giảng {#in-the-lecture}

- **Cho hàng ghế cuối cũng đọc được.** Trong **Cài đặt → Cài đặt hiển thị**, tăng **Cỡ chữ** lên 18 hoặc 20 px (20 px là lớn nhất) và **Kích cỡ gối tựa** lên 130–150 %. Nếu biểu đồ vẫn trông nhỏ, hãy tăng **Tỷ lệ kết quả**.
- **Mỗi lần chỉ cho xem một thứ.** Trong tùy chọn hiển thị ở góc trên bên phải vùng hiển thị, bỏ đánh dấu mọi thứ trừ đại lượng bạn đang giảng, rồi lần lượt thêm các đại lượng khác.
- **Thay đổi mô hình ngay trên lớp.** Kéo một gối tựa, đánh dấu `Ry`, thêm một khớp. Sinh viên thấy ngay nguyên nhân và hệ quả, còn <kbd>Ctrl</kbd>+<kbd>Z</kbd> đưa mô hình về như cũ.
- **Để bộ giải giải thích hệ biến hình.** Đặt thừa một khớp là EduBeam vẽ ra cách kết cấu có thể chuyển động, chạy hoạt ảnh chuyển động đó và khoanh tròn những khớp gây ra hệ biến hình. Đây là dịp tốt để bàn về tính bất biến hình của hệ. Cả hai công tắc nằm trong **Cài đặt → Cài đặt hiển thị → Kiểm tra mô hình**.
- **Dùng ngôn ngữ và hệ trục của sinh viên.** EduBeam có 18 ngôn ngữ giao diện, và trong [Cài đặt](/vi/essentials/units-settings) bạn chuyển được giữa đơn vị SI và hệ Mỹ, giữa trục z hướng xuống và trục y hướng lên, cho khớp với giáo trình của bạn.

![Hệ biến hình hiện rõ trên màn hình: các khớp tại B và C cho phép khung chuyển vị ngang](/screenshots/vi/ui-mechanism.webp)

## Buổi thực hành đầu tiên {#getting-students-started}

Lần đầu mở ứng dụng, EduBeam hỏi sinh viên muốn bắt đầu thế nào và dùng đơn vị, hệ trục nào. Hãy dặn trước sinh viên đơn vị và hệ trục mà môn học của bạn dùng. Phần giới thiệu giao diện (**Xem giới thiệu**), bài tập có hướng dẫn **Vẽ dầm đầu tiên** và các **Ví dụ** vẫn nằm trong menu **☰** để dùng sau.

Một buổi thực hành đầu tiên hiệu quả: “mở run.edubeam.app và chọn *Vẽ dầm đầu tiên*”, sau đó là trang [Bắt đầu nhanh](/vi/guide/quick-start): khoảng mười phút, cuối bài có phần kiểm tra bằng tính tay.

### Phòng máy và dùng ngoại tuyến {#offline-and-lab-computers}

EduBeam là một ứng dụng web tiến bộ (PWA): sau khi trình duyệt đã tải ứng dụng một lần, EduBeam vẫn chạy được khi mất mạng, và trình duyệt có thể đề nghị cài nó như một ứng dụng desktop. Mô hình và cài đặt được lưu riêng cho từng hồ sơ trình duyệt, nên trên máy tính dùng chung ở phòng máy, sinh viên nên mang bài làm về dưới dạng tệp hoặc liên kết. Chi tiết xem ở mục [Những gì được lưu trong trình duyệt](/vi/essentials/units-settings#what-is-stored-in-your-browser).

## Trong tài liệu bài giảng và bài tập {#in-lecture-notes-and-assignments}

Một liên kết chia sẻ chứa toàn bộ mô hình, nên nó dùng được ở mọi nơi đặt được liên kết: tệp PDF, slide, trang LMS, e-mail.

::div{.steps}

### Dựng mô hình {#share-build}

Thiết lập mô hình đúng như bạn muốn sinh viên nhìn thấy lần đầu: tải trọng, nhãn và các biểu đồ cần bật.

### Sao chép liên kết {#share-copy}

Nhấn **Chia sẻ mô hình** trên thanh ứng dụng. Bật **Hiện đúng những gì tôi thấy** nếu muốn liên kết mở ra với các biểu đồ, tải trọng và nhãn bạn đang bật, rồi nhấn **Sao chép**.

### Dán vào tài liệu của bạn {#share-paste}

Sinh viên mở liên kết sẽ nhận được bản sao riêng để tự khám phá. Những gì họ thay đổi chỉ nằm trên máy họ, không đến tay bạn hay bất kỳ ai khác. Liên kết vẫn hoạt động qua các phiên bản EduBeam, nên tài liệu của bạn dùng được năm này qua năm khác.

::

Với tài liệu môn học, hãy tắt **Liên kết ngắn hơn**: một bản EduBeam chưa cập nhật kể từ khi tùy chọn này ra đời sẽ không mở được dạng liên kết ngắn cho đến khi được cập nhật.

| Liên kết | Mở ra |
| --- | --- |
| `run.edubeam.app/?model=…` | mô hình, sẵn sàng để chỉnh sửa |
| `run.edubeam.app/?viewer=1&model=…` | mô hình ở [chế độ trình xem](/vi/essentials/import-export#embed-a-read-only-viewer), để đặt trong `<iframe>` |
| `run.edubeam.app/?panel=examples` | các [Ví dụ](/vi/examples/) có sẵn |
| `run.edubeam.app/?lang=vi` | ứng dụng bằng tiếng Việt, hoặc bằng bất kỳ [ngôn ngữ nào khác](/vi/essentials/import-export#url-parameters) |

::callout{type="warning" title="Mở liên kết sẽ thay thế mô hình riêng của sinh viên"}
Khi sinh viên mở một liên kết, và ở một số trình duyệt là cả khi mở một trang có nhúng trình xem, mô hình họ đang có sẽ được chuyển vào **☰ → Kết cấu gần đây** và có thể khôi phục từ đó. Dù vậy, hãy nhắc sinh viên lưu những bài làm quan trọng bằng **☰ → Lưu dự án** trước khi mở liên kết từ lớp học.
::

## Bài tập sinh viên tự kiểm tra được {#assignments-students-can-check-themselves}

EduBeam cho sinh viên biết ngay bài tính tay đúng hay sai mà không giải hộ họ.

- **Tính trước, kiểm tra sau.** Yêu cầu tính tay phản lực, nội lực và một chuyển vị, rồi cho sinh viên dựng mô hình và so sánh. Trang [Kiểm tra kết quả bằng tính tay](/vi/guide/verification) có sẵn các công thức, và phần [Bắt đầu nhanh](/vi/guide/quick-start#_8-check-by-hand) trình bày cách làm.
- **Hỏi vì sao kết quả khác nhau.** Biến dạng trượt, thiếu một khớp, tải trọng nhập theo hệ trục địa phương thay vì tổng thể: mỗi nguyên nhân gây ra một sai lệch, lớn hoặc nhỏ, và tự tìm ra nguyên nhân giúp sinh viên học được nhiều hơn một kết quả khớp ngay.
- **Thu mô hình cùng bài làm.** Yêu cầu nộp liên kết chia sẻ hoặc tệp `project.json` kèm bài tính. Bạn mở ra là thấy chính xác sinh viên đã mô hình hóa những gì.
- **Báo cáo trông chuyên nghiệp.** Sinh viên có thể xuất hình vẽ dạng **SVG**, vẫn sắc nét trong Word và LaTeX, và kết quả dạng **CSV**. Xem [Xuất hình ảnh](/vi/essentials/import-export#export-an-image).

## Bài tập có sẵn {#ready-made-exercises}

- **[Ví dụ](/vi/examples/):** sáu mô hình mở chỉ với một cú nhấp, mỗi mô hình kèm câu hỏi, những điểm cần chú ý và đáp số.
- **[Luyện tập](/vi/practice):** dầm, khung và dàn tự sinh, tự kiểm tra đáp số của sinh viên, cùng [Trình tạo đề thi](/vi/exam) để in các bài đó thành đề thi. Xem [bên dưới](#practice-and-test-papers).
- **[Hướng dẫn](/vi/tutorials/inclined-beam):** dầm xiên, khung ba khớp, dàn phẳng và dầm liên tục có gối bị lún, mỗi bài dựng từng bước và kiểm tra bằng tính tay. Mỗi bài dùng được làm phiếu thực hành 15–20 phút.
- **[Kiểm tra kết quả bằng tính tay](/vi/guide/verification):** các trường hợp có công thức giải tích, từ dầm công xôn đến lún gối tựa, để giao làm bài kiểm tra nhanh.

## Bài luyện tập và đề thi {#practice-and-test-papers}

Hai trang trên website này soạn bài tập Cơ học kết cấu cho bạn, không cần cài đặt và không cần lập trình:

- **[Luyện tập](/vi/practice)** cho sinh viên một bài mới mỗi khi họ yêu cầu. Sinh viên giải trên giấy, nhập phản lực và mô men uốn lớn nhất hoặc lực dọc trong một thanh dàn, và trang kiểm tra từng giá trị so với lời giải chính xác: sai lệch trong phạm vi 1 % được tính là đúng, còn giá trị đúng độ lớn nhưng sai chiều sẽ được chỉ ra. Phần gợi ý cho biết nên bắt đầu từ đâu, và biểu đồ hiện ra khi đã làm xong. Mỗi bài có một mã bài, chẳng hạn `H2048`, luôn ứng với đúng một bài: ghi mã bài vào bài tập về nhà, và cả lớp kiểm tra theo cùng một bộ số.
- **[Trình tạo đề thi](/vi/exam)** in đề thi: chọn các dạng kết cấu, tối đa 6 bài mỗi đề và tối đa 40 mã đề, mỗi sinh viên nhận một mã đề khác nhau. Mọi mã đề có cùng các dạng kết cấu theo cùng thứ tự, nên các đề khó ngang nhau. Đề có dòng ghi họ tên, chỗ làm bài và đáp án; nút **In hoặc lưu thành PDF** in tất cả ra. **Tải .zip** cho bạn mọi hình vẽ dưới dạng tệp SVG cho LaTeX và Word, và đáp số dưới dạng bảng CSV để chấm bài.

Cả hai trang có cùng tám dạng kết cấu: sáu hệ tĩnh định (dầm đơn giản, dầm công xôn, dầm có đầu thừa, dầm Gerber, khung ba khớp và dàn Warren) và hai hệ siêu tĩnh (dầm liên tục hai nhịp và khung cổng).

Trình tạo đề thi lưu mọi thiết lập, kể cả **Số hiệu bộ đề** quyết định các con số, ngay trong địa chỉ trang. Lưu địa chỉ đó vào dấu trang, năm sau bạn sẽ có lại đúng bộ đề và đáp án ấy. Mã bài mặc định không in trên đề thi: trang Luyện tập hiện lời giải, nên mã bài hợp với bài tập về nhà, nơi sinh viên tự kiểm tra bài của mình sau khi làm.

## Phiếu bài tập, đề thi và slide từ mã nguồn {#exercise-sheets-tests-and-slides-from-code}

Các hình vẽ trên website này do [@edubeam/plot](/vi/plot) vẽ. Đây là thư viện component Vue, vẽ được mọi dầm, khung hay dàn phẳng do [@edubeam/fem](/vi/solver), bộ giải của EduBeam, tính ra. Nếu bạn viết được một chút JavaScript, vài dòng mã sẽ thành tài liệu giảng dạy:

- **Dạng bài của riêng bạn.** Nếu trình tạo đề thi không có dạng kết cấu bạn dạy, hãy tự viết: một seed (giá trị khởi tạo bộ sinh số ngẫu nhiên) chọn kết cấu và các con số của nó, nên cùng một seed luôn cho cùng một bài, và đáp án cũng được tạo từ chính seed đó.
- **Slide dựng dần từng bước.** Cho xem kết cấu, rồi gối tựa và tải trọng, rồi phản lực, rồi biểu đồ mô men, từng bước một, mà hình vẽ không xê dịch giữa các bước.
- **Hình cho tài liệu và trang môn học.** SVG sắc nét, theo chủ đề màu sáng hoặc tối của trang, và, khác với ứng dụng nhúng, không bao giờ động đến mô hình riêng của sinh viên.

Hãy thử xem. Mỗi lần nhấn **Bài tập mới** sẽ tạo một bài mới cùng đáp án của nó:

::exercise-generator
::

::card-grid{cols="2"}
:::card{title="Bài tập và đề thi" icon="lucide:file-check" to="/vi/plot/exercises"}
Tạo phiếu bài tập và đáp án từ một seed.
:::
:::card{title="Slide và tài liệu bài giảng" icon="lucide:presentation" to="/vi/plot/slides"}
Hình vẽ dựng dần từng lớp, cho slide và tài liệu.
:::
::
