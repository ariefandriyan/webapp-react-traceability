const express = require('express');
const router = express.Router();
const petaniController = require('../controllers/petaniController');
const petaniValidation = require('../middleware/petaniValidation');
const validate = require('../middleware/validate');

/**
 * GET /api/petani/stats
 * Get statistics of petani (total, aktif, nonaktif)
 */
router.get('/stats', petaniController.getStats);

/**
 * GET /api/petani
 * Get all petani with pagination, search, and filter
 * Query params:
 * - page: page number (default: 1)
 * - limit: items per page (default: 10, max: 100)
 * - search: search by nama, NIK, phone, or email
 * - status: filter by status (aktif/nonaktif)
 * - sort_by: field to sort by (id, nik, nama_lengkap, created_at, updated_at)
 * - order: sort order (ASC/DESC)
 */
router.get('/', petaniValidation.getAll, validate, petaniController.getAll);

/**
 * GET /api/petani/:id
 * Get single petani by ID
 */
router.get('/:id', petaniValidation.getById, validate, petaniController.getById);

/**
 * POST /api/petani
 * Create new petani
 */
router.post('/', petaniValidation.create, validate, petaniController.create);

/**
 * PUT /api/petani/:id
 * Update petani by ID
 */
router.put('/:id', petaniValidation.update, validate, petaniController.update);

/**
 * DELETE /api/petani/:id
 * Delete petani by ID
 */
router.delete('/:id', petaniValidation.delete, validate, petaniController.delete);

module.exports = router;
