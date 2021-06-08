const { Schema, model} = require('mongoose');

const ProductoSchema = Schema({

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
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true
    },
    descripcion : {
        type: String
    },
    disponible : {
        type: Boolean,
        default: true
    },
    img : {
        type: String
    },
    
});

//Sobreescribimos el metodo para evitar generar propiedades que no queremos mostrar al FE (como el password)
ProductoSchema.methods.toJSON = function () {

    //quitamos el __v y el password. y el resto de los parametros los unificamos
    const { __v, estado ,...data } = this.toObject();
    //categoria.id = _id;
    return data;

}

module.exports = model('Producto', ProductoSchema);