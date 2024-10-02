import React, { useState, useEffect } from 'react';
import { getTopStoriesByCategory } from '../../../api.js'; // Adjust the path to your api file
import StoryCard from '../Story Card/index.jsx'; // Adjust the path to StoryCard
import StoryModal from '../../../Component/Story Modal/index.jsx'; // Import the StoryModal
import './index.css';

function StoryContainer({ selectedCategories }) {
  const [categoryStories, setCategoryStories] = useState({});
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const [selectedStory, setSelectedStory] = useState(null); // Track the selected story

  useEffect(() => {
    const fetchStories = async (categories) => {
      try {
        const newCategoryStories = {};
        for (const category of categories) {
          const stories = await getTopStoriesByCategory(category);
          newCategoryStories[category] = stories;
        }
        setCategoryStories(newCategoryStories);
      } catch (error) {
        console.error('Fetch stories error:', error);
        setError(error);
      }
    };

    if (selectedCategories.length > 0) {
      fetchStories(selectedCategories);
    }
  }, [selectedCategories]);

  // Open the modal and set the selected story
  const openModal = (story) => {
    if (story.slides.length >= 3 && story.slides.length <= 6) { // Ensure valid number of slides
      setSelectedStory(story); // Set the selected story
      setIsModalOpen(true); // Open the modal
    } else {
      console.error("Invalid number of slides:", story.slides.length);
    }
  };

  // Close the modal and reset the selected story
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedStory(null); // Reset the selected story
  };

  if (error) {
    return <div>Error loading stories: {error.message}</div>;
  }

  return (
    <div className="story-container">
      {selectedCategories.map((category) => (
        <div key={category} className="category-story-container">
          <h2>Top Stories About {category}</h2>
          {categoryStories[category] && categoryStories[category].length > 0 ? (
            <div className="story-cards">
              {categoryStories[category].map((story, index) => (
                <StoryCard 
                  key={index} 
                  story={story} // Pass the entire story object
                  onClick={() => openModal(story)} // Pass the whole story to modal
                />
              ))}
            </div>
          ) : (
            <div className='no-story'>No stories available</div>
          )}
        </div>
      ))}

      {/* Story Modal */}
      {isModalOpen && selectedStory && (
        <StoryModal
          story={selectedStory} // Pass the entire story object to modal
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default StoryContainer;
