---
description: "Phương pháp độ cứng trực tiếp trong EduBeam, giải tay trên dầm một đầu ngàm, một đầu gối di động: đánh số bậc tự do, ghép ma trận, gối tựa, phản lực, nội lực."
source: site
---

# EduBeam giải mô hình như thế nào

Mỗi lần bạn sửa mô hình, EduBeam giải lại nó bằng **phương pháp độ cứng trực tiếp** (phương pháp chuyển vị dạng ma trận), ngay trong trình duyệt, chỉ trong vài mili giây. Trang này đi theo bộ giải [@edubeam/fem](/vi/solver) từng bước trên một ví dụ nhỏ, để bạn có thể tự tính lại từng con số và hiểu vì sao có thể tin vào kết quả.

Ví dụ là một dầm một đầu ngàm, một đầu gối di động: thép IPE 300, dài 4 m, ngàm tại A, gối di động tại B, chịu tải phân bố đều 10 kN/m. Độ cứng chống uốn của dầm là $EI = 210 \text{ GPa} \times 8356 \text{ cm}^4 = 17\,548$ kNm², và khi bỏ qua biến dạng trượt, các công thức trong giáo trình cho $M_A = -qL^2/8 = -20$ kNm, $R_B = 3qL/8 = 15$ kN và $\varphi_B = qL^3/(48EI)$.

::model-figure{caption="Dầm một đầu ngàm, một đầu gối di động, IPE 300, 10 kN/m: M = −20 kNm tại A và +11,25 kNm cách A 2,5 m, phản lực 25 kN và 15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
section: { a: 53.8e-4, iy: 8.356e-5, h: 0.3 }
results: [M, V, w]
show: [nodeLabels]
---
::

## Từ mô hình đến chuyển vị {#from-model-to-displacements}

::div{.steps}
### Đánh số bậc tự do {#number-the-degrees-of-freedom}

Mỗi nút nhận những bậc tự do mà các phần tử nối vào nó cần. Mọi phần tử đều là [phần tử dầm](/vi/elements/beam), nên mỗi nút có `Dx`, `Dz` và `Ry`. Bộ giải đánh số các bậc tự do **không bị chặn** trước, rồi mới đến các bậc tự do **bị chặn** (có gối tựa), lần lượt theo từng nút. Ở đây A là ngàm còn B chỉ bị giữ theo phương đứng, nên có hai bậc tự do không bị chặn:

$$
\begin{gathered}
\mathbf{r} = \begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix},
\qquad
\mathbf{r}_u = \begin{bmatrix} u_B \\ \varphi_B \end{bmatrix}, \\[1ex]
\mathbf{r}_p = \begin{bmatrix} u_A & w_A & \varphi_A & w_B \end{bmatrix}^\mathsf{T}.
\end{gathered}
$$

