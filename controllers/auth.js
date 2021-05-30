const {response, request} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const {googleVerify} = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const {correo , password} = req.body;

    try {

        //verificar si el email existe asociado a un usuario
        const usuario = await Usuario.findOne({correo});

        if (!usuario) {
            return res.status(400).json({
                msg: 'usuario o password incorrecto - correo'
            })
        }

        //verificar si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'usuario o password incorrecto - estado'
            })
        }

        //verificar si la password coincide
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if ( !validPassword) {

            return res.status(400).json({
                msg: 'usuario o password incorrecto - password'
            })
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id);


        res.json({
           usuario,
           token
        });

    }
    catch(error) {

        console.log(error);

        res.status(500).json({
            msg: 'Algo saló mal. Hable con el administrador'
        })
    }

    
}

const googleSignin = async (req, res = response) => {

    const {id_token} = req.body;

    try {

        const {correo, nombre, img}  = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google : true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en DB 
        if (!usuario.estado) {
            res.status(401).json( {
                msg: 'hable con el administrador (usuario eliminado)'
            });
        }

        //generamos el JWT
        const token = await generarJWT(usuario.id);
        
        res.json({
            usuario,
            token             
        })

    }
    catch(err) {

        console.log(err);

        res.status(400).json( {
            msg: 'Token de Google no válido'
        });
    }

    
}



module.exports = { 
    login,
    googleSignin
 }