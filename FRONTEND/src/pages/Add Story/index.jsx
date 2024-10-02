import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import { createStory, updateStory } from '../../api.js';

const AddStory = ({ isOpen, closeModal, storyData, isEditMode }) => {
  const [slides, setSlides] = useState([{ id: Date.now(), heading: '', description: '', url: '' }]);
  const [category, setCategory] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCategoryLocked, setIsCategoryLocked] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ heading: false, description: false, url: false });
  const [submissionError, setSubmissionError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Regex to check if the URL is a video file
  const videoUrlRegex = /\.(mp4|webm|ogg)$/i;

  // Pre-fill info
  useEffect(() => {
    if (isEditMode && storyData) {
      setSlides(storyData.slides.map(slide => ({
        heading: slide.title || '',
        description: slide.description || '',
        url: slide.imageUrl || ''
      })));
      setCategory(storyData.category.name);
      setIsCategoryLocked(true);
    }
  }, [isEditMode, storyData]);

  const validateSlideFields = () => {
    const { heading, description, url } = slides[currentSlide];
    const errors = {
      heading: !heading,
      description: !description,
      url: !url,
    };
    setFieldErrors(errors);
    return !errors.heading && !errors.description && !errors.url;
  };

  const handleSlideChange = (field, value) => {
    const newSlides = [...slides];
    newSlides[currentSlide][field] = value;
    setSlides(newSlides);
    setFieldErrors({ ...fieldErrors, [field]: false });
  };

  const handleAddSlide = () => {
    if (!validateSlideFields()) return;

    if (slides.length < 6) {
      setSlides([...slides, { id: Date.now(), heading: '', description: '', url: '' }]);
      setCurrentSlide(slides.length);
      setFieldErrors({ heading: false, description: false, url: false });
      setSubmissionError('');
      if (slides.length === 1) {
        setIsCategoryLocked(true);
      }
    }
  };

  const handleDeleteSlide = (index) => {
    const newSlides = slides.filter((_, slideIndex) => slideIndex !== index);
    setSlides(newSlides);
    if (currentSlide >= newSlides.length) {
      setCurrentSlide(newSlides.length - 1);
    }
    if (newSlides.length <= 1) {
      setIsCategoryLocked(false);
    }
  };

  const goToPreviousSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const goToNextSlide = () => {
    if (validateSlideFields()) {
      setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
    }
  };

  const handleSubmit = async () => {
    if (slides.length < 3) {
      setSubmissionError('You need to add at least 3 slides before posting.');
      return;
    }
    if (!validateSlideFields() || !category) {
      setSubmissionError('Please fill all fields and select a category.');
      return;
    }

    const storyDataToSubmit = {
      titles: slides.map(slide => slide.heading),
      descriptions: slides.map(slide => slide.description),
      imageUrls: slides.map(slide => slide.url),
      categoryId: category,
    };

    setIsLoading(true);
    try {
      if (isEditMode) {
        await updateStory(storyDataToSubmit, storyData._id);
      } else {
        await createStory(storyDataToSubmit);
      }
      setSubmissionError('');
      closeModal();
    } catch (error) {
      setSubmissionError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSlideTabs = () => (
    <div className="slide-tabs">
      {slides.map((_, index) => (
        <div className="slide-tab-container" key={index}>
          <button
            className={`slide-tab ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          >
            Slide {index + 1}
          </button>
          {slides.length > 1 && (
            <button className="delete-slide-btn" onClick={() => handleDeleteSlide(index)}>
              ×
            </button>
          )}
        </div>
      ))}
      {slides.length < 6 && (
        <button className="slide-tab add-slide-tab" onClick={handleAddSlide}>
          Add +
        </button>
      )}
    </div>
  );

  const renderSlideMedia = () => {
    const { url } = slides[currentSlide];
    if (videoUrlRegex.test(url)) {
      return <video src={url} controls className="slide-video" />;
    } else {
      return <img src={url} alt="Slide content" className="slide-image" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-story-modal">
        <button className="close-btn" onClick={closeModal}>X</button>
        <h1 className='head'>Add Story to Feed</h1>

        <div className="mobile-view">
          <div className="slide-section">
            {renderSlideTabs()}
            <p className="slide-limit-info">Add up to 6 slides</p>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="heading">Heading </label>
              <input
                type="text"
                id="heading"
                placeholder="Your heading"
                value={slides[currentSlide].heading}
                onChange={(e) => handleSlideChange('heading', e.target.value)}
                style={{ borderColor: fieldErrors.heading ? 'red' : '' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description </label>
              <textarea
                id="description"
                placeholder="Story Description"
                value={slides[currentSlide].description}
                onChange={(e) => handleSlideChange('description', e.target.value)}
                style={{ borderColor: fieldErrors.description ? 'red' : '' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="url">Image/Video URL </label>
              <input
                type="text"
                id="url"
                placeholder="Add Image/Video URL"
                value={slides[currentSlide].url}
                onChange={(e) => handleSlideChange('url', e.target.value)}
                style={{ borderColor: fieldErrors.url ? 'red' : '' }}
              />
            </div>

            <div className="form-group">
              <label>Category :</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isCategoryLocked && slides.length > 1}
              >
                <option value="">Select category</option>
                <option value="Food">Food</option>
                <option value="Health and Fitness">Health and Fitness</option>
                <option value="Travel">Travel</option>
                <option value="Movie">Movie</option>
                <option value="Education">Education</option>
              </select>
            </div>
          </div>
        </div>

        {submissionError && <p className="error-message">{submissionError}</p>}

        <div className="button-group">
          <div className="navigators">
            <button className="prev-btn" onClick={goToPreviousSlide} disabled={currentSlide === 0}>
              Previous
            </button>
            <button className="next-btn" onClick={goToNextSlide} disabled={currentSlide === slides.length - 1}>
              Next
            </button>
          </div>
          <div className="post">
            <button className="post-btn" onClick={handleSubmit}>
              {isLoading ? 'Posting...' : isEditMode ? 'Update' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AddStory.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  storyData: PropTypes.object,
  isEditMode: PropTypes.bool,
};

export default AddStory;
