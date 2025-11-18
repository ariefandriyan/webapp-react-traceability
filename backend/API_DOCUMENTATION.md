# MENTAS Tobacco Traceability - Backend API Documentation

## Base URL
```
http://localhost:3000
```

## Overview
RESTful API untuk sistem traceability tembakau MENTAS. Saat ini tersedia endpoint untuk master data Petani dengan operasi CRUD lengkap.

---

## Authentication
**Status**: Belum diimplementasikan (akan ditambahkan di versi berikutnya)

---

## Endpoints

### Health Check

#### GET /health
Cek status server.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-11-06T21:30:00.000Z"
}
```

---

## Petani (Farmer) Endpoints

### 1. Get All Petani (with Pagination & Search)

#### GET /api/petani

Mendapatkan daftar semua petani dengan fitur pagination, pencarian, dan filter.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Nomor halaman |
| limit | integer | No | 10 | Jumlah data per halaman (max: 100) |
| search | string | No | - | Pencarian berdasarkan nama, NIK, telepon, atau email |
| status | string | No | - | Filter berdasarkan status: `aktif` atau `nonaktif` |
| sort_by | string | No | id | Field untuk sorting: `id`, `nik`, `nama_lengkap`, `created_at`, `updated_at` |
| order | string | No | DESC | Urutan sorting: `ASC` atau `DESC` |

**Example Request:**
```bash
# Get all petani (default pagination)
curl http://localhost:3000/api/petani

# Get page 2 with 20 items per page
curl "http://localhost:3000/api/petani?page=2&limit=20"

# Search by name
curl "http://localhost:3000/api/petani?search=Ahmad"

# Filter by status
curl "http://localhost:3000/api/petani?status=aktif"

# Sort by name ascending
curl "http://localhost:3000/api/petani?sort_by=nama_lengkap&order=ASC"

