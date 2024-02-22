const { spawn } = require('child_process');

const nodeProcess = spawn('node', ['src/main.js']);

nodeProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

nodeProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

nodeProcess.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});