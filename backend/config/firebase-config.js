const admin = require('firebase-admin');
require('dotenv').config();

// Inicialización de Firebase Admin
const firebaseConfig = {
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
};

// Inicializar Firebase
admin.initializeApp(firebaseConfig);

// Obtener la referencia a Firestore
const db = admin.firestore();

module.exports = { admin, db }; 