const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    
    const token = authHeader.split(' ')[1]; 
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.userId = decoded.id; 

    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

