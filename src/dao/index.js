//Variable de entorno
import * as dotenv from 'dotenv';
dotenv.config();

let mensajesDao;

switch (process.env.PERS) {
    case 'mongoDb':
        const { default: MensajesDaoMongoDb } = await import ('./mensajes/MensajesDaoMongoDb.js');
        
        productosDao = new MensajesDaoMongoDb();
        break;
    case 'firebase':
        const { default: MensajesDaosFirebase } = await import ('./mensajes/MensajesDaoFirebase.js');
        
        productosDao = new MensajesDaosFirebase();
        break;
    default:
        const {default: MensajesDaoMemoria } = await import ('./mensajes/MensajesDaoArchivos.js');
        
        productosDao = new MensajesDaoMemoria();
        break;
};

export { mensajesDao }