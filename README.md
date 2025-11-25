# 🎸 BAND PORTAL  
Platform Portofolio Band – Project 1 & Project 2

Website ini dibuat sebagai implementasi tugas **Pemrograman Web 1**, terdiri dari:

- **Project 1:** Frontend Web Portofolio Band  
- **Project 2:** Backend API + Pengujian menggunakan *Bruno*  
- Integrasi frontend dengan backend (Register, Login, CRUD Portfolio)

---

## 🚀 1. Fitur Project 1 (Frontend)

### ✔ Halaman utama (index.html)
- Menampilkan hero section
- Tombol berbeda untuk user login & non-login
- Navbar dinamis sesuai status login

### ✔ Halaman detail publik (detail.html)
- Menampilkan portofolio band (tanpa harus login)
- Bisa menampilkan band lain dengan `?userId=...`
- Menampilkan informasi band (bio, genre, kontak)

### ✔ Halaman login (login.html)
- Validasi input
- Pesan error/sukses tidak memakai alert
- Redirect ke dashboard setelah login

### ✔ Halaman register (register.html)
- Validasi lengkap: bandName, email, username, password
- Pesan error/sukses tampil cantik

### ✔ Dashboard (main.html)
- Upload portofolio
- Melihat daftar portofolio sendiri
- Statistik jumlah karya
- Hapus item (CRUD API terhubung)

### ✔ Responsif & styled dengan CSS modern

---

## 🛠️ 2. Fitur Project 2 (Backend API)

Backend dibuat menggunakan:

- **Node.js + Express**
- **MySQL**
- CORS Protection
- `.env` configuration

### 🔧 Endpoint API

#### **Auth**
| Method | Endpoint | Fungsi |
|--------|----------|---------|
| POST | `/api/auth/register` | Registrasi band |
| POST | `/api/auth/login` | Login band |
| GET | `/api/portfolio?userId=ID` | Ambil semua portfolio band |
| POST | `/api/portfolio` | Tambah item portfolio |



## 🧪 Pengujian API (Bruno)

### Register
![Register](screenshots/register.png)

### Login
![Login](screenshots/login.png)

### Create Portfolio
![Create Portfolio](screenshots/create.png)

### Get Portfolio
![Get Portfolio](screenshots/get.png)

## 🧪 Tampilan Web

### Register
![Register](screenshots/daftar.png)

### Login
![Login](screenshots/masuk.png)

### Home
![Register](screenshots/home.png)

### Dashboard
![Login](screenshots/dashboard.png)

### About Band
![Login](screenshots/about.png)
