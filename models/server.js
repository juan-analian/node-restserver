const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/config');
const  fileUpload  = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads' ,     
            usuario: '/api/usuarios'                        
        }

       

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
        
        //directorio publico
        this.app.use(express.static('public'));

        //File Upload o carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth,   require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.categorias , require('../routes/categorias'));
        this.app.use(this.paths.productos ,  require('../routes/productos'));
        this.app.use(this.paths.uploads ,     require('../routes/uploads'));
        this.app.use(this.paths.usuario ,     require('../routes/usuarios'));

        console.log(`Rutas definidas: ${ JSON.stringify(this.paths)}`);
        
    }

    listen() {
        this.app.listen( this.port , () => { 
            console.log(`Servidor corrierndo en ${this.port}`); 
        });
    }
}


module.exports = Server;