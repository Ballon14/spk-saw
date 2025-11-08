# Sistem Pendukung Keputusan - Metode SAW

Sistem pendukung keputusan untuk evaluasi package NPM menggunakan metode **Simple Additive Weighting (SAW)**.

## 🚀 Fitur

- ✅ Implementasi algoritma SAW (Simple Additive Weighting)
- ✅ Evaluasi package NPM berdasarkan multiple kriteria
- ✅ Input bobot kriteria yang dapat disesuaikan
- ✅ **Filter berdasarkan kategori package** (Web Framework, API Framework, Database/ORM, dll)
- ✅ Ranking package berdasarkan skor SAW
- ✅ **UI modern dengan Tailwind CSS v3**
- ✅ **Component-based architecture dengan best practices**
- ✅ Halaman detail untuk setiap package
- ✅ Pagination untuk daftar packages
- ✅ Search functionality

## 🏗️ Teknologi

- **Next.js 14** - React framework dengan App Router
- **React 18** - UI library
- **Tailwind CSS v3** - Utility-first CSS framework
- **PapaParse** - CSV parsing library
- **Component-based Architecture** - Reusable components

## 📦 Struktur Project

```
├── app/
│   ├── api/
│   │   ├── calculate/
│   │   │   └── route.js          # API endpoint untuk perhitungan SAW
│   │   ├── categories/
│   │   │   └── route.js          # API endpoint untuk mendapatkan daftar kategori
│   │   └── packages/
│   │       ├── route.js          # API endpoint untuk daftar packages
│   │       └── [name]/
│   │           └── route.js      # API endpoint untuk detail package
│   ├── packages/
│   │   ├── page.jsx              # Halaman daftar packages
│   │   └── [name]/
│   │       └── page.jsx          # Halaman detail package
│   ├── globals.css               # Global styles dengan Tailwind
│   ├── layout.jsx                # Layout utama aplikasi
│   └── page.jsx                  # Halaman utama (SAW)
├── components/
│   ├── ui/                       # UI Components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Badge.jsx
│   │   ├── Alert.jsx
│   │   └── Spinner.jsx
│   ├── layout/                   # Layout Components
│   │   ├── Header.jsx
│   │   └── Container.jsx
│   ├── saw/                      # SAW-specific Components
│   │   ├── WeightInput.jsx
│   │   ├── WeightSummary.jsx
│   │   └── RankingTable.jsx
│   └── packages/                 # Package-specific Components
│       ├── PackageCard.jsx
│       └── Pagination.jsx
├── lib/
│   ├── csvParser.js              # Utility untuk parsing CSV
│   └── saw.js                    # Implementasi algoritma SAW
├── dataset.csv                   # Dataset package NPM
├── tailwind.config.js            # Konfigurasi Tailwind CSS
├── postcss.config.js             # Konfigurasi PostCSS
└── package.json
```

## 🎨 Component Architecture

### UI Components
Komponen dasar yang dapat digunakan di seluruh aplikasi:
- `Button` - Tombol dengan berbagai variant
- `Card` - Container dengan shadow dan border radius
- `Input` - Input field dengan label dan error handling
- `Select` - Dropdown select dengan options
- `Badge` - Badge untuk menampilkan status atau kategori
- `Alert` - Alert box untuk pesan error/success
- `Spinner` - Loading spinner

### Layout Components
Komponen untuk struktur layout:
- `Header` - Header dengan gradient background
- `Container` - Container dengan max-width dan padding

### Feature Components
Komponen khusus untuk fitur tertentu:
- `WeightInput` - Input untuk bobot kriteria SAW
- `WeightSummary` - Ringkasan total bobot
- `RankingTable` - Tabel hasil ranking SAW
- `PackageCard` - Card untuk menampilkan package
- `Pagination` - Komponen pagination

## 📊 Kriteria Evaluasi

Sistem menggunakan 8 kriteria untuk evaluasi:

