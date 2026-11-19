---
description: "Phần tử dầm Timoshenko hai nút của EduBeam: ma trận độ cứng chính xác, biến dạng trượt, khớp đầu thanh qua ngưng tụ tĩnh, nội lực đầu ngàm, ma trận biến đổi."
source: site
---

# Phần tử dầm

Mọi thanh trong EduBeam, dù là dầm, cột hay thanh dàn, đều là cùng một phần tử: **dầm Timoshenko** thẳng, hai nút, nằm trong mặt phẳng x–z, tiết diện không đổi. Trang này trình bày công thức của phần tử đúng như bộ giải tính, để bạn có thể tự lập lại bằng tay bất kỳ ma trận phần tử hay véc tơ tải trọng nào rồi đối chiếu với ứng dụng. Quy ước dấu theo trang [Hệ tọa độ và quy ước dấu](/vi/elements/conventions), mã nguồn là tệp `Beam2D.ts` trong [@edubeam/fem](/vi/solver), còn trang [EduBeam giải mô hình như thế nào](/vi/elements/analysis) cho thấy các phần tử được ghép lại để giải cả kết cấu ra sao.

## Bậc tự do {#degrees-of-freedom}

Mỗi nút có ba bậc tự do, nên phần tử có sáu. Trong [hệ trục địa phương](/vi/elements/conventions#element-local-axes) của phần tử, mỗi chuyển vị đầu phần tử ứng với một [nội lực đầu phần tử](/vi/elements/conventions#end-forces-element-results-table), tức một cột của bảng *Kết quả phần tử*:

::element-sketch{mode="dofs" caption="Sáu bậc tự do của phần tử dầm, tất cả vẽ theo chiều dương; nét đứt đánh dấu thớ dưới (trục +z địa phương)"}
::

| Phương | Nút đầu (1) | Nút cuối (2) |
| --- | --- | --- |
| theo trục x địa phương | $u_1$ và `X12` | $u_2$ và `X21` |
| theo trục z địa phương, hướng xuống với phần tử vẽ từ trái sang phải | $w_1$ và `Z12` | $w_2$ và `Z21` |
| góc xoay, ngược chiều kim đồng hồ | $\varphi_1$ và `M12` | $\varphi_2$ và `M21` |

Xếp theo thứ tự này, chúng tạo thành véc tơ chuyển vị và véc tơ lực của phần tử:

$$
\begin{aligned}
\mathbf{d}_l &= \begin{bmatrix} u_1 & w_1 & \varphi_1 & u_2 & w_2 & \varphi_2 \end{bmatrix}^\mathsf{T}, \\
\mathbf{f} &= \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}.
\end{aligned}
$$

Vì trục z hướng xuống và góc xoay dương ngược chiều kim đồng hồ, trục của dầm không có biến dạng trượt xoay một góc $\varphi = -\,\mathrm{d}w/\mathrm{d}x$.

## Ma trận độ cứng địa phương {#local-stiffness-matrix}

Khi phần tử không có tải trọng phần tử, nội lực đầu phần tử là $\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l$, với

$$
\mathbf{K}_l =
\begin{bmatrix}
 k_N & 0 & 0 & -k_N & 0 & 0 \\
 0 & k_1 & -k_2 & 0 & -k_1 & -k_2 \\
 0 & -k_2 & k_3 & 0 & k_2 & k_4 \\
 -k_N & 0 & 0 & k_N & 0 & 0 \\
 0 & -k_1 & k_2 & 0 & k_1 & k_2 \\
 0 & -k_2 & k_4 & 0 & k_2 & k_3
\end{bmatrix}
$$

và

$$
\begin{aligned}
k_N &= \frac{EA}{L}, & k_1 &= \frac{12\,EI_y}{(1+\Phi)\,L^3}, \\[1ex]
k_2 &= \frac{6\,EI_y}{(1+\Phi)\,L^2}, & k_3 &= \frac{(4+\Phi)\,EI_y}{(1+\Phi)\,L}, \\[1ex]
k_4 &= \frac{(2-\Phi)\,EI_y}{(1+\Phi)\,L}, & \Phi &= \frac{12\,EI_y}{k\,GA\,L^2}.
\end{aligned}
$$

