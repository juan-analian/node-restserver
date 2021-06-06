//se puede exportar todo de 2 maneras. Asi:
/*
module.exports = require('./categoria');
module.exports = require('./role');
module.exports = require('./server');
module.exports = require('./usuario');
*/

//o asi como lo hicimos en la carpeta middlewares
const Categoria = require('./categoria');
const Producto = require('./producto');
const Role = require('./role');
const Server = require('./server');
const Usuario = require('./usuario');

module.exports = {
    Categoria,
    Producto,
    Role ,
    Server,
    Usuario
}



