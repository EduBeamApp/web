---
description: "Đối chiếu EduBeam với công thức trong giáo trình: dầm, dàn, nhiệt độ, lún gối tựa, và chỗ dầm Timoshenko của EduBeam khác dầm Euler–Bernoulli."
source: site
---

# Kiểm tra kết quả bằng tính tay

Đừng bao giờ tin một con số mà bạn không thể tính lại, dù chỉ gần đúng. Trang này giải tay các trường hợp kinh điển trong giáo trình và so sánh với [EduBeam]{.edubeam}: kết quả khớp đến từng chữ số được hiển thị. Các bảng ghi năm chữ số có nghĩa, giống thẻ *Kết quả* của ứng dụng; nhãn trên hình được làm tròn đến bốn chữ số. Mỗi hình được giải trực tiếp trên trình duyệt của bạn; nút bấm **Mở trong EduBeam** nạp đúng mô hình đó vào ứng dụng, nơi bạn đọc được các bảng, đổi một giá trị và xem điều gì xảy ra.

::div{.chips}
- [Dầm đơn giản](#simply-supported-beam-uniform-load)
- [Dầm công xôn](#cantilever-tip-load)
- [Dầm hai đầu ngàm](#fixed–fixed-beam-uniform-load)
- [Dầm một đầu ngàm, một đầu gối di động](#propped-cantilever-uniform-load)
- [Dàn hai thanh](#two-bar-truss)
- [Nhiệt độ](#temperature-gradient-on-a-simply-supported-beam)
- [Lún gối tựa](#prescribed-displacement)
- [Biến dạng trượt](#shear-deformation)
::

Các kết cấu hoàn chỉnh được giải từ đầu đến cuối có trong các bài hướng dẫn [Khung ba khớp](/vi/tutorials/three-hinged-frame) và [Dàn phẳng](/vi/tutorials/truss). Muốn có bài mới để tự giải tay, với đáp số được kiểm tra ngay khi nhập, hãy thử trang [Luyện tập](/vi/practice).

## Tiết diện dùng trên trang này {#the-section-used-here}

Nếu không ghi khác, mọi trường hợp đều dùng dầm thép trong các ví dụ của ứng dụng: $E = 210$ GPa và $I_y = 8356$ cm⁴ (IPE 300), nên

$$
EI = 210 \times 10^9 \cdot 8{,}356 \times 10^{-5} = 17\,547{,}6\ \text{kNm}^2
$$

Tiết diện này có diện tích ($A = 1$ m²) và hệ số hiệu chỉnh cắt ($k = 10^{32}$) lớn đến mức biến dạng dọc trục và biến dạng trượt coi như bằng không, nên kết quả khớp đúng với các công thức dầm Euler–Bernoulli trong giáo trình.

::callout{type="info" title="Dầm trong EduBeam là dầm Timoshenko"}
Với một tiết diện thực, chẳng hạn lấy từ thư viện tiết diện, các thanh còn có biến dạng trượt. Khi đó độ võng lớn hơn một chút so với công thức Euler–Bernoulli, và trong kết cấu siêu tĩnh, nội lực cũng thay đổi đôi chút. Mục [Biến dạng trượt](#shear-deformation) ở cuối trang cho thấy chênh lệch bao nhiêu và cách tắt ảnh hưởng này.
::

Trong thẻ *Kết quả*, chuyển vị và góc xoay theo [hệ trục tổng thể](/vi/elements/conventions#global-axes): D<sub>z</sub> dương hướng xuống, R<sub>y</sub> dương ngược chiều kim đồng hồ, và chuyển vị tính bằng mét, trừ khi bạn đổi đơn vị trong [Cài đặt](/vi/essentials/units-settings).

## Dầm đơn giản, tải phân bố đều {#simply-supported-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, gối cố định tại A và gối di động tại B. Nút C ở giữa nhịp giúp đọc độ võng tại đó; chia một thanh tại một nút không làm thay đổi kết quả nào.

::model-figure{caption="Dầm đơn giản, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Đại lượng | Công thức | Giá trị |
| --- | --- | --- |
| Phản lực | $qL/2$ | 36 kN |
| Lực cắt tại gối | $\pm qL/2$ | +36 kN tại A, −36 kN tại B |
| Mô men giữa nhịp | $qL^2/8$ | 54 kNm |
| Góc xoay tại A | $qL^3/(24EI)$ | 0,0061547 rad, cùng chiều kim đồng hồ |
| Độ võng tại C | $5qL^4/(384EI)$ | 11,540 mm, hướng xuống |

EduBeam cho đúng các giá trị này. Trong thẻ *Kết quả*, nút A có R<sub>y</sub> = −0,0061547 rad (âm: cùng chiều kim đồng hồ) và nút C có D<sub>z</sub> = 0,01154 m (dương: hướng xuống).

## Dầm công xôn, tải tại đầu tự do {#cantilever-tip-load}

$L = 4$ m, ngàm tại A, lực $F = 18$ kN hướng xuống tại đầu tự do B.

::model-figure{caption="Dầm công xôn, 18 kN tại đầu tự do"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 18 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Đại lượng | Công thức | Giá trị |
| --- | --- | --- |
| Phản lực đứng | $F$ | 18 kN |
| Mô men ngàm | $FL$ | 72 kNm, mô men âm: M = −72 kNm |
| Góc xoay đầu tự do | $FL^2/(2EI)$ | 0,0082063 rad, cùng chiều kim đồng hồ |
| Độ võng đầu tự do | $FL^3/(3EI)$ | 21,883 mm, hướng xuống |

Trong thẻ *Kết quả*, nút B có R<sub>y</sub> = −0,0082063 rad và D<sub>z</sub> = 0,021883 m.

## Dầm hai đầu ngàm, tải phân bố đều {#fixed–fixed-beam-uniform-load}

$L = 6$ m, $q = 12$ kN/m, ngàm cả hai đầu. Dầm này siêu tĩnh, nên lời giải phụ thuộc vào độ cứng; các công thức suy ra từ điều kiện tương thích: góc xoay ở cả hai đầu bằng không.

::model-figure{caption="Dầm hai đầu ngàm, 12 kN/m"}
---
nodes: { A: [0, 0], C: [3, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, C], [C, B]]
loads:
  - { member: 1, qz: 12 }
  - { member: 2, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Đại lượng | Công thức | Giá trị |
| --- | --- | --- |
| Phản lực | $qL/2$ | 36 kN |
| Mô men tại gối | $qL^2/12$ | 36 kNm, mô men âm: M = −36 kNm |
| Mô men giữa nhịp | $qL^2/24$ | 18 kNm, mô men dương |
| Độ võng tại C | $qL^4/(384EI)$ | 2,3080 mm, hướng xuống |

Ngàm hai đầu nâng cả biểu đồ mô men lên một đoạn $qL^2/12$: tổng độ chênh từ gối đến giữa nhịp vẫn là $qL^2/8 = 54$ kNm, như ở dầm đơn giản. Trong ứng dụng, hãy bắt đầu từ mô hình dầm đơn giản và đổi cả hai gối tựa thành **Ngàm** để xem biểu đồ dịch lên.

## Dầm một đầu ngàm, một đầu gối di động, tải phân bố đều {#propped-cantilever-uniform-load}

$L = 6$ m, $q = 12$ kN/m, ngàm tại A và gối di động tại B.

::model-figure{caption="Dầm một đầu ngàm, một đầu gối di động, 12 kN/m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 12 }
results: [M, V, w]
show: [nodeLabels]
---
::

| Đại lượng | Công thức | Giá trị |
| --- | --- | --- |
| Phản lực tại đầu ngàm | $5qL/8$ | 45 kN |
| Phản lực tại gối di động | $3qL/8$ | 27 kN |
| Mô men ngàm | $qL^2/8$ | 54 kNm, mô men âm: M = −54 kNm |
| Mô men dương lớn nhất | $9qL^2/128$ | 30,375 kNm |
| … tại chỗ $V = 0$ | $x = 5L/8$ | cách A 3,75 m |
| Góc xoay tại B | $qL^3/(48EI)$ | 0,0030773 rad, ngược chiều kim đồng hồ |

EduBeam ghi nhãn mọi cực trị của biểu đồ, nên đỉnh mô men dương được ghi ngay tại vị trí của nó. Vị trí này là chỗ lực cắt bằng không: $V(x) = 45 - 12x = 0$ cho $x = 3{,}75$ m.

## Dàn hai thanh {#two-bar-truss}

Hai thanh đi lên từ các gối cố định tại A $(0;\ 0)$ và B $(4;\ 0)$ và gặp nhau tại đỉnh C $(2;\ -2)$, cao hơn gối tựa 2 m. Cả hai thanh đều có **khớp đầu thanh** ở cả hai đầu, nên các thanh chỉ chịu lực dọc. Lực đứng $F = 20$ kN tác dụng hướng xuống tại C.

::model-figure{caption="Dàn hai thanh, 20 kN tại đỉnh"}
---
nodes: { A: [0, 0], C: [2, -2], B: [4, 0] }
supports: { A: pin, B: pin }
members: [{ nodes: [A, C], hinges: [true, true] }, { nodes: [C, B], hinges: [true, true] }]
loads:
  - { node: C, fz: 20 }
results: [N]
show: [nodeLabels]
---
::

Mỗi thanh nghiêng 45°. Do đối xứng, hai thanh chịu lực như nhau; cân bằng theo phương đứng tại nút C cho:

$$
\begin{aligned}
2N \sin 45^\circ + F &= 0 \\
N = -\frac{F}{\sqrt{2}} &= -14{,}142\ \text{kN}
\end{aligned}
$$

Cả hai thanh đều chịu **nén**. Phản lực tại mỗi gối gồm 10 kN theo phương đứng và 10 kN theo phương ngang, hướng vào trong: các thanh đẩy hai gối ra xa nhau. Lớp hiển thị **N (x)** và các phản lực cho thấy đúng như vậy.

## Chênh lệch nhiệt độ trên dầm đơn giản {#temperature-gradient-on-a-simply-supported-beam}

$L = 8$ m, $h = 0{,}3$ m, $\alpha = 12 \times 10^{-6}$ 1/K. Thớ trên nóng lên 5 K và thớ dưới lạnh đi 5 K, nên $\Delta T_b - \Delta T_t = -10$ K và trục dầm giữ nguyên nhiệt độ ($\Delta T_c = 0$). Dầm đơn giản cong tự do được, nên **không có nội lực**, chỉ có độ cong:

$$
\begin{aligned}
\kappa &= \frac{\alpha\,(\Delta T_b - \Delta T_t)}{h} \\
&= \frac{12 \times 10^{-6} \cdot (-10)}{0{,}3} = -4 \times 10^{-4}\ \text{m}^{-1}
\end{aligned}
$$

Thớ trên dãn dài, thớ dưới co ngắn, nên dầm cong vồng **lên trên**:

::model-figure{caption="Thớ trên nóng hơn thớ dưới 10 K: dầm vồng lên 3,2 mm, không có nội lực"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: pin, B: roller }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [w]
show: [nodeLabels]
section: { h: 0.3 }
---
::

| Đại lượng | Công thức | Giá trị |
| --- | --- | --- |
| Độ võng tại C | $\kappa L^2/8$ | 3,2 mm, hướng lên: D<sub>z</sub> = −0,0032 m |
| Góc xoay tại A | $\kappa L/2$ | 0,0016 rad, ngược chiều kim đồng hồ |
| Mô men uốn |  | 0 |

Thay đổi nhiệt độ đều $\Delta T_c$ chỉ làm dầm dãn dài, mà gối di động để dầm dãn tự do, nên cũng không gây ra nội lực nào.

Bây giờ hãy chặn góc xoay ở cả hai đầu (**Ngàm** tại A và **Ngàm trượt** tại B, vẫn cho phép dầm dãn dài). Dầm không cong được nữa; thay vào đó, trên toàn nhịp xuất hiện một mô men không đổi:

$$
\begin{aligned}
M &= -EI\kappa \\
&= -17\,547{,}6 \cdot (-4 \times 10^{-4}) = 7{,}019\ \text{kNm}
\end{aligned}
$$

Đây là mô men dương (căng thớ dưới): thớ trên muốn dãn dài nhưng bị ngăn lại, nên cuối cùng chịu nén.

::model-figure{caption="Cùng dầm đó, chặn góc xoay ở cả hai đầu: mô men không đổi 7,019 kNm"}
---
nodes: { A: [0, 0], C: [4, 0], B: [8, 0] }
supports: { A: fixed, B: slider }
members: [[A, C], [C, B]]
loads:
  - { member: 1, temperature: { top: 5, bottom: -5 } }
  - { member: 2, temperature: { top: 5, bottom: -5 } }
results: [M]
show: [nodeLabels]
section: { h: 0.3 }
---
::

Cách nhập tải nhiệt độ được mô tả trong [Tải trọng](/vi/essentials/loads#temperature-load); chiều cao tiết diện $h$ là một thông số của [tiết diện](/vi/essentials/elements#cross-sections).

## Lún gối tựa {#prescribed-displacement}

Lấy [dầm một đầu ngàm, một đầu gối di động](#propped-cantilever-uniform-load) ở trên, bỏ tải trọng và cho gối di động tại B lún xuống $w = 10$ mm. Trong EduBeam, đó là **chuyển vị cưỡng bức** D<sub>z</sub> = 0,01 m tại B. Để đi theo độ lún này, gối di động phải kéo đầu dầm công xôn xuống, nên dầm bị uốn:

::model-figure{caption="Dầm một đầu ngàm, gối B lún 10 mm: gối di động kéo xuống với lực 2,437 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [M, V, w]
show: [nodeLabels]
---
::

| Đại lượng | Công thức | Giá trị |
| --- | --- | --- |
| Lực tại gối di động | $R = 3EIw/L^3$ | 2,4372 kN, kéo xuống |
| Mô men ngàm | $RL$ | 14,623 kNm, mô men âm: M = −14,623 kNm |
| Góc xoay tại B | $3w/(2L)$ | 0,0025 rad, cùng chiều kim đồng hồ |

Khác với tải trọng, lún gối tựa chỉ gây ra nội lực khi kết cấu cản trở chuyển vị đó: ở đây dầm càng cứng thì $R$ càng lớn. Dầm đơn giản thì chỉ dịch chuyển như một vật rắn theo độ lún đó, hoàn toàn không phát sinh nội lực.

Thêm lại tải 12 kN/m, kết quả được cộng tác dụng: đầu ngàm giờ chịu $45 + 2{,}4372 = 47{,}437$ kN và $54 + 14{,}623 = 68{,}623$ kNm, còn gối di động chịu $27 - 2{,}4372 = 24{,}563$ kN. Cách nhập lún gối tựa được mô tả trong [Tải trọng](/vi/essentials/loads#prescribed-displacements-support-settlements).

## Biến dạng trượt {#shear-deformation}

Phần tử dầm của EduBeam là dầm **Timoshenko**: ngoài độ võng do uốn, dầm còn võng do trượt, với độ lớn phụ thuộc độ cứng chống cắt $kGA$ của tiết diện. Điều này thay đổi những gì thì tùy kết cấu:

- **Hệ tĩnh định**: phản lực và nội lực chỉ suy ra từ điều kiện cân bằng, nên giữ nguyên hoàn toàn. Chỉ chuyển vị tăng lên. Ở dầm đơn giản và dầm công xôn, góc xoay của các tiết diện cũng giữ nguyên; ở những chỗ khác, chẳng hạn tại mút đầu thừa, chúng cũng thay đổi một chút.
- **Hệ siêu tĩnh**: nội lực phụ thuộc vào độ cứng, nên cũng thay đổi đôi chút.

### Dầm đơn giản {#shear-simply-supported}

Dầm ở trang [Bắt đầu nhanh](/vi/guide/quick-start#_8-check-by-hand) cho thấy mức chênh lệch. Đó chính là dầm đơn giản ở trên nhưng với tiết diện thực, **IPE 200 (gần đúng)** lấy từ thư viện tiết diện: $I_y = 1943$ cm⁴, $A = 28{,}48$ cm² và hệ số hiệu chỉnh cắt $k = 0{,}3933$ (tỷ lệ diện tích bản bụng), với $G = 81$ GPa. Vậy $EI = 4080{,}3$ kNm² và $kGA = 90\,720$ kN.

| Đại lượng | Công thức | Giá trị |
| --- | --- | --- |
| Góc xoay tại gối | $qL^3/(24EI)$ | 0,026469 rad |
| Độ võng giữa nhịp, do uốn | $5qL^4/(384EI)$ | 49,629 mm |
| Độ võng giữa nhịp, do cắt | $qL^2/(8kGA)$ | 0,59524 mm |
| Độ võng giữa nhịp, tổng | tổng | 50,224 mm, đúng như EduBeam hiển thị |

Phần do cắt chiếm 1,2 % tổng độ võng. Góc xoay tại gối là giá trị Euler–Bernoulli, phản lực và mô men cũng vậy.

### Dầm công xôn: thanh ngắn {#shear-cantilever}

Với dầm công xôn chịu lực $F$ ở đầu tự do, đầu tự do võng $FL^3/(3EI)$ do uốn và $FL/(kGA)$ do cắt. Tỷ số giữa chúng là

$$
\frac{\text{cắt}}{\text{uốn}} = \frac{3EI}{kGA\,L^2}
$$

Với cùng tiết diện IPE 200, tỷ số này là 0,84 % cho dầm công xôn dài 4 m, nhưng lên đến 13,5 % cho dầm dài 1 m: biến dạng trượt đáng kể ở các thanh ngắn và cao.

### Dầm ngàm – gối di động: nội lực phân bố lại {#shear-propped-cantilever}

[Dầm một đầu ngàm, một đầu gối di động](#propped-cantilever-uniform-load) làm bằng IPE 200 là hệ siêu tĩnh, và gối di động giờ chịu thêm một chút. Với $\beta = 3EI/(kGA\,L^2) = 0{,}0037481$ cho $L = 6$ m, điều kiện tương thích tại gối di động cho

$$
R_B = \frac{3qL}{8} \cdot \frac{1 + 4\beta/3}{1 + \beta} = 27{,}034\ \text{kN}
$$

thay vì 27 kN, và mô men ngàm giảm từ 54 xuống $qL^2/2 - R_B L = 53{,}798$ kNm. Ở đây chênh lệch nhỏ, nhưng nó tăng theo $\beta$, tức là với các thanh ngắn và cao.

### So sánh với dầm Euler–Bernoulli {#shear-switch-off}

Để so sánh với công thức Euler–Bernoulli, hãy đặt **Hệ số hiệu chỉnh cắt** của tiết diện thành một giá trị rất lớn, chẳng hạn `1e10`. Phần do cắt khi đó biến mất và mọi trường hợp trên trang này lại khớp với công thức giáo trình. Cách xây dựng phần tử được trình bày ở trang [Phần tử dầm](/vi/elements/beam) của sổ tay lý thuyết.

## Mẹo khi tự kiểm tra {#tips-for-your-own-checks}

- Luôn để mắt đến **ô đơn vị** ở góc dưới bên phải vùng hiển thị; phần lớn sai lệch là do nhầm đơn vị.
- Đọc số chính xác từ thẻ **Kết quả** và chú thích khi di chuột, thay vì từ nhãn trên biểu đồ. **Xuất CSV** hoặc **Sao chép** cho bạn cả phản lực, sẵn sàng dán vào bảng tính. Xem [Kết quả và biểu đồ](/vi/essentials/results#results-tab).
- Đặt **Định dạng số** thành *Tự động* trong Cài đặt để đọc `40` thay vì `4 · 10¹`.
- Dùng cửa sổ **Ma trận độ cứng** để so sánh một phần tử với trang [Phần tử dầm](/vi/elements/beam) của sổ tay lý thuyết khi học phương pháp độ cứng trực tiếp.
- Dùng **Chia sẻ mô hình** để gửi một mô hình đã kiểm tra cho đồng nghiệp hoặc giảng viên.
- Để kiểm tra nhiều trường hợp cùng lúc, hoặc tạo bài tập có sẵn đáp số, hãy gọi chính bộ giải này từ mã của bạn: [@edubeam/fem](/vi/solver) là thư viện đứng sau mọi con số trong ứng dụng.
