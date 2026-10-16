const http = require('node:http');
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.end('<!doctype html><html><head><title>Docker Activity</title></head><body><h1>Welcome to my Docker application</h1><p>Dilawar Khalid | SAP ID: 49085</p><p>Node application running successfully.</p></body></html>');
});
server.listen(3000, '0.0.0.0', () => console.log('Listening on port 3000'));
