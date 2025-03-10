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
  'watch-and-build.js'
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

// Function to run the build command
function runBuild() {
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
      console.log('👀 Watching for changes...');
    } else {
      console.error(`❌ Build failed with code ${code}`);
      console.log('👀 Watching for changes...');
    }
  });
}

// Debounced build function
const debouncedBuild = debounce(runBuild, 1000);

// Variable to track current build process
let currentBuild;

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
    console.log('👀 Initial scan complete. Watching for changes...');
  })
  .on('add', path => {
    console.log(`📄 File ${path} has been added`);
    debouncedBuild();
  })
  .on('change', path => {
    console.log(`📄 File ${path} has been changed`);
    debouncedBuild();
  })
  .on('unlink', path => {
    console.log(`📄 File ${path} has been removed`);
    debouncedBuild();
  });

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping watcher...');
  watcher.close().then(() => {
    if (currentBuild && !currentBuild.killed) {
      currentBuild.kill();
    }
    console.log('👋 Watcher stopped. Goodbye!');
    process.exit(0);
  });
}); 