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
import session from "express-session";
import connectMongo from 'connect-mongo';
import * as dotenv from 'dotenv';
dotenv.config();

//Persistencia session MongoDb Atlas
const MongoStore = connectMongo.create({
    mongoUrl: process.env.MONGODB_ATLAS_URL,
    ttl: 600
})

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

/******Middlewares******/
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.use('/api', express.static('./public'));
app.use('/login', express.static('./public'));
app.use(morgan('dev'));

//Session Setup
app.use(session({
    store:MongoStore,
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
}));

//Session Auth
function auth (req, res, next) {
    if (req.session.user){
        return next()
    }
    return res.render('forbidden.hbs')
}

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
app.get('/', auth, (req,res)=>{
    const usuario = req.session.user;
    res.render('main', {test:false, firstname: usuario})
});

app.get('/api/productos-test', auth, (req,res)=>{
    const productos = apiProductos.almacenar(apiProductos.generarProducto())
    const usuario = req.session.user;
    res.render('main', {test:true , api:productos, firstname: usuario})
});

app.get('/login', (req,res)=>{
    res.render('login.hbs')
});

app.post('/login', (req,res)=>{
    const userName = req.body.usuario;
    req.session.user = userName;
    res.redirect('/');
});

app.get('/logout', (req,res)=>{
    const usuario = req.session.user;
    req.session.destroy(err=>{
        if (err){
            res.json({err});
        }else{
            res.render('logout.hbs', {firstname: usuario})
        }
    })
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
const PORT = process.env.PORT;
const server = httpServer.listen(PORT, ()=>{
    console.log('Tu servidor esta corriendo en el puerto http://localhost:' + PORT);
});
