//Variable de entorno
import * as dotenv from 'dotenv';
dotenv.config();

let mensajesDao;
let usuariosDao;

switch (process.env.PERS) {
    case 'mongoDb':
        const { default: MensajesDaoMongoDb } = await import ('./mensajes/MensajesDaoMongoDb.js');
        const { default: UsuariosDaoMongoDb } = await import ('./usuarios/UsuariosDaoMongoDb.js');

        mensajesDao = new MensajesDaoMongoDb();
        usuariosDao = new UsuariosDaoMongoDb();
        break;
    case 'firebase':
        const { default: MensajesDaosFirebase } = await import ('./mensajes/MensajesDaoFirebase.js');
        
        mensajesDao = new MensajesDaosFirebase();
        break;
    default:
        const {default: MensajesDaoMemoria } = await import ('./mensajes/MensajesDaoArchivos.js');
        const { default: UsuariosDaoArchivos } = await import ('./usuarios/UsuariosDaoArchivos.js');

        mensajesDao = new MensajesDaoMemoria();
        usuariosDao = new UsuariosDaoArchivos();
        break;
};

export { mensajesDao, usuariosDao }