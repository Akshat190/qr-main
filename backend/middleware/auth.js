const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is about to expire (e.g., within 5 minutes)
    const tokenExp = decodedToken.exp * 1000;
    const now = Date.now();
    if (tokenExp - now < 5 * 60 * 1000) {
      // Token is about to expire, issue a new one
      const user = await User.findById(decodedToken.id);
      const newToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.setHeader('X-New-Token', newToken);
    }

    req.userId = decodedToken.id;
    req.userRole = decodedToken.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};
