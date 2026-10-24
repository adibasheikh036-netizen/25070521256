import mongoose from 'mongoose';
import { config } from './config.js';

// On Windows, Node.js resolves "localhost" to the IPv6 address ::1 first,
// while MongoDB only listens on 127.0.0.1. That gives ECONNREFUSED, so we
// swap it for the IPv4 address.
function preferIPv4(uri) {
  return uri.replace(/^(mongodb:\/\/(?:[^@/]*@)?)localhost(?=[:/,?]|$)/i, '$1127.0.0.1');
}

function uriHasDbName(uri) {
  const match = uri.match(/^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/i);
  return Boolean(match && match[1].trim());
}

// Hides the password when the URL is printed in the console
function redact(uri) {
  return uri.replace(/\/\/([^:/@]+):([^@]+)@/, '//$1:****@');
}

function explain(err) {
  const msg = String(err?.message || err);
  if (/ECONNREFUSED/.test(msg)) {
    const howToStart = {
      win32: [
        'Press Win+R, type services.msc, find "MongoDB Server" and click Start.',
        'Or reinstall MongoDB Community Server with "Install MongoD as a Service" ticked.',
      ],
      linux: [
        'Start it with:   sudo systemctl start mongod',
        'Auto-start it:   sudo systemctl enable mongod',
      ],
      darwin: ['Start it with:   brew services start mongodb-community'],
    };
    return ['MongoDB is not running on this computer.', ...(howToStart[process.platform] ?? [])];
  }
  if (/auth|Authentication failed/i.test(msg)) return ['Wrong username or password in MONGO_URI.'];
  if (/ENOTFOUND|querySrv|getaddrinfo/i.test(msg)) {
    return ['The MongoDB host could not be found. Check MONGO_URI and your internet connection.'];
  }
  if (/Invalid scheme|Invalid connection string|URI/i.test(msg)) {
    return ['MONGO_URI must start with mongodb:// or mongodb+srv://'];
  }
  return [msg];
}

export async function connectDB() {
  const uri = config.mongoUri;
  console.log(`  Connecting to MongoDB at ${redact(uri)} ...`);

  try {
    await mongoose.connect(preferIPv4(uri), {
      dbName: uriHasDbName(uri) ? undefined : config.dbName,
      serverSelectionTimeoutMS: 5000,
    });
  } catch (err) {
    console.error('\n  ==========================================================');
    console.error('   Could not connect to MongoDB');
    for (const line of explain(err)) console.error(`   ${line}`);
    console.error('   Then fix MONGO_URI in server/.env if needed and restart.');
    console.error('  ==========================================================\n');
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => console.warn('  ! MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => console.log('  MongoDB reconnected'));
  return mongoose.connection;
}
