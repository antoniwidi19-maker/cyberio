# Cyberio

Website edukasi tentang privasi digital, literasi digital, dan perilaku digital yang bertanggung jawab (Section 6 sampai 9), dengan background 3D interaktif dan login email dan password menggunakan Firebase Authentication.

## Struktur file

```
cyberio/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── script.js       (interaksi halaman: progres, tab, navigasi, reveal)
    ├── background.js   (background 3D Three.js, dengan fallback)
    └── auth.js         (login, daftar, reset password, logout)
```

## 1. Konfigurasi Firebase

1. Buka https://console.firebase.google.com lalu klik **Add project**. Ikuti langkahnya sampai project terbuat.
2. Di halaman project, klik ikon **Web** (`</>`) untuk menambahkan aplikasi web. Beri nama bebas, misalnya `cyberio-web`. Jangan centang hosting Firebase.
3. Firebase akan menampilkan objek `firebaseConfig`. Salin nilainya.
4. Buka `js/auth.js`, lalu ganti nilai di bagian `firebaseConfig`:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
5. Di menu kiri Firebase, buka **Build > Authentication**, lalu klik **Get started**.
6. Buka tab **Sign-in method**, pilih **Email/Password**, aktifkan, lalu simpan.
7. Masih di Authentication, buka tab **Settings > Authorized domains**, lalu tambahkan:
   - `antoniwidi19-maker.github.io` (domain GitHub Pages)
   - `localhost` (untuk tes di komputer sendiri, biasanya sudah ada)

Tanpa langkah 7, login akan gagal dengan pesan "Domain ini belum diizinkan di Firebase".

Catatan keamanan: `apiKey` Firebase untuk web memang boleh terlihat di kode publik. Keamanannya dijaga oleh daftar Authorized domains dan aturan Firebase. Jangan pernah memasukkan private key atau Admin SDK ke dalam repo ini.

## 2. Deploy ke GitHub Pages

1. Pastikan semua file (`index.html`, `css/`, `js/`) sudah ada di branch `main` repo `cyberio`.
2. Buka repo di GitHub, lalu pilih **Settings > Pages**.
3. Di bagian **Build and deployment**, pilih **Source: Deploy from a branch**.
4. Pilih branch **main** dan folder **/ (root)**, lalu klik **Save**.
5. Tunggu 1 sampai 3 menit. Website bisa dibuka di:
   `https://antoniwidi19-maker.github.io/cyberio/`

Semua path di proyek ini relatif (`css/style.css`, `js/auth.js`), jadi berjalan normal di GitHub Pages.

## 3. Menjalankan di komputer sendiri

1. Simpan semua file dengan struktur folder seperti di atas.
2. Pasang ekstensi **Live Server** di VS Code, lalu klik kanan `index.html` dan pilih **Open with Live Server**.
3. Login di localhost hanya berfungsi jika `localhost` sudah ada di Authorized domains.

Catatan: modul ES (`type="module"`) tidak berjalan jika file dibuka langsung dengan klik dua kali (`file://`). Gunakan Live Server atau GitHub Pages.

## 4. Fitur

- Background 3D: bola kaca transparan, cincin, bentuk geometris wireframe, partikel, gelombang liquid glass, dan glow emerald. Bergerak halus dan mengikuti posisi mouse.
- Fallback: jika WebGL atau CDN Three.js tidak tersedia, background gradient tetap tampil.
- Reduced motion: jika pengguna mengaktifkan pengurangan gerakan di sistem, background hanya dirender satu kali tanpa animasi.
- Ringan di HP: jumlah objek dan kualitas render dikurangi di layar lebar kurang dari 720px. Animasi berhenti saat tab tidak aktif.
- Login: daftar, masuk, keluar, lupa kata sandi (kirim email reset), validasi email dan kata sandi, pesan error dalam bahasa Indonesia, dan status login di navbar.
- Sesi login tetap tersimpan antar kunjungan (diatur oleh Firebase).
- Tanpa login, seluruh konten tetap bisa dibaca.

Aturan kata sandi: minimal 8 karakter, berisi huruf dan angka.

## 5. Mengubah pengaturan

- Jumlah objek 3D: ubah nilai `nSphere`, `nTorus`, `nIco`, dan `nP` di `js/background.js`.
- Warna background: ubah nilai hex di `js/background.js` (`0x5fd0b3` untuk emerald terang, `0x1d6b58` untuk hijau tua).
- Warna website: ubah variabel di bagian `:root` pada `css/style.css`.
- Aturan kata sandi: ubah fungsi `validPassword` di `js/auth.js`.

## 6. Pemecahan masalah

- **Halaman tampil polos tanpa gaya:** pastikan `css/style.css` berada di folder `css/` dan `index.html` dibuka dari folder yang sama.
- **Tombol Masuk menampilkan "Firebase belum dikonfigurasi":** `firebaseConfig` di `js/auth.js` belum diisi.
- **"Domain ini belum diizinkan di Firebase":** domain belum ditambahkan di Authorized domains (lihat langkah 7).
- **Background 3D tidak muncul:** buka Console di browser (F12). Jika ada error dari `cdn.jsdelivr.net`, berarti jaringan atau ekstensi browser memblokir CDN. Fallback gradient akan tetap tampil.
- **Email reset tidak masuk:** cek folder spam. Pastikan email yang dimasukkan sudah terdaftar.
