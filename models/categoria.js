const { Schema, model} = require('mongoose');

const CategoriaSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true 
    },

    estado: {
        type: Boolean,
        default: true,
        require: true
    },
    usuario: {
        type: Schema.Types.ObjectId, //indicamos que la referencia es otro objeto
        ref: 'Usuario', //este nombre es el string que está en la linea module.exports del modelo de usuario
        require: true
    }
});

//Sobreescribimos el metodo para evitar generar propiedades que no queremos mostrar al FE (como el password)
CategoriaSchema.methods.toJSON = function () {

    //quitamos el __v y el password. y el resto de los parametros los unificamos
    const { __v, estado ,...data } = this.toObject();
    //categoria.id = _id;
    return data;

}

module.exports = model('Categoria', CategoriaSchema);