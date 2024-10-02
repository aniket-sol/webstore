import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import StoryModal from '../../Component/Story Modal';
import axios from 'axios';
import { API_URL } from '../../api';

function ShareStory() {
  const { id:storyId } = useParams(); 
  const[story, setStory] = useState();
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState('');
  // console.log("I'm called");
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${API_URL}/stories/${storyId}`);
        console.log(response.data);
        setStory(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch story');
        setLoading(false);
      }
    };
    fetchStories();
  }, [storyId]);
  if(loading) return (<h1>Loading....</h1>)
  if(error) return (<h1>${error}</h1>)

  return (
    <StoryModal story={story}/>
  )
}

export default ShareStory