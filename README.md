# Digital Citizen

Website edukasi tentang privasi digital, literasi digital, dan perilaku digital yang bertanggung jawab (Section 6 sampai 9).

## Struktur folder

```
digital-citizen/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## Cara menjalankan

1. Simpan semua file dengan struktur folder seperti di atas.
2. Buka index.html di browser (Chrome, Edge, Firefox, atau Safari).
3. Untuk pengembangan, gunakan ekstensi Live Server di VS Code agar perubahan langsung terlihat.

Font diambil dari Google Fonts sehingga membutuhkan koneksi internet. Jika offline, halaman tetap tampil dengan font cadangan.

## Fitur

- Navigasi sticky dengan penanda section yang sedang dibaca
- Indikator progres membaca di bagian atas
- Accordion untuk informasi tambahan
- Tab navigasi untuk berpindah submateri di Section 7
- Timeline interaktif untuk alur phishing
- Diagram SVG dengan animasi garis
- Kartu dengan efek hover di Section 6 dan 8
- Efek parallax pada hero Section 6
- Animasi saat elemen masuk ke layar
- Tema gelap mengikuti pengaturan perangkat
- Menghormati pengaturan pengurangan animasi (prefers-reduced-motion)

## Kustomisasi

- Warna dan tema: ubah variabel di bagian :root pada css/style.css
- Teks dan materi: edit langsung di index.html
- Tampilan dan animasi: css/style.css
- Perilaku interaktif (progres, tab, navigasi): js/script.js

## Catatan

- Website ini bersifat edukatif dan tidak memuat kuis maupun sistem skor.
- Diagram penyebaran data adalah ilustrasi, bukan data nyata.
- Tidak ada statistik yang ditampilkan. Tambahkan statistik hanya jika sumbernya jelas dan dapat diverifikasi.

## Rencana berikutnya

- Menambahkan Section 1 sampai 5 ke dalam struktur yang sama.
