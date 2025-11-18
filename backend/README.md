# MENTAS Tobacco Traceability - Backend API

Backend API untuk sistem traceability tembakau MENTAS Universitas Brawijaya, dibangun menggunakan Node.js, Express, dan Sequelize ORM.

## 🚀 Features

- ✅ RESTful API architecture
- ✅ MySQL database dengan Sequelize ORM
- ✅ Comprehensive input validation (express-validator)
- ✅ Error handling middleware
- ✅ CORS support untuk frontend integration
- ✅ Hot reload development (nodemon)
- ✅ Database migrations dan seeders
- ✅ Pagination, search, dan filter
- ✅ Request logging (development mode)

## 📋 Prerequisites

- Node.js >= 14.x
- npm >= 6.x
- MySQL/MariaDB >= 5.7

## 🛠️ Installation

### 1. Clone & Navigate

```bash
cd /Users/ariefandriyan/Projects/ub-tobacco-traceability/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

File `.env` sudah dikonfigurasi dengan koneksi database:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mentas_tobacco_traceability
DB_USER=root
DB_PASSWORD=Password.00
DB_DIALECT=mysql

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

> **Note**: Pastikan database `mentas_tobacco_traceability` sudah dibuat di MySQL.

### 4. Run Migrations

```bash
npm run db:migrate
```

Output yang diharapkan:
```
Sequelize CLI [Node: xx.x.x, CLI: 6.6.2, ORM: 6.37.5]

Loaded configuration file "src/config/database.js".
Using environment "development".
== 20251106210456-create-petani: migrating =======
== 20251106210456-create-petani: migrated (0.027s)
```

### 5. Start Server

```bash
# Development mode (dengan auto-reload)
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js           # Sequelize configuration
│   │   └── connection.js         # Database connection utility
│   ├── controllers/
│   │   └── petaniController.js  # Petani business logic
│   ├── middleware/
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── petaniValidation.js  # Petani validation rules
│   │   └── validate.js           # Validation middleware
│   ├── migrations/
│   │   └── 20251106210456-create-petani.js
│   ├── models/
│   │   ├── index.js              # Models loader
│   │   └── petani.js             # Petani model
│   ├── routes/
│   │   └── petani.js             # Petani routes
│   ├── seeders/                  # Database seeders (TBD)
│   └── server.js                 # Express app entry point
├── .env                          # Environment variables
├── .sequelizerc                  # Sequelize CLI config
├── package.json
├── API_DOCUMENTATION.md          # Comprehensive API docs
└── README.md                     # This file
```

## 🗄️ Database Schema

### Petani (Farmers) Table

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

**Indexes:**
- `nik` (unique)
- `email` (unique)
- `status`

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/api/petani` | Get all petani (with pagination, search, filter) |
| GET | `/api/petani/stats` | Get petani statistics |
| GET | `/api/petani/:id` | Get single petani by ID |
| POST | `/api/petani` | Create new petani |
| PUT | `/api/petani/:id` | Update petani by ID |
| DELETE | `/api/petani/:id` | Delete petani by ID |

> **📖 Full API Documentation**: Lihat [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) untuk detail lengkap setiap endpoint, request/response examples, dan validation rules.

## 🧪 Testing API

### Quick Tests

```bash
# 1. Health check
curl http://localhost:3000/health

# 2. Get all petani
curl http://localhost:3000/api/petani

# 3. Get statistics
curl http://localhost:3000/api/petani/stats

# 4. Create petani
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

# 5. Search petani
curl "http://localhost:3000/api/petani?search=Ahmad&status=aktif"

# 6. Get petani by ID
curl http://localhost:3000/api/petani/1

# 7. Update petani
curl -X PUT http://localhost:3000/api/petani/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "nonaktif"}'

# 8. Delete petani
curl -X DELETE http://localhost:3000/api/petani/1
```

### Using Postman

1. Import collection atau manually create requests
2. Set base URL: `http://localhost:3000`
3. For POST/PUT requests, set header: `Content-Type: application/json`
4. Test all endpoints dengan data yang valid

## 🛠️ NPM Scripts

```bash
# Development
npm run dev              # Start server dengan nodemon (auto-reload)
npm start                # Start server production mode

# Database
npm run db:migrate       # Run all pending migrations
npm run db:migrate:undo  # Undo last migration
npm run db:seed          # Run all seeders
npm run db:seed:undo     # Undo last seeder
```

## 📝 Development Workflow

### 1. Creating New Model

```bash
# Generate model and migration
npx sequelize-cli model:generate --name ModelName --attributes field1:type,field2:type

# Edit generated files:
# - src/models/modelname.js (add validations)
# - src/migrations/XXXXXX-create-modelname.js (add constraints, indexes)

# Run migration
npm run db:migrate
```

