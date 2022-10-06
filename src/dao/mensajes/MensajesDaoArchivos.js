import ContenedorArchivos from "../../containers/ContenedorArchivos.js";

class MensajesDaoArchivos extends ContenedorArchivos {

    constructor(){
        super('./db/mensajes.json');
    };

    async guardar(chat = {author: [], text: [] }){
        return super.guardar(chat);
    };
};

export default MensajesDaoArchivos;