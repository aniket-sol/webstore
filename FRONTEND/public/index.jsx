import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StoryCard from '../Home/Story Card/index.jsx'; // Import the StoryCard component
import './index.css';
import { getBookmarkedStories } from '../../api.js';

const Bookmark = ({ userId }) => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log(userId);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        // const response = await axios.get(`/api/stories/bookmark/${userId}`);
        const bookmarks = await getBookmarkedStories();
        console.log(bookmarks);
        setBookmarkedStories(bookmarks);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bookmarked stories');
        setLoading(false);
      }
    };

    // if (userId) {
    //   fetchBookmarks();
    // }
    fetchBookmarks();
  }, [userId]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bookmark-container">
      <h2>Your Bookmarks</h2> {/* Always present heading */}
      <div className="story-cards">
        {bookmarkedStories.length > 0 ? (
          bookmarkedStories.map((story, index) => (
            <StoryCard
              key={story._id}
              title={story.slides[index].title}
              description={story.slides[index].description}
              imageUrl={story.slides[index].imageUrl}
            />
          ))
        ) : (
          <div className='no-story'>No bookmarked stories available.</div>
        )}
      </div>
    </div>
  );
};

export default Bookmark;
