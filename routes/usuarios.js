const {Router} = require('express');
const {check} = require('express-validator');


// const {validarCampos} = require('../middlewares/validar-campos');
// const {validarJWT} = require('../middlewares/validar-jwt');
// const {esAdminRole, tieneRole} = require('../middlewares/validar-roles');
const { validarCampos , validarJWT, esAdminRole, tieneRole } = require('../middlewares');


const {usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch} = require('../controllers/usuarios');
const { esRoleValido, emailExiste , existeUsuarioPorId} = require('../helpers/db-validators');


const router = Router();

router.get('/', usuariosGet);

//el 2do parametro puede ser un conjunto de middlewares que se ejecutan antes de llegar al metodo 
//y recaban los errores pero no frenan el req. Pasa al metodo y hay que validar estos errores.
//en este caso usamos el express-validator
router.post('/', [
    check('nombre', 'El campo "nombre" es obligatorio').not().isEmpty() ,
    check('password', 'El password es obligatorio y mas de 6 caracteres').isLength({min:6}),
    check('correo', 'El correo no es válido').isEmail(),
    //check('rol', 'no es un rol peprmitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ),
    check('correo').custom( emailExiste),
    validarCampos //middleware nuestro que si encuentra error, corta el flow del request y devuelve  res.status(400).json(errores);
] ,usuariosPost);

//parametros que vienen por URL o por Body, se interceptan con el check.
//valida que el ID sea un GUID de tipo mongodb. tomá mate.
router.put('/:id', [
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom( esRoleValido ),
    validarCampos //middleware nuestro
], usuariosPut);


router.patch('/', usuariosPatch);


router.delete('/:id', [    
    validarJWT, //valida el token y establece el usuario en el request
    //esAdminRole, //una vez obtenido el token, verificamos el rol y rechazamos si no es admin.
    tieneRole('ELIMINADOR_ROLE','VENTAS_ROLE'), //==>> ejecuta este método y devuelve una fn(req, res, next) que lo ejecutará el controler.
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),    
    validarCampos //middleware nuestro
], usuariosDelete);


module.exports = router;