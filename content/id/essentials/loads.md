---
description: "Beban di EduBeam: gaya, momen, penurunan tumpuan, beban merata, trapesium, terpusat, dan suhu; z positif ke bawah, momen positif berlawanan arah jarum jam."
source: site
---

# Beban

Beban bekerja pada joint atau di sepanjang elemen. Semuanya termasuk dalam **satu kasus beban** dan bekerja bersamaan; untuk membandingkan beberapa skenario, simpan masing-masing sebagai [file proyek atau tautan berbagi](/id/essentials/import-export).

| Beban | Bekerja pada | Ditambahkan dari |
| --- | --- | --- |
| [Gaya atau momen](#nodal-loads) | joint | tab *Beban* → **Tambah beban joint**, atau klik joint → **Tambah beban** |
| [Perpindahan tumpuan](#prescribed-displacements-support-settlements) (penurunan tumpuan) | joint dengan tumpuan | dialog yang sama, atau klik joint → **Tetapkan perpindahan** |
| Beban [merata](#uniformly-distributed-load), [trapesium](#trapezoidal-load), [terpusat](#concentrated-load), atau [suhu](#temperature-load) | elemen | tab *Beban* → **Tambah beban elemen**, atau klik elemen → **Tambah beban** |

## Konvensi tanda {#sign-convention-in-one-line}

Sumbu x mengarah **ke kanan**, sumbu z mengarah **ke bawah**, dan momen positif **berlawanan arah jarum jam**. Jadi `Fz` atau `fz` positif adalah beban ke bawah, searah gravitasi, dan beban ke atas bernilai negatif.

::model-figure{caption="Semua beban di sini positif: Fx = +10 kN ke kanan, Fz = +10 kN ke bawah, My = +10 kNm berlawanan arah jarum jam"}
---
nodes: { A: [0, 0], B: [3, 0], C: [6, 0] }
supports: { A: pin, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: A, fx: 10 }
  - { node: B, fz: 10 }
  - { node: C, my: 10 }
results: []
---
::

| Positif | Sumbu bawaan (z ke bawah) | [Sumbu y ke atas](/id/elements/conventions#y-up-axes) |
| --- | --- | --- |
| Gaya horizontal `Fx`, `fx` | ke kanan | ke kanan |
| Gaya vertikal | `Fz`, `fz`: **ke bawah** | `Fy`, `fy`: **ke atas** |
| Momen | `My`: berlawanan arah jarum jam | `Mz`: berlawanan arah jarum jam |
| Penurunan tumpuan vertikal | `Dz`: ke bawah | `Dy`: ke atas |

Beban dalam **sumbu lokal** elemen (LCS dicentang) mengikuti elemen: sumbu x lokal mengarah dari joint awal ke joint akhir, dan sumbu z lokal adalah sumbu x lokal yang diputar 90° searah jarum jam, ke arah garis putus-putus yang digambar di sepanjang elemen. Lihat [Arah elemen](/id/essentials/elements#element-direction). Konvensi lengkapnya, termasuk untuk gaya dalam, ada di [Sistem koordinat & konvensi tanda](/id/elements/conventions#loads).

## Beban joint {#nodal-loads}

Tab *Beban* → **Tambah beban joint**, atau klik joint → **Tambah beban**, dan biarkan **Gaya/Momen** terpilih. Masukkan gaya `Fx`, `Fz` (kN) dan momen `My` (kNm) dengan tanda seperti [di atas](#sign-convention-in-one-line); pratinjau menggambar beban saat Anda mengetik.

![Tambah beban joint: pratinjau menunjukkan arahnya saat Anda mengetik](/screenshots/id/loads-nodal.webp){.shot-md}

- Komponennya dinyatakan dalam sumbu **global**. Pada joint yang sumbunya diputar ([tumpuan miring](/id/essentials/nodes-supports#inclined-skewed-supports)), dialog menambahkan pengalih **Sumbu global** / **Sumbu titik**. Dalam sumbu joint, komponennya, yang ditampilkan sebagai `Fx′` dan `Fz′`, bekerja searah sumbu joint itu sendiri dan ikut berputar jika sudutnya kemudian diubah. Saat Anda beralih, angkanya dihitung ulang sehingga bebannya sendiri tidak berubah.
- Sebuah joint dapat memikul beberapa beban joint; semuanya dijumlahkan.

### Perpindahan tumpuan (penurunan tumpuan) {#prescribed-displacements-support-settlements}

Untuk memindahkan tumpuan sejauh nilai tertentu, pilih **Perpindahan tumpuan** di dialog yang sama, atau klik joint dengan tumpuan → **Tetapkan perpindahan**. Masukkan perpindahan `Dx`, `Dz` (positif ke kanan dan ke bawah, dalam [satuan perpindahan](/id/essentials/units-settings#units), bawaannya m) dan rotasi `Ry` (rad, positif berlawanan arah jarum jam).

- Hanya DOF yang **ditahan** yang dapat ditetapkan: kolom lainnya berwarna abu-abu, dan joint tanpa tumpuan sama sekali tidak dapat diberi penurunan tumpuan.
- Sebuah joint memiliki paling banyak satu perpindahan tumpuan. Untuk mengubahnya, edit yang sudah ada, jangan menambahkan yang kedua.
- Pada tumpuan miring, kolomnya bernama `Dx′` dan `Dz′`: penurunan tumpuan bekerja searah sumbu tumpuan itu sendiri.

Apakah penurunan tumpuan menimbulkan gaya dalam bergantung pada strukturnya. Bandingkan penurunan tumpuan B yang sama sebesar 10 mm, tanpa beban lain:

::div{.shots}

:::model-figure{caption="Balok sederhana: balok hanya miring; tidak ada reaksi, M = 0"}
---
nodes: { A: [0, 0], B: [5, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

:::model-figure{caption="Balok menerus melewati B: balok melentur, M = 21,06 kNm di atas B"}
---
nodes: { A: [0, 0], B: [5, 0], C: [10, 0] }
supports: { A: pin, B: roller, C: roller }
members: [[A, B], [B, C]]
loads:
  - { node: B, settlement: { dz: 0.01 } }
results: [w, M]
show: [nodeLabels]
---
:::

::

Struktur statis tertentu mengikuti tumpuan tanpa perlawanan. Balok menerus harus melentur: tumpuan B menariknya ke bawah sejauh $\delta = 10\ \text{mm}$, seperti beban terpusat di tengah balok sederhana sepanjang 10 m. Dengan $L = 5\ \text{m}$ dan $EI = 17\,548\ \text{kNm}^2$ dari baja contoh, beban itu $P = 6EI\delta/L^3 = 8{,}423\ \text{kN}$, yaitu reaksi di B, dan $M_B = PL/2 = 3EI\delta/L^2 = 21{,}06\ \text{kNm}$. Tutorial [Balok menerus dan penurunan tumpuan](/id/tutorials/continuous-beam) menggabungkan penurunan tumpuan dengan beban lain.

## Beban elemen {#element-loads}

Tab *Beban* → **Tambah beban elemen**, atau klik elemen → **Tambah beban**. Pilih **Tipe beban**; pratinjau menampilkan beban pada elemen saat Anda mengetik. Gaya dinyatakan dalam kN dan beban garis dalam kN/m, atau dalam [satuan](/id/essentials/units-settings#units) yang Anda pilih.

![Tambah beban elemen, dengan beban merata](/screenshots/id/loads-udl.webp){.shot-md}

### Beban merata {#uniformly-distributed-load}

Beban konstan per satuan panjang, `fx` dan `fz`, di sepanjang seluruh elemen. Jika **LCS** dicentang (bawaan), keduanya bekerja searah sumbu lokal elemen; jika tidak dicentang, searah sumbu global. Pada elemen horizontal yang digambar dari kiri ke kanan keduanya sama; pada batang miring tidak:

| Yang Anda inginkan | Masukkan |
| --- | --- |
| beban **tegak lurus** batang (angin pada kasau) | `fz` dengan LCS **dicentang** |
| beban **vertikal** per meter panjang batang (berat sendiri) | `fz` dengan LCS **tidak dicentang** |
| beban **vertikal** per meter proyeksi horizontal (salju) | tidak tersedia langsung: kalikan dengan $\cos\alpha$, dengan $\alpha$ kemiringan batang, lalu masukkan sebagai beban vertikal |

Beban 10 kN/m yang sama pada kasau dengan bentang horizontal 4 m dan tinggi 3 m, panjangnya 5 m:

::div{.shots}

:::model-figure{caption="LCS tidak dicentang: vertikal, total 50 kN; M = 25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [M]
---
:::

:::model-figure{caption="LCS dicentang: tegak lurus batang; M = 31,25 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10, local: true }
results: [M]
---
:::

::

Perhitungan manual: untuk beban tegak lurus, $M = qL^2/8 = 10 \cdot 5^2/8 = 31{,}25\ \text{kNm}$; untuk beban vertikal, 50 kN yang tersebar pada bentang 4 m sama dengan 12,5 kN/m proyeksi, sehingga $M = 12{,}5 \cdot 4^2/8 = 25\ \text{kNm}$.

### Beban trapesium {#trapezoidal-load}

Beban yang berubah secara linear di sepanjang elemen: `f1x`, `f1z` di joint **awal**, `f2x`, `f2z` di joint **akhir**. Isi salah satu ujung dengan nol untuk beban segitiga.

::model-figure{caption="Beban segitiga, 0 sampai 10 kN/m: reaksi 10 dan 20 kN, M terbesar = 23,09 kNm pada 3,46 m"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: [0, 10] }
results: [M, V]
show: [nodeLabels]
---
::

Perhitungan manual: beban total $qL/2 = 30\ \text{kN}$ bekerja pada $2L/3$, sehingga $R_A = 10\ \text{kN}$ dan $R_B = 20\ \text{kN}$; gaya geser bernilai nol dan momen mencapai nilai terbesar pada $x = L/\sqrt{3} = 3{,}46\ \text{m}$, dengan $M = qL^2/(9\sqrt{3}) = 23{,}09\ \text{kNm}$.

Beban trapesium bekerja searah **sumbu lokal** elemen (kotak LCS terkunci). Pada elemen horizontal yang digambar dari kiri ke kanan, sumbu lokal sama dengan sumbu global; pada elemen miring, `f1z` dan `f2z` tegak lurus batang, sedangkan `f1x`, `f2x` searah batang.

Beban **vertikal** yang bervariasi pada batang dengan kemiringan $\alpha$ tetap dapat dimodelkan secara eksak: masukkan kedua komponen lokalnya di setiap ujung, $f_z = q\cos\alpha$ dan $f_x = q\sin\alpha$ yang mengarah ke bawah lereng, yaitu negatif jika elemen naik dari joint awalnya. Untuk kasau di atas, dengan bentang horizontal 4 m dan tinggi 3 m serta digambar dari bawah, beban vertikal yang bertambah dari 0 sampai 10 kN/m panjang batang adalah `f1x` = `f1z` = 0, `f2x` = −6, dan `f2z` = 8 kN/m.

::model-figure{caption="Beban vertikal dari 0 sampai 10 kN/m panjang batang, dimasukkan sebagai komponen lokal: reaksi 8,333 dan 16,67 kN, M terbesar = 12,83 kNm"}
---
nodes: { A: [0, 0], B: [4, -3] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qx: [0, -6], qz: [0, 8], local: true }
results: [M]
show: [nodeLabels]
---
::

Perhitungan manual: resultan 25 kN bekerja pada dua pertiga bentang horizontal, yaitu pada 2,67 m, sehingga $R_B = 25 \cdot 2{,}667/4 = 16{,}67\ \text{kN}$. Pada proyeksi 4 m, bebannya berupa segitiga yang naik sampai 12,5 kN/m, sehingga, seperti di atas, $M = 12{,}5 \cdot 4^2/(9\sqrt{3}) = 12{,}83\ \text{kNm}$.

### Beban terpusat {#concentrated-load}

Gaya terpusat `Fx`, `Fz` atau momen `My` di titik mana pun **di sepanjang** elemen, tanpa joint tambahan. **Posisi beban dari joint awal** adalah jaraknya $a$ dari joint awal, $0 \le a \le L$. Nilai awalnya setengah panjang elemen, dibulatkan ke bawah ke meter penuh dan paling besar 5 m (dalam satuan AS: feet penuh, paling besar 15 ft), jadi sesuaikan dengan letak beban Anda. **LCS** bekerja seperti pada beban merata.

::model-figure{caption="20 kN pada 2 m di bentang 6 m: V melompat dari 13,33 ke −6,667 kN, M = 26,67 kNm di bawah beban"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, pz: 20, at: 2 }
results: [V, M]
show: [nodeLabels]
---
::

Diagram gaya geser melompat sebesar `Fz` di titik beban, dan diagram momen memiliki patahan di sana: $R_A = 20 \cdot 4/6 = 13{,}33\ \text{kN}$, $M = 13{,}33 \cdot 2 = 26{,}67\ \text{kNm}$. Momen terpusat `My` justru menimbulkan lompatan pada diagram momen.

### Beban suhu {#temperature-load}

| Kolom | Arti | Pengaruh |
| --- | --- | --- |
| **ΔT<sub>c</sub>**, perubahan suhu aksial | perubahan yang sama pada seluruh penampang | perpanjangan $\alpha\,\Delta T_c\,L$ |
| **ΔT<sub>b</sub> − ΔT<sub>t</sub>** | perubahan suhu serat bawah dikurangi serat atas | kelengkungan $\alpha\,(\Delta T_b - \Delta T_t)/h$ |

Keduanya adalah *perubahan* suhu dari keadaan tanpa tegangan, secara bawaan dalam °C; perubahan 1 °C sama dengan 1 K. Beban suhu memakai **α** material dan **tinggi h** penampang. Serat **bawah** berada di sisi garis putus-putus. ΔT<sub>b</sub> − ΔT<sub>t</sub> positif (lebih panas di bawah) memperpanjang serat bawah, sehingga elemen melendut seperti balok yang dibebani gravitasi.

Pada struktur statis tertentu, suhu hanya menimbulkan perpindahan. Kekangan (ujung jepit, kontinuitas, batang kelebihan) mengubahnya menjadi gaya dalam. Balok baja 6 m yang sama, setinggi 0,3 m, dengan sisi bawah 20 K lebih panas daripada sisi atas:

::div{.shots}

:::model-figure{caption="Balok sederhana: melendut 3,6 mm di tengah bentang, M = 0"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [w, M]
---
:::

:::model-figure{caption="Jepit di kedua ujung: balok tetap lurus, M = −14,04 kNm di sepanjang balok"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: fixed, B: fixed }
members: [[A, B]]
section: { h: 0.3 }
loads:
  - { member: 1, temperature: { bottom: 20 } }
results: [M, w]
---
:::

::

Perhitungan manual: kelengkungan bebasnya $\kappa = \alpha\,\Delta T/h = 12 \times 10^{-6} \cdot 20/0{,}3 = 8 \times 10^{-4}\ \text{1/m}$. Sebagai balok sederhana, balok dapat melengkung bebas dan melendut $\kappa L^2/8 = 3{,}6\ \text{mm}$. Dengan ujung jepit, momen konstan harus meniadakan kelengkungan itu: $M = -EI\kappa = -17\,548 \cdot 8 \times 10^{-4} = -14{,}04\ \text{kNm}$. [Memeriksa hasil secara manual](/id/guide/verification#temperature-gradient-on-a-simply-supported-beam) membahas satu kasus lagi.

## Mengedit dan menghapus beban {#editing-and-removing-loads}

| Untuk | Lakukan ini |
| --- | --- |
| Mengubah nilai dengan cepat | Edit komponennya (dan kotak LCS) langsung di tab *Beban*. |
| Membuka dialog edit | Klik ganda beban di tampilan, atau klik beban → **Edit beban**. Beban juga muncul sebagai label di tabel *Joint* dan *Elemen*; klik salah satunya untuk mengeditnya. |
| Menghapusnya | Pilih beban lalu tekan <kbd>Delete</kbd>, klik beban → **Hapus**, atau gunakan tombol × di tab *Beban*. |

Beban selalu melekat pada joint atau elemennya: jika joint atau elemen dihapus, bebannya ikut terhapus, dan jika joint atau elemen disalin bersama bebannya yang ikut terpilih, beban itu ikut tersalin.

![Tab Beban: satu baris per beban, komponennya dapat diedit di tempat](/screenshots/id/loads-table.webp)

## Yang tidak tersedia {#what-is-not-available}

::div{.limits}
- **Satu kasus beban.** Tidak ada kombinasi beban: simpan setiap kasus sebagai file atau tautan tersendiri.
- **Tidak ada berat sendiri.** Tambahkan berat sendiri sebagai beban merata dengan LCS tidak dicentang: $f_z = \rho\,g\,A$, mis. $\approx 0{,}22\ \text{kN/m}$ untuk IPE 200.
- **Beban trapesium hanya dalam sumbu lokal.** Untuk beban vertikal yang bervariasi pada batang miring, masukkan [komponen lokalnya](#trapezoidal-load).
- **Tidak ada beban garis parsial.** Beban garis selalu meliputi seluruh elemen: tambahkan joint di tempat beban itu mulai atau berakhir.
::
