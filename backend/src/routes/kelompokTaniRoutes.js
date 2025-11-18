const express = require('express');
const router = express.Router();
const kelompokTaniController = require('../controllers/kelompokTaniController');
const { validateKelompokTani, validateUpdateKelompokTani } = require('../validators/kelompokTaniValidator');

// Get statistics
router.get('/stats', kelompokTaniController.getStats);

// Get all kelompok tani with pagination and filters
router.get('/', kelompokTaniController.getAllKelompokTani);

// Get kelompok tani by ID
router.get('/:id', kelompokTaniController.getKelompokTaniById);

// Create new kelompok tani
router.post('/', validateKelompokTani, kelompokTaniController.createKelompokTani);

// Update kelompok tani
router.put('/:id', validateUpdateKelompokTani, kelompokTaniController.updateKelompokTani);

// Delete kelompok tani
router.delete('/:id', kelompokTaniController.deleteKelompokTani);

module.exports = router;
