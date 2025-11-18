const { KelompokTani, Petani } = require('../models');
const { validationResult } = require('express-validator');
const { Op, fn, col } = require('sequelize');

// Get all kelompok tani with pagination and filters
exports.getAllKelompokTani = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      statusLegalitas = '',
      statusAktif = '',
      kecamatan = '',
      kabupaten = '',
      komoditasUtama = ''
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { kode_kelompok: { [Op.like]: `%${search}%` } },
        { nama_kelompok: { [Op.like]: `%${search}%` } },
        { ketua_kelompok: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (statusLegalitas) {
      where.status_legalitas = statusLegalitas;
    }
    
    if (statusAktif !== '') {
      where.status = statusAktif === 'true' ? 'aktif' : 'nonaktif';
    }
    
    if (kecamatan) {
      where.kecamatan = { [Op.like]: `%${kecamatan}%` };
    }
    
    if (kabupaten) {
      where.kota_kabupaten = { [Op.like]: `%${kabupaten}%` };
    }
    
    if (komoditasUtama) {
      where.komoditas_utama = { [Op.like]: `%${komoditasUtama}%` };
    }

    const { count, rows } = await KelompokTani.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [['created_at', 'DESC']]
    });

    // Get jumlah anggota and luas total lahan for each kelompok
    const kelompokWithStats = await Promise.all(
      rows.map(async (kelompok) => {
        const petaniStats = await Petani.findOne({
          attributes: [
            [fn('COUNT', col('id')), 'jumlah_anggota']
          ],
          where: {
            kelompok_tani_id: kelompok.id,
            status: 'aktif'
          }
        });

        const kelompokData = kelompok.toJSON();
        return {
          ...kelompokData,
          jumlah_anggota: parseInt(petaniStats?.dataValues?.jumlah_anggota || 0),
          luas_total_lahan: 0 // Column not available in petani table
        };
      })
    );

    res.json({
      success: true,
      data: {
        kelompok_tani: kelompokWithStats,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          total_pages: Math.ceil(count / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Error getting kelompok tani:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kelompok tani',
      error: error.message
    });
  }
};

// Get kelompok tani by ID
exports.getKelompokTaniById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const kelompok = await KelompokTani.findByPk(id);
    
    if (!kelompok) {
      return res.status(404).json({
        success: false,
        message: 'Kelompok tani tidak ditemukan'
      });
    }

    // Get jumlah anggota and luas total lahan
    const petaniStats = await Petani.findOne({
      attributes: [
        [fn('COUNT', col('id')), 'jumlah_anggota'],
        [fn('SUM', col('luas_lahan')), 'luas_total_lahan']
      ],
      where: {
        kelompok_tani_id: id,
        status: 'aktif'
      }
    });

    const kelompokData = kelompok.toJSON();
    
    res.json({
      success: true,
      data: {
        ...kelompokData,
        jumlah_anggota: parseInt(petaniStats?.dataValues?.jumlah_anggota || 0),
        luas_total_lahan: parseFloat(petaniStats?.dataValues?.luas_total_lahan || 0)
      }
    });
  } catch (error) {
    console.error('Error getting kelompok tani by id:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kelompok tani',
      error: error.message
    });
  }
};

// Create new kelompok tani
exports.createKelompokTani = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const kelompok = await KelompokTani.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Kelompok tani berhasil ditambahkan',
      data: kelompok
    });
  } catch (error) {
    console.error('Error creating kelompok tani:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Kode kelompok sudah digunakan'
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menambahkan kelompok tani',
      error: error.message
    });
  }
};

// Update kelompok tani
exports.updateKelompokTani = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    
    const kelompok = await KelompokTani.findByPk(id);
    
    if (!kelompok) {
      return res.status(404).json({
        success: false,
        message: 'Kelompok tani tidak ditemukan'
      });
    }

    await kelompok.update(req.body);
    
    res.json({
      success: true,
      message: 'Kelompok tani berhasil diupdate',
      data: kelompok
    });
  } catch (error) {
    console.error('Error updating kelompok tani:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Kode kelompok sudah digunakan'
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate kelompok tani',
      error: error.message
    });
  }
};

// Delete kelompok tani
exports.deleteKelompokTani = async (req, res) => {
  try {
    const { id } = req.params;
    
    const kelompok = await KelompokTani.findByPk(id);
    
    if (!kelompok) {
      return res.status(404).json({
        success: false,
        message: 'Kelompok tani tidak ditemukan'
      });
    }

    // Check if there are petani associated with this kelompok
    const petaniCount = await Petani.count({
      where: { kelompok_tani_id: id }
    });

    if (petaniCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Tidak dapat menghapus kelompok tani. Masih ada ${petaniCount} petani yang tergabung dalam kelompok ini.`
      });
    }

    await kelompok.destroy();
    
    res.json({
      success: true,
      message: 'Kelompok tani berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting kelompok tani:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus kelompok tani',
      error: error.message
    });
  }
};

// Get statistics
exports.getStats = async (req, res) => {
  try {
    const total = await KelompokTani.count();
    const aktif = await KelompokTani.count({ where: { status: 'aktif' } });
    const nonaktif = await KelompokTani.count({ where: { status: 'nonaktif' } });
    
    const terdaftar = await KelompokTani.count({ 
      where: { status_legalitas: 'Terdaftar' } 
    });
    const belumTerdaftar = await KelompokTani.count({ 
      where: { status_legalitas: 'Belum Terdaftar' } 
    });
    const dalamProses = await KelompokTani.count({ 
      where: { status_legalitas: 'Dalam Proses' } 
    });

    // Get total anggota from all active kelompok
    const allKelompok = await KelompokTani.findAll({
      where: { status: 'aktif' },
      attributes: ['id']
    });

    let totalAnggota = 0;

    for (const kelompok of allKelompok) {
      const petaniStats = await Petani.findOne({
        attributes: [
          [fn('COUNT', col('id')), 'count']
        ],
        where: {
          kelompok_tani_id: kelompok.id,
          status: 'aktif'
        }
      });

      totalAnggota += parseInt(petaniStats?.dataValues?.count || 0);
    }

    res.json({
      success: true,
      data: {
        total,
        aktif,
        nonaktif,
        terdaftar,
        belumTerdaftar,
        dalamProses,
        totalAnggota,
        totalLuasLahan: 0 // Column not available in petani table
      }
    });
  } catch (error) {
    console.error('Error getting kelompok tani stats:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil statistik kelompok tani',
      error: error.message
    });
  }
};