# Combined: search + filter + sort
curl "http://localhost:3000/api/petani?search=Ahmad&status=aktif&sort_by=nama_lengkap&order=ASC"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data petani berhasil diambil",
  "data": [
    {
      "id": 1,
      "nik": "3507021234567890",
      "nama_lengkap": "Ahmad Suryadi",
      "tanggal_lahir": "1985-05-15",
      "jenis_kelamin": "L",
      "alamat": "Jl. Tembakau No. 123",
      "kelurahan": "Sanan Wetan",
      "kecamatan": "Blimbing",
      "kota_kabupaten": "Malang",
      "provinsi": "Jawa Timur",
      "kode_pos": "65131",
      "no_telepon": "081234567890",
      "email": "ahmad@example.com",
      "kelompok_tani_id": null,
      "status": "aktif",
      "created_at": "2024-11-06T21:00:00.000Z",
      "updated_at": "2024-11-06T21:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 2. Get Petani by ID

#### GET /api/petani/:id

Mendapatkan detail petani berdasarkan ID.

**URL Parameters:**
- `id` (integer, required): ID petani

**Example Request:**
```bash
curl http://localhost:3000/api/petani/1
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data petani berhasil diambil",
  "data": {
    "id": 1,
    "nik": "3507021234567890",
    "nama_lengkap": "Ahmad Suryadi",
    "tanggal_lahir": "1985-05-15",
    "jenis_kelamin": "L",
    "alamat": "Jl. Tembakau No. 123",
    "kelurahan": "Sanan Wetan",
    "kecamatan": "Blimbing",
    "kota_kabupaten": "Malang",
    "provinsi": "Jawa Timur",
    "kode_pos": "65131",
    "no_telepon": "081234567890",
    "email": "ahmad@example.com",
    "kelompok_tani_id": null,
    "status": "aktif",
    "created_at": "2024-11-06T21:00:00.000Z",
    "updated_at": "2024-11-06T21:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Petani tidak ditemukan"
}
```

---

### 3. Create Petani

#### POST /api/petani

Membuat data petani baru.

**Request Body:**
```json
{
  "nik": "3507021234567890",
  "nama_lengkap": "Ahmad Suryadi",
  "tanggal_lahir": "1985-05-15",
  "jenis_kelamin": "L",
  "alamat": "Jl. Tembakau No. 123",
  "kelurahan": "Sanan Wetan",
  "kecamatan": "Blimbing",
  "kota_kabupaten": "Malang",
  "provinsi": "Jawa Timur",
  "kode_pos": "65131",
  "no_telepon": "081234567890",
  "email": "ahmad@example.com",
  "kelompok_tani_id": null,
  "status": "aktif"
}
```

**Field Requirements:**

| Field | Type | Required | Validations |
|-------|------|----------|-------------|
| nik | string | Yes | 16 digit numeric, unique |
| nama_lengkap | string | Yes | 3-100 characters |
| tanggal_lahir | date | Yes | Format: YYYY-MM-DD |
| jenis_kelamin | string | Yes | 'L' or 'P' |
| alamat | string | Yes | - |
| kelurahan | string | Yes | - |
| kecamatan | string | Yes | - |
| kota_kabupaten | string | Yes | - |
| provinsi | string | Yes | - |
| kode_pos | string | No | 5 digit numeric |
| no_telepon | string | Yes | Valid phone format |
| email | string | No | Valid email format, unique |
| kelompok_tani_id | integer | No | - |
| status | string | No | 'aktif' or 'nonaktif', default: 'aktif' |

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/petani \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "3507021234567890",
    "nama_lengkap": "Ahmad Suryadi",
    "tanggal_lahir": "1985-05-15",
    "jenis_kelamin": "L",
    "alamat": "Jl. Tembakau No. 123",
    "kelurahan": "Sanan Wetan",
    "kecamatan": "Blimbing",
    "kota_kabupaten": "Malang",
    "provinsi": "Jawa Timur",
    "kode_pos": "65131",
    "no_telepon": "081234567890",
    "email": "ahmad@example.com",
    "status": "aktif"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Petani berhasil ditambahkan",
  "data": {
    "id": 1,
    "nik": "3507021234567890",
    "nama_lengkap": "Ahmad Suryadi",
    // ... semua field
  }
}
```

**Error Response (400) - Validation:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "nik",
      "message": "NIK harus 16 digit"
    },
    {
      "field": "email",
      "message": "Format email tidak valid"
    }
  ]
}
```

**Error Response (409) - Duplicate:**
```json
{
  "success": false,
  "message": "NIK atau email sudah terdaftar"
}
```

---

### 4. Update Petani

#### PUT /api/petani/:id

Mengupdate data petani berdasarkan ID.

**URL Parameters:**
- `id` (integer, required): ID petani

**Request Body:**
Semua field bersifat optional. Hanya field yang dikirim yang akan diupdate.

```json
{
  "nama_lengkap": "Ahmad Suryadi Updated",
  "no_telepon": "081234567899",
  "status": "nonaktif"
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/petani/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nama_lengkap": "Ahmad Suryadi Updated",
    "status": "nonaktif"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Petani berhasil diupdate",
  "data": {
    "id": 1,
    "nik": "3507021234567890",
    "nama_lengkap": "Ahmad Suryadi Updated",
    // ... semua field dengan nilai terbaru
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Petani tidak ditemukan"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "NIK atau email sudah digunakan oleh petani lain"
}
```

---

### 5. Delete Petani

#### DELETE /api/petani/:id

Menghapus data petani berdasarkan ID.

**URL Parameters:**
- `id` (integer, required): ID petani

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/petani/1
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Petani berhasil dihapus"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Petani tidak ditemukan"
}
```

---

### 6. Get Petani Statistics

#### GET /api/petani/stats

Mendapatkan statistik jumlah petani berdasarkan status.

**Example Request:**
```bash
curl http://localhost:3000/api/petani/stats
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Statistik petani berhasil diambil",
  "data": {
    "total": 150,
    "aktif": 130,
    "nonaktif": 20
  }
}
```

---

## Error Responses

### 400 Bad Request
Terjadi ketika ada validation error atau bad input.

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "field_name",
      "message": "Error message"
    }
  ]
}
```

### 404 Not Found
Resource tidak ditemukan.

```json
{
  "success": false,
  "message": "Petani tidak ditemukan"
}
```

### 409 Conflict
Terjadi ketika ada duplicate unique constraint (NIK atau email).

