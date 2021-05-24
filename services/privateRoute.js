import jwt from 'jsonwebtoken';

// Array of endpoints that do not need a token
const unprotectedRoutes = [
  { path: '/api/v1/auth/login', method: 'POST' },
  { path: '/api/v1/auth/register', method: 'POST' },
];

// Auth Protection service
export const authProtect = (req, res, next) => {
  if (unprotectedRoutes.find(route => req.path === route.path)) return next();

  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (e) {
    res.status(401).send({ message: 'invalid token!' });
  }
};
