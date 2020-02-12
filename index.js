const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
// Creo el servidor

const app = express(); 

conectarDB();

// Habilitar cors
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true }));


const PORT = process.env.PORT || 4000;

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/proyectos', require('./routes/proyectos')); 
app.use('/api/tareas', require('./routes/tareas')); 


app.listen(PORT, () => {
    console.log(`Server UP in PORT: ${PORT}`)
}); 