//Inicializa Socket.io
const socket = io();

/**Chat**/
//Mostrar Chat
function renderChat(data){
    const html = data.map((mensaje, index)=>{
        return(`
        <div class='d-flex flex-row'>
            <p class='pe-3 text-primary fw-bold'>${mensaje.author.alias}</p>
            <p class='pe-1 timestamp'>[${mensaje.text.time}]</p>
            <p class='pe-3 text-success fst-italic'>: ${mensaje.text.mensaje}</p>
        </div>
        `);
    }).join('');
    document.getElementById('mensajes').innerHTML = html;
}

socket.on('mensajes', function(data){
    renderChat(data);
});

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