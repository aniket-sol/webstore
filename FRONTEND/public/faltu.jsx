// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import './index.css';
// // import { createStory, updateStory } from '../../api.js';
// import { createStory, updateStory } from '../../api.js';

// const AddStory = ({ isOpen, closeModal, storyData, isEditMode }) => {
//   const [slides, setSlides] = useState([{ id: Date.now(), heading: '', description: '', url: '' }]);
//   const [category, setCategory] = useState('');
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isCategoryLocked, setIsCategoryLocked] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({ heading: false, description: false, url: false });
//   const [submissionError, setSubmissionError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // Pre-fill info
//   useEffect(() => {
//     if (isEditMode && storyData) {
//       // Set all slides with heading, description, and URL from storyData
//       setSlides(storyData.slides.map(slide => ({
//         heading: slide.title || '', 
//         description: slide.description || '', 
//         url: slide.imageUrl || ''
//       })));
//       setCategory(storyData.category.name);
//       setIsCategoryLocked(true);
//     }
//   }, [isEditMode, storyData]);

//   const validateSlideFields = () => {
//     const { heading, description, url } = slides[currentSlide];
//     const errors = {
//       heading: !heading,
//       description: !description,
//       url: !url,
//     };
//     setFieldErrors(errors);

//     return !errors.heading && !errors.description && !errors.url;
//   };

//   const handleSlideChange = (field, value) => {
//     const newSlides = [...slides];
//     newSlides[currentSlide][field] = value;
//     setSlides(newSlides);
//     setFieldErrors({ ...fieldErrors, [field]: false });
//   };

//   const handleAddSlide = () => {
//     if (!validateSlideFields()) return;

//     if (slides.length < 6) {
//       setSlides([...slides, { id: Date.now(), heading: '', description: '', url: '' }]);
//       setCurrentSlide(slides.length);
//       setFieldErrors({ heading: false, description: false, url: false });
//       setSubmissionError('');
//       if (slides.length === 1) {
//         setIsCategoryLocked(true);
//       }
//     }
//   };

//   const handleDeleteSlide = (index) => {
//     const newSlides = slides.filter((_, slideIndex) => slideIndex !== index);
//     setSlides(newSlides);

//     if (currentSlide >= newSlides.length) {
//       setCurrentSlide(newSlides.length - 1);
//     }

//     if (newSlides.length <= 1) {
//       setIsCategoryLocked(false);
//     }
//   };

//   const goToPreviousSlide = () => {
//     setCurrentSlide((prev) => Math.max(prev - 1, 0));
//   };

//   const goToNextSlide = () => {
//     if (validateSlideFields()) {
//       setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
//     }
//   };

//   const handleSubmit = async () => {
//     if (slides.length < 3) {
//       setSubmissionError('You need to add at least 3 slides before posting.');
//       return;
//     }

//     if (!validateSlideFields() || !category) {
//       setSubmissionError('Please fill all fields and select a category.');
//       return;
//     }

//     const storyDataToSubmit = {
//       titles: slides.map(slide => slide.heading),
//       descriptions: slides.map(slide => slide.description),
//       imageUrls: slides.map(slide => slide.url),
//       categoryId: category,
//     };

//     setIsLoading(true);
//     try {
//       if (isEditMode) {
//         // Update existing story
//         await updateStory(storyDataToSubmit, storyData._id);
//       } else {
//         // Create new story
//         await createStory(storyDataToSubmit);
//       }
//       setSubmissionError('');
//       closeModal();
//     } catch (error) {
//       setSubmissionError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderSlideTabs = () => (
//     <div className="slide-tabs">
//       {slides.map((_, index) => (
//         <div className="slide-tab-container" key={index}>
//           <button
//             className={slide-tab ${index === currentSlide ? 'active' : ''}}
//             onClick={() => setCurrentSlide(index)}
//           >
//             Slide {index + 1}
//           </button>
//           {slides.length > 1 && (
//             <button
//               className="delete-slide-btn"
//               onClick={() => handleDeleteSlide(index)}
//             >
//               ×
//             </button>
//           )}
//         </div>
//       ))}
//       {slides.length < 6 && (
//         <button className="slide-tab add-slide-tab" onClick={handleAddSlide}>
//           Add +
//         </button>
//       )}
//     </div>
//   );

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="add-story-modal">
//         <button className="close-btn" onClick={closeModal}>X</button>

//         <div className="slide-section">
//           {renderSlideTabs()}
//           <p className="slide-limit-info">Add up to 6 slides</p>
//         </div>

//         <div className="form-section">
//           <div className="form-group">
//             <label htmlFor="heading">Heading :</label>
//             <input
//               type="text"
//               id="heading"
//               placeholder="Your heading"
//               value={slides[currentSlide].heading}
//               onChange={(e) => handleSlideChange('heading', e.target.value)}
//               style={{ borderColor: fieldErrors.heading ? 'red' : '' }}
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="description">Description :</label>
//             <textarea
//               id="description"
//               placeholder="Story Description"
//               value={slides[currentSlide].description}
//               onChange={(e) => handleSlideChange('description', e.target.value)}
//               style={{ borderColor: fieldErrors.description ? 'red' : '' }}
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="url">Image URL :</label>
//             <input
//               type="text"
//               id="url"
//               placeholder="Add Image URL"
//               value={slides[currentSlide].url}
//               onChange={(e) => handleSlideChange('url', e.target.value)}
//               style={{ borderColor: fieldErrors.url ? 'red' : '' }}
//             />
//           </div>

