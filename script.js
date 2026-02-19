async function cargarAnimeDB() {
    try {
        console.log("Intentando leer db.json...");
        const respuesta = await fetch('db.json');
        
        if (!respuesta.ok) {
            throw new Error("No se pudo encontrar el archivo db.json");
        }

        const listaAnimes = await respuesta.json();
        console.log("Datos cargados correctamente:", listaAnimes);

        const catalogo = document.getElementById('anime-list');
        catalogo.innerHTML = ""; // Limpiar mensaje de carga

        listaAnimes.forEach(anime => {
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('anime-card');

            tarjeta.innerHTML = `
                <img src="${anime.poster}" alt="${anime.titulo}">
                <div class="card-info">
                    <h3>${anime.titulo}</h3>
                    <span>${anime.episodio}</span>
                </div>
            `;

            // EVENTO CLICK
            tarjeta.onclick = function() {
                console.log("Reproduciendo:", anime.titulo);
                const reproductor = document.getElementById('video-player');
                const tituloPrincipal = document.getElementById('current-title');

                // IMPORTANTE: Aquí asignamos la URL al iframe
                reproductor.src = anime.videoUrl;
                tituloPrincipal.innerText = anime.titulo + " - " + anime.episodio;

                window.scrollTo({ top: 0, behavior: 'smooth' });
            };

            catalogo.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("ERROR CRÍTICO:", error);
        document.getElementById('anime-list').innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', cargarAnimeDB);
