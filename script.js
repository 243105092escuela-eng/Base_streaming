// Función principal para obtener los datos del JSON y mostrarlos
async function cargarAnimeDB() {
    try {
        // 1. Buscamos el archivo db.json (asegúrate de que estén en la misma carpeta)
        const respuesta = await fetch('db.json');
        
        // Convertimos la respuesta a un formato que JS entienda (objeto)
        const listaAnimes = await respuesta.json();

        // 2. Seleccionamos el contenedor donde se mostrarán las portadas
        const catalogo = document.getElementById('anime-list');
        
        // Limpiamos el catálogo por si acaso hay algo escrito
        catalogo.innerHTML = "";

        // 3. Recorremos cada anime de nuestra "base de datos"
        listaAnimes.forEach(anime => {
            // Creamos el elemento visual de la tarjeta
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('anime-card');

            // Le inyectamos el HTML con la imagen y el título
            tarjeta.innerHTML = `
                <img src="${anime.poster}" alt="${anime.titulo}" loading="lazy">
                <div class="card-info">
                    <h3>${anime.titulo}</h3>
                    <span>${anime.episodio}</span>
                </div>
            `;

            // 4. Agregamos el evento de CLICK para reproducir el video
            tarjeta.addEventListener('click', () => {
                // Cambiamos el src del iframe por el videoUrl del JSON
                const reproductor = document.getElementById('video-player');
                const tituloPrincipal = document.getElementById('current-title');

                reproductor.src = anime.videoUrl;
                tituloPrincipal.innerText = `${anime.titulo} - ${anime.episodio}`;

                // Efecto visual: subir al reproductor automáticamente
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Agregamos la tarjeta al catálogo
            catalogo.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Hubo un error cargando el catálogo de anime:", error);
        document.getElementById('anime-list').innerHTML = "<p>Error al cargar los videos. Intenta de nuevo más tarde.</p>";
    }
}

// Llamamos a la función cuando la página esté lista
document.addEventListener('DOMContentLoaded', cargarAnimeDB);
