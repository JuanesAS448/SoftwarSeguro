const { db } = require('../config/firebase-config');

class Usuario {
    constructor(dni, nombre, apellidos, email) {
        this.dni = dni;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.createdAt = new Date();
    }

    // Guardar usuario
    async guardar() {
        try {
            const docRef = db.collection('usuarios').doc(this.dni);
            await docRef.set({
                dni: this.dni,
                nombre: this.nombre,
                apellidos: this.apellidos,
                email: this.email,
                createdAt: this.createdAt,
                nombreBusqueda: this.nombre.toLowerCase(),
                apellidosBusqueda: this.apellidos.toLowerCase()
            });
            return { success: true, message: 'Usuario guardado exitosamente' };
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            throw new Error('Error al guardar el usuario');
        }
    }

    // Buscar usuario por DNI
    static async buscarPorDNI(dni) {
        try {
            const docRef = db.collection('usuarios').doc(dni);
            const doc = await docRef.get();
            
            if (!doc.exists) {
                throw new Error('Usuario no encontrado');
            }
            
            return doc.data();
        } catch (error) {
            console.error('Error al buscar usuario:', error);
            throw error;
        }
    }

    // Listar usuarios con paginación
    static async listarUsuarios(pagina = 1, limite = 10) {
        try {
            const offset = (pagina - 1) * limite;
            const snapshot = await db.collection('usuarios')
                .orderBy('createdAt', 'desc')
                .limit(limite)
                .offset(offset)
                .get();

            const usuarios = snapshot.docs.map(doc => doc.data());
            
            // Obtener el total de usuarios para la paginación
            const totalSnapshot = await db.collection('usuarios').count().get();
            const total = totalSnapshot.data().count;

            return {
                usuarios,
                paginacion: {
                    pagina,
                    limite,
                    total,
                    totalPaginas: Math.ceil(total / limite)
                }
            };
        } catch (error) {
            console.error('Error al listar usuarios:', error);
            throw new Error('Error al obtener la lista de usuarios');
        }
    }

    // Buscar usuarios por nombre o apellidos
    static async buscarUsuarios(termino, pagina = 1, limite = 10) {
        try {
            const terminoBusqueda = termino.toLowerCase();
            const offset = (pagina - 1) * limite;

            // Búsqueda por nombre o apellidos
            const snapshot = await db.collection('usuarios')
                .where('nombreBusqueda', '>=', terminoBusqueda)
                .where('nombreBusqueda', '<=', terminoBusqueda + '\uf8ff')
                .orderBy('nombreBusqueda')
                .limit(limite)
                .offset(offset)
                .get();

            const usuarios = snapshot.docs.map(doc => doc.data());

            // Contar resultados totales
            const totalSnapshot = await db.collection('usuarios')
                .where('nombreBusqueda', '>=', terminoBusqueda)
                .where('nombreBusqueda', '<=', terminoBusqueda + '\uf8ff')
                .count()
                .get();

            const total = totalSnapshot.data().count;

            return {
                usuarios,
                paginacion: {
                    pagina,
                    limite,
                    total,
                    totalPaginas: Math.ceil(total / limite)
                }
            };
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            throw new Error('Error al buscar usuarios');
        }
    }

    // Actualizar usuario
    static async actualizar(dni, datos) {
        try {
            const docRef = db.collection('usuarios').doc(dni);
            const actualizacion = {
                ...datos,
                updatedAt: new Date()
            };

            if (datos.nombre) {
                actualizacion.nombreBusqueda = datos.nombre.toLowerCase();
            }
            if (datos.apellidos) {
                actualizacion.apellidosBusqueda = datos.apellidos.toLowerCase();
            }

            await docRef.update(actualizacion);
            return { success: true, message: 'Usuario actualizado exitosamente' };
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw new Error('Error al actualizar el usuario');
        }
    }

    // Eliminar usuario
    static async eliminar(dni) {
        try {
            const docRef = db.collection('usuarios').doc(dni);
            await docRef.delete();
            return { success: true, message: 'Usuario eliminado exitosamente' };
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            throw new Error('Error al eliminar el usuario');
        }
    }
} 