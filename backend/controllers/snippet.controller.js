const { validationResult } = require('express-validator');
const Snippet = require('../models/snippet.model');
const Collection = require('../models/collection.model');

// @desc    Get all snippets for a user
// @route   GET /api/snippets
// @access  Private
exports.getSnippets = async (req, res) => {
  try {
    const { collection, isFavorite, tag } = req.query;
    let query = { user: req.user.id };

    if (collection) {
      query.collection = collection;
    }

    if (isFavorite === 'true') {
      query.isFavorite = true;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const snippets = await Snippet.find(query)
      .populate('collection', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: snippets.length,
      data: snippets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single snippet
// @route   GET /api/snippets/:id
// @access  Private
exports.getSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('collection', 'name');

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    res.status(200).json({
      success: true,
      data: snippet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new snippet
// @route   POST /api/snippets
// @access  Private
exports.createSnippet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, code, language, explanation, tags, isFavorite, collection } = req.body;

    // Verify collection belongs to user
    const collectionExists = await Collection.findOne({
      _id: collection,
      user: req.user.id
    });

    if (!collectionExists) {
      return res.status(400).json({
        success: false,
        message: 'Collection not found or does not belong to user'
      });
    }

    const snippet = await Snippet.create({
      title,
      code,
      language,
      explanation,
      tags: tags || [],
      isFavorite: isFavorite || false,
      user: req.user.id,
      collection
    });

    const populatedSnippet = await Snippet.findById(snippet._id).populate('collection', 'name');

    res.status(201).json({
      success: true,
      data: populatedSnippet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update snippet
// @route   PUT /api/snippets/:id
// @access  Private
exports.updateSnippet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, code, language, explanation, tags, isFavorite, collection } = req.body;

    let snippet = await Snippet.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    // If collection is being updated, verify it belongs to user
    if (collection && collection !== snippet.collection.toString()) {
      const collectionExists = await Collection.findOne({
        _id: collection,
        user: req.user.id
      });

      if (!collectionExists) {
        return res.status(400).json({
          success: false,
          message: 'Collection not found or does not belong to user'
        });
      }
    }

    snippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      {
        title,
        code,
        language,
        explanation,
        tags: tags || [],
        isFavorite: isFavorite || false,
        collection: collection || snippet.collection
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('collection', 'name');

    res.status(200).json({
      success: true,
      data: snippet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete snippet
// @route   DELETE /api/snippets/:id
// @access  Private
exports.deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    await Snippet.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Snippet deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Toggle favorite status
// @route   PATCH /api/snippets/:id/favorite
// @access  Private
exports.toggleFavorite = async (req, res) => {
  try {
    const snippet = await Snippet.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!snippet) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    snippet.isFavorite = !snippet.isFavorite;
    await snippet.save();

    const populatedSnippet = await Snippet.findById(snippet._id).populate('collection', 'name');

    res.status(200).json({
      success: true,
      data: populatedSnippet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