$E$ và $G$ là mô đun đàn hồi và mô đun trượt của vật liệu, $A$ là diện tích, $I_y$ là mô men quán tính đối với trục y, $k$ là **Hệ số hiệu chỉnh cắt** của tiết diện và $L$ là chiều dài phần tử. $\Phi$ là **tham số trượt**: nó so sánh độ mềm của thanh khi chịu cắt với độ mềm khi chịu uốn, và tăng lên khi thanh ngắn và tiết diện cao. Với $\Phi = 0$, các số hạng trở về $12EI/L^3$, $6EI/L^2$, $4EI/L$ và $2EI/L$ quen thuộc của dầm Euler–Bernoulli. Biến dạng dọc trục và uốn không liên hệ với nhau: $u_1$ và $u_2$ chỉ đi cùng $k_N$.

Các giáo trình dùng trục y hướng lên ghi $+6EI/L^2$ ở chỗ ma trận này ghi $-k_2$. Cả hai mô tả cùng một độ cứng; chỉ có chiều dương của chuyển vị vuông góc với trục thanh là khác nhau.

::callout{type="details" title="Nguồn gốc của ma trận: các hàm dạng chính xác"}
Với thanh Timoshenko lăng trụ không chịu tải, phương trình cân bằng có nghiệm chính xác: $u$ bậc nhất theo $x$, $w$ bậc ba và $\varphi$ bậc hai. Biểu diễn qua các chuyển vị đầu phần tử, với $\xi = x/L$, độ võng là

$$
w(\xi) = N_1\,w_1 + N_2\,\varphi_1 + N_3\,w_2 + N_4\,\varphi_2,
$$

