
require('dotenv').config();
const Server = require('./models/server');
 

//Modificado de github.dev (codespaces)
const server = new Server();
server.listen();