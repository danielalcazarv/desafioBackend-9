/******Modulos******/
import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import { createServer } from "http";
import { Server } from "socket.io";
import morgan from 'morgan';
import handlebars from 'express-handlebars';
import { ProductoMock } from './src/mocks/producto.mock.js';



//Solucion a __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Instancia de servidor
const app = express();
const httpServer = createServer(app);
const io = new Server (httpServer);

/******Middleware******/
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.use(morgan('dev'));

//Motores de plantillas
//HBS
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname +'/src/views/layouts',
    partialsDir: __dirname +'/src/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views','./src/views');

/******Rutas******/
app.get('/', (req,res)=>{
    res.render('main', {test:false})
});

app.get('/api/productos-test', (req,res)=>{
    const apiProductos = new ProductoMock();
    const productos = apiProductos.almacenar(apiProductos.generarProducto())
    res.render('main', {test:true , api:productos})
});

/******Servidor******/
const PORT = 3000;
const server = httpServer.listen(PORT, ()=>{
    console.log('Tu servidor esta corriendo en el puerto http://localhost:' + PORT);
});

/******Web Socket******/

