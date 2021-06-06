const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];


const buscarUsuarios = async ( termino = '', res = response) => {

    const esMongoId =  ObjectId.isValid(termino);
    if (esMongoId) {
        //busqueda
        const usuario = await Usuario.findById(termino);
        
        return res.json({
            results: (usuario)? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i'); //i=insensitive
     
    //filtramos por estado en ambos lados (repitiendo código ) => $or: [{nombre: regex, estado:true}, {correo: regex, estado:true}]
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado:true}]
    });

    return res.json({
        results: usuarios
    });
}


const buscarCategorias = async (termino = '', res =response) => {
    const esMongoId =  ObjectId.isValid(termino) ;
    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria]:[]
        });        
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({nombre: regex, estado:true});
    // const categorias = await Categoria.find({
    //     $or: [{nombre:regex}],
    //     $and: [{estado:true}]
    // });

    return res.json({
        results: categorias
    });

}


const buscarProductos = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid(termino);
    if (esMongoId) {
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: (producto) ? [producto]:[]
        });        
    }


    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({
        $or: [{nombre:regex}, {descripcion:regex}],
        $and:[{estado:true}]
    }).populate('categoria','nombre');

    return res.json({
        results: productos
    });

}

const buscar = (req = request, res = response) => {

    const {coleccion, termino} = req.params;

    console.log('Pasó por el controller');

    if (!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch(coleccion) {
        case 'categorias':

            return buscarCategorias(termino, res);
        case 'productos':

            return buscarProductos(termino, res);
        case 'roles':

            break;
        case 'usuarios':
            return buscarUsuarios(termino, res);
             
        default:
            return res.status(500).json({msg: 'Se me olvidó hacer esta búsqueda'});
    }
 
}

module.exports = { buscar };