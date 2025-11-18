const { body, param, query } = require('express-validator');

/**
 * Validation rules for Petani
 */
const petaniValidation = {
  
  // Validation for creating petani
  create: [
    body('nik')
      .trim()
      .notEmpty().withMessage('NIK tidak boleh kosong')
      .isLength({ min: 16, max: 16 }).withMessage('NIK harus 16 digit')
      .isNumeric().withMessage('NIK harus berupa angka'),
    
    body('nama_lengkap')
      .trim()
      .notEmpty().withMessage('Nama lengkap tidak boleh kosong')
      .isLength({ min: 3, max: 100 }).withMessage('Nama lengkap harus antara 3-100 karakter'),
    
    body('tanggal_lahir')
      .notEmpty().withMessage('Tanggal lahir tidak boleh kosong')
      .isDate().withMessage('Format tanggal lahir tidak valid'),
    
    body('jenis_kelamin')
      .notEmpty().withMessage('Jenis kelamin tidak boleh kosong')
      .isIn(['L', 'P']).withMessage('Jenis kelamin harus L atau P'),
    
    body('alamat')
      .trim()
      .notEmpty().withMessage('Alamat tidak boleh kosong'),
    
    body('kelurahan')
      .trim()
      .notEmpty().withMessage('Kelurahan tidak boleh kosong'),
    
    body('kecamatan')
      .trim()
      .notEmpty().withMessage('Kecamatan tidak boleh kosong'),
    
    body('kota_kabupaten')
      .trim()
      .notEmpty().withMessage('Kota/Kabupaten tidak boleh kosong'),
    
    body('provinsi')
      .trim()
      .notEmpty().withMessage('Provinsi tidak boleh kosong'),
    
    body('kode_pos')
      .optional({ nullable: true, checkFalsy: true })
      .isLength({ min: 5, max: 5 }).withMessage('Kode pos harus 5 digit')
      .isNumeric().withMessage('Kode pos harus berupa angka'),
    
    body('no_telepon')
      .trim()
      .notEmpty().withMessage('Nomor telepon tidak boleh kosong')
      .matches(/^[0-9+\-() ]+$/).withMessage('Format nomor telepon tidak valid'),
    
    body('email')
      .optional({ nullable: true, checkFalsy: true })
      .isEmail().withMessage('Format email tidak valid')
      .normalizeEmail(),
    
    body('kelompok_tani_id')
      .optional({ nullable: true, checkFalsy: true })
      .isInt().withMessage('Kelompok tani ID harus berupa angka'),
    
    body('status')
      .optional()
      .isIn(['aktif', 'nonaktif']).withMessage('Status harus aktif atau nonaktif')
  ],

  // Validation for updating petani
  update: [
    param('id')
      .isInt().withMessage('ID harus berupa angka'),
    
    body('nik')
      .optional()
      .trim()
      .isLength({ min: 16, max: 16 }).withMessage('NIK harus 16 digit')
      .isNumeric().withMessage('NIK harus berupa angka'),
    
    body('nama_lengkap')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 }).withMessage('Nama lengkap harus antara 3-100 karakter'),
    
    body('tanggal_lahir')
      .optional()
      .isDate().withMessage('Format tanggal lahir tidak valid'),
    
    body('jenis_kelamin')
      .optional()
      .isIn(['L', 'P']).withMessage('Jenis kelamin harus L atau P'),
    
    body('alamat')
      .optional()
      .trim()
      .notEmpty().withMessage('Alamat tidak boleh kosong'),
    
    body('kelurahan')
      .optional()
      .trim()
      .notEmpty().withMessage('Kelurahan tidak boleh kosong'),
    
    body('kecamatan')
      .optional()
      .trim()
      .notEmpty().withMessage('Kecamatan tidak boleh kosong'),
    
    body('kota_kabupaten')
      .optional()
      .trim()
      .notEmpty().withMessage('Kota/Kabupaten tidak boleh kosong'),
    
    body('provinsi')
      .optional()
      .trim()
      .notEmpty().withMessage('Provinsi tidak boleh kosong'),
    
    body('kode_pos')
      .optional({ nullable: true, checkFalsy: true })
      .isLength({ min: 5, max: 5 }).withMessage('Kode pos harus 5 digit')
      .isNumeric().withMessage('Kode pos harus berupa angka'),
    
    body('no_telepon')
      .optional()
      .trim()
      .matches(/^[0-9+\-() ]+$/).withMessage('Format nomor telepon tidak valid'),
    
    body('email')
      .optional({ nullable: true, checkFalsy: true })
      .isEmail().withMessage('Format email tidak valid')
      .normalizeEmail(),
    
    body('kelompok_tani_id')
      .optional({ nullable: true, checkFalsy: true })
      .isInt().withMessage('Kelompok tani ID harus berupa angka'),
    
    body('status')
      .optional()
      .isIn(['aktif', 'nonaktif']).withMessage('Status harus aktif atau nonaktif')
  ],

  // Validation for deleting petani
  delete: [
    param('id')
      .isInt().withMessage('ID harus berupa angka')
  ],

  // Validation for getting single petani
  getById: [
    param('id')
      .isInt().withMessage('ID harus berupa angka')
  ],

  // Validation for query parameters
  getAll: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page harus angka positif'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit harus antara 1-100'),
    
    query('status')
      .optional()
      .isIn(['aktif', 'nonaktif']).withMessage('Status harus aktif atau nonaktif'),
    
    query('sort_by')
      .optional()
      .isIn(['id', 'nik', 'nama_lengkap', 'created_at', 'updated_at']).withMessage('Sort by tidak valid'),
    
    query('order')
      .optional()
      .isIn(['ASC', 'DESC', 'asc', 'desc']).withMessage('Order harus ASC atau DESC')
  ]
};

module.exports = petaniValidation;
