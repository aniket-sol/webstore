import axios from 'axios';

// Base URL for your backend API
export const API_URL = 'http://localhost:3002'; 

// Register function
export const signup = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/user/signup`, userData);
        return response.data;
    } catch (error) {
        console.error("Signup error:", error);
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

// Login function
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/user/login`, credentials);
        console.log("Login response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};

// Function to create a new story
export const createStory = async (storyData) => {
    // console.log(storyData);
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post(`${API_URL}/stories/create`, storyData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(response);
        return response.data;
    } catch (error) {
        // console.log(error);
        console.error("Create story error:", error);
        throw new Error(error.response?.data?.message || 'Failed to create story');
    }
};
// Function to create a new story
export const updateStory = async (storyData, storyId) => {
    const token = localStorage.getItem('token');
  
  try {
    // Use PUT request to update the story, including the storyId in the URL
    const response = await axios.put(`${API_URL}/stories/update/${storyId}`, storyData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Return the response data if the request is successful
    return response.data;
  } catch (error) {
    console.error("Update story error:", error);

    // Throw a new error with a meaningful message from the server (or a fallback message)
    throw new Error(error.response?.data?.message || 'Failed to update story');
  }
};

// Function to fetch stories for a specific category
export const getStoriesByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/categories/${categoryId}/all`);
        console.log(response);
        return response.data.stories;
    } catch (error) {
        console.error("Get stories error:", error);
        throw new Error(error.response?.data?.message || 'Failed to retrieve stories');
    }
};

export const getTopStoriesByCategory = async (categoryId) => {
    try {
        const response = await axios.get(`${API_URL}/categories/${categoryId}/top-stories`);
        console.log(response);
        return response.data.topStories;
    } catch (error) {
        console.error("Get top stories error:", error);
        throw new Error(error.response?.data?.message || 'Failed to retrieve top stories');
    }
};

// Function to like a story
export const likeStory = async (storyId, slideIndex) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post(`${API_URL}/stories/${storyId}/like/${slideIndex}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        return response.data.likes;
    } catch (error) {
        console.error("Like story error:", error);
        throw new Error(error.response?.data?.message || 'Failed to like story');
    }
};
export const unLikeStory = async (storyId, slideIndex) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post(`${API_URL}/stories/${storyId}/unlike/${slideIndex}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        return response.data.likes;
    } catch (error) {
        console.error("UnLike story error:", error);
        throw new Error(error.response?.data?.message || 'Failed to unlike story');
    }
};

// Function to bookmark a story (if you want to implement this feature)
export const bookmarkStory = async (storyId) => {
    const token = localStorage.getItem('token');
    console.log(token);
    try {
        const response = await axios.post(`${API_URL}/stories/bookmarks/${storyId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Bookmark story error:", error);
        throw new Error(error.response?.data?.message || 'Failed to bookmark story');
    }
};

// Function to get bookmarked stories (if you want to implement this feature)
export const getBookmarkedStories = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${API_URL}/stories/bookmarks`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Get bookmarked stories error:", error);
        throw new Error(error.response?.data?.message || 'Failed to retrieve bookmarked stories');
    }
};

// Function to get all stories
export const getAllStories = async () => {
    try {
        const response = await axios.get(`${API_URL}/all`);
        return response.data;
    } catch (error) {
        console.error("Get all stories error:", error);
        throw new Error(error.response?.data?.message || 'Failed to retrieve all stories');
    }
};


