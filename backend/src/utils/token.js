const jwt = require('jsonwebtoken');

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }

  const payload = { userId };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

module.exports = createToken;
