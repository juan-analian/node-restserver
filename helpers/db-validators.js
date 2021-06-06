const Role = require('../models/role');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto  = require('../models/producto');

const esRoleValido = async (rol='') => {
    const existeRol = await Role.findOne( {rol});
    // console.log(`pasó por el metodo esRoleValido con el valor: ${rol}`);

    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos`);
    }
}

const emailExiste = async (correo = '') =>{

 //verificar si el correo existe
    const existeEmail = await Usuario.findOne( {correo});
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado en la base de datos`);
    }
}


const existeUsuarioPorId = async (id = '') =>{
    
       const existeUsuario = await Usuario.findById(id);
       if (!existeUsuario) {
           throw new Error(`El id ${id} no existe`);
       }
   }


const existeCategoria = async (id = '') =>{
    
    const categoria = await Categoria.findById(id);
    
    if (!categoria) {
        throw new Error(`El id ${id} de categoría no existe`);
    }
}

const existeProducto = async (id = '') =>{
    
    const producto = await Producto.findById(id);
    
    if (!producto) {
        throw new Error(`El id ${id} de producto no existe`);
    }
}

/*
const existeCategoria =  ( rechazarSiNoExiste = true ) => {

    return  async (req = request, res = response, next) => {

        const id = req.params.id;

        if (!id ) {
            return res.status(500).json({
                msg: 'El id es obligatorio'
            });
        }
        const categoria = await Categoria.findById(id);
        if (!categoria && rechazarSiNoExiste) {
                        
            return res.status(401).json({
                msg: `el id ${id} no existe`
            });
        }

        if (categoria && !rechazarSiNoExiste) {
                        
            return res.status(401).json({
                msg: `el id ${id} ya existe`
            });
        }

        next();
    }
}
*/


module.exports = { 
    esRoleValido ,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto
};