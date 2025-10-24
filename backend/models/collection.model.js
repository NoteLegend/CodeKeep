const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a collection name'],
    trim: true,
    maxlength: [100, 'Collection name cannot be more than 100 characters']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Ensure user can only have one collection with the same name
collectionSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Collection', collectionSchema);
