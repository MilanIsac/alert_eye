const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your-secret-key'; // Set in .env

exports.generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expect "Bearer <token>"
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};