1. **Downloads Bulan Terakhir** (Benefit) - Bobot default: 0.20
2. **GitHub Stars** (Benefit) - Bobot default: 0.15
3. **GitHub Forks** (Benefit) - Bobot default: 0.15
4. **Skor Dokumentasi** (Benefit) - Bobot default: 0.15
5. **Skor Aktivitas** (Benefit) - Bobot default: 0.15
6. **Rilis per Tahun** (Benefit) - Bobot default: 0.10
7. **Memiliki Tests** (Benefit) - Bobot default: 0.05
8. **Memiliki CI** (Benefit) - Bobot default: 0.05

**Total bobot harus sama dengan 1.00**

## 🚀 Instalasi

1. Install dependencies:

```bash
npm install
```

2. Pastikan file `dataset.csv` berada di root directory project

3. Jalankan development server:

```bash
npm run dev
```

4. Buka browser di [http://localhost:3000](http://localhost:3000)

## 📖 Cara Menggunakan

### 1. Halaman SAW (Home)
1. **Pilih Kategori Package (Opsional)**
   - Gunakan dropdown "Kategori Package" untuk memfilter package berdasarkan kategori
   - Pilih "Semua Kategori" untuk melihat semua package

2. **Input Bobot Kriteria**
   - Setiap kriteria memiliki input untuk mengatur bobot
   - Pastikan total bobot = 1.00
   - Sistem akan memvalidasi sebelum menghitung

3. **Hitung Ranking**
   - Klik tombol "Hitung Ranking"
   - Sistem akan memproses data dari `dataset.csv` berdasarkan kategori yang dipilih
   - Hasil ranking akan ditampilkan dalam tabel

4. **Lihat Hasil**
   - Tabel menampilkan 100 package teratas
   - Klik nama package untuk melihat detail
   - Package dengan rank 1, 2, 3 memiliki badge khusus (Gold, Silver, Bronze)

### 2. Halaman Packages
1. **Browse Packages**
   - Lihat semua packages dalam dataset
   - Gunakan filter kategori untuk memfilter
   - Gunakan search untuk mencari package berdasarkan nama, deskripsi, atau author

2. **Pagination**
   - Navigasi menggunakan tombol Previous/Next
   - 50 packages per halaman

3. **View Details**
   - Klik card package untuk melihat detail lengkap

### 3. Halaman Detail Package
- Informasi lengkap tentang package
- Statistik (downloads, stars, forks, releases)
- Metrik kualitas (dokumentasi, aktivitas, tests, CI)
- Informasi GitHub
- Links (NPM, homepage, repository)
- Keywords, dependencies, dan informasi lainnya

## 🧮 Metode SAW

Simple Additive Weighting (SAW) adalah metode pengambilan keputusan multi-kriteria yang:

1. **Normalisasi**: Menormalkan nilai setiap kriteria ke range 0-1
   - Benefit: `(value - min) / (max - min)`
   - Cost: `(max - value) / (max - min)`
   - Boolean: `1` jika true, `0` jika false

2. **Perhitungan Skor**: Mengalikan nilai normalisasi dengan bobot kriteria
   ```
   Score = Σ (normalized_value × weight)
   ```

3. **Ranking**: Mengurutkan alternatif berdasarkan skor tertinggi

## 🎨 Styling dengan Tailwind CSS

Aplikasi menggunakan Tailwind CSS v3 dengan konfigurasi custom:
- Custom color palette untuk primary colors
- Utility classes untuk rapid development
- Responsive design dengan breakpoints
- Custom components di `globals.css` menggunakan `@layer components`

## 📝 Best Practices

1. **Component Reusability**: Semua komponen dapat digunakan kembali
2. **Separation of Concerns**: UI components, layout components, dan feature components terpisah
3. **Type Safety**: Menggunakan prop validation (meskipun JavaScript)
4. **Consistent Styling**: Menggunakan Tailwind utility classes
5. **Accessibility**: Semantic HTML dan proper ARIA attributes
6. **Performance**: Code splitting dengan Next.js App Router
7. **Maintainability**: Struktur folder yang jelas dan terorganisir

## 📄 License

MIT