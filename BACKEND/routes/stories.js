const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Story = require('../models/Story');
const Category = require('../models/Category');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');


// Create a new story
router.post('/create', [authenticateToken], async (req, res) => {
  try {
    const { titles, imageUrls, descriptions, categoryId } = req.body; 
    
    const userId = req.user.userId; // Extract the userId from the authenticated token

    // Find the category by name
    const category = await Category.findOne({ name: categoryId });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const slides = titles.map((title, index) => ({
      title: title,
      description: descriptions[index],
      imageUrl: imageUrls[index]
    }));

    // Ensure that slides is an array and has the correct length
    if (!Array.isArray(slides) || slides.length < 3 || slides.length > 6) {
      return res.status(400).json({ message: 'Slides must be an array with 3 to 6 slides' });
    }


    // Validate each slide object
    for (const slide of slides) {
      if (!slide.title || !slide.imageUrl) {
        return res.status(400).json({ message: 'Each slide must have a heading and imageUrl' });
      }
    }

    // Create a new story with the slides
    const newStory = new Story({
      slides: slides.map(slide => ({
        title: slide.title,
        imageUrl: slide.imageUrl,
        description: slide.description ,
      })),
      category: category._id,
      user: userId // Use the authenticated userId from the token
    });

    // Save the story
    await newStory.save();

    // Add the new story ID to the category's stories array
    category.stories.push(newStory._id);

    await category.save(); // Save the updated category document
    // console.log(newStory);

    return res.status(201).json({ message: 'Story created and added to category', story: newStory });

  } catch (error) {
    console.error('Error creating story:', error);
    return res.status(500).json({ message: 'Error creating story', error: error.message });
  }
});


//update the story
router.put('/update/:storyId', [authenticateToken], async (req, res) => {
  try {
    const { titles, imageUrls, descriptions } = req.body;
    const { storyId } = req.params;
    const userId = req.user.userId; // Extract the userId from the authenticated token

    // Find the story by ID
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Ensure the authenticated user is the owner of the story
    if (story.user.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this story' });
    }

    // Map the updated slides
    const updatedSlides = titles.map((title, index) => ({
      title: title,
      description: descriptions[index],
      imageUrl: imageUrls[index]
    }));

    // Validate that slides is an array and has between 3 and 6 slides
    if (!Array.isArray(updatedSlides) || updatedSlides.length < 3 || updatedSlides.length > 6) {
      return res.status(400).json({ message: 'Slides must be an array with 3 to 6 slides' });
    }

    // Validate each slide object
    for (const slide of updatedSlides) {
      if (!slide.title || !slide.imageUrl) {
        return res.status(400).json({ message: 'Each slide must have a heading and imageUrl' });
      }
    }

    // Update the story's slides
    story.slides = updatedSlides.map(slide => ({
      title: slide.title,
      imageUrl: slide.imageUrl,
      description: slide.description
    }));

    // Save the updated story
    await story.save();

    return res.status(200).json({ message: 'Story updated successfully', story });

  } catch (error) {
    console.error('Error updating story:', error);
    return res.status(500).json({ message: 'Error updating story', error: error.message });
  }
});


// Like a specific slide
router.post('/:storyId/like/:slideIndex', [authenticateToken], async (req, res) => {
  try {
    const userId = req.user.userId;
    const foundUser = await User.findOne({ _id: userId });  // Renamed variable
    const { storyId, slideIndex } = req.params;

    const story = await Story.findById(storyId);

    if (!foundUser) {  // Using the renamed variable
      return res.status(404).json({ message: 'User not found' });
    }

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (slideIndex < 0 || slideIndex >= story.slides.length) {
      return res.status(400).json({ message: 'Invalid slide index' });
    }

    // Increment the likes for the specific slide
    // story.slides[slideIndex].likes += 1;
    story.slides[slideIndex].userName.push(foundUser.username);
    await story.save();

    return res.status(200).json({ message: 'Slide liked successfully!', likes: story.slides[slideIndex].likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error liking the slide', error: error.message });
  }
});


// unLike a specific slide
router.post('/:storyId/unlike/:slideIndex', [authenticateToken], async (req, res) => {
  try {
    const userId = req.user.userId;
    const foundUser = await User.findOne({ _id: userId });  // Renamed variable
    const { storyId, slideIndex } = req.params;

    const story = await Story.findById(storyId);

    if (!foundUser) {  // Using the renamed variable
      return res.status(404).json({ message: 'User not found' });
    }

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (slideIndex < 0 || slideIndex >= story.slides.length) {
      return res.status(400).json({ message: 'Invalid slide index' });
    }

    story.slides[slideIndex].userName = story.slides[slideIndex].userName.filter(user => user != foundUser.username);

    // Save the story after modification
    await story.save();

    return res.status(200).json({ message: 'Slide unliked successfully!', likes: story.slides[slideIndex].likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error liking the slide', error: error.message });
  }
});


// Share a story (get the link)
router.get('/:id/share', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (story) {
      const link = `http://yourwebsite.com/stories/${story._id}`; // Update this to your actual URL
      return res.status(200).json({ message: 'Story link retrieved successfully!', link });
    } else {
      return res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving story link', error: error.message });
  }
});

// Get all stories
router.get('/all', async (req, res) => {
  try {
    const stories = await Story.find().populate('category'); // Populate fields if needed
    res.status(200).json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving stories', error: error.message });
  }
});


// Bookmark a story
router.post('/bookmarks/:storyId', [authenticateToken], async (req, res) => {
  try {
    const { storyId } = req.params;
    const { index } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if the pair (storyId, index) already exists in the bookmarks
    const bookmarkExists = user.bookmarks.some(
      bookmark => bookmark.story == storyId && bookmark.index === index
    );

    if (bookmarkExists) {
      return { message: 'Bookmark already exists' }; // Prevent duplicate entry
    }

    // Add the new bookmark (storyId, index) if it doesn't exist
    user.bookmarks.push({ story: storyId, index: index });

    await user.save();
    return res.status(200).json({message: "Bookmarked succesfully"});

  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw new Error(error.message);
  }
});


// Get bookmarks
router.get('/bookmarks', [authenticateToken], async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from the token
    const user = await User.findById(userId).populate('bookmarks.story'); // Populate bookmarks with full story data
    res.status(200).json(user.bookmarks); // Return the full bookmarks array
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching bookmarks', error: error.message });
  }
});



//Get a specific story
router.get('/:id', async (req, res) => {
  const { id: storyId } = req.params;
  try {
    const story = await Story.findOne({ _id: storyId }).populate('category'); // Populate fields if needed
    res.status(200).json(story);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving stories', error: error.message });
  }
})


module.exports = router;
