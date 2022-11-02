/******Modulos******/
import express from 'express';
import { fork } from 'child_process';
const routerRandoms = express.Router();
const forkedProcess = fork('./calculo-random.js')

/******Middleware******/
let valor;

//Valida si se ingresa query
async function validaQuery (req, res, next){
    if (req.query.cant == undefined){
        valor = 1e9;
    }else{
        valor=Number(req.query.cant);
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
        res.status(400).json(msj);
    }
}

/******Rutas******/
routerRandoms.get('/', validaQuery, validaTypeNumber, notZero, async (req, res)=>{
    const unaQuery = valor;

    res.status(200).send('el valor del query: '+unaQuery)
});



export default routerRandoms;