$$
\begin{aligned}
N_1 &= \frac{(1-\xi)\,(1+\Phi+\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_2 &= -\frac{L\,\xi\,(1-\xi)\,(2+\Phi-2\xi)}{2\,(1+\Phi)}, \\[1ex]
N_3 &= \frac{\xi\,(\Phi+3\xi-2\xi^2)}{1+\Phi}, \\[1ex]
N_4 &= \frac{L\,\xi\,(1-\xi)\,(\Phi+2\xi)}{2\,(1+\Phi)}.
\end{aligned}
$$

Với $\Phi = 0$, đây là các đa thức Hermite bậc ba, $N_1 = 1 - 3\xi^2 + 2\xi^3$ và $N_2 = -L\,\xi(1-\xi)^2$; dấu trừ đến từ $\varphi = -w'$. Các hệ số của ma trận độ cứng chính là những lực đầu phần tử cần để thanh biến dạng đúng theo các hàm này, nên đó là độ cứng chính xác của thanh, chứ không phải một xấp xỉ chỉ chính xác dần khi chia thêm phần tử. Bộ giải cũng vẽ sơ đồ biến dạng bằng chính các hàm này.
::

## Biến dạng trượt: Timoshenko hay Euler–Bernoulli? {#timoshenko-or-euler-bernoulli}

Phần tử có biến dạng trượt hay không chỉ phụ thuộc vào $\Phi$, tức là vào hệ số hiệu chỉnh cắt $k$ của tiết diện: $kA$ là diện tích chịu cắt. Mỗi loại tiết diện có giá trị $k$ ban đầu riêng:

| Tiết diện | Hệ số hiệu chỉnh cắt $k$ |
| --- | --- |
| Mô hình khởi đầu và các ví dụ có sẵn | $10^{32}$, làm cho $\Phi \approx 0$: Euler–Bernoulli |
| Tiết diện chữ I, chữ H và cánh rộng trong thư viện | $h\,t_w / A$: bản bụng chịu cắt |
| Tiết diện hộp chữ nhật trong thư viện | $2\,h\,t / A$: hai thành bên |
| Tiết diện chữ nhật và vuông trong thư viện | 0,833 |
| Tiết diện tròn trong thư viện | 0,9 |
| Tiết diện ống tròn trong thư viện | 0,5 |
| Tiết diện đa giác | ban đầu 0,833 |
| Hộp thoại **Thêm tiết diện** | ban đầu 1 |

Với thanh mảnh, chênh lệch này nhỏ. Dưới tải phân bố đều, biến dạng trượt cộng thêm vào độ võng do uốn ở giữa nhịp dầm đơn giản một lượng bằng $0{,}8\,\Phi$ lần chính độ võng đó. Với dầm thép IPE 200, mức tăng là 1,2 % khi nhịp 6 m nhưng tới 11 % khi nhịp 2 m. Muốn bỏ qua biến dạng trượt, đặt $k$ bằng một số rất lớn, chẳng hạn `1e32`. Nếu không ghi chú khác, các hình tương tác trên trang web này dùng tiết diện ví dụ không biến dạng trượt, nên trùng với kết quả tính tay theo lý thuyết Euler–Bernoulli. Hình dưới đây là ngoại lệ:

::model-figure{caption="IPE 200 nhịp 2 m với k = h·tw/A = 0,393: w = 0,5657 mm giữa nhịp, lớn hơn 11 % so với 0,5106 mm theo lý thuyết Euler–Bernoulli (Φ = 0,135)"}
---
nodes: { A: [0, 0], B: [2, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
material: { e: 210e9, g: 81e9 }
section: { a: 28.48e-4, iy: 1943e-8, h: 0.2, k: 0.3933 }
results: [w, M]
---
::

## Khớp đầu thanh {#end-hinges}

Khi đánh dấu một [khớp đầu thanh](/vi/essentials/elements#end-hinges), mô men ở đầu đó của phần tử bằng không. Góc xoay ở đầu đó trở thành tự do, và bộ giải khử nó khỏi ma trận bằng phép **ngưng tụ tĩnh**. Chia sáu bậc tự do thành nhóm giữ lại, $a$, và nhóm góc xoay đầu được giải phóng, $b$:

$$
\begin{bmatrix} \mathbf{f}_a \\ \mathbf{0} \end{bmatrix}
=
\begin{bmatrix} \mathbf{K}_{aa} & \mathbf{K}_{ab} \\ \mathbf{K}_{ba} & \mathbf{K}_{bb} \end{bmatrix}
\begin{bmatrix} \mathbf{d}_a \\ \mathbf{d}_b \end{bmatrix}
+
\begin{bmatrix} \mathbf{f}_{\mathrm{fix},a} \\ \mathbf{f}_{\mathrm{fix},b} \end{bmatrix}.
$$

Ở đây $\mathbf{f}_\mathrm{fix}$ là nội lực đầu ngàm do [tải trọng phần tử](#element-loads). Hàng thứ hai cho góc xoay tại khớp,

$$
\mathbf{d}_b = -\mathbf{K}_{bb}^{-1}\left(\mathbf{K}_{ba}\,\mathbf{d}_a + \mathbf{f}_{\mathrm{fix},b}\right),
$$

và thay vào hàng thứ nhất, ta được ma trận độ cứng và nội lực đầu ngàm sau ngưng tụ

$$
\begin{aligned}
\mathbf{K}^{*} &= \mathbf{K}_{aa} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{K}_{ba}, \\
\mathbf{f}^{*}_\mathrm{fix} &= \mathbf{f}_{\mathrm{fix},a} - \mathbf{K}_{ab}\,\mathbf{K}_{bb}^{-1}\,\mathbf{f}_{\mathrm{fix},b}.
\end{aligned}
$$

Bộ giải ghi $\mathbf{K}^{*}$ trở lại vào một ma trận 6 × 6, trong đó hàng và cột của các góc xoay được giải phóng bằng không, nên phần tử có khớp được ghép vào hệ y như mọi phần tử khác. Sau khi giải, bộ giải tính $\mathbf{d}_b$ theo công thức trên, và sơ đồ biến dạng thể hiện điểm gãy tại khớp.

Với khớp ở nút cuối, phần chịu uốn ứng với $(w_1, \varphi_1, w_2)$ trở thành

$$
\mathbf{K}^{*}_{w} = \frac{12\,EI_y}{(4+\Phi)\,L^3}
\begin{bmatrix} 1 & -L & -1 \\ -L & L^2 & L \\ -1 & L & 1 \end{bmatrix},
$$

với $\Phi = 0$, đây chính là độ cứng $3EI/L^3$ quen thuộc của thanh một đầu ngàm, một đầu khớp. Khi có khớp ở **cả hai** đầu, các số hạng uốn biến mất hoàn toàn và chỉ còn $EA/L$: phần tử trở thành [thanh dàn](/vi/elements/truss).

Khớp thuộc về đầu phần tử, không thuộc về nút. Nếu mọi phần tử gặp nhau tại một nút đều có khớp ở đó, góc xoay của chính nút không nối với gì cả. Bộ giải cho góc xoay ấy bằng không, điều này không gây hại gì; nhưng mô men nút đặt tại nút đó không có phần tử nào tiếp nhận và làm hệ phương trình suy biến.

## Tải trọng phần tử {#element-loads}

Tải trọng đặt trên phần tử tham gia vào lời giải dưới dạng **tải trọng nút tương đương**, $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. **Nội lực đầu ngàm** $\mathbf{f}_\mathrm{fix}$ là các lực đầu phần tử cần để giữ phần tử chịu tải khi hai đầu bị ngàm chặt.

Mọi công thức dưới đây đều viết trong hệ trục địa phương. Tải trọng nhập theo trục tổng thể (bỏ đánh dấu **LCS**) trước hết được chuyển thành các thành phần địa phương bằng $c = \cos\theta$ và $s = \sin\theta$ của [góc](#transformation-matrix) phần tử,

$$
q_x = c\,\bar q_x + s\,\bar q_z, \qquad q_z = -s\,\bar q_x + c\,\bar q_z,
$$

trong đó dấu gạch trên đầu chỉ các thành phần tổng thể. Tải phân bố luôn tính trên mỗi mét chiều dài của chính phần tử. Ví dụ, kèo mái đi từ $(0, 0)$ đến $(3, -4)$ có $L = 5$ m, $c = 0{,}6$ và $s = -0{,}8$ (kèo đi lên nên $z$ giảm). Tải thẳng đứng $\bar q_z = 10$ kN/m trên kèo cho $q_x = -8$ kN/m, hướng xuống theo chiều dốc, và $q_z = 6$ kN/m vuông góc với kèo; tổng cộng kèo chịu $10 \times 5 = 50$ kN, chứ không phải $10 \times 3$.

Trong các bảng:

- $q_z$, $q_x$: tải phân bố đều; $q_1 \to q_2$: tải hình thang, $q_1$ tại nút đầu và $q_2$ tại nút cuối.
- $F_z$, $F_x$, $M_y$: lực hoặc mô men tập trung đặt cách nút đầu một khoảng $a$, với $b = L - a$.
- $\Delta T = \Delta T_b - \Delta T_t$: thớ dưới nóng hơn thớ trên; $\Delta T_c$: trục thanh nóng lên. $\alpha$ là hệ số dãn dài do nhiệt của vật liệu và $h$ là **Chiều cao** của tiết diện.

Theo phương vuông góc với trục (thành phần z), với $\Phi = 0$, tại nút đầu:

$$
\begin{array}{l|cc}
\text{Tải trọng} & Z_{12} & M_{12} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & \dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(7q_1+3q_2)}{20} & \dfrac{L^2\,(3q_1+2q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,b^2\,(3a+b)}{L^3} & \dfrac{F_z\,a\,b^2}{L^2} \\[3ex]
M_y & -\dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,b\,(b-2a)}{L^2} \\[3ex]
\Delta T & 0 & \dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Tại nút cuối:

$$
\begin{array}{l|cc}
\text{Tải trọng} & Z_{21} & M_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -\dfrac{q_z L}{2} & -\dfrac{q_z L^2}{12} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(3q_1+7q_2)}{20} & -\dfrac{L^2\,(2q_1+3q_2)}{60} \\[3ex]
F_z & -\dfrac{F_z\,a^2\,(a+3b)}{L^3} & -\dfrac{F_z\,a^2\,b}{L^2} \\[3ex]
M_y & \dfrac{6\,a\,b\,M_y}{L^3} & -\dfrac{M_y\,a\,(a-2b)}{L^2} \\[3ex]
\Delta T & 0 & -\dfrac{EI_y\,\alpha\,\Delta T}{h}
\end{array}
$$

Theo phương dọc trục (thành phần x), với mọi $\Phi$:

$$
\begin{array}{l|cc}
\text{Tải trọng} & X_{12} & X_{21} \\[0.5ex] \hline
\rule{0pt}{4ex}q_x & -\dfrac{q_x L}{2} & -\dfrac{q_x L}{2} \\[3ex]
q_1 \to q_2 & -\dfrac{L\,(2q_1+q_2)}{6} & -\dfrac{L\,(q_1+2q_2)}{6} \\[3ex]
F_x & -\dfrac{F_x\,b}{L} & -\dfrac{F_x\,a}{L} \\[3ex]
\Delta T_c & EA\,\alpha\,\Delta T_c & -EA\,\alpha\,\Delta T_c
\end{array}
$$

::callout{type="details" title="Nội lực đầu ngàm khi kể biến dạng trượt"}
Tải phân bố đều và tải nhiệt độ cho cùng nội lực đầu ngàm với mọi $\Phi$. Với các tải còn lại, đặt $D = 1 + \Phi$ và $\Delta q = q_2 - q_1$ (thành phần z):

$$
\begin{aligned}
&\text{Tải hình thang:} \\
Z_{12} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(9+10\Phi)}{60\,D}, \\[1ex]
M_{12} &= \frac{q_1 L^2}{12} + \frac{\Delta q\,L^2\,(4+5\Phi)}{120\,D}, \\[1ex]
Z_{21} &= -\frac{q_1 L}{2} - \frac{\Delta q\,L\,(21+20\Phi)}{60\,D}, \\[1ex]
M_{21} &= -\frac{q_1 L^2}{12} - \frac{\Delta q\,L^2\,(6+5\Phi)}{120\,D}; \\[3ex]
&\text{Lực } F_z\text{:} \\
Z_{12} &= -\frac{F_z\,b\,(\Phi L^2 + 3ab + b^2)}{D\,L^3}, \\[1ex]
M_{12} &= \frac{F_z\,a\,b\,(\Phi L + 2b)}{2\,D\,L^2}, \\[1ex]
Z_{21} &= -\frac{F_z\,a\,(\Phi L^2 + a^2 + 3ab)}{D\,L^3}, \\[1ex]
M_{21} &= -\frac{F_z\,a\,b\,(\Phi L + 2a)}{2\,D\,L^2}; \\[3ex]
&\text{Mô men } M_y\text{:} \\
Z_{12} &= -\frac{6\,a\,b\,M_y}{D\,L^3}, \qquad Z_{21} = \frac{6\,a\,b\,M_y}{D\,L^3}, \\[1ex]
M_{12} &= -\frac{M_y\,b\,(\Phi L - 2a + b)}{D\,L^2}, \\[1ex]
M_{21} &= -\frac{M_y\,a\,(\Phi L + a - 2b)}{D\,L^2}.
\end{aligned}
$$

Đây là các nghiệm chính xác của thanh Timoshenko hai đầu ngàm; độ võng mà bộ giải cộng thêm giữa các nút cho từng loại tải cũng là nghiệm chính xác.
::

Trên phần tử có khớp, nội lực đầu ngàm được ngưng tụ thành $\mathbf{f}^{*}_\mathrm{fix}$, như ở mục [Khớp đầu thanh](#end-hinges). Chẳng hạn, tải phân bố đều trên phần tử có khớp ở nút cuối cho $Z_{12} = -5q_zL/8$, $M_{12} = q_zL^2/8$, $Z_{21} = -3q_zL/8$ và $M_{21} = 0$ (với $\Phi = 0$): đúng nội lực đầu ngàm của dầm một đầu ngàm, một đầu gối di động.

Sau khi giải, nội lực dọc theo phần tử suy ra từ nội lực đầu phần tử và điều kiện cân bằng với tải trọng trên phần tử, còn độ võng là tổng của các hàm dạng và độ võng do tải trọng khi hai đầu bị ngàm: xem [Kết quả dọc theo thanh](/vi/elements/analysis#results-along-the-members).

## Ma trận biến đổi {#transformation-matrix}

Phần tử nghiêng góc $\theta$, đo từ trục x tổng thể về phía trục z tổng thể (theo chiều kim đồng hồ trên màn hình), có

$$
c = \cos\theta = \frac{x_2 - x_1}{L}, \qquad s = \sin\theta = \frac{z_2 - z_1}{L},
$$

và chuyển vị đầu phần tử trong hệ địa phương suy từ chuyển vị tổng thể theo $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, trong đó ma trận biến đổi (ma trận chuyển trục tọa độ) là

$$
\mathbf{T} =
\begin{bmatrix}
 c & s & 0 & 0 & 0 & 0 \\
 -s & c & 0 & 0 & 0 & 0 \\
 0 & 0 & 1 & 0 & 0 & 0 \\
 0 & 0 & 0 & c & s & 0 \\
 0 & 0 & 0 & -s & c & 0 \\
 0 & 0 & 0 & 0 & 0 & 1
\end{bmatrix}.
$$

Góc xoay như nhau trong cả hai hệ. Nếu một nút có **Góc LCS của nút** $\beta$ ([gối tựa xiên](/vi/essentials/nodes-supports#inclined-skewed-supports)), các ẩn $\mathbf{d}_n$ của nút đó viết trong hệ trục riêng của nút, xoay một góc $\beta$ từ trục x tổng thể về phía trục z tổng thể. Thành phần tổng thể của chúng là

$$
\mathbf{d}_g = \mathbf{T}_n\,\mathbf{d}_n, \qquad
\mathbf{T}_n = \begin{bmatrix} \cos\beta & -\sin\beta & 0 \\ \sin\beta & \cos\beta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

cho ba bậc tự do của nút đó. Bộ giải nhân $\mathbf{T}$ từ bên phải với ma trận chéo khối gồm hai ma trận $\mathbf{T}_n$ của nút đầu và nút cuối (ma trận đơn vị với nút không có hệ trục riêng), nhờ đó phần tử nối vào mỗi nút theo đúng hệ trục của nút ấy.

## Ma trận độ cứng tổng thể {#global-stiffness-matrix}

Trong hệ trục tổng thể, ma trận độ cứng và tải trọng nút tương đương của phần tử là

$$
\mathbf{K}_g = \mathbf{T}^\mathsf{T}\,\mathbf{K}_l\,\mathbf{T},
\qquad
\mathbf{f}_{\mathrm{eq},g} = \mathbf{T}^\mathsf{T}\,\mathbf{f}_\mathrm{eq},
$$

trong đó $\mathbf{K}_l$ và $\mathbf{f}_\mathrm{eq}$ đã được ngưng tụ nếu phần tử có khớp. Cửa sổ **Ma trận độ cứng** của một phần tử hiển thị chính $\mathbf{K}_g$ (mở từ bảng *Phần tử* hoặc từ menu ngữ cảnh của phần tử), theo đơn vị SI: N/m, N và N·m. Trang [EduBeam giải mô hình như thế nào](/vi/elements/analysis) ghép các ma trận này lại và giải tay một ví dụ nhỏ.
