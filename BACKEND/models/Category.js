const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }] // Array of references to stories
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
