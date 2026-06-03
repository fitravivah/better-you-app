[README.md](https://github.com/user-attachments/files/28540545/README.md)
<!-- @dsCard group="Brand" -->
# Kalori — Daily Ritual

> Pelacak kalori harian dengan estetika hangat & mindful — *"rawat tubuhmu, jangan hukum."*

Web app pencatat kalori berbahasa Indonesia. Dibangun untuk Better You sebagai prototipe — fokus pada konsistensi yang sadar, bukan obsesi angka. Catat makanan secara manual atau lewat **AI parsing** (bahasa natural), tinjau ritme harian / mingguan / bulanan, dan sesuaikan target lewat profil yang bisa diedit penuh.

![Kalori Dashboard](assets/preview.png)

---

## ✨ Fitur

- **Login** — halaman masuk terpisah dengan session via `localStorage`
- **Dashboard harian** — ring kalori, makro (protein/karbo/lemak), rincian per waktu makan
- **Catat lewat AI** — ketik *"nasi setengah piring, ayam goreng, teh manis"* → otomatis terparse jadi entri
- **Tab Minggu** — bar chart 7-hari dengan filter periode (minggu ini / lalu / custom)
- **Tab Laporan** — kalender heatmap bulanan, streak, tren mingguan, filter rentang tanggal
- **Profil editable** — identitas, data tubuh, tujuan; TDEE/BMR auto-kalkulasi (Mifflin-St Jeor); status simpan real-time
- **Tweaks panel** — ganti palette (Mono / Ink / Paper) & density on-the-fly

## 🎨 Sistem desain

| Token | Nilai |
|---|---|
| **Display / angka** | `Anton` (condensed sport sans) |
| **Body** | `Open Sans` |
| **Palette** | Monokrom hitam–putih + 5 warna semantik chart |
| **Warna chart** | Pada target (hijau) · Di bawah (biru) · Melampaui (oranye) · Hari ini (merah-clay) |

---

## 🚀 Menjalankan

Aplikasi ini **100% statis** — tanpa build step. JSX di-transpile di browser via Babel Standalone.

### Opsi 1 — Buka langsung
Karena browser memblokir `file://` untuk memuat modul, jalankan lewat server lokal:

```bash
# Python
python3 -m http.server 8000

# atau Node
npx serve
```

Lalu buka `http://localhost:8000`.

### Opsi 2 — GitHub Pages
1. Push repo ini ke GitHub
2. **Settings → Pages → Source: `main` / `root`**
3. Akses di `https://<username>.github.io/kalori-dashboard/`

> Halaman `index.html` akan redirect ke `login.html` jika belum ada session. Setelah "masuk", session tersimpan di `localStorage` dan kamu masuk ke dashboard.

---

## 📁 Struktur repository

```
kalori-dashboard/
├── index.html              # Dashboard (entry; redirect ke login bila belum ada sesi)
├── login.html              # Halaman masuk
├── README.md
├── LICENSE
├── .gitignore
├── assets/
│   ├── better-you-logo.png # Logo brand
│   └── hero-gym.jpg        # Foto hero halaman login
└── src/
    ├── icons.jsx           # Set ikon garis (stroke 1.6)
    ├── components.jsx      # Sidebar, ring, chart, modal, AI dock, filter periode
    ├── login.jsx           # Komponen layar Login
    ├── app.jsx             # Root app, state, semua view (dashboard/minggu/laporan/profil)
    └── tweaks-panel.jsx    # Panel tweak (palette & density)
```

### Alur data

- **Session** → `localStorage["kalori.user"]` (JSON profil pengguna)
- **State app** → React `useState` di `app.jsx` (foods, target, view aktif)
- **Data sample** → di-generate seeded-random per periode agar stabil saat navigasi
- **AI parsing** → `window.claude.complete()` (hanya aktif di environment yang menyediakannya)

---

## ⚙️ Catatan teknis

- React 18.3.1 + Babel Standalone (pinned + SRI hash) via unpkg CDN
- Tiap file `.jsx` punya scope sendiri; komponen di-share lewat `Object.assign(window, {...})` di akhir file
- Tidak ada dependency npm — cukup file statis
- Fitur **AI** memerlukan runtime `window.claude`; tanpa itu, gunakan input manual

## 📄 Lisensi

MIT — lihat [LICENSE](LICENSE).

Logo & nama *Better You* adalah properti pemiliknya masing-masing; dipakai di sini hanya untuk keperluan prototipe.
