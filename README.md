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

## Visualisasi rute di peta (`/admin` -> tombol "Peta")

Setiap baris di dashboard admin punya tombol **Peta** yang membuka modal berisi peta rute
(`public/map/index.html` — file peta MapLibre yang sudah Anda buat, disalin apa adanya) dan
menggambar perjalanan responden tersebut: board -> (transfer) -> alight, persis seperti fitur
"Plan a trip" di peta itu, tapi digambar dari jawaban survei, bukan hasil pathfinding.

Cara kerjanya: `TripMapModal` memuat peta dalam `<iframe>`, menunggu event `cartography:ready`
(sudah ada di file peta Anda, awalnya untuk `cartography.html`), lalu memanggil
`iframe.contentWindow.renderReportedTrip(legs)` — satu fungsi kecil yang saya tambahkan di akhir
script peta, yang memakai ulang fungsi-fungsi yang sudah ada di sana (`getRouteSegment`,
`setPlannedRoute`, `renderPlanMarkers`, dst). Nama halte dari survei (versi "cantik", mis.
"Ambarukmo (Selatan Jalan)") dikonversi balik ke nama asli stops.json (mis. "Ambarukmo - A")
lewat tabel yang sudah ada di `src/data/routes.js`.

**Status data saat ini:**

- `public/map/routes/` sudah berisi 11 rute: `1A, 1B, 2A, 2B, 3A, 3B, 4A, 4B, 5A, 5B, 6` — format file Anda cocok
  persis dengan yang dibaca `loadRoutes()` (envelope `{license, description, ..., data: {type, features,
  coordinates, stops, loop}}`), jadi tidak ada konversi yang diperlukan, tinggal ditambah rute sisanya
  begitu Anda selesai format.
- `public/map/stops/stops.json` **sementara di-generate otomatis** dari koordinat vertex yang sudah
  tertanam di 11 file rute itu sendiri (setiap rute punya `stops: [{name, vertex}]`, koordinatnya diambil
  dari `coordinates[vertex]`). Hasilnya 290 halte, dan nama-namanya sudah dicek cocok 100% dengan tabel
  `raw` di `src/data/routes.js`. Ini cukup untuk membuat peta & visualisasi rute berfungsi sekarang, tapi
  kalau Anda punya `stops.json` "asli" dari sumber lain (dengan `is_departure_hub`/`destinations` yang
  akurat, dipakai fitur "Show final destination" di peta), boleh timpa file ini kapan saja.
- Begitu rute sisanya (`8, 9, 10, 11, 12, 13, 14, 15, L1`, dst) selesai diformat, tinggal drop ke
  `public/map/routes/<ID>.json` — tidak perlu ubah kode. `stops.json` juga sebaiknya di-generate ulang
  saat itu (atau saya bantu regenerate) supaya halte-halte rute baru ikut masuk.

## Rencana selanjutnya

- Tambahkan sisa rute (`8, 9, 10, 11, 12, 13, 14, 15, L1`, dst.) ke `public/map/routes/` begitu selesai diformat.
- Timpa `stops.json` dengan versi "asli" (destinations/departure hub akurat) kalau tersedia.
- Partial-save / resume progres (localStorage) antar sesi.
- Logo hitam untuk konteks background terang (baru ada versi putih; komponen `TfYLogo` sudah mendukung prop `color` untuk varian lain).
