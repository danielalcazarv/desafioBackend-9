import mongoose from "mongoose";
import config from "../utils/config.js";
import {asPOJO, renameField} from "../utils/objectUtils.js";

await mongoose.connect (config.mongoDb.cnxStr, config.mongoDb.options);

class ContenedorMongoDb {
    constructor(nombreColeccion, esquema){
        this.coleccion = mongoose.model(nombreColeccion,esquema)
    };

    async listarAll (){
        try {
            const docs = await this.coleccion.find({});
            return docs;
        } catch (error) {
            console.log('Error al leer archivo. Tipo de error: ' + error);
        }
    };

    async guardar (objeto){
        try {
            const doc = await this.coleccion.create(objeto);
            return doc;
        } catch (error) {
            console.log("Error al guardar. Tipo de error: "+ error);
        }
    };

    async listar (id){
        try {
            const doc = await this.coleccion.find({_id:id},{__v:0});
            const result = renameField(asPOJO(doc[0]),'_id', 'id');
            return result;
        } catch (error) {
            console.log('No se encontró id. Tipo de error: ' + error);
        }
    };

    async borrar (id){
        try {
            await this.coleccion.deleteOne({_id:id});
            console.log("Producto eliminado.");
        } catch (error) {
            console.log('No se pudo eliminar id. Tipo de error: ' + error);
        }
    };

    async borrarAll(){
        try {
            await this.coleccion.deleteMany({});
            console.log("Se eliminó todo el contenido exitosamente!");
        } catch (error) {
            console.log(error);
        }
    };

    async actualizar(id,obj){
        try {
            await this.coleccion.updateOne({_id:id}, {$set: obj})
            console.log("Contenido actualizado.");
        } catch (error) {
            console.log("Error al actualizar. Tipo de error: "+ error);
        }
    };
};

export default ContenedorMongoDb;