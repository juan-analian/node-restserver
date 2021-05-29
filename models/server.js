const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //conectar a la BBDD
        this.conectarDB();
        
        //Middlewares
        this.middlewares();

        //Rutas de mi aplicación.
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        //cors 
        this.app.use(cors());
        
        //lectura y parse del body.
        this.app.use(express.json());
        
        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen( this.port , () => { 
            console.log(`Servidor corrierndo en ${this.port}`); 
        });
    }
}


module.exports = Server;