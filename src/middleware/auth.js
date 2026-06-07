const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  // If no token was sent, reject the request
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  // Verify the token is valid and not expired
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }

    // Attach the decoded user info to the request object
    req.user = decoded
    next()
  })
}