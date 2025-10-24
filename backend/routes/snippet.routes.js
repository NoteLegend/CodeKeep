const express = require('express');
const { body } = require('express-validator');
const {
  getSnippets,
  getSnippet,
  createSnippet,
  updateSnippet,
  deleteSnippet,
  toggleFavorite
} = require('../controllers/snippet.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/snippets
// @desc    Get all snippets for user
// @access  Private
router.get('/', getSnippets);

// @route   GET /api/snippets/:id
// @desc    Get single snippet
// @access  Private
router.get('/:id', getSnippet);

// @route   POST /api/snippets
// @desc    Create new snippet
// @access  Private
router.post('/', [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot be more than 200 characters'),
  body('code')
    .notEmpty()
    .withMessage('Code is required')
    .isLength({ max: 10000 })
    .withMessage('Code cannot be more than 10000 characters'),
  body('language')
    .trim()
    .notEmpty()
    .withMessage('Language is required')
    .isLength({ max: 50 })
    .withMessage('Language cannot be more than 50 characters'),
  body('explanation')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Explanation cannot be more than 5000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot be more than 30 characters'),
  body('isFavorite')
    .optional()
    .isBoolean()
    .withMessage('isFavorite must be a boolean'),
  body('collection')
    .notEmpty()
    .withMessage('Collection is required')
    .isMongoId()
    .withMessage('Invalid collection ID')
], createSnippet);

// @route   PUT /api/snippets/:id
// @desc    Update snippet
// @access  Private
router.put('/:id', [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot be more than 200 characters'),
  body('code')
    .optional()
    .notEmpty()
    .withMessage('Code cannot be empty')
    .isLength({ max: 10000 })
    .withMessage('Code cannot be more than 10000 characters'),
  body('language')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Language cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Language cannot be more than 50 characters'),
  body('explanation')
    .optional()
    .isLength({ max: 5000 })
    .withMessage('Explanation cannot be more than 5000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot be more than 30 characters'),
  body('isFavorite')
    .optional()
    .isBoolean()
    .withMessage('isFavorite must be a boolean'),
  body('collection')
    .optional()
    .isMongoId()
    .withMessage('Invalid collection ID')
], updateSnippet);

// @route   DELETE /api/snippets/:id
// @desc    Delete snippet
// @access  Private
router.delete('/:id', deleteSnippet);

// @route   PATCH /api/snippets/:id/favorite
// @desc    Toggle favorite status
// @access  Private
router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
