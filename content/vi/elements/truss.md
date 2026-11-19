---
description: "Thanh dàn trong EduBeam: phần tử dầm có khớp ở hai đầu, vì sao nó đúng là phần tử dàn cổ điển, ma trận độ cứng và ma trận biến đổi của nó."
source: site
---

# Phần tử thanh dàn

Thanh dàn chỉ chịu lực dọc. EduBeam không có phần tử dàn riêng: thanh dàn là một [phần tử dầm](/vi/elements/beam) được đánh dấu **cả hai khớp đầu thanh**. Trang này giải thích vì sao đó đúng là phần tử dàn hai nút cổ điển, đưa ra ma trận độ cứng và ma trận biến đổi của nó, và cho thấy thanh có khớp làm được những gì mà thanh dàn trong giáo trình không làm được.

::model-figure{caption="Mọi thanh đều có khớp ở hai đầu: hai thanh kèo chịu N = −7,071 kN, thanh căng +5 kN, và không thanh nào bị uốn"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
results: [N]
show: [nodeLabels]
---
::

Để mô hình hóa dàn trong ứng dụng, đánh dấu **Khớp đầu** và **Khớp cuối** cho mọi thanh, hoặc đánh dấu cả hai trên thanh thông báo trước khi vẽ các thanh bằng chuột ([khớp đầu thanh](/vi/essentials/elements#end-hinges)). Bài [Hướng dẫn: dàn phẳng](/vi/tutorials/truss) dựng một dàn như vậy từng bước.

## Bậc tự do {#degrees-of-freedom}

Thanh dàn làm việc với hai chuyển vị thẳng ở mỗi đầu, trong [hệ trục địa phương](/vi/elements/conventions#element-local-axes) của nó:

::element-sketch{mode="dofs" :hinges='[true,true]' :rotations='false' caption="Thanh dàn: có khớp ở hai đầu, mỗi đầu hai chuyển vị thẳng"}
::

| Phương | Nút đầu (1) | Nút cuối (2) |
| --- | --- | --- |
| theo trục x địa phương | $u_1$ và `X12` | $u_2$ và `X21` |
| theo trục z địa phương | $w_1$ và `Z12` | $w_2$ và `Z21` |

$$
\mathbf{d}_l = \begin{bmatrix} u_1 & w_1 & u_2 & w_2 \end{bmatrix}^\mathsf{T}.
$$

Các nút vẫn giữ góc xoay `Ry`, vì mọi thanh đều là phần tử dầm, nhưng thanh có khớp ở hai đầu không nhận cũng không truyền góc xoay đó: mô men đầu thanh `M12` và `M21` luôn bằng không. Tại nút mà mọi thanh đều nối khớp, không có gì giữ góc xoay ấy. Bộ giải cho nó bằng không, nhưng mô men nút đặt tại nút đó không có thanh nào tiếp nhận, và lời giải dừng lại với thông báo *Kết cấu là hệ biến hình: ma trận độ cứng suy biến.*

## Ma trận độ cứng địa phương {#local-stiffness-matrix}

$$
\mathbf{K}_l = \frac{EA}{L}
\begin{bmatrix}
 1 & 0 & -1 & 0 \\
 0 & 0 & 0 & 0 \\
 -1 & 0 & 1 & 0 \\
 0 & 0 & 0 & 0
\end{bmatrix},
$$

trong đó $E$ là mô đun đàn hồi, $A$ là diện tích tiết diện và $L$ là chiều dài. Năng lượng biến dạng chỉ sinh ra khi thanh dãn hoặc co, nên lực dọc trong thanh không có tải trọng phần tử là hằng số:

$$
N = \frac{EA}{L}\,(u_2 - u_1).
$$

### Vì sao dầm có hai khớp là thanh dàn {#why-a-beam-with-two-hinges-is-a-truss-bar}

Khử cả hai góc xoay đầu thanh khỏi [ma trận độ cứng của dầm](/vi/elements/beam#local-stiffness-matrix), bằng phép ngưng tụ tĩnh như với mọi [khớp đầu thanh](/vi/elements/beam#end-hinges). Các số hạng dọc trục không chứa góc xoay nên giữ nguyên. Các số hạng uốn biến mất hoàn toàn: khi cả hai góc xoay đều tự do, mọi cặp chuyển vị đầu $w_1$, $w_2$ chỉ làm thanh xoay như một vật rắn quanh các khớp và không sinh ra năng lượng biến dạng. Bộ giải thực hiện phép ngưng tụ này bằng số, với mọi hệ số hiệu chỉnh cắt, và thu được đúng ma trận trên, chỉ sai khác ở sai số làm tròn của phép tính dấu phẩy động.

::callout{type="details" title="Tính chi tiết phép ngưng tụ"}
Với phần chịu uốn, chia bậc tự do thành nhóm giữ lại, $a = (w_1, w_2)$, và nhóm được giải phóng, $b = (\varphi_1, \varphi_2)$. Từ ma trận của dầm, với $k_1$ đến $k_4$ và tham số trượt $\Phi$ định nghĩa [ở trang phần tử dầm](/vi/elements/beam#local-stiffness-matrix),

$$
\begin{aligned}
\mathbf{K}_{aa} &= k_1 \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{ab} &= k_2 \begin{bmatrix} -1 & -1 \\ 1 & 1 \end{bmatrix}, \\[1ex]
\mathbf{K}_{bb} &= \begin{bmatrix} k_3 & k_4 \\ k_4 & k_3 \end{bmatrix}.
\end{aligned}
$$

Vì $\mathbf{K}_{ab}$ có hai cột bằng nhau, chỉ cần biết tổng tất cả các hệ số của $\mathbf{K}_{bb}^{-1}$, và tổng đó bằng $2/(k_3 + k_4)$:

$$
\mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}
= \frac{2\,k_2^2}{k_3 + k_4} \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}.
$$

Với $k_3 + k_4 = 6EI_y / ((1+\Phi)L)$, hệ số này bằng $\dfrac{12\,EI_y}{(1+\Phi)L^3} = k_1$, nên tích trên đúng bằng $\mathbf{K}_{aa}$ và độ cứng chống uốn sau ngưng tụ $\mathbf{K}_{aa} - \mathbf{K}_{ab}\mathbf{K}_{bb}^{-1}\mathbf{K}_{ba}$ bằng không.
::

## Ma trận biến đổi {#transformation-matrix}

Với thanh nghiêng góc $\theta$ từ trục x tổng thể về phía trục z tổng thể, có $c = \cos\theta = (x_2 - x_1)/L$ và $s = \sin\theta = (z_2 - z_1)/L$, các chuyển vị địa phương là $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$ với

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 \\
 -s & c & 0 & 0 \\
 0 & 0 & c & s \\
 0 & 0 & -s & c
\end{bmatrix}:
$$

tức là các hàng và cột chuyển vị thẳng của [ma trận biến đổi của dầm](/vi/elements/beam#transformation-matrix). Chú ý dấu của $s$ khi trục z hướng xuống: thanh kèo A → C của dàn ở trên đi lên, nên $z_2 - z_1 = -3$ m, $c = 0{,}7071$ và $s = -0{,}7071$.

## Ma trận độ cứng tổng thể {#global-stiffness-matrix}

Nhân ra $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T}$, ta được

$$
\mathbf{K}_g = \frac{EA}{L}
\begin{bmatrix}
 c^2 & cs & -c^2 & -cs \\
 cs & s^2 & -cs & -s^2 \\
 -c^2 & -cs & c^2 & cs \\
 -cs & -s^2 & cs & s^2
\end{bmatrix}.
$$

Cửa sổ **Ma trận độ cứng** của một thanh có khớp hiển thị các số này ở các hàng và cột chuyển vị thẳng, và số không ở các hàng và cột góc xoay.

## Dầm có khớp làm được gì hơn thanh dàn {#where-a-hinged-beam-does-more}

Vì thanh dàn trong EduBeam vẫn là phần tử dầm, nó làm được hai việc mà thanh dàn trong giáo trình không làm được:

- **Chịu tải trọng đặt trên thanh.** Tải phân bố trên thanh, chẳng hạn trọng lượng bản thân, làm thanh bị uốn giữa hai nút như một dầm đơn giản và truyền $qL/2$ về mỗi nút. Các thanh còn lại chịu lực dọc của dàn do các tải nút này. Trong chính thanh chịu tải, thành phần của tải dọc theo thanh làm $N$ thay đổi bậc nhất, và lực trong thanh dàn là giá trị của $N$ tại giữa thanh.
- **Kết hợp với dầm.** Một khung có thể chứa các thanh có khớp, như thanh căng hoặc thanh giằng xiên, mà không cần loại phần tử đặc biệt nào.

Thêm tải 5 kN/m lên thanh căng của dàn ở trên:

::model-figure{caption="Cùng dàn đó với 5 kN/m trên thanh căng: lực dọc không đổi, còn thanh căng bị uốn với M = qL²/8 = 22,5 kNm"}
---
nodes: { A: [0, 0], B: [6, 0], C: [3, -3] }
supports: { A: pin, B: roller }
members:
  - { nodes: [A, C], hinges: [true, true] }
  - { nodes: [C, B], hinges: [true, true] }
  - { nodes: [A, B], hinges: [true, true] }
loads:
  - { node: C, fz: 10 }
  - { member: 3, qz: 5 }
results: [M, N]
show: [nodeLabels]
---
::

Kiểm tra bằng tính tay: tại C, phương trình cân bằng theo phương đứng $2\,N \sin 45^\circ + 10 = 0$ cho $N = -7{,}071$ kN trong mỗi thanh kèo. Tại A, thanh căng cân bằng thành phần ngang của lực trong thanh kèo, $7{,}071 \cos 45^\circ = 5$ kN, và chịu kéo với $N = +5$ kN. Tải trên thanh căng truyền thẳng vào các gối tựa ở hai đầu: nó làm mỗi phản lực tăng thêm $qL/2 = 15$ kN nhưng không thay đổi lực dọc nào.

Dàn phải bất biến hình khi coi mọi nút là khớp. Chẳng hạn, một khoang vuông không có thanh xiên là hệ biến hình: EduBeam chỉ ra các khớp và cho thấy chuyển động (xem [Khắc phục sự cố](/vi/reference/troubleshooting#no-results-are-drawn)).
