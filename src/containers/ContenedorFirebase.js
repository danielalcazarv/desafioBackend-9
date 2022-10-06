import { query } from "express";
import admin from "firebase-admin";
import config from "../../src/utils/config.js";

admin.initializeApp({
    credential: admin.credential.cert(config.firebase),
    databaseURL:"https://ecommerce-backend-2641d.firebaseio.com"
});

const db = admin.firestore();

class ContenedorFirebase {
    constructor(nombreColeccion){
        this.coleccion = db.collection(nombreColeccion)
    };

    async listarAll (){
        try {
            const result = [];
            const querySnapshot = await this.coleccion.get();
            querySnapshot.forEach(doc => {
                result.push({id: doc.id, ...doc.data()})
            });
            return result;
        } catch (error) {
            console.log('Error al leer archivo. Tipo de error: ' + error);
        }
    };

    async guardar (objeto){
        try {
            const obj = await this.coleccion.add(objeto);
            return {...obj, id: obj.id};
        } catch (error) {
            console.log("Error al guardar. Tipo de error: "+ error);
        }
    };

    async listar (id){
        try {
            const doc = await this.coleccion.doc(id).get();
            const data = doc.data();
            return {...data, id};
        } catch (error) {
            console.log('No se encontró id. Tipo de error: ' + error);
        }
    };

    async borrar (id){
        try {
            const doc = await this.coleccion.doc(id).delete();
            return doc;
        } catch (error) {
            console.log('No se pudo eliminar id. Tipo de error: ' + error);
        }
    };

    async actualizar (id, obj){
        try {
            const docMod = await this.coleccion.doc(id).update(obj);
            return docMod
        } catch (error) {
            console.log("Error al actualizar. Tipo de error: "+ error);
        }
    };
}

export default ContenedorFirebase;