$u$, $w$ và $\varphi$ là chuyển vị theo trục x, theo trục z và góc xoay, như trong [bảng bậc tự do](/vi/elements/conventions#degrees-of-freedom). Mỗi phần tử có một **véc tơ định vị**: vị trí của sáu bậc tự do của nó trong $\mathbf{r}$. Đếm từ 1, các bậc tự do $(u_A, w_A, \varphi_A, u_B, w_B, \varphi_B)$ của dầm nằm ở các vị trí $(3, 4, 5, 1, 6, 2)$.

### Tính ma trận phần tử {#compute-the-element-matrices}

Với mỗi phần tử, bộ giải lập [ma trận độ cứng địa phương](/vi/elements/beam#local-stiffness-matrix), ngưng tụ các [khớp đầu thanh](/vi/elements/beam#end-hinges) nếu có, rồi chuyển ma trận sang hệ trục tổng thể, $\mathbf{K}_g = \mathbf{T}^\mathsf{T}\mathbf{K}_l\,\mathbf{T}$. Mỗi tải trọng phần tử được đổi thành [tải trọng nút tương đương](/vi/elements/beam#element-loads), $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$. Dầm của ta nằm ngang nên $\mathbf{T}$ là ma trận đơn vị, và tải phân bố đều cho (đơn vị kN và kNm)

$$
\mathbf{f}_\mathrm{eq} = \begin{bmatrix} 0 \\[0.5ex] qL/2 \\[0.5ex] -qL^2/12 \\[0.5ex] 0 \\[0.5ex] qL/2 \\[0.5ex] qL^2/12 \end{bmatrix}
= \begin{bmatrix} 0 \\[0.5ex] 20 \\[0.5ex] -13{,}33 \\[0.5ex] 0 \\[0.5ex] 20 \\[0.5ex] 13{,}33 \end{bmatrix}.
$$

### Ghép ma trận {#assemble}

Ma trận độ cứng tổng thể $\mathbf{K}$ ban đầu toàn số không. Mỗi phần tử cộng số hạng $(i, j)$ của mình vào hàng và cột mà véc tơ định vị chỉ ra cho $i$ và $j$; vì vậy tại nút có nhiều phần tử gặp nhau, độ cứng của chúng ứng với các bậc tự do của nút đó được cộng dồn. Véc tơ tải trọng $\mathbf{F}$ gom tải trọng nút và tải trọng nút tương đương theo cùng cách. Chuyển vị cưỡng bức (lún gối tựa) được đưa vào $\mathbf{r}_p$. Khi xếp các bậc tự do không bị chặn trước, bị chặn sau, hệ phương trình tách thành các khối:

$$
\begin{bmatrix} \mathbf{K}_{uu} & \mathbf{K}_{up} \\ \mathbf{K}_{pu} & \mathbf{K}_{pp} \end{bmatrix}
\begin{bmatrix} \mathbf{r}_u \\ \mathbf{r}_p \end{bmatrix}
=
\begin{bmatrix} \mathbf{F}_u \\ \mathbf{F}_p + \mathbf{R} \end{bmatrix},
$$

trong đó $\mathbf{R}$ là các phản lực chưa biết. Trong ví dụ, chỉ các hàng và cột của dầm ứng với đầu B thuộc về $\mathbf{K}_{uu}$:

$$
\begin{aligned}
\mathbf{K}_{uu} &= \begin{bmatrix} EA/L & 0 \\ 0 & 4EI/L \end{bmatrix} \\[1ex]
&= \begin{bmatrix} 282\,450 \text{ kN/m} & 0 \\ 0 & 17\,548 \text{ kNm} \end{bmatrix}, \\[1ex]
\mathbf{F}_u &= \begin{bmatrix} 0 \\ 13{,}33 \text{ kNm} \end{bmatrix}.
\end{aligned}
$$

### Áp đặt gối tựa và giải {#apply-the-supports-and-solve}

Gối tựa không được mô phỏng bằng lò xo hay bằng một số rất lớn trên đường chéo: các bậc tự do bị chặn chỉ đơn giản được tách riêng ra. Chuyển vị tại các bậc tự do không bị chặn được tìm từ hệ phương trình

$$
\mathbf{K}_{uu}\,\mathbf{r}_u = \mathbf{F}_u - \mathbf{K}_{up}\,\mathbf{r}_p,
$$

giải bằng phân tích LU. Khi không có lún gối tựa thì $\mathbf{r}_p = \mathbf{0}$, và ở đây

$$
\varphi_B = \frac{13{,}33}{17\,548} = 7{,}598 \times 10^{-4} \text{ rad},
$$

đúng bằng $qL^3/(48EI)$ trong giáo trình, còn $u_B = 0$.

### Tính phản lực {#compute-the-reactions}

Khi đã biết mọi chuyển vị, các hàng ứng với bậc tự do bị chặn cho phản lực, tức các lực mà gối tựa tác dụng lên kết cấu:

$$
\mathbf{R} = \mathbf{K}_{pu}\,\mathbf{r}_u + \mathbf{K}_{pp}\,\mathbf{r}_p - \mathbf{F}_p.
$$

Với $w_A$, hàng tương ứng của $\mathbf{K}_{pu}$ chứa $-6EI/L^2$ ở cột của $\varphi_B$, còn $\mathbf{F}_p$ chứa $qL/2$:

$$
\begin{aligned}
R_{wA} &= -\frac{6EI}{L^2}\,\varphi_B - \frac{qL}{2} \\
&= -5 - 20 = -25 \text{ kN},
\end{aligned}
$$

tức 25 kN hướng lên (vì z hướng xuống). Tương tự, $R_{\varphi A} = +20$ kNm và $R_{wB} = -15$ kN: đúng $qL^2/8$ và $3qL/8$ trong giáo trình.
::

## Kết quả dọc theo thanh {#results-along-the-members}

Với mỗi phần tử, bộ giải lấy chuyển vị đầu phần tử từ $\mathbf{r}$, chuyển sang hệ trục địa phương, $\mathbf{d}_l = \mathbf{T}\,\mathbf{d}_g$, và tính [nội lực đầu phần tử](/vi/elements/conventions#end-forces-element-results-table)

$$
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix}.
$$

Trong ví dụ, $\mathbf{d}_l = [0,\ 0,\ 0,\ 0,\ 0,\ \varphi_B]^\mathsf{T}$ cho $Z_{12} = -25$ kN, $M_{12} = 20$ kNm, $Z_{21} = -15$ kN và $M_{21} = 0$.

Nội lực tại vị trí $x$ bất kỳ suy ra từ cân bằng của đoạn phần tử từ nút đầu đến $x$: lực tại nút đầu cộng với tải trọng trên đoạn đó.

$$
\begin{aligned}
N(x) &= -X_{12} + N_q(x), \\
V(x) &= -Z_{12} + V_q(x), \\
M(x) &= -M_{12} - Z_{12}\,x + M_q(x),
\end{aligned}
$$

trong đó $N_q$, $V_q$ và $M_q$ là phần do tải trọng trên đoạn đó gây ra. Với tải phân bố đều $q_z$, tải hình thang từ $q_1$ đến $q_2$ (với $\Delta q = q_2 - q_1$), và lực $F_z$ hoặc mô men $M_y$ đặt cách nút đầu một khoảng $a$, chỉ có tác dụng khi $x \ge a$:

$$
\begin{array}{l|cc}
\text{Tải trọng} & V_q(x) & M_q(x) \\[0.5ex] \hline
\rule{0pt}{4ex}q_z & -q_z\,x & -\dfrac{q_z\,x^2}{2} \\[3ex]
q_1 \to q_2 & -q_1 x - \dfrac{\Delta q\,x^2}{2L} & -\dfrac{q_1 x^2}{2} - \dfrac{\Delta q\,x^3}{6L} \\[3ex]
F_z,\ M_y & -F_z & -F_z\,(x-a) - M_y
\end{array}
$$

$N_q$ có dạng như $V_q$, chỉ thay $q_z$ và $F_z$ bằng các thành phần dọc trục $q_x$ và $F_x$.

Trong ví dụ, $M(x) = -20 + 25\,x - 5\,x^2$ kNm, lớn nhất tại $x = 2{,}5$ m với $11{,}25$ kNm $= 9qL^2/128$. Tải nhiệt độ không có số hạng riêng: nó chỉ tác dụng thông qua nội lực đầu phần tử.

Độ võng là tích của [các hàm dạng](/vi/elements/beam#local-stiffness-matrix) với chuyển vị đầu phần tử, cộng với độ võng do tải trọng trên phần tử khi hai đầu bị ngàm. Với đầu có khớp, bộ giải trước hết khôi phục góc xoay riêng của đầu đó từ [phép ngưng tụ](/vi/elements/beam#end-hinges). Biểu đồ nội lực và sơ đồ biến dạng chính là các hàm này, tính dọc theo từng thanh.

## Vì sao kết quả chính xác {#exact}

Mỗi bước ở trên đều chính xác đối với mô hình mà nó giải:

- Độ cứng phần tử lấy từ **nghiệm chính xác** của thanh Timoshenko lăng trụ, không phải từ các dạng đa thức giả định, nên đó là độ cứng thực của thanh.
- Nội lực đầu ngàm là nghiệm chính xác của thanh hai đầu ngàm với từng loại tải, nên khi đổi sang tải trọng nút tương đương không mất mát gì.
- Do đó chuyển vị nút là chính xác, và nội lực giữa các nút suy ra từ cân bằng với tải trọng thực, nên cũng chính xác.

Vì vậy EduBeam không bao giờ bắt bạn chia nhỏ thanh thành nhiều phần tử: một phần tử cho mỗi thanh cho cùng kết quả như một trăm phần tử. Chỉ cần đặt nút ở những chỗ bản thân thanh thay đổi: tại gối tựa, khớp, góc khung hoặc chỗ đổi tiết diện. Lực tập trung đặt giữa các nút vẫn có thể nhập là tải trọng phần tử. Sai số duy nhất còn lại là sai số làm tròn của phép tính dấu phẩy động; các bảng kết quả hiển thị bằng 0 mọi giá trị nhỏ hơn $10^{-12}$ lần giá trị lớn nhất cùng loại.

“Chính xác” ở đây là đối với mô hình, và mô hình có những giới hạn của nó:

::div{.limits}
- **Vật liệu đàn hồi tuyến tính** và **chuyển vị nhỏ**: phương trình cân bằng viết trên hình dạng chưa biến dạng, nên không có hiệu ứng bậc hai (P–Δ) và không xét mất ổn định.
- **Thanh thẳng, tiết diện không đổi**: mỗi phần tử một tiết diện. Thanh có tiết diện thay đổi phải xấp xỉ bằng nhiều phần tử.
- **Chỉ uốn trong mặt phẳng x–z**: không có xoắn và không có ứng xử ngoài mặt phẳng.
::

## Khi kết cấu không thể đứng vững {#mechanisms}

Kết cấu có thể chuyển động mà không biến dạng thì có ma trận độ cứng suy biến và không có nghiệm duy nhất. EduBeam phát hiện trường hợp này trước khi giải và kiểm tra lại kết quả sau khi giải:

1. **Trước khi giải**, EduBeam kiểm tra từng phần liên thông của kết cấu chỉ dựa trên hình học. Gối tựa phải ngăn được ba chuyển động vật rắn của một miếng cứng phẳng: ít hơn ba liên kết tức là mô hình chỉ là chưa dựng xong (*Kết cấu cần gối tựa trước khi có thể giải.*), còn ba liên kết trở lên mà vẫn để kết cấu trượt hoặc xoay, chẳng hạn các gối di động song song, là lỗi. Sau đó đến lượt các khớp: nếu các thanh có thể xoay quanh khớp trong khi mọi thanh vẫn giữ nguyên chiều dài, kết cấu là hệ biến hình; EduBeam khoanh tròn các khớp và cho thấy chuyển động.
2. **Trong khi giải**, ma trận suy biến thực sự làm dừng phép phân tích LU: *Kết cấu là hệ biến hình: ma trận độ cứng suy biến.*
3. **Sau khi giải**, chuyển vị hoặc góc xoay lớn hơn $10^6$ m hoặc rad cho thấy ma trận thực chất đã suy biến, chỉ có sai số làm tròn che mất điều đó. EduBeam nêu tên các nút và phương chuyển vị: *Kết cấu không ổn định: … chuyển động gần như không có sức cản.* Vật liệu hoặc tiết diện nhập bằng không, hoặc nhập sai đơn vị, cũng rơi vào trường hợp này.

Góc xoay không liên kết với thanh nào, tại nút mà mọi thanh đều nối khớp, không làm kết cấu thành hệ biến hình: bộ giải cho nó bằng không. Trang [Khắc phục sự cố](/vi/reference/troubleshooting#no-results-are-drawn) giải thích mọi thông báo và cách khắc phục.

## Tự chạy bộ giải {#library}

Bộ giải là mã nguồn mở: [@edubeam/fem](/vi/solver), viết bằng TypeScript, chạy trong trình duyệt và Node. Vẫn là dầm một đầu ngàm, một đầu gối di động ở trên:

```ts
import { DofID, LinearStaticSolver, type Beam2D } from '@edubeam/fem'

const solver = new LinearStaticSolver()
const { domain } = solver
const lc = solver.loadCases[0]

// Đơn vị SI: m, N, Pa. Thép, IPE 300; k = 1e32 loại bỏ biến dạng trượt.
domain.createMaterial(1, { e: 210e9, g: 81e9 })
domain.createCrossSection(1, { a: 53.8e-4, iy: 8356e-8, h: 0.3, k: 1e32 })

domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]) // ngàm
domain.createNode('B', [4, 0, 0], [DofID.Dz]) // gối di động
domain.createBeam2D('1', ['A', 'B'], 1, 1)
lc.createBeamElementUniformEdgeLoad('1', [0, 10_000], true) // 10 kN/m, hướng xuống

solver.solve()

solver.neq // 2: Dx và Ry của B không bị chặn
lc.r.toArray() // [0, 0.0007598, 0, 0, 0, 0]: bậc tự do không bị chặn, rồi bị chặn
lc.R.toArray() // [0, -25000, 20000, -15000]: A (Dx, Dz, Ry), rồi B (Dz)

const beam = domain.getElement('1') as Beam2D
beam.computeEndForces(lc).toArray() // [0, -25000, 20000, 0, -15000, 0]
beam.computeBendingMomentAt(lc, 0) // -20000: N·m, căng thớ trên tại ngàm
beam.computeBendingMomentAt(lc, 2.5) // 11250: mô men căng thớ dưới lớn nhất
```

Sau `solve()`, `solver.k` chứa ma trận $\mathbf{K}$ đã ghép và `solver.f` chứa véc tơ tải trọng $\mathbf{F}$, để bạn so với kết quả tự ghép của mình. Các bước trên trang này nằm trong `Solver.ts` (đánh số), `LinearStaticSolver.ts` (ghép ma trận, giải, phản lực) và `Beam2D.ts` (ma trận phần tử và kết quả).

::div{.actions}
[Bắt đầu với @edubeam/fem](/vi/solver/getting-started) [Thư viện gồm những gì](/vi/solver/reference) [Mã nguồn trên GitHub ↗](https://github.com/EduBeamApp/fem){target="_blank"}
::
