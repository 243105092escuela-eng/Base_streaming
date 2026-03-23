// --- 1. LÓGICA DE USUARIOS Y REGISTRO ---

// Clave usada en el storage compartido
const STORAGE_KEY_USERS = 'beatflow_users_list';

// Función para registrar un nuevo usuario
async function registrarUsuario() {
    const nombreInput = document.getElementById('user-input');
    const nombre = nombreInput.value.trim();

    if (nombre !== "") {
        // 1. Obtener lista compartida actual
        let usuarios = await obtenerUsuariosCompartidos();

        // 2. Agregar si no existe
        if (!usuarios.includes(nombre)) {
            usuarios.push(nombre);
            await guardarUsuariosCompartidos(usuarios);
        }

        // 3. Guardar sesión local (solo para esta pestaña/dispositivo)
        localStorage.setItem('beatflow_current_user', nombre);

        mostrarInterfazUsuario(nombre);
        await actualizarListaPublica();
    } else {
        alert("Por favor, ingresa un nombre para continuar.");
    }
}

// Muestra la tarjeta superior y oculta el modal
function mostrarInterfazUsuario(nombre) {
    const modal = document.getElementById('register-modal');
    const userCard = document.getElementById('user-card');
    const displayName = document.getElementById('display-name');

    if (modal) modal.style.display = 'none';
    if (userCard) userCard.style.display = 'flex';
    if (displayName) displayName.innerText = nombre;
}

// Cierra sesión local (no borra de la lista pública compartida)
function cerrarSesion() {
    localStorage.removeItem('beatflow_current_user');
    window.location.reload();
}


// --- 2. STORAGE COMPARTIDO ---

// Lee la lista de usuarios desde el storage compartido
async function obtenerUsuariosCompartidos() {
    try {
        const result = await window.storage.get(STORAGE_KEY_USERS, true); // shared = true
        return result ? JSON.parse(result.value) : [];
    } catch {
        return [];
    }
}

// Guarda la lista de usuarios en el storage compartido
async function guardarUsuariosCompartidos(usuarios) {
    try {
        await window.storage.set(STORAGE_KEY_USERS, JSON.stringify(usuarios), true); // shared = true
    } catch (err) {
        console.error("Error al guardar usuarios compartidos:", err);
    }
}

// Renderiza la lista pública de oyentes (desde storage compartido)
async function actualizarListaPublica() {
    const listaDiv = document.getElementById('user-list');
    if (!listaDiv) return;

    const usuarios = await obtenerUsuariosCompartidos();

    if (usuarios.length > 0) {
        listaDiv.innerHTML = usuarios.map(u =>
            `<span class="user-tag">${u}</span>`
        ).join("");
    } else {
        listaDiv.innerHTML = "<p style='color: #666; font-size: 0.8rem;'>No hay oyentes registrados aún.</p>";
    }
}


// --- 3. LÓGICA DE CARGA DE MÚSICA (JSON) ---

async function cargarMusica() {
    const catalogo = document.getElementById('anime-list');
    const reproductor = document.getElementById('video-player');
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
                <div class="card-info" style="padding: 10px;">
                    <strong style="color: #fff; font-size: 0.9rem;">${track.titulo}</strong><br>
                    <small style="color: #888;">${track.episodio}</small>
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


// --- 4. ARRANQUE DE LA APP ---

document.addEventListener('DOMContentLoaded', async () => {
    // A. Ocultar modal de inmediato si ya hay sesión (evita flash)
    const usuarioActual = localStorage.getItem('beatflow_current_user');
    if (usuarioActual) {
        const modal = document.getElementById('register-modal');
        if (modal) modal.style.display = 'none';
        mostrarInterfazUsuario(usuarioActual);
    }

    // B. Cargar lista compartida de oyentes
    await actualizarListaPublica();

    // C. Cargar música
    cargarMusica();
});
