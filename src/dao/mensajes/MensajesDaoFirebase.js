import ContenedorFirebase from "../../containers/ContenedorFirebase.js";

class MensajesDaoFirebase extends ContenedorFirebase {

    constructor(){
        super('mensajes')
    };

    async guardar(chat ={author: [], text: [] } ) {
        return super.guardar(chat)
    };
};

export default MensajesDaoFirebase;