const { Schema, model} = require('mongoose');


const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },

    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },

    img: {
        type: String        
    },

    //valida que el rol sea alguna de estas 2 enumeraciones
    rol: {
        type: String,
        required: true, //,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE','USER_ROLE']
    },

    estado : {
        type: Boolean,
        default: true
    },

    google : {
        type: Boolean,
        default: false
    }

});


//Sobreescribimos el metodo para evitar generar propiedades que no queremos mostrar al FE (como el password)
UsuarioSchema.methods.toJSON = function () {

    //quitamos el __v y el password. y el resto de los parametros los unificamos
    const { __v, password, _id ,...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;

}


//Inicia con Mayúscula y singular. Mongoose lo pone el plural
module.exports = model('Usuario', UsuarioSchema);

/* 
{
    nombre: '',
    correo: 'juan@pablo.io',
    password: '123456789',
    img: 'https://image.url',
    rol: '1234',
    estado: true , //eliminacion logica
    google: false
}

*/