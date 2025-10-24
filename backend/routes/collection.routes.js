const express = require('express');
const { body } = require('express-validator');
const {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection
} = require('../controllers/collection.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/collections
// @desc    Get all collections for user
// @access  Private
router.get('/', getCollections);

// @route   GET /api/collections/:id
// @desc    Get single collection
// @access  Private
router.get('/:id', getCollection);

// @route   POST /api/collections
// @desc    Create new collection
// @access  Private
router.post('/', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Collection name is required')
    .isLength({ max: 100 })
    .withMessage('Collection name cannot be more than 100 characters')
], createCollection);

// @route   PUT /api/collections/:id
// @desc    Update collection
// @access  Private
router.put('/:id', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Collection name is required')
    .isLength({ max: 100 })
    .withMessage('Collection name cannot be more than 100 characters')
], updateCollection);

// @route   DELETE /api/collections/:id
// @desc    Delete collection
// @access  Private
router.delete('/:id', deleteCollection);

module.exports = router;
