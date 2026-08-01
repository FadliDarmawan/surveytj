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

## Yang belum ada (belum di-wire ke backend)

- Penyimpanan/pengiriman hasil survei ke server (submit saat ini hanya mengubah state lokal).
- Partial-save / resume progres (localStorage) antar sesi.
- Logo hitam untuk konteks background terang (baru ada versi putih; komponen `TfYLogo` sudah mendukung prop `color` untuk varian lain).
