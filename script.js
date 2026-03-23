// --- 1. LÓGICA DE USUARIOS Y REGISTRO ---

let editIndex = null;

function registrarUsuario() {
    const nombreInput = document.getElementById('user-input');
    const nombre = nombreInput.value.trim();

    if (nombre !== "") {
        let usuarios = JSON.parse(localStorage.getItem('beatflow_users_list')) || [];

        if (!usuarios.includes(nombre)) {
            usuarios.push(nombre);
            localStorage.setItem('beatflow_users_list', JSON.stringify(usuarios));
        }

        localStorage.setItem('beatflow_current_user', nombre);
        mostrarInterfazUsuario(nombre);
        actualizarListaPublica();
    } else {
        alert("Por favor, ingresa un nombre para continuar.");
    }
}

function mostrarInterfazUsuario(nombre) {
    const modal       = document.getElementById('register-modal');
    const userCard    = document.getElementById('user-card');
    const displayName = document.getElementById('display-name');

    if (modal)        modal.style.display = 'none';
    if (userCard)     userCard.style.display = 'flex';
    if (displayName)  displayName.innerText = nombre;
}

function cerrarSesion() {
    localStorage.removeItem('beatflow_current_user');
    window.location.reload();
}

// --- 2. LISTA DE USUARIOS CON EDITAR / ELIMINAR ---

function actualizarListaPublica() {
    const listaDiv = document.getElementById('user-list');
    const usuarios = JSON.parse(localStorage.getItem('beatflow_users_list')) || [];

    if (!listaDiv) return;

    if (usuarios.length > 0) {
        listaDiv.innerHTML = usuarios.map((u, i) => `
            <span class="user-tag">
                ${u}
                <button onclick="editarUsuario(${i})" style="background:none;border:none;cursor:pointer;color:#bc13fe;font-size:0.75rem;padding:0 2px;" title="Editar">✏️</button>
                <button onclick="eliminarUsuario(${i})" style="background:none;border:none;cursor:pointer;color:#ff4444;font-size:0.75rem;padding:0 2px;" title="Eliminar">✕</button>
            </span>
        `).join('');
    } else {
        listaDiv.innerHTML = "<p style='color: #666; font-size: 0.8rem;'>No hay oyentes registrados aún.</p>";
    }
}

function eliminarUsuario(index) {
    let usuarios = JSON.parse(localStorage.getItem('beatflow_users_list')) || [];
    const nombre = usuarios[index];
    usuarios.splice(index, 1);
    localStorage.setItem('beatflow_users_list', JSON.stringify(usuarios));

    // Si elimina al usuario activo, ocultar la tarjeta
    if (localStorage.getItem('beatflow_current_user') === nombre) {
        localStorage.removeItem('beatflow_current_user');
        const userCard = document.getElementById('user-card');
        if (userCard) userCard.style.display = 'none';
    }

    actualizarListaPublica();
}

function editarUsuario(index) {
    let usuarios = JSON.parse(localStorage.getItem('beatflow_users_list')) || [];
    const nuevoNombre = prompt("Editar nombre:", usuarios[index]);
    if (nuevoNombre === null || nuevoNombre.trim() === '') return;

    const nombreAnterior = usuarios[index];
    usuarios[index] = nuevoNombre.trim();
    localStorage.setItem('beatflow_users_list', JSON.stringify(usuarios));

    // Si editó al usuario activo, actualizar la tarjeta
    if (localStorage.getItem('beatflow_current_user') === nombreAnterior) {
        localStorage.setItem('beatflow_current_user', nuevoNombre.trim());
        const displayName = document.getElementById('display-name');
        if (displayName) displayName.innerText = nuevoNombre.trim();
    }

    actualizarListaPublica();
}

// --- 3. LÓGICA DE CARGA DE MÚSICA (JSON) ---

async function cargarMusica() {
    const catalogo        = document.getElementById('anime-list');
    const reproductor     = document.getElementById('video-player');
    const tituloPrincipal = document.getElementById('current-title');

    try {
        const res = await fetch('./db.json');
        if (!res.ok) throw new Error("No se pudo cargar el archivo db.json");

        const canciones = await res.json();
        catalogo.innerHTML = "";

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

// --- 4. ARRANQUE ---

document.addEventListener('DOMContentLoaded', () => {
    const usuarioActual = localStorage.getItem('beatflow_current_user');
    if (usuarioActual) {
        const modal = document.getElementById('register-modal');
        if (modal) modal.style.display = 'none';
        mostrarInterfazUsuario(usuarioActual);
    }

    actualizarListaPublica();
    cargarMusica();
});
