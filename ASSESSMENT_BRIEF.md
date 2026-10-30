# Technical Skill Test — Fullstack Developer
**PT Digital Solusi Grup**

> Transkripsi dari dokumen PDF asli. Persyaratan dan redaksi dipertahankan; format tabel dan paragraf dirapikan untuk Markdown.

Terima kasih atas ketertarikan Anda untuk bergabung di PT Digital Solusi Grup. Dokumen ini disusun sebagai panduan pelaksanaan Technical Skill Test yang bertujuan untuk mengevaluasi kemampuan teknis, pengambilan keputusan, serta cara Anda menerjemahkan kebutuhan tim marketing menjadi produk yang siap dipakai.

## Instruksi Umum

| Item | Keterangan |
|---|---|
| Posisi | Fullstack Developer |
| Tipe | Take-home Technical Test |
| Deadline | 2 hari kalender sejak brief diterima (estimasi pengerjaan 6–8 jam) |
| Stack | Wajib TypeScript untuk kode yang Anda tulis. Framework, CMS, database, dan hosting bebas (CMS siap pakai boleh walaupun bukan TypeScript) |
| Deliverable | Git repository (GitHub/GitLab) + link deploy + README.md + AI_LOG.md |

## Aturan

1. Kumpulkan dalam 2 hari kalender sejak brief diterima. Tes ini dirancang untuk sekitar 6–8 jam kerja; Anda tidak perlu mengerjakan lebih dari itu. Mohon mencatat waktu pengerjaan sebenarnya di README.
2.      Anda boleh dan dianjurkan menggunakan AI tools. Cantumkan log penggunaannya di AI_LOG.md.
3.      Kumpulkan dalam bentuk Git Repository (GitHub/GitLab, akses public atau private dengan invite ke hendrawan.putra@dsg.id). Pastikan commit history terlihat dan tidak di-squash.
4.      Sertakan link deploy menggunakan layanan hosting gratis (Vercel, Netlify, Railway, Render, dll.) beserta akun CMS/admin demo agar kami bisa mencoba mengedit konten.
5.      Sertakan README.md yang berisi:
-   Waktu pengerjaan sebenarnya,
-   Penjelasan cara menjalankan project di lokal,
-   Arsitektur singkat dan alasan memilih stack,
-   Asumsi yang dibuat atas hal yang ambigu,
-   Apa yang sudah selesai, apa yang belum, dan apa yang akan dikerjakan kalau ada waktu 1 minggu lagi,
-   Rencana menghubungkan marketplace ke backend: endpoint yang dibutuhkan, alur payment gateway yang aman (webhook, verifikasi, status order), cara menjaga kuota lisensi promo tetap akurat, serta pengiriman lisensi setelah pembayaran berhasil, dan
- Screenshot hasil Lighthouse mobile untuk landing page.
6.    Sertakan AI_LOG.md (bebas formatnya) yang berisi:
- Tools yang dipakai dan untuk bagian apa,
- 2–3 contoh prompt yang paling membantu,
- Minimal 2 contoh ketika AI memberi jawaban atau menghasilkan implementasi yang salah, kurang tepat, tidak aman, atau tidak memenuhi requirement. Jelaskan bagaimana masalah ditemukan, bagaimana diperbaiki, dan bagaimana hasil akhirnya diverifikasi,
- Minimal 1 bagian implementasi yang banyak dibantu AI, beserta edge case yang Anda uji untuk memastikan implementasinya benar, dan
- Bagian yang sengaja Anda tulis sendiri tanpa AI, beserta alasannya.
7.    Boleh menggunakan template, boilerplate, starter kit, library UI, state management, atau mock API (misalnya Zustand, Redux, TanStack Query, MSW, json-server). Sebutkan dan jelaskan alasannya di README.
8.    Gunakan data dummy. Jangan memakai data pribadi atau API key sungguhan di repository.
9.    Penilaian tidak didasarkan pada banyaknya fitur atau lamanya pengerjaan. Lebih baik sebagian fitur selesai dengan rapi dan dijelaskan, daripada semua fitur ada tapi rapuh. Hasil tes hanya dipakai untuk penilaian dan tetap menjadi milik Anda.

## Skenario
 Brand fiktif "Kodeva" menjual software bisnis untuk UMKM secara online (aplikasi kasir, aplikasi HR & payroll, dan add-on pendukungnya) dengan sistem lisensi berlangganan. Tim marketing akan meluncurkan campaign "Promo Akhir Tahun" dan membutuhkan dua hal:
1.    Website landing campaign + blog yang isinya bisa diubah sendiri oleh tim marketing tanpa bantuan developer.
2.    Mini marketplace: halaman katalog produk, detail produk, keranjang, dan checkout sederhana, cukup di sisi frontend. Pesan dari Head of Marketing:
> "Kami sering ganti banner dan promo tiap minggu, jadi jangan sampai harus minta tolong
developer tiap kali ganti teks atau gambar. Website juga harus cepat dibuka di HP, karena 80% traffic kami dari Instagram dan TikTok. Kami perlu tahu berapa orang yang klik tombol beli dari landing page. Satu lagi, kami ingin artikel blog dan produk kami gampang ketemu waktu orang cari aplikasi kasir atau aplikasi HR di Google, dan link-nya kelihatan menarik waktu dibagikan di WhatsApp. Oh iya, awal tahun depan kami mulai ekspansi ke Malaysia dan Singapura, dan tim di sana juga akan memakai website ini untuk campaign mereka." Pesan ini sengaja tidak menjawab semua pertanyaan. Kalau ada hal yang ambigu, silakan bertanya via email ke hendrawan.putra@dsg.id, atau tulis asumsi Anda di README.

