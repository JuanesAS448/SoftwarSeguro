class UsuariosController{
    construct(){
    }
 
     async consultarDetalle(req,res){
 
        try{
            const admin = require('./firebaseAdmin');
            let iden = req.query.iden;
            const userDoc = await admin.firestore().collection('users').doc(iden).get();
 
            if (!userDoc.exists) {
                return res.status(404).json({ error: 'Usuario no encontrado:' + iden  });
            }
 
            // Obtener los datos del documento
            const userData = userDoc.data();
 
            return res.status(200).json(userData);
        }catch (err){
            res.status(500).send(err.message);
        }
     }
 
    async ingresar(req,res){
        try{
            const admin = require('./firebaseAdmin');
            /*
            const {dni,nombre,apellidos,email} = req.body;
            console.log ("Documento de identidad:... " + dni);
            console.log ("Nombres con apellidos:" + nombre + " " + apellidos);
            console.log ("email: "+ email);
            */
            //Asignando nombre del documento
            //const docRef = await admin.firestore().collection('users').doc("user654").set(req.body);
            //Adicionando con nombre de documento asignado dinámicamente
            const docRef = await admin.firestore().collection('users').add(req.body);
            res.status(200).send ("Usuario agregado");
        }catch (err){
            res.status(500).send(err.message);
        }
    }
}
module.exports = new UsuariosController();