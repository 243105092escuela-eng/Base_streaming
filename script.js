// 1. LÓGICA DE REGISTRO DE IDENTIDAD
function registrarUsuario() {
    const nombre = document.getElementById('user-input').value;
    if (nombre.trim() !== "") {
        localStorage.setItem('beatflow_user', nombre);
        mostrarInterfazUsuario(nombre);
    } else {
        alert("Por favor, ingresa tu nombre.");
    }
}

function mostrarInterfazUsuario(nombre) {
    document.getElementById('register-modal').style.display = 'none';
    document.getElementById('user-card').style.display = 'flex';
    document.getElementById('display-name').innerText = nombre;
}

// 2. LÓGICA DE STREAMING DE MÚSICA
async function cargarMusica() {
    const catalogo = document.getElementById('anime-list');
    const reproductor = document.getElementById('video-player');
    const tituloPrincipal = document.getElementById('current-title');

    try {
        const res = await fetch('./db.json');
        if (!res.ok) throw new Error("No se encontró db.json");
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
                // Autoplay integrado + mute=0 para sonido activo
                reproductor.src = track.videoUrl + "?autoplay=1&mute=0&rel=0";
                tituloPrincipal.innerText = `Escuchando: ${track.titulo}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };

            catalogo.appendChild(tarjeta);
        });

    } catch (error) {
        catalogo.innerHTML = `<p style="color:red;">Error al cargar datos.</p>`;
    }
}

// 3. INICIO AUTOMÁTICO
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya hay nombre registrado
    const usuario = localStorage.getItem('beatflow_user');
    if (usuario) {
        mostrarInterfazUsuario(usuario);
    }

    // Cargar la música
    cargarMusica();
});
