---
title: Bài tập và đề thi
description: "Tạo cho mỗi sinh viên một bài tập Cơ học kết cấu khác nhau từ một seed với @edubeam/fem và @edubeam/plot, đáp án luôn đúng, trên web, đề thi in hoặc hình SVG cho LaTeX và Word."
order: 5
group: Cách dùng
source: site
---

# Bài tập và đề thi

Viết kết cấu một lần dưới dạng hàm của một seed (giá trị khởi tạo bộ sinh số ngẫu nhiên), và bạn có bài tập cho mọi sinh viên, mọi tuần, bài nào cũng kèm đáp án luôn đúng: @edubeam/fem giải bài, còn @edubeam/plot vẽ cả đề bài lẫn đáp án từ cùng một mô hình.

Nhấn **Bài tập mới** bên dưới. Mỗi lần nhấn là một seed mới; bài tập được tạo, giải và vẽ ngay trong trình duyệt của bạn.

::exercise-generator
::

Bản demo dùng chính các bài toán của hai trang khác trên trang web này, cả hai đều được xây từ những phần mô tả dưới đây: trang [Luyện tập](/vi/practice), nơi sinh viên nhập phản lực và mô men uốn hay lực dọc thanh dàn lớn nhất rồi được kiểm tra ngay, và [Trình tạo đề thi](/vi/exam), công cụ in cho mỗi sinh viên một mã đề riêng kèm đáp án, lưu hình thành tệp SVG và đáp số thành CSV. Hãy thử chúng trước khi tự viết.

## Cách hoạt động {#how-it-works}

1. **Seed chọn các con số.** Với cùng một seed, bộ sinh số ngẫu nhiên luôn cho cùng một bài tập, nên seed in trên đề bài giúp tìm lại đúng đáp án của nó.
2. **Bộ giải tính đáp án.** @edubeam/fem giải từng kết cấu, nên phản lực và mô men đến từ bộ giải, chứ không từ một công thức mà bạn có thể viết nhầm.
3. **@edubeam/plot vẽ cả hai.** Đề bài cho kết cấu với nhãn nút, kích thước và các phản lực chưa biết được gọi tên; đáp án ghi giá trị của phản lực và vẽ thêm biểu đồ.

