---
title: Script và máy chủ
description: "Dùng @edubeam/fem từ Node: phiếu bài tập kèm đáp án, đường ảnh hưởng ghi ra tệp CSV, và một endpoint HTTP nhỏ giải dầm theo yêu cầu."
order: 15
source: site
---

# Script và máy chủ {#scripts-and-servers}

Bộ giải không cần trình duyệt. Trong Node, nó có thể soạn đáp án, chạy khảo sát tham số, lập bảng cho bảng tính, hay trả lời yêu cầu từ một trang web.

Các ví dụ viết bằng TypeScript. Node 22.18 trở lên chạy thẳng tệp `.ts` (`node answers.ts`), trong thư mục đã chuẩn bị như ở mục [Cài đặt](/vi/solver/getting-started#install); với Node cũ hơn, hãy bỏ các chú thích kiểu và lưu thành `.mjs`.

## Phiếu bài tập kèm đáp án {#answer-key}

Hai mươi biến thể của cùng một bài tập, dầm đơn giản chịu tải phân bố và lực tập trung, mỗi biến thể kèm phản lực và mô men lớn nhất, ghi ra một tệp CSV. Số liệu được suy ra từ số thứ tự của bài, nên cùng một script luôn tạo ra cùng một phiếu:

```ts [answers.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Bài i: dầm đơn giản chịu q kN/m và lực F kN cách A một đoạn a m. */
const exercise = (i: number) => {
  const L = 4 + (i % 4) // từ 4 đến 7 m
  const q = 5 + 5 * (i % 3) // 5, 10 hoặc 15 kN/m
  const F = 10 + 10 * (i % 2) // 10 hoặc 20 kN
  const a = L / 4 + (i % 3) // một điểm nào đó trong nhịp
  return { L, q, F, a }
}

const solve = ({ L, q, F, a }: ReturnType<typeof exercise>) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  solver.solve()

  // Phản lực chính là lực cắt ở hai đầu: V(0) tại A, -V(L) tại B
  const rA = beam.computeShearForceAt(lc, 0) / 1e3
  const rB = -beam.computeShearForceAt(lc, L) / 1e3
  // Mô men lớn nhất, lấy từ các điểm cách nhau 1 cm
  const { x, M } = beam.computeBendingMoment(lc, L * 100)
  const top = M.indexOf(Math.max(...M))
  return [rA, rB, M[top] / 1e3, x[top]].map((v) => v.toFixed(2))
}

const rows = ['no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m']
for (let i = 1; i <= 20; i++) {
  const ex = exercise(i)
  rows.push([i, ex.L, ex.q, ex.F, ex.a, ...solve(ex)].join(','))
}
writeFileSync('answers.csv', rows.join('\n') + '\n')
```

```text [answers.csv]
no,L_m,q_kN_m,F_kN,a_m,RA_kN,RB_kN,Mmax_kNm,at_m
1,5,10,20,2.25,36.00,34.00,55.69,2.25
2,6,15,10,3.5,49.17,50.83,80.58,3.28
3,7,5,20,1.75,32.50,22.50,50.63,2.50
...
```

Kiểm tra bài đầu tiên bằng tính tay: $R_B = (10 \cdot 5 \cdot 2{,}5 + 20 \cdot 2{,}25)/5 = 34$ kN, $R_A = 70 - 34 = 36$ kN, và lực cắt đổi dấu dưới lực tập trung, nên mô men lớn nhất nằm ở đó: $36 \cdot 2{,}25 - 10 \cdot 2{,}25^2/2 = 55{,}69$ kNm.

Hai lựa chọn giúp script ngắn gọn. Với dầm đơn giản, phản lực chính là lực cắt ở hai đầu, nên không cần [hàm phụ đọc phản lực](/vi/solver/results#reactions). Còn mô men lớn nhất lấy từ các điểm cách nhau 1 cm; ở đây kết quả là chính xác, vì cực trị rơi đúng vào vị trí lực hoặc cách một điểm lưới chưa tới một centimet. Để vẽ từng bài, có hoặc không kèm đáp số, xem [Bài tập và đề thi](/vi/plot/exercises) của @edubeam/plot; thư viện này còn in được cả một đề thi.

## Đường ảnh hưởng dạng CSV {#an-influence-line-as-csv}

Mô men tại gối giữa của dầm hai nhịp thay đổi thế nào khi một lực 1 kN chạy qua dầm? Hãy dựng và giải dầm một lần cho mỗi vị trí của lực, rồi ghi một dòng cho mỗi lần:

```ts [influence.ts]
import { writeFileSync } from 'node:fs'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Hai nhịp 5 m, lực 1 kN cách A `at` m: mô men tại gối giữa */
const momentAtB = (at: number): number => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [5, 0, 0], [DofID.Dz])
  domain.createNode('C', [10, 0, 0], [DofID.Dz])
  const span1 = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  domain.createBeam2D(2, ['B', 'C'], 1, 1)
  const [member, x] = at <= 5 ? [1, at] : [2, at - 5]
  solver.loadCases[0].createBeamConcentratedLoad(member, [0, 1e3, 0, x], true)
  solver.solve()
  return span1.computeBendingMomentAt(solver.loadCases[0], 5)
}

const rows = ['x_m,MB_kNm_per_kN']
for (let at = 0; at <= 10; at += 0.5) {
  rows.push(`${at},${(momentAtB(at) / 1e3).toFixed(4)}`)
}
writeFileSync('influence.csv', rows.join('\n') + '\n')
```

```bash
node influence.ts
```

```text [influence.csv]
x_m,MB_kNm_per_kN
0,0.0000
0.5,-0.1237
1,-0.2400
1.5,-0.3412
2,-0.4200
2.5,-0.4688
3,-0.4800
...
```

Công thức giải tích cho hai nhịp bằng nhau là $M_B = -P\,a\,(L^2 - a^2)/4L^2$: $-0{,}46875$ kNm tại $a = 2{,}5$ m, và vị trí bất lợi nhất là $a = L/\sqrt{3} = 2{,}887$ m. Đường ảnh hưởng đối xứng, nên 21 dòng kết thúc giống như lúc bắt đầu, bằng 0 tại gối C.

Tạo bộ giải mới cho mỗi vị trí đơn giản hơn sửa một bộ giải có sẵn, và chỉ tốn vài mili giây. Nếu muốn sửa một mô hình đã giải, xem [Giải lại sau khi thay đổi](/vi/solver/solving#solving-again-after-a-change).

## Bộ giải phía sau một endpoint HTTP {#a-solver-behind-an-http-endpoint}

Một máy chủ nhỏ, chỉ dùng module `http` có sẵn của Node, giải dầm đơn giản với nhịp và tải trọng bất kỳ được gửi đến:

```ts [server.ts]
import { createServer } from 'node:http'
import { DofID, LinearStaticSolver } from '@edubeam/fem'

/** Dầm đơn giản IPE 200, nhịp `span` m, tải `q` kN/m: M và độ võng giữa nhịp */
const solveBeam = (span: number, q: number) => {
  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [span, 0, 0], [DofID.Dz])
  const beam = domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  solver.solve()
  return {
    momentKNm: beam.computeBendingMomentAt(lc, span / 2) / 1e3,
    deflectionMm: beam.computeLocalDefl(lc, 2).w[1] * 1e3,
  }
}

createServer(async (req, res) => {
  try {
    let body = ''
    for await (const chunk of req) body += chunk
    const { span, q } = JSON.parse(body) as { span?: unknown; q?: unknown }
    if (typeof span !== 'number' || !(span > 0) || typeof q !== 'number') {
      throw new Error('Bad input')
    }
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(solveBeam(span, q)) + '\n')
  } catch {
    // JSON sai, số liệu sai hoặc mô hình không giải được: máy chủ vẫn chạy tiếp
    res.writeHead(400).end('Send {"span": metres, "q": kN/m}\n')
  }
}).listen(3000)
```

```bash
node server.ts &
curl -s localhost:3000 -d '{"span": 6, "q": 12}'
# {"momentKNm":54,"deflectionMm":49.62870377178149}
```

$qL^2/8 = 54$ kNm và $5qL^4/384EI = 49{,}63$ mm. Khối `try` rất quan trọng: JSON không hợp lệ sẽ ném lỗi, một mô hình mà bộ giải không giải được cũng có thể ném lỗi, và không lỗi nào được phép làm sập máy chủ. Một dịch vụ công khai còn nên giới hạn kích thước yêu cầu và chiều dài nhịp.

## Trong trình duyệt {#in-the-browser}

Cùng đoạn mã đó chạy nguyên vẹn trong một trang web, giải ngay trên thiết bị của người đọc: mọi hình trực tiếp trên trang web này đều hoạt động như vậy. Hãy import gói qua bundler của bạn, chẳng hạn Vite hay Nuxt, và [vẽ kết quả](/vi/solver/drawing) bằng @edubeam/plot. Mỗi mô hình giải trong vài mili giây, nên trang có thể giải lại sau mỗi lần người dùng nhập liệu.