```json
{
  "success": false,
  "message": "NIK atau email sudah terdaftar"
}
```

### 500 Internal Server Error
Error pada server.

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Testing Examples

### Using curl

```bash
# 1. Health check
curl http://localhost:3000/health

# 2. Get all petani
curl http://localhost:3000/api/petani

# 3. Get petani stats
curl http://localhost:3000/api/petani/stats

# 4. Create petani
curl -X POST http://localhost:3000/api/petani \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "3507021234567890",
    "nama_lengkap": "Test Petani",
    "tanggal_lahir": "1990-01-01",
    "jenis_kelamin": "L",
    "alamat": "Jl. Test",
    "kelurahan": "Test",
    "kecamatan": "Test",
    "kota_kabupaten": "Test",
    "provinsi": "Test",
    "no_telepon": "081234567890"
  }'

# 5. Get petani by ID
curl http://localhost:3000/api/petani/1

# 6. Update petani
curl -X PUT http://localhost:3000/api/petani/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "nonaktif"}'

# 7. Delete petani
curl -X DELETE http://localhost:3000/api/petani/1
```

### Using JavaScript (fetch)

```javascript
// Create petani
const createPetani = async () => {
  const response = await fetch('http://localhost:3000/api/petani', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nik: '3507021234567890',
      nama_lengkap: 'Test Petani',
      tanggal_lahir: '1990-01-01',
      jenis_kelamin: 'L',
      alamat: 'Jl. Test',
      kelurahan: 'Test',
      kecamatan: 'Test',
      kota_kabupaten: 'Test',
      provinsi: 'Test',
      no_telepon: '081234567890'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// Get all petani with search
const getAllPetani = async () => {
  const response = await fetch('http://localhost:3000/api/petani?search=Test&status=aktif');
  const data = await response.json();
  console.log(data);
};
```

---

## Database Schema

### Table: petani

| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT |
| nik | VARCHAR(16) | UNIQUE, NOT NULL, INDEX |
| nama_lengkap | VARCHAR(100) | NOT NULL |
| tanggal_lahir | DATE | NOT NULL |
| jenis_kelamin | ENUM('L','P') | NOT NULL |
| alamat | TEXT | NOT NULL |
| kelurahan | VARCHAR(100) | NOT NULL |
| kecamatan | VARCHAR(100) | NOT NULL |
| kota_kabupaten | VARCHAR(100) | NOT NULL |
| provinsi | VARCHAR(100) | NOT NULL |
| kode_pos | VARCHAR(5) | NULL |
| no_telepon | VARCHAR(15) | NOT NULL |
| email | VARCHAR(100) | UNIQUE, NULL, INDEX |
| kelompok_tani_id | INTEGER | NULL, FOREIGN KEY |
| status | ENUM('aktif','nonaktif') | NOT NULL, DEFAULT 'aktif', INDEX |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE |

---

## Development Notes

### Running the Server

```bash
# Development mode (with nodemon auto-reload)
npm run dev

# Production mode
npm start
```

### Database Migrations

```bash
# Run migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Undo all migrations
npm run db:migrate:undo:all
```

### Database Seeders

```bash
# Run all seeders
npm run db:seed

# Undo last seeder
npm run db:seed:undo

# Undo all seeders
npm run db:seed:undo:all
```

---

## Future Development

### Planned Features:
1. **Authentication & Authorization**
   - JWT token based authentication
   - Role-based access control (Admin, Manager, Petani)
   - Login/Logout endpoints

2. **Additional Master Data**
   - Kelompok Tani (Farmer Groups)
   - Lahan (Land/Fields)
   - Varietas Tembakau (Tobacco Varieties)

3. **Traceability Features**
   - Aktivitas Budidaya (Cultivation Activities)
   - Panen (Harvest)
   - Pengolahan (Processing)
   - Distribusi (Distribution)
   - QR Code generation

4. **Reporting**
   - Export to Excel/PDF
   - Custom reports
   - Analytics dashboard data

5. **File Upload**
   - Photo upload for petani profile
   - Document attachments
   - QR code images

---

## Contact & Support

Untuk pertanyaan atau bantuan, silakan hubungi tim development.

**Version:** 1.0.0  
**Last Updated:** November 6, 2024
