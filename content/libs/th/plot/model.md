---
title: โมเดลสำหรับวาดภาพ
description: "PlotModel ข้อมูลธรรมดาที่แปลงเป็น JSON ได้ ซึ่ง modelFromSolver สร้างจากโมเดล @edubeam/fem ที่คำนวณแล้ว ผลลัพธ์แบบพหุนามแบ่งช่วง ค่าแม่นตรงและค่าสุดขีด"
order: 9
source: site
---

# โมเดลสำหรับวาดภาพ

ทุกอย่างที่ @edubeam/plot วาดมาจาก `PlotModel` ซึ่งเป็นข้อมูลธรรมดาที่ `modelFromSolver` อ่านออกมาจากโมเดล @edubeam/fem ที่คำนวณแล้ว ข้างในมีรูปทรงของโครงสร้าง จุดรองรับ แรงกระทำ แรงปฏิกิริยา และผลลัพธ์ของชิ้นส่วนแต่ละชิ้นในรูปพหุนามที่แม่นตรง โมเดลนี้แปลงเป็น JSON ได้ จึงสร้างไว้ตอน build แล้วส่งไปแทนตัวคำนวณได้ และยังเป็นวิธีที่ง่ายที่สุดในการอ่านค่าแม่นตรงและค่าสุดขีดของโครงสร้างที่คำนวณแล้ว

```ts
import { modelFromSolver } from '@edubeam/plot'

const model = modelFromSolver(solver) // หรือ modelFromSolver(solver, { loadCase: 1 })
```

