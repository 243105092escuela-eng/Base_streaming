// Función principal para cargar la base de datos de música
async function cargarMusica() {
    const catalogo = document.getElementById('anime-list'); // Seguimos usando este ID de tu HTML
    const status = document.getElementById('status');
    const reproductor = document.getElementById('video-player');
    const tituloPrincipal = document.getElementById('current-title');

    // URL de tu base de datos en GitHub (puedes usar './db.json' si prefieres)
    const URL_DATABASE = "./db.json";

    try {
        const res = await fetch(URL_DATABASE);
        
        if (!res.ok) throw new Error("No se pudo conectar con la base de datos musical");

        const canciones = await res.json();
        
        // Limpiamos el mensaje de carga
        if (status) status.style.display = 'none';
        catalogo.innerHTML = ""; 

        canciones.forEach(track => {
            // Creamos la tarjeta de la estación/canción
            const tarjeta = document.createElement('div');
            tarjeta.className = 'anime-card'; // Mantenemos la clase de tus estilos
            
            tarjeta.innerHTML = `
                <img src="${track.poster}" alt="${track.titulo}" loading="lazy">
                <div class="card-info">
                    <strong>${track.titulo}</strong><br>
                    <small style="color: #888;">${track.episodio}</small>
                </div>
            `;

            // EVENTO AL HACER CLIC
            tarjeta.onclick = () => {
                // INTEGRACIÓN DE LA LÍNEA SOLICITADA:
                // Añadimos "?autoplay=1&mute=0" para que intente reproducir solo al cambiar
                reproductor.src = track.videoUrl + "?autoplay=1&mute=0";
                
                // Actualizamos el título en la pantalla
                tituloPrincipal.innerText = `Escuchando: ${track.titulo}`;

                // Efecto de scroll hacia el reproductor
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };

            catalogo.appendChild(tarjeta);
        });

        console.log("¡Streaming de música listo!");

    } catch (error) {
        console.error("Error:", error);
        catalogo.innerHTML = `<p style="color:red; padding: 20px;">Error al cargar la música. Revisa tu archivo db.json.</p>`;
    }
}

// Iniciar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', cargarMusica);
