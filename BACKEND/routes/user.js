const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Story = require('../models/Story');
const router = express.Router();
const LoginRecord = require('../models/LoginRecord'); // Import the model
const { authenticateToken } = require('../middleware/auth');

// Register Route
router.post('/signup', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            passwordHash: hashedPassword
        });

        await newUser.save();
        console.log(`User registered: ${username}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
router.post('/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Create login history record
        const loginRecord = new LoginRecord({
            userId: user._id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        await loginRecord.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        console.log(`User logged in: ${username}`);
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                username: user.username,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

//Get stories
router.get('/stories',[authenticateToken], async (req, res) => {
    try {
        const userId = req.user.userId;
        const stories = await Story.find({ user: userId }).populate('category'); // Populate fields if needed
        res.status(200).json(stories);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving stories', error: error.message });
      }
});


module.exports = router;