`results` มีอยู่เฉพาะเมื่อกรณีแรงกระทำนั้นคำนวณแล้ว ถ้าไม่มี คอมโพเนนต์จะวาดเฉพาะตัวโมเดล และเมื่อใช้ [`reactionLabels: 'names'`](/th/plot/structure-plot#reactions-as-unknowns) ก็ยังวาดแรงปฏิกิริยาที่ไม่ทราบค่าได้ โมเดลที่ยังไม่ได้คำนวณจึงใช้เป็นโจทย์แบบฝึกหัดได้

## รูปแบบข้อมูล {#the-format}

ทุกค่าใช้หน่วย SI (m, N, N·m, N/m, K, rad) และแกนของตัวคำนวณ: x ชี้ไปทางขวา z ชี้ลง และการหมุนเป็นบวกในทิศทวนเข็มนาฬิกาบนหน้าจอ

```ts
interface PlotModel {
  readonly nodes: readonly PlotNode[]
  readonly members: readonly PlotMember[]
  readonly loads: readonly PlotLoad[]
  readonly results?: PlotResults // เฉพาะกรณีแรงกระทำที่คำนวณแล้ว
}

interface PlotNode {
  readonly id: string
  readonly x: number
  readonly z: number
  readonly fixity: { readonly dx: boolean; readonly dz: boolean; readonly ry: boolean } // องศาความเป็นอิสระที่รองรับ
  readonly angle: number // มุมที่แกนของจุดรองรับแบบเอียงหมุนไป, rad, ตามเข็มนาฬิกาบนหน้าจอ
}

interface PlotMember {
  readonly id: string
  readonly start: string // id ของโหนด
  readonly end: string
  readonly hinges: readonly [boolean, boolean]
}

interface PlotResults {
  readonly members: Readonly<Record<string, MemberResults>> // ตาม id ของชิ้นส่วน
  readonly reactions: readonly PlotReaction[]
}

interface MemberResults {
  readonly N: Piecewise // แรงตามแนวแกน แรงดึงเป็นบวก
  readonly V: Piecewise // แรงเฉือน
  readonly M: Piecewise // โมเมนต์ดัด เป็นบวกเมื่อด้าน +z ท้องถิ่นรับแรงดึง
  readonly u: Piecewise // การกระจัดตามแกน x ท้องถิ่น
  readonly w: Piecewise // การกระจัดตามแกน z ท้องถิ่น
}

interface PlotReaction {
  readonly node: string
  readonly dof: 'dx' | 'dz' | 'ry'
  readonly value: number // แรงที่กระทำต่อโครงสร้างตามแกนของโหนด, N (N·m สำหรับ ry)
}
```

แรงกระทำมีเจ็ดชนิด แยกกันด้วยฟิลด์ `kind`

| `kind` | ฟิลด์ | ความหมาย |
| --- | --- | --- |
| `'nodalForce'` | `node`, `fx`, `fz` | แรงที่โหนด องค์ประกอบตามแกนรวม, N |
| `'nodalMoment'` | `node`, `my` | โมเมนต์ที่โหนด, N·m |
| `'distributed'` | `member`, `start`, `end`, `local` | แรงแผ่กระจายตามแนวเส้นที่แปรผันเชิงเส้น `{ fx, fz }` ที่แต่ละปลาย, N/m ถ้าสองปลายเท่ากันคือแรงแผ่กระจายสม่ำเสมอ |
| `'pointForce'` | `member`, `at`, `fx`, `fz`, `local` | แรงที่ห่างจากจุดเริ่มของชิ้นส่วน `at` เมตร |
| `'pointMoment'` | `member`, `at`, `my` | โมเมนต์แบบจุดบนชิ้นส่วน |
| `'temperature'` | `member`, `uniform`, `gradient` | K: การเปลี่ยนแปลงอุณหภูมิที่เซนทรอยด์ และอุณหภูมิด้านล่างลบด้านบน |
| `'prescribed'` | `node`, `dx?`, `dz?`, `ry?` | การกระจัดของจุดรองรับตามแกนของโหนด, m และ rad |

`local` เป็น `true` เมื่อองค์ประกอบของแรงอยู่ตามแกน x และ z ท้องถิ่นของชิ้นส่วนแทนแกนรวม

## พหุนามแบบแบ่งช่วง {#piecewise-polynomials}

ผลลัพธ์ของชิ้นส่วนเป็น `Piecewise` คือรายการของช่วงย่อย (piece) แต่ละช่วงย่อยเป็นพหุนามบนส่วนหนึ่งของชิ้นส่วน ช่วงย่อยใหม่เริ่มทุกตำแหน่งที่แรงกระทำเป็นจุดหรือโมเมนต์แบบจุดทำให้ผลลัพธ์หักมุมหรือกระโดด

```ts
interface Piece {
  readonly x0: number // m จากจุดเริ่มของชิ้นส่วน
  readonly x1: number
  readonly c: readonly number[] // ค่า = Σ c[k]·sᵏ โดย s = (x − x0)/(x1 − x0)
}
type Piecewise = readonly Piece[]
```

N, V และ M เป็นพหุนามดีกรีไม่เกินสาม และการโก่งตัวดีกรีไม่เกินห้า สัมประสิทธิ์เพียงไม่กี่ตัวจึงเก็บคำตอบของตัวคำนวณได้แม่นตรง แรงเฉือนของคานยาว 6 m ที่รับแรง 20 kN ที่ระยะ 2 m ประกอบด้วยช่วงย่อยค่าคงที่สองช่วง

```json
[{ "x0": 0, "x1": 2, "c": [13333.33] }, { "x0": 2, "x1": 6, "c": [-6666.67] }]
```

## อ่านค่าเอง {#reading-values-yourself}

ฟังก์ชันที่วาดแผนภาพใช้อ่านค่าได้ด้วย ได้ค่าแม่นตรง ไม่ได้ประมาณจากค่าที่จุดตัวอย่าง

```ts
import { extremes, innerBreaks, modelFromSolver, valueAt } from '@edubeam/plot'

// ช่วงเดียว 6 m รองรับธรรมดา แรง 20 kN ห่างจาก A 2 m หน้าตัด IPE 200 ไม่เสียรูปจากแรงเฉือน
const model = modelFromSolver(solver)
const { V, M, w } = model.results!.members['1']

innerBreaks(V) // [2]: ช่วงย่อยมาบรรจบกันที่แรงกระทำ
valueAt(V, 2, 'left') // 13333.3 N ก่อนถึงแรงกระทำเล็กน้อย
valueAt(V, 2, 'right') // -6666.7 N เลยแรงกระทำไปเล็กน้อย
extremes(M) // ค่ามากสุด 26666.7 N·m ที่ x = 2
extremes(w) // ค่ามากสุด 0.018973 m ที่ x = 2.734
```

`extremes` คืนค่า `{ max, min }` ซึ่งแต่ละตัวเป็น `{ x, value, side }` หรือคืน `null` เมื่อรายการว่าง การโก่งตัวที่มากที่สุดไม่ได้อยู่ใต้แรงกระทำ แต่อยู่ที่ $x = L - \sqrt{(L^2 - a^2)/3} = 2.734$ m และมีค่า $P\,a\,(L^2 - a^2)^{3/2}/9\sqrt{3}\,EIL = 18.97$ mm ตรงกับสูตรของแรงกระทำเป็นจุดที่ไม่อยู่กึ่งกลางช่วง

[ตัวสร้างโจทย์](/th/plot/exercises#the-generator) ใช้วิธีนี้หาโมเมนต์สุดขีดสำหรับเฉลย ฟังก์ชันที่เหลือ ได้แก่ ความชัน ค่าสุดขีดภายในช่วงย่อย ดีกรี และเส้นโค้ง Bézier อยู่ในหน้า [ฟังก์ชัน](/th/plot/functions#piecewise-polynomials)

## ส่งเป็น JSON {#ship-it-as-json}

แค่ `JSON.stringify(model)` ก็พอ และ `JSON.parse` จะคืนโมเดลที่วาดออกมาเหมือนจากตัวคำนวณทุกประการ โครงข้อแข็งพอร์ทัลที่มีแรงแผ่กระจายและแรงกระทำเป็นจุดมีขนาดไม่ถึง 2 kB ดู [การฝังในหน้าเว็บ](/th/plot/embedding#ship-the-drawing-not-the-solver) โมเดลยังส่งให้ [`structureSvg`](/th/plot/functions#a-standalone-svg-file) เขียนออกมาเป็นไฟล์ SVG ได้ด้วย
