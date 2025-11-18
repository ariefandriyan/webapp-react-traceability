const { Petani } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

/**
 * Petani Controller
 * Handle all CRUD operations for Petani
 */
class PetaniController {
  
  /**
   * GET /api/petani
   * Get all petani with pagination, search, and filter
   */
  async getAll(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search = '', 
        status = '', 
        sort_by = 'created_at',
        order = 'DESC'
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      // Search filter
      if (search) {
        where[Op.or] = [
          { nama_lengkap: { [Op.like]: `%${search}%` } },
          { nik: { [Op.like]: `%${search}%` } },
          { no_telepon: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      // Status filter
      if (status) {
        where.status = status;
      }

      const { count, rows } = await Petani.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort_by, order.toUpperCase()]],
        attributes: { exclude: [] }
      });

      res.status(200).json({
        success: true,
        message: 'Data petani berhasil diambil',
        data: {
          petani: rows,
          pagination: {
            total: count,
            per_page: parseInt(limit),
            current_page: parseInt(page),
            total_pages: Math.ceil(count / limit),
            from: offset + 1,
            to: offset + rows.length
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/petani/:id
   * Get single petani by ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const petani = await Petani.findByPk(id);

      if (!petani) {
        return res.status(404).json({
          success: false,
          message: 'Data petani tidak ditemukan'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Data petani berhasil diambil',
        data: petani
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/petani
   * Create new petani
   */
  async create(req, res, next) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validasi gagal',
          errors: errors.array()
        });
      }

      const petaniData = req.body;

      // Check if NIK already exists
      const existingNIK = await Petani.findOne({ where: { nik: petaniData.nik } });
      if (existingNIK) {
        return res.status(409).json({
          success: false,
          message: 'NIK sudah terdaftar'
        });
      }

      // Check if email already exists (if provided)
      if (petaniData.email) {
        const existingEmail = await Petani.findOne({ where: { email: petaniData.email } });
        if (existingEmail) {
          return res.status(409).json({
            success: false,
            message: 'Email sudah terdaftar'
          });
        }
      }

      const petani = await Petani.create(petaniData);

      res.status(201).json({
        success: true,
        message: 'Data petani berhasil ditambahkan',
        data: petani
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validasi gagal',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
      next(error);
    }
  }

  /**
   * PUT /api/petani/:id
   * Update existing petani
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;

      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validasi gagal',
          errors: errors.array()
        });
      }

      const petani = await Petani.findByPk(id);

      if (!petani) {
        return res.status(404).json({
          success: false,
          message: 'Data petani tidak ditemukan'
        });
      }

      const updateData = req.body;

      // Check if NIK is being changed and if it already exists
      if (updateData.nik && updateData.nik !== petani.nik) {
        const existingNIK = await Petani.findOne({ where: { nik: updateData.nik } });
        if (existingNIK) {
          return res.status(409).json({
            success: false,
            message: 'NIK sudah terdaftar'
          });
        }
      }

      // Check if email is being changed and if it already exists
      if (updateData.email && updateData.email !== petani.email) {
        const existingEmail = await Petani.findOne({ where: { email: updateData.email } });
        if (existingEmail) {
          return res.status(409).json({
            success: false,
            message: 'Email sudah terdaftar'
          });
        }
      }

      await petani.update(updateData);

      res.status(200).json({
        success: true,
        message: 'Data petani berhasil diupdate',
        data: petani
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validasi gagal',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/petani/:id
   * Delete petani
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const petani = await Petani.findByPk(id);

      if (!petani) {
        return res.status(404).json({
          success: false,
          message: 'Data petani tidak ditemukan'
        });
      }

      await petani.destroy();

      res.status(200).json({
        success: true,
        message: 'Data petani berhasil dihapus'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/petani/stats
   * Get petani statistics
   */
  async getStats(req, res, next) {
    try {
      const { fn, col } = require('sequelize');
      
      const totalPetani = await Petani.count();
      const totalAktif = await Petani.count({ where: { status: 'aktif' } });
      const totalNonaktif = await Petani.count({ where: { status: 'nonaktif' } });

      // Get sum of luas_lahan
      const luasLahanResult = await Petani.findOne({
        attributes: [
          [fn('SUM', col('luas_lahan')), 'total_lahan'],
          [fn('AVG', col('luas_lahan')), 'avg_lahan']
        ],
        raw: true
      });

      // Count unique kelompok_tani_id (excluding null)
      const kelompokTaniCount = await Petani.count({
        distinct: true,
        col: 'kelompok_tani_id',
        where: {
          kelompok_tani_id: {
            [require('sequelize').Op.ne]: null
          }
        }
      });

      res.status(200).json({
        success: true,
        message: 'Statistik petani berhasil diambil',
        data: {
          total: totalPetani,
          aktif: totalAktif,
          nonaktif: totalNonaktif,
          totalLahan: parseFloat(luasLahanResult?.total_lahan || 0),
          avgLahan: parseFloat(luasLahanResult?.avg_lahan || 0),
          kelompokTaniCount: kelompokTaniCount
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PetaniController();
