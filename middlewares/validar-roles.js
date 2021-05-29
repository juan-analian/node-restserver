const { response, request } = require('express');
 
const tieneRole =  ( ...roles ) => {

    //console.log(roles);

    return (req = request, res = response, next) => {


        if (!req.usuario) {
            return res.status(500).json({
                msg: 'quiere validar el rol sin haber validado el jwt con el middleware'
            });
        }

        //console.log(roles,  req.usuario.rol );
        
        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }


        next();
    }

    

}

const esAdminRole = async (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'quiere validar el rol sin haber validado el jwt con el middleware'
        });
    }


    const { rol, nombre} = req.usuario ;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador`
        });
    }

    next();

}

module.exports =  {
    esAdminRole,
    tieneRole
}