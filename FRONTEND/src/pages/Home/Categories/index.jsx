import React, { useState, useEffect } from 'react';
import './index.css';
import All from '../../../assets/Images/All.png'; 
import Food from '../../../assets/Images/Food.png'; 
import Health from '../../../assets/Images/Health.jpg'; 
import Travel from '../../../assets/Images/Travel.jpg'; 
import Movie from '../../../assets/Images/Movie.jpg'; 
import Education from '../../../assets/Images/Education.jpg';

const categories = [
  { name: 'All', img: All },
  { name: 'Food', img: Food },
  { name: 'Health and Fitness', img: Health },
  { name: 'Travel', img: Travel },
  { name: 'Movie', img: Movie },
  { name: 'Education', img: Education },
];

function Category({ onCategorySelect }) {
  const [selectedCategories, setSelectedCategories] = useState(['Food']); // Default selected category

  useEffect(() => {
    // Pass selected categories to parent component
    onCategorySelect(selectedCategories);
  }, [selectedCategories, onCategorySelect]);

  const handleCategoryClick = (category) => {
    if (category === 'All') {
      const allCategories = categories.slice(1).map(cat => cat.name); // Remove 'All' category
      setSelectedCategories(allCategories);
    } else {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories.filter(c => c !== 'All'), category];

      if (newCategories.length === 0) {
        newCategories.push('Food'); // Ensure 'Food' is selected by default if no categories
      }

      setSelectedCategories(newCategories);
    }
  };

  return (
    <div className="category-container">
      <div className="category-list">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className={`category-item ${selectedCategories.includes(category.name) ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.name)}
          >
            <img src={category.img} alt={category.name} className="category-image" />
            <span className="category-label">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;
