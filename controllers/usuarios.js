const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async (req = request,res = response) => {
    
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};

    // const usuarios = await Usuario.find( query)
    //     .skip(Number(desde))
    //     .limit( Number(limite));

    // const total = await Usuario.countDocuments(query);

    //esperamos a que finalicen las 2 promesas
    //desestructuramos en un arreglo:
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find( query).skip(Number(desde)).limit( Number(limite))
    ]);


    res.json({
        //resp
         total,
         usuarios
    });

    //así puedo recibir lo que viene por QS o puede desestructurar
    //const query = req.query;

    // const {nombre = 'no vino nombre', apikey} = req.query;

    // res.json({               
    //     msg: 'get API - Controlador',
    //     nombre,
    //     apikey
    // });  
}

const usuariosPost = async (req,res = response) => {

    

    //const {nombre, edad}  = req.body;
    //le pasamos el body y toma solo lo que está definido
    //const usuario = new Usuario(body);

    //desestructuramos el body, tomando solo las propiedades que necesitamos.
    const {nombre, correo, password, rol}  = req.body;    
    //le pasamos los parametros que nosotros queremos guardar (google no debería venir del FE)
    const usuario = new Usuario({nombre, correo, password, rol});

    // la verificación de si el correo existe, se hace en la ruta
   

    //encriptar la contraseña (hash)
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt);

    //console.log(`pasó por el controller usuariosPost con rol = ${rol} antes de hacer el Save`);

    //guardar en bbdd
    await usuario.save();
    

    res.json({                     
        usuario
    });  
}


const usuariosPut = async (req, res = response) => {
    
    const {id}= req.params; 
    const {_id, password, google, correo, ...resto} = req.body;

 
    //TODO: validar contra bbdd el ID
    if (password) {

        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, {new: true});

    res.json(usuario);  
}


const usuariosPatch = (req,res = response) => {
    res.json({               
        msg: 'patch API - Controlador'
    });  
}


const usuariosDelete = async (req,res = response) => {
   
    const {id} = req.params;

    // const uid = req.uid;
    // console.log(` uid que hace la eliminación: ${uid}`);


    //Borrado físico
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false}, {new: true});

    const usuarioAutenticado =  req.usuario; 

    res.json({                   
        usuario,
        usuarioAutenticado
    });  
}



module.exports =  {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}