const http = require('http');
const app = require('./backend/app');

const normalizePort = val => {
  var port = parseInt(val, 10);

  if(isNaN(port)){
    return val;
  }

  if(port >= 0){
    return port;
  }
  return false;
}

const port = normalizePort(process.env.port || 3000);
app.set('port', port);

const server = http.createServer(app);

server.listen(
  port,
  console.log(`Server is running in development on port ${port}`.yellow.bold)
);

module.exports = server;


