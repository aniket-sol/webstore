const mongoose = require('mongoose');

// Slide Schema
const slideSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  userName: [{ type: String }] // Array of unique usernames
});

// Virtual property for likes
slideSchema.virtual('likes').get(function () {
  return this.userName.length; // Likes is the size of userName array
});

// Ensure uniqueness of usernames in userName array before saving the document
slideSchema.pre('save', function (next) {
  this.userName = [...new Set(this.userName)]; // Remove duplicates from userName array
  next();
});

// Story Schema
const storySchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  slides: [slideSchema], // Array of slides
  createdAt: { type: Date, default: Date.now },
});

const Story = mongoose.model('Story', storySchema);
module.exports = Story;
