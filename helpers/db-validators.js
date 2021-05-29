const Role = require('../models/role');
const Usuario = require('../models/usuario');

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

module.exports = { 
    esRoleValido ,
    emailExiste,
    existeUsuarioPorId
};