const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    // revisar de errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    // extraer email y pass
    const { email, password } = req.body;
    try {
        // Revisar que el usuario existe
        let usuario = await Usuario.findOne({ email });
        if (!usuario){
            return res.status(400).json({msg: 'El usuario no existe'})
        }

        // Revisar el password
        const currentPass = await bcryptjs.compare(password, usuario.password);
        if (!currentPass){
            return res.status(400).json({msg: 'Password Incorrecto'})
        }

        // Creo y firmo el jwt si pasó todas las validaciones
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // firma de token
        jwt.sign(payload, process.env.SECRET_ENIGMA, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if(error) throw error;
            // mensaje de confirmacion
            res.json({ token: token})
        });
    } catch (error) {
        console.log(error)
    }


}


// Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async(req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password'); //.select('-password')
        res.json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}