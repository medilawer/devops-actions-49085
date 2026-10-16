const test = require('node:test');
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const path = require('node:path');
test('HTTP application returns a successful page with student identity', async () => {
  const child = spawn(process.execPath, [path.join(__dirname, '../src/server.js')]);
  try {
    await Promise.race([once(child.stdout, 'data'), once(child, 'exit').then(() => {throw new Error('Server exited before readiness');}), new Promise((_, reject) => {const timer = setTimeout(() => reject(new Error('Server startup timed out')), 10000); timer.unref();})]);
    const response = await fetch('http://127.0.0.1:3000');
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    const body = await response.text();
    assert.match(body, /Welcome to my Docker application/);
    assert.match(body, /Dilawar Khalid/);
    assert.match(body, /49085/);
  } finally {
    const exited = once(child, 'exit');
    child.kill();
    await exited;
  }
});
