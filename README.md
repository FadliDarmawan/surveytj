# Survei Rute Trans Jogja

Aplikasi survei perilaku perjalanan pengguna Trans Jogja, dibangun untuk **Transport for Yogyakarta (TfY)**. Dipakai untuk mengumpulkan data pola perjalanan (asal–tujuan, halte, rute, transit, waktu tempuh, kepuasan) guna mendukung usulan redesain jaringan rute.

## Menjalankan secara lokal

Butuh Node.js 18+.

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Build untuk produksi

```bash
npm run build
```

Hasilnya ada di folder `dist/`, siap di-deploy ke static hosting mana pun (Netlify, Vercel, GitHub Pages, dll).

## Struktur proyek

```
src/
  App.jsx                 # Komponen utama — alur wizard 5 langkah
  main.jsx                # Entry point React
  index.css               # Tailwind directives
  theme.js                # Design tokens (warna, font)
  data/
    routes.js              # Data halte & rute Trans Jogja + helper filter
    wilayah.js              # Data kelurahan/kecamatan/kabupaten DIY
  utils/
    modeIcon.js             # Pemetaan mode transportasi -> ikon
  components/
    ui.jsx                  # Primitif form: Pill, RouteBadge, SearchSelect,
                             # DurationStepper, StepHeader, Field,
                             # MultiChoiceGroup, ChoiceGroup, SatisfactionRow
    JourneyTimeline.jsx      # Visualisasi ringkasan perjalanan
    WilayahPicker.jsx        # Search kelurahan + auto-fill kecamatan/kabupaten
    TfYLogo.jsx              # Komponen logo TfY (recolorable)
    InfoModal.jsx            # Modal Tentang / Kebijakan Privasi / Hubungi Kami
```

## Sumber data

- **Halte & rute**: diekstrak dari `stops.json` dan `index.html` milik peta rute TfY (field `STOP_ORIENTATION`, `DISPLAY_NAMES`, `ROUTE_META`). Kalau data halte/rute berubah, re-generate `src/data/routes.js` dari sumber tersebut.
- **Wilayah administratif**: kelurahan/kecamatan/kabupaten se-DIY, dari Kepmendagri No 300.2.2-2430 Tahun 2025 (via [`cahyadsn/wilayah`](https://github.com/cahyadsn/wilayah)).

## Backend: submit hasil survei ke Neon Postgres

Form sekarang mengirim data lewat `POST /api/submit` (serverless function di `api/submit.js`,
pakai `@neondatabase/serverless`) yang menyimpan setiap submission ke tabel `survey_responses`.

### 1. Siapkan tabel di Neon

Buka [console.neon.tech](https://console.neon.tech) -> project Anda -> **SQL Editor**, lalu
jalankan isi file `schema.sql` (sekali saja).

### 2. Ambil connection string

Di Neon Console -> **Connection Details**, salin connection string versi **pooled**
(hostnamenya mengandung `-pooler`). Contoh:

```
postgresql://user:password@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

### 3. Deploy ke Vercel (paling cepat untuk project ini)

1. Push folder ini ke sebuah repo GitHub.
2. Buka [vercel.com](https://vercel.com) -> **Add New Project** -> import repo tersebut.
   Vercel otomatis mengenali ini sebagai project Vite; tidak perlu ubah build settings.
3. Di **Environment Variables**, tambahkan:
   - `DATABASE_URL` = connection string dari langkah 2
4. Klik **Deploy**. Setelah selesai, situs sudah live dan tombol "Kirim Survei" akan benar-benar
   menyimpan data ke Neon.

### 4. Testing lokal (opsional)

```bash
npm install -g vercel   # sekali saja
cp .env.example .env    # isi DATABASE_URL dengan connection string Neon
vercel dev               # menjalankan frontend + /api/submit sekaligus
```

`npm run dev` (Vite biasa) tidak menjalankan `/api`, jadi untuk mencoba alur submit end-to-end
secara lokal gunakan `vercel dev`.

## Dashboard admin (`/admin`)

Halaman `/admin` menampilkan daftar mentah seluruh hasil survei (dengan paginasi) dan tombol
untuk mengunduh semuanya sebagai `.xlsx`. Dilindungi HTTP Basic Auth sederhana lewat env var:

- `ADMIN_USER`
- `ADMIN_PASSWORD`

Tambahkan keduanya di Vercel -> Environment Variables (sama seperti `DATABASE_URL`), lalu buka
`https://domain-anda.vercel.app/admin` dan masuk memakai kredensial tersebut.

Endpoint yang dipakai:
- `GET /api/admin/responses?page=1&pageSize=50` — list data mentah (JSON)
- `GET /api/admin/export` — file `.xlsx` berisi seluruh data, semua kolom diberi label bahasa Indonesia

> Catatan: peta rute & halte (`index.html` yang sudah Anda buat, dengan data `STOP_ORIENTATION`/`DISPLAY_NAMES`)
> bisa jadi lapisan visualisasi tambahan di `/admin` selanjutnya — upload file itu kalau mau kita satukan.

## Rencana selanjutnya

- Visualisasi peta di dashboard admin (pakai `index.html` peta rute/halte yang sudah ada).
- Partial-save / resume progres (localStorage) antar sesi.
- Logo hitam untuk konteks background terang (baru ada versi putih; komponen `TfYLogo` sudah mendukung prop `color` untuk varian lain).
