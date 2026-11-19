---
description: "Menempatkan dan mengedit joint di EduBeam, snap ke grid, membagi elemen, dan memilih tumpuan yang tepat: sendi, rol, jepit, jepit geser, dan tumpuan miring."
source: site
---

# Joint & tumpuan

Joint adalah titik-titik model Anda: elemen menghubungkan joint satu dengan yang lain, sedangkan tumpuan dan beban joint dipasang pada joint. Tempatkan joint dengan mengetik koordinatnya atau dengan mengeklik kanvas, lalu pasang tumpuan yang sesuai dengan gambar Anda pada joint yang perlu ditumpu.

## Koordinat {#coordinates}

Setiap joint memiliki koordinat **X** dan **Z** dalam [satuan panjang](/id/essentials/units-settings#units) yang berlaku. Sumbu X mengarah ke kanan dan **sumbu Z mengarah ke bawah**, sehingga semua titik di atas tanah memiliki Z negatif: kolom setinggi 4 m membentang dari `Z = 0` hingga `Z = −4`.

::model-figure{caption="Portal selebar 6 m dan setinggi 4 m: A dan D berada di Z = 0, B dan C di Z = −4"}
---
nodes: { A: [0, 0], B: [0, -4], C: [6, -4], D: [6, 0] }
supports: { A: fixed, D: fixed }
members: [[A, B], [B, C], [C, D]]
results: []
show: [nodeLabels, dimensions]
---
::

Jika Anda lebih suka sumbu vertikal mengarah ke atas, pilih [sumbu y ke atas](/id/elements/conventions#y-up-axes) di Pengaturan. Hanya tampilannya yang berubah; model dan file proyeknya tetap sama.

## Menambahkan joint {#adding-nodes}

- **Dengan mengetik.** Tab *Joint* → **Tambah joint** (tombol berikon **+**), atau klik kanan kanvas → *Tambah joint*. Ketik X dan Z, dan jika perlu juga tumpuan dan sudut tumpuannya.
- **Dengan mengeklik.** Tab *Joint* → **Tambah joint** (tombol berikon kursor), atau tahan <kbd>Ctrl</kbd> saat memilih *Tambah joint* di menu kanvas. Setiap klik menempatkan satu joint; tekan <kbd>Esc</kbd>, **Batal**, atau tombol itu lagi untuk berhenti.
- **Sambil menggambar elemen.** Saat Anda [menggambar elemen dengan mouse](/id/essentials/elements#adding-elements), klik di kanvas yang kosong membuat joint di tempat itu.
- **Dengan menyalin.** Pilih joint (dan elemen), tekan <kbd>Ctrl</kbd>+<kbd>C</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd>, lalu klik tempat salinan diletakkan, atau ketik pergeseran Δx, Δz di banner dan tekan **Tempel**.

::div{.shots}

![Dialog Tambah joint](/screenshots/id/qs-node.webp)

![Dalam mode mouse, banner di atas mengatur tumpuan dan sudut setiap joint yang Anda tempatkan](/screenshots/id/nodes-add-banner.webp)

::

Joint baru mendapat nomor berikutnya yang masih bebas: `1`, `2`, `3`, …. Ganti nama joint mana pun di kolom *Joint* pada tabel, misalnya menjadi `A`, `B`, `C`.

### Snap {#snapping}

Jika **Snap ke grid** aktif (tekan <kbd>S</kbd>, atau label **S** di kanan bawah tampilan), joint yang Anda tempatkan atau seret menempel ke grid. Jarak bawaannya 0,1 m, atau 0,5 ft dalam satuan AS; ubah di [Pengaturan → Pengaturan tampilan → Grid](/id/essentials/units-settings#viewer-settings). Untuk posisi lain, ketik koordinat yang tepat di tabel.

### Menempatkan joint pada elemen yang ada {#placing-a-node-on-an-existing-element}

Jika Anda mengeklik pada elemen (atau sangat dekat dengannya) saat menambahkan joint dengan mouse, EduBeam menanyakan maksud Anda:

- **Sambungkan ke struktur** membagi elemen menjadi dua, `1a` dan `1b`, yang bertemu di joint baru. Inilah cara tercepat untuk menambahkan tumpuan di tengah atau titik tempat beban bekerja. Sendi di ujung luar tetap di tempatnya. Beban merata dan beban trapesium dibagi di antara kedua bagian. Beban terpusat dan beban suhu semuanya masuk ke bagian pertama, `1a`: di tabel *Beban*, pindahkan beban terpusat yang letaknya melewati joint baru ke `1b` (posisinya sekarang dihitung dari joint baru), dan beri `1b` beban suhunya sendiri.
- **Tempatkan joint terpisah** meletakkan joint di atas elemen tanpa menyambungkannya.

Apa pun pilihannya, mode penempatan joint berakhir di situ; klik lagi tombol berikon kursor untuk menempatkan joint lain.

## Mengedit joint {#editing-nodes}

| Untuk | Lakukan ini |
| --- | --- |
| Memindahkan joint | Seret joint di tampilan (di layar sentuh: tekan lalu seret), atau ketik X dan Z di tabel *Joint*. Elemen yang tersambung, bebannya, dan garis dimensinya ikut berpindah. |
| Mengganti namanya | Ketik label baru di kolom *Joint*. |
| Mengubah tumpuannya | Klik joint → **Tumpuan joint**, atau gunakan kolom *DOF yang ditahan*. Lihat [Tumpuan](#supports). |
| Mengedit semuanya sekaligus | Ikon pensil di kolom *Aksi* membuka **Edit joint**: koordinat, tumpuan, dan sudut tumpuan, dengan pratinjau simbolnya. |
| Menghapusnya | Tombol × di tabel, **Hapus** di panel joint, atau pilih joint lalu tekan <kbd>Delete</kbd>. Elemen, beban, dan garis dimensi yang terpasang padanya ikut terhapus. |

Setiap perubahan dapat dibatalkan dengan <kbd>Ctrl</kbd>+<kbd>Z</kbd>.

## Tumpuan {#supports}

Setiap joint dapat bergerak dengan tiga cara, yang disebut **derajat kebebasan** (DOF): `Dx` searah x, `Dz` searah z, dan `Ry`, rotasi pada bidang gambar. Tumpuan **menahan** sebagian dari ketiganya.

Kedelapan tumpuan adalah delapan cara mengombinasikan ketiga DOF itu. Baca tabel per baris: tumpuan di kolom tengah dapat berotasi bebas, tumpuan di kolom kanan juga ditahan terhadap rotasi.

| Translasi yang ditahan | Berotasi bebas | Rotasi juga ditahan |
| --- | --- | --- |
| **Keduanya** (`Dx` dan `Dz`) | ![](/screenshots/id/b-support-pin.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Sendi** | ![](/screenshots/id/b-support-fixed.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Jepit** |
| **Hanya vertikal** (`Dz`): bergeser horizontal | ![](/screenshots/id/b-support-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Rol** | ![](/screenshots/id/b-support-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Jepit geser** |
| **Hanya horizontal** (`Dx`): bergeser vertikal | ![](/screenshots/id/b-support-vertical-roller.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Rol vertikal** | ![](/screenshots/id/b-support-vertical-slider.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Jepit geser vertikal** |
| **Tidak ada**: bergeser ke dua arah | ![](/screenshots/id/b-support-free.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Bebas** (tanpa tumpuan) | ![](/screenshots/id/b-support-rotation-only.webp){width="34" style="display:inline;border:0;border-radius:0;margin:0 0.35em 0 0;vertical-align:middle"} **Hanya rotasi ditahan** |

Untuk setiap DOF yang ditahan, EduBeam menghitung **reaksi**: `Dx` memberi gaya horizontal $R_x$, `Dz` gaya vertikal $R_z$, `Ry` momen $M$. Jadi tumpuan sendi memberi $R_x$ dan $R_z$, tumpuan rol hanya $R_z$, jepit geser $R_z$ dan $M$, sedangkan tumpuan jepit memberi ketiganya.

### Memasang tumpuan {#setting-a-support}

Pilih simbolnya, atau centang DOF satu per satu; keduanya selalu saling menyesuaikan. Simbol dan kotak centang itu tersedia di tiga tempat:

- panel joint (klik joint) → **Tumpuan joint**, bersama **Sudut LCS joint**, seperti di bawah;
- dialog **Tambah joint** dan **Edit joint**;
- kolom *DOF yang ditahan* pada tabel *Joint*, tempat simbolnya berupa menu kecil dan `Dx`, `Dz`, `Ry` berupa kotak centang.

![Tumpuan joint di panel joint: simbol, kotak centang DOF, dan sudut tumpuan](/screenshots/id/nodes-support-picker.webp){.shot-lg}

Arahkan kursor ke simbol untuk melihat namanya.

### Rol atau jepit geser? {#roller-or-slider}

Keduanya berada di atas rel dan dapat bergeser di sepanjang rel itu. Bedanya ada pada rotasi:

- **rol** adalah sendi di atas rel: ujung batang **berotasi bebas**, sehingga di sana tidak ada momen;
- **jepit geser** adalah jepit di atas rel: ujung batang **tidak dapat berotasi**, sehingga tumpuan memikul momen.

Balok 6 m yang sama dengan beban 10 kN/m, hanya tumpuan kanannya yang diganti. Pada gambar, Anda dapat beralih antara bentuk deformasi dan momen lentur:

::div{.shots}

:::model-figure{caption="Sendi dan rol: ujung kanan berotasi bebas; di sana M = 0, reaksi 30 kN di setiap tumpuan"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

:::model-figure{caption="Sendi dan jepit geser: ujung kanan tetap horizontal; di sana M = −45 kNm, reaksi 37,5 kN di jepit geser"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: slider }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [w, M]
---
:::

::

Yang pertama adalah balok sederhana ($M_{max} = qL^2/8 = 45\ \text{kNm}$ di tengah bentang). Di bawah beban vertikal, jepit geser bekerja persis seperti ujung jepit, sehingga yang kedua adalah balok jepit–rol ($R_B = 5qL/8 = 37{,}5\ \text{kN}$, $M_B = -qL^2/8 = -45\ \text{kNm}$). Karena ujungnya ditahan tetap horizontal, balok juga menjadi lebih kaku: lendutan terbesar turun dari 9,617 mm menjadi 4 mm. Jepit geser baru berbeda dari ujung jepit jika ada gaya yang mendorong searah relnya.

### Tumpuan miring {#inclined-skewed-supports}

Tumpuan pada bidang miring menahan joint searah sumbu yang diputar. Atur **Sudut LCS joint** α, dalam derajat dari −180 sampai 180, di panel joint pada *Tumpuan joint*, di dialog Tambah joint dan Edit joint, atau di kolom **α** pada tabel *Joint*. (**LCS** adalah sistem koordinat lokal.)

Sumbu joint berputar sebesar α dan DOF yang dicentang bekerja searah sumbu tersebut. α memutar x ke arah z, yaitu **searah jarum jam** di layar (dengan sumbu y ke atas, α memutar x ke arah y, berlawanan arah jarum jam). Jadi rol pada permukaan yang turun 30° ke kanan adalah rol dengan α = 30°. Simbolnya ikut berputar, dan reaksinya dilaporkan searah sumbu yang diputar.

::model-figure{caption="Rol di B diputar sebesar α = 30°: reaksinya sebesar 34,64 kN tegak lurus bidang miring, dan balok memikul N = +17,32 kN"}
---
nodes: { A: [0, 0], B: [6, 0] }
supports: { A: pin, B: roller }
angles: { B: 30 }
members: [[A, B]]
loads:
  - { member: 1, qz: 10 }
results: [N, M]
show: [nodeLabels]
---
::

Balok ini sama dengan balok di atas, 6 m dengan beban 10 kN/m, tetapi rolnya kini berada di bidang miring 30°. Komponen vertikal reaksi di B tetap $qL/2 = 30\ \text{kN}$, sehingga reaksinya sendiri $30/\cos 30° = 34{,}64\ \text{kN}$, dan komponen horizontalnya, $30 \tan 30° = 17{,}32\ \text{kN}$, mendorong B ke kanan. Tumpuan sendi di A menahannya, sehingga balok mengalami tarik. Momen lenturnya tidak berubah.

[Beban joint](/id/essentials/loads#nodal-loads) pada joint yang diputar dapat diberikan dalam sumbu global atau dalam sumbu joint; [perpindahan tumpuan](/id/essentials/loads#prescribed-displacements-support-settlements) selalu bekerja searah sumbu tumpuan itu sendiri.

### Stabilitas {#stability}

Struktur bidang memerlukan setidaknya **tiga DOF yang ditahan**, yang tersusun sedemikian rupa sehingga benar-benar menahan struktur. Selama tumpuan masih kurang, tampilan menunjukkan label biru **Perlu tumpuan**. Jika jumlahnya sudah cukup tetapi tidak mampu menahan struktur (semuanya sejajar, atau semuanya bertemu di satu titik), atau jika sendi membuat batang dapat berputar satu terhadap yang lain, pesan merah menyebutkan masalahnya dan garis putus-putus menunjukkan bagaimana struktur bergerak. [Pemecahan masalah](/id/reference/troubleshooting#messages) menjelaskan setiap pesan.

## Beban joint dan penurunan tumpuan {#nodal-loads-and-settlements}

Klik joint → **Tambah beban** untuk gaya atau momen, atau → **Tetapkan perpindahan** untuk memindahkan tumpuan sejauh nilai tertentu (penurunan tumpuan). Keduanya dijelaskan di [Beban joint](/id/essentials/loads#nodal-loads).

## Garis dimensi {#dimension-lines}

Garis dimensi menandai panjang pada gambar. Garis ini tidak memengaruhi analisis, tetapi disimpan bersama proyek, ikut terbawa dalam tautan berbagi, dan muncul di [gambar yang diekspor](/id/essentials/import-export#export-an-image).

| Untuk | Lakukan ini |
| --- | --- |
| Menambahkannya | Klik kanan kanvas → **Tambah dimensi**, lalu klik kedua titik ujungnya. Titik di dekat joint menempel ke joint itu. |
| Memberi dimensi pada elemen | Klik kanan elemen → **Dimensi elemen**. |
| Mengedit atau membaliknya | Klik garisnya → **Edit** untuk mengetik koordinatnya, atau **Balik dimensi** untuk memindahkan label ke sisi lain. |
| Memindahkannya | Seret garisnya, atau seret salah satu titik ujungnya. Ujung yang berada di joint tetap terikat pada joint itu dan ikut berpindah bersamanya. |
