/******Modulos******/
import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import { createServer } from "http";
import { Server } from "socket.io";
import morgan from 'morgan';
import handlebars from 'express-handlebars';
const apiProductos = new ProductoMock();
import { ProductoMock } from './src/mocks/producto.mock.js';
import { mensajesDao as mensajesApi } from './src/dao/index.js';
import { schema, normalize } from 'normalizr'

//Solucion a __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Instancia de servidor
const app = express();
const httpServer = createServer(app);
const io = new Server (httpServer);

/****Normalizr*****/
//Normalizar
const schAuthor = new schema.Entity('author',{}, {idAttribute:'id'});
const schMensaje = new schema.Entity('post', {author: schAuthor}, {idAttribute: 'id'});
const schMensajes = new schema.Entity('posts', {mensajes: [schMensaje] }, {idAttribute: 'id'});

const normalizrMensajes = (msjsId) => normalize(msjsId, schMensajes);

/******Middleware******/
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.use('/api', express.static('./public'));
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
    const productos = apiProductos.almacenar(apiProductos.generarProducto())
    res.render('main', {test:true , api:productos})
});

/******Web Socket******/
//Chat
io.on('connection', async (socket)=>{
    const mensajes = await mensajesApi.listarAll()
    const normalizados = normalizrMensajes({id:'mensajes', mensajes})
    socket.emit('mensajes', normalizados);

    socket.on('new-mensaje', data =>{
        mensajesApi.guardar(data);
        io.sockets.emit('mensajes', normalizados);
    });
})

/******Servidor******/
const PORT = 3000;
const server = httpServer.listen(PORT, ()=>{
    console.log('Tu servidor esta corriendo en el puerto http://localhost:' + PORT);
});
