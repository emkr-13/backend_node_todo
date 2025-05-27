# Todo List

Teknologi yang digunakan:

- TypeScript
- Node.js (TS)
- Drizzle ORM
- PostgreSQL (database)
- Swagger 

## Installation

### Step 1: Setup Environment

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```
### Step 2: Install Dependencies

Jalankan perintah berikut untuk menginstal semua package:

```bash
npm install
```

## Menjalankan Migration dan Seeder

Untuk informasi lebih lanjut, baca dokumentasi resmi di [Drizzle ORM Documentation](https://orm.drizzle.team/docs/get-started/postgresql-new).

### Step 1: Generate dari Model

```bash
npx drizzle-kit generate
```

### Step 2: Menjalankan Migration

```bash
npx drizzle-kit push
```

### Step 3: Menjalankan Seeder

Jalankan file seeder kalau ingin sesuai dengan nama file di folder `seeders`. Contoh:

```bash
ts-node src/seeders/userSeeder.ts
```

## Menjalankan Aplikasi

Untuk menjalankan aplikasi, gunakan perintah berikut:

```bash
npm run dev
```
## Access The APi

```bash
Access the application at http://localhost:${PORT}
```

## Dokumentasi 

Untuk Melihatkan Dokumentasi sebagai

```bash
# Untuk Dokumentasi
Access API documentation at http://localhost:${PORT}/api-docs
# Untuk JSON
Access Swagger JSON at http://localhost:${PORT}/api-docs.json
```

## Test
Untuk Melakukan Testing dengan menjalan perintah berikut :

```bash
npm test
```