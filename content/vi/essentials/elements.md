---
description: "Vẽ phần tử dầm trong EduBeam, giải phóng đầu thanh bằng khớp để mô hình hóa khớp và thanh dàn, khai báo vật liệu và tiết diện từ thư viện hoặc đa giác của bạn."
source: site
---

# Phần tử, vật liệu và tiết diện

Mọi phần tử trong [EduBeam]{.edubeam} đều là một dầm nối hai nút, có vật liệu và tiết diện. Bạn vẽ phần tử giữa các nút, giải phóng đầu thanh bằng khớp ở những chỗ kết cấu có khớp, rồi chọn vật liệu và tiết diện từ thư viện hoặc tự khai báo.

## Phần tử dầm {#the-beam-element}

Chỉ có một loại phần tử: **dầm Timoshenko 2D** trong mặt phẳng x–z, với ba bậc tự do ở mỗi đầu (`Dx`, `Dz`, `Ry`). Phần tử chịu lực dọc, lực cắt và mô men uốn, và có kể đến [biến dạng trượt](#shear-deformation). Thanh dàn cũng chính là phần tử này với [khớp ở cả hai đầu](#end-hinges). Cách thiết lập phần tử được trình bày trong [sổ tay lý thuyết](/vi/elements/beam).

Với mô hình tuyến tính, kết quả dọc theo phần tử là chính xác, nên **mỗi thanh chỉ cần một phần tử**. Chỉ thêm nút bên trong thanh ở chỗ bạn cần gối tựa, khớp, thay đổi tiết diện, hoặc một điểm để đọc chuyển vị. Lực tập trung thì không cần nút: [tải tập trung](/vi/essentials/loads#concentrated-load) có thể đặt ở bất kỳ vị trí nào dọc phần tử.

## Thêm phần tử {#adding-elements}

Phần tử cần vật liệu và tiết diện, nên hãy thêm chúng trước (xem [Vật liệu](#materials) và [Tiết diện](#cross-sections)). Khi chưa có, vùng hiển thị báo *Chưa có vật liệu nào.* hoặc *Chưa có tiết diện nào.*, kèm nút **Thêm mới**.

- **Bằng cách chọn nút.** Thẻ *Phần tử* → **Thêm phần tử** (nút bấm có biểu tượng **+**), hoặc nhấp chuột phải vào khung vẽ → *Thêm phần tử*. Chọn **Nút đầu** và **Nút cuối**, nếu cần thì đánh dấu **Khớp** dưới nút tương ứng, rồi chọn **Vật liệu** và **Tiết diện**. Cách này cần có ít nhất hai nút.
- **Bằng cách nhấp chuột.** Thẻ *Phần tử* → **Thêm phần tử** (nút bấm có biểu tượng con trỏ), hoặc giữ <kbd>Ctrl</kbd> khi chọn *Thêm phần tử* trong menu khung vẽ. Nhấp vào một nút (hoặc vào vùng trống, khi đó một nút mới được tạo), rồi vào nút tiếp theo; cứ nhấp tiếp để vẽ một chuỗi phần tử, và nhấn <kbd>Esc</kbd> hoặc **Hủy** để kết thúc. Thanh thông báo phía trên đặt **Khớp đầu** và **Khớp cuối** cho mọi phần tử bạn vẽ. Các phần tử nhận vật liệu và tiết diện đầu tiên của mô hình.

![Hộp thoại Thêm phần tử](/screenshots/vi/qs-element.webp){.shot-md}

## Chiều phần tử {#element-direction}

Mỗi phần tử có **hệ trục địa phương** riêng. Trục x địa phương hướng từ **nút đầu** đến **nút cuối**; trục z địa phương là trục x địa phương xoay 90° theo chiều kim đồng hồ trên màn hình. Với phần tử vẽ từ trái sang phải, hệ trục địa phương trùng với hệ trục tổng thể. **Nét đứt** vẽ dọc mỗi phần tử đánh dấu phía +z địa phương của nó, tức “thớ dưới”.

![Khung cổng vẽ theo thứ tự A → B → C → D: nét đứt của cả ba phần tử đều nằm phía trong khung](/screenshots/vi/p2b-element-direction.webp){.shot-md}

Trong khung này, phần tử 1 đi lên từ A đến B, nên trục z địa phương của nó, cùng với nét đứt, hướng sang phải; phần tử 3 đi xuống từ C đến D, nên nét đứt nằm bên trái. Vẽ theo cách này, nét đứt của khung cổng đều nằm phía trong.

Chiều phần tử quan trọng với:

- tải trọng cho theo hệ trục địa phương (khi đánh dấu **LCS**), xem [Tải trọng phần tử](/vi/essentials/loads#element-loads);
- **Vị trí tải tính từ nút đầu** của tải tập trung;
- thứ tự [nội lực đầu phần tử](/vi/elements/conventions#end-forces-element-results-table) trong kết quả: `X12, Z12, M12` tại nút đầu, `X21, Z21, M21` tại nút cuối;
- phía nào là “phía nét đứt” trong [cài đặt biểu đồ](/vi/essentials/units-settings#viewer-settings).

Để đảo chiều một phần tử, nhấn **Đổi thứ tự nút** (hai mũi tên giữa hai nút trong bảng *Phần tử*).

## Khớp đầu thanh {#end-hinges}

Khớp đầu thanh giải phóng mô men uốn tại một đầu của phần tử: mô men tại đó bằng 0, và đầu thanh xoay độc lập với nút.

- **Một khớp** tạo ra khớp bên trong dầm hoặc khung.
- **Hai khớp** biến phần tử thành **thanh dàn**, chỉ chịu lực dọc.

Đánh dấu khớp ở bất kỳ chỗ nào sau đây:

- cột **Khớp đầu thanh** của bảng *Phần tử*, mỗi đầu một ô đánh dấu;
- các ô **Khớp** trong hộp thoại **Thêm phần tử**, hoặc trong bảng thao tác của phần tử → **Sửa phần tử**;
- **Khớp đầu** và **Khớp cuối** trên thanh thông báo khi vẽ bằng chuột.

![Bảng Phần tử của khung ba khớp: phần tử 2 có khớp ở đầu cuối, tại nút C](/screenshots/vi/elements-table.webp)

### Một khớp: khớp bên trong kết cấu {#one-hinge-a-pin-inside-the-structure}

Cùng một dầm liên tục hai nhịp, mỗi nhịp 5 m, chịu 10 kN/m. Ở hình bên phải, phần tử 1 có khớp đầu thanh tại B: mô men trên gối giảm về 0, và mỗi nhịp chịu tải như một dầm đơn giản.

::div{.shots}

:::model-figure{caption="Dầm liên tục: M = −31,25 kNm trên gối B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Có khớp tại B: M = 0 trên gối B, 31,25 kNm ở mỗi nhịp"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [{ nodes: [A, B], hinges: [false, true] }, [B, C]]
loads:
  - { member: 1, qz: 10 }
  - { member: 2, qz: 10 }
results: [M]
show: [nodeLabels]
---
:::

::

Tính tay: với dầm liên tục, $M_B = -qL^2/8 = -31{,}25\ \text{kNm}$, mô men nhịp lớn nhất $9qL^2/128 = 17{,}58\ \text{kNm}$ trong mỗi nhịp; khi có khớp, $M_B = 0$ và $M_{max} = qL^2/8 = 31{,}25\ \text{kNm}$ ở giữa mỗi nhịp. Khớp triệt tiêu mô men trên gối nhưng làm mô men nhịp tăng gần gấp đôi. Muốn tự tính tay một dầm có khớp trung gian và được kiểm tra đáp số ngay khi gõ, hãy thử [bài luyện tập G2048](/vi/practice?p=G2048).

### Hai khớp: thanh dàn {#both-hinges-a-truss-bar}

Một giá đỡ gắn tường gồm hai thanh, cả hai đều có khớp ở hai đầu, chịu 20 kN tại B. Các thanh chỉ chịu lực dọc, nên biểu đồ mô men bằng 0 trên toàn bộ kết cấu.

::model-figure{caption="Thanh kéo AB: N = +26,67 kN (kéo); thanh chống CB: N = −33,33 kN (nén)"}
---
nodes: { A: [0, 0], B: [4, 0], C: [0, 3] }
supports: { A: pin, C: pin }
members: [{ nodes: [A, B], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: B, fz: 20 }
results: [N, M]
show: [nodeLabels]
---
::

Tính tay: thanh chống dài 5 m, đi lên 3 m theo phương đứng, nên $N_{CB} = -20 \cdot 5/3 = -33{,}33\ \text{kN}$, còn thanh kéo cân bằng thành phần ngang của nó, $N_{AB} = 33{,}33 \cdot 4/5 = 26{,}67\ \text{kN}$. Bài [Hướng dẫn: dàn phẳng](/vi/tutorials/truss) dựng cả một dàn theo cách này, và trang [Luyện tập](/vi/practice?p=T2048) có các dàn để bạn tự tính tay.

### Đặt khớp cho phần tử, không phải cho nút {#hinge-the-element-not-the-node}

Khớp thuộc về một đầu của một phần tử: nó cho đầu đó xoay độc lập, trong khi mọi phần tử khác tại nút vẫn liên kết cứng với nút. Vì vậy, ở nút có hai thanh gặp nhau, chỉ cần đặt một khớp là có liên kết khớp; ở nút có nhiều thanh, hãy đặt khớp cho tất cả các thanh trừ một thanh. Ở nút dàn, nơi mọi thanh đều là thanh dàn, tất cả đều có khớp.

Một nút mà mọi phần tử nối vào đều có khớp sẽ không có độ cứng chống xoay. EduBeam vẫn chấp nhận và báo góc xoay của nút đó bằng 0. Nếu các khớp biến kết cấu thành hệ biến hình, EduBeam khoanh tròn chúng và cho thấy kết cấu chuyển động thế nào; xem [Khắc phục sự cố](/vi/reference/troubleshooting#messages).

## Sửa và xóa {#editing-and-deleting}

| Muốn | Thao tác |
| --- | --- |
| Đổi nút, khớp, vật liệu hoặc tiết diện | Nhấp vào phần tử → **Sửa phần tử**, hoặc sửa trong bảng *Phần tử*. |
| Đảo chiều | **Đổi thứ tự nút** trong bảng *Phần tử*. |
| Đổi tên | Nhập nhãn mới trong cột *Phần tử*. |
| Xem ma trận độ cứng | Nhấp vào phần tử → **Ma trận độ cứng**, hoặc nút ma trận trong cột *Thao tác*. Một cửa sổ hiện ma trận 6 × 6 của phần tử trong hệ trục tổng thể, theo đơn vị SI (N và m) bất kể bạn đang hiển thị đơn vị nào, với các khớp đầu thanh đã được khử (ngưng tụ tĩnh). Rất tiện để kiểm tra khi bạn ghép ma trận bằng tay. |
| Xóa | Nhấp vào phần tử → **Xóa**, dấu × trong bảng, hoặc chọn phần tử rồi nhấn <kbd>Delete</kbd>. Tải trọng của phần tử bị xóa theo. |

![Bảng thao tác của một phần tử](/screenshots/vi/ui-element-menu.webp){.shot-xs}

## Vật liệu {#materials}

Thẻ *Vật liệu* → **Thêm vật liệu**, hoặc **Thư viện vật liệu** để lấy vật liệu có sẵn. Nhiều phần tử có thể dùng chung một vật liệu; sửa vật liệu thì mọi phần tử dùng nó đều được cập nhật.

| Thông số | Đơn vị | Tác dụng |
| --- | --- | --- |
| Mô đun đàn hồi $E$ | MPa | Độ cứng dọc trục và độ cứng chống uốn, $EA$ và $EI_y$. Thép 210 000 MPa, bê tông khoảng 30 000 MPa, gỗ khoảng 11 000 MPa. |
| Mô đun trượt $G$ | MPa | Độ cứng chống cắt $kGA$. Nếu $k$ của tiết diện không quá lớn, $G$ đưa thêm [biến dạng trượt](#shear-deformation) vào tính toán: độ võng lớn hơn và, trong hệ siêu tĩnh, nội lực cũng khác đi. $G = E/(2(1+\nu))$: thép khoảng 81 000 MPa. |
| Khối lượng riêng $\rho$ | kg/m³ | Được lưu cùng vật liệu nhưng không dùng đến: không có tải trọng bản thân. |
| Hệ số dãn dài do nhiệt $\alpha$ | 1/K | Dùng cho [tải nhiệt độ](/vi/essentials/loads#temperature-load). Thép $12 \times 10^{-6}$ 1/K. |

Các đơn vị trên là mặc định SI; chúng theo [cài đặt](/vi/essentials/units-settings#units) của bạn, nên với hệ đơn vị Mỹ, E và G tính bằng ksi, khối lượng riêng bằng lb/ft³ và α bằng 1/°F.

Vật liệu mới nhận giá trị mặc định $E$ = 210 000 MPa, $G$ = 87 500 MPa ($E/2{,}4$, tức $\nu = 0{,}2$), $\rho$ = 1000 kg/m³ và $\alpha = 12 \times 10^{-6}$ 1/K; với hệ đơn vị Mỹ, giá trị mặc định là của thép ASTM A992. Với thép, hãy đổi $G$ thành 81 000 MPa hoặc chọn một loại thép trong thư viện.

![Hộp thoại Thêm vật liệu](/screenshots/vi/qs-material.webp){.shot-md}

**Thư viện vật liệu** (cũng mở bằng *Hoặc chọn từ thư viện* trong hộp thoại Thêm vật liệu) liệt kê vật liệu hệ mét (EN) trước, hoặc vật liệu Mỹ (thép ASTM, bê tông ACI) trước khi chiều dài của bạn tính bằng feet hay inch. Dấu **+** ở mỗi hàng thêm vật liệu đó, mang đúng tên của nó:

| Nhóm | Vật liệu |
| --- | --- |
| Kim loại | Thép S235, S275, S355; thép không gỉ 304, 316; gang; nhôm 6061-T6, 7075-T6, 5083; đồng, đồng thau, đồng thiếc; titan Grade 2 và Ti-6Al-4V; thép Mỹ ASTM A992, A36, A572 Gr. 50 và HSS A500 Gr. C |
| Bê tông | C25/30, C30/37, C40/50, bê tông nhẹ; bê tông Mỹ $f'_c$ = 4 ksi và 5 ksi |
| Gỗ | C24, GL24h, GL32h |
| Khác | Kính, GFRP, CFRP, HDPE, PVC, PMMA, polycarbonate |

Không thể xóa vật liệu còn được phần tử sử dụng: hãy gán vật liệu khác cho các phần tử đó trước.

## Tiết diện {#cross-sections}

Thẻ *Tiết diện* → **Thêm tiết diện**, **Thư viện tiết diện**, hoặc **Tiết diện đa giác** để tự vẽ hình dạng. Cũng như vật liệu, nhiều phần tử có thể dùng chung một tiết diện.

| Thông số | Đơn vị | Tác dụng |
| --- | --- | --- |
| Diện tích $A$ | m² | Độ cứng dọc trục $EA$ và diện tích chịu cắt $kA$. |
| Mô men quán tính $I_y$ | m⁴ | Độ cứng chống uốn $EI_y$, đối với trục vuông góc với mặt phẳng hình vẽ. |
| Chiều cao $h$ | m | Chỉ dùng cho tải nhiệt độ: độ cong bằng $\alpha\,(\Delta T_b - \Delta T_t)/h$. |
| Hệ số hiệu chỉnh cắt $k$ | – | Diện tích chịu cắt hiệu dụng là $kA$, nên độ cứng chống cắt là $kGA$. Khoảng 0,83 cho tiết diện chữ nhật, $A_{web}/A$ cho tiết diện chữ I. |

Tiết diện mới nhận giá trị mặc định $A$ = 1 m², $I_y = 10^{-4}$ m⁴, $h$ = 1 m và $k$ = 1 (với hệ đơn vị Mỹ: tiết diện W12×26, $k$ = 1). Hãy thay bằng giá trị của tiết diện bạn dùng, hoặc chọn một tiết diện trong thư viện.

::callout{type="tip" title="Muốn khớp với giáo trình bỏ qua biến dạng trượt"}
Phần lớn lời giải tính tay dùng mô hình dầm Euler–Bernoulli, bỏ qua biến dạng trượt. Muốn có kết quả giống vậy, hãy cho $k$ một giá trị rất lớn, chẳng hạn `1e10`; các ví dụ trong ứng dụng và hình minh họa trên trang web này dùng `1e32`. Tiết diện mới ($k = 1$), thư viện và trình vẽ đa giác đều có kể đến biến dạng trượt; [phần dưới](#shear-deformation) cho thấy nó làm kết quả thay đổi bao nhiêu.
::

**Thư viện tiết diện** cho các giá trị gần đúng của:

| Nhóm | Tiết diện | $k$ |
| --- | --- | --- |
| Đặc | Chữ nhật, vuông, tròn | 0,833 (chữ nhật), 0,9 (tròn) |
| Chữ I | IPE 100, IPE 200, HEA 100, HEA 200; thép hình AISC W8×31 đến W36×150 | $h\,t_w/A$, bản bụng |
| Ống chữ nhật | RHS 100×50×3, 150×100×5; AISC HSS | $2ht/A$, cả hai bản bụng |
| Ống tròn | CHS Ø60×3, Ø114×5; AISC HSS tròn | 0,5 |

Hãy đối chiếu giá trị trong thư viện với bảng tra tiết diện trước khi dùng cho tính toán.

![Thư viện tiết diện](/screenshots/vi/sections-library.webp){.shot-lg}

Để kiểm tra nhanh bằng tính tay: tiết diện chữ nhật $b \times h$ có $A = bh$ và $I_y = bh^3/12$; tiết diện tròn đặc đường kính $d$ có $A = \pi d^2/4$ và $I_y = \pi d^4/64$.

### Biến dạng trượt: khi nào G và k ảnh hưởng đến kết quả {#shear-deformation}

Độ cứng chống cắt $kGA$ đi vào phần tử qua [tham số trượt](/vi/elements/beam#timoshenko-or-euler-bernoulli) $\Phi = 12EI_y/(kGAL^2)$. Với $k$ rất lớn, $\Phi = 0$ và phần tử là dầm Euler–Bernoulli, nên $G$ không có ảnh hưởng gì. Với $k$ thực tế, biến dạng trượt luôn làm tăng độ võng. Trong hệ tĩnh định, nội lực giữ nguyên; trong hệ siêu tĩnh, nội lực cũng thay đổi, vì các ẩn số thừa phụ thuộc vào độ cứng.

Thay đổi nhiều hay ít tùy vào độ mảnh của thanh. Ví dụ: dầm tiết diện IPE 200 lấy từ thư viện ($k = h\,t_w/A = 0{,}393$), thép S235 ($G$ = 81 000 MPa), chịu 10 kN/m, so với chính dầm đó khi $k$ = `1e32`:

| Dầm | Có biến dạng trượt | Euler–Bernoulli |
| --- | --- | --- |
| Dầm đơn giản, $L$ = 2 m ($L/h$ = 10): độ võng giữa nhịp | 0,566 mm | 0,511 mm |
| Dầm ngàm – gối di động, $L$ = 2 m: mô men tại ngàm | −4,84 kNm | −5,00 kNm |
| Dầm đơn giản, $L$ = 6 m ($L/h$ = 30): độ võng giữa nhịp | 41,85 mm | 41,36 mm |

Tính tay: phần độ võng giữa nhịp do biến dạng trượt là $qL^2/(8kGA)$, bằng 0,055 mm với dầm ngắn, tức thêm 11 % so với phần do uốn $5qL^4/(384EI_y)$. Ở dầm ngàm – gối di động, mô men đầu ngàm giảm từ $qL^2/8$ xuống $(qL^2/8)/(1 + \Phi/4)$. Khi $L/h$ = 30, cả hai ảnh hưởng chỉ khoảng 1 % hoặc nhỏ hơn; vì thế với khung mảnh, kết quả khớp với đáp số trong giáo trình dù $k$ bằng bao nhiêu.

### Tiết diện đa giác {#polygonal-sections}

Thẻ *Tiết diện* → **Tiết diện đa giác**, hoặc *Hoặc vẽ hình đa giác* trong hộp thoại Thêm tiết diện, mở trình vẽ hình dạng, tự tính các đặc trưng tiết diện cho bạn.

![Trình vẽ tiết diện đa giác với mẫu chữ I, các trục quán tính chính và elip quán tính](/screenshots/vi/sections-polygon.webp)

::div{.steps}

### Bắt đầu từ mẫu có sẵn {#start-from-a-preset}

Chọn một **Mẫu có sẵn** (chữ nhật, chữ I, chữ T, chữ L, chữ U, hộp chữ nhật, tròn, ống tròn), đặt kích thước của nó và nhấn **Áp dụng**.

### Chỉnh hình dạng {#adjust-the-shape}

Kéo các đỉnh (chúng bắt dính theo **Bước bắt dính**), nhấp vào trung điểm một cạnh để chèn đỉnh, hoặc nhấp đúp vào một đỉnh để xóa nó. Bạn cũng có thể nhập tọa độ trong bảng **Đỉnh**. **Thêm lỗ rỗng** thêm một đường bao bên trong, còn **Đặt tâm tại trọng tâm** dời hình sao cho trọng tâm nằm ở gốc tọa độ.

### Đọc các đặc trưng {#read-the-properties}

Thẻ **Đặc trưng tiết diện** cho biết $A$, trọng tâm, các mô men quán tính $I_y$, $I_z$, $I_{yz}$ đối với trọng tâm, các mô men quán tính chính $I_1$, $I_2$ cùng **Góc trục chính** $\alpha$ (từ $y$ đến trục 1), và các bán kính quán tính. Hình vẽ thể hiện các trục quán tính chính và elip quán tính.

### Thêm tiết diện {#add-it}

Kiểm tra **Nhãn** và **Hệ số hiệu chỉnh cắt** $k$: giá trị ban đầu 0,833 đúng cho tiết diện chữ nhật; tiết diện chữ I cần khoảng $A_{web}/A$. Sau đó nhấn **Thêm tiết diện** (**Lưu** khi bạn sửa một hình có sẵn). $A$, $I_y$ và $h$ được tính từ hình dạng và không sửa được trong bảng; muốn đổi, hãy sửa lại hình bằng nút bấm hình đa giác trong cột *Thao tác*.

::

Tọa độ tiết diện là hệ địa phương, thuận tay phải: $x$ hướng ra khỏi màn hình, $y$ sang trái, $z$ xuống dưới.

Nếu hình không đối xứng qua mặt phẳng khung (chẳng hạn thép góc L), trình vẽ sẽ cảnh báo bạn: phân tích 2D chỉ chính xác khi thanh được giữ chống chuyển vị ngang (ra ngoài mặt phẳng khung) và chống xoắn trên toàn bộ chiều dài, chẳng hạn nhờ bản sàn. Khi $I_{yz}$ đáng kể, bạn chọn độ cứng chống uốn: **được giữ ngang và chống xoắn dọc theo chiều dài** ($I_y$), hoặc **tự do chuyển vị ngang**, có giá trị nhỏ hơn. Trong cả hai trường hợp, xoắn đều không được tính đến.