Từ đây đến một đề thi in sẵn chỉ cần vài tệp ngắn: [bộ sinh bài tập](#the-generator), [một component](#the-exercise-in-a-page) cho trang web, và [một script](#print-a-test) in đề thi hoặc [ghi hình](#figures-for-latex-and-word) cho LaTeX và Word. Chép chúng vào một dự án đã [cài đặt các thư viện](/vi/plot/getting-started#install); các script chạy bằng `node` từ phiên bản 22.18, hoặc bằng `npx tsx` với phiên bản cũ hơn.

## Bộ sinh bài tập {#the-generator}

Một module duy nhất, `exercise.ts`, biến một seed thành một bài tập: dầm trên một gối cố định và một gối di động, một nửa số lần có thêm đầu thừa với lực tập trung ở mút. Cả hai dạng đều tĩnh định, nên seed nào cũng giải được bằng tính tay cũng như bằng bộ giải.

```ts [exercise.ts]
import { DofID, LinearStaticSolver } from '@edubeam/fem'
import { extremes, modelFromSolver, type PlotModel } from '@edubeam/plot'

export interface Exercise {
  readonly seed: number
  readonly statement: string
  /** Kết cấu đã giải, dưới dạng dữ liệu thuần: vẽ được cả đề bài lẫn đáp án */
  readonly model: PlotModel
  /** Phản lực gối tựa, dương khi hướng lên, N, và các mô men uốn cực trị, N·m */
  readonly key: { RA: number; RB: number; mMax: number; mMin: number }
}

/** mulberry32: bộ sinh số nhỏ có seed, để mỗi seed luôn ứng với đúng một bài tập */
const random = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export const makeExercise = (seed: number): Exercise => {
  const r = random(seed)
  const pick = <T>(xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]
  const int = (lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

  // Một nhịp trên gối cố định và gối di động, một nửa số lần có đầu thừa: tĩnh định, nên luôn giải được
  const L = pick([4, 5, 6]) // m
  const c = pick([0, 0, 1, 1.5, 2]) // m, chiều dài đầu thừa
  const q = int(4, 12) // kN/m trên nhịp
  const F = int(2, 6) * 5 // kN ở mút đầu thừa, hoặc cách A một đoạn `a` khi không có đầu thừa
  const a = int(1, L - 1) // m

  const solver = new LinearStaticSolver()
  const { domain } = solver
  domain.createMaterial(1, { e: 210e9, g: 81e9 })
  domain.createCrossSection(1, { a: 28.5e-4, iy: 1943e-8, h: 0.2, k: 1e32 })
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz])
  domain.createNode('B', [L, 0, 0], [DofID.Dz])
  domain.createBeam2D(1, ['A', 'B'], 1, 1)
  const lc = solver.loadCases[0]
  lc.createBeamElementUniformEdgeLoad(1, [0, q * 1e3], true)
  if (c > 0) {
    domain.createNode('C', [L + c, 0, 0])
    domain.createBeam2D(2, ['B', 'C'], 1, 1)
    lc.createNodalLoad('C', { [DofID.Dz]: F * 1e3 })
  } else {
    lc.createBeamConcentratedLoad(1, [0, F * 1e3, 0, a], true)
  }
  solver.solve()

  const statement =
    c > 0
      ? `Span L = ${L} m with an overhang c = ${c} m. q = ${q} kN/m on the span, F = ${F} kN at the tip C.`
      : `Span L = ${L} m. q = ${q} kN/m over the span, F = ${F} kN at ${a} m from A.`

  // Đáp án từ mô hình đã giải: phản lực (z hướng xuống, nên hướng lên mang dấu trừ) và cực trị chính xác của M
  const model = modelFromSolver(solver)
  const { reactions, members } = model.results!
  const up = (node: string) => -(reactions.find((x) => x.node === node && x.dof === 'dz')?.value ?? 0)
  const m = Object.values(members).flatMap((member) => extremes(member.M) ?? [])
  const mMax = Math.max(...m.map((e) => e.max.value))
  const mMin = Math.min(...m.map((e) => e.min.value))

  return { seed, statement, model, key: { RA: up('A'), RB: up('B'), mMax, mMin } }
}
```

`modelFromSolver` đọc kết cấu đã giải thành một [mô hình vẽ](/vi/plot/model): dữ liệu thuần chứa phản lực và kết quả của mọi thanh dưới dạng đa thức chính xác, nên `extremes` tìm được mô men lớn nhất mà không cần lấy mẫu. Bài tập chỉ giữ lại mô hình đó; không cần đến bộ giải nữa.

Seed 5 cho đề bài *“Span L = 6 m with an overhang c = 1.5 m. q = 5 kN/m on the span, F = 25 kN at the tip C.”* Đáp án: $R_A = (5 \cdot 6 \cdot 3 - 25 \cdot 1{,}5)/6 = 8{,}75$ kN, $R_B = 5 \cdot 6 + 25 - 8{,}75 = 46{,}25$ kN, trên gối $M_B = -25 \cdot 1{,}5 = -37{,}5$ kNm, và trong nhịp, tại điểm lực cắt bằng 0, $M = 8{,}75^2/(2 \cdot 5) = 7{,}66$ kNm. Bộ giải cho kết quả trùng đến chữ số cuối cùng.

## Trên trang web {#the-exercise-in-a-page}

Component `ExerciseCard.vue` vẽ đề bài, hoặc với `answers` thì vẽ đáp án:

```vue [ExerciseCard.vue]
<script setup lang="ts">
import { computed } from 'vue'
import { formatQuantity, KN_UNITS, StructurePlot, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise'

const props = defineProps<{ seed: number; answers?: boolean }>()
const exercise = computed(() => makeExercise(props.seed))

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const twoDecimals = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
const kN = (si: number) => formatQuantity(si, KN_UNITS.force, twoDecimals)
const kNm = (si: number) => formatQuantity(si, KN_UNITS.moment, twoDecimals)
</script>

<template>
  <article>
    <h3>Exercise {{ seed }}</h3>
    <p>{{ exercise.statement }} Find the reactions and draw the bending moment diagram.</p>
    <StructurePlot
      :model="exercise.model"
      :layers="answers ? key : sheet"
      :reserve="[...sheet, ...key]"
      :reaction-labels="answers ? 'values' : 'names'"
      :reserve-reaction-labels="['names', 'values']"
    />
    <p v-if="answers">
      R<sub>A</sub> = {{ kN(exercise.key.RA) }}, R<sub>B</sub> = {{ kN(exercise.key.RB) }},
      M from {{ kNm(exercise.key.mMin) }} to {{ kNm(exercise.key.mMax) }}
    </p>
  </article>
</template>
```

```vue
<ExerciseCard :seed="5" />
<ExerciseCard :seed="5" answers />
```

Thẻ thứ hai kết thúc bằng dòng *R<sub>A</sub> = 8.75 kN, R<sub>B</sub> = 46.25 kN, M from −37.5 kNm to 7.66 kNm*. `formatQuantity` ghi kèm đơn vị và dấu trừ thật, giống như hình vẽ. Dấu chấm thập phân là do định dạng `'en'`; với `new Intl.NumberFormat('vi', …)` bạn sẽ có dấu phẩy thập phân.

Trên đề bài, `reaction-labels="names"` vẽ các phản lực thành ẩn số: một mũi tên cho mỗi phương mà gối tựa chặn, chỉ theo chiều được quy ước là dương (sang phải, hướng lên, ngược chiều kim đồng hồ), mang tên *A<sub>x</sub>*, *A<sub>z</sub>*, *M<sub>A</sub>* thay cho độ lớn. Như vậy dấu của mọi đáp số được xác định ngay trên hình: phản lực tác dụng theo chiều ngược lại mang dấu âm. Đáp án thì ghi giá trị.

`reserve` bố trí sẵn các lớp của cả hai chế độ ngay từ đầu, nên khi bật `answers`, chẳng hạn bằng một nút bấm *Xem đáp án* cho sinh viên tự học, biểu đồ hiện dần đúng chỗ của nó ([Hình hiện dần](/vi/plot/structure-plot#figures-that-build-up)). `reserve-reaction-labels` làm điều tương tự cho phản lực, nên dầm đứng yên trong khi tên phản lực chuyển thành giá trị: xem [Phản lực là ẩn số](/vi/plot/structure-plot#reactions-as-unknowns).

## In đề thi {#print-a-test}

Với bài thi viết trên giấy, script Node `print-test.ts` ghi mỗi sinh viên một trang, tiếp theo là các trang đáp án. `structureSvg` biến mỗi mô hình thành văn bản SVG, nên script không cần Vue hay trình duyệt:

```ts [print-test.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const students = ['Ada', 'Ben', 'Cleo']
const exercises = students.map((_, i) => makeExercise(1000 + i)) // seed 1000, 1001, …

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']
const task = 'Find the reactions and draw the bending moment diagram.'

const pages = [
  ...exercises.map((e, i) => `<h2>${students[i]}, exercise ${e.seed}</h2>
    <p>${e.statement} ${task}</p>${structureSvg(e.model, { layers: sheet, reactionLabels: 'names' })}`),
  ...exercises.map((e) => `<h2>Key, exercise ${e.seed}</h2>
    ${structureSvg(e.model, { layers: key })}`),
]

const style = `body { font: 15px/1.5 system-ui, sans-serif; max-width: 640px; margin: 2rem auto }
  section { break-after: page }`
writeFileSync('test.html', `<!doctype html><meta charset="utf-8"><title>Test</title>
  <style>${style}</style>${pages.map((page) => `<section>${page}</section>`).join('\n')}`)
```

```bash
node print-test.ts
```

Mở `test.html` trong trình duyệt rồi in, hoặc lưu thành PDF: bài tập của mỗi sinh viên và mỗi đáp án nằm trên một trang riêng. Trang của Ada và trang đáp án tương ứng:

![Bài tập 1000: nhịp 6 m với đầu thừa 2 m, 10 kN/m trên nhịp và 30 kN ở mút đầu thừa, các phản lực chưa biết mang tên A_x, A_z và B_z, kích thước nối tiếp 6 m và 2 m, tổng 8 m; bên dưới là đáp án với phản lực 20 và 70 và mô men uốn từ −60 trên gối đến 20 trong nhịp](/screenshots/vi/p2p-plot-exercise-sheet.webp){.shot-lg}

Lớp `dimensions` ghi mọi nhịp và chiều dài tổng, như một phiếu bài tập vẫn ghi, còn `reactionLabels: 'names'` gọi tên các ẩn số, mỗi mũi tên chỉ theo chiều mà đáp số của nó được tính là dương. Trong đáp án, phản lực và giá trị trên biểu đồ chỉ ghi số, không kèm đơn vị, theo kN và kNm, như trong ứng dụng EduBeam: nếu sinh viên cần được nhắc, hãy ghi rõ điều đó ở tiêu đề đáp án. Với máy photocopy đen trắng, truyền `colors` với mọi tông màu đặt thành đen: xem [Đen trắng](/vi/plot/theming#black-and-white).

## Hình cho LaTeX và Word {#figures-for-latex-and-word}

Nếu bạn soạn đề bằng LaTeX hay Word, hãy ghi hình thành tệp và giữ nguyên mẫu đề của mình. `figures.ts` ghi đề bài và đáp án cho 30 seed:

```ts [figures.ts]
import { writeFileSync } from 'node:fs'
import { structureSvg, type PlotLayer } from '@edubeam/plot'
import { makeExercise } from './exercise.ts'

const sheet: PlotLayer[] = ['members', 'supports', 'loads', 'reactions', 'nodeLabels', 'dimensions']
const key: PlotLayer[] = ['members', 'supports', 'reactions', 'M']

for (let seed = 1000; seed < 1030; seed++) {
  const { model } = makeExercise(seed)
  writeFileSync(`exercise-${seed}.svg`, structureSvg(model, { layers: sheet, reactionLabels: 'names' }))
  writeFileSync(`exercise-${seed}-key.svg`, structureSvg(model, { layers: key }))
}
```

Chạy bằng `node figures.ts`: được 60 tệp cho 30 sinh viên, mỗi tệp là một SVG thuần với màu cố định, không có CSS và không có script.

- **Word** (2019 và Microsoft 365) chèn thẳng tệp SVG: *Insert › Pictures*.
- **LaTeX** chèn PDF chứ không chèn SVG. Chuyển đổi một lần bằng [CairoSVG](https://cairosvg.org) (`cairosvg exercise-1000.svg -o exercise-1000.pdf`) hoặc Inkscape, rồi dùng `\includegraphics[width=\linewidth]{exercise-1000.pdf}`. Nếu máy có cài Inkscape, lệnh `\includesvg` của gói `svg` sẽ tự chuyển đổi giúp bạn.

Một hình rộng 640 đơn vị với chữ cao 13 đơn vị, nên khi đặt vừa chiều rộng cột chữ của trang A4, khoảng 16 cm, nhãn có cỡ 9 pt. Đặt `fontFamily` thành phông mà tài liệu của bạn đang dùng: mọi tùy chọn có ở mục [Tệp SVG độc lập](/vi/plot/functions#a-standalone-svg-file).

## Tùy biến theo ý bạn {#make-it-your-own}

- **Thêm dạng kết cấu.** Thêm các trường hợp: dầm công xôn, dầm liên tục hai nhịp, khung cổng, dàn. Bản demo ở đầu trang chọn trong tám dạng, từ dầm đơn giản đến khung ba khớp, dàn Warren và khung cổng.
- **Bài tập siêu tĩnh.** Bộ giải xử lý chúng dễ dàng như hệ tĩnh định; chỉ có lời giải tính tay là dài hơn.
- **Số tròn.** Lấy tải trọng và chiều dài từ những danh sách ngắn, như ở trên, để đáp án tròn như bạn muốn. Duyệt qua vài trăm seed và bỏ những seed có đáp án nhiều chữ số thập phân hơn mức bạn muốn.
- **Đề phòng hệ biến hình.** Bộ sinh bài tập nào có thể đặt gối tựa không hợp lý thì nên giải bên trong một khối `try` và bỏ qua những seed gây lỗi: xem [Khi giải thất bại](/vi/solver/solving#when-solving-fails).
- **Yêu cầu tính thêm.** Vẽ lực cắt (`'V'`), độ võng (`'w'`, với giá trị lấy từ [`getUnknowns`](/vi/solver/results#displacements)), hoặc lực dọc trong một thanh xiên.
