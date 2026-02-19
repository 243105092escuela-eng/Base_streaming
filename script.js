// 1. LÓGICA DE REGISTRO MEJORADA
function registrarUsuario() {
    const nombre = document.getElementById('user-input').value.trim();
    
    if (nombre !== "") {
        // Obtenemos la lista actual de usuarios o creamos una vacía si no existe
        let usuarios = JSON.parse(localStorage.getItem('beatflow_users_list')) || [];
        
        // Agregamos el nuevo nombre si no está ya en la lista
        if (!usuarios.includes(nombre)) {
            usuarios.push(nombre);
            localStorage.setItem('beatflow_users_list', JSON.stringify(usuarios));
        }

        // Guardamos quién es el usuario actual
        localStorage.setItem('beatflow_current_user', nombre);
        
        mostrarInterfazUsuario(nombre);
        actualizarListaPublica();
    } else {
        alert("Por favor, ingresa tu nombre.");
    }
}

function mostrarInterfazUsuario(nombre) {
    document.getElementById('register-modal').style.display = 'none';
    const userCard = document.getElementById('user-card');
    userCard.style.display = 'flex';
    document.getElementById('display-name').innerText = nombre;
}

// 2. FUNCIÓN PARA MOSTRAR TODOS LOS USUARIOS
function actualizarListaPublica() {
    const listaDiv = document.getElementById('user-list');
    const usuarios = JSON.parse(localStorage.getItem('beatflow_users_list')) || [];
    
    if (usuarios.length > 0) {
        listaDiv.innerHTML = usuarios.map(u => 
            `<span style="background: #222; padding: 5px 12px; border-radius: 15px; border: 1px solid #444;">${u}</span>`
        ).join("");
    } else {
        listaDiv.innerHTML = "No hay usuarios registrados aún.";
    }
}

function cerrarSesion() {
    localStorage.removeItem('beatflow_current_user');
    window.location.reload();
}

// 3. INICIO
document.addEventListener('DOMContentLoaded', () => {
    // Verificar usuario actual
    const usuarioActual = localStorage.getItem('beatflow_current_user');
    if (usuarioActual) {
        mostrarInterfazUsuario(usuarioActual);
    }

    // Cargar lista de todos los usuarios
    actualizarListaPublica();
    
    // Cargar la música (tu función existente)
    cargarMusica();
});
