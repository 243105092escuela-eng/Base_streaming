async function cargarAnimeDB() {
    const catalogo = document.getElementById('anime-list');
    
    try {
        const respuesta = await fetch('db.json');
        
        // Si el archivo no existe o no carga, usamos datos de respaldo manuales
        let listaAnimes;
        if (!respuesta.ok) {
            console.warn("No se detectó db.json, cargando modo de prueba local.");
            listaAnimes = [
                {
                    "titulo": "Prueba: Chainsaw Man",
                    "episodio": "Trailer",
                    "poster": "https://www.crunchyroll.com/imgsrv/display/thumbnail/480x720/catalog/crunchyroll/922742d10348d4b3f025fbc0734005ba.jpe",
                    "videoUrl": "https://www.youtube.com/embed/v4yLeN6G69s"
                }
            ];
        } else {
            listaAnimes = await respuesta.json();
        }

        catalogo.innerHTML = ""; 

        listaAnimes.forEach(anime => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'anime-card';
            tarjeta.innerHTML = `
                <img src="${anime.poster}" alt="${anime.titulo}">
                <div class="card-info">
                    <h3>${anime.titulo}</h3>
                    <span>${anime.episodio}</span>
                </div>
            `;

            tarjeta.onclick = () => {
                document.getElementById('video-player').src = anime.videoUrl;
                document.getElementById('current-title').innerText = anime.titulo;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };

            catalogo.appendChild(tarjeta);
        });

    } catch (e) {
        catalogo.innerHTML = "<p>Error cargando datos. Asegúrate de que db.json existe.</p>";
    }
}

document.addEventListener('DOMContentLoaded', cargarAnimeDB);
