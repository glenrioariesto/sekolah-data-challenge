# Sekolah Data Challenge

Game simulasi edukatif untuk siswa belajar mengumpulkan, mengolah, menyajikan, dan menganalisis data kehadiran sekolah.

## Tech Stack

- React 19 (TypeScript)
- Vite 6
- Tailwind CSS v4
- Motion
- Recharts

## Cara Menjalankan

### Prerequisites
- **Node.js** 18+ (disarankan LTS)
- npm (sudah termasuk saat instal Node.js)

### 1. Masuk ke direktori project
```bash
cd sekolah-data-challenge
```

### 2. Instal dependensi
```bash
npm install
```

### 3. Jalankan mode development
```bash
npm run dev
```
Buka di browser: **http://localhost:3000/**

> Base path project: `./` (relatif), cocok untuk preview lokal maupun hosting di subfolder.

### 4. Build untuk produksi
```bash
npm run build
```
Hasil build ada di folder `dist/`.

### 5. Jalankan hasil build secara lokal
```bash
npm run preview
```
Lalu buka URL yang muncul di terminal, biasanya:
**http://localhost:4173/**

### ⚠️ Jangan buka `dist/index.html` dengan drag-and-drop ke browser
Membuka file lewat protokol `file://` akan gagal (CORS / asset tidak termuat). Selalu sajikan `dist/` lewat HTTP, misalnya `npm run preview`, atau deploy ke hosting web.

## Script Lain

| Perintah | Keterangan |
| --- | --- |
| `npm run lint` | Cek TypeScript tanpa emit |
| `npm run clean` | Hapus folder `dist/` |
