const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a snippet title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  code: {
    type: String,
    required: [true, 'Please add code content'],
    maxlength: [10000, 'Code cannot be more than 10000 characters']
  },
  language: {
    type: String,
    required: [true, 'Please specify the programming language'],
    trim: true,
    maxlength: [50, 'Language cannot be more than 50 characters']
  },
  explanation: {
    type: String,
    maxlength: [5000, 'Explanation cannot be more than 5000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  isFavorite: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  collection: {
    type: mongoose.Schema.ObjectId,
    ref: 'Collection',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
snippetSchema.index({ user: 1, collection: 1 });
snippetSchema.index({ user: 1, isFavorite: 1 });
snippetSchema.index({ user: 1, tags: 1 });

module.exports = mongoose.model('Snippet', snippetSchema);
