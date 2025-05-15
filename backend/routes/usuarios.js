const express = require('express');
const router = express.Router();
const Usuario = require('../modelo/Usuario');

// Middleware para validar DNI
const validarDNI = (req, res, next) => {
    const dni = req.params.dni || req.body.dni;
    if (!dni || !/^\d+$/.test(dni)) {
        return res.status(400).json({ error: 'DNI inválido' });
    }
    next();
};

// Crear nuevo usuario
router.post('/', validarDNI, async (req, res) => {
    try {
        const { dni, nombre, apellidos, email } = req.body;
        const usuario = new Usuario(dni, nombre, apellidos, email);
        const resultado = await usuario.guardar();
        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener usuario por DNI
router.get('/:dni', validarDNI, async (req, res) => {
    try {
        const usuario = await Usuario.buscarPorDNI(req.params.dni);
        res.json(usuario);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Listar todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.listarTodos();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar usuario
router.put('/:dni', validarDNI, async (req, res) => {
    try {
        const resultado = await Usuario.actualizar(req.params.dni, req.body);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar usuario
router.delete('/:dni', validarDNI, async (req, res) => {
    try {
        const resultado = await Usuario.eliminar(req.params.dni);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 