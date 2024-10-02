const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Assuming token is in the 'Authorization: Bearer <token>' format
  if (!token){
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user info (including userId) to the request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticateToken };