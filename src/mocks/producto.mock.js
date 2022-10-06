import ContenedorMemoria from "../containers/contenedorMemoria.js";
import { generarProducto } from "../utils/generarDatos.js";

export class ProductoMock extends ContenedorMemoria {
    constructor(){
        super()
    }

    generarProducto( cant = 5){
        let listProds = [];
        for ( let index = 1; index <=cant; index++){
            listProds.push(generarProducto())
        }
        return listProds;
    }

    almacenar(listaProds){
        for (const elemento of listaProds){
            let newId = 0;
            if (this.elementos.length == 0){
                newId = 1;
            }else{
                newId = this.elementos[this.elementos.length-1].id + 1
            }
            this.elementos.push({id: newId, ...elemento})
        }
        return listaProds;
    }
}