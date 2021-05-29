const { validationResult } = require('express-validator');


//next es lo que hay que llamar si este middleware pasa OK!
const validarCampos = (req, res, next) => {

    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json(errores);
    }

    next();

}


module.exports = { validarCampos };


