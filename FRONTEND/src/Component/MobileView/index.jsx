import React, { useState } from 'react';
import MyStory from '../../pages/Home/MyStory/index.jsx';
import Navbar from './Navbar'; // Assume this is your navbar component

const MobileView = ({ userId, token }) => {
  const [showMyStory, setShowMyStory] = useState(false);

  return (
    <div>
      <Navbar setShowMyStory={setShowMyStory} />
      
      {showMyStory ? (
        <MyStory userId={userId} token={token} />
      ) : (
        <StoryContainer />
      )}
    </div>
  );
};

export default MobileView;
