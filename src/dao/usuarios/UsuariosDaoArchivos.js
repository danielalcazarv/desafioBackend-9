import {ContenedorArchivos} from "../../containers/ContenedorArchivos.js";

class UsuariosDaoArchivos extends ContenedorArchivos {

    constructor() {
        super('./db/usuarios.json')
    }
};

export default UsuariosDaoArchivos;