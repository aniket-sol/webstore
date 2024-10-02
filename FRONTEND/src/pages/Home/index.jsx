import React, { useState, useContext } from 'react';
import Categories from '../Home/Categories/index.jsx'; // Your category component
import StoryContainer from '../Home/StoryContainer/index.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import MyStory from './MyStory/index.jsx';

const Home = () => {
  const { isLoggedIn, user, token } = useContext(AuthContext);
  const [selectedCategories, setSelectedCategories] = useState(['Food']); // Default to 'Food'

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
  };


  return (
    <div className="home">
      {/* Render Categories component and pass the handler */}
      <Categories onCategorySelect={handleCategorySelect} />

      { /*Display user stories*/}
      {isLoggedIn && <MyStory userId={user} token={token} />} 

      {/* Render StoryContainer and pass the selected category */}
      {selectedCategories.length > 0 && (
        <StoryContainer selectedCategories={selectedCategories} />
      )}
    </div>
  );
};

export default Home;
