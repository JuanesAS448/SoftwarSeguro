const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { db } = require('../../backend/config/firebase-config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Validar DNI
const validarDNI = (req, res, next) => {
    const dni = req.params.dni || req.body.dni;
    if (!dni || !/^\d+$/.test(dni)) {
        return res.status(400).json({ error: 'DNI inválido' });
    }
    next();
};

// Crear usuario
app.post('/', validarDNI, async (req, res) => {
    try {
        const { dni, nombre, apellidos, email } = req.body;
        const docRef = db.collection('usuarios').doc(dni);
        
        await docRef.set({
            dni,
            nombre,
            apellidos,
            email,
            createdAt: new Date()
        });
        
        res.status(201).json({ message: 'Usuario guardado exitosamente' });
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        res.status(500).json({ error: 'Error al guardar el usuario' });
    }
});

// Obtener usuario por DNI
app.get('/:dni', validarDNI, async (req, res) => {
    try {
        const docRef = db.collection('usuarios').doc(req.params.dni);
        const doc = await docRef.get();
        
        if (!doc.exists) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(doc.data());
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        res.status(500).json({ error: 'Error al buscar el usuario' });
    }
});

// Listar usuarios con paginación y búsqueda
app.get('/', async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 10;
        const buscar = req.query.buscar;
        
        let query = db.collection('usuarios');
        
        if (buscar) {
            query = query.where('nombre', '>=', buscar)
                        .where('nombre', '<=', buscar + '\uf8ff');
        }
        
        const snapshot = await query.limit(limite)
                                  .offset((pagina - 1) * limite)
                                  .get();
        
        const usuarios = snapshot.docs.map(doc => doc.data());
        const total = (await query.count().get()).data().count;
        
        res.json({
            usuarios,
            paginacion: {
                pagina,
                limite,
                total,
                totalPaginas: Math.ceil(total / limite)
            }
        });
    } catch (error) {
        console.error('Error al listar usuarios:', error);
        res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
    }
});

// Actualizar usuario
app.put('/:dni', validarDNI, async (req, res) => {
    try {
        const docRef = db.collection('usuarios').doc(req.params.dni);
        await docRef.update({
            ...req.body,
            updatedAt: new Date()
        });
        
        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
});

// Eliminar usuario
app.delete('/:dni', validarDNI, async (req, res) => {
    try {
        const docRef = db.collection('usuarios').doc(req.params.dni);
        await docRef.delete();
        
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

// Exportar la función serverless
module.exports.handler = serverless(app);