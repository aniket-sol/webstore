import React, { useState, useEffect, useContext } from 'react';
import './index.css';
import Bookmarks from '../../assets/Images/Bookmarks.png';
import BlueBookmark from '../../assets/Images/blueBookmark.png';
import Share from '../../assets/Images/Share.png';
import Cross from '../../assets/Images/Cross.png';
import RedHeart from '../../assets/Images/RedHeart.png';
import WhiteHeart from '../../assets/Images/WhiteHeart.png';
import Left from '../../assets/Images/Left.png';
import Right from '../../assets/Images/Right.png';
import { bookmarkStory, likeStory, unLikeStory } from '../../api';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from '../../pages/Login';
import { AuthContext } from '../../context/AuthContext';

const StoryModal = ({ story, onClose, onLoginSuccess }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState([]);
  const [likesCount, setLikesCount] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingLikeAction, setPendingLikeAction] = useState(null);
  const { login } = useContext(AuthContext);
  const currentUser = JSON.parse(localStorage.getItem("user"));


  const SLIDE_DURATION = 15000; // Duration for each slide

  // Helper function to determine if the URL is a video
  const isVideoUrl = (url) => /\.(mp4|webm|ogg)$/i.test(url);
  useEffect(() => {
    setCurrentSlideIndex(0);
    setProgress(0);
      if (story && story.slides) {
        
        const updatedLikesCount = story.slides.map(
          (slide) => slide.userName.length
        );
        // Set the likesCount array for all slides
        setLikesCount(updatedLikesCount);
        if(currentUser){
          const updatedLiked = story.slides.map((slide) =>
            slide.userName.includes(currentUser.username)
          );
          // Set the liked array for all slides
          setLiked(updatedLiked);
        }
  
    }
  }, [story]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (SLIDE_DURATION / 1000));
      } else {
        nextSlide();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [progress]);

  const nextSlide = () => {
    setProgress(0);
    setCurrentSlideIndex((prevIndex) =>
      prevIndex + 1 < story.slides.length ? prevIndex + 1 : 0
    );
  };

  const prevSlide = () => {
    setProgress(0);
    setCurrentSlideIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : story.slides.length - 1
    );
  };

  const handleCopyLink = (storyId) => {
    const storyLink = `http://localhost:5173/story/${storyId}`;
    navigator.clipboard.writeText(storyLink);
    toast.success("Link copied to clipboard!");
  };

  const toggleLike = async (storyId, index) => {
    if (!currentUser) {
      setPendingLikeAction({ storyId, index });
      setIsLoginModalOpen(true);
      return;
    }

    try {
      if (!liked[currentSlideIndex]) {
        const currLikes = await likeStory(storyId, index);
        setLiked((prevLiked) => {
          const updatedLiked = [...prevLiked];
          updatedLiked[index] = true;
          return updatedLiked;
        });
        setLikesCount((prevLikesCount) => {
          const updatedLikesCount = [...prevLikesCount];
          updatedLikesCount[index] = currLikes;
          return updatedLikesCount;
        });
      } else {
        const currLikes = await unLikeStory(storyId, index);
        setLiked((prevLiked) => {
          const updatedLiked = [...prevLiked];
          updatedLiked[index] = false;
          return updatedLiked;
        });
        setLikesCount((prevLikesCount) => {
          const updatedLikesCount = [...prevLikesCount];
          updatedLikesCount[index] = currLikes;
          return updatedLikesCount;
        });
      }
    } catch (error) {
      toast.error("Failed to toggle like!");
    }
  };

  const handleBookmarkClick = async (id, index) => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const result = await bookmarkStory(id, index);
      if (result) {
        setIsBookmarked(true);
        toast.success("Story bookmarked!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to bookmark story!");
    }
  };

  const renderProgressBars = () => {
    return story.slides.map((_, index) => (
      <div className="small-progress-bar" key={index}>
        <div
          style={{
            width: `${index < currentSlideIndex ? 100 : index === currentSlideIndex ? progress : 0}%`,
          }}
        ></div>
      </div>
    ));
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = (userData) => {
    login(userData);
    setIsLoginModalOpen(false);

    if (pendingLikeAction) {
      const { storyId, index } = pendingLikeAction;
      toggleLike(storyId, index);
      setPendingLikeAction(null);
    }
  };

  const handleDownload = async (url) => {
    if (!currentUser) {
      // setPendingLikeAction({ storyId, index });
      setIsLoginModalOpen(true);
      return;
    }else{
      try {
        const response = await fetch(url, { mode: "cors" });
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = "download";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Error downloading the file:", error);
        toast.error("Failed to download the media.");
      }
    }
  };
  return (
    <div className="story-modal">
      <ToastContainer />
      <div className="Modal-content">
        <div className="progress-bar-container">{renderProgressBars()}</div>
        <div className="story-header">
          <button aria-label="Close" className="close-button" onClick={onClose}>
            <img src={Cross} alt="Close" />
          </button>
          <button
            aria-label="Share"
            className="share-button"
            onClick={() => handleCopyLink(story.id || story._id)}
          >
            <img src={Share} alt="Share" />
          </button>
        </div>
        <div className="story-content">
          {isVideoUrl(story.slides[currentSlideIndex].imageUrl) ? (
            <video
              src={story.slides[currentSlideIndex].imageUrl}
              className="story-image"
              // controls
              autoPlay
              muted
              loop
            />
          ) : (
            <img
              src={story.slides[currentSlideIndex].imageUrl}
              alt="slide"
              className="story-image"
            />
          )}
        </div>
        <div className="story-footer">
          <h3 className="story-heading">
            {story.slides[currentSlideIndex].title}
          </h3>
          <p className="story-description">
            {story.slides[currentSlideIndex].description}
          </p>
          <div className="story-actions">
            <button
              className="bookmark-btn"
              onClick={() =>
                handleBookmarkClick(story.id || story._id, currentSlideIndex)
              }
            >
              <img
                src={isBookmarked ? BlueBookmark : Bookmarks}
                alt="Bookmark"
                className={isBookmarked ? "blue-bookmark" : "default-bookmark"}
              />
            </button>
            <button
              onClick={() => handleDownload(story.slides[currentSlideIndex].imageUrl)}
            >
              Download
            </button>
            <div className="likes-section">
              <button
                className="like-btn"
                onClick={() =>
                  toggleLike(story.id || story._id, currentSlideIndex)
                }
              >
                <img
                  src={liked[currentSlideIndex] ? RedHeart : WhiteHeart}
                  alt="Like"
                />
              </button>
              <span>{likesCount[currentSlideIndex]}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="story-navigation">
        <button className="nav-left" onClick={prevSlide}>
          <img src={Left} alt="Previous" />
        </button>
        <button className="nav-right" onClick={nextSlide}>
          <img src={Right} alt="Next" />
        </button>
      </div>

      {isLoginModalOpen && (
        <Login
          closeModal={closeLoginModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default StoryModal;
