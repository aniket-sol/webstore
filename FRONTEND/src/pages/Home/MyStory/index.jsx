import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StoryCard from '../Story Card/index';
import { fetchUserStories } from '../../../api';
import './index.css';
import Edit from '../../../assets/Images/Edit.png';
import AddStory from '../../Add Story/index.jsx';

const MyStory = ({ userId, token }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleStories, setVisibleStories] = useState(4);
  const [selectedStory, setSelectedStory] = useState(null); // State to store selected story for editing
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false); // State to manage modal visibility
  const [isEditMode, setIsEditMode] = useState(false); // Track whether it's edit mode
  
  useEffect(() => {
    const fetchStories = async () => {
      const response = await fetchUserStories();
      if(response){
        setStories(response);
        setLoading(false);
      }else{
        setError('Failed to fetch stories');
        setLoading(false);
      }
    };

    if (userId) {
      fetchStories();
    }
  }, [userId, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Handle opening the AddStoryModal for editing
  const handleEditStory = (story) => {
    setSelectedStory(story); // Set the selected story for editing
    setIsEditMode(true); // Enable edit mode
    setIsAddStoryModalOpen(true); // Open the modal
  };

  // Handle opening the modal for adding a new story
  const handleAddNewStory = () => {
    setSelectedStory(null); // Clear selected story for new creation
    setIsEditMode(false); // Disable edit mode
    setIsAddStoryModalOpen(true); // Open the modal
  };

  const handleShowMore = () => {
    setVisibleStories((prevVisible) => prevVisible + 4); // Show 4 more stories when clicked
  };

  return (
    <div className="my-story-container">
      <h2>Your Stories</h2>

      {stories.length > 0 ? (
        <div className="story-cards">
          {stories.slice(0, visibleStories).map((story) => (
            <div key={story._id} className="story-card">
              <StoryCard story={story} />
              {/* Edit button for each story */}
              <button className="Edit-btn" onClick={() => handleEditStory(story)}>
                <img src={Edit} alt="Edit" />
                Edit
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>No stories found.</div>
      )}

      {/* Show "Show More" button only if there are more than 4 stories */}
      {stories.length > visibleStories && (
        <button className="show-more-btn" onClick={handleShowMore}>
          Show More
        </button>
      )}

      {/* Render the AddStoryModal with selected story data */}
      {isAddStoryModalOpen && (
        <AddStory
          isOpen={isAddStoryModalOpen}
          closeModal={() => setIsAddStoryModalOpen(false)}
          storyData={selectedStory} // Pass selected story data
          isEditMode={isEditMode} // Whether it's edit mode or not
        />
      )}
    </div>
  );
};

export default MyStory;
