import ContenedorMongoDb from "../../containers/ContenedorMongoDb.js";

class MensajesDaoMongoDb extends ContenedorMongoDb {

    constructor(){
        super('mensajes',{
            author: {type: Array, required: true, default:[]},
            text: {type: Array, required: true, default:[]}
        })
    };
};

export default MensajesDaoMongoDb;