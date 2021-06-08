const validarArchivo = require('../middlewares/validar-archivo');
const validaCampos = require('../middlewares/validar-campos');
const validaJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');

//const <cualquierNombre> = require('archivo')
//module.exports = { ...<nombreDefinido> } >> estos 3 puntos significan que se exporta todo lo que contenga.
 
module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
    ...validarArchivo
}