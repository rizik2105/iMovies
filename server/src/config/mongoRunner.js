const fs = require('fs');
const path = require('path');
const net = require('net');
const { spawn, execSync } = require('child_process');

let spawnedMongoProcess = null;

function isPortOpen(port = 27017, host = '127.0.0.1', timeout = 1000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = false;

    socket.setTimeout(timeout);
    socket.once('connect', () => {
      status = true;
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      resolve(false);
    });

    socket.connect(port, host);
  });
}

function findMongodBinary() {
  // 1. Check PATH
  try {
    const cmd = process.platform === 'win32' ? 'where mongod' : 'which mongod';
    const output = execSync(cmd, { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
    const firstLine = output.split(/\r?\n/)[0];
    if (firstLine && fs.existsSync(firstLine)) {
      return firstLine;
    }
  } catch (err) {
    // Continue checking known standard locations
  }

  // 2. Standard Windows installation directories
  if (process.platform === 'win32') {
    const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
    const baseDir = path.join(programFiles, 'MongoDB', 'Server');
    if (fs.existsSync(baseDir)) {
      try {
        const versions = fs.readdirSync(baseDir).sort().reverse();
        for (const ver of versions) {
          const exePath = path.join(baseDir, ver, 'bin', 'mongod.exe');
          if (fs.existsSync(exePath)) {
            return exePath;
          }
        }
      } catch (err) {
        // ignore
      }
    }
  }

  return null;
}

async function ensureMongoRunning(port = 27017, host = '127.0.0.1') {
  const alreadyRunning = await isPortOpen(port, host);
  if (alreadyRunning) {
    console.log(`[MongoDB] Database service is actively listening on ${host}:${port}.`);
    return true;
  }

  console.log(`[MongoDB] No active instance found on ${host}:${port}. Looking for local mongod binary...`);
  const mongodPath = findMongodBinary();

  if (!mongodPath) {
    console.warn('[MongoDB] Warning: Could not locate mongod binary in PATH or Program Files.');
    return false;
  }

  console.log(`[MongoDB] Found mongod binary at: ${mongodPath}`);
  const dbDir = path.resolve(__dirname, '../../data/db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  console.log(`[MongoDB] Starting local MongoDB instance with dbpath: ${dbDir}`);

  try {
    spawnedMongoProcess = spawn(
      mongodPath,
      ['--dbpath', dbDir, '--bind_ip', host, '--port', String(port)],
      {
        stdio: 'ignore',
        detached: false,
      }
    );

    spawnedMongoProcess.on('error', (err) => {
      console.error(`[MongoDB] Failed to start mongod process: ${err.message}`);
    });

    // Register cleanup handlers
    const cleanUp = () => {
      if (spawnedMongoProcess) {
        console.log('[MongoDB] Stopping local mongod child process...');
        try {
          spawnedMongoProcess.kill();
        } catch (e) {}
        spawnedMongoProcess = null;
      }
    };

    process.on('exit', cleanUp);
    process.on('SIGINT', () => {
      cleanUp();
      process.exit(0);
    });
    process.on('SIGTERM', () => {
      cleanUp();
      process.exit(0);
    });

    // Poll until port becomes open (wait up to 10 seconds)
    const startTime = Date.now();
    while (Date.now() - startTime < 10000) {
      await new Promise((r) => setTimeout(r, 400));
      const isOpen = await isPortOpen(port, host);
      if (isOpen) {
        console.log(`[MongoDB] Local MongoDB started successfully on ${host}:${port}!`);
        return true;
      }
    }

    console.warn('[MongoDB] mongod started but port did not open within 10 seconds.');
    return false;
  } catch (err) {
    console.error(`[MongoDB] Exception starting mongod: ${err.message}`);
    return false;
  }
}

module.exports = {
  isPortOpen,
  findMongodBinary,
  ensureMongoRunning,
};
