#!/usr/bin/env node

require('tsconfig-paths/register');
const app = require('../app');
const http = require('http');

const port = parseInt(process.env.PORT || '8080', 10);
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('listening', () => {
  const addr = server.address();
  const formatted =
    typeof addr === 'string' ? addr : `${addr.address}:${addr.port}`;
  console.log(`App: Listening on ${formatted}`);
});
server.on('error', console.error);
