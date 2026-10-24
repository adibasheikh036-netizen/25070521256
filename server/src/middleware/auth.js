import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function signToken(user) {
  return jwt.sign({ sub: user.id, name: user.name }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

// Protects a route: needs the header "Authorization: Bearer <token>"
export function requireAuth(req, res, next) {
  const [scheme, token] = (req.get('authorization') || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Please sign in first.' });
  }

  try {
    req.userId = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] }).sub;
    next();
  } catch {
    res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }
}
