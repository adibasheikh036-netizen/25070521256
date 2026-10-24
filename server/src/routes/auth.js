import bcrypt from 'bcryptjs';
import { Router } from 'express';
import mongoose from 'mongoose';
import { requireAuth, signToken } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { validateLogin, validateSignup } from '../utils/validate.js';

const router = Router();

const DUPLICATE_MESSAGE = 'An account with this email already exists. Please sign in.';

// Compared against when the email is unknown, so a wrong email takes as long
// as a wrong password and nobody can guess which emails are registered.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

function sendValidationErrors(res, errors) {
  res.status(400).json({ error: Object.values(errors)[0], fields: errors });
}

async function markLoggedIn(user) {
  user.loginCount += 1;
  user.lastLoginAt = new Date();
  await user.save();
  return { token: signToken(user), user: user.toPublic() };
}

router.post('/signup', async (req, res) => {
  const { errors, data } = validateSignup(req.body);
  if (errors) return sendValidationErrors(res, errors);

  if (await User.exists({ email: data.email })) {
    return res.status(409).json({ error: DUPLICATE_MESSAGE, fields: { email: DUPLICATE_MESSAGE } });
  }

  let user;
  try {
    user = await User.create({
      name: data.name,
      email: data.email,
      course: data.course,
      password: await bcrypt.hash(data.password, 10),
    });
  } catch (err) {
    // Two signups with the same email at the same moment: the unique index catches it
    if (err.code === 11000) return res.status(409).json({ error: DUPLICATE_MESSAGE });
    throw err;
  }

  // Signing up also signs the student in
  res.status(201).json(await markLoggedIn(user));
});

router.post('/login', async (req, res) => {
  const { errors, data } = validateLogin(req.body);
  if (errors) return sendValidationErrors(res, errors);

  const user = await User.findOne({ email: data.email });
  const passwordOk = await bcrypt.compare(data.password, user?.password ?? DUMMY_HASH);
  if (!user || !passwordOk) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  res.json(await markLoggedIn(user));
});

router.get('/me', requireAuth, async (req, res) => {
  const user = mongoose.isValidObjectId(req.userId) ? await User.findById(req.userId) : null;
  if (!user) {
    return res.status(401).json({ error: 'Account not found. Please sign in again.' });
  }
  res.json({ user: user.toPublic(), stats: { totalStudents: await User.countDocuments() } });
});

export default router;
