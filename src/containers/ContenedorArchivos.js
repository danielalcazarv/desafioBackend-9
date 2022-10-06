import { promises as fs } from "fs";

export class ContenedorArchivos {
    constructor(archivo){
        this.archivo = archivo
    };

    async listarAll () {
        try{
            const contenido = await fs.readFile(this.archivo,'utf-8');
            return JSON.parse(contenido);
        }
        catch (error){
            console.log('Error al leer archivo. Tipo de error: ' + error);
            return [];
        }
    };

    async guardar (objeto) {
        const objsCollection = await this.listarAll();
        const timestamp = new Date().toLocaleString();
        let newId;
        if (objsCollection.length == 0) {
            newId = 1;
        } else {
            newId = objsCollection[objsCollection.length - 1].id + 1;
        }
        const newObjeto = {id:newId, timestamp:timestamp, ...objeto};
        objsCollection.push(newObjeto);
        const objsJson = JSON.stringify(objsCollection);
        try {
            await fs.writeFile(this.archivo,objsJson);
            console.log("Guardado exitosamente!.");
        }
        catch (error){
            console.log("Error al guardar. Tipo de error: "+ error);
        }
    };

    async listar (id){
        try{
            const objsCollection = await this.listarAll();
            const idFiltrado = objsCollection.find(obj => obj.id === Number(id));
            if (idFiltrado===undefined){
                console.log("Contenido no encontrado.");
                const notFound = null;
                return notFound;
            }else{
                return idFiltrado;
            }
        }
        catch (error){
            console.log('No se encontró id. Tipo de error: ' + error);
        }
    };

    async borrar (id){
        try{
            const objsCollection = await this.listarAll();
            const objsCollectionFiltrado = objsCollection.filter(obj => obj.id!=Number(id));
            const objsJson = JSON.stringify(objsCollectionFiltrado);
            await fs.writeFile(this.archivo,objsJson);
            console.log("Producto eliminado.");
        }
        catch(error){
            console.log('No se pudo eliminar id. Tipo de error: ' + error);
        }
    };

    async borrarAll (){
        try{
            const arrVacio = "";
            await fs.writeFile(this.archivo,arrVacio);
            console.log("Se eliminó todo el contenido exitosamente!");
        }
        catch(error){
            console.log(error);
        }
    };

    async actualizar (id,obj){
        const objsCollection = await this.listarAll();
        const objsCollectionFiltrado = objsCollection.filter(obj => obj.id!=Number(id));
        const objTargetId = objsCollection.filter(obj => obj.id==Number(id));
        const timestamp = objTargetId[0].timestamp;
        const newProducto = {id:Number(id),timestamp:timestamp, ...obj};
        objsCollectionFiltrado.push(newProducto);
        const objsJson = JSON.stringify(objsCollectionFiltrado);
        try {
            await fs.writeFile(this.archivo,objsJson);
            console.log("Contenido actualizado.");
        }
        catch (error){
            console.log("Error al actualizar. Tipo de error: "+ error);
        }
    };
};