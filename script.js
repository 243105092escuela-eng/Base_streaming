// Función para cargar los datos del JSON
async function loadAnime() {
    try {
        // Buscamos el archivo db.json en la misma carpeta
        const response = await fetch('db.json');
        const animes = await response.json();
        
        const listContainer = document.getElementById('anime-list');
        
        animes.forEach(anime => {
            // Crear el elemento visual para cada anime
            const card = document.createElement('div');
            card.classList.add('anime-card');
            card.innerHTML = `
                <img src="${anime.poster}" alt="${anime.titulo}">
                <h3>${anime.titulo} - ${anime.episodio}</h3>
            `;
            
            // Evento para cambiar el video al hacer clic
            card.onclick = () => {
                document.getElementById('video-player').src = anime.videoUrl;
                document.getElementById('current-title').innerText = `${anime.titulo} - ${anime.episodio}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            };
            
            listContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error cargando la base de datos:", error);
    }
}

// Iniciar la carga al abrir la página
loadAnime();
