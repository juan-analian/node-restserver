const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    // console.log(token);

    if (!token) {
        return res.status(401).json({
            msg: 'no hay un token en la petición'
        });
    }


    try {
        //si no es válido, salta al cathc
        //const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //console.log(payload); //{ uid: '60aec96712179d2244b75420', iat: 1622148970, exp: 1622163370 }

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //lo sumamos al request!
        const usuario  = await Usuario.findById(uid);     


        //si no existe el suuario;
        if (!usuario) {
            return res.status(401).json({
                msg: 'token no valido - usuario no existe en bbdd'
            }); 
        }

        //verificar si el uid (que quiere eliminar a otro) tiene estado en true:
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'token no valido - usuario dado de baja'
            });
        }

        req.usuario = usuario;

        next();
    }
    catch(err) {

        console.log(err);

        return res.status(401).json({
            msg: 'token no valido'
        });
    }
    
}


module.exports = {
    validarJWT
}