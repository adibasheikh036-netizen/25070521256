const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (value) => String(value ?? '').trim();

export const normalizeEmail = (value) => clean(value).toLowerCase();

function result(errors, data) {
  return Object.keys(errors).length ? { errors, data: null } : { errors: null, data };
}

export function validateSignup(body = {}) {
  const name = clean(body.name).replace(/\s+/g, ' ');
  const email = normalizeEmail(body.email);
  const course = clean(body.course).slice(0, 60);
  const password = String(body.password ?? '');
  const errors = {};

  if (name.length < 2) errors.name = 'Please enter your full name.';
  else if (name.length > 60) errors.name = 'Name is too long (max 60 characters).';

  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';

  if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
  // bcrypt only uses the first 72 bytes of a password
  else if (Buffer.byteLength(password) > 72) errors.password = 'Password is too long (max 72 characters).';

  return result(errors, { name, email, course, password });
}

export function validateLogin(body = {}) {
  const email = normalizeEmail(body.email);
  const password = String(body.password ?? '');
  const errors = {};

  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';
  if (!password) errors.password = 'Please enter your password.';

  return result(errors, { email, password });
}
