const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.crearUsuario = async (req, res) => {

    // revisar de errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    // extraigo email y pass
    const {email, password} = req.body;  

     try {
        let usuario = await Usuario.findOne({ email });    

        if (usuario){
            return res.status(400).json({ msg: 'El usuario ya existe. no se pudo crear' });
        }

        // crear el nuevo usuario
        usuario = new Usuario(req.body);
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);
        // guarda el nuevo usuario
        await usuario.save();

        // se crea y se firma el jwt
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // firma de token
        jwt.sign(payload, process.env.SECRET_ENIGMA, {
            expiresIn: 10000 // 1 hora
        }, (error, token) => {
            if(error) throw error;
            // mensaje de confirmacion
            res.json({ token: token})
        });



     } catch (error) {
         console.log(error);
         res.status(400).send('Hubo un error');         
     }
}