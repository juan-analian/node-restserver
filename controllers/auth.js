const {response, request} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');


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

module.exports = { 
    login
 }