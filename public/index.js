//Inicializa Socket.io
const socket = io();

/****Normalizr*****/
//Desnormalizar
const schAuthor = new normalizr.schema.Entity('author', {}, {idAttribute:'id'});
const schMensaje = new normalizr.schema.Entity('post', {author: schAuthor}, {idAttribute: 'id'});
const schMensajes = new normalizr.schema.Entity('posts', {mensajes: [schMensaje] }, {idAttribute: 'id'});


/**Chat**/
//Mostrat % de compresion
function renderCompresion(data){
    const html = `<p class='fw-bold'>Compresión ${data}%</p>`
    document.getElementById('compresion').innerHTML = html;
}

//Mostrar Chat
function renderChat(data){
    const html = data.map((mensaje, index)=>{
        return(`
        <div class='d-flex flex-row'>
            <div class="pb-2 pe-3">
                <img src=${mensaje.author.avatar} class="img-thumbnail" style="max-width: 60px ;" alt="Foto de ${mensaje.author.alias}">
            </div>
            <p class='pt-3 pe-3 text-primary fw-bold'>${mensaje.author.alias}</p>
            <p class='pt-3 pe-1 timestamp'>[${mensaje.text.time}]</p>
            <p class='pt-3 pe-3 text-success fst-italic'>: ${mensaje.text.mensaje}</p>
        </div>
        `);
    }).join('');
    document.getElementById('mensajes').innerHTML = html;
}

socket.on('mensajes', data =>{
    //tamaño normalizado
    let dataSize = JSON.stringify(data).length;
    //datos denormalizados 
    let dataDenorm = normalizr.denormalize(data.result, schMensajes, data.entities);
    //tamaño desnormalizado aka
    let dataDenormSize = JSON.stringify(dataDenorm).length;
    //calculo % de compresion
    let porcentaje = parseInt((dataSize * 100) / dataDenormSize);

    const html = dataDenorm.mensajes;
    renderCompresion(porcentaje)
    renderChat(html)
} )

//Ingresar mensaje
function addMsg(e){
    const timestamp = new Date().toLocaleString();
    const emailInput = document.getElementById('email');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const edadInput = document.getElementById('edad');
    const aliasInput = document.getElementById('alias');
    const urlAvatarInput = document.getElementById('url');
    const msjInput = document.getElementById('mensaje');
    const mensaje = {
        author:{
            id: emailInput.value,
            nombre: nombreInput.value,
            apellido: apellidoInput.value,
            edad: edadInput.value,
            alias: aliasInput.value,
            avatar: urlAvatarInput.value,
            
        },
        text:{
            mensaje: msjInput.value,
            time : timestamp
        }
    };
    socket.emit('new-mensaje', mensaje);
    msjInput.value='';
    return false;
}