import './checkNode.js';
import express from 'express';
import mongoose from 'mongoose';
import { config } from './config.js';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';

const db = await connectDB();
const app = express();

app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'database-offline',
    database: db.name,
    time: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

app.get('/', (req, res) => {
  res.type('text').send('Student Portal API is running. Open the app at http://localhost:5173');
});

// Express 5 sends errors from async routes here automatically
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'The request body is not valid JSON.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server. Please try again.' });
});

// 127.0.0.1 = only this computer can reach the API, so Windows Firewall never asks
const server = app.listen(config.port, '127.0.0.1', () => {
  console.log('\n  ==========================================');
  console.log('   Adiba Sheikh Student Portal API is running');
  console.log(`   URL      : http://localhost:${config.port}`);
  console.log(`   Database : ${db.name} (MongoDB connected)`);
  console.log('  ==========================================\n');
  if (config.usingDefaultSecret) {
    console.log('  Tip: set your own JWT_SECRET in server/.env\n');
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  Port ${config.port} is already in use.`);
    console.error('  Close the other server window, or change PORT in server/.env\n');
    process.exit(1);
  }
  throw err;
});
