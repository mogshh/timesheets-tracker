import * as path from 'node:path';

import { spawn } from 'node:child_process';

const subprocess = spawn('node', [path.resolve('main.js')], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