//           <div className="form-group">
//             <label>Category :</label>
//             <select
//               value={category}
//               onChange={(e) => setCategory(e.target.value)}
//               disabled={isCategoryLocked && slides.length > 1}
//             >
//               <option value="">Select category</option>
//               <option value="Food">Food</option>
//               <option value="Health and Fitness">Health and Fitness</option>
//               <option value="Travel">Travel</option>
//               <option value="Movie">Movie</option>
//               <option value="Education">Education</option>
//             </select>
//           </div>
//         </div>

//         {submissionError && <p className="error-message">{submissionError}</p>}

//         <div className="button-group">
//           <div className="navigators">
//             <button
//               className="prev-btn"
//               onClick={goToPreviousSlide}
//               disabled={currentSlide === 0}
//             >
//               Previous
//             </button>
//             <button
//               className="next-btn"
//               onClick={goToNextSlide}
//               disabled={currentSlide === slides.length - 1}
//             >
//               Next
//             </button>
//           </div>
//           <div className="post">
//             <button className="post-btn" onClick={handleSubmit}>
//               {isLoading ? 'Posting...' : isEditMode ? 'Update' : 'Post'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// AddStory.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   closeModal: PropTypes.func.isRequired,
//   storyData: PropTypes.object, // Story data for editing
//   isEditMode: PropTypes.bool, // If true, it's edit mode
// };

// export default AddStory;




// import React from 'react';
// import './index.css';

// const StoryCard = ({ story, onClick }) => {
//     console.log(story);
//     const firstSlide = story.slides[story.index?story.index:0];

//     return (
//         <div className="story-card" onClick={onClick}> 
//             {firstSlide.imageUrl && (
//                 <img src={firstSlide.imageUrl} alt={firstSlide.title} className="story-image" />
//             )}
//             <h3 className="story-title">{firstSlide.title}</h3>
//             <p className="story-description">{firstSlide.description}</p>
//         </div>
//     );
// };

// export default StoryCard;




// import React, { useState, useEffect, useContext } from 'react';
// import './index.css';
// import Bookmarks from '../../assets/Images/Bookmarks.png';
// import BlueBookmark from '../../assets/Images/blueBookmark.png';
// import Share from '../../assets/Images/Share.png';
// import Cross from '../../assets/Images/Cross.png';
// import RedHeart from '../../assets/Images/RedHeart.png';
// import WhiteHeart from '../../assets/Images/WhiteHeart.png';
// import Left from '../../assets/Images/Left.png';
// import Right from '../../assets/Images/Right.png';
// import { bookmarkStory, likeStory, unLikeStory } from '../../api';
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Login from '../../pages/Login';
// import { AuthContext } from '../../context/AuthContext';

// const StoryModal = ({ story, onClose }) => {
//   const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const [liked, setLiked] = useState([]);
//   const [likesCount, setLikesCount] = useState([]);
//   const [isBookmarked, setIsBookmarked] = useState(false); // Add bookmark state
//   const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")));
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [pendingLikeAction, setPendingLikeAction] = useState(null); 
//   const { login } = useContext(AuthContext); 

//   const SLIDE_DURATION = 15000;

//   useEffect(() => {
//     setCurrentSlideIndex(0);
//     setProgress(0);
//   }, [story]);

//   useEffect(() => {
//     if (story && story.slides && story.slides[currentSlideIndex]) {
//       const isLiked = story.slides[currentSlideIndex].userName.includes(currentUser?.username || '');
//       const currentLikesCount = story.slides[currentSlideIndex].userName.length;

//       setLiked((prevLiked) => {
//         const updatedLiked = [...prevLiked];
//         updatedLiked[currentSlideIndex] = isLiked;
//         return updatedLiked;
//       });

//       setLikesCount((prevLikesCount) => {
//         const updatedLikesCount = [...prevLikesCount];
//         updatedLikesCount[currentSlideIndex] = currentLikesCount;
//         return updatedLikesCount;
//       });
//     }
//   }, [currentSlideIndex, story, currentUser]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (progress < 100) {
//         setProgress((prev) => prev + 100 / (SLIDE_DURATION / 1000));
//       } else {
//         nextSlide();
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [progress]);

//   const nextSlide = () => {
//     setProgress(0);
//     setCurrentSlideIndex((prevIndex) =>
//       prevIndex + 1 < story.slides.length ? prevIndex + 1 : 0
//     );
//   };

//   const prevSlide = () => {
//     setProgress(0);
//     setCurrentSlideIndex((prevIndex) =>
//       prevIndex > 0 ? prevIndex - 1 : story.slides.length - 1
//     );
//   };

