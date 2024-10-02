import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StoryCard from '../Home/Story Card/index.jsx'; // Import the StoryCard component
import './index.css';
import { getBookmarkedStories } from '../../api.js';
import StoryModal from '../../Component/Story Modal/index.jsx';

const Bookmark = ({ userId }) => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        // const response = await axios.get(`/api/stories/bookmark/${userId}`);
        const bookmarks = await getBookmarkedStories();
        // console.log("bookmarks");
        // console.log(bookmarks);
        setBookmarkedStories(bookmarks);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bookmarked stories');
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [userId]);

  const filterStoryBySlide = (story, index) => {
    // Create a new story object with all properties of the original, except slides
    const filteredStory = {
      ...story, // Spread the original story object
      slides: [story.slides[index]] // Only include the specific slide at the given index
    };
    return filteredStory;
  };

  // Open the modal and set the selected story
  const openModal = () => {
    // const filterStory = filterStoryBySlide(story, index);
    // setSelectedStory(filterStory);
  };

  // Close the modal and reset the selected story
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedStory(null); // Reset the selected story
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bookmark-container">
      <h2>Your Bookmarks</h2> {/* Always present heading */}
      <div className="story-cards">
        {bookmarkedStories.length > 0 ? (
          bookmarkedStories.map((story, idx) => (
            <StoryCard
              key={idx}
              story={story.story}
              index={story.index}
              onClick={() => openModal()} 
              />  // Render StoryCard for each story
          ))
        ) : (
          <div className='no-story'>No bookmarked stories available.</div>
        )}
      </div>
    </div>
  );
};

export default Bookmark;
