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
import { 
        mensajesDao as mensajesApi,
        usuariosDao as usuariosApi
    } from './src/dao/index.js';
import { schema, normalize } from 'normalizr'
import session from "express-session";
import connectMongo from 'connect-mongo';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

import passport from "passport";
import { Strategy } from "passport-local";
const LocalStrategy = Strategy;

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

//Passport
passport.use( new LocalStrategy(
    async function (username, password, done){
        const usuariosDb = await usuariosApi.listarAll()
        const existeUsuario = usuariosDb.find(x=>x.username == username);
        
        if (!existeUsuario) {
            return done(null, false);
        } else {
            const match = await verifyPass(existeUsuario, password);
            if (!match){
                return done(null, false);
            }
            return done(null, existeUsuario);
        }
    }
));

passport.serializeUser((usuario, done)=>{
    done(null, usuario.username);
});

passport.deserializeUser(async (username, done)=>{
    const usuariosDb = await usuariosApi.listarAll()
    const existeUsuario = usuariosDb.find(x=>x.username == username);
    done(null, existeUsuario);
});

//Session Setup Mongo Atlas
app.use(session({
    store:MongoStore,
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
}));

//Session Auth
function auth(req, res, next) {
    if(req.isAuthenticated()){
        next()
    } else {
        res.redirect('/login')
    }
};

app.use(passport.initialize());
app.use(passport.session());

//Métodos de Auth
async function generateHashPassword(password){
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
};

async function verifyPass(usuario, password) {
    const match = await bcrypt.compare(password, usuario.password);
    return match;
};


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
    const usuario = req.user.nombre;
    const email = req.user.username;
    res.render('main', {test:false, firstname: usuario, correo:email});
});

app.get('/api/productos-test', auth, (req,res)=>{
    const productos = apiProductos.almacenar(apiProductos.generarProducto());
    const usuario = req.user.nombre;
    const email = req.user.username;
    res.render('main', {test:true , api:productos, firstname: usuario, correo:email});
});

//Rutas de login y registro
app.get('/login', (req,res)=>{
    res.render('login');
});

app.get('/login-error', (req,res)=>{
    res.render('login-error');
});

app.post('/login', passport.authenticate('local',  {successRedirect: '/', failureRedirect: '/login-error'}, ));

app.get('/registro', (req,res)=>{
    res.render('registro');
});

app.get('/registro-error', (req,res)=>{
    res.render('registro-error');
});

app.post('/registro', async (req,res)=>{
    const { username, password, nombre, telefono } = req.body;
    const usuariosDb = await usuariosApi.listarAll();
    const existeUsuario = usuariosDb.find(x=>x.username == username);

    if(existeUsuario){
        res.render('registro-error')
    }else {
        const usuarioNuevo = {username, password: await generateHashPassword(password), nombre, telefono};
        usuariosApi.guardar(usuarioNuevo);
        res.redirect('/login');
    }
});

app.get('/logout', (req, res)=> {
    const usuario = req.user.nombre;
    req.logOut(err => {
        res.render('logout.hbs', {firstname: usuario})
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
});

/******Servidor******/
const PORT = process.env.PORT;
const server = httpServer.listen(PORT, ()=>{
    console.log('Tu servidor esta corriendo en el puerto http://localhost:' + PORT);
});
