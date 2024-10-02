const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get a specific category by ID and its top stories
router.get('/:id/top-stories', async (req, res) => {
  try {
    const categoryName = req.params.id;
    // console.log(req.params.id);
    // const category = await Category.findById(req.params.id).populate('stories');
    const category = await Category.findOne({ name: categoryName }).populate('stories');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const stories = category.stories.map(story => {
      return {
        ...story.toObject(), // Spread the existing story fields
        categoryName: categoryName  // Add your custom key-value pair logic (e.g., isPopular)
      };
    });
    // Assuming "top stories" means the latest stories or most liked
    // Here, we limit the number of stories returned to 5 for example
    const topStories = stories.sort((a, b) => b.likes - a.likes).slice(0, 5);
    res.status(200).json({ topStories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving category and top stories', error: error.message });
  }
});
router.get('/:id/all', async (req, res) => {
  try {
    const categoryName = req.params.id;
    // console.log(req.params.id);
    // const category = await Category.findById(req.params.id).populate('stories');
    const category = await Category.findOne({ name: categoryName }).populate('stories');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const stories = category.stories.map(story => {
      return {
        ...story.toObject(), // Spread the existing story fields
        categoryName: categoryName  // Add your custom key-value pair logic (e.g., isPopular)
      };
    });
    // Assuming "top stories" means the latest stories or most liked
    // Here, we limit the number of stories returned to 5 for example
    // const topStories = category.stories.sort((a, b) => b.likes - a.likes).slice(0, 5);

    res.status(200).json({ stories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving category and stories', error: error.message });
  }
});
module.exports = router;

