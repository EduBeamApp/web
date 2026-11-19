---
description: "Quy ước dấu trong EduBeam: x sang phải, z hướng xuống, tải trọng và chuyển vị dương, trục địa phương, N, V, M, nội lực đầu phần tử, phản lực, hệ y hướng lên."
source: site
---

# Hệ tọa độ và quy ước dấu

Mọi con số EduBeam hiển thị đều có dấu. Trang này nêu rõ *dương* nghĩa là gì đối với tọa độ, tải trọng, chuyển vị, nội lực, nội lực đầu phần tử và phản lực, để bạn so sánh ứng dụng với kết quả tính của mình. Phần lớn các kết quả trông như “sai” hóa ra chỉ là chuyện quy ước dấu.

| Đại lượng | Dương |
| --- | --- |
| `x`, `Dx`, `Fx` | sang phải |
| `z`, `Dz`, `Fz` | **hướng xuống** |
| `Ry`, `My` | ngược chiều kim đồng hồ trên màn hình |
| $N$ | kéo |
| $V$ | làm một đoạn thanh ngắn xoay theo chiều kim đồng hồ |
| $M$ | căng thớ dưới, tức thớ dưới (phía nét đứt) chịu kéo |
| Phản lực | lực gối tựa tác dụng lên kết cấu, lấy dấu như tải trọng |

## Trục tổng thể {#global-axes}

Mô hình nằm trong mặt phẳng x–z:

- **x** nằm ngang, chiều dương sang **phải**.
- **z** thẳng đứng, chiều dương **hướng xuống**.
- **y** hướng ra khỏi màn hình, về phía bạn, để hệ trục là hệ thuận. Góc xoay và mô men lấy quanh trục y, nên **ngược chiều kim đồng hồ là dương**.

Biểu tượng trục ở góc khung vẽ hiển thị x màu đỏ và z màu xanh lá. Vì z hướng xuống, nút ở đỉnh cột cao 3 m có chân tại `Z = 0` sẽ có `Z = −3`. Các góc, chẳng hạn góc của gối tựa xiên, đo từ x về phía z, tức theo chiều kim đồng hồ trên màn hình.

