const admin = require('firebase-admin');
require('dotenv').config();

let db;

try {
    // Verificar que las variables de entorno necesarias estén presentes
    const requiredEnvVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_PRIVATE_KEY', 'FIREBASE_CLIENT_EMAIL'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingEnvVars.length > 0) {
        throw new Error(`Faltan las siguientes variables de entorno: ${missingEnvVars.join(', ')}`);
    }

    // Inicialización de Firebase Admin
    const firebaseConfig = {
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Asegurarse de que la clave privada esté formateada correctamente
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
    };

    // Inicializar Firebase solo si no está ya inicializado
    if (!admin.apps.length) {
        admin.initializeApp(firebaseConfig);
    }

    // Obtener la referencia a Firestore
    db = admin.firestore();

    // Configurar ajustes de Firestore (opcional)
    db.settings({
        timestampsInSnapshots: true,
        ignoreUndefinedProperties: true
    });

    console.log('Firebase inicializado correctamente');
} catch (error) {
    console.error('Error al inicializar Firebase:', error);
    throw error;
}

module.exports = { admin, db }; 