---
description: "Vì sao EduBeam không hiện kết quả và cách khắc phục: giải thích mọi thông báo lỗi và cảnh báo, kết quả trông có vẻ sai, tệp hoặc liên kết không mở được."
source: site
---

# Khắc phục sự cố

Khi một mô hình không giải được, [EduBeam]{.edubeam} cho biết lý do bằng một thông báo ở góc trên bên trái vùng hiển thị, và **Hiện chi tiết** liệt kê đầy đủ mọi vấn đề. Hãy chọn đúng tiêu đề hộp thoại mà bạn thấy: mỗi thông báo bên dưới đều có giải thích ý nghĩa và cách khắc phục.

::card-grid{cols="2"}
:::card{title="Chưa thể giải" icon="lucide:circle-dashed" to="#still-needed"}
Nhãn màu xanh lam **Cần gối tựa**. Không có gì sai cả: chỉ là chưa có gối tựa giữ kết cấu.
:::
:::card{title="Không thể giải mô hình" icon="lucide:circle-x" to="#errors"}
Thông báo màu đỏ. Gối tựa không giữ được kết cấu, các khớp tạo thành hệ biến hình, phần tử có chiều dài bằng 0.
:::
:::card{title="Cảnh báo mô hình" icon="lucide:triangle-alert" to="#warnings"}
Thông báo màu vàng. EduBeam vẫn giải được mô hình, nhưng có lẽ có chỗ chưa đúng ý bạn.
:::
:::card{title="Kết quả trông có vẻ sai" icon="lucide:scale" to="#results-look-wrong"}
Tải trọng hướng lên trên, độ võng lệch nhau hàng chục, hàng trăm lần, dấu có vẻ bị đảo.
:::
::

## Thông báo {#messages}

### Ý nghĩa của các màu {#read-the-message}

| Bạn thấy | Ý nghĩa |
| --- | --- |
| Nhãn màu xanh lam **Cần gối tựa** | Mô hình chưa hoàn chỉnh. Hãy thêm gối tựa. Trỏ vào nhãn để xem đường nét đứt mô tả cách kết cấu vẫn có thể chuyển động. |
| Thông báo **màu đỏ** | Có lỗi khiến mô hình không giải được. Thông báo nêu tên vấn đề, hoặc ghi *Lỗi trong mô hình: n* khi có nhiều lỗi. Các nút liên quan được khoanh tròn trên hình vẽ. |
| Thông báo **màu vàng** | Cảnh báo. Mô hình vẫn được giải. Khi có nhiều cảnh báo, thông báo ghi *Cảnh báo trong mô hình: n*. |
| *Chưa có vật liệu nào.* / *Chưa có tiết diện nào.* | Phần tử cần cả hai. Thêm bằng nút bấm **Thêm mới** cạnh thông báo. |

**Hiện chi tiết** mở hộp thoại có tiêu đề *Chưa thể giải*, *Không thể giải mô hình* hoặc *Cảnh báo mô hình*. Công tắc trong hộp thoại hiện hoặc ẩn cách kết cấu có thể chuyển động, và liên kết **Khắc phục sự cố** dẫn đến trang này.

![Hộp thoại Không thể giải mô hình, với công tắc hiện cách kết cấu có thể chuyển động](/screenshots/vi/ui-diagnostics.webp){.shot-lg}

Trên hình vẽ:

- Dấu **✕** trên thông báo màu đỏ thu nó lại thành nhãn nhỏ *Không thể giải mô hình*, để đỡ chiếm chỗ trên màn hình nhỏ. Nhấp vào nhãn để mở lại.
- Nút bấm hình **con mắt** trên thông báo màu đỏ hiện hoặc ẩn đường nét đứt mô tả chuyển động. **Cài đặt → Cài đặt hiển thị → Kiểm tra mô hình** tắt hẳn đường nét đứt này và hoạt ảnh của nó.
- Dấu **✕** trên thông báo màu vàng ẩn các cảnh báo.

### Còn thiếu {#still-needed}

