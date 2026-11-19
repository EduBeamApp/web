---
title: Vật liệu và tiết diện
description: "Các tham số vật liệu và tiết diện mà @edubeam/fem dùng, tham số nào cần cho từng phép tính, điều gì xảy ra khi thiếu, và cách bỏ qua biến dạng trượt."
order: 4
source: site
---

# Vật liệu và tiết diện {#materials-and-sections}

Thanh lấy độ cứng từ một vật liệu và một tiết diện; mỗi thứ chỉ cần tạo một lần, rồi được tham chiếu qua nhãn của nó.

```ts
domain.createMaterial('steel', { e: 210e9, g: 81e9, alpha: 12e-6 })
domain.createCrossSection('IPE200', {
  a: 28.5e-4, // m²
  iy: 1943e-8, // m⁴
  h: 0.2, // m
  k: 5 / 6,
})
```

## Vật liệu {#material}

| Tham số | Ý nghĩa | Đơn vị | Cần cho |
| --- | --- | --- | --- |
| `e` | Mô đun đàn hồi $E$ | Pa | luôn cần |
| `g` | Mô đun trượt $G$ | Pa | luôn cần, trừ khi `k` rất lớn (không có biến dạng trượt) |
| `alpha` | Hệ số dãn dài do nhiệt $\alpha$ | 1/K | tải nhiệt độ |
| `d` | Khối lượng riêng $\rho$ | kg/m³ | không dùng trong phân tích tĩnh |

Tham số bạn bỏ qua sẽ nhận giá trị **1**, không phải một giá trị điển hình, và không có cảnh báo nào. Nếu quên `g` ở dầm của trang Bắt đầu, độ võng sẽ lên tới 22 700 km.

## Tiết diện {#cross-section}

| Tham số | Ý nghĩa | Đơn vị | Cần cho |
| --- | --- | --- | --- |
| `a` | Diện tích $A$ | m² | luôn cần: độ cứng dọc trục và độ cứng chống cắt |
| `iy` | Mô men quán tính $I_y$ | m⁴ | luôn cần: độ cứng chống uốn |
| `k` | Hệ số hiệu chỉnh cắt $k$ | – | luôn cần: độ cứng chống cắt $kGA$ |
| `h` | Chiều cao $h$ | m | chênh lệch nhiệt độ |
| `iz`, `dyz`, `j` | $I_z$, $I_{yz}$, hằng số xoắn | m⁴ | không dùng trong mô hình phẳng |

Tiết diện không có giá trị mặc định. Thiếu `a`, `iy` hoặc `k` thì mọi kết quả đều là `NaN`; thiếu `h` thì tải chênh lệch nhiệt độ cho `NaN`. Cả hai trường hợp đều không báo lỗi, nên kết quả `NaN` gần như luôn có nghĩa là thiếu tham số.

## Biến dạng trượt {#shear-deformation}

Thanh là dầm Timoshenko: ngoài biến dạng uốn, nó còn có biến dạng trượt. Mức độ ảnh hưởng phụ thuộc vào

$$
\Phi = \frac{12\,EI_y}{k\,G\,A\,L^2},
$$

giá trị mà `beam.computeShearFactor()` trả về. Với thanh mảnh, $\Phi$ rất nhỏ, và độ võng chỉ tăng chưa tới một phần trăm. Với thanh ngắn và cao, ảnh hưởng này đáng kể.

Để có dầm Euler–Bernoulli như trong các bảng tra của giáo trình, hãy làm cho độ cứng chống cắt gần như vô hạn bằng một hệ số hiệu chỉnh cắt rất lớn, giống như các ví dụ của ứng dụng EduBeam:

```ts
domain.createCrossSection('IPE200-EB', { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
```

Các ví dụ hoàn chỉnh trên những trang này đều làm vậy, nên số liệu của chúng khớp chính xác với công thức. Nếu muốn dùng hệ số hiệu chỉnh cắt thực, $k = 5/6$ phù hợp với tiết diện chữ nhật. Trang [Kiểm tra kết quả bằng tính tay](/vi/guide/verification#shear-deformation) cho thấy ảnh hưởng này lớn đến đâu.

## Cứng tuyệt đối theo phương dọc trục {#rigid-in-axial-direction}

Diện tích lớn làm thanh gần như không dãn dài, đúng như giả thiết thường dùng khi tính tay. Nội lực của khung chỉ phụ thuộc rất ít vào diện tích; còn chuyển vị của dàn thì phụ thuộc hoàn toàn vào nó. Nội lực của kết cấu tĩnh định không phụ thuộc vào bất kỳ độ cứng nào.

## Thay đổi sau này {#change-them-later}

```ts
domain.getMaterial('steel').change({ e: 200e9 })
domain.getCS('IPE200').change({ iy: 2000e-8 })
solver.solve()
```

Mỗi thanh đọc vật liệu và tiết diện của mình khi bộ giải ghép ma trận, nên chỉ cần gọi lại `solve()`. Các thanh khác nhau có thể dùng tiết diện khác nhau: hãy đặt cho mỗi tiết diện một nhãn riêng.
