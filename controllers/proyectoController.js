const Proyecto = require('../models/Projecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) =>{

    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({errores: errores.array()})
    }


    try {
        // Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        // Guardar el proyecto via jwt
        proyecto.creador = req.usuario.id;
        proyecto.save();
        res.json(proyecto);
    
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

// Obtiene todos los proyectos del usuario actual

exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador : req.usuario.id }).sort({ creado : -1 });
        res.json({ proyectos })
    } catch (error) {
        console.log(error)
        res.status(500).send("Hubo un error al obtener los proyectos")
    }
}

// Actualizar un proyecto

exports.actualizarProyecto = async (req, res) => {
    const errores = validationResult(req);
    if( !errores.isEmpty() ){
        return res.status(400).json({errores: errores.array()})
    }

    // extraer la info del proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if( nombre ){
        nuevoProyecto.nombre = nombre;
    }
    try {
        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);
        
        // si el proyecto existe o no
        if( ! proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }        

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No estas autorizado para modificar el proyecto'})
        }

        // actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true })

        res.json({proyecto})

        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al actualizar proyecto")
    }
}

// Elminar un proyecto
exports.eliminarProyecto = async (req, res) => {
    try {
        let proyecto = await Proyecto.findById(req.params.id);
        
        // si el proyecto existe o no
        if( ! proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }        

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No estas autorizado para eliminar el proyecto'})
        }

        // Eliminar el proyecto
        await Proyecto.findOneAndRemove({_id : req.params.id})
        res.json({ msg: 'Proyecto eliminado '})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Error al eliminar proyecto'})
    }
}