Nếu bạn quen trục y hướng lên, hãy đổi [quy ước hiển thị](#y-up-axes): mô hình giữ nguyên, chỉ những con số bạn đọc và nhập thay đổi.

## Bậc tự do {#degrees-of-freedom}

Mỗi nút có ba bậc tự do:

| Bậc tự do | Ý nghĩa | Chiều dương | Đơn vị |
| --- | --- | --- | --- |
| `Dx` | chuyển vị ngang | sang phải | m |
| `Dz` | chuyển vị đứng | hướng xuống | m |
| `Ry` | góc xoay | ngược chiều kim đồng hồ | rad |

Các dấu này cũng áp dụng cho [chuyển vị cưỡng bức](/vi/essentials/loads#prescribed-displacements-support-settlements), cho bảng *Kết quả tại nút* và cho các giá trị hiện ra khi bạn trỏ chuột vào một nút.

## Tải trọng {#loads}

Tải trọng dương khi hướng theo chiều dương của trục. **Fx**, **Fz** và **My** là các thành phần của tải nút hoặc tải tập trung, **fx** và **fz** là của tải phân bố đều, còn **f₁x**, **f₂x**, **f₁z**, **f₂z** là của tải hình thang tại nút đầu và nút cuối của phần tử.

| Tải trọng | Chiều dương |
| --- | --- |
| `Fx`, `fx`, `f₁x`, `f₂x` | +x, sang phải; theo trục x địa phương của phần tử khi đánh dấu **LCS** (hệ tọa độ địa phương) |
| `Fz`, `fz`, `f₁z`, `f₂z` | +z, **hướng xuống**; theo trục z địa phương của phần tử khi đánh dấu **LCS** |
| `My` | ngược chiều kim đồng hồ |
| `ΔTc` | trục thanh nóng lên, làm thanh dãn dài |
| `ΔTb − ΔTt` | thớ dưới nóng hơn thớ trên |

Vì vậy, trọng lực là `fz` **dương**, còn gió đẩy cột bên trái sang phải là `fx` dương. Tải phân bố luôn tính trên mỗi mét chiều dài của chính thanh, kể cả khi nhập theo trục tổng thể trên thanh xiên. Trang [Tải trọng](/vi/essentials/loads#element-loads) hướng dẫn cách nhập từng loại.

::model-figure{caption="Mọi tải trọng ở đây đều dương: fz = 5 kN/m trên A–B, Fz = 10 kN tại B, My = 10 kNm tại C và Fx = 10 kN tại D"}
---
nodes: { A: [0, 0], B: [3, 0], C: [4.5, 0], D: [6, 0] }
supports: { A: fixed }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 1, qz: 5 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
  - { node: D, fx: 10 }
results: []
reactions: false
show: [nodeLabels]
---
::

## Trục địa phương của phần tử {#element-local-axes}

Mỗi phần tử có hệ trục riêng:

- **trục x địa phương** đi từ nút đầu đến nút cuối của phần tử;
- **trục z địa phương** là trục x địa phương xoay 90° **theo chiều kim đồng hồ trên màn hình**, đúng như phép xoay đưa trục x tổng thể về trục z tổng thể. Khi đi từ nút đầu đến nút cuối, trục z địa phương nằm bên tay phải bạn.

| Phần tử vẽ | Trục z địa phương hướng |
| --- | --- |
| từ trái sang phải | xuống: trục địa phương trùng trục tổng thể |
| từ phải sang trái | lên |
| từ dưới lên trên | sang phải |
| từ trên xuống dưới | sang trái |

Phương của phần tử cho bởi góc $\theta$, đo từ trục x tổng thể về phía trục z tổng thể (theo chiều kim đồng hồ trên màn hình). [Ma trận biến đổi](/vi/elements/beam#transformation-matrix) chuyển các chuyển vị đầu phần tử giữa hai hệ bằng $\cos\theta$ và $\sin\theta$.

Trong vùng hiển thị, nét đứt dọc theo mỗi phần tử đánh dấu phía +z địa phương của nó: **thớ dưới**. Tải trọng phần tử có đánh dấu **LCS**, vị trí của tải tập trung và nội lực đầu phần tử đều theo hệ trục địa phương. Muốn đảo chiều một phần tử, dùng **Đổi thứ tự nút** trong bảng *Phần tử* (xem [chiều phần tử](/vi/essentials/elements#element-direction)).

## Nội lực {#internal-forces}

Cắt thanh tại khoảng cách $x$ tính từ nút đầu. Trên mặt cắt của phần nằm **trước** vết cắt (phía nút đầu), có pháp tuyến ngoài hướng theo +x địa phương, nội lực dương khi hướng theo +x địa phương, theo +z địa phương và ngược chiều kim đồng hồ. Trên mặt cắt còn lại, chúng tác dụng theo chiều ngược lại.

::element-sketch{mode="internal-forces" caption="N, V và M dương trên một đoạn thanh ngắn: kéo, cặp lực cắt làm đoạn thanh xoay theo chiều kim đồng hồ, căng thớ dưới (thớ dưới vẽ nét đứt chịu kéo)"}
::

Diễn đạt bằng lời:

| Đại lượng | Dương nghĩa là |
| --- | --- |
| $N$ | kéo |
| $V$ | làm một đoạn thanh ngắn xoay theo chiều kim đồng hồ: với thanh vẽ từ trái sang phải, lực cắt hướng lên ở mặt trái của đoạn và hướng xuống ở mặt phải |
| $M$ | **căng thớ dưới**: thớ dưới, ở phía nét đứt, chịu kéo |

Với $q_x$ và $q_z$ là tải phân bố trong hệ trục địa phương, nội lực thỏa mãn các quan hệ vi phân

$$
\frac{\mathrm{d}N}{\mathrm{d}x} = -q_x, \qquad \frac{\mathrm{d}V}{\mathrm{d}x} = -q_z, \qquad \frac{\mathrm{d}M}{\mathrm{d}x} = V.
$$

Tại tải tập trung $F_x$, $F_z$ hoặc $M_y$ (trong hệ trục địa phương), chúng có bước nhảy $\Delta N = -F_x$, $\Delta V = -F_z$ và $\Delta M = -M_y$: lực theo +z địa phương làm giảm $V$, còn mô men ngược chiều kim đồng hồ làm giảm $M$.

Vì vậy, dầm đơn giản chịu tải trọng hướng xuống có mô men dương, lực cắt dương tại gối trái và âm tại gối phải. Dầm dưới đây còn bị kéo tại gối di động, nên lực dọc dương.

::model-figure{caption="Dầm đơn giản, 10 kN/m và lực kéo 20 kN: M = +45 kNm giữa nhịp, V = +30 kN tại gối trái và −30 kN tại gối phải, N = +20 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
  - { node: B, fx: 20 }
results: [M, V, N]
---
::

Ở dầm công xôn thì ngược lại: mô men âm, căng thớ trên. Lực đẩy dọc trục làm thanh chịu nén.

::model-figure{caption="Dầm công xôn với lực 10 kN ở đầu tự do và lực nén 15 kN: M = −40 kNm tại ngàm, V = +10 kN, N = −15 kN"}
---
nodes: { A: [0, 0], B: [4, 0] }
supports: { A: fixed }
members: [[A, B]]
loads:
  - { node: B, fz: 10 }
  - { member: 1, px: -15, at: 4 }
results: [M, V, N]
---
::

Trong khung, thớ dưới của mỗi thanh là phía +z địa phương của nó, nên thứ tự bạn vẽ cột quyết định phía nào của cột là thớ dưới. Khung này được vẽ theo thứ tự A → B → C → D, nên trục z địa phương của mọi thanh hướng vào trong: mô men dương nghĩa là thớ trong của khung chịu kéo, còn mô men âm ở các góc khung nghĩa là thớ ngoài chịu kéo.

::model-figure{caption="Khung cổng vẽ theo thứ tự A → B → C → D: trục z địa phương của cả ba thanh hướng vào trong khung"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: pin, D: pin }
members: [[A, B], [B, C], [C, D]]
loads:
  - { member: 2, qz: 10 }
results: [M, N, V]
show: [nodeLabels]
---
::

Biểu đồ được vẽ như trong phần lớn các giáo trình ở châu Âu: $M$ ở phía thớ chịu kéo, $N$ và $V$ dương ở phía không có nét đứt. **Cài đặt → Cài đặt hiển thị → Biểu đồ nội lực** cho phép vẽ $M$ ở phía thớ chịu nén, và $N$ hoặc $V$ ở phía nét đứt. Thay đổi này chỉ ảnh hưởng đến hình vẽ, không bao giờ ảnh hưởng đến giá trị: hãy đọc dấu trên nhãn số, đừng suy ra từ phía vẽ biểu đồ.

## Nội lực đầu phần tử (bảng Kết quả phần tử) {#end-forces-element-results-table}

Bảng *Kết quả phần tử* liệt kê sáu **nội lực đầu phần tử** của mỗi phần tử, trong hệ trục **địa phương** của nó:

::element-sketch{mode="end-forces" caption="Sáu nội lực đầu phần tử, tất cả vẽ theo chiều dương: theo trục x và z địa phương, và ngược chiều kim đồng hồ"}
::

| Cột | Tác dụng lên phần tử tại | Dương theo |
| --- | --- | --- |
| `X12`, `Z12`, `M12` | nút đầu | +x địa phương, +z địa phương, ngược chiều kim đồng hồ |
| `X21`, `Z21`, `M21` | nút cuối | +x địa phương, +z địa phương, ngược chiều kim đồng hồ |

Đó là các lực mà nút tác dụng lên phần tử: ma trận độ cứng nhân với chuyển vị đầu phần tử, cộng với các lực cần để giữ tải trọng phần tử nếu hai đầu bị ngàm chặt,

$$
\begin{gathered}
\mathbf{f} = \begin{bmatrix} X_{12} & Z_{12} & M_{12} & X_{21} & Z_{21} & M_{21} \end{bmatrix}^\mathsf{T}, \\[1ex]
\mathbf{f} = \mathbf{K}_l\,\mathbf{d}_l + \mathbf{f}_\mathrm{fix} = \mathbf{K}_l\,\mathbf{d}_l - \mathbf{f}_\mathrm{eq},
\end{gathered}
$$

trong đó $\mathbf{d}_l$ là chuyển vị đầu phần tử trong hệ trục địa phương và $\mathbf{f}_\mathrm{eq} = -\mathbf{f}_\mathrm{fix}$ là tải trọng nút tương đương của các [tải trọng phần tử](/vi/elements/beam#element-loads) trên nó.

Nội lực đầu phần tử lấy dấu theo chiều các trục, không theo quy ước $N$–$V$–$M$, nên tại nút đầu dấu của chúng ngược lại:

$$
\begin{aligned}
N(0) &= -X_{12}, & N(L) &= X_{21}, \\
V(0) &= -Z_{12}, & V(L) &= Z_{21}, \\
M(0) &= -M_{12}, & M(L) &= M_{21}.
\end{aligned}
$$

Với dầm đơn giản ở trên: `X12 = −20 kN` và `X21 = +20 kN` (kéo), `Z12 = Z21 = −30 kN` (cả hai gối đẩy lên, tức theo −z), và `M12 = M21 = 0`.

Tại mỗi nút, nội lực đầu của các phần tử gặp nhau ở đó, khi đổi sang hệ trục tổng thể, có tổng bằng tải trọng nút cộng phản lực. Đó là một cách kiểm tra nhanh cân bằng của nút.

## Phản lực {#reactions}

Phản lực là lực hoặc mô men mà gối tựa tác dụng **lên kết cấu**; mỗi bậc tự do bị chặn có một phản lực. Phản lực lấy dấu như tải trọng: dương theo +x, theo +z (hướng xuống) và ngược chiều kim đồng hồ. Vì vậy, gối tựa đỡ tải trọng hướng xuống có `Rz` **âm**.

Phản lực được tính theo hệ trục tổng thể, hoặc theo hệ trục riêng của nút khi nút có **Góc LCS của nút** ([gối tựa xiên](/vi/essentials/nodes-supports#inclined-skewed-supports)). Trong vùng hiển thị, mỗi phản lực là một mũi tên chỉ theo chiều gối tựa đẩy, kèm nhãn độ lớn. Giá trị có dấu nằm trong tệp xuất CSV, dưới tên `Rx`, `Rz` và `My`.

## Hệ trục y hướng lên {#y-up-axes}

**Cài đặt → Ngôn ngữ và khu vực → Hệ tọa độ → x sang phải, y lên trên** chuyển mọi thứ bạn nhập và đọc sang hệ trục của giáo trình: **x** sang phải, **y** lên trên và **z** hướng về phía bạn. Mô hình, tệp đã lưu và hình vẽ giữ nguyên hoàn toàn; chỉ các con số và tên trục thay đổi:

| Đại lượng | x sang phải, z xuống dưới (mặc định) | x sang phải, y lên trên |
| --- | --- | --- |
| Tọa độ đứng | `Z` | `Y`, ngược dấu |
| Tải trọng, chuyển vị, phản lực và nội lực đầu phần tử theo phương đứng | `Fz`, `fz`, `Dz`, `Rz`, `Z12`… | `Fy`, `fy`, `Dy`, `Ry`, `Y12`…, ngược dấu |
| Góc xoay và mô men | `Ry`, `My` | `Rz`, `Mz`, cùng dấu (dương khi ngược chiều kim đồng hồ) |
| Góc gối tựa | đo theo chiều kim đồng hồ | đo ngược chiều kim đồng hồ, ngược dấu |
| Nội lực | $N$, $V$, $M$ | như cũ, cùng dấu, vẽ như cũ |

Vậy trong hệ y hướng lên, trọng lực là `fy` **âm**, và đỉnh cột cao 3 m có `Y = 3`.

## Đơn vị {#units}

Bộ giải luôn làm việc theo hệ SI: m, N, Pa, rad, và K cho thay đổi nhiệt độ. Đơn vị hiển thị trong trang [Đơn vị và cài đặt](/vi/essentials/units-settings) chỉ đổi những gì bạn nhập và đọc, không bao giờ đổi mô hình.
