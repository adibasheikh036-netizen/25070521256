// Imported first by server.js so an old Node.js shows a clear message
// instead of a confusing crash somewhere inside a library.
const [major, minor] = process.versions.node.split('.').map(Number);
const supported = major > 22 || (major === 22 && minor >= 12) || (major === 20 && minor >= 19);

if (!supported) {
  console.error(`\n  Your Node.js version is ${process.versions.node}, which is too old.`);
  console.error('  Please install the LTS version from https://nodejs.org and run setup.bat again.\n');
  process.exit(1);
}
