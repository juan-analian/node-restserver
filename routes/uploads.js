const {Router} = require('express');
const {check} = require('express-validator');
 
const {cargarArchivo, actualizarImagen, actualizarImagenCloudinary, mostrarImagen} = require('../controllers/uploads')
const { validarCampos, validarArchivoSubir} = require('../middlewares');
const {coleccionesPermitidas} = require('../helpers');

const router = Router();

 
router.post( '/',validarArchivoSubir,cargarArchivo)

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'el id debe ser de monto').isMongoId(),
    check('coleccion').custom( c=> coleccionesPermitidas(c, ['usuarios','productos'])),
    validarCampos
], actualizarImagenCloudinary)
//], actualizarImagen )


router.get('/:coleccion/:id', [    
    check('id', 'el id debe ser de monto').isMongoId(),
    check('coleccion').custom( c=> coleccionesPermitidas(c, ['usuarios','productos'])),
    validarCampos
], mostrarImagen )

module.exports = router;