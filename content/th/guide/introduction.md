---
description: "EduBeam คือตัวคำนวณ FEM ฟรีบนเบราว์เซอร์สำหรับคาน โครงข้อแข็ง และโครงถัก 2 มิติ ทำอะไรได้และไม่ได้ เหมาะกับใคร คู่มือจัดอย่างไร และไลบรารีโอเพนซอร์สเบื้องหลัง"
source: site
---

# บทนำ

[EduBeam]{.edubeam} เป็นแอปวิเคราะห์โครงสร้างฟรีสำหรับ **คาน โครงข้อแข็ง และโครงถัก** ที่ทำงานบนเบราว์เซอร์ วาดโครงสร้าง ใส่จุดรองรับและแรงกระทำ แล้วตัวคำนวณไฟไนต์เอลิเมนต์จะคำนวณแผนภาพ แรงปฏิกิริยา และการโก่งตัวใหม่ทุกครั้งที่คุณแก้ไข ไม่มีปุ่ม *คำนวณ* ไม่ต้องติดตั้งอะไร และไม่ต้องสมัครบัญชี

::div{.actions}
[เปิด EduBeam ↗](https://run.edubeam.app/?lang=th){target="_blank"} [เริ่มต้นใช้งานด่วน 10 นาที](/th/guide/quick-start)
::

![โครงข้อแข็งสามจุดหมุนใน EduBeam: แรงกระทำสีส้ม แรงปฏิกิริยาสีม่วง โมเมนต์ดัดสีแดง และรูปร่างที่เสียรูปสีเทา](/screenshots/th/hero.webp)

:span{#your-first-visit}

## EduBeam ทำอะไรได้บ้าง {#what-it-does}

::card-grid{cols="2"}
:::card{title="โครงสร้าง" icon="lucide:triangle" to="/th/essentials/elements"}
คาน คานต่อเนื่อง โครงข้อแข็ง และโครงถักในระนาบ x–z ประกอบจากเอลิเมนต์คาน Timoshenko จุดหมุนที่ปลายทำให้ชิ้นส่วนกลายเป็นชิ้นส่วนโครงถัก
:::
:::card{title="จุดรองรับ" icon="lucide:anchor" to="/th/essentials/nodes-supports#supports"}
หมุด ล้อเลื่อน ยึดแน่น แบบเลื่อน หรือยึด `Dx`, `Dz` และ `Ry` ในรูปแบบใดก็ได้ เลือกจากสัญลักษณ์ได้เลย มีทั้งจุดรองรับแบบเอียงและการทรุดตัวของจุดรองรับ
:::
:::card{title="แรงกระทำ" icon="lucide:arrow-down-to-line" to="/th/essentials/loads"}
แรงและโมเมนต์ที่โหนดหรือที่ตำแหน่งใดก็ได้บนชิ้นส่วน แรงแผ่กระจายสม่ำเสมอและแรงแผ่กระจายรูปสี่เหลี่ยมคางหมู แรงกระทำเนื่องจากอุณหภูมิ และการกระจัดที่กำหนด
:::
:::card{title="หน้าตัด" icon="lucide:shapes" to="/th/essentials/elements#cross-sections"}
ไลบรารีหน้าตัดมาตรฐานยุโรปและสหรัฐฯ หรือรูปหลายเหลี่ยมใดก็ได้ที่วาดเอง EduBeam คำนวณ $A$, $I_y$, $I_z$, $I_{yz}$ แกนหลัก และรัศมีไจเรชันให้
:::
:::card{title="ผลลัพธ์" icon="lucide:chart-spline" to="/th/essentials/results"}
แผนภาพ **N**, **V** และ **M** รูปร่างที่เสียรูป แรงปฏิกิริยา การกระจัดที่โหนด แรงปลาย และเมทริกซ์ความแข็งของเอลิเมนต์
:::
:::card{title="การวิเคราะห์" icon="lucide:calculator" to="/th/elements/analysis"}
การวิเคราะห์สถิตเชิงเส้นที่แม่นตรงสำหรับโมเดลเชิงเส้น จึงไม่ต้องแบ่งเอลิเมนต์ให้ละเอียดขึ้น ถ้าโครงสร้างไม่มีเสถียรภาพ EduBeam จะอธิบายสาเหตุและแสดงภาพเคลื่อนไหวว่าโครงสร้างเคลื่อนที่ได้อย่างไร
:::
:::card{title="ไฟล์" icon="lucide:folder-open" to="/th/essentials/import-export"}
โปรเจกต์เป็น JSON ทั้งโมเดลเป็นลิงก์ ภาพวาดเป็น PNG หรือ SVG และผลลัพธ์เป็น CSV เมื่อเปิดโมเดลใหม่ทับ โมเดลเดิมยังเก็บไว้ให้ และไม่มีข้อมูลใดออกจากอุปกรณ์ของคุณ
:::
:::card{title="หน่วย" icon="lucide:ruler" to="/th/essentials/units-settings"}
สลับระหว่าง SI และระบบอเมริกันในคลิกเดียว หรือตั้งทีละหน่วย ใช้แกน z ชี้ลง หรือแกน y ชี้ขึ้นแบบในตำรา
:::
::

## สิ่งที่ยังทำไม่ได้ (ในตอนนี้) {#what-it-does-not-do-yet}

รู้ข้อจำกัดไว้ก่อนช่วยประหยัดเวลา:

::div{.limits}
- **2 มิติเท่านั้น** ไม่มีพฤติกรรมนอกระนาบ ไม่มีโครงข้อแข็ง 3 มิติ
- **สถิตเชิงเส้นเท่านั้น** ไม่มีผลลำดับที่สอง (P–Δ) การโก่งเดาะ พลศาสตร์ หรือพฤติกรรมพลาสติก
- **กรณีแรงกระทำเดียว** ไม่มีการจัดหมู่แรงกระทำ (load combination) หรือเส้นห่อหุ้ม (envelope) ให้บันทึกแต่ละกรณีเป็นไฟล์หรือลิงก์แยกกัน
- **ไม่คิดน้ำหนักตัวเอง** ให้ใส่เป็นแรงแผ่กระจายบนชิ้นส่วนแทน
- **ไม่มีการตรวจสอบการออกแบบ** EduBeam ให้แรงภายในและการกระจัด ส่วนการตรวจสอบตามมาตรฐานเป็นหน้าที่ของคุณ
::

ถ้าฟีเจอร์ที่ยังไม่มีสำคัญกับงานของคุณ [เปิด issue](https://github.com/janvorisek/edubeam/issues) ได้เลย

::elementarium-promo{placement="introduction"}
::

## เหมาะกับใคร? {#who-is-it-for}

::card-grid{cols="2"}
:::card{title="นักศึกษา" icon="lucide:graduation-cap" to="/th/practice"}
ตรวจผลการคำนวณมือได้ทันที และมีโจทย์ให้ฝึกทำที่ตรวจคำตอบให้ทีละข้อ
:::
:::card{title="ผู้สอน" icon="lucide:presentation" to="/th/guide/teaching"}
สาธิตสดบนโปรเจกเตอร์ว่าจุดรองรับ จุดหมุน และแรงกระทำเปลี่ยนแรงภายในอย่างไร ได้ใน 18 ภาษา และพิมพ์ข้อสอบคนละชุดให้นักศึกษาทุกคน
:::
:::card{title="วิศวกร" icon="lucide:hard-hat" to="/th/elements/analysis"}
ตรวจสอบคร่าว ๆ อย่างรวดเร็วก่อนเปิดโปรแกรมเดสก์ท็อปตัวใหญ่ และทุกขั้นตอนของการคำนวณมีเอกสารอธิบายไว้
:::
:::card{title="นักพัฒนา" icon="lucide:code-xml" to="#libraries"}
ตัวคำนวณและการวาดภาพเบื้องหลัง EduBeam ในรูปไลบรารีโอเพนซอร์สสำหรับโค้ดของคุณเอง
:::
::

## คู่มือนี้จัดอย่างไร {#how-this-guide-is-organised}

แถบด้านข้างจัดกลุ่มหน้าต่าง ๆ ตามด้านล่าง ปุ่ม **?** ในแอปจะเปิดหน้าที่ตรงกันของคู่มือนี้ในภาษาของคุณ

::card-grid{cols="2"}
:::card{title="เริ่มต้นใช้งาน" icon="lucide:flag" to="/th/guide/quick-start"}
หน้านี้ และเริ่มต้นใช้งานด่วน: คานแรกของคุณในสิบนาที
:::
:::card{title="การสร้างโมเดล" icon="lucide:pencil-ruler" to="/th/essentials/user-interface"}
ส่วนติดต่อผู้ใช้ โหนดและจุดรองรับ เอลิเมนต์ วัสดุและหน้าตัด แรงกระทำ หน่วยและการตั้งค่า
:::
:::card{title="การอ่านผลลัพธ์" icon="lucide:chart-spline" to="/th/essentials/results"}
แผนภาพและตารางผลลัพธ์ และวิธีตรวจสอบด้วยการคำนวณมือ
:::
:::card{title="แชร์และใช้สอน" icon="lucide:share-2" to="/th/essentials/import-export"}
ไฟล์โปรเจกต์ ลิงก์แชร์ การส่งออกรูปภาพและ CSV และการสอนด้วย EduBeam
:::
:::card{title="บทเรียน" icon="lucide:triangle" to="/th/tutorials/inclined-beam"}
คานเอียง โครงข้อแข็งสามจุดหมุน โครงถักในระนาบ และคานต่อเนื่องที่มีการทรุดตัวของจุดรองรับ แต่ละบทสร้างทีละขั้นและตรวจสอบด้วยการคำนวณมือ
:::
:::card{title="ตัวอย่าง" icon="lucide:library" to="/th/examples/"}
โมเดลสำเร็จรูปหกโมเดลที่เปิดได้ในคลิกเดียว พร้อมโจทย์และเฉลย
:::
:::card{title="คู่มือทฤษฎี" icon="lucide:sigma" to="/th/elements/conventions"}
แกนและข้อตกลงเรื่องเครื่องหมาย เอลิเมนต์คานและโครงถัก และวิธีที่ EduBeam คำนวณโมเดล
:::
:::card{title="ความช่วยเหลือ" icon="lucide:life-buoy" to="/th/reference/shortcuts"}
แป้นพิมพ์ เมาส์ และระบบสัมผัส การแก้ปัญหา และคำถามที่พบบ่อย
:::
::

## สร้างเครื่องมือของคุณเอง {#libraries}

EduBeam สร้างขึ้นจากไลบรารีโอเพนซอร์สสองตัว ซึ่งมีเอกสารอยู่ในเว็บไซต์นี้ ใช้คำนวณโครงสร้างในสคริปต์ สร้างโจทย์ที่ไม่ซ้ำกันให้นักศึกษาแต่ละคน หรือวาดรูปประกอบสไลด์และเอกสารประกอบการสอนได้

::card-grid{cols="2"}
:::card{title="@edubeam/fem" icon="lucide:package" to="/th/solver"}
ตัวคำนวณไฟไนต์เอลิเมนต์เบื้องหลัง EduBeam เขียนด้วย TypeScript สร้างโมเดล คำนวณ และอ่านผลของคานได้ในโค้ดราวสิบบรรทัด ทั้งในเบราว์เซอร์และใน Node
:::
:::card{title="@edubeam/plot" icon="lucide:spline" to="/th/plot"}
คอมโพเนนต์ Vue 3 ที่วาดโครงสร้างที่คำนวณแล้วเป็น SVG พร้อมแรงกระทำ แรงปฏิกิริยา และแผนภาพ N, V และ M
:::
::

## ภาษา {#languages}

EduBeam มี 18 ภาษา และเริ่มต้นด้วยภาษาของเบราว์เซอร์ เปลี่ยนได้ใน **การตั้งค่า → ภาษาและภูมิภาค** หรือเลือกจากรายการนี้:

::div{.chips}
- [:icon{name="circle-flags:lang-en"} English](https://run.edubeam.app/?lang=en){target="_blank"}
- [:icon{name="circle-flags:lang-id"} Bahasa Indonesia](https://run.edubeam.app/?lang=id){target="_blank"}
- [:icon{name="circle-flags:lang-cs"} Čeština](https://run.edubeam.app/?lang=cs){target="_blank"}
- [:icon{name="circle-flags:lang-de"} Deutsch](https://run.edubeam.app/?lang=de){target="_blank"}
- [:icon{name="circle-flags:lang-es"} Español](https://run.edubeam.app/?lang=es){target="_blank"}
- [:icon{name="circle-flags:lang-fr"} Français](https://run.edubeam.app/?lang=fr){target="_blank"}
- [:icon{name="circle-flags:lang-it"} Italiano](https://run.edubeam.app/?lang=it){target="_blank"}
- [:icon{name="circle-flags:lang-pl"} Polski](https://run.edubeam.app/?lang=pl){target="_blank"}
- [:icon{name="circle-flags:lang-pt-br"} Português](https://run.edubeam.app/?lang=pt){target="_blank"}
- [:icon{name="circle-flags:lang-vi"} Tiếng Việt](https://run.edubeam.app/?lang=vi){target="_blank"}
- [:icon{name="circle-flags:lang-ru"} Русский](https://run.edubeam.app/?lang=ru){target="_blank"}
- [:icon{name="circle-flags:lang-tr"} Türkçe](https://run.edubeam.app/?lang=tr){target="_blank"}
- [:icon{name="circle-flags:lang-uk"} Українська](https://run.edubeam.app/?lang=uk){target="_blank"}
- [:icon{name="circle-flags:lang-hi"} हिन्दी](https://run.edubeam.app/?lang=hi){target="_blank"}
- [:icon{name="circle-flags:lang-ja"} 日本語](https://run.edubeam.app/?lang=ja){target="_blank"}
- [:icon{name="circle-flags:lang-ko"} 한국어](https://run.edubeam.app/?lang=ko){target="_blank"}
- [:icon{name="circle-flags:lang-th"} ไทย](https://run.edubeam.app/?lang=th){target="_blank"}
- [:icon{name="circle-flags:lang-zh"} 中文](https://run.edubeam.app/?lang=cn){target="_blank"}
::

ลิงก์เลือกภาษาให้ผู้อ่านได้ด้วย: `run.edubeam.app/?lang=th` เปิดแอปเป็นภาษาไทย

## ผู้พัฒนาและกิตติกรรมประกาศ {#authors-credits}

[EduBeam]{.edubeam} พัฒนาโดย [Jan Voříšek](https://github.com/janvorisek) ในฐานะโปรเจกต์อิสระ ต่อยอดจาก EduBeam รุ่นเดสก์ท็อปสำหรับ Windows และ Linux ที่ [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) และ [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/) สร้างขึ้นที่ภาควิชากลศาสตร์ [คณะวิศวกรรมโยธา มหาวิทยาลัยเทคนิคแห่งเช็กในปราก (CTU)](https://www.fsv.cvut.cz/en) และยังเปิดไฟล์เซสชันของรุ่นนั้นได้ ตัวคำนวณ [@edubeam/fem](/th/solver) พัฒนาต่อจากเวอร์ชันแรกของ Bořek Patzák ทั้งแอปและตัวคำนวณเป็นโอเพนซอร์สภายใต้สัญญาอนุญาต GPL-3.0

::team-members{size="small" :members='[{"avatar":"https://www.github.com/janvorisek.png","name":"Jan Voříšek","title":"นักพัฒนาหลักและผู้ออกแบบผลิตภัณฑ์","links":[{"icon":"github","link":"https://github.com/janvorisek"},{"icon":"twitter","link":"https://twitter.com/janvorisekdev"}]},{"avatar":"https://www.github.com/kelidas.png","name":"Václav Sadílek","title":"นักพัฒนา: การควบคุมแบบสัมผัส ประสิทธิภาพการวาด แรงกระทำ และจุดรองรับ","links":[{"icon":"web","link":"https://www.stm.fce.vutbr.cz/sadilek/"},{"icon":"github","link":"https://github.com/kelidas"}]},{"avatar":"https://www.github.com/bpatzak.png","name":"Bořek Patzák","title":"EduBeam รุ่นดั้งเดิมและตัวคำนวณ FEM รุ่นแรก","links":[{"icon":"github","link":"https://github.com/bpatzak"}]}]'}
::

## ร่วมพัฒนา {#contribute}

::card-grid{cols="3"}
:::card{title="รายงานปัญหา" icon="lucide:bug" to="https://github.com/janvorisek/edubeam/issues"}
มีอะไรที่ชวนสับสน ผิด หรือใช้งานไม่ได้? เปิด issue บน GitHub แล้วทีมพัฒนาจะได้รับเรื่อง
:::
:::card{title="ปรับปรุงคำแปล" icon="lucide:languages" to="https://github.com/janvorisek/edubeam/tree/main/src/locales"}
ข้อความในแอปแยกเป็นไฟล์ละหนึ่งภาษา ส่ง pull request มาได้เลย
:::
:::card{title="บอกต่อ" icon="lucide:share-2"}
แนะนำ EduBeam ให้เพื่อนร่วมชั้นและเพื่อนร่วมงาน หรือใส่ลิงก์โมเดลไว้ในโน้ตและเอกสารของคุณ
:::
::
