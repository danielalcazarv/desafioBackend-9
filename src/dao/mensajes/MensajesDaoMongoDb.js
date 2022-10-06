import ContenedorMongoDb from "../../containers/ContenedorMongoDb.js";

class MensajesDaoMongoDb extends ContenedorMongoDb {

    constructor(){
        super('mensajes',{
            author: {type: Object, required: true},
            text: {type: Object, required: true}
        })
    };
};

export default MensajesDaoMongoDb;