Mô hình không sai, chỉ là chưa hoàn chỉnh. Trỏ vào nhãn để xem nội dung ngắn; hộp thoại hiện nội dung đầy đủ.

| Thông báo | Ý nghĩa và cách sửa |
| --- | --- |
| *Kết cấu cần gối tựa trước khi có thể giải.* <br> *Mô hình cần ít nhất 3 bậc tự do bị chặn để ổn định trong phân tích 2D.* | Tổng cộng có ít hơn ba phương bị chặn. Hãy thêm gối tựa. |
| *Phần có nút … cần gối tựa.* <br> *Một phần riêng của kết cấu (nút …) có ít hơn 3 bậc tự do bị chặn và có thể chuyển động tự do.* | Mô hình bị tách thành nhiều phần và một phần đang “trôi nổi”. Hãy nối nó vào phần còn lại, hoặc đặt gối tựa cho nó. |
| *n phần của kết cấu cần gối tựa.* | Nhiều phần đang trôi nổi. **Hiện chi tiết** liệt kê từng phần. |

### Lỗi {#errors}

Có lỗi khiến mô hình không giải được. Thông báo màu đỏ hiện nội dung ngắn, hộp thoại hiện nội dung đầy đủ.

| Thông báo | Ý nghĩa và cách sửa |
| --- | --- |
| *Các gối tựa không giữ được kết cấu: nó vẫn có thể trượt theo phương ngang / chuyển động theo phương đứng / xoay tự do / chuyển động như vật rắn.* <br> *Kết cấu có đủ gối tựa nhưng chúng không giữ được nó: kết cấu vẫn có thể …* | Đủ số liên kết, nhưng tất cả đều song song với nhau, hoặc đường tác dụng của chúng đồng quy tại một điểm, như ba gối di động trên một dầm nằm ngang. Đường nét đứt cho thấy chuyển động; hãy xoay hoặc dời một gối tựa. |
| *Phần có nút … không được giữ: nó vẫn có thể …* <br> *Một phần riêng của kết cấu (nút …) có đủ gối tựa nhưng chúng không giữ được nó: phần đó vẫn có thể …* | Tương tự như trên, cho một phần của mô hình bị tách thành nhiều phần. |
| *Khớp tại nút … cho phép kết cấu chuyển động.* <br> *Các gối tựa giữ được kết cấu, nhưng nó vẫn là hệ biến hình: các thanh có thể xoay quanh khớp tại nút …* | Các khớp cho phép các thanh xoay tương đối với nhau, như khung có hai chân cột là gối cố định và khớp ở đỉnh mỗi cột, hoặc một ô vuông gồm các thanh liên kết khớp mà không có thanh xiên. Hãy bỏ một khớp, hoặc thêm một thanh hay một gối tựa. |
| *Kết cấu không ổn định: nó chuyển động gần như không có sức cản.* <br> *Kết cấu không ổn định: nút … theo phương ngang (Dx) … chuyển động gần như không có sức cản.* | Gần như là hệ biến hình, hoặc có độ cứng gần bằng 0. Thông báo đầy đủ nêu tên các nút và phương. Kiểm tra gối tựa, khớp và các giá trị `E`, `A` và `Iy`. |
| *Kết cấu là hệ biến hình: nó có thể chuyển động không có sức cản.* <br> *Kết cấu là hệ biến hình: ma trận độ cứng suy biến.* | Có phần nào đó chuyển động tự do mà các kiểm tra ở trên không phát hiện. Kiểm tra xem mỗi phần đã có ít nhất ba liên kết giữ lại chưa, và các khớp đầu thanh có để thanh nào xoay tự do không. |
| *Phần tử … có chiều dài bằng 0: nút … và … nằm tại cùng một điểm.* | Hai nút của một phần tử nằm chồng lên nhau. Dời một nút, hoặc xóa phần tử. |
| *Phần tử … tham chiếu cùng một nút ở cả hai đầu.* | Xóa phần tử và vẽ lại giữa hai nút khác nhau. |
| *Phần tử … tham chiếu nút / vật liệu / tiết diện … không tồn tại.* | Đối tượng mà phần tử dùng đã bị xóa, thường do tệp dự án bị sửa bằng tay. Gán lại trong bảng *Phần tử*. |
| *Phần tử … phải tham chiếu đúng 2 nút.* | Phần tử bị hỏng trong một tệp đã nhập. Xóa và vẽ lại phần tử. |
| *Tải trọng nút #n tham chiếu nút … không tồn tại.* <br> *Chuyển vị cưỡng bức #n tham chiếu nút … không tồn tại.* | Xóa tải trọng, hoặc gán nó cho một nút đang có. |
| *Tải trọng phần tử #n tham chiếu phần tử … không tồn tại.* | Xóa tải trọng. |
| *Bộ giải thất bại do mô hình không nhất quán bên trong.* | Lỗi chung. Hoàn tác bước vừa làm, hoặc lưu dự án và [báo lỗi](#reporting-a-bug). |

### Cảnh báo {#warnings}

Mô hình vẫn được giải, nhưng hãy kiểm tra những điểm sau:

| Thông báo | Ý nghĩa và cách sửa |
| --- | --- |
| *Nút … không nối với phần tử nào và bị bộ giải bỏ qua.* | Một nút thừa. Xóa nút đó, hoặc nối nó vào kết cấu. |
| *Nút … có gối tựa nhưng không có phần tử nào nối vào, nên gối tựa không chịu lực gì.* | Gối tựa đặt trên một nút thừa. |
| *Tải trọng nút #n chứa giá trị không hợp lệ.* <br> *Chuyển vị cưỡng bức #n chứa giá trị không hợp lệ.* | Có thành phần không phải là số. Sửa lại tải trọng. |

### Trong khi chỉnh sửa {#while-editing}

Các thông báo này hiện trong hộp thoại của trình duyệt khi bạn đang làm việc, và mô hình được giữ nguyên như trước:

| Thông báo | Ý nghĩa và cách sửa |
| --- | --- |
| *Vui lòng thêm vật liệu trước.* <br> *Vui lòng thêm tiết diện trước.* | Phần tử cần cả hai. Thêm trong thẻ *Vật liệu* hoặc *Tiết diện*, rồi vẽ lại phần tử. |
| *Vui lòng chọn vật liệu và tiết diện.* | Hộp thoại **Thêm phần tử** còn một ô trống. Chọn cả hai. |
| *Nhãn … đã được dùng.* | Hai nút, phần tử, vật liệu hoặc tiết diện không được trùng nhãn. Chọn nhãn khác. |
| *Nút này đã có chuyển vị cưỡng bức. Vui lòng xóa nó trước.* | Mỗi nút chỉ có một chuyển vị cưỡng bức. Sửa chuyển vị đang có, hoặc xóa nó trước. |

## Không có gì được vẽ {#no-results-are-drawn}

Khi không có biểu đồ nào xuất hiện, hãy kiểm tra theo thứ tự sau:

::div{.steps}

### Kiểm tra tùy chọn hiển thị {#check-the-display-options}

Nếu không có thông báo nào, mô hình đã được giải: có thể biểu đồ chỉ đang bị tắt. Đánh dấu **M<sub>y</sub>(x)** hoặc một kết quả khác trong tùy chọn hiển thị ở góc trên bên phải vùng hiển thị; nút bấm ⚙ phía trên chúng mở bảng này. Mô hình không có tải trọng thì mọi kết quả đều bằng không, nên cũng không có gì để vẽ.

### Kiểm tra gối tựa {#check-the-supports}

Bộ giải cần ít nhất ba phương bị chặn, và các gối tựa phải cùng nhau ngăn kết cấu trượt hoặc xoay. Dầm đặt trên hai gối di động chỉ có hai liên kết và sẽ trượt đi: hãy đổi một gối thành **gối cố định**. Ba gối di động song song, hoặc các gối tựa có đường tác dụng đồng quy tại một điểm, cũng không giữ được kết cấu. Xem [Nút và gối tựa](/vi/essentials/nodes-supports#supports).

### Kiểm tra các phần tử đã được nối với nhau chưa {#check-the-connections}

Hai nút có cùng tọa độ vẫn là hai nút riêng biệt, nên một phần chỉ chạm vào phần còn lại tại chỗ đó thực ra vẫn rời ra và “trôi” tự do. Xóa nút thừa và nối lại. Khi đặt một nút lên phần tử, hãy chọn **Nối vào kết cấu** để chia phần tử tại đó.

### Đếm số khớp {#count-the-hinges}

Khung có hai chân cột là gối cố định và khớp ở đỉnh mỗi cột, hoặc một ô vuông gồm các thanh liên kết khớp mà không có thanh xiên, là hệ biến hình. EduBeam khoanh tròn các khớp và vẽ đường nét đứt lắc qua lại theo dạng chuyển động của hệ. Xem [Khớp đầu thanh](/vi/essentials/elements#end-hinges).

### Tìm độ cứng bằng 0 {#look-for-zero-stiffness}

`E`, `A` hoặc `Iy` nhập bằng 0, hoặc sai đơn vị, khiến một phần kết cấu chuyển động gần như không có sức cản. EduBeam báo trường hợp này là *không ổn định*.

::

## Kết quả trông có vẻ sai {#results-look-wrong}

| Hiện tượng | Nguyên nhân có thể |
| --- | --- |
| Tải trọng tác dụng hướng lên | Trục **z tổng thể hướng xuống**, nên `Fz` hoặc `fz` dương tác dụng hướng xuống; giá trị âm hướng lên. Với hệ trục y hướng lên thì ngược lại. Xem [Tải trọng](/vi/essentials/loads#sign-convention-in-one-line). |
| Độ võng lệch hàng chục, hàng trăm lần | Nhầm đơn vị: `E` nhập theo Pa trong khi ô nhập dùng MPa, hoặc `Iy` theo cm⁴ trong khi ô nhập dùng m⁴. Ô đơn vị ở góc dưới bên phải vùng hiển thị liệt kê đơn vị mà mọi ô nhập đang dùng. |
| Độ võng lớn hơn một chút so với công thức trong giáo trình | Biến dạng trượt của dầm Timoshenko. Xem [Kiểm tra kết quả bằng tính tay](/vi/guide/verification#shear-deformation). |
| Dấu có vẻ sai | Đọc dấu từ giá trị, không phải từ phía mà biểu đồ được vẽ: M dương là căng thớ dưới. Nội lực đầu phần tử trong *Kết quả phần tử* theo hệ trục địa phương của phần tử, không theo quy ước N-V-M. Xem [Cách đọc dấu](/vi/essentials/results#reading-the-sign). |
| Biểu đồ nằm ở phía “sai” | Phía vẽ biểu đồ là một tùy chọn hiển thị: mô men uốn vẽ về phía thớ chịu kéo hoặc thớ chịu nén, N và V vẽ về phía nào của nét đứt cũng được. **Cài đặt → Cài đặt hiển thị → Biểu đồ nội lực**. |
| Hai cột giống hệt nhau có lực cắt trái dấu | Dấu của V theo chiều của từng phần tử. Đổi thứ tự nút của một cột để so sánh. |
| Các số như `4 · 10¹` | Định dạng số khoa học. Chọn *Tự động* trong **Cài đặt → Ngôn ngữ và khu vực → Định dạng số**. |
| Biểu đồ quá to hoặc quá nhỏ | Chỉ là hình vẽ. Chỉnh **Tỷ lệ kết quả** trong **Cài đặt → Cài đặt hiển thị**. |
| Tải theo hệ trục địa phương hướng sai chiều | Trục x địa phương của phần tử chạy từ nút *đầu* đến nút *cuối*. Đổi thứ tự nút, hoặc đổi dấu. |
| Tải trên thanh xiên bị lệch phương | **LCS** được đánh dấu theo mặc định, nên `fz` tác dụng vuông góc với thanh. Bỏ đánh dấu để có tải theo phương đứng. |
| Tải nhiệt độ không có tác dụng gì | Kết cấu tĩnh định biến dạng tự do dưới tác dụng của nhiệt độ, không phát sinh nội lực. Nếu cả biến dạng cũng không có, hãy kiểm tra α khác 0 và, với chênh lệch nhiệt độ, kiểm tra chiều cao tiết diện $h$ đã được nhập. |

## Tệp và liên kết {#files-and-links}

| Hiện tượng | Cách sửa |
| --- | --- |
| *Không thể nhập tệp. Vui lòng kiểm tra định dạng tệp.* | Tệp không phải là dự án EduBeam cũng không phải phiên làm việc của EduBeam bản desktop. Mô hình của bạn vẫn giữ nguyên. |
| *Phiên EduBeam này có nhiều trường hợp tải, nhưng chỉ mở được một.* | Phiên làm việc của EduBeam bản desktop có nhiều trường hợp tải: EduBeam mở trường hợp đầu tiên và nêu tên những trường hợp bị bỏ qua. |
| Liên kết chia sẻ lại mở ra mô hình cũ của bạn | Liên kết bị cắt cụt hoặc bị thay đổi, chẳng hạn do chương trình e-mail ngắt dòng. EduBeam bỏ qua liên kết không đọc được và giữ nguyên mô hình của bạn. Hãy sao chép lại toàn bộ liên kết. |
| Liên kết ngắn không mở được trên máy đồng nghiệp | Bản EduBeam của họ cũ hơn phiên bản 1.3.2. Họ cần tải lại ứng dụng, hoặc bạn tắt **Liên kết ngắn hơn** rồi chia sẻ lại. Xem [Chia sẻ liên kết](/vi/essentials/import-export#share-a-link). |

## Sự cố giao diện {#interface-issues}

| Hiện tượng | Cách sửa |
| --- | --- |
| Phím tắt không có tác dụng | Nhấp vào hình vẽ trước: các phím đơn bị bỏ qua khi con trỏ đang ở trong một ô nhập. Trên máy Mac, dùng <kbd>Cmd</kbd> thay cho <kbd>Ctrl</kbd>. Xem [Bàn phím, chuột và cảm ứng](/vi/reference/shortcuts). |
| <kbd>Delete</kbd> không có tác dụng trên máy Mac | Phím ghi *delete* trên bàn phím Mac thực ra là Backspace. Hãy nhấn <kbd>Fn</kbd>+<kbd>Delete</kbd>. |
| Không kéo được màn hình | Kéo màn hình bằng nút giữa hoặc nút phải chuột; chọn nút nào trong **Cài đặt → Điều khiển và phím tắt**. Trên bàn di chuột, nhấp và kéo bằng hai ngón. Trên màn hình cảm ứng, kéo bằng một ngón. |
| Mô hình của tôi biến mất | Khi mở liên kết, tệp hoặc ví dụ, và khi xóa kết cấu, mô hình cũ được giữ lại: **☰ → Kết cấu gần đây**, hoặc <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Khi mở một liên kết, ứng dụng thông báo điều đó ở cuối màn hình: *Đã mở một kết cấu được chia sẻ. Kết cấu trước đó của bạn được giữ trong Kết cấu gần đây.*, kèm nút bấm **Hiện**. |
| Sai ngôn ngữ | **Cài đặt → Ngôn ngữ và khu vực**, hoặc thêm `?lang=vi` vào địa chỉ. |
| Thay đổi cài đặt không được giữ lại | Bộ nhớ cục bộ (local storage) của trình duyệt bị chặn, chẳng hạn trong cửa sổ ẩn danh hoặc ở chế độ bảo mật nghiêm ngặt. Cài đặt, mô hình đã lưu và Kết cấu gần đây đều cần đến nó. |

## Báo lỗi {#reporting-a-bug}

Mở một [issue trên GitHub](https://github.com/janvorisek/edubeam/issues), ghi rõ trình duyệt và hệ điều hành, bạn đã làm gì và mong đợi kết quả gì. Hữu ích nhất là một **liên kết chia sẻ** hoặc **tệp dự án** tái hiện được vấn đề.
