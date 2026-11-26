# Cyberio

Website edukasi tentang privasi digital, literasi digital, dan perilaku digital yang bertanggung jawab (Section 6 sampai 9), dengan background 3D dan login email dan password memakai Firebase Authentication.

## Struktur file

Semua file berada di root repo, sejajar dengan `index.html`:

```
cyberio/
├── index.html
├── style.css
├── script.js
├── background.js
├── auth.js
└── README.md
```

## 1. Konfigurasi Firebase

1. Buka https://console.firebase.google.com, lalu klik **Add project**.
2. Di halaman project, klik ikon **Web** (`</>`) untuk menambahkan aplikasi web. Jangan centang hosting Firebase.
3. Salin nilai `firebaseConfig` yang ditampilkan.
4. Buka `auth.js`, lalu ganti nilai `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, dan `appId`.
5. Buka **Build > Authentication**, klik **Get started**.
6. Buka tab **Sign-in method**, pilih **Email/Password**, aktifkan, lalu simpan.
7. Buka tab **Settings > Authorized domains**, lalu pastikan ada:
   - `antoniwidi19-maker.github.io`
   - `localhost`

Tanpa langkah 7, login akan gagal dengan pesan "Domain ini belum diizinkan di Firebase".

`apiKey` pada konfigurasi web memang boleh terlihat di kode publik. Yang dijaga adalah daftar Authorized domains. Jangan pernah memasukkan private key atau Admin SDK ke repo.

## 2. Deploy ke GitHub Pages

1. Upload semua file di atas ke branch `main` repo `cyberio`.
2. Buka **Settings > Pages**.
3. Di **Build and deployment**, pilih **Deploy from a branch**, lalu pilih branch **main** dan folder **/ (root)**.
4. Klik **Save**, lalu tunggu 1 sampai 3 menit.
5. Website dapat dibuka di `https://antoniwidi19-maker.github.io/cyberio/`.

## 3. Menjalankan di komputer sendiri

Jangan buka `index.html` dengan klik dua kali, karena `background.js` dan `auth.js` memakai `type="module"` yang tidak berjalan dari `file://`. Gunakan ekstensi **Live Server** di VS Code, lalu pilih **Open with Live Server**. Login di localhost hanya berfungsi jika `localhost` sudah ada di Authorized domains.

## 4. Fitur

- Background 3D berisi bola kaca, cincin, bentuk wireframe, partikel, gelombang, dan glow emerald, yang bergerak halus dan mengikuti mouse.
- Fallback gradient tetap tampil jika WebGL atau CDN Three.js tidak tersedia.
- Jika pengguna mengaktifkan pengurangan gerakan di sistem, background hanya dirender satu kali tanpa animasi.
- Di layar kecil (di bawah 720px), jumlah objek dikurangi. Animasi berhenti saat tab tidak aktif.
- Daftar, masuk, keluar, dan lupa kata sandi (kirim email reset), dengan validasi dan pesan error dalam bahasa Indonesia.
- Status login tampil di navbar dan tetap tersimpan antar kunjungan.
- Pengunjung tanpa login tetap bisa membaca seluruh konten.

Aturan kata sandi: minimal 8 karakter, berisi huruf dan angka.

## 5. Pemecahan masalah

- **Halaman tampil polos tanpa gaya:** pastikan `style.css` berada di root, sejajar dengan `index.html`.
- **Tombol Masuk menampilkan "Firebase belum dikonfigurasi":** `firebaseConfig` di `auth.js` belum diisi.
- **"Domain ini belum diizinkan di Firebase":** domain belum ada di Authorized domains (langkah 7).
- **Background 3D tidak muncul:** buka Console (F12). Jika ada error dari `cdn.jsdelivr.net`, jaringan atau ekstensi browser memblokir CDN. Fallback gradient tetap tampil.
- **Email reset tidak masuk:** cek folder spam, dan pastikan email sudah terdaftar.
