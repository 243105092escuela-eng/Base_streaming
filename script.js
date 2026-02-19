// --- 1. LÓGICA DE USUARIOS Y REGISTRO ---

// Función para registrar un nuevo usuario y guardarlo en la lista
function registrarUsuario() {
    const nombreInput = document.getElementById('user-input');
    const nombre = nombreInput.value.trim();
    
    if (nombre !== "") {
        // 1. Obtener lista de usuarios previa o crear una nueva
        let usuarios = JSON.parse(localStorage.getItem('beatflow_users_list')) || [];
        
        // 2. Agregar el nombre a la lista si no existe ya
        if (!usuarios.includes(nombre)) {
            usuarios.push(nombre);
            localStorage.setItem('beatflow_users_list', JSON.stringify(usuarios));
        }

        // 3. Establecer como usuario actual
        localStorage.setItem('beatflow_current_user', nombre);
        
        mostrarInterfazUsuario(nombre);
        actualizarListaPublica();
    } else {
        alert("Por favor, ingresa un nombre para continuar.");
    }
}

// Muestra la tarjeta superior y oculta el modal
function mostrarInterfazUsuario(nombre) {
    const modal = document.getElementById('register-modal');
    const userCard = document.getElementById('user-card');
    const displayName = document.getElementById('display-name');

    if(modal) modal.style.display = 'none';
    if(userCard) userCard.style.display = 'flex';
    if(displayName) displayName.innerText = nombre;
}

// Cierra la sesión borrando solo al usuario "activo"
function cerrarSesion() {
    localStorage.removeItem('beatflow_current_user');
    window.location.reload();
}

// Muestra los nombres de todos los que se han registrado en esa PC
function actualizarListaPublica() {
    const listaDiv = document.getElementById('user-list');
    const usuarios = JSON.parse(localStorage.getItem('beatflow_users_list')) || [];
    
    if (listaDiv) {
        if (usuarios.length > 0) {
            listaDiv.innerHTML = usuarios.map(u => 
                `<span class="user-tag">${u}</span>`
            ).join("");
        } else {
            listaDiv.innerHTML = "<p style='color: #666; font-size: 0.8rem;'>No hay oyentes registrados aún.</p>";
        }
    }
}


// --- 2. LÓGICA DE CARGA DE MÚSICA (JSON) ---

async function cargarMusica() {
    const catalogo = document.getElementById('anime-list');
    const reproductor = document.getElementById('video-player');
    const tituloPrincipal = document.getElementById('current-title');

    try {
        // El punto y la diagonal (./) aseguran que busque en la misma carpeta del repositorio
        const res = await fetch('./db.json');
        
        if (!res.ok) throw new Error("No se pudo cargar el archivo db.json");

        const canciones = await res.json();
        catalogo.innerHTML = ""; // Limpiar mensaje de carga

        canciones.forEach(track => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'anime-card';
            tarjeta.innerHTML = `
                <img src="${track.poster}" alt="${track.titulo}">
                <div class="card-info">
                    <strong>${track.titulo}</strong><br>
                    <small>${track.episodio}</small>
                </div>
            `;

            // Al hacer clic, se activa el video con Autoplay
            tarjeta.onclick = () => {
                reproductor.src = track.videoUrl + "?autoplay=1&mute=0&rel=0";
                tituloPrincipal.innerText = `Escuchando: ${track.titulo}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };

            catalogo.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Error en cargarMusica:", error);
        if (catalogo) {
            catalogo.innerHTML = `<p style="color:red; grid-column: 1/-1;">Error: No se pudieron cargar las estaciones de música. Revisa tu db.json.</p>`;
        }
    }
}


// --- 3. ARRANQUE DE LA APP ---

document.addEventListener('DOMContentLoaded', () => {
    // A. Verificar si ya hay una sesión activa
    const usuarioActual = localStorage.getItem('beatflow_current_user');
    if (usuarioActual) {
        mostrarInterfazUsuario(usuarioActual);
    }

    // B. Renderizar la lista de usuarios conocidos
    actualizarListaPublica();
    
    // C. Cargar los datos del JSON
    cargarMusica();
});
