/******Modulos******/
import express from 'express';
import { fork } from 'child_process';
import { logger } from "../utils/log/logger.config.js";

const routerRandoms = express.Router();
const forkedProcess = fork('./calculo-random.js');

/******Middleware******/
let valor;

//Valida si se ingresa query
async function validaQuery (req, res, next){
    if (req.query.cant == undefined){
        valor = 1e8;
        logger.info(`Cantidad de números procesados ${valor}`);
    }else{
        valor=Number(req.query.cant);
        logger.info(`Cantidad de números procesados ${valor}`);
    }
    next();
};

//Valida que el query sea un número no NaN
async function validaTypeNumber (req, res, next){
    if (typeof valor ==='number' && !Number.isNaN(valor)) {
        next();
    }else{
        const msj = {
            error:400,
            descripcion:`Bad request. Query no es un número. Ruta: ${req.baseUrl}/${req.query.cant} || Método: ${req.method}`};
        logger.error(`Parámetro ingresado no es un número. Parámetro ingresado:${req.query.cant} `);
        res.status(400).json(msj);
    }
};

//Valida que el query no sea cero o menor a cero
async function notZero (req, res, next){
    if (valor > 0){
        next();
    }else{
        const msj = {
            error:400,
            descripcion:`Bad request. Número ingresado debe ser mayor a cero. Ruta: ${req.baseUrl}/${req.query.cant} || Método: ${req.method}`};
            logger.error(`Número ingresado debe ser mayor a cero. Parámetro ingresado:${req.query.cant}`);
        res.status(400).json(msj);
    }
}

/******Rutas******/
//Solucionado a 1e8 -> a  5e8 sigue crasheando el calculo pero no bloquea (funciona como debería????)
routerRandoms.get('/', validaQuery, validaTypeNumber, notZero, async (req, res)=>{
    const queryNumber = valor;
    forkedProcess.send(queryNumber);
    forkedProcess.on('message', resultado =>{
    //Web Socket -> Mostrar Cálculo
        req.io.on('connection', async (socket)=>{
        socket.emit('randoms', resultado);
        });
    })
    res.render('api-randoms')
});


export default routerRandoms;