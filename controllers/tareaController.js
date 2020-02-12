
const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Projecto');
const {validationResult} = require('express-validator');

// Crea un nueva tarea
exports.crearTarea = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }    

    try {
        // Extraer el proycto y comprobar si existe
        const { proyecto } = req.body;
        
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto){
            return res.status(404).json({msg: 'proyecto no encontrado'});
            
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No estas autorizado para crear tareas en el proyecto'})
        }

        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea})
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

exports.obtenerTareas = async (req, res) => {
    
    try {
        // extraigo el proyecto
        const { proyecto } = req.query;
        
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto){
            return res.status(404).json({msg: 'proyecto no encontrado'});
            
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No estas autorizado para crear tareas en el proyecto'})
        }

        // Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas });
        
    } catch (error) {
        console.log(error)
        return res.status(500).send('Hubo un error');
    }
}

exports.actualizarTarea = async (req, res) => {
    try {
        // extraigo el proyecto
        const { proyecto, nombre, estado } = req.body;
        
        // si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);
        if( !tarea ){
            return res.status(404).json({msg: 'No existe la tarea'})
        }
        // extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No estas autorizado para crear tareas en el proyecto'})
        }

        // Crar un objeto con la nueva info
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;        
        nuevaTarea.estado = estado;
        

        // Guardar tarea
        tarea = await Tarea.findByIdAndUpdate({_id : req.params.id}, nuevaTarea, {new: true});
        res.json({tarea})



    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error');
    }    
}

exports.eliminarTarea = async (req, res) => {
    try {
        // extraigo el proyecto
        const { proyecto, nombre, estado } = req.query;
        
        // si la tarea existe o no
        let tarea = await Tarea.findById(req.params.id);
        if( !tarea ){
            return res.status(404).json({msg: 'No existe la tarea'})
        }
        // extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No estas autorizado para crear tareas en el proyecto'})
        }

        // eliminar tarea
        await Tarea.findByIdAndRemove({_id : req.params.id});
        res.json({msg : 'Tarea eliminada'});


    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error');
    }    
}