const { spawn } = require('child_process');
const path = require('path');

const services = [
  {
    name: 'AUTH     ',
    color: '\x1b[35m', // Magenta
    cwd: path.join(__dirname, 'server', 'services', 'auth'),
    command: 'npm',
    args: ['run', 'dev'],
  },
  {
    name: 'PRODUCTS ',
    color: '\x1b[36m', // Cyan
    cwd: path.join(__dirname, 'server', 'services', 'products'),
    command: 'npm',
    args: ['run', 'dev'],
  },
  {
    name: 'USERS    ',
    color: '\x1b[33m', // Yellow
    cwd: path.join(__dirname, 'server', 'services', 'users'),
    command: 'npm',
    args: ['run', 'dev'],
  },
  {
    name: 'ORDERS   ',
    color: '\x1b[34m', // Blue
    cwd: path.join(__dirname, 'server', 'services', 'orders'),
    command: 'npm',
    args: ['run', 'dev'],
  },
  {
    name: 'GATEWAY  ',
    color: '\x1b[32m', // Green
    cwd: path.join(__dirname, 'server', 'gateway'),
    command: 'npm',
    args: ['run', 'dev'],
  },
];

// Check if client should also be started
const backendOnly = process.argv.includes('--backend-only');

if (!backendOnly) {
  services.push({
    name: 'CLIENT   ',
    color: '\x1b[31m', // Red
    cwd: path.join(__dirname, 'client'),
    command: 'npm',
    args: ['start'],
    env: { ...process.env, BROWSER: 'none' }, // prevent popping open random OS windows
  });
}

const RESET = '\x1b[0m';
const activeProcesses = [];

console.log('\x1b[1m\x1b[32m=== Starting ShopHub Microservices Platform ===\x1b[0m');
console.log(`Starting ${services.length} services concurrently...\n`);

services.forEach((service) => {
  const isWindows = process.platform === 'win32';
  const cmd = isWindows ? `${service.command}.cmd` : service.command;

  const proc = spawn(cmd, service.args, {
    cwd: service.cwd,
    shell: true,
    env: { ...process.env, ...(service.env || {}) },
  });

  activeProcesses.push({ name: service.name.trim(), proc });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${service.color}[${service.name}]${RESET} ${line}`);
      }
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`${service.color}[${service.name}]${RESET} ${line}`);
      }
    });
  });

  proc.on('close', (code) => {
    console.log(`${service.color}[${service.name}]${RESET} Process exited with code ${code}`);
  });
});

const cleanup = () => {
  console.log('\n\x1b[1m\x1b[33mStopping all services...\x1b[0m');
  activeProcesses.forEach(({ name, proc }) => {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', proc.pid, '/f', '/t']);
      } else {
        proc.kill('SIGINT');
      }
    } catch (e) {
      // ignore
    }
  });
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
