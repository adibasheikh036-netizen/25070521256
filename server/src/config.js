import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Small .env reader with no dependencies. It copes with Windows line endings,
// the byte-order mark Notepad sometimes adds, quotes and trailing comments.
function loadEnvFile(file) {
  if (!existsSync(file)) return;

  const text = readFileSync(file, 'utf8').replace(/^﻿/, '');
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eq = line.indexOf('=');
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    const quoted = /^(['"]).*\1$/.test(value);
    value = quoted ? value.slice(1, -1) : value.replace(/\s+#.*$/, '');

    // Real environment variables win over the file
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(path.join(serverRoot, '.env'));

const DEFAULT_SECRET = 'change-this-to-a-long-random-secret-text';

export const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: (process.env.MONGO_URI || '').trim() || 'mongodb://127.0.0.1:27017/student_portal',
  dbName: (process.env.DB_NAME || 'student_portal').trim(),
  jwtSecret: process.env.JWT_SECRET || DEFAULT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  usingDefaultSecret: !process.env.JWT_SECRET || process.env.JWT_SECRET === DEFAULT_SECRET,
};
