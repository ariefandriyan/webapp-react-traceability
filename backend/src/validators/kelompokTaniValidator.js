const { body } = require('express-validator');

exports.validateKelompokTani = [
  body('kode_kelompok')
    .trim()
    .notEmpty().withMessage('Kode kelompok tidak boleh kosong')
    .isLength({ max: 50 }).withMessage('Kode kelompok maksimal 50 karakter'),
  
  body('nama_kelompok')
    .trim()
    .notEmpty().withMessage('Nama kelompok tidak boleh kosong')
    .isLength({ max: 200 }).withMessage('Nama kelompok maksimal 200 karakter'),
  
  body('ketua_kelompok')
    .trim()
    .notEmpty().withMessage('Ketua kelompok tidak boleh kosong')
    .isLength({ max: 200 }).withMessage('Ketua kelompok maksimal 200 karakter'),
  
  body('waktu_bentuk')
    .notEmpty().withMessage('Waktu bentuk tidak boleh kosong')
    .isDate().withMessage('Waktu bentuk harus berupa tanggal yang valid'),
  
  body('alamat')
    .trim()
    .notEmpty().withMessage('Alamat tidak boleh kosong'),
  
  body('kelurahan')
    .trim()
    .notEmpty().withMessage('Kelurahan tidak boleh kosong')
    .isLength({ max: 100 }).withMessage('Kelurahan maksimal 100 karakter'),
  
  body('kecamatan')
    .trim()
    .notEmpty().withMessage('Kecamatan tidak boleh kosong')
    .isLength({ max: 100 }).withMessage('Kecamatan maksimal 100 karakter'),
  
  body('kota_kabupaten')
    .trim()
    .notEmpty().withMessage('Kota/Kabupaten tidak boleh kosong')
    .isLength({ max: 100 }).withMessage('Kota/Kabupaten maksimal 100 karakter'),
  
  body('provinsi')
    .trim()
    .notEmpty().withMessage('Provinsi tidak boleh kosong')
    .isLength({ max: 100 }).withMessage('Provinsi maksimal 100 karakter'),
  
  body('kode_pos')
    .optional({ checkFalsy: true })
    .trim()
    .isNumeric().withMessage('Kode pos harus berupa angka')
    .isLength({ max: 10 }).withMessage('Kode pos maksimal 10 karakter'),
  
  body('no_telepon')
    .trim()
    .notEmpty().withMessage('Nomor telepon tidak boleh kosong')
    .isLength({ max: 20 }).withMessage('Nomor telepon maksimal 20 karakter'),
  
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('Format email tidak valid')
    .isLength({ max: 100 }).withMessage('Email maksimal 100 karakter'),
  
  body('komoditas_utama')
    .trim()
    .notEmpty().withMessage('Komoditas utama tidak boleh kosong')
    .isLength({ max: 100 }).withMessage('Komoditas utama maksimal 100 karakter'),
  
  body('status_legalitas')
    .notEmpty().withMessage('Status legalitas tidak boleh kosong')
    .isIn(['Terdaftar', 'Belum Terdaftar', 'Dalam Proses'])
    .withMessage('Status legalitas tidak valid'),
  
  body('sk_kelompok')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('SK kelompok maksimal 100 karakter'),
  
  body('tanggal_sk')
    .optional({ checkFalsy: true })
    .isDate().withMessage('Tanggal SK harus berupa tanggal yang valid'),
  
  body('pembina')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage('Pembina maksimal 200 karakter'),
  
  body('bank_mitra')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Bank mitra maksimal 100 karakter'),
  
  body('no_rekening_kelompok')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('Nomor rekening maksimal 50 karakter'),
  
  body('status')
    .optional()
    .isIn(['aktif', 'nonaktif']).withMessage('Status tidak valid'),
  
  body('tanggal_daftar')
    .notEmpty().withMessage('Tanggal daftar tidak boleh kosong')
    .isDate().withMessage('Tanggal daftar harus berupa tanggal yang valid'),
  
  body('catatan')
    .optional({ checkFalsy: true })
    .trim()
];

