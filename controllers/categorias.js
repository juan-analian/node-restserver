const { response} = require('express');
const { Categoria } = require('../models');
 

//obtenerCategorias - paginado - total - populate (para que aparezca la info relacionada - del usuario)
const obtenerCategorias = async(req=request, res=response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};


    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario',['nombre'])
        .skip(Number(desde)).limit(Number(limite))
    ]);
    
    res.json({
       
         total,
         categorias
    });



}

//(por id?) - populate
const obtenerCategoria = async(req, res=response) => {
    
    const {id} = req.params;

    

    //debería traer siempre 1 porque uno de los middlewares controla que venga ID y que exista
    const categoria = await Categoria.findById(id).populate('usuario',['nombre']) ;

    //console.log('ObtenerCategoria query.categoria: ' + JSON.stringify(categoria) );
    
    //TODO:! ver como quitar el _id de la respuesta (en forma simple)
    //delete categoria.usuario._id;

    return res.status(200).json({
        categoria
       
    });

} 

//actualizarCategoria  (por id con el nuevo nombre)
const actualizarCategoria = async (req, res=response) => {

    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario =  req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data , {new: true});

    return res.json({
        categoria
    });

}


// (por id) - estado: false
const borrarCategoria = async (req, res=response) => {


    const {id} = req.params;
    const usuario  =  req.usuario._id;

     
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false, usuario } , {new: true});

    return res.status(200).json({
        categoria 
    });

}
 

const crearCategoria = async  (req, res=response) => {

    //capricho de guardar en mayúsculas
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`
        });
    }

    //generar la data a guardar 

    const data = {
        nombre ,
        usuario: req.usuario._id 
    }

    const categoria = new Categoria(data);

    //guardamos en la bbdd 
    await categoria.save();

    return res.status(201).json({
        categoria
    });

}

module.exports = {
    actualizarCategoria,    
    borrarCategoria,
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias
}