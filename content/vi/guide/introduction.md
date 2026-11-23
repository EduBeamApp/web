---
description: "EduBeam là gì: bộ giải phần tử hữu hạn miễn phí trên trình duyệt cho dầm, khung và dàn phẳng. Khả năng, giới hạn, đối tượng sử dụng và các thư viện mã nguồn mở."
source: site
---

# Giới thiệu

[EduBeam]{.edubeam} là ứng dụng phân tích kết cấu miễn phí cho **dầm, khung và dàn**, chạy ngay trên trình duyệt. Bạn vẽ kết cấu, đặt gối tựa và tải trọng; sau mỗi thay đổi, bộ giải phần tử hữu hạn tính lại ngay các biểu đồ, phản lực và độ võng. Không có nút bấm *Giải*, không phải cài đặt gì và không cần tạo tài khoản.

::div{.actions}
[Mở EduBeam ↗](https://run.edubeam.app/?lang=vi){target="_blank"} [Bắt đầu nhanh trong 10 phút](/vi/guide/quick-start)
::

![Khung ba khớp trong EduBeam: tải trọng màu cam, phản lực màu tím, mô men uốn màu đỏ và sơ đồ biến dạng màu xám](/screenshots/vi/hero.webp)

:span{#your-first-visit}

## EduBeam làm được gì {#what-it-does}

::card-grid{cols="2"}
:::card{title="Kết cấu" icon="lucide:triangle" to="/vi/essentials/elements"}
Dầm, dầm liên tục, khung và dàn trong mặt phẳng x–z, dựng từ phần tử dầm Timoshenko. Khớp đầu thanh biến một thanh thành thanh dàn.
:::
:::card{title="Gối tựa" icon="lucide:anchor" to="/vi/essentials/nodes-supports#supports"}
Gối cố định, gối di động, ngàm, ngàm trượt hoặc tổ hợp bất kỳ của `Dx`, `Dz` và `Ry` bị chặn, chọn theo ký hiệu. Gối tựa xiên và lún gối tựa.
:::
:::card{title="Tải trọng" icon="lucide:arrow-down-to-line" to="/vi/essentials/loads"}
Lực và mô men tại nút hoặc tại vị trí bất kỳ trên thanh, tải phân bố đều và tải hình thang, tải nhiệt độ và chuyển vị cưỡng bức.
:::
:::card{title="Tiết diện" icon="lucide:shapes" to="/vi/essentials/elements#cross-sections"}
Thư viện tiết diện châu Âu và Mỹ, hoặc hình đa giác bất kỳ do bạn vẽ; EduBeam tính $A$, $I_y$, $I_z$, $I_{yz}$, trục quán tính chính và bán kính quán tính.
:::
:::card{title="Kết quả" icon="lucide:chart-spline" to="/vi/essentials/results"}
Biểu đồ **N**, **V** và **M**, sơ đồ biến dạng, phản lực, chuyển vị nút, nội lực đầu phần tử và ma trận độ cứng phần tử.
:::
:::card{title="Phân tích" icon="lucide:calculator" to="/vi/elements/analysis"}
Phân tích tĩnh tuyến tính, chính xác cho mô hình tuyến tính: không cần chia lưới mịn hơn. Khi kết cấu không đứng vững được, EduBeam giải thích lý do và cho thấy hệ chuyển động ra sao bằng hoạt ảnh.
:::
:::card{title="Tệp" icon="lucide:folder-open" to="/vi/essentials/import-export"}
Dự án dạng JSON, cả mô hình gói trong một liên kết, hình vẽ ra PNG hoặc SVG, kết quả ra CSV. Mô hình cũ không bị mất khi bạn thay bằng mô hình khác, và dữ liệu không rời khỏi thiết bị của bạn.
:::
:::card{title="Đơn vị" icon="lucide:ruler" to="/vi/essentials/units-settings"}
SI hoặc hệ Mỹ chỉ với một cú nhấp, hoặc chọn riêng từng đơn vị. Trục z hướng xuống, hoặc trục y hướng lên như trong giáo trình.
:::
::

## EduBeam (chưa) làm được gì {#what-it-does-not-do-yet}

Biết trước các giới hạn sẽ giúp bạn tiết kiệm thời gian:

::div{.limits}
- **Chỉ 2D.** Không xét ứng xử ngoài mặt phẳng, không có khung không gian.
- **Chỉ tĩnh tuyến tính.** Không xét hiệu ứng bậc hai (P–Δ), mất ổn định, động lực học hay biến dạng dẻo.
- **Một trường hợp tải.** Không có tổ hợp tải trọng hay biểu đồ bao: lưu mỗi trường hợp thành một tệp hoặc một liên kết riêng.
- **Không tự tính trọng lượng bản thân.** Hãy nhập trọng lượng bản thân thành tải phân bố trên thanh.
- **Không kiểm tra thiết kế.** EduBeam cho bạn nội lực và chuyển vị; kiểm tra theo tiêu chuẩn là phần việc của bạn.
::

Nếu bạn cần một tính năng còn thiếu, hãy [tạo issue](https://github.com/janvorisek/edubeam/issues).

::elementarium-promo{placement="introduction"}
::

## EduBeam dành cho ai? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="Sinh viên" icon="lucide:graduation-cap" to="/vi/practice"}
Phản hồi tức thì cho bài tính tay, và các bài luyện tập kiểm tra đáp số ngay khi bạn làm.
:::
:::card{title="Giảng viên" icon="lucide:presentation" to="/vi/guide/teaching"}
Trình chiếu trực tiếp cách gối tựa, khớp và tải trọng làm thay đổi nội lực, bằng 22 ngôn ngữ, và in cho mỗi sinh viên một mã đề khác nhau.
:::
:::card{title="Kỹ sư" icon="lucide:hard-hat" to="/vi/elements/analysis"}
Kiểm tra sơ bộ nhanh trước khi mở một phần mềm desktop đồ sộ hơn; mọi bước giải đều được trình bày trong tài liệu.
:::
:::card{title="Lập trình viên" icon="lucide:code-xml" to="#libraries"}
Bộ giải và phần vẽ hình của EduBeam, ở dạng thư viện mã nguồn mở để bạn dùng trong mã của mình.
:::
::

## Tài liệu gồm những phần nào {#how-this-guide-is-organised}

Thanh bên chia các trang thành những nhóm dưới đây. Các nút bấm **?** trong ứng dụng mở đúng trang tương ứng ở đây, bằng ngôn ngữ của bạn.

::card-grid{cols="2"}
:::card{title="Bắt đầu" icon="lucide:flag" to="/vi/guide/quick-start"}
Trang này và phần Bắt đầu nhanh: dầm đầu tiên trong mười phút.
:::
:::card{title="Dựng mô hình" icon="lucide:pencil-ruler" to="/vi/essentials/user-interface"}
Giao diện, nút và gối tựa, phần tử, vật liệu và tiết diện, tải trọng, đơn vị và cài đặt.
:::
:::card{title="Đọc kết quả" icon="lucide:chart-spline" to="/vi/essentials/results"}
Biểu đồ, bảng kết quả và cách kiểm tra chúng bằng tính tay.
:::
:::card{title="Chia sẻ và giảng dạy" icon="lucide:share-2" to="/vi/essentials/import-export"}
Tệp dự án, liên kết chia sẻ, xuất hình ảnh và CSV, cùng cách giảng dạy với EduBeam.
:::
:::card{title="Hướng dẫn" icon="lucide:triangle" to="/vi/tutorials/inclined-beam"}
Dầm xiên, khung ba khớp, dàn phẳng và dầm liên tục có gối bị lún, mỗi bài dựng từng bước và kiểm tra bằng tính tay.
:::
:::card{title="Ví dụ" icon="lucide:library" to="/vi/examples/"}
Sáu mô hình có sẵn, mở chỉ với một cú nhấp, kèm bài tập và đáp số.
:::
:::card{title="Sổ tay lý thuyết" icon="lucide:sigma" to="/vi/elements/conventions"}
Hệ trục và quy ước dấu, phần tử dầm, phần tử thanh dàn và cách EduBeam giải một mô hình.
:::
:::card{title="Trợ giúp" icon="lucide:life-buoy" to="/vi/reference/shortcuts"}
Bàn phím, chuột và cảm ứng, khắc phục sự cố và câu hỏi thường gặp.
:::
::

## Tự xây dựng công cụ riêng {#libraries}

EduBeam dựa trên hai thư viện mã nguồn mở, được mô tả ngay trên trang web này. Với chúng, bạn có thể giải kết cấu bằng một đoạn script, tạo cho mỗi sinh viên một bài tập khác nhau, hoặc vẽ hình cho slide và tài liệu bài giảng.

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/vi/solver"}
Bộ giải phần tử hữu hạn của EduBeam, viết bằng TypeScript: dựng, giải và đọc kết quả một dầm trong chừng chục dòng mã, trên trình duyệt hoặc trong Node.
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/vi/plot"}
Các component Vue 3 vẽ kết cấu đã giải dưới dạng SVG, cùng tải trọng, phản lực và biểu đồ N, V, M.
:::
::

## Ngôn ngữ {#languages}

EduBeam có 22 ngôn ngữ giao diện và tự mở bằng ngôn ngữ của trình duyệt. Bạn đổi ngôn ngữ trong **Cài đặt → Ngôn ngữ và khu vực**, hoặc chọn ngay tại đây:

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-hu"} Magyar](https://run.edubeam.app/?lang=hu){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-ro"} Română](https://run.edubeam.app/?lang=ro){target="_blank"}
- [:icon{name="circle-flags:lang-sk"} Slovenčina](https://run.edubeam.app/?lang=sk){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-el"} Ελληνικά](https://run.edubeam.app/?lang=el){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

Liên kết cũng có thể chọn sẵn ngôn ngữ cho người đọc: `run.edubeam.app/?lang=vi` mở ứng dụng bằng tiếng Việt.

## Tác giả và ghi nhận {#authors-credits}

[EduBeam]{.edubeam} do [Jan Voříšek](https://github.com/janvorisek) phát triển như một dự án độc lập. Ứng dụng tiếp nối EduBeam bản desktop gốc cho Windows và Linux, do [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) và [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) tạo ra tại Bộ môn Cơ học, [Khoa Xây dựng, Đại học Kỹ thuật Séc tại Praha (ČVUT)](https://www.fsv.cvut.cz/en), và đến nay vẫn mở được các tệp phiên làm việc của chương trình đó. Bộ giải [@edubeam/fem](/vi/solver) phát triển từ phiên bản đầu tiên của Bořek Patzák. Cả ứng dụng lẫn bộ giải đều là mã nguồn mở, theo giấy phép GPL-3.0.

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"Lập trình viên chính, thiết kế sản phẩm","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"Lập trình viên: điều khiển cảm ứng, hiệu năng vẽ hình, tải trọng và gối tựa","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"EduBeam bản gốc và bộ giải phần tử hữu hạn đầu tiên","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## Đóng góp {#contribute}

::card-grid{cols="3"}
:::card{title="Báo lỗi" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
Có gì khó hiểu, sai hoặc hỏng? Một issue trên GitHub sẽ đến tay nhóm phát triển.
:::
:::card{title="Cải thiện bản dịch" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
Mỗi ngôn ngữ của ứng dụng nằm trong một tệp riêng; rất hoan nghênh pull request của bạn.
:::
:::card{title="Giới thiệu cho người khác" icon="lucide:share-2"}
Giới thiệu EduBeam với bạn học và đồng nghiệp, hoặc đưa liên kết mô hình vào bài giảng hay vở ghi của bạn.
:::
::
