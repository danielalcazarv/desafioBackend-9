import * as dotenv from 'dotenv';
dotenv.config()
import path from 'path';
import {fileURLToPath} from 'url';
const firebaseKey = JSON.parse(process.env.FIRESTORE_JSON_KEY);

//Solucion a __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    fileSystem: {
        path:'./db'
    },
    mongoDb: {
        cnxStr: 'mongodb://localhost:27017/ecommerce',
        options: {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            serverSelectionTimeoutMS: 5000,
        }
    },
    firebase: firebaseKey,
    mariaDb: {
        db: {
            client: 'mysql',
            connection: {
                host: '127.0.0.1',
                user: 'dalcazar',
                password: 'dalcazar',
                database: 'ecommerce'
            }
        }
    },
};

