import ContenedorMongoDb from "../../containers/ContenedorMongoDb.js";

class UsuariosDaoMongoDb extends ContenedorMongoDb {

    constructor(){
        super('usuarios',{
            username: {type: String, required: true},
            password: {type: String, required: true},
            nombre: {type: String, required: true},
            telefono: {type:Number, required: true}
        })
    };
};

export default UsuariosDaoMongoDb;