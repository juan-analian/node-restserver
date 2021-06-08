const  path  = require('path');
const fs = require('fs');

var cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL);

const { response } = require("express");

const { subirArchivo} = require('../helpers');
const { Usuario, Producto } = require('../models');

const cargarArchivo = async (req, res=response) => {
  //estas validaciones se hacen en un middleware  !req.files || Object.keys(req.files).length === 0 ....

    try {

      //const nombre = await subirArchivo(req.files, ['txt','md'],'textos');  
      const nombre = await subirArchivo(req.files, undefined,'imgs');  
      res.json({nombre})
    }
    catch(err) {
      res.status(400).json({msg: err});
    }
}


const actualizarImagen = async (req, res=response) => {

  const {id, coleccion} = req.params; //parametros definidos en la ruta :coleccion y :id

  let modelo;

  switch(coleccion){
    case 'usuarios':

      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({msg: 'No existe el usuario con el id ' + id});
      }



      break;
    case 'productos':

      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({msg: 'No existe el producto con el id ' + id});
      }

      break;      
    default:
      return res.status(500).json({msg: 'se me olvidó validar esto'});
  }

  try {

    //limpiamos imagen existentes:
    if (modelo.img) {
      //borrar la imagen del servidoor
      const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);

      if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
      }

    }


    const nombre = await subirArchivo(req.files, undefined, coleccion); 
    modelo.img = nombre ;
    await modelo.save();

    res.json({modelo});
  }
  catch(err) {
    res.status(500).json({ msg: 'Error al guardar el archivo: '+ err });
  }
  

  
}


const mostrarImagen = async (req, res=response) => {
  
  const {id, coleccion} = req.params; //parametros definidos en la ruta :coleccion y :id

  let modelo;

  switch(coleccion){
    case 'usuarios':

      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({msg: 'No existe el usuario con el id ' + id});
      }

      break;
    case 'productos':

      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({msg: 'No existe el producto con el id ' + id});
      }

      break;      
    default:
      return res.status(500).json({msg: 'se me olvidó validar esto'});
  }

 
    //limpiamos imagen existentes:
    if (modelo.img) {
      //borrar la imagen del servidoor
      const pathImagen = path.join(__dirname, '../uploads/', coleccion, modelo.img);

      if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
      }

    }
    
    //res.json({msg: 'falta el place holder'});
    const pathImagenPlaceHolder = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagenPlaceHolder);
   
}

const actualizarImagenCloudinary = async (req, res=response) => {

  const {id, coleccion} = req.params; //parametros definidos en la ruta :coleccion y :id

  let modelo;

  switch(coleccion){
    case 'usuarios':
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({msg: 'No existe el usuario con el id ' + id});
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({msg: 'No existe el producto con el id ' + id});
      }
      break;      
    default:
      return res.status(500).json({msg: 'se me olvidó validar esto'});
  }

 
    //limpiamos imagen existentes:
    if (modelo.img) {
      //console.log(modelo.img);

      const nombreArr = modelo.img.split('/');
      const nombre = nombreArr[nombreArr.length - 1];
      const [public_id] = nombre.split('.');

      cloudinary.uploader.destroy(public_id);
      //console.log(public_id);
    }

    //subimos el archivo a cloudinary
    const {tempFilePath} = req.files.archivo;
    const { secure_url }= await cloudinary.uploader.upload(tempFilePath);
 
    modelo.img = secure_url ;
    await modelo.save();

    res.json({modelo});

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}