//   const handleCopyLink = (storyId) => {
//     // "localhosht::1153/storyId"
//     const storyLink = `http://localhost:5173/story/${storyId}`;
//     navigator.clipboard.writeText(storyLink);
//     toast.success("Link copied to clipboard!");
//   };

//   const toggleLike = async (storyId, index) => {
//     if (!currentUser) {
//       // If the user is not logged in, store the pending action
//       setPendingLikeAction({ storyId, index });
//       setIsLoginModalOpen(true);
//       return;
//     }

//     try {
//       if (!liked[currentSlideIndex]) {
//         const currLikes = await likeStory(storyId, index);
//         setLiked((prevLiked) => {
//           const updatedLiked = [...prevLiked];
//           updatedLiked[index] = true;
//           return updatedLiked;
//         });
//         setLikesCount((prevLikesCount) => {
//           const updatedLikesCount = [...prevLikesCount];
//           updatedLikesCount[index] = currLikes;
//           return updatedLikesCount;
//         });
//       } else {
//         const currLikes = await unLikeStory(storyId, index);
//         setLiked((prevLiked) => {
//           const updatedLiked = [...prevLiked];
//           updatedLiked[index] = false;
//           return updatedLiked;
//         });
//         setLikesCount((prevLikesCount) => {
//           const updatedLikesCount = [...prevLikesCount];
//           updatedLikesCount[index] = currLikes;
//           return updatedLikesCount;
//         });
//       }
//     } catch (error) {
//       toast.error("Failed to toggle like!");
//     }
//   };

//   const handleBookmarkClick = async (id, index) => {
//     if (!currentUser) {
//       // If the user is not logged in, open the login modal
//       setIsLoginModalOpen(true);
//       return;
//     }

//     try {
//       const result = await bookmarkStory(id, index);
//       if(result){
//         setIsBookmarked(true); // Toggle to blue bookmark on success
//         toast.success("Story bookmarked!");
//       }
//     } catch (error) {
//       toast.error("Failed to bookmark story!");
//     }
//   };

//   const renderProgressBars = () => {
//     return story.slides.map((_, index) => (
//       <div className="small-progress-bar" key={index}>
//         <div
//           style={{
//             width: `${index < currentSlideIndex ? 100 : index === currentSlideIndex ? progress : 0}%`,
//           }}
//         ></div>
//       </div>
//     ));
//   };

//   const closeLoginModal = () => {
//     setIsLoginModalOpen(false);
//   };

//   // Handle login success and execute pending action
//   const handleLoginSuccess = (userData) => {
//     login(userData); // If using AuthContext for managing user state
//     setIsLoginModalOpen(false);
    
//     // Check for pending action and try to perform it
//     if (pendingLikeAction) {
//       const { storyId, index } = pendingLikeAction;
//       toggleLike(storyId, index);
//       setPendingLikeAction(null); // Clear the pending action after executing
//     }
//   };

//   return (
//     <div className="story-modal">
//       <ToastContainer />
//       <div className="Modal-content">
//         <div className="progress-bar-container">{renderProgressBars()}</div>
//         <div className="story-header">
//           <button aria-label="Close" className="close-button" onClick={onClose}>
//             <img src={Cross} alt="Close" />
//           </button>
//           <button aria-label="Share" className="share-button" onClick={() => handleCopyLink(story.id || story._id)}>
//             <img src={Share} alt="Share" />
//           </button>
//         </div>
//         <div className="story-content">
//           <img
//             src={story.slides[currentSlideIndex].imageUrl}
//             alt="slide"
//             className="story-image"
//           />
//         </div>
//         <div className="story-footer">
//           <h3 className="story-heading">{story.slides[currentSlideIndex].title}</h3>
//           <p className="story-description">
//             {story.slides[currentSlideIndex].description}
//           </p>
//           <div className="story-actions">
//             <button className="bookmark-btn" onClick={() => handleBookmarkClick(story.id || story._id, currentSlideIndex)}>
//               <img src={isBookmarked ? BlueBookmark : Bookmarks} alt="Bookmark" 
//               className={isBookmarked ? 'blue-bookmark' : 'default-bookmark'} />
//             </button>
//             <div className="likes-section">
//               <button className="like-btn" onClick={() => toggleLike(story.id || story._id, currentSlideIndex)}>
//                 <img src={liked[currentSlideIndex] ? RedHeart : WhiteHeart} alt="Like" />
//               </button>
//               <span>{likesCount[currentSlideIndex]}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="story-navigation">
//         <button className="nav-left" onClick={prevSlide}>
//           <img src={Left} alt="Previous" />
//         </button>
//         <button className="nav-right" onClick={nextSlide}>
//           <img src={Right} alt="Next" />
//         </button>
//       </div>

//       {isLoginModalOpen && (
//         <Login
//           closeModal={closeLoginModal}
//           onLoginSuccess={handleLoginSuccess} // Pass down the success callback
//         />
//       )}
//     </div>
//   );
// };

// export default StoryModal;