## Bagian A — Website Landing + Blog (CMS)
 Website cukup terdiri dari satu halaman landing dan halaman blog. CMS boleh dibangun sendiri atau memakai CMS yang sudah ada (Strapi, Sanity, Payload, Directus, WordPress, dll.); jelaskan alasan pilihan Anda di README.

**Requirements:**

- Landing page: section hero (judul, subjudul, gambar, tombol CTA ke katalog), daftar produk unggulan, testimoni, dan FAQ.
- Konten setiap section (teks, gambar, dan item seperti produk, testimoni, atau pertanyaan FAQ) bisa diedit lewat CMS oleh user non-teknis. Layout dan urutan section boleh tetap di kode.
- Form lead capture (nama, email/WhatsApp) yang datanya tersimpan dan bisa dilihat tim marketing, dengan validasi dan proteksi spam dasar.
- Blog: halaman daftar artikel (dengan pagination) dan halaman detail artikel dengan URL yang mudah dibaca (slug).
- Artikel dikelola lewat CMS: judul, slug, gambar cover, isi (rich text), kategori, dan status draft/publish. Artikel bisa menautkan produk dari marketplace.
- Perubahan konten yang sudah dipublish di CMS harus dapat tampil di website tanpa melakukan deploy ulang secara manual. Jelaskan strategi caching/revalidation yang digunakan dan konsekuensinya terhadap seberapa cepat perubahan tampil di website.

## Bagian B — Mini Marketplace (Frontend)
 Bagian ini cukup frontend saja; tidak perlu membangun backend, database, atau integrasi payment. Data produk boleh berasal dari file JSON atau mock API (misalnya MSW atau json-server). Meski begitu, semua alur harus terasa seperti aplikasi sungguhan dan interaktif.

**Requirements:**

- Katalog (minimal 6 produk) dengan filter kategori.
- Detail produk: screenshot fitur, harga, harga coret saat promo, sisa kuota lisensi promo, serta pilihan paket (Basic/Pro/Business) yang langsung mengubah harga.
- Keranjang: tambah, ubah jumlah lisensi (user/outlet), dan hapus item; subtotal terhitung otomatis; isi keranjang tetap ada saat halaman di-refresh.
- Kuota promo: jumlah lisensi tidak bisa melebihi sisa kuota promo. Jika beberapa pilihan paket dari produk yang sama menggunakan kuota promo yang sama, batas kuota berlaku terhadap total lisensi produk tersebut di dalam keranjang, bukan hanya terhadap masing-masing item/baris.
- Checkout: form data pembeli sederhana (nama dan email) dengan validasi, ringkasan pesanan, lalu simulasi pembayaran yang menampilkan status sukses dan gagal.
- Tangani keadaan loading, error, dan kosong (misalnya keranjang kosong, produk tidak ditemukan, mock API gagal).
- Nyaman dipakai di HP: tombol mudah ditekan dan keranjang mudah diakses dari halaman mana pun.

## Bagian C — Kebutuhan Marketing


**Requirements:**

- Performa mobile: target skor Lighthouse mobile ≥ 80 untuk Performance di landing page.
- Tracking: kirim event view_item, add_to_cart, begin_checkout, dan klik CTA landing page ke dataLayer (format GA4). Event harus merepresentasikan aksi user yang sesuai dan tidak terkirim berulang hanya karena component re-render. Sertakan informasi produk/campaign yang relevan pada payload event. Tidak perlu akun GA sungguhan; cukup buktikan event terkirim.
- UTM: parameter UTM dari link Instagram/TikTok harus tetap teratribusi meskipun user berpindah halaman sebelum mengisi lead form atau melakukan checkout. UTM harus disertakan pada data lead dan payload order checkout (untuk marketplace cukup di payload order mock).

## Bonus (Opsional)
 Kerjakan hanya jika requirement wajib sudah selesai. Bonus tidak bisa menutupi requirement wajib yang belum dikerjakan.
- Pengaturan layout dan urutan section landing page dari CMS (mengubah urutan, menampilkan/menyembunyikan section, atau memilih variasi layout).
- Katalog: urutkan harga, pencarian, dan filter yang tercermin di URL sehingga bisa dibagikan.
- Detail produk: pilihan durasi langganan (bulanan/tahunan) dan tabel perbandingan fitur antar paket.
- Penjadwalan konten promo dari CMS (tayang dan berakhir otomatis pada tanggal tertentu).
- Kode voucher dengan aturan sederhana (minimal belanja, kuota pemakaian).
- Preview/draft konten di CMS sebelum dipublikasikan.
- Test otomatis untuk logika penting (kuota, total harga, voucher).

## Kriteria Penilaian

| Aspek | Max Poin |
|---|---:|
| Fungsionalitas & kualitas kode — fitur berjalan sesuai requirement, proper typing, struktur project rapi | 25 |
| Validasi, error handling & testing — validasi form dan kuota, keadaan loading/error/kosong | 20 |
| Kebutuhan marketing — CMS mudah dipakai non-teknis, performa mobile, tracking | 20 |
| Keputusan teknis — pilihan stack dan arsitektur sesuai skala kebutuhan | 15 |
| Dokumentasi & AI log — README, asumsi, contoh koreksi output AI | 20 |

## Pengumpulan

1.   Push semua kode ke repository Git dan pastikan link deploy bisa diakses.
2.   Kirimkan link repository, link deploy, dan akun CMS demo ke email: recruitment@dsg.id cc: hendrawan.putra@dsg.id, rochman.maarif@dsg.id
3. Subject email: [Skill Test] Fullstack Developer — [Nama Lengkap]

Pertanyaan seputar tes dapat dikirimkan via email ke hendrawan.putra@dsg.id dan akan dijawab maksimal 1×24 jam pada hari kerja.
