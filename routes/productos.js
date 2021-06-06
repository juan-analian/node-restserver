const {Router} = require('express');
const {check} = require('express-validator');

const {validarCampos , validarJWT, esAdminRole} = require('../middlewares');
const { crearProducto,
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto, 
        obtenerProductos} = require('../controllers/productos');

const {existeProducto, existeCategoria} = require('../helpers/db-validators')

const router = Router();
 
/* GET {{url}}/api/Productos */
//Obtener todas las Productos - publico
router.get('/',obtenerProductos)


//Obtener un producto por ID - publico
router.get('/:id', [
    check('id', 'No es un identificador válido').isMongoId(),    
    check('id').custom(existeProducto),  
    validarCampos
], obtenerProducto)


//Crear un producto  - privado cualquier rol 
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty() ,
    check('categoria', 'El id de categoría es obligatorio').not().isEmpty() ,
    check('categoria', 'No es un identificador válido de categoría').isMongoId(),
    check('categoria').custom(existeCategoria),  
    validarCampos
], crearProducto )


//Actualizar un producto por ID  - privado cualquier rol 
router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un identificador válido de categoría').isMongoId(),
    // check('categoria').custom(existeCategoria),  

    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom(existeProducto),   
    
    check('nombre', 'El nombre es obligatorio').not().isEmpty() ,
    validarCampos
],actualizarProducto)


//borrar un producto por ID  - privado  solo un ADMIN_ROLE (marca estado)
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un identificador válido').isMongoId(),
    check('id').custom(existeProducto), 
    validarCampos
] , borrarProducto)


module.exports = router;