exports.validateUpdateKelompokTani = [
  body('kode_kelompok')
    .optional()
    .trim()
    .notEmpty().withMessage('Kode kelompok tidak boleh kosong')
    .isLength({ max: 50 }).withMessage('Kode kelompok maksimal 50 karakter'),
  
  body('nama_kelompok')
    .optional()
    .trim()
    .notEmpty().withMessage('Nama kelompok tidak boleh kosong')
    .isLength({ max: 200 }).withMessage('Nama kelompok maksimal 200 karakter'),
  
  body('ketua_kelompok')
    .optional()
    .trim()
    .notEmpty().withMessage('Ketua kelompok tidak boleh kosong')
    .isLength({ max: 200 }).withMessage('Ketua kelompok maksimal 200 karakter'),
  
  body('waktu_bentuk')
    .optional()
    .isDate().withMessage('Waktu bentuk harus berupa tanggal yang valid'),
  
  body('alamat')
    .optional()
    .trim()
    .notEmpty().withMessage('Alamat tidak boleh kosong'),
  
  body('kelurahan')
    .optional()
    .trim()
    .notEmpty().withMessage('Kelurahan tidak boleh kosong')
    .isLength({ max: 100 }).withMessage('Kelurahan maksimal 100 karakter'),
  
  body('kecamatan')
    .optional()
    .trim()
    .notEmpty().withMessage('Kecamatan tidak boleh kosong')
    .isLength({ max: 100 }).withMessage('Kecamatan maksimal 100 karakter'),
  
  body('kota_kabupaten')
    .optional()
    .trim()
    .notEmpty().withMessage('Kota/Kabupaten tidak boleh kosong')
    .isLength({ max: 100 }).withMessage('Kota/Kabupaten maksimal 100 karakter'),
  
  body('provinsi')
    .optional()
    .trim()
    .notEmpty().withMessage('Provinsi tidak boleh kosong')
    .isLength({ max: 100 }).withMessage('Provinsi maksimal 100 karakter'),
  
  body('kode_pos')
    .optional({ checkFalsy: true })
    .trim()
    .isNumeric().withMessage('Kode pos harus berupa angka')
    .isLength({ max: 10 }).withMessage('Kode pos maksimal 10 karakter'),
  
  body('no_telepon')
    .optional()
    .trim()
    .notEmpty().withMessage('Nomor telepon tidak boleh kosong')
    .isLength({ max: 20 }).withMessage('Nomor telepon maksimal 20 karakter'),
  
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('Format email tidak valid')
    .isLength({ max: 100 }).withMessage('Email maksimal 100 karakter'),
  
  body('komoditas_utama')
    .optional()
    .trim()
    .notEmpty().withMessage('Komoditas utama tidak boleh kosong')
    .isLength({ max: 100 }).withMessage('Komoditas utama maksimal 100 karakter'),
  
  body('status_legalitas')
    .optional()
    .isIn(['Terdaftar', 'Belum Terdaftar', 'Dalam Proses'])
    .withMessage('Status legalitas tidak valid'),
  
  body('sk_kelompok')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('SK kelompok maksimal 100 karakter'),
  
  body('tanggal_sk')
    .optional({ checkFalsy: true })
    .isDate().withMessage('Tanggal SK harus berupa tanggal yang valid'),
  
  body('pembina')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 }).withMessage('Pembina maksimal 200 karakter'),
  
  body('bank_mitra')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Bank mitra maksimal 100 karakter'),
  
  body('no_rekening_kelompok')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('Nomor rekening maksimal 50 karakter'),
  
  body('status')
    .optional()
    .isIn(['aktif', 'nonaktif']).withMessage('Status tidak valid'),
  
  body('tanggal_daftar')
    .optional()
    .isDate().withMessage('Tanggal daftar harus berupa tanggal yang valid'),
  
  body('catatan')
    .optional({ checkFalsy: true })
    .trim()
];
