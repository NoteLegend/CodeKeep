const { validationResult } = require('express-validator');
const Collection = require('../models/collection.model');

// @desc    Get all collections for a user
// @route   GET /api/collections
// @access  Private
exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single collection
// @route   GET /api/collections/:id
// @access  Private
exports.getCollection = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.status(200).json({
      success: true,
      data: collection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new collection
// @route   POST /api/collections
// @access  Private
exports.createCollection = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name } = req.body;

    const collection = await Collection.create({
      name,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: collection
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Collection with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private
exports.updateCollection = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name } = req.body;

    let collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    collection = await Collection.findByIdAndUpdate(
      req.params.id,
      { name },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: collection
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Collection with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private
exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    await Collection.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
