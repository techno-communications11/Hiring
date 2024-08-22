import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token received:', token); // Log the token received on the server

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Token verification error:', err); // Log errors during token verification
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

export default authenticateJWT;