### 2. Creating New Endpoint

1. **Create validation** in `src/middleware/` (e.g., `modelValidation.js`)
2. **Create controller** in `src/controllers/` (e.g., `modelController.js`)
3. **Create routes** in `src/routes/` (e.g., `model.js`)
4. **Register routes** in `src/server.js`:
   ```javascript
   const modelRoutes = require('./routes/model');
   app.use('/api/model', modelRoutes);
   ```
5. **Test endpoints** menggunakan curl atau Postman

### 3. Validation Rules

Menggunakan `express-validator` di middleware:

```javascript
const { body } = require('express-validator');

const validation = {
  create: [
    body('field_name')
      .notEmpty().withMessage('Field required')
      .isLength({ min: 3, max: 100 }).withMessage('Length 3-100')
      .isEmail().withMessage('Invalid email'),
  ]
};
```

### 4. Error Handling

Semua error akan di-handle oleh global error handler di `src/middleware/errorHandler.js`:

- **400 Bad Request**: Validation errors
- **404 Not Found**: Resource not found
- **409 Conflict**: Unique constraint violation
- **500 Internal Server Error**: Server errors

## 🔒 Security Considerations

### Current Implementation
- ✅ CORS configured untuk frontend origin
- ✅ Input validation pada semua endpoint
- ✅ SQL injection prevention (Sequelize ORM)
- ✅ Error messages tidak expose sensitive info

### TODO (Future)
- ⏳ JWT authentication
- ⏳ Rate limiting
- ⏳ Request size limits
- ⏳ Helmet.js security headers
- ⏳ API versioning

## 🐛 Troubleshooting

### Database Connection Error

```bash
Error: SequelizeConnectionError: Access denied for user
```

**Solution**: Check `.env` file, pastikan:
- Database credentials benar
- MySQL server running
- Database `mentas_tobacco_traceability` exists

### Port Already in Use

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**: 
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or change PORT in .env
```

### Migration Error

```bash
ERROR: Values for ENUM have not been defined.
```

**Solution**: Check migration file, pastikan ENUM values defined:
```javascript
jenis_kelamin: {
  type: Sequelize.ENUM('L', 'P'),  // ✅ Values defined
  allowNull: false
}
```

### Validation Errors Not Showing

Pastikan middleware `validate` dipanggil setelah validation rules:

```javascript
router.post('/', 
  petaniValidation.create,  // 1. Rules
  validate,                  // 2. Check errors
  petaniController.create    // 3. Controller
);
```

## 📊 Performance Tips

1. **Use indexes** pada field yang sering di-query (NIK, email, status)
2. **Pagination** wajib untuk list endpoints
3. **Limit query fields** jika tidak semua field dibutuhkan
4. **Connection pooling** configured in Sequelize
5. **Caching** (Redis) untuk data yang jarang berubah (future)

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use strong database password
- [ ] Configure production database connection
- [ ] Set up HTTPS/SSL
- [ ] Configure reverse proxy (nginx)
- [ ] Set up process manager (PM2)
- [ ] Configure logging (Winston/Morgan to file)
- [ ] Set up monitoring (New Relic, Datadog)
- [ ] Database backup strategy
- [ ] API rate limiting
- [ ] Documentation update

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start src/server.js --name mentas-api

# Other commands
pm2 status
pm2 logs mentas-api
pm2 restart mentas-api
pm2 stop mentas-api
```

## 🔄 Migration Management

### Current Migrations

1. **20251106210456-create-petani.js**
   - Creates `petani` table
   - Adds indexes on nik, email, status
   - Status: ✅ Executed

### Running Migrations

```bash
# Check migration status
npx sequelize-cli db:migrate:status

# Run pending migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:undo

# Rollback all migrations
npm run db:migrate:undo:all
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [express-validator Documentation](https://express-validator.github.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 👥 Team

**MENTAS - Universitas Brawijaya**

## 📄 License

Internal project - All rights reserved

---

## 🎯 Next Steps

1. **Authentication System**
   - JWT implementation
   - User roles (Admin, Manager, Petani)
   - Protected routes

2. **Additional Master Data**
   - Kelompok Tani endpoints
   - Lahan endpoints
   - Varietas Tembakau endpoints

3. **Traceability Features**
   - Aktivitas Budidaya tracking
   - Panen recording
   - Pengolahan logging
   - Distribusi tracking

4. **File Management**
   - Image upload (Multer)
   - QR Code generation
   - Document attachments

5. **Reporting**
   - Excel export
   - PDF generation
   - Analytics endpoints

---

**Version:** 1.0.0  
**Last Updated:** November 6, 2024  
**Server Status:** ✅ Running on http://localhost:3000
