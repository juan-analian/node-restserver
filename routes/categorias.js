const {Router} = require('express');
const {check} = require('express-validator');

const {crearCategoria, obtenerCategoria, actualizarCategoria, borrarCategoria, obtenerCategorias} = require('../controllers/categorias'); 
const {validarCampos , validarJWT, esAdminRole, tieneRole } = require('../middlewares');
const {existeCategoria} = require('../helpers/db-validators')

 
const router = Router();
 
/* GET {{url}}/api/categorias */
//Obtener todas las categorias - publico
router.get('/',obtenerCategorias)


//Obtener una categoría por ID - publico
router.get('/:id', [
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom(existeCategoria), //existeCategoria(true), 
    validarCampos
], obtenerCategoria)


//Crear una categoría  - privado cualquier rol 
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty() ,
    validarCampos
], crearCategoria )


//Actualizar una categoría por ID  - privado cualquier rol 
router.put('/:id', [
    validarJWT,
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom(existeCategoria), //existeCategoria(true), 
    check('nombre', 'El nombre es obligatorio').not().isEmpty() ,
    validarCampos
],actualizarCategoria)


//borrar una categoría por ID  - privado  solo un ADMIN_ROLE (marca estado)
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE'),
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom(existeCategoria), //existeCategoria(true), 
    validarCampos
] , borrarCategoria)


module.exports = router;