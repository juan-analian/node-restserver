const { response} = require('express');
const { Producto } = require('../models');
const { Categoria } = require('../models');

//obtenerCategorias - paginado - total - populate (para que aparezca la info relacionada - del usuario)
const obtenerProductos = async(req=request, res=response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};


    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario',['nombre'])
        .populate('categoria',['nombre'])
        .skip(Number(desde)).limit(Number(limite))
    ]);
    
    res.json({
       
         total,
         productos
    });

}
 
//(por id?) - populate
const obtenerProducto = async(req, res=response) => {
    
    const {id} = req.params;

    //debería traer siempre 1 porque uno de los middlewares controla que venga ID y que exista
    const producto = await Producto.findById(id)
        .populate('usuario',['nombre'])
        .populate('categoria',['nombre']) ;

    return res.status(200).json({
        producto
       
    });

} 

//actualizarCategoria  (por id con el nuevo nombre)
const actualizarProducto = async (req, res=response) => {

    const {id} = req.params;
    const {estado, usuario, categoria,...data} = req.body;
    if (data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    //si la mandó debemos controlar que exista 
    if (categoria) {
        const categoriaDB = await Categoria.findById(categoria);
        if (!categoriaDB) {
            return res.status(400).json({
                msg: `La categoría ${categoria} no existe`
            });
        }

        data.categoria = categoria;
    }
    
    data.usuario =  req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data , {new: true});

    return res.json({
        producto
    });

}


// (por id) - estado: false
const borrarProducto = async (req, res=response) => {

    const {id} = req.params;
    const usuario  =  req.usuario._id;
 
    const producto = await Producto.findByIdAndUpdate(id, {estado: false, usuario } , {new: true});

    return res.status(200).json({
        producto
    });

}
 

const crearProducto = async  (req, res=response) => {

    //ignoramos estado y usuario que pueda venir en bodu
    const {estado, usuario, nombre, ...body} = req.body;
    
    const productoDB = await Producto.findOne({nombre: nombre.toUpperCase()});

    //console.log("Entró en crear producto con:", nombre, body);

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        });
    }

    //generar la data a guardar 

    const data = {
        ...body,
        nombre: nombre.toUpperCase() ,
        usuario: req.usuario._id 
    }

    const producto = new Producto(data);

    //guardamos en la bbdd 
    await producto.save();

    return res.status(201).json({
        producto
    });

}

module.exports = {
    actualizarProducto,
    borrarProducto,
    crearProducto,
    obtenerProducto,
    obtenerProductos        
}