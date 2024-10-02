const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3002;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/WEBSTORY';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this if needed for your frontend
}));

// Routes
const storyRoutes = require('./routes/stories');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/categories');

app.use('/stories', storyRoutes);
app.use('/user', userRoutes);
app.use('/categories', categoryRoutes);

// Middleware for 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
