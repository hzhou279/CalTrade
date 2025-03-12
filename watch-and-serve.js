const { spawn } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

// Configuration
const watchPaths = ['src/**/*', 'public/**/*', '*.js', '*.json', '*.ts', '*.tsx'];
const ignorePaths = [
  'node_modules',
  '.next',
  'dist',
  '.git',
  '**/*.log',
  'watch-and-build.js',
  'watch-and-serve.js'
];

// Debounce function to prevent multiple builds for rapid changes
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Variables to track current processes
let currentBuild;
let currentServer;

// Function to run the build command
function runBuild() {
  return new Promise((resolve, reject) => {
    console.log('\n🔄 Changes detected! Building...');
    
    // Kill any existing build process
    if (currentBuild && !currentBuild.killed) {
      currentBuild.kill();
    }
    
    // Start a new build process
    currentBuild = spawn('pnpm', ['run', 'build'], { 
      stdio: 'inherit',
      shell: true
    });
    
    currentBuild.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Build completed successfully!');
        resolve();
      } else {
        console.error(`❌ Build failed with code ${code}`);
        reject(new Error(`Build failed with code ${code}`));
      }
    });
  });
}

// Function to start the server
function startServer() {
  return new Promise((resolve) => {
    console.log('🚀 Starting server...');
    
    // Kill any existing server process
    if (currentServer && !currentServer.killed) {
      currentServer.kill();
    }
    
    // Start a new server process
    currentServer = spawn('pnpm', ['run', 'start'], { 
      stdio: 'inherit',
      shell: true
    });
    
    // We don't wait for the server to close since it's a long-running process
    resolve();
    
    currentServer.on('close', (code) => {
      if (code !== null && code !== 0) {
        console.error(`⚠️ Server exited with code ${code}`);
      }
    });
  });
}

// Function to handle the build and serve process
async function buildAndServe() {
  try {
    await runBuild();
    await startServer();
    console.log('👀 Watching for changes...');
  } catch (error) {
    console.error('⚠️ Error in build and serve process:', error.message);
    console.log('👀 Watching for changes...');
  }
}

// Debounced build and serve function
const debouncedBuildAndServe = debounce(buildAndServe, 1000);

// Initialize watcher
console.log('📂 Setting up file watcher...');
const watcher = chokidar.watch(watchPaths, {
  ignored: ignorePaths,
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 300,
    pollInterval: 100
  }
});

// Add event listeners
watcher
  .on('ready', () => {
    console.log('👀 Initial scan complete. Starting initial build and serve...');
    buildAndServe();
  })
  .on('add', path => {
    console.log(`📄 File ${path} has been added`);
    debouncedBuildAndServe();
  })
  .on('change', path => {
    console.log(`📄 File ${path} has been changed`);
    debouncedBuildAndServe();
  })
  .on('unlink', path => {
    console.log(`📄 File ${path} has been removed`);
    debouncedBuildAndServe();
  });

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping watcher and server...');
  watcher.close().then(() => {
    if (currentBuild && !currentBuild.killed) {
      currentBuild.kill();
    }
    if (currentServer && !currentServer.killed) {
      currentServer.kill();
    }
    console.log('👋 Watcher and server stopped. Goodbye!');
    process.exit(0);